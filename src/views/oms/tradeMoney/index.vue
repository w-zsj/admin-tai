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
      <el-table ref="wineKnowledgeTable" :data="list" style="width: 100%;" v-loading="listLoading" border>
        <el-table-column label="标题" align="center">
          <template slot-scope="scope">{{scope.row.title}}</template>
        </el-table-column>
        <el-table-column label="图片" width='280' align="center">
          <template slot-scope="scope">
            <el-image style=" height: 80px;" :src="scope.row.pic" :preview-src-list="[scope.row.pic]" />
          </template>
        </el-table-column>
        <el-table-column label="发布时间" align="center">
          <template slot-scope="scope">{{scope.row.publishedTime | formatTime}}</template>
        </el-table-column>
        <el-table-column label="文章类型" align="center">
          <template slot-scope="scope">{{typeEnum[scope.row.type-1]}}</template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleUpdate(scope.$index, scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes,prev, pager, next,jumper" :page-size="listQuery.pageSize" :page-sizes="[5,10,15]" :current-page.sync="listQuery.pageNum" :total="total">
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
    svg_icon: 't_user_icon',
    count: "1",
    unit: "",
    class: "user",
    desc: "订单金额",
    bg: '#5CE3D5'
  },
  {
    svg_icon: 't_distribution_icon',
    count: "33",
    unit: "",
    class: "distribution",
    desc: "交易订单",
    bg: '##EE592C'
  },

]
export default {

  data() {
    return {
      recordList,
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      total: null,
      listLoading: false,
    }
  },
  mounted() {
    this.getChartList()
  },
  methods: {
    getChartList() {


    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getList();
    },

  }
}
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
}
</style>