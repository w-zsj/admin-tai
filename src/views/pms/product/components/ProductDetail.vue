<template>
  <el-card class="form-container" shadow="never">
    <el-form :model="productParam" :rules="rules" ref="productForm" label-width="120px" style="width:100%" size="small">
      <el-form-item label="商品分类：" prop="productClassifyIds">
        <el-cascader :props="productClassifyProps" :disabled='isCheck' v-model="selectProductClassifyValue"
          :options="productClassifyOptions">
        </el-cascader>
      </el-form-item>
      <el-form-item label="商品名称：" prop="name">
        <el-input :disabled='isCheck' v-model="productParam.name"></el-input>
      </el-form-item>
      <el-form-item v-if="saleType" label="商品货号：" prop="productSn">
        <el-input :disabled='isCheck' v-model="productParam.productSn"></el-input>
      </el-form-item>
      <el-form-item v-if="saleType" label="市场价：" prop="originalPrice">
        <el-input :disabled='isCheck' v-model="productParam.originalPrice"></el-input>
      </el-form-item>
      <!-- <el-form-item v-if="saleType" label="专家评分：" prop="score">
        <el-input-number :disabled='isCheck' v-model="productParam.score" controls-position="right" :min="0" :max="100"
          @change="validateInputScore"></el-input-number>
      </el-form-item> -->
      <!-- <el-form-item label="新品状态：" v-if="showNewStatus && saleType">
        <el-radio-group :disabled='isCheck' v-model="productParam.newStatus"
          @change="(v)  => handleChangeProductStatus(v,'new')">
          <el-radio :label="1">新品</el-radio>
          <el-radio :label="0">不是新品</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="推荐状态：" v-if="showRecommandStatus && saleType">
        <el-radio-group :disabled='isCheck' v-model="productParam.recommandStatus"
          @change="(v) => handleChangeProductStatus(v,'recommand')">
          <el-radio :label="1">推荐</el-radio>
          <el-radio :label="0">不推荐</el-radio>
        </el-radio-group>
      </el-form-item> -->
      <el-form-item label="商品类目：" prop="productCategoryId">
        <el-cascader :disabled='isCheck' :props="{checkStrictly:true}" v-model="selectProductCateValue"
          :options="productCateOptions" @change="handleProductAttrChange">
        </el-cascader>
      </el-form-item>
      <!-- <el-form-item label="属性类型：" prop="productAttributeCategoryId">
        <el-select :disabled='isCheck' v-model="productParam.productAttributeCategoryId" placeholder="请选择属性类型"
          @change="handleProductAttrChange">
          <el-option v-for="item in productAttributeCategoryOptions" :key="item.value" :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item> -->
      <!-- <el-form-item v-if="saleType" label="运费模板：" prop="feightTemplateId">
        <el-select :disabled='isCheck' v-model="productParam.feightTemplateId" placeholder="请选择运费模板"
          @change="handlefeightTemplateChange">
          <el-option v-for="item in feightTemplateOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item v-if="saleType" label="排序">
        <el-input :disabled='isCheck' v-model="productParam.sort"></el-input>
      </el-form-item>

      <el-form-item label="商品规格：">
        <el-card shadow="never" class="cardBg">
          <div v-for="(productAttr,idx) in selectProductAttr" :key="idx">
            {{productAttr.name}}：
            <el-checkbox-group :disabled='isCheck' v-if="productAttr.handAddStatus===0"
              v-model="selectProductAttr[idx].values" @change="skuChange">
              <el-checkbox v-for="(item,pIdx) in getInputListArr(productAttr.inputList)" :label="item" :key="pIdx"
                class="littleMarginLeft"></el-checkbox>
            </el-checkbox-group>
            <div v-else>
              <el-checkbox-group :disabled='isCheck' v-model="selectProductAttr[idx].values" @change="skuChange">
                <div v-for="(item,index) in selectProductAttr[idx].options" :key="index" style="display: inline-block"
                  class="littleMarginLeft">
                  <el-checkbox :label="item" :key="item"></el-checkbox>
                  <el-button :disabled='isCheck' type="text" class="littleMarginLeft"
                    @click="handleRemoveProductAttrValue(idx,index)">删除
                  </el-button>
                </div>
              </el-checkbox-group>
              <el-input :disabled='isCheck' v-model="addProductAttrValue" style="width: 160px;margin-left: 10px"
                clearable></el-input>
              <el-button :disabled='isCheck' class="littleMarginLeft" @click="handleAddProductAttrValue(idx)">增加
              </el-button>
            </div>
          </div>
        </el-card>
        <el-table style="width: 100%;margin-top: 20px" :data="skuStockList" border>
          <el-table-column v-for="(item,index) in selectProductAttr" :label="item.name" :key="item.id" align="center">
            <template slot-scope="scope" width="100">
              {{getProductSkuSp(scope.row,index,item,selectProductAttr)}}
            </template>
          </el-table-column>
          <el-table-column :label="saleType ? '销售价格（必填）' : '销售价格'" align="center">
            <template slot-scope="scope">
              <el-input :disabled='isCheck' v-model="scope.row.price"></el-input>
            </template>
          </el-table-column>
          <!-- <el-table-column v-if="saleType" label="VIP会员价格（必填）" width="80" align="center">
            <template slot-scope="scope">
              <el-input :disabled='isCheck' v-model="scope.row.vipPrice"></el-input>
            </template>
          </el-table-column>
          <el-table-column v-if="saleType" label="至尊会员价格（必填）" width="80" align="center">
            <template slot-scope="scope">
              <el-input :disabled='isCheck' v-model="scope.row.vvipPrice"></el-input>
            </template>
          </el-table-column> -->
          <!-- <el-table-column label="促销价格" width="80" align="center">
            <template slot-scope="scope">
              <el-input :disabled='isCheck' v-model="scope.row.promotionPrice"></el-input>
            </template>
          </el-table-column> -->
          <el-table-column label="商品库存（必填）" align="center">
            <template slot-scope="scope">
              <el-input :disabled='isCheck' v-model="scope.row.stock"></el-input>
            </template>
          </el-table-column>
          <!-- <el-table-column label="库存预警值（必填）" width="80" align="center">
            <template slot-scope="scope">
              <el-input :disabled='isCheck' v-model="scope.row.lowStock"></el-input>
            </template>
          </el-table-column> -->
          <el-table-column label="SKU编号" align="center">
            <template slot-scope="scope">
              <el-input :disabled='isCheck' v-model="scope.row.skuCode"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="60" align="center">
            <template slot-scope="scope">
              <el-button type="text" :disabled='isCheck' @click="handleRemoveProductSku(scope.$index, scope.row)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- <el-button :disabled='isCheck' type="primary" style="margin-top: 20px" @click="handleRefreshProductSkuList">更新列表
        </el-button> -->
        <el-button :disabled='isCheck' type="primary" style="margin-top: 20px" @click="handleSyncProductSkuPrice">同步价格
        </el-button>
        <!-- <el-button :disabled='isCheck' type="primary" style="margin-top: 20px" @click="handleSyncProductSkuPromotionPrice">同步促销价格
        </el-button> -->
        <el-button :disabled='isCheck' type="primary" style="margin-top: 20px" @click="handleSyncProductSkuStock">同步库存
        </el-button>
      </el-form-item>
      <el-form-item label="属性图片：" v-if="hasAttrPic">
        <el-card shadow="never" class="cardBg">
          <div v-for="(item,index) in selectProductAttrPics" :key="index">
            <span>{{item.name}}:</span>
            <el-image v-if='isCheck && item.pic.length' style="width: 100px; height: 100px; margin-right: 10px;"
              :src="item.pic[0]" :preview-src-list="selectProductAttrPics.map(v=>v.pic).reduce((a,b)=>[...a,...b],[])"
              fit="fill"></el-image>
            <span v-else-if="isCheck && !item.pic.length">暂无图片...</span>
            <multi-upload v-else :isSingle='true' v-model="item.pic" :maxSize='5' :tipText="tipText1"></multi-upload>
          </div>
        </el-card>
      </el-form-item>
      <el-form-item label="商品参数：">
        <el-card shadow="never" class="cardBg">
          <div v-for="(item,index) in productParam.selectProductParam" :class="{littleMarginTop:index!==0}"
            :key="index">
            <div class="paramInputLabel">{{item.name}}:</div>
            <!-- <el-select :disabled='isCheck' v-if="item.inputType===1" class="paramInput" v-model="selectProductParam[index].value"> -->
            <el-select :disabled='isCheck' v-if="item.inputType===1" class="paramInput" v-model="item.value">
              <el-option v-for="item in getParamInputList(item.inputList)" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
            <!-- <el-checkbox-group v-else-if="item.inputType===2" :disabled='isCheck' v-model="selectProductParam[index].value" style="display:inline-block"> -->
            <el-checkbox-group v-else-if="item.inputType===2" :disabled='isCheck' v-model="item.value"
              style="display:inline-block">
              <el-checkbox v-for="aitem in getParamInputList(item.inputList)" :label="aitem" :key="aitem"></el-checkbox>
            </el-checkbox-group>
            <el-form-item v-else :prop="'selectProductParam.' + index + '.value'" :rules="[
              {validator: unitInputRules, trigger: 'blur' },
              { required: false, message: '该项为必填项', trigger: 'blur' }
            ]">
              <!-- <el-input :disabled='isCheck' class="paramInput" v-model="selectProductParam[index].value"></el-input> -->
              <el-input :disabled='isCheck' class="paramInput" v-model="item.value" auto-complete="off"></el-input>
            </el-form-item>
          </div>
        </el-card>
      </el-form-item>
      <el-form-item>
        <span slot="label"><span style="color: red;padding-right: 3px;">*</span>商品相册：</span>
        <div v-if='isCheck && albumPics.length'>
          <el-image v-for='item in albumPics' :key='item' style="width: 100px; height: 100px; margin-right: 10px;"
            :src="item" :preview-src-list="albumPics" fit="fill"></el-image>
        </div>
        <span v-else-if="isCheck && !albumPics.length">暂无图片...</span>
        <multi-upload v-else v-model="albumPics" :maxCount='9' :maxSize='5' :tipText="tipText2"></multi-upload>
      </el-form-item>
      <el-form-item v-if="saleType" label="视频上传：">
        <div class='upload-tip'>视频时长小于等于60s，建议上传分辨率720dpi以上视频</div>
        <video-upload v-model="productParam.video" :is-check="isCheck"></video-upload>
      </el-form-item>
      <el-form-item label="商品详情：">
        <div style="padding-top:40px">
          <div class='productDetail' v-if='isCheck' v-html='productParam.detailMobileHtml' />
          <tinymce v-else :width="595" :height="300" v-model="productParam.detailMobileHtml"></tinymce>
        </div>
      </el-form-item>

      <el-form-item style="text-align: center;margin-top:40px" v-if="!isCheck">
        <el-button size="medium" @click="save" v-if='(!isEdit && saleType) || draft==2'>暂存</el-button>
        <el-button type="primary" size="medium" @click="handleNext('productForm')" v-if='!isCheck'>提交</el-button>
      </el-form-item>
    </el-form>

  </el-card>
