

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_alter_myuser_role'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='myuser',
            name='userDetails',
        ),
        migrations.RemoveField(
            model_name='usermeal',
            name='meal',
        ),
        migrations.RemoveField(
            model_name='usermeal',
            name='user',
        ),
        migrations.AddField(
            model_name='myuser',
            name='activity_level',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='myuser',
            name='age',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='myuser',
            name='dailyIntake',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='myuser',
            name='goal',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='myuser',
            name='height',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='myuser',
            name='weight',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='myuser',
            name='email',
            field=models.EmailField(max_length=254, unique=True),
        ),
        migrations.AlterField(
            model_name='myuser',
            name='first_name',
            field=models.CharField(blank=True, max_length=150),
        ),
        migrations.AlterField(
            model_name='myuser',
            name='last_name',
            field=models.CharField(blank=True, max_length=150),
        ),
        migrations.DeleteModel(
            name='UserDetails',
        ),
        migrations.DeleteModel(
            name='UserMeal',
        ),
    ]
