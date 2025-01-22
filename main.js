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



   const displayLimit = 21; // Number of characters to display in the input

  input.addEventListener('input', () => {
    const fullValue = input.value; // Get the full input value
    const truncatedValue = fullValue.slice(-displayLimit); // Display only the last N characters
    input.value = truncatedValue; // Update the input's visible value
  });