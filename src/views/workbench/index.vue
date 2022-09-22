<script setup lang="ts">
import { ElMessage } from "element-plus";
import { ref, reactive, onMounted } from "vue";
import { getTSearchList } from "../../api/search";
import {
  getProjectType,
  getWorkbenchTable,
  addQa,
  deleteQa,
  getQaById,
  updateQa,
  getQAhistory,
} from "../../api/workbench";
import {
  CateModel,
  QaTableModel,
  TablePageModel,
  QaModel,
  historyModel
} from "../../api/apimodel";

let dialogVisible = ref(false);
let dialogVisibleDel = ref(false);

let inputText = ref("");

const state = reactive({
  ProjectTypelist: [] as Array<CateModel>, //项目大类
  gridData: [],
  tableData: [] as Array<QaTableModel>,
  dialogTableVisible: false,
  dialogFormVisible: false,
  form: {} as QaTableModel,
  formLabelWidth: "120px",
  getContent: {} as QaTableModel,
});

const handleCloseTwo = (done: Function) => {
  done();
};



// 搜索查询
let searchId = ref();
const requstSearch = async () => {
  if (inputText.value !== "") {
    let data = { text: inputText.value };
    const res: any = await getTSearchList(data);
    if (res.success) {
      searchId.value = res.id;
      state.tableData.splice(0, state.tableData.length);
      state.tableData.unshift(res);
      total.value = 1;
      getUpName();
    } else {
      ElMessage({
        message: res.msg,
        type: "error",
      });
    }
  }
};

// 获取查询结果的更新人和时间
const getUpName = async () => {
  const res: any = await getQaById(searchId.value)
  state.getContent = res.data;
  console.log(state.getContent.updateUser)
}

const blurevent = () => {
  if (inputText.value == "") {
    state.getContent = {} as QaTableModel
    getTableList();
  }
};

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

const cateClick = (value: string) => {
  inputText.value = "";
  currentCate.value = value;
  getTableList();
};

// 获取列表
let flag = ref(false);
let loading = ref(false);
let pageNum = ref(1);
let pageSize = ref(10);
let total = ref(0);
let currentCate = ref("");
const getTableList = async () => {
  const param = {
    category: currentCate.value,
    pageNum: pageNum.value,
    pageSize: pageSize.value,
  } as TablePageModel;

  loading.value = true;
  const res: any = await getWorkbenchTable(param);
  loading.value = false;
  if (res.code === 200) {
    total.value = res.data.total;
    state.tableData = res.data.content;
    for (let item of state.tableData) {
      item.isShowText = false;
    }
  } else {
    ElMessage({
      message: res.msg,
      type: "error",
    });
  }
};

// 新增问答 --
const diaState = reactive({
  FormVisible: false,
  form: {
    query: "",
    answer: "",
    firstProject: "",
  } as QaTableModel,
  formLabelWidth: "120px",
});

// 添加并继续
const addContinue = async () => {
  diaState.FormVisible = true;
  if (
    diaState.form.answer == "" &&
    diaState.form.query == "" &&
    diaState.form.firstProject == ""
  ) {
    diaState.FormVisible = true;
    ElMessage.error("问题和回答不能为空");
  } else {
    const param = {
      Query: diaState.form.query,
      Answer: diaState.form.answer,
      FirstProject: diaState.form.firstProject,
      isResubmit: false,
    };
    flag.value = true;
    let res: any = await addQa(param);
    flag.value = false;
    ElMessage({
      message: "提交成功，待审核!",
      type: "success",
    });
  }
  diaState.form.answer = "";
  diaState.form.query = "";
  diaState.form.firstProject = "";
  getTableList();
};

// 新增确认
const formConfirm = async () => {
  diaState.FormVisible = false;
  if (
    diaState.form.answer == "" &&
    diaState.form.query == "" &&
    diaState.form.firstProject == ""
  ) {
    diaState.FormVisible = true;
    ElMessage.error("问题和回答不能为空");
  } else {
    const param = {
      Query: diaState.form.query,
      Answer: diaState.form.answer,
      FirstProject: diaState.form.firstProject,
      isResubmit: false,
    };
    flag.value = true;
    let res: any = await addQa(param);
    flag.value = false;
    ElMessage({
      message: res.data,
      type: "success",
    });
  }
  diaState.form.answer = "";
  diaState.form.query = "";
  diaState.form.firstProject = "";
  getTableList();
};
// --新增问答

