"use strict";

//called when users attempt to login by clicking the login button
//send AJAX request to our login POST url
var handleSignup = function handleSignup(e) {
  e.preventDefault();
  $("#songMessage").animate({
    width: 'hide'
  }, 350); //throw error if there are missing fields

  if ($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
    handleError("Oops! All fields are required");
    return false;
  } //throw error if the passwords dont match


  if ($("#pass").val() !== $("#pass2").val()) {
    handleError("Ahh! Passwords don't match");
    return false;
  } //correct information if valid


  sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);
  return false;
}; //alows to quickly switch between the signup and login paes without actually
//  changing the web page


var SignupWindow = function SignupWindow(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "signupForm",
    name: "signupForm",
    onSubmit: handleSignup,
    action: "/signup",
    method: "POST",
    className: "mainSignForm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("label", {
    className: "signupLabel"
  }, "Sign Up"), /*#__PURE__*/React.createElement("label", {
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
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "pass2"
  }, "Password: "), /*#__PURE__*/React.createElement("input", {
    id: "pass2",
    type: "password",
    name: "pass2",
    placeholder: "retype password"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "formSubmit",
    type: "submit",
    value: "Sign Up"
  })));
}; //setup the signup window when clicked on


var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(SignupWindow, {
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
