const track = document.getElementById("image-track"); 

const slide_container = document.getElementById("image-slide-container"); 

slide_container.onmousedown = e => track.dataset.mouseDownAt = e.clientX; 

slide_container.onmouseup = () => 
{
    track.dataset.mouseDownAt = "0"; 
    track.dataset.prevPercentage = track.dataset.percentage; 
}

slide_container.onmousemove = e => 
{
    if (track.dataset.mouseDownAt === "0") return; 

    
    const mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientX; 
    const maxDelta = window.innerWidth / 2; 
    
    const percentage = (mouseDelta / maxDelta) * -100; 
    const nextPercentage = Math.max(Math.min(parseFloat(track.dataset.prevPercentage) + percentage, 0), -100);  

    track.dataset.percentage = nextPercentage; 

    track.animate(
        {
            transform: `translate(${nextPercentage}%, 0%)`
        }, 
        {
            duration: 1200, 
            fill: "forwards"
        }
    ); 

    for (const image of track.getElementsByClassName("image-slide-card")) 
    {
        image.animate(
            {
                objectPosition: `${nextPercentage + 100}% center`
            }, 
            {
                duration: 1200, 
                fill: "forwards"
            }
        );
    }
} 


function attachItemAddEventListener() 
{
    const productCards = document.querySelectorAll(".product-card"); 

productCards.forEach((card) => 
{
    const addBtn = card.querySelector(".add-to-cart-btn"); 
    const quantityController = card.querySelector(".quantity-controller"); 
    const minusBtn = card.querySelector(".minus-btn"); 
    const plusBtn = card.querySelector(".plus-btn"); 
    const qtyCount = card.querySelector(".qty-count"); 

    let count = 0; 

    addBtn.addEventListener("click", () => 
    {
        count = 1; 
        updateDisplay(); 
    }); 

    plusBtn.addEventListener("click", () => 
    {
        count++; 
        updateDisplay(); 
    }); 

    minusBtn.addEventListener("click", () => 
    {
        if (count > 0) 
        {
            count--; 
            updateDisplay(); 
        }
    });

    function updateDisplay() 
    {
        if (count > 0) 
        {
            addBtn.classList.add("hide"); 
            quantityController.classList.remove("hide"); 
            qtyCount.textContent = count; 
        } 
        else 
        {
            quantityController.classList.add("hide"); 
            addBtn.classList.remove("hide"); 
        }
    }
}); 

}

const productContainer = document.getElementById("product-container"); 

function renderAvailableFoods(data) 
{
    const gridHTML = data.map(card => 
        {
            return `<div class="product-card">
                <img src=${card.image} class="product-image"> 
                <h4 class="product-title">${card.name}</h4> 
                <p class="product-price">${card.price}</p> 
                <div class="product-control-container">
                    <button class="add-to-cart-btn">Add</button> 

                    <div class="quantity-controller hide"> 
                        <button class="qty-btn minus-btn">-</button>
                        <span class="qty-count">1</span>
                        <button class="qty-btn plus-btn">+</button>
                    </div>
                </div>
            </div>`    
        }
    ).join(""); 
    productContainer.innerHTML = gridHTML; 

    attachItemAddEventListener(); 
} 

fetch("../data/foods_data/available_foods.json").then(response => 
    {
        if (!response.ok) throw new Error("Cannot Access the Available Foods JSON File!"); 
        return response.json();     
    }
).then(data => renderAvailableFoods(data)).catch(error => console.error("Error: Loading JSON: ", error)); 





// ==========================================
// Cart Page Interactivity
// ==========================================
// Cart Page Functionality - TasteQuest
// Dynamically renders items from cart_items.json and handles interactivity

const fallbackCartItems = [
    {
        "id" : 4, 
        "name" : "Pad Thai", 
        "price" : "$39", 
        "image" : "../data/images/foods/PadThai.png"
    }, 
    {
        "id" : 5, 
        "name" : "Nan Gyi Thoke", 
        "price" : "$99", 
        "image" : "../data/images/foods/NanGyiThoke.png" 
    }, 
    {
        "id" : 6, 
        "name" : "Kimchi Salad", 
        "price" : "$29", 
        "image" : "../data/images/foods/KimchiSalad.png"
    }, 
    {
        "id" : 7, 
        "name" : "Pho", 
        "price" : "$49", 
        "image" : "../data/images/foods/Pho.png"
    }, 
    {
        "id" : 8, 
        "name" : "Ramen", 
        "price" : "$99", 
        "image" : "../data/images/foods/Ramen.png"
    }, 
    {
        "id" : 9, 
        "name" : "Shan Khao Swe", 
        "price" : "$49", 
        "image" : "../data/images/foods/ShanKhaoSwe.png"
    }
];

