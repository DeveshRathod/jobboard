import django_filters
from .models import Job


class JobFilter(django_filters.FilterSet):
    job_type = django_filters.CharFilter(field_name='job_type')
    experience_level = django_filters.CharFilter(field_name='experience_level')
    category = django_filters.CharFilter(field_name='category__slug')
    location = django_filters.CharFilter(field_name='location', lookup_expr='icontains')
    is_remote = django_filters.BooleanFilter(field_name='is_remote')
    salary_min = django_filters.NumberFilter(field_name='salary_min', lookup_expr='gte')
    salary_max = django_filters.NumberFilter(field_name='salary_max', lookup_expr='lte')
    employer = django_filters.NumberFilter(field_name='employer__id')

    class Meta:
        model = Job
        fields = ['job_type', 'experience_level', 'category', 'location', 'is_remote', 'salary_min', 'salary_max']