</template>
<script>
import { createProduct, getProduct, updateProduct } from '@/api/product';
import { fetchListWithChildren } from '@/api/productCate';
import { fetchListWithChildren as fetchClassifyListWithChildren } from '@/api/productClassify'
import {
  fetchList as fetchProductAttrCateList,
  feightTemplateList as fetchFeightTemplateList,
} from "@/api/productAttrCate";
import { fetchList as fetchProductAttrList } from "@/api/productAttr";
import MultiUpload from "@/components/Upload/multiUpload";
import VideoUpload from "@/components/Upload/videoUpload";
import Tinymce from "@/components/Tinymce";
import { policy } from '@/api/oss'

const results = [],
  result = [],
  defaultProductParam = {
    recommandStatus: 0, newStatus: 0, score: undefined, sort: 0, detailMobileHtml: '', detailHtml: '', selectProductParam: [], video: '',
  }
export default {
  name: 'ProductDetail',
  components: { MultiUpload, VideoUpload, Tinymce },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    isCheck: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    //是否有商品属性图片
    hasAttrPic() {
      if (this.selectProductAttrPics.length < 1) {
        return false;
      }
      return true;
    },
    //商品的编号
    productId() {
      return this.productParam.id;
    },
  },
  watch: {
    productId: function (newValue) {
      if (!this.isEdit && !this.isCheck) return;
      if (this.hasEditCreated) return;
      if (newValue === undefined || newValue == null || newValue === 0) return;
      this.handleEditCreated();
    },
    'skuStockList'(newValue) {
      const pics = JSON.parse(JSON.stringify(this.selectProductAttrPics));
      this.selectProductAttrPics = newValue.map((v, i) => {
        const spData = JSON.parse(v.spData) || [];
        const name = spData.map(e => e.value).join(' ');
        let oldPics;
        pics.forEach(e => {
          if (e.name === name) {
            oldPics = e.pic;
          }
        })
        return {
          name,
          pic: oldPics ? oldPics : (v.pic ? [v.pic] : []),
        }
      })
    },
    selectProductCateValue: function (newValue) {
      if (newValue != null && newValue.length) {
        this.productParam.productCategoryId = newValue[newValue.length - 1];
        this.productParam.productCategoryName = this.getCateNameById(this.productParam.productCategoryId);
      } else {
        this.productParam.productCategoryId = null;
        this.productParam.productCategoryName = null;
      }
    },
    selectProductClassifyValue: function (newValue) {
      if (newValue != null && newValue.length >= 1) {
        let classifyIds = [];
        newValue.map(item => { // 遍历出商品分类id
          classifyIds.push(item[1])
        })
        this.productParam.productClassifyIds = classifyIds;
        this.productParam.productClassifyName = this.getClassifyNameById(this.productParam.productClassifyIds);
      } else {
        this.productParam.productClassifyIds = null;
        this.productParam.productClassifyName = null;
      }
    }
  },
  data() {
    const checkUnitInput = (rule, value, callback) => {
      if (value && value.length > 30) {
        callback(new Error('请输入1-30位中英文、数字或符号'));
      } else {
        callback();
      }
    };
    const priceInput = (rule, value, callback) => {
      const reg1 = /^((0{1}\.\d{1,2})|([1-9]\d{0,5}\.{1}\d{1})|([1-9]\d{0,4}\.{1}\d{2})|([0-9]{0,7}))$/; // 正数的正则表达式(不包括0，小数保留两位)
      if (value && !reg1.test(value)) {
        callback(new Error('请输入1-7位数字,最多保留两位小数'));
      } else {
        callback();
      }
    };
    // 自定义校验商品分类ID是否为空
    const validateClassify = (rule, value, callback) => {
      if (!this.selectProductClassifyValue.length) {
        callback(new Error('请选择商品分类'))
      } else {
        callback()
      }
    }
    return {
      tipText1: '请上传5M以内1:1比例jpg/png文件',
      tipText2: '请至少上传一张5M以内图片',
      tipText3: '视频时长小于等于60s，建议上传分辨率720dpi以上视频',
      productClassifyProps: {
        multiple: true, // 商品分类多选属性设置
        // checkStrictly: true
      },
      productParam: Object.assign({}, defaultProductParam),
      //选中商品类目的值
      selectProductCateValue: [],
      //选中商品分类的值
      selectProductClassifyValue: [],
      productCateOptions: [],
      productClassifyOptions: [],
      //商品属性分类下拉选项
      productAttributeCategoryOptions: [],
      // feightTemplateOptions: [], // 模板
      //选中的商品属性
      selectProductAttr: [],
      //选中的商品参数
      selectProductParam: [],
      //选中的商品属性图片
      selectProductAttrPics: [],
      //可手动添加的商品属性
      addProductAttrValue: "",
      skuStockList: [],
      albumPics: [],
      showNewStatus: true, // 是否新品默认值
      showRecommandStatus: true, // 是否推荐默认值
      saleType: true,

      rules: {
        productClassifyIds: [{ type: 'array', required: true, validator: validateClassify }],
        name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          { min: 1, max: 30, message: '请输入1-30位中英文、数字或符号', trigger: 'blur' }
        ],
        // score: [{ required: true, message: '请输入专家评分', trigger: 'blur' }],
        // feightTemplateId: [{ required: true, message: '请选择运费模板', trigger: 'blur' }],
        productCategoryId: [{ required: true, message: '请选择属性类型', trigger: 'blur' }],
        productSn: [
          { required: true, message: "请填写商品货号", trigger: 'blur' },
          { min: 1, max: 30, message: '请输入1-30位英文、数字', trigger: 'blur' }],
        originalPrice: [
          { required: false, message: '请填写', trigger: 'blur' },
          { validator: priceInput, trigger: 'blur' }
        ],
      },
      unitInputRules: checkUnitInput,
      draft: 0 // 是否市草稿
    }
  },
  created() {
    if (this.isEdit || this.isCheck) {
      this.productParam = {}
      getProduct({ id: this.$route.query.id }).then(response => {
        if (response.data && response.data.originalPrice) {
          response.data.originalPrice = response.data.originalPrice + '';
        }
        this.productParam = response.data
        // this.productParam.activeHtmlName = "mobile"
        this.skuStockList = response && response.data && response.data.skuStockList || []
        this.selectProductCateValue = [response.data.cateParentId, response.data.productCategoryId]
        this.selectProductClassifyValue = response.data.cateParentIdList || [];
        this.albumPics = response.data.albumPics && response.data.albumPics.split(",") || []
        if (response.data.pic) this.albumPics.unshift(response.data.pic)
        this.draft = response.data.publishStatus || 0
      });
    }
    this.getProductCateList() // 获取类目
    this.getProductClassifyList() // 获取商品分类
    // this.getFeightTemplateList()
    // this.getProductAttrCateList()
    this.getType()
  },
  methods: {
    getType() {
      const { type } = this.$route.query;
      if (type === 'NotForSale') {
        this.saleType = false;
      }
    },
    handleEditCreated() {
      //根据商品属性分类id获取属性和参数
      if (this.productParam.productAttributeCategoryId != null) {
        this.getProductAttrList(0, this.productParam.productAttributeCategoryId);
        this.getProductAttrList(1, this.productParam.productAttributeCategoryId);
      }
      this.hasEditCreated = true;
    },
    // 新品和推荐互斥处理
    handleChangeProductStatus(status, type) {
      switch (type) {
        case 'new':
          if (status === 1) {
            this.showRecommandStatus = false;
            this.showNewStatus = true;
            this.productParam.recommandStatus = 0
            this.productParam.newStatus = 1
          } else {
            this.showRecommandStatus = true;
            this.showNewStatus = true;
          }
          return;
        case 'recommand':
          if (status === 1) {
            this.showRecommandStatus = true;
            this.showNewStatus = false;
            this.productParam.newStatus = 0
            this.productParam.recommandStatus = 1
          } else {
            this.showRecommandStatus = true;
            this.showNewStatus = true;
          }
          return;
      }
    },
    validateInputScore() {
      // 限制正整数输入
      let reg = /^[0-9]+$/
      if (!reg.test(this.productParam.score)) {
        this.$message.warning("只能输入整数")
        // 用以在dom渲染挂载后重新触发dom渲染挂载
        this.$nextTick(() => {
          this.productParam.score = parseInt(this.productParam.score)
        })
      }
    },
    getCateNameById(id) {
      let name = null;
      for (let i = 0; i < this.productCateOptions.length; i++) {
        if (this.productCateOptions[i].value == id) {
          name = this.productCateOptions[i].label;
          return name;
        } else
          for (let j = 0; j < this.productCateOptions[i].children.length; j++) {
            if (this.productCateOptions[i].children[j].value === id) {
              name = this.productCateOptions[i].children[j].label;
              return name;
            }
          }
      }
      return name;
    },
    getClassifyNameById(id) {
      let name = [];
      for (let i = 0; i < this.productClassifyOptions.length; i++) {
        for (let j = 0; j < this.productClassifyOptions[i].children.length; j++) {
          id.map(item => {
            if (this.productClassifyOptions[i].children[j].value === item) {
              name.push(this.productClassifyOptions[i].children[j].label)
              // name = this.productClassifyOptions[i].children[j].label;
              // return name;
            }
          })
        }
      }
      return name;
    },
    //商品规格变动
    skuChange(newValue) {
      this.refreshProductSkuList();
    },
    // 商品类目
    getProductCateList() {
      fetchListWithChildren().then(response => {
        let list = response.data;
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
      });
    },
    // 商品分类
    getProductClassifyList() {
      fetchClassifyListWithChildren().then(response => {
        let list = response.data;
        this.productClassifyOptions = [];
        for (let i = 0; i < list.length; i++) {
          let children = [];
          if (list[i].children != null && list[i].children.length > 0) {
            for (let j = 0; j < list[i].children.length; j++) {
              children.push({ label: list[i].children[j].name, value: list[i].children[j].id });
            }
          }
          this.productClassifyOptions.push({ label: list[i].name, value: list[i].id, children: children });
        }
      });
    },
    // 获取模板
    // getFeightTemplateList() {
    //   fetchFeightTemplateList().then((res) => {
    //     this.feightTemplateOptions = [];
    //     const list = res.data;
    //     list &&
    //       list.length &&
    //       list.forEach((item) => {
    //         item.label = item.name;
    //         item.value = item.id;
    //         this.feightTemplateOptions.push(item);
    //       });
    //   });
    // },
    // 商品属性
    getProductAttrCateList() {
      let param = { pageNum: 1, pageSize: 100 };
      fetchProductAttrCateList(param).then((response) => {
        this.productAttributeCategoryOptions = [];
        let list = response.data.list;
        for (let i = 0; i < list.length; i++) {
          this.productAttributeCategoryOptions.push({
            label: list[i].name,
            value: list[i].id,
          });
        }
      });
    },
    handleProductAttrChange(value) {
      value = value[value.length - 1]
      this.skuStockList = [];
      console.log('selectProductCateValue', this.selectProductCateValue)
      this.getProductAttrList(0, value);
      this.getProductAttrList(1, value);
    },
    handlefeightTemplateChange(value) {
      console.log("value::", value);
      console.log("===", this.productParam.feightTemplateId);
    },
    getProductAttrList(type, cid) {
      let param = { pageNum: 1, pageSize: 100, type: type };
      fetchProductAttrList(cid, param).then((response) => {
        let list = response.data.list;
        if (type === 0) {
          this.selectProductAttr = [];
          for (let i = 0; i < list.length; i++) {
            let options = [];
            let values = [];
            if (this.isEdit || this.isCheck) {
              if (list[i].handAddStatus === 1) {
                //编辑状态下获取手动添加编辑属性
                options = this.getEditAttrOptions(list[i].id);
              }
              //编辑状态下获取选中属性
              values = this.getEditAttrValues(i, list[i].name);
            }
            this.selectProductAttr.push({
              id: list[i].id,
              name: list[i].name,
              handAddStatus: list[i].handAddStatus,
              inputList: list[i].inputList,
              values: values,
              options: options,
            });
          }
          if (this.isEdit || this.isCheck) {
            //编辑模式下刷新商品属性图片
            // this.refreshProductAttrPics();
          }
        } else {
          const paramArr = [];
          for (let i = 0; i < list.length; i++) {
            let value = null;
            if (this.isEdit || this.isCheck) {
              //编辑模式下获取参数属性
              value = this.getEditParamValue(list[i].id);
            }

            paramArr.push({
              id: list[i].id,
              name: list[i].name,
              value: list[i].inputType == 2 ? value ? value.split(',') : [] : value,
              inputType: list[i].inputType,
              inputList: list[i].inputList,
            });
            this.$set(this.productParam, 'selectProductParam', paramArr)
          }
        }
      });
    },
    //获取设置的可手动添加属性值
    getEditAttrOptions(id) {
      let options = [];
      for (let i = 0; i < this.productParam.productAttributeValueList.length; i++) {
        let attrValue = this.productParam.productAttributeValueList[i];
        if (attrValue.productAttributeId === id) {
          let strArr = attrValue.value.split(",");
          for (let j = 0; j < strArr.length; j++) {
            options.push(strArr[j]);
          }
          break;
        }
      }
      return options;
    },
    //获取选中的属性值
    getEditAttrValues(index, name) {
      let values = new Set();
      // const newInputArr = inputArr || [];
      for (let i = 0; i < this.skuStockList.length; i++) {
        let sku = this.skuStockList[i];
        let spData = JSON.parse(sku.spData);
        if (spData != null && spData.length > 0) {
          spData.forEach(v => {
            if (v.key == name) {
              values.add(v.value);
            }
          })
        }
      }
      // if (index === 0) {
      //   for (let i = 0; i < this.skuStockList.length; i++) {
      //     let sku = this.skuStockList[i];
      //     let spData = JSON.parse(sku.spData);
      //     if (spData != null && spData.length >= 1) {
      //       values.add(spData[0].value);
      //     } 
      //   }
      // } else if (index === 1) {
      //   for (let i = 0; i < this.skuStockList.length; i++) {
      //     let sku = this.skuStockList[i];
      //     let spData = JSON.parse(sku.spData);
      //     if (spData != null && spData.length >= 2) {
      //       values.add(spData[1].value);
      //     }
      //   }
      // } else {
      //   for (let i = 0; i < this.skuStockList.length; i++) {
      //     let sku = this.skuStockList[i];
      //     let spData = JSON.parse(sku.spData);
      //     if (spData != null && spData.length >= 3) {
      //       values.add(spData[2].value);
      //     }
      //   }
      // }
      return Array.from(values);
    },
    //获取属性的值
    getEditParamValue(id) {
      for (let i = 0; i < this.productParam.productAttributeValueList.length; i++) {
        if (+id === this.productParam.productAttributeValueList[i].productAttributeId) {
          return this.productParam.productAttributeValueList[i].value;
        }
      }
    },
    getInputListArr(inputList) {
      if (typeof inputList == 'string') {
        return inputList.split(",");
      } else {
        return inputList;
      }

    },
    getParamInputList(inputList) {
      if (typeof inputList == 'string') {
        return inputList.split(",");
      } else {
        return inputList;
      }
    },
    handleAddProductAttrValue(idx) {
      let options = this.selectProductAttr[idx].options;
      if (this.addProductAttrValue == null || this.addProductAttrValue == "") {
        this.$message({
          message: "属性值不能为空",
          type: "warning",
          duration: 1000,
        });
        return;
      }
      if (options.indexOf(this.addProductAttrValue) !== -1) {
        this.$message({
          message: "属性值不能重复",
          type: "warning",
          duration: 1000,
        });
        return;
      }
      this.selectProductAttr[idx].options.push(this.addProductAttrValue);
      this.addProductAttrValue = null;
    },
    handleRemoveProductAttrValue(idx, index) {
      this.selectProductAttr[idx].options.splice(index, 1);
    },
    getProductSkuSp(row, index, item, selectProductAttr) {
      let spData = JSON.parse(row.spData);
      // if (spData != null && index < spData.length) {
      //   return spData[index].value;
      // } else {
      //   return null;
      // }
      if (spData != null && spData.length > 0) {
        const obj = spData.find(v => v.key == item.name) || {};
        return obj.value;
      } else {
        return null;
      }
    },
    handleRefreshProductSkuList() {
      this.$confirm("刷新列表将导致sku信息重新生成，是否要刷新", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        // this.refreshProductAttrPics();
        this.refreshProductSkuList();
      });
    },
    // 同步价格
    handleSyncProductSkuPrice() {
      this.$confirm("将同步第一个sku的价格到所有sku,是否继续", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        if (
          this.skuStockList !== null &&
          this.skuStockList.length > 0
        ) {
          let price = this.skuStockList[0].price;
          let vipPrice = this.skuStockList[0].vipPrice;
          let vvipPrice = this.skuStockList[0].vvipPrice;
          for (let i = 1; i < this.skuStockList.length; i++) {
            this.$set(this.skuStockList[i], 'price', price);
            this.$set(this.skuStockList[i], 'vipPrice', vipPrice);
            this.$set(this.skuStockList[i], 'vvipPrice', vvipPrice);
          }
        }
      });
    },
    // 同步促销价格
    // handleSyncProductSkuPromotionPrice() {
    //   this.$confirm("将同步第一个sku的促销价格到所有sku,是否继续", "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning",
    //   }).then(() => {
    //     if (
    //       this.skuStockList !== null &&
    //       this.skuStockList.length > 0
    //     ) {
    //       let promotionPrice = this.skuStockList[0].promotionPrice;
    //       for (let i = 1; i < this.skuStockList.length; i++) {
    //         this.$set(this.skuStockList[i], 'promotionPrice', promotionPrice);
    //       }
    //     }
    //   });
    // },
    handleSyncProductSkuStock() {
      this.$confirm("将同步第一个sku的库存到所有sku,是否继续", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        if (
          this.skuStockList !== null &&
          this.skuStockList.length > 0
        ) {
          let stock = this.skuStockList[0].stock;
          let lowStock = this.skuStockList[0].lowStock;
          for (let i = 1; i < this.skuStockList.length; i++) {
            this.$set(this.skuStockList[i], 'stock', stock);
            this.$set(this.skuStockList[i], 'lowStock', lowStock)
          }
        }
      });
    },
    refreshProductSkuList() {
      // 判断是否已选中规格
      const flag = this.selectProductAttr.some(v => v.values && v.values.length > 0);
      if (!flag) {
        this.$message.error('请选择商品规格！');
        return;
      }

      // 获取当前选中规格所有的排列组合结果
      results.splice(0, results.length);
      result.splice(0, result.length);
      const tempAttrNewList = this.doExchange(this.selectProductAttr, 0);
      // 如果当前sku没有内容
      if (!this.skuStockList.length) {
        this.skuStockList = [];
        tempAttrNewList.forEach(v => {
          this.skuStockList.push({ spData: JSON.stringify(v) });
        })
        return;
      }
      // 如果当前sku列表有内容，将现有内容与排列组合结果做对比
      const sslist = JSON.parse(JSON.stringify(this.skuStockList));
      sslist.forEach(e => {
        const arr = eval('(' + e.spData + ')');
        // 判断列表中内容arr在排列组合结果tempAttrNewList中是否已消失，如果已消失，则将这个结果从列表中删除
        const flag = tempAttrNewList.some(v => {
          return arr.every(ele => {
            let obj = v.find(element => element.key === ele.key) || {};
            return obj.value === ele.value;
          })
        })
        if (!flag) {
          const i = this.skuStockList.findIndex((value) => {
            const array = eval('(' + value.spData + ')');
            return array.every(ele => {
              let obj = arr.find(element => element.key === ele.key) || {};
              return obj.value === ele.value;
            })
          })
          this.skuStockList.splice(i, 1);
        }
      })
      tempAttrNewList.forEach(v => {
        // 判断排列组合结果在列表中是否已存在，如果不存在，则将这个结果放进列表
        const flag = sslist.some(e => {
          const arr = eval('(' + e.spData + ')');
          // 比较v和arr是否相同
          return v.every(ele => {
            let obj = arr.find(element => element.key === ele.key) || {};
            return obj.value === ele.value;
          })
        });
        if (!flag) {
          this.skuStockList.push({ spData: JSON.stringify(v) });
        }
      })
    },
    doExchange(arr, index) {
      for (var i = 0; i < arr[index].values.length; i++) {
        result[index] = { key: arr[index].name, value: arr[index].values[i] };
        if (index != arr.length - 1) {
          this.doExchange(arr, index + 1)
        } else {
          results.push(JSON.parse(JSON.stringify(result)));
        }
      }
      return results;
    },

    //合并商品属性
    mergeProductAttrValue() {
      this.productParam.productAttributeValueList = [];
      for (let i = 0; i < this.selectProductAttr.length; i++) {
        let attr = this.selectProductAttr[i];
        if (
          attr.handAddStatus === 1 &&
          attr.options != null &&
          attr.options.length > 0
        ) {
          this.productParam.productAttributeValueList.push({
            productAttributeId: attr.id,
            value: this.getOptionStr(attr.options),
          });
        }
      }
      if (this.productParam.selectProductParam) {
        for (let i = 0; i < this.productParam.selectProductParam.length; i++) {
          let param = this.productParam.selectProductParam[i];
          if (param.value instanceof Array) param.value = param.value.join(',')
          this.productParam.productAttributeValueList.push({
            productAttributeId: param.id,
            value: param.value,
          });
        }
      }
    },
    //合并商品属性图片
    mergeProductAttrPics() {
      for (let i = 0; i < this.selectProductAttrPics.length; i++) {
        for (let j = 0; j < this.skuStockList.length; j++) {
          let spData = JSON.parse(this.skuStockList[j].spData);
          const str = spData.map(v => v.value).join(' ');
          if (str === this.selectProductAttrPics[i].name) {
            this.skuStockList[j].pic = this.selectProductAttrPics[i].pic[0];
          }
        }
      }
    },
    getOptionStr(arr) {
      let str = "";
      for (let i = 0; i < arr.length; i++) {
        str += arr[i];
        if (i != arr.length - 1) {
          str += ",";
        }
      }
      return str;
    },
    handleRemoveProductSku(index, row) {
      let list = this.skuStockList;
      if (list.length === 1) {
        list.pop();
      } else {
        list.splice(index, 1);
      }
    },
    save() {
      let api = this.draft == 2 ? updateProduct : createProduct
      this.productParam.publishStatus = this.isEdit ? this.draft : 2
      this.productParam.skuStockList = this.skuStockList
      this.productParam.pic = this.albumPics.shift()
      this.productParam.albumPics = this.albumPics.join(',')
      this.productParam.isGift = 0;
      if (this.productParam.originalPrice) this.productParam.price = this.productParam.originalPrice

      this.mergeProductAttrValue();
      this.mergeProductAttrPics();
      api(this.productParam).then(() => {
        this.$message({
          type: 'success',
          message: '保存成功',
          duration: 1000
        });
        this.draft = 0
        this.productParam = Object.assign({}, defaultProductParam)
        this.$router.back();
      });
    },
    handleNext(formName) {
      const list = this.skuStockList;
      const reg = /^[+]{0,1}(\d+)$/; // 正整数的正则表达式(包括0)
      // const reg1 = /^((0{1}\.\d{1,2})|([1-9]\d*\.{1}\d{1,2})|([1-9]+\d*))$/; // 正数的正则表达式(不包括0，小数保留两位)
      const reg1 = /^((0{1}\.\d{1,2})|([1-9]\d{0,5}\.{1}\d{1})|([1-9]\d{0,4}\.{1}\d{2})|([0-9]{1,7}))$/; // 正数的正则表达式(不包括0，小数保留两位)
      const reg2 = /^(([1-9]\d{0,4})|(0{1}))$/; // 5位整数

      if (list && list.length) {
        for (let i = 0; i < list.length; i++) {
          if (this.saleType) {
            if (!reg1.test(list[i].price)) {
              this.$message.error('销售价格为必填，请输入1-7位数字,最多保留两位小数~');
              return;
            }
          }
          if (!reg2.test(list[i].stock)) {
            this.$message.error('商品库存为必填，请输入1-5位数字~');
            return;
          }
          if (list[i].id && !list[i].skuCode) {
            this.$message.error(`商品规格列表第${i + 1}条为历史数据，SKU编号不能为空~`);
            return;
          }
        }
      } else {
        this.$message({
          type: 'error',
          message: '请填写商品规格',
          duration: 1000
        });
        return
      }
      if (!this.albumPics.length) {
        this.$message({
          type: 'error',
          message: '请上传商品相册',
          duration: 1000
        });
        return
      }
      if (!this.saleType) {
        this.productParam.isGift = 1;
      } else {
        this.productParam.isGift = 0;
      }
      const albumPics = [...this.albumPics];
      this.$refs[formName].validate((valid, err) => {
        if (valid || err.hasOwnProperty('pic') && this.albumPics.length) {
          this.mergeProductAttrValue();
          this.mergeProductAttrPics();
          let api = this.isEdit ? updateProduct : createProduct
          this.productParam.pic = this.albumPics.shift()
          this.productParam.albumPics = this.albumPics.join(',')
          this.productParam.promotionType = 0
          this.productParam.publishStatus = this.draft == 2 ? 0 : this.draft
          this.productParam.skuStockList = this.skuStockList
          this.productParam.price = this.productParam.originalPrice
          // 更新新品和推荐的状态值
          // if (this.productParam.newStatus === 1) {
          //   this.productParam.recommondStatus === 0
          // } else {
          //   this.productParam.recommondStatus === 1
          // }

          api(this.productParam).then(response => {
            this.$message({
              type: 'success',
              message: '提交成功',
              duration: 1000
            });
            this.draft = 0
            this.productParam = Object.assign({}, defaultProductParam)
            this.$router.back();
          }).catch(err => {
            this.albumPics = [...albumPics];
            this.productParam.albumPics = albumPics.join(',')
          });
        } else {
          this.$message({
            message: "验证失败",
            type: "error",
            duration: 1000,
          });
          return false;
        }
      });
    },
  }
}
</script>
<style scoped lang="scss">
.form-container {
  width: 800px;
}
.littleMarginLeft {
  margin-left: 10px;
}

.littleMarginTop {
  margin-top: 10px;
}

.paramInput {
  width: 250px;
}

.paramInputLabel {
  display: inline-block;
  width: 120px;
  text-align: right;
  padding-right: 10px;
}

.cardBg {
  background: #f8f9fc;
}
.cardBg .el-form-item {
  display: inline-block;
  margin-bottom: 5px;
}
.productDetail {
  >>> img {
    width: 100%;
  }
}

.upload-tip {
  position: absolute;
  color: #666;
  font-size: 12px;
  bottom: -30px;
}
</style>
