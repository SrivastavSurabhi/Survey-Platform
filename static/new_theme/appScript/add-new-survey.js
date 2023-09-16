//TinyMCE Rich Text Editor
tinymce.init({
    selector: 'textarea#instructions',
    height: 500,
    menubar: false,
    statusbar: false,
    plugins: [
      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
      'anchor', 'searchreplace', 'visualblocks', 'fullscreen',
      'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
    ],
    toolbar: 'undo redo | blocks | bold italic backcolor | ' +
      'alignleft aligncenter alignright alignjustify | ' +
      'bullist numlist outdent indent | removeformat | help'
    ,
    setup: function (editor) {
        editor.on('init', function (e) {
            if (instructions){
                editor.setContent(instructions);
            }
        })
    }
})


$(document).ready(function() {

    addActiveRoute(routesUniqueClass.surveyRoute)

    
    // SmartWizard initialize
    $('#smartwizard').smartWizard({
        theme:'arrows',
        toolbar: {
            position: 'bottom', 
            showNextButton: true,
            showPreviousButton: true, 
            extraHtml: '<button class="btn" id="save_survey" style="background-color:#5FC1B8; color:white;" >Submit</button>'
        },
        keyboard: {
            keyNavigation: false, 
        }
    });

    $("#add_survey").validate({
        rules: {
            survey_name: "required", 
            coach: "required", 
            client: "required",
        },
    });

    var validators = $('#add_survey').validate();

    $("#smartwizard").on("showStep", function(e, anchorObject, stepIndex, stepDirection, stepPosition) {
        if (stepIndex == 2 ){
            showHideElement(".sw-btn-next",false)
            showHideElement('#save_survey',true)
        }
        else{
            showHideElement(".sw-btn-next",true)
            showHideElement('#save_survey',false)
        }
    });
   
    $("#smartwizard").on("leaveStep", function(e, anchorObject, currentStepIdx, nextStepIdx, stepDirection) {
        // Validate only on forward movement  
       
        if (stepDirection == 'forward') {
            if(!$("#add_survey").valid()){ 
                $('#smartwizard').smartWizard("setState", [currentStepIdx], 'error');
                $("#smartwizard").smartWizard('fixHeight');
                return false;
            }
            $('#smartwizard').smartWizard("unsetState", [currentStepIdx], 'error');
        }
    });


    if(surveyData){
        var jsonObj = JSON.parse(surveyData)[0];
        populateSurveyData(jsonObj)
    }
    if(surveyQuesData){
        var jsonObj = JSON.parse(surveyQuesData);
        populateSurveyQuestionsData(jsonObj)
    }
    
    $('#coach').change(function(){
        var data = {};
        token = document.getElementsByName("csrfmiddlewaretoken")[0].value;
        data['coach_id'] = $('#coach').val();
        $.ajax({
            type: 'GET',
            // headers: {'X-CSRFToken': token},
            url: filter.getClientsUrl,
            data: data,
            dataType: "json",
            async: false,
            success:function(data) {
                if (data['success']){
                    $('#client').find("option").remove()
                    if(data.client.length > 0){
                        $.each(data.client, function(key, value) {   
                            strvalue = value.id
                            client_options = ('<option value="'+value.id+'">'+value.first_name+' '+value.last_name+'</option>')
                            $('#client').append(client_options)                       
                        });
                        }
                    else{
                        client_options = ('<option value="">No result found</option>')
                            $('#client').append(client_options)
                    }
                }
            },
            error: function(data) {
                alert("Clients can not be fetched.");
            }
        })
    })

    

    $('#save_survey').click(function(){
        if($("#add_survey").valid()){
        token = document.getElementsByName("csrfmiddlewaretoken")[0].value;
        questionslist = getquestions()
        deletedqueslist = getDeletedQues()
        hasduplicate = hasDuplicateQues()
        if (questionslist.length > 0){
            if  (hasduplicate.length == 0){
            var data = {};
            data['survey_name'] = $('#survey_name').val();
            data['survey_id'] = $('#survey_id').val();
            data['description'] = $('#description').val();
            // data['instructions'] = editor.getHTMLCode();
            data['instructions'] = tinymce.activeEditor.getContent({ format: 'html' });
            data['questionslist'] = questionslist;
            data['deletedqueslist'] = deletedqueslist;
            // data['confques'] = $('.confqueansblock').is(':visible')?$('.confqueansblock textarea').val():'';
            data['client_id'] =  ($('#client_id').val()) ? $('#client_id').val() : $('#client').val();
            if (data['survey_name'] && data['client_id'] != null && data['client_id'].length != 0){       
                    $.ajax({
                        type: (surveyData) ? 'PUT' : 'POST',
                        headers: {'X-CSRFToken': token},
                        url: addItem.Survey,
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
                                $('#smartwizard').smartWizard("goToStep", 0);
                                validators.showErrors({"survey_name":data['error']})
                            }
                        },
                        error: function(data) {
                        (surveyData)? alert("Survey not updated") :  alert("Survey not created");
                        },
                    });
            }
            else{
                $('#smartwizard').smartWizard("goToStep", 0);
                $("#add_survey").valid();
            }
        }
        }
        else{
            alert("Please enter questions to save survey.");
        }
    }
    
    });
        
});

