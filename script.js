const songs=[
 {title:"Achiye Yaar",artist:"Kashif Din · Shina Song",emoji:"🎵",audio:"Achiye_Yaar____New_Shina_Song____Kashif_Din(128k).mp3"},
 {title:"Shina Song",artist:"GB Shina Music",emoji:"🏔️",audio:"AUD-20240306-WA0050.mp3"}
];
let current=0,playing=false;
const audio=document.getElementById("audio");
const progress=document.getElementById("progress");

function render(){
 document.getElementById("trendingGrid").innerHTML=songs.map((s,i)=>`<article class="song-card" onclick="selectSong(${i})"><div class="cover">${s.emoji}</div><div class="song-title">${s.title}</div><div class="song-artist">${s.artist}</div><button class="play-small" onclick="event.stopPropagation();selectSong(${i})">▶</button></article>`).join("");
 document.getElementById("latestList").innerHTML=songs.map((s,i)=>`<div class="latest-item"><div class="latest-cover">${s.emoji}</div><div class="latest-meta"><strong>${s.title}</strong><span>${s.artist} · New release</span></div><button onclick="selectSong(${i})">▶</button></div>`).join("");
}

async function selectSong(i){
 current=i;
 const s=songs[i];
 document.getElementById("playerTitle").textContent=s.title;
 document.getElementById("playerArtist").textContent=s.artist;
 document.getElementById("playerCover").textContent=s.emoji;
 audio.pause();
 audio.src=encodeURI(s.audio);
 audio.currentTime=0;
 progress.value=0;
 document.getElementById("currentTime").textContent="0:00";
 document.getElementById("duration").textContent="0:00";
 try{
   await audio.play();
   playing=true;
   document.getElementById("playBtn").textContent="❚❚";
 }catch(error){
   playing=false;
   document.getElementById("playBtn").textContent="▶";
   showToast("MP3 could not be played: "+s.title);
 }
}

async function togglePlay(){
 if(!audio.src){ await selectSong(0); return; }
 if(audio.paused){
   try{ await audio.play(); playing=true; document.getElementById("playBtn").textContent="❚❚"; }
   catch(error){ showToast("Could not play this MP3."); }
 }else{
   audio.pause();
   playing=false;
   document.getElementById("playBtn").textContent="▶";
 }
}

function handleLocalUploads(files){
 const mp3Files=Array.from(files).filter(file=>file.type==="audio/mpeg" || file.name.toLowerCase().endsWith(".mp3"));
 if(!mp3Files.length){showToast("Please select MP3 files.");return;}
 if(mp3Files.length>10){showToast("Please select up to 10 MP3 files.");return;}
 mp3Files.forEach((file,index)=>{
   if(songs[index]){
     songs[index].audio=URL.createObjectURL(file);
     const base=file.name.replace(/\.mp3$/i,"").replace(/[-_]+/g," ").trim();
     songs[index].title=base||songs[index].title;
     songs[index].artist="Uploaded Shina Song";
   }
 });
 render();
 showToast(mp3Files.length+" MP3 file(s) loaded in this browser.");
}

function nextSong(){selectSong((current+1)%songs.length)}
function previousSong(){selectSong((current-1+songs.length)%songs.length)}
function scrollToSection(id){document.getElementById(id).scrollIntoView({behavior:"smooth"})}
function showToast(message){const t=document.getElementById("toast");t.textContent=message;t.classList.add("show");clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove("show"),3000)}
document.getElementById("year").textContent=new Date().getFullYear();
progress.addEventListener("input",()=>{if(audio.duration)audio.currentTime=(progress.value/100)*audio.duration});
audio.addEventListener("timeupdate",()=>{if(audio.duration){progress.value=(audio.currentTime/audio.duration)*100;document.getElementById("currentTime").textContent=formatTime(audio.currentTime);document.getElementById("duration").textContent=formatTime(audio.duration)}});
audio.addEventListener("ended",()=>{nextSong()});
audio.addEventListener("error",()=>{if(songs[current] && audio.src && !audio.src.startsWith("blob:")) showToast("Audio file missing: "+songs[current].title)});
function formatTime(s){const m=Math.floor(s/60);const sec=Math.floor(s%60).toString().padStart(2,"0");return m+":"+sec}
render();