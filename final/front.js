import {getProducts, getCarts, postCarts, patchCarts, deleteCartsAll, deleteCartsByID, postOrders} from './api.js'

function init() {
  setProducts()
  setCarts()
}



function setProducts() {
  let productList = []
  const productWrap = document.querySelector('.productWrap')
  const productTemplate = document.querySelector('.productCard')
  productWrap.innerHTML = ''

  // 取得產品列表
  getProducts()
    .then(res => {
      productList = res.data.products
      productList.forEach(item => {
        let product = productTemplate.cloneNode(true)
        const pic = product.querySelector('img')
        const addBtn = product.querySelector('.addCardBtn')
        const title = product.querySelector('h3')
        const originPrice = product.querySelector('.originPrice')
        const nowPrice = product.querySelector('.nowPrice')

        pic.src = item.images
        pic.alt = item.title
        title.textContent = item.title
        originPrice.textContent = 'NT$'+item.origin_price
        nowPrice.textContent = 'NT$'+ item.price

        addBtn.addEventListener('click', function (e) {
          e.preventDefault()
          addCarts(item.id, 1)
        })

        productWrap.append(product)
      })
    })
    .catch(err => {
      console.log(err)
    })
}

function setCarts() {
  let carts = []
  const tableHead = document.querySelector('.table-head')
  const cartItemTemplate = document.querySelector('.cartItem')
  const allCartItem = document.querySelectorAll('.cartItem')

  getCarts()
    .then(res => {
      allCartItem.forEach(item => {
        item.remove()
      })
      carts = res.data.carts
      carts.forEach(item => {
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

        tableHead.insertAdjacentElement('afterend', cartItem)
      })
    })
    .catch(err => {
      console.log(err)
    })

  cartItemTemplate.remove()
}

// 加購物車
function addCarts(id, num) {
  postCarts(id, num)
    .then(res => {
      setCarts()
    })
    .catch(err => {
      console.log(err)
    })
}

// 移除購物車的東西
function removeCartsItem(id) {
  deleteCartsByID(id)
    .then(res => {
      setCarts()
    })
    .catch(err => {
      console.log(err)
    })
}

// 移除購物車全部的東西
function removeCartsAllItem() {
  deleteCartsAll()
    .then(res => {
      setCarts()
    })
    .catch(err => {
      console.log(err)
    })
}

const discardAllBtn = document.querySelector('.discardAllBtn')
discardAllBtn.addEventListener('click', function(e){
  e.preventDefault()
  removeCartsAllItem()
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

init()
