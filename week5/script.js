let data = [
  {
    id: 0,
    name: '肥宅心碎賞櫻3日',
    imgUrl:
      'https://images.unsplash.com/photo-1522383225653-ed111181a951?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1655&q=80',
    area: '高雄',
    description: '賞櫻花最佳去處。肥宅不得不去的超讚景點！',
    group: 87,
    price: 1400,
    rate: 10,
  },
  {
    id: 1,
    name: '貓空纜車雙程票',
    imgUrl:
      'https://images.unsplash.com/photo-1501393152198-34b240415948?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80',
    area: '台北',
    description: '乘坐以透明強化玻璃為地板的「貓纜之眼」水晶車廂，享受騰雲駕霧遨遊天際之感',
    group: 99,
    price: 240,
    rate: 2,
  },
  {
    id: 2,
    name: '台中谷關溫泉會1日',
    imgUrl:
      'https://images.unsplash.com/photo-1535530992830-e25d07cfa780?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80',
    area: '台中',
    description: '全館客房均提供谷關無色無味之優質碳酸原湯，並取用八仙山之山冷泉供蒞臨貴賓沐浴及飲水使用。',
    group: 20,
    price: 1765,
    rate: 7,
  },
]

// 取得DOM
const inputName = document.querySelector('#ticket-name')
const inputImage = document.querySelector('#ticket-imgUrl')
const inputArea = document.querySelector('#ticket-area')
const inputPrice = document.querySelector('#ticket-price')
const inputGroup = document.querySelector('#ticket-group')
const inputRate = document.querySelector('#ticket-rate')
const inputDescription = document.querySelector('#ticket-description')
const addTicketButton = document.querySelector('.add-ticket-button') // 新增套票按鈕

const cardArea = document.querySelector('.card-area > ul') // card-item 要放的地方
const cardItemTemplate = document.querySelector('.card-item') // card-item 模板
const searchDataNum = document.querySelector('.search-result-num') // 本次搜尋筆數
const searchSelect = document.querySelector('.search-select') // 搜尋選單

// 地區搜尋事件
searchSelect.addEventListener('change', function () {
  getAreaData(this.value)
})

// 新增套票按鈕事件
addTicketButton.addEventListener('click', function (e) {
  e.preventDefault()

  const checkList = [
    inputName.value,
    inputImage.value,
    inputArea.value,
    inputDescription.value,
    inputGroup.value,
    inputPrice.value,
    inputRate.value,
  ]

  // 檢查如果欄位是空的，就不新增東西
  if (checkList.some(item => !item)) {
    alert('欄位輸入不正確，請正確輸入')
    return
  }

  data.push({
    id: data.length + 1,
    name: inputName.value,
    imgUrl: inputImage.value,
    area: inputArea.value,
    description: inputDescription.value,
    group: inputGroup.value,
    price: inputPrice.value,
    rate: inputRate.value,
  })

  init()
})

function init() {
  cardItemTemplate.remove()
  getAreaData('全部地區')
}

function createCardItem(data) {
  // 利用模板創建一個 cardItem
  const cardItem = cardItemTemplate.cloneNode(true)

  // 取得 DOM
  const areaTag = cardItem.querySelector('.area-tag')
  const pic = cardItem.querySelector('.pic')
  const rateTag = cardItem.querySelector('.rate-tag')
  const title = cardItem.querySelector('.title')
  const description = cardItem.querySelector('.description')
  const lastNum = cardItem.querySelector('.last-num')
  const priceNum = cardItem.querySelector('.price-num')

  // 初始化資料
  areaTag.textContent = data.area
  pic.setAttribute('src', data.imgUrl)
  rateTag.textContent = data.rate
  title.textContent = data.name
  description.textContent = data.description
  lastNum.textContent = data.group
  priceNum.textContent = '$' + data.price

  // 把 cardItem 加入列表中
  cardArea.appendChild(cardItem)
}

// 創建全部的資料
function createAllCardItem() {
  data.forEach(item => createCardItem(item))
}

// 清除全部的資料
function removeAllCardItem() {
  document.querySelectorAll('.card-item').forEach(item => item.remove())
}

// 取得地區資料
function getAreaData(area) {
  removeAllCardItem()

  let showCardItemList = []
  if (area === '全部地區') {
    createAllCardItem()
  } else {
    showCardItemList = data.filter(item => item.area === area)
    showCardItemList.forEach(item => createCardItem(item))
  }

  // 本次搜尋幾筆
  searchDataNum.textContent = document.querySelectorAll('.card-item').length
}

init()
