/*
 * @Author: KKDLK
 * @Date: 2020-11-30 
 * @LastEditTime: 2020-11-30  14:15:23
 * @Description: 登录操作
 */
async function login(axios, loginInfo) {
    console.log("2.开始清空token，并使用账号密码登陆获取token")
    axios.defaults.headers.Authorization = ""; // 情空携带的token 使用账号密码登陆
    let dataForm = {
        phone: loginInfo.phone,
        password: loginInfo.password,
        loginType: "iso",
    };
   try {
    let { data: res } = await axios.request({
        method: "post",
        url: "/session/user/v1/login",
        data: dataForm,
    });
    if (res.code == 200) {
        // 登录成功
        console.log(`${loginInfo.kkdaj}:3.Token登录获取成功！`)
        return res.data.token;
    } 
    // 登录失败
   } catch (error) {
        console.log("3.Token登录获取失败ERROR！")
   }
    return false;
}
module.exports = login;
 










module.exports = login;