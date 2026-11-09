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



