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
    const img = document.createElement('div');
    // img.src = imgSrc; // Set the image source
    // img.alt = 'Profile Image'; // Optionally add an alt attribute for accessibility
    img.style.width = "34px";
    img.style.height = "34px";
    img.style.backgroundImage = `url('${imgSrc}')`;
    img.style.backgroundSize = "cover";
    img.style.backgroundPosition = "center";



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

// generateDivs(8, 8, createTrendContent, fetchProfiles, '.trend-content')

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
  const containerChildren = document.querySelectorAll(
    '.container, input, .container .header #notif img, .projects-content .content-card, .sidebar > .toggle-container img');
  
  const buttonImage = document.querySelector('.container .header #notif img');
  const headLogo = document.querySelector(".container .header #head-logo .svg-container");
  const svg = document.querySelector(".container .header #head-logo .svg-container svg");
  console.log(svg);
  const lightSvg = `
        <svg class="svg-element" width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M10.7442 21C10.7442 15.3359 15.3359 10.7442 21 10.7442C26.6641 10.7442 31.2558 15.3359 31.2558 21C31.2558 22.2359 31.0378 23.4177 30.6395 24.511C30.5704 24.7006 30.4343 24.9048 30.2171 25.1052L30.0597 25.2503C29.4722 25.7924 28.5899 25.8619 27.9247 25.4184C27.4429 25.0972 27.1535 24.5564 27.1535 23.9774V21C27.1535 17.6015 24.3985 14.8465 21 14.8465C17.6015 14.8465 14.8465 17.6015 14.8465 21C14.8465 24.3985 17.6015 27.1535 21 27.1535C22.3709 27.1535 23.637 26.7052 24.6599 25.9473C25.0158 26.7107 25.5773 27.3752 26.2993 27.8565C28.0899 29.0502 30.4649 28.8633 32.0467 27.404L32.204 27.2589C32.6925 26.8082 33.1331 26.2267 33.3927 25.5141C33.9065 24.104 34.186 22.583 34.186 21C34.186 13.7175 28.2825 7.81395 21 7.81395C13.7175 7.81395 7.81395 13.7175 7.81395 21C7.81395 28.2825 13.7175 34.186 21 34.186C21.8092 34.186 22.4651 33.5301 22.4651 32.7209C22.4651 31.9118 21.8092 31.2558 21 31.2558C15.3359 31.2558 10.7442 26.6641 10.7442 21ZM21 17.7767C22.7802 17.7767 24.2233 19.2198 24.2233 21C24.2233 22.7802 22.7802 24.2233 21 24.2233C19.2198 24.2233 17.7767 22.7802 17.7767 21C17.7767 19.2198 19.2198 17.7767 21 17.7767Z" fill="#5C008A"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M21 0C9.40202 0 0 9.40202 0 21C0 32.598 9.40202 42 21 42C32.598 42 42 32.598 42 21C42 9.40202 32.598 0 21 0ZM2.93023 21C2.93023 11.0203 11.0203 2.93023 21 2.93023C30.9797 2.93023 39.0698 11.0203 39.0698 21C39.0698 30.9797 30.9797 39.0698 21 39.0698C11.0203 39.0698 2.93023 30.9797 2.93023 21Z" fill="#FFD30F"/>
        </svg>
      `;
  
  const darkSvg = `
            <svg class="svg-element" width="142" height="142" viewBox="0 0 142 142" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g filter="url(#filter0_ddd_198_694)">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M60.5581 71.186C60.5581 65.5219 65.1498 60.9302 70.8139 60.9302C76.4781 60.9302 81.0698 65.5219 81.0698 71.186C81.0698 72.422 80.8518 73.6037 80.4535 74.697C80.3844 74.8867 80.2483 75.0908 80.031 75.2912L79.8737 75.4364C79.2861 75.9785 78.4038 76.0479 77.7387 75.6045C77.2568 75.2833 76.9674 74.7425 76.9674 74.1634V71.186C76.9674 67.7876 74.2124 65.0326 70.8139 65.0326C67.4155 65.0326 64.6605 67.7876 64.6605 71.186C64.6605 74.5845 67.4155 77.3395 70.8139 77.3395C72.1848 77.3395 73.451 76.8913 74.4738 76.1333C74.8298 76.8968 75.3913 77.5612 76.1133 78.0426C77.9039 79.2363 80.2789 79.0493 81.8606 77.5901L82.0179 77.445C82.5065 76.9942 82.947 76.4128 83.2066 75.7001C83.7204 74.29 84 72.769 84 71.186C84 63.9036 78.0964 58 70.8139 58C63.5315 58 57.6279 63.9036 57.6279 71.186C57.6279 78.4685 63.5315 84.3721 70.8139 84.3721C71.6231 84.3721 72.2791 83.7161 72.2791 82.907C72.2791 82.0978 71.6231 81.4419 70.8139 81.4419C65.1498 81.4419 60.5581 76.8502 60.5581 71.186ZM70.8139 67.9628C72.5941 67.9628 74.0372 69.4059 74.0372 71.186C74.0372 72.9662 72.5941 74.4093 70.8139 74.4093C69.0338 74.4093 67.5907 72.9662 67.5907 71.186C67.5907 69.4059 69.0338 67.9628 70.8139 67.9628Z" fill="url(#paint0_linear_198_694)"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M71 50C59.402 50 50 59.402 50 71C50 82.598 59.402 92 71 92C82.598 92 92 82.598 92 71C92 59.402 82.598 50 71 50ZM52.9302 71C52.9302 61.0203 61.0203 52.9302 71 52.9302C80.9797 52.9302 89.0698 61.0203 89.0698 71C89.0698 80.9797 80.9797 89.0698 71 89.0698C61.0203 89.0698 52.9302 80.9797 52.9302 71Z" fill="url(#paint1_linear_198_694)"/>
                </g>
                <defs>
                    <filter id="filter0_ddd_198_694" x="0" y="0" width="142" height="142" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                        <feOffset/>
                        <feGaussianBlur stdDeviation="2.5"/>
                        <feComposite in2="hardAlpha" operator="out"/>
                        <feColorMatrix type="matrix" values="0 0 0 0 0.771584 0 0 0 0 0.630127 0 0 0 0 0 0 0 0 0.3 0"/>
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_198_694"/>
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                        <feOffset/>
                        <feGaussianBlur stdDeviation="7.5"/>
                        <feComposite in2="hardAlpha" operator="out"/>
                        <feColorMatrix type="matrix" values="0 0 0 0 0.771584 0 0 0 0 0.630127 0 0 0 0 0 0 0 0 0.3 0"/>
                        <feBlend mode="normal" in2="effect1_dropShadow_198_694" result="effect2_dropShadow_198_694"/>
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                        <feOffset/>
                        <feGaussianBlur stdDeviation="25"/>
                        <feComposite in2="hardAlpha" operator="out"/>
                        <feColorMatrix type="matrix" values="0 0 0 0 0.771584 0 0 0 0 0.630127 0 0 0 0 0 0 0 0 0.3 0"/>
                        <feBlend mode="normal" in2="effect2_dropShadow_198_694" result="effect3_dropShadow_198_694"/>
                        <feBlend mode="normal" in="SourceGraphic" in2="effect3_dropShadow_198_694" result="shape"/>
                    </filter>
                    <linearGradient id="paint0_linear_198_694" x1="42.6296" y1="46.0185" x2="82.4445" y2="86.6296" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#CFABFF"/>
                        <stop offset="0.616921" stop-color="#A057FF"/>
                        <stop offset="1" stop-color="#3F2265"/>
                    </linearGradient>
                    <linearGradient id="paint1_linear_198_694" x1="47" y1="50" x2="85" y2="87.5" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#FFEC8D"/>
                        <stop offset="0.453571" stop-color="#D7B300"/>
                        <stop offset="0.820441" stop-color="#B89900"/>
                        <stop offset="1" stop-color="#766300"/>
                    </linearGradient>
                </defs>
            </svg>
        `;
        

  if (buttonImage.classList.contains("dark-mode")){
    buttonImage.src = 'images/header/light.svg';
    buttonImage.style.animation = 'modeToggleAnimateDark 2s ease-in-out forwards';
    headLogo.innerHTML = lightSvg;
    
  }
  else {
    buttonImage.src = 'images/night/moon.svg';
    buttonImage.style.animation = 'modeToggleAnimateLight 2s ease-out forwards';
    headLogo.innerHTML = darkSvg;
  }

  // Loop through all direct children of .container
  containerChildren.forEach(child => {
      child.classList.toggle("dark-mode");
  });
  

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
      contentWrappers.forEach((wrapper) => {
          wrapper.addEventListener("click", function () {
              const content = this.querySelector(".content");
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


function createProfileModal() {
    if (document.querySelector("#profile-modal")) return; // Prevent duplicate modals
    
    const modalContainer = document.createElement("div");
    modalContainer.classList.add("modal");
    modalContainer.id = 'profile-modal';
    modalContainer.innerHTML = `
              <div class="modal-content">
                <span class="close" id="close">&times;</span>
                <img src="images/header/user-circle.svg" alt="profile icon">
                <h2 id="modal-username"></h2>
                <p id="modal-age"></p>
                <p id="modal-location"></p>
                <p id="modal-email"></p>
              </div>
    `;

    document.body.appendChild(modalContainer);
}




function addClickFunctionality() {
    const modal = document.getElementById('profile-modal');
    const closeModal = document.getElementById('close');
    const modalUsername = document.getElementById('modal-username');
    const modalAge = document.getElementById('modal-age');
    const modalLocation = document.getElementById('modal-location');
    const modalEmail = document.getElementById('modal-email');
    const center = document.querySelector('.centered-div')
    const modalContent = document.querySelector('.modal-content')
    // Add click event to all child divs
    document.querySelectorAll('.trendProfile').forEach((profile) => {
        profile.addEventListener('click', async () => {
            center.style.display = 'none';
            try {
                const trendData = await fetchProfiles();
                const profileNameToFind = profile.textContent.trim(); // Get text content of clicked div

                // Find the user based on profileName
                const user = trendData.find(profile => profile.profileName === profileNameToFind);

                if (!user) {
                    console.error('User not found');
                    return;
                }

                modalUsername.textContent = user.profileName;
                modalAge.textContent = `Age: ${user.profileInfo.age}`;
                modalLocation.textContent = `Location: ${user.profileInfo.location}`;
                modalEmail.textContent = `Email: ${user.profileInfo.email}`;
                modalContent.classList.remove('closed')
                modal.style.display = 'block';

            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        });
    });

    // Close modal functionality
    function closeProfileModal(){
      modalContent.classList.add('closed');
      setTimeout( () => {
        modal.style.display = 'none';
        center.style.display = 'block';
      },800)
      
        
    }

    closeModal.addEventListener('click', () => {
        closeProfileModal()
    });

    window.addEventListener('click', (event) => {
      if (event.target === modal) {
        closeProfileModal()
      }
  });
}

// Main right side function sequence
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
      //Add cursor pointer to expandable divs and color change on hover 
      await applyCursorChange()

      await createProfileModal();
      //Add event listener to user profiles 
      await addClickFunctionality();


  } catch (error) {
      console.error('Error in sequence:', error);
  }
});

function handleFileUpload(event) {
    const fileInput = event.target;
    const file = event.target.files[0];
    const notification = document.getElementById('upload-notification');

    if (file) {
        notification.innerHTML = `Yes, <span>${file.name}</span> was totally uploaded frfr <span class = 'emoji'>&#128521</span>`;
        notification.style.display = 'block';

        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000); // Hide the notification after 3 seconds
        fileInput.value = '';
    }       
}

let copyCount = 0;
let timeoutId;
let blockCopy = false;
let lastMessageIndex = -1;

const messages = [
  "It doesn't work",
  "Not functional",
  "This feature is unavailable",
  "Try something else",
  "No response detected"
];

function openModal() {
  document.getElementById('modalOverlay').style.display = 'block';
  document.querySelector('.centered-div').style.display = 'none';
}

function closeModal() {
  document.getElementById('modalOverlay').style.display = 'none';
  document.querySelector('.centered-div').style.display = 'block';
}

function copyLink() {
  if (blockCopy) return;

  let input = document.getElementById('shareLink');
  input.select();
  document.execCommand('copy');

  showPopup();

  copyCount++;
  if (copyCount >= 3) {
    blockCopy = true;
    setTimeout(() => {
      blockCopy = false;
      copyCount = 0;
    }, 1000);
  }
}

function showPopup() {
  let popup = document.getElementById('popup');
  if (timeoutId) clearTimeout(timeoutId);

  popup.style.display = 'block';
  timeoutId = setTimeout(() => {
    popup.style.display = 'none';
  }, 5000);
}

function showIconPopup(event) {
  let existingPopup = document.querySelector('.icon-popup');
  if (existingPopup) existingPopup.remove();
    
  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * messages.length);
  } while (newIndex === lastMessageIndex);
  lastMessageIndex = newIndex;

  let popup = document.createElement('div');
  popup.className = 'icon-popup';
  popup.innerText = messages[newIndex];
  event.target.appendChild(popup);
  popup.style.display = 'block';

  document.addEventListener('click', function closePopup(e) {
    if (!popup.contains(e.target)) {
      popup.remove();
      document.removeEventListener('click', closePopup);
    }
  });
}

  
//create cards
document.addEventListener("DOMContentLoaded", () => {
  function generateCards() {
    const cardContainer = document.querySelector(".projects-content");

    fetch("projects.json")
      .then(response => response.json())
      .then(posts => {
        posts.forEach(post => {
          // Create card div
          const card = document.createElement("div");
          card.className = "content-card";
          card.draggable ='true';
          
          // Create title
          const title = document.createElement("div");
          title.className = "card-header";
          title.textContent = post.title;
          title.onclick = nopeCantEdit;

          // Create body text
          const body = document.createElement("div");
          body.className = "card-content";
          body.textContent = post.body;

          // Append title and body to card
          card.appendChild(title);
          card.appendChild(body);

          // Append card to container
          cardContainer.appendChild(card);
        });
      })
      .catch(error => console.error("Error loading projects.json:", error));
  }

  generateCards()

});

