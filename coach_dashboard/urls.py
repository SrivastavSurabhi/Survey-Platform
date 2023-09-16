from django.urls import path
from coach_dashboard.views import *
from coach_dashboard.client_intake import Client_intake_process

urlpatterns = [
	path("add_client/", Coaches_add_Client),
    path("client_intake/process/<client_id>", Client_intake_process),
	path("add_participent/", Coaches_add_participent),
	path("send_survey/<survey_id>/<participent_id>/", survey_send_to_participent),
	
]