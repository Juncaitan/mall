<template>
    <div class="cart-bottom">
      <div class="check-content">
        <check-button :value="isSelectAll" class="check-button"
                      @click.native="checkedClick"/>
        <span>全选</span>
      </div>
      <div class="price">
        合计：{{totalPrice}}
      </div>
      <div class="calculate">
        去计算({{checkLength}})
      </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import CheckButton from './CheckButton'
    export default {
      name: "CartBottomBar",
      components:{ CheckButton },
      computed:{
        ...mapGetters(['cartList']),
        totalPrice(){
          return '￥'+ this.cartList.filter(item =>{
            return item.checked
          }).reduce((preValue,item) =>{
            return preValue + item.price * item.count
          },0).toFixed(2)
        },
        checkLength(){
          return this.cartList.filter(item=> item.checked).length
        },
        isSelectAll(){
          if (this.cartList.length === 0) return false
          return !(this.cartList.filter(item => !item.checked).length)
        }
      },
      methods:{
        checkedClick(){
          if (this.isSelectAll){
            this.cartList.forEach(item => item.checked = false)
          } else{
            this.cartList.forEach(item => item.checked = true)
          }
        }
      }
    }
</script>

<style scoped>
  .cart-bottom{
    height: 40px;
    position: relative;
    background-color: #eee;
    line-height: 40px;
    display: flex;
    font-size: 14px;
  }
  .check-content{
    display: flex;
    align-items: center;
    margin-left: 10px;
    width: 60px;
  }
  .check-button{
    width: 20px;
    height: 20px;
    line-height: 20px;
    margin-right: 5px;
  }
  .price{
    margin-left: 10px;
    flex: 1;
  }
  .calculate{
    width: 100px;
    color: #fff;
    background-color: red;
    text-align: center;
  }
</style>
