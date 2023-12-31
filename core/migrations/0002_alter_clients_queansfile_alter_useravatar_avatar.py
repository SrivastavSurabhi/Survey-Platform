# Generated by Django 4.0.6 on 2022-11-07 06:11

import core.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='clients',
            name='queansfile',
            field=models.FileField(default='/static/images/theme/default.png', upload_to=core.models.user_client_queans_path),
        ),
        migrations.AlterField(
            model_name='useravatar',
            name='avatar',
            field=models.FileField(default='/static/images/theme/default.png', upload_to=core.models.user_directory_path),
        ),
    ]
