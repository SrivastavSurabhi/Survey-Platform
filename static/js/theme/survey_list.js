jQuery(document).ready(function($){
	// jQuery for Sort by drop down
		jQuery('.sortbydropdowm').on('click',function(){
			jQuery(this).next('ul').slideToggle();
		});

		$(document).mouseup(function (e) {
		    var clientprofdropdown = $(".sortbydropdowm");
		    if (!clientprofdropdown.is(e.target)) {
		        jQuery('.sortbydropdowmlist').slideUp();
		    }
		});

	// Link Redirection on tr
	    $('table.cmn_table_wrp tr').on('click',function(){
	    	var dataurl = $(this).data('url');
	    	if(dataurl) {
	        	window.location.href = dataurl;
	        }
		});

	// Edit Delete Popup
		jQuery(document).on('click','.edittabbtn',function(){
			if(jQuery(this).closest('td').find('.editpopup_wrp').is(":visible")) {
				jQuery(this).closest('td').find('.editpopup_wrp').slideUp();
			} else {
				jQuery('.editpopup_wrp').slideUp();
				jQuery(this).closest('td').find('.editpopup_wrp').slideDown();
			}
		});

		$(document).mouseup(function(e) {
		    var container = $(".edittabbtn");
		    if (!container.is(e.target) ) {
		        jQuery('.editpopup_wrp').slideUp();
		    }
		});
});