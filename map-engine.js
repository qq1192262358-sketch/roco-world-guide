// ================ Leaflet 交互式地图引擎 V4 ================
// 功能：游戏内瓦片底图、多图层开关、收藏系统、坐标显示、标记聚合、统计面板
let mapInited = false;
let leafletMap = null;
let markerLayer = null;
let allMapMarkerObjs = [];

// 图层可见性（多选，localStorage持久化）
let layerVisibility = {};
const LAYER_TYPES = ['pet','boss','chest','gather','collect','npc','quest','shop','teleport','dungeon','battle','facility','hidden','magicfruit'];

// 收藏/已完成系统（localStorage持久化）
let markedDone = {}; // { markerId: true }
let bookmarks = {};  // { markerId: true }

// ================ 瓦片底图 ================
const TILE_BASE = 'https://wiki-dev-patch-oss.oss-cn-hangzhou.aliyuncs.com/res/lkwg/map-3.0';
// BiliWiki用CRS.Simple + 自定义瓦片坐标（中心为0,0）
const GameTileLayer = L.TileLayer.extend({
  getTileUrl: function(coords) {
    const z = coords.z;
    // CRS.Simple下Leaflet的瓦片坐标从左上角(0,0)开始
    // BiliWiki瓦片以中心为原点，需要减去half偏移
    const half = Math.pow(2, z) / 2;
    const x = coords.x - half;
    const y = coords.y - half;
    return `${TILE_BASE}/${z}/tile-${x}_${y}.png`;
  }
});

// ================ 坐标转换：BiliWiki像素坐标 → 标准Leaflet经纬度 ================
// BiliWiki CRS.Simple 坐标范围: lat(-2100~2100), lng(-3000~2800)
// 标准Leaflet(Mercator) 在zoom=5时，地图中心附近经纬度线性近似
// 瓦片在zoom=5覆盖约 lat(-33~33), lng(-34~34)（根据实际测试tile--3到tile2的6个瓦片）
// 比例: BiliWiki_lat / 2100 ≈ Leaflet_lat / 33 → scale = 33/2100 ≈ 0.0157
// 但BiliWiki的lat轴是向上为正（y轴翻转），Leaflet的lat也是向上为正 → 不需要翻转
const BWIKI_TO_LL_SCALE_LAT = 30 / 2100;  // BiliWiki lat → Leaflet lat
const BWIKI_TO_LL_SCALE_LNG = 34 / 2800;  // BiliWiki lng → Leaflet lng

function markerToLatLng(m) {
  // 优先使用BiliWiki坐标(lat/lng字段)
  if (m.lat !== undefined && m.lng !== undefined) {
    return [m.lat * BWIKI_TO_LL_SCALE_LAT, m.lng * BWIKI_TO_LL_SCALE_LNG];
  }
  // 兼容旧Canvas坐标(x,y: 0-1000)
  // 旧坐标映射: x(0~1000)→BiliWiki lng(-2800~2800), y(0~1000)→BiliWiki lat(2100~-2100)
  const bwLat = 2100 - (m.y / 1000) * 4200;
  const bwLng = -2800 + (m.x / 1000) * 5600;
  return [bwLat * BWIKI_TO_LL_SCALE_LAT, bwLng * BWIKI_TO_LL_SCALE_LNG];
}

// ================ 初始化 ================
function initMap() {
  if (mapInited) return;
  mapInited = true;
  loadMapStorage();
  initLeafletMap();
  renderLayerPanel();
  renderMapToolbar();
  renderMapZoneList();
}

function loadMapStorage() {
  try {
    const vis = localStorage.getItem('roco_map_layers');
    layerVisibility = vis ? JSON.parse(vis) : {};
    const done = localStorage.getItem('roco_map_done');
    markedDone = done ? JSON.parse(done) : {};
    const bm = localStorage.getItem('roco_map_bookmarks');
    bookmarks = bm ? JSON.parse(bm) : {};
  } catch(e) {}
  // 默认全部显示
  LAYER_TYPES.forEach(t => { if (layerVisibility[t] === undefined) layerVisibility[t] = true; });
}

