//called when users attempt to login by clicking the login button
//send AJAX request to our login POST url
const handleLogin = (e) => {
    e.preventDefault();

    $("#songMessage").animate({ width: 'hide' }, 350);

    if ($("#user").val() == '' || $("#pass").val() == '') {
        handleError("Oops! Username or password is empty");
        return false;
    }

    console.log($("input[name=_csrf]").val());

    sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

    return false;
}

//called when users attempt to login by clicking the login button
//send AJAX request to our login POST url
const handleSignup = (e) => {
    e.preventDefault();

    $("#songMessage").animate({ width: 'hide' }, 350);

    if ($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '' || $("#profileName").val() == '') {
        handleError("Oops! All fields are required");
        return false;
    }

    if ($("#pass").val() !== $("#pass2").val()) {
        handleError("Oh no! Passwords do not match");
        return false;
    }

    sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);

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
            {/* <div class="navlink"><a href="/signup">Don't have an account? Click here!</a></div> */}
            {/* <hr/>
            <label className = "noAccountLabel">Don't Have An Account?</label>
            <button type="submit" formAction= "/signup" value="Sign up"/> */}
        </form>

    );
};

const NoLogin = (props) => {
    return (
        <form id="nologin" name="nologin"
            /* onSubmit = {handleNoLogin} */
            action="/signup"
            method="POST"
            className="mainSignUpForm"
        >
            <label className="noAccountLabel">Don't Have An Account?</label>
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input type="submit" value="Sign up" />
        </form>
    )
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
                <label htmlFor="profileName">Name: </label>
                <input id="profileName" type="text" name="profileName" placeholder="your name" />
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

//accepts a Cross-Site_request-Forgery (CSRF) token to add to the login form
//without token, security on the server will prevent the form from working
const createLoginWindow = (csrf) => {
    ReactDOM.render(
        <LoginWindow csrf={csrf} />,
        document.querySelector("#content")
    );

    /* ReactDOM.render(
        <CreateAccountButton label="Create An Account" />,
        document.querySelector("#createAccount")
    ) */
};

//render a new sinup window that can handle react events
const createSignupWindow = (csrf) => {
    ReactDOM.render(
        <SignupWindow csrf={csrf} />,
        document.querySelector("#content")
    );
};

//attach events to page buttons
const setup = (csrf) => {
    const loginButton = document.querySelector("#loginButton");
    const signupButton = document.querySelector("#signupButton");

    signupButton.addEventListener("click", (e) => {
        e.preventDefault();
        createSignupWindow(csrf);
        return false;
    });

    //create a dafault view on the page
    //if not, ther ewill not be any UI on the page when loading
    loginButton.addEventListener("click", (e) => {
        e.preventDefault();
        createLoginWindow(csrf);
        return false;
    });

    createLoginWindow(csrf); //default window
};

//since we are never reloading the page now, we need to make requests
//  to get new CSRF from the server
//allow us to reach out and get new tokens when needed
const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

const CreateAccountButton = (props) => {
    /* console.log("clikced on");
    return(
        <button onClick="/signup" action="/signup">{props.label}</button>
    ); */
    return (
        /* <form
            action="/signup"
            method="GET">
            <label className="noAccountLabel">Don't Have An Account?</label>
            <input type="submit" formAction= "/signup" value="Sign up" />
        </form> */
        < form action = "/signup" >
            <input type="submit" value="Go to Signup" />
        </form >
    );


};

//setup the rest of the page to allow our React components show various
//  'pages. without leaving the page
$(document).ready(function () {
    getToken();
});