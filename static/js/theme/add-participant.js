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
		   if(relationship == "" || relationship == null || relationship == "demo")  {
			jQuery('#relationshiperr').text('Please select any one relationship');
		} else {
			jQuery('#relationshiperr').text('');
		}
   	});


	jQuery('#addparticipantfrm #addparticipantsub').on('click',function(e){
		// e.preventDefault();

		var valid = true;
		var fname = document.forms["addparticipantfrm"]["fname"].value;
		var lname = document.forms["addparticipantfrm"]["lname"].value;
		var email = document.forms["addparticipantfrm"]["email"].value;
		var relationship = document.forms["addparticipantfrm"]["relationship"].value;

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
		if(relationship == "" || relationship == null || relationship == "demo") {
			jQuery('#relationshiperr').text('Please select any one relationship');
			valid = false;
		} else {
			jQuery('#relationshiperr').text('');
		}

        return valid;

	});

	jQuery('#otherfrm #"othersub').on('click',function(e){
		var rel=document.forms["otherfrm"]["rel"].value;
		data.append('file', $('#rel')[0].files);
		var csrftoken = getCookie('csrftoken');
		$.ajax({
		    url: '/add-relation/',
		    headers: {'X-CSRFToken': csrftoken},
			data: data,
			processData: false,
			contentType: false,
			dataType: "json",
		    type: 'POST',// This is the default though, you don't actually need to always mention it
		    success: function(data) {
		        console.log(data);
		    },
		    failure: function(data) { 
		        alert('Got an error dude');
		    }
	});
	});

});
