<template>
   
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="商品名称：">
            <el-input class="input-width" v-model="listQuery.keyword" placeholder="商品名称"></el-input>
          </el-form-item>
          <el-form-item label="商品货号：">
            <el-input class="input-width" v-model="listQuery.productSn" placeholder="商品货号"></el-input>
          </el-form-item>
          <el-form-item label="商品类目：">
            <el-cascader class="input-width" clearable v-model="selectProductCateValue" :options="productCateOptions">
            </el-cascader>
          </el-form-item>
          <el-form-item label="状态：">
            <el-select class="input-width" v-model="listQuery.publishStatus" placeholder="全部" clearable>
              <el-option v-for="item in publishStatusOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
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
        <el-button @click="batchHandleProduct" size="mini"> 批量删除 </el-button>
      </span>
      <el-button class="btn-add ml15" @click="handleAddProduct" size="mini">
        添加商品
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="productTable" :data="list" style="width: 100%" @selection-change="handleSelectionChange"
        v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" width="60" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="商品图片" align="center">
          <template slot-scope="scope"><img style="width: 70px" :src="scope.row.pic" /></template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.name }}</p>
          </template>
        </el-table-column>
        <el-table-column label="价格/货号" align="center">
          <template slot-scope="scope">
            <p v-if="scope.row.price">价格：￥{{ scope.row.price }}</p>
            <p v-if="scope.row.productSn">货号：{{ scope.row.productSn }}</p>
          </template>
        </el-table-column>
        <el-table-column label="是否草稿" align="center" width="80">
          <template slot-scope="scope">
            {{ scope.row.publishStatus == 2 ? "是" : "否" }}
          </template>
        </el-table-column>
        <el-table-column label="标签" width="120" align="center">
          <template slot-scope="scope">
            上架：
            <el-switch :disabled="scope.row.publishStatus == 2"
              @change="handlePublishStatusChange(scope.$index, scope.row)" :active-value="1"
              :inactive-value="scope.row.publishStatus == 2 ? 2 : 0" v-model="scope.row.publishStatus">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="排序" width="60" align="center">
          <template slot-scope="scope">{{ scope.row.sort }}</template>
        </el-table-column>
        <el-table-column label="SKU库存" width="80" align="center">
          <template slot-scope="scope">
            {{ scope.row.sort }}
          </template>
        </el-table-column>
        <el-table-column label="销量" width="60" align="center">
          <template slot-scope="scope">{{ scope.row.sale }}</template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center">
          <template slot-scope="scope">
            <p>
              <el-button size="mini" @click="handleShowProduct(scope.$index, scope.row)">查看
              </el-button>
              <el-button size="mini" @click="handleUpdateProduct(scope.$index, scope.row)">编辑
              </el-button>
            </p>
            <p>
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除
              </el-button>
            </p>
          </template>
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
import { fetchList, updateDeleteStatus, updatePublishStatus } from "@/api/product";
import { fetchList as fetchSkuStockList } from "@/api/skuStock";
import { fetchList as fetchProductAttrList } from "@/api/productAttr";
import { fetchListWithChildren } from "@/api/productCate";

const defaultListQuery = {
  keyword: null,
  pageNum: 1,
  pageSize: 5,
  publishStatus: null,
  verifyStatus: null,
  productSn: null,
  productCategoryId: null,
  brandId: null,
};
export default {
  name: "product",
  data() {
    return {
      tableHeight: 0, // 表格高度
      editSkuInfo: {
        dialogVisible: false,
        productId: null,
        productSn: "",
        productAttributeCategoryId: null,
        stockList: [],
        productAttr: [],
        keyword: null,
      },
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      total: null,
      listLoading: true,
      selectProductCateValue: null,
      multipleSelection: [],
      productCateOptions: [],
      publishStatusOptions: [
        {
          value: 1,
          label: "上架",
        },
        {
          value: 0,
          label: "下架",
        },
        {
          value: 2,
          label: "草稿",
        },
      ],
      verifyStatusOptions: [
        {
          value: 1,
          label: "审核通过",
        },
        {
          value: 0,
          label: "未审核",
        },
      ],
      saleType: true,
    };
  },
  created() {
    this.getList();
    this.getProductCateList();
  },
  mounted() {
    this.$nextTick(() => {
      const h = document.body.clientHeight;
      this.tableHeight = h - 150;

      // 监听窗口大小变化
      /* let _this = this;
        window.onresize = function() {
          // 表格高度自适应
          const h = document.body.clientHeight;
          _this.tableHeight = h - 350;
        } */
    });
  },
  watch: {
    selectProductCateValue: function (newValue) {
      if (newValue != null && newValue.length == 2) {
        this.listQuery.productCategoryId = newValue[1];
      } else {
        this.listQuery.productCategoryId = null;
      }
    },
  },
  methods: {
    getProductSkuSp(row, index) {
      let spData = JSON.parse(row.spData);
      if (spData != null && index < spData.length) {
        return spData[index].value;
      } else {
        return null;
      }
    },
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery)
        .then((response) => {
          this.list = response.data.list;
          this.total = response.data.total;
        })
        .finally(() => {
          this.listLoading = false;
        });
    },
    getProductCateList() {
      fetchListWithChildren().then((response) => {
        let list = response.data;
        this.productCateOptions = [];
        for (let i = 0; i < list.length; i++) {
          let children = [];
          if (list[i].children != null && list[i].children.length > 0) {
            for (let j = 0; j < list[i].children.length; j++) {
              children.push({
                label: list[i].children[j].name,
                value: list[i].children[j].id,
              });
            }
          }
          this.productCateOptions.push({
            label: list[i].name,
            value: list[i].id,
            children: children,
          });
        }
      });
    },
    // 查询
    handleSearchList() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    // 重置
    handleResetSearch() {
      this.selectProductCateValue = [];
      this.listQuery = Object.assign({}, defaultListQuery);
    },
    // 添加商品
    handleAddProduct(type) {
      this.$router.push({ path: "/pms/addProduct" });
    },
    // 分页 修改pagesize
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
    // 选中列
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 上下架
    handlePublishStatusChange(index, row) {
      let id = [];
      id.push(row.id);
      this.updatePublishStatus(row.publishStatus, id);
    },
    updatePublishStatus(publishStatus, id) {
      let params = new URLSearchParams();
      params.append("id", id);
      params.append("publishStatus", publishStatus);
      updatePublishStatus(params)
        .then((response) => {
          this.$message({
            message: "修改成功",
            type: "success",
            duration: 1000,
          });
        })
        .finally(() => {
          this.getList();
        });
    },

    // 删除单列
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
    // 批量删除
    batchHandleProduct() {
      let ids = [];
      console.log("multipleSelection", this.multipleSelection);
      // 处理选中的商品id
      this.multipleSelection &&
        this.multipleSelection.map((item) => {
          ids.push(item.id);
        });
      if (this.multipleSelection.length < 1) {
        this.$message({
          message: "请选选中商品后再进行批量操作！",
          type: "error",
          duration: 1000,
        });
        return;
      }
      this.$confirm("是否要进行批量操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
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
    // 编辑
    handleUpdateProduct(index, row) {
      this.$router.push({
        path: "/pms/updateProduct",
        query: {
          id: row.id,
          type: "",
        },
      });
    },
    // 查看
    handleShowProduct(index, row) {
      this.$router.push({ path: "/pms/checkProduct", query: { id: row.id, type: "" } });
    },
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
