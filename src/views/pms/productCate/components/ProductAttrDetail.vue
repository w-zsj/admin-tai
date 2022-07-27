<template>
  <el-card class="form-container" shadow="never">
    <el-form :model="productAttr" :rules="rules" ref="productAttrFrom" label-width="150px">
      <el-form-item :label="type === 1 ? '参数类型' : '属性名称'" prop="name">
        <el-input v-model="productAttr.name" maxlength="10"></el-input>
      </el-form-item>
      <el-form-item :label="`${type === 1 ? '参数':'规格'}录入方式`">
        <el-radio-group v-model="productAttr.inputType" @change="inputTypeRadio">
          <el-radio :label="0">手动录入</el-radio>
          <!-- <el-radio :label="1" v-if='type === 0'>列表中选择</el-radio>
          <el-radio :label="2" v-if='type === 1'>复选框</el-radio> -->
        </el-radio-group>
      </el-form-item>
      <!-- <el-form-item :label="`添加${type === 1 ? '参数':'规格'}`" v-if='productAttr.inputType === 2 || productAttr.inputType === 1' prop='inputList'>
        <el-input :autosize="true" type="textarea" v-model="productAttr.inputList" placeholder='不同可选值用回车键隔开' />
      </el-form-item> -->
      <el-form-item :label="`${type === 1 ? '参数':'规格'}排序`">
        <el-input v-model="productAttr.sort"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('productAttrFrom')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('productAttrFrom')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { fetchList } from '@/api/productAttrCate'
import { createProductAttr, getProductAttr, updateProductAttr } from '@/api/productAttr'
import store from '@/store'

const defaultProductAttr = {
  filterType: 0,
  handAddStatus: 0,
  inputList: '',
  inputType: 0,
  name: '',
  productAttributeCategoryId: 0,
  relatedStatus: 0,
  searchType: 0,
  selectType: 0,
  sort: 0,
  type: 0,
  bizCode: null,
};
export default {
  name: "ProductAttrDetail",
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    const inputListValid = (rule, value, callback) => {
      if (value) {
        const arr = value.split(/[(\r\n)\r\n]+/);
        if ((new Set(arr)).size != arr.length) {
          callback(new Error('请勿输入重复值'));
          return;
        }
        if (this.type === 1 && arr.some(v => v.length > 30)) {
          callback(new Error('每个参数最多30个字'));
          return;
        }
        if (this.type === 0 && arr.some(v => v.length > 15)) {
          callback(new Error('每个规格最多15个字'));
          return;
        }
      } else {
        const str = this.type === 1 ? '参数' : '规格';
        callback(new Error(`请输入${str}`));
      }
      callback();
    }
    return {
      productAttr: Object.assign({}, defaultProductAttr),
      type: Number(this.$route.query.type),
      rules: {
        name: [
          { required: true, message: '请输入属性名称', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        inputList: [
          { required: true, validator: inputListValid, trigger: 'blur' }
        ]
      },
      productAttrCateList: null,
    }
  },
  created () {
    if (this.isEdit) {
      getProductAttr(this.$route.query.id).then(response => {
        this.productAttr = response.data;
        this.productAttr.inputList = this.productAttr.inputList && this.productAttr.inputList.join('\n');
        this.type = response.data.type;
      });
    } else {
      this.resetProductAttr();
    }
    if (Number(this.$route.query.type) === 1) {
      this.$route.meta.title = '添加商品参数';
    } else {
      this.$route.meta.title = '添加商品属性';
    }
    this.getCateList();
  },
  methods: {
    getChannel () {
      return store.getters.channel
    },
    inputTypeRadio (e) {
      if (e == 2) this.$set(this.productAttr, 'selectType', 2)
    },
    getCateList () {
      let listQuery = { pageNum: 1, pageSize: 100 };
      fetchList(listQuery).then(response => {
        this.productAttrCateList = response.data.list;
      });
    },
    resetProductAttr () {
      this.productAttr = Object.assign({}, defaultProductAttr);
      this.productAttr.productAttributeCategoryId = Number(this.$route.query.cid);
      this.productAttr.type = Number(this.$route.query.type);
      // this.productAttr.bizCode = this.getChannel();
    },
    onSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm('是否提交数据', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const param = {
              inputList: this.productAttr.inputList ? this.productAttr.inputList.split(/[(\r\n)\r\n]+/) : null,
              handAddStatus: this.productAttr.inputType === 0 ? 1 : 0
            }
            if (this.isEdit) {
              updateProductAttr(this.$route.query.id, { ...this.productAttr, ...param }).then(response => {
                this.$message({
                  message: '修改成功',
                  type: 'success',
                  duration: 1000
                });
                this.$router.back();
              });
            } else {
              createProductAttr({ ...this.productAttr, ...param }).then(response => {
                this.$message({
                  message: '提交成功',
                  type: 'success',
                  duration: 1000
                });
                this.resetForm('productAttrFrom');
                this.$router.back();
              });
            }
          });

        } else {
          this.$message({
            message: '验证失败',
            type: 'error',
            duration: 1000
          });
          return false;
        }
      });
    },
    resetForm (formName) {
      this.$refs[formName].resetFields();
      this.resetProductAttr();
    }
  },
}
</script>

<style scoped>
</style>
