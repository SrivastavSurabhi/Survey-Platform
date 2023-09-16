from django.contrib.auth.mixins import LoginRequiredMixin
from django.views import View
from django.shortcuts import render, redirect
from core.models import *
from survey.models import *
from django_datatables_view.base_datatable_view import BaseDatatableView
from django.db.models import Q
from django.db.models import F,Value, Case, When
from new_theme.constant import *
from django.http import JsonResponse
import json
from django.db import transaction
from sendgrid.helpers.mail import Mail, Email, To, Content, ReplyTo
from django.template.loader import render_to_string
import sendgrid
import requests
from django.views.generic import TemplateView
import logging
import os


authkey = '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'

class  SurveysView(LoginRequiredMixin, View):
    template_name = "new_theme/surveys.html"

    def get(self, request):
        return render(request, self.template_name)


class SurveyDataTableView(BaseDatatableView):
    order_columns = ["id", "title", "Survey_client__coach__first_name", "Survey_client__first_name", "created_ts",
                     "total_sent", "complete_status"]

    def get_initial_queryset(self, **kwargs):
        try:
            client_id = int(self.kwargs['id'])
        except:
            client_id = 0
        if self.request.user.is_admin or self.request.user.is_superuser:
            if client_id > 0:
                surveys = Survey.objects.filter(Survey_client=client_id).order_by('-id')
            else:
                surveys = Survey.objects.all().order_by('-id')
        else:
            if self.request.user.user_type == Users['Coach']:
                surveys = Survey.objects.filter(Survey_client__coach=self.request.user.coaches.id).order_by('-id')
                if client_id > 0:
                    surveys = surveys.filter(Survey_client=client_id)
            else:
                surveys = Survey.objects.filter(Survey_client=self.request.user.clients.id).order_by('-id')
        try:
            survey_status = self.kwargs['status']
        except:
            survey_status = 'total'

        if survey_status != 'total':
            if survey_status == 'AT':
                surveys = surveys.filter(Q(status='AT') | Q(status='RO')).order_by('-id')
            else:
                surveys = surveys.filter(status=survey_status).order_by('-id')
        surveys = surveys.annotate(complete_status=Case(
                        When(status=Status['Active'], then=Value('Active')),
                        When(status=Status['Completed'], then=Value('Closed')),
                        When(status=Status['Draft'], then=Value('Draft')),
                        When(status=Status['Reopen'], then=Value('Active'))
                        ))

        return surveys

    def filter_queryset(self, qs):
        search = self.request.GET.get('search[value]', None)
        if search:
            if self.request.user.user_type == Users['Admin']:
                qs = qs.filter(Q(title__icontains=search) | Q(complete_status__icontains=search)| Q(total_sent__icontains=search) |
                    Q(Survey_client__first_name__icontains = search)| Q(Survey_client__last_name__icontains = search)| Q(created_ts__icontains=search)\
                    | Q(Survey_client__coach__first_name__icontains=search) | Q(Survey_client__coach__last_name__icontains=search)\
                         )
            elif self.request.user.user_type == Users['Coach']:
                qs = qs.filter(Q(title__icontains=search) | Q(complete_status__icontains=search)| Q(total_sent__icontains=search) | Q(created_ts__icontains=search)\
                    | Q(Survey_client__first_name__icontains = search)| Q(Survey_client__last_name__icontains = search)\
                        )
            else:    
                qs = qs.filter(Q(title__icontains=search) | Q(complete_status__icontains=search)| Q(total_sent__icontains=search) | Q(created_ts__icontains=search)\
                        )
        return qs

    def prepare_results(self, qs):
        json_data = []
        for item in qs:
                json_data.append({
                "id": item.id,
                "title": item.title,
                "survey_coach": item.Survey_client.coach.first_name + " " + item.Survey_client.coach.last_name,
                "survey_client": item.Survey_client.first_name + " " + item.Survey_client.last_name,
                "created_date": item.created_ts.date(),
                "total_sent": SurveyCampaign.objects.filter(survey=item.id).count(),
                "status": item.status,
                "complete_status": item.complete_status
            })

        return json_data


