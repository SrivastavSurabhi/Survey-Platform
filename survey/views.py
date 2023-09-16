from django.shortcuts import render
from django.views import View
from survey.models import Survey, FeedBackReport as report, ReportFooter
from survey.utils import question_creation, survey_creation
from django.http import JsonResponse
from django.conf import settings
# from core.models import Participent
import sendgrid
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from django.views.generic import TemplateView
from .models import *
from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.core.paginator import Paginator
from django.core.paginator import EmptyPage
from django.core.paginator import PageNotAnInteger
from core.models import *
from urllib.parse import unquote
import os, datetime
from django.http import HttpResponse
from django.db.models import Q
from django.contrib import messages
import random
from django_serverside_datatable.views import ServerSideDatatableView
from sendgrid.helpers.mail import (Mail, Attachment, FileContent, FileName, FileType, Disposition)
from sendgrid.helpers.mail import Mail, Email, To, Content, ReplyTo
import http.client
from django.utils import timezone
import pytz
from django.template.loader import render_to_string


authkey = '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'
key = settings.STRIPE_PUBLISHABLE_KEY


class CreateSurvey(TemplateView):
    """
    this view will call when you click on Create survey button
    """
    template_name = "survey/theme/create_survey.html"

    def get(self, request, *args, **kwargs):
        context = {}
        if request.user.is_authenticated:
            if not Clients.objects.filter(coach=request.user.coaches).exists():
                messages.warning(request,
                                 "To create a survey, add a client first.")
                return redirect(request.META['HTTP_REFERER'])

            if request.user.coach_exist:
                try:
                    surveyclient = Clients.objects.get(id=self.kwargs['id'])
                    context.update(
                        {"client": surveyclient}
                    )
                    return render(request, self.template_name, context)
                except:
                    surveyclientobj = Clients.objects.filter(
                        coach_id=request.user.coaches.id
                    ).order_by("first_name")
            else:
                surveyclientobj = []
            context.update({"title": "Create Survey Dashboard", "surveyclient": surveyclientobj})
            return render(request, self.template_name, context)
        else:
            return redirect("logins")

    def post(self, request, *args, **kwargs):
        context = {}
        cat = request.POST.get("defsurveycat")
        name = request.POST.get("defsurveyname")
        
        try:
            cid = request.POST.get("surveycat")
        except:
            cid = kwargs['id']

        try:
            chk = Survey.objects.filter(Survey_client=Clients.objects.get(id=cid), title=name)
            if chk.count() > 0:
                return JsonResponse(
                    {"fail": "Survey with same name already exists. Please try with other name."}
                )
        except:
            pass

        if request.user.is_authenticated:
            if name is not None and cat is not None:
                
                client = Clients.objects.get(id=cid)
                context.update(
                    {
                        "client": client,
                    }
                )
                surveyobj = Survey.objects.create(
                    creator_id=request.user.id,
                    status="US",
                    title=name,
                    Survey_client=client, 
                )
                
                try:
                    if surveyobj:
                        if cat == '360':
                            SurveyQuestion.objects.create(survey_id=surveyobj.id,
                                                          question='What are the things that make this person most effective?')
                            SurveyQuestion.objects.create(survey_id=surveyobj.id,
                                                          question='What other strengths do you see in this person?')
                            SurveyQuestion.objects.create(survey_id=surveyobj.id,
                                                          question='What new skills or behaviors would make this person even more effective?')
                            SurveyQuestion.objects.create(survey_id=surveyobj.id,
                                                          question='How else could this person continue to improve?')
                            SurveyQuestion.objects.create(survey_id=surveyobj.id,
                                                          question='In just a few words, what should this person start doing immediately?')
                            SurveyQuestion.objects.create(survey_id=surveyobj.id,
                                                          question='In just a few words, what should this person stop doing immediately?')
                            SurveyQuestion.objects.create(survey_id=surveyobj.id,
                                                          question='In just a few words, what should this person continue doing?')
                            SurveyQuestion.objects.create(survey_id=surveyobj.id,
                                                          question="What final comments do you have that would aid in this person's development?")
                        else:
                            SurveyQuestion.objects.create(survey_id=surveyobj.id,
                                                          question='Over the last several months, how has this person improved?')
                            SurveyQuestion.objects.create(survey_id=surveyobj.id,
                                                          question='How else has this person been more effective over the last several months?')
                            SurveyQuestion.objects.create(survey_id=surveyobj.id,
                                                          question='What new skills or behaviors would make this person even more effective?')
                            SurveyQuestion.objects.create(survey_id=surveyobj.id,
                                                          question='How else could this person continue to improve?')
                            SurveyQuestion.objects.create(survey_id=surveyobj.id,
                                                          question='In just a few words, what should this person start doing immediately?')
                            SurveyQuestion.objects.create(survey_id=surveyobj.id,
                                                          question='In just a few words, what should this person stop doing immediately?')
                            SurveyQuestion.objects.create(survey_id=surveyobj.id,
                                                          question='In just a few words, what should this person continue doing?')
                            SurveyQuestion.objects.create(survey_id=surveyobj.id,
                                                          question="What final comments do you have that would aid in this person's development?")

                        ConfidentialQuestions.objects.create(survey_id=surveyobj.id,
                                   question='Please share anything that you wish to tell the coach but you do not want to share with this person. Please note that this answer will be kept strictly confidential between you and the coach?')
                        return JsonResponse({'survey_id': surveyobj.id, 'template': cat})
                except:
                    surveycatobj = SurveyCategory.objects.all()
                    context.update(
                        {
                            "title": "Create Survey Dashboard",
                            "surveycat": surveycatobj,
                            "error": "something went wrong please try again",
                        }
                    )
                    return render(request, self.template_name, context)
        else:
            return redirect("logins")

    def put(self, request, *args, **kwargs):
        data = request.body.decode().split(',')
        nwdt = data[0]
        surid = data[1]
        sur = Survey.objects.get(id=int(surid))
        sur.end_datetime = datetime.datetime.strptime(nwdt, '%Y-%m-%d')
        sur.save()
        SurveyCampaign.objects.filter(survey=sur).update(expires=datetime.datetime.strptime(nwdt, '%Y-%m-%d'))
        return JsonResponse({'success': 'date updated'})


class CreateSurveyData(TemplateView):
    """
    this will call when create survey with instruction detail
    """

    def post(self, request, *args, **kwargs):
        if request.is_ajax and request.user.is_authenticated:
                try:
                    request.POST['copy']
                    if not Survey.objects.filter(creator=request.user).exists():
                        return JsonResponse(
                            {"fail": "You do not have any survey to copy."}
                        )
                except:
                    pass

                client = request.POST['surveycat']#request.POST["client"]
                name = request.POST['surveyname']#request.POST["name"]
                try:
                    chk = Survey.objects.filter(Survey_client=Clients.objects.get(id=int(client)), title=name)
                    if chk.count() > 0:
                        return JsonResponse({"fail": "Survey with same name already exists. Please try with other name."})
                    else:
                        surveyobj = Survey.objects.create(
                            creator_id=request.user.id,
                            Survey_client=Clients.objects.get(id=int(client)),
                            status="US",
                            title=name,                            
                        )
                        if surveyobj:
                            return JsonResponse({"id": surveyobj.id, 'cid': client})
                        else:
                            return JsonResponse(
                                {"fail": "Something went wrong please try again"}
                            )
                except:
                    return JsonResponse(
                        {"fail": "Survey with same name already exists. Please try with other name."}
                    )
        else:
            return redirect("logins")


class CreateSurveyTemplate(TemplateView):
    template_name = "survey/theme/survey360_question.html"
    template_repeat = "survey/theme/survey360repeat_question.html"

    def get(self, request, survey_id, template, *args, **kwargs):
        if not request.user.is_authenticated:
            return redirect("logins")
        context = {}
        surveyobj = Survey.objects.get(id=survey_id)
        try:
            conque = ConfidentialQuestions.objects.get(survey_id=surveyobj)
            context.update({"conque": conque})
        except:
            pass
        context.update({"surveyobj": surveyobj})
        try:
            ques = SurveyQuestion.objects.filter(survey=surveyobj).order_by("created_ts")
            context.update({"ques": ques})
        except:
            pass
        if template == "360 Repeat":
            return render(request, self.template_repeat, context)
        else:
            return render(request, self.template_name, context)


class QuestionCreation(View):
    def post(self, request):
        return question_creation(request)


class SurveyCreation(View):
    def post(self, request):
        return survey_creation(request)


def survey_list(request):
    return render(request, "survey/list_survey", {"survey": Survey.objects.all()})


# def Speech(request):
#     data = request.POST.get('record')
#     # get audio from the microphone
#     r = sr.Recognizer()
#     with sr.Microphone() as source:
#         print("Speak:")
#         audio = r.listen(source)
#
#     try:
#         output = " " + r.recognize_google(audio)
#         return JsonResponse({'data': output})
#     except sr.UnknownValueError:
#         output = "Could not understand audio"
#         return JsonResponse({'error': output})
#     except sr.RequestError as e:
#         output = "Could not request results; {0}".format(e)
#         return JsonResponse({'error': output})


def survey_attempt(request):
    pass


