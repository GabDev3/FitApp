

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='myuser',
            name='age',
        ),
        migrations.RemoveField(
            model_name='myuser',
            name='dailyIntake',
        ),
        migrations.AddField(
            model_name='myuser',
            name='role',
            field=models.CharField(choices=[('ADMIN', 'Admin'), ('USER', 'User')], default='USER', max_length=20),
        ),
        migrations.CreateModel(
            name='UserDetails',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('height', models.FloatField(blank=True, null=True)),
                ('weight', models.FloatField(blank=True, null=True)),
                ('activity_level', models.CharField(blank=True, max_length=50, null=True)),
                ('goal', models.CharField(blank=True, max_length=50, null=True)),
                ('dailyIntake', models.FloatField(blank=True, null=True)),
                ('age', models.PositiveIntegerField(blank=True, null=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='user_details', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='myuser',
            name='userDetails',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='user_details', to='users.userdetails'),
        ),
    ]
