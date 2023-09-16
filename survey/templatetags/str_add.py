from django import template
from survey.models import *
import re

register = template.Library()


@register.simple_tag
def addstr(arg1, arg2):
    """concatenate arg1 & arg2"""
    return str(arg1) + str(arg2)


@register.simple_tag
def crstr(arg1):
    """concatenate arg1 & arg2"""
    return str(arg1)


@register.simple_tag
def rangelst(arg1):
    """concatenate arg1 & arg2"""
    a_list = list(range(1, int(arg1) + 1))
    return a_list


@register.simple_tag
def is_survey_favourite(survey_id, user_id):

    if FavouriteSurvey.objects.filter(user_id=user_id, survey_id=survey_id).exists():
        return "checked"
    else:
        return ""
