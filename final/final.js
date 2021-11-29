import {getOrders, getProducts, postCarts, postOrders, deleteOrdersByID} from './api.js'

// 取得產品列表
getProducts().then((result) => {
  console.log(result);
}).catch((err) => {
  console.log(err);
});

// 加購物車
postCarts("RtNSe1SsqdWBDggcBVMD",5).then((res)=>{
  console.log(res);
}).catch(err=>{
  console.log(err)
})

// 看訂單
// getOrders().then((res)=>{
//   console.log(res);
// }).catch(err=>{
//   console.log(err)
// })

// 下單功能
let user= {
  "name": '小名',
  "tel": '02-00220022',
  "email": 'elxam@gmail.com',
  "address": '高雄市三民區有安街55號',
  "payment": 'Apple pay'
}
postOrders(user).then((res)=>{
    console.log(res);
  }).catch(err=>{
    console.log(err)
  })

// 刪除訂單功能
// deleteOrdersByID("01cjwzO5EgHojLQyMWEf").then((res)=>{
//   console.log(res);
// }).catch(err=>{
//   console.log(err)
// })