def SaveAs(request):
    id = request.POST.get('id')
    user = request.POST.get('user')
    survey = Survey.objects.get(id=id)
    rpt = report.objects.get(survey=survey, user='Client')
    sts = request.POST.get('sts')
    try:
        rptid = report.objects.get(survey=survey, user=user)
        if sts != None:
            rptid.includeconfquestion = sts
            rptid.save()
        # return JsonResponse({'rptid': rptid})
    except:
        rptid = report.objects.create(survey=survey, user=user, heading=rpt.heading, comments=rpt.comments,
                     logo=rpt.logo, topic=rpt.topic, summary=rpt.summary, text=rpt.text, includeconfquestion=True,
        noteheading=rpt.noteheading, notecomments=rpt.notecomments, title=rpt.title, company_name=rpt.company_name)
        try:
            for ans in EditedAnswer.objects.filter(survey=rpt.survey, user='Client'):
                EditedAnswer.objects.create(survey=rpt.survey, user=user, prevanswer=ans.prevanswer, answer=ans.answer, deleted=ans.deleted)
        except:
            pass
        for que in SurveyQuestion.objects.filter(survey=rpt.survey):
            try:
               ques = EditedSurveyQuestion.objects.get(question= que, user='Client')
               EditedSurveyQuestion.objects.create(user=user, question=que, heading=ques.heading,
                                                comments=ques.comments)
            except:
                pass

    try:
        footer = ReportFooter.objects.get(report=rpt)
        try:
            newrpt = ReportFooter.objects.get(report=rptid)
            newrpt.text=footer.text
            newrpt.color=footer.color
            newrpt.frontfootercolor= footer.frontfootercolor
            newrpt.save()
        except:
            ReportFooter.objects.create(report=rptid, text=footer.text, color=footer.color, frontfootercolor=footer.frontfootercolor)
    except:
            pass
    group = Group.objects.filter(report=rpt).order_by('id')
    for grp in group:
        try:
            addrel = Group.objects.get(report=rptid, name=grp.name)
        except:
            addrel = Group.objects.create(report=rptid, name=grp.name, anscount=grp.anscount, partcount=grp.partcount)
        for g in grp.relation.all():
            addrel.relation.add(g)
            addrel.save()
    return JsonResponse({'success': 'report saved as {}'.format(user), 'rptid': rptid.id, 'surid': rptid.survey.id})


def SaveFooter(request):
    id = request.POST.get('id')
    color = request.POST.get('color')
    rpt = report.objects.get(id=id)
    try:
        text = request.POST.get('text')
        try:
            footer = ReportFooter.objects.get(report=rpt)
            footer.text = text
            footer.color = color
            footer.save()
        except:
            footer = ReportFooter.objects.create(report=rpt, text=text, color=color)
        # coach = Coaches.objects.get(user=request.user)
        # coach.color = color
        # coach.save()
        return JsonResponse({'text': text, 'color': color})
    except:
        try:
            footer = ReportFooter.objects.get(report=rpt)
            footer.frontfootercolor = color
            footer.save()
        except:
            footer = ReportFooter.objects.create(report=rpt, frontfootercolor=color)
        # coach = Coaches.objects.get(user=rpt.survey.creator)
        # coach.frontfootercolor = color
        # coach.save()
        return JsonResponse({'color': color})


def AddHeading(request, user):
    if request.POST.get('type') != None:
        id = request.POST.get('id')
        ques = ConfidentialQuestions.objects.get(id=id)
        if request.POST.get('head') != None:
            head = request.POST.get('head')
            ques.heading = head
        else:
            comment = request.POST.get('comment')
            ques.comments = comment
        ques.save()
        return JsonResponse({'success': 'added'})
    else:
        try:
            id = request.POST.get('id')
            que = SurveyQuestion.objects.get(id=id)
            try:
                ques =EditedSurveyQuestion.objects.get(question=que, user=user)
            except:
                ques = EditedSurveyQuestion.objects.create(question=que, user=user)
            if request.POST.get('head') != None :
                head = request.POST.get('head')
                ques.heading = head
            else:
                comment = request.POST.get('comment')
                ques.comments = comment
            ques.save()
            return JsonResponse({'success': 'added'})
        except:
            return JsonResponse({'fail': 'not added'})


class ReportHeading(TemplateView):
    template_name = "survey/theme/survey360_question.html"

    def post(self, request, *args, **kwargs):
        id = request.POST['reportid']
        rpt = report.objects.get(id=id)
        try:
            try:
                heading = request.POST['heading']
                rpt.noteheading = heading
            except:
                Comments = request.POST['comment']
                rpt.notecomments = Comments
            rpt.save()
            return JsonResponse({'success': 'added'})
        except:
            # client = Clients.objects.get(id=rpt.survey.Survey_client.id)
            h1 = request.POST['h1']
            fn = request.POST['h2'].split(' ')[0]
            ln = request.POST['h2'].split(' ')[1]
            h3 = request.POST['h3']
            h4 = request.POST['h4']
            rpt.topic = h1
            rpt.first_name = fn
            rpt.last_name = ln
            rpt.title = h3
            rpt.company_name = h4
            rpt.save()
            # client.save()
            return JsonResponse({'success': 'added'})


class SurveyHeading(TemplateView):
    template_name = "survey/theme/survey360_question.html"

    def post(self, request, *args, **kwargs):
        id = request.POST['reportid']
        rpt = report.objects.get(id=id)
        if request.POST['type'] == 'head':
            try:
                head = request.POST['rpthead']
                rpt.heading = head
                rpt.save()
            except:
                comment = request.POST['rptcomment']
                rpt.comments = comment
                rpt.save()
        else:
            try:
                head = request.POST['summmhead']
                rpt.summary = head
                rpt.save()
            except:
                comment = request.POST['summcomment']
                rpt.text = comment
                rpt.save()
        return JsonResponse({'success': 'added'})


class DraftStatus(TemplateView):
    template_name = "survey/theme/survey360_question.html"

    def post(self, request, *args, **kwargs):
        id = request.POST['reportid']
        rpt = report.objects.get(id=id)
        status = request.POST['status']
        if status == "Completed":
            rpt.reportgenerateat = datetime.datetime.now(timezone.utc)
        elif status == "Partially Completed":
            rpt.currentpage = '#step-4'
        rpt.status = status
        rpt.save()
        return JsonResponse({'success': 'added'})

    def get(self, request, *args, **kwargs):
        id = request.GET['id']
        rpt = report.objects.get(id=id)
        return JsonResponse({'stts': rpt.status})


class SaveInstruction(TemplateView):

    def post(self, request, survey_id, *args, **kwargs):
        sur = Survey.objects.get(id=survey_id)
        sur.instructions = request.POST['instr']
        sur.save()
        return HttpResponse('done')


class ShowSurvey(TemplateView):
    """
    this view will call when popup open  created survey
    then  it will call and you can add question
    """

    template_name = "survey/theme/survey_question.html"

    def get(self, request, survey_id, *args, **kwargs):
        context = {}
        if request.user.is_authenticated:
            try:
                surveyobj = Survey.objects.get(id=survey_id)
            except:
                surveyobj = None
            questions = SurveyQuestion.objects.filter(survey=surveyobj).order_by("created_ts")
            try:
                ques = SurveyQuestion.objects.filter(survey=surveyobj).order_by("created_ts")
                context.update({"ques": ques})
            except:
                pass
            try:
                conque = ConfidentialQuestions.objects.get(survey_id=survey_id)
                context.update({"conque": conque})
            except:
               pass
            context.update({"title": "Create Survey Dashboard", "surveyobj": surveyobj})
            return render(request, self.template_name, context)
        else:
            return redirect("logins")


class SurveyQuestionview(TemplateView):
    """
    this view will call when popup open  created survey
    then  it will call and you can add question
    """

    template_name = "survey/theme/survey_question.html"

    def get(self, request, survey_id, *args, **kwargs):
        context = {}
        if request.user.is_authenticated:
            try:
                surveyobj = Survey.objects.get(id=survey_id)
            except:
                surveyobj = None
            try:
                ques = SurveyQuestion.objects.filter(survey=surveyobj).order_by("created_ts")
                context.update({"ques": ques})
            except:
                pass
            try:
                conque = ConfidentialQuestions.objects.get(survey=surveyobj)
                context.update({"conque": conque})
            except:
                pass
            context.update({"title": "Create Survey Dashboard", "surveyobj": surveyobj, })
            return render(request, self.template_name, context)
        else:
            return redirect("logins")

    def post(self, request, survey_id, *args, **kwargs):
       
        if request.is_ajax and request.user.is_authenticated:
                try:
                    que = request.POST['que']
                    surveyqueobj = SurveyQuestion.objects.create(
                                            survey_id=survey_id,
                                            question=que,
                                        )
                    
                    return JsonResponse(
                        {"questions": surveyqueobj.id}
                    )
                except:
                    que = request.POST['confque']
                    try:
                        conque = ConfidentialQuestions.objects.filter(survey_id=survey_id).delete()
                        conque.question = que
                        conque.save()
                    except:
                        conque = ConfidentialQuestions.objects.create(
                            survey_id=survey_id,
                            question=que,
                        )
                    return JsonResponse(
                        {"questions": conque.id}
                    )
        else:
            return JsonResponse({"fail": "please login and try again "})

    def put(self, request, survey_id, *args, **kwargs):
        if request.is_ajax and request.user.is_authenticated:
                try:
                    que = request.body.decode().split(',:')[1]
                    id = int(request.body.decode().split(',:')[0])
                    try:
                        request.body.decode().split(',:')[2]
                        conf = ConfidentialQuestions.objects.get(pk=id)
                        conf.question = que
                        conf.save()
                    except:
                        surque = SurveyQuestion.objects.get(pk=id)
                        surque.question = que
                        surque.save()
                    return JsonResponse({"questions": id})
                except:
                    return JsonResponse(
                        {"fail": "Something went wrong "}
                    )
        else:
            return JsonResponse({"fail": "please login and try again "})


class UnsentSurveys(TemplateView):
    """
    this view called when click on Unsent Surveys
    """

    template_name = "survey/theme/unsent_survey.html"

    def get(self, request, *args, **kwargs):
        context = {}
        if request.user.is_authenticated:
            if request.user.is_admin or request.user.is_superuser:
                surveyobj = Survey.objects.filter(status="US").order_by("-created_ts")[:5]
            else:
                surveyobj = Survey.objects.filter(
                    status="US", creator_id=request.user.id
                ).order_by("-created_ts")[:5]
            context.update({"survey": surveyobj, "title": "Unsent Surveys"})
            return render(request, self.template_name, context)
        else:
            return redirect("logins")

