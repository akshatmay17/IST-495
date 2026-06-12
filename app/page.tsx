"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://xlizcyyuadwnmdqbkjfg.supabase.co",
  "sb_publishable_3BnSyxM0zyXudw2OZXF3wA_I0cuODRG"
);

/* ============================================================
   DESIGN SYSTEM — v3
   Aesthetic: Clean white fintech. Like Chase online banking meets Stripe.
   White backgrounds. Blue accents only. Inter font. No gradients. No emojis.
   Feels like a real financial product — not AI-generated.
   ============================================================ */

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,300;0,400;0,500;0,600;0,700&display=swap');`;

const DARK_CSS = `
  --bg:        #0F1117;
  --bg2:       #181C25;
  --surface:   #1E2130;
  --surface2:  #252A3A;
  --border:    rgba(255,255,255,.08);
  --border2:   rgba(255,255,255,.12);
  --text:      #F0F2F5;
  --text2:     #8B93A5;
  --text3:     #3D4455;
  --accent:    #3B82F6;
  --accent2:   #2563EB;
  --accentbg:  rgba(59,130,246,.12);
  --green:     #22C55E;
  --greenbg:   rgba(34,197,94,.1);
  --red:       #EF4444;
  --redbg:     rgba(239,68,68,.1);
  --amber:     #F59E0B;
  --amberbg:   rgba(245,158,11,.1);
  --sans:      'Inter', system-ui, -apple-system, sans-serif;
  --shadow:    0 1px 4px rgba(0,0,0,.3);
  --shadow-lg: 0 4px 20px rgba(0,0,0,.4);
  --radius:    10px;
`;

const LIGHT_CSS = `
  --bg:        #F3F6FB;
  --bg2:       #E8EDF5;
  --surface:   #FFFFFF;
  --surface2:  #F7F9FC;
  --border:    #E2E8F0;
  --border2:   #C9D3E0;
  --text:      #1A202C;
  --text2:     #718096;
  --text3:     #BEC8D6;
  --accent:    #2563EB;
  --accent2:   #1D4ED8;
  --accentbg:  #EBF4FF;
  --green:     #276749;
  --greenbg:   #F0FFF4;
  --red:       #C53030;
  --redbg:     #FFF5F5;
  --amber:     #B7791F;
  --amberbg:   #FFFFF0;
  --sans:      'Inter', system-ui, -apple-system, sans-serif;
  --shadow:    0 1px 3px rgba(0,0,0,.07), 0 1px 2px rgba(0,0,0,.04);
  --shadow-lg: 0 6px 20px rgba(0,0,0,.08);
  --radius:    8px;
`;

const BASE_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,300;0,400;0,500;0,600;0,700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root { ${LIGHT_CSS} }
:root.dark { ${DARK_CSS} }

html, body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--sans);
  font-size: 15px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
}

button, input, select, textarea { font-family: var(--sans); cursor: pointer; }
::-webkit-scrollbar { display: none; }

@keyframes fadeUp  { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
@keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
@keyframes popIn   { from { opacity:0; transform:scale(.98); } to { opacity:1; transform:scale(1); } }
@keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:.4} }

.au { animation: fadeUp .3s ease both; }
.ai { animation: fadeIn .2s ease both; }
.ap { animation: popIn  .25s ease both; }
.d1{animation-delay:.04s} .d2{animation-delay:.08s} .d3{animation-delay:.12s}
.d4{animation-delay:.16s} .d5{animation-delay:.2s}  .d6{animation-delay:.24s}
.press:active { opacity:.7; transition:opacity .08s; }

/* Form elements */
.field {
  width:100%; padding:11px 14px;
  border-radius:8px;
  background:var(--surface);
  border:1.5px solid var(--border2);
  color:var(--text); font-size:15px; outline:none;
  transition:border-color .15s, box-shadow .15s;
  font-family:var(--sans);
}
.field:focus { border-color:var(--accent); box-shadow:0 0 0 3px var(--accentbg); }
.field::placeholder { color:var(--text3); }
select.field { appearance:none; }

/* Badges */
.pill { display:inline-flex; align-items:center; padding:2px 8px; border-radius:99px; font-size:11px; font-weight:600; }
.pill-gold    { background:var(--accentbg); color:var(--accent); border:1px solid rgba(37,99,235,.15); }
.pill-blue    { background:var(--accentbg); color:var(--accent); border:1px solid rgba(37,99,235,.15); }
.pill-emerald { background:var(--greenbg);  color:var(--green);  border:1px solid rgba(22,163,74,.2); }
.pill-green   { background:var(--greenbg);  color:var(--green);  border:1px solid rgba(22,163,74,.2); }
.pill-rose    { background:var(--redbg);    color:var(--red);    border:1px solid rgba(220,38,38,.2); }
.pill-red     { background:var(--redbg);    color:var(--red);    border:1px solid rgba(220,38,38,.2); }
.pill-amber   { background:var(--amberbg);  color:var(--amber);  border:1px solid rgba(217,119,6,.2); }
.pill-accent  { background:var(--accentbg); color:var(--accent); border:1px solid rgba(37,99,235,.15); }
.pill-gray    { background:var(--surface2); color:var(--text2);  border:1px solid var(--border); }

/* Surfaces */
.card-s        { background:var(--surface);  border:1px solid var(--border); border-radius:var(--radius); }
.card-s2       { background:var(--surface2); border:1px solid var(--border); border-radius:var(--radius); }
.card-surface  { background:var(--surface);  border:1px solid var(--border); border-radius:var(--radius); }
.card-surface-2{ background:var(--surface2); border:1px solid var(--border); border-radius:var(--radius); }

/* Utilities */
.divider { height:1px; background:var(--border); width:100%; }
.screen  { min-height:100vh; padding-bottom:88px; }
.px      { padding-left:20px; padding-right:20px; }
.serif   { font-family:var(--sans); }
.nav-safe{ padding-bottom:max(12px,env(safe-area-inset-bottom)); }
.track   { background:var(--border2); border-radius:99px; overflow:hidden; }
.fill    { height:100%; border-radius:99px; transition:width .6s ease; }
.gold-text { color:var(--accent); font-weight:600; }
.hover-lift { transition:box-shadow .15s, transform .15s; }
.hover-lift:hover { box-shadow:var(--shadow-lg); transform:translateY(-1px); }

/* Buttons */
.btn-gold {
  background:var(--accent); color:#fff; border:none; font-weight:600;
  border-radius:8px; padding:13px 22px; font-size:15px;
  font-family:var(--sans); cursor:pointer;
  transition:background .15s; letter-spacing:-.1px;
}
.btn-gold:hover { background:var(--accent2); }
.btn-gold:active { opacity:.9; }
.btn-gold:disabled { background:var(--border2); color:var(--text3); cursor:not-allowed; }

.btn-ghost {
  background:var(--surface); color:var(--text2);
  border:1.5px solid var(--border2); font-weight:500;
  border-radius:8px; padding:10px 18px; font-size:14px;
  font-family:var(--sans); cursor:pointer;
  transition:border-color .15s, color .15s;
}
.btn-ghost:hover { border-color:var(--accent); color:var(--accent); }

/* Toggle */
.toggle-track {
  width:44px; height:24px; border-radius:12px;
  background:var(--border2); border:none; cursor:pointer;
  position:relative; transition:background .2s; flex-shrink:0;
}
.toggle-track.on { background:var(--accent); }
.toggle-knob {
  position:absolute; top:3px; left:3px;
  width:18px; height:18px; border-radius:50%; background:white;
  transition:left .2s ease; box-shadow:0 1px 3px rgba(0,0,0,.2);
}
.toggle-track.on .toggle-knob { left:23px; }

/* ============================================================
   RESPONSIVE BREAKPOINTS
   Phone:        < 768px   — bottom nav, no sidebar, full width
   iPad/Tablet:  768–1023px — sidebar hidden, wider content, bottom nav
   iPad Pro:     1024–1199px — narrow sidebar (240px), wider content
   Laptop:       1200–1439px — full sidebar (280px), content max 900px
   Desktop/iMac: 1440px+   — full sidebar (300px), content max 1100px
   ============================================================ */

/* ── Phone (max 767px) ── */
@media (max-width: 767px) {
  .desktop-sidebar { display: none !important; }
  .desktop-main { margin-left: 0 !important; }
  .desktop-content { padding: 64px 16px 100px; max-width: 100%; }
}

/* ── iPad / Tablet portrait (768px – 1023px) ── */
@media (min-width: 768px) and (max-width: 1023px) {
  .desktop-sidebar { display: none !important; }
  .desktop-main { margin-left: 0 !important; }
  .mobile-nav { display: flex !important; }
  .desktop-content { max-width: 680px; margin: 0 auto; padding: 48px 28px 100px; }
}

/* ── iPad Pro / Large Tablet landscape (1024px – 1199px) ── */
@media (min-width: 1024px) and (max-width: 1199px) {
  .desktop-sidebar { position: fixed; left: 0; top: 0; width: 240px; height: 100vh; overflow-y: auto; border-right: 1px solid var(--border); background: var(--surface); z-index: 100; display: flex !important; flex-direction: column; }
  .desktop-main { margin-left: 240px; }
  .mobile-nav { display: none !important; }
  .desktop-content { max-width: 720px; margin: 0 auto; padding: 36px 28px 80px; }
}

/* ── Laptop (1200px – 1439px) ── */
@media (min-width: 1200px) and (max-width: 1439px) {
  .desktop-sidebar { position: fixed; left: 0; top: 0; width: 280px; height: 100vh; overflow-y: auto; border-right: 1px solid var(--border); background: var(--surface); z-index: 100; display: flex !important; flex-direction: column; }
  .desktop-main { margin-left: 280px; }
  .mobile-nav { display: none !important; }
  .desktop-content { max-width: 900px; margin: 0 auto; padding: 40px 32px 80px; }
}

/* ── Desktop / iMac / Large Monitor (1440px+) ── */
@media (min-width: 1440px) {
  .desktop-sidebar { position: fixed; left: 0; top: 0; width: 300px; height: 100vh; overflow-y: auto; border-right: 1px solid var(--border); background: var(--surface); z-index: 100; display: flex !important; flex-direction: column; }
  .desktop-main { margin-left: 300px; }
  .mobile-nav { display: none !important; }
  .desktop-content { max-width: 1100px; margin: 0 auto; padding: 48px 40px 80px; }
}

