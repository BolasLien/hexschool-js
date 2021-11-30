import {getOrders, putOrders, deleteOrdersAll, deleteOrdersByID} from './api.js'

let orderList = []
const tableHead = document.querySelector('.orderPage-table > thead')
const orderItemTemplate = document.querySelector('.orderItem')
const discardAllBtn = document.querySelector('.discardAllBtn')

// 訂單列表初始化
function initOrderList() {
  // 拿訂單列表 api
  getOrders()
    .then(res => {
      updateOrderList(res.data.orders)
    })
    .catch(err => {
      console.log(err)
    })
}

// 建立訂單項目
function createOrderItem(item) {
  let orderItem = orderItemTemplate.cloneNode(true)
  const orderId = orderItem.querySelector('.orderId')
  const userName = orderItem.querySelector('.userName')
  const userTel = orderItem.querySelector('.userTel')
  const userAddress = orderItem.querySelector('.userAddress')
  const userEmail = orderItem.querySelector('.userEmail')
  const productTitle = orderItem.querySelector('.productTitle')
  const orderDate = orderItem.querySelector('.orderDate')
  const orderStatusBtn = orderItem.querySelector('.orderStatusBtn')
  const orderDeleteBtn = orderItem.querySelector('.delSingleOrder-Btn')

  orderId.textContent = item.id
  userName.textContent = item.user.name
  userTel.textContent = item.user.tel
  userAddress.textContent = item.user.address
  userEmail.textContent = item.user.email
  productTitle.textContent = item.products[0].title
  orderStatusBtn.textContent = item.paid ? '已處理' : '未處理'

  let date = new Date(item.createdAt * 1000)
  orderDate.textContent = date.toLocaleDateString()

  // 改變這筆訂單狀態
  orderStatusBtn.addEventListener('click', function (e) {
    e.preventDefault()

    // 更新訂單狀態 api
    putOrders(item.id, !item.paid).then((res)=>{
      updateOrderList(res.data.orders)
    }).catch(err=>{
      console.log(err)
    })
  })

  // 刪除這筆訂單
  orderDeleteBtn.addEventListener('click', function (e) {
    e.preventDefault()

    // 刪除訂單 api
    deleteOrdersByID(item.id).then((res)=>{
      updateOrderList(res.data.orders)
    }).catch(err=>{
      console.log(err)
    })
  })

  return orderItem
}

// 刷新訂單列表
function updateOrderList(newOrderList) {
  const allOrderItem = document.querySelectorAll('.orderItem')
  allOrderItem.forEach(item => {
    item.remove()
  })

  orderList = newOrderList
  orderList.forEach(item => {
    let orderItem = createOrderItem(item)
    tableHead.append(orderItem)
  })
}

// 刪除全部訂單
discardAllBtn.addEventListener('click', function (e) {
  e.preventDefault()
  // 刪除全部訂單 api
  deleteOrdersAll()
    .then(res => {
      updateOrderList(res.data.orders)
    })
    .catch(err => {
      console.log(err)
    })
})

initOrderList()
