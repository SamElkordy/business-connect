// TAGLINE Logic
const tagline = document.querySelector('#doCheck');

tagline.addEventListener('click', () => {
    if(doCheck.checked == true) {
        document.getElementById('checkbox-checked').style.display = "block";
    } else {
        document.getElementById('checkbox-checked').style.display = "none";
    }
    
})

