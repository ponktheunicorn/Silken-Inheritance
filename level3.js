document.addEventListener('DOMContentLoaded', () => {
  // --- AUDIO MANAGER INIT ---
  if (window.audioManager) audioManager.init();

  // --- DOM ELEMENTS ---
  const btnSettings = document.getElementById('btnSettings');
  const btnClose = document.getElementById('btnClose');
  const btnBackMenu = document.getElementById('btnBackMenu');
  const btnRestart = document.getElementById('btnRestart');
  const btnInventory = document.getElementById('btnInventory');
  const inventoryBar = document.getElementById('inventoryBar');
  const sfx = document.getElementById('sfx');

  // --- SETTINGS MODAL ---
  const settingsModal = document.getElementById('settingsModal');

  // --- VOLUME SLIDERS ---
  const masterSlider = document.getElementById('masterVolume');
  const musicSlider = document.getElementById('musicVolume');
  const sfxSlider = document.getElementById('sfxVolume');

  let master = 1, musicVol = 1, sfxVol = 1;

  function playClick() {
    if (!sfx) return;
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

  // --- SETTINGS BUTTONS ---
  btnSettings?.addEventListener('click', () => {
    playClick();
    settingsModal.style.display = 'block';
  });
  btnClose?.addEventListener('click', () => {
    playClick();
    settingsModal.style.display = 'none';
  });
  btnRestart?.addEventListener('click', () => {
    playClick();
    location.reload();
  });
  btnBackMenu?.addEventListener('click', () => {
    playClick();
    window.location.href='menu.html';
  });

  window.addEventListener('click', e => {
    if (e.target === settingsModal) settingsModal.style.display='none';
  });

  // --- INVENTORY TOGGLE ---
  let inventoryVisible = false;
  btnInventory?.addEventListener('click', () => {
    playClick();
    inventoryVisible = !inventoryVisible;
    inventoryBar.classList.toggle('show', inventoryVisible);
  });

  const inventorySlots = document.querySelectorAll('.inventory-slot');

  function addToInventory(src, itemName){
    const empty = Array.from(inventorySlots).find(slot => slot.children.length === 0);
    if (!empty) return;
    const img = document.createElement('img');
    img.src = src;
    img.dataset.item = itemName;
    img.style.width='100%';
    img.style.height='100%';
    img.style.objectFit='contain';
    empty.appendChild(img);
    playClick();
    img.addEventListener('click', () => {
      inventorySlots.forEach(s => s.children[0]?.classList.remove('selected'));
      img.classList.toggle('selected');
    });
  }

  function hasItem(itemName){
    return Array.from(inventorySlots).some(slot => {
      const img = slot.querySelector('img');
      return img && img.dataset.item === itemName;
    });
  }

  function removeItem(itemName){
    const slot = Array.from(inventorySlots).find(slot => {
      const img = slot.querySelector('img');
      return img && img.dataset.item === itemName;
    });
    if(slot) slot.innerHTML = '';
  }

  // --- OBJECTS ---
  const windowEl = document.querySelector('.window');
  const coinEl = document.querySelector('.coin');
  const sellerEl = document.querySelector('.seller');
  const feed1 = document.querySelector('.feed1');
  const feed2 = document.querySelector('.feed2');
  const girl2 = document.querySelector('.girl2');
  const bubble2 = document.querySelector('.bubble2');
  const bubble3 = document.querySelector('.bubble3');

  // Ẩn lúc đầu
  coinEl.style.opacity = '0';
  coinEl.style.pointerEvents = 'none';
  bubble2.style.opacity = '0';
  bubble3.style.opacity = '0';

  // Hover bubbles
  girl2.addEventListener('mouseenter', ()=> bubble2.style.opacity = '1');
  girl2.addEventListener('mouseleave', ()=> bubble2.style.opacity = '0');
  sellerEl.addEventListener('mouseenter', ()=> bubble3.style.opacity = '1');
  sellerEl.addEventListener('mouseleave', ()=> bubble3.style.opacity = '0');

  // Window click → show coin
  windowEl.addEventListener('click', () => {
    windowEl.style.transition = 'opacity 0.3s ease';
    windowEl.style.opacity = '0';
    setTimeout(() => windowEl.style.display='none', 300);
    coinEl.style.opacity = '1';
    coinEl.style.pointerEvents = 'auto';
    playClick();
  });

  // Coin click → inventory
  coinEl.addEventListener('click', () => {
    addToInventory('img/coin.png', 'coin');
    coinEl.style.display = 'none';
  });

  // Seller click → get worn
  sellerEl.addEventListener('click', () => {
    if(hasItem('coin') && !hasItem('worn')){
      removeItem('coin');
      addToInventory('img/worm.png','worn');
      playClick();
    }
  });

  // Feed click → get silk
  [feed1, feed2].forEach(feed => {
    feed.addEventListener('click', () => {
      if(hasItem('worn') && !hasItem('silk')){
        removeItem('worn');
        addToInventory('img/silk.png','silk');
        playClick();
      }
    });
  });

  // Girl2 click → get jade3
  girl2.addEventListener('click', () => {
    if(hasItem('silk')){
      removeItem('silk');
      addToInventory('img/jade3.png','jade3');
      playClick();
    }
  });

  // Inventory click → ending
  inventoryBar.addEventListener('click', e => {
    if(e.target.dataset.item === 'jade3'){
      playClick();
      window.location.href = 'cutscene2.html';
    }
  });

  // --- MAP NAVIGATION ---
  const maps = Array.from(document.querySelectorAll('.map-section'));
  let currentMap = 0;
  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');

  function showMap(index){
    maps.forEach((m,i)=> m.classList.toggle('active', i===index));
    currentMap = index;
  }

  btnPrev?.addEventListener('click', ()=>{ if(currentMap>0){ showMap(currentMap-1); playClick(); } });
  btnNext?.addEventListener('click', ()=>{ if(currentMap<maps.length-1){ showMap(currentMap+1); playClick(); } });
  showMap(0);

});
