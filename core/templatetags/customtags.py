from datetime import datetime, timedelta
from django import template
register = template.Library()


@register.simple_tag
def dayafter3week():
    return (datetime.now().date()+timedelta(days=21)).strftime("%b %d")


@register.simple_tag
def countdays(date1, date2):
    return (datetime.strptime(date2, '%B %d, %Y') - datetime.strptime(date1, '%B %d, %Y')).days


@register.simple_tag
def Check_manager(group, ans):
    val = False
    for grps in group.all():
            for g in grps.relation.all():
                if g.relation == 'Manager':
                    val = True
    if val == False:
        manres = True
        for a in ans:
            if a[0].participant.relationship.relation == 'Manager':
                manres = False
        val = manres
    return val


@register.simple_tag
def shufflegroups(group):
    return group.order_by('-id')


@register.simple_tag
def Answer_length(ansobj, grp):
    count = 0
    for ans in ansobj:
        try:
            # if grp == "Manager":
            #     if ans.participant.relationship.relation == "Manager":
            #         count = count+1
            # else:
                for g in grp.relation.all():
                    if ans['participant__relationship__relation'] == g.relation:
                        count = count + 1
        except:
            # for g in grp.relation.all():
            #     if ans.participant.relationship.relation == g.relation:
            #         count = count+1
            pass
    return count