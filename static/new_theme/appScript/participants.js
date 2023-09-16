$(document).ready(function(){
    addActiveRoute(routesUniqueClass.participantRoute);

    initializeParticipantDataTable();  
    $('#delete').click(function(){
        participant_id =  $('#deleteData').attr('data');
        token = document.getElementsByName("csrfmiddlewaretoken")[0].value;
        // url = "{% url 'delete-participant' %}"
        $.ajax({ 	
            type: "DELETE",
            headers: {'X-CSRFToken': token},
            url: deleteItem.Participant,
            data: participant_id,
            processData: false,
            contentType: false,
            dataType: "json",
            success:function(data) {
                if (data['success']){
                    TaskTable.draw()
                }			
              }

        });
    });

    $('#delete').click(function(){
        participant_id =  $('#deleteData').attr('data');
        token = document.getElementsByName("csrfmiddlewaretoken")[0].value;
        $.ajax({ 	
            type: "DELETE",
            headers: {'X-CSRFToken': token},
            url: deleteItem.Participant,
            data: participant_id,
            processData: false,
            contentType: false,
            dataType: "json",
            success:function(data) {
                if (data['success']){
                    TaskTable.draw()
                }			
              }

        });
    });


})


function initializeParticipantDataTable(){
    var participantDataTableProps = {
        order: [[0, "desc"]],
        
        columns: [
            {
                data: null,
                render: function(data, type, full, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }                   
            },
            {
                data: 'complete_name',
                searchable: true,
            },
            {
                data: 'email',
                searchable: true,
               
            },
            {
                data: 'relation',
                searchable: true,

            },
            {
                data: 'client_name',
                searchable: true,
                visible: (user_type == 2 || user_type == 1) ? true : false //visible: (user_type !== 2) ? true : false
            },
            {
                data: 'coach_name',
                searchable: true,
                visible: (user_type == 1) ? true : false
            },
            
            {
                data: 'id',
                searchable: false,
                orderable: false,
                "render": function(data, type, full, meta) { 
                    return getGridActionHtml(full, viewUrl.participnatViewUrl(data), editUrl.participnatEditUrl(data)) }
            },
            
        ],
        ajax: dataTableUrls.participantDataTableUrl,
    };


    var FinalTableOptions = $.extend(basicDataTableProperties, participantDataTableProps);
    TaskTable = $('#participantDataTable').DataTable(FinalTableOptions);

}

