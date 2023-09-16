$(document).ready( function () {
    addActiveRoute(routesUniqueClass.revenueRoute);

    //Individual and Enterprise charts
    individualChartChange();
    EnterpriseChartChange();

    //Datatable initialization
    initializeRevenueDataTable();
  



});


function initializeRevenueDataTable()
{
    var revenueDataTableProps = {
        order: [[0, "desc"]],        
        columns: [
            {
                data: 'id',
                render: function(data, type, full, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }                   
            },
            {
                data: 'profile',
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
                data: 'price',
                searchable: false,
                orderable: false,
            },
            {
                data: 'purchase_date',
                searchable: false,
                orderable: false,               
            },
            {
                data: 'expiry_date',    
                searchable: false,
                orderable: false,          
            },
            {
                data: 'status',
                searchable: false,
                orderable: false,      
                render:function(data, type, full, meta) {
                    if(full.status == true){
                        return 'Active'
                    }
                    else if(full.status == false){
                        return 'Expired'
                    }
                    else{
                        return '-'
                    }
                }                
            },
                   
        ],
        ajax: dataTableUrls.revenueDataTableUrl,
    }
      // Merge Table options With constant data
      var FinalTableOptions = $.extend(basicDataTableProperties, revenueDataTableProps);
      TaskTable = $('#revenueDatatable').DataTable(FinalTableOptions);
}


