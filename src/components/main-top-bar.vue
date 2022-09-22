<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import store from "../store";
import { checkPermission } from "../util/permission"

// 必须先声明调用
const router = useRouter();

const userName = computed(() => {
  return store.getters.userName || "";
});

const handleCommand = (command: string) => {
  if (command == "logout") {
    router.replace('/login');
    sessionStorage.clear();
  }
}
</script>

<template>
  <div class="wapper">
    <div class="top-bar">
      <div class="side-space"></div>
      <div class="content menu-content">
        <div>
          <span><img style="width: 130px;vertical-align: middle;" src="../assets/images/logo.png"></span>
          <span class="top-title"></span>
        </div>
        <div class="menu-block" >
          <span><router-link to="workbench">工作台</router-link></span>
          <span><router-link to="statemanagement">知识库同步</router-link></span>
          <span><router-link to="usermanagement">用户管理</router-link></span>
        </div>
        <div class="user-block">
          <img src="../assets/images/headLogo.png" style="width: 30px;border-radius: 50%;" alt="头像">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              <span>{{ userName }}</span>
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logout">
                  <svg
                    t="1642043375224"
                    class="icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="2134"
                    width="20"
                    height="20"
                  >
                    <path
                      d="M662.016 247.6544a32 32 0 1 1 29.4912-56.832 390.4 390.4 0 1 1-359.0144 0 32 32 0 1 1 29.4912 56.832 326.4 326.4 0 1 0 300.032 0zM544 384a32 32 0 1 1-64 0v-256a32 32 0 1 1 64 0v256z"
                      p-id="2135"
                    />
                  </svg>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <div class="side-space"></div>
    </div>
  </div>
</template>

<style scoped>
.wapper {
  position: fixed;
  width: 100%;
  z-index: 99;
}
.top-bar {
  box-shadow: 0 0em 0.9em 0 rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: flex-start;
  background-color: #00182e;
  padding: 10px 0px 10px 0px;
  color: #fff;
  height: 40px;
  line-height: 40px;
}
.content{
  width: 100%;
}
.menu-content {
  display: flex;
  justify-content: flex-start;
}

.menu-block {
  margin-left: 100px;
}
.top-title {
  font-size: 16px;
}
.menu-block > span {
  margin-right: 50px;
  font-size: 14px;
  color: #bdbdbd;
  cursor: pointer;
  padding: 5px;
}
.menu-block > span:hover {
  color: #fff;
}

.user-block {
  position: absolute;
  right: 7%;
  cursor: pointer;
  color: #bdbdbd;
}
.user-block:hover {
  color: #fff;
}
.user-block {
  display: flex;
  align-items: center;
}
.user-block > span {
  margin-left: 10px;
}
.el-dropdown-link {
  margin-left: 10px;
  color: #bdbdbd;
}

.el-dropdown-link > span:hover {
  color: #fff;
}
.icon {
  margin-right: 5px;
}

.mui-active{
  color: #fff;
  font-size: 15px;
  text-decoration: none;
}

a{
  text-decoration: none;
  color: #bdbdbd;
}

</style>