function saveMapStorage() {
  try {
    localStorage.setItem('roco_map_layers', JSON.stringify(layerVisibility));
    localStorage.setItem('roco_map_done', JSON.stringify(markedDone));
    localStorage.setItem('roco_map_bookmarks', JSON.stringify(bookmarks));
  } catch(e) {}
}

// ================ Leaflet初始化 ================
function initLeafletMap() {
  const container = document.getElementById('mapContainer');
  if (!container) return;
  leafletMap = L.map(container, {
    center: [0, 0], zoom: 5, minZoom: 3, maxZoom: 8,
    zoomControl: false, attributionControl: false,
    zoomSnap: 0.5, zoomDelta: 0.5
  });
  // 缩放控件放右下角
  L.control.zoom({ position: 'bottomright' }).addTo(leafletMap);
  // 瓦片底图
  new GameTileLayer('', { minZoom: 3, maxZoom: 8, tileSize: 256, noWrap: true }).addTo(leafletMap);
  // 标记图层
  markerLayer = L.layerGroup().addTo(leafletMap);
  // 坐标显示控件
  addCoordsDisplay();
  // 渲染标记
  leafletMap.whenReady(() => renderLeafletMarkers());
  // 缩放时更新统计
  leafletMap.on('zoomend moveend', updateMapStats);
}

// ================ 坐标实时显示 ================
function addCoordsDisplay() {
  const CoordsCtrl = L.Control.extend({
    options: { position: 'bottomleft' },
    onAdd: function() {
      const div = L.DomUtil.create('div', 'map-coords-display');
      div.id = 'mapCoordsDisplay';
      div.innerHTML = 'x: 0 y: 0';
      return div;
    }
  });
  new CoordsCtrl().addTo(leafletMap);
  leafletMap.on('mousemove', e => {
    const el = document.getElementById('mapCoordsDisplay');
    if (el) {
      // 转回游戏坐标
      const gx = Math.round(((e.latlng.lng + 150) / 300) * 1000);
      const gy = Math.round(((80 - e.latlng.lat) / 160) * 700);
      el.innerHTML = `x: ${gx} y: ${gy} | zoom: ${leafletMap.getZoom()}`;
    }
  });
}

// ================ 地图工具栏（统计+快捷操作） ================
function renderMapToolbar() {
  const el = document.getElementById('mapToolbar');
  if (!el) return;
  const total = MAP_MARKERS.length;
  const doneCount = Object.keys(markedDone).length;
  const bmCount = Object.keys(bookmarks).length;
  const visCount = MAP_MARKERS.filter(m => layerVisibility[m.type]).length;
  el.innerHTML = `
    <div class="map-toolbar-stats">
      <span class="map-stat-item">${gIcon('map',14)} <b>${visCount}</b>/${total} 显示</span>
      <span class="map-stat-item">${gIcon('sparkGreen',14)} <b>${doneCount}</b> 已完成</span>
      <span class="map-stat-item">${gIcon('starGold',14)} <b>${bmCount}</b> 收藏</span>
    </div>
    <div class="map-toolbar-btns">
      <span class="map-tbtn ${_showBookmarksOnly?'active':''}" onclick="toggleBookmarksOnly()">${gIcon('starGold',14)} 仅收藏</span>
      <span class="map-tbtn ${_hideDone?'active':''}" onclick="toggleHideDone()">${gIcon('sparkGreen',14)} 隐藏已完成</span>
      <span class="map-tbtn" onclick="resetMapProgress()">${gIcon('questLost',14)} 重置进度</span>
    </div>`;
}

let _showBookmarksOnly = false;
let _hideDone = false;

