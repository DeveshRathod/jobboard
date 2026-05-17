from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ['email', 'username', 'role', 'is_active', 'date_joined']
    list_filter = ['role', 'is_active']
    search_fields = ['email', 'username', 'company_name']
    fieldsets = UserAdmin.fieldsets + (
        ('Profile', {'fields': ('role', 'bio', 'location', 'phone', 'avatar', 'resume', 'linkedin_url')}),
        ('Company', {'fields': ('company_name', 'company_size', 'website')}),
    )
