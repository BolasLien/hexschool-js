let data = []

axios
  .get('https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json')
  .then(res => {
    data = res.data.data
    init()
    setChart()
  })
  .catch(err => {
    console.log(err)
  })

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
    group: parseInt(inputGroup.value),
    price: parseInt(inputPrice.value),
    rate: parseInt(inputRate.value),
  })

  searchSelect.value = '全部地區'
  init()
  setChart()
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
  data.forEach(item => {
    createCardItem(item)
  })
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

function setChart() {
  // 地點列表
  let areaList = {}
  data.forEach(item => {
    if (!areaList[item.area]) {
      areaList[item.area] = 0
    }

    areaList[item.area]++
  })

  // 整理成 Chart 用的資料
  let columnsData = []
  Object.keys(areaList).forEach(item => {
    columnsData.push([item, areaList[item]])
  })

  // 匯入 Chart 使用
  c3.generate({
    bindto: "#chart",
    data: {
      columns: columnsData,
      type : 'donut',
      stack: {
        normalize: false
      }
    },
    size: {
      height: 200,
      width: 300,
    },
    donut: {
      title: "套票地區比重",
      width:10,
    },
  });
}
