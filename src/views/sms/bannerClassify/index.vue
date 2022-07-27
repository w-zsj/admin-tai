<template> 
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <span>
        <el-button @click="batchHandleProduct('off')" size="mini">
          批量删除
        </el-button>
      </span>
      <el-button class="btn-add ml15" @click="handleAddProduct" size="mini">
        添加分类
      </el-button>

    </el-card>
    <div class="table-container">
      <el-table ref="productTable" :data="list" style="width: 100%" @selection-change="handleSelectionChange"
        v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="序号" width="60" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.name}}</p>
          </template>
        </el-table-column>
        <el-table-column label="店铺" align="center" width="120">
          <template slot-scope="scope">
            {{ scope.row.bizName}}
          </template>
        </el-table-column>
        <el-table-column label="商品分类" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.parentClassfyName}}</p>
          </template>
        </el-table-column>
        <el-table-column label="商品来源" align="center" width="100">
          <template slot-scope="scope">
            {{ scope.row.source | formatProductSource}}
          </template>
        </el-table-column>
        <el-table-column label="排序" width="80" align="center">
          <template slot-scope="scope">{{scope.row.sort}}</template>
        </el-table-column>
        <el-table-column label="更新时间" width="160" align="center">
          <template slot-scope="scope">{{scope.row.updateTime}}</template>
        </el-table-column>
        <el-table-column label="状态" width="120" align="center">
          <template slot-scope="scope">
            上架：
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center">
          <template slot-scope="scope">
            <p>
              <el-button size="mini" @click="handleShowProduct(scope.$index, scope.row)">禁用
              </el-button>
              <el-button size="mini" @click="handleAddProduct(scope.$index, scope.row)">编辑
              </el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除
              </el-button>
            </p>
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

    <el-dialog :title="isEdit?'编辑分类':'添加分类'" :visible.sync="dialogVisible" width="40%">
      <el-form :model="resource" ref="resourceForm" label-width="150px" size="small">
        <el-form-item label="分类名称：">
          <el-input v-model="resource.name" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="描述：">
          <el-input v-model="resource.description" type="textarea" :rows="5" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="状态：">
          <el-radio v-model="resource.status" label="1">显示</el-radio>
          <el-radio v-model="resource.status" label="2">隐藏</el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm()" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  updateDeleteStatus,
} from "@/api/product";
import { Resource } from '@/http-service/resource';

export default {
  name: "product",
  data() {
    return {
      dialogVisible: true,
      resource: {
        name: "",
        description: '',
        status: 1
      },
      isEdit: false,
      listQuery: {
        pageNum: 1,
        pageSize: 5,
      },
      list: null,
      total: 0,
      listLoading: true,
      multipleSelection: [],
      publishStatusOptions: [
        {
          value: 1,
          label: "已上架",
        },
        {
          value: 0,
          label: "已下架",
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
      this.tableHeight = h - 150;
    });
  },
  methods: {
    // 批量操作处理
    batchHandleProduct(type) {
      let ids = [];
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
        switch (type) {
          case 'on': {
            console.log("on")
            this.updateProductStatus(1, ids)
            return;
          }
          case 'off': {
            console.log("off")
            this.updateProductStatus(0, ids)
            return;
          }
        }
      });
    },
    updateProductStatus(productStatus, ids) {
      let params = {
        publishStatus: productStatus,
        idList: ids,
      }
      Resource.product
        .post({ type: 'update/publishStatus' }, { ...params })
        .then((response) => {
          if (response.code === 1) {
            this.$message({
              message: response.message,
              type: "success",
              duration: 1000,
            });
          }
          this.getList();
        })
        .catch((e) => {
          console.log('异常', e);
        })
        ;
    },
    // 获取列表
    getList() {
      this.listLoading = true;
      Resource.product
        .post({ type: 'list' }, { ...this.listQuery })
        .then((response) => {
          this.list = response.data.list;
          this.total = response.data.total || 0;
        })
        .catch((e) => {
          console.log('异常', e);
        })
        .finally(() => {
          this.listLoading = false;
        });
    },
    //  

    handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getList();
    },
    handleSelectionChange(val) {
      console.log(11111111111, val)
      this.multipleSelection = val;
    },
    // 删除
    handleDelete(index, row) {
      this.$confirm("是否要进行删除操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let ids = [];
        ids.push(row.id);
        this.updateDeleteStatus(1, ids);
      });
    },
    updateDeleteStatus(deleteStatus, ids) {
      let params = new URLSearchParams();
      params.append("ids", ids);
      params.append("deleteStatus", deleteStatus);
      updateDeleteStatus(params).then((response) => {
        this.$message({
          message: "删除成功",
          type: "success",
          duration: 1000,
        });
        this.getList();
      });
      this.getList();
    },

    // 查看
    handleShowProduct(index, row) {
      console.log('查看')
    },
    // 添加分类
    handleAddProduct() { },
    // 确认添加分类
    handleDialogConfirm() {

    }
  },
};
</script>
<style lang="scss" scoped>
.app-container {
  height: 100vh;
}
.ml15 {
  margin-left: 15px;
}
.add-tips {
  color: #666;
  font-size: 12px;
  position: relative;
  top: 8px;
}
.input-width {
  width: 210px;
}
</style>


