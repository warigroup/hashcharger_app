// add CSS
var cssId = 'myCss';  
if (!document.getElementById(cssId)) {
   var head  = document.getElementsByTagName('head')[0];
   var link  = document.createElement('link');
   link.id   = cssId;
   link.rel  = 'stylesheet';
   link.type = 'text/css';
   // use cloudflare CDN
   link.href = 'https://app.warihash.org/static/warihash_widget.css';
   link.media = 'all';
   head.appendChild(link);
};

window.addEventListener("load", () => {

var widgetOpenBtn = document.getElementsByClassName("open-warihash");

var createModal = function() {
    document.body.classList.add("disable-scroll-overflow");
    // get data param
    var myScript = document.getElementById('script-widget');
    var host = (myScript.getAttribute('host') || '');
    var port = (myScript.getAttribute('port') || '');
    var username = (myScript.getAttribute('username') || '');
    var password = (myScript.getAttribute('password') || '');

    // modal window div
    var modalWindow = document.createElement('div');
    modalWindow.className = 'warihash-widget';
    modalWindow.id = 'warihash-widget';
    document.getElementsByTagName('body')[0].appendChild(modalWindow);

    // append iframe to modalWindow
    var iframe = document.createElement('iframe');
    // eslint-disable-next-line no-useless-concat
    iframe.src = 'https://app.warihash.org/market' + '/' + host + '/' + port + '/' + username + '/' + password;
    iframe.style.width = "100vw";
    iframe.style.height = "100vh";
    iframe.style.border = "none";
    iframe.sandbox = 'allow-popups allow-popups-to-escape-sandbox allow-forms allow-same-origin allow-scripts allow-top-navigation allow-top-navigation-by-user-activation';
    modalWindow.appendChild(iframe);

    // append close button to modalwindow
    var widgetCloseBtn = document.createElement('button');
    widgetCloseBtn.className = 'warihash-close-button';
    widgetCloseBtn.id = 'warihash-close-button';
    widgetCloseBtn.title = 'Close window';
    widgetCloseBtn.innerHTML = '<h4>&times;</h4>';

    // add widget close function
    widgetCloseBtn.addEventListener("click", function () {
        var elem = document.getElementById('warihash-widget');
        elem.classList.add('widget-fadeout');
        // remove modal after 1 second
        setTimeout(function(){ 
            elem.parentNode.removeChild(elem); 
            document.body.classList.remove("disable-scroll-overflow");
        }, 450);
      });
    modalWindow.appendChild(widgetCloseBtn);
};

for (var i = 0; i < widgetOpenBtn.length; i++) {
    widgetOpenBtn[i].addEventListener('click', createModal, false);
};

});