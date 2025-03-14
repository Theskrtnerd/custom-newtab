const API_KEY = 'AIzaSyAOC2VsUTabAggo8N1qs3qROSu7VWWQgcg';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];


function onGAPILoad() {
  gapi.client.init({
    // Don't pass client nor scope as these will init auth2, which we don't want
    apiKey: API_KEY,
    discoveryDocs: DISCOVERY_DOCS,
  }).then(function () {
    console.log('gapi initialized')
    var timeMin = (new Date()).toISOString().split("T")[0] + "T00:00:00+07:00";
    var timeMax = (new Date()).toISOString().split("T")[0] + "T23:59:59+07:00";
    chrome.identity.getAuthToken({interactive: true}, function(token) {
      gapi.auth.setToken({
        'access_token': token,
      });
      
      gapi.client.calendar.events.list({
        'calendarId': 'primary',
        'timeMin': timeMin,
        'timeMax': timeMax,
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 10,
        'orderBy': 'startTime',
      }).then(function(response) {
        getScheduleTxt(response.result.items)
      });
    })
  }, function(error) {
    console.log('error', error)
  });
}

function getScheduleTxt(items){
  var string = ``;
  for(var i = 0; i < items.length; i++){
    var startTime = Date.parse(items[i].start.dateTime)
    var endTime = Date.parse(items[i].end.dateTime)
    var nowTime = new Date()
    if (nowTime.getTime() >= startTime && nowTime.getTime() < endTime){
      string = `${items[i].summary} (${items[i].start.dateTime.slice(11,16)} - ${items[i].end.dateTime.slice(11,16)})`
      break;
    }
  }
  if (string == ``){
    for(var i = 0; i < items.length; i++){
      var startTime = Date.parse(items[i].start.dateTime)
      var nowTime = new Date()
      if ((nowTime.getTime() +  30*60000) >= startTime && nowTime.getTime() < startTime){
        string = `${items[i].summary} (${items[i].start.dateTime.slice(11,16)} - ${items[i].end.dateTime.slice(11,16)})`
        break;
      }
    }
  }
  if(string == ``){
    string = `no upcoming events`
  }
  document.getElementById("schedule").innerHTML = string;
}

