from django.contrib.auth.mixins import LoginRequiredMixin
from django.views import View
from django.shortcuts import render, redirect
from core.models import UserAvatar
from survey.models import *
from django_datatables_view.base_datatable_view import BaseDatatableView
from django.db.models import Q
from django.db.models import F,Value, Case, When
from new_theme.constant import *
from django.http import JsonResponse
import json


class ReportsView(LoginRequiredMixin, View):
    template_name = "new_theme/reports.html"

    def get(self, request):
        return render(request, self.template_name)


class GenerateReport(LoginRequiredMixin, View):
    template_name = "new_theme/generate_report.html"

    def get(self, request, surveyid, *args, **kwargs):
        try:
            context = {}
            questions_answers = {}
            survey = Survey.objects.get(pk=self.kwargs['surveyid'])
            try:
                report = FeedBackReport.objects.get(survey=survey, user="Client")
                footer = ReportFooter.objects.get(report=report)
                context.update({'footer': footer})
            except:
                report = FeedBackReport.objects.create(survey=survey, user="Client")
                ReportFooter.objects.create(report=report)
            groups = Group.objects.filter(report=report)
            questions = SurveyQuestion.objects.filter(survey=survey).order_by("id")
            loopcounter = 0
            if groups.count() > 0:
                context.update({'groups': groups})
            relations = Relationship.objects.all()
            #     for question in questions:
            #         answers = Answer.objects.filter(question=question, survey=survey)
            #         loopcounter = loopcounter + 1
            #         for group in groups:
            #             ans = []
            #             for answer in answers:
            #                 if answer.participant.relationship == group.relation:
            #                     ans.append(answer)
            #             answerslist = {group.name: ans}
            #         questions_answers.update({question.question: answerslist})
            # else:
            for question in questions:
                loopcounter = loopcounter+1
                answ = Answer.objects.filter(question=question).values('id', 'answer', 'participant__first_name',
                                                                'participant__relationship__relation')
                questions_answers.update({loopcounter: {'question': {'id': question.id, 'text': question.question}, 'answers': list(answ)}})

            survey_campaigns = SurveyCampaign.objects.filter(survey=survey)
            participant_summary = []
            if survey_campaigns.count() > 0:
                for relation in relations:
                    total_sent = survey_campaigns.filter(participant__relationship=relation)
                    if total_sent.filter(status=True).count() > 0:
                        participant_summary.append({
                            'relation': relation,
                            'total_sent': total_sent.count(),
                            'participant_responded': total_sent.filter(status=True).count(),
                            'participation_percentage': (total_sent.count() / total_sent.filter(status=True).count()) * 100 if total_sent.count()>0 else 0
                        })
            context.update({'survey_campaigns': survey_campaigns, "participant_summary": participant_summary})

            context.update({'survey': survey, 'report': report, 'questions_answers': questions_answers, 'relations': relations})
            return render(request, self.template_name, context)
        except:
            return redirect('dashboard')

    def post(self, request, *args, **kwargs):
        survey = Survey.objects.get(id=kwargs['surveyid'])
        try:
            report = FeedBackReport.objects.get(survey=survey)
        except:
            report = FeedBackReport.objects.create(survey=survey)
            ReportFooter.objects.create(report=report)
        try:
            report.logo = request.FILES['logo']
        except:pass
        report.noteheading = request.POST['note_heading']
        report.notecomments = request.POST['note_comment']
        report.status = "Completed"
        report.save()
        try:
            group = json.loads(request.POST['grouping'])
            Group.objects.filter(report=report).delete()
            for grp in group:
                try:
                    addrel = Group.objects.get(report=report, name='Group '+grp['group'])
                except:
                    addrel = Group.objects.create(report=report, name='Group '+grp['group'])
                for g in grp['relation']:
                    addrel.relation.add(Relationship.objects.get(relation=g))
                    addrel.save()
        except:
            pass

        return JsonResponse({'success': True, 'message': 'Report Created'})

    def delete(self, request, *args ,**kwargs):
        id = request.body.decode("utf-8")
        FeedBackReport.objects.get(id=id).delete()
        return JsonResponse({"success":"success"})


