function showToast(message) {
  wx.showToast({
    title:message,
    icon:'none'
  })
}

function showSuccessToast(message) {
  wx.showToast({
    title: message,
  })
}


function showWarnToast(message) {
  wx.showToast({
    title: message,
    icon: 'none',
    image:'../../images/warn.svg'
  });
}

function showLoading(message) {
  wx.showLoading({
    title: message
  })
}

function hideLoading() {
  wx.hideLoading();
}

function setTitle(title) {
  wx.setNavigationBarTitle({
    title: title
  });
}

function navigateTo(url) {
  wx.navigateTo({
    url: url,
  })
}

function redirectTo(url) {
  wx.redirectTo({
    url: url,
  })
}

//金额格式化，要求传入的单位为分,将返回 12.00格式的金额
function moneyFormat(money) {
  return (money/100).toFixed(2);
}

//判断是否包含特殊字符
function isEmojiCharacter(text){
  if (!text) {
    return false;
  }

  let reg = new RegExp("[~#^$@%&!?%*]", 'g');
  if (text.match(reg)) {
    return true;
  }
  for ( var i = 0; i < text.length; i++) {
    var hs = text.charCodeAt(i);
    if (0xd800 <= hs && hs <= 0xdbff) {
      if (text.length > 1) {
        var ls = text.charCodeAt(i + 1);
        var uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;
        if (0x1d000 <= uc && uc <= 0x1f77f) {
          return true;
        }
      }
    } else if (text.length > 1) {
      var ls = text.charCodeAt(i + 1);
      if (ls == 0x20e3) {
        return true;
      }
    } else {
      if (0x2100 <= hs && hs <= 0x27ff) {
        return true;
      } else if (0x2B05 <= hs && hs <= 0x2b07) {
        return true;
      } else if (0x2934 <= hs && hs <= 0x2935) {
        return true;
      } else if (0x3297 <= hs && hs <= 0x3299) {
        return true;
      } else if (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030
        || hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b
        || hs == 0x2b50) {
        return true;
      }
    }
  }
  return false;
}

//隐藏中间四位
function hidePhone(phone) {
  if (Number(phone) && String(phone).length === 11) {
    let mobile = String(phone)
    let reg = /^(\d{3})\d{4}(\d{4})$/
    return mobile.replace(reg, '$1****$2')
  } else {
    return phone
  }
}

//判断手机号码是否有效
function isPhoneValid(phone) {
  if (phone == null || phone == '') {
    this.showToast("手机号码不能为空");
    return false;
  }

  if (!(/^1[3456789]\d{9}$/.test(phone))) {
    this.showToast("手机号码格式不正确");
    return false;
  }

  return true;
}


function px2rpx(px) {
  return 750*px/wx.getSystemInfoSync().windowWidth;
}

function rpx2px(rpx) {
  return rpx / 750 * wx.getSystemInfoSync().windowWidth;
}

/**
 * 获取指定日期的星期
 * @param dateStr  格式yyyy-HH-dd
 * @returns {string}  周三等
 */
function getWeek(dateStr) {
  const date = new Date(dateStr);
  const week = "日一二三四五六";
  return "周" + week[date.getDay()]
}


/**
 * 获取指定日期的星期
 * @param time  时间戳
 * @returns {string}  周三等
 */
function getWeekByTime(time) {
  const date = new Date(time);
  const week = "日一二三四五六";
  return "周" + week[date.getDay()]
}

function getAge(birthday) {
  const date = new Date(birthday);
  const year = date.getFullYear();
  const nowDate = new Date();
  const nowYear = nowDate.getFullYear();

  let age = nowYear - year;
  if (age < 0) {
    age = 0;
  }
  return age;
}

//获取相册权限
function getAlbumPermission(message) {
  return new Promise((success,fail) => {
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              success();
            },
            fail(e) {
              console.error(e);
              if (e.errMsg == 'authorize:fail auth deny') {
                wx.showModal({
                  content: message,
                  confirmText: '去设置',
                  success(res) {
                    if (res.confirm) {
                      wx.openSetting({
                        success(settingdata) {
                          console.log(settingdata)
                          if (settingdata.authSetting["scope.writePhotosAlbum"]) {
                            success("获取权限成功，再次点击图片保存到相册")
                          } else {
                            fail("获取权限失败");
                          }
                        }
                      })
                    }
                  }
                });
              } else {
                fail(e.errMsg);
              }
            }
          });
        } else {
          success();
        }
      }
    });
  });
}

//获取录音权限
function getRecordPermission(message) {
  return new Promise((success,fail) => {
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.record']) {
          wx.authorize({
            scope: 'scope.record',
            success() {
              success();
            },
            fail(e) {
              console.error(e);
              if (e.errMsg == 'authorize:fail:auth deny') {
                wx.showModal({
                  content: message,
                  confirmText: '去设置',
                  success(res) {
                    if (res.confirm) {
                      wx.openSetting({
                        success(settingdata) {
                          console.log(settingdata)
                          if (settingdata.authSetting["scope.record"]) {
                            success("获取权限成功")
                          } else {
                            fail("获取权限失败");
                          }
                        }
                      })
                    }
                  }
                });
              } else {
                fail(e.errMsg);
              }
            }
          });
        } else {
          success();
        }
      }
    });
  });
}

