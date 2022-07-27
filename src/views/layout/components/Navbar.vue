/*
 * @Author: zhangsanjun 
 * @Date: 2022-07-25 10:26:26 
 * @Last Modified by:   zhangsanjun 
 * @Last Modified time: 2022-07-25 10:26:26 
 */
<template>
  <el-menu class="navbar" mode="horizontal">
    <Hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></Hamburger>
    <Breadcrumb></Breadcrumb>
    <el-dropdown class="avatar-container" trigger="click">
      <div class="avatar-wrapper">
        <span class="user-name">Hi, {{name}}</span>
        <img class="user-avatar" :src="avatar" />
        <i class="el-icon-caret-bottom"></i>
      </div>
      <el-dropdown-menu class="user-dropdown" slot="dropdown">
        <router-link class="inlineBlock" to="/">
          <el-dropdown-item> 首页 </el-dropdown-item>
        </router-link>
        <router-link class="inlineBlock" to="/updatePassWord">
          <el-dropdown-item divided> 修改密码 </el-dropdown-item>
        </router-link>
        <el-dropdown-item divided>
          <span @click="logout" style="display: block">退出</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </el-menu>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "./Breadcrumb";
import Hamburger from "./Hamburger";
// import { Breadcrumb, Hamburger } from "@wx/layout";
export default {
  components: {
    Breadcrumb,
    Hamburger,
  },
  computed: {
    ...mapGetters(["sidebar", "avatar", "name"]),
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("ToggleSideBar");
    },
    logout() {
      this.$store.dispatch("LogOut").then(() => {
        location.reload(); // 为了重新实例化vue-router对象 避免bug
      });
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  display: flex;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar-container {
    height: 50px;
    margin-left: auto;
    padding-right: 35px;
    .avatar-wrapper {
      cursor: pointer;
      display: flex;
      align-items: center;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        font-size: 12px;
        margin-top: 28px;
        align-self: flex-start;
      }
      .user-name {
        padding-right: 8px;
      }
    }
  }
}
</style>

