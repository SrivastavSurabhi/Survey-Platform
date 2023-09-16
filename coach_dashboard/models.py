from django.db import models 
from core.models import Clients

class Question(models.Model):
    client = models.ManyToManyField(Clients)
    position_index = models.PositiveSmallIntegerField(default=1)
    question = models.TextField()

class QuestionAnswer(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='possible_answers')
    position_index = models.PositiveSmallIntegerField(default=1)
    answer = models.TextField()