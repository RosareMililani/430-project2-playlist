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

  sendAjax('POST', $("#songForm").attr("action"), $("#songForm").serialize(), function () {
    loadSongsFromServer();
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

var ProfileForm = function ProfileForm(props) {
  var profileInfo = props.songs.map(function (song) {
    //console.dir(song)
    return /*#__PURE__*/React.createElement("div", {
      key: song._id,
      className: "accounts"
    }, /*#__PURE__*/React.createElement("img", {
      src: "/assets/img/profile-notes.png",
      alt: "domo face",
      className: "domoFaceProfile"
    }), /*#__PURE__*/React.createElement("h3", {
      className: "profileName"
    }, " Name: ", song.user), /*#__PURE__*/React.createElement("h3", {
      className: "profileUsername"
    }, " Username: ", song.personName), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "content"
  }, profileInfo);
};
/* Displays songs to the screen */


var SongList = function SongList(props) {
  //no songs added to the data
  if (props.songs.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "songList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptySong"
    }, "No Songs Avaliable"));
  } //if there is data, display onto screen


  var songNodes = props.songs.map(function (song) {
    console.dir(song);
    var today = new Date(song.createdDate);
    var formattedDate = today.toLocaleDateString('en-gb', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'utc'
    });
    return /*#__PURE__*/React.createElement("div", {
      key: song._id,
      className: "song"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "songName"
    }, " Name: ", song.name), /*#__PURE__*/React.createElement("h3", {
      className: "songArtist"
    }, " Artist: ", song.artist), /*#__PURE__*/React.createElement("h3", {
      className: "songRating"
    }, " Rating: ", song.rating, "/5"), /*#__PURE__*/React.createElement("h3", {
      className: "songGenre"
    }, " Genre: ", song.genre), /*#__PURE__*/React.createElement("h3", {
      className: "songDate"
    }, " Date Added: ", formattedDate));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "songList"
  }, songNodes);
}; //grabs songs from the server and render a SongsList
//periodically update the screen with changes


var loadSongsFromServer = function loadSongsFromServer() {
  sendAjax('GET', '/getSongs', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(SongList, {
      songs: data.songs
    }), document.querySelector("#songs"));
  });
};

var createCreateWindow = function createCreateWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(SongForm, {
    csrf: csrf
  }), document.querySelector("#makeSong"));
  /* ReactDOM.render(
      <SongList songs={[]} />, document.querySelector("#songs")
  ); */
};
/* const createProfileWindow = (csrf) => {
    ReactDOM.render(
        <ProfileForm csrf={csrf} />, document.querySelector("#content")
    );

    ReactDOM.render(
        <SongList songs={[]} />, document.querySelector("#songs")
    );
} */

/* const createSettingWindow = (csrf) => {
    ReactDOM.render(
        <SettingsForm csrf={csrf} />, document.querySelector("#songs")
    );
}; */
//render out SongForm to the page and render default SongsList
//songs attribute of SongList is empty array - because we dont have 
//  data yet, but will at least get the HTML onto the page while waiting 
//  for server


var setup = function setup(csrf) {
  /* const createButton = document.querySelector("#createButton");
  const createProfileButton = document.querySelector("#myPageButton");
  //const settingButton = document.querySelector("#settingsButton");
    createButton.addEventListener("click", (e) => {
      e.preventDefault();
      createCreateWindow(csrf);
      return false;
  });
    createProfileButton.addEventListener("click", (e) => {
      e.preventDefault();
      createProfileWindow(csrf);
      return false;
  }); */

  /* settingButton.addEventListener("click", (e) => {
      e.preventDefault();
      createSettingWindow(csrf);
      return false;
  }); */
  ReactDOM.render( /*#__PURE__*/React.createElement(SongForm, {
    csrf: csrf
  }), document.querySelector("#makeSong"));
  ReactDOM.render( /*#__PURE__*/React.createElement(SongList, {
    songs: []
  }), document.querySelector("#songs"));
  loadSongsFromServer();
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