class SurveyDetailView(LoginRequiredMixin, View):
    template_name = "new_theme/survey-detail.html"

    def get(self, request, id, *args,**kwargs):
        survey = Survey.objects.get(id=id)
        report = FeedBackReport.objects.filter(user='Client', survey=survey).order_by('-id')
        total_sent = SurveyCampaign.objects.filter(survey=survey)
        response_count = total_sent.filter(response='COMPLETE')
        try:
            progress =(response_count.count()/total_sent.count())* 100
        except:
            progress = 0
        questionobj = []
        questions = SurveyQuestion.objects.filter(survey_id=id).order_by("created_ts")
        anslist = []
        for q in questions:
            finalanslist = []
            for a in Answer.objects.filter(question=q, survey=survey).order_by('participant'):
                try:
                    finalanslist.append(EditedAnswer.objects.get(prevanswer=a))
                except:
                    finalanslist.append('null')
            try:
                questionobj.append(EditedSurveyQuestion.objects.get(question=q))
            except:
                questionobj.append('null')
            finalanswers = list(zip(Answer.objects.filter(question=q, survey=survey).order_by('participant'), finalanslist))
            anslist.append(finalanswers)

        quesanslist = list(zip(questions,questionobj, anslist))
        context = {}
        participant_count = SurveyCampaign.objects.filter(survey=survey).count()
        context.update({'survey':survey, 'report': report, 'quesanslist': quesanslist,
                        'progress':round(progress), 'participant_count': participant_count})
        return render(request, self.template_name,context)


class CompletedSurveyView(LoginRequiredMixin, View):
    template_name = "new_theme/completed-survey.html"

    def get(self,request,*args,**kwargs):
            return render(request, self.template_name)


class DraftSurveyView(LoginRequiredMixin, View):
    template_name = "new_theme/draft-survey.html"

    def get(self, request):
            return render(request, self.template_name)

        
class ActiveSurveyView(LoginRequiredMixin, View):
    template_name = "new_theme/active-survey.html"

    def get(self, request):
            return render(request, self.template_name)


class SurveyDetailDatatableView(BaseDatatableView):

    order_columns = ["id","question"]

    def get_initial_queryset(self):
        search = self.request.GET.get('search[value]', None)

        if search:
            questions = SurveyQuestion.objects.filter(survey__id=self.kwargs['id'], question__icontains=search)\
                .values('question', 'id', 'is_confidential').order_by('id')            
        else:
            questions = SurveyQuestion.objects.filter(survey__id=self.kwargs['id'])\
                .values('question', 'id', 'is_confidential').order_by('id')           
        return questions#.union(confidentialquestions)

    def filter_queryset(self, qs):
        return qs

    def prepare_results(self, qs):
        json_data = []
        for item in qs:
            # if item["is_confidential"]:
            #     ans = ConfidentialAnswer.objects.filter(question__id=item["id"]).values('answer', 'id',
            #           'participant__first_name', 'participant__last_name', 'participant__id')
            # else:
            ans = Answer.objects.filter(question__id=item["id"]).values('answer', 'id',
                        'participant__first_name', 'participant__last_name', 'participant__id')
            json_data.append({
                "question_id": item["id"],
                "question": item["question"],
                "answer": list(ans),
                # "is_confidential": item["is_confidential"],
            })
        return json_data


