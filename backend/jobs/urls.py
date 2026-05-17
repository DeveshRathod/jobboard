from django.urls import path
from .views import (
    CategoryListView, JobListCreateView, JobDetailView, MyJobsView,
    ApplicationListCreateView, ApplicationDetailView, JobApplicationsView,
    SavedJobListView, ToggleSaveJobView, JobStatsView
)

urlpatterns = [
    path('', JobListCreateView.as_view(), name='job-list-create'),
    path('stats/', JobStatsView.as_view(), name='job-stats'),
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('my-jobs/', MyJobsView.as_view(), name='my-jobs'),
    path('saved/', SavedJobListView.as_view(), name='saved-jobs'),
    path('<slug:slug>/', JobDetailView.as_view(), name='job-detail'),
    path('<slug:slug>/applications/', JobApplicationsView.as_view(), name='job-applications'),
    path('<slug:slug>/save/', ToggleSaveJobView.as_view(), name='toggle-save'),
    path('applications/all/', ApplicationListCreateView.as_view(), name='application-list-create'),
    path('applications/<int:pk>/', ApplicationDetailView.as_view(), name='application-detail'),
]
