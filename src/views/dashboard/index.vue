<template>
  <div class="app-container">
    <!-- 商城用户数 -->
    <div class="mb">
      <el-row :gutter="20">
        <el-col :span="6" v-for="(item, idx) in recordList" :key="idx">
          <div class="grid-content flex-aic">
            <div class="icon flex-ctr" :class="item.class" :style="{ background: item.bg }">
              <svg-icon :icon-class="item.svg_icon" class="t_user_icon"></svg-icon>
            </div>
            <div class="count flex-col">
              <div>{{ idx ==recordList.length-1?item.unit:'' }}{{ item.count }}</div>
              <div class="txt">{{ item.desc }}</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 统计信息 -->
    <div class="mb statistics">
      <el-row :gutter="20">
        <el-col :span="6" v-for="(item, idx) in statistics" :key="idx">
          <el-card shadow="never">
            <div class="header">{{item.title}}</div>
            <div class="item flex-aic" v-for="(sub,subIdx) in item.list" :key='subIdx'>
              <span>未处理订单:</span>
              <span class="yell">10</span>&nbsp;&nbsp;个
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <!-- 购物产品比例 -->
    <div class="mb buy-progress">
      <el-card shadow="never">
        <div class="header">购物产品比例</div>
        <div class="list flex-aic">
          <div class="item">
            <el-progress type="circle" :percentage="25" :stroke-width='10' :width='100' :color='randomRgb()'>
            </el-progress>
            <div class="tit flex-ctr">蔬菜</div>
          </div>
          <div class="item">
            <el-progress type="circle" :percentage="25" :stroke-width='10' :width='100' :color='randomRgb()'>
            </el-progress>
            <div class="tit flex-ctr">蔬菜</div>
          </div>
        </div>

        <div class="enter flex-aic">
          <div class="flex-col list" :style="{ background: randomRgb() }" v-for="(item,idx) in otherMenuEnter" :key="idx">
            <div class="icon">
              <svg-icon :icon-class="item.icon" class="t_user_icon"></svg-icon>
            </div>
            <div class="title">{{item.title}}</div>
          </div>
        </div>
      </el-card>

    </div>
  </div>
</template>

<script>
import { recordList, statistics, otherMenuEnter } from "./config";
var reg = /(\d)(?=(?:\d{3})+$)/g; // 千位分割
export default {
  name: "Dashboard",
  data() {
    return {
      recordList,
      statistics,
      otherMenuEnter
    };
  },
  mounted() {
  },
  methods: {
    randomRgb() {
      let R = Math.floor(Math.random() * 255);
      let G = Math.floor(Math.random() * 255);
      let B = Math.floor(Math.random() * 255);
      return "rgb(" + R + "," + G + "," + B + ")";
    }

  },
};
</script>

<style src="./index.scss" lang="scss" scoped></style>
