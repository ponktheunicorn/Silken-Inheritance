// Hamburger toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
  navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
});

// Buttons
const startBtn = document.getElementById('startBtn');
const saveBtn = document.getElementById('saveBtn');
const bgAudio = document.getElementById('bgAudio');

startBtn.addEventListener('click', () => {
  window.location.href = "level.html"; // đổi link đến web khác
});

// Save game demo
saveBtn.addEventListener('click', () => {
  const gameState = { level: 1, inventory: [] };
  localStorage.setItem('gameSave', JSON.stringify(gameState));
  alert("Game Saved!");
});

// Audio controls
const muteCheckbox = document.getElementById('muteCheckbox');
const volumeRange = document.getElementById('volumeRange');

// Bật nhạc ngay khi load
bgAudio.volume = volumeRange.value;
bgAudio.play();

// Mute/unmute
muteCheckbox.addEventListener('change', () => {
  bgAudio.muted = muteCheckbox.checked;
});

// Chỉnh âm lượng
volumeRange.addEventListener('input', () => {
  bgAudio.volume = volumeRange.value;
});
