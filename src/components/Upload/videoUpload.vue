<!--
 * @Author: Ayan
 * @Date: 2022-04-02 14:38:20
 * @LastEditors: Ayan
 * @LastEditTime: 2022-04-08 14:01:29
 * @Description: file not
-->
<template> 
  <div>
    <el-upload :action="useOss?ossUploadUrl:minioUploadUrl" :data="useOss?dataObj:null" accept="video" :multiple="false"
      :show-file-list="showFileList" :file-list="fileList" :before-upload="beforeUpload" :on-remove="handleRemove"
      :on-success="handleUploadSuccess" :on-preview="handlePreview">
      <video v-if="videoUrl !== '' && videoUrl !== null && videoFlag == false" :src="videoUrl" class="avatar"
        controls="controls">您的浏览器不支持视频播放</video>
      <el-progress v-if="videoFlag == true" type="circle" :percentage="videoUploadPercent" style="margin-top:30px;">
      </el-progress>
      <i v-if="!videoUrl && !isCheck" class="el-icon-plus uploadIcon"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="fileList[0].url" alt="">
    </el-dialog>
  </div>
</template>
<script>
import { policy } from '@/api/oss'

export default {
  name: 'videoUpload',
  props: {
    value: String,
    // 上传的最大体积M
    maxSize: { type: Number, default: 10 },
    isCheck: {
      type: Boolean,
      default: false
    },
    tipText: {
      type: String,
      default: ''
    },
  },
  computed: {
    videoUrl() {
      return this.value;
    },
    videoName() {
      if (this.value != null && this.value !== '') {
        return this.value.substr(this.value.lastIndexOf("/") + 1);
      } else {
        return null;
      }
    },
    fileList() {
      return [{
        name: this.videoName,
        url: this.videoUrl
      }]
    },
    showFileList: {
      get: function() {
        return this.value !== null && this.value !== '' && this.value !== undefined;
      },
      set: function(newValue) {
      }
    }
  },
  data() {
    return {
      dataObj: {
        policy: '',
        signature: '',
        key: '',
        ossaccessKeyId: '',
        dir: '',
        host: '',
      },
      videoFlag: false,
      dialogVisible: false,
      videoUploadPercent: '',
      useOss: true, //使用oss->true;使用MinIO->false
      ossUploadUrl: 'http://weishi-ecommerce.oss-cn-hongkong.aliyuncs.com/',
      minioUploadUrl: 'http://localhost:8080/minio/upload',
    };
  },
  methods: {
    emitInput(val) {
      this.$emit('input', val)
    },
    handleRemove(file, fileList) {
      this.emitInput('');
    },
    handlePreview(file) {
      // this.dialogVisible = true;
    },
    uploadVideoProcess(event, file, fileList) {
      this.videoFlag = true;
      this.videoUploadPercent = file.percentage.toFixed(0);
    },
    beforeUpload(file) {
      const size = file && file.size ? file.size : 0;
      if (['video/mp4', 'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb'].indexOf(file.type) == -1) {
        this.$message.error('请上传正确的视频格式');
        return false;
      }
      if (this.maxSize < size / 1024 / 1024) {
        this.$message.error(`文件不能超过${this.maxSize}M`);
        return false;
      }
      let _self = this;
      if (!this.useOss) {
        //不使用oss不需要获取策略
        return true;
      }
      return new Promise((resolve, reject) => {
        policy().then(response => {
          _self.dataObj.policy = response.data.policy;
          _self.dataObj.signature = response.data.signature;
          _self.dataObj.ossaccessKeyId = response.data.accessKeyId;
          _self.dataObj.key = response.data.dir + '/${filename}';
          _self.dataObj.dir = response.data.dir;
          _self.dataObj.host = response.data.host;
          resolve(true)
        }).catch(err => {
          reject(false)
        })
      })
    },
    handleUploadSuccess(res, file) {
      this.showFileList = true;
      this.fileList.pop();
      let url = this.dataObj.host + '/' + this.dataObj.dir + '/' + file.name;
      if (!this.useOss) {
        //不使用oss直接获取图片路径
        url = res.data.url;
      }
      this.fileList.push({ name: file.name, url: url });
      this.emitInput(this.fileList[0].url);
      this.videoFlag = false;
      this.videoUploadPercent = 0;
      console.log(77777, res, file)
    }
  }
}
</script>
<style lang="scss" scoped>
.uploadIcon {
  width: 100px;
  height: 100px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #c0ccda;
  background-color: #fbfdff;
  border-radius: 6px;
  font-size: 20px;
  color: #999;
}
.avatar {
  width: 100%;
}
.upload-tip {
  position: absolute;
  color: #666;
  font-size: 12px;
  bottom: -30px;
}
</style>


