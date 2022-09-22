<script setup lang="ts">
import store from "../../store";
import { ref, reactive, getCurrentInstance, onMounted, computed } from "vue";
import { ElMessage } from "element-plus";
import {
  QaTableModel,
  CateModel,
  approveList,
  QaModel,
  UserPageModel
} from "../../api/apimodel";
import { getProjectType, getQaByIdRe, updateQa } from "../../api/workbench";
import {
  getapproveList,
  getApproveId,
  rejectQA,
  withdraw
} from "../../api/stateManagement";
import { getUserList } from "../../api/userManagement";
import { checkPermission } from "../../util/permission";

const { proxy } = getCurrentInstance() as any;
let activeName = ref("1");

const state = reactive({
  ProjectTypelist: [] as Array<CateModel>, //项目大类
  multipleSelection: [],
  back: {
    backText: "",
  },
  dialogFormVisible: false,
  tableData: [] as Array<QaTableModel>,
});

//同步
const handleClick = (tab: any) => {
  showApproveList(tab.props.name);
};
const synchronous = async (val: number) => {
  let param = {
    idList: [val],
    rejectReason: "",
  };
  flag.value = true;
  let res: any = await getApproveId(param);
  flag.value = false;
  if (res.code == 200) {
    ElMessage({
      message: res.data,
      type: res.msg,
    });
  } else {
    ElMessage({
      message: res.msg,
      type: "error",
    });
  }
  showApproveList(1);
};

// 批量同步
// let dataId = [] as Array<number>;
let dataId = ref([]) as any
const batchSynchronous = async () => {
  dataId.value = [];
  state.multipleSelection.forEach((item: any) => {
    dataId.value.push(item.id);
  });
  let param = {
    idList: dataId.value,
    rejectReason: "",
  };
  let res: any = await getApproveId(param);
  if (res.code == 200) {
    ElMessage({
      message: res.data,
      type: "success",
    });
  } else {
    ElMessage({
      message: res.data,
      type: "error",
    });
  }
  showApproveList(1);
};

//获取审批列表
let flag = ref(false);
let loading = ref(false);
let pageNum = ref(1);
let pageSize = ref(10);
let orderType = ref("desc");
let total = ref(0);
let tableDataLength = ref();
let submitType = ref();
let submitUser = ref("");
let firstProject = ref("");
const showApproveList = async (val: number) => {
  const param = {
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    status: val,
    orderType: orderType.value,
    submitUser: submitUser.value,
    submitType: submitType.value,
    firstProject: firstProject.value,
  } as approveList;
  loading.value = true;
  let res: any = await getapproveList(param);
  loading.value = false;
  if (res.code === 200) {
    total.value = res.data.total;
    state.tableData = res.data.content;
    getupdateNameList();
    tableDataLength.value = state.tableData.length;
  } else {
    ElMessage({
      message: res.msg,
      type: "error",
    });
  }
};

// 驳回
let rejectId = ref<number>();
const rejectmsg = (val: number) => {
  state.dialogFormVisible = true;
  rejectId.value = val;
  state.back.backText = "";
};

const turnDown = async () => {
  state.dialogFormVisible = false;
  dataId.value.push(rejectId.value);
  let data = {
    idList: dataId.value,
    rejectReason: state.back.backText,
  };
  if (state.back.backText !== "") {
    flag.value = true;
    let res: any = await rejectQA(data);
    flag.value = false;
    if (res.code === 200) {
      state.tableData = [];
      showApproveList(1);
      ElMessage({
        message: res.data,
        type: "success",
      });
    }
  } else {
    ElMessage.error("驳回理由不能为空");
  }
};
// 批量驳回
const batchReject = async () => {
  state.dialogFormVisible = true;
  dataId.value = []
  state.multipleSelection.forEach((item: any) => {
    dataId.value.push(item.id);
  });
};

// 撤回
const revocation = async (val: number) => {
  flag.value = true;
  let res: any = await withdraw(val);
  flag.value = false;
  if (res.code === 200) {
    showApproveList(1);
    ElMessage({
      message: res.data,
      type: "success",
    });
  }
}

