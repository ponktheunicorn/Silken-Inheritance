document.addEventListener('DOMContentLoaded', () => {

  const audioFrame = document.getElementById('audioFrame');
  const audioManager = audioFrame?.contentWindow;

  const sfx = document.getElementById('sfx');
  const btnSettings = document.getElementById('btnSettings');
  const modal = document.getElementById('settingsModal');
  const btnClose = document.getElementById('btnClose');

  const masterSlider = document.getElementById('masterVolume');
  const musicSlider = document.getElementById('musicVolume');
  const sfxSlider = document.getElementById('sfxVolume');

  // 🟣 Nhạc nền chỉ được phát khi user click (do policy autoplay)
  document.addEventListener('click', () => {
    audioManager?.postMessage({ type: 'userClick' }, '*');
  }, { once: true });

  // 🟣 PLAY BUTTON
  const btnPlay = document.getElementById('btnPlay');
  btnPlay?.addEventListener('click', () => {
    window.location.href = 'menu.html';
  });

  // 🟣 SETTINGS MODAL
  btnSettings?.addEventListener('click', () => {
    modal.style.display = 'block';
  });

  btnClose?.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
  });

  // 🟣 SLIDER ĐIỀU KHIỂN ÂM LƯỢNG
  function updateVolume() {
    const master = parseFloat(masterSlider.value);
    const musicVol = parseFloat(musicSlider.value);
    const sfxVol = parseFloat(sfxSlider.value);

    const finalMusic = master * musicVol;
    const finalSfx = master * sfxVol;

    // Gửi giá trị volume cho iframe nhạc
    audioManager?.postMessage({ type: 'setVolume', value: finalMusic }, '*');

    // Áp dụng cho sfx cục bộ
    sfx.volume = finalSfx;
  }

  [masterSlider, musicSlider, sfxSlider].forEach(slider => {
    slider.addEventListener('input', updateVolume);
  });

  // 🟣 SFX CLICK
  document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', () => {
      sfx.currentTime = 0;
      sfx.play();
    });
  });
});
