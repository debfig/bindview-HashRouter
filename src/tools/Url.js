/**
 * 获取 query 参数
 * @returns 返回 queryObject
 */
function query() {
  let hash = window.location.hash;
  if (hash.split('?').length == 1) {
    return {}
  } else if (hash.split('?').length > 1) {
    let obj = {}
    hash.split('?')[1].split('&').forEach(i => {
      if (i !== '') {
        obj[i.split('=')[0]] = i.split('=')[1]
      }
    })
    return obj
  }
}

/**
 * 将obj装换为 url string
 * @returns url string
 */
function objectToQuery() {
  let obj = arguments[0];
  let prefix = arguments[1];
  if (typeof obj !== "object") return "";
  const attrs = Object.keys(obj);
  return attrs.reduce((query, attr, index) => {
    // 判断是否是第一层第一个循环
    if (index === 0 && !prefix) query += "?";
    if (typeof obj[attr] === "object") {
      const subPrefix = prefix ? `${prefix}[${attr}]` : attr;
      query += this.objectToQuery(obj[attr], subPrefix);
    } else {
      if (prefix) {
        query += `${prefix}[${attr}]=${obj[attr]}`;
      } else {
        query += `${attr}=${obj[attr]}`;
      }
    }
    // 判断是否是第一层最后一个循环
    if (index !== attrs.length - 1) query += "&";
    return query;
  }, "");
}

/**
 * 路由跳转
 * @param {*} url 路由地址
 * @param {*} obj query数据
 */
function to(url, obj) {
  window.location.href = "#" + url + (obj ? objectToQuery(obj) : '');
}

/**
 * 前进
 */
function go() {
  window.history.forward()
}

/**
 * 后退
 */
function back() {
  window.history.back()
}

/**
 * 转换utf-8
 * @param {*} strUtf8 utf-8 string
 * @returns string
 */
function utf8(szInput) {
  var x, wch, wch1, wch2, uch = "", szRet = "";
  for (x = 0; x < szInput.length; x++) {
    if (szInput.charAt(x) == "%") {
      wch = parseInt(szInput.charAt(++x) + szInput.charAt(++x), 16);
      if (!wch) { break; }
      if (!(wch & 0x80)) {
        wch = wch;
      } else if (!(wch & 0x20)) {
        x++;
        wch1 = parseInt(szInput.charAt(++x) + szInput.charAt(++x), 16);
        wch = (wch & 0x1F) << 6;
        wch1 = wch1 & 0x3F;
        wch = wch + wch1;
      } else {
        x++;
        wch1 = parseInt(szInput.charAt(++x) + szInput.charAt(++x), 16);
        x++;
        wch2 = parseInt(szInput.charAt(++x) + szInput.charAt(++x), 16);
        wch = (wch & 0x0F) << 12;
        wch1 = (wch1 & 0x3F) << 6;
        wch2 = (wch2 & 0x3F);
        wch = wch + wch1 + wch2;
      }
      szRet += String.fromCharCode(wch);
    } else {
      szRet += szInput.charAt(x);
    }
  }
  return (szRet);
}

/**
 * Url对象
 */
export default {
  query,
  to,
  go,
  back,
  utf8
}