class UnsentSurveysListjson(ServerSideDatatableView):
    queryset = Survey.objects.filter(status="US").order_by("-created_ts")
    columns = ['title', 'Survey_client__first_name', 'created_ts']

class UnsentSurveysList(TemplateView):
    """
    this view called when click on Unsent Surveys page show more
    it will all give all unsent survey
    """

    template_name = "survey/theme/unsent_survey_list.html"
    # @method_decorator(require_membership)
    def get(self, request, *args, **kwargs):
        context = {}
        paginate_by = settings.PAGINATED_BY

        if request.user.is_authenticated:
            if request.user.is_admin or request.user.is_superuser:
                return render(request, self.template_name)
            else:
                surveyobj = Survey.objects.filter(
                    status="US", creator_id=request.user.id
                ).order_by("-created_ts")

            paginator = Paginator(surveyobj, paginate_by)
            page = self.request.GET.get("page")

            try:
                surveylist = paginator.page(page)
            except PageNotAnInteger:
                surveylist = paginator.page(1)
            except EmptyPage:
                surveylist = paginator.page(paginator.num_pages)
            context.update({"survey": surveylist, "title": "Unsent Surveys"})
            return render(request, self.template_name, context)
        else:
            return redirect("logins")


class ActiveSurveys(TemplateView):
    """
    this view called when click on Active Surveys
    """

    template_name = "survey/theme/active_survey.html"

    def get(self, request, *args, **kwargs):
        context = {}
        if request.user.is_authenticated:
            if request.user.is_admin or request.user.is_superuser:
                surveyobj = Survey.objects.filter(status="AT").order_by("-created_ts")[
                    :5
                ]
            else:
                surveyobj = Survey.objects.filter(
                    status="AT", creator_id=request.user.id
                ).order_by("-created_ts")[:5]
            context.update({"survey": surveyobj, "title": "Active Surveys"})
            return render(request, self.template_name, context)
        else:
            return redirect("logins")

    def post(self, request, *args, **kwargs):
        context = {}
        try:
            if request.user.is_authenticated:
                survey_id = request.POST.get("survey_id", None)
                if survey_id:
                    sur = Survey.objects.get(id=int(survey_id))
                    sur.status = "CT"
                    sur.save()
                    if request.user.is_admin or request.user.is_superuser:
                        surveyobj = Survey.objects.filter(status="AT").order_by(
                            "-created_ts"
                        )[:5]
                    else:
                        surveyobj = Survey.objects.filter(
                            status="AT", creator_id=request.user.id
                        ).order_by("-created_ts")[:5]
                    context.update({"survey": surveyobj, "title": "Active Surveys"})
                    return render(request, self.template_name, context)
            else:
                return redirect("logins")
        except:
            return redirect("logins")


class ActiveSurveysListjson(ServerSideDatatableView):
    queryset = Survey.objects.filter(Q(status='AT') | Q(status='RO')).order_by("-created_ts")
    columns = ['title', 'Survey_client__first_name', 'id', 'start_datetime', 'end_datetime', 'response_count', 'total_sent']


class ActiveSurveysList(TemplateView):
    """
    this view called when click on Active Surveys page show more
    it will all give all Active survey
    """

    template_name = "survey/theme/active_survey_list.html"

    def get(self, request, *args, **kwargs):
        context = {}
        paginate_by = settings.PAGINATED_BY

        if request.user.is_authenticated:
            if request.user.is_admin or request.user.is_superuser:
                return render(request, self.template_name)
                # surveyobj = Survey.objects.filter(Q(status='AT') | Q(status='RO')).order_by("-created_ts")
            else:
                surveyobj = Survey.objects.all().filter(
                    Q(status='AT') | Q(status='RO'),
                    creator_id=request.user.id
                ).order_by("-created_ts")

            # paginator = Paginator(surveyobj, paginate_by)
            # page = self.request.GET.get("page")
            #
            # try:
            #     surveylist = paginator.page(page)
            # except PageNotAnInteger:
            #     surveylist = paginator.page(1)
            # except EmptyPage:
            #     surveylist = paginator.page(paginator.num_pages)
            context.update({"survey": surveyobj, "title": "Active Surveys","today_date":str(datetime.datetime.now(timezone.utc))})
            return render(request, self.template_name, context)
        else:
            return redirect("logins")

    def post(self, request, *args, **kwargs):
        context = {}
        paginate_by = settings.PAGINATED_BY
        try:
            survey_id = request.POST.get("survey_id", None)
            if survey_id:
                sur = Survey.objects.get(id=int(survey_id))
                sur.status = "CT"
                sur.save()
            if request.user.is_admin or request.user.is_superuser:
                surveyobj = Survey.objects.filter(status="AT").order_by("-created_ts")
            else:
                surveyobj = Survey.objects.filter(
                    status="AT", creator_id=request.user.id
                ).order_by("-created_ts")

            paginator = Paginator(surveyobj, paginate_by)
            page = self.request.GET.get("page")

            try:
                surveylist = paginator.page(page)
            except PageNotAnInteger:
                surveylist = paginator.page(1)
            except EmptyPage:
                surveylist = paginator.page(paginator.num_pages)
            context.update({"survey": surveylist, "title": "Active Surveys"})
            return render(request, self.template_name, context)

        except:
            return render(request, self.template_name, context)


class CompleteSurveys(TemplateView):
    """
    this view called when click on Completed Surveys
    """

    template_name = "survey/theme/Completed_survey.html"

    def get(self, request, *args, **kwargs):
        context = {}
        if request.user.is_authenticated:
            if request.user.is_admin or request.user.is_superuser:
                surveyobj = Survey.objects.filter(status="CT").order_by("-created_ts")[
                    :5
                ]
            else:
                surveyobj = Survey.objects.filter(
                    status="CT", creator_id=request.user.id
                ).order_by("-created_ts")[:5]
            context.update({"survey": surveyobj, "title": "Completed Surveys"})
            return render(request, self.template_name, context)
        else:
            return redirect("logins")



class CompletedListjson(ServerSideDatatableView):
    queryset = Survey.objects.filter(status="CT").order_by("-created_ts")
    columns = ['title', 'Survey_client__first_name', 'id', 'start_datetime', 'end_datetime']


class CompletedSurveysList(TemplateView):
    """
    this view called when click on Completed Surveys page show more
    it will all give all Completed survey
    """

    template_name = "survey/theme/completed_survey_list.html"

    def get(self, request, *args, **kwargs):
        context = {}
        paginate_by = settings.PAGINATED_BY

        if request.user.is_authenticated:
            if request.user.is_admin or request.user.is_superuser:
                # surveyobj = Survey.objects.filter(status="CT").order_by("-created_ts")
                return render(request, self.template_name)
            else:
                surveyobj = Survey.objects.filter(
                    status="CT", creator_id=request.user.id
                ).order_by("-created_ts")

            # paginator = Paginator(surveyobj, paginate_by)
            # page = self.request.GET.get("page")
            #
            # try:
            #     surveylist = paginator.page(page)
            # except PageNotAnInteger:
            #     surveylist = paginator.page(1)
            # except EmptyPage:
            #     surveylist = paginator.page(paginator.num_pages)
            rpt = report.objects.filter(survey__status='CT', user="Client")
            context.update({"survey": surveyobj, "title": "Completed Surveys", 'report':rpt})
            return render(request, self.template_name, context)
        else:
            return redirect("logins")


class AllSurveys(TemplateView):
    """
    this view called when click on  All Surveys
    """

    template_name = "survey/theme/all_survey.html"

    def get(self, request, *args, **kwargs):
        context = {}
        if request.user.is_authenticated:
            if request.user.is_admin or request.user.is_superuser:
                surveyobj = Survey.objects.filter().order_by("-created_ts")[:5]
            else:
                surveyobj = Survey.objects.filter(creator_id=request.user.id).order_by(
                    "-created_ts"
                )[:5]
            context.update({"survey": surveyobj, "title": "All Surveys"})
            return render(request, self.template_name, context)
        else:
            return redirect("logins")


class AllSurveysListjson(ServerSideDatatableView):
    queryset = Survey.objects.filter().order_by("-id")
    columns = ['title', 'Survey_client__first_name', 'start_datetime', 'status', 'id', 'surveymarked', 'end_datetime']


class AllSurveysList(TemplateView):
    """
    this view called when click on All Surveys page show more
    it will all give all All survey
    """

    template_name = "survey/theme/all_survey_list.html"

    def get(self, request, *args, **kwargs):
        context = {}
        paginate_by = settings.PAGINATED_BY

        if request.user.is_authenticated:
            if request.user.is_admin or request.user.is_superuser:
                # surveyobj = Survey.objects.filter()
                return render(request, self.template_name)
            else:
                surveyobj = Survey.objects.filter(creator_id=request.user.id)
                surveyobj = surveyobj.order_by("-start_datetime")
            paginator = Paginator(surveyobj, paginate_by)
            page = self.request.GET.get("page")

            try:
                surveylist = paginator.page(page)
            except PageNotAnInteger:
                surveylist = paginator.page(1)
            except EmptyPage:
                surveylist = paginator.page(paginator.num_pages)
            context.update({"survey": surveylist, "title": "All Surveys", 'index':surveylist.paginator.num_pages*(surveylist.number-1)})
            return render(request, self.template_name, context)
        else:
            return redirect("logins")


