import axios from 'axios'



export function request(config) {
  // 1.创建axios实例
  const instance = axios.create({
    baseURL: 'http://152.136.185.210:8000/api/w6',
    timeout: 5000
  })
  // 2.axios的拦截器
  instance.interceptors.request.use(config => {
    return config
  }, error => {
    // console.log(error);
  })
    // console.log(config);
    // 1.比如config中的某些信息不符合服务器的要求

    // 2.比如每次发送网络请求时，都希望显示一个发送网络请求的图标

    // 3.某些网络请求，比如登录，需要携带一些特殊的信息

  // 2.2 响应拦截
  instance.interceptors.response.use(res => {
    return res.data
  }, error => {
    console.log(error);
  })
  return instance(config)
}









// export function request(config, success, failure) {
//   //1.创建axios的实例
//   const instance = axios.create({
//      baseURL: 'http://123.207.32.32:8000',
//     timeout: 5000
//   })
//   //发送真正的网络请求
//   instance(config)
//     .then(res => {
//       // console.log(res);
//       success(res)
//     })
//     .catch(
//     err => {
//       // console.log(res);
//       failure(res)
//     })
// }

// export function request(config) {
//   return new Promise((resolve, reject) => {
//     //   //1.创建axios的实例
//     const instance = axios.create({
//        baseURL: 'http://123.207.32.32:8000',
//       timeout: 5000
//     })
//     instance(config)
//     .then(res => {
//       resolve(res)
//     })
//     .catch(err => {
//       reject(res)
//     })
//   })
// }
