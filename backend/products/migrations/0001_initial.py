

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(default='default_product_name', max_length=100, unique=True)),
                ('complex_carbs', models.FloatField(default=0)),
                ('simple_carbs', models.FloatField(default=0)),
                ('fiber', models.FloatField(default=0)),
                ('saturated_fat', models.FloatField(default=0)),
                ('unsaturated_fat', models.FloatField(default=0)),
                ('protein', models.FloatField(default=0)),
                ('kcal', models.FloatField(blank=True, null=True)),
            ],
        ),
    ]
