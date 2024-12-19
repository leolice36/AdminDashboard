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