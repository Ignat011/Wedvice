# Generated by Django 3.2.6 on 2021-08-09 11:33

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('dreamwed', '0010_alter_todo_completed'),
    ]

    operations = [
        migrations.AddField(
            model_name='todo',
            name='category',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='dreamwed.vendorcategory'),
        ),
        migrations.CreateModel(
            name='ExpenseCategory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(help_text='Categorize your expenses for proper budgeting.', max_length=200)),
                ('user', models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='dreamwed.weddingplanner')),
            ],
        ),
    ]
