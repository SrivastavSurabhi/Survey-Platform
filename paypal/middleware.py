from django.utils.deprecation import MiddlewareMixin
from django.http import HttpResponseRedirect
from django.shortcuts import render, redirect, reverse


class MembershipMiddleware(MiddlewareMixin):
    @staticmethod
    def process_request(request):
        if request.user.is_authenticated:
            try:
                if (
                    request.path == "/plan/"
                    or request.user.user_membership.status == "Active"
                ):
                    pass
                else:
                    return redirect("plan")
            except:
                pass
