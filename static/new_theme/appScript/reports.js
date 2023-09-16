$(document).ready( function () {
    addActiveRoute(routesUniqueClass.reportsRoute);

    initializeReportDataTable();

    $('#delete').click(function(){
        report_id =  $('#deleteData').attr('data');
        token = document.getElementsByName("csrfmiddlewaretoken")[0].value;
        $.ajax({ 	
            type: "DELETE",
            headers: {'X-CSRFToken': token},
            url: deleteItem.Report,
            data: report_id,
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


function initializeReportDataTable()
{
    var reportDataTableProps = {
        order: [[0, "desc"]],        
        columns: [
            {
                data: 'id',
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
                data: 'survey_coach',
                searchable: true,
                visible: (user_type == userType.Admin) ? true : false
                
            },
            {
                data: 'survey_client',
                searchable: true,
                visible: (user_type == userType.Client) ? false : true
                
            },
            {
                data: 'title',
                searchable: true,
                
            },
            {
                data: 'created_date',
                searchable: true,
            },
            {
                data: 'status',
                searchable: true,
            },
            {
                data: 'total_sent',
                searchable: true,               
            },
            {
                data: 'survey_id',
                searchable: false,
                orderable: false,
                
                "render": function(data, type, full, meta) { 
                    return getReportActionHtml(data, viewUrl.surveyViewUrl(data), full) 
                }
            },    
                   
        ],
        ajax: dataTableUrls.reportDataTableUrl,
    }
      // Merge Table options With constant data
      var FinalTableOptions = $.extend(basicDataTableProperties, reportDataTableProps);
      TaskTable = $('#reportsDatatable').DataTable(FinalTableOptions);
}
