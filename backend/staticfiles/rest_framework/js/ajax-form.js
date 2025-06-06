function replaceDocument(docString) {
  var doc = document.open("text/html");

  doc.write(docString);
  doc.close();

  if (window.djdt) {
    
    
    window.addEventListener("load", djdt.init);
  }
}

function doAjaxSubmit(e) {
  var form = $(this);
  var btn = $(this.clk);
  var method = (
    btn.data('method') ||
    form.data('method') ||
    form.attr('method') || 'GET'
  ).toUpperCase();

  if (method === 'GET') {
    
    return;
  }

  var contentType =
    form.find('input[data-override="content-type"]').val() ||
    form.find('select[data-override="content-type"] option:selected').text();

  if (method === 'POST' && !contentType) {
    
    
    return;
  }

  
  e.preventDefault();

  var url = form.attr('action');
  var data;

  if (contentType) {
    data = form.find('[data-override="content"]').val() || ''

    if (contentType === 'multipart/form-data') {
      
      
      
      var boundaryCharNoSpace = "0-9A-Z'()+_,-./:=?";
      var boundaryChar = boundaryCharNoSpace + ' ';
      var re = new RegExp('^--([' + boundaryChar + ']{0,69}[' + boundaryCharNoSpace + '])[\\s]*?$', 'im');
      var boundary = data.match(re);
      if (boundary !== null) {
        contentType += '; boundary="' + boundary[1] + '"';
      }
      
      data = data.replace(/\n/g, '\r\n');
    }
  } else {
    contentType = form.attr('enctype') || form.attr('encoding')

    if (contentType === 'multipart/form-data') {
      if (!window.FormData) {
        alert('Your browser does not support AJAX multipart form submissions');
        return;
      }

      
      
      
      contentType = false;
      data = new FormData(form[0]);
    } else {
      contentType = 'application/x-www-form-urlencoded; charset=UTF-8'
      data = form.serialize();
    }
  }

  var ret = $.ajax({
    url: url,
    method: method,
    data: data,
    contentType: contentType,
    processData: false,
    headers: {
      'Accept': 'text/html; q=1.0, */*'
    },
  });

  ret.always(function(data, textStatus, jqXHR) {
    if (textStatus != 'success') {
      jqXHR = data;
    }

    var responseContentType = jqXHR.getResponseHeader("content-type") || "";

    if (responseContentType.toLowerCase().indexOf('text/html') === 0) {
      replaceDocument(jqXHR.responseText);

      try {
        
        history.replaceState({}, '', url);
        scroll(0, 0);
      } catch (err) {
        
        window.location = url;
      }
    } else {
      
      window.location = url;
    }
  });

  return ret;
}

function captureSubmittingElement(e) {
  var target = e.target;
  var form = this;

  form.clk = target;
}

$.fn.ajaxForm = function() {
  var options = {}

  return this
    .unbind('submit.form-plugin  click.form-plugin')
    .bind('submit.form-plugin', options, doAjaxSubmit)
    .bind('click.form-plugin', options, captureSubmittingElement);
};
