// handles the update function for the password change
const handleUpdate = (e) => {
    e.preventDefault();

    $("#songMessage").animate({ width: 'hide' }, 350);

    //any of the passcodes are not inputted
    if ($("#newpass").val() == '' || $("#newpass2").val() == '') {
        handleError("Oops! All fields are required!");
        return false;
    }

    //passwords do not match each other
    if ($("#newpass").val() !== $("#newpass2").val()) {
        handleError("Passwords do not match");
        return false;
    }

    handleError("Your password has been updated!");

    sendAjax('POST', $("#settingsForm").attr("action"), $("#settingsForm").serialize(), redirect);

    return false;
};

//update the password to the current account (logged in)
const updatePassword = (request, response) => {
    const req = request;
    const res = response;

    // force cast to strings to cover some security flaws
    req.body.pass = `${req.body.pass}`;
    req.body.pass2 = `${req.body.pass2}`;

    // need to enter twice
    if (!req.body.pass || !req.body.pass2) {
        return res.status(400).json({
            error: 'All fields are required',
        });
    }

    // if passwords dont match
    if (req.body.pass !== req.body.pass2) {
        return res.status(400).json({
            error: 'Passwords do not match',
        });
    }

    return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
        Account.AccountModel.updateOne({ _id: req.session.account._id }, {
            username: req.session.account.username,
            salt,
            password: hash,
        }, (err) => {
            if (err) {
                return res.status(400).json({
                    error: 'An error occured',
                });
            }
            return res.status(200);
        });
        res.json({
            //redirect: '/maker',
            redirect: '/settings',
        });
    });
};

//settings form to change their password
const SettingsForm = (props) => {
    return (
        <form id="settingsForm"
            onSubmit={handleUpdate}
            name="settingsForm"
            action="/updatePassword"
            method="POST"
            className="settingsForm"
        >
            <div className="container">
                <label className="passwordChange">Change Password:</label>
                <label htmlFor="newpass">New Password: </label>
                <input id="newpass" type="password" name="newpass" placeholder="New password" />
                <label htmlFor="newpass2">Confirm Password: </label>
                <input id="newpass2" type="password" name="newpass2" placeholder="Confirm password" />

                <input type="hidden" name="_csrf" value={props.csrf} />
                <input className="formSubmit" type="submit" value="Update" />
            </div>
        </form>
    );
};

const setup = function (csrf) {
    ReactDOM.render(
        <SettingsForm csrf={csrf} />, document.querySelector("#content")
    );
};

//allow us to get CSRF token for new submissions
const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

//page load - getToken() to get new CSRF token and setup React components
$(document).ready(function () {
    getToken();
});