/*
 * @Author: KKDLK
 * @Date: 2020-11-23 02:15
 * @LastEditTime: 2020-11-16 02:15:23
 * @Description: 开始执行周报
 */


let weekContext  = require("../component/contextWeekText")


   
/**
 * 周报提交
 * @param {axios} axios 
 * @param {分类} planId 
 * @param {配置} loginInfo 
 */
async function weeks (axios, planId,loginInfo) {
    // console.log(`周==============================${loginInfo.starttimedate}`)
    let thisTime = new Date();
    // 周日早上6点-8点之间签到
    if (getWeekDate()=="星期三"&&(thisTime.getHours()==(loginInfo.signGoToWordTime))) { 
        let contentTxt = weekContext(TodayInfo(loginInfo.starttimedate).week); //周报内容
            let dataForm = {
                attachmentList: [],
                attachments: "",
                content: contentTxt, //周报内容
                planId: planId,
                reportType: "week",
                title: "第"+(TodayInfo(loginInfo.starttimedate).week)+"周，周报", //周报标题  
                weeks: "第"+(TodayInfo(loginInfo.starttimedate).week)+"周", // 第x周 从starttimedate开始
                startTime: getFirstDayOfWeek(new Date(),1), // 当前周 开始时间
                endTime: getFirstDayOfWeek(new Date(),7) // 当前周 结束时间
              }
              try {
                   // 发送周报签到请求
                    let { data: res } = await axios.request({
                        method: "post",
                        url: "/practice/paper/v1/save",
                        data: dataForm
                    });
                    if (res.code == 200) {
                        return "周报填写成功";
                    }else{
                        console.log(`周报异常！异常信息为:${res.toString()}`)
                        return weeks (axios, planId,loginInfo)
                    }
              } catch (error) {
                  console.log("周报填写失败"+error)
                  await weeks (axios, planId,loginInfo)
              }
           
    }else{
        console.log("当前时间不是周一,也不在用户设置的周报填写时间内，不写周报哦")
        return "OUTTIME"
    }
    return false;
}



/**
 * 当前时间是周几
 */
function getWeekDate() {
    var now = new Date();
    var day = now.getDay();
    var weeks = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
    var week = weeks[day];
    return week;
}  
/**
 * 获取当前周的周一或者周天的时间
 * @param {时间类型，当前时间} date 
 * @param {返回当前时间的周几} n 
 */
function getFirstDayOfWeek (date,n) {
    var day = date.getDay() || 7;
    let weeksDate =  new Date(date.getFullYear(), date.getMonth(), date.getDate() + n - day)
    var year = weeksDate.getFullYear();
    var month = weeksDate.getMonth()+1;
    var date1 = weeksDate.getDate();   
    if (n==1){
        return [year,month,date1].join('-')+" 00:00:00";
    }if (n==7){
        return [year,month,date1].join('-')+" 23:59:59";
    }
    return "";
};
/**
 * 
 * @param {起始时间} start 
 * 调用 当前时间距离指定时间（start）是第几周
 * var td = TodayInfo("2020/07/20");      
 * console.log("今天是自2020/07/20日，开学以来的第 " + td.week + " 周，今天星期" + td.day);
 */
function TodayInfo(start) {
        var WEEKLEN = 7, // 一周7天为常量
        WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"],
        weekInfo = {"week": null, "day": null}, // 初始化返回信息，默认第null周，星期null
        oneDay = 24 * 60 * 60 * 1000, // 一天的毫秒时长
        weekLeave, // 开学当天所在周剩余天数
        weekStart, // 开学当天start是星期几
        today, // 今天
        dateDiff, // 今天与开学当天日期差
        sDate; //开学之日，日期对象
    var rDateStr = /\d{4}[\/-]\d{1,2}[\/-]\d{1,2}/g; // 简单的日期格式校验：2013/12/19
    if (!rDateStr.test(start)) {
        console.log("请使用合法的开学日期！！！");
        return weekInfo;
    }
    sDate = new Date(start.replace("-", "/"));
    weekStart = sDate.getDay();
    weekStart = weekStart === 0 ? 7 : weekStart; // JS中周日的索引为0，这里转换为7，方便计算

    weekLeave = WEEKLEN - weekStart;
    today = new Date();
    weekInfo.day = WEEKDAYS[today.getDay()];
    today = new Date(today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + today.getDate());
    dateDiff = today - sDate;
    if (dateDiff < 0) {
        console.log("别开玩笑了，你还没开学呢！！！");
        return weekInfo;
    }
    dateDiff = parseInt(dateDiff / oneDay);
    weekInfo.week = Math.ceil((dateDiff - weekLeave) / WEEKLEN) + 1;
    return weekInfo;
}






module.exports = weeks;