class SurveysList(TemplateView):
    """
    this view called when click on All Surveys page show more
    it will all give all All survey
    """

    template_name = "survey/theme/all_survey_list.html"

    def get(self, request, *args, **kwargs):
        context = {}
        paginate_by = settings.PAGINATED_BY

        if request.user.is_authenticated:
            if request.user.is_admin or request.user.is_superuser:
                surveyobj = Survey.objects.filter()
            else:
                surveyobj = Survey.objects.filter(creator_id=request.user.id)
            try:
                if self.kwargs['value'] == 'title':
                    surveyobj = surveyobj.order_by('title')
                elif self.kwargs['value'] == 'start_datetime':
                    surveyobj = surveyobj.order_by('start_datetime')
                else:
                    surveyobj = surveyobj.order_by('status')
                # context.update({'some_data': surveyobj})
                # return surveyobj.get()
            except:
                surveyobj = surveyobj.order_by("-created_ts")
            paginator = Paginator(surveyobj, paginate_by)
            page = self.request.GET.get("page")

            try:
                surveylist = paginator.page(page)
            except PageNotAnInteger:
                surveylist = paginator.page(1)
            except EmptyPage:
                surveylist = paginator.page(paginator.num_pages)
            context.update({"survey": surveylist, "title": "All Surveys"})
            return render(request, self.template_name, context)
        else:
            return redirect("logins")


class UpdateSurveyLogo(TemplateView):
    """
    this view called when click on upload logo button on
    survey question page
    """

    def post(self, request, pk, *args, **kwargs):
        if request.is_ajax and request.user.is_authenticated and request.FILES:
            try:
                surveyobj = Survey.objects.get(id=int(pk))
                surveyobj.company_logo = request.FILES["uploadlogo"]
                surveyobj.save()
                return JsonResponse({"image_url": surveyobj.company_logo.url})
            except:
                rept = report.objects.get(id=int(pk))
                rept.logo = request.FILES["uploadlogoreport"]
                rept.save()
                return JsonResponse({"image_url": rept.logo.url})
        else:
            return redirect("logins")


class DeleteSurveyLogo(TemplateView):
    """
    this view called when click on delete icon logo image on
    survey question page
    """

    def post(self, request, pk, *args, **kwargs):
        if request.is_ajax and request.user.is_authenticated:
            try:
                surveyobj = Survey.objects.get(id=int(pk))
                surveyobj.company_logo = ""
                surveyobj.save()
                return JsonResponse(
                    {"image_url": "Your survey logo successfully deleted"}
                )
            except:
                return JsonResponse({"fail": "Something went wrong please try again"})
        else:
            return redirect("logins")

    def delete(self, request, pk, *args, **kwargs):
        if request.is_ajax and request.user.is_authenticated:
            try:
                reportobj = report.objects.get(id=int(pk))
                reportobj.logo = ""
                reportobj.save()
                return JsonResponse(
                    {"image_url": "Your survey logo successfully deleted"}
                )
            except:
                return JsonResponse({"fail": "Something went wrong please try again"})
        else:
            return redirect("logins")


class UpdateSurveyData(TemplateView):
    """
    this view called when click on upload logo button on
    survey question page
    """

    def post(self, request, pk, *args, **kwargs):

        if request.is_ajax and request.user.is_authenticated:
            context = {}
            title = request.POST.get("newsurveytit", None)
            try:
                surveyobj = Survey.objects.get(id=int(pk))
                surveyobj.title = title
                surveyobj.save()
                context.update({"title": "All Surveys"})
                return JsonResponse(
                    {"sucess": "Your Survey title successfully changed"}
                )
            except:
                return JsonResponse({"fail": "Something went wrong please try again"})
        else:
            return redirect("logins")


class SendSurvey(TemplateView):
    """
    Send Survey
    """

    template_name = "survey/theme/send_survey.html"

    def get(self, request, *args, **kwargs):
        context = {}
        if request.user.is_authenticated:
            if request.user.is_admin or request.user.is_superuser:
                pass
            else:
                pass
            context.update({"title": "Send Surveys"})
            return render(request, self.template_name, context)
        else:
            return redirect("logins")


class ParticipantResponse(TemplateView):
    """
    Participant Response
    """

    template_name = "survey/theme/participant_response.html"

    def get(self, request, *args, **kwargs):
        context = {}
        if request.user.is_authenticated:
            if request.user.is_admin or request.user.is_superuser:
                pass
            else:
                pass
            context.update({"title": "Send Surveys"})
            return render(request, self.template_name, context)
        else:
            return redirect("logins")


class GenerateFeedBackReport(TemplateView):
    template_name = "survey/theme/feedback_report.html"

    def get(self, request, *args, **kwargs):
        context = {}
        if request.user.is_authenticated:
            if request.user.is_admin or request.user.is_superuser:
                surveyobj = Survey.objects.filter().order_by("-created_ts")
            else:
                surveyobj = Survey.objects.filter(creator_id=request.user.id).order_by("-created_ts")
            context.update({"title": "Feedback Report", "surveyobj": surveyobj})
            return render(request, self.template_name, context)
        else:
            return redirect("logins")

    # def post(self, request, *args, **kwargs):
    #     survey_id = request.POST.get("surforgenfeerep")
    #     return redirect(
    #         "survey-feedback-detail",
    #         survey_id=int(survey_id),
    #     )


class FeedBackReport(TemplateView):
    """
    FeedBack Report
    """

    template_name = "survey/theme/feedback_report.html"

    def get(self, request, *args, **kwargs):
        context = {}
        if request.user.is_authenticated:
            if request.user.is_admin or request.user.is_superuser:
                surveyobj = Survey.objects.filter().order_by("-created_ts")
            else:
                try:
                    if kwargs['client_id']:
                        # surveyobj = Survey.objects.filter(~Q(total_sent=0), Survey_client=kwargs['client_id']).order_by("-created_ts")
                        surveyobj = Survey.objects.filter(status='CT', Survey_client=kwargs['client_id']).order_by("-created_ts")
                        context.update({"id": kwargs['client_id']})
                    else:
                        surveyobj = Survey.objects.filter(status='CT', creator_id=request.user.id).order_by("-created_ts")
                except:
                    surveyobj = Survey.objects.filter(status='CT', creator_id=request.user.id).order_by("-created_ts")

            for sur in surveyobj:
                # if sur.total_sent != sur.response_count or sur.total_sent == 0:
                #     surveyobj = surveyobj.exclude(id=sur.id)
                # else:
                    if len(report.objects.filter(~Q(status='Incomplete'), survey=sur, user='Client')) > 0:
                        surveyobj = surveyobj.exclude(id=sur.id)
            context.update({"title": "Feedback Report", "surveyobj": surveyobj})
            return render(request, self.template_name, context)
        else:
            return redirect("logins")

    def post(self, request, *args, **kwargs):
        survey_id = request.POST.get("surforgenfeerep")
        return redirect(
            "survey-feedback-detail",
            survey_id=int(survey_id),
        )


