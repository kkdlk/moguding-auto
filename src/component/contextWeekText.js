/*
 * @Author: KKDLK
 * @Date: 2020-11-16 02:15
 * @LastEditTime: 2020-11-16 02:15:23
 * @Description: 月报内容生成
 */

let zhoubao1 = require("../context/week/week1.json")
let zhoubao2 = require("../context/week/week2.json")
/**
 * 
 * @param {登錄用戶信息} loginInfo 
 * @param {当前周} weekNum 
 */
function contentTxts(weekNum) {
    var texts = "";
    try {
        let randomWeekJson = Math.round(Math.random() * 1) //随机week1还是week2

        if (randomWeekJson == 0) {
            let result = zhoubao1.data
            texts = result[weekNum].txt;

        } else if (randomWeekJson == 1) {
            let result = zhoubao2.data
            texts = result[weekNum].txt;
        }
        return texts;
    } catch (error) {
        console.log("周报生成失败，重新尝试")
        contentTxts(weekNum)
    }finally{
        if(!texts){
            console.log("周报生成为空或错误")
            contentTxts(weekNum)
        }
    }
}




module.exports = contentTxts;
