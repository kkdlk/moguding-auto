
/*
 * @Author: KKDLK
 * @Date: 2020-11-23 02:15
 * @LastEditTime: 2020-11-16 02:15:23
 * @Description: 开始执行月报
 */
let contextTexts = require("../component/contextText")
// 当前月份最大天数
function mGetDate(){
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var d = new Date(year, month, 0);
    return d.getDate();
} 
/**
 * 月报提交
 * @param {axios} axios 
 * @param {分类} planId 
 * @param {配置} loginInfo 
 */
async function months (axios, planId,loginInfo) {
    let thisTime = new Date();
    let monthTitle = (thisTime.getFullYear())+"年"+(thisTime.getMonth()+1)+"月"+",月报。" //拼接月报标题 格式：2020年11月,月报。
   // let monthNum = mGetDate(); //当月最大天数
   console.log("天"+thisTime.getDate()+"时:"+thisTime.getHours());
    if (thisTime.getDate()==1&&(thisTime.getHours()==loginInfo.signGoToWordTime)) { //
        let contentTxt = contextTexts(loginInfo,7) //月报内容
        if(!monthTitle){
            monthTitle = (thisTime.getFullYear())+"年"+(thisTime.getMonth()+1)+"月"+",月报。"
        }
            let dataForm = {
                attachmentList: [],
                attachments: "",
                content: contentTxt, //月报内容
                planId: planId,
                reportType: "month",
                title: monthTitle //月报标题  上班或休假 每周有2天休假的时间
              }
              sleep(5550)
              try {
                    // 发送月报签到请求
                    let { data: res } = await axios.request({
                        method: "post",
                        url: "/practice/paper/v1/save",
                        data: dataForm,
                    });
                    if (res.code == 200) {
                        return "月报填写成功";
                    }else{
                        console.log(`月报异常！异常信息为:${res.toString()}`)
                        await months (axios, planId,loginInfo)
                    }
              } catch (error) {
                  console.log("月报填写失败"+error)
                  await months (axios, planId,loginInfo)
              }
          
    }else{
        console.log("当前时间不是月初也不在用户设置的月报填写时间内，不写月报哦")
        return "ErrorTimeOut"
    }
    return false;
}

//自己写的一个延迟函数 
function sleep(milliSeconds){ 
    var StartTime =new Date().getTime(); 
    let i = 0;
    while (new Date().getTime() <StartTime+milliSeconds);

}

module.exports = months;
