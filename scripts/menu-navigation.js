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

function dropdownBtn() {
    let myDropdown = document.getElementById("myDropdown");
    if(myDropdown.style.display=='block'){
        myDropdown.style.display='none';
    }
    else{
        myDropdown.style.display='block';
    }
  }