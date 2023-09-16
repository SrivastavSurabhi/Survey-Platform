jQuery(document).ready(function($){
	// jQuery for upload logo
        jQuery(document).on('click','.feedback_form_logo a.uploadchangelogo',function(){
            jQuery('.feedback_form_logo input').trigger('click');
        });
        jQuery('.feedback_form_logo input').change(function() {
            var file = $(this)[0].files[0].name;
            var filesrc = $(this).closest('.feedback_form_logo').find('img');
            readURL(this,filesrc);
        });
    
    // jQuery for popup
        $('.feedback_form_inn_poup .closepoup').on("click",function(){
            $('.feedback_form_popup').hide();
        });

    // jQuery for thank popup
        $('.feedback_form_inn_poup .suresub').on("click",function(){
            $('.fedfrm_thank_popup').show();
            $('.feedback_form_popup').hide();
        });

        $('.fedfrm_thank_inn_poup .closepoup').on("click",function(){
            $('.fedfrm_thank_popup').hide();
        });
   
        $(".survey_paginat .nextpagination").on("click",function(){
            $(".feedback_scrtwo .feedqueans").hide();
            $('.comm-screen ul li:nth-child(2)').addClass("active");
            $('.comm-screen ul li:nth-child(1)').removeClass("active");
            $(".feedback_quetwo").show();
        });

        $(".survey_paginat .prevpagination").on("click",function(){
            $(".feedback_scrtwo .feedqueans").show();
            $('.comm-screen ul li:nth-child(2)').removeClass("active");
            $('.comm-screen ul li:nth-child(1)').addClass("active");
            $(".feedback_quetwo").hide();
        });
        
     //form validation
        $("#feedbackform button").on ("click",function(e){
            e.preventDefault()
            var currentbtn =  $(this).attr('id');
            // alert(currentbtn)
            var uemail = $("#uemail").val();
            var collename = $("#collename").val();
            var yourtitle = $("#yourtitle").val();
            var workedwith = $("#workedwith").val();
            var relationwith =$("#relationwith").val();
            valid = true;
        
            if(uemail=="" || uemail==null){
                $("#uemailerr").text("Please enter email");
                valid = false
            } else if(!isValidEmailAddress(uemail)){
                $('#uemailerr').text("Please enter valid email");
                valid= false
            } else{
                $("#uemailerr").text("");
            }
        
            if(collename=="" || collename==null){
                $("#collenmerr").text("Please select colleague name");
                valid = false
            } else{
                $("#collenmerr").text("");
            }
        
            if(yourtitle=="" || yourtitle==null){
                $("#titleerr").text("Please select title");
                valid = false
            } else{
                $("#titleerr").text("");
            }
        
            if(workedwith=="" || workedwith==null){
                $("#workederr").text("Please select How long have you worked with him/her");
                valid = false
            } else{
                $("#workederr").text("");
            }

            if(relationwith=="" || relationwith==null){
                $("#relationerr").text("Please select relation with him/her");
                valid = false
            } else{
                $("#relationerr").text("");
            }
            
            if(currentbtn == "feedformsubmit"){
                if(valid){
                    $('.feedback_form_popup').show();
                }     
            }

            return valid
        });

        $("#uemail").focusout(function(){
            var uemail = $(this).val()     
            if(uemail=="" || uemail==null){
                $('#uemailerr').text("Please enter email");
                valid = false    
            } else if(!isValidEmailAddress(uemail)){
                $('#uemailerr').text("Please enter valid email");
            } else{
                $('#uemailerr').text('');
            }
        });

        $("#collename").focusout(function(){
            var collename = $(this).val()   
            if(collename=="" || collename==null){
                $('#collenmerr').text("Please select colleague name");
                valid = false    
            }else{
                $('#collenmerr').text('');
            }

        });

        $("#yourtitle").focusout(function(){
            var yourtitle = $(this).val()     
            if(yourtitle=="" || yourtitle==null){
                $('#titleerr').text("Please slelect title");
                valid = false    
            }else{
                $('#titleerr').text('');
            }
        });

        $("#workedwith").focusout(function(){
            var workedwith = $(this).val()     
            if(workedwith=="" || uemail==null){
                $('#workederr').text("Please select How long have you worked with him/her");
                valid = false    
            }else{
                $('#workederr').text('');
            } 
        });

        $("#relationwith").focusout(function(){
            var relationwith = $(this).val()     
            if(relationwith=="" || relationwith==null){
                $('#relationerr').text("Please select relation with him/her");
                valid = false    
            }else{
                $('#relationerr').text('');
            }
        });

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

function isValidEmailAddress(emailAddress) {
    var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    return pattern.test(emailAddress);
}