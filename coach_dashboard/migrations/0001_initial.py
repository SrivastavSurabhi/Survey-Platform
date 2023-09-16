# Generated by Django 4.0.6 on 2022-11-07 05:15

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Question',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('position_index', models.PositiveSmallIntegerField(default=1)),
                ('question', models.TextField()),
                ('client', models.ManyToManyField(to='core.clients')),
            ],
        ),
        migrations.CreateModel(
            name='QuestionAnswer',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('position_index', models.PositiveSmallIntegerField(default=1)),
                ('answer', models.TextField()),
                ('question', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='possible_answers', to='coach_dashboard.question')),
            ],
        ),
    ]