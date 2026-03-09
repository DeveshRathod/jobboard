from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    icon = models.CharField(max_length=50, blank=True)

    class Meta:
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.name


class Job(models.Model):
    TYPE_CHOICES = [
        ('full-time', 'Full Time'),
        ('part-time', 'Part Time'),
        ('contract', 'Contract'),
        ('freelance', 'Freelance'),
        ('internship', 'Internship'),
        ('remote', 'Remote'),
    ]

    EXPERIENCE_CHOICES = [
        ('entry', 'Entry Level'),
        ('mid', 'Mid Level'),
        ('senior', 'Senior Level'),
        ('lead', 'Lead / Manager'),
        ('executive', 'Executive'),
    ]

    STATUS_CHOICES = [
        ('open', 'Open'),
        ('closed', 'Closed'),
        ('draft', 'Draft'),
    ]

    employer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='jobs_posted')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='jobs')

    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField()
    requirements = models.TextField()
    responsibilities = models.TextField(blank=True)
    benefits = models.TextField(blank=True)

    company_name = models.CharField(max_length=200)
    company_logo = models.ImageField(upload_to='company_logos/', blank=True, null=True)
    company_website = models.URLField(blank=True)
    company_description = models.TextField(blank=True)

    location = models.CharField(max_length=200)
    is_remote = models.BooleanField(default=False)
    job_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='full-time')
    experience_level = models.CharField(max_length=20, choices=EXPERIENCE_CHOICES, default='mid')

    salary_min = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    salary_max = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    salary_currency = models.CharField(max_length=10, default='USD')
    show_salary = models.BooleanField(default=True)

    skills = models.JSONField(default=list, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    deadline = models.DateField(null=True, blank=True)
    views_count = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} at {self.company_name}"

    def save(self, *args, **kwargs):
        if not self.slug:
            from django.utils.text import slugify
            import uuid
            self.slug = slugify(self.title) + '-' + str(uuid.uuid4())[:8]
        super().save(*args, **kwargs)

    @property
    def application_count(self):
        return self.applications.count()


class Application(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('reviewing', 'Reviewing'),
        ('shortlisted', 'Shortlisted'),
        ('interviewed', 'Interviewed'),
        ('offered', 'Offered'),
        ('rejected', 'Rejected'),
        ('withdrawn', 'Withdrawn'),
    ]

    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    applicant = models.ForeignKey(User, on_delete=models.CASCADE, related_name='applications')

    cover_letter = models.TextField()
    resume = models.FileField(upload_to='application_resumes/', blank=True, null=True)
    portfolio_url = models.URLField(blank=True)
    expected_salary = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    employer_notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['job', 'applicant']
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.applicant.email} → {self.job.title}"


class SavedJob(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='saved_jobs')
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='saved_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'job']

    def __str__(self):
        return f"{self.user.email} saved {self.job.title}"
