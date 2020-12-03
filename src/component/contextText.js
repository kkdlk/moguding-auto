
/*
 * @Author: KKDLK
 * @Date: 2020-11-16 02:15
 * @LastEditTime: 2020-11-16 02:15:23
 * @Description: 生成主体内容
 */
let huli = require("../context/day/huliDay.json")
let java = require("../context/day/javaDay.json")
let xueqianjiaoyu = require("../context/day/xueqianjiaoyuDay.json")
let cday = require("../context/day/cDay.json")


let yaoxue = require("../context/day/yaoxueDay.json")
let chudengjiaoyu = require("../context/day/chudengjiaoyuDay.json")
let wuliuguanli = require("../context/day/wuliuguanliDay.json")
let kuaiji = require("../context/day/kuaijiDay.json")
let ceshi = require("../context/day/ceshiDay.json")

// 日报内容生成

/**
 * 护理、JAVA、学前教育、C#、测试、药学、初等教育、物流管理、会计、
 * @param {从配置中获取专业} loginInfo.leableati
 * @param {迭代次数} iterNum 
 */
function contentTxts(loginInfo, iterNum) {
  try {
    if (iterNum == 2) { console.log("日报内容生成开始") } else if (iterNum == 3) { console.log("周报内容生成开始") } else if (iterNum == 4) { console.log("月报内容生成开始"); }
    let college = loginInfo.leableati;
    console.log("专业是:" + college)
    if (college == "护理") {
      var result = huli.data
      var texts = "";
      let reslength = result.length
      for (let index = 0; index < iterNum; index++) {
        let resultRandomLength = Math.round(Math.random() * reslength) // 从0~数据长度 角标
        texts += result[resultRandomLength].txt;
        texts += ";";
      }
      return texts;
    } else if (college == "JAVA") {
      var result = java.data
      var texts = "";
      let reslength = result.length
      for (let index = 0; index < iterNum; index++) {
        let resultRandomLength = Math.round(Math.random() * reslength) // 从0~数据长度 角标
        texts += result[resultRandomLength].txt;
        texts += ";";
      }
      return texts;
    } else if (college == "学前教育") {
      var result = xueqianjiaoyu.data;
      var texts = ""
      let reslength = result.length
      for (let index = 0; index < iterNum; index++) {
        let resultRandomLength = Math.round(Math.random() * reslength) // 从0~数据长度 角标
        texts += result[resultRandomLength].txt;
        texts += ";";
      }
      return texts;
    } else if (college == "C#") {
      var result = cday.data;
      var texts = ""
      let reslength = result.length
      for (let index = 0; index < iterNum; index++) {
        let resultRandomLength = Math.round(Math.random() * reslength) // 从0~数据长度 角标
        texts += result[resultRandomLength].txt;
        texts += ";";
      }
      return texts;
    } else if (college == "药学") {
      var result = yaoxue.data;
      var texts = ""
      let reslength = result.length
      for (let index = 0; index < iterNum; index++) {
        let resultRandomLength = Math.round(Math.random() * reslength) // 从0~数据长度 角标
        texts += result[resultRandomLength].txt;
        texts += ";";
      }
      return texts;
    } else if (college == "初等教育") {
      var result = chudengjiaoyu.data;
      var texts = ""
      let reslength = result.length
      for (let index = 0; index < iterNum; index++) {
        let resultRandomLength = Math.round(Math.random() * reslength) // 从0~数据长度 角标
        texts += result[resultRandomLength].txt;
        texts += ";";
      }
      return texts;
    } else if (college == "物流管理") {
      var result = wuliuguanli.data;
      var texts = ""
      let reslength = result.length
      for (let index = 0; index < iterNum; index++) {
        let resultRandomLength = Math.round(Math.random() * reslength) // 从0~数据长度 角标
        texts += result[resultRandomLength].txt;
        texts += ";";
      }
      return texts;
    } else if (college == "会计") {
      var result = kuaiji.data;
      var texts = ""
      let reslength = result.length
      for (let index = 0; index < iterNum; index++) {
        let resultRandomLength = Math.round(Math.random() * reslength) // 从0~数据长度 角标
        texts += result[resultRandomLength].txt;
        texts += ";";
      }
      return texts;
    } else if (college == "测试") {
      var result = ceshi.data;
      var texts = ""
      let reslength = result.length
      for (let index = 0; index < iterNum; index++) {
        let resultRandomLength = Math.round(Math.random() * reslength) // 从0~数据长度 角标
        texts += result[resultRandomLength].txt;
        texts += ";";
      }
      return texts;
    }
    console.log("没有内置这个专业")
    return "";
  } catch (error) {
    console.log(`内容生成异常重新尝试`);
    contentTxts(loginInfo, iterNum)
  } finally {
    if (!texts) {
      contentTxts(loginInfo, iterNum)
    }
  }
}

module.exports = contentTxts;