
var cssId = 'myCss';  
if (!document.getElementById(cssId)) {
   var head  = document.getElementsByTagName('head')[0];
   var link  = document.createElement('link');
   link.id   = cssId;
   link.rel  = 'stylesheet';
   link.type = 'text/css';
   link.href = 'https://app.warihash.org/static/hashcharger.css';
   link.media = 'all';
   head.appendChild(link);
};

window.addEventListener("load", () => {

var widgetOpenBtn = document.getElementsByClassName("open-hashcharger");

var createModal = function() {
    document.body.classList.add("hashcharger-opened");

    var myScript = document.getElementById('hashcharger');
    var token = (myScript.getAttribute('token') || '');
    var host = (myScript.getAttribute('stratum-host') || '');
    var port = (myScript.getAttribute('stratum-port') || '');
    var username = (myScript.getAttribute('stratum-username') || '');
    var password = (myScript.getAttribute('stratum-password') || '');
    var algorithm = (myScript.getAttribute('algorithm') || '');
    var navbg = (myScript.getAttribute('theme-navbg') || '');
    var navtexts = (myScript.getAttribute('theme-navtexts') || '');
    var primary = (myScript.getAttribute('theme-primary') || '');
    var secondary = (myScript.getAttribute('theme-secondary') || '');
    var buttontexts = (myScript.getAttribute('theme-buttontexts') || '');
    var tabletexts = (myScript.getAttribute('theme-tabletexts') || '');
    var fullscreen = (myScript.getAttribute('fullscreen') || '');

    var modalWindow = document.createElement('div');
    modalWindow.className = 'hashcharger-widget';
    modalWindow.id = 'hashcharger-widget';
    document.getElementsByTagName('body')[0].appendChild(modalWindow);


    var iframe = document.createElement('iframe');
    // eslint-disable-next-line no-useless-concat
    iframe.src = 'https://app.warihash.com/market' + '/' + host + '/' + port + '/' + 
    username + '/' + password + '/' + algorithm + '/' + navbg + '/' + navtexts + '/' + 
    primary + '/' + secondary + '/' + buttontexts + '/' + tabletexts + '/' + token + '/' + fullscreen;
    iframe.style.width = "100vw";
    iframe.style.height = "100vh";
    iframe.style.border = "none";
    iframe.sandbox = 'allow-popups allow-popups-to-escape-sandbox allow-forms allow-same-origin allow-scripts allow-top-navigation allow-top-navigation-by-user-activation';
    modalWindow.appendChild(iframe);

    var widgetCloseBtn = document.createElement('button');
    widgetCloseBtn.type = 'button';
    widgetCloseBtn.className = 'hashcharger-close-button';
    widgetCloseBtn.id = 'hashcharger-close-button';
    widgetCloseBtn.title = 'Close window';
    widgetCloseBtn.innerHTML = '<svg class="svg-close-icon" enable-background="new 0 0 24 24" id="Layer_1" version="1.1" viewBox="0 0 24 24"><path d="M22.245,4.015c0.313,0.313,0.313,0.826,0,1.139l-6.276,6.27c-0.313,0.312-0.313,0.826,0,1.14l6.273,6.272  c0.313,0.313,0.313,0.826,0,1.14l-2.285,2.277c-0.314,0.312-0.828,0.312-1.142,0l-6.271-6.271c-0.313-0.313-0.828-0.313-1.141,0  l-6.276,6.267c-0.313,0.313-0.828,0.313-1.141,0l-2.282-2.28c-0.313-0.313-0.313-0.826,0-1.14l6.278-6.269  c0.313-0.312,0.313-0.826,0-1.14L1.709,5.147c-0.314-0.313-0.314-0.827,0-1.14l2.284-2.278C4.308,1.417,4.821,1.417,5.135,1.73  L11.405,8c0.314,0.314,0.828,0.314,1.141,0.001l6.276-6.267c0.312-0.312,0.826-0.312,1.141,0L22.245,4.015z"/></svg>';

    widgetCloseBtn.addEventListener("click", function () {
        var elem = document.getElementById('hashcharger-widget');
        elem.classList.add('widget-fadeout');
        setTimeout(function(){ 
            elem.parentNode.removeChild(elem); 
            document.body.classList.remove("hashcharger-opened");
        }, 450);
      });
    modalWindow.appendChild(widgetCloseBtn);
};

for (var i = 0; i < widgetOpenBtn.length; i++) {
    widgetOpenBtn[i].addEventListener('click', createModal, false);
};

});