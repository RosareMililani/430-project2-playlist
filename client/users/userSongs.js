const AllSongForm = (props) => {
    return (
        <form id="allSongForm"
            onSubmit={handleSong}
            name="allSongForm"
            action="/maker"
            method="POST"
            className="allSongForm"
        >
            <span className="close">&times;</span>
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
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="makeSongSubmit" type="submit" value="Add Song!" />
            <input className="resetSong" type="reset" value="Reset!"/>
        </form>
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

    //if there is data, display onto screen
    const songNodes = props.songs.map(function (song) {
        return (
            <div key={song._id} className="song">
                {/* <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" /> */}
                <h3 className="songName"> Name: {song.name}</h3>
                <h3 className="songArtist"> Artist: {song.artist}</h3>
                <h3 className="songRating"> Rating: {song.rating}/5</h3>
                <h3 className="songGenre"> Genre: {song.genre}</h3>
                {/* <h3 className="songDate"> Date : {song.createdDate}</h3> */}
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

//render out SongForm to the page and render default SongsList
//songs attribute of SongList is empty array - because we dont have 
//  data yet, but will at least get the HTML onto the page while waiting 
//  for server
const setup = function (csrf) {
    ReactDOM.render(
        <SongForm csrf={csrf} />, document.querySelector("#makeSong")
    );

   /*  ReactDOM.render(
        <FilterForm csrf={csrf} />, document.querySelector("#makeFilter")
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

const SongList = function (props) {
    //reality check - but should never happen
    if (props.users.length === 0) {
        return (
            <div className="songList">
                <h3 className="emptySong">No Songs Avaliable - Login to Add to the List</h3>
            </div>
        );
    }

    const songNodes = props.songs.map(function (song) {
        return (
            <div key={song._id} className="song">
                <h3 className="songName"> Name: {song.name}</h3>
                <h3 className="songArtist"> Artist: {song.artist}</h3>
            </div>
        );
    });

    return (
        <div className="songList">
            {songNodes}
        </div>
    );
};

//page load - getToken() to get new CSRF token and setup React components
$(document).ready(function () {
    getToken();
});