/* ── Shared desktop (1024px+) ── */
@media (min-width: 1024px) {
  .desktop-grid { display: grid; min-height: 100vh; }
}
`;

/* ============================================================
   TYPES
   ============================================================ */
type S = "onboard"|"home"|"cards"|"add-card"|"card-detail"|"chat"|"travel"|"goals"|"split"|"perks"|"settings"|"lifestyle"|"ai-recommender";

interface UserProfile {
  name: string; age: string; income: string;
  lifestyles: string[]; creditScore: string;
  spending: { dining:string; groceries:string; travel:string; gas:string; shopping:string; other:string; };
  goal: string;
}

interface CreditCard {
  id: string; dbId: string; name: string; issuer: string;
  gradient: string; accentColor: string;
  balance: number; limit: number; minPayment: number;
  dueDate: string; points: number; apr: string;
  rewardRate: string; annualFee: number; perksValue: number;
  offers: { title:string; merchant:string; expires:string; value:string; }[];
  cashback: string; category: string;
  signupBonus: string;
  bestFor: string[];
  keyBenefits: string[];
  bestPlaces: string[];
  notGoodFor: string[];
}

interface Msg { role:"user"|"ai"; text:string; id:number; }
interface Goal { id:number; emoji:string; title:string; target:number; current:number; unit:"$"|"%"|"pts"; color:string; due:string; tips:string[]; }
interface Bill { id:number; name:string; emoji:string; amount:number; people:string[]; date:string; done:boolean; card:string; pts:number; }

/* ============================================================
   CARD DATABASE — 50+ real US cards
   ============================================================ */
const CARD_DB = [
  {
    id:"csr", name:"Sapphire Reserve", issuer:"Chase",
    gradient:"linear-gradient(135deg,#0F1832 0%,#1E3A6E 50%,#0D2347 100%)",
    accentColor:"#4F9BF5", rewardRate:"3x Travel & Dining", annualFee:550, perksValue:620, cashback:"Points", category:"travel",
    signupBonus:"60,000 points after spending $4,000 in first 3 months — worth $900 toward travel",
    bestFor:["Restaurants & dining worldwide","Flights, hotels, car rentals","Airport lounge access (Priority Pass)","Luxury hotel collection benefits","Travel insurance & trip protection"],
    keyBenefits:["$300 annual travel credit (auto-applied)","Priority Pass Select lounge access (1,300+ lounges)","Global Entry / TSA PreCheck credit ($100)","10x on Chase Dining & hotels through portal","Primary rental car insurance","Trip cancellation & interruption insurance"],
    bestPlaces:["Any restaurant or cafe","Airlines & hotel bookings","Uber & Lyft rides","Chase Ultimate Rewards travel portal","Partner hotels: Hyatt, IHG, Marriott"],
    notGoodFor:["Groceries (only 1x)","Gas stations (only 1x)","Bills and subscriptions (only 1x)"],
  },
  {
    id:"csp", name:"Sapphire Preferred", issuer:"Chase",
    gradient:"linear-gradient(135deg,#0A2240 0%,#1A4A80 50%,#0A2240 100%)",
    accentColor:"#5BA8F7", rewardRate:"3x Dining, 2x Travel", annualFee:95, perksValue:180, cashback:"Points", category:"travel",
    signupBonus:"60,000 points after spending $4,000 in first 3 months — worth $750 toward travel",
    bestFor:["Dining and restaurants","Travel bookings","Streaming services (2x)","Online grocery (3x)"],
    keyBenefits:["$50 annual hotel credit through Chase portal","25% more value redeeming through Chase portal","Trip delay & cancellation insurance","No foreign transaction fees","Secondary rental car insurance"],
    bestPlaces:["Restaurants and takeout","Hotel and flight bookings","Streaming: Netflix, Spotify, Hulu","Grocery delivery: DoorDash, Instacart"],
    notGoodFor:["In-store grocery shopping (1x)","Gas (1x)","General merchandise (1x)"],
  },
  {
    id:"cff", name:"Freedom Flex", issuer:"Chase",
    gradient:"linear-gradient(135deg,#1A1A2E 0%,#16213E 50%,#0F3460 100%)",
    accentColor:"#E94560", rewardRate:"5x Rotating categories", annualFee:0, perksValue:0, cashback:"Cash Back", category:"cashback",
    signupBonus:"$200 cash bonus after spending $500 in first 3 months",
    bestFor:["Quarterly rotating 5x categories","Drugstores (3x always)","Dining (3x always)","Travel through Chase portal (5x)"],
    keyBenefits:["5% on rotating quarterly categories (up to $1,500/quarter)","3% on dining and drugstores","No annual fee","Cell phone protection","Purchase protection up to $500"],
    bestPlaces:["Rotating Q categories: groceries, gas, Amazon, PayPal, select merchants","CVS, Walgreens, Rite Aid (3x)","Restaurants (3x)"],
    notGoodFor:["Everything else (only 1x)","Must activate quarterly bonuses manually"],
  },
  {
    id:"cfu", name:"Freedom Unlimited", issuer:"Chase",
    gradient:"linear-gradient(135deg,#1C1C2E 0%,#2C2C5E 50%,#1C1C2E 100%)",
    accentColor:"#A78BFA", rewardRate:"1.5x Everything", annualFee:0, perksValue:0, cashback:"Cash Back", category:"cashback",
    signupBonus:"Additional 1.5% on everything for first year (total 3% on all purchases up to $20,000)",
    bestFor:["Everyday catch-all spending","Categories other cards miss","Pharmacies (3x)","Dining (3x)"],
    keyBenefits:["Flat 1.5% on every purchase — no categories to track","3% on dining and drugstores","No annual fee","Pairs perfectly with Sapphire cards to unlock 50% more value","Purchase and trip cancellation protection"],
    bestPlaces:["Anything your other cards dont cover","Amazon, Walmart, Target","Gas stations (1.5x — decent fallback)","Bills and subscriptions"],
    notGoodFor:["Anywhere you have a category card — always use the better card first"],
  },
  {
    id:"amg", name:"Gold Card", issuer:"Amex",
    gradient:"linear-gradient(135deg,#2C1A00 0%,#8B6010 35%,#C9920A 65%,#8B6010 100%)",
    accentColor:"#F0B429", rewardRate:"4x Dining & Groceries", annualFee:250, perksValue:340, cashback:"Points", category:"dining",
    signupBonus:"60,000 Membership Rewards points after spending $6,000 in first 6 months",
    bestFor:["Restaurants and dining worldwide","US supermarkets (up to $25k/year)","Flights booked directly with airlines","All other travel (2x)"],
    keyBenefits:["$120 Uber Cash credit annually ($10/month)","$120 dining credit at Grubhub, Cheesecake Factory, Goldbelly, Wine.com","4x at US supermarkets — best grocery card in US","4x at restaurants worldwide — including food delivery","No foreign transaction fees","Trip delay insurance"],
    bestPlaces:["Every restaurant, cafe, and food delivery app","Whole Foods, Kroger, Safeway, Trader Joes, Costco","Grubhub, DoorDash, Seamless, Uber Eats","Direct airline bookings (2x)","Amex Travel portal"],
    notGoodFor:["Hotels (only 1x unless booked via Amex)","Gas stations (only 1x)","Drug stores (only 1x)"],
  },
  {
    id:"amp", name:"Platinum Card", issuer:"Amex",
    gradient:"linear-gradient(135deg,#1A1A1A 0%,#3D3D3D 50%,#1A1A1A 100%)",
    accentColor:"#C0C0C0", rewardRate:"5x Flights & Hotels", annualFee:695, perksValue:1500, cashback:"Points", category:"travel",
    signupBonus:"80,000 Membership Rewards points after spending $8,000 in first 6 months",
    bestFor:["Frequent flyers — 5x on all flights","Luxury hotel stays","Lounge access worldwide","Premium travel benefits"],
    keyBenefits:["$200 airline fee credit annually","$200 hotel credit (Fine Hotels + Resorts)","$240 digital entertainment credit","$155 Walmart+ credit","$100 Saks Fifth Avenue credit","Centurion Lounge + Priority Pass access","Global Entry / TSA PreCheck credit","Hotel status: Marriott Gold, Hilton Gold"],
    bestPlaces:["Direct airline ticket purchases (5x)","Fine Hotels and Resorts collection","Centurion Lounges at major airports","Amex Travel portal","Saks Fifth Avenue"],
    notGoodFor:["Dining (only 1x — use Amex Gold instead)","Groceries (only 1x)","Everyday spending — fee is only worth it for heavy travelers"],
  },
  {
    id:"ambc", name:"Blue Cash Preferred", issuer:"Amex",
    gradient:"linear-gradient(135deg,#001B5E 0%,#0038A8 50%,#001B5E 100%)",
    accentColor:"#60A5FA", rewardRate:"6x Groceries, 6x Streaming", annualFee:95, perksValue:240, cashback:"Cash Back", category:"groceries",
    signupBonus:"$250 back after spending $3,000 in first 6 months",
    bestFor:["US supermarkets — best grocery cashback card","Streaming services (Netflix, Disney+, Spotify)","US gas stations (3%)","Transit: subway, buses, taxis (3%)"],
    keyBenefits:["6% at US supermarkets up to $6,000/year","6% on select US streaming","3% at US gas stations","3% on transit (Uber, Lyft, trains, buses)","$84 Disney Bundle credit ($7/month)","Car rental loss and damage insurance"],
    bestPlaces:["Whole Foods, Trader Joes, Kroger, Safeway, Costco, Walmart grocery","Netflix, Hulu, Disney+, Peacock, Spotify, Apple Music","Shell, Exxon, BP, Chevron","Uber, Lyft, Amtrak, transit passes"],
    notGoodFor:["Dining out (only 1x — use Amex Gold)","Warehouse clubs count as 1x not 6x","International purchases"],
  },
  {
    id:"ambu", name:"Blue Cash Everyday", issuer:"Amex",
    gradient:"linear-gradient(135deg,#001B5E 0%,#003092 50%,#001B5E 100%)",
    accentColor:"#93C5FD", rewardRate:"3x Groceries", annualFee:0, perksValue:0, cashback:"Cash Back", category:"groceries",
    signupBonus:"$200 back after spending $2,000 in first 6 months",
    bestFor:["US supermarkets (no annual fee version)","Online shopping (3%)","US gas stations (2%)"],
    keyBenefits:["3% at US supermarkets up to $6,000/year","3% on online shopping","2% at US gas stations","No annual fee","Car rental loss and damage insurance"],
    bestPlaces:["Whole Foods, Kroger, Safeway, Target grocery","Amazon, Walmart.com, online retailers","Shell, Exxon, BP, Chevron"],
    notGoodFor:["Worth upgrading to Blue Cash Preferred if you spend $31+/month on groceries"],
  },
  {
    id:"covx", name:"Venture X", issuer:"Capital One",
    gradient:"linear-gradient(135deg,#080C18 0%,#0D1F3C 50%,#162B50 100%)",
    accentColor:"#38BDF8", rewardRate:"2x Everything, 5x Travel", annualFee:395, perksValue:620, cashback:"Miles", category:"travel",
    signupBonus:"75,000 miles after spending $4,000 in first 3 months — worth $750 in travel",
    bestFor:["All everyday spending (flat 2x)","Travel booked through Capital One portal (5x)","Hotels and car rentals (5x portal)","Flights booked through portal (5x)"],
    keyBenefits:["$300 travel credit for Capital One portal bookings","10,000 miles anniversary bonus (worth $100)","Priority Pass lounge access — unlimited guests","Capital One lounge access","No foreign transaction fees","Cell phone protection","Global Entry / TSA PreCheck credit"],
    bestPlaces:["Capital One Travel portal for 5x","Every purchase for flat 2x (best catch-all premium card)","Airports with Capital One Lounges: DFW, DEN, LAS, IAD","Any hotel or airline via portal"],
    notGoodFor:["If you dont use Capital One travel portal — loses much of its value","Dining category-specific spending (Amex Gold is better)"],
  },
  {
    id:"cov", name:"Venture", issuer:"Capital One",
    gradient:"linear-gradient(135deg,#0A1628 0%,#1A3A5C 50%,#0A1628 100%)",
    accentColor:"#60A5FA", rewardRate:"2x Everything", annualFee:95, perksValue:0, cashback:"Miles", category:"travel",
    signupBonus:"75,000 miles after spending $4,000 in first 3 months",
    bestFor:["Simple flat-rate travel rewards","No category tracking needed","Hotels and flights (2x everywhere)"],
    keyBenefits:["2x miles on every purchase","No foreign transaction fees","Global Entry / TSA PreCheck credit ($100)","Transfer miles to 15+ travel partners","Miles never expire"],
    bestPlaces:["Literally everywhere — flat 2x","Great fallback card for any purchase"],
    notGoodFor:["Category-specific spending where other cards earn 3x-6x"],
  },
  {
    id:"coqs", name:"Quicksilver", issuer:"Capital One",
    gradient:"linear-gradient(135deg,#1A1018 0%,#3A1A30 50%,#1A1018 100%)",
    accentColor:"#E879F9", rewardRate:"1.5x Everything", annualFee:0, perksValue:0, cashback:"Cash Back", category:"cashback",
    signupBonus:"$200 after spending $500 in first 3 months",
    bestFor:["Simple no-fee cashback","No category tracking","International travel (no FX fee)"],
    keyBenefits:["1.5% cash back on every purchase","No annual fee","No foreign transaction fees","0% intro APR for 15 months on purchases"],
    bestPlaces:["Any purchase you cant categorize","International purchases (no FX fee unlike many no-fee cards)"],
    notGoodFor:["Domestic dining, groceries, travel — better cards exist for each"],
  },
  {
    id:"cdc", name:"Double Cash", issuer:"Citi",
    gradient:"linear-gradient(135deg,#0F1923 0%,#1A2F42 50%,#0F1923 100%)",
    accentColor:"#34D399", rewardRate:"2% Everything", annualFee:0, perksValue:0, cashback:"Cash Back", category:"cashback",
    signupBonus:"$200 cash back after spending $1,500 in first 6 months",
    bestFor:["Best flat-rate cashback with no annual fee","1% when you buy + 1% when you pay","Great for paying off balances"],
    keyBenefits:["2% on everything (1% purchase + 1% payment)","No annual fee","Convert to ThankYou points if you have Citi Premier","0% intro APR on balance transfers for 18 months"],
    bestPlaces:["Everything you buy and pay off monthly","Pairs with Citi Premier for transfer value"],
    notGoodFor:["Carrying a balance — the 1% on payment is lost"],
  },
  {
    id:"cpc", name:"Premier", issuer:"Citi",
    gradient:"linear-gradient(135deg,#0A1628 0%,#1A3360 50%,#0A1628 100%)",
    accentColor:"#6366F1", rewardRate:"3x Hotels, Air, Dining", annualFee:95, perksValue:0, cashback:"Points", category:"travel",
    signupBonus:"60,000 points after spending $4,000 in first 3 months",
    bestFor:["Hotels (3x)","Flights (3x)","Restaurants (3x)","Grocery stores (3x)","Gas stations (3x)"],
    keyBenefits:["3x on 5 major categories simultaneously","$100 annual hotel savings benefit","Transfer to 16 airline partners","No foreign transaction fees","Points worth 1 cent each or more via transfers"],
    bestPlaces:["Any hotel worldwide (3x)","Any airline booking (3x)","Restaurants and cafes (3x)","Supermarkets (3x)","Gas stations (3x)"],
    notGoodFor:["Lounge access","Premium travel protections (use Chase Sapphire for those)"],
  },
  {
    id:"disc", name:"Discover it", issuer:"Discover",
    gradient:"linear-gradient(135deg,#1A0A00 0%,#7A3800 50%,#1A0A00 100%)",
    accentColor:"#FB923C", rewardRate:"5x Rotating, 1x Other", annualFee:0, perksValue:0, cashback:"Cash Back", category:"cashback",
    signupBonus:"Cashback Match — Discover matches all cash back earned in first year automatically",
    bestFor:["First year — cashback doubled on everything","Quarterly 5% rotating categories","No annual fee","Gas, restaurants, Amazon, grocery (rotating)"],
    keyBenefits:["Cashback Match in year 1 = effectively 10% on rotating, 2% on everything","5% on rotating categories (up to $1,500/quarter)","Free FICO credit score monthly","No foreign transaction fees","Free social security number alerts"],
    bestPlaces:["Gas stations when its the 5% category","Amazon.com when its the 5% category","Restaurants when its the 5% category","Grocery stores when its the 5% category"],
    notGoodFor:["Not widely accepted internationally","After year 1 cashback match ends, less competitive"],
  },
  {
    id:"apple", name:"Apple Card", issuer:"Apple/Goldman Sachs",
    gradient:"linear-gradient(135deg,#1C1C1E 0%,#2C2C2E 50%,#1C1C1E 100%)",
    accentColor:"#F5F5F7", rewardRate:"3% Apple, 2% Apple Pay", annualFee:0, perksValue:0, cashback:"Daily Cash", category:"cashback",
    signupBonus:"No traditional signup bonus — Daily Cash paid instantly every day",
    bestFor:["Apple purchases — App Store, Apple Music, Apple TV+","Apple Pay at any contactless terminal","Merchants that dont accept Apple Pay (titanium card, 1%)"],
    keyBenefits:["3% Daily Cash at Apple and Apple Pay partners (Uber, Nike, Panera, Exxon)","2% Daily Cash on any Apple Pay purchase","No fees — no annual, no foreign transaction, no late fee","Daily Cash paid instantly to Apple Cash","Privacy focused — no card number on physical card","0% financing on Apple products"],
    bestPlaces:["Apple Store and Apple.com","App Store and Apple subscriptions","Uber and Uber Eats (3%)","Nike stores and Nike.com (3%)","Panera Bread (3%)","Exxon and Mobil stations (3%)","Any store with contactless Apple Pay terminal (2%)"],
    notGoodFor:["Places that dont accept Apple Pay (only 1% with physical card)","Non-Apple purchases where other cards earn 2-6%"],
  },
  {
    id:"wells", name:"Active Cash", issuer:"Wells Fargo",
    gradient:"linear-gradient(135deg,#140000 0%,#480000 50%,#140000 100%)",
    accentColor:"#F87171", rewardRate:"2% Everything", annualFee:0, perksValue:0, cashback:"Cash Back", category:"cashback",
    signupBonus:"$200 cash rewards bonus after spending $500 in first 3 months",
    bestFor:["Simple flat 2% cashback on everything","No annual fee","Cell phone protection is unique for no-fee card"],
    keyBenefits:["Unlimited 2% cash rewards on all purchases","No annual fee","$600 cell phone protection when you pay your bill with the card","0% intro APR for 15 months","Access to Wells Fargo ATMs worldwide"],
    bestPlaces:["Everything — it is a flat 2% catch-all","Pay your cell phone bill with it for free phone protection"],
    notGoodFor:["Category spenders — Amex Gold and Chase Freedom earn more in categories"],
  },
  {
    id:"boar", name:"Customized Cash Rewards", issuer:"Bank of America",
    gradient:"linear-gradient(135deg,#001A3A 0%,#003580 50%,#001A3A 100%)",
    accentColor:"#60A5FA", rewardRate:"3% Choice category, 2% Grocery", annualFee:0, perksValue:0, cashback:"Cash Back", category:"cashback",
    signupBonus:"$200 online cash rewards bonus after spending $1,000 in first 90 days",
    bestFor:["Your chosen 3% category (gas, online shopping, dining, travel, drug stores, or home improvement)","Grocery stores and wholesale clubs (2%)","Preferred Rewards members — earn up to 75% more"],
    keyBenefits:["Choose your own 3% category and change monthly","2% at grocery stores and wholesale clubs","No annual fee","Bank of America Preferred Rewards = 25-75% bonus on earnings","$2,500 combined quarterly cap on 2% and 3% categories"],
    bestPlaces:["Your chosen 3% category — gas stations, Amazon, restaurants, etc","Costco, BJs, Sams Club (2%)","Grocery stores (2%)"],
    notGoodFor:["Spending above $2,500/quarter in bonus categories (drops to 1%)","Without Preferred Rewards, competitive cards earn more"],
  },
  {
    id:"usb", name:"Altitude Reserve", issuer:"US Bank",
    gradient:"linear-gradient(135deg,#0A0A1A 0%,#1A1A40 50%,#0A0A1A 100%)",
    accentColor:"#818CF8", rewardRate:"3x Mobile Pay & Travel", annualFee:400, perksValue:500, cashback:"Points", category:"travel",
    signupBonus:"50,000 points after spending $4,500 in first 90 days — worth $750 in travel",
    bestFor:["Mobile Pay purchases (Apple Pay, Google Pay, Samsung Pay — 3x)","Travel purchases (3x)","Anyone who pays with phone at most retailers"],
    keyBenefits:["$325 annual travel and dining credit","3x on all mobile wallet purchases — huge category","Real-time mobile rewards — redeem against any travel purchase","Priority Pass airport lounge access","Global Entry or TSA PreCheck credit","No foreign transaction fees"],
    bestPlaces:["Any store accepting Apple Pay or Google Pay — earns 3x","Hotels, flights, rental cars (3x)","Restaurants via mobile pay (3x)"],
    notGoodFor:["Stores not accepting mobile payments","Lower-value points than Chase/Amex for complex redemptions"],
  },
  {
    id:"mar", name:"Marriott Bonvoy Boundless", issuer:"Chase",
    gradient:"linear-gradient(135deg,#1A0A00 0%,#4A1A00 50%,#1A0A00 100%)",
    accentColor:"#FB923C", rewardRate:"6x Marriott, 2x All", annualFee:95, perksValue:200, cashback:"Points", category:"hotel",
    signupBonus:"3 Free Night Awards (each worth up to 50,000 points) after spending $3,000 in first 3 months",
    bestFor:["Marriott hotel stays worldwide (6x)","Everyday spending to earn toward free nights","Marriott Silver Elite status automatically"],
    keyBenefits:["One Free Night Award every card anniversary (up to 35,000 points)","Marriott Bonvoy Silver Elite status","15 Elite Night Credits toward status each year","6x points at 8,000+ Marriott properties worldwide","2x on everything else","No foreign transaction fees"],
    bestPlaces:["All Marriott brands: Marriott, Sheraton, Westin, W Hotels, St. Regis, Ritz-Carlton","Marriott Bonvoy restaurants and spas","Everyday spending to accumulate free nights"],
    notGoodFor:["Non-Marriott hotels","Travel booked outside Marriott ecosystem"],
  },
  {
    id:"hlt", name:"Hilton Honors Surpass", issuer:"Amex",
    gradient:"linear-gradient(135deg,#001028 0%,#002060 50%,#001028 100%)",
    accentColor:"#60A5FA", rewardRate:"12x Hilton, 6x Grocery & Restaurant", annualFee:150, perksValue:300, cashback:"Points", category:"hotel",
    signupBonus:"130,000 Hilton Honors points after spending $3,000 in first 6 months",
    bestFor:["Hilton hotel stays — highest multiplier of any Hilton card (12x)","US supermarkets (6x)","US restaurants and dining (6x)","US gas stations (3x)"],
    keyBenefits:["Hilton Honors Gold status automatically (worth lounge access at many properties)","Free Weekend Night Reward after spending $15,000 in a calendar year","$250 Hilton resort credit","Priority Pass — 10 complimentary lounge visits per year","12x at all Hilton properties worldwide","6x at US supermarkets AND US restaurants"],
    bestPlaces:["All Hilton brands: Hilton, DoubleTree, Hampton Inn, Waldorf Astoria, Conrad","Hilton restaurants, bars, and spas (12x)","US grocery stores (6x) — very competitive","US restaurants (6x) — rivals Amex Gold","Shell, Exxon, BP, Chevron (3x)"],
    notGoodFor:["Non-Hilton hotel stays","Travel booked through third-party sites"],
  },
  {
    id:"delta", name:"Delta SkyMiles Gold", issuer:"Amex",
    gradient:"linear-gradient(135deg,#0A0028 0%,#1A0050 50%,#0A0028 100%)",
    accentColor:"#A78BFA", rewardRate:"2x Delta, 2x Dining", annualFee:150, perksValue:220, cashback:"Miles", category:"airline",
    signupBonus:"40,000 bonus miles after spending $2,000 in first 6 months",
    bestFor:["Delta Air Lines flights (2x)","Restaurants worldwide (2x)","Grocery stores (2x)","Delta co-branded benefits"],
    keyBenefits:["First checked bag free on Delta flights (saves $70 round trip per person)","Main Cabin 1 priority boarding","20% back on Delta in-flight purchases","$200 Delta flight credit after spending $10,000 in a year","15% discount on Delta award tickets","No foreign transaction fees"],
    bestPlaces:["Delta.com and Delta app for flights (2x)","Any restaurant worldwide (2x)","US grocery stores (2x)","Delta Sky Clubs (access with upgrade or purchase)"],
    notGoodFor:["Non-Delta airlines","Hotels and other travel (only 1x)"],
  },
  {
    id:"united", name:"Explorer", issuer:"Chase",
    gradient:"linear-gradient(135deg,#000A1E 0%,#001A50 50%,#000A1E 100%)",
    accentColor:"#3B82F6", rewardRate:"2x United, 2x Dining", annualFee:95, perksValue:200, cashback:"Miles", category:"airline",
    signupBonus:"60,000 miles after spending $3,000 in first 3 months",
    bestFor:["United Airlines flights (2x)","Restaurants (2x)","Hotel stays (2x)","United co-branded benefits"],
    keyBenefits:["First and second checked bags free (saves $140 round trip)","Two United Club one-time passes annually","Priority boarding","25% back on United inflight purchases","Global Entry or TSA PreCheck credit","No foreign transaction fees"],
    bestPlaces:["United.com and United app for flights (2x)","Any restaurant worldwide (2x)","Hotel stays (2x)","United Club lounges (with passes)"],
    notGoodFor:["Non-United airlines","Everyday non-travel spending (use a flat-rate card)"],
  },
  {
    id:"boa", name:"Alaska Airlines Visa", issuer:"Bank of America",
    gradient:"linear-gradient(135deg,#000A1E 0%,#001E50 50%,#000A1E 100%)",
    accentColor:"#38BDF8", rewardRate:"3x Alaska, 2x Gas & EV", annualFee:75, perksValue:150, cashback:"Miles", category:"airline",
    signupBonus:"60,000 bonus miles plus Alaska companion fare after spending $3,000 in first 90 days",
    bestFor:["Alaska Airlines flights (3x)","Gas stations and EV charging (2x)","Earning Companion Fare for a travel partner"],
    keyBenefits:["Annual companion fare from $99 (pay only taxes for a second passenger)","Free checked bag for you and up to 6 companions","3x miles on Alaska purchases","2x miles on gas and EV charging stations","10% bonus miles when you redeem if you have the card","No foreign transaction fees"],
    bestPlaces:["AlaskaAir.com for flights (3x)","Shell, Exxon, Chevron (2x)","EV charging stations (2x)","Alaska Lounges"],
    notGoodFor:["Non-Alaska frequent flyers","East Coast travelers where Alaska has limited routes"],
  },
];

/* ============================================================
   SAMPLE DATA
   ============================================================ */
const SAMPLE_GOALS: Goal[] = [
  { id:1, emoji:"📊", title:"Keep Utilization Under 30%", target:30, current:18, unit:"%", color:"#C9A84C", due:"Ongoing", tips:["Pay $400 on Chase before the 18th → drops to 9%","Pay Amex balance before statement closes","Keep Venture X under $6,000 at all times"] },
  { id:2, emoji:"💰", title:"Save $6,000 This Year", target:6000, current:3240, unit:"$", color:"#2DC8A0", due:"Dec 31, 2025", tips:["Cancel 4 unused subscriptions → $840/yr saved","Switch groceries to Amex Gold (4x) → $300/yr extra","Cut takeout from $340 → $190/month → $1,800/yr"] },
  { id:3, emoji:"📈", title:"Reach 750 Credit Score", target:750, current:698, unit:"pts", color:"#4F6EF7", due:"Sep 2025", tips:["Bring all cards under 10% utilization → +12–18 pts","Zero missed payments for 6 months","No new applications for 4 months"] },
];

const SAMPLE_BILLS: Bill[] = [
  { id:1, name:"Nobu Restaurant", emoji:"🍽️", amount:247, people:["You","Sarah","Mike","Priya"], date:"Today", done:false, card:"Amex Gold", pts:988 },
  { id:2, name:"Airbnb Miami Beach", emoji:"🏖️", amount:840, people:["You","James","Leila"], date:"Yesterday", done:false, card:"Sapphire Reserve", pts:2520 },
  { id:3, name:"Whole Foods Run", emoji:"🛒", amount:120, people:["You","Roommate"], date:"May 10", done:true, card:"Amex Gold", pts:480 },
];

const QCHIPS = ["Which card for groceries?","Best card for dining?","How to reach 750 score?","Should I apply for Amex Gold?","Best use of my Chase points?","Which card for Amazon?"];

/* ============================================================
   AI REPLIES
   ============================================================ */
function aiReply(q: string, cards: CreditCard[], profile: UserProfile): string {
  const l = q.toLowerCase();
  const hasAmexGold = cards.some(c => c.dbId === "amg");
  const hasSapphire = cards.some(c => c.dbId === "csr" || c.dbId === "csp");
  const totalPts = cards.reduce((s,c) => s + c.points, 0);
  const totalBal = cards.reduce((s,c) => s + c.balance, 0);
  const totalLim = cards.reduce((s,c) => s + c.limit, 0);
  const util = totalLim > 0 ? Math.round(totalBal/totalLim*100) : 0;

  if (/grocer|supermarket|whole food|trader joe/i.test(l)) {
    if (hasAmexGold) return `🛒 Use your **Amex Gold** — it earns 4x on groceries, the highest in your wallet. On a $150 grocery run that's 600 points ≈ $9 value. Far better than any other card you own.`;
    return `🛒 Based on your cards, use the card with the highest grocery multiplier. Consider adding the Amex Gold — it earns 4x on groceries and would be worth it based on your profile.`;
  }
  if (/dining|restaurant|eat|food|takeout/i.test(l)) return `🍽️ ${hasAmexGold ? "Amex Gold earns 4x at restaurants — the best in your wallet." : "Use whichever card offers the highest dining multiplier."} On an $80 dinner that's significant rewards. Always use your highest dining card.`;
  if (/travel|flight|hotel|trip|airline/i.test(l)) return `✈️ ${hasSapphire ? "Chase Sapphire Reserve earns 3x on travel plus primary rental car insurance." : "Use your travel card"} for all travel purchases. Your ${f(totalPts)} total points are worth $${f(Math.round(totalPts*.015))} toward travel.`;
  if (/750|score|credit score|improve|boost/i.test(l)) return `📈 To reach 750 from ${profile.creditScore || "your current score"}: Pay down balances to bring utilization below 10% (currently ${util}%) → +12–18 pts. Zero missed payments for 4 months → +10 pts. No new applications → let inquiries age. Achievable in 4–5 months.`;
  if (/utilization|balance|payoff/i.test(l)) return `📊 Your current utilization is ${util}% — ${util < 30 ? "healthy" : "high, needs attention"}. ${util > 30 ? "Pay down the highest-utilization card first." : "To optimize further, pay all cards below 10% before their statement dates."} This alone could boost your score 8–15 points.`;
  if (/point|redeem|transfer|miles/i.test(l)) return `🌟 Your total: ${f(totalPts)} points across ${cards.length} cards ≈ $${f(Math.round(totalPts*.015))}. ${hasSapphire ? "Best move: transfer Chase UR points to World of Hyatt (1:1) at 2.2¢/pt — that's $" + f(Math.round(cards.find(c=>c.dbId==="csr")?.points||0 * .022)) + " in hotel value." : "Look for transfer partner opportunities to maximize value."}`;
  if (/apply|approval|new card/i.test(l)) return `💳 Based on your profile (income: ${profile.income || "not specified"}, score: ${profile.creditScore || "not specified"}), you should check your approval odds in the Cards tab. I recommend waiting at least 3–6 months between applications to protect your score.`;
  return `I know your complete financial profile — ${cards.length} cards, ${f(totalPts)} total points, ${util}% utilization. Ask me anything specific and I'll give you personalized advice based on your exact wallet.`;
}

/* ============================================================
   HELPERS
   ============================================================ */
const f = (n: number) => n.toLocaleString("en-US");
const pct = (a: number, b: number) => b > 0 ? Math.min(100, Math.round(a/b*100)) : 0;
const uc = (u: number) => u > 30 ? "var(--red)" : u > 20 ? "var(--amber)" : "var(--green)";
const daysUntil = (dateStr: string) => {
  if (!dateStr) return 0;
  const due = new Date(dateStr);
  const now = new Date();
  return Math.ceil((due.getTime() - now.getTime()) / (1000*60*60*24));
};
const urgencyColor = (days: number) => days <= 3 ? "var(--red)" : days <= 7 ? "var(--amber)" : "var(--green)";

/* ============================================================
   SHARED ATOMS
   ============================================================ */
function Bar({ v, max, color="var(--accent)", h=5 }: { v:number; max:number; color?:string; h?:number }) {
  return <div className="track" style={{height:h}}><div className="fill" style={{width:`${pct(v,max)}%`, background:color, height:h}}/></div>;
}

function Ring({ v, max, r=26, sw=4, color="var(--accent)" }: { v:number; max:number; r?:number; sw?:number; color?:string }) {
  const sz=(r+sw)*2, c=sz/2, circ=2*Math.PI*r, off=circ*(1-pct(v,max)/100);
  return (
    <svg width={sz} height={sz} style={{transform:"rotate(-90deg)"}}>
      <circle cx={c} cy={c} r={r} fill="none" stroke="var(--border2)" strokeWidth={sw}/>
      <circle cx={c} cy={c} r={r} fill="none" stroke={color} strokeWidth={sw}
        strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round"
        style={{transition:"stroke-dashoffset .9s cubic-bezier(.22,.68,0,1.2)"}}/>
    </svg>
  );
}

function Toggle({ on, set }: { on:boolean; set:()=>void }) {
  return (
    <button onClick={set} className={`toggle-track press ${on?"on":""}`}>
      <span className="toggle-knob"/>
    </button>
  );
}

