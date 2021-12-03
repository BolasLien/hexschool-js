import {getOrders, putOrders, deleteOrdersAll, deleteOrdersByID} from './api.js'

let orderList = []
const tableHead = document.querySelector('.orderPage-table > thead')
const orderItemTemplate = document.querySelector('.orderItem')
const discardAllBtn = document.querySelector('.discardAllBtn')

let categoryChartData = [] // 全產品類別營收
let topThreeChartData = [] // 全品項營收
const selectChart = document.querySelector('#select-chart')
const chartTitle = document.querySelector('.chart-title')

// C3.js init
let chart = c3.generate({
  bindto: '#chart',
  data: {
    type: 'pie',
    columns: [],
  },
})

// 初始化
function init() {
  updateOrderList([])

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
    putOrders(item.id, !item.paid)
      .then(res => {
        updateOrderList(res.data.orders)
        alert(`訂單編號：${item.id} 訂單狀態已更新！`)
      })
      .catch(err => {
        console.log(err)
      })
  })

  // 刪除這筆訂單
  orderDeleteBtn.addEventListener('click', function (e) {
    e.preventDefault()

    // 刪除訂單 api
    deleteOrdersByID(item.id)
      .then(res => {
        updateOrderList(res.data.orders)
        alert(`訂單編號：${item.id} 已刪除！`)
      })
      .catch(err => {
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

  // 圖表
  initChart()
}

// 刪除全部訂單
discardAllBtn.addEventListener('click', function (e) {
  e.preventDefault()
  // 刪除全部訂單 api
  deleteOrdersAll()
    .then(res => {
      updateOrderList(res.data.orders)
      alert(`所有訂單皆已刪除！`)
    })
    .catch(err => {
      console.log(err)
    })
})


function initChart() {
  let products = []
  // 展開產品列表
  orderList.forEach(item => {
    item.products.forEach(p => {
      products.push(p)
    })
  })

  // 全產品類別營收
  let categoryData = {}
  products.forEach(item => {
    if (!categoryData[item.category]) {
      categoryData[item.category] = 0
    }

    categoryData[item.category] += item.quantity * item.price
  })

  categoryChartData = formatDataToC3(categoryData)

  // 全品項營收
  let topThreeProduct = {}
  products.sort((a, b) => {
      return b.quantity - a.quantity
    }).forEach((item, index) => {
      if (index > 2) {
        if (!topThreeProduct['其他']) {
          topThreeProduct['其他'] = 0
        }

        topThreeProduct['其他'] += item.quantity * item.price
      } else {
        if (!topThreeProduct[item.title]) {
          topThreeProduct[item.title] = item.quantity * item.price
        }
      }
    })

  topThreeChartData = formatDataToC3(topThreeProduct)

  // 刷新圖表
  updateChart()
}

function unloadDataKeys(unloadData){
  let keys = []
  unloadData.forEach(item=>{
    keys.push(item[0])
  })

  return keys
}

function formatDataToC3(origin) {
  let chartData = []

  Object.keys(origin).forEach(item => {
    if (Array.isArray(origin[item])) {
      chartData.push([item, ...origin[item]])
    } else {
      chartData.push([item, origin[item]])
    }
  })

  return chartData
}

function updateChart() {
  chartTitle.textContent = selectChart.value
  let isTopThree = selectChart.value === '全品項營收比重'
  let chartData = isTopThree ? topThreeChartData : categoryChartData
  let unloadData = isTopThree ? categoryChartData : topThreeChartData

  chart.load({
    columns: chartData,
    unload: unloadDataKeys(unloadData),
  })
}

selectChart.addEventListener('change', updateChart)



init()
