// ================ 全局状态 ================
let currentCategory = "all";
let currentTab = "boss";
let selectedType = null;
let currentDexType = "all";
let currentDexEvo = "all";
let currentDexSort = "no"; // no, sv, hp, atk, matk, def, mdef, spd, name
let currentDexSortDir = "asc";
let currentDexView = "card"; // card, table

// ================ 精灵图片工具 ================
// BOSS名→BiliWiki精灵名映射（BOSS名和精灵图鉴名不同时需要映射）
const IMG_NAME_MAP = {
  "雪影冰灵":"雪影娃娃","布莱克":"布克棱岩","女王蜂":"花魁蜂后",
  "祭礼巨像":"仪式巨像","圣光迪莫":"迪莫","圣剑骑士":"圣剑-X",
  "伊兰龙":"伊兰亚龙","翼王(圣羽翼王)":"圣羽翼王",
  "帕尔萨斯":"帕尔萨斯","冰龙":"古啦多",
  "仪式之星(祭礼巨像)":"仪式之星","布是石":"布是石",
  "领地守卫·岩傀":"布克棱岩","领地守卫·雷将":"荆棘电环",
  "领地守卫·炎魔":"炽心勇狮","麦克达克":"立方人",
  "巨型呼呼猪":"獠牙猪","罗德里":"波多西","尼尔森":"罗隐"
};
function getPetImgUrl(name) {
  const mapped = IMG_NAME_MAP[name] || name;
  return `https://wiki.biligame.com/rocom/Special:FilePath/页面_宠物_立绘_${mapped}_1.png`;
}
// 异色形态图片 (_2)
function getPetShinyUrl(name) {
  const mapped = IMG_NAME_MAP[name] || name;
  return `https://wiki.biligame.com/rocom/Special:FilePath/页面_宠物_立绘_${mapped}_2.png`;
}
// 炫彩形态图片 (_3)
function getPetDazzleUrl(name) {
  const mapped = IMG_NAME_MAP[name] || name;
  return `https://wiki.biligame.com/rocom/Special:FilePath/页面_宠物_立绘_${mapped}_3.png`;
}
function petImgTag(name, size, fallbackEmoji, extraClass) {
  const cls = extraClass || '';
  return `<img class="pet-img ${cls}" src="${getPetImgUrl(name)}" alt="${name}" 
    style="width:${size}px;height:${size}px;object-fit:contain;border-radius:10px;" 
    onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" 
    loading="lazy"><span class="pet-img-fallback" style="display:none;width:${size}px;height:${size}px;align-items:center;justify-content:center;font-size:${Math.round(size*0.55)}px;border-radius:10px;">${fallbackEmoji||'🐾'}</span>`;
}

// ================ 游戏内图标资源 ================
const ROCOM_BASE = 'https://rocom.game-walkthrough.com';
// 属性图标（腾讯官方CDN game.gtimg.cn）
const ATTR_ICON_MAP = {
  "普通系":"icon-type-17","草系":"icon-type-6","火系":"icon-type-3","水系":"icon-type-2","光系":"icon-type-10",
  "地系":"icon-type-16","冰系":"icon-type-7","龙系":"icon-type-11","电系":"icon-type-4","毒系":"icon-type-15",
  "虫系":"icon-type-9","武系":"icon-type-13","翼系":"icon-type-5","萌系":"icon-type-8","幽系":"icon-type-18",
  "恶系":"icon-type-14","机械系":"icon-type-12","幻系":"icon-type-19"
};
function getAttrIconUrl(typeName) {
  const key = ATTR_ICON_MAP[typeName] || 'icon-type-17';
  return `https://game.gtimg.cn/images/rocom/web202504/index/part2/${key}.png`;
}
function attrIconTag(typeName, size) {
  const s = size || 18;
  return `<img src="${getAttrIconUrl(typeName)}" alt="${typeName}" style="width:${s}px;height:${s}px;vertical-align:middle;border-radius:50%;object-fit:cover;" loading="lazy" onerror="this.style.display='none'">`;
}
// 技能图标（BiliWiki游戏内图标，554+个）
function getSkillIconUrl(skillName) {
  return `https://wiki.biligame.com/rocom/Special:FilePath/${encodeURIComponent('技能图标_' + skillName)}.png`;
}
function skillIconTag(skillName, size) {
  const s = size || 32;
  return `<img src="${getSkillIconUrl(skillName)}" alt="${skillName}" style="width:${s}px;height:${s}px;object-fit:contain;border-radius:6px;" loading="lazy" onerror="this.style.display='none';this.nextElementSibling&&(this.nextElementSibling.style.display='flex')">`;
}

// ================ 全局游戏内UI图标系统 ================
const BWIKI = 'https://patchwiki.biligame.com/images/rocom';
const GAME_ICONS = {
  // ---- Tab栏 / 功能模块图标 ----
  boss:     `${BWIKI}/2/20/8bx4ds1o59x3ixcjyxuc68po9aywmd0.png`, // 露天挑战→BOSS
  dex:      `${BWIKI}/3/3c/imw150a0agztfv9p59gkq5ds4e3yyh9.png`, // 果实→图鉴
  map:      `${BWIKI}/8/8f/gf4gxtq1rrxe7ue7rba6jhdb1xndc1x.png`, // 传送点→地图
  team:     `${BWIKI}/0/06/rrpkzmmqnqfzcw04uk4cnl3wjk2yvyb.png`, // 黑衣人→阵容
  event:    `${BWIKI}/5/5d/6d3nztcz0tcecbz3wdy9iu51ylyr8t3.png`, // 奇谭任务→活动
  // ---- 图鉴工具栏 ----
  typeChart: `${BWIKI}/2/22/iazf7tgi59w00bctm7o7xugenug7byw.png`, // 重量解谜→属性克制
  skillDex:  `${BWIKI}/9/97/3smp6ncwfp80ojpejrwgfymuty9al7e.png`, // 副本→技能图鉴
  egg:       `${BWIKI}/5/50/917ct1jht5zjf6d6ftyfgwaqbqmi4u6.png`, // 可可果→精灵蛋
  guide:     `${BWIKI}/6/66/aybvnyggb92rm0b0id9unlcai02wv5x.png`, // 小游戏→玩法指南
  // ---- 特殊攻略入口 ----
  floral:    `${BWIKI}/f/f8/ifb5jnhil9kfur7px1yftlfah8zhcmt.png`, // 向阳花→命定花种
  beast:     `${BWIKI}/0/06/rrpkzmmqnqfzcw04uk4cnl3wjk2yvyb.png`, // 黑衣人→稀兽
  chief:     `${BWIKI}/1/13/o5evcztzo2vp80qd8qt70m2csme2ami.png`, // 庇护所→首领
  legend:    `${BWIKI}/8/8c/7qsncvokm4oj6mrqybvz9y6m67i27mt.png`, // 眠枭之星金→传说
  // ---- 通用功能图标 ----
  search:    `${BWIKI}/d/df/mebtr92zdlbvmpx8ujhlmqcom9lpg6n.png`, // 眠枭蓝→搜索
  location:  `${BWIKI}/a/a2/fy2t2skpj760pxc13za2crcz2y7t5jd.png`, // 小庇护所→位置
  chest:     `${BWIKI}/f/f9/pjrutk7171n45d8s17wnd4st6oz7psh.png`, // 普通宝箱→奖励
  shop:      `${BWIKI}/0/03/6u4bbp7fn5k82m7bemev20afc5lglx9.png`, // 商店
  gacha:     `${BWIKI}/1/12/dcufmhvntrbt2dfdgnymvpegodeb96q.png`, // 扭蛋机
  alchemy:   `${BWIKI}/3/3b/lj19ptkcdvs4vfjp35mzkoptiati9y3.png`, // 炼金台
  dungeon:   `${BWIKI}/9/97/3smp6ncwfp80ojpejrwgfymuty9al7e.png`, // 副本
  teleport:  `${BWIKI}/8/8f/gf4gxtq1rrxe7ue7rba6jhdb1xndc1x.png`, // 传送点
  shelter:   `${BWIKI}/1/13/o5evcztzo2vp80qd8qt70m2csme2ami.png`, // 庇护所
  clothing:  `${BWIKI}/8/83/bwc1p5fct63tv1gi8lhkejen43iyzi1.png`, // 服装店
  puzzle:    `${BWIKI}/2/22/iazf7tgi59w00bctm7o7xugenug7byw.png`, // 重量解谜
  minigame:  `${BWIKI}/6/66/aybvnyggb92rm0b0id9unlcai02wv5x.png`, // 小游戏
  // ---- 宝箱品质 ----
  chestNorm: `${BWIKI}/f/f9/pjrutk7171n45d8s17wnd4st6oz7psh.png`,
  chestRare: `${BWIKI}/d/d6/o76a4cyzhwxw83y5mdw3obu34x20j5r.png`,
  chestEpic: `${BWIKI}/b/b5/0o3wo0hkmx1d5cfpl6m8in4vyi2qgz8.png`,
  chestLeg:  `${BWIKI}/0/03/pvagjt26i89098s86vwnz16gzguk70i.png`,
  // ---- 收集品 ----
  fruit:     `${BWIKI}/3/3c/imw150a0agztfv9p59gkq5ds4e3yyh9.png`,
  starBlue:  `${BWIKI}/d/df/mebtr92zdlbvmpx8ujhlmqcom9lpg6n.png`,
  starGold:  `${BWIKI}/8/8c/7qsncvokm4oj6mrqybvz9y6m67i27mt.png`,
  sparkGreen:`${BWIKI}/7/79/aq94yh30sv2nmv2wip253qpl92sea68.png`,
  sparkBlue: `${BWIKI}/7/77/s14q7jvw01vfy0ta43vd5juk10tmngq.png`,
  sparkPurple:`${BWIKI}/5/57/6qogppaucbc9vkau3br8zmc489d2ey9.png`,
  // ---- 任务 ----
  questLost: `${BWIKI}/4/41/8cx5vqp9vnvyh56syw5vxqyu0ftvzs6.png`,
  questTale: `${BWIKI}/5/5d/6d3nztcz0tcecbz3wdy9iu51ylyr8t3.png`,
  questTrip: `${BWIKI}/9/9a/r0bc4culrfpjxdha9f3ke81sf5y8d1h.png`,
  // ---- 战斗 ----
  battleOpen:`${BWIKI}/2/20/8bx4ds1o59x3ixcjyxuc68po9aywmd0.png`,
  battleSpy: `${BWIKI}/0/06/rrpkzmmqnqfzcw04uk4cnl3wjk2yvyb.png`,
  // ---- 采集资源 ----
  gather:    `${BWIKI}/f/f8/ifb5jnhil9kfur7px1yftlfah8zhcmt.png`, // 向阳花
  magicFruit:'https://wiki.biligame.com/rocom/Special:FilePath/%E5%9C%B0%E5%9B%BE_%E7%82%B9%E4%BD%8D_icon_%E9%AD%94%E5%8A%9B%E6%9E%9C.png',
  // ---- 蛋组相关 ----
  eggSky:    `${BWIKI}/8/89/dy3mvf1zwf5gg8l4yud2n115u21e5xt.png`, // 翼系宝箱→天空组
  eggAqua:   `${BWIKI}/e/e7/112od20cucj3uk93kwe6ewmdvm9ljpg.png`, // 水系宝箱→两栖组
  eggFairy:  `${BWIKI}/8/85/535i7n5sxc4hmgbaghjtkzy8o2nmx8y.png`, // 萌系宝箱→妖精组
  eggPlant:  `${BWIKI}/e/e5/f00mv302xf8kozky0h86csm7yv3umqt.png`, // 草系宝箱→植物组
  eggBug:    `${BWIKI}/c/c4/t8pzzovmprqe2dklcumxumhcim2cpz3.png`, // 虫系宝箱→昆虫组
  eggMech:   `${BWIKI}/2/20/5g87qfg4ofxihlpol5yhbv629hh8fsm.png`, // 机械系宝箱→机械组
  eggBeast:  `${BWIKI}/5/56/guda8zus94dhx7i0d2zfb2b3nyczqvz.png`, // 普通系宝箱→动物组
  eggMineral:`${BWIKI}/3/31/p1ia7t6zxk47w57xrs7hkmqmt07owzd.png`, // 地系宝箱→矿物组
};

// 统一图标Tag生成函数
function gIcon(key, size, alt) {
  const s = size || 20;
  const url = GAME_ICONS[key] || GAME_ICONS.fruit;
  return `<img src="${url}" alt="${alt||key}" style="width:${s}px;height:${s}px;object-fit:contain;vertical-align:middle;" loading="lazy" onerror="this.style.display='none'">`;
}
function gIconBg(key, size) {
  const s = size || 28;
  const url = GAME_ICONS[key] || GAME_ICONS.fruit;
  return `<div style="width:${s}px;height:${s}px;display:flex;align-items:center;justify-content:center;flex-shrink:0"><img src="${url}" style="width:${Math.round(s*0.85)}px;height:${Math.round(s*0.85)}px;object-fit:contain;" loading="lazy" onerror="this.style.display='none'"></div>`;
}

// ================ 属性颜色映射 ================
const TYPE_COLORS = {
  "普通系":{c:"#999",bg:"#f5f5f5",e:"&#11035;"},
  "草系":{c:"#27ae60",bg:"#eefbef",e:"&#127807;"},
  "火系":{c:"#e74c3c",bg:"#fff0ef",e:"&#128293;"},
  "水系":{c:"#3498db",bg:"#eef5ff",e:"&#128167;"},
  "光系":{c:"#f39c12",bg:"#fffce8",e:"&#10024;"},
  "地系":{c:"#8d6e63",bg:"#f3ede4",e:"&#127755;"},
  "冰系":{c:"#5dade2",bg:"#eef8ff",e:"&#10052;"},
  "龙系":{c:"#8e44ad",bg:"#f3eeff",e:"&#128009;"},
  "电系":{c:"#f1c40f",bg:"#fffce8",e:"&#9889;"},
  "毒系":{c:"#9b59b6",bg:"#f5eeff",e:"&#9760;"},
  "虫系":{c:"#6c8c24",bg:"#f5f9e8",e:"&#128029;"},
  "武系":{c:"#e67e22",bg:"#fff3e8",e:"&#129354;"},
  "翼系":{c:"#5dade2",bg:"#e8f6ff",e:"&#128330;"},
  "萌系":{c:"#e91e63",bg:"#ffeef5",e:"&#128149;"},
  "幽系":{c:"#6c3483",bg:"#f0e6ff",e:"&#128123;"},
  "恶系":{c:"#2c3e50",bg:"#f0f0f0",e:"&#127761;"},
  "机械系":{c:"#7f8c8d",bg:"#ecf0f0",e:"&#9881;"},
  "幻系":{c:"#e91e63",bg:"#ffeef5",e:"&#128302;"}
};

// ================ 技能类型图标(SVG) ================
// 技能分类图标 (使用BiliWiki游戏内技能图标作为代表)
const BWIKI_SKILL = 'https://wiki.biligame.com/rocom/Special:FilePath/';
function skillCatIcon(name, size) {
  const s = size || 18;
  return `<img src="${BWIKI_SKILL}${encodeURIComponent('技能图标_' + name)}.png" style="width:${s}px;height:${s}px;object-fit:contain;border-radius:4px" loading="lazy" onerror="this.style.display='none'">`;
}
// 技能图标懒加载：用data-src代替src，IntersectionObserver触发时才加载
function skillImgLazy(skillName, size) {
  const s = size || 24;
  const url = BWIKI_SKILL + encodeURIComponent('技能图标_' + skillName) + '.png';
  return `<img class="skill-lazy" data-src="${url}" alt="${skillName}" style="width:${s}px;height:${s}px;object-fit:contain;border-radius:4px;background:#f0f0f0" loading="lazy">`;
}
// 初始化技能图标懒加载观察器
let _skillObserver = null;
function initSkillLazyLoad() {
  if (_skillObserver) return;
  _skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          img.onerror = function() { this.style.display = 'none'; };
        }
        _skillObserver.unobserve(img);
      }
    });
  }, { rootMargin: '100px' });
}
function observeSkillIcons() {
  initSkillLazyLoad();
  document.querySelectorAll('img.skill-lazy[data-src]').forEach(img => {
    _skillObserver.observe(img);
  });
}
const SKILL_CAT = {
  "物": {
    bg:"#fff0ef", c:"#e74c3c", label:"物攻",
    svg: skillCatIcon("崩拳", 20)
  },
  "魔": {
    bg:"#f0e6ff", c:"#9b59b6", label:"魔攻",
    svg: skillCatIcon("天火", 20)
  },
  "防": {
    bg:"#e8f8f0", c:"#27ae60", label:"防御",
    svg: skillCatIcon("冰墙", 20)
  },
  "状": {
    bg:"#eef5ff", c:"#3498db", label:"状态",
    svg: skillCatIcon("闪避", 20)
  }
};

// ================ 双属性工具函数 ================
// pet.t 可能是 "火系"(字符串) 或 ["火系","草系"](数组)
function petTypes(pet) { return Array.isArray(pet.t) ? pet.t : [pet.t]; }
function petMainType(pet) { return petTypes(pet)[0]; }
function petTC(pet) { return TYPE_COLORS[petMainType(pet)] || TYPE_COLORS["普通系"]; }
function petHasType(pet, typeName) { return petTypes(pet).includes(typeName); }
function petTypeLabel(pet) { return petTypes(pet).join(' + '); }
function petTypeTags(pet) {
  return petTypes(pet).map(t => {
    const tc = TYPE_COLORS[t] || TYPE_COLORS["普通系"];
    return `<span style="display:inline-flex;align-items:center;gap:3px;padding:1px 6px;border-radius:4px;font-size:11px;font-weight:600;background:${tc.bg};color:${tc.c};margin-right:3px">${attrIconTag(t,14)} ${t}</span>`;
  }).join('');
}
function petTraitHtml(pet) {
  if (!pet.tr) return '';
  return `<div style="font-size:12px;color:#555;margin-top:4px;padding:6px 10px;background:#f8f9fa;border-radius:8px;border-left:3px solid ${petTC(pet).c}"><b>特性:</b> ${pet.tr}</div>`;
}
function petStatsHtml(pet) {
  if (!pet.st) return '';
  const s = pet.st;
  const max = 200; // 种族值单项最大参考值
  const bars = [
    {label:'生命',val:s.hp,color:'#e74c3c'},
    {label:'物攻',val:s.atk,color:'#e67e22'},
    {label:'魔攻',val:s.matk,color:'#9b59b6'},
    {label:'物防',val:s.def,color:'#3498db'},
    {label:'魔防',val:s.mdef,color:'#27ae60'},
    {label:'速度',val:s.spd,color:'#f39c12'}
  ];
  return `<div class="pet-stats-grid">${bars.map(b => 
    `<div class="pet-stat-row"><span class="pet-stat-label">${b.label}</span><div class="pet-stat-bar-bg"><div class="pet-stat-bar" style="width:${Math.min(100,b.val/max*100)}%;background:${b.color}"></div></div><span class="pet-stat-val">${b.val}</span></div>`
  ).join('')}</div>`;
}

