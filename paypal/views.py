from django.shortcuts import render, redirect
from django.conf import settings
from django.views.generic import TemplateView
from django.views.generic import View
from paypal.models import *
from django.conf import settings
# from paypalcheckoutsdk.core import LiveEnvironment
# from paypalcheckoutsdk.core import PayPalHttpClient
# from paypalcheckoutsdk.core import SandboxEnvironment
# from paypalcheckoutsdk.orders import OrdersCaptureRequest, OrdersCreateRequest
from django.http import HttpResponse, JsonResponse
import datetime


class Payment(View):
    def get(self, request, plan):
        if request.user.is_authenticated:
            print(request.user.id)
            return render(
                request,
                "paypal/payments.html",
                {"PAYPAL_CLIENT_ID": settings.PAYPAL_CLIENT_ID, "plan": str(plan)},
            )
        else:
            return redirect("logins")


class PayPalClient:
    def __init__(self):
        self.client_id = settings.PAYPAL_CLIENT_ID
        self.client_secret = settings.PAYPAL_CLIENT_SECRET


class CaptureOrder(PayPalClient):
    def capture_order(self, order_id, req_user):
        """Method to capture order using order_id"""
        request = OrdersCaptureRequest(order_id)
        response = False

        """Set up and return PayPal Python SDK environment with PayPal access credentials.
                   This sample uses SandboxEnvironment. In production, use LiveEnvironment."""
        if settings.PAYPAL_SANDBOX_USERNAME == req_user.username:
            self.client_id = settings.PAYPAL_SANDBOX_CLIENT_ID
            self.client_secret = settings.PAYPAL_SANDBOX_CLIENT_SECRET
            self.environment = SandboxEnvironment(
                client_id=self.client_id, client_secret=self.client_secret
            )
        else:
            self.environment = LiveEnvironment(
                client_id=self.client_id, client_secret=self.client_secret
            )

        """ Returns PayPal HTTP client instance with environment that has access
            credentials context. Use this instance to invoke PayPal APIs, provided the
            credentials have access. """
        self.client = PayPalHttpClient(self.environment)

        try:
            response = self.client.execute(request)
        except Exception as e:
            print(e)
            logging.error(e)
        """ 4. Save the capture ID to your database.
        Implement logic to save capture to your database for future reference."""
        if response:
            print("Status Code: ", response.status_code)
            print("Status: ", response.result.status)
            print("Order ID: ", response.result.id)
            print("Links: ")
        return response


class PaypalTransactionCapture(View):
    def capture_transaction(self, request):
        order_id = request.data.get("order_id")
        response = CaptureOrder().capture_order(order_id, req_user=request.user)
        user = request.user

        if response:
            res_content = {"paypal_response": response.result._dict}
        else:
            res_content = {"paypal_response": response}
        transaction_history = PaypalTranscations.objects.create(
            user=user, order_id=order_id, payment_meta=res_content
        )

        try:
            if response:
                if response.status_code == 201:
                    transaction_history.status = "completed"
                    res_content["message"] = "Order captured successfully."
                    transaction_history.payment_meta = res_content
                    transaction_history.save()
                    messages.success(request, "transaction completed")
                    return render(request, self.template_name, {})

                else:
                    res_content["message"] = "Order already captured."
                    transaction_history.status = "failed"
                    transaction_history.payment_meta = res_content
                    transaction_history.save()
                    data = {"status": False, "message": "transaction failed"}
                    messages.error(request, "transaction failed")
                    return render(request, self.template_name, {})
            else:
                res_content["message"] = "Payment failed please contact support."
                transaction_history.status = "failed"
                transaction_history.payment_meta = res_content
                transaction_history.save()
                messages.error(request, "transaction failed")
                return render(request, self.template_name, {})
        except Exception as e:
            meta = f"paypal payment error {e}."
            res_content["message"] = meta
            transaction_history.payment_meta = res_content
            transaction_history.status = "failed"
            transaction_history.save()
            messages.error(request, "payment failed please contact support team")
            return render(request, self.template_name, {})


class CreatePayment(TemplateView):
    def post(self, request, plan, *args, **kwargs):

        if request.is_ajax and request.user.is_authenticated:
            try:

                environment = SandboxEnvironment(
                    client_id=settings.PAYPAL_CLIENT_ID,
                    client_secret=settings.PAYPAL_CLIENT_SECRET,
                )
                print(settings.PAYPAL_CLIENT_ID)
                print(settings.PAYPAL_CLIENT_SECRET)
                client = PayPalHttpClient(environment)
                create_order = OrdersCreateRequest()
                create_order.request_body(
                    {
                        "intent": "CAPTURE",
                        "purchase_units": [
                            {
                                "amount": {
                                    "currency_code": "USD",
                                    "value": int(plan),
                                    "breakdown": {
                                        "item_total": {
                                            "currency_code": "USD",
                                            "value": int(plan),
                                        }
                                    },
                                },
                            }
                        ],
                    }
                )

                response = client.execute(create_order)

                data = response.result.__dict__["_dict"]
                return JsonResponse(data)
            except:
                return JsonResponse({"details": "invalide request"})


class PaypalTransactionCaptureView(View):
    def post(self, request, order_id, plan, *args, **kwargs):

        if request.is_ajax and request.user.is_authenticated:
            try:
                capture_order = OrdersCaptureRequest(order_id)
                environment = SandboxEnvironment(
                    client_id=settings.PAYPAL_CLIENT_ID,
                    client_secret=settings.PAYPAL_CLIENT_SECRET,
                )
                client = PayPalHttpClient(environment)
                response = client.execute(capture_order)
                data = response.result.__dict__["_dict"]
                if response.status_code == 201:

                    PaymentTranscations.objects.create(
                        user_id=request.user.id,
                        amount=int(plan),
                        order_id=order_id,
                        status="completed",
                        payment_meta=data,
                        payment_mode="paypal",
                    )
                    today = datetime.datetime.now().date()
                    expiredate = today + datetime.timedelta(days=365)
                    if MemberShip.objects.filter(user_id=request.user.id).exists():
                        memberobj = MemberShip.objects.get(user=request.user.id)
                        new_expiredate = memberobj.expire_date + datetime.timedelta(
                            days=365
                        )
                        memberobj.expire_date = new_expiredate
                        memberobj.renew_date = datetime.datetime.now()
                        memberobj.status = "Active"
                        memberobj.save()
                    else:
                        MemberShip.objects.create(
                            user_id=request.user.id,
                            status="Active",
                            expire_date=expiredate,
                        )
                else:
                    PaymentTranscations.objects.create(
                        user_id=request.user.id,
                        amount=int(plan),
                        order_id=order_id,
                        status="failed",
                        payment_meta=data,
                        payment_mode="paypal",
                    )
                print(data)
                return JsonResponse(data)
            except:
                return JsonResponse({"details": "invalide request"})
