from django.contrib.auth.mixins import LoginRequiredMixin
from django.views import View
from django.shortcuts import render, redirect
from django.views.generic import TemplateView
from core.models import *
from survey.models import Survey
from django_datatables_view.base_datatable_view import BaseDatatableView
from django.db.models import Q
from django.http import JsonResponse
import json
from django.db import transaction
from ..constant import *

class ClientView(LoginRequiredMixin, View):
    template_name = "new_theme/clients.html"

    def get(self, request, *args, **kwargs):
        if request.user.is_admin or request.user.is_superuser or self.request.user.coach_exist:
            return render(request, self.template_name)
        return redirect('dashboard')


class ClientDataTableView(BaseDatatableView):
    order_columns = ["id", "profile_img","first_name", "email", "company_name", "coach__first_name"]

    def get_initial_queryset(self, **kwargs):
        if self.request.user.is_admin or self.request.user.is_superuser:
            try:
                coach_id = self.kwargs['id']
            except:
                coach_id = 0
        else:
            coach_id = self.request.user.coaches.id
        if coach_id > 0: 
            clients = Clients.objects.filter(coach=coach_id,is_deleted=False).order_by('-id')
        else:
            clients = Clients.objects.filter(is_deleted=False).order_by('-id')
        return clients

    def filter_queryset(self, qs):
        search = self.request.GET.get('search[value]', None)
        name = self.request.GET.get('search[name]')
        email = self.request.GET.get('search[email]')
        organization = self.request.GET.get('search[organization]')
        coach = self.request.GET.get('search[coach]')
        if search:
            if self.request.user.user_type == Users['Admin']:
                qs = qs.filter(Q(first_name__icontains=search) | Q(last_name__icontains=search) | Q(email__icontains
                        =search)| Q(company_name__icontains = search)|Q(coach__first_name__icontains=search) | Q(coach__last_name__icontains=search))
            else:
                qs =  qs.filter(Q(first_name__icontains=search) | Q(last_name__icontains=search) | Q(email__icontains
                        =search)| Q(company_name__icontains = search))
        if name or email:
            qs = qs.filter(first_name__icontains=name, email__icontains =email)
        if coach:
            qs = qs.filter(coach=coach)
        if organization:
            qs = qs.filter(company_name__icontains=organization)
        return qs

    def prepare_results(self, qs):
        json_data = []
        for item in qs:
            json_data.append({
                "id": item.id,
                "profile_img": str(item.profile_img),
                "complete_name": item.first_name + " " + item.last_name,
                "email": item.email,
                "company_name": item.company_name if item.company_name else '-',
                "coach_complete_name": item.coach.first_name + " " + item.coach.last_name
            })

        return json_data


