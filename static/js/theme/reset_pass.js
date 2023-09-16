jQuery(document).ready(function(){
	// jQuery for reset password form valildation
		jQuery('#resetpassfrm #resetpasssub').on('click',function(){
			var valid = true;
			var resetpass = jQuery('#resetpass').val();
			var resetpasscnf = jQuery('#confresetpass').val();

			if(resetpass == "" || resetpass == null){
				jQuery('#resetpasserr').text("Please enter new password");
				valid = false;
			} else {
				jQuery('#resetpasserr').text('');
			}

			if(resetpasscnf == "" || resetpasscnf == null){
				jQuery('#resetcnfpasserr').text("Please enter new password");
				valid = false;
			} else if (resetpasscnf != resetpass) {
				jQuery('#resetcnfpasserr').text("Please check your password");
				valid = false;
			} else {
				jQuery('#resetcnfpasserr').text('');
			}

			return valid;

		});
});