$(document).ready(function() {

    addActiveRoute(routesUniqueClass.reportsRoute);

    // initialize smartWizard with extra button
    $('#smartwizard').smartWizard({
        theme: 'arrows',  
        toolbar:{
            extraHtml: `<button type="button" class="btn btn-fnsh d-none" style="background-color:#5FC1B8; color:white;" onclick="onFinish()" disabled>Download</button>`     
              },
        keyboard: {
            keyNavigation: false, 
            }
    });  

    // checkbox functionality for grouping
    $(document).on("change", "input[ name='grouping_enable']", function () {
        if($(this).prop('checked') == true){
            $('.relationship-grp > div.lable-wrap').each(function() {
                $(this).removeClass('disable')
            })
        }
        else{
            $('.relationship-grp > div.lable-wrap').each(function() {
                $(this).addClass('disable')
            })
        }
    })

    // delete report image
    $(document).on('click','.remove_intake_img',function() {
        var endpoint = window.location.origin+'/new_theme/reportlogo/'+report_id
        var csrftoken = $('input[name=csrfmiddlewaretoken]').val();
        $.ajax({			
            method: "delete",	
            headers: {'X-CSRFToken': csrftoken},
            url: endpoint,				
            processData: false,
            contentType: false,
            dataType: "json",
            success:function(data) {	
                $('.logo_container .intake-logo').addClass('d-none')
                $(".report_logo").removeClass('d-none').val('')
                $('.logo_container_step4').addClass('d-none')
            },
            error: function(data) {
                console.log('error')
            }
        });
    });

    // select report image
    $(".report_logo").change(function() {
        $(this).addClass('d-none')
        img = this
        const file = img.files[0];
        const reader = new FileReader();  
        reader.addEventListener("load", () => {
          $('.logo_container .intake-logo img').attr('src', reader.result)
          $('.logo_container_step4 img').attr('src', reader.result)
        }, false);
      
        if (file) {
          reader.readAsDataURL(file);
        }
        $('.logo_container .intake-logo').removeClass('d-none')
        $('.logo_container_step4').removeClass('d-none')
    });
    
    $('#smartwizard').on("leaveStep", function(e, anchorObject, stepNumber, nextindx, stepDirection) {
        $('.selectoption').text('') 
        if (stepDirection === 'forward' && stepNumber === 0) {
            var isValid = true
            if($('input[name="grouping_enable"]').prop('checked') == true){               
                $('#smartwizard #step-1 .lable-wrap').each(function() {
                    if ($(this).find('select.custom-select').val() === 'Select Group'){
                        isValid = false
                        $('.selectoption').text('Please select all groups.')
                    }
                })        
            } 
            if (isValid){
                color = $('.color-styling').attr('fill')
                $('.color-styling, .prev-footer').css('background',color) 
                $('.pdf-preview-wrap').empty()
                q_a_html = questionResponseHTML(question_answers)
                $('.pdf-preview-wrap').append(q_a_html)
            }                                         
            return isValid 
        }      
        if (stepDirection === 'forward' && stepNumber === 2) {      
            $('.btn-fnsh').removeClass('d-none').prop('disabled', false)
            $('.sw-btn-next').addClass('d-none')
            if ($('input[name="note_heading"]').val() ){
                note_div = '<div class="p-4 addnoteHeadings" style="margin-bottom: 5px;"> <div class="head_part" data="notehead" id="noteheading"> <div class="notes_wrap "> <p class="add-head">Additional Notes<span></span></p><div class="d-flex flex-column"> <h2 class="titlle note_heading_new" contenteditable="true" style="margin-bottom: 5px;">'+$('input[name="note_heading"]').val()+'</h2> <h3 class="titlle note_comments_new" contenteditable="true">'+$('textarea[name="note_comment"]').val()+'</div></h3> </div></div></div></div>'
                $('.note').empty()
                $('.note').append(note_div)
            }
        }
        else{
            $('.btn-fnsh').addClass('d-none').prop('disabled', true)
            $('.sw-btn-next').removeClass('d-none')

        }
        return true;
    })

   // note js
	$(document).on("focusout",".note_heading_new", function(){
        $('input[name="note_heading"]').val($(this).html())
	});

	$(document).on("focusout",".note_comments_new", function(){
        $('textarea[name="note_comment"]').val($(this).html())
	});

    // autofill footer color and text when pop ups are opened to edit
    $(document).on('click','.back_footer',function() {
        $('input.footerbgcolor').val($('.bc-color-styling').attr('fill'))
    })

    $(document).on('click','.edit_footer',function() {
        $('input.footercolorntext').val($('.color-styling').attr('fill'))
        $('input.footertext').val($('.prev-footer ul li p').first().text())
    })

    // save footer 
    $('#savefooter').on("click",(function(){			
        text = jQuery('.footertext').val();
        color = jQuery('.footercolorntext').val();
        data = new FormData();
        var endpoint = window.location.origin + "/survey/savefooter/";	
        data.append('id', report_id);		
        data.append('text', text);		
        data.append('color', color);		
        token = document.getElementsByName("csrfmiddlewaretoken")[0].value				
            $.ajax({
                method: "post",
                headers: {'X-CSRFToken': token},
                url: endpoint,
                data: data,
                processData: false,
                contentType: false,
                dataType: "json",
                success:function(data) {	
                    $('.color-styling, .prev-footer').css('background',color)
                    $('.color-styling').attr('fill',color)
                    $('.footer_text').text('').text(text)
                    $('#editfooter').modal('hide');
                }, 
                error: function(data) {
                    console.log(data)
                }
            });
    }));
    
    $('#savebackfooter').on("click",(function(){			
        color = jQuery('.footerbgcolor').val();
        data = new FormData();
        var endpoint = window.location.origin + "/survey/savefooter/";	
        data.append('id', report_id);		
        data.append('color', color);		
        token = document.getElementsByName("csrfmiddlewaretoken")[0].value				
            $.ajax({
                method: "post",
                headers: {'X-CSRFToken': token},
                url: endpoint,
                data: data,
                processData: false,
                contentType: false,
                dataType: "json",
                success:function(data) {	
                    $('.bc-color-styling').css('background',color)
                    $('.bc-color-styling').attr('fill',color)
                    $('#editbackfootercolor').modal('hide');
                }, 
                error: function(data) {
                    console.log(data)
                }
            });
    }));
    
})


