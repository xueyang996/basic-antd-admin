import Taro from '@tarojs/taro'
import { API_ACCOUNT_LOGIN, API_ACCOUNT_USERINFO } from '@src/constants/api'
import { API_FETCH_NUMBER_PHONE  } from '@src/constants/api/recurit'
import { userLogin, userInfoUpdate } from "@src/utils/login/login";

const CODE_SUCCESS = '0'
const CODE_AUTH_EXPIRED = 401
const CODE_SESSION_EXPIRED = '9101'
const CODE_BIND_COMPONY = '8001'
const CODE_VERIFY_FAIL = '9201'
const CODE_NO_BIND_COM = '610001'
const CODE_MONTH_APPLY1 = '30001'
const CODE_MONTH_APPLY2 = '30002'  // 上个月已申请

const ERROR_CODE_DIFF = [
  CODE_AUTH_EXPIRED,
  CODE_SESSION_EXPIRED,
  CODE_VERIFY_FAIL,
  CODE_MONTH_APPLY1,
  CODE_MONTH_APPLY2,
  CODE_NO_BIND_COM,
  CODE_BIND_COMPONY,
]


export function getStorage(key) {
  return Taro.getStorage({ key }).then(res => res.data).catch(() => '')
}
export function setStorage(keyValue) {
  return Taro.setStorage(keyValue).then(res => res.data).catch(() => '')
}

function updateStorage(data = {}) {
  return Promise.all([
    Taro.setStorage({ key: 'token', data: data.token || '' }),
    Taro.setStorage({ key: 'openid', data: data['openid'] || ''})
  ])
}

let __tokenOutDateFlag = false
let isRefreshing = true

let subscribers = [];
function onAccessTokenFetched() {
  subscribers.forEach((callback)=>{
    callback();
  })
  subscribers = [];
}

function addSubscriber(callback) {
  subscribers.push(callback)
}
// let __outDatePagePath = ''
// const __sessoinOutDateFlag = false
/**
 * 简易封装网络请求
 * // NOTE 需要注意 RN 不支持 *StorageSync，此处用 async/await 解决
 * @param {*} options
 */
export default async function fetch(options) {
  const { url, payload, method = 'GET', showToast = true, autoLogin = true, contentType = 'application/json' } = options
  const token = await getStorage('token')
  const header = token ? { 'token': token } : {}
  if (method === 'POST') {
    header['content-type'] = contentType
  }

  return Taro.request({
    url,
    method,
    data: payload,
    header
  }).then(async (res) => {
    // 关闭loading
    Taro.hideLoading()
    // 请求失效时 重新登录
    if(
      (res.statusCode === CODE_AUTH_EXPIRED || res.data.code === CODE_SESSION_EXPIRED)
      && url !== API_ACCOUNT_LOGIN
    ) {
      await updateStorage({})
      // 防止多次 发送登录请求
      if(isRefreshing){
        userLogin({forceUpdate: true, urlFail: url, payloadFail: payload, methodFeail: method})
      }
      // 防止进入死循环
      // __tokenOutDateFlag = true
      isRefreshing = false;
      // let result
      // 获取用户信息 与别的接口不同，失效后，需要重新用最新的code 来获取加密信息
      if(url === API_ACCOUNT_USERINFO) {
      // 这个Promise函数很关键
        const retryOriginalRequest = new Promise((resolve) => {
          addSubscriber(()=> {
            resolve(userInfoUpdate())
          })
        });
        return retryOriginalRequest;
        // result = await userInfoUpdate()
      } else if (url === API_FETCH_NUMBER_PHONE) {
        return Taro.showToast({
          title: '信息已经过期 请重新投递',
          icon: 'none',
          duration: 2000
        })
      } else {
        const retryOriginalRequest = new Promise((resolve) => {
          addSubscriber(()=> {
            resolve(fetch({url, payload, method}))
          })
        });
        return retryOriginalRequest;
        // result = await fetch({url, payload, method})
      }
      // __tokenOutDateFlag = false
      // return result
      // return Promise.reject({ code: res.statusCode })
    }
    const { code, data } = res.data
    if (code !== CODE_SUCCESS) {
      return Promise.reject(res.data)
    }

    if (url === API_ACCOUNT_LOGIN) {
      await updateStorage(data)
      // 登录成功后执行回调
      onAccessTokenFetched();
      isRefreshing = true;
      // const { urlFail, payloadFail, methodFeail } = options
      // if(urlFail) {
      //   return fetch({url: urlFail, payload: payloadFail, method: methodFeail})
      // }
      // if(__tokenOutDateFlag) {
      //   // Taro.reLaunch({ url: `/${__outDatePagePath}` })
      //   __outDatePagePath = ''
      //   __tokenOutDateFlag = false
      // }
      // if(__sessoinOutDateFlag) {
      //   __sessoinOutDateFlag = false
      //   userInfoUpdate()
      // }

    }

    // // XXX 用户信息需展示 uid，但是 uid 是登录接口就返回的，比较蛋疼，暂时糅合在 fetch 中解决
    // if (url === API_ACCOUNT_LOGIN) {
    //   const uid = await getStorage('uid')
    //   return { ...data, uid }
    // }

    return data
  }).catch((err) => {
    // 关闭loading
    Taro.hideLoading()
    // const defaultMsg = err.code === CODE_AUTH_EXPIRED ? '登录失效' : '请求异常'
    const defaultMsg = '小保开小差了，马上就回来～'
    // 以下情况不展示错误信息
    if (showToast && ERROR_CODE_DIFF.indexOf(err.code) === -1) {
      Taro.showToast({
        // title: err && (err.errorMsg || err.message) || defaultMsg,
        title: defaultMsg,
        icon: 'none'
      })
    }
    // if (err.code === CODE_SESSION_EXPIRED && url !== API_ACCOUNT_LOGIN) {
    //   __sessoinOutDateFlag = true
    //   userLogin({forceUpdate: true})
    // }

    return Promise.reject({ message: defaultMsg, ...err })
  })
}
