<template>
  <view class="bg-white flex-row-center" style="justify-content: space-around;height: 100rpx;padding: 0 20rpx">
    <!--<view class="date-top" style="width: 100rpx" @tap="tapPre">{{preText}}</view>-->
    <image src="../../images/ic_left.png" style="width:120rpx;height:56rpx" @tap="tapPre"></image>
    <picker mode="date" value="{{value}}" fields="{{fields}}" start="{{start}}" end="{{end}}" @change="bindDateChange">
      <view class="picker date-top" style="width: 300rpx;margin-left: 20rpx;margin-right: 20rpx">{{dateString}}</view>
    </picker>
    <image src="../../images/ic_right.png" style="width:120rpx;height:56rpx " @tap="tapNext"></image>
    <!--<view class="date-top" style="width: 100rpx" @tap="tapNext">{{nextText}}</view>-->
  </view>
</template>

<script>
  import wepy from 'wepy';
  import xwbUtil from '../common/js/utils';

  /**
   * 日期选择组件 支持上一年下一年的操作，（总高度100rpx）
   *
   * @param value 年-月-日 如果小于10，一定要补0，比如不能写[2018-3-4]要写成 [2018-03-04]
   * @param fields year.month.day    对应筛选的级别
   * @param start  起始日期
   * @param end 结束日期
   *
   * 回调 onDateChange
   * @param value  已选择的日期 格式如 : 2018或者 2018-01或者 2018-01-23
   */
  export default class DateSelector extends wepy.component {
    props = {
      // 静态传值
      fields:{
        type:String,
        default: '',
      },//year.month.day
      start: String,
      end:String,
      //value: 年月日的如果小于10 一定要补0
      value:{
        type:String,
        default: '',
      },
    };

    data = {
      preText:'<—',
      nextText:'—>',
      dateString:'',
    };

    // 监听器函数名必须跟需要被监听的data对象中的属性num同名，
    // 其参数中的newValue为属性改变后的新值，oldValue为改变前的旧值
    watch={
      value(newValue, oldValue) {
        let array = newValue.split('-');
        if (array.length == 1) {
          this.dateString = array[0] + '年';
          this.$apply();
          return;
        }

        let month;
        if (array.length == 2) {
          month = parseInt(array[1]);
          if (month <= 9) {
            this.dateString = array[0] + '年' + '0' + month + '月';
          } else {
            this.dateString = array[0] + '年' + month + '月';
          }
          this.$apply();
          return;
        }

        let day = -1;
        month = parseInt(array[1]);
        day = parseInt(array[2]);
        let monthStr = "";
        if (month <= 9) {
          monthStr = '0' + month + '月';
        } else {
          monthStr =  month + '月';
        }

        let dayStr = "";
        if (day < 10) {
          dayStr = '0' + day + '日';
        } else {
          dayStr = day + '日';
        }
        this.dateString = array[0] + '年' + monthStr +dayStr;
        this.$apply();
      }
    };

    methods = {
      tapPre() {
        let dateStr = this.value;
        let array = this.value.split("-");
        if (array.length == 2) {
          dateStr = dateStr + "-01"
          //IOS new Date 年月创建出来的Date是NULL的，所以追加一个日的时间
        }

        let date = new Date(dateStr.replace(/\-/g, '/'));

        let year = date.getFullYear();
        if (this.fields == 'year') {
          year = year - 1;
          this.value = year + '';
        }

        let month = -1;
        if (this.fields == 'month') {
          month = date.getMonth();
          if (month == 0) {
            year = year - 1;
            month = 11;
          } else {
            month = month - 1;
          }
          this.value = year + "-" + xwbUtil.timeFormat(month + 1);
        }

        let day = -1;
        if (this.fields == 'day') {
          var preDate = new Date(date.getTime() - 24*60*60*1000); //前一天
          year = preDate.getFullYear();
          month = preDate.getMonth();
          day = preDate.getDate();
          this.value = year + "-" + xwbUtil.timeFormat(month + 1) + "-" + xwbUtil.timeFormat(day);
        }
        this.$emit('onDateChange', this.value);
      },
      tapNext() {
        let dateStr = this.value;
        let array = this.value.split("-");
        if (array.length == 2) {
          dateStr = dateStr + "-01"
          //IOS new Date 年月创建出来的Date是NULL的，所以追加一个日的时间
        }

        let date = new Date(dateStr.replace(/\-/g, '/'));
        let year = date.getFullYear();
        if (this.fields == 'year') {
          year = year + 1;
          this.value = year + '';
        }

        let month = -1;
        if (this.fields == 'month') {
          month = date.getMonth();
          if (month == 11) {
            year = year + 1;
            month = 0;
          } else {
            month = month + 1;
          }
          this.value = year + "-" + xwbUtil.timeFormat(month + 1);
        }

        let day = -1;
        if (this.fields == 'day') {
          var nextDate = new Date(date.getTime() + 24*60*60*1000); //前一天
          year = nextDate.getFullYear();
          month = nextDate.getMonth();
          day = nextDate.getDate();
          this.value = year + "-" + xwbUtil.timeFormat(month + 1) + "-" + xwbUtil.timeFormat(day);
        }
        this.$emit('onDateChange', this.value);
      },
      bindDateChange(e) {
        this.init(e.detail.value + '');
        this.$emit('onDateChange', this.value);
      },
    };

    onLoad() {

    }

    init(date) {
      let array = date.split('-');
      if (array.length == 1) {
        this.value = array[0];
      } else if (array.length == 2) {
        this.value = array[0] + '-' + xwbUtil.timeFormat(parseInt(array[1]));
      } else {
        this.value = array[0] + '-' + xwbUtil.timeFormat(parseInt(array[1])) + '-' + xwbUtil.timeFormat(parseInt(array[2]));
      }
    }
  }
</script>
<style>
  .date-top {
    border: 1px solid #E1E1E1;
    border-radius: 10rpx;
    padding: 10rpx 30rpx;
    font-size: 30rpx;
    text-align: center;
  }

  .date-top-disable {
    border: 1rpx solid #d9d9d9;
    border-radius: 10rpx;
    padding: 10rpx 30rpx;
    font-size: 30rpx;
    color: #d9d9d9;
    text-align: center;
  }
</style>