// 多选操作
const toggleSelection = function (rows: any) {
  if (rows) {
    rows.forEach((row: any) => {
      proxy.$refs.multipleTable.toggleRowSelection(row);
    });
  } else {
    proxy.$refs.multipleTable.clearSelection();
  }
};
const handleSelectionChange = (val: any) => {
  state.multipleSelection = val;
};
// 弹窗关闭时
const diaClose = () => {
  state.back.backText = ""
}
//分页--
const handleSizeChange = (val: number) => {
  pageSize.value = val;
  let active = Number(activeName.value);
  showApproveList(active);
};
const handleCurrentChange = (val: number) => {
  pageNum.value = val;
  let active = Number(activeName.value);
  showApproveList(active);
};
//--分页

// 项目大类
const getProjectTypelist = async () => {
  let res: any = await getProjectType();
  if (res.code === 200) {
    state.ProjectTypelist = res.data as Array<CateModel>;
  } else {
    ElMessage({
      message: res.msg,
      type: "error",
    });
  }
};

// 重新提交--
const diaState = reactive({
  dialogFormVisible: false,
  form: {
    query: "",
    answer: "",
    firstProject: "",
    updateUser: "",
  } as QaTableModel,
  formLabelWidth: "120px",
});

const resubmit = async (val: number) => {
  diaState.dialogFormVisible = true;
  flag.value = true;
  let res: any = await getQaByIdRe(val, true);
  flag.value = false;
  diaState.form = res.data;
};

const resubmitConfirm = async () => {
  diaState.dialogFormVisible = false;
  if (diaState.form.answer == "" && diaState.form.query == "") {
    state.dialogFormVisible = true;
    ElMessage.error("问题和回答不能为空");
  } else {
    const param = {
      id: diaState.form.id,
      Query: diaState.form.query,
      Answer: diaState.form.answer,
      FirstProject: diaState.form.firstProject,
      isResubmit: true,
      updateUser: diaState.form.updateUser,
    } as QaModel;
    let res = await updateQa(param);
    // (diaState.form.query = ""),
    //   (diaState.form.answer = ""),
    //   (diaState.form.firstProject = ""),
    //   (state.tableData = []);
    showApproveList(3);
    ElMessage({
      message: res.data,
      type: "success",
    });
  }
};

// 登录人邮箱
let userEmail = computed(() => {
  return store.getters.userEmail;
});

let userName = computed(() => {
  return store.getters.userName;
})

let updateNameList = [] as any;
const getupdateNameList = () => {
  state.tableData.forEach((item) => {
    updateNameList.push(item.updateUser);
  });
};

onMounted(() => {
  getProjectTypelist();
  showApproveList(1);
  GetUserList();
});

// 筛选
import { Sort } from "@element-plus/icons-vue";
let selectValOne = ref("");
let selectValTwo = ref("");
let selectValThr = ref("");
let optionsOne = ref([
  {
    value: 0,
    label: "不限",
  },
  {
    value: 1,
    label: "新增",
  },
  {
    value: 2,
    label: "编辑",
  },
  {
    value: 3,
    label: "删除",
  },
]);

const order = () => {
  if (orderType.value == "desc") {
    orderType.value = "asc";
  } else if (orderType.value == "asc") {
    orderType.value = "desc";
  }
  let val = Number(activeName.value);
  showApproveList(val);
};

// 获取所有用户邮箱
let userList = ref([]) as any;
const GetUserList = async () => {
  const param = {
    pageNum: pageNum.value,
    pageSize: pageSize.value,
  } as UserPageModel;
  let res: any = await getUserList(param);
  if (res.code === 200) {
    let userListItem = res.data.content;
    userListItem.forEach((item: any) => {
      userList.value.push({
        label: item.preferred_username,
        value: item.email,
      });
    });
  } else {
    ElMessage({
      message: res.msg,
      type: "error",
    });
  }
};

// 筛选：同步类型
const typeFilter = (val: number) => {
  submitType.value = val;
  let active = Number(activeName.value);
  showApproveList(active);
};
// 筛选：项目大类
const typePro = (val: any) => {
  firstProject.value = val;
  let active = Number(activeName.value);
  showApproveList(active);
};
// 筛选：提交人
const subPerson = (val: any) => {
  submitUser.value = val;
  let active = Number(activeName.value);
  showApproveList(active);
};
</script>

