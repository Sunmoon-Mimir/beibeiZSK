<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { getUserList, getUserPermission, getUserRoles, setUserRole, delUser } from '../../api/userManagement';
import { ElMessage } from 'element-plus';
import { checkPermission } from "../../util/permission";
import { UserPageModel } from "../../api/apimodel"

let inputSearch = ref('');
let userNum = ref(1);
const dialogVisible = ref(false);
const editVisible = ref(false);

let roleOptions = ref([
  {
    value: 'Option1',
    label: '数据管理员',
  },
  {
    value: 'Option2',
    label: '用户',
  }
]);
let roleValue = ref('');
let total = ref()
let state = reactive({
  visible: false,
  dataUser: 'dataUser',
  user: 'user',
  userList: [] as any,
});

//分页--
const handleSizeChange = (val: number) => {
  pageSize.value = val;
  state.userList = []
  GetUserList()
};
const handleCurrentChange = (val: number) => {
  pageNum.value = val;
  state.userList = []
  GetUserList()
};
//--分页

// 获取所有用户
let pageNum = ref(1);
let pageSize = ref(10);
let loading = ref(false)
const GetUserList = async () => {
  const param = {
    pageNum: pageNum.value,
    pageSize: pageSize.value,
  } as UserPageModel;
  loading.value = true
  let res: any = await getUserList(param);
  loading.value = false
  if (res.code === 200) {
    let userListItem = res.data.content;
    total.value = res.data.total
    userListItem.forEach((item: any) => {
      state.userList.push(item);
    })
  } else {
    ElMessage({
      message: res.msg,
      type: 'error',
    })
  }
}

// 搜索用户
const userSearch = async () => {
  if (inputSearch.value !== "") {
    const param = {
      pageNum: pageNum.value,
      pageSize: pageSize.value,
      nameOrEmail: inputSearch.value
    } as UserPageModel;
    loading.value = true
    let res: any = await getUserList(param);
    loading.value = false
    if (res.code === 200) {
      state.userList = [];
      let userListItem = res.data.content;
      total.value = res.data.total;
      userListItem.forEach((item: any) => {
        state.userList.push(item);
      })
    } else {
      ElMessage({
        message: res.msg,
        type: 'error',
      })
    }
  }
}
// 清除搜索框
const clearInput = () => {
    state.userList = []
    GetUserList()
}

// 获取当前角色权限
const GetUserPermission = async () => {
  let res: any = await getUserPermission();
}

// 获取角色列表
const GetUserRoles = async () => {
  let res: any = await getUserRoles();
}



// 修改用户角色确认
let saveEditUserRole = ref({}) as any;
const editUserRole = (val: any) => {
  saveEditUserRole = val
  editVisible.value = true;
}
const confirmEdit = async () => {
  editVisible.value = false;
  let option = roleValue.value
  if (option == 'Option1') {
    let data = { userName: saveEditUserRole.preferred_username, userEmail: saveEditUserRole.email, roleId: 2 };
    let res: any = await setUserRole(data);
    if (res.code == 401) {
      ElMessage.error("暂无权限!");
    } else {
      ElMessage.success("修改成功!");
    }
  } else {
    let data = { userName: saveEditUserRole.preferred_username, userEmail: saveEditUserRole.email, roleId: 3 };
    let res: any = await setUserRole(data);
    if (res.code == 401) {
      ElMessage.error("暂无权限!");
    } else {
      ElMessage.success("修改成功!");
    }
  }
  state.userList = [];
  GetUserList();
}

// 删除用户
let saveDelUserRole = ref("") as any;
const delUserRole = (val: any) => {
  dialogVisible.value = true;
  saveDelUserRole = val.email;
}

const confirmDelUser = async () => {
  dialogVisible.value = false;
  let email = saveDelUserRole;
  let res: any = await delUser(email);
  if (res.code == 200) {
    state.userList = [];
    GetUserList();
    ElMessage({
      message: res.data,
      type: "success",
    });
  }
}


onMounted(() => {
  GetUserList();
  GetUserPermission();
  GetUserRoles();
})

</script>

<template>
  <div class="content-body">
    <div class="contentT">
      <div class="text">
        <span>用户列表</span>
        <span>共{{ userNum }}条</span>
      </div>
      <el-input
        v-model="inputSearch"
        @keydown.enter="userSearch"
        placeholder="请输入用户名称或邮箱"
        :input-style="{ height: '' }"
        clearable
        @clear="clearInput"
      ></el-input>
    </div>

    <div class="contentM" v-loading="loading">
      <el-table
        :data="state.userList"
        style="width: 100%"
        :header-cell-style="{ background: '#f6f7f8', color: '#606266' }"
      >
        <el-table-column prop="preferred_username" label="用户名称" />
        <el-table-column prop="email" label="邮箱" />
        <!-- <el-table-column prop="department" label="所属部门" />
        <el-table-column prop="jobs" label="所属岗位" />-->
        <el-table-column prop="roleName" label="用户角色" />
        <el-table-column label="操作" :width="300">
          <template #default="scope">
            <div id="operation">
              <span style="margin-right: 70px;">
                <el-button
                  type="text"
                  v-if="checkPermission('user:edit')"
                  @click="editUserRole(scope.row)"
                >编辑</el-button>
              </span>
              <span>
                <el-button
                  type="text"
                  v-if="checkPermission('user:delete')"
                  @click="delUserRole(scope.row)"
                >删除</el-button>
              </span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      v-model="editVisible"
      title="修改用户角色"
      :close-on-click-modal="false"
      width="20%"
      top="300px"
    >
      用户角色：
      <el-select v-model="roleValue" placeholder="选择用户角色">
        <el-option
          v-for="item in roleOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="confirmEdit()">确认</el-button>
          <el-button @click="editVisible = false">取消</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="dialogVisible" title="删除用户" width="50%" top="300px">
      <span>删除用户后，此用户不再展示，如果再次登录依然会展示，此操作适用于已离职的用户！是否删除？</span>
      <template>
        <span class="dialog-footer">
          <el-button type="primary" @click="confirmDelUser">确认</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </span>
      </template>
    </el-dialog>
    <div class="contentB">
      <el-pagination
        style="float: right;margin-top: -30px;"
        background
        layout="prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        v-model:currentPage="pageNum"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<style scoped>
.content-body {
  padding: 20px 30px 30px 30px;
  margin-top: 80px;
  background: #fff;
}
.contentT {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
.text {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 14px;
}
.text span:nth-child(2) {
  margin-top: 10px;
}
.el-input {
  width: 300px;
}
.contentM {
  margin-top: 20px;
}
.el-table thead {
  color: #000;
}
.contentB {
  margin-top: 75px;
}
</style>