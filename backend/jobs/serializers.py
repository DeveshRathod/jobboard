from rest_framework import serializers
from .models import Job, Application, SavedJob, Category
from accounts.serializers import PublicUserSerializer


class CategorySerializer(serializers.ModelSerializer):
    job_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'icon', 'job_count']

    def get_job_count(self, obj):
        return obj.jobs.filter(status='open').count()


class JobListSerializer(serializers.ModelSerializer):
    employer = PublicUserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True, required=False
    )
    application_count = serializers.ReadOnlyField()
    is_saved = serializers.SerializerMethodField()
    has_applied = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = [
            'id', 'title', 'slug', 'employer', 'category', 'category_id',
            'company_name', 'company_logo', 'company_website',
            'location', 'is_remote', 'job_type', 'experience_level',
            'salary_min', 'salary_max', 'salary_currency', 'show_salary',
            'skills', 'status', 'deadline', 'views_count',
            'application_count', 'is_saved', 'has_applied',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'slug', 'employer', 'views_count', 'created_at', 'updated_at']

    def get_is_saved(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return SavedJob.objects.filter(user=request.user, job=obj).exists()
        return False

    def get_has_applied(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Application.objects.filter(applicant=request.user, job=obj).exists()
        return False


class JobDetailSerializer(JobListSerializer):
    class Meta(JobListSerializer.Meta):
        fields = JobListSerializer.Meta.fields + [
            'description', 'requirements', 'responsibilities',
            'benefits', 'company_description'
        ]


class JobCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = [
            'title', 'description', 'requirements', 'responsibilities', 'benefits',
            'category', 'company_name', 'company_logo', 'company_website', 'company_description',
            'location', 'is_remote', 'job_type', 'experience_level',
            'salary_min', 'salary_max', 'salary_currency', 'show_salary',
            'skills', 'status', 'deadline'
        ]


class ApplicationSerializer(serializers.ModelSerializer):
    applicant = PublicUserSerializer(read_only=True)
    job = JobListSerializer(read_only=True)
    job_id = serializers.PrimaryKeyRelatedField(
        queryset=Job.objects.all(), source='job', write_only=True
    )

    class Meta:
        model = Application
        fields = [
            'id', 'job', 'job_id', 'applicant', 'cover_letter',
            'resume', 'portfolio_url', 'expected_salary',
            'status', 'employer_notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'applicant', 'status', 'employer_notes', 'created_at', 'updated_at']


class ApplicationStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ['status', 'employer_notes']


class SavedJobSerializer(serializers.ModelSerializer):
    job = JobListSerializer(read_only=True)

    class Meta:
        model = SavedJob
        fields = ['id', 'job', 'created_at']
