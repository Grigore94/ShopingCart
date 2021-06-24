const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const cartDom = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const cartProducts = document.querySelector(".products-center");

let cart = [];
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
    console.log(products);
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
}

class localStorage {
  //static method able to reuse it without reinstancieiting the class
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();

  //gettin all products method
  products.getProducts().then((products) => {
    ui.displayProducts(products);
    Storage.saveProducts(products);
  });
});
