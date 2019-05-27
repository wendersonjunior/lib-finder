$("#search").change(function () {

  $('#result').html('');
  $('#lib-details').hide();

  var text = $('#search-input').val().toLowerCase(); 
  text = removeAccent(text);

  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://api.cdnjs.com/libraries?search=" + text,
    "method": "GET",
    "headers": {},
    "data": "{}"
  }

  $.ajax(settings).done(function (response) {

    var repeat = response.total > 5 ? 5 : response.total;
    if(repeat != 0){
      var result = response.results;
      for (let index = 0; index < repeat; index++) {
        $('#result').append($('<tr>', {
          id: 'line-' + index
        }));

        $('#line-' + index).append($('<td>', {
          id: 'content-' + index,
          text: result[index].name
        }));

        $('#content-' + index).append($('<span>', {
          id: 'more-details-' + index,
          class: 'icon',
          html: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM9 15V9H11V15H9ZM9 5V7H11V5H9Z" fill="#999999"/></svg>'
        }));
        
        $('#more-details-'+index).on( "click", {
          name: result[index].name
        }, searchData );
      }
    } else {
      $('#result').append($('<tr>', {
        id: 'notfound'
      }));

      $('#notfound').append($('<td>', {
        text: 'No results found, try another filter'
      }));
    }
  });
});

function searchData (event) {

  $('#result').html('');
  $('#lib-details').html('');

  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://api.cdnjs.com/libraries/" + event.data.name,
    "method": "GET",
    "headers": {},
    "data": "{}"
  }

  $.ajax(settings).done(function (response) {

    createLibDetails(response);
    $('#lib-details').show();
  });
}

function createLibDetails (lib) {

  $('#lib-details').append($('<span>', {
    class: 'title-lib',
    text: lib.name
  }));

  $('#lib-details').append($('<span>', {
    class: 'subtitle-lib',
    text: lib.description
  }));

  $('#lib-details').append($('<span>', {
    id: 'separator'
  }));

  $('#lib-details').append($('<span>', {
    class: 'content-lib',
    html: '<span class="content-lib-title">homepage: </span>' + lib.homepage
  }));

  $('#lib-details').append($('<span>', {
    class: 'content-lib',
    html: '<span class="content-lib-title">repository: </span>' + lib.repository.url
  }));

  $('#lib-details').append($('<span>', {
    class: 'content-lib',
    html: '<span class="content-lib-title">version: </span>' + lib.version + '<span class="content-lib-title"> • license: </span>' + lib.license
  }));
}

function removeAccent (text) {

	var accentMapHex 	= {
		a : /[\xE0-\xE6]/g,
		e : /[\xE8-\xEB]/g,
		i : /[\xEC-\xEF]/g,
		o : /[\xF2-\xF6]/g,
		u : /[\xF9-\xFC]/g,
		n : /\xF1/g
	};

	for (var letter in accentMapHex) {
		var regularExpression = accentMapHex[letter];
		text = text.replace( regularExpression, letter );
	}

	return text;
}