const songList = document.getElementById('song-list');
const max = 10;
const clearAll = document.getElementsByClassName('clear-all')[0];
clearAll.addEventListener('click',function(){
    clearPlaylist();
    this.style.display = 'none';
})

let songs;
if(localStorage.length === 0){
    songs = [];
}
else{
    songs = JSON.parse(localStorage.getItem('songs'));
}

window.addEventListener('load',init);

function init(){
    if(playlistLimit(songs,max)){
        disableInputs();
    }
    else{
        enableInputs();
    }
}

function displaySongs(songs) {

    songList.innerHTML = '';
    // if(!songs.length){
    
    // }
    sortByScore(songs);
    songs.forEach(function (song) {
        songList.innerHTML += `
        <tr>
            <td><i class="fab fa-itunes-note"></i></td>
            <td>${song.artist}</td>
            <td>${song.song}</td>
            <td>${song.score}</td>
            <td><button data-id = ${song.id} class='remove'><i class="fas fa-times"></i></button></td>
        </tr>          
        `;
    })
    if(!isPlaylistEmpty(songs)){
        clearAll.style.display = 'block';
    }
    // localStorage.setItem('songs',songs);
    displayCount(songCount(songs));
}

window.addEventListener('load', displaySongs(songs));

const submitForm = document.getElementById('song-input-form');
submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addSong();
    this.reset();
    displaySongs(songs);
});

function addSong() {
    const artist = document.getElementById('artist').value;
    const songTitle = document.getElementById('song-title').value;
    const score = document.getElementById('score').value;
    if(artist && songTitle && score){
        if(!artistLimit(songs,artist)){
            const newSong = {
                artist: artist,
                song: songTitle,
                score: score,
                id: new Date().getTime()
            }
            songs.push(newSong);
            localStorage.setItem('songs',JSON.stringify(songs));
            displayMessage('Song added successfully!','success');
            clearAll.style.display = 'block';
            displayCount(songCount(songs));

        }
        else{
            displayMessage('Artist name already exists!','failure');
        }
    }
    else{
        //prikazi poruku
        displayMessage('All fields must be filled out!','failure');
    }
    if(playlistLimit(songs,max)){
        disableInputs();
    }
}

songList.addEventListener('click', function (event) {
    //ikonica ne prepoznaje event(pointer-events: none), proledjuje ga dugmetu sa klasom remove
    //remove postaje event target
    if (event.target.classList.contains('remove')) {
        removeSong(event.target);
    }
});

function removeSong(target) {
    const id = Number(target.getAttribute('data-id'));
    songs = songs.filter(function (song) {
        return song.id !== id;
    })
    target.parentElement.parentElement.remove();
    localStorage.setItem('songs',JSON.stringify(songs));
    displayCount(songCount(songs));

    displayMessage('Song deleted successfully!','success');

    if(playlistLimit(songs,max)){
        disableInputs();
    }
    else{
        enableInputs();
    }
    if(isPlaylistEmpty(songs)){
        clearAll.style.display = 'none';
    }
}

const search = document.getElementById('search');

search.addEventListener('input', filterPlaylist);

function filterPlaylist(event){
   let query = event.target.value.toLowerCase();
   let trList = songList.querySelectorAll('TR');
   for(let i = 0; i < trList.length; i++){
       let tds = trList[i].querySelectorAll('TD');
       if(tds[1].innerText.toLowerCase().indexOf(query) !== -1 || tds[2].innerText.toLowerCase().indexOf(query) !== -1){
           //ostavi pesmu na spisku
            tds[2].parentElement.style.display = ''
       }
       else{
           //skloni pesmu
           tds[2].parentElement.style.display = 'none'
       }
   }
}

function sortByScore(songs){
    //sortiraj niz
    songs.sort(function(song1,song2){
        return song2.score - song1.score;
    })

    //prikazi sortirani niz
}

function artistLimit(songs,artist){
    for(let i = 0; i < songs.length; i++){
        if(songs[i].artist.indexOf(artist) !== -1){
            //ne moze
            return true;
        }
    }
    return false;
}

function playlistLimit(songs,max){
    if(songs.length >= max){
        return true;
    }
    else{
        return false;
    }
}

function disableInputs(){
    const inputs = submitForm.querySelectorAll('input');
        inputs.forEach(function(input){
        input.disabled = true;
    })
    const submitButton = submitForm.querySelector('button');
    submitButton.disabled = true;
}

function enableInputs(){
    const inputs = submitForm.querySelectorAll('input');
        inputs.forEach(function(input){
        input.disabled = false;
    })
    const submitButton = submitForm.querySelector('button');
    submitButton.disabled = false;
}

function displayMessage(text,style){
    const messageDiv = document.createElement('DIV');
    messageDiv.setAttribute('class',`message ${style}`);
    const p = document.createElement('P');
    if(style === 'success'){
        p.innerHTML = `<i class = "fas fa-check"></i>${text}`;
    }
    else if(style === 'failure'){
        p.innerHTML = `<i class = "fas fa-times"></i>${text}`;
    }
    messageDiv.appendChild(p);
    document.body.appendChild(messageDiv);
    setTimeout(function(){
        messageDiv.remove();
    },3000)
}

function clearPlaylist(target){
    songs = [];
    localStorage.setItem('songs',JSON.stringify(songs));
    displaySongs(songs);
    displayMessage('Playlist cleared successfully','success');
}

function isPlaylistEmpty(songs){
    return !songs.length;
}

function songCount(songs){
    return songs.length;
}

function displayCount(number){
    const p = document.getElementById('song-count');
    p.innerText = `Number of songs: ${number}`;
}
