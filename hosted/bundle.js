"use strict";

var handleSong = function handleSong(e) {
  e.preventDefault();
  $("#songMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#songName").val() == '' || $("#songArtist").val() == '') {
    handleError("Oops! All fields are required");
    return false;
  }

  sendAjax('POST', $("#songForm").attr("action"), $("#songForm").serialize(), function () {
    loadSongsFromServer();
  });
  return false;
};

var SongForm = function SongForm(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "songForm",
    onSubmit: handleSong,
    name: "songForm",
    action: "/maker",
    method: "POST",
    className: "songForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "name"
  }, "Name: "), /*#__PURE__*/React.createElement("input", {
    id: "songName",
    type: "text",
    name: "name",
    placeholder: "Song Track"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "artist"
  }, "Artist: "), /*#__PURE__*/React.createElement("input", {
    id: "songArtist",
    type: "text",
    name: "artist",
    placeholder: "Artist"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "makeSongSubmit",
    type: "submit",
    value: "Add Song!"
  }));
}; //array of songs is empty- UI show no songs
//otherwise map function to create UI for each song stored in state 
//  of component. Every song will generate a song div and add it
//render out a songList with song nodes array


var SongList = function SongList(props) {
  if (props.songs.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "songList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptySong"
    }, "No Songs Created Yet"));
  }

  var songNodes = props.songs.map(function (song) {
    return /*#__PURE__*/React.createElement("div", {
      key: song._id,
      className: "song"
    }, /*#__PURE__*/React.createElement("img", {
      src: "/assets/img/domoface.jpeg",
      alt: "domo face",
      className: "domoFace"
    }), /*#__PURE__*/React.createElement("h3", {
      className: "songName"
    }, " Name: ", song.name), /*#__PURE__*/React.createElement("h3", {
      className: "songArtist"
    }, " Artist: ", song.artist));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "songList"
  }, songNodes);
}; //grabs songs from the server and render a SongsList
//periodically update the screen with changes


var loadSongsFromServer = function loadSongsFromServer() {
  sendAjax('GET', '/getSongs', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(SongList, {
      songs: data.songs
    }), document.querySelector("#songs"));
  });
}; //render out SongForm to the page and render default SongsList
//songs attribute of SongList is empty array - because we dont have 
//  data yet, but will at least get the HTML onto the page while waiting 
//  for server


var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(SongForm, {
    csrf: csrf
  }), document.querySelector("#makeSong"));
  ReactDOM.render( /*#__PURE__*/React.createElement(SongList, {
    songs: []
  }), document.querySelector("#songs"));
  loadSongsFromServer();
}; //allow us to get CSRF token for new submissions


var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
}; //page load - getToken() to get new CSRF token and setup React components


$(document).ready(function () {
  getToken();
});
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#songMessage").animate({
    width: 'toggle'
  }, 350);
};

var redirect = function redirect(response) {
  $("#songMessage").animate({
    width: 'hide'
  }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
