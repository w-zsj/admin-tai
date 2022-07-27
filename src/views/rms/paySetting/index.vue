<template> 
  <div class="app-container">
    <!-- 支付配置 -->
    <el-table ref="wineKnowledgeTable" :data="list" style="width: 100%;" border>
      <el-table-column label="支付名称" align="center">
        <template slot-scope="scope">{{scope.row.title}}</template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" active-text="按月付费" inactive-text="按年付费">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center">
        <template slot-scope="scope">44</template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="text">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 上传 支付二维码 -->
    <div class="code">
      <el-card shadow="never">
        <el-button size="small" type="primary" style="margin-bottom:20px;">保存</el-button>
        <el-row :gutter="20">
          <el-col :span="4">
            <span>支付二维码：</span>
            <multi-upload v-model="payPic" :maxCount='1' :maxSize='5'></multi-upload>
          </el-col>
          <el-col :span="3">
            <span>充值二维码：</span>
            <multi-upload v-model="rechargePic" :maxCount='1' :maxSize='5'></multi-upload>
          </el-col>
        </el-row>
      </el-card>
    </div>
  </div>
</template>
<script>
import MultiUpload from "@/components/Upload/multiUpload";
export default {
  components: { MultiUpload },
  data() {
    return {
      list: [],
      payPic: [],
      rechargePic: []
    };
  },
  created() {

  },
  mounted() { },

  methods: {

  },
};
</script>
<style lang="scss" scoped>
.code {
  font-size: 14px;
  color: #333;
  font-weight: bold;
  margin-top: 50px;
}
</style>


