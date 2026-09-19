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
const YOUTUBE_API_KEY="YOUR_YOUTUBE_DATA_API_KEY";
let ytPlayer=null;
let ytReady=false;
window.onYouTubeIframeAPIReady=()=>{ytReady=true};
const ytTag=document.createElement("script");ytTag.src="https://www.youtube.com/iframe_api";document.head.appendChild(ytTag);

async function searchYouTube(){
 const q=document.getElementById("ytQuery").value.trim(), box=document.getElementById("ytResults");
 if(!q){showToast("Type a song name first.");return}
 if(YOUTUBE_API_KEY==="YOUR_YOUTUBE_DATA_API_KEY"){box.innerHTML='<div class="yt-empty">Add your YouTube Data API key in script.js first.</div>';return}
 box.innerHTML='<div class="yt-empty">Searching YouTube...</div>';
 try{
  const u=new URL("https://www.googleapis.com/youtube/v3/search");
  u.search=new URLSearchParams({part:"snippet",q,type:"video",maxResults:"8",videoEmbeddable:"true",key:YOUTUBE_API_KEY});
  const r=await fetch(u),d=await r.json(); if(!r.ok)throw Error(d.error?.message||"API error");
  box.innerHTML=d.items.map(v=>{const id=v.id.videoId,t=v.snippet.title.replace(/"/g,"&quot;"),c=v.snippet.channelTitle.replace(/"/g,"&quot;"),im=v.snippet.thumbnails.medium.url;return '<button class="yt-card" onclick="playYouTube(\''+id+'\')"><img src="'+im+'"><span><strong>'+t+'</strong><small>'+c+'</small></span><b>▶</b></button>'}).join("");
 }catch(e){box.innerHTML='<div class="yt-empty">'+e.message+'</div>'}
}
function playYouTube(id){
 document.getElementById("ytPlayerWrap").classList.add("visible");
 if(ytReady){if(ytPlayer)ytPlayer.loadVideoById(id);else ytPlayer=new YT.Player("ytPlayer",{width:"100%",height:"100%",videoId:id,playerVars:{playsinline:1,rel:0}})}
 else document.getElementById("ytPlayer").innerHTML='<iframe width="100%" height="100%" src="https://www.youtube.com/embed/'+id+'?autoplay=1&playsinline=1" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
}
