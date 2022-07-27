<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="会员名称：">
            <el-input v-model="listQuery.title" class="input-width" placeholder="标题"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button style="float:right" type="primary" @click="handleSearchList()" size="small"> 查询搜索</el-button>
            <el-button style="float:right;margin-right: 15px" @click="handleResetSearch()" size="small"> 重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

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
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper" :page-size="listQuery.pageSize" :page-sizes="[5,10,15]"
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
export default {
  name: "knowledge",
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      total: null,
      listLoading: false,
      operateType: null,
      typeEnum: ['h5链接', '图片'],
    };
  },
  created() {
    this.getList();
  },
  mounted() { },
  filters: {
    formatTime(time) {
      if (time == null || time === "") {
        return "N/A";
      }
      return formatDate(time, "yyyy-MM-dd hh:mm:ss");
    },
  },
  methods: {
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery);
    },
    handleSearchList() {
      this.listQuery.pageNum = 1;
      this.getList();
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
    //   查看
    handleUpdate(index, row) {

    },
    getList() {
      this.listLoading = true;
      //   fetchList(this.listQuery).then((response) => {
      //     this.listLoading = false;
      //     this.list = response.data.list;
      //     this.total = response.data.total;
      //   });
    },
  },
};
</script>
<style lang="scss" scoped>
.app-container {
  height: calc(100vh - 120px);
}
.input-width {
  width: 203px;
}
/deep/ .el-image img {
  width: auto;
}
</style>


