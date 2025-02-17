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

// New: Added configuration object for easy customization
const config = {
  numFragments: 6,
  fragmentHeight: 3,
  fragmentWidth: 10,
  fragmentBorderRadius: 6,
  fragmentBorderRadiusUnit: "px",
  explosionRadius: 25,
  animationDuration: 250,
  timingFunction: 'cubic-bezier(0, 0, 0, 0.98)',
  safetyTimeout: 1000
};

// Modified: Improved createBurstDivs function
function createBurstDivs() {
  const container = document.createElement('div');
  container.classList.add('animation-container');
  
  const burst = document.createElement('div');
  burst.classList.add('burst');
  
  for (let i = 0; i < config.numFragments; i++) {
    const fragment = document.createElement('div');
    fragment.classList.add('fragment');
    fragment.style.setProperty('--rotation', `${360 / config.numFragments * i}deg`);
    burst.appendChild(fragment);
  }
  
  container.appendChild(burst);
  return container;
}

// New: Added cleanup function
function cleanupAnimation(container) {
  if (container && container.parentElement) {
    container.parentElement.removeChild(container);
  }
}

// Modified: Improved clickEffect function
function clickEffect(e) {
  // New: Check if there's an existing animation
  const existingContainer = document.querySelector('.animation-container');
  if (existingContainer) {
    cleanupAnimation(existingContainer);
  }

  const container = createBurstDivs();
  document.body.appendChild(container);

  // Modified: Use pageX and pageY, and center the burst
  container.style.top = `${e.pageY - config.fragmentHeight / 2}px`;
  container.style.left = `${e.pageX - config.fragmentWidth / 2}px`;

  const fragment = container.querySelector('.fragment');
  
  // New: Use Promise for better control flow
  const animationEndPromise = new Promise(resolve => {
    fragment.addEventListener('animationend', resolve, { once: true });
  });

  // New: Race between animation completion and safety timeout
  Promise.race([
    animationEndPromise,
    new Promise(resolve => setTimeout(resolve, config.safetyTimeout))
  ]).then(() => cleanupAnimation(container));
}

// New: Debounce function to limit click event firing
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Modified: Use debounced click handler
document.addEventListener('click', debounce(clickEffect, 50));

// New: Add styles programmatically
const style = document.createElement('style');
style.textContent = `
  .animation-container {
    position: fixed;
    z-index: 999;
    pointer-events: none;
  }

  .burst {
    position: relative;
  }

  .burst .fragment {
    position: absolute;
    background: #000000;
    width: ${config.fragmentHeight}px;
    height: ${config.fragmentWidth}px;
    border-radius: ${config.fragmentBorderRadius}${config.fragmentBorderRadiusUnit} ;
    animation: move ${config.animationDuration}ms ${config.timingFunction};
  }

  @keyframes move {
    0% {
      transform: rotate(var(--rotation)) translate(0, 0);
    }
    100% {
      transform: rotate(var(--rotation)) translate(0, ${-config.explosionRadius}px);
    }
  }
`;
document.head.appendChild(style);

console.log('Burst animation script loaded. Click anywhere to see the effect!');



function initializeArrowMenu() {
  const sidebar = document.querySelector('.sidebar');


  const arrow = document.getElementById('red');
  const topRect = document.querySelector('.tog-div-top');

  const bottomRect = document.querySelector('.tog-div-bot');
  const menu = document.getElementById('menu');
  const menuItems = document.querySelectorAll('.menu-item');
  const arrowHeight = arrow.offsetHeight;
  const toggleContainer = document.querySelector('.toggle-container');
  const viewportHeight = toggleContainer.getBoundingClientRect().height;
  console.log({viewportHeight})
  let snapping = false;

  

  function updatePositions(y) {
    if (!sidebar.classList.contains('expand')){
      return
    }
    const constrainedY = Math.max(48, Math.min(y-84, viewportHeight- 48 - arrowHeight));
    arrow.style.top = `${constrainedY}px`;
    topRect.style.height = `${constrainedY - 40}px`;
    bottomRect.style.top = `${constrainedY + arrowHeight +20}px`;
    bottomRect.style.height = `${viewportHeight - (constrainedY + arrowHeight + 40)}px`;
    
  }

  function handleMenuMouseMove(event) {
    if (snapping) return;
    updatePositions(event.clientY);
  }

  function handleMenuItemMouseMove(event, item) {
    const itemRect = item.getBoundingClientRect();
    const itemHeight = itemRect.height;
    const middlepartHeight = itemHeight * 0.9;
    const middleStart = itemRect.top + (itemHeight / 2) - (middlepartHeight / 2);
    const middleEnd = middleStart + middlepartHeight;
    const mouseY = event.clientY;

    if (mouseY >= middleStart && mouseY <= middleEnd) {
      const itemCenter = itemRect.top + itemRect.height / 2;
      snapping = true;
      updatePositions(itemCenter - arrow.offsetHeight / 2 + 12);
    } else {
      snapping = false;
    }
  }

  function handleMenuMouseLeave() {
    snapping = false;
    setArrowToCenter();
  }

  function setArrowToCenter() {
    const arrowPosition = (menu.offsetHeight / 2) - (arrowHeight / 2);
    const constrainedY = Math.max(40, Math.min(arrowPosition-84, viewportHeight- 40 - arrowHeight - 84));
    arrow.style.top = `${constrainedY}px`;
    topRect.style.height = `${constrainedY - 40}px`;
    bottomRect.style.top = `${constrainedY + arrowHeight + 20}px`;
    bottomRect.style.height = `${viewportHeight - (constrainedY + arrowHeight + 40)}px`;
    ;
  }

  menu.addEventListener('mousemove', handleMenuMouseMove);
  menu.addEventListener('mouseleave', handleMenuMouseLeave);

  menuItems.forEach((item) => {
    item.addEventListener('mousemove', (event) => handleMenuItemMouseMove(event, item));
    item.addEventListener('mouseleave', () => { snapping = false; });
  });

  // Set initial arrow position
  setArrowToCenter();
}

// Call the function to initialize the arrow menu behavior
// initializeArrowMenu();