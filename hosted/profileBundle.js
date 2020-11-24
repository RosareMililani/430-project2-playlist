"use strict";

//JSX is a cutsom syntax provided by React that lets you create HTML-like 
//  objects in JS as valid syntax
//JSX is secured against unsafe input and has a 'this' context so each object
//  made of it can have its own variable scope
var ProfileForm = function ProfileForm(props) {
  //const profileNodes = props.accounts.map(function(accounts){
  return (
    /*#__PURE__*/

    /* <div key={accounts._id} className="accounts">
        <img src="/assets/img/face.png" alt= "domo face" className="domoFaceProfile"/>
        <h3 className="profileName"> Name: {accounts.profileName}</h3>
        <br/>
        <br/>
        <h3 className="profileUsername"> Username: {accounts.username}</h3>
        <br/>
        <br/>
        <h3 className="profileNotes"> Notes: </h3>
    </div> */
    React.createElement("div", {
      className: "accounts"
    }, /*#__PURE__*/React.createElement("img", {
      src: "/assets/img/single-note-music.png",
      alt: "domo face",
      className: "domoFaceProfile"
    }), /*#__PURE__*/React.createElement("h3", {
      className: "profileNotes"
    }, " Notes: "), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("h3", {
      className: "profileName"
    }, " Name: "), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("h3", {
      className: "profileUsername"
    }, " Username: "))
  ); //});

  return /*#__PURE__*/React.createElement("div", {
    className: "listings"
  }, profileNodes);
};
/* const loadSongsFromServer = () => {
    sendAjax('GET', '/myPage', null, (data) => {
        ReactDOM.render(
            <SongList songs={data.songs} />, document.querySelector("#songs")
        );
    });
}; */
//accepts a Cross-Site_request-Forgery (CSRF) token to add to the login form
//without token, security on the server will prevent the form from working


var createLoginWindow = function createLoginWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(ProfileForm, {
    csrf: csrf
  }), document.querySelector("#content"));
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
