var search = document.getElementById("search");
var proxyLoading = document.querySelector("#proxyLoading");
var homeLink = document.getElementById("homeLink");
var proxyBack = document.getElementById("proxyBack");
var proxyForward = document.getElementById("proxyForward");
var proxyReload = document.getElementById("proxyReload");
var proxyHome = document.getElementById("proxyHome");

function goHome(){
  document.body.classList.remove('proxy-active', 'proxy-loading');
}

if(homeLink){
  homeLink.addEventListener('click', function(e){
    e.preventDefault();
    goHome();
  });
}
if(proxyHome){
  proxyHome.addEventListener('click', goHome);
}
if(proxyBack){
  proxyBack.addEventListener('click', function(){ window.lithiumBack(); });
}
if(proxyForward){
  proxyForward.addEventListener('click', function(){ window.lithiumForward(); });
}
if(proxyReload){
  proxyReload.addEventListener('click', function(){ window.lithiumReload(); });
}

function openProxy(input){
  var text = input.trim();
  if (!text) return;

  document.body.classList.add('proxy-active', 'proxy-loading');
  if(proxyLoading){
    proxyLoading.querySelectorAll("span")[1].innerText = "loading content";
    window.setTimeout(function(){
      if(!document.body.classList.contains('proxy-loading')) return;
      proxyLoading.querySelectorAll("span")[1].innerText = "heavy server load may cause slowness";
    }, 2500);
    window.setTimeout(function(){
      if(!document.body.classList.contains('proxy-loading')) return;
      proxyLoading.querySelectorAll("span")[1].innerHTML = "there might be an error; join our <span style='text-decoration:underline;cursor:pointer;color:rgb(200,200,255);' onclick=\"window.open('https://discord.gg/hFZC5cgsmq', '_blank');\">discord</span> for support";
    }, 15000);
  }

  // Lithium.js does the searching (using the engine picked in Settings,
  // see js/lithium-init.js); we only decide URL vs. search term.
  if (isUrl(text)) {
    window.navigate(/^https?:\/\//i.test(text) ? text : 'http://' + text);
  } else {
    window.lithiumSearch(text);
  }
}

function submitUrl(){
  if(/\S/.test(search.value)){
    openProxy(search.value);
  }
}

if(search){
  search.addEventListener('keydown', function onEvent(e) {
    if (e.key === "Enter"){ openProxy(search.value); }
    if (e.key === "Escape"){ search.blur(); }
  });
}

// Quick Links clicked from other pages land here via ?open=<url>
(function(){
  var params = new URLSearchParams(window.location.search);
  var openTarget = params.get('open');
  if(openTarget){
    openProxy(openTarget);
    window.history.replaceState({}, '', window.location.pathname);
  }
})();
