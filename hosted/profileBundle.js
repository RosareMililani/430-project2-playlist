"use strict";

var ProfileForm = function ProfileForm(props) {
  if (props.songs.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "profileInfo"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptySong"
    }, "No Info Avaliable"));
  }

  var profileInfo = props.songs.map(function (song) {
    console.dir(song);
    return /*#__PURE__*/React.createElement("div", {
      key: song._id,
      className: "accounts"
    }, /*#__PURE__*/React.createElement("img", {
      src: "/assets/img/profile-notes.png",
      alt: "image profile",
      className: "imageProfile"
    }), /*#__PURE__*/React.createElement("h3", {
      className: "profileName"
    }, " Username: ", song.user), /*#__PURE__*/React.createElement("h3", {
      className: "profileUsername"
    }, " Name: ", song.personName), /*#__PURE__*/React.createElement("h3", {
      className: "songLabel"
    }, "My Added Songs:"));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "profileInfo"
  }, profileInfo);
};
/* Displays songs to the screen */


var SongList = function SongList(props) {
  //no songs added to the data
  if (props.songs.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "songList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptySong"
    }, "No Songs Avaliable"));
  } //if there is data, display onto screen


  var songNodes = props.songs.map(function (song) {
    console.dir(song);
    var today = new Date(song.createdDate);
    var formattedDate = today.toLocaleDateString('en-gb', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'utc'
    });
    return /*#__PURE__*/React.createElement("div", {
      key: song._id,
      className: "song"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "songName"
    }, " Name: ", song.name), /*#__PURE__*/React.createElement("h3", {
      className: "songArtist"
    }, " Artist: ", song.artist), /*#__PURE__*/React.createElement("h3", {
      className: "songRating"
    }, " Rating: ", song.rating, "/5"), /*#__PURE__*/React.createElement("h3", {
      className: "songGenre"
    }, " Genre: ", song.genre), /*#__PURE__*/React.createElement("h3", {
      className: "songDate"
    }, " Date Added: ", formattedDate));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "songList"
  }, songNodes);
};

var loadSongsFromServer = function loadSongsFromServer() {
  /* sendAjax('GET', '/myPage', null, (data) => {
      ReactDOM.render(
          <SongList songs={data.songs} />, document.querySelector("#songs")
      );
  }); */
  sendAjax('GET', '/getSongs', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(ProfileForm, {
      songs: data.songs
    }), document.querySelector("#content"));
  });
  sendAjax('GET', '/getSongs', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(SongList, {
      songs: data.songs
    }), document.querySelector("#songs"));
  });
}; //attach events to page buttons


var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(ProfileForm, {
    songs: []
  }), document.querySelector("#content")); //might need to switch to this?

  /* ReactDOM.render(
      <ProfileForm songs={data.songs} />, document.querySelector("#content")
  ); */

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
