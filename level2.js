document.addEventListener('DOMContentLoaded', () => {
  // ================= AUDIO MANAGER =================
  if (window.audioManager) audioManager.init();
  const sfx = document.getElementById('sfx');

  function playClick() {
    if (!sfx) return;
    sfx.currentTime = 0;
    sfx.play();
  }

  // ================= DOM ELEMENTS =================
  const btnSettings = document.getElementById('btnSettings');
  const btnClose = document.getElementById('btnClose');
  const btnBackMenu = document.getElementById('btnBackMenu');
  const btnRestart = document.getElementById('btnRestart');
  const btnInventory = document.getElementById('btnInventory');
  const inventoryBar = document.getElementById('inventoryBar');
  const settingsModal = document.getElementById('settingsModal');

  // ================= SETTINGS MODAL =================
  btnSettings?.addEventListener('click', () => { playClick(); settingsModal.style.display = 'block'; });
  btnClose?.addEventListener('click', () => { playClick(); settingsModal.style.display = 'none'; });
  btnRestart?.addEventListener('click', () => { playClick(); location.reload(); });
  btnBackMenu?.addEventListener('click', () => { playClick(); window.location.href = 'menu.html'; });

  window.addEventListener('click', e => { if (e.target === settingsModal) settingsModal.style.display = 'none'; });

  // ================= INVENTORY =================
  const inventorySlots = document.querySelectorAll('.inventory-slot');
  let inventoryVisible = false;

  btnInventory?.addEventListener('click', () => {
    playClick();
    inventoryVisible = !inventoryVisible;
    inventoryBar.classList.toggle('show', inventoryVisible);
  });

  function addToInventory(src, className) {
    const emptySlot = Array.from(inventorySlots).find(slot => slot.children.length === 0);
    if (!emptySlot) return null;
    const img = document.createElement('img');
    img.src = src;
    img.className = className;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'contain';
    img.style.cursor = 'pointer';
    emptySlot.appendChild(img);
    playClick();

    img.addEventListener('click', () => {
      if (img.classList.contains('selected')) {
        img.classList.remove('selected');
      } else {
        inventorySlots.forEach(s => s.children[0]?.classList.remove('selected'));
        img.classList.add('selected');
      }
    });

    return img;
  }

  function findInInventory(cls) {
    for (const slot of inventorySlots) {
      if (slot.children.length > 0 && slot.children[0].classList.contains(cls)) {
        return slot.children[0];
      }
    }
    return null;
  }

  let selectedInventoryItem = null;
  inventorySlots.forEach(slot => {
    slot.addEventListener('click', () => {
      if (slot.children.length === 0) return;
      if (slot.children[0] === selectedInventoryItem) {
        slot.children[0].classList.remove('selected');
        selectedInventoryItem = null;
      } else {
        inventorySlots.forEach(s => s.children[0]?.classList.remove('selected'));
        slot.children[0].classList.add('selected');
        selectedInventoryItem = slot.children[0];
      }
    });
  });

  // ================= WALL MODALS =================
  const walls = document.querySelectorAll('.wall');
  const wallModals = {
    wall1: document.getElementById('wall1Modal'),
    wall2: document.getElementById('wall2Modal'),
    wall3: document.getElementById('wall3Modal')
  };

  walls.forEach(wall => {
    wall.addEventListener('mouseenter', () => { wall.style.transform = 'scale(1.05)'; });
    wall.addEventListener('mouseleave', () => { wall.style.transform = 'scale(1)'; });

    wall.addEventListener('click', () => {
      playClick();
      const id = wall.classList.contains('wall1') ? 'wall1' :
                 wall.classList.contains('wall2') ? 'wall2' :
                 wall.classList.contains('wall3') ? 'wall3' : null;
      if (id && wallModals[id]) wallModals[id].style.display = 'flex';
    });
  });

  window.addEventListener('click', e => {
    Object.values(wallModals).forEach(modal => { if (e.target === modal) modal.style.display = 'none'; });
    if (e.target === settingsModal) settingsModal.style.display = 'none';
  });

  // ================= INTERACTIONS =================

  const girl = document.querySelector('.girl');
  const bubble = document.querySelector('.bubble1');
  if (girl && bubble) {
    bubble.style.display = 'none';
    girl.addEventListener('mouseenter', () => { bubble.style.display = 'block'; });
    girl.addEventListener('mouseleave', () => { bubble.style.display = 'none'; });
  }

  // Tree -> fan
  const tree = document.querySelector('.tree');
  let treeClickCount = 0;
  if (tree) {
    tree.addEventListener('click', () => {
      treeClickCount++;
      if (treeClickCount === 3) {
        playClick();
        addToInventory('img/fan.png', 'fan');
        treeClickCount = 0;
      }
    });
  }

  // Wood1 -> stove -> wood
  const wood1 = document.querySelector('.wood1');
  const stove = document.querySelector('.oldsto');
  const wall2Content = document.querySelector('.wall2-content');

  if (wood1) {
    wood1.addEventListener('click', () => {
      addToInventory(wood1.src, 'wood1');
      wood1.style.display = 'none';
    });
  }

  if (stove && wall2Content) {
    wall2Content.addEventListener('click', e => {
      if (!selectedInventoryItem) return;

      // wood1 -> wood
      if (selectedInventoryItem.classList.contains('wood1') && e.target.classList.contains('oldsto')) {
        playClick();
        selectedInventoryItem.src = 'img/wood.png';
        selectedInventoryItem.classList.remove('wood1');
        selectedInventoryItem.classList.add('wood');
        selectedInventoryItem.classList.remove('selected');
        selectedInventoryItem = null;
      }

      // fan + wood -> fire
      const fan = findInInventory('fan');
      const wood = findInInventory('wood');
      if (fan && wood && e.target.classList.contains('oldsto')) {
        playClick();
        const fire = document.createElement('img');
        fire.src = 'img/fire.png';
        fire.className = 'room-object fire';
        fire.style.position = 'absolute';
        fire.style.top = '150px';
        fire.style.right = '180px';
        fire.style.width = '80px';
        wall2Content.appendChild(fire);

        fan.parentNode.removeChild(fan);
        wood.parentNode.removeChild(wood);
      }
    });
  }

  // Glass + kettle -> glass2
  const glass = document.querySelector('.glass');
  const kettle = document.querySelector('.kettle');

  if (glass) {
    glass.addEventListener('click', () => {
      addToInventory(glass.src, 'glass2');
      glass.style.display = 'none';
    });
  }

  if (kettle) {
    kettle.addEventListener('click', () => {
      if (!selectedInventoryItem) return;
      if (selectedInventoryItem.classList.contains('glass2')) {
        playClick();
        selectedInventoryItem.src = 'img/glass2.png';
        selectedInventoryItem.classList.remove('glass2');
        selectedInventoryItem.classList.add('glass2');
        selectedInventoryItem.classList.remove('selected');
        selectedInventoryItem = null;
      }
    });
  }

  // Khi click girl
if (girl) {
  girl.addEventListener('click', () => {
    const glass2 = findInInventory('glass2');
    if (glass2) {
      // glass2 -> jade2
      playClick();
      glass2.parentNode.removeChild(glass2);
      const jade2 = addToInventory('img/jade2.png', 'jade2');

      // thêm click handler cho jade2 để đi level3
      if (jade2) {
        jade2.addEventListener('click', () => {
          playClick();
          window.location.href = 'level3.html';
        });
      }
    }
  });
}


});
