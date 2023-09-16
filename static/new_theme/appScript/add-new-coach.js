$(document).ready(function(){
    addActiveRoute(routesUniqueClass.coachRoute)
    var ajaxType = (coachData) ? 'PUT' : 'POST';

    if (coachData){
        var jsonObj = JSON.parse(coachData)[0];
        populateCoachData(jsonObj);
    };

    $("#add_coach").validate({
        rules: {
            first_name: "required", 
            last_name: "required", 
            email: "required",
            username: "required",
            password: {
					required: true,
					minlength: 8
				},
            confmpassword: {
					required: true,
					minlength: 8,
                    equalTo: "#cnfm_password"
				},       
        },
    });
    var validators = $('#add_coach').validate()
    $.validator.methods.email = function ( value, element ) {
        return this.optional( element ) || emailRegex .test( value );
      }

    
$('#add_new_coach').click(function(){     
    if($("#add_coach").valid()){
        token = document.getElementsByName("csrfmiddlewaretoken")[0].value;
        email = $('#email').val()
        var data = {};
        data['first_name'] = $('#first_name').val();
        data['last_name'] = $('#last_name').val();
        data['title'] = $('#title').val();
        data['email'] = email;
        data['username'] = $('#username').val();
        data['password'] = $('#password').val();
        data['cnfm_password'] = $('#cnfm_password').val();
        data['company_name'] = $('#company_name').val();
        data['company_url'] = $('#company_url').val();
        data['coach_id'] = $('#coach_id').val();
        
        if ((data['first_name'] && data['last_name']  && data['email']  && data['username'] && data['password'] && data['cnfm_password']) != ""  && isValidEmailAddress(email)){
            if (data['coach_id'] == null || data['coach_id'] == ''){
                $.ajax({
                    type: ajaxType,
                    headers: {'X-CSRFToken': token},
                    url: addItem.Coach,
                    data: JSON.stringify(data),
                    processData: false,
                    contentType: false,
                    dataType: "json",
                    beforeSend: function() {
                        showLoader();
                    },
                    complete: function() {
                        hideLoader();
                    },
                    success:function(data) {
                        if (data['success']){
                            window.location = document.referrer;
                        }
                        else {
                            var attributes = {}
                            $.each(data.message, function(key, value) { 
                                attributes[key] = value
                                validators.showErrors(attributes)
                            })
                        }  
                    },
                    error: function(data) {
                        alert("Coach not created");
                    },
                });
            }
            else{
                $.ajax({
                    type: ajaxType,
                    headers: {'X-CSRFToken': token},
                    url: addItem.Coach,
                    data: JSON.stringify(data),
                    processData: false,
                    contentType: false,
                    dataType: "json",
                    beforeSend: function() {
                        showLoader();
                    },
                    complete: function() {
                        hideLoader();
                    },
                    success:function(data) {
                        if (data['success']){
                            window.location = document.referrer;
                        }
                        else{
                            var attributes = {}
                            $.each(data.message, function(key, value) { 
                                attributes[key] = value
                                validators.showErrors(attributes)
                            })
                        }
                    },
                    error: function(data) {
                        alert("Coach details are not updated");
                    }
                });
            }
        }   
    }       
    });    

});


function populateCoachData(data){
    $('#page_title').text('Edit Coach') ;
    $('#coach_id').val(data['id']) ;
    $('#first_name').val(data['first_name']) ;
    $('#last_name').val(data['last_name']) ;
    $('#email').val(data['user__email']) ;
    $('#email').attr('disabled',true) ;
    $('#username').val(data['user__username']) ;
    $('#username').attr('disabled',true) ;
    $('#company_name').val(data['company_name']) ;
    $('#company_url').val(data['company_url']) ;
    $('#title').val(data['title']) ;   
    
}