class SurveyFeedBackReport(TemplateView):
    """
    Particular Survey FeedBack Report
    """

    template_name = "survey/theme/new_report_page.html"


    def get(self, request, survey_id, *args, **kwargs):
        if not request.user.is_authenticated:
            return redirect("logins")
        context = {}
        partirecord = []
        answrs = []
        ansrecord = []
        survey = Survey.objects.get(pk=survey_id)
        participant = Participant.objects.filter(client=survey.Survey_client).order_by('relationship')
        relationobj = Relationship.objects.filter()
        random_num_list = []

        try:
            user = kwargs['user']
        except:
            user = 'Client'
        for rel in relationobj:
            count = 0
            surcomcount = 0
            answrs.clear()
            partic = Participant.objects.filter(client=survey.Survey_client, relationship=rel.id)

            data = SurveyCampaign.objects.filter(survey=survey, participant__relationship=rel, status=True)
            partirecord.append({'rel': rel.relation, 'id': rel.id, 'data': data})

            for p in partic:
                ans = Answer.objects.filter(~Q(display='False'), survey=survey, participant=p)
                if len(ans) > 0:
                    count = count+1
                try:
                    surcom = SurveyCampaign.objects.filter(survey=survey, participant=p)
                    if len(surcom) > 0:
                        surcomcount = surcomcount + 1
                except:
                    surcomcount = 0
            if surcomcount != 0:
                 ansrecord.append({'rel': rel.relation, 'count': count, 'sur': int((count/surcomcount)*100), 'sentto': surcomcount})
        try:
            surcom = SurveyCampaign.objects.filter(survey=survey, status=True)
            tosurcom = surcom[0].expires
            context.update({"surcom": surcom, 'tosurcom': tosurcom})
        except:
            pass
        try:
            rpt = report.objects.get(survey=survey, user=user)
        except:
            rpt = report.objects.create(survey=survey, user=user, title = survey.Survey_client.title, company_name = survey.Survey_client.company_name)
            try:
                for ans in EditedAnswer.objects.filter(survey=rpt.survey, user='Client'):
                    EditedAnswer.objects.create(survey=rpt.survey, user=user, prevanswer=ans.prevanswer, answer=ans.answer, deleted=ans.deleted)
            except:
                pass
        try:
            gennratedat = timezone.localtime(rpt.reportgenerateat.replace(tzinfo=pytz.utc), pytz.timezone('America/New_York')).strftime("%B %d, %Y")
        except:
            gennratedat = (timezone.localtime(datetime.datetime.now(pytz.UTC),
                                              pytz.timezone('America/New_York'))).strftime("%B %d, %Y")
        try:
            grp = Group.objects.filter(report=rpt).order_by('id')
            context.update({"grps": grp})
        except:
            pass
        try:
            footer = ReportFooter.objects.get(report=rpt)
            context.update({"footer": footer})
        except:
            pass
        if user == 'Coach':
            if rpt.includeconfquestion == True:
                try:
                    confques = ConfidentialQuestions.objects.get(survey=survey)
                    confans = ConfidentialAnswer.objects.filter(~Q(display='False'), question=confques).order_by('participant')
                    finalanslist = []
                    for a in confans:
                        try:
                            finalanslist.append(EditedConfidentialAnswer.objects.get(prevanswer=a, user=user))
                        except:
                            finalanslist.append('null')
                    finalanswers = list(zip(confans, finalanslist))
                    randomconfans = list(ConfidentialAnswer.objects.filter(~Q(display='False'), question=confques))
                    conf_random_num = random.randint(1, 5)
                    context.update({'conf_random_num':conf_random_num})
                    random.Random(conf_random_num).shuffle(randomconfans)
                    randomfinallist = []
                    for ans in randomconfans:
                        try:
                            randomfinallist.append(EditedConfidentialAnswer.objects.get(prevanswer=ans, user=user))
                        except:
                            randomfinallist.append('null')
                    randomfinalanswers = list(zip(randomconfans, randomfinallist))
                    context.update({"confques": confques, 'confans': finalanswers, 'randomconfans': randomfinalanswers})
                except:
                    pass
        context.update({"report": rpt, 'record': partirecord, 'participant': participant, 'ansrecord': ansrecord})
        if request.user.is_authenticated:
            if request.user.is_admin or request.user.is_superuser:
                surveyobj = Survey.objects.all().order_by("-created_ts")
            else:
                surveyobj = Survey.objects.filter(creator_id=request.user.id).order_by("-created_ts")
            questionobj = []
            questions = SurveyQuestion.objects.filter(survey_id=survey_id).order_by("created_ts")
            anslist = []
            randomanslist = []
            for q in questions:
                finalanslist = []
                randomfinalanslist = []
                for a in Answer.objects.filter(question=q, survey=survey).order_by('participant'):
                    try:
                        finalanslist.append(EditedAnswer.objects.get(prevanswer=a, user=user))
                    except:
                        finalanslist.append('null')
                random_ans = list(Answer.objects.filter(question=q, survey=survey))
                if len(random_ans) == 0:
                    random_num = 1
                else:
                    random_num = random.randint(1, len(random_ans))
                random_num_list.append(random_num)
                random.Random(random_num).shuffle(random_ans)                
                for ans in random_ans:
                    try:
                        randomfinalanslist.append(EditedAnswer.objects.get(prevanswer=ans, user=user))
                    except:
                        randomfinalanslist.append('null')
                try:
                    questionobj.append(EditedSurveyQuestion.objects.get(question=q, user=user))
                except:
                    questionobj.append('null')
                finalanswers = list(zip(Answer.objects.filter(question=q, survey=survey).order_by('participant'), finalanslist))
                anslist.append(finalanswers)
                randomfinalanswers = list(zip(random_ans, randomfinalanslist))
                randomanslist.append(randomfinalanswers)
            quesanslist = list(zip(questions,questionobj, anslist))
            randomquesanslist = list(zip(questions,questionobj, randomanslist))
            u = request.build_absolute_uri('/')[:-1].strip("/").replace('http:', 'https:')
            murl = u+"/media/"
            url = u+"/static/"
            try:
                baseimage = base64.b64encode(requests.get(u + rpt.logo.url).content)
                encoded_url = 'data:image/{};base64,'.format(rpt.logo.url.split('.')[-1]) + str(baseimage.decode())
                context.update({'encoded_url': encoded_url})
            except:
                pass
            try:
                grp = Group.objects.filter(report=rpt).order_by('id')
                context.update({"grps": grp})
            except:
                pass
            stat_random_num = random.randint(1, 2)

            context.update(
                {
                    "grps": grp,
                    "url": url,
                    "quesanslist": quesanslist,
                    "title": "Feedback Report",
                    "surveyobj": surveyobj,
                    "questionobj": questions,
                    "relationobj": relationobj,
                    "survey_id": survey_id,
                    "survey": survey,
                    "gennratedat": gennratedat,
                    "user_type": user,
                    "client": survey.Survey_client,
                    "randomquesanslist": randomquesanslist,
                    "random_num": random_num_list,
                    "stat_random_num": stat_random_num
                }
            )

            return render(request, self.template_name, context)

    def post(self, request, survey_id, *args, **kwargs):
        src = request.POST['src']
        rpt = report.objects.get(id=request.POST['id'])
        rpt.logo = src
        rpt.save()
        return JsonResponse({'success':'logo saved'})


import base64
import requests

class SendClientReport(TemplateView):
    template_name = "newpdf.html"

    def post(self, request, *args, **kwargs):
        base64data = request.POST['data']
        cmail = request.POST['cmail']
        survey_id = request.POST['survey_id']
        client_id = request.POST['client_id']    
        mail_subj = report.objects.get(survey__pk = survey_id, user="Client")
        subject = mail_subj.mail_subj
        client = Clients.objects.get(id=request.POST['client_id'])
        coach_name = request.user.coaches.first_name+request.user.coaches.last_name
        conn = http.client.HTTPSConnection("api.sendgrid.com")
        payload = "{}"
        headers = {'authorization': "Bearer {}".format(authkey)}
        conn.request("GET", "/v3/verified_senders", payload, headers)
        res = conn.getresponse()
        data = res.read()
        data.decode("utf-8")
        sendername =request.user.coaches.first_name+request.user.coaches.last_name
        senderemail = sendername+'@leadershiprealitycheck.com'
        from_email = Email(senderemail)
        replyto = ReplyTo(request.user.email)
        message = Mail(
            from_email= from_email,
            to_emails= cmail,
            subject= subject,
            html_content=render_to_string(
                        "core/theme/client_feedback_email.html",
                        {"mail_cont": mail_subj.mail_cont,"coach_name":coach_name,"client":client},
                    ),
        )
        message.reply_to = replyto
        
        attachedFile = Attachment(
            FileContent(base64data),
            FileName('Client_Report.pdf'),
            FileType('application/pdf'),
            Disposition('attachment')
        )
        message.attachment = attachedFile
        sg = sendgrid.SendGridAPIClient(api_key=authkey)
        response = sg.send(message)
        currentdate = datetime.datetime.now(pytz.UTC)
        mailed_report_date = report.objects.get(survey__pk = survey_id, user="Client")
        mailed_report_date.mail_report_date = currentdate
        mailed_report_date.send_feedback_report = True
        mailed_report_date.save()
        mail = report.objects.filter(survey__pk = survey_id).values()
        return JsonResponse({'success': 'success'})

class DownloadPdf(TemplateView):
    template = "newpdf.html"  # one page all question
    template_name = "new_onepage_all_question.html"

    def get(self, request, survey_id, *args, **kwargs):
        try:
            send_report = request.GET['send_report']
        except:
            send_report = ""
        try:
            ran_num_list = request.GET['random_num'].strip('][').split(', ')
        except:
            ran_num_list = []
        u = request.build_absolute_uri('/')[:-1].strip("/")#.replace('http:', 'https:')
        murl = u + "/media/"
        url = u + "/static/"
        context = {}
        survey = Survey.objects.get(pk=survey_id)
        participant = Participant.objects.filter(client=survey.Survey_client).order_by('relationship')
        try:
            user = kwargs['user']
        except:
            user = 'Client'
        if user == None:
            user = 'Client'
        rpt = report.objects.get(survey=survey, user=user)
        try:
            gennratedat = timezone.localtime(rpt.reportgenerateat.replace(tzinfo=pytz.utc), pytz.timezone('America/New_York')).strftime("%B %d, %Y")
        except:
            gennratedat = (timezone.localtime(datetime.datetime.now(pytz.UTC),
                                              pytz.timezone('America/New_York'))).strftime("%B %d, %Y")
        if user == 'Coach':
            if rpt.includeconfquestion == True:
                try:
                    conque = ConfidentialQuestions.objects.get(survey=survey)
                    confans = ConfidentialAnswer.objects.filter(~Q(display='False'), question=conque).order_by(
                        'participant')
                    finalanslist = []
                    for a in confans:
                        try:
                            finalanslist.append(EditedConfidentialAnswer.objects.get(prevanswer=a, user=user))
                        except:
                            finalanslist.append('null')
                    finalanswers = list(zip(confans, finalanslist))
                    randomconfans = list(ConfidentialAnswer.objects.filter(~Q(display='False'), question=conque))
                    try:
                        random.Random(int(request.GET["conf_random_num"])).shuffle(randomconfans)
                    except:
                        random_num = random.randint(1, 5)
                        random.Random(random_num).shuffle(randomconfans)
                    randomfinallist = []
                    for ans in randomconfans:
                        try:
                            randomfinallist.append(EditedConfidentialAnswer.objects.get(prevanswer=ans, user=user))
                        except:
                            randomfinallist.append('null')
                    randomfinalanswers = list(zip(randomconfans, randomfinallist))
                    context.update({"conque": conque, 'confans': finalanswers,'randomfinalanswers':randomfinalanswers})
                except:
                    pass
        context.update({"report": rpt})

        questionobj = SurveyQuestion.objects.filter(survey_id=survey_id).order_by("id")
        questions = []
        answers = []
        for question in questionobj:
            questions.append(question)
            answ = Answer.objects.filter(question=question).values('id', 'answer', 'participant__first_name',
                                                                       'participant__relationship__relation')
            answers.append(answ)
        questions_answers = zip(questions,answers)
        context.update({'questions_answers': questions_answers})


        questions = []
        anslist = []

        # for index, q in enumerate(questionobj):
        #     finalanslist = []
        #     answers = list(Answer.objects.filter(question=q, survey=survey))
        #     try:
        #         if len(ran_num_list) > 0:
        #             random.Random(int(ran_num_list[index])).shuffle(answers)
        #         else:
        #             random_num = random.randint(1, 5)
        #             random.Random(random_num).shuffle(answers)
        #     except:
        #         random_num = random.randint(1, 5)
        #         random.Random(random_num).shuffle(answers)
        #     for a in answers:
        #         try:
        #             finalanslist.append(EditedAnswer.objects.get(prevanswer=a, user=user))
        #         except:
        #             finalanslist.append('null')
        #     try:
        #         questions.append(EditedSurveyQuestion.objects.get(question=q, user=user))
        #     except:
        #         questions.append('null')
        #     finalanswers = list(zip(answers, finalanslist))
        #     anslist.append(finalanswers)
        # quesanslist = list(zip(questionobj, questions, anslist))

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
            context.update({"groups": grp})
        except:
            pass
        relationobj = Relationship.objects.filter()
        survey_campaigns = SurveyCampaign.objects.filter(survey=survey)
        relations = Relationship.objects.all()
        if survey_campaigns.count() > 0:
            participant_summary = []
            for relation in relations:
                total_sent = survey_campaigns.filter(participant__relationship=relation)
                if total_sent.filter(status=True).count() > 0:
                    participant_summary.append({
                        'relation': relation,
                        'total_sent': total_sent.count(),
                        'participant_responded': total_sent.filter(status=True).count(),
                        'participation_percentage': (total_sent.count() / total_sent.filter(
                            status=True).count()) * 100 if total_sent.count() > 0 else 0
                    })
            context.update({'survey_campaigns': survey_campaigns, "participant_summary": participant_summary})

        try:
            surcom = SurveyCampaign.objects.filter(survey=survey, status=True)
            tosurcom = surcom[0].expires
            context.update({"surcom": surcom, 'tosurcom': tosurcom})
        except:
            pass

        try:
            baseimage = base64.b64encode(requests.get(u + rpt.logo.url).content)
            encoded_url = 'data:image/{};base64,'.format(rpt.logo.url.split('.')[-1]) + str(baseimage.decode())
            context.update({'encoded_url': encoded_url})
        except:
            pass
        rpt.status = "Completed"
        rpt.save()
        try:
            stat_random_num = int(request.GET["stat_random_num"])
        except:
            stat_random_num = random.randint(1, 2)

        if send_report == 'client_report':
            context.update(
                {
                    "questionobj": questionobj,
                    "relationobj": relationobj,
                    "survey_id": survey_id,
                    "survey": survey,
                    "client": survey.Survey_client,
                    "url": url,
                    "murl": murl,
                    "participant": participant,
                    "u": u,
                    'fotrtxt': footertext,
                    'fotrclr': footercolor,
                    'footerfrontcolor': footerfrontcolor,
                    'stat_random_num': stat_random_num,
                    "gennratedat":gennratedat,
                    'send_report':'client_report'
                })
        else:
            if request.user.is_admin == True:
                user = request.user.username
                title = 'admin'
            else:
                try:
                    user = request.user.coach_full_name
                    title =  request.user.coaches.title
                except:
                    user = request.user.clients.coach.first_name + ' ' + request.user.clients.coach.last_name
                    title = request.user.clients.coach.title
            context.update(
            {
                "questionobj": questionobj,
                "relationobj": relationobj,
                "survey_id": survey_id,
                "survey": survey,
                "client": survey.Survey_client,
                "url": url,
                "murl": murl,
                "user": user,
                "title": title,
                "participant": participant,
                "u": u,
                'fotrtxt': footertext,
                'fotrclr': footercolor,
                "gennratedat":gennratedat,
                'footerfrontcolor': footerfrontcolor,
                'stat_random_num': stat_random_num
            })
        return render(request, self.template, context)