// ================ 初始化 ================
// ================ 初始化(懒加载) ================
const _tabInited = {};
document.addEventListener('DOMContentLoaded', () => {
  renderCategories();
  renderBossList();
  _tabInited.boss = true;
});

// ================ Tab切换 ================
function switchTab(tab, el) {
  currentTab = tab;
  document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('.page,.detail-page').forEach(p => p.classList.remove('active'));
  
  const pageMap = { boss:'pageBoss', dex:'pageDex', team:'pageTeam', event:'pageEvent', map:'pageMap' };
  document.getElementById(pageMap[tab]).classList.add('active');
  document.getElementById('navBack').classList.remove('show');
  const titles = { boss:'BOSS攻略', dex:'精灵图鉴', team:'阵容', event:'活动日历', map:'世界地图' };
  document.getElementById('navTitle').textContent = titles[tab] || '全能攻略助手';
  document.querySelector('.tabbar').style.display = 'flex';
  // 懒初始化
  if (!_tabInited[tab]) {
    _tabInited[tab] = true;
    if (tab === 'dex') { renderDexTypeTabs(); renderDexList(); }
    else if (tab === 'team') { renderPetList(); initAnalyzePage(); }
    else if (tab === 'event') { renderEventList(); }
  }
  if (tab === 'map') initMap();
}

