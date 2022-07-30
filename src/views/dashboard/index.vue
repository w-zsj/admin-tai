<template>
  <div class="app-container">
    <div class="dataUpdateTime">{{dataUpdateTime}} 更新</div>
    <div class="overview-layout">
      <el-row :gutter="20">
        <!-- 用户指标 -->
        <!-- <el-col :span="12">
          <unit :source="3" :userInfo="userInfo"></unit>
        </el-col> -->
        <!-- 会员人数 -->
        <!-- <el-col :span="12">
          <unit :source="4" :vipInfo="vipInfo"></unit>
        </el-col> -->
        <!-- 待处理订单 -->
        <el-col :span="12">
          <unit :source="1" :waitingPayOrderCount="waitingPayOrderCount"></unit>
        </el-col>
        <!-- 商品数据 -->
        <el-col :span="12">
          <unit :source="2" :productInfo="productInfo" :lowStockNumber="lowStockNumber"></unit>
        </el-col>
      </el-row>
    </div>
    <!-- <div class="statistics-layout">
      <div class="layout-title">订单统计</div>
      <el-row>
        <el-col :span="4">
          <unit :source="5" :orderInfo="orderInfo"></unit>
        </el-col>
        <el-col :span="20">
          <echarts></echarts>
        </el-col>
      </el-row>
    </div> -->
  </div>
</template>

<script>
import { homeApi } from '@/api/home.js'
import echarts from './comps/echarts.vue'
import unit from './comps/unit'
export default {
  name: 'Dashboard',
  components: { echarts, unit },
  data() {
    return {
      dataUpdateTime: "",// 更新日期
      userInfo: [],// 用户相关数据
      vipInfo: [],// vip 相关数据
      orderInfo: [],// 订单相关数据
      productInfo: [],// 商品相关数据
      waitingPayOrderCount: [],// 代付款订单。。。
      lowStockNumber: null,// 最下库存数
    }
  },
  created() {
    this.getInfo()
  },
  methods: {
    getInfo() {
      homeApi().then(res => {
        if (res.code == 1) {
          let info = res.data
          Object.assign(this, {
            dataUpdateTime: info.dataUpdateTime,
            lowStockNumber: info.lowStockNumber,
            userInfo: [
              {
                key: "openCount",
                item: info.openCount
              },
              {
                key: "loginCount",
                item: info.loginCount
              },
              {
                key: "registerCount",
                item: info.registerCount
              }
            ],
            vipInfo: [
              {
                key: "",
                item: [
                  { type: 1 }, { type: 3 }, { type: 4 }, { type: 5 }, { type: 6 }
                ]
              },
              {
                key: 'vipFirstFeeCount',
                item: info.vipFirstFeeCount
              },
              {
                key: "vipContinueFeeCount",
                item: info.vipContinueFeeCount
              },
              {
                key: 'vvipExchangeCount',
                item: info.vvipExchangeCount
              }
            ],
            productInfo: info.productCount,
            waitingPayOrderCount: info.waitingHandleOrderCount,
            orderInfo: [
              {
                key: 'orderCount',
                item: info.orderCount
              },
              {
                key: 'orderMoneyCount',
                item: info.orderMoneyCount
              },
              {
                key: 'orderNumberCount',
                item: info.orderNumberCount
              }
            ],
          })

        }

      })
    }
  }
}

</script>

<style src="./index.scss" lang="scss" scoped></style>
