import logging
from core import models as core_model
from core.models import *
from survey.models import *
from django.template.loader import render_to_string
import sendgrid
from sendgrid.helpers.mail import Mail, Email, To, Content, ReplyTo
from django.db.models import Q
import base64
import requests
import datetime
from django.utils import timezone
import pytz


logger = logging.getLogger(__name__)
authkey = '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'


def my_scheduled_job():
    try:
        for sur in Survey.objects.filter(end_datetime__lte=datetime.datetime.now(pytz.UTC), status= "AT"):
            sur.status = 'CT'
            sur.save()
    except:pass

    try:     
        # emaillist = ['vikas@creativebuffer.com', 'suraj@creativebuffer.com',
        #                      'pooja@creativebuffer.com']  # to remove
        survey = Survey.objects.filter(~Q(emailreminder='NOREMINDER'), Q(status='AT')) #| Q(status='RO'), )
        for sur in survey:
            try:
            # if sur.creator.email in emaillist:  # to remove
                days = datetime.datetime.now(pytz.UTC).date() - sur.start_datetime.date()
                if (timezone.localtime(datetime.datetime.now(pytz.UTC), pytz.timezone('America/New_York')).date() != timezone.localtime(sur.end_datetime.replace(tzinfo=pytz.utc), pytz.timezone('America/New_York')).date()):
                    if (sur.whenemailreminder == 'WEEKLY'):
                        if days.days % 7 == 0:  # to change 2 with 7                        
                            actual_send(sur)
                        else:
                            if timezone.localtime(sur.end_datetime.replace(tzinfo=pytz.utc), pytz.timezone('America/New_York')).date() - timedelta(hours=48, minutes=0) == timezone.localtime(datetime.datetime.now(pytz.UTC), pytz.timezone('America/New_York')).date() or days.days % 7 == 0:
                                actual_send(sur)
            except:
                # sg = sendgrid.SendGridAPIClient(api_key=authkey)
                # message = Mail(from_email='shivani@leadershiprealitycheck.com', to_emails='shivani@creativebuffer.com', subject="Reminder: testing",
                #             html_content='<strong>not working</strong>')
                # sg.send(message)
                logger.info('in try')
    except:
        # sg = sendgrid.SendGridAPIClient(api_key=authkey)
        # message = Mail(from_email='shivani@leadershiprealitycheck.com', to_emails='shivani@creativebuffer.com', subject="Reminder: testing",
        #                html_content='<strong>not working</strong>')
        # sg.send(message)
        print('something wrong')
        logger.info('something wrong')


def actual_send(sur):    
    sendername = sur.Survey_client.coach.first_name
    senderemail = sur.creator.coaches.first_name + sur.creator.coaches.last_name + '@leadershiprealitycheck.com'
    for i in SurveyCampaign.objects.filter(survey=sur, status=False):
        sur_uid = i
        uid = sur_uid.uid
        toemail = i.participant.email
        sg = sendgrid.SendGridAPIClient(api_key=authkey)
        from_email = Email(senderemail)
        to_email = To(toemail)
        try:
            image = UserAvatar.objects.get(user=sur.Survey_client.coach.user).avatar
            src = 'https://www.leadershiprealitycheck.com/' + image.url
            bs64img = 'data:image/{};base64,'.format(src.split('.')[-1]) + str(
                base64.b64encode(requests.get(src).content).decode())
            img = '<img src="' + src + '" style="height: 50px;width: 50px;" >'
        except:
            img = ''

        try:
            enddate = timezone.localtime(sur.end_datetime.replace(tzinfo=pytz.utc), pytz.timezone('America/New_York')).strftime("%B %d")
        except:
            enddate = (timezone.localtime(sur.start_datetime.replace(tzinfo=pytz.utc), pytz.timezone('America/New_York')) + timedelta(21)).strftime("%B %d")

        if sur.rem_inst_top == None:
            inst_top = '''<p style="font-size:14px;color: #3b3b3b; font-weight:400;line-height:20px; "><span 
            class="first-text">This is a reminder to provide feedback for {} {} by </span> <span class="date-text">{}
            </span><input type="date" id="datepicker" class="datepicker" class="datepicker" style="display: none;" />.<span class="second-text"> Click the 
            button below to get started.</span></p>'''.format(
                sur.Survey_client.first_name, sur.Survey_client.last_name, enddate)
        else:
            inst_top = sur.rem_inst_top

        if sur.rem_inst_bottom == None:
            inst_btm = '''<p style="font-size:14px;color: #3b3b3b;display: block;width: 100%; font-weight:400;line-height:20px; ">Please reach out if you have any questions.</p>
                                             <p style="font-size:14px;color: #3b3b3b;display: block;width: 100%; font-weight:400;line-height:20px; ">Best regards,</p>'''
        else:
            inst_btm = sur.rem_inst_bottom
        
        replyto = ReplyTo(sur.Survey_client.coach.user.email)
        message = Mail(from_email=from_email, to_emails=to_email, subject="Reminder: Feedback Survey",
                       html_content=Content("text/html", render_to_string("core/theme/reminder_mail.html", ).format(
                           core_model.Participant.objects.get(email=toemail, client=sur.Survey_client).first_name, inst_top, sur.instructions,
                           'https://www.leadershiprealitycheck.com/survey-to-response/' + str(i.uid),
                           inst_btm, sendername, sur.Survey_client.coach.title,
                           sur.Survey_client.coach.company_name, sur.Survey_client.coach.user.email, img)))
        try:
            if (sur.emailreminder == 'NORESPONSE'):
                if i.response == 'NORESPONSE':
                    sg.send(message)
                    SurveyReminder.objects.create(participant=i.participant, survey=i.survey, survey_compaign=i)
            elif (sur.emailreminder == 'PARTIALRESPONSE'):
                if i.response == 'PARTIALRESPONSE':
                    sg.send(message)
                    SurveyReminder.objects.create(participant=i.participant, survey=i.survey, survey_compaign=i)
            else:
                if i.response != 'Complete':
                    sg.send(message)
                    SurveyReminder.objects.create(participant=i.participant, survey=i.survey, survey_compaign=i)
            
            # dummymessage = Mail(from_email='shivani@leadershiprealitycheck.com', to_emails='shivani@creativebuffer.com', subject="Reminder: testing",
            #                 html_content='<strong>working</strong>')
            # sg.send(dummymessage)
            print('mail sent')
            logger.info('mail sent')
        except Exception as e:
            print('mail not sent')
            logger.info('mail not sent')

  

