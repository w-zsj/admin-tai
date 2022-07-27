<template> 
  <div class="app-container">
    <!-- 支付配置 -->
    <el-table ref="wineKnowledgeTable" :data="list" style="width: 100%;" border>
      <el-table-column label="支付名称" align="center">
        <template slot-scope="scope">{{scope.row.paytype}}</template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-switch :active-value="1" :inactive-value="0" v-model="scope.row.status" active-text="启用"
            inactive-text="关闭" @change="changeSwitch(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center">
        <template slot-scope="scope">{{scope.row.desc}}</template>
      </el-table-column>
      <!-- <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="text">查看</el-button>
        </template>
      </el-table-column> -->
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
      list: [
        {
          paytype: "微信支付",
          status: 1,
          desc: 'jhhhhhhhhh'
        },
        {
          paytype: "钱包支付",
          status: 0,
          desc: 'jhhhhhhhhh'
        },
        {
          paytype: "人工客服",
          status: 1,
          desc: 'jhhhhhhhhh'
        }
      ],
      payPic: [],
      rechargePic: []
    };
  },
  created() {

  },
  mounted() { },

  methods: {
    changeSwitch(row) {
      console.log('row', row)
    }
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


