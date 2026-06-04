import django.db.models.deletion
from django.db import migrations, models
from django.utils import timezone


def map_resposta_status(apps, schema_editor):
    RespostaCiclo = apps.get_model('formularios', 'RespostaCiclo')
    for resposta in RespostaCiclo.objects.all():
        if resposta.status == 'completo':
            resposta.status = 'enviado'
        else:
            resposta.status = 'rascunho'
        resposta.save(update_fields=['status'])


class Migration(migrations.Migration):

    dependencies = [
        ('formularios', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='ciclo',
            name='publicado_em',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='ciclo',
            name='encerrado_em',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.CreateModel(
            name='Pergunta',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('texto', models.TextField()),
                ('tipo', models.CharField(choices=[('texto', 'Texto'), ('numero', 'Numero'), ('booleano', 'Sim/Nao'), ('data', 'Data'), ('selecao_unica', 'Selecao unica'), ('selecao_multipla', 'Selecao multipla')], max_length=20)),
                ('obrigatoria', models.BooleanField(default=False)),
                ('ordem', models.PositiveIntegerField(default=0)),
                ('ciclo', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='perguntas', to='formularios.ciclo')),
            ],
            options={
                'ordering': ['ordem', 'id'],
            },
        ),
        migrations.CreateModel(
            name='Opcao',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('texto', models.CharField(max_length=200)),
                ('ordem', models.PositiveIntegerField(default=0)),
                ('pergunta', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='opcoes', to='formularios.pergunta')),
            ],
            options={
                'ordering': ['ordem', 'id'],
            },
        ),
        migrations.AlterField(
            model_name='respostaciclo',
            name='status',
            field=models.CharField(choices=[('rascunho', 'Rascunho'), ('enviado', 'Enviado')], default='rascunho', max_length=20),
        ),
        migrations.AddField(
            model_name='respostaciclo',
            name='atualizado_em',
            field=models.DateTimeField(auto_now=True, default=timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='respostaciclo',
            name='enviado_em',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddConstraint(
            model_name='respostaciclo',
            constraint=models.UniqueConstraint(fields=('ciclo', 'familia'), name='unique_resposta_por_familia_ciclo'),
        ),
        migrations.CreateModel(
            name='RespostaItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('valor_texto', models.TextField(blank=True)),
                ('valor_numero', models.DecimalField(blank=True, decimal_places=2, max_digits=12, null=True)),
                ('valor_booleano', models.BooleanField(blank=True, null=True)),
                ('valor_data', models.DateField(blank=True, null=True)),
                ('opcao', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='respostas_unicas', to='formularios.opcao')),
                ('opcoes', models.ManyToManyField(blank=True, related_name='respostas_multiplas', to='formularios.opcao')),
                ('pergunta', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='respostas', to='formularios.pergunta')),
                ('resposta', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='itens', to='formularios.respostaciclo')),
            ],
            options={
                'ordering': ['id'],
            },
        ),
        migrations.RunPython(map_resposta_status, migrations.RunPython.noop),
    ]
