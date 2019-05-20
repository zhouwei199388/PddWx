<template style="background: #999999">
  <view class="mech-wrap">
    <view class="setfixed">
      <dateSelector :value.sync="dateValue" fields="day" @onDateChange.user="onDateChange"></dateSelector>
      <view class="bg-white flex-row border-top p-10">
        <view class="flex-column-center" style="flex:1">
          <text class="font-32">收入</text>
          <text class="font-28 text-red">{{srPrice===0?0:srPrice/100}}</text>
        </view>
        <view class="flex-column-center border-right border-left" style="flex:1">
          <text class="font-32">佣金</text>
          <text class="font-28 text-green">{{sdPrice===0?0:sdPrice/100}}</text>
        </view>
        <view class="flex-column-center" style="flex:1">
          <text class="font-32">技术服务费</text>
          <text class="font-28 text-green">{{poundagePrice===0?0:poundagePrice/100}}</text>
        </view>
      </view>
    </view>
    <view class="mech-mid" style="margin-top: 220rpx">
      <repeat for="{{orders}}">
        <view class="flex-column p-20 m-20 bg_white radius-10" @tap="onItemClick({{index}})">
          <view class="font-32">{{item.spec}}</view>
          <view class="font-30">商品价格：{{item.goodprice/100}}</view>
          <view class="font-30">佣金：{{item.commission==null?0:item.commission/100}}</view>
          <view class="font-30">手续费：{{item.poundage==null?0:item.poundage/100}}</view>
          <view class="font-30">实收：{{item.goodsamount/100}}</view>
          <view class="font-30">收货人：{{item.name}}</view>
          <view class="font-30">下单时间：{{wxs.dateFormat(item.paytime,'yyyy-MM-dd')}}</view>
          <view hidden="{{order.issd==1}}" class="font-30">收菜时间：{{wxs.dateFormat(item.sctime,'yyyy-MM-dd')}}</view>
        </view>
      </repeat>
    </view>
  </view>


</template>
<script>
  import wepy from 'wepy';
  import httpUtils from '../common/js/httputil';
  import Toast from 'wepy-com-toast';
  import mywxs from 'wxs/my.wxs';
  import Utils from '../common/js/utils';
  import DateSelector from '../components/dateSelector';

  export default class Order extends wepy.page {
    config = {
      navigationBarTitleText: '订单列表'
    };
    components = {
      toast: Toast,
      dateSelector: DateSelector
    };
    data = {
      orders: [],
      position: 0,
      dateValue: '',
      sdPrice: 0,
      poundagePrice: 0,
      srPrice: 0
    };
    wxs = {
      wxs: mywxs
    };
    methods = {
      onItemClick: function(position) {
        this.position = position;
        console.log(position);
        wx.setStorage({
          key: 'order',
          data: this.orders[position]
        });
        Utils.navigateTo('orderDetails');
      },
      onDateChange(value) {
        this.dateValue = value;
        this.getOrders();
      }
    };

    updateOrder(order) {
      this.orders[this.position] = order;
    }


    setPrice() {
      this.sdPrice=0;
      this.poundagePrice=0;
      this.srPrice=0;
      console.log(this.orders);
      for (let i=0;i<this.orders.length;i++) {
        const order = this.orders[i];
        if (order.issd === 0) {
          this.sdPrice += order.commission;
          this.poundagePrice += order.poundage;
        } else {
          this.srPrice += (order.goodsamount - order.commission - order.wlprice);
        }
      }
    }

    getOrders() {
      const startTime = (new Date(this.dateValue).getTime()) / 1000;
      const endTime = startTime + 3600 * 24;
      const requestHandle = {
        url: 'https://www.zwwjj1314.com/pdd/getOrderForTime?startTime=' + startTime + '&endTime=' + endTime
      };
      httpUtils.get(requestHandle, '加载中...')
        .then(result => {
          console.log(result);
          this.orders = result.orders;
          this.setPrice();
          this.$apply();
        }, error => {
          console.log(error);
        });
    }

    onLoad() {
      this.dateValue = Utils.dateFormat(new Date().getTime(), 'y-M-d');
      this.getOrders();

    }
  }
</script>

<style scoped>

</style>
