const SongList = function (props) {
    //reality check - but should never happen
    if (props.songs.length === 0) {
        return (
            <div className="songList">
                <h3 className="emptySong">No Songs Avaliable</h3>
            </div>
        );
    }

    const songNodes = props.songs.map(function (song) {
        return (
            <div key={song._id} className="song">
                <img src="/assets/img/favorite-note.png" alt="music image" className="musicImage" />
                <h3 className="songName"> Name: {song.name}</h3>
                <h3 className="songArtistAll"> Artist: {song.artist}</h3>
                <h3 className="songUserName">Added By: {song.user}</h3>
            </div>
        );
    });

    return (
        <div className="songList">
            <h3 className="songLabel">All Users Songs:</h3>
            {songNodes}
        </div>
    );
};


//grabs songs from the server and render a SongsList
//periodically update the screen with changes
const loadSongsFromServer = () => {
    sendAjax('GET', '/allSongs', null, (data) => {
        ReactDOM.render(
            <SongList songs={data.songs} />, document.querySelector("#songs")
        );
    });
};

//render out SongForm to the page and render default SongsList
//songs attribute of SongList is empty array - because we dont have 
//  data yet, but will at least get the HTML onto the page while waiting 
//  for server
const setup = function (csrf) {
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
$(document).ready(function () {
    getToken();
});

