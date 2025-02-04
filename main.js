const showMenu = (toggleId, gridID, sidebarID) => {
    const toggle = document.getElementById(toggleId);
    const gridContainer = document.getElementById(gridID);
    const sidebar = document.getElementById(sidebarID);
    
    if(toggle) {
        toggle.addEventListener('click', () => {
            gridContainer.classList.toggle('show')
            sidebar.classList.toggle('expand');
            console.log(sidebar.classList);
            toggle.classList.toggle('rotate');
        })
    }
}

// showMenu('red', 'sidebar', 'bodybody');
showMenu('red', 'grid-container', 'sidebar');


const input = document.querySelector('.search-input');
const clearButton = document.querySelector('.clear-button');

input.addEventListener('input', function() {
    clearButton.style.display = this.value ? 'block' : 'none';
});

clearButton.addEventListener('click', function() {
    input.value = '';
    this.style.display = 'none';
});



const displayLimit = 24; // Number of characters to display in the input

input.addEventListener('input', () => {
  const fullValue = input.value; // Get the full input value
  const truncatedValue = fullValue.slice(-displayLimit); // Display only the last N characters
  input.value = truncatedValue; // Update the input's visible value
});


function adjustFlexibleDivs(containerSelector, fixedDivSelector, flexibleDivSelector) {
    const container = document.querySelector(containerSelector);
    
    // Get the total height of the container
    const containerHeight = container.offsetHeight;
    // Get all the fixed divs and calculate their total height
    const fixedDivs = document.querySelectorAll(fixedDivSelector);
    let totalFixedHeight = 0;
    fixedDivs.forEach(div => {
      totalFixedHeight += div.offsetHeight;
    });
    
    // Calculate the remaining height for the flexible divs
    const remainingHeight = containerHeight - totalFixedHeight;
    // Get all flexible divs (it will work for any number of flexible divs)
    const flexibleDivs = document.querySelectorAll(flexibleDivSelector);
    // Calculate the height for each flexible div (split equally)
    const flexibleHeight = remainingHeight / flexibleDivs.length;
    
    // Apply the calculated height to each flexible div
    flexibleDivs.forEach(div => {
      div.style.height = `${flexibleHeight}px`;
    });
}
  
// Adjust heights on initial load and on window resize
adjustFlexibleDivs('.right', '.right > .nav-buttons, .right > .horizontal-divider', '.right > .announcements, .right > .trending');
 

async function fetchTexts() {
    const response = await fetch('announce.json');
    return await response.json();
}

async function fetchProfiles() {
    const response = await fetch('trend.json');
    return await response.json();
}

function createAnnounceContent({ title, content }) {
    const div = document.createElement('div');
    div.className = 'child';

    const titleDiv = document.createElement('div');
    titleDiv.className = 'title';
    titleDiv.textContent = title;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'content';
    contentDiv.textContent = content;

    div.appendChild(titleDiv);
    div.appendChild(contentDiv);

    return div;
}

function createTrendContent({ profileName, imgSrc }) {
    const div = document.createElement('div');
    div.className = 'trendProfile';

    // Create the image element and set its source
    const img = document.createElement('img');
    img.src = imgSrc; // Set the image source
    img.alt = 'Profile Image'; // Optionally add an alt attribute for accessibility

    // Create the profile name div
    const contentDiv = document.createElement('div');
    contentDiv.className = 'profileName';
    contentDiv.textContent = profileName;

    // Append the image before the profile name div
    div.appendChild(img);
    div.appendChild(contentDiv);

    return div;
}

// Generalized function to append any element (img, div, etc.)
function appendToParent(element, parentSelector) {
    const parent = document.querySelector(parentSelector);
    if (parent) {
        parent.appendChild(element);
    } else {
        console.error('Parent element not found');
    }
}


async function generateDivs(min = 5, max = 10, createDiv, fetchData, parentSelector) {
  try {
      const data = await fetchData();

      const numObjects = Math.floor(Math.random() * (max - min + 1)) + min;
      const selectedData = data
          .sort(() => 0.5 - Math.random())
          .slice(0, numObjects);

      selectedData.forEach(item => {
          const div = createDiv(item);  // Pass the item to createDiv
          appendToParent(div, parentSelector);  // Append the created div (or img) to the parent
      });
  } catch (error) {
      console.error('Error fetching data:', error);
      throw error; // Rethrow the error to be caught in the main try-catch block
  }
}



function showFullyVisibleChildren(parentSelector, delay) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const parent = document.querySelector(parentSelector);
            const children = parent.querySelectorAll(`${parentSelector} > *`);

            children.forEach(child => {
                const childRect = child.getBoundingClientRect();
                const parentRect = parent.getBoundingClientRect();

                if (childRect.top >= parentRect.top && childRect.bottom <= parentRect.bottom) {
                    child.style.display = 'block';
                } else {
                    child.style.display = 'none';
                }
            });

            resolve();
        }, delay);
    });
}

