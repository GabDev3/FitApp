$(document).ready(function() {
  
  prettyPrint();

  
  $('.js-tooltip').tooltip({
    delay: 1000,
    container: 'body'
  });

  
  $('a[data-toggle="tab"]:first').on('shown', function(e) {
    $(e.target).parents('.tabbable').addClass('first-tab-active');
  });

  $('a[data-toggle="tab"]:not(:first)').on('shown', function(e) {
    $(e.target).parents('.tabbable').removeClass('first-tab-active');
  });

  $('a[data-toggle="tab"]').click(function() {
    document.cookie = "tabstyle=" + this.name + "; path=/";
  });

  
  var selectedTab = null;
  var selectedTabName = getCookie('tabstyle');

  if (selectedTabName) {
    selectedTabName = selectedTabName.replace(/[^a-z-]/g, '');
  }

  if (selectedTabName) {
    selectedTab = $('.form-switcher a[name=' + selectedTabName + ']');
  }

  if (selectedTab && selectedTab.length > 0) {
    
    selectedTab.tab('show');
  } else {
    
    $('.form-switcher a:first').tab('show');
  }

  $(window).on('load', function() {
    $('#errorModal').modal('show');
  });
});
