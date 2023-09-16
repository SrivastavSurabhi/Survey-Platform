jQuery(document).ready(function($){

	jQuery('#fname').focusout(function () {
   		var fname = jQuery(this).val();
   		if(fname == "" || fname == null) {
			jQuery('#fnameerr').text('Please enter first name');
		} else {
			jQuery('#fnameerr').text('');
		}
   	});

   	jQuery('#lname').focusout(function () {
   		var lname = jQuery(this).val();
   		if(lname == "" || lname == null) {
			jQuery('#lnameerr').text('Please enter last name');
		} else {
			jQuery('#lnameerr').text('');
		}
   	});

   	jQuery('#email').focusout(function () {
   		var email = jQuery(this).val();
   		if(email == "" || email == null) {
			jQuery('#emailerr').text('Please enter email address');
		} else {
			jQuery('#emailerr').text('');
		}
   	});

   	jQuery('#relationship').focusout(function () {
   		var relationship = jQuery(this).val();
		if(relationship == "" || relationship == null) {
			jQuery('#relationshiperr').text('Please select any one relationship');
		} else {
			jQuery('#relationshiperr').text('');
		}
   	});


	jQuery('#participantform #addpartfrmsub').on('click',function(e){
		e.preventDefault();
		var valid = true;
		var fname = document.forms["participantform"]["fname"].value;
		var lname = document.forms["participantform"]["lname"].value;
		var email = document.forms["participantform"]["email"].value;
		var relationship = document.forms["participantform"]["relationship"].value;

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

		if(relationship == "" || relationship == null) {
			jQuery('#relationshiperr').text('Please select any one relationship');
			valid = false;
		} else {
			jQuery('#relationshiperr').text('');
		}

		if (valid) {
			jQuery('.partaddsucc_popup').show();
			setTimeout(function(){ window.location.replace("all_participant.html"); }, 3000);
		}
        return valid;

	});

	jQuery('.partaddsucc_popup .closepoup').on('click',function(){
		jQuery('.partaddsucc_popup').hide();
		modalShow(false);
	});

});