class SurveyCRUDView(LoginRequiredMixin, View):
    template_name = "new_theme/add-new-survey.html"

    def get(self, request, *args, **kwargs):
        context = {}
        try:
            id = self.kwargs['id']
            if id:
                survey = Survey.objects.filter(id=id).values('id','title','Survey_client','Survey_client__coach','description')
                instructions = Survey.objects.get(id=id).instructions
                survey_ques = SurveyQuestion.objects.filter(survey=id).values('id','question','is_confidential')
                client = Clients.objects.filter(coach=survey[0]['Survey_client__coach'],is_deleted = False)
                context.update({'clients': client})
                context.update({ 'instructions':instructions})
                context.update({'survey': json.dumps(list(survey)),'survey_ques':json.dumps(list(survey_ques)) })
        except:
            if request.user.is_admin or request.user.is_superuser:
                coaches = Coaches.objects.filter(is_deleted = False)
                context.update({'coaches': coaches})
            elif request.user.user_type == Users['Coach']:
                coaches = Coaches.objects.get(user=request.user,is_deleted = False)
                client = Clients.objects.filter(coach=coaches,is_deleted = False)
                context.update({'clients': client})
            else:
                pass
        return render(request, self.template_name, context)

    def post(self, request, *args, **kwargs):
        formData = json.loads(request.body.decode())
        context = {}
        survey_name = formData['survey_name']
        client_id = formData['client_id']
        questions = formData['questionslist']
        description = formData['description']
        instructions = formData['instructions']
        survey_exist = Survey.objects.filter(Survey_client = client_id,title = survey_name).exists()
        if survey_exist:
            context.update({'status': False, 'error': 'Survey name already exists for this client.'})
        else:
            try:
                with transaction.atomic():
                    survey = Survey.objects.create(
                            title=survey_name,
                            Survey_client=Clients.objects.get(id=client_id),
                            status = Status['Draft'],
                            creator = User.objects.get(id=request.user.id),
                            instructions = instructions,
                            description = description )
                    for question in questions:
                        SurveyQuestion.objects.create(survey=survey, question=question['question'], is_confidential=question['is_confidential'])
                    context.update({'status':True, 'success':'Survey created successfully'})
            except:
                context.update({'status':False, 'error': 'Survey not created'})
        return JsonResponse(context)

    def put(self, request, *args, **kwargs):
        formData = json.loads(request.body.decode())
        context = {}
        survey_id = formData['survey_id']
        survey_name = formData['survey_name']
        client_id = formData['client_id']
        questions = formData['questionslist']
        description = formData['description']
        instructions = formData['instructions']
        deletedques = formData['deletedqueslist']
        survey_exist = Survey.objects.filter(Survey_client=client_id,title = survey_name).exclude(id=survey_id).exists()
        if survey_exist:
            context.update({'status':False, 'error':'Survey name already exists for this client.'})
        else:
            try:
                with transaction.atomic():
                    survey = Survey.objects.get(id=survey_id)
                    survey.title=survey_name
                    survey.Survey_client=Clients.objects.get(id=client_id)
                    survey.instructions = instructions
                    survey.description = description 
                    survey.save()
                    for question in questions:
                        try:
                            sur = SurveyQuestion.objects.get(id=question['question_id'])
                            sur.question = question['question']
                            sur.save()
                        except:
                            SurveyQuestion.objects.create(survey=survey, question=question['question'], is_confidential=question['is_confidential'])
                    for ques_id in deletedques:
                        if ques_id != None:
                            SurveyQuestion.objects.get(id=ques_id).delete()
                    context.update({'status':True, 'success':'Survey updated successfully'})
            except:
                context.update({'status':False, 'error': 'Survey not updated'})
        return JsonResponse(context)


    def delete(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            if request.user.user_type != Users['Client']:
                survey_id = request.body.decode("utf-8")
                with transaction.atomic():
                    survey_ques =  SurveyQuestion.objects.filter(survey=survey_id)
                    survey = Survey.objects.get(id=survey_id)
                    survey_ques.delete()
                    survey.delete()
                    return JsonResponse({"success":"success"})
        return redirect("dashboard")

filepath = os.getcwd()+'\log\logfile.log'
logging.basicConfig(filename=filepath, level=logging.DEBUG)
logger = logging.getLogger()

class SendSurvey(LoginRequiredMixin, View):
    """Send survey to the participants"""

    template_name = "new_theme/surveys.html"

    def get(self, request):
        participant_id = request.GET.getlist('participant_ids[]')
        survey_id = request.GET['survey_id']
        survey = Survey.objects.get(id=survey_id)
        client = survey.Survey_client
        sendername = client.coach.first_name + client.coach.last_name
        participant_list = Participant.objects.filter(id__in=participant_id)
        success_send = []
        fail_send = []
        try:
            with transaction.atomic():
                for participant in participant_list:
                    logger.info("step 1")
                    try:
                        survey_campaign = SurveyCampaign.objects.get(participant=participant, survey=survey)
                    except:
                        survey_campaign = SurveyCampaign.objects.create(participant=participant, survey=survey)
                    # survey_link = request.build_absolute_uri()+'/new_theme/survey_response/' + str(survey_campaign.uid)
                    survey_link ='/new_theme/survey_response/' + str(survey_campaign.uid)
                    logger.info(survey_link)
                    sg = sendgrid.SendGridAPIClient(api_key=authkey)
                    message = Mail(
                        from_email=Email(sendername + '@leadershiprealitycheck.com'),
                        to_emails=participant.email,
                        subject='Feedback Survey',
                        html_content=Content("text/html",
                                             render_to_string("new_theme/survey_email_template.html",
                                                              {'survey_link': survey_link})))
                    message.reply_to = 'team@creativebuffer.com'
                    logger.info('step 3')
                    response = sg.send(message)
                    success_send.append(participant.email)
                    survey.status = Status['Active']
                    survey.save()
        except Exception as e:
            fail_send
        return JsonResponse({'success': True, 'message': 'Mail sent to '+str(len(success_send))+' participants'})
        # return requests.post(
        #     "https://api.mailgun.net/v3/mail.creativebuffer.com/messages",
        #     auth=("api", "c085abaf56a9de96934278021e6c93fe-b2f5ed24-2b4b5274"),
        #     data={"from": "Excited User <team@creativebuffer.com>",
        #           "to": ["shivani@creativebuffer.com"],
        #           "subject": "Hello",
        #           "text": "Testing some Mailgun awesomness!"})


class CollectSurveyResponse(TemplateView):
    """Show questions to participants and also if answers are already filled."""

    template_name = "new_theme/collect_survey_response.html"

    def get(self, request, u_id):
        try:
            sur_comp = SurveyCampaign.objects.get(uid=u_id)            
            context = {'uid': sur_comp.uid}
            try:
                ques = SurveyQuestion.objects.filter(survey=sur_comp.survey).order_by("id")
                context.update({"ques": ques})
            except:
                pass
            try:
                answers = Answer.objects.filter(participant=sur_comp.participant, survey=sur_comp.survey)
                context.update({"ans": answers})
            except:
                pass
            if sur_comp.status == True:
                context.update({'already_submited': True})
            else:
                context.update({'already_submited': False})
            context.update({'survey_instruction':sur_comp.survey.instructions})
            return render(request, self.template_name, context=context)
        except:
            return redirect('dashboard')


class AddResponses(TemplateView):
    """Add participants responses."""

    template = "pdf-generate.html"

    def post(self, request, *args, **kwargs):
        sur_comp = SurveyCampaign.objects.get(uid=request.POST['u_id'])
        sur = sur_comp.survey
        que = SurveyQuestion.objects.filter(survey=sur).order_by("id")
        for q in que:
            ans = request.POST[str(q.id)]
            try:
                answ = Answer.objects.get(question=q, participant=sur_comp.participant, survey=sur)
                answ.answer = ans
                answ.save()
            except:
                Answer.objects.create(question=q, answer=ans, participant=sur_comp.participant, survey=sur, display=True)
        if request.POST['submit'] == 'true':
            sur_comp.response = SurveyCampaignStatus['Complete']
            sur_comp.status = True
        else:
            sur_comp.response = SurveyCampaignStatus['PartiallyComplete']
        sur_comp.save()

        all_surveycampaign = SurveyCampaign.objects.filter(survey=sur)
        if all_surveycampaign.count() == all_surveycampaign.filter(status=True).count():
            sur.status = Status['Completed']
            sur.save()

        return JsonResponse({"Psuccess": "Thank you for participating. Your response has been received."})


