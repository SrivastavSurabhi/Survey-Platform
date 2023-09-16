from django.shortcuts import render, redirect
from django.views.generic import TemplateView
from core.models import *
from survey.models import *
from django_datatables_view.base_datatable_view import BaseDatatableView


class Admin_dashboard(TemplateView):
    template_name = "admin_dashboard/index.html"
    def get(self, request):
        return render(request, self.template_name)


class CoachSurveyListjsonview(BaseDatatableView):

    def get_initial_queryset(self):
        return Survey.objects.filter(creator=Coaches.objects.get(id=self.kwargs['id']).user)


class ClientSurveyListjsonview(BaseDatatableView):

    def get_initial_queryset(self):
        return Survey.objects.filter(Survey_client=Clients.objects.get(id=self.kwargs['id'])).order_by('-id')

class SurveyListjsonview(BaseDatatableView):

    order_columns = ["-id","question"]

    def get_initial_queryset(self):
        # questions = SurveyQuestion.objects.filter(survey__id=self.kwargs['id']).extra(select={'is_confidential': False})\
        #     .values('question', 'id', 'is_confidential')
        # confidentialquestions = ConfidentialQuestions.objects.filter(survey__id=self.kwargs['id']).extra(select={'is_confidential': True})\
        #     .values('question', 'id', 'is_confidential')
        # questions = SurveyQuestionsView.objects.filter(survey__id=self.kwargs['id'])
        # return questions.union(confidentialquestions)
        search = self.request.GET['sSearch'] or None
        if search:
            questions = SurveyQuestion.objects.filter(survey__id=self.kwargs['id'],question__icontains=search)\
                .extra(select={'is_confidential': False}).values('question', 'id', 'is_confidential')
            confidentialquestions = ConfidentialQuestions.objects.filter(survey__id=self.kwargs['id'], question__icontains=search)\
                .extra(select={'is_confidential': True}).values('question', 'id', 'is_confidential')
        else:
            questions = SurveyQuestion.objects.filter(survey__id=self.kwargs['id'])\
                .extra(select={'is_confidential': False}).values('question', 'id', 'is_confidential')
            confidentialquestions = ConfidentialQuestions.objects.filter(survey__id=self.kwargs['id'])\
                .extra(select={'is_confidential': True}).values('question', 'id', 'is_confidential')
        return questions.union(confidentialquestions)

    # def filter_queryset(self, qs):
    #     search = self.request.GET['sSearch'] or None
    #     if search:
    #         qs = qs.filter(question__icontains=search)
    #     return qs

    def prepare_results(self, qs):
        json_data = []
        for item in qs:
            if item["is_confidential"]:
                ans = ConfidentialAnswer.objects.filter(question__id=item["id"]).values('answer', 'id',
                      'participant__first_name', 'participant__last_name', 'participant__id')
            else:
                ans = Answer.objects.filter(question__id=item["id"]).values('answer', 'id', 'participant__first_name'
                    , 'participant__last_name', 'participant__id')
            json_data.append({
                "question_id": item["id"],
                "question": item["question"],
                "answer": list(ans),
                "is_confidential": item["is_confidential"],
            })
        return json_data


class CoachpParticipantListjsonview(BaseDatatableView):

    def get_initial_queryset(self):
        return Participant.objects.filter(client__coach=Coaches.objects.get(id=self.kwargs['id']))


class CoachClientListjsonview(BaseDatatableView):

    def get_initial_queryset(self):
        return Clients.objects.filter(coach=Coaches.objects.get(id=self.kwargs['id']))


class CoachDetail(TemplateView):
    template_name = "admin_dashboard/coach-detail.html"

    def get(self, request, id):
        if request.user.is_authenticated:
            if request.user.is_admin or request.user.is_superuser:
                coach = Coaches.objects.get(id=id)
                client = Clients.objects.filter(coach=coach).order_by('-id')[:5]
                context = {'coach': coach, 'relation': Relationship.objects.all(), 'client': client}
                return render(request, self.template_name, context)
        return redirect("dashboard")


class CoachClients(TemplateView):
    template_name = "admin_dashboard/coach_all_clients.html"

    def get(self, request, id):
        if request.user.is_authenticated:
            if request.user.is_admin or request.user.is_superuser:
                coach = Coaches.objects.get(id=id)
                context = {'coach': coach}
                return render(request, self.template_name, context)
        return redirect("dashboard")


class ClientSurveys(TemplateView):
    template_name = "admin_dashboard/client_all_survey.html"

    def get(self, request, id):
        if request.user.is_authenticated:
            if request.user.is_admin or request.user.is_superuser:
                client = Clients.objects.get(id=id)
                context = {'client': client}
                return render(request, self.template_name, context)
        return redirect("dashboard")


class ClientDetail(TemplateView):
    template_name = "admin_dashboard/client-detail.html"

    def get(self, request, id):
        if request.user.is_authenticated:
            if request.user.is_admin or request.user.is_superuser:
                client = Clients.objects.get(id=id)
                survey = Survey.objects.filter(Survey_client=client).order_by('-id')[:5]
                context = {'client': client, 'survey': survey}
                return render(request, self.template_name, context)
        return redirect("dashboard")


class SurveyDetail(TemplateView):
    template_name = "admin_dashboard/survey-detail.html"

    def get(self, request, id):
        if request.user.is_authenticated:
            if request.user.is_admin or request.user.is_superuser:
                survey = Survey.objects.get(id=id)
                # question = survey.questions.all()
                # confidentialquestion = survey.confidentialquestions_set.all()
                # surveyQuestions = list(question) + list(confidentialquestion)
                # answer = Answer.objects.filter(question__in=question)
                # confidentialanswer = ConfidentialAnswer.objects.filter(question__in=confidentialquestion)
                # surveyAnswers = list(answer) + list(confidentialanswer)
                # context = {'surveyQuestions': surveyQuestions, 'surveyAnswers': surveyAnswers}
                context = {'survey':survey}
                return render(request, self.template_name, context)
        return redirect("dashboard")


class ClientsAPI(TemplateView):
    template_name = "admin_dashboard/clients.html"
    def get(self, request):
        return render(request, self.template_name)


class Participants(TemplateView):
    template_name = "admin_dashboard/participants.html"
    def get(self, request):
        return render(request, self.template_name)

class  Surveys(TemplateView):
    template_name = "admin_dashboard/surveys.html"
    def get(self, request):
        return render(request, self.template_name)

        
class  Revenue(TemplateView):
    template_name = "admin_dashboard/revenue.html"
    def get(self, request):
        return render(request, self.template_name)

        
class  Reports(TemplateView):
    template_name = "admin_dashboard/reports.html"
    def get(self, request):
        return render(request, self.template_name)

        