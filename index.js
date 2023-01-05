const API_KEY = 'YOUR_API_KEY';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

colors = ["blue", "blue", "blue", "pink", "yellow"]

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
        addCSScalendar(response.result.items)
      });
    })
  }, function(error) {
    console.log('error', error)
  });
}

function addCSScalendar(items){
  var my_container = document.getElementById("calendar");
  for(var i = 0; i < items.length; i++){
    var startTime = Date.parse(items[i].start.dateTime)
    var dt = new Date(startTime)
    var secs = dt.getSeconds() + (60 * (dt.getMinutes() + (60 * dt.getHours())));
    var duration = (Date.parse(items[i].end.dateTime) - Date.parse(items[i].start.dateTime))/1000;
    pct_secs = (100 * secs / 86400).toFixed(1);
    pct_duration = (100 * duration / 86400).toFixed(1);
    var div = document.createElement('div');
    console.log(items[i].colorId);
    div.setAttribute("class", `absolute h-24 rounded-[12px] p-2 grid justify-center content-center`)
    div.setAttribute("style", `width: ${pct_duration}%; left: calc(${pct_secs}%);font-size: 15px;background-color: ${colors[items[i].colorId-1]};`)
    div.innerHTML = `${items[i].summary}`;
    my_container.appendChild(div);
  }
  var div = document.createElement('div');
  date = new Date();
  var secs = (100* (date.getSeconds() + (60 * (date.getMinutes() + (60 * date.getHours())))) / 86400).toFixed(1);
  div.setAttribute("style", `position: absolute; width: 2px; height: 6rem ;left: calc(${secs}%);background-color: red;`)
  my_container.appendChild(div);
}