// ================ 阵容子Tab切换 ================
function switchTeamSub(sub, el) {
  document.querySelectorAll('.team-sub-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('.team-sub-page').forEach(p => p.classList.remove('active'));
  document.getElementById(sub === 'rec' ? 'teamSubRec' : 'teamSubAnalyze').classList.add('active');
}

// ================ 图鉴二级页面(克制/玩法) ================
let dexSubpage = null; // 'type' | 'guide' | null

function openDexSubpage(sub) {
  dexSubpage = sub;
  document.querySelectorAll('.page,.detail-page').forEach(p => p.classList.remove('active'));
  document.getElementById('navBack').classList.add('show');
  document.querySelector('.tabbar').style.display = 'none';
  if (sub === 'type') {
    if (!_tabInited.type) { _tabInited.type = true; renderTypeGrid(); }
    document.getElementById('pageDexType').classList.add('active');
    document.getElementById('navTitle').textContent = '属性克制查询';
  } else if (sub === 'guide') {
    if (!_tabInited.guide) { _tabInited.guide = true; renderGuideList(); }
    document.getElementById('pageDexGuide').classList.add('active');
    document.getElementById('navTitle').textContent = '基础玩法指南';
  } else if (sub === 'skills') {
    if (!_tabInited.skills) { _tabInited.skills = true; initSkillDex(); }
    document.getElementById('pageDexSkills').classList.add('active');
    document.getElementById('navTitle').textContent = '技能图鉴';
  } else if (sub === 'eggs') {
    if (!_tabInited.eggs) { _tabInited.eggs = true; renderEggGuide(); }
    document.getElementById('pageDexEggs').classList.add('active');
    document.getElementById('navTitle').textContent = '精灵蛋攻略';
  } else if (sub === 'balls') {
    if (!_tabInited.balls) { _tabInited.balls = true; renderBallGuide(); }
    document.getElementById('pageDexBalls').classList.add('active');
    document.getElementById('navTitle').textContent = '咕噜球图鉴';
  }
}

// ================ 返回 ================
function goBack() {
  // 关闭所有二级页面
  document.getElementById('pageDetail').classList.remove('active');
  document.getElementById('pageDexDetail').classList.remove('active');
  document.getElementById('pageDexType').classList.remove('active');
  document.getElementById('pageDexGuide').classList.remove('active');
  const skillPage = document.getElementById('pageDexSkills');
  if (skillPage) skillPage.classList.remove('active');
  const eggPage = document.getElementById('pageDexEggs');
  if (eggPage) eggPage.classList.remove('active');
  const ballPage = document.getElementById('pageDexBalls');
  if (ballPage) ballPage.classList.remove('active');
  const sgPage = document.getElementById('pageSpecialGuide');
  if (sgPage) sgPage.classList.remove('active');
  
  if(currentTab === 'dex') {
    document.getElementById('pageDex').classList.add('active');
    document.getElementById('navTitle').textContent = '精灵图鉴';
  } else {
    document.getElementById('pageBoss').classList.add('active');
    document.getElementById('navTitle').textContent = 'BOSS攻略';
  }
  dexSubpage = null;
  document.getElementById('navBack').classList.remove('show');
  document.querySelector('.tabbar').style.display = 'flex';
}

// ================ 分类标签 ================
function renderCategories() {
  const cats = [{id:"all",label:"全部"}, {id:"剧情BOSS",label:"剧情BOSS"}, {id:"日常BOSS",label:"日常BOSS"}, {id:"活动BOSS",label:"活动BOSS"}];
  const el = document.getElementById('categoryTabs');
  el.innerHTML = cats.map(c => 
    `<div class="cat-tag ${c.id === currentCategory ? 'active' : ''}" onclick="selectCategory('${c.id}',this)">${c.label}</div>`
  ).join('');
}

function selectCategory(cat, el) {
  currentCategory = cat;
  document.querySelectorAll('#categoryTabs .cat-tag').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  renderBossList();
}

// ================ 搜索 ================
function filterBoss() { renderBossList(); }

// ================ BOSS列表 ================
function renderBossList() {
  const search = (document.getElementById('searchInput').value || '').toLowerCase();
  let list = BOSS_DATA;
  if (currentCategory !== "all") list = list.filter(b => b.category === currentCategory);
  if (search) list = list.filter(b => b.name.toLowerCase().includes(search) || b.type.toLowerCase().includes(search) || b.location.toLowerCase().includes(search));
  
  const el = document.getElementById('bossList');
  if (!list.length) { el.innerHTML = '<div style="text-align:center;padding:40px;color:#bbb;font-size:13px;">没有找到匹配的BOSS</div>'; return; }
  
  el.innerHTML = list.map(b => {
    const stars = Array.from({length:5}, (_, i) => `<span class="star ${i < b.difficulty ? '' : 'empty'}">${i < b.difficulty ? '&#9733;' : '&#9734;'}</span>`).join('');
    return `
    <div class="boss-card" onclick="openBossDetail(${b.id})">
      <div class="boss-header">
        <div class="boss-avatar" style="background:${getTypeBg(b.typeClass)};overflow:hidden;padding:0;">
          ${petImgTag(b.name, 48, b.emoji)}
        </div>
        <div class="boss-info"><div class="boss-name">${b.name}</div><div class="boss-sub">${b.category} | ${b.chapter}</div></div>
        <div style="text-align:right"><div class="boss-diff">${stars}</div></div>
      </div>
      <div class="boss-tags">
        <span class="boss-tag ${b.typeClass}">${b.type}</span>
        <span class="boss-tag" style="background:#f8f9fa;color:#666;">${gIcon('location',12)} ${b.location.substring(0,8)}${b.location.length>8?'...':''}</span>
        ${b.solutions.find(s=>s.recommended)?'<span class="badge badge-rec">'+gIcon('battleOpen',12)+' 有推荐方案</span>':''}
      </div>
    </div>`;
  }).join('');
}

function getTypeBg(cls) {
  const map = {'tag-ice':'#eef8ff','tag-dark':'#f0f0f0','tag-bug':'#f5f9e8','tag-mech':'#f0f0f0','tag-light':'#fffce8','tag-dragon':'#f3eeff','tag-fly':'#eef8ff','tag-ghost':'#f5eeff','tag-fight':'#fff3e8','tag-rock':'#f3ede4','tag-normal':'#f5f5f5','tag-fire':'#fff0ef','tag-water':'#eef5ff','tag-grass':'#eefbef'};
  return map[cls] || '#f5f5f5';
}

// ================ BOSS详情 ================
function openBossDetail(id) {
  const boss = BOSS_DATA.find(b => b.id === id);
  if (!boss) return;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const detail = document.getElementById('pageDetail');
  document.getElementById('navBack').classList.add('show');
  document.getElementById('navTitle').textContent = boss.name;
  document.querySelector('.tabbar').style.display = 'none';
  const stars = Array.from({length:5}, (_, i) => `<span style="font-size:14px">${i < boss.difficulty ? '&#9733;' : '&#9734;'}</span>`).join('');
  // 从方案中提取精灵名（去掉等级括号等修饰）
  function extractPetName(petStr) {
    return petStr.replace(/\(.*?\)/g,'').replace(/（.*?）/g,'').trim().split('+')[0].trim();
  }
  detail.innerHTML = `
    <div class="detail-banner">
      <div class="detail-banner-img">${petImgTag(boss.name, 88, boss.emoji, 'boss-banner-img')}</div>
      <div class="detail-boss-name">${boss.name}</div>
      <div class="detail-boss-sub">${boss.category} | ${boss.chapter} | 难度: ${stars}</div>
      <div class="detail-info-row"><div class="detail-info-item">${gIcon('location',14)} ${boss.location}</div><div class="detail-info-item">${gIcon('battleOpen',14)} ${boss.type}</div><div class="detail-info-item">${gIcon('chest',14)} ${boss.drop}</div></div>
    </div>
    <div class="detail-section"><div class="detail-section-title">${gIcon('questLost',16)} 解锁条件</div><div style="font-size:12px;color:#555;line-height:1.6">${boss.unlock}</div></div>
    <div class="detail-section"><div class="detail-section-title">${gIcon('battleOpen',16)} BOSS技能机制</div>${boss.mechanisms.map(m => `<div class="mechanism-item"><span class="mechanism-icon">${m.icon}</span><span>${m.text}</span></div>`).join('')}</div>
    <div class="detail-section"><div class="detail-section-title">${gIcon('battleSpy',16)} 通关方案 (${boss.solutions.length}种)</div>
      ${boss.solutions.map((s, i) => {
        const petName = extractPetName(s.pet);
        return `
        <div class="solution-card ${i===0?'expanded':''}" id="sol_${id}_${i}">
          <div class="solution-header" onclick="toggleSolution('sol_${id}_${i}')">
            <div class="solution-num s${i+1}">${i+1}</div>
            <div class="solution-title">${s.title} ${s.recommended?'<span class="badge badge-hot">推荐</span>':''}</div>
            <div class="solution-rate">${s.rate}</div><div class="solution-arrow">&#9660;</div>
          </div>
          <div class="solution-body">
            <div class="sol-pet-showcase">
              ${petImgTag(petName, 64, '🐾', 'sol-pet-img')}
              <div class="sol-pet-info"><div style="font-size:13px;font-weight:700;color:#2c3e50;">${s.pet}</div><div style="font-size:11px;color:#999;margin-top:2px;">主力精灵</div></div>
            </div>
            <div class="sol-info-grid">
              <div class="sol-info-box"><div class="sol-info-label">预计回合</div><div class="sol-info-value">${s.rounds}</div></div>
              <div class="sol-info-box"><div class="sol-info-label">成功率</div><div class="sol-info-value" style="color:#27ae60">${s.rate}</div></div>
              <div class="sol-info-box" style="grid-column:span 2"><div class="sol-info-label">技能配置</div><div class="sol-info-value">${s.skill}</div></div>
              <div class="sol-info-box" style="grid-column:span 2"><div class="sol-info-label">所需准备</div><div class="sol-info-value">${s.prepare}</div></div>
            </div>
            <div style="font-size:12px;font-weight:600;color:#2c3e50;margin-bottom:8px;">${gIcon('questTale',14)} 详细战术步骤</div>
            <div class="sol-steps">${s.steps.map(step => `<div class="sol-step">${step}</div>`).join('')}</div>
            <div class="sol-pros-cons"><div class="sol-pros">&#128077; ${s.pros}</div><div class="sol-cons">&#128078; ${s.cons}</div></div>
          </div>
        </div>`;
      }).join('')}
    </div>`;
  detail.classList.add('active');
  detail.scrollTop = 0; window.scrollTo(0, 0);
}

function toggleSolution(id) { document.getElementById(id).classList.toggle('expanded'); }

// ================ 精灵图鉴 ================
function renderDexTypeTabs() {
  const types = ["all","火系","水系","草系","电系","冰系","龙系","光系","恶系","幽系","翼系","机械系","虫系","武系","萌系","毒系","地系","普通系","幻系"];
  const el = document.getElementById('dexTypeTabs');
  const typeCounts = {};
  DEX_DATA.forEach(d => { petTypes(d).forEach(t => { typeCounts[t] = (typeCounts[t]||0)+1; }); });
  el.innerHTML = types.map(t => {
    const isAll = t === "all";
    const tc = isAll ? null : TYPE_COLORS[t];
    const count = isAll ? DEX_DATA.length : (typeCounts[t]||0);
    const style = isAll ? '' : `color:${tc.c};border-color:${tc.c}44;`;
    const label = isAll ? `全部 ${count}` : `${attrIconTag(t,14)} ${t} <span class="type-count">${count}</span>`;
    return `<div class="dex-type-tag ${t===currentDexType?'active':''}" style="${style}" onclick="selectDexType('${t}',this)">${label}</div>`;
  }).join('');
}

function selectDexType(t, el) {
  currentDexType = t;
  document.querySelectorAll('#dexTypeTabs .dex-type-tag').forEach(e => e.classList.remove('active'));
  el.classList.add('active');
  renderDexList();
}

// ================ 进化阶段筛选 ================
function selectDexEvo(evo, el) {
  currentDexEvo = evo;
  document.querySelectorAll('.dex-evo-tab').forEach(e => e.classList.remove('active'));
  el.classList.add('active');
  renderDexList();
}

function getEvoStage(pet) {
  const e = (pet.e || '').toLowerCase();
  if (e.includes('终阶') || e.includes('最终') || pet.s >= 5) return 'final';
  if (e.includes('二阶') || e.includes('中阶') || e.includes('→')) return 'stage2';
  if (e.includes('一阶') || e.includes('初阶') || e.includes('基础')) return 'stage1';
  // 如果没有进化信息或不可进化
  if (!pet.e || pet.e === '不可进化' || pet.e === '无' || pet.e.includes('不可')) return 'noevo';
  // 通过星级推测
  if (pet.s >= 4) return 'final';
  if (pet.s >= 3) return 'stage2';
  return 'stage1';
}

// ================ 排序 ================
function toggleDexSort() {
  const popup = document.getElementById('dexSortPopup');
  if (popup) { popup.classList.toggle('show'); return; }
  const sortOpts = [
    {id:'no',label:'编号'},
    {id:'sv',label:'种族值总和'},
    {id:'name',label:'名称'},
    {id:'hp',label:'生命'},
    {id:'atk',label:'物攻'},
    {id:'matk',label:'魔攻'},
    {id:'def',label:'物防'},
    {id:'mdef',label:'魔防'},
    {id:'spd',label:'速度'}
  ];
  const div = document.createElement('div');
  div.id = 'dexSortPopup';
  div.className = 'dex-sort-popup show';
  div.innerHTML = `<div class="dex-sort-title">排序方式 <span style="font-size:10px;color:#999;font-weight:400;">(点击切换升/降序)</span></div>
    <div class="dex-sort-grid">${sortOpts.map(o => 
      `<div class="dex-sort-btn ${currentDexSort===o.id?'active':''}" onclick="applyDexSort('${o.id}')">${o.label}${currentDexSort===o.id?(currentDexSortDir==='asc'?' ↑':' ↓'):''}</div>`
    ).join('')}</div>`;
  document.querySelector('#pageDex').appendChild(div);
  // 点其他地方关闭
  setTimeout(() => {
    document.addEventListener('click', function closeSortPopup(e) {
      if (!e.target.closest('.dex-sort-popup') && !e.target.closest('.dex-tool-btn')) {
        div.remove();
        document.removeEventListener('click', closeSortPopup);
      }
    });
  }, 100);
}

function applyDexSort(field) {
  if (currentDexSort === field) {
    currentDexSortDir = currentDexSortDir === 'asc' ? 'desc' : 'asc';
  } else {
    currentDexSort = field;
    currentDexSortDir = field === 'no' || field === 'name' ? 'asc' : 'desc';
  }
  const sortLabel = document.getElementById('dexSortLabel');
  const labels = {no:'编号',sv:'种族值',name:'名称',hp:'HP',atk:'物攻',matk:'魔攻',def:'物防',mdef:'魔防',spd:'速度'};
  if (sortLabel) sortLabel.textContent = labels[field] + (currentDexSortDir==='asc'?'↑':'↓');
  const popup = document.getElementById('dexSortPopup');
  if (popup) popup.remove();
  renderDexList();
}

// ================ 视图切换 ================
function switchDexView(view) {
  currentDexView = view;
  document.querySelectorAll('.dex-view-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(view === 'card' ? 'dexViewCard' : 'dexViewTable').classList.add('active');
  renderDexList();
}

// ================ 模糊搜索引擎 ================
let _dexSearchTimer = null;
function debounceDexSearch() {
  clearTimeout(_dexSearchTimer);
  _dexSearchTimer = setTimeout(renderDexList, 200);
}
// 关键词关联表：用户输入关键词 → 匹配更多维度
const SEARCH_ALIAS = {
  "输出":"输出,物攻,特攻,爆发,高伤",
  "治疗":"治疗,回复,奶妈,治愈,回血",
  "坦克":"坦克,防御,肉盾,扛伤,物防,护盾",
  "控制":"控制,催眠,冰冻,麻痹,睡眠,石化",
  "毒":"毒系,中毒,毒耗,毒雾,嘟嘟",
  "速攻":"速攻,先手,秒杀,高速",
  "跑图":"跑图,坐骑,滑翔,飞行,骑乘",
  "前期":"前期,开荒,新手,入门",
  "后期":"后期,终阶,传说,毕业",
  "传说":"传说,SSR,5星",
  "免费":"免费,赠送,零氪,野外捕捉",
  "进化":"进化,超进化",
  "隐藏":"隐藏,彩蛋,秘密",
  "aoe":"AOE,范围,全体",
  "dot":"DOT,灼烧,中毒,持续伤害",
  "pvp":"PVP,竞技,对战",
  "pve":"PVE,BOSS,副本"
};

// 角色/用途标签（从战斗数据中提取）
function getDexSearchTags(petName) {
  const cb = (typeof PET_COMBAT !== 'undefined') ? PET_COMBAT[petName] : null;
  if (!cb) return '';
  return [cb.role, ...(cb.tags||[])].join(' ');
}

// 技能名搜索
function getDexSkillNames(petName) {
  const sd = (typeof PET_SKILLS_DB !== 'undefined') ? PET_SKILLS_DB[petName] : null;
  if (!sd || !sd.skills) return '';
  return sd.skills.map(s => s.name).join(' ');
}

function fuzzySearchDex(list, query) {
  // 展开别名
  let expandedTerms = [query];
  Object.entries(SEARCH_ALIAS).forEach(([key, val]) => {
    if (key.includes(query) || query.includes(key)) {
      expandedTerms.push(...val.split(',').map(s=>s.trim().toLowerCase()));
    }
  });
  expandedTerms = [...new Set(expandedTerms)];
  
  // 多字拆分（输入"火系输出"拆成["火系","输出"]）
  const subTerms = query.length >= 2 ? [query] : [query];
  if (query.length >= 2) {
    // 尝试逐字拆分
    for (let i = 0; i < query.length; i++) {
      subTerms.push(query[i]);
    }
  }
  
  // 评分匹配
  const scored = list.map(d => {
    let score = 0;
    const name = d.n.toLowerCase();
    const type = petTypeLabel(d).toLowerCase();
    const evo = (d.e||'').toLowerCase();
    const how = (d.h||'').toLowerCase();
    const obtain = (d.o||'').toLowerCase();
    const trait = (d.tr||'').toLowerCase();
    const tags = getDexSearchTags(d.n).toLowerCase();
    const skills = getDexSkillNames(d.n).toLowerCase();
    const all = name + ' ' + type + ' ' + evo + ' ' + how + ' ' + obtain + ' ' + trait + ' ' + tags + ' ' + skills;
    
    // 精确名称匹配（最高优先级）
    if (name === query) score += 100;
    else if (name.startsWith(query)) score += 80;
    else if (name.includes(query)) score += 60;
    
    // 编号匹配
    if (String(d.no) === query) score += 90;
    else if (String(d.no).includes(query)) score += 30;
    
    // 属性匹配
    if (type.includes(query)) score += 50;
    
    // 获取方式匹配
    if (obtain.includes(query)) score += 25;
    if (how.includes(query)) score += 20;
    
    // 进化信息匹配
    if (evo.includes(query)) score += 20;
    
    // 角色/标签匹配
    if (tags && tags.includes(query)) score += 35;
    
    // 技能名匹配
    if (skills && skills.includes(query)) score += 30;
    
    // 别名展开匹配
    expandedTerms.forEach(term => {
      if (term !== query && all.includes(term)) score += 15;
    });
    
    // 单字逐字匹配（输入"火猫"→同时含"火"和"猫"）
    if (query.length >= 2) {
      const chars = [...query];
      const allMatch = chars.every(ch => all.includes(ch));
      if (allMatch) score += 40;
    }
    
    return {d, score};
  }).filter(x => x.score > 0);
  
  // 按分数降序排列
  scored.sort((a,b) => b.score - a.score);
  return scored.map(x => x.d);
}

function renderDexList() {
  const search = (document.getElementById('dexSearch').value || '').trim().toLowerCase();
  let list = DEX_DATA.slice();
  
  // 属性筛选
  if (currentDexType !== "all") list = list.filter(d => petHasType(d, currentDexType));
  
  // 进化阶段筛选
  if (currentDexEvo !== "all") list = list.filter(d => getEvoStage(d) === currentDexEvo);
  
  // 搜索
  if (search) list = fuzzySearchDex(list, search);
  
  // 排序
  if (!search) { // 搜索时保持分数排序
    const dir = currentDexSortDir === 'asc' ? 1 : -1;
    list.sort((a, b) => {
      let va, vb;
      switch(currentDexSort) {
        case 'sv': va = a.sv||0; vb = b.sv||0; break;
        case 'name': return dir * a.n.localeCompare(b.n, 'zh');
        case 'hp': va = a.st?a.st.hp:0; vb = b.st?b.st.hp:0; break;
        case 'atk': va = a.st?a.st.atk:0; vb = b.st?b.st.atk:0; break;
        case 'matk': va = a.st?a.st.matk:0; vb = b.st?b.st.matk:0; break;
        case 'def': va = a.st?a.st.def:0; vb = b.st?b.st.def:0; break;
        case 'mdef': va = a.st?a.st.mdef:0; vb = b.st?b.st.mdef:0; break;
        case 'spd': va = a.st?a.st.spd:0; vb = b.st?b.st.spd:0; break;
        default: va = a.no; vb = b.no;
      }
      return dir * (va - vb);
    });
  }
  
  document.getElementById('dexCount').textContent = `${list.length} / ${DEX_DATA.length} 只精灵`;
  const el = document.getElementById('dexList');
  if (!list.length) { el.innerHTML = '<div style="text-align:center;padding:40px;color:#bbb;font-size:13px;">没有找到匹配的精灵</div>'; return; }
  
  _dexFullList = list;
  _dexPage = 0;
  el.innerHTML = '';
  
  if (currentDexView === 'table') {
    renderDexTable();
  } else {
    loadMoreDex();
  }
}

let _dexFullList = [];
let _dexPage = 0;
const DEX_PAGE_SIZE = 30;

function loadMoreDex() {
  const el = document.getElementById('dexList');
  const start = _dexPage * DEX_PAGE_SIZE;
  const batch = _dexFullList.slice(start, start + DEX_PAGE_SIZE);
  if (!batch.length) return;
  
  const oldBtn = document.getElementById('dexLoadMore');
  if (oldBtn) oldBtn.remove();
  
  const html = batch.map(d => {
    const tc = TYPE_COLORS[petMainType(d)] || TYPE_COLORS["普通系"];
    const typeTagsStr = petTypes(d).map(t => { const c = TYPE_COLORS[t]||TYPE_COLORS["普通系"]; return `<span class="boss-tag" style="background:${c.bg};color:${c.c};font-size:10px;display:inline-flex;align-items:center;gap:2px">${attrIconTag(t,12)} ${t}</span>`; }).join(' ');
    const stars = '&#9733;'.repeat(d.s) + '&#9734;'.repeat(5-d.s);
    const traitStr = d.tr ? `<div style="font-size:9px;color:#888;margin-top:2px;max-width:160px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${d.tr}">&#128161; ${d.tr}</div>` : '';
    return `<div class="dex-card" onclick="openDexDetail(${d.no})"><div class="dex-no" style="background:${tc.bg};color:${tc.c};overflow:hidden;padding:0;">${petImgTag(d.n,48,tc.e)}</div><div class="dex-info"><div class="dex-name">${d.n}${d.s>=5?' <span class="badge badge-hot" style="font-size:9px">&#11088;</span>':''}</div><div class="dex-sub">${d.e}</div>${traitStr}</div><div style="text-align:right">${typeTagsStr}${d.sv?'<div style="font-size:10px;color:#888;margin-top:2px">种族值 <b style="color:#333">'+d.sv+'</b></div>':''}<div style="margin-top:2px;font-size:10px;color:#f1c40f">${stars}</div></div></div>`;
  }).join('');
  
  el.insertAdjacentHTML('beforeend', html);
  _dexPage++;
  
  const remaining = _dexFullList.length - _dexPage * DEX_PAGE_SIZE;
  if (remaining > 0) {
    el.insertAdjacentHTML('beforeend', `<div id="dexLoadMore" class="dex-load-more" onclick="loadMoreDex()">加载更多 (剩余${remaining}只) &#9660;</div>`);
  }
}

// ================ 表格视图渲染 ================
function renderDexTable() {
  const el = document.getElementById('dexList');
  const sortArrow = (field) => `<span class="sort-arrow">${currentDexSort===field?(currentDexSortDir==='asc'?'▲':'▼'):'◆'}</span>`;
  
  let html = `<table class="dex-table"><thead><tr>
    <th onclick="applyDexSort('no')" class="${currentDexSort==='no'?'sorted':''}">No.${sortArrow('no')}</th>
    <th>名称</th>
    <th>属性</th>
    <th onclick="applyDexSort('sv')" class="${currentDexSort==='sv'?'sorted':''}">种族值${sortArrow('sv')}</th>
    <th onclick="applyDexSort('spd')" class="${currentDexSort==='spd'?'sorted':''}">速度${sortArrow('spd')}</th>
    <th>特性</th>
  </tr></thead><tbody>`;
  
  _dexFullList.forEach(d => {
    const tc = TYPE_COLORS[petMainType(d)] || TYPE_COLORS["普通系"];
    const typeStr = petTypes(d).map(t => { const c = TYPE_COLORS[t]||TYPE_COLORS["普通系"]; return `<span style="display:inline-block;padding:1px 4px;border-radius:3px;font-size:9px;background:${c.bg};color:${c.c}">${t.replace('系','')}</span>`; }).join(' ');
    html += `<tr onclick="openDexDetail(${d.no})">
      <td style="color:${tc.c};font-weight:600">${String(d.no).padStart(3,'0')}</td>
      <td class="td-name">${d.n}</td>
      <td>${typeStr}</td>
      <td class="td-sv" style="color:${(d.sv||0)>=580?'#e74c3c':(d.sv||0)>=500?'#f39c12':'#333'}">${d.sv||'-'}</td>
      <td>${d.st?d.st.spd:'-'}</td>
      <td class="td-trait" title="${d.tr||''}">${d.tr?d.tr.substring(0,20)+(d.tr.length>20?'...':''):'-'}</td>
    </tr>`;
  });
  
  html += '</tbody></table>';
  el.innerHTML = html;
}

function openDexDetail(no) {
  const pet = DEX_DATA.find(d => d.no === no);
  if (!pet) return;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const detail = document.getElementById('pageDexDetail');
  document.getElementById('navBack').classList.add('show');
  document.getElementById('navTitle').textContent = pet.n;
  document.querySelector('.tabbar').style.display = 'none';
  
  const tc = petTC(pet);
  const stars = Array.from({length:5}, (_, i) => `<span style="font-size:16px;color:${i<pet.s?'#f1c40f':'#ddd'}">${i<pet.s?'&#9733;':'&#9734;'}</span>`).join('');
  
  // 获取技能数据
  const skillData = (typeof PET_SKILLS_DB !== 'undefined') ? PET_SKILLS_DB[pet.n] : null;
  const skills = skillData ? skillData.skills : ((typeof generateDefaultSkills !== 'undefined') ? generateDefaultSkills(pet) : []);
  const builds = skillData ? skillData.builds : null;
  const guideItems = skillData ? skillData.guide : null;
  const hasDetailedSkills = !!skillData;
  
  // 技能按类型分组+折叠菜单
  const skillGroups = { "物": [], "魔": [], "防": [], "状": [] };
  skills.forEach(sk => {
    const key = sk.t || "状";
    if (!skillGroups[key]) skillGroups[key] = [];
    skillGroups[key].push(sk);
  });
  // 组内按威力降序
  Object.values(skillGroups).forEach(arr => arr.sort((a, b) => (b.w||0) - (a.w||0)));
  
  const skillGroupOrder = ["物", "魔", "防", "状"];
  const skillsHtml = skillGroupOrder.map(groupKey => {
    const groupSkills = skillGroups[groupKey];
    if (!groupSkills || !groupSkills.length) return '';
    const cc = SKILL_CAT[groupKey] || SKILL_CAT["状"];
    const recCount = groupSkills.filter(s => s.rec).length;
    const gid = `sklGrp_${pet.no}_${groupKey}`;
    const cardsHtml = groupSkills.map(sk => {
      return `<div class="dex-skill-card"><div class="dex-skill-icon" style="background:${cc.bg}">${skillImgLazy(sk.n, 24)}<span class="skill-icon-fallback" style="display:none;width:24px;height:24px;align-items:center;justify-content:center;color:${cc.c}">${cc.svg}</span></div><div class="dex-skill-info"><div class="dex-skill-name">${sk.n}${sk.rec?'<span class="dex-skill-rec">推荐</span>':''}</div><div class="dex-skill-desc">${sk.w>0?'威力 <b>'+sk.w+'</b> | ':''}${sk.c>0?'能耗 '+sk.c+' | ':''}${sk.d||''}</div></div></div>`;
    }).join('');
    return `<div class="skill-group">
      <div class="skill-group-header" onclick="toggleSkillGroup('${gid}')">
        <div class="skill-group-left">${cc.svg}<span class="skill-group-title" style="color:${cc.c}">${cc.label}</span><span class="skill-group-count">${groupSkills.length}个${recCount?' · '+recCount+'推荐':''}</span></div>
        <span class="skill-group-arrow" id="${gid}_arrow">&#9660;</span>
      </div>
      <div class="skill-group-body" id="${gid}" style="display:none">${cardsHtml}</div>
    </div>`;
  }).join('');
  
  // 推荐配招方案(多套)
  const recHtml = builds ? `
    <div class="detail-section">
      <div class="detail-section-title">${gIcon('battleOpen',16)} 推荐配招方案 (${builds.length}套)</div>
      ${builds.map((b,i) => `
        <div class="dex-build-card ${i===0?'dex-build-rec':''}">
          <div class="dex-build-header">${i===0?gIcon('starGold',14)+' ':gIcon('questTale',14)+' '}${b.name}</div>
          <div class="dex-build-skills">${b.skills.map(s => `<span class="dex-build-skill">${s}</span>`).join('<span class="dex-build-sep">+</span>')}</div>
          <div class="dex-build-desc">${b.desc}</div>
        </div>`).join('')}
    </div>` : '';
  
  // 培养攻略
  const guideHtml = guideItems ? `
    <div class="detail-section">
      <div class="detail-section-title">${gIcon('guide',16)} 培养攻略</div>
      <div class="dex-guide-card">
        ${guideItems.map(g => `<div class="dex-guide-item">${g}</div>`).join('')}
      </div>
    </div>` : '';
  
  detail.innerHTML = `
    <div class="detail-banner" style="background:linear-gradient(135deg,${tc.c},${tc.c}88)">
      <div class="detail-banner-img">${petImgTag(pet.n, 96, tc.e, 'dex-banner-img')}</div>
      <div class="detail-boss-name">#${String(pet.no).padStart(3,'0')} ${pet.n}</div>
      <div class="detail-boss-sub">${petTypeTags(pet)} ${stars}</div>
      <div class="detail-info-row">
        <div class="detail-info-item">${gIcon('gather',14)} ${pet.o}</div>
        <div class="detail-info-item">${gIcon('sparkGreen',14)} ${pet.e}</div>
      </div>
    </div>
    <div class="detail-section">
      <div class="detail-section-title">${gIcon('fruit',16)} 形态图鉴</div>
      <div class="form-gallery">
        <div class="form-gallery-item" onclick="openFormModal(${pet.no},'normal')">
          <div class="form-gallery-img" style="background:linear-gradient(135deg,${tc.bg},#fff);">
            ${petImgTag(pet.n, 80, tc.e, 'form-thumb')}
          </div>
          <div class="form-gallery-label">${gIcon('dex',12)} 普通</div>
        </div>
        <div class="form-gallery-item" onclick="openFormModal(${pet.no},'shiny')">
          <div class="form-gallery-img form-gallery-shiny" style="background:linear-gradient(135deg,#fff8e0,#ffe0a0);">
            <img class="pet-img form-thumb" src="${getPetShinyUrl(pet.n)}" alt="${pet.n} 异色" style="width:80px;height:80px;object-fit:contain;border-radius:10px;" loading="lazy" onerror="this.style.display='none'">
          </div>
          <div class="form-gallery-label">${gIcon('starGold',12)} 异色</div>
        </div>
        <div class="form-gallery-item" onclick="openFormModal(${pet.no},'dazzle')">
          <div class="form-gallery-img form-gallery-dazzle" style="background:linear-gradient(135deg,#ffe0ef,#e0f0ff,#e8ffe0);">
            <img class="pet-img form-thumb" src="${getPetDazzleUrl(pet.n)}" alt="${pet.n} 炫彩" style="width:80px;height:80px;object-fit:contain;border-radius:10px;" loading="lazy" onerror="this.style.display='none'">
            <div class="dazzle-overlay" style="border-radius:12px;"></div>
          </div>
          <div class="form-gallery-label">${gIcon('sparkPurple',12)} 炫彩</div>
        </div>
      </div>
    </div>
    <div class="detail-section">
      <div class="detail-section-title">${gIcon('dex',16)} 基本信息</div>
      <div class="sol-info-grid">
        <div class="sol-info-box"><div class="sol-info-label">属性</div><div class="sol-info-value">${petTypeTags(pet)}</div></div>
        <div class="sol-info-box"><div class="sol-info-label">稀有度</div><div class="sol-info-value">${stars}</div></div>
        <div class="sol-info-box"><div class="sol-info-label">获取类型</div><div class="sol-info-value">${pet.o}</div></div>
        <div class="sol-info-box"><div class="sol-info-label">进化信息</div><div class="sol-info-value">${pet.e}</div></div>
        ${pet.sv ? `<div class="sol-info-box"><div class="sol-info-label">种族值</div><div class="sol-info-value" style="font-size:18px;font-weight:700;color:${tc.c}">${pet.sv}</div></div>` : ''}
      </div>
      ${petTraitHtml(pet)}
      ${petStatsHtml(pet)}
      </div>
    </div>
    <div class="detail-section">
      <div class="detail-section-title">${pet.h && pet.h.startsWith('\u{1F512}') ? '\u{1F512} 获取方式（隐藏精灵）' : '\u{1F4CD} 获取方式'}</div>
      <div class="how-to-get-card ${pet.h && pet.h.startsWith('\u{1F512}') ? 'how-hidden' : (pet.o === '进化' ? 'how-evo' : 'how-normal')}">
        <div class="how-to-get-text">${pet.h || pet.o}</div>
      </div>
    </div>
    <div class="detail-section">
      <div class="detail-section-title">${gIcon('skillDex',16)} 技能列表 ${hasDetailedSkills?'<span style="font-size:10px;color:#27ae60;font-weight:400;">'+gIcon('starGold',10)+' 详细数据</span>':'<span style="font-size:10px;color:#999;font-weight:400;">通用参考</span>'}</div>
      <div class="dex-skills-section">${skillsHtml}</div>
    </div>
    ${recHtml}
    ${guideHtml}
    <div class="detail-section">
      <div class="detail-section-title">${gIcon('typeChart',16)} 属性克制关系</div>
      ${petTypes(pet).map(t => renderTypeRelation(t)).join('')}
    </div>
    <div class="dex-nav-bar">
      ${pet.no > 1 ? `<div class="dex-nav-btn" onclick="openDexDetail(${pet.no-1})">&#9664; #${String(pet.no-1).padStart(3,'0')} ${(DEX_DATA.find(d=>d.no===pet.no-1)||{n:''}).n}</div>` : '<div></div>'}
      <div class="dex-nav-center">
        <div style="font-size:10px;color:#999;">种族值排名</div>
        <div style="font-size:16px;font-weight:700;color:#4a6cf7;">#${getSvRank(pet)}</div>
      </div>
      ${pet.no < DEX_DATA.length ? `<div class="dex-nav-btn" onclick="openDexDetail(${pet.no+1})">${(DEX_DATA.find(d=>d.no===pet.no+1)||{n:''}).n} #${String(pet.no+1).padStart(3,'0')} &#9654;</div>` : '<div></div>'}
    </div>`;
  detail.classList.add('active');
  detail.scrollTop = 0; window.scrollTo(0, 0);
}

function getSvRank(pet) {
  if (!pet.sv) return '-';
  const sorted = DEX_DATA.filter(d => d.sv > 0).sort((a, b) => b.sv - a.sv);
  const idx = sorted.findIndex(d => d.no === pet.no);
  return idx >= 0 ? idx + 1 : '-';
}

function toggleSkillGroup(id) {
  const body = document.getElementById(id);
  const arrow = document.getElementById(id + '_arrow');
  if (!body) return;
  if (body.style.display === 'none') {
    body.style.display = 'block';
    if (arrow) arrow.innerHTML = '&#9650;';
    body.parentElement.classList.add('skill-group-open');
    // 触发懒加载
    if (typeof observeSkillIcons === 'function') setTimeout(observeSkillIcons, 50);
  } else {
    body.style.display = 'none';
    if (arrow) arrow.innerHTML = '&#9660;';
    body.parentElement.classList.remove('skill-group-open');
  }
}

// ================ 形态图鉴二级窗口 ================
function openFormModal(no, initForm) {
  const pet = DEX_DATA.find(d => d.no === no);
  if (!pet) return;
  const tc = petTC(pet);
  const imgUrl = getPetImgUrl(pet.n);
  const shinyUrl = getPetShinyUrl(pet.n);
  const dazzleUrl = getPetDazzleUrl(pet.n);
  
  // 移除已有modal
  const old = document.getElementById('formModal');
  if (old) old.remove();
  
  const modal = document.createElement('div');
  modal.id = 'formModal';
  modal.className = 'form-modal-overlay';
  modal.onclick = function(e) { if (e.target === modal) closeFormModal(); };
  
  const imgBlock = (form, size) => {
    const s = size || 160;
    if (form === 'normal') {
      return `<img class="pet-img" src="${imgUrl}" alt="${pet.n}" style="width:${s}px;height:${s}px;object-fit:contain;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" loading="lazy"><span class="pet-img-fallback" style="display:none;width:${s}px;height:${s}px;align-items:center;justify-content:center;font-size:${Math.round(s*0.5)}px;">${tc.e}</span>`;
    } else if (form === 'shiny') {
      return `<img class="pet-img" src="${shinyUrl}" alt="${pet.n} 异色" style="width:${s}px;height:${s}px;object-fit:contain;" onerror="this.src='${imgUrl}';this.classList.add('pet-img-shiny-fallback')" loading="lazy">`;
    } else {
      return `<div style="position:relative;display:inline-block;"><img class="pet-img" src="${dazzleUrl}" alt="${pet.n} 炫彩" style="width:${s}px;height:${s}px;object-fit:contain;" onerror="this.src='${imgUrl}';this.style.filter='saturate(1.6) brightness(1.1)'" loading="lazy"><div class="dazzle-overlay" style="border-radius:12px;"></div><div class="dazzle-sparkle" style="border-radius:12px;"></div></div>`;
    }
  };
  
  modal.innerHTML = `
    <div class="form-modal-content">
      <div class="form-modal-header">
        <div class="form-modal-title">${pet.n} 形态图鉴</div>
        <div class="form-modal-close" onclick="closeFormModal()">&#10005;</div>
      </div>
      <div class="form-modal-body">
        <div class="form-modal-card form-modal-card-normal ${initForm==='normal'?'form-modal-card-active':''}">
          <div class="form-modal-badge-row"><span class="form-modal-badge" style="background:#4a6cf7;color:#fff;">${gIcon('dex',14)} 普通形态</span></div>
          <div class="form-modal-img-area" style="background:linear-gradient(135deg,${tc.bg},#fff);">
            ${imgBlock('normal', 140)}
          </div>
          <div class="form-modal-desc form-info-normal">精灵的原始外观配色，所有精灵默认形态。</div>
        </div>
        <div class="form-modal-card form-modal-card-shiny ${initForm==='shiny'?'form-modal-card-active':''}">
          <div class="form-modal-badge-row"><span class="form-modal-badge" style="background:linear-gradient(135deg,#f39c12,#e67e22);color:#fff;">${gIcon('starGold',14)} 异色形态</span><span class="form-prob form-prob-shiny">1.8%概率</span></div>
          <div class="form-modal-img-area" style="background:linear-gradient(135deg,#fff8e0,#ffe0a0);">
            ${imgBlock('shiny', 140)}
          </div>
          <div class="form-modal-desc form-info-shiny">配色与普通版不同的稀有外观。<br>属性、技能、种族值完全一致。<br>${gIcon('questTale',12)} 野外捕捉1.8%概率，20次保底。</div>
        </div>
        <div class="form-modal-card form-modal-card-dazzle ${initForm==='dazzle'?'form-modal-card-active':''}">
          <div class="form-modal-badge-row"><span class="form-modal-badge" style="background:linear-gradient(135deg,#e74c3c,#f1c40f,#3498db);color:#fff;">${gIcon('sparkPurple',14)} 炫彩形态</span><span class="form-prob form-prob-dazzle">棱镜球专属</span></div>
          <div class="form-modal-img-area" style="background:linear-gradient(135deg,#ffe0ef,#e0f0ff,#e8ffe0);">
            ${imgBlock('dazzle', 140)}
          </div>
          <div class="form-modal-desc form-info-dazzle">棱镜球捕捉时触发五彩特效。<br>可与异色叠加获得双形态。<br>${gIcon('questTale',12)} 仅限棱镜球(100%捕捉+炫彩)。</div>
        </div>
      </div>
    </div>`;
  
  document.body.appendChild(modal);
  requestAnimationFrame(() => modal.classList.add('show'));
}

function closeFormModal() {
  const modal = document.getElementById('formModal');
  if (!modal) return;
  modal.classList.remove('show');
  setTimeout(() => modal.remove(), 250);
}

function renderTypeRelation(typeName) {
  const data = TYPE_DATA[typeName];
  if (!data) return '<div style="font-size:12px;color:#999">暂无属性数据</div>';
  function tags(arr, label) {
    if (!arr || !arr.length) return '';
    return `<div class="type-result-row"><div class="type-result-label" style="font-weight:600">${label}</div><div class="type-result-tags">${arr.map(t => {
      const td = TYPE_COLORS[t];
      return td ? `<span class="type-result-tag" style="background:${td.bg};color:${td.c};display:inline-flex;align-items:center;gap:2px">${attrIconTag(t,14)} ${t}</span>` : `<span class="type-result-tag">${t}</span>`;
    }).join('')}</div></div>`;
  }
  return tags(data.strong,gIcon('battleOpen',14)+' 克制(2x)') + tags(data.weak,gIcon('battleSpy',14)+' 被克制') + tags(data.resist,gIcon('shelter',14)+' 抵抗来自') + tags(data.resisted,gIcon('dungeon',14)+' 被抵抗');
}

// ================ 属性克制 ================
function renderTypeGrid() {
  const el = document.getElementById('typeGrid');
  el.innerHTML = Object.entries(TYPE_DATA).map(([name, data]) => {
    const tc = TYPE_COLORS[name] || {c:'#999',bg:'#f5f5f5',e:''};
    return `<div class="type-btn" style="background:${tc.bg};color:${tc.c}" onclick="selectType('${name}',this)">${attrIconTag(name,20)} ${name}</div>`;
  }).join('');
}

function selectType(name, el) {
  selectedType = name;
  document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
  const data = TYPE_DATA[name];
  const tc = TYPE_COLORS[name];
  const result = document.getElementById('typeResult');
  
  function renderTags(arr, color) {
    if (!arr || !arr.length) return '<span style="font-size:11px;color:#bbb;">无</span>';
    return arr.map(t => {
      const td = TYPE_COLORS[t];
      return `<span class="type-result-tag" style="background:${td?td.bg:'#f5f5f5'};color:${td?td.c:'#999'};display:inline-flex;align-items:center;gap:2px">${attrIconTag(t,14)} ${t}</span>`;
    }).join('');
  }
  
  result.innerHTML = `
    <div class="type-result-title">${attrIconTag(name,20)} ${name} 克制关系</div>
    <div class="type-result-row"><div class="type-result-label" style="color:#e74c3c;font-weight:600">${gIcon('battleOpen',14)} 克制(2x)</div><div class="type-result-tags">${renderTags(data.strong)}</div></div>
    <div class="type-result-row"><div class="type-result-label" style="color:#3498db;font-weight:600">${gIcon('battleSpy',14)} 被克制</div><div class="type-result-tags">${renderTags(data.weak)}</div></div>
    <div class="type-result-row"><div class="type-result-label" style="color:#27ae60;font-weight:600">${gIcon('shelter',14)} 抵抗来自</div><div class="type-result-tags">${renderTags(data.resist)}</div></div>
    <div class="type-result-row"><div class="type-result-label" style="color:#e67e22;font-weight:600">${gIcon('dungeon',14)} 被抵抗</div><div class="type-result-tags">${renderTags(data.resisted)}</div></div>
  `;
  result.classList.add('show');
}

// ================ 基础玩法指南 ================
function renderGuideList() {
  const el = document.getElementById('guideList');
  el.innerHTML = GUIDE_DATA.map((g, gi) => `
    <div class="guide-card" style="border-left-color:${g.color}">
      <div class="guide-header" onclick="toggleGuide('guide_${gi}')">
        <span style="font-size:20px">${g.icon}</span>
        <span class="guide-title">${g.title}</span>
        <span class="solution-arrow" id="guide_arrow_${gi}">&#9660;</span>
      </div>
      <div class="guide-body" id="guide_${gi}" style="display:${gi<2?'block':'none'}">
        ${g.items.map(item => `
          <div class="guide-item">
            <div class="guide-item-sub">${item.sub}</div>
            <div class="guide-item-text">${item.text}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function toggleGuide(id) {
  const el = document.getElementById(id);
  el.style.display = el.style.display === 'none' ? 'block' : 'none';
}

// ================ 精灵阵容推荐 ================
let currentTeamCat = "赛季强力";

function renderTeamCatTabs() {
  const el = document.getElementById('teamCatTabs');
  if (!el) return;
  el.innerHTML = TEAM_DATA.categories.map(c => 
    `<div class="team-cat-tab ${c === currentTeamCat ? 'active' : ''}" onclick="selectTeamCat('${c}',this)">${c}</div>`
  ).join('');
}

function selectTeamCat(cat, el) {
  currentTeamCat = cat;
  document.querySelectorAll('#teamCatTabs .team-cat-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  renderTeamList();
}

function renderPetList() {
  renderTeamCatTabs();
  renderTeamList();
  renderHotPetTags();
}

// 热门精灵标签
function renderHotPetTags() {
  const el = document.getElementById('petTeamHot');
  if (!el || typeof getPopularPets === 'undefined') return;
  const hot = getPopularPets().slice(0, 12);
  el.innerHTML = '<span style="font-size:10px;color:#999;margin-right:4px;">热门:</span>' + hot.map(p =>
    `<span class="pet-hot-tag" onclick="searchTeamByPet('${p.name}')">${p.name} <span style="color:#999;font-size:9px">(${p.cnt})</span></span>`
  ).join('');
}

// 按精灵名搜索阵容
function searchTeamByPetInput() {
  const name = (document.getElementById('petTeamSearch').value || '').trim();
  if (!name) { document.getElementById('petTeamResult').innerHTML = ''; return; }
  searchTeamByPet(name);
}

function searchTeamByPet(name) {
  document.getElementById('petTeamSearch').value = name;
  const results = typeof searchTeamsByPet !== 'undefined' ? searchTeamsByPet(name) : [];
  const el = document.getElementById('petTeamResult');
  if (!results.length) {
    el.innerHTML = `<div style="text-align:center;padding:16px;color:#bbb;font-size:12px;">没有找到包含「${name}」的阵容</div>`;
    return;
  }
  el.innerHTML = `<div style="font-size:12px;color:#27ae60;font-weight:600;margin:8px 0 6px;">&#10004; 找到 ${results.length} 套包含「${name}」的阵容:</div>` +
    results.map(t => {
      const tierColor = t.tier==='T0'?'#e74c3c':t.tier==='T1'?'#f39c12':'#27ae60';
      return `<div class="pet-team-result-card" onclick="toggleTeam('${t.id}')">
        <span class="team-tier-badge" style="background:${tierColor};font-size:10px;padding:2px 6px">${t.tier}</span>
        <span style="font-size:12px;font-weight:600;color:#2c3e50;">${t.icon} ${t.name}</span>
        <span style="font-size:10px;color:#999;margin-left:4px;">${t.cat}</span>
      </div>`;
    }).join('');
}

function renderTeamList() {
  const el = document.getElementById('teamList');
  if (!el) return;
  const list = TEAM_DATA.teams.filter(t => t.cat === currentTeamCat);
  
  if (!list.length) { el.innerHTML = '<div style="text-align:center;padding:40px;color:#bbb;font-size:13px;">暂无该分类的阵容</div>'; return; }
  
  el.innerHTML = list.map(team => {
    const tierColor = team.tier === 'T0' ? '#e74c3c' : team.tier === 'T1' ? '#f39c12' : '#27ae60';
    const diffStars = Array.from({length:5}, (_, i) => `<span style="font-size:10px;color:${i<team.diff?'#f1c40f':'#ddd'}">${i<team.diff?'&#9733;':'&#9734;'}</span>`).join('');
    
    return `
    <div class="team-card" id="team_${team.id}">
      <div class="team-card-header" onclick="toggleTeam('${team.id}')">
        <div class="team-card-left">
          <div class="team-tier-badge" style="background:${tierColor}">${team.tier}</div>
          <div class="team-card-info">
            <div class="team-card-name">${team.icon} ${team.name}</div>
            <div class="team-card-sub">${team.subtitle}</div>
          </div>
        </div>
        <div class="team-card-right">
          <div class="team-card-arrow">&#9660;</div>
        </div>
      </div>
      <div class="team-card-tags">
        ${team.tags.map(t => `<span class="team-tag" style="background:${team.bg};color:${team.color}">${t}</span>`).join('')}
        <span class="team-tag" style="background:#f8f9fa;color:#666;">&#128176; ${team.cost}</span>
        <span class="team-tag" style="background:#f8f9fa;color:#666;">难度 ${diffStars}</span>
      </div>
      <div class="team-card-body">
        <div class="team-summary">${team.summary}</div>
        
        <div class="team-section-title">${gIcon('battleOpen',14)} 阵容成员 (${team.members.length}只)</div>
        <div class="team-members">
          ${team.members.map((m, mi) => {
            const tc = TYPE_COLORS[m.type] || TYPE_COLORS["普通系"];
            return `
            <div class="team-member-card">
              <div class="team-member-header">
                <div class="team-member-img" style="background:${tc.bg};overflow:hidden;padding:0;">
                  ${petImgTag(m.name, 44, tc.e)}
                </div>
                <div class="team-member-info">
                  <div class="team-member-name">${m.name}</div>
                  <div class="team-member-role"><span class="team-role-badge" style="background:${team.bg};color:${team.color}">${m.role}</span> <span class="team-member-type" style="color:${tc.c}">${attrIconTag(m.type,12)} ${m.type}</span></div>
                </div>
                <div class="team-member-num" style="background:${tc.bg};color:${tc.c}">${mi+1}</div>
              </div>
              <div class="team-member-skills">${gIcon('skillDex',12)} ${m.skills}</div>
              <div class="team-member-desc">${m.desc}</div>
            </div>`;
          }).join('')}
        </div>
        
        <div class="team-section-title">${gIcon('questTale',14)} 核心打法</div>
        <div class="team-strategy">${team.strategy}</div>
        
        <div class="team-pros-cons">
          <div class="team-pros">
            <div class="team-pc-title">&#128077; 优点</div>
            ${team.pros.map(p => `<div class="team-pc-item">${p}</div>`).join('')}
          </div>
          <div class="team-cons">
            <div class="team-pc-title">&#128078; 缺点</div>
            ${team.cons.map(c => `<div class="team-pc-item">${c}</div>`).join('')}
          </div>
        </div>
      </div>
    </div>`;
  }).join('');
  
  // 默认展开第一个
  if (list.length > 0) {
    const first = document.getElementById('team_' + list[0].id);
    if (first) first.classList.add('expanded');
  }
}

function toggleTeam(id) {
  const card = document.getElementById('team_' + id);
  if (!card) return;
  card.classList.toggle('expanded');
}

// ================ 活动日历 ================
let currentEventFilter = "全部";

function renderEventList() {
  const el = document.getElementById('eventList');
  
  // 优先级颜色映射
  const prioColors = {
    "必做": {bg:"#ffe0e0",c:"#d32f2f",border:"#e74c3c"},
    "每周必做": {bg:"#fff0e0",c:"#e65100",border:"#f39c12"},
    "每日必做": {bg:"#fff0e0",c:"#e65100",border:"#f39c12"},
    "推荐": {bg:"#e0f0ff",c:"#1565c0",border:"#3498db"},
    "挑战": {bg:"#f0e0ff",c:"#6a1b9a",border:"#9b59b6"},
    "日常": {bg:"#e8f5e9",c:"#2e7d32",border:"#27ae60"}
  };
  
  // 筛选标签
  const filterTabs = ["全部","必做优先","推荐活动","日常任务"];
  const filterHtml = `<div class="event-filter-tabs">
    ${filterTabs.map(f => `<div class="event-filter-tab ${f===currentEventFilter?'active':''}" onclick="filterEvents('${f}',this)">${f}</div>`).join('')}
  </div>`;
  
  // 根据筛选过滤
  function filterEvent(e) {
    if (currentEventFilter === "全部") return true;
    if (currentEventFilter === "必做优先") return e.priority === "必做" || e.priority === "每周必做" || e.priority === "每日必做";
    if (currentEventFilter === "推荐活动") return e.priority === "推荐" || e.priority === "挑战";
    if (currentEventFilter === "日常任务") return e.priority === "日常" || e.priority === "每日必做";
    return true;
  }
  
  const periodsHtml = EVENT_DATA.map(period => {
    const filteredEvents = period.events.filter(filterEvent);
    if (!filteredEvents.length) return '';
    
    const prioColor = period.priority ? (prioColors[period.priority] || prioColors["推荐"]) : null;
    const periodPrio = period.priority ? `<span class="event-period-prio" style="background:${prioColor.bg};color:${prioColor.c};border:1px solid ${prioColor.border}30">${period.priority}</span>` : '';
    
    return `
    <div class="event-period-block">
      <div class="period-title" style="border-color:${period.color}">
        ${period.period} ${periodPrio}
      </div>
      ${filteredEvents.map(e => {
        const pc = e.priority ? (prioColors[e.priority] || prioColors["推荐"]) : {bg:"#f5f5f5",c:"#999",border:"#ddd"};
        const prioTag = e.priority ? `<span class="event-prio-tag" style="background:${pc.bg};color:${pc.c};">${e.priority}</span>` : '';
        const tipsHtml = e.tips ? `<div class="event-tips"><span class="event-tips-icon">&#128161;</span><span class="event-tips-text">${e.tips}</span></div>` : '';
        return `
        <div class="event-card-v2" style="border-left-color:${period.color}">
          <div class="event-card-header">
            <div class="event-title-v2">${e.title}</div>
            ${prioTag}
          </div>
          <div class="event-time-v2">&#128337; ${e.time}</div>
          <div class="event-desc-v2">${e.desc}</div>
          <div class="event-reward-v2">&#127873; <strong>奖励:</strong> ${e.reward}</div>
          ${tipsHtml}
        </div>`;
      }).join('')}
    </div>`;
  }).join('');
  
  el.innerHTML = filterHtml + periodsHtml;
}

function filterEvents(filter, el) {
  currentEventFilter = filter;
  document.querySelectorAll('.event-filter-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  renderEventList();
}

// ================ 战力分析系统 ================
let azTeam = []; // 用户选择的精灵列表 [{no,n,t,s,...}]
let azPickerType = "全部";

// --- 精灵战斗数据库(关键精灵的隐含属性) ---
const PET_COMBAT = {
  // name: { role, power, spd, tags[], pvp, pve }
  "迪莫":     {role:"输出",power:85,spd:100,tags:["光系输出","解控","万金油"],pvp:75,pve:90},
  "火神":     {role:"输出",power:92,spd:130,tags:["AOE","高速","火系核心"],pvp:88,pve:85},
  "火花":     {role:"输出",power:55,spd:70,tags:["火系","前期"],pvp:40,pve:55},
  "焰火":     {role:"输出",power:70,spd:90,tags:["火系","中期"],pvp:55,pve:65},
  "魔力猫":   {role:"输出",power:72,spd:85,tags:["草系核心","寄生"],pvp:60,pve:70},
  "喵喵":     {role:"续航",power:40,spd:55,tags:["草系","寄生种子"],pvp:30,pve:50},
  "喵呜":     {role:"续航",power:55,spd:70,tags:["草系","中期"],pvp:40,pve:60},
  "水灵":     {role:"输出",power:68,spd:80,tags:["水系核心","防御"],pvp:55,pve:65},
  "水蓝蓝":   {role:"坦克",power:35,spd:50,tags:["水系","前期坦克"],pvp:25,pve:45},
  "波波拉":   {role:"坦克",power:50,spd:65,tags:["水系","中期"],pvp:35,pve:55},
  "嘟嘟锅":   {role:"毒耗",power:88,spd:75,tags:["毒耗核心","BOSS通杀","传说"],pvp:80,pve:98},
  "嘟嘟煲":   {role:"毒耗",power:60,spd:55,tags:["毒系","前期毒耗"],pvp:45,pve:65},
  "燃薪虫":   {role:"输出",power:90,spd:80,tags:["灼烧核心","PVE真神","DOT"],pvp:70,pve:95},
  "罗隐":     {role:"陷阱",power:82,spd:85,tags:["陷阱流","暗幕","稳定输出"],pvp:75,pve:88},
  "瞌睡王":   {role:"控制",power:65,spd:90,tags:["催眠","控制核心","减伤"],pvp:92,pve:85},
  "动力猿":   {role:"控制",power:50,spd:70,tags:["武系","中期控制"],pvp:55,pve:55},
  "白金独角兽":{role:"治疗",power:55,spd:75,tags:["治疗核心","增攻","护盾"],pvp:80,pve:85},
  "小独角兽": {role:"治疗",power:35,spd:55,tags:["治疗","前期"],pvp:40,pve:50},
  "酷拉":     {role:"秒杀",power:95,spd:135,tags:["秒杀","极速","电系核心"],pvp:95,pve:75},
  "岚鸟":     {role:"输出",power:70,spd:95,tags:["翼系","跑图","飞行克制"],pvp:60,pve:72},
  "冬羽雀":   {role:"输出",power:50,spd:70,tags:["冰系","中期"],pvp:35,pve:50},
  "雪绒鸟":   {role:"输出",power:30,spd:50,tags:["冰系","前期"],pvp:20,pve:30},
  "音速犬":   {role:"输出",power:65,spd:100,tags:["翼系","跑图坐骑"],pvp:50,pve:60},
  "护主犬":   {role:"输出",power:45,spd:75,tags:["翼系","前期坐骑"],pvp:30,pve:40},
  "圣羽翼王": {role:"输出",power:85,spd:115,tags:["翼系核心","先手","顺风"],pvp:85,pve:80},
  "恶魔狼":   {role:"输出",power:80,spd:95,tags:["恶系","恐惧","克幽灵"],pvp:82,pve:70},
  "石冠王蜥": {role:"坦克",power:60,spd:45,tags:["地系坦克","物防天花板","石化"],pvp:78,pve:75},
  "石刺蜥":   {role:"坦克",power:45,spd:40,tags:["地系","中期坦克"],pvp:40,pve:50},
  "石肤蜥":   {role:"坦克",power:30,spd:35,tags:["地系","前期坦克"],pvp:20,pve:35},
  "雪灵":     {role:"控制",power:72,spd:88,tags:["冰冻","减速","AOE控场"],pvp:85,pve:70},
  "龙息帕尔": {role:"输出",power:96,spd:90,tags:["传说","龙系核心","全属性debuff"],pvp:92,pve:88},
  "古啦多":   {role:"输出",power:88,spd:85,tags:["龙系","高爆发","龙鳞守护"],pvp:80,pve:78},
  "暮星辰":   {role:"控制",power:82,spd:92,tags:["传说","幽系","控场debuff"],pvp:88,pve:75},
  "花魁蜂后": {role:"输出",power:75,spd:78,tags:["虫系","定点输出","虫群"],pvp:65,pve:68},
  "千棘盔":   {role:"坦克",power:55,spd:40,tags:["机械系","反伤","铁壁"],pvp:75,pve:60},
  "幻影灵菇": {role:"控制",power:65,spd:80,tags:["幽系","催眠","中期控制"],pvp:60,pve:55},
  "化蝶":     {role:"输出",power:45,spd:65,tags:["虫系","前期"],pvp:30,pve:40},
  "叮叮恶魔": {role:"输出",power:50,spd:70,tags:["恶系","前期暗系"],pvp:40,pve:45},
  "水泡壳":   {role:"坦克",power:55,spd:55,tags:["水系坦克","前期防御"],pvp:40,pve:55},
  "花影羚羊": {role:"续航",power:60,spd:75,tags:["草系","中期续航"],pvp:45,pve:60},
  "布克棱岩": {role:"坦克",power:55,spd:40,tags:["地系","中期坦克"],pvp:40,pve:50},
  "卷胡巨獭": {role:"输出",power:65,spd:80,tags:["水系","中期输出"],pvp:50,pve:60},
  "晶石蜗":   {role:"输出",power:60,spd:50,tags:["光系","多形态"],pvp:45,pve:55},
  "雅丹鬃":   {role:"输出",power:70,spd:85,tags:["火系","中期"],pvp:55,pve:65},
  "春花兔":   {role:"续航",power:55,spd:70,tags:["草系","回复"],pvp:40,pve:55}
};

// 默认战斗数据（图鉴中找不到的精灵用这个）
function getDefaultCombat(pet) {
  const starPower = {1:25,2:35,3:50,4:70,5:85};
  const pw = starPower[pet.s] || 50;
  const roleGuess = pet.e && pet.e.includes("终阶") ? "输出" : "培养中";
  return {role:roleGuess, power:pw, spd:60, tags:petTypes(pet), pvp:Math.round(pw*0.7), pve:Math.round(pw*0.8)};
}

function getCombat(pet) {
  return PET_COMBAT[pet.n] || getDefaultCombat(pet);
}

// --- 初始化渲染 ---
function initAnalyzePage() {
  renderTeamSlots();
  updateAddBtn();
}

function renderTeamSlots() {
  const el = document.getElementById('azTeamSlots');
  if (!azTeam.length) {
    el.innerHTML = '<div class="az-empty-hint">&#128072; 点击下方按钮添加精灵，最多选择6只组成阵容</div>';
    return;
  }
  el.innerHTML = azTeam.map((pet, i) => {
    const tc = TYPE_COLORS[petMainType(pet)] || TYPE_COLORS["普通系"];
    const cb = getCombat(pet);
    const stars = Array.from({length:5},(_,j)=>`<span style="font-size:9px;color:${j<pet.s?'#f1c40f':'#ddd'}">${j<pet.s?'&#9733;':'&#9734;'}</span>`).join('');
    return `

    <div class="az-slot" style="border-color:${tc.c}30">
      <div class="az-slot-remove" onclick="removePet(${i})">&#10005;</div>
      <div class="az-slot-img" style="background:${tc.bg};overflow:hidden;padding:0;">
        ${petImgTag(pet.n, 44, tc.e)}
      </div>
      <div class="az-slot-info">
        <div class="az-slot-name">${pet.n}</div>
        <div class="az-slot-sub">${petTypeTags(pet)} ${stars}</div>
        <div class="az-slot-role"><span class="az-role-badge" style="background:${getRoleBg(cb.role)}">${cb.role}</span> 战力 ${cb.power}</div>
      </div>
    </div>`;
  }).join('');
}

function getRoleBg(role) {
  const m = {"输出":"#e74c3c","毒耗":"#9b59b6","控制":"#3498db","坦克":"#27ae60","治疗":"#2ecc71","秒杀":"#e67e22","陷阱":"#8e44ad","续航":"#16a085","培养中":"#95a5a6"};
  return m[role] || "#999";
}

function updateAddBtn() {
  const btn = document.getElementById('azAddBtn');
  if (azTeam.length >= 6) {
    btn.style.display = 'none';
  } else {
    btn.style.display = 'flex';
    btn.querySelector('span:last-child').textContent = `添加精灵 (${azTeam.length}/6)`;
  }
  const abtn = document.getElementById('azAnalyzeBtn');
  abtn.style.opacity = azTeam.length >= 1 ? '1' : '0.4';
  abtn.style.pointerEvents = azTeam.length >= 1 ? 'auto' : 'none';
}

function removePet(idx) {
  azTeam.splice(idx, 1);
  renderTeamSlots();
  updateAddBtn();
  document.getElementById('azResult').innerHTML = '';
}

// --- 精灵选择弹窗 ---
function openPetPicker() {
  if (azTeam.length >= 6) return;
  azPickerType = "全部";
  document.getElementById('azPetSearch').value = '';
  renderPickerTypeTabs();
  renderPickerList();
  const overlay = document.getElementById('azPickerOverlay');
  overlay.classList.add('show');
}

function closePetPicker() {
  document.getElementById('azPickerOverlay').classList.remove('show');
}

function renderPickerTypeTabs() {
  const types = ["全部","火系","水系","草系","电系","冰系","龙系","光系","恶系","幽系","翼系","机械系","虫系","武系","萌系","毒系","地系"];
  const el = document.getElementById('azPickerTypeTabs');
  el.innerHTML = types.map(t => {
    const tc = TYPE_COLORS[t];
    const style = t === "全部" ? '' : `color:${tc.c};`;
    return `<div class="az-ptype-tab ${t===azPickerType?'active':''}" style="${style}" onclick="selectPickerType('${t}',this)">${t==='全部'?'全部':(attrIconTag(t,12)+' '+t)}</div>`;
  }).join('');
}

function selectPickerType(t, el) {
  azPickerType = t;
  document.querySelectorAll('.az-ptype-tab').forEach(e=>e.classList.remove('active'));
  el.classList.add('active');
  renderPickerList();
}

function renderPickerList() {
  const search = (document.getElementById('azPetSearch').value || '').toLowerCase();
  // 只显示终阶和高阶精灵优先，过滤已选
  const selected = new Set(azTeam.map(p=>p.no));
  let list = DEX_DATA.filter(d => !selected.has(d.no));
  if (azPickerType !== "全部") list = list.filter(d => petHasType(d, azPickerType));
  if (search) list = list.filter(d => d.n.toLowerCase().includes(search));
  // 排序：星级高→低，有战斗数据的优先
  list.sort((a,b) => {
    const aCb = PET_COMBAT[a.n] ? 1 : 0;
    const bCb = PET_COMBAT[b.n] ? 1 : 0;
    if (bCb !== aCb) return bCb - aCb;
    return b.s - a.s;
  });
  
  const el = document.getElementById('azPickerList');
  if (!list.length) { el.innerHTML = '<div style="text-align:center;padding:30px;color:#bbb;font-size:13px">没有找到精灵</div>'; return; }
  el.innerHTML = list.map(d => {
    const tc = TYPE_COLORS[petMainType(d)] || TYPE_COLORS["普通系"];
    const cb = getCombat(d);
    const hasCb = PET_COMBAT[d.n] ? true : false;
    return `
    <div class="az-pick-item ${hasCb?'az-pick-featured':''}" onclick="pickPet(${d.no})">
      <div class="az-pick-img" style="background:${tc.bg};overflow:hidden;padding:0;">
        ${petImgTag(d.n, 36, tc.e)}
      </div>
      <div class="az-pick-info">
        <div class="az-pick-name">${d.n} ${hasCb?'<span style="color:#f39c12;font-size:9px">&#11088;</span>':''}</div>
        <div class="az-pick-sub">${petTypeTags(d)} ${'&#9733;'.repeat(d.s)}</div>
      </div>
      <div class="az-pick-power" style="color:${tc.c}">${cb.power}</div>
    </div>`;
  }).join('');
}

function pickPet(no) {
  if (azTeam.length >= 6) return;
  const pet = DEX_DATA.find(d => d.no === no);
  if (!pet || azTeam.find(p=>p.no===no)) return;
  azTeam.push(pet);
  renderTeamSlots();
  updateAddBtn();
  renderPickerList();
  document.getElementById('azResult').innerHTML = '';
  if (azTeam.length >= 6) closePetPicker();
}

// ================ 核心分析引擎 ================
function runAnalysis() {
  if (!azTeam.length) return;
  
  const combats = azTeam.map(p => ({pet:p, cb:getCombat(p)}));
  
  // 1. 属性覆盖分析
  const typeSet = new Set(azTeam.map(p => p.t));
  const typeArr = [...typeSet];
  const allOffTypes = new Set();
  typeArr.forEach(t => {
    const td = TYPE_DATA[t];
    if (td && td.strong) td.strong.forEach(s => allOffTypes.add(s));
  });
  const allDefWeak = new Set();
  typeArr.forEach(t => {
    const td = TYPE_DATA[t];
    if (td && td.weak) td.weak.forEach(w => allDefWeak.add(w));
  });
  const coverageScore = Math.min(allOffTypes.size / 10 * 100, 100);
  
  // 2. 角色完整度
  const roles = combats.map(c => c.cb.role);
  const hasOutput = roles.some(r => ["输出","秒杀","毒耗","陷阱"].includes(r));
  const hasControl = roles.some(r => r === "控制");
  const hasTank = roles.some(r => r === "坦克");
  const hasHeal = roles.some(r => ["治疗","续航"].includes(r));
  let roleScore = 0;
  if (hasOutput) roleScore += 35;
  if (hasControl) roleScore += 25;
  if (hasTank) roleScore += 20;
  if (hasHeal) roleScore += 20;
  
  // 3. 平均战力
  const avgPower = Math.round(combats.reduce((s,c) => s+c.cb.power, 0) / combats.length);
  const maxPower = Math.max(...combats.map(c => c.cb.power));
  const powerScore = Math.min(avgPower, 100);
  
  // 4. PVP/PVE倾向
  const avgPvp = Math.round(combats.reduce((s,c) => s+c.cb.pvp, 0) / combats.length);
  const avgPve = Math.round(combats.reduce((s,c) => s+c.cb.pve, 0) / combats.length);
  
  // 5. 速度评估
  const avgSpd = Math.round(combats.reduce((s,c) => s+c.cb.spd, 0) / combats.length);
  const spdScore = Math.min(Math.round(avgSpd / 1.3), 100);
  
  // 6. 综合评分
  const totalScore = Math.round(powerScore*0.3 + coverageScore*0.2 + roleScore*0.25 + spdScore*0.1 + (avgPvp+avgPve)/2*0.15);
  
  // 7. 评级
  const grade = totalScore >= 90 ? 'S' : totalScore >= 80 ? 'A' : totalScore >= 65 ? 'B' : totalScore >= 50 ? 'C' : 'D';
  const gradeColors = {S:'#e74c3c',A:'#f39c12',B:'#3498db',C:'#27ae60',D:'#95a5a6'};
  const gradeDescs = {
    S:'顶级阵容! 属性覆盖全面、角色完整、战力天花板，PVP/PVE均可横扫',
    A:'强力阵容! 核心输出+控制到位，大部分内容可轻松通关',
    B:'不错的阵容，有明确的核心思路，部分场景表现优秀',
    C:'中等阵容，存在明显短板，建议针对性补强',
    D:'阵容较弱，缺少核心精灵或角色不完整，建议重新搭配'
  };
  
  // 8. BOSS适配分析
  const bossMatches = analyzeBossMatch(combats, typeArr, allOffTypes);
  
  // 9. 活动适配
  const activityMatches = analyzeActivityMatch(combats, roles, avgPower);
  
  // 10. 场景推荐
  const pvpTier = avgPvp >= 85 ? 'T0' : avgPvp >= 70 ? 'T1' : avgPvp >= 55 ? 'T2' : 'T3';
  const pveTier = avgPve >= 85 ? 'T0' : avgPve >= 70 ? 'T1' : avgPve >= 55 ? 'T2' : 'T3';
  
  // 11. 优化建议
  const suggestions = generateSuggestions(combats, roles, typeArr, allDefWeak, hasOutput, hasControl, hasTank, hasHeal);
  
  // --- 渲染分析报告 ---
  const el = document.getElementById('azResult');
  el.innerHTML = `
  <div class="az-report">
    <!-- 总评分 -->
    <div class="az-grade-card">
      <div class="az-grade-circle" style="border-color:${gradeColors[grade]}">
        <div class="az-grade-letter" style="color:${gradeColors[grade]}">${grade}</div>
        <div class="az-grade-score">${totalScore}分</div>
      </div>
      <div class="az-grade-info">
        <div class="az-grade-title">阵容评级: <span style="color:${gradeColors[grade]};font-size:20px">${grade}级</span></div>
        <div class="az-grade-desc">${gradeDescs[grade]}</div>
      </div>
    </div>
    
    <!-- 六维雷达数据 -->
    <div class="az-section">
      <div class="az-section-title">&#128202; 维度评分</div>
      <div class="az-radar-bars">
        ${renderBar('战力强度', powerScore, '#e74c3c')}
        ${renderBar('属性覆盖', coverageScore, '#f39c12')}
        ${renderBar('角色完整', roleScore, '#3498db')}
        ${renderBar('速度评级', spdScore, '#9b59b6')}
        ${renderBar('PVP能力', avgPvp, '#e67e22')}
        ${renderBar('PVE能力', avgPve, '#27ae60')}
      </div>
    </div>
    
    <!-- PVP/PVE定位 -->
    <div class="az-section">
      <div class="az-section-title">&#127919; 场景定位</div>
      <div class="az-scene-grid">
        <div class="az-scene-card">
          <div class="az-scene-icon">&#9876;</div>
          <div class="az-scene-label">PVP竞技</div>
          <div class="az-scene-tier" style="color:${pvpTier==='T0'?'#e74c3c':pvpTier==='T1'?'#f39c12':'#999'}">${pvpTier}</div>
          <div class="az-scene-score">${avgPvp}分</div>
          <div class="az-scene-desc">${pvpTier==='T0'?'竞技场统治级':pvpTier==='T1'?'竞技场强势':pvpTier==='T2'?'竞技场一般':'竞技场较弱'}</div>
        </div>
        <div class="az-scene-card">
          <div class="az-scene-icon">&#128163;</div>
          <div class="az-scene-label">PVE挑战</div>
          <div class="az-scene-tier" style="color:${pveTier==='T0'?'#e74c3c':pveTier==='T1'?'#f39c12':'#999'}">${pveTier}</div>
          <div class="az-scene-score">${avgPve}分</div>
          <div class="az-scene-desc">${pveTier==='T0'?'BOSS通杀级':pveTier==='T1'?'大部分BOSS可过':pveTier==='T2'?'部分BOSS可过':'需要加强'}</div>
        </div>
      </div>
      <div class="az-pvp-pve-bar">
        <div class="az-pp-label">PVP</div>
        <div class="az-pp-track"><div class="az-pp-fill" style="width:${avgPvp}%;background:#e67e22"></div></div>
        <div class="az-pp-val">${avgPvp}</div>
      </div>
      <div class="az-pvp-pve-bar">
        <div class="az-pp-label">PVE</div>
        <div class="az-pp-track"><div class="az-pp-fill" style="width:${avgPve}%;background:#27ae60"></div></div>
        <div class="az-pp-val">${avgPve}</div>
      </div>
    </div>
    
    <!-- 属性覆盖 -->
    <div class="az-section">
      <div class="az-section-title">&#128300; 属性覆盖分析</div>
      <div class="az-type-row">
        <div class="az-type-label">阵容属性:</div>
        <div class="az-type-tags">${typeArr.map(t => {const tc=TYPE_COLORS[t];return tc?`<span class="az-type-tag" style="background:${tc.bg};color:${tc.c};display:inline-flex;align-items:center;gap:2px">${attrIconTag(t,12)} ${t}</span>`:t;}).join('')}</div>
      </div>
      <div class="az-type-row">
        <div class="az-type-label">&#9876; 可克制:</div>
        <div class="az-type-tags">${[...allOffTypes].map(t => {const tc=TYPE_COLORS[t];return tc?`<span class="az-type-tag" style="background:${tc.bg};color:${tc.c};display:inline-flex;align-items:center;gap:2px">${attrIconTag(t,12)} ${t}</span>`:t;}).join('') || '<span style="color:#999;font-size:11px">无</span>'}</div>
      </div>
      <div class="az-type-row">
        <div class="az-type-label">&#9888; 被克制:</div>
        <div class="az-type-tags">${[...allDefWeak].map(t => {const tc=TYPE_COLORS[t];return tc?`<span class="az-type-tag az-weak-tag" style="background:#fff0ef;color:#e74c3c;display:inline-flex;align-items:center;gap:2px">${attrIconTag(t,12)} ${t}</span>`:t;}).join('') || '<span style="color:#27ae60;font-size:11px">无弱点!</span>'}</div>
      </div>
    </div>
    
    <!-- 角色分析 -->
    <div class="az-section">
      <div class="az-section-title">&#128101; 角色配置</div>
      <div class="az-role-grid">
        ${renderRoleCheck('输出位', hasOutput, '阵容必须有输出核心')}
        ${renderRoleCheck('控制位', hasControl, '催眠/冰冻控制保命')}
        ${renderRoleCheck('坦克位', hasTank, '前排扛伤减压')}
        ${renderRoleCheck('治疗位', hasHeal, '续航回复兜底')}
      </div>
      <div class="az-member-roles">
        ${combats.map(c => {
          const tc = TYPE_COLORS[petMainType(c.pet)] || TYPE_COLORS["普通系"];
          return `<div class="az-mrole-item"><span class="az-mrole-name">${c.pet.n}</span><span class="az-mrole-badge" style="background:${getRoleBg(c.cb.role)}">${c.cb.role}</span><span class="az-mrole-power">战力 ${c.cb.power}</span></div>`;
        }).join('')}
      </div>
    </div>
    
    <!-- BOSS适配 -->
    <div class="az-section">
      <div class="az-section-title">&#128163; BOSS适配度</div>
      ${bossMatches.map(bm => `
        <div class="az-boss-match ${bm.match>=80?'az-match-good':bm.match>=60?'az-match-ok':'az-match-bad'}">
          <div class="az-bm-left">
            <div class="az-bm-name">${bm.emoji} ${bm.name}</div>
            <div class="az-bm-info">${bm.category} | ${bm.type}</div>
          </div>
          <div class="az-bm-right">
            <div class="az-bm-bar"><div class="az-bm-fill" style="width:${bm.match}%;background:${bm.match>=80?'#27ae60':bm.match>=60?'#f39c12':'#e74c3c'}"></div></div>
            <div class="az-bm-val" style="color:${bm.match>=80?'#27ae60':bm.match>=60?'#f39c12':'#e74c3c'}">${bm.match}%</div>
          </div>
        </div>
      `).join('')}
    </div>
    
    <!-- 活动适配 -->
    <div class="az-section">
      <div class="az-section-title">&#128197; 活动推荐</div>
      <div class="az-act-list">
        ${activityMatches.map(a => `
          <div class="az-act-item">
            <div class="az-act-icon">${a.icon}</div>
            <div class="az-act-info">
              <div class="az-act-name">${a.name}</div>
              <div class="az-act-reason">${a.reason}</div>
            </div>
            <div class="az-act-fit" style="color:${a.fit==='极佳'?'#27ae60':a.fit==='良好'?'#f39c12':'#e74c3c'}">${a.fit}</div>
          </div>
        `).join('')}
      </div>
    </div>
    
    <!-- 优化建议 -->
    <div class="az-section">
      <div class="az-section-title">&#128161; 优化建议</div>
      <div class="az-suggestions">
        ${suggestions.map(s => `
          <div class="az-sug-item ${s.type}">
            <div class="az-sug-icon">${s.icon}</div>
            <div class="az-sug-text">${s.text}</div>
          </div>
        `).join('')}
      </div>
    </div>
  </div>`;
  
  // 滚动到结果
  setTimeout(() => el.scrollIntoView({behavior:'smooth',block:'start'}), 200);
}

function renderBar(label, val, color) {
  return `<div class="az-bar-row"><div class="az-bar-label">${label}</div><div class="az-bar-track"><div class="az-bar-fill" style="width:${val}%;background:${color}"></div></div><div class="az-bar-val">${val}</div></div>`;
}

function renderRoleCheck(label, has, desc) {
  return `<div class="az-role-item ${has?'az-role-ok':'az-role-miss'}"><div class="az-role-check">${has?'&#10004;':'&#10008;'}</div><div class="az-role-label">${label}</div></div>`;
}

// --- BOSS适配分析 ---
function analyzeBossMatch(combats, typeArr, offTypes) {
  return BOSS_DATA.map(boss => {
    let match = 50; // 基础分
    // 属性克制加分
    const bossType = boss.type.replace(/\/.*$/,'').trim();
    const bossTypeData = TYPE_DATA[bossType];
    if (bossTypeData && bossTypeData.weak) {
      const canCounter = typeArr.some(t => bossTypeData.weak.includes(t));
      if (canCounter) match += 25;
    }
    // 有克制属性的攻击
    if (offTypes.has(bossType)) match += 10;
    // 平均战力加成
    const avgPw = combats.reduce((s,c)=>s+c.cb.power,0)/combats.length;
    match += Math.min(Math.round((avgPw-50)/5), 15);
    // 特殊精灵加分
    const names = combats.map(c=>c.pet.n);
    if (names.includes("嘟嘟锅")) match += 10; // 毒耗万能
    if (names.includes("瞌睡王")) match += 5; // 控制
    // 难度惩罚
    if (boss.difficulty >= 5 && avgPw < 75) match -= 15;
    
    match = Math.max(10, Math.min(99, match));
    return {name:boss.name, emoji:boss.emoji, category:boss.category, type:boss.type, match};
  }).sort((a,b) => b.match - a.match);
}

// --- 活动适配分析 ---
function analyzeActivityMatch(combats, roles, avgPower) {
  const acts = [];
  const names = combats.map(c=>c.pet.n);
  const hasPoison = names.includes("嘟嘟锅") || names.includes("嘟嘟煲");
  const hasSleep = names.includes("瞌睡王");
  const hasFlyer = names.includes("岚鸟") || names.includes("圣羽翼王");
  const hasSpeed = combats.some(c=>c.cb.spd>=120);
  
  // 日常BOSS
  acts.push({icon:"&#128163;",name:"日常BOSS(统领)",
    reason: hasPoison ? "嘟嘟锅毒耗通杀所有统领" : avgPower>=70 ? "阵容战力足够挑战日常BOSS" : "建议提升核心精灵战力",
    fit: hasPoison ? "极佳" : avgPower>=70 ? "良好" : "一般"});
  
  // 领地试炼
  const hasWater = combats.some(c=>petHasType(c.pet,"水系"));
  const hasGround = combats.some(c=>petHasType(c.pet,"地系"));
  acts.push({icon:"&#9876;",name:"领地试炼(三关)",
    reason: hasWater && hasGround ? "水系克岩傀+地面系免疫雷将，阵容适配" : hasWater ? "水系可过第一关和第三关" : "缺少水系/地面系克制精灵",
    fit: hasWater && hasGround ? "极佳" : hasWater || hasGround ? "良好" : "一般"});
  
  // PVP星对光决
  const avgPvp = Math.round(combats.reduce((s,c)=>s+c.cb.pvp,0)/combats.length);
  acts.push({icon:"&#127942;",name:"星对光决(PVP)",
    reason: avgPvp>=85 ? "阵容PVP实力强劲，冲高段位" : avgPvp>=70 ? "PVP中等偏上水平" : hasSleep ? "有催眠控制可一战" : "PVP实力偏弱",
    fit: avgPvp>=85 ? "极佳" : avgPvp>=65 ? "良好" : "一般"});
  
  // 麦克达克试炼
  acts.push({icon:"&#129302;",name:"麦克达克终极试炼",
    reason: hasPoison && hasSleep ? "毒耗+催眠组合最佳方案" : avgPower>=80 ? "阵容实力足够挑战" : "最高难度活动，建议60级+全队",
    fit: hasPoison && hasSleep ? "极佳" : avgPower>=80 ? "良好" : "一般"});
  
  // 精灵抱抱团
  acts.push({icon:"&#128055;",name:"精灵抱抱团(组队)",
    reason: hasPoison ? "嘟嘟锅毒耗对高HP BOSS效率极高" : "需组队参与，输出精灵均可参与",
    fit: hasPoison ? "极佳" : "良好"});
  
  // 星辰塔
  const hasAoe = combats.some(c=>c.cb.tags && c.cb.tags.includes("AOE"));
  acts.push({icon:"&#127775;",name:"星辰塔速刷",
    reason: hasAoe && hasSpeed ? "AOE+高速组合快速清层" : hasAoe ? "有AOE清场能力" : "缺少AOE清场精灵",
    fit: hasAoe && hasSpeed ? "极佳" : hasAoe ? "良好" : "一般"});
  
  // 探索跑图
  acts.push({icon:"&#127757;",name:"大世界探索",
    reason: hasFlyer ? "有飞行精灵跑图效率高" : "缺少飞行坐骑精灵",
    fit: hasFlyer ? "极佳" : "良好"});
  
  return acts;
}

// --- 优化建议生成 ---
function generateSuggestions(combats, roles, typeArr, weakSet, hasOutput, hasControl, hasTank, hasHeal) {
  const sugs = [];
  const names = combats.map(c=>c.pet.n);
  
  if (!hasOutput) sugs.push({type:"az-sug-critical",icon:"&#9888;",text:"阵容缺少输出核心! 强烈建议加入燃薪虫(灼烧PVE神)、火神(AOE速攻)或酷拉(秒杀)中的至少一只"});
  if (!hasControl) sugs.push({type:"az-sug-warn",icon:"&#128161;",text:"缺少控制位。建议加入瞌睡王(催眠85%命中)或雪灵(冰冻+减速)，控制是BOSS战和PVP的关键"});
  if (!hasTank && combats.length >= 4) sugs.push({type:"az-sug-info",icon:"&#128204;",text:"缺少坦克位。可考虑加入石冠王蜥(物防天花板)或千棘盔(反伤机制)提高容错率"});
  if (!hasHeal && combats.length >= 4) sugs.push({type:"az-sug-info",icon:"&#128204;",text:"缺少治疗位。白金独角兽是最佳治疗(40%HP单体回复+全队增攻)，可大幅提升续航能力"});
  
  if (!names.includes("嘟嘟锅")) sugs.push({type:"az-sug-info",icon:"&#128161;",text:"推荐加入嘟嘟锅! 毒耗机制无视BOSS防御和属性，是PVE最强通杀精灵(嘟嘟煲22级进化)"});
  
  if (typeArr.length <= 2 && combats.length >= 3) sugs.push({type:"az-sug-warn",icon:"&#9888;",text:"属性种类过少(仅" + typeArr.length + "种)! 遇到被克制属性会全军覆没，建议至少覆盖3-4种属性"});
  
  if (weakSet.size >= 5) sugs.push({type:"az-sug-warn",icon:"&#128165;",text:"阵容弱点较多(被" + weakSet.size + "种属性克制)，对战时容易被针对。建议调整属性构成减少共同弱点"});
  
  const lowPets = combats.filter(c => c.cb.power < 50);
  if (lowPets.length > 0) sugs.push({type:"az-sug-info",icon:"&#128170;",text:"以下精灵战力偏低: " + lowPets.map(c=>c.pet.n).join('、') + "。建议替换为对应属性的终阶进化形态"});
  
  const avgSpd = combats.reduce((s,c)=>s+c.cb.spd,0)/combats.length;
  if (avgSpd < 70) sugs.push({type:"az-sug-info",icon:"&#9889;",text:"阵容整体速度偏低(平均" + Math.round(avgSpd) + ")，PVP容易被先手。可加入酷拉(速度135)或火神(速度130)提升先手能力"});
  
  if (sugs.length === 0) sugs.push({type:"az-sug-good",icon:"&#127942;",text:"阵容非常完善! 属性覆盖全面、角色齐全、战力强劲。保持这个配置就很棒!"});
  
  return sugs;
}

// ================ 技能图鉴 ================
let _allSkills = null; // 缓存全部技能列表
let _skillTypeFilter = "all";
let _skillAttrFilter = "all";
let _skillSearchTimer = null;

function debounceSkillSearch() {
  clearTimeout(_skillSearchTimer);
  _skillSearchTimer = setTimeout(renderSkillDexList, 200);
}

function buildAllSkills() {
  if (_allSkills) return _allSkills;
  const map = new Map(); // 技能名 → {skill, pets:[]}
  if (typeof PET_SKILLS_DB === 'undefined') return [];
  
  Object.entries(PET_SKILLS_DB).forEach(([petName, data]) => {
    if (!data.skills) return;
    data.skills.forEach(sk => {
      if (!sk.n || sk.n.length < 2) return;
      if (map.has(sk.n)) {
        const existing = map.get(sk.n);
        existing.pets.push(petName);
        // 补充更好的数据
        if (sk.w > 0 && existing.skill.w === 0) existing.skill.w = sk.w;
        if (sk.d && sk.d.length > existing.skill.d.length) existing.skill.d = sk.d;
      } else {
        map.set(sk.n, { skill: { ...sk }, pets: [petName] });
      }
    });
  });
  
  _allSkills = [...map.values()].sort((a, b) => b.pets.length - a.pets.length);
  return _allSkills;
}

// 推断技能属性（从技能描述和学习的精灵中推断）
function guessSkillAttr(skillEntry) {
  const desc = (skillEntry.skill.d || '').toLowerCase();
  const pets = skillEntry.pets;
  // 从描述推断
  if (desc.includes('火') || desc.includes('灼烧')) return '火系';
  if (desc.includes('水') || desc.includes('湿润')) return '水系';
  if (desc.includes('草') || desc.includes('寄生')) return '草系';
  if (desc.includes('冰') || desc.includes('冻结')) return '冰系';
  if (desc.includes('电') || desc.includes('迸发')) return '电系';
  if (desc.includes('毒') || desc.includes('中毒')) return '毒系';
  if (desc.includes('龙')) return '龙系';
  if (desc.includes('幽') || desc.includes('降灵')) return '幽系';
  if (desc.includes('光')) return '光系';
  if (desc.includes('地') || desc.includes('沙')) return '地系';
  if (desc.includes('星陨') || desc.includes('幻')) return '幻系';
  return '普通系';
}

function initSkillDex() {
  const skills = buildAllSkills();
  
  // 渲染类型筛选
  const types = [{id:'all',label:'全部'},{id:'物',label:'物攻'},{id:'魔',label:'魔攻'},{id:'防',label:'防御'},{id:'状',label:'状态'}];
  const typeEl = document.getElementById('skillTypeFilter');
  typeEl.innerHTML = types.map(t => 
    `<div class="skill-ftag ${t.id===_skillTypeFilter?'active':''}" onclick="setSkillTypeFilter('${t.id}',this)">${t.label}</div>`
  ).join('');
  
  // 渲染属性筛选
  const attrs = ['all','火系','水系','草系','电系','冰系','龙系','光系','恶系','幽系','翼系','机械系','虫系','武系','萌系','毒系','地系','普通系','幻系'];
  const attrEl = document.getElementById('skillAttrFilter');
  attrEl.innerHTML = attrs.map(a => {
    const isAll = a === 'all';
    const tc = isAll ? null : TYPE_COLORS[a];
    const label = isAll ? '全部' : (tc ? attrIconTag(a,12) + ' ' + a : a);
    const style = isAll ? '' : (tc ? `color:${tc.c};` : '');
    return `<div class="skill-ftag ${a===_skillAttrFilter?'active':''}" style="${style}" onclick="setSkillAttrFilter('${a}',this)">${label}</div>`;
  }).join('');
  
  renderSkillDexList();
}

function setSkillTypeFilter(type, el) {
  _skillTypeFilter = type;
  document.querySelectorAll('#skillTypeFilter .skill-ftag').forEach(e => e.classList.remove('active'));
  el.classList.add('active');
  renderSkillDexList();
}

function setSkillAttrFilter(attr, el) {
  _skillAttrFilter = attr;
  document.querySelectorAll('#skillAttrFilter .skill-ftag').forEach(e => e.classList.remove('active'));
  el.classList.add('active');
  renderSkillDexList();
}

function renderSkillDexList() {
  const skills = buildAllSkills();
  const search = (document.getElementById('skillDexSearch').value || '').trim().toLowerCase();
  
  let filtered = skills;
  
  // 类型筛选
  if (_skillTypeFilter !== 'all') {
    filtered = filtered.filter(s => s.skill.t === _skillTypeFilter);
  }
  
  // 属性筛选（基于推断）
  if (_skillAttrFilter !== 'all') {
    filtered = filtered.filter(s => guessSkillAttr(s) === _skillAttrFilter);
  }
  
  // 搜索
  if (search) {
    filtered = filtered.filter(s => {
      const n = s.skill.n.toLowerCase();
      const d = (s.skill.d || '').toLowerCase();
      return n.includes(search) || d.includes(search);
    }).sort((a, b) => {
      const aExact = a.skill.n.toLowerCase() === search ? 100 : a.skill.n.toLowerCase().startsWith(search) ? 50 : 0;
      const bExact = b.skill.n.toLowerCase() === search ? 100 : b.skill.n.toLowerCase().startsWith(search) ? 50 : 0;
      return bExact - aExact;
    });
  }
  
  document.getElementById('skillDexCount').textContent = `${filtered.length} / ${skills.length} 个技能`;
  
  const el = document.getElementById('skillDexList');
  if (!filtered.length) {
    el.innerHTML = '<div style="text-align:center;padding:40px;color:#bbb;font-size:13px;">没有找到匹配的技能</div>';
    return;
  }
  
  // 搜索模式：平铺列表
  if (search) {
    el.innerHTML = filtered.slice(0, 100).map(entry => renderSkillDexCard(entry)).join('')
      + (filtered.length > 100 ? `<div style="text-align:center;padding:14px;color:#999;font-size:11px;">还有 ${filtered.length - 100} 个技能未显示，请缩小搜索范围</div>` : '');
    setTimeout(observeSkillIcons, 50);
    return;
  }
  
  // 非搜索模式：按属性分组折叠
  const attrOrder = ["火系","水系","草系","电系","冰系","龙系","光系","恶系","幽系","翼系","机械系","虫系","武系","萌系","毒系","地系","幻系","普通系"];
  const groups = {};
  filtered.forEach(entry => {
    const attr = guessSkillAttr(entry);
    if (!groups[attr]) groups[attr] = [];
    groups[attr].push(entry);
  });
  
  // 组内排序：物>魔>防>状，同类型按威力降序
  const typeOrd = {"物":0,"魔":1,"防":2,"状":3};
  Object.values(groups).forEach(arr => {
    arr.sort((a, b) => {
      const td = (typeOrd[a.skill.t]||3) - (typeOrd[b.skill.t]||3);
      if (td !== 0) return td;
      return (b.skill.w||0) - (a.skill.w||0);
    });
  });
  
  el.innerHTML = attrOrder.map(attr => {
    const arr = groups[attr];
    if (!arr || !arr.length) return '';
    const tc = TYPE_COLORS[attr] || TYPE_COLORS["普通系"];
    const gid = `skdGrp_${attr}`;
    const physCount = arr.filter(e => e.skill.t === '物').length;
    const magCount = arr.filter(e => e.skill.t === '魔').length;
    const defCount = arr.filter(e => e.skill.t === '防').length;
    const statCount = arr.filter(e => e.skill.t === '状').length;
    const subInfo = [
      physCount ? `物${physCount}` : '',
      magCount ? `魔${magCount}` : '',
      defCount ? `防${defCount}` : '',
      statCount ? `状${statCount}` : ''
    ].filter(Boolean).join(' ');
    
    return `<div class="skill-group" style="border-color:${tc.c}20">
      <div class="skill-group-header" onclick="toggleSkillGroup('${gid}')">
        <div class="skill-group-left">
          ${attrIconTag(attr, 22)}
          <span class="skill-group-title" style="color:${tc.c}">${attr}</span>
          <span class="skill-group-count">${arr.length}个 (${subInfo})</span>
        </div>
        <span class="skill-group-arrow" id="${gid}_arrow">&#9660;</span>
      </div>
      <div class="skill-group-body" id="${gid}" style="display:none">
        ${arr.map(entry => renderSkillDexCard(entry)).join('')}
      </div>
    </div>`;
  }).join('');
  setTimeout(observeSkillIcons, 50);
}

function renderSkillDexCard(entry) {
  const sk = entry.skill;
  const cc = SKILL_CAT[sk.t] || SKILL_CAT["状"];
  const skAttr = guessSkillAttr(entry);
  const attrTc = TYPE_COLORS[skAttr] || TYPE_COLORS["普通系"];
  const petList = entry.pets.slice(0, 5).join(', ') + (entry.pets.length > 5 ? ` 等${entry.pets.length}只` : '');
  const skillImgUrl = BWIKI_SKILL + encodeURIComponent('技能图标_' + sk.n) + '.png';
  return `<div class="skill-dex-card">
    <div class="skill-dex-icon" style="background:${cc.bg}">${skillImgLazy(sk.n, 24)}</div>
    <div class="skill-dex-info">
      <div class="skill-dex-name">${sk.n} <span class="skill-dex-type-tag" style="background:${cc.bg};color:${cc.c}">${cc.label}</span> <span style="display:inline-flex;align-items:center;gap:1px;padding:1px 4px;border-radius:3px;font-size:9px;background:${attrTc.bg};color:${attrTc.c}">${attrIconTag(skAttr,10)}${skAttr.replace('系','')}</span></div>
      <div class="skill-dex-meta">${sk.w > 0 ? `<span class="skill-dex-power">威力 ${sk.w}</span>` : ''}${sk.c > 0 ? `<span style="font-size:10px;color:#888">能耗 ${sk.c}</span>` : ''}</div>
      ${sk.d ? `<div class="skill-dex-desc">${sk.d}</div>` : ''}
      <div class="skill-dex-pets">${gIcon('fruit',10)} ${petList}</div>
    </div>
  </div>`;
}

// ================ 特殊攻略（稀兽花种/精灵首领/传说精灵） ================
function openSpecialGuide(type) {
  if (typeof SPECIAL_GUIDE_DATA === 'undefined') return;
  const data = SPECIAL_GUIDE_DATA[type];
  if (!data) return;

  document.querySelectorAll('.page,.detail-page').forEach(p => p.classList.remove('active'));
  document.getElementById('navBack').classList.add('show');
  document.querySelector('.tabbar').style.display = 'none';
  document.getElementById('navTitle').textContent = data.title;

  const detail = document.getElementById('pageSpecialGuide');
  let html = '';

  if (type === 'floralBoss') {
    html = renderFloralGuide(data);
  } else if (type === 'rareBeast') {
    html = renderBeastGuide(data);
  } else if (type === 'chieftain') {
    html = renderChieftainGuide(data);
  } else if (type === 'legendary') {
    html = renderLegendaryGuide(data);
  }

  detail.innerHTML = html;
  detail.classList.add('active');
  detail.scrollTop = 0; window.scrollTo(0, 0);
}

function renderFloralGuide(data) {
  return `
    <div class="detail-banner" style="background:linear-gradient(135deg,#e91e63,#e91e6388)">
      <div class="detail-boss-name">&#127804; ${data.title}</div>
      <div class="detail-boss-sub">${data.desc}</div>
      <div class="detail-info-row">
        <div class="detail-info-item">&#128275; ${data.unlock}</div>
        <div class="detail-info-item">&#127873; ${data.reward}</div>
      </div>
    </div>
    ${data.bosses.map((b, i) => `
      <div class="sg-boss-card" style="border-left-color:${i===0?'#f39c12':i===1?'#e74c3c':'#e91e63'}">
        <div class="sg-boss-header">
          <div class="sg-boss-img" style="background:linear-gradient(135deg,#f8f9fa,#eef5ff);">${petImgTag(b.imgName, 56, '')}</div>
          <div class="sg-boss-info">
            <div class="sg-boss-name">BOSS ${i+1}: ${b.name}</div>
            <div class="sg-boss-meta">${attrIconTag(b.type.replace(/系/,'系'), 14)} ${b.type} | Lv.${b.level}</div>
          </div>
        </div>
        <div style="font-size:12px;color:#555;margin-bottom:8px;">${b.desc}</div>
        <div class="sg-rec-box">
          <div class="sg-rec-title">&#127919; 推荐精灵: ${b.recPet}</div>
          <div class="sg-rec-text">&#9876; 技能配置: ${b.recSkills}</div>
        </div>
        <div style="font-size:12px;font-weight:600;color:#2c3e50;margin-bottom:6px;">&#128204; 详细打法步骤</div>
        <div class="sg-step-list">${b.strategy.map(s => `<div class="sg-step">${s}</div>`).join('')}</div>
        <div class="sg-tip-box">&#128161; ${b.tips}</div>
      </div>
    `).join('')}`;
}

function renderBeastGuide(data) {
  return `
    <div class="detail-banner" style="background:linear-gradient(135deg,#e67e22,#e67e2288)">
      <div class="detail-boss-name">&#128058; ${data.title}</div>
      <div class="detail-boss-sub">${data.desc}</div>
      <div class="detail-info-row">
        <div class="detail-info-item">&#128275; ${data.unlock}</div>
        <div class="detail-info-item">&#127873; ${data.reward}</div>
      </div>
    </div>
    <div class="detail-section">
      <div class="detail-section-title">&#128161; 通用攻略技巧</div>
      ${data.tips.map(t => `<div class="mechanism-item"><span class="mechanism-icon">&#128204;</span><span>${t}</span></div>`).join('')}
    </div>
    <div class="detail-section">
      <div class="detail-section-title">&#128058; 稀兽列表 (${data.beasts.length}只)</div>
      ${data.beasts.map(b => `
        <div class="sg-chief-card">
          <div style="width:44px;height:44px;border-radius:10px;background:#fff3e8;display:flex;align-items:center;justify-content:center;flex-shrink:0">${petImgTag(b.name, 40, '&#128058;')}</div>
          <div style="flex:1;min-width:0">
            <div style="font-size:13px;font-weight:700;color:#2c3e50">${b.name} <span style="font-size:10px;color:#888">Lv.${b.level}</span></div>
            <div style="font-size:10px;color:#666;margin-top:2px">${b.type} | &#128205; ${b.location}</div>
            <div style="font-size:10px;color:#e67e22;margin-top:2px">&#128161; ${b.tip}</div>
          </div>
        </div>
      `).join('')}
    </div>`;
}

function renderChieftainGuide(data) {
  return `
    <div class="detail-banner" style="background:linear-gradient(135deg,#9b59b6,#9b59b688)">
      <div class="detail-boss-name">&#128081; ${data.title}</div>
      <div class="detail-boss-sub">${data.desc}</div>
      <div class="detail-info-row">
        <div class="detail-info-item">&#128275; ${data.unlock}</div>
        <div class="detail-info-item">&#127873; ${data.reward}</div>
      </div>
    </div>
    <div class="detail-section">
      <div class="detail-section-title">&#9881; 首领化机制</div>
      ${data.mechanism.map(m => `<div class="mechanism-item"><span class="mechanism-icon">&#128204;</span><span>${m}</span></div>`).join('')}
    </div>
    <div class="detail-section">
      <div class="detail-section-title">&#128081; 可首领化精灵 (${data.chiefs.length}只)</div>
      ${data.chiefs.map(c => `
        <div class="sg-chief-card" onclick="openDexDetailByName('${c.base}')">
          <div style="width:44px;height:44px;border-radius:10px;background:#f0e6ff;display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden">${petImgTag(c.base, 40, '&#128081;')}</div>
          <div style="flex:1;min-width:0">
            <div style="font-size:13px;font-weight:700;color:#2c3e50">${c.base} &#10132; ${c.evolved}</div>
            <div style="font-size:10px;color:#9b59b6;margin-top:2px">&#10024; ${c.trait}</div>
            <div style="font-size:10px;color:#888;margin-top:1px">${c.tip}</div>
          </div>
        </div>
      `).join('')}
    </div>`;
}

function renderLegendaryGuide(data) {
  return `
    <div class="detail-banner" style="background:linear-gradient(135deg,#f39c12,#e74c3c)">
      <div class="detail-boss-name">&#11088; ${data.title}</div>
      <div class="detail-boss-sub">${data.desc}</div>
      <div class="detail-info-row">
        <div class="detail-info-item">&#127873; ${data.reward}</div>
      </div>
    </div>
    ${data.legends.map(leg => {
      const pet = DEX_DATA.find(d => d.n === leg.name);
      const tc = pet ? petTC(pet) : {c:'#f39c12',bg:'#fffce8'};
      return `
      <div class="sg-legend-card" style="border-color:${tc.c}30">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;">
          <div style="width:56px;height:56px;border-radius:14px;background:${tc.bg};overflow:hidden;display:flex;align-items:center;justify-content:center;flex-shrink:0">${petImgTag(leg.name, 52, '')}</div>
          <div>
            <div class="sg-legend-name">${leg.name} <span class="sg-legend-prio">${leg.priority}</span></div>
            <div style="font-size:11px;color:#888;margin-top:2px">${leg.type} | &#128205; ${leg.location}</div>
          </div>
        </div>
        <div class="sg-legend-desc">${leg.desc}</div>
        <div class="sg-legend-how"><b>&#128275; 获取方式:</b><br>${leg.how}</div>
        <div style="font-size:12px;color:#555;line-height:1.7;margin-top:6px;padding:10px 12px;background:linear-gradient(135deg,#f0f4ff,#f8f9fa);border-radius:8px;border-left:3px solid ${tc.c}">
          <b>&#9876; 战斗策略:</b><br>${leg.strategy}
        </div>
      </div>`;
    }).join('')}`;
}

function openDexDetailByName(name) {
  const pet = DEX_DATA.find(d => d.n === name);
  if (pet) openDexDetail(pet.no);
}

// ================ 精灵蛋攻略 ================
function renderEggGuide() {
  if (typeof EGG_GUIDE_DATA === 'undefined') return;
  const D = EGG_GUIDE_DATA;
  const el = document.getElementById('pageDexEggs');
  
  el.innerHTML = `
    <div class="detail-banner" style="background:linear-gradient(135deg,#f39c12,#e67e22)">
      <div class="detail-boss-name">${gIcon('egg',24)} 精灵蛋完整攻略</div>
      <div class="detail-boss-sub">蛋组系统 · 孵化规则 · 异色炫彩 · 隐藏蛋 · 棱镜球推荐</div>
    </div>

    <!-- 目录导航 -->
    <div class="egg-nav">
      <div class="egg-nav-btn" onclick="document.getElementById('eggSec1').scrollIntoView({behavior:'smooth'})">${gIcon('typeChart',14)} 蛋组</div>
      <div class="egg-nav-btn" onclick="document.getElementById('eggSec2').scrollIntoView({behavior:'smooth'})">${gIcon('questTale',14)} 规则</div>
      <div class="egg-nav-btn" onclick="document.getElementById('eggSec3').scrollIntoView({behavior:'smooth'})">${gIcon('starGold',14)} 异色</div>
      <div class="egg-nav-btn" onclick="document.getElementById('eggSec4').scrollIntoView({behavior:'smooth'})">${gIcon('questLost',14)} 隐藏蛋</div>
      <div class="egg-nav-btn" onclick="document.getElementById('eggSec5').scrollIntoView({behavior:'smooth'})">${gIcon('chestLeg',14)} 棱镜球</div>
    </div>

    <!-- 1. 蛋组系统 -->
    <div class="detail-section" id="eggSec1">
      <div class="detail-section-title">${gIcon('typeChart',16)} 蛋组系统 (${D.eggGroups.length}组)</div>
      <div style="font-size:11px;color:#888;margin-bottom:10px">同蛋组的一公一母才能生蛋，后代物种由母方决定</div>
      ${D.eggGroups.map(g => {
        const gid = 'eggGrp_' + g.name;
        return `<div class="skill-group" style="border-color:${g.color}20">
          <div class="skill-group-header" onclick="toggleSkillGroup('${gid}')">
            <div class="skill-group-left">
              <span style="font-size:18px">${g.icon}</span>
              <span class="skill-group-title" style="color:${g.color}">${g.name}</span>
              <span class="skill-group-count">${g.pets.length}只 · ${g.desc}</span>
            </div>
            <span class="skill-group-arrow" id="${gid}_arrow">&#9660;</span>
          </div>
          <div class="skill-group-body" id="${gid}" style="display:none">
            <div style="display:flex;flex-wrap:wrap;gap:4px;padding:4px 0">
              ${g.pets.map(p => `<span style="display:inline-block;padding:3px 8px;border-radius:8px;font-size:11px;font-weight:500;background:${g.color}15;color:${g.color};cursor:pointer" onclick="openDexDetailByName('${p}')">${p}</span>`).join('')}
            </div>
          </div>
        </div>`;
      }).join('')}
    </div>

    <!-- 2. 生蛋规则 -->
    <div class="detail-section" id="eggSec2">
      <div class="detail-section-title">${gIcon('questTale',16)} 生蛋与孵化规则</div>
      ${D.breedRules.map(r => `<div class="mechanism-item"><span class="mechanism-icon">${r.icon}</span><div><b style="color:#2c3e50">${r.title}</b><br><span style="color:#555">${r.text}</span></div></div>`).join('')}
    </div>

    <!-- 3. 蛋的类型 -->
    <div class="detail-section">
      <div class="detail-section-title">${gIcon('egg',16)} 精灵蛋类型 (${D.eggTypes.length}种)</div>
      <div style="font-size:11px;color:#888;margin-bottom:10px">不同品质的蛋有不同的孵化效果和接生建议</div>
      ${D.eggTypes.map(t => {
        const eggImg = t.icon || (typeof EGG_ICONS!=='undefined'?EGG_ICONS.generic:'');
        const ballUrl = typeof BALL_ICONS!=='undefined' && t.ballKey ? BALL_ICONS[t.ballKey] : '';
        return `<div style="background:#fff;border-radius:12px;padding:12px;margin-bottom:8px;border-left:3px solid ${t.color};display:flex;align-items:flex-start;gap:10px;box-shadow:0 1px 4px rgba(0,0,0,.03)">
        <div style="width:44px;height:44px;border-radius:12px;background:${t.color}12;display:flex;align-items:center;justify-content:center;flex-shrink:0">
          <img src="${eggImg}" style="width:36px;height:36px;object-fit:contain;border-radius:6px" onerror="this.style.display='none'" loading="lazy">
        </div>
        <div style="flex:1;min-width:0">
          <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
            <span style="font-size:14px;font-weight:700;color:${t.color}">${t.name}</span>
          </div>
          <div style="font-size:11px;color:#555;margin-top:3px;line-height:1.6">${t.desc}</div>
          <div style="font-size:10px;color:#888;margin-top:4px;display:flex;align-items:center;gap:4px;flex-wrap:wrap">
            ${ballUrl ? '<img src="'+ballUrl+'" style="width:14px;height:14px;object-fit:contain;border-radius:3px" onerror="this.style.display=&quot;none&quot;">' : gIcon('gacha',12)}
            <b>接生建议:</b> ${t.ball}
          </div>
        </div>
      </div>`;
      }).join('')}
    </div>

    <!-- 4. 异色炫彩遗传 -->
    <div class="detail-section" id="eggSec3">
      <div class="detail-section-title">${gIcon('starGold',16)} 异色 · 炫彩遗传机制</div>
      ${D.shinyRules.map(r => `<div style="background:${r.color}10;border-radius:10px;padding:10px 12px;margin-bottom:6px;border-left:3px solid ${r.color}">
        <div style="font-size:13px;font-weight:700;color:${r.color}">${r.icon} ${r.title}</div>
        <div style="font-size:11px;color:#555;margin-top:3px">${r.text}</div>
      </div>`).join('')}
    </div>

    <!-- 5. 异色方方孵蛋法 -->
    <div class="detail-section">
      <div class="detail-section-title">${gIcon('sparkPurple',16)} ${D.shinyMethod.title}</div>
      <div style="font-size:12px;color:#555;line-height:1.7;margin-bottom:10px;padding:10px 12px;background:#fffce8;border-radius:10px;border-left:3px solid #f39c12">${D.shinyMethod.desc}</div>
      <div class="sg-step-list">
        ${D.shinyMethod.steps.map(s => `<div class="sg-step">${s}</div>`).join('')}
      </div>
      <div class="sg-tip-box">${gIcon('questTale',12)} ${D.shinyMethod.tips}</div>
    </div>

    <!-- 6. 隐藏精灵蛋 -->
    <div class="detail-section" id="eggSec4">
      <div class="detail-section-title">${gIcon('questLost',16)} 隐藏精灵蛋 (${D.hiddenEggs.length}个)</div>
      <div style="font-size:11px;color:#888;margin-bottom:10px">这些精灵蛋需要特殊条件触发，无法在野外直接遇到</div>
      ${D.hiddenEggs.map(e => {
        const diffStars = '&#9733;'.repeat(e.difficulty) + '&#9734;'.repeat(5-e.difficulty);
        const eggImgUrl = 'https://wiki.biligame.com/rocom/Special:FilePath/%E7%B2%BE%E7%81%B5_%E7%B2%BE%E7%81%B5%E8%9B%8B_' + encodeURIComponent(e.name) + '.png';
        return `<div style="background:#fff;border-radius:12px;padding:12px;margin-bottom:8px;box-shadow:0 1px 4px rgba(0,0,0,.03);border:1px solid #f0f0f0">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">
            <img src="${eggImgUrl}" style="width:40px;height:40px;border-radius:10px;object-fit:contain;background:#f8f9fa" onerror="this.src='${GAME_ICONS.egg}'">
            <div style="flex:1">
              <div style="font-size:14px;font-weight:700;color:#2c3e50">${e.name}</div>
              <div style="font-size:10px;color:#f39c12">${e.worth}</div>
            </div>
          </div>
          <div style="font-size:11px;color:#888;margin-bottom:4px">${gIcon('location',12)} ${e.location} | 难度: <span style="color:#f1c40f">${diffStars}</span></div>
          <div style="font-size:11px;color:#555;margin-bottom:4px">${gIcon('questLost',12)} 条件: ${e.condition}</div>
          <div style="font-size:11px;color:#4a6cf7;background:#f0f4ff;padding:6px 8px;border-radius:6px">${gIcon('questTale',12)} ${e.method}</div>
        </div>`;
      }).join('')}
    </div>

    <!-- 7. 神秘蛋 -->
    <div class="detail-section">
      <div class="detail-section-title">${gIcon('battleSpy',16)} 神秘蛋获取位置 (${D.mysteryEggs.length}个)</div>
      <div style="font-size:11px;color:#888;margin-bottom:10px">与野外NPC对战获得，概率出炫彩个体</div>
      ${D.mysteryEggs.map(e => {
        const mEggUrl = typeof eggIconUrl==='function' ? eggIconUrl(e.pet||'神奇的蛋') : (typeof EGG_ICONS!=='undefined'?EGG_ICONS.mystery:'');
        return `<div style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:#fff;border-radius:10px;margin-bottom:6px;box-shadow:0 1px 4px rgba(0,0,0,.03);border:1px solid #f0f0f0">
        <div style="width:40px;height:40px;border-radius:10px;background:#f5eeff;display:flex;align-items:center;justify-content:center;flex-shrink:0">
          <img src="${mEggUrl}" style="width:32px;height:32px;object-fit:contain;border-radius:6px" onerror="this.src='${GAME_ICONS.battleSpy}'" loading="lazy">
        </div>
        <div style="flex:1;min-width:0">
          <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
            <span style="font-size:12px;font-weight:700;color:#2c3e50">${e.pet||'未知'}</span>
            ${e.desc?'<span style="font-size:9px;color:#888;background:#f0f0f0;padding:1px 5px;border-radius:4px">'+e.desc+'</span>':''}
            ${e.note?'<span style="font-size:9px;color:#e91e63;background:#fce4ec;padding:1px 5px;border-radius:4px">'+e.note+'</span>':''}
          </div>
          <div style="font-size:10px;color:#666;margin-top:2px">${gIcon('location',10)} ${e.location} · NPC: ${e.npc}</div>
          <div style="font-size:10px;color:#4a6cf7;margin-top:1px">${gIcon('questTale',10)} ${e.method}</div>
        </div>
      </div>`;
      }).join('')}
    </div>

    <!-- 8. 棱镜球推荐 -->
    <div class="detail-section" id="eggSec5">
      <div class="detail-section-title">${gIcon('chestLeg',16)} 棱镜球使用推荐</div>
      <div style="font-size:12px;color:#555;line-height:1.7;margin-bottom:8px;padding:10px 12px;background:linear-gradient(135deg,#f5eeff,#f8f9fa);border-radius:10px;border-left:3px solid #9b59b6;display:flex;align-items:flex-start;gap:10px">
        <img src="${typeof BALL_ICONS!=='undefined'?BALL_ICONS.prism:GAME_ICONS.chestLeg}" style="width:48px;height:48px;object-fit:contain;border-radius:10px;flex-shrink:0" onerror="this.style.display='none'" loading="lazy">
        <div style="flex:1"><b>棱镜球效果:</b> ${D.prismBall.effect}<br>
        <b>获取方式:</b> ${D.prismBall.obtain}</div>
      </div>
      <div style="font-size:12px;font-weight:700;color:#2c3e50;margin-bottom:8px">${gIcon('battleOpen',14)} 推荐排行</div>
      ${D.prismBall.ranking.map(r => {
        const tierColor = r.tier==='T0'?'#e74c3c':r.tier==='T1'?'#f39c12':r.tier==='T2'?'#3498db':'#27ae60';
        return `<div style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:#fff;border-radius:10px;margin-bottom:6px;box-shadow:0 1px 4px rgba(0,0,0,.03)">
          <div style="width:36px;height:36px;border-radius:10px;background:${tierColor}15;display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden">${petImgTag(r.name, 32, '')}</div>
          <div style="flex:1;min-width:0">
            <div style="font-size:13px;font-weight:700;color:#2c3e50">${r.name} <span style="padding:1px 6px;border-radius:6px;font-size:9px;font-weight:700;background:${tierColor};color:#fff">${r.tier}</span> <span style="font-size:9px;color:#888">${r.type}</span></div>
            <div style="font-size:10px;color:#666;margin-top:2px">${r.reason}</div>
          </div>
        </div>`;
      }).join('')}
    </div>
  `;
}

// ================ 咕噜球图鉴 ================
function renderBallGuide() {
  if (typeof BALL_GUIDE_DATA === 'undefined') return;
  const D = BALL_GUIDE_DATA;
  const el = document.getElementById('pageDexBalls');
  const totalBalls = D.categories.reduce((s, c) => s + c.balls.length, 0);
  
  // 咕噜球名称→游戏内图标URL映射
  const BI = typeof BALL_ICONS !== 'undefined' ? BALL_ICONS : {};
  const ballIconMap = {
    '普通咕噜球': BI.normal, '中级咕噜球': BI.mid, '高级咕噜球': BI.high,
    '超级咕噜球': BI.super, '国王咕噜球': BI.king, '棱镜咕噜球': BI.prism,
    '织梦棱镜球': BI.dream, '捕光球': BI.capture, '调温球': BI.temp,
    '绝缘球': BI.insulate, '淘沙球': BI.sand, '网兜球': BI.net,
    '光合球': BI.photo, '好战球': BI.fight, '美妙球': BI.cute,
    '暗星球': BI.dark, '变换球': BI.shift, '瞌睡球': BI.sleep,
    '水珠球': BI.rain, '柔软球': BI.soft, '可可果球': BI.cocoa
  };
  function ballImg(name, size) {
    const url = ballIconMap[name] || BI.normal || GAME_ICONS.gacha;
    const s = size || 32;
    return `<img src="${url}" alt="${name}" style="width:${s}px;height:${s}px;object-fit:contain;border-radius:6px" loading="lazy" onerror="this.src='${GAME_ICONS.gacha}'">`;
  }
  
  el.innerHTML = `
    <div class="detail-banner" style="background:linear-gradient(135deg,#f39c12,#9b59b6)">
      <div class="detail-boss-name">${ballImg('棱镜咕噜球',24)} 咕噜球全图鉴</div>
      <div class="detail-boss-sub">${totalBalls}种咕噜球 · 5大分类 · 获取方式 · 使用推荐</div>
    </div>

    <!-- 快捷导航 -->
    <div class="egg-nav">
      ${D.categories.map((c, i) => {
        const navBallKey = i===0?'normal':i===1?'high':i===2?'temp':i===3?'sleep':'king';
        return `<div class="egg-nav-btn" onclick="document.getElementById('ballSec${i}').scrollIntoView({behavior:'smooth'})" style="color:${c.color};border-color:${c.color}30">${ballImg(navBallKey==='normal'?'普通咕噜球':navBallKey==='high'?'高级咕噜球':navBallKey==='temp'?'调温球':navBallKey==='sleep'?'瞌睡球':'国王咕噜球',14)} ${c.name.substring(0,2)}</div>`;
      }).join('')}
      <div class="egg-nav-btn" onclick="document.getElementById('ballSecTips').scrollIntoView({behavior:'smooth'})">${gIcon('questTale',14)} 指南</div>
    </div>

    <!-- 各分类 -->
    ${D.categories.map((cat, ci) => `
      <div class="detail-section" id="ballSec${ci}">
        <div class="detail-section-title" style="display:flex;align-items:center;gap:6px">
          <span style="width:6px;height:18px;border-radius:3px;background:${cat.color};flex-shrink:0"></span>
          ${ballImg(cat.balls[0].name, 18)}
          ${cat.name} (${cat.balls.length}种)
        </div>
        <div style="font-size:11px;color:#888;margin-bottom:10px">${cat.desc}</div>
        ${cat.balls.map(b => {
          const rColor = b.rarity==='传说'?'#e74c3c':b.rarity==='极稀有'?'#f39c12':b.rarity==='S1限定'?'#9b59b6':b.rarity==='稀有'?'#3498db':b.rarity==='特殊'?'#e67e22':b.rarity==='活动'?'#27ae60':'#999';
          return `<div style="background:#fff;border-radius:12px;padding:12px;margin-bottom:8px;box-shadow:0 1px 4px rgba(0,0,0,.03);border:1px solid #f0f0f0;border-left:3px solid ${b.color}">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
              <div style="width:40px;height:40px;border-radius:12px;background:${b.color}15;display:flex;align-items:center;justify-content:center;flex-shrink:0">
                ${ballImg(b.name, 32)}
              </div>
              <div style="flex:1;min-width:0">
                <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
                  <span style="font-size:14px;font-weight:700;color:#2c3e50">${b.name}</span>
                  <span style="padding:1px 6px;border-radius:6px;font-size:9px;font-weight:700;background:${rColor};color:#fff">${b.rarity}</span>
                </div>
                <div style="font-size:12px;color:${b.color};font-weight:600;margin-top:2px">捕捉率: ${b.rate}</div>
              </div>
            </div>
            <div style="font-size:11px;color:#555;line-height:1.6;margin-bottom:6px;padding:6px 8px;background:#f8f9fa;border-radius:8px">
              ${gIcon('battleOpen',12)} <b>效果:</b> ${b.effect}
            </div>
            <div style="font-size:10px;color:#666;margin-bottom:4px">
              ${gIcon('shop',12)} <b>获取:</b> ${b.obtain}
            </div>
            <div style="font-size:10px;color:#4a6cf7;background:#f0f4ff;padding:5px 8px;border-radius:6px;margin-bottom:4px">
              ${gIcon('questTale',12)} <b>建议:</b> ${b.tips}
            </div>
            <div style="font-size:9px;color:#888">
              ${gIcon('starGold',10)} 最佳使用: ${b.best}
            </div>
          </div>`;
        }).join('')}
      </div>
    `).join('')}

    <!-- 使用指南 -->
    <div class="detail-section" id="ballSecTips">
      <div class="detail-section-title">${gIcon('questTale',16)} 场景使用指南</div>
      <div style="font-size:11px;color:#888;margin-bottom:10px">不同场景用不同球，别浪费珍贵资源</div>
      ${D.usageTips.map(t => {
        const tipBallMap = {normal:'普通咕噜球',high:'高级咕噜球',king:'国王咕噜球',prism:'棱镜咕噜球',soft:'柔软球',sleep:'瞌睡球'};
        const tipBallName = tipBallMap[t.ballKey] || '普通咕噜球';
        return `
        <div style="background:#fff;border-radius:10px;padding:10px 12px;margin-bottom:6px;border-left:3px solid #4a6cf7;display:flex;align-items:flex-start;gap:10px">
          <div style="width:36px;height:36px;border-radius:10px;background:#f0f4ff;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px">
            ${ballImg(tipBallName, 28)}
          </div>
          <div style="flex:1;min-width:0">
            <div style="font-size:12px;font-weight:700;color:#2c3e50;margin-bottom:3px">${t.scene}</div>
            <div style="font-size:11px;color:#4a6cf7;font-weight:600;margin-bottom:2px">${ballImg(tipBallName,12)} 推荐: ${t.rec}</div>
            <div style="font-size:10px;color:#666">${t.detail}</div>
          </div>
        </div>`;
      }).join('')}
    </div>
  `;
}


