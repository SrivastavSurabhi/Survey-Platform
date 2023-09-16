from django.shortcuts import render
from core.models import Coaches,User,Relationship
from coach_dashboard.models import Question,QuestionAnswer
from django.http import JsonResponse
from django.conf import settings
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from coach_dashboard import questions_scipts

def Client_intake_process(request,client_id):
    client = Clients.objects.filter(id=client_id)
    if not client:
        return JsonResponse({'Error':'Link is Not valid'})

    if request.method == "POST":
        email = request.POST.get('email')
        organization = request.POST.get('organization')
        name = request.POST.get('name')
        title = request.POST.get('title')
        phone = request.POST.get('phone')
        city = request.POST.get('city')
        state = request.POST.get('state')
        zip_code = request.POST.get('zip_code')
        docs = request.FILES.get('docs')

        client.update(
            organization=organization,Full_name=name,
            title=title,phone=phone,city=city,state=state,
            zip_code=zip_code,docs=docs
            )
        
        # save question answer here 
        # response

    Question = Question.objects.all().values("position_index","question")
    if len(Question) < 1:
        expexted_question = questions_scipts.create_client_question(client)
        return render(request,"coatch/client_intake_process",{"questions":expexted_question})
    return render(request,"coatch/client_intake_process",{"questions":Question})

        
        