// submit report detail form
function onFinish() {
    token = document.getElementsByName("csrfmiddlewaretoken")[0].value;
    var data = new FormData($('#smartwizard').get(0));
    if($('input[name="grouping_enable"]').prop('checked') == true){
	    data.append('grouping', JSON.stringify(getGroupDetail()));
    }
    $.ajax({ 
        type: "POST",
        headers: {'X-CSRFToken': token},
        url: addItem.Report+survey_id,
        data:data,
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
                window.location = document.location.origin +'/survey/download/'+survey_id+'/Client' ;              
            }                          
        },
        error: function(data) {
            alert("Report not created");
        },
    });
}

// return html for question answer div 
function questionResponseHTML(question_answers_obj){
    question_answer_html = `<div class="question_answer">`
    if($('input[name="grouping_enable"]').prop('checked') == true){
        $.each(question_answers_obj, function(index, item) {
            question_answer_html += ` <div class="question">${item.question.text}</div><div class="answers-detail table-responsive"> <table class="table border-new" style="border: 1px solid #000;"> <tbody> `
            
            question_answer_html += generateGroupingElement(item.answers)
            
            question_answer_html += '</tbody></table>'
        })
    }
    else{
        $.each(question_answers_obj, function(index, item) {
            question_answer_html += ` <div class="question">${item.question.text}</div><div class="answers-detail table-responsive"> <table class="table border-new" style="border: 1px solid #000;"> <tbody> `
            question_answer_html += `<tr class="bluebackgound"><th>Sr.No</th> <th>Name</th> <th>Designation</th> <th>Response</th> </tr>`
            $.each(item.answers, function(i, answer) {
                num = i+1
                question_answer_html += `<tr> <td>${num}</td><td>${answer.participant__first_name}</td><td>${answer.participant__relationship__relation}</td><td>${answer.answer}</td></tr>`
            })
            question_answer_html += '</tbody></table>'
        })
    }
    
    question_answer_html += `<div class="note"></div>`   
    return question_answer_html
}

