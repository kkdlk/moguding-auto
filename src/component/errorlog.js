/*
 * @Author: KKDLK
 * @Date: 2020-11-30 
 * @LastEditTime: 2020-11-30  14:15:23
 * @Description: 异常通知
 */

async function errorLogs(axios, rootSckeys, remText,remDesp) {
    if (rootSckeys) {
        axios.defaults.baseURL = `https://sc.ftqq.com/${rootSckeys}.send`;
        let { data: res } = await axios.request({
            method: "post",
            data: `text=${remText}&desp=${remDesp}`,
        });
        let msg = "";
        if (res.errno == 0) {
            msg = "发送提醒成功！";
        } else {
            msg = "发送提醒失败！" + res.errmsg;
        }
        return msg;
    } else {
        console.log("未设置管理员sckeys错误");
        return ""
    }
}
module.exports = errorLogs;
