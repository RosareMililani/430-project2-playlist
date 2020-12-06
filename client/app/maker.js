//checks if all information is filled out 
const handleSong = (e) => {
    e.preventDefault();

    $("#songMessage").animate({ width: 'hide' }, 350);

    if ($("#songName").val() == '' || $("#songArtist").val() == '' || $("#songRating").val() == '' ||
        $("#songGenre").val() == '' || $("#songImage").val() == '') {
        handleError("Oops! All fields are required");
        return false;
    }

    sendAjax('POST', $("#songForm").attr("action"), $("#songForm").serialize(), function () {
        //loadSongsFromServer();
    });

    return false;
};

//creates the information that will be stored
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
                <option value="Disco">Disco</option>
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
            <label htmlFor="image">Image: </label>
            <select id="songImage" type="dropdown" name="image" >
                <option value="" hidden> -- Select One --</option>
                <option value="/assets/img/profile-notes.png">Profile Notes</option>
                <option value="/assets/img/pixel-music.png">Pixel Music</option>
                <option value="/assets/img/favorite-note.png">Favorite Note</option>
            </select>
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="makeSongSubmit" type="submit" value="Add Song!" />
            <input className="resetSong" type="reset" value="Clear!" />
            <label className="displayError">Message: </label>
        </form>
    );
};

//render out SongForm to the page and render default SongsList
//songs attribute of SongList is empty array - because we dont have 
//  data yet, but will at least get the HTML onto the page while waiting 
//  for server
const setup = function (csrf) {
    ReactDOM.render(
        <SongForm csrf={csrf} />, document.querySelector("#makeSong")
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