// 删除表格数据
let saveDelData = ref();
const delData = (val: number) => {
  dialogVisibleDel.value = true;
  saveDelData.value = val;
};

const delTabData = async () => {
  dialogVisibleDel.value = false;
  let data = saveDelData.value;
  let res: any = await deleteQa(data);
  if (res.code == 200) {
    ElMessage.success(res.data);
    getTableList();
  }
};

//分页
const handleSizeChange = (val: number) => {
  pageSize.value = val;
  getTableList();
};
const handleCurrentChange = (val: number) => {
  pageNum.value = val;
  getTableList();
};

// 确认编辑
const ConfirmEdit = async () => {
  diaState.FormVisible = false;
  if (diaState.form.answer == "" && diaState.form.query == "") {
    diaState.FormVisible = true;
    ElMessage.error("问题和回答不能为空");
  } else {
    const param = {
      id: diaState.form.id,
      Query: diaState.form.query,
      Answer: diaState.form.answer,
      FirstProject: diaState.form.firstProject,
      isResubmit: false,
    } as QaModel;
    let res = await updateQa(param);
    (diaState.form.query = ""),
      (diaState.form.answer = ""),
      (diaState.form.firstProject = ""),
      ElMessage({
        message: res.data,
        type: "success",
      });
    getTableList();
  }
};

let dialogTitle = ref("新建问答");

const showDialog = async (row: any | null) => {
  diaState.FormVisible = true;
  if (row == null) {
    // 新建
    dialogTitle.value = "新建问答";
    diaState.form = { query: "", answer: "", firstProject: "" } as QaTableModel;
  } else {
    // 编辑
    let res: any = await getQaById(row.id);
    diaState.form = res.data;
    dialogTitle.value = "编辑问答";
    diaState.form = {
      id: row.id,
      query: row.query,
      answer: row.answer,
      firstProject: row.firstProject || state.tableData[0].first_project,
    } as QaTableModel;
  }
};

// 获取问答操作记录
const QAhistory = async (id: number) => {
  if (id == null) {
    return false;
  }
  let res: any = await getQAhistory(id);
  if (res.code == 200) {
    state.gridData = [];
    state.gridData = res.data;
  }
};

let History = reactive({
  saveHistory: [] as Array<historyModel>,
});
const checkHistory = (val: any) => {
  dialogVisible.value = true;
  History.saveHistory = [];
  History.saveHistory.push(val);
};

const rowCLick = (row: QaTableModel) => {
  row.isShowText = !row.isShowText;
};
const convertToolong = (answer: string): string => {
  if (answer.length > 185) {
    return answer.slice(0, 185) + '...'
  } else {
    return answer
  }
}

onMounted(() => {
  getTableList();
  getProjectTypelist();
});
</script>

