const API_KEY = "API_KEY";
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
    console.log(timeMin);
    console.log(timeMax);
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
        for (let i = 0; i < response.result.items.length; i++) {
          item = response.result.items[i];
          var time = convertTimeToPercentage(item.start.dateTime.slice(11,16), item.end.dateTime.slice(11,16));
          addElement(i, item.summary, time,"#039be5");
        }
        time = (new Date()).toISOString().slice(11,16);
        start = time.split(':');
        start = (parseInt(start[0])+7)%24+ parseInt(start[1])/60;
        time_rn=[start/24*100, 1/24];
        addElement(response.result.items.length, "",time_rn, "#a54242");
      });
    })
  }, function(error) {
    console.log('error', error)
  });
}

function convertTimeToPercentage(start, end){
  start = start.split(":");
  start = parseInt(start[0])+ parseInt(start[1])/60;
  end = end.split(":");
  end = parseInt(end[0])+ parseInt(end[1])/60;
  if (end < start){
    end = end+24;
  }
  return [start/24*100, (end-start)/24*100];
}


function addElement(i,summary,time,color){
  start = time[0];
  duration = time[1];
  console.log(start, duration);
  var style = document.createElement('style');
  style.innerHTML = `#rect${i} { position: absolute; background-color: ${color}; height: 40px; left: ${start}%; font-size: 16px; padding-top: 8px;  width: ${duration}%;}`
  document.getElementsByTagName('head')[0].appendChild(style);

  const rect = document.createElement("div");
  rect.setAttribute("id",`rect${i}`);
  rect.setAttribute("title",`${summary}`);
  rect.innerHTML = `${summary}`;
  const element = document.getElementById("frame");
  element.appendChild(rect);
}
