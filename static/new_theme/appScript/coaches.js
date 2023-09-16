$(document).ready(function() {
    addActiveRoute(routesUniqueClass.coachRoute)

    initializeCoachDataTable();
    $('#delete').click(function(){
        coach_id =  $('#deleteData').attr('data');
        token = document.getElementsByName("csrfmiddlewaretoken")[0].value;
        console.log("{% url 'add-coach' %}")
        $.ajax({ 	
            type: "DELETE",
            headers: {'X-CSRFToken': token},
            url: deleteItem.Coach,
            data: coach_id,
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

    $('#filter_submit').click(function(){
        TaskTable.draw();
    })
})


function initializeCoachDataTable()
{
    var coachDataTableProps = {
        order: [[0, "desc"]],        
        columns: [
            {
                data: null,
                render: function(data, type, full, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }                   
            },
            {
                data: 'logo',
                class:'grid_image',
                searchable: false,
                orderable: false,
                "render": function(data) { 
                    if (data == null){
                        link = document.location.origin +'/static/images/theme/default.png';  
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
                data: 'type_of_plan',
                searchable: true,
                
            },
            {
                data: 'title',
                searchable: true,
            },
            
            {
                data: 'id',
                searchable: false,
                orderable: false,
                "render": function(data,type,full,meta) { 
                    return getGridActionHtml(full, viewUrl.coachViewUrl(data), editUrl.coachEditUrl(data)) 
                }
            },            
        ],
        // ajax: dataTableUrls.coachDataTableUrl,
        "ajax":{
            "type": "GET",
            "url": dataTableUrls.coachDataTableUrl,
            "data": function (d) {
                return $.extend( {},d, {
                    "search": {'value':$('#coachDatatable_filter input').val(),
                    'cname':$('#name').val(),
                    'email': $('#email').val(),
                    'title': $('#title').val(),
                    'userplan' :$('#plan').val()}
                });
         }
          }
    }
      // Merge Table options With constant data
      var FinalTableOptions = $.extend(basicDataTableProperties, coachDataTableProps);
      TaskTable = $('#coachDatatable').DataTable(FinalTableOptions);
}