<template>
  <div class="content-body">
    <div class="content-left">
      <el-row class="tac">
        <el-col :span="24">
          <span class="tac-title">
            <svg t="1639727753181" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
              p-id="2472" width="35" height="35">
              <path
                d="M283.884308 295.384615h456.231384l-169.865846 169.747693a19.692308 19.692308 0 0 0-5.750154 13.942154v300.347076l-42.653538-42.614153a19.692308 19.692308 0 1 0-27.844923 27.844923l76.248615 76.20923a19.692308 19.692308 0 0 0 33.634462-13.942153v-339.692308l197.710769-197.592615A19.692308 19.692308 0 0 0 787.692308 256H236.307692a19.692308 19.692308 0 0 0-13.902769 33.634462l212.795077 212.637538v199.601231a19.692308 19.692308 0 1 0 39.384615 0v-207.753846a19.692308 19.692308 0 0 0-5.789538-13.942154L283.884308 295.384615z"
                p-id="2473" />
            </svg>
            <p style="margin-left: -15px">项目大类</p>
          </span>
          <el-menu default-active="0" class="el-menu-vertical-demo">
            <el-menu-item v-for="(item, index) in state.ProjectTypelist" :key="item" :index="index.toString()"
              @click="cateClick(item.firstProject)">
              <span>{{ item.firstProject }}（{{ item.count }}）</span>
            </el-menu-item>
          </el-menu>
        </el-col>
      </el-row>
    </div>
    <div class="content-right">
      <div class="workbench-rightT">
        <el-input v-model="inputText" style="width: 480px" placeholder="请输入" clearable @blur="blurevent"
          @clear="blurevent" @keyup.enter="requstSearch()" />
        <div class="search" @click="requstSearch()">搜索</div>
      </div>
      <div class="workbench-rightB">
        <div class="sub-title">
          <p style="font-size: 14px">问答列表</p>
          <p>
            <el-button type="text" @click="showDialog(null)">+新建问答</el-button>
            <el-dialog v-model="diaState.FormVisible" :title="dialogTitle" :close-on-click-modal="false"
              :center="false">
              <el-form :model="diaState.form">
                <el-form-item label="*问题:" :label-width="diaState.formLabelWidth">
                  <el-input v-model="diaState.form.query" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="*回答:" :label-width="diaState.formLabelWidth">
                  <el-input v-model="diaState.form.answer" resize="none" type="textarea" rows="10"></el-input>
                </el-form-item>
                <el-form-item label="*项目大类:" :label-width="diaState.formLabelWidth">
                  <el-select v-model="diaState.form.firstProject" placeholder="选择项目">
                    <el-option v-for="item in state.ProjectTypelist.slice(
                      1,
                      state.ProjectTypelist.length
                    )" :key="item" :label="item.firstProject" :value="item.firstProject"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <template>
                <span class="dialog-footer">
                  <el-button v-if="dialogTitle == '新建问答'" type="primary" :loading="flag" @click="addContinue">添加并继续
                  </el-button>
                  <el-button v-if="dialogTitle == '新建问答'" type="primary" @click="formConfirm">新增确认</el-button>
                  <el-button v-else type="primary" @click="ConfirmEdit">编辑确认</el-button>
                  <el-button @click="diaState.FormVisible = false">取消</el-button>
                </span>
              </template>
            </el-dialog>
          </p>
        </div>
        <div class="table" v-loading="loading">
          <el-table :show-header="false" :data="state.tableData" style="width: 100%"
            :cell-style="{ background: '#fff' }">
            <el-table-column width="auto">
              <template #default="scope" v-for="val in state.tableData" :key="val.id">
                <div style="font-size: 20px; color: #000">
                  【问题】{{ scope.row.query }}
                  <div class="tag">{{ scope.row.firstProject || val.first_project || "空" }}</div>
                </div>
                <p @click="rowCLick(scope.row)">{{ scope.row.isShowText ? scope.row.answer :
                convertToolong(scope.row.answer) }}</p>

                <p class="user">
                  更新人:{{ scope.row.updateName || state.getContent.updateName }}({{
                  scope.row.updateUser || state.getContent.updateUser || "system"
                  }}) | 更新时间:{{ scope.row.updateTime || state.getContent.updateTime }}
                  <span>
                    <el-popover placement="bottom" :width="310" trigger="click">
                      <template #reference>
                        <el-button @click="QAhistory(scope.row.id)" type="text"
                          style="background: #fff; color: #969696">
                          操作记录
                          <svg style="vertical-align: middle" t="1640077841075" class="icon" viewBox="0 0 1024 1024"
                            version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2127" width="15" height="15">
                            <path d="M325.456471 862.280661" p-id="2128" fill="#969696" />
                            <path d="M882.057788 862.280661" p-id="2129" fill="#969696" />
                            <path d="M236.028491 877.160382" p-id="2130" fill="#969696" />
                            <path d="M960.132455 877.160382" p-id="2131" fill="#969696" />
                            <path d="M63.683483 788.736998" p-id="2132" fill="#969696" />
                            <path d="M958.469023 788.736998" p-id="2133" fill="#969696" />
                            <path d="M64.77753 858.792098" p-id="2134" fill="#969696" />
                            <path
                              d="M163.396533 289.168875c-40.577772 0-66.525252 54.184545-35.441258 85.258218L477.217578 723.704878c20.031716 20.031716 49.823841 20.031716 69.853837 0l349.274345-349.277785c30.304744-30.294423 6.677812-85.258218-34.928639-85.258218L163.396533 289.168875 163.396533 289.168875z"
                              p-id="2135" fill="#969696" />
                            <path d="M959.523505 858.792098" p-id="2136" fill="#969696" />
                          </svg>
                        </el-button>
                      </template>
                      <el-table :data="state.gridData" max-height="200" :show-header="false" size="mini">
                        <el-table-column prop="updateTime">
                          <template #default="scope">
                            <p>{{ scope.row.updateTime }}</p>
                            <p>
                              {{ scope.row.updateName }} ({{
                              scope.row.updateUser
                              }})
                            </p>
                          </template>
                        </el-table-column>
                        <el-table-column prop="updateUser" :width="70">
                          <template #default="scope">
                            <p>
                              <el-button type="text" @click="checkHistory(scope.row)">查看</el-button>
                            </p>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-popover>
                  </span>
                  |
                  <span class="editor">
                    <el-button type="text" @click="showDialog(scope.row)">编辑</el-button>
                  </span>
                  |
                  <span>
                    <el-button type="text" :disabled="scope.row.submitType == 3" @click="delData(scope.row.id)">删除
                    </el-button>
                    <span style="color: red; margin-left: 10px" v-if="scope.row.submitType == 3">“删除”待生效</span>
                  </span>
                </p>
              </template>
            </el-table-column>
          </el-table>
          <!-- 删除问答弹窗 -->
          <el-dialog v-model="dialogVisibleDel" :close-on-click-modal="false" title="删除回答" width="30%" top="300px">
            <span>执行“删除”操作后，由管理员确认后方可生效，是否删除？</span>
            <template #footer>
              <span class="dialog-footer">
                <el-button type="primary" @click="delTabData">确认</el-button>
                <el-button @click="dialogVisibleDel = false">取消</el-button>
              </span>
            </template>
          </el-dialog>
          <!-- 查看历史问答弹窗 -->
          <el-dialog v-model="dialogVisible" title="历史问答" width="50%" :before-close="handleCloseTwo"
            v-for="item in History.saveHistory" :key="item">
            <div class="historyQ">
              <div>问题:</div>
              <div>{{ item.query }}</div>
            </div>
            <div class="historyA">
              <div>回答:</div>
              <div>{{ item.answer }}</div>
            </div>
            <!-- 项目大类根据接口提供 -->
            <span>项目大类: {{ item.firstProject }}</span>
          </el-dialog>
          <el-pagination background layout="prev, pager, next, jumper" @size-change="handleSizeChange"
            @current-change="handleCurrentChange" v-model:currentPage="pageNum" :total="total"></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.content-body {
  display: flex;
  padding: 10px;
  margin: 80px 0 30px 0;
  background: #fff;
}

