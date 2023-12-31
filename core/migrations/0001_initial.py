# Generated by Django 4.0.6 on 2022-11-07 05:15

import core.models
from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='ClientDatatableView',
            fields=[
                ('unique_id', models.CharField(max_length=255, primary_key=True, serialize=False)),
                ('coach_id', models.IntegerField()),
                ('mode', models.BooleanField()),
                ('client_id', models.IntegerField()),
                ('complete_name', models.CharField(max_length=512)),
                ('first_name', models.CharField(max_length=255)),
                ('last_name', models.CharField(max_length=255)),
                ('company_name', models.CharField(max_length=255)),
                ('survey_status', models.CharField(max_length=10)),
                ('survey_report_status', models.CharField(max_length=80)),
                ('survey_report_sent_date', models.DateTimeField()),
                ('complete_survey_report_status', models.CharField(max_length=255)),
                ('profile_img', models.CharField(max_length=512)),
            ],
            options={
                'db_table': 'client_datatable_view',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('created_ts', models.DateTimeField(auto_now_add=True, verbose_name='Created Date')),
                ('updated_ts', models.DateTimeField(auto_now=True, verbose_name='Last Updated Date')),
                ('email', models.EmailField(max_length=254, unique=True, validators=[django.core.validators.EmailValidator()])),
                ('username', models.CharField(max_length=100, unique=True)),
                ('is_active', models.BooleanField(default=True)),
                ('is_staff', models.BooleanField(default=False)),
                ('is_admin', models.BooleanField(default=False)),
                ('is_superuser', models.BooleanField(blank=True, default=False, null=True)),
                ('user_type', models.CharField(choices=[('client', 'client'), ('coach', 'coach'), ('superuser', 'superuser')], default='client', max_length=40)),
                ('created_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='%(app_label)s_%(class)s_created_related', to=settings.AUTH_USER_MODEL)),
                ('updated_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='%(app_label)s_%(class)s_updated_related', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Clients',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.EmailField(max_length=254, validators=[django.core.validators.EmailValidator()])),
                ('first_name', models.CharField(blank=True, max_length=255, null=True)),
                ('last_name', models.CharField(blank=True, max_length=255, null=True)),
                ('phone', models.CharField(blank=True, max_length=255, null=True)),
                ('address', models.TextField(blank=True, null=True)),
                ('company_name', models.CharField(blank=True, max_length=255, null=True)),
                ('city', models.CharField(blank=True, max_length=255, null=True)),
                ('state', models.CharField(blank=True, max_length=255, null=True)),
                ('country', models.CharField(blank=True, max_length=255, null=True)),
                ('company_url', models.CharField(blank=True, max_length=255, null=True)),
                ('company_phone', models.CharField(blank=True, max_length=255, null=True)),
                ('title', models.CharField(blank=True, max_length=255, null=True)),
                ('company_email', models.EmailField(default=None, max_length=254, unique=True, validators=[django.core.validators.EmailValidator()])),
                ('company_address', models.TextField(blank=True, null=True)),
                ('zip', models.IntegerField(blank=True, null=True)),
                ('profile_img', models.FileField(default='static/images/theme/default.png', upload_to=core.models.user_client_directory_path)),
                ('intake_status', models.BooleanField(default=False)),
                ('mode', models.BooleanField(default=False)),
                ('queans1', models.CharField(blank=True, max_length=255, null=True)),
                ('queans2', models.CharField(blank=True, max_length=255, null=True)),
                ('queans3', models.CharField(blank=True, max_length=255, null=True)),
                ('queans4', models.CharField(blank=True, max_length=255, null=True)),
                ('queans5', models.CharField(blank=True, max_length=255, null=True)),
                ('queans6', models.CharField(blank=True, max_length=255, null=True)),
                ('queans7', models.CharField(blank=True, max_length=255, null=True)),
                ('queans8', models.CharField(blank=True, max_length=255, null=True)),
                ('queans9', models.CharField(blank=True, max_length=255, null=True)),
                ('queans10', models.CharField(blank=True, max_length=255, null=True)),
                ('queans11', models.CharField(blank=True, max_length=255, null=True)),
                ('queans12', models.CharField(blank=True, max_length=255, null=True)),
                ('queans13', models.CharField(blank=True, max_length=255, null=True)),
                ('queans14', models.CharField(blank=True, max_length=255, null=True)),
                ('queans15', models.CharField(blank=True, max_length=255, null=True)),
                ('queans16', models.CharField(blank=True, max_length=255, null=True)),
                ('queans17', models.CharField(blank=True, max_length=255, null=True)),
                ('queans18', models.CharField(blank=True, max_length=255, null=True)),
                ('queans19', models.CharField(blank=True, max_length=255, null=True)),
                ('queans20', models.CharField(blank=True, max_length=255, null=True)),
                ('queans21', models.CharField(blank=True, max_length=255, null=True)),
                ('queansfile', models.FileField(default='/images/theme/default.png', upload_to=core.models.user_client_queans_path)),
            ],
        ),
        migrations.CreateModel(
            name='Coaches',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(blank=True, max_length=30)),
                ('last_name', models.CharField(blank=True, max_length=30)),
                ('title', models.CharField(blank=True, max_length=255, null=True)),
                ('company_name', models.CharField(blank=True, max_length=255, null=True)),
                ('company_url', models.CharField(blank=True, max_length=255, null=True)),
                ('is_email_notify', models.BooleanField(default=True)),
                ('frontfootercolor', models.CharField(default='#d7de68', max_length=80)),
                ('color', models.CharField(default='#61c1b9', max_length=80)),
                ('paymentmode', models.CharField(default='Auto', max_length=30)),
                ('logo', models.FileField(blank=True, default=None, null=True, upload_to=core.models.user_directory_path)),
                ('skipplan', models.BooleanField(default=False)),
                ('user', models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Plan',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255, unique=True)),
                ('prizepersurvey', models.IntegerField()),
                ('noofsurvey', models.IntegerField(default=0)),
                ('monthlylicencefee', models.IntegerField(default=0)),
                ('annuallicencefee', models.IntegerField(default=0)),
                ('servicesinclude', models.TextField()),
                ('color', models.CharField(max_length=25)),
                ('mode', models.CharField(default='Yearly', max_length=30)),
            ],
        ),
        migrations.CreateModel(
            name='Relationship',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('relation', models.TextField(unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='SurveyUpgraded',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('totalfee', models.IntegerField()),
                ('persurveyprize', models.IntegerField()),
                ('noofsurvey', models.IntegerField()),
                ('created_ts', models.DateTimeField(auto_now_add=True, verbose_name='Created Date')),
                ('coach', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.coaches')),
            ],
        ),
        migrations.CreateModel(
            name='UserPlan',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_ts', models.DateTimeField(auto_now_add=True, verbose_name='Created Date')),
                ('coach', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.coaches')),
                ('plan', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.plan')),
            ],
        ),
        migrations.CreateModel(
            name='UserPlanInfo',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('totalfee', models.IntegerField()),
                ('persurveyprize', models.IntegerField()),
                ('annuallicencefee', models.IntegerField(default=0)),
                ('monthlylicencefee', models.IntegerField(default=0)),
                ('surveyused', models.IntegerField(default=0)),
                ('noofsurvey', models.IntegerField()),
                ('surveyupgraded', models.IntegerField(default=0)),
                ('servicesinclude', models.TextField()),
                ('title', models.CharField(max_length=255)),
                ('type', models.CharField(default='yearly', max_length=255)),
                ('created_ts', models.DateTimeField(auto_now_add=True, verbose_name='Created Date')),
                ('addedsurvey', models.ManyToManyField(to='core.surveyupgraded')),
                ('coach', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='userplaninfoCoach', to='core.coaches')),
                ('uplan', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.userplan')),
            ],
        ),
        migrations.CreateModel(
            name='UserAvatar',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_ts', models.DateTimeField(auto_now_add=True, verbose_name='Created Date')),
                ('updated_ts', models.DateTimeField(auto_now=True, verbose_name='Last Updated Date')),
                ('avatar', models.FileField(default='settings.MEDIA_ROOT/User_Profile/default.png', upload_to=core.models.user_directory_path)),
                ('created_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='%(app_label)s_%(class)s_created_related', to=settings.AUTH_USER_MODEL)),
                ('updated_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='%(app_label)s_%(class)s_updated_related', to=settings.AUTH_USER_MODEL)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='user_avatar', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='PasswordReset',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_ts', models.DateTimeField(auto_now_add=True, verbose_name='Created Date')),
                ('updated_ts', models.DateTimeField(auto_now=True, verbose_name='Last Updated Date')),
                ('code', models.CharField(max_length=20, unique=True)),
                ('is_used', models.BooleanField(default=False)),
                ('created_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='%(app_label)s_%(class)s_created_related', to=settings.AUTH_USER_MODEL)),
                ('updated_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='%(app_label)s_%(class)s_updated_related', to=settings.AUTH_USER_MODEL)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Participant',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_ts', models.DateTimeField(auto_now_add=True, verbose_name='Created Date')),
                ('updated_ts', models.DateTimeField(auto_now=True, verbose_name='Last Updated Date')),
                ('email', models.EmailField(max_length=254, validators=[django.core.validators.EmailValidator()])),
                ('first_name', models.CharField(blank=True, max_length=255, null=True)),
                ('last_name', models.CharField(blank=True, max_length=255, null=True)),
                ('client', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.clients')),
                ('created_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='%(app_label)s_%(class)s_created_related', to=settings.AUTH_USER_MODEL)),
                ('relationship', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='core.relationship')),
                ('updated_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='%(app_label)s_%(class)s_updated_related', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['relationship'],
            },
        ),
        migrations.CreateModel(
            name='Notification',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('read', models.BooleanField(default=False)),
                ('coach', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='core.coaches')),
            ],
        ),
        migrations.CreateModel(
            name='IntakeQuestions',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_ts', models.DateTimeField(auto_now_add=True, verbose_name='Created Date')),
                ('updated_ts', models.DateTimeField(auto_now=True, verbose_name='Last Updated Date')),
                ('question', models.TextField()),
                ('created_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='%(app_label)s_%(class)s_created_related', to=settings.AUTH_USER_MODEL)),
                ('updated_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='%(app_label)s_%(class)s_updated_related', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='IntakeIstruction',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_ts', models.DateTimeField(auto_now_add=True, verbose_name='Created Date')),
                ('updated_ts', models.DateTimeField(auto_now=True, verbose_name='Last Updated Date')),
                ('Instruction', models.TextField()),
                ('created_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='%(app_label)s_%(class)s_created_related', to=settings.AUTH_USER_MODEL)),
                ('updated_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='%(app_label)s_%(class)s_updated_related', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Coachrefercode',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_ts', models.DateTimeField(auto_now_add=True, verbose_name='Created Date')),
                ('updated_ts', models.DateTimeField(auto_now=True, verbose_name='Last Updated Date')),
                ('code', models.CharField(max_length=20, unique=True)),
                ('is_active', models.BooleanField(default=True)),
                ('coach', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='coach_refer', to='core.coaches')),
                ('created_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='%(app_label)s_%(class)s_created_related', to=settings.AUTH_USER_MODEL)),
                ('updated_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='%(app_label)s_%(class)s_updated_related', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='CoachIntakeQuestions',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_ts', models.DateTimeField(auto_now_add=True, verbose_name='Created Date')),
                ('updated_ts', models.DateTimeField(auto_now=True, verbose_name='Last Updated Date')),
                ('question', models.TextField()),
                ('client', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.clients')),
                ('coach', models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to='core.coaches')),
                ('created_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='%(app_label)s_%(class)s_created_related', to=settings.AUTH_USER_MODEL)),
                ('updated_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='%(app_label)s_%(class)s_updated_related', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.AddField(
            model_name='clients',
            name='coach',
            field=models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to='core.coaches'),
        ),
        migrations.AddField(
            model_name='clients',
            name='user',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.CreateModel(
            name='ClientInvitationCode',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_ts', models.DateTimeField(auto_now_add=True, verbose_name='Created Date')),
                ('updated_ts', models.DateTimeField(auto_now=True, verbose_name='Last Updated Date')),
                ('code', models.CharField(max_length=20, unique=True)),
                ('is_used', models.BooleanField(default=False)),
                ('email', models.EmailField(max_length=254, validators=[django.core.validators.EmailValidator()])),
                ('is_participant', models.BooleanField(default=False)),
                ('created_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='%(app_label)s_%(class)s_created_related', to=settings.AUTH_USER_MODEL)),
                ('updated_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='%(app_label)s_%(class)s_updated_related', to=settings.AUTH_USER_MODEL)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='ClientIntakeFiles',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_ts', models.DateTimeField(auto_now_add=True, verbose_name='Created Date')),
                ('updated_ts', models.DateTimeField(auto_now=True, verbose_name='Last Updated Date')),
                ('file', models.FileField(default=None, upload_to=core.models.user_client_directory_path)),
                ('client', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.clients')),
                ('coach', models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to='core.coaches')),
                ('created_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='%(app_label)s_%(class)s_created_related', to=settings.AUTH_USER_MODEL)),
                ('updated_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='%(app_label)s_%(class)s_updated_related', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='ClientIntakeAnswer',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_ts', models.DateTimeField(auto_now_add=True, verbose_name='Created Date')),
                ('updated_ts', models.DateTimeField(auto_now=True, verbose_name='Last Updated Date')),
                ('answer', models.TextField()),
                ('client', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.clients')),
                ('created_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='%(app_label)s_%(class)s_created_related', to=settings.AUTH_USER_MODEL)),
                ('question', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.coachintakequestions')),
                ('updated_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='%(app_label)s_%(class)s_updated_related', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='ClientIntake',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_ts', models.DateTimeField(auto_now_add=True, verbose_name='Created Date')),
                ('updated_ts', models.DateTimeField(auto_now=True, verbose_name='Last Updated Date')),
                ('instructions', models.TextField(blank=True, null=True)),
                ('logo', models.FileField(blank=True, default=None, null=True, upload_to=core.models.user_directory_path)),
                ('coachimg', models.FileField(blank=True, default=None, null=True, upload_to=core.models.user_directory_path)),
                ('client', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.clients')),
                ('coach', models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to='core.coaches')),
                ('created_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='%(app_label)s_%(class)s_created_related', to=settings.AUTH_USER_MODEL)),
                ('updated_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='%(app_label)s_%(class)s_updated_related', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='ClientDocument',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('filename', models.CharField(blank=True, max_length=255, null=True)),
                ('document', models.FileField(default=None, upload_to=core.models.user_client_document_directory_path)),
                ('client', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.clients')),
            ],
        ),
        migrations.CreateModel(
            name='ClientCampaign',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_ts', models.DateTimeField(auto_now_add=True, verbose_name='Created Date')),
                ('updated_ts', models.DateTimeField(auto_now=True, verbose_name='Last Updated Date')),
                ('status', models.BooleanField(default=False)),
                ('uid', models.CharField(blank=True, default=uuid.uuid4, max_length=100, unique=True)),
                ('client', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.clients')),
                ('created_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='%(app_label)s_%(class)s_created_related', to=settings.AUTH_USER_MODEL)),
                ('updated_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='%(app_label)s_%(class)s_updated_related', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='AddPaticipantByOther',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(default=None, max_length=50)),
                ('subject', models.CharField(default=None, max_length=50, null=True)),
                ('message', models.CharField(default=None, max_length=50, null=True)),
                ('code', models.CharField(max_length=200, unique=True)),
                ('is_used', models.BooleanField(default=False)),
                ('email', models.EmailField(max_length=254, validators=[django.core.validators.EmailValidator()])),
                ('status', models.BooleanField(default=False)),
                ('coach', models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to='core.coaches')),
            ],
        ),
    ]
