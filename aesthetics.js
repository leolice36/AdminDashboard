function animateElement(event, animationName, duration = "1s", easing = "ease-in-out", fillMode = "forwards") {
    const element = event.target; // Get the clicked element
  
    if (element.classList.contains("clicked")) {
      element.classList.remove("clicked");
      element.style.animation = "none"; // Reset animation
      setTimeout(() => {
        element.style.animation = `${animationName} ${duration} ${easing} ${fillMode}`;
      }, 10);
    } else {
      element.classList.add("clicked");
      element.style.animation = `${animationName} ${duration} ${easing} ${fillMode}`;
    }
  }


function applyCursorChange(){
    const allAnnounceDivs = document.querySelectorAll('.announce-content .child');
    const displayedAnnounceDivs = Array.from(allAnnounceDivs).filter(div => 
        window.getComputedStyle(div).display === 'block');
    
    const displayedContentDivs = displayedAnnounceDivs.flatMap(div => Array.from(div.querySelectorAll('.content')));
        
    
    displayedContentDivs.forEach(displayedContent => {
    if (displayedContent.scrollHeight > displayedContent.clientHeight){
        console.log({displayedContent})
        displayedContent.parentElement.style.cursor = 'pointer';
        displayedContent.parentElement.classList.add('hover-on');
    }
    });
}