from django.contrib import admin
from .models import *


# Register your models here.
class UserAdmin(admin.ModelAdmin):
    list_display = (
        "email",
        "username",
        "is_active",
        "is_staff",
        "is_admin",
        "is_superuser",
    )
    list_filter = ["is_active", "is_staff", "is_admin", "is_superuser"]
    search_fields = ("email", "username")


class CoachesAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "first_name",
        "last_name",
        "title",
        "company_name",
        "company_url",
    )
    list_filter = ["user", "company_name"]
    search_fields = ("user", "first_name", "last_name", "title", "company_name")


class ClientsAdmin(admin.ModelAdmin):
    list_display = (
        "coach",
        "email",
        "first_name",
        "last_name",
        "phone",
        "company_name",
        "company_email",
    )
    list_filter = ["coach", "email", "company_name", "company_email"]
    search_fields = ("coach", "email", "company_name", "company_email", "phone")


# class ParticipentAdmin(admin.ModelAdmin):
#     list_display = ("email", "first_name", "last_name", "relationship")
#     list_filter = ["email", "first_name", "last_name", "relationship"]
#     search_fields = ("email", "first_name", "last_name", "relationship")


# class ImageAdmin(ImageCroppingMixin, admin.ModelAdmin):
#     pass
#
# admin.site.register(UserAvatar, ImageAdmin)
admin.site.register(User, UserAdmin)
admin.site.register(Coaches, CoachesAdmin)
admin.site.register(Clients, ClientsAdmin)
admin.site.register(Participant)
admin.site.register(PasswordReset )
admin.site.register(AddPaticipantByOther)
admin.site.register(Relationship)
admin.site.register(IntakeQuestions)
admin.site.register(ClientIntake)
admin.site.register(ClientIntakeFiles)
admin.site.register(Plan)
admin.site.register(UserPlan)
admin.site.register(ClientIntakeAnswer)
admin.site.register(UserPlanInfo)
admin.site.register(Notification)
admin.site.register(SurveyUpgraded)
admin.site.register(ClientCampaign)
admin.site.register(IntakeIstruction)

