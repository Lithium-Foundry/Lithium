import { init_lithium, navigate, search, back, forward, reload, search_engines, config } from "/client/index.js";

// Which proxy engine + transport to boot with. Settings writes these to
// localStorage; this file reads them and hands them to Lithium.js.
// Defaults to Ultraviolet/epoxy if nothing's been chosen yet.
var proxyChoice = localStorage.getItem("proxyEngine") || "ultraviolet";
var transportChoice = localStorage.getItem("proxyTransport") || "epoxy";

// Search engines: the list lives in js/engines.js (presets + the user's custom
// ones). Register each with Lithium.js so search()/navigate() use whichever is
// selected. Registering can throw if a name is already taken, so one bad entry
// shouldn't stop the rest.
function registerEngine(name, template){
  try {
    search_engines.register(name, function(query){
      return template.replace("%s", encodeURIComponent(query));
    });
  } catch (err) {
    console.warn("[lithium] couldn't register search engine", name, err);
  }
}

var allEngines = typeof getAllEngines === "function" ? getAllEngines() : [];
allEngines.forEach(function(engine){ registerEngine(engine[0], engine[1]); });
var engineChoice = typeof getSelectedEngineName === "function" ? getSelectedEngineName() : "Google";

var readyPromise = init_lithium({
  proxy: proxyChoice,
  transport: transportChoice,
  searchEngine: engineChoice,
  onReady: function(){
    console.log("[lithium] ready:", proxyChoice, transportChoice, engineChoice);
  },
  onUrlChange: function(){
    // Fires on every navigation, for every proxy. This is how we know the
    // proxied page actually landed.
    document.body.classList.remove('proxy-loading');
  },
}).catch(function(err){
  console.error("[lithium] init_lithium failed:", err);
  throw err;
});

// Everything else on the site is a classic (non-module) script, so it calls
// these instead of importing. They all wait for init to finish first.
window.navigate = function(url){
  return readyPromise.then(function(){ return navigate(url); });
};
window.lithiumSearch = function(query){
  return readyPromise.then(function(){ return search(query); });
};
window.lithiumBack = function(){
  return readyPromise.then(function(){ return back(); });
};
window.lithiumForward = function(){
  return readyPromise.then(function(){ return forward(); });
};
window.lithiumReload = function(){
  document.body.classList.add('proxy-loading');
  return readyPromise.then(function(){ return reload(); });
};

// Used by Settings so a newly added / picked engine applies without a reload.
window.lithiumRegisterEngine = registerEngine;
window.lithiumUseEngine = function(name){
  return readyPromise.then(function(){ config.searchEngine = name; });
};
