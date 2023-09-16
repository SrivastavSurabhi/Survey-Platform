from django.contrib import admin
from .models import *


# Register your models here.
class SurveyCategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "parent_category_name")
    list_filter = ["parent_category__name"]
    search_fields = ("name", "parent_category__name")

    def parent_category_name(self, obj):
        try:
            return obj.parent_category.name
        except:
            pass


class SurveyAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "instructions",
        "status",
        "Survey_categorys",
        "creator",
        "created_ts",
    )
    list_filter = ["status", "Survey_category", "creator", "created_ts"]
    search_fields = ("title", "Survey_categorys", "instructions", "status")

    def Survey_categorys(self, obj):
        try:
            return obj.Survey_category.name
        except:
            pass


class SurveyQuestionAdmin(admin.ModelAdmin):
    pass


class SurveyAnswerAdmin(admin.ModelAdmin):
    pass


class ParticipentSurveyAttemptAdmin(admin.ModelAdmin):
    pass


class ParticipentQuestionAnswerAdmin(admin.ModelAdmin):
    pass


class ParticipentAvailableSurveyAdmin(admin.ModelAdmin):
    pass


admin.site.register(SurveyCategory, SurveyCategoryAdmin)
admin.site.register(Survey, SurveyAdmin)
admin.site.register(SurveyQuestion, SurveyQuestionAdmin)
admin.site.register(Answer)
admin.site.register(SurveyCampaign)
admin.site.register(Group)
admin.site.register(FeedBackReport)
admin.site.register(ReportFooter)
admin.site.register(EditedAnswer)

