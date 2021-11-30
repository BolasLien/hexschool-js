import {getProducts, getCarts, postCarts, patchCarts, deleteCartsAll, deleteCartsByID, postOrders} from './api.js'

let productList = []
const productWrap = document.querySelector('.productWrap')
const productTemplate = document.querySelector('.productCard')

let carts = []
const tableHead = document.querySelector('.table-head')
const cartItemTemplate = document.querySelector('.cartItem')
const finalTotal = document.querySelector('.finalTotal')
const discardAllBtn = document.querySelector('.discardAllBtn')



// 商品列表初始化
function initProducts() {
  productWrap.innerHTML = ''

  // 取得產品列表
  getProducts()
    .then(res => {
      productList = res.data.products
      productList.forEach(item => {
        productWrap.append(createProductCard(item))
      })
    })
    .catch(err => {
      console.log(err)
    })
}

// 建立產品卡
function createProductCard(item) {
  let product = productTemplate.cloneNode(true)
  const pic = product.querySelector('img')
  const addBtn = product.querySelector('.addCardBtn')
  const title = product.querySelector('h3')
  const originPrice = product.querySelector('.originPrice')
  const nowPrice = product.querySelector('.nowPrice')

  pic.src = item.images
  pic.alt = item.title
  title.textContent = item.title
  originPrice.textContent = 'NT$' + item.origin_price
  nowPrice.textContent = 'NT$' + item.price

  addBtn.addEventListener('click', function (e) {
    e.preventDefault()
    addCarts(item.id, 1)
  })

  return product
}

// 購物車初始化
function initCarts() {
  getCarts()
    .then(res => {
      updateCarts(res.data.carts,res.data.finalTotal)
    })
    .catch(err => {
      console.log(err)
    })

  cartItemTemplate.remove()
}

// 建立購物車的品項
function createCartsItem(item) {
  let cartItem = cartItemTemplate.cloneNode(true)
  const pic = cartItem.querySelector('img')
  const title = cartItem.querySelector('p')
  const singlePrice = cartItem.querySelector('.singlePrice')
  const num = cartItem.querySelector('.num')
  const totalPrice = cartItem.querySelector('.totalPrice')
  const discardBtn = cartItem.querySelector('.discardBtn a')

  pic.src = item.product.images
  pic.alt = item.product.title
  title.textContent = item.product.title
  singlePrice.textContent = `NT$${item.product.price}`
  num.textContent = item.quantity
  totalPrice.textContent = `NT$${item.product.price * item.quantity}`

  discardBtn.addEventListener('click', function (e) {
    e.preventDefault()
    removeCartsItem(item.id)
  })
  return cartItem
}

// 刷新購物車
function updateCarts(newCarts, finalTotalPrice = 0){
  const allCartItem = document.querySelectorAll('.cartItem')
  allCartItem.forEach(item => {
    item.remove()
  })

  carts = newCarts
  carts.forEach(item=>{
    tableHead.insertAdjacentElement('afterend', createCartsItem(item))
  })

  if(carts.length === 0) {
    let cartNull = cartItemTemplate.cloneNode(false)
    cartNull.textContent = "購物車內沒有商品"
    tableHead.insertAdjacentElement('afterend', cartNull)
  }

  finalTotal.textContent = `NT$${finalTotalPrice}`
}

// 加購物車
function addCarts(id, num) {
  // 判斷購物車是否已經有這個東西
  if (carts.some(cartItem => cartItem.product.id === id)) {
    let cartItem = carts.filter(e => e.product.id === id)[0]
    cartItem.quantity++
    patchCarts(cartItem.id, cartItem.quantity)
      .then(res => {
        updateCarts(res.data.carts, res.data.finalTotal)
      })
      .catch(err => {
        console.log(err)
      })
  } else {
    postCarts(id, num)
      .then(res => {
        updateCarts(res.data.carts, res.data.finalTotal)
      })
      .catch(err => {
        console.log(err)
      })
  }
}

// 移除購物車的東西
function removeCartsItem(id = null) {
  // 判斷是否有填 id
  if(id === null) {
    if(carts.length === 0) return //購物車已經沒東西了，不再打api

    deleteCartsAll()
    .then(res => {
      updateCarts(res.data.carts)
    })
    .catch(err => {
      console.log(err)
    })
  } else {
    deleteCartsByID(id)
    .then(res => {
      updateCarts(res.data.carts, res.data.finalTotal)
    })
    .catch(err => {
      console.log(err)
    })
  }
}

discardAllBtn.addEventListener('click', function (e) {
  e.preventDefault()
  removeCartsItem()
})

// 下單功能
// let user = {
//   name: '小名',
//   tel: '02-00220022',
//   email: 'elxam@gmail.com',
//   address: '高雄市三民區有安街55號',
//   payment: 'Apple pay',
// }

// postOrders(user)
//   .then(res => {
//     console.log(res)
//   })
//   .catch(err => {
//     console.log(err)
//   })

function init() {
  initProducts()
  initCarts()
}

init()
