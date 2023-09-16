jQuery(document).ready(function($){
	
	jQuery('#fname').keyup(function () {
   		var fname = jQuery(this).val();
   		if(fname == "" || fname == null) {
			jQuery('#fnameerr').text('Please enter first name');
		} else {
			jQuery('#fnameerr').text('');
		
		}
   	});

   	jQuery('#lname').keyup(function () {
   		var lname = jQuery(this).val();
   		if(lname == "" || lname == null) {
			jQuery('#lnameerr').text('Please enter last name');
		} else {
			jQuery('#lnameerr').text('');
		
	}
   	});

   $(document).on("keyup",'#email', function(){
    	var email = jQuery(this).val();
		if(email == "" || email == null) {
			jQuery('#emailerr').text('Please enter email address');
		} else {
			var re = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/igm;
			if (re.test(email)) {
				jQuery('#emailerr').text('');
			} else {
				jQuery('#emailerr').text('Please enter a valid email address');
			}	
    }
		});

	jQuery('#compname').keyup(function () {
		var compname = jQuery(this).val();
		if(email == "" || email == null) {
			jQuery('#compnameerr').text('Please enter Company name');
		} else {
			jQuery('#compnameerr').text('');
		
		}
		}); 
	
	

   	jQuery('#zip_code').focusout(function () {
   		var zipcode = jQuery(this).val();	

		if(zipcode == "" || zipcode == null || zipcode.length == 5) {
			jQuery('#zipcode').text('');
		} else {
			jQuery('#zipcode').text('Invalid Zipcode. Please enter 5 digit zip code.');
		}
   	});

	(function($) {
	$.fn.inputFilter = function(inputFilter) {
		return this.on("input keydown keyup mousedown mouseup select contextmenu drop", function() {
		if (inputFilter(this.value)) {
			this.oldValue = this.value;
			this.oldSelectionStart = this.selectionStart;
			this.oldSelectionEnd = this.selectionEnd;
		} else if (this.hasOwnProperty("oldValue")) {
			this.value = this.oldValue;
			this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
		} else {
			this.value = "";
		}
		});
	};
	}(jQuery));

	function isValidUrl(url){
	var myVariable = url;
		if(/^(http|https|ftp):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i.test(myVariable)) {
			return 1;
		} else {
			return -1;
		}   
	}

	$("#fname").inputFilter(function(value) {
		return /^[a-z]*$/i.test(value); });

	$("#lname").inputFilter(function(value) {
		return /^[a-z]*$/i.test(value); });

	// $("#comptitle").inputFilter(function(value) {
	// 	return /^[a-zA-Z\s]*$/i.test(value); });

	$("#city").inputFilter(function(value) {
		return /^[a-z]*$/i.test(value); });

	$("#state").inputFilter(function(value) {
		return /^[a-z]*$/i.test(value); });

	$("#country").inputFilter(function(value) {
		return /^[a-z]*$/i.test(value); });

   	// jQuery('#address').focusout(function () {
   	// 	var address = jQuery(this).val();
	// 	if(address == "" || address == null) {
	// 		jQuery('#addresserr').text('Please enter address');
	// 	} else {
	// 		jQuery('#addresserr').text('');
	// 	}
   	// });

   	// jQuery('#compname').focusout(function () {
   	// 	var compname = jQuery(this).val();
	// 	if(compname == "" || compname == null) {
	// 		jQuery('#compnameerr').text('Please enter company name');
	// 	} else {
	// 		jQuery('#compnameerr').text('');
	// 	}
   	// });

   	// jQuery('#compurl').focusout(function () {
   	// 	var compurl = jQuery(this).val();
	// 	if(compurl == "" || compurl == null || isValidUrl(compurl)==1) {
	// 		jQuery('#compurlerr').text('');
	// 	} else {
	// 		jQuery('#compurlerr').text('Please enter valid company url');
	// 	}
   	// });

   	// jQuery('#addemail').focusout(function () {
   	// 	var addemail = jQuery(this).val();
	// 	if(addemail == "" || addemail == null) {
	// 		jQuery('#addemailerr').text('Please enter company email address');
	// 	} else {
	// 		jQuery('#addemailerr').text('');
	// 	}
   	// });
	
	$("#phone").change(function() {
	var a = $("#phone").val();
	var filter = /^[7-9][0-9]{9}$/;
	if (filter.test(a) || a == '' || a == null) {
		jQuery('#phoneerr').text('');
	}
	else {
		jQuery('#phoneerr').text('Please enter valid 10 digit number');
	}
    });

   	// jQuery('#phone').focusout(function () {
   	// 	var addphone = jQuery(this).val();
	// 	if(addphone == "" || addphone == null){
    //         jQuery('#addphoneerr').text('Please enter company phone.');
    //     } else {
    //     	jQuery('#addphoneerr').text('');
    //     }
   	// });

   	// jQuery('#compaddress').focusout(function () {
   	// 	var compaddress = jQuery(this).val();
	// 	if(compaddress == "" || compaddress == null){
    //         jQuery('#compaddresserr').text('Please enter company address.');
    //     } else {
    //     	jQuery('#compaddresserr').text('');
    //     }

   	// });
	   
    jQuery('#clientintakeform input').each(function( index ) {
		val = $(this).val().trim()
		$(this).val(val)
	});

	jQuery('#clientintakeform #clientintakesub').on('click',function(e){
		
		var valid = true;
		var fname = document.forms["clientintakeform"]["fname"].value;
		var lname = document.forms["clientintakeform"]["lname"].value;
		var title = document.forms["clientintakeform"]["title"].value;
		var email = document.forms["clientintakeform"]["email"].value;
		var phone = document.forms["clientintakeform"]["phone"].value;
		var address = document.forms["clientintakeform"]["address"].value;
		var compname = document.forms["clientintakeform"]["compname"].value;
		var title = document.forms["clientintakeform"]["title"].value;
		var compurl = document.forms["clientintakeform"]["compurl"].value;
		// var addemail = document.forms["clientintakeform"]["addemail"].value;
		// var addphone = document.forms["clientintakeform"]["addphone"].value;
		// var compaddress = document.forms["clientintakeform"]["compaddress"].value;

		if(fname == "" || fname == null) {
			jQuery('#fnameerr').text('Please enter first name');
			valid = false;
		} else {
			jQuery('#fnameerr').text('');
		}

		if(lname == "" || lname == null) {
			jQuery('#lnameerr').text('Please enter last name');
			valid = false;
		} else {
			jQuery('#lnameerr').text('');
		}

		if(email == "" || email == null) {
			jQuery('#emailerr').text('Please enter email address');
			valid = false;
		} else {
			jQuery('#emailerr').text('');
		}

		if(fname != "" && lname != "" && email != "" ){
			valid = true;
			// jQuery('#clientintakesub').attr('type','submit'); 
			token = document.getElementsByName("csrfmiddlewaretoken")[0].value	
			url = window.location.href			
			var data = new FormData($('#clientintakeform').get(0));  
			data.append('coach', $('.select-option').val()) 
			console.log($('.select-option').val())
				$.ajax({
					method: "post",
					headers: {'X-CSRFToken': token},
					url: url,
					data: data,
					processData: false,
					contentType: false,
					dataType: "json",
					success:function(data) {						
						if (data["sucmessage"])	{
							$('.intakeformsuccpopup h2').text('Congratulations!')
							$('.intakeformsuccpopup p').text(data["sucmessage"])
							// $('.intakeformsuccpopup').show()
							window.location.href = window.location.origin;
						}	
						else if(data["failmessage"]){
							$('#email').val('')
							$('.intakeformsuccpopup h2').text('Failed!')
							$('.intakeformsuccpopup p').text(data["failmessage"])
							$('.intakeformsuccpopup').show()
							modalShow(true);
						}
					}, 
					error:function(data) {
						console.log('Something wrong')
					}
				});
		}
		
		return valid;
       
	});

	jQuery('.intakeformsuccpopup .closepoup').on('click',function(){
		jQuery('.intakeformsuccpopup').fadeOut();
	});

    $("#addphone").inputFilter(function(value) {
	    return /^\d*$/.test(value);    // Allow digits only, using a RegExp
	});

    $("#phone").inputFilter(function(value) {
	    return /^\d*$/.test(value);    // Allow digits only, using a RegExp
	});

});

