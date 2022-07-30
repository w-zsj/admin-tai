<template> 
  <el-card class="form-container" shadow="never">
    <el-form :model="homeAdvertise" :rules="rules" ref="homeAdvertiseForm" label-width="150px" size="small">
      <el-form-item label="广告位置：" required>
        <el-select v-model="homeAdvertise.type" @change="handleLocationChange">
          <el-option v-for="type in typeOptions" :key="type.value" :label="type.label" :value="type.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="广告名称：" prop="name">
        <el-input v-model="homeAdvertise.name" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="广告图片：" prop="uploadPic">
        <multiUpload v-model="homeAdvertise.uploadPic" :maxCount='1' :picWidth="picWidth" :picHeight='picHeight'
          acceptType='.png,.gif' :tipText='`请上传2M以内的png/gif图片，尺寸${typeSizeEnum[homeAdvertise.type-1]}`' />
      </el-form-item>
      <el-form-item label="上线时间：" prop="startTime">
        <el-date-picker type="datetime" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss"
          v-model="homeAdvertise.startTime"></el-date-picker>
      </el-form-item>
      <el-form-item label="下线时间：">
        <el-date-picker type="datetime" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss"
          v-model="homeAdvertise.endTime"></el-date-picker>
      </el-form-item>
      <el-form-item label="跳转目标：" required prop="urlType">
        <el-radio-group v-model="homeAdvertise.urlType" @change='handleUrlTypeChange'>
          <el-radio :label="2">URL</el-radio>
          <el-radio :label="3">纯图片</el-radio>
          <el-radio :label="4">页面路径</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if='homeAdvertise.urlType === 2' label="URL链接：" prop="adUrl">
        <el-input v-model="homeAdvertise.adUrl" class="input-width" placeholder="请输入广告链接"></el-input>
      </el-form-item>
      <el-form-item v-if='homeAdvertise.urlType === 3' label="纯图片：" prop="adPic">
        <multiUpload v-model="homeAdvertise.adPic" :maxCount='1' :picWidth="180" :picHeight='200'
          tipText='请上传2M以内的png/jpg/gif图片' acceptType='.png,.gif,.jpg' />
      </el-form-item>
      <el-form-item v-if='homeAdvertise.urlType === 4' label="页面路径：" prop="pageUrl">
        <el-select v-model="homeAdvertise.pageUrl" placeholder="请选择">
          <el-option v-for="type in uriOptions" :key="type.value" :label="type.label" :value="type.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="是否开启：" required>
        <el-radio-group v-model="homeAdvertise.status">
          <el-radio :label="1">开启</el-radio>
          <el-radio :label="0">关闭</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="排序：">
        <el-input v-model="homeAdvertise.sort" class="input-width"></el-input>
      </el-form-item>

      <el-form-item label="备注：">
        <el-input class="input-width" type="textarea" :rows="5" placeholder="请输入内容" v-model="homeAdvertise.note">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('homeAdvertiseForm')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('homeAdvertiseForm')">重置</el-button>
      </el-form-item>
    </el-form>

  </el-card>
