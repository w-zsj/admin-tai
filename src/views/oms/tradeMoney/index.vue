<template>
  <div class="wrap">
    <div class="mb">
      <el-row :gutter="20">
        <el-col :span="4" v-for="(item, idx) in recordList" :key="idx">
          <div class="grid-content flex-aic">
            <div class="icon flex-ctr" :class="item.class" :style="{ background: item.bg }">
              <svg-icon :icon-class="item.svg_icon" class="t_user_icon"></svg-icon>
            </div>
            <div class="count flex-col">
              <div>{{ item.count }}</div>
              <div class="txt">{{ item.desc }}</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="table-container">
      <el-tabs v-model="activeName" type="card" @tab-click="selectStatus">
        <el-tab-pane v-for="(item, index) in statusOptions" :key="index" :label="item.label" :name="item.name">
        </el-tab-pane>
      </el-tabs>
      <el-table ref="wineKnowledgeTable" :data="list" style="width: 100%" v-loading="listLoading" border>
        <el-table-column label="序号" align="center">
          <template slot-scope="scope">{{ scope.row.title }}</template>
        </el-table-column>
        <el-table-column label="订单ID" width="280" align="center">
          <template slot-scope="scope">{{ scope.row.orderNo }}</template>
        </el-table-column>
        <el-table-column label="成交额(元)" align="center">
          <template slot-scope="scope">{{ scope.row.publishedTime }}</template>
        </el-table-column>
        <el-table-column label="成交时间" align="center">
          <template slot-scope="scope">{{
            scope.row.publishedTime | formatTime
          }}</template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">{{ scope.row.publishedTime }}</template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper" :page-size="listQuery.pageSize" :page-sizes="[5, 10, 15]"
        :current-page.sync="listQuery.pageNum" :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  title: null,
  publishedTime: null,
};
const recordList = [
  {
    svg_icon: "t_user_icon",
    count: "1",
    unit: "",
    class: "user",
    desc: "总成交金额(元)",
    bg: "#5CE3D5",
  },
  {
    svg_icon: "t_distribution_icon",
    count: "33",
    unit: "",
    class: "distribution",
    desc: "当天成交额(元)",
    bg: "##EE592C",
  },
];
export default {
  data() {
    return {
      recordList,
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      total: null,
      listLoading: false,
      activeName: "all",
      statusOptions: [
        {
          label: "全部",
          value: null,
          name: "all",
        },
        {
          label: "当天订单",
          value: 0,
          name: "wait_pay",
        },
        {
          label: "当月订单",
          value: 1,
          name: "wait_sent",
        },
      ],
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    // 根据状态查询
    selectStatus() {
      this.listQuery["status"] = this.statusOptions.find(
        (i) => i.name == this.activeName
      ).value;
      this.getList();
    },
    getList() { },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getList();
    },
  },
};
</script>
<style lang="scss" scoped>
.wrap {
  font-size: 14px;
  color: #606266;
  padding: 40px;
  .grid-content {
    height: 80px;
    border: 1px solid #ccc;

    .t_user_icon {
      font-size: 32px;
    }

    .icon {
      width: 30%;
      height: 100%;
      background: #ea8f62;
    }

    .count {
      width: 70%;
      height: 100%;
      justify-content: center;
      align-items: center;
      font-size: 18px;
      font-weight: bold;

      .txt {
        font-size: 12px;
        font-weight: normal;
        padding-top: 10px;
      }
    }
  }

  .mb {
    margin-bottom: 20px;
  }
  // /deep/ .el-tabs__header {
  //   margin-bottom: 0;
  // }
}
</style>
