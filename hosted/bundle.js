"use strict";

var handleSong = function handleSong(e) {
  e.preventDefault();
  $("#songMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#songName").val() == '' || $("#songArtist").val() == '' || $("#songRating").val() == '' || $("#songGenre").val() == '' || $("#songFavorite").val() == '') {
    handleError("Oops! All fields are required");
    return false;
  }

  sendAjax('POST', $("#songForm").attr("action"), $("#songForm").serialize(), function () {//loadSongsFromServer();
  });
  return false;
};

var SongForm = function SongForm(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "songForm",
    onSubmit: handleSong,
    name: "songForm",
    action: "/maker",
    method: "POST",
    className: "songForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "name"
  }, "Track: "), /*#__PURE__*/React.createElement("input", {
    id: "songName",
    type: "text",
    name: "name",
    placeholder: "Song Track"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "artist"
  }, "Artist: "), /*#__PURE__*/React.createElement("input", {
    id: "songArtist",
    type: "text",
    name: "artist",
    placeholder: "Artist"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "rating"
  }, "Rating (1-5): "), /*#__PURE__*/React.createElement("input", {
    id: "songRating",
    type: "number",
    name: "rating",
    step: "1",
    min: "1",
    max: "5"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "genre"
  }, "Genre: "), /*#__PURE__*/React.createElement("select", {
    id: "songGenre",
    type: "dropdown",
    name: "genre"
  }, /*#__PURE__*/React.createElement("option", {
    value: "",
    hidden: true
  }, " -- Select One --"), /*#__PURE__*/React.createElement("option", {
    value: "Classical"
  }, "Classical"), /*#__PURE__*/React.createElement("option", {
    value: "Country"
  }, "Country"), /*#__PURE__*/React.createElement("option", {
    value: "Dance"
  }, "Dance"), /*#__PURE__*/React.createElement("option", {
    value: "Disco"
  }, "Disco"), /*#__PURE__*/React.createElement("option", {
    value: "EDM"
  }, "EDM"), /*#__PURE__*/React.createElement("option", {
    value: "Hip-hop"
  }, "Hip-hop"), /*#__PURE__*/React.createElement("option", {
    value: "Indie"
  }, "Indie"), /*#__PURE__*/React.createElement("option", {
    value: "Instrumental"
  }, "Instrumental"), /*#__PURE__*/React.createElement("option", {
    value: "Jazz"
  }, "Jazz"), /*#__PURE__*/React.createElement("option", {
    value: "Metal"
  }, "Metal"), /*#__PURE__*/React.createElement("option", {
    value: "Pop"
  }, "Pop"), /*#__PURE__*/React.createElement("option", {
    value: "Rap"
  }, "Rap"), /*#__PURE__*/React.createElement("option", {
    value: "Rhythm & Blues"
  }, "Rhythm & Blues"), /*#__PURE__*/React.createElement("option", {
    value: "Rock"
  }, "Rock"), /*#__PURE__*/React.createElement("option", {
    value: "Other"
  }, "Other")), /*#__PURE__*/React.createElement("label", {
    htmlFor: "favorite"
  }, "Favorite: "), /*#__PURE__*/React.createElement("select", {
    id: "songFavorite",
    type: "dropdown",
    name: "favorite"
  }, /*#__PURE__*/React.createElement("option", {
    value: "",
    hidden: true
  }, " -- Select One --"), /*#__PURE__*/React.createElement("option", {
    value: "favorite"
  }, "Favorite"), /*#__PURE__*/React.createElement("option", {
    value: "dontFavorite"
  }, "Don't Favorite")), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "makeSongSubmit",
    type: "submit",
    value: "Add Song!"
  }), /*#__PURE__*/React.createElement("input", {
    className: "resetSong",
    type: "reset",
    value: "Clear!"
  }), /*#__PURE__*/React.createElement("label", {
    className: "displayError"
  }, "Message: "));
};
/* Displays songs to the screen */

/* const SongList = function (props) {
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
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="songName"> Name: {song.name}</h3>
                <h3 className="songUserName">User: {song.user}</h3>
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
}; */
//grabs songs from the server and render a SongsList
//periodically update the screen with changes

/* const loadSongsFromServer = () => {
    sendAjax('GET', '/getSongs', null, (data) => {
        ReactDOM.render(
            <SongList songs={data.songs} />, document.querySelector("#songs")
        );
    });
}; */
//render out SongForm to the page and render default SongsList
//songs attribute of SongList is empty array - because we dont have 
//  data yet, but will at least get the HTML onto the page while waiting 
//  for server


var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(SongForm, {
    csrf: csrf
  }), document.querySelector("#makeSong"));
  /* ReactDOM.render(
      <SongList songs={[]} />, document.querySelector("#songs")
  );
    loadSongsFromServer(); */
}; //allow us to get CSRF token for new submissions


var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
}; //page load - getToken() to get new CSRF token and setup React components


$(document).ready(function () {
  getToken();
});
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#songMessage").animate({
    width: 'toggle'
  }, 350);
};

var redirect = function redirect(response) {
  $("#songMessage").animate({
    width: 'hide'
  }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
