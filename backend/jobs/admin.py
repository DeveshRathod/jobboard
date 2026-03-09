from django.contrib import admin
from .models import Job, Application, SavedJob, Category


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ['title', 'company_name', 'employer', 'job_type', 'status', 'created_at']
    list_filter = ['status', 'job_type', 'experience_level', 'category']
    search_fields = ['title', 'company_name', 'employer__email']
    readonly_fields = ['views_count', 'created_at', 'updated_at', 'slug']


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ['applicant', 'job', 'status', 'created_at']
    list_filter = ['status']
    search_fields = ['applicant__email', 'job__title']


admin.site.register(SavedJob)