<template>
  <div class="content-body">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="待审批" name="1">
        <div class="content-bodyT">
          <div class="warpper">
            <div class="box1">
              同步类型:
              <el-select
                v-model="selectValOne"
                placeholder="不限"
                @change="typeFilter(Number(selectValOne))"
              >
                <el-option
                  v-for="item in optionsOne"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                ></el-option>
              </el-select>
            </div>
            <div class="box2">
              项目大类:
              <el-select
                v-model="selectValTwo"
                placeholder="不限"
                @change="typePro(selectValTwo)"
                clearable
              >
                <el-option
                  v-for="item in state.ProjectTypelist.slice(
                    1,
                    state.ProjectTypelist.length
                  )"
                  :key="item"
                  :label="item.firstProject"
                  :value="item.firstProject"
                ></el-option>
              </el-select>
            </div>
            <div class="box3">
              提交人:
              <el-select
                clearable
                v-model="selectValThr"
                placeholder="不限"
                :filterable="true"
                @change="subPerson(selectValThr)"
              >
                <el-option
                  v-for="item in userList"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                >
                  <span style="float: left">{{ item.label }}</span>
                  <span
                    style="
                      float: right;
                      color: var(--el-text-color-secondary);
                      font-size: 13px;
                    "
                  >{{ item.value }}</span>
                </el-option>
              </el-select>
            </div>
            <div class="box4" @click="order">
              提交时间
              <el-icon>
                <sort />
              </el-icon>
            </div>
          </div>
        </div>
        <div class="content-bodyM" v-loading="loading">
          <el-table
            ref="multipleTable"
            @selection-change="handleSelectionChange"
            :show-header="state.multipleSelection.length"
            :data="state.tableData"
            :cell-style="{ background: '#fff' }"
            :header-cell-style="{ background: '#f2f2f2', color: '#606266' }"
          >
            <el-table-column type="selection" width="30" />
            <el-table-column width="auto">
              <template #header="scope">
                <div style="display: flex; justify-content: start">
                  <span style="width: 5%">全选</span>
                  <span style="width: 12%">已选择{{ state.multipleSelection.length }}项内容</span>
                  <span
                    @click="toggleSelection(null)"
                    style="width: 70%; cursor: pointer; color: #54a4ee"
                  >取消选择</span>
                  <span
                    @click="batchSynchronous"
                    style="width: 7%; cursor: pointer; color: #54a4ee"
                  >批量同步</span>
                  <span @click="batchReject" style="cursor: pointer; color: #54a4ee">批量驳回</span>
                </div>
              </template>
              <template #default="scope" v-for="val in state.tableData">
                <div class="tableM">
                  <div class="tableL">
                    <div style="font-size: 20px;color: #000;">
                      【问题】{{ scope.row.query }}
                      <div class="tag">{{ scope.row.firstProject }}</div>
                    </div>
                    <p class="desc">{{ scope.row.answer }}</p>
                    <p class="user">
                      同步类型：
                      <b v-if="scope.row.submitType === 1">新增</b>
                      <b v-if="scope.row.submitType === 2">编辑</b>
                      <b v-if="scope.row.submitType === 3">删除</b>
                      | 提交人: {{ scope.row.updateName || "系统" }}（{{ scope.row.updateUser }}）| 提交时间:{{
                        scope.row.updateTime
                      }}
                    </p>
                  </div>
                  <div class="tableR">
                    <el-button
                      type="danger"
                      v-if="userName == scope.row.updateName"
                      @click="revocation(scope.row.id)"
                      :loading="flag"
                    >删除</el-button>
                    <el-button
                      v-if="checkPermission('zsk:pass')"
                      type="primary"
                      @click="synchronous(scope.row.id)"
                      :loading="flag"
                    >同步</el-button>
                    <el-button
                      v-if="checkPermission('zsk:reject')"
                      @click="rejectmsg(scope.row.id)"
                      :loading="flag"
                    >驳回</el-button>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <!-- dialog -->
          <el-dialog
            v-model="state.dialogFormVisible"
            :close-on-click-modal="false"
            title="驳回"
            @close="diaClose"
          >
            <el-form :model="state.back" label-position="top">
              <el-form-item label="*请输入驳回理由:" :label-width="120">
                <el-input v-model="state.back.backText" type="textarea" rows="6" resize="none"></el-input>
              </el-form-item>
            </el-form>
            <template #footer>
              <span class="dialog-footer">
                <el-button type="primary" @click="turnDown">确认</el-button>
                <el-button @click="state.dialogFormVisible = false">取消</el-button>
              </span>
            </template>
          </el-dialog>
        </div>
        <el-pagination
          style="margin-top: 30px"
          background
          layout="prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          v-model:currentPage="pageNum"
          :total="total"
        ></el-pagination>
      </el-tab-pane>
      <el-tab-pane label="审批通过" name="2">
        <div class="content-bodyT">
          <div class="warpper">
            <div class="box1">
              同步类型:
              <el-select
                v-model="selectValOne"
                placeholder="不限"
                @change="typeFilter(Number(selectValOne))"
              >
                <el-option
                  v-for="item in optionsOne"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                ></el-option>
              </el-select>
            </div>
            <div class="box2">
              项目大类:
              <el-select
                v-model="selectValTwo"
                placeholder="不限"
                @change="typePro(selectValTwo)"
                clearable
              >
                <el-option
                  v-for="item in state.ProjectTypelist.slice(
                    1,
                    state.ProjectTypelist.length
                  )"
                  :key="item"
                  :label="item.firstProject"
                  :value="item.firstProject"
                ></el-option>
              </el-select>
            </div>
            <div class="box3">
              提交人:
              <el-select
                clearable
                v-model="selectValThr"
                placeholder="不限"
                :filterable="true"
                @change="subPerson(selectValThr)"
              >
                <el-option
                  v-for="item in userList"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                >
                  <span style="float: left">{{ item.label }}</span>
                  <span
                    style="
                      float: right;
                      color: var(--el-text-color-secondary);
                      font-size: 13px;
                    "
                  >{{ item.value }}</span>
                </el-option>
              </el-select>
            </div>
            <div class="box4" @click="order">
              提交时间
              <el-icon>
                <sort />
              </el-icon>
            </div>
          </div>
        </div>
        <div class="content-bodyM" v-loading="loading">
          <el-table
            :show-header="false"
            :data="state.tableData"
            :cell-style="{ background: '#fff' }"
          >
            <el-table-column width="auto">
              <template #default="scope" v-for="val in state.tableData">
                <div class="tableM">
                  <div class="tableL">
                    <div style="font-size: 20px;color: #000;">
                      【问题】{{ scope.row.query }}
                      <div class="tag">{{ scope.row.firstProject }}</div>
                    </div>
                    <p class="desc">{{ scope.row.answer }}</p>
                    <p class="user">
                      同步类型：
                      <b v-if="scope.row.submitType === 1">新增</b>
                      <b v-if="scope.row.submitType === 2">编辑</b>
                      <b v-if="scope.row.submitType === 3">删除</b>
                      | 更新人:{{ scope.row.updateName || "系统" }}({{ scope.row.updateUser || "system" }}) | 更新时间:{{
                        scope.row.updateTime
                      }}
                      <span>审核人：{{ scope.row.approveName || "系统" }}（{{ scope.row.approveUser || "system" }}）</span>
                    </p>
                  </div>
                  <div class="tableR"></div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-pagination
          style="margin-top: 30px"
          background
          layout="prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          v-model:currentPage="pageNum"
          :total="total"
        ></el-pagination>
      </el-tab-pane>
      <el-tab-pane label="已驳回" name="3">
        <div class="content-bodyT">
          <div class="warpper">
            <div class="box1">
              同步类型:
              <el-select
                v-model="selectValOne"
                placeholder="不限"
                @change="typeFilter(Number(selectValOne))"
              >
                <el-option
                  v-for="item in optionsOne"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                ></el-option>
              </el-select>
            </div>
            <div class="box2">
              项目大类:
              <el-select
                v-model="selectValTwo"
                placeholder="不限"
                @change="typePro(selectValTwo)"
                clearable
              >
                <el-option
                  v-for="item in state.ProjectTypelist.slice(
                    1,
                    state.ProjectTypelist.length
                  )"
                  :key="item"
                  :label="item.firstProject"
                  :value="item.firstProject"
                ></el-option>
              </el-select>
            </div>
            <div class="box3">
              提交人:
              <el-select
                clearable
                v-model="selectValThr"
                placeholder="不限"
                :filterable="true"
                @change="subPerson(selectValThr)"
              >
                <el-option
                  v-for="item in userList"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                >
                  <span style="float: left">{{ item.label }}</span>
                  <span
                    style="
                      float: right;
                      color: var(--el-text-color-secondary);
                      font-size: 13px;
                    "
                  >{{ item.value }}</span>
                </el-option>
              </el-select>
            </div>
            <div class="box4" @click="order">
              提交时间
              <el-icon>
                <sort />
              </el-icon>
            </div>
          </div>
        </div>
        <div class="content-bodyM" v-loading="loading">
          <el-table
            :show-header="false"
            :data="state.tableData"
            :cell-style="{ background: '#fff' }"
          >
            <el-table-column width="auto">
              <template #default="scope" v-for="val in state.tableData">
                <div class="tableM">
                  <div class="tableL">
                    <div style="font-size: 20px;color: #000;">
                      【问题】{{ scope.row.query }}
                      <div class="tag">{{ scope.row.firstProject }}</div>
                    </div>
                    <p class="desc">{{ scope.row.answer }}</p>
                    <p class="user">
                      同步类型：
                      <b v-if="scope.row.submitType === 1">新增</b>
                      <b v-if="scope.row.submitType === 2">编辑</b>
                      <b v-if="scope.row.submitType === 3">删除</b>
                      | 更新人:{{ scope.row.updateName || "系统" }}({{ scope.row.updateUser || "system" }}) | 更新时间:{{
                        scope.row.updateTime
                      }}
                      <span>审核人：{{ scope.row.approveName }}（{{ scope.row.approveUser }}）</span>
                    </p>
                    <p class="cause">驳回原因：{{ scope.row.rejectReason }}</p>
                  </div>
                  <div class="tabler">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <el-button
                      style="width: 100px"
                      type="primary"
                      @click="resubmit(scope.row.id)"
                      v-if="userEmail == scope.row.updateUser"
                      :loading="flag"
                    >重新提交</el-button>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <!-- 重新提交 -->
          <el-dialog
            v-model="diaState.dialogFormVisible"
            title="编辑问答"
            :close-on-click-modal="false"
            :center="false"
          >
            <el-form :model="diaState.form">
              <el-form-item label="*问题:" :label-width="diaState.formLabelWidth">
                <el-input v-model="diaState.form.query" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="*回答:" :label-width="diaState.formLabelWidth">
                <el-input v-model="diaState.form.answer" resize="none" type="textarea" rows="10"></el-input>
              </el-form-item>
              <el-form-item label="*项目大类:" :label-width="diaState.formLabelWidth">
                <el-select v-model="diaState.form.firstProject" placeholder="选择项目">
                  <el-option
                    v-for="(item, index) in state.ProjectTypelist.slice(
                      1,
                      state.ProjectTypelist.length
                    )"
                    :key="item"
                    :label="item.firstProject"
                    :value="item.firstProject"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <template #footer>
              <span class="dialog-footer">
                <el-button type="primary" @click="resubmitConfirm">确认</el-button>
                <el-button @click="diaState.dialogFormVisible = false">取消</el-button>
              </span>
            </template>
          </el-dialog>
        </div>
        <el-pagination
          style="margin-top: 30px"
          background
          layout="prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          v-model:currentPage="pageNum"
          :total="total"
        ></el-pagination>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped>
.content-body {
  display: flex;
  padding: 20px 30px 30px 30px;
  margin: 80px 0 30px 0;
  background: #fff;
}
.el-tabs {
  width: 100%;
}
.tableM {
  display: flex;
  align-items: center;
}
.tableM .tableL .user > span {
  float: right;
}
.tableL {
  width: 100%;
}
.tableL > .cause {
  color: red;
}
.content-bodyT {
  margin-top: 10px;
}
.content-bodyM {
  margin-top: 20px;
}
.tableR {
  width: 400px;
  text-align: center;
}
.tabler {
  width: 400px;
}
.el-button {
  width: 70px;
}
.el-pagination {
  float: right;
}

.resub {
  width: 100px;
}

.box4 {
  cursor: pointer;
}
.warpper {
  display: flex;
  align-items: center;
  width: 100%;
}
.warpper > div {
  margin-right: 20px;
}

.tag {
  display: inline;
  vertical-align: middle;
  margin-left: 10px;
  font-size: small;
  color: #f59a23;
  border: 1px solid #f59a23;
  border-radius: 5px;
  padding: 2px 5px;
}
</style>
