

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('meals', '0003_usermeal'),
    ]

    operations = [
        migrations.AlterField(
            model_name='mealproduct',
            name='meal',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='meal_products', to='meals.meal'),
        ),
    ]
