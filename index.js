const divPlaylist = document.querySelector(".playlist")
const template = document.querySelector(".playlist_template").innerHTML
const main = document.querySelector(".main")
const songCover = document.querySelector("#cover")
const songName = document.querySelector(".songName")
const songArtist = document.querySelector(".artist")
const spanCurrent = document.querySelector("#current")
const spanTotal = document.querySelector("#total")
const backwardBtn = document.querySelector("#backward")
const playBtn = document.querySelector("#play")
const pauseBtn = document.querySelector("#pause")
const forwardBtn = document.querySelector("#forward")
const trackbar = document.querySelector(".trackbar")
const trackbarOverlay = document.querySelector(".trackbarOverlay")
const leftDiv = document.querySelector(".left")
const rightDiv = document.querySelector(".right")
const pauseDiv = document.querySelector(".pauseDiv")
const playDiv = document.querySelector(".playDiv")

let track_frame = 0
let current_frame = 0
let TRACK_INTERVAL = null
let paused = false
let played = false


const CURRENT_SONG = {
    "song": "",
    "artist": "",
    "cover": "",
    "file": "",
    "current_time": 0,
    "total_time": 0,
    "id": 0,
    "audio": null
}

function secondsToMMSS(seconds){
    const mm = Math.floor(seconds / 60)
    const ss = Math.round(seconds % 60)
    return (mm < 10 ? "0" + mm : mm) + ":" + (ss < 10 ? "0" + ss : ss)
}

function trackbar_progress() {
    TRACK_INTERVAL = setInterval(() => {
        if(paused){
            // track_frame = 0
            // trackbarOverlay.style.width = current_frame + "px"
            // current_frame += track_frame
            if(TRACK_INTERVAL != null){
        clearInterval(TRACK_INTERVAL)
        TRACK_INTERVAL = null
    }
        }
        else{
            track_frame = (210 / CURRENT_SONG.total_time) 
            trackbarOverlay.style.width = current_frame + "px" 
            current_frame += track_frame
        }
        
    }, 1000)
}



function load_song(element){
    if(CURRENT_SONG.audio != null){
        CURRENT_SONG.audio.pause()
        CURRENT_SONG.audio = null
    }

    songCover.src = "./images/" + element.getAttribute("data-cover")
    songArtist.innerHTML = element.getAttribute("data-artist")
    songName.innerHTML = element.getAttribute("data-song")

    CURRENT_SONG.audio = new Audio("./songs/" + element.getAttribute("data-file"))
    CURRENT_SONG.file = element.getAttribute("data-file")
    CURRENT_SONG.artist = element.getAttribute("data-artist")
    CURRENT_SONG.cover = element.getAttribute("data-cover")
    CURRENT_SONG.song = element.getAttribute("data-song")
    CURRENT_SONG.id = element.getAttribute("data-id")

    if(TRACK_INTERVAL != null){
        clearInterval(TRACK_INTERVAL)
        TRACK_INTERVAL = null
    }
    
    time_update()
}

function load_song1(element){
    if(CURRENT_SONG.audio != null){
        CURRENT_SONG.audio.pause()
        CURRENT_SONG.audio = null
    }

    songCover.src = "./images/" + element.cover
    songArtist.innerHTML = element.artist
    songName.innerHTML = element.song
    CURRENT_SONG.audio = new Audio("./songs/" + element.file)
    CURRENT_SONG.file = element.file
    CURRENT_SONG.artist = element.artist
    CURRENT_SONG.cover = element.cover
    CURRENT_SONG.song = element.song
    CURRENT_SONG.id = element.id

    if(TRACK_INTERVAL != null){
        clearInterval(TRACK_INTERVAL)
        TRACK_INTERVAL = null
    }

    time_update()
    trackbar_progress()
}
let currentSong = CURRENT_SONG.id
function time_update() {
    CURRENT_SONG.audio.onloadedmetadata= () => {
        CURRENT_SONG.total_time = CURRENT_SONG.audio.duration
        spanTotal.innerHTML = secondsToMMSS(CURRENT_SONG.total_time)
        trackbarOverlay.style.width = 0
        trackbarOverlay.style.height = "20px"
        trackbarOverlay.style.backgroundColor = "rgba(255,0,0,0.2)"
        // track_frame = (CURRENT_SONG.total_time / 210) * (210 / (CURRENT_SONG.total_time / 210 * CURRENT_SONG.total_time))
        track_frame = 210 / CURRENT_SONG.total_time
        current_frame = 0
    }

    CURRENT_SONG.audio.ontimeupdate = () => {
        if(CURRENT_SONG.audio == null) return false;
            CURRENT_SONG.current_time = CURRENT_SONG.audio.currentTime
            spanCurrent.innerHTML = secondsToMMSS(CURRENT_SONG.current_time)
        const playlist = JSON.parse(xhr.responseText)
        if(CURRENT_SONG.audio.currentTime == CURRENT_SONG.audio.duration){
            let len = playlist.length
                currentSong = Number(currentSong) + 1
                if (currentSong == len) {
                    currentSong = 0;
                    load_song1(playlist[currentSong]);
                    CURRENT_SONG.audio.play()
                }
                else{
                    load_song1(playlist[currentSong]);
                    CURRENT_SONG.audio.play()
                }
                document.querySelector(`[data-id="${currentSong-1}"]`).classList.remove("active_song")
                document.querySelector(`[data-id="${currentSong}"]`).classList.add("active_song")
    }
    
}
}

