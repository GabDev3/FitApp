function getCookie(name) {
  var cookieValue = null;

  if (document.cookie && document.cookie != '') {
    var cookies = document.cookie.split(';');

    for (var i = 0; i < cookies.length; i++) {
      var cookie = jQuery.trim(cookies[i]);

      
      if (cookie.substring(0, name.length + 1) == (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }

  return cookieValue;
}

function csrfSafeMethod(method) {
  
  return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

function sameOrigin(url) {
  
  
  var host = document.location.host; 
  var protocol = document.location.protocol;
  var sr_origin = '
  var origin = protocol + sr_origin;

  
  return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
    (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
    
    !(/^(\/\/|http:|https:).*/.test(url));
}

window.drf = JSON.parse(document.getElementById('drf_csrf').textContent);
var csrftoken = window.drf.csrfToken;

$.ajaxSetup({
  beforeSend: function(xhr, settings) {
    if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
      
      
      
      xhr.setRequestHeader(window.drf.csrfHeaderName, csrftoken);
    }
  }
});
