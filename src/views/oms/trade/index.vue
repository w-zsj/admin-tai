<template>
  <div class="wrap">
    <div class="mb">
      <el-row :gutter="20">
        <el-col :span="4" v-for="(item, idx) in recordList" :key="idx">
          <div class="grid-content flex-aic">
            <div class="icon flex-ctr" :class="item.class" :style="{ background: item.bg }">
              <svg-icon :icon-class="item.svg_icon" class="t_user_icon"></svg-icon>
            </div>
            <div class="count flex-col">
              <div>{{ item.count }}</div>
              <div class="txt">{{ item.desc }}</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <ve-line :data="chartData" :colors="colors" :tooltip="tooltip" :grid='grid' :resizeable="true" :legend-visible="true" :loading="loading" :data-empty="dataEmpty" :settings="chartSettings"></ve-line>
  </div>

</template>
<script>
import echarts from 'echarts';
const recordList = [
  {
    svg_icon: 't_user_icon',
    count: "1",
    unit: "",
    class: "user",
    desc: "订单金额",
    bg: '#5CE3D5'
  },
  {
    svg_icon: 't_distribution_icon',
    count: "33",
    unit: "",
    class: "distribution",
    desc: "交易订单",
    bg: '##EE592C'
  },
  {
    svg_icon: 't_order_icon',
    count: "33",
    unit: "",
    class: "order",
    desc: "退款金额",
    bg: '#BFAD1F'
  },
  {
    svg_icon: 't_record_icon',
    count: "3,333",
    unit: "",
    class: "record",
    desc: "配送配用",
    bg: '#2CBEDC'
  },
  {
    svg_icon: 't_user_icon',
    count: "1",
    unit: "",
    class: "user",
    desc: "毛利金额",
    bg: '#5CE4a5'
  },
]
export default {

  data() {
    return {
      recordList,
      chartSettings: {
        // xAxisType: 'time',
        area: true,
        axisSite: { right: ['salesAmount'] },
        yAxisName: ['销售瓶数', '销售额'],
        labelMap: { 'totalNum': '订单数量', 'salesAmount': '销售额', 'salesVolume': "销售瓶数" },
      },
      grid: {
        right: 20,
        btotom: 0
      },
      colors: [
        new echarts.graphic.LinearGradient(0, 0, 0, 1,
          [{
            offset: 0, color: 'rgba(176,214,221,1)'
          }, {
            offset: 1, color: 'rgba(176,214,221,0.5)'

          }]),
        new echarts.graphic.LinearGradient(0, 0, 0, 1,
          [{
            offset: 0, color: '#58D9D9'
          },
          {
            offset: 1, color: '#61AEE9'
          }]),
        new echarts.graphic.LinearGradient(0, 0, 0, 1,
          [{
            offset: 0, color: 'rgba(255,149,54,1)'
          },
          {
            offset: 1, color: 'rgba(255,149,54,0.5)'
          }])],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        },
        borderWidth: 1,
        height: 80,
        padding: 16,
        confine: true, // 是否限制在图表内

      },
      legend: {
        orient: 'horizontal',      // 布局方式，默认为水平布局，可选为：
        // 'horizontal' ¦ 'vertical'
        x: 'center',               // 水平安放位置，默认为全图居中，可选为：
        // 'center' ¦ 'left' ¦ 'right'
        // ¦ {number}（x坐标，单位px）
        y: 'top',                  // 垂直安放位置，默认为全图顶端，可选为：
        // 'top' ¦ 'bottom' ¦ 'center'
        // ¦ {number}（y坐标，单位px）
        backgroundColor: 'rgba(0,0,0,0)',
        borderColor: '#ccc',       // 图例边框颜色
        borderWidth: 0,            // 图例边框线宽，单位px，默认为0（无边框）
        padding: 5,                // 图例内边距，单位px，默认各方向内边距为5，
        // 接受数组分别设定上右下左边距，同css
        itemGap: 10,               // 各个item之间的间隔，单位px，默认为10，
        // 横向布局时为水平间隔，纵向布局时为纵向间隔
        itemWidth: 20,             // 图例图形宽度
        itemHeight: 14,            // 图例图形高度
        textStyle: {
          color: '#333'          // 图例文字颜色
        }
      },

      chartData: {
        columns: [],
        rows: []
      },
      loading: false,
      dataEmpty: false,
    }
  },
  mounted() {
    this.getChartList()
  },
  methods: {
    getChartList() {
      this.loading = true
      this.chartData = {
        columns: ['statisticsDate', 'totalNum', 'salesAmount', 'salesVolume'],
        rows: [
          {
            statisticsDate: '1月',
            totalNum: 11,
            salesAmount: 222,
            salesVolume: 4444
          },
          {
            statisticsDate: '2月',
            totalNum: 11,
            salesAmount: 333333333,
            salesVolume: 33333
          },
          {
            statisticsDate: '3月',
            totalNum: 12221,
            salesAmount: 555,
            salesVolume: 666666
          }
        ]
      };
    },

  }
}
</script>
<style lang="scss" scoped>
.wrap {
  font-size: 14px;
  color: #606266;
  padding: 40px;
  .grid-content {
    height: 80px;
    border: 1px solid #ccc;

    .t_user_icon {
      font-size: 32px;
    }

    .icon {
      width: 30%;
      height: 100%;
      background: #ea8f62;
    }

    .count {
      width: 70%;
      height: 100%;
      justify-content: center;
      align-items: center;
      font-size: 18px;
      font-weight: bold;

      .txt {
        font-size: 12px;
        font-weight: normal;
        padding-top: 10px;
      }
    }
  }

  .mb {
    margin-bottom: 20px;
  }
}
</style>