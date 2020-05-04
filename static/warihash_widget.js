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

var widgetOpenBtn = document.getElementsByClassName("open-hashcharger");

var createModal = function() {
    document.body.classList.add("disable-scroll-overflow");
    // get data param
    var myScript = document.getElementById('hashcharger');
    var host = (myScript.getAttribute('host') || '');
    var port = (myScript.getAttribute('port') || '');
    var username = (myScript.getAttribute('username') || '');
    var password = (myScript.getAttribute('password') || '');
    var algorithm = (myScript.getAttribute('algorithm') || '');
    var navbg = (myScript.getAttribute('navbg') || '');
    var navtexts = (myScript.getAttribute('navtexts') || '');
    var btncolor = (myScript.getAttribute('btncolor') || '');
    var btntexts = (myScript.getAttribute('btntexts') || '');
    var closebtn = (myScript.getAttribute('closebtn') || '');
    var nightmode = (myScript.getAttribute('nightmode') || '');

    // modal window div
    var modalWindow = document.createElement('div');
    modalWindow.className = 'warihash-widget';
    modalWindow.id = 'warihash-widget';
    document.getElementsByTagName('body')[0].appendChild(modalWindow);

    // append iframe to modalWindow
    var iframe = document.createElement('iframe');
    // eslint-disable-next-line no-useless-concat
    iframe.src = 'https://app.warihash.org/market' + '/' + host + '/' + port + '/' + 
    username + '/' + password + '/' + algorithm + '/' + navbg + '/' + navtexts + '/' + 
    btncolor + '/' + btntexts + '/' + nightmode;
    iframe.style.width = "100vw";
    iframe.style.height = "100vh";
    iframe.style.border = "none";
    iframe.sandbox = 'allow-popups allow-popups-to-escape-sandbox allow-forms allow-same-origin allow-scripts allow-top-navigation allow-top-navigation-by-user-activation';
    modalWindow.appendChild(iframe);

    // append close button to modalwindow
    var widgetCloseBtn = document.createElement('button');
    widgetCloseBtn.type = 'button';
    widgetCloseBtn.className = 'warihash-close-button';
    widgetCloseBtn.id = 'warihash-close-button';
    widgetCloseBtn.title = 'Close window';
    widgetCloseBtn.innerHTML = '<svg class="svg-close-icon" version="1.1" viewBox="0 0 14 14"><title/><desc/><defs/><g fill="none" fill-rule="evenodd" id="Page-1" stroke="none" stroke-width="1"><g fill="#000000" id="Core" transform="translate(-341.000000, -89.000000)"><g id="close" transform="translate(341.000000, 89.000000)"><path d="M14,1.4 L12.6,0 L7,5.6 L1.4,0 L0,1.4 L5.6,7 L0,12.6 L1.4,14 L7,8.4 L12.6,14 L14,12.6 L8.4,7 L14,1.4 Z" id="Shape"/></g></g></g></svg>';
    widgetCloseBtn.style.color = closebtn;

    // add widget close function
    widgetCloseBtn.addEventListener("click", function () {
        var elem = document.getElementById('warihash-widget');
        elem.classList.add('widget-fadeout');
        // remove modal after 0.45 sec
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