<template>
  <div class="upload-container">
    <el-button icon='el-icon-upload' size="mini" :style="{background:color,borderColor:color}" @click=" dialogVisible=true" type="primary">上传图片
    </el-button>
    <el-dialog append-to-body :visible.sync="dialogVisible">
      <vuedraggable class="vue-draggable" v-model="fileList" tag="ul" draggable=".draggable-item" @start="onDragStart" @end="onDragEnd">
        <!-- 拖拽元素 -->
        <li v-for="(item, index) in fileList" :key="index" class="draggable-item" :style="{ width:'148px', height: '148px' }">
          <el-image :src="item" :preview-src-list="[item]"></el-image>
          <div class="shadow" @click="onRemoveHandler(index)">
            <i class="el-icon-delete"></i>
          </div>
        </li>
        <el-upload class="editor-slide-upload" action="#" :multiple="true" :show-file-list="false" :auto-upload="false" list-type="picture-card" :on-change="getFile">
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </vuedraggable>

      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </el-dialog>

  </div>
</template>

<script>
import { upload } from "@/api/upload";
import MultiUpload from "@/components/Upload/multiUpload";
import vuedraggable from "vuedraggable";
let count = 0
export default {
  name: 'editorSlideUpload',
  components: { MultiUpload, vuedraggable },
  props: {
    color: {
      type: String,
      default: '#1890ff'
    }
  },
  data() {
    return {
      dialogVisible: false,
      listObj: {},
      fileList: [],
      promise: null,
      reqParams: []
    }
  },
  methods: {

    checkAllSuccess() {
      return Object.keys(this.listObj).every(item => this.listObj[item].hasSuccess)
    },
    handleSubmit() {
      this.promise.then(fileList => {
        const arr = Object.keys(this.listObj).map(v => this.listObj[v])
        if (!this.checkAllSuccess()) {
          this.$message('请等待所有图片上传成功 或 出现了网络问题，请刷新页面重新上传！')
          return
        }
        this.$emit('successCBK', this.fileList);
        this.listObj = {};
        this.fileList = [];
        this.dialogVisible = false;
      })
    },
    // 移除单张图片
    onRemoveHandler(index) {
      this.fileList = this.fileList.filter((v, i) => {
        return i !== index;
      });
    },
    getFile(file) {
      const size = file && file.size ? file.size : 0;
      if (2 < size / 1024 / 1024) {
        this.$message.error(`单张图片超过2M，请压缩后上传`);
        return;
      }
      this.promise = new Promise((resolve) => {
        this.getBase64(file.raw).then(async (res) => {
          const params = res.split(",");
          if (params.length > 0) {
            this.reqParams.push(upload({ content: params[1], fileType: "png" }))
            let fileList = this.fileList;
            let reqParams = [...this.reqParams]
            for (let i = 0; i < reqParams.length; i++) {
              let data = await reqParams[i]
              if (data && data.code == 1) {
                !fileList.includes(data.data) && fileList.push(data.data);
                this.fileList = fileList;
                resolve(fileList)
              } else {
                this.$message({
                  type: "error",
                  message: data.msg || res.message,
                });
              }

            }
            this.reqParams = []
            // upload({ content: params[1], fileType: "png" })
            //   .then((res) => {
            //     if (res && res.code == 1) {
            //       fileList.push(res.data);
            //       this.fileList = fileList;
            //       resolve(fileList)
            //     } else {
            //       this.$message({
            //         type: "error",
            //         message: res.msg || res.message,
            //       });
            //     }
            //   })
            //   .catch((e) => {
            //     this.$message({ type: "error", message: e.msg || e.message });
            //   })
            //   .finally(() => {
            //     setTimeout(() => {
            //       this.onoff = false;
            //     }, 1000);
            //   });
          }
        });
      })

    },
    // 获取图片转base64
    getBase64(file) {
      return new Promise(function (resolve, reject) {
        const reader = new FileReader();
        let imgResult = "";
        reader.readAsDataURL(file);
        reader.onload = function () {
          imgResult = reader.result;
        };
        reader.onerror = function (error) {
          reject(error);
        };
        reader.onloadend = function () {
          resolve(imgResult);
        };
      });
    },
    onDragStart(e) {
      e.target.classList.add("hideShadow");
    },
    onDragEnd(e) {
      e.target.classList.remove("hideShadow");
      // console.log('fileList', this.fileList);
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.upload-container .editor-slide-upload {
  margin-bottom: 20px;
}

// 拖拽
.vue-draggable {
  display: flex;
  flex-wrap: wrap;

  .draggable-item {
    margin-right: 5px;
    margin-bottom: 5px;
    border: 1px solid #ddd;
    border-radius: 6px;
    position: relative;
    overflow: hidden;

    .el-image {
      width: 100%;
      height: 100%;
    }
    .shadow {
      position: absolute;
      top: 0;
      right: 0;
      background-color: rgba(0, 0, 0, 0.5);
      opacity: 0;
      transition: opacity 0.3s;
      color: #fff;
      font-size: 20px;
      line-height: 20px;
      padding: 2px;
      cursor: pointer;
    }
    &:hover {
      .shadow {
        opacity: 1;
      }
    }
  }
  &.hideShadow {
    .shadow {
      display: none;
    }
  }
}
</style>
