<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="订单编号：">
            <el-input class="input-width" v-model="listQuery.orderSn" placeholder="订单编号"></el-input>
          </el-form-item>
          <el-form-item label="商品名称：">
            <el-input class="input-width" v-model="listQuery.productName" placeholder="商品货号"></el-input>
          </el-form-item>
          <el-form-item label="下单日期：">
            <el-date-picker v-model="listQuery.timeRange" type="daterange" align="right" size="small" unlink-panels
              range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"
              style="width: 100%">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="客户名称：">
            <el-input class="input-width" v-model="listQuery.receiverKeyword" placeholder="商品名称"></el-input>
          </el-form-item>
          <el-form-item label="买家昵称：">
            <el-input class="input-width" v-model="listQuery.nickName" placeholder="商品名称"></el-input>
          </el-form-item>
          <el-form-item label="SKU编码：">
            <el-input class="input-width" v-model="listQuery.skuCode" placeholder="商品名称"></el-input>
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

    <div class="table-container">
      <DataGrid groupField="orderSn" :pagination="false" :data="list" :editable="true" class="scrollbar">
        <!-- <GridColumn field="orderSn" title="订单编号"></GridColumn> -->
        <GridColumn field="productName" title="订单商品 (单价/数量)" :width="360">
          <template slot="body" slot-scope="scope">
            <div class="orderProductItem" v-for="(item, index) in scope.row.omsOrderItemDtoList" :key="index">
              <div class="orderProductItemLeft">
                <div class="orderProductItemLeftImage">
                  <img v-if="item.productPic" :src="item.productPic" alt="" />
                  <div v-else>暂无图片</div>
                </div>
                <p class="ellipsis" style="">{{ item.productName }}</p>
              </div>
              <div class="orderProductItemRight">
                <div>
                  <template v-if="item.realAmount">￥{{ item.realAmount }}</template>
                </div>
                <div>x{{ item.productQuantity }}</div>
              </div>
            </div>
          </template>
        </GridColumn>
        <GridColumn field="orderStatusName" title="订单状态">
          <template slot="body" slot-scope="scope">
            <div class="deliverySn">{{ scope.row.orderStatusName }}</div>
          </template>
        </GridColumn>
        <GridColumn field="nickname" title="买家昵称">
          <template slot="body" slot-scope="scope">
            <div class="deliverySn">{{ scope.row.nickname }}</div>
          </template>
        </GridColumn>
        <GridColumn field="payAmount" title="金额(￥)">
          <template slot="body" slot-scope="scope">
            <div class="deliverySn">实付: {{ scope.row.payAmount }}</div>
            <div class="deliverySn">
              订单:
              {{ scope.row.useIntegration ? `${scope.row.useIntegration}积分+` : "" }}￥{{
                scope.row.totalAmount
              }}
            </div>
            <div class="deliverySn">运费: {{ scope.row.freightAmount }}</div>
          </template>
        </GridColumn>

        <GridColumn field="" title="操作" :width="110">
          <template slot="body" slot-scope="scope">
            <p>
              <el-button size="mini" @click="handleViewOrder(scope.$index, scope.row)">查看订单</el-button>
            </p>
            <p v-if="scope.row.status == 1">
              <el-button size="mini" @click="audit(scope.row)">审核订单</el-button>
            </p>
            <p v-if="scope.row.status == 3">
              <el-button size="mini" @click="printOrder(scope.row)" v-show="scope.row.canDelivery">打印订单</el-button>
            </p>
          </template>
        </GridColumn>
        <template slot="group" slot-scope="scope">
          <span
            style="marginright: 8px">订单编号：{{ scope.value }}</span><span>下单时间：{{ scope.rows[0].createTime | formatCreateTime }}</span>
        </template>
      </DataGrid>
      <div v-if="!list || !list.length" style="
          text-align: center;
          line-height: 200px;
          color: #606266;
          border: 1px solid #dcdfe6;
          border-top: 0;
        ">
        暂无数据~
      </div>
    </div>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper" :current-page.sync="listQuery.pageNum"
        :page-size="listQuery.pageSize" :page-sizes="[5, 10, 15]" :total="total">
      </el-pagination>
    </div>

    <el-dialog title="充值审核" :visible.sync="audit.dialogVisible" width="30%">
      <div style="margin-bottom: 20px">
        <span style="vertical-align: top">审核状态：</span>
        <el-radio-group v-model="audit.status">
          <el-radio :label="1">审核通过</el-radio>
          <el-radio :label="0">审核不通过</el-radio>
        </el-radio-group>
      </div>
      <span style="vertical-align: top">操作备注：</span>
      <el-input style="width: 80%" type="textarea" :rows="5" placeholder="请输入内容" v-model="audit.note">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="audit.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAuditOrderConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  fetchList,
  closeOrder,
  deleteOrder,
  orderApprove,
  editPrice,
  downloadOrderSnDetail,
  printOrder,
} from "@/api/order";
import { formatDate } from "@/utils/date";
import { download } from "@/utils/index";
const defaultListQuery = {
  pageNum: 1,
  pageSize: 5,
  orderSn: null,
  receiverKeyword: null,
  status: null,
  orderType: null,
  sourceType: null,
  startCreateTime: null,
  endCreateTime: null,
  nickName: null,
  productName: null,
  skuCode: null,
};
let that;
export default {
  name: "order",
  data() {
    that = this;
    return {
      tableHeight: 0, // 表格高度
      listQuery: Object.assign({}, defaultListQuery),
      listLoading: true,
      list: null,
      total: null,
      operateType: null,
      multipleSelection: [],
      closeOrder: {
        dialogVisible: false,
        content: null,
        orderIds: [],
      },
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
      activeName: "all",
      currentOrderSn: "",
      logisticsDialogVisible: false,
      priceDialog: false, //修改价格
      gridData: [], // 修改价格
      modifiedPrice: "",
      iscountPrice: "", //折扣价
      payAmount: "", //真实价
      timeRange: [],
      audit: {
        // 审核订单
        dialogVisible: false,
        status: 1,
        note: "",
        id: "",
        orderSn: '',
      },
    };
  },
  computed: {},
  created() {
    let status = this.$route.query.status;
    if (status) {
      this.listQuery = {
        ...this.listQuery,
        status: status,
      };
      let item = this.statusOptions.find((i) => i.value == status);
      this.activeName = item.name;
    }
    this.getList();
  },
  mounted() {
    this.$nextTick(() => {
      const h = document.body.clientHeight;
      this.tableHeight = h - 100;

      // 监听窗口大小变化
      let _this = this;
      window.onresize = function () {
        // 表格高度自适应
        const h = document.body.clientHeight;
        _this.tableHeight = h - 100;
      };
    });
  },
  filters: {
    tofix(val) {
      if (val > 0) return val.toFixed(2);
      else return val;
    },
    formatCreateTime(time) {
      return formatDate(time, "yyyy-MM-dd hh:mm:ss");
    },
  },
  methods: {
    FormCallBack(searchParms) {
      this.listQuery = {
        ...defaultListQuery,
        ...searchParms,
        status: "",
      };
      this.activeName = "all";
      if (searchParms.timeRange) {
        [
          this.listQuery.startCreateTime,
          this.listQuery.endCreateTime,
        ] = searchParms.timeRange;
      }

      this.handleSearchList();
    },
    handleTimeChange(val) {
      [this.listQuery.startCreateTime, this.listQuery.endCreateTime] = val || [];
    },
    // 根据状态查询
    selectStatus() {
      this.listQuery["status"] = this.statusOptions.find(
        (i) => i.name == this.activeName
      ).value;
      this.handleSearchList();
    },
    // 导出订单列表
    downloadOrder() {
      const time = formatDate(new Date(), "yyyy年MM月dd日hh时mm分ss秒");
      const fileName = `订单列表(${time}).xlsx`;
      const { status } = this.listQuery;
      let params = {
        ...defaultListQuery,
        ...this.$refs.Form.ruleForm,
        status,
      };
      if (this.$refs.Form.ruleForm.timeRange) {
        [
          params.startCreateTime,
          params.endCreateTime,
        ] = this.$refs.Form.ruleForm.timeRange;
      }
      delete params.pageNum;
      delete params.pageSize;
      delete params.timeRange;
      download(downloadOrderSnDetail, params, fileName);
    },
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery);
      this.timeRange = [];
    },
    handleSearchList() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleViewOrder(index, row) {
      this.$router.push({ path: "/oms/orderDetail", query: { id: row.id } });
    },
    handleCloseOrder(index, row) {
      this.closeOrder.dialogVisible = true;
      this.closeOrder.orderIds = [row.id];
    },
    handleDeliveryOrder(index, row) {
      let listItem = this.covertOrder(row);
      this.$router.push({
        path: "/oms/deliverOrderList",
        query: { list: [listItem] },
      });
    },
    handleViewLogistics(index, row) {
      this.logisticsDialogVisible = true;
      this.currentOrderSn = row.orderSn;
    },
    CancelDitPrice() {
      this.priceDialog = false;
      this.modifiedPrice = "";
      this.iscountPrice = ""; //折扣价
    },
    confDitPrice() {
      if (!this.modifiedPrice) {
        this.$message({
          message: "请填写价格",
          type: "warning",
          duration: 1000,
        });
      } else
        editPrice({
          price: this.modifiedPrice,
          ordersn: this.currentOrderSn,
        }).then((res) => {
          this.priceDialog = false;
          this.modifiedPrice = "";
          this.iscountPrice = ""; //折扣价
          this.getList();
        });
    },
    modifiedPriceChange(e) {
      if (isNaN(e) || e < 0) {
        this.$message({
          message: "请输入数字",
          type: "warning",
          duration: 1000,
        });
        this.modifiedPrice = 0;
        this.iscountPrice = 100;
        return;
      } else this.iscountPrice = ((this.modifiedPrice / this.payAmount) * 10).toFixed(2);
    },
    iscountPriceChange(e) {
      if (isNaN(e) || e < 0) {
        this.$message({
          message: "请输入数字",
          type: "warning",
          duration: 1000,
        });
        this.iscountPrice = "";
        this.modifiedPrice = "";
        return;
      }
      if (e >= 10) {
        this.iscountPrice = 100;
        this.modifiedPrice = 0;
      } else this.modifiedPrice = ((this.iscountPrice / 10) * this.payAmount).toFixed(2);
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
    // 审核
    audit({ id, orderSn }) {
      this.audit.dialogVisible = true;
      this.audit.id = id;
      this.audit.orderSn = orderSn;
    },
    handleAuditOrderConfirm() {
      let { status, note, id, orderSn } = this.audit;
      orderApprove({ status, note, id, orderSn }).then((res) => {
        if (res.code == 1) {
          this.audit.dialogVisible = false;
          this.getList();
        }
      });
    },
    // 打印订单
    printOrder(row) {
      printOrder({ id: row.id }).then(res => {
        if (res.code == 1)
          this.$message({
            message: "打印成功",
            type: "success",
            duration: 1000,
          });
      })
    },
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then((response) => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
      });
    },
    deleteOrder(ids) {
      this.$confirm("是否要进行该删除操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let params = new URLSearchParams();
        params.append("ids", ids);
        deleteOrder(params).then((response) => {
          this.$message({
            message: "删除成功！",
            type: "success",
            duration: 1000,
          });
          this.getList();
        });
      });
    },
    covertOrder(order) {
      let address =
        order.receiverProvince +
        order.receiverCity +
        order.receiverRegion +
        order.receiverDetailAddress;
      let listItem = {
        orderId: order.id,
        orderSn: order.orderSn,
        receiverName: order.receiverName,
        receiverPhone: order.receiverPhone,
        receiverPostCode: order.receiverPostCode,
        address: address,
        deliveryCompany: order.deliveryCompany,
        deliverySn: order.deliverySn,
        status: order.status,
      };
      return listItem;
    },
  },
};
</script>
<style lang="scss" scoped>
.panel-body {
  /deep/ .datagrid-htable,
  /deep/.datagrid-btable,
  /deep/.datagrid-ftable {
    color: #606266 !important;
  }
}
/deep/ .datagrid-body::-webkit-scrollbar {
  width: 0 !important;
}
.datagrid-body {
  overflow: -moz-scrollbars-none;
}
.datagrid-body {
  -ms-overflow-style: none;
}
.app-container {
  height: calc(100vh - 50px);
}
.input-width {
  width: 203px;
}
.orderProductItem {
  display: flex;
  justify-content: flex-start;
  .orderProductItemLeft {
    display: flex;
    .orderProductItemLeftImage {
      width: 60px;
      height: 60px;
      line-height: 60px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    p {
      margin: 0;
      width: 150px;
      text-align: left;
      margin-left: 8px;
      word-break: break-all; /*支持IE，chrome，FF不支持*/
      word-wrap: break-word; /*支持IE，chrome，FF*/
      white-space: pre-wrap;
    }
  }
  .orderProductItemRight {
    text-align: right;
    margin-left: auto;
  }
}
.orderProductItem:not(:last-child) {
  margin-bottom: 8px;
}
.deliverySn {
  white-space: pre-wrap;
  word-break: break-all; /*支持IE，chrome，FF不支持*/
  word-wrap: break-word; /*支持IE，chrome，FF*/
  padding: 5px 0;
}
.table-container {
  margin: 0;
}
.batch-operate-container {
  margin-bottom: 20px;
}
.gray {
  color: #969696;
  font-size: 12px;
}
.red {
  color: #f56c6c;
  font-weight: bold;
}
</style>
<style>
.tabmodal .el-table__row:not(:first-child) {
  display: none;
}
</style>