function getDeletedQues(){
    var deletedques = []
    $(".question-answer-block div.queansblock:visible .queanswrap").each(function(i){
        if($(this).hasClass('deletedDiv')){
            deletedques.push($(this).find('textarea').attr('id'))
        }        
    });
    if ($('.confqueansblock').is(':visible')){
        if($('.confqueansblock .queanswrap').hasClass('deletedDiv')){
            deletedques.push($('.confqueansblock .queanswrap').find('textarea').attr('id'))
        }
    }
    return deletedques
}

function getquestions() {
    var questionslist = []
    $(".question-answer-block div.queansblock:visible .queanswrap").not('.deletedDiv').each(function(i){
        textarea = $(this).find('textarea')
        question = textarea.val()
        question_id = textarea.attr('id')
        queswrapid =$(this).attr('id')
        if(question) {
            questionslist.push({'question': question, 'is_confidential': false, 'question_id':question_id, 'queswrapid':queswrapid});
        }
    })
    if ($('.confqueansblock').is(':visible')){
        question = $('.confqueansblock textarea').val();
        question_id = $('.confqueansblock textarea').attr('id');
        is_confidential = true
        questionslist.push({'question': question, 'is_confidential': is_confidential,'question_id':question_id, 'queswrapid':'confqueansblock'})
    }
    return questionslist
}

function hasDuplicateQues() {
    queslist = getquestions()
    allques = []
    dupequesid = []
    $.each(queslist, function(key,value){
        if (allques.indexOf(value['question']) >= 0){
            dupequesid.push(value['queswrapid']);
        }
        else{
            allques.push(value['question']);
        }
    });
    if (dupequesid.length > 0){
    $.each(dupequesid, function(key, value){
        if (!$('#' +value+ ' textarea').next().hasClass('error')){
            $('#' +value+ ' textarea').after(`<span class="error">This question is duplicate. Please enter unique question.</span>`)
        };
    });
    };
    return dupequesid
}
// RichTextEditor
// var editorconfig = {}       
// editorconfig.toolbar = "mytoolbar";
// editorconfig.toolbar_mytoolbar = "{bold,italic}|{fontname,fontsize}|{forecolor,backcolor}|removeformat|menu_mymenu"
// 		+ "#{undo,redo,fullscreenenter,fullscreenexit,togglemore}";
//         editorconfig.subtoolbar_mymenu = 'inserttable,insertimage,insertcode';
// var editor = new RichTextEditor("#instructions",editorconfig);
// document.getElementsByTagName('rte-plusbtn').style = "display: none";

// if (instructions){
//     editor.setHTMLCode(instructions)
// }

function populateSurveyData(data){
    $('#page_title').text('Edit Survey');
    $('#survey_id').val(data['id']);
    $('#survey_name').val(data['title']);
    $('#description').val(data['description']);
    $('#client').val(data['Survey_client']);
    // $('#instructions').val(data['instructions']);
}

function populateSurveyQuestionsData(data){
   $('.scratch-block').addClass("d-none");
   $('.edit-block').removeClass("d-none");
   $('.survey-type').hide();
   if(data.length > 0){
    $.each(data, function( key, value ){
        if (value['is_confidential'] == false){
            addQuestionAnswerBlock(value)
        }
        else{
            $('.confqueansblock ').removeClass('d-none');
            $('.confqueansblock .queanswrap').removeClass('d-none');
            $('.confqueansblock textarea').val(value['question']).attr('id',value['id']);
            addConfQuestionNum()
        }
    });
    $('.queanswrap textarea').attr('readonly', true).removeClass('active');
   $('.savebtn').addClass('d-none');
   $('.editbtn').removeClass('d-none');
   }
}