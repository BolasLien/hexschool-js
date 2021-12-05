import {getProducts, getCarts, postCarts, patchCarts, deleteCartsAll, deleteCartsByID, postOrders} from './api.js'

let productList = []
const productWrap = document.querySelector('.productWrap')
const productTemplate = document.querySelector('.productCard')

let carts = []
const tableHead = document.querySelector('.table-head')
const cartItemTemplate = document.querySelector('.cartItem')
const finalTotal = document.querySelector('.finalTotal')
const discardAllBtn = document.querySelector('.discardAllBtn')

const userName = document.querySelector('#customerName')
const userTel = document.querySelector('#customerPhone')
const userEmail = document.querySelector('#customerEmail')
const userAddress = document.querySelector('#customerAddress')
const userPayment = document.querySelector('#tradeWay')
const orderInfoBtn = document.querySelector('.orderInfo-btn')

const productSelect = document.querySelector('.productSelect')

// 商品列表初始化
function initProducts() {
  // productWrap.innerHTML = ''
  document.querySelectorAll('.productCard').forEach(item => {
    item.remove()
  })

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

  // 把這個商品加入購物車
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
      updateCarts(res.data.carts, res.data.finalTotal)
    })
    .catch(err => {
      console.log(err)
    })
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

  // 從購物車移除此項
  discardBtn.addEventListener('click', function (e) {
    e.preventDefault()
    removeCartsItem(item.id)
  })
  return cartItem
}

// 刷新購物車
function updateCarts(newCarts, finalTotalPrice = 0) {
  const allCartItem = document.querySelectorAll('.cartItem')
  allCartItem.forEach(item => {
    item.remove()
  })

  carts = newCarts
  carts.forEach(item => {
    tableHead.insertAdjacentElement('afterend', createCartsItem(item))
  })

  if (carts.length === 0) {
    let cartNull = cartItemTemplate.cloneNode(false)
    cartNull.textContent = '購物車內沒有商品'
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
        alert('成功加入購物車！')
      })
      .catch(err => {
        console.log(err)
      })
  } else {
    postCarts(id, num)
      .then(res => {
        updateCarts(res.data.carts, res.data.finalTotal)
        alert('成功加入購物車！')
      })
      .catch(err => {
        console.log(err)
      })
  }
}

// 移除購物車的東西
function removeCartsItem(id = null) {
  //購物車已經沒東西了，不再打api
  if (carts.length === 0) {
    alert('購物車已經沒東西了')
    return
  }

  // 判斷是否有填 id
  if (id === null) {
    deleteCartsAll()
      .then(res => {
        updateCarts(res.data.carts)
        alert('成功從購物車移除！')
      })
      .catch(err => {
        console.log(err)
      })
  } else {
    deleteCartsByID(id)
      .then(res => {
        updateCarts(res.data.carts, res.data.finalTotal)
        alert('成功從購物車移除！')
      })
      .catch(err => {
        console.log(err)
      })
  }
}

// 下單功能
function placeOrder() {
  if (carts.length === 0) {
    alert('購物車沒有東西唷')
    return
  }

  // 要驗證資料都過了才可以下單
  const form = document.querySelector('.orderInfo-form')
  const constraints = {
    Email: {
      presence: {
        message: '是必填的欄位',
      },
      email: {
        message: '請填入Email的格式',
      },
    },
    姓名: {
      presence: {
        message: '是必填的欄位',
      },
      length: {
        minimum: 2, // 名稱長度要超過 9
        message: '至少要2個字以上',
      },
    },
    寄送地址: {
      presence: {
        message: '是必填的欄位',
      },
    },
    電話: {
      presence: {
        message: '是必填的欄位',
      },
      numericality: {
        onlyInteger: true,
        message: '請填入數字'
      },
      length: {
        minimum: 9, // 名稱長度要超過 9
        message: '至少要9位數',
      },
    },
  }

  let error = validate(form, constraints)
  Object.keys(constraints).forEach(item => {
    let orderInfoMessage = document.querySelector(`[data-message="${item}"]`)
    if(error) {
      orderInfoMessage.textContent = error[item] ? error[item][0] : ''
    } else {
      orderInfoMessage.textContent = ''
    }
  })

  // 如果驗證沒過，就不執行後面的程式
  if(error) return

  let user = {
    name: userName.value,
    tel: userTel.value,
    email: userEmail.value,
    address: userAddress.value,
    payment: userPayment.value,
  }

  postOrders(user)
    .then(res => {
      initCarts()
      alert('成功送出訂單囉！')
    })
    .catch(err => {
      console.log(err)
    })
}

discardAllBtn.addEventListener('click', function (e) {
  e.preventDefault()
  removeCartsItem()
})

orderInfoBtn.addEventListener('click', function (e) {
  e.preventDefault()
  placeOrder()
})

productSelect.addEventListener('change', function (e) {
  e.preventDefault()
  document.querySelectorAll('.productCard').forEach(item => {
    item.remove()
  })

  let filterProduct = productList.filter(item => {
    if (this.value === '全部') {
      return true
    } else {
      return item.category === this.value
    }
  })
  filterProduct.forEach(item => {
    productWrap.append(createProductCard(item))
  })
})

initProducts()
initCarts()