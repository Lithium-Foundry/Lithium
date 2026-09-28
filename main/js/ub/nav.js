var MOBILE_QUERY = "(max-width: 700px), (max-height: 500px) and (pointer: coarse)";
var mobileMq = window.matchMedia(MOBILE_QUERY);

var navbar = document.querySelector(".navbar");
var menuIcon = document.querySelector(".hamburger");
var menuBtn = document.getElementById("menuBtn");
var dropdown = document.querySelector(".dropdown");
var dropdownLinks = document.querySelector(".dropdown-links");
var quickLinksToggle = dropdown ? dropdown.querySelector(".quick_links") : null;
var quickLinksIcon = quickLinksToggle ? quickLinksToggle.querySelector(".material-symbols-outlined") : null;

/* MOBILE MENU: one big centered list */

function setQuickLinksOpen(open){
  if(!dropdown) return;
  dropdown.classList.toggle("open", open);
  if(quickLinksIcon) quickLinksIcon.innerText = open ? "expand_less" : "expand_more";
}

function setMenu(open){
  if(!navbar || !menuBtn) return;
  navbar.classList.toggle("menu-open", open);
  document.body.classList.toggle("nav-open", open);
  menuBtn.innerText = open ? "close" : "menu";
  if(!open) setQuickLinksOpen(false);
}

if(menuIcon){
  menuIcon.onclick = function(){
    setMenu(!navbar.classList.contains("menu-open"));
  };
}

document.addEventListener("keydown", function(e){
  if(e.key === "Escape") setMenu(false);
});

// Rotating / resizing back to the desktop layout: reset everything.
mobileMq.addEventListener("change", function(e){
  if(!e.matches){
    setMenu(false);
    if(dropdownLinks){
      dropdownLinks.style.display = "";
      dropdownLinks.style.opacity = "";
      dropdownLinks.style.animation = "";
    }
  }
});

// Tapping a normal page link closes the menu (matters for the Discord link,
// which opens in a new tab and leaves this page behind the menu).
document.querySelectorAll(".pages ul li a:not(.quick_links)").forEach(function(a){
  a.addEventListener("click", function(){ setMenu(false); });
});

// On touch there's no hover, so Quick Links expands in place instead.
if(quickLinksToggle){
  quickLinksToggle.addEventListener("click", function(e){
    if(!mobileMq.matches) return;
    e.preventDefault();
    setQuickLinksOpen(!dropdown.classList.contains("open"));
  });
}

/* DESKTOP: hover dropdown */

if(dropdown && dropdownLinks){
  dropdown.onmouseover = function() {
    if(mobileMq.matches) return;
    dropdownLinks.style.display = "block";
    dropdownLinks.style.opacity = "1";
    dropdownLinks.style.animation = "0.4s dropdownFadeIn";
  };

  dropdown.onmouseout = function() {
    if(mobileMq.matches) return;
    dropdownLinks.style.opacity = "0";
    dropdownLinks.style.animation = "0.3s dropdownFadeOut";
  };

  dropdownLinks.addEventListener("animationend", function() {
    if(!mobileMq.matches && dropdownLinks.style.opacity == "0") {
      dropdownLinks.style.display = "none";
    }
  }, false);
}

/* QUICK LINKS */

function updateLinks() {
  var list = document.querySelector(".dropdown-links");
  if(!list || localStorage.getItem("quickLinkDetails") == null) return;

  var saved = JSON.parse(localStorage.getItem("quickLinkDetails"));
  if(saved.length == 0) {
    list.innerHTML = '<a href="settings.html"><span class="material-symbols-outlined" style="font-size:14px;">add_circle</span>&nbsp;Add links in <span style="text-decoration: underline;">Settings</span></a>';
    return;
  }

  list.innerHTML = "";
  saved.forEach(function(entry){
    var link = document.createElement("a");
    link.href = "#";
    link.dataset.url = entry[0];
    link.innerText = entry[1];
    list.appendChild(link);

    link.onclick = function(e) {
      e.preventDefault();
      setMenu(false);
      // openProxy() (js/go.js) exists only on main.html: it swaps to the
      // proxied view. Everywhere else, hop over to main.html and open it there.
      if(typeof openProxy === "function"){
        openProxy(this.dataset.url);
      } else {
        window.location.href = '/main.html?open=' + encodeURIComponent(this.dataset.url);
      }
    };
  });
}

updateLinks();
