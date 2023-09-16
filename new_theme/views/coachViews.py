from django.contrib.auth.mixins import LoginRequiredMixin
from django.views import View
from django.shortcuts import render, redirect
from django.views.generic import TemplateView
from core.models import *
from survey.models import *
from django.contrib.auth import get_user_model, login, logout as django_logout
from survey.models import Survey
from django_datatables_view.base_datatable_view import BaseDatatableView
from django.db.models import Q
from django.http import JsonResponse
import json
from django.db import transaction
from ..constant import *


class CoachView(LoginRequiredMixin, View):
    template_name = "new_theme/coaches.html"

    def get(self, request, *args, **kwargs):
        if request.user.is_admin or request.user.is_superuser:
            return render(request, self.template_name)
        return redirect('dashboard')


class CoachDataTableView(BaseDatatableView):
    order_columns = ["id", "user__user_avatar__avatar","first_name", "user__email", "userplan__plan__title", "title"]

    def get_initial_queryset(self):
        coaches = Coaches.objects.filter(is_deleted=False).order_by('-id')
        return coaches

    def filter_queryset(self, qs):
        search = self.request.GET.get('search[value]', None)
        name = self.request.GET.get('search[cname]')
        email = self.request.GET.get('search[email]')
        plan = self.request.GET.get('search[userplan]')
        title = self.request.GET.get('search[title]')
        if search:
            qs = qs.filter(Q(first_name__icontains=search) | Q(last_name__icontains=search) | Q(user__email__icontains
                    =search)| Q(userplan__plan__title__icontains = search) | Q(title__icontains=search) )
        if name or email or title:
            qs = qs.filter(first_name__icontains=name, user__email__icontains =email,\
                 title__icontains=title )
        if plan:
            qs = qs.filter(userplan__plan__title__icontains=plan)
        return qs

    def prepare_results(self, qs):
        json_data = []
        allAvatars = UserAvatar.objects.filter(user_id__in=qs.values_list('user_id'))
        userPlans = UserPlanInfo.objects.filter(coach_id__in=qs.values_list('id'))
        for item in qs:
            userAvatar = allAvatars.filter(user_id = item.user_id).first()
            userPlan = userPlans.filter(coach_id = item.id).first()
            json_data.append({
                "id": item.id,
                "logo": userAvatar.avatar.name if userAvatar else None,
                "complete_name": item.first_name + " " + item.last_name,
                "email": item.user.email,
                "type_of_plan": userPlan.uplan.plan.title if userPlan else '-',
                "title": item.title if item.title else '-'
            })

        return json_data


class CoachDetailView(LoginRequiredMixin, View):
    template_name = "new_theme/coach-detail.html"

    def get(self, request, id, *args, **kwargs):
        if request.user.is_admin or request.user.is_superuser:
            coach = Coaches.objects.get(id=id)
            client = Clients.objects.filter(coach__user=coach.user)
            active_survey = Survey.objects.filter(Survey_client__in=client, status="AT")
            completed_survey = Survey.objects.filter(Survey_client__in=client, status="CT")
            draft_survey = Survey.objects.filter(Survey_client__in=client, status="US")
            context = {}
            context.update({'coach': coach})
            context.update({'client': client})
            context.update({'active_survey': active_survey})
            context.update({'completed_survey': completed_survey})
            context.update({'draft_survey': draft_survey})
            return render(request, self.template_name, context)
        return redirect("dashboard")


class CoachCRUDView(LoginRequiredMixin, View):
    template_name = "new_theme/add-new-coach.html"

    def get(self, request, *args, **kwargs):
        if request.user.is_admin or request.user.is_superuser:
            context={}
            try:
                id = self.kwargs['id']
                if id:
                    data = list(Coaches.objects.filter(id=id).values('id','user__username','user__email','first_name',\
                            'last_name','title','company_name','company_url'))
                    context.update({'data':json.dumps(data)})
            except:
                pass
            return render(request, self.template_name,context)
        return redirect("dashboard")

    def post(self, request,*args,**kwargs):
        context={}
        formData =json.loads(request.body.decode())
        email = formData['email']
        username = formData['username']
        password = formData['password']
        cnfm_password = formData['cnfm_password']
        error = {}
        if password and cnfm_password and password != cnfm_password:
            error.update({'confmpassword': "Password and Confirm password do not match."})
        if len(password) < 7:
            error.update({'password': "Password should have at least seven characters. "})
        if email and username and password and cnfm_password:
            check_user = User.objects.filter(email=email).exists()
            uname = User.objects.filter(username=username).exists()
            if check_user:
                error.update({'email' : "Please enter another email.Email already exists."})
            if uname:
                error.update({'username': "Please enter another username. Username already exists."})
            if error:
                context.update({'success': False, "message": error})
            else:
                with transaction.atomic():
                    user = User.objects.create_user(username=username, email=email, password=password)
                    user.user_type = Users['Coach']
                    user.save()
                    if user:
                        Coaches.objects.create(
                            user = user,
                            first_name = formData['first_name'],
                            last_name = formData['last_name'],
                            title = formData['title'],
                            company_name = formData['company_name'],
                            company_url = formData['company_url'],
                        )   
                    context.update({'success': True, "message": "Coach created successfully."})
        return JsonResponse(context)

    def delete(self, request, *args ,**kwargs):
        if request.user.is_admin or request.user.is_superuser:
            id = request.body.decode("utf-8")
            with transaction.atomic():
                coach = Coaches.objects.get(id=id,is_deleted=False)
                coach.is_deleted = True
                coach.user.is_deleted = True
                coach.save()
                coach.user.save()
            return JsonResponse({"success":"success"})
        return redirect('dashboard')

    def put(self, request, *args, **kwargs):
        context={}
        error = {}
        formData = json.loads(request.body.decode())
        # coach_email = formData['email']
        coach_id = formData['coach_id']
        if coach_id != ' ' and coach_id != None:
            # email_check = Coaches.objects.filter(user__email = coach_email,is_deleted=False).exclude(id=coach_id).exists()
            # if email_check == True:
            #     error.update({'email' : "Please enter another email.Email already exists."})
            #     context.update({"success": False, "message": error})
            #     return JsonResponse(context)
            # else:
            with transaction.atomic():
                coach = Coaches.objects.get(id = coach_id,is_deleted=False)
                coach.first_name = formData['first_name']
                coach.last_name = formData['last_name']
                coach.title = formData['title']
                coach.company_name = formData['company_name']
                coach.company_url = formData['company_url']
                coach.save()
                # coach.user.email = formData['email']
                # coach.user.save()
                context.update({'success' :True , "message": "Coach details updated successfully."})
                return JsonResponse(context)
        return JsonResponse(context)



