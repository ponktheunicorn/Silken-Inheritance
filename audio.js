window.audioManager = (function() {
  const music = new Audio('audio/music/bgr.mp3');
  music.loop = true;
  music.volume = 1;

  // Play khi user click lần đầu (autoplay policy)
  function init() {
    document.addEventListener('click', playOnce, { once: true });
  }

  function playOnce() {
    music.play().catch(err => console.warn("Autoplay blocked:", err));
  }

  function setVolume(vol) {
    music.volume = vol;
  }

  function pause() { music.pause(); }
  function resume() { music.play(); }

  return { init, setVolume, pause, resume, music };
})();
