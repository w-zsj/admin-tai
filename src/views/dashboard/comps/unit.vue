<template>
  <div>
    <template v-if="source!=5">
      <div class="out-border">
        <div class="layout-title">{{source |title}}</div>
        <!-- 用户指标 -->
        <div v-if="source==3 && userInfo && userInfo.length" class="user" style="padding: 40px">
          <el-row>
            <el-col :span="8" v-for="(data,idx) in userInfo" :key="idx">
              <div class="tit">{{data.key |userTitle}}</div>
              <div v-for="(sub,sunIdx) in data.item" :key="sunIdx">
                <div :class="sub.type==1?'color-danger big':'grow'">
                  {{sub.type==1?'': sub.type|userDiff}}
                  <!-- 总计开关 -->
                  <span v-if="sub.type==6" @click="checkAll('userSwich')">
                    <svg-icon :icon-class="userSwich?'openEye':'closrEye'" class="color-main"></svg-icon>
                  </span>
                  <!-- 总计时 开关打开才显示数据 -->
                  <span v-if="sub.type==6">
                    {{userSwich && (sub.value ||'0')|split}}
                  </span>
                  <span v-else>{{(sub.value||'0')|split}}</span>
                  <!-- 同比 icon -->
                  <span :class="sub.percent>0?'up':'down'" v-if="sub.percent">
                    <i :class="sub.percent>0?'el-icon-top':'el-icon-bottom'"></i>{{Math.abs(sub.percent)}}%
                  </span>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        <!-- 会员人数 -->
        <div v-else-if="source==4" style="padding: 40px 40px 0">
          <el-row>
            <el-col :span="idx==0?3:7" v-for="(data,idx) in vipInfo" :key="idx">
              <div class="tit">{{data.key|vipTitle}}</div>
              <div v-for="(sub,sunIdx) in data.item" :key="sunIdx">
                <div v-if="!data.key" class="tit _tit">
                  {{sub.type|userDiff}}
                  <span v-if="sub.type==6" @click="checkAll('vipSwiich')">
                    <svg-icon :icon-class="vipSwiich?'openEye':'closrEye'" class="color-main"></svg-icon>
                  </span>
                </div>
                <!-- 总计开关 -->
                <div class="color-danger" v-else>
                  <span v-if="sub.type==6">
                    {{vipSwiich && (sub.value ||'0')|split }}
                  </span>
                  <span v-else>{{(sub.value || '0')|split}}</span>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        <!-- 待处理订单 -->
        <div style="padding: 40px" v-else-if="source==1">
          <el-row>
            <el-col :span="6" class="color-danger big red overview-item-value" v-for="(item,idx) in waitingPayOrderCount" :key="idx">
              <span class="cur-point" @click="goto(item.type)">{{(item.value||'0')|split}}</span>
            </el-col>
          </el-row>
          <el-row class="font-medium">
            <el-col :span="6" class="overview-item-title" v-for="(item,idx) in waitingPayOrderCount" :key="idx">
              <span class="cur-point" @click="goto(item.type)"> {{item.type | orderType}}</span>
            </el-col>
          </el-row>
        </div>
        <!-- 商品数据 -->
        <div style="padding: 40px" v-else-if="source==2">
          <el-row>
            <el-col :span="6" class="color-danger big overview-item-value" v-for="(item,idx) in productInfo" :key="idx">{{(item.value||'0')|split}}</el-col>
          </el-row>
          <el-row class="font-medium">
            <el-col :span="6" class="overview-item-title" v-for="(item,idx) in productInfo" :key="idx">
              {{item.type|prodDiff}}
              <el-tooltip v-if="item.type==3" class="item" effect="dark" :content="'统计已上架商品;库存小于或等于'+lowStockNumber+'个'" placement="bottom-start">
                <span class="tip">?</span>
              </el-tooltip>
            </el-col>
          </el-row>
        </div>
      </div>
    </template>
    <template v-else-if="source==5">
      <!-- 订单统计 -->
      <div class="order-layout" style="padding: 20px 20px 0 20px;">
        <div v-for="(data,idx) in orderInfo" :key="idx" style="margin-bottom:20px;">
          <div style="color: #909399;font-size: 14px">{{data.key | orderTitle}}</div>
          <div v-for="(sub,sunIdx) in data.item" :key="sunIdx">
            <div :class="sub.type==1?'big':'small'">
              {{sub.type==1?'': sub.type|orderDiff}}
              <!-- 总计开关 -->
              <span v-if="sub.type==6" @click="checkSwich(idx)">
                <svg-icon :icon-class="orderSwich[idx]?'openEye':'closrEye'" class="color-main"></svg-icon>
              </span>
              <!-- 总计时 开关打开才显示数据 -->
              <span v-if="sub.type==6">
                {{orderSwich[idx] && (sub.value ||'0') | split }}
              </span>
              <span v-else>
                <span v-if="data.key=='orderMoneyCount'" style="font-size:12px;">￥</span>
                {{(sub.value||'0')|split}}
              </span>
              <!-- 同比 icon -->
              <span :class="sub.percent>0?'up':'down'" v-if="sub.percent">
                <i :class="sub.percent>0?'el-icon-top':'el-icon-bottom'"></i>{{Math.abs(sub.percent)}}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </template>

  </div>
