$("body").on("click", ".js-edit-org-info", function() {
  var button = $(this);
  var formArea = button.next('.js-edit-org-info-form');

  button.fadeOut(function() { formArea.fadeIn(); });
});

$('input.typeahead-orgs').typeahead({
  name: 'orgs',
  local: $('h2 > a').map(function() {
    return {
      value: $.trim($(this).text()),
      href: $(this).attr('href')
    }
  })
}).on('typeahead:selected', function(e, datum) {
  $(this).typeahead('setQuery', '');
  window.location.hash = datum.href;
});