class AddResponses(TemplateView):
    template = "pdf-generate.html"

    def get(self, request, *args, **kwargs):
        return HttpResponse("Thank you for participating. Your partial response has been saved.")

    def post(self, request, *args, **kwargs):
        totalans = 0
        sur_comp = SurveyCampaign.objects.get(uid=request.POST['u_id'])
        if (sur_comp.status == True):
            return HttpResponse('You have already submitted your response.')
        else:
            sur = sur_comp.survey
            que = SurveyQuestion.objects.filter(survey=sur).order_by("created_ts")
            try:
                request.POST['submit']
                for q in que:
                    ans = request.POST[str(q.id)]
                    try:
                        abc = Answer.objects.filter(question=q, participant=sur_comp.participant, survey=sur)
                        a = abc[0].id
                        abc.exclude(id=a).delete()
                        answ = Answer.objects.get(question=q, participant=sur_comp.participant, survey=sur)
                        answ.answer = ans
                        answ.display = True
                        answ.save()
                    except:
                        Answer.objects.create(question=q, answer=ans, participant=sur_comp.participant, survey=sur, display=True)
                    if ans != '':
                        totalans = totalans+1
                try:
                    confid = request.POST['conid']
                    confans = request.POST['confidential-ans']
                    conq = ConfidentialQuestions.objects.get(id=confid)
                    try:
                        abc = ConfidentialAnswer.objects.filter(question=conq, participant=sur_comp.participant)
                        a = abc[0].id
                        abc.exclude(id=a).delete()
                        cona = ConfidentialAnswer.objects.get(question=conq, participant=sur_comp.participant)
                        cona.answer = confans
                        cona.display = True
                        cona.save()
                    except:
                        ConfidentialAnswer.objects.create(question=conq, answer=confans, participant=sur_comp.participant, display=True)
                    if confans != '':
                        totalans = totalans+1
                except:
                     pass

                ques = SurveyQuestion.objects.filter(survey=sur_comp.survey)
                try:
                    confque = ConfidentialQuestions.objects.get(survey=sur_comp.survey)
                    confquelen = 1
                except:
                    confquelen = 0

                totalques = len(ques) + confquelen

                sur_comp.response = 'Complete'
                sur_comp.save()
                if sur.response_count == 0:
                    num = 1
                else:
                    num = sur.response_count + 1
                sur.response_count = num
                sur.save()
                sur_comp.status = True
                sur_comp.save()
                if sur.total_sent != 0:
                    if sur.total_sent == sur.response_count:
                        sur.status = 'CT'
                        sur.end_datetime = datetime.datetime.now(timezone.utc)
                        sur.save()

                return JsonResponse({"Psuccess": "Thank you for participating. Your response has been received."})
            except:
                for q in que:
                    ans = request.POST[str(q.id)]
                    try:
                        abc = Answer.objects.filter(question=q, participant=sur_comp.participant, survey=sur)
                        a = abc[0].id
                        abc.exclude(id=a).delete()
                        answ = Answer.objects.get(question=q, participant=sur_comp.participant, survey=sur)
                        answ.answer = ans
                        answ.save()
                    except:
                        Answer.objects.create(question=q, answer=ans, participant=sur_comp.participant, survey=sur)
                    if ans != '':
                        totalans = totalans+1
                try:
                    confid = request.POST['conid']
                    confans = request.POST['confidential-ans']
                    conq = ConfidentialQuestions.objects.get(id=confid)
                    try:
                        abc = ConfidentialAnswer.objects.filter(question=conq, participant=sur_comp.participant)
                        a = abc[0].id
                        abc.exclude(id=a).delete()
                        cona = ConfidentialAnswer.objects.get(question=conq, participant=sur_comp.participant)
                        cona.answer = confans
                        cona.save()
                    except:
                        ConfidentialAnswer.objects.create(question=conq, answer=confans,
                                                          participant=sur_comp.participant)
                    if confans != '':
                        totalans = totalans+1
                except:
                    pass
                sur_comp.response = 'PARTIALRESPONSE'
                sur_comp.save()
                return JsonResponse({"Psuccess": "Your partial response has been saved. Either you can complete the survey and submit or You can come anytime to complete the survey before the close date of the survey."})
        return JsonResponse({"Psuccess": "Thank you for participating. Your response has been received."})


class AddGroups(TemplateView):
    template = "pdf-generate.html"

    def post(self, request, *args, **kwargs):
        report_id = report.objects.get(id=request.POST['id'])
        try:
            Group.objects.filter(report=report_id).delete()
        except:
            pass
        answers = Answer.objects.filter(survey=report_id.survey)
        grpdetail = {}
        groups = []
        lessthan3 = []
        # get all group names
        for i in range(1, 7):
            try:
                request.POST['Group {}'.format(i)]
                groups.append('Group {}'.format(i))
            except:
                pass
        # create groups
        for group in groups:
            g = Group.objects.create(name=group, report=report_id)
            for relation in request.POST[group].split(','):# will return relation in particular group
                relation = Relationship.objects.get(relation=relation)
                g.relation.add(relation)
            participantcount = 0
            for relation in g.relation.all():
                count = 0
                for parti in Participant.objects.filter(relationship=relation, client=report_id.survey.Survey_client):
                    if Answer.objects.filter(survey=report_id.survey, participant=parti).exists():
                        count = count+1
                participantcount = participantcount + count
            g.partcount = participantcount
            if participantcount < 3:
                if relation.relation != 'Manager':
                    if not group in lessthan3:
                        lessthan3.append(group)
            anscount = SurveyCampaign.objects.filter(survey=report_id.survey, status=True).count()
            g.anscount = anscount
            g.save()

        if len(lessthan3) > 0:
             return JsonResponse({"fail": "There are less than 3 participants in <b>{}</b>. To ensure anonymity,"
                   " it is best practice to have 3 or more participants in <b>{}</b>. You may go back to change your"
                    " selection.".format(",".join(str(x) for x in lessthan3),", ".join(str(x) for x in lessthan3))})
        return JsonResponse({"success": "You have created group names"})


    def put(self, request, *args, **kwargs):
        group = Group.objects.get(id=int(request.body.decode().split(',')[0]))
        group.name = request.body.decode().split(',')[1]
        group.save()
        return JsonResponse({"success": "You have edited group name."})

    def delete(self, request, *args, **kwargs):
        try:
            report_id = report.objects.get(id=int(request.body.decode()))
            Group.objects.filter(report=report_id).delete()
        except:
            pass
        return JsonResponse({"success": "deleted."})

