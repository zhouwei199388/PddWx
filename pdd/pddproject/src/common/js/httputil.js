//网络请求封装

function GET(requestHandle, showLoading = true, message = "加载中...") {
  return request("GET", requestHandle, showLoading, message);
}

function PUT(requestHandle, showLoading = true, message = "修改中") {
  return request("PUT", requestHandle, showLoading, message);
}

function POST(requestHandle, showLoading = true, message = "添加中...") {
  return request("POST", requestHandle, showLoading, message);
}

function DELETE(requestHandle, showLoading = true, message = "删除中...") {
  return request("DELETE", requestHandle, showLoading, message);
}

function OPTION(method,requestHandle, showLoading = true, message) {
  return request(method, requestHandle, showLoading, message);
}

function request(method, requestHandle, showLoading = true, message) {
  let url = requestHandle.url;
  let data = requestHandle.data;
  if (showLoading) {
    if (!message) {
      message = "加载中...";
    }
    wx.showLoading({title: message});
  }

  return new Promise((success, fail) => {
      wx.request({
        url: url,
        data: data,
        dataType: 'JSON',
        method: method, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        success: function (res) {
          if (showLoading) {
            wx.hideLoading();
          }
          //res：网络请求返回
          if (res.statusCode == 401) {
            showToast('Token不存在，请刷新重试');
            fail('Token不存在，请刷新重试401');
            return;
          }

          if (res.statusCode == 502) {
            showToast('服务器错误502');
            fail('服务器错误502');
            return;
          }

          // console.log(res);
          //服务端返回处理
          let result = JSON.parse(res.data);
          let header;
          if(result.header==null){
            header = result;
          }else{
            header = result.header;
          }
          // console.log(result);
          if (header.code != 0) {
            showToast(header.msg);
            fail(header.msg);
          } else {
            success(result);
          }
        },
        fail: function () {
          if (showLoading) {
            wx.hideLoading();
          }
          showToast("网络请求失败");
          fail("网络请求失败");
        },
        complete: function () {
        }
      })
    }
  );
}

function showToast(message) {
  wx.showToast({
    title:message,
    icon:'none',
  })
}

module.exports = {
  get: GET,
  put: PUT,
  post: POST,
  delete: DELETE,
  option:OPTION
};
