const apiPath = 'bolas77'
const apiKey = 'AvJJvsSHZuVQVkJ0L2ygHldL0li2'

function getProducts(){
  return axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}/products`)
}

function getCarts(){
  return axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}/carts`)
}

function postCarts(productId, quantity){
  return axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}/carts`, {
    "data": {
      "productId": productId,
      "quantity": quantity
    }
  })
}

function patchCarts(cartId, quantity){
  return axios.patch(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}/carts`,{
    "data": {
      "id": cartId,
      "quantity": quantity
    }
  })
}

function deleteCartsAll(){
  return axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}/carts`)
}

function deleteCartsByID(id){
  return axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}/carts/${id}`)
}

function postOrders(user){
  // {
  //   "data": {
  //     "user": {
  //       "name": "六角學院",
  //       "tel": "07-5313506",
  //       "email": "hexschool@hexschool.com",
  //       "address": "高雄市六角學院路",
  //       "payment": "Apple Pay"
  //     }
  //   }
  // }
  return axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${apiPath}/orders`,{
    "data": {
      "user": {
        "name": user.name,
        "tel": user.tel,
        "email": user.email,
        "address": user.address,
        "payment": user.payment
      }
    }
  })
}

function getOrders(){
  return axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${apiPath}/orders`,{
    headers: {'authorization': apiKey }
  })
}

function putOrders(orderId, isPaid){
  return axios.put(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${apiPath}/orders`,{
    "data": {
      "id": orderId,
      "paid": isPaid
    }
  },{
    headers: {'authorization': apiKey }
  })
}

function deleteOrdersAll(){
  return axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${apiPath}/orders`,{
    headers: {'authorization': apiKey }
  })
}

function deleteOrdersByID(id){
  return axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${apiPath}/orders/${id}`,{
    headers: {'authorization': apiKey }
  })
}

export {
  getProducts,
  getCarts,
  postCarts,
  patchCarts,
  deleteCartsAll,
  deleteCartsByID,
  postOrders,
  getOrders,
  putOrders,
  deleteOrdersAll,
  deleteOrdersByID
}