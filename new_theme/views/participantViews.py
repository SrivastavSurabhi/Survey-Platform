from django.contrib.auth.mixins import LoginRequiredMixin
from django.views import View
from django.shortcuts import render, redirect
from django.views.generic import TemplateView
from core.models import *
from survey.models import *
import datetime
from django_datatables_view.base_datatable_view import BaseDatatableView
from django.db.models import Q
from django.db.models import F,Value, Case, When
from django.http import JsonResponse
import json
from ..constant import *

class ParticipantsView(LoginRequiredMixin, View):
    template_name = "new_theme/participants.html"

    def get(self, request):
        context ={'user_type':request.user.user_type}
        return render(request, self.template_name,context)


class ParticipantDataTableView(BaseDatatableView):
    order_columns = ["id", "first_name", "email", "relationship__relation", "client__first_name", "client__coach__first_name"]


    def get_initial_queryset(self):
        try:
            participants = Participant.objects.filter(client__id=self.kwargs['clientid'],is_deleted=False).order_by('-id')
        except:
            if self.request.user.is_admin or self.request.user.is_superuser:
                participants = Participant.objects.filter(is_deleted=False).order_by('-id')
            elif self.request.user.user_type == Users['Coach']:
                participants = Participant.objects.filter(client__coach__id=self.request.user.coaches.id,is_deleted=False).order_by('-id')
            else:
                participants = Participant.objects.filter(client__id=self.request.user.clients.id,is_deleted=False).order_by('-id')
        return participants

    def filter_queryset(self, qs):
        search = self.request.GET.get('search[value]', None)
        if search:
            if self.request.user.user_type == Users['Admin']:
                qs = qs.filter(Q(first_name__icontains=search) | Q(last_name__icontains=search)| Q(email__icontains=search)
                           | Q(relationship__relation__icontains=search)| Q(client__first_name__icontains=search)|
                           Q(client__last_name__icontains = search) | Q(client__coach__first_name__icontains=search) |
                           Q(client__coach__last_name__icontains=search))
            elif self.request.user.user_type == Users['Coach']:
                qs = qs.filter(Q(first_name__icontains=search) | Q(last_name__icontains=search)| Q(email__icontains=search)
                           | Q(relationship__relation__icontains=search)| Q(client__first_name__icontains=search)|
                           Q(client__last_name__icontains = search) )
            else:
                qs = qs.filter(Q(first_name__icontains=search) | Q(last_name__icontains=search)| Q(email__icontains=search)
                                | Q(relationship__relation__icontains=search)
                                ) 
        return qs

    def prepare_results(self, qs):
        json_data = []
        try:
            surveycam = SurveyCampaign.objects.filter(survey= self.kwargs['surveyid'])
        except:
            surveycam = SurveyCampaign.objects.all()
        for item in qs:
            json_data.append({
                "id": item.id,
                "complete_name": item.first_name + " " + item.last_name,
                "email": item.email,
                "relation": item.relationship.relation,
                "client_name": item.client.first_name + " " + item.client.last_name,
                "coach_name": item.client.coach.first_name + " " + item.client.coach.last_name,
                "status": 'Sent' if surveycam.filter(participant = item.id) else 'Not sent'
            })

        return json_data


class ParticipantDetailView(LoginRequiredMixin, View):
    template_name = "new_theme/participant-detail.html"
    
    def get(self, request, id, *args,**kwargs):
        participant = Participant.objects.get(id = id,is_deleted=False)
        campaaign = SurveyCampaign.objects.filter().last()
        survey = SurveyCampaign.objects.filter(participant__id = id)
        context = {}
        context.update({'participant':participant})
        context.update({'survey':survey})
        return render(request, self.template_name,context)


class ParticipantDetailDatatableView(BaseDatatableView):
    order_columns = ["id","survey__title","created_ts","complete_response"]

    def get_initial_queryset(self,**kwargs ):
               
        try:
            participant_id = int(self.kwargs['id'])
        except:
            participant_id = 0 

        if participant_id > 0:
            surveys = SurveyCampaign.objects.filter(participant=participant_id).annotate(complete_response=Case(
                        When(response='NORESPONSE', then=Value('No Response')),
                        When(response='Complete', then=Value('Complete')),
                        When(response='PARTIALRESPONSE', then=Value('Partial Response'))
                        )).order_by('-id')
        else:
            pass

        return surveys

    def filter_queryset(self, qs):
        search = self.request.GET.get('search[value]', None)
        if search:
            qs = qs.filter(Q(survey__title__icontains=search) | Q(complete_response__icontains=search) | Q(created_ts__icontains=search))
        return qs

    def prepare_results(self, qs):
        json_data = []
        for item in qs:
                json_data.append({
                "id": item.survey.id,
                "title": item.survey.title,
                "created_date": item.created_ts.date(),
                "response": item.response,
                "complete_response": item.complete_response,
                "status": item.survey.status
            })

        return json_data


