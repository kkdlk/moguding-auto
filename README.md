## 声明

蘑菇丁自动登录，自动签到，日报，周报，月报填写,支持批量导入信息和自定义信息

优化了信息提示模块；

添加了Token过期，自动签到，自动生成日报信息，自动生成周报信息，自动生成月报信息，等模块

添加了各个模块的注释，和简单异常的处理
---------------------------------
## 相关参数和注意事项

```
{
  "RootSckey":"管理员的Server酱秘钥，http://sc.ftqq.com/3.version",
  "loginData": [
    {
      "kkdaj":"张哥",
      "phone": "用户蘑菇丁账号",
      "password": "用户蘑菇丁账号",
      "sckey": "server酱密钥绑定可通知微信：http://sc.ftqq.com/3.version,可为空",
      "token": "用户蘑菇丁TOKEN，可为空",
      "leableati": "专业：护理、JAVA、学前教育、C#、测试、药学、初等教育、物流管理、会计、",
      "starttimedate": "周报开始时间,格式为：2020-11-23或者2020-07-20",
      "province": "西安市",
      "city": "新城区",
      "address": "西安市第四医院",
      "longitude": "经度 经纬度在线获取：http://www.daquan.la/jingwei/",
      "latitude": "维度  经纬度在线获取： http://www.daquan.la/jingwei/",
      "signGoToWordTime":"8 代表日报和上班打卡每天早上8点开始，周报每周一早上8点，月报每月早上8点开始",
      "signGoOffWordTime":"18 代标下班打卡每天18点开始"
    }
  ]
}

```
### 注意事项

context文件夹中 main.json是配置批量导入账号信息的、文件夹中其他文件是各专业的日报月报周报信息

账号信息不可重复添加，重复添加会进行多次打卡！！！！！！！！！！切记

main.js是核心文件切勿乱改。 账号密码请确保正确否则会锁定账号


---------------------------------

## 静态配置的Jenkinsfile

````
pipeline {
  agent any
  stages {
    stage('检出') {
      steps {
        checkout([
          $class: 'GitSCM',
          branches: [[name: GIT_BUILD_REF]],
          userRemoteConfigs: [[
            url: GIT_REPO_URL,
            credentialsId: CREDENTIALS_ID
          ]]])
        }
      }
      stage('安装环境') {
        steps {
          sh '''yarn install
cd ./src
node main.js'''
        }
      }
    }
  }
````