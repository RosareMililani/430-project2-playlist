//called when users attempt to login by clicking the login button
//send AJAX request to our login POST url
const handleSignup = (e) => {
    e.preventDefault();

    $("#songMessage").animate({ width: 'hide' }, 350);

    if ($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
        handleError("Oops! All fields are required");
        return false;
    }

    if ($("#pass").val() !== $("#pass2").val()) {
        handleError("Ahh! Passwords don't match");
        return false;
    }

    sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);

    return false;
}

//alows to quickly switch between the signup and login paes without actually
//  changing the web page
const SignupWindow = (props) => {
    return (
        <form id="signupForm" name="signupForm"
            onSubmit={handleSignup}
            action="/signup"
            method="POST"
            className="mainSignForm"
        >
            <div className="container">
                <label className="signupLabel">Sign Up</label>
                <label htmlFor="username">Username: </label>
                <input id="user" type="text" name="username" placeholder="username" />
                <label htmlFor="pass">Password: </label>
                <input id="pass" type="password" name="pass" placeholder="password" />
                <label htmlFor="pass2">Password: </label>
                <input id="pass2" type="password" name="pass2" placeholder="retype password" />
                <input type="hidden" name="_csrf" value={props.csrf} />
                <input className="formSubmit" type="submit" value="Sign Up" />
            </div>
        </form>
    );
};

//setup the signup window when clicked on
const setup = (csrf) => {
    ReactDOM.render(
        <SignupWindow csrf={csrf} />,
        document.querySelector("#content")
    );
};

//since we are never reloading the page now, we need to make requests
//  to get new CSRF from the server
//allow us to reach out and get new tokens when needed
const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

//setup the rest of the page to allow our React components show various
//  'pages. without leaving the page
$(document).ready(function () {
    getToken();
});