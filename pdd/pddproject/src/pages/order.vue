<template style="background: #999999">
  <repeat for="{{orders}}" >
    <view class="flex-column p-20 m-20 bg_white radius-10" @tap="onItemClick({{index}})">
      <view class="font-32">{{item.spec}}</view>
      <view class="font-30">商品价格：{{item.goodprice/100}}</view>
      <view class="font-30">佣金：{{item.commission==null?0:item.commission/100}}</view>
      <view class="font-30">手续费：{{item.poundage==null?0:item.poundage/100}}</view>
      <view class="font-30">实收：{{item.goodsamount/100}}</view>
      <view class="font-30">收货人：{{item.name}}</view>
      <view class="font-30">下单时间：{{wxs.dateFormat(item.paytime,"yyyy-MM-dd")}}</view>
      <view hidden="{{order.issd==1}}" class="font-30">收菜时间：{{wxs.dateFormat(item.sctime,"yyyy-MM-dd")}}</view>
    </view>
  </repeat>
</template>
<script>
  import wepy from 'wepy'
  import httpUtils from '../common/js/httputil'
  import Toast from 'wepy-com-toast'
  import mywxs from 'wxs/my.wxs'
  import Utils from '../common/js/utils'
  export default class Order extends wepy.page {
    config = {
      navigationBarTitleText: '订单列表'
    };
    components = {
      toast: Toast
    };
    data = {
      orders:[],
      position:0,
    };
    wxs={
      wxs:mywxs
    };
    methods = {
      onItemClick: function(position) {
        this.position = position;
        console.log(position);
        wx.setStorage({
          key:"order",
          data:this.orders[position]
        });
        Utils.navigateTo('orderDetails');
      }
    };

    updateOrder(order){
      this.orders[this.position] = order;
    }

    getOrders(){
      const requestHandle = {
        url:'https://www.zwwjj1314.com/pdd/getAllOrder',
      };
      httpUtils.get(requestHandle,"加载中...")
        .then(result=>{
          console.log(result);
          this.orders = result.orders;
          this.$apply();
        },error=>{
          console.log(error)
        })
    }
    onLoad() {
      this.getOrders();

    }
  }
</script>

<style scoped>

</style>
