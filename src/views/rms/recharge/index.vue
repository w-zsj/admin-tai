<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="会员手机号：">
            <el-input v-model="listQuery.phone" class="input-width" placeholder="标题"></el-input>
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
        <el-table-column label="付款图片" width='280' align="center">
          <template slot-scope="scope">
            <el-image style=" height: 80px;" :src="scope.row.pic" :preview-src-list="[scope.row.image]" />
          </template>
        </el-table-column>
        <el-table-column label="手机号" align="center">
          <template slot-scope="scope">{{scope.row.phone}}</template>
        </el-table-column>
        <el-table-column label="昵称" align="center">
          <template slot-scope="scope">{{scope.row.nickname}}</template>
        </el-table-column>
        <el-table-column label="原金币数量" align="center">
          <template slot-scope="scope">{{scope.row.sourceCoin}}</template>
        </el-table-column>
        <el-table-column label="积分改变数量" align="center">
          <template slot-scope="scope">{{scope.row.changeCount}}</template>
        </el-table-column>
        <el-table-column label="改变类型" align="center">
          <template slot-scope="scope">{{scope.row.changeType==0?'增加':'减少'}}</template>
        </el-table-column>
        <el-table-column label="积分来源" align="center">
          <template slot-scope="scope">{{scope.row.sourceType==0?'购物':'管理员修改'}}</template>
        </el-table-column>
        <el-table-column label="操作人员" align="center">
          <template slot-scope="scope">{{scope.row.operateMan}}</template>
        </el-table-column>
        <el-table-column label="操作备注" align="center">
          <template slot-scope="scope">{{scope.row.operateNote}}</template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">{{scope.row.status==0?'待审核':scope.row.status==1?'审核通过':'审核不通过 '}}</template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">{{scope.row.createTime | formatTime}}</template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status==0" size="mini" type="text" @click="dialogVisible=true">审核</el-button>
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

    <el-dialog title="充值审核" :visible.sync="dialogVisible" width="30%">
      <div style="margin-bottom:20px;">
        <span style="vertical-align: top">审核状态：</span>
        <el-radio-group v-model="status">
          <el-radio :label="1">审核通过</el-radio>
          <el-radio :label="2">审核不通过</el-radio>
        </el-radio-group>
      </div>
      <span style="vertical-align: top">操作备注：</span>
      <el-input style="width: 80%" type="textarea" :rows="5" placeholder="请输入内容" v-model="note">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleCloseOrderConfirm">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
import { coinList, coinOperate } from '@/api/paySetting.js'
const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  phone: ''
};
export default {
  name: "knowledge",
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      total: null,
      listLoading: false,
      dialogVisible: false,
      status: "",
      note: ''
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
    getList() {
      this.listLoading = false;
      coinList(this.listQuery).then((response) => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
      });
    },
    handleCloseOrderConfirm() {
      if (this.status) coinOperate({ status: this.status, note: this.note })
        .then(res => {
          if (res.code == 1) {
            this.dialogVisible = false;
            this.getList();
          }
        })
    }
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


