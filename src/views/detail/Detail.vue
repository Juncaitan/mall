<template>
    <div id="detail">
      <detail-nav-bar class="detail-nav" ref="nav" @titleClick="titleClick"/>
      <scroll class="content" ref="scroll"
              @scroll="contentScroll" :probe-type="3">

        <detail-swiper :top-images="topImages"/>
        <detail-base-info :goods="goods"/>
        <detail-shop-info :shop="shop"/>
        <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
        <detail-param-info ref="params" :param-info="paramInfo"/>
        <detail-comment-info ref="comment" :comment-info="commentInfo"/>
        <good-list ref="recommend" :goods="recommends"/>
      </scroll>
      <detail-bottom-bar @addCart="addToCart"/>
      <back-top @click.native="backClick" v-show="isShowBackTop"/>
    </div>
</template>

<script>
    import DetailNavBar from './childComps/DetailNavBar'
    import DetailSwiper from './childComps/DetailSwiper'
    import DetailBaseInfo from './childComps/DetailBaseInfo'
    import DetailShopInfo from './childComps/DetailShopInfo'
    import DetailGoodsInfo from './childComps/DetailGoodsInfo'
    import DetailParamInfo from './childComps/DetailParamInfo'
    import DetailCommentInfo from './childComps/DetailCommentInfo'
    import DetailBottomBar from './childComps/DetailBottomBar'

    import Scroll from 'components/common/scroll/Scroll'
    import GoodList from 'components/content/goods/GoodList'


    import {
      getDetail, Goods, Shop,
      GoodsParam, getRecommend
    } from "network/detail"

    import {debounce} from 'common/utils'
    import {itemListenerMixin,backTopMixin} from 'common/mixin'

    export default {
      name: "Detail",
      components:{
        DetailNavBar,
        DetailSwiper,
        DetailBaseInfo,
        DetailShopInfo,
        Scroll,
        DetailGoodsInfo,
        DetailParamInfo,
        DetailCommentInfo,
        GoodList,
        DetailBottomBar
      },
      mixins:[itemListenerMixin,backTopMixin],
      data(){
        return{
          iid:null,
          topImages:[],
          goods:{},
          shop:{},
          detailInfo:{},
          paramInfo:{},
          commentInfo:{},
          recommends:[],
          themeTopYs:[],
          getThemeTopY:null,
          currentIndex:0,
        }
      },
      created() {
        this.iid = this.$route.params.id
        this.getDetail(this.iid) //请求详情数据
        this.getRecommend() //请求推荐数据

        this.getThemeTopY = debounce(()=>{
          this.themeTopYs = []
          this.themeTopYs.push(0)
          this.themeTopYs.push(this.$refs.params.$el.offsetTop-44)
          this.themeTopYs.push(this.$refs.comment.$el.offsetTop-44)
          this.themeTopYs.push(this.$refs.recommend.$el.offsetTop-44)
        },100)
      },
      methods:{
        getDetail(iid){
          getDetail(iid).then(res=>{
            const data = res.result
            //获取轮播图
            this.topImages = data.itemInfo.topImages;
            //获取商品信息
            this.goods = new Goods(data.itemInfo,data.columns,data.shopInfo.services)
            //获取店铺信息
            this.shop = new Shop(data.shopInfo)
            //获取商品详细信息
            this.detailInfo = data.detailInfo
            //获取参数信息
            this.paramInfo = new GoodsParam(data.itemParams.info,data.itemParams.rule)
            //获取评论信息
            if(data.rate.cRate !== 0){
              this.commentInfo = data.rate.list[0]
            }

          })
        },
        imageLoad(){
          this.$refs.scroll.refresh()
          this.getThemeTopY()
        },
        getRecommend(){
          getRecommend().then(res=>{
            this.recommends = res.data.list;
          })
        },
        //事件监听
        titleClick(index){
          this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 100)
        },
        contentScroll(position){
          const positionY = -position.y
          this.isShowBackTop = positionY > 1000
          for (let i = 0; i < this.themeTopYs.length; i++){
            let length = this.themeTopYs.length
            if (this.currentIndex !== i && ((i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1]) ||
              (i === length - 1 && positionY >= this.themeTopYs[i]))){
              this.currentIndex = i
              this.$refs.nav.currentIndex = this.currentIndex
            }
          }
        },
        //添加到购物车
        addToCart(){
          //获取购物车展示信息
          const product = {}
          product.image = this.topImages[0]
          product.title = this.goods.title
          product.desc = this.goods.desc
          product.price = this.goods.realPrice
          product.iid = this.iid
          this.$store.dispatch('addCart',product).then(res =>{
            console.log(res)
            this.$toast.show(res,1500)
          })
        }

      },
      mounted(){
      },
      destroyed(){
        //取消全局监听
        this.$bus.$off('itemImgLoad',this.itemImgListener)
      }
    }
</script>

<style scoped>
  #detail{
    position: relative;
    height: 100vh;
    z-index: 10;
    background-color: #fff;
  }
  .detail-nav{
    position: relative;
  }
  .content{
    height: calc(100% - 44px - 58px);
    overflow: hidden;
  }
</style>
