$(document).ready( function () {
    addActiveRoute(routesUniqueClass.participantRoute);

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
                data: 'created_date',
                searchable: true,
            },
            {
                data: 'complete_response',
                searchable: true,               
            },
            {
                data: 'id',
                searchable: false,
                orderable: false,
                "render": function(data, type, full, meta) { 
                    return getSurveyActionHtml(data, viewUrl.surveyViewUrl(data), full) 
                }
            },            
        ],
        ajax: dataTableUrls.participantSurveyDataTableUrl(participant_id),
    }
      // Merge Table options With constant data
      var FinalTableOptions = $.extend(basicDataTableProperties, surveysDataTableProps);
      TaskTable = $('#participantSurveyDatatable').DataTable(FinalTableOptions);
}

