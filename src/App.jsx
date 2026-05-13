import { useState, useEffect, useRef, useCallback } from "react";

const ADMIN_PIN = "1497";

const TOUR_DATA = [
  { day: 1, title: "Arrival Day", location: "Corner Brook", subtitle: "Arrive Deer Lake. Meet & Greet.", meals: [] },
  { day: 2, title: "Viking Trail & Gros Morne", location: "Plum Point", subtitle: "Gros Morne, Port au Choix.", meals: [
    { type: "Breakfast", note: "Included at hotel" },
    { type: "Lunch", note: "Menu coming soon", pending: true },
    { type: "Dinner", note: "Menu coming soon", pending: true },
  ]},
  { day: 3, title: "L'Anse aux Meadows & St. Anthony", location: "Plum Point", subtitle: "UNESCO Viking site. Grenfell Mission.", meals: [
    { type: "Breakfast", note: "Included at hotel" },
    { type: "Lunch", time: "12:30 PM", venue: "Northern Delight Restaurant", venueLocation: "Gunners Cove, NL", phone: "709-623-2220", email: "danny@northerndelight.ca", deadline: "Morning of Day 3", sections: [
      { title: "Main", items: [
        { num: 1, name: "Penne Pasta", desc: "Vegetarian", tags: ["V"] },
        { num: 2, name: "Club Sandwich & Garden Salad", desc: "Partridgeberry vinaigrette", tags: [] },
        { num: 3, name: "Tomato Basil Soup & Grilled Cheese", tags: [] },
        { num: 4, name: "Fish & Chips", tags: ["DF"] },
      ]},
      { title: "Included", fixed: true, items: [{ name: "Chef's Dessert, Tea or Coffee" }] },
    ]},
  ]},
  { day: 4, title: "Ferry to Labrador & Red Bay", location: "L'Anse au Clair", subtitle: "Basque Whaling Station. L'Anse Amour.", meals: [
    { type: "Breakfast", note: "Included at hotel" },
    { type: "Dinner", time: "4:45 PM", venue: "Whaler's Restaurant", venueLocation: "Red Bay, NL", phone: "709-920-2156", email: "redbaywhalersstation@gmail.com", leadTime: "Orders by 4 PM day before", deadline: "By 4 PM on Day 3", sections: [
      { title: "Appetizer", fixed: true, items: [{ name: "Garden Salad", desc: "Served to all", tags: ["V","GF"] }] },
      { title: "Main", items: [
        { num: 1, name: "Cod Fish Dinner", desc: "Mashed potatoes, veggies, coleslaw", tags: ["GF"] },
        { num: 2, name: "Baked Chicken", desc: "Basque tomato sauce, rice, veggies", tags: ["GF"] },
        { num: 3, name: "Vegetarian Stir-Fry", tags: ["V","GF","DF"] },
        { num: 4, name: "Vegan Vegetable & Legume Soup", tags: ["VG","GF","DF"] },
      ]},
      { title: "Included", fixed: true, items: [{ name: "Wild Berry Dessert & Ice Cream, Tea or Coffee" }] },
    ]},
  ]},
  { day: 5, title: "Return Ferry & Western Coast", location: "Rocky Harbour / Cow Head", subtitle: "Ferry back. Coastal vistas.", meals: [
    { type: "Breakfast", note: "Included at hotel" },
    { type: "Lunch", time: "12:30 PM", venue: "Shallow Bay Motel & Cabins", venueLocation: "Cow Head, NL", phone: "709-243-2471", deadline: "Morning of Day 5", sections: [
      { title: "Main", items: [
        { num: 1, name: "Cod au Gratin & Dinner Roll", tags: [] },
        { num: 2, name: "Chowder & Dinner Roll", tags: [] },
        { num: 3, name: "Chef Salad & Dinner Roll", desc: "Ham, turkey, cheese", tags: [] },
        { num: 4, name: "Vegetable Beef Soup & Dinner Roll", tags: ["DF"] },
      ]},
      { title: "Add Dessert", items: [
        { name: "Partridgeberry Cheesecake", price: "$7.99", tags: [] },
        { name: "Carrot Cake", price: "$7.99", tags: [] },
        { name: "No Dessert", tags: [] },
      ]},
      { title: "Included", fixed: true, items: [{ name: "Tea or Coffee" }] },
    ]},
    { type: "Dinner", time: "6:00 PM", venue: "Ocean View Hotel", venueLocation: "Rocky Harbour, NL", phone: "709-458-2730", email: "kitchen@theoceanview.ca", deadline: "Morning of Day 5", footerNote: "All dishes can be made GF if required", sections: [
      { title: "Appetizer", fixed: true, items: [{ name: "Soup of the Day" }] },
      { title: "Main", items: [
        { num: 1, name: "Lemon Chicken Piccata", desc: "Mashed potatoes & vegetables", tags: ["GF"] },
        { num: 2, name: "Pan Fried Cod", desc: "Mashed potatoes & vegetables", tags: ["GF","DF"] },
        { num: 3, name: "Penne Pasta, Veggies & Marinara", desc: "Vegetarian", tags: ["V","DF"] },
        { num: 4, name: "Jiggs Dinner", desc: "Groups of 12+", tags: ["GF"] },
      ]},
      { title: "Included", fixed: true, items: [{ name: "Chef's Dessert, Tea or Coffee" }] },
    ]},
  ]},
  { day: 6, title: "Gros Morne - Bonne Bay & Tablelands", location: "Rocky Harbour / Cow Head", subtitle: "Boat tour, Discovery Centre, Tablelands.", meals: [
    { type: "Breakfast", note: "Included at hotel" },
    { type: "Lunch", time: "12:30 PM", venue: "The Old Loft Restaurant", venueLocation: "Woody Point, NL", phone: "709-453-2294", deadline: "Morning of Day 6", sections: [
      { title: "Main", items: [
        { num: 1, name: "Pan Fried Cod & Homemade Fries", tags: ["GF","DF"] },
        { num: 2, name: "Fish Cakes, Multigrain Bread & Beans", tags: [] },
        { num: 3, name: "Meat Pie & House Salad", tags: [] },
        { num: 4, name: "Cod au Gratin & Multigrain Bread", tags: [] },
        { num: 5, name: "Large House Salad", desc: "Strawberries, mandarin oranges, spring mix", tags: ["V","GF","DF"] },
      ]},
      { title: "Dessert", items: [
        { num: 1, name: "Partridgeberry Scones", tags: [] },
        { num: 2, name: "Blueberry Pie & Ice Cream", tags: [] },
      ]},
      { title: "Included", fixed: true, items: [{ name: "Tea or Coffee" }] },
    ]},
  ]},
  { day: 7, title: "Eastward Trek & Gander", location: "Gander", subtitle: "Come From Away commemoration.", meals: [
    { type: "Breakfast", note: "Included at hotel" },
    { type: "Lunch", time: "12:00 PM", venue: "By the Sea Inn & Cafe", venueLocation: "King's Point, NL", phone: "709-268-2181", deadline: "Morning of Day 7", sections: [
      { title: "Main", items: [
        { num: 1, name: "Turkey Soup & BLT Sandwich", desc: "GF option available", tags: ["GF*"] },
        { num: 2, name: "Seafood Chowder & Bread Roll", tags: [] },
        { num: 3, name: "Chicken Salad Wrap & Fries", tags: [] },
        { num: 4, name: "Fishcakes, Bread & Mustard Pickles", desc: "GF option available", tags: ["GF*"] },
      ]},
      { title: "Included", fixed: true, items: [{ name: "House Dessert, Tea or Coffee" }] },
    ]},
    { type: "Dinner", time: "5:30 PM", venue: "Gander Dinner Theatre", venueLocation: "Gander, NL", phone: "709-424-9224", deadline: "Morning of Day 7", sections: [
      { title: "Main", items: [
        { num: 1, name: "Stuffed Chicken", desc: "Potatoes & veggies", tags: [] },
        { num: 2, name: "Stuffed Cod", desc: "Potatoes & veggies", tags: [] },
      ]},
      { title: "Included", fixed: true, items: [{ name: "Newfoundland Dessert, Tea or Coffee" }] },
    ]},
  ]},
  { day: 8, title: "Twillingate & Terra Nova", location: "Clarenville", subtitle: "Twillingate Island. Terra Nova NP.", meals: [
    { type: "Breakfast", note: "Included at hotel" },
    { type: "Lunch", time: "12:00 PM", venue: "Anchor Inn - Georgie's", venueLocation: "Twillingate, NL", phone: "709-884-2777", email: "reception@anchorinntw.com", leadTime: "48 hours notice required", deadline: "By end of Day 6", sections: [
      { title: "Main", items: [
        { num: 1, name: "Fish Cakes", desc: "Panko-crusted saltfish, rhubarb relish", tags: [] },
        { num: 2, name: "Shrimp Sandwich", desc: "On croissant with kettle chips", tags: [] },
        { num: 3, name: "Chicken Caesar Salad", desc: "Charbroiled chicken, bacon, parmesan", tags: [] },
        { num: 4, name: "Georgie's Clam Chowder", desc: "Meal-size, GF bread", tags: ["GF"] },
        { num: 5, name: "Root Cellar Bisque", desc: "Curried coconut, crostini", tags: ["V","DF"] },
      ]},
      { title: "Included", fixed: true, items: [{ name: "Chef's Dessert, Tea or Coffee" }] },
    ]},
    { type: "Dinner", venue: "Clarenville Inn", note: "Buffet - no selection needed", isBuffet: true },
  ]},
  { day: 9, title: "Trinity & Bonavista", location: "Clarenville", subtitle: "Historic Trinity. Bonavista.", meals: [
    { type: "Breakfast", note: "Included at hotel" },
    { type: "Lunch", time: "11:30 AM", venue: "Skipper's Restaurant", venueLocation: "Bonavista, NL", phone: "709-468-7982", email: "info@harbourquarters.com", leadTime: "48 hours notice required", deadline: "By end of Day 7", sections: [
      { title: "Main", items: [
        { num: 1, name: "Cod au Gratin", desc: "Baked cod, cream sauce, cheese", tags: ["GF"] },
        { num: 2, name: "Chicken Broccoli Casserole", desc: "Mushroom sauce, cheese", tags: [] },
        { num: 3, name: "Homemade Beef Lasagna", desc: "Marinara, cheese", tags: [] },
        { num: 4, name: "Salmon Cakes", desc: "Rhubarb pickles, cranberry salad. Not GF.", tags: ["DF"] },
      ]},
      { title: "Included", fixed: true, items: [{ name: "Death by Chocolate, Tea or Coffee" }] },
    ]},
    { type: "Dinner", venue: "Clarenville Inn", note: "On your own this evening", isOnOwn: true },
  ]},
  { day: 10, title: "Witless Bay, Cape Spear & St. John's", location: "St. John's", subtitle: "Puffins, whales, Cape Spear.", meals: [
    { type: "Breakfast", note: "Included at hotel" },
    { type: "Lunch", venue: "O'Brien's Boat Tours", venueLocation: "Bay Bulls, NL", deadline: "Morning of Day 10", sections: [
      { title: "Main", items: [
        { num: 1, name: "Stuffed Cod", desc: "With vegetables", tags: [] },
        { num: 2, name: "Stuffed Chicken Breast", desc: "With vegetables", tags: [] },
      ]},
      { title: "Included", fixed: true, items: [{ name: "Set Dessert, Tea or Coffee" }] },
    ]},
    { type: "Dinner", venue: "Downtown St. John's", note: "On your own - ask your guide!", isOnOwn: true },
  ]},
  { day: 11, title: "Historic St. John's & Farewell", location: "St. John's", subtitle: "Signal Hill, Jelly Bean Houses.", meals: [
    { type: "Breakfast", note: "Included at hotel" },
    { type: "Lunch", venue: "On Your Own", note: "Free afternoon to explore", isOnOwn: true },
    { type: "Farewell Dinner", venue: "Sheraton Hotel", note: "Farewell Banquet Buffet", isBuffet: true, isFarewell: true },
  ]},
  { day: 12, title: "Departure Day", location: "St. John's Airport", subtitle: "Transfer to airport.", meals: [
    { type: "Breakfast", note: "Included at hotel" },
  ]},
];

