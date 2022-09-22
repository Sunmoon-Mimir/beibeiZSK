<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { QaModel, QaTableModel, CateModel } from "../api/apimodel";
import { getQaById, updateQa, getProjectType } from "../api/workbench";

const props = defineProps({
  buttonName: {
    type: String,
    default: "",
  },
  dialogTitle: {
    type: String,
    default: "新建回答",
  },
  diaId: {
    type: String,
    default: "0",
  },
  btnType: {
    type: String,
    default: "text",
  },
  searchId: {
    type: Number,
    default: 0
  }
});

let diaTitle = props.dialogTitle;
let dialogId = props.diaId;
const state = reactive({
  dialogTableVisible: false,
  dialogFormVisible: false,
  form: {} as QaTableModel,
  formLabelWidth: "120px",
});
const diaBtn = async (dialogId: string) => {
  state.dialogFormVisible = true;
  if (diaTitle === "编辑回答") {
    // console.log(dialogId)
    let res: any = '';
    let id = props.searchId;
    id ? res = await getQaById(id) : res = await getQaById(Number(dialogId));
    state.form = res.data;
    // console.log(state.form)
    // console.log(res.data)
  }
};
const formConfirm = async () => {
  state.dialogFormVisible = false;
  if (state.form.answer == "" && state.form.query == "") {
    state.dialogFormVisible = true;
    ElMessage.error("问题和回答不能为空");
  } else {
    let res: any;
    const param = {
      id: dialogId,
      Query: state.form.query,
      Answer: state.form.answer,
      FirstProject: state.form.firstProject,
    } as QaModel;
    if (diaTitle === "编辑回答") {
      res = await updateQa(param);
    }
    console.log(res);
    ElMessage({
      message: "提交成功，待审核!",
      type: "success"
    });
  }
};

// 项目大类
const states = reactive({
  ProjectTypelist: []
})

const getProjectTypelist = async () => {
  let res: any = await getProjectType();
  if (res.code === 200) {
    states.ProjectTypelist = res.data.slice(1, res.data.length)
  } else {
    ElMessage({
      message: "无项目大类",
      type: "error"
    });
  }
};

onMounted(() => {
  getProjectTypelist()
})
</script>
<template>
  <el-button :type="btnType" @click="diaBtn(dialogId)">
    {{
      buttonName
    }}
  </el-button>
  <el-dialog
    v-model="state.dialogFormVisible"
    :title="diaTitle"
    :close-on-click-modal="false"
    :center="false"
  >
    <el-form :model="state.form">
      <!-- {{ dialogId }} -->
      <el-form-item label="*问题:" :label-width="state.formLabelWidth">
        <el-input v-model="state.form.query" autocomplete="off" disabled></el-input>
      </el-form-item>
      <el-form-item label="*回答:" :label-width="state.formLabelWidth">
        <el-input v-model="state.form.answer" resize="none" type="textarea" rows="10"></el-input>
      </el-form-item>
      <el-form-item label="*项目大类:" :label-width="state.formLabelWidth">
        <el-select v-model="state.form.firstProject" placeholder="选择项目">
          <el-option
            v-for="(item,index) in states.ProjectTypelist"
            :key="item"
            :label="item.firstProject"
            :value="item.firstProject"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="formConfirm">确认</el-button>
        <el-button @click="state.dialogFormVisible = false">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped></style>
