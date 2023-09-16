jQuery(document).ready(function(){
	// jQuery for upload file
		jQuery('#fileupload').on('change',function(){
		  	var filename = jQuery('#fileupload')[0].files[0].name;
		  	jQuery('#fileuploadnametit').text(filename);
		  	jQuery('#fileuploadname').val(filename);
		});
	// jQuery for delete file popup
		jQuery(document).on('click','.deletefilebtn',function(){
			jQuery(this).next('.delete_file_popup').fadeIn();
			
		});

		jQuery('.delete_file_popup .closepoup,.delete_file_popup .canceldeletefile').on('click',function(){
			jQuery('.delete_file_popup').fadeOut();
		});

		jQuery('#deletefilefrm #subdeletefilefrm').on('click',function(e){

		 	 var id_number = $(this).attr('id');
	         let url = `documentdelete/${id_number}/`;
	         //alert(id_number);
	         var csrftoken = getCookie('csrftoken');
	         $.ajax({
	            url: '/delete-doc/',
	            headers: {'X-CSRFToken': csrftoken},
	            type: "DELETE",
	            dataType: "json"
	            }).done(
	               function(){alert("Deleted");}
	             ).fail(
	               function(){alert("Error");}
	             ) 
	    
		 });
});