class ClientCRUDView(LoginRequiredMixin, View):
    template_name = "new_theme/add-new-client.html"

    def get(self, request, *args, **kwargs):
        context = {}
        if request.user.is_admin or request.user.is_superuser:
            coaches = Coaches.objects.filter(is_deleted=False)
            context.update({'coaches': coaches})
        try:
            id = self.kwargs['id']
            if id:
                data = list(Clients.objects.filter(id=id,is_deleted=False).values('id', 'first_name', 'last_name',\
                'email','phone', 'company_name', 'company_url', 'title', 'address', 'zip', 'country', 'state', \
                'city', 'coach_id', 'user__username'))
                context.update({'data': json.dumps(data)})
        except:
            pass
        return render(request, self.template_name, context)

    def post(self, request, *args, **kwargs):
        context = {}
        formData = json.loads(request.body.decode())
        email = formData['email']
        username = formData['username']
        password = formData['password']
        cnfm_password = formData['cnfmpassword']
        error = {}

        if password and cnfm_password and password != cnfm_password:
            error.update({'cnfmpassword': "Password and Confirm password do not match."})
        if len(password) < 8:
            error.update({'password': "Password should have at least seven characters. "})
        if email and username and password and cnfm_password:
            client_check = User.objects.filter(email=email).exists()
            uname = User.objects.filter(username=username).exists()
            if client_check:
                error.update({'email': "Please enter another email. Email already exists."})
            if uname:
                error.update({'username': "Please enter another username. Username already exists."})
            if formData['coach'] == None :
                if request.user.coach_exist:
                    coach = request.user.coaches
            else:
                coach = Coaches.objects.get(id=formData['coach'], is_deleted=False)
            if error:
                context.update({'success': False, 'message': error})
            elif coach:
                with transaction.atomic():
                    user = User.objects.create_user(
                        username=formData['username'],
                        email=formData['email'],
                        password=formData['password'],
                    )
                    user.user_type = Users['Client']
                    user.save()
                    Clients.objects.create(
                        user=user,
                        first_name=formData['first_name'],
                        last_name=formData['last_name'],
                        email=formData['email'],
                        phone=formData['phone'] if formData['phone'] else None,
                        title=formData['title'],
                        company_name=formData['organization'],
                        company_url=formData['organization_url'],
                        address=formData['address'],
                        zip=formData['zip'] if formData['zip'] else None,
                        country=formData['country'],
                        state=formData['state'],
                        city=formData['city'],
                        coach=coach,
                    )
                context.update({'success': True, 'message': "Client created successfully."})
        return JsonResponse(context)

    def put(self, request, *args ,**kwargs):
        context={}
        error = {}
        formData = json.loads(request.body.decode())
        # email = formData['email']
        client_id = formData['client_id']
        if client_id != ' ' and client_id != None:
            # email_check = Clients.objects.filter(email = email,is_deleted=False).exclude(id=client_id).exists()
            # if email_check == True:
            #     error.update({'email' : "Please enter another email.Email already exists."})
            #     context.update({"success": False, "message": error})
            #     return JsonResponse(context)
            # else:
            if request.user.coach_exist:
                coach = request.user.coaches
            else:
                coach = Coaches.objects.get(id=formData['coach'],is_deleted=False)
            with transaction.atomic():
                client = Clients.objects.get(id = client_id,is_deleted=False)
                client.coach = coach
                client.first_name = formData['first_name']
                client.last_name = formData['last_name']
                client.phone = formData['phone'] if formData['phone'] else None
                client.address = formData['address']
                client.title = formData['title']
                # client.email = formData['email']
                client.company_name = formData['organization']
                client.company_url = formData['organization_url']
                client.city = formData['city']
                client.state = formData['state']
                client.country = formData['country']
                client.zip = formData['zip'] if formData['zip'] else None
                client.save()
                # client.user.email = formData['email']
                # client.user.save()
                context.update({'success' :True , "message": "Coach details updated successfully."})
            return JsonResponse(context)
        return redirect("dashboard")

    def delete(self, request, *args ,**kwargs):
        if request.user.is_authenticated:
            id = request.body.decode("utf-8")
            with transaction.atomic():
                client = Clients.objects.get(id=id, is_deleted=False)
                client.is_deleted = True
                client.save()
                try:
                    client.user.is_deleted = True
                    client.user.save()
                except:
                    pass
                return JsonResponse({"success": "success"})
        return redirect("dashboard")
        

class ClientDetailView(LoginRequiredMixin, View):
    template_name = "new_theme/client-detail.html"

    def get(self, request, id , *args, **kwargs):
        if request.user.is_admin or request.user.is_superuser or self.request.user.coach_exist:
            client = Clients.objects.get(id = id,is_deleted=False)
            participant = Participant.objects.filter(client__first_name = client.first_name,is_deleted=False)
            survey = Survey.objects.filter(Survey_client__first_name = client.first_name)
            active_survey = Survey.objects.filter(Survey_client__first_name = client.first_name, status="AT")
            completed_survey = Survey.objects.filter(Survey_client__first_name = client.first_name, status="CT")
            draft_survey = Survey.objects.filter(Survey_client__first_name = client.first_name, status="US")
            context = {}
            context.update({'participant':participant})
            context.update({'client':client})
            context.update({'survey':survey})
            context.update({'active_survey':active_survey})
            context.update({'completed_survey':completed_survey})
            context.update({'draft_survey':draft_survey})
            return render(request, self.template_name,context)
        return redirect("dashboard")


class ClientOrganisationList(LoginRequiredMixin, View):
    template_name = "new_theme/client-detail.html"

    def get(self, request, *args, **kwargs):
        if request.user.is_admin or request.user.is_superuser or self.request.user.coach_exist:
            context = {}
            if self.request.user.coach_exist:
                client = Clients.objects.filter(coach__id=self.request.user.coaches.id, is_deleted=False).distinct('company_name')\
                   .values('company_name', 'id').exclude(Q(company_name=None)|Q(company_name='') )
            else:
                client = Clients.objects.filter(is_deleted=False).values('company_name', 'id').distinct('company_name').exclude(Q(company_name=None)|Q(company_name=''))
                coach_list = Coaches.objects.filter(is_deleted = False).values()
                context.update({'coaches': list(coach_list)})
            context.update({'organisations': list(client)})
            return JsonResponse(context)
        return redirect("dashboard")


class GetClientInfo(LoginRequiredMixin, View):
    template_name = "new_theme/clients.html"

    def get(self, request, *args, **kwargs):
        if request.user.is_admin or request.user.is_superuser or self.request.user.coach_exist:
            coach_id = request.GET.getlist('coach_id[]') if request.GET.getlist('coach_id[]') else request.GET.getlist('coach_id')
            coach_list = []
            for i in coach_id:
                coach_list.append(Coaches.objects.get(id=i))
            client = Clients.objects.filter(coach__in=coach_list).values()
            return JsonResponse({'client': list(client), 'success': 'success'})
        return redirect("dashboard")