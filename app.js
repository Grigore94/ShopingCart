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
          //display cart item
          //show the cart
        })
      
    })
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
}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();

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
    });
});
