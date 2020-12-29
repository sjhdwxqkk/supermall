<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"/>
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll">
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info ref="params" :paramInfo="paramInfo"/>
      <detail-comment-info ref="comment" :commentInfo="commonInfo"/>
      <goods-list ref="recommend" :goods="recomments"/>
    </scroll>
    <detail-bottom-bar @addCart="addToCart"/>
    <back-top @click.native="backClick" v-show="isShowBackTop"/>

  </div>

</template>

<script>
  import DetailNavBar from "@/views/detail/childComps/DetailNavBar";
  import DetailSwiper from "@/views/detail/childComps/DetailSwiper";
  import DetailBaseInfo from "@/views/detail/childComps/DetailBaseInfo";
  import DetailShopInfo from "@/views/detail/childComps/DetailShopInfo";
  import DetailCommentInfo from "@/views/detail/childComps/DetailCommentInfo";
  import DetailGoodsInfo from "@/views/detail/childComps/DetailGoodsInfo";
  import DetailParamInfo from "@/views/detail/childComps/DetailParamInfo";
  import DetailBottomBar from "@/views/detail/childComps/DetailBottomBar";
  import BackTop from "@/components/content/backTop/BackTop";

  import Scroll from "@/components/common/scroll/Scroll";
  import GoodsList from "@/components/content/goods/GoodsList";

  import {getDetail, Goods, Shop, GoodsParam, getRecommend} from "@/network/detail";
  import {debounce} from "@/common/utils";
  import {itemListenerMixin} from "@/common/mixin";
  import {mapActions} from 'vuex'



  export default {
    name: "Detail",
    components:{
      DetailGoodsInfo,
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailCommentInfo,
      DetailParamInfo,
      Scroll,
      GoodsList,
      DetailBottomBar,
      BackTop
    },
    mixins: [itemListenerMixin],
    data() {
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        commonInfo: {},
        paramInfo: {},
        recomments: {},
        themeTopYs: [],
        getThemeTopYs: null,
        currentIndex: 0,
        isShowBackTop: false,
        message: '',
        show: false
      }
    },
    created() {
      // 1.保存传入的iid
      console.log(this.$route.params);
      this.iid = this.$route.params.iid

      //2.根据iid请求详情数据
      getDetail(this.iid).then(res => {
        // console.log(res);
        const data = res.result;

        // 1.获取顶部轮播图数据
        this.topImages = data.itemInfo.topImages
        // this.topImages = res.result.itemInfo.topImages

        // 2.获取商品信息
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)
        // this.goods = new Goods(res.result.itemInfo, res.result.columns, res.result.shopInfo.services)

        // 3.创建店铺信息
        this.shop = new Shop(data.shopInfo)

        // 4.保存商品的详情数据
        this.detailInfo = data.detailInfo

        // 5.获取参数信息
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

        // 6.取出参数信息
        this.itemParams = data.itemParams

        // 7.取出评论信息
        if (data.rate.cRate !==0 ) {
          this.commonInfo = data.rate.list[0]
        }

      })

      //3.请求推荐数据
      getRecommend().then(res => {
        this.recomments = res.data.list
      })

      //4.给getThemeTopY赋值（对给this.themeTopYs赋值的操作进行防抖）
      this.getThemeTopYs = debounce(() => {
        this.themeTopYs = []

        this.themeTopYs.push(0);
        this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        this.themeTopYs.push(Number.MAX_VALUE)

        console.log(this.themeTopYs);
      })
    },
    mounted() {

    },
    methods: {
      ...mapActions(['addCart']),
      imageLoad() {
        this.$refs.scroll.refresh()
        this.getThemeTopYs()
      },
      titleClick(index) {
        // console.log(index);
        this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 200)
      },
      contentScroll(position) {
        // console.log(position);
        // 1.获取Y值
        const positionY = position.y

        // 2.和主题中的值对比
        let length = this.themeTopYs.length

        for(let i = 0; i < length-1; i++) {
          if(this.currentIndex !== i &&(-positionY >= this.themeTopYs[i] && -positionY < this.themeTopYs[i+1]))
          {
            this.currentIndex = i;
            console.log(this.currentIndex);
            this.$refs.nav.currentIndex = this.currentIndex
          }
        }
        this.isShowBackTop = -position.y > 1000
      },
      backClick() {
        this.$refs.scroll.scrollTo(0, 0)
      },
      addToCart() {
        //1.获取需要在购物车中展示的信息，添加进去
        const product = {}
        product.image = this.topImages[0];
        product.title = this.goods.title;
        product.desc = this.goods.desc;
        product.price = this.goods.realPrice;
        product.iid = this.iid

        //2.将信息添加到购物车
        // this.$store.commit('addCart', product)
        // this.$store.dispatch('addCart', product).then(res => {
        this.addCart(product).then(res => {
          this.$toast.show(res, 1500)
        })
      }
    },
    destroyed() {
      this.$bus.$off('itemImageLoad', this.itemImgListener)
    }
  }
</script>

<style scoped>
 #detail {
   position: relative;
   z-index: 9;
   background-color: #ffffff;
   height: 100vh;
 }

 .detail-nav {
   position: relative;
   z-index: 9;
   background-color: #ffffff;
 }

 .content {
   height: calc(100% - 44px);
 }

</style>
