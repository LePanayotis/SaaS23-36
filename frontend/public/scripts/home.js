var imgs = ['/public/images/1.jpg', '/public/images/2.jpg', '/public/images/3.jpg', '/public/images/4.jpg']
var index = 1;

function nextImage(c) {
    index = (index + c) % imgs.length;
    if(index == -1) index = imgs.length - 1;
    document.getElementById('right-container').style.backgroundImage = `url(${imgs[index]})`;
    
}

function change(index){
    const login = document.getElementById('loginArea');
    const about = document.getElementById('aboutArea');
    const contact = document.getElementById('contactArea');
    console.log(index);
    if(index === 1){
        login.style.display='flex';
        about.style.display='none';
        contact.style.display='none';
    } else if(index === 2) {
        login.style.display='none';
        about.style.display='flex';
        contact.style.display='none';
    } else if(index === 3) {
        login.style.display='none';
        about.style.display='none';
        contact.style.display='flex';
    } 

}