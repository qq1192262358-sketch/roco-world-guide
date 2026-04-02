// ================ 精灵蛋完整攻略数据 ================
// 游戏内蛋相关图标URL (BiliWiki)
const EGG_ICONS = {
  generic:  'https://wiki.biligame.com/rocom/Special:FilePath/%E7%95%8C%E9%9D%A2_%E5%AE%A0%E7%89%A9_%E5%AE%A0%E7%89%A9%E8%9B%8B.png',
  mystery:  'https://wiki.biligame.com/rocom/Special:FilePath/%E7%B2%BE%E7%81%B5_%E7%B2%BE%E7%81%B5%E8%9B%8B_%E7%A5%9E%E5%A5%87%E7%9A%84%E8%9B%8B.png',
  dimo:     'https://wiki.biligame.com/rocom/Special:FilePath/%E7%B2%BE%E7%81%B5_%E7%B2%BE%E7%81%B5%E8%9B%8B_%E8%BF%AA%E8%8E%AB.png',
  huohua:   'https://wiki.biligame.com/rocom/Special:FilePath/%E7%B2%BE%E7%81%B5_%E7%B2%BE%E7%81%B5%E8%9B%8B_%E7%81%AB%E8%8A%B1.png',
  miaomiao: 'https://wiki.biligame.com/rocom/Special:FilePath/%E7%B2%BE%E7%81%B5_%E7%B2%BE%E7%81%B5%E8%9B%8B_%E5%96%B5%E5%96%B5.png',
  shuilan:  'https://wiki.biligame.com/rocom/Special:FilePath/%E7%B2%BE%E7%81%B5_%E7%B2%BE%E7%81%B5%E8%9B%8B_%E6%B0%B4%E8%93%9D%E8%93%9D.png',
  guodong:  'https://wiki.biligame.com/rocom/Special:FilePath/%E7%B2%BE%E7%81%B5_%E7%B2%BE%E7%81%B5%E8%9B%8B_%E6%9E%9C%E5%86%BB.png',
  abu:      'https://wiki.biligame.com/rocom/Special:FilePath/%E7%B2%BE%E7%81%B5_%E7%B2%BE%E7%81%B5%E8%9B%8B_%E9%98%BF%E5%B8%83.png',
  duoduo:   'https://wiki.biligame.com/rocom/Special:FilePath/%E7%B2%BE%E7%81%B5_%E7%B2%BE%E7%81%B5%E8%9B%8B_%E5%A4%9A%E5%A4%9A.png',
  linghu:   'https://wiki.biligame.com/rocom/Special:FilePath/%E7%B2%BE%E7%81%B5_%E7%B2%BE%E7%81%B5%E8%9B%8B_%E7%81%B5%E7%8B%90.png',
};
// 根据精灵名生成BiliWiki蛋图URL
function eggIconUrl(name) {
  return 'https://wiki.biligame.com/rocom/Special:FilePath/%E7%B2%BE%E7%81%B5_%E7%B2%BE%E7%81%B5%E8%9B%8B_' + encodeURIComponent(name) + '.png';
}
const EGG_GUIDE_DATA = {
  // === 蛋组系统 ===
  eggGroups: [
    {
      name: "天空组",
      icon: '<img src="https://patchwiki.biligame.com/images/rocom/8/89/dy3mvf1zwf5gg8l4yud2n115u21e5xt.png" style="width:22px;height:22px;vertical-align:middle">',
      color: "#5dade2",
      pets: ["鸭吉吉","溯源钟","多灵主","高脚鹬","皇家狮鹫","泥吼牙","魔眷鸟","厉毒修萝","武者鸡","粉星仔","岗鸟","翼龙","咔咔鸟","公平鸽","星云旅者","噼啪鸟","帕帕斯卡","彩蝶鲨","花魁蜂后","火羽","翠顶夫人","黑羽夫人","斑枭","锤头鹳","卷毛鸭"],
      desc: "翼系/飞行型精灵为主，包含翼龙、鸟类、蝶类等"
    },
    {
      name: "两栖组",
      icon: '<img src="https://patchwiki.biligame.com/images/rocom/e/e7/112od20cucj3uk93kwe6ewmdvm9ljpg.png" style="width:22px;height:22px;vertical-align:middle">',
      color: "#3498db",
      pets: ["水泡壳","石冠王蜥","鳗尾兽","嗜波螺","翠顶夫人","寒音蛇","深蓝鲸","海豹船长","卷胡巨獭","卡瓦重","黑羽夫人"],
      desc: "水系/爬行类精灵为主，水陆两栖型"
    },
    {
      name: "妖精组",
      icon: '<img src="https://patchwiki.biligame.com/images/rocom/8/85/535i7n5sxc4hmgbaghjtkzy8o2nmx8y.png" style="width:22px;height:22px;vertical-align:middle">',
      color: "#e91e63",
      pets: ["多彩方方","机械方方","异色方方","伊贝儿","果冻","梦悠悠","粉咩咩","棋绮后","帽兜娃娃","立方人","奇梦咪","气球猫","红丝绒","小怂猫","春花兔"],
      desc: "萌系/幻系精灵为主，异色方方是孵蛋核心种马"
    },
    {
      name: "植物组",
      icon: '<img src="https://patchwiki.biligame.com/images/rocom/e/e5/f00mv302xf8kozky0h86csm7yv3umqt.png" style="width:22px;height:22px;vertical-align:middle">',
      color: "#27ae60",
      pets: ["奇丽花","蹦蹦花","魔力猫","格兰球","蒲公英","菊花梨","大嘴花","魔草巫灵","花影羚羊","锥尾羊","铃兰羊"],
      desc: "草系精灵为主，通过妖精组的格兰种子可跳入此组"
    },
    {
      name: "昆虫组",
      icon: '<img src="https://patchwiki.biligame.com/images/rocom/c/c4/t8pzzovmprqe2dklcumxumhcim2cpz3.png" style="width:22px;height:22px;vertical-align:middle">',
      color: "#6c8c24",
      pets: ["化蝶","花衣蝶","柴渣虫","旋叶虫","铠甲虫","千棘盔","花魁蜂后","一窝蜂","黄蜂后","圆角蜘蛛","蓬叶虫","小草虫","海盔虫","卡卡虫"],
      desc: "虫系精灵为主，通过柴渣虫可从妖精组跳入"
    },
    {
      name: "机械组",
      icon: '<img src="https://patchwiki.biligame.com/images/rocom/2/20/5g87qfg4ofxihlpol5yhbv629hh8fsm.png" style="width:22px;height:22px;vertical-align:middle">',
      color: "#7f8c8d",
      pets: ["仪式巨像","立方人","多彩方方","机械方方","异色方方","权杖-Ⅱ","权杖-Ⅴ","小皮球"],
      desc: "机械系精灵，异色方方同时属于妖精组和机械组"
    },
    {
      name: "动物组",
      icon: '<img src="https://patchwiki.biligame.com/images/rocom/5/56/guda8zus94dhx7i0d2zfb2b3nyczqvz.png" style="width:22px;height:22px;vertical-align:middle">',
      color: "#e67e22",
      pets: ["护主犬","音速犬","恶魔狼","九尾狐","灵狐","狮鹫","月牙雪熊","雪蛮人","獠牙猪","呼呼猪","星光狮","抱枕松鼠","燕尾獭","贪食鼹","影狸"],
      desc: "陆地动物型精灵，组内精灵较难获取种马"
    },
    {
      name: "矿物组",
      icon: '<img src="https://patchwiki.biligame.com/images/rocom/3/31/p1ia7t6zxk47w57xrs7hkmqmt07owzd.png" style="width:22px;height:22px;vertical-align:middle">',
      color: "#8d6e63",
      pets: ["晶石蜗","矿晶虫","石冠王蜥","石肤蜥","布克棱岩","布是石","巨灵石","记忆石"],
      desc: "地系/岩石型精灵为主"
    }
  ],

  // === 生蛋规则 ===
  breedRules: [
    {title:"性别要求", text:"必须一公一母配对，后代物种由母方决定", icon:'<img src="https://patchwiki.biligame.com/images/rocom/8/85/535i7n5sxc4hmgbaghjtkzy8o2nmx8y.png" style="width:18px;height:18px;vertical-align:middle">'},
    {title:"蛋组限制", text:"两只精灵必须属于同一蛋组才能生蛋（跨组不可繁殖）", icon:'<img src="https://patchwiki.biligame.com/images/rocom/2/22/iazf7tgi59w00bctm7o7xugenug7byw.png" style="width:18px;height:18px;vertical-align:middle">'},
    {title:"小窝摆放", text:"家园中两个精灵小窝必须紧挨着放，需家园升到2级获得2个小窝", icon:'<img src="https://patchwiki.biligame.com/images/rocom/1/13/o5evcztzo2vp80qd8qt70m2csme2ami.png" style="width:18px;height:18px;vertical-align:middle">'},
    {title:"喂食要求", text:"需给精灵喂食，性格合适时冒爱心；被讨厌可能生不出来", icon:'<img src="https://patchwiki.biligame.com/images/rocom/3/3c/imw150a0agztfv9p59gkq5ds4e3yyh9.png" style="width:18px;height:18px;vertical-align:middle">'},
    {title:"生蛋时间", text:"0.5~20小时不等，可通过星星魔法加速", icon:'<img src="https://patchwiki.biligame.com/images/rocom/8/8c/7qsncvokm4oj6mrqybvz9y6m67i27mt.png" style="width:18px;height:18px;vertical-align:middle">'},
    {title:"孵化方式", text:"通过游戏内移动距离（包括飞行）推进孵化进度，一次最多孵化3个蛋", icon:'<img src="https://patchwiki.biligame.com/images/rocom/8/8f/gf4gxtq1rrxe7ue7rba6jhdb1xndc1x.png" style="width:18px;height:18px;vertical-align:middle">'},
    {title:"不可繁殖", text:"战令精灵、团本精灵（翼王/帕尔/犀角鸟/绒绒）不能生蛋", icon:'<img src="https://patchwiki.biligame.com/images/rocom/9/97/3smp6ncwfp80ojpejrwgfymuty9al7e.png" style="width:18px;height:18px;vertical-align:middle">'},
    {title:"污染可生", text:"被污染的精灵可以正常生蛋", icon:'<img src="https://patchwiki.biligame.com/images/rocom/7/79/aq94yh30sv2nmv2wip253qpl92sea68.png" style="width:18px;height:18px;vertical-align:middle">'},
    {title:"地点限制", text:"只能在自己的家园世界里生蛋，不能在别人家", icon:'<img src="https://patchwiki.biligame.com/images/rocom/a/a2/fy2t2skpj760pxc13za2crcz2y7t5jd.png" style="width:18px;height:18px;vertical-align:middle">'}
  ],

  // === 异色炫彩遗传 ===
  shinyRules: [
    {title:"异色遗传", text:"父母一方为异色精灵时，后代有较高概率产出异色蛋", icon:'<img src="https://patchwiki.biligame.com/images/rocom/8/8c/7qsncvokm4oj6mrqybvz9y6m67i27mt.png" style="width:16px;height:16px;vertical-align:middle">', color:"#f39c12"},
    {title:"炫彩遗传", text:"父母一方为炫彩精灵时，后代有概率产出炫彩蛋", icon:'<img src="https://patchwiki.biligame.com/images/rocom/5/57/6qogppaucbc9vkau3br8zmc489d2ey9.png" style="width:16px;height:16px;vertical-align:middle">', color:"#e91e63"},
    {title:"双稀有", text:"双亲均为异色+炫彩时，极小概率爆出异色+炫彩蛋（不可赠送）", icon:'<img src="https://patchwiki.biligame.com/images/rocom/0/03/pvagjt26i89098s86vwnz16gzguk70i.png" style="width:16px;height:16px;vertical-align:middle">', color:"#9b59b6"},
    {title:"普通也有概率", text:"即使父母都是普通精灵，也有极低概率突变出异色/炫彩蛋", icon:'<img src="https://patchwiki.biligame.com/images/rocom/7/79/aq94yh30sv2nmv2wip253qpl92sea68.png" style="width:16px;height:16px;vertical-align:middle">', color:"#3498db"},
    {title:"自选炫彩蛋", text:"同一精灵获取10次炫彩个体后解锁自选花纹和颜色", icon:'<img src="https://patchwiki.biligame.com/images/rocom/7/77/s14q7jvw01vfy0ta43vd5juk10tmngq.png" style="width:16px;height:16px;vertical-align:middle">', color:"#27ae60"}
  ],

  // === 异色方方孵蛋法（核心玩法） ===
  shinyMethod: {
    title: "异色方方孵蛋法（种马法）",
    desc: "利用异色方方跨组传播异色/炫彩特性的核心玩法，可批量产出赛季限定异色炫彩精灵。",
    steps: [
      "第一步：获取异色方方 — 商店街西找到立方人NPC，完成4天任务获得",
      "第二步：确认性别 — 如果是公的异色方方，周围放8只普通雌方方生蛋，用棱镜球接生异色炫彩公方方",
      "第三步：如果是母的异色方方，放在中间，周围放不同蛋组的公精灵配对",
      "第四步：妖精组→植物组 — 异色方方生格兰种子，格兰种子可混植物组",
      "第五步：妖精组→昆虫组 — 异色方方生柴渣虫，柴渣虫可混昆虫组",
      "第六步：逐步扩散 — 每得到新的异色/炫彩精灵，就让它去对应蛋组继续传播",
      "最终目标：让所有蛋组都有异色炫彩种马，批量产出13只赛季限定异色炫彩精灵"
    ],
    tips: "用棱镜球接生炫彩蛋必定获得炫彩+了不起的天分。国王球接生异色/炫彩蛋也必定了不起的天分。"
  },

  // === 精灵蛋类型 ===
  eggTypes: [
    {name:"普通蛋", desc:"普通配对产出，孵化为普通精灵。后代物种由母方决定，资质随机", ball:"普通咕噜球即可接生，不浪费高级球", color:"#999", icon:EGG_ICONS.generic, ballKey:"normal"},
    {name:"异色蛋", desc:"父母一方为异色精灵时概率产出。孵化必定为异色外观个体，外观有独特配色", ball:"国王球接生→必定[了不起天分](3条7~10资质)", color:"#f39c12", icon:EGG_ICONS.dimo, ballKey:"king"},
    {name:"炫彩蛋", desc:"父母一方为炫彩精灵时概率产出。孵化必定为炫彩外观个体，拥有独特花纹", ball:"国王球接生→必定[了不起天分] | 棱镜球→满资质+炫彩", color:"#e91e63", icon:EGG_ICONS.huohua, ballKey:"prism"},
    {name:"异色炫彩蛋", desc:"双亲均为异色+炫彩时极小概率产出。孵化后同时拥有异色和炫彩外观，极其稀有(不可赠送)", ball:"棱镜球接生→炫彩+了不起天分(满资质)", color:"#9b59b6", icon:EGG_ICONS.miaomiao, ballKey:"prism"},
    {name:"完美蛋", desc:"特定途径获得(如任务奖励)，必定了不起天分。相当于省一个国王球", ball:"普通咕噜球即可，不浪费国王球", color:"#27ae60", icon:EGG_ICONS.guodong, ballKey:"normal"},
    {name:"剧情蛋", desc:"主线NPC伊里斯赠送的小独角兽蛋。必定[了不起天分]+[同乘特长]，是免费获取的强力精灵", ball:"普通球即可接生", color:"#3498db", icon:EGG_ICONS.abu, ballKey:"normal"},
    {name:"自选炫彩蛋", desc:"同一精灵获取10次炫彩个体后解锁。可自选花纹和颜色，是炫彩收集的最终形态", ball:"看需求选择(棱镜球保满资质)", color:"#e67e22", icon:EGG_ICONS.linghu, ballKey:"prism"},
    {name:"神秘蛋", desc:"野外NPC对战胜利获得。概率出炫彩个体，是免费获取炫彩的途径之一", ball:"看实际需求(一般普通球即可)", color:"#8e44ad", icon:EGG_ICONS.mystery, ballKey:"normal"}
  ],

  // === 13个隐藏精灵蛋 ===
  hiddenEggs: [
    {name:"九尾狐", location:"岚语峰断桥", method:"沿楼梯下到隐藏副本平台直接捕捉", condition:"无条件，新手优先", difficulty:1, worth:"★★★★ 火系强力输出"},
    {name:"酷拉", location:"王国监狱监管区高台石像", method:"用水系精灵召唤雨天后出现", condition:"需水系精灵+雨天天气", difficulty:2, worth:"★★★★★ 极速秒杀之王"},
    {name:"花伊蝶", location:"丰裕谷左侧石像旁", method:"用水系精灵召唤雨天后出现", condition:"需水系精灵+雨天天气", difficulty:2, worth:"★★★ 虫系进化"},
    {name:"小草虫", location:"丰裕谷传送点左侧", method:"用地系精灵引发沙尘暴", condition:"需地系精灵+沙尘暴", difficulty:2, worth:"★★★ 草系进化"},
    {name:"石石", location:"丰裕谷传送点左侧", method:"和小草虫同时出现", condition:"同上，一次获取两枚", difficulty:2, worth:"★★★ 地系进化"},
    {name:"小箱怪", location:"圣所前哨下方", method:"找到伪装宝箱互动触发战斗", condition:"击败后获得蛋", difficulty:2, worth:"★★★ 趣味收藏"},
    {name:"幽影树", location:"月兔暗港地下沉船旁树桩", method:"投掷精灵触发战斗，连续3天", condition:"需连续3天操作", difficulty:3, worth:"★★★★ 幽系控场"},
    {name:"记忆石", location:"梦兽之森/叽叽喳喳台地书堆", method:"攻击书堆使其现形后直接捕捉", condition:"找到书堆位置", difficulty:2, worth:"★★★ 特殊收藏"},
    {name:"布丁", location:"长颈鹿下方井口(下水道)", method:"先到彼得大道精灵道具店学液化术", condition:"需先学习液化术", difficulty:3, worth:"★★★ 趣味精灵"},
    {name:"异色方方", location:"招商街西(立方人NPC)", method:"接取材料收集任务，连续4天完成", condition:"连续4天任务", difficulty:3, worth:"★★★★★ 孵蛋核心种马"},
    {name:"恶魔狼", location:"招商街西(NPC克洛伊)", method:"完成克洛伊的隐藏任务", condition:"隐藏任务", difficulty:3, worth:"★★★★ 恶系强力输出"},
    {name:"小夜", location:"商店街安妮商店内", method:"与闲逛女孩对话触发战斗", condition:"击败后获得蛋", difficulty:1, worth:"★★★ 暗系精灵"},
    {name:"幽兰雪魅", location:"冰晶解谜(位置需探索)", method:"夜间(20-05点)+雪雾天气+火系融化四处冰晶", condition:"时间+天气+解谜", difficulty:5, worth:"★★★★★ 极稀有冰系传说"}
  ],

  // === 神秘蛋位置 ===
  mysteryEggs: [
    {location:"信仰者部落上方石桥下", npc:"欧洛丝", method:"与欧洛丝对话触发战斗，胜利获得", note:"概率出炫彩", pet:"贝瑟", desc:"毒系精灵，对战型"},
    {location:"月影钓场", npc:"钓鱼老头", method:"与老头对战胜利获得", note:"随机蛋", pet:"波波螺", desc:"水系精灵，治疗型"},
    {location:"可可果广场", npc:"帽子男", method:"与帽子男对话触发战斗胜利获得", note:"随机蛋", pet:"多多", desc:"草系精灵，辅助型"},
    {location:"皇家办事处下方露天亭", npc:"醉鬼", method:"与看鸭子的醉鬼对战胜利获得", note:"随机蛋", pet:"小鹬", desc:"翼系精灵，速度型"},
    {location:"捞船镇传送点", npc:"吵架的船员", method:"传送后与吵架船员对战胜利获得", note:"随机蛋", pet:"栗鼠", desc:"普通系精灵，攻击型"}
  ],

  // === 棱镜球使用建议 ===
  prismBall: {
    desc: "棱镜球是游戏中最珍贵的精灵球，100%捕捉成功+100%炫彩异色+高资质了不起天分。开服赠送数量极少（1-2个），后续可通过合成获取但成本极高。",
    effect: "100%捕捉成功率 + 必出炫彩异色形态 + 了不起的天分(最高资质)",
    obtain: "开服活动赠送(1-2个)、WeGame启动奖励(概率)、18级解锁合成系统(材料稀缺)",
    ranking: [
      {name:"罗隐", tier:"T0", reason:"PVE永动机，地图不会刷新，从开荒用到满级，实力+情怀双顶", type:"强度优先"},
      {name:"龙息帕尔", tier:"T0", reason:"赛季传说精灵，龙系核心输出，建模优化后颜值在线", type:"强度优先"},
      {name:"圣羽翼王", tier:"T0", reason:"黑白翼炫彩形态极帅，翼系核心输出+先手", type:"外观优先"},
      {name:"白金独角兽", tier:"T1", reason:"最强治疗，造型优雅，异色炫彩非常好看", type:"外观+实用"},
      {name:"嘟嘟锅", tier:"T1", reason:"PVE毒耗通杀王，但造型偏朴素，看个人", type:"强度优先"},
      {name:"雪影娃娃", tier:"T1", reason:"异色炫彩非常可爱，社交价值极高", type:"外观+社交"},
      {name:"酷拉", tier:"T2", reason:"极速秒杀王，PVP核心，但后续可能有替代", type:"PVP优先"},
      {name:"暂存不用", tier:"建议", reason:"等待未来新精灵（如冰龙王、萌之王者）再决定", type:"保守策略"}
    ]
  }
};