class DeleteResponses(TemplateView):
    template = "pdf-generate.html"

    def delete(self, request, id, user, *args, **kwargs):
        # Answer.objects.get(id=id).delete()
        ans = Answer.objects.get(id=id)
        try:
            edans = EditedAnswer.objects.get(prevanswer=ans, user=user)
        except:
            edans = EditedAnswer.objects.create(prevanswer=ans, user=user, answer=ans.answer, survey=ans.survey)
        edans.deleted = True
        edans.save()
        return JsonResponse({'success':'deleted'})

    def put(self, request, id, user, *args, **kwargs):
        try:
            request.body.decode().split(',')[1]
            ans = ConfidentialAnswer.objects.get(id=id)
            try:
                res = EditedConfidentialAnswer.objects.get(prevanswer=ans, user=user)
                res.answer = request.body.decode().split(',')[0]
                res.save()
            except:
               EditedConfidentialAnswer.objects.create(prevanswer=ans, answer=request.body.decode().split(',')[0],
                                                       survey=ans.question.survey, user=user)
        except:
            ans = Answer.objects.get(id=id)
            try:
                res = EditedAnswer.objects.get(prevanswer=ans, user=user)
                res.answer = request.body.decode()
                res.save()
            except:
                EditedAnswer.objects.create(prevanswer=ans, answer=request.body.decode(), survey=ans.survey, user=user)

        return JsonResponse({'success': 'response successfully edited'})


class DeleteConfResponses(TemplateView):
    template = "pdf-generate.html"

    def delete(self, request, id, *args, **kwargs):
        # ConfidentialAnswer.objects.get(id=id).delete()
        ans = ConfidentialAnswer.objects.get(id=id)
        ans.deleted = True
        ans.save()
        return JsonResponse({'success': 'deleted'})


class ReportStage(TemplateView):
    template = "pdf-generate.html"

    def put(self, request,):
        data = request.body.decode().split(',')
        id = data[0]
        page = data[1]
        rpt = report.objects.get(id=int(id))
        rpt.currentpage = page
        rpt.save()
        return JsonResponse({'success': 'updated'})

class BuySurvey(TemplateView):
    template = "core/theme/my_account.html"

    def post(self, request,):
        try:
            persurprice = int(request.POST['total_sur_cost'])/int(request.POST['survey_buy'])
            surveyupgraded = SurveyUpgraded.objects.create(coach=request.user.coaches, totalfee=int(request.POST['total_sur_cost']),
                                          persurveyprize=persurprice, noofsurvey=int(request.POST['survey_buy']))

            for uplan in UserPlan.objects.filter(coach=request.user.coaches):
                try:
                    upinfo = UserPlanInfo.objects.get(uplan=uplan)
                    if upinfo.status() == True:
                        upinfo.surveyupgraded = upinfo.surveyupgraded+int(request.POST['survey_buy'])
                        upinfo.addedsurvey.add(surveyupgraded)
                        upinfo.save()
                except:
                    pass
            # request.POST['total_sur_cost']
            return redirect('my-account')
        except:
            messages.warning(request,
                             "Payment Fail. Please try after some time")
            return redirect(request.META['HTTP_REFERER'])


class FilterResponses(TemplateView):
    template = "pdf-generate.html"

    def get(self, request, *args, **kwargs):
        sur_id = request.GET['id']
        survey = Survey.objects.get(id=sur_id)
        try:
            que = ConfidentialQuestions.objects.get(survey=survey)
        except:
            pass
        try:
            que_id = request.GET['que']
            if que_id == "allquestion":
                context = {}
                questions = SurveyQuestion.objects.filter(survey=survey)

                for que in questions:
                    ansobj = Answer.objects.filter(~Q(display='False'), question=que, survey=survey).order_by('participant')
                    ANS = ansobj.values_list()
                    res = list(ANS)
                    context.update({que.question: res})
                try:
                    cquestion = ConfidentialQuestions.objects.get(survey=survey)
                    ansobj = ConfidentialAnswer.objects.filter(~Q(display='False'), question=cquestion).order_by('participant')
                    ANS = ansobj.values_list()
                    res = list(ANS)
                    context.update({cquestion.question: res})
                except:pass
                return JsonResponse(context)
            que = SurveyQuestion.objects.get(id=que_id)
            ansobj = Answer.objects.filter(~Q(display='False'),question=que, survey=survey).order_by('participant')
            ANS = ansobj.values_list()
            res = list(ANS)
            return JsonResponse({'res': res})
        except:
            try:
                rel_id = request.GET['rel']
                if(rel_id == '0'):
                    partobj = Participant.objects.filter(client=survey.Survey_client)
                else:
                    partobj = Participant.objects.filter(relationship=rel_id, client=survey.Survey_client)

                participant_with_no_response = partobj

                for participant in partobj:
                    if SurveyCampaign.objects.filter(participant=participant, survey=survey, status=True).count() < 1:
                        participant_with_no_response = participant_with_no_response.exclude(id=participant.id)

                QWE =participant_with_no_response.values_list()
                partlist = list(QWE)
                return JsonResponse({'part': partlist})
            except:
                try:
                    part_id = request.GET['par']
                    try:
                        CQUE = ConfidentialQuestions.objects.filter(survey=survey).values_list()
                        cque = list(CQUE)
                    except:
                        pass
                    allque = SurveyQuestion.objects.filter(survey=Survey.objects.get(id=sur_id)).order_by("created_ts")
                    QUES = allque.values_list()
                    aq = list(QUES)
                    if (part_id == '0'):
                        ansobj = Answer.objects.filter(~Q(display='False'),survey=Survey.objects.get(id=sur_id)).order_by('participant')
                        partobj = Participant.objects.filter(client=survey.Survey_client)
                        QWE = partobj.values_list()
                        partlist = list(QWE)
                        ANS = ansobj.values_list()
                        res = list(ANS)
                        try:
                            cans = ConfidentialAnswer.objects.filter(~Q(display='False'),question=que).order_by('participant')
                            cans.count()
                            CANS = cans.values_list()
                            cres = list(CANS)
                        except:
                            cres = 'null'

                        return JsonResponse({'res': res, 'cres': cres, 'cque': cque, 'allque': aq, 'part': partlist})
                    else:
                        ansobj = Answer.objects.filter(~Q(display='False'),participant=part_id,
                                                       survey=Survey.objects.get(id=sur_id)).order_by('question')
                        try:
                            cans = ConfidentialAnswer.objects.get(~Q(display='False'),question=que, participant=part_id)
                            ca = cans.answer
                        except:
                            ca = 'null'
                        ANS = ansobj.values_list()
                        res = list(ANS)
                        relation = Participant.objects.get(id = res[0][6]).relationship.relation
                        return JsonResponse({'res': res, 'cans': ca, 'cque': cque, 'allque': aq, 'rel':relation})
                except:
                    que_id = request.GET['cque']
                    que = ConfidentialQuestions.objects.get(id=que_id)
                    ansobj = ConfidentialAnswer.objects.filter(~Q(display='False'),question=que).order_by('participant')
                    ANS = ansobj.values_list()
                    res = list(ANS)
                    return JsonResponse({'res': res})

    def put(self, request, *args, **kwargs):
        sur_id = int(request.body.decode())
        sur = Survey.objects.get(id=sur_id)
        ques = SurveyQuestion.objects.filter(survey=sur)
        Que = ques.values_list()
        res = list(Que)
        data = {'que': res}
        # try:
        #     surheadcom = EditedSurveyQuestion.objects.filter(survey_id=survey_id, user=user)
        #     data.update({"surheadcom": surheadcom})
        # except:
        #     pass
        try:
            confquest = ConfidentialQuestions.objects.get(survey=sur)
            data.update({"confque": confquest.question, "id": confquest.id})
        except:
            pass
        return JsonResponse(data)


class DeleteFeedBackReport(TemplateView):
    """
    FeedBack Report
    """

    template_name = "survey/theme/feedback_report.html"

    def delete(self, request, id, *args, **kwargs):
        for i in request.body.decode().split(','):
            try:
                rpt = report.objects.get(survey=Survey.objects.get(id=id), user=i.capitalize())
                EditedAnswer.objects.filter(survey=rpt.survey, user=rpt.user).delete()
                EditedConfidentialAnswer.objects.filter(survey=rpt.survey, user=rpt.user).delete()
                for que in SurveyQuestion.objects.filter(survey=rpt.survey):
                    try:
                        q = EditedSurveyQuestion.objects.filter(question=que, user=rpt.user).delete()
                        # q.heading = None
                        # q.comments = None
                        # q.save()
                    except:pass
                try:
                    que = ConfidentialQuestions.objects.filter(survey=rpt.survey)
                    que.heading = None
                    que.comments = None
                    que.save()
                except:pass
                rpt.delete()
            except:
                pass
        return JsonResponse({'success': "Report deleted"})


class SurveyQuestionList(TemplateView):
    """
    Question List page
    """

    template_name = "survey/theme/question_list.html"

    def get(self, request, survey_id, *args, **kwargs):
        context = {}
        if request.user.is_authenticated:
            try:
                surveyobj = Survey.objects.get(id=survey_id, creator_id=request.user.id)
                if surveyobj:
                    questionobj = SurveyQuestion.objects.filter(
                        survey_id=surveyobj.id
                    ).order_by("created_ts")
                    context.update(
                        {
                            "surveyobj": surveyobj,
                            "title": "Question List",
                            "question": questionobj,
                        }
                    )
                    return render(request, self.template_name, context)
                else:
                    context.update({"title": "Question List"})
                    return render(request, self.template_name, context)
            except:
                context.update(
                    {"title": "Question List", "message": "please select your survey"}
                )
                return render(request, self.template_name, context)
        else:
            return redirect("logins")


