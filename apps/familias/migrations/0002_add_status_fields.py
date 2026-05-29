from django.db import migrations, models
from django.utils import timezone


def map_aprovada_to_status(apps, schema_editor):
    Familia = apps.get_model('familias', 'Familia')
    for familia in Familia.objects.all():
        familia.status = 'aprovada' if familia.aprovada else 'pendente'
        familia.save(update_fields=['status'])


class Migration(migrations.Migration):

    dependencies = [
        ('familias', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='familia',
            name='status',
            field=models.CharField(choices=[('pendente', 'Pendente'), ('aprovada', 'Aprovada'), ('lista_espera', 'Lista de espera')], default='pendente', max_length=20),
        ),
        migrations.AddField(
            model_name='familia',
            name='atualizado_em',
            field=models.DateTimeField(auto_now=True, default=timezone.now),
            preserve_default=False,
        ),
        migrations.RunPython(map_aprovada_to_status, migrations.RunPython.noop),
    ]
