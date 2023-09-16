from coach_dashboard.models import Question,Clients

questions_data = {
    "1": "this is question1",
    "2": "this is question2",
    "3": "this is question3",
}

def create_client_question(client):
    for index,question in questions_data.items():
        questions = Question.objects.create(
                    position_index = index,
                    question = question
                )
        questions.client.add(client[0])
    return Question.objects.all().values("position_index","question")