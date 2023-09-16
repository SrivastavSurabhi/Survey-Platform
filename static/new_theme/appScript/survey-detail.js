$(document).ready(function() {
    addActiveRoute(routesUniqueClass.surveyRoute);
    initializeSurveyDetailDataTable();
});


function initializeSurveyDetailDataTable()
{
    var surveyDetailDataTableProps = {
        order: [[0, "desc"]],        
        searching: false, 
        paging: false,
        columns: [
           
            { 
                name: 'no',
                data: null,
                render: function(data, type, full, meta) {
                            return '<div class="qu_no">' + (meta.row + meta.settings._iDisplayStart + 1) + '</div>';
                        },
            },
            {   data: 'question',                                                                                                                                                           
                render: function(data, type, full, meta) {
                        return getQuestions(full)
                        }
            },
            {
                data: null,
                orderable:false,
                searchable:false,
                render: function(data, type, full, meta) { 
                        return getAnswers(full)
                        }
            },
        ], 
            ajax: dataTableUrls.surveyDetailDataTableUrl(survey_id),
    }
    // Merge Table options With constant data
    var FinalTableOptions = $.extend(basicDataTableProperties, surveyDetailDataTableProps);
    TaskTable = $('#surveyDetailDatatable').DataTable(FinalTableOptions);
}


