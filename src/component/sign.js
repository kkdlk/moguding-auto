/*
 * @Author: KKDLK
 * @Date: 2020-11-30 
 * @LastEditTime: 2020-11-30  14:15:23
 * @Description: 每日打卡签到
 */
//打卡类型  上班或者下班 
function signType () {
    var date = new Date();
    let type = "START";
    if (date.getHours() >= 15) {
      type = "END";
    }
    return type;
  }
  // 签到方法
  async function sign (axios, planId,loginInfo) {
    
    let thisTime = new Date();
    let type = signType();
    let dataForm = {
      device: "iOS",
      planId: planId,
      country: "中国",
      state: "NORMAL",
      attendanceType: "",
      address: loginInfo.address,
      type: type,
      longitude: loginInfo.longitude,
      city: loginInfo.city,
      province: loginInfo.province,
      latitude: loginInfo.latitude,
    };
    try {
        //获取用户自定义的签到时间 
      if (thisTime.getHours()==(loginInfo.signGoToWordTime)){
        let { data: res } = await axios.request({
          method: "post",
          url: "/attendence/clock/v1/save",
          data: dataForm,
        });
        let msg = false;
        if (res.code == 200) {
          console.log(loginInfo.phone+"每日签到成功、当前状态:"+type)
          // 签到成功
          msg = type === "START" ? "上班" : "下班";
        }
        return msg;
        //不在签到时间 获取用户自定义的签退时间 
      } else if(thisTime.getHours()==(loginInfo.signGoOffWordTime)){
          // 发送签到请求
          let { data: res } = await axios.request({
            method: "post",
            url: "/attendence/clock/v1/save",
            data: dataForm,
          });
          let msg = false;
          if (res.code == 200) {
            console.log(loginInfo.phone+"每日签退成功、当前状态:"+type)
            // 签到成功
            msg = type === "START" ? "上班" : "下班";
          }
          return msg;
    }
    } catch (error) {
      console.log(`${loginInfo.phone},签到或签退失败了`)
      await sign (axios, planId,loginInfo);
    }
    return false
  }
  module.exports = sign;
  