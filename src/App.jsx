import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════════
// McCARTHY'S PARTY — OPTION A: GOOGLE SHEETS BACKEND
// This prototype demonstrates the full workflow:
//   1. Guest opens app via link/QR → enters name → browses menus → selects
//   2. Selections are sent to a Google Sheet (simulated here with storage)
//   3. Guide opens admin view → sees live tallies per meal
//   4. Guide taps "Email to Restaurant" → formatted summary ready to send
//
// TO MAKE THIS REAL: Connect to Google Sheets API via a free
// Google Apps Script web app (instructions in the setup guide)
// ═══════════════════════════════════════════════════════════════════

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
        { num: 4, name: "Fish & Chips", tags: [] },
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
        { num: 3, name: "Vegetarian Stir-Fry", tags: ["V","GF"] },
        { num: 4, name: "Vegan Vegetable & Legume Soup", tags: ["VG","GF"] },
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
        { num: 4, name: "Vegetable Beef Soup & Dinner Roll", tags: [] },
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
        { num: 2, name: "Pan Fried Cod", desc: "Mashed potatoes & vegetables", tags: ["GF"] },
        { num: 3, name: "Penne Pasta, Veggies & Marinara", desc: "Vegetarian", tags: ["V"] },
        { num: 4, name: "Jiggs Dinner", desc: "Groups of 12+", tags: ["GF"] },
      ]},
      { title: "Included", fixed: true, items: [{ name: "Chef's Dessert, Tea or Coffee" }] },
    ]},
  ]},
  { day: 6, title: "Gros Morne – Bonne Bay & Tablelands", location: "Rocky Harbour / Cow Head", subtitle: "Boat tour, Discovery Centre, Tablelands.", meals: [
    { type: "Breakfast", note: "Included at hotel" },
    { type: "Lunch", time: "12:30 PM", venue: "The Old Loft Restaurant", venueLocation: "Woody Point, NL", phone: "709-453-2294", deadline: "Morning of Day 6", sections: [
      { title: "Main", items: [
        { num: 1, name: "Pan Fried Cod & Homemade Fries", tags: ["GF"] },
        { num: 2, name: "Fish Cakes, Multigrain Bread & Beans", tags: [] },
        { num: 3, name: "Meat Pie & House Salad", tags: [] },
        { num: 4, name: "Cod au Gratin & Multigrain Bread", tags: [] },
        { num: 5, name: "Large House Salad", desc: "Strawberries, mandarin oranges, spring mix", tags: ["V","GF"] },
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
    { type: "Lunch", time: "12:00 PM", venue: "By the Sea Inn & Café", venueLocation: "King's Point, NL", phone: "709-268-2181", deadline: "Morning of Day 7", sections: [
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
    { type: "Lunch", time: "12:00 PM", venue: "Anchor Inn – Georgie's", venueLocation: "Twillingate, NL", phone: "709-884-2777", email: "reception@anchorinntw.com", leadTime: "48 hours notice required", deadline: "By end of Day 6", sections: [
      { title: "Main", items: [
        { num: 1, name: "Fish Cakes", desc: "Panko-crusted saltfish, rhubarb relish", tags: [] },
        { num: 2, name: "Shrimp Sandwich", desc: "On croissant with kettle chips", tags: [] },
        { num: 3, name: "Chicken Caesar Salad", desc: "Charbroiled chicken, bacon, parmesan", tags: [] },
        { num: 4, name: "Georgie's Clam Chowder", desc: "Meal-size, GF bread", tags: ["GF"] },
        { num: 5, name: "Root Cellar Bisque", desc: "Curried coconut, crostini", tags: ["V"] },
      ]},
      { title: "Included", fixed: true, items: [{ name: "Chef's Dessert, Tea or Coffee" }] },
    ]},
    { type: "Dinner", venue: "Clarenville Inn", note: "Buffet — no selection needed", isBuffet: true },
  ]},
  { day: 9, title: "Trinity & Bonavista", location: "Clarenville", subtitle: "Historic Trinity. Bonavista.", meals: [
    { type: "Breakfast", note: "Included at hotel" },
    { type: "Lunch", time: "11:30 AM", venue: "Skipper's Restaurant", venueLocation: "Bonavista, NL", phone: "709-468-7982", email: "info@harbourquarters.com", leadTime: "48 hours notice required", deadline: "By end of Day 7", sections: [
      { title: "Main", items: [
        { num: 1, name: "Cod au Gratin", desc: "Baked cod, cream sauce, cheese", tags: ["GF"] },
        { num: 2, name: "Chicken Broccoli Casserole", desc: "Mushroom sauce, cheese", tags: [] },
        { num: 3, name: "Homemade Beef Lasagna", desc: "Marinara, cheese", tags: [] },
        { num: 4, name: "Salmon Cakes", desc: "Rhubarb pickles, cranberry salad. Not GF.", tags: [] },
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
    { type: "Dinner", venue: "Downtown St. John's", note: "On your own — ask your guide!", isOnOwn: true },
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
  V: { color: "#4a7c59", bg: "rgba(74,124,89,0.2)" },
  VG: { color: "#2d6a4f", bg: "rgba(45,106,79,0.2)" },
  GF: { color: "#b8860b", bg: "rgba(184,134,11,0.2)" },
  "GF*": { color: "#b8860b", bg: "rgba(184,134,11,0.15)" },
};
const ICONS = { Breakfast: "☀️", Lunch: "🍽️", "Bagged Lunch": "🥪", Dinner: "🌙", "Farewell Dinner": "🥂" };

// ═══════════════════════════════════════════════════════════════
// GOOGLE SHEETS CONNECTION
// Replace the URL below with your Google Apps Script Web App URL
// (the one you got when you deployed your Apps Script in Part 5
// of the Google Sheets Setup Guide)
// ═══════════════════════════════════════════════════════════════
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyybHDGb5rRsdNOg-YM2j8eg_0PNhbsrCBJjBIQgNs_rK-uRAGWwxxjl4GXxojnivre/exec";

// ─── STORAGE (localStorage for device + Google Sheets for you) ───
const PFX = "mcp-";
function save(k, v) { try { localStorage.setItem(PFX+k, JSON.stringify(v)); } catch(e){} }
function load(k) { try { const r = localStorage.getItem(PFX+k); return r ? JSON.parse(r) : null; } catch(e) { return null; } }
function loadAllGuests() {
  try {
    const out = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(PFX+"g-")) {
        try { const p = JSON.parse(localStorage.getItem(key)); out[p.name] = p; } catch(e){}
      }
    }
    return out;
  } catch(e) { return {}; }
}

// Send selection to Google Sheet
function sendToSheet(mealTab, guestName, section, selection, dietaryNotes) {
  if (GOOGLE_SCRIPT_URL === "YOUR_GOOGLE_SCRIPT_URL_HERE") return;
  try {
    const params = new URLSearchParams({
      mealTab: mealTab,
      guestName: guestName,
      section: section,
      selection: selection || "",
      dietaryNotes: dietaryNotes || ""
    });
    fetch(GOOGLE_SCRIPT_URL + "?" + params.toString())
      .then(r => console.log("Sent to sheet"))
      .catch(e => console.log("Sheet sync pending"));
  } catch(e) { console.log("Sheet sync pending"); }
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
  const [submitted, setSubmitted] = useState({});
  const ref = useRef(null);

  useEffect(() => { setTimeout(() => setAnimIn(true), 100); }, []);
  useEffect(() => { if(ref.current) ref.current.scrollTo({top:0,behavior:"smooth"}); }, [view,sDay,sMeal,aView,showSetup]);

  const doSave = useCallback((name, sels, notes) => {
    setSaving(true);
    save("g-"+name.toLowerCase().replace(/\s+/g,"-"), { name, selections: sels, notes: notes||"", updatedAt: new Date().toISOString() });
    setSaving(false);
  }, []);

  const pick = (d, mt, sec, item) => {
    const k = `${d}|${mt}|${sec}`;
    const next = {...gSel, [k]: item};
    setGSel(next);
    doSave(gName, next, gNotes);
    if (item) {
      const mealTab = `Day ${d} ${mt}`;
      sendToSheet(mealTab, gName, sec, item, gNotes);
    }
  };
  const getPick = (d, mt, sec) => gSel[`${d}|${mt}|${sec}`];
  const pickCount = (d) => Object.keys(gSel).filter(k=>k.startsWith(`${d}|`)).length;

  const guestLogin = () => {
    if(!gName.trim()) return;
    const n = gName.trim();
    const ex = load("g-"+n.toLowerCase().replace(/\s+/g,"-"));
    if(ex) { setGSel(ex.selections||{}); setGNotes(ex.notes||""); }
    else { setGSel({}); setGNotes(""); }
    save("g-"+n.toLowerCase().replace(/\s+/g,"-"), { name: n, selections: ex ? ex.selections || {} : {}, notes: gNotes, updatedAt: new Date().toISOString() });
    setGName(n);
    setMode("guest");
  };

  const adminLogin = () => {
    if(pin===ADMIN_PIN) { setPinErr(false); setAllG(loadAllGuests()); setMode("admin"); }
    else setPinErr(true);
  };

  const refresh = () => setAllG(loadAllGuests());

  const getMealKey = (day, meal) => `Day ${day.day} ${meal.type}`;

  const buildEmailBody = (day, meal) => {
    const guests = Object.values(allG);
    const secs = (meal.sections||[]).filter(s=>!s.fixed);
    let body = `Hi,\n\nPlease find the meal orders for McCarthy's Party tour group:\n\n`;
    body += `Date: Day ${day.day} of 12-Day Tour\n`;
    if(meal.time) body += `Time: ${meal.time}\n`;
    body += `Group Size: ${guests.length} guests\n\n`;
    secs.forEach(sec => {
      body += `${sec.title}:\n`;
      const tally = {};
      sec.items.forEach(i => tally[i.name] = []);
      guests.forEach(g => {
        const choice = g.selections?.[`${day.day}|${meal.type}|${sec.title}`];
        if(choice && tally[choice]) tally[choice].push(g.name);
      });
      sec.items.forEach(i => {
        if(tally[i.name]?.length > 0) body += `  ${i.name}: ${tally[i.name].length}\n`;
      });
      body += `\n`;
    });
    body += `Special dietary notes:\n`;
    guests.filter(g=>g.notes).forEach(g => { body += `  - ${g.name}: ${g.notes}\n`; });
    body += `\nThank you!\nMcCarthy's Party Inc.\n`;
    return body;
  };

  // ═══ SPLASH ═══
  if(mode==="splash") {
    return (
      <div style={S.splash}><Fonts/>
        <div style={{...S.fadeIn, opacity:animIn?1:0, transform:animIn?"translateY(0)":"translateY(30px)"}}>
          <Compass/>
          <div style={S.brand}>McCarthy's Party</div>
          <h1 style={S.h1big}>Culinary Guide</h1>
          <div style={S.line}/>
          <p style={S.subtext}>Your personal dining companion for<br/>12 unforgettable days across<br/>Newfoundland & Labrador</p>
          <p style={{...S.subtext,fontSize:"12px",color:"rgba(240,234,214,0.25)",fontStyle:"italic",margin:"0 0 32px"}}>2026 Season</p>
          <div style={{display:"flex",flexDirection:"column",gap:"12px",alignItems:"center",width:"100%"}}>
            <button onClick={()=>setMode("login")} style={S.goldBtn}>I'm a Guest</button>
            <button onClick={()=>setMode("adminLogin")} style={S.ghostBtn}>Guide Login</button>
          </div>
        </div>
      </div>
    );
  }

  // ═══ GUEST LOGIN ═══
  if(mode==="login") {
    return (
      <div style={S.splash}><Fonts/>
        <div style={{textAlign:"center",padding:"0 28px",maxWidth:"400px"}}>
          <Compass/>
          <h2 style={{...S.h1big,fontSize:"28px",marginBottom:"8px"}}>Welcome!</h2>
          <p style={{...S.subtext,marginBottom:"24px"}}>Enter your name to view menus and make your meal selections.</p>
          <input value={gName} onChange={e=>setGName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&guestLogin()}
            placeholder="Your full name" style={S.input} autoFocus/>
          <div style={{marginTop:"12px"}}>
            <label style={{fontSize:"12px",color:"rgba(240,234,214,0.4)"}}>Dietary needs or allergies (optional)</label>
            <input value={gNotes} onChange={e=>setGNotes(e.target.value)} placeholder="e.g., Gluten-free, nut allergy"
              style={{...S.input,marginTop:"6px",fontSize:"14px"}}/>
          </div>
          <button onClick={guestLogin} style={{...S.goldBtn,marginTop:"20px",width:"100%"}}>Continue</button>
          <button onClick={()=>setMode("splash")} style={{...S.link,marginTop:"16px"}}>← Back</button>
        </div>
      </div>
    );
  }

  // ═══ ADMIN LOGIN ═══
  if(mode==="adminLogin") {
    return (
      <div style={S.splash}><Fonts/>
        <div style={{textAlign:"center",padding:"0 28px",maxWidth:"400px"}}>
          <Compass/>
          <h2 style={{...S.h1big,fontSize:"28px",marginBottom:"8px"}}>Guide Login</h2>
          <p style={{...S.subtext,marginBottom:"24px"}}>Enter your PIN to access the dashboard.</p>
          <input value={pin} onChange={e=>{setPin(e.target.value);setPinErr(false);}} onKeyDown={e=>e.key==="Enter"&&adminLogin()}
            placeholder="PIN" type="password" style={{...S.input,textAlign:"center",letterSpacing:"8px",fontSize:"24px"}} autoFocus/>
          {pinErr&&<div style={{color:"#e74c3c",fontSize:"13px",marginTop:"8px"}}>Incorrect PIN</div>}
          <button onClick={adminLogin} style={{...S.goldBtn,marginTop:"16px",width:"100%"}}>Access Dashboard</button>
          <button onClick={()=>{setMode("splash");setPin("");setPinErr(false);}} style={{...S.link,marginTop:"16px"}}>← Back</button>
        </div>
      </div>
    );
  }

  // ═══ ADMIN: SETUP GUIDE ═══
  if(mode==="admin" && showSetup) {
    return (
      <div style={S.page}><Fonts/>
        <Hdr onBack={()=>setShowSetup(false)} title="Google Sheets Setup" subtitle="How to connect this app to Google Sheets"/>
        <div ref={ref} style={S.content}>
          <StepCard num="1" title="Create Your Google Sheet" color="#4285f4">
            <p style={S.stepText}>Go to <strong>sheets.google.com</strong> and create a new spreadsheet. Name it "McCarthy's Party – Tour Orders 2026". Create one tab per meal that requires orders (e.g., "Day 3 Lunch", "Day 4 Dinner", etc.)</p>
            <p style={S.stepText}>In each tab, set up columns: <strong>Guest Name | Selection | Dietary Notes | Submitted At</strong></p>
          </StepCard>
          <StepCard num="2" title="Create a Google Apps Script" color="#0f9d58">
            <p style={S.stepText}>In your Google Sheet, go to <strong>Extensions → Apps Script</strong>. This opens a free code editor. Paste in a simple script that accepts data from the app and writes it to the correct tab.</p>
            <p style={S.stepText}>The script acts as a free "API" — no server needed! It handles receiving guest selections and writing them to the right cells.</p>
            <div style={S.codeBox}>
              <code style={{fontSize:"11px",color:"#4fc3f7",fontFamily:"monospace",lineHeight:1.6}}>
                {`// Google Apps Script (free)\nfunction doPost(e) {\n  var data = JSON.parse(e.postData.contents);\n  var sheet = SpreadsheetApp\n    .getActiveSpreadsheet()\n    .getSheetByName(data.mealTab);\n  sheet.appendRow([\n    data.guestName,\n    data.selection,\n    data.notes,\n    new Date()\n  ]);\n  return ContentService\n    .createTextOutput("OK");\n}`}
              </code>
            </div>
          </StepCard>
          <StepCard num="3" title="Deploy as Web App" color="#f4b400">
            <p style={S.stepText}>In Apps Script, click <strong>Deploy → New Deployment → Web App</strong>. Set "Execute as" to yourself and "Who has access" to "Anyone". Copy the deployment URL.</p>
            <p style={S.stepText}>This URL is what the menu app calls when a guest makes a selection. It's completely free and handles the volume of a tour group easily.</p>
          </StepCard>
          <StepCard num="4" title="Connect to Your App" color="#db4437">
            <p style={S.stepText}>Add the deployment URL to your app's configuration. Each time a guest selects a meal option, the app sends a request to that URL, and the data appears in your Google Sheet within seconds.</p>
            <p style={S.stepText}>You can then share the Google Sheet with restaurants, or use the "Email to Restaurant" feature in the admin dashboard to send formatted summaries.</p>
          </StepCard>

          <div style={{background:"rgba(218,165,32,0.08)",borderRadius:"10px",padding:"18px",marginTop:"20px",border:"1px solid rgba(218,165,32,0.2)"}}>
            <div style={{fontSize:"15px",fontFamily:F.display,fontWeight:700,color:"#daa520",marginBottom:"8px"}}>What This Costs You</div>
            <div style={{fontSize:"13px",color:"rgba(240,234,214,0.6)",lineHeight:1.7}}>
              <div>Google Sheets: <strong style={{color:"#4a7c59"}}>Free</strong></div>
              <div>Google Apps Script: <strong style={{color:"#4a7c59"}}>Free</strong></div>
              <div>App Hosting (Vercel/Netlify): <strong style={{color:"#4a7c59"}}>Free tier</strong></div>
              <div>Domain name (optional): <strong style={{color:"rgba(240,234,214,0.5)"}}>~$15/year</strong></div>
              <div style={{marginTop:"8px",paddingTop:"8px",borderTop:"1px solid rgba(240,234,214,0.1)",fontWeight:600,color:"#daa520"}}>
                Total ongoing cost: $0–$15/year
              </div>
            </div>
          </div>

          <div style={{background:"rgba(240,234,214,0.06)",borderRadius:"10px",padding:"18px",marginTop:"16px"}}>
            <div style={{fontSize:"15px",fontFamily:F.display,fontWeight:700,color:"#f0ead6",marginBottom:"8px"}}>What Your Google Sheet Looks Like</div>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:"11px",color:"rgba(240,234,214,0.7)"}}>
                <thead>
                  <tr style={{borderBottom:"2px solid rgba(218,165,32,0.3)"}}>
                    {["Guest Name","Selection","Diet Notes","Submitted"].map(h=>(
                      <th key={h} style={{padding:"8px 6px",textAlign:"left",color:"#daa520",fontWeight:600,whiteSpace:"nowrap"}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Bergheim, Roxanne","Pan Fried Cod","","10:32 AM"],
                    ["Bose, Shyamal","Penne Pasta","Vegetarian","10:34 AM"],
                    ["Clarke, Rhona","Lemon Chicken","Gluten-free","10:35 AM"],
                    ["Cowan, Brenda","Pan Fried Cod","","10:41 AM"],
                    ["Hillenbrand, Ruth","Fish & Chips","","10:45 AM"],
                  ].map((row,i)=>(
                    <tr key={i} style={{borderBottom:"1px solid rgba(240,234,214,0.06)"}}>
                      {row.map((c,j)=><td key={j} style={{padding:"6px",whiteSpace:"nowrap"}}>{c}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ═══ ADMIN: EMAIL PREVIEW ═══
  if(mode==="admin" && showEmail && aDay!==null && aMeal!==null) {
    const day = TOUR_DATA[aDay];
    const meal = day.meals[aMeal];
    const emailBody = buildEmailBody(day, meal);
    return (
      <div style={S.page}><Fonts/>
        <Hdr onBack={()=>setShowEmail(false)} title="Email to Restaurant" subtitle={meal.venue}/>
        <div ref={ref} style={S.content}>
          <div style={{background:"rgba(240,234,214,0.06)",borderRadius:"10px",padding:"18px",marginBottom:"16px"}}>
            <div style={{fontSize:"12px",color:"rgba(240,234,214,0.4)",marginBottom:"4px"}}>To:</div>
            <div style={{fontSize:"14px",color:"#f0ead6",fontWeight:600,marginBottom:"12px"}}>{meal.email || meal.phone || "Restaurant contact"}</div>
            <div style={{fontSize:"12px",color:"rgba(240,234,214,0.4)",marginBottom:"4px"}}>Subject:</div>
            <div style={{fontSize:"14px",color:"#f0ead6",fontWeight:600,marginBottom:"12px"}}>McCarthy's Party – Day {day.day} {meal.type} Order</div>
            <div style={{fontSize:"12px",color:"rgba(240,234,214,0.4)",marginBottom:"8px"}}>Body:</div>
            <pre style={{fontSize:"12px",color:"rgba(240,234,214,0.7)",lineHeight:1.6,whiteSpace:"pre-wrap",fontFamily:F.body,margin:0,padding:"14px",background:"rgba(0,0,0,0.2)",borderRadius:"8px"}}>{emailBody}</pre>
          </div>
          <div style={{display:"flex",gap:"10px"}}>
            <button onClick={()=>{navigator.clipboard?.writeText(emailBody);}} style={{...S.goldBtn,flex:1,padding:"12px",fontSize:"12px"}}>Copy to Clipboard</button>
            <button onClick={()=>setShowEmail(false)} style={{...S.ghostBtn,flex:1,padding:"12px",fontSize:"12px"}}>Back to Tally</button>
          </div>
        </div>
      </div>
    );
  }

  // ═══ ADMIN: MEAL TALLY ═══
  if(mode==="admin" && aView==="meal" && aDay!==null && aMeal!==null) {
    const day = TOUR_DATA[aDay];
    const meal = day.meals[aMeal];
    const guests = Object.values(allG);
    const secs = (meal.sections||[]).filter(s=>!s.fixed);
    const tallies = {};
    secs.forEach(sec => {
      tallies[sec.title] = {};
      sec.items.forEach(i=>tallies[sec.title][i.name]=[]);
      tallies[sec.title]["_none"] = [];
    });
    guests.forEach(g => {
      secs.forEach(sec => {
        const c = g.selections?.[`${day.day}|${meal.type}|${sec.title}`];
        if(c && tallies[sec.title][c]) tallies[sec.title][c].push(g.name);
        else tallies[sec.title]["_none"].push(g.name);
      });
    });

    return (
      <div style={S.page}><Fonts/>
        <Hdr onBack={()=>{setAView("overview");setADay(null);setAMeal(null);}} title={`Day ${day.day} – ${meal.type}`} subtitle={meal.venue}/>
        <div ref={ref} style={S.content}>
          {meal.venue && <div style={S.venueCard}>
            <div style={{fontSize:"15px",fontFamily:F.display,fontWeight:700,color:"#f0ead6",marginBottom:"4px"}}>{meal.venue}</div>
            <div style={{fontSize:"12px",color:"rgba(240,234,214,0.5)"}}>
              {meal.phone&&<span>📞 {meal.phone}</span>}{meal.time&&<span> · 🕐 {meal.time}</span>}
            </div>
            {meal.deadline&&<div style={{marginTop:"6px",fontSize:"11px",color:"#daa520"}}>⏰ Deadline: {meal.deadline}</div>}
          </div>}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"14px",gap:"8px",flexWrap:"wrap"}}>
            <span style={{fontSize:"12px",color:"rgba(240,234,214,0.4)"}}>{guests.length} guests</span>
            <div style={{display:"flex",gap:"8px"}}>
              <button onClick={()=>setShowEmail(true)} style={{...S.ghostBtn,padding:"6px 14px",fontSize:"11px"}}>📧 Email to Restaurant</button>
              <button onClick={refresh} style={{...S.link,fontSize:"12px"}}>↻ Refresh</button>
            </div>
          </div>
          {secs.map((sec,si)=>(
            <div key={si} style={{marginBottom:"24px"}}>
              <SectionHead title={sec.title}/>
              {sec.items.map((item,ii)=>{
                const v = tallies[sec.title][item.name]||[];
                return (
                  <div key={ii} style={{background:"rgba(240,234,214,0.04)",border:"1px solid rgba(240,234,214,0.06)",borderRadius:"7px",padding:"11px 13px",marginBottom:"5px"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div style={{display:"flex",alignItems:"center",gap:"7px"}}>
                        {item.num&&<Num n={item.num}/>}
                        <span style={{fontSize:"13px",fontWeight:600}}>{item.name}</span>
                      </div>
                      <span style={{fontSize:"20px",fontWeight:700,color:"#daa520"}}>{v.length}</span>
                    </div>
                    {v.length>0&&<div style={{marginTop:"5px",paddingLeft:item.num?"28px":0,fontSize:"11px",color:"rgba(240,234,214,0.4)",lineHeight:1.5}}>{v.join(", ")}</div>}
                  </div>
                );
              })}
              {tallies[sec.title]["_none"].length>0&&(
                <div style={{background:"rgba(231,76,60,0.06)",border:"1px solid rgba(231,76,60,0.12)",borderRadius:"7px",padding:"10px 13px",marginTop:"4px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{fontSize:"12px",color:"rgba(231,76,60,0.7)",fontWeight:500}}>Not yet selected</span>
                    <span style={{fontSize:"16px",fontWeight:700,color:"rgba(231,76,60,0.6)"}}>{tallies[sec.title]["_none"].length}</span>
                  </div>
                  <div style={{marginTop:"4px",fontSize:"11px",color:"rgba(231,76,60,0.45)",lineHeight:1.4}}>{tallies[sec.title]["_none"].join(", ")}</div>
                </div>
              )}
            </div>
          ))}
          {/* Dietary notes summary */}
          {guests.filter(g=>g.notes).length>0&&(
            <div style={{marginTop:"8px"}}>
              <SectionHead title="Dietary Notes"/>
              {guests.filter(g=>g.notes).map((g,i)=>(
                <div key={i} style={{fontSize:"12px",color:"rgba(240,234,214,0.5)",marginBottom:"4px"}}>
                  <strong style={{color:"rgba(240,234,214,0.7)"}}>{g.name}:</strong> {g.notes}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ═══ ADMIN: OVERVIEW ═══
  if(mode==="admin") {
    const gl = Object.values(allG);
    return (
      <div style={S.page}><Fonts/>
        <div style={{padding:"18px 20px 0",maxWidth:"540px",margin:"0 auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div>
              <div style={S.brandLabel}>Guide Dashboard</div>
              <h1 style={{margin:0,fontSize:"21px",fontFamily:F.display,fontWeight:700,color:"#f0ead6"}}>Meal Orders</h1>
            </div>
            <div style={{display:"flex",gap:"8px",alignItems:"center"}}>
              <button onClick={()=>setShowSetup(true)} style={{...S.ghostBtn,padding:"5px 12px",fontSize:"11px"}}>⚙️ Setup</button>
              <button onClick={refresh} style={{...S.ghostBtn,padding:"5px 12px",fontSize:"11px"}}>↻</button>
              <button onClick={()=>{setMode("splash");setPin("");}} style={{...S.link,fontSize:"11px"}}>Logout</button>
            </div>
          </div>
          <div style={{width:"36px",height:"2px",background:"#daa520",margin:"10px 0 5px"}}/>
          <div style={{fontSize:"11px",color:"rgba(240,234,214,0.35)",marginBottom:"18px"}}>{gl.length} guests registered · Tap a meal for tallies</div>
        </div>
        <div ref={ref} style={{padding:"0 20px 36px",maxWidth:"540px",margin:"0 auto"}}>
          {TOUR_DATA.map((day,di)=>{
            const sm = day.meals.filter(m=>m.sections&&!m.isBuffet&&!m.isOnOwn);
            if(!sm.length) return null;
            return (
              <div key={di} style={{marginBottom:"14px"}}>
                <div style={{fontSize:"11px",color:"rgba(240,234,214,0.3)",fontWeight:500,marginBottom:"5px",letterSpacing:"0.5px"}}>DAY {day.day} — {day.title.toUpperCase()}</div>
                {sm.map((meal,mi)=>{
                  const ri = day.meals.indexOf(meal);
                  const secs = (meal.sections||[]).filter(s=>!s.fixed);
                  const responded = gl.filter(g=>secs.some(s=>g.selections?.[`${day.day}|${meal.type}|${s.title}`])).length;
                  const allDone = responded===gl.length && gl.length>0;
                  return (
                    <button key={mi} onClick={()=>{setADay(di);setAMeal(ri);setAView("meal");}} style={S.card}
                      onMouseOver={e=>{e.currentTarget.style.background="rgba(240,234,214,0.09)";}} onMouseOut={e=>{e.currentTarget.style.background="rgba(240,234,214,0.05)";}}>
                      <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                        <span style={{fontSize:"18px"}}>{ICONS[meal.type]||"🍽️"}</span>
                        <div style={{flex:1}}>
                          <div style={{fontSize:"13px",fontWeight:600,fontFamily:F.display}}>{meal.type}</div>
                          <div style={{fontSize:"11px",color:"rgba(240,234,214,0.45)"}}>{meal.venue}</div>
                        </div>
                        <div style={{textAlign:"right"}}>
                          <div style={{fontSize:"17px",fontWeight:700,color:allDone?"#4a7c59":"#daa520"}}>{responded}/{gl.length}</div>
                          <div style={{fontSize:"9px",color:"rgba(240,234,214,0.35)"}}>responded</div>
                        </div>
                        <span style={{color:"rgba(218,165,32,0.4)",fontSize:"14px"}}>→</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ═══ GUEST: MEAL DETAIL ═══
  if(mode==="guest" && view==="meal" && sDay!==null && sMeal!==null) {
    const day = TOUR_DATA[sDay]; const meal = day.meals[sMeal];
    return (
      <div style={S.page}><Fonts/>
        <Hdr onBack={()=>setView("day")} title={meal.type} subtitle={`Day ${day.day} · ${meal.venue}`}
          extra={saving?<span style={{fontSize:"10px",color:"#4a7c59"}}>Saving...</span>:null}/>
        <div ref={ref} style={S.content}>
          <div style={S.venueCard}>
            <div style={{fontSize:"16px",fontFamily:F.display,fontWeight:700,color:"#f0ead6",marginBottom:"5px"}}>{meal.venue}</div>
            <div style={{fontSize:"12px",color:"rgba(240,234,214,0.5)",lineHeight:1.6}}>
              {meal.venueLocation&&<div>📍 {meal.venueLocation}</div>}
              {meal.phone&&<div>📞 {meal.phone}</div>}
              {meal.time&&<div>🕐 {meal.time}</div>}
            </div>
            {meal.leadTime&&<div style={{marginTop:"8px",padding:"6px 10px",background:"rgba(218,165,32,0.1)",borderRadius:"5px",fontSize:"11px",color:"#daa520",border:"1px solid rgba(218,165,32,0.2)"}}>⚠️ {meal.leadTime}</div>}
            {meal.deadline&&<div style={{marginTop:"5px",padding:"6px 10px",background:"rgba(74,124,89,0.1)",borderRadius:"5px",fontSize:"11px",color:"#4a7c59",border:"1px solid rgba(74,124,89,0.2)"}}>⏰ Please select by: {meal.deadline}</div>}
          </div>
          {meal.sections?.map((sec,si)=>{
            if(sec.fixed) return (
              <div key={si} style={{padding:"10px 14px",background:"rgba(240,234,214,0.04)",borderRadius:"7px",marginBottom:"14px",fontSize:"12px",color:"rgba(240,234,214,0.5)",fontStyle:"italic"}}>
                ✓ Included: {sec.items.map(i=>i.name).join(", ")}
              </div>
            );
            const sel = sec.items.some(i=>i.num);
            const cur = getPick(day.day,meal.type,sec.title);
            return (
              <div key={si} style={{marginBottom:"22px"}}>
                <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"10px"}}>
                  <h3 style={{fontSize:"14px",fontFamily:F.display,fontWeight:600,color:"#daa520",margin:0,whiteSpace:"nowrap"}}>{sec.title} – Select One</h3>
                  <div style={{flex:1,height:"1px",background:"linear-gradient(90deg, rgba(218,165,32,0.3), transparent)"}}/>
                  {cur&&<span style={{fontSize:"10px",color:"#4a7c59",fontWeight:600}}>✓</span>}
                </div>
                {sec.items.map((item,ii)=>{
                  const active = cur===item.name;
                  return (
                    <button key={ii} onClick={()=>pick(day.day,meal.type,sec.title,active?null:item.name)}
                      style={{...S.menuItem,background:active?"rgba(218,165,32,0.12)":"rgba(240,234,214,0.04)",border:active?"1px solid rgba(218,165,32,0.4)":"1px solid rgba(240,234,214,0.06)"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                        <div style={{flex:1}}>
                          <div style={{display:"flex",alignItems:"center",gap:"7px",flexWrap:"wrap"}}>
                            {item.num&&<Num n={item.num} active={active}/>}
                            <span style={{fontSize:"14px",fontWeight:600}}>{item.name}</span>
                            {item.tags?.map(t=><Tag key={t} t={t}/>)}
                          </div>
                          {item.desc&&<div style={{fontSize:"11px",color:"rgba(240,234,214,0.45)",marginTop:"3px",paddingLeft:item.num?"28px":0}}>{item.desc}</div>}
                        </div>
                        <div style={{display:"flex",alignItems:"center",gap:"7px",flexShrink:0,marginLeft:"10px"}}>
                          {item.price&&<span style={{fontSize:"11px",color:"rgba(240,234,214,0.3)"}}>{item.price}</span>}
                          <Radio on={active}/>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            );
          })}
          {meal.footerNote&&<div style={S.footNote}>{meal.footerNote}</div>}
        </div>
      </div>
    );
  }

  // ═══ GUEST: DAY DETAIL ═══
  if(mode==="guest" && view==="day" && sDay!==null) {
    const day = TOUR_DATA[sDay];
    return (
      <div style={S.page}><Fonts/>
        <Hdr onBack={()=>{setView("days");setSDay(null);}} title={`Day ${day.day}`} subtitle={day.title}/>
        <div ref={ref} style={S.content}>
          <div style={{fontSize:"12px",color:"rgba(240,234,214,0.45)",marginBottom:"5px"}}>📍 Overnight: {day.location}</div>
          <p style={{fontSize:"12px",color:"rgba(240,234,214,0.35)",lineHeight:1.5,margin:"0 0 20px",fontStyle:"italic"}}>{day.subtitle}</p>
          {day.meals.length===0&&<div style={{textAlign:"center",padding:"36px 20px",color:"rgba(240,234,214,0.3)"}}><div style={{fontSize:"28px",marginBottom:"8px"}}>🍽️</div><p style={{fontSize:"13px",margin:0}}>No included meals today.</p></div>}
          {day.meals.map((meal,mi)=>{
            const icon = ICONS[meal.type]||"🍽️";
            const hasMenu = meal.sections&&!meal.isBuffet&&!meal.isOnOwn;
            const sc = hasMenu?Object.keys(gSel).filter(k=>k.startsWith(`${day.day}|${meal.type}|`)).length:0;
            return (
              <button key={mi} onClick={()=>{if(hasMenu){setSMeal(mi);setView("meal");}}} style={{...S.card,cursor:hasMenu?"pointer":"default"}}
                onMouseOver={e=>{if(hasMenu)e.currentTarget.style.background="rgba(240,234,214,0.09)";}} onMouseOut={e=>{e.currentTarget.style.background="rgba(240,234,214,0.05)";}}>
                <div style={{display:"flex",alignItems:"stretch"}}>
                  <div style={{width:"44px",display:"flex",alignItems:"center",justifyContent:"center",background:meal.isFarewell?"rgba(218,165,32,0.12)":"rgba(218,165,32,0.06)",borderRight:"1px solid rgba(218,165,32,0.1)",fontSize:"18px",flexShrink:0}}>{icon}</div>
                  <div style={{flex:1,padding:"11px 13px"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <span style={{fontSize:"13px",fontWeight:600,fontFamily:F.display}}>{meal.type}</span>
                      {hasMenu&&<div style={{display:"flex",alignItems:"center",gap:"4px"}}>
                        {sc>0&&<span style={{fontSize:"10px",color:"#4a7c59",fontWeight:600}}>✓ {sc}</span>}
                        <span style={{color:"rgba(218,165,32,0.5)",fontSize:"13px"}}>→</span>
                      </div>}
                    </div>
                    {meal.venue&&<div style={{fontSize:"11px",color:"rgba(240,234,214,0.5)",marginTop:"2px"}}>{meal.venue}</div>}
                    {meal.time&&<div style={{fontSize:"10px",color:"rgba(240,234,214,0.3)",marginTop:"1px"}}>🕐 {meal.time}</div>}
                    {meal.note&&<div style={{fontSize:"10px",color:meal.pending?"rgba(218,165,32,0.5)":"rgba(240,234,214,0.3)",marginTop:"3px",fontStyle:meal.pending?"italic":"normal"}}>{meal.note}</div>}
                    {meal.isBuffet&&!meal.isFarewell&&<Pill text="Buffet"/>}
                    {meal.isOnOwn&&<Pill text="On your own" dim/>}
                    {meal.isFarewell&&<Pill text="Farewell Banquet" gold/>}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ═══ GUEST: DAY LIST ═══
  return (
    <div style={S.page}><Fonts/>
      <div style={{padding:"16px 20px 0",maxWidth:"540px",margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <div style={S.brandLabel}>McCarthy's Party</div>
            <h1 style={{margin:0,fontSize:"21px",fontFamily:F.display,fontWeight:700,color:"#f0ead6"}}>Your Tour Menus</h1>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:"11px",color:"rgba(240,234,214,0.45)",marginBottom:"3px"}}>{gName}</div>
            <button onClick={()=>{setMode("splash");setGName("");setGSel({});}} style={{...S.link,fontSize:"11px"}}>Logout</button>
          </div>
        </div>
        <div style={{width:"36px",height:"2px",background:"#daa520",margin:"10px 0 14px"}}/>
        <p style={{fontSize:"11px",color:"rgba(240,234,214,0.28)",margin:"0 0 16px",lineHeight:1.4}}>Tap a day to browse menus and make selections. Your choices are saved automatically.</p>
      </div>
      <div ref={ref} style={{padding:"0 20px 36px",maxWidth:"540px",margin:"0 auto"}}>
        {TOUR_DATA.map((day,i)=>{
          const tc=pickCount(day.day);
          const mt=day.meals.map(m=>m.type).filter(t=>t!=="Breakfast");
          return (
            <button key={i} onClick={()=>{setSDay(i);setView("day");}} style={S.card}
              onMouseOver={e=>{e.currentTarget.style.background="rgba(240,234,214,0.08)";}} onMouseOut={e=>{e.currentTarget.style.background="rgba(240,234,214,0.04)";}}>
              <div style={{display:"flex",alignItems:"center"}}>
                <div style={{width:"46px",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,background:"rgba(218,165,32,0.06)",borderRight:"1px solid rgba(218,165,32,0.1)",alignSelf:"stretch"}}>
                  <div><div style={{fontSize:"8px",color:"#daa520",letterSpacing:"1px",textTransform:"uppercase",textAlign:"center",fontWeight:500}}>Day</div>
                  <div style={{fontSize:"19px",fontWeight:700,color:"#daa520",textAlign:"center",fontFamily:F.display}}>{day.day}</div></div>
                </div>
                <div style={{flex:1,padding:"10px 12px"}}>
                  <div style={{fontSize:"13px",fontWeight:600,fontFamily:F.display,lineHeight:1.3,marginBottom:"2px"}}>{day.title}</div>
                  <div style={{fontSize:"10px",color:"rgba(240,234,214,0.35)",display:"flex",alignItems:"center",gap:"5px",flexWrap:"wrap"}}>
                    <span>📍 {day.location}</span>
                    {mt.length>0&&<><span>·</span><span>{mt.join(", ")}</span></>}
                    {tc>0&&<span style={{color:"#4a7c59",fontWeight:600}}>✓ {tc}</span>}
                  </div>
                </div>
                <div style={{paddingRight:"12px",color:"rgba(218,165,32,0.4)",fontSize:"13px"}}>→</div>
              </div>
            </button>
          );
        })}
      </div>
      <div style={{textAlign:"center",padding:"12px 20px 24px",fontSize:"10px",color:"rgba(240,234,214,0.15)",borderTop:"1px solid rgba(240,234,214,0.05)",maxWidth:"540px",margin:"0 auto"}}>McCarthy's Party Inc. · Newfoundland & Labrador · 2026</div>
    </div>
  );
}

// ─── COMPONENTS ───
function Compass(){return <div style={{width:"55px",height:"55px",margin:"0 auto 18px"}}><svg viewBox="0 0 70 70" fill="none" style={{width:"100%",height:"100%"}}><circle cx="35" cy="35" r="32" stroke="rgba(218,165,32,0.35)" strokeWidth="1" fill="none"/><polygon points="35,6 38,31 35,28 32,31" fill="#daa520" opacity="0.9"/><polygon points="35,64 32,39 35,42 38,39" fill="rgba(218,165,32,0.45)"/><polygon points="6,35 31,32 28,35 31,38" fill="rgba(218,165,32,0.45)"/><polygon points="64,35 39,38 42,35 39,32" fill="rgba(218,165,32,0.45)"/><circle cx="35" cy="35" r="2.5" fill="#daa520"/></svg></div>}
function Hdr({onBack,title,subtitle,extra}){return <div style={{padding:"12px 20px",maxWidth:"540px",margin:"0 auto",borderBottom:"1px solid rgba(240,234,214,0.08)"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><button onClick={onBack} style={{background:"none",border:"none",color:"#daa520",fontSize:"12px",cursor:"pointer",fontFamily:F.body,padding:"3px 0"}}>← Back</button>{extra}</div><h2 style={{margin:"4px 0 1px",fontSize:"18px",fontFamily:F.display,fontWeight:700,color:"#f0ead6"}}>{title}</h2>{subtitle&&<div style={{fontSize:"12px",color:"rgba(240,234,214,0.4)"}}>{subtitle}</div>}</div>}
function Fonts(){return <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Source+Sans+3:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>}
function Num({n,active}){return <span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:"20px",height:"20px",borderRadius:"50%",background:active?"#daa520":"rgba(218,165,32,0.2)",color:active?"#1a2332":"#daa520",fontSize:"11px",fontWeight:700,flexShrink:0}}>{n}</span>}
function Radio({on}){return <div style={{width:"17px",height:"17px",borderRadius:"50%",border:`2px solid ${on?"#daa520":"rgba(240,234,214,0.2)"}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{on&&<div style={{width:"9px",height:"9px",borderRadius:"50%",background:"#daa520"}}/>}</div>}
function Tag({t}){return <span style={{fontSize:"8px",padding:"2px 5px",borderRadius:"3px",background:TAG[t]?.bg||"rgba(136,136,136,0.2)",color:TAG[t]?.color||"#888",fontWeight:600}}>{t==="GF*"?"GF OPT":t}</span>}
function Pill({text,dim,gold}){return <span style={{display:"inline-block",marginTop:"4px",padding:"2px 8px",background:gold?"rgba(218,165,32,0.15)":dim?"rgba(240,234,214,0.08)":"rgba(218,165,32,0.1)",borderRadius:"10px",fontSize:"9px",color:gold?"#daa520":dim?"rgba(240,234,214,0.45)":"#daa520",fontWeight:gold?600:500}}>{text}</span>}
function SectionHead({title}){return <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"10px"}}><h3 style={{fontSize:"14px",fontFamily:F.display,fontWeight:600,color:"#daa520",margin:0,whiteSpace:"nowrap"}}>{title}</h3><div style={{flex:1,height:"1px",background:"linear-gradient(90deg, rgba(218,165,32,0.3), transparent)"}}/></div>}
function StepCard({num,title,color,children}){return <div style={{background:"rgba(240,234,214,0.05)",borderRadius:"10px",padding:"18px",marginBottom:"14px",borderLeft:`3px solid ${color}`}}><div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"10px"}}><span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:"28px",height:"28px",borderRadius:"50%",background:color,color:"#fff",fontSize:"14px",fontWeight:700,flexShrink:0}}>{num}</span><span style={{fontSize:"16px",fontFamily:F.display,fontWeight:700,color:"#f0ead6"}}>{title}</span></div>{children}</div>}

const F = {display:"'Playfair Display', Georgia, serif",body:"'Source Sans 3', sans-serif"};
const S = {
  splash:{minHeight:"100vh",background:"linear-gradient(165deg, #1a2332 0%, #0d1926 40%, #162a3a 100%)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:F.display,position:"relative"},
  fadeIn:{textAlign:"center",padding:"0 28px",maxWidth:"420px",transition:"all 1.2s cubic-bezier(0.22,1,0.36,1)"},
  brand:{fontSize:"12px",letterSpacing:"3.5px",color:"#daa520",textTransform:"uppercase",marginBottom:"10px",fontFamily:F.body,fontWeight:300},
  h1big:{fontSize:"clamp(28px,7vw,40px)",color:"#f0ead6",margin:"0 0 6px",fontWeight:700,lineHeight:1.15,fontFamily:F.display},
  line:{width:"50px",height:"2px",background:"linear-gradient(90deg, transparent, #daa520, transparent)",margin:"14px auto 16px"},
  subtext:{fontSize:"14px",color:"rgba(240,234,214,0.5)",margin:"0 0 10px",lineHeight:1.6,fontFamily:F.body,fontWeight:300},
  goldBtn:{background:"linear-gradient(135deg, #daa520, #b8860b)",color:"#1a2332",border:"none",padding:"12px 38px",fontSize:"13px",fontFamily:F.body,fontWeight:600,letterSpacing:"1.5px",textTransform:"uppercase",borderRadius:"4px",cursor:"pointer",boxShadow:"0 4px 16px rgba(218,165,32,0.3)"},
  ghostBtn:{background:"transparent",color:"#daa520",border:"1px solid rgba(218,165,32,0.3)",padding:"10px 28px",fontSize:"12px",fontFamily:F.body,fontWeight:500,letterSpacing:"1px",textTransform:"uppercase",borderRadius:"4px",cursor:"pointer"},
  link:{background:"none",border:"none",color:"#daa520",fontSize:"12px",cursor:"pointer",fontFamily:F.body,padding:"2px 0"},
  input:{width:"100%",padding:"11px 14px",borderRadius:"6px",border:"1px solid rgba(240,234,214,0.2)",background:"rgba(240,234,214,0.06)",color:"#f0ead6",fontSize:"16px",fontFamily:F.body,outline:"none",boxSizing:"border-box"},
  page:{minHeight:"100vh",background:"linear-gradient(165deg, #1a2332 0%, #0d1926 40%, #162a3a 100%)",fontFamily:F.body,color:"#f0ead6"},
  content:{padding:"16px 20px 60px",maxWidth:"540px",margin:"0 auto"},
  venueCard:{background:"rgba(240,234,214,0.06)",borderRadius:"9px",padding:"15px",marginBottom:"20px",borderLeft:"3px solid #daa520"},
  brandLabel:{fontSize:"10px",letterSpacing:"2.5px",color:"#daa520",textTransform:"uppercase",fontWeight:300,marginBottom:"3px",fontFamily:F.body},
  card:{display:"block",width:"100%",background:"rgba(240,234,214,0.04)",border:"1px solid rgba(240,234,214,0.07)",borderRadius:"8px",padding:0,marginBottom:"6px",cursor:"pointer",textAlign:"left",color:"#f0ead6",fontFamily:F.body,transition:"all 0.2s ease",overflow:"hidden"},
  menuItem:{display:"block",width:"100%",textAlign:"left",borderRadius:"7px",padding:"11px 13px",marginBottom:"5px",color:"#f0ead6",fontFamily:F.body,transition:"all 0.2s ease",cursor:"pointer"},
  footNote:{padding:"10px 14px",background:"rgba(218,165,32,0.08)",borderRadius:"6px",fontSize:"12px",color:"#daa520",textAlign:"center",fontStyle:"italic",border:"1px solid rgba(218,165,32,0.15)"},
  stepText:{fontSize:"13px",color:"rgba(240,234,214,0.6)",lineHeight:1.6,margin:"0 0 8px"},
  codeBox:{background:"rgba(0,0,0,0.3)",borderRadius:"6px",padding:"12px",marginTop:"8px",overflowX:"auto"},
};
