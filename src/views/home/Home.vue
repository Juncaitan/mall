<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <home-swiper :banners="banners"/>
    <recommend-view :recommends="recommends"/>
    <feature-view/>
    <tab-control :titles="['流行','新款','精选']" @tabClick="tabClick"/>
    <good-list :goods="showGoods"/>

  </div>

</template>

<script>
  import NavBar from 'components/common/navbar/NavBar'
  import TabControl from 'components/content/tabcontrol/TabControl'
  import GoodList from 'components/content/goods/GoodList'

  import HomeSwiper from './childComps/HomeSwiper'
  import RecommendView from './childComps/RecommendView'
  import FeatureView from './childComps/FeatureView'

  import {getHomeMultidata,getHomeGoods} from 'network/home'

  export default {
    name: "Home",
    components:{
      NavBar,
      HomeSwiper,
      RecommendView,
      FeatureView,
      TabControl,
      GoodList
    },
    data(){
      return{
        banners:[],//轮播图
        recommends:[],
        goods:{
          "pop":{page:0,list:[]},
          "new":{page:0,list:[]},
          "sell":{page:0,list:[]},
        },
        currentType:"pop"
      }
    },
    created() {
      this.getHomeMultidata();
      this.getHomeGoods('pop');
      this.getHomeGoods('new');
      this.getHomeGoods('sell');
    },
    computed:{
      showGoods(){
        return this.goods[this.currentType].list
      }
    },
    methods:{

      /*事件监听*/

       tabClick(index){
        switch(index){
          case 0:
            this.currentType = "pop";
            break;
          case 1:
            this.currentType = "new";
            break;
          case 2:
            this.currentType = "sell";
            break;
        }
       },
      /*网络请求*/
      getHomeMultidata(){
        getHomeMultidata().then(res=>{
          console.log(res)
          this.banners = res.data.banner.list;
          this.recommends = res.data.recommend.list;
        })
      },
      getHomeGoods(type){
        const page = this.goods[type].page + 1;
        getHomeGoods(type,page).then(res=>{
          this.goods[type].list.push(...res.data.list);
          this.goods[type].page += 1;
        })
      }

    }
  }
</script>

<style scoped>
  #home{
    padding-top:44px;
    padding-bottom: 50px;
  }
  .home-nav{
    background-color: var(--color-tint);
    color: #ffffff;
    position: fixed;
    top:0;
    left: 0;
    right: 0;
    z-index: 10;
  }
</style>