function toggleBookmarksOnly() {
  _showBookmarksOnly = !_showBookmarksOnly;
  renderLeafletMarkers();
  renderMapToolbar();
}
function toggleHideDone() {
  _hideDone = !_hideDone;
  renderLeafletMarkers();
  renderMapToolbar();
}
function resetMapProgress() {
  if (!confirm('确定要清除所有已完成标记和收藏吗？')) return;
  markedDone = {};
  bookmarks = {};
  saveMapStorage();
  renderLeafletMarkers();
  renderMapToolbar();
}

// ================ 多图层开关面板 ================
function renderLayerPanel() {
  const el = document.getElementById('mapFilterTabs');
  if (!el) return;
  const allOn = LAYER_TYPES.every(t => layerVisibility[t]);
  
  let html = `<div class="map-layer-panel">`;
  // 全选/全不选
  html += `<div class="map-layer-toggle-all" onclick="toggleAllLayers()">
    <span class="map-lcheck ${allOn?'checked':''}"></span>
    <span style="font-weight:600">${gIcon('map',14)} 全部</span>
    <span style="font-size:9px;color:#999;margin-left:auto">${MAP_MARKERS.length}</span>
  </div>`;
  // 每种类型
  const filterMeta = [
    {id:"pet",imgKey:"fruit"},{id:"boss",imgKey:"battleOpen"},{id:"chest",imgKey:"chestNorm"},
    {id:"gather",imgKey:"gather"},{id:"collect",imgKey:"starBlue"},{id:"npc",imgKey:"shelter"},
    {id:"quest",imgKey:"questTale"},{id:"shop",imgKey:"shop"},{id:"teleport",imgKey:"teleport"},
    {id:"dungeon",imgKey:"dungeon"},{id:"battle",imgKey:"battleSpy"},{id:"facility",imgKey:"alchemy"},{id:"magicfruit",imgKey:"magicFruit"}
  ];
  html += '<div class="map-layer-grid">';
  filterMeta.forEach(f => {
    const cfg = MARKER_CONFIG[f.id] || {};
    const count = MAP_MARKERS.filter(m => m.type === f.id).length;
    const on = layerVisibility[f.id];
    const doneInType = MAP_MARKERS.filter(m => m.type === f.id && markedDone[m.id]).length;
    const iconUrl = GAME_ICONS[f.imgKey] || GAME_ICONS.fruit;
    html += `<div class="map-layer-item ${on?'':'map-layer-off'}" onclick="toggleLayer('${f.id}')" style="border-color:${on?cfg.color:'#ddd'}">
      <span class="map-lcheck ${on?'checked':''}"></span>
      <img src="${iconUrl}" style="width:18px;height:18px">
      <div class="map-layer-info">
        <div style="font-size:11px;font-weight:600;color:${on?cfg.color:'#bbb'}">${cfg.label||f.id}</div>
        <div style="font-size:9px;color:#999">${doneInType}/${count}</div>
      </div>
    </div>`;
  });
  html += '</div></div>';
  el.innerHTML = html;
}

function toggleLayer(type) {
  layerVisibility[type] = !layerVisibility[type];
  saveMapStorage();
  renderLayerPanel();
  renderLeafletMarkers();
  renderMapToolbar();
}

function toggleAllLayers() {
  const allOn = LAYER_TYPES.every(t => layerVisibility[t]);
  LAYER_TYPES.forEach(t => { layerVisibility[t] = !allOn; });
  saveMapStorage();
  renderLayerPanel();
  renderLeafletMarkers();
  renderMapToolbar();
}

