
$(document).ready(function()
{    
    addActiveRoute(routesUniqueClass.participantRoute);
    setRelationSelectData(getRelations())

    var ajaxType = (participantRelation) ? 'PUT' : 'POST';

    if (participantRelation) {
        $('#relation').val(participantRelation)
        $('#client').val(participantClient)
    }

    if (participantData){
        var jsonObj = JSON.parse(participantData)[0];
        populateParticipantData(jsonObj);
    };

    $("#add_participant").validate({
        rules: {
            first_name: "required", 
            last_name: "required", 
            email: "required",
            relation: "required",
            coach: "required",
            client: "required",  
        },
    });
    var validators = $('#add_participant').validate()
    $.validator.methods.email = function ( value, element ) {
        return this.optional( element ) ||emailRegex.test( value );
      }

    
    $('#save_participant').click(function(){   
        if($("#add_participant").valid()){     
        token = document.getElementsByName("csrfmiddlewaretoken")[0].value;
        email = $('#email').val()
        var data = {};
        data['first_name'] = $('#first_name').val();
        data['last_name'] = $('#last_name').val();
        data['email'] = email;
        data['client'] =  ($('#client_id').val()) ? $('#client_id').val() : $('#client').val();//(participantClient) ? participantClient : $('#client').val();
        data['relation'] = $('#relation').val();
        data['participant_id'] = $('.participant_id').val();
        if ((data['first_name'] && data['last_name']  && data['email']) != "" && isValidEmailAddress(email)){
            $.ajax({
                type: ajaxType,
                headers: {'X-CSRFToken': token},
                url: addItem.Participant,
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
                    alert("Participant not created");
                },
            });
        }
    }
    });

    $('#coach').change(function () {
        client_list = $('#client').val()
        coach_id = $('#coach').val()
        var client_options = ''
        $.ajax({
            type: 'GET',
            url: filter.getClientsUrl,
            data: { 
                'coach_id': coach_id,                
            },
            async: false,
            success:function(data){
                $('#client').empty()
                if(data && data['success'] && data.client && data.client.length > 0){                    
                    var selectedValues = new Array();
                    $.each(data.client, function(key, value) {   
                        strvalue = value.id
                        client_options = ('<option value="'+value.id+'">'+value.first_name+' '+value.last_name+'</option>')
                        $('#client').append(client_options)
                        if (($.inArray(strvalue.toString(), client_list) > -1)){
                            selectedValues.push(value.id);
                        }                        
                    });
                    $('#client').val(selectedValues).trigger("change");                    
                }
            },
            error: function(data) {
                console.log('error');
            },
            });            
    })


});     

function setRelationSelectData(relations){
    if(relations && relations.length > 0)
    {
        var option
        $.each(relations, function(key, value) {   
            $('.relation').append('<option value="'+value.id+'">'+value.relation+'</option>')
        });
    }
}

function populateParticipantData(data){
    $('#page_title').text('Edit Participant') ;
    $('#first_name').val(data['first_name']) ;
    $('#last_name').val(data['last_name']) ;
    $('#email').val(data['email']) ;
    $('#email').attr('disabled',true) ;
}
