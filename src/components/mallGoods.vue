<template>
  <div class="good-item">
    <div style="">
      <div class="good-img">
        <a @click="openProduct(product.itemId)">
          <img v-lazy="itemUrl" :alt="itemName" :key="itemUrl">
        </a>
      </div>
      <h6 class="good-title" v-html="itemName">{{itemName}}</h6>
      <h3 class="sub-title ellipsis">{{itemSellPoint}}</h3>
      <h3 class="seckill-des">
        <time-down v-if="isSeckill" :type="1"
                   :endTime="product.seckillItemPO.endTime" :startTime="product.seckillItemPO.startTime"
                   @time-end="endSeckill"></time-down>
      </h3>
      <div class="good-price pr">
        <div class="ds pa">
          <y-button text="加入购物车"
                    style="margin: 0 5px"
                    @btnClick="addCart(product.id,Number(itemPrice/1000)*(discount).toFixed(2),itemName,itemUrl)"
                    classStyle="main-btn"
          ></y-button>
          <a @click="openProduct(product.itemId)">
            <y-button text="立即购买" style="margin: 0 5px"></y-button>
          </a>
        </div>
        <p v-if="isSeckill"><s style="font-size: 14px"><span>￥</span>{{Number(itemPrice/1000).toFixed(2)}}</s>
          <span style="font-size:14px">￥</span>{{Number(itemPrice/1000)*(discount).toFixed(2)}}
        </p>
        <p v-else-if="!isSeckill">
          <span style="font-size:14px">￥</span>{{Number(itemPrice/1000).toFixed(2)}}
        </p>
      </div>
    </div>
  </div>
</template>
<script>
  import YButton from '/components/YButton'
  import TimeDown from '../components/TimeDown'
  import {addCart} from '../api/goods.js'
  import {mapMutations, mapState} from 'vuex'
  import {getStore} from '/utils/storage'

  export default {
    props: {
      product: {
        itemId: 0, // 关联商品ID
        seckillItemPO: {}, // 秒杀商品详情
        itemPO: {} // 普通商品详情
      }
    },
    data () {
      return {
        itemUrl: '', // 商品图片地址
        itemName: '', // 商品名称
        itemSellPoint: '', // 商品卖点
        itemPrice: 0, // 商品价格
        discount: 0, // 商品折扣
        isSeckill: false // 是否为秒杀商品
      }
    },
    methods: {
      ...mapMutations(['ADD_CART', 'ADD_ANIMATION', 'SHOW_CART']),
      goodsDetails (id) {
        this.$router.push({path: 'goodsDetails/productId=' + id})
      },
      openProduct (id) {
        // this.$router.push({path: 'goodsDetails', query: {productId: id}})
        window.open('//' + window.location.host + '/#/goodsDetails/' + id)
        // window.open('//' + window.location.host + '/#/goodsDetails?productId=' + id)
      },
      addCart (id, price, name, img) {
        if (!this.showMoveImg) {     // 动画是否在运动
          if (this.login) { // 登录了 直接存在用户名下
            addCart({userId: getStore('userId'), productId: id, productNum: 1}).then(res => {
              // 并不重新请求数据
              this.ADD_CART({productId: id, salePrice: price, productName: name, productImg: img})
            })
          } else { // 未登录 vuex
            this.ADD_CART({productId: id, salePrice: price, productName: name, productImg: img})
          }
          // 加入购物车动画
          var dom = event.target
          // 获取点击的坐标
          let elLeft = dom.getBoundingClientRect().left + (dom.offsetWidth / 2)
          let elTop = dom.getBoundingClientRect().top + (dom.offsetHeight / 2)
          // 需要触发
          this.ADD_ANIMATION({moveShow: true, elLeft: elLeft, elTop: elTop, img: img})
          if (!this.showCart) {
            this.SHOW_CART({showCart: true})
          }
        }
      },
      endSeckill () {
        this.inSeckill = false
      }
    },
    computed: {
      ...mapState(['login', 'showMoveImg', 'showCart'])
    },
    mounted () {
      this.itemUrl = this.product.picUrl
      if (this.product.isSeckillItem === 1 && this.product.seckillItemPO.endTime > new Date().getTime()) {
        this.itemName = this.product.seckillItemPO.itemTitle
        this.itemSellPoint = this.product.seckillItemPO.itemSellPoint
        this.itemPrice = this.product.seckillItemPO.itemPrice
        this.discount = this.product.seckillItemPO.discount
        this.isSeckill = true
      } else {
        this.itemName = this.product.itemPO.title
        this.itemSellPoint = this.product.itemPO.sellPoint
        this.itemPrice = this.product.itemPO.price
        this.discount = this.product.itemPO.discount
      }
    },
    components: {
      YButton,
      TimeDown
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../assets/style/mixin";
  @import "../assets/style/theme";

  .good-item {
    background: #fff;
    width: 25%;
    transition: all .5s;
    height: 430px;
    &:hover {
      transform: translateY(-3px);
      box-shadow: 1px 1px 20px #999;
      .good-price p {
        display: none;
      }
      .ds {
        display: flex;
      }
    }
    .ds {
      @extend %block-center;
      width: 100%;
      display: none;
    }

    .good-img {
      img {
        margin: 50px auto 10px;
        @include wh(206px);
        display: block;
      }
    }
    .good-price {
      margin: 5px 0;
      height: 30px;
      text-align: center;
      line-height: 30px;
      color: #d44d44;
      font-family: Arial, serif;
      font-size: 18px;
      font-weight: 700;
    }
    .good-title {
      line-height: 1.2;
      font-size: 16px;
      height: 38px;
      color: #424242;
      margin: 0 auto;
      padding: 0 14px;
      text-align: center;
      overflow: hidden;
    }
    .seckill-des {
      font-size: 14px;
      color: #c81623;
    }
    h3 {
      text-align: center;
      line-height: 1.2;
      font-size: 12px;
      color: #969696;
      padding: 10px;
    }

  }
</style>
