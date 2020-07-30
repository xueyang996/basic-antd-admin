
function isIE() {
  if (!!window.ActiveXObject || 'ActiveXObject' in window) {
    return true;
  } else {
    return false;
  }
}

/**
 *
 * @param {string} url 文件地址
 * @param {string} name 文件名称
 */
export function download(url, name) {
  if (isIE()) {
    // IE
    window.open(url, '_blank');
  } else {
    // const aLink = document.createElement('a');
    // document.body.appendChild(aLink);
    // aLink.style.display = 'none';
    // aLink.href = url;
    // aLink.download = name;
    // aLink.click();
    // document.body.removeChild(aLink);

    // 大文件不能保证下载成功

    let a = document.createElement('a'); // 创建a标签
    let e = document.createEvent('MouseEvents'); // 创建鼠标事件对象
    e.initEvent('click', false, false); // 初始化事件对象
    a.href = url; // 设置下载地址
    if (url.indexOf('.pdf') !== -1) {
      a.target = '_blank';
    }
    a.download = name; // 设置下载文件名
    a.dispatchEvent(e);

    return false;

    // 大文件不能保证下载成功; 1s内部保证可以下载完，并且还要考虑pdf 的情况，因为pdf 需要点击打印才会下载
    const removeDelay = 1000;
    const triggerDelay = 100;
    //动态添加iframe，设置src，然后删除
    setTimeout(function() {
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = url;
      document.body.appendChild(iframe);
      if (url.indexOf('.pdf') !== -1) {
        console.log('??????/');
        iframe.onload = function(e) {
          var ifDoc = iframe.contentDocument || {};
          var ifTitle = ifDoc.title || '';

          if (ifTitle.indexOf('404') >= 0 || ifTitle.indexOf('错误') >= 0) {
          } else {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
          }
        };
      }

      setTimeout(function() {
        document.body.removeChild(iframe);
      }, removeDelay);
    }, triggerDelay);
  }
}