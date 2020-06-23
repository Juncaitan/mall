<template>
    <div class="goodList">
      <good-list-item v-for="(item,index) in goods" :key="index" :good-item="item"/>
    </div>
</template>

<script>
  import GoodListItem from './GoodListItem'

    export default {
      name: "GoodList",
      props:{
        goods:{
          type:Array,
          default(){
            return []
          }
        }
      },
      components:{
        GoodListItem
      }
    }
</script>

<style scoped>
  .goodList{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    /*padding: 2px;*/
  }

</style>