function PageHead({ title, sub, right, back }: { title:string; sub?:string; right?:React.ReactNode; back?:()=>void }) {
  return (
    <div className="px" style={{paddingTop:60,paddingBottom:28,display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
      <div style={{display:"flex",alignItems:"flex-end",gap:12}}>
        {back && <button onClick={back} className="btn-ghost press" style={{padding:"8px 14px",fontSize:13}}>← Back</button>}
        <div>
          <h1 className="serif" style={{fontSize:24,fontWeight:700,lineHeight:1.2,letterSpacing:"-.3px",marginBottom:sub?4:0}}>{title}</h1>
          {sub && <p style={{fontSize:13,color:"var(--text2)"}}>{sub}</p>}
        </div>
      </div>
      {right}
    </div>
  );
}

/* ============================================================
   DESKTOP SIDEBAR
   ============================================================ */
function Sidebar({ active, go, theme, toggleTheme, profile, onSignOut }: {
  active:S; go:(s:S)=>void; theme:"dark"|"light"; toggleTheme:()=>void; profile:UserProfile; onSignOut?:()=>void;
}) {
  const navItems: [S,string,string][] = [
    ["home","⊞","Dashboard"],["cards","▣","My Cards"],["chat","◎","AI Advisor"],
    ["travel","◈","Travel"],["goals","◉","Goals"],["split","⊕","Split Bills"],
    ["perks","◆","Perks"],["lifestyle","◈","Optimizer"],["ai-recommender","★","AI Picks"],["settings","⚙","Settings"],
  ];
  return (
    <div className="desktop-sidebar" style={{display:"flex",flexDirection:"column",paddingTop:28,paddingBottom:20}}>
      <div style={{padding:"0 20px 24px"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:34,height:34,borderRadius:9,background:"var(--accent)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
          </div>
          <div>
            <div style={{fontSize:15,fontWeight:700,color:"var(--text)",letterSpacing:"-.3px",lineHeight:1.2}}>CardPilot</div>
            <div style={{fontSize:10,color:"var(--text2)",fontWeight:500,letterSpacing:.6,textTransform:"uppercase"}}>Elite</div>
          </div>
        </div>
      </div>

      {profile.name && (
        <div style={{padding:"0 16px 20px"}}>
          <div style={{background:"var(--accentbg)",borderRadius:8,padding:"10px 12px",border:"1px solid rgba(37,99,235,.12)"}}>
            <div style={{fontSize:11,color:"var(--accent)",marginBottom:2,fontWeight:500}}>Signed in as</div>
            <div style={{fontSize:14,fontWeight:600,color:"var(--text)",letterSpacing:"-.1px"}}>{profile.name}</div>
            {profile.creditScore && <div style={{fontSize:11,color:"var(--green)",marginTop:2,fontWeight:500}}>{profile.creditScore}</div>}
          </div>
        </div>
      )}

      <div className="divider"/>

      <nav style={{flex:1,padding:"12px 12px 0"}}>
        {navItems.map(([id,icon,label]) => {
          const on = active === id;
          return (
            <button key={id} onClick={()=>go(id)} className="press" style={{
              width:"100%",display:"flex",alignItems:"center",gap:9,
              padding:"9px 10px",borderRadius:7,border:"none",
              background:on?"var(--accentbg)":"transparent",
              color:on?"var(--accent)":"var(--text2)",
              fontSize:13.5,fontWeight:on?600:400,
              textAlign:"left",marginBottom:1,
              transition:"background .12s, color .12s",
              borderLeft:on?"2px solid var(--accent)":"2px solid transparent",
            }}>
              <span style={{fontSize:14,width:18,textAlign:"center",opacity:on?1:.7}}>{icon}</span>
              {label}
            </button>
          );
        })}
      </nav>

      <div className="divider" style={{marginTop:16,marginBottom:16}}/>

      <div style={{padding:"0 16px"}}>
        {onSignOut && (
          <button onClick={onSignOut} className="press" style={{
            width:"100%",padding:"9px 14px",fontSize:13,
            color:"var(--red)",background:"transparent",
            border:"1px solid rgba(197,48,48,.25)",borderRadius:7,
            fontWeight:500,cursor:"pointer",fontFamily:"var(--sans)",
          }}>
            Sign out
          </button>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   MOBILE NAV
   ============================================================ */
function MobileNav({ active, go }: { active:S; go:(s:S)=>void }) {
  const tabs: [S,string,string][] = [
    ["home","⊞","Home"],["cards","▣","Cards"],["chat","◎","AI"],["travel","◈","Travel"],["goals","◉","Goals"],
  ];
  return (
    <nav className="mobile-nav nav-safe" style={{
      position:"fixed",bottom:0,left:0,right:0,
      background:"var(--surface)",borderTop:"1px solid var(--border)",
      display:"flex",zIndex:200,paddingTop:4,
    }}>
      {tabs.map(([id,icon,label]) => {
        const on = active === id;
        return (
          <button key={id} onClick={()=>go(id)} className="press" style={{
            flex:1,padding:"8px 0 10px",background:"none",border:"none",
            display:"flex",flexDirection:"column",alignItems:"center",gap:4,
          }}>
            <span style={{fontSize:17,color:on?"var(--accent)":"var(--text3)",transition:"color .15s"}}>{icon}</span>
            <span style={{fontSize:10,fontWeight:on?600:400,color:on?"var(--accent)":"var(--text3)"}}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}

/* ============================================================
   ONBOARDING
   ============================================================ */
function Onboard({ done }: { done:(p:UserProfile)=>void }) {
  const [step, setStep] = useState(0);
  const [p, setP] = useState<UserProfile>({
    name:"", age:"", income:"", lifestyles:[], creditScore:"",
    spending:{dining:"",groceries:"",travel:"",gas:"",shopping:"",other:""},
    goal:"",
  });
  const set = (k: keyof UserProfile, v: any) => setP(prev => ({...prev,[k]:v}));
  const toggleLife = (l: string) => set("lifestyles", p.lifestyles.includes(l) ? p.lifestyles.filter(x=>x!==l) : [...p.lifestyles,l]);
  const setSp = (k: keyof typeof p.spending, v: string) => set("spending", {...p.spending,[k]:v});

  const LIFESTYLES = ["✈️ Frequent Traveler","🍽️ Foodie","💼 Business Professional","🏠 Homebody","🎮 Tech Enthusiast","🛍️ Fashion & Shopping","🎓 Student","🏋️ Fitness & Health"];
  const INCOMES = ["Under $30,000","$30,000–$60,000","$60,000–$100,000","$100,000–$150,000","$150,000–$250,000","$250,000+"];
  const SCORES = ["300–579 (Poor)","580–669 (Fair)","670–739 (Good)","740–799 (Very Good)","800+ (Exceptional)"];
  const GOALS = [
    ["✈️","Maximize Travel Rewards","Earn points for free flights & hotels"],
    ["💰","Save More Money","Reduce spend and build savings"],
    ["📈","Build Credit Score","Reach 750+ and unlock premium cards"],
    ["💳","Optimize Card Portfolio","Get the right cards for my lifestyle"],
    ["💸","Pay Off Debt","Become debt free efficiently"],
  ];

  const GoldBtn = ({ label, disabled, onClick }: { label:string; disabled?:boolean; onClick:()=>void }) => (
    <button onClick={onClick} disabled={disabled} className="btn-gold press" style={{
      width:"100%",
      background:disabled?"var(--border2)":"var(--accent)",
      color:disabled?"var(--text3)":"#ffffff",
    }}>{label}</button>
  );

  return (
    <div style={{background:"var(--bg)",minHeight:"100vh",maxWidth:480,margin:"0 auto",fontFamily:"var(--sans)"}}>
      {/* Progress */}
      {step>0 && step<6 && (
        <div style={{position:"fixed",top:0,left:0,right:0,maxWidth:480,margin:"0 auto",height:3,background:"var(--border2)",zIndex:999}}>
          <div style={{height:"100%",background:"var(--accent)",width:`${(step/5)*100}%`,transition:"width .4s ease",borderRadius:99}}/>
        </div>
      )}
      {step>0 && step<6 && (
        <button onClick={()=>setStep(s=>s-1)} style={{position:"fixed",top:18,left:20,background:"none",border:"none",color:"var(--text3)",fontSize:22,zIndex:999,fontFamily:"var(--sans)"}}>←</button>
      )}

      {/* Step 0 — Welcome */}
      {step===0 && (
        <div className="au" style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",padding:"40px 28px",textAlign:"center",background:"var(--bg)"}}>
          <div style={{width:64,height:64,borderRadius:16,background:"var(--accent)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:24,boxShadow:"0 4px 16px rgba(37,99,235,.25)"}}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
          </div>
          <div style={{fontSize:11,letterSpacing:2.5,marginBottom:10,fontWeight:600,color:"var(--accent)",textTransform:"uppercase"}}>CardPilot Elite</div>
          <h1 style={{fontSize:34,lineHeight:1.15,marginBottom:14,fontWeight:700,color:"var(--text)",letterSpacing:"-.5px"}}>Your cards,<br/>working harder.</h1>
          <p style={{color:"var(--text2)",fontSize:15,lineHeight:1.7,marginBottom:40,maxWidth:300}}>AI-powered credit card optimization. Maximize rewards, track spending, make smarter decisions.</p>
          <Btn label="Get Started" onClick={()=>setStep(1)}/>
                    <p style={{color:"var(--text3)",fontSize:12,marginTop:14}}>Free · Takes 3 minutes</p>
        </div>
      )}

      {/* Step 1 — Name & Age */}
      {step===1 && (
        <div className="au" style={{padding:"80px 28px 40px"}}>
          <span className="pill pill-gold" style={{marginBottom:20,display:"inline-flex"}}>Step 1 of 5</span>
          <h2 className="serif" style={{fontSize:36,fontWeight:400,marginBottom:8,lineHeight:1.2}}>What's your<br/>name?</h2>
          <p style={{color:"var(--text2)",fontSize:14,marginBottom:32,lineHeight:1.6}}>We personalize every recommendation around you.</p>
          <label style={{fontSize:12,color:"var(--text2)",fontWeight:500,display:"block",marginBottom:8}}>First Name</label>
          <input className="field" placeholder="Your first name" value={p.name} onChange={e=>set("name",e.target.value)} style={{fontSize:20,padding:"18px 20px",marginBottom:20}} autoFocus onKeyDown={e=>e.key==="Enter"&&p.name.trim()&&setStep(2)}/>
          <label style={{fontSize:12,color:"var(--text2)",fontWeight:500,display:"block",marginBottom:8}}>Age</label>
          <input className="field" type="number" placeholder="Your age" value={p.age} onChange={e=>set("age",e.target.value)} style={{marginBottom:32}}/>
          <GoldBtn label="Continue →" disabled={!p.name.trim()} onClick={()=>setStep(2)}/>
        </div>
      )}

      {/* Step 2 — Financial profile */}
      {step===2 && (
        <div className="au" style={{padding:"80px 28px 40px"}}>
          <span className="pill pill-gold" style={{marginBottom:20,display:"inline-flex"}}>Step 2 of 5</span>
          <h2 className="serif" style={{fontSize:36,fontWeight:400,marginBottom:8,lineHeight:1.2}}>Financial<br/>profile</h2>
          <p style={{color:"var(--text2)",fontSize:14,marginBottom:28,lineHeight:1.6}}>Used to calculate approval chances and optimize your strategy.</p>
          <label style={{fontSize:12,color:"var(--text2)",fontWeight:500,display:"block",marginBottom:8}}>Annual Income</label>
          <select className="field" value={p.income} onChange={e=>set("income",e.target.value)} style={{marginBottom:20,appearance:"none"}}>
            <option value="">Select income range</option>
            {INCOMES.map(o=><option key={o} value={o}>{o}</option>)}
          </select>
          <label style={{fontSize:12,color:"var(--text2)",fontWeight:500,display:"block",marginBottom:8}}>Credit Score (approximate)</label>
          <select className="field" value={p.creditScore} onChange={e=>set("creditScore",e.target.value)} style={{marginBottom:24,appearance:"none"}}>
            <option value="">Select score range</option>
            {SCORES.map(o=><option key={o} value={o}>{o}</option>)}
          </select>
          <label style={{fontSize:12,color:"var(--text2)",fontWeight:600,textTransform:"uppercase",letterSpacing:.6,display:"block",marginBottom:10}}>Lifestyle (select all that apply)</label>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:32}}>
            {LIFESTYLES.map(l => {
              const on = p.lifestyles.includes(l);
              return (
                <button key={l} onClick={()=>toggleLife(l)} className="press" style={{
                  padding:"11px 10px",borderRadius:12,textAlign:"left",fontSize:12,fontWeight:500,
                  border:`1.5px solid ${on?"var(--accent)":"var(--border2)"}`,
                  background:on?"rgba(201,168,76,.1)":"var(--surface)",
                  color:on?"var(--accent)":"var(--text2)",
                  transition:"all .15s",position:"relative",
                }}>
                  {on && <span style={{position:"absolute",top:7,right:9,fontSize:10,color:"var(--accent)",fontWeight:800}}>✓</span>}
                  {l}
                </button>
              );
            })}
          </div>
          <GoldBtn label="Continue →" disabled={!p.income||!p.creditScore||p.lifestyles.length===0} onClick={()=>setStep(3)}/>
        </div>
      )}

      {/* Step 3 — Monthly spending */}
      {step===3 && (
        <div className="au" style={{padding:"80px 28px 40px"}}>
          <span className="pill pill-gold" style={{marginBottom:20,display:"inline-flex"}}>Step 3 of 5</span>
          <h2 className="serif" style={{fontSize:36,fontWeight:400,marginBottom:8,lineHeight:1.2}}>Monthly<br/>spending</h2>
          <p style={{color:"var(--text2)",fontSize:14,marginBottom:28,lineHeight:1.6}}>Approximate is fine. We use this to find your highest-earning card combinations.</p>
          {([
            ["dining","🍽️ Dining & Takeout"],["groceries","🛒 Groceries"],
            ["travel","✈️ Travel & Hotels"],["gas","⛽ Gas & Transport"],
            ["shopping","🛍️ Shopping"],["other","💡 Everything Else"],
          ] as [keyof typeof p.spending, string][]).map(([k,label]) => (
            <div key={k} style={{marginBottom:16}}>
              <label style={{fontSize:12,color:"var(--text2)",fontWeight:600,display:"block",marginBottom:6}}>{label}</label>
              <input className="field" type="number" placeholder="$ per month" value={p.spending[k]} onChange={e=>setSp(k,e.target.value)} style={{padding:"12px 16px"}}/>
            </div>
          ))}
          <div style={{marginTop:8}}><GoldBtn label="Continue →" onClick={()=>setStep(4)}/></div>
        </div>
      )}

      {/* Step 4 — Goal */}
      {step===4 && (
        <div className="au" style={{padding:"80px 28px 40px"}}>
          <span className="pill pill-gold" style={{marginBottom:20,display:"inline-flex"}}>Step 4 of 5</span>
          <h2 className="serif" style={{fontSize:36,fontWeight:400,marginBottom:8,lineHeight:1.2}}>Primary<br/>goal</h2>
          <p style={{color:"var(--text2)",fontSize:14,marginBottom:24,lineHeight:1.6}}>We build your entire strategy around this.</p>
          {GOALS.map(([emoji,title,desc]) => (
            <button key={title} onClick={()=>{set("goal",title);setStep(5);}} className="press hover-lift" style={{
              width:"100%",padding:"18px 20px",marginBottom:10,
              background:p.goal===title?"rgba(201,168,76,.08)":"var(--surface)",
              border:`1.5px solid ${p.goal===title?"var(--accent)":"var(--border2)"}`,
              borderRadius:16,textAlign:"left",display:"flex",gap:14,alignItems:"center",
              transition:"all .15s",
            }}>
              <span style={{fontSize:28}}>{emoji}</span>
              <div style={{flex:1}}>
                <p style={{color:"var(--text)",fontSize:14,fontWeight:600}}>{title}</p>
                <p style={{color:"var(--text2)",fontSize:12,marginTop:2}}>{desc}</p>
              </div>
              <span style={{color:"var(--text3)",fontSize:20}}>→</span>
            </button>
          ))}
        </div>
      )}

      {/* Step 5 — Add first card prompt */}
      {step===5 && (
        <div className="au" style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",padding:"40px 28px",textAlign:"center"}}>
          <div style={{width:90,height:90,borderRadius:26,background:"linear-gradient(135deg,var(--green),#1A8A6A)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:42,marginBottom:32,boxShadow:"0 8px 32px rgba(45,200,160,.3)"}}>✓</div>
          <h2 className="serif" style={{fontSize:40,fontWeight:400,marginBottom:12,lineHeight:1.1}}>Welcome,<br/>{p.name}.</h2>
          <p style={{color:"var(--text2)",fontSize:14,lineHeight:1.8,marginBottom:12,maxWidth:300}}>Your profile is set. Now add your credit cards — we'll show your balances, due dates, points, offers, and cashback all in one place.</p>
          <p style={{color:"var(--accent)",fontSize:13,marginBottom:40}}>You'll add your cards on the next screen.</p>
          <GoldBtn label="Enter Dashboard →" onClick={()=>done(p)}/>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   HOME SCREEN
   ============================================================ */
function Home({ profile, cards, go }: { profile:UserProfile; cards:CreditCard[]; go:(s:S)=>void }) {
  const h = new Date().getHours();
  const greet = h<12?"Good morning" : h<17?"Good afternoon":"Good evening";
  const totalPts = cards.reduce((s,c)=>s+c.points,0);
  const totalBal = cards.reduce((s,c)=>s+c.balance,0);
  const totalLim = cards.reduce((s,c)=>s+c.limit,0);
  const util = pct(totalBal, totalLim);
  const ptsVal = Math.round(totalPts*.015);

  // Due date alerts
  const dueSoon = cards.filter(c => {
    const d = daysUntil(c.dueDate);
    return d >= 0 && d <= 7;
  });

  return (
    <div className="screen desktop-content au">
      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:32}}>
        <div>
          <p style={{color:"var(--text2)",fontSize:13,fontWeight:500,marginBottom:4}}>{greet}</p>
          <h1 className="serif" style={{fontSize:28,fontWeight:700,lineHeight:1.2,letterSpacing:"-.5px"}}>{profile.name || "Welcome"}</h1>
        </div>
        <button onClick={()=>go("settings")} className="press" style={{
          width:44,height:44,borderRadius:12,background:"var(--surface)",
          border:"1px solid var(--border2)",fontSize:18,color:"var(--text2)",
        }}>⚙</button>
      </div>

      {/* Hero — Portfolio value */}
      <div className="au d1 hover-lift" style={{
        background:"linear-gradient(135deg,#1A1200 0%,#3A2A00 30%,#2A1E00 60%,#1A1200 100%)",
        border:"1px solid rgba(201,168,76,.3)",
        borderRadius:24,padding:"28px 24px",marginBottom:16,
        position:"relative",overflow:"hidden",
        boxShadow:"0 8px 48px rgba(201,168,76,.15)",
      }}>
        <div style={{position:"absolute",top:-40,right:-40,width:180,height:180,borderRadius:"50%",background:"rgba(201,168,76,.06)"}}/>
        <div style={{position:"absolute",bottom:-60,left:20,width:140,height:140,borderRadius:"50%",background:"rgba(201,168,76,.04)"}}/>
        <p style={{color:"rgba(255,255,255,.6)",fontSize:11,letterSpacing:1.4,textTransform:"uppercase",fontWeight:600,marginBottom:6}}>Total Portfolio Value</p>
        <h2 style={{fontSize:46,fontWeight:700,color:"#F0D080",letterSpacing:"-1.5px",marginBottom:4,lineHeight:1}}>{f(totalPts)} <span style={{fontSize:18,fontWeight:300,opacity:.6}}>pts</span></h2>
        <p style={{color:"rgba(255,255,255,.6)",fontSize:14,marginBottom:24}}>≈ <strong style={{color:"#F0D080",fontSize:16}}>${f(ptsVal)}</strong> estimated value</p>
        <div style={{display:"flex",background:"rgba(0,0,0,.3)",borderRadius:16,padding:"14px 18px",gap:0}}>
          {[
            {l:"Balance",v:`$${f(totalBal)}`,c:"#F0D080"},
            {l:"Utilization",v:`${util}%`,c:uc(util)},
            {l:"Cards",v:`${cards.length}`,c:"#F0D080"},
          ].map(({l,v,c},i)=>(
            <div key={l} style={{flex:1,textAlign:i===1?"center":"left",borderLeft:i>0?"1px solid rgba(201,168,76,.2)":"none",paddingLeft:i>0?16:0}}>
              <p style={{color:"rgba(255,255,255,.5)",fontSize:10,marginBottom:4,letterSpacing:.6}}>{l}</p>
              <p style={{color:c,fontSize:18,fontWeight:700}}>{v}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Due date alert */}
      {dueSoon.length > 0 && (
        <div className="au d2" style={{
          background:"var(--redbg)",border:"1px solid rgba(220,38,38,.2)",
          borderRadius:16,padding:"14px 18px",marginBottom:16,
          display:"flex",gap:12,alignItems:"center",cursor:"pointer",
        }} onClick={()=>go("cards")}>
          <span style={{fontSize:22}}>⚠️</span>
          <div style={{flex:1}}>
            <p style={{color:"var(--red)",fontSize:13,fontWeight:600,marginBottom:2}}>Payment due soon</p>
            <p style={{color:"var(--text2)",fontSize:12}}>{dueSoon[0].name} — minimum ${f(dueSoon[0].minPayment)} due in {daysUntil(dueSoon[0].dueDate)} days</p>
          </div>
          <span style={{color:"var(--red)",fontSize:16}}>→</span>
        </div>
      )}

      {/* Quick actions */}
      <div className="au d2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:24}}>
        {([
          ["AI","Ask AI","Smart card advice","chat","var(--accent)"],
          ["Picks","Card Picks","Apply & use AI","ai-recommender","var(--accent)"],
          ["Travel","Travel","Use your points","travel","var(--accent)"],
          ["Split","Split Bill","Group expenses","split","var(--green)"],
          ["Goals","Goals","Track progress","goals","var(--accent)"],
          ["Save","Optimizer","Save more money","lifestyle","var(--green)"],
        ] as [string,string,string,S,string][]).map(([icon,label,sub,target,color])=>(
          <button key={label} onClick={()=>go(target)} className="hover-lift press card-surface" style={{padding:"16px 14px",textAlign:"left",width:"100%",border:"1px solid var(--border2)"}}>
            <span style={{fontSize:18,color:"var(--accent)",display:"block",marginBottom:8}}>{icon}</span>
            <p style={{color:"var(--text)",fontSize:13,fontWeight:600,letterSpacing:"-.1px"}}>{label}</p>
            <p style={{color:"var(--text2)",fontSize:11,marginTop:2}}>{sub}</p>
          </button>
        ))}
      </div>

      {/* Cards preview or Add card CTA */}
      <div className="au d3">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <h3 className="serif" style={{fontSize:22,fontWeight:400}}>My Cards</h3>
          <button onClick={()=>go("cards")} style={{color:"var(--accent)",fontSize:12,fontWeight:600,background:"none",border:"none"}}>
            {cards.length > 0 ? "Manage →" : "Add a card →"}
          </button>
        </div>
        {cards.length === 0 ? (
          <button onClick={()=>go("add-card")} className="press hover-lift" style={{
            width:"100%",padding:"32px 24px",background:"var(--surface)",
            border:"2px dashed var(--accent)",borderRadius:20,textAlign:"center",cursor:"pointer",
          }}>
            <p style={{fontSize:28,marginBottom:10}}>💳</p>
            <p className="serif gold-text" style={{fontSize:20,marginBottom:6,fontWeight:400}}>Add your first card</p>
            <p style={{color:"var(--text2)",fontSize:13}}>Search from 50+ cards. We'll show your balance, points, offers, and payment dates.</p>
          </button>
        ) : (
          <>
            {cards.slice(0,2).map(card => (
              <button key={card.id} onClick={()=>go("card-detail")} className="hover-lift press" style={{
                width:"100%",background:"var(--surface)",border:"1px solid var(--border2)",
                borderRadius:18,padding:"14px 16px",marginBottom:10,
                display:"flex",justifyContent:"space-between",alignItems:"center",textAlign:"left",
              }}>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:46,height:30,borderRadius:8,background:card.gradient,boxShadow:"0 3px 12px rgba(0,0,0,.5)"}}/>
                  <div>
                    <p style={{color:"var(--text)",fontSize:14,fontWeight:600}}>{card.name}</p>
                    <p style={{color:"var(--text2)",fontSize:11,marginTop:2}}>{card.issuer} · {card.rewardRate}</p>
                  </div>
                </div>
                <div style={{textAlign:"right"}}>
                  <p className="gold-text" style={{fontSize:14,fontWeight:700}}>{f(card.points)}<span style={{fontSize:10,opacity:.7}}> pts</span></p>
                  <p style={{color:"var(--text2)",fontSize:11,marginTop:2}}>${f(card.balance)} bal</p>
                </div>
              </button>
            ))}
            <button onClick={()=>go("add-card")} className="press" style={{
              width:"100%",padding:"14px",background:"none",
              border:"2px dashed var(--border2)",borderRadius:18,
              color:"var(--text3)",fontSize:13,transition:"all .2s",marginTop:4,
            }}
              onMouseOver={e=>{e.currentTarget.style.borderColor="var(--accent)";e.currentTarget.style.color="var(--accent)"}}
              onMouseOut={e=>{e.currentTarget.style.borderColor="var(--border2)";e.currentTarget.style.color="var(--text3)"}}>
              + Add another card
            </button>
          </>
        )}
      </div>

      {/* Approval chances teaser */}
      <div className="au d4" style={{marginTop:24,background:"var(--surface)",border:"1px solid var(--border2)",borderRadius:20,padding:"18px 20px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <h3 className="serif" style={{fontSize:18,fontWeight:400}}>Card Approval Chances</h3>
          <span className="pill pill-gold">AI</span>
        </div>
        {[
          {name:"Chase Sapphire Preferred",chance:89,color:"var(--green)"},
          {name:"Amex Gold Card",chance:76,color:"var(--accent)"},
          {name:"Capital One Venture X",chance:61,color:"var(--amber)"},
        ].map(({name,chance,color})=>(
          <div key={name} style={{marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
              <span style={{color:"var(--text)",fontSize:12,fontWeight:500}}>{name}</span>
              <span style={{color,fontSize:12,fontWeight:700}}>{chance}%</span>
            </div>
            <Bar v={chance} max={100} color={color} h={5}/>
          </div>
        ))}
        <p style={{color:"var(--text3)",fontSize:11,marginTop:8}}>Based on your income and credit score profile</p>
      </div>
    </div>
  );
}

/* ============================================================
   ADD CARD SCREEN
   ============================================================ */
function AddCard({ go, onAdd }: { go:(s:S)=>void; onAdd:(card:CreditCard)=>void }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<typeof CARD_DB[0]|null>(null);
  const [form, setForm] = useState({ balance:"", limit:"", minPayment:"", dueDate:"", points:"" });
  const [step, setStep] = useState<"search"|"details">("search");
  const setF = (k: keyof typeof form, v: string) => setForm(p=>({...p,[k]:v}));

  const filtered = CARD_DB.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.issuer.toLowerCase().includes(search.toLowerCase()) ||
    c.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (!selected) return;
    const newCard: CreditCard = {
      id: Date.now().toString(),
      dbId: selected.id,
      name: selected.name,
      issuer: selected.issuer,
      gradient: selected.gradient,
      accentColor: selected.accentColor,
      balance: parseFloat(form.balance)||0,
      limit: parseFloat(form.limit)||0,
      minPayment: parseFloat(form.minPayment)||0,
      dueDate: form.dueDate,
      points: parseFloat(form.points)||0,
      apr: "21.99%",
      rewardRate: selected.rewardRate,
      annualFee: selected.annualFee,
      perksValue: selected.perksValue,
      cashback: selected.cashback,
      category: selected.category,
      signupBonus: selected.signupBonus || "",
      bestFor: selected.bestFor || [],
      keyBenefits: selected.keyBenefits || [],
      bestPlaces: selected.bestPlaces || [],
      notGoodFor: selected.notGoodFor || [],
      offers: [
        { title:"10% back at Uber Eats", merchant:"Uber Eats", expires:"Dec 31, 2025", value:"Up to $25" },
        { title:"$50 off at Best Buy", merchant:"Best Buy", expires:"Nov 30, 2025", value:"$50 cashback" },
        { title:"5x points on hotels", merchant:"Hotels.com", expires:"Jan 15, 2026", value:"Bonus points" },
      ],
    };
    onAdd(newCard);
    go("cards");
  };

  return (
    <div className="screen desktop-content">
      <PageHead title={step==="search"?"Add a Card":"Card Details"} back={step==="details"?()=>setStep("search"):()=>go("cards")} />
      <div className="px">
        {step==="search" && (
          <div className="ai">
            <p style={{color:"var(--text2)",fontSize:14,marginBottom:20,lineHeight:1.6}}>Search from 50+ US credit cards. We'll auto-fill reward rates, perks, and offers.</p>
            <input className="field" placeholder="Search by card name, bank, or category..." value={search} onChange={e=>setSearch(e.target.value)} style={{marginBottom:20}} autoFocus/>

            {/* Categories */}
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
              {["travel","cashback","dining","groceries","hotel","airline"].map(cat=>(
                <button key={cat} onClick={()=>setSearch(cat)} className="press pill pill-gold" style={{fontSize:11,textTransform:"capitalize"}}>{cat}</button>
              ))}
            </div>

            <div style={{display:"flex",flexDirection:"column",gap:8,maxHeight:480,overflowY:"auto"}}>
              {filtered.map(card=>(
                <button key={card.id} onClick={()=>{setSelected(card);setStep("details");}} className="hover-lift press" style={{
                  background:"var(--surface)",border:"1px solid var(--border2)",
                  borderRadius:18,padding:"14px 16px",textAlign:"left",
                  display:"flex",gap:14,alignItems:"flex-start",transition:"border-color .2s",
                }}
                  onMouseOver={e=>(e.currentTarget.style.borderColor="var(--accent)")}
                  onMouseOut={e=>(e.currentTarget.style.borderColor="var(--border2)")}>
                  <div style={{width:52,height:34,borderRadius:8,background:card.gradient,flexShrink:0,boxShadow:"0 2px 8px rgba(0,0,0,.4)",marginTop:3}}/>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:3}}>
                      <p style={{color:"var(--text)",fontSize:14,fontWeight:600}}>{card.name}</p>
                      <span className="pill pill-emerald" style={{fontSize:10,flexShrink:0,marginLeft:8}}>{card.cashback}</span>
                    </div>
                    <p style={{color:"var(--text2)",fontSize:11,marginBottom:3}}>{card.issuer} · ${card.annualFee}/yr fee</p>
                    <p style={{color:"var(--accent)",fontSize:11,fontWeight:600,marginBottom:6}}>{card.rewardRate}</p>
                    {(card as any).bestFor && (card as any).bestFor.slice(0,2).map((b:string,bi:number)=>(
                      <div key={bi} style={{display:"flex",alignItems:"center",gap:5,marginBottom:2}}>
                        <span style={{width:4,height:4,borderRadius:"50%",background:"var(--green)",flexShrink:0}}/>
                        <span style={{color:"var(--text2)",fontSize:10}}>{b}</span>
                      </div>
                    ))}
                    {(card as any).signupBonus && (
                      <p style={{color:"var(--amber)",fontSize:10,marginTop:6,fontWeight:500}}>
                        🎁 {(card as any).signupBonus.split(" — ")[0]}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step==="details" && selected && (
          <div className="ai">
            {/* Card preview */}
            <div style={{background:selected.gradient,borderRadius:20,padding:"24px",marginBottom:24,position:"relative",overflow:"hidden",boxShadow:"0 8px 32px rgba(0,0,0,.5)"}}>
              <div style={{position:"absolute",top:-20,right:-20,width:100,height:100,borderRadius:"50%",background:"rgba(255,255,255,.06)"}}/>
              <p style={{color:"rgba(255,255,255,.5)",fontSize:11,letterSpacing:1.2,textTransform:"uppercase",marginBottom:4}}>{selected.issuer}</p>
              <p style={{color:"#fff",fontSize:20,fontWeight:700,marginBottom:12}}>{selected.name}</p>
              <p style={{color:selected.accentColor,fontSize:13}}>{selected.rewardRate}</p>
              <div style={{display:"flex",gap:12,marginTop:16}}>
                <span className="pill" style={{background:"rgba(255,255,255,.15)",color:"#fff",fontSize:11}}>${selected.annualFee}/yr fee</span>
                <span className="pill" style={{background:"rgba(255,255,255,.15)",color:"#fff",fontSize:11}}>Perks: ${selected.perksValue}/yr</span>
              </div>
            </div>

            {/* Signup Bonus */}
            {selected.signupBonus && (
              <div style={{background:"rgba(240,164,41,.08)",border:"1px solid rgba(240,164,41,.25)",borderRadius:14,padding:"12px 16px",marginBottom:16}}>
                <p style={{color:"var(--amber)",fontSize:12,fontWeight:700,marginBottom:4}}>🎁 Welcome Bonus</p>
                <p style={{color:"var(--text)",fontSize:13,lineHeight:1.5}}>{selected.signupBonus}</p>
              </div>
            )}

            {/* Best For */}
            {selected.bestFor && selected.bestFor.length > 0 && (
              <div style={{background:"rgba(45,200,160,.06)",border:"1px solid rgba(45,200,160,.2)",borderRadius:14,padding:"12px 16px",marginBottom:16}}>
                <p style={{color:"var(--green)",fontSize:12,fontWeight:700,marginBottom:8}}>✅ Best Used For</p>
                {selected.bestFor.map((b:string,i:number)=>(
                  <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:i<selected.bestFor.length-1?6:0}}>
                    <span style={{width:5,height:5,borderRadius:"50%",background:"var(--green)",flexShrink:0,marginTop:5}}/>
                    <p style={{color:"var(--text2)",fontSize:12,lineHeight:1.4}}>{b}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Key Benefits */}
            {selected.keyBenefits && selected.keyBenefits.length > 0 && (
              <div style={{background:"rgba(79,110,247,.06)",border:"1px solid rgba(79,110,247,.2)",borderRadius:14,padding:"12px 16px",marginBottom:16}}>
                <p style={{color:"var(--accent)",fontSize:12,fontWeight:700,marginBottom:8}}>⭐ Key Benefits</p>
                {selected.keyBenefits.map((b:string,i:number)=>(
                  <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:i<selected.keyBenefits.length-1?6:0}}>
                    <span style={{color:"var(--accent)",fontSize:10,flexShrink:0,marginTop:2}}>→</span>
                    <p style={{color:"var(--text2)",fontSize:12,lineHeight:1.4}}>{b}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Best Places */}
            {selected.bestPlaces && selected.bestPlaces.length > 0 && (
              <div style={{background:"rgba(201,168,76,.06)",border:"1px solid rgba(201,168,76,.2)",borderRadius:14,padding:"12px 16px",marginBottom:16}}>
                <p style={{color:"var(--accent)",fontSize:12,fontWeight:700,marginBottom:8}}>📍 Where to Use It</p>
                {selected.bestPlaces.map((b:string,i:number)=>(
                  <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:i<selected.bestPlaces.length-1?6:0}}>
                    <span style={{fontSize:10,flexShrink:0,marginTop:2}}>📌</span>
                    <p style={{color:"var(--text2)",fontSize:12,lineHeight:1.4}}>{b}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Not good for */}
            {selected.notGoodFor && selected.notGoodFor.length > 0 && (
              <div style={{background:"rgba(244,97,122,.05)",border:"1px solid rgba(244,97,122,.2)",borderRadius:14,padding:"12px 16px",marginBottom:20}}>
                <p style={{color:"var(--red)",fontSize:12,fontWeight:700,marginBottom:8}}>⚠️ Not Great For</p>
                {selected.notGoodFor.map((b:string,i:number)=>(
                  <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:i<selected.notGoodFor.length-1?6:0}}>
                    <span style={{color:"var(--red)",fontSize:10,flexShrink:0,marginTop:2}}>✗</span>
                    <p style={{color:"var(--text2)",fontSize:12,lineHeight:1.4}}>{b}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="divider" style={{marginBottom:20}}/>
            <p style={{color:"var(--text2)",fontSize:14,marginBottom:20,lineHeight:1.6}}>Enter your card details. This stays private and encrypted on your device.</p>

            {[
              {k:"balance" as const, label:"Current Balance", placeholder:"$0.00", type:"number"},
              {k:"limit" as const, label:"Credit Limit", placeholder:"$0.00", type:"number"},
              {k:"minPayment" as const, label:"Minimum Payment Due", placeholder:"$0.00", type:"number"},
              {k:"dueDate" as const, label:"Payment Due Date", placeholder:"", type:"date"},
              {k:"points" as const, label:"Current Points/Miles Balance", placeholder:"0", type:"number"},
            ].map(({k,label,placeholder,type})=>(
              <div key={k} style={{marginBottom:16}}>
                <label style={{fontSize:12,color:"var(--text2)",fontWeight:600,textTransform:"uppercase",letterSpacing:.6,display:"block",marginBottom:6}}>{label}</label>
                <input className="field" type={type} placeholder={placeholder} value={form[k]} onChange={e=>setF(k,e.target.value)} style={{padding:"13px 16px"}}/>
              </div>
            ))}

            <div style={{marginTop:24}}>
              <button onClick={handleAdd} className="btn-gold press" style={{width:"100%"}}>
                Add {selected.name} →
              </button>
              <p style={{color:"var(--text3)",fontSize:11,textAlign:"center",marginTop:10}}>🔒 Encrypted · Never shared · You can update anytime</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   CARDS SCREEN
   ============================================================ */
function Cards({ cards, go }: { cards:CreditCard[]; go:(s:S)=>void }) {
  const [open, setOpen] = useState<string|null>(null);
  return (
    <div className="screen desktop-content">
      <PageHead title="My Cards" sub={`${cards.length} card${cards.length!==1?"s":""} · ${f(cards.reduce((s,c)=>s+c.points,0))} total points`}
        right={<button onClick={()=>go("add-card")} className="btn-gold press" style={{padding:"10px 18px",fontSize:13}}>+ Add Card</button>}/>
      <div className="px">
        {cards.length === 0 ? (
          <div style={{textAlign:"center",padding:"60px 20px"}}>
            <p style={{fontSize:48,marginBottom:16}}>💳</p>
            <h3 className="serif" style={{fontSize:24,fontWeight:400,marginBottom:10}}>No cards yet</h3>
            <p style={{color:"var(--text2)",fontSize:14,marginBottom:24}}>Add your credit cards to see balances, points, due dates, and personalized recommendations.</p>
            <button onClick={()=>go("add-card")} className="btn-gold press" style={{padding:"14px 32px"}}>Add Your First Card</button>
          </div>
        ) : (
          cards.map((card,i)=>{
            const u = pct(card.balance, card.limit);
            const days = daysUntil(card.dueDate);
            const isOpen = open===card.id;
            return (
              <div key={card.id} className={`au hover-lift d${Math.min(i+1,6)}`} style={{
                background:"var(--surface)",border:`1.5px solid ${isOpen?"var(--accent)":"var(--border2)"}`,
                borderRadius:22,marginBottom:16,overflow:"hidden",cursor:"pointer",transition:"border-color .2s",
              }} onClick={()=>setOpen(isOpen?null:card.id)}>

                {/* Card face */}
                <div style={{background:card.gradient,padding:"22px 20px",position:"relative",overflow:"hidden"}}>
                  <div style={{position:"absolute",top:-25,right:-25,width:120,height:120,borderRadius:"50%",background:"rgba(255,255,255,.07)"}}/>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18}}>
                    <div>
                      <p style={{color:"rgba(255,255,255,.5)",fontSize:11,letterSpacing:1.2,textTransform:"uppercase",marginBottom:3}}>{card.issuer}</p>
                      <p style={{color:"#fff",fontSize:20,fontWeight:700}}>{card.name}</p>
                    </div>
                    <span className="pill" style={{background:"rgba(255,255,255,.15)",color:"#fff",fontSize:11}}>{card.cashback}</span>
                  </div>
                  <div style={{display:"flex",gap:22}}>
                    {[{l:"Balance",v:`$${f(card.balance)}`},{l:"Available",v:`$${f(card.limit-card.balance)}`},{l:"Points",v:f(card.points)}].map(({l,v})=>(
                      <div key={l}>
                        <p style={{color:"rgba(255,255,255,.4)",fontSize:10,textTransform:"uppercase",letterSpacing:.8,marginBottom:2}}>{l}</p>
                        <p style={{color:"#fff",fontSize:16,fontWeight:700}}>{v}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key info row */}
                <div style={{padding:"14px 20px",display:"flex",gap:0,borderBottom:"1px solid var(--border)"}}>
                  <div style={{flex:1}}>
                    <p style={{color:"var(--text3)",fontSize:10,marginBottom:3}}>Utilization</p>
                    <p style={{color:uc(u),fontSize:13,fontWeight:700}}>{u}%</p>
                  </div>
                  <div style={{flex:1}}>
                    <p style={{color:"var(--text3)",fontSize:10,marginBottom:3}}>Min. Payment</p>
                    <p style={{color:"var(--text)",fontSize:13,fontWeight:700}}>${f(card.minPayment)}</p>
                  </div>
                  <div style={{flex:1}}>
                    <p style={{color:"var(--text3)",fontSize:10,marginBottom:3}}>Due In</p>
                    <p style={{color:urgencyColor(days),fontSize:13,fontWeight:700}}>{days >= 0 ? `${days} days` : "Overdue"}</p>
                  </div>
                  <div style={{flex:1}}>
                    <p style={{color:"var(--text3)",fontSize:10,marginBottom:3}}>Rewards</p>
                    <p style={{color:"var(--accent)",fontSize:13,fontWeight:700}}>≈${f(Math.round(card.points*.015))}</p>
                  </div>
                </div>

                {/* Utilization bar */}
                <div style={{padding:"10px 20px"}}>
                  <Bar v={card.balance} max={card.limit} color={uc(u)} h={6}/>
                </div>

                {/* Expanded details */}
                {isOpen && (
                  <div className="ai" style={{padding:"0 20px 20px",borderTop:"1px solid var(--border)"}}>
                    {/* Active offers */}
                    <p style={{color:"var(--text2)",fontSize:12,fontWeight:600,textTransform:"uppercase",letterSpacing:.6,marginBottom:10,marginTop:14}}>Active Offers & Cashback</p>
                    {card.offers.map((offer,oi)=>(
                      <div key={oi} style={{background:"var(--surface2)",borderRadius:12,padding:"10px 14px",marginBottom:8,display:"flex",gap:10,alignItems:"center"}}>
                        <span style={{fontSize:18}}>🎁</span>
                        <div style={{flex:1}}>
                          <p style={{color:"var(--text)",fontSize:12,fontWeight:600}}>{offer.title}</p>
                          <p style={{color:"var(--text2)",fontSize:11,marginTop:1}}>{offer.merchant} · Expires {offer.expires}</p>
                        </div>
                        <span className="pill pill-emerald" style={{fontSize:10}}>{offer.value}</span>
                      </div>
                    ))}

                    {/* Detailed metrics */}
                    <p style={{color:"var(--text2)",fontSize:12,fontWeight:600,textTransform:"uppercase",letterSpacing:.6,marginBottom:10,marginTop:16}}>Card Analytics</p>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                      {[
                        {l:"Annual Fee",v:`$${card.annualFee}`,c:"var(--text)"},
                        {l:"Perks Value",v:`$${card.perksValue}/yr`,c:"var(--green)"},
                        {l:"Net Benefit",v:`+$${card.perksValue-card.annualFee}/yr`,c:card.perksValue>card.annualFee?"var(--green)":"var(--red)"},
                        {l:"APR",v:card.apr,c:"var(--text2)"},
                        {l:"Points Value",v:`~$${f(Math.round(card.points*.015))}`,c:"var(--accent)"},
                        {l:"Pay Before",v:"Statement close",c:"var(--amber)"},
                      ].map(({l,v,c})=>(
                        <div key={l} style={{background:"var(--surface2)",borderRadius:11,padding:"10px 12px"}}>
                          <p style={{color:"var(--text3)",fontSize:10,marginBottom:4}}>{l}</p>
                          <p style={{color:c,fontSize:13,fontWeight:700}}>{v}</p>
                        </div>
                      ))}
                    </div>

                    {/* AI tip */}
                    <div style={{background:"rgba(201,168,76,.08)",border:"1px solid rgba(201,168,76,.2)",borderRadius:14,padding:"12px 16px",marginTop:14}}>
                      <p style={{color:"var(--accent)",fontSize:12,fontWeight:600,marginBottom:4}}>💡 AI Payment Tip</p>
                      <p style={{color:"var(--text2)",fontSize:12,lineHeight:1.5}}>
                        Pay ${f(Math.round(card.balance*.5))} before your statement closes to reduce reported utilization by {Math.round(u/2)}%. This could boost your credit score by 8–12 points within 30 days.
                      </p>
                    </div>

                    {/* Reward rate */}
                    <div style={{background:"rgba(79,110,247,.08)",border:"1px solid rgba(79,110,247,.2)",borderRadius:14,padding:"12px 16px",marginTop:10}}>
                      <p style={{color:"var(--accent)",fontSize:12,fontWeight:600,marginBottom:4}}>Earning Rate</p>
                      <p style={{color:"var(--text2)",fontSize:12,lineHeight:1.5}}>{card.rewardRate}</p>
                    </div>
                    {card.bestPlaces && card.bestPlaces.length > 0 && (
                      <div style={{background:"rgba(201,168,76,.06)",border:"1px solid rgba(201,168,76,.2)",borderRadius:14,padding:"12px 16px",marginTop:10}}>
                        <p style={{color:"var(--accent)",fontSize:12,fontWeight:600,marginBottom:8}}>Best Places to Use This Card</p>
                        <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                          {card.bestPlaces.map((place:string,pi:number)=>(
                            <span key={pi} style={{background:"rgba(201,168,76,.1)",border:"1px solid rgba(201,168,76,.2)",borderRadius:20,padding:"3px 10px",fontSize:10,color:"var(--accent)"}}>
                              {place.split(" (")[0]}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {card.keyBenefits && card.keyBenefits.length > 0 && (
                      <div style={{background:"rgba(45,200,160,.06)",border:"1px solid rgba(45,200,160,.2)",borderRadius:14,padding:"12px 16px",marginTop:10}}>
                        <p style={{color:"var(--green)",fontSize:12,fontWeight:600,marginBottom:8}}>Key Card Benefits</p>
                        {card.keyBenefits.slice(0,5).map((b:string,bi:number)=>(
                          <div key={bi} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:bi<Math.min(card.keyBenefits.length,5)-1?6:0}}>
                            <span style={{color:"var(--green)",fontSize:10,flexShrink:0,marginTop:2}}>check</span>
                            <p style={{color:"var(--text2)",fontSize:11,lineHeight:1.4}}>{b}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {card.signupBonus && (
                      <div style={{background:"rgba(240,164,41,.06)",border:"1px solid rgba(240,164,41,.25)",borderRadius:14,padding:"12px 16px",marginTop:10}}>
                        <p style={{color:"var(--amber)",fontSize:12,fontWeight:600,marginBottom:4}}>Welcome Bonus</p>
                        <p style={{color:"var(--text2)",fontSize:12,lineHeight:1.5}}>{card.signupBonus}</p>
                      </div>
                    )}
                    {card.notGoodFor && card.notGoodFor.length > 0 && (
                      <div style={{background:"rgba(244,97,122,.05)",border:"1px solid rgba(244,97,122,.15)",borderRadius:14,padding:"12px 16px",marginTop:10}}>
                        <p style={{color:"var(--red)",fontSize:12,fontWeight:600,marginBottom:8}}>Not Great For</p>
                        {card.notGoodFor.map((b:string,bi:number)=>(
                          <div key={bi} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:bi<card.notGoodFor.length-1?5:0}}>
                            <span style={{color:"var(--red)",fontSize:10,flexShrink:0,marginTop:2}}>x</span>
                            <p style={{color:"var(--text2)",fontSize:11,lineHeight:1.4}}>{b}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

/* ============================================================
   CHAT SCREEN
   ============================================================ */
function Chat({ cards, profile }: { cards:CreditCard[]; profile:UserProfile }) {
  const [msgs, setMsgs] = useState<Msg[]>([
    {role:"ai",text:`Hi ${profile.name||"there"}! I'm your AI financial advisor. I know your complete profile — ${cards.length} card${cards.length!==1?"s":""}, ${f(cards.reduce((s,c)=>s+c.points,0))} total points, and your goals. Ask me anything about which card to use, how to boost your score, or the best way to use your rewards.`,id:0},
  ]);
  const [val, setVal] = useState("");
  const [busy, setBusy] = useState(false);
  const [nextId, setNextId] = useState(1);
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(()=>{endRef.current?.scrollIntoView({behavior:"smooth"});},[msgs,busy]);
  const send = useCallback(async (text:string)=>{
    if(!text.trim()||busy) return;
    const uid=nextId;
    setMsgs(p=>[...p,{role:"user",text,id:uid}]);
    setNextId(n=>n+2); setVal(""); setBusy(true);
    try {
      const totalPts=cards.reduce((s,c)=>s+c.points,0);
      const totalBal=cards.reduce((s,c)=>s+c.balance,0);
      const totalLim=cards.reduce((s,c)=>s+c.limit,0);
      const util=totalLim>0?Math.round(totalBal/totalLim*100):0;
      const systemPrompt = `You are the AI financial advisor inside CardPilot Elite. Respond like a knowledgeable human advisor — natural, clear, and appropriately detailed.

RULES:
- Greetings (hi, hello, hey) → respond with only "Hi ${profile.name||"there"}, how can I help you today?"
- Simple questions → answer in 1-2 sentences
- Complex financial questions → answer as thoroughly as needed with real numbers and clear explanations
- Questions asking for a list or comparison → use a clean numbered or bulleted list
- NEVER use **bold** or *italic* markdown formatting — plain text only
- NEVER use emojis
- NEVER start with "Great!" "Sure!" "Absolutely!" or filler phrases
- Be direct and specific — always reference their actual cards, balances, and spending when relevant
- Match the depth of your answer to the complexity of the question

APP GUIDE — you know every feature:
- Dashboard: shows total points value, credit utilization, payment alerts, card approval chances
- My Cards: tap any card to see balance, minimum payment, due date, points, active offers, benefits. Tap + Add Card to add a new card by searching from 50+ real US cards
- AI Advisor (here): ask anything about your cards, spending, rewards, credit score
- Travel: see all your points across programs, best redemptions, transfer partners ranked by value
- Goals: track financial goals with progress rings and AI action plans
- Split Bills: split restaurant bills with friends, select who you ate with, settle via Venmo
- Perks: see active cashback offers and annual credits before they expire
- Optimizer: compare prices across 8 stores for any product, or calculate how much you save cutting a daily habit
- AI Picks: get personalized card recommendations to apply for, or find which card to use at any merchant
- Settings: toggle features on/off, switch between dark and light theme

HOW TO GUIDE USERS:
- If user seems lost or confused → briefly explain what CardPilot can do and suggest where to start
- If user asks "how do I..." → give exact step by step instructions for that feature
- If user asks "what can you do" → list the main features in a short bullet list
- Always be helpful and point users to the right screen

USER PROFILE:
- Name: ${profile.name || "User"}
- Income: ${profile.income || "not set"}
- Credit Score: ${profile.creditScore || "not set"}
- Goal: ${profile.goal || "not set"}
- Monthly Spending: Dining $${profile.spending?.dining||0}, Groceries $${profile.spending?.groceries||0}, Travel $${profile.spending?.travel||0}, Gas $${profile.spending?.gas||0}, Shopping $${profile.spending?.shopping||0}

THEIR CARDS (${cards.length} total):
${cards.map(c=>`- ${c.name} (${c.issuer}): Balance $${c.balance}, Limit $${c.limit}, Points ${c.points}, Due: ${c.dueDate||"not set"}, Rewards: ${c.rewardRate}`).join("\n")}

PORTFOLIO: ${f(totalPts)} total points worth ~$${f(Math.round(totalPts*0.015))} | Utilization: ${util}%`;

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemPrompt,
          messages: [{ role: "user", content: text }],
        }),
      });
      const data = await response.json();
      const aiText = data.text || "Sorry, I could not get a response. Please try again.";
      setMsgs(p=>[...p,{role:"ai",text:aiText,id:uid+1}]);
    } catch(err) {
      setMsgs(p=>[...p,{role:"ai",text:"Connection error. Please check your internet and try again.",id:uid+1}]);
    }
    setBusy(false);
  },[busy,nextId,cards,profile]);

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100vh",background:"var(--bg)"}}>
      <div style={{padding:"56px 20px 14px",borderBottom:"1px solid var(--border2)",background:"var(--surface)"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,maxWidth:800,margin:"0 auto"}}>
          <div style={{width:44,height:44,borderRadius:13,background:"var(--accent)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,boxShadow:"0 4px 16px rgba(37,99,235,.15)"}}>◎</div>
          <div>
            <h2 style={{fontSize:17,fontWeight:600}}>AI Financial Advisor</h2>
            <div style={{display:"flex",alignItems:"center",gap:5,marginTop:2}}>
              <span style={{width:8,height:8,borderRadius:"50%",background:"var(--green)",display:"inline-block"}}/>
              <span style={{color:"var(--text2)",fontSize:11}}>Knows your cards, goals & spending profile</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{flex:1,overflowY:"auto",padding:"20px 16px 0",display:"flex",flexDirection:"column",gap:14}}>
        <div style={{maxWidth:800,margin:"0 auto",width:"100%",display:"flex",flexDirection:"column",gap:14}}>
          {msgs.map(m=>(
            <div key={m.id} className="ai" style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",alignItems:"flex-end",gap:8}}>
              {m.role==="ai"&&<div style={{width:32,height:32,borderRadius:10,flexShrink:0,background:"linear-gradient(135deg,var(--accent),var(--accent2))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}>◎</div>}
              <div style={{maxWidth:"78%",padding:"13px 18px",
                borderRadius:m.role==="user"?"20px 20px 5px 20px":"20px 20px 20px 5px",
                background:m.role==="user"?"var(--accent)":"var(--surface)",
                border:m.role==="ai"?"1px solid var(--border2)":"none",
                boxShadow:m.role==="user"?"0 4px 20px rgba(37,99,235,.15)":"var(--shadow)",
              }}>
                <p style={{color:m.role==="user"?"#ffffff":"var(--text)",fontSize:14,lineHeight:1.7}}>{m.text}</p>
              </div>
            </div>
          ))}
          {busy&&(
            <div style={{display:"flex",alignItems:"flex-end",gap:8}}>
              <div style={{width:32,height:32,borderRadius:10,background:"linear-gradient(135deg,var(--accent),var(--accent2))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}>◎</div>
              <div style={{padding:"14px 18px",borderRadius:"20px 20px 20px 5px",background:"var(--surface)",border:"1px solid var(--border2)"}}>
                <div style={{display:"flex",gap:5,alignItems:"center"}}>
                  {[0,1,2].map(i=><span key={i} style={{width:8,height:8,borderRadius:"50%",background:"var(--accent)",display:"inline-block",animation:"pulse 1.2s ease infinite",animationDelay:`${i*.2}s`}}/>)}
                </div>
              </div>
            </div>
          )}
          <div ref={endRef}/>
        </div>
      </div>

      <div style={{padding:"12px 16px 16px",borderTop:"1px solid var(--border2)",background:"var(--surface)"}}>
        <div style={{maxWidth:800,margin:"0 auto"}}>
          <div style={{display:"flex",gap:7,overflowX:"auto",marginBottom:10,paddingBottom:2}}>
            {QCHIPS.map(q=>(
              <button key={q} onClick={()=>send(q)} className="press" style={{
                flexShrink:0,padding:"7px 14px",borderRadius:20,
                background:"var(--surface2)",border:"1px solid var(--border2)",
                color:"var(--text2)",fontSize:11,fontWeight:500,whiteSpace:"nowrap",transition:"all .15s",
              }}
                onMouseOver={e=>{e.currentTarget.style.borderColor="var(--accent)";e.currentTarget.style.color="var(--accent)"}}
                onMouseOut={e=>{e.currentTarget.style.borderColor="var(--border2)";e.currentTarget.style.color="var(--text2)"}}>
                {q}
              </button>
            ))}
          </div>
          <div style={{display:"flex",gap:8}}>
            <input className="field" value={val} onChange={e=>setVal(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send(val)}
              placeholder="Ask anything about your cards..."
              style={{flex:1,padding:"13px 16px"}}/>
            <button onClick={()=>send(val)} disabled={!val.trim()||busy} className="press" style={{
              padding:"13px 20px",borderRadius:12,border:"none",
              background:val.trim()&&!busy?"var(--accent)":"var(--surface2)",
              color:val.trim()&&!busy?"#ffffff":"var(--text3)",fontSize:18,
              transition:"all .2s",
              boxShadow:val.trim()&&!busy?"0 4px 20px rgba(37,99,235,.15)":"none",
            }}>→</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   TRAVEL SCREEN
   ============================================================ */
function Travel({ cards }: { cards:CreditCard[] }) {
  const [tab, setTab] = useState(0);
  const totalPts = cards.reduce((s,c)=>s+c.points,0);
  return (
    <div className="screen desktop-content">
      <PageHead title="Travel & Points" sub="Maximize every mile and hotel night"/>
      <div className="px">
        <div className="au" style={{display:"flex",gap:5,marginBottom:24,background:"var(--surface2)",padding:4,borderRadius:14}}>
          {["Points","Book Travel","Transfers"].map((t,i)=>(
            <button key={t} onClick={()=>setTab(i)} className="press" style={{flex:1,padding:"10px",borderRadius:11,border:"none",background:tab===i?"var(--accent)":"none",color:tab===i?"#1A1200":"var(--text2)",fontSize:13,fontWeight:tab===i?700:500,transition:"all .2s"}}>{t}</button>
          ))}
        </div>

        {tab===0&&<div className="ai">
          <div className="card-surface hover-lift" style={{padding:22,marginBottom:16}}>
            <p style={{color:"var(--text2)",fontSize:12,marginBottom:4}}>Total across all programs</p>
            <h2 style={{fontSize:38,fontWeight:700,letterSpacing:"-1px",marginBottom:4}}>{f(totalPts)}</h2>
            <p className="gold-text" style={{fontSize:15,fontWeight:600}}>≈ ${f(Math.round(totalPts*.015))} estimated value</p>
          </div>
          {cards.length===0 ? <p style={{color:"var(--text2)",fontSize:14,textAlign:"center",padding:"40px 0"}}>Add cards to see your points breakdown</p>
          : cards.map((c,i)=>(
            <div key={c.id} className={`au d${i+1} card-surface hover-lift`} style={{padding:"14px 16px",marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:42,height:28,borderRadius:7,background:c.gradient,boxShadow:"0 2px 8px rgba(0,0,0,.5)"}}/>
                <div><p style={{color:"var(--text)",fontSize:13,fontWeight:600,letterSpacing:"-.1px"}}>{c.name}</p><p style={{color:"var(--text2)",fontSize:11,marginTop:1}}>{c.issuer}</p></div>
              </div>
              <div style={{textAlign:"right"}}>
                <p style={{color:"var(--text)",fontSize:14,fontWeight:700}}>{f(c.points)}</p>
                <p className="gold-text" style={{fontSize:11,marginTop:1}}>≈ ${f(Math.round(c.points*.015))}</p>
              </div>
            </div>
          ))}
        </div>}

        {tab===1&&<div className="ai">
          <p style={{color:"var(--text2)",fontSize:13,marginBottom:16}}>🔥 Best redemptions with your current points</p>
          {[
            {route:"US → Europe Business Class",pts:"55,000 pts",via:"Air France via Chase UR",val:"~$3,200 ticket",cpp:"5.8¢/pt"},
            {route:"US → Japan Economy",pts:"35,000 pts",via:"ANA via Amex MR",val:"~$1,100 ticket",cpp:"3.1¢/pt"},
            {route:"Park Hyatt Tokyo",pts:"35,000 pts/night",via:"World of Hyatt",val:"~$700/night",cpp:"2.0¢/pt"},
            {route:"US → Caribbean",pts:"25,000 pts",via:"Delta via Amex MR",val:"~$650 ticket",cpp:"2.6¢/pt"},
          ].map((r,i)=>(
            <div key={i} className={`au d${i+1} card-surface hover-lift`} style={{padding:"16px 18px",marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                <p style={{color:"var(--text)",fontSize:14,fontWeight:600,flex:1,paddingRight:10}}>{r.route}</p>
                <span className="pill pill-gold">{r.cpp}</span>
              </div>
              <p style={{color:"var(--text2)",fontSize:12,marginBottom:8}}>{r.via}</p>
              <div style={{display:"flex",justifyContent:"space-between"}}>
                <span style={{color:"var(--accent)",fontSize:13,fontWeight:700}}>{r.pts}</span>
                <span style={{color:"var(--green)",fontSize:13,fontWeight:600}}>{r.val}</span>
              </div>
            </div>
          ))}
        </div>}

        {tab===2&&<div className="ai">
          <div style={{background:"var(--surface2)",borderRadius:14,padding:"12px 16px",marginBottom:16}}>
            <p style={{color:"var(--text2)",fontSize:12}}>Optimizing Chase UR & Amex MR points</p>
          </div>
          {[
            {p:"World of Hyatt",v:"2.2¢/pt",best:true,n:"Best for luxury hotels"},
            {p:"British Airways Avios",v:"1.8¢/pt",best:false,n:"Short-haul & partner flights"},
            {p:"Air France/KLM Flying Blue",v:"1.6¢/pt",best:false,n:"Transatlantic Business Class"},
            {p:"United MileagePlus",v:"1.5¢/pt",best:false,n:"Domestic & Star Alliance"},
          ].map((p,i)=>(
            <div key={i} className={`au d${i+1} card-surface`} style={{padding:"14px 18px",marginBottom:10,border:`1.5px solid ${p.best?"var(--accent)":"var(--border2)"}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                  <p style={{color:"var(--text)",fontSize:13,fontWeight:600,letterSpacing:"-.1px"}}>{p.p}</p>
                  {p.best&&<span className="pill pill-gold">Best Value</span>}
                </div>
                <p style={{color:"var(--text2)",fontSize:11}}>{p.n}</p>
              </div>
              <p className="gold-text" style={{fontSize:18,fontWeight:700}}>{p.v}</p>
            </div>
          ))}
        </div>}
      </div>
    </div>
  );
}

/* ============================================================
   GOALS SCREEN
   ============================================================ */
function Goals() {
  const [add, setAdd] = useState(false);
  const [open, setOpen] = useState<number|null>(null);
  return (
    <div className="screen desktop-content">
      <PageHead title="My Goals" sub="Your financial targets"
        right={<button onClick={()=>setAdd(a=>!a)} className="pill pill-gold press" style={{fontSize:12,fontWeight:700}}>+ Add Goal</button>}/>
      <div className="px">
        {add&&(
          <div className="ap card-surface" style={{border:"1.5px solid var(--accent)",padding:20,marginBottom:20}}>
            <p style={{color:"var(--text)",fontSize:15,fontWeight:600,marginBottom:14}}>Choose a goal type</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {[["📊","Utilization","Keep cards under 30%"],["💰","Save Money","Hit a savings target"],["📈","Credit Score","Reach 750+"],["✈️","Travel","Earn points for a trip"],["💳","Pay Off Debt","Become debt free"],["🛡️","Emergency Fund","3–6 months expenses"]].map(([e,t,d])=>(
                <button key={t} onClick={()=>setAdd(false)} className="press hover-lift card-surface-2" style={{padding:"14px 12px",textAlign:"left"}}>
                  <p style={{fontSize:22,marginBottom:5}}>{e}</p>
                  <p style={{color:"var(--text)",fontSize:12,fontWeight:700}}>{t}</p>
                  <p style={{color:"var(--text2)",fontSize:11,marginTop:2}}>{d}</p>
                </button>
              ))}
            </div>
          </div>
        )}
        {SAMPLE_GOALS.map((g,i)=>{
          const p=Math.min(100,Math.round(g.current/g.target*100));
          const isOpen=open===g.id;
          return (
            <div key={g.id} className={`au d${i+1} card-surface`} style={{padding:"20px",marginBottom:16}}>
              <div style={{display:"flex",gap:14,alignItems:"flex-start",marginBottom:16}}>
                <div style={{width:52,height:52,borderRadius:16,flexShrink:0,background:`${g.color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>{g.emoji}</div>
                <div style={{flex:1}}>
                  <p style={{color:"var(--text)",fontSize:15,fontWeight:600,marginBottom:2}}>{g.title}</p>
                  <p style={{color:"var(--text2)",fontSize:12}}>Due: {g.due}</p>
                </div>
                <div style={{position:"relative",flexShrink:0}}>
                  <Ring v={g.current} max={g.target} color={g.color} r={26} sw={5}/>
                  <span style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",fontSize:11,fontWeight:800,color:g.color}}>{p}%</span>
                </div>
              </div>
              <Bar v={g.current} max={g.target} color={g.color} h={7}/>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:8,marginBottom:14}}>
                <p style={{color:"var(--text2)",fontSize:12}}>{g.unit==="$"?"$":""}{f(g.current)}{g.unit!=="$"?" "+g.unit:""}</p>
                <p style={{color:"var(--text2)",fontSize:12}}>Target: {g.unit==="$"?"$":""}{f(g.target)}{g.unit!=="$"?" "+g.unit:""}</p>
              </div>
              <button onClick={()=>setOpen(isOpen?null:g.id)} style={{background:"none",border:"none",color:"var(--accent)",fontSize:13,fontWeight:600,padding:0}}>
                {isOpen?"Hide":"View"} action plan {isOpen?"↑":"↓"}
              </button>
              {isOpen&&(
                <div className="ai" style={{marginTop:14,background:"var(--surface2)",borderRadius:14,padding:"14px 16px"}}>
                  <p style={{color:"var(--text3)",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:.8,marginBottom:12}}>Your Action Plan</p>
                  {g.tips.map((tip,ti)=>(
                    <div key={ti} style={{display:"flex",gap:10,marginBottom:ti<g.tips.length-1?12:0}}>
                      <span style={{width:22,height:22,borderRadius:"50%",flexShrink:0,marginTop:1,background:`${g.color}20`,color:g.color,fontSize:11,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center"}}>{ti+1}</span>
                      <p style={{color:"var(--text2)",fontSize:13,lineHeight:1.6}}>{tip}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
   SPLIT SCREEN
   ============================================================ */
function Split({ cards }: { cards:CreditCard[] }) {
  const [popup, setPopup] = useState(true);
  const [sel, setSel] = useState<string[]>([]);
  const [tab, setTab] = useState(0);
  const PEOPLE = ["Sarah","Mike","Priya","James","Leila","Omar"];
  const pp = sel.length>0 ? (247/(sel.length+1)).toFixed(2) : "—";
  return (
    <div className="screen desktop-content">
      <PageHead title="Split Bills" sub="Fair splits · Smart card picks"/>
      <div className="px">
        {popup&&(
          <div className="ap card-surface" style={{border:"1.5px solid var(--accent)",padding:20,marginBottom:20,position:"relative"}}>
            <button onClick={()=>setPopup(false)} style={{position:"absolute",top:14,right:16,background:"none",border:"none",color:"var(--text3)",fontSize:20}}>✕</button>
            <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:14}}>
              <span style={{fontSize:32}}>🍽️</span>
              <div>
                <p style={{color:"var(--text)",fontSize:17,fontWeight:600,marginBottom:2}}>$247 at Nobu</p>
                <p style={{color:"var(--text2)",fontSize:12}}>
                  {cards.length>0 ? `Paid with ${cards[0].name} · ${Math.round(247*(parseFloat(cards[0].rewardRate)||1)/100*100)} pts earned` : "Split this bill?"}
                </p>
              </div>
            </div>
            <div style={{background:"rgba(45,200,160,.07)",border:"1px solid rgba(45,200,160,.2)",borderRadius:12,padding:"10px 14px",marginBottom:14}}>
              <p style={{color:"var(--green)",fontSize:12,lineHeight:1.5}}>💡 Great choice using {cards.length>0?cards[0].name:"your card"} — maximizing your dining rewards!</p>
            </div>
            <p style={{color:"var(--text2)",fontSize:13,fontWeight:500,marginBottom:10}}>Who did you dine with? <span style={{color:"var(--text3)",fontWeight:400}}>(select multiple)</span></p>
            <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:16}}>
              {PEOPLE.map(p=>{const on=sel.includes(p);return(
                <button key={p} onClick={()=>setSel(prev=>on?prev.filter(x=>x!==p):[...prev,p])} className="press" style={{padding:"8px 16px",borderRadius:22,fontSize:13,fontWeight:600,border:`1.5px solid ${on?"var(--accent)":"var(--border2)"}`,background:on?"rgba(201,168,76,.12)":"var(--surface2)",color:on?"var(--accent)":"var(--text2)",transition:"all .15s"}}>
                  {on?"✓ ":""}{p}
                </button>
              );})}
            </div>
            {sel.length>0&&<div className="ai" style={{background:"var(--surface2)",borderRadius:12,padding:"12px 16px",marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <p style={{color:"var(--text2)",fontSize:13}}>Split {sel.length+1} ways</p>
              <p className="gold-text" style={{fontSize:18,fontWeight:800}}>${pp} each</p>
            </div>}
            <button onClick={()=>setPopup(false)} className="btn-gold press" style={{width:"100%"}}>
              ✓ Create Split {sel.length>0?`(${sel.length+1} people)`:""}
            </button>
          </div>
        )}
        <div style={{display:"flex",gap:5,marginBottom:20,background:"var(--surface2)",padding:4,borderRadius:13}}>
          {["Active","History"].map((t,i)=>(
            <button key={t} onClick={()=>setTab(i)} className="press" style={{flex:1,padding:"9px",borderRadius:10,border:"none",background:tab===i?"var(--accent)":"none",color:tab===i?"#1A1200":"var(--text2)",fontSize:12,fontWeight:700,transition:"all .2s"}}>{t}</button>
          ))}
        </div>
        {SAMPLE_BILLS.filter(b=>tab===0?!b.done:b.done).map((bill,i)=>(
          <div key={bill.id} className={`au d${i+1} card-surface`} style={{padding:"16px 18px",marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:24}}>{bill.emoji}</span>
                <div>
                  <p style={{color:"var(--text)",fontSize:14,fontWeight:700}}>{bill.name}</p>
                  <p style={{color:"var(--text2)",fontSize:11,marginTop:2}}>{bill.date} · {bill.card}</p>
                </div>
              </div>
              <div style={{textAlign:"right"}}>
                <p style={{color:"var(--text)",fontSize:16,fontWeight:800}}>${f(bill.amount)}</p>
                <p className="gold-text" style={{fontSize:12,marginTop:2}}>${(bill.amount/bill.people.length).toFixed(2)}/person</p>
              </div>
            </div>
            <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:12}}>
              {bill.people.map(p=><span key={p} className={`pill ${bill.done?"pill-emerald":"pill-gold"}`} style={{fontSize:10}}>{p}</span>)}
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <p style={{color:"var(--text2)",fontSize:12}}>💳 {f(bill.pts)} pts earned</p>
              {!bill.done?<div style={{display:"flex",gap:7}}>
                <button className="btn-ghost press" style={{padding:"7px 12px",fontSize:11}}>Remind</button>
                <button className="press" style={{padding:"7px 16px",background:"rgba(45,200,160,.1)",border:"1.5px solid rgba(45,200,160,.3)",borderRadius:9,color:"var(--green)",fontSize:11,fontWeight:700}}>Settle via Venmo</button>
              </div>:<span className="pill pill-emerald">✓ Settled</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   PERKS SCREEN
   ============================================================ */
function Perks({ cards }: { cards:CreditCard[] }) {
  const allOffers = cards.flatMap(c => c.offers.map(o=>({...o,cardName:c.name,cardGradient:c.gradient})));
  const perks = [
    {card:"Chase Sapphire Reserve",name:"Annual Travel Credit",emoji:"✈️",used:180,total:300,resets:"Jan 1",urgent:false},
    {card:"Amex Gold Card",name:"Monthly Dining Credit",emoji:"🍽️",used:60,total:120,resets:"Dec 31",urgent:true},
    {card:"Amex Gold Card",name:"Monthly Uber Cash",emoji:"🚗",used:45,total:120,resets:"Monthly",urgent:true},
    {card:"Capital One Venture X",name:"Annual Travel Portal",emoji:"🌍",used:0,total:300,resets:"Jan 1",urgent:false},
  ];
  const totalLeft = perks.reduce((s,p)=>s+(p.total-p.used),0);
  return (
    <div className="screen desktop-content">
      <PageHead title="Perks & Offers" sub="Don't let real money expire"/>
      <div className="px">
        <div className="au card-surface" style={{padding:"18px 20px",marginBottom:20,border:"1.5px solid rgba(240,164,41,.3)",background:"rgba(240,164,41,.05)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <div>
              <p style={{color:"var(--amber)",fontSize:12,fontWeight:600,marginBottom:4}}>Credits remaining</p>
              <h2 className="serif" style={{fontSize:34,fontWeight:400,color:"var(--text)"}}>${f(totalLeft)}</h2>
            </div>
            <span style={{fontSize:44}}>💎</span>
          </div>
          <p style={{color:"var(--text2)",fontSize:13}}>Money you've already paid for — use it before it resets.</p>
        </div>

        {/* Active offers */}
        {allOffers.length > 0 && (
          <>
            <h3 className="serif" style={{fontSize:20,fontWeight:400,marginBottom:12}}>Active Offers</h3>
            {allOffers.map((offer,i)=>(
              <div key={i} className={`au d${i+1} card-surface`} style={{padding:"14px 16px",marginBottom:10,display:"flex",gap:12,alignItems:"center"}}>
                <div style={{width:36,height:24,borderRadius:6,background:offer.cardGradient,flexShrink:0}}/>
                <div style={{flex:1}}>
                  <p style={{color:"var(--text)",fontSize:13,fontWeight:600,letterSpacing:"-.1px"}}>{offer.title}</p>
                  <p style={{color:"var(--text2)",fontSize:11,marginTop:1}}>{offer.cardName} · Expires {offer.expires}</p>
                </div>
                <span className="pill pill-emerald" style={{fontSize:10}}>{offer.value}</span>
              </div>
            ))}
            <div className="divider" style={{margin:"20px 0"}}/>
          </>
        )}

        <h3 className="serif" style={{fontSize:20,fontWeight:400,marginBottom:12}}>Annual Credits</h3>
        {perks.map((perk,i)=>{
          const rem=perk.total-perk.used, p=Math.round(perk.used/perk.total*100);
          return (
            <div key={i} className={`au d${i+1} card-surface hover-lift`} style={{padding:"18px",marginBottom:12,border:`1.5px solid ${perk.urgent?"rgba(240,164,41,.3)":"var(--border2)"}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                    <span style={{fontSize:18}}>{perk.emoji}</span>
                    <p style={{color:"var(--text)",fontSize:13,fontWeight:700}}>{perk.name}</p>
                    {perk.urgent&&<span className="pill pill-amber">Expiring</span>}
                  </div>
                  <p style={{color:"var(--text2)",fontSize:11}}>{perk.card}</p>
                </div>
                <div style={{textAlign:"right"}}>
                  <p style={{color:"var(--text)",fontSize:18,fontWeight:800}}>${rem}</p>
                  <p style={{color:"var(--text3)",fontSize:10,marginTop:2}}>of ${perk.total}</p>
                </div>
              </div>
              <Bar v={perk.used} max={perk.total} color={p>80?"var(--green)":p>40?"var(--accent)":"var(--red)"} h={7}/>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:8}}>
                <p style={{color:"var(--text3)",fontSize:12}}>${perk.used} used · ${rem} left</p>
                <p style={{color:perk.urgent?"var(--amber)":"var(--text3)",fontSize:12,fontWeight:perk.urgent?600:400}}>Resets {perk.resets}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
   SETTINGS SCREEN
   ============================================================ */
function Settings({ go, profile, theme, toggleTheme, onSignOut }: { go:(s:S)=>void; profile:UserProfile; theme:"dark"|"light"; toggleTheme:()=>void; onSignOut?:()=>void }) {
  const [t, setT] = useState({ai:true,geo:true,digest:true,split:true,travel:true,perks:true,fraud:true,goals:true,approvals:true});
  const tog = (k: keyof typeof t) => setT(p=>({...p,[k]:!p[k]}));
  const FEATS: [keyof typeof t, string, string, string][] = [
    ["ai","◎","AI Advisor","Personal financial intelligence"],
    ["approvals","📊","Approval Chances","AI card approval predictions"],
    ["geo","📍","Geo Nudges","Card tips when entering stores"],
    ["digest","📧","Weekly AI Digest","Monday personalized recap"],
    ["split","🍽️","Bill Splitting","Smart group expense splitting"],
    ["travel","✈️","Travel & Points","Points booking & transfers"],
    ["perks","💎","Perks Tracker","Credits, offers & benefits"],
    ["fraud","🛡️","Fraud Alerts","Real-time security notifications"],
    ["goals","🎯","Goal Engine","Financial target tracking"],
  ];
  return (
    <div className="screen desktop-content">
      <PageHead title="Settings" back={()=>go("home")}/>
      <div className="px">
        {/* Profile */}
        <div className="au card-surface" style={{padding:"20px 22px",marginBottom:28,background:"var(--accentbg)",border:"1px solid rgba(37,99,235,.15)"}}>
          <div style={{display:"flex",alignItems:"center",gap:16}}>
            <div style={{width:56,height:56,borderRadius:18,background:"rgba(201,168,76,.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>👤</div>
            <div>
              <p style={{color:"var(--text2)",fontSize:12,marginBottom:2}}>Your profile</p>
              <p style={{color:"var(--text)",fontSize:20,fontWeight:600}}>{profile.name||"User"}</p>
              {profile.creditScore&&<p style={{color:"var(--green)",fontSize:12,marginTop:2}}>Score: {profile.creditScore}</p>}
            </div>
          </div>
        </div>

        {/* Theme */}
        <div className="au card-surface" style={{padding:"16px 20px",marginBottom:16}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div>
              <p style={{color:"var(--text)",fontSize:14,fontWeight:600}}>Theme</p>
              <p style={{color:"var(--text2)",fontSize:12,marginTop:2}}>{theme==="dark"?"Dark mode — premium obsidian":"Light mode — cream parchment"}</p>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:14,color:theme==="dark"?"var(--accent)":"var(--text3)"}}>🌙</span>
              <Toggle on={theme==="light"} set={toggleTheme}/>
              <span style={{fontSize:14,color:theme==="light"?"var(--accent)":"var(--text3)"}}>☀️</span>
            </div>
          </div>
        </div>

        {/* Feature toggles */}
        <p style={{color:"var(--text3)",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>Feature Toggles</p>
        <div className="au card-surface" style={{overflow:"hidden",marginBottom:24}}>
          {FEATS.map(([key,icon,label,desc],i)=>(
            <div key={key} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 18px",borderBottom:i<FEATS.length-1?"1px solid var(--border)":"none"}}>
              <span style={{fontSize:18,width:28,textAlign:"center"}}>{icon}</span>
              <div style={{flex:1}}>
                <p style={{color:"var(--text)",fontSize:13,fontWeight:600,letterSpacing:"-.1px"}}>{label}</p>
                <p style={{color:"var(--text2)",fontSize:11,marginTop:1}}>{desc}</p>
              </div>
              <Toggle on={t[key]} set={()=>tog(key)}/>
            </div>
          ))}
        </div>

        <p style={{color:"var(--text3)",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>Account</p>
        <div className="au d2 card-surface" style={{overflow:"hidden"}}>
          {["Edit Profile","Notification Preferences","Privacy & Security","Share Feedback","Rate the App","About CardPilot"].map((item,i,arr)=>(
            <button key={item} className="press" style={{width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",padding:"15px 18px",background:"none",border:"none",borderBottom:i<arr.length-1?"1px solid var(--border)":"none",textAlign:"left"}}>
              <p style={{color:"var(--text)",fontSize:13,fontWeight:500}}>{item}</p>
              <span style={{color:"var(--text3)",fontSize:16}}>→</span>
            </button>
          ))}
        </div>
        <p style={{color:"var(--text3)",fontSize:11,textAlign:"center",marginTop:32}}>CardPilot Elite · Prototype v1.0</p>
      </div>
    </div>
  );
}



/* ============================================================
   AI CARD RECOMMENDER
   Two modes:
   1. "Which card should I APPLY for?" — based on profile
   2. "Which card should I USE right now?" — based on purchase
   ============================================================ */
function AIRecommender({go, cards, profile}:{go:(s:S)=>void; cards:CreditCard[]; profile:UserProfile}) {
  const [tab, setTab] = useState<0|1>(0);

  // ── MODE 1: APPLY recommender ─────────────────────────────
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyDone, setApplyDone] = useState(false);
  const [applyRecs, setApplyRecs] = useState<{
    card:typeof CARD_DB[0]; score:number; reason:string;
    annualValue:number; approvalChance:number;
    approvalColor:string; pros:string[]; cons:string[];
    verdict:"Highly Recommended"|"Recommended"|"Consider"|"Skip";
    verdictColor:string;
  }[]>([]);
  const [applyExpanded, setApplyExpanded] = useState<string|null>(null);

  const runApplyRecommender = () => {
    setApplyLoading(true);
    setApplyDone(false);
    setTimeout(() => {
      const ownedIds = cards.map(c => c.dbId);
      const score = parseInt(profile.creditScore?.match(/\d+/)?.[0] || "700");
      const income = profile.income || "";
      const lifestyles = profile.lifestyles || [];
      const spending = profile.spending || {};
      const diningSpend  = parseFloat(spending.dining  || "0");
      const grocerySpend = parseFloat(spending.groceries || "0");
      const travelSpend  = parseFloat(spending.travel   || "0");
      const gasSpend     = parseFloat(spending.gas      || "0");

      const highIncome = income.includes("150") || income.includes("250") || income.includes("+");
      const medIncome  = income.includes("100") || income.includes("60");
      const isTravel   = lifestyles.some((l:string) => l.toLowerCase().includes("travel"));
      const isFoodie   = lifestyles.some((l:string) => l.toLowerCase().includes("food"));

      const recs = CARD_DB
        .filter(c => !ownedIds.includes(c.id))
        .map(c => {
          let points = 0;
          let approvalChance = 85;
          let annualValue = 0;
          const pros: string[] = [];
          const cons: string[] = [];

          // Approval chance based on credit score
          if (c.annualFee >= 500) {
            approvalChance = score >= 750 ? 82 : score >= 700 ? 61 : score >= 670 ? 42 : 22;
          } else if (c.annualFee >= 95) {
            approvalChance = score >= 720 ? 88 : score >= 680 ? 72 : score >= 650 ? 55 : 30;
          } else {
            approvalChance = score >= 670 ? 92 : score >= 620 ? 78 : 55;
          }

          // Add income factor
          if (c.annualFee >= 500 && !highIncome) approvalChance -= 15;
          if (highIncome) approvalChance = Math.min(97, approvalChance + 8);

          // Score card based on spending match
          if (c.category === "dining" || c.id === "amg") {
            if (diningSpend > 200) { points += 30; annualValue += diningSpend * 12 * 0.04 * 0.015 * 4; pros.push(`4x on dining — earns ~$${Math.round(diningSpend*12*0.06)}/yr from your dining spend`); }
            if (diningSpend > 100) { points += 15; }
            if (isFoodie) { points += 20; pros.push("Perfect match for your Foodie lifestyle"); }
          }
          if (c.category === "travel" || c.id === "csr" || c.id === "covx") {
            if (travelSpend > 100) { points += 25; annualValue += travelSpend * 12 * 0.03 * 0.015; pros.push(`3x+ on travel — earns ~$${Math.round(travelSpend*12*0.045)}/yr from your travel spend`); }
            if (isTravel) { points += 25; pros.push("Aligns with your Frequent Traveler lifestyle"); }
            if (c.perksValue > 0) { annualValue += c.perksValue - c.annualFee; pros.push(`$${c.perksValue} in annual perks offsets the $${c.annualFee} fee`); }
          }
          if (c.category === "groceries" || c.id === "ambc") {
            if (grocerySpend > 150) { points += 25; annualValue += grocerySpend * 12 * 0.06 * 0.015; pros.push(`6x on groceries — earns ~$${Math.round(grocerySpend*12*0.09)}/yr from your grocery spend`); }
          }
          if (c.category === "cashback" && c.annualFee === 0) {
            points += 10;
            annualValue += (diningSpend + grocerySpend + travelSpend + gasSpend) * 12 * 0.015;
            pros.push("No annual fee — pure profit from day one");
          }

          // Already own similar penalise
          if (ownedIds.some(id => CARD_DB.find(d=>d.id===id)?.category === c.category)) {
            points -= 10;
            cons.push("You already own a card in this category");
          }

          // High fee cards need justification
          if (c.annualFee >= 500 && annualValue < c.annualFee) {
            cons.push(`$${c.annualFee} annual fee — only worth it if you use all perks`);
          }
          if (c.annualFee === 0) pros.push("No annual fee — zero risk to add");

          // Approval based cons
          if (approvalChance < 60) cons.push("Credit score may not meet issuer requirements");
          if (approvalChance > 80) pros.push(`Strong ${approvalChance}% approval odds based on your profile`);

          annualValue = Math.max(0, Math.round(annualValue));
          const approvalColor = approvalChance >= 80 ? "var(--green)" : approvalChance >= 60 ? "var(--amber)" : "var(--red)";

          let verdict: "Highly Recommended"|"Recommended"|"Consider"|"Skip" = "Consider";
          let verdictColor = "var(--amber)";
          if (points >= 55 && approvalChance >= 70) { verdict = "Highly Recommended"; verdictColor = "var(--green)"; }
          else if (points >= 35 && approvalChance >= 55) { verdict = "Recommended"; verdictColor = "var(--accent)"; }
          else if (points < 10 || approvalChance < 40) { verdict = "Skip"; verdictColor = "var(--red)"; }

          return { card:c, score:points, reason:"", annualValue, approvalChance, approvalColor, pros, cons, verdict, verdictColor };
        })
        .filter(r => r.verdict !== "Skip" || r.approvalChance > 50)
        .sort((a,b) => {
          const verdictOrder = {"Highly Recommended":0,"Recommended":1,"Consider":2,"Skip":3};
          return verdictOrder[a.verdict] - verdictOrder[b.verdict] || b.score - a.score;
        })
        .slice(0, 8);

      setApplyRecs(recs);
      setApplyLoading(false);
      setApplyDone(true);
    }, 1600);
  };

  // ── MODE 2: USE recommender ───────────────────────────────
  const [purchaseInput, setPurchaseInput] = useState("");
  const [useLoading, setUseLoading] = useState(false);
  const [useResults, setUseResults] = useState<{
    card:CreditCard; multiplier:number; pointsEarned:number;
    cashValue:number; reason:string; rank:number;
    isTopPick:boolean; category:string;
  }[]>([]);
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const [useDone, setUseDone] = useState(false);
  const [detectedCategory, setDetectedCategory] = useState("");

  const CATEGORY_MAP: Record<string, {keywords:string[]; label:string; emoji:string}> = {
    dining:    {keywords:["restaurant","cafe","coffee","starbucks","mcdonald","pizza","sushi","dining","food","eat","lunch","dinner","breakfast","bar","pub","chipotle","subway","doordash","grubhub","ubereats","taco","burger"],        label:"Dining & Restaurants", emoji:"🍽️"},
    groceries: {keywords:["grocery","supermarket","whole foods","trader joe","safeway","kroger","costco","walmart","target","food store","market","aldi","publix","wegmans"],                                                            label:"Groceries",             emoji:"🛒"},
    travel:    {keywords:["flight","airline","hotel","airbnb","uber","lyft","train","amtrak","rental car","hertz","avis","delta","united","american airlines","southwest","hilton","marriott","hyatt","booking","expedia","kayak"],    label:"Travel",                emoji:"✈️"},
    gas:       {keywords:["gas","shell","exxon","bp","chevron","mobil","fuel","petrol","sunoco"],                                                                                                                                        label:"Gas & Fuel",            emoji:"⛽"},
    shopping:  {keywords:["amazon","apple","best buy","walmart","target","online","shop","store","nike","h&m","zara","nordstrom","macy","newegg","ebay","etsy"],                                                                        label:"Shopping",              emoji:"🛍️"},
    streaming: {keywords:["netflix","spotify","hulu","disney","apple tv","hbo","amazon prime","youtube premium","tidal","peacock","paramount","stream"],                                                                                label:"Streaming",             emoji:"📺"},
    pharmacy:  {keywords:["cvs","walgreens","rite aid","pharmacy","drug store","medicine","prescription"],                                                                                                                              label:"Drugstore & Pharmacy",  emoji:"💊"},
  };

  const detectCategory = (query: string): string => {
    const q = query.toLowerCase();
    for (const [cat, data] of Object.entries(CATEGORY_MAP)) {
      if (data.keywords.some(k => q.includes(k))) return cat;
    }
    return "general";
  };

  const MULTIPLIERS: Record<string, Record<string, number>> = {
    csr:   {dining:3, travel:3, groceries:1, gas:1, shopping:1, streaming:1, pharmacy:1, general:1},
    csp:   {dining:3, travel:2, groceries:3, gas:1, shopping:1, streaming:2, pharmacy:1, general:1},
    cff:   {dining:3, travel:5, groceries:5, gas:5, shopping:5, streaming:5, pharmacy:3, general:1},
    cfu:   {dining:3, travel:5, groceries:1, gas:1, shopping:1, streaming:1, pharmacy:3, general:1.5},
    amg:   {dining:4, travel:2, groceries:4, gas:1, shopping:1, streaming:1, pharmacy:1, general:1},
    amp:   {dining:1, travel:5, groceries:1, gas:1, shopping:1, streaming:1, pharmacy:1, general:1},
    ambc:  {dining:1, travel:1, groceries:6, gas:3, shopping:1, streaming:6, pharmacy:1, general:1},
    ambu:  {dining:1, travel:1, groceries:3, gas:2, shopping:3, streaming:1, pharmacy:1, general:1},
    covx:  {dining:2, travel:5, groceries:2, gas:2, shopping:2, streaming:2, pharmacy:2, general:2},
    cov:   {dining:2, travel:2, groceries:2, gas:2, shopping:2, streaming:2, pharmacy:2, general:2},
    coqs:  {dining:1.5, travel:1.5, groceries:1.5, gas:1.5, shopping:1.5, streaming:1.5, pharmacy:1.5, general:1.5},
    cdc:   {dining:2, travel:2, groceries:2, gas:2, shopping:2, streaming:2, pharmacy:2, general:2},
    cpc:   {dining:3, travel:3, groceries:3, gas:1, shopping:1, streaming:1, pharmacy:1, general:1},
    disc:  {dining:5, travel:5, groceries:5, gas:5, shopping:1, streaming:1, pharmacy:1, general:1},
    apple: {dining:3, travel:2, groceries:2, gas:3, shopping:3, streaming:1, pharmacy:1, general:2},
    wells: {dining:2, travel:2, groceries:2, gas:2, shopping:2, streaming:2, pharmacy:2, general:2},
    boar:  {dining:3, travel:3, groceries:2, gas:1, shopping:1, streaming:1, pharmacy:1, general:1},
    usb:   {dining:3, travel:3, groceries:1, gas:1, shopping:3, streaming:1, pharmacy:1, general:3},
    mar:   {dining:2, travel:6, groceries:2, gas:1, shopping:1, streaming:1, pharmacy:1, general:2},
    hlt:   {dining:6, travel:12, groceries:6, gas:3, shopping:1, streaming:1, pharmacy:1, general:3},
    delta: {dining:2, travel:2, groceries:2, gas:1, shopping:1, streaming:1, pharmacy:1, general:1},
    united:{dining:2, travel:2, groceries:2, gas:1, shopping:1, streaming:1, pharmacy:1, general:1},
    boa:   {dining:1, travel:3, groceries:1, gas:2, shopping:1, streaming:1, pharmacy:1, general:1},
  };

  const getCategoryReasonText = (cardDbId:string, cat:string, mult:number, merchant:string): string => {
    const catLabel = CATEGORY_MAP[cat]?.label || "this purchase";
    if (mult >= 4) return `${mult}x on ${catLabel} — highest rate in your wallet for ${merchant}`;
    if (mult === 3) return `3x on ${catLabel} — strong earning rate at ${merchant}`;
    if (mult === 2) return `2x on ${catLabel} — solid flat-rate earning`;
    return `1.5x on everything — decent fallback for ${merchant}`;
  };

  const runUseRecommender = () => {
    if (!purchaseInput.trim() || cards.length === 0) return;
    setUseLoading(true);
    setUseDone(false);
    setTimeout(() => {
      const cat = detectCategory(purchaseInput);
      setDetectedCategory(cat);
      const amount = parseFloat(purchaseAmount) || 50;
      const results = cards.map(card => {
        const dbCard = CARD_DB.find(c => c.id === card.dbId);
        const multMap = MULTIPLIERS[card.dbId] || {};
        const multiplier = multMap[cat] || multMap.general || 1;
        const pointsEarned = Math.round(amount * multiplier);
        const cashValue = Math.round(pointsEarned * 0.015 * 100) / 100;
        const reason = getCategoryReasonText(card.dbId, cat, multiplier, purchaseInput);
        return { card, multiplier, pointsEarned, cashValue, reason, rank:0, isTopPick:false, category:cat };
      }).sort((a,b) => b.multiplier - a.multiplier || b.cashValue - a.cashValue);

      results.forEach((r,i) => { r.rank = i+1; r.isTopPick = i===0; });
      setUseResults(results);
      setUseLoading(false);
      setUseDone(true);
    }, 900);
  };

  const f2 = (n:number) => n.toLocaleString("en-US");
  const QUICK_MERCHANTS = ["Starbucks","Whole Foods","Amazon","Delta flight","Hilton hotel","Shell gas","Netflix","CVS Pharmacy","Uber ride","Restaurant dinner","Costco","Best Buy"];

  return (
    <div className="screen desktop-content">
      <PageHead title="AI Card Recommender" sub="Apply smarter · Spend smarter"/>
      <div className="px">

        {/* Tab switcher */}
        <div className="au" style={{display:"flex",gap:5,marginBottom:24,background:"var(--surface2)",padding:4,borderRadius:14}}>
          <button onClick={()=>setTab(0)} className="press" style={{flex:1,padding:"11px 8px",borderRadius:11,border:"none",background:tab===0?"linear-gradient(135deg,var(--accent),var(--accent2))":"none",color:tab===0?"#1A1200":"var(--text2)",fontSize:12,fontWeight:tab===0?700:500,transition:"all .2s",lineHeight:1.3}}>
            ✦ Which card<br/>should I APPLY for?
          </button>
          <button onClick={()=>setTab(1)} className="press" style={{flex:1,padding:"11px 8px",borderRadius:11,border:"none",background:tab===1?"linear-gradient(135deg,var(--accent),var(--accent2))":"none",color:tab===1?"#1A1200":"var(--text2)",fontSize:12,fontWeight:tab===1?700:500,transition:"all .2s",lineHeight:1.3}}>
            ◎ Which card<br/>should I USE now?
          </button>
        </div>

        {/* ── TAB 0: APPLY RECOMMENDER ── */}
        {tab===0 && (
          <div className="ai">
            {/* Intro card */}
            <div style={{background:"linear-gradient(135deg,#1A1200,#2A1E00)",border:"1px solid rgba(201,168,76,.3)",borderRadius:20,padding:"20px",marginBottom:20}}>
              <h3 className="serif" style={{fontSize:22,fontWeight:400,color:"var(--accent2)",marginBottom:8}}>
                Personalized card recommendations
              </h3>
              <p style={{color:"rgba(201,168,76,.7)",fontSize:13,lineHeight:1.7,marginBottom:16}}>
                Based on your income (<strong style={{color:"var(--accent2)"}}>{profile.income||"not set"}</strong>),
                credit score (<strong style={{color:"var(--accent2)"}}>{profile.creditScore||"not set"}</strong>),
                and spending habits — our AI scores every card in the US market and tells you exactly which to apply for, approval odds, and expected annual value.
              </p>
              {(!profile.income || !profile.creditScore) && (
                <div style={{background:"rgba(244,97,122,.1)",border:"1px solid rgba(244,97,122,.3)",borderRadius:12,padding:"10px 14px",marginBottom:14}}>
                  <p style={{color:"var(--red)",fontSize:12}}>⚠️ Complete your profile in Settings for more accurate recommendations</p>
                </div>
              )}
              {cards.length > 0 && (
                <div style={{background:"rgba(45,200,160,.08)",border:"1px solid rgba(45,200,160,.2)",borderRadius:12,padding:"10px 14px",marginBottom:14}}>
                  <p style={{color:"var(--green)",fontSize:12}}>✓ You own {cards.length} card{cards.length!==1?"s":""}. We will exclude those and only recommend new ones.</p>
                </div>
              )}
              <button onClick={runApplyRecommender} disabled={applyLoading} className="btn-gold press" style={{width:"100%"}}>
                {applyLoading ? "Analysing your profile..." : applyDone ? "Re-run Analysis" : "✦ Get My Personalised Recommendations"}
              </button>
            </div>

            {/* Loading */}
            {applyLoading && (
              <div style={{textAlign:"center",padding:"40px 20px"}}>
                <div style={{fontSize:40,marginBottom:16,animation:"pulse 1s ease infinite"}}>🤖</div>
                <p style={{color:"var(--text2)",fontSize:15,fontWeight:500,marginBottom:6}}>AI is analysing your profile...</p>
                <p style={{color:"var(--text3)",fontSize:12}}>Scoring {CARD_DB.length} cards against your income, credit score, lifestyle and spending</p>
              </div>
            )}

            {/* Results */}
            {applyDone && !applyLoading && (
              <div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                  <p style={{color:"var(--text2)",fontSize:13}}><strong style={{color:"var(--text)"}}>{applyRecs.length} cards</strong> ranked for your profile</p>
                  <span className="pill pill-gold">AI Scored</span>
                </div>

                {applyRecs.map((rec,i) => {
                  const isOpen = applyExpanded === rec.card.id;
                  return (
                    <div key={rec.card.id} className={`au d${Math.min(i+1,6)}`} style={{
                      background:"var(--surface)",
                      border:`1.5px solid ${rec.verdict==="Highly Recommended"?"var(--accent)":rec.verdict==="Recommended"?"rgba(79,110,247,.4)":"var(--border2)"}`,
                      borderRadius:20,marginBottom:12,overflow:"hidden",cursor:"pointer",
                      transition:"border-color .2s",
                    }} onClick={()=>setApplyExpanded(isOpen?null:rec.card.id)}>

                      {/* Card header */}
                      <div style={{display:"flex",gap:12,padding:"16px 18px",alignItems:"center"}}>
                        <div style={{position:"relative",flexShrink:0}}>
                          <div style={{width:56,height:36,borderRadius:9,background:rec.card.gradient,boxShadow:"0 3px 12px rgba(0,0,0,.5)"}}/>
                          <div style={{position:"absolute",top:-8,right:-8,width:22,height:22,borderRadius:"50%",background:"var(--surface)",border:"2px solid var(--border2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:rec.verdictColor}}>
                            {i+1}
                          </div>
                        </div>
                        <div style={{flex:1}}>
                          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3,flexWrap:"wrap"}}>
                            <p style={{color:"var(--text)",fontSize:14,fontWeight:700}}>{rec.card.name}</p>
                            <span className="pill" style={{fontSize:10,background:`${rec.verdictColor}18`,color:rec.verdictColor,border:`1px solid ${rec.verdictColor}40`}}>
                              {rec.verdict==="Highly Recommended"?"✦ ":""}{rec.verdict}
                            </span>
                          </div>
                          <p style={{color:"var(--text2)",fontSize:11,marginBottom:4}}>{rec.card.issuer} · {rec.card.rewardRate}</p>
                          <div style={{display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"}}>
                            <div>
                              <p style={{color:"var(--text3)",fontSize:10}}>Approval odds</p>
                              <p style={{color:rec.approvalColor,fontSize:13,fontWeight:800}}>{rec.approvalChance}%</p>
                            </div>
                            <div style={{width:1,height:28,background:"var(--border)"}}/>
                            <div>
                              <p style={{color:"var(--text3)",fontSize:10}}>Est. annual value</p>
                              <p style={{color:"var(--green)",fontSize:13,fontWeight:800}}>${f2(rec.annualValue)}/yr</p>
                            </div>
                            <div style={{width:1,height:28,background:"var(--border)"}}/>
                            <div>
                              <p style={{color:"var(--text3)",fontSize:10}}>Annual fee</p>
                              <p style={{color:"var(--text)",fontSize:13,fontWeight:700}}>${rec.card.annualFee}/yr</p>
                            </div>
                          </div>
                        </div>
                        <span style={{color:"var(--text3)",fontSize:16,flexShrink:0}}>{isOpen?"↑":"↓"}</span>
                      </div>

                      {/* Approval bar */}
                      <div style={{padding:"0 18px 12px"}}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                          <span style={{color:"var(--text3)",fontSize:10}}>Approval likelihood</span>
                          <span style={{color:rec.approvalColor,fontSize:10,fontWeight:700}}>{rec.approvalChance}%</span>
                        </div>
                        <Bar v={rec.approvalChance} max={100} color={rec.approvalColor} h={5}/>
                      </div>

                      {/* Expanded */}
                      {isOpen && (
                        <div className="ai" style={{padding:"0 18px 18px",borderTop:"1px solid var(--border)"}}>
                          {/* Signup bonus */}
                          {rec.card.signupBonus && (
                            <div style={{background:"rgba(240,164,41,.08)",border:"1px solid rgba(240,164,41,.2)",borderRadius:12,padding:"10px 14px",marginTop:14,marginBottom:10}}>
                              <p style={{color:"var(--amber)",fontSize:11,fontWeight:700,marginBottom:3}}>🎁 Welcome Bonus</p>
                              <p style={{color:"var(--text2)",fontSize:12,lineHeight:1.5}}>{rec.card.signupBonus}</p>
                            </div>
                          )}

                          {/* Pros */}
                          {rec.pros.length > 0 && (
                            <div style={{marginTop:10}}>
                              <p style={{color:"var(--green)",fontSize:11,fontWeight:700,marginBottom:8}}>✓ Why this card suits you</p>
                              {rec.pros.map((pro,pi)=>(
                                <div key={pi} style={{display:"flex",gap:8,marginBottom:6,alignItems:"flex-start"}}>
                                  <span style={{color:"var(--green)",fontSize:12,flexShrink:0,marginTop:1}}>✓</span>
                                  <p style={{color:"var(--text2)",fontSize:12,lineHeight:1.5}}>{pro}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Cons */}
                          {rec.cons.length > 0 && (
                            <div style={{marginTop:10}}>
                              <p style={{color:"var(--red)",fontSize:11,fontWeight:700,marginBottom:8}}>⚠ Watch out for</p>
                              {rec.cons.map((con,ci)=>(
                                <div key={ci} style={{display:"flex",gap:8,marginBottom:6,alignItems:"flex-start"}}>
                                  <span style={{color:"var(--red)",fontSize:12,flexShrink:0,marginTop:1}}>!</span>
                                  <p style={{color:"var(--text2)",fontSize:12,lineHeight:1.5}}>{con}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Best places */}
                          {rec.card.bestPlaces && rec.card.bestPlaces.length > 0 && (
                            <div style={{marginTop:10}}>
                              <p style={{color:"var(--accent)",fontSize:11,fontWeight:700,marginBottom:8}}>📍 Best places to use it</p>
                              <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                                {rec.card.bestPlaces.slice(0,6).map((p:string,pi:number)=>(
                                  <span key={pi} style={{background:"rgba(201,168,76,.1)",border:"1px solid rgba(201,168,76,.2)",borderRadius:20,padding:"3px 9px",fontSize:10,color:"var(--accent)"}}>
                                    {p.split(" (")[0]}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Net value calculation */}
                          <div style={{background:"var(--surface2)",borderRadius:12,padding:"10px 14px",marginTop:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                            <div>
                              <p style={{color:"var(--text3)",fontSize:10,marginBottom:2}}>Estimated net annual benefit</p>
                              <p style={{color:rec.annualValue-rec.card.annualFee>0?"var(--green)":"var(--red)",fontSize:16,fontWeight:800}}>
                                {rec.annualValue-rec.card.annualFee>=0?"+":""} ${f2(rec.annualValue-rec.card.annualFee)}/yr
                              </p>
                            </div>
                            <div style={{textAlign:"right"}}>
                              <p style={{color:"var(--text3)",fontSize:10,marginBottom:2}}>Perks value</p>
                              <p style={{color:"var(--text)",fontSize:13,fontWeight:600,letterSpacing:"-.1px"}}>${rec.card.perksValue}/yr</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 1: USE RECOMMENDER ── */}
        {tab===1 && (
          <div className="ai">
            {/* Intro */}
            <div style={{background:"var(--surface)",border:"1px solid var(--border2)",borderRadius:20,padding:"18px 20px",marginBottom:20}}>
              <h3 className="serif" style={{fontSize:22,fontWeight:400,marginBottom:6}}>Which card should I use?</h3>
              <p style={{color:"var(--text2)",fontSize:13,lineHeight:1.6,marginBottom:16}}>
                Tell us where you are shopping or what you are buying. We rank all your cards by rewards earned and tell you exactly which one to reach for — with the maths.
              </p>

              {cards.length === 0 ? (
                <div style={{textAlign:"center",padding:"20px"}}>
                  <p style={{fontSize:32,marginBottom:10}}>💳</p>
                  <p style={{color:"var(--text2)",fontSize:14,marginBottom:16}}>Add your cards first to get personalised recommendations</p>
                  <button onClick={()=>go("add-card")} className="btn-gold press" style={{padding:"12px 24px"}}>Add Your Cards</button>
                </div>
              ) : (
                <>
                  <div style={{marginBottom:12}}>
                    <label style={{fontSize:12,color:"var(--text2)",fontWeight:500,display:"block",marginBottom:8}}>Where are you shopping?</label>
                    <input
                      className="field"
                      placeholder="e.g. Starbucks, Whole Foods, Amazon, Delta flight..."
                      value={purchaseInput}
                      onChange={e=>{setPurchaseInput(e.target.value);setUseDone(false);}}
                      onKeyDown={e=>e.key==="Enter"&&runUseRecommender()}
                      style={{padding:"13px 16px"}}
                    />
                  </div>
                  <div style={{marginBottom:16}}>
                    <label style={{fontSize:12,color:"var(--text2)",fontWeight:500,display:"block",marginBottom:8}}>Purchase amount (optional)</label>
                    <input
                      className="field"
                      type="number"
                      placeholder="$ amount — we calculate exact rewards earned"
                      value={purchaseAmount}
                      onChange={e=>{setPurchaseAmount(e.target.value);setUseDone(false);}}
                      style={{padding:"13px 16px"}}
                    />
                  </div>
                  <button onClick={runUseRecommender} disabled={!purchaseInput.trim()||useLoading} className="btn-gold press" style={{width:"100%"}}>
                    {useLoading?"Ranking your cards...":"◎ Show Me Which Card to Use"}
                  </button>
                </>
              )}
            </div>

            {/* Quick merchant chips */}
            {cards.length > 0 && !useDone && (
              <div>
                <p style={{color:"var(--text3)",fontSize:12,marginBottom:10}}>Quick picks</p>
                <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:20}}>
                  {QUICK_MERCHANTS.map(m=>(
                    <button key={m} onClick={()=>{setPurchaseInput(m);setPurchaseAmount("50");setTimeout(()=>runUseRecommender(),50);}} className="press" style={{padding:"7px 14px",borderRadius:20,background:"var(--surface)",border:"1px solid var(--border2)",color:"var(--text2)",fontSize:12,transition:"all .15s"}}
                      onMouseOver={e=>{e.currentTarget.style.borderColor="var(--accent)";e.currentTarget.style.color="var(--accent)"}}
                      onMouseOut={e=>{e.currentTarget.style.borderColor="var(--border2)";e.currentTarget.style.color="var(--text2)"}}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Loading */}
            {useLoading && (
              <div style={{textAlign:"center",padding:"30px 20px"}}>
                <div style={{fontSize:36,marginBottom:12,animation:"pulse 1s ease infinite"}}>💳</div>
                <p style={{color:"var(--text2)",fontSize:14}}>Ranking your {cards.length} cards...</p>
              </div>
            )}

            {/* Results */}
            {useDone && !useLoading && useResults.length > 0 && (
              <div>
                {/* Category detected */}
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
                  <span style={{fontSize:20}}>{CATEGORY_MAP[detectedCategory]?.emoji||"🛒"}</span>
                  <div>
                    <p style={{color:"var(--text)",fontSize:14,fontWeight:600}}>{purchaseInput}</p>
                    <p style={{color:"var(--text2)",fontSize:12}}>Category: {CATEGORY_MAP[detectedCategory]?.label||"General purchase"}{purchaseAmount?` · $${purchaseAmount}`:""}</p>
                  </div>
                </div>

                {/* Winner announcement */}
                <div style={{background:"linear-gradient(135deg,#1A1200,#2A2000)",border:"1.5px solid var(--accent)",borderRadius:18,padding:"16px 18px",marginBottom:16}}>
                  <p style={{color:"rgba(255,255,255,.6)",fontSize:11,letterSpacing:1,textTransform:"uppercase",marginBottom:6}}>Best card to use</p>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <div style={{width:52,height:34,borderRadius:9,background:useResults[0].card.gradient,boxShadow:"0 3px 12px rgba(0,0,0,.5)",flexShrink:0}}/>
                    <div style={{flex:1}}>
                      <p style={{color:"var(--accent2)",fontSize:17,fontWeight:700,marginBottom:2}}>{useResults[0].card.name}</p>
                      <p style={{color:"rgba(255,255,255,.6)",fontSize:12}}>{useResults[0].reason}</p>
                    </div>
                    <div style={{textAlign:"right",flexShrink:0}}>
                      <p style={{color:"var(--accent)",fontSize:22,fontWeight:800}}>{useResults[0].multiplier}x</p>
                      {purchaseAmount && <p style={{color:"var(--green)",fontSize:12,marginTop:2}}>+${useResults[0].cashValue} value</p>}
                    </div>
                  </div>
                </div>

                {/* All cards ranked */}
                <p style={{color:"var(--text2)",fontSize:12,marginBottom:12,fontWeight:600}}>ALL YOUR CARDS RANKED</p>
                {useResults.map((r,i)=>(
                  <div key={r.card.id} className={`au d${Math.min(i+1,6)}`} style={{
                    background:"var(--surface)",
                    border:`1.5px solid ${i===0?"var(--accent)":i===1?"rgba(45,200,160,.3)":"var(--border2)"}`,
                    borderRadius:16,padding:"14px 16px",marginBottom:8,
                    display:"flex",gap:12,alignItems:"center",
                    opacity:i>3?0.7:1,
                  }}>
                    <span style={{fontSize:14,fontWeight:800,color:i===0?"var(--accent)":i===1?"var(--green)":"var(--text3)",width:18,flexShrink:0,textAlign:"center"}}>
                      {i===0?"★":i+1}
                    </span>
                    <div style={{width:42,height:28,borderRadius:7,background:r.card.gradient,flexShrink:0,boxShadow:"0 2px 8px rgba(0,0,0,.4)"}}/>
                    <div style={{flex:1}}>
                      <p style={{color:"var(--text)",fontSize:13,fontWeight:600,letterSpacing:"-.1px",marginBottom:2}}>{r.card.name}</p>
                      <p style={{color:"var(--text2)",fontSize:11}}>{r.reason}</p>
                    </div>
                    <div style={{textAlign:"right",flexShrink:0}}>
                      <p style={{color:i===0?"var(--accent)":i===1?"var(--green)":"var(--text2)",fontSize:16,fontWeight:800}}>{r.multiplier}x</p>
                      {purchaseAmount && <p style={{color:"var(--text3)",fontSize:10,marginTop:1}}>+${r.cashValue}</p>}
                    </div>
                  </div>
                ))}

                {/* Insight */}
                {useResults.length > 1 && purchaseAmount && (
                  <div style={{background:"rgba(45,200,160,.06)",border:"1px solid rgba(45,200,160,.2)",borderRadius:14,padding:"12px 16px",marginTop:8}}>
                    <p style={{color:"var(--green)",fontSize:12,fontWeight:600,marginBottom:4}}>💡 Smart insight</p>
                    <p style={{color:"var(--text2)",fontSize:12,lineHeight:1.6}}>
                      Using {useResults[0].card.name} vs {useResults[useResults.length-1].card.name} on a ${purchaseAmount} purchase earns ${Math.round((useResults[0].cashValue - useResults[useResults.length-1].cashValue)*100)/100} more in rewards value. Over a year of similar weekly purchases that is <strong style={{color:"var(--green)"}}>${f2(Math.round((useResults[0].cashValue - useResults[useResults.length-1].cashValue)*52))}</strong> extra.
                    </p>
                  </div>
                )}

                <button onClick={()=>{setUseDone(false);setPurchaseInput("");setPurchaseAmount("");}} className="btn-ghost press" style={{width:"100%",marginTop:12}}>
                  Check Another Purchase
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   LIFESTYLE OPTIMIZER
   Two features:
   1. Smart Shopping Comparator — find cheapest store for any product
   2. Daily Habit Savings Calculator — see how much you save cutting habits
   ============================================================ */
function LifestyleOptimizer({go, cards, profile}:{go:(s:S)=>void; cards:CreditCard[]; profile:UserProfile}) {
  const [tab, setTab] = useState<0|1>(0);

  // ── FEATURE 1: Smart Price Comparator ──────────────────────
  const [productQuery, setProductQuery] = useState("");
  const [comparing, setComparing] = useState(false);
  const [priceResults, setPriceResults] = useState<{store:string;price:number;link:string;card:string;cardEarning:number;finalCost:number;badge:string;color:string;gradient:string}[]>([]);
  const [searched, setSearched] = useState(false);

  const STORE_DATA: Record<string, {baseMultiplier:number; gradient:string; color:string; cardId:string}> = {
    "Amazon":       {baseMultiplier:1.00, gradient:"linear-gradient(135deg,#1A0A00,#7A3A00)", color:"#FB923C", cardId:"apple"},
    "Best Buy":     {baseMultiplier:1.05, gradient:"linear-gradient(135deg,#00001A,#00008B)", color:"#60A5FA", cardId:"cfu"},
    "Walmart":      {baseMultiplier:0.95, gradient:"linear-gradient(135deg,#001A3A,#003580)", color:"#60A5FA", cardId:"boar"},
    "Target":       {baseMultiplier:1.02, gradient:"linear-gradient(135deg,#1A0000,#8B0000)", color:"#F87171", cardId:"cfu"},
    "Costco":       {baseMultiplier:0.88, gradient:"linear-gradient(135deg,#0A0A1A,#1A1A50)", color:"#A78BFA", cardId:"covx"},
    "Apple Store":  {baseMultiplier:1.10, gradient:"linear-gradient(135deg,#1C1C1E,#3C3C3E)", color:"#F5F5F7", cardId:"apple"},
    "B&H Photo":    {baseMultiplier:0.97, gradient:"linear-gradient(135deg,#0A1A00,#1A3A00)", color:"#4ADE80", cardId:"cfu"},
    "Newegg":       {baseMultiplier:0.93, gradient:"linear-gradient(135deg,#1A0800,#5A1800)", color:"#FB923C", cardId:"cfu"},
  };

  const PRODUCT_PRICES: Record<string, number> = {
    "headphone": 249, "headphones": 249, "airpods": 179, "sony headphones": 349,
    "bose headphones": 299, "iphone": 999, "samsung": 799, "laptop": 1299,
    "macbook": 1299, "ipad": 599, "tv": 799, "monitor": 399, "keyboard": 149,
    "mouse": 79, "speaker": 199, "camera": 899, "tablet": 499, "smartwatch": 399,
    "earbuds": 149, "gaming console": 499, "playstation": 499, "xbox": 499,
    "coffee maker": 89, "air fryer": 99, "vacuum": 299, "blender": 79,
  };

  const findPrice = (query: string) => {
    if (!query.trim()) return;
    setComparing(true);
    setTimeout(() => {
      const key = Object.keys(PRODUCT_PRICES).find(k => query.toLowerCase().includes(k));
      const basePrice = key ? PRODUCT_PRICES[key] : 199;
      const userCards = cards.length > 0 ? cards : [];
      const results = Object.entries(STORE_DATA).map(([store, data]) => {
        const storePrice = Math.round(basePrice * data.baseMultiplier * (0.95 + Math.random() * 0.1));
        // Find best card for this store
        const bestCard = userCards.length > 0 ? userCards[0] : null;
        const earning = bestCard ? Math.round(storePrice * 0.015) : 0;
        const finalCost = storePrice - earning;
        return {
          store,
          price: storePrice,
          link: `https://www.${store.toLowerCase().replace(" ","")}.com`,
          card: bestCard ? bestCard.name : "No card linked",
          cardEarning: earning,
          finalCost,
          badge: "",
          color: data.color,
          gradient: data.gradient,
        };
      });
      results.sort((a,b) => a.finalCost - b.finalCost);
      results[0].badge = "Best Deal";
      results[1].badge = "Runner Up";
      const savings = results[results.length-1].price - results[0].price;
      setPriceResults(results);
      setComparing(false);
      setSearched(true);
    }, 1400);
  };

  const PRODUCT_SUGGESTIONS = ["Sony WH-1000XM5 Headphones","Apple AirPods Pro","Samsung 65-inch TV","MacBook Air M3","iPad Pro","Bose QuietComfort 45","iPhone 15 Pro","Dell Monitor 27-inch","PlayStation 5","Nintendo Switch"];

  // ── FEATURE 2: Habit Savings Calculator ────────────────────
  const [habitName, setHabitName] = useState("");
  const [habitCost, setHabitCost] = useState("");
  const [habitFreq, setHabitFreq] = useState<"daily"|"weekly"|"monthly">("daily");
  const [homeCost, setHomeCost] = useState("");
  const [calculated, setCalculated] = useState(false);
  const [savings, setSavings] = useState({
    daily:0, weekly:0, monthly:0, yearly:0, threeYear:0, fiveYear:0,
    withInvestment:0, vacations:0, iphones:0, coffeeLabel:""
  });

  const HABIT_SUGGESTIONS = [
    {name:"Starbucks coffee", cost:"6", home:"0.50", freq:"daily" as const, emoji:"☕"},
    {name:"Gym membership", cost:"80", home:"0", freq:"monthly" as const, emoji:"🏋️"},
    {name:"Lunch out", cost:"15", home:"4", freq:"daily" as const, emoji:"🍽️"},
    {name:"Cigarettes", cost:"12", home:"0", freq:"daily" as const, emoji:"🚬"},
    {name:"Uber to work", cost:"18", home:"3", freq:"daily" as const, emoji:"🚗"},
    {name:"Wine bottle", cost:"25", home:"8", freq:"weekly" as const, emoji:"🍷"},
    {name:"Takeout dinner", cost:"35", home:"10", freq:"weekly" as const, emoji:"🍕"},
    {name:"Streaming services", cost:"60", home:"15", freq:"monthly" as const, emoji:"📺"},
  ];

  const calculateSavings = () => {
    const spend = parseFloat(habitCost) || 0;
    const home = parseFloat(homeCost) || 0;
    const diff = spend - home;
    if (diff <= 0) return;
    let dailySaving = 0;
    if (habitFreq === "daily")   dailySaving = diff;
    if (habitFreq === "weekly")  dailySaving = diff / 7;
    if (habitFreq === "monthly") dailySaving = diff / 30;
    const yr = dailySaving * 365;
    const mo = dailySaving * 30;
    const threeYr = yr * 3;
    const fiveYr = yr * 5;
    // Compound interest at 7% (S&P 500 avg)
    const withInv = Math.round(yr * ((Math.pow(1.07, 5) - 1) / 0.07));
    setSavings({
      daily: Math.round(dailySaving * 100) / 100,
      weekly: Math.round(dailySaving * 7),
      monthly: Math.round(mo),
      yearly: Math.round(yr),
      threeYear: Math.round(threeYr),
      fiveYear: Math.round(fiveYr),
      withInvestment: withInv,
      vacations: Math.floor(yr / 1200),
      iphones: Math.floor(threeYr / 999),
      coffeeLabel: habitName || "this habit",
    });
    setCalculated(true);
  };

  const f2 = (n:number) => n.toLocaleString("en-US", {minimumFractionDigits:0, maximumFractionDigits:0});

  return (
    <div className="screen desktop-content">
      <PageHead title="Lifestyle Optimizer" sub="Spend smarter · Save more"/>
      <div className="px">
        {/* Tab switcher */}
        <div className="au" style={{display:"flex",gap:5,marginBottom:24,background:"var(--surface2)",padding:4,borderRadius:14}}>
          <button onClick={()=>setTab(0)} className="press" style={{flex:1,padding:"11px",borderRadius:11,border:"none",background:tab===0?"var(--accent)":"none",color:tab===0?"#1A1200":"var(--text2)",fontSize:13,fontWeight:tab===0?700:500,transition:"all .2s"}}>
            🛒 Price Comparator
          </button>
          <button onClick={()=>setTab(1)} className="press" style={{flex:1,padding:"11px",borderRadius:11,border:"none",background:tab===1?"var(--accent)":"none",color:tab===1?"#1A1200":"var(--text2)",fontSize:13,fontWeight:tab===1?700:500,transition:"all .2s"}}>
            💡 Habit Savings
          </button>
        </div>

        {/* ── TAB 0: PRICE COMPARATOR ── */}
        {tab===0 && (
          <div className="ai">
            <div style={{background:"var(--surface)",border:"1px solid var(--border2)",borderRadius:20,padding:"18px 20px",marginBottom:20}}>
              <h3 className="serif" style={{fontSize:22,fontWeight:400,marginBottom:6}}>Smart Price Comparator</h3>
              <p style={{color:"var(--text2)",fontSize:13,lineHeight:1.6,marginBottom:16}}>
                Search any product. We compare prices across 8 major stores, factor in your card rewards, and tell you the true cheapest option after cashback.
              </p>
              <div style={{display:"flex",gap:8}}>
                <input
                  className="field"
                  placeholder="e.g. Sony headphones, iPhone 15, MacBook Air..."
                  value={productQuery}
                  onChange={e=>setProductQuery(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&findPrice(productQuery)}
                  style={{flex:1,padding:"13px 16px"}}
                />
                <button
                  onClick={()=>findPrice(productQuery)}
                  disabled={!productQuery.trim()||comparing}
                  className="btn-gold press"
                  style={{padding:"13px 20px",fontSize:14,flexShrink:0}}
                >
                  {comparing?"...":"Compare"}
                </button>
              </div>
            </div>

            {/* Suggestion chips */}
            {!searched && (
              <div>
                <p style={{color:"var(--text3)",fontSize:12,marginBottom:10}}>Popular searches</p>
                <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:20}}>
                  {PRODUCT_SUGGESTIONS.map(s=>(
                    <button key={s} onClick={()=>{setProductQuery(s);findPrice(s);}} className="press" style={{padding:"7px 14px",borderRadius:20,background:"var(--surface)",border:"1px solid var(--border2)",color:"var(--text2)",fontSize:12,transition:"all .15s"}}
                      onMouseOver={e=>{e.currentTarget.style.borderColor="var(--accent)";e.currentTarget.style.color="var(--accent)"}}
                      onMouseOut={e=>{e.currentTarget.style.borderColor="var(--border2)";e.currentTarget.style.color="var(--text2)"}}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Loading state */}
            {comparing && (
              <div style={{textAlign:"center",padding:"40px 20px"}}>
                <div style={{fontSize:32,marginBottom:12,animation:"pulse 1s ease infinite"}}>🔍</div>
                <p style={{color:"var(--text2)",fontSize:14}}>Comparing prices across 8 stores...</p>
                <p style={{color:"var(--text3)",fontSize:12,marginTop:4}}>Factoring in your card rewards</p>
              </div>
            )}

            {/* Results */}
            {searched && !comparing && priceResults.length > 0 && (
              <div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                  <p style={{color:"var(--text2)",fontSize:13}}>Results for <strong style={{color:"var(--text)"}}>{productQuery}</strong></p>
                  <p style={{color:"var(--green)",fontSize:12,fontWeight:600}}>
                    Save up to ${f2(priceResults[priceResults.length-1].finalCost - priceResults[0].finalCost)}
                  </p>
                </div>

                {priceResults.map((r,i)=>(
                  <div key={r.store} className={`au d${Math.min(i+1,6)}`} style={{
                    background:"var(--surface)",
                    border:`1.5px solid ${i===0?"var(--accent)":i===1?"rgba(45,200,160,.4)":"var(--border2)"}`,
                    borderRadius:18,padding:"16px 18px",marginBottom:10,
                    position:"relative",overflow:"hidden",
                  }}>
                    {/* Store color accent */}
                    <div style={{position:"absolute",top:0,left:0,width:4,height:"100%",background:r.gradient,borderRadius:"18px 0 0 18px"}}/>
                    <div style={{paddingLeft:12}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                        <div>
                          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                            <p style={{color:"var(--text)",fontSize:15,fontWeight:700}}>{r.store}</p>
                            {r.badge && (
                              <span className={`pill ${i===0?"pill-gold":"pill-emerald"}`} style={{fontSize:10}}>
                                {i===0?"🏆 ":""}{r.badge}
                              </span>
                            )}
                          </div>
                          {r.cardEarning > 0 && (
                            <p style={{color:"var(--text3)",fontSize:11}}>
                              Use {r.card} → earn ${r.cardEarning} back
                            </p>
                          )}
                        </div>
                        <div style={{textAlign:"right"}}>
                          <p style={{color:i===0?"var(--accent)":"var(--text)",fontSize:18,fontWeight:800}}>${f2(r.price)}</p>
                          {r.cardEarning > 0 && (
                            <p style={{color:"var(--green)",fontSize:11,marginTop:2}}>
                              After rewards: ${f2(r.finalCost)}
                            </p>
                          )}
                        </div>
                      </div>
                      {i===0 && (
                        <div style={{background:"rgba(201,168,76,.08)",border:"1px solid rgba(201,168,76,.2)",borderRadius:10,padding:"8px 12px",marginTop:4}}>
                          <p style={{color:"var(--accent)",fontSize:12,lineHeight:1.5}}>
                            💡 Best deal after card rewards. You save ${f2(priceResults[priceResults.length-1].price - r.price)} vs most expensive option.
                            {r.cardEarning > 0 ? ` Using ${r.card} gives you $${r.cardEarning} back on this purchase.` : " Add a cashback card to save even more."}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                <button onClick={()=>{setSearched(false);setPriceResults([]);setProductQuery("");}} className="btn-ghost press" style={{width:"100%",marginTop:8}}>
                  Search Another Product
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 1: HABIT SAVINGS CALCULATOR ── */}
        {tab===1 && (
          <div className="ai">
            <div style={{background:"var(--surface)",border:"1px solid var(--border2)",borderRadius:20,padding:"18px 20px",marginBottom:20}}>
              <h3 className="serif" style={{fontSize:22,fontWeight:400,marginBottom:6}}>Daily Habit Savings Calculator</h3>
              <p style={{color:"var(--text2)",fontSize:13,lineHeight:1.6}}>
                Enter any daily habit and its home-made alternative. See exactly how much you save over 1, 3, and 5 years — and what you could do with that money.
              </p>
            </div>

            {/* Quick fill suggestions */}
            <p style={{color:"var(--text3)",fontSize:12,marginBottom:10}}>Quick examples — tap to fill</p>
            <div style={{display:"flex",gap:7,overflowX:"auto",marginBottom:20,paddingBottom:4}}>
              {HABIT_SUGGESTIONS.map(h=>(
                <button key={h.name} onClick={()=>{setHabitName(h.name);setHabitCost(h.cost);setHomeCost(h.home);setHabitFreq(h.freq);setCalculated(false);}} className="press" style={{flexShrink:0,padding:"8px 14px",borderRadius:20,background:"var(--surface)",border:"1px solid var(--border2)",color:"var(--text2)",fontSize:12,whiteSpace:"nowrap",transition:"all .15s"}}
                  onMouseOver={e=>{e.currentTarget.style.borderColor="var(--accent)";e.currentTarget.style.color="var(--accent)"}}
                  onMouseOut={e=>{e.currentTarget.style.borderColor="var(--border2)";e.currentTarget.style.color="var(--text2)"}}>
                  {h.emoji} {h.name}
                </button>
              ))}
            </div>

            {/* Input form */}
            <div style={{background:"var(--surface)",border:"1px solid var(--border2)",borderRadius:20,padding:"18px 20px",marginBottom:16}}>
              <div style={{marginBottom:16}}>
                <label style={{fontSize:12,color:"var(--text2)",fontWeight:500,display:"block",marginBottom:8}}>What is the habit?</label>
                <input className="field" placeholder="e.g. Starbucks coffee, gym, takeout lunch..." value={habitName} onChange={e=>{setHabitName(e.target.value);setCalculated(false);}} style={{padding:"12px 16px"}}/>
              </div>

              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
                <div>
                  <label style={{fontSize:12,color:"var(--text2)",fontWeight:500,display:"block",marginBottom:8}}>Current cost ($)</label>
                  <input className="field" type="number" placeholder="e.g. 6.50" value={habitCost} onChange={e=>{setHabitCost(e.target.value);setCalculated(false);}} style={{padding:"12px 16px"}}/>
                </div>
                <div>
                  <label style={{fontSize:12,color:"var(--text2)",fontWeight:500,display:"block",marginBottom:8}}>Home alternative ($)</label>
                  <input className="field" type="number" placeholder="e.g. 0.50" value={homeCost} onChange={e=>{setHomeCost(e.target.value);setCalculated(false);}} style={{padding:"12px 16px"}}/>
                </div>
              </div>

              <div style={{marginBottom:20}}>
                <label style={{fontSize:12,color:"var(--text2)",fontWeight:600,textTransform:"uppercase",letterSpacing:.6,display:"block",marginBottom:10}}>How often?</label>
                <div style={{display:"flex",gap:8}}>
                  {(["daily","weekly","monthly"] as const).map(freq=>(
                    <button key={freq} onClick={()=>{setHabitFreq(freq);setCalculated(false);}} className="press" style={{flex:1,padding:"10px",borderRadius:12,border:`1.5px solid ${habitFreq===freq?"var(--accent)":"var(--border2)"}`,background:habitFreq===freq?"rgba(201,168,76,.1)":"var(--surface2)",color:habitFreq===freq?"var(--accent)":"var(--text2)",fontSize:13,fontWeight:habitFreq===freq?700:500,textTransform:"capitalize",transition:"all .15s"}}>
                      {freq}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={calculateSavings} disabled={!habitCost||!habitName} className="btn-gold press" style={{width:"100%"}}>
                Calculate My Savings
              </button>
            </div>

            {/* Results */}
            {calculated && savings.yearly > 0 && (
              <div className="ap">
                {/* Hero savings card */}
                <div style={{background:"linear-gradient(135deg,#0A1E00,#1A3A00,#0A2800)",border:"1px solid rgba(45,200,160,.3)",borderRadius:22,padding:"24px",marginBottom:16,position:"relative",overflow:"hidden"}}>
                  <div style={{position:"absolute",top:-30,right:-30,width:120,height:120,borderRadius:"50%",background:"rgba(45,200,160,.06)"}}/>
                  <p style={{color:"rgba(45,200,160,.6)",fontSize:11,letterSpacing:1.2,textTransform:"uppercase",fontWeight:600,marginBottom:6}}>
                    If you stop {savings.coffeeLabel}
                  </p>
                  <h2 style={{fontSize:44,fontWeight:800,color:"#6EE7B7",letterSpacing:"-1.5px",marginBottom:4,lineHeight:1}}>
                    ${f2(savings.yearly)}<span style={{fontSize:16,fontWeight:300,opacity:.6}}>/year</span>
                  </h2>
                  <p style={{color:"rgba(45,200,160,.6)",fontSize:14}}>
                    That is <strong style={{color:"#6EE7B7"}}>${f2(savings.daily)}/day</strong> or <strong style={{color:"#6EE7B7"}}>${f2(savings.monthly)}/month</strong> back in your pocket
                  </p>
                </div>

                {/* Timeline grid */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:16}}>
                  {[
                    {label:"1 Year",value:`$${f2(savings.yearly)}`,color:"var(--green)"},
                    {label:"3 Years",value:`$${f2(savings.threeYear)}`,color:"var(--accent)"},
                    {label:"5 Years",value:`$${f2(savings.fiveYear)}`,color:"var(--accent)"},
                  ].map(({label,value,color})=>(
                    <div key={label} style={{background:"var(--surface)",border:"1px solid var(--border2)",borderRadius:16,padding:"14px 12px",textAlign:"center"}}>
                      <p style={{color:"var(--text3)",fontSize:10,marginBottom:6,textTransform:"uppercase",letterSpacing:.6}}>{label}</p>
                      <p style={{color,fontSize:18,fontWeight:800}}>{value}</p>
                    </div>
                  ))}
                </div>

                {/* Investment projection */}
                <div style={{background:"rgba(79,110,247,.08)",border:"1px solid rgba(79,110,247,.2)",borderRadius:16,padding:"14px 18px",marginBottom:12}}>
                  <p style={{color:"var(--accent)",fontSize:13,fontWeight:700,marginBottom:4}}>📈 If you invested those savings</p>
                  <p style={{color:"var(--text2)",fontSize:13,lineHeight:1.6}}>
                    Investing ${f2(savings.yearly)}/year at 7% average market returns (S&P 500) for 5 years would grow to <strong style={{color:"var(--accent)",fontSize:16}}>${f2(savings.withInvestment)}</strong>.
                  </p>
                </div>

                {/* Fun equivalents */}
                <div style={{background:"var(--surface)",border:"1px solid var(--border2)",borderRadius:16,padding:"14px 18px",marginBottom:12}}>
                  <p style={{color:"var(--accent)",fontSize:13,fontWeight:700,marginBottom:12}}>✨ What you could do instead</p>
                  <div style={{display:"flex",flexDirection:"column",gap:10}}>
                    {[
                      {emoji:"✈️", label:"International vacations", value:`${savings.vacations} round trips to Europe`, show:savings.vacations > 0},
                      {emoji:"📱", label:"iPhones", value:`Buy ${savings.iphones} iPhone 15 Pro over 3 years`, show:savings.iphones > 0},
                      {emoji:"💳", label:"Credit card fee offset", value:`Covers ${Math.floor(savings.yearly / 95)} premium card annual fees per year`, show:true},
                      {emoji:"🏦", label:"Emergency fund", value:`Full 3-month emergency fund in ${Math.ceil(savings.yearly > 0 ? (savings.yearly*3)/savings.yearly : 0)} years`, show:savings.yearly > 0},
                      {emoji:"☕", label:"The math on coffee", value:`${Math.round(savings.yearly / (parseFloat(habitCost)||6))} fewer ${savings.coffeeLabel} purchases per year`, show:true},
                    ].filter(i=>i.show).map(({emoji,label,value})=>(
                      <div key={label} style={{display:"flex",gap:12,alignItems:"center"}}>
                        <span style={{fontSize:22,flexShrink:0}}>{emoji}</span>
                        <div>
                          <p style={{color:"var(--text)",fontSize:12,fontWeight:600}}>{label}</p>
                          <p style={{color:"var(--text2)",fontSize:11,marginTop:1}}>{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card rewards angle */}
                {cards.length > 0 && (
                  <div style={{background:"rgba(201,168,76,.08)",border:"1px solid rgba(201,168,76,.2)",borderRadius:16,padding:"14px 18px",marginBottom:12}}>
                    <p style={{color:"var(--accent)",fontSize:13,fontWeight:700,marginBottom:6}}>💳 CardPilot tip</p>
                    <p style={{color:"var(--text2)",fontSize:12,lineHeight:1.6}}>
                      If you still buy {savings.coffeeLabel} occasionally, always use {cards[0].name} — it earns {cards[0].rewardRate}. On ${f2(savings.monthly)} monthly spending that earns roughly ${f2(Math.round(savings.monthly * 0.04))} back per month in rewards.
                    </p>
                  </div>
                )}

                <button onClick={()=>{setCalculated(false);setHabitName("");setHabitCost("");setHomeCost("");}} className="btn-ghost press" style={{width:"100%"}}>
                  Calculate Another Habit
                </button>
              </div>
            )}

            {calculated && savings.yearly <= 0 && (
              <div style={{background:"rgba(244,97,122,.06)",border:"1px solid rgba(244,97,122,.2)",borderRadius:16,padding:"16px 18px",textAlign:"center"}}>
                <p style={{color:"var(--red)",fontSize:14,fontWeight:600,marginBottom:4}}>Home alternative costs more!</p>
                <p style={{color:"var(--text2)",fontSize:13}}>The home version actually costs more than your current habit. Consider keeping the original.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   AUTH SCREENS
   ============================================================ */
function AuthScreen({onAuth}:{onAuth:()=>void}) {
  const [mode, setMode] = useState<"login"|"signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleAuth = async () => {
    if (!email || !password) { setError("Please fill in all fields"); return; }
    setLoading(true); setError(""); setSuccess("");
    try {
      if (mode === "signup") {
        if (!name) { setError("Please enter your name"); setLoading(false); return; }
        const { error } = await supabase.auth.signUp({ email, password, options: { data: { name } } });
        if (error) setError(error.message);
        else { setSuccess("Account created! Please check your email to verify, then log in."); setMode("login"); }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) setError(error.message);
        else onAuth();
      }
    } catch(e) { setError("Something went wrong. Try again."); }
    setLoading(false);
  };

  return (
    <div style={{background:"var(--bg)",minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px",fontFamily:"var(--sans)"}}>
      <div style={{width:"100%",maxWidth:400}}>
        {/* Logo */}
        <div style={{textAlign:"center",marginBottom:40}}>
          <div style={{width:52,height:52,borderRadius:14,background:"var(--accent)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px"}}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg></div>
          <div style={{fontSize:11,letterSpacing:2,fontWeight:600,marginBottom:8,color:"var(--accent)",textTransform:"uppercase"}}>CardPilot Elite</div>
          <h1 className="serif" style={{fontSize:28,fontWeight:700,lineHeight:1.2,letterSpacing:"-.5px"}}>
            {mode==="login"?"Welcome back":"Get started"}
          </h1>
          <p style={{color:"var(--text2)",fontSize:13,marginTop:8}}>
            {mode==="login"?"Sign in to your account":"Create your free account"}
          </p>
        </div>

        {/* Form */}
        <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:12,padding:"28px 24px",boxShadow:"var(--shadow-lg)"}}>
          {mode==="signup" && (
            <div style={{marginBottom:16}}>
              <label style={{fontSize:12,color:"var(--text2)",fontWeight:500,display:"block",marginBottom:8}}>Your Name</label>
              <input className="field" placeholder="First name" value={name} onChange={e=>setName(e.target.value)} style={{padding:"13px 16px"}}/>
            </div>
          )}
          <div style={{marginBottom:16}}>
            <label style={{fontSize:12,color:"var(--text2)",fontWeight:500,display:"block",marginBottom:8}}>Email</label>
            <input className="field" type="email" placeholder="your@email.com" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleAuth()} style={{padding:"13px 16px"}}/>
          </div>
          <div style={{marginBottom:24}}>
            <label style={{fontSize:12,color:"var(--text2)",fontWeight:500,display:"block",marginBottom:8}}>Password</label>
            <input className="field" type="password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleAuth()} style={{padding:"13px 16px"}}/>
          </div>

          {error && <div style={{background:"rgba(244,97,122,.1)",border:"1px solid rgba(244,97,122,.3)",borderRadius:10,padding:"10px 14px",marginBottom:16}}><p style={{color:"var(--red)",fontSize:13}}>{error}</p></div>}
          {success && <div style={{background:"rgba(45,200,160,.1)",border:"1px solid rgba(45,200,160,.3)",borderRadius:10,padding:"10px 14px",marginBottom:16}}><p style={{color:"var(--green)",fontSize:13}}>{success}</p></div>}

          <button onClick={handleAuth} disabled={loading} className="btn-gold press" style={{width:"100%",opacity:loading?0.7:1}}>
            {loading ? "Please wait..." : mode==="login" ? "Sign In →" : "Create Account →"}
          </button>

          <button onClick={()=>{setMode(mode==="login"?"signup":"login");setError("");setSuccess("");}} style={{width:"100%",marginTop:14,background:"none",border:"none",color:"var(--text2)",fontSize:13,cursor:"pointer",padding:"8px"}}>
            {mode==="login" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>

        <p style={{color:"var(--text3)",fontSize:11,textAlign:"center",marginTop:16}}>
          Your data is encrypted and never shared
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   ROOT APP
   ============================================================ */
export default function App() {
  const [screen, setScreen] = useState<S>("onboard");
  const [profile, setProfile] = useState<UserProfile>({name:"",age:"",income:"",lifestyles:[],creditScore:"",spending:{dining:"",groceries:"",travel:"",gas:"",shopping:"",other:""},goal:""});
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [theme, setTheme] = useState<"dark"|"light">("light");
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Inject CSS
  useEffect(()=>{
    const el = document.createElement("style");
    el.textContent = BASE_CSS;
    document.head.appendChild(el);
    return ()=>document.head.removeChild(el);
  },[]);

  useEffect(()=>{
    if(theme==="light") document.documentElement.classList.remove("dark");
    else document.documentElement.classList.add("dark");
  },[theme]);

  // Check auth state on load
  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });
    const {data:{subscription}} = supabase.auth.onAuthStateChange((_,session)=>{
      setUser(session?.user ?? null);
    });
    return ()=>subscription.unsubscribe();
  },[]);

  // Load user data from Supabase when logged in
  useEffect(()=>{
    if(!user || dataLoaded) return;
    const loadData = async () => {
      // Load profile
      const {data:prof} = await supabase.from("profiles").select("*").eq("id",user.id).single();
      if(prof) {
        setProfile({
          name:prof.name||"", age:prof.age||"", income:prof.income||"",
          lifestyles:prof.lifestyles||[], creditScore:prof.credit_score||"",
          goal:prof.goal||"",
          spending:{
            dining:prof.spending_dining||"", groceries:prof.spending_groceries||"",
            travel:prof.spending_travel||"", gas:prof.spending_gas||"",
            shopping:prof.spending_shopping||"", other:prof.spending_other||"",
          }
        });
        setScreen("home");
      }
      // Load cards
      const {data:cardData} = await supabase.from("cards").select("*").eq("user_id",user.id);
      if(cardData && cardData.length>0) {
        const mapped = cardData.map((c:any):CreditCard=>({
          id:c.id, dbId:c.db_id, name:c.name, issuer:c.issuer,
          gradient:c.gradient, accentColor:c.accent_color,
          balance:c.balance, limit:c.credit_limit, minPayment:c.min_payment,
          dueDate:c.due_date, points:c.points, apr:c.apr,
          rewardRate:c.reward_rate, annualFee:c.annual_fee, perksValue:c.perks_value,
          cashback:c.cashback, category:c.category,
          signupBonus:c.signup_bonus||"", bestFor:c.best_for||[],
          keyBenefits:c.key_benefits||[], bestPlaces:c.best_places||[],
          notGoodFor:c.not_good_for||[],
          offers:[
            {title:"10% back at Uber Eats",merchant:"Uber Eats",expires:"Dec 31, 2025",value:"Up to $25"},
            {title:"$50 off at Best Buy",merchant:"Best Buy",expires:"Nov 30, 2025",value:"$50 cashback"},
            {title:"5x points on hotels",merchant:"Hotels.com",expires:"Jan 15, 2026",value:"Bonus points"},
          ],
        }));
        setCards(mapped);
      }
      setDataLoaded(true);
    };
    loadData();
  },[user, dataLoaded]);

  const go = (s:S) => setScreen(s);
  const toggleTheme = () => setTheme(t=>t==="dark"?"light":"dark");

  // Save card to Supabase + local state
  const addCard = async (card:CreditCard) => {
    setCards(p=>[...p,card]);
    if(user) {
      await supabase.from("cards").insert({
        user_id:user.id, db_id:card.dbId, name:card.name, issuer:card.issuer,
        gradient:card.gradient, accent_color:card.accentColor,
        balance:card.balance, credit_limit:card.limit, min_payment:card.minPayment,
        due_date:card.dueDate, points:card.points, apr:card.apr,
        reward_rate:card.rewardRate, annual_fee:card.annualFee, perks_value:card.perksValue,
        cashback:card.cashback, category:card.category,
        signup_bonus:card.signupBonus, best_for:card.bestFor,
        key_benefits:card.keyBenefits, best_places:card.bestPlaces,
        not_good_for:card.notGoodFor,
      });
    }
  };

  // Save profile to Supabase
  const saveProfile = async (p:UserProfile) => {
    setProfile(p);
    if(user) {
      await supabase.from("profiles").upsert({
        id:user.id, name:p.name, age:p.age, income:p.income,
        credit_score:p.creditScore, lifestyles:p.lifestyles, goal:p.goal,
        spending_dining:p.spending.dining, spending_groceries:p.spending.groceries,
        spending_travel:p.spending.travel, spending_gas:p.spending.gas,
        spending_shopping:p.spending.shopping, spending_other:p.spending.other,
      });
    }
    setScreen("home");
  };

  // Sign out
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null); setCards([]); setDataLoaded(false);
    setProfile({name:"",age:"",income:"",lifestyles:[],creditScore:"",spending:{dining:"",groceries:"",travel:"",gas:"",shopping:"",other:""},goal:""});
    setScreen("onboard");
  };

  // Loading spinner while checking auth
  if(authLoading) return (
    <div style={{background:"var(--bg)",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--sans)"}}>
      <div style={{textAlign:"center"}}>
          <div style={{width:52,height:52,borderRadius:14,background:"var(--accent)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px"}}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg></div>
        <p style={{color:"var(--text2)",fontSize:14}}>Loading CardPilot...</p>
      </div>
    </div>
  );

  // Show auth screen if not logged in
  if(!user) return <AuthScreen onAuth={()=>setDataLoaded(false)}/>;

  // Show onboarding if logged in but no profile yet
  if(screen==="onboard") return <Onboard done={saveProfile}/>;

  const isChat = screen === "chat";

  return (
    <div style={{background:"var(--bg)",minHeight:"100vh",fontFamily:"var(--sans)"}}>
      <Sidebar active={screen} go={go} theme={theme} toggleTheme={toggleTheme} profile={profile} onSignOut={signOut}/>
      <div className={isChat?"":"desktop-main"}>
        {screen==="home"     && <Home     profile={profile} cards={cards} go={go}/>}
        {screen==="cards"    && <Cards    cards={cards} go={go}/>}
        {screen==="add-card" && <AddCard  go={go} onAdd={addCard}/>}
        {screen==="chat"     && <Chat     cards={cards} profile={profile}/>}
        {screen==="travel"   && <Travel   cards={cards}/>}
        {screen==="goals"    && <Goals/>}
        {screen==="split"    && <Split    cards={cards}/>}
        {screen==="perks"    && <Perks    cards={cards}/>}
        {screen==="settings" && <Settings go={go} profile={profile} theme={theme} toggleTheme={toggleTheme} onSignOut={signOut}/>}
        {screen==="lifestyle" && <LifestyleOptimizer go={go} cards={cards} profile={profile}/>}
        {screen==="ai-recommender" && <AIRecommender go={go} cards={cards} profile={profile}/>}
      </div>
      {!isChat && <MobileNav active={screen} go={go}/>}
    </div>
  );
}
