from django.urls import path
from core import views
from django.contrib.auth.decorators import login_required
from new_theme.views import *

urlpatterns = [
    # basic apis
    path("signup/", views.SignUpView.as_view(), name="signup"),
    path("plan/<to>", views.PlanView.as_view(), name="plan"),
    path("planhistory/", views.PlanHistoryView.as_view(), name="planhistory"),
    path("login/", views.LoginView.as_view(), name="logins"),
    path("forgot-password/", views.ForgotPasswordView.as_view(), name="send-otp"),
    path("skipplan/", views.SkipPlan.as_view(), name="skipplan"),
    path("dashboard/", Admin_dashboardView.as_view()),
    # path("dashboard/", views.DashboardAPIView.as_view(), name="dashboard"), #also delete client method
    path("logout/", views.logout, name="logout"),
    path("profile/", login_required(views.UserProfile.as_view()), name="profile"),#also(post and delete user profile img)
    path("get-notifications/", views.GetNotifications, name="get-notifications", ),
    path("stage-notifications/", views.NotificationsStage, name="stage-notifications", ),

    # client
    path("client-intake/", login_required(views.ClientIntake.as_view()), name="client-intake", ),
    path("archived-client/", views.ArchiveClient.as_view(), name="archived-client"),#get and post
    path("client-detail/<client>", login_required(views.ClientDetail.as_view()), name="detail-client", ),
    path("client-detail/<client>/<survey_id>", login_required(views.ClientDetail.as_view()), name="mail-client", ),
    path("clientlist/", login_required(views.ClientList.as_view()), name="clientlist"),
    path("clientlistjson/", views.ClientListjsonview.as_view(),),
    path("client-profile/<client>", views.UpdateClientProfileImg.as_view(), name="client-profile", ),
    path("clientlistdt/", views.ClientListDT.as_view(), name="clientlistdt", ),



    # profile
    path("my-account/", views.MyAccount.as_view(), name="my-account", ),
    path("change-password/", login_required(views.ResetPasswordView.as_view()), name="change-password", ),


    #admin
    path("admin_base_theme/", views.AdminBaseTheme.as_view(), name="admin_base_theme"),
    path("", views.LoginView.as_view(), name="loginstart"),

    path("participantdt/<code>", views.ParticipantDT.as_view(), name="participantdt"),
    path("send_survey/", views.send_survey, name="send_survey"),
    path("save_mail_content/", views.save_content, name="save_content"),
    path("survey-to-response/<u_id>/", views.survey_to_response.as_view(), name="survey-to-response"),
    path("send_email/", views.send_email, name="send_email"),
    path("email_client_intake/", views.Email_Client_Intake, name="email_client_intake"),
    path("client_intake_response/<u_id>/", views.Client_Intake_Response.as_view(), name="client_intake_response"),
    path("intake-responses/", views.IntakeResponses.as_view(), name="intake-responses"),
    path("all-invites/", views.AllInvites.as_view(), name="all-invites"),
    path("client_data_view/<code>", views.client_data_view.as_view(), name="client_data_view"),
    path(
        "delete-survey/<survey>/<client>",
        login_required(views.DeleteSurvey.as_view()),
        name="delete-survey",
    ),
    path(
        "save-cont/",
        login_required(views.GetPopupValue),
        name="save-cont",
    ),
    path(
        "add-participant/",
        login_required(views.AddParticipant.as_view()),
        name="add-participant",
    ),
    path(
        "edit-participant/<pk>",
        login_required(views.ParticipantEdit.as_view()),
        name="edit-participant",
    ),
    path(
        "add-relation/",
        login_required(views.AddRelation),
        name="add-relation",
    ),
    path(
        "add-paging/",
        login_required(views.AddPaging),
        name="add-paging",
    ),
    path("coachlist/", login_required(views.CoachList.as_view()), name="coachlist"),
    path("coachlistjson/", login_required(views.CoachListjson.as_view()),),
    path("profile-image/<pk>",login_required(views.UpdateProfileLogo.as_view()),name="profile-update-image",),
    path(
        "user-profile/<pk>",
        login_required(views.UpdateUserProfile.as_view()),
        name="user-profile-data",
    ),
    path("password-reset/<code>", views.PasswordReset.as_view(), name="password-reset"),
    path("edit-client/<client>",views.EditClient.as_view(),name="edit-client",),
    path(
        "edit-client-intake/<client>",
        views.EditClientIntake.as_view(),
        name="edit-client-intake",
    ),
    path("documentdelete/<int:pk>/", views.DeleteDocument, name="delete-doc"),
    path(
        "clientdocument/<client>",
        views.ClientDocument.as_view(),
        name="client-document",
    ),
    path("clientinvite/<code>", views.ClientInviteForm.as_view(), name="clientinvite"),
    path(
        "inviteclient/<email>",
        views.ClientInviteEmailForm.as_view(),
        name="inviteclient",
    ),
    path("participantlist/", views.ParticipantList.as_view(), name="participant-list"),
    path(
        "participantinvite/<email>",
        views.ParticipantInviteEmailForm.as_view(),
        name="inviteparticipant",
    ),
    path(
        "delete-participant/<participant>",
        login_required(views.DeleteParticipant.as_view()),
        name="delete-participant",
    ),
    path(
        "inviteparticipant/<code>",
        views.ParticipantInviteForm.as_view(),
        name="participant-invite",
    ),
    path(
        "congo",views.Congo.as_view(), name="congo",),
    path(
        "payment-success/<type>",
        views.PaymentSuccess.as_view(),
        name="payment-success",
    ),
    path("message-history/<id>", views.MessageHistory.as_view(), name="message-history",),
    path("userhasclient/", views.UserhasClient, name="userhasclient",),
    path("payment-mode/<mode>", views.PaymentMode, name="payment-mode",),

    path("get-survey-info/", views.GetSurveyInfo.as_view(), name="get-survey-info",),

]
