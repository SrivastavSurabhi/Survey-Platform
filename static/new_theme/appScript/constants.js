const dataTableUrls = {
   coachDataTableUrl: "/new_theme/coach_datatable/",
   clientDataTableUrl: (coach_id = 0) => `/new_theme/client_datatable/${coach_id}`,
   participantDataTableUrl: "/new_theme/participant_datatable",
   surveyDataTableUrl: (statuses, client_id = 0) => `/new_theme/survey_datatable/${statuses}/${client_id}`,
   revenueDataTableUrl : "/new_theme/revenue_datatable",
   reportDataTableUrl : "/new_theme/report_datatable",
   participantSurveyDataTableUrl : (participant_id=0) => `/new_theme/participant_detail_datatable/${participant_id}`,
   surveyDetailDataTableUrl : (survey_id=0) => `/new_theme/survey_detail_datatable/${survey_id}`,
}
const routesUniqueClass = {
   dashboardRoute : 'dash',
   coachRoute : 'coach',
   clientRoute : 'client',
   participantRoute : 'participant',
   surveyRoute : 'surveys',
   revenueRoute : 'revenue',
   reportsRoute : 'reports'
}

const basicDataTableProperties = {   
   searching: true,
   processing: true,
   serverSide: true,
   stateSave: false,
   responsive: true,
   oLanguage: {
      sZeroRecords: "No data found",
      sProcessing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i><span class="sr-only">Loading...</span>'
   },
}


const viewUrl = {   
   clientViewUrl : (client_id) => '/new_theme/client-detail/' + client_id,
   coachViewUrl : (coach_id) => '/new_theme/coach-detail/' + coach_id,
   participnatViewUrl : (participant_id) => '/new_theme/participant-detail/' + participant_id,
   surveyViewUrl : (survey_id) => '/new_theme/survey-detail/' + survey_id,
}

const editUrl = {   
   coachEditUrl : (coach_id) => '/new_theme/editcoach/' + coach_id,
   clientEditUrl : (client_id) => '/new_theme/editclient/' + client_id,
   participnatEditUrl : (participant_id) => '/new_theme/participant_edit/' + participant_id,
   surveyEditUrl : (survey_id) => '/new_theme/editsurvey/' + survey_id,
}

const surveyStatus = {
   Active: 'AT',
   Completed: 'CT',
   Draft: 'US',
   Reopen: 'RO',
   Total: 'total'
}

const reportStatus = {
   Completed : 'Completed'
}

const deleteItem = {
   Coach: '/new_theme/deletecoach/',
   Client: '/new_theme/deleteclient/',
   Participant: '/new_theme/deleteparticipant/',
   Survey: '/new_theme/deletesurvey/',
   Report : '/new_theme/deletereport/'
}

const addItem = {
   Coach:'/new_theme/addcoach/',
   Client:'/new_theme/addclient/',
   Participant:'/new_theme/addparticipant/',
   Survey:'/new_theme/addsurvey/',
   Report:'/new_theme/generate_report/'
}

const getChartUrl = {
   individualCharts : '/new_theme/individualCharts/',
   enterpriseCharts : '/new_theme/enterpriseCharts/',
}

const plan ={
   individual :'Individual Plan',
   enterprise : 'Enterprise Plan'
}

const filter = {
   allClientsOrganisationUrl: "/new_theme/clientsorganisationlist/",
   getRelationUrl: "/new_theme/get_relations/",
   getClientsUrl: "/new_theme/get_clients/",
}

const survey = {
   sendSurveyUrl: "/new_theme/send_survey/",
}

const userType = {
   'Admin': 1,
   'Coach' : 2,
   'Client' : 3
}

const emailRegex = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/

const checkboxHTML = '<input type="checkbox" class="check">'