$(document).ready( function () {
    addActiveRoute(routesUniqueClass.clientRoute);

    initializeSurveyDataTable();

});


function initializeSurveyDataTable()
{
    var surveysDataTableProps = {
        order: [[0, "desc"]],        
        columns: [
            {
                data: null,
                render: function(data, type, full, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }                   
            },
            {
                data: 'title',
                searchable: true,
            },
            {
                data: 'survey_coach',
                searchable: true,
                visible:false,
                
            },
            {
                data: 'survey_client',
                searchable: true,
                visible:false,
            },

            {
                data: 'created_date',
                searchable: true,
            },
            {
                data: 'total_sent',
                searchable: true,
            },
            {
                data: 'complete_status',
                searchable: true,               
            },
            {
                data: 'id',
                searchable: false,
                orderable: false,
                "render": function(data, type, full, meta) { 
                    return getSurveyActionHtml(data, viewUrl.surveyViewUrl(data), full,editUrl.surveyEditUrl) 
                }
            }, 


           
                             
        ],
        ajax: dataTableUrls.surveyDataTableUrl(surveyStatus.Total, client_id),
    }
    // Merge Table options With constant data
    var FinalTableOptions = $.extend(basicDataTableProperties, surveysDataTableProps);
    TaskTable = $('#clientSurveyDatatable').DataTable(FinalTableOptions);
}