//时间格式化成 几秒前，几分钟前 什么的
 function getRelativeTime(timestamp) {
  let result = "";
  timestamp = parseInt(timestamp);
  function timeFormat(num) {
    return num < 10 ? '0' + num : num;
  }
  var realDate = new Date(timestamp);
  var nowDate = new Date();
  var nowTime = nowDate.getTime();
  var duration = nowTime - timestamp;
  if (duration < 15000) {
    //小于15s，就显示刚刚
    result = "刚刚";
  } else if(duration < 30000) {
    result = parseInt(duration/1000) + "秒前";
  } else if(duration < 60000) {
    result = "半分钟前";
  } else if(duration < 60 * 60 * 1000) {
    result = parseInt(duration / (60 * 1000)) + "分钟前";
  } else {
    //判断是不是今天的日期
    var todayDate = new Date();
    todayDate.setHours(0);
    todayDate.setMinutes(0);
    todayDate.setSeconds(0);
    let todayTimeStart = todayDate.getTime();
    todayDate.setHours(23);
    todayDate.setMinutes(59);
    todayDate.setSeconds(59);
    let todayTimeEnd = todayDate.getTime();

    //判断是不是昨天的
    let yesterdayTimeStart = todayTimeStart - 24 * 60 * 60 * 1000;
    let yesterdayTimeEnd = todayTimeEnd - 24 * 60 * 60 * 1000;
    if(timestamp <= todayTimeEnd && timestamp > todayTimeStart) {
      result = "今天" + timeFormat(realDate.getHours()) + ":" + timeFormat(realDate.getMinutes());
    } else if (timestamp <= yesterdayTimeEnd && timestamp > yesterdayTimeStart) {
      result = "昨天" + timeFormat(realDate.getHours()) + ":" + timeFormat(realDate.getMinutes());
    } else {
      //不是今天，判断是不是今年
      let nowYear = nowDate.getFullYear();
      let year = realDate.getFullYear();
      if (nowYear == year) {
        //今年
        result = timeFormat(realDate.getMonth() + 1) + "-" + timeFormat(realDate.getDate());
      } else {
        result = timeFormat(realDate.getFullYear()) + "-" + timeFormat(realDate.getMonth() + 1) + "-" + timeFormat(realDate.getDate());
      }
    }
  }
  return result;
}

function timeFormat(num) {
  return num < 10 ? '0' + num : num;
}

//日期格式化：参数1：时间戳；参数2：格式化方法：y-M-d，默认：y-M-d h:m:s
function dateFormat(timestamp, format) {
  if (!format) {
    format = "y-M-d h:m:s";
  }
  timestamp = parseInt(timestamp);
  const realDate = new Date(timestamp);
  const year = realDate.getFullYear();
  const month = timeFormat(realDate.getMonth() + 1);
  const day = timeFormat(realDate.getDate());

  const hour = timeFormat(realDate.getHours());
  const minite = timeFormat(realDate.getMinutes());
  const second = timeFormat(realDate.getSeconds());

  return format.replace(/y|M|d|h|m|s/ig, function (matches) {
    return ({
      y: year,
      M: month,
      d: day,
      h: hour,
      m: minite,
      s: second
    })[matches];
  });
}


/**
 * 获取每周的开始结束日期
 * @returns {any[]}
 */
function getWeekDate(time) {
  let weekDate = [];
  const date = new Date();
  date.setTime(time);
  const strTime = date.getTime();
  let day = date.getDay();
  day = day === 0 ? 7 : day;
  let startTime = strTime - (1000 * 60 * 60 * 24) * (day - 1);
  let endTime = strTime + (1000 * 60 * 60 * 24) * (7 - day);

  console.log(startTime + "  " + endTime);
  const startDate = new Date();
  startDate.setTime(startTime);
  const endDate = new Date();
  endDate.setTime(endTime);
  weekDate[0] = dateFormat(startTime,"y-M-d");
  weekDate[1] = dateFormat(endTime,"y-M-d");
  return weekDate;
};

function isToday(timestamp) {
  //判断是不是今天的日期
  var todayDate = new Date();
  todayDate.setHours(0);
  todayDate.setMinutes(0);
  todayDate.setSeconds(0);
  let todayTimeStart = todayDate.getTime();
  todayDate.setHours(23);
  todayDate.setMinutes(59);
  todayDate.setSeconds(59);
  let todayTimeEnd = todayDate.getTime();
  if(timestamp <= todayTimeEnd && timestamp > todayTimeStart) {
    return true;
  }
  return false;
}
function getPrePage(){
  let pages = getCurrentPages();
  let prePage = pages[pages.length - 2];
  return prePage;
}
function getPage(pageIndex){
  let pages = getCurrentPages();
  const page = pages[pages.length - pageIndex];
  return page;
}

module.exports = {
  showToast: showToast,
  showSuccessToast: showSuccessToast,
  showWarnToast: showWarnToast,
  showLoading: showLoading,
  hideLoading: hideLoading,
  setTitle: setTitle,
  moneyFormat: moneyFormat,
  navigateTo:navigateTo,
  redirectTo:redirectTo,
  isEmojiCharacter:isEmojiCharacter,
  hidePhone:hidePhone,
  isPhoneValid:isPhoneValid,
  getWeek:getWeek,
  getWeekByTime:getWeekByTime,
  getAge:getAge,
  getAlbumPermission:getAlbumPermission,
  getRecordPermission:getRecordPermission,
  getRelativeTime:getRelativeTime,
  px2rpx:px2rpx,
  rpx2px:rpx2px,
  timeFormat:timeFormat,
  dateFormat:dateFormat,
  isToday:isToday,
  getWeekDate:getWeekDate,
  getPrePage:getPrePage,
  getPage:getPage,
};
