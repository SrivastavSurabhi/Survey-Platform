$(document).ready(function() {
    // Create Survey jQuery
		function getCookie(c_name)
		{
					if (document.cookie.length > 0)
					{
						c_start = document.cookie.indexOf(c_name + "=");
						if (c_start != -1)
						{
							c_start = c_start + c_name.length + 1;
							c_end = document.cookie.indexOf(";", c_start);
							if (c_end == -1) c_end = document.cookie.length;
							return unescape(document.cookie.substring(c_start,c_end));
						}
					}
				return "";
        }
    
    $('.starcheckbox').each(function(){
        if(this.checked) {
            $(this).prev('.star_checkbox_wrp i').addClass('svg_color');
            $(this).closest('.star_checkbox_wrp').find('input[type="hidden"]').attr("survyfavselval",1);
            $(this).prop("checked", true);      
        } else {
            $(this).prev('.star_checkbox_wrp i').removeClass('svg_color');
            $(this).closest('.star_checkbox_wrp').find('input[type="hidden"]').attr("survyfavselval",0);
            $(this).prop("checked", false);
        }
    });

    var fav;
    $('.starcheckbox').on("click", function() {
        $(this).prev('.star_checkbox_wrp i').toggleClass('svg_color');
        if($(this).closest('.copy_past_surv_wrp').hasClass('favourite_survey_wrp')) {
            jQuery('.copy_past_tbl td').hide();
            jQuery('.copy_past_tbl td').each(function(){
                var favcheck = jQuery(this).find('.fa');
                if(favcheck.hasClass('svg_color')) {
                    jQuery(this).closest('td').show();
                }
            });
        }
        if(this.checked) {
           $(this).closest('.star_checkbox_wrp').find('input[type="hidden"]').attr("survyfavselval",1);
            fav = $(this).closest('.star_checkbox_wrp').find('input[type="hidden"]').attr('survyfavselval');
            $(this).prop("checked", true);
            $('#fail').css("display", "none");
            $('#suc').css("display", "block");
        } else {
            $(this).closest('.star_checkbox_wrp').find('input[type="hidden"]').attr("survyfavselval",0);
            fav = $(this).closest('.star_checkbox_wrp').find('input[type="hidden"]').attr('survyfavselval');
            $(this).prop("checked", false);
            $('#suc').css("display", "none");
            $('#fail').css("display", "block");
        }
        var data = new FormData($().get(0));
        data.append('favourite', fav);
        var endpoint = $(this).closest('.star_checkbox_wrp').find('input[type="hidden"]').val();
        var csrftoken = getCookie('csrftoken');
        $.ajax({
            type: "POST",
            headers: {'X-CSRFToken': csrftoken},
            url: endpoint,
            data: data,
            processData: false,
            contentType: false,
            dataType: "json",
            success:function(data) {
                if(data['success']){		                    
                    $('.copypastsucc_popup').find('h2').text(data['success']);
                    $('.copypastsucc_popup').show();
                    modalShow(true);
                  
                }else{
                    
                    $('.copypastsucc_popup').find('h2').text(data['fail']);
                    $('.copypastsucc_popup').show();
                    modalShow(true);
                }
            }
        });
    });

    $('.copypastsucc_popup .closepoup').on('click',function(){
        $('.copypastsucc_popup').hide();
        modalShow(false);
    });


    jQuery('.cmn_sitepopup .closepoup').on('click',function(){
        $('#takeothername').fadeOut();
        modalShow(false);
	});

    jQuery('.cmn_site_inn_popup .closepoup').on('click',function(){
        $('#creatingsurvey').fadeOut();
        modalShow(false);
	});


    jQuery('#surveyname').focus(function () {
        jQuery('#sureynameerr').text('');
    });
        
    jQuery('#surveycat').on('change', function() {
        jQuery('#sureynameerr').text('');
    });

    jQuery('#surveyname').focusout(function () {
           var surveyname = jQuery(this).val();
        if(surveyname == "" || surveyname == null) {
            jQuery('#sureynameerr').text('Please enter survey name');
        } else {
             jQuery('#sureynameerr').text('');
        }
     });

     $('#copy_past_all .copysurvey').on("click", function(){
       
        url = $(this).closest('div').children('label').eq(1).find(".copysurveyidall").val()
        var csrftoken = getCookie('csrftoken');
         $.ajax({
                        type: "POST",
                        headers: {'X-CSRFToken': csrftoken},
                        url: url,
                        processData: false,
                        contentType: false,
                        dataType: "json",
                        success:function(data) {
                            window.location.href = url
                        }
                    });
    });

     $('#copy_past_recent .copysurvey').on("click", function(){
         url = $(this).closest('div').children('label').eq(1).find(".copysurveyidrec").val()
         var csrftoken = getCookie('csrftoken');
         $.ajax({
                        type: "POST",
                        headers: {'X-CSRFToken': csrftoken},
                        url: url,
                        processData: false,
                        contentType: false,
                        dataType: "json",
                        success:function(data) {
                            window.location.href = url
                        }
                    });

                    
    });

    // jQuery for fillter favorites and all survery
        jQuery('.favorites_btn .sitebtn').on('click',function(){
            jQuery('.copy_past_surv_wrp').addClass('favourite_survey_wrp');
            jQuery('.copy_past_tbl td').hide();
            jQuery('.copy_past_tbl td').each(function(){
                var favcheck = jQuery(this).find('.fa');
                if(favcheck.hasClass('svg_color')) {
                    jQuery(this).closest('td').show();
                }
            });
            ajax 
        });

        jQuery('.all_btn .sitebtn').on('click',function(){
            jQuery('.copy_past_surv_wrp').removeClass('favourite_survey_wrp');
            jQuery('.copy_past_tbl td').show();
        });

});