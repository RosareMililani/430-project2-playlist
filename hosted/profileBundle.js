"use strict";

//JSX is a cutsom syntax provided by React that lets you create HTML-like 
//  objects in JS as valid syntax
//JSX is secured against unsafe input and has a 'this' context so each object
//  made of it can have its own variable scope
var ProfileForm = function ProfileForm(props) {
  //const songNodes = props.songs.map(function (song) {
  //console.dir(song)
  return /*#__PURE__*/React.createElement("div", {
    /* key={song._id}  */
    className: "accounts"
  }, /*#__PURE__*/React.createElement("img", {
    src: "/assets/img/profile-notes.png",
    alt: "domo face",
    className: "domoFaceProfile"
  }), /*#__PURE__*/React.createElement("h3", {
    className: "profileName"
  }, " Name: "), /*#__PURE__*/React.createElement("h3", {
    className: "profileUsername"
  }, " Username: ")); //});

  /* return (
      <div className= "profileInfo">
          {songNodes}
      </div>
  ); */

  /* //const profileNodes = props.accounts.map(function(accounts){
      return (
          <div key={accounts._id} className="accounts">
              <img src="/assets/img/face.png" alt= "domo face" className="domoFaceProfile"/>
              <h3 className="profileName"> Name: {accounts.profileName}</h3>
              <br/>
              <br/>
              <h3 className="profileUsername"> Username: {accounts.username}</h3>
              <br/>
              <br/>
              <h3 className="profileNotes"> Notes: </h3>
          </div>
          <div className="accounts">
              <img src="/assets/img/profile-notes.png" alt= "domo face" className="domoFaceProfile"/>
              <h3 className="profileName"> Name: {{accounts.name}}</h3>
              <h3 className="profileUsername"> Username: {{accounts.age}}</h3>
          </div>
      );
  //}); */

  /* return (
      <div className= "listings">
          {profileNodes}
      </div>
  ); */
};

var SongList = function SongList(props) {
  //reality check - but should never happen
  if (props.users.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "songList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptySong"
    }, "No Songs Avaliable"));
  }

  var songNodes = props.songs.map(function (song) {
    return /*#__PURE__*/React.createElement("div", {
      key: song._id,
      className: "song"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "songName"
    }, " Name: ", song.name), /*#__PURE__*/React.createElement("h3", {
      className: "songArtist"
    }, " Artist: ", song.artist), /*#__PURE__*/React.createElement("h3", {
      className: "songUserName"
    }, "User: ", song.user));
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
    ReactDOM.render( /*#__PURE__*/React.createElement(SongList, {
      songs: data.songs
    }), document.querySelector("#songs"));
  });
}; //accepts a Cross-Site_request-Forgery (CSRF) token to add to the login form
//without token, security on the server will prevent the form from working


var createLoginWindow = function createLoginWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(ProfileForm, {
    csrf: csrf
  }), document.querySelector("#content"));
  ReactDOM.render( /*#__PURE__*/React.createElement(SongList, {
    songs: []
  }), document.querySelector("#songs"));
  loadSongsFromServer();
}; //attach events to page buttons


var setup = function setup(csrf) {
  createLoginWindow(csrf); //default window
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
