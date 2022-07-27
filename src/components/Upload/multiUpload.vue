<template>
  <div class="uploadWrapper">
    <vuedraggable class="vue-draggable" :class="{ single: isSingle, maxHidden: isMaxHidden }" v-model="fileList" tag="ul" draggable=".draggable-item" @start="onDragStart" @end="onDragEnd">
      <!-- 拖拽元素 -->
      <li v-for="(item, index) in fileList" :key="index" class="draggable-item" :style="{ width: picWidth + 'px', height: picHeight + 'px' }">
        <el-image :src="item" :preview-src-list="[item]"></el-image>
        <div class="shadow" @click="onRemoveHandler(index)">
          <i class="el-icon-delete"></i>
        </div>
      </li>
      <!-- 上传按钮 -->
      <el-upload v-if="fileList.length<=maxCount" slot="footer" ref="uploadRef" action="#" class="uploadBox" list-type="picture-card" :auto-upload="false" :show-file-list="false" :on-change="getFile" :limit="maxCount" :on-exceed="handleExceed" :style="{ width: picWidth + 'px', height: picHeight + 'px' }" :accept='acceptType'>
        <i class="el-icon-plus uploadIcon">
          <span class="uploading" v-show="isUploading">正在上传...</span>
          <span v-if="!isUploading && maxCount && maxCount !== 99 && !isSingle" class="limitTxt">最多{{ maxCount }}张</span>
        </i>
      </el-upload>
      <div class='upload-tip' v-if="tipText">{{tipText}}</div>
      <div class='upload-tip' v-else>只能上传jpg/png文件，且不超过{{maxSize}}MB</div>
    </vuedraggable>
  </div>
</template>
<script>
import vuedraggable from "vuedraggable";
import { upload } from "@/api/upload";
export default {
  name: "multiUpload",
  components: { vuedraggable },
  props: {
    // 图片数据(图片url组成的数组) 通过v-model传递
    value: {
      type: Array,
      default() {
        return [];
      },
    },
    //图片属性数组
    maxCount: {
      type: Number,
      default: 5,
    },
    // 限制上传图片的文件大小(kb)
    size: {
      type: Number,
      default: 500,
    },
    // 是否是单图上传(单图上传就是已传图片和上传按钮重叠)
    isSingle: {
      type: Boolean,
      default: false,
    },
    picWidth: {
      type: Number,
      default: 100,
    },
    picHeight: {
      type: Number,
      default: 100,
    },
    // 上传的最大体积M
    maxSize: {
      type: Number,
      default: 2
    },
    tipText: {
      type: String,
      default: ''
    },
    acceptType: {
      type: String,
      default: '.jpg,.png'
    }
  },
  data() {
    return {
      isUploading: false, // 正在上传状态
      isFirstMount: true, // 控制防止重复回显
      onoff: false,
    };
  },
  computed: {
    // 图片数组数据
    fileList: {
      get() {
        return this.value;
      },
      set(val) {
        if (val.length < this.fileList.length) {
          // 判断是删除图片时同步el-upload数据
          this.syncElUpload(val);
        }
        // 同步v-model
        this.$emit("input", val);
      },
    },
    // 控制达到最大限制时隐藏上传按钮
    isMaxHidden() {
      return this.fileList.length >= this.maxCount;
    },
  },
  watch: {
    value: {
      handler(val) {
        if (this.isFirstMount && this.value.length > 0) {
          this.syncElUpload();
        }
      },
      deep: true,
    },
  },
  methods: {
    // 同步el-upload数据
    syncElUpload(val) {
      const fileList = val || this.fileList;
      this.$refs.uploadRef.uploadFiles = fileList.map((v, i) => {
        return {
          name: "pic" + i,
          url: v,
          status: "success",
        };
      });
      this.isFirstMount = false;
    },
    // 移除单张图片
    onRemoveHandler(index) {
      this.$confirm("确定删除该图片?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.syncElUpload();
          this.fileList = this.fileList.filter((v, i) => {
            return i !== index;
          });
          this.$emit('delete', this.fileList)
        })
        .catch(() => { });
    },
    getFile(file, fileList) {
      if (this.onoff) return;
      const size = file && file.size ? file.size : 0;
      if (this.maxSize < size / 1024 / 1024) {
        this.$message.error(`文件不能超过${this.maxSize}M`);
        this.syncElUpload();
        return;
      }
      this.onoff = true;
      this.getBase64(file.raw).then((res) => {
        const params = res.split(",");
        if (params.length > 0) {
          let fileList = this.fileList;
          upload({ content: params[1], fileType: "png" })
            .then((res) => {
              this.syncElUpload();
              if (res && res.code == 1) {
                fileList.push(res.data);
                this.fileList = fileList;
                this.$emit('callback', this.fileList);
              } else {
                this.$message({
                  type: "error",
                  message: res.msg || res.message,
                });
                // this.syncElUpload();
              }
            })
            .catch((e) => {
              this.$message({ type: "error", message: e.msg || e.message });
              this.syncElUpload();
            })
            .finally(() => {
              setTimeout(() => {
                this.onoff = false;
              }, 1000);
            });
        }
      });
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

    handleExceed(files, fileList) {
      this.$refs.uploadRef.abort(); // 取消剩余接口请求
      this.syncElUpload();
      this.$message({
        type: "warning",
        message: `图片超限，最多可上传${this.maxCount}张图片`,
      });
    },
    onDragStart(e) {
      e.target.classList.add("hideShadow");
    },
    onDragEnd(e) {
      e.target.classList.remove("hideShadow");
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/ .el-upload {
  width: 100%;
  height: 100%;
}

.upload-tip {
  position: absolute;
  color: #666;
  font-size: 12px;
  bottom: -14px;
}

// 上传按钮
.uploadIcon {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #c0ccda;
  background-color: #fbfdff;
  border-radius: 6px;
  font-size: 20px;
  color: #999;

  .limitTxt,
  .uploading {
    position: absolute;
    bottom: 10%;
    left: 0;
    width: 100%;
    font-size: 14px;
    text-align: center;
  }
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
  &.single {
    position: relative;
    .upload-tip {
      bottom: -28px;
    }
    .draggable-item {
      position: absolute;
      left: 40px;
      top: 0;
      z-index: 1;
    }
  }
  &.maxHidden {
    .uploadBox {
      display: none;
    }
  }
}
.el-image-viewer__wrapper {
  .el-image-viewer__mask {
    opacity: 0.8;
  }
  .el-icon-circle-close {
    color: #fff;
  }
}
</style>
