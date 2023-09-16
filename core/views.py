import random
import string
from django.contrib.auth import get_user_model, login, logout as django_logout
from django.contrib import messages
from django.db.models import Q, Sum, F
from rest_framework import status
from core import models as core_model
from django.shortcuts import render, redirect
from django.views.generic import TemplateView
from sendgrid import SendGridAPIClient
from core.models import ClientIntake as Intake
from core.models import *
from django.http import JsonResponse, HttpResponse
from survey.models import *
import datetime
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
import json
import logging
from django.template.loader import render_to_string
from rest_framework.decorators import api_view
import sendgrid
from sendgrid.helpers.mail import Mail, Email, To, Content, ReplyTo
import http.client
import html
import base64
import requests
from django_serverside_datatable.views import ServerSideDatatableView
from django.utils import timezone
import pytz
from django_datatables_view.base_datatable_view import BaseDatatableView
from datetime import date

def global_settings(request):
    return {
        'CACHE_VERSION': settings.CACHE_VERSION,
    }


logger = logging.getLogger(__name__)

User = get_user_model()
authkey = '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'
key = settings.STRIPE_PUBLISHABLE_KEY


class SignUpView(TemplateView):
    template_name = "core/theme/signup.html"

    def get(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return render(request, self.template_name, {})
        else:
            request.session['login'] = False
            return redirect("dashboard")

    def post(self, request, *args, **kwargs):
        email = request.POST.get("email")
        username = request.POST.get("username")
        first_name = request.POST.get("first_name")
        last_name = request.POST.get("last_name")
        title = request.POST.get("title")
        company_name = request.POST.get("company_name")
        company_url = request.POST.get("company_url")
        password = request.POST.get("pass")
        confirm_password = request.POST.get("cpass")
        if email and password and confirm_password and username:
            if len(password) > 7:
                if password == confirm_password:
                    try:
                        user_email = User.objects.filter(email=email)
                        if user_email:
                            messages.warning(request, "Email Already Exists")
                            return render(request, self.template_name, {})
                        user = User.objects.create_user(
                            email=email,
                            password=password,
                            username=username,
                        )
                        if user:
                            coaches = Coaches.objects.create(
                                user=user,
                                first_name=first_name,
                                last_name=last_name,
                                title=title,
                                company_name=company_name,
                                company_url=company_url,
                            )
                            login(request, user)
                            request.session['login'] = False
                            Notification.objects.create(title="New User", description="New user registered on LRC portal.")
                            return redirect("plan", "dashboard")

                    except Exception as e:
                        messages.warning(request, "Username Already Exists")
                        return render(request, self.template_name, {})
                else:
                    messages.warning(request, "password mismatched")
                    return render(request, self.template_name, {})
            else:
                messages.warning(request, "password minmun 8 charcter")
                return render(request, self.template_name, {})
        else:
            messages.error(request, "Invalid signup inputs")
            return render(request, self.template_name, {})


class PlanView(TemplateView):
    template_name = "core/theme/plan.html"

    def get(self, request, *args, **kwargs):
        plan = Plan.objects.all()
        if not request.user.is_authenticated:
            return redirect("logins")
        if request.user.is_admin or request.user.is_superuser:
            return redirect('dashboard')
        else:
            try:
                if UserPlanInfo.objects.get(coach=request.user.coaches).status() == True:
                    return redirect('dashboard')
                else:
                    return render(request, self.template_name, {'key': key, 'plan': plan, "redirect": kwargs['to']})
            except:
                return render(request, self.template_name, {'key': key, 'plan': plan, "redirect": kwargs['to']})


class PlanHistoryView(TemplateView):
    template_name = "core/theme/planhistory.html"

    def get(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return redirect("logins")
        plan = Plan.objects.all()
        userplan = UserPlan.objects.all().order_by('-created_ts')
        upinfo = UserPlanInfo.objects.all().order_by("-id")

        plan1revenue, surupgradedplan1, surleftplan1, surrevplan1 = 0, 0, 0, 0
        plan2revenue, surupgradedplan2, surleftplan2, surrevplan2 = 0, 0, 0, 0
        context = {}
        plan1 = Plan.objects.get(title='Individual Plan')
        plan2 = Plan.objects.get(title='Enterprise Plan')
        userp1 = UserPlan.objects.filter(plan=plan1)
        userp2 = UserPlan.objects.filter(plan=plan2)
        indiv_coach_count = userp1.count()
        enter_coach_count = userp2.count()
        indiv_clients = Clients.objects.filter(coach=userp1[0].coach)
        enter_clients = Clients.objects.filter(coach=userp2[0].coach)
        indiv_client_count = indiv_clients.count()
        enter_client_count = enter_clients.count()
        upi1list,upi2list = [],[]
        for up1 in userp1:
            upi1 = UserPlanInfo.objects.get(uplan=up1)
            upi1list.append(upi1)
        for up2 in userp2:
            upi2 = UserPlanInfo.objects.get(uplan=up2)
            upi2list.append(upi2)
        for up1 in upi1list:
            try:
                plan1revenue += up1.licencefee()
                surupgradedplan1 += up1.surveyupgraded
                surleftplan1 += up1.surveyleft()
                for u in up1.addedsurvey.all():
                    surrevplan1 += u.noofsurvey
            except:
                pass
        surcostplan1 = surrevplan1*plan1.prizepersurvey
        for up2 in upi2list:
            try:
                plan2revenue += up2.licencefee()
                surupgradedplan2 += up2.surveyupgraded
                surleftplan2 += up2.surveyleft()
                for u in up2.addedsurvey.all():
                    surrevplan2 += u.noofsurvey
            except:
                pass
        surcostplan2 = surrevplan2*plan2.prizepersurvey
        context.update({'indiv_coach': indiv_coach_count, 'enter_coach': enter_coach_count,'surleftplan1':surleftplan1,
                        'indiv_client': indiv_client_count, 'enter_client': enter_client_count, 'surcostplan1':surcostplan1,
                        'plan1revenue': plan1revenue, 'plan2revenue': plan2revenue,'surleftplan2':surleftplan2,
                        'surupgradedplan1':surupgradedplan1,'surupgradedplan2':surupgradedplan2, 'surcostplan2':surcostplan2})
        if not request.user.is_authenticated:
            return render(request, self.template_name, {})
        else:
            if request.user.is_admin or request.user.is_superuser:
                context.update({'plan': plan, 'userplan': userplan, 'upinfo': upinfo})
                return render(request, self.template_name, context)

    def post(self, request, *args, **kwargs):
        plan = Plan.objects.get(id=request.POST['id'])
        plan.title=request.POST['planname']
        plan.prizepersurvey=request.POST['prizepersurvey']
        plan.noofsurvey=request.POST['noofsurvey']
        plan.annuallicencefee=request.POST['licencefee']
        plan.servicesinclude=request.POST['plandesc']
        plan.save()
        if not request.user.is_authenticated:
            return redirect('dashboard')
        else:
            if request.user.is_admin or request.user.is_superuser:
                return JsonResponse({'success': 'data updated'})


class LoginView(TemplateView):
    template_name = "core/theme/login.html"

    def get(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return render(request, self.template_name, {})
        else:
            return redirect("dashboard")

    def post(self, request):
        username = request.POST.get("email")
        password = request.POST.get("password")
        user = User.objects.filter(Q(email=username) | Q(username=username)).first()
        if user:
            if user.check_password(password):
                login(request, user)
                return redirect("dashboard")
            else:
                messages.error(request, "Invalid Password")
                return render(request, self.template_name, {})
        else:
            messages.error(request, "Invalid Username and Password")
            return render(request, self.template_name, {})


class SkipPlan(TemplateView):
    template_name = "core/forgot_password.html"

    def get(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            coach = Coaches.objects.get(user=request.user)
            coach.skipplan = True
            coach.save()
            return redirect("dashboard")
        else:
            return redirect("dashboard")


class ForgotPasswordView(TemplateView):
    template_name = "core/forgot_password.html"

    # def get(self, request, *args, **kwargs):
    #     if not request.user.is_authenticated:
    #         return render(request, self.template_name, {})
    #     else:
    #         return redirect("dashboard")

    def post(self, request, *args, **kwargs):
        email = request.POST.get("email")

        try:
            if not email:
                return Response(
                    {"email": "email or username is required"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            to_emails = core_model.Coaches.objects.filter(
                Q(user__email=email) #| Q(username=email)
            ).first()
            if to_emails:# and to_emails.is_active:
                code = get_random_string()
                core_model.PasswordReset.objects.create(user_id=to_emails.id, code=code)
                buildurl = request.build_absolute_uri("/") + "password-reset/" + code
                email_body = (
                    "You can use the following link to reset your password: : "
                    + str(buildurl)
                )
                replyto = ReplyTo('shivani@creativebuffer.com',)
                # print(settings.EMAIL_HOST_USER)
                # print("--------", settings.EMAIL_HOST_USER[0])
                message = Mail(
                    from_email='shivani@creativebuffer.com',#settings.EMAIL_HOST_USER[0],
                    to_emails=to_emails.user.email,
                    subject="Forgot Password",
                    html_content=render_to_string(
                        "core/theme/email.html",
                        {"email_body": buildurl, "username": to_emails.user.username},
                    ),
                )
                message.reply_to = replyto
                sg = sendgrid.SendGridAPIClient(api_key=authkey)
                try:
                    response = sg.send(message)
                except:
                    messages.error(request, "Mail Not Send.")
                    return redirect("logins")
                if response:
                    messages.success(
                        request,
                        "A password reset email has been Successfully sent to your email address.",
                    )
                    return redirect("logins")
            else:
                messages.error(request, "User Not Exist")
                # messages.warning(request, "User account Inactivate")
                # return render(request, self.template_name, {})
                return redirect('dashboard')
        except User.DoesNotExist:
            messages.error(request, "User Not Exist")
            return render(request, self.template_name, {})


class DashboardAPIView(TemplateView):
    template_name = "core/theme/coach_dashboard.html"
    template_admin_name = "core/theme/admin_dashboard.html"

    def get(self, request, *args, **kwargs):
        logger.info("It's working!")
        context = {}
        context.update({"title": "Dashboard"})
        order = request.GET.get("ordering", "-id")
        if request.user.is_authenticated:
            try:
                userplan = UserPlan.objects.get(coach=request.user.coaches)
            except:
                pass
        else:
                return redirect("logins")
        if request.user.is_admin or request.user.is_superuser:
            notifications = Notification.objects.filter(coach=None, read=False)
            if notifications.count() > 0:
                request.session['has_notification'] = True
            survey = Survey.objects.all().count()
            active_count = Survey.objects.filter(Q(status="AT") | Q(status="RO")).count()
            try:
                unsent_count = round(Survey.objects.filter(status="US").count()/survey, 2)
            except:
                unsent_count = 0
            try:
                completed_count = round(Survey.objects.filter(status="CT").count()/survey, 2)
            except:
                completed_count =  0
            client = Clients.objects.all()
            coach = Coaches.objects.all()

            context.update({'client': client, 'coach': coach, 'survey': survey, 'active_count': active_count, 'notifications':notifications,
                            'unsent_count': int(unsent_count*100), 'completed_count': int(completed_count*100)})
            return render(request, self.template_admin_name, context)
        else:
            if request.session.get('login') == False:
                context.update({"login": False})
            else:
                context.update({"login": True})
            clientlist =core_model.Clients.objects.filter(coach_id=request.user.coaches.id, mode=False).order_by(order)
            surveylist = []
            rptlist = []
            rptstatus = []
            status = []
            for cli in clientlist:
                try:
                    sur = Survey.objects.filter(Survey_client=cli).order_by('created_ts').reverse()[0]
                    if sur.total_sent == 0:
                        status = 'Draft'
                    else:
                        if sur.status == 'CT':
                            status = 'Closed'
                        else:
                            status = 'Active'

                    surveylist.append(status)
                except:
                    surveylist.append('Not yet created')
                try:
                    rpt = FeedBackReport.objects.get(survey=sur, user='Client')
                    if rpt.status == 'Partially Completed':
                        status = 'Draft'
                    else:
                        if rpt.status == 'Completed':
                            status = 'Completed'
                    rptlist.append(status)
                except:
                    rptlist.append(' -')
                try:
                    report = FeedBackReport.objects.get(survey=sur, user='Client')
                    if report.mail_report_date == None:
                        date = '-'
                    else:
                        date = report.mail_report_date
                    rptstatus.append(date)
                except:
                    rptstatus.append('-')   
            # paginate_by = settings.PAGINATED_BY
            # paginator = Paginator(clientlist, paginate_by)
            # totalpage = paginator.page_range
            # page = self.request.GET.get("page")
            # try:
            #     clientlistobj = paginator.page(page)
            # except PageNotAnInteger:
            #     clientlistobj = paginator.page(1)
            # except EmptyPage:
            #     clientlistobj = paginator.page(paginator.num_pages)
            clientlistobj = list(zip(clientlist, surveylist, rptlist,rptstatus))
            notification = Notification.objects.filter(coach=request.user.coaches)
            context.update({"client": clientlistobj,'notification':notification,'lastnotification':notification.last()})
            return render(request, self.template_name, context)


    def delete(self, request, *args, **kwargs):
        context = {}
        context.update({"title": "Dashboard"})
        if request.user.is_authenticated:
            if request.user.is_admin or request.user.is_superuser:
                active_count = Survey.objects.filter(status="AT").count()
                unsent_count = Survey.objects.filter(status="UT").count()
                completed_count = Survey.objects.filter(status="CT").count()
                return render(request, self.template_admin_name, context)
            else:
                core_model.Clients.objects.get(id=int(request.body.decode())).delete()
                clientlist = core_model.Clients.objects.filter(
                    coach_id=request.user.coaches.id
                ).order_by("-id")

                context.update({"client": clientlist})
                return render(request, self.template_name, context)


def logout(request):
    if not request.user.is_authenticated:
        return redirect("logins")
    django_logout(request)
    messages.success(request, "logout successfully")
    request.session['login'] = True
    return redirect("logins")


class UserProfile(TemplateView):
    """
    User Profile page it will display according superadmin and coaches
    """

    template_name = "core/theme/coach_profile.html"
    template_name_admin = "core/theme/admin_profile.html"

    def get(self, request, *args, **kwargs):
        context = {}
        if request.user.is_authenticated:
            if request.user.is_admin or request.user.is_superuser:
                context.update({"title": "Profile"})
                return render(request, self.template_name_admin, context)
            else:
                try:
                    if request.user.coach_exist:
                        codeobj = core_model.Coachrefercode.objects.get(
                            coach_id=request.user.coaches.id
                        )
                    else:
                        codeobj = None

                except:
                    if request.user.coach_exist:
                        code = get_random_string()
                        codeobj = core_model.Coachrefercode.objects.create(
                            coach_id=request.user.coaches.id, code=code
                        )
                    else:
                        codeobj = None
                if codeobj:
                    link = buildurl = (
                        request.build_absolute_uri("/")
                        + "inviteparticipant/"
                        + codeobj.code
                    )
                else:
                    link = None
                context.update({"title": "Profile", "referlink": link})
                return render(request, self.template_name, context)
        else:
            return redirect("logins")

    def post(self, request, *args, **kwargs):
        logo = request.FILES["logo"]
        coach = Coaches.objects.get(user=request.user)
        coach.logo = logo
        coach.save()
        return JsonResponse({'success': "success"})

    def delete(self, request, *args, **kwargs):
            coach = Coaches.objects.get(user=request.user)
            coach.logo = None
            coach.save()
            return JsonResponse({'success': "success"})


def GetNotifications(request):
    if not request.user.is_authenticated:
        return redirect("logins")
    if request.user.is_admin or request.user.is_superuser:
        notifications = Notification.objects.filter(coach=None)
    else:
        notifications = Notification.objects.filter(coach=request.user.coaches)
    notif = notifications.values_list()
    data = list(notif)
    request.session['has_notification'] = False
    for notification in notifications:
        notification.read = True
        notification.save()
    return JsonResponse({'notifications': data})


def NotificationsStage(request):
    for notification in Notification.objects.filter(coach=None):
        notification.read = True
        notification.save()
        request.session['has_notification'] = False
    return JsonResponse({'success': 'success'})


class ClientIntake(TemplateView):
    template_name = "core/theme/client_intake.html"

    def get(self, request, *args, **kwargs):
        context = {}
        if request.user.is_authenticated:
            if request.user.is_admin or request.user.is_superuser:
                coach = Coaches.objects.all()
                context.update({"coach": coach})
            else:
                context.update({"c": request.user.coaches})
            return render(request, self.template_name, context)
        else:
            return redirect("logins")

    def post(self, request, *args, **kwargs):
        context = {}
        data = request.POST
        email = data.get("email")
        fname = data.get("fname")
        lname = data.get("lname")
        city = data.get("city")
        state = data.get("state")
        country = data.get("country")
        title = data.get("title")
        phone = data.get("phone")
        address = data.get("address")
        compname = data.get("compname")
        compurl = data.get("compurl")
        zip = data.get("zip")
        if city == '':
            city = None
        if state == '':
            state = None
        if country == '':
            country = None
        if phone == '':
            phone = None
        if address == '':
            address = None
        if compurl == '':
            compurl = None
        if zip == '':
            zip = None
        if compname == '':
            compname = None
        if title == '':
            title = None
        addemail = data.get("addemail")
        addphone = data.get("addphone")
        compaddress = data.get("compaddress")
        try:
            if (
                email != ''
                and fname != ''
                and lname != ''
                # and compname != ''
                # and title != ''
            ):
                try:
                    coach = request.user.coaches
                except:
                    try:
                        coach = Coaches.objects.get(id=data.get("coach"))
                    except:
                        context.update({
                                "failmessage": "Please Select Coach.",
                                "suc": "true",
                            })
                        return JsonResponse(context)
                    
                if core_model.Clients.objects.filter(email=email, coach=coach).exists():
                    context.update(
                        {
                            "failmessage": "Email already exists. Please enter a unique email address.",
                            "suc": "true",
                        }
                    )
                    return JsonResponse(context)
                else:
                    cli = core_model.Clients.objects.create(
                    coach=coach,
                    email=email,
                    first_name=fname,
                    last_name=lname,
                    phone=phone,
                    city=city,
                    state=state,
                    country=country,
                    title=title,
                    address=address,
                    company_name=compname,
                    company_url=compurl,
                    company_phone=addphone,
                    company_email=addemail,
                    company_address=compaddress,
                    zip=zip
                    )
                try:
                    clientlist = core_model.Clients.objects.filter(coach=coach, intake_status=False).order_by('id')
                    if len(clientlist) > 1:
                        questions = CoachIntakeQuestions.objects.filter(coach=coach,
                                                                        client=clientlist[0]).order_by('id')

                        for question in questions:
                            CoachIntakeQuestions.objects.create(coach=coach,
                                                                question=question.question, client=cli)
                        try:
                            intakeobj = Intake.objects.get(client=clientlist[0])
                            instruct = intakeobj.instructions
                        except:
                            instruct = IntakeIstruction.objects.get().Instruction

                        Intake.objects.create(coach=coach, instructions=instruct,
                                                  client=cli)
                    else:
                        for question in IntakeQuestions.objects.all():
                            CoachIntakeQuestions.objects.create(coach=coach, question=question.question,
                                                           client=cli)
                        Intake.objects.create(coach=coach, instructions=IntakeIstruction.objects.get().Instruction,
                                              client=cli)
                except:
                    if not CoachIntakeQuestions.objects.filter(coach=coach, client=cli):
                        for question in IntakeQuestions.objects.all():
                            CoachIntakeQuestions.objects.create(coach=coach, question=question.question,
                                                                client=cli)
                        Intake.objects.create(coach=coach, instructions=IntakeIstruction.objects.get().Instruction,
                                          client=cli)

                context.update(
                    {
                        "sucmessage": "You have successfully filled intake form.",
                        "suc": "true",
                    }
                )
                # return redirect('detail-client', client=cli.id)
                return JsonResponse(context)
            else:
                context.update(
                    {
                        "failmessage": "Please enter all the required fields to proceed further.",
                        "suc": "true",
                    }
                )
                return render(request, self.template_name, context)
        except:
            context.update(
                {
                    "failmessage": "Email already exists. Please enter a unique email address.",
                    "suc": "true",
                }
            )
            return JsonResponse(context)


class ClientDetail(TemplateView):
    """
    Client list view
    """

    template_name = "core/theme/add_client_new.html"

    def get(self, request, client, *args, **kwargs):
        context = {}

        if request.user.is_authenticated:
            try:
                clientobj = core_model.Clients.objects.get(id=client)
                relationobj = core_model.Relationship.objects.all()
                partobjlist = core_model.Participant.objects.filter(client=clientobj).order_by("-id")
                draft = FeedBackReport.objects.filter(survey__Survey_client=clientobj)
                sur = Survey.objects.filter(Survey_client=clientobj).order_by("-created_ts")
                context.update({'draft': draft, "Surveyobj": sur})
                try:
                    sur_id = request.GET['id']
                    context.update({"sur_id": sur_id})
                except:
                    pass
                code = get_random_string() + 'code' + client
                try:
                    # for Surveyobj in sur:
                    #     scam = SurveyCampaign.objects.filter(survey=Surveyobj)
                        # if len(scam) > 0:
                            # if Surveyobj.status != 'CT':
                            #     if Surveyobj.total_sent == Surveyobj.response_count:
                            #         if Surveyobj.status != 'RO':
                            #             Surveyobj.status = 'CT'
                            # Surveyobj.save()
                    questionobj = SurveyQuestion.objects.filter(survey__Survey_client=clientobj).order_by("created_ts")
                    core_model.AddPaticipantByOther.objects.create(code=code, name=clientobj.first_name + ' ' +
                                            clientobj.last_name, email=clientobj.email, coach=clientobj.coach)
                    context.update({'questionobj':questionobj})
                except:
                    pass
                try:
                    confques = ConfidentialQuestions.objects.all()
                    confans = ConfidentialAnswer.objects.all().order_by('participant')
                    context.update({"confques": confques, 'confans': confans})
                except:
                    pass
                try:
                    survey_id = kwargs['survey_id']
                    u = request.build_absolute_uri('/')[:-1].strip("/").replace('http:', 'https:')
                    murl = u + "/media/"
                    url = u + "/static/"
                    context = {}
                    survey = Survey.objects.get(pk=survey_id)
                    participant = Participant.objects.filter(client=survey.Survey_client).order_by('relationship')
                    user = 'Client'

                    rpt = FeedBackReport.objects.get(survey=survey, user=user)
                    context.update({"report": rpt})
                    question_obj = SurveyQuestion.objects.filter(survey_id=survey_id).order_by("created_ts")
                    questions = []
                    anslist = []

                    for index, q in enumerate(question_obj):
                        finalanslist = []
                        answers = list(Answer.objects.filter(question=q, survey=survey))
                        for a in answers:
                            try:
                                finalanslist.append(EditedAnswer.objects.get(prevanswer=a, user=user))
                            except:
                                finalanslist.append('null')
                        try:
                            questions.append(EditedSurveyQuestion.objects.get(question=q, user=user))
                        except:
                            questions.append('null')
                        finalanswers = list(zip(answers, finalanslist))
                        anslist.append(finalanswers)
                    quesanslist = list(zip(question_obj, questions, anslist))

                    try:
                        footer = ReportFooter.objects.get(report=rpt)
                        context.update({"footer": footer})
                        footertext = footer.text
                        footercolor = footer.color
                        footerfrontcolor = footer.frontfootercolor
                    except:
                        footertext = 'Creative Buffer Consultancy Private Limited| creativebuffer.com'
                        footercolor = '#61c1b9'
                        footerfrontcolor = '#d7de68'
                    try:
                        grp = Group.objects.filter(report=rpt).order_by('id')
                        context.update({"grps": grp})
                    except:
                        pass
                    relationobj = Relationship.objects.filter()
                    answrs = []
                    ansrecord = []
                    partirecord = []
                    for rel in relationobj:
                        count = 0
                        surcomcount = 0
                        answrs.clear()
                        data = Participant.objects.filter(client=survey.Survey_client, relationship=rel.id)
                        partirecord.append({'rel': rel.relation, 'id': rel.id, 'data': data})
                        for p in data:
                            ans = Answer.objects.filter(~Q(display='False'),survey=survey, participant=p)
                            if len(ans) > 0:
                                count = count + 1
                            try:
                                surcom = SurveyCampaign.objects.filter(survey=survey, participant=p)
                                if len(surcom) > 0:
                                    surcomcount = surcomcount + 1
                            except:
                                surcomcount = 0
                        if surcomcount != 0:
                            ansrecord.append(
                                {'rel': rel.relation, 'count': count, 'sur': (count / surcomcount) * 100, 'sentto': surcomcount})
                    try:
                        surcom = SurveyCampaign.objects.filter(survey=survey)
                        tosurcom = surcom[0].expires
                        context.update({"surcom": surcom, 'tosurcom': tosurcom})
                    except:
                        pass
                    
                    try:
                        baseimage = base64.b64encode(requests.get(u + survey.creator.coaches.logo.url).content)
                        encoded_url = 'data:image/{};base64,'.format(survey.creator.coaches.logo.url.split('.')[-1]) + str(baseimage.decode())
                        context.update({'encoded_url': encoded_url})
                    except:
                        pass
                    rpt.status = "Completed"
                    rpt.save()
                    buildurl = request.build_absolute_uri("/") + "client_data_view/" + code
                    
                    context.update(
                    {
                        "title": "Active Clients",
                        "draft":draft,
                        "clientobj": clientobj,
                        "relation": relationobj,
                        "parlist": partobjlist,
                        "url": buildurl,
                        "question_obj": question_obj,
                        "relationobj": relationobj,
                        "survey_id": survey_id,
                        "survey": survey,
                        "client": survey.Survey_client,
                        "urls": url,
                        "murl": murl,
                        "user": request.user.coach_full_name,
                        "coach_title": clientobj.coach.title,
                        "quesanslist": quesanslist,
                        "participant": participant,
                        "ansrecord": ansrecord,
                        "u": u,
                        'fotrtxt': footertext,
                        'fotrclr': footercolor,
                        'footerfrontcolor': footerfrontcolor,
                        "send_report":"send_report",
                        "today_date":str(datetime.datetime.now(timezone.utc).date()),
                    })
                    return render(request, self.template_name, context)

                except:
                    buildurl = request.build_absolute_uri("/") + "client_data_view/" + code
                    context.update(
                    {
                        "title": "Active Clients",
                        "clientobj": clientobj,
                        "relation": relationobj,
                        "parlist": partobjlist,
                        "url": buildurl,
                        "today_date": str(datetime.datetime.now(timezone.utc).date()),
                    }
                )

                return render(request, self.template_name, context)
            except:
                context.update({"title": "Active Clients", "message": "something went wrong"})
                return render(request, self.template_name, context)
        else:
            return redirect("logins")

    def post(self, request, client):
        today_date = datetime.datetime.now(timezone.utc).date()
        try:
            participantlist = []
            id = request.POST['id']
            option = request.POST['option']
            sur = Survey.objects.get(id=id)
            if option == 'BOTH':
                surcom = SurveyCampaign.objects.filter(~Q(response='Complete'), survey=sur)
            elif option == 'PARTIALRESPONSE':
                surcom = SurveyCampaign.objects.filter(response='PARTIALRESPONSE', survey=sur)
            elif option == 'NORESPONSE':
                surcom = SurveyCampaign.objects.filter(response='NORESPONSE', survey=sur)

            for i in surcom:
                participantlist.append(i.participant.email)

            sur.emailreminder = option
            sur.save()
            if sur.inst_bottom == None:
                inst_bottm = '''<p style="font-size:14px;color: #3b3b3b;display: block;width: 100%; font-weight:400;line-height:20px;margin:0px; ">Please reach out if you have any questions.</p> <br>
                                             <p style="font-size:14px;color: #3b3b3b;display: block;width: 100%; font-weight:400;line-height:20px;margin:0px;">Best regards,</p><br>'''
            else:
                inst_bottm = sur.inst_bottom
            try:
                enddate = timezone.localtime(sur.end_datetime.replace(tzinfo=pytz.utc), pytz.timezone('America/New_York')).strftime("%B %d")
            except:
                try:
                    enddate = (sur.start_datetime.date() + timedelta(21)).strftime("%B %d")
                except:
                    enddate = (timezone.localtime(datetime.datetime.now(pytz.UTC), pytz.timezone('America/New_York'))+ timedelta(21)).strftime("%B %d")
            # if sur.inst_top == None:
            
            inst_top = '<p style="font-size:14px;color: #3b3b3b; font-weight:400;line-height:20px; "><span class="first-text">This is a reminder to provide feedback for {} {} by </span> <span class="date-text">{}</span><input type="date" id="datepicker" class="datepicker" min="{}" style="display: none;" />.<span class="second-text"> Click the button below to get started.</span></p>'.format(
                    sur.Survey_client.first_name, sur.Survey_client.last_name, enddate, today_date)
            # else:
            #     inst_top = sur.inst_top
            PARTIC = surcom.values_list()
            partobj = list(PARTIC)
            coachname = sur.creator.coach_full_name
            title = sur.creator.coaches.title
            company = sur.creator.coaches.company_name
            email = sur.creator.email
            return JsonResponse(
                {'success': 'Data updated', 'surinst': sur.instructions, 'surbtm': inst_bottm, 'surtop': inst_top,
                 'dt': enddate, 'partcount' : len(surcom), 'participants': partobj,"coachname": coachname,
                 'title': title, "company": company, "email": email, "participantlist": participantlist})
        except:
            id = request.POST['id']
            try:
                option1 = request.POST['option1']
                option2 = request.POST['option2']
                option3 = request.POST['option3']
                sur = Survey.objects.get(id=id)
                sur.surveymarked = option1
                sur.whenemailreminder = option2
                sur.emailreminder = option3
                sur.save()
                if sur.inst_bottom == None:
                    inst_bottm = '''<p style="font-size:14px;color: #3b3b3b;display: block;width: 100%; font-weight:400;line-height:20px;margin:0px;">Please reach out if you have any questions.</p><br>
                                  <p style="font-size:14px;color: #3b3b3b;display: block;width: 100%; font-weight:400;line-height:20px;margin:0px;">Best regards,</p><br>'''
                else:
                    inst_bottm = sur.inst_bottom
                try:
                    enddate =timezone.localtime(sur.end_datetime.replace(tzinfo=pytz.utc), pytz.timezone('America/New_York')).strftime("%B %d")
                except:
                    try:
                        enddate = (sur.start_datetime.date() + timedelta(21)).strftime("%B %d")
                    except:
                        enddate = (timezone.localtime(datetime.datetime.now(pytz.UTC), pytz.timezone('America/New_York'))+ timedelta(21)).strftime("%B %d")
                if sur.inst_top == None:

                    inst_top = ''' 
                                  <p style="font-size:14px;color: #3b3b3b; font-weight:400;line-height:20px;margin:0px; "><span class="first-text">Thank you for agreeing to provide feedback for {} {}. Please complete the survey by </span> <span class="date-text">{}</span><input type="date" id="datepicker" class="datepickerr" min="{}" style="display: none;" />.<span class="second-text"> Click the button below to get started.</span></p>'''.format(sur.Survey_client.first_name,sur.Survey_client.last_name,enddate,today_date)
                else:
                    inst_top = sur.inst_top
                return JsonResponse({'success': 'Data updated', 'surinst': sur.instructions, 'surbtm': inst_bottm, 'surtop': inst_top, 'dt': enddate})
            except:
                id = request.POST['id']
                sur = Survey.objects.get(id=id)
                surcom = SurveyCampaign.objects.filter(survey=sur)
                if sur.inst_bottom == None:
                    inst_bottm = '''<p style="font-size:14px;color: #3b3b3b;display: block;width: 100%; font-weight:400;line-height:20px;margin:0px;">Please reach out if you have any questions.</p><br>
                                  <p style="font-size:14px;color: #3b3b3b;display: block;width: 100%; font-weight:400;line-height:20px;margin:0px;">Best regards,</p><br>'''
                else:
                    inst_bottm = sur.inst_bottom
                try:
                    enddate = timezone.localtime(sur.end_datetime.replace(tzinfo=pytz.utc), pytz.timezone('America/New_York')).strftime("%B %d")
                except:
                    try:
                        enddate = (sur.start_datetime.date() + timedelta(21)).strftime("%B %d")
                    except:
                        enddate = (timezone.localtime(datetime.datetime.now(pytz.UTC), pytz.timezone('America/New_York'))+ timedelta(21)).strftime("%B %d")
                if sur.rem_inst_top == None:
                    inst_top = ''' 
                        <p style="font-size:14px;color: #3b3b3b; font-weight:400;line-height:20px; "><span class="first-text">This is a reminder to provide feedback for {} {} by </span> <span class="date-text">{}</span><input type="date" id="datepicker" class="datepicker min="{}" style="display: none;" />.<span class="second-text"> Click the button below to get started.</span></p>'''.format(
                        sur.Survey_client.first_name, sur.Survey_client.last_name, enddate,today_date)
                else:
                    inst_top = sur.rem_inst_top
                PARTIC = surcom.values_list()
                partobj = list(PARTIC)
                return JsonResponse(
                    {'success': 'Data updated', 'surinst': sur.instructions, 'surbtm': inst_bottm, 'surtop': inst_top,
                     'dt': enddate, 'partcount': len(surcom), 'participants': partobj})

    def delete(self, request, client):
        clientobj = core_model.Clients.objects.get(id=client)
        clientobj.profile_img = "static/images/theme/default.png"
        clientobj.save()
        return JsonResponse({'success':'Image removed', 'url': clientobj.profile_img.url})


class ClientListjsonview(ServerSideDatatableView):
    queryset = core_model.Clients.objects.all()
    columns = ['profile_img', 'first_name', 'company_name', 'email', 'id', 'coach__first_name']


class ClientList(ServerSideDatatableView):
    """
    Client list view
    """

    template_name = "core/theme/client_list.html"

    def get(self, request, *args, **kwargs):
        context = {}
        paginate_by = settings.PAGINATED_BY

        if request.user.is_authenticated:
            if request.user.is_admin or request.user.is_superuser:
                context.update({"title": "Active Clients"})
                return render(request, self.template_name, context)
            else:
                clientlist = core_model.Clients.objects.filter(
                    coach_id=request.user.coaches.id
                ).order_by("-id")

            paginator = Paginator(clientlist, paginate_by)
            page = self.request.GET.get("page")
            try:
                clientlistobj = paginator.page(page)
            except PageNotAnInteger:
                clientlistobj = paginator.page(1)
            except EmptyPage:
                clientlistobj = paginator.page(paginator.num_pages)
            context.update({"title": "Active Clients", "clientlist": clientlistobj, 'index':clientlistobj.paginator.num_pages*(clientlistobj.number-1)})
            return render(request, self.template_name, context)
        else:
            return redirect("logins")


class UpdateClientProfileImg(TemplateView):
    """
    this view called when click on profile picture of client
    """

    def post(self, request, client, *args, **kwargs):
        if request.is_ajax and request.user.is_authenticated and request.FILES:
            try:
                clientobj = core_model.Clients.objects.filter(id=int(client)).first()
                if clientobj:
                    clientobj.profile_img = request.FILES["addclientprofilepict"]
                    clientobj.save()
                    return JsonResponse({"image_url": clientobj.profile_img.url})
                else:
                    return JsonResponse(
                        {"fail": "Something went wrong please try again"}
                    )
            except:
                return JsonResponse({"fail": "Something went wrong please try again"})
        else:
            return redirect("logins")


class ClientListDT(BaseDatatableView):
    order_columns = ["client_id", "first_name", "company_name", "survey_status", "complete_survey_report_status"]

    def get_initial_queryset(self):
        clientlist = core_model.ClientDatatableView.objects.filter(coach_id=self.request.user.coaches.id, mode=False)
        return clientlist

    def filter_queryset(self, qs):

        search = self.request.GET.get('search[value]', None)
        if search:
            qs = qs.filter(Q(complete_name__icontains=search) | Q(company_name__icontains
                    =search) | Q(survey_status__icontains=search) | Q(survey_report_status__icontains=search))
        return qs

    def prepare_results(self, qs):
        json_data = []
        for item in qs:
            json_data.append(
                { "client_id": item.client_id,
                  "complete_name": item.complete_name,
                  "company_name": item.company_name,
                  "survey_status": item.survey_status,
                  "survey_report_status": item.survey_report_status,
                  "complete_survey_report_status" : item.complete_survey_report_status,
                  "profile_img": item.profile_img
                })
        return json_data




def send_email(request):
    conn = http.client.HTTPSConnection("api.sendgrid.com")
    try:
        payload = "{}"
        headers = {'authorization': "Bearer {}".format(authkey)}
        conn.request("GET", "/v3/verified_senders", payload, headers)
        res = conn.getresponse()
        data = res.read()
        data.decode("utf-8")
        y = json.loads(data)
        sendername =request.user.coaches.first_name+request.user.coaches.last_name
        toname = request.POST['cname']
        senderemail = sendername+'@leadershiprealitycheck.com'
        toemail = request.POST['cemail']
        subject = request.POST['csubject']
        desc = request.POST['cdesc']
        url = request.POST['url']
        sg = sendgrid.SendGridAPIClient(api_key=authkey)
        from_email = Email(senderemail)
        to_email = To(toemail)
        replyto = ReplyTo(request.user.email, )
        content = Content("text/plain", desc)
        message = Mail(
            from_email=from_email,
            to_emails=to_email,
            subject=subject,
            html_content=Content("text/html", render_to_string("core/theme/add_participant_email_template.html", ).format(
                request.POST['cdesc'].format("class='custom_button' sytle='width:110px'", request.POST['url']))))
        message.reply_to = replyto
        try:
            response = sg.send(message)
            addinvite = core_model.AddPaticipantByOther.objects.get(
                code=request.POST['url'].split('client_data_view/')[1])
            addinvite.status = True
            addinvite.save()
            return JsonResponse({'success': 'Email sent.'})
        except Exception as e:
            return JsonResponse({'fail': 'Email not sent'})
    except:
        return JsonResponse({'fail': 'Your email is not varified'})


def Email_Client_Intake(request):
    try:
        sendername =request.user.coaches.first_name+request.user.coaches.last_name
        # toname = request.POST['fname']+' '+request.POST['lname']
        client = Clients.objects.get(id=request.POST['client'])
        toname = client.first_name
        senderemail = sendername+'@leadershiprealitycheck.com'
        toemail = request.POST['email']
        sg = sendgrid.SendGridAPIClient(api_key=authkey)
        from_email = Email(senderemail)
        to_email = To(toemail)
        replyto = ReplyTo(request.user.email)
        upper_text = request.POST['upper-text']
        bottom_text = request.POST['bottom-text']
        cli_cam = ClientCampaign.objects.create(client=client)
        if request.user.has_profile_image:
            intake = Intake.objects.get(coach=request.user.coaches,client=client)
            intake.coachimg = UserAvatar.objects.get(user=request.user).avatar
            intake.logo = request.user.coaches.logo
            intake.save()
            image = UserAvatar.objects.get(user=request.user).avatar
            src = 'https://www.leadershiprealitycheck.com/' + image.url
            img = '<img src="' + src + '" style="height: 50px;width: 50px;" >'
            data = {"client": toname,
                 "uid": 'https://www.leadershiprealitycheck.com/client_intake_response/' + str(cli_cam.uid),
                 'user': request.user,
                 'img': src,
                 'upper_text': upper_text,
                 'bottom_text': bottom_text
                 }
        else:
            img = ''
            data = {"client": toname,
                 "uid": 'https://www.leadershiprealitycheck.com/client_intake_response/' + str(cli_cam.uid),
                 'user': request.user,
                 'upper_text': upper_text,
                 'bottom_text': bottom_text
                 }
        message = Mail(
            from_email=from_email,
            to_emails=to_email,
            subject=request.POST['subject'],
            html_content=render_to_string(
                "core/theme/client_intake_email.html",
                data,
            ),
        )
        message.reply_to = replyto
        try:
            sg.send(message)
            client.intake_status = True
            client.save()
            return JsonResponse({'success': 'Email sent.'})
        except Exception as e:
            cli_cam.delete()
            return JsonResponse({'fail': 'Email not sent'})
    except:
        return JsonResponse({'fail': 'Your email is not varified'})


class Client_Intake_Response(TemplateView):
    template_name = "core/theme/intake_response.html"

    def get(self, request, u_id):
        try:
            cli_comp = ClientCampaign.objects.get(uid=u_id)
            if cli_comp.status == True:
                return HttpResponse('You have already completed your Intake Form.')
            questions = CoachIntakeQuestions.objects.filter(coach=cli_comp.client.coach, client=cli_comp.client).order_by('id')
            intk = Intake.objects.get(coach=cli_comp.client.coach, client=cli_comp.client)
            client_ans = ClientIntakeAnswer.objects.filter(client=cli_comp.client)
            files = ClientIntakeFiles.objects.filter(coach=cli_comp.client.coach, client=cli_comp.client)
            return render(request, self.template_name, {'ques': questions, 'intk': intk, "uid": u_id,
                        'clientintakefiles':files, "ans": client_ans, "user": cli_comp.client.coach.user})
        except:
            return HttpResponse('Invalid Link.')

    def delete(self, request, u_id):
        try:
            ClientIntakeFiles.objects.get(id=int(request.GET['id'])).delete()
        except:
            ClientIntakeFiles.objects.get(id=int(request.body.decode())).delete()
        return JsonResponse({'success': 'file deleted'})


class IntakeResponses(TemplateView):
    template = "pdf-generate.html"

    def post(self, request, *args, **kwargs):
        client_camp = ClientCampaign.objects.get(uid=request.POST['u_id'])
        client = client_camp.client
        try:
            for question in CoachIntakeQuestions.objects.filter(coach=client.coach, client=client):
                ans = request.POST[str(question.id)]
                try:
                    client_ans = ClientIntakeAnswer.objects.get(question=question, client=client)
                    client_ans.answer = ans
                    client_ans.save()
                except:
                    ClientIntakeAnswer.objects.create(question=question, client=client, answer=ans)
            try:
                request.POST['submit']
                client_camp.status = True
                client_camp.save()
            except:
                pass
        except:pass
        try:
            imgntuploaded = []
            fl = request.FILES.getlist('file')
            for img in fl:
                try:
                        ClientIntakeFiles.objects.create(file=img, coach=client.coach, client=client)
                except:
                    imgntuploaded.append(img)
            if len(imgntuploaded) > 0:
                return JsonResponse({'error': 'image issue', 'imgs': imgntuploaded})
        except:
            pass
        return JsonResponse({"Psuccess": "Thank you for completing the Intake Form. Your response has been received."})


class survey_to_response(TemplateView):
    template_name = "core/theme/survey_to_send.html"
    template = "core/theme/onequeperpage.html"

    def get(self, request, u_id):
        try:
            sur_comp = SurveyCampaign.objects.get(uid=u_id)
            if(sur_comp.status == True):
                return HttpResponse('Thank you for participating. Your response has been received.')
            else:
                if sur_comp.expires.date() >= timezone.localtime(datetime.datetime.now(pytz.UTC), pytz.timezone('America/New_York')).date():
                    context = {"sur_id": sur_comp.survey.id}
                    try:
                        surveyobj = sur_comp.survey
                    except:
                        surveyobj = None
                    if surveyobj.status == 'CT':
                        return HttpResponse('The survey is closed. You have no longer access to this survey.')
                    try:
                        ques = SurveyQuestion.objects.filter(survey=surveyobj).order_by("created_ts")
                        context.update({"ques": ques})
                    except:
                        pass
                    try:
                        conque = ConfidentialQuestions.objects.get(survey_id=surveyobj.id)
                        context.update({"conque": conque})
                    except:
                        pass
                    try:
                        answers = Answer.objects.filter(participant=sur_comp.participant, survey=surveyobj)
                        try:
                            confanswer = ConfidentialAnswer.objects.get(participant=sur_comp.participant, question=conque)
                            context.update({"confans": confanswer})
                        except:
                            pass
                        context.update({"ans": answers})
                    except:
                        pass
                    context.update({"surveyobj": surveyobj, 'uid': str(u_id)})
                    if surveyobj.display == "onepageallque":
                        return render(request, self.template_name, context=context)
                    else:
                        return render(request, self.template, context=context)
                else:
                    return HttpResponse('Link Expired.')
        except:
            return HttpResponse('Invalid Link.')


def UserhasClient(request):
    cli = Clients.objects.filter(coach=request.user.coaches).exists()
    return JsonResponse({'success': 'success'})


def PaymentMode(request, mode):
    cli = Coaches.objects.get(user=request.user)
    cli.paymentmode = mode
    cli.save()
    return JsonResponse({'success': 'success'})


def save_content(request):
    survey_id = request.POST['survey_id']
    feedback = FeedBackReport.objects.get(survey__pk=survey_id, user="Client")
    try:
        subject = request.POST['sub']
        feedback.mail_subj = subject
    except:
        pass
    try:
        content = request.POST['cont']
        feedback.mail_cont = content
    except:
        pass
    feedback.save()
    return JsonResponse({"success":"success"})


def send_survey(request):
    conn = http.client.HTTPSConnection("api.sendgrid.com")
    try:
        payload = "{}"
        headers = {'authorization': "Bearer {}".format(authkey)}
        conn.request("GET", "/v3/verified_senders", payload, headers)
        res = conn.getresponse()
        data = res.read()
        data.decode("utf-8")
        y = json.loads(data)
        id = request.POST['id']
        sur = Survey.objects.get(id=id)
        sur.instructions = request.POST['instr']
        sur.save()
        sendername = sur.creator.coach_full_name
        senderemail =sur.creator.coaches.first_name+sur.creator.coaches.last_name + '@leadershiprealitycheck.com'
        sent = sur.total_sent
        notsent = 0
        actualsent = 0
        try:
            option = request.POST['option']
            if option == 'BOTH':
                surcompaign = SurveyCampaign.objects.filter(~Q(response='Complete'), survey=sur)
            elif option == 'PARTIALRESPONSE':
                surcompaign = SurveyCampaign.objects.filter(response='PARTIALRESPONSE', survey=sur)
            elif option == 'NORESPONSE':
                surcompaign = SurveyCampaign.objects.filter(response='NORESPONSE', survey=sur)

            surcom = surcompaign
            for sc in surcompaign:
                if sc.status==True:
                    surcom = surcom.exclude(id=sc.id)
            sur.rem_inst_bottom = request.POST['bottom_text']
            sur.rem_inst_top = request.POST['upper-text']
            sur.save()

            for email in request.POST['email'].split(','):
                i = SurveyCampaign.objects.get(participant=Participant.objects.get(email=email,
                                                                                client=sur.Survey_client), survey=sur)
                toemail = i.participant.email
                sg = sendgrid.SendGridAPIClient(api_key=authkey)
                from_email = Email(senderemail)
                to_email = To(toemail)
                instrctn = html.unescape(request.POST['instr'])
                btminstrctn = html.unescape(request.POST['bottom_text'])
                uprinstrctn = html.unescape(request.POST['upper-text'])
                try:
                    image = UserAvatar.objects.get(user=sur.Survey_client.coach.user).avatar
                    src = 'https://www.leadershiprealitycheck.com/' + image.url
                    bs64img = 'data:image/{};base64,'.format(src.split('.')[-1]) + str(base64.b64encode(requests.get(src).content).decode())
                    img = '<img src="' + src + '" style="height: 50px;width: 50px;" >'
                except:
                    img = ''
                try:
                    enddate = timezone.localtime(sur.end_datetime.replace(tzinfo=pytz.utc), pytz.timezone('America/New_York')).strftime("%B %d")
                except:
                    try:
                        enddate = (sur.start_datetime.date() + timedelta(21)).strftime("%B %d")
                    except:
                        enddate = (timezone.localtime(datetime.datetime.now(pytz.UTC), pytz.timezone('America/New_York'))+ timedelta(21)).strftime("%B %d")
                replyto = ReplyTo(sur.creator.email, )
                message = Mail(from_email=from_email,to_emails=to_email, subject=request.POST['rem_subject'],
                    html_content=Content("text/html",render_to_string("core/theme/reminder_mail.html", ).format(
                                       core_model.Participant.objects.get(email=toemail, client=sur.Survey_client).first_name,
                        uprinstrctn,instrctn,'https://www.leadershiprealitycheck.com/survey-to-response/' + str(i.uid),
                                       btminstrctn, sendername,sur.Survey_client.coach.title,
                                       sur.Survey_client.coach.company_name,sur.Survey_client.coach.user.email,img)))
                message.reply_to = replyto
                try:
                    response = sg.send(message)
                    SurveyReminder.objects.create(participant=i.participant,survey=i.survey, survey_compaign=i)
                    actualsent = actualsent + 1

                except Exception as e:
                    notsent = notsent + 1

            if actualsent == 0:
                return JsonResponse({'success': 'Survey not sent.'})
            return JsonResponse({'success': 'Reminder successfully sent to {} participants.'.format(actualsent)})

        except:
            sur.inst_bottom = request.POST['bottom_text']
            sur.inst_top = request.POST['upper-text']
            sur.save()
            if sur.total_sent == 0 and request.user.coaches.skipplan == False:                
                try:
                    if UserPlan.objects.filter(coach=request.user.coaches).count() == 0:
                        return JsonResponse({'fail': "You can't send survey as you don't have any active plan. Please buy your plan. "})
                    for uplan in UserPlan.objects.filter(coach=request.user.coaches):
                        try:
                            upinfo = UserPlanInfo.objects.get(uplan=uplan)
                            if upinfo.status() == True:
                                upinfo.surveyused = upinfo.surveyused + 1
                                upinfo.save()
                            if upinfo.surveyleft() <= 0:
                                if upinfo.surveyleft() == 0:
                                    upinfo.status() == False
                                    upinfo.save()
                                else:
                                    Notification.objects.create(coach=request.user.coaches,
                                                                description="You don't have any surveys remaining in your account. Go to 'My Account' from your profile page to Purchase Surveys.",
                                                                title="No survey left")
                                    request.session['has_notification'] = True
                                    return JsonResponse({'fail': "You can't send survey as you don't have any active plan. Please upgrade your plan. "})
                        except:
                            if upinfo.surveyleft() <= 0:
                                if upinfo.surveyleft() == 0:
                                    upinfo.status() == False
                                    upinfo.save()
                                else:
                                    Notification.objects.create(coach=request.user.coaches,
                                                                description="You don't have any surveys remaining in your account. Go to 'My Account' from your profile page to Purchase Surveys.",
                                                                title="No survey left")
                                    request.session['has_notification'] = True
                                    return JsonResponse({
                                                 'fail': "You can't send survey as you don't have any active plan. Please upgrade your plan. "})
                except:
                    Notification.objects.create(coach=request.user.coaches,
                                                description="You don't have any Plan. Please buy your plan.",
                                                title="No active Plan")
                    request.session['has_notification'] = True
                    return JsonResponse({'fail': "You can't send survey as you don't have any active plan. Please buy your plan. "})
            for i in request.POST['email'].split(','):
                try:
                    SurveyCampaign.objects.get(
                        participant=core_model.Participant.objects.get(email=i, client=sur.Survey_client), survey=sur)
                except:
                    end = timezone.localtime(datetime.datetime.now(pytz.UTC), pytz.timezone('America/New_York')) + timedelta(21)
                    sur_uid = SurveyCampaign.objects.create(expires=end,
                        participant=core_model.Participant.objects.get(email=i, client=sur.Survey_client), survey=sur)

                    uid = sur_uid.uid
                    toemail = i
                    sg = sendgrid.SendGridAPIClient(api_key=authkey)
                    from_email = Email(senderemail)
                    to_email = To(toemail)
                    instrctn = html.unescape(request.POST['instr'])
                    btminstrctn = html.unescape(request.POST['bottom_text'])
                    uprinstrctn = html.unescape(request.POST['upper-text'])
                    try:
                        image = UserAvatar.objects.get(user=sur.Survey_client.coach.user).avatar
                        src = 'https://www.leadershiprealitycheck.com/' + image.url
                        bs64img = 'data:image/{};base64,'.format(src.split('.')[-1]) + str(
                            base64.b64encode(requests.get(src).content).decode())
                        img = '<img src="' + src + '" style="height: 50px;width: 50px;"> '
                    except:
                        img = ''
                    try:
                        enddate = timezone.localtime(sur.end_datetime.replace(tzinfo=pytz.utc), pytz.timezone('America/New_York')).strftime("%B %d")
                    except:
                        try:
                            enddate = (sur.start_datetime.date() + timedelta(21)).strftime("%B %d")
                        except:
                            enddate = (timezone.localtime(datetime.datetime.now(pytz.UTC), pytz.timezone('America/New_York'))+ timedelta(21)).strftime("%B %d")
                    replyto = ReplyTo(request.user.email, )
                    message = Mail(from_email=from_email,to_emails=to_email,subject=request.POST['subject'],
                        html_content=Content("text/html",render_to_string("core/theme/mail.html",).format(
                                             core_model.Participant.objects.get(email=i, client=sur.Survey_client).first_name, uprinstrctn, instrctn,
                                             'https://www.leadershiprealitycheck.com/survey-to-response/'+str(uid),
                                             btminstrctn, sendername, sur.Survey_client.coach.title,
                                             sur.Survey_client.coach.company_name, sur.Survey_client.coach.user.email, img)))
                    message.reply_to = replyto
                    try:
                        response = sg.send(message)
                        if sur.status == 'US':
                            sur.status = 'AT'
                            sur.start_datetime = datetime.datetime.now(timezone.utc)
                            sur.end_datetime = datetime.datetime.now(timezone.utc) + timedelta(21)
                        sent = sent+1
                        sur.total_sent = sent
                        sur.save()
                        actualsent=actualsent+1
                    except Exception as e:
                        notsent = notsent + 1
            if notsent > 0:
                return JsonResponse({'success': 'Survey not sent.'})
            return JsonResponse({'success': 'Survey successfully sent to {} participants.'.format(actualsent)})#Survey Sent to {} client, and {} sent fail '.format(sent,notsent)})
    except:
        id = request.POST['id']
        sur = Survey.objects.get(id=id)
        sur.instructions = request.POST['instr']
        sur.rem_inst_bottom = request.POST['bottom_text']
        sur.rem_inst_top = request.POST['upper-text']
        sur.save()
        return JsonResponse({'success': 'Successfuly saved data in db.'})


class GetSurveyInfo(TemplateView):
    template_name = "core/theme/congo.html"

    def post(self, request):
        sur = Survey.objects.get(id=request.POST['sur_id'])
        tosendmails = []
        alreadysentmails = []
        try:
            try:
                request.POST['info']
                return JsonResponse({'status': sur.emailreminder})
            except:
                request.POST['emails'].split(',')
                if sur.total_sent == 0 and request.user.coaches.skipplan == False:
                    try:
                        if UserPlan.objects.filter(coach=request.user.coaches).count() == 0:
                            return JsonResponse(
                                {'fail': "You can't send survey as you don't have any active plan. Please buy your plan. "})
                        for uplan in UserPlan.objects.filter(coach=request.user.coaches):
                            try:
                                upinfo = UserPlanInfo.objects.get(uplan=uplan)
                                if upinfo.surveyleft() <= 0:
                                        return JsonResponse({
                                            'fail': "You don't have any surveys remaining in your account. Go to 'My Account' from your profile page to Purchase Surveys."})
                            except:
                                if upinfo.surveyleft() <= 0:

                                        return JsonResponse({
                                            'fail': "You don't have any surveys remaining in your account. Go to 'My Account' from your profile page to Purchase Surveys."})
                    except:

                        return JsonResponse(
                            {'fail': "You can't send survey as you don't have any active plan. Please buy your plan."})
                for i in request.POST['emails'].split(','):
                    try:
                        SurveyCampaign.objects.get(
                            participant=core_model.Participant.objects.get(email=i, client=sur.Survey_client), survey=sur)
                        alreadysentmails.append(i)
                    except:
                        if len(i) !=0:
                            tosendmails.append(i)
                return JsonResponse({'tosend': tosendmails, 'alreadysent': alreadysentmails})
        except:
            campaign = SurveyCampaign.objects.filter(survey=sur)
            cam = campaign.values_list()
            campaignlist = list(cam)
            return JsonResponse({'campaign': campaignlist})


class PaymentSuccess(TemplateView):

    template_name = "core/theme/congo.html"

    def get(self, request):
        return redirect('dashboard')

    def post(self, request, type):
        plan = Plan.objects.get(title=type)
        uplan = UserPlan.objects.create(coach=request.user.coaches, plan=plan)
        uinfo = UserPlanInfo.objects.create(coach=request.user.coaches, uplan=uplan,  persurveyprize=plan.prizepersurvey, type=request.POST['type'],
                 servicesinclude=plan.servicesinclude, noofsurvey=plan.noofsurvey, annuallicencefee=request.POST['annualfee'],
                 title=plan.title,totalfee=(int(request.POST['prize'])*int(request.POST['pack']))+int(request.POST['annualfee']))
        if request.POST['redirect'] == "dashboard":
            return redirect('dashboard')
        else:
            return redirect('my-account')


class MyAccount(TemplateView):

    template_name = "core/theme/my_account.html"

    def get(self, request):

        if request.user.is_authenticated:
            plan = Plan.objects.all()
            try:
                userplan = UserPlan.objects.filter(coach=request.user.coaches)
                allplaninfo = UserPlanInfo.objects.filter(coach=request.user.coaches)
                surveyupgrade = SurveyUpgraded.objects.filter(coach=request.user.coaches).order_by("-created_ts")
                for uplan in userplan:
                    if UserPlanInfo.objects.get(uplan=uplan).status() == True:
                        upinfo = UserPlanInfo.objects.get(uplan=uplan)
                try:
                    return render(request, self.template_name, {'plan': plan, 'userplan': userplan, 'upinfo': upinfo,
                            'surveyupgrade':surveyupgrade,'allplaninfo': allplaninfo.exclude(id=upinfo.id), 'key': key})
                except:
                    return render(request, self.template_name, {'noplan': plan, 'userplan': userplan,
                                                'surveyupgrade':surveyupgrade,'allplaninfo': allplaninfo, 'key': key})
            except:
                return render(request, self.template_name, {'noplan': plan, 'key': key})
        else:
            return redirect("logins")


    def post(self, request):
        return render(request, self.template_name)


class MessageHistory(TemplateView):

    template_name = "core/theme/message-history.html"

    def get(self, request, id):
        if not request.user.is_authenticated:
            return redirect("logins")
        sur = Survey.objects.get(id=int(id))
        survey_compaign = SurveyCampaign.objects.filter(survey=sur).order_by("-id")
        reminder = SurveyReminder.objects.filter(survey=sur).order_by("-id")
        return render(request, self.template_name,{'sur_comp': survey_compaign, 'reminder': reminder})

    def post(self, request):
        return render(request, self.template_name)


class Congo(TemplateView):

    template_name = "core/theme/congo.html"

    def delete(self, request):
        participant = core_model.Participant.objects.get(id=int(request.body.decode("utf-8").split('id=')[1].split('&')[0]))
        id = participant.id
        participant.delete()
        return JsonResponse({'id': id})


    def get(self, request):
        participantlist = core_model.Participant.objects.filter(
                        client_id=core_model.Clients.objects.get(id=int(request.GET['cid']))).order_by("-id")
        context = {}
        context.update({"title": "Participant", "parlist": participantlist})
        return render(request, self.template_name, context)

    def post(self, request):
        fn = request.POST['data[fname]']
        ln = request.POST['data[lname]']
        em = request.POST['data[email]']
        rl = request.POST['data[rel]']
        id = request.POST['data[id]']
        try:
            client = core_model.Clients.objects.get(id=id)
            try:
                coach = core_model.AddPaticipantByOther.objects.get(code=request.POST['data[code]']).coach
            except:
                coach = request.user.coaches
            try:
                core_model.Participant.objects.get(email=em, client=client)
                return JsonResponse(
                    {'error': 'Participant with same email already exists.','fname':fn,'lname':ln,'rel':rl,'email':em})
            except:
                core_model.Participant.objects.create(
                    email=em,
                    first_name=fn,
                    last_name=ln,
                    relationship_id=rl,
                    client=core_model.Clients.objects.get(id=id),
                ).save()
            participantlist = core_model.Participant.objects.filter(client_id=client).order_by("-id")
            datalist=[]
            for p in participantlist:
                datalist.append([p.first_name, p.last_name, p.email, p.relationship.relation, p.id])
            return JsonResponse({'data': datalist})
        except:
            return JsonResponse({'error': 'You are not logged in.'})
        return render(request, self.template_name, )

    def put(self, request):
            data = json.loads(request.body.decode('utf8'))
            fn = data['fname']
            ln = data['lname']
            em = data['email']
            rl = data['rel']
            participant_id = data['participant_id']
            client_id = data['id']
            if core_model.Participant.objects.filter(email=em, client__id=client_id ).exclude(id=int(participant_id)).exists():
                return JsonResponse({'fail': "fail"})
            else:
                part = core_model.Participant.objects.get(id=participant_id)
                part.email = em
                part.first_name = fn
                part.last_name = ln
                part.relationship_id = rl
                part.save()
                datalist = []
                datalist.append([part.first_name, part.last_name, part.email, part.relationship.relation, part.id])
                return JsonResponse({'data': datalist, 'id': part.id})
            return render(request, self.template_name, )


class ParticipantDT(BaseDatatableView):

    def get_initial_queryset(self):
        try:
            linkobj = core_model.AddPaticipantByOther.objects.get(code=self.kwargs['code'])
            client_id = self.kwargs['code'].split('code')[1]
            if linkobj.is_used is False:
                pass
            else:
                return HttpResponse('<h1>Link Expired<h1>')
        except:
            client_id = self.kwargs['code']
            # return HttpResponse('<h1>Invalid Link <h1>')
        participantlist = core_model.Participant.objects.filter(client_id=client_id).order_by("-id")

        return participantlist


class client_data_view(TemplateView):
    template_name = "core/theme/single-data-page.html"

    def get(self, request, *args, **kwargs):
        try:
            linkobj = core_model.AddPaticipantByOther.objects.get(code=kwargs['code'])
            if linkobj.is_used is False:
                pass
            else:
                return HttpResponse('<h1>Link Expired<h1>')
        except:
            return HttpResponse('<h1>Invalid Link <h1>')

       # settings.PAGINATED_BY
       #  participantlist = core_model.Participant.objects.filter(
       #      client_id=kwargs['code'].split('code')[1]
       #  ).order_by("-id")

        # paginator = Paginator(participantlist, paginate_by)
        # page = request.GET.get("page")
        # try:
        #     partobjlist = paginator.page(page)
        # except PageNotAnInteger:
        #     partobjlist = paginator.page(1)
        # except EmptyPage:
        #     partobjlist = paginator.page(paginator.num_pages)
        context = {}
        relationobj = core_model.Relationship.objects.all()
        context.update({"relation": relationobj, "linkobj":linkobj})
        return render(request, self.template_name, context)


def get_random_string(length=None):
    length = 8
    letters = string.ascii_lowercase
    ct = datetime.datetime.now()
    ts = str(int(ct.timestamp()))
    result_str = "".join(random.choice(letters) for i in range(length))
    code = result_str + ts
    if (len(code)) > 20:
        return code[:20]
    else:
        return code


class ArchiveClient(TemplateView):
    template_name = "core/theme/archive_clients.html"


    def get(self, request, *args, **kwargs):
        context = {}
        context.update({"title": "Dashboard"})
        if request.user.is_authenticated:
            if request.user.is_admin or request.user.is_superuser:
                active_count = Survey.objects.filter(status="AT").count()
                unsent_count = Survey.objects.filter(status="UT").count()
                completed_count = Survey.objects.filter(status="CT").count()
                return render(request, self.template_admin_name, context)
            else:
                if request.session.get('login', False):
                    context.update({"login": False})
                else:
                    context.update({"login": True})
                clientlist = core_model.Clients.objects.filter(
                    coach_id=request.user.coaches.id, mode=True
                ).order_by("-id")
                surveylist = []
                rptlist = []
                for cli in clientlist:
                    try:
                        sur = Survey.objects.get(Survey_client=cli)
                        surveylist.append(sur)
                        rpt = FeedBackReport.objects.get(survey=sur, user='Client')
                        rptlist.append(rpt)

                    except:
                        pass
                paginate_by = settings.PAGINATED_BY
                paginator = Paginator(clientlist, paginate_by)
                totalpage = paginator.page_range
                page = self.request.GET.get("page")
                try:
                    clientlistobj = paginator.page(page)
                except PageNotAnInteger:
                    clientlistobj = paginator.page(1)
                except EmptyPage:
                    clientlistobj = paginator.page(paginator.num_pages)
                context.update({"client": clientlistobj, "surveylist": surveylist, "reportlist": rptlist})
                return render(request, self.template_name, context)
        else:
            return redirect("logins")

        # arcclient = core_model.Clients.objects.all()
        # return render(request, self.template_name, {'client': arcclient})

    def post(self, request, *args, **kwargs):
        arcclient = core_model.Clients.objects.get(id=request.POST['id'])
        if request.POST['mode'] == 'true':
            arcclient.mode = True
        else :
            arcclient.mode = False
        arcclient.save()
        return JsonResponse({'success': 'client archived'})


class AllInvites(TemplateView):
    template_name = "core/theme/send-invites.html"

    def get(self, request, *args, **kwargs):
        context = {}
        invites = core_model.AddPaticipantByOther.objects.filter(coach=request.user.coaches, status= True).order_by("-id")

        context.update({"invites": invites})
        return render(request, self.template_name, context)

    def delete(self, request, *args, **kwargs):
        context = {}
        core_model.AddPaticipantByOther.objects.get(id=int(request.body.decode().split('=')[1])).delete()
        invites = core_model.AddPaticipantByOther.objects.filter(coach=request.user.coaches, status= True).order_by("-id")
        context.update({"invites": invites})
        return render(request, self.template_name, context)

    def put(self, request, *args, **kwargs):
        data = json.loads(request.body.decode('utf8'))
        nm = data['name']
        sb = data['sub']
        em = data['email']
        ds = data['desc']
        context = {}
        try:
            toupdate = core_model.AddPaticipantByOther.objects.get(id=data['id'])
            toupdate.email = em
            toupdate.name = nm
            toupdate.subject = sb
            toupdate.message = ds
            toupdate.save()
        except:
            pass

        invites = core_model.AddPaticipantByOther.objects.filter(coach=request.user.coaches, status= True).order_by("-id")

        context.update({"invites": invites})
        return render(request, self.template_name, context)


class AdminBaseTheme(TemplateView):
    template_name = "core/theme/new_admin_dashboard.html"

    def get(self, request, *args, **kwargs):
       return render(request, self.template_name)


class ResetPasswordView(TemplateView):
    template_name = "core/reset_password.html"

    def get(self, request, *args, **kwargs):
        return render(request, self.template_name, {})

    def post(self, request, *args, **kwargs):
        current_password = request.POST.get("old_password")
        password = request.POST.get("new_password")
        confirm_password = request.POST.get("confirm_new_password")
        user = User.objects.get(username=request.user.username)
        if user:
            if user.check_password(current_password):
                if password == confirm_password:
                    user.set_password(password)
                    user.save()
                    login(request, user)
                    messages.success(request, "New password updated successfully")
                else:
                    messages.warning(request, "Password and confirm password not same ")

            else:
                messages.warning(request, "Incorrect password")
        return redirect("profile")


class AddClient(TemplateView):
    template_name = "core/theme/add_client_form.html"

    def get(self, request, *args, **kwargs):
        context = {}
        if request.user.is_authenticated:
            context.update({"title": "Add Client"})

            return render(request, self.template_name, context)
        else:
            return redirect("logins")


def AddPaging(request):
    try:
        id = request.POST['surid']
        sur = Survey.objects.get(id=id)
        sur.display = request.POST['val']
        sur.save()
    except:
       return JsonResponse({'fail':'data not saved'})

    return JsonResponse({'success':'data saved'})


@api_view(["POST"])
def AddRelation(request):
    template_name = "core/theme/add_participant.html"
    try:
        context = {}
        datas = []
        for i in core_model.Relationship.objects.filter():
            datas.append({"id": i.id, "value": i.relation})

        data = request.POST
        rel = data.get("rel")
        relobj = core_model.Relationship.objects.all()

        rela = core_model.Relationship.objects.create(relation=rel)
    except:
        messages.warning(request, "Something went wrong")
        return render(request, template_name)

    return redirect("add-participant")


class AddParticipant(TemplateView):
    template_name = "core/theme/add_participant.html"

    def get(self, request, *args, **kwargs):
        context = {}
        if request.user.is_authenticated:
            relationobj = core_model.Relationship.objects.all()
            context.update({"title": "Add Participant", "relation": relationobj})
            return render(request, self.template_name, context)
        else:
            return redirect("logins")

    def post(self, request, *args, **kwargs):
        context = {}
        data = request.POST
        fname = data.get("fname")
        lname = data.get("lname")
        email = data.get("email")
        relation = int(data.get("relationship"))
        relationobj = core_model.Relationship.objects.all()
        try:
            core_model.Participant.objects.create(
                email=email,
                first_name=fname,
                last_name=lname,
                relationship_id=relation,
                client=request.user.coaches,

            )
            context.update(
                {
                    "title": "Add Participant",
                    "relation": relationobj,
                    "sucmessage": "Thank you for filling out your information! ...",
                }
            )
            return redirect("dashboard")
        except:
            context.update(
                {
                    "title": "Add Participant",
                    "relation": relationobj,
                    "failmessage": "Something went wrong please try again",
                }
            )
            return render(request, self.template_name, context)

class CoachListjson(ServerSideDatatableView):
    queryset = Coaches.objects.filter().order_by("-id")
    columns = ['user__user_avatar__avatar', 'first_name', 'user__email', 'title', 'userplaninfoCoach__type', 'userplaninfoCoach__title', 'id']

# Coaches.objects.filter()[36].userplaninfo_set.filter()[0].title
class CoachList(TemplateView):
    """
    Coach list view
    """

    template_name = "core/theme/coach_list.html"

    def get(self, request, *args, **kwargs):
        context = {}
        paginate_by = settings.PAGINATED_BY
        if request.user.is_authenticated:
            if request.user.is_admin or request.user.is_superuser:
                coachlist = Coaches.objects.filter().order_by("-id")
                # paginator = Paginator(coachlist, paginate_by)
                # page = self.request.GET.get("page")
                # try:
                #     clientlistobj = paginator.page(page)
                # except PageNotAnInteger:
                #     clientlistobj = paginator.page(1)
                # except EmptyPage:
                #     clientlistobj = paginator.page(paginator.num_pages)
                try:
                    userplan = UserPlanInfo.objects.all()
                    context.update({'userplan': userplan})
                except:
                    pass
                context.update({"title": "All Coaches", 'coachlist':coachlist})
                return render(request, self.template_name, context)
        else:
            return redirect("logins")


class SaveInstruction(TemplateView):

    template_name = 'core/theme/add_client_new.html'

    def put(self, request, survey_id, *args, **kwargs):
        obj = Survey.objects.get(id=survey_id)
        obj['instructions'] = ''
        obj.save()
        return render(request, self.template_name)


def GetPopupValue(request):
    try:
        id = request.POST['survey_id']
        sur = FeedBackReport.objects.get(survey__pk=id, user='Client')
        survey = FeedBackReport.objects.filter(survey__pk=id).values()
        mail_subj = sur.mail_subj 
        mail_cont = sur.mail_cont   
    except:
       return JsonResponse({'fail':'data not saved'})

    return JsonResponse({'mail_subj':mail_subj,'mail_cont':mail_cont})


class DeleteSurvey(TemplateView):
    template_name = "core/theme/add_client_new.html"

    def delete(self, request, survey,client, *args, **kwargs):
        try:
            context = {}
            Survey.objects.get(id=survey).delete()
            return JsonResponse({'success': 'Survey deleted'})
        except:
            return JsonResponse({'fail': 'Survey not deleted'})

    def put(self, request, survey,client, *args, **kwargs):
        try:
            survey = Survey.objects.get(id=survey)
            survey.status = 'CT'
            survey.end_datetime = datetime.datetime.now(timezone.utc)
            survey.save()
            return JsonResponse({'success': 'Survey updated'})
        except:
            return JsonResponse({'fail': 'Survey not updated'})

    def post(self, request, survey, client, *args, **kwargs):
        try:
            survey = Survey.objects.get(id=survey)
            survey.status = 'RO'
            survey.save()
            sur = survey
            return JsonResponse({'success': 'survey updated'})
        except:
            return JsonResponse({'fail': 'survey not updated'})


class DeleteParticipant(TemplateView):
    template_name = "core/theme/participant_list.html"

    def get(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return redirect("logins")
        try:
            Participant.objects.get(id=int(self.kwargs['participant'])).delete()
            paginate_by = settings.PAGINATED_BY
            if request.user.is_authenticated:
                if request.user.is_admin or request.user.is_superuser:
                    participantlist = core_model.Participant.objects.filter().order_by(
                        "-id"
                    )
                else:
                    participantlist = core_model.Participant.objects.filter(
                        client_id=request.user.coaches.id
                    ).order_by("-id")
            context = {}
            paginator = Paginator(participantlist, paginate_by)
            page = self.request.GET.get("page")
            try:
                partobjlist = paginator.page(page)
            except PageNotAnInteger:
                partobjlist = paginator.page(1)
            except EmptyPage:
                partobjlist = paginator.page(paginator.num_pages)
            context.update({"title": "Participant", "parlist": partobjlist})
            return render(request, self.template_name, context)
        except:
            return redirect('participantlist')


class UpdateProfileLogo(TemplateView):
    """
    this view called when click on profile picture
    """

    def post(self, request, pk, *args, **kwargs):
        if request.is_ajax and request.user.is_authenticated and request.FILES:
            try:
                useravatarobj = core_model.UserAvatar.objects.filter(
                    user_id=request.user.id
                )
                if useravatarobj:
                    useravatarobj[0].avatar = request.FILES["profilepict"]
                    useravatarobj[0].save()
                    useravatarimg = useravatarobj[0]
                else:
                    useravatarimg = core_model.UserAvatar.objects.create(
                        user_id=request.user.id, avatar=request.FILES["profilepict"]
                    )
                return JsonResponse({"image_url": useravatarimg.avatar.url})
            except:
                return JsonResponse({"fail": "Something went wrong please try again"})
        else:
            return redirect("logins")


class UpdateUserProfile(TemplateView):
    """
    this view called when click on profile picture
    """

    def post(self, request, pk, *args, **kwargs):
        if request.is_ajax and request.user.is_authenticated:
            fname = request.POST.get("fname", None)
            lname = request.POST.get("lname", None)
            usernm = request.POST.get("username", None)
            email = request.POST.get("email", None)
            password = request.POST.get("password", None)
            title = request.POST.get("title", None)
            compnayname = request.POST.get("companyname", None)
            companyurl = request.POST.get("companyurl", None)
            # emailnotify = request.POST.get("emailnotify", None)
            user = User.objects.get(id=request.user.id)
            try:
                coachobj = core_model.Coaches.objects.filter(user_id=pk)
                if coachobj:
                    coachobj[0].first_name = fname
                    coachobj[0].last_name = lname
                    coachobj[0].title = title
                    coachobj[0].company_name = compnayname
                    coachobj[0].company_url = companyurl
                    # if emailnotify == "true":
                    #     coachobj[0].is_email_notify = True
                    # else:
                    #     coachobj[0].is_email_notify = False

                    coachobj[0].save()
                    user.username = usernm
                    user.email = email
                    # user.set_password(password)
                    user.save()
                    return JsonResponse(
                        {
                            "title": coachobj[0].title,
                            "companyurl": coachobj[0].company_url,
                            "compnayname": coachobj[0].company_name,
                            'fname': coachobj[0].first_name,
                            'lname': coachobj[0].last_name,
                            'email': user.email
                        }
                    )
                else:
                    return JsonResponse(
                        {"fail": "Something went wrong please try again"}
                    )
            except:
                return JsonResponse({"fail": "Coach with same email already exists.",'email': user.email})
        else:
            return redirect("logins")

    def delete(self, request, pk, *args, **kwargs):
        if request.is_ajax and request.user.is_authenticated :
            try:
                core_model.UserAvatar.objects.filter(user_id=request.user.id).delete()
                return JsonResponse({"success": 'image deleted', 'url': settings.MEDIA_ROOT+"/User_Profile/default.png"})
            except:
                return JsonResponse({"fail": "Something went wrong please try again"})
        else:
            return redirect("logins")


class PasswordReset(TemplateView):
    """
    User Profile page it will display according superadmin and coaches
    """

    template_name = "core/theme/reset_password.html"
    template_name_fail = "core/theme/reset_password_fail.html"
    template_name_sucess = "core/theme/reset_password_sucess.html"

    def get(self, request, code, *args, **kwargs):
        context = {}
        try:
            linkobj = core_model.PasswordReset.objects.get(code=code)
            if linkobj.is_used is False:
                return render(request, self.template_name, context)
            else:
                return render(request, self.template_name_fail, context)
        except:
            return render(request, self.template_name_fail, context)

    def post(self, request, code, *args, **kwargs):
        context = {}
        data = request.POST
        try:
            linkobj = core_model.PasswordReset.objects.get(code=code)
            userobj = core_model.User.objects.get(id=linkobj.user.id)
            if data["resetpass"] == data["confresetpass"]:
                userobj.set_password(data["resetpass"])
                userobj.save()
                linkobj.is_used = True
                linkobj.save()
                return render(request, self.template_name_sucess, context)
            else:
                return render(request, self.template_name_fail, context)

        except:
            return render(request, self.template_name_fail, context)


class EditClientIntake(TemplateView):
    """
    Edit client intake data
    """

    template_name = "core/theme/edit_client_intake.html"

    def get(self, request, client, *args, **kwargs):
        context = {}
        if request.user.is_authenticated:

            try:
                clientobj = core_model.Clients.objects.get(id=client)
                try:
                    clientintake = core_model.ClientIntake.objects.get(coach=request.user.coaches, client=clientobj)
                    context.update({"clientintake": clientintake})
                except:
                    pass
                try:
                    clientintakefiles = ClientIntakeFiles.objects.filter(coach=request.user.coaches, client=clientobj)
                    context.update({"clientintakefiles": clientintakefiles})
                except:
                    pass
                questions = core_model.CoachIntakeQuestions.objects.filter(coach=request.user.coaches, client=clientobj).order_by("id")
                client_ans = ClientIntakeAnswer.objects.filter(client=clientobj)
                try:
                    context.update({'client_camp': ClientCampaign.objects.get(client=clientobj)})
                except:
                    pass
                if clientobj:
                    context.update({"clientobj": clientobj, "title": "Client Intake", 'id': self.kwargs['client'],
                                    'ans': client_ans, 'questions': questions})
                    return render(request, self.template_name, context)
                else:
                    return HttpResponse('Error Occured')
            except:
                return HttpResponse('Error')
        else:
            return redirect("logins")

    def post(self, request, client, *args, **kwargs):
        try:            
            context = {}
            clientlist = core_model.Clients.objects.filter(coach=request.user.coaches, intake_status=False)
            clientobj = core_model.Clients.objects.get(id=client)
            if clientobj.intake_status == True:
                return JsonResponse({'status': 'true'})
            try:
                imgntuploaded = []
                fl = request.FILES.getlist('file')
                for img in fl:
                    try:
                        for cli in clientlist:
                            ClientIntakeFiles.objects.create(file=img, coach=Coaches.objects.get(user=request.user), client=cli)
                    except:
                        imgntuploaded.append(img)
                if len(imgntuploaded) > 0:
                    return JsonResponse({'error': 'image issue', 'imgs': imgntuploaded})
            except:pass
            try:
                data = request.POST
                instructions = data.get("inst")                
                if instructions!=None:
                    try:
                        for cli in clientlist:
                            clientintake = core_model.ClientIntake.objects.get(coach=request.user.coaches, client=cli)
                            clientintake.instructions = instructions
                            clientintake.save()
                    except:
                        if len(clientlist) > 0:
                            try:
                                intakeobj = Intake.objects.get(client=clientlist[0])
                                instruct = intakeobj.instructions
                                core_model.ClientIntake.objects.create(
                                    coach=request.user.coaches,
                                    instructions=instruct,
                                    client=clientobj
                                )
                            except:
                                core_model.ClientIntake.objects.create(
                                    coach=request.user.coaches,
                                    instructions=instructions,
                                    client=clientobj
                                )

                    # return JsonResponse({'success': 'instructions updated'})
            except:
                if len(clientlist) > 0:
                    intakeobj = Intake.object.get(client=clientlist[0])
                    instruct = intakeobj.instructions
                core_model.ClientIntake.objects.create(
                    coach=request.user.coaches,
                    instructions=instruct,
                    client=clientobj
                )
            try:
                    email = data.get("email")
                    fname = data.get("fname")
                    lname = data.get("lname")
                    phone = data.get("phone")
                    city = data.get("city")
                    zip = data.get("zip")
                    title = data.get("title")
                    state = data.get("state")
                    compname = data.get("compname")
                    compurl = data.get("compurl")
                    address = data.get("address")
                    country = data.get("country")

                    if city == '':
                        city = None
                    if state == '':
                        state = None
                    if phone == '':
                        phone = None
                    if compurl == '':
                        compurl = None
                    if address == '':
                        address = None
                    if country == '':
                        country = None
                    if compname == '':
                        compname = None
                    if zip == '':
                        zip = None
                    clientobj = core_model.Clients.objects.get(id=int(client))
                    if (
                        email
                        and fname
                        and lname
                    ):
                        try:
                            if core_model.Clients.objects.filter(email=email, coach=request.user.coaches).exclude(id=int(client)).exists():
                                context.update(
                                    {
                                        "failmessage": "Email already exists. Please enter a unique email address.",
                                        "suc": "true",
                                    }
                                )
                                return JsonResponse(context)
                        except:
                            pass
                        clientobj.email = email
                        clientobj.first_name = fname
                        clientobj.city = city
                        if zip != ('' or None):
                            clientobj.zip = int(zip)
                        clientobj.state = state
                        clientobj.company_url = compurl
                        clientobj.address = address
                        clientobj.country = country
                        clientobj.title = title
                        clientobj.last_name = lname
                        clientobj.phone = phone
                        clientobj.company_name = compname
                        clientobj.save()
                        context.update(
                            {
                                "sucmessage": "You have successfully filled intake form.",
                                "suc": "true",
                                "clientobj": clientobj,
                            }
                        )
                    # return JsonResponse({'success': 'data updated'})
                    else:
                        obj = core_model.CoachIntakeQuestions.objects.filter(question__iexact = data.get('que'), client =client)
                        if obj.exists():
                            return JsonResponse ({'error':'Question already exists. Please enter another question'})
                        else:
                            for cli in clientlist:
                                cliobj = core_model.CoachIntakeQuestions.objects.create(coach=request.user.coaches, client=cli)
                                cliobj.question = data.get('que')
                                cliobj.save()
                            # queobj = core_model.CoachIntakeQuestions.objects.create(question=data.get('que'), coach=request.user.coaches, client=clientobj)
                            queobj = core_model.CoachIntakeQuestions.objects.get(coach=request.user.coaches, client=client, question=data.get('que'))
                            return JsonResponse({'success': 'Question added ', 'questions': queobj.id})
            except:
                try:
                            file = request.FILES['image']
                            useravatarobj = core_model.UserAvatar.objects.filter(
                                user_id=request.user.id
                            )
                            if useravatarobj:
                                useravatarobj[0].avatar = file
                                useravatarobj[0].save()
                                img = useravatarobj[0].avatar.url
                            else:
                                useravatarimg = core_model.UserAvatar.objects.create(
                                    user_id=request.user.id, avatar=file
                                )
                                img = useravatarimg.avatar.url
                except:
                    try:
                            useravatarobj = core_model.UserAvatar.objects.filter(
                                user_id=request.user.id
                            ).delete()
                            img = '/static/images/theme/default.png'

                    except:
                        pass
                return JsonResponse({'success': 'profile image updated ', 'image_url': img})
            return JsonResponse({'success': 'data updated '})
        except:
            return JsonResponse({'fail': 'something wrong'})

    def put(self, request, client, *args, **kwargs):
        clientobj = core_model.Clients.objects.get(id=client)
        if clientobj.intake_status == True:
            return JsonResponse({'status': 'true'})
        id = request.body.decode().split(',:')[0]
        que = request.body.decode().split(',:')[1]
        if core_model.CoachIntakeQuestions.objects.filter(question__iexact = que, client__id =client).exclude(id=int(id)).exists():
            return JsonResponse ({'id':id,'error':'Question already exists. Please enter another question'})
        else:
            queobj = core_model.CoachIntakeQuestions.objects.get(id=int(id))
            question = queobj.question
            queobj.question = que
            clientlist = core_model.Clients.objects.filter(coach=request.user.coaches, intake_status=False)
            for cli in clientlist:
                cliobj = core_model.CoachIntakeQuestions.objects.get(coach=request.user.coaches, client__id=cli.id, question=question)
                cliobj.question = que
                cliobj.save()
            queobj.save()
            return JsonResponse({'id':id,'success': 'data updated'})
        return JsonResponse({'success': 'data updated'})

    def delete(self, request, client, *args, **kwargs):
        try:
            clientobj = core_model.Clients.objects.get(id=client)
            if clientobj.intake_status == True:
                return JsonResponse({'status': 'true'})
            question = core_model.CoachIntakeQuestions.objects.get(id=int(request.body.decode()))
            clientlist = core_model.Clients.objects.filter(coach=request.user.coaches, intake_status=False)

            for cli in clientlist:
                cliobj = core_model.CoachIntakeQuestions.objects.get(coach=request.user.coaches, client=cli,
                                                                     question=question.question)
                cliobj.delete()
            question.delete()

            return JsonResponse({'success': 'data deleted'})
        except:
            try:
                ClientIntakeFiles.objects.get(id=int(request.GET['id'])).delete()
            except:
                ClientIntakeFiles.objects.get(id=int(request.body.decode())).delete()
            return JsonResponse({'success': 'file deleted'})


class EditClient(TemplateView):
    """
    Edit client intake data
    """

    template_name = "core/theme/edit_client.html"

    def get(self, request, client, *args, **kwargs):
        if not request.user.is_authenticated:
            return redirect("logins")
        context = {}
        try:
            clientobj = core_model.Clients.objects.get(id=client)
            if clientobj:
                context.update({"clientobj": clientobj, "title": "Edit Client", 'id': self.kwargs['client']})
                try:
                    request.GET['next']
                    context.update({"redirectto": request.GET['next']})
                except:pass
                return render(request, self.template_name, context)
            else:
                return render(request, self.template_name_fail, context)
        except:
            return render(request, self.template_name_fail, context)

    def post(self, request, client, *args, **kwargs):
        context = {}
        data = request.POST
        email = data.get("email")
        fname = data.get("fname")
        lname = data.get("lname")
        phone = data.get("phone")
        city = data.get("city")
        zip = data.get("zip")
        title = data.get("title")
        state = data.get("state")
        country = data.get("country")
        address = data.get("address")
        compname = data.get("compname")
        compurl = data.get("compurl")
        addemail = data.get("addemail")
        addphone = data.get("addphone")
        compaddress = data.get("compaddress")
        if city == '':
            city = None
        if state == '':
            state = None
        if country == '':
            country = None
        if phone == '':
            phone = None
        if address == '':
            address = None
        if compname == '':
            compname = None
        if compurl == '':
            compurl = None
        if zip == '':
            zip = None
        try:
            if (email and fname and lname):
                if core_model.Clients.objects.filter(email=email, coach=request.user.coaches).exclude(id=int(client)).exists():
                    context.update(
                        {
                            "failmessage": "Email already exists. Please enter a unique email address.",
                            "suc": "true",
                        }
                    )
                    return JsonResponse(context)
                else:
                    clientobj = core_model.Clients.objects.get(id=int(client))
                    clientobj.email = email
                    clientobj.first_name = fname
                    clientobj.city = city
                    if zip is not ('' or None):
                        clientobj.zip = int(zip)
                    clientobj.state = state
                    clientobj.title = title
                    clientobj.country = country
                    clientobj.last_name = lname
                    clientobj.phone = phone
                    clientobj.address = address
                    clientobj.company_name = compname
                    clientobj.company_url = compurl
                    clientobj.company_phone = addphone
                    clientobj.company_email = addemail
                    clientobj.company_address = compaddress
                    clientobj.save()
                    context.update(
                            {
                                "sucmessage": "You have successfully filled intake form.",
                                "suc": "true",
                                "clientobj": clientobj,
                            }
                        )
                    return JsonResponse({
                                "sucmessage": "Updated successfully",
                                "suc": "true",                                
                            })
                  

            else:
                clientobj = core_model.Clients.objects.get(id=client)
                context.update({"clientobj": clientobj, "title": "Edit Client", 'id': self.kwargs['client']})
                return render(request, self.template_name, context)
        except:
            clientobj = core_model.Clients.objects.get(id=client)
            context.update({"clientobj": clientobj, "title": "Edit Client", 'id': self.kwargs['client']})
            return render(request, self.template_name, context)

@api_view(["POST", "DELETE"])
def DeleteDocument(request, pk, *args, **kwargs):
    template_name = "core/theme/client_document.html"
    try:
        if request.method == "POST":
            doc = core_model.ClientDocument.objects.get(id=pk)

            client_id = doc.client.id
            doc.delete()
    except:
        messages.warning(request, "Document does not Exist")
    return redirect("client-document", client=client_id)


class ClientDocument(TemplateView):
    """
    Edit client intake data
    """

    template_name = "core/theme/client_document.html"

    def get(self, request, client, *args, **kwargs):
        if not request.user.is_authenticated:
            return redirect("logins")
        context = {}
        paginate_by = settings.PAGINATED_BY

        try:
            clientdocumentobj = core_model.ClientDocument.objects.filter(
                client_id=int(client)
            ).order_by("-id")
            if clientdocumentobj:
                paginator = Paginator(clientdocumentobj, paginate_by)
                page = self.request.GET.get("page")

                try:
                    clientdoclist = paginator.page(page)
                except PageNotAnInteger:
                    clientdoclist = paginator.page(1)
                except EmptyPage:
                    clientdoclist = paginator.page(paginator.num_pages)
                context.update(
                    {"clientobj": clientdoclist, "title": "Addtional Document"}
                )
                return render(request, self.template_name, context)
            else:
                return render(request, self.template_name, context)
        except:
            return render(request, self.template_name, context)

    def post(self, request, client, *args, **kwargs):
        context = {}

        paginate_by = settings.PAGINATED_BY
        clientdocumentobj = core_model.ClientDocument.objects.filter(
            client_id=int(client)
        )
        if request.user.is_authenticated and request.FILES:

            try:

                core_model.ClientDocument.objects.create(
                    document=request.FILES["fileupload"],
                    client_id=int(client),
                    filename=request.POST.get("fileuploadname"),
                )

                if clientdocumentobj:
                    context.update({"clientobj": clientdocumentobj})
                    return render(request, self.template_name, context)
                else:
                    return render(request, self.template_name, context)
            except:
                return render(request, self.template_name, context)
        else:
            messages.warning(request, "Please upload the document")
            context.update({"clientobj": clientdocumentobj})
            return render(request, self.template_name, context)


class ClientInviteForm(TemplateView):
    """
    Client Invite form
    """

    template_name = "core/theme/client_intake_web.html"
    template_res = "core/theme/thankyou.html"

    def get(self, request, code, *args, **kwargs):
        context = {}
        try:
            invitationobj = core_model.ClientInvitationCode.objects.get(code=code)
            if invitationobj.is_used:
                context.update({"error": "This link is expire "})
                return render(request, self.template_res, context)
        except:
            pass
        return render(request, self.template_name, context)

    def post(self, request, code, *args, **kwargs):
        context = {}
        data = request.POST
        email = data.get("email")
        fname = data.get("fname")
        lname = data.get("lname")
        phone = data.get("phone")
        address = data.get("address")
        compname = data.get("compname")
        compurl = data.get("compurl")
        addemail = data.get("addemail")
        addphone = data.get("addphone")
        compaddress = data.get("compaddress")

        try:
            invitationobj = core_model.ClientInvitationCode.objects.get(code=code)
            if invitationobj.is_used:
                context.update({"error": "This link is expire "})
                return render(request, self.template_res, context)
            if (
                email
                and fname
                and lname
                and phone
                and address
                and compname
                and compurl
                and addemail
                and addphone
                and compaddress
            ):
                cliobj = core_model.Clients.objects.creplanate(
                    coach=invitationobj.user.coaches,
                    email=email,
                    first_name=fname,
                    last_name=lname,
                    phone=phone,
                    address=address,
                    company_name=compname,
                    company_url=compurl,
                    company_phone=addphone,
                    company_email=addemail,
                    company_address=compaddress,
                    queans1=data.get("questnumber1"),
                    queans2=data.get("questnumber2"),
                    queans3=data.get("questnumber3"),
                    queans4=data.get("questnumber4"),
                    queans5=data.get("questnumber5"),
                    queans6=data.get("questnumber6"),
                    queans7=data.get("questnumber7"),
                    queans8=data.get("questnumber8"),
                    queans9=data.get("questnumber9"),
                    queans10=data.get("questnumber10"),
                    queans11=data.get("questnumber11"),
                    queans12=data.get("questnumber12"),
                    queans13=data.get("questnumber13"),
                    queans14=data.get("questnumber14"),
                    queans15=data.get("questnumber15"),
                    queans16=data.get("questnumber16"),
                    queans17=data.get("questnumber17"),
                    queans18=data.get("questnumber18"),
                    queans19=data.get("questnumber19"),
                    queans20=data.get("questnumber20"),
                    queans21=data.get("questnumber21"),
                )
                invitationobj.is_used = True
                invitationobj.save()
                try:
                    if request.FILES["clientwebformprfimg"]:
                        cliobj.profile_img = request.FILES["clientwebformprfimg"]
                        cliobj.save()
                    if request.FILES["uploadlogo"]:
                        cliobj.queansfile = request.FILES["queansfile"]
                        cliobj.save()
                except:
                    pass
                context = {"sucess": "sucess"}
                return render(request, self.template_res, context)
        except:
            logger.info("something went wrong  %s", data)
            context = {"error": "error"}
            return render(request, self.template_name, context)


class ClientInviteEmailForm(TemplateView):
    """
    Client Invite form
    """

    template_name = "core/theme/client_intake_web.html"

    def get(self, request, email, *args, **kwargs):

        try:

            if email:
                code = get_random_string()
                core_model.ClientInvitationCode.objects.create(
                    user_id=request.user.id, code=code, email=email
                )
                buildurl = request.build_absolute_uri("/") + "clientinvite/" + code
                email_body = (
                    "You can use the following link to  fillup your form: : "
                    + str(buildurl)
                )
                replyto = ReplyTo(request.user.email, )
                # print(settings.EMAIL_HOST_USER)
                message = Mail(
                    from_email=settings.EMAIL_HOST_USER,
                    to_emails=email,
                    subject="Invitation for Join LRC",
                    html_content=render_to_string(
                        "core/theme/client_invite_email.html",
                        {"email_body": buildurl, "username": email},
                    ),
                )
                message.reply_to = replyto
                sg = SendGridAPIClient(str(settings.SENDGRID_API_KEY))
                response = sg.send(message)
                if response:
                    return redirect("add-client")
            else:
                messages.warning(request, "User account Inactivate")
                return redirect("add-client")
        except User.DoesNotExist:
            messages.error(request, "User Not Exist")
            return redirect("add-client")


class ParticipantList(TemplateView):
    """
    Client list view
    """

    template_name = "core/theme/participant_list.html"

    def get(self, request, *args, **kwargs):
        context = {}
        paginate_by = settings.PAGINATED_BY
        if request.user.is_authenticated:
            if request.user.is_admin or request.user.is_superuser:
                participantlist = core_model.Participant.objects.filter().order_by(
                    "-id"
                )
            else:
                participantlist = core_model.Participant.objects.filter(
                    client_id=request.user.coaches.id
                ).order_by("-id")

            paginator = Paginator(participantlist, paginate_by)
            page = self.request.GET.get("page")
            try:
                partobjlist = paginator.page(page)
            except PageNotAnInteger:
                partobjlist = paginator.page(1)
            except EmptyPage:
                partobjlist = paginator.page(paginator.num_pages)
            context.update({"title": "Participant", "parlist": partobjlist})
            return render(request, self.template_name, context)
        else:
            return redirect("logins")


class ParticipantEdit(TemplateView):
    """
    Client list view
    """

    template_name = "core/theme/edit_participant.html"

    def get(self, request, pk, *args, **kwargs):
        context = {}
        paginate_by = settings.PAGINATED_BY
        if request.user.is_authenticated:
            relationobj = core_model.Relationship.objects.all()
            participantobj = core_model.Participant.objects.get(pk=pk)

            context.update(
                {
                    "title": "Participant",
                    "parobj": participantobj,
                    "relation": relationobj,
                }
            )
            return render(request, self.template_name, context)
        else:
            return redirect("logins")

    def post(self, request, pk, *args, **kwargs):
        context = {}
        if request.user.is_authenticated:
            try:
                data = request.POST
                fname = data.get("fname")
                lname = data.get("lname")
                email = data.get("email")
                relation = int(data.get("relationship"))
                participantobj = core_model.Participant.objects.get(pk=pk)

                participantobj.email = email
                participantobj.first_name = fname
                participantobj.last_name = lname
                participantobj.relationship_id = relation
                participantobj.save()
                return redirect("participant-list")

            except:
                relationobj = core_model.Relationship.objects.all()
                participantobj = core_model.Participant.objects.get(pk=pk)
                context.update(
                    {
                        "title": "Participant",
                        "parobj": participantobj,
                        "relation": relationobj,
                    }
                )
                return render(request, self.template_name, context)
        else:
            return redirect("logins")


class ParticipantInviteEmailForm(TemplateView):
    """
    Client Invite form
    """

    template_name = "core/theme/client_intake_web.html"

    def get(self, request, email, *args, **kwargs):

        try:

            if email:
                code = get_random_string()
                core_model.ClientInvitationCode.objects.create(
                    user_id=request.user.id, code=code, email=email, is_participant=True
                )
                buildurl = request.build_absolute_uri("/") + "inviteparticipant/" + code
                email_body = (
                    "You can use the following link to  fillup your form: : "
                    + str(buildurl)
                )
                replyto = ReplyTo(request.user.email, )
                # print(settings.EMAIL_HOST_USER)
                message = Mail(
                    from_email=settings.EMAIL_HOST_USER,
                    to_emails=email,
                    subject="Invitation for Join LRC",
                    html_content=render_to_string(
                        "core/theme/client_invite_email.html",
                        {"email_body": buildurl, "username": email},
                    ),
                )
                message.reply_to = replyto
                sg = SendGridAPIClient(str(settings.SENDGRID_API_KEY))
                response = sg.send(message)
                if response:
                    return redirect("add-client")
            else:
                messages.warning(request, "User account Inactivate")
                return redirect("add-client")
        except User.DoesNotExist:
            messages.error(request, "User Not Exist")
            return redirect("add-client")


class ParticipantInviteForm(TemplateView):
    """
    Participant Invite form
    """

    template_name = "core/theme/participant_web.html"
    template_res = "core/theme/thankyou.html"

    def get(self, request, code, *args, **kwargs):
        context = {}
        try:
            invitationobj = core_model.Coachrefercode.objects.get(code=code)
            if not invitationobj.is_active:
                context.update({"error": "This link is expire "})
                return render(request, self.template_res, context)
            relationobj = core_model.Relationship.objects.all()
            context.update({"title": "Add Participant", "relation": relationobj})
        except:
            pass
        return render(request, self.template_name, context)

    def post(self, request, code, *args, **kwargs):
        context = {}
        data = request.POST
        fname = data.get("fname")
        lname = data.get("lname")
        email = data.get("email")
        relation = int(data.get("relationship"))

        try:
            invitationobj = core_model.Coachrefercode.objects.get(code=code)
            if not invitationobj.is_active:
                context.update({"error": "This link is expire "})
                return render(request, self.template_res, context)
            if email and fname and lname:

                core_model.Participant.objects.create(
                    email=email,
                    first_name=fname,
                    last_name=lname,
                    relationship_id=relation,
                    client_id=invitationobj.coach.id,
                )
                invitationobj.is_used = True
                invitationobj.save()
                context = {"sucess": "success"}
                return render(request, self.template_res, context)
        except:
            logger.info("something went wrong  %s", data)
            context = {"error": "error"}
            return render(request, self.template_name, context)


