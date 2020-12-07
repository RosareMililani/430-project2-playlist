"use strict";

// handles the update function for the password change
var handleUpdate = function handleUpdate(e) {
  e.preventDefault();
  $("#postMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#pass").val() == '' || $("#pass2").val() == '') {
    handleError("All fields are required to change password");
    return false;
  }

  if ($("#pass").val() !== $("#pass2").val()) {
    handleError("Passwords do not match");
    return false;
  }

  alert("You have changed your password");
  sendAjax('POST', $("#settingsForm").attr("action"), $("#settingsForm").serialize(), redirect);
  return false;
};

var updatePassword = function updatePassword(request, response) {
  var req = request;
  var res = response; // force cast to strings to cover some security flaws

  req.body.pass = "".concat(req.body.pass);
  req.body.pass2 = "".concat(req.body.pass2); // need to enter twice

  if (!req.body.pass || !req.body.pass2) {
    return res.status(400).json({
      error: 'All fields are required'
    });
  } // if passwords dont match


  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({
      error: 'Passwords do not match'
    });
  }

  return Account.AccountModel.generateHash(req.body.pass, function (salt, hash) {
    Account.AccountModel.updateOne({
      _id: req.session.account._id
    }, {
      username: req.session.account.username,
      salt: salt,
      password: hash
    }, function (err) {
      if (err) {
        return res.status(400).json({
          error: 'An error occured'
        });
      }

      return res.status(200);
    });
    res.json({
      //redirect: '/maker',
      redirect: '/settings'
    });
  });
}; //settings form to change their password


var SettingsForm = function SettingsForm(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "settingsForm",
    onSubmit: handleUpdate,
    name: "settingsForm",
    action: "/updatePassword",
    method: "POST",
    className: "settingsForm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("label", {
    className: "passwordChange"
  }, "Change Password:"), /*#__PURE__*/React.createElement("label", {
    htmlFor: "newpass"
  }, "New Password: "), /*#__PURE__*/React.createElement("input", {
    id: "newpass",
    type: "password",
    name: "newpass",
    placeholder: "New password"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "newpass2"
  }, "Confirm Password: "), /*#__PURE__*/React.createElement("input", {
    id: "newpass2",
    type: "password",
    name: "newpass2",
    placeholder: "Confirm password"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "formSubmit",
    type: "submit",
    value: "Update"
  })));
};

var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(SettingsForm, {
    csrf: csrf
  }), document.querySelector("#content"));
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
