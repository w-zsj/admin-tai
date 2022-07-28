<template> 
  <div class="app-container">
    <el-card class="operate-container" shadow="never">

      <i class="el-icon-tickets" style="margin-top: 5px"></i>
      <span style="margin-top: 5px">数据列表</span>
      <el-button class="btn-add" @click="addProductAttr()" size="mini">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="productAttrTable" :data="list" style="width: 100%" v-loading="listLoading" border>
        <el-table-column label="序号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column :label="listQuery.type == 1 ? '参数类型' : '属性名称'" width="140" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column :label="`${listQuery.type == 1 ? '参数' : '规格'}录入方式`" width="150" align="center">
          <template slot-scope="scope">{{scope.row.inputType|inputTypeFilter}}</template>
        </el-table-column>
        <el-table-column :label="`${listQuery.type == 1 ? '参数' : '规格'}列表`" align="center">
          <template slot-scope="scope">{{scope.row.inputList ? scope.row.inputList.join(',') : null}}</template>
        </el-table-column>
        <el-table-column label="排序" width="100" align="center">
          <template slot-scope="scope">{{scope.row.sort}}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleUpdate(scope.$index, scope.row)">编辑
            </el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
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
import { fetchList, deleteProductAttr } from '@/api/productAttr'

export default {
  name: 'productAttrList',
  data() {
    return {
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 5,
        type: this.$route.query.type
      },
      operateType: null,
      multipleSelection: [],
      operates: [
        {
          label: "删除",
          value: "deleteProductAttr"
        }
      ]
    }
  },
  created() {
    if (this.$route.query.type == 1) {
      this.$route.meta.title = '商品参数列表';
    } else {
      this.$route.meta.title = '商品属性列表';
    }
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      fetchList(this.$route.query.cid, this.listQuery).then(response => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
      });
    },
    addProductAttr() {
      this.$router.push({ path: '/pms/addProductAttr', query: { cid: this.$route.query.cid, type: this.$route.query.type } });
    },
    handleBatchOperate() {
      if (this.multipleSelection.length < 1) {
        this.$message({
          message: '请选择一条记录',
          type: 'warning',
          duration: 1000
        });
        return;
      }
      if (this.operateType !== 'deleteProductAttr') {
        this.$message({
          message: '请选择批量操作类型',
          type: 'warning',
          duration: 1000
        });
        return;
      }
      let ids = [];
      for (let i = 0; i < this.multipleSelection.length; i++) {
        ids.push(this.multipleSelection[i].id);
      }
      this.handleDeleteProductAttr(ids);
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
    handleUpdate(index, row) {
      this.$router.push({ path: '/pms/updateProductAttr', query: { id: row.id, cid: this.$route.query.cid } });
    },
    handleDeleteProductAttr(ids) {
      this.$confirm('是否要删除该属性', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = new URLSearchParams();
        data.append("ids", ids);
        deleteProductAttr(data).then(response => {
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 1000
          });
          if (this.list && this.list.length === 1 && this.listQuery.pageNum > 1) {
            this.listQuery.pageNum--;
          }
          this.getList();
        });
      });
    },
    handleDelete(index, row) {
      let ids = [];
      ids.push(row.id);
      this.handleDeleteProductAttr(ids);
    },
  },
  filters: {
    inputTypeFilter(value) {
      if (value === 1) {
        return '从列表中选取';
      } else if (value == 2) {
        return '复选框';
      } else {
        return '手工录入'
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>


