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

  // --- MODALS ---
  const settingsModal = document.getElementById('settingsModal');
  const pillowModal = document.getElementById('pillowModal');
  const deskModal = document.getElementById('deskModal');
  const cabModal = document.getElementById('cabModal');

  // --- SLIDERS ---
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

  // --- SETTINGS MODAL ---
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
    window.location.href = 'menu.html';
  });

  // --- CLOSE MODAL ON OUTSIDE CLICK ---
  window.addEventListener('click', e => {
    if (e.target === settingsModal) settingsModal.style.display = 'none';
    if (e.target === pillowModal) pillowModal.style.display = 'none';
    if (e.target === deskModal) deskModal.style.display = 'none';
    if (e.target === cabModal) cabModal.style.display = 'none';
  });

  // --- INVENTORY TOGGLE ---
  let inventoryVisible = false;
  btnInventory?.addEventListener('click', () => {
    playClick();
    inventoryVisible = !inventoryVisible;
    inventoryBar.classList.toggle('show', inventoryVisible);
  });

  // =================== MULTI ROOM ===================
  const rooms = {
    bedroom: document.getElementById('bedroom'),
    kitchen: document.getElementById('kitchen'),
  };

  function switchRoom(roomName) {
    if (!rooms[roomName]) return;
    Object.values(rooms).forEach(r => {
      r.classList.remove('active');
      r.style.opacity = 0;
    });
    const targetRoom = rooms[roomName];
    targetRoom.classList.add('active');
    setTimeout(() => {
      targetRoom.style.opacity = 1;
    }, 50);

    document.body.style.backgroundImage =
      roomName === 'kitchen'
        ? 'url("img/kitchenbgr.png")'
        : 'url("img/bedbgr.png")';
  }

  // --- DOOR ---
  const door = document.getElementById('door');
  let doorChanged = false;
  door?.addEventListener('click', () => {
    playClick();
    if (!doorChanged) {
      door.src = 'img/door2.png';
      doorChanged = true;
    }
    switchRoom('kitchen');
  });

  // --- LADDER ---
  const ladder = document.getElementById('ladder');
  ladder?.addEventListener('click', () => {
    playClick();
    switchRoom('bedroom');
  });

  // =================== TOOLTIP ===================
  const tooltip = document.getElementById('tooltip');
  const tooltipItems = [
    { selector: '.cup', text: 'The shining trophy – the symbol of victory.' },
    { selector: '.cert', text: 'Certificate of merit for art and drawing awards.' },
    { selector: '.book', text: 'Some favorite comic books.' },
    { selector: '.bed', text: 'My favorite corner at home where I can be myself.' }
  ];

  tooltipItems.forEach(item => {
    const el = document.querySelector(item.selector);
    if (el) {
      el.addEventListener('mouseenter', () => {
        tooltip.textContent = item.text;
        tooltip.style.display = 'block';
      });
      el.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
      });
    }
  });

  // =================== MODALS ===================
  document.querySelector('.pillow')?.addEventListener('click', () => {
    playClick();
    pillowModal.style.display = 'flex';
  });
  document.querySelector('.desk')?.addEventListener('click', () => {
    playClick();
    deskModal.style.display = 'flex';
  });
  document.querySelector('.cab')?.addEventListener('click', () => {
    playClick();
    cabModal.style.display = 'flex';
  });

  // =================== INVENTORY ===================
  const inventorySlots = document.querySelectorAll('.inventory-slot');
  let inventoryCount = 0;

  // Collectibles từ DOM
  const collectibles = document.querySelectorAll('.collectible');
  collectibles.forEach(item => {
    item.addEventListener('click', () => {
      if (inventoryCount >= inventorySlots.length) return;
      playClick();

      const clone = document.createElement('img');
      clone.src = item.src;
      clone.style.width = '100%';
      clone.style.height = '100%';
      clone.style.objectFit = 'contain';
      clone.className = item.className;
      clone.style.position = 'absolute';
      clone.style.top = '0';
      clone.style.left = '0';

      inventorySlots[inventoryCount].style.position = 'relative';
      inventorySlots[inventoryCount].appendChild(clone);
      inventoryCount++;

      item.style.display = 'none';
    });
  });

  // =================== USE INVENTORY ITEM ===================
  let selectedInventoryItem = null;
  inventorySlots.forEach(slot => {
    slot.addEventListener('click', () => {
      if (slot.children.length === 0) return;
      selectedInventoryItem = slot.children[0];
      playClick();
    });
  });

  // --- SAFE ---
  const safe = document.querySelector('.safe');
  safe?.addEventListener('click', () => {
    if (!selectedInventoryItem) return;
    if (selectedInventoryItem.classList.contains('key') || selectedInventoryItem.src.includes('key')) {
      safe.style.display = 'none';
      selectedInventoryItem.style.display = 'none';
      selectedInventoryItem = null;
      playClick();
    }
  });

  // =================== FRUIT PUZZLE ===================
  const dish1 = document.querySelector('.dish1');
  const fruitOrder = ['soursop', 'fig', 'coconut', 'papaya', 'mango'];
  let fruitIndex = 0;

  dish1?.addEventListener('click', () => {
    if (!selectedInventoryItem) return;

    const fruitName = fruitOrder[fruitIndex];
    if (selectedInventoryItem.classList.contains(fruitName)) {
      // đúng thứ tự
      selectedInventoryItem.style.display = 'none';
      selectedInventoryItem = null;
      fruitIndex++;
      playClick();

      if (fruitIndex === fruitOrder.length) {
        const img = document.createElement('img');
        img.src = 'img/fruit.png';
        img.className = 'room-object';
        img.style.position = 'absolute';

        // <-- TÙY CHỈNH VỊ TRÍ -->
        const finalFruitLeft = 920; // px, vị trí trái
        const finalFruitTop = 340;  // px, vị trí top
        img.style.left = finalFruitLeft + 'px';
        img.style.top = finalFruitTop + 'px';

        const finalFruitWidth = 150;  // px, 
        const finalFruitHeight = 130; // px
        img.style.width = finalFruitWidth + 'px';
        img.style.height = finalFruitHeight + 'px';

        img.style.zIndex = 5;
        img.style.transition = 'transform 0.2s ease';
  
        // Hover scale effect
        img.addEventListener('mouseenter', () => {
        img.style.transform = 'scale(1.05)';
        });
        img.addEventListener('mouseleave', () => {
        img.style.transform = 'scale(1)';
        });
        dish1.parentNode.appendChild(img);

        img.addEventListener('click', () => {
        window.location.href = 'level2.html';
        });
      }
    } else {
      // sai thứ tự → reset
      fruitIndex = 0;
      fruitOrder.forEach(name => {
        const f = document.querySelector(`.${name}`);
        if (f) f.style.display = 'block';
      });
      playClick();
    }
  });
});
