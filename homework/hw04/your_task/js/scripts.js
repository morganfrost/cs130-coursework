const baseURL = 'https://www.apitutor.org/spotify/simple/v1/search';

// Note: AudioPlayer is defined in audio-player.js
const audioFile = 'https://p.scdn.co/mp3-preview/bfead324ff26bdd67bb793114f7ad3a7b328a48e?cid=9697a3a271d24deea38f8b7fbfa0e13c';
const audioPlayer = AudioPlayer('.player', audioFile);

const search = (ev) => {
    document.querySelector("footer").style.display="none";
    const term = document.querySelector('#search').value;
    console.log('search for:', term);
    // issue three Spotify queries at once...
    getTracks(term);
    getAlbums(term);
    getArtist(term);
    if (ev) {
        ev.preventDefault();
    }
}

const getTracks = (term) => {
    // console.log(`
    //     get tracks from spotify based on the search term
    //     "${term}" and load them into the #tracks section 
    //     of the DOM...`);
        fetch(baseURL + "?type=track" + `&q=${term}`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                    if (data.length > 0) {
                        let firstFive = data.splice(0,5);
                        let html = firstFive.map(track2HTML);
                        // let footerHTML = firstFive.map(track2FooterHTML)
                        document.querySelector('#tracks').innerHTML = html;
                        // document.querySelector('#footer').innerHTML = footerHTML;
                    }
                    else {
                        let html = "<p>No tracks found that match your search criteria.<p>";
                        document.querySelector("#tracks").innerHTML = html;
                    }
            });
        };

const track2HTML = track => {
    return `
    <button class="track-item preview" data-preview-track="${track.preview_url}" onclick="handleTrackClick(event)";>
        <img src=${track.album.image_url} alt="${track.album.name} Album Cover">
        <i class="fas play-track fa-play" aria-hidden="true"></i>
        <div class="label">
            <h2>${track.album.name}</h2>
            <p>
                ${track.artist.name}
            </p>
        </div>
    </button>
    `
    ;
};

// const track2FooterHTML = track => {
//     return `
//     <div id="current-track" class="track-item" data-preview-track="${track.preview_url}">
//         <img src=${track.album.image_url} alt="${track.album.name} Album Cover">
//                 <i class="fas play-track fa-pause" aria-hidden="true"></i>
//                 <div class="label">
//                     <h2>${track.album.name}</h2>
//                     <p>
//                     ${track.artist.name}
//                     </p>
//                 </div>
//             </div>`;
// };

const getAlbums = (term) => {
    // console.log(`
    //     get albums from spotify based on the search term
    //     "${term}" and load them into the #albums section 
    //     of the DOM...`);
        fetch(baseURL + "?type=album" + `&q=${term}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.length > 0){
                    let albumList = data;
                    let html = albumList.map(album2HTML);
                    document.querySelector('#albums').innerHTML = html;
                    console.log(data)
                }
                else {
                    let html = "<p>No albums found that match your search criteria.<p>";
                    document.querySelector("#albums").innerHTML = html;
                }
            })
};

const album2HTML = (album) => {
    return `
    <section class="album-card" id=${album.id}>
        <div>
            <img src=${album.image_url} alt="${album.name} Album Cover">
            <h2>${album.name}</h2>
            <div class="footer">
                <a href=${album.spotify_url} target="_blank">
                    view on spotify
                </a>
            </div>
        </div>
    </section>
    `
}

let artistResults
const getArtist = (term) => {
    // console.log(`
    //     get artists from spotify based on the search term
    //     "${term}" and load the first artist into the #artist section 
    //     of the DOM...`);
        fetch(baseURL + "?type=artist" + `&q=${term}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.length > 0) {
                    let firstArtist = data[0];
                    let html = artistHTML(firstArtist)
                    document.querySelector('#artist').innerHTML = html;
                } else {
                    let html = "<p> No artists found that match your search criteria. </p>";
                    document.querySelector('#artist').innerHTML = html;
                }            
});
};

const artistHTML = (artist) => {
    return `
    <section id="artist">
    <section class="artist-card" id=${artist.id}>
        <div>
            <img src=${artist.image_url} alt="Photo of ${artist.name}">
            <h2>${artist.name}</h2>
            <div class="footer">
                <a href="${artist.spotify_url}" target="_blank">
                    view on spotify
                </a>
            </div>
        </div>
    </section>
    `;
};

const handleTrackClick = (ev) => {
    document.querySelector("footer").style.display="flex";
    console.log(ev.currentTarget);
    const previewUrl = ev.currentTarget.getAttribute('data-preview-track');
    if (previewUrl === "null") {
        console.log("This track is unavailable on Spotify.")
    }
    else {
    console.log("previewUrl=", previewUrl);
    console.log(document.querySelector('#current-track').innerHTML);
    console.log(ev.currentTarget.dataset);
    audioPlayer.setAudioFile(previewUrl);
    audioPlayer.play();
}}

document.querySelector('#search').onkeyup = (ev) => {
    // Number 13 is the "Enter" key on the keyboard
    console.log(ev.keyCode);
    if (ev.keyCode === 13) {
        ev.preventDefault();
        search();
    }
};