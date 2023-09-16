from django.shortcuts import render
from django.core.exceptions import ValidationError
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.db import IntegrityError
import json
from survey.models import SurveyQuestion, Survey, SurveyCategory

from core import models as core_model
from django.conf import settings
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import *


@api_view(["POST"])
def sendmail(request):
    email = request.POST.get("email")
    to_emails = core_model.User.objects.filter(
        Q(email=email) | Q(username=email)
    ).first()
    message = Mail(
        from_email=settings.EMAIL_HOST_USER[0],
        to_emails=to_emails.email,
        subject="Forgot Password",
        html_content=render_to_string(
            "core/theme/email.html",
            {"email_body": buildurl, "username": to_emails.username},
        ),
    )

    sg = SendGridAPIClient(str(settings.SENDGRID_API_KEY))
    response = sg.send(message)


@api_view(["POST"])
@permission_classes((AllowAny,))
# @group_required('COACH',SUPERUSER)
def question_creation(request):
    s_id = request.data.get("survey_id")
    question = request.data.get("question")
    status = request.data.get("status")
    help_text = request.data.get("help_text")
    mu_ca = request.data.get("multiple_correct_answers")
    sequence = request.data.get("sequence")
    if None in [id, question, status, sequence]:
        return Response({"error": "All fields are mandatory!!!"}, 400)

    survey_obj = Survey.objects.filter(id=s_id)
    if not survey_obj:
        return Response({"Error": "Survey Does Not Exist"}, 400)

    try:
        ques = SurveyQuestion.objects.get_or_create(
            survey=survey_obj[0],
            question=question,
            help_text=help_text,
            multiple_correct_answers=mu_ca,
            sequence=sequence,
            max_allowed_time=max_allowed_time,
        )

        if status == "MU":
            ques.status = SurveyQuestion.QuestionType.MULTIPLE_CHOICE

        elif status == "TX":
            ques.status = SurveyQuestion.QuestionType.TEXT

        elif status == "BL":
            ques.status = SurveyQuestion.QuestionType.BOOL

        ques.save()
        return Response({"message": "Survey Question successfully!"}, 200)

    except (ValueError, TypeError):
        return Response({"Error": "Question Not Created"}, 400)


@api_view(["POST"])
@permission_classes((AllowAny,))
# @group_required('COACH',SUPERUSER)
def survey_creation(request):
    u_id = request.data.get("user_id")
    cat_name = request.data.get("name")
    status = request.data.get("status")
    title = request.data.get("title")
    description = request.data.get("description")
    success_message = request.data.get("success_message")
    failure_message = request.data.get("failure_message")
    instructions = request.data.get("instructions")
    start_datetime = request.data.get("start_datetime")
    end_datetime = request.data.get("end_datetime")
    company_logo = request.FILES.get("company_logo")

    if None in [
        u_id,
        cat_name,
        title,
        description,
    ]:
        return Response({"error": "All fields are mandatory!!!"}, 400)
    try:
        survey_category = SurveyCategory.objects.get_or_create(name=cat_name)
        Survey = Survey.objects.get_or_create(
            creator=u_id, Survey_category=survey_category, title=title
        )

        Survey.objects.filter(id=Survey.id).update(
            description=description,
            company_logo=company_logo,
            success_message=success_message,
            failure_message=failure_message,
            instructions=instructions,
            start_datetime=start_datetime,
            end_datetime=end_datetime,
        )

        if status == "US":
            Survey.status = Survey.SurveyStatus.UNSENT

        elif status == "AT":
            Survey.status = Survey.SurveyStatus.ACTIVE

        elif status == "CT":
            Survey.status = Survey.SurveyStatus.COMPLETE

        elif status == "UR":
            Survey.status = Survey.SurveyStatus.UPCOMING

        Survey.save()
        return Response({"message": "Survey Created successfully!"}, 200)
    except:
        return Response({"Error": "Survey Creation Failed"}, 400)