</template>
<script>
import { addHomeAdminDataLog } from '@/api/home.js'
export default {
  props: {
    source: {
      type: Number,
      default: 0
    },
    userInfo: {
      type: Array,
      default: () => []
    },
    vipInfo: {
      type: Array,
      default: () => []
    },
    productInfo: {
      type: Array,
      default: () => []
    },
    lowStockNumber: {
      type: [Number, String],
      default: 5
    },
    waitingPayOrderCount: {
      type: Array,
      default: () => []
    },
    orderInfo: {
      default: () => []
    }
  },
  data() {
    return {
      userSwich: false,
      vipSwiich: false,
      orderSwich: []
    }
  },
  filters: {
    split(value) {
      if (value) {
        var money = (value.toString().indexOf('.') > -1) ?
          value.toString().replace(/(?!^)(?=(\d{3})+\.)/g, ',') :
          value.toString().replace(/(?!^)(?=(\d{3})+$)/g, ',')
        return money
      } else return ''
    },
    title(key) {
      switch (key) {
        case 1:
          return '待处理订单'
        case 2:
          return '商品数据'
        case 3:
          return '用户指标'
        case 4:
          return '会员人数'
        case 5:
          return ''
      }
    },
    userDiff(key) {
      switch (key) {
        case 1:
          return '今日'
        case 2:
          return '昨日'
        case 3:
          return '本周'
        case 4:
          return '本月'
        case 5:
          return '年度'
        case 6:
          return '总计'
      }
    },
    orderType(key) {
      switch (key) {
        case 1:
          return '待付款'
        case 2:
          return '待发货'
        case 3:
          return '待收货'
        case 4:
          return '待退款'
      }
    },
    prodDiff(key) {
      switch (key) {
        case 1:
          return '已上架'
        case 2:
          return '已下架'
        case 3:
          return '库存紧张'
        case 4:
          return '全部商品'
      }
    },
    userTitle(name) {
      switch (name) {
        case 'loginCount':
          return '登录用户数'
        case 'openCount':
          return '打开次数'
        case 'registerCount':
          return '新注册用户'
      }
    },
    vipTitle(name) {
      switch (name) {
        case 'vipFirstFeeCount':
          return 'VIP首充'
        case 'vipContinueFeeCount':
          return 'VIP续费'
        case 'vvipExchangeCount':
          return '尊享卡兑换'
      }
    },
    orderDiff(key) {
      switch (key) {
        case 1:
          return ''
        case 2:
          return '昨日'
        case 4:
          return '本月'
        case 6:
          return '总计'
      }
    },
    orderTitle(key) {
      switch (key) {
        case 'orderCount':
          return '今日订单数 / 单'
        case 'orderMoneyCount':
          return '今日销售额'
        case 'orderNumberCount':
          return '今日销售瓶数 / 瓶'
      }
    },
  },
  methods: {
    checkAll(name) {
      this[name] = !this[name]
      this[name] && addHomeAdminDataLog({ dataType: name == 'userSwich' ? 1 : 2 })
    },
    checkSwich(idx) {
      let orderSwich = JSON.parse(JSON.stringify(this.orderSwich))
      orderSwich[idx] = !orderSwich[idx]
      this.orderSwich = orderSwich
      orderSwich[idx] && addHomeAdminDataLog({ dataType: idx + 3 })
    },
    goto(status) {
      let path = `/oms/order?status=${status - 1}`
      if (status == 4) path = '/oms/returnApply'
      this.$router.push(path);
    }
  }
}
</script>
<style scoped lang="scss">
.out-border {
  border: 1px solid #dcdfe6;
  margin-bottom: 20px;
  .layout-title {
    color: #606266;
    padding: 15px 20px;
    background: #f2f6fc;
    font-weight: bold;
  }
  //   .color-main {
  //     width: 12px;
  //     height: 12px;
  //   }
  .color-danger {
    margin-bottom: 12px;
    line-height: 24px;
    height: 24px;
    color: rgb(25, 137, 250);
    &.big {
      font-size: 24px;
    }
    &.red {
      color: #f56c6c;
    }
  }
  .cur-point {
    cursor: pointer;
  }
  .tit {
    height: 24px;
    font-size: 16px;
    color: #606266;
    margin-bottom: 12px;
    line-height: 24px;
  }
  ._tit {
    font-size: 14px;
  }
  .grow {
    color: #606266;
    font-size: 12px;
    margin-bottom: 10px;
  }
  .up {
    color: #67c23a;
  }
  .down {
    color: #f56c6c;
  }
  .user {
    .color-danger {
      margin-bottom: 42px;
    }
  }
  .bottom {
    clear: both;
    text-align: center;
  }
  .tip {
    font-size: 12px;
    color: #606266;
    border-radius: 50%;
    border: 1px solid #606266;
    width: 14px;
    height: 14px;
    display: inline-block;
    line-height: 14px;
    text-align: center;
  }
}
.order-layout {
  .layout-title {
    color: #606266;
    padding: 15px 20px;
    background: #f2f6fc;
    font-weight: bold;
  }
  .big {
    color: #1989fa;
    font-size: 24px;
    padding: 10px 0;
  }
  .small {
    color: #c0c4cc;
    font-size: 12px;
    margin-bottom: 10px;
  }
  .up {
    color: #67c23a;
  }
  .down {
    color: #f56c6c;
    font-size: 12px;
  }
}
</style>