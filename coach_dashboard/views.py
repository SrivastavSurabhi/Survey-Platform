from django.shortcuts import render
from core.models import Coaches, User, Relationship
from django.http import JsonResponse
from django.conf import settings
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail


def Coaches_add_Client(request):
    if request.method == "POST":
        coach = Coaches.objects.filter(user=request.user)
        if not coach:
            return JsonResponse({'Error': 'coach not exist'})
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        email = request.POST.get('email')
        phone = request.POST.get('email')
        Address = request.POST.get('Address')
        company_name = request.POST.get('company_name')
        company_url = request.POST.get('company_url')
        company_Address = request.POST.get('company_Address')

        client = Clients.objects.create(
            coach=coach, email=email, first_name=first_name,
            last_name=last_name, phone=phone, Address=Address,
            company_name=company_name, company_url=company_url,
            company_Address=company_Address
        )

        url = f"{settings.BASE_DOMAIN}/coach/client_intake/process/{client.id}"
        email_body = 'Please Fill that form : ' + str(url)
        message = Mail(
            from_email=settings.EMAIL_HOST_USER,
            to_emails=[client.email],
            subject="client intake form",
            html_content=email_body,
        )
        sendgrid_client = SendGridAPIClient(settings.SENDGRID_API_KEY)
        response = sendgrid_client.send(message)
        if response:
            return JsonResponse({'Success': 'Client mailed'})
        else:
            return JsonResponse({'Error': 'mail Failed'})

        return JsonResponse({'Success':'Client Add succesfully'})
    return render(request, "coatch/add_client")


def Coaches_add_participent(request):
    if request.method == "POST":
        coach = Coaches.objects.filter(user=request.user)
        if not coach:
            return JsonResponse({'Error': 'coach not exists'})
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        email = request.POST.get('email')
        relationship = request.POST.get('email')

        client = Clients.objects.create(
            coach=coach, email=email,
            first_name=first_name,
            last_name=last_name
        )
        return JsonResponse({'Success': 'Participant Add succesfully'})
    return render(request, "coatch/add_participent")



def survey_send_to_participent(request,s_id,p_id):
    survey = Survey.objects.filter(id=s_id)
    if not survey:
        return JsonResponse({'Error': 'survey does not exist'})
    
    participent = Participent.objects.filter(id=p_id)
    
    if not participent:
        return JsonResponse({'Error': 'participant does not exist'})


    url = f"{settings.BASE_DOMAIN}/survey/send_participent/{survey[0].id}/" 
    email_body = 'here is your survey: ' + str(url)
    message = Mail(
        from_email=settings.EMAIL_HOST_USER,
        to_emails=[participent[0].email],
        subject="survey send to participent",
        html_content=email_body,
    )
    sendgrid_client = SendGridAPIClient(settings.SENDGRID_API_KEY)
    response = sendgrid_client.send(message)
    if response:
        survey[0].status = Survey.SurveyStatus.ACTIVE
        survey.save()
        return JsonResponse({'Success': 'survey mailed'})

    return JsonResponse({'Error': 'mail Failed'})