const xhr = new XMLHttpRequest()

xhr.onload = () => {
    if(xhr.status == 200 && xhr.readyState == 4){
        const playlist = JSON.parse(xhr.responseText)
        for(let pesma of playlist){
            divPlaylist.innerHTML +=
                template.replace(/##cover##/g, pesma.cover)
                        .replace(/##song##/g, pesma.song)
                        .replace(/##artist##/g, pesma.artist)
                        .replace(/##file##/g, pesma.file)
                        .replace(/##id##/g, pesma.id)
        }
        pauseDiv.style.display = "none"
        const first_song = document.querySelector(".songOverlay")
        first_song.classList.add("active_song")
        load_song(first_song)
    }
}

xhr.open("GET", "./songs/songs.json")
xhr.send()


let count = 1
pauseBtn.onclick = () => {
        CURRENT_SONG.audio.pause()
        count++
        paused = true
        played = false
        playBtn.style.display = "inline-block"
        pauseBtn.style.display = "none"
        playDiv.style.display = "flex"
        pauseDiv.style.display = "none"
        // CURRENT_SONG.current_time = CURRENT_SONG.audio.currentTime 
    }

playBtn.onclick = () => {
    if(CURRENT_SONG.audio != null){
        CURRENT_SONG.audio.play()
        paused = false
        played = true
        // track_frame = (CURRENT_SONG.total_time / 210) * (210 / (CURRENT_SONG.total_time / 210 * CURRENT_SONG.total_time))
        trackbar_progress()
        playDiv.style.display = "none"
        pauseDiv.style.display = "flex"
        playBtn.style.display = "none"
        pauseBtn.style.display = "inline-block"
    }
}

document.body.onclick = (e) => {
    if(e.target.classList.contains("songOverlay")){
        document.querySelector(".active_song").classList.remove("active_song")
        load_song(e.target)
        CURRENT_SONG.audio.play()
        trackbar_progress()
        currentSong = e.target.getAttribute('data-id')
        e.target.classList.add("active_song")
        playBtn.style.display = "none"
        pauseBtn.style.display = "inline-block"
    }
}

trackbar.onclick = (e) => {
    if(!CURRENT_SONG.audio.paused){
        current_frame = e.x - trackbar.offsetLeft
        trackbarOverlay.style.width = current_frame + "px"
        CURRENT_SONG.audio.currentTime = (current_frame / 210) * CURRENT_SONG.audio.duration
    }
}

forwardBtn.onclick = () => {
    current_frame = current_frame + (10 * (CURRENT_SONG.total_time / 210) * (210 / (CURRENT_SONG.total_time / 210 * CURRENT_SONG.total_time)))
    trackbarOverlay.style.width = current_frame + "px"
    CURRENT_SONG.audio.currentTime = CURRENT_SONG.audio.currentTime + 10
}

backwardBtn.onclick = () => {
    current_frame = current_frame - (10 * (CURRENT_SONG.total_time / 210) * (210 / (CURRENT_SONG.total_time / 210 * CURRENT_SONG.total_time)))
    trackbarOverlay.style.width = current_frame + "px"
    CURRENT_SONG.audio.currentTime = CURRENT_SONG.audio.currentTime - 10
}

leftDiv.ondblclick = () => {
    current_frame = current_frame - (10 * (CURRENT_SONG.total_time / 210) * (210 / (CURRENT_SONG.total_time / 210 * CURRENT_SONG.total_time)))
    trackbarOverlay.style.width = current_frame + "px"
    CURRENT_SONG.audio.currentTime = CURRENT_SONG.audio.currentTime - 10
}

rightDiv.ondblclick = () => {
    current_frame = current_frame + (10 * (CURRENT_SONG.total_time / 210) * (210 / (CURRENT_SONG.total_time / 210 * CURRENT_SONG.total_time)))
    trackbarOverlay.style.width = current_frame + "px"
    CURRENT_SONG.audio.currentTime = CURRENT_SONG.audio.currentTime + 10
}

playDiv.onclick = () => {
    count++
        if(CURRENT_SONG.audio != null){
        CURRENT_SONG.audio.play()
        trackbar_progress()
        played = true
        paused = false
        playBtn.style.display = "none"
        playDiv.style.display = "none"
        pauseDiv.style.display = "flex"
        pauseBtn.style.display = "inline-block"
        console.log("pusti");
        }
}

pauseDiv.onclick = () => {
    CURRENT_SONG.audio.pause()
    paused = true
    played = false
    playDiv.style.display = "flex"
    pauseDiv.style.display = "none"
    playBtn.style.display = "inline-block"
    pauseBtn.style.display = "none"
    console.log("pauziraj");
}