// ================ 标记点渲染 ================
function renderLeafletMarkers() {
  markerLayer.clearLayers();
  allMapMarkerObjs = [];
  let markers = MAP_MARKERS.filter(m => layerVisibility[m.type]);
  if (_showBookmarksOnly) markers = markers.filter(m => bookmarks[m.id]);
  if (_hideDone) markers = markers.filter(m => !markedDone[m.id]);

  markers.forEach(m => {
    const cfg = MARKER_CONFIG[m.type] || MARKER_CONFIG.npc;
    const [lat, lng] = markerToLatLng(m);
    const isDone = markedDone[m.id];
    const isBM = bookmarks[m.id];

    // 图标样式（已完成的半透明）
    const opacity = isDone ? 'opacity:0.4;' : '';
    const bmBadge = isBM ? '<div style="position:absolute;top:-4px;right:-4px;width:10px;height:10px;border-radius:50%;background:#f1c40f;border:1px solid #fff;z-index:2"></div>' : '';
    const icon = L.divIcon({
      className: 'game-marker',
      html: `<div class="gm-wrap" style="border-color:${cfg.color};${opacity};position:relative">${bmBadge}<img src="${cfg.imgUrl}" alt="${cfg.label}" onerror="this.parentElement.innerHTML='<span style=\\'font-size:14px\\'>${cfg.label[0]}</span>'"></div>`,
      iconSize: [28, 28], iconAnchor: [14, 14], popupAnchor: [0, -16]
    });

    const marker = L.marker([lat, lng], { icon });

    // 弹窗（增加收藏和已完成按钮）
    const popupHtml = `<div style="min-width:200px">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
        <img src="${cfg.imgUrl}" style="width:28px;height:28px;border-radius:6px" onerror="this.style.display='none'">
        <div style="flex:1">
          <div style="font-size:13px;font-weight:700;color:#2c3e50">${m.name}</div>
          <div style="font-size:10px;color:${cfg.color};font-weight:600">${cfg.label} · ${m.zone}</div>
        </div>
      </div>
      <div style="font-size:11px;color:#555;line-height:1.6;margin-bottom:6px">${m.desc}</div>
      ${m.quest ? `<div style="font-size:10px;color:#f39c12;background:#fffce8;padding:4px 8px;border-radius:6px;margin-bottom:4px"><img src="${GAME_ICONS.questTale}" style="width:12px;height:12px;vertical-align:middle"> ${m.quest}</div>` : ''}
      ${m.pet ? `<div style="font-size:10px;color:#27ae60;background:#eefbef;padding:4px 8px;border-radius:6px;margin-bottom:4px;cursor:pointer" onclick="jumpToDex('${m.pet}')"><img src="${GAME_ICONS.dex}" style="width:12px;height:12px;vertical-align:middle"> 查看图鉴: ${m.pet} ›</div>` : ''}
      <div style="display:flex;gap:6px;margin-top:6px">
        <div class="map-popup-btn ${isDone?'map-popup-btn-done':''}" onclick="toggleDone('${m.id}')">
          ${isDone ? '✓ 已完成' : '○ 标记完成'}
        </div>
        <div class="map-popup-btn ${isBM?'map-popup-btn-bm':''}" onclick="toggleBookmark('${m.id}')">
          ${isBM ? '★ 已收藏' : '☆ 收藏'}
        </div>
      </div>
      <div style="font-size:8px;color:#ccc;margin-top:4px;text-align:right">坐标 (${m.x}, ${m.y})</div>
    </div>`;
    marker.bindPopup(popupHtml, { maxWidth: 280 });
    marker.addTo(markerLayer);
    allMapMarkerObjs.push({ marker, data: m });
  });
  updateMapStats();
}

// ================ 收藏/完成操作 ================
function toggleDone(id) {
  if (markedDone[id]) delete markedDone[id]; else markedDone[id] = true;
  saveMapStorage();
  renderLeafletMarkers();
  renderMapToolbar();
  renderLayerPanel();
}
function toggleBookmark(id) {
  if (bookmarks[id]) delete bookmarks[id]; else bookmarks[id] = true;
  saveMapStorage();
  renderLeafletMarkers();
  renderMapToolbar();
}

