const handleSong = (e) => {
    e.preventDefault();

    $("#songMessage").animate({ width: 'hide' }, 350);

    if ($("#songName").val() == '' || $("#songArtist").val() == '' || $("#songRating").val() == '' ||
        $("#songGenre").val() == '' || $("#songFavorite").val() == '') {
        handleError("Oops! All fields are required");
        return false;
    }

    sendAjax('POST', $("#songForm").attr("action"), $("#songForm").serialize(), function () {
        loadSongsFromServer();
    });

    return false;
};

// handles the update function for the password change
const handleUpdate = (e) => {
    e.preventDefault();

    $("#postMessage").animate({ width: 'hide' }, 350);

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
            redirect: '/maker',
        });
    });
};

const SongForm = (props) => {
    return (
        <form id="songForm"
            onSubmit={handleSong}
            name="songForm"
            action="/maker"
            method="POST"
            className="songForm"
        >
            <label htmlFor="name">Track: </label>
            <input id="songName" type="text" name="name" placeholder="Song Track" />
            <label htmlFor="artist">Artist: </label>
            <input id="songArtist" type="text" name="artist" placeholder="Artist" />
            <label htmlFor="rating">Rating (1-5): </label>
            <input id="songRating" type="number" name="rating" step="1" min="1" max="5" />
            <label htmlFor="genre">Genre: </label>
            <select id="songGenre" type="dropdown" name="genre" >
                <option value="" hidden> -- Select One --</option>
                <option value="Classical">Classical</option>
                <option value="Country">Country</option>
                <option value="Dance">Dance</option>
                <option value="EDM">EDM</option>
                <option value="Hip-hop">Hip-hop</option>
                <option value="Indie">Indie</option>
                <option value="Instrumental">Instrumental</option>
                <option value="Jazz">Jazz</option>
                <option value="Metal">Metal</option>
                <option value="Pop">Pop</option>
                <option value="Rap">Rap</option>
                <option value="Rhythm & Blues">Rhythm & Blues</option>
                <option value="Rock">Rock</option>
                <option value="Other">Other</option>
            </select>
            <label htmlFor="favorite">Favorite: </label>
            <select id="songFavorite" type="dropdown" name="favorite" >
                <option value="" hidden> -- Select One --</option>
                <option value="favorite">Favorite</option>
                <option value="dontFavorite">Don't Favorite</option>
            </select>
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="makeSongSubmit" type="submit" value="Add Song!" />
            <input className="resetSong" type="reset" value="Clear!" />
            <label className="displayError">Message: </label>
        </form>
    );
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

const ProfileForm = function (props) {
    const profileInfo = props.songs.map(function (song) {
        //console.dir(song)
        return (
            <div key={song._id} className="accounts">
                <img src="/assets/img/profile-notes.png" alt="domo face" className="domoFaceProfile" />
                <h3 className="profileName"> Name: {song.user}</h3>
                <h3 className="profileUsername"> Username: {song.personName}</h3>
                <input type="hidden" name="_csrf" value={props.csrf} />
            </div>
        );
    });

    return (
        <div className="content">
            {profileInfo}
        </div>
    );
};

/* Displays songs to the screen */
const SongList = function (props) {
    //no songs added to the data
    if (props.songs.length === 0) {
        return (
            <div className="songList">
                <h3 className="emptySong">No Songs Avaliable</h3>
            </div>
        );
    }

    //if there is data, display onto screen
    const songNodes = props.songs.map(function (song) {
        console.dir(song)
        let today = new Date(song.createdDate);
        let formattedDate = today.toLocaleDateString(
            'en-gb',
            {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                timeZone: 'utc'
            }
        );

        return (
            <div key={song._id} className="song">
                {/* <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" /> */}
                <h3 className="songName"> Name: {song.name}</h3>
                {/* <h3 className="songUserName">User: {song.user}</h3> */}
                {/* <h3 className="songProfileName">Profile: {song.personName}</h3> */}
                <h3 className="songArtist"> Artist: {song.artist}</h3>
                <h3 className="songRating"> Rating: {song.rating}/5</h3>
                <h3 className="songGenre"> Genre: {song.genre}</h3>
                <h3 className="songDate"> Date Added: {formattedDate}</h3>
            </div>
        );
    });

    return (
        <div className="songList">
            {songNodes}
        </div>
    );
};



//grabs songs from the server and render a SongsList
//periodically update the screen with changes
const loadSongsFromServer = () => {
    sendAjax('GET', '/getSongs', null, (data) => {
        ReactDOM.render(
            <SongList songs={data.songs} />, document.querySelector("#songs")
        );
    });
};

const createCreateWindow = (csrf) => {
    ReactDOM.render(
        <SongForm csrf={csrf} />, document.querySelector("#makeSong")
    );

    /* ReactDOM.render(
        <SongList songs={[]} />, document.querySelector("#songs")
    ); */
}

const createProfileWindow = (csrf) => {
    ReactDOM.render(
        <ProfileForm csrf={csrf} />, document.querySelector("#content")
    );

    ReactDOM.render(
        <SongList songs={[]} />, document.querySelector("#songs")
    );
}

const createSettingWindow = (csrf) => {
    ReactDOM.render(
        <SettingsForm csrf={csrf} />, document.querySelector("#songs")
    );
};
//render out SongForm to the page and render default SongsList
//songs attribute of SongList is empty array - because we dont have 
//  data yet, but will at least get the HTML onto the page while waiting 
//  for server
const setup = function (csrf) {
    const createButton = document.querySelector("#createButton");
    const createProfileButton = document.querySelector("#myPageButton");
    const settingButton = document.querySelector("#settingsButton");

    createButton.addEventListener("click", (e) => {
        e.preventDefault();
        createCreateWindow(csrf);
        return false;
    });

    createProfileButton.addEventListener("click", (e) => {
        e.preventDefault();
        createProfileWindow(csrf);
        return false;
    });

    settingButton.addEventListener("click", (e) => {
        e.preventDefault();
        createSettingWindow(csrf);
        return false;
    });

    loadSongsFromServer();
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

