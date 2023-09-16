$(document).ready(function() { 
    // addQuestionAnswerBlock({questionText:"saefesrf"})
    addQuestionAnswerBlock()
// add, edit survey question js
      // when user click add more btn
    $(document).on("click",".add-questions",function() {
        parentDiv = $(visibleDivClassName()+" div.queanswrap").not('.d-none, .deletedDiv').find('textarea')
        if (parentDiv.filter(function() {return this.value.length;}).length != parentDiv.length){
            alert("Please enter question to add more questions.");
        }
        else {
            addQuestionAnswerBlock()
            addConfQuestionNum()
        }
    })

    $(document).on("click",".add-conf-questions",function() {
        if ($('div.confqueansblock').is(':visible')){
            alert("Confidential Question already added");
        }
        else{
            $('.confqueansblock').removeClass('d-none')
            $('.confqueansblock > .queanswrap').removeClass('d-none')
            $('.confqueansblock > .queanswrap').find('textarea').attr('readonly', false).addClass('active')
            addConfQuestionNum()
        }
    })
    
    // when user click save btn
    $(document).on("click",".savebtn",function() {
        $(this).addClass('d-none')
        parentDiv = $(this).closest('.queanswrap')
        parentDiv.find('textarea').attr('readonly', true).removeClass('active')
        parentDiv.find('.editbtn').removeClass('d-none')
        questionNumbring()    
    })

    // when user click delete btn
    $(document).on("click",".deletebtn",function() {
        parentDiv = $(this).closest('.queanswrap')
        parentDiv.addClass("deletedDiv");
        parentDiv.find('textarea').attr('readonly', true).removeClass('active')
        parentDiv.find('.deletebtn, .editbtn, .savebtn').addClass('d-none')
        parentDiv.find('.undobtn').removeClass('d-none')
        questionNumbring()    
    })

    // when user click undo btn
    $(document).on("click",".undobtn",function() {
        parentDiv = $(this).closest('.queanswrap')
        parentDiv.removeClass("deletedDiv");
        parentDiv.find('textarea').attr('readonly', false).addClass('active')
        parentDiv.find('.deletebtn, .savebtn').removeClass('d-none')
        parentDiv.find('.undobtn').addClass('d-none')
        questionNumbring()    
    })

    // when user click edit btn
    $(document).on("click",".editbtn",function() {
        $(this).addClass('d-none')
        parentDiv = $(this).closest('.queanswrap')
        parentDiv.find('textarea').attr('readonly', false).addClass('active')
        parentDiv.find('.savebtn').removeClass('d-none')
        questionNumbring()    
    })

    // when user select create survey from scratch
    $(document).on("click","#scratch",function() {
        $('.scratch-block').removeClass("d-none");
        $('.copy-block').addClass("d-none");
        $('.template-block').addClass("d-none");
        $('.edit-block').addClass("d-none");
    })

    // when user select copy a past survey
    $(document).on("click","#copy",function() {
        $('.scratch-block').addClass('d-none');
        $('.copy-block').removeClass('d-none');
        $('.template-block').addClass('d-none');
        addQuestionAnswerBlock()
    })

    // when user select create survey from template
    $(document).on("click","#template",function() {
        $('.scratch-block').addClass('d-none');
        $('.copy-block').addClass('d-none');
        $('.template-block').removeClass('d-none');
        addQuestionAnswerBlock()
    })

    $(document).on('focusout', '.queanswrap textarea', function(){
        if ($(this).val() !== ''){
            $(this).attr('readonly', true).removeClass('active');
            $(this).parent().next().find('.savebtn').addClass('d-none');
            $(this).parent().next().find('.editbtn').removeClass('d-none');
            // $(this).next('span').remove();
        }
    })
});

// return visible div (either scratch, copy or template)
function visibleDivClassName() {
    $.each($('.question-answer-block > div.queansblock'), function( key, value ){
        if(!$(this).hasClass("d-none")){
            visibleClass = "." + $(this).attr("class").split(" ")[0]
        }
    });
    return visibleClass
}

// disable all question textarea 
function disableAllTextarea() {
    var parentElement = $(visibleDivClassName());
    parentElement.find('div.queanswrap').each(function(i){ 
        $(this).find('textarea').attr('readonly', true).removeClass('active')
    });
}

// add new question block
function addQuestionAnswerBlock(ques)
{
    var parentElement = $(visibleDivClassName())//div.scratch-block")
    var clonedDIv = parentElement.find('div.queanswrap.d-none').clone();
    clonedDIv.removeClass('d-none').attr('id',"queansblock"+$(visibleDivClassName()).find('.queanswrap').length);
    clonedDIv.find('textarea').attr('readonly', false).addClass('active')
    parentElement.append(clonedDIv)
    if (ques){
        clonedDIv.find('textarea').val(ques['question']).attr('id',ques['id']);
    }
    parentElement.append(clonedDIv);
    questionNumbring();
}

// handle question number
function questionNumbring() {
    $(visibleDivClassName()+" div.queanswrap").not('.d-none').each(function(i){
        $('.question-number',this).text("Q "+(i+1))
     });
}

function addConfQuestionNum(){
    lastQuesNo = $(visibleDivClassName()+" div.queanswrap").last().find('span.question-number').text().split(" ")[1];
    $('.confqueansblock').find('span.question-number').text("Q "+(parseInt(lastQuesNo)+1))
}