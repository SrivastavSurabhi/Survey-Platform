from django.db import models
from core.models import User, Clients , Participant, Relationship
from core.models import Base
import uuid


class SurveyCategory(Base):
    name = models.CharField(max_length=100, null=True, blank=True)
    parent_category = models.ForeignKey(
        "self", on_delete=models.CASCADE, null=True, blank=True
    )


class Survey(Base):
    class SurveyStatus(models.TextChoices):
        UNSENT = "US"
        ACTIVE = "AT"
        COMPLETE = "CT"
        REOPEN = "RO"

    class EmailReminder(models.TextChoices):
        NORESPONSE = "NORESPONSE"
        PARTIALRESPONSE = "PARTIALRESPONSE"
        BOTH = "BOTH"
        NOREMINDER = "NOREMINDER"

    class WhenToReminder(models.TextChoices):
        WEEKLY = "WEEKLY"
        WEEKLY48 = "WEEKLY48"#"WEEKLY AND 48 HOURS BEFORE SURVEY DUE"
        # ONDEMAND = "ONDEMAND"

    class SurveyMarkedCompleted(models.TextChoices):
        AUTO = "AUTOMATICALLY"
        MANUAL = "MANUALLY"

    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name="serveys")
    # Survey_client = models.OneToOneField(
    Survey_client = models.ForeignKey(
        Clients,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="survey_client",
    )
    Survey_category = models.ForeignKey(
        SurveyCategory, on_delete=models.SET_NULL, null=True, blank=True
    )
    status = models.CharField(choices=SurveyStatus.choices, max_length=10, null=True)
    emailreminder = models.CharField(
        choices=EmailReminder.choices, max_length=50, null=True
    )
    whenemailreminder = models.CharField(
        choices=WhenToReminder.choices, max_length=255, null=True
    )
    surveymarked = models.CharField(
        choices=SurveyMarkedCompleted.choices, max_length=255, null=True, default="AUTOMATICALLY"
    )
    surveyformat = models.CharField(max_length=200, null=True, blank=True)
    title = models.CharField(max_length=256)
    description = models.TextField(null=True, blank=True)
    instructions = models.TextField(null=True, blank=True)
    start_datetime = models.DateTimeField(null=True, blank=True)
    end_datetime = models.DateTimeField(null=True, blank=True)
    company_logo = models.FileField(upload_to="companies_logo", null=True, blank=True, default=None)
    total_sent = models.IntegerField(null=True, blank=True, default=0)
    response_count = models.IntegerField(null=True, blank=True, default=0)
    display = models.CharField(max_length=80, default="onepageallque")
    inst_top = models.TextField(null=True, blank=True)
    inst_bottom = models.TextField(null=True, blank=True)
    rem_inst_top = models.TextField(null=True, blank=True)
    rem_inst_bottom = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.title

    @property
    def questions_count(self):
        if self.confidentialquestions_set.count() != 0:
            count = self.questions.count() + self.confidentialquestions_set.count()
        else:
            count = self.questions.count()
        return count

    @property
    def has_related_feedbackreport(self):
        try:
            if self.feedbackreport_set.count() != 0:
                return True
        except:
            return False


class SurveyQuestion(Base):
    class QuestionType(models.TextChoices):
        MULTIPLE_CHOICE = "MU"
        TEXT = "TX"
        BOOL = "BL"
        STAR = "STAR"

    survey = models.ForeignKey(
        Survey, on_delete=models.CASCADE, related_name="questions"
    )
    question = models.TextField()
    option = models.TextField(null=True, blank=True)
    types = models.CharField(choices=QuestionType.choices, max_length=10, null=True)
    starcolor = models.CharField(max_length=80, null=True, blank=True)
    multiple_correct_answers = models.BooleanField(default=False)
    max_allowed_time = models.DurationField(null=True, blank=True)
    sequence = models.PositiveSmallIntegerField(default=1)
    total_question = models.PositiveSmallIntegerField(default=1)
    is_confidential = models.BooleanField(default=False)
    def __str__(self):
        return self.question

    class Meta:
        ordering = ["id"]

