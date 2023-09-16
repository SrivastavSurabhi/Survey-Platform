from django.conf import settings
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, User
from django.core import validators
from django.db import models
# from django.utils.translation import ugettext_lazy as _
from django.utils.translation import gettext_lazy as _
from datetime import datetime, timedelta, date
import uuid


class Base(models.Model):
    created_ts = models.DateTimeField(_("Created Date"), auto_now_add=True)
    updated_ts = models.DateTimeField(_("Last Updated Date"), auto_now=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="%(app_label)s_%(class)s_created_related",
        null=True,
        blank=True,
        on_delete=models.CASCADE,
    )
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="%(app_label)s_%(class)s_updated_related",
        null=True,
        blank=True,
        on_delete=models.CASCADE,
    )

    class Meta:
        abstract = True


class UserManager(BaseUserManager):
    def create_user(self, email, username, password):
        """
        Creates and saves a User with the given email and password.
        """
        email = self.normalize_email(email)
        user = self.model(email=email, username=username)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_staffuser(self, email, username, password):
        """
        Creates and saves a staff user with the given username and password.
        """
        user = self.create_user(
            email=email,
            username=username,
            password=password,
        )
        user.is_staff = True
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password):
        """
        Creates and saves a superuser with the given username and password.
        """
        user = self.create_staffuser(email=email, username=username, password=password)
        user.username = username
        user.is_staff = True
        user.is_admin = True
        user.role = "admin"
        user.save(using=self._db)
        return user


class User(AbstractBaseUser, Base):
    USERTYPE = ((3, "client"), (2, "coach"), (1, "superuser"))
    email = models.EmailField(
        validators=[validators.validate_email], unique=True, blank=False
    )
    username = models.CharField(max_length=100, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    is_superuser = models.BooleanField(blank=True, null=True, default=False)
    user_type = models.IntegerField(choices=USERTYPE, default=2)
    is_deleted = models.BooleanField(default=False)

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["email"]
    objects = UserManager()

    def __str__(self):
        return self.username

    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        return True

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        return True

    @property
    def client_full_name(self):
        try:
            return str(self.clients.first_name) + " " + str(self.clients.last_name)
        except:
            return None

    @property
    def has_profile_image(self):
        try:
            if self.user_avatar:
                return True
        except:
            return False

    @property
    def coach_full_name(self):
        try:
            return str(self.coaches.first_name) + " " + str(self.coaches.last_name)
        except:
            return None

    @property
    def coach_exist(self):
        try:
            if self.coaches:
                return True
            else:
                return None
        except:
            return None

    @property
    def user_title(self):
        try:
            return str(self.coaches.title)
        except:
            try:
                return str(self.clients.title)
            except:
                return None
            return None

    @property
    def user_company(self):
        try:
            return str(self.coaches.company_name)
        except:
            return None

    @property
    def user_company_url(self):
        try:
            return str(self.coaches.company_url)
        except:
            return None

    @property
    def user_email_notify(self):
        try:
            return self.coaches.is_email_notify
        except:
            return None

    @property
    def is_membership_active(self):
        try:
            if self.user_membership.status == "Active":
                return True
            else:
                return False
        except:
            return False


class Relationship(models.Model):
    relation = models.TextField(unique=True)

    def __str__(self):
        return str(self.relation)


def user_directory_path(instance, filename):
    return f"User_Profile/+user_{instance.user.id}/{filename}"


class UserAvatar(Base):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="user_avatar"
    )
    avatar = models.FileField(
        upload_to=user_directory_path,
        default="/static/images/theme/default.png",
    )
    # avatar = ImageRatiBaseUserManageroField("image_field", "120x100", allow_fullsize=True,)


class Coaches(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True)
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    title = models.CharField(max_length=255, blank=True, null=True)
    company_name = models.CharField(max_length=255, blank=True, null=True)
    company_url = models.CharField(max_length=255, blank=True, null=True)
    is_email_notify = models.BooleanField(default=True)
    frontfootercolor = models.CharField(max_length=80, default='#d7de68')
    color = models.CharField(max_length=80, default='#61c1b9')
    paymentmode = models.CharField(max_length=30, default='Auto')
    logo = models.FileField(upload_to=user_directory_path, null=True, blank=True, default=None)
    skipplan = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)

def user_client_directory_path(instance, filename):
    coach_id = instance.coach.id
    # userprofile = coach_{coach_id}/client_{instance.id}/{filename}
    return f"coach_{coach_id}/client_{instance.id}/{filename}"


def user_client_queans_path(instance, filename):
    return f"coach/client_queans/{filename}"


class ClientDatatableView (models.Model):
    unique_id = models.CharField(max_length=255, primary_key=True)
    coach_id = models.IntegerField()
    mode = models.BooleanField()
    client_id = models.IntegerField()
    complete_name = models.CharField(max_length=512)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    company_name = models.CharField(max_length=255)
    survey_status = models.CharField(max_length=10)
    survey_report_status = models.CharField(max_length=80)
    survey_report_sent_date = models.DateTimeField()
    complete_survey_report_status = models.CharField(max_length=255)
    profile_img = models.CharField(max_length=512)

    class Meta:
        managed = False
        db_table = 'client_datatable_view'


