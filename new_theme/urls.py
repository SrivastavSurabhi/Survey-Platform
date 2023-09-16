from django.urls import path
# from new_theme import views
from new_theme.views import *

urlpatterns = [
    #adminDashboard Urls
    path("dashboard/", Admin_dashboardView.as_view(), name="dashboard"),
    path("individualCharts/", GetIndividualCharts.as_view(), name="individual_charts"),
    path("enterpriseCharts/", GetEnterpriseCharts.as_view(), name="enterprise_charts"),

    #coachViews Urls
    path("coaches/", CoachView.as_view(), name="coaches"),
    path("coach_datatable/", CoachDataTableView.as_view(), name="coach_datatable"),
    path("coach-detail/<int:id>", CoachDetailView.as_view(), name="coach-detail"),
    path("addcoach/", CoachCRUDView.as_view(), name="add-coach"),
    path("deletecoach/", CoachCRUDView.as_view(), name="delete-coach"),
    path("editcoach/<int:id>", CoachCRUDView.as_view(), name="edit-coach"),

    #clientViews Urls
    path("clients/", ClientView.as_view(), name="clients"),
    path("client_datatable/", ClientDataTableView.as_view(), name="client_datatable"),
    path("client_datatable/<int:id>", ClientDataTableView.as_view(), name="client_datatable_id"),
    path("client-detail/<int:id>", ClientDetailView.as_view(), name="client-detail"),
    path("addclient/", ClientCRUDView.as_view(), name="add-client"),
    path("deleteclient/", ClientCRUDView.as_view(), name="delete-client"),
    path("editclient/<int:id>", ClientCRUDView.as_view(), name="edit-client"),
    path("clientsorganisationlist/", ClientOrganisationList.as_view(), name="organisationlist"),
    path("get_clients/", GetClientInfo.as_view(), name="get_clients"),

    #participantViews Urls
    path("participants/", ParticipantsView.as_view(), name="participants"),
    path("participant_datatable/", ParticipantDataTableView.as_view(), name="participant_datatable"),
    path("participant_datatable/<int:clientid>/<int:surveyid>", ParticipantDataTableView.as_view(), name="participant_datatable"),
    path("participant-detail/<int:id>", ParticipantDetailView.as_view(), name="participant-detail"),
    path("participant_detail_datatable/<int:id>", ParticipantDetailDatatableView.as_view(), name="participant_detail_datatable-detail"),
    path("addparticipant/", ParticipantCRUDView.as_view(), name="add-participant"),
    path("deleteparticipant/", ParticipantCRUDView.as_view(), name="delete-participant"),
    path("get_relations/", GetRelations.as_view(), name="get-relations"),
    path("participant_edit/<int:id>", ParticipantCRUDView.as_view(), name="participant_edit"),

    #surveyViews Urls
    path("surveys/", SurveysView.as_view(), name="surveys"),
    path("survey_datatable/<status>", SurveyDataTableView.as_view(), name="survey_datatable"),
    path("survey_datatable/<status>/<id>", SurveyDataTableView.as_view(), name="survey_datatable"),
    path("survey-detail/<int:id>", SurveyDetailView.as_view(), name="survey-detail"),
    path("completed-survey/", CompletedSurveyView.as_view(), name="completed-survey"),
    path("addsurvey/", SurveyCRUDView.as_view(), name="addsurvey"),
    path("draft-survey/", DraftSurveyView.as_view(), name="draft-survey"),
    path("active-survey/", ActiveSurveyView.as_view(), name="active-survey"),
    path("survey_detail_datatable/<int:id>", SurveyDetailDatatableView.as_view(), name="survey_detail_datatable"),
    path("send_survey/", SendSurvey.as_view(), name="send_survey"),
    path("survey_response/<u_id>/", CollectSurveyResponse.as_view(), name="survey_response"),
    path("add-responses/", AddResponses.as_view(), name="add-responses"),
    path("deletesurvey/", SurveyCRUDView.as_view(), name="deletesurvey"),
    path("editsurvey/<int:id>", SurveyCRUDView.as_view(), name="editsurvey"),
    # path("get_survey_info/", GetSurveyInfo.as_view(), name="get_survey_info"),


    #revenueViews Urls 
    path("revenue/", RevenueView.as_view(), name="revenue"),
    path("revenue_datatable/", RevenueDatatableView.as_view(), name="revenue_datatable"),

    #reportsViews Urls
    path("reports/", ReportsView.as_view(), name="reports"),
    path("report_datatable/", ReportsDatatabeView.as_view(), name="report_datatable"),
    path("generate_report/<int:surveyid>", GenerateReport.as_view(), name="generate_report"),
    path("deletereport/", GenerateReport.as_view(), name="delete_report"),
    path("reportlogo/<int:id>", ReportLogo.as_view(), name="reportlogo"),
]