</template>
<script>
import multiUpload from "@/components/Upload/multiUpload";
import {
  createHomeAdvertise,
  getHomeAdvertise,
  updateHomeAdvertise,
} from "@/api/homeAdvertise";
import { formatDate } from "@/utils/date";
import { typeCheckUtil } from '@/utils/index';
const defaultTypeOptions = [
  { label: '首页banner', value: 1 },
  { label: '个人中心', value: 4 },
];
const defaultHomeAdvertise = {
  name: "",
  type: 1,
  pic: null,
  startTime: '',
  endTime: '',
  status: 1,
  url: null,
  note: null,
  sort: 0,
  productId: '',
  adUrl: '',
  urlType: 1,
  frequency: 1
};
const defaultUriOptions = [
  { label: '购物车页面', value: '/pages/mall/index' },
  { label: '我的', value: '/pages/mine/index' },
]
const defaultAdTypeOptions = ['productId', 'adUrl', 'adPic', 'pageUrl',]
const defaultListQuery = {
  pageNum: 1,
  pageSize: 5,
  name: null,
  type: null,
  isExpired: false,
  showStatus: null,
  id: null
};
export default {
  name: "HomeAdvertiseDetail",
  components: { multiUpload },
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    const that = this;
    const picValid = (rule, value, callback) => {
      const { type, urlType } = that.homeAdvertise;
      if (!value || !value.length) {
        if (type === 1) {
          callback(new Error('请上传banner图片，尺寸：686*730px的png/gif'));
          return;
        }
        if (type === 2 || type === 4) {
          callback(new Error('请上传瓷片区图片，尺寸：686*154px的png/gif'));
          return;
        }
      }
      callback();
    }
    return {
      homeAdvertise: Object.assign({}, defaultHomeAdvertise),
      uriOptions: Object.assign({}, defaultUriOptions),
      listQuery: Object.assign({}, defaultListQuery),
      rules: {
        name: [
          { required: true, message: "请输入广告名称", trigger: "blur" },
          {
            min: 2,
            max: 140,
            message: "长度在 2 到 140 个字符",
            trigger: "blur",
          },
        ],
        uploadPic: [{ required: true, validator: picValid }],
        adUrl: [{ required: true, message: "请输入广告链接", trigger: "blur" }],
        productId: [{ required: true, message: "请输入商品ID", trigger: "blur" }],
        startTime: [{ required: true, message: "请选择上线时间", trigger: "blur" }],
        adPic: [{ required: true, message: "请上传纯图片" }],
        pageUrl: [{ required: true, message: "请选择页面路径", trigger: "blur" }]
      },
      typeOptions: Object.assign({}, defaultTypeOptions),
      picHeight: 200,
      picWidth: 190,
      list: [],
      total: 0,
      listLoading: false,
      typeSizeEnum: ['686*730px', '686*154px', '600*800px', '686*154px',],
    };
  },
  mounted() {
    if (this.isEdit) {
      getHomeAdvertise(this.$route.query.id).then((response) => {
        this.homeAdvertise = response.data;
        this.checkSize(this.homeAdvertise.type);
        if (this.homeAdvertise.pic) {
          this.$set(this.homeAdvertise, 'uploadPic', [this.homeAdvertise.pic]);
        }
        if (this.homeAdvertise.url) {
          const i = this.homeAdvertise.url.indexOf('goods-detail');
          if (i > -1) {
            const index = this.homeAdvertise.url.indexOf('=');
            this.$set(this.homeAdvertise, 'productId', this.homeAdvertise.url.substr(index + 1));
          } else {
            const { urlType } = this.homeAdvertise;
            if ([2, 4].some(v => v === urlType)) {
              const attr = defaultAdTypeOptions[urlType - 1];
              this.$set(this.homeAdvertise, attr, this.homeAdvertise.url);
            }
          }
        }
      });
    } else {
      this.homeAdvertise = Object.assign({}, defaultHomeAdvertise);
    }
  },
  filters: {
    formatDate(time) {
      if (time == null || time === "") {
        return "N/A";
      }
      return formatDate(time, "yyyy-MM-dd");
    }
  },
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const { urlType } = this.homeAdvertise;

          this.$confirm(`是否提交数据？`, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            const { uploadPic } = this.homeAdvertise;
            let pic = uploadPic + "";
            this.homeAdvertise.pic = pic;
            if (urlType === 1) {
              this.homeAdvertise.url = `/pages/mall/goods-detail/goods-detail?id=${this.homeAdvertise.productId}`;
              const keys = ['adUrl', 'adPic', 'pageUrl'];
              keys.forEach(key => this.homeAdvertise[key] = null);
            } else {
              const attr = defaultAdTypeOptions[urlType - 1];
              const url = this.homeAdvertise[attr];
              if (typeCheckUtil.isArray(url)) {
                this.homeAdvertise.url = url[0];
              } else {
                this.homeAdvertise.url = url;
              }
              this.homeAdvertise.productId = '';
            }
            if (this.isEdit) {
              updateHomeAdvertise(this.$route.query.id, this.homeAdvertise).then((response) => {
                this.handleSuccess('修改', formName);
              });
            } else {
              createHomeAdvertise(this.homeAdvertise).then((response) => {
                this.handleSuccess('提交', formName);
              });
            }
          });
        } else {
          this.$message({
            message: "验证失败",
            type: "error",
            duration: 1000,
          });
          return false;
        }
      });
    },
    handleSuccess(msg, formName) {
      this.resetForm(formName);
      this.$message({
        message: `${msg}成功`,
        type: "success",
        duration: 1000,
      });
      this.$router.back();
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.homeAdvertise = Object.assign({}, defaultHomeAdvertise);
    },
    handleLocationChange(val) {
      this.checkSize(val);
      this.$set(this.homeAdvertise, 'urlType', 1);
    },
    checkSize(type) {
      if (type === 1) {
        // 首页banner
        this.picWidth = 200;
        this.picHeight = 190;
      } else {
        // 个人中心
        this.picWidth = 300;
        this.picHeight = 100;
      }
    },
    handleUrlTypeChange(val) {
      this.$refs['homeAdvertiseForm'].clearValidate([defaultAdTypeOptions[val - 1]]);
    },
  },
};
</script>
<style scoped lang="scss">
.input-width {
  width: 70%;
}
.tip {
  font-size: 14px;
  color: #999;
}
.pagination-container {
  float: none;
  margin-top: 10px;
}
.el-table {
  /deep/ .disable-row {
    background: #ddd;
    color: #bbb;
  }
}
.coupon-bag-table {
  /deep/
    .el-table--enable-row-hover
    .el-table__body
    tr:hover
    > td.el-table__cell {
    background-color: inherit;
  }
}
</style>


