const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const cartDom = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const cartProducts = document.querySelector(".products-center");

let cart = [];
let buttonsDOM = [];
class Products {
  async getProducts() {
    try {
      let result = await fetch("products.json");
      let data = await result.json();
      let products = data.items;
      products = products.map((item) => {
        const { title, price } = item.fields;
        const { id } = item.sys;
        const image = item.fields.image.fields.file.url;
        return { title, price, id, image };
      });
      return products;
    } catch (error) {
      console.log(error);
    }
  }
}

class UI {
  displayProducts(products) {
   
    let result = "";
    products.forEach((product) => {
      result += `
        <article class="product">
<div class="img-container">
    <img src=${product.image} alt="product" class="product-img">
<button class="bag-btn" data-id=${product.id}>
    <i class="fa fa-shopping-cart">add to cart</i>
</button>
</div>
<h3>${product.title}</h3>
<h4>$${product.price}</h4>
        </article>
        `;
    });
    //setting up cart items and inserting them with cartProducts innerHtml property for the element
    cartProducts.innerHTML = result;
  }
  //getting bag button fn bc we cant use only nodelist we will get nothing before even products are loaded
  getBagButton() {
    const buttons = [...document.querySelectorAll(".bag-btn")];
    console.log(buttons);
    buttonsDOM = buttons;
    buttons.forEach(button => {
      let id = button.dataset.id;
      console.log(id);
      //find method for getting machind items from cart by id
      let inCart = cart.find(item => item.id === id);
      if(inCart) {
        button.innerText = "In Cart";
        button.disabled = true;
      }
        button.addEventListener("click", (event) => {
          event.target.innerText = "In Cart";
          event.target.disabled = true;
          //getting product
          let cartItem = {...LocalStorage.getProduct(id), amount:1}
          console.log(cartItem);
          //add product to the cart
          cart = [...cart, cartItem];
          //save item to localstorage
          LocalStorage.saveCart(cart);
          //set cart values
          this.setCartValue(cart)
          //display cart item
          this.addCartItem(cartItem);
          //show the cart
          this.showCart()
        })  
      
    })
  }
  setCartValue(cart) {
    let temptTotal = 0;
    let itemsTotal = 0;
    cart.map(item => {
      temptTotal += item.price * item.amount;
      itemsTotal += item.amount
    })
    //updaiting the values of cart total and cart items toFixed method to convert to string and keep only two decimals
    cartTotal.innerText = parseFloat(temptTotal.toFixed(2));
    cartItems.innerText = itemsTotal;
    console.log(cartItems, cartTotal)
  }
  addCartItem(item) {
    const div = document.createElement("div")
    div.classList.add(".cart-item")
    div.innerHTML = `
    <img src=${item.image} alt="product"/>
    <div>
        <h4>${item.price}</h4>
        <h5>$${item.price}</h5>
        <span class="remove-item" data-id=${item.id}>remove</span>
    </div>
    <div>
        <i class="fa fa-chevron-up" data-id=${item.id}></i>
        <p class="item-amount">${item.amount}</p>
        <i class="fa fa-chevron-down" data-id=${item.id}></i>
    </div>
    `
    cartContent.appendChild(div);
  }
  showCart() {
    cartOverlay.classList.add("transparentBcg");
    cartDom.classList.add("showCart");
  }
  hideCart() {
    cartOverlay.classList.remove("transparentBcg");
    cartDom.classList.remove("showCart");
  }
  setApp() {
  cart = LocalStorage.getCart();
  this.setCartValue(cart);
  this.populateCart(cart);
  cartBtn.addEventListener("click", this.showCart);
  closeCartBtn.addEventListener("click", this.hideCart)
  }
  populateCart(cart){
    cart.forEach(item => {
      this.addCartItem(item)
    });
  }
  cartLogic(){
    //this will point to the ui class //clear cart btn
    closeCartBtn.addEventListener("click", () => {
      this.clearCart();
    });
    //up down functionality
  }
  clearCart() {
let cartItems = cart.map(item => item.id);
cartItems.forEach(id => this.removeItem(id))
  }
  removeItem(id){
cart = cart.filter(item => item.id !== id);
this.setCartValue(cart);
LocalStorage.saveCart(cart);
let button = this.getSingleBtn(id);
button.disebled = false;
button.innerHTML = `<i class="fa fa-sopping-cart></i>add to cart`;
  }
  getSingleBtn() {
    return buttonsDOM.find(button => button.dataset.id === id)
  }
}

class LocalStorage {
  //static method able to reuse it without reinstancieiting the class
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
    console.log(products);
  }
  //another satatic method to reuse later in getBagButton method
  static getProduct(id) {
    //since store it as string i need to parse it 
    let products = JSON.parse(localStorage.getItem("products"));
    //geting the item by maching id
    return products.find(product => product.id === id)
  }
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  static getCart() {
    return localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [] 
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();
  //set the aplication
  ui.setApp();

  //gettin all products//buttons method
  products
    .getProducts()
    .then((products) => {
      ui.displayProducts(products)
      LocalStorage.saveProducts(products)
    })
    .then(() => {
      //calling getbagbutton methot after loading all the products
      ui.getBagButton();
      ui.cartLogic();
    });
});
