<template> 
  <div class="detail-container">
    <el-card shadow="never" style="margin-top: 15px">
      <div class="operate-container" v-if="order.orderType !== 5">
        <i class="el-icon-warning color-danger" style="margin-left: 20px"></i>
        <span class="color-danger">当前订单状态：{{order.orderStatusName}}</span>
        <div class="operate-button-container">
          <!-- <el-button size="mini" @click="showUpdateReceiverDialog">修改收货人信息</el-button> -->
          <el-button size="mini" @click="showMarkOrderDialog">备注订单</el-button>
        </div>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">基本信息</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span='6' class="table-cell-title">订单编号</el-col>
          <el-col :span='6' class="table-cell-title">用户账号</el-col>
          <el-col :span='6' class="table-cell-title">支付方式</el-col>
          <el-col :span='6' class="table-cell-title">订单来源</el-col>

        </el-row>
        <el-row>
          <el-col :span='6' class="table-cell">{{order.orderSn}}</el-col>
          <el-col :span='6' class="table-cell">{{order.memberId}}</el-col>
          <el-col :span='6' class="table-cell">{{order.payType | formatPayType}}</el-col>
          <el-col :span='6' class="table-cell">{{order.sourceType | formatSourceType}}</el-col>

        </el-row>
        <el-row>
          <el-col :span='6' class="table-cell-title">订单类型</el-col>
          <el-col :span='6' class="table-cell-title">配送方式</el-col>
          <el-col :span='6' class="table-cell-title">物流单号</el-col>
          <el-col :span='6' class="table-cell-title">活动信息</el-col>
        </el-row>
        <el-row>
          <el-col :span='6' class="table-cell">{{order.orderType | orderTypeFilter}}</el-col>
          <el-col :span='6' class="table-cell">{{order.deliveryCompany | formatNull}}</el-col>
          <el-col :span='6' class="table-cell">{{order.deliverySn | formatNull}}</el-col>
          <el-col :span='6' class="table-cell">
            <el-popover placement="top-start" title="活动信息" width="200" trigger="hover" :content="order.promotionInfo">
              <span slot="reference">{{order.promotionInfo | formatLongText}}</span>
            </el-popover>
          </el-col>
        </el-row>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">收货人信息</span>
      </div>
      <el-table ref="receiverInfoTable" :data="[order]" style="width: 100%;margin-top: 20px" border>
        <el-table-column prop='receiverName' label="收货人" width="180" align="center"></el-table-column>
        <el-table-column prop='receiverPhone' label="手机号码" width="180" align="center"></el-table-column>
        <el-table-column prop='receiverPostCode' label="邮政编码" width="180" align="center"></el-table-column>
        <el-table-column label="收货地址" align="center">
          <template slot-scope="scope">
            {{scope.row | formatAddress}}
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">商品信息</span>
      </div>
      <el-table ref="orderItemTable" :data="order.orderItemList" style="width: 100%;margin-top: 20px" border>
        <el-table-column label="商品图片" width="120" align="center">
          <template slot-scope="scope">
            <img v-if='scope.row.productPic' :src="scope.row.productPic" style="height: 80px">
            <span v-else>暂无</span>
          </template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.productName}}</p>
            <p>品牌：{{scope.row.productBrand || '-'}}</p>
          </template>
        </el-table-column>
        <el-table-column label="价格/货号" width="120" align="center">
          <template slot-scope="scope" v-if="scope.row.type !== 2">
            <p>价格：{{scope.row.integration ? `${scope.row.integration}积分+` : ''}}￥{{scope.row.productPrice}}</p>
            <p>货号：{{scope.row.productSn || '-'}}</p>
          </template>
        </el-table-column>
        <el-table-column label="属性" width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.productAttr | formatProductAttr}}
          </template>
        </el-table-column>
        <el-table-column label="数量" width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.productQuantity}}
          </template>
        </el-table-column>
        <el-table-column label="小计" width="120" align="center">
          <template v-if="scope.row.type !==2" slot-scope="scope">
            {{scope.row.integration ? `${scope.row.integration}积分+` : ''}}
            ￥{{scope.row.type !== 1 ? (scope.row.productPrice*scope.row.productQuantity).toFixed(2) : 0}}
          </template>
        </el-table-column>
      </el-table>
      <div style="float: right;margin: 20px">
        合计：<span
          class="color-danger">{{order.useIntegration ? `${order.useIntegration}积分+` : ""}}￥{{order.totalAmount}}</span>
      </div>

      <!-- 物流信息 -->
      <div v-if="false">
        <div style="margin-top: 60px;margin-bottom:20px">
          <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
          <span class="font-small">物流信息</span>
        </div>
        <div style="display:flex; margin-bottom:20px">
          <el-select v-model="logis.productId" placeholder="订单商品" size="small" style="margin-right:10px">
            <el-option v-for="item in orderItemList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="logis.deliveryCompany" placeholder="请选择物流公司" size="small" style="margin-right:10px">
            <el-option v-for="item in companyOptions" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
          <el-input size="small" placeholder="物流单号" v-model="logis.deliverySn" style="width:215px"></el-input>
          <el-button type="primary" size="small">
            确定
          </el-button>
        </div>

      </div>

      <div style="margin-top: 60px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">费用信息</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="4" class="table-cell-title">商品合计</el-col>
          <el-col :span="4" class="table-cell-title">运费</el-col>
          <el-col :span="4" class="table-cell-title">金币抵扣</el-col>
          <el-col :span="4" class="table-cell-title">订单总金额</el-col>
          <el-col :span="4" class="table-cell-title">应付款金额</el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="table-cell">
            {{order.useIntegration ? `${order.useIntegration}积分+` : ""}}￥{{order.totalAmount}}</el-col>
          <el-col :span="4" class="table-cell">￥{{order.freightAmount}}</el-col>
          <el-col :span="4" class="table-cell">-￥{{order.coin || 0}}</el-col>
          <el-col :span="4" class="table-cell">
            <span class="color-danger">￥{{(order.totalAmount+order.freightAmount).toFixed(2)}}</span>
          </el-col>
          <el-col :span="6" class="table-cell">
            <span class="color-danger">￥{{order.payAmount}}</span>
          </el-col>
        </el-row>
        <el-row>

        </el-row>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">操作信息</span>
      </div>
      <el-table style="margin-top: 20px;width: 100%" ref="orderHistoryTable" :data="order.historyList" border>
        <el-table-column label="操作者" width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.operateMan}}
          </template>
        </el-table-column>
        <el-table-column label="操作时间" width="160" align="center">
          <template slot-scope="scope">
            {{formatTime(scope.row.createTime)}}
          </template>
        </el-table-column>
        <el-table-column label="订单状态" width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.orderStatus | formatStatus}}
          </template>
        </el-table-column>
        <el-table-column label="付款状态" width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.orderStatus | formatPayStatus}}
          </template>
        </el-table-column>
        <el-table-column label="发货状态" width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.orderStatus | formatDeliverStatus}}
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center">
          <template slot-scope="scope">
            {{scope.row.note}}
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="修改收货人信息" :visible.sync="receiverDialogVisible" width="40%">
      <el-form :model="receiverInfo" ref="receiverInfoForm" label-width="150px">
        <el-form-item label="收货人姓名：">
          <el-input v-model="receiverInfo.receiverName" class="dialog-input"></el-input>
        </el-form-item>
        <el-form-item label="手机号码：">
          <el-input v-model="receiverInfo.receiverPhone" class="dialog-input">
          </el-input>
        </el-form-item>
        <el-form-item label="邮政编码：">
          <el-input v-model="receiverInfo.receiverPostCode" class="dialog-input">
          </el-input>
        </el-form-item>
        <!-- <el-form-item label="所在区域：">
          <v-distpicker :province="receiverInfo.receiverProvince" :city="receiverInfo.receiverCity"
            :area="receiverInfo.receiverRegion" @selected="onSelectRegion"></v-distpicker>
        </el-form-item> -->
        <el-form-item label="详细地址：">
          <el-input v-model="receiverInfo.receiverDetailAddress" type="textarea" rows="3">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="receiverDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleUpdateReceiverInfo">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改费用信息" :visible.sync="moneyDialogVisible" width="40%">
      <div class="table-layout">
        <el-row>
          <el-col :span="6" class="table-cell-title">商品合计</el-col>
          <el-col :span="6" class="table-cell-title">运费</el-col>
          <el-col :span="6" class="table-cell-title">优惠券</el-col>
          <el-col :span="6" class="table-cell-title">积分抵扣</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell">￥{{order.totalAmount}}</el-col>
          <el-col :span="6" class="table-cell">
            <el-input v-model.number="moneyInfo.freightAmount" size="mini"><template slot="prepend">￥</template>
            </el-input>
          </el-col>
          <el-col :span="6" class="table-cell">-￥{{order.couponAmount}}</el-col>
          <el-col :span="6" class="table-cell">-￥{{order.integrationAmount}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell-title">活动优惠</el-col>
          <el-col :span="6" class="table-cell-title">折扣金额</el-col>
          <el-col :span="6" class="table-cell-title">订单总金额</el-col>
          <el-col :span="6" class="table-cell-title">应付款金额</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell">-￥{{order.promotionAmount}}</el-col>
          <el-col :span="6" class="table-cell">
            <el-input v-model.number="moneyInfo.discountAmount" size="mini"><template slot="prepend">-￥</template>
            </el-input>
          </el-col>
          <el-col :span="6" class="table-cell">
            <span class="color-danger">￥{{order.totalAmount+moneyInfo.freightAmount}}</span>
          </el-col>
          <el-col :span="6" class="table-cell">
            <span class="color-danger">￥{{order.payAmount+moneyInfo.freightAmount-moneyInfo.discountAmount}}</span>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="moneyDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleUpdateMoneyInfo">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="发送站内信" :visible.sync="messageDialogVisible" width="40%">
      <el-form :model="message" ref="receiverInfoForm" label-width="150px">
        <el-form-item label="标题：">
          <el-input v-model="message.title" class="dialog-input"></el-input>
        </el-form-item>
        <el-form-item label="内容：">
          <el-input v-model="message.content" type="textarea" rows="3">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="messageDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSendMessage">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="关闭订单" :visible.sync="closeDialogVisible" width="40%">
      <el-form :model="closeInfo" label-width="150px">
        <el-form-item label="操作备注：">
          <el-input v-model="closeInfo.note" type="textarea" rows="3">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleCloseOrder">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="备注订单" :visible.sync="markOrderDialogVisible" width="40%">
      <el-form :model="markInfo" label-width="150px">
        <el-form-item label="操作备注：">
          <el-input v-model="markInfo.note" type="textarea" rows="3">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="markOrderDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleMarkOrder">确 定</el-button>
      </span>
    </el-dialog>
    <!-- <logistics-dialog v-model="logisticsDialogVisible"></logistics-dialog> -->
  </div>
</template>
<script>
import {
  getOrderDetail,
  updateReceiverInfo,
  updateMoneyInfo,
  closeOrder,
  updateOrderNote,
  deleteOrder,
} from "@/api/order";
import { formatDate } from "@/utils/date";
import VDistpicker from "v-distpicker";
const defaultReceiverInfo = {
  orderId: null,
  receiverName: null,
  receiverPhone: null,
  receiverPostCode: null,
  receiverDetailAddress: null,
  receiverProvince: null,
  receiverCity: null,
  receiverRegion: null,
  status: null,
};
let that;
export default {
  name: "orderDetail",
  components: { VDistpicker },
  data() {
    that = this;
    return {
      id: null,
      order: {},
      receiverDialogVisible: false,
      receiverInfo: Object.assign({}, defaultReceiverInfo),
      moneyDialogVisible: false,
      moneyInfo: {
        orderId: null,
        freightAmount: 0,
        discountAmount: 0,
        status: null,
      },
      messageDialogVisible: false,
      message: { title: null, content: null },
      closeDialogVisible: false,
      closeInfo: { note: null, id: null },
      markOrderDialogVisible: false,
      markInfo: { note: null },
      teamStatusEnum: ['未成团', '已成团', '超时未成团,拼团失败', '活动结束', '未开团'],
      orderTypeEnum: ['正常订单', '秒杀订单', '团购订单', '积分商城订单'],
      companyOptions: ["顺丰快递", "圆通快递", "中通快递", "韵达快递", "申通快递"],
      statusOptions: ["待付款", "待发货", "已发货", "已完成", "已取消", "订单关闭"],
      orderItemList: [],// 订单商品
      logis: {
        productId: '',
        deliveryCompany: '',
        deliverySn: ''
      }
    };
  },
  created() {
    this.id = this.list = this.$route.query.id;
    getOrderDetail(this.id).then((response) => {
      this.order = response.data;
      this.orderItemList = response.data.orderItemList.map(i => {
        return {
          label: i.productName,
          value: i.productId,
          productPic: i.productPic
        }
      })
    });
  },
  filters: {
    formatNull(value) {
      if (value === undefined || value === null || value === "") {
        return "暂无";
      } else {
        return value;
      }
    },
    formatLongText(value) {
      if (value === undefined || value === null || value === "") {
        return "暂无";
      } else if (value.length > 8) {
        return value.substr(0, 8) + "...";
      } else {
        return value;
      }
    },
    formatPayType(value) {
      const payTypeOptions = ["未支付", "支付宝", "微信"];
      return [0, 1, 2].some(num => num === value) ? payTypeOptions[value] : '-';
    },
    formatSourceType(value) {
      return value === 1 ? "APP订单" : "PC订单";
    },
    formatAddress(order) {
      let str = order.receiverProvince;
      if (order.receiverCity != null) {
        str += "  " + order.receiverCity;
      }
      str += "  " + order.receiverRegion;
      str += "  " + order.receiverDetailAddress;
      return str;
    },
    formatStatus(value) {
      return that.statusOptions[value];
    },
    formatPayStatus(value) {
      return [0, 4].some(num => num === value) ? that.statusOptions[value] : "已支付";
    },
    formatDeliverStatus(value) {
      return [0, 1].some(num => num === value) ? "未发货" : "已发货";
    },
    formatProductAttr(value) {
      if (value == null) {
        return "";
      } else {
        let attr = JSON.parse(value);
        let result = "";
        for (let i = 0; i < attr.length; i++) {
          result += attr[i].key;
          result += ":";
          result += attr[i].value;
          result += ";";
        }
        return result;
      }
    },
    orderTypeFilter(type) {
      if ([4, 5].some(v => v === type)) {
        return "积分商城订单";
      } else if ([0, 1, 2].some(v => v === type)) {
        return that.orderTypeEnum[type];
      } else {
        return "-";
      }
    }
  },
  methods: {
    onSelectRegion(data) {
      this.receiverInfo.receiverProvince = data.province.value;
      this.receiverInfo.receiverCity = data.city.value;
      this.receiverInfo.receiverRegion = data.area.value;
    },
    formatTime(time) {
      if (time == null || time === "") {
        return "";
      }
      return formatDate(time, "yyyy-MM-dd hh:mm:ss");
    },
    formatStepStatus(value) {
      if (value === 1) {
        //待发货
        return 2;
      } else if (value === 2) {
        //已发货
        return 3;
      } else if (value === 3) {
        //已完成
        return 4;
      } else {
        //待付款、已关闭、无限订单
        return 1;
      }
    },
    showUpdateReceiverDialog() {
      this.receiverDialogVisible = true;
      this.receiverInfo = {
        orderId: this.order.id,
        receiverName: this.order.receiverName,
        receiverPhone: this.order.receiverPhone,
        receiverPostCode: this.order.receiverPostCode,
        receiverDetailAddress: this.order.receiverDetailAddress,
        receiverProvince: this.order.receiverProvince,
        receiverCity: this.order.receiverCity,
        receiverRegion: this.order.receiverRegion,
        status: this.order.status,
      };
    },
    handleUpdateReceiverInfo() {
      this.$confirm("是否要修改收货信息?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        updateReceiverInfo(this.receiverInfo).then((response) => {
          this.receiverDialogVisible = false;
          this.$message({
            type: "success",
            message: "修改成功!",
          });
          getOrderDetail(this.id).then((response) => {
            this.order = response.data;
          });
        });
      });
    },
    showUpdateMoneyDialog() {
      this.moneyDialogVisible = true;
      this.moneyInfo.orderId = this.order.id;
      this.moneyInfo.freightAmount = this.order.freightAmount;
      this.moneyInfo.discountAmount = this.order.discountAmount;
      this.moneyInfo.status = this.order.status;
    },
    handleUpdateMoneyInfo() {
      this.$confirm("是否要修改费用信息?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        updateMoneyInfo(this.moneyInfo).then((response) => {
          this.moneyDialogVisible = false;
          this.$message({
            type: "success",
            message: "修改成功!",
          });
          getOrderDetail(this.id).then((response) => {
            this.order = response.data;
          });
        });
      });
    },
    showMessageDialog() {
      this.messageDialogVisible = true;
      this.message.title = null;
      this.message.content = null;
    },
    handleSendMessage() {
      this.$confirm("是否要发送站内信?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.messageDialogVisible = false;
        this.$message({
          type: "success",
          message: "发送成功!",
        });
      });
    },
    showCloseOrderDialog() {
      this.closeDialogVisible = true;
      this.closeInfo.note = null;
      this.closeInfo.id = this.id;
    },
    handleCloseOrder() {
      this.$confirm("是否要关闭?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let params = new URLSearchParams();
        params.append("ids", [this.closeInfo.id]);
        params.append("note", this.closeInfo.note);
        closeOrder(params).then((response) => {
          this.closeDialogVisible = false;
          this.$message({
            type: "success",
            message: "订单关闭成功!",
          });
          getOrderDetail(this.id).then((response) => {
            this.order = response.data;
          });
        });
      });
    },
    showMarkOrderDialog() {
      this.markOrderDialogVisible = true;
      this.markInfo.id = this.id;
      this.closeOrder.note = null;
    },
    handleMarkOrder() {
      this.$confirm("是否要备注订单?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let params = new URLSearchParams();
        params.append("id", this.markInfo.id);
        params.append("note", this.markInfo.note);
        params.append("status", this.order.status);
        updateOrderNote(params).then((response) => {
          this.markOrderDialogVisible = false;
          this.$message({
            type: "success",
            message: "订单备注成功!",
          });
          getOrderDetail(this.id).then((response) => {
            this.order = response.data;
          });
        });
      });
    },
    handleDeleteOrder() {
      this.$confirm("是否要进行该删除操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let params = new URLSearchParams();
        params.append("ids", [this.id]);
        deleteOrder(params).then((response) => {
          this.$message({
            message: "删除成功！",
            type: "success",
            duration: 1000,
          });
          this.$router.back();
        });
      });
    },
  },
};
</script>
<style rel="stylesheet/scss" lang='scss' scoped>
.detail-container {
  width: 80%;
  padding: 20px 20px 20px 20px;
  margin: 20px auto;
}

.operate-container {
  background: #f2f6fc;
  height: 80px;
  margin: -20px -20px 0;
  line-height: 80px;
}

.operate-button-container {
  float: right;
  margin-right: 20px;
}

.table-layout {
  margin-top: 20px;
  border-left: 1px solid #dcdfe6;
  border-top: 1px solid #dcdfe6;
}

.table-cell {
  height: 60px;
  line-height: 40px;
  border-right: 1px solid #dcdfe6;
  border-bottom: 1px solid #dcdfe6;
  padding: 10px;
  font-size: 14px;
  color: #606266;
  text-align: center;
}

.table-cell-title {
  border-right: 1px solid #dcdfe6;
  border-bottom: 1px solid #dcdfe6;
  padding: 10px;
  background: #f2f6fc;
  text-align: center;
  font-size: 14px;
  color: #303133;
}
.dialog-input {
  width: 200px;
}
</style>


