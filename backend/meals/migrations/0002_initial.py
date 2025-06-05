

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('meals', '0001_initial'),
        ('products', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='meal',
            name='author_meal',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='meals_author', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='mealproduct',
            name='meal',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='meals.meal'),
        ),
        migrations.AddField(
            model_name='mealproduct',
            name='product',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='products.product'),
        ),
    ]
