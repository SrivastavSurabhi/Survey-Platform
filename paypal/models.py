from django.db import models
from core.models import User, Base
# from django.contrib.postgres.fields import JSONField
from jsonfield import JSONField

class Plan(models.Model):
    PLAN_TYPE = (
        ("basic", "basic"),
        ("intermediate", "intermediate"),
        ("pro", "pro"),
    )
    plan_type = models.CharField(max_length=50, choices=PLAN_TYPE, default="basic")
    amount = models.DecimalField(default=0, decimal_places=2, max_digits=10)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.plan_type


class PaymentTranscations(models.Model):
    STATUS = (("failed", "failed"), ("completed", "completed"))
    PAYMENT_MODE = (("paypal", "paypal"), ("stripe", "stripe"), ("other", "other"))
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.FloatField(blank=True, null=True)
    order_id = models.CharField(max_length=255)
    status = models.CharField(max_length=40, choices=STATUS, default="failed")
    payment_meta = JSONField(null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    payment_mode = models.CharField(
        max_length=40, choices=PAYMENT_MODE, default="paypal"
    )

    def __str__(self):
        return self.user.username


class MemberShip(Base):
    STATUS = (("Active", "Active"), ("InActive", "InActive"), ("Suspend", "Suspend"))
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="user_membership"
    )
    status = models.CharField(max_length=40, choices=STATUS, default="InActive")
    renew_date = models.DateTimeField(null=True, blank=True)
    expire_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.user.username
