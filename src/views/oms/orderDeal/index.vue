<template>
   
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="订单编号：">
            <el-input v-model="listQuery.name" class="input-width" placeholder="请输入关键词"></el-input>
          </el-form-item>
          <el-form-item label="产品名称：">
            <el-input v-model="listQuery.name" class="input-width" placeholder="请输入关键词"></el-input>
          </el-form-item>
          <el-form-item label="添加时间：">
            <el-date-picker class="input-width" v-model="listQuery.publishedTime" value-format="yyyy-MM-dd" type="date"
              placeholder="请选择时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button style="float: right" type="primary" @click="handleSearchList()" size="small">
              查询搜索</el-button>
            <el-button style="float: right; margin-right: 15px" @click="handleResetSearch()" size="small">
              重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <div style="margin-top: 20px">
      <el-tabs v-model="activeName" type="card" @tab-click="selectStatus">
        <el-tab-pane v-for="(item, index) in statusOptions" :key="index" :label="item.label" :name="item.name">
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-table ref="homeAdvertiseTable" :data="list" style="width: 100%" v-loading="listLoading" border>
      <el-table-column type="selection" width="60" align="center"></el-table-column>
      <el-table-column label="订单编号" align="center">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column label="订单内容" align="center">
        <template slot-scope="scope">{{ scope.row.sort }}</template>
      </el-table-column>
      <el-table-column label="交易金额" align="center">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column label="类型" align="center">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column label="交易时间" align="center">
        <template slot-scope="scope">{{ scope.row.createTime || "-" }}</template>
      </el-table-column>
      <el-table-column label="数量" align="center">
        <template slot-scope="scope">{{scope.row.number}}</template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">{{ scope.row.status }}</template>
      </el-table-column>
      <el-table-column label="说明" align="center">
        <template slot-scope="scope">
          {{ scope.row.status }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="90" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="handleUpdateStatus(scope.$index, scope.row)">禁用
          </el-button>
          <el-button size="mini" type="text" @click="handleUpdate(scope.$index, scope.row)">编辑
          </el-button>
          <el-button size="mini" type="text" @click="handleDelete(scope.$index, scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper" :page-size="listQuery.pageSize" :page-sizes="[5, 10, 15]"
        :current-page.sync="listQuery.pageNum" :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { fetchList, updateStatus, deleteHomeAdvertise } from "@/api/homeAdvertise";
import { formatDate } from "@/utils/date";
const defaultListQuery = {
  pageNum: 1,
  pageSize: 5,
  name: null,
};
export default {
  name: "homeAdvertiseList",
  data() {
    return {
      tableHeight: 0, // 表格高度
      listQuery: Object.assign({}, defaultListQuery),
      // typeOptions: Object.assign({}, detaultTypeOptions),
      list: null,
      total: null,
      listLoading: false,

      multipleSelection: [], // 当前选择的列表
      activeName: "all",
      statusOptions: [
        {
          label: "全部",
          value: null,
          name: "all",
        },
        {
          label: "待付款",
          value: 0,
          name: "wait_pay",
        },
        {
          label: "待审核",
          value: 1,
          name: "wait_sent",
        },
        {
          label: "待收货",
          value: 3,
          name: "wait_get",
        },
        {
          label: "已取消 ",
          value: 4,
          name: "already_cancel",
        },
        {
          label: "已完成",
          value: 5,
          name: "already_completed",
        },
      ],
    };
  },
  created() {
    this.getList();
  },
  mounted() {
    this.$nextTick(() => {
      const h = document.body.clientHeight;
      this.tableHeight = h - 100;
    });
  },
  filters: {
    formatTime(time) {
      if (time == null || time === "") {
        return "-";
      }
      return formatDate(time, "yyyy-MM-dd hh:mm:ss");
    },
  },
  methods: {
    // 根据状态查询
    selectStatus() {
      this.listQuery["status"] = this.statusOptions.find(
        (i) => i.name == this.activeName
      ).value;
      this.getList();
    },
    // 重置
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery);
    },
    // 搜索
    handleSearchList() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    // 分页 修改size
    handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getList();
    },
    // 切换分页
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getList();
    },
    // 修改广告状态
    handleUpdateStatus(index, row) { },
    // 删除广告
    handleDelete(index, row) {
      this.deleteHomeAdvertise(row.id);
    },
    // 添加广告
    handleAdd() {
      this.$router.push({ path: "/sms/addAdvertise" });
    },
    // 编辑广告
    handleUpdate(index, row) {
      this.$router.push({
        path: "/sms/updateAdvertise",
        query: { id: row.id },
      });
    },
    // 获取广告列表
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then((response) => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
      });
    },
    deleteHomeAdvertise(ids) {
      this.$confirm("是否要删除该广告?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let params = new URLSearchParams();
        params.append("ids", ids);
        deleteHomeAdvertise(params).then((response) => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          if (this.list && this.list.length === 1 && this.listQuery.pageNum > 1) {
            this.listQuery.pageNum--;
          }
          this.getList();
        });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.app-container {
  height: calc(100vh - 120px);
}
.table-tree {
  margin-right: 20px;
  .tit {
    font-size: 14px;
    padding: 10px;
    background: yellowgreen;
    color: #fff;
    margin-bottom: 10px;
  }
}
.input-width {
  width: 203px;
}
</style>
