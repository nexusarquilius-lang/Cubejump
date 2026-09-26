(() => {
  'use strict';

  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];

  const screens = {
    home: $('#home'), levels: $('#levels'), game: $('#game'), editor: $('#editor')
  };

  const STORAGE = {
    progress: 'cubejump.progress.v1',
    editor: 'cubejump.editor.v1'
  };

  const WORLD_H = 540;
  const GROUND_Y = 460;
  const PLAYER_SIZE = 40;
  const SPEED = 320;
  const GRAVITY = 1800;
  const JUMP_V = -690;

  const themes = [
    ['#0e1630','#223f76','#5ee6ff'],
    ['#18112e','#4f2c78','#d89bff'],
    ['#071f26','#195d63','#70ffd1'],
    ['#27110f','#7b3f1d','#ffbd66'],
    ['#151515','#3a4050','#ff6b8b'],
    ['#0d1330','#314194','#ffe66d']
  ];

  function level(length, blocks, spikes, platforms, crystals) {
    return { length, blocks, spikes, platforms, crystals };
  }

  // Original Cubejump V1 layouts. Built-in levels always contain exactly 3 crystals.
  const levels = [
    level(2700,
      [{x:720,y:400,w:70,h:60},{x:1320,y:370,w:80,h:90},{x:2070,y:390,w:80,h:70}],
      [{x:470,y:430,w:42,h:30},{x:940,y:430,w:42,h:30},{x:1110,y:430,w:42,h:30},{x:1640,y:430,w:42,h:30},{x:1840,y:430,w:42,h:30},{x:2310,y:430,w:42,h:30}],
      [{x:1480,y:360,w:180,h:22}],
      [{x:610,y:360},{x:1550,y:305},{x:2200,y:330}]),
    level(3000,
      [{x:650,y:390,w:75,h:70},{x:1270,y:350,w:90,h:110},{x:1960,y:380,w:85,h:80},{x:2450,y:365,w:90,h:95}],
      [{x:430,y:430,w:42,h:30},{x:820,y:430,w:42,h:30},{x:1010,y:430,w:42,h:30},{x:1470,y:430,w:42,h:30},{x:1710,y:430,w:42,h:30},{x:2160,y:430,w:42,h:30},{x:2680,y:430,w:42,h:30}],
      [{x:1070,y:335,w:155,h:22},{x:2190,y:330,w:150,h:22}],
      [{x:760,y:330},{x:1140,y:285},{x:2270,y:280}]),
    level(3250,
      [{x:600,y:380,w:80,h:80},{x:920,y:340,w:90,h:120},{x:1540,y:390,w:70,h:70},{x:2280,y:350,w:90,h:110},{x:2750,y:380,w:80,h:80}],
      [{x:410,y:430,w:42,h:30},{x:750,y:430,w:42,h:30},{x:1120,y:430,w:42,h:30},{x:1360,y:430,w:42,h:30},{x:1740,y:430,w:42,h:30},{x:1930,y:430,w:42,h:30},{x:2480,y:430,w:42,h:30},{x:2970,y:430,w:42,h:30}],
      [{x:1210,y:335,w:130,h:22},{x:1770,y:320,w:180,h:22},{x:2440,y:300,w:160,h:22}],
      [{x:970,y:285},{x:1840,y:270},{x:2520,y:250}]),
    level(3450,
      [{x:720,y:370,w:85,h:90},{x:1190,y:325,w:100,h:135},{x:1810,y:380,w:80,h:80},{x:2540,y:345,w:100,h:115},{x:3040,y:375,w:85,h:85}],
      [{x:430,y:430,w:42,h:30},{x:930,y:430,w:42,h:30},{x:1010,y:430,w:42,h:30},{x:1450,y:430,w:42,h:30},{x:1630,y:430,w:42,h:30},{x:2050,y:430,w:42,h:30},{x:2270,y:430,w:42,h:30},{x:2770,y:430,w:42,h:30},{x:3270,y:430,w:42,h:30}],
      [{x:870,y:315,w:150,h:22},{x:1500,y:305,w:160,h:22},{x:2130,y:290,w:155,h:22},{x:2710,y:300,w:140,h:22}],
      [{x:940,y:265},{x:2195,y:240},{x:2780,y:250}]),
    level(3650,
      [{x:560,y:380,w:80,h:80},{x:960,y:330,w:95,h:130},{x:1460,y:365,w:90,h:95},{x:2110,y:320,w:110,h:140},{x:2760,y:360,w:90,h:100},{x:3240,y:340,w:95,h:120}],
      [{x:390,y:430,w:42,h:30},{x:720,y:430,w:42,h:30},{x:1140,y:430,w:42,h:30},{x:1250,y:430,w:42,h:30},{x:1660,y:430,w:42,h:30},{x:1840,y:430,w:42,h:30},{x:2350,y:430,w:42,h:30},{x:2490,y:430,w:42,h:30},{x:2940,y:430,w:42,h:30},{x:3440,y:430,w:42,h:30}],
      [{x:720,y:310,w:150,h:22},{x:1280,y:285,w:155,h:22},{x:1730,y:300,w:160,h:22},{x:2320,y:265,w:165,h:22},{x:2940,y:290,w:150,h:22}],
      [{x:795,y:260},{x:2395,y:215},{x:3010,y:240}]),
    level(3950,
      [{x:620,y:365,w:90,h:95},{x:1100,y:315,w:110,h:145},{x:1630,y:355,w:100,h:105},{x:2240,y:300,w:115,h:160},{x:2880,y:350,w:100,h:110},{x:3440,y:325,w:105,h:135}],
      [{x:400,y:430,w:42,h:30},{x:800,y:430,w:42,h:30},{x:910,y:430,w:42,h:30},{x:1340,y:430,w:42,h:30},{x:1450,y:430,w:42,h:30},{x:1870,y:430,w:42,h:30},{x:2020,y:430,w:42,h:30},{x:2510,y:430,w:42,h:30},{x:2660,y:430,w:42,h:30},{x:3110,y:430,w:42,h:30},{x:3650,y:430,w:42,h:30}],
      [{x:780,y:300,w:150,h:22},{x:1380,y:270,w:160,h:22},{x:1840,y:285,w:165,h:22},{x:2470,y:250,w:170,h:22},{x:3070,y:275,w:150,h:22},{x:3590,y:265,w:145,h:22}],
      [{x:850,y:250},{x:2550,y:200},{x:3660,y:215}])
  ];

  function emptyProgress(){ return { completed:[false,false,false,false,false,false], crystals:[0,0,0,0,0,0] }; }
  function loadJSON(key, fallback){
    try { const v = JSON.parse(localStorage.getItem(key)); return v ?? fallback; } catch { return fallback; }
  }
  let progress = loadJSON(STORAGE.progress, emptyProgress());
  if (!Array.isArray(progress.completed) || progress.completed.length !== 6) progress = emptyProgress();

  function saveProgress(){ localStorage.setItem(STORAGE.progress, JSON.stringify(progress)); }

  function showScreen(name){
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[name].classList.add('active');
    $('#resultOverlay').classList.add('hidden');
    if (name === 'levels') renderLevelGrid();
    if (name !== 'game') stopGame();
    if (name === 'editor') drawEditor();
  }

  function renderLevelGrid(){
    const grid = $('#levelGrid'); grid.innerHTML='';
    levels.forEach((_, i) => {
      const done = progress.completed[i];
      const c = Math.max(0, Math.min(3, progress.crystals[i] || 0));
      const card = document.createElement('div'); card.className='level-card';
      card.innerHTML = `<div><div class="progress-badge">${done ? 'COMPLETADO' : 'PENDIENTE'}</div><strong>Nivel ${i+1}</strong><div class="level-meta">◆ ${c}/3 cristales</div></div><button class="primary play-level" data-level="${i}">Jugar</button>`;
      grid.appendChild(card);
    });
    $$('.play-level').forEach(b => b.addEventListener('click', () => startLevel(Number(b.dataset.level))));
  }

  $('#playBtn').addEventListener('click', () => showScreen('levels'));
  $('#editorBtn').addEventListener('click', () => showScreen('editor'));
  $$('[data-back]').forEach(b => b.addEventListener('click', () => showScreen(b.dataset.back)));
  $('#gameBackBtn').addEventListener('click', () => showScreen(gameState.isCustom ? 'editor' : 'levels'));
  $('#editorBackBtn').addEventListener('click', () => showScreen('home'));

  const canvas = $('#gameCanvas');
  const ctx = canvas.getContext('2d');
  const gameState = {
    running:false, raf:0, last:0, levelIndex:0, isCustom:false, data:null,
    player:{x:140,y:GROUND_Y-PLAYER_SIZE,vx:SPEED,vy:0,onGround:true},
    cameraX:0, collected:new Set(), dead:false, won:false
  };

  function resetPlayer(){
    gameState.player = {x:140,y:GROUND_Y-PLAYER_SIZE,vx:SPEED,vy:0,onGround:true};
    gameState.cameraX = 0; gameState.collected = new Set(); gameState.dead=false; gameState.won=false;
    $('#tapHint').style.opacity='1';
    updateCrystalHud();
  }

  function startLevel(index){
    gameState.levelIndex=index; gameState.isCustom=false; gameState.data=levels[index];
    $('#levelTitle').textContent=`Nivel ${index+1}`;
    showScreen('game'); resetPlayer(); beginGame();
  }

  function startCustomLevel(){
    const custom = editorToLevel();
    if (custom.crystals.length > 3) custom.crystals = custom.crystals.slice(0,3);
    gameState.levelIndex=-1; gameState.isCustom=true; gameState.data=custom;
    $('#levelTitle').textContent='Nivel creado';
    showScreen('game'); resetPlayer(); beginGame();
  }

  function beginGame(){
    gameState.running=true; gameState.last=performance.now();
    cancelAnimationFrame(gameState.raf);
    gameState.raf=requestAnimationFrame(loop);
  }
  function stopGame(){ gameState.running=false; cancelAnimationFrame(gameState.raf); }

  function jump(){
    if (!gameState.running || gameState.dead || gameState.won) return;
    const p=gameState.player;
    if (p.onGround) { p.vy=JUMP_V; p.onGround=false; $('#tapHint').style.opacity='0'; }
  }
  canvas.addEventListener('pointerdown', (e) => { e.preventDefault(); jump(); });
  $('#jumpBtn').addEventListener('pointerdown', (e) => { e.preventDefault(); jump(); });
  window.addEventListener('keydown', e => { if (e.code==='Space' || e.code==='ArrowUp') { e.preventDefault(); jump(); } });

  function intersects(a,b){ return a.x < b.x+b.w && a.x+a.w > b.x && a.y < b.y+b.h && a.y+a.h > b.y; }

  function die(){
    if (gameState.dead || gameState.won) return;
    gameState.dead=true;
    setTimeout(() => { if (screens.game.classList.contains('active')) { resetPlayer(); gameState.dead=false; } }, 430);
  }

  function win(){
    if (gameState.won) return;
    gameState.won=true;
    if (!gameState.isCustom) {
      const idx=gameState.levelIndex;
      progress.completed[idx]=true;
      progress.crystals[idx]=Math.max(progress.crystals[idx]||0, gameState.collected.size);
      saveProgress();
    }
    $('#resultTitle').textContent = gameState.isCustom ? 'Prueba completada' : 'Nivel completado';
    $('#resultText').textContent = `Cristales: ${gameState.collected.size}/${gameState.data.crystals.length}`;
    $('#nextBtn').textContent = gameState.isCustom ? 'Volver al editor' : (gameState.levelIndex===5 ? 'Niveles' : 'Siguiente');
    $('#resultOverlay').classList.remove('hidden');
  }

  $('#retryBtn').addEventListener('click', () => { $('#resultOverlay').classList.add('hidden'); resetPlayer(); beginGame(); });
  $('#nextBtn').addEventListener('click', () => {
    if (gameState.isCustom) return showScreen('editor');
    if (gameState.levelIndex===5) return showScreen('levels');
    startLevel(gameState.levelIndex+1);
  });

  function updateCrystalHud(){ $('#crystalHud').textContent=`◆ ${gameState.collected.size}/${gameState.data ? gameState.data.crystals.length : 3}`; }

  function loop(now){
    if (!gameState.running) return;
    let dt=Math.min(.025,(now-gameState.last)/1000); gameState.last=now;
    update(dt); draw();
    gameState.raf=requestAnimationFrame(loop);
  }

  function update(dt){
    if (gameState.dead || gameState.won) return;
    const data=gameState.data, p=gameState.player;
    const prevBottom = p.y + PLAYER_SIZE;
    p.vy += GRAVITY*dt;
    p.x += SPEED*dt;
    p.y += p.vy*dt;
    p.onGround=false;

    // Ground
    if (p.y + PLAYER_SIZE >= GROUND_Y) { p.y=GROUND_Y-PLAYER_SIZE; p.vy=0; p.onGround=true; }

    const solids = [...data.blocks, ...data.platforms];
    for (const s of solids) {
      const r={x:s.x,y:s.y,w:s.w,h:s.h};
      if (!intersects({x:p.x,y:p.y,w:PLAYER_SIZE,h:PLAYER_SIZE}, r)) continue;
      const descending = p.vy >= 0;
      if (descending && prevBottom <= r.y + 10) {
        p.y=r.y-PLAYER_SIZE; p.vy=0; p.onGround=true;
      } else if (s.h > 30) { die(); return; }
    }

    for (const sp of data.spikes) {
      // Slightly forgiving hitbox for touch play.
      const hit={x:sp.x+8,y:sp.y+7,w:Math.max(10,sp.w-16),h:Math.max(12,sp.h-7)};
      if (intersects({x:p.x+5,y:p.y+5,w:PLAYER_SIZE-10,h:PLAYER_SIZE-8},hit)) { die(); return; }
    }

    data.crystals.forEach((c,i) => {
      if (gameState.collected.has(i)) return;
      const r={x:c.x-16,y:c.y-16,w:32,h:32};
      if (intersects({x:p.x,y:p.y,w:PLAYER_SIZE,h:PLAYER_SIZE},r)) { gameState.collected.add(i); updateCrystalHud(); }
    });

    if (p.y > WORLD_H+100) { die(); return; }
    if (p.x >= data.length-80) { win(); return; }
    gameState.cameraX = Math.max(0, Math.min(data.length-960, p.x-220));
  }

  function draw(){
    const data=gameState.data; if (!data) return;
    const th = gameState.isCustom ? themes[0] : themes[gameState.levelIndex % themes.length];
    const grad=ctx.createLinearGradient(0,0,0,540); grad.addColorStop(0,th[0]); grad.addColorStop(1,th[1]);
    ctx.fillStyle=grad; ctx.fillRect(0,0,960,540);

    const cam=gameState.cameraX;
    // parallax decoration
    ctx.globalAlpha=.16; ctx.fillStyle=th[2];
    for(let i=0;i<14;i++){ const x=((i*220 - cam*.25)%1200+1200)%1200-80; const y=90+(i%4)*70; ctx.fillRect(x,y,70,8); }
    ctx.globalAlpha=1;

    ctx.fillStyle='#0a0e18'; ctx.fillRect(0,GROUND_Y,960,80);
    ctx.fillStyle='rgba(255,255,255,.08)'; ctx.fillRect(0,GROUND_Y,960,4);

    data.blocks.forEach(b => drawBlock(b,cam,th[2]));
    data.platforms.forEach(b => drawPlatform(b,cam,th[2]));
    data.spikes.forEach(s => drawSpike(s,cam));
    data.crystals.forEach((c,i) => { if(!gameState.collected.has(i)) drawCrystal(c,cam); });

    // Finish portal
    const fx=data.length-85-cam;
    ctx.strokeStyle=th[2]; ctx.lineWidth=8; ctx.beginPath(); ctx.arc(fx,GROUND_Y-65,36,0,Math.PI*2); ctx.stroke();
    ctx.globalAlpha=.3; ctx.fillStyle=th[2]; ctx.beginPath(); ctx.arc(fx,GROUND_Y-65,28,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1;

    const p=gameState.player;
    ctx.save(); ctx.translate(p.x-cam+PLAYER_SIZE/2,p.y+PLAYER_SIZE/2); ctx.rotate((p.x/55)% (Math.PI*2));
    ctx.fillStyle=th[2]; ctx.fillRect(-20,-20,40,40); ctx.fillStyle='#09101e'; ctx.fillRect(-11,-8,7,7); ctx.fillRect(5,-8,7,7); ctx.restore();

    if (gameState.dead){ ctx.fillStyle='rgba(255,93,115,.18)'; ctx.fillRect(0,0,960,540); }
  }

  function drawBlock(b,cam,color){ const x=b.x-cam; ctx.fillStyle='rgba(8,12,24,.86)'; ctx.fillRect(x,b.y,b.w,b.h); ctx.strokeStyle=color; ctx.lineWidth=3; ctx.strokeRect(x,b.y,b.w,b.h); }
  function drawPlatform(b,cam,color){ const x=b.x-cam; ctx.fillStyle=color; ctx.globalAlpha=.85; ctx.fillRect(x,b.y,b.w,b.h); ctx.globalAlpha=1; }
  function drawSpike(s,cam){ const x=s.x-cam; ctx.fillStyle='#ff5d73'; ctx.beginPath(); ctx.moveTo(x,s.y+s.h); ctx.lineTo(x+s.w/2,s.y); ctx.lineTo(x+s.w,s.y+s.h); ctx.closePath(); ctx.fill(); }
  function drawCrystal(c,cam){ const x=c.x-cam,y=c.y; ctx.save(); ctx.translate(x,y); ctx.rotate(Math.PI/4); ctx.fillStyle='#ffe66d'; ctx.fillRect(-11,-11,22,22); ctx.restore(); }

  // ----- Editor -----
  const eCanvas=$('#editorCanvas'), ectx=eCanvas.getContext('2d');
  const GRID=40;
  let editor={ tool:'block', cameraX:0, objects:[], history:[] };
  const savedEditor=loadJSON(STORAGE.editor,null);
  if (savedEditor && Array.isArray(savedEditor.objects)) editor.objects=savedEditor.objects;

  function snapshot(){ editor.history.push(JSON.stringify(editor.objects)); if(editor.history.length>40) editor.history.shift(); }
  function editorMessage(msg){ $('#editorMessage').textContent=msg; }

  $$('.tool').forEach(btn => btn.addEventListener('click', () => {
    $$('.tool').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); editor.tool=btn.dataset.tool; editorMessage(`Herramienta: ${btn.textContent}`);
  }));
  $('#panLeftBtn').addEventListener('click',()=>{ editor.cameraX=Math.max(0,editor.cameraX-320); drawEditor(); });
  $('#panRightBtn').addEventListener('click',()=>{ editor.cameraX=Math.min(3200,editor.cameraX+320); drawEditor(); });
  $('#undoBtn').addEventListener('click',()=>{ if(editor.history.length){ editor.objects=JSON.parse(editor.history.pop()); drawEditor(); editorMessage('Última acción deshecha.'); } else editorMessage('No hay nada que deshacer.'); });
  $('#saveBtn').addEventListener('click',()=>{ localStorage.setItem(STORAGE.editor,JSON.stringify({objects:editor.objects})); toast('Nivel guardado en este dispositivo'); editorMessage('Guardado.'); });
  $('#testBtn').addEventListener('click',()=>{ localStorage.setItem(STORAGE.editor,JSON.stringify({objects:editor.objects})); startCustomLevel(); });
  $('#editorHelpBtn').addEventListener('click',()=>toast('Elige una herramienta y toca la cuadrícula. Mover ◀/▶ desplaza el mapa.'));

  eCanvas.addEventListener('pointerdown', e => {
    e.preventDefault();
    const r=eCanvas.getBoundingClientRect();
    const sx=(e.clientX-r.left)/r.width*960;
    const sy=(e.clientY-r.top)/r.height*540;
    const wx=Math.round((sx+editor.cameraX)/GRID)*GRID;
    const wy=Math.round(sy/GRID)*GRID;
    if (wy >= GROUND_Y) return editorMessage('Coloca objetos por encima del suelo.');
    snapshot();
    if (editor.tool==='erase') {
      const before=editor.objects.length;
      editor.objects=editor.objects.filter(o => !(Math.abs(o.x-wx)<GRID*.65 && Math.abs(o.y-wy)<GRID*.65));
      if (before===editor.objects.length) editor.history.pop();
    } else if (editor.tool==='crystal') {
      const count=editor.objects.filter(o=>o.type==='crystal').length;
      if(count>=3){ editor.history.pop(); return editorMessage('Máximo 3 cristales en el nivel creado.'); }
      editor.objects.push({type:'crystal',x:wx,y:Math.max(60,wy)});
    } else {
      const h=editor.tool==='platform'?20:(editor.tool==='spike'?30:40);
      const w=editor.tool==='platform'?120:(editor.tool==='spike'?40:40);
      const y=editor.tool==='spike'?Math.min(GROUND_Y-30,wy):Math.min(GROUND_Y-h,wy);
      editor.objects.push({type:editor.tool,x:wx,y,w,h});
    }
    drawEditor();
  });

  function editorToLevel(){
    const blocks=[],spikes=[],platforms=[],crystals=[];
    for(const o of editor.objects){
      if(o.type==='block') blocks.push({...o});
      else if(o.type==='spike') spikes.push({...o});
      else if(o.type==='platform') platforms.push({...o});
      else if(o.type==='crystal') crystals.push({x:o.x,y:o.y});
    }
    const maxX=Math.max(1900, ...editor.objects.map(o=>o.x||0));
    return {length:maxX+700,blocks,spikes,platforms,crystals};
  }

  function drawEditor(){
    const cam=editor.cameraX;
    ectx.fillStyle='#10182d'; ectx.fillRect(0,0,960,540);
    ectx.strokeStyle='rgba(255,255,255,.08)'; ectx.lineWidth=1;
    for(let x=-(cam%GRID);x<960;x+=GRID){ ectx.beginPath(); ectx.moveTo(x,0); ectx.lineTo(x,GROUND_Y); ectx.stroke(); }
    for(let y=0;y<=GROUND_Y;y+=GRID){ ectx.beginPath(); ectx.moveTo(0,y); ectx.lineTo(960,y); ectx.stroke(); }
    ectx.fillStyle='#090d18'; ectx.fillRect(0,GROUND_Y,960,80);
    ectx.fillStyle='rgba(255,255,255,.08)'; ectx.fillRect(0,GROUND_Y,960,4);

    for(const o of editor.objects){
      const x=o.x-cam; if(x < -160 || x > 1040) continue;
      if(o.type==='block'){ ectx.fillStyle='#18243e'; ectx.fillRect(x,o.y,o.w,o.h); ectx.strokeStyle='#63e6ff'; ectx.strokeRect(x,o.y,o.w,o.h); }
      else if(o.type==='platform'){ ectx.fillStyle='#63e6ff'; ectx.fillRect(x,o.y,o.w,o.h); }
      else if(o.type==='spike'){ ectx.fillStyle='#ff5d73'; ectx.beginPath(); ectx.moveTo(x,o.y+o.h); ectx.lineTo(x+o.w/2,o.y); ectx.lineTo(x+o.w,o.y+o.h); ectx.closePath(); ectx.fill(); }
      else if(o.type==='crystal'){ ectx.save(); ectx.translate(x,o.y); ectx.rotate(Math.PI/4); ectx.fillStyle='#ffe66d'; ectx.fillRect(-11,-11,22,22); ectx.restore(); }
    }

    ectx.fillStyle='rgba(255,255,255,.75)'; ectx.font='bold 18px system-ui'; ectx.fillText(`X: ${Math.round(cam)} — objetos: ${editor.objects.length}`,18,28);
  }

  function toast(msg){
    const t=$('#toast'); t.textContent=msg; t.classList.remove('hidden'); clearTimeout(toast._t); toast._t=setTimeout(()=>t.classList.add('hidden'),1900);
  }

  // Resize internal canvas only through CSS: world stays at 960x540 for stable physics.
  window.addEventListener('resize', () => { if(screens.editor.classList.contains('active')) drawEditor(); });

  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('./service-worker.js').catch(()=>{});
  renderLevelGrid(); drawEditor();
})();
