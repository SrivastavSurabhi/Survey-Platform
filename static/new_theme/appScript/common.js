$(window).on('load', function(){
    $('.fixed_loading').fadeOut().resize();
  });
  
  // tooltip
$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();
  
    // search
    $('.right_header .search > .search_icon').click(function(){
      $(this).parent().addClass('show_search')
    });

    $('.right_header .search > .search_close').click(function(){
      $(this).parent().removeClass('show_search')
    });

    // sidebar toggle
    $('.left_header .toggle_bar').click(function(){
      $('body').toggleClass('sidebar_close');
    });

    // filter
    $(".recent_filter").click(function(){
      $(".recent_filter_part").slideToggle();
    });  

    
  
    $('#sort_by').change(function () {
      sort_val = $(this).val()
      if (sort_val == 1){
          TaskTable.order([0 , 'desc']).draw();
      }
      else if (sort_val == 2){
          TaskTable.order([0 , 'asc']).draw();
      }
      
    });

    $('.reset').click(function(){
      window.location = document.referrer;
    })

    // pages filter
    $(".page_filter").click(function(){
      if ($(this).hasClass('client')){
        $.ajax({
          type: 'GET',
          url: filter.allClientsOrganisationUrl,
          success:function(data){
            $('.organisations').empty()
            $('.client_coach').empty()
            $('.organisations')
                  .append($("<option></option>")
                  .attr("id", 0)
                  .attr("value", '')
                  .text('Select Organization')); 
            $.each(data['organisations'], function(key, value) {   
              $('.organisations')
                  .append($("<option></option>")
                  .attr("id", value.id)
                  .attr("value", value.company_name)
                  .text(value.company_name)); 
            });
           
            $('.client_coach')
                  .append($("<option></option>")
                  .attr("id", 0)
                  .attr("value", '')
                  .text('Select Coach')); 
            $.each(data['coaches'], function(key, value) {   
              $('.client_coach')
                  .append($("<option></option>")
                  .attr("id", value.id)
                  .attr("value", value.id )
                  .text(value.first_name + ' ' + value.last_name)); 
            });
          }
        })
      }
      $(".page_filter_part").slideToggle();
    });


});

  // adds the active class to a specific list element as requested
  // exprts parameter
  // 1. uniqueClass: string
  // returns: void
  function addActiveRoute(uniqueClass)
  {
    $('div.nav_area ul').children('li').removeClass("active");
    $('div.nav_area ul').children('li.'+ uniqueClass).addClass("active");
  }

// action column html

function getGridActionHtml(rowData, url, editUrl)
{
    var html = '<div class="all_buttons">';
    html += '<a href="'+ url +'" class="view"><img src="/static/new_theme/images/view.svg" alt="view" /></a>'
    html += '<a href="'+ editUrl +'" class="edit"><img src="/static/new_theme/images/edit.svg" alt="edit" /></a>'
    html += '<button class="del" onclick="showDeleteModal('+  rowData.id +',`'+rowData.complete_name +'`)"><img src="/static/new_theme/images/trash.svg" alt="trash" /></button>'
    html += '</div>'
    return html;    
}


function getSurveyActionHtml(id, url, rowData)
{
    var html = '<div class="all_buttons">';
    html += '<a href="'+ url +'" class="view"><img src="/static/new_theme/images/view.svg" alt="view" /></a>'
    // if (rowData.status && rowData.status.toLowerCase() == surveyStatus.Completed.toLowerCase())
    //   html += '<a href="/survey/download/'+ id +'/Client#step-2" class="view download"><img src="/static/new_theme/images/download-table.svg" alt="download" /></a>'
    if (user_type != userType.Client){
      html += '<a href="'+ editUrl.surveyEditUrl(id) +'" class="edit"><img src="/static/new_theme/images/edit.svg" alt="edit" /></a>'
      html += '<button class="del" onclick="showDeleteModal('+  id +',`'+rowData.title +'`)"><img src="/static/new_theme/images/trash.svg" alt="trash" /></button>'
    }
    html += '</div>'
    return html;  
}                                        

function getReportActionHtml(id, url, rowData)
{
    var html = '<div class="all_buttons">';
    html += '<a href="'+ url +'" class="view"><img src="/static/new_theme/images/view.svg" alt="view" /></a>'
    if (rowData.status && rowData.status.toLowerCase() == reportStatus.Completed.toLowerCase())
      html += '<a href="/survey/download/'+ id +'/Client#step-2" class="view download" target="_blank"><img src="/static/new_theme/images/download-table.svg" alt="download" /></a>'
    html += '<button class="del" onclick="showDeleteModal('+  rowData.id +',`'+rowData.title +'`)"><img src="/static/new_theme/images/trash.svg" alt="trash" /></button>'
    html += '</div>'
    return html;  
}                                        

function getQuestions(rowData)
{
  element = ''
  if (rowData.is_confidential)
  {
    element += '<span class="conf-icon"  style="right: 20px; top: 15px;"><i class="mdi mdi-star"></i></span>'
  }
  element += '<h6 >'+ rowData.question +'</h6>'
  return element;
}

