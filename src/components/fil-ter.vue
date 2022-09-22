<script setup lang="ts">
import { ref } from 'vue'
import {Sort} from '@element-plus/icons-vue'
let selectValOne = ref('')
let selectValTwo = ref('')
let selectValThr = ref('')
let optionsOne = ref([
    {
        value: '不限',
    },
    {
        value: '新增',
    },
    {
        value: '编辑',
    },
    {
        value: '删除',
    },
])
let optionsTwo = ref([
    {
        value: '不限',
    },
    {
        value: '眼部整形',
    },
    {
        value: '鼻部整形',
    }
])
let optionsThr = ref([
    {
        value: '不限',
    },
    {
        value: '小明',
    },
])
const props = defineProps({
    toolId: {
    type:String,
    default: '0'
  }
})
console.log(props.toolId)

const select = ()=>{
    console.log('选中内容')
}
</script>

<template>
    <div class="warpper">
        <div class="box1">
            同步类型:
            <el-select v-model="selectValOne" placeholder="不限" :filterable="true">
                <el-option  v-for="item in optionsOne" :key="item.value" :value="item.value"></el-option>
            </el-select>
        </div>
        <div class="box2">
            项目大类:
            <el-select v-model="selectValTwo" placeholder="不限" :filterable="true">
                <el-option v-for="item in optionsTwo" :key="item.value" :value="item.value"></el-option>
            </el-select>
        </div>
        <div class="box3">
            提交人:
            <el-select v-model="selectValThr" placeholder="不限" :filterable="true">
                <el-option v-for="item in optionsThr" :key="item.value" :value="item.value"></el-option>
            </el-select>
        </div>
        <div class="box4">
            提交时间
            <el-icon>
                <sort />
            </el-icon>
        </div>
    </div>
</template>

<style scoped>
.warpper {
    display: flex;
    align-items: center;
    width: 100%;
}
.warpper > div {
    margin-right: 20px;
}
</style>