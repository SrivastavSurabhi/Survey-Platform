$(document).ready(function(){
    addActiveRoute(routesUniqueClass.clientRoute);

    initializeClientDataTable();  

    $('.apply_filter').click(function(){
        TaskTable.draw();
    });

    $('#delete').click(function(){
        client_id =  $('#deleteData').attr('data');
        token = document.getElementsByName("csrfmiddlewaretoken")[0].value;
        $.ajax({ 	
            type: "DELETE",
            headers: {'X-CSRFToken': token},
            url: deleteItem.Client,
            data: client_id,
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
});


function initializeClientDataTable(){
    var clientDataTableProps = {
        order: [[0, "desc"]],
        
        columns: [
            {
                data: null,
                render: function(data, type, full, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }                   
            },
            {
                data: 'profile_img',
                class:'grid_image',
                searchable: false,
                orderable: false,
                "render": function(data) { 
                    if (data  == 'static/images/theme/default.png'){
                        link = document.location.origin +'/'+ data ; 
                    }
                    else{
                        link = document.location.origin +'/media/'+ data ;  
                    }
                    return '<img src="' + link + '" >';}
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
                data: 'company_name',
                searchable: true,

            },
            {
                data: 'coach_complete_name',
                searchable: true,
                visible: (user_type !== 2) ? true : false
            },
            
            {
                data: 'id',
                searchable: false,
                orderable: false,
                "render": function(data, type, full, meta) { 
                    return getGridActionHtml(full, viewUrl.clientViewUrl(data),editUrl.clientEditUrl(data)) }
            },
            
        ],
        // ajax: dataTableUrls.clientDataTableUrl(),
        "ajax":{
            "type": "GET",
            "url": dataTableUrls.clientDataTableUrl(),
            "data": function (d) {
                return $.extend( {},d, {
                    "search": {'value':$('#clientDatatable_filter input').val(),
                    'name':$('#name').val(),
                    'email': $('#email').val(),
                    'organization': $('#organization').val(),
                    'coach' : $('#coach').val() ? $('#coach').val() : ''
                }
                });
         }
          }
    };


    var FinalTableOptions = $.extend(basicDataTableProperties, clientDataTableProps);
    TaskTable = $('#clientDatatable').DataTable(FinalTableOptions);

}





