<template>
  <div style="padding: 10px 30px 20px 10px;border-left:1px solid #DCDFE6">
    <el-cascader :options="productCateOptions" clearable placeholder="请选择商品类别" size="small" align="right"
      :props="{ checkStrictly: true }" @change="changeProduct">
    </el-cascader>
    <el-date-picker style="float: right;z-index: 1;width:360px;margin-right:20px;" size="small" v-model="orderCountDate"
      type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
      value-format="yyyy-MM-dd" @change="handleDateChange" :picker-options="pickerOptions">
    </el-date-picker>
    <div>
      <ve-line :data="chartData" :colors="colors" :tooltip="tooltip" :grid='grid' :resizeable="true"
        :legend-visible="false" :loading="loading" :data-empty="dataEmpty" :settings="chartSettings"></ve-line>
    </div>
  </div>
</template>
<script>
// import Moment from 'moment'
// import { str2Date } from '@/utils/date';
import { fetchListWithChildren } from '@/api/productCate';
import { statisticsOrder } from '@/api/home.js';
import echarts from 'echarts';
// const DATA_FROM_BACKEND = {
//   columns: ['statisticsDate', 'totalNum', 'salesAmount', 'salesVolume'],
//   rows: []
// };
export default {

  data() {
    return {
      productCateOptions: [],
      categoryId: 0,

      pickerOptions: {
        disabledDate(time) {
          // 禁用以后的时间
          return time.getTime() > Date.now() - 3600 * 1000 * 24;
        },
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            let start = new Date(), end = new Date();
            start = start.setDate(start.getDate() - 7);
            start = new Date(start);
            end = end.setDate(end.getDate() - 1);
            end = new Date(end);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一月',
          onClick(picker) {
            let start = new Date(), end = new Date();
            start = start.setDate(start.getDate() - 31);
            start = new Date(start);
            end = end.setDate(end.getDate() - 1);
            end = new Date(end);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      orderCountDate: '',
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
        formatter: function(params) {
          let html = `<div style="margin-bottom:10px;">${params[0].value[0].split(' ')[0]}</div>`,
            color = {
              0: 'rgba(176,214,221,1),rgba(176,214,221,0.5)',
              1: "#58D9D9,#61AEE9",
              2: 'rgba(255,149,54,1),rgba(255,149,54,0.5)'
            }
          for (let i in params) {
            let unit = i == 1 ? '元' : i == 2 ? '瓶' : '件',
              icon = `<span style=\"display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background:linear-gradient(${color[i]});\"></span>`,
              item = params[i],
              money = (item.value[1].toString().indexOf('.') > -1) ? item.value[1].toString().replace(/(?!^)(?=(\d{3})+\.)/g, ',') :
                item.value[1].toString().replace(/(?!^)(?=\.)(?=(\d{3})+$)/g, ',')

            html += `${icon}&nbsp;&nbsp;` + params[i].seriesName + `&nbsp;:&nbsp;&nbsp;` + `${money}&nbsp;${unit}` + `<br/>`
          }
          return `${html}`
        },
        confine: true, // 是否限制在图表内

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
    this.getProductCateList()
    this.initOrderCountDate()
  },
  methods: {
    //   获取分类商品
    getProductCateList() {
      fetchListWithChildren()
        .then((response) => {
          let list = response.data
          this.productCateOptions = [];
          for (let i = 0; i < list.length; i++) {
            let children = [];
            if (list[i].children != null && list[i].children.length > 0) {
              for (let j = 0; j < list[i].children.length; j++) {
                children.push({ label: list[i].children[j].name, value: list[i].children[j].id });
              }
            }
            this.productCateOptions.push({ label: list[i].name, value: list[i].id, children: children });
          }
        })
        .catch((e) => {
          console.log('异常', e);
        });
    },
    // 选择商品分类
    changeProduct(ids) {
      if (this.orderCountDate === null) {
        this.$message({
          message: '请先选择日期',
          type: 'error',
          duration: 1000
        });
      }
      if (ids) this.categoryId = [...ids].pop()
      this.getChartList()
    },
    // 选择日期
    handleDateChange(dataArr) {
      this.orderCountDate = dataArr
      this.getChartList()
    },
    initOrderCountDate() {
      this.orderCountDate = [this.getDay(-7), this.getDay(-1)];
      this.getChartList()
    },
    getChartList() {
      const [startDate, endDate] = this.orderCountDate;
      let obj = {
        categoryId: this.categoryId || 0,
        startDate: startDate + ' 00:00:00',
        endDate: endDate + ' 00:00:00'
      }
      this.loading = true
      statisticsOrder(obj)
        .then((response) => {
          // DATA_FROM_BACKEND.rows = response.data;
          this.chartData = {
            columns: ['statisticsDate', 'totalNum', 'salesAmount', 'salesVolume'],
            rows: response.data.reverse()
          };
          // delete this.chartSettings.area
          // const dateArr = [];
          // DATA_FROM_BACKEND.rows.forEach(item => {
          //   dateArr.push(item.statisticsDate);
          // })
          // let start = new Date(dateArr.length > 1 ? dateArr.pop() : dateArr[0]);
          // let end = new Date(dateArr.length > 1 ? dateArr.shift() : dateArr[0]);
          // for (let i = 0; i < DATA_FROM_BACKEND.rows.length; i++) {
          //   let item = DATA_FROM_BACKEND.rows[i];

          //   let currDate = new Date(item.statisticsDate);
          //   let startDay = start.getDate(),
          //     endDay = end.getDate(),
          //     currDateStr = currDate.getDate();
          //   // console.log('currDate', currDateStr, startDay, endDay)
          //   if (currDate.getTime() >= start.getTime() && currDate.getTime() <= end.getTime()) {
          //     this.chartData.rows.push(item);
          //   } else if (currDateStr === startDay && currDateStr === endDay) {
          //     // 判断只勾选一天的情况下
          //     this.chartData.rows.push(item);
          //   }
          // }
          this.dataEmpty = false;
        })
        .catch((e) => {
          console.log('异常', e);
        }).finally(() => this.loading = false)
    },
    getDay(day) {
      var today = new Date();
      var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
      today.setTime(targetday_milliseconds);
      var tYear = today.getFullYear();
      var tMonth = today.getMonth();
      var tDate = today.getDate();
      tMonth = this.doHandleMonth(tMonth + 1);
      tDate = this.doHandleMonth(tDate);
      return tYear + "-" + tMonth + "-" + tDate;
    },
    doHandleMonth(month) {
      var m = month;
      if (month.toString().length == 1) {
        m = "0" + month;
      }
      return m;
    }
  }
}
</script>
<style scoped>
.icon_0 {
  display: inline-block;
  width: 12px;
  height: 12px;
  background: rgba(176, 214, 221, 1);
}
.icon_1 {
  display: inline-block;
  width: 12px;
  height: 12px;
  background: rgba(176, 214, 221, 1);
}
.icon_2 {
  display: inline-block;
  width: 12px;
  height: 12px;
  background: rgba(176, 214, 221, 1);
}
</style>