class Clients(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True)
    coach = models.ForeignKey(Coaches, on_delete=models.CASCADE, null=True, default=None)
    email = models.EmailField(validators=[validators.validate_email], blank=False)
    first_name = models.CharField(max_length=255, blank=True, null=True)
    last_name = models.CharField(max_length=255, blank=True, null=True)
    phone = models.CharField(max_length=255, blank=True, null=True)
    address = models.TextField(null=True, blank=True)
    company_name = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=255, blank=True, null=True)
    state = models.CharField(max_length=255, blank=True, null=True)
    country = models.CharField(max_length=255, blank=True, null=True)
    company_url = models.CharField(max_length=255, blank=True, null=True)
    company_phone = models.CharField(max_length=255, blank=True, null=True)
    title = models.CharField(max_length=255, blank=True, null=True)
    company_email = models.EmailField(validators=[validators.validate_email], null=True, blank=True)
    company_address = models.TextField(null=True, blank=True)
    zip = models.IntegerField(null=True, blank=True)
    profile_img = models.FileField(
        upload_to=user_client_directory_path,
        default="static/images/theme/default.png",
    )
    intake_status = models.BooleanField(default=False)
    mode = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    queans1 = models.CharField(max_length=255, blank=True, null=True)
    queans2 = models.CharField(max_length=255, blank=True, null=True)
    queans3 = models.CharField(max_length=255, blank=True, null=True)
    queans4 = models.CharField(max_length=255, blank=True, null=True)
    queans5 = models.CharField(max_length=255, blank=True, null=True)
    queans6 = models.CharField(max_length=255, blank=True, null=True)
    queans7 = models.CharField(max_length=255, blank=True, null=True)
    queans8 = models.CharField(max_length=255, blank=True, null=True)
    queans9 = models.CharField(max_length=255, blank=True, null=True)
    queans10 = models.CharField(max_length=255, blank=True, null=True)
    queans11 = models.CharField(max_length=255, blank=True, null=True)
    queans12 = models.CharField(max_length=255, blank=True, null=True)
    queans13 = models.CharField(max_length=255, blank=True, null=True)
    queans14 = models.CharField(max_length=255, blank=True, null=True)
    queans15 = models.CharField(max_length=255, blank=True, null=True)
    queans16 = models.CharField(max_length=255, blank=True, null=True)
    queans17 = models.CharField(max_length=255, blank=True, null=True)
    queans18 = models.CharField(max_length=255, blank=True, null=True)
    queans19 = models.CharField(max_length=255, blank=True, null=True)
    queans20 = models.CharField(max_length=255, blank=True, null=True)
    queans21 = models.CharField(max_length=255, blank=True, null=True)
    queansfile = models.FileField(
        upload_to=user_client_queans_path,
        default="/static/images/theme/default.png",
    )


def user_client_document_directory_path(instance, filename):
    coach_id = instance.client.coach.id
    # userprofile = coach_{coach_id}/client_{instance.id}/{filename}
    return f"coach_{coach_id}/document_client_{instance.client.id}/{filename}"


class ClientDocument(models.Model):
    client = models.ForeignKey(Clients, on_delete=models.CASCADE)
    filename = models.CharField(max_length=255, blank=True, null=True)
    document = models.FileField(
        upload_to=user_client_document_directory_path, default=None
    )
#
# class Participent(models.Model):
#     coach = models.ForeignKey(Coaches, on_delete=models.CASCADE)
#     email = models.EmailField(
#         validators=[validators.validate_email], unique=True, blank=False
#     )
#     first_name = models.CharField(max_length=255, blank=True, null=True)
#     last_name = models.CharField(max_length=255, blank=True, null=True)
#     relationship = models.ForeignKey(
#         "Relationship", null=True, on_delete=models.CASCADE
#     )


class Participant(Base):
    client = models.ForeignKey(Clients, on_delete=models.CASCADE)
    email = models.EmailField(validators=[validators.validate_email], blank=False)
    first_name = models.CharField(max_length=255, blank=True, null=True)
    last_name = models.CharField(max_length=255, blank=True, null=True)
    relationship = models.ForeignKey(
        Relationship, null=True, on_delete=models.CASCADE
    )
    is_deleted = models.BooleanField(default=False)
    class Meta:
        ordering = ["relationship"]


class PasswordReset(Base):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    code = models.CharField(max_length=20, unique=True)
    is_used = models.BooleanField(default=False)


class AddPaticipantByOther(models.Model):
    name = models.CharField(max_length=50, default=None)
    subject = models.CharField(max_length=50, default=None, null=True)
    message = models.CharField(max_length=50, default=None, null=True)
    code = models.CharField(max_length=200, unique=True)
    is_used = models.BooleanField(default=False)
    email = models.EmailField(validators=[validators.validate_email])
    coach = models.ForeignKey(Coaches, on_delete=models.CASCADE, null=True, default=None)
    status = models.BooleanField(default=False)


