document.addEventListener('DOMContentLoaded', () => {
  // Init audioManager
  if (window.audioManager) audioManager.init();

  // Buttons
  const btnBack = document.getElementById('btnBack');
  const btnSettings = document.getElementById('btnSettings');
  const btnClose = document.getElementById('btnClose');
  const btnContinue = document.getElementById('btnContinue');
  const btnRestart = document.getElementById('btnRestart');
  const sfx = new Audio('audio/sfx/click.wav');

  const masterSlider = document.getElementById('masterVolume');
  const musicSlider = document.getElementById('musicVolume');
  const sfxSlider = document.getElementById('sfxVolume');

  let master = 1, musicVol = 1, sfxVol = 1;

  // Level
  let currentLevel = 1;
  const totalLevels = 3;
  const levelImage = document.querySelector('.level-display img');
  const levelTitle = document.querySelector('.level-display h3');
  const levelPlay = document.querySelector('.level-play');

  function updateLevel() {
    if (levelImage) levelImage.src = `img/level${currentLevel}.png`;
    if (levelTitle) levelTitle.textContent = `Level ${currentLevel}`;
    if (levelPlay) levelPlay.href = `level${currentLevel}.html`;
  }

  // Safe addEventListener
  const prevBtn = document.getElementById('prevLevel');
  const nextBtn = document.getElementById('nextLevel');

  if (prevBtn) prevBtn.addEventListener('click', () => {
    currentLevel = currentLevel > 1 ? currentLevel - 1 : totalLevels;
    updateLevel(); playClick();
  });

  if (nextBtn) nextBtn.addEventListener('click', () => {
    currentLevel = currentLevel < totalLevels ? currentLevel + 1 : 1;
    updateLevel(); playClick();
  });

  function playClick() {
    sfx.currentTime = 0;
    sfx.volume = master * sfxVol;
    sfx.play();
  }

  function updateVolume() {
    if (window.audioManager) audioManager.setVolume(master * musicVol);
  }

  masterSlider?.addEventListener('input', () => {
    master = parseFloat(masterSlider.value);
    updateVolume();
  });
  musicSlider?.addEventListener('input', () => {
    musicVol = parseFloat(musicSlider.value);
    updateVolume();
  });
  sfxSlider?.addEventListener('input', () => {
    sfxVol = parseFloat(sfxSlider.value);
  });

  // Modal
  const modal = document.getElementById('settingsModal');
  btnSettings?.addEventListener('click', () => { playClick(); modal.style.display = 'block'; });
  btnClose?.addEventListener('click', () => { playClick(); modal.style.display = 'none'; });
  btnContinue?.addEventListener('click', () => { playClick(); modal.style.display = 'none'; });
  btnRestart?.addEventListener('click', () => { playClick(); location.reload(); });
  window.addEventListener('click', e => { if (e.target == modal) modal.style.display = 'none'; });

  btnBack?.addEventListener('click', () => { playClick(); window.location.href = 'index.html'; });

  if (levelPlay) {
    levelPlay.addEventListener('click', (e) => {
      e.preventDefault(); 
      playClick();

      if (currentLevel === 1) {
        window.location.href = 'cutscene1.html';
      } else {
        window.location.href = `level${currentLevel}.html`;
      }
    });
  }

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', playClick);
  });

  updateLevel();
});