const TAG = {
  V:     { color: "#ffffff", bg: "#43a047" },
  VG:    { color: "#ffffff", bg: "#2e7d32" },
  GF:    { color: "#1a1a1a", bg: "#daa520" },
  "GF*": { color: "#1a1a1a", bg: "#c49520" },
  DF:    { color: "#ffffff", bg: "#1e88e5" },
  LF:    { color: "#ffffff", bg: "#42a5f5" },
};
const ICONS = { Breakfast: "\u2600\ufe0f", Lunch: "\ud83c\udf7d\ufe0f", Dinner: "\ud83c\udf19", "Farewell Dinner": "\ud83e\udd42" };
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyybHDGb5rRsdNOg-YM2j8eg_0PNhbsrCBJjBIQgNs_rK-uRAGWwxxjl4GXxojnivre/exec";
const PFX = "mcp-";
function localSave(k, v) { try { localStorage.setItem(PFX+k, JSON.stringify(v)); } catch(e){} }
function localLoad(k) { try { var r = localStorage.getItem(PFX+k); return r ? JSON.parse(r) : null; } catch(e) { return null; } }
function loadAllGuests() {
  try {
    var out = {};
    for (var i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i);
      if (key && key.startsWith(PFX+"g-")) {
        try { var p = JSON.parse(localStorage.getItem(key)); out[p.name] = p; } catch(e){}
      }
    }
    return out;
  } catch(e) { return {}; }
}
function sendToSheet(mealTab, guestName, section, selection, dietaryNotes) {
  if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL === "YOUR_GOOGLE_SCRIPT_URL_HERE") return;
  if (!guestName || !selection) return;
  try {
    var p = new URLSearchParams();
    p.append("mealTab", mealTab); p.append("guestName", guestName);
    p.append("section", section); p.append("selection", selection);
    p.append("dietaryNotes", dietaryNotes || "");
    fetch(GOOGLE_SCRIPT_URL + "?" + p.toString()).then(function(){console.log("Sent: "+guestName+" > "+selection);}).catch(function(){console.log("Sheet sync pending");});
  } catch(e) { console.log("Sheet error"); }
}

