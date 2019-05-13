<style src='../common/css/addStudent.css'></style>
<template>
  <view class="flex-column p-20 bg_white radius-10">
    <view class="font-32 line-button p-20">{{order.spec}}</view>
    <view class="font-32 line-button p-20">商品价格：{{order.goodprice/100}}</view>
    <view class="font-32 line-button p-20">手续费：{{order.poundage==null?0:order.poundage/100}}</view>
    <view class="font-32 line-button p-20" @tap="showCommission">佣金：{{order.commission==null?0:order.commission/100}}</view>
    <view class="font-32 line-button p-20" @tap="showWlPrice">物流费：{{order.wlprice==null?0:order.wlprice/100}}</view>
    <view class="font-32 line-button p-20">实收：{{order.goodsamount/100}}</view>
    <view class="font-32 line-button p-20">收货人：{{order.name}}</view>
    <view class="font-32 line-button p-20">下单时间：{{wxs.dateFormat(order.paytime,"yyyy-MM-dd")}}</view>
    <view hidden="{{order.issd==1}}" class="font-32 line-button p-20">收菜时间：{{wxs.dateFormat(order.sctime,"yyyy-MM-dd")}}</view>

    <view hidden="{{!isUpdate}}" class='bottom-group'>
      <view class='bottom-group-item' @tap="tapCommit">保存修改</view>
    </view>
  </view>
  <view hidden="{{!showCommissionModel}}">
    <view class="modal-mask" bindtap="hideModal" catchtouchmove="preventTouchMove"></view>
    <view class="modal-dialog" style="top: 30%;">
      <view class="modal-title">{{title}}</view>
      <view class="modal-content text-center" style="font-size: 28rpx">
        <input type="text" bindinput="bindCommission" value="{{order.commission}}" confirm-type='text' placeholder='{{placeholder}}' class="addStu-name"/>
      </view>
      <view class="modal-footer">
        <view class="btn-cancel" @tap="onRecordCancel(0)" data-status="cancel">取消</view>
        <view class="btn-confirm" @tap="onRecordConfirm(0)" data-status="confirm">确定</view>
      </view>
    </view>
  </view>
  <view hidden="{{!showWlPriceModel}}">
    <view class="modal-mask" bindtap="hideModal" catchtouchmove="preventTouchMove"></view>
    <view class="modal-dialog" style="top: 30%;">
      <view class="modal-title">{{title}}</view>
      <view class="modal-content text-center" style="font-size: 28rpx">
        <input type="text" bindinput="bindWlPrice" value="{{order.wlprice}}" confirm-type='text' placeholder='{{placeholder}}' class="addStu-name"/>
      </view>
      <view class="modal-footer">
        <view class="btn-cancel" @tap="onRecordCancel(1)" data-status="cancel">取消</view>
        <view class="btn-confirm" @tap="onRecordConfirm(1)" data-status="confirm">确定</view>
      </view>
    </view>
  </view>

</template>
<style src="../common/css/modal.css"></style>
<script>
  import wepy from 'wepy'
  import mywxs from 'wxs/my.wxs'
  import httpUtils from '../common/js/httputil'
  import utils from '../common/js/utils'
  export default class Order extends wepy.page {
    config = {
      navigationBarTitleText: '订单详情'
    };
    data={
      showCommissionModel:false,
      showWlPriceModel:false,
      order:null,
      isUpdate:false,
    };
    wxs={
      wxs:mywxs
    };

    methods={
      tapCommit(){
         //提交修改
        const requestHandle = {
          url:'https://www.zwwjj1314.com/pdd/updateOrder',
          data:this.order,
        };
        httpUtils.post(requestHandle)
          .then(result=>{
          console.log(result);
          if(result.code === 0){
            utils.getPrePage().updateOrder(this.order);
          }
          },error=>{
          console.log(error)
          })

      },
      bindCommission(e){
        this.isUpdate = true;
        this.order.commission = e.detail.value;
      },
      bindWlPrice(e){
        this.isUpdate = true;
        this.order.wlprice = e.detail.value;
      },
      showCommission(){
        this.showCommissionModel = true;
      },
      showWlPrice(){
        this.showWlPriceModel = true;
      },
      hideModal(){
        this.showCommissionModel = false;
        this.showWlPriceModel = false;
      },
      onRecordCancel(type) {
        if(type==0){
          this.showCommissionModel = false;
        }else{
          this.showWlPriceModel = false;
        }

      },
      onRecordConfirm(type) {
        if(type==0){
          this.showCommissionModel = false;
        }else{
          this.showWlPriceModel = false;
        }
      },
    };
    onLoad(){
      let that = this;
      wx.getStorage({
        key: 'order',
        success: function(res) {
          that.order = res.data;
          that.$apply();
        }
      })


    }
  };
</script>

<style scoped>

</style>
