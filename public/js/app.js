var pulsedata = {};

$(document).ready(function () {
	$('select').material_select();
});

pulsedata.toJson = function() {
  return JSON.stringify(this);
}

function updateFormOnSubmit() {
  document.getElementById('submit').disabled = true;
  document.getElementById('loading').style.display = 'block';
  document.getElementById('prediction').style.display = 'none';
}
function updateFormAfterSubmit(bpm) {
  document.getElementById('bpm').innerText = bpm;
  document.getElementById('loading').style.display = 'none';
  document.getElementById('prediction').style.display = 'block';
  document.getElementById('submit').disabled = false;
}
function predictPulseRate() {
  updateFormOnSubmit();
  var data = {
    heartBeats: parseInt(document.getElementById('heart_beats').value),
    timeInSeconds: parseInt(document.getElementById('time_in_secs').value),
  };
	pulsedata.heartbeats = data.heartBeats;
	pulsedata.seconds = data.timeInSeconds;
	storePulsedata();
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/api/predictPulseRate', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
      let response = JSON.parse(xhr.responseText);
      updateFormAfterSubmit(response.bpm);
    }
  }
  xhr.send(JSON.stringify(data));
}

function storePulsedata() {
  $.ajax({
  	url: "/api/" + pulsedata.toJson().replace("\"",""),
    error: function(xhr, status, error) {
      if(xhr.status==401 && xhr.status==404){
        console.log("Sending oulse data with status error " + xhr.status);
  		} else {
        console.log("Failed to authenticate! "+error);
  		}
  	},
  	success: function(){
      console.log("Data sent! " + xhr);
  	}
  });
}

function bodyLoaded() {
  document.getElementById('submit').onclick = function () {
    predictPulseRate();
    return false;
  }
}
