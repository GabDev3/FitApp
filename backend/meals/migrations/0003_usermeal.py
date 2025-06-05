

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('meals', '0002_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='UserMeal',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('consumed_at', models.DateTimeField(auto_now=True)),
                ('meal', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_meal', to='meals.meal')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_meal', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
