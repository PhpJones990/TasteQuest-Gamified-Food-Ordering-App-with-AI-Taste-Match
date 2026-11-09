const gameCanvas = document.getElementById("mainGameCanvas"); 
const ctx = gameCanvas.getContext("2d"); 

gameCanvas.width = gameCanvas.clientWidth; 
gameCanvas.height = gameCanvas.clientHeight; 

ctx.fillStyle = "black"; 
ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height); 

ctx.fillStyle = "white";
ctx.font = "bold 24px Arial";
ctx.textBaseline = "top"; 
ctx.fillText("No Game Yet", 50, 180);