function removeBorderFromLastVisibleChild(selector, delay) {
    return new Promise((resolve) => {
        const parentDiv = document.querySelector(selector);
        
        if (!parentDiv) {
            console.error('Parent div not found!');
            resolve();
            return;
        }
      
        setTimeout(() => {
            const children = parentDiv.children;
      
            for (let i = children.length - 1; i >= 0; i--) {
                const child = children[i];
        
                if (child.offsetWidth > 0 && child.offsetHeight > 0 && window.getComputedStyle(child).visibility !== 'hidden') {
                    child.style.border = 'none';
                    break;
                }
            }

            resolve();
        }, delay);
    });
}



document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.querySelector(".search-input");

  searchInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && searchInput.value.trim() !== "") {
      const query = encodeURIComponent(searchInput.value);
      window.open(`https://www.google.com/search?q=${query}`, "_blank"); // Open in new tab
      searchInput.value = ""; // Clear input field
    }
  });
});


function toggleDarkMode() {
  const containerChildren = document.querySelectorAll('.container, input');
  
  // Loop through all direct children of .container
  containerChildren.forEach(child => {
      child.classList.toggle("dark-mode");
  });
  
  const button = document.getElementById("modeToggle");

  // if (Array.from(containerChildren).some(child => child.classList.contains("dark-mode"))) {
  //     button.textContent = "Light Mode";
  // } else {
  //     button.textContent = "Dark Mode";
  // }
}

const menuItems = document.querySelectorAll('.menu-item');
      const contentDiv = document.querySelector('.projects');
      const parentTarget = document.querySelector('.center-section');
      const childTarget = document.querySelector('#center-divider');
      let currentDynamicContent = null;

      menuItems.forEach(item => {
          item.addEventListener('click', function() {
              menuItems.forEach(i => i.classList.remove('active'));
              this.classList.add('active');
              
              const target = this.getAttribute('data-target');
              if (target === 'home') {
                  contentDiv.classList.remove('hidden');
                  if (currentDynamicContent) {
                      currentDynamicContent.remove();
                      currentDynamicContent = null;
                  }
              } else {
                  contentDiv.classList.add('hidden');
                  if (currentDynamicContent) {
                      currentDynamicContent.remove();
                  }
                  currentDynamicContent = document.createElement('div');
                  currentDynamicContent.classList.add('dynamic-content');
                  // currentDynamicContent.innerHTML = `<h1>${target.charAt(0).toUpperCase() + target.slice(1)}</h1><p>Content for ${target}</p>`;
                    fetch('menuContent.json')
                      .then(response => response.json())
                      .then(data => {
                        // Get the content for the target from the JSON
                        const content = data[target];

                        // Dynamically insert the new content: header, paragraph, and image
                        currentDynamicContent.innerHTML = `
                          <div class="content-container">
                            <div>${content.header}</div>
                            <p>${content.paragraph}</p>
                            <img src="${content.image}" alt="${content.header}">
                          </div>
                        `;
                      })
                      .catch(error => console.error('Error loading JSON:', error));
                                  
                  parentTarget.insertBefore(currentDynamicContent, childTarget);
              }
          });
      });


function expandAnnounce() {
  return new Promise((resolve) => {
      const contentWrappers = document.querySelectorAll(".announce-content .child");
      console.log({contentWrappers});
      contentWrappers.forEach((wrapper) => {
          wrapper.addEventListener("click", function () {
              const content = this.querySelector(".content");
              console.log({content});
              const isExpanded = content.classList.contains("expanded");

              // Collapse all content except the clicked one
              contentWrappers.forEach((w) => {
                  if (w !== this) {
                      w.querySelector(".content").classList.remove("expanded");
                  }
              });

              // Toggle the clicked content
              content.classList.toggle("expanded");
          });
      });
      resolve(); // Resolve the promise after adding all listeners
  });
}


document.addEventListener('DOMContentLoaded', async () => {
  try {
      // First, generate divs for announcements
      await generateDivs(5, 10, createAnnounceContent, fetchTexts, '.announce-content');
      
      // After announcements are generated, show fully visible children
      await showFullyVisibleChildren('.announce-content', 0);
      
      // After showing fully visible children, remove border from last visible child
      await removeBorderFromLastVisibleChild('.announce-content', 0);
      
      // Generate divs for profiles
      await generateDivs(8, 8, createTrendContent, fetchProfiles, '.trend-content');
      
      // Add click event listeners to announce-content children
      await expandAnnounce();

  } catch (error) {
      console.error('Error in sequence:', error);
  }
});