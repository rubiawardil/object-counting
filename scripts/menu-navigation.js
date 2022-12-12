function navigateHome(){
    window.location.href = '../index.html';
}

function navigateSoftware(){
    window.location.href = '../pages/software-page.html';
}

function navigateMethodology(){
    window.location.href = '../pages/methodology-page.html';
}

function navigateImages(){
    window.location.href = '../pages/images-page.html';
}

function dropdownBtn_Click() {
    document.getElementById("myDropdown").classList.toggle("show");
  }
  
  // Close the dropdown menu if the user clicks outside of it
  window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }