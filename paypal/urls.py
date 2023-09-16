from django.urls import path
from paypal import views
from django.contrib.auth.decorators import login_required


urlpatterns = [
    path("<plan>", views.Payment.as_view(), name="payment"),
    path("create/<plan>", views.CreatePayment.as_view(), name="payment-create"),
    path(
        "transaction/<order_id>/<plan>",
        views.PaypalTransactionCaptureView.as_view(),
        name="trans-create",
    ),
]