class EditedSurveyQuestion(Base):
    question = models.ForeignKey(SurveyQuestion, on_delete=models.CASCADE)
    heading = models.CharField(max_length=80, null=True, blank=True)
    comments = models.TextField(null=True, blank=True)
    user = models.CharField(max_length=80, default="Client")


class FavouriteSurvey(Base):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="suvey_fav_user"
    )
    survey = models.ForeignKey(
        Survey, on_delete=models.CASCADE, related_name="survey_favs"
    )


class Answer(Base):
    question = models.ForeignKey(SurveyQuestion, on_delete=models.CASCADE, related_name="answers")
    participant = models.ForeignKey(Participant, on_delete=models.CASCADE)
    answer = models.TextField()
    starcolor = models.CharField(max_length=20, null=True, blank=True,)
    survey = models.ForeignKey(Survey, on_delete=models.CASCADE, related_name="answer")
    display = models.BooleanField(default=False) #if answer is partial then display is false

class EditedAnswer(Base):
    prevanswer = models.ForeignKey(Answer, on_delete=models.CASCADE)
    answer = models.TextField()
    survey = models.ForeignKey(Survey, on_delete=models.CASCADE)
    user = models.CharField(max_length=80, default="Client")
    deleted = models.BooleanField(default=False)

# class ConfidentialQuestions(Base):
#     question = models.TextField()
#     survey = models.ForeignKey(Survey, on_delete=models.CASCADE)
#     heading = models.CharField(max_length=80, null=True, blank=True)
#     comments = models.TextField(null=True, blank=True)
#
#
# class ConfidentialAnswer(Base):
#     question = models.ForeignKey(ConfidentialQuestions, on_delete=models.CASCADE)
#     participant = models.ForeignKey(Participant, on_delete=models.CASCADE)
#     answer = models.TextField()
#     display = models.BooleanField(default=False)

# class EditedConfidentialAnswer(Base):
#     prevanswer = models.ForeignKey(ConfidentialAnswer, on_delete=models.CASCADE)
#     answer = models.TextField()
#     survey = models.ForeignKey(Survey, on_delete=models.CASCADE)
#     user = models.CharField(max_length=80, default="Client")
#     deleted = models.BooleanField(default=False)


class SurveyCampaign(Base):
    participant = models.ForeignKey(Participant, on_delete=models.CASCADE)
    status = models.BooleanField(default=False)  # status if current participant have submitted survey or not
    survey = models.ForeignKey(Survey, on_delete=models.CASCADE)
    uid = models.CharField(max_length=100, blank=True, unique=True, default=uuid.uuid4)
    response = models.CharField(max_length=80, default="NORESPONSE")
    expires = models.DateTimeField(editable=False, null=True, blank=True)


class SurveyReminder(Base):
    participant = models.ForeignKey(Participant, on_delete=models.CASCADE)
    survey = models.ForeignKey(Survey, on_delete=models.CASCADE)
    survey_compaign = models.ForeignKey(SurveyCampaign, on_delete=models.CASCADE)


