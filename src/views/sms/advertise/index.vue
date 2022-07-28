<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="广告名称：">
            <el-input v-model="listQuery.name" class="input-width" placeholder="请输入关键词"></el-input>
          </el-form-item>
          <el-form-item label="状态：">
            <el-select v-model="listQuery.status" placeholder="请选择" clearable class="input-width">
              <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="广告位置：">
            <el-select v-model="listQuery.type" placeholder="请选择广告位置" clearable class="input-width">
              <el-option v-for="item in locationOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="可见类型：">
            <el-select v-model="listQuery.type" placeholder="请选择可见类型" clearable class="input-width">
              <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item>
            <el-button style="float:right" type="primary" @click="handleSearchList()" size="small"> 查询搜索</el-button>
            <el-button style="float:right;margin-right: 15px" @click="handleResetSearch()" size="small"> 重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <span>
        <el-button @click="batchHandleProduct('off')" size="mini">
          批量删除
        </el-button>
      </span>
      <el-button size="mini" class="btn-add" @click="handleAdd()">添加广告</el-button>
    </el-card>
    <div class="table-container ">
      <el-card class="operate-container" shadow="never">
        <div class="flex">
          <div class="table-tree">
            <div class="tit">广告图分类</div>
            <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
          </div>
          <el-table ref="homeAdvertiseTable" :data="list" style="width: 100%;" @selection-change="handleSelectionChange" v-loading="listLoading" border>
            <el-table-column type="selection" width="60" align="center"></el-table-column>
            <el-table-column label="ID" width="60" align="center">
              <template slot-scope="scope">{{scope.row.id}}</template>
            </el-table-column>
            <el-table-column label="排序" width="60" align="center">
              <template slot-scope="scope">{{scope.row.sort}}</template>
            </el-table-column>
            <el-table-column label="分类" align="center">
              <template slot-scope="scope">{{scope.row.name}}</template>
            </el-table-column>
            <el-table-column label="图片" align="center">
              <template slot-scope="scope">
                <img v-if='scope.row.pic' style="height: 80px" :src="scope.row.pic">
                <span v-else>暂无图片</span>
              </template>
            </el-table-column>
            <el-table-column label="位置" align="center">
              <template slot-scope="scope">{{typeEnum[scope.row.type-1]}}</template>
            </el-table-column>
            <el-table-column label="链接地址" align="center">
              <template slot-scope="scope">{{typeEnum[scope.row.type-1]}}</template>
            </el-table-column>
            <el-table-column label="创建时间" align="center">
              <template slot-scope="scope">{{scope.row.createTime || '-'}}</template>
            </el-table-column>
            <el-table-column label="状态" width="70" align="center">
              <template slot-scope="scope">
                {{scope.row.status}}
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
        </div>
      </el-card>
    </div>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes,prev, pager, next,jumper" :page-size="listQuery.pageSize" :page-sizes="[5,10,15]" :current-page.sync="listQuery.pageNum" :total="total">
      </el-pagination>
    </div>

  </div>
</template>
<script>
import {
  fetchList,
  updateStatus,
  deleteHomeAdvertise,
} from "@/api/homeAdvertise";
import { formatDate } from "@/utils/date";
const defaultListQuery = {
  pageNum: 1,
  pageSize: 5,
  name: null,
  type: null,
  endTime: null,
};
const detaultStatusOptions = [
  { label: '全部', value: null },
  { label: '已开启', value: 1 },
  { label: '已关闭', value: 0 }
];
const detaultLocationOptions = [
  { label: '首页banner', value: 1 },
  { label: '个人中心', value: 4 }
];
export default {
  name: "homeAdvertiseList",
  data() {
    return {
      tableHeight: 0, // 表格高度
      listQuery: Object.assign({}, defaultListQuery),
      statusOptions: Object.assign({}, detaultStatusOptions),
      locationOptions: Object.assign({}, detaultLocationOptions),
      // typeOptions: Object.assign({}, detaultTypeOptions),
      list: null,
      total: null,
      listLoading: false,
      typeEnum: ['首页banner', '个人中心'],
      data: [{
        label: '一级 1',
        children: [{
          label: '二级 1-1',
          children: [{
            label: '三级 1-1-1'
          }]
        }]
      }, {
        label: '一级 2',
        children: [{
          label: '二级 2-1',
          children: [{
            label: '三级 2-1-1'
          }]
        }, {
          label: '二级 2-2',
          children: [{
            label: '三级 2-2-1'
          }]
        }]
      }, {
        label: '一级 3',
        children: [{
          label: '二级 3-1',
          children: [{
            label: '三级 3-1-1'
          }]
        }, {
          label: '二级 3-2',
          children: [{
            label: '三级 3-2-1'
          }]
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      multipleSelection: [],// 当前选择的列表
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
    // 左侧分类点击
    handleNodeClick(data) {
      console.log(data);
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
    handleUpdateStatus(index, row) {
      this.$confirm("是否要修改上线/下线状态?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          updateStatus(row.id, { status: row.status }).then((response) => {
            this.getList();
            this.$message({
              type: "success",
              message: "修改成功!",
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "success",
            message: "已取消操作!",
          });
          this.getList();
        });
    },
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
    // 选择列表
    handleSelectionChange() {
      this.multipleSelection = val;
    },
    // 批量删除
    batchHandleProduct() {
      let ids = [];
      console.log('multipleSelection', this.multipleSelection)
      // 处理选中的商品id
      this.multipleSelection && this.multipleSelection.map(item => {
        ids.push(item.id)
      })
      if (this.multipleSelection.length < 1) {
        this.$message({
          message: "请选选中商品后再进行批量操作！",
          type: "error",
          duration: 1000,
        })
        return
      }
      this.$confirm("是否要进行批量操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {


      });
    }
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