export default function App() {
  const [mode, setMode] = useState("splash");
  const [gName, setGName] = useState("");
  const [gSel, setGSel] = useState({});
  const [gNotes, setGNotes] = useState("");
  const [allG, setAllG] = useState({});
  const [view, setView] = useState("days");
  const [sDay, setSDay] = useState(null);
  const [sMeal, setSMeal] = useState(null);
  const [pin, setPin] = useState("");
  const [pinErr, setPinErr] = useState(false);
  const [aView, setAView] = useState("overview");
  const [aDay, setADay] = useState(null);
  const [aMeal, setAMeal] = useState(null);
  const [showEmail, setShowEmail] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [animIn, setAnimIn] = useState(false);
  const [saving, setSaving] = useState(false);
  const ref = useRef(null);

  useEffect(function(){setTimeout(function(){setAnimIn(true);},100);},[]);
  useEffect(function(){if(ref.current)ref.current.scrollTo({top:0,behavior:"smooth"});},[view,sDay,sMeal,aView,showSetup]);

  var doSave = useCallback(function(name,sels,notes){
    setSaving(true);
    localSave("g-"+name.toLowerCase().replace(/\s+/g,"-"),{name:name,selections:sels,notes:notes||"",updatedAt:new Date().toISOString()});
    setSaving(false);
  },[]);

  var getDietaryNotes = function(){
    if(gNotes&&gNotes.trim()) return gNotes.trim();
    try{return localStorage.getItem("mcp-dietNotes")||"";}catch(e){return "";}
  };

  var pick = function(d,mt,sec,item){
    var k=d+"|"+mt+"|"+sec;
    var next=Object.assign({},gSel);next[k]=item;
    setGSel(next);
    var notes=getDietaryNotes();
    doSave(gName,next,notes);
    if(item&&gName){sendToSheet("Day "+d+" "+mt,gName,sec,item,notes);}
  };
  var getPick = function(d,mt,sec){return gSel[d+"|"+mt+"|"+sec];};
  var pickCount = function(d){return Object.keys(gSel).filter(function(k){return k.startsWith(d+"|");}).length;};
  var mealComplete = function(day,meal){
    if(!meal.sections)return false;
    var req=meal.sections.filter(function(s){return !s.fixed;});
    if(req.length===0)return false;
    return req.every(function(sec){return !!getPick(day.day,meal.type,sec.title);});
  };

  var guestLogin = function(){
    if(!gName.trim())return;
    var n=gName.trim();
    var ex=localLoad("g-"+n.toLowerCase().replace(/\s+/g,"-"));
    if(ex){setGSel(ex.selections||{});if(ex.notes)setGNotes(ex.notes);}
    else{setGSel({});}
    try{localStorage.setItem("mcp-dietNotes",gNotes||"");}catch(e){}
    localSave("g-"+n.toLowerCase().replace(/\s+/g,"-"),{name:n,selections:ex?ex.selections||{}:{},notes:gNotes||"",updatedAt:new Date().toISOString()});
    setGName(n);setMode("guest");
  };
  var adminLogin = function(){
    if(pin===ADMIN_PIN){setPinErr(false);setAllG(loadAllGuests());setMode("admin");}
    else setPinErr(true);
  };
  var refresh = function(){setAllG(loadAllGuests());};

  var buildEmailBody = function(day,meal){
    var guests=Object.values(allG);
    var secs=(meal.sections||[]).filter(function(s){return !s.fixed;});
    var body="Hi,\n\nPlease find the meal orders for McCarthy's Party tour group:\n\n";
    body+="Date: Day "+day.day+" of 12-Day Tour\n";
    if(meal.time)body+="Time: "+meal.time+"\n";
    body+="Group Size: "+guests.length+" guests\n\n";
    secs.forEach(function(sec){
      body+=sec.title+":\n";var tally={};
      sec.items.forEach(function(i){tally[i.name]=[];});
      guests.forEach(function(g){var c=g.selections?g.selections[day.day+"|"+meal.type+"|"+sec.title]:null;if(c&&tally[c])tally[c].push(g.name);});
      sec.items.forEach(function(i){if(tally[i.name]&&tally[i.name].length>0)body+="  "+i.name+": "+tally[i.name].length+"\n";});
      body+="\n";
    });
    body+="Special dietary notes:\n";
    guests.filter(function(g){return g.notes;}).forEach(function(g){body+="  - "+g.name+": "+g.notes+"\n";});
    body+="\nThank you!\nMcCarthy's Party Inc.\n";
    return body;
  };

  // SPLASH
  if(mode==="splash"){return(<div style={S.splash}><Fonts/><div style={{...S.fadeIn,opacity:animIn?1:0,transform:animIn?"translateY(0)":"translateY(30px)"}}><Compass/><div style={S.brand}>McCarthy's Party</div><div style={{fontSize:"10px",color:"rgba(255,255,255,0.4)",fontFamily:F.body,fontWeight:300,letterSpacing:"1.5px",marginBottom:"4px"}}>Let the Locals Be Your Guide</div><h1 style={S.h1big}>Culinary Guide</h1><div style={S.line}/><p style={S.subtext}>Your personal dining companion for<br/>12 unforgettable days across<br/>Newfoundland & Labrador</p><p style={{...S.subtext,fontSize:"12px",color:"rgba(240,234,214,0.25)",fontStyle:"italic",margin:"0 0 32px"}}>2026 Season</p><div style={{display:"flex",flexDirection:"column",gap:"12px",alignItems:"center",width:"100%"}}><button onClick={function(){setMode("login");}} style={S.goldBtn}>I'm a Guest</button><button onClick={function(){setMode("adminLogin");}} style={S.ghostBtn}>Guide Login</button></div></div></div>);}

  // GUEST LOGIN
  if(mode==="login"){return(<div style={S.splash}><Fonts/><div style={{textAlign:"center",padding:"0 28px",maxWidth:"400px"}}><Compass/><h2 style={{...S.h1big,fontSize:"28px",marginBottom:"8px"}}>Welcome!</h2><p style={{...S.subtext,marginBottom:"24px"}}>Enter your name to view menus and make your meal selections.</p><input value={gName} onChange={function(e){setGName(e.target.value);}} onKeyDown={function(e){if(e.key==="Enter")guestLogin();}} placeholder="Your full name" style={S.input} autoFocus/><div style={{marginTop:"12px"}}><label style={{fontSize:"12px",color:"rgba(240,234,214,0.4)"}}>Dietary needs or allergies (optional)</label><input value={gNotes} onChange={function(e){setGNotes(e.target.value);}} placeholder="e.g., Gluten-free, nut allergy" style={{...S.input,marginTop:"6px",fontSize:"14px"}}/></div><button onClick={guestLogin} style={{...S.goldBtn,marginTop:"20px",width:"100%"}}>Continue</button><button onClick={function(){setMode("splash");}} style={{...S.backBtn,marginTop:"16px"}}>← Back</button></div></div>);}

  // ADMIN LOGIN
  if(mode==="adminLogin"){return(<div style={S.splash}><Fonts/><div style={{textAlign:"center",padding:"0 28px",maxWidth:"400px"}}><Compass/><h2 style={{...S.h1big,fontSize:"28px",marginBottom:"8px"}}>Guide Login</h2><p style={{...S.subtext,marginBottom:"24px"}}>Enter your PIN to access the dashboard.</p><input value={pin} onChange={function(e){setPin(e.target.value);setPinErr(false);}} onKeyDown={function(e){if(e.key==="Enter")adminLogin();}} placeholder="PIN" type="password" style={{...S.input,textAlign:"center",letterSpacing:"8px",fontSize:"24px"}} autoFocus/>{pinErr&&<div style={{color:"#e74c3c",fontSize:"13px",marginTop:"8px"}}>Incorrect PIN</div>}<button onClick={adminLogin} style={{...S.goldBtn,marginTop:"16px",width:"100%"}}>Access Dashboard</button><button onClick={function(){setMode("splash");setPin("");setPinErr(false);}} style={{...S.backBtn,marginTop:"16px"}}>← Back</button></div></div>);}

  // ADMIN SETUP
  if(mode==="admin"&&showSetup){return(<div style={S.page}><Fonts/><Hdr onBack={function(){setShowSetup(false);}} title="Google Sheets Setup" subtitle="How to connect this app"/><div ref={ref} style={S.content}><StepCard num="1" title="Create Google Sheet" color="#4285f4"><p style={S.stepText}>Create a spreadsheet with one tab per meal.</p></StepCard><StepCard num="2" title="Create Apps Script" color="#0f9d58"><p style={S.stepText}>Extensions → Apps Script, paste the code.</p></StepCard><StepCard num="3" title="Deploy" color="#f4b400"><p style={S.stepText}>Deploy as Web App, copy URL.</p></StepCard></div></div>);}

  // ADMIN EMAIL
  if(mode==="admin"&&showEmail&&aDay!==null&&aMeal!==null){var eDay=TOUR_DATA[aDay];var eMeal=eDay.meals[aMeal];var emailBody=buildEmailBody(eDay,eMeal);return(<div style={S.page}><Fonts/><Hdr onBack={function(){setShowEmail(false);}} title="Email to Restaurant" subtitle={eMeal.venue}/><div ref={ref} style={S.content}><div style={{background:"rgba(240,234,214,0.06)",borderRadius:"10px",padding:"18px",marginBottom:"16px"}}><div style={{fontSize:"12px",color:"rgba(240,234,214,0.4)",marginBottom:"4px"}}>To:</div><div style={{fontSize:"14px",color:"#f0ead6",fontWeight:600,marginBottom:"12px"}}>{eMeal.email||eMeal.phone||"Restaurant"}</div><div style={{fontSize:"12px",color:"rgba(240,234,214,0.4)",marginBottom:"4px"}}>Subject:</div><div style={{fontSize:"14px",color:"#f0ead6",fontWeight:600,marginBottom:"12px"}}>{"McCarthy's Party - Day "+eDay.day+" "+eMeal.type+" Order"}</div><div style={{fontSize:"12px",color:"rgba(240,234,214,0.4)",marginBottom:"8px"}}>Body:</div><pre style={{fontSize:"12px",color:"rgba(240,234,214,0.7)",lineHeight:1.6,whiteSpace:"pre-wrap",fontFamily:F.body,margin:0,padding:"14px",background:"rgba(0,0,0,0.2)",borderRadius:"8px"}}>{emailBody}</pre></div><div style={{display:"flex",gap:"10px"}}><button onClick={function(){if(navigator.clipboard)navigator.clipboard.writeText(emailBody);}} style={{...S.goldBtn,flex:1,padding:"12px",fontSize:"12px"}}>Copy to Clipboard</button><button onClick={function(){setShowEmail(false);}} style={{...S.ghostBtn,flex:1,padding:"12px",fontSize:"12px"}}>Back</button></div></div></div>);}

  // ADMIN MEAL TALLY
  if(mode==="admin"&&aView==="meal"&&aDay!==null&&aMeal!==null){var tDay=TOUR_DATA[aDay];var tMeal=tDay.meals[aMeal];var guests=Object.values(allG);var tSecs=(tMeal.sections||[]).filter(function(s){return !s.fixed;});var tallies={};tSecs.forEach(function(sec){tallies[sec.title]={};sec.items.forEach(function(i){tallies[sec.title][i.name]=[];});tallies[sec.title]["_none"]=[];});guests.forEach(function(g){tSecs.forEach(function(sec){var c=g.selections?g.selections[tDay.day+"|"+tMeal.type+"|"+sec.title]:null;if(c&&tallies[sec.title][c])tallies[sec.title][c].push(g.name);else tallies[sec.title]["_none"].push(g.name);});});
    return(<div style={S.page}><Fonts/><Hdr onBack={function(){setAView("overview");setADay(null);setAMeal(null);}} title={"Day "+tDay.day+" - "+tMeal.type} subtitle={tMeal.venue}/><div ref={ref} style={S.content}>
      {tMeal.venue&&<div style={S.venueCard}><div style={{fontSize:"15px",fontFamily:F.display,fontWeight:700,color:"#f0ead6",marginBottom:"4px"}}>{tMeal.venue}</div><div style={{fontSize:"12px",color:"rgba(240,234,214,0.5)"}}>{tMeal.phone&&<span>{"📞 "+tMeal.phone}</span>}{tMeal.time&&<span>{" · 🕐 "+tMeal.time}</span>}</div>{tMeal.deadline&&<div style={{marginTop:"6px",fontSize:"11px",color:"#daa520"}}>{"⏰ Deadline: "+tMeal.deadline}</div>}</div>}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"14px"}}><span style={{fontSize:"12px",color:"rgba(240,234,214,0.4)"}}>{guests.length+" guests"}</span><div style={{display:"flex",gap:"8px"}}><button onClick={function(){setShowEmail(true);}} style={{...S.ghostBtn,padding:"6px 14px",fontSize:"11px"}}>📧 Email</button><button onClick={refresh} style={{...S.backBtn,fontSize:"12px"}}>↻ Refresh</button></div></div>
      {tSecs.map(function(sec,si){return(<div key={si} style={{marginBottom:"24px"}}><SectionHead title={sec.title}/>{sec.items.map(function(item,ii){var v=tallies[sec.title][item.name]||[];return(<div key={ii} style={{background:"rgba(240,234,214,0.04)",border:"1px solid rgba(240,234,214,0.06)",borderRadius:"7px",padding:"11px 13px",marginBottom:"5px"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{display:"flex",alignItems:"center",gap:"7px"}}>{item.num&&<Num n={item.num}/>}<span style={{fontSize:"13px",fontWeight:600}}>{item.name}</span></div><span style={{fontSize:"20px",fontWeight:700,color:"#daa520"}}>{v.length}</span></div>{v.length>0&&<div style={{marginTop:"5px",paddingLeft:item.num?"28px":0,fontSize:"11px",color:"rgba(240,234,214,0.4)",lineHeight:1.5}}>{v.join(", ")}</div>}</div>);})}{tallies[sec.title]["_none"].length>0&&(<div style={{background:"rgba(231,76,60,0.06)",border:"1px solid rgba(231,76,60,0.12)",borderRadius:"7px",padding:"10px 13px",marginTop:"4px"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:"12px",color:"rgba(231,76,60,0.7)",fontWeight:500}}>Not yet selected</span><span style={{fontSize:"16px",fontWeight:700,color:"rgba(231,76,60,0.6)"}}>{tallies[sec.title]["_none"].length}</span></div><div style={{marginTop:"4px",fontSize:"11px",color:"rgba(231,76,60,0.45)",lineHeight:1.4}}>{tallies[sec.title]["_none"].join(", ")}</div></div>)}</div>);})}
      {guests.filter(function(g){return g.notes;}).length>0&&(<div style={{marginTop:"8px"}}><SectionHead title="Dietary Notes"/>{guests.filter(function(g){return g.notes;}).map(function(g,i){return(<div key={i} style={{fontSize:"12px",color:"rgba(240,234,214,0.5)",marginBottom:"4px"}}><strong style={{color:"rgba(240,234,214,0.7)"}}>{g.name+":"}</strong> {g.notes}</div>);})}</div>)}
    </div></div>);}

  // ADMIN OVERVIEW
  if(mode==="admin"){var gl=Object.values(allG);return(<div style={S.page}><Fonts/><div style={{padding:"18px 20px 0",maxWidth:"540px",margin:"0 auto"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><div><div style={S.brandLabel}>Guide Dashboard</div><h1 style={{margin:0,fontSize:"21px",fontFamily:F.display,fontWeight:700,color:"#f0ead6"}}>Meal Orders</h1></div><div style={{display:"flex",gap:"8px",alignItems:"center"}}><button onClick={function(){setShowSetup(true);}} style={{...S.ghostBtn,padding:"5px 12px",fontSize:"11px"}}>⚙️ Setup</button><button onClick={refresh} style={{...S.ghostBtn,padding:"5px 12px",fontSize:"11px"}}>↻</button><button onClick={function(){setMode("splash");setPin("");}} style={{...S.backBtn,fontSize:"11px"}}>Logout</button></div></div><div style={{width:"36px",height:"2px",background:"#daa520",margin:"10px 0 5px"}}/><div style={{fontSize:"11px",color:"rgba(240,234,214,0.35)",marginBottom:"18px"}}>{gl.length+" guests · Tap a meal for tallies"}</div></div>
    <div ref={ref} style={{padding:"0 20px 36px",maxWidth:"540px",margin:"0 auto"}}>{TOUR_DATA.map(function(day,di){var sm=day.meals.filter(function(m){return m.sections&&!m.isBuffet&&!m.isOnOwn;});if(!sm.length)return null;return(<div key={di} style={{marginBottom:"14px"}}><div style={{fontSize:"11px",color:"rgba(240,234,214,0.3)",fontWeight:500,marginBottom:"5px",letterSpacing:"0.5px"}}>{"DAY "+day.day+" — "+day.title.toUpperCase()}</div>{sm.map(function(meal,mi){var ri=day.meals.indexOf(meal);var secs=(meal.sections||[]).filter(function(s){return !s.fixed;});var responded=gl.filter(function(g){return secs.some(function(s){return g.selections&&g.selections[day.day+"|"+meal.type+"|"+s.title];});}).length;var allDone=responded===gl.length&&gl.length>0;return(<button key={mi} onClick={function(){setADay(di);setAMeal(ri);setAView("meal");}} style={S.card}><div style={{display:"flex",alignItems:"center",gap:"10px",padding:"10px 12px"}}><span style={{fontSize:"18px"}}>{ICONS[meal.type]||"🍽️"}</span><div style={{flex:1}}><div style={{fontSize:"13px",fontWeight:600,fontFamily:F.body}}>{meal.type}</div><div style={{fontSize:"11px",color:"rgba(240,234,214,0.45)"}}>{meal.venue}</div></div><div style={{textAlign:"right"}}><div style={{fontSize:"17px",fontWeight:700,color:allDone?"#4a7c59":"#daa520"}}>{responded+"/"+gl.length}</div><div style={{fontSize:"9px",color:"rgba(240,234,214,0.35)"}}>responded</div></div><span style={{color:"rgba(218,165,32,0.4)",fontSize:"14px"}}>→</span></div></button>);})}</div>);})}</div></div>);}

  // GUEST MEAL DETAIL
  if(mode==="guest"&&view==="meal"&&sDay!==null&&sMeal!==null){
    var mDay=TOUR_DATA[sDay];var mMeal=mDay.meals[sMeal];var isComplete=mealComplete(mDay,mMeal);
    return(<div style={S.page}><Fonts/>
      <Hdr onBack={function(){setView("day");}} title={mMeal.type} subtitle={"Day "+mDay.day+" · "+mMeal.venue} extra={saving?<span style={{fontSize:"10px",color:"#4a7c59"}}>Saving...</span>:null}/>
      <div ref={ref} style={S.content}>
        <div style={S.venueCard}>
          <div style={{fontSize:"18px",fontFamily:F.display,fontWeight:700,color:"#f0ead6",marginBottom:"6px"}}>{mMeal.venue}</div>
          <div style={{fontSize:"14px",color:"rgba(240,234,214,0.6)",lineHeight:1.7}}>
            {mMeal.venueLocation&&<div>{"📍 "+mMeal.venueLocation}</div>}
            {mMeal.phone&&<div>{"📞 "+mMeal.phone}</div>}
            {mMeal.time&&<div>{"🕐 "+mMeal.time}</div>}
          </div>
          {mMeal.leadTime&&<div style={{marginTop:"8px",padding:"6px 10px",background:"rgba(218,165,32,0.1)",borderRadius:"5px",fontSize:"11px",color:"#daa520",border:"1px solid rgba(218,165,32,0.2)"}}>{"⚠️ "+mMeal.leadTime}</div>}
          {mMeal.deadline&&<div style={{marginTop:"5px",padding:"6px 10px",background:"rgba(74,124,89,0.1)",borderRadius:"5px",fontSize:"11px",color:"#4a7c59",border:"1px solid rgba(74,124,89,0.2)"}}>{"⏰ Select by: "+mMeal.deadline}</div>}
        </div>
        {mMeal.sections&&mMeal.sections.map(function(sec,si){
          if(sec.fixed)return(<div key={si} style={{padding:"10px 14px",background:"rgba(240,234,214,0.04)",borderRadius:"7px",marginBottom:"14px",fontSize:"12px",color:"rgba(240,234,214,0.5)",fontStyle:"italic"}}>{"✓ Included: "+sec.items.map(function(i){return i.name;}).join(", ")}</div>);
          var cur=getPick(mDay.day,mMeal.type,sec.title);
          return(<div key={si} style={{marginBottom:"22px"}}>
            <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"10px"}}>
              <h3 style={{fontSize:"17px",fontFamily:F.body,fontWeight:700,color:"#daa520",margin:0,whiteSpace:"nowrap"}}>{sec.title+" – Select One"}</h3>
              <div style={{flex:1,height:"1px",background:"linear-gradient(90deg, rgba(218,165,32,0.3), transparent)"}}/>
              {cur&&<span style={{fontSize:"11px",color:"#4a7c59",fontWeight:600}}>✓</span>}
            </div>
            {sec.items.map(function(item,ii){
              var active=cur===item.name;
              return(<button key={ii} onClick={function(){pick(mDay.day,mMeal.type,sec.title,active?null:item.name);}} style={{...S.menuItem,background:active?"rgba(218,165,32,0.12)":"rgba(240,234,214,0.04)",border:active?"1px solid rgba(218,165,32,0.4)":"1px solid rgba(240,234,214,0.06)"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:"8px",flexWrap:"wrap"}}>
                      {item.num&&<Num n={item.num} active={active}/>}
                      <span style={{fontSize:"16px",fontWeight:700}}>{item.name}</span>
                      {item.tags&&item.tags.map(function(t){return <DietTag key={t} t={t}/>;})}
                    </div>
                    {item.desc&&<div style={{fontSize:"13px",color:"rgba(240,234,214,0.55)",marginTop:"5px",paddingLeft:item.num?"30px":0}}>{item.desc}</div>}
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:"7px",flexShrink:0,marginLeft:"10px"}}>
                    {item.price&&<span style={{fontSize:"11px",color:"rgba(240,234,214,0.3)"}}>{item.price}</span>}
                    <Radio on={active}/>
                  </div>
                </div>
              </button>);
            })}
          </div>);
        })}
        {mMeal.footerNote&&<div style={S.footNote}>{mMeal.footerNote}</div>}
        {isComplete&&(<button onClick={function(){setView("day");}} style={{...S.goldBtn,width:"100%",marginTop:"20px",padding:"14px",fontSize:"16px",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px"}}><span>✓</span> {"Selections Complete — Back to Day "+mDay.day}</button>)}
      </div>
    </div>);
  }

  // GUEST DAY DETAIL
  if(mode==="guest"&&view==="day"&&sDay!==null){
    var dDay=TOUR_DATA[sDay];
    return(<div style={S.page}><Fonts/>
      <Hdr onBack={function(){setView("days");setSDay(null);}} title={"Day "+dDay.day} subtitle={dDay.title}/>
      <div ref={ref} style={S.content}>
        <div style={{fontSize:"13px",color:"rgba(240,234,214,0.45)",marginBottom:"5px"}}>{"📍 Overnight: "+dDay.location}</div>
        <p style={{fontSize:"12px",color:"rgba(240,234,214,0.35)",lineHeight:1.5,margin:"0 0 20px",fontStyle:"italic"}}>{dDay.subtitle}</p>
        {dDay.meals.length===0&&<div style={{textAlign:"center",padding:"36px 20px",color:"rgba(240,234,214,0.3)"}}><div style={{fontSize:"28px",marginBottom:"8px"}}>🍽️</div><p style={{fontSize:"13px",margin:0}}>No included meals today.</p></div>}
        {dDay.meals.map(function(meal,mi){
          var icon=ICONS[meal.type]||"🍽️";
          var hasMenu=meal.sections&&!meal.isBuffet&&!meal.isOnOwn;
          var isBreakfast=meal.type==="Breakfast"&&!hasMenu;
          var sc=hasMenu?Object.keys(gSel).filter(function(k){return k.startsWith(dDay.day+"|"+meal.type+"|");}).length:0;
          if(isBreakfast){return(<div key={mi} style={{...S.card,cursor:"default",opacity:0.7,marginBottom:"6px"}}><div style={{display:"flex",alignItems:"stretch"}}><div style={{width:"44px",display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(74,200,120,0.1)",borderRight:"1px solid rgba(74,200,120,0.2)",fontSize:"18px",flexShrink:0}}>{icon}</div><div style={{flex:1,padding:"11px 13px"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:"15px",fontWeight:700,fontFamily:F.body}}>Breakfast</span><span style={{fontSize:"11px",color:"#4a7c59",fontWeight:600}}>✓ Included</span></div><div style={{fontSize:"10px",color:"rgba(240,234,214,0.35)",marginTop:"2px"}}>{meal.note||"Included at hotel"}</div></div></div></div>);}
          return(<button key={mi} onClick={function(){if(hasMenu){setSMeal(mi);setView("meal");}}} style={{...S.card,cursor:hasMenu?"pointer":"default"}}><div style={{display:"flex",alignItems:"stretch"}}><div style={{width:"44px",display:"flex",alignItems:"center",justifyContent:"center",background:meal.isFarewell?"rgba(218,165,32,0.12)":"rgba(218,165,32,0.06)",borderRight:"1px solid rgba(218,165,32,0.1)",fontSize:"18px",flexShrink:0}}>{icon}</div><div style={{flex:1,padding:"11px 13px"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:"15px",fontWeight:700,fontFamily:F.body}}>{meal.type}</span>{hasMenu&&<div style={{display:"flex",alignItems:"center",gap:"4px"}}>{sc>0&&<span style={{fontSize:"10px",color:"#4a7c59",fontWeight:600}}>{"✓ "+sc}</span>}<span style={{color:"rgba(218,165,32,0.5)",fontSize:"13px"}}>→</span></div>}</div>{meal.venue&&<div style={{fontSize:"13px",color:"rgba(240,234,214,0.6)",marginTop:"2px"}}>{meal.venue}</div>}{meal.time&&<div style={{fontSize:"10px",color:"rgba(240,234,214,0.3)",marginTop:"1px"}}>{"🕐 "+meal.time}</div>}{meal.note&&<div style={{fontSize:"10px",color:meal.pending?"rgba(218,165,32,0.5)":"rgba(240,234,214,0.3)",marginTop:"3px",fontStyle:meal.pending?"italic":"normal"}}>{meal.note}</div>}{meal.isBuffet&&!meal.isFarewell&&<Pill text="Buffet"/>}{meal.isOnOwn&&<Pill text="On your own" dim/>}{meal.isFarewell&&<Pill text="Farewell Banquet" gold/>}</div></div></button>);
        })}
      </div>
    </div>);
  }

  // GUEST DAY LIST (v2: sans-serif for readability)
  return(<div style={S.page}><Fonts/>
    <div style={{padding:"16px 20px 0",maxWidth:"540px",margin:"0 auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div><div style={S.brandLabel}>McCarthy's Party</div><h1 style={{margin:0,fontSize:"24px",fontFamily:F.body,fontWeight:700,color:"#f0ead6"}}>Your Tour Menus</h1></div>
        <div style={{textAlign:"right"}}><div style={{fontSize:"11px",color:"rgba(240,234,214,0.45)",marginBottom:"3px"}}>{gName}</div><button onClick={function(){setMode("splash");setGName("");setGSel({});}} style={{...S.backBtn,fontSize:"11px"}}>Logout</button></div>
      </div>
      <div style={{width:"36px",height:"2px",background:"#daa520",margin:"10px 0 14px"}}/>
      <p style={{fontSize:"13px",color:"rgba(240,234,214,0.35)",margin:"0 0 16px",lineHeight:1.4}}>Tap a day to browse menus and make selections. Your choices are saved automatically.</p>
    </div>
    <div ref={ref} style={{padding:"0 20px 36px",maxWidth:"540px",margin:"0 auto"}}>
      {TOUR_DATA.map(function(day,i){
        var tc=pickCount(day.day);var mt=day.meals.map(function(m){return m.type;}).filter(function(t){return t!=="Breakfast";});
        return(<button key={i} onClick={function(){setSDay(i);setView("day");}} style={S.card}><div style={{display:"flex",alignItems:"center"}}><div style={{width:"46px",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,background:"rgba(218,165,32,0.06)",borderRight:"1px solid rgba(218,165,32,0.1)",alignSelf:"stretch"}}><div><div style={{fontSize:"8px",color:"#daa520",letterSpacing:"1px",textTransform:"uppercase",textAlign:"center",fontWeight:500}}>Day</div><div style={{fontSize:"22px",fontWeight:700,color:"#daa520",textAlign:"center",fontFamily:F.display}}>{day.day}</div></div></div><div style={{flex:1,padding:"10px 12px"}}><div style={{fontSize:"15px",fontWeight:700,fontFamily:F.body,lineHeight:1.3,marginBottom:"3px"}}>{day.title}</div><div style={{fontSize:"12px",color:"rgba(240,234,214,0.4)",display:"flex",alignItems:"center",gap:"5px",flexWrap:"wrap"}}><span>{"📍 "+day.location}</span>{mt.length>0&&<><span>·</span><span>{mt.join(", ")}</span></>}{tc>0&&<span style={{color:"#4a7c59",fontWeight:600}}>{"✓ "+tc}</span>}</div></div><div style={{paddingRight:"12px",color:"rgba(218,165,32,0.4)",fontSize:"13px"}}>→</div></div></button>);
      })}
    </div>
    <div style={{textAlign:"center",padding:"12px 20px 24px",fontSize:"10px",color:"rgba(240,234,214,0.15)",borderTop:"1px solid rgba(240,234,214,0.05)",maxWidth:"540px",margin:"0 auto"}}>McCarthy's Party · Newfoundland & Labrador Tours · Since 1982</div>
  </div>);
}

// COMPONENTS
function Compass(){return <div style={{width:"180px",margin:"0 auto 18px"}}><img src={"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAIAAAAiOjnJAAAqyklEQVR42u29eZSdR3Xou/eu+oYz9txSd6tbktWaJ1uyJEs2HplH5zqAycvlkpeQZF24XHJJFoQs8gLk5T7AwH0JIUzhxkwmYIgheHY8Cw+a56G71fM8n6HPOd9Xtff743TLY6YX2+CkfmtpqZfW6a9Pf9/vVO3ae1cJ6a2fB4fjpYbcLXA4sRxOLIcTy+FwYjmcWA4nlsPhxHI4sRxOLIfDieVwYjmcWA6HE8vhxHI4sRwOJ5bDieVwYjkcTiyHE8vhxHI4nFgOJ5bDieVwOLEcTiyHE8vhcGI5nFgOJ5bD4cRyOLEcTiyHw4nlcGI5nFgOhxPL4cRyOLEcDieWw4nlcGI5HE4shxPL4cRyOJxYDieWw4nlcDixHE4shxPL4XBiOZxYDieWw+HEcjixHE4sh8OJ5XBiOZxYDocTy+HEcjixHA4nlsOJ5XBiORxOLIcTy/FqRv/bLyEi7j7+uwERf1nEcm45sdxU6HAxluM/eIzlcDOgG7Ec/8FGLAQAufgVgICgezpOrH+jVQJ0cVm59AWDc8sF7w6HE8vxH1QspRTSL90siEs4aV6VYiFiGITCAu4JOrFeyjckEoaBCC9F8vLPrib///JPXxxf7OL4L/yJ7kPxS7EqFEJmQSQR1pqCUAtXlNJKa8NiLQMqEARkIAOAyD7YAAAQDWAMZBAQ2AdRgMzIgoACCAIAggIgKCRU/ZqRgQQFBIARGFCsKBAfkJBEhEEQBAAJBIEYgKF6IUQAAkFA+4KBFkQQBBAYQVAYKWZICmmAIloS9AQBnltURRAlhgkZCEVAQAgWf4QT66UwCwQJkAUYEIPQA2Rh6+uAREomAlQACEDVNyxAgELAhDFgyGiFLQAiWoUlAGTwAFEEAVAACADFIrMQVwUhURZJEHHxUSMAKUGyIIggzGAFWAgBNQoCMi0OcCJI/CK/goLFUVYDCKAVFBAPBBAvZuVeZIIXJBENiAIxgqCo6nt2Yr0kYgmRQrEiFi2HQQBIltn3fU+wtFABBJCLSVQEZMIIJUJTYRMxIYUBagSuiJQRPRASJAANSChUbb4gQbICgALKggdCAGLBA6yOSTEKeQyGgFEQBcBUb5EQAaAgExsCa0EB6ucNuQIEEBMgSSikBCOGQKMmiCwTI6EYEHneNwqgVQFapVgYrCAjKwCAF1PXifWvD9gJEUExp9LJaKEQeIoQGcDTmhGr44kAoLAmZLZiSx7EIcV1WWrMalHh+cHJXIExSKGXETaIIkAAiCJaIo+QURsmKwqASBEBaAPMwqgtsmCkIAKECDWTZtSEvgIf4ogCJagNIyMI2aofS9WBi7EaISoSQTE+WQYyCITK5KeULapklrWHEJOIeZFfXWkwykaxQoMeAQmyG7FeMpjZQ2jMpsaLs4GvkQiM8YPAWL4Yl4ioqFipzSaytfh/3vyGnWuWN2fD5oaamPHoyQv3Pn7yvqd6RnJE2rdgQBQCai5RNGXKeQM+6wwkG7TvmcI02qJnDGEAYY14ISMCgiBbZAAmpWShyOViSktcqpSY/JrlsQQCngUFaBZjLKn+QSAmYCWiJbbFUYtEiaQwXLG1qcZf9uSJEQMJwItz5XNzK2CpMII28jLNBkOgGMX+O8gv/nIE7wIAqAhq0skxkDAIUCupVMJEolIugzAAIhJG89u3r+5oaz382F2v27FqX1szgDAIAa3ds+FtezY83D39mx//2njBgkoB+4qtinJX7Vx1/a5OH6h7Bv/27gNzhekNrZn3vPmNisxMCW77yZOTJSCVJPIErAKLzFye3n5J839+8+s2ddTmF0p3Pn7q9vsOiVfHlEJQQChIzAwgSCQiiELKqAh9jtdvWe4ng5OnR4oLcx/5rXd1rmh/y3s/XUAE9ICjajZMmKtxnQLAhfyvvuny2rS+9c4TCB6qCgqzeCLWifWv9girdUAkBBQgBAZTIh0kMhnkuL4m1KANYzJIcsWiQeWRCNmodNmWtq7Tp4rz4/liuXfOzE/lx/NzXC5u72xtbapfv7oh5bE1rJQoMKQwjuLdW1b94TvfKAC9RfvYE0dnJxd2blj/BzdfZ4CHi/Hf/uxxYWJbspUIoKy1qEQyreVTH3jH67Z2XJgo1tSmrt+7bWo6f9dTA16IUTEPqCBIeH4ShaLivA60EYhzRc9PFUzlQ7/5ptWXrH3zzb/PdkFHFRWXy8UZGxUhmfGDOqqUWAz4oYdojLZWbLzwX26+vqU28f17juVLc0byYGLw016QMgAClpgQyL7aAvpfgFgIgrAYAwESABGwIlZhCrQvUX6q/1x5fEQYUworIGJiH0EUVSgIMH3Zlm2D3ef+5Au3zs3JfEHlyzObO+rWNVHH8uyGK643kkaoABiAilUJC8gVu2Ds4eNntm1Zn/EQbFBbm5mdm54YGUo3rUb0qDLbuaJh05aNNR6fOHfuUNf4trXr3rC146dPnPzAx75+w5Wbvv1nv71ny8q7HjrV2ZrYcc0mncj0DE4fPTNqIv/yS5ryueFUbf2e9Vv27z80K9GaDDZFle1rao+cKaW8sJjLrVrR8M7L1p8dnj1wYnptS1bXBL0Dk3HFpP1lK1cuGx+Ze+Tnj92wd5+t5Laubbhs3XpbKu8/0j08XfAzNRWOgRAE/7l8nhMLAFAxCAAQW0BLAMwGQcWxOXXk4HtuvH5zx7L1DalzQ2M1YSEXj4Y4XZ6fZ6Uhig4cOrx6eeoTH/ntofGpT33hx2Htqkolfv31e3/rrbsefGz///ulb05Op5RXw2JwaWFPpJDwbFfXjss2Z0IP4uLqFcsmJqeHZwqb2sO4OHdpR/g3X/hAS2NWA0wtxL/+0c8HZsEHOHWhf2K6eP7CREmg1os31Bd/8PkPtLfUVp/w733xx9/98f7PfPx3/MpEtqZuW2vj7RtrhkulPZ2dc8Xi9770if/jw7cU5iZ2rLn0q1/8+JrG5EJF3vuRW65/zeb3v/MN7/3Yn9/78IndV6384eff/UefKw1OTD1xdnjD6rbbvvDBVKBCgp93Tbz3Q381XWHwAkYLYF91ma1fSJBIBEqJKAQxFVsppgO/tn6Z1t7c1Ni+rR0fese+v/jDm3/8lx++5SM3feWP//NtX/zvn//Yzf/tnXtuet3WaLK3Tmbfc/X2jtqE53kYZBgClKijNvtrb3tT++rOwkIJPfXsPKQwe0RjM7lCFF3S0QQYb1jVNjFbrBhRvqpExXe//dpNjdn/54vf+Ogf/d8rkt7brt+J0SwAsBdiupmTzSXEEqnLLt+6uaX2i3/zw/d/5JMYVd51/ZYU5tMQbVzV9qnP/tWdTx7bceWuRw4cPzUwNA/eJ7561/mhGaV1IpX8X39x66dv+UpbgDfs6jx+4lQz4cYVjcDByra6JoTZ8XG/pu3uBw7e/Ka9Lb59/wc++uVvfOc1a5sv27LWLESEPgoSvPqyD7+AEUuBUQgIXIkr2UymdXlTpWIn56IojkU4LhWZGeNKrc91WejMNsLq5QxrLVxRAlgo8/xov1koJjlWtgjIQmE6TIDIglgLGkixWFxMhAMgAqACmJiZLwutbGtCLrU1Zo6dGE57QIikdE02NS9y+yPdhcnRT5q4NpNWhNUlhaiwf7b8239665mu/rWdmx7qnfnufccv9I18fCpXm04EyAklfaP5Hz3cc/meka27tx871T88NrOqruk7t98dRVqlsv2zxR8/eHhZOv6zj/xuTSZ7qmc2BlizejWYA82NyyoAvVOVu25/xOaKH7v5htG5+buPDOj65QUAnUiAMImIAAoyOrH+mZQVoa1UCrlsXf3mTdu00kNDg+MTMxaTytPo+bb6UIGFBUQEywAkQAiYBEr7sHxVC2BoRIRIRABDAgIEjWSFqhOgPKtaV81654rl2cLCiuZsc31qWV3N8OR8Z0stCiIrZFaIKrPcVDLd8zKUM4IhAGi2AFy23h0PnUCdGBw9ce7p/XUty2pqaqNyDAxlCBi1UqIybcarFYLQr9OgNZqGtD82T8ACpCm9DFLGICBS/2huvBSv71hOFHe2pQfmihcmoohSAHZgKnfVztU3vfn1+588+Kv/7bNnBpiSnoUygrwasw+vqFgK0S4U/QTs3bcrU9vQ3dvf1z9kLWvPIwsCwBbQC4mIglTVD17ctFit+FmxJmb2AiijrlBCkQJSmpZySgiA1WCkuthEAKjGc4VSPD0909yQXd6UrU/o8fG5S5bXIyIK+cIegC9xLsLf+sOvjU5M7liRBQDNDGxsFGuVNOy3NCW//NH3bd28+tGj55dn/eHpQkn5TCqs5JKab7vvzGNHzg7PMqvQCFSsp2zkg1WC1lLFEgMEigqF/MTU/IqGZGs971i34tS5C/PFOGioK5O9/d6n33nDZV//49/43z/Z9Llv3T89X6ZsrQEjRMAEr7bZ8BX4KCAAA7CnAiyX92295H1vv863C48+/ljXwGisPIsstuhx0QfwdfpnDxz+8h33/fjBx58+faZrZHimWIiZAQmJlPLIS6DyAABRM6bQRmDmtaLqL0LCIApZodUiCRG/WiMEgEqkpmcKNfW1DTVpD2B8bMZTHgMDVarF6hiVAd3dPTw7MWMTCQDwBUEqtZncTW/csbEjecW2tuu3r37k8QPneoYa6hpsbJRmAGYA8OB079x9T0xbiILAKquIQxBfAEk4ZAWGFu9EpE/1TDTVpTtbwxXL6s4PFRhDY9hPJX9+qO+9v/9XT50e+N137PnWZ3+nc5kH5SJhCKIArBuxXpi1QkABQBFRhPt27/zpvf9w/sK4zqRQGG2cSXo16az2MhGlJ4bmG+trO5pqi/Pz3d09itDT2lM6k8401NfXpJLJdDrhgdY+AKKgQotocansg4s/jgFjBCQgy5ZYAKAMXu/w5Lb1q9atbM0z94xNU+BbsUKRRbYAglGIM1/9xH85dPLsuTNnqtUWUnFjbfIv/seN3/rBXWN9F0jkO7ff/ff7j7/r6q1KK1OJLGIFlSHxdWxVUhakBFJCbVXSqtggxKgYSVAMAGgPKDx89PSvX7tp2/qVvoLevlFgAdCItqW17kxf/3s+fMsf/c7bP3DTa6/Zt+38T55UUANCKCwuxvrH/AJkT1EuPzE8MQNhOhvq+myiqaEuGaSM8FwUTw7PlPPznata33rl7urcZgCi2FbKZWOsMQbFgrDwUvXQRpXiAiHRYlfn4r1nZCFBtgQIIEpAACxBb+9Ajd69qb2+UIwHJ2aV8tCCtikCDwCoVErFc2+6aoNPlWNHjgFA3sYclySOfGa7kBMEQcxBys/UlcolUMonAWZB0MgRRCzCZA0qK8aWRjUzVPMEZAkiBogZQKhvaKYURa99zR6xeL5/GAgEyNryn3zsN0OM3/Wbn/77O+9+/3+6oaEhCaZCWE3Ak8tjvWAiRASsPgErYJKJcHtnfeAn2pY3KfJUkFkoq4MnTw/NjscSAHKlXLLMJiqT5yNRoCnMpHBpQBIAyzEARHGcqctevmvXQ/fdp/Xzeg20iKAgW4siMRhmRjb9Fy4ojndtWzM9k6+UywRWgygTmcgmRS5pToRlxCheiGTecBHg0rXtHbXxFe2pGsLZiKYljSKXNGe7E1BTk85PzIVQRjGxqaCNrEogiDCDMU0hvnZbzSMH++NyidmiLXpQBraGAZQanC4W2X/dlXu6x2a7BichDFChikstaWlNhStSpbamOkCIrQUBkWoSGa0T6wUBFi75JTGIn0pcu3uDLZeCTEOuTI89cfT0ud6IRWUz2lMWWKEoIiBR1c43kGoDHFdnU1DCAAQcxyvbll3Svuyhcll7z/8tUAAElPJiJuOniMhPZvv6prm2bmdt3YOnxyoGMSAv6UvI9/z85+9+22s+9/nfo3LcmAy7znedvzB84FTvjVds2/23/6sunagA7j/cHaZrAfF//o9f/7X3vJ3DGvGKgAmdyhgUwCRIQMhxrI6eG7l2+4Zv3/In7/jgLaxDlU7E4Hu+BKRQawi90UL8le/f/bvvvGpsen6yGOtkg6BE5fgfHj/xyd94y0++++d1DTXTgifOjoOXZlEkFuHV1+6gcN0bXt4BCwiQEVEpLZVibmLg6isvZQrv3X/mx/fuH52ZampKXP2a7cb6kxM55NK1l6+5Zlun5UiRh9WVHSI8s42hGqupY92D//BU9+TEzMT4xI03XHbpmpYY4EcPHjk/MEehj1xBIItaFCkyI3Pz+0+MDxdkulL6edeFf3hq+GzfJCk+fGb6cJ/p7hm+MD5jdHJ8Jn/7PY/+zR1PFv3Vh4+eKTDMRPHBCxN/+aNH7zowODEfLUSVCsjfP3Lqp/c9cma0cPx8rhTFB88OHu0uWNBCiOSdPH3h3NDk4d6xQ2enpnNzh7pmDnUVQSoLsvDYoa6+ydJ8ITp08PH33XT96d6J2x8+hWENGwPgdfVMTCzYREL6h8a+/r2H73/iDCSbjCgSS2IY8WVteL64SeSX6xijf/TtChOABZ+kAmJMhO3tjZRI/V9//E0B2HrpZS3L6pK+SSb1/PyA9rUpg7AwMxixNkLPJ0QEXEp2KgYAMACe8oOR6WIq9iEMvaV8g1RzC4RAANYIG+Vnnjo+8NSTR23Y6iWzX/n+k2DLGIeen/rWncfIHpZMB6XWfftnJ75z11mjPIjmwmQNhqmTY4WPfvkuhLIFASY/u6IQ8Z9+4yFUmkgTlC0OaT/zzb97wjKrZKMQgwCrxFTs3XrnCRCjg8SpvmHQXZBomjXJz/71g8IqmUn+ynWXvenSt69uav7i6YeAGWIWQdCpyYi/8N2HkecVA6gAgqwIolhAYSAAVe1/rhZbAYSFXkS1Z3eK4TOtIy+Id+XVPRUiCAlb1CRlBAD0lIK5+TxoP5XwN6xtn5uZPdnVm6mpLURgvEDIZx0SESYyCMDVaRAQRBABgBgF0VY7JKKIiQFIeVotFm8W90d4ApbAkFitlAqC0EtjPC/lUp4tqNDP1JZio1LNCS5UqBQB1WSTJDZHGUhlrS1xlEM/DQIcUZBMs5C1Wgi9ulZgK4CAqMEyG0rWEWhmQ2KqmSaLqDJ1CIC27PmNlpClKKS85HIEjBZmbnr97ms2t93x1OmfPXTES2QZLAELMJCoVFIgweABKhArHCMiL9YOaHGJvZT9JeBq7rcahwEKVPteL2q12EjNz8sY8yuy1eOVzryLgCYSZqXDM91j45PjpGh8cLzCIZAPfvrxg6e/luHl2ezq1sbGumwqmfK11hpVtQWKFnNvIoxoNVgEeW7DZTVP7YGgp1UlN/4rb9jygV+5Ko1cERqZnv7r2x9+8HhOZVutMbEVFE1EFVEBGo1RjAnWASjflkrX7Fp7/a7O7/zkSM9oXgUpkHLMRlMRxRcJWKwgY7VLH4g4eubZGQMCggJsRAAJql30Ilr59R/+09syvhkZnSxwkhJp4YqIJQQQBl7c4wGIAoignhlucMmrpdGGxNLiaxddQgASudhvW/1XC7w0vcnSlZSAenWLtbj/APFZN0iqZWjDMDA0WY5jQiM2gjgSZcGUO1e1bexoLS8szOXyFROlEoXlTY0pHZIwIEN19w2AUiQmqizkUdgjWmqGh+qgAawAAAGlUli9LHnt+vaDFwaU4Lv2XVpX1/DU73+zUJy0C/OIYoHEz0bZunJxHqIiSd4iowaZn9ixau0nbtx6zz0/Oz8/iiZrrVCqKQRdKeUMCwQhel71c8KxRQpEqu3TjERAiADWWlJWjEXlMSOgZxH6p8tire+3oO/HsVVa+75vYoO4eC4ioRIRQBRmREIAESEl1bIhIgopYUHQ1SUNiJAiZgZEIWRmRLrollZkTSwARNWps3qdfw8jlgDSs2b+xUqgoCpba40FNJrj9qZGP9N8+sj+1cuzr9m2AarbG5ZGORSRahgviyO5tVxTk9x71eUP3POor9Szrl5N9AsgMSjRGmNjWT711R888vixB/7mT7esWdGQwvZQPnjTW1ubaiamCz+4/8D9B7uvv3bfiizPzU7cdOMNR09fuP/ue264tLNiol9/y5aGttoVdY1gvG/f2xUX7ZXbVmzds+mnDxzpH5n3wiSX8oQolEREYVFKK4UMIKIUko0qYeAZK6ACFgExYSLFhi2A2JhAODYcg1KKRJHnmygGFOEIAUVEmJXW1sbIwtaS0qR0JbKeFyAqZlSKQCCOYlKktGcXwy9GQCRiayFmzwujKFLatyZGVIjyChSIfkGtyUKWIY5N6GuKi1fv2VZX33L8/Agw2yhiERMVUYdU3WVRXVsu7tRajBaiUmlFW/OWTSvv+bsSaQ3AsHRiDUHMyBZCUD6IB6CQUHQ2H6dmZhY2dqqsF336v7/rLTs3dE3Mvm1f3c7L1h143x9fu6Xhg+++pmtksrUp9bo965uwuH3T2hjVO9/2tmJ4YO+q5rWrV/7d/lvG5hb+02uve9+New88cWTQAlpY2VJfLs6VOSrkC57nm9iYskWlGTzmaO3qltnpiVwUAcTCAmysKQKgp7RhgyTLmxvYsmWemZoxFSDlKSQjsTU2mUzW1zVOzUyTjTtalqPSQyNDURw3NTSWK1FUWvAJ2UoiDIN0YnpmmplQBAE9T1tjWUQTNDY1zk5NJT1dqhQB0NPaWATlv9wZ15ddLEFZTCstBgmCSIASaty4sTPUdPrIkw2Ny46dGhmdmVfaR6VFQAC96jbDqkioqnv8SKS6QlS+ihbihx44CKqaeEcCIMGlJLUF4GrgL4IKwBNWQprQxtDWkL1h54bvP37yv/7+Z/7yMx+57upLa+obc/lCrcIvfPErHplvfu6TfQPd3/zu9/7gt9/3e5/62t8/fPTTH/yV3Z0dHS3+2FChvSk5V4oHBoY9ry6qxPuuvE5Fc13dPYHf0tLSOp+bGx4abmisz+WLQTK56/Itp08eb6xvvDA0uVCRudm5+pqatpbWIAxOnzuzunN1e8vyocHByYnJrWvbMpna7q7uS9ZumJ6dz+Xm161bT4h33HFHU1Pdm1+7b3omPzs1Uinm9+646sDBo9Oz01dfd20qkx4ZGV6/fv3g0HB+bn7j2g3d57szmWR9fc2x4yc3bNiUrEmcPXNu9SWr+/v6k6lES2vrfY8dnpqvoKaXdUZ8mcVCYGAgK1SNBiwJK7Akxddeta+xsWn/U8dLBk/0zI/PRFxZUNrEzEyog1TEEhACcMUWUQCYtPJJyLIWACI1N1mci0LtV/cdkAYJuLrFzxOwhGUABrC0GOyilGZiiCINxYr3udsefeLosbk5MzSVq0EIRWsViMDx/sKK9lYPMRfLdC6PAD3j8fw8Hxma8RC3tvlPH7BrVraf6h4cKyntA2gamJjryPJlG9YSUSKRSClub6ypq6vLJNXxc8OnTvY1ZRu7Tx7r3Hp5DN5Q74WWlhbtqYG+7tddt/vMqZOjlYXQ043ZdF1tOpMO6ZLWsdFhHWa3btrw9IFDl27bLnFcl8mGPjfVJeoz4fzUWNIzSb9CNcmmbCoIAtXc0Nd1Jja8d8/OwweOzk9OrevYkqnF3bs3Hz18vr2tefPqVUcOHl63fn2QCo4fOWgsw8t/tIl+2eOrixvdEQFIQBNbFce5mdzkWG56Ku956d7+vkhixHLs6RkM7+8e3//YU6dP9W5c23nNFZt3bupo9AigzFIx7AkAS4Bazy0IpQLSHoM8J4LDFzt0ISoua65vWL58vsL949Pf+NYP33rdlquu35RSZQWAWGaKESGZTOVN8tBkeawQrlheiwBh4GGQ6B0YZ4D2ltZ04mxLS/09Pz/AURxkfIllenpq7Hzf7h27z3Wd3bB+3ekzfTWZBF8YydY1nOoaxCA5lfPWbL7qTP9YuibTunLN4OBwOarkc8UDR87V1japIOy50EtKS5CZzs3MzM2OT+WICgtxvGbdxonZeSa1EJljp4dWrWptbu3o6hkZmShu2763v7tnfHpe+aWpqanm5ctKC6Wnj5waGp3JzRbXGz3UPzU9m1u2al2ulB/rHVmzdefI2FhpbLpnZKYkIajw5Y7gX4EYq7oXAJeWwyjke4m6rv7pfAXKkTbkRTEJ+QAAft2ttz3wla/9ICDTvmLFAwfu+tK3frZ5/cqr92y56sptOzZ2tCmorpTDuKwrs8rUVoRlafnJL8xOLxas4c8++O6Sn97eWnP/4TM2N/TVL37yDdtXniuKF89H1moiBrIAnh8ePj36rg9/aXB4as/mdQgALALe8EQ+L9BcV9fZUpNQcL5/GsCrlGNQ+tTRoz7nz/dN+r5/7Fyf9jwRIMRypZu8kGWGCM+e643i2FiT8EEQYxvbyPQPjvp+EFnwPI+Fj5+9EPpBxBYBbGxHJ8dNHAESBuGFoZHh4XF6wmMbJ+qa9v/8UBAGWuOZnj4rEsdxMtVrrbEsDL6m8O6Hn2Asmth6XaMVazXiibO9SGgBRAWkfJZXeYIUEEiALVM1X4eagUqGFow/ljOMPnqKIeK4KJWiihfaGhNbOltu2Hf9rks3rFrRODQ48dTR3gcfP3zrD+/982//3dpLWq+5bNt1e3dce8UaDjOgtdiiIhUby8IMyEiAChDlBYIZjocnJp44dO7W7/2wqbVpz/aVDxw68z+//P2P/9eb23fUxrEC8QEAtReJjMyY2CaVn9IACkSH2ZHJ4uDYdFtD7bZVLQqgd3QGdAhAwLzryr1ttf7AaH50dDRfKFhrEdEyN9RnOCopRCGVzxfWrmzv6FhxrqdneHR01ZrO9es3jPT39/b0ZlOZXG4+m8rEbKNypEkBcjadLpfLiTChtQaRbKZZQM9OTyaSdfOzc03N9Sa2+WK+Y/XK9hXt+Vzu9OkzqWQ6XyzUZTPM3nxhLpHQ7R0rxsbmatI1s9MzmXS6XCp5Wilfzy+YV2BAeblLOs8cuKCUFyN7XhgkExj4pMmUC7Ywr6Dc3hDuvmz51Xteu+/S9etXL08vzWkdnS37Olve/6v7zg/PPn341E8fPnDbvU98/bYH1m5qCVKNNt0igS9xKUwmFVLFWuZqEP+sCGJpkvyjv/r+T/d3B+nVlYLauXOZETl6dvDhR4/c+MarX7Nzo2WsHvbAgICofA1oqvuWUYTQL1YWTnYNb2hftmNd++xCZWBsDjxfa8+ynRwb37pqs7BuW1ZnjJ0YH5+amlq7bm0yES6vDUnkfN/II488cdXlm+tqa6bGR4bMwq6dG48fPJZIpK68/FI/DGIbBb6XTtcWCnOnT57dsXunVjQ9PUMonqeC0AcxhRIqWiUcJZM+iCfW3nX3/ZduWe97gVSKr79mX11tQ74wg0oJpM71nG1sCleuaJmdnI3RY7uyMVtfyOUEKUyGP3v46UJZkF7ess7LniDFaqJSwFpWYdDbOzwzdbfkx1hl2+ozl27c8PZrt1+xde26uowHwADThXhodm50amY8H9dmU8saMw31qc1tdTvarvrdt111oRg/cfDsj+9/9MDpMVMOuTQHUDp6qmtne119fS2SBqHnRabVVLbRPtY2om5RcaAkSgLEmiAIIiILgBQTVgTAggBaEAaJEQFESgvFKF+EjHf0bM/1e7Zcd+XO/oHhkclZHa4UY5nt2MTY4EC6NpXp7e1ft359tn1ZxofVrY0P7X9qIEE7tmxsXtbc2NwcWZvwZOe2zvMXTiNHheJsxte1Cd194ey+K/c+/vjjy5Y1t7Q0X759reayr/1MAFNT02Mzkxu2bOk5f2HzZVsB4MiBQ++6+cZ77ny4rq6hNhsO9XbVZGs6WpetXNEy0D+6qrXh9Knjh470vOOmtwyP9YS4sKY1vOeBp9/4ljfOT86oQIqlfGt9bUM2XSjmqqvvV+9USCwaOCKQuJID5p5Bbm8yv/HunVddccXWDavS6US+ULgwNvng091d3cPne4fHpgvT+fJcrlQ0OvBVfUbXJmj18rr1l6xasyK7pr1my6ZVe/ZuyS1Ep0/3P/b0oSfPjNzyv3/y9R/et2f33q7p2AsAbGzIA5QAgE1MYisAyAQl4QwwChcjQLxsTc3enW2b166IRAKZhjhXANBqAUyRsR2glCvMIeKH3rmLwqOPHu85MTHLAW3pXP6Ne08WK2EyNIwMCkHC7uECx5N79+4+eepsMpWsb2h98ui5uWJ5cs6suETN54vz5cq5gYkFVsoLY0kcOdqz7zWv6+3pPzUwsWHj5Q/tPzGfw3yU6x9baG5q6Oo5s+eK3b0DM9OT0wCKuyYz2dZDR/rCwF+x5oof/OjpfM5MzM7mYzWzYJavXNY3NnPkzIVL1qw+/sTJhdzCxNxCV+/YxESxr69QW1u7bddVd9//5PrOtePjU2EilNG5uXwRlJJX9VQoAEBacawA2zo6LlnVumZN++q2BEWF46cG7/jpo4PDoxNzs7OFUsUGAkq0D5RAL0SvDkKvYnk0Xxmfq5wf6Ltr/1kt5XRgk6lkNpNcubJ1w/q1qzdu7Ni6c3Akd+rcwCPHB3OFkhfoiolBa6nupyCvLIk5gLIkhDWgJV8NjhceOtZz7eW7/vrru44d6xlZsOSlypiYBYhEo0IG1EHw+KFT93ftecPrrxlPNz969lsHDw9+8rO3fukP3ntqYBLAExszIABahr7hSQTT/8M7USulyBiDqMIwiCP52f2PEqJS/tPHzjx97DRHcZBMne8Z7uoessaip890DRhrfd+HuaIx5nTXoBcEd9z5IIho7THbocm8WKs938QxqfOWWWslAuhRV9/E+QujQKQIz/QMxpUoESTD2qaHHjuMRJ7nm56xnz99UnveuZ4niFApxcYaPwDlv9yrQqS3fv7fXFf+p6pPJEohZLOpxoYsV8rzs1PTszlrBaIYkHQYkFKoiD1UoCwDkOJqUlUWsxWKDaJUT7tlttZaZitxBHEMnhd4pr6uJlvbGCazI2Mz8/kCoheDsAINHiwU2+rtqvb6s3356fkK6ISnwJTHVy5PXrdvx8Do/KnjZ1atbDvbNVzXUL+8peFE93CuCEqnCQ2XZ5c1BMtaMvORN9A3xRNjN79281c/86Ff+/T3fnL/+TCdiAWItHD1tAABAUUkAGytUspaC9UmssWT+pCUssZYa7Wnmdn3AxPHIqB9HVciRQoJrTFEBACEaJm10tZaQLAgiogAjbWAqEhZZkQSZlK6+l2IgMDMQoSWq7loBKZqdUhrbYzRWlc4Nviy92O97GIBIxGCWI5KIKIVgU6IChCr+7oWuyOZAEQIkYHFVvMTtnrc2uLLqjVUFkAEBAKpHvpAMm8tGyNIHpIGqB5jZIUEbKCEwM7ZOK+8Bu2RicuoABQaE8PCAmnteWElMslkKq5EcWwhSGhPszVKaSvEbKCSA5S1rZnPfOTdeza05yJ+y+98oXdGfK1jy0jV/DWiUoAgLAJCiAC4dIwqEuFiF+zSUZGIKAIiQvTM6ZFVA0UEGQgXG4EIkZmFkIFxqSz9zNJIlrIpgEgIwoDCItXOSBFAABYGAUIAQGZLSll+kQTpq6zRrzpkMQgiqiC1VFoXtmVYXL0hCiAQWi0ADCzC1XtNi/UfFKy2FAmAxWrP1dL5fgwgFIIGrUkERUAQjAiiIFsUK6LRy+ggwZYiG5FSgsCg0E8rv05xybJSyWTEC8pL6CBpxRqOCdGKCCpSfpDw43iBUWK78Pihoz+6+9zg6AKl0oYZqVqdREZCkKUyJvLFmiYCCBjmxZTtYk8LVNsUFl+5tDhbampBUWiXZLMiUO3dqLZaEckL2vpEFj/dACxL3YAsi61bUj1kFRYbJ6zEgC97z8wrMmI9q/CMiwkIA2iZUAhRQFWPmq3uSAWsHg0LiChI1Y1jcPHWWwDz3KOLUcBb7Ei6uEMKETBSEiH7IikmEIpEIgRBQQAlQAAEiJ7Mi/gGMgHMo0AEWQsWSQAEgYlFCSCJVZ7ExSCaQY7KGKp0s4kFkKqH2VYVx6Xjbv+1H3gUekFgWr0Zz/YHUV54eCm/oJD8gp5SuXj84HOXyS9INbwKR6znNPktlqAREISAq+1B1TYXrjaKXnwysrRNEy92QwLK4qcNn/uZhYt9bUttOYuvFIwFEIRBWFAJqmppCRbz9YoBAWOumgwGwMrSoIIgAtaIMGjwamLKIFZQsWFheuZNAgqIPNOj+a+MieUF3/DcEazacPVi15UXHifOz9+B/EzN43kve7Vn3p+XLQUAEAZc/LkCAmifvSkQn5fYfNZfi/f4hcM4v9haFK14gLB4QK0AgLfYqrsY5gAAxBBUXxOhX83PP/NIESyirb5PtgAmqp5TZdVz+nyXXnzxOOSX5ok9e5iRf+yy9C+757+YXdTu/9L5l1c8nzNKOpxYDieWw4nlcDixHK80L8Gq8OL2d3mFdhY5XnouPriXKo/lRiyHmwod/6GmwudNi+6eOl5isZxVDjcVOpxYDieWw+HEcjixHE4sh8OJ5XBiOZxYDocTy+HEcjixHE4sh8OJ5XBiOZxYDocTy+HEcjixHA4nlsOJ5XBiORxOLIcTy+HEcjicWA4nlsOJ5XA4sRxOLIcTy+FwYjmcWA4nlsPhxHI4sRxOLIfDieVwYjmcWA6HE8vhxHI4sRwOJ5bDieVwYjkcTiyHE8vhxHI4nFgOJ5bDieVwOLEcTiyHE8vhcGI5nFgOJ5bD4cRyOLEcTiyHw4nlcGI5nFgOhxPL4cRyOLEcjn+K/w/xAoYVN8ZEiAAAAABJRU5ErkJggg=="} alt="McCarthys Party" style={{width:"100%",height:"auto",borderRadius:"8px"}}/></div>}
function Hdr({onBack,title,subtitle,extra}){return <div style={{padding:"12px 20px",maxWidth:"540px",margin:"0 auto",borderBottom:"1px solid rgba(240,234,214,0.08)"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><button onClick={onBack} style={{background:"rgba(218,165,32,0.15)",border:"1px solid rgba(218,165,32,0.4)",color:"#daa520",fontSize:"15px",cursor:"pointer",fontFamily:F.body,padding:"8px 16px",borderRadius:"6px",fontWeight:600}}>← Back</button>{extra}</div><h2 style={{margin:"8px 0 1px",fontSize:"18px",fontFamily:F.display,fontWeight:700,color:"#f0ead6"}}>{title}</h2>{subtitle&&<div style={{fontSize:"12px",color:"rgba(240,234,214,0.4)"}}>{subtitle}</div>}</div>}
function Fonts(){return <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Source+Sans+3:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>}
function Num({n,active}){return <span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:"26px",height:"26px",borderRadius:"50%",background:active?"#daa520":"rgba(218,165,32,0.25)",color:active?"#1a2332":"#daa520",fontSize:"14px",fontWeight:700,flexShrink:0}}>{n}</span>}
function Radio({on}){return <div style={{width:"24px",height:"24px",borderRadius:"50%",border:"2px solid "+(on?"#daa520":"rgba(240,234,214,0.3)"),display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{on&&<div style={{width:"14px",height:"14px",borderRadius:"50%",background:"#daa520"}}/>}</div>}
function DietTag({t}){return <span style={{fontSize:"11px",padding:"4px 9px",borderRadius:"5px",background:TAG[t]?.bg||"#555",color:TAG[t]?.color||"#fff",fontWeight:800,letterSpacing:"0.5px",boxShadow:"0 1px 3px rgba(0,0,0,0.3)"}}>{t==="GF*"?"GF OPT":t}</span>}
function Pill({text,dim,gold}){return <span style={{display:"inline-block",marginTop:"4px",padding:"2px 8px",background:gold?"rgba(218,165,32,0.15)":dim?"rgba(240,234,214,0.08)":"rgba(218,165,32,0.1)",borderRadius:"10px",fontSize:"9px",color:gold?"#daa520":dim?"rgba(240,234,214,0.45)":"#daa520",fontWeight:gold?600:500}}>{text}</span>}
function SectionHead({title}){return <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"10px"}}><h3 style={{fontSize:"14px",fontFamily:F.body,fontWeight:600,color:"#daa520",margin:0,whiteSpace:"nowrap"}}>{title}</h3><div style={{flex:1,height:"1px",background:"linear-gradient(90deg, rgba(218,165,32,0.3), transparent)"}}/></div>}
function StepCard({num,title,color,children}){return <div style={{background:"rgba(240,234,214,0.05)",borderRadius:"10px",padding:"18px",marginBottom:"14px",borderLeft:"3px solid "+color}}><div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"10px"}}><span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:"28px",height:"28px",borderRadius:"50%",background:color,color:"#fff",fontSize:"14px",fontWeight:700,flexShrink:0}}>{num}</span><span style={{fontSize:"16px",fontFamily:F.display,fontWeight:700,color:"#f0ead6"}}>{title}</span></div>{children}</div>}

const F={display:"'Playfair Display', Georgia, serif",body:"'Source Sans 3', sans-serif"};
const S={
  splash:{minHeight:"100vh",background:"linear-gradient(165deg, #052d52 0%, #074f8e 40%, #0a3d6e 100%)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:F.display,position:"relative"},
  fadeIn:{textAlign:"center",padding:"0 28px",maxWidth:"420px",transition:"all 1.2s cubic-bezier(0.22,1,0.36,1)"},
  brand:{fontSize:"12px",letterSpacing:"3.5px",color:"#daa520",textTransform:"uppercase",marginBottom:"10px",fontFamily:F.body,fontWeight:300},
  h1big:{fontSize:"clamp(28px,7vw,40px)",color:"#f0ead6",margin:"0 0 6px",fontWeight:700,lineHeight:1.15,fontFamily:F.display},
  line:{width:"50px",height:"2px",background:"linear-gradient(90deg, transparent, #daa520, transparent)",margin:"14px auto 16px"},
  subtext:{fontSize:"15px",color:"rgba(240,234,214,0.5)",margin:"0 0 10px",lineHeight:1.6,fontFamily:F.body,fontWeight:300},
  goldBtn:{background:"linear-gradient(135deg, #daa520, #b8860b)",color:"#1a2332",border:"none",padding:"12px 38px",fontSize:"13px",fontFamily:F.body,fontWeight:600,letterSpacing:"1.5px",textTransform:"uppercase",borderRadius:"4px",cursor:"pointer",boxShadow:"0 4px 16px rgba(218,165,32,0.3)"},
  ghostBtn:{background:"transparent",color:"#daa520",border:"1px solid rgba(218,165,32,0.3)",padding:"10px 28px",fontSize:"12px",fontFamily:F.body,fontWeight:500,letterSpacing:"1px",textTransform:"uppercase",borderRadius:"4px",cursor:"pointer"},
  backBtn:{background:"none",border:"none",color:"#daa520",fontSize:"15px",cursor:"pointer",fontFamily:F.body,padding:"6px 2px",fontWeight:500},
  input:{width:"100%",padding:"11px 14px",borderRadius:"6px",border:"1px solid rgba(240,234,214,0.2)",background:"rgba(240,234,214,0.06)",color:"#f0ead6",fontSize:"16px",fontFamily:F.body,outline:"none",boxSizing:"border-box"},
  page:{minHeight:"100vh",background:"linear-gradient(165deg, #052d52 0%, #074f8e 40%, #0a3d6e 100%)",fontFamily:F.body,color:"#f0ead6"},
  content:{padding:"16px 20px 60px",maxWidth:"540px",margin:"0 auto"},
  venueCard:{background:"rgba(255,255,255,0.08)",borderRadius:"9px",padding:"15px",marginBottom:"20px",borderLeft:"3px solid #daa520"},
  brandLabel:{fontSize:"10px",letterSpacing:"2.5px",color:"#daa520",textTransform:"uppercase",fontWeight:300,marginBottom:"3px",fontFamily:F.body},
  card:{display:"block",width:"100%",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(240,234,214,0.07)",borderRadius:"8px",padding:0,marginBottom:"6px",cursor:"pointer",textAlign:"left",color:"#f0ead6",fontFamily:F.body,transition:"all 0.2s ease",overflow:"hidden"},
  menuItem:{display:"block",width:"100%",textAlign:"left",borderRadius:"8px",padding:"14px 15px",marginBottom:"7px",color:"#f0ead6",fontFamily:F.body,transition:"all 0.2s ease",cursor:"pointer"},
  footNote:{padding:"10px 14px",background:"rgba(218,165,32,0.08)",borderRadius:"6px",fontSize:"12px",color:"#daa520",textAlign:"center",fontStyle:"italic",border:"1px solid rgba(218,165,32,0.15)"},
  stepText:{fontSize:"13px",color:"rgba(240,234,214,0.6)",lineHeight:1.6,margin:"0 0 8px"},
};
