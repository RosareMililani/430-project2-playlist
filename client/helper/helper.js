/* Handles any error, if field is missing, et.c */
const handleError = (message) => {
    $("#errorMessage").text(message);
    $("#songMessage").animate({width:'toggle'},350);
};

//redirect page
const redirect = (response) => {
    $("#songMessage").animate({width:'hide'},350);
    window.location = response.redirect;
};

//send data to json
const sendAjax = (type, action, data, success) => {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function(xhr, status, error){
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};