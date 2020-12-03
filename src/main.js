/*
 * @Author: KKDLK
 * @Date: 2020-11-30 
 * @LastEditTime: 2020-11-30  14:15:23
 * @Description: 获取签到的ID
 */
let axios = require("axios");
let fs = require('fs'); //文件模块
let path = require('path'); //系统路径模块


let planId = require('./component/planId')
let login = require('./component/login')
let sign = require('./component/sign')
let resendMsg = require('./component/reqMsg')
let daily = require("./component/daily")
let month = require("./component/month")
let weeks = require("./component/weeks");
let errorlog = require("./component/errorlog");
const { log } = require("console");
const { throws } = require("assert");

let reMindMsg = {
    // 消息标题
    text: "☎ 欢迎使用【品尝蘑菇】,联系作者qq:1161493927 ☎",
    // 消息主体
    desp: "🌹欢迎使用【品尝蘑菇】,蘑菇丁自动打卡，自动日报周报月报，微信提示信息。🌹"
};

const nowDate = new Date();

//自己写的一个延迟函数 
function sleep(milliSeconds) {
    var StartTime = new Date().getTime();
    let i = 0;
    while (new Date().getTime() < StartTime + milliSeconds);
}
console.log("现在时间" + nowDate);
(function () {
    //文件路径，__dirname为当前运行js文件的目录
    var file = path.join(__dirname, 'context/main.json');
    fs.readFile(file, 'utf-8', function (err, data) {
        if (err)
            throw console.info("读取文件失败")
        // 解析为json
        let loginInfos = eval('(' + data + ')');
        let rootKey = loginInfos.RootSckey;
        // 循环账号进行操作
        (loginInfos.loginData).forEach(async loginInfo => {
            try {
                // 基础url
                axios.defaults.baseURL = "https://api.moguding.net:9000";
                if (loginInfo.kkdaj) { log(`开始操作${loginInfo.kkdaj}的账户！`) }
                let planIds = "";
                // 填写了token 执行内部 无token 直接登录
                if (loginInfo.token) {
                    console.log("1.携带token，开始校验token")
                    // 1.让请求携带token
                    axios.defaults.headers.Authorization = loginInfo.token;
                    //2.循环账号校验，首先判断他的token是否可用 如果可用获取到planId 如果不可用返回errorToken
                    planIds = await planId(axios);
                    //2.1 不可用进行登录获取token 
                    if (planIds == "errorToken") {
                        let token = await login(axios, loginInfo);
                        if (token == false) {
                            console.error(`${loginInfo.kkdaj}的账号或密码错误,账号为${loginInfo.phone}---登录失败，程序停止---`);
                            if (loginInfo.sckey) {
                                // 通知他们带提示的人
                                await errorlog(axios, loginInfo.sckey, `错误!账号或密码错误`, `该密码请提前告知，不然除了问题不负责！`);
                            }
                            // 通知管理员
                            await errorlog(axios, rootKey, `错误!账号或密码错误`, `标记:${loginInfo.kkdaj}账号为：${loginInfo.phone}的账号或密码错误`);
                            return;
                        }
                        axios.defaults.headers.Authorization = token;
                        planIds = await planId(axios);
                    }
                } else {
                    console.log("1.无token直接登录")
                    let token = await login(axios, loginInfo);
                    if (token == false) {
                        if (loginInfo.sckey) {
                            await errorlog(axios, loginInfo.sckey, `错误!账号或密码错误`, `该密码请提前告知，不然除了问题不负责！`);
                        }
                        await errorlog(axios, rootKey, `错误!账号或密码错误`, `标记:${loginInfo.kkdaj}账号为：${loginInfo.phone}的账号或密码错误`)
                        console.error(`${loginInfo.kkdaj}的账号或密码错误,账号为${loginInfo.phone}---登录失败，程序停止---`);
                        return;
                    }
                    axios.defaults.headers.Authorization = token;
                    planIds = await planId(axios);
                }
                // await resendMsg(axios, loginInfo, reMindMsg); //发送广告消息

                console.log("登录成功获取到的planId为：" + planIds)
                if (planIds) {
                    console.log(`${loginInfo.kkdaj}main.js:59---经过token或者登陆成功得到的planIds:${planIds}`)
                    //2.签到
                    let signStatus = await sign(axios, planIds, loginInfo)
                    if (signStatus) { // 每日签到成功
                        console.log(`${nowDate}，${loginInfo.phone}每日签到的${signStatus}成功，现在进行每日日报`);
                        // 3.日报
                        let dayStatus = await daily(axios, planIds, loginInfo);
                        if (dayStatus) {
                            if (dayStatus != "OUTTIME") {
                                // 签到成功 日报成功 发消息提示
                                reMindMsg.text =
                                    `🎉 ${nowDate.getFullYear()}年${nowDate.getMonth() + 1}月${nowDate.getDate()}日 
                        【${loginInfo.phone}的蘑菇丁每日签到${signStatus}成功！日报：${dayStatus}！！！！！！】 🎉`;
                                reMindMsg.desp = `${loginInfo.phone}的蘑菇丁每日签到${signStatus}成功，日报：${dayStatus}！！！！！！`;
                                //       msg ______    发送消息
                                await resendMsg(axios, loginInfo, reMindMsg);
                            } else {
                                console.log(`${loginInfo.kkdaj},${loginInfo.phone}，日报不执行，不在用户设置的日报时间段内！`)
                            }
                        } else {
                            // 签到成功 日报失败 发消息提示
                            reMindMsg.text =
                                `🎉 ${nowDate.getFullYear()}年${nowDate.getMonth() + 1}月${nowDate.getDate()}日 
                    【${loginInfo.phone}的蘑菇丁每日签到${signStatus}成功！日报失败！！！！！！】 🎉`;
                            reMindMsg.desp = `${loginInfo.phone}的蘑菇丁每日签到${signStatus}成功，日报失败！！！！！！`;
                            //       msg ______    发送消息
                            await resendMsg(axios, loginInfo, reMindMsg);
                        }
                    } else {
                        console.log(`当前时间不在用户${loginInfo.kkdaj},${loginInfo.phone}设置的签到和签退时间内，签到失败！`)
                    }
                    //4.周报
                    //~~~~~~~~~~~~~~~~~ 周报汇报结果
                    sleep(2000)
                    try {
                        const weeksResult = await weeks(axios, planIds, loginInfo)
                        if (weeksResult) {
                            if (weeksResult != "OUTTIME") {
                                reMindMsg.text = `🎉 ${nowDate.getFullYear()}年${nowDate.getMonth() + 1}月${nowDate.getDate()}日 蘑菇丁【${loginInfo.phone}的${weeksResult}】 🎉`;
                                reMindMsg.desp = `${loginInfo.phone}的周报：${weeksResult}`;
                                //       msg ______    发送消息
                                await resendMsg(axios, loginInfo, reMindMsg);
                            }
                        } else {
                            reMindMsg.text = `🎉 ${nowDate.getFullYear()}年${nowDate.getMonth() + 1}月${nowDate.getDate()}日 蘑菇丁【${loginInfo.phone}的周报${weeksResult}】 🎉`;
                            reMindMsg.desp = `${loginInfo.phone}的周报：错误！`;
                            //       msg ______    发送消息
                            await resendMsg(axios, loginInfo, reMindMsg);
                        }
                    } catch (error) {
                        throw `${loginInfo.kkdaj}的${loginInfo.phone}【周报】异常异常信息:${error}`
                    }
                    sleep(2000)
                    try {
                        //5.月报
                        const monthResult = await month(axios, planIds, loginInfo)
                        if (monthResult) { //返回true
                            if (monthResult != "ErrorTimeOut") { //在时间范围内并且返回true 就提示成功
                                reMindMsg.text = `🎉 ${nowDate.getFullYear()}年${nowDate.getMonth() + 1}月${nowDate.getDate()}日 蘑菇丁【${loginInfo.phone}的月报${monthResult}】 🎉`;
                                reMindMsg.desp = `${loginInfo.phone}的月报：${monthResult}`;
                                //       msg ______    发送消息
                                await resendMsg(axios, loginInfo, reMindMsg);
                            }
                        } else {
                            reMindMsg.text = `🎉 ${nowDate.getFullYear()}年${nowDate.getMonth() + 1}月${nowDate.getDate()}日 蘑菇丁【${loginInfo.phone}的月报${monthResult}】 🎉`;
                            reMindMsg.desp = `${loginInfo.phone}的月报：错误`;
                            //       msg ______    发送消息
                            await resendMsg(axios, loginInfo, reMindMsg);
                        }
                    } catch (error) {
                        throw `${loginInfo.kkdaj}的${loginInfo.phone}【月报】异常异常信息:${error}`
                    }
                    sleep(15555)
                    return true;
                } else {
                    log("获取planid错误")
                    return;
                }
            } catch (error) {
                console.log(`${loginInfo.phone}的日报或每日签到异常:${error}`);
                // 异常通知给管理员
                await errorlog(axios, rootKey, `${nowDate}日报或每日签到异常`, `标记:${loginInfo.kkdaj}账号为：${loginInfo.phone}的日报或每日签到异常`)
            }
        });
    });
})();
