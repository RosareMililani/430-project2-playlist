//JSX is a cutsom syntax provided by React that lets you create HTML-like 
//  objects in JS as valid syntax
//JSX is secured against unsafe input and has a 'this' context so each object
//  made of it can have its own variable scope
const ProfileForm = function (props) {
    //const songNodes = props.songs.map(function (song) {
        //console.dir(song)
        return (
            <div /* key={song._id}  */className="accounts">
                <img src="/assets/img/profile-notes.png" alt= "domo face" className="domoFaceProfile"/>
                <h3 className="profileName"> Name: {/* {song.user} */}</h3>
                <h3 className="profileUsername"> Username: {/* {song.personName} */}</h3>
            </div>
        );
    //});

    /* return (
        <div className= "profileInfo">
            {songNodes}
        </div>
    ); */

    /* //const profileNodes = props.accounts.map(function(accounts){
        return (
            <div key={accounts._id} className="accounts">
                <img src="/assets/img/face.png" alt= "domo face" className="domoFaceProfile"/>
                <h3 className="profileName"> Name: {accounts.profileName}</h3>
                <br/>
                <br/>
                <h3 className="profileUsername"> Username: {accounts.username}</h3>
                <br/>
                <br/>
                <h3 className="profileNotes"> Notes: </h3>
            </div>
            <div className="accounts">
                <img src="/assets/img/profile-notes.png" alt= "domo face" className="domoFaceProfile"/>
                <h3 className="profileName"> Name: {{accounts.name}}</h3>
                <h3 className="profileUsername"> Username: {{accounts.age}}</h3>
            </div>
        );
    //}); */
    

    /* return (
        <div className= "listings">
            {profileNodes}
        </div>
    ); */
};

const loadSongsFromServer = () => {
    sendAjax('GET', '/myPage', null, (data) => {
        ReactDOM.render(
            <SongList songs={data.songs} />, document.querySelector("#songs")
        );
    });
};

//accepts a Cross-Site_request-Forgery (CSRF) token to add to the login form
//without token, security on the server will prevent the form from working
const createLoginWindow = (csrf) => {
    ReactDOM.render(
        <ProfileForm csrf={csrf} />,
        document.querySelector("#content")
    );

    loadSongsFromServer();
};

//attach events to page buttons
const setup = (csrf) => {
    createLoginWindow(csrf); //default window
};

//allow us to get CSRF token for new submissions
const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

//page load - getToken() to get new CSRF token and setup React components
$(document).ready(function() {
    getToken();
});