"use strict";

//creates the list of songs to be displayed, only grabs the information needed
var SongList = function SongList(props) {
  //reality check - but should never happen
  if (props.songs.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "songList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptySong"
    }, "No Songs Avaliable"));
  } //grabs the needed stored information 


  var songNodes = props.songs.map(function (song) {
    return /*#__PURE__*/React.createElement("div", {
      key: song._id,
      className: "song"
    }, /*#__PURE__*/React.createElement("img", {
      src: song.image,
      alt: "music image",
      className: "musicImage"
    }), /*#__PURE__*/React.createElement("h3", {
      className: "songName"
    }, " Name: ", song.name), /*#__PURE__*/React.createElement("h3", {
      className: "songArtistAll"
    }, " Artist: ", song.artist), /*#__PURE__*/React.createElement("h3", {
      className: "songUserName"
    }, "Added By: ", song.user));
  }); //displays the information

  return /*#__PURE__*/React.createElement("div", {
    className: "songList"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "songLabel"
  }, "See What Others added:"), songNodes);
}; //grabs songs from the server and render a SongsList
//periodically update the screen with changes


var loadSongsFromServer = function loadSongsFromServer() {
  sendAjax('GET', '/allSongs', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(SongList, {
      songs: data.songs
    }), document.querySelector("#songs"));
  });
}; //render out SongForm to the page and render default SongsList
//songs attribute of SongList is empty array - because we dont have 
//  data yet, but will at least get the HTML onto the page while waiting 
//  for server


var setup = function setup(csrf) {
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

/* Handles any error, if field is missing, et.c */
var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#songMessage").animate({
    width: 'toggle'
  }, 350);
}; //redirect page


var redirect = function redirect(response) {
  $("#songMessage").animate({
    width: 'hide'
  }, 350);
  window.location = response.redirect;
}; //send data to json


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