class ReportsDatatabeView(BaseDatatableView):
    order_columns = ["id", '', "survey__Survey_client__coach__first_name", "survey__Survey_client__first_name",
                     "survey__title", "survey__created_ts", "complete_status", "survey__total_sent"]

    def get_initial_queryset(self):
        if self.request.user.is_admin or self.request.user.is_superuser:
            reports = FeedBackReport.objects.filter(user='Client').order_by('-id').annotate(complete_status=Case(
                            When(survey__status=Status['Active'], then=Value('Active')),
                            When(survey__status=Status['Completed'], then=Value('Closed')),
                            When(survey__status=Status['Draft'], then=Value('Draft')),
                            When(survey__status=Status['Reopen'], then=Value('Active'))
                            ))
        if self.request.user.user_type == 2:
            reports = FeedBackReport.objects.filter(user='Client', survey__Survey_client__coach=self.request.user.coaches)\
                .order_by('-id').annotate(complete_status=Case(
                        When(survey__status=Status['Active'], then=Value('Active')),
                        When(survey__status=Status['Completed'], then=Value('Closed')),
                        When(survey__status=Status['Draft'], then=Value('Draft')),
                        When(survey__status=Status['Reopen'], then=Value('Active'))
                        ))
        if self.request.user.user_type == 3:
            reports = FeedBackReport.objects.filter(user='Client', survey__Survey_client=self.request.user.clients.id) \
                .order_by('-id').annotate(complete_status=Case(
                When(survey__status=Status['Active'], then=Value('Active')),
                When(survey__status=Status['Completed'], then=Value('Closed')),
                When(survey__status=Status['Draft'], then=Value('Draft')),
                When(survey__status=Status['Reopen'], then=Value('Active'))
            ))
        return reports


    def filter_queryset(self, qs):
        search = self.request.GET.get('search[value]', None)
        if search:
            if self.request.user.user_type == Users['Admin'] :
                qs = qs.filter(Q(survey__title__icontains=search) | Q(complete_status__icontains=search)\
                    | Q(survey__total_sent__icontains=search) | Q(survey__created_ts__icontains=search) \
                        |Q(survey__Survey_client__first_name__icontains = search)\
                            | Q(survey__Survey_client__last_name__icontains = search)\
                        |Q(survey__Survey_client__coach__first_name__icontains=search) | \
                            Q(survey__Survey_client__coach__last_name__icontains=search) )
            elif self.request.user.user_type == Users['Coach']:
                qs = qs.filter( Q(survey__title__icontains=search) | Q(complete_status__icontains=search)\
                    | Q(survey__total_sent__icontains=search) | Q(survey__created_ts__icontains=search) \
                        |Q(survey__Survey_client__first_name__icontains = search)\
                            | Q(survey__Survey_client__last_name__icontains = search))
            else:
                qs = qs = qs.filter( Q(survey__title__icontains=search) | Q(complete_status__icontains=search)\
                    | Q(survey__total_sent__icontains=search) | Q(survey__created_ts__icontains=search))
        return qs

    def prepare_results(self, qs):
        json_data = []
        allAvatars = UserAvatar.objects.filter(user_id__in=qs.values_list('survey__Survey_client__coach__user_id'))
        for item in qs:
            userAvatar = allAvatars.filter(user_id = item.survey.Survey_client.coach.user_id).first()
            json_data.append({
            "id": item.id,
            "logo": userAvatar.avatar.name if userAvatar else None,
            "survey_coach": item.survey.Survey_client.coach.first_name + " " + item.survey.Survey_client.coach.last_name,
            "survey_client": item.survey.Survey_client.first_name + " " + item.survey.Survey_client.last_name,
            "created_date": item.survey.created_ts.date(),
            "title": item.survey.title ,
            "status": item.status ,
            "complete_status": item.complete_status ,
            "total_sent": SurveyCampaign.objects.filter(survey= item.survey, response = 'COMPLETE').count(),
            "survey_id" : item.survey.id

            })

        return json_data


class ReportLogo(LoginRequiredMixin, View):
    """
    User Profile image according to superadmin and coaches and client
    """

    template_name = "new_theme/coaches.html"

    def delete(self, request, *args, **kwargs):
        report = FeedBackReport.objects.get(id=kwargs['id'])
        report.logo = None
        report.save()
        return JsonResponse({'success': "success"})




