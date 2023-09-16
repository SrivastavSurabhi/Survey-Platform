jQuery(document).ready(function($){
	// jQuery for upload logo
		jQuery(document).on('click','.clientwebform_logo a.uploadchangelogo',function(){
			jQuery('.clientwebform_logo input').trigger('click');
		});

		jQuery('.clientwebform_logo input').change(function() {
		  	var file = $(this)[0].files[0].name;
		  	var filesrc = $(this).closest('.clientwebform_logo').find('img');
		  	readURL(this,filesrc);
		});

	// jQuery for upload profile image
		jQuery(document).on('click','.clientwebform_prf_img a.editclientwebfrmprofimg',function(){
			jQuery('.clientwebform_prof_img_wrp input').trigger('click');
		});

		jQuery('.clientwebform_prof_img_wrp input').change(function() {
		  	var file = $(this)[0].files[0].name;
		  	var filesrc = $(this).prev('.clientwebform_prf_img').find('figure img');
		  	readURL(this,filesrc);
		});

	// Remove image jQuery
		jQuery('.clientwebformprf_wrp a.removeimg').on('click',function(){
			jQuery('.clientwebform_prf_img figure img').attr('src','Images/dummy-image-landscape-1.jpg')
		});

	// Client web form validation
		jQuery('#clientwebform #subclientwebfrm').on('click',function(e){
			//e.preventDefault();
			debugger;
			var valid = true;
			var fname = document.forms["clientwebform"]["fname"].value;
			var lname = document.forms["clientwebform"]["lname"].value;
			var email = document.forms["clientwebform"]["email"].value;
			var phone = document.forms["clientwebform"]["phone"].value;
			var address = document.forms["clientwebform"]["address"].value;
			var compname = document.forms["clientwebform"]["compname"].value;
			var compurl = document.forms["clientwebform"]["compurl"].value;
			var addemail = document.forms["clientwebform"]["addemail"].value;
			var addphone = document.forms["clientwebform"]["addphone"].value;
			var compaddress = document.forms["clientwebform"]["compaddress"].value;

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
	
			if(phone == "" || phone == null) {
				jQuery('#phoneerr').text('Please enter phone number');
				valid = false;
			} else {
				jQuery('#phoneerr').text('');
			}
	
			if(address == "" || address == null) {
				jQuery('#addresserr').text('Please enter address');
				valid = false;
			} else {
				jQuery('#addresserr').text('');
			}
	
			if(compname == "" || compname == null) {
				jQuery('#compnameerr').text('Please enter company name');
				valid = false;
			} else {
				jQuery('#compnameerr').text('');
			}
	
			// if(compurl == "" || compurl == null) {
			// 	jQuery('#compurlerr').text('Please enter company url');
			// 	valid = false;
			// } else {
			// 	jQuery('#compurlerr').text('');
			// }
	
			if(addemail == "" || addemail == null) {
				jQuery('#addemailerr').text('Please enter company email address');
				valid = false;
			} else {
				jQuery('#addemailerr').text('');
			}
	
			if(addphone == "" || addphone == null){
				jQuery('#addphoneerr').text('Please enter company phone.');
				valid = false;
			} else {
				jQuery('#addphoneerr').text('');
			}
	
			if(compaddress == "" || compaddress == null){
				jQuery('#compaddresserr').text('Please enter company address.');
				valid = false;
			} else {
				jQuery('#compaddresserr').text('');
			}
			var errorid = jQuery('.client_web_form_inn form span.error:not(:empty):first').attr('id');
			//console.log(errorid);
			
			if(valid == false) {
				jQuery('html, body').animate({
				    scrollTop: jQuery("#"+errorid).offset().top-50
				});
			} 
			return valid;
			

		});

		jQuery('.frmsucc_popup .closepoup').on('click',function(){
			jQuery('.frmsucc_popup').hide();
			modalShow(false);
		});

	// jQuery for upload file 
		jQuery('#file-upload').on('click',function(){
			jQuery('.upload_logo_popup').fadeIn();
			modalShow(true);
		});

		jQuery('.upload_logo_popup .closepoup').on('click',function(){
			jQuery('.upload_logo_popup').fadeOut();
			modalShow(false);
		});

	

		


		// $('#uploadlogo').bind('fileuploadprogress', function (e, data) {
		//     // Log the current bitrate for this upload:
		//     // console.log(data.bitrate);
		//     console.log(data);
		// });
});	

function readURL(input,imgid) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    
    reader.onload = function(e) {
      $(imgid).attr('src', e.target.result);
    }
    
    reader.readAsDataURL(input.files[0]); // convert to base64 string
  }
}