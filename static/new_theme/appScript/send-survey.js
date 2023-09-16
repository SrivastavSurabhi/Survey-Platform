$(document).ready(function() { 
// send survey js    
    // initialize participant datatable inside modal
    $(document).on('click', '.send_survey_btn', function(){
        initializeParticipantDataTable(client_id);
       
    } )

    $(document).on('click', '.select_all', function(){
        $('#participantDataTable > tbody > tr ').each(function(){
            if ($(".select_all").is(":checked")){
                $(this).children(':first').find('.check').prop("checked", true).addClass('selected')
            }
            else{
                $(this).children(':first').find('.check').prop("checked", false).removeClass('selected')
            }
         })
    } )


    $(document).on('change', '.check', function(){
        if($(this).is(":checked")){
            $(this).addClass('selected')
        }
        else{
            $(this).removeClass('selected');
            $('.select_all').prop("checked", false);
        }
    } )

    $(document).on('click', '.show_survey_detail_modal', function(){
        var selectedParticipantsIDs = [];
        $('#participantDataTable > tbody > tr > td .selected').each(function(){ selectedParticipantsIDs.push($(this).closest('tr').attr('id')); })
        $.ajax({
            type: 'GET',
            url: survey.sendSurveyUrl,
            data: { 
                'participant_ids': selectedParticipantsIDs,  
                'survey_id': survey_id,              
            },
            async: false,
            beforeSend: function() {
                showLoader();
            },
            complete: function() {
                hideLoader();
            },
            success:function(data){
                if (data.success && data.message)   {
                    alert(data.message)
                    $('#selectParticipant').modal('hide');
                    location.reload();
                }
            },
            error: function(data) {
                console.log('error');
            },
            });    
    })
})


function initializeParticipantDataTable(client_id){
    var participantDataTableProps = {
        "bDestroy": true,
        order: [[0, "desc"]],
        // select: {
        //     style: 'multi'
        // },
        paging: true, 
        'rowId': 'id',     
        columns: [
            {
                data: 'status',
                orderable: false, 
                render: function(data, type, full, meta) {
                    if (data == 'Not sent'){
                        return checkboxHTML;
                    }           
                    else {
                        return null
                    }         
                }                   
            },
            {
                data: null,
                orderable: false,
                render: function(data, type, full, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }                   
            },
            {
                data: 'complete_name',     
                orderable: false,    
            },
            {
                data: 'email',
                orderable: false,    
            },
            {
                data: 'relation',
                orderable: false,
            },           
            {
                data: 'status',
                orderable: false,
            },
            
        ],
        ajax: dataTableUrls.participantDataTableUrl+'/'+client_id + '/' + survey_id,
        drawCallback: function(){
            $('.select_all').prop('checked',false)
        }
    };


    var FinalTableOptions = $.extend(basicDataTableProperties, participantDataTableProps, );
    TaskTable = $('#participantDataTable').DataTable(FinalTableOptions);

}