function getAnswers(rowData)
{
  element = '<ul class="answer-list">'
  for (let i = 0; i < rowData.answer.length; i++)
  {
      a = rowData.answer[i] //list of answers
      element += '<li><p >'+a.answer+'</p><a href="/new_theme/participant-detail/'+ a.participant__id + '">'+a.participant__first_name+' '+a.participant__last_name+'</a></li>'
  }
  element += '</ul>'
  return element
}


function showDeleteModal(id, name)
{
    $("#deleteData").modal('show').attr('data', id)
    $("#popup_msg").html('Are you sure you want to delete<strong> '+ name+'</strong> ?')
}


function responseAlert(data){
  $("#deleteData").modal('show');
  $("#popup_msg").text(data);
  $(".confirmation #delete").replaceWith('<button data-dismiss="modal" id="delete">Ok</button>')
}


function errorBox(id,data){
  if (data == true){
    $('#'+id).css('border-color', 'red');
  }
  else{
    $('#'+id).css('border-color', '');
  }
}

function errorMessage(id,message){
  if (message == false){
    $('#'+id).text('');
  }
  else{
    $('#'+id).text(message);
  }
}

function hideLoader(){
  $('.fixed_loading').fadeOut().resize();
}

function showLoader(){
  $('.fixed_loading').fadeIn().resize();
}

function createCharts(elemenTId, Data, chartHeadingText)
{
  $("#"+elemenTId).html('');
  var options = {
    series: [
    {
        name: 'Cashflow',
        type: 'column',
        data: Data.yAxis
    },
    ],
    chart: {
      height: 350,
      type: 'line',
    },
    stroke: {
      width: [1, 1, 4]
    },
    title: {
      text: chartHeadingText,
      align: 'left'
    },
    xaxis: {
      categories: Data.xAxis,
    },
    };
    var chart = new ApexCharts(document.querySelector("#"+ elemenTId), options);
    chart.render();
}

function monthly(data){
  var yAxis = []
  var xAxis = []
  $.each( data, function( key, value ) {
    yAxis.push(value['total_users']) 
    xAxis.push(value['month']) 
  }); 
  return {'yAxis':yAxis,'xAxis':xAxis}
}


function yearly(data){
  var yAxis = []
  var xAxis = []
  $.each( data, function( key, value ) {
    yAxis.push(value['total_users']) 
    xAxis.push(value['year']) 
  }); 
  return {'yAxis':yAxis,'xAxis':xAxis}
}

function individualChartChange(){
  plantype = $('.individual').val();
  var csrftoken = $('input[name=csrfmiddlewaretoken]').val();
  var data = new FormData();     
  data.append('plantype', plantype);
  $.ajax({
    method: "POST",
    headers: {'X-CSRFToken': csrftoken},
    url: getChartUrl.individualCharts,
    data: data,
    processData: false,
    contentType: false,
    dataType: "json",
    success:function(data) {
      if (data['YearlyPlan']){
        createCharts('individualPlan',yearly(data['YearlyPlan']),plan.individual)
      }
      else{
        createCharts('individualPlan',monthly(data['MonthlyPlan']),plan.individual)
      }
    }
  });

}

function EnterpriseChartChange(){
  plantype = $('.enterprise').val();
  var csrftoken = $('input[name=csrfmiddlewaretoken]').val();
  var data = new FormData();     
  data.append('plantype', plantype);
  $.ajax({
    method: "POST",
    headers: {'X-CSRFToken': csrftoken},
    url: getChartUrl.enterpriseCharts,
    data: data,
    processData: false,
    contentType: false,
    dataType: "json",
    success:function(data) {
      if (data['YearlyPlan']){
        createCharts('EnterprisePlan',yearly(data['YearlyPlan']),plan.enterprise)
      }
      else{
        createCharts('EnterprisePlan',monthly(data['MonthlyPlan']),plan.enterprise)
      }
    }
  });

}

function getRelations()
{
  var relationTypes
  $.ajax({
        type: 'GET',
        url: filter.getRelationUrl,
        async: false,
        cache: false,
        success:function(data){
          if(data && data['success'] && data['relations'] && data['relations'].length > 0){
            relationTypes = data['relations']
          }      
        },
        error: function(e){
          console.log(e);
        }
      });
      return relationTypes 
}

function isValidEmailAddress(emailAddress) {
  var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
  return pattern.test(emailAddress);
}


function deleteSurvey(){
  survey_id =  $('#deleteData').attr('data');
  token = document.getElementsByName("csrfmiddlewaretoken")[0].value;
  $.ajax({ 	
      type: "DELETE",
      headers: {'X-CSRFToken': token},
      url: deleteItem.Survey,
      data: survey_id,
      processData: false,
      contentType: false,
      dataType: "json",
      success:function(data) {
          if (data['success']){
              TaskTable.draw()
          }			
        }
  });
}

function showHideElement(elementId, display){
  if (display == true){
    $(elementId).show()
  }
  else{
    $(elementId).hide()
  }
}