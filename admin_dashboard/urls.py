from django.urls import path
from admin_dashboard.views import *
from admin_dashboard import views

urlpatterns = [
    path("dashboard/", views.Admin_dashboard.as_view(), name="dashboard"),
    path("coaches/<id>", views.CoachDetail.as_view(), name="coaches"),
    path("client/<id>", views.ClientDetail.as_view(), name="clientdetail"),
    path("survey/<id>", views.SurveyDetail.as_view(), name="surveydetail"),
    path("clients/", views.ClientsAPI.as_view(), name="clients"),
    path("participants/", views.Participants.as_view(), name="participants"),
    path("surveys/", views.Surveys.as_view(), name="surveys"),
    path("revenue/", views.Revenue.as_view(), name="revenue"),
    path("reports/", views.Reports.as_view(), name="reports"),
    path("coachsurveylist/<id>", views.CoachSurveyListjsonview.as_view(), name="coachsurveylist"),
    path("clientsurveylist/<id>", views.ClientSurveyListjsonview.as_view(), name="clientsurveylist"),
    path("surveylist/<id>", views.SurveyListjsonview.as_view(), name="surveylist"),
    path("clientsurveys/<id>", views.ClientSurveys.as_view(), name="clientsurveys"),
    path("coachparticipantlist/<id>", views.CoachpParticipantListjsonview.as_view(), name="coachparticipantlist"),
    path("coachclientlist/<id>", views.CoachClientListjsonview.as_view(), name="coachclientlist"),
    path("coachclients/<id>", views.CoachClients.as_view(), name="coachclients"),
]