.content-left {
  margin-top: 90px;
}

.content-right {
  width: 100%;
}

.el-col {
  width: 200px;
  text-indent: 1em;
}

.el-menu-item.is-active {
  color: var(--el-menu-active-color);
  border-right: 4px solid #1890ff;
  background-color: #ecf5ff;
}

.tac-title {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.workbench-rightT {
  display: flex;
  align-items: center;
  padding: 20px 0 0 90px;
}

.search {
  cursor: pointer;
  margin-left: -2px;
  height: 40px;
  width: 76px;
  text-align: center;
  line-height: 40px;
  z-index: 10;
  background: #1890ff;
  color: #fff;
  border-bottom-right-radius: 5px;
  border-top-right-radius: 5px;
}

.table {
  width: 100%;
}

.workbench-rightB {
  padding: 40px 40px 0 20px;
}

.sub-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-left: 20px;
}

.el-pagination {
  float: right;
  margin: 100px 0 20px 0;
}

.desc {
  cursor: pointer;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.user>.record {
  color: #000;
  cursor: pointer;
}

.historyA,
.historyQ {
  display: flex;
  margin: 0 0 20px 27px;
}

.historyQ>div:nth-child(1) {
  width: 42px;
}

.historyA>div:nth-child(1) {
  width: 45px;
}

.user>.editor {
  cursor: pointer;
  color: #1890ff;
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
