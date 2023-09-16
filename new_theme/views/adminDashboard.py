from django.views import View
from core.models import Coaches, Clients, Participant, UserPlan
from survey.models import Survey, FeedBackReport
import datetime
from django.db.models import Q, Count
from django.http import JsonResponse
from django.db.models.functions import TruncMonth, TruncYear
from ..constant import *
from django.shortcuts import render, redirect
from django.contrib.auth.mixins import LoginRequiredMixin


def monthlyPlans(plan_type):
    present_year = datetime.datetime.now().year
    userplan = UserPlan.objects.filter(plan__title=plan_type, created_ts__year=present_year).annotate(
    month=TruncMonth('created_ts')).values('month').annotate(_total_users=Count('id')).order_by('month')
    total_users = {
        m['month'].month: m['_total_users'] for m in userplan
    }
    dataset = []
    months = {1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 6: 'Jun', 7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Oct', 11:
        'Nov', 12: 'Dec'}
    for index,month in months.items():
        dataset.append({
            "month": month,
            "total_users": total_users.get(index, 0)
        })
    return dataset


def yearlyPlans(plan_type):
    userplan = UserPlan.objects.filter(plan__title = plan_type).annotate(
    year=TruncYear('created_ts')).values('year').annotate(
    _total_users=Count('id')).order_by('year')
    total_users = {
        y['year'].year: y['_total_users'] for y in userplan
    }
    dataset = []
    year_names = []
    present_year = datetime.datetime.now().year
    for i in range(present_year-5,present_year+1):
        year_names.append(i)
    for year in year_names:
        dataset.append({
                "year": year,
            "total_users": total_users.get(year, 0)
        })
    return dataset


def get_clients(user, id, limit):
    if user == UserType['Admin']:
        all_clients = Clients.objects.filter(is_deleted=False)
    if user == UserType['Coach']:
        all_clients = Clients.objects.filter(coach__id=id,is_deleted=False)
    clients = all_clients.order_by('-id')[:limit]
    return clients, all_clients.count()


def get_participants(user, id, limit):
    if user == UserType['Admin']:
        all_participants = Participant.objects.filter(is_deleted=False)
    if user == UserType['Coach']:
        all_participants = Participant.objects.filter(client__coach__id=id,is_deleted=False)
    if user == UserType['Client']:
        all_participants = Participant.objects.filter(client=id,is_deleted=False)
    participants = all_participants.order_by('-id')[:limit]
    return participants, all_participants.count()


def get_surveys(user, id):
    if user == UserType['Admin']:
        all_surveys = Survey.objects.all()
    if user == UserType['Coach']:
        all_surveys = Survey.objects.filter(Survey_client__coach__id=id)
    if user == UserType['Client']:
        all_surveys = Survey.objects.filter(Survey_client__id=id)
    surveys = all_surveys.order_by('-id')
    active_survey = surveys.filter(Q(status='AT') | Q(status='RO')).order_by('-id')
    pending_survey = surveys.filter(status="US").order_by('-id')
    completed_survey = surveys.filter(status="CT").order_by('-id')
    if surveys.count() == 0:
        completed_per = 0
        pending_per = 0
    else:
        completed_per = (completed_survey.count() / surveys.count()) * 100
        pending_per = (pending_survey.count() / surveys.count()) * 100
    return {'survey': surveys, 'survey_count': all_surveys.count(), 'completed_survey': round(completed_per),'completed'
    : completed_survey, 'active_survey': active_survey, 'pending': pending_survey, 'pending_per': round(pending_per)}


class Admin_dashboardView(LoginRequiredMixin, View):
    template_name = "new_theme/index.html"

    def get(self, request):
        context = {}
        if request.user.is_admin or request.user.is_superuser:
            coaches = Coaches.objects.filter(is_deleted=False)
            clients = get_clients(UserType['Admin'], 'allCoach', 10)
            participants = get_participants(UserType['Admin'], 'allCoach', 10)
            survey = get_surveys(UserType['Admin'], request.user.id)
            coach_report = FeedBackReport.objects.filter(user='Client').order_by('-id')
            context.update({'coaches': coaches.order_by('-id')[:10], 'clients': clients[0],
                            'coachescount': coaches.count(), 'clientscount': clients[1]})
        elif request.user.user_type == Users['Coach']:
            clients = get_clients(UserType['Coach'], request.user.coaches.id, 10)
            participants = get_participants(UserType['Coach'], request.user.coaches.id, 10)
            survey = get_surveys(UserType['Coach'], request.user.coaches.id)          
            coach_report = FeedBackReport.objects.filter(user='Client', survey__Survey_client__coach=request.user.coaches).order_by('-id')
            context.update(
                {'clients': clients[0], 'clientscount': clients[1]})
        elif request.user.user_type == Users['Client']:
            participants = get_participants(UserType['Client'], request.user.clients.id, 10)
            survey = get_surveys(UserType['Client'], request.user.clients.id)
            coach_report = FeedBackReport.objects.filter(user='Client',
                                                         survey__Survey_client=request.user.clients).order_by('-id')
        context.update(survey)
        context.update(
            {'participants': participants[0], 'participantscount': participants[1], 'coach_report': coach_report})

        return render(request, self.template_name, context)


class GetIndividualCharts(LoginRequiredMixin, View):
    template_name = 'new_theme/index.html'

    def get(self, request):
        return redirect('dashboard')

    def post(self, request, *args, **kwargs):
        if request.user.is_admin or request.user.is_superuser:
            context = {}
            plantype = request.POST['plantype']

            if plantype == 'Yearly':
                YearlyPlan = yearlyPlans(PlanType['Individual'])
                context.update({'YearlyPlan': YearlyPlan})
            else:
                MonthlyPlan = monthlyPlans(PlanType['Individual'])
                context.update({'MonthlyPlan': MonthlyPlan})
            return JsonResponse(context)
        return redirect('dashboard')

class GetEnterpriseCharts(LoginRequiredMixin, View):
    template_name = 'new_theme/index.html'

    def get(self, request):
        return redirect('dashboard')

    def post(self, request, *args, **kwargs):
        if request.user.is_admin or request.user.is_superuser:
            context = {}
            plantype = request.POST['plantype']
            if plantype == 'Yearly':
                YearlyPlan = yearlyPlans(PlanType['Enterprise'])
                context.update({'YearlyPlan': YearlyPlan})
            else:
                MonthlyPlan = monthlyPlans(PlanType['Enterprise'])
                context.update({'MonthlyPlan': MonthlyPlan})
            return JsonResponse(context)
        return redirect('dashboard')

