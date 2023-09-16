jQuery(document).ready(function(){
	// jQuery for generate feedbact report form
		jQuery('#gener_feed_rep_frm #generfeedrepsub').on('click',function(e){
			//e.preventDefault();
			var valid = true;
			var genrepsuvysel = jQuery('#surforgenfeerep').val();
			if (genrepsuvysel == "" || genrepsuvysel == null || genrepsuvysel == "demo") {
				jQuery('#surforgenfeereperr').text('Please select survey to generate a feedback report.');
				valid = false;
			} else {
				jQuery('#surforgenfeereperr').text('');
			}
			return valid;
		});

		jQuery('#surforgenfeerep').on('click',function(){
				jQuery('#surforgenfeereperr').text('');
			
		});
});