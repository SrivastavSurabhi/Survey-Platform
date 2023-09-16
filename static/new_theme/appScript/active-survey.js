$(document).ready(function() {
    addActiveRoute(routesUniqueClass.surveyRoute)

    initializeActiveSurveyDataTable();

    $('#delete').click(function(){
        deleteSurvey()
    });
})


function initializeActiveSurveyDataTable()
{
    var activeSurveyDataTableProps = {
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
                visible: (user_type == userType.Admin) ? true : false
            },
            {
                data: 'survey_client',
                searchable: true,
                visible: (user_type == userType.Client) ? false : true
                
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
                data: 'id',
                searchable: false,
                orderable: false,
                "render": function(data, type, full, meta) { 
                    return getSurveyActionHtml(data, viewUrl.surveyViewUrl(data), full,editUrl.surveyEditUrl) 
                }
            },            
        ],
        ajax: dataTableUrls.surveyDataTableUrl(surveyStatus.Active),
    }
      // Merge Table options With constant data
      var FinalTableOptions = $.extend(basicDataTableProperties, activeSurveyDataTableProps);
      TaskTable = $('#activeSurveyDatatable').DataTable(FinalTableOptions);
}

