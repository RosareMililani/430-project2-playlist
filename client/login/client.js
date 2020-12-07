//called when users attempt to login by clicking the login button
//send AJAX request to our login POST url
const handleLogin = (e) => {
    e.preventDefault();

    $("#songMessage").animate({ width: 'hide' }, 350);

    //throw error is there is a missing field
    if ($("#user").val() == '' || $("#pass").val() == '') {
        handleError("Oops! Username or password is empty");
        return false;
    }

    console.log($("input[name=_csrf]").val());

    //correct information is valid
    sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

    return false;
}

//JSX is a cutsom syntax provided by React that lets you create HTML-like 
//  objects in JS as valid syntax
//JSX is secured against unsafe input and has a 'this' context so each object
//  made of it can have its own variable scope
const LoginWindow = (props) => {
    return (
        <form id="loginForm" name="loginForm"
            onSubmit={handleLogin}
            action="/login"
            method="POST"
            className="mainForm"
        >
            <div className="container">
                <label className="loginLabel">Login</label>
                <label htmlFor="username">Username: </label>
                <input id="user" type="text" name="username" placeholder="username" />
                <label htmlFor="pass">Password: </label>
                <input id="pass" type="password" name="pass" placeholder="password" />
                <input type="hidden" name="_csrf" value={props.csrf} />
                <input className="formSubmit" type="submit" value="Sign in" />
            </div>
        </form>

    );
};

//render login page when clicked on / logged out of account
const setup = (csrf) => {
    ReactDOM.render(
        <LoginWindow csrf={csrf} />,
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