// ================ 地图统计（当前视野内） ================
function updateMapStats() {
  const el = document.getElementById('mapViewStats');
  if (!el || !leafletMap) return;
  const bounds = leafletMap.getBounds();
  let inView = 0;
  allMapMarkerObjs.forEach(o => {
    const [lat, lng] = markerToLatLng(o.data);
    if (bounds.contains([lat, lng])) inView++;
  });
  el.textContent = `视野内 ${inView} 个标记`;
}

// ================ 搜索 ================
let _mapSearchTimer = null;
function debounceMapSearch() { clearTimeout(_mapSearchTimer); _mapSearchTimer = setTimeout(onMapSearch, 200); }
function onMapSearch() {
  const q = (document.getElementById('mapSearch').value || '').trim().toLowerCase();
  document.getElementById('mapSearchClear').style.display = q ? 'flex' : 'none';
  if (!q) { document.getElementById('mapSearchResults').innerHTML = ''; return; }
  const results = MAP_MARKERS.filter(m =>
    m.name.toLowerCase().includes(q) || (m.desc||'').toLowerCase().includes(q) ||
    (m.zone||'').toLowerCase().includes(q) || (m.quest||'').toLowerCase().includes(q) ||
    (m.pet||'').toLowerCase().includes(q)
  );
  const zones = MAP_ZONES.filter(z => z.name.toLowerCase().includes(q) || z.desc.toLowerCase().includes(q));
  const el = document.getElementById('mapSearchResults');
  if (!results.length && !zones.length) { el.innerHTML = '<div style="text-align:center;padding:12px;color:#bbb;font-size:12px">没有找到相关内容</div>'; return; }
  let html = results.slice(0, 20).map(m => {
    const cfg = MARKER_CONFIG[m.type] || MARKER_CONFIG.npc;
    const isDone = markedDone[m.id];
    const isBM = bookmarks[m.id];
    return `<div class="map-sr-item ${isDone?'map-sr-done':''}" onclick="focusMarker('${m.id}')">
      <span class="map-sr-icon" style="background:${cfg.bg};color:${cfg.color}"><img src="${cfg.imgUrl}" style="width:20px;height:20px;border-radius:4px"></span>
      <div class="map-sr-info">
        <div class="map-sr-name">${isBM?'<span style="color:#f1c40f">★</span> ':''}${hlText(m.name,q)} ${isDone?'<span style="color:#27ae60;font-size:9px">✓</span>':''}</div>
        <div class="map-sr-sub">${cfg.label} · ${m.zone}</div>
      </div>
      <span class="map-sr-arrow"><img src="${GAME_ICONS.location}" style="width:14px;height:14px"></span>
    </div>`;
  }).join('');
  if (results.length > 20) html += `<div style="text-align:center;padding:8px;color:#999;font-size:10px">还有 ${results.length-20} 个结果...</div>`;
  html += zones.map(z => `<div class="map-sr-item" onclick="focusZone('${z.id}')"><span class="map-sr-icon" style="background:${z.color}20;color:${z.color}"><img src="${GAME_ICONS.map}" style="width:18px;height:18px"></span><div class="map-sr-info"><div class="map-sr-name">${hlText(z.name,q)}</div><div class="map-sr-sub">区域 · ${z.desc}</div></div><span class="map-sr-arrow"><img src="${GAME_ICONS.location}" style="width:14px;height:14px"></span></div>`).join('');
  el.innerHTML = html;
}
function hlText(t, q) { return t.replace(new RegExp('('+q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','gi'),'<mark style="background:#fff176;padding:0 2px;border-radius:2px">$1</mark>'); }

function focusMarker(id) {
  document.getElementById('mapSearchResults').innerHTML = '';
  const found = allMapMarkerObjs.find(o => o.data.id === id);
  if (found) {
    const [lat, lng] = markerToLatLng(found.data);
    leafletMap.setView([lat, lng], 7, { animate: true });
    found.marker.openPopup();
  }
  document.getElementById('mapContainer').scrollIntoView({behavior:'smooth',block:'center'});
}
function focusZone(zoneId) {
  document.getElementById('mapSearchResults').innerHTML = '';
  const zone = MAP_ZONES.find(z => z.id === zoneId);
  if (!zone) return;
  const lat = 80 - ((zone.y + zone.h/2) / 700) * 160;
  const lng = -150 + ((zone.x + zone.w/2) / 1000) * 300;
  leafletMap.setView([lat, lng], 6, { animate: true });
}
function clearMapSearch() {
  document.getElementById('mapSearch').value = '';
  document.getElementById('mapSearchClear').style.display = 'none';
  document.getElementById('mapSearchResults').innerHTML = '';
}

// ================ 兼容旧代码 ================
function showMarkerDetail(id) { focusMarker(id); }
function closeMapDetail() {}
function jumpToDex(petName) {
  const pet = (typeof DEX_DATA !== 'undefined') ? DEX_DATA.find(d => d.n === petName) : null;
  if (pet) { currentTab = 'dex'; openDexDetail(pet.no); }
}

// ================ 区域列表（可展开+进度显示） ================
function renderMapZoneList() {
  const el = document.getElementById('mapZoneList');
  const regions = {city:[],wild:[],dungeon:[]};
  MAP_ZONES.forEach(z => {
    if (z.region === '城镇') regions.city.push(z);
    else if (z.region === '副本') regions.dungeon.push(z);
    else regions.wild.push(z);
  });

  const sectionHtml = (title, iconKey, zones) => {
    if (!zones.length) return '';
    const iconUrl = GAME_ICONS[iconKey] || GAME_ICONS.fruit;
    return `<div style="font-size:13px;font-weight:700;color:#2c3e50;margin:14px 0 6px;display:flex;align-items:center;gap:6px"><img src="${iconUrl}" style="width:16px;height:16px"> ${title} (${zones.length})</div>` +
      zones.map(z => {
        const markers = MAP_MARKERS.filter(m => m.zone === z.name);
        const doneInZone = markers.filter(m => markedDone[m.id]).length;
        const tc = {};
        markers.forEach(m => { tc[m.type] = (tc[m.type]||0)+1; });
        const tags = Object.entries(tc).map(([t,c]) => {
          const cfg = MARKER_CONFIG[t];
          return cfg ? `<span style="font-size:9px;color:${cfg.color};background:${cfg.bg};padding:1px 5px;border-radius:4px;display:inline-flex;align-items:center;gap:2px"><img src="${cfg.imgUrl}" style="width:10px;height:10px">${c}</span>` : '';
        }).join(' ');
        const zid = `mzone_${z.id}`;
        const progress = markers.length ? Math.round(doneInZone/markers.length*100) : 0;
        return `<div class="map-zone-card" style="border-left-color:${z.color}" onclick="toggleZoneDetail('${zid}','${z.name}','${z.id}')">
          <div style="display:flex;align-items:center;justify-content:space-between">
            <div class="map-zone-name" style="color:${z.color}">${z.name}</div>
            <div style="display:flex;align-items:center;gap:6px">
              ${markers.length ? `<span style="font-size:9px;color:${progress===100?'#27ae60':'#999'}">${doneInZone}/${markers.length}</span>` : ''}
              <span style="font-size:10px;color:#bbb" id="${zid}_arrow">▼</span>
            </div>
          </div>
          ${markers.length ? `<div style="height:2px;background:#f0f0f0;border-radius:1px;margin:4px 0"><div style="height:2px;background:${progress===100?'#27ae60':z.color};border-radius:1px;width:${progress}%;transition:width .3s"></div></div>` : ''}
          <div class="map-zone-desc">${z.desc}</div>
          <div class="map-zone-tags">${tags||'暂无标记'}</div>
          <div class="map-zone-detail" id="${zid}" style="display:none"></div>
        </div>`;
      }).join('');
  };

  el.innerHTML = '<div style="font-size:14px;font-weight:700;color:#2c3e50;margin:16px 0 8px;display:flex;align-items:center;gap:6px"><img src="'+GAME_ICONS.map+'" style="width:20px;height:20px"> 区域一览 ('+MAP_ZONES.length+'个)</div>' +
    sectionHtml('城镇区域','shelter',regions.city) +
    sectionHtml('野外区域','gather',regions.wild) +
    sectionHtml('副本区域','dungeon',regions.dungeon);
}

function toggleZoneDetail(zid, zoneName, zoneId) {
  const el = document.getElementById(zid);
  const arrow = document.getElementById(zid + '_arrow');
  if (!el) return;
  if (el.style.display === 'none') {
    el.style.display = 'block';
    if (arrow) arrow.innerHTML = '▲';
    const markers = MAP_MARKERS.filter(m => m.zone === zoneName);
    if (!markers.length) {
      el.innerHTML = '<div style="padding:8px;font-size:11px;color:#bbb;text-align:center">暂无标记点数据</div>';
      return;
    }
    const groups = {};
    markers.forEach(m => { if (!groups[m.type]) groups[m.type] = []; groups[m.type].push(m); });
    const typeOrder = ['pet','boss','chest','gather','collect','npc','quest','shop','teleport','dungeon','battle','facility','hidden'];
    el.innerHTML = '<div style="margin-top:8px;border-top:1px solid #f0f0f0;padding-top:8px">' +
      typeOrder.map(type => {
        const arr = groups[type];
        if (!arr || !arr.length) return '';
        const cfg = MARKER_CONFIG[type] || MARKER_CONFIG.npc;
        return `<div style="margin-bottom:6px">
          <div style="font-size:10px;font-weight:700;color:${cfg.color};margin-bottom:3px;display:flex;align-items:center;gap:4px"><img src="${cfg.imgUrl}" style="width:14px;height:14px;border-radius:3px"> ${cfg.label} (${arr.length})</div>
          ${arr.map(m => {
            const isDone = markedDone[m.id];
            const isBM = bookmarks[m.id];
            return `<div class="map-zone-marker ${isDone?'map-zone-marker-done':''}" style="border-left-color:${cfg.color}" onclick="event.stopPropagation();focusMarker('${m.id}')">
            <img src="${cfg.imgUrl}" style="width:16px;height:16px;border-radius:3px;flex-shrink:0;${isDone?'opacity:0.4':''}">
            <div style="flex:1;min-width:0">
              <div style="font-size:11px;font-weight:600;color:${isDone?'#bbb':'#2c3e50'}">${isBM?'<span style="color:#f1c40f">★</span> ':''}${m.name} ${isDone?'<span style="color:#27ae60">✓</span>':''}</div>
              <div style="font-size:9px;color:#888;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${m.desc}</div>
            </div>
            ${m.pet ? `<span style="font-size:9px;color:#27ae60;cursor:pointer" onclick="event.stopPropagation();jumpToDex('${m.pet}')">图鉴›</span>` : ''}
          </div>`}).join('')}
        </div>`;
      }).join('') + `<div style="display:flex;gap:8px;justify-content:center;margin-top:8px">
        <span class="map-zone-goto" onclick="event.stopPropagation();focusZone('${zoneId}')"><img src="${GAME_ICONS.location}" style="width:12px;height:12px;vertical-align:middle"> 在地图上查看</span>
        <span class="map-zone-goto" style="background:#e8f8f0;color:#27ae60" onclick="event.stopPropagation();markZoneDone('${zoneName}')">${gIcon('sparkGreen',12)} 全部完成</span>
      </div></div>`;
  } else {
    el.style.display = 'none';
    if (arrow) arrow.innerHTML = '▼';
  }
}

function markZoneDone(zoneName) {
  MAP_MARKERS.filter(m => m.zone === zoneName).forEach(m => { markedDone[m.id] = true; });
  saveMapStorage();
  renderLeafletMarkers();
  renderMapToolbar();
  renderLayerPanel();
  renderMapZoneList();
}
