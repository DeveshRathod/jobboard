from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from jobs.models import Category, Job
import random

User = get_user_model()


class Command(BaseCommand):
    help = 'Seed the database with sample data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding database...')

        # Categories
        categories_data = [
            ('Engineering', 'engineering', '💻'),
            ('Design', 'design', '🎨'),
            ('Marketing', 'marketing', '📣'),
            ('Sales', 'sales', '💼'),
            ('Product', 'product', '📦'),
            ('Finance', 'finance', '💰'),
            ('HR', 'hr', '👥'),
            ('Data Science', 'data-science', '📊'),
        ]
        categories = []
        for name, slug, icon in categories_data:
            cat, _ = Category.objects.get_or_create(slug=slug, defaults={'name': name, 'icon': icon})
            categories.append(cat)
        self.stdout.write(f'  Created {len(categories)} categories')

        # Employer
        employer, _ = User.objects.get_or_create(
            email='employer@demo.com',
            defaults={
                'username': 'demoemployer',
                'role': 'employer',
                'company_name': 'TechCorp Inc',
                'first_name': 'Demo',
                'last_name': 'Employer',
                'is_active': True,
            }
        )
        if _:
            employer.set_password('demo1234')
            employer.save()

        # Job seeker
        seeker, _ = User.objects.get_or_create(
            email='seeker@demo.com',
            defaults={
                'username': 'demoseeker',
                'role': 'jobseeker',
                'first_name': 'Demo',
                'last_name': 'Seeker',
                'is_active': True,
            }
        )
        if _:
            seeker.set_password('demo1234')
            seeker.save()

        # Superuser
        if not User.objects.filter(email='admin@demo.com').exists():
            User.objects.create_superuser(
                username='admin',
                email='admin@demo.com',
                password='admin1234'
            )

        # Sample jobs
        sample_jobs = [
            {
                'title': 'Senior Full Stack Engineer',
                'category': categories[0],
                'job_type': 'full-time',
                'experience_level': 'senior',
                'description': 'We are looking for a talented Senior Full Stack Engineer to join our growing team. You will work on exciting projects using modern technologies.',
                'requirements': '5+ years of experience with React and Django or similar frameworks. Strong understanding of RESTful APIs. Experience with PostgreSQL and Redis.',
                'responsibilities': 'Lead technical design and implementation of new features. Mentor junior developers. Collaborate with product team.',
                'benefits': 'Competitive salary, remote work options, health insurance, equity package.',
                'location': 'San Francisco, CA',
                'salary_min': 130000,
                'salary_max': 180000,
                'skills': ['React', 'Django', 'PostgreSQL', 'Docker', 'AWS'],
            },
            {
                'title': 'Product Designer',
                'category': categories[1],
                'job_type': 'full-time',
                'experience_level': 'mid',
                'description': 'Join our design team to craft beautiful and intuitive user experiences for millions of users.',
                'requirements': '3+ years of product design experience. Proficiency in Figma. Portfolio demonstrating UX/UI work.',
                'responsibilities': 'Own design process from research to delivery. Create wireframes, prototypes, and high-fidelity designs.',
                'benefits': 'Flexible hours, design tools budget, 25 days PTO.',
                'location': 'New York, NY',
                'salary_min': 90000,
                'salary_max': 130000,
                'skills': ['Figma', 'UI/UX', 'Prototyping', 'User Research'],
            },
            {
                'title': 'Data Scientist',
                'category': categories[7],
                'job_type': 'full-time',
                'experience_level': 'senior',
                'description': 'We need a Data Scientist to extract insights from our vast data and build ML models that drive business decisions.',
                'requirements': 'PhD or Masters in relevant field. 4+ years industry experience. Expertise in Python, ML frameworks.',
                'responsibilities': 'Build and deploy machine learning models. Analyze data to find business insights. Work with engineering teams.',
                'benefits': 'Top compensation, GPU workstation, conference budget.',
                'location': 'Remote',
                'is_remote': True,
                'salary_min': 140000,
                'salary_max': 200000,
                'skills': ['Python', 'TensorFlow', 'PyTorch', 'SQL', 'Statistics'],
            },
            {
                'title': 'Growth Marketing Manager',
                'category': categories[2],
                'job_type': 'full-time',
                'experience_level': 'mid',
                'description': 'Drive user acquisition and retention through data-driven marketing strategies.',
                'requirements': '3+ years in growth or performance marketing. Experience with paid acquisition channels.',
                'responsibilities': 'Manage multi-channel campaigns. Optimize conversion funnels. Report on key metrics.',
                'benefits': 'Bonus structure, marketing tools budget.',
                'location': 'Austin, TX',
                'salary_min': 80000,
                'salary_max': 110000,
                'skills': ['SEO', 'SEM', 'Analytics', 'A/B Testing', 'Copywriting'],
            },
            {
                'title': 'Frontend React Developer',
                'category': categories[0],
                'job_type': 'contract',
                'experience_level': 'mid',
                'description': 'Contract role building performant React applications. 6-month contract with potential to extend.',
                'requirements': '3+ years React experience. TypeScript required. Familiarity with testing.',
                'responsibilities': 'Build and maintain React components. Write unit and integration tests.',
                'benefits': 'Competitive contract rate, flexible schedule.',
                'location': 'Remote',
                'is_remote': True,
                'salary_min': 70,
                'salary_max': 100,
                'skills': ['React', 'TypeScript', 'Jest', 'CSS-in-JS'],
            },
            {
                'title': 'Product Manager',
                'category': categories[4],
                'job_type': 'full-time',
                'experience_level': 'senior',
                'description': 'Lead product vision and roadmap for our core B2B platform serving 10k+ business customers.',
                'requirements': '5+ years PM experience, preferably in B2B SaaS. Strong analytical skills. Experience with agile.',
                'responsibilities': 'Define product strategy. Work with engineering and design. Launch new features.',
                'benefits': 'Stock options, great team culture, top benefits package.',
                'location': 'Seattle, WA',
                'salary_min': 150000,
                'salary_max': 190000,
                'skills': ['Product Strategy', 'Roadmapping', 'Agile', 'Analytics'],
            },
        ]

        count = 0
        for job_data in sample_jobs:
            if not Job.objects.filter(title=job_data['title'], employer=employer).exists():
                Job.objects.create(
                    employer=employer,
                    company_name='TechCorp Inc',
                    status='open',
                    **job_data
                )
                count += 1

        self.stdout.write(f'  Created {count} sample jobs')
        self.stdout.write(self.style.SUCCESS('\n✅ Database seeded successfully!'))
        self.stdout.write('\nDemo accounts:')
        self.stdout.write('  Employer: employer@demo.com / demo1234')
        self.stdout.write('  Job Seeker: seeker@demo.com / demo1234')
        self.stdout.write('  Admin: admin@demo.com / admin1234')
