/*
 * @Author: KKDLK
 * @Date: 2020-11-30 
 * @LastEditTime: 2020-11-30  14:15:23
 * @Description: 获取签到的ID
 */
async function planId(axios) {
    try {
        let dataForm = {
            paramsType: "student"
          };
          let { data: res } = await axios.request({
            method: "post",
            url: "/practice/plan/v1/getPlanByStu",
            data: dataForm,
            headers: {
              'roleKey': 'student'
            }
          });
          // token可用 返回planId
          if(res.code==200) {
            console.log("===========Token可以使用==========")
            return res.data.pop().planId;
          }else if(res.code==401){
            //token 不可用 登录获取token 然后在重新获取 planid
            console.log("1.--------------TOKEN过期了-----------");
            return "errorToken";
          }else {
            return false;
          }
    } catch (error) {
        console.log("planId异常:"+error)
    }
  }
  module.exports = planId;
  