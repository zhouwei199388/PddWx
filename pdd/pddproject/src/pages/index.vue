<style lang="less">

  .item {
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid #333333;
  }

  .btn-style{
    background: white;
    border-top: 1rpx solid #999999;
    border-bottom: 1rpx solid #999999;
    flex:1;
    text-align: center;
    padding: 20rpx 0rpx;
  }
</style>
<template>
  <view class="flex-column-center bg-white  p-20 m-r-20 m-l-20 m-t-10">
    <text class="font-32">收入</text>
    <text class="font-28 text-red">{{srPrice===0?0:srPrice/100}}</text>
  </view>
  <view class="bg-white flex-row border-top p-10 m-r-20 m-l-20">
    <view class="flex-column-center border-right " style="flex:1">
      <text class="font-32">佣金</text>
      <text class="font-28 text-green">{{sdPrice===0?0:sdPrice/100}}</text>
    </view>
    <view class="flex-column-center" style="flex:1">
      <text class="font-32">技术服务费</text>
      <text class="font-28 text-green">{{poundagePrice===0?0:poundagePrice/100}}</text>
    </view>
  </view>


  <button @tap="toOrder" class="bg-blue m-20 text-white" style="margin-top: 100rpx">订单列表</button>
  <button @tap="toScList" class="bg-blue m-20 text-white" >收菜列表</button>
</template>

<script>
  import wepy from 'wepy';
  import httpUtils from '../common/js/httputil';
  import Toast from 'wepy-com-toast';
  import utils from '../common/js/utils'

  export default class Index extends wepy.page {
    config = {
      navigationBarTitleText: '主页'
    };
    components = {
      toast: Toast
    };
    data = {
      orders: [],
      earning: 0,//真实收入=实收-物流-佣金-平台手续费
      sdPriceTotal: 0,//刷单押款
      commissionTotal: 0,//所有佣金
      coundageTotal: 0,//所有平台费
      wlPriceTotal: 0,//所有物流费
      goodsPriceTotal: 0//货款总支出
    };
    methods = {
      toOrder(){
       utils.navigateTo('order');
      },
      toScList(){
        utils.navigateTo('scList');
      }
    };

    setPrice(orders) {

    }

    getAllPrice(orders) {
      let allPrice = 0;
      orders.forEach(function(order, index, array) {
        allPrice += order.goodsAmount - order.commission - order.poundage - order.wlPrice;
      });
      return allPrice;
    }

    getOrders() {
      const requestHandle = {
        url: 'https://www.zwwjj1314.com/pdd/getAllOrder'
      };
      httpUtils.get(requestHandle, '加载中...')
        .then(result => {
          console.log(result);
          this.orders = result.orders;
          this.$apply();
        }, error => {
          console.log(error);
        });
    }

    onLoad() {
      this.getOrders();
    }
  }
</script>
