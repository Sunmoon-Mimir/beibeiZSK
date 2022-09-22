<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import jwtDecode from "jwt-decode";
import store from "../../store";
import { setToken, checkToken } from "../../util/tokenHelper";
import { ElMessage } from "element-plus";
import { userPayload } from "@/api/apimodel";

const activeName = ref("first");

let btnLoading = ref(false);
const loginByOauth = async () => {
  btnLoading.value = true;
  let currentENV = import.meta.env.MODE;
  let redirectUrl = "";
  if (currentENV === "production" || currentENV === "stage") {
    redirectUrl =
      "%26redirect_uri%3Dhttp%3A%2F%2F52.83.157.35%3A8028%2FOAuth%2Fcallback"; // 正式环境
  } else {
    redirectUrl =
      "%26redirect_uri%3dhttp%3a%2f%2flocalhost%3a5000%2fOAuth%2fcallback"; // 本地环境
      // "%26redirect_uri%3Dhttp%3A%2F%2F52.83.157.35%3A8028%2FOAuth%2Fcallback"; // 测试环境
  }
  const remoteUrl =
    "https://oauth.meb.com/Account/Login?ReturnUrl=%2fconnect%2fauthorize%2fcallback" +
    "%3fclient_id%3dyimei_kb" +
    "%26response_type%3dcode" +
    redirectUrl +
    "%26state%3d9527" +
    "%26scope%3dopenid+profile+email";
  window.location.href = remoteUrl;
  btnLoading.value = false;
};

const Router = useRouter();
const Route = useRoute();
onMounted(async () => {
  let token = Route.query.token as string;
  if (token) {
    btnLoading.value = true;
    const res = await checkToken(token);
    btnLoading.value = false;
    if (res.code == 200) {
      setToken(token);
      const decode: userPayload = jwtDecode(token);
      if (decode) {
        store.dispatch("setUser", decode);
        store.dispatch("setPermissions");
        Router.push("/workbench");
      } else {
        ElMessage.error("无效的用户信息");
      }
    } else {
      ElMessage.error("无效的登录信息");
    }
  }
});
</script>

<template>
  <div class="background">
    <div class="login-container">
      <div class="login-block">
        <div style="width: 80%">
          <h2 class="login-title-icon"></h2>
          <p class="login-title">
            <el-badge :value="'v 1.0'" class="item">登录贝贝医美知识库</el-badge>
          </p>
          <el-tabs v-model="activeName">
            <el-tab-pane label="美呗通行证登录" name="first">
              <el-button @click="loginByOauth" :loading="btnLoading">登录</el-button>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.background {
  min-height: 100vh;
  background-color: #fce4ec48;
}
.login-container {
  display: flex;
  justify-content: center;
}
.login-block {
  margin-top: 20vh;
  width: 400px;
  height: 400px;
  display: flex;
  justify-content: center;
  text-align: center;
  background-color: #ffffff;
  border: 1px solid #eee; /* 边框厚度和颜色*/
  border-right: 240px solid #64b5f6;
  box-shadow: 0 0.5em 1em 0 rgba(0, 0, 0, 0.1); /*阴影和透明度*/
  border-radius: 6px; /*圆角*/
}
.login-title-icon {
  position: relative;
  top: 70px;
  right: -320px;
  font-size: 30px;
  color: #2c3e50;
}
.login-title {
  font-size: 28px;
  font-weight: 600;
  color: #546e7a;
}
.el-button {
  width: 200px !important;
  height: 40px;
  background: #3f51b5;
  border-radius: 6px;
  font-size: 20px;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, Arial, sans-serif;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  border: none;
  cursor: pointer;
  margin-top: 80px;
}
.logo-pic {
  width: 100px;
  height: 30px;
  position: absolute;
  top: 15px;
  right: 30px;
}
.logo-pic-title {
  width: 100px;
  height: 30px;
  color: #2c3e50;
  position: relative;
  /* bottom: 70px; */
}
.footer-text {
  color: #ffffff;
  position: absolute;
  bottom: 15px;
  right: 25px;
  font-size: 14px;
  font-weight: 100;
}
</style>
