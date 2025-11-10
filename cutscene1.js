document.addEventListener('DOMContentLoaded', () => {
  const video = document.getElementById('cutsceneVideo');
  const playButton = document.getElementById('playButton');
  const skipButton = document.getElementById('skipButton');
  const overlay = document.getElementById('overlay');
  const sfx = document.getElementById('sfx');

  // Bạn có thể điều chỉnh volume mặc định cho SFX ở đây
  let masterVolume = 1; // chỉnh nếu sau này có slider
  let sfxVolume = 1;
  sfx.volume = masterVolume * sfxVolume;

  function goToLevel1() {
    window.location.href = 'level1.html';
  }

  // helper: play sfx safely (đảm bảo không lỗi nếu file chưa load)
  function playSfx() {
    try {
      sfx.currentTime = 0;
      sfx.volume = masterVolume * sfxVolume;
      sfx.play().catch(err => {
        // nếu bị block (ít khả năng vì do click), log và ignore
        console.warn('SFX play blocked or error:', err);
      });
    } catch (e) {
      console.warn('SFX play error', e);
    }
  }

  // Khi người xem nhấn Play
  playButton.addEventListener('click', () => {
    // play click SFX ngay khi người click (cho cảm giác tương tác)
    playSfx();

    // ẩn nút Play, hiện video
    playButton.style.display = 'none';
    video.style.display = 'block';

    // tắt overlay dần khi video bắt đầu phát
    // bật mute=false để có tiếng (hành động do người dùng cho phép)
    video.muted = false;
    video.play().then(() => {
      // fade overlay out
      overlay.style.opacity = '0';
      setTimeout(() => {
        overlay.style.display = 'none';
      }, 1000); // khớp với transition trong CSS
    }).catch(err => {
      console.warn('Video play blocked:', err);
      // nếu video không phát, bạn vẫn có thể tiếp tục (hoặc show lỗi)
    });
  });

  // Khi video kết thúc → sang level1.html
  video.addEventListener('ended', goToLevel1);

  // Khi người dùng nhấn Skip
  skipButton.addEventListener('click', () => {
    playSfx(); // SFX khi skip
    goToLevel1();
  });

  // Optional: bấm phím Space hoặc Enter cũng có thể kích hoạt nút Play
  document.addEventListener('keydown', (e) => {
    if ((e.code === 'Space' || e.code === 'Enter') && playButton.style.display !== 'none') {
      e.preventDefault();
      playButton.click();
    }
  });
});