// return groups with relation in that group 
function getGroupDetail(){
    var grouping_arr = []    
    var grouplist = []
    $('.relationship-grp > div.lable-wrap').each(function(i) {
        relation = $(this).find('label').text()
        group = $(this).find('select').val()
        if($.inArray(group, grouplist) === -1){
            grouplist.push(group)
            grouping_arr.push({'relation': [relation], 'group': group});
        }
        else {
            grp =  grouping_arr.filter(i=>i.group == group) 
            grp[0].relation.push(relation)
        }    
    })        
    return grouping_arr
}

// return html for question answer div when grouping is enable
function generateGroupingElement(answers){
    groups = getGroupDetail()
    answer_html = '<tr class="bluebackgound"><th>Sr.No</th><th>Group</th> <th>Name</th> <th>Designation</th> <th>Response</th> </tr>'
    num = 0
    $.each(groups, function(i, group) {
        this_group_total_response = answers.filter(i=>($.inArray(i.participant__relationship__relation, group.relation) !== -1)).length
        anscount = 0 
        $.each(answers, function(index, answer) {     
            if ($.inArray(answer.participant__relationship__relation, group.relation) !== -1){  
                num += 1
                anscount += 1
                if (anscount == 1){ 
                    answer_html += `<tr> <td>${num}</td><td rowspan="${this_group_total_response}"> Group ${group.group}</td><td>${answer.participant__first_name}</td><td>${answer.participant__relationship__relation}</td><td>${answer.answer}</td></tr>`
                }     
                else{          
                    answer_html += `<tr> <td>${num}</td><td>${answer.participant__first_name}</td><td>${answer.participant__relationship__relation}</td><td>${answer.answer}</td></tr>`
                }
            }           
        })
    })
    return answer_html
}

// step 4 pagination previous page arrow <
function gotoprvpage(){
    active_page = $('.page_link.active')
    active_page.removeClass('active')
    active_page.parent().prev().find('a').addClass('active') 
    page = $('#step-5 fieldset:visible').attr('id') - 1
    showhidediv(page)
};

// step 4 pagination next page arrow >
function gotonxtpage(){  
    active_page = $('.page_link.active')
    active_page.removeClass('active')
    active_page.parent().next().find('a').addClass('active') 
    page = parseInt($('#step-5 fieldset:visible').attr('id')) + 1
    showhidediv(page)
};

// step 4 pagination number click
function gotopage(page){
    $('.page_link.active').removeClass('active')
    $('.page_link').eq(page-1).addClass('active')
       
    showhidediv(page)         
};

// step 4 show and hide div 
function showhidediv(page){
    for(let i=1; i<=$('.paging li').length; i++) {
        if(i == page){
            $('#'+page).addClass('active_page').show();
        }
        else{
            $('#'+i).addClass('active_page').hide();
        }
    }  
    hidebtn()
}

// hide and show step 4 pagination arrows < >
function hidebtn(){
    if($('#1').is(':visible')){
        $('.prevpg').hide();
    }
    else{
        $('.prevpg').show();
    }

    if($('#'+$('.paging li').length).is(':visible')){
        $('.nxtpg').hide();
    }
    else{
        $('.nxtpg').show();
    }

}
