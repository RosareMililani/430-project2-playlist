const handleSong = (e) => {
    e.preventDefault();

    $("#songMessage").animate({width:'hide'},350);

    if($("#songName").val() == '' || $("#songArtist").val() == ''){
        handleError("Oops! All fields are required");
        return false;
    }

    sendAjax('POST', $("#songForm").attr("action"), $("#songForm").serialize(), function(){
        loadSongsFromServer();
    });

    return false;
};

const SongForm = (props) => {
    return (
        <form id= "songForm"
        onSubmit = {handleSong}
        name="songForm"
        action="/maker"
        method="POST"
        className="songForm"
        >
            <label htmlFor="name">Name: </label>
            <input id="songName" type="text" name="name" placeholder="Song Track"/>  
            <label htmlFor="artist">Artist: </label>
            <input id="songArtist" type="text" name="artist" placeholder="Artist"/>
            <input type= "hidden" name="_csrf" value={props.csrf} />
            <input className="makeSongSubmit" type="submit" value="Add Song!"/>     
        </form>
    );
};

//array of songs is empty- UI show no songs
//otherwise map function to create UI for each song stored in state 
//  of component. Every song will generate a song div and add it
//render out a songList with song nodes array
const SongList = function(props){
    if(props.songs.length === 0){
        return (
            <div className="songList">
                <h3 className="emptySong">No Songs Created Yet</h3>
            </div>
        );
    }

    const songNodes = props.songs.map(function(song){
        return (
            <div key={song._id} className="song">
                <img src="/assets/img/domoface.jpeg" alt= "domo face" className="domoFace"/>
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
const setup = function(csrf) {
    ReactDOM.render(
        <SongForm csrf={csrf} />, document.querySelector("#makeSong")
    );

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