class CopyPasteSurvey(TemplateView):
    """
    this view called when click on  All Surveys
    """

    template_name = "survey/theme/copypastesurvey.html"

    def get(self, request,sur_id, *args, **kwargs):
        context = {}
        try:
            cid = Clients.objects.get(id=kwargs['client_id'])
            context.update(
                {
                    "client": cid,
                })
        except:
            pass
        surveyclientobj = Clients.objects.filter(
            coach_id=request.user.coaches.id
        ).order_by("first_name")
        paginate_by = 9
        if request.user.is_authenticated:
            if request.user.is_admin or request.user.is_superuser:
                recentsurveyobj = Survey.objects.filter().order_by("-created_ts")[:3]
                allsurveyobj = Survey.objects.filter(
                    creator_id=request.user.id
                ).order_by("-created_ts")[5:]
            else:
                recentsurveyobj = Survey.objects.filter(creator=request.user).order_by("-created_ts")[1:4]
                allsurveyobj = Survey.objects.filter(creator_id=request.user.id).order_by("-created_ts")[4:]
            recentresponse = []
            allresponse = []
            for sur in recentsurveyobj:
                recentresponse.append(sur.response_count)
            for sur in allsurveyobj:
                allresponse.append(sur.response_count)
            recentlist = zip(recentsurveyobj,recentresponse)
            alllist = zip(allsurveyobj,allresponse)
            paginator = Paginator(list(alllist), paginate_by)
            page = self.request.GET.get("page")
            try:
                allsurveyobjlist = paginator.page(page)
            except PageNotAnInteger:
                allsurveyobjlist = paginator.page(1)
            except EmptyPage:
                allsurveyobjlist = paginator.page(paginator.num_pages)
            context.update(
                {
                    "recent": recentlist,
                    "allsurveyobj": allsurveyobjlist,
                    "title": "Copy a past survey",
                    "surveyclient": surveyclientobj,
                    "sur_id": sur_id
                }
            )
            return render(request, self.template_name, context)
        else:
            return redirect("logins")


class SurveyFavouriteView(TemplateView):
    template_name = "survey/theme/copypastesurvey.html"

    def post(self, request, survey_id, *args, **kwargs):
        if (
            request.is_ajax
            and request.user.is_authenticated
            and request.user.coach_exist
        ):
            if request.POST.get("favourite") == "1":
                if not FavouriteSurvey.objects.filter(
                    user_id=request.user.id, survey_id=survey_id
                ).exists():
                    FavouriteSurvey.objects.create(
                        user_id=request.user.id, survey_id=survey_id
                    )
                    return JsonResponse(
                        {"success": "Successfully added survey to your favorite list"}
                    )
                else:
                    return JsonResponse(
                        {"success": "Successfully added survey to your favorite list"}
                    )

            else:
                FavouriteSurvey.objects.filter(
                    user_id=request.user.id, survey_id=survey_id
                ).delete()
                return JsonResponse(
                    {"success": "Successfully  removed survey from your favorite list"}
                )
        else:
            return redirect("logins")


class SurveyCopyView(TemplateView):
    template_name = "survey/theme/copypastesurvey.html"

    def post(self, request, survey_id, *args, **kwargs):
        if (
            request.is_ajax
            and request.user.is_authenticated
            and request.user.coach_exist
        ):
            try:
                survyobj = Survey.objects.get(id=int(survey_id))
                if survyobj:
                    try:
                        chk = Survey.objects.filter(Survey_client=Clients.objects.get(id=int(request.POST['client'])),
                                              title=request.POST['name'])
                        if chk.count() > 0:
                            return JsonResponse(
                                {"fail": "Survey with same name already exists. Please try with other name."}
                            )
                    except:
                        pass
                    try:
                        newsurveyobj = Survey.objects.create(
                            Survey_client=Clients.objects.get(id=int(request.POST['client'])),
                            creator_id=request.user.id,
                            Survey_category_id=survyobj.Survey_category_id,
                            status="US",
                            title=request.POST['name'],
                            instructions=survyobj.instructions,
                            description=survyobj.description,
                            surveyformat=survyobj.surveyformat,
                            emailreminder=survyobj.emailreminder,
                            whenemailreminder=survyobj.whenemailreminder,
                            surveymarked=survyobj.surveymarked,
                        )
                        for q in SurveyQuestion.objects.filter(survey_id=survey_id):
                            SurveyQuestion.objects.create(survey_id=newsurveyobj.id, question=q.question)
                    except:
                        newsurveyobj = Survey.objects.create(
                            creator_id=request.user.id,
                            Survey_category_id=survyobj.Survey_category_id,
                            status="US",
                            title=request.POST['name'],
                            instructions=survyobj.instructions,
                            description=survyobj.description,
                            surveyformat=survyobj.surveyformat,
                            emailreminder=survyobj.emailreminder,
                            whenemailreminder=survyobj.whenemailreminder,
                            surveymarked=survyobj.surveymarked,
                        )

                    return JsonResponse(
                        {"survyobj": newsurveyobj.id, "qsurvey": survyobj.id}
                    )
                else:
                    return JsonResponse({"fail": "Something went wrong"})

            except:
                return JsonResponse({"fail": "Something went wrong"})

        else:
            return redirect("logins")


class DeleteQues(TemplateView):

    template_name = "survey/theme/copypastesurvey.html"

    def delete(self, request, que_id, *args, **kwargs):
        try:
            SurveyQuestion.objects.get(id=que_id).delete()
        except:
            ConfidentialQuestions.objects.get(id=que_id).delete()
        return JsonResponse(
            {"success": "Successfully deleted question"}
        )


class DeleteConfQues(TemplateView):

    template_name = "survey/theme/copypastesurvey.html"

    def delete(self, request, que_id, *args, **kwargs):
        ConfidentialQuestions.objects.get(id=que_id).delete()
        return JsonResponse(
            {"success": "Successfully deleted question"}
        )


import urllib
from django.template.defaultfilters import register
from urllib.parse import unquote #python3

@register.filter
def unquote_new(value):
    return urllib.parse.unquote(value)

class SurveyCopyQuestionList(TemplateView):
    """
    Question List page
    """

    template_name = "survey/theme/copy_question.html"

    def get(self, request, survey_id, question_survey, *args, **kwargs):
        context = {}
        if request.user.is_authenticated:
            try:
                surveyobj = Survey.objects.get(id=survey_id, creator_id=request.user.id)
                try:
                    conque = ConfidentialQuestions.objects.get(survey_id=surveyobj)
                    context.update({"conque": conque})
                except:
                    pass
                if surveyobj:
                    questionobj = SurveyQuestion.objects.filter(
                        survey_id=survey_id
                    ).order_by("created_ts")

                    context.update(
                        {
                            "surveyobj": surveyobj,
                            "title": "Question List",
                            "ques": questionobj,
                            "count": questionobj.count(),
                            "nextstart": int(questionobj.count()) + 1,
                        }
                    )

                    return render(request, self.template_name, context)
                else:
                    context.update({"title": "Question List"})
                    return render(request, self.template_name, context)
            except:
                context.update(
                    {"title": "Question List", "message": "please select your survey"}
                )
                return render(request, self.template_name, context)
        else:
            return redirect("logins")

    def post(self, request, survey_id, question_survey, *args, **kwargs):
        context = {}
        options = []
        # for i in unquote(request.body.decode()).split(','):
        #     options.append(i.split(":")[1].split('\\n')[0].split("}")[0].replace('+', ' ').split('"')[1])
        if request.user.is_authenticated:
            try:
                surveyobj = Survey.objects.get(id=question_survey, creator_id=request.user.id)
                questions = SurveyQuestion.objects.filter(survey=surveyobj).order_by("created_ts")
                newsurveyobj =Survey.objects.get(id=survey_id, creator_id=request.user.id)
                newsurveyobj.company_logo = surveyobj.company_logo
                newsurveyobj.instructions = surveyobj.instructions
                newsurveyobj.save()
                for i in questions:
                    SurveyQuestion.objects.create(survey=newsurveyobj, question=i.question).save()
                try:
                    confques = ConfidentialQuestions.objects.get(survey=surveyobj)
                    ConfidentialQuestions.objects.create(survey=newsurveyobj, question=confques.question)
                except:pass
                return JsonResponse({'success': 'questions added'})
                
            except:
                return JsonResponse({'fail': 'questions not added'})
                
        else:
            return redirect("logins")

    def delete(self, request, survey_id, question_survey, *args, **kwargs):
        context = {}
        ids = []
        try:
            for l in range(1, len(request.body.decode().split("="))):
                ids.append(request.body.decode().split("=")[l].split('&')[0])
        except:
            pass
        for id in ids:
                SurveyQuestion.objects.get(id=id).delete()
        if request.user.is_authenticated:
            try:
                surveyobj = Survey.objects.get(id=survey_id, creator_id=request.user.id)
                if surveyobj:
                    questionobj = SurveyQuestion.objects.filter(
                        survey_id=question_survey
                    ).order_by("created_ts")
                    context.update(
                        {
                            "surveyobj": surveyobj,
                            "title": "Question List",
                            "question": questionobj,
                            "count": questionobj.count(),
                            "nextstart": int(questionobj.count()) + 1,
                        }
                    )

                    return render(request, self.template_name, context)
                else:
                    context.update({"title": "Question List"})
                    return render(request, self.template_name, context)
            except:
                context.update(
                    {"title": "Question List", "message": "questions not deleted"}
                )
                return render(request, self.template_name, context)
        else:
            return redirect("logins")

    def put(self, request, survey_id, question_survey, *args, **kwargs):
        context = {}

        if request.user.is_authenticated:
            try:
                surveyobj = Survey.objects.get(id=survey_id, creator_id=request.user.id)
                if surveyobj:
                    questionobj = SurveyQuestion.objects.filter(
                        survey_id=question_survey
                    ).order_by("created_ts")
                    context.update(
                        {
                            "surveyobj": surveyobj,
                            "title": "Question List",
                            "question": questionobj,
                            "count": questionobj.count(),
                            "nextstart": int(questionobj.count()) + 1,
                        }
                    )

                    return render(request, self.template_name, context)
                else:
                    context.update({"title": "Question List"})
                    return render(request, self.template_name, context)
            except:
                context.update(
                    {"title": "Question List", "message": "questions not deleted"}
                )
                return render(request, self.template_name, context)
        else:
            return redirect("logins")



class SendSurveyFillup(TemplateView):
    """
    it will open survey and fill by participant save data
    """

    template_name = "survey/theme/survey_feedback.html"

    def get(self, request, *args, **kwargs):
        context = {}
        questionobj = SurveyQuestion.objects.all()
        context.update({"queobj": questionobj})
        return render(request, self.template_name, context)