class ClientInvitationCode(Base):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    code = models.CharField(max_length=20, unique=True)
    is_used = models.BooleanField(default=False)
    email = email = models.EmailField(validators=[validators.validate_email])
    is_participant = models.BooleanField(default=False)


class Coachrefercode(Base):
    coach = models.OneToOneField(
        Coaches, on_delete=models.CASCADE, related_name="coach_refer"
    )
    code = models.CharField(max_length=20, unique=True)
    is_active = models.BooleanField(default=True)


class IntakeQuestions(Base):
    question = models.TextField()


class IntakeIstruction(Base):
    Instruction = models.TextField()


class CoachIntakeQuestions(Base):
    question = models.TextField()
    coach = models.ForeignKey(Coaches, on_delete=models.CASCADE, null=True, default=None)
    client = models.ForeignKey(Clients, on_delete=models.CASCADE)


class ClientIntake(Base):
    coach = models.ForeignKey(Coaches, on_delete=models.CASCADE, null=True, default=None)
    instructions = models.TextField(null=True, blank=True)
    client = models.ForeignKey(Clients, on_delete=models.CASCADE)
    logo = models.FileField(upload_to=user_directory_path, null=True, blank=True, default=None)
    coachimg = models.FileField(upload_to=user_directory_path, null=True, blank=True, default=None)


class ClientIntakeFiles(Base):
    file = models.FileField(
        upload_to=user_client_directory_path, default=None)
    client = models.ForeignKey(Clients, on_delete=models.CASCADE)
    coach = models.ForeignKey(Coaches, on_delete=models.CASCADE, null=True, default=None)


class ClientIntakeAnswer(Base):
    question = models.ForeignKey(CoachIntakeQuestions, on_delete=models.CASCADE)
    client = models.ForeignKey(Clients, on_delete=models.CASCADE)
    answer = models.TextField()


class Plan(models.Model):
    title = models.CharField(max_length=255, unique=True)
    prizepersurvey = models.IntegerField()
    noofsurvey = models.IntegerField(default=0)
    monthlylicencefee = models.IntegerField(default=0)
    annuallicencefee = models.IntegerField(default=0)
    servicesinclude = models.TextField()
    color = models.CharField(max_length=25)
    mode = models.CharField(max_length=30, default='Yearly')

    def __str__(self):
        return self.title

    def totalcost(self):
        return (self.prizepersurvey * self.noofsurvey) + self.annuallicencefee + self.monthlylicencefee


class UserPlan(models.Model):
    coach = models.ForeignKey(Coaches, on_delete=models.CASCADE)
    plan = models.ForeignKey(Plan, on_delete=models.CASCADE)
    created_ts = models.DateTimeField(_("Created Date"), auto_now_add=True, editable=True)

    def valid(self):
        if self.plan.mode == 'Yearly':
            return datetime.now()+timedelta(days=365)
        else:
            return datetime.now()+timedelta(days=30)


    def __repr__(self):
        return '%s' % self.coach.first_name


class SurveyUpgraded(models.Model):
    coach = models.ForeignKey(Coaches, on_delete=models.CASCADE)
    totalfee = models.IntegerField()
    persurveyprize = models.IntegerField()
    noofsurvey = models.IntegerField()
    created_ts = models.DateTimeField(_("Created Date"), auto_now_add=True)


class UserPlanInfo(models.Model):
    coach = models.ForeignKey(Coaches, on_delete=models.CASCADE, related_name= "userplaninfoCoach")
    uplan = models.ForeignKey(UserPlan, on_delete=models.CASCADE)
    # status = models.BooleanField(default=True)
    totalfee = models.IntegerField()
    persurveyprize = models.IntegerField()
    annuallicencefee = models.IntegerField(default=0)
    monthlylicencefee = models.IntegerField(default=0)
    surveyused = models.IntegerField(default=0)
    noofsurvey = models.IntegerField()
    surveyupgraded = models.IntegerField(default=0)
    servicesinclude = models.TextField()
    title = models.CharField(max_length=255)
    addedsurvey = models.ManyToManyField(SurveyUpgraded)
    type = models.CharField(max_length=255, default="yearly")
    created_ts = models.DateTimeField(_("Created Date"), auto_now_add=True)

    def status(self):
        if self.uplan.valid().date() < date.today():
            return False
        else:
            return True

    def surveyleft(self):
        return (self.noofsurvey + self.surveyupgraded) - self.surveyused

    def valid(self):
        if self.type == 'yearly':
            return self.created_ts+timedelta(days=365)
        else:
            return self.created_ts+timedelta(days=30)

    def licencefee(self):
        return self.totalfee - (self.noofsurvey*self.persurveyprize)


class Notification(models.Model):
    coach = models.ForeignKey(Coaches, on_delete=models.CASCADE, null=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    read = models.BooleanField(default=False)


class ClientCampaign(Base):
    client = models.ForeignKey(Clients, on_delete=models.CASCADE)
    status = models.BooleanField(default=False)
    uid = models.CharField(max_length=100, blank=True, unique=True, default=uuid.uuid4)
   

