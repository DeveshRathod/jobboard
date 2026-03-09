from rest_framework import generics, permissions, status, filters
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from .models import Job, Application, SavedJob, Category
from .serializers import (
    JobListSerializer, JobDetailSerializer, JobCreateUpdateSerializer,
    ApplicationSerializer, ApplicationStatusSerializer, SavedJobSerializer,
    CategorySerializer
)
from .filters import JobFilter


class IsEmployer(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'employer'


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        owner = getattr(obj, 'employer', getattr(obj, 'applicant', None))
        return owner == request.user


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]


class JobListCreateView(generics.ListCreateAPIView):
    queryset = Job.objects.filter(status='open').select_related('employer', 'category')
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = JobFilter
    search_fields = ['title', 'company_name', 'description', 'skills']
    ordering_fields = ['created_at', 'salary_min', 'views_count']

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return JobCreateUpdateSerializer
        return JobListSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsEmployer()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        qs = Job.objects.select_related('employer', 'category')
        if self.request.user.is_authenticated and self.request.user.role == 'employer':
            # employers can see their own drafts too
            return qs
        return qs.filter(status='open')

    def perform_create(self, serializer):
        serializer.save(employer=self.request.user, company_name=self.request.user.company_name or serializer.validated_data.get('company_name', ''))


class JobDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Job.objects.all()
    lookup_field = 'slug'
    permission_classes = [IsOwnerOrReadOnly]

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return JobCreateUpdateSerializer
        return JobDetailSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.views_count += 1
        instance.save(update_fields=['views_count'])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class MyJobsView(generics.ListAPIView):
    serializer_class = JobListSerializer
    permission_classes = [IsEmployer]

    def get_queryset(self):
        return Job.objects.filter(employer=self.request.user).select_related('category')


class ApplicationListCreateView(generics.ListCreateAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'employer':
            return Application.objects.filter(job__employer=user).select_related('applicant', 'job')
        return Application.objects.filter(applicant=user).select_related('job', 'job__employer')

    def perform_create(self, serializer):
        job = serializer.validated_data['job']
        if Application.objects.filter(job=job, applicant=self.request.user).exists():
            from rest_framework.exceptions import ValidationError
            raise ValidationError('You have already applied to this job.')
        if self.request.user.role != 'jobseeker':
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('Only job seekers can apply.')
        serializer.save(applicant=self.request.user)


class JobApplicationsView(generics.ListAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        job_slug = self.kwargs['slug']
        job = Job.objects.get(slug=job_slug, employer=self.request.user)
        return Application.objects.filter(job=job).select_related('applicant')


class ApplicationDetailView(generics.RetrieveUpdateAPIView):
    queryset = Application.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        user = self.request.user
        if user.role == 'employer':
            return ApplicationStatusSerializer
        return ApplicationSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == 'employer':
            return Application.objects.filter(job__employer=user)
        return Application.objects.filter(applicant=user)


class SavedJobListView(generics.ListAPIView):
    serializer_class = SavedJobSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SavedJob.objects.filter(user=self.request.user).select_related('job')


class ToggleSaveJobView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, slug):
        try:
            job = Job.objects.get(slug=slug)
        except Job.DoesNotExist:
            return Response({'error': 'Job not found'}, status=status.HTTP_404_NOT_FOUND)

        saved, created = SavedJob.objects.get_or_create(user=request.user, job=job)
        if not created:
            saved.delete()
            return Response({'saved': False, 'message': 'Job removed from saved.'})
        return Response({'saved': True, 'message': 'Job saved successfully.'})


class JobStatsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        stats = {
            'total_jobs': Job.objects.filter(status='open').count(),
            'total_companies': Job.objects.filter(status='open').values('company_name').distinct().count(),
            'total_categories': Category.objects.count(),
            'job_types': {},
        }
        for jtype, label in Job.TYPE_CHOICES:
            stats['job_types'][jtype] = Job.objects.filter(status='open', job_type=jtype).count()
        return Response(stats)
