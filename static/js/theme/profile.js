jQuery(document).ready(function($){
	// jQuery for checkbox value change
	jQuery('.togglebtn_wrp input').on('click',function(){
		if(jQuery(this).is(':checked')) {
			jQuery('#emailnotify').val('true');
		} else {
			jQuery('#emailnotify').val('false');
		}
	});
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
	// jQuery for Admin Profile Update -
		jQuery('.profile_update_popup .closepoup').on('click',function(){
			jQuery('.profile_update_popup').fadeOut();
			modalShow(false);
		});

	// jQuery for profile image selection
		jQuery(document).on('click','.coach_admin_img a.editprofileimg',function(){
			jQuery('.coach_admin_img input').trigger('click');
		});

		jQuery('.coach_admin_img input').change(function() {
			var data = new FormData($('#coach_profile_form').get(0));
			var endpoint = document.getElementById("profileurl").value;
			data.append('file', $('#profilepict')[0].files);
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
				  if (data['image_url']){

					//   alert(data['image_url'])
					jQuery('.uploaded_profile_img img').attr('src', data['image_url']);
					jQuery('.profileimgwrp img').attr('src', data['image_url']);
					jQuery('#profileDropdown img').attr('src', data['image_url']);
					// location.reload()
					$('.coach_admin_img a').empty()
					$('.coach_admin_img').append('<a href="javascript:;" class="remove_coach_img"><i class="fa fa-trash" aria-hidden="true"></i></a>')
				  }
				  else{
					  alert(data['fail'])
				  }
		  
				},
				error: function(data) {
					// alert('Image size should be less than 1 MB.')
					alert('Invalid file, upload another file')
				}
			});
		  
		});

		

	// jQuery for profile form validation
		jQuery('.profileupdatefrom .updateprofsubbtn').on('click',function(e){
			var profilevalid = true;

			var profilefname = jQuery('#profilefname').val();
			var profilelname = jQuery('#profilelname').val();
			var profileuser = jQuery('#profileuser').val();
			var profileemail = jQuery('#profileeamil').val();
			var profiletitle = jQuery('#profiletitle').val();
			var companyname = jQuery('#companyname').val();
			var companyurl = jQuery('#companyurl').val();
			var profilepass = jQuery('#profilepass').val();

			if(profilefname == "" || profilefname == null) {
				jQuery('#profilefnmerr').text('Please enter first name');
				profilevalid = false;
			} else {
				jQuery('#profilefnmerr').text('');
			}

			if(profilelname == "" || profilelname == null) {
				jQuery('#profilelnmerr').text('Please enter last name');
				profilevalid = false;
			} else {
				jQuery('#profilelnmerr').text('');
			}

			if(profileuser == "" || profileuser == null) {
				jQuery('#profileusererr').text('Please enter user name');
				profilevalid = false;
			} else {
				jQuery('#profileusererr').text('');
			}

			if(profileemail == "" || profileemail == null) {
				// if(email == "" || email == null) {
					jQuery('#emailerr').text('Please enter a email address');
					profilevalid = false;
			} else {
					var re = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/igm;
					if (re.test(profileemail)) {
						jQuery('#profileemailerr').text('');
					} else {
						jQuery('#profileemailerr').text('Please enter a valid email address');
						profilevalid = false;
					}
				
			}
		

			if(profiletitle == "" || profiletitle == null) {
				jQuery('#profiletiterr').text('Please enter title');
				profilevalid = false;
			} else {
				jQuery('#profiletiterr').text('');
			}

			if(companyname == "" || companyname == null) {
				jQuery('#compnameerr').text('Please enter company name');
				profilevalid = false;
			} else {
				jQuery('#compnameerr').text('');
			}

			// if(companyurl == "" || companyurl == null) {
			// 	jQuery('#compnayurlerr').text('Please enter company url');
			// 	profilevalid = false;
			// } else {
			// 	jQuery('#compnayurlerr').text('');
			// }

		
			if(profilevalid) {		
			var data = new FormData($('#coach_profile_form').get(0));
			var endpoints = document.getElementById("profiledataurl").value;
			var csrftoken = getCookie('csrftoken');
			$.ajax({
				type: "POST",
				headers: {'X-CSRFToken': csrftoken},
				url: endpoints,
				data: data,
				processData: false,
				contentType: false,
				dataType: "json",
				success:function(data) {
				  if (data['title']){
					$('#profiletitle').val(data['title'])
					$('#companyname').val(data['compnayname'])
					$('#companyurl').val(data['companyurl'])
					$('.profileupdatefrom h3').text(data['fname']+' '+data['lname'])
					jQuery('.profile_update_popup').fadeIn();		   
					modalShow(true);			
				  }
				  else{
					  alert(data['fail'])
					  $('#profileeamil').val(data['email'])
				  }	
		  
				}
			});
 
			}

			return profilevalid;
		});

		jQuery(document).on('click','.purchase_btn',function(){
			$('.no_of_sur_popup').show();
			modalShow(true);
		});
	
		jQuery(document).on('click','#sur_pur_info',function(){
			$('.no_of_survey span').empty()
			$('.no_of_survey span').text($('.quantity-input').val())
			$('.survey_buy').val($('.quantity-input').val())
			$('.total_cost_per_survey span').empty()
			$('.total_cost_per_survey span').text($('.quantity-input').val()+ '*'+ $('.persurveyprize').val())
			$('.total_cost span').empty()
			$('.total_sur_cost').val(parseInt($('.quantity-input').val())*parseInt($('.persurveyprize').val()))
			$('.total_cost span').text(parseInt($('.quantity-input').val())*parseInt($('.persurveyprize').val()))
			$('#mk_payment_btn').attr('data-amount', parseInt($('.quantity-input').val())*parseInt($('.persurveyprize').val()))
			$('.no_of_sur_popup').hide();
			modalShow(false);
			$('.stripe-button-el span').text('Pay $'+parseInt($('.quantity-input').val())*parseInt($('.persurveyprize').val()));
			$('.stripe-button').attr('data-amount', parseInt($('.quantity-input').val())*parseInt($('.persurveyprize').val()));
			$('.sur_pur_popup').show();
		});	

		jQuery(document).on('click','#mk_payment_btn',function(){		
			$('.sur_pur_popup').hide();
			modalShow(false);
			$('.plan_pur_popup').show();
		});	
		
		jQuery(document).on('click','.closepoup',function(){
			$(this).parent().parent().hide();
			modalShow(false);
		});	

		$('.profediticon').click(function(){
			ele = $(this).parent().find('input')
			ele.focus();
			var tmpStr = ele.val();
			ele.val('');
			ele.val(tmpStr);
		});

		$('.pass-input').click(function(){
			$('.password_popup').show()
			modalShow(true);
		});


		jQuery('input[name="mode_of_payment"]').change(function() {
			if($(this).is(":checked")){
				var endpoint = window.location.origin + "/payment-mode/Auto"
			}
			else{
				var endpoint = window.location.origin + "/payment-mode/Manual"
			}
			var csrftoken = $('input[name=csrfmiddlewaretoken]').val();
			$.ajax({				
				headers: {'X-CSRFToken': csrftoken},
				url: endpoint,				
				processData: false,
				contentType: false,
				dataType: "json",
				success:function(data) {	
					console.log(data['success'])
				},
				error: function(data) {
					console.log('error')
				}
			});
		})

			
});


jQuery(document).on('click','.remove_coach_img',function(){
	
		// var data = new FormData($('#coach_profile_form').get(0));
		var endpoints = document.getElementById("profiledataurl").value;
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
			  alert('Image removed')
			  $('.coach_admin_img a').empty()
			  console.log(document.location.origin+'/static/images/theme/default.png')
			  $('.coach_admin_img').append('<a href="javascript:;" class="editprofileimg"><img src="'+document.location.origin+'/static/images/theme/pen.svg"></a>')
			  $('.uploaded_profile_img img').attr('src','/static/images/theme/default.png')
			  $('#profileDropdown img').attr('src','/static/images/theme/default.png' )
			}
		});
	});

new ClipboardJS('#copylinkbtn');

function readURL(input,imgid) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    
    reader.onload = function(e) {
      $(imgid).attr('src', e.target.result);
    }
    
    reader.readAsDataURL(input.files[0]); // convert to base64 string
  }
}

