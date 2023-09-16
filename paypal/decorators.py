from functools import wraps
from django.http import HttpResponseRedirect
from django.shortcuts import render, redirect


def require_membership(function):
    @wraps(function)
    def membership_check(request, *args, **kwargs):
        import pdb

        if request.user.user_membership.status != "Active":
            pass
            # return redirect('plan')
        else:
            return function(request, *args, **kwargs)

    return membership_check
