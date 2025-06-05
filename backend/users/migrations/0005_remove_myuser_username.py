

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0004_remove_myuser_userdetails_remove_usermeal_meal_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='myuser',
            name='username',
        ),
    ]
