"use strict";

//checks if all information is filled out 
var handleSong = function handleSong(e) {
  e.preventDefault();
  $("#songMessage").animate({
    width: 'hide'
  }, 350); //not all information is added - show error

  if ($("#songName").val() == '' || $("#songArtist").val() == '' || $("#songRating").val() == '' || $("#songGenre").val() == '' || $("#songImage").val() == '') {
    handleError("Oops! All fields are required");
    return false;
  } //all information has been added - show added message


  sendAjax('POST', $("#songForm").attr("action"), $("#songForm").serialize(), function () {
    //loadSongsFromServer();
    handleError("Song has been added!");
  });
  return false;
}; //creates the information that will be stored


var SongForm = function SongForm(props) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "songLabelInfo"
  }, "Add Your Song Here:"), /*#__PURE__*/React.createElement("form", {
    id: "songForm",
    onSubmit: handleSong,
    name: "songForm",
    action: "/maker",
    method: "POST",
    className: "songForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "name"
  }, "Track: "), /*#__PURE__*/React.createElement("input", {
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
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "rating"
  }, "Rating (1-5): "), /*#__PURE__*/React.createElement("input", {
    id: "songRating",
    type: "number",
    name: "rating",
    step: "1",
    min: "1",
    max: "5"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "genre"
  }, "Genre: "), /*#__PURE__*/React.createElement("select", {
    id: "songGenre",
    type: "dropdown",
    name: "genre"
  }, /*#__PURE__*/React.createElement("option", {
    value: "",
    hidden: true
  }, " -- Select One --"), /*#__PURE__*/React.createElement("option", {
    value: "Classical"
  }, "Classical"), /*#__PURE__*/React.createElement("option", {
    value: "Country"
  }, "Country"), /*#__PURE__*/React.createElement("option", {
    value: "Dance"
  }, "Dance"), /*#__PURE__*/React.createElement("option", {
    value: "Disco"
  }, "Disco"), /*#__PURE__*/React.createElement("option", {
    value: "EDM"
  }, "EDM"), /*#__PURE__*/React.createElement("option", {
    value: "Hip-hop"
  }, "Hip-hop"), /*#__PURE__*/React.createElement("option", {
    value: "Indie"
  }, "Indie"), /*#__PURE__*/React.createElement("option", {
    value: "Instrumental"
  }, "Instrumental"), /*#__PURE__*/React.createElement("option", {
    value: "Jazz"
  }, "Jazz"), /*#__PURE__*/React.createElement("option", {
    value: "Metal"
  }, "Metal"), /*#__PURE__*/React.createElement("option", {
    value: "Pop"
  }, "Pop"), /*#__PURE__*/React.createElement("option", {
    value: "Rap"
  }, "Rap"), /*#__PURE__*/React.createElement("option", {
    value: "Rhythm & Blues"
  }, "Rhythm & Blues"), /*#__PURE__*/React.createElement("option", {
    value: "Rock"
  }, "Rock"), /*#__PURE__*/React.createElement("option", {
    value: "Other"
  }, "Other")), /*#__PURE__*/React.createElement("label", {
    htmlFor: "image"
  }, "Image: "), /*#__PURE__*/React.createElement("select", {
    id: "songImage",
    type: "dropdown",
    name: "image"
  }, /*#__PURE__*/React.createElement("option", {
    value: "",
    hidden: true
  }, " -- Select One --"), /*#__PURE__*/React.createElement("option", {
    value: "/assets/img/profile-notes.png"
  }, "Profile Notes"), /*#__PURE__*/React.createElement("option", {
    value: "/assets/img/pixel-music.png"
  }, "Pixel Music"), /*#__PURE__*/React.createElement("option", {
    value: "/assets/img/favorite-note.png"
  }, "Favorite Note"), /*#__PURE__*/React.createElement("option", {
    value: "/assets/img/piano-pixel.png"
  }, "Piano Pixel"), /*#__PURE__*/React.createElement("option", {
    value: "/assets/img/clover-note.png"
  }, "Clover Note")), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "makeSongSubmit",
    type: "submit",
    value: "Add Song!"
  }), /*#__PURE__*/React.createElement("input", {
    className: "resetSong",
    type: "reset",
    value: "Clear!"
  })));
}; //render out SongForm to the page and render default SongsList
//songs attribute of SongList is empty array - because we dont have 
//  data yet, but will at least get the HTML onto the page while waiting 
//  for server


var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(SongForm, {
    csrf: csrf
  }), document.querySelector("#makeSong"));
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
