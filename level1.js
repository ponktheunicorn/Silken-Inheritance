document.addEventListener('DOMContentLoaded', () => {
  if (window.audioManager) audioManager.init();

  const btnSettings = document.getElementById('btnSettings');
  const btnClose = document.getElementById('btnClose');
  const btnBackMenu = document.getElementById('btnBackMenu');
  const btnRestart = document.getElementById('btnRestart');
  const btnInventory = document.getElementById('btnInventory');
  const modal = document.getElementById('settingsModal');
  const inventoryBar = document.getElementById('inventoryBar');
  const sfx = document.getElementById('sfx');

  const masterSlider = document.getElementById('masterVolume');
  const musicSlider = document.getElementById('musicVolume');
  const sfxSlider = document.getElementById('sfxVolume');

  let master = 1, musicVol = 1, sfxVol = 1;

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

  // Modal controls
  btnSettings?.addEventListener('click', () => {
    playClick();
    modal.style.display = 'block';
  });

  btnClose?.addEventListener('click', () => {
    playClick();
    modal.style.display = 'none';
  });

  btnRestart?.addEventListener('click', () => {
    playClick();
    location.reload();
  });

  btnBackMenu?.addEventListener('click', () => {
    playClick();
    window.location.href = 'menu.html';
  });

  window.addEventListener('click', e => {
    if (e.target === modal) modal.style.display = 'none';
  });

  // Inventory toggle
  let inventoryVisible = false;
  btnInventory?.addEventListener('click', () => {
    playClick();
    inventoryVisible = !inventoryVisible;
    inventoryBar.classList.toggle('show', inventoryVisible);
  });
});
