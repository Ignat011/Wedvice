# Generated by Django 3.2.6 on 2021-08-08 22:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dreamwed', '0009_alter_guest_phone_number'),
    ]

    operations = [
        migrations.AlterField(
            model_name='todo',
            name='completed',
            field=models.BooleanField(default=False, help_text='Mark this task as completed.'),
        ),
    ]