class FeedBackReport(Base):
    survey = models.ForeignKey(Survey, on_delete=models.CASCADE)
    heading = models.CharField(max_length=80, null=True, blank=True)
    comments = models.TextField(null=True, blank=True)
    logo = models.FileField(upload_to="companies_logo", null=True, blank=True, default=None)
    topic = models.CharField(max_length=80, null=True, blank=True)
    summary = models.CharField(max_length=80, null=True, blank=True)
    text = models.TextField(null=True, blank=True)
    status = models.CharField(max_length=80, default="Partially Completed")
    user = models.CharField(max_length=80, default="Client")
    includeconfquestion = models.BooleanField(default=True)
    noteheading = models.CharField(max_length=200, null=True, blank=True)
    notecomments = models.TextField(null=True, blank=True)
    first_name = models.CharField(max_length=255, blank=True, null=True)
    last_name = models.CharField(max_length=255, blank=True, null=True)
    title = models.CharField(max_length=255, blank=True, null=True)
    company_name = models.CharField(max_length=255, blank=True, null=True)
    currentpage = models.CharField(max_length=10, default="#step-1")
    reportgenerateat = models.DateTimeField(null=True, blank=True)
    send_feedback_report = models.BooleanField(default=False)
    mail_report_date = models.DateTimeField(blank=True, null=True,default=None)
    mail_subj = models.CharField( max_length=200, blank=True, null=True, default='Feedback report')
    mail_cont = models.TextField( blank=True, null=True, default='<p style="font-size:16px;color:#3b3b3b;font-weight:400;margin:0;line-height:20px;" id="first-text"> Please see your attached feedback report.</p><br><p style="font-size:16px;color: #3b3b3b;font-weight:400;margin:0;line-height:20px;" id="second-text"> Feel free to reach out if you have any questions.</p>')


class ReportFooter(Base):
    text = models.TextField()
    color = models.CharField(max_length=80, default='#61c1b9')
    report = models.ForeignKey(FeedBackReport, on_delete=models.CASCADE)
    frontfootercolor = models.CharField(max_length=80, default='#d7de68')


class Group(Base):
    relation = models.ManyToManyField(Relationship)
    name = models.CharField(max_length=100)
    report = models.ForeignKey(FeedBackReport, on_delete=models.CASCADE)
    anscount = models.IntegerField(default=0)
    partcount = models.IntegerField(default=0)


# class AnswerCount(Base):
#     report = models.ForeignKey(FeedBackReport, on_delete=models.CASCADE)
#     group = models.ForeignKey(Group, on_delete=models.CASCADE)
#     count = models.IntegerField(null=True, blank=True)


# class SurveyAnswer(Base):
#     class AnswersType(models.TextChoices):
#         MULTIPLE_CHOICE = "MU"
#         TEXT = "TX"
#         BOOL = "BL"

#     participent = models.ForeignKey(Participent, on_delete=models.CASCADE)
#     status = models.CharField(choices=AnswersType.choices, max_length=10, null=True)
#     question = models.ForeignKey(
#         SurveyQuestion, on_delete=models.CASCADE, related_name="possible_answers"
#     )
#     answer = models.TextField()


# class ParticipentSurveyAttempt(Base):
#     participent = models.ForeignKey(Participent, on_delete=models.CASCADE)
#     survey_attempt_count = models.PositiveSmallIntegerField(default=1)
#     is_completed = models.BooleanField(default=False)
#     success_rate = models.FloatField(null=True, blank=True)
#     finished = models.DateTimeField(null=True, blank=True, default=None)


# class ParticipentQuestionAnswer(Base):
#     attempt = models.ForeignKey(ParticipentSurveyAttempt, on_delete=models.CASCADE)
#     question = models.ForeignKey(SurveyQuestion, on_delete=models.CASCADE)
#     answer = models.ForeignKey(
#         SurveyAnswer, on_delete=models.CASCADE, null=True, blank=True
#     )


# class ParticipentAvailableSurvey(Base):
#     survey = models.ForeignKey(Survey, on_delete=models.CASCADE)
#     participent = models.ForeignKey(Participent, on_delete=models.CASCADE)
#     completed = models.BooleanField(default=False)

#
# class SurveyQuestionsView (models.Model):
#     unique_id = models.CharField(max_length=255, primary_key=True)
#     question_text = models.TextField()
#     question_id = models.IntegerField()
#     is_confidential =models.BooleanField()
#     # answers = models.TextField()
#     survey_id = models.IntegerField(default=0)
#     # participant_first_name = models.CharField(max_length=255)
#     # participant_last_name = models.CharField(max_length=255)
#     # participant__id = models.CharField(max_length=10)
#
#     class Meta:
#         managed = False
#         db_table = 'survey_question_view'