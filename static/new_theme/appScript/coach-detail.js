$(document).ready( function () {
    addActiveRoute(routesUniqueClass.coachRoute);

    initializeClientDataTable();  
})


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
                data: 'id',
                searchable: false,
                orderable: false,
                "render": function(data, type, full, meta) { 
                    return getGridActionHtml(full, viewUrl.clientViewUrl(data)) }
            },
            
            
        ],
        ajax: dataTableUrls.clientDataTableUrl(coach_id),
    };

    var FinalTableOptions = $.extend(basicDataTableProperties, clientDataTableProps);
    TaskTable = $('#coachClientDatatable').DataTable(FinalTableOptions);

}



