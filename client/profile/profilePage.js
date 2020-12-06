/* Displays songs to the screen */
const ProfileForm = function (props) {
    //no songs added to the data
    if (props.songs.length === 0) {
        return (
            <div className="songList">
                <h3 className="emptySong">No Added Songs Yet</h3>
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

        //display all information
        return (
            <div key={song._id} className="song">
                <h3 className="songName"> Name: {song.name}</h3>
                <h3 className="songArtist"> Artist: {song.artist}</h3>
                <h3 className="songRating"> Rating: {song.rating}/5</h3>
                <h3 className="songGenre"> Genre: {song.genre}</h3>
                <h3 className="songDate"> Date Added: {formattedDate}</h3>
                <h3 className="songUser"> User: {song.user}</h3>
            </div>
        );
    });

    //return information
    return (
        <div className="songList">
            <h3 className="songLabel">Your Added Songs:</h3>
            {songNodes}
        </div>
    );
};

//load in song data from /getSongs endpoint
const loadSongsFromServer = () => {
    sendAjax('GET', '/getSongs', null, (data) => {
        ReactDOM.render(
            <ProfileForm songs={data.songs} />, document.querySelector("#songs")
        );
    });
};

//attach events to page buttons
const setup = (csrf) => {
    ReactDOM.render(
        <ProfileForm songs={[]} />, document.querySelector("#songs")
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
$(document).ready(function () {
    getToken();
});