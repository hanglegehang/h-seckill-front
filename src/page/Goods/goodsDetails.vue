<!--商品详情-->
<template>
  <div class="w store-content">
    <div class="gray-box">
      <div class="gallery-wrapper">
        <div class="gallery">
          <div class="thumbnail">
            <ul>
              <li v-for="(item,i) in small" :key="i" :class="{on:big===item}" @click="big=item">
                <img v-lazy="item" :alt="item.itemName">
              </li>
            </ul>
          </div>
          <div class="thumb">
            <div class="big">
              <img :src="big" :alt="item.itemName">
            </div>
          </div>
        </div>
      </div>
      <!--右边-->
      <div class="banner">
        <div class="sku-custom-title">
          <h5>{{item.title}}</h5>
          <h3 v-if="isSeckill">
            <span>限时秒杀</span>
            <time-down :type="2"
                       :endTime="item.endTime" :startTime="item.startTime"
                       @time-end="endSeckill"></time-down>
          </h3>
          <h6>
            <span>{{item.sellPoint}}</span>
            <span class="price">
              <em>¥</em><i>{{item.nowPrice}}</i></span>
          </h6>
        </div>
        <div class="num">
          <span class="params-name">数量</span>
          <buy-num @edit-num="editNum" :limit="item.itemSellLimit"></buy-num>
        </div>
        <div class="buy">
          <y-button text="加入购物车"
                    @btnClick="addCart(item.id,item.nowPrice,item.title,small[0])"
                    classStyle="main-btn"
                    style="width: 145px;height: 50px;line-height: 48px"></y-button>
          <y-button text="现在购买"
                    @btnClick="buyNow(item.id)"
                    style="width: 145px;height: 50px;line-height: 48px;margin-left: 10px"></y-button>
        </div>
      </div>
    </div>
    <!--产品信息-->
    <div class="item-info">
      <y-shelf title="产品信息">
        <div slot="content">
          <div class="img-item" v-if="productMsg">
            <div v-html="productMsg">{{ productMsg }}</div>
          </div>
          <div class="no-info" v-else>
            <img src="/static/images/no-data.png">
            <br>
            该商品暂无内容数据
          </div>
        </div>
      </y-shelf>
    </div>
  </div>
</template>
<script>
  import {productDet, addCart} from '../../api/goods'
  import {mapMutations, mapState} from 'vuex'
  import YShelf from '/components/shelf'
  import BuyNum from '/components/buynum'
  import YButton from '/components/YButton'
  import TimeDown from '../../components/TimeDown'
  import {getStore} from '/utils/storage'

  export default {
    data () {
      return {
        now: 0,
        productMsg: {},
        small: [], // 小图
        big: '', // 大图
        buyNum: 1,
        isSeckill: false, // 是否为秒杀商品
        item: {}
      }
    },
    computed: {
      ...mapState(['login', 'showMoveImg', 'showCart'])
    },
    methods: {
      ...mapMutations(['ADD_CART', 'ADD_ANIMATION', 'SHOW_CART']),
      _productDet (id) {
        productDet(id).then(res => {
          this.item = res.data
          this.productMsg = this.item.detail || ''
          this.small = JSON.parse(this.item.imageUrl)
          this.big = this.small[0]
          this.item.nowPrice = (this.item.price / 1000 * this.item.discount).toFixed(2)
          this.item.price = (this.item.price / 1000).toFixed(2)
          if (this.item.isSeckill === 1 && this.item.endTime > new Date().getTime()) {
            this.isSeckill = true
          }
        })
      },
      addCart (id, price, name, img) {
        if (!this.showMoveImg) {     // 动画是否在运动
          if (this.login) { // 登录了 直接存在用户名下
            addCart([{itemId: id, buyNum: this.buyNum}]).then(res => {
              // 并不重新请求数据
              this.ADD_CART({
                itemId: id,
                price: price,
                itemName: name,
                itemImg: img,
                buyNum: this.buyNum
              })
            })
          } else { // 未登录 vuex
            this.ADD_CART({
              itemId: id,
              price: price,
              itemName: name,
              itemImg: img,
              buyNum: this.buyNum
            })
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
      buyNow (itemId) {
        this.$router.push({path: '/checkout', query: {itemId, num: this.buyNum}})
      },
      editNum (num) {
        this.buyNum = num
      },
      endSeckill () {
        this.isSeckill = false
      }
    },
    components: {
      YShelf, BuyNum, YButton, TimeDown
    },
    created () {
      // debugger
      let id = this.$route.params.id
      this._productDet(id)
      this.userId = getStore('userId')
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../assets/style/mixin";

  .store-content {
    clear: both;
    width: 1220px;
    min-height: 600px;
    padding: 0 0 25px;
    margin: 0 auto;
  }

  .gray-box {
    display: flex;
    padding: 60px;
    margin: 20px 0;
    .gallery-wrapper {
      .gallery {
        display: flex;
        width: 540px;
        .thumbnail {
          li:first-child {
            margin-top: 0px;
          }
          li {
            @include wh(80px);
            margin-top: 10px;
            padding: 12px;
            border: 1px solid #f0f0f0;
            border: 1px solid rgba(0, 0, 0, .06);
            border-radius: 5px;
            cursor: pointer;
            &.on {
              padding: 10px;
              border: 3px solid #ccc;
              border: 3px solid rgba(0, 0, 0, .2);
            }
            img {
              display: block;
              @include wh(100%);
            }
          }
        }
        .thumb {
          .big {
            margin-left: 20px;
          }
          img {
            display: block;
            @include wh(440px)
          }
        }
      }
    }
    // 右边
    .banner {
      width: 600px;
      margin-left: 10px;
      h5 {
        font-size: 20px;
        line-height: 1.25;
        color: #313131;
        margin-bottom: 13px;
      }
      h3 {
        color: white;
        background: url("http://pimage.fightinghang.cn/blog-image/20181225200832_VRSNs3_seckilling.jpeg") no-repeat #e84540;
        font-size: 17px;
        line-height: 1.7;
        margin-bottom: 13px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        /*div {
          span {
            background-color: #443b3b;
          }
        }*/
      }
      h6 {
        font-size: 14px;
        line-height: 1.5;
        color: #bdbdbd;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .sku-custom-title {
        overflow: hidden;
        position: relative;
      }
      .params-name {
        padding-right: 20px;
        font-size: 14px;
        color: #8d8d8d;
        line-height: 36px;
      }
      .num {
        padding: 29px 0 8px 10px;
        border-top: 1px solid #ebebeb;
        display: flex;
        align-items: center;
      }
      .buy {
        position: relative;
        border-top: 1px solid #ebebeb;
        padding: 30px 0 0 10px;
      }
    }
  }

  .item-info {

    .gray-box {
      padding: 0;
      display: block;
    }
    .img-item {
      width: 1220px;
      // padding: 1vw;
      text-align: center;
      img {
        width: 100%;
        height: auto;
        display: block;
      }
    }
  }

  .no-info {
    padding: 200px 0;
    text-align: center;
    font-size: 30px;
  }

  .price {
    display: block;
    color: #d44d44;
    font-weight: 700;
    font-size: 16px;
    line-height: 20px;
    text-align: right;
    i {
      padding-left: 2px;
      font-size: 24px;
    }
  }
</style>
