"use strict";

//called when users attempt to login by clicking the login button
//send AJAX request to our login POST url
var handleLogin = function handleLogin(e) {
  e.preventDefault();
  $("#songMessage").animate({
    width: 'hide'
  }, 350); //throw error is there is a missing field

  if ($("#user").val() == '' || $("#pass").val() == '') {
    handleError("Oops! Username or password is empty");
    return false;
  }

  console.log($("input[name=_csrf]").val()); //correct information is valid

  sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);
  return false;
}; //JSX is a cutsom syntax provided by React that lets you create HTML-like 
//  objects in JS as valid syntax
//JSX is secured against unsafe input and has a 'this' context so each object
//  made of it can have its own variable scope


var LoginWindow = function LoginWindow(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "loginForm",
    name: "loginForm",
    onSubmit: handleLogin,
    action: "/login",
    method: "POST",
    className: "mainForm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("label", {
    className: "loginLabel"
  }, "Login"), /*#__PURE__*/React.createElement("label", {
    htmlFor: "username"
  }, "Username: "), /*#__PURE__*/React.createElement("input", {
    id: "user",
    type: "text",
    name: "username",
    placeholder: "username"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "pass"
  }, "Password: "), /*#__PURE__*/React.createElement("input", {
    id: "pass",
    type: "password",
    name: "pass",
    placeholder: "password"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "formSubmit",
    type: "submit",
    value: "Sign in"
  })));
}; //render login page when clicked on / logged out of account


var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(LoginWindow, {
    csrf: csrf
  }), document.querySelector("#content"));
}; //since we are never reloading the page now, we need to make requests
//  to get new CSRF from the server
//allow us to reach out and get new tokens when needed


var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
}; //setup the rest of the page to allow our React components show various
//  'pages. without leaving the page


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
