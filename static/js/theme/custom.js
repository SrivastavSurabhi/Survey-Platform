jQuery(document).ready(function(){

    if (window.location.pathname === '/dashboard/') {
        $('.home-icon').addClass('disabled');
    }

    // dashboard 

    // ? - help box searchbar
    var search_bar = document.getElementById("searchBar");
    var div = $('.wrap-text');
    if (search_bar) {
        search_bar.onkeyup = function(){
            var search_value = search_bar.value.toLowerCase();
            $('.dash_instr_help_popup div.wrap-text').removeHighlight().highlight(search_value);
            for(var l = 0;l<div.length;l++){             
                if(div[l].innerHTML.toLocaleLowerCase().search(search_value) == -1){
                    div[l].style.display = 'none';
                }else{
                    div[l].style.display = 'block';                  
                }
            }
        }
    };
    
    // jQuery for Forgot Password Popup
    jQuery('.forgotpassbtn').on('click',function(){        
        jQuery('.forgotpass_popup').fadeIn();
    });
    jQuery('.forgotpass_popup .closepoup').on('click',function(){
        jQuery('.forgotpass_popup').fadeOut();
    });

// Login page validation

    var letters = /^[A-Za-z\s]+$/;
    var numbers = /^[0-9.,]+$/;
    var emailaddpatt = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

    jQuery('#loginemail').focusout(function () {
           var loginemail = jQuery(this).val();
        if(loginemail == "" || loginemail == null){
            jQuery('#loginemailerr').text('Please enter a valid Username or Email Address.');
        } else {
            jQuery('#loginemailerr').text('');
        }
     });

    jQuery('#loginpassword').focusout(function () {
           var loginpassd = jQuery(this).val();
        if(loginpassd == "" || loginpassd == null){
            jQuery('#loginpasserr').text('Please enter password.');
        } else {
            jQuery('#loginpasserr').text('');
        }
     });

    jQuery("#loginform #loginsub").on('click',function(e){
        e.preventDefault();

        var loginemail = jQuery('#loginemail').val();
        var loginpassd = jQuery('#loginpassword').val();

        if(loginemail == "" || loginemail == null){
            jQuery('#loginemailerr').text('Please enter email address.');
        } else if (loginemail != loginemail.match(emailaddpatt)) {
            jQuery('#loginemailerr').text('Please enter valid email Address.');
        } else {
            jQuery('#loginemailerr').text('');
        }

        if(loginpassd == "" || loginpassd == null){
            jQuery('#loginpasserr').text('Please enter password.');
        } else {
            jQuery('#loginpasserr').text('');
        }

    });

    $('#myTable').on('click', '.dltcli', function(){
    // $('.dltcli').click(function(){		
        	console.log(jQuery('#del_sur'))
        jQuery('#del_sur').modal('show');
        sur_link = jQuery('#curr_client_id').val($(this).attr('data'))
    });


    $('#delete_client').click(function(){
        var endpoint = $(location).attr("href");
        var csrftoken = $('input[name=csrfmiddlewaretoken]').val();
        $.ajax({
            method: "delete",
            headers: {'X-CSRFToken': csrftoken},
            url: endpoint,
            data: jQuery('#curr_client_id').val(),
            processData: false,
            contentType: false,
            dataType: "json",
            success:function(data) {	
                window.location.reload()
            },
            error: function(data) {
                window.location.reload()
            }
        });
    });

    $('#myTable').on('click', '.archivecli', function(){
    // $('.archivecli').on('click',function(){
        var endpoint = window.location.origin + "/archived-client/";
        cliid = $(this).attr("data");
        var data = new FormData();     
        data.append('id', cliid);
        data.append('mode', true);
        var csrftoken = $('input[name=csrfmiddlewaretoken]').val();
        $.ajax({
            method: "post",
            headers: {'X-CSRFToken': csrftoken},
            url: endpoint,
            data: data,
            processData: false,
            contentType: false,
            dataType: "json",
            success:function(data) {	
                window.location.reload()
            },
            error: function(data) {
                window.location.reload()
            }
        });
    });

    $('#myTable').on('click', '.unarchivecli', function(){
    // $('.unarchivecli').on('click',function(){
        var endpoint = window.location.origin + "/archived-client/";
        cliid = $(this).attr("data");
        var data = new FormData();     
        data.append('mode', false);
        data.append('id', cliid);
        var csrftoken = $('input[name=csrfmiddlewaretoken]').val();
        $.ajax({
            method: "post",
            headers: {'X-CSRFToken': csrftoken},
            url: endpoint,
            data: data,
            processData: false,
            contentType: false,
            dataType: "json",
            success:function(data) {	
                window.location.reload()
            },
            error: function(data) {
                window.location.reload()
            }
        });
    });

// client detail page 


// step2

// get all checked participants
function allCheckedEmail() { 
    var emails = [];				
    $.each($('#myTable1 tbody tr td input[name="client"]:checked'), function() {
            em = $(this).closest('tr').find("td:eq(4)").text();       
            emails.push(em);
    });
    return emails;
}

// when participant selected
jQuery('#send-survey').on('click',function(){
    if ($('#surveycat').val()=='demo'){
        $('#surveycaterr').text('Please select survey.')
    }
    else{
        id = $('#surveycat').val()
        var data = new FormData();
        data.append('sur_id', id);
        url = window.location.origin+'/get-survey-info/'
        var csrftoken = $('input[name=csrfmiddlewaretoken]').val();
        if ($('#myTable1 tbody tr td input[name="client"]:checked').length > 0) {
            $('#surveycaterr').text('');
            $('#scratchpopup').hide();            
            modalShow(false);         
            var emails = [];				
            $.each( $('#myTable1 input[name="client"]'), function() {
                    em = $(this).closest('tr').find("td:eq(4)").text();
                    emails.push(em);
            });        
            selectedmails = allCheckedEmail()   				
            data.append('emails', emails);				
            $.ajax({				
                    method: "POST",
                    headers: {'X-CSRFToken': csrftoken},
                    url: url,
                    data: data,
                    processData: false,
                    contentType: false,
                    dataType: "json",
                    success:function(data) {
                        if (data['tosend'] == 'undefined' || data['tosend'] == null) {
                            if(data['success'] !== undefined && data['success'] !== null){
                                alert(data['success'])
                                $('#surveycat').val('demo')
                            }
                            else{
                                $('.buy_survey_popup h5').text(data['fail'])
                                $('.buy_survey_popup').show()
                                modalShow(true);
                                $('#surveycat').val('demo')	       
                            }                 
                        }                        
                        else{                                
                           if (data['alreadysent'].some(r=> selectedmails.includes(r))){
                                $('.showmails').show();
                                $('#send_survey').addClass('restrict')
                           }
                           else{
                                jQuery($('.cnfm_popup'+id)).show();
                                modalShow(true);
                           }

                            cli_count = data['tosend'].length
                            alreadysent_count = data['alreadysent'].length
                            if(alreadysent_count === 0){
                                $('.showmails').hide();
                                $('#send_survey').removeClass('restrict')
                                jQuery($('.cnfm_popup'+id)).show();
                                modalShow(true);
                                
                            }					
                            
                            $('#myTable1 input[name="client_count"]').val(cli_count)
                            greaterval = (cli_count >= alreadysent_count) ? data['tosend'] : data['alreadysent'];
                            $('#mailhistory').empty()
                        
                            for ( val in data['alreadysent']){	
                                $('#myTable1 tbody tr').each(function(){                                    
                                    if($(this).find('td:eq(4)').text().trim() == data['alreadysent'][val]){
                                        id = $(this).attr('id')
                                        $('#myTable1 tbody tr[id^="'+id+'"] td input[name="client"]').prop('checked', false).prop('disabled', true);
                                        $('#myTable1 tbody tr[id^="'+id+'"] td label.input_design').addClass('check-disable')
                                    }
                                }) 

                                a=data['alreadysent'][val]|| '-'
                                $('#mailhistory').append('<li>'+a +'</li>')
                                $('#myTable1 input[name="client"]:checked').each(function(){
                                    if (a==$(this).closest('tr').find("td:eq(4)").text().trim()){
                                        $(this).prop('checked', false).prop('disabled', true);
                                        $(this).closest('tr').find("td label.input_design").addClass('check-disable')
                                        }
                                    })
                            }

                            $("#myTable1 thead tr th input[name='selectallparti']").prop('checked',  
                            $("#myTable1 tbody tr td input[name='client']:checked").length === $("#myTable1 tbody tr td input[name='client']").length);

                            $('.alreadysent').text(alreadysent_count)
                                $('.part_count').empty();
                                $('.client_count').empty();
                                $('.part_count').append(cli_count+' Participants')
                                $('#myTable1 input[name="client"]:checked').each(function(i){
                                    // for ( email in data['tosend']){
                                    //     if (data['tosend'][email]==$(this).closest('tr').find('.eMail').text().trim()){
                                                $('.client_count').append('<li><span class="cstm_email_count">'+data['tosend'][i]+'</span><a class="dropdown-item" href="#" data_id="'+$(this).closest('tr').attr('id')+'"><i class="fa fa-trash" aria-hidden="true"></i></a></li>') 
                                    //     }
                                    // }

                                });	
                            }
                        
                    },
                    error: function(data) {                        
                        console.log(data['fail'])
                    }
                });


        } else {
            jQuery($('.fail_popup')).show();
            modalShow(true);
        }
            $.ajax({				
                method: "POST",
                headers: {'X-CSRFToken': csrftoken},
                url: url,
                data: data,
                processData: false,
                contentType: false,
                dataType: "json",
                success:function(data) {
                    if (data['campaign'] != 'undefined'|| data['campaign'] != null) {
                        for(campaign in data['campaign']){
                            id = data['campaign'][campaign][5]
                            $('#myTable1 tbody tr[id^="'+id+'"] td input[name="client"]').prop('disabled', true).prop('checked', false);
                            $('#myTable1 tbody tr[id^="'+id+'"] td label.input_design').addClass('check-disable')
                                        
                            // $('tr[id^="'+id+'"] .first_heading input').prop('disabled', true);
                            // $('tr[id^="'+id+'"] .first_heading label').addClass('check-disable')
                        }
                    }
                }
            })
            
        	
    }
});

// when survey selected and participants not selected
jQuery('#send_survey').on('click',function(){
    jQuery('#surveyreminderid').val('demo');   
        if (jQuery('#surveycat').val() === 'demo' ){
            jQuery('#scratchpopup').show();
            modalShow(true);
        }
        else{
            if ($('#myTable1 input[name="client"]:checked').length > 0) {	
                if($(this).hasClass('restrict')){
                    id = $('#surveycat').val()
                    var emails = allCheckedEmail();	               
                    url = window.location.origin+'/get-survey-info/'
                    var data = new FormData();
                    data.append('sur_id', id);				
                    data.append('emails', emails);				
                    var csrftoken = $('input[name=csrfmiddlewaretoken]').val();
                    $.ajax({				
                            method: "POST",
                            headers: {'X-CSRFToken': csrftoken},
                            url: url,
                            data: data,
                            processData: false,
                            contentType: false,
                            dataType: "json",
                            success:function(data) {
                                if (data['fail']){
                                    $('.buy_survey_popup h5').text(data['fail'])
                                    $('.buy_survey_popup').show()
                                    $('#surveycat').val('demo')
                                }
                                cli_count = data['tosend'].length
                                if(emails.length === cli_count){
                                    jQuery($('.cnfm_popup'+id)).show();
                                    modalShow(true);
                                }
                                else{								
                                    $('.showmails').show();
                                    $('#send_survey').addClass('restrict')
                                }						
                                
                                alreadysent_count = data['alreadysent'].length
                                if(alreadysent_count === 0){
                                    $('.showmails').hide();
                                    $('#send_survey').removeClass('restrict')
                                    jQuery($('.cnfm_popup'+id)).show();
                                    modalShow(true);
                                }
                                		
                                $('#myTable1 input[name="client_count"]').val(cli_count)
                                greaterval = (cli_count >= alreadysent_count) ? data['tosend'] : data['alreadysent'];
                                $('#mailhistory').empty()

                                for ( val in data['alreadysent']){
                                     $('#myTable1 tbody tr td:eq(4)').each(function(){
                                        if($(this).text().trim() == data['alreadysent'][val]){
                                            id = ($(this)).parent().attr('id')
                                            $('#myTable1 tbody tr[id^="'+id+'"] td input[name="client"]').prop('disabled', true).prop('checked', false);
                                            $('#myTable1 tbody tr[id^="'+id+'"] td label.input_design').addClass('check-disable')
                                        }
                                    })

                                    a=data['alreadysent'][val]|| '-'
                                    $('#mailhistory').append('<li>'+a +'</li>')
                                    $('#myTable1 input[name="client"]:checked').each(function(){
                                    if (a==$(this).closest('tr').find("td:eq(4)").text().trim()){
                                        $(this).prop('checked', false);
                                        }
                                    })
                                }

                                $("#myTable1 thead tr th input[name='selectallparti']").prop('checked',
                                $("#myTable1 tbody tr td input[name='client']:checked").length === $("#myTable1 tbody tr td input[name='client']").length);

                                $('.alreadysent').text(alreadysent_count)
                                    $('.part_count').empty();
                                    $('.client_count').empty();
                                    $('.part_count').append(cli_count+' Participants')
                                    $('#myTable1 input[name="client"]:checked').each(function(i){
                                        // for ( email in data['tosend']){
                                            // if (data['tosend'][email]==$(this).closest('tr').find('.eMail').text().trim()){
                                                $('.client_count').append('<li><span class="cstm_email_count">'+data['tosend'][i]+'</span><a class="dropdown-item" href="#" data_id="'+$(this).closest('tr').attr('id')+'"><i class="fa fa-trash" aria-hidden="true"></i></a></li>')
                                        //     }
                                        // }
                                    });	
                            }
                        });
                }
                else{
                    id = $('#surveycat').val()			
                    jQuery($('.cnfm_popup'+id)).show();
                    modalShow(true);
                }				
            } else {
                jQuery($('.fail_popup')).show();
                modalShow(true);
            }		
        }	    
});

// after parameter pop up get values for next pop up
jQuery(document).on('click','#send_sur_cont',function(){
    element = jQuery('.email_preview_popup .ready_confirmation')			
    $(element).parent().prev().find('#datepicker').prev().show(); //show date as text
    $(element).parent().prev().find('#datepicker').hide() //if datepicker is visible hide it
    url = window.location.href
    id = jQuery($('#surveycat')).val();
    option1 = $('input[name="surveymarkcomplet'+id+'"]:checked').val()
    option2 = $('input[name="whentoreminderval'+id+'"]:checked').val()
    option3 = $('input[name="reminderval'+id+'"]:checked').val()
    var csrftoken = $('input[name=csrfmiddlewaretoken]').val();
    if(!option2 && option3 !="NOREMINDER"){
        $('.cnfm_popup .custom-alert-text').show()
        modalShow(true);
    }
    else{
    var data = new FormData();
    data.append('id', id);
    data.append('option1', option1);
    data.append('option2', option2);
    data.append('option3', option3);		
    $.ajax({
        method: "POST",
        headers: {'X-CSRFToken': csrftoken},
        url: url,
        data: data,
        processData: false,
        contentType: false,
        dataType: "json",
        // beforeSend: function() {
        //    console.log("request sent");
        // },
        // complete: function() {
        //     console.log("request completed");
        // },
        success:function(data) {
            $('.ready_confirmation').text('Send')
            $('#email_preview').find('#upper-text').html("");
            $('.cnfm_popup'+id).hide();
            modalShow(false);
            if (data['surinst'] != '' && data['surinst'] != null){
                $('#email_preview').find('#instr').empty()
                $('#email_preview').find('#instr').append(data['surinst'])
            }
            enddate = data['dt']
            $('#email_preview').find('#bottom-text').empty()            
            $('#email_preview').find('#bottom-text').append(data['surbtm'])								
            $('#email_preview').find('#upper-text').html(data['surtop'])   
            
            var emails = allCheckedEmail()
            url = window.location.origin+'/get-survey-info/'
            var data = new FormData();
                data.append('sur_id', id);				
                data.append('emails', emails);				
                var csrftoken = $('input[name=csrfmiddlewaretoken]').val();
                $.ajax({				
                        method: "POST",
                        headers: {'X-CSRFToken': csrftoken},
                        url: url,
                        data: data,
                        processData: false,
                        contentType: false,
                        dataType: "json",
                        success:function(data) {
                            $('#email_preview .date-text').text(enddate)
                            cli_count = data['tosend'].length								
                            $('#myTable1 input[name="client_count"]').val(cli_count)
                            $('.part_count').empty();                       
                            if(cli_count == 0){
                                if ($('.ready_confirmation').hasClass('onlysave')){
                                    $('.ready_confirmation').prop('disabled', false);
                                }
                                else{
                                    $('.ready_confirmation').prop('disabled', true);
                                }
                            }
                            else{
                                $('.ready_confirmation').prop('disabled', false);
                                $('.part_count').empty();
                                $('.part_count').append(cli_count+' Participants')
                            }

                        if ($('.ready_confirmation').hasClass('onlysave')){
                            $('.part_count').append(0+' Participant')
                            $('.ready_confirmation').prop('disabled', false);
                        }
                        else{
                            $('.part_count').empty();
                            $('.part_count').append(cli_count+' Participants')
                        }
                        $('.client_count').empty()
                        $('#myTable1 input[name="client"]:checked').each(function(i){                           
                            // for ( email in data['tosend']){                                
                                // if (data['tosend'][email]==$(this).closest('tr').find('.eMail').text().trim()){
                                        $('.client_count').append('<li><span class="cstm_email_count">'+data['tosend'][i]+'</span><a class="dropdown-item" href="#" data_id="'+$(this).closest('tr').attr('id')+'"><i class="fa fa-trash" aria-hidden="true"></i></a></li>')
                                
                                // }
                            // }
                        });	

                        $('#email_preview').show();	
                        modalShow(true);
                        }
                    });
            
        },
        error: function(data) {
            console.log(data['fail'])
        }
        });	
    }
});

    $(document).on('click','.remove_intake_img',function() {
        var endpoint = window.location.origin+'/profile/'
        var csrftoken = $('input[name=csrfmiddlewaretoken]').val();
        $.ajax({			
            method: "delete",	
            headers: {'X-CSRFToken': csrftoken},
            url: endpoint,				
            processData: false,
            contentType: false,
            dataType: "json",
            success:function(data) {	
                $('.logo_container').empty()
                $('.logo_container').append('<a href="javascript:;" class="upload_logo sitebtn ">Add logo</a>')			
            },
            error: function(data) {
                console.log('error')
            }
        });
    });


    $('#sendmail').click(function(){
        var data = new FormData($('#sendmailform').get(0));
        data.append('cdesc', $('.client_email_content').html())
        var endpoint = $("#sendmailform").attr("url");
        var csrftoken = $('input[name=csrfmiddlewaretoken]').val();
        $.ajax({
                method: "POST",
                headers: {'X-CSRFToken': csrftoken},
                url: endpoint,
                data: data,
                processData: false,
                contentType: false,
                dataType: "json",
                success:function(data) {		
                    console.log(data['fail'])				
                    if (data['success'] == 'undefined'|| data['success'] == null) {
                        alert(data['fail'])
                      }
                      else {
                        alert(data['success'])
                        $('#allParticipants').modal('hide');
                      }
                },
                error: function(data) {
                    if (data['success'] == 'undefined'|| data['success'] == null) {
                        console.log(data['fail'])
                      }
                      else {
                        console.log(data['success'])
                      }
                }
            });
    });

    $('#send_client_form').click(function(){
       
        var data = new FormData($('#clientintakemail').get(0));
        data.append('upper-text', $('#upper-text').html());
        data.append('bottom-text', $('#bottom-text').html());
        var endpoint = $(this).attr("url");
        var csrftoken = $('input[name=csrfmiddlewaretoken]').val();
        $.ajax({
                method: "POST",
                headers: {'X-CSRFToken': csrftoken},
                url: endpoint,
                data: data,
                processData: false,
                contentType: false,
                dataType: "json",
                success:function(data) {		
                    if (data['success'] == 'undefined'|| data['success'] == null) {
                        alert(data['fail'])
                      }
                      else {
                        alert(data['success'])
                        $('#allParticipants').modal('hide');
                        window.location.reload()
                      }
                },
                error: function(data) {
                    if (data['success'] == 'undefined'|| data['success'] == null) {
                        // alert(data['fail'])
                      }
                      else {
                        // alert(data['success'])
                      }
                }
            });
    });

//        $('#srch').keyup(function(){
//            $(document).ready(function(){
          $("#global_search").on("keyup", function() {
            var value = $(this).val().toLowerCase();
            $("table tr").filter(function() {
              $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            });
          });

////            var text=$('input[type="search"]').val();
////            console.log(text)
//            var input, filter, table, tr, td, i, txtValue;
//            input = document.getElementById("global_search");
//            filter = input.value.toUpperCase();
//            table = document.getElementById("myTable");
//            tr = table.getElementsByTagName("tr");
//            for (i = 0; i < tr.length; i++) {
//                td = tr[i].getElementsByTagName("td")[2];
//                if (td) {
//                  txtValue = td.textContent || td.innerText;
//                  console.log(txtValue)
//                  if (txtValue.toUpperCase().indexOf(filter) > -1) {
//                    tr[i].style.display = "";
//                  } else {
//                    tr[i].style.display = "none";
//                  }
//                }
//            }
//        });


   jQuery('#forgotpassfrm #forgotpasssub').on('click',function(e){
        // e.preventDefault();
        var email = document.forms["forgotpassfrm"]["email"].value;
        if(email == "" || email == null){
            jQuery('#emailerr').text('Please enter email address.');
        }  else {
            jQuery('#emailerr').text('');
        }
    });

 //  checkbox checked jquery
     jQuery('.checkbox_cmnwrp input[type="checkbox"]').on('click',function(){
         jQuery(this).closest('.checkbox_cmnwrp').toggleClass('checked');
     });

  


    // remove error message after enter right value.
    jQuery('#first_name').on('keyup',function(e){
        var fname = document.forms["signupfrm"]["first_name"].value;
        var fnameRegex = /^[a-zA-Z]{3,16}$/;
        if(fnameRegex.test(fname)) {
            jQuery('#fnameerr').text('');
        }
    })
    jQuery('#last_name').on('keyup',function(e){
        var lname = document.forms["signupfrm"]["last_name"].value;
        var lnameRegex = /^[a-zA-Z]{3,16}$/;
        if(lnameRegex.test(lname)) {
            jQuery('#lnameerr').text('');
        }
        
    })
    // jQuery('#email').on('keyup',function(e){
    //     var email = document.forms["signupfrm"]["email"].value;
    //     var emailRegex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    //     if(emailRegex.test(email)) {
    //         jQuery('#signupemallerr').text('');
    //     }
        
    // })
    jQuery('#title').on('keyup',function(e){
        var title = document.forms["signupfrm"]["title"].value;
        if(title != "" || title != null) {
            jQuery('#titleerr').text('');
        }
        
    })
    jQuery('#companyname').on('keyup',function(e){
        var companyname = document.forms["signupfrm"]["company_name"].value;
        // var companyRegex = /^[0-9a-zA-Z]{5,50}$/;
        if(companyname != '' || companyname != null ) {
            jQuery('#companynameerr').text('');
        }     
    })
    jQuery('#company_url').on('keyup',function(e){
        var companyurl = document.forms["signupfrm"]["company_url"].value;
        var companyurlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
        if(companyurlRegex.test(companyurl)) {
            jQuery('#companyurlerr').text('');
        }  
    })
    jQuery('#username').on('keyup',function(e){
        var username = document.forms["signupfrm"]["username"].value;
        if(username != "" || username != null) {
            jQuery('#usernameerr').text('');
        }     
    })
    jQuery('#pass').on('keyup',function(e){
        var password = document.forms["signupfrm"]["pass"].value;
        if(password != "" || password != null) {
            jQuery('#signuppasserr').text('');
        }     
    })
    

// Signup Form Validation jquery
    jQuery('#signupfrmsub').on('click',function(e){         
        var fname = document.forms["signupfrm"]["first_name"].value;
        var lname = document.forms["signupfrm"]["last_name"].value;
        var email = document.forms["signupfrm"]["email"].value;
        var title = document.forms["signupfrm"]["title"].value;
        var companyname = document.forms["signupfrm"]["company_name"].value;
        var companyurl = document.forms["signupfrm"]["company_url"].value;
        var username = document.forms["signupfrm"]["username"].value;
        var password = document.forms["signupfrm"]["pass"].value;
        var cpassword = document.forms["signupfrm"]["cpass"].value;
        var termsofuse = jQuery('#termsofuse');
        var valid = true;
        var emailRegex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        var fnameRegex = /^[a-zA-Z]{3,16}$/;
        var lnameRegex = /^[a-zA-Z]{3,16}$/;
        var passRegex = /^[0-9a-zA-Z]{5,}$/;
        var companyurlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
        
        if(fname == "" || fname == null) {
            jQuery('#fnameerr').text('Please enter first name');
            valid = false;
        } 
        else if(!fnameRegex.test(fname)) {
            jQuery('#fnameerr').text('Please enter valid first name');
            valid = false;
        }
        else {
            jQuery('#fnameerr').text('');
        }

        if(lname == "" || lname == null) {
            jQuery('#lnameerr').text('Please enter last name');
            valid = false;
        }
        else if(!lnameRegex.test(lname)) {
            jQuery('#lnameerr').text('Please enter valid last name');
            valid = false;
        }
        else {
            jQuery('#lnameerr').text('');
        }

        if(email == "" || email == null) {
            
            jQuery('#signupemallerr').text('Please enter email address');
            valid = false;
        }
        else if(!emailRegex.test(email)) {
            
            jQuery('#signupemallerr').text('Please enter a valid email address');
            valid = false;
        }
          else {
            jQuery('#signupemallerr').text('');
        }

        if(title == "" || title == null) {
            jQuery('#titleerr').text('Please enter title');
            valid = false;
        } else {
            jQuery('#titleerr').text('');
        }

        if(companyname == "" || companyname == null) {
            jQuery('#companynameerr').text('Please enter company name');
            valid = false;
        }
        else {
            jQuery('#companynameerr').text('');
        }
        
        // if(companyurl == "" || companyurl == null) {
        //     jQuery('#companyurlerr').text('');
        // }
        // else if(!companyurlRegex.test(companyurl)) {
        //     jQuery('#companyurlerr').text('Please enter a valid company url');
        //     valid = false;
        // }
        // else{
        //     jQuery('#companyurlerr').text('');
        // }
       

        if(username == "" || username == null) {
            jQuery('#usernameerr').text('Please enter username');
            valid = false;
        } else {
            jQuery('#usernameerr').text('');
        }

        if(password == "" || password == null) {
            jQuery('#signuppasserr').text('Please enter password');
            valid = false;
        } else {
            jQuery('#signuppasserr').text('');
        }

        if(cpassword == "" || cpassword == null) {
            jQuery('#csignuppasserr').text('Please enter correct password');
            valid = false;
        } else {
            jQuery('#csignuppasserr').text('');
        }

        if(cpassword != password) {
            jQuery('#csignuppasserr').text('Password not matched');
            valid = false;
        } else {
            jQuery('#csignuppasserr').text('');
        }
    
        if($(termsofuse).prop("checked") == false){
            jQuery('#tremserr').text('Please check checkbox.');
            valid = false;
            } else {
            jQuery('#tremserr').text('');
        }
        
        return valid;

    });

    // jQuery for client dashboard page
    jQuery('.all_client_info .client_dash_wrp:first-child').addClass('open_menu');
    jQuery('.all_client_info .client_dash_wrp:first-child .child_menu').slideDown();
    jQuery('.client_dash_wrp .leftsid_toggle_wrp a.toggledashleftsidbar').on('click',function(){
        var parentwrp = jQuery(this).closest('.client_dash_wrp');
        var childwrp = jQuery(this).closest('.client_dash_wrp').find('.child_menu');
        jQuery(parentwrp).toggleClass('open_menu');
        jQuery(childwrp).slideToggle();
    });


// jQuery for profile dropdown
jQuery('.clientprofile a').on('click',function(){
    if($(".profile_dropdown").is(":visible")) {
        jQuery(this).next().slideUp();
    } else {
        jQuery(this).next().slideDown();
    }
});

$('body').on('click', '.send_reminder', function(){
    id = $(this).attr('id')	
    $('#surveyreminderid').val(id)	
    url = window.location.origin+'/get-survey-info/'
    var data = new FormData();
        data.append('sur_id', id);				
        data.append('info', 'true');				
        var csrftoken = $('input[name=csrfmiddlewaretoken]').val();
        $.ajax({				
                method: "POST",
                headers: {'X-CSRFToken': csrftoken},
                url: url,
                data: data,
                processData: false,
                contentType: false,
                dataType: "json",
                success:function(data) {
                    $('.parameter_reminder_popup input[value="'+data['status']+'"]').attr('checked', true )
                    jQuery($('.parameter_reminder_popup')).modal('show');
                    modalShow(true);
                }})	
    
});

jQuery('#send-reminder').on('click',function(){
    if ($('#surveyreminderid').val()=='demo'){
        $('#surveycaterr').text('Please select survey.')
    }
    else{
            $('#surveycaterr').text('')
            id = $('#surveyreminderid').val()	
            url = window.location.origin+'/get-survey-info/'
        var data = new FormData();
        data.append('sur_id', id);				
        data.append('info', 'true');				
        var csrftoken = $('input[name=csrfmiddlewaretoken]').val();
        $.ajax({				
                method: "POST",
                headers: {'X-CSRFToken': csrftoken},
                url: url,
                data: data,
                processData: false,
                contentType: false,
                dataType: "json",
                success:function(data) {
                    $('.parameter_reminder_popup input[value="'+data['status']+'"]').attr('checked', true )
                    $('#reminder_survey').hide();
                    modalShow(false);
                    jQuery($('.parameter_reminder_popup')).modal('show');
                    modalShow(true);
                    
                }})			
            // jQuery($('.parameter_reminder_popup')).modal('show');
            // $('#reminder_survey').hide();
    }
});




jQuery('#send_reminder').on('click',function(){
    if ($('#surveyreminderid').val() == 'demo' ){
        console.log( jQuery($('#reminder_survey')))
        jQuery($('#reminder_survey')).show();
        modalShow(true);
    }
    else{
            // id = $('#surveyreminderid').val()		
            console.log(jQuery($('.parameter_reminder_popup')))	
            jQuery($('.parameter_reminder_popup')).show();
            modalShow(true);
    }
});

jQuery('.cnfm_popup  .closepoup').on('click',function(){
    id = $('#surveycat').val()			
    $('.cnfm_popup'+id).hide();		
    modalShow(false);
});

jQuery('.sucss_popup .closepoup').on('click',function(){
    jQuery($('.sucss_popup')).hide();		
    modalShow(false);
});

jQuery('.fail_popup button').on('click',function(){
    $('#send_survey').addClass('restrict')
    jQuery($('.fail_popup')).hide();;
    id = $('#surveycat').val();
    rid = $('#surveyreminderid').val()			
    $('.cnfm_popup'+id).hide();
    $('.parameter_reminder_popup').modal('hide');
    jQuery($('.create_survay_popup')).hide();	
    jQuery($('.reminder_survay_popup')).hide();	
    modalShow(false);
});

jQuery('.fail_popup .closepoup').on('click',function(){
    jQuery($('.fail_popup')).hide();
    modalShow(false);
    $('#send_survey').addClass('restrict')		
});

jQuery('.create_survay_popup .closepoup').on('click',function(){
    jQuery($('.create_survay_popup')).hide();		
});

jQuery('#show_parameter').on('click',function(){
    $('.showmails').hide();
    id = $('#surveycat').val()
    modalShow(false);
    $('#send_survey').removeClass('restrict');
    jQuery($('.cnfm_popup'+id)).show();
    modalShow(true);
})  


jQuery('.email_preview_popup .close1').on('click',function(){
    jQuery('.email_preview_popup').hide();
    modalShow(false);
})

jQuery('#ready_confirmation .closepoup').on('click',function(){

    jQuery('#ready_confirmation').hide();
    modalShow(false);
})

jQuery('.showmails .closepoup').on('click',function(){
    jQuery('.showmails').hide();
    modalShow(false);
})

jQuery('.reminder_survay_popup  .closepoup').on('click',function(){
    jQuery('.reminder_survay_popup ').hide();
    modalShow(false);
})

jQuery('.parameter_reminder .closepoup').on('click',function(){
    jQuery('.parameter_reminder').hide();
    modalShow(false);
})

jQuery('.reminder_email_preview_popup  .close1').on('click',function(){
    jQuery('.reminder_email_preview_popup ').hide();
    modalShow(false);
    $('.ready_confirmation').removeClass('onlysave')
    if($(this).hasClass('sur_param')){
        id = $('#surveycat').val()			
        $(this).removeClass('sur_param')
        modalShow(false);
        jQuery($('.cnfm_popup'+id)).show();
        modalShow(true);
    }
    
})

jQuery('.reminder_ready_confirmation_popup .closepoup').on('click',function(){
    jQuery('.reminder_ready_confirmation_popup').hide();
    modalShow(false);
})

jQuery('.email_preview_popup .ready_confirmation').on('click',function(){			
    jQuery('#ready_confirmation h2 span').text(cli_count)
    jQuery('#email_preview').hide();
    modalShow(false);
    jQuery('#ready_confirmation').show();
    modalShow(true);
    console.log($(this).parent().prev().find('#datepicker'),'element')
    console.log($(this).parent().prev().find('#datepicker').is(":visible"),'appearance')
//    if($(this).parent().prev().find('#datepicker').is(":visible")){
        $(this).parent().prev().find('#datepicker').prev().show();
        $(this).parent().prev().find('#datepicker').hide()
//    }
})

jQuery(document).on('click','.client_count a',function(){    
    id = $(this).attr('data_id')	
    $(this).parent().hide();
    $('.'+id)
    cli_count = parseInt($('.part_count').text().split(' Participants')[0]) - 1;
    $('.part_count').empty();
    $('.part_count').append(cli_count+' Participants')
    $('#myTable1 tr[id="'+id+'"]').find('input[name="client"]').prop('checked', false);
    $('input[name="selectallparti"]').prop('checked', false);
    if(cli_count == 0){
        if ($('.ready_confirmation').hasClass('onlysave')){
            $('.ready_confirmation').prop('disabled', false);
        }
        else{
            $('.ready_confirmation').prop('disabled', true);
        }
    }
})

jQuery('.reminder_email_preview_popup .ready_confirmation').on('click',function(){
       $(this).parent().prev().find('#datepicker').prev().show();
       $(this).parent().prev().find('#datepicker').hide()
    jQuery('#reminder_email_preview').hide();
    modalShow(false);

    if(!$(this).hasClass('onlysave')){
    cli_count = $('.reminder_email_preview_popup .part_count').text().trim().split(' Participant')[0];
    jQuery('#reminder_ready_confirmation h2 span').text(cli_count)
    jQuery('#reminder_ready_confirmation').show();
    modalShow(true);
    }
    else{
        id = $('#surveycat').val()			
        jQuery($('.cnfm_popup'+id)).show();
        modalShow(true);
        // url = window.location.href.split('#')[0]
        id = $('.ready_confirmation').attr('data_id');
        url = window.location.origin+'/client-detail/'+id
            var data = new FormData();
            data.append('id', id);
            data.append('instr', document.getElementById('rem_instr').innerHTML);
            data.append('bottom_text', document.getElementById('rem_bottom-text').innerHTML);
            data.append('upper-text', document.getElementById('rem_upper-text').innerHTML);
            var endpoint = document.location.origin + '/send_survey/';
            var csrftoken = $('input[name=csrfmiddlewaretoken]').val();
            $.ajax({				
                    method: "POST",
                    headers: {'X-CSRFToken': csrftoken},
                    url: endpoint,
                    data: data,
                    processData: false,
                    contentType: false,
                    dataType: "json",
                    success:function(data) {
						$('.ready_confirmation').removeClass('onlysave')
                        console.log('Successfuly saved data in db.')
                        
                    },
                    error: function(data) {
                        console.log(data['fail'])
                    }
                });
    }
            
})

jQuery('#mail-subject').on('focusout', function(){
    sub = $(this).val();
    var data = new FormData();
    data.append('sub', sub);
    survey_id = $('.send-client-report').attr('data');
    data.append('survey_id',survey_id)
    var endpoint = document.location.origin + '/save_mail_content/';
    var csrftoken = $('input[name=csrfmiddlewaretoken]').val();
    $.ajax({
        method: "POST",
        headers: {'X-CSRFToken': csrftoken},
        url: endpoint,
        data: data,
        processData: false,
        contentType: false,
        dataType: "json",
        success:function(data){
            console.log(data['success'])
        } })

});
jQuery('#upper-mail-text').on('focusout', function(){
    cont = $(this).html();
    var data = new FormData();
    data.append('cont', cont);
    survey_id = $('.send-client-report').attr('data');
    data.append('survey_id',survey_id)
    var endpoint = document.location.origin + '/save_mail_content/';
    var csrftoken = $('input[name=csrfmiddlewaretoken]').val();
    $.ajax({
        method: "POST",
        headers: {'X-CSRFToken': csrftoken},
        url: endpoint,
        data: data,
        processData: false,
        contentType: false,
        dataType: "json",
        success:function(data){
            console.log(data['success'])
        } })

});

jQuery('.send_email').on('click',function(){
    url = window.location.href.split('#')[0]
    id = jQuery($('#surveycat')).val();	
    var emails = allCheckedEmail()
    var data = new FormData($('#sendemailtopart').get(0));
    data.append('email', emails);
    data.append('id', id);
    data.append('no', emails.length);
    data.append('instr', document.getElementById('instr').innerHTML);

    data.append('bottom_text', document.getElementById('bottom-text').innerHTML);
    data.append('upper-text', document.getElementById('upper-text').innerHTML);
    var endpoint = document.location.origin + '/send_survey/';
    var csrftoken = $('input[name=csrfmiddlewaretoken]').val();
    $.ajax({
            method: "POST",
            headers: {'X-CSRFToken': csrftoken},
            url: endpoint,
            data: data,
            processData: false,
            contentType: false,
            dataType: "json",
            success:function(data) {
                if (data['success'] == 'undefined'|| data['success'] == null) {
                    alert(data['fail'])
                }
                else{                  
                    $('#myTable1 tbody tr td input[name="client"]').prop('disabled', false).prop('checked', false);
                    $('#myTable1 tbody tr td label.input_design').removeClass('check-disable')
                    $('.sucss_popup').find('h5').text(data['success'])	
                    $(' #ready_confirmation').hide();	
                    modalShow(false);
                    jQuery($('.sucss_popup')).show();	
                    modalShow(true);
                    $('#surveycat').val('demo')	
                    $('#surveycat option[value='+id+']').remove()	
                }                    			
            },
            error: function(data) {
                console.log(data['fail'])
            }
        });
                    
})

jQuery('.send_reminder_email').on('click',function(){
    url = window.location.href.split('#')[0]
    id = jQuery($('#surveyreminderid')).val();
    option = $('input[name="reminderval"]:checked').val()
    var emails = [];					
          $.each( $('.client_count li'), function() {
            if($(this).css('display') != 'none'){
                console.log(this)
                em = $(this).text();
                emails.push(em);
            }
          });
          console.log(emails)
          
        var data = new FormData($('#sendrememailtopart').get(0));
        data.append('email', emails);
        data.append('id', id);
        data.append('option', option);
        data.append('instr', document.getElementById('rem_instr').innerHTML);
        data.append('bottom_text', document.getElementById('rem_bottom-text').innerHTML);
        data.append('upper-text', document.getElementById('rem_upper-text').innerHTML);
        var endpoint = document.location.origin + '/send_survey/';
        var csrftoken = $('input[name=csrfmiddlewaretoken]').val();
        $.ajax({				
                method: "POST",
                headers: {'X-CSRFToken': csrftoken},
                url: endpoint,
                data: data,
                processData: false,
                contentType: false,
                dataType: "json",
                success:function(data) {
                    $('.sucss_popup').find('h5').text(data['success'])	
                    $('#ready_confirmation').hide();
                    modalShow(false);
                    jQuery($('.sucss_popup')).show();	
                    modalShow(true);
                },
                error: function(data) {
                    console.log(data['fail'])
                }
            });
})

$("#myTable1 thead tr th").on("change", "input[name='selectallparti']",function(e){
    $('#myTable1 tbody tr td input[name="client"]').not(":disabled").prop('checked', this.checked);
});

jQuery(document).on('click','.whentoreminderval',function(){
    $('.cnfm_popup .custom-alert-text').hide()
})

jQuery(document).on('click','.reminderval',function(){
    $('.parameter_reminder .custom-alert-text').hide()
})
    
$('body').on('click', '.marksurvcompbtn', function(){
        jQuery(this).closest('td').find('.survey_compl_mark_popup').show();
    });


$('body').on('click', '.send_reminder_cont', function(){
    $('.cnfm_popup:visible').hide()		
    id = jQuery($('#surveyreminderid')).val();
    option = $('input[name="reminderval"]:checked').val()		
    
    var csrftoken = $('input[name=csrfmiddlewaretoken]').val();
    var data = new FormData();		
    if(id == 'demo'){
        id = jQuery($('#surveycat')).val();
            $('.ready_confirmation').addClass('onlysave')
            $('.close1').addClass('sur_param')
            $('.ready_confirmation').prop('disabled', false);
            $('.ready_confirmation').attr('data_id', id)
            $('.ready_confirmation').text('Save')
    }
    else{	
        if(!option){ 
            console.log($('.parameter_reminder .custom-alert-text'))
            $('.parameter_reminder .custom-alert-text').show()
            return false
        }
        else{		
        data.append('option', option);
        $('.ready_confirmation').removeClass('onlysave')
        $('.ready_confirmation').text('Send')
        }
    }

    url = window.location.origin+'/client-detail/'+id
    data.append('id', id);		
        $.ajax({
            method: "POST",
            headers: {'X-CSRFToken': csrftoken},
            url: url,
            data: data,
            processData: false,
            contentType: false,
            dataType: "json",
            success:function(data) {               
                $('.client_count').empty();
                $('#reminder_email_preview').find('#rem_upper-text').html("");
                $('.parameter_reminder_popup').modal('hide');
                modalShow(false);
                if(data['surinst'] !== '' && data['surinst'] !== undefined && data['surinst'] !== null){
                    $('#reminder_email_preview').find('#rem_instr').empty()
                    $('#reminder_email_preview').find('#rem_instr').append(data['surinst'])
                }
                
                $('#reminder_email_preview').find('#rem_bottom-text').empty()
               
                $('p .date-text').text(data['dt'])
                $('#reminder_email_preview').find('#rem_bottom-text').append(data['surbtm'])
                 $('#reminder_email_preview').find('#rem_upper-text').html(data['surtop'])
                    element = jQuery('.reminder_email_preview_popup .ready_confirmation')
                   $(element).parent().prev().find('#datepicker').prev().show();
                   $(element).parent().prev().find('#datepicker').hide()
                try{
                    cli_count = data['partcount']
                    if(data['participants'].length == 1){
                        id = data['participants'][0][5]
                        $('.reminder_email_preview_popup .client_count').append('<li>'+data['participantlist'][0]+'<a class="dropdown-item" href="#" data_id="'+id+'"><i class="fa fa-trash" aria-hidden="true"></i></a></li>')
                        $('.ready_confirmation').prop('disabled', false);
                    }
                    else if(data['participants'].length == 0){
                        $('.ready_confirmation').prop('disabled', true);
                    }
                    else{
                        for (i in data['participants']){
                        id = data['participants'][i][5]
                        $('.reminder_email_preview_popup .client_count').append('<li>'+data['participantlist'][i]+'<a class="dropdown-item" href="#" data_id="'+id+'"><i class="fa fa-trash" aria-hidden="true"></i></a></li>')
                        $('.ready_confirmation').prop('disabled', false);
                    }
                    }
                }
                catch{
                    cli_count = 0                    
                }
                $('.coach').val(data['coachname'])
                $('.coach').text(data['coachname'])
                $('.title').text(data['title'])
                $('.company').text(data['company'])
                $('.email').text(data['email'])

                $('#reminder_email_preview').show();
                modalShow(true);
                $('.parameter_reminder').hide();                 
                modalShow(false);
                    
                     
                    $('.part_count').empty();
                    if ($('.ready_confirmation').hasClass('onlysave')){
                        $('.reminder_email_preview_popup .client_count').empty()
                        $('.part_count').append(0+' Participant')
                        $('.ready_confirmation').prop('disabled', false);
                    }
                    else{
                        $('.part_count').append(cli_count+' Participants')
                    }                
            },
            error: function(data) {
                console.log(data['fail'])
            }
        });
    
    
});

$(document).mouseup(function (e) {
    var clientprofdropdown = $(".profile_dropdown");
    if (!clientprofdropdown.is(e.target) && clientprofdropdown.has(e.target).length === 0) {
        clientprofdropdown.slideUp();
    }
});

// Change Password Popup 
jQuery('.changepassbtn').on('click',function(){
    jQuery('.changepass_popup').fadeIn();
});

//payment pop up
jQuery('.pay-btn').on('click',function(){
    jQuery('.plan_type_popup').fadeIn();
    mode = $(this).attr('mode')		
    $('.pln-payment-hidden-btn').each(function(){
        if ($(this).hasClass(mode)){
            if(jQuery('input[name="mode"]:checked').val() == "monthly"){
                $('.payment-btn .make_plan_payment').addClass('monthly')
                $('.payment-btn .make_plan_payment').removeClass('yearly')
                $('.payment-btn .make_plan_payment').attr('data',mode)
            }	
            else{
                $('.payment-btn .make_plan_payment').addClass('yearly')
                $('.payment-btn .make_plan_payment').removeClass('monthly')
                $('.payment-btn .make_plan_payment').attr('data',mode)
            }			
        }			
    })
});

jQuery('body').on('click', '.make_plan_payment', function(){
    prize = $('input[name="prize"]').val()	
    pack = $('input[name="pack"]').val()	
    annualfee = $('input[name="annualfee"]').val()
    if(jQuery('input[name="mode"]:checked').val() == "monthly"){
        total = (parseInt(prize)*parseInt(pack))+(parseInt(annualfee)/12)	
        mode = jQuery('.make_plan_payment').attr('data')		
        // cls = mode+' .stripe-button'
        btncls = mode+'.monthly .stripe-button-el'
        // $('.'+cls).attr('data-amount', parseInt(total)*100)
        $('.'+btncls).trigger('click');
    }
    else{
        total = (parseInt(prize)*parseInt(pack))+parseInt(annualfee)
        // $('.payment-btn .stripe-button').attr('data-amount', total*100)
        mode = jQuery('.make_plan_payment').attr('data')		
        // cls = mode+' .stripe-button'
        btncls = mode+'.yearly .stripe-button-el'
        // $('.'+cls).attr('data-amount', parseInt(total)*100)
        $('.'+btncls).trigger('click');
    }
    
});

//payment pop up end

jQuery('.changepass_inn_poup .closepoup').on('click',function(){
    jQuery('.changepass_popup').fadeOut();
});

jQuery('#changepassfrm #changepasssub').on('click',function(){

    var oldpass = document.forms["changepassfrm"]["oldpass"].value;
    var changepass = document.forms["changepassfrm"]["changepass"].value;
    var changeconfpass = document.forms["changepassfrm"]["confchangepass"].value;
    var valid2 = true;

    if(changepass == "" || changepass == null) {
        jQuery('#changepasserr').text('Please enter new password');
        valid2 = false;
    } else {
        jQuery('#changepasserr').text('');
    }

    if(changepass == "" || changepass == null) {
        jQuery('#changepasserr').text('Please enter new password');
        valid2 = false;
    } else {
        jQuery('#changepasserr').text('');
    }

    if(changeconfpass == "" || changeconfpass == null) {
        jQuery('#changepasconfserr').text('Please enter password');
        valid2 = false;
    } else if(changeconfpass !== changepass) {
        jQuery('#changepasconfserr').text('Please check your password');
        valid2 = false;
    } else {
        jQuery('#changepasconfserr').text('');
    }

    if(oldpass == "" || oldpass == null) {
        jQuery('#oldpasserr').text('Please enter password');
        valid2 = false;
    } else {
        jQuery('#oldpasserr').text('');
    }

    return valid2;

});	

// jQuery for dashboard instruction help
    // jQuery('').click(function(){
    // 	if (jQuery('.dash_instr_help_popup').is(":visible")) {
            
    // 		jQuery('.dash_instr_help_popup').addClass('open_div');
            
    // 	} else {
            
    // 		jQuery('.dash_instr_help_popup').removeClass('open_div');
    // 	}
    
    // });

    jQuery(document).on('click','#searchBar',function(){
        jQuery(this).focus()
    })

    jQuery(document).on('click','.dash_instr_help_icon .dashinsthelpbtn',function(){
    // jQuery('.dash_instr_help_icon .dashinsthelpbtn').click(function() {
        jQuery('.dash_instr_help_popup').slideDown();
        jQuery('.dash_instr_help_icon').addClass('active_popup')
    });

    jQuery(document).mouseup(function(e) {
        var container = jQuery(".dash_instr_help_popup");
        // if the target of the click isn't the container nor a descendant of the container
        if (!container.is(e.target) && container.has(e.target).length === 0) 
        {
            jQuery('.dash_instr_help_popup').slideUp();
            var div = $('.wrap-text');
            for(var l = 0;l<div.length;l++){
                        div[l].style.display = 'block';}

            jQuery('#searchBar').val('')
            jQuery('.dash_instr_help_icon').removeClass('active_popup')
        }
    });

// jQuery for mcustomscrollbar
jQuery('.dash_instr_help_popup').each(function(){
        // get hidden element actual innerHeight
        var surveypopupheight = jQuery(this).find('.dash_instr_help_inn_popup').actual('height');
            // surveypopupheight = surveypopupheight/2;
        jQuery(this).find('.dash_instr_help_scrollbar').mCustomScrollbar({
            setHeight: surveypopupheight
        });
    });

    $('.stripe-button-el').click(function(){
        jQuery('.emailInput #email').val($('#useremail').val());
        jQuery('.emailInput #email').hide();
    });

    $('#notificationDropdown').click(function(){
        if ($('.notification-box').is(":visible")){
            $('.notification-box').hide()
              
            // if ($('.notification-box').hasClass('admin')){
            // 	var endpoint = window.location.origin + "/stage-notifications/";
            // 	var data = new FormData();
            // 	data.append('admin', 'admin');				 
            // 	var csrftoken = $('input[name=csrfmiddlewaretoken]').val();
            // 	$.ajax({
            // 		method: "post",
            // 		headers: {'X-CSRFToken': csrftoken},				
            // 		url: endpoint,				
            // 		processData: false,
            // 		contentType: false,
            // 		dataType: "json",
            // 		success:function(data) {
            // 			console.log('success')				
            // 		},
            // 		error: function(data) {
            // 			console.log('error')
            // 		}
            // 	});
            // }
        }			
        else{
            var endpoint = window.location.origin + "/get-notifications/";
            var csrftoken = $('input[name=csrfmiddlewaretoken]').val();
            $.ajax({				
                headers: {'X-CSRFToken': csrftoken},
                url: endpoint,				
                processData: false,
                contentType: false,
                dataType: "json",
                success:function(data) {
                    if(data['success']){							
                        $('.noticount').hide()
                    }
                    else{
                        $('.notification-box ul').empty()
                        // if(data['notifications'].length > 0){
                        // 	$('.notification-box ul').append("<li>No notifiction</li>")
                        // }
                    
                        for (notific in data['notifications']){
                            $('.notification-box ul').append("<li><a href='"+window.location.origin + "/my-account/"+"'><i class='fa fa-arrow-right' aria-hidden='true'></i><p>"+data['notifications'][notific][2]+"</p><span>"+data['notifications'][notific][3]+".</span></a></li>")
                        }                        
                    }
                    $('.notification-box').show()
                    
                },
                error: function(data) {
                    console.log('error')
                }
            });
        }			
    })
});



$('.navbar-toggler').click(function(){
$('.sidebar-offcanvas').toggleClass('active_sidebar');
})


$('.create_sur_btn').click(function(){
var endpoint = window.location.origin + "/userhasclient/";
var csrftoken = $('input[name=csrfmiddlewaretoken]').val();
$.ajax({				
    headers: {'X-CSRFToken': csrftoken},
    url: endpoint,				
    processData: false,
    contentType: false,
    dataType: "json",
    success:function(data) {	
        alert(data['success'])
    },
    error: function(data) {
        console.log('error')
    }
});
})




function modalShow(bStatus){
    if(bStatus)
        $('body').addClass('body-cstm-warp');
    else  
        $('body').removeClass('body-cstm-warp');
}