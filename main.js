const songlist = document.getElementById('song-list');

let songs = [
    { artist: 'Led Zeppelin', song: 'Good Times, Bad Times', score: 97,id: 1 },
    { artist: 'Deep Purple', song: 'Child in Time', score: 100,id: 2 },
    { artist: 'Eric Johnson', song: 'Cliffs of Dover', score: 95,id: 3 },

]

function displaySongs(songs) {
    
    songlist.innerHTML = '';
    songs.forEach(function (song) {
        songlist.innerHTML += `
        <tr>
            <td><i class="fab fa-itunes-note"></i></td>
            <td>${song.artist}</td>
            <td>${song.song}</td>
            <td>${song.score}</td>
            <td><button data-id = ${song.id} class='remove'><i class="fas fa-times"></i></button></td>
        </tr>          
        `;
    })
}

window.addEventListener('load', displaySongs(songs));

const submitForm = document.getElementById('song-input-form');
submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addSong();
    displaySongs(songs);
});

function addSong() {
    const artist = document.getElementById('artist').value;
    const songTitle = document.getElementById('song-title').value;
    const score = document.getElementById('score').value;
    const newSong = {
        artist: artist,
        song: songTitle,
        score: score,
        id: new Date().getTime()
    }
    songs.push(newSong);
}

songlist.addEventListener('click',function(event){
    if(event.target.classList.contains('remove')){
        removeSong(event.target);
    }
});

function removeSong(target){
    const id = Number(target.getAttribute('data-id'));
    songs = songs.filter(function(song){
        return song.id !== id;
    })
    console.log(songs);
    target.parentElement.parentElement.remove();
}