

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_remove_myuser_age_remove_myuser_dailyintake_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='myuser',
            name='role',
            field=models.CharField(choices=[('Admin', 'Admin'), ('User', 'User')], default='User', max_length=20),
        ),
    ]
