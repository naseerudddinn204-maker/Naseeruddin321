const songs=[
 {title:"Midnight Vibes",artist:"GB Originals",emoji:"🌙"},
 {title:"Lost in the Beat",artist:"GB Originals",emoji:"🎧"},
 {title:"Golden Hour",artist:"GB Originals",emoji:"✨"},
 {title:"Mountain Dreams",artist:"GB Originals",emoji:"🏔️"}
];
let current=0,playing=false;
const audio=document.getElementById("audio");
const progress=document.getElementById("progress");
function render(){
 document.getElementById("trendingGrid").innerHTML=songs.map((s,i)=>`<article class="song-card" onclick="selectSong(${i})"><div class="cover">${s.emoji}</div><div class="song-title">${s.title}</div><div class="song-artist">${s.artist}</div><button class="play-small" onclick="event.stopPropagation();selectSong(${i})">▶</button></article>`).join("");
 document.getElementById("latestList").innerHTML=songs.map((s,i)=>`<div class="latest-item"><div class="latest-cover">${s.emoji}</div><div class="latest-meta"><strong>${s.title}</strong><span>${s.artist} · New release</span></div><button onclick="selectSong(${i})">▶</button></div>`).join("");
}
function selectSong(i){
 current=i;const s=songs[i];
 document.getElementById("playerTitle").textContent=s.title;
 document.getElementById("playerArtist").textContent=s.artist;
 document.getElementById("playerCover").textContent=s.emoji;
 playing=true;document.getElementById("playBtn").textContent="❚❚";
 showToast("Selected: "+s.title+" — add your MP3 URL in script.js to play audio.");
}
function togglePlay(){if(!document.getElementById("playerTitle").textContent||document.getElementById("playerTitle").textContent==="Select a song"){selectSong(0);return}playing=!playing;document.getElementById("playBtn").textContent=playing?"❚❚":"▶"}
function nextSong(){selectSong((current+1)%songs.length)}
function previousSong(){selectSong((current-1+songs.length)%songs.length)}
function scrollToSection(id){document.getElementById(id).scrollIntoView({behavior:"smooth"})}
function showToast(message){const t=document.getElementById("toast");t.textContent=message;t.classList.add("show");clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove("show"),3000)}
document.getElementById("year").textContent=new Date().getFullYear();
progress.addEventListener("input",()=>{if(audio.duration)audio.currentTime=(progress.value/100)*audio.duration});
audio.addEventListener("timeupdate",()=>{if(audio.duration){progress.value=(audio.currentTime/audio.duration)*100;document.getElementById("currentTime").textContent=formatTime(audio.currentTime);document.getElementById("duration").textContent=formatTime(audio.duration)}});
function formatTime(s){const m=Math.floor(s/60);const sec=Math.floor(s%60).toString().padStart(2,"0");return m+":"+sec}
render();