jQuery(document).ready(function(){

    jQuery('.editplan').on('click',function(){
        $('#planid').val(jQuery(this).attr('id'))
        cont = jQuery(this).parent()
        $('#planname').val(cont.find('.title').text().trim())
        $('#prizepersurvey').val(cont.find('.prize').text().trim())
        $('#noofsurvey').val(cont.find('.surveycount').text().trim())
        $('#licencefee').val(cont.find('.annualfee').text().trim())
        $('.servicesincludedesc').empty()
        $('.servicesincludedesc').append(cont.parent().find('.servicesinclude').html())
        jQuery('#editplanmodal').modal('show');
    });


    jQuery('#saveplan').on('click',function(){      
        token = document.getElementsByName("csrfmiddlewaretoken")[0].value	
		url = window.location.href	
        data = new FormData($('#planeditform').get(0)); 
        data.append('plandesc',$('.servicesincludedesc').html())  
				$.ajax({
					method: "post",
					headers: {'X-CSRFToken': token},
					url: url,
					data: data,
					processData: false,
					contentType: false,
					dataType: "json",
					success:function(data) {						
						alert('data updated')
                        window.location.reload()
					}, 
                });
            });

})


