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
