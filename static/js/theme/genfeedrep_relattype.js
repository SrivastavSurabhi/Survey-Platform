jQuery(document).ready(function(){
	// // jQuery for participant relationship type
	// 	jQuery('#relationtypefrm #relationtypefrmsub').on('click',function(e){
	// 		e.preventDefault();
	// 		var valid = true;
	// 		jQuery('#relationtypefrm .cmn_field').each(function(){
	// 			if(jQuery(this).find('.partrepbypartrel').is(':checked')) {
	// 				jQuery(this).find('.partrepbypartrelerr').text('');
	// 			} else {
	// 				jQuery(this).find('.partrepbypartrelerr').text('Please select any one option');
	// 				valid = false;
	// 			}
	// 			if(jQuery(this).find('.relatypesel_wrp').is(":visible")){
	// 				var relatypesel = jQuery(this).find('select').val();
	// 				if (relatypesel == "" || relatypesel == null) {
	// 					jQuery(this).find('.relatypeselerr').text('Please select any relation type');
	// 					valid = false;
	// 				} else {
	// 					jQuery(this).find('.relatypeselerr').text('');
	// 				}
	// 			}
	// 		});
	// 		if(valid) {				
	// 			if ($('input[name=radio1]').val() == 'Yes'){
	// 				var endpoint =  window.location.origin+'/paticipant_count/'+ $('.relatypesel').val();
	// 				var csrftoken = $('input[name=csrfmiddlewaretoken]').val();
	// 				$.ajax({
	// 					type: "GET",
	// 					headers: {'X-CSRFToken': csrftoken},
	// 					url: endpoint,					
	// 					success:function(data) {
	// 						if(data['count']){		                    
	// 							alert(data['count'])
	// 						}else{
	// 							jQuery('.parti_relation_type_popup').show();
								
	// 						}
	// 					}
	// 				});
	// 			}
				
				
	// 		}
	// 		return valid;
	// 	});

	jQuery('#exampleRadios1').on('click',function(){
		$('.relatypesel_wrp').show();
		$('.alert-info-new').hide();
	});

	jQuery('#exampleRadios2').on('click',function(){
		$('.relatypesel_wrp').hide();
		$('.alert-info-new').show();

	});

	jQuery('#relationtypefrmsub').on('click',function(){
		this_btn = $(this)
		var grpnm = [];
		var dictionary = {};
		var data = new FormData();
		values = $('.relationship-grp .lable-wrap .dropdown .select')
		proceed = true
			$.each(values, function(i, element) {
				ele = $(element).text().trim();
				if(!$(this).parent().parent().hasClass("disable")){
					elemnt = $(element).parent().parent().find('label').text().trim();
										
					if (ele != 'Select Group' || elemnt == 'Manager'){
						if(ele != 'Select Group'){
							if (!grpnm.includes(ele)){
								grpnm.push(ele);
								dictionary[ele] = elemnt									
							}
							else{
								val1 = dictionary[ele]+','+ elemnt				
								dictionary[ele] = val1;											
							}
							data.append(ele, dictionary[ele])
						}					
					}
					else{
						proceed = false
						alert('Please select group for each relationship type you have sent survey or press skip if you do not want to group participant responses.')
						data= {'id': $('#reportid').val()}			
						token = document.getElementsByName("csrfmiddlewaretoken")[0].value
						url = window.location.origin + "/survey/add-group/"
							$.ajax({
								method: "delete",
								headers: {'X-CSRFToken': token},
								url: url,
								data: $('#reportid').val(),
								dataType: "json",
								success:function(data) {
									console.log('deleted')
								},
								error: function(data) {
									console.log('error')
								}
							});
						return false
					}			
						
				}			
			});			
			var lessparticipant = [];
			$.each(grpnm, function(i, element) {
				// ele = $(element).text().trim();
				if (dictionary[element].split(',').length < 3){
					if (dictionary[element].split(',').length == 1){
						if(dictionary[element] != 'Manager'){
							lessparticipant.push(element);
						}						
					}
					else{
						lessparticipant.push(element);
					}
				}
			});
			let text = lessparticipant.join();
			// if (lessparticipant.length > 0){
			// 	jQuery('.parti_relation_type_popup p').empty();
			// 	jQuery('.parti_relation_type_popup p').append("There are less than 3 participants in <b>"+text+"</b>. To ensure anonymity, it is best practice to have 3 or more participants in <b>"+text+"</b>. You may go back to change your selection.");
			// 	jQuery('.parti_relation_type_popup').show();
			// 	proceed = false		
			// }
		if(proceed == true){
			data.append('id', $('#reportid').val())			
			token = document.getElementsByName("csrfmiddlewaretoken")[0].value
			url = window.location.origin + "/survey/add-group/"
				$.ajax({
					method: "post",
					headers: {'X-CSRFToken': token},
					url: url,
					data: data,
					processData: false,
					contentType: false,
					dataType: "json",
					success:function(data) {
						if(data['fail']){
							jQuery('.parti_relation_type_popup p').empty();
							jQuery('.parti_relation_type_popup p').append(data['fail']);
							jQuery('.parti_relation_type_popup').show();
						}	
						else{					
							url = window.location.href.replace('step-1','step-2')						
							$('continue_to_2step').click()
							$('#step2').click()
							jQuery('.lrc_content_step').hide();
							jQuery('.loader-wrap').show();
							window.location.href = '#step-2';
							location.reload();
						}
					},
					error: function(data) {
						jQuery('.parti_relation_type_popup').show();
					}
				});
			}
	});

	// function getAllPerson() {
		
	// }

	jQuery('#grp_name .closepoup').on('click',function(){
		jQuery($('#grp_name')).modal('hide');
	});

	jQuery('#btnpens_logo').on('click',function(){
		if(!$(this).parent().parent().find('.rptimg').find('img').attr('src')){
			jQuery('.upload_logo_wrp').html('<div class="uploadimg"><img  src='+jQuery('.uploadlogoimgs').attr('src')+'></div><div class="uploadimgname"><p>Drag and drop a file here.</p><p>You can also upload a file from your computer.</p></div>');
		}
		jQuery('.upload_logo_popup ').show();
		modalShow(true);
	});

	jQuery(document).on('click', '.group_name i', function(){
		jQuery('#grp_name').modal('show');
		jQuery('#que_no').val(jQuery(this).attr('data')) ;
	});

	jQuery(document).on('click', '#save_grp_name', function(){
		// grp_name = jQuery($(this)).parent().parent().parent().parent().find('input').val();
		var grp_name = jQuery('#surveyname').val();
		val = jQuery('#que_no').val();
		jQuery($('.grp_name'+val)).html(grp_name);
		if (grp_name == ''){
			jQuery($('#grpnameerr')).text('Please enter Group Name')
		}else{
			// jQuery('.group_name').append("<div><strong>"+grp_name+"</strong></div>");
			jQuery('#grp_name').modal('hide');
			// jQuery('#relationtypefrmsub').addClass('next');
			// jQuery('#grpnameerr').text('');			
			// jQuery('#relationtypefrmsub').trigger('click');	
		}
		
	});

	$('.dropdown').on('click', function() { 
		$('#inlineRadio3').prop('checked', false);
		$('#inlineRadio4').prop('checked', false);

	 });

	jQuery('.lable-wrap .dropdown .dropdown-menu').on('click',function(){
		jQuery($('#relationtypefrmsub')).removeClass('next');
	});

	jQuery('.select2-results__option').on('click',function(){
		alert('gg')
	});

	jQuery('.upload_logo').on('click',function(){
		$('.upload_logo_popup').show();
		modalShow(true);
	});

	

	$(document).on("focusout",".heading_wrap h1,.heading_wrap h2,.heading_wrap h3,.heading_wrap h4", function(){
		token = document.getElementsByName("csrfmiddlewaretoken")[0].value;
		id = $('#reportid').val();
		url = window.location.origin + "/survey/rpt-head/"
		var data = new FormData();     
		data.append('reportid', id);
		h2 = jQuery('.heading_wrap h2').text().trim()
		data.append('h1', jQuery('.heading_wrap h1').text().trim());
		data.append('h2', h2);
		if(jQuery('.heading_wrap h3').find('p').length == 0){
			data.append('h3', jQuery('.heading_wrap h3').text().trim());
		}
		else{
			data.append('h3', '');
		}

		if(jQuery('.heading_wrap h4').find('p').length == 0){
			data.append('h4', jQuery('.heading_wrap h4').text().trim());
		}
		else{
			data.append('h4', '');
		}
		
		
		if (h2.split(" ").length > 2 || h2.split(" ").length == 0){
			alert('Invalid Name (Please enter first name and last name. eg: John Doe)')
			return false;
		}
		else{
			$.ajax({
				method: "post",
				headers: {'X-CSRFToken': token},
				url:  url,	
				data: data,				
				processData: false,
				contentType: false,
				dataType: "json",
				success:function(data) {
					console.log('success')
				}, 
				error: function(data) {
					console.log('fail')
				}
			});	
		}					
	});

	// jQuery('.edit_wrap').on('click',function(){
	// 	$('.heading_wrap h2').text();
	// 	$('.heading_wrap h3').text();
	// 	$('.heading_wrap h4').text();


	// });

	jQuery('.upload_logo_popup_inn .closepoup').on('click',function(){
		$('.upload_logo_popup').hide();
		modalShow(false);
	});

		jQuery('.partrepbypartrel').on('click',function(){
			if (jQuery(this).val() == "Yes") {
				jQuery(this).closest('.cmn_field').find('.relatypesel_wrp').slideDown();
			} else {
				jQuery(this).closest('.cmn_field').find('.relatypeselerr').text('');
				jQuery(this).closest('.cmn_field').find('.relatypesel_wrp').slideUp();
			}
		});


		jQuery('.parti_relation_type_popup .closepoup,.parti_relation_type_popup .gobackbtn').on('click',function(){
			jQuery('.parti_relation_type_popup').hide();
			token = document.getElementsByName("csrfmiddlewaretoken")[0].value;
			url = window.location.origin + "/survey/add-group/"
			$.ajax({
				method: "delete",
				headers: {'X-CSRFToken': token},
				url: url,
				data: $('#reportid').val(),
				dataType: "json",
				success:function(data) {					
					console.log('groups deleted')
				},
				error: function(data) {
					console.log('error')
				}
			});
		});

		jQuery('.parti_relation_type_popup .continue_to_2step').on('click',function(){
			jQuery('.parti_relation_type_popup').hide();

		// var grpnm = [];
		// var dictionary = {};
		// var data = new FormData();
		// values = $('.relationship-grp .lable-wrap .dropdown .select')
		// proceed = true
		// 	$.each(values, function(i, element) {
		// 		ele = $(element).text().trim();
		// 				if (!grpnm.includes(ele)){
		// 					grpnm.push(ele);
		// 					dictionary[ele] = $(element).parent().parent().find('label').text().trim();										
		// 				}
		// 				else{
		// 					val1 = dictionary[ele]+','+$(element).parent().parent().find('label').text().trim();				
		// 					dictionary[ele] = val1;											
		// 				}
		// 				data.append(ele, dictionary[ele])	
		// 	});			
	

		// 	data.append('id', $('#reportid').val())			
		// 	token = document.getElementsByName("csrfmiddlewaretoken")[0].value
		// 	url = window.location.origin + "/survey/add-group/"
		// 		$.ajax({
		// 			method: "post",
		// 			headers: {'X-CSRFToken': token},
		// 			url: url,
		// 			data: data,
		// 			processData: false,
		// 			contentType: false,
		// 			dataType: "json",
		// 			success:function(data) {						
		// 				url = window.location.href.replace('step-1','step-2')						
		// 				$('continue_to_2step').click()
						jQuery('.lrc_content_step').hide();
						jQuery('.loader-wrap').show();
						window.location.href = '#step-2';
						location.reload();
						// }
				// 	},
				// 	error: function(data) {
				// 		jQuery('.parti_relation_type_popup').show();
				// 	}
				// });
			// window.location.href = '#step-2';
			// location.reload();
		});

});