function initCart() {
    const cartContainer = document.querySelector('.cart-main-container');
    const itemsListContainer = document.getElementById('cart-items-list');
    if (!cartContainer || !itemsListContainer) return;

    function updateCartTotals() {
        const items = itemsListContainer.querySelectorAll('.cart-item');
        let subtotal = 0;

        items.forEach(item => {
            const price = parseFloat(item.dataset.price) || 0;
            const qtyEl = item.querySelector('.cart-qty-count');
            const qty = parseInt(qtyEl.textContent, 10) || 0;
            subtotal += price * qty;
        });

        const subtotalEl = document.getElementById('cart-subtotal');
        const discountEl = document.getElementById('cart-discount');
        const deliveryEl = document.getElementById('cart-delivery');
        const totalEl = document.getElementById('cart-total');
        const emptyMsg = document.querySelector('.cart-empty-message');

        if (items.length === 0 || subtotal === 0) {
            if (subtotalEl) subtotalEl.textContent = '$0';
            if (discountEl) discountEl.textContent = '-$0';
            if (deliveryEl) deliveryEl.textContent = '$0';
            if (totalEl) totalEl.textContent = '$0';
            if (emptyMsg) emptyMsg.style.display = 'block';
            return;
        }

        if (emptyMsg) emptyMsg.style.display = 'none';

        // 20% discount matching reference design
        const discount = Math.round(subtotal * 0.20);
        const deliveryFee = 15;
        const total = subtotal - discount + deliveryFee;

        if (subtotalEl) subtotalEl.textContent = '$' + subtotal;
        if (discountEl) discountEl.textContent = '-$' + discount;
        if (deliveryEl) deliveryEl.textContent = '$' + deliveryFee;
        if (totalEl) totalEl.textContent = '$' + total;
    }

    function attachCartItemEvents(item) {
        const removeBtn = item.querySelector('.cart-item-remove-btn');
        const decreaseBtn = item.querySelector('.cart-qty-decrease');
        const increaseBtn = item.querySelector('.cart-qty-increase');
        const qtyCount = item.querySelector('.cart-qty-count');

        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                item.style.transition = 'all 0.3s ease';
                item.style.opacity = '0';
                item.style.transform = 'translateX(-20px)';
                setTimeout(() => {
                    item.remove();
                    updateCartTotals();
                }, 300);
            });
        }

        if (increaseBtn && qtyCount) {
            increaseBtn.addEventListener('click', () => {
                let count = parseInt(qtyCount.textContent, 10) || 1;
                count++;
                qtyCount.textContent = count;
                updateCartTotals();
            });
        }

        if (decreaseBtn && qtyCount) {
            decreaseBtn.addEventListener('click', () => {
                let count = parseInt(qtyCount.textContent, 10) || 1;
                if (count > 1) {
                    count--;
                    qtyCount.textContent = count;
                    updateCartTotals();
                }
            });
        }
    }

    function renderCartItems(items) {
        if (!items || items.length === 0) {
            itemsListContainer.innerHTML = '';
            updateCartTotals();
            return;
        }

        const itemsHTML = items.map(item => {
            const numericPrice = parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 0;
            return `
            <div class="cart-item" data-id="${item.id}" data-price="${numericPrice}">
                <div class="cart-item-image-wrapper">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-header">
                        <h3 class="cart-item-title">${item.name}</h3>
                        <button class="cart-item-remove-btn" type="button" aria-label="Remove ${item.name}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="cart-trash-icon">
                                <path d="M3 6h18"/>
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                            </svg>
                        </button>
                    </div>
                    <div class="cart-item-footer">
                        <p class="cart-item-price">$${numericPrice}</p>
                        <div class="cart-qty-controller">
                            <button class="cart-qty-btn cart-qty-decrease" type="button" aria-label="Decrease quantity">−</button>
                            <span class="cart-qty-count">1</span>
                            <button class="cart-qty-btn cart-qty-increase" type="button" aria-label="Increase quantity">+</button>
                        </div>
                    </div>
                </div>
            </div>`;
        }).join('');

        itemsListContainer.innerHTML = itemsHTML;

        const renderedItems = itemsListContainer.querySelectorAll('.cart-item');
        renderedItems.forEach(item => attachCartItemEvents(item));

        updateCartTotals();
    }

    // Load items from cart_items.json
    function loadCartData() {
        fetch("../data/foods_data/cart_items.json")
            .then(response => {
                if (!response.ok) throw new Error("Cannot Access cart_items.json file!");
                return response.json();
            })
            .then(data => renderCartItems(data))
            .catch(error => {
                console.warn("Loading via fetch failed, using fallback cart items:", error);
                renderCartItems(fallbackCartItems);
            });
    }

    // Promo code apply button
    const promoBtn = document.getElementById('promo-btn');
    const promoInput = document.getElementById('promo-input');
    if (promoBtn && promoInput) {
        promoBtn.addEventListener('click', () => {
            const code = promoInput.value.trim();
            if (code) {
                alert(`Promo code "${code}" applied successfully!`);
                promoInput.value = '';
            } else {
                alert('Please enter a valid promo code.');
            }
        });
    }

    // Checkout button
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            const totalEl = document.getElementById('cart-total');
            const total = totalEl ? totalEl.textContent : '$0';
            if (total === '$0' || itemsListContainer.querySelectorAll('.cart-item').length === 0) {
                alert('Your cart is empty. Add items to proceed.');
            } else {
                alert(`Proceeding to checkout with Total: ${total}`);
            }
        });
    }

    loadCartData();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCart);
} else {
    initCart();
}
