/*
 * @Author: KKDLK
 * @Date: 2020-11-30 
 * @LastEditTime: 2020-11-30  14:15:23
 * @Description: 提醒模块
 */
async function reqMsg(axios, loginInfo, reMindMsg) {
  if(loginInfo.sckey){
  axios.defaults.baseURL = `https://sc.ftqq.com/${loginInfo.sckey}.send`;
  let { data: res } = await axios.request({
    method: "post",
    data: `text=${reMindMsg.text}&desp=${reMindMsg.desp}`,
  });
  let msg = "";
  if (res.errno == 0) {
    msg = "发送提醒成功！";
  } else {
    msg = "发送提醒失败！" + res.errmsg;
  }
  return msg;
  }else{
    console.log("未设置提示模块信息:未设置key值");
    return ""
  }
}
module.exports = reqMsg;
