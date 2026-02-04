# Generated migration to add total_distance field

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('octofit_tracker', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='leaderboard',
            name='total_distance',
            field=models.FloatField(default=0.0),
        ),
    ]
