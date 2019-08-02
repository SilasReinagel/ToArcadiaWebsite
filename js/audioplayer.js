function Song(artist, name, album, img, sources) {
  this.artist = artist;
  this.name = name;
  this.album = album;
  this.img = img;
  this.sources = sources;
}

function AudioPlayer(songs) {
  this.elements = {
      audio: document.getElementById("audio-player"),
      songImg: document.getElementById("song-img"),
      artist: document.getElementById("artist"),
      name: document.getElementById("song-name"),
      album: document.getElementById("album"),
      playPause: document.getElementById("play-pause-button"),
      previous: document.getElementById("previous-button"),
      next: document.getElementById("next-button"),
      progressLabel: document.getElementById("song-progress-label"),
      volumeImg: document.getElementById("volume-img"),
      volumeControl: document.getElementById("volume-control"),
      progress: document.getElementById("song-progress"),
      loop: document.getElementById("loop-button"),
      playlist: document.getElementById("playlist"),
      playlistItems: songs.map((song, index) => {
          const element = document.createElement("li");
          element.innerText = song.name;
          element.onclick = () => this.changeSong(index);
          return element;
      }),
      audioSources: []
  };
  this.songIndex = -1;
  this.isPlaying = false;
  this.isSeeking = false;
  this.isLooping = false;

  this.elements.audio.ondurationchange = () => {
      this.elements.progress.max = Math.round(this.elements.audio.duration);
      this.updateCurrentTime();
  };
  this.elements.audio.onplay = () => {
      this.elements.playPause.src = "/images/icons/pause.svg";
      this.isPlaying = true;
  };
  this.elements.audio.onpause = () => {
      this.elements.playPause.src = "/images/icons/play.svg";
      if (!this.isSeeking)
          this.isPlaying = false;
  };
  this.elements.audio.ontimeupdate = () => this.updateCurrentTime();
  this.elements.audio.onended = () => {
      if (this.songIndex !== songs.length - 1)
          this.changeSong(this.songIndex + 1);
      else if (this.isLooping)
          this.changeSong(0);
  };
  this.elements.playPause.onclick = () => {
      if (this.elements.audio.paused)
          this.elements.audio.play();
      else
          this.elements.audio.pause();
  };
  this.elements.previous.onclick = () => {
      if (this.songIndex !== 0)
          this.changeSong(this.songIndex - 1);
      else if (this.isLooping)
          this.changeSong(songs.length - 1);
  };
  this.elements.next.onclick = () => {
      if (this.songIndex !== songs.length - 1)
          this.changeSong(this.songIndex + 1);
      else if (this.isLooping)
          this.changeSong(0);
  };
  this.elements.volumeControl.oninput = () => this.changeVolume(this.elements.volumeControl.value);
  this.elements.volumeControl.onchange = () => this.changeVolume(this.elements.volumeControl.value);
  this.elements.progress.oninput = () => {
      this.isSeeking = true;
      this.elements.audio.pause();
      this.updateProgressLabel(this.elements.progress.value);
  };
  this.elements.progress.onchange = () => {
      this.isSeeking = false;
      this.elements.audio.currentTime = this.elements.progress.value;
      this.updateCurrentTime();
      if (this.isPlaying)
          this.elements.audio.play();
  };
  this.elements.loop.onclick = () => this.isLooping = !this.isLooping;

  this.changeSong = (songIndex) => {
      this.elements.audio.stop();
      this.selectSong(songIndex);
      this.elements.audio.play();
  };

  this.selectSong = (songIndex) => {
      if (songIndex === this.songIndex)
          return;
      this.elements.songImg.src = songs[songIndex].img;
      this.replaceText(this.elements.artist, songs[songIndex].artist);
      this.replaceText(this.elements.name, songs[songIndex].name);
      this.replaceText(this.elements.album, songs[songIndex].album);
      this.setNewSources(songs[songIndex].sources);
      this.songIndex = songIndex;
      this.elements.audio.load();
  };

  this.replaceText = (element, text) => {
      const child = element.firstChild;
      while(child) {
          if (child.nodeType === 3)
              element.removeChild(child);
          child = child.nextSibling;
      }
      element.appendChild(document.createTextNode(text));
  };

  this.setNewSources = (sources) => {
      for (const element of this.elements.audioSources)
          this.elements.audio.removeChild(element);
      const sourceElements = sources.map(source => {
          const element = document.createElement("source");
          element.src = source;
          element.type = this.getAudioType(source);
          return element;
      });
      this.elements.audioSources = sourceElements;
      for (const element of sourceElements)
          this.elements.audio.appendChild(element);
  };

  this.getAudioType = (source) => {
      const extension = source.split('.').pop();
      if (extension === "wav")
          return "audio/wav";
      if (extension === "ogg")
          return "audio/ogg";
      return "audio/mpeg";
  };

  const formatSeconds = (seconds) => Math.round(seconds % 60).toString().padStart(2, '0');
  const formatTime = (timeInSeconds) => `${Math.floor(timeInSeconds / 60)}:${formatSeconds(timeInSeconds)}`;
  this.updateProgressLabel = (currentTime) => this.elements.progressLabel.innerText = `${formatTime(currentTime)} / ${formatTime(this.elements.audio.duration)}`;

  this.updateCurrentTime = () => {
      const currentTime = this.elements.audio.currentTime;
      this.elements.progress.value = Math.round(currentTime);
      this.updateProgressLabel(currentTime);
  };

  this.changeVolume = (volume) => {
      if (volume === 0)
          this.elements.volumeImg.src = "/images/icons/volume_off.svg";
      else if (volume <= 30)
          this.elements.volumeImg.src = "/images/icons/volume_mute.svg";
      else if (volume <= 60)
          this.elements.volumeImg.src = "/images/icons/volume_down.svg";
      else
          this.elements.volumeImg.src = "/images/icons/volume_up.svg";
      this.elements.audio.volume = volume / 100;
  };

  //Init
  for (const element of this.elements.playlistItems)
      this.elements.playlist.appendChild(element);
  this.selectSong(0);
  this.changeVolume(80);
  
  document.getElementById('audio').classList.remove('hidden');
}
