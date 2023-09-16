from django.contrib.auth.mixins import LoginRequiredMixin
from django.views import View
from django.shortcuts import render, redirect
from core.models import Coaches, UserAvatar,UserPlanInfo
import datetime
from django_datatables_view.base_datatable_view import BaseDatatableView
from django.db.models import Q
from .adminDashboard import *


class RevenueView(LoginRequiredMixin, View):
    template_name = "new_theme/revenue.html"

    def get(self, request):
        if request.user.is_admin or request.user.is_superuser:
            #Enterprise Plan
            uplaninfo = UserPlanInfo.objects.filter(title="Enterprise Plan").values()
            ep_fee = 0
            for i in uplaninfo:
                ep_fee = ep_fee + i['totalfee']
                uplan = UserPlanInfo.objects.get(coach_id = i['coach_id'])
                added_plan = uplan.addedsurvey.filter().values()
                for i in added_plan:
                    ep_fee = ep_fee + i['totalfee']
            #Individual Plan
            individual_planinfo = UserPlanInfo.objects.filter(title="Individual Plan").values()
            ip_fee = 0
            for i in individual_planinfo:
                ip_fee = ip_fee + i['totalfee']
                individual_plan = UserPlanInfo.objects.get(coach_id = i['coach_id'])
                added_plan = individual_plan.addedsurvey.filter().values()
                for i in added_plan:
                    ip_fee = ip_fee + i['totalfee']
            context = {}
            context.update({'individual_amount' : ip_fee})
            context.update({'enterprise_amount' : ep_fee})
            coaches = Coaches.objects.filter(is_deleted=False).order_by('-id')
            plan = UserPlanInfo.objects.all()

            # Chart Yearly
            present_year = datetime.datetime.now().year
            year_names = []
            for i in range(present_year-5,present_year+1):
                year_names.append(i)
            
            context.update({'coaches' : coaches})
            context.update({'plans' : plan})

            return render(request, self.template_name, context)
        return redirect("dashboard")


class RevenueDatatableView(BaseDatatableView):
    order_columns = ["id",'',"first_name", "user__email", "userplan__plan__title" ,"","userplan__created_ts","userplan__valid",""]


    def get_initial_queryset(self):
        if self.request.user.is_admin or self.request.user.is_superuser:
            coaches = Coaches.objects.filter(is_deleted=False).prefetch_related("userplaninfoCoach","user")

        return coaches
    def filter_queryset(self, qs):
        search = self.request.GET.get('search[value]', None)
        if search:
            qs = qs.filter(Q(first_name__icontains=search) | Q(last_name__icontains=search) | Q(user__email__icontains
                    =search)| Q(userplan__plan__title__icontains = search) | Q(userplan__created_ts__icontains =search) )
                    #| Q(userplan__totalfee__icontains=search)| Q(userplan__valid__icontains = search) | Q(userplan__status__icontains=search ) )
        return qs

    def prepare_results(self, qs):
        json_data = []
        allAvatars = UserAvatar.objects.filter(user_id__in=qs.values_list('user_id'))
        for item in qs:
            userPlanInfo = item._prefetched_objects_cache['userplaninfoCoach']
            userAvatar = allAvatars.filter(user_id = item.user_id).first()
            json_data.append({
                "id": item.id,
                "profile": userAvatar.avatar.name if userAvatar else None,
                "complete_name": item.first_name + " " + item.last_name,
                "email": item.user.email,
                "type_of_plan": userPlanInfo[0].title if userPlanInfo else '-',
                "price": userPlanInfo[0].totalfee if userPlanInfo else '-',
                "purchase_date": userPlanInfo[0].created_ts.date() if userPlanInfo else '-',
                "expiry_date": userPlanInfo[0].valid().date() if userPlanInfo else '-',
                "status": userPlanInfo[0].status() if userPlanInfo else '-'
                
            })

        return json_data