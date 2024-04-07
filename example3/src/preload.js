/************************ 解决插件丢失的方法 ************************/
document.addEventListener("DOMNodeInserted", function(event) {
  if (!!window && !(!!window.$)) {
      window.$ = window.jQuery = require('jquery');
      window.toastr = require('toastr');
      window.MobileDetect = require('mobile-detect');
  }
});