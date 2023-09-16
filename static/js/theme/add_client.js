jQuery(document).ready(function($){

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
	// jQuery for profile image selection
		jQuery(document).on('click','.addclientprofileimg',function(){
			jQuery('.addclientprf_cmn input').trigger('click');
		});

		jQuery('.save_as_btn').on('click',function(){
			showmodal = false
			surveyexist = jQuery('#curr_survey_id').val(jQuery(this).attr('data'));
			jQuery(this).closest('tr').find('.one_block input').each(function(i) { 
					sur = $(this).attr('data')
					$('.save-as-rpt label').each(function(j) {						
						if($(this).attr('for') == sur){							
							console.log($(this).attr('for'))
						console.log(sur)
							$(this).parent().addClass('grey-disable')
						}						
					})
					showmodal = true
			});	
			console.log(showmodal)
			if(showmodal == true){
				jQuery('#draft-modal').modal('show');
			}	
			else{
				alert('Please generate report for this survey.')
			}									 
		});

		jQuery('.draft_popup .closepoup').on('click',function(){
			jQuery('.one_block').each(function(i) { 
				$(this).removeClass('grey-disable')
			}) 
		});

		var yourGlobalSurvey;
		jQuery('#coach_report').on('click',function(){			
			id = jQuery('#curr_survey_id').val();
			var data = new FormData();
			var endpoint = document.location.origin+'/survey/saveas/';
			data.append('user', 'Coach');
			data.append('id', id);
			token = document.getElementsByName("csrfmiddlewaretoken")[0].value;
			$.ajax({ 	
				type: "POST",
				headers: {'X-CSRFToken': token},
				url: endpoint,
				data: data,
				processData: false,
				contentType: false,
				dataType: "json",
				success:function(data) {
					rptid = data['rptid']	
					jQuery('#draft-modal').modal('hide');
					jQuery('#confed').modal('show');
					yourGlobalSurvey = data['surid']				
		  		}
			});
		});

		
		jQuery('#confed .savewithcq').on('click',function(){
			window.location.href = document.location.origin+'/survey/feedback-report/'+yourGlobalSurvey+'/Coach#step-4'
		});

		jQuery('.buy_survey_popup .closepoup').on('click',function(){
			jQuery('.buy_survey_popup').hide()
			modalShow(false);
		});
		
		jQuery('#confed .savewithoutcq').on('click',function(){
			id = jQuery('#curr_survey_id').val();
			var data = new FormData();
			var endpoint = document.location.origin+'/survey/saveas/';
			data.append('user', 'Coach');
			data.append('id', id);
			data.append('sts', 'False');
			token = document.getElementsByName("csrfmiddlewaretoken")[0].value;
			$.ajax({ 	
				type: "POST",
				headers: {'X-CSRFToken': token},
				url: endpoint,
				data: data,
				processData: false,
				contentType: false,
				dataType: "json",
				success:function(data) {
					rptid = data['rptid']	
					jQuery('#draft-modal').modal('hide');
					jQuery('#confed').modal('show');					
					surid = data['surid']
					window.location.href = document.location.origin+'/survey/feedback-report/'+surid+'/Coach#step-4'
		  		}
			});
		});


		jQuery('#manager_report').on('click',function(){
			id = jQuery('#curr_survey_id').val();
			var data = new FormData();
			var endpoint = document.location.origin+'/survey/saveas/';
			data.append('user', 'Manager');
			data.append('id', id);			
			token = document.getElementsByName("csrfmiddlewaretoken")[0].value;
			$.ajax({ 	
				type: "POST",
				headers: {'X-CSRFToken': token},
				url: endpoint,
				data: data,
				processData: false,
				contentType: false,
				dataType: "json",
				success:function(data) {

					rptid = data['rptid']
					surid = data['surid']
					window.location.href = document.location.origin+'/survey/feedback-report/'+surid+'/Manager#step-4'		  
				}
			});
			
		});

		jQuery('.addclientprf_cmn input').change(function() {
			var data = new FormData($('#profileupdatefrm').get(0));
		  var endpoint = document.getElementById("profileurl").value;
		  data.append('file', $('#addclientprofilepict')[0].files);
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
				console.log(data);
				if (data['image_url']){
				  jQuery('#profile').attr('src', data['image_url']);
				  $('.addclientprf_img_wrp a').empty()
				  $('.addclientprf_img_wrp').append('<a href="javascript:;" class="delete_client_img"><i class="fa fa-trash" aria-hidden="true"></i></a>')
				  
				}
				else{
					alert(data['fail'])
				}		
			  },
			  error: function(data) {
				alert('Invalid file, upload another file')

			}
		  });
		
	  });
	jQuery('.redirecttoreportpage').on('click',function(){		
	  	jQuery('#curr_survey_id').val(jQuery(this).attr('data'));
		jQuery('.redirect_popup').modal('show');
	});

	jQuery('#Individual_response').on('click',function(){
		report_link = jQuery('#curr_survey_id').val()
		jQuery('.individual_pop_up').show();
		modalShow(true);
		
	});

	jQuery('#Question_summary').on('click',function(){
		id = jQuery('#curr_survey_id').val()
		token = document.getElementsByName("csrfmiddlewaretoken")[0].value;
		url = window.location.origin + "/survey/filter_response/"
		$.ajax({
			url:  url,	
			method: "put",
			headers: {'X-CSRFToken': token},
			data: id,				
			success:function(data) {
				$('#que_sum').empty()				
				$('#que_sum').append('<option value="1">Select Question </option><option value="0">All Questions</option>')				
				for (i in data['que']){	
					shortenque = (data["que"][i][6].length > 80)? data["que"][i][6].substr(0, 80) + '...': shortenque = data["que"][i][6];
					$('#que_sum').append('<option value="'+data["que"][i][0]+'">'+shortenque+'</option>')
				}
				if (data['confque']){	
					shortenque = (data["confque"].length > 80)? data["confque"].substr(0, 80) + '...': shortenque = data["confque"];
					$('#que_sum').append('<option value="'+data["id"]+'" class="cq">'+data["confque"]+'</option>')
				}
			}, 
			error: function(data) {
				console.log('something wrong')
			}
		});		
		
		jQuery('.question_summary_pop_up').show();
		modalShow(true);
		
	});

	$( "#upper-text" ).delegate( ".date-text", "click", function() {
			$('#datepicker').show();
			$(this).hide();
	});

	$( "#rem_upper-text" ).delegate( ".date-text", "click", function() {
			$(this).next().show();
			$(this).hide();
	});


	$( "#rem_upper-text" ).delegate( "#datepicker", "change", function() {
		dt =  $(this).val()
		newdt = dt.split('-');
		var months = [ "January", "February", "March", "April", "May", "June", 
           "July", "August", "September", "October", "November", "December" ];
		var selectedMonthName = months[Number(newdt[1]-1)];		
		$(this).hide();		
		dateval = jQuery('p .date-text')
		dateval.text(selectedMonthName+' '+newdt[2])
		dateval.show();
		token = document.getElementsByName("csrfmiddlewaretoken")[0].value;
		url = window.location.origin + "/survey/create/"
		$.ajax({
			url:  url,	
			method: "put",
			headers: {'X-CSRFToken': token},
			data: dt+','+jQuery('#surveycat').val(),				
			success:function(data) {
				console.log('date updated')
			}, 
			error: function(data) {
				console.log('something wrong')
			}
		});		
		
	})

	$( "#upper-text" ).delegate( "#datepicker", "change", function() {
		dt =  $(this).val()
		newdt = dt.split('-');
		var months = [ "January", "February", "March", "April", "May", "June", 
           "July", "August", "September", "October", "November", "December" ];
		var selectedMonthName = months[Number(newdt[1]-1)];		
		$(this).hide();		
		dateval = jQuery('p .date-text')
		dateval.text(selectedMonthName+' '+newdt[2])
		dateval.show();
		token = document.getElementsByName("csrfmiddlewaretoken")[0].value;
		url = window.location.origin + "/survey/create/"
		$.ajax({
			url:  url,	
			method: "put",
			headers: {'X-CSRFToken': token},
			data: dt+','+jQuery('#surveycat').val(),				
			success:function(data) {
				console.log('date updated')
			}, 
			error: function(data) {
				console.log('something wrong')
			}
		});		
		
	})

	$( "#myTable" ).delegate( ".delete_survey", "click", function() {
	// jQuery('.delete_survey').on('click',function(){
		sur_link = jQuery('#curr_survey_id').val($(this).attr('data'))
		jQuery('#del_sur').modal('show')
	});

	jQuery('.send-client-report').on('click',function(){
		client_id = jQuery('#client_id').val();
		survey_id = $(this).attr('data');
		url = window.location.origin + '/client-detail/'+ client_id + '/' + survey_id
		$('.send_feedback_report').attr('href',url);
		token = document.getElementsByName("csrfmiddlewaretoken")[0].value
		url = document.location.origin+'/save-cont/' 
		var data = new FormData();
		data.append('survey_id', survey_id);
		$.ajax({
			method: "POST",
			headers: {'X-CSRFToken': token},
			url:  url,	
			data: data,				
			processData: false,
			contentType: false,
			dataType: "json",
			success:function(data) {	
				$('#mail-subject').val(data['mail_subj'])
				$('#upper-mail-text').html(data['mail_cont'])
				jQuery('#send_report').modal('show');
			},
			error: function(data) {
				alert('try again')
			}
		});
		
	});

	jQuery('#delete_sur').on('click',function(){
		sur_link = jQuery('#curr_survey_id').val()
		token = document.getElementsByName("csrfmiddlewaretoken")[0].value
        cid = $('#client_id').val()
		url = document.location.origin+'/delete-survey/' + sur_link + '/' + cid,
		$.ajax({
			method: "delete",
			headers: {'X-CSRFToken': token},
			url:  url,					
			processData: false,
			contentType: false,
			dataType: "json",
			success:function(data) {	
				alert(data['success'])
				window.location.reload()
			},
			error: function(data) {
				alert('try again')
			}
		});
		
	});

	jQuery('.delete_report').on('click',function(){
		surveys = []
		ele = ($(this).closest('tr').find('.status'))
		jQuery(ele).each(function(){
			jQuery($(this).find('.one_block input')).each(function(){
				if($(this).is(":checked")){
				surveys.push($(this).attr('data'))
			}
			})
		})
		sur_link = jQuery(this).attr('data')
		token = document.getElementsByName("csrfmiddlewaretoken")[0].value
		if(surveys.length === 0){
			alert('Please select a report to delete')
		}
		else{
		url = document.location.origin+'/survey/delete-report/'+sur_link
		$.ajax({
			method: "delete",
			headers: {'X-CSRFToken': token},
			url:  url,	
			data:surveys,				
			processData: false,
			contentType: false,
			dataType: "json",
			success:function(data) {	
				alert(data['success'])
				window.location.reload()
			},
			error: function(data) {
				alert('try again')
			}
		});
		}
	});



	jQuery('.complete_survey').on('click',function(){
		sur_link = jQuery(this).attr('data')
		token = document.getElementsByName("csrfmiddlewaretoken")[0].value
        cid = $('#client_id').val()
		url = document.location.origin+'/delete-survey/' + sur_link + '/' + cid,
		$.ajax({
			method: "put",
			headers: {'X-CSRFToken': token},
			url:  url,					
			processData: false,
			contentType: false,
			dataType: "json",
			success:function(data) {	
				alert(data['success'])
				window.location.reload()
			},
			error: function(data) {
				alert('try again')
			}
		});
		
	}); 

	jQuery('input[class="reminderval"]').on('change',function(){
		if(jQuery(this).val() == 'NOREMINDER'){
			jQuery('input[class="whentoreminderval"]').attr('disabled', true)
			jQuery('input[class="whentoreminderval"]').prop('checked', false)
		}
		else{
			jQuery('input[class="whentoreminderval"]').attr('disabled', false)
		}
	}); 


	jQuery('.reopen_survey').on('click',function(){		
		proceed = true		
		// $('.status').each(function(){
		// 	if($(this).text().trim() == 'Active'){
		// 		alert("You can't reopen survey. As you already have active survey.")
		// 		proceed = false
		// 		return false;
		// 	}
		// })
		if(proceed == true){
			if($(this).hasClass('automate')){
				alert('You must manually close the survey after reopening.')
			}
			sur_link = jQuery(this).attr('data')
			token = document.getElementsByName("csrfmiddlewaretoken")[0].value
			cid = $('#client_id').val()
			url = document.location.origin+'/delete-survey/' + sur_link + '/' + cid,
			$.ajax({
				method: "post",
				headers: {'X-CSRFToken': token},
				url:  url,					
				processData: false,
				contentType: false,
				dataType: "json",
				success:function(data) {	
					window.location.reload()
				},
				error: function(data) {
					alert('try again')
				}
			});	
		}	
	});

	jQuery(document).on('click','.delete_client_img',function(){
		var endpoints = location.href;
		var csrftoken = document.getElementsByName("csrfmiddlewaretoken")[0].value;
		$.ajax({
			type: "delete",
			headers: {'X-CSRFToken': csrftoken},
			url: endpoints,
			data: 'data',
			processData: false,
			contentType: false,
			dataType: "json",
			success:function(data) {
			  alert('image removed')			
			  $('.addclientprf_img_wrp a').empty()
			  $('.addclientprf_img_wrp').append('<a href="javascript:;" class="addclientprofileimg"><img src="'+document.location.origin+'/static/images/theme/pen.svg"></a>')
			  $('#profile').attr('src',data['url'])
			}
		});
	});

});

	