const nopeMessages = [
    "NOPE",
    "NOPE Not functional",
    "NOPE This feature is unavailable",
    "NOPE Try something else",
    "NOPE No response detected"
  ];


function nopeCantEdit() {
    const notification = document.getElementById('upload-notification');

    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * nopeMessages.length);
    } while (newIndex === lastMessageIndex);
    lastMessageIndex = newIndex;

    notification.innerHTML = nopeMessages[newIndex];
    notification.style.display = 'block';

    setTimeout(() => {
        notification.style.display = 'none';
    }, 1000); // Hide the notification after 3 seconds
    fileInput.value = ''; 
  }

document.addEventListener("DOMContentLoaded", () => {
    const modalOpenBtn = document.getElementById("createModal")
    const cardEditModal = document.querySelector(".card-edit-modal-container")
    const modalSubmitBtn = document.getElementById("submitCard")
    const modalCloseBtn = document.getElementById("closeModal")
    const cardDisplayArea = document.querySelector(".projects-content")
    const cardTitleInput = document.getElementById("cardTitle")
    const cardContentInput = document.getElementById("cardContent")
  
    let editingCard = null
  
    const toggleModal = () => {
        cardEditModal.classList.toggle("active")
        document.querySelector('.centered-div').style.display = 'none';
    }
  
    const resetModal = () => {
      cardTitleInput.value = ""
      cardContentInput.value = ""
      editingCard = null
    }

  
    const createCard = (title, content) => {
      const card = document.createElement("div")
      card.classList.add("content-card")
      card.innerHTML = `<div class = 'card-header'>${title}</div><div class = 'card-content' draggable="true">${content}</div>`
      const cardHeader = card.querySelector('.card-header')
      cardHeader.addEventListener("click", () => editCard(card))
      return card
    }
  
    const editCard = (card) => {
      editingCard = card
      cardTitleInput.value = card.querySelector(".card-header").textContent
      cardContentInput.value = card.querySelector(".card-content").textContent
      toggleModal()
    }
  
    modalOpenBtn.addEventListener("click", () => {
        document.querySelector('.centered-div').style.display = 'block';
      resetModal()
      toggleModal()
    })
  
    modalCloseBtn.addEventListener("click", toggleModal)
    
    window.addEventListener('click', (event) => {
        if (event.target === cardEditModal) {
            toggleModal();
            center.style.display = 'block';
        }
    })
  
    modalSubmitBtn.addEventListener("click", () => {
      const title = cardTitleInput.value.trim()
      const content = cardContentInput.value.trim()

      if (title && content) {
        if (editingCard) {
          editingCard.querySelector(".card-header").textContent = title
          editingCard.querySelector(".card-content").textContent = content
        } else {
          cardDisplayArea.appendChild(createCard(title, content))
        }
        toggleModal()
        resetModal()
      } else {
        alert("Please fill out both fields.")
      }
    })
    
  })

function openWindowWithDelay(url, delay) {
  setTimeout(() => {
    window.open(url, "_blank");
  }, delay);
}

