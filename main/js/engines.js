// Search engine data + small shared helpers. Loaded as a classic script
// (before js/lithium-init.js and js/settings.js), so everything here is global.
//
// Lithium.js does the actual searching now: js/lithium-init.js registers every
// engine below with search_engines.register() and picks the active one. This
// file only holds the list, the user's saved choice, and helpers for places
// that need a plain URL string (Quick Links).

// Built-in presets. %s is replaced with the encoded search query.
var builtInEngines = [
  ["Google", "https://www.google.com/search?q=%s"],
  ["Bing", "https://www.bing.com/search?q=%s"],
  ["DuckDuckGo", "https://duckduckgo.com/?q=%s"],
  ["Brave Search", "https://search.brave.com/search?q=%s"],
  ["Yahoo", "https://search.yahoo.com/search?p=%s"],
  ["Startpage", "https://www.startpage.com/sp/search?query=%s"],
  ["Ecosia", "https://www.ecosia.org/search?q=%s"],
];

function getCustomEngines(){
  try {
    return localStorage.getItem("customEngines") ? JSON.parse(localStorage.getItem("customEngines")) : [];
  } catch (e) {
    return [];
  }
}

function getAllEngines(){
  return builtInEngines.concat(getCustomEngines());
}

// Name of the engine the user picked, falling back to the first preset
// (Google) if nothing's saved or the saved one was removed.
function getSelectedEngineName(){
  var selected = localStorage.getItem("searchEngine");
  var all = getAllEngines();
  for(var i=0;i<all.length;i++){
    if(all[i][0] === selected) return selected;
  }
  return builtInEngines[0][0];
}

function getSearchTemplate(){
  var name = getSelectedEngineName();
  var all = getAllEngines();
  for(var i=0;i<all.length;i++){
    if(all[i][0] === name) return all[i][1];
  }
  return builtInEngines[0][1];
}

// Only for Quick Links, which need a real URL to store. Normal searches go
// through Lithium.js's search().
function buildSearchUrl(query){
  return getSearchTemplate().replace("%s", encodeURIComponent(query));
}

// "example.com" and "https://example.com/x" are URLs; "what is node.js" is not.
function isUrl(val){
  val = (val || '').trim();
  if (/^https?:\/\/\S+$/i.test(val)) return true;
  return /^\S+\.\S+$/.test(val);
}
