const handleDomo = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);

    if ($("#domoName").val() == '' || $("#domoAge").val() == '' || $("#domoPower").val() == '') {
        handleError("RAWR! All fields are required");
        return false;
    }

    sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function () {
        loadDomosFromServer();
    });

    return false;
};

const DomoForm = (props) => {
    return (
        <form id="domoForm"
            onSubmit={handleDomo}
            name="domoForm"
            action="/maker"
            method="POST"
            className="domoForm"
        >
            <label htmlFor="name">Name: </label>
            <input id="domoName" type="text" name="name" placeholder="Domo Name" />
            <label htmlFor="age">Age: </label>
            <input id="domoAge" type="text" name="age" placeholder="Domo Age" />
            <label htmlFor="power">Power: </label>
            <input id="domoPower" type="text" name="power" placeholder="Domo Power" />
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="makeDomoSubmit" type="submit" value="Make Domo" />
        </form>
    );
};

//array of domos is empty- UI show no domos
//otherwise map function to create UI for each domo stored in state 
//  of component. Every domo will generate a domo div and add it
//render out a domolist with domonodes array
const DomoList = function (props) {
    if (props.domos.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Domos yet</h3>
            </div>
        );
    }

    let now = new Date();
    let formattedDate = now.toLocaleDateString(
        'en-gb',
        {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            timeZone: 'utc'
        }
    );
    console.log(now);
    console.log(formattedDate);

    const domoNodes = props.domos.map(function (domo) {
        /* let newFormatDate = domos.createdDate.toLocaleDateString(
            'en-gb',
            {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                timeZone: 'utc'
            }
        );
        console.log("this is new format" + newFormatDate); */

        return (
            <div key={domo._id} className="domo">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="domoName"> Name: {domo.name}</h3>
                <h3 className="domoAge"> Age: {domo.age}</h3>
                <h3 className="domoPower">Power: {domo.power}</h3>
                {/* <h3 className="domoDate">Added: {newFormatDate}</h3> */}
                <h3 className="domoDate">Date Added: {formattedDate}</h3>
            </div>
        );
    });

    return (
        <div className="domoList">
            {domoNodes}
        </div>
    );
};

//grabs domos from the server and render a DomoList
//periodically update the screen with changes
const loadDomosFromServer = () => {
    sendAjax('GET', '/getDomos', null, (data) => {
        ReactDOM.render(
            <DomoList domos={data.domos} />, document.querySelector("#domos")
        );
    });
};

//render out DomoForm to the page and render default DomoList
//domos attribute of DomoList is empty array - because we dont have 
//  data yet, but will at least get the HTML onto the page while waiting 
//  for server
const setup = function (csrf) {
    ReactDOM.render(
        <DomoForm csrf={csrf} />, document.querySelector("#makeDomo")
    );

    ReactDOM.render(
        <DomoList domos={[]} />, document.querySelector("#domos")
    );

    loadDomosFromServer();
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
