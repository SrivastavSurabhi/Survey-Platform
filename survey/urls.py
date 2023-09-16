from django.urls import path
from survey.views import *
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required

urlpatterns = [
    path("create/", login_required(CreateSurvey.as_view()), name="survey-create"),
    path("create/<int:id>", login_required(CreateSurvey.as_view()), name="srvey-create"),
    path("create-survey/",login_required(CreateSurveyData.as_view()),name="create-survey",),
    path("create/template/question/<survey_id>/<template>", login_required(CreateSurveyTemplate.as_view()),
         name="survey-question-template", ),

    path("create_question/", csrf_exempt(QuestionCreation.as_view())),
    path("create_survey/", csrf_exempt(SurveyCreation.as_view())),
    path("list_survey/", survey_list),
    path("send_participent/<survey_id>", survey_attempt),


    path(
        "create/question/<survey_id>",
        login_required(SurveyQuestionview.as_view()),
        name="survey-question",
    ),    path(
        "show_survey/<survey_id>",
        login_required(ShowSurvey.as_view()),
        name="show-survey",
    ),
    path(
        "saveinstruction/<survey_id>",
        login_required(SaveInstruction.as_view()),
        name="save-instruction",
    ),
    path(
        "questionlist/<survey_id>",
        login_required(SurveyQuestionList.as_view()),
        name="question-list",
    ),
    path(
        "copy-survey-list/",
        login_required(CopyPasteSurvey.as_view()),
        name="copy-survey-list",
    ),
    path(
        "copy-prev-survey/<client_id>/<sur_id>",
        login_required(CopyPasteSurvey.as_view()),
        name="copy-survey",
    ),
    path(
        "copy-survey/<survey_id>",
        login_required(SurveyCopyView.as_view()),
        name="copy-survey-question",
    ),
    # path("unsent", login_required(UnsentSurveys.as_view()), name="unsent-surveys"),
    path("unsent", login_required(UnsentSurveysList.as_view()), name="unsent-surveys"),
    path("unsentlist", login_required(UnsentSurveysList.as_view()), name="unsent-surveys-list",),
    path("unsentlistjson/", login_required(UnsentSurveysListjson.as_view()), ),
    path("activelistjson/", login_required(ActiveSurveysListjson.as_view()), ),
    # path("active", login_required(ActiveSurveys.as_view()), name="active-surveys"),
    path("active", login_required(ActiveSurveysList.as_view()), name="active-surveys"),
    path(
        "activelist",
        login_required(ActiveSurveysList.as_view()),
        name="active-surveys-list",
    ),
    # path(
    #     "completed", login_required(CompleteSurveys.as_view()), name="completed-surveys"
    # ),
    path("completedlistjson/", login_required(CompletedListjson.as_view()), ),
    path("completed", login_required(CompletedSurveysList.as_view()), name="completed-surveys"),
    path(
        "completedlist",
        login_required(CompletedSurveysList.as_view()),
        name="completed-surveys-list",
    ),
    # path("all", login_required(AllSurveys.as_view()), name="all-surveys"),
    path("all", login_required(AllSurveysList.as_view()), name="all-surveys"),
    path("alllist/", login_required(AllSurveysList.as_view()), name="all-surveys-list"),
    path("alllistjson/", login_required(AllSurveysListjson.as_view())),
    path("list/", login_required(SurveysList.as_view()), name="surveys-list"),
    path("logo/<pk>", login_required(UpdateSurveyLogo.as_view()), name="survey-logo"),
    path(
        "deletelogo/<pk>",
        login_required(DeleteSurveyLogo.as_view()),
        name="delete-logo",
    ),
    path(
        "survey-data/<pk>",
        login_required(UpdateSurveyData.as_view()),
        name="survey-data",
    ),
    path("send-survey", login_required(SendSurvey.as_view()), name="send-survey"),
    path(
        "participant-response",
        login_required(ParticipantResponse.as_view()),
        name="participant-response",
    ),
    path(
        "feedback-report",
        login_required(FeedBackReport.as_view()),
        name="feedback-report",
    ),
    path(
        "feedback-report-client/<client_id>",
        login_required(FeedBackReport.as_view()),
        name="feedback-report-inner",
    ),
    path(
        "feedback-report-generated",
        login_required(GenerateFeedBackReport.as_view()),
        name="generated-feedback-report",
    ),
    path(
        "survey-favourite/<survey_id>",
        login_required(SurveyFavouriteView.as_view()),
        name="survey-favourite",
    ),
    path(
         "feedback-report/<survey_id>",
        login_required(SurveyFeedBackReport.as_view()),
        name="survey-feedback-detail",
    ),
    path(
        "feedback-report/<survey_id>/<user>",
        login_required(SurveyFeedBackReport.as_view()),
        name="survey-feedback-detail-user",
    ),
    path(
        "copyquestion/<survey_id>/<question_survey>",
        login_required(SurveyCopyQuestionList.as_view()),
        name="copy-survey-question",
    ),
    path(
        "surveyfill",
        login_required(SendSurveyFillup.as_view()),
        name="survey-fill",
    ),
    # path(
    #     "speech",
    #     login_required(Speech),
    #     name="speech",
    # ),
    path(
        "delete_que/<que_id>",
        login_required(DeleteQues.as_view()),
        name="delete_que",
    ),
    path(
        "deleteconf_que/<que_id>",
        login_required(DeleteConfQues.as_view()),
        name="deleteconf_que",
    ),
    path(
        "add-head/<user>",
        login_required(AddHeading),
        name="add-heead",
    ),
    path(
        "sur-head/",
        login_required(SurveyHeading.as_view()),
        name="sur-head",
    ),
    path(
        "rpt-head/",
        login_required(ReportHeading.as_view()),
        name="rpt-head",
    ),
    path(
        "draft-status/",
        login_required(DraftStatus.as_view()),
        name="draft-status",
    ),
    path(
        "download/<survey_id>",
        login_required(DownloadPdf.as_view()),
        name="download",
    ),
    path(
        "download/<survey_id>/<user>",
        login_required(DownloadPdf.as_view()),
        name="download-user-pdf",
    ),
    path(
        "send-mail/",login_required(SendClientReport.as_view()),
        name = "send-mail"
    ),
    path(
        "add-responses/",AddResponses.as_view(),name="add-responses",
    ),
    path(
        "add-group/",
        login_required(AddGroups.as_view()),
        name="add-group",
    ),
    path(
        "saveas/",
        login_required(SaveAs),
        name="saveas",
    ),
    path(
        "savefooter/",
        login_required(SaveFooter),
        name="savefooter",
    ),
    path(
        "delete-responses/<id>/<user>",
        login_required(DeleteResponses.as_view()),
        name="delete-responses",
    ),
    path(
        "delete-report/<id>",
        login_required(DeleteFeedBackReport.as_view()),
        name="delete-report",
    ),
    path(
        "delete-conf-responses/<id>",
        login_required(DeleteConfResponses.as_view()),
        name="delete-conf-responses",
    ),

    path(
        "filter_response/",
        login_required(FilterResponses.as_view()),
        name="filter_response",
    ),
    path("report-stage/", login_required(ReportStage.as_view()), name="report-stage",),
    path("buy-survey/", login_required(BuySurvey.as_view()), name="buy-survey",),

]
