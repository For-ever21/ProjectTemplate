const tokens = {
  admin: {
    token:
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2MTc4OTE2Mzc5MjEsInBheWxvYWQiOiJcIkFHV1JlemVhS2tNUU13d2VMdXh1eXdpRWlFXCIifQ.HZjDRsYJFmBMKO2MkZDS86E0CS_aPARO72mSYDHJVqQ",
  },
  editor: {
    token: "editor-token",
  },
};

const users = {
  introduction: "I am a super administrator",
  avatar: "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
  name: "超级管理员",
};

module.exports = [
  // 用户登录
  {
    url: "/api/user/login",
    type: "post",
    response: (config) => {
      const { username } = config.body;
      const token = tokens[username];

      // mock error
      if (!token) {
        return {
          status: 500,
          message: "账号密码不正确！",
        };
      }
      return {
        status: 200,
        data: token,
      };
    },
  },

  // 获取用户信息
  {
    url: "/api/user/info",
    type: "get",
    response: () => {
      // const { token } = config.query;
      const info = users;

      // mock error
      if (!info) {
        return {
          status: 500,
          message: "身份信息获取错误",
        };
      }

      return {
        status: 200,
        data: info,
      };
    },
  },

  // 登出
  {
    url: "/api/user/logout",
    type: "post",
    response: () => {
      return {
        status: 200,
        data: "success",
      };
    },
  },
];
