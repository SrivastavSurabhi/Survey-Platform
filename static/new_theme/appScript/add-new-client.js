$(document).ready(function(){
    addActiveRoute(routesUniqueClass.clientRoute);
    var ajaxType = (clientData) ? 'PUT' : 'POST';

    if (clientData){
        var jsonObj = JSON.parse(clientData)[0];
        populateClientData(jsonObj);
    };

    $('#coach').change(function(){
        $('#coacherr').text('');
        errorBox('coach',false)
    });

    $("#add_client").validate({
        rules: {
            first_name: "required", 
            last_name: "required", 
            email: "required",
            username: "required",
            coach :"required",
            password: {
					required: true,
					minlength: 8
				},
            cnfmpassword: {
					required: true,
					minlength: 8,
                    equalTo: "#cnfmpassword"
				},       
        },
    });
    var validators = $('#add_client').validate()
    $.validator.methods.email = function ( value, element ) {
        return this.optional( element ) || emailRegex .test( value );
      }

    $('#save_client').click(function(){
        if($("#add_client").valid()){
            token = document.getElementsByName("csrfmiddlewaretoken")[0].value;
            email = $('#email').val()
            var data = {};
            data['first_name'] = $('#first_name').val();
            data['last_name'] = $('#last_name').val();
            data['email'] = email;
            data['username'] = $('#username').val();
            data['password'] = $('#password').val();
            data['cnfmpassword'] = $('#cnfmpassword').val();
            data['phone'] = $('#phone').val();
            data['organization'] = $('#organization').val();
            data['organization_url'] = $('#organization_url').val();
            data['title'] = $('#title').val();
            data['address'] = $('#address').val();
            data['zip'] = $('#zipcode').val();
            data['country'] = $('#country').val();
            data['state'] = $('#state').val();
            data['city'] = $('#city').val();
            data['coach'] = $('#coach').val();
            data['client_id'] = $('#client_id').val();
            if ((data['first_name'] && data['last_name']  && data['email']) != ""  && isValidEmailAddress(email)){
                if (data['client_id'] == null || data['client_id'] == ''){
                    $.ajax({
                        type: ajaxType,
                        headers: {'X-CSRFToken': token},
                        url: addItem.Client,
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
                            alert("Client not created");
                        },
                    });
                }
                else{
                    $.ajax({
                        type: ajaxType,
                        headers: {'X-CSRFToken': token},
                        url: addItem.Client,
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
                            alert("Client details are not updated");
                        }
                    });
                }
            }
        }
    });
});


function populateClientData(data){
    $('#page_title').text('Edit Client') ;
    $('#client_id').val(data['id']) ;
    $('#first_name').val(data['first_name']) ;
    $('#last_name').val(data['last_name']) ;
    $('#email').val(data['email']) ;
    $('#email').attr('disabled',true) ;
    $('#phone').val(data['phone']) ;
    $('#organization').val(data['company_name']) ;
    $('#organization_url').val(data['company_url']) ;
    $('#title').val(data['title']) ;
    $('#address').val(data['address']) ;
    $('#zipcode').val(data['zip']) ;
    $('#country').val(data['country']) ;
    $('#state').val(data['state']) ;
    $('#city').val(data['city']) ;
    $('#coach').val(data['coach_id']) ; 
    $('#username').val(data['user__username']) ;
    $('#username').attr('disabled',true) ;   
    $('.password').addClass('d-none');
    $('.cnfmpassword').addClass('d-none');
}
