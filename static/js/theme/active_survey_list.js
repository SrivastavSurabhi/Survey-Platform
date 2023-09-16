$('body').on('click', '.marksurvcompbtn', function(){
        jQuery(this).closest('td').find('.survey_compl_mark_popup').show();
    });
    jQuery('.survey_compl_mark_popup .closepoup,.survey_compl_mark_popup .cancelmarkcomplsury').on('click',function(){
        jQuery('.survey_compl_mark_popup').hide();
    });