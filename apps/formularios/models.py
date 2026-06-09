from django.db import models

# Create your models here.
class Ciclo(models.Model):
    STATUS_CHOICES = [
        ('ativo', 'Ativo'),
        ('rascunho', 'Rascunho'),
        ('encerrado', 'Encerrado'),
    ]

    titulo = models.CharField(max_length=100)
    descricao = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='rascunho')
    prazo = models.DateField()
    criado_em = models.DateTimeField(auto_now_add=True)
    publicado_em = models.DateTimeField(null=True, blank=True)
    encerrado_em = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.titulo


class Pergunta(models.Model):
    TIPO_CHOICES = [
        ('texto', 'Texto'),
        ('numero', 'Numero'),
        ('booleano', 'Sim/Nao'),
        ('data', 'Data'),
        ('selecao_unica', 'Selecao unica'),
        ('selecao_multipla', 'Selecao multipla'),
    ]

    ciclo = models.ForeignKey(Ciclo, on_delete=models.CASCADE, related_name='perguntas')
    texto = models.TextField()
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    obrigatoria = models.BooleanField(default=False)
    ordem = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['ordem', 'id']

    def __str__(self):
        return f"{self.ciclo} - {self.texto[:50]}"


class Opcao(models.Model):
    pergunta = models.ForeignKey(Pergunta, on_delete=models.CASCADE, related_name='opcoes')
    texto = models.CharField(max_length=200)
    ordem = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['ordem', 'id']

    def __str__(self):
        return f"{self.pergunta_id} - {self.texto}"


class RespostaCiclo(models.Model):
    STATUS_CHOICES = [
        ('completo', 'Completo'),
        ('pendente', 'Pendente'),
    ]

    ciclo = models.ForeignKey(Ciclo, on_delete=models.CASCADE, related_name='respostas')
    presidente = models.ForeignKey('presidentes.Presidente', on_delete=models.CASCADE)
    familia = models.ForeignKey('familias.Familia', on_delete=models.CASCADE,null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pendente')
    observacao = models.TextField(blank=True)
    respondido_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)
    enviado_em = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.ciclo} - {self.presidente}"

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['ciclo', 'familia'], name='unique_resposta_por_familia_ciclo'),
        ]


class RespostaItem(models.Model):
    resposta = models.ForeignKey(RespostaCiclo, on_delete=models.CASCADE, related_name='itens')
    pergunta = models.ForeignKey(Pergunta, on_delete=models.CASCADE, related_name='respostas')
    valor_texto = models.TextField(blank=True)
    valor_numero = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    valor_booleano = models.BooleanField(null=True, blank=True)
    valor_data = models.DateField(null=True, blank=True)
    opcao = models.ForeignKey(Opcao, on_delete=models.SET_NULL, null=True, blank=True, related_name='respostas_unicas')
    opcoes = models.ManyToManyField(Opcao, blank=True, related_name='respostas_multiplas')

    class Meta:
        ordering = ['id']