class ParticipantCRUDView(LoginRequiredMixin, View):
    template_name = "new_theme/add-new-participant.html"

    def get(self, request, *args, **kwargs):
        context = {}
        if request.user.is_admin or request.user.is_superuser:
            coaches = Coaches.objects.filter(is_deleted=False)
            # client = Clients.objects.all()
            context.update({'coaches': coaches})
        if request.user.user_type == Users['Coach']:
            coaches = Coaches.objects.get(user=request.user,is_deleted=False)
            client = Clients.objects.filter(coach=coaches,is_deleted=False)
            context.update({'clients': client})
        try:
            id = self.kwargs['id']
            if id:
                participant = Participant.objects.filter(id=id,is_deleted=False).values('relationship', 'client', 'email', 'first_name',
                                                                       'last_name', 'client__coach', 'id')
                client = Clients.objects.all()
                context.update({'participant': list(participant),'participant_data' : json.dumps(list(participant)),'clients': client})
        except:
            pass

        return render(request, self.template_name, context)

    def post(self, request, *args, **kwargs):
        context = {}
        error = {}
        formData = json.loads(request.body.decode())
        email = formData['email']
        first_name = formData['first_name']
        last_name = formData['last_name']
        relation = Relationship.objects.get(id=formData['relation'])
        participant_created = 0
        participant_not_created = 0
        if type(formData['client']) == str:
            client = Clients.objects.get(id=formData['client'])
            if email and first_name and last_name and relation and client:
                if Participant.objects.filter(client=client, email=email,is_deleted=False):
                    participant_not_created += 1
                else:
                    Participant.objects.create(client=client, email=email, first_name=first_name, last_name=last_name,
                                               relationship=relation)
                    participant_created += 1

        else:
            for i in formData['client']:
                client = Clients.objects.get(id=i,is_deleted=False)
                if email and first_name and last_name and relation and client:
                    if Participant.objects.filter(client=client, email=email,is_deleted=False):
                        participant_not_created += 1
                    else:
                        Participant.objects.create(client=client, email=email, first_name=first_name, last_name=last_name, relationship=relation)
                        participant_created += 1

        # context.update({'success': "Participant created successfully.", 'created': participant_created, 'not_created':participant_not_created})
        if participant_created > 0:
            context.update({'success': True, "message": "Participant created successfully.", 'created': participant_created,
                            'not_created': participant_not_created})
        else:
            error.update({"email": "Participant with same email already exist."})
            context.update({'success': False, 'message':error, 'created': participant_created,
                            'not_created': participant_not_created})
        return JsonResponse(context)

    def delete(self, request, *args, **kwargs):
        id = request.body.decode("utf-8")
        participant = Participant.objects.get(id=id,is_deleted=False)
        participant.is_deleted = True
        participant.save()
        return JsonResponse({"success": "success"})

    def put(self, request, *args, **kwargs):
        error = {}
        formData = json.loads(request.body.decode())
        participant_id = formData['participant_id']
        # email = formData['email']
        first_name = formData['first_name']
        last_name = formData['last_name']
        relation = Relationship.objects.get(id=formData['relation'])
        participant = Participant.objects.get(id=participant_id,is_deleted=False)
        # participant.email = email
        # if Participant.objects.filter(client=participant.client, email=email,is_deleted=False).exclude(id=participant.id).exists():
        #     error.update({"email": "Participant with same email already exist."})
        #     context = {'success': False, 'message':error}
        #     return JsonResponse(context)
        participant.first_name = first_name
        participant.last_name = last_name
        participant.relationship = relation
        participant.save()
        context = {'success': True, 'message': 'Participant updated'}
        return JsonResponse(context)


class GetRelations(LoginRequiredMixin, View):
    template_name = "new_theme/participant-detail.html"

    def get(self, request):
        relations = Relationship.objects.all().values()
        return JsonResponse({'relations': list(relations), 'success': 'success'})


