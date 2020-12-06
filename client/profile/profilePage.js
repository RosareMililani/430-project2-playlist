const ProfileForm = (props) => {
    if (props.songs.length === 0) {
        return (
            <div className="profileInfo">
                <h3 className="emptySong">No Info Avaliable</h3>
            </div>
        );
    }

    const profileInfo = props.songs.map(function (song) {
        console.dir(song)
        return (
            <div key={song._id} className="accounts">
                <img src="/assets/img/profile-notes.png" alt="image profile" className="imageProfile" />
                <h3 className="profileName"> Username: {song.user}</h3>
                <h3 className="profileUsername"> Name: {song.personName}</h3>
                <h3 className="songLabel">My Added Songs:</h3>
            </div>
        );
    });

    return (
        <div className="profileInfo">
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
                <h3 className="songName"> Name: {song.name}</h3>
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


const loadSongsFromServer = () => {
    /* sendAjax('GET', '/myPage', null, (data) => {
        ReactDOM.render(
            <SongList songs={data.songs} />, document.querySelector("#songs")
        );
    }); */
    sendAjax('GET', '/getSongs', null, (data) => {
        ReactDOM.render(
            <ProfileForm songs={data.songs} />, document.querySelector("#content")
        );
    });
    sendAjax('GET', '/getSongs', null, (data) => {
        ReactDOM.render(
            <SongList songs={data.songs} />, document.querySelector("#songs")
        );
    });
};

//attach events to page buttons
const setup = (csrf) => {
    ReactDOM.render(
        <ProfileForm songs={[]} />, document.querySelector("#content")
    );
    //might need to switch to this?
    /* ReactDOM.render(
        <ProfileForm songs={data.songs} />, document.querySelector("#content")
    ); */

    ReactDOM.render(
        <SongList songs={[]} />, document.querySelector("#songs")
    );
    loadSongsFromServer();
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