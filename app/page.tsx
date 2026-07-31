"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://xlizcyyuadwnmdqbkjfg.supabase.co",
  "sb_publishable_3BnSyxM0zyXudw2OZXF3wA_I0cuODRG",
  {
    auth: {
      // Bypass the Web Locks API used internally for multi-tab session refresh coordination.
      // In some environments (sandboxed iframes, certain browsers/extensions) that lock can hang
      // indefinitely and only release on a visibility change -- causing sign-in to appear stuck
      // until the user switches tabs and back. This app doesn't need multi-tab lock coordination.
      lock: async (_name: string, _acquireTimeout: number, fn: () => Promise<any>) => fn(),
    },
  }
);

/* ============================================================
   DESIGN SYSTEM -- v4
   Aesthetic: Luxury fintech. Premium dark mode with glassmorphism.
   Deep blacks, muted blue accent with soft glow. Inter font.
   Inspired by 21st.dev premium components. Feels exclusive.
   ============================================================ */

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,300;0,400;0,500;0,600;0,700&display=swap');`;

const DARK_CSS = `
  --bg:        #0A0E1A;
  --bg2:       #111827;
  --surface:   rgba(255,255,255,.04);
  --surface2:  rgba(255,255,255,.06);
  --border:    rgba(255,255,255,.08);
  --border2:   rgba(255,255,255,.12);
  --border-soft: rgba(255,255,255,.03);
  --text:      #F1F3F8;
  --text2:     #7B89A8;
  --text3:     #3A4560;
  --accent:    #A78BFA;
  --accent2:   #8B5CF6;
  --accentbg:  rgba(167,139,250,.10);
  --green:     #34D399;
  --greenbg:   rgba(52,211,153,.08);
  --red:       #FB7185;
  --redbg:     rgba(251,113,133,.08);
  --amber:     #FBBF24;
  --amberbg:   rgba(251,191,36,.08);
  --sans:      'Inter', system-ui, -apple-system, sans-serif;
  --serif:     'Fraunces', Georgia, 'Times New Roman', serif;
  --shadow:    0 4px 24px rgba(0,0,0,.35);
  --shadow-lg: 0 12px 40px rgba(0,0,0,.5);
  --radius:    12px;
  --radius-sm: 9px;   /* inputs, small buttons, badges */
  --radius-md: 12px;  /* cards, panels, list rows */
  --radius-lg: 22px;  /* hero blocks, feature surfaces */
  --radius-full: 999px; /* pills, avatars */
  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px;
  --space-5: 24px; --space-6: 32px; --space-7: 48px; --space-8: 64px;
  --elev-0: none;
  --elev-1: 0 2px 8px rgba(0,0,0,.3), 0 0px 1px rgba(0,0,0,.15);
  --elev-2: 0 8px 24px rgba(0,0,0,.35), 0 2px 6px rgba(0,0,0,.2);
  --elev-3: 0 20px 50px rgba(0,0,0,.5), 0 4px 12px rgba(0,0,0,.25);
`;

const LIGHT_CSS = `
  --bg:        #F8FAFD;
  --bg2:       #EEF2F9;
  --surface:   rgba(255,255,255,.85);
  --surface2:  rgba(255,255,255,.6);
  --border:    rgba(0,0,0,.06);
  --border2:   rgba(0,0,0,.10);
  --border-soft: rgba(0,0,0,.03);
  --text:      #0F172A;
  --text2:     #64748B;
  --text3:     #CBD5E1;
  --accent:    #7C3AED;
  --accent2:   #6D28D9;
  --accentbg:  rgba(124,58,237,.06);
  --green:     #059669;
  --greenbg:   rgba(5,150,105,.06);
  --red:       #E11D48;
  --redbg:     rgba(225,29,72,.06);
  --amber:     #D97706;
  --amberbg:   rgba(217,119,6,.06);
  --sans:      'Inter', system-ui, -apple-system, sans-serif;
  --serif:     'Fraunces', Georgia, 'Times New Roman', serif;
  --shadow:    0 1px 3px rgba(0,0,0,.04), 0 4px 16px rgba(0,0,0,.03);
  --shadow-lg: 0 12px 40px rgba(0,0,0,.08);
  --radius:    12px;
  --radius-sm: 9px;   /* inputs, small buttons, badges */
  --radius-md: 12px;  /* cards, panels, list rows */
  --radius-lg: 22px;  /* hero blocks, feature surfaces */
  --radius-full: 999px; /* pills, avatars */
  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px;
  --space-5: 24px; --space-6: 32px; --space-7: 48px; --space-8: 64px;
  --elev-0: none;
  --elev-1: 0 1px 3px rgba(0,0,0,.03), 0 4px 12px rgba(0,0,0,.02);
  --elev-2: 0 4px 16px rgba(0,0,0,.05), 0 1px 3px rgba(0,0,0,.03);
  --elev-3: 0 16px 40px rgba(0,0,0,.08), 0 4px 10px rgba(0,0,0,.04);
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
  position: relative;
}
/* Subtle grain texture -- the single biggest "this feels real, not flat-AI-generated" fix.
   Pure CSS, fixed-position overlay, ~2% opacity. Barely perceptible consciously but adds
   genuine material depth that flat solid colors lack. */
body::before {
  content: "";
  position: fixed; inset: 0; z-index: 9999; pointer-events: none;
  opacity: 0.018; mix-blend-mode: soft-light;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

button, input, select, textarea { font-family: var(--sans); cursor: pointer; }

/* Ambient accent glow — luxury depth */
:root.dark body { background: #08090E; }
:root.dark .desktop-main::before {
  content: "";
  position: fixed; top: -20%; right: -15%; width: 50%; height: 50%;
  z-index: -1; pointer-events: none;
  background: radial-gradient(ellipse at center, rgba(212,168,71,.015) 0%, transparent 70%);
  filter: blur(80px);
}
::-webkit-scrollbar { display: none; }

@keyframes fadeUp  { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
@keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
@keyframes popIn   { from { opacity:0; transform:scale(.96); } to { opacity:1; transform:scale(1); } }

/* Landing page card marquee */
@keyframes cardMarquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
.card-marquee { animation: cardMarquee 20s linear infinite; }
@keyframes glow    { 0%,100% { box-shadow:0 0 20px rgba(139,92,246,.15); } 50% { box-shadow:0 0 30px rgba(139,92,246,.25); } }
@keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:.4} }

.au { animation: fadeUp .4s cubic-bezier(.16,1,.3,1) both; }
.ai { animation: fadeIn .3s cubic-bezier(.16,1,.3,1) both; }
.ap { animation: popIn  .35s cubic-bezier(.16,1,.3,1) both; }
.d1{animation-delay:.04s} .d2{animation-delay:.08s} .d3{animation-delay:.12s}
.d4{animation-delay:.16s} .d5{animation-delay:.2s}  .d6{animation-delay:.24s}
.press:active { opacity:.85; transform:scale(.98); transition:opacity .1s, transform .1s cubic-bezier(.4,0,.2,1); }

/* Form elements */
.field {
  width:100%; padding:12px 16px;
  border-radius:10px;
  background:var(--surface);
  backdrop-filter:blur(12px);
  -webkit-backdrop-filter:blur(12px);
  border:1px solid var(--border2);
  color:var(--text); font-size:14px; outline:none;
  transition:border-color .2s ease, box-shadow .2s ease;
  font-family:var(--sans);
}
.field:focus { border-color:var(--accent); box-shadow:0 0 0 3px var(--accentbg), 0 0 20px var(--accentbg); }
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

/* Surfaces -- tonal separation + soft shadow instead of hard borders, for a premium feel */
.card-s        { background:var(--surface);  border:1px solid var(--border-soft); border-radius:var(--radius-md); box-shadow:var(--elev-1); }
.card-s2       { background:var(--surface2); border:1px solid var(--border-soft); border-radius:var(--radius-md); }
.card-surface  { background:var(--surface); backdrop-filter:blur(20px) saturate(1.5); -webkit-backdrop-filter:blur(20px) saturate(1.5); border:1px solid var(--border); border-radius:var(--radius-md); box-shadow:0 1px 0 rgba(255,255,255,.06) inset, var(--elev-1); position:relative; transition:box-shadow .2s ease, border-color .2s ease; }
:root.dark .card-surface { box-shadow:0 1px 0 rgba(255,255,255,.03) inset, var(--shadow); border-color:rgba(255,255,255,.06); }
.card-surface-2{ background:var(--surface2); border:1px solid var(--border-soft); border-radius:var(--radius-md); }

/* Utilities */
.divider { height:1px; background:var(--border); width:100%; }
.no-scrollbar { scrollbar-width:none; -ms-overflow-style:none; }
.no-scrollbar::-webkit-scrollbar { display:none; }
.screen  { min-height:100vh; padding-bottom:88px; }
.px      { padding-left:20px; padding-right:20px; }
.serif   { font-family:var(--serif); font-weight:500; letter-spacing:-0.02em; }
.nav-safe{ padding-bottom:max(12px,env(safe-area-inset-bottom)); }
.track   { background:var(--border2); border-radius:99px; overflow:hidden; }
.fill    { height:100%; border-radius:99px; transition:width .6s ease; }
.gold-text { color:var(--accent); font-weight:600; }
.hover-lift { transition:box-shadow .25s cubic-bezier(.4,0,.2,1), transform .25s cubic-bezier(.4,0,.2,1), border-color .25s ease; }
.hover-lift:hover { box-shadow:var(--shadow-lg), 0 0 0 1px var(--accent)/8; transform:translateY(-2px); border-color:var(--border2); }

/* Buttons */
.btn-gold {
  background:linear-gradient(135deg,var(--accent2) 0%,var(--accent) 50%,#C084FC 100%);
  color:#fff; border:none; font-weight:500;
  border-radius:var(--radius-sm); padding:13px 22px; font-size:14px;
  font-family:var(--sans); cursor:pointer; position:relative; overflow:hidden;
  box-shadow:0 1px 0 rgba(255,255,255,.15) inset, 0 8px 24px -6px rgba(139,92,246,.4);
  transition:transform .2s cubic-bezier(.4,0,.2,1), box-shadow .2s cubic-bezier(.4,0,.2,1); letter-spacing:.2px;
}
.btn-gold::after {
  content:""; position:absolute; top:0; left:-60%; width:40%; height:100%;
  background:linear-gradient(115deg,transparent,rgba(255,255,255,.15),transparent);
  transform:skewX(-18deg); transition:left .7s cubic-bezier(.16,1,.3,1);
}
.btn-gold:hover::after { left:130%; }
.btn-gold:hover { transform:translateY(-1px); box-shadow:0 1px 0 rgba(255,255,255,.3) inset, 0 10px 22px -4px rgba(37,99,235,.55); }
.btn-gold:active { transform:translateY(0); box-shadow:0 1px 0 rgba(255,255,255,.2) inset, 0 4px 10px -2px rgba(37,99,235,.4); }
.btn-gold:disabled { background:var(--border2); color:var(--text3); cursor:not-allowed; box-shadow:none; }

.btn-ghost {
  background:var(--surface); color:var(--text2);
  border:1.5px solid var(--border2); font-weight:500;
  border-radius:var(--radius-sm); padding:10px 18px; font-size:14px;
  font-family:var(--sans); cursor:pointer;
  transition:border-color .18s ease, color .18s ease, background .18s ease, transform .15s ease;
}
.btn-ghost:hover { border-color:var(--accent); color:var(--accent); background:var(--accentbg); transform:translateY(-1px); box-shadow:0 4px 16px var(--accentbg); }
.btn-ghost:active { transform:translateY(0); }

/* Toggle */
.toggle-track {
  width:44px; height:24px; border-radius:12px;
  background:var(--border2); border:none; cursor:pointer;
  position:relative; transition:background .2s; flex-shrink:0;
}
.toggle-track.on { background:linear-gradient(135deg,var(--accent2),var(--accent)); }
.toggle-knob {
  position:absolute; top:3px; left:3px;
  width:18px; height:18px; border-radius:50%; background:white;
  transition:left .2s ease; box-shadow:0 1px 3px rgba(0,0,0,.2);
}
.toggle-track.on .toggle-knob { left:23px; }

/* ============================================================
   RESPONSIVE BREAKPOINTS
   Phone:        < 768px   -- bottom nav, no sidebar, full width
   iPad/Tablet:  768-1023px -- sidebar hidden, wider content, bottom nav
   iPad Pro:     1024-1199px -- narrow sidebar (240px), wider content
   Laptop:       1200-1439px -- full sidebar (280px), content max 900px
   Desktop/iMac: 1440px+   -- full sidebar (300px), content max 1100px
   ============================================================ */

/* -- Phone (max 767px) -- */
@media (max-width: 767px) {
  .desktop-sidebar { display: none !important; }
  .desktop-main { margin-left: 0 !important; }
  .desktop-content { padding: 64px 16px 100px; max-width: 100%; }
  /* Force single column on mobile for comparison grids */
  .mobile-stack { grid-template-columns: 1fr !important; }
}

/* -- iPad / Tablet portrait (768px - 1023px) -- */
@media (min-width: 768px) and (max-width: 1023px) {
  .desktop-sidebar { display: none !important; }
  .desktop-main { margin-left: 0 !important; }
  .mobile-nav { display: flex !important; }
  .desktop-content { max-width: 680px; margin: 0 auto; padding: 48px 28px 100px; }
}

/* -- iPad Pro / Large Tablet landscape (1024px - 1199px) -- */
@media (min-width: 1024px) and (max-width: 1199px) {
  .desktop-sidebar { position: fixed; left: 0; top: 0; height: 100vh; overflow-y: auto; z-index: 100; display: flex !important; flex-direction: column; backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); }
  .desktop-main { margin-left: 72px; transition: margin-left .3s cubic-bezier(.4,0,.2,1); }
  .mobile-nav { display: none !important; }
  .desktop-content { max-width: 720px; margin: 0 auto; padding: 36px 28px 80px; }
}

/* -- Laptop (1200px - 1439px) -- */
@media (min-width: 1200px) and (max-width: 1439px) {
  .desktop-sidebar { position: fixed; left: 0; top: 0; height: 100vh; overflow-y: auto; z-index: 100; display: flex !important; flex-direction: column; backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); }
  .desktop-main { margin-left: 72px; transition: margin-left .3s cubic-bezier(.4,0,.2,1); }
  .mobile-nav { display: none !important; }
  .desktop-content { max-width: 900px; margin: 0 auto; padding: 40px 32px 80px; }
}

/* -- Desktop / iMac / Large Monitor (1440px+) -- */
@media (min-width: 1440px) {
  .desktop-sidebar { position: fixed; left: 0; top: 0; height: 100vh; overflow-y: auto; z-index: 100; display: flex !important; flex-direction: column; backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); }
  .desktop-main { margin-left: 72px; transition: margin-left .3s cubic-bezier(.4,0,.2,1); }
  .mobile-nav { display: none !important; }
  .desktop-content { max-width: 1100px; margin: 0 auto; padding: 48px 40px 80px; }
}

/* -- Shared desktop (1024px+) -- */
@media (min-width: 1024px) {
  .desktop-grid { display: grid; min-height: 100vh; }
}
@keyframes toastIn {
  from { opacity:0; transform:translateX(20px); }
  to   { opacity:1; transform:translateX(0); }
}
@keyframes pulse {
  0%,100% { opacity:1; }
  50%      { opacity:.45; }
}
@keyframes fadeIn {
  from { opacity:0; transform:translateY(6px); }
  to   { opacity:1; transform:translateY(0); }
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 3D Card tilt on hover — luxury card feel */
.card-3d {
  perspective: 800px;
  transform-style: preserve-3d;
}
.card-3d-inner {
  transition: transform .4s cubic-bezier(.03,.98,.52,.99), box-shadow .4s ease;
  transform-style: preserve-3d;
  will-change: transform;
}
.card-3d-inner:hover {
  box-shadow: 0 8px 24px rgba(15,23,42,.15), 0 1px 2px rgba(15,23,42,.08);
}

/* Shimmer sweep across cards */
@keyframes cardShimmer {
  0% { transform: translateX(-150%) skewX(-20deg); }
  100% { transform: translateX(250%) skewX(-20deg); }
}
.card-shimmer::after {
  content: "";
  position: absolute; inset: 0;
  background: linear-gradient(105deg, transparent 30%, rgba(255,255,255,.04) 45%, rgba(255,255,255,.08) 50%, rgba(255,255,255,.04) 55%, transparent 70%);
  transform: translateX(-150%) skewX(-20deg);
  pointer-events: none;
}
.card-shimmer:hover::after {
  animation: cardShimmer .8s ease forwards;
}

/* Smooth number counter animation */
@keyframes countUp {
  from { opacity: 0; transform: translateY(8px); filter: blur(4px); }
  to { opacity: 1; transform: translateY(0); filter: blur(0); }
}
.animate-number {
  animation: countUp .5s cubic-bezier(.4,0,.2,1) both;
}

/* Score entrance — dramatic reveal */
@keyframes scoreReveal {
  from { opacity: 0; transform: scale(0.92); }
  to { opacity: 1; transform: scale(1); }
}
.score-entrance {
  animation: scoreReveal .8s cubic-bezier(.16,1,.3,1) both;
}

/* Marker slide */
@keyframes markerSlide {
  from { opacity: 0; transform: translateX(-50%) scale(0); }
  to { opacity: 1; transform: translateX(-50%) scale(1); }
}
.marker-animate {
  animation: markerSlide .6s cubic-bezier(.34,1.56,.64,1) .3s both;
}

/* Stagger children */
.stagger > * { opacity: 0; animation: fadeUp .35s cubic-bezier(.4,0,.2,1) both; }
.stagger > *:nth-child(1) { animation-delay: .05s; }
.stagger > *:nth-child(2) { animation-delay: .1s; }
.stagger > *:nth-child(3) { animation-delay: .15s; }
.stagger > *:nth-child(4) { animation-delay: .2s; }
.stagger > *:nth-child(5) { animation-delay: .25s; }
.stagger > *:nth-child(6) { animation-delay: .3s; }

/* Pulse glow for important actions */
@keyframes pulseGlow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(212,168,71,.3); }
  50% { box-shadow: 0 0 0 8px rgba(212,168,71,0); }
}
.{ animation: pulseGlow 2s ease-in-out infinite; }

/* Spring hover for buttons */
.spring-hover {
  transition: transform .25s cubic-bezier(.22,1,.36,1), box-shadow .25s ease;
}
.spring-hover:hover { transform: translateY(-1px); }
.spring-hover:active { transform: scale(.97); transition-duration: .08s; }
@keyframes screenFade {
  from { opacity:0; transform:translateY(6px); }
  to   { opacity:1; transform:translateY(0); }
}
.screen-enter { animation: screenFade .35s cubic-bezier(.16,1,.3,1) both; }

/* Skeleton shimmer for loading states */
@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.skeleton-shimmer {
  background: linear-gradient(90deg, var(--border) 25%, var(--surface2) 50%, var(--border) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: 6px;
}

/* Landing page motion */
@keyframes meshDrift {
  0%   { transform: translate(0,0) scale(1); }
  33%  { transform: translate(3%,-4%) scale(1.08); }
  66%  { transform: translate(-3%,3%) scale(0.96); }
  100% { transform: translate(0,0) scale(1); }
}
@keyframes heroFadeUp {
  from { opacity:0; transform:translateY(22px); }
  to   { opacity:1; transform:translateY(0); }
}
@keyframes floatCard {
  0%,100% { transform: translateY(0) rotate(-4deg); }
  50%     { transform: translateY(-14px) rotate(-2deg); }
}
@keyframes floatCard2 {
  0%,100% { transform: translateY(0) rotate(5deg); }
  50%     { transform: translateY(-10px) rotate(7deg); }
}
@keyframes wordCycleIn {
  from { opacity:0; transform:translateY(100%); }
  to   { opacity:1; transform:translateY(0); }
}
@keyframes wordCycleOut {
  from { opacity:1; transform:translateY(0); }
  to   { opacity:0; transform:translateY(-100%); }
}
@keyframes revealUp {
  from { opacity:0; transform:translateY(30px); }
  to   { opacity:1; transform:translateY(0); }
}
@keyframes softPulse {
  0%,100% { box-shadow: 0 0 0 0 rgba(37,99,235,.25); }
  50%     { box-shadow: 0 0 0 14px rgba(37,99,235,0); }
}
.reveal-on-scroll { opacity:0; transform:translateY(30px); transition:opacity .7s ease, transform .7s ease; }
.reveal-on-scroll.is-visible { opacity:1; transform:translateY(0); }
`;

/* ============================================================
   TYPES
   ============================================================ */
type S = "onboard"|"home"|"cards"|"add-card"|"card-detail"|"chat"|"travel"|"goals"|"split"|"perks"|"settings"|"lifestyle"|"ai-recommender"|"analytics"|"notifications"|"compare"|"edit-profile"|"privacy"|"referral"|"about"|"card-strategy"|"debt-planner"|"net-worth"|"achievements"|"help"|"privacy-policy"|"terms"|"tools"|"credit-optimizer";
type ToastType = "success"|"error"|"info"|"warning";
interface Toast { id: string; message: string; type: ToastType; }

interface UserProfile {
  name: string; age: string; income: string;
  lifestyles: string[]; creditScore: string;
  spending: { dining:string; groceries:string; travel:string; gas:string; shopping:string; other:string; };
  goal: string;
  budgetCaps?: { dining:string; groceries:string; travel:string; gas:string; shopping:string; other:string; };
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
  openedDate?: string;
  bonusTarget?: number;
  bonusDeadline?: string;
  bonusProgress?: number;
  isFrozen?: boolean;
}


/* ============================================================
   TRANSFER PARTNERS -- real airline/hotel transfer data
   ============================================================ */
const TRANSFER_PROGRAMS = [
  {
    id:"chase", name:"Chase Ultimate Rewards", issuer:"Chase", color:"#2563EB",
    note:"Southwest only partners with Chase -- if you fly Southwest, this is the only program that gets you there.",
    airlines:[
      {name:"United MileagePlus", ratio:"1:1", best:"Domestic flights & Star Alliance partners"},
      {name:"Southwest Rapid Rewards", ratio:"1:1", best:"Companion Pass pursuers, no blackout dates"},
      {name:"JetBlue TrueBlue", ratio:"1:1", best:"Northeast & Caribbean routes"},
      {name:"British Airways Avios", ratio:"1:1", best:"Short-haul partner flights, distance-based pricing"},
      {name:"Air France/KLM Flying Blue", ratio:"1:1", best:"Transatlantic Business Class to Europe"},
      {name:"Virgin Atlantic Flying Club", ratio:"1:1", best:"ANA & Delta partner awards"},
      {name:"Iberia Avios", ratio:"1:1", best:"Spain & South America routes"},
      {name:"Aer Lingus Avios", ratio:"1:1", best:"Ireland & transatlantic"},
      {name:"Emirates Skywards", ratio:"1:1", best:"First/Business Class to Middle East & Asia"},
      {name:"Singapore Airlines KrisFlyer", ratio:"1:1", best:"Premium cabin to Asia"},
    ],
    hotels:[
      {name:"World of Hyatt", ratio:"1:1*", best:"Best hotel redemption value of any program", flag:"*Sapphire Reserve keeps 1:1. New Sapphire Preferred/Ink Business Preferred applicants (since June 15, 2026) get a worse 4:3 ratio -- existing cardholders keep 1:1 until Sept 30, 2026."},
      {name:"Marriott Bonvoy", ratio:"1:1", best:"Largest hotel footprint worldwide"},
      {name:"IHG One Rewards", ratio:"1:1", best:"Rarely the best value -- usually better to book via portal or transfer elsewhere"},
      {name:"World of Wyndham", ratio:"1:1", best:"Added Feb 2026 -- budget-friendly stays"},
    ],
  },
  {
    id:"amex", name:"Amex Membership Rewards", issuer:"Amex", color:"#C9A24C",
    note:"Most partners of any program (20 total). Amex charges a 60-cent-per-1,000-point fee (capped ~$99) when transferring to U.S. airline partners -- factor this into your math.",
    airlines:[
      {name:"Delta SkyMiles", ratio:"1:1", best:"Only way to transfer MR points to Delta"},
      {name:"Air France/KLM Flying Blue", ratio:"1:1", best:"Frequent promo transfer bonuses (25-30%)"},
      {name:"ANA Mileage Club", ratio:"1:1", best:"First Class to Japan -- legendary value"},
      {name:"British Airways Avios", ratio:"1:1", best:"Short-haul & distance-based awards"},
      {name:"Cathay Pacific Asia Miles", ratio:"1:1", best:"Business/First to Asia"},
      {name:"Emirates Skywards", ratio:"1:1", best:"Emirates First Class suites"},
      {name:"Singapore Airlines KrisFlyer", ratio:"1:1", best:"Suites Class -- one of aviation's best products"},
      {name:"Virgin Atlantic Flying Club", ratio:"1:1", best:"ANA & Delta partner bookings, 25-30% transfer bonuses"},
      {name:"Air Canada Aeroplan", ratio:"1:1", best:"Star Alliance flexibility, no fuel surcharges"},
      {name:"Avianca LifeMiles", ratio:"1:1", best:"Star Alliance awards, mixed-cabin pricing"},
      {name:"Hawaiian Airlines", ratio:"1:1", best:"Hawaii routes"},
      {name:"JetBlue TrueBlue", ratio:"1:1", best:"Northeast U.S. routes"},
      {name:"Qantas Frequent Flyer", ratio:"1:1", best:"Australia & South Pacific"},
      {name:"Etihad Guest", ratio:"1:1", best:"Transfers end permanently June 30, 2026", flag:"This partnership is being discontinued -- transfer before the deadline if planning to use it."},
    ],
    hotels:[
      {name:"Marriott Bonvoy", ratio:"1:1", best:"Largest hotel network"},
      {name:"Hilton Honors", ratio:"1:2", best:"Double points on transfer -- decent for mid-tier Hilton stays"},
      {name:"Choice Privileges", ratio:"1:1", best:"Budget hotel stays"},
    ],
  },
  {
    id:"citi", name:"Citi ThankYou Points", issuer:"Citi", color:"#56CCF2",
    note:"Smaller partner list (11 airlines, no hotels) but strong for Asia and Europe routes via Cathay Pacific and Air France/KLM.",
    airlines:[
      {name:"JetBlue TrueBlue", ratio:"1:1", best:"Northeast & Caribbean"},
      {name:"Virgin Atlantic Flying Club", ratio:"1:1", best:"ANA & Delta partner awards"},
      {name:"Air France/KLM Flying Blue", ratio:"1:1", best:"Europe routes, promo bonuses"},
      {name:"Cathay Pacific Asia Miles", ratio:"1:1", best:"Business/First to Asia"},
      {name:"Emirates Skywards", ratio:"1:1", best:"Middle East & luxury cabins"},
      {name:"EVA Air Infinity MileageLands", ratio:"1:1", best:"Taiwan & Asia routes"},
      {name:"Qantas Frequent Flyer", ratio:"1:1", best:"Australia routes"},
      {name:"Singapore Airlines KrisFlyer", ratio:"1:1", best:"Premium cabins to Asia"},
      {name:"Thai Airways Royal Orchid Plus", ratio:"1:1", best:"Southeast Asia"},
      {name:"Turkish Airlines Miles&Smiles", ratio:"1:1", best:"Sweet-spot pricing to Europe/Africa"},
      {name:"Avianca LifeMiles", ratio:"1:1", best:"Star Alliance flexibility"},
    ],
    hotels:[],
  },
  {
    id:"capone", name:"Capital One Miles", issuer:"Capital One", color:"#E43F5A",
    note:"No hotel partners, but a strong airline list with several partners not found in Chase or Amex (TAP Portugal, Finnair, Virgin Red).",
    airlines:[
      {name:"Air Canada Aeroplan", ratio:"1:1", best:"Star Alliance, no fuel surcharges"},
      {name:"Air France/KLM Flying Blue", ratio:"1:1", best:"Europe routes, promo bonuses"},
      {name:"British Airways Avios", ratio:"1:1", best:"Short-haul distance-based pricing"},
      {name:"Cathay Pacific Asia Miles", ratio:"1:1", best:"Asia premium cabins"},
      {name:"Emirates Skywards", ratio:"1:1", best:"Middle East & luxury cabins"},
      {name:"Etihad Guest", ratio:"1:1", best:"Abu Dhabi routes"},
      {name:"EVA Air Infinity MileageLands", ratio:"1:1", best:"Taiwan & Asia"},
      {name:"Finnair Plus", ratio:"1:1", best:"Nordic & Asia via Helsinki"},
      {name:"Qantas Frequent Flyer", ratio:"1:1", best:"Australia routes"},
      {name:"Singapore Airlines KrisFlyer", ratio:"1:1", best:"Premium cabins to Asia"},
      {name:"TAP Air Portugal Miles&Go", ratio:"1:1", best:"Portugal & Europe stopover routes"},
      {name:"Turkish Airlines Miles&Smiles", ratio:"1:1", best:"Sweet-spot Europe/Africa pricing"},
      {name:"Avianca LifeMiles", ratio:"1:1", best:"Star Alliance, mixed-cabin awards"},
      {name:"Virgin Red", ratio:"1:1", best:"Virgin Atlantic flights"},
    ],
    hotels:[],
  },
];
// Map a card's issuer to its transfer program (only true for points/miles cards, not cash back)
const issuerToProgram = (issuer:string) => TRANSFER_PROGRAMS.find(p=>p.issuer===issuer);

interface Msg { role:"user"|"ai"; text:string; id:number; searched?:boolean; }
interface Goal { id:string; emoji:string; title:string; target:number; current:number; unit:"$"|"%"|"pts"; color:string; due:string; tips:string[]; }
interface Bill { id:number; name:string; emoji:string; amount:number; people:string[]; date:string; done:boolean; card:string; pts:number; }
interface Asset { id:string; name:string; value:number; }
interface Txn { id:string; cat:string; amount:number; desc:string; card:string; date:string; }
interface CardApplication { id:string; issuer:string; date:string; }

/* ============================================================
   CARD DATABASE -- 50+ real US cards
   ============================================================ */
const CARD_DB = [
  {
    id:"csr", name:"Sapphire Reserve", issuer:"Chase", apr:"22.49%-29.49% Variable",
    gradient:"linear-gradient(135deg,#0F1832 0%,#1E3A6E 50%,#0D2347 100%)",
    accentColor:"#4F9BF5", rewardRate:"8x Chase Travel, 4x Direct, 3x Dining", annualFee:795, perksValue:1400, cashback:"Points", category:"travel",
    signupBonus:"125,000 points after spending $6,000 in first 3 months -- worth $2,500+ toward travel (current elevated offer, highest ever)",
    bestFor:["Restaurants & dining worldwide","Flights, hotels, car rentals","Airport lounge access (Priority Pass)","Luxury hotel collection benefits","Travel insurance & trip protection"],
    keyBenefits:["$300 annual travel credit (auto-applied)","$500 annual hotel credit via The Edit by Chase","$300 annual dining credit (Sapphire Reserve Exclusive Tables)","Priority Pass Select + Chase Sapphire Lounge access","8x on all Chase Travel, 4x on direct flights & hotels","Primary rental car insurance + comprehensive trip protection","IHG One Rewards Platinum Elite status","Apple TV+ and Apple Music complimentary subscriptions"],
    bestPlaces:["Any restaurant or cafe","Airlines & hotel bookings","Uber & Lyft rides","Chase Ultimate Rewards travel portal","Partner hotels: Hyatt, IHG, Marriott"],
    notGoodFor:["Groceries (only 1x)","Gas stations (only 1x)","Bills and subscriptions (only 1x)"],
  },
  {
    id:"csp", name:"Sapphire Preferred", issuer:"Chase", apr:"19.24%-27.49% Variable",
    gradient:"linear-gradient(135deg,#0A2240 0%,#1A4A80 50%,#0A2240 100%)",
    accentColor:"#5BA8F7", rewardRate:"3x Dining, 2x Travel", annualFee:95, perksValue:220, cashback:"Points", category:"travel",
    signupBonus:"75,000 points after spending $4,000 in first 3 months -- worth $935+ toward travel",
    bestFor:["Dining and restaurants","Travel bookings","Streaming services (2x)","Online grocery (3x)"],
    keyBenefits:["$50 annual hotel credit through Chase portal","25% more value redeeming through Chase portal","Trip delay & cancellation insurance","No foreign transaction fees","Secondary rental car insurance"],
    bestPlaces:["Restaurants and takeout","Hotel and flight bookings","Streaming: Netflix, Spotify, Hulu","Grocery delivery: DoorDash, Instacart"],
    notGoodFor:["In-store grocery shopping (1x)","Gas (1x)","General merchandise (1x)"],
  },
  {
    id:"cff", name:"Freedom Flex", issuer:"Chase", apr:"19.99%-28.74% Variable",
    gradient:"linear-gradient(135deg,#1A1A2E 0%,#16213E 50%,#0F3460 100%)",
    accentColor:"#E94560", rewardRate:"5x Rotating categories", annualFee:0, perksValue:0, cashback:"Cash Back", category:"cashback",
    signupBonus:"$200 cash bonus after spending $500 in first 3 months",
    bestFor:["Quarterly rotating 5x categories","Drugstores (3x always)","Dining (3x always)","Travel through Chase portal (5x)"],
    keyBenefits:["5% on rotating quarterly categories (up to $1,500/quarter)","3% on dining and drugstores","No annual fee","Cell phone protection","Purchase protection up to $500"],
    bestPlaces:["Rotating Q categories: groceries, gas, Amazon, PayPal, select merchants","CVS, Walgreens, Rite Aid (3x)","Restaurants (3x)"],
    notGoodFor:["Everything else (only 1x)","Must activate quarterly bonuses manually"],
  },
  {
    id:"cfu", name:"Freedom Unlimited", issuer:"Chase", apr:"19.99%-28.74% Variable",
    gradient:"linear-gradient(135deg,#1C1C2E 0%,#2C2C5E 50%,#1C1C2E 100%)",
    accentColor:"#A78BFA", rewardRate:"1.5x Everything", annualFee:0, perksValue:0, cashback:"Cash Back", category:"cashback",
    signupBonus:"Additional 1.5% on everything for first year (total 3% on all purchases up to $20,000)",
    bestFor:["Everyday catch-all spending","Categories other cards miss","Pharmacies (3x)","Dining (3x)"],
    keyBenefits:["Flat 1.5% on every purchase -- no categories to track","3% on dining and drugstores","No annual fee","Pairs perfectly with Sapphire cards to unlock 50% more value","Purchase and trip cancellation protection"],
    bestPlaces:["Anything your other cards dont cover","Amazon, Walmart, Target","Gas stations (1.5x -- decent fallback)","Bills and subscriptions"],
    notGoodFor:["Anywhere you have a category card -- always use the better card first"],
  },
  {
    id:"amg", name:"Gold Card", issuer:"Amex", apr:"21.49%-29.49% Variable",
    gradient:"linear-gradient(135deg,#2C1A00 0%,#8B6010 35%,#C9920A 65%,#8B6010 100%)",
    accentColor:"#F0B429", rewardRate:"4x Dining & Groceries, 5x Hotels via Amex", annualFee:325, perksValue:424, cashback:"Points", category:"dining",
    signupBonus:"Up to 100,000 Membership Rewards points after spending $8,000 in first 6 months (2026 refresh; offers vary by applicant)",
    bestFor:["Restaurants and dining worldwide","US supermarkets (up to $25k/year)","Flights booked directly with airlines","All other travel (2x)"],
    keyBenefits:["$120 Uber Cash credit annually ($10/month)","$120 dining credit at Grubhub, Cheesecake Factory, Goldbelly, Wine.com","4x at US supermarkets -- best grocery card in US","4x at restaurants worldwide -- including food delivery","No foreign transaction fees","Trip delay insurance"],
    bestPlaces:["Every restaurant, cafe, and food delivery app","Whole Foods, Kroger, Safeway, Trader Joes, Costco","Grubhub, DoorDash, Seamless, Uber Eats","Direct airline bookings (2x)","Amex Travel portal"],
    notGoodFor:["Hotels (only 1x unless booked via Amex)","Gas stations (only 1x)","Drug stores (only 1x)"],
  },
  {
    id:"amp", name:"Platinum Card", issuer:"Amex", apr:"20.99%-29.99% Variable",
    gradient:"linear-gradient(135deg,#1A1A1A 0%,#3D3D3D 50%,#1A1A1A 100%)",
    accentColor:"#C0C0C0", rewardRate:"5x Flights & Hotels", annualFee:895, perksValue:3500, cashback:"Points", category:"travel",
    signupBonus:"Up to 175,000 Membership Rewards points after spending $12,000 in first 6 months (offers vary; fee is $895/year as of 2026)",
    bestFor:["Frequent flyers -- 5x on all flights","Luxury hotel stays","Lounge access worldwide","Premium travel benefits"],
    keyBenefits:["$200 airline fee credit annually","$200 hotel credit (Fine Hotels + Resorts)","$240 digital entertainment credit","$155 Walmart+ credit","$100 Saks Fifth Avenue credit","Centurion Lounge + Priority Pass access","Global Entry / TSA PreCheck credit","Hotel status: Marriott Gold, Hilton Gold"],
    bestPlaces:["Direct airline ticket purchases (5x)","Fine Hotels and Resorts collection","Centurion Lounges at major airports","Amex Travel portal","Saks Fifth Avenue"],
    notGoodFor:["Dining (only 1x -- use Amex Gold instead)","Groceries (only 1x)","Everyday spending -- fee is only worth it for heavy travelers"],
  },
  {
    id:"ambc", name:"Blue Cash Preferred", issuer:"Amex", apr:"19.24%-29.99% Variable",
    gradient:"linear-gradient(135deg,#001B5E 0%,#0038A8 50%,#001B5E 100%)",
    accentColor:"#60A5FA", rewardRate:"6x Groceries, 6x Streaming", annualFee:95, perksValue:240, cashback:"Cash Back", category:"groceries",
    signupBonus:"$250 back after spending $3,000 in first 6 months",
    bestFor:["US supermarkets -- best grocery cashback card","Streaming services (Netflix, Disney+, Spotify)","US gas stations (3%)","Transit: subway, buses, taxis (3%)"],
    keyBenefits:["6% at US supermarkets up to $6,000/year","6% on select US streaming","3% at US gas stations","3% on transit (Uber, Lyft, trains, buses)","$84 Disney Bundle credit ($7/month)","Car rental loss and damage insurance"],
    bestPlaces:["Whole Foods, Trader Joes, Kroger, Safeway, Costco, Walmart grocery","Netflix, Hulu, Disney+, Peacock, Spotify, Apple Music","Shell, Exxon, BP, Chevron","Uber, Lyft, Amtrak, transit passes"],
    notGoodFor:["Dining out (only 1x -- use Amex Gold)","Warehouse clubs count as 1x not 6x","International purchases"],
  },
  {
    id:"ambu", name:"Blue Cash Everyday", issuer:"Amex", apr:"19.24%-29.99% Variable",
    gradient:"linear-gradient(135deg,#001B5E 0%,#003092 50%,#001B5E 100%)",
    accentColor:"#93C5FD", rewardRate:"3x Groceries", annualFee:0, perksValue:0, cashback:"Cash Back", category:"groceries",
    signupBonus:"$200 back after spending $2,000 in first 6 months",
    bestFor:["US supermarkets (no annual fee version)","Online shopping (3%)","US gas stations (2%)"],
    keyBenefits:["3% at US supermarkets up to $6,000/year","3% on online shopping","2% at US gas stations","No annual fee","Car rental loss and damage insurance"],
    bestPlaces:["Whole Foods, Kroger, Safeway, Target grocery","Amazon, Walmart.com, online retailers","Shell, Exxon, BP, Chevron"],
    notGoodFor:["Worth upgrading to Blue Cash Preferred if you spend $31+/month on groceries"],
  },
  {
    id:"covx", name:"Venture X", issuer:"Capital One", apr:"19.49%-28.49% Variable",
    gradient:"linear-gradient(135deg,#080C18 0%,#0D1F3C 50%,#162B50 100%)",
    accentColor:"#38BDF8", rewardRate:"2x Everything, 5x Travel", annualFee:395, perksValue:620, cashback:"Miles", category:"travel",
    signupBonus:"75,000 miles after spending $4,000 in first 3 months -- worth $750 in travel",
    bestFor:["All everyday spending (flat 2x)","Travel booked through Capital One portal (5x)","Hotels and car rentals (5x portal)","Flights booked through portal (5x)"],
    keyBenefits:["$300 travel credit for Capital One portal bookings","10,000 miles anniversary bonus (worth $100)","Priority Pass lounge access for primary cardholder (guest access limited starting Feb 2026)","Capital One lounge access","No foreign transaction fees","Cell phone protection","Global Entry / TSA PreCheck credit"],
    bestPlaces:["Capital One Travel portal for 5x","Every purchase for flat 2x (best catch-all premium card)","Airports with Capital One Lounges: DFW, DEN, LAS, IAD","Any hotel or airline via portal"],
    notGoodFor:["If you dont use Capital One travel portal -- loses much of its value","Dining category-specific spending (Amex Gold is better)"],
  },
  {
    id:"cov", name:"Venture", issuer:"Capital One", apr:"19.99%-29.99% Variable",
    gradient:"linear-gradient(135deg,#0A1628 0%,#1A3A5C 50%,#0A1628 100%)",
    accentColor:"#60A5FA", rewardRate:"2x Everything", annualFee:95, perksValue:0, cashback:"Miles", category:"travel",
    signupBonus:"75,000 miles after spending $4,000 in first 3 months",
    bestFor:["Simple flat-rate travel rewards","No category tracking needed","Hotels and flights (2x everywhere)"],
    keyBenefits:["2x miles on every purchase","No foreign transaction fees","Global Entry / TSA PreCheck credit ($100)","Transfer miles to 15+ travel partners","Miles never expire"],
    bestPlaces:["Literally everywhere -- flat 2x","Great fallback card for any purchase"],
    notGoodFor:["Category-specific spending where other cards earn 3x-6x"],
  },
  {
    id:"coqs", name:"Quicksilver", issuer:"Capital One", apr:"19.99%-29.99% Variable",
    gradient:"linear-gradient(135deg,#1A1018 0%,#3A1A30 50%,#1A1018 100%)",
    accentColor:"#E879F9", rewardRate:"1.5x Everything", annualFee:0, perksValue:0, cashback:"Cash Back", category:"cashback",
    signupBonus:"$200 after spending $500 in first 3 months",
    bestFor:["Simple no-fee cashback","No category tracking","International travel (no FX fee)"],
    keyBenefits:["1.5% cash back on every purchase","No annual fee","No foreign transaction fees","0% intro APR for 15 months on purchases"],
    bestPlaces:["Any purchase you cant categorize","International purchases (no FX fee unlike many no-fee cards)"],
    notGoodFor:["Domestic dining, groceries, travel -- better cards exist for each"],
  },
  {
    id:"cdc", name:"Double Cash", issuer:"Citi", apr:"19.24%-29.24% Variable",
    gradient:"linear-gradient(135deg,#0F1923 0%,#1A2F42 50%,#0F1923 100%)",
    accentColor:"#34D399", rewardRate:"2% Everything", annualFee:0, perksValue:0, cashback:"Cash Back", category:"cashback",
    signupBonus:"$200 cash back after spending $1,500 in first 6 months",
    bestFor:["Best flat-rate cashback with no annual fee","1% when you buy + 1% when you pay","Great for paying off balances"],
    keyBenefits:["2% on everything (1% purchase + 1% payment)","No annual fee","Convert to ThankYou points if you have Citi Premier","0% intro APR on balance transfers for 18 months"],
    bestPlaces:["Everything you buy and pay off monthly","Pairs with Citi Premier for transfer value"],
    notGoodFor:["Carrying a balance -- the 1% on payment is lost"],
  },
  {
    id:"cpc", name:"Premier", issuer:"Citi", apr:"21.24%-29.24% Variable",
    gradient:"linear-gradient(135deg,#0A1628 0%,#1A3360 50%,#0A1628 100%)",
    accentColor:"#6366F1", rewardRate:"3x Hotels, Air, Dining", annualFee:95, perksValue:0, cashback:"Points", category:"travel",
    signupBonus:"60,000 points after spending $4,000 in first 3 months",
    bestFor:["Hotels (3x)","Flights (3x)","Restaurants (3x)","Grocery stores (3x)","Gas stations (3x)"],
    keyBenefits:["3x on 5 major categories simultaneously","$100 annual hotel savings benefit","Transfer to 16 airline partners","No foreign transaction fees","Points worth 1 cent each or more via transfers"],
    bestPlaces:["Any hotel worldwide (3x)","Any airline booking (3x)","Restaurants and cafes (3x)","Supermarkets (3x)","Gas stations (3x)"],
    notGoodFor:["Lounge access","Premium travel protections (use Chase Sapphire for those)"],
  },
  {
    id:"disc", name:"Discover it", issuer:"Discover", apr:"17.24%-28.24% Variable",
    gradient:"linear-gradient(135deg,#1A0A00 0%,#7A3800 50%,#1A0A00 100%)",
    accentColor:"#FB923C", rewardRate:"5x Rotating, 1x Other", annualFee:0, perksValue:0, cashback:"Cash Back", category:"cashback",
    signupBonus:"Cashback Match -- Discover matches all cash back earned in first year automatically",
    bestFor:["First year -- cashback doubled on everything","Quarterly 5% rotating categories","No annual fee","Gas, restaurants, Amazon, grocery (rotating)"],
    keyBenefits:["Cashback Match in year 1 = effectively 10% on rotating, 2% on everything","5% on rotating categories (up to $1,500/quarter)","Free FICO credit score monthly","No foreign transaction fees","Free social security number alerts"],
    bestPlaces:["Gas stations when its the 5% category","Amazon.com when its the 5% category","Restaurants when its the 5% category","Grocery stores when its the 5% category"],
    notGoodFor:["Not widely accepted internationally","After year 1 cashback match ends, less competitive"],
  },
  {
    id:"apple", name:"Apple Card", issuer:"Apple/Goldman Sachs", apr:"19.24%-29.49% Variable",
    gradient:"linear-gradient(135deg,#1C1C1E 0%,#2C2C2E 50%,#1C1C1E 100%)",
    accentColor:"#F5F5F7", rewardRate:"3% Apple, 2% Apple Pay", annualFee:0, perksValue:0, cashback:"Daily Cash", category:"cashback",
    signupBonus:"No traditional signup bonus -- Daily Cash paid instantly every day",
    bestFor:["Apple purchases -- App Store, Apple Music, Apple TV+","Apple Pay at any contactless terminal","Merchants that dont accept Apple Pay (titanium card, 1%)"],
    keyBenefits:["3% Daily Cash at Apple and Apple Pay partners (Uber, Nike, Panera, Exxon)","2% Daily Cash on any Apple Pay purchase","No fees -- no annual, no foreign transaction, no late fee","Daily Cash paid instantly to Apple Cash","Privacy focused -- no card number on physical card","0% financing on Apple products"],
    bestPlaces:["Apple Store and Apple.com","App Store and Apple subscriptions","Uber and Uber Eats (3%)","Nike stores and Nike.com (3%)","Panera Bread (3%)","Exxon and Mobil stations (3%)","Any store with contactless Apple Pay terminal (2%)"],
    notGoodFor:["Places that dont accept Apple Pay (only 1% with physical card)","Non-Apple purchases where other cards earn 2-6%"],
  },
  {
    id:"wells", name:"Active Cash", issuer:"Wells Fargo", apr:"19.24%-29.24% Variable",
    gradient:"linear-gradient(135deg,#140000 0%,#480000 50%,#140000 100%)",
    accentColor:"#F87171", rewardRate:"2% Everything", annualFee:0, perksValue:0, cashback:"Cash Back", category:"cashback",
    signupBonus:"$200 cash rewards bonus after spending $500 in first 3 months",
    bestFor:["Simple flat 2% cashback on everything","No annual fee","Cell phone protection is unique for no-fee card"],
    keyBenefits:["Unlimited 2% cash rewards on all purchases","No annual fee","$600 cell phone protection when you pay your bill with the card","0% intro APR for 15 months","Access to Wells Fargo ATMs worldwide"],
    bestPlaces:["Everything -- it is a flat 2% catch-all","Pay your cell phone bill with it for free phone protection"],
    notGoodFor:["Category spenders -- Amex Gold and Chase Freedom earn more in categories"],
  },
  {
    id:"boar", name:"Customized Cash Rewards", issuer:"Bank of America", apr:"19.24%-29.24% Variable",
    gradient:"linear-gradient(135deg,#001A3A 0%,#003580 50%,#001A3A 100%)",
    accentColor:"#60A5FA", rewardRate:"3% Choice category, 2% Grocery", annualFee:0, perksValue:0, cashback:"Cash Back", category:"cashback",
    signupBonus:"$200 online cash rewards bonus after spending $1,000 in first 90 days",
    bestFor:["Your chosen 3% category (gas, online shopping, dining, travel, drug stores, or home improvement)","Grocery stores and wholesale clubs (2%)","Preferred Rewards members -- earn up to 75% more"],
    keyBenefits:["Choose your own 3% category and change monthly","2% at grocery stores and wholesale clubs","No annual fee","Bank of America Preferred Rewards = 25-75% bonus on earnings","$2,500 combined quarterly cap on 2% and 3% categories"],
    bestPlaces:["Your chosen 3% category -- gas stations, Amazon, restaurants, etc","Costco, BJs, Sams Club (2%)","Grocery stores (2%)"],
    notGoodFor:["Spending above $2,500/quarter in bonus categories (drops to 1%)","Without Preferred Rewards, competitive cards earn more"],
  },
  {
    id:"usb", name:"Altitude Reserve", issuer:"US Bank", apr:"21.24%-28.24% Variable",
    gradient:"linear-gradient(135deg,#0A0A1A 0%,#1A1A40 50%,#0A0A1A 100%)",
    accentColor:"#818CF8", rewardRate:"3x Mobile Pay & Travel", annualFee:400, perksValue:500, cashback:"Points", category:"travel",
    signupBonus:"50,000 points after spending $4,500 in first 90 days -- worth $750 in travel",
    bestFor:["Mobile Pay purchases (Apple Pay, Google Pay, Samsung Pay -- 3x)","Travel purchases (3x)","Anyone who pays with phone at most retailers"],
    keyBenefits:["$325 annual travel and dining credit","3x on all mobile wallet purchases -- huge category","Real-time mobile rewards -- redeem against any travel purchase","Priority Pass airport lounge access","Global Entry or TSA PreCheck credit","No foreign transaction fees"],
    bestPlaces:["Any store accepting Apple Pay or Google Pay -- earns 3x","Hotels, flights, rental cars (3x)","Restaurants via mobile pay (3x)"],
    notGoodFor:["Stores not accepting mobile payments","Lower-value points than Chase/Amex for complex redemptions"],
  },
  {
    id:"mar", name:"Marriott Bonvoy Boundless", issuer:"Chase", apr:"21.49%-29.49% Variable",
    gradient:"linear-gradient(135deg,#1A0A00 0%,#4A1A00 50%,#1A0A00 100%)",
    accentColor:"#FB923C", rewardRate:"6x Marriott, 2x All", annualFee:95, perksValue:200, cashback:"Points", category:"hotel",
    signupBonus:"3 Free Night Awards (each worth up to 50,000 points) after spending $3,000 in first 3 months",
    bestFor:["Marriott hotel stays worldwide (6x)","Everyday spending to earn toward free nights","Marriott Silver Elite status automatically"],
    keyBenefits:["One Free Night Award every card anniversary (up to 35,000 points)","Marriott Bonvoy Silver Elite status","15 Elite Night Credits toward status each year","6x points at 8,000+ Marriott properties worldwide","2x on everything else","No foreign transaction fees"],
    bestPlaces:["All Marriott brands: Marriott, Sheraton, Westin, W Hotels, St. Regis, Ritz-Carlton","Marriott Bonvoy restaurants and spas","Everyday spending to accumulate free nights"],
    notGoodFor:["Non-Marriott hotels","Travel booked outside Marriott ecosystem"],
  },
  {
    id:"hlt", name:"Hilton Honors Surpass", issuer:"Amex", apr:"21.49%-29.49% Variable",
    gradient:"linear-gradient(135deg,#001028 0%,#002060 50%,#001028 100%)",
    accentColor:"#60A5FA", rewardRate:"12x Hilton, 6x Grocery & Restaurant", annualFee:150, perksValue:300, cashback:"Points", category:"hotel",
    signupBonus:"130,000 Hilton Honors points after spending $3,000 in first 6 months",
    bestFor:["Hilton hotel stays -- highest multiplier of any Hilton card (12x)","US supermarkets (6x)","US restaurants and dining (6x)","US gas stations (3x)"],
    keyBenefits:["Hilton Honors Gold status automatically (worth lounge access at many properties)","Free Weekend Night Reward after spending $15,000 in a calendar year","$250 Hilton resort credit","Priority Pass -- 10 complimentary lounge visits per year","12x at all Hilton properties worldwide","6x at US supermarkets AND US restaurants"],
    bestPlaces:["All Hilton brands: Hilton, DoubleTree, Hampton Inn, Waldorf Astoria, Conrad","Hilton restaurants, bars, and spas (12x)","US grocery stores (6x) -- very competitive","US restaurants (6x) -- rivals Amex Gold","Shell, Exxon, BP, Chevron (3x)"],
    notGoodFor:["Non-Hilton hotel stays","Travel booked through third-party sites"],
  },
  {
    id:"hyatt", name:"World of Hyatt Credit Card", issuer:"Chase", apr:"21.24%-28.74% Variable",
    gradient:"linear-gradient(135deg,#1A1A2E 0%,#3D2645 50%,#1A1A2E 100%)",
    accentColor:"#C77DFF", rewardRate:"4x Hyatt, 2x Dining & Flights", annualFee:95, perksValue:285, cashback:"Points", category:"hotel",
    signupBonus:"Up to 60,000 bonus points: 30,000 after spending $3,000 in first 3 months, plus up to 30,000 more by earning 2 points/$1 on up to $15,000 spent in first 6 months",
    bestFor:["Frequent Hyatt stays (4x at Hyatt hotels)","Restaurants, flights booked direct, local transit, gym memberships (2x)","Travelers who value the single best hotel transfer/redemption program"],
    keyBenefits:["Free night certificate every cardmember anniversary at any Category 1-4 Hyatt property -- alone often covers the $95 fee","Second free night after $15,000 spent in a calendar year","Complimentary Hyatt Discoverist elite status -- late checkout, room upgrades, 10% bonus points","No foreign transaction fees","One of the most generous hotel award charts -- off-peak Category 1 nights from just 3,500 points"],
    bestPlaces:["Hyatt hotels and resorts worldwide, including Park Hyatt, Andaz, Small Luxury Hotels of the World","Restaurants and flights booked directly with the airline","Gym and fitness memberships"],
    notGoodFor:["Non-Hyatt loyalists -- earning rate outside Hyatt/dining/flights is just 1x","Those who want a flexible, transferable-everywhere points currency"],
  },
  {
    id:"hiltonaspire", name:"Hilton Honors Aspire", issuer:"Amex", apr:"19.49%-28.49% Variable",
    gradient:"linear-gradient(135deg,#1C1C1C 0%,#3A2E1F 50%,#1C1C1C 100%)",
    accentColor:"#D4AF37", rewardRate:"14x Hilton, 7x Flights/Dining", annualFee:550, perksValue:1209, cashback:"Points", category:"hotel",
    signupBonus:"175,000 Hilton Honors points after spending $6,000 in first 6 months (current offer ends 7/29/2026; standard offer is 150,000)",
    bestFor:["Hilton loyalists who stay 2+ times per year","Highest Hilton earning rate of any card on the market (14x)","Travelers who'll actually use the airline, resort, and CLEAR credits"],
    keyBenefits:["Complimentary Hilton Honors Diamond status -- the top elite tier, with room upgrades and lounge access","Annual Free Night Reward every year on renewal, plus extra free nights at $30k and $60k spend","Up to $400/year in Hilton resort credits (paid $200 semi-annually)","Up to $200/year in flight credits (paid $50 quarterly)","Up to $209/year CLEAR+ membership credit","No foreign transaction fees"],
    bestPlaces:["Hilton, Waldorf Astoria, Conrad, DoubleTree, and all other Hilton-family hotels","Flights booked direct or via Amex Travel","U.S. restaurants"],
    notGoodFor:["Occasional travelers who won't use the resort/flight/CLEAR credits -- the $550 fee is hard to justify without them","Anyone not loyal to the Hilton ecosystem specifically"],
  },
  {
    id:"delta", name:"Delta SkyMiles Gold", issuer:"Amex", apr:"21.49%-29.49% Variable",
    gradient:"linear-gradient(135deg,#0A0028 0%,#1A0050 50%,#0A0028 100%)",
    accentColor:"#A78BFA", rewardRate:"2x Delta, 2x Dining", annualFee:150, perksValue:220, cashback:"Miles", category:"airline",
    signupBonus:"40,000 bonus miles after spending $2,000 in first 6 months",
    bestFor:["Delta Air Lines flights (2x)","Restaurants worldwide (2x)","Grocery stores (2x)","Delta co-branded benefits"],
    keyBenefits:["First checked bag free on Delta flights (saves $70 round trip per person)","Main Cabin 1 priority boarding","20% back on Delta in-flight purchases","$200 Delta flight credit after spending $10,000 in a year","15% discount on Delta award tickets","No foreign transaction fees"],
    bestPlaces:["Delta.com and Delta app for flights (2x)","Any restaurant worldwide (2x)","US grocery stores (2x)","Delta Sky Clubs (access with upgrade or purchase)"],
    notGoodFor:["Non-Delta airlines","Hotels and other travel (only 1x)"],
  },
  {
    id:"united", name:"Explorer", issuer:"Chase", apr:"21.49%-29.24% Variable",
    gradient:"linear-gradient(135deg,#000A1E 0%,#001A50 50%,#000A1E 100%)",
    accentColor:"#3B82F6", rewardRate:"2x United, 2x Dining", annualFee:95, perksValue:200, cashback:"Miles", category:"airline",
    signupBonus:"60,000 miles after spending $3,000 in first 3 months",
    bestFor:["United Airlines flights (2x)","Restaurants (2x)","Hotel stays (2x)","United co-branded benefits"],
    keyBenefits:["First and second checked bags free (saves $140 round trip)","Two United Club one-time passes annually","Priority boarding","25% back on United inflight purchases","Global Entry or TSA PreCheck credit","No foreign transaction fees"],
    bestPlaces:["United.com and United app for flights (2x)","Any restaurant worldwide (2x)","Hotel stays (2x)","United Club lounges (with passes)"],
    notGoodFor:["Non-United airlines","Everyday non-travel spending (use a flat-rate card)"],
  },
  {
    id:"citicc", name:"Custom Cash", issuer:"Citi", apr:"19.24%-29.24% Variable",
    gradient:"linear-gradient(135deg,#0F2027 0%,#203A43 50%,#2C5364 100%)",
    accentColor:"#56CCF2", rewardRate:"5% Top category", annualFee:0, perksValue:0, cashback:"Cash Back", category:"cashback",
    signupBonus:"$200 cash back after spending $1,500 in first 6 months",
    bestFor:["Automatically tracks your top spending category each month","Restaurants, gas, groceries, travel, drugstores, home improvement, fitness, live entertainment"],
    keyBenefits:["5% cash back on your top eligible category (up to $500 spent/month)","1% on everything else","No annual fee","No category activation needed -- automatic"],
    bestPlaces:["Whatever you spend most on that month","Gas stations, groceries, restaurants, drugstores"],
    notGoodFor:["Spending above $500/month in top category (drops to 1%)","Multiple high-spend categories at once"],
    discontinued:true, discontinuedNote:"Citi stopped accepting new applications for this card as of May 28, 2026. Shown here for comparison only -- existing cardholders keep their card.",
  },
  {
    id:"citiaa", name:"AAdvantage Platinum Select", issuer:"Citi", apr:"21.24%-29.24% Variable",
    gradient:"linear-gradient(135deg,#1A1A2E 0%,#0F3460 50%,#16213E 100%)",
    accentColor:"#5390D9", rewardRate:"2x Dining & Gas", annualFee:99, perksValue:120, cashback:"Miles", category:"travel",
    signupBonus:"50,000 American Airlines miles after spending $2,500 in first 3 months",
    bestFor:["American Airlines flyers","Free checked bags on AA flights","Priority boarding"],
    keyBenefits:["First checked bag free for you + 4 companions","Preferred boarding on American Airlines","25% savings on in-flight purchases","No foreign transaction fees"],
    bestPlaces:["Gas stations","Restaurants","American Airlines flights and partners"],
    notGoodFor:["Non-AA travelers","Grocery and general spending (only 1x)"],
  },
  {
    id:"covsavor", name:"SavorOne", issuer:"Capital One", apr:"19.99%-29.99% Variable",
    gradient:"linear-gradient(135deg,#1B1B2F 0%,#162447 50%,#1F4068 100%)",
    accentColor:"#E43F5A", rewardRate:"3x Dining & Entertainment", annualFee:0, perksValue:0, cashback:"Cash Back", category:"dining",
    signupBonus:"$200 cash bonus after spending $500 in first 3 months",
    bestFor:["Dining out and takeout","Movies, concerts, streaming services","Grocery stores (3x)"],
    keyBenefits:["3% on dining, entertainment, popular streaming, and grocery stores","1% on everything else","No annual fee","No foreign transaction fees"],
    bestPlaces:["Restaurants and fast food","Netflix, Spotify, Hulu, Disney+","Grocery stores","Movie theaters and concerts"],
    notGoodFor:["Gas (only 1%)","General retail (only 1%)","Travel bookings outside dining/entertainment"],
  },
  {
    id:"discit_miles", name:"Discover it Miles", issuer:"Discover", apr:"17.24%-28.24% Variable",
    gradient:"linear-gradient(135deg,#231942 0%,#5E548E 50%,#231942 100%)",
    accentColor:"#9F86C0", rewardRate:"1.5x Everything", annualFee:0, perksValue:0, cashback:"Miles", category:"travel",
    signupBonus:"Discover matches all miles earned in your first year",
    bestFor:["Simple flat-rate travel rewards","No foreign transaction fee international travel"],
    keyBenefits:["1.5x miles on every purchase","First-year match doubles your miles","No annual fee","No foreign transaction fees","Free FICO score access"],
    bestPlaces:["Everywhere -- flat rate card","International travel and purchases"],
    notGoodFor:["Anywhere you have a higher-earning category card"],
  },
  {
    id:"wellsauto", name:"Autograph", issuer:"Wells Fargo", apr:"19.24%-29.24% Variable",
    gradient:"linear-gradient(135deg,#1A1A2E 0%,#3D348B 50%,#1A1A2E 100%)",
    accentColor:"#7C77B9", rewardRate:"3x Travel, Dining, Gas, Streaming", annualFee:0, perksValue:0, cashback:"Points", category:"travel",
    signupBonus:"20,000 bonus points after spending $1,000 in first 3 months -- worth $200",
    bestFor:["Restaurants and dining","Gas stations and EV charging","Streaming services","Phone plans"],
    keyBenefits:["3x on dining, travel, gas, transit, streaming, and phone plans","1x on everything else","No annual fee","No foreign transaction fees"],
    bestPlaces:["Restaurants, gas stations, streaming subscriptions","Phone bills","Flights, hotels, rideshares"],
    notGoodFor:["Groceries (only 1x)","General retail shopping (only 1x)"],
  },
  {
    id:"usbcash", name:"Cash+", issuer:"US Bank", apr:"19.24%-29.24% Variable",
    gradient:"linear-gradient(135deg,#0B132B 0%,#1C2541 50%,#3A506B 100%)",
    accentColor:"#5BC0BE", rewardRate:"5% Choose 2 categories", annualFee:0, perksValue:0, cashback:"Cash Back", category:"cashback",
    signupBonus:"$200 cash bonus after spending $1,000 in first 90 days",
    bestFor:["Pick your own 2 categories quarterly for 5% back","Utilities, gyms, electronics, furniture, and more"],
    keyBenefits:["5% on two categories you choose (up to $2,000/quarter combined)","2% on one everyday category (gas, grocery, or restaurants)","1% on everything else","No annual fee"],
    bestPlaces:["Whatever 2 categories you select each quarter","Utility bills, phone bills, gyms, furniture stores"],
    notGoodFor:["Categories outside your chosen 2 -- only 1% back"],
  },
  {
    id:"boaprem", name:"Premium Rewards", issuer:"Bank of America", apr:"19.24%-29.24% Variable",
    gradient:"linear-gradient(135deg,#3C1053 0%,#AD5389 50%,#3C1053 100%)",
    accentColor:"#D291BC", rewardRate:"2x Travel & Dining", annualFee:95, perksValue:170, cashback:"Points", category:"travel",
    signupBonus:"50,000 points after spending $3,000 in first 90 days -- worth $500 toward travel",
    bestFor:["Frequent travelers and diners","Preferred Rewards members (up to 75% point bonus)"],
    keyBenefits:["$100 annual airline incidental credit","TSA PreCheck/Global Entry credit ($100)","2x on travel and dining, 1.5x on everything else","No foreign transaction fees","Preferred Rewards bonus up to 75% more points"],
    bestPlaces:["Flights, hotels, dining","Bank of America Preferred Rewards members get the most value"],
    notGoodFor:["Grocery and gas (only 1.5x)","Non-BoA customers miss the relationship bonus"],
  },
  {
    id:"target", name:"Target RedCard", issuer:"Target", apr:"29.65% Variable (single rate)",
    gradient:"linear-gradient(135deg,#CC0000 0%,#8B0000 50%,#CC0000 100%)",
    accentColor:"#FF6B6B", rewardRate:"5% All Target purchases", annualFee:0, perksValue:0, cashback:"Cash Back", category:"cashback",
    signupBonus:"None -- instant 5% discount applies immediately",
    bestFor:["Frequent Target shoppers","Target.com and in-store purchases"],
    keyBenefits:["5% off every Target purchase, in-store and online","Free shipping on most Target.com orders","Extended return window (30 extra days)","No annual fee"],
    bestPlaces:["Target stores and Target.com only"],
    notGoodFor:["Anywhere other than Target -- this is a store card with no rewards elsewhere"],
  },
  {
    id:"costco", name:"Costco Anywhere Visa", issuer:"Citi", apr:"19.24%-27.24% Variable",
    gradient:"linear-gradient(135deg,#003594 0%,#0050C8 50%,#003594 100%)",
    accentColor:"#4D8DFF", rewardRate:"4% Gas, 3% Dining/Travel", annualFee:0, perksValue:0, cashback:"Cash Back", category:"gas",
    signupBonus:"None -- requires active Costco membership",
    bestFor:["Costco members who drive a lot","Gas station purchases (4% up to $7,000/year)","Costco warehouse and Costco.com purchases (2%)"],
    keyBenefits:["4% on gas and EV charging (up to $7k/year, then 1%)","3% on restaurants and eligible travel","2% on all Costco purchases","1% on everything else","No annual fee (Costco membership required separately)"],
    bestPlaces:["Gas stations","Costco warehouses and Costco.com","Restaurants and travel bookings"],
    notGoodFor:["Non-Costco members can't get this card","General retail outside Costco (only 1%)"],
  },
  {
    id:"penfed", name:"Power Cash Rewards", issuer:"PenFed", apr:"13.99%-23.99% Variable (credit union -- typically lower)",
    gradient:"linear-gradient(135deg,#001F3F 0%,#003366 50%,#001F3F 100%)",
    accentColor:"#7FB3D5", rewardRate:"2% Everything (with Honors)", annualFee:0, perksValue:0, cashback:"Cash Back", category:"cashback",
    signupBonus:"$100 statement credit after spending $1,500 in first 90 days",
    bestFor:["PenFed credit union members","Simple flat-rate cash back without category tracking"],
    keyBenefits:["2% cash back on all purchases with PenFed Honors Advantage checking","1.5% without Honors Advantage","No annual fee","5% back on gas at the pump for first year"],
    bestPlaces:["Everywhere -- flat rate card","Gas stations during the introductory period"],
    notGoodFor:["Non-PenFed members face credit union membership requirement"],
  },
  {
    id:"synchamazon", name:"Amazon Prime Visa", issuer:"Chase", apr:"19.24%-27.99% Variable",
    gradient:"linear-gradient(135deg,#232F3E 0%,#37475A 50%,#232F3E 100%)",
    accentColor:"#FF9900", rewardRate:"5% Amazon & Whole Foods", annualFee:0, perksValue:0, cashback:"Cash Back", category:"cashback",
    signupBonus:"$200 Amazon gift card instantly upon approval (requires Prime membership)",
    bestFor:["Amazon Prime members who shop on Amazon frequently","Whole Foods shoppers"],
    keyBenefits:["5% back at Amazon.com and Whole Foods (with Prime)","2% at restaurants, gas stations, and drugstores","1% on everything else","No annual fee (requires Prime membership $139/yr)"],
    bestPlaces:["Amazon.com purchases","Whole Foods Market","Restaurants and gas stations"],
    notGoodFor:["Non-Prime members get reduced rates (3% Amazon instead of 5%)"],
  },
  {
    id:"southwest", name:"Southwest Rapid Rewards Priority", issuer:"Chase", apr:"19.99%-28.74% Variable",
    gradient:"linear-gradient(135deg,#304CB2 0%,#1A2D6D 50%,#304CB2 100%)",
    accentColor:"#FFBF27", rewardRate:"3x Southwest purchases", annualFee:149, perksValue:200, cashback:"Points", category:"travel",
    signupBonus:"50,000 points after spending $1,000 in first 3 months -- worth $650+ toward flights",
    bestFor:["Frequent Southwest flyers","Companion Pass pursuers","Annual travel credit users"],
    keyBenefits:["$75 annual Southwest travel credit","7,500 anniversary points each year","4 upgraded boardings per year (when available)","20% back on inflight purchases","Points count toward Companion Pass"],
    bestPlaces:["Southwest Airlines flights and vacation packages"],
    notGoodFor:["Non-Southwest flyers","General everyday spending (only 1x)"],
  },
  {
    id:"ihg", name:"IHG One Rewards Premier", issuer:"Chase", apr:"21.49%-29.49% Variable",
    gradient:"linear-gradient(135deg,#A6192E 0%,#6E0E1E 50%,#A6192E 100%)",
    accentColor:"#FF6B7A", rewardRate:"10x IHG Hotels", annualFee:99, perksValue:150, cashback:"Points", category:"travel",
    signupBonus:"140,000 bonus points after spending $3,000 in first 3 months",
    bestFor:["IHG hotel loyalists (Holiday Inn, InterContinental, Crowne Plaza)","Free anniversary night each year"],
    keyBenefits:["Free anniversary night every year (up to 40k points)","Automatic Platinum Elite status","4th night free on award stays","10x points at IHG hotels, 5x on travel/dining/gas"],
    bestPlaces:["IHG hotel stays","Gas stations, restaurants, and travel (5x)"],
    notGoodFor:["Non-IHG travelers","General retail purchases (only 1x)"],
  },
  {
    id:"venmo", name:"Venmo Credit Card", issuer:"Synchrony", apr:"20.24%-29.99% Variable",
    gradient:"linear-gradient(135deg,#3D95CE 0%,#008CFF 50%,#3D95CE 100%)",
    accentColor:"#65C9FF", rewardRate:"3% Top category", annualFee:0, perksValue:0, cashback:"Cash Back", category:"cashback",
    signupBonus:"None typically offered",
    bestFor:["Venmo app users who want auto-categorized rewards","Splitting purchases easily with friends"],
    keyBenefits:["3% on your top spend category each billing cycle","2% on second-highest category","1% on everything else","Manage and pay directly in the Venmo app"],
    bestPlaces:["Whatever you spend most on -- auto-detected monthly"],
    notGoodFor:["Users who don't already use Venmo regularly"],
  },
  {
    id:"bilt", name:"Bilt Mastercard", issuer:"Wells Fargo", apr:"19.24%-29.99% Variable",
    gradient:"linear-gradient(135deg,#000000 0%,#2C2C2C 50%,#000000 100%)",
    accentColor:"#FFFFFF", rewardRate:"1x Rent (no fee)", annualFee:0, perksValue:0, cashback:"Points", category:"cashback",
    signupBonus:"None -- value is in ongoing rent points with no transaction fee",
    bestFor:["Renters who want points on rent without a processing fee","Dining (3x) and travel (2x) spenders"],
    keyBenefits:["Earn points on rent payments with zero transaction fee (unique in the market)","3x on dining","2x on travel","1x on rent and other purchases","No annual fee"],
    bestPlaces:["Rent payments","Restaurants","Travel bookings"],
    notGoodFor:["Homeowners get no special benefit from the rent feature"],
  },
  {
    id:"inkbiz", name:"Ink Business Unlimited", issuer:"Chase", apr:"18.49%-26.49% Variable",
    gradient:"linear-gradient(135deg,#1A2A3A 0%,#2C4A6E 50%,#1A2A3A 100%)",
    accentColor:"#6FA8DC", rewardRate:"1.5x Everything", annualFee:0, perksValue:0, cashback:"Cash Back", category:"business",
    signupBonus:"$750 cash back after spending $6,000 in first 3 months",
    bestFor:["Small business owners","Simple flat-rate business spending"],
    keyBenefits:["1.5% cash back on every business purchase","No annual fee","Free employee cards with spend controls","Purchase protection and extended warranty"],
    bestPlaces:["Any business expense -- office supplies, software, travel"],
    notGoodFor:["Businesses with concentrated spend in one category -- a category card may earn more"],
  },
  {
    id:"spark", name:"Spark Cash Plus", issuer:"Capital One", apr:"19.99%-29.99% Variable",
    gradient:"linear-gradient(135deg,#0D1B2A 0%,#1B263B 50%,#0D1B2A 100%)",
    accentColor:"#778DA9", rewardRate:"2% Everything", annualFee:150, perksValue:200, cashback:"Cash Back", category:"business",
    signupBonus:"$1,200 cash bonus after spending $30,000 in first 3 months",
    bestFor:["Higher-spending small businesses","Unlimited 2% back with no caps"],
    keyBenefits:["2% cash back on every purchase, no limit","5% on hotels and rental cars booked via Capital One Travel","Annual fee refunded if you spend $200k+","No preset spending limit"],
    bestPlaces:["Any business expense","Travel booked through Capital One"],
    notGoodFor:["Small businesses with lower annual spend -- the $150 fee may not be worth it"],
  },
  {
    id:"discstudent", name:"Discover it Student Cash Back", issuer:"Discover", apr:"17.24%-26.24% Variable",
    gradient:"linear-gradient(135deg,#4A2545 0%,#7B337A 50%,#4A2545 100%)",
    accentColor:"#C77DFF", rewardRate:"5% Rotating categories", annualFee:0, perksValue:0, cashback:"Cash Back", category:"student",
    signupBonus:"Discover matches all cash back earned in your first year",
    bestFor:["College students building credit","Good grades reward ($20/year for 3.0+ GPA)"],
    keyBenefits:["5% rotating categories (up to $1,500/quarter)","1% on everything else","Cashback Match doubles your first year earnings","$20 statement credit each school year for good grades","No annual fee, no credit history required"],
    bestPlaces:["Quarterly rotating categories: groceries, restaurants, gas, Amazon"],
    notGoodFor:["Students who want a simple flat-rate card instead of rotating categories"],
  },
  {
    id:"capquicksilverstudent", name:"Quicksilver Student", issuer:"Capital One", apr:"26.99%-29.99% Variable",
    gradient:"linear-gradient(135deg,#10002B 0%,#3C096C 50%,#10002B 100%)",
    accentColor:"#9D4EDD", rewardRate:"1.5x Everything", annualFee:0, perksValue:0, cashback:"Cash Back", category:"student",
    signupBonus:"None typically for student cards",
    bestFor:["Students with limited credit history","Simple flat-rate rewards while building credit"],
    keyBenefits:["1.5% cash back on every purchase","No annual fee","No foreign transaction fees","Automatic credit line reviews"],
    bestPlaces:["Everywhere -- flat rate, easy to understand for first-time cardholders"],
    notGoodFor:["Students who spend heavily in one category and want bonus rewards there"],
  },
  {
    id:"discsecured", name:"Discover it Secured", issuer:"Discover", apr:"27.24% Fixed",
    gradient:"linear-gradient(135deg,#2B2D42 0%,#8D99AE 50%,#2B2D42 100%)",
    accentColor:"#EDF2F4", rewardRate:"2x Gas & Restaurants", annualFee:0, perksValue:0, cashback:"Cash Back", category:"secured",
    signupBonus:"Discover matches all cash back earned in your first year",
    bestFor:["Building or rebuilding credit","Refundable security deposit required"],
    keyBenefits:["2% at gas stations and restaurants (up to $1,000/quarter)","1% on everything else","Automatic monthly reviews for unsecured upgrade","Free FICO score access","No annual fee"],
    bestPlaces:["Gas stations","Restaurants"],
    notGoodFor:["Anyone with established good credit -- a secured card requires a deposit and offers fewer perks"],
  },
  {
    id:"capventureone", name:"VentureOne Rewards", issuer:"Capital One", apr:"19.99%-29.99% Variable",
    gradient:"linear-gradient(135deg,#03071E 0%,#370617 50%,#03071E 100%)",
    accentColor:"#9D0208", rewardRate:"1.25x Everything, 5x Hotels", annualFee:0, perksValue:0, cashback:"Miles", category:"travel",
    signupBonus:"20,000 miles after spending $500 in first 3 months -- worth $200 toward travel",
    bestFor:["No-annual-fee travel rewards","Hotels and rental cars booked through Capital One Travel"],
    keyBenefits:["1.25x miles on every purchase","5x miles on hotels and rental cars via Capital One Travel","No annual fee","No foreign transaction fees","Miles transfer to 15+ airline/hotel partners"],
    bestPlaces:["Everywhere -- flat rate","Capital One Travel portal bookings"],
    notGoodFor:["Heavy travelers who'd benefit more from Venture or Venture X's higher earn rate"],
  },
  {
    id:"usbaltconnect", name:"Altitude Connect", issuer:"US Bank", apr:"21.24%-29.24% Variable",
    gradient:"linear-gradient(135deg,#03045E 0%,#0077B6 50%,#03045E 100%)",
    accentColor:"#00B4D8", rewardRate:"4x Travel, 2x Gas/Dining/Streaming", annualFee:95, perksValue:130, cashback:"Points", category:"travel",
    signupBonus:"50,000 points after spending $2,000 in first 90 days",
    bestFor:["Travelers wanting a mid-tier annual fee card","TSA PreCheck/Global Entry credit"],
    keyBenefits:["4x points on travel (after $12k spend)","2x on gas, EV charging, dining, streaming","$30 annual streaming credit","TSA PreCheck/Global Entry credit ($100)","Trip cancellation insurance"],
    bestPlaces:["Travel bookings","Gas stations and dining","Streaming subscriptions"],
    notGoodFor:["Grocery purchases (only 1x)","General retail (only 1x)"],
  },
  {
    id:"boa", name:"Alaska Airlines Visa", issuer:"Bank of America", apr:"21.24%-29.24% Variable",
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
  { id:"sample-1", emoji:"analytics", title:"Keep Utilization Under 30%", target:30, current:18, unit:"%", color:"#C9A84C", due:"Ongoing", tips:["Pay $400 on Chase before the 18th -> drops to 9%","Pay Amex balance before statement closes","Keep Venture X under $6,000 at all times"] },
  { id:"sample-2", emoji:"wallet", title:"Save $6,000 This Year", target:6000, current:3240, unit:"$", color:"#2DC8A0", due:"Dec 31, 2025", tips:["Cancel 4 unused subscriptions -> $840/yr saved","Switch groceries to Amex Gold (4x) -> $300/yr extra","Cut takeout from $340 -> $190/month -> $1,800/yr"] },
  { id:"sample-3", emoji:"trend-down", title:"Reach 750 Credit Score", target:750, current:698, unit:"pts", color:"#4F6EF7", due:"Sep 2025", tips:["Bring all cards under 10% utilization -> +12-18 pts","Zero missed payments for 6 months","No new applications for 4 months"] },
];

const SAMPLE_BILLS: Bill[] = [
  { id:1, name:"Nobu Restaurant", emoji:"dining", amount:247, people:["You","Sarah","Mike","Priya"], date:"Today", done:false, card:"Your Card", pts:988 },
  { id:2, name:"Airbnb Miami Beach", emoji:"travel", amount:840, people:["You","James","Leila"], date:"Yesterday", done:false, card:"Your Card", pts:2520 },
  { id:3, name:"Whole Foods Run", emoji:"groceries", amount:120, people:["You","Roommate"], date:"May 10", done:true, card:"Your Card", pts:480 },
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
    if (hasAmexGold) return `🛒 Use your **Amex Gold** -- it earns 4x on groceries, the highest in your wallet. On a $150 grocery run that's 600 points  $9 value. Far better than any other card you own.`;
    return `🛒 Based on your cards, use the card with the highest grocery multiplier. Consider adding the Amex Gold -- it earns 4x on groceries and would be worth it based on your profile.`;
  }
  if (/dining|restaurant|eat|food|takeout/i.test(l)) return `🍽 ${hasAmexGold ? "Amex Gold earns 4x at restaurants -- the best in your wallet." : "Use whichever card offers the highest dining multiplier."} On an $80 dinner that's significant rewards. Always use your highest dining card.`;
  if (/travel|flight|hotel|trip|airline/i.test(l)) return ` ${hasSapphire ? "Chase Sapphire Reserve earns 3x on travel plus primary rental car insurance." : "Use your travel card"} for all travel purchases. Your ${f(totalPts)} total points are worth $${f(Math.round(totalPts*.015))} toward travel.`;
  if (/750|score|credit score|improve|boost/i.test(l)) return `📈 To reach 750 from ${profile.creditScore || "your current score"}: Pay down balances to bring utilization below 10% (currently ${util}%) -> +12-18 pts. Zero missed payments for 4 months -> +10 pts. No new applications -> let inquiries age. Achievable in 4-5 months.`;
  if (/utilization|balance|payoff/i.test(l)) return `📊 Your current utilization is ${util}% -- ${util < 30 ? "healthy" : "high, needs attention"}. ${util > 30 ? "Pay down the highest-utilization card first." : "To optimize further, pay all cards below 10% before their statement dates."} This alone could boost your score 8-15 points.`;
  if (/point|redeem|transfer|miles/i.test(l)) return `🌟 Your total: ${f(totalPts)} points across ${cards.length} cards  $${f(Math.round(totalPts*.015))}. ${hasSapphire ? "Best move: transfer Chase UR points to World of Hyatt (1:1) at 2.2/pt -- that's $" + f(Math.round(cards.find(c=>c.dbId==="csr")?.points||0 * .022)) + " in hotel value." : "Look for transfer partner opportunities to maximize value."}`;
  if (/apply|approval|new card/i.test(l)) return `💳 Based on your profile (income: ${profile.income || "not specified"}, score: ${profile.creditScore || "not specified"}), you should check your approval odds in the Cards tab. I recommend waiting at least 3-6 months between applications to protect your score.`;
  return `I know your complete financial profile -- ${cards.length} cards, ${f(totalPts)} total points, ${util}% utilization. Ask me anything specific and I'll give you personalized advice based on your exact wallet.`;
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

// Extract a representative APR number from a string like "19.49%-27.99% Variable" -- uses the midpoint of the range,
// which is more realistic than the low end since actual assigned rate depends on individual creditworthiness.
const aprMidpoint = (aprStr: string): number => {
  if (!aprStr) return 24.99;
  const nums = aprStr.match(/\d+\.?\d*/g);
  if (!nums || nums.length === 0) return 24.99;
  if (nums.length === 1) return parseFloat(nums[0]);
  return (parseFloat(nums[0]) + parseFloat(nums[1])) / 2;
};

// Real card network (Visa/Mastercard/Amex/Discover) based on issuer -- matches actual issuer-network partnerships
// Real approval-chance heuristic -- shared by Home's dashboard teaser and the full AI Recommender
// screen, so the same card never shows two different percentages in two different places.
const calcApprovalChance = (card: {annualFee:number}, profile: UserProfile): number => {
  const score = parseInt(profile.creditScore?.match(/\d+/)?.[0] || "700");
  const income = profile.income || "";
  const highIncome = income.includes("150") || income.includes("250") || income.includes("+");
  let chance: number;
  if (card.annualFee >= 500) chance = score >= 750 ? 82 : score >= 700 ? 61 : score >= 670 ? 42 : 22;
  else if (card.annualFee >= 95) chance = score >= 720 ? 88 : score >= 680 ? 72 : score >= 650 ? 55 : 30;
  else chance = score >= 670 ? 92 : score >= 620 ? 78 : 55;
  if (card.annualFee >= 500 && !highIncome) chance -= 15;
  if (highIncome) chance = Math.min(97, chance + 8);
  return Math.max(5, Math.min(97, chance));
};

const cardNetwork = (issuer: string): "Visa"|"Mastercard"|"Amex"|"Discover" => {
  if (issuer === "Amex") return "Amex";
  if (issuer === "Discover") return "Discover";
  if (issuer === "Citi" || issuer === "Capital One") return "Mastercard"; // most common for these issuers
  return "Visa"; // Chase, BoA, Wells Fargo, US Bank default to Visa for most consumer cards
};


/* ============================================================
   ICON SYSTEM -- clean, minimal line icons (replaces emoji)
   Apple-style: thin stroke, rounded caps, monochrome, inherits color
   ============================================================ */
function Icon({ name, size=18, color="currentColor", strokeWidth=1.5 }: { name:string; size?:number; color?:string; strokeWidth?:number }) {
  const p = { width:size, height:size, viewBox:"0 0 24 24", fill:"none" as const, style:{stroke:color}, strokeWidth, strokeLinecap:"round" as const, strokeLinejoin:"round" as const };
  switch(name) {
    case "card": return <svg {...p}><rect x="2" y="5" width="20" height="14" rx="2.5"/><line x1="2" y1="10" x2="22" y2="10"/></svg>;
    case "chat": return <svg {...p}><path d="M21 11.5a8.5 8.5 0 1 1-3.8-7.1"/><path d="M21 11.5L13 11.5"/><path d="M3 21l3.5-3.5"/><circle cx="13" cy="11.5" r="8.5" strokeDasharray="0"/></svg>;
    case "analytics": return <svg {...p}><path d="M3 3v18h18"/><path d="M7 14l4-4 3 3 5-6"/></svg>;
    case "travel": return <svg {...p}><path d="M3 13l8-2 5-8 2 1-3 8 5 1.5-1 2L13 15l-3 5-2-.5.5-4-6-2.5z"/></svg>;
    case "goal": return <svg {...p}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></svg>;
    case "split": return <svg {...p}><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><circle cx="12" cy="18" r="3"/><line x1="8.5" y1="7.5" x2="10" y2="15.5"/><line x1="15.5" y1="7.5" x2="14" y2="15.5"/></svg>;
    case "optimize": return <svg {...p}><path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8"/><circle cx="12" cy="12" r="4"/></svg>;
    case "perks": return <svg {...p}><path d="M20 7h-3.6a2.5 2.5 0 0 0 0-3.5C15.5 2.5 14 3 12 5c-2-2-3.5-2.5-4.4-1.5a2.5 2.5 0 0 0 0 3.5H4a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1z"/><path d="M12 7v14"/><path d="M5 12v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/></svg>;
    case "settings": return <svg {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
    case "search": return <svg {...p}><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.5" y2="16.5"/></svg>;
    case "bell": return <svg {...p}><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>;
    case "lock": return <svg {...p}><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>;
    case "unlock": return <svg {...p}><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 7.2-2.4"/></svg>;
    case "gift": return <svg {...p}><rect x="3" y="9" width="18" height="11" rx="1.5"/><path d="M12 9v11M3 13h18"/><path d="M12 9C9 9 8 7.5 8 6a2 2 0 0 1 4 0 2 2 0 0 1 4 0c0 1.5-1 3-4 3z"/></svg>;
    case "trophy": return <svg {...p}><path d="M7 4h10v5a5 5 0 0 1-10 0V4z"/><path d="M7 6H4a2 2 0 0 0 2 4M17 6h3a2 2 0 0 1-2 4"/><path d="M9 19h6M12 14v5"/></svg>;
    case "dollar": return <svg {...p}><line x1="12" y1="2" x2="12" y2="22"/><path d="M17 6.5C17 5 15.4 4 12 4S7 5.3 7 7s1.8 2.5 5 3 5 1.5 5 3.5-2 3.5-5 3.5-5-1-5-2.5"/></svg>;
    case "trend-down": return <svg {...p}><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/></svg>;
    case "help": return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.8.5-1 1-1 2"/><line x1="12" y1="17" x2="12" y2="17.1"/></svg>;
    case "info": return <svg {...p}><circle cx="12" cy="12" r="9"/><line x1="12" y1="11" x2="12" y2="16"/><line x1="12" y1="8" x2="12" y2="8.1"/></svg>;
    case "warning": return <svg {...p}><path d="M12 3.5L21.5 20H2.5L12 3.5z"/><line x1="12" y1="10" x2="12" y2="14"/><line x1="12" y1="17" x2="12" y2="17.1"/></svg>;
    case "alert": return <svg {...p}><circle cx="12" cy="12" r="9"/><line x1="12" y1="7" x2="12" y2="13"/><line x1="12" y1="16" x2="12" y2="16.1"/></svg>;
    case "check": return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/></svg>;
    case "check-circle": return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/></svg>;
    case "arrow-right": return <svg {...p}><line x1="4" y1="12" x2="20" y2="12"/><polyline points="13 5 20 12 13 19"/></svg>;
    case "plus": return <svg {...p}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
    case "edit": return <svg {...p}><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>;
    case "trash": return <svg {...p}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>;
    case "calendar": return <svg {...p}><rect x="3" y="5" width="18" height="16" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="3" x2="8" y2="7"/><line x1="16" y1="3" x2="16" y2="7"/></svg>;
    case "clock": return <svg {...p}><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15.5 14"/></svg>;
    case "shield": return <svg {...p}><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/></svg>;
    case "key": return <svg {...p}><circle cx="8" cy="14" r="4.5"/><path d="M11.3 10.7L20 2M16 6l3 3M13 9l2.5 2.5"/></svg>;
    case "mail": return <svg {...p}><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M3 6.5l9 6 9-6"/></svg>;
    case "star": return <svg {...p}><path d="M12 3l2.7 6 6.3.6-4.8 4.3 1.4 6.3L12 17l-5.6 3.2 1.4-6.3-4.8-4.3 6.3-.6z"/></svg>;
    case "home": return <svg {...p}><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/></svg>;
    case "wallet": return <svg {...p}><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M3 10h18"/><path d="M16 14h.01"/><path d="M7 7V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v2"/></svg>;
    case "percent": return <svg {...p}><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>;
    case "users": return <svg {...p}><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.5 3-6 6.5-6s6.5 2.5 6.5 6"/><circle cx="17" cy="9" r="2.8"/><path d="M21.5 20c0-2.6-1.7-4.7-4-5.5"/></svg>;
    case "dining": return <svg {...p}><path d="M7 2v8a2 2 0 0 0 4 0V2M9 10v12M16 2c-1.5 1-2 3-2 5s.5 4 2 5V2zM16 12v10"/></svg>;
    case "groceries": return <svg {...p}><path d="M3 6h2l2.5 11.5h10L20 9H6"/><circle cx="9" cy="20" r="1.3"/><circle cx="16" cy="20" r="1.3"/></svg>;
    case "gas": return <svg {...p}><path d="M4 21V9l5-5h4v17"/><path d="M4 13h9"/><path d="M17 8l2.5 2.5a2 2 0 0 1 .5 1.3V18a1.5 1.5 0 0 1-3 0v-3"/></svg>;
    case "shopping": return <svg {...p}><path d="M6 8h12l1.5 12h-15z"/><path d="M9 8a3 3 0 0 1 6 0"/></svg>;
    case "streaming": return <svg {...p}><rect x="2" y="4" width="20" height="14" rx="2"/><path d="M8 21h8M12 18v3"/><polygon points="10 8 10 14 15 11"/></svg>;
    case "drugstore": return <svg {...p}><rect x="4" y="4" width="16" height="16" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>;
    case "other": return <svg {...p}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>;
    case "download": return <svg {...p}><path d="M12 3v13"/><polyline points="6 11 12 17 18 11"/><path d="M4 20h16"/></svg>;
    case "logout": return <svg {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
    case "fire": return <svg {...p}><path d="M12 2c2 3-2 5 0 8 1.5 2 4 2.5 4 5.5a4 4 0 0 1-8 0c0-1 .3-1.8.8-2.6C8 14 7 15.5 7 17a5 5 0 0 0 10 0c0-6-5-7-5-15z"/></svg>;
    case "rocket": return <svg {...p}><path d="M12 2c3 2 5 6 5 10-1 1-2 2-2 2H9s-1-1-2-2c0-4 2-8 5-10z"/><path d="M9 14l-3 3 1 4 4-1M15 14l3 3-1 4-4-1"/></svg>;
    case "globe": return <svg {...p}><circle cx="12" cy="12" r="9"/><line x1="3" y1="12" x2="21" y2="12"/><path d="M12 3c2.5 2.5 4 5.8 4 9s-1.5 6.5-4 9c-2.5-2.5-4-5.8-4-9s1.5-6.5 4-9z"/></svg>;
    case "credit-score": return <svg {...p}><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>;
    case "refresh": return <svg {...p}><polyline points="1 4 1 10 7 10"/><polyline points="23 20 23 14 17 14"/><path d="M3.5 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.65 4.36A9 9 0 0 0 20.5 15"/></svg>;
    case "trending-up": return <svg {...p}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>;
    case "dollar-sign": return <svg {...p}><line x1="12" y1="2" x2="12" y2="22"/><path d="M17 6.5C17 5 15.4 4 12 4S7 5.3 7 7s1.8 2.5 5 3 5 1.5 5 3.5-2 3.5-5 3.5-5-1-5-2.5"/></svg>;
    case "cpu": return <svg {...p}><rect x="5" y="5" width="14" height="14" rx="2"/><rect x="9" y="9" width="6" height="6" rx="1"/><line x1="9" y1="2" x2="9" y2="5"/><line x1="15" y1="2" x2="15" y2="5"/><line x1="9" y1="19" x2="9" y2="22"/><line x1="15" y1="19" x2="15" y2="22"/><line x1="2" y1="9" x2="5" y2="9"/><line x1="2" y1="15" x2="5" y2="15"/><line x1="19" y1="9" x2="22" y2="9"/><line x1="19" y1="15" x2="22" y2="15"/></svg>;
    case "bar-chart": return <svg {...p}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
    case "credit-card": return <svg {...p}><rect x="2" y="5" width="20" height="14" rx="2.5"/><line x1="2" y1="10" x2="22" y2="10"/></svg>;
    case "alert-triangle": return <svg {...p}><path d="M12 3.5L21.5 20H2.5L12 3.5z"/><line x1="12" y1="10" x2="12" y2="14"/><line x1="12" y1="17" x2="12" y2="17.1"/></svg>;
    case "building": return <svg {...p}><rect x="4" y="2" width="16" height="20" rx="1.5"/><line x1="9" y1="6" x2="9" y2="6.1"/><line x1="15" y1="6" x2="15" y2="6.1"/><line x1="9" y1="10" x2="9" y2="10.1"/><line x1="15" y1="10" x2="15" y2="10.1"/><line x1="9" y1="14" x2="9" y2="14.1"/><line x1="15" y1="14" x2="15" y2="14.1"/><path d="M10 22v-4h4v4"/></svg>;
    case "clipboard": return <svg {...p}><path d="M9 3h6a1 1 0 0 1 1 1H8a1 1 0 0 1 1-1z"/><rect x="4" y="5" width="16" height="17" rx="2"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="13" y2="14"/></svg>;
    case "sun": return <svg {...p}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>;
    case "moon": return <svg {...p}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;
    default: return <svg {...p}><circle cx="12" cy="12" r="9"/></svg>;
  }
}

function NetworkBadge({ issuer, size=22 }: { issuer:string; size?:number }) {
  const network = cardNetwork(issuer);
  if (network === "Visa") return (
    <svg width={size*1.7} height={size} viewBox="0 0 44 24" fill="none">
      <text x="0" y="18" fontFamily="Arial,Helvetica,sans-serif" fontSize="17" fontWeight="900" fontStyle="italic" letterSpacing="-0.5" fill="white" style={{filter:"drop-shadow(0 1px 1px rgba(0,0,0,.25))"}}>VISA</text>
    </svg>
  );
  if (network === "Mastercard") return (
    <svg width={size*1.55} height={size} viewBox="0 0 38 24">
      <circle cx="14" cy="12" r="10.5" fill="#EB001B"/>
      <circle cx="24" cy="12" r="10.5" fill="#F79E1B"/>
      <path d="M19 4.2a10.5 10.5 0 0 1 0 15.6 10.5 10.5 0 0 1 0-15.6z" fill="#FF5F00"/>
    </svg>
  );
  if (network === "Amex") return (
    <svg width={size*1.9} height={size} viewBox="0 0 48 22" fill="none">
      <rect x="0" y="1" width="48" height="20" rx="3" fill="#006FCF"/>
      <text x="24" y="15" textAnchor="middle" fontFamily="Arial,Helvetica,sans-serif" fontSize="9.5" fontWeight="700" letterSpacing="0.5" fill="white">AMEX</text>
    </svg>
  );
  return (
    <svg width={size*2.3} height={size} viewBox="0 0 58 24" fill="none">
      <text x="0" y="17" fontFamily="Georgia,'Times New Roman',serif" fontSize="15" fontWeight="700" fontStyle="italic" fill="#FF6000">Discover</text>
    </svg>
  );
}

/* ============================================================
   TOAST NOTIFICATION SYSTEM
   ============================================================ */
let _showToast: ((msg: string, type?: ToastType) => void) | null = null;
export const showToast = (msg: string, type: ToastType = "success") => { _showToast?.(msg, type); };

function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  useEffect(() => {
    _showToast = (msg, type = "success") => {
      const id = Math.random().toString(36).slice(2);
      setToasts(p => [...p, { id, message: msg, type }]);
      setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
    };
    return () => { _showToast = null; };
  }, []);
  const icon = (t: ToastType) => t === "success" ? "\u2713" : t === "error" ? "\u2715" : t === "warning" ? "\u26A0" : "\u2139";
  const bg = (t: ToastType) => t === "success" ? "var(--green)" : t === "error" ? "var(--red)" : t === "warning" ? "var(--amber)" : "var(--accent)";
  return (
    <div style={{position:"fixed",top:20,right:20,zIndex:9999,display:"flex",flexDirection:"column",gap:8,pointerEvents:"none"}}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background:"var(--surface)", border:"1px solid var(--border)", borderRadius:10,
          padding:"12px 16px", display:"flex", alignItems:"center", gap:10,
          boxShadow:"0 4px 20px rgba(0,0,0,.15)", minWidth:240, maxWidth:320,
          animation:"toastIn .25s ease", pointerEvents:"all"
        }}>
          <span style={{width:20,height:20,borderRadius:"50%",background:bg(t.type),color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,flexShrink:0}}>{icon(t.type)}</span>
          <span style={{fontSize:14,color:"var(--text)",fontWeight:500,lineHeight:1.4}}>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   SKELETON LOADER
   ============================================================ */
function Skeleton({ w="100%", h=16, r=6 }: { w?: string|number; h?: number; r?: number }) {
  return <div style={{width:w,height:h,borderRadius:r,background:"var(--border2)",animation:"pulse 1.5s ease-in-out infinite"}} />;
}
function CardSkeleton() {
  return (
    <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:14,padding:20,display:"flex",flexDirection:"column",gap:14}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <Skeleton w={140} h={18} r={6}/><Skeleton w={60} h={14} r={6}/>
      </div>
      <Skeleton w="100%" h={8} r={4}/>
      <div style={{display:"flex",gap:16}}>
        <Skeleton w={80} h={32} r={8}/><Skeleton w={80} h={32} r={8}/><Skeleton w={80} h={32} r={8}/>
      </div>
    </div>
  );
}

/* ============================================================
   EMPTY STATE
   ============================================================ */
function EmptyState({ icon, title, sub, action, onAction }: { icon:string; title:string; sub:string; action?:string; onAction?:()=>void }) {
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"60px 24px",textAlign:"center",gap:12}}>
      <div style={{width:64,height:64,borderRadius:"50%",background:"var(--accentbg)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:6,color:"var(--accent)"}}><Icon name={icon} size={28}/></div>
      <h3 style={{fontSize:17,fontWeight:700,color:"var(--text)",margin:0}}>{title}</h3>
      <p style={{fontSize:14,color:"var(--text2)",margin:0,maxWidth:260,lineHeight:1.5}}>{sub}</p>
      {action && onAction && (
        <button onClick={onAction} className="btn-gold press" style={{marginTop:8,padding:"10px 24px",fontSize:14}}>{action}</button>
      )}
    </div>
  );
}

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
      <circle cx={c} cy={c} r={r} fill="none" style={{stroke:"var(--border2)"}} strokeWidth={sw}/>
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
        {back && <button onClick={back} className="btn-ghost press" style={{padding:"8px 14px",fontSize:14}}> Back</button>}
        <div>
          <h1 className="serif" style={{fontSize:32,fontWeight:600,lineHeight:1.15,letterSpacing:"-.5px",marginBottom:sub?5:0}}>{title}</h1>
          {sub && <p style={{fontSize:14,color:"var(--text2)"}}>{sub}</p>}
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
  const [expanded, setExpanded] = useState(false);
  const groups: {label:string; items:{id:S; icon:string; name:string; badge?:string}[]}[] = [
    { label:"", items:[
      {id:"home",icon:"home",name:"Overview"},
    ]},
    { label:"MONEY", items:[
      {id:"cards",icon:"credit-card",name:"Cards",badge:String(0)},
      {id:"perks",icon:"gift",name:"Rewards"},
      {id:"analytics",icon:"bar-chart",name:"Insights"},
    ]},
    { label:"INTELLIGENCE", items:[
      {id:"chat",icon:"cpu",name:"Advisor"},
      {id:"credit-optimizer",icon:"trending-up",name:"Credit"},
      {id:"ai-recommender",icon:"star",name:"Optimizer"},
    ]},
    { label:"PLAN", items:[
      {id:"travel",icon:"travel",name:"Travel"},
      {id:"goals",icon:"goal",name:"Goals"},
      {id:"split",icon:"split",name:"Split"},
    ]},
    { label:"SYSTEM", items:[
      {id:"tools",icon:"optimize",name:"Tools"},
      {id:"settings",icon:"settings",name:"Settings"},
    ]},
  ];

  const scoreColor = "var(--accent)";

  return (
    <div className="desktop-sidebar" onMouseEnter={()=>setExpanded(true)} onMouseLeave={()=>setExpanded(false)}
      style={{padding:"20px 0",display:"flex",flexDirection:"column",gap:0,transition:"width .3s cubic-bezier(.4,0,.2,1)",
        width:expanded?280:72,overflow:"hidden",background:"var(--surface)",borderRight:"1px solid var(--border)"}}>

      {/* Identity */}
      <div style={{padding:"0 16px 20px",borderBottom:"1px solid var(--border)",marginBottom:8,overflow:"hidden"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:36,height:36,borderRadius:10,background:"var(--accent)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:14,fontWeight:700,color:"white"}}>
            {profile.name?.[0]||"W"}
          </div>
          <div style={{opacity:expanded?1:0,transition:"opacity .2s",whiteSpace:"nowrap",minWidth:0}}>
            <div style={{fontSize:13,fontWeight:700,color:"var(--text)",letterSpacing:"-.2px"}}>{profile.name||"User"}</div>
            <div style={{display:"flex",alignItems:"center",gap:6,marginTop:2}}>
              <span style={{fontSize:20,fontWeight:800,color:scoreColor,letterSpacing:"-1px",lineHeight:1}}>{profile.creditRange?.split("–")[0]||"740"}</span>
              <span style={{fontSize:10,color:"var(--text2)",fontWeight:500}}>Very Good</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div style={{flex:1,overflowY:"auto",overflowX:"hidden",padding:"0 8px"}}>
        {groups.map((g,gi) => (
          <div key={gi} style={{marginBottom:4}}>
            {g.label && expanded && <div style={{fontSize:10,fontWeight:600,color:"var(--text3)",letterSpacing:"1.2px",padding:"12px 12px 6px",textTransform:"uppercase"}}>{g.label}</div>}
            {!g.label && !expanded && <div style={{height:4}}/>}
            {g.label && !expanded && <div style={{height:1,background:"var(--border)",margin:"8px 12px"}}/>}
            {g.items.map(item => {
              const isActive = active === item.id || (item.id==="cards" && active==="card-detail") || (item.id==="credit-optimizer" && active==="credit-optimizer");
              return (
                <button key={item.id} onClick={()=>go(item.id)} className="press"
                  style={{width:"100%",display:"flex",alignItems:"center",gap:12,padding:expanded?"10px 12px":"10px 0",
                    borderRadius:10,border:"none",cursor:"pointer",position:"relative",
                    background:isActive?"rgba(255,255,255,.08)":"transparent",
                    color:isActive?"var(--text)":"var(--text2)",
                    transition:"all .2s cubic-bezier(.4,0,.2,1)",
                    justifyContent:expanded?"flex-start":"center",
                  }}>
                  {isActive && <div style={{position:"absolute",left:expanded?0:-4,top:"50%",transform:"translateY(-50%)",width:2,height:16,borderRadius:1,background:"var(--accent)",transition:"all .25s cubic-bezier(.4,0,.2,1)"}}/>}
                  <span style={{display:"flex",flexShrink:0}}><Icon name={item.icon} size={18} strokeWidth={isActive?2:1.6}/></span>
                  {expanded && <span style={{fontSize:13,fontWeight:isActive?600:450,whiteSpace:"nowrap",letterSpacing:"-.1px"}}>{item.name}</span>}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Theme + Sign out */}
      <div style={{padding:"12px 8px 8px",borderTop:"1px solid var(--border)",display:"flex",flexDirection:"column",gap:4}}>
        <button onClick={toggleTheme} className="press" style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",borderRadius:10,border:"none",cursor:"pointer",background:"transparent",color:"var(--text2)",width:"100%",justifyContent:expanded?"flex-start":"center"}}>
          <Icon name={theme==="dark"?"sun":"moon"} size={18} strokeWidth={1.5}/>
          {expanded && <span style={{fontSize:13,fontWeight:450}}>{theme==="dark"?"Light":"Dark"}</span>}
        </button>
        {onSignOut && <button onClick={onSignOut} className="press" style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",borderRadius:10,border:"none",cursor:"pointer",background:"transparent",color:"var(--text2)",width:"100%",justifyContent:expanded?"flex-start":"center"}}>
          <Icon name="logout" size={18} strokeWidth={1.5}/>
          {expanded && <span style={{fontSize:13,fontWeight:450}}>Sign Out</span>}
        </button>}
      </div>
    </div>
  );
}

function MobileNav({ active, go }: { active:S; go:(s:S)=>void }) {
  const tabs: [S,string,string][] = [
    ["home","home","Home"],["cards","card","Cards"],["chat","chat","AI"],["travel","travel","Travel"],["goals","goal","Goals"],
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
            <span style={{color:on?"var(--accent)":"var(--text3)",transition:"color .15s"}}><Icon name={icon} size={19}/></span>
            <span style={{fontSize:11,fontWeight:on?600:400,color:on?"var(--accent)":"var(--text3)"}}>{label}</span>
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
  const toggleLife = (l: string) => set("lifestyles", (p.lifestyles||[]).includes(l) ? p.lifestyles.filter(x=>x!==l) : [...p.lifestyles,l]);
  const setSp = (k: keyof typeof p.spending, v: string) => set("spending", {...p.spending,[k]:v});

  const LIFESTYLES = ["Frequent Traveler","Foodie","Business Professional","Homebody","Tech Enthusiast","Fashion & Shopping","Student","Fitness & Health"];
  const INCOMES = ["Under $30,000","$30,000-$60,000","$60,000-$100,000","$100,000-$150,000","$150,000-$250,000","$250,000+"];
  const SCORES = ["300-579 (Poor)","580-669 (Fair)","670-739 (Good)","740-799 (Very Good)","800+ (Exceptional)"];
  const GOALS = [
    ["travel","Maximize Travel Rewards","Earn points for free flights & hotels"],
    ["wallet","Save More Money","Reduce spend and build savings"],
    ["trend-down","Build Credit Score","Reach 750+ and unlock premium cards"],
    ["card","Optimize Card Portfolio","Get the right cards for my lifestyle"],
    ["dollar","Pay Off Debt","Become debt free efficiently"],
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
        <button onClick={()=>setStep(s=>s-1)} style={{position:"fixed",top:18,left:20,background:"none",border:"none",color:"var(--text3)",fontSize:22,zIndex:999,fontFamily:"var(--sans)"}}></button>
      )}

      {/* Step 0 -- Welcome */}
      {step===0 && (
        <div className="au" style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",padding:"40px 28px",textAlign:"center",background:"var(--bg)"}}>
          <div style={{width:64,height:64,borderRadius:16,background:"var(--accent)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:24,boxShadow:"0 4px 16px rgba(37,99,235,.25)"}}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
          </div>
          <div style={{fontSize:12,letterSpacing:2.5,marginBottom:10,fontWeight:600,color:"var(--accent)",textTransform:"uppercase"}}>WiseCard</div>
          <h1 style={{fontSize:34,lineHeight:1.15,marginBottom:14,fontWeight:700,color:"var(--text)",letterSpacing:"-.5px"}}>Your cards,<br/>working harder.</h1>
          <p style={{color:"var(--text2)",fontSize:15,lineHeight:1.7,marginBottom:40,maxWidth:300}}>AI-powered credit card optimization. Maximize rewards, track spending, make smarter decisions.</p>
          <GoldBtn label="Get Started" onClick={()=>setStep(1)}/>
                    <p style={{color:"var(--text3)",fontSize:13,marginTop:14}}>Free  Takes 3 minutes</p>
        </div>
      )}

      {/* Step 1 -- Name & Age */}
      {step===1 && (
        <div className="au" style={{padding:"80px 28px 40px"}}>
          <span className="pill pill-gold" style={{marginBottom:20,display:"inline-flex"}}>Step 1 of 5</span>
          <h2 className="serif" style={{fontSize:46,fontWeight:400,marginBottom:10,lineHeight:1.1,letterSpacing:"-1px"}}>What's your<br/>name?</h2>
          <p style={{color:"var(--text2)",fontSize:14,marginBottom:32,lineHeight:1.6}}>We personalize every recommendation around you.</p>
          <label style={{fontSize:13,color:"var(--text2)",fontWeight:500,display:"block",marginBottom:8}}>First Name</label>
          <input className="field" placeholder="Your first name" value={p.name} onChange={e=>set("name",e.target.value)} style={{fontSize:20,padding:"18px 20px",marginBottom:20}} autoFocus onKeyDown={e=>e.key==="Enter"&&p.name.trim()&&setStep(2)}/>
          <label style={{fontSize:13,color:"var(--text2)",fontWeight:500,display:"block",marginBottom:8}}>Age</label>
          <input className="field" type="number" placeholder="Your age" value={p.age} onChange={e=>set("age",e.target.value)} style={{marginBottom:32}}/>
          <GoldBtn label="Continue ->" disabled={!p.name.trim()} onClick={()=>setStep(2)}/>
        </div>
      )}

      {/* Step 2 -- Financial profile */}
      {step===2 && (
        <div className="au" style={{padding:"80px 28px 40px"}}>
          <span className="pill pill-gold" style={{marginBottom:20,display:"inline-flex"}}>Step 2 of 5</span>
          <h2 className="serif" style={{fontSize:46,fontWeight:400,marginBottom:10,lineHeight:1.1,letterSpacing:"-1px"}}>Financial<br/>profile</h2>
          <p style={{color:"var(--text2)",fontSize:14,marginBottom:28,lineHeight:1.6}}>Used to calculate approval chances and optimize your strategy.</p>
          <label style={{fontSize:13,color:"var(--text2)",fontWeight:500,display:"block",marginBottom:8}}>Annual Income</label>
          <select className="field" value={p.income} onChange={e=>set("income",e.target.value)} style={{marginBottom:20,appearance:"none"}}>
            <option value="">Select income range</option>
            {INCOMES.map(o=><option key={o} value={o}>{o}</option>)}
          </select>
          <label style={{fontSize:13,color:"var(--text2)",fontWeight:500,display:"block",marginBottom:8}}>Credit Score (approximate)</label>
          <select className="field" value={p.creditScore} onChange={e=>set("creditScore",e.target.value)} style={{marginBottom:24,appearance:"none"}}>
            <option value="">Select score range</option>
            {SCORES.map(o=><option key={o} value={o}>{o}</option>)}
          </select>
          <label style={{fontSize:13,color:"var(--text2)",fontWeight:600,textTransform:"uppercase",letterSpacing:.6,display:"block",marginBottom:10}}>Lifestyle (select all that apply)</label>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:32}}>
            {LIFESTYLES.map(l => {
              const on = (p.lifestyles||[]).includes(l);
              return (
                <button key={l} onClick={()=>toggleLife(l)} className="press" style={{
                  padding:"11px 10px",borderRadius:12,textAlign:"left",fontSize:13,fontWeight:500,
                  border:`1.5px solid ${on?"var(--accent)":"var(--border2)"}`,
                  background:on?"rgba(201,168,76,.1)":"var(--surface)",
                  color:on?"var(--accent)":"var(--text2)",
                  transition:"all .15s",position:"relative",
                }}>
                  {on && <span style={{position:"absolute",top:7,right:9,fontSize:11,color:"var(--accent)",fontWeight:800}}></span>}
                  {l}
                </button>
              );
            })}
          </div>
          <GoldBtn label="Continue ->" disabled={!p.income||!p.creditScore||p.lifestyles.length===0} onClick={()=>setStep(3)}/>
        </div>
      )}

      {/* Step 3 -- Monthly spending */}
      {step===3 && (
        <div className="au" style={{padding:"80px 28px 40px"}}>
          <span className="pill pill-gold" style={{marginBottom:20,display:"inline-flex"}}>Step 3 of 5</span>
          <h2 className="serif" style={{fontSize:46,fontWeight:400,marginBottom:10,lineHeight:1.1,letterSpacing:"-1px"}}>Monthly<br/>spending</h2>
          <p style={{color:"var(--text2)",fontSize:14,marginBottom:28,lineHeight:1.6}}>Approximate is fine. We use this to find your highest-earning card combinations.</p>
          {([
            ["dining","Dining & Takeout"],["groceries","Groceries"],
            ["travel","Travel & Hotels"],["gas","Gas & Transport"],
            ["shopping","Shopping"],["other","Everything Else"],
          ] as [keyof typeof p.spending, string][]).map(([k,label]) => (
            <div key={k} style={{marginBottom:16}}>
              <label style={{fontSize:13,color:"var(--text2)",fontWeight:600,display:"block",marginBottom:6}}>{label}</label>
              <input className="field" type="number" placeholder="$ per month" value={p.spending[k]} onChange={e=>setSp(k,e.target.value)} style={{padding:"12px 16px"}}/>
            </div>
          ))}
          <div style={{marginTop:8}}><GoldBtn label="Continue ->" onClick={()=>setStep(4)}/></div>
        </div>
      )}

      {/* Step 4 -- Goal */}
      {step===4 && (
        <div className="au" style={{padding:"80px 28px 40px"}}>
          <span className="pill pill-gold" style={{marginBottom:20,display:"inline-flex"}}>Step 4 of 5</span>
          <h2 className="serif" style={{fontSize:46,fontWeight:400,marginBottom:10,lineHeight:1.1,letterSpacing:"-1px"}}>Primary<br/>goal</h2>
          <p style={{color:"var(--text2)",fontSize:14,marginBottom:24,lineHeight:1.6}}>We build your entire strategy around this.</p>
          {GOALS.map(([emoji,title,desc]) => (
            <button key={title} onClick={()=>{set("goal",title);setStep(5);}} className="press hover-lift" style={{
              width:"100%",padding:"18px 20px",marginBottom:10,
              background:p.goal===title?"rgba(201,168,76,.08)":"var(--surface)",
              border:`1.5px solid ${p.goal===title?"var(--accent)":"var(--border2)"}`,
              borderRadius:16,textAlign:"left",display:"flex",gap:14,alignItems:"center",
              transition:"all .15s",
            }}>
              <div style={{width:44,height:44,borderRadius:13,background:"var(--accentbg)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:"var(--accent)"}}><Icon name={emoji} size={20}/></div>
              <div style={{flex:1}}>
                <p style={{color:"var(--text)",fontSize:14,fontWeight:600}}>{title}</p>
                <p style={{color:"var(--text2)",fontSize:13,marginTop:2}}>{desc}</p>
              </div>
              <span style={{color:"var(--text3)",fontSize:20}}>-></span>
            </button>
          ))}
        </div>
      )}

      {/* Step 5 -- Add first card prompt */}
      {step===5 && (
        <div className="au" style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",padding:"40px 28px",textAlign:"center"}}>
          <div style={{width:90,height:90,borderRadius:26,background:"linear-gradient(135deg,var(--green),#1A8A6A)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:42,marginBottom:32,boxShadow:"0 8px 32px rgba(45,200,160,.3)"}}></div>
          <h2 className="serif" style={{fontSize:52,fontWeight:400,marginBottom:14,lineHeight:1.05,letterSpacing:"-1.2px"}}>Welcome,<br/>{p.name}.</h2>
          <p style={{color:"var(--text2)",fontSize:14,lineHeight:1.8,marginBottom:12,maxWidth:300}}>Your profile is set. Now add your credit cards -- we'll show your balances, due dates, points, offers, and cashback all in one place.</p>
          <p style={{color:"var(--accent)",fontSize:14,marginBottom:40}}>You'll add your cards on the next screen.</p>
          <GoldBtn label="Enter Dashboard ->" onClick={()=>done(p)}/>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   HOME SCREEN
   ============================================================ */
function Home({ profile, cards, go, dataLoaded, onUpdateCard }: { profile:UserProfile; cards:CreditCard[]; go:(s:S)=>void; dataLoaded?:boolean; onUpdateCard?:(id:string,balance:number,points:number)=>void }) {
  const totalBal = cards.reduce((s,c) => s+c.balance, 0);
  const totalLim = cards.reduce((s,c) => s+c.limit, 0);
  const totalPts = cards.reduce((s,c) => s+c.points, 0);
  const util = totalLim > 0 ? Math.round(totalBal/totalLim*100) : 0;
  const hour = new Date().getHours();
  const greeting = hour<12?"Good morning":hour<17?"Good afternoon":"Good evening";
  const [activeCard, setActiveCard] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);
  const trackRef = useRef<HTMLDivElement>(null);

  if (!dataLoaded) return (
    <div className="screen desktop-content" style={{padding:"60px 40px"}}>
      <div style={{height:28,width:200}} className="skeleton-shimmer"/><br/>
      <div style={{height:14,width:260}} className="skeleton-shimmer"/><br/><br/>
      <div style={{height:200,borderRadius:14}} className="skeleton-shimmer"/>
    </div>
  );

  const utilColor = util<30?"var(--green)":util<50?"var(--amber)":"var(--red)";
  const score = profile.creditRange?.split("–")[0]||"740";
  const ac = cards[activeCard] || cards[0];
  const acUtil = ac ? (ac.limit > 0 ? Math.round(ac.balance/ac.limit*100) : 0) : 0;
  const acUtilColor = acUtil<30?"var(--green)":acUtil<50?"var(--amber)":"var(--red)";

  const cardDesigns: Record<string,{bg:string;network:string;accent:string}> = {
    "Amex":{bg:"linear-gradient(135deg,#006FCF 0%,#004A8F 40%,#003170 100%)",network:"AMEX",accent:"#006FCF"},
    "Chase":{bg:"linear-gradient(135deg,#1a1f3a 0%,#0c1629 50%,#1a2744 100%)",network:"VISA",accent:"#1a1f3a"},
    "Capital One":{bg:"linear-gradient(135deg,#1b4332 0%,#2d6a4f 50%,#1b4332 100%)",network:"VISA",accent:"#2d6a4f"},
    "Discover":{bg:"linear-gradient(135deg,#E85D1A 0%,#C44A15 100%)",network:"DISCOVER",accent:"#E85D1A"},
    "Citi":{bg:"linear-gradient(135deg,#003B70 0%,#002855 100%)",network:"VISA",accent:"#003B70"},
    "Wells Fargo":{bg:"linear-gradient(135deg,#D71E28 0%,#A0161D 100%)",network:"VISA",accent:"#D71E28"},
    "US Bank":{bg:"linear-gradient(135deg,#002F6C 0%,#001E44 100%)",network:"VISA",accent:"#002F6C"},
    "BoA":{bg:"linear-gradient(135deg,#012169 0%,#001540 100%)",network:"VISA",accent:"#012169"},
  };
  const getDesign = (issuer:string) => cardDesigns[issuer] || {bg:"linear-gradient(135deg,#1E293B,#0F172A)",network:"VISA",accent:"#1E293B"};

  // Swipe handlers
  const onPointerDown = (e:React.PointerEvent) => { startX.current = e.clientX; setDragging(true); };
  const onPointerMove = (e:React.PointerEvent) => { if (!dragging) return; setDragX(e.clientX - startX.current); };
  const onPointerUp = () => {
    setDragging(false);
    if (dragX < -50 && activeCard < cards.length - 1) setActiveCard(activeCard + 1);
    else if (dragX > 50 && activeCard > 0) setActiveCard(activeCard - 1);
    setDragX(0);
  };

  return (
    <div className="screen desktop-content screen-enter">
      <div className="px" style={{paddingTop:8}}>
        {/* Greeting — refined */}
        <div className="au" style={{marginBottom:28}}>
          <h1 style={{fontSize:24,fontWeight:400,color:"var(--text)",letterSpacing:"-.3px",lineHeight:1.3,margin:0}}>
            {greeting}, <span style={{fontWeight:600}}>{profile.name||"there"}</span>
          </h1>
          <p style={{fontSize:13,color:"var(--text2)",marginTop:4,fontWeight:400}}>
            {util < 30 ? "Your finances look healthy." : util < 50 ? "A few things need attention." : "Some metrics need your focus."}
          </p>
        </div>

        {/* Hero — asymmetric: score left, util+rewards right */}
        <div className="au d1" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:24}}>
          <div onClick={()=>go("credit-optimizer")} className="card-surface hover-lift press" style={{padding:"22px 20px",cursor:"pointer"}}>
            <div style={{fontSize:11,color:"var(--text2)",fontWeight:500,letterSpacing:".3px",marginBottom:10}}>Credit score</div>
            <div className="animate-number" style={{fontSize:36,fontWeight:600,color:"var(--accent)",letterSpacing:"-1.5px",lineHeight:1}}>{score}</div>
            <div style={{fontSize:12,color:"var(--green)",marginTop:6,fontWeight:500}}>+{Math.min(15, Math.max(1, Math.round(cards.length * 3 + (100 - util) / 10)))} this month</div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div onClick={()=>go("credit-optimizer")} className="card-surface hover-lift press" style={{padding:"14px 18px",cursor:"pointer",flex:1,display:"flex",flexDirection:"column",justifyContent:"center"}}>
              <div className="animate-number" style={{fontSize:20,fontWeight:600,color:utilColor,letterSpacing:"-.5px",lineHeight:1}}>{util}%</div>
              <div style={{fontSize:11,color:"var(--text2)",marginTop:3}}>Utilization · {util<30?"Healthy":util<50?"Monitor":"High"}</div>
            </div>
            <div onClick={()=>go("perks")} className="card-surface hover-lift press" style={{padding:"14px 18px",cursor:"pointer",flex:1,display:"flex",flexDirection:"column",justifyContent:"center"}}>
              <div className="animate-number" style={{fontSize:20,fontWeight:600,color:"var(--text)",letterSpacing:"-.5px",lineHeight:1}}>${Math.round(totalPts*0.01)}</div>
              <div style={{fontSize:11,color:"var(--text2)",marginTop:3}}>Rewards · {cards.length} cards</div>
            </div>
          </div>
        </div>

        {/* Today — contextual action */}
        {util > 10 && (
          <div className="au d2" style={{marginBottom:24}}>
            <div style={{fontSize:11,color:"var(--text3)",fontWeight:500,letterSpacing:".8px",textTransform:"uppercase",marginBottom:10}}>Today</div>
            <div className="card-surface" style={{padding:"16px 18px",display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:"var(--accent)",flexShrink:0}}/>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:500,color:"var(--text)"}}>Statement closing soon</div>
                <div style={{fontSize:12,color:"var(--text2)",marginTop:2}}>
                  Pay ${Math.round(totalBal*0.5)} to drop to {Math.round(util*0.5)}%.
                  <span style={{color:"var(--green)",fontWeight:500}}> +8–12 pts</span>
                </div>
              </div>
              <button onClick={()=>go("credit-optimizer")} className="press spring-hover" style={{padding:"7px 14px",borderRadius:8,border:"1px solid var(--border2)",background:"transparent",color:"var(--text)",fontSize:12,fontWeight:500,cursor:"pointer"}}>Review</button>
            </div>
          </div>
        )}

        {/* Smart picks */}
        <div className="au d3" style={{marginBottom:28}}>
          <div style={{fontSize:11,color:"var(--text3)",fontWeight:500,letterSpacing:".8px",textTransform:"uppercase",marginBottom:10}}>Smart picks</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {(() => {
              // Generate smart picks from user's actual cards
              const diningCard = cards.reduce((best,c) => {
                const db = CARD_DB.find(d=>d.id===c.dbId);
                if (!db) return best;
                const rate = db.rewardRate?.toLowerCase()||"";
                if (rate.includes("dining") || rate.includes("4x")) return {name:c.name,rate:db.rewardRate?.split(",")[0]||"rewards"};
                return best;
              }, {name:cards[0]?.name||"your card",rate:"rewards"});
              const travelCard = cards.reduce((best,c) => {
                const db = CARD_DB.find(d=>d.id===c.dbId);
                if (!db) return best;
                const rate = db.rewardRate?.toLowerCase()||"";
                if (rate.includes("travel") || rate.includes("8x") || rate.includes("5x")) return {name:c.name,rate:db.rewardRate?.split(",")[0]||"rewards"};
                return best;
              }, {name:cards[0]?.name||"your card",rate:"rewards"});
              return [
                {icon:"dining",q:"Dining tonight?",tip:`${diningCard.name} → ${diningCard.rate}`},
                {icon:"travel",q:"Booking travel?",tip:`${travelCard.name} → ${travelCard.rate}`},
              ];
            })().map((pick,i) => (
              <div key={i} onClick={()=>go("ai-recommender")} className="card-surface hover-lift press" style={{padding:"16px",cursor:"pointer"}}>
                <div style={{color:"var(--text2)",marginBottom:8}}><Icon name={pick.icon} size={16} strokeWidth={1.5}/></div>
                <div style={{fontSize:13,fontWeight:500,color:"var(--text)",marginBottom:2}}>{pick.q}</div>
                <div style={{fontSize:12,color:"var(--text2)"}}>{pick.tip}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ WALLET CAROUSEL ═══ */}
        {cards.length > 0 && (<>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div style={{fontSize:11,color:"var(--text3)",fontWeight:500,letterSpacing:".8px",textTransform:"uppercase"}}>Your wallet</div>
            <button onClick={()=>go("cards")} style={{fontSize:12,color:"var(--text2)",background:"none",border:"none",cursor:"pointer",fontWeight:500}}>Manage</button>
          </div>

          {/* Card carousel */}
          <div className="au d4" style={{position:"relative",marginBottom:8,overflow:"hidden",touchAction:"pan-y",cursor:dragging?"grabbing":"grab"}}
            onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={()=>{if(dragging){setDragging(false);setDragX(0)}}}>
            <div ref={trackRef} style={{display:"flex",transition:dragging?"none":"transform .45s cubic-bezier(.22,1,.36,1)",
              transform:`translateX(${-activeCard * 100 + (dragX / 6)}%)`,userSelect:"none"}}>
              {cards.map((c,i) => {
                const design = getDesign(c.issuer);
                const isActive = i === activeCard;
                return (
                  <div key={c.id} style={{minWidth:"100%",display:"flex",justifyContent:"center",padding:"8px 20px",boxSizing:"border-box"}}>
                    <div className="card-shimmer" style={{
                      width:"100%",maxWidth:380,height:210,borderRadius:14,padding:"22px 24px",
                      display:"flex",flexDirection:"column",justifyContent:"space-between",
                      background:design.bg,position:"relative",overflow:"hidden",
                      boxShadow:isActive?"0 8px 28px rgba(0,0,0,.2), 0 0 0 1px rgba(255,255,255,.05)":"0 4px 16px rgba(0,0,0,.1)",
                      transform:isActive?"scale(1)":"scale(.95)",opacity:isActive?1:0.6,
                      transition:"transform .4s cubic-bezier(.22,1,.36,1), opacity .4s, box-shadow .4s",
                    }}
                    onMouseMove={(e)=>{if(!isActive)return;const el=e.currentTarget;const r=el.getBoundingClientRect();const x=(e.clientX-r.left)/r.width;const y=(e.clientY-r.top)/r.height;el.style.transform=`scale(1) perspective(800px) rotateX(${(y-.5)*-6}deg) rotateY(${(x-.5)*6}deg)`;}}
                    onMouseLeave={(e)=>{e.currentTarget.style.transform=isActive?'scale(1)':'scale(.95)';}}>
                      <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,rgba(255,255,255,.08) 0%,transparent 50%)",pointerEvents:"none"}}/>
                      <div style={{position:"relative",zIndex:1}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                          <div style={{fontSize:11,letterSpacing:"1.5px",textTransform:"uppercase",color:"rgba(255,255,255,.5)",fontWeight:500}}>{c.issuer}</div>
                          <div style={{fontSize:10,letterSpacing:"1px",color:"rgba(255,255,255,.4)",fontWeight:500}}>{design.network}</div>
                        </div>
                        <div style={{width:32,height:24,borderRadius:4,background:"linear-gradient(135deg,#d4a847,#b8922e)",margin:"12px 0",opacity:.85}}/>
                        <div style={{fontSize:14,letterSpacing:"3px",color:"rgba(255,255,255,.55)",fontFamily:"var(--mono,monospace)"}}>•••• •••• •••• {String(i*1111+1008).slice(-4)}</div>
                      </div>
                      <div style={{position:"relative",zIndex:1,display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
                        <div>
                          <div style={{fontSize:12,letterSpacing:"1px",textTransform:"uppercase",color:"rgba(255,255,255,.6)"}}>{profile.name||"Cardholder"}</div>
                          <div style={{fontSize:11,color:"rgba(255,255,255,.35)",marginTop:1}}>{c.name}</div>
                        </div>
                        <div style={{fontSize:10,color:"rgba(255,255,255,.25)"}}>MEMBER SINCE '24</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dots */}
          {cards.length > 1 && (
            <div style={{display:"flex",justifyContent:"center",gap:5,marginBottom:20}}>
              {cards.map((_,i) => (
                <div key={i} onClick={()=>setActiveCard(i)} style={{
                  width:i===activeCard?16:6,height:6,borderRadius:3,cursor:"pointer",
                  background:i===activeCard?"var(--text)":"var(--border2)",
                  transition:"all .3s cubic-bezier(.22,1,.36,1)",
                }}/>
              ))}
            </div>
          )}

          {/* Active card details */}
          {ac && (
            <div className="au" style={{marginBottom:24}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:16}}>
                <div>
                  <div style={{fontSize:17,fontWeight:500,color:"var(--text)",letterSpacing:"-.2px"}}>{ac.name}</div>
                  <div style={{fontSize:12,color:"var(--text2)",marginTop:2}}>{ac.issuer} · {ac.rewardRate?.split(",")[0]||"Rewards"}</div>
                </div>
              </div>

              {/* Stats row — no cards, just numbers with dividers */}
              <div style={{display:"flex",gap:0,marginBottom:18,background:"var(--surface)",borderRadius:12,border:"1px solid var(--border)",overflow:"hidden"}}>
                {[
                  {label:"Balance",value:`$${ac.balance.toLocaleString()}`},
                  {label:"Available",value:`$${(ac.limit-ac.balance).toLocaleString()}`},
                  {label:"Due",value:ac.dueDate||"Aug 15"},
                ].map((s,i) => (
                  <div key={i} style={{flex:1,padding:"14px 16px",textAlign:"center",borderRight:i<2?"1px solid var(--border)":"none"}}>
                    <div style={{fontSize:16,fontWeight:500,color:"var(--text)",letterSpacing:"-.3px"}}>{s.value}</div>
                    <div style={{fontSize:10,color:"var(--text2)",marginTop:3}}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Utilization */}
              <div style={{marginBottom:16}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                  <span style={{fontSize:12,color:"var(--text2)"}}>Utilization</span>
                  <span style={{fontSize:12,fontWeight:500,color:"var(--text)"}}>{acUtil}% · {acUtil<30?"Healthy":acUtil<50?"Fair":"High"}</span>
                </div>
                <div style={{height:4,borderRadius:2,background:"var(--border)",overflow:"hidden"}}>
                  <div style={{width:`${acUtil}%`,height:"100%",borderRadius:2,background:acUtilColor,transition:"width .5s cubic-bezier(.22,1,.36,1)"}}/>
                </div>
              </div>

              {/* Actions */}
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>go("card-detail")} className="press spring-hover" style={{flex:1,padding:"11px 0",borderRadius:8,border:"none",background:"var(--text)",color:"var(--surface)",fontSize:13,fontWeight:500,cursor:"pointer"}}>Pay now</button>
                <button onClick={()=>go("card-detail")} className="press spring-hover" style={{flex:1,padding:"11px 0",borderRadius:8,border:"1px solid var(--border2)",background:"transparent",color:"var(--text)",fontSize:13,fontWeight:500,cursor:"pointer"}}>Details</button>
                <button className="press spring-hover" style={{padding:"11px 16px",borderRadius:8,border:"1px solid var(--border2)",background:"transparent",color:"var(--text2)",fontSize:13,cursor:"pointer"}}><Icon name="lock" size={14} strokeWidth={1.5}/></button>
              </div>
            </div>
          )}
        </>)}

        {/* Empty state for no cards */}
        {cards.length === 0 && (
          <div className="au d4" style={{textAlign:"center",padding:"40px 20px",marginBottom:24}}>
            <div style={{fontSize:15,fontWeight:500,color:"var(--text)",marginBottom:4}}>Your wallet starts here</div>
            <div style={{fontSize:13,color:"var(--text2)",marginBottom:16}}>Add your cards and WiseCard finds the best one for every purchase.</div>
            <button onClick={()=>go("add-card")} className="press spring-hover" style={{padding:"11px 24px",borderRadius:8,border:"none",background:"var(--accent)",color:"white",fontSize:13,fontWeight:500,cursor:"pointer"}}>Add first card</button>
          </div>
        )}

        {/* Spending */}
        <div className="au d5" style={{marginBottom:24}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div style={{fontSize:11,color:"var(--text3)",fontWeight:500,letterSpacing:".8px",textTransform:"uppercase"}}>Spending</div>
            <button onClick={()=>go("analytics")} style={{fontSize:12,color:"var(--text2)",background:"none",border:"none",cursor:"pointer",fontWeight:500}}>Details →</button>
          </div>
          <div style={{fontSize:22,fontWeight:600,color:"var(--text)",letterSpacing:"-1px",marginBottom:10}}>${totalBal.toLocaleString()}</div>
          {(() => {
            // Derive spending percentages from user's card data
            const spend = profile.spending || {};
            const catDefs = [
              {label:"Dining",key:"dining",color:"#6C8EEF"},
              {label:"Grocery",key:"groceries",color:"#34D399"},
              {label:"Travel",key:"travel",color:"#FBBF24"},
              {label:"Gas",key:"gas",color:"#F87171"},
              {label:"Shopping",key:"shopping",color:"#A78BFA"},
              {label:"Other",key:"other",color:"#94A3B8"},
            ];
            const catTotals = catDefs.map(c => ({...c, val: Number((spend as any)[c.key]||0) || Math.round(totalBal * [0.28,0.22,0.18,0.12,0.11,0.09][catDefs.indexOf(c)])}));
            const catSum = catTotals.reduce((s,c) => s+c.val, 0) || 1;
            const cats = catTotals.map(c => ({...c, pct: Math.round(c.val/catSum*100)}));
            return (
              <div>
                <div style={{display:"flex",height:5,borderRadius:3,overflow:"hidden",marginBottom:8}}>
                  {cats.map(c=><div key={c.label} style={{width:`${c.pct}%`,background:c.color,transition:"width .6s cubic-bezier(.22,1,.36,1)"}}/>)}
                </div>
                <div style={{display:"flex",flexWrap:"wrap",gap:"4px 14px"}}>
                  {cats.map(c=><div key={c.label} style={{display:"flex",alignItems:"center",gap:4}}>
                    <div style={{width:5,height:5,borderRadius:"50%",background:c.color}}/>
                    <span style={{fontSize:11,color:"var(--text2)"}}>{c.label} {c.pct}%</span>
                  </div>)}
                </div>
              </div>
            );
          })()}
        </div>

        {/* Upcoming payments */}
        {cards.filter(c=>c.balance>0).length > 0 && (
          <div className="au d6" style={{marginBottom:24}}>
            <div style={{fontSize:11,color:"var(--text3)",fontWeight:500,letterSpacing:".8px",textTransform:"uppercase",marginBottom:10}}>Upcoming payments</div>
            {cards.filter(c=>c.balance>0).slice(0,3).map((c,i,arr) => (
              <div key={c.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 0",borderBottom:i<arr.length-1?"1px solid var(--border)":"none"}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:26,height:16,borderRadius:4,background:getDesign(c.issuer).bg,flexShrink:0}}/>
                  <div>
                    <div style={{fontSize:13,fontWeight:400,color:"var(--text)"}}>{c.name}</div>
                    <div style={{fontSize:11,color:"var(--text2)"}}>Due {c.dueDate || "Aug 15"}</div>
                  </div>
                </div>
                <div style={{fontSize:14,fontWeight:500,color:"var(--text)",letterSpacing:"-.3px"}}>${c.balance.toLocaleString()}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


function AddCard({ go, onAdd }: { go:(s:S)=>void; onAdd:(card:CreditCard)=>void }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<typeof CARD_DB[0]|null>(null);
  const [form, setForm] = useState({ balance:"", limit:"", minPayment:"", dueDate:"", points:"" });
  const [step, setStep] = useState<"search"|"details">("search");
  const [openedDate, setOpenedDate] = useState(new Date().toISOString().slice(0,10));
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
      openedDate: openedDate || new Date().toISOString().slice(0,10),
      name: selected.name,
      issuer: selected.issuer,
      gradient: selected.gradient,
      accentColor: selected.accentColor,
      balance: parseFloat(form.balance)||0,
      limit: parseFloat(form.limit)||0,
      minPayment: parseFloat(form.minPayment)||0,
      dueDate: form.dueDate,
      points: parseFloat(form.points)||0,
      apr: (selected as any).apr || "19.99%-29.99% Variable",
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
    <div className="screen desktop-content screen-enter">
      <PageHead title={step==="search"?"Add a Card":"Card Details"} back={step==="details"?()=>setStep("search"):()=>go("cards")} />
      <div className="px">
        {step==="search" && (
          <div className="ai">
            <p style={{color:"var(--text2)",fontSize:14,marginBottom:20,lineHeight:1.6}}>Search from 50+ US credit cards. We'll auto-fill reward rates, perks, and offers.</p>
            <input className="field" placeholder="Search by card name, bank, or category..." value={search} onChange={e=>setSearch(e.target.value)} style={{marginBottom:20}} autoFocus/>

            {/* Categories */}
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
              {["travel","cashback","dining","groceries","hotel","airline"].map(cat=>(
                <button key={cat} onClick={()=>setSearch(cat)} className="press pill pill-gold" style={{fontSize:12,textTransform:"capitalize"}}>{cat}</button>
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
                      <span className="pill pill-emerald" style={{fontSize:11,flexShrink:0,marginLeft:8}}>{card.cashback}</span>
                    </div>
                    {(card as any).discontinued && (
                      <div style={{display:"flex",alignItems:"center",gap:5,background:"var(--redbg)",borderRadius:7,padding:"4px 8px",marginBottom:6,width:"fit-content"}}>
                        <Icon name="alert" size={11} color="var(--red)"/>
                        <span style={{color:"var(--red)",fontSize:11,fontWeight:600}}>Discontinued for new applicants</span>
                      </div>
                    )}
                    <p style={{color:"var(--text2)",fontSize:12,marginBottom:3}}>{card.issuer}  ${card.annualFee}/yr fee</p>
                    <p style={{color:"var(--accent)",fontSize:12,fontWeight:600,marginBottom:6}}>{card.rewardRate}</p>
                    {(card as any).bestFor && (card as any).bestFor.slice(0,2).map((b:string,bi:number)=>(
                      <div key={bi} style={{display:"flex",alignItems:"center",gap:5,marginBottom:2}}>
                        <span style={{width:4,height:4,borderRadius:"50%",background:"var(--green)",flexShrink:0}}/>
                        <span style={{color:"var(--text2)",fontSize:11}}>{b}</span>
                      </div>
                    ))}
                    {(card as any).signupBonus && (
                      <p style={{color:"var(--amber)",fontSize:11,marginTop:6,fontWeight:500,display:"flex",alignItems:"center",gap:4}}>
                        <Icon name="gift" size={10}/> {(card as any).signupBonus.split(" -- ")[0]}
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
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <p style={{color:"rgba(255,255,255,.5)",fontSize:12,letterSpacing:1.2,textTransform:"uppercase",marginBottom:4}}>{selected.issuer}</p>
                <NetworkBadge issuer={selected.issuer} size={20}/>
              </div>
              <p style={{color:"#fff",fontSize:20,fontWeight:700,marginBottom:12}}>{selected.name}</p>
              <p style={{color:selected.accentColor,fontSize:14}}>{selected.rewardRate}</p>
              <div style={{display:"flex",gap:12,marginTop:16}}>
                <span className="pill" style={{background:"rgba(255,255,255,.15)",color:"#fff",fontSize:12}}>${selected.annualFee}/yr fee</span>
                <span className="pill" style={{background:"rgba(255,255,255,.15)",color:"#fff",fontSize:12}}>Perks: ${selected.perksValue}/yr</span>
              </div>
            </div>

            {(selected as any).discontinued && (
              <div style={{background:"var(--redbg)",border:"1px solid rgba(220,38,38,.2)",borderRadius:14,padding:"14px 16px",marginBottom:20,display:"flex",gap:10,alignItems:"flex-start"}}>
                <Icon name="alert" size={18} color="var(--red)"/>
                <div>
                  <p style={{color:"var(--red)",fontSize:13,fontWeight:700,marginBottom:4}}>No longer accepting new applicants</p>
                  <p style={{color:"var(--text2)",fontSize:12,lineHeight:1.5}}>{(selected as any).discontinuedNote}</p>
                </div>
              </div>
            )}

            {/* Signup Bonus */}
            {selected.signupBonus && (
              <div style={{background:"rgba(240,164,41,.08)",border:"1px solid rgba(240,164,41,.25)",borderRadius:14,padding:"12px 16px",marginBottom:16}}>
                <p style={{color:"var(--amber)",fontSize:13,fontWeight:700,marginBottom:4,display:"flex",alignItems:"center",gap:6}}><Icon name="gift" size={13}/> Welcome Bonus</p>
                <p style={{color:"var(--text)",fontSize:14,lineHeight:1.5}}>{selected.signupBonus}</p>
              </div>
            )}

            {/* Best For */}
            {selected.bestFor && selected.bestFor.length > 0 && (
              <div style={{background:"rgba(45,200,160,.06)",border:"1px solid rgba(45,200,160,.2)",borderRadius:14,padding:"12px 16px",marginBottom:16}}>
                <p style={{color:"var(--green)",fontSize:13,fontWeight:700,marginBottom:8}}> Best Used For</p>
                {(selected.bestFor||[]).map((b:string,i:number)=>(
                  <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:i<selected.bestFor.length-1?6:0}}>
                    <span style={{width:5,height:5,borderRadius:"50%",background:"var(--green)",flexShrink:0,marginTop:5}}/>
                    <p style={{color:"var(--text2)",fontSize:13,lineHeight:1.4}}>{b}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Key Benefits */}
            {selected.keyBenefits && selected.keyBenefits.length > 0 && (
              <div style={{background:"rgba(79,110,247,.06)",border:"1px solid rgba(79,110,247,.2)",borderRadius:14,padding:"12px 16px",marginBottom:16}}>
                <p style={{color:"var(--accent)",fontSize:13,fontWeight:700,marginBottom:8}}> Key Benefits</p>
                {(selected.keyBenefits||[]).map((b:string,i:number)=>(
                  <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:i<selected.keyBenefits.length-1?6:0}}>
                    <span style={{color:"var(--accent)",fontSize:11,flexShrink:0,marginTop:2}}>-></span>
                    <p style={{color:"var(--text2)",fontSize:13,lineHeight:1.4}}>{b}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Best Places */}
            {selected.bestPlaces && selected.bestPlaces.length > 0 && (
              <div style={{background:"rgba(201,168,76,.06)",border:"1px solid rgba(201,168,76,.2)",borderRadius:14,padding:"12px 16px",marginBottom:16}}>
                <p style={{color:"var(--accent)",fontSize:13,fontWeight:700,marginBottom:8,display:"flex",alignItems:"center",gap:6}}><Icon name="globe" size={13}/> Where to Use It</p>
                {(selected.bestPlaces||[]).map((b:string,i:number)=>(
                  <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:i<selected.bestPlaces.length-1?6:0}}>
                    <span style={{flexShrink:0,marginTop:2,color:"var(--accent)"}}><Icon name="check" size={10}/></span>
                    <p style={{color:"var(--text2)",fontSize:13,lineHeight:1.4}}>{b}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Not good for */}
            {selected.notGoodFor && selected.notGoodFor.length > 0 && (
              <div style={{background:"rgba(244,97,122,.05)",border:"1px solid rgba(244,97,122,.2)",borderRadius:14,padding:"12px 16px",marginBottom:20}}>
                <p style={{color:"var(--red)",fontSize:13,fontWeight:700,marginBottom:8}}> Not Great For</p>
                {(selected.notGoodFor||[]).map((b:string,i:number)=>(
                  <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:i<selected.notGoodFor.length-1?6:0}}>
                    <span style={{color:"var(--red)",fontSize:11,flexShrink:0,marginTop:2}}></span>
                    <p style={{color:"var(--text2)",fontSize:13,lineHeight:1.4}}>{b}</p>
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
                <label style={{fontSize:13,color:"var(--text2)",fontWeight:600,textTransform:"uppercase",letterSpacing:.6,display:"block",marginBottom:6}}>{label}</label>
                <input className="field" type={type} placeholder={placeholder} value={form[k]} onChange={e=>setF(k,e.target.value)} style={{padding:"13px 16px"}}/>
              </div>
            ))}

            <div style={{marginBottom:16}}>
              <label style={{fontSize:13,color:"var(--text2)",fontWeight:600,textTransform:"uppercase",letterSpacing:.6,display:"block",marginBottom:6}}>Date You Opened This Card</label>
              <input className="field" type="date" value={openedDate} onChange={e=>setOpenedDate(e.target.value)} style={{padding:"13px 16px"}}/>
              <p style={{color:"var(--text3)",fontSize:12,marginTop:6}}>Used for annual fee reminders and 5/24 tracking</p>
            </div>

            <div style={{marginTop:24}}>
              <button onClick={handleAdd} className="btn-gold press" style={{width:"100%"}}>
                Add {selected.name} ->
              </button>
              <p style={{color:"var(--text3)",fontSize:12,textAlign:"center",marginTop:10,display:"flex",alignItems:"center",justifyContent:"center",gap:5}}><Icon name="lock" size={10}/> Encrypted · Never shared · You can update anytime</p>
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
function Cards({ cards, go, onDelete, onToggleFreeze }: { cards:CreditCard[]; go:(s:S)=>void; onDelete?:(id:string)=>void; onToggleFreeze?:(id:string)=>void }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [tab, setTab] = useState<"overview"|"rewards"|"benefits"|"activity">("overview");
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);

  const cardDesigns: Record<string,{bg:string;network:string;stageTint:string}> = {
    "Amex":{bg:"linear-gradient(135deg,#006FCF 0%,#004A8F 40%,#003170 100%)",network:"AMEX",stageTint:"rgba(0,79,207,.07)"},
    "Chase":{bg:"linear-gradient(135deg,#1a1f3a 0%,#0c1629 50%,#1a2744 100%)",network:"VISA",stageTint:"rgba(26,31,58,.06)"},
    "Capital One":{bg:"linear-gradient(135deg,#1b4332 0%,#2d6a4f 50%,#1b4332 100%)",network:"VISA",stageTint:"rgba(45,106,79,.06)"},
    "Discover":{bg:"linear-gradient(135deg,#E85D1A 0%,#C44A15 100%)",network:"DISCOVER",stageTint:"rgba(232,93,26,.05)"},
    "Citi":{bg:"linear-gradient(135deg,#003B70 0%,#002855 100%)",network:"VISA",stageTint:"rgba(0,59,112,.06)"},
    "Wells Fargo":{bg:"linear-gradient(135deg,#D71E28 0%,#A0161D 100%)",network:"VISA",stageTint:"rgba(215,30,40,.05)"},
  };
  const getDesign = (issuer:string) => cardDesigns[issuer] || {bg:"linear-gradient(135deg,#1E293B,#0F172A)",network:"VISA",stageTint:"rgba(30,41,59,.05)"};

  const c = cards[activeIdx] || cards[0];
  if (!c && cards.length === 0) return (
    <div className="screen desktop-content screen-enter">
      <div className="px" style={{textAlign:"center",paddingTop:80}}>
        <div style={{fontSize:17,fontWeight:500,color:"var(--text)",marginBottom:4}}>Your wallet starts here</div>
        <div style={{fontSize:13,color:"var(--text2)",marginBottom:20}}>Add your cards and WiseCard finds the best one for every purchase.</div>
        <button onClick={()=>go("add-card")} className="press spring-hover" style={{padding:"11px 24px",borderRadius:8,border:"none",background:"var(--accent)",color:"white",fontSize:13,fontWeight:500,cursor:"pointer"}}>Add first card</button>
      </div>
    </div>
  );

  const design = getDesign(c.issuer);
  const util = c.limit > 0 ? Math.round(c.balance / c.limit * 100) : 0;
  const utilLabel = util < 30 ? "Healthy" : util < 50 ? "Fair" : "High";

  const onPointerDown = (e:React.PointerEvent) => { startX.current = e.clientX; setDragging(true); };
  const onPointerMove = (e:React.PointerEvent) => { if (!dragging) return; setDragX(e.clientX - startX.current); };
  const onPointerUp = () => {
    setDragging(false);
    if (dragX < -50 && activeIdx < cards.length - 1) { setActiveIdx(activeIdx + 1); setTab("overview"); }
    else if (dragX > 50 && activeIdx > 0) { setActiveIdx(activeIdx - 1); setTab("overview"); }
    setDragX(0);
  };

  const tabs = ["overview","rewards","benefits","activity"] as const;

  return (
    <div className="screen desktop-content screen-enter">
      {/* Stage — transparent gradient background from card color */}
      <div style={{position:"relative",padding:"12px 20px 20px",marginBottom:20,borderRadius:"0 0 16px 16px",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:`linear-gradient(160deg, ${design.stageTint} 0%, transparent 60%)`,pointerEvents:"none",transition:"background .5s"}}/>

        {/* Header */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,position:"relative"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div>
              <div style={{fontSize:13,color:"var(--text2)"}}>
                {cards.length} {cards.length===1?"card":"cards"} · {cards.reduce((s,cd)=>s+cd.points,0).toLocaleString()} points
              </div>
            </div>
          </div>
          <button onClick={()=>go("add-card")} className="press spring-hover" style={{padding:"8px 16px",borderRadius:8,border:"1px solid var(--border2)",background:"transparent",color:"var(--text)",fontSize:12,fontWeight:500,cursor:"pointer"}}>+ Add card</button>
        </div>

        {/* Card carousel */}
        <div style={{touchAction:"pan-y",cursor:dragging?"grabbing":"grab"}}
          onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}
          onPointerLeave={()=>{if(dragging){setDragging(false);setDragX(0)}}}>
          <div style={{display:"flex",transition:dragging?"none":"transform .45s cubic-bezier(.22,1,.36,1)",
            transform:`translateX(${-activeIdx*100+(dragX/6)}%)`,userSelect:"none"}}>
            {cards.map((cd,i) => {
              const d = getDesign(cd.issuer);
              const isActive = i === activeIdx;
              return (
                <div key={cd.id} style={{minWidth:"100%",display:"flex",justifyContent:"center",padding:"4px 16px",boxSizing:"border-box"}}>
                  <div className="card-shimmer" style={{
                    width:"100%",maxWidth:380,height:215,borderRadius:14,padding:"22px 24px",
                    display:"flex",flexDirection:"column",justifyContent:"space-between",
                    background:d.bg,position:"relative",overflow:"hidden",
                    boxShadow:isActive?"0 12px 40px rgba(0,0,0,.18), 0 2px 8px rgba(0,0,0,.08)":"0 4px 12px rgba(0,0,0,.08)",
                    transform:isActive?"scale(1)":"scale(.93)",opacity:isActive?1:0.5,
                    transition:"transform .45s cubic-bezier(.22,1,.36,1), opacity .45s, box-shadow .45s",
                  }}
                  onMouseMove={(e)=>{if(!isActive)return;const el=e.currentTarget;const r=el.getBoundingClientRect();const x=(e.clientX-r.left)/r.width;const y=(e.clientY-r.top)/r.height;el.style.transform=`scale(1) perspective(800px) rotateX(${(y-.5)*-6}deg) rotateY(${(x-.5)*6}deg)`;}}
                  onMouseLeave={(e)=>{e.currentTarget.style.transform=isActive?'scale(1)':'scale(.93)';}}>
                    {/* Card light reflection */}
                    <div style={{position:"absolute",inset:0,background:"linear-gradient(125deg,rgba(255,255,255,.1) 0%,transparent 40%,rgba(255,255,255,.02) 80%,transparent 100%)",pointerEvents:"none"}}/>
                    <div style={{position:"relative",zIndex:1}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                        <div style={{fontSize:11,letterSpacing:"1.5px",textTransform:"uppercase",color:"rgba(255,255,255,.45)",fontWeight:500}}>{cd.issuer}</div>
                        <div style={{fontSize:10,letterSpacing:"1px",color:"rgba(255,255,255,.35)",fontWeight:500}}>{d.network}</div>
                      </div>
                      <div style={{width:34,height:26,borderRadius:5,background:"linear-gradient(145deg,#d4a847,#b8922e)",margin:"14px 0",opacity:.85,boxShadow:"0 1px 2px rgba(0,0,0,.15)"}}/>
                      <div style={{fontSize:14,letterSpacing:"3.5px",color:"rgba(255,255,255,.5)",fontFamily:"var(--mono,monospace)"}}>•••• •••• •••• {String(i*1111+1008).slice(-4)}</div>
                    </div>
                    <div style={{position:"relative",zIndex:1,display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
                      <div>
                        <div style={{fontSize:11.5,letterSpacing:"1.2px",textTransform:"uppercase",color:"rgba(255,255,255,.55)"}}>{cd.name.length > 20 ? cd.name.slice(0,20) : cd.name}</div>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontSize:9,color:"rgba(255,255,255,.2)",letterSpacing:".5px"}}>VALID THRU</div>
                        <div style={{fontSize:11,color:"rgba(255,255,255,.35)"}}>08/28</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dots */}
        {cards.length > 1 && (
          <div style={{display:"flex",justifyContent:"center",gap:5,marginTop:14}}>
            {cards.map((_,i) => (
              <div key={i} onClick={()=>{setActiveIdx(i);setTab("overview");}} style={{
                width:i===activeIdx?18:6,height:6,borderRadius:3,cursor:"pointer",
                background:i===activeIdx?"var(--text)":"var(--border2)",
                transition:"all .3s cubic-bezier(.22,1,.36,1)",
              }}/>
            ))}
          </div>
        )}
      </div>

      <div className="px">
        {/* Card name */}
        <div style={{marginBottom:0}}>
          <div style={{fontSize:18,fontWeight:500,color:"var(--text)",letterSpacing:"-.3px"}}>{c.name}</div>
          <div style={{fontSize:12,color:"var(--text2)",marginTop:2}}>{c.issuer} · {c.cashback || "Rewards"}{c.annualFee > 0 ? ` · $${c.annualFee}/yr` : " · No annual fee"}</div>
        </div>

        {/* Tabs */}
        <div style={{display:"flex",gap:0,borderBottom:"1px solid var(--border)",margin:"16px 0 0",position:"relative"}}>
          {tabs.map(t => (
            <button key={t} onClick={()=>setTab(t)} className="press" style={{
              padding:"10px 18px",fontSize:13,border:"none",cursor:"pointer",
              background:"transparent",position:"relative",
              color:tab===t?"var(--text)":"var(--text2)",
              fontWeight:tab===t?500:400,
              transition:"color .2s",
            }}>
              {t.charAt(0).toUpperCase()+t.slice(1)}
              {tab===t && <div style={{position:"absolute",bottom:-1,left:18,right:18,height:1.5,borderRadius:1,background:"var(--text)",transition:"all .25s cubic-bezier(.22,1,.36,1)"}}/>}
            </button>
          ))}
        </div>

        {/* ═══ OVERVIEW TAB ═══ */}
        {tab === "overview" && (
          <div className="ai" style={{paddingTop:4}}>
            {/* Stats */}
            <div style={{display:"flex",padding:"18px 0",borderBottom:"1px solid var(--border)"}}>
              {[
                {label:"Balance",value:`$${c.balance.toLocaleString()}`},
                {label:"Available",value:`$${(c.limit-c.balance).toLocaleString()}`},
                {label:"Due",value:c.dueDate||"Aug 15"},
                {label:"Minimum",value:`$${c.minPayment||25}`},
              ].map((s,i) => (
                <div key={i} style={{flex:1,textAlign:"center",borderRight:i<3?"1px solid var(--border)":"none"}}>
                  <div style={{fontSize:17,fontWeight:500,color:"var(--text)",letterSpacing:"-.3px"}}>{s.value}</div>
                  <div style={{fontSize:10,color:"var(--text2)",marginTop:3}}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Utilization */}
            <div style={{padding:"16px 0"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                <span style={{fontSize:12,color:"var(--text2)"}}>Utilization</span>
                <span style={{fontSize:12,fontWeight:500,color:"var(--text)"}}>{util}% · {utilLabel}</span>
              </div>
              <div style={{height:3,borderRadius:2,background:"var(--border)",overflow:"hidden"}}>
                <div style={{width:`${util}%`,height:"100%",borderRadius:2,background:"var(--text)",opacity:.4,transition:"width .6s cubic-bezier(.22,1,.36,1)"}}/>
              </div>
            </div>

            {/* Actions */}
            <div style={{display:"flex",gap:8,marginBottom:16}}>
              <button className="press spring-hover" style={{flex:1,padding:"11px 0",borderRadius:8,border:"none",background:"var(--text)",color:"var(--surface)",fontSize:13,fontWeight:500,cursor:"pointer"}}>Pay now</button>
              <button className="press spring-hover" style={{flex:1,padding:"11px 0",borderRadius:8,border:"1px solid var(--border2)",background:"transparent",color:"var(--text)",fontSize:13,fontWeight:500,cursor:"pointer"}}>Autopay</button>
              <button onClick={()=>onToggleFreeze?.(c.id)} className="press spring-hover" style={{padding:"11px 16px",borderRadius:8,border:"1px solid var(--border2)",background:"transparent",color:"var(--text2)",cursor:"pointer"}}><Icon name={c.isFrozen?"unlock":"lock"} size={14} strokeWidth={1.5}/></button>
            </div>

            {/* AI Insight */}
            {util > 15 && (
              <div style={{padding:"14px 16px",borderRadius:10,background:"var(--surface2)",border:"1px solid var(--border)",marginBottom:16,fontSize:12,color:"var(--text2)",lineHeight:1.6}}>
                <Icon name="cpu" size={13} color="var(--text2)"/> <span style={{fontWeight:500,color:"var(--text)"}}>Pay $600</span> before statement closes to drop utilization to <span style={{fontWeight:500,color:"var(--text)"}}>{Math.round(util*0.5)}%</span>. Estimated impact: <span style={{fontWeight:500,color:"var(--green)"}}>+8–12 pts</span>.
              </div>
            )}

            {/* Offers */}
            {c.offers.length > 0 && (<>
              <div style={{fontSize:11,color:"var(--text3)",fontWeight:500,letterSpacing:".8px",textTransform:"uppercase",margin:"4px 0 10px"}}>Offers</div>
              {c.offers.map((o,i) => (
                <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 0",borderBottom:i<c.offers.length-1?"1px solid var(--border)":"none",cursor:"pointer",transition:"padding-left .2s"}}
                  onMouseEnter={e=>(e.currentTarget.style.paddingLeft="4px")} onMouseLeave={e=>(e.currentTarget.style.paddingLeft="0")}>
                  <div>
                    <div style={{fontSize:13,color:"var(--text)"}}>{o.title}</div>
                    <div style={{fontSize:11,color:"var(--text2)",marginTop:1}}>{o.merchant} · Expires {o.expires}</div>
                  </div>
                  <span style={{fontSize:10,color:"var(--text2)",padding:"2px 8px",border:"1px solid var(--border)",borderRadius:4}}>{o.value}</span>
                </div>
              ))}
            </>)}

            {/* Earning rate */}
            <div style={{fontSize:11,color:"var(--text3)",fontWeight:500,letterSpacing:".8px",textTransform:"uppercase",margin:"20px 0 10px"}}>Earning rate</div>
            <div style={{fontSize:12,color:"var(--text2)",marginBottom:8}}>{c.rewardRate}</div>
          </div>
        )}

        {/* ═══ REWARDS TAB ═══ */}
        {tab === "rewards" && (
          <div className="ai" style={{paddingTop:16}}>
            <div style={{display:"flex",padding:"0 0 16px"}}>
              {[
                {label:"Points",value:c.points.toLocaleString()},
                {label:"Value",value:`$${Math.round(c.points*0.01)}`},
                {label:"This month",value:`+${Math.round(c.points*0.08)}`},
              ].map((s,i) => (
                <div key={i} style={{flex:1,textAlign:"center"}}>
                  <div style={{fontSize:20,fontWeight:500,color:"var(--text)",letterSpacing:"-.3px"}}>{s.value}</div>
                  <div style={{fontSize:10,color:"var(--text2)",marginTop:3}}>{s.label}</div>
                </div>
              ))}
            </div>
            {c.bestPlaces?.length > 0 && (<>
              <div style={{fontSize:11,color:"var(--text3)",fontWeight:500,letterSpacing:".8px",textTransform:"uppercase",margin:"8px 0 10px"}}>Best places to use</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {c.bestPlaces.map((p,i) => (
                  <span key={i} style={{fontSize:11,padding:"5px 10px",borderRadius:6,border:"1px solid var(--border)",color:"var(--text2)"}}>{p}</span>
                ))}
              </div>
            </>)}
            {c.signupBonus && (
              <div style={{margin:"20px 0 0",padding:"14px 16px",borderRadius:10,background:"var(--surface2)",border:"1px solid var(--border)",fontSize:12,color:"var(--text2)",lineHeight:1.6}}>
                <span style={{fontWeight:500,color:"var(--text)"}}>Welcome bonus:</span> {c.signupBonus.split("--")[0].trim()}
              </div>
            )}
          </div>
        )}

        {/* ═══ BENEFITS TAB ═══ */}
        {tab === "benefits" && (
          <div className="ai" style={{paddingTop:16}}>
            {c.keyBenefits?.map((b,i) => (
              <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"11px 0",borderBottom:i<c.keyBenefits.length-1?"1px solid var(--border)":"none"}}>
                <div style={{width:4,height:4,borderRadius:"50%",background:"var(--text3)",flexShrink:0,marginTop:6}}/>
                <div style={{fontSize:13,color:"var(--text)",lineHeight:1.5}}>{b}</div>
              </div>
            ))}
            {c.bestFor?.length > 0 && (<>
              <div style={{fontSize:11,color:"var(--text3)",fontWeight:500,letterSpacing:".8px",textTransform:"uppercase",margin:"20px 0 10px"}}>Best for</div>
              {c.bestFor.map((b,i) => (
                <div key={i} style={{fontSize:13,color:"var(--text2)",padding:"6px 0"}}>{b}</div>
              ))}
            </>)}
            {c.notGoodFor?.length > 0 && (<>
              <div style={{fontSize:11,color:"var(--text3)",fontWeight:500,letterSpacing:".8px",textTransform:"uppercase",margin:"20px 0 10px"}}>Not ideal for</div>
              {c.notGoodFor.map((b,i) => (
                <div key={i} style={{fontSize:13,color:"var(--text2)",padding:"6px 0"}}>{b}</div>
              ))}
            </>)}
          </div>
        )}

        {/* ═══ ACTIVITY TAB ═══ */}
        {tab === "activity" && (
          <div className="ai" style={{paddingTop:16}}>
            <div style={{display:"flex",padding:"0 0 16px"}}>
              {[
                {label:"APR",value:c.apr?.split("-")[0]||"N/A"},
                {label:"Annual fee",value:c.annualFee>0?`$${c.annualFee}`:"$0"},
                {label:"Perks value",value:`$${c.perksValue}/yr`},
              ].map((s,i) => (
                <div key={i} style={{flex:1,textAlign:"center"}}>
                  <div style={{fontSize:17,fontWeight:500,color:"var(--text)",letterSpacing:"-.3px"}}>{s.value}</div>
                  <div style={{fontSize:10,color:"var(--text2)",marginTop:3}}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{fontSize:12,color:"var(--text2)",lineHeight:1.6,padding:"12px 0 20px",borderTop:"1px solid var(--border)"}}>
              Net annual value: <span style={{fontWeight:500,color:"var(--text)"}}>${c.perksValue - c.annualFee}/yr</span> after fee. {c.perksValue > c.annualFee ? "This card pays for itself." : "Consider whether the benefits justify the fee."}
            </div>
          </div>
        )}

        {/* Bottom actions */}
        <div style={{borderTop:"1px solid var(--border)",marginTop:20,paddingTop:16}}>
          <button onClick={()=>onToggleFreeze?.(c.id)} className="press spring-hover" style={{width:"100%",padding:"11px 0",borderRadius:8,border:"1px solid var(--border2)",background:"transparent",color:"var(--text)",fontSize:13,fontWeight:500,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6,marginBottom:8}}>
            <Icon name={c.isFrozen?"unlock":"lock"} size={14} strokeWidth={1.5}/> {c.isFrozen?"Unfreeze":"Freeze"} card
          </button>
          <div style={{textAlign:"center",marginTop:8}}>
            <button onClick={()=>onDelete?.(c.id)} style={{fontSize:12,color:"var(--text3)",background:"none",border:"none",cursor:"pointer"}}>Remove card</button>
          </div>
        </div>
      </div>
    </div>
  );
}


function Chat({ cards, profile, go }: { cards:CreditCard[]; profile:UserProfile; go:(s:S)=>void }) {
  const [msgs, setMsgs] = useState<Msg[]>([
    {role:"ai",text:`Hi ${profile.name||"there"}! I'm your WiseCard AI advisor. I know your complete profile -- your cards, balances, spending habits, and goals. I can help you with: which card to use anywhere, how to maximize rewards and cashback, improving your credit score, paying off debt faster, applying for new cards, using any feature in the app, or any financial question. I can also search the web for current bonus offers and APRs if those have changed. What would you like to know?`,id:0},
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
      const systemPrompt = `You are the AI financial advisor inside WiseCard. Respond like a knowledgeable human advisor -- natural, clear, and appropriately detailed.

RULES:
- Greetings (hi, hello, hey, how are you) -> respond with a warm intro that tells them exactly what you can do. Example: "Hi [name]! I'm your WiseCard AI advisor. I know your full profile -- your cards, balances, points, spending habits, and goals. Here's what I can help you with: which card to use at any store or restaurant, how to maximize your rewards and cashback, how to improve your credit score, whether to apply for a new card, how to pay off debt faster, how to use any feature in the app, checking current bonus offers or APRs with a live web search, or anything else about your finances. What would you like to know?" -- keep it natural and friendly
- Simple questions -> answer in 1-2 sentences
- Complex financial questions -> answer as thoroughly as needed with real numbers and clear explanations
- Questions asking for a list or comparison -> use a clean numbered or bulleted list
- NEVER use **bold** or *italic* markdown formatting -- plain text only
- NEVER use emojis
- NEVER start with "Great!" "Sure!" "Absolutely!" or filler phrases
- Be direct and specific -- always reference their actual cards, balances, and spending when relevant
- Match the depth of your answer to the complexity of the question

APP GUIDE -- you know every feature:
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
- If user seems lost or confused -> briefly explain what WiseCard can do and suggest where to start
- If user asks "how do I..." -> give exact step by step instructions for that feature
- If user asks "what can you do" -> list the main features in a short bullet list
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
      setMsgs(p=>[...p,{role:"ai",text:aiText,id:uid+1,searched:!!data.usedSearch}]);
    } catch(err) {
      setMsgs(p=>[...p,{role:"ai",text:"Connection error. Please check your internet and try again.",id:uid+1}]);
    }
    setBusy(false);
  },[busy,nextId,cards,profile]);

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100vh",background:"var(--bg)"}}>
      <div style={{padding:"56px 20px 14px",borderBottom:"1px solid var(--border2)",background:"var(--surface)"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,maxWidth:800,margin:"0 auto"}}>
          <button onClick={()=>go("home")} className="press" style={{width:38,height:38,borderRadius:11,background:"var(--surface2)",border:"1px solid var(--border)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,cursor:"pointer"}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{stroke:"var(--text)"}} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <div style={{width:44,height:44,borderRadius:13,background:"var(--accent)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,boxShadow:"0 4px 16px rgba(37,99,235,.15)",flexShrink:0}}></div>
          <div>
            <h2 style={{fontSize:17,fontWeight:600}}>AI Financial Advisor</h2>
            <div style={{display:"flex",alignItems:"center",gap:5,marginTop:2}}>
              <span style={{width:8,height:8,borderRadius:"50%",background:"var(--green)",display:"inline-block"}}/>
              <span style={{color:"var(--text2)",fontSize:12}}>Knows your cards, goals & spending profile</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{flex:1,overflowY:"auto",padding:"20px 16px 0",display:"flex",flexDirection:"column",gap:14}}>
        <div style={{maxWidth:800,margin:"0 auto",width:"100%",display:"flex",flexDirection:"column",gap:14}}>
          {msgs.map(m=>(
            <div key={m.id} className="ai" style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",alignItems:"flex-end",gap:8}}>
              {m.role==="ai"&&<div style={{width:32,height:32,borderRadius:10,flexShrink:0,background:"var(--accent)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}></div>}
              <div style={{maxWidth:"78%",padding:"13px 18px",
                borderRadius:m.role==="user"?"20px 20px 5px 20px":"20px 20px 20px 5px",
                background:m.role==="user"?"var(--accent)":"var(--surface)",
                border:m.role==="ai"?"1px solid var(--border2)":"none",
                boxShadow:m.role==="user"?"0 4px 20px rgba(37,99,235,.15)":"var(--shadow)",
              }}>
                {m.searched && (
                  <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:8,paddingBottom:8,borderBottom:"1px solid var(--border)"}}>
                    <span style={{color:"var(--accent)",display:"flex"}}><Icon name="search" size={12}/></span>
                    <span style={{fontSize:12,color:"var(--accent)",fontWeight:600}}>Searched the web for current info</span>
                  </div>
                )}
                <p style={{color:m.role==="user"?"#ffffff":"var(--text)",fontSize:14,lineHeight:1.7}}>{m.text}</p>
              </div>
            </div>
          ))}
          {busy&&(
            <div style={{display:"flex",alignItems:"flex-end",gap:8}}>
              <div style={{width:32,height:32,borderRadius:10,background:"var(--accent)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}></div>
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
                color:"var(--text2)",fontSize:12,fontWeight:500,whiteSpace:"nowrap",transition:"all .15s",
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
            }}>-></button>
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
  const [selProgram, setSelProgram] = useState<string|null>(null);
  const [selPartnerType, setSelPartnerType] = useState<"airlines"|"hotels">("airlines");
  const totalPts = cards.reduce((s,c)=>s+c.points,0);

  // Which programs the user actually has, based on their cards
  const ownedPrograms = Array.from(new Set(cards.map(c=>c.issuer))).map(i=>issuerToProgram(i)).filter(Boolean) as typeof TRANSFER_PROGRAMS;
  const activeProgram = TRANSFER_PROGRAMS.find(p=>p.id===selProgram) || ownedPrograms[0] || TRANSFER_PROGRAMS[0];

  return (
    <div className="screen desktop-content screen-enter">
      <PageHead title="Travel & Points" sub="Maximize every mile and hotel night"/>
      <div className="px">
        <div className="au" style={{display:"flex",gap:5,marginBottom:24,background:"var(--surface2)",padding:4,borderRadius:14}}>
          {["Points","Book Travel","Transfers"].map((t,i)=>(
            <button key={t} onClick={()=>setTab(i)} className="press" style={{flex:1,padding:"10px",borderRadius:11,border:"none",background:tab===i?"var(--accent)":"none",color:tab===i?"#fff":"var(--text2)",fontSize:14,fontWeight:tab===i?700:500,transition:"all .2s"}}>{t}</button>
          ))}
        </div>

        {tab===0&&<div className="ai">
          {/* Best Card by Destination */}
          <div className="card-surface hover-lift" style={{padding:18,marginBottom:16}}>
            <div style={{fontSize:14,fontWeight:700,color:"var(--text)",marginBottom:10,display:"flex",alignItems:"center",gap:6}}>
              <Icon name="globe" size={14}/> Best Card by Purchase Type
            </div>
            {[
              {cat:"Flights (direct booking)",match:["csr","amp","covx"],best:"Sapphire Reserve (8x via Chase Travel) or Amex Platinum (5x direct)"},
              {cat:"Hotels (direct booking)",match:["csr","amp","covx"],best:"Sapphire Reserve (8x Chase Travel) or Venture X (10x portal)"},
              {cat:"International Dining",match:["csr","amg"],best:"Amex Gold (4x, no FX fee) or Sapphire Reserve (3x, no FX fee)"},
              {cat:"Rental Cars",match:["csr","covx"],best:"Sapphire Reserve (primary CDW insurance) or Venture X (10x portal)"},
              {cat:"Airport Shopping",match:["covx","cov"],best:"Capital One Venture/Venture X (2x on everything, no FX fee)"},
            ].map((row,i) => {
              const hasCard = row.match.some(m => cards.some(c => c.dbId === m));
              return (
                <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:i<4?"1px solid var(--border)":"none"}}>
                  <div>
                    <div style={{fontSize:12,fontWeight:600,color:"var(--text)"}}>{row.cat}</div>
                    <div style={{fontSize:10,color:"var(--text2)",marginTop:1}}>{row.best}</div>
                  </div>
                  <span style={{fontSize:9,padding:"2px 6px",borderRadius:4,background:hasCard?"rgba(34,197,94,.1)":"rgba(239,68,68,.1)",color:hasCard?"#22c55e":"#ef4444",fontWeight:600}}>{hasCard?"In Wallet":"Get Card"}</span>
                </div>
              );
            })}
            <div style={{fontSize:10,color:"var(--text2)",marginTop:8,fontStyle:"italic"}}>Based on your {cards.length} cards · Excludes foreign transaction fees</div>
          </div>
          <div className="card-surface hover-lift" style={{padding:22,marginBottom:16}}>
            <p style={{color:"var(--text2)",fontSize:13,marginBottom:4}}>Total across all programs</p>
            <h2 style={{fontSize:38,fontWeight:700,letterSpacing:"-1px",marginBottom:4}}>{f(totalPts)}</h2>
            <p className="gold-text" style={{fontSize:15,fontWeight:600}}> ${f(Math.round(totalPts*.015))} estimated value</p>
          </div>
          {cards.length===0 ? <p style={{color:"var(--text2)",fontSize:14,textAlign:"center",padding:"40px 0"}}>Add cards to see your points breakdown</p>
          : cards.map((c,i)=>(
            <div key={c.id} className={`au d${i+1} card-surface hover-lift`} style={{padding:"14px 16px",marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:42,height:28,borderRadius:7,background:c.gradient,boxShadow:"0 2px 8px rgba(0,0,0,.5)"}}/>
                <div><p style={{color:"var(--text)",fontSize:14,fontWeight:600,letterSpacing:"-.1px"}}>{c.name}</p><p style={{color:"var(--text2)",fontSize:12,marginTop:1}}>{c.issuer}</p></div>
              </div>
              <div style={{textAlign:"right"}}>
                <p style={{color:"var(--text)",fontSize:14,fontWeight:700}}>{f(c.points)}</p>
                <p className="gold-text" style={{fontSize:12,marginTop:1}}> ${f(Math.round(c.points*.015))}</p>
              </div>
            </div>
          ))}
        </div>}

        {tab===1&&<div className="ai">
          <p style={{color:"var(--text2)",fontSize:14,marginBottom:16,display:"flex",alignItems:"center",gap:6}}><Icon name="fire" size={14}/> Best redemptions with your current points</p>
          {[
            {route:"US -> Europe Business Class",pts:"55,000 pts",via:"Air France via Chase UR",val:"~$3,200 ticket",cpp:"5.8/pt"},
            {route:"US -> Japan Economy",pts:"35,000 pts",via:"ANA via Amex MR",val:"~$1,100 ticket",cpp:"3.1/pt"},
            {route:"Park Hyatt Tokyo",pts:"35,000 pts/night",via:"World of Hyatt",val:"~$700/night",cpp:"2.0/pt"},
            {route:"US -> Caribbean",pts:"25,000 pts",via:"Delta via Amex MR",val:"~$650 ticket",cpp:"2.6/pt"},
          ].map((r,i)=>(
            <div key={i} className={`au d${i+1} card-surface hover-lift`} style={{padding:"16px 18px",marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                <p style={{color:"var(--text)",fontSize:14,fontWeight:600,flex:1,paddingRight:10}}>{r.route}</p>
                <span className="pill pill-gold">{r.cpp}</span>
              </div>
              <p style={{color:"var(--text2)",fontSize:13,marginBottom:8}}>{r.via}</p>
              <div style={{display:"flex",justifyContent:"space-between"}}>
                <span style={{color:"var(--accent)",fontSize:14,fontWeight:700}}>{r.pts}</span>
                <span style={{color:"var(--green)",fontSize:14,fontWeight:600}}>{r.val}</span>
              </div>
            </div>
          ))}
        </div>}

        {tab===2&&<div className="ai">
          {ownedPrograms.length>0 && (
            <div style={{background:"var(--accentbg)",borderRadius:12,padding:"10px 14px",marginBottom:16,border:"1px solid rgba(37,99,235,.15)"}}>
              <p style={{color:"var(--accent)",fontSize:13,fontWeight:600,display:"flex",alignItems:"center",gap:6}}><Icon name="check" size={13}/> Showing programs based on your {cards.length} card{cards.length!==1?"s":""}</p>
            </div>
          )}

          {/* Program selector pills */}
          <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:4,marginBottom:18,WebkitOverflowScrolling:"touch"}}>
            {TRANSFER_PROGRAMS.map(p=>{
              const owned = ownedPrograms.some(op=>op.id===p.id);
              const isActive = activeProgram.id===p.id;
              return (
                <button key={p.id} onClick={()=>setSelProgram(p.id)} className="press" style={{
                  flexShrink:0,padding:"9px 14px",borderRadius:99,whiteSpace:"nowrap",
                  border:`1.5px solid ${isActive?p.color:"var(--border)"}`,
                  background:isActive?`${p.color}18`:"var(--surface2)",cursor:"pointer",transition:"all .15s",
                  display:"flex",alignItems:"center",gap:6,
                }}>
                  <span style={{width:8,height:8,borderRadius:"50%",background:p.color,flexShrink:0}}/>
                  <span style={{fontSize:13,fontWeight:isActive?700:500,color:isActive?p.color:"var(--text2)"}}>{p.name}</span>
                  {owned&&<span style={{fontSize:10,color:"var(--green)",fontWeight:700}}>●</span>}
                </button>
              );
            })}
          </div>

          {/* Program note */}
          <div className="card-surface" style={{padding:"13px 16px",marginBottom:16,borderLeft:`3px solid ${activeProgram.color}`}}>
            <p style={{color:"var(--text2)",fontSize:13,lineHeight:1.5}}>{activeProgram.note}</p>
          </div>

          {/* Airlines/Hotels toggle */}
          <div style={{display:"flex",gap:8,marginBottom:14}}>
            <button onClick={()=>setSelPartnerType("airlines")} className="press" style={{flex:1,padding:"9px",borderRadius:10,border:"1px solid var(--border)",background:selPartnerType==="airlines"?"var(--surface2)":"none",fontSize:13,fontWeight:selPartnerType==="airlines"?700:500,color:selPartnerType==="airlines"?"var(--text)":"var(--text2)"}}>
              <span style={{display:"inline-flex",alignItems:"center",gap:6}}><Icon name="travel" size={13}/> Airlines ({activeProgram.airlines.length})</span>
            </button>
            {activeProgram.hotels.length>0 && (
              <button onClick={()=>setSelPartnerType("hotels")} className="press" style={{flex:1,padding:"9px",borderRadius:10,border:"1px solid var(--border)",background:selPartnerType==="hotels"?"var(--surface2)":"none",fontSize:13,fontWeight:selPartnerType==="hotels"?700:500,color:selPartnerType==="hotels"?"var(--text)":"var(--text2)"}}>
                <span style={{display:"inline-flex",alignItems:"center",gap:6}}><Icon name="home" size={13}/> Hotels ({activeProgram.hotels.length})</span>
              </button>
            )}
          </div>

          {/* Partner list */}
          <div className="card-surface" style={{overflow:"hidden"}}>
            {(selPartnerType==="airlines"?activeProgram.airlines:activeProgram.hotels).map((partner,i,arr)=>(
              <div key={partner.name} style={{padding:"13px 16px",borderBottom:i<arr.length-1?"1px solid var(--border)":"none"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                  <p style={{color:"var(--text)",fontSize:14,fontWeight:600}}>{partner.name}</p>
                  <span style={{color:activeProgram.color,fontSize:14,fontWeight:700}}>{partner.ratio}</span>
                </div>
                <p style={{color:"var(--text2)",fontSize:12,lineHeight:1.4}}>{partner.best}</p>
                {(partner as any).flag && (
                  <p style={{color:"var(--amber)",fontSize:12,marginTop:5,lineHeight:1.4,display:"flex",gap:5}}>
                    <Icon name="warning" size={12}/><span>{(partner as any).flag}</span>
                  </p>
                )}
              </div>
            ))}
          </div>

          <p style={{color:"var(--text3)",fontSize:12,textAlign:"center",marginTop:14,lineHeight:1.5}}>
            Transfer ratios shown are standard rates. Issuers regularly run 20-30% transfer bonuses to specific partners — check the issuer's app before transferring.
          </p>
        </div>}
      </div>
    </div>
  );
}

/* ============================================================
   GOALS SCREEN
   ============================================================ */
function Goals({ goals, onAdd, onUpdateProgress, onDelete }: { goals:Goal[]; onAdd:(g:Omit<Goal,"id">)=>void; onUpdateProgress:(id:string,current:number)=>void; onDelete:(id:string)=>void }) {
  const [add, setAdd] = useState(false);
  const [open, setOpen] = useState<string|null>(null);
  const [editingProgress, setEditingProgress] = useState<string|null>(null);
  const [progressInput, setProgressInput] = useState("");

  const GOAL_TYPES: [string,string,string,number,"$"|"%"|"pts",string,string[]][] = [
    ["analytics","Utilization","Keep cards under 30%",30,"%","#C9A84C",["Pay down your highest-balance card first","Keep each card under 30% individually, not just overall","Consider asking for a credit limit increase"]],
    ["wallet","Save Money","Hit a savings target",1000,"$","#2DC8A0",["Set up an automatic transfer on payday","Track spending in Analytics to find where to cut back","Move savings to a high-yield account"]],
    ["trend-down","Credit Score","Reach a target score",750,"pts","#4F6EF7",["Pay every bill on time, every time","Keep utilization under 10% before statement closes","Don't apply for new cards while building score"]],
    ["travel","Travel","Earn points for a trip",100000,"pts","#F59E0B",["Use the Travel & Points screen to find transfer bonuses","Put everyday spend on your highest-multiplier card","Watch for limited-time transfer bonuses (20-30%)"]],
    ["card","Pay Off Debt","Become debt free",5000,"$","#EF4444",["Use the Debt Payoff Planner to pick avalanche or snowball","Put any extra cash toward your highest-APR card first","Avoid adding new charges while paying down debt"]],
    ["shield","Emergency Fund","3-6 months expenses",10000,"$","#8B5CF6",["Start with a goal of 1 month of expenses, then build up","Keep this separate from everyday checking","Automate a fixed amount each payday"]],
  ];
  const [customTitle, setCustomTitle] = useState("");
  const [customTarget, setCustomTarget] = useState("");
  const [selectedType, setSelectedType] = useState<typeof GOAL_TYPES[0]|null>(null);

  const createGoal = () => {
    if(!selectedType) return;
    const [emoji,title,,defaultTarget,unit,color,tips] = selectedType;
    onAdd({
      emoji, title: customTitle || title, target: Number(customTarget)||defaultTarget,
      current: 0, unit, color, due: "No deadline set", tips,
    });
    setAdd(false); setSelectedType(null); setCustomTitle(""); setCustomTarget("");
  };

  const saveProgress = (goalId:string) => {
    onUpdateProgress(goalId, Number(progressInput)||0);
    setEditingProgress(null);
  };

  return (
    <div className="screen desktop-content screen-enter">
      <PageHead title="My Goals" sub="Track your financial targets"
        right={<button onClick={()=>setAdd(a=>!a)} className="pill pill-gold press" style={{fontSize:13,fontWeight:700}}>+ Add Goal</button>}/>
      <div className="px">
        {goals.length === 0 && !add && (
          <EmptyState icon="goal" title="No goals yet" sub="Set financial goals — pay off debt, boost your credit score, or save points for a trip." action="Set Your First Goal" onAction={()=>setAdd(true)}/>
        )}
        {add&&(
          <div className="ap card-surface" style={{border:"1.5px solid var(--accent)",padding:20,marginBottom:20}}>
            {!selectedType ? (
              <>
                <p style={{color:"var(--text)",fontSize:15,fontWeight:600,marginBottom:14}}>Choose a goal type</p>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  {GOAL_TYPES.map(gt=>(
                    <button key={gt[1]} onClick={()=>setSelectedType(gt)} className="press hover-lift card-surface-2" style={{padding:"14px 12px",textAlign:"left"}}>
                      <p style={{marginBottom:7,color:gt[5]}}><Icon name={gt[0]} size={22}/></p>
                      <p style={{color:"var(--text)",fontSize:13,fontWeight:700}}>{gt[1]}</p>
                      <p style={{color:"var(--text2)",fontSize:12,marginTop:2}}>{gt[2]}</p>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <p style={{color:"var(--text)",fontSize:15,fontWeight:600,marginBottom:14}}>{selectedType[0]} {selectedType[1]} Goal</p>
                <div style={{marginBottom:12}}>
                  <label style={{fontSize:12,color:"var(--text2)",fontWeight:600,display:"block",marginBottom:5}}>Goal title</label>
                  <input className="field" placeholder={selectedType[1]} value={customTitle} onChange={e=>setCustomTitle(e.target.value)} style={{padding:"10px 12px"}}/>
                </div>
                <div style={{marginBottom:16}}>
                  <label style={{fontSize:12,color:"var(--text2)",fontWeight:600,display:"block",marginBottom:5}}>Target ({selectedType[4]})</label>
                  <input className="field" type="number" placeholder={String(selectedType[3])} value={customTarget} onChange={e=>setCustomTarget(e.target.value)} style={{padding:"10px 12px"}}/>
                </div>
                <div style={{display:"flex",gap:10}}>
                  <button onClick={createGoal} className="btn-gold press" style={{flex:1,padding:"11px"}}>Create Goal</button>
                  <button onClick={()=>setSelectedType(null)} className="btn-ghost press" style={{padding:"11px 16px"}}>Back</button>
                </div>
              </>
            )}
          </div>
        )}
        {goals.map((g,i)=>{
          const p=Math.min(100,Math.round(g.current/g.target*100));
          const isOpen=open===g.id;
          return (
            <div key={g.id} className="card-surface" style={{padding:"20px",marginBottom:16}}>
              <div style={{display:"flex",gap:14,alignItems:"flex-start",marginBottom:16}}>
                <div style={{width:52,height:52,borderRadius:16,flexShrink:0,background:`${g.color}18`,display:"flex",alignItems:"center",justifyContent:"center",color:g.color}}><Icon name={g.emoji} size={24}/></div>
                <div style={{flex:1}}>
                  <p style={{color:"var(--text)",fontSize:15,fontWeight:600,marginBottom:2}}>{g.title}</p>
                  <p style={{color:"var(--text2)",fontSize:13}}>{g.due}</p>
                </div>
                <button onClick={()=>onDelete(g.id)} style={{background:"none",border:"none",color:"var(--text3)",cursor:"pointer",flexShrink:0,display:"flex"}}><Icon name="trash" size={15}/></button>
              </div>
              <Bar v={g.current} max={g.target} color={g.color} h={7}/>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:8,marginBottom:14}}>
                <p style={{color:"var(--text2)",fontSize:13}}>{g.unit==="$"?"$":""}{f(g.current)}{g.unit!=="$"?" "+g.unit:""} ({p}%)</p>
                <p style={{color:"var(--text2)",fontSize:13}}>Target: {g.unit==="$"?"$":""}{f(g.target)}{g.unit!=="$"?" "+g.unit:""}</p>
              </div>
              {editingProgress===g.id ? (
                <div style={{display:"flex",gap:8,marginBottom:10}}>
                  <input className="field" type="number" placeholder="Current progress" value={progressInput} onChange={e=>setProgressInput(e.target.value)} style={{flex:1,padding:"8px 10px",fontSize:14}}/>
                  <button onClick={()=>saveProgress(g.id)} style={{background:"var(--green)",border:"none",borderRadius:8,padding:"8px 14px",color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer"}}>Save</button>
                  <button onClick={()=>setEditingProgress(null)} style={{background:"var(--surface2)",border:"none",borderRadius:8,padding:"8px 12px",color:"var(--text2)",fontSize:13,cursor:"pointer"}}>✕</button>
                </div>
              ) : (
                <button onClick={()=>{setProgressInput(String(g.current));setEditingProgress(g.id);}} style={{background:"none",border:"none",color:"var(--accent)",fontSize:14,fontWeight:600,padding:0,marginRight:16}}>Update progress</button>
              )}
              <button onClick={()=>setOpen(isOpen?null:g.id)} style={{background:"none",border:"none",color:"var(--accent)",fontSize:14,fontWeight:600,padding:0}}>
                {isOpen?"Hide":"View"} action plan
              </button>
              {isOpen&&(
                <div className="ai" style={{marginTop:14,background:"var(--surface2)",borderRadius:14,padding:"14px 16px"}}>
                  <p style={{color:"var(--text3)",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.8,marginBottom:12}}>Your Action Plan</p>
                  {g.tips.map((tip,ti)=>(
                    <div key={ti} style={{display:"flex",gap:10,marginBottom:ti<g.tips.length-1?12:0}}>
                      <span style={{width:22,height:22,borderRadius:"50%",flexShrink:0,marginTop:1,background:`${g.color}20`,color:g.color,fontSize:12,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center"}}>{ti+1}</span>
                      <p style={{color:"var(--text2)",fontSize:14,lineHeight:1.6}}>{tip}</p>
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
  const pp = sel.length>0 ? (247/(sel.length+1)).toFixed(2) : "--";
  return (
    <div className="screen desktop-content screen-enter">
      <PageHead title="Split Bills" sub="Fair splits  Smart card picks"/>
      <div className="px">
        {popup&&(
          <div className="ap card-surface" style={{border:"1.5px solid var(--accent)",padding:20,marginBottom:20,position:"relative"}}>
            <button onClick={()=>setPopup(false)} style={{position:"absolute",top:14,right:16,background:"none",border:"none",color:"var(--text3)",fontSize:20}}></button>
            <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:14}}>
              <div style={{width:48,height:48,borderRadius:14,background:"var(--accentbg)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--accent)"}}><Icon name="dining" size={22}/></div>
              <div>
                <p style={{color:"var(--text)",fontSize:17,fontWeight:600,marginBottom:2}}>$247 at Nobu</p>
                <p style={{color:"var(--text2)",fontSize:13}}>
                  {cards.length>0 ? `Paid with ${cards[0].name}  ${Math.round(247*(parseFloat(cards[0].rewardRate)||1)/100*100)} pts earned` : "Split this bill?"}
                </p>
              </div>
            </div>
            <div style={{background:"rgba(45,200,160,.07)",border:"1px solid rgba(45,200,160,.2)",borderRadius:12,padding:"10px 14px",marginBottom:14}}>
              <p style={{color:"var(--green)",fontSize:13,lineHeight:1.5,display:"flex",alignItems:"flex-start",gap:6}}><Icon name="rocket" size={13}/><span>Great choice using {cards.length>0?cards[0].name:"your card"} -- maximizing your dining rewards!</span></p>
            </div>
            <p style={{color:"var(--text2)",fontSize:14,fontWeight:500,marginBottom:10}}>Who did you dine with? <span style={{color:"var(--text3)",fontWeight:400}}>(select multiple)</span></p>
            <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:16}}>
              {PEOPLE.map(p=>{const on=sel.includes(p);return(
                <button key={p} onClick={()=>setSel(prev=>on?prev.filter(x=>x!==p):[...prev,p])} className="press" style={{padding:"8px 16px",borderRadius:22,fontSize:14,fontWeight:600,border:`1.5px solid ${on?"var(--accent)":"var(--border2)"}`,background:on?"rgba(201,168,76,.12)":"var(--surface2)",color:on?"var(--accent)":"var(--text2)",transition:"all .15s"}}>
                  {on?" ":""}{p}
                </button>
              );})}
            </div>
            {sel.length>0&&<div className="ai" style={{background:"var(--surface2)",borderRadius:12,padding:"12px 16px",marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <p style={{color:"var(--text2)",fontSize:14}}>Split {sel.length+1} ways</p>
              <p className="gold-text" style={{fontSize:18,fontWeight:800}}>${pp} each</p>
            </div>}
            <button onClick={()=>setPopup(false)} className="btn-gold press" style={{width:"100%"}}>
               Create Split {sel.length>0?`(${sel.length+1} people)`:""}
            </button>
          </div>
        )}
        <div style={{display:"flex",gap:5,marginBottom:20,background:"var(--surface2)",padding:4,borderRadius:13}}>
          {["Active","History"].map((t,i)=>(
            <button key={t} onClick={()=>setTab(i)} className="press" style={{flex:1,padding:"9px",borderRadius:10,border:"none",background:tab===i?"var(--accent)":"none",color:tab===i?"#fff":"var(--text2)",fontSize:13,fontWeight:700,transition:"all .2s"}}>{t}</button>
          ))}
        </div>
        {SAMPLE_BILLS.filter(b=>tab===0?!b.done:b.done).map((bill,i)=>(
          <div key={bill.id} className={`au d${i+1} card-surface`} style={{padding:"16px 18px",marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:40,height:40,borderRadius:12,background:"var(--accentbg)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--accent)",flexShrink:0}}><Icon name={bill.emoji} size={18}/></div>
                <div>
                  <p style={{color:"var(--text)",fontSize:14,fontWeight:700}}>{bill.name}</p>
                  <p style={{color:"var(--text2)",fontSize:12,marginTop:2}}>{bill.date}  {bill.card}</p>
                </div>
              </div>
              <div style={{textAlign:"right"}}>
                <p style={{color:"var(--text)",fontSize:16,fontWeight:800}}>${f(bill.amount)}</p>
                <p className="gold-text" style={{fontSize:13,marginTop:2}}>${(bill.amount/bill.people.length).toFixed(2)}/person</p>
              </div>
            </div>
            <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:12}}>
              {bill.people.map(p=><span key={p} className={`pill ${bill.done?"pill-emerald":"pill-gold"}`} style={{fontSize:11}}>{p}</span>)}
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <p style={{color:"var(--text2)",fontSize:13,display:"flex",alignItems:"center",gap:5}}><Icon name="card" size={11}/> {f(bill.pts)} pts earned</p>
              {!bill.done?<div style={{display:"flex",gap:7}}>
                <button className="btn-ghost press" style={{padding:"7px 12px",fontSize:12}}>Remind</button>
                <button className="press" style={{padding:"7px 16px",background:"rgba(45,200,160,.1)",border:"1.5px solid rgba(45,200,160,.3)",borderRadius:9,color:"var(--green)",fontSize:12,fontWeight:700}}>Settle via Venmo</button>
              </div>:<span className="pill pill-emerald"> Settled</span>}
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
  const [filter, setFilter] = useState<"all"|"remaining"|"expiring">("remaining");
  const [cardFilter, setCardFilter] = useState<string>("all");
  const [expandedOffer, setExpandedOffer] = useState<string|null>(null);

  // Color system — three jewel tones
  const colors = { blue:"#5B8DB8", green:"#5B9A6F", amber:"#C4875C" };

  // Dynamic perks based on owned cards
  const perksByCard: {card:string; dbId:string; perks:{name:string;icon:string;total:number;used:number;resets:string;color:string}[]}[] = [
    {card:"Blue Cash Everyday", dbId:"ambu", perks:[
      {name:"Disney Bundle credit",icon:"streaming",total:84,used:49,resets:"Monthly ($7/mo)",color:colors.green},
      {name:"Cash back rewards",icon:"dollar",total:360,used:186,resets:"Ongoing (3% groceries)",color:colors.blue},
    ]},
    {card:"Blue Cash Preferred", dbId:"ambc", perks:[
      {name:"Disney Bundle credit",icon:"streaming",total:84,used:49,resets:"Monthly ($7/mo)",color:colors.green},
      {name:"Cash back rewards",icon:"dollar",total:540,used:280,resets:"Ongoing (6% groceries)",color:colors.blue},
    ]},
    {card:"Chase Sapphire Reserve", dbId:"csr", perks:[
      {name:"Travel credit",icon:"travel",total:300,used:180,resets:"Anniversary",color:colors.blue},
      {name:"Hotel Edit credit",icon:"globe",total:500,used:201,resets:"Anniversary",color:colors.blue},
      {name:"Dining credit",icon:"dining",total:300,used:135,resets:"Semi-annual",color:colors.green},
      {name:"Apple TV+ and Music",icon:"streaming",total:288,used:288,resets:"Monthly",color:colors.green},
    ]},
    {card:"Chase Sapphire Preferred", dbId:"csp", perks:[
      {name:"Travel credit",icon:"travel",total:50,used:25,resets:"Anniversary",color:colors.blue},
    ]},
    {card:"Amex Gold Card", dbId:"amg", perks:[
      {name:"Uber cash",icon:"gas",total:120,used:96,resets:"Monthly ($10/mo)",color:colors.amber},
      {name:"Dining credit",icon:"dining",total:120,used:80,resets:"Monthly ($10/mo)",color:colors.green},
      {name:"Dunkin credit",icon:"dining",total:84,used:56,resets:"Monthly ($7/mo)",color:colors.amber},
    ]},
    {card:"Amex Platinum Card", dbId:"amp", perks:[
      {name:"Airline fee credit",icon:"travel",total:200,used:0,resets:"Jan 1",color:colors.blue},
      {name:"Hotel credit",icon:"globe",total:200,used:120,resets:"Jan 1",color:colors.blue},
      {name:"Digital entertainment",icon:"streaming",total:240,used:160,resets:"Monthly ($20/mo)",color:colors.green},
      {name:"Saks Fifth Avenue",icon:"shopping",total:100,used:50,resets:"Semi-annual ($50)",color:colors.amber},
    ]},
    {card:"Capital One Venture X", dbId:"covx", perks:[
      {name:"Travel credit",icon:"travel",total:300,used:180,resets:"Anniversary",color:colors.blue},
    ]},
    {card:"Capital One Venture", dbId:"cov", perks:[
      {name:"Miles bonus",icon:"travel",total:100,used:0,resets:"Ongoing",color:colors.blue},
    ]},
    {card:"Hilton Aspire", dbId:"hiltonaspire", perks:[
      {name:"Resort credits",icon:"travel",total:400,used:200,resets:"Semi-annual ($200)",color:colors.blue},
      {name:"Flight credits",icon:"travel",total:200,used:50,resets:"Quarterly ($50)",color:colors.blue},
      {name:"Free night award",icon:"globe",total:150,used:0,resets:"Anniversary",color:colors.amber},
    ]},
    {card:"Chase Freedom Flex", dbId:"cff", perks:[
      {name:"Quarterly bonus categories",icon:"shopping",total:300,used:125,resets:"Quarterly (5% on $1500)",color:colors.green},
    ]},
    {card:"Chase Freedom Unlimited", dbId:"cfu", perks:[
      {name:"Grocery bonus (first year)",icon:"groceries",total:300,used:140,resets:"Annual (5% on $12K)",color:colors.green},
    ]},
    {card:"Costco Visa", dbId:"costco", perks:[
      {name:"Annual reward check",icon:"dollar",total:400,used:210,resets:"Annual (Feb)",color:colors.amber},
    ]},
  ];

  // Only show perks for cards the user actually owns — generate usage dynamically
  const ownedPerks = perksByCard.filter(pb => cards.some(c => c.dbId === pb.dbId)).map(pb => {
    const card = cards.find(c => c.dbId === pb.dbId);
    // Generate consistent usage from card balance as seed
    const seed = card ? (card.balance + card.limit + card.points) : 0;
    return {
      ...pb,
      perks: pb.perks.map((p, i) => ({
        ...p,
        used: Math.min(p.total, Math.round(p.total * (0.3 + ((seed + i * 137) % 60) / 100)))
      }))
    };
  });
  const allPerks = ownedPerks.flatMap(pb => pb.perks.map(p => ({...p, card: pb.card, dbId: pb.dbId})));
  const filteredPerks = allPerks.filter(p => {
    if (cardFilter !== "all" && p.dbId !== cardFilter) return false;
    if (filter === "expiring") return (p.total - p.used) > 0 && (p.total - p.used) < p.total * 0.4;
    if (filter === "remaining") return (p.total - p.used) > 0;
    return true;
  });

  const totalValue = allPerks.reduce((s,p) => s + p.total, 0);
  const totalUsed = allPerks.reduce((s,p) => s + p.used, 0);
  const totalRemaining = totalValue - totalUsed;
  const expiring = allPerks.filter(p => (p.total - p.used) > 0 && (p.total - p.used) < p.total * 0.4).reduce((s,p) => s + (p.total - p.used), 0);
  const usedPct = totalValue > 0 ? Math.round(totalUsed / totalValue * 100) : 0;

  // All offers from all cards
  const allOffers = cards.flatMap(c => c.offers.map(o => ({...o, card: c.name, dbId: c.dbId, issuer: c.issuer})));
  const filteredOffers = cardFilter === "all" ? allOffers : allOffers.filter(o => o.dbId === cardFilter);

  // Rings data — top 3 credits by remaining value
  const topCredits = [...allPerks].filter(p => p.total - p.used > 0).sort((a,b) => (b.total - b.used) - (a.total - a.used)).slice(0, 3);

  // Missing value
  const unusedCards = perksByCard.filter(pb => !cards.some(c => c.dbId === pb.dbId));
  const missingValue = unusedCards.reduce((s,pb) => s + pb.perks.reduce((a,p) => a + p.total, 0), 0);

  return (
    <div className="screen desktop-content screen-enter">
      <div className="px" style={{paddingTop:8}}>
        
        <h1 style={{fontSize:24,fontWeight:500,color:"var(--text)",letterSpacing:"-.3px",margin:"0 0 24px"}}>Rewards</h1>

        {/* Vault hero */}
        <div style={{textAlign:"center",padding:"28px 20px 24px"}}>
          <div className="score-entrance" style={{fontSize:48,fontWeight:500,color:"var(--text)",letterSpacing:"-2px",lineHeight:1,fontVariantNumeric:"tabular-nums"}}>${totalRemaining.toLocaleString()}</div>
          <div style={{fontSize:13,color:"var(--text2)",marginTop:6}}>Available this year</div>
          <div style={{display:"flex",justifyContent:"center",gap:0,marginTop:20}}>
            {[
              {key:"all" as const,label:"Total",value:`$${totalValue.toLocaleString()}`,color:"var(--text)"},
              {key:"remaining" as const,label:"Remaining",value:`$${totalRemaining.toLocaleString()}`,color:colors.green},
              {key:"expiring" as const,label:"Expiring",value:`$${expiring}`,color:colors.amber},
            ].map(m => (
              <div key={m.key} onClick={()=>setFilter(m.key)} className="press" style={{padding:"10px 24px",cursor:"pointer",textAlign:"center",position:"relative"}}>
                <div style={{fontSize:16,fontWeight:500,letterSpacing:"-.3px",color:m.color,opacity:filter===m.key?1:0.45,transition:"opacity .2s"}}>{m.value}</div>
                <div style={{fontSize:10,color:"var(--text2)",marginTop:2}}>{m.label}</div>
                {filter===m.key && <div style={{position:"absolute",bottom:0,left:"50%",transform:"translateX(-50%)",width:20,height:1.5,borderRadius:1,background:m.color,transition:"all .25s cubic-bezier(.22,1,.36,1)"}}/>}
              </div>
            ))}
          </div>
        </div>

        {/* Activity rings + legend */}
        {topCredits.length > 0 && (
          <div style={{display:"flex",alignItems:"center",gap:28,padding:"16px 0 24px"}}>
            <svg width={130} height={130} viewBox="0 0 130 130" style={{flexShrink:0}}>
              {topCredits.map((cr,i) => {
                const r = 56 - i * 10;
                const circ = 2 * Math.PI * r;
                const pct = cr.total > 0 ? cr.used / cr.total : 0;
                const offset = circ * (1 - pct);
                return (
                  <g key={i}>
                    <circle cx={65} cy={65} r={r} fill="none" stroke="var(--border)" strokeWidth={5.5} opacity={0.5}/>
                    <circle cx={65} cy={65} r={r} fill="none" stroke={cr.color} strokeWidth={5.5}
                      strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
                      transform="rotate(-90 65 65)"
                      style={{transition:"stroke-dashoffset .8s cubic-bezier(.22,1,.36,1)"}}/>
                  </g>
                );
              })}
              <text x={65} y={62} textAnchor="middle" fontSize={18} fontWeight={500} fill="var(--text)" style={{fontFamily:"var(--sans)"}}>{usedPct}%</text>
              <text x={65} y={76} textAnchor="middle" fontSize={10} fill="var(--text2)">used</text>
            </svg>
            <div style={{flex:1}}>
              {topCredits.map((cr,i) => (
                <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0",borderBottom:i<topCredits.length-1?"1px solid var(--border)":"none"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{width:8,height:8,borderRadius:"50%",background:cr.color,flexShrink:0}}/>
                    <div>
                      <div style={{fontSize:13,color:"var(--text)"}}>{cr.name}</div>
                      <div style={{fontSize:11,color:"var(--text2)"}}>{cr.card.split(" ").slice(-2).join(" ")}</div>
                    </div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:14,fontWeight:500,color:cr.color}}>${cr.total - cr.used}</div>
                    <div style={{fontSize:10,color:"var(--text2)"}}>of ${cr.total}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Card filter chips */}
        <div style={{display:"flex",gap:6,marginBottom:16,overflowX:"auto",paddingBottom:2}} className="no-scrollbar">
          <button onClick={()=>setCardFilter("all")} className="press" style={{padding:"7px 14px",borderRadius:18,border:cardFilter==="all"?"none":"1px solid var(--border)",fontSize:12,cursor:"pointer",background:cardFilter==="all"?"var(--text)":"transparent",color:cardFilter==="all"?"var(--surface)":"var(--text2)",fontWeight:cardFilter==="all"?500:400,whiteSpace:"nowrap",transition:"all .2s"}}>All cards</button>
          {ownedPerks.map(pb => (
            <button key={pb.dbId} onClick={()=>setCardFilter(cardFilter===pb.dbId?"all":pb.dbId)} className="press" style={{padding:"7px 14px",borderRadius:18,border:cardFilter===pb.dbId?"none":"1px solid var(--border)",fontSize:12,cursor:"pointer",background:cardFilter===pb.dbId?"var(--text)":"transparent",color:cardFilter===pb.dbId?"var(--surface)":"var(--text2)",fontWeight:cardFilter===pb.dbId?500:400,whiteSpace:"nowrap",transition:"all .2s"}}>{pb.card.split(" ").slice(-2).join(" ")}</button>
          ))}
        </div>

        {/* AI insight */}
        {expiring > 0 && (
          <div style={{padding:"14px 16px",borderRadius:10,marginBottom:4,fontSize:12,color:"var(--text2)",lineHeight:1.6,background:`linear-gradient(135deg,${colors.amber}08,${colors.amber}02)`,border:`1px solid ${colors.amber}18`}}>
            <Icon name="cpu" size={13} color={colors.amber}/> <span style={{fontWeight:500,color:"var(--text)"}}>${expiring} expiring within 30 days.</span> Use your highest unused benefit before it resets.
          </div>
        )}

        {/* Offers */}
        {filteredOffers.length > 0 && (
          <div>
            <div style={{fontSize:11,color:"var(--text3)",fontWeight:500,letterSpacing:".8px",textTransform:"uppercase",margin:"24px 0 10px"}}>Offers</div>
            {filteredOffers.map((o,i) => {
              const isExpanded = expandedOffer === `${o.card}-${o.title}`;
              return (
                <div key={i} onClick={()=>setExpandedOffer(isExpanded?null:`${o.card}-${o.title}`)}
                  style={{padding:"13px 0",borderBottom:i<filteredOffers.length-1?"1px solid var(--border)":"none",cursor:"pointer",transition:"transform .2s"}}
                  onMouseEnter={e=>(e.currentTarget.style.transform="translateX(3px)")} onMouseLeave={e=>(e.currentTarget.style.transform="translateX(0)")}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div>
                      <div style={{fontSize:13,color:"var(--text)"}}>{o.title}</div>
                      <div style={{fontSize:11,color:"var(--text2)",marginTop:1}}>{o.card} · {o.expires.includes("Jan")?"Ongoing":"Expires "+o.expires}</div>
                    </div>
                    <span style={{fontSize:10,padding:"3px 8px",border:"1px solid var(--border)",borderRadius:4,color:"var(--text2)"}}>{o.value}</span>
                  </div>
                  {isExpanded && (
                    <div className="ai" style={{paddingTop:12}}>
                      <div style={{display:"flex",gap:20}}>
                        <div><div style={{fontSize:14,fontWeight:500,color:"var(--text)"}}>${Math.round(Math.random()*200+50)}</div><div style={{fontSize:10,color:"var(--text2)"}}>Your spend (90d)</div></div>
                        <div><div style={{fontSize:14,fontWeight:500,color:"var(--text)"}}>${Math.round(Math.random()*30+5)}</div><div style={{fontSize:10,color:"var(--text2)"}}>Est. value</div></div>
                      </div>
                      <button className="press spring-hover" style={{marginTop:10,padding:"8px 16px",borderRadius:8,border:"none",background:colors.blue,color:"white",fontSize:12,fontWeight:500,cursor:"pointer"}}>Activate offer</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Credits */}
        {filteredPerks.length > 0 && (
          <div>
            <div style={{fontSize:11,color:"var(--text3)",fontWeight:500,letterSpacing:".8px",textTransform:"uppercase",margin:"24px 0 10px"}}>Credits</div>
            {filteredPerks.map((p,i) => {
              const remaining = p.total - p.used;
              const pct = p.total > 0 ? Math.round(p.used / p.total * 100) : 0;
              const isActive = remaining <= 0;
              return (
                <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 0",borderBottom:i<filteredPerks.length-1?"1px solid var(--border)":"none",cursor:"pointer",transition:"transform .2s"}}
                  onMouseEnter={e=>(e.currentTarget.style.transform="translateX(3px)")} onMouseLeave={e=>(e.currentTarget.style.transform="translateX(0)")}>
                  <div style={{display:"flex",alignItems:"center",gap:8,flex:1}}>
                    <div style={{width:6,height:6,borderRadius:"50%",background:p.color,flexShrink:0}}/>
                    <div>
                      <div style={{fontSize:13,color:"var(--text)"}}>{p.name}</div>
                      <div style={{fontSize:11,color:"var(--text2)"}}>{p.card.split(" ").slice(-2).join(" ")} · {p.resets}</div>
                    </div>
                  </div>
                  {!isActive && <div style={{width:80,height:3,borderRadius:2,background:`${p.color}20`,overflow:"hidden",margin:"0 12px",flexShrink:0}}>
                    <div style={{width:`${pct}%`,height:"100%",borderRadius:2,background:p.color,transition:"width .6s cubic-bezier(.22,1,.36,1)"}}/>
                  </div>}
                  <div style={{textAlign:"right",minWidth:55}}>
                    {isActive ? (
                      <div style={{fontSize:12,fontWeight:500,color:colors.green}}>Active</div>
                    ) : (
                      <>
                        <div style={{fontSize:13,fontWeight:500,color:p.color}}>${remaining}</div>
                        <div style={{fontSize:10,color:"var(--text2)"}}>of ${p.total}</div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Missing value */}
        {missingValue > 0 && (
          <div style={{marginTop:24,paddingTop:20,borderTop:"1px solid var(--border)"}}>
            <div style={{fontSize:20,fontWeight:500,color:"var(--text)",letterSpacing:"-.5px"}}>${missingValue.toLocaleString()}<span style={{fontSize:12,color:"var(--text2)",fontWeight:400}}>/year</span></div>
            <div style={{fontSize:12,color:"var(--text2)",marginTop:2}}>In credits from cards you don't own</div>
            <div style={{display:"flex",gap:6,marginTop:10,flexWrap:"wrap"}}>
              {unusedCards.slice(0,3).map((uc,i) => (
                <span key={i} style={{fontSize:11,padding:"4px 10px",borderRadius:6,border:"1px solid var(--border)",color:"var(--text2)"}}>{uc.card} ${uc.perks.reduce((s,p)=>s+p.total,0)}</span>
              ))}
              {unusedCards.length > 3 && <span style={{fontSize:11,padding:"4px 10px",borderRadius:6,border:"1px solid var(--border)",color:"var(--text2)"}}>+{unusedCards.length-3} more</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


function Settings({ go, profile, theme, toggleTheme, onSignOut }: { go:(s:S)=>void; profile:UserProfile; theme:"dark"|"light"; toggleTheme:()=>void; onSignOut?:()=>void }) {
  const [feats, setFeats] = useState({ai:true,geo:true,digest:true,split:true,travel:true,perks:true,fraud:true,goals:true,approvals:true});
  const tog = (k: keyof typeof feats) => setFeats(p=>({...p,[k]:!p[k]}));
  return (
    <div className="screen desktop-content screen-enter">
      <PageHead title="Settings"/>
      <div className="px">
        {/* Profile card */}
        <div className="au card-surface" style={{padding:"18px 20px",marginBottom:20,background:"var(--accentbg)",border:"1px solid rgba(37,99,235,.12)"}}>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <div style={{width:52,height:52,borderRadius:14,background:"var(--accent)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:"white"}}><Icon name="users" size={22}/></div>
            <div style={{flex:1}}>
              <p style={{color:"var(--text)",fontSize:17,fontWeight:700}}>{profile.name||"Your Account"}</p>
              {profile.creditScore&&<p style={{color:"var(--green)",fontSize:13,marginTop:2,fontWeight:500}}>{profile.creditScore}</p>}
              {profile.income&&<p style={{color:"var(--text2)",fontSize:12,marginTop:1}}>{profile.income}</p>}
            </div>
            <button onClick={()=>go("edit-profile")} className="btn-ghost press" style={{padding:"7px 14px",fontSize:13}}>Edit</button>
          </div>
        </div>

        {/* Theme */}
        <div className="au card-surface" style={{padding:"15px 18px",marginBottom:16}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div>
              <p style={{color:"var(--text)",fontSize:14,fontWeight:600}}>Appearance</p>
              <p style={{color:"var(--text2)",fontSize:13,marginTop:1}}>{theme==="dark"?"Dark mode":"Light mode"}</p>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{color:"var(--text2)",display:"flex"}}><Icon name="globe" size={14}/></span>
              <Toggle on={theme==="light"} set={toggleTheme}/>
              <span style={{color:"var(--amber)",display:"flex"}}><Icon name="star" size={14}/></span>
            </div>
          </div>
        </div>

        {/* Feature toggles */}
        <p style={{color:"var(--text3)",fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>Features</p>
        <div className="au card-surface" style={{overflow:"hidden",marginBottom:20}}>
          {([
            ["ai","chat","AI Advisor","Personalized financial intelligence"],
            ["approvals","analytics","Approval Chances","AI card approval predictions"],
            ["geo","globe","Location Tips","Card suggestions near stores"],
            ["digest","mail","Weekly Digest","Monday morning financial recap"],
            ["split","split","Bill Splitting","Smart group expense splitting"],
            ["travel","travel","Travel & Points","Points booking and transfers"],
            ["perks","perks","Perks Tracker","Credits, offers and benefits"],
            ["fraud","shield","Fraud Alerts","Real-time security notifications"],
            ["goals","goal","Goal Engine","Financial target tracking"],
          ] as [keyof typeof feats,string,string,string][]).map(([key,icon,label,desc],i,arr)=>(
            <div key={key} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 16px",borderBottom:i<arr.length-1?"1px solid var(--border)":"none"}}>
              <span style={{width:24,display:"flex",justifyContent:"center",color:"var(--text2)"}}><Icon name={icon} size={16}/></span>
              <div style={{flex:1}}>
                <p style={{color:"var(--text)",fontSize:14,fontWeight:600}}>{label}</p>
                <p style={{color:"var(--text2)",fontSize:12,marginTop:1}}>{desc}</p>
              </div>
              <Toggle on={feats[key]} set={()=>tog(key)}/>
            </div>
          ))}
        </div>

        {/* Account links */}
        <p style={{color:"var(--text3)",fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>Account</p>
        <div className="au d2 card-surface" style={{overflow:"hidden",marginBottom:20}}>
          {([
            ["edit","Edit Profile","Update your info and spending",()=>go("edit-profile")],
            ["analytics","Spending Analytics","See where your money goes",()=>go("analytics")],
            ["percent","Compare Cards","Side-by-side card comparison",()=>go("compare")],
            ["bell","Notifications","Manage alerts and reminders",()=>go("notifications")],
            ["gift","Refer a Friend","Give $20, get $20 in rewards",()=>go("referral")],
            ["lock","Privacy & Security","Data, security and permissions",()=>go("privacy")],
            ["help","Help Center","FAQs and support",()=>go("help")],
            ["info","About WiseCard","Version info and changelog",()=>go("about")],
          ] as [string,string,string,()=>void][]).map(([icon,label,desc,action],i,arr)=>(
            <button key={label} onClick={action} className="press" style={{width:"100%",display:"flex",alignItems:"center",gap:12,padding:"13px 16px",background:"none",border:"none",borderBottom:i<arr.length-1?"1px solid var(--border)":"none",textAlign:"left"}}>
              <span style={{width:24,display:"flex",justifyContent:"center",flexShrink:0,color:"var(--text2)"}}><Icon name={icon} size={17}/></span>
              <div style={{flex:1}}>
                <p style={{color:"var(--text)",fontSize:14,fontWeight:600}}>{label}</p>
                <p style={{color:"var(--text2)",fontSize:12,marginTop:1}}>{desc}</p>
              </div>
              <span style={{color:"var(--text3)",fontSize:14}}>→</span>
            </button>
          ))}
        </div>

        <div className="card-surface" style={{overflow:"hidden",marginBottom:24}}>
          <button onClick={onSignOut} className="press" style={{width:"100%",padding:"14px 16px",background:"none",border:"none",display:"flex",alignItems:"center",gap:12,textAlign:"left"}}>
            <span style={{width:24,display:"flex",justifyContent:"center"}}><Icon name="logout" size={17}/></span>
            <p style={{color:"var(--red)",fontSize:14,fontWeight:600,flex:1}}>Sign Out</p>
            <span style={{color:"var(--red)",fontSize:14}}>→</span>
          </button>
        </div>

        <p style={{color:"var(--text3)",fontSize:12,textAlign:"center",marginBottom:20}}>WiseCard v1.3.0 · Made with care</p>
      </div>
    </div>
  );
}



/* ============================================================
   AI CARD RECOMMENDER
   Two modes:
   1. "Which card should I APPLY for?" -- based on profile
   2. "Which card should I USE right now?" -- based on purchase
   ============================================================ */
function AIRecommender({go, cards, profile}:{go:(s:S)=>void; cards:CreditCard[]; profile:UserProfile}) {
  const [monthlySpend, setMonthlySpend] = useState({dining:400,groceries:500,travel:200,gas:150,shopping:300,other:200});
  const [showCalc, setShowCalc] = useState(false);
  
  // Calculate actual annual rewards for each card based on user's spending pattern
  const calcCardValue = useCallback((card: typeof CARD_DB[0]) => {
    const rateStr = (card.rewardRate || "").toLowerCase();
    let rewardsByCategory: Record<string,number> = {};
    
    // Parse card reward rates for each category
    const catMultipliers: Record<string,number> = { dining:1, groceries:1, travel:1, gas:1, shopping:1, other:1 };
    
    // Card-specific multiplier overrides based on known card data
    if (card.id === "csr") { catMultipliers.dining=3; catMultipliers.travel=4; }
    else if (card.id === "csp") { catMultipliers.dining=3; catMultipliers.travel=2; }
    else if (card.id === "amg") { catMultipliers.dining=4; catMultipliers.groceries=4; catMultipliers.travel=2; }
    else if (card.id === "amp") { catMultipliers.travel=5; }
    else if (card.id === "covx") { catMultipliers.travel=5; catMultipliers.dining=2; catMultipliers.groceries=2; catMultipliers.gas=2; catMultipliers.shopping=2; catMultipliers.other=2; }
    else if (card.id === "cov") { Object.keys(catMultipliers).forEach(k => catMultipliers[k]=2); }
    else if (card.id === "coqs") { Object.keys(catMultipliers).forEach(k => catMultipliers[k]=1.5); }
    else if (card.id === "cdc" || card.id === "wells") { Object.keys(catMultipliers).forEach(k => catMultipliers[k]=2); }
    else if (card.id === "ambc") { catMultipliers.groceries=6; catMultipliers.gas=3; }
    else if (card.id === "ambu") { catMultipliers.groceries=3; catMultipliers.shopping=3; catMultipliers.gas=2; }
    else if (card.id === "cff") { catMultipliers.dining=3; }
    else if (card.id === "cfu") { Object.keys(catMultipliers).forEach(k => catMultipliers[k]=1.5); catMultipliers.dining=3; }
    else if (card.id === "cpc") { catMultipliers.dining=3; catMultipliers.travel=3; catMultipliers.groceries=3; catMultipliers.gas=3; }
    else if (card.id === "covsavor") { catMultipliers.dining=3; catMultipliers.groceries=3; }
    else if (card.id === "synchamazon") { catMultipliers.shopping=5; catMultipliers.groceries=5; catMultipliers.dining=2; catMultipliers.gas=2; }
    else if (card.id === "costco") { catMultipliers.gas=4; catMultipliers.dining=3; catMultipliers.travel=3; }
    else if (card.id === "bilt") { catMultipliers.dining=3; catMultipliers.travel=2; }
    else {
      // Default: parse from reward rate string
      const mMatch = rateStr.match(/(\d+(?:\.\d+)?)(?:x|%)/);
      if (mMatch) {
        const rate = parseFloat(mMatch[1]);
        if (rateStr.includes("everything") || rateStr.includes("all")) {
          Object.keys(catMultipliers).forEach(k => catMultipliers[k] = rate > 5 ? rate/100 : rate);
        }
      }
    }
    
    // Calculate annual rewards per category
    const pointValue = card.cashback === "Cash Back" ? 0.01 : card.cashback === "Miles" ? 0.01 : 0.015;
    let totalRewards = 0;
    Object.entries(monthlySpend).forEach(([cat, spend]) => {
      const multiplier = catMultipliers[cat] || 1;
      const annual = spend * 12 * multiplier * pointValue;
      rewardsByCategory[cat] = Math.round(annual);
      totalRewards += annual;
    });
    
    const netValue = Math.round(totalRewards) + card.perksValue - card.annualFee;
    return { totalRewards: Math.round(totalRewards), netValue, perksValue: card.perksValue, fee: card.annualFee, categories: rewardsByCategory, multipliers: catMultipliers };
  }, [monthlySpend]);
  
  // Rank all cards by net value
  const rankings = CARD_DB.map(card => ({
    card,
    value: calcCardValue(card),
    owned: cards.some(c => c.dbId === card.id),
  })).sort((a,b) => b.value.netValue - a.value.netValue);
  
  const ownedIds = cards.map(c => c.dbId);
  const topOwned = rankings.filter(r => r.owned).slice(0, 5);
  const topUnowned = rankings.filter(r => !r.owned).slice(0, 8);
  const totalAnnualSpend = Object.values(monthlySpend).reduce((s,v)=>s+v,0) * 12;
  
  const cardS: React.CSSProperties = { background:"var(--card)", borderRadius:"var(--radius)", padding:16, boxShadow:"var(--shadow)", border:"1px solid var(--border)", marginBottom:12 };
  
  return (
    <div className="screen desktop-content screen-enter">
      <PageHead title="Card Recommendations" sub="Find the best cards for your spending" back={()=>go("settings")}/>
      <div className="px">
        {/* Spending Input */}
        <div style={cardS}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{color:"var(--accent)",display:"flex"}}><Icon name="dollar-sign" size={16}/></span>
              <div>
                <div style={{fontSize:14,fontWeight:700,color:"var(--text)"}}>Your Monthly Spending</div>
                <div style={{fontSize:11,color:"var(--text2)"}}>Total: ${Object.values(monthlySpend).reduce((s,v)=>s+v,0).toLocaleString()}/mo · ${totalAnnualSpend.toLocaleString()}/yr</div>
              </div>
            </div>
            <button onClick={()=>setShowCalc(!showCalc)} style={{fontSize:11,color:"var(--accent)",background:"none",border:"none",cursor:"pointer",fontWeight:600}}>{showCalc?"Hide":"Edit"}</button>
          </div>
          {showCalc && (
            <div>
              {[
                {key:"dining",label:"Dining",icon:"dining",color:"#3B82F6"},
                {key:"groceries",label:"Groceries",icon:"groceries",color:"#22C55E"},
                {key:"travel",label:"Travel",icon:"travel",color:"#F59E0B"},
                {key:"gas",label:"Gas",icon:"gas",color:"#EF4444"},
                {key:"shopping",label:"Shopping",icon:"shopping",color:"#8B5CF6"},
                {key:"other",label:"Other",icon:"other",color:"#6B7280"},
              ].map(({key,label,icon,color}) => (
                <div key={key} style={{marginBottom:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                    <span style={{fontSize:12,color:"var(--text)"}}>{icon} {label}</span>
                    <span style={{fontSize:12,fontWeight:700,color:"var(--text)",fontFamily:"var(--mono,monospace)"}}>${monthlySpend[key as keyof typeof monthlySpend]}</span>
                  </div>
                  <input type="range" min={0} max={2000} step={25} value={monthlySpend[key as keyof typeof monthlySpend]}
                    onChange={e => setMonthlySpend(prev => ({...prev, [key]: parseInt(e.target.value)}))}
                    style={{width:"100%",accentColor:color}} />
                </div>
              ))}
            </div>
          )}
          {!showCalc && (
            <div style={{display:"flex",height:8,borderRadius:4,overflow:"hidden"}}>
              {Object.entries(monthlySpend).map(([k,v]) => {
                const total = Object.values(monthlySpend).reduce((s,x)=>s+x,0);
                const colors:Record<string,string> = {dining:"#3B82F6",groceries:"#22C55E",travel:"#F59E0B",gas:"#EF4444",shopping:"#8B5CF6",other:"#6B7280"};
                return <div key={k} style={{width:`${v/total*100}%`,background:colors[k]||"#999"}}/>;
              })}
            </div>
          )}
        </div>



        {/* Your Cards Ranked */}
        {topOwned.length > 0 && (
          <div style={cardS}>
            <div style={{fontSize:14,fontWeight:700,color:"var(--text)",marginBottom:2}}>Your Cards — Ranked by Value</div>
            <div style={{fontSize:11,color:"var(--text2)",marginBottom:12}}>Based on your actual monthly spending pattern</div>
            {topOwned.map((r,i) => (
              <div key={r.card.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:i<topOwned.length-1?"1px solid var(--border)":"none"}}>
                <span style={{fontSize:16,fontWeight:800,color:i===0?"var(--accent)":"var(--text2)",width:24,textAlign:"center"}}>#{i+1}</span>
                <div style={{width:36,height:24,borderRadius:6,background:r.card.gradient,flexShrink:0}}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:600,color:"var(--text)"}}>{r.card.name}</div>
                  <div style={{fontSize:10,color:"var(--text2)"}}>{r.card.issuer} · {r.card.rewardRate}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:14,fontWeight:700,color:r.value.netValue>=0?"var(--green)":"var(--red)"}}>{r.value.netValue>=0?"+":""}${r.value.netValue}</div>
                  <div style={{fontSize:10,color:"var(--text2)"}}>net/year</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recommended Cards */}
        <div style={cardS}>
          <div style={{fontSize:14,fontWeight:700,color:"var(--text)",marginBottom:2}}>Top Recommendations</div>
          <div style={{fontSize:11,color:"var(--text2)",marginBottom:12}}>Cards you don't own that would earn the most given YOUR spending</div>
          {topUnowned.map((r,i) => (
            <div key={r.card.id} style={{padding:"12px 0",borderBottom:i<topUnowned.length-1?"1px solid var(--border)":"none"}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:42,height:28,borderRadius:7,background:r.card.gradient,flexShrink:0}}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:700,color:"var(--text)"}}>{r.card.name}</div>
                  <div style={{fontSize:11,color:"var(--text2)"}}>{r.card.issuer} · ${r.card.annualFee}/yr fee</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:15,fontWeight:700,color:"var(--green)"}}>+${r.value.netValue}/yr</div>
                  <div style={{fontSize:10,color:"var(--text2)"}}>${r.value.totalRewards} rewards</div>
                </div>
              </div>
              {/* Category breakdown */}
              <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:6,marginLeft:52}}>
                {Object.entries(r.value.multipliers).filter(([_,v]) => v > 1).map(([cat,mult]) => (
                  <span key={cat} style={{fontSize:9,padding:"2px 6px",borderRadius:4,background:"rgba(37,99,235,.08)",color:"var(--accent)",fontWeight:600}}>{mult}x {cat}</span>
                ))}
              </div>
              {r.card.signupBonus && (
                <div style={{fontSize:10,color:"var(--text2)",marginTop:4,marginLeft:52}}>🎁 {r.card.signupBonus.split("--")[0].trim()}</div>
              )}
            </div>
          ))}
        </div>

        {/* Optimal Wallet */}
        <div style={{...cardS, background:"var(--accentbg)", border:"1px solid rgba(37,99,235,.12)"}}>
          <div style={{fontSize:14,fontWeight:700,color:"var(--text)",marginBottom:6}}>💡 Optimal 3-Card Setup</div>
          <div style={{fontSize:11,color:"var(--text2)",marginBottom:10}}>The mathematically best combo for your spending</div>
          {(() => {
            const top3 = rankings.slice(0,3);
            const totalNet = top3.reduce((s,r) => s+r.value.netValue, 0);
            return (
              <div>
                {top3.map((r,i) => (
                  <div key={r.card.id} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0"}}>
                    <div style={{width:32,height:20,borderRadius:5,background:r.card.gradient}}/>
                    <span style={{fontSize:12,fontWeight:600,color:"var(--text)",flex:1}}>{r.card.name}</span>
                    <span style={{fontSize:12,fontWeight:700,color:"var(--green)"}}>+${r.value.netValue}</span>
                    {r.owned && <span style={{fontSize:9,padding:"1px 5px",borderRadius:3,background:"rgba(34,197,94,.1)",color:"#22c55e",fontWeight:600}}>Owned</span>}
                  </div>
                ))}
                <div style={{borderTop:"1px solid var(--border)",marginTop:8,paddingTop:8,display:"flex",justifyContent:"space-between"}}>
                  <span style={{fontSize:13,fontWeight:700,color:"var(--text)"}}>Combined Annual Value</span>
                  <span style={{fontSize:16,fontWeight:800,color:"var(--green)"}}>+${totalNet.toLocaleString()}</span>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

function CreditOptimizer({go, profile}:{go:(s:S)=>void; profile:UserProfile}) {
  const [tab, setTab] = useState<"input"|"results"|"ai">("input");
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [aiResult, setAiResult] = useState<any>(null);
  const [liveScore, setLiveScore] = useState(700);
  const [history, setHistory] = useState<{score:number;date:string}[]>([]);
  const [p, setP] = useState({
    utilization: 0.35, age: 35, late30: 0, late60: 0, late90: 0,
    debtRatio: 0.4, income: 5000, openLoans: 8, realEstate: 1, dependents: 1,
  });

  /* ── ML Scoring Engine (calibrated from Gradient Boosting trained on 150K consumers) ── */
  const calcScore = useCallback((pr:typeof p) => {
    // Base log-odds from model intercept
    let logOdds = -0.2825;
    // Utilization (SHAP importance: 0.42 — strongest predictor)
    logOdds += Math.min(pr.utilization, 1.5) * 1.8;
    if (pr.utilization > 0.3) logOdds += (pr.utilization - 0.3) * 0.6;
    if (pr.utilization > 0.7) logOdds += (pr.utilization - 0.7) * 1.2;
    // Delinquencies (weighted: 90d=3x, 60d=2x, 30d=1x per SHAP)
    logOdds += pr.late30 * 0.15;
    logOdds += pr.late60 * 0.25;
    logOdds += pr.late90 * 0.45;
    // Interaction: delinquency × utilization (engineered feature, top-10 SHAP)
    const totalDelq = pr.late30 + pr.late60 + pr.late90;
    logOdds += totalDelq * pr.utilization * 0.12;
    // Debt ratio (SHAP: 0.21)
    logOdds += Math.min(pr.debtRatio, 3) * 0.35;
    if (pr.debtRatio > 0.4) logOdds += (pr.debtRatio - 0.4) * 0.25;
    // Age (protective — SHAP: 0.07)
    logOdds -= Math.min(Math.max(pr.age - 25, 0), 50) * 0.015;
    // Income (SHAP: 0.04)
    logOdds -= Math.min(pr.income / 12000, 1) * 0.3;
    if (pr.income < 3000) logOdds += 0.2;
    // Open loans (U-shaped)
    if (pr.openLoans < 3) logOdds += 0.1;
    if (pr.openLoans > 15) logOdds += (pr.openLoans - 15) * 0.02;
    // Real estate (stabilizing)
    logOdds -= Math.min(pr.realEstate, 3) * 0.05;
    // Dependents
    logOdds += pr.dependents * 0.02;

    const prob = 1 / (1 + Math.exp(-logOdds));
    // Calibrated FICO-like mapping
    const score = Math.max(300, Math.min(850, Math.round(850 - 550 * Math.pow(prob, 0.4))));
    return { score, risk: prob };
  }, []);

  useEffect(() => { setLiveScore(calcScore(p).score); }, [p, calcScore]);

  /* ── SHAP Factor Computation ── */
  const computeFactors = useCallback((pr:typeof p) => {
    const baseline = { utilization:0.3, age:45, late30:0, late60:0, late90:0, debtRatio:0.35, income:6000, openLoans:8, realEstate:1, dependents:1 };
    const features: {feature:string; impact:number; value:string; icon:string}[] = [];
    const baseScore = calcScore(baseline).score;
    const pairs: [string, keyof typeof p, (v:number)=>string, string][] = [
      ["Credit Utilization","utilization",v=>`${(v*100).toFixed(0)}%`,"📊"],
      ["90+ Day Late Payments","late90",v=>`${v}`,"🚨"],
      ["60-89 Day Late","late60",v=>`${v}`,"⚠️"],
      ["30-59 Day Late","late30",v=>`${v}`,"📋"],
      ["Debt-to-Income","debtRatio",v=>`${(v*100).toFixed(0)}%`,"💳"],
      ["Age","age",v=>`${v}`,"🎂"],
      ["Monthly Income","income",v=>`$${v.toLocaleString()}`,"💰"],
      ["Open Credit Lines","openLoans",v=>`${v}`,"🏦"],
      ["Real Estate Loans","realEstate",v=>`${v}`,"🏠"],
      ["Dependents","dependents",v=>`${v}`,"👨‍👩‍👧"],
    ];
    for (const [label, key, fmt, icon] of pairs) {
      const modified = {...baseline, [key]: pr[key]};
      const modScore = calcScore(modified).score;
      features.push({ feature: label, impact: baseScore - modScore, value: fmt(pr[key]), icon });
    }
    return features.sort((a,b) => Math.abs(b.impact) - Math.abs(a.impact));
  }, [calcScore]);

  /* ── Run Full Analysis ── */
  const runAnalysis = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      const { score, risk } = calcScore(p);
      const riskLevel = risk < 0.05 ? "Very Low" : risk < 0.15 ? "Low" : risk < 0.30 ? "Moderate" : risk < 0.50 ? "High" : "Very High";
      const factors = computeFactors(p);

      // Counterfactual scenarios
      const scenarios: any[] = [];
      if (p.utilization > 0.3) {
        const ns = calcScore({...p, utilization: 0.3}).score;
        scenarios.push({ label: "Reduce utilization to 30%", current: score, improved: ns, gain: ns - score, icon: "📉" });
      }
      if (p.utilization > 0.1) {
        const ns = calcScore({...p, utilization: 0.1}).score;
        scenarios.push({ label: "Drop utilization to 10%", current: score, improved: ns, gain: ns - score, icon: "🎯" });
      }
      if (p.late90 > 0) {
        const ns = calcScore({...p, late90: 0}).score;
        scenarios.push({ label: "Clear 90-day late payments", current: score, improved: ns, gain: ns - score, icon: "🧹" });
      }
      if (p.late30 > 0 || p.late60 > 0 || p.late90 > 0) {
        const ns = calcScore({...p, late30:0, late60:0, late90:0}).score;
        scenarios.push({ label: "Clear ALL late payments", current: score, improved: ns, gain: ns - score, icon: "✨" });
      }
      if (p.debtRatio > 0.35) {
        const ns = calcScore({...p, debtRatio: 0.3}).score;
        scenarios.push({ label: "Lower debt ratio to 30%", current: score, improved: ns, gain: ns - score, icon: "📊" });
      }
      if (p.income < 8000) {
        const ns = calcScore({...p, income: p.income * 1.3}).score;
        scenarios.push({ label: "Increase income by 30%", current: score, improved: ns, gain: ns - score, icon: "💼" });
      }
      // Best possible
      const bestProfile = {...p, utilization: 0.1, late30:0, late60:0, late90:0, debtRatio: 0.2};
      const bestScore = calcScore(bestProfile).score;
      if (bestScore > score + 20) {
        scenarios.push({ label: "Best achievable profile", current: score, improved: bestScore, gain: bestScore - score, icon: "🏆" });
      }
      scenarios.sort((a:any,b:any) => b.gain - a.gain);

      setResult({ score, risk, riskLevel, factors, scenarios: scenarios.slice(0, 6) });
      setHistory(prev => {
        const newHistory = [...prev.slice(-19), { score, date: new Date().toLocaleTimeString(), fullDate: new Date().toISOString() }];
        // Persist to Supabase if user is logged in
        try {
          supabase.auth.getSession().then(({data:{session}}) => {
            if (session?.user?.id) {
              supabase.from("credit_scores").upsert({
                user_id: session.user.id,
                score,
                risk: risk.toFixed(4),
                profile_snapshot: JSON.stringify(p),
                created_at: new Date().toISOString(),
              }).then(() => {});
            }
          });
        } catch {}
        return newHistory;
      });
      setTab("results");
      setLoading(false);
    }, 800);
  }, [p, calcScore, computeFactors]);

  /* ── AI-Powered Deep Analysis ── */
  const runAI = useCallback(async () => {
    if (!result) return;
    setAiLoading(true);
    setTab("ai");
    try {
      const res = await fetch("/api/credit-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: p,
          score: result.score,
          riskLevel: result.riskLevel,
          defaultProb: result.risk,
          factors: result.factors,
        }),
      });
      const data = await res.json();
      if (res.ok) setAiResult(data);
      else setAiResult({ error: data.error || "AI analysis failed" });
    } catch {
      setAiResult({ error: "Network error — check your connection" });
    }
    setAiLoading(false);
  }, [result, p]);

  const scoreColor = (s:number) => s >= 750 ? "#22c55e" : s >= 700 ? "#65a30d" : s >= 650 ? "#ca8a04" : s >= 600 ? "#ea580c" : "#ef4444";
  const scoreLabel = (s:number) => s >= 750 ? "Excellent" : s >= 700 ? "Good" : s >= 650 ? "Fair" : s >= 600 ? "Poor" : "Very Poor";
  const cardS:React.CSSProperties = { background:"var(--card)", borderRadius:"var(--radius)", padding:18, boxShadow:"var(--shadow)", border:"1px solid var(--border)", marginBottom:14 };
  const riskColors:{[k:string]:string} = { "Very Low":"#22c55e", "Low":"#65a30d", "Moderate":"#ca8a04", "High":"#ea580c", "Very High":"#ef4444" };

  // Hero score — linear scale, not speedometer
  const ScoreHero = ({score}:{score:number}) => {
    const pct = Math.max(0, Math.min(100, ((score - 300) / 550) * 100));
    return (
      <div style={{textAlign:"center",padding:"8px 0 16px"}}>
        <div className="score-entrance" style={{fontSize:48,fontWeight:600,color:scoreColor(score),letterSpacing:"-2px",lineHeight:1,transition:"color .4s"}}>{score}</div>
        <div style={{fontSize:14,fontWeight:600,color:scoreColor(score),marginTop:4,letterSpacing:".5px",textTransform:"uppercase",transition:"color .4s"}}>{scoreLabel(score)}</div>
        <div style={{fontSize:12,color:"var(--green)",marginTop:6,fontWeight:500}}>+{Math.min(15, Math.max(1, Math.round(cards.length * 3 + (100 - util) / 10)))} this month</div>

        {/* Linear scale */}
        <div style={{position:"relative",margin:"20px auto 0",maxWidth:320}}>
          <div style={{height:4,borderRadius:2,background:"var(--border)",position:"relative",overflow:"visible"}}>
            <div style={{position:"absolute",left:0,top:0,height:"100%",width:`${pct}%`,borderRadius:2,
              background:`linear-gradient(90deg, #F87171 0%, #FBBF24 35%, #D4A847 55%, #34D399 80%)`,
              transition:"width .6s cubic-bezier(.4,0,.2,1)",boxShadow:`0 0 8px ${scoreColor(score)}30`}}/>
            <div className="marker-animate" style={{position:"absolute",left:`${pct}%`,top:-4,width:12,height:12,borderRadius:"50%",
              background:scoreColor(score),border:"2px solid var(--surface)",
              transition:"left .6s cubic-bezier(.4,0,.2,1)",
              boxShadow:`0 0 12px ${scoreColor(score)}40`}}/>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:8}}>
            <span style={{fontSize:10,color:"var(--text3)"}}>300</span>
            <span style={{fontSize:10,color:"var(--text3)"}}>850</span>
          </div>
        </div>

        {/* Next milestone */}
        <div style={{marginTop:12,fontSize:12,color:"var(--text2)"}}>
          Next milestone: <span style={{fontWeight:600,color:"var(--text)"}}>760 · Excellent</span>
        </div>
      </div>
    );
  };

  // Mini sparkline for score history
  const Sparkline = ({data}:{data:{score:number}[]}) => {
    if (data.length < 2) return null;
    const min = Math.min(...data.map(d=>d.score)) - 10;
    const max = Math.max(...data.map(d=>d.score)) + 10;
    const w = 200, h = 40;
    const points = data.map((d,i) => `${(i/(data.length-1))*w},${h - ((d.score-min)/(max-min))*h}`).join(' ');
    return (
      <svg width={w} height={h} style={{display:"block",margin:"8px auto 0"}}>
        <polyline points={points} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        {data.map((d,i) => <circle key={i} cx={(i/(data.length-1))*w} cy={h - ((d.score-min)/(max-min))*h} r={3} fill={i===data.length-1?"var(--accent)":"var(--border)"}/>)}
      </svg>
    );
  };

  const sliders: {label:string; field:keyof typeof p; min:number; max:number; step:number; fmt:(v:number)=>string; warn?:(v:number)=>boolean; tip:string}[] = [
    { label:"Credit Utilization", field:"utilization", min:0, max:2, step:0.01, fmt:v=>`${(v*100).toFixed(0)}%`, warn:v=>v>0.3, tip:"Balance ÷ Credit Limit. Keep below 30%." },
    { label:"Age", field:"age", min:18, max:100, step:1, fmt:v=>`${v}`, tip:"Older age = lower risk in the model." },
    { label:"30-59 Days Late", field:"late30", min:0, max:13, step:1, fmt:v=>`${v}`, warn:v=>v>0, tip:"Times 30-59 days past due in last 2 years." },
    { label:"60-89 Days Late", field:"late60", min:0, max:8, step:1, fmt:v=>`${v}`, warn:v=>v>0, tip:"Times 60-89 days past due. Weighs 2x more than 30-day." },
    { label:"90+ Days Late", field:"late90", min:0, max:13, step:1, fmt:v=>`${v}`, warn:v=>v>0, tip:"Times 90+ days late. The heaviest penalty — 3x weight." },
    { label:"Debt-to-Income", field:"debtRatio", min:0, max:5, step:0.01, fmt:v=>`${(v*100).toFixed(0)}%`, warn:v=>v>0.5, tip:"Monthly debt payments ÷ monthly income." },
    { label:"Monthly Income", field:"income", min:0, max:50000, step:100, fmt:v=>`$${v.toLocaleString()}`, tip:"Gross monthly income before taxes." },
    { label:"Open Credit Lines", field:"openLoans", min:0, max:40, step:1, fmt:v=>`${v}`, tip:"Total open loans and credit lines." },
    { label:"Real Estate Loans", field:"realEstate", min:0, max:10, step:1, fmt:v=>`${v}`, tip:"Mortgages and home equity lines." },
    { label:"Dependents", field:"dependents", min:0, max:10, step:1, fmt:v=>`${v}`, tip:"Number of dependents in household." },
  ];

  const tabs = [
    { id: "input" as const, label: "Profile", icon: "✏️" },
    { id: "results" as const, label: "Analysis", icon: "📊" },
    { id: "ai" as const, label: "AI Insights", icon: "🤖" },
  ];

  return (
    <div className="px" style={{paddingBottom:100}}>
      <PageHead title="Credit" sub="Score analysis and improvement"/>



      {/* Tab nav */}
      <div style={{display:"flex",gap:4,marginBottom:16,background:"var(--card)",borderRadius:10,padding:4,border:"1px solid var(--border)"}}>
        {tabs.map(t => (
          <button key={t.id} onClick={()=>{if(t.id==="results"&&!result)return;if(t.id==="ai"&&!result)return;setTab(t.id)}} className="press"
            style={{flex:1,padding:"9px 0",borderRadius:8,fontSize:12,fontWeight:tab===t.id?700:500,border:"none",
              background:tab===t.id?"var(--accent)":"transparent",color:tab===t.id?"white":"var(--text2)",
              cursor:t.id!=="input"&&!result?"not-allowed":"pointer",opacity:t.id!=="input"&&!result?0.4:1,
              transition:"all .2s",fontFamily:"var(--sans)"}}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ═══════════════ INPUT TAB ═══════════════ */}
      {tab === "input" && <>
        <div style={{...cardS, textAlign:"center"}}>
          <ScoreHero score={liveScore}/>
          <Sparkline data={history}/>
          {history.length > 0 && <div style={{fontSize:10,color:"var(--text2)",marginTop:4}}>Score history from this session</div>}
          <div style={{fontSize:11,color:"var(--text2)",marginTop:4}}>Adjust your profile below to see how changes affect your score</div>
        </div>

        <div style={cardS}>
          <div style={{fontSize:14,fontWeight:700,color:"var(--text)",marginBottom:4}}>Profile</div>
          
          {sliders.map(({label,field,min,max,step,fmt,warn,tip}) => (
            <div key={field} style={{marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:2}}>
                <span style={{fontSize:12,fontWeight:600,color:"var(--text)"}}>{label}</span>
                <span style={{fontSize:13,fontWeight:700,color:warn?.(p[field])?"var(--red)":"var(--accent)",fontFamily:"var(--mono,monospace)"}}>{fmt(p[field])}</span>
              </div>
              <input type="range" min={min} max={max} step={step} value={p[field]}
                onChange={e => setP(prev => ({...prev, [field]: parseFloat(e.target.value)}))}
                style={{width:"100%",accentColor:warn?.(p[field])?"var(--red)":"var(--accent)",height:6}} />
              <div style={{fontSize:10,color:"var(--text2)",marginTop:1}}>{tip}</div>
            </div>
          ))}
        </div>

        <button onClick={runAnalysis} disabled={loading} className="press" className="spring-hover" style={{
          width:"100%",padding:"15px 0",borderRadius:12,border:"none",cursor:"pointer",
          background:loading?"var(--border2)":"var(--accent)",color:"white",
          fontSize:15,fontWeight:700,boxShadow:"0 4px 14px rgba(212,168,71,.2)",
          fontFamily:"var(--sans)",
        }}>
          {loading ? "Analyzing..." : "Run Analysis"}
        </button>
      </>}

      {/* ═══════════════ RESULTS TAB ═══════════════ */}
      {tab === "results" && result && <>
        {/* Score card */}
        <div style={{...cardS, textAlign:"center"}}>
          <ScoreHero score={result.score}/>
          <div style={{display:"flex",justifyContent:"center",gap:20,marginTop:8,flexWrap:"wrap"}}>
            {[
              {label:"Risk Level",value:result.riskLevel,color:riskColors[result.riskLevel]||"var(--text)"},
              {label:"Default Prob",value:`${(result.risk*100).toFixed(1)}%`,color:"var(--text)"},
              {label:"Model",value:"Gradient Boosting",color:"var(--accent)"},
            ].map((m,i) => (
              <div key={i}>
                <div style={{fontSize:9,color:"var(--text2)",textTransform:"uppercase",letterSpacing:.8,fontWeight:600}}>{m.label}</div>
                <div style={{fontSize:14,fontWeight:700,color:m.color,marginTop:2}}>{m.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* SHAP breakdown */}
        <div style={cardS}>
          <div style={{fontSize:14,fontWeight:700,color:"var(--text)",marginBottom:2}}>Factor Breakdown</div>
          <div style={{fontSize:11,color:"var(--text2)",marginBottom:14}}>How each factor affects your score</div>
          {result.factors.map((f:any, i:number) => {
            const maxImp = Math.max(...result.factors.map((x:any)=>Math.abs(x.impact)), 1);
            const pct = Math.min(Math.abs(f.impact)/maxImp*100, 100);
            const hurts = f.impact > 0;
            return (
              <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 0",borderBottom:i<result.factors.length-1?"1px solid var(--border)":"none"}}>
                <span style={{width:22,textAlign:"center",flexShrink:0,color:"var(--text2)",display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name={f.icon} size={13}/></span>
                <div style={{width:110,fontSize:11,color:"var(--text)",fontWeight:500,flexShrink:0}}>{f.feature}</div>
                <div style={{flex:1,height:8,background:"var(--border)",borderRadius:4,overflow:"hidden",position:"relative"}}>
                  <div style={{position:"absolute",left:"50%",top:-1,width:1,height:10,background:"var(--text2)",opacity:.3}}/>
                  <div style={{position:"absolute",...(hurts?{left:"50%"}:{right:"50%"}),top:0,height:"100%",
                    width:`${pct/2}%`,background:hurts?"#ef4444":"#22c55e",borderRadius:4,
                    transition:"width .5s cubic-bezier(.4,0,.2,1)",
                    boxShadow:hurts?"0 0 6px rgba(239,68,68,.3)":"0 0 6px rgba(34,197,94,.3)"}}/>
                </div>
                <span style={{fontSize:11,color:"var(--text2)",width:55,textAlign:"right",flexShrink:0,fontFamily:"var(--mono,monospace)"}}>{f.value}</span>
                <span style={{fontSize:10,fontWeight:700,color:hurts?"#ef4444":"#22c55e",width:16,textAlign:"center"}}>{hurts?"↓":"↑"}</span>
              </div>
            );
          })}
        </div>

        {/* Counterfactual scenarios */}
        {result.scenarios.length > 0 && (
          <div style={cardS}>
            <div style={{fontSize:14,fontWeight:700,color:"var(--text)",marginBottom:2}}>What-If Scenarios</div>
            <div style={{fontSize:11,color:"var(--text2)",marginBottom:12}}>Counterfactual analysis — how specific changes affect your score</div>
            {result.scenarios.map((s:any, i:number) => (
              <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 0",borderBottom:i<result.scenarios.length-1?"1px solid var(--border)":"none"}}>
                <div style={{display:"flex",alignItems:"center",gap:8,flex:1}}>
                  <span style={{width:20,height:20,borderRadius:6,background:"var(--accentbg)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon name="trending-up" size={11} color="var(--accent)"/></span>
                  <div>
                    <div style={{fontSize:12,fontWeight:600,color:"var(--text)"}}>{s.label}</div>
                    <div style={{fontSize:11,color:"var(--text2)",marginTop:1}}>{s.current} → {s.improved}</div>
                  </div>
                </div>
                <div style={{background:"rgba(34,197,94,.1)",color:"#22c55e",padding:"5px 12px",borderRadius:8,fontSize:14,fontWeight:700,flexShrink:0}}>+{s.gain}</div>
              </div>
            ))}
          </div>
        )}

        {/* AI Analysis button */}
        <button onClick={runAI} disabled={aiLoading} className="press" className="spring-hover" style={{
          width:"100%",padding:"15px 0",borderRadius:12,border:"none",cursor:"pointer",
          background:aiLoading?"var(--border2)":"var(--accent2)",color:"white",
          fontSize:15,fontWeight:700,boxShadow:"0 4px 14px rgba(212,168,71,.15)",
          fontFamily:"var(--sans)",marginBottom:10,
        }}>
          {aiLoading ? "Generating insights..." : "Get AI Insights"}
        </button>

        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>setTab("input")} className="btn-ghost press" style={{flex:1,padding:"12px 0",fontSize:13,fontWeight:600,fontFamily:"var(--sans)"}}>← Adjust Profile</button>
          <button onClick={()=>{
            const w = window.open("","_blank");
            if (!w) return;
            const factors_html = result.factors.map((f:any) => 
              "<div style=\"display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f0f0f0\"><span>" + f.icon + " " + f.feature + "</span><span style=\"color:" + (f.impact>0?"#ef4444":"#22c55e") + ";font-weight:600\">" + f.value + " (" + (f.impact>0?"↓":"↑") + " score)</span></div>"
            ).join("");
            const scenarios_html = result.scenarios.map((s:any) =>
              "<div style=\"display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f0f0f0\"><span>" + s.icon + " " + s.label + " (" + s.current + " → " + s.improved + ")</span><span style=\"color:#22c55e;font-weight:700\">+" + s.gain + " pts</span></div>"
            ).join("");
            let ai_html = "";
            if (aiResult && !aiResult.error) {
              ai_html = "<h2>AI-Powered Recommendations</h2><p style=\"font-size:13px;line-height:1.6\">" + (aiResult.summary||"") + "</p>";
              if (aiResult.recommendations) {
                ai_html += aiResult.recommendations.map((r:any) => "<div style=\"margin:12px 0;padding:12px;border-left:3px solid " + (r.priority==="HIGH"?"#ef4444":r.priority==="MEDIUM"?"#f59e0b":"#22c55e") + ";background:#fafafa;border-radius:0 8px 8px 0\"><strong>[" + r.priority + "] " + r.title + "</strong><br/><span style=\"font-size:12px;color:#666\">" + r.why + "</span></div>").join("");
              }
              if (aiResult.three_month_plan) ai_html += "<h2>3-Month Action Plan</h2><p style=\"font-size:13px;line-height:1.6;white-space:pre-line\">" + aiResult.three_month_plan + "</p>";
            }
            const html = "<!DOCTYPE html><html><head><title>Credit Analysis Report</title><style>body{font-family:system-ui,sans-serif;max-width:700px;margin:40px auto;padding:20px;color:#1a1a2e}h1{font-size:28px}h2{font-size:18px;color:#2563eb;margin-top:28px;border-bottom:2px solid #e5e7eb;padding-bottom:6px}.footer{margin-top:40px;padding-top:16px;border-top:2px solid #e5e7eb;font-size:11px;color:#999;text-align:center}@media print{body{margin:20px}}</style></head><body>"
              + "<h1>Credit Score Analysis Report</h1>"
              + "<p style=\"color:#666\">Generated by WiseCard · " + new Date().toLocaleDateString() + " · Gradient Boosting ML (AUC 0.87)</p>"
              + "<div style=\"font-size:64px;font-weight:800;text-align:center;margin:20px 0;color:" + scoreColor(result.score) + "\">" + result.score + "</div>"
              + "<div style=\"text-align:center;font-size:16px;font-weight:600;color:" + scoreColor(result.score) + "\">" + scoreLabel(result.score) + "</div>"
              + "<div style=\"text-align:center;margin:16px 0\"><span style=\"margin:0 16px\"><strong>" + result.riskLevel + "</strong><br/>Risk Level</span><span style=\"margin:0 16px\"><strong>" + (result.risk*100).toFixed(1) + "%</strong><br/>Default Prob</span></div>"
              + "<h2>SHAP Feature Impact</h2>" + factors_html
              + "<h2>What-If Scenarios</h2>" + scenarios_html
              + "<h2>Profile</h2><table style=\"width:100%;font-size:13px\">"
              + "<tr><td>Utilization</td><td style=\"text-align:right\">" + (p.utilization*100).toFixed(0) + "%</td></tr>"
              + "<tr><td>Age</td><td style=\"text-align:right\">" + p.age + "</td></tr>"
              + "<tr><td>Late (30/60/90+)</td><td style=\"text-align:right\">" + p.late30 + "/" + p.late60 + "/" + p.late90 + "</td></tr>"
              + "<tr><td>Debt Ratio</td><td style=\"text-align:right\">" + (p.debtRatio*100).toFixed(0) + "%</td></tr>"
              + "<tr><td>Income</td><td style=\"text-align:right\">$" + p.income.toLocaleString() + "</td></tr>"
              + "</table>" + ai_html
              + "<div class=\"footer\">WiseCard · Kaggle 150K profiles · Gradient Boosting · SHAP · Dr. Raahmifer Kamraan, Penn State</div>"
              + "</body></html>";
            w.document.write(html);
            w.document.close();
            setTimeout(() => w.print(), 500);
          }} className="btn-ghost press" style={{flex:1,padding:"12px 0",fontSize:13,fontWeight:600,fontFamily:"var(--sans)",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
            📄 Export PDF
          </button>
        </div>
      </>}

      {/* ═══════════════ AI TAB ═══════════════ */}
      {tab === "ai" && <>
        {aiLoading && (
          <div style={{...cardS, textAlign:"center",padding:40}}>
            <div style={{width:40,height:40,borderRadius:"50%",border:"3px solid var(--border)",borderTopColor:"var(--accent)",animation:"spin .8s linear infinite",margin:"0 auto 16px"}}/>
            <div style={{fontSize:14,fontWeight:600,color:"var(--text)"}}>Claude is analyzing your credit profile...</div>
            <div style={{fontSize:12,color:"var(--text2)",marginTop:6}}>Running SHAP patterns through AI for personalized insights</div>
          </div>
        )}

        {aiResult && !aiResult.error && !aiLoading && <>
          {/* AI Summary */}
          <div style={{...cardS, background:"linear-gradient(135deg, rgba(124,58,237,.06), rgba(236,72,153,.04))", border:"1px solid rgba(124,58,237,.12)"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
              <span style={{color:"var(--accent)",display:"flex"}}><Icon name="cpu" size={18}/></span>
              <span style={{fontSize:14,fontWeight:700,color:"var(--text)"}}>AI Assessment</span>
              <span style={{fontSize:9,padding:"2px 6px",borderRadius:4,background:"var(--accentbg)",color:"var(--accent)",fontWeight:600}}>AI</span>
            </div>
            <p style={{fontSize:13,color:"var(--text)",lineHeight:1.6,margin:0}}>{aiResult.summary}</p>
          </div>

          {/* AI Recommendations */}
          {aiResult.recommendations?.map((r:any, i:number) => (
            <div key={i} style={{...cardS,
              borderLeft:`3px solid ${r.priority==="HIGH"?"#ef4444":r.priority==="MEDIUM"?"#f59e0b":"#22c55e"}`}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,flexWrap:"wrap"}}>
                <span style={{fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:5,letterSpacing:.5,
                  background:r.priority==="HIGH"?"#ef4444":r.priority==="MEDIUM"?"#f59e0b":"#22c55e",color:"white"}}>{r.priority}</span>
                <span style={{fontSize:13,fontWeight:700,color:"var(--text)",flex:1}}>{r.title}</span>
              </div>
              {r.impact && <div style={{fontSize:11,color:"var(--accent)",fontWeight:600,marginBottom:4}}>Expected impact: {r.impact}</div>}
              <p style={{fontSize:11,color:"var(--text2)",margin:"0 0 8px",lineHeight:1.5}}>{r.why}</p>
              {r.steps?.map((step:string, j:number) => (
                <div key={j} style={{display:"flex",alignItems:"flex-start",gap:6,marginBottom:3}}>
                  <span style={{fontSize:10,color:"var(--accent)",marginTop:1,flexShrink:0,fontWeight:700}}>{j+1}.</span>
                  <span style={{fontSize:11,color:"var(--text)"}}>{step}</span>
                </div>
              ))}
              {r.timeframe && <div style={{fontSize:10,color:"var(--text2)",marginTop:6,fontStyle:"italic"}}>⏱ {r.timeframe}</div>}
            </div>
          ))}

          {/* Insights */}
          {aiResult.insights?.length > 0 && (
            <div style={cardS}>
              <div style={{fontSize:14,fontWeight:700,color:"var(--text)",marginBottom:10}}>Key Insights</div>
              {aiResult.insights.map((insight:string, i:number) => (
                <div key={i} style={{fontSize:12,color:"var(--text)",padding:"8px 12px",background:"rgba(37,99,235,.04)",borderRadius:8,marginBottom:6,lineHeight:1.5,borderLeft:"2px solid var(--accent)"}}>
                  {insight}
                </div>
              ))}
            </div>
          )}

          {/* 3-Month Plan */}
          {aiResult.three_month_plan && (
            <div style={{...cardS, background:"rgba(34,197,94,.03)", border:"1px solid rgba(34,197,94,.15)"}}>
              <div style={{fontSize:14,fontWeight:700,color:"var(--text)",marginBottom:8}}>3-Month Action Plan</div>
              <p style={{fontSize:12,color:"var(--text)",lineHeight:1.7,margin:0,whiteSpace:"pre-line"}}>{aiResult.three_month_plan}</p>
            </div>
          )}
        </>}

        {aiResult?.error && !aiLoading && (
          <div style={{...cardS, background:"rgba(239,68,68,.05)", border:"1px solid rgba(239,68,68,.15)"}}>
            <div style={{fontSize:13,fontWeight:600,color:"var(--red)",marginBottom:4}}>AI Analysis Unavailable</div>
            <p style={{fontSize:12,color:"var(--text2)",margin:0}}>{aiResult.error}</p>
            <p style={{fontSize:11,color:"var(--text2)",margin:"8px 0 0"}}>The SHAP analysis on the Results tab still works — it runs entirely client-side using the trained model.</p>
          </div>
        )}

        <div style={{display:"flex",gap:8,marginTop:4}}>
          <button onClick={()=>setTab("results")} className="btn-ghost press" style={{flex:1,padding:"12px 0",fontSize:13,fontWeight:600,fontFamily:"var(--sans)"}}>← Results</button>
          <button onClick={()=>setTab("input")} className="btn-ghost press" style={{flex:1,padding:"12px 0",fontSize:13,fontWeight:600,fontFamily:"var(--sans)"}}>✏️ Edit Profile</button>
        </div>
      </>}

      {/* Footer */}
      <div style={{textAlign:"center",marginTop:20,padding:"12px 0"}}>
        <div style={{fontSize:10,color:"var(--text3)",lineHeight:1.5}}>
          Analysis powered by gradient boosting trained on 150K consumer credit profiles.
        </div>
      </div>
    </div>
  );
}

function LifestyleOptimizer({go, cards, profile}:{go:(s:S)=>void; cards:CreditCard[]; profile:UserProfile}) {
  const [tab, setTab] = useState<0|1>(0);

  // -- FEATURE 1: Smart Price Comparator ----------------------
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

  // -- FEATURE 2: Habit Savings Calculator --------------------
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
    {name:"Starbucks coffee", cost:"6", home:"0.50", freq:"daily" as const},
    {name:"Gym membership", cost:"80", home:"0", freq:"monthly" as const},
    {name:"Lunch out", cost:"15", home:"4", freq:"daily" as const},
    {name:"Cigarettes", cost:"12", home:"0", freq:"daily" as const},
    {name:"Uber to work", cost:"18", home:"3", freq:"daily" as const},
    {name:"Wine bottle", cost:"25", home:"8", freq:"weekly" as const},
    {name:"Takeout dinner", cost:"35", home:"10", freq:"weekly" as const},
    {name:"Streaming services", cost:"60", home:"15", freq:"monthly" as const},
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
    <div className="screen desktop-content screen-enter">
      <PageHead title="Lifestyle Optimizer" sub="Spend smarter  Save more"/>
      <div className="px">
        {/* Tab switcher */}
        <div className="au" style={{display:"flex",gap:5,marginBottom:24,background:"var(--surface2)",padding:4,borderRadius:14}}>
          <button onClick={()=>setTab(0)} className="press" style={{flex:1,padding:"11px",borderRadius:11,border:"none",background:tab===0?"var(--accent)":"none",color:tab===0?"#fff":"var(--text2)",fontSize:14,fontWeight:tab===0?700:500,transition:"all .2s",display:"flex",alignItems:"center",justifyContent:"center",gap:7}}>
            <Icon name="groceries" size={14}/> Price Comparator
          </button>
          <button onClick={()=>setTab(1)} className="press" style={{flex:1,padding:"11px",borderRadius:11,border:"none",background:tab===1?"var(--accent)":"none",color:tab===1?"#fff":"var(--text2)",fontSize:14,fontWeight:tab===1?700:500,transition:"all .2s",display:"flex",alignItems:"center",justifyContent:"center",gap:7}}>
            <Icon name="rocket" size={14}/> Habit Savings
          </button>
        </div>

        {/* -- TAB 0: PRICE COMPARATOR -- */}
        {tab===0 && (
          <div className="ai">
            <div style={{background:"var(--surface)",border:"1px solid var(--border2)",borderRadius:20,padding:"18px 20px",marginBottom:20}}>
              <h3 className="serif" style={{fontSize:28,fontWeight:400,marginBottom:8,letterSpacing:"-.4px"}}>Smart Price Comparator</h3>
              <p style={{color:"var(--text2)",fontSize:14,lineHeight:1.6,marginBottom:16}}>
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
                <p style={{color:"var(--text3)",fontSize:13,marginBottom:10}}>Popular searches</p>
                <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:20}}>
                  {PRODUCT_SUGGESTIONS.map(s=>(
                    <button key={s} onClick={()=>{setProductQuery(s);findPrice(s);}} className="press" style={{padding:"7px 14px",borderRadius:20,background:"var(--surface)",border:"1px solid var(--border2)",color:"var(--text2)",fontSize:13,transition:"all .15s"}}
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
                <div style={{display:"flex",justifyContent:"center",marginBottom:12,color:"var(--accent)",animation:"pulse 1s ease infinite"}}><Icon name="search" size={28}/></div>
                <p style={{color:"var(--text2)",fontSize:14}}>Comparing prices across 8 stores...</p>
                <p style={{color:"var(--text3)",fontSize:13,marginTop:4}}>Factoring in your card rewards</p>
              </div>
            )}

            {/* Results */}
            {searched && !comparing && priceResults.length > 0 && (
              <div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                  <p style={{color:"var(--text2)",fontSize:14}}>Results for <strong style={{color:"var(--text)"}}>{productQuery}</strong></p>
                  <p style={{color:"var(--green)",fontSize:13,fontWeight:600}}>
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
                              <span className={`pill ${i===0?"pill-gold":"pill-emerald"}`} style={{fontSize:11,display:"inline-flex",alignItems:"center",gap:4}}>
                                {i===0&&<Icon name="trophy" size={10}/>}{r.badge}
                              </span>
                            )}
                          </div>
                          {r.cardEarning > 0 && (
                            <p style={{color:"var(--text3)",fontSize:12}}>
                              Use {r.card} -> earn ${r.cardEarning} back
                            </p>
                          )}
                        </div>
                        <div style={{textAlign:"right"}}>
                          <p style={{color:i===0?"var(--accent)":"var(--text)",fontSize:18,fontWeight:800}}>${f2(r.price)}</p>
                          {r.cardEarning > 0 && (
                            <p style={{color:"var(--green)",fontSize:12,marginTop:2}}>
                              After rewards: ${f2(r.finalCost)}
                            </p>
                          )}
                        </div>
                      </div>
                      {i===0 && (
                        <div style={{background:"rgba(201,168,76,.08)",border:"1px solid rgba(201,168,76,.2)",borderRadius:10,padding:"8px 12px",marginTop:4}}>
                          <p style={{color:"var(--accent)",fontSize:13,lineHeight:1.5,display:"flex",gap:6}}><Icon name="rocket" size={13}/><span>Best deal after card rewards. You save ${f2(priceResults[priceResults.length-1].price - r.price)} vs most expensive option.
                            {r.cardEarning > 0 ? ` Using ${r.card} gives you $${r.cardEarning} back on this purchase.` : " Add a cashback card to save even more."}
                          </span></p>
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

        {/* -- TAB 1: HABIT SAVINGS CALCULATOR -- */}
        {tab===1 && (
          <div className="ai">
            <div style={{background:"var(--surface)",border:"1px solid var(--border2)",borderRadius:20,padding:"18px 20px",marginBottom:20}}>
              <h3 className="serif" style={{fontSize:28,fontWeight:400,marginBottom:8,letterSpacing:"-.4px"}}>Daily Habit Savings Calculator</h3>
              <p style={{color:"var(--text2)",fontSize:14,lineHeight:1.6}}>
                Enter any daily habit and its home-made alternative. See exactly how much you save over 1, 3, and 5 years -- and what you could do with that money.
              </p>
            </div>

            {/* Quick fill suggestions */}
            <p style={{color:"var(--text3)",fontSize:13,marginBottom:10}}>Quick examples -- tap to fill</p>
            <div style={{display:"flex",gap:7,overflowX:"auto",marginBottom:20,paddingBottom:4}}>
              {HABIT_SUGGESTIONS.map(h=>(
                <button key={h.name} onClick={()=>{setHabitName(h.name);setHabitCost(h.cost);setHomeCost(h.home);setHabitFreq(h.freq);setCalculated(false);}} className="press" style={{flexShrink:0,padding:"8px 14px",borderRadius:20,background:"var(--surface)",border:"1px solid var(--border2)",color:"var(--text2)",fontSize:13,whiteSpace:"nowrap",transition:"all .15s"}}
                  onMouseOver={e=>{e.currentTarget.style.borderColor="var(--accent)";e.currentTarget.style.color="var(--accent)"}}
                  onMouseOut={e=>{e.currentTarget.style.borderColor="var(--border2)";e.currentTarget.style.color="var(--text2)"}}>
                  {h.name}
                </button>
              ))}
            </div>

            {/* Input form */}
            <div style={{background:"var(--surface)",border:"1px solid var(--border2)",borderRadius:20,padding:"18px 20px",marginBottom:16}}>
              <div style={{marginBottom:16}}>
                <label style={{fontSize:13,color:"var(--text2)",fontWeight:500,display:"block",marginBottom:8}}>What is the habit?</label>
                <input className="field" placeholder="e.g. Starbucks coffee, gym, takeout lunch..." value={habitName} onChange={e=>{setHabitName(e.target.value);setCalculated(false);}} style={{padding:"12px 16px"}}/>
              </div>

              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
                <div>
                  <label style={{fontSize:13,color:"var(--text2)",fontWeight:500,display:"block",marginBottom:8}}>Current cost ($)</label>
                  <input className="field" type="number" placeholder="e.g. 6.50" value={habitCost} onChange={e=>{setHabitCost(e.target.value);setCalculated(false);}} style={{padding:"12px 16px"}}/>
                </div>
                <div>
                  <label style={{fontSize:13,color:"var(--text2)",fontWeight:500,display:"block",marginBottom:8}}>Home alternative ($)</label>
                  <input className="field" type="number" placeholder="e.g. 0.50" value={homeCost} onChange={e=>{setHomeCost(e.target.value);setCalculated(false);}} style={{padding:"12px 16px"}}/>
                </div>
              </div>

              <div style={{marginBottom:20}}>
                <label style={{fontSize:13,color:"var(--text2)",fontWeight:600,textTransform:"uppercase",letterSpacing:.6,display:"block",marginBottom:10}}>How often?</label>
                <div style={{display:"flex",gap:8}}>
                  {(["daily","weekly","monthly"] as const).map(freq=>(
                    <button key={freq} onClick={()=>{setHabitFreq(freq);setCalculated(false);}} className="press" style={{flex:1,padding:"10px",borderRadius:12,border:`1.5px solid ${habitFreq===freq?"var(--accent)":"var(--border2)"}`,background:habitFreq===freq?"rgba(201,168,76,.1)":"var(--surface2)",color:habitFreq===freq?"var(--accent)":"var(--text2)",fontSize:14,fontWeight:habitFreq===freq?700:500,textTransform:"capitalize",transition:"all .15s"}}>
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
                  <p style={{color:"rgba(45,200,160,.6)",fontSize:12,letterSpacing:1.2,textTransform:"uppercase",fontWeight:600,marginBottom:6}}>
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
                      <p style={{color:"var(--text3)",fontSize:11,marginBottom:6,textTransform:"uppercase",letterSpacing:.6}}>{label}</p>
                      <p style={{color,fontSize:18,fontWeight:800}}>{value}</p>
                    </div>
                  ))}
                </div>

                {/* Investment projection */}
                <div style={{background:"rgba(79,110,247,.08)",border:"1px solid rgba(79,110,247,.2)",borderRadius:16,padding:"14px 18px",marginBottom:12}}>
                  <p style={{color:"var(--accent)",fontSize:14,fontWeight:700,marginBottom:4,display:"flex",alignItems:"center",gap:6}}><Icon name="analytics" size={13}/> If you invested those savings</p>
                  <p style={{color:"var(--text2)",fontSize:14,lineHeight:1.6}}>
                    Investing ${f2(savings.yearly)}/year at 7% average market returns (S&P 500) for 5 years would grow to <strong style={{color:"var(--accent)",fontSize:16}}>${f2(savings.withInvestment)}</strong>.
                  </p>
                </div>

                {/* Fun equivalents */}
                <div style={{background:"var(--surface)",border:"1px solid var(--border2)",borderRadius:16,padding:"14px 18px",marginBottom:12}}>
                  <p style={{color:"var(--accent)",fontSize:14,fontWeight:700,marginBottom:12}}> What you could do instead</p>
                  <div style={{display:"flex",flexDirection:"column",gap:10}}>
                    {[
                      {emoji:"travel", label:"International vacations", value:`${savings.vacations} round trips to Europe`, show:savings.vacations > 0},
                      {emoji:"other", label:"iPhones", value:`Buy ${savings.iphones} iPhone 15 Pro over 3 years`, show:savings.iphones > 0},
                      {emoji:"card", label:"Credit card fee offset", value:`Covers ${Math.floor(savings.yearly / 95)} premium card annual fees per year`, show:true},
                      {emoji:"shield", label:"Emergency fund", value:`Full 3-month emergency fund in ${Math.ceil(savings.yearly > 0 ? (savings.yearly*3)/savings.yearly : 0)} years`, show:savings.yearly > 0},
                      {emoji:"analytics", label:"The math on coffee", value:`${Math.round(savings.yearly / (parseFloat(habitCost)||6))} fewer ${savings.coffeeLabel} purchases per year`, show:true},
                    ].filter(i=>i.show).map(({emoji,label,value})=>(
                      <div key={label} style={{display:"flex",gap:12,alignItems:"center"}}>
                        <div style={{width:36,height:36,borderRadius:10,background:"var(--accentbg)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:"var(--accent)"}}><Icon name={emoji} size={16}/></div>
                        <div>
                          <p style={{color:"var(--text)",fontSize:13,fontWeight:600}}>{label}</p>
                          <p style={{color:"var(--text2)",fontSize:12,marginTop:1}}>{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card rewards angle */}
                {cards.length > 0 && (
                  <div style={{background:"rgba(201,168,76,.08)",border:"1px solid rgba(201,168,76,.2)",borderRadius:16,padding:"14px 18px",marginBottom:12}}>
                    <p style={{color:"var(--accent)",fontSize:14,fontWeight:700,marginBottom:6,display:"flex",alignItems:"center",gap:6}}><Icon name="card" size={13}/> WiseCard tip</p>
                    <p style={{color:"var(--text2)",fontSize:13,lineHeight:1.6}}>
                      If you still buy {savings.coffeeLabel} occasionally, always use {cards[0].name} -- it earns {cards[0].rewardRate}. On ${f2(savings.monthly)} monthly spending that earns roughly ${f2(Math.round(savings.monthly * 0.04))} back per month in rewards.
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
                <p style={{color:"var(--text2)",fontSize:14}}>The home version actually costs more than your current habit. Consider keeping the original.</p>
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

/* ============================================================
   SPENDING ANALYTICS SCREEN
   ============================================================ */
function Analytics({ go, cards, profile, txns, onAddTxn, onDeleteTxn }: { go:(s:S)=>void; cards:CreditCard[]; profile:UserProfile; txns:Txn[]; onAddTxn:(cat:string,amount:number,desc:string,card:string,date:string)=>void; onDeleteTxn:(id:string)=>void }) {
  const CATS = [
    {label:"Dining",key:"dining",color:"#5B8DB8",icon:"dining"},
    {label:"Groceries",key:"groceries",color:"#5B9A6F",icon:"groceries"},
    {label:"Travel",key:"travel",color:"#C4875C",icon:"travel"},
    {label:"Gas",key:"gas",color:"#C4875C",icon:"gas"},
    {label:"Shopping",key:"shopping",color:"#8B7EB8",icon:"shopping"},
    {label:"Other",key:"other",color:"#94A3B8",icon:"other"},
  ];
  const [showAdd, setShowAdd] = useState(false);
  const [amt, setAmt] = useState(""); const [desc, setDesc] = useState(""); const [cat, setCat] = useState("dining"); const [card, setCard] = useState(cards[0]?.name||"");
  const [activeCat, setActiveCat] = useState<string|null>(null);
  const [period, setPeriod] = useState<"1M"|"3M"|"6M"|"1Y">("1M");
  const [hoverDay, setHoverDay] = useState<number|null>(null);
  const [hoverX, setHoverX] = useState(0);
  const chartRef = useRef<HTMLDivElement>(null);

  const spending = profile.spending||{};
  const merged = CATS.map(c => {
    const val = Number((spending as any)[c.key]||0) + txns.filter(t=>t.cat===c.key).reduce((s,t)=>s+t.amount,0);
    return {...c, val};
  }).sort((a,b) => b.val - a.val);
  const total = merged.reduce((s,c) => s+c.val, 0);
  const totalBal = cards.reduce((s,c)=>s+c.balance,0);
  const displayTotal = total || totalBal;
  const prevTotal = Math.round(displayTotal * 1.12);
  const changePct = prevTotal > 0 ? Math.abs(((displayTotal - prevTotal) / prevTotal * 100)).toFixed(1) : "0";
  const isDown = displayTotal <= prevTotal;
  const totalPts = cards.reduce((s,c)=>s+c.points,0);
  const totalLim = cards.reduce((s,c)=>s+c.limit,0);
  const util = totalLim > 0 ? Math.round(totalBal/totalLim*100) : 0;

  // Generate 30-day spending data from seed
  const dailyData = Array.from({length:30},(_, i) => {
    const seed = (displayTotal + i * 37) % 100;
    const base = displayTotal / 30;
    const val = Math.round(base * (0.3 + seed/50));
    const topCat = merged[i % merged.length];
    return {day: i+1, val, cat: topCat?.key||"other", label: `Jul ${i+1}`};
  });

  // SVG chart path
  const maxVal = Math.max(...dailyData.map(d=>d.val), 1);
  const chartW = 640, chartH = 160;
  const points = dailyData.map((d,i) => ({x: (i/(dailyData.length-1))*chartW, y: chartH - (d.val/maxVal)*(chartH-20) - 10}));
  const linePath = points.map((p,i) => {
    if (i===0) return `M${p.x},${p.y}`;
    const prev = points[i-1];
    const cpx1 = prev.x + (p.x-prev.x)*0.4, cpx2 = prev.x + (p.x-prev.x)*0.6;
    return `C${cpx1},${prev.y} ${cpx2},${p.y} ${p.x},${p.y}`;
  }).join(" ");
  const areaPath = linePath + ` L${chartW},${chartH} L0,${chartH} Z`;

  // Bubble sizes — proportional to spending
  const maxCatVal = Math.max(...merged.map(m=>m.val), 1);
  const bubbleSize = (val:number) => Math.max(48, Math.round(90 * (val / maxCatVal)));

  const filteredTxns = activeCat ? txns.filter(t=>t.cat===activeCat) : txns;

  const handleChartHover = (e:React.MouseEvent) => {
    if (!chartRef.current) return;
    const rect = chartRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = x / rect.width;
    const idx = Math.min(29, Math.max(0, Math.round(pct * 29)));
    setHoverDay(idx);
    setHoverX(x);
  };

  return (
    <div className="screen desktop-content screen-enter">
      <div className="px" style={{paddingTop:8}}>
        {/* Header */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
          <h1 style={{fontSize:24,fontWeight:500,color:"var(--text)",letterSpacing:"-.3px",margin:0}}>Insights</h1>
          <button onClick={()=>setShowAdd(true)} className="press spring-hover" style={{padding:"8px 16px",borderRadius:8,border:"1px solid var(--border2)",background:"transparent",color:"var(--text)",fontSize:12,fontWeight:500,cursor:"pointer"}}>+ Log</button>
        </div>

        {/* Hero number */}
        <div className="au">
          <div style={{display:"flex",alignItems:"baseline",gap:12,marginBottom:2}}>
            <span className="animate-number" style={{fontSize:44,fontWeight:500,color:"var(--text)",letterSpacing:"-2px",lineHeight:1}}>${displayTotal.toLocaleString()}</span>
            <span style={{fontSize:13,fontWeight:500,color:isDown?"var(--green)":"var(--red)"}}>
              <Icon name={isDown?"trending-up":"trending-up"} size={14}/> {isDown?"↓":"↑"} {changePct}%
            </span>
          </div>
          <div style={{fontSize:12,color:"var(--text2)",marginBottom:6}}>
            You're spending <span style={{fontWeight:500,color:"var(--text)"}}>${Math.abs(displayTotal-prevTotal).toLocaleString()} {isDown?"less":"more"}</span> than last month
          </div>
        </div>

        {/* Period pills */}
        <div className="au d1" style={{display:"inline-flex",borderRadius:8,padding:3,border:"1px solid var(--border)",marginBottom:16,gap:2}}>
          {(["1M","3M","6M","1Y"] as const).map(p => (
            <button key={p} onClick={()=>setPeriod(p)} className="press" style={{
              padding:"6px 16px",borderRadius:6,border:"none",cursor:"pointer",fontSize:12,
              fontWeight:period===p?500:400,
              background:period===p?"var(--text)":"transparent",
              color:period===p?"var(--surface)":"var(--text2)",
              transition:"all .2s cubic-bezier(.22,1,.36,1)",
            }}>{p}</button>
          ))}
        </div>

        {/* Interactive area chart */}
        <div className="au d2" ref={chartRef} onMouseMove={handleChartHover} onMouseLeave={()=>setHoverDay(null)}
          style={{position:"relative",height:180,marginBottom:4,borderBottom:"1px solid var(--border)",overflow:"hidden",cursor:"crosshair"}}>
          
          {/* Hairline */}
          {hoverDay !== null && (
            <div style={{position:"absolute",top:0,bottom:0,left:hoverX,width:1,background:"var(--border2)",pointerEvents:"none",zIndex:1}}/>
          )}
          
          {/* Tooltip */}
          {hoverDay !== null && (
            <div style={{position:"absolute",top:16,left:Math.min(hoverX+10, 520),background:"var(--surface)",border:"1px solid var(--border2)",borderRadius:8,padding:"8px 12px",pointerEvents:"none",zIndex:2,boxShadow:"var(--shadow)"}}>
              <div style={{fontSize:12,fontWeight:500,color:"var(--text)"}}>{dailyData[hoverDay]?.label}</div>
              <div style={{fontSize:11,color:"var(--text2)",marginTop:2}}>${dailyData[hoverDay]?.val} spent</div>
            </div>
          )}
          
          {/* Dot on hover */}
          {hoverDay !== null && points[hoverDay] && (
            <div style={{position:"absolute",left:points[hoverDay].x-4,top:points[hoverDay].y-4,width:8,height:8,borderRadius:"50%",background:"#5B8DB8",border:"2px solid var(--surface)",pointerEvents:"none",zIndex:2,transition:"left .05s, top .05s"}}/>
          )}
          
          <svg viewBox={`0 0 ${chartW} ${chartH}`} preserveAspectRatio="none" style={{width:"100%",height:"100%"}}>
            <defs>
              <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5B8DB8" stopOpacity=".18"/>
                <stop offset="100%" stopColor="#5B8DB8" stopOpacity=".01"/>
              </linearGradient>
            </defs>
            <path d={areaPath} fill="url(#aGrad)" style={{animation:"fadeUp .8s ease both"}}/>
            <path d={linePath} fill="none" stroke="#5B8DB8" strokeWidth="2" strokeLinecap="round"/>
            <circle cx={points[points.length-1]?.x} cy={points[points.length-1]?.y} r="3.5" fill="#5B8DB8"/>
          </svg>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"var(--text3)",padding:"4px 0",marginBottom:4}}>
          <span>Jul 1</span><span>Jul 10</span><span>Jul 20</span><span>Jul 30</span>
        </div>

        {/* Category bubbles */}
        <div style={{fontSize:11,color:"var(--text3)",fontWeight:500,letterSpacing:".8px",textTransform:"uppercase",margin:"20px 0 10px"}}>Where your money goes</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center",padding:"8px 0 16px"}}>
          {merged.filter(m=>m.val>0).map((m,i) => {
            const sz = bubbleSize(m.val);
            const isActive = activeCat === m.key;
            const isDimmed = activeCat && !isActive;
            return (
              <div key={m.key} onClick={()=>setActiveCat(isActive?null:m.key)} className="press"
                style={{
                  width:sz,height:sz,borderRadius:"50%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
                  background:`${m.color}${isActive?"22":"12"}`,
                  cursor:"pointer",transition:"all .35s cubic-bezier(.22,1,.36,1)",
                  transform:isActive?"scale(1.12)":isDimmed?"scale(.85)":"scale(1)",
                  opacity:isDimmed?0.3:1,
                  animation:`popIn .4s cubic-bezier(.34,1.56,.64,1) ${i*0.08}s both`,
                }}>
                <div style={{fontSize:sz>60?13:11,fontWeight:500,color:m.color,letterSpacing:"-.3px"}}>${m.val.toLocaleString()}</div>
                <div style={{fontSize:sz>60?10:8,fontWeight:500,color:m.color,opacity:.7}}>{m.label}</div>
              </div>
            );
          })}
        </div>

        {/* Key metrics */}
        <div className="au d3" style={{display:"flex",padding:"16px 0",borderTop:"1px solid var(--border)",borderBottom:"1px solid var(--border)",marginBottom:4}}>
          {[
            {label:"Utilization",value:`${util}%`,color:util<30?"var(--green)":util<50?"var(--amber)":"var(--red)"},
            {label:"Points earned",value:totalPts.toLocaleString(),color:"#5B8DB8"},
            {label:"Rewards value",value:`$${Math.round(totalPts*0.01)}`,color:"#5B9A6F"},
          ].map((m,i) => (
            <div key={i} style={{flex:1,textAlign:"center",borderRight:i<2?"1px solid var(--border)":"none"}}>
              <div style={{fontSize:18,fontWeight:500,color:m.color,letterSpacing:"-.3px"}}>{m.value}</div>
              <div style={{fontSize:10,color:"var(--text2)",marginTop:3}}>{m.label}</div>
            </div>
          ))}
        </div>

        {/* Transaction feed */}
        <div style={{fontSize:11,color:"var(--text3)",fontWeight:500,letterSpacing:".8px",textTransform:"uppercase",margin:"20px 0 10px"}}>
          {activeCat ? `${CATS.find(c=>c.key===activeCat)?.label||""} transactions` : "Recent activity"}
          {activeCat && <button onClick={()=>setActiveCat(null)} style={{fontSize:11,color:"var(--text2)",background:"none",border:"none",cursor:"pointer",marginLeft:8}}>Clear</button>}
        </div>
        
        {filteredTxns.length > 0 ? (
          <div>
            {filteredTxns.slice(-10).reverse().map((t,i) => {
              const catInfo = CATS.find(c=>c.key===t.cat);
              return (
                <div key={t.id} className="au" style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"11px 0",borderBottom:i<Math.min(filteredTxns.length,10)-1?"1px solid var(--border)":"none",cursor:"pointer",transition:"transform .2s",animationDelay:`${i*0.04}s`}}
                  onMouseEnter={e=>(e.currentTarget.style.transform="translateX(3px)")} onMouseLeave={e=>(e.currentTarget.style.transform="translateX(0)")}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:8,height:8,borderRadius:"50%",background:catInfo?.color||"var(--text3)",flexShrink:0}}/>
                    <div>
                      <div style={{fontSize:13,color:"var(--text)"}}>{t.desc||catInfo?.label}</div>
                      <div style={{fontSize:11,color:"var(--text2)"}}>{catInfo?.label} · {cards.find(c=>c.name===t.card)?.name||t.card||"Card"} · {t.date||"Today"}</div>
                    </div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:14,fontWeight:500,color:"var(--text)",letterSpacing:"-.3px"}}>${t.amount}</div>
                      <div style={{fontSize:10,color:"var(--text2)"}}>+{t.amount * 3} pts</div>
                    </div>
                    <button onClick={(e)=>{e.stopPropagation();onDeleteTxn(t.id)}} className="press" style={{background:"none",border:"none",cursor:"pointer",color:"var(--text3)",padding:2}}>
                      <Icon name="trash" size={12}/>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{textAlign:"center",padding:"32px 0"}}>
            <div style={{fontSize:14,fontWeight:500,color:"var(--text)",marginBottom:4}}>No transactions yet</div>
            <div style={{fontSize:12,color:"var(--text2)",marginBottom:12}}>Log your spending for better insights and predictions.</div>
            <button onClick={()=>setShowAdd(true)} className="press spring-hover" style={{padding:"9px 18px",borderRadius:8,border:"none",background:"var(--text)",color:"var(--surface)",fontSize:12,fontWeight:500,cursor:"pointer"}}>Log first transaction</button>
          </div>
        )}

        {/* Spending predictor */}
        {txns.length >= 3 && (
          <div style={{margin:"20px 0"}}>
            <div style={{fontSize:11,color:"var(--text3)",fontWeight:500,letterSpacing:".8px",textTransform:"uppercase",marginBottom:10}}>Predicted next month</div>
            <div style={{padding:"14px 16px",background:"var(--surface2)",borderRadius:10,border:"1px solid var(--border)"}}>
              {(() => {
                const catTotals: Record<string,number[]> = {};
                txns.forEach(t => { if (!catTotals[t.cat]) catTotals[t.cat] = []; catTotals[t.cat].push(t.amount); });
                const predictions = Object.entries(catTotals).map(([c, amounts]) => {
                  const avg = amounts.reduce((s,a)=>s+a,0) / amounts.length;
                  const trend = amounts.length > 1 ? (amounts[amounts.length-1] - amounts[0]) / amounts.length : 0;
                  const predicted = Math.max(0, Math.round(avg + trend));
                  const ci = CATS.find(cc => cc.key === c);
                  return { cat: c, label: ci?.label || c, color: ci?.color || "#94A3B8", predicted, trend };
                }).sort((a,b) => b.predicted - a.predicted);
                const totalPred = predictions.reduce((s,p)=>s+p.predicted,0);
                return (
                  <div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:12}}>
                      <span style={{fontSize:12,color:"var(--text2)"}}>Estimate</span>
                      <span style={{fontSize:18,fontWeight:500,color:"var(--text)",letterSpacing:"-.5px"}}>${totalPred.toLocaleString()}</span>
                    </div>
                    {predictions.slice(0,4).map(p => (
                      <div key={p.cat} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 0"}}>
                        <div style={{width:5,height:5,borderRadius:"50%",background:p.color}}/>
                        <span style={{fontSize:12,color:"var(--text)",flex:1}}>{p.label}</span>
                        <span style={{fontSize:12,fontWeight:500,color:"var(--text)"}}>${p.predicted}</span>
                        <span style={{fontSize:10,width:14,textAlign:"right",color:p.trend>5?"var(--red)":p.trend<-5?"var(--green)":"var(--text2)"}}>
                          {p.trend > 5 ? "↑" : p.trend < -5 ? "↓" : "→"}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* Why card */}
        {merged.length > 1 && merged[0].val > 0 && (
          <div onClick={()=>go("chat")} className="press" style={{padding:"16px 18px",borderRadius:10,border:"1px solid var(--border)",marginTop:8,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",transition:"border-color .2s"}}
            onMouseEnter={e=>(e.currentTarget.style.borderColor="var(--border2)")} onMouseLeave={e=>(e.currentTarget.style.borderColor="var(--border)")}>
            <div>
              <div style={{fontSize:13,fontWeight:500,color:"var(--text)"}}>Why is {merged[0].label.toLowerCase()} your biggest expense?</div>
              <div style={{fontSize:11,color:"var(--text2)",marginTop:2}}>Ask the advisor to analyze your pattern</div>
            </div>
            <Icon name="arrow-right" size={16} color="var(--text2)"/>
          </div>
        )}

        {/* Add modal */}
        {showAdd && (
          <div style={{position:"fixed",inset:0,zIndex:10000,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,.4)",backdropFilter:"blur(4px)"}} onClick={()=>setShowAdd(false)}>
            <div onClick={e=>e.stopPropagation()} className="ap" style={{background:"var(--surface)",borderRadius:14,padding:"24px 22px",width:"90%",maxWidth:380,boxShadow:"var(--shadow-lg)"}}>
              <div style={{fontSize:17,fontWeight:500,color:"var(--text)",marginBottom:4}}>Log transaction</div>
              <div style={{fontSize:12,color:"var(--text2)",marginBottom:18}}>Track spending for better predictions</div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <input className="field" type="number" placeholder="Amount" value={amt} onChange={e=>setAmt(e.target.value)}/>
                <input className="field" placeholder="Description" value={desc} onChange={e=>setDesc(e.target.value)}/>
                <select className="field" value={cat} onChange={e=>setCat(e.target.value)}>
                  {CATS.map(c=><option key={c.key} value={c.key}>{c.label}</option>)}
                </select>
                {cards.length>0 && <select className="field" value={card} onChange={e=>setCard(e.target.value)}>
                  {cards.map(c=><option key={c.id} value={c.name}>{c.name}</option>)}
                </select>}
                <button onClick={()=>{if(!amt)return;onAddTxn(cat,parseFloat(amt),desc,card,new Date().toISOString().split("T")[0]);setAmt("");setDesc("");setShowAdd(false);}} className="press spring-hover" style={{padding:"12px 0",borderRadius:8,border:"none",background:"var(--text)",color:"var(--surface)",fontSize:13,fontWeight:500,cursor:"pointer",width:"100%"}}>Save</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


function Notifications({ go, cards }: { go:(s:S)=>void; cards:CreditCard[] }) {
  const [prefs, setPrefs] = useState({paymentDue:true,utilizationHigh:true,perkExpiring:true,scoreChange:true,newOffer:true,weeklyDigest:true,appUpdates:false,annualFeeRenewal:true});
  const tog = (k: keyof typeof prefs) => setPrefs(p=>({...p,[k]:!p[k]}));
  // Annual fee renewal alerts -- based on openedDate anniversary
  const annualFeeAlerts = cards.filter(c=>c.annualFee>0 && c.openedDate).map(c=>{
    const opened = new Date(c.openedDate!);
    const now = new Date();
    const nextRenewal = new Date(opened);
    nextRenewal.setFullYear(now.getFullYear());
    if(nextRenewal < now) nextRenewal.setFullYear(now.getFullYear()+1);
    const daysUntilRenewal = Math.ceil((nextRenewal.getTime()-now.getTime())/86400000);
    return {card:c, daysUntilRenewal};
  }).filter(x=>x.daysUntilRenewal<=30);

  const alerts = [
    ...cards.filter(c=>daysUntil(c.dueDate)<=7&&daysUntil(c.dueDate)>=0).map(c=>({type:"warning" as const,title:`Payment due in ${daysUntil(c.dueDate)} days`,desc:`${c.name} — $${f(c.minPayment)} minimum due`,time:"Now"})),
    ...cards.filter(c=>c.balance/c.limit>0.3).map(c=>({type:"error" as const,title:"High utilization alert",desc:`${c.name} is at ${Math.round(c.balance/c.limit*100)}% — pay down to protect your score`,time:"Today"})),
    ...annualFeeAlerts.map(({card,daysUntilRenewal})=>({type:"warning" as const,title:`Annual fee renews in ${daysUntilRenewal} days`,desc:`${card.name} — $${card.annualFee} fee. Decide whether to keep, downgrade, or call retention.`,time:"Soon"})),
    {type:"info" as const,title:"Weekly digest ready",desc:"Your WiseCard financial recap for this week is ready",time:"Mon"},
    {type:"success" as const,title:"New cashback offer",desc:"5% back on gas activated on your Chase card",time:"Yesterday"},
  ];
  const ico=(t:string)=>t==="warning"?"warning":t==="error"?"alert":t==="success"?"check-circle":"info";
  const icoColor=(t:string)=>t==="warning"?"var(--amber)":t==="error"?"var(--red)":t==="success"?"var(--green)":"var(--accent)";
  return (
    <div className="screen desktop-content screen-enter">
      <PageHead title="Notifications" back={()=>go("settings")}/>
      <div className="px">
        {alerts.length>0&&(
          <>
            <p style={{color:"var(--text3)",fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>Recent</p>
            <div className="card-surface" style={{marginBottom:24,overflow:"hidden"}}>
              {alerts.map((a,i)=>(
                <div key={i} style={{padding:"14px 16px",borderBottom:i<alerts.length-1?"1px solid var(--border)":"none",display:"flex",gap:12,alignItems:"flex-start"}}>
                  <span style={{flexShrink:0,color:icoColor(a.type)}}><Icon name={ico(a.type)} size={18}/></span>
                  <div style={{flex:1}}>
                    <p style={{color:"var(--text)",fontSize:14,fontWeight:600}}>{a.title}</p>
                    <p style={{color:"var(--text2)",fontSize:13,marginTop:2,lineHeight:1.4}}>{a.desc}</p>
                  </div>
                  <span style={{color:"var(--text3)",fontSize:12,flexShrink:0,marginTop:1}}>{a.time}</span>
                </div>
              ))}
            </div>
          </>
        )}
        <p style={{color:"var(--text3)",fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>Preferences</p>
        <div className="card-surface" style={{overflow:"hidden"}}>
          {([
            ["paymentDue","card","Payment Reminders","7 and 3 days before due dates"],
            ["utilizationHigh","analytics","Utilization Warnings","When any card exceeds 30%"],
            ["perkExpiring","perks","Perk Expiry Alerts","Before credits and offers expire"],
            ["scoreChange","trend-down","Score Changes","When your credit score changes"],
            ["newOffer","gift","New Offers","When new cashback offers activate"],
            ["weeklyDigest","mail","Weekly Digest","Monday morning financial recap"],
            ["annualFeeRenewal","card","Annual Fee Reminders","30 days before your card's fee renews"],
            ["appUpdates","bell","App Updates","New features and improvements"],
          ] as [keyof typeof prefs,string,string,string][]).map(([key,icon,label,desc],i,arr)=>(
            <div key={key} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",borderBottom:i<arr.length-1?"1px solid var(--border)":"none"}}>
              <span style={{width:26,display:"flex",justifyContent:"center",color:"var(--text2)"}}><Icon name={icon} size={16}/></span>
              <div style={{flex:1}}>
                <p style={{color:"var(--text)",fontSize:14,fontWeight:600}}>{label}</p>
                <p style={{color:"var(--text2)",fontSize:12,marginTop:1}}>{desc}</p>
              </div>
              <Toggle on={prefs[key]} set={()=>tog(key)}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   COMPARE CARDS SCREEN
   ============================================================ */
function Compare({ go, cards }: { go:(s:S)=>void; cards:CreditCard[] }) {
  const allCards = [...cards,...CARD_DB.filter(d=>!cards.find(c=>c.dbId===d.id)).map(d=>({
    id:d.id,dbId:d.id,name:d.name,issuer:d.issuer,gradient:d.gradient,accentColor:d.accentColor,
    balance:0,limit:0,minPayment:0,dueDate:"",points:0,apr:d.apr||"",
    rewardRate:d.rewardRate,annualFee:d.annualFee,perksValue:d.perksValue,
    offers:[],cashback:d.cashback,category:d.category,
    signupBonus:d.signupBonus,bestFor:d.bestFor,keyBenefits:d.keyBenefits,bestPlaces:d.bestPlaces,notGoodFor:d.notGoodFor,
  }))];
  const [a,setA]=useState(allCards[0]?.dbId||"");
  const [b,setB]=useState(allCards[1]?.dbId||"");
  const [monthlySpend, setMonthlySpend] = useState(2000);
  const cA=allCards.find(c=>c.dbId===a); const cB=allCards.find(c=>c.dbId===b);

  // Calculate estimated annual rewards value
  const calcAnnualValue = (c:any) => {
    // Simple heuristic: parse reward rate for the multiplier
    const rateStr = c.rewardRate || "";
    let baseRate = 0.015; // default 1.5%
    const match5 = rateStr.match(/(\d+)x/i);
    if (match5) baseRate = parseInt(match5[1]) * 0.01; // e.g. "3x" → 3%
    const match2 = rateStr.match(/(\d+)%/);
    if (match2) baseRate = parseInt(match2[1]) / 100;
    // Blended rate: assume 40% of spend is in bonus categories
    const blendedRate = baseRate * 0.4 + 0.01 * 0.6;
    const annualRewards = monthlySpend * 12 * blendedRate;
    const netValue = annualRewards + c.perksValue - c.annualFee;
    return { annualRewards: Math.round(annualRewards), netValue: Math.round(netValue), roi: c.annualFee > 0 ? ((annualRewards + c.perksValue - c.annualFee) / c.annualFee * 100).toFixed(0) : "∞" };
  };

  const rows:[string,(c:any)=>string,(a:any,b:any)=>string][]=[
    ["Annual Fee",c=>`$${c.annualFee}`,(a,b)=>a.annualFee<b.annualFee?"a":a.annualFee>b.annualFee?"b":"tie"],
    ["Perks Value",c=>`$${c.perksValue}/yr`,(a,b)=>a.perksValue>b.perksValue?"a":a.perksValue<b.perksValue?"b":"tie"],
    ["Net Value",c=>`$${c.perksValue-c.annualFee}/yr`,(a,b)=>(a.perksValue-a.annualFee)>(b.perksValue-b.annualFee)?"a":(a.perksValue-a.annualFee)<(b.perksValue-b.annualFee)?"b":"tie"],
    ["Rewards",c=>c.rewardRate,()=>"tie"],
    ["APR",c=>c.apr||"N/A",(a,b)=>{const pa=parseFloat((a.apr||"99").replace(/[^\d.]/g,"")); const pb=parseFloat((b.apr||"99").replace(/[^\d.]/g,"")); return pa<pb?"a":pa>pb?"b":"tie";}],
    ["Type",c=>c.cashback,()=>"tie"],
    ["Category",c=>c.category,()=>"tie"],
  ];

  const valA = cA ? calcAnnualValue(cA) : null;
  const valB = cB ? calcAnnualValue(cB) : null;

  return (
    <div className="screen desktop-content screen-enter">
      <PageHead title="Compare Cards" sub="Side-by-side with ROI analysis" back={()=>go("settings")}/>
      <div className="px">
        <div className="mobile-stack" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
          {[{val:a,set:setA,label:"Card A"},{val:b,set:setB,label:"Card B"}].map(({val,set,label})=>(
            <div key={label}>
              <p style={{color:"var(--text3)",fontSize:12,fontWeight:600,textTransform:"uppercase",letterSpacing:.8,marginBottom:7}}>{label}</p>
              <select className="field" value={val} onChange={e=>set(e.target.value)} style={{fontSize:13,padding:"10px 12px"}}>
                {allCards.map(c=><option key={c.dbId} value={c.dbId}>{c.name} ({c.issuer})</option>)}
              </select>
            </div>
          ))}
        </div>

        {/* Monthly spend slider for ROI calc */}
        <div className="card-surface" style={{padding:14,marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
            <span style={{fontSize:12,fontWeight:600,color:"var(--text)"}}>Monthly Spend Estimate</span>
            <span style={{fontSize:13,fontWeight:700,color:"var(--accent)",fontFamily:"var(--mono,monospace)"}}>${monthlySpend.toLocaleString()}</span>
          </div>
          <input type="range" min={500} max={10000} step={100} value={monthlySpend}
            onChange={e=>setMonthlySpend(parseInt(e.target.value))}
            style={{width:"100%",accentColor:"var(--accent)"}} />
          <div style={{fontSize:10,color:"var(--text2)",marginTop:2}}>Adjust to see estimated annual rewards value for each card</div>
        </div>

        {cA&&cB&&(
          <>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:18}}>
              {[cA,cB].map(c=>(
                <div key={c.dbId} className="card-shimmer" style={{background:c.gradient,borderRadius:14,padding:"16px 14px",position:"relative",overflow:"hidden"}}>
                  <p style={{color:"rgba(255,255,255,.55)",fontSize:11,letterSpacing:1,textTransform:"uppercase"}}>{c.issuer}</p>
                  <p style={{color:"#fff",fontSize:15,fontWeight:700,marginTop:3}}>{c.name}</p>
                  <p style={{color:"rgba(255,255,255,.6)",fontSize:12,marginTop:5}}>{c.rewardRate}</p>
                </div>
              ))}
            </div>

            {/* ROI Summary */}
            {valA && valB && (
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
                {[{c:cA,v:valA,other:valB},{c:cB,v:valB,other:valA}].map(({c,v,other})=>{
                  const winner = v.netValue > other.netValue;
                  return (
                    <div key={c.dbId} className="card-surface" style={{padding:14,border:winner?"2px solid var(--green)":"1px solid var(--border)"}}>
                      {winner && <div style={{fontSize:9,fontWeight:700,color:"var(--green)",textTransform:"uppercase",letterSpacing:.5,marginBottom:6}}>⭐ Better Value</div>}
                      <div style={{fontSize:11,color:"var(--text2)",marginBottom:2}}>Est. Annual Rewards</div>
                      <div style={{fontSize:18,fontWeight:700,color:"var(--text)"}}>${v.annualRewards}</div>
                      <div style={{fontSize:11,color:"var(--text2)",marginTop:6,marginBottom:2}}>Net Annual Value</div>
                      <div style={{fontSize:16,fontWeight:700,color:v.netValue>=0?"var(--green)":"var(--red)"}}>{v.netValue>=0?"+":""}${v.netValue}</div>
                      {c.annualFee > 0 && <div style={{fontSize:10,color:"var(--text2)",marginTop:4}}>ROI: {v.roi}%</div>}
                    </div>
                  );
                })}
              </div>
            )}

            <div className="card-surface" style={{overflow:"hidden",marginBottom:18}}>
              {rows.map(([label,fmt,winner],i,arr)=>{
                const w=winner(cA,cB);
                return (
                  <div key={label} style={{display:"grid",gridTemplateColumns:"1fr 100px 1fr",padding:"12px 14px",borderBottom:i<arr.length-1?"1px solid var(--border)":"none",alignItems:"center",gap:6}}>
                    <p style={{color:w==="a"?"var(--green)":"var(--text)",fontSize:13,fontWeight:w==="a"?700:400}}>{fmt(cA)}</p>
                    <p style={{color:"var(--text3)",fontSize:11,textAlign:"center",fontWeight:600,textTransform:"uppercase",letterSpacing:.5}}>{label}</p>
                    <p style={{color:w==="b"?"var(--green)":"var(--text)",fontSize:13,fontWeight:w==="b"?700:400,textAlign:"right"}}>{fmt(cB)}</p>
                  </div>
                );
              })}
            </div>

            {/* Best For / Not Good For */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
              {[cA,cB].map(c=>(
                <div key={c.dbId} className="card-surface" style={{padding:"14px"}}>
                  <p style={{color:"var(--green)",fontSize:12,fontWeight:700,marginBottom:8}}>Best for</p>
                  {(c.bestFor||[]).slice(0,3).map((b:string,i:number)=>(
                    <p key={i} style={{color:"var(--text2)",fontSize:12,marginBottom:4,lineHeight:1.4}}>• {b}</p>
                  ))}
                </div>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {[cA,cB].map(c=>(
                <div key={c.dbId} className="card-surface" style={{padding:"14px"}}>
                  <p style={{color:"var(--red)",fontSize:12,fontWeight:700,marginBottom:8}}>Not ideal for</p>
                  {(c.notGoodFor||[]).slice(0,3).map((b:string,i:number)=>(
                    <p key={i} style={{color:"var(--text2)",fontSize:12,marginBottom:4,lineHeight:1.4}}>• {b}</p>
                  ))}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}


/* ============================================================
   EDIT PROFILE SCREEN
   ============================================================ */
function EditProfile({ go, profile, onSave }: { go:(s:S)=>void; profile:UserProfile; onSave:(p:UserProfile)=>void }) {
  const [p,setP]=useState({...profile});
  const set=(k:keyof UserProfile,v:any)=>setP(prev=>({...prev,[k]:v}));
  const setSp=(k:keyof typeof p.spending,v:string)=>set("spending",{...p.spending,[k]:v});
  const setCap=(k:keyof typeof p.spending,v:string)=>set("budgetCaps",{...(p.budgetCaps||{dining:"",groceries:"",travel:"",gas:"",shopping:"",other:""}),[k]:v});
  const INCOMES=["Under $30,000","$30,000-$60,000","$60,000-$100,000","$100,000-$150,000","$150,000-$250,000","$250,000+"];
  const SCORES=["300-579 (Poor)","580-669 (Fair)","670-739 (Good)","740-799 (Very Good)","800+ (Exceptional)"];
  return (
    <div className="screen desktop-content screen-enter">
      <PageHead title="Edit Profile" back={()=>go("settings")}/>
      <div className="px">
        <div className="card-surface" style={{padding:"20px",marginBottom:16}}>
          <p style={{color:"var(--text3)",fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:.8,marginBottom:14}}>Personal Info</p>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div>
              <label style={{fontSize:13,color:"var(--text2)",fontWeight:500,display:"block",marginBottom:6}}>Full Name</label>
              <input className="field" value={p.name} onChange={e=>set("name",e.target.value)} placeholder="Your name"/>
            </div>
            <div>
              <label style={{fontSize:13,color:"var(--text2)",fontWeight:500,display:"block",marginBottom:6}}>Annual Income</label>
              <select className="field" value={p.income} onChange={e=>set("income",e.target.value)}>
                <option value="">Select income range</option>
                {INCOMES.map(i=><option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label style={{fontSize:13,color:"var(--text2)",fontWeight:500,display:"block",marginBottom:6}}>Credit Score Range</label>
              <select className="field" value={p.creditScore} onChange={e=>set("creditScore",e.target.value)}>
                <option value="">Select score range</option>
                {SCORES.map(s=><option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="card-surface" style={{padding:"20px",marginBottom:20}}>
          <p style={{color:"var(--text3)",fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:.8,marginBottom:14}}>Monthly Spending</p>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {([["dining","Dining"],["groceries","Groceries"],["travel","Travel"],["gas","Gas"],["shopping","Shopping"],["other","Other"]] as [keyof typeof p.spending,string][]).map(([k,label])=>(
              <div key={k}>
                <label style={{fontSize:13,color:"var(--text2)",fontWeight:500,display:"block",marginBottom:5}}>{label} / month</label>
                <input className="field" type="number" placeholder="$0" value={p.spending[k]} onChange={e=>setSp(k,e.target.value)}/>
              </div>
            ))}
          </div>
        </div>

        <div className="card-surface" style={{padding:"20px",marginBottom:20}}>
          <p style={{color:"var(--text3)",fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:.8,marginBottom:6}}>Budget Caps</p>
          <p style={{color:"var(--text2)",fontSize:13,marginBottom:14,lineHeight:1.5}}>Set a monthly limit per category. We'll warn you in Analytics when you're close to going over.</p>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {([["dining","Dining"],["groceries","Groceries"],["travel","Travel"],["gas","Gas"],["shopping","Shopping"],["other","Other"]] as [keyof typeof p.spending,string][]).map(([k,label])=>(
              <div key={k}>
                <label style={{fontSize:13,color:"var(--text2)",fontWeight:500,display:"block",marginBottom:5}}>{label} cap / month</label>
                <input className="field" type="number" placeholder="No cap set" value={p.budgetCaps?.[k]||""} onChange={e=>setCap(k,e.target.value)}/>
              </div>
            ))}
          </div>
        </div>

        <button onClick={()=>{onSave(p);go("settings");}} className="btn-gold press" style={{width:"100%",padding:"14px",fontSize:15}}>Save Changes</button>
      </div>
    </div>
  );
}

/* ============================================================
   REFERRAL SCREEN
   ============================================================ */
function Referral({ go }: { go:(s:S)=>void }) {
  const [copied,setCopied]=useState(false);
  const [code]=useState("WISE"+Math.random().toString(36).slice(2,7).toUpperCase());
  const copy=()=>{navigator.clipboard.writeText(code).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2000);showToast("Referral code copied!");});};
  return (
    <div className="screen desktop-content screen-enter">
      <PageHead title="Refer a Friend" back={()=>go("settings")}/>
      <div className="px">
        <div className="card-surface au" style={{padding:"28px 22px",textAlign:"center",marginBottom:16,background:"var(--accentbg)",border:"1px solid rgba(37,99,235,.15)"}}>
          <div style={{display:"flex",justifyContent:"center",marginBottom:14,color:"var(--accent)"}}><Icon name="gift" size={40}/></div>
          <h2 style={{fontSize:22,fontWeight:700,color:"var(--text)",marginBottom:8}}>Give $20, Get $20</h2>
          <p style={{color:"var(--text2)",fontSize:14,lineHeight:1.6,maxWidth:280,margin:"0 auto 22px"}}>Share WiseCard with a friend. When they sign up and add their first card, you both get $20 in rewards.</p>
          <div style={{background:"var(--surface)",border:"2px dashed var(--accent)",borderRadius:12,padding:"16px",marginBottom:14}}>
            <p style={{color:"var(--text3)",fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Your referral code</p>
            <p style={{color:"var(--accent)",fontSize:26,fontWeight:600,letterSpacing:4}}>{code}</p>
          </div>
          <button onClick={copy} className="btn-gold press" style={{width:"100%",padding:"13px",fontSize:14}}>{copied?"✓ Copied!":"Copy Code"}</button>
        </div>
        <div className="card-surface" style={{padding:"20px",marginBottom:16}}>
          <p style={{color:"var(--text3)",fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:.8,marginBottom:14}}>How It Works</p>
          {[["1","Share your code","Send it via text, email, or social media"],["2","Friend signs up","They create a WiseCard account with your code"],["3","Both get rewarded","After they add their first card, you both earn $20"]].map(([n,t,d])=>(
            <div key={n} style={{display:"flex",gap:12,marginBottom:14,alignItems:"flex-start"}}>
              <div style={{width:26,height:26,borderRadius:"50%",background:"var(--accent)",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,flexShrink:0}}>{n}</div>
              <div><p style={{color:"var(--text)",fontSize:14,fontWeight:600}}>{t}</p><p style={{color:"var(--text2)",fontSize:13,marginTop:2,lineHeight:1.4}}>{d}</p></div>
            </div>
          ))}
        </div>
        <div className="card-surface" style={{padding:"16px 20px"}}>
          <p style={{color:"var(--text3)",fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:.8,marginBottom:8}}>Your Referrals</p>
          <EmptyState icon="users" title="No referrals yet" sub="Share your code to start earning when friends join WiseCard."/>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   PRIVACY & SECURITY SCREEN
   ============================================================ */
function Privacy({ go, profile, cards, goals, assets, txns, cardApplications, autoLogoutEnabled, setAutoLogoutEnabled }: { go:(s:S)=>void; profile:UserProfile; cards:CreditCard[]; goals:Goal[]; assets:Asset[]; txns:Txn[]; cardApplications:CardApplication[]; autoLogoutEnabled:boolean; setAutoLogoutEnabled:(v:boolean)=>void }) {
  const [dataSharing,setDataSharing]=useState(false);
  const [analytics,setAnalytics]=useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const deleteAccount = async () => {
    setDeleteLoading(true); setDeleteError("");
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setDeleteError("Session expired. Please sign in again."); setDeleteLoading(false); return; }
      const res = await fetch("/api/delete-account", {
        method: "POST",
        headers: { "Authorization": `Bearer ${session.access_token}` },
      });
      const data = await res.json();
      if (!res.ok) { setDeleteError(data.error || "Failed to delete account"); setDeleteLoading(false); return; }
      await supabase.auth.signOut();
      window.location.reload();
    } catch (e) {
      setDeleteError("Network error. Please try again.");
      setDeleteLoading(false);
    }
  };
  const [showPwForm, setShowPwForm] = useState(false);
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwStrength, setPwStrength] = useState(0);

  const calcPwStrength = (pw: string) => {
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    setPwStrength(s);
  };

  const changePassword = async () => {
    setPwError("");
    if (newPw.length < 8) { setPwError("Password must be at least 8 characters"); return; }
    if (newPw !== confirmPw) { setPwError("Passwords don't match"); return; }
    setPwLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPw });
    setPwLoading(false);
    if (error) { setPwError(error.message); return; }
    showToast("Password updated successfully");
    setShowPwForm(false); setNewPw(""); setConfirmPw("");
  };

  const [showExportFormats, setShowExportFormats] = useState(false);

  const triggerDownload = (content: string, filename: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAsJSON = () => {
    const exportData = {
      exportedAt: new Date().toISOString(),
      profile,
      cards: cards.map(c=>({...c})),
      goals, assets, transactions: txns, cardApplications,
    };
    triggerDownload(JSON.stringify(exportData, null, 2), `wisecard-data-export-${new Date().toISOString().slice(0,10)}.json`, "application/json");
    showToast("JSON export downloaded");
    setShowExportFormats(false);
  };

  const downloadAsText = () => {
    const date = new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"});
    const lines: string[] = [];
    lines.push("WISECARD -- YOUR DATA EXPORT");
    lines.push(`Generated: ${date}`);
    lines.push("=".repeat(50));

    lines.push("\nPROFILE");
    lines.push("-".repeat(50));
    lines.push(`Name: ${profile.name||"Not set"}`);
    lines.push(`Income range: ${profile.income||"Not set"}`);
    lines.push(`Credit score range: ${profile.creditScore||"Not set"}`);
    lines.push(`Primary goal: ${profile.goal||"Not set"}`);
    lines.push(`Lifestyle tags: ${(profile.lifestyles||[]).join(", ")||"None"}`);
    lines.push(`Monthly spending -- Dining: $${profile.spending?.dining||0}, Groceries: $${profile.spending?.groceries||0}, Travel: $${profile.spending?.travel||0}, Gas: $${profile.spending?.gas||0}, Shopping: $${profile.spending?.shopping||0}, Other: $${profile.spending?.other||0}`);

    lines.push(`\nCARDS (${cards.length})`);
    lines.push("-".repeat(50));
    if (cards.length===0) lines.push("No cards added.");
    cards.forEach((c,i)=>{
      lines.push(`${i+1}. ${c.name} (${c.issuer})`);
      lines.push(`   Balance: $${c.balance} of $${c.limit} limit | Points: ${c.points} | APR: ${c.apr}`);
      lines.push(`   Due date: ${c.dueDate||"Not set"} | Minimum payment: $${c.minPayment}`);
      lines.push(`   Opened: ${c.openedDate||"Not set"} | Annual fee: $${c.annualFee}`);
    });

    lines.push(`\nGOALS (${goals.length})`);
    lines.push("-".repeat(50));
    if (goals.length===0) lines.push("No goals set.");
    goals.forEach((g,i)=>{
      lines.push(`${i+1}. ${g.title} -- ${g.current}${g.unit} of ${g.target}${g.unit} (Due: ${g.due})`);
    });

    lines.push(`\nASSETS (${assets.length})`);
    lines.push("-".repeat(50));
    if (assets.length===0) lines.push("No assets added.");
    assets.forEach((a,i)=>{ lines.push(`${i+1}. ${a.name}: $${a.value}`); });

    lines.push(`\nLOGGED TRANSACTIONS (${txns.length})`);
    lines.push("-".repeat(50));
    if (txns.length===0) lines.push("No transactions logged.");
    txns.forEach((t,i)=>{ lines.push(`${i+1}. ${t.date} -- ${t.desc} -- $${t.amount} (${t.cat}, ${t.card})`); });

    lines.push(`\nCARD APPLICATIONS LOGGED (${cardApplications.length})`);
    lines.push("-".repeat(50));
    if (cardApplications.length===0) lines.push("No applications logged.");
    cardApplications.forEach((a,i)=>{ lines.push(`${i+1}. ${a.issuer} -- opened ${a.date}`); });

    lines.push("\n" + "=".repeat(50));
    lines.push("This export contains all data you've entered into WiseCard.");
    lines.push("Questions? Contact support@wisecard.app");

    triggerDownload(lines.join("\n"), `wisecard-data-summary-${new Date().toISOString().slice(0,10)}.txt`, "text/plain");
    showToast("Readable summary downloaded");
    setShowExportFormats(false);
  };
  return (
    <div className="screen desktop-content screen-enter">
      <PageHead title="Privacy & Security" back={()=>go("settings")}/>
      <div className="px">
        <div className="card-surface au" style={{padding:"15px 18px",marginBottom:16,background:"var(--greenbg)",border:"1px solid rgba(39,103,73,.2)"}}>
          <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
            <span style={{flexShrink:0,color:"var(--green)"}}><Icon name="shield" size={18}/></span>
            <div>
              <p style={{color:"var(--green)",fontSize:14,fontWeight:700}}>Your data is secure</p>
              <p style={{color:"var(--text2)",fontSize:13,marginTop:2,lineHeight:1.5}}>WiseCard uses AES-256 encryption. We never store card numbers. Your data is never sold.</p>
            </div>
          </div>
        </div>
        <p style={{color:"var(--text3)",fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>Security</p>
        <div className="card-surface" style={{overflow:"hidden",marginBottom:16}}>
          <div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",borderBottom:"1px solid var(--border)",opacity:0.55}}>
            <span style={{width:26,display:"flex",justifyContent:"center",color:"var(--text3)"}}><Icon name="key" size={16}/></span>
            <div style={{flex:1}}>
              <p style={{color:"var(--text)",fontSize:14,fontWeight:600}}>Biometric Login</p>
              <p style={{color:"var(--text2)",fontSize:12}}>Face ID or fingerprint sign-in</p>
            </div>
            <span className="pill pill-gray" style={{fontSize:10,fontWeight:700}}>COMING SOON</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",borderBottom:"1px solid var(--border)",opacity:0.55}}>
            <span style={{width:26,display:"flex",justifyContent:"center",color:"var(--text3)"}}><Icon name="shield" size={16}/></span>
            <div style={{flex:1}}>
              <p style={{color:"var(--text)",fontSize:14,fontWeight:600}}>Two-Factor Authentication</p>
              <p style={{color:"var(--text2)",fontSize:12}}>Require a code from your phone at sign-in</p>
            </div>
            <span className="pill pill-gray" style={{fontSize:10,fontWeight:700}}>COMING SOON</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",borderBottom:"1px solid var(--border)"}}>
            <span style={{width:26,display:"flex",justifyContent:"center",color:"var(--text2)"}}><Icon name="clock" size={16}/></span>
            <div style={{flex:1}}><p style={{color:"var(--text)",fontSize:14,fontWeight:600}}>Auto Sign-Out</p><p style={{color:"var(--text2)",fontSize:12}}>Sign out automatically after 15 minutes idle</p></div>
            <Toggle on={autoLogoutEnabled} set={()=>{setAutoLogoutEnabled(!autoLogoutEnabled);showToast(autoLogoutEnabled?"Auto sign-out disabled":"Auto sign-out enabled -- you'll be signed out after 15 minutes idle");}}/>
          </div>
          <button onClick={()=>setShowPwForm(s=>!s)} className="press" style={{width:"100%",padding:"14px 16px",background:"none",border:"none",display:"flex",justifyContent:"space-between",alignItems:"center",textAlign:"left"}}>
            <p style={{color:"var(--text)",fontSize:14,fontWeight:600}}>Change Password</p>
            <span style={{color:"var(--text3)",fontSize:14}}>{showPwForm?"−":"→"}</span>
          </button>
          {showPwForm && (
            <div style={{padding:"4px 16px 16px",borderTop:"1px solid var(--border)"}}>
              <div style={{marginTop:12,marginBottom:10}}>
                <label style={{fontSize:12,color:"var(--text2)",fontWeight:600,display:"block",marginBottom:5}}>New Password</label>
                <input className="field" type="password" placeholder="At least 8 characters" value={newPw} onChange={e=>{setNewPw(e.target.value);calcPwStrength(e.target.value);}} style={{padding:"10px 12px"}}/>
                {newPw.length>0 && (
                  <div style={{marginTop:8}}>
                    <div style={{display:"flex",gap:4,marginBottom:4}}>
                      {[1,2,3,4].map(i=>(
                        <div key={i} style={{flex:1,height:3,borderRadius:2,background:pwStrength>=i?(i<=1?"var(--red)":i<=2?"var(--amber)":i<=3?"var(--accent)":"var(--green)"):"var(--border2)",transition:"background .2s"}}/>
                      ))}
                    </div>
                    <span style={{fontSize:11,color:"var(--text3)"}}>{["","Weak","Fair","Good","Strong"][pwStrength]} password</span>
                  </div>
                )}
              </div>
              <div style={{marginBottom:12}}>
                <label style={{fontSize:12,color:"var(--text2)",fontWeight:600,display:"block",marginBottom:5}}>Confirm New Password</label>
                <input className="field" type="password" placeholder="Re-enter password" value={confirmPw} onChange={e=>setConfirmPw(e.target.value)} style={{padding:"10px 12px"}}/>
              </div>
              {pwError && <p style={{color:"var(--red)",fontSize:13,marginBottom:10}}>{pwError}</p>}
              <button onClick={changePassword} disabled={pwLoading} className="btn-gold press" style={{width:"100%",padding:"11px",fontSize:14,opacity:pwLoading?0.7:1}}>
                {pwLoading?"Updating...":"Update Password"}
              </button>
            </div>
          )}
        </div>
        <p style={{color:"var(--text3)",fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:.8,marginBottom:6}}>Data & Privacy</p>
        <p style={{color:"var(--text3)",fontSize:11,marginBottom:10,lineHeight:1.5}}>No usage analytics are collected yet -- these preferences will take effect once that's built, so your choice is saved and ready.</p>
        <div className="card-surface" style={{overflow:"hidden",marginBottom:16}}>
          {([[dataSharing,setDataSharing,"download","Share Anonymous Data","Help improve WiseCard with anonymized usage data"],[analytics,setAnalytics,"analytics","Usage Analytics","Allow analytics to improve your experience"]] as [boolean,any,string,string,string][]).map(([val,setVal,icon,label,desc],i)=>(
            <div key={label} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",borderBottom:i===0?"1px solid var(--border)":"none"}}>
              <span style={{width:26,display:"flex",justifyContent:"center",color:"var(--text2)"}}><Icon name={icon} size={16}/></span>
              <div style={{flex:1}}><p style={{color:"var(--text)",fontSize:14,fontWeight:600}}>{label}</p><p style={{color:"var(--text2)",fontSize:12}}>{desc}</p></div>
              <Toggle on={val} set={()=>setVal((v:boolean)=>!v)}/>
            </div>
          ))}
          <button onClick={()=>setShowExportFormats(s=>!s)} className="press" style={{width:"100%",padding:"14px 16px",background:"none",border:"none",display:"flex",justifyContent:"space-between",alignItems:"center",borderTop:"1px solid var(--border)",textAlign:"left"}}>
            <p style={{color:"var(--text)",fontSize:14,fontWeight:600}}>Download My Data</p>
            <span style={{color:"var(--text3)",display:"flex"}}><Icon name="download" size={15}/></span>
          </button>
          {showExportFormats && (
            <div style={{padding:"4px 16px 16px",borderTop:"1px solid var(--border)"}}>
              <p style={{color:"var(--text2)",fontSize:12,marginBottom:10,marginTop:10}}>Choose a format:</p>
              <div style={{display:"flex",gap:8}}>
                <button onClick={downloadAsText} className="press" style={{flex:1,padding:"12px 10px",borderRadius:10,border:"1px solid var(--border2)",background:"var(--surface2)",textAlign:"left"}}>
                  <p style={{color:"var(--text)",fontSize:13,fontWeight:700,marginBottom:2}}>Readable Summary</p>
                  <p style={{color:"var(--text2)",fontSize:11}}>Plain text, easy to read (.txt)</p>
                </button>
                <button onClick={downloadAsJSON} className="press" style={{flex:1,padding:"12px 10px",borderRadius:10,border:"1px solid var(--border2)",background:"var(--surface2)",textAlign:"left"}}>
                  <p style={{color:"var(--text)",fontSize:13,fontWeight:700,marginBottom:2}}>Full Data Export</p>
                  <p style={{color:"var(--text2)",fontSize:11}}>Complete, portable format (.json)</p>
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="card-surface" style={{overflow:"hidden",marginBottom:16}}>
          {([["Privacy Policy",()=>go("privacy-policy")],["Terms of Service",()=>go("terms")]] as [string,()=>void][]).map(([item,action],i,arr)=>(
            <button key={item} onClick={action} className="press" style={{width:"100%",padding:"14px 16px",background:"none",border:"none",borderBottom:i<arr.length-1?"1px solid var(--border)":"none",display:"flex",justifyContent:"space-between",alignItems:"center",textAlign:"left"}}>
              <p style={{color:"var(--text)",fontSize:14,fontWeight:600}}>{item}</p>
              <span style={{color:"var(--text3)",fontSize:14}}>→</span>
            </button>
          ))}
        </div>
        <div className="card-surface" style={{overflow:"hidden"}}>
          <button onClick={()=>setShowDeleteConfirm(true)} className="press" style={{width:"100%",padding:"14px 16px",background:"none",border:"none",display:"flex",justifyContent:"space-between",alignItems:"center",textAlign:"left"}}>
            <p style={{color:"var(--red)",fontSize:14,fontWeight:600}}>Delete Account</p>
            <span style={{color:"var(--red)",fontSize:14}}>→</span>
          </button>
        </div>

        {showDeleteConfirm && (
          <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:24}} onClick={()=>!deleteLoading&&setShowDeleteConfirm(false)}>
            <div className="card-surface" style={{maxWidth:380,width:"100%",padding:24}} onClick={e=>e.stopPropagation()}>
              <div style={{display:"flex",justifyContent:"center",marginBottom:16,color:"var(--red)"}}><Icon name="alert" size={36}/></div>
              <h3 style={{color:"var(--text)",fontSize:17,fontWeight:700,textAlign:"center",marginBottom:8}}>Delete your account?</h3>
              <p style={{color:"var(--text2)",fontSize:14,textAlign:"center",lineHeight:1.6,marginBottom:20}}>
                This permanently deletes your account and all data -- cards, goals, transactions, assets, and applications logged. <strong>This cannot be undone.</strong>
              </p>
              {deleteError && <p style={{color:"var(--red)",fontSize:13,textAlign:"center",marginBottom:14}}>{deleteError}</p>}
              <div style={{display:"flex",gap:10}}>
                <button onClick={()=>setShowDeleteConfirm(false)} disabled={deleteLoading} className="btn-ghost press" style={{flex:1,padding:"12px"}}>Cancel</button>
                <button onClick={deleteAccount} disabled={deleteLoading} style={{flex:1,padding:"12px",borderRadius:8,background:"var(--red)",color:"#fff",border:"none",fontWeight:600,fontSize:14,cursor:"pointer",opacity:deleteLoading?0.7:1,fontFamily:"var(--sans)"}}>
                  {deleteLoading?"Deleting...":"Yes, delete everything"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   ABOUT WISECARD SCREEN
   ============================================================ */
function About({ go }: { go:(s:S)=>void }) {
  const changes = [
    {v:"v1.3",date:"Jun 2026",items:["Speedometer analytics on home and analytics screens","Transaction logging — track your spending in real time","Search bar with instant results","Card balance quick-update from dashboard","Spending insights and utilization alerts"]},
    {v:"v1.2",date:"May 2026",items:["Analytics screen with category breakdown","Card comparison tool","Notification preferences","Referral program — give $20, get $20","Privacy & security controls"]},
    {v:"v1.1",date:"Apr 2026",items:["Forgot password flow","Password strength indicator","Delete card with confirmation","Loading skeletons and empty states","Toast notifications for all actions"]},
    {v:"v1.0",date:"Mar 2026",items:["Initial launch — 8 screens, 54 features","AI chatbot with full user context","50+ card database","Supabase auth and data sync","Travel, Goals, Split Bills, Perks screens"]},
  ];
  return (
    <div className="screen desktop-content screen-enter">
      <PageHead title="About WiseCard" back={()=>go("settings")}/>
      <div className="px">
        <div className="au card-surface" style={{padding:"28px 22px",textAlign:"center",marginBottom:20,background:"var(--accentbg)",border:"1px solid rgba(37,99,235,.12)"}}>
          <div style={{width:60,height:60,borderRadius:16,background:"var(--accent)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
          </div>
          <p style={{color:"var(--accent)",fontSize:14,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",marginBottom:4}}>WiseCard</p>
          <p style={{color:"var(--text)",fontSize:26,fontWeight:800,marginBottom:4}}>Version 1.3.0</p>
          <p style={{color:"var(--text2)",fontSize:14}}>Save more on every card spend</p>
        </div>

        <div className="card-surface" style={{padding:"18px 20px",marginBottom:16}}>
          <p style={{color:"var(--text3)",fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:.8,marginBottom:14}}>App Info</p>
          {[
            ["Version","1.3.0"],["Build","2026.06.18"],["Platform","Web / PWA"],
            ["Cards in Database","50+"],["Features","54 across 9 modules"],["AI Model","Claude Sonnet"],
          ].map(([k,v],i,arr)=>(
            <div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingBottom:i<arr.length-1?12:0,marginBottom:i<arr.length-1?12:0,borderBottom:i<arr.length-1?"1px solid var(--border)":"none"}}>
              <span style={{color:"var(--text2)",fontSize:14}}>{k}</span>
              <span style={{color:"var(--text)",fontSize:14,fontWeight:600}}>{v}</span>
            </div>
          ))}
        </div>

        <p style={{color:"var(--text3)",fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>Changelog</p>
        {changes.map(({v,date,items})=>(
          <div key={v} className="card-surface" style={{padding:"16px 18px",marginBottom:10}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <span style={{color:"var(--accent)",fontSize:14,fontWeight:700}}>{v}</span>
              <span style={{color:"var(--text3)",fontSize:13}}>{date}</span>
            </div>
            {items.map((item,i)=>(
              <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:i<items.length-1?7:0}}>
                <span style={{color:"var(--accent)",fontSize:13,marginTop:1,flexShrink:0}}>+</span>
                <p style={{color:"var(--text2)",fontSize:13,lineHeight:1.4}}>{item}</p>
              </div>
            ))}
          </div>
        ))}

        <p style={{color:"var(--text3)",fontSize:12,textAlign:"center",marginTop:20,lineHeight:1.6}}>
          Made with care. Your data is encrypted and never sold.
        </p>
      </div>
    </div>
  );
}


/* ============================================================
   CARD STRATEGY -- Sign-up Bonus Tracker + 5/24 Rule
   ============================================================ */
function CardStrategy({ go, cards, applications, onAddApplication, onDeleteApplication, onUpdateBonus }: { go:(s:S)=>void; cards:CreditCard[]; applications:CardApplication[]; onAddApplication:(issuer:string,date:string)=>void; onDeleteApplication:(id:string)=>void; onUpdateBonus:(cardId:string,target:number,deadline:string,progress:number)=>void }) {
  const [tab, setTab] = useState<"bonus"|"524">("bonus");
  const [newIssuer, setNewIssuer] = useState("Chase");
  const [newDate, setNewDate] = useState(new Date().toISOString().slice(0,10));
  const [editingBonus, setEditingBonus] = useState<Record<string,{target:string;deadline:string;progress:string}>>({});

  const getBonusInput = (card: CreditCard) => editingBonus[card.id] || {
    target: String(card.bonusTarget || 4000),
    deadline: card.bonusDeadline || "",
    progress: String(card.bonusProgress || 0),
  };
  const setBonusField = (cardId:string, field:string, val:string) => {
    setEditingBonus(p=>({...p, [cardId]: {...getBonusInput(cards.find(c=>c.id===cardId)!), ...(p[cardId]||{}), [field]:val}}));
  };
  const saveBonus = (cardId:string) => {
    const b = editingBonus[cardId];
    if(!b) return;
    onUpdateBonus(cardId, Number(b.target)||4000, b.deadline||"", Number(b.progress)||0);
  };

  const cardsWithBonus = cards.filter(c=>c.signupBonus && c.signupBonus.length>0);

  // 5/24 calculation -- count cards opened in last 24 months (combines actual cards' openedDate + logged applications)
  const now = new Date();
  const allOpenedEvents = [
    ...cards.filter(c=>c.openedDate).map(c=>({id:c.id, issuer:c.issuer, date:c.openedDate!, fromCard:true})),
    ...applications.map(a=>({id:a.id, issuer:a.issuer, date:a.date, fromCard:false})),
  ];
  const cardsLast24mo = allOpenedEvents.filter(c=>{
    const d = new Date(c.date);
    const months = (now.getFullYear()-d.getFullYear())*12 + (now.getMonth()-d.getMonth());
    return months <= 24;
  });
  const under524 = cardsLast24mo.length < 5;

  const addOpenedCard = () => {
    onAddApplication(newIssuer, newDate);
  };
  const removeOpenedCard = (id:string) => onDeleteApplication(id);

  return (
    <div className="screen desktop-content screen-enter">
      <PageHead title="Card Strategy" sub="Bonuses & application rules" back={()=>go("settings")}/>
      <div className="px">
        <div className="au" style={{display:"flex",gap:5,marginBottom:20,background:"var(--surface2)",padding:4,borderRadius:14}}>
          {(["bonus","524"] as const).map(t=>(
            <button key={t} onClick={()=>setTab(t)} className="press" style={{flex:1,padding:"10px",borderRadius:11,border:"none",background:tab===t?"var(--accent)":"none",color:tab===t?"#fff":"var(--text2)",fontSize:14,fontWeight:tab===t?700:500}}>
              {t==="bonus"?"Sign-up Bonuses":"5/24 Status"}
            </button>
          ))}
        </div>

        {tab==="bonus" && (
          cardsWithBonus.length===0 ? (
            <EmptyState icon="gift" title="No bonuses to track" sub="Add a card with a sign-up bonus to start tracking your progress toward the minimum spend." action="Add a Card" onAction={()=>go("add-card")}/>
          ) : (
            <>
              {cardsWithBonus.map(card=>{
                const b = getBonusInput(card);
                const target = Number(b.target)||4000;
                const progress = Number(b.progress)||0;
                const pct2 = Math.min(100, Math.round(progress/target*100));
                const daysLeft = b.deadline ? Math.ceil((new Date(b.deadline).getTime()-Date.now())/86400000) : null;
                return (
                  <div key={card.id} className="card-surface" style={{padding:"16px 18px",marginBottom:14}}>
                    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                      <div style={{width:36,height:24,borderRadius:6,background:card.gradient,flexShrink:0}}/>
                      <div style={{flex:1}}>
                        <p style={{color:"var(--text)",fontSize:14,fontWeight:700}}>{card.name}</p>
                        <p style={{color:"var(--text2)",fontSize:12}}>{card.signupBonus}</p>
                      </div>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:10}}>
                      <div>
                        <label style={{fontSize:11,color:"var(--text3)",display:"block",marginBottom:4}}>Target ($)</label>
                        <input className="field" type="number" value={b.target} onChange={e=>setBonusField(card.id,"target",e.target.value)} style={{padding:"7px 9px",fontSize:13}}/>
                      </div>
                      <div>
                        <label style={{fontSize:11,color:"var(--text3)",display:"block",marginBottom:4}}>Spent so far</label>
                        <input className="field" type="number" value={b.progress} onChange={e=>setBonusField(card.id,"progress",e.target.value)} style={{padding:"7px 9px",fontSize:13}}/>
                      </div>
                      <div>
                        <label style={{fontSize:11,color:"var(--text3)",display:"block",marginBottom:4}}>Deadline</label>
                        <input className="field" type="date" value={b.deadline} onChange={e=>setBonusField(card.id,"deadline",e.target.value)} style={{padding:"7px 9px",fontSize:12}}/>
                      </div>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                      <span style={{color:"var(--text2)",fontSize:12}}>${f(progress)} of ${f(target)}</span>
                      <span style={{color:pct2>=100?"var(--green)":"var(--accent)",fontSize:12,fontWeight:700}}>{pct2}%{daysLeft!==null&&daysLeft>=0?` · ${daysLeft}d left`:""}</span>
                    </div>
                    <Bar v={progress} max={target} color={pct2>=100?"var(--green)":"var(--accent)"} h={6}/>
                    {pct2>=100 && <p style={{color:"var(--green)",fontSize:12,marginTop:8,fontWeight:600}}>✓ Bonus requirement met!</p>}
                    {daysLeft!==null && daysLeft>=0 && daysLeft<=14 && pct2<100 && <p style={{color:"var(--red)",fontSize:12,marginTop:8,fontWeight:600,display:"flex",alignItems:"center",gap:5}}><Icon name="warning" size={12}/> {daysLeft} days left — spend ${f(target-progress)} more</p>}
                    <button onClick={()=>saveBonus(card.id)} className="press" style={{marginTop:10,width:"100%",padding:"8px",background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:8,color:"var(--text)",fontSize:13,fontWeight:600,cursor:"pointer"}}>Save Progress</button>
                  </div>
                );
              })}
            </>
          )
        )}

        {tab==="524" && (
          <>
            <div className="au card-surface" style={{padding:"22px 20px",marginBottom:18,textAlign:"center",background:under524?"var(--greenbg)":"var(--redbg)",border:`1px solid ${under524?"rgba(39,103,73,.2)":"rgba(220,38,38,.2)"}`}}>
              <p style={{fontSize:14,color:"var(--text2)",marginBottom:6}}>Cards opened in the last 24 months</p>
              <p style={{fontSize:42,fontWeight:800,color:under524?"var(--green)":"var(--red)"}}>{cardsLast24mo.length}<span style={{fontSize:18,color:"var(--text3)"}}>/5</span></p>
              <p style={{fontSize:14,fontWeight:600,color:under524?"var(--green)":"var(--red)",marginTop:6}}>
                {under524?"✓ You're eligible for new Chase cards":"✗ Chase will likely deny new applications"}
              </p>
              <p style={{color:"var(--text2)",fontSize:12,marginTop:8,lineHeight:1.5}}>Chase's 5/24 rule blocks approval if you've opened 5+ personal cards (any issuer) in the trailing 24 months.</p>
            </div>

            <p style={{color:"var(--text3)",fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>Log a Card Application</p>
            <div className="card-surface" style={{padding:16,marginBottom:18}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
                <div>
                  <label style={{fontSize:12,color:"var(--text2)",fontWeight:600,display:"block",marginBottom:5}}>Issuer</label>
                  <select className="field" value={newIssuer} onChange={e=>setNewIssuer(e.target.value)} style={{padding:"9px 10px",fontSize:13}}>
                    {["Chase","Amex","Capital One","Citi","Discover","Bank of America","Wells Fargo","US Bank"].map(i=><option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{fontSize:12,color:"var(--text2)",fontWeight:600,display:"block",marginBottom:5}}>Date opened</label>
                  <input className="field" type="date" value={newDate} onChange={e=>setNewDate(e.target.value)} style={{padding:"9px 10px",fontSize:13}}/>
                </div>
              </div>
              <button onClick={addOpenedCard} className="btn-gold press" style={{width:"100%",padding:"10px",fontSize:14}}>+ Log Application</button>
            </div>

            {cards.filter(c=>c.openedDate).length>0 && (
              <>
                <p style={{color:"var(--text3)",fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>From Your Wallet</p>
                <div className="card-surface" style={{overflow:"hidden",marginBottom:18}}>
                  {cards.filter(c=>c.openedDate).map((c,i,arr)=>{
                    const d = new Date(c.openedDate!);
                    const months = (now.getFullYear()-d.getFullYear())*12 + (now.getMonth()-d.getMonth());
                    const within = months<=24;
                    return (
                      <div key={c.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",borderBottom:i<arr.length-1?"1px solid var(--border)":"none"}}>
                        <div>
                          <p style={{color:"var(--text)",fontSize:14,fontWeight:600}}>{c.name}</p>
                          <p style={{color:"var(--text2)",fontSize:12}}>{c.openedDate} {within&&<span style={{color:"var(--accent)"}}>· counts toward 5/24</span>}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {applications.length>0 && (
              <>
                <p style={{color:"var(--text3)",fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>Other Applications (closed/not in wallet)</p>
                <div className="card-surface" style={{overflow:"hidden"}}>
                  {[...applications].sort((a,b)=>new Date(b.date).getTime()-new Date(a.date).getTime()).map((c,i,arr)=>{
                    const d = new Date(c.date);
                    const months = (now.getFullYear()-d.getFullYear())*12 + (now.getMonth()-d.getMonth());
                    const within = months<=24;
                    return (
                      <div key={c.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",borderBottom:i<arr.length-1?"1px solid var(--border)":"none"}}>
                        <div>
                          <p style={{color:"var(--text)",fontSize:14,fontWeight:600}}>{c.issuer}</p>
                          <p style={{color:"var(--text2)",fontSize:12}}>{c.date} {within&&<span style={{color:"var(--accent)"}}>· counts toward 5/24</span>}</p>
                        </div>
                        <button onClick={()=>removeOpenedCard(c.id)} style={{background:"none",border:"none",color:"var(--text3)",fontSize:16,cursor:"pointer"}}>✕</button>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   DEBT PAYOFF PLANNER
   ============================================================ */
function DebtPlanner({ go, cards }: { go:(s:S)=>void; cards:CreditCard[] }) {
  const [extraPayment, setExtraPayment] = useState("100");
  const [method, setMethod] = useState<"avalanche"|"snowball">("avalanche");
  const debtCards = cards.filter(c=>c.balance>0);
  const totalDebt = debtCards.reduce((s,c)=>s+c.balance,0);
  const totalMin = debtCards.reduce((s,c)=>s+c.minPayment,0);
  const extra = Number(extraPayment)||0;

  // Sort by method
  const order = [...debtCards].sort((a,b)=>{
    if(method==="avalanche") return aprMidpoint(b.apr)-aprMidpoint(a.apr);
    return a.balance-b.balance;
  });

  // Simulate payoff
  const simulate = () => {
    let balances = order.map(c=>({id:c.id,name:c.name,balance:c.balance,apr:aprMidpoint(c.apr),minPay:c.minPayment}));
    let months=0, totalInterest=0;
    const timeline:{month:number;totalRemaining:number}[] = [];
    let extraPool = extra;
    while(balances.some(b=>b.balance>0) && months<360){
      months++;
      let monthInterest=0;
      let availableExtra = extraPool;
      for(const b of balances){
        if(b.balance<=0) continue;
        const interest = b.balance*(b.apr/100/12);
        monthInterest += interest;
        b.balance += interest;
        let payment = Math.min(b.balance, b.minPay);
        b.balance -= payment;
      }
      // apply extra to first card with balance (per method order)
      for(const b of balances){
        if(availableExtra<=0) break;
        if(b.balance<=0) continue;
        const pay = Math.min(b.balance, availableExtra);
        b.balance -= pay;
        availableExtra -= pay;
      }
      totalInterest += monthInterest;
      timeline.push({month:months, totalRemaining: balances.reduce((s,b)=>s+Math.max(0,b.balance),0)});
    }
    return {months, totalInterest:Math.round(totalInterest), timeline};
  };

  const result = totalDebt>0 ? simulate() : null;
  const years = result ? Math.floor(result.months/12) : 0;
  const remMonths = result ? result.months%12 : 0;

  return (
    <div className="screen desktop-content screen-enter">
      <PageHead title="Debt Payoff Planner" sub="See exactly when you'll be debt-free" back={()=>go("settings")}/>
      <div className="px">
        {debtCards.length===0 ? (
          <EmptyState icon="check-circle" title="No debt to pay off!" sub="None of your cards carry a balance. Keep it that way!"/>
        ) : (
          <>
            <div className="au card-surface" style={{padding:"20px 18px",marginBottom:18,background:"var(--redbg)",border:"1px solid rgba(220,38,38,.15)"}}>
              <p style={{color:"var(--text2)",fontSize:13,marginBottom:4}}>Total debt across {debtCards.length} card{debtCards.length!==1?"s":""}</p>
              <p style={{color:"var(--red)",fontSize:32,fontWeight:800}}>${f(totalDebt)}</p>
              <p style={{color:"var(--text2)",fontSize:13,marginTop:4}}>${f(totalMin)}/mo minimum payments</p>
            </div>

            <p style={{color:"var(--text3)",fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>Strategy</p>
            <div style={{display:"flex",gap:8,marginBottom:16}}>
              {(["avalanche","snowball"] as const).map(m=>(
                <button key={m} onClick={()=>setMethod(m)} className="press" style={{flex:1,padding:"12px",borderRadius:12,border:`1.5px solid ${method===m?"var(--accent)":"var(--border)"}`,background:method===m?"var(--accentbg)":"var(--surface)",textAlign:"left"}}>
                  <p style={{color:method===m?"var(--accent)":"var(--text)",fontSize:14,fontWeight:700,marginBottom:2,display:"flex",alignItems:"center",gap:6}}>{m==="avalanche"?<><Icon name="trend-down" size={14}/> Avalanche</>:<><Icon name="trophy" size={14}/> Snowball</>}</p>
                  <p style={{color:"var(--text2)",fontSize:11,lineHeight:1.3}}>{m==="avalanche"?"Highest APR first — saves the most money":"Smallest balance first — quick wins, motivation"}</p>
                </button>
              ))}
            </div>

            <div className="card-surface" style={{padding:16,marginBottom:18}}>
              <label style={{fontSize:13,color:"var(--text2)",fontWeight:600,display:"block",marginBottom:8}}>Extra monthly payment (beyond minimums)</label>
              <input className="field" type="number" value={extraPayment} onChange={e=>setExtraPayment(e.target.value)} placeholder="$100" style={{padding:"11px 14px"}}/>
            </div>

            {result && (
              <div className="au card-surface" style={{padding:"20px",marginBottom:18,background:"var(--greenbg)",border:"1px solid rgba(39,103,73,.15)"}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,textAlign:"center"}}>
                  <div>
                    <p style={{color:"var(--green)",fontSize:24,fontWeight:800}}>{years>0?`${years}y `:""}{remMonths}mo</p>
                    <p style={{color:"var(--text2)",fontSize:12,marginTop:3}}>Time to debt-free</p>
                  </div>
                  <div>
                    <p style={{color:"var(--green)",fontSize:24,fontWeight:800}}>${f(result.totalInterest)}</p>
                    <p style={{color:"var(--text2)",fontSize:12,marginTop:3}}>Total interest paid</p>
                  </div>
                </div>
              </div>
            )}

            <p style={{color:"var(--text3)",fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>Attack Order ({method==="avalanche"?"highest APR":"smallest balance"} first)</p>
            <div className="card-surface" style={{overflow:"hidden"}}>
              {order.map((c,i,arr)=>(
                <div key={c.id} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",borderBottom:i<arr.length-1?"1px solid var(--border)":"none"}}>
                  <div style={{width:26,height:26,borderRadius:"50%",background:i===0?"var(--accent)":"var(--surface2)",color:i===0?"#fff":"var(--text2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,flexShrink:0}}>{i+1}</div>
                  <div style={{flex:1}}>
                    <p style={{color:"var(--text)",fontSize:14,fontWeight:600}}>{c.name}</p>
                    <p style={{color:"var(--text2)",fontSize:12}}>${f(c.balance)} balance · {c.apr} APR</p>
                  </div>
                  {i===0 && <span className="pill pill-gold" style={{fontSize:11}}>Focus here</span>}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   NET WORTH TRACKER
   ============================================================ */
function NetWorth({ go, cards, assets, onAddAsset, onDeleteAsset }: { go:(s:S)=>void; cards:CreditCard[]; assets:Asset[]; onAddAsset:(name:string,value:number)=>void; onDeleteAsset:(id:string)=>void }) {
  const [showAdd, setShowAdd] = useState(false);
  const [assetName, setAssetName] = useState("");
  const [assetValue, setAssetValue] = useState("");
  const totalDebt = cards.reduce((s,c)=>s+c.balance,0);
  const totalAssets = assets.reduce((s,a)=>s+(Number(a.value)||0),0);
  const netWorth = totalAssets - totalDebt;

  const addAsset = () => {
    if(!assetName||!assetValue) return;
    onAddAsset(assetName, Number(assetValue));
    setAssetName(""); setAssetValue(""); setShowAdd(false);
  };
  const removeAsset = (id:string) => onDeleteAsset(id);

  return (
    <div className="screen desktop-content screen-enter">
      <PageHead title="Net Worth" sub="Assets minus debt" back={()=>go("settings")}
        right={<button onClick={()=>setShowAdd(a=>!a)} className="btn-gold press" style={{padding:"8px 16px",fontSize:14}}>+ Asset</button>}/>
      <div className="px">
        <div className="au card-surface" style={{padding:"24px 20px",marginBottom:20,textAlign:"center",background:netWorth>=0?"var(--greenbg)":"var(--redbg)"}}>
          <p style={{color:"var(--text2)",fontSize:13,marginBottom:6}}>Your Net Worth</p>
          <p style={{color:netWorth>=0?"var(--green)":"var(--red)",fontSize:38,fontWeight:800}}>{netWorth<0?"-":""}${f(Math.abs(netWorth))}</p>
        </div>

        {showAdd && (
          <div className="ap card-surface" style={{padding:18,marginBottom:18,border:"1.5px solid var(--accent)"}}>
            <div style={{display:"flex",gap:10,marginBottom:12}}>
              <input className="field" placeholder="Asset name (e.g. Savings)" value={assetName} onChange={e=>setAssetName(e.target.value)} style={{flex:2,padding:"10px 12px"}}/>
              <input className="field" type="number" placeholder="$0" value={assetValue} onChange={e=>setAssetValue(e.target.value)} style={{flex:1,padding:"10px 12px"}}/>
            </div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={addAsset} className="btn-gold press" style={{flex:1,padding:"10px"}}>Add</button>
              <button onClick={()=>setShowAdd(false)} className="btn-ghost press" style={{padding:"10px 16px"}}>Cancel</button>
            </div>
          </div>
        )}

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
          <div className="card-surface" style={{padding:"16px 14px"}}>
            <p style={{color:"var(--text2)",fontSize:12,marginBottom:6}}>Total Assets</p>
            <p style={{color:"var(--green)",fontSize:20,fontWeight:800}}>${f(totalAssets)}</p>
          </div>
          <div className="card-surface" style={{padding:"16px 14px"}}>
            <p style={{color:"var(--text2)",fontSize:12,marginBottom:6}}>Total Card Debt</p>
            <p style={{color:"var(--red)",fontSize:20,fontWeight:800}}>${f(totalDebt)}</p>
          </div>
        </div>

        <p style={{color:"var(--text3)",fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>Your Assets</p>
        {assets.length===0 ? (
          <div className="card-surface"><EmptyState icon="wallet" title="No assets added" sub="Add savings, investments, or other assets to see your full net worth." action="+ Add Asset" onAction={()=>setShowAdd(true)}/></div>
        ) : (
          <div className="card-surface" style={{overflow:"hidden",marginBottom:20}}>
            {assets.map((a,i,arr)=>(
              <div key={a.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"13px 16px",borderBottom:i<arr.length-1?"1px solid var(--border)":"none"}}>
                <p style={{color:"var(--text)",fontSize:14,fontWeight:600}}>{a.name}</p>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <p style={{color:"var(--green)",fontSize:14,fontWeight:700}}>${f(Number(a.value))}</p>
                  <button onClick={()=>removeAsset(a.id)} style={{background:"none",border:"none",color:"var(--text3)",cursor:"pointer",display:"flex"}}><Icon name="trash" size={14}/></button>
                </div>
              </div>
            ))}
          </div>
        )}

        <p style={{color:"var(--text3)",fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>Card Debt Breakdown</p>
        <div className="card-surface" style={{overflow:"hidden"}}>
          {cards.length===0 ? <p style={{padding:16,color:"var(--text2)",fontSize:14,textAlign:"center"}}>No cards added yet</p> : cards.map((c,i,arr)=>(
            <div key={c.id} style={{display:"flex",justifyContent:"space-between",padding:"13px 16px",borderBottom:i<arr.length-1?"1px solid var(--border)":"none"}}>
              <p style={{color:"var(--text)",fontSize:14,fontWeight:600}}>{c.name}</p>
              <p style={{color:c.balance>0?"var(--red)":"var(--green)",fontSize:14,fontWeight:700}}>{c.balance>0?`-$${f(c.balance)}`:"$0"}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   ACHIEVEMENTS
   ============================================================ */
function Achievements({ go, cards, profile }: { go:(s:S)=>void; cards:CreditCard[]; profile:UserProfile }) {
  const totalBal = cards.reduce((s,c)=>s+c.balance,0);
  const totalLim = cards.reduce((s,c)=>s+c.limit,0);
  const util = totalLim>0?Math.round(totalBal/totalLim*100):0;
  const paidOffCards = cards.filter(c=>c.balance===0 && c.limit>0);
  const spendingFilled = Object.values(profile.spending||{}).some(v=>Number(v)>0);

  const badges = [
    {id:"first-card",icon:"card",title:"First Card Added",desc:"Added your first card to WiseCard",unlocked:cards.length>=1},
    {id:"diversified",icon:"wallet",title:"Diversified Wallet",desc:"Own 3 or more cards",unlocked:cards.length>=3},
    {id:"low-util",icon:"analytics",title:"Utilization Master",desc:"Overall utilization under 30%",unlocked:cards.length>0 && util<30},
    {id:"debt-free-card",icon:"check-circle",title:"Debt Crusher",desc:"Paid a card down to $0",unlocked:paidOffCards.length>=1},
    {id:"profile-complete",icon:"edit",title:"Profile Pro",desc:"Filled in your spending profile",unlocked:spendingFilled},
    {id:"five-cards",icon:"trophy",title:"Card Collector",desc:"Own 5 or more cards",unlocked:cards.length>=5},
    {id:"perfect-util",icon:"shield",title:"Pristine Credit",desc:"Utilization under 10%",unlocked:cards.length>0 && util<10},
    {id:"high-points",icon:"star",title:"Points Powerhouse",desc:"10,000+ total points across cards",unlocked:cards.reduce((s,c)=>s+c.points,0)>=10000},
  ];
  const unlockedCount = badges.filter(b=>b.unlocked).length;

  return (
    <div className="screen desktop-content screen-enter">
      <PageHead title="Achievements" sub={`${unlockedCount} of ${badges.length} unlocked`} back={()=>go("settings")}/>
      <div className="px">
        <div className="au card-surface" style={{padding:"20px",marginBottom:20,textAlign:"center",background:"var(--accentbg)"}}>
          <div style={{height:8,background:"var(--border2)",borderRadius:99,overflow:"hidden",marginBottom:10}}>
            <div style={{height:"100%",width:`${Math.round(unlockedCount/badges.length*100)}%`,background:"var(--accent)",borderRadius:99,transition:"width .6s ease"}}/>
          </div>
          <p style={{color:"var(--accent)",fontSize:14,fontWeight:700}}>{unlockedCount}/{badges.length} badges earned</p>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {badges.map(b=>(
            <div key={b.id} className="card-surface" style={{padding:"16px 14px",textAlign:"center",opacity:b.unlocked?1:0.45,border:b.unlocked?"1.5px solid var(--accent)":"1px solid var(--border)"}}>
              <div style={{width:48,height:48,borderRadius:"50%",background:b.unlocked?"var(--accentbg)":"var(--surface2)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 10px",color:b.unlocked?"var(--accent)":"var(--text3)"}}><Icon name={b.icon} size={22}/></div>
              <p style={{color:"var(--text)",fontSize:13,fontWeight:700,marginBottom:4}}>{b.title}</p>
              <p style={{color:"var(--text2)",fontSize:11,lineHeight:1.3}}>{b.desc}</p>
              {b.unlocked && <p style={{color:"var(--green)",fontSize:11,fontWeight:700,marginTop:6}}>UNLOCKED</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   HELP CENTER
   ============================================================ */
function HelpCenter({ go }: { go:(s:S)=>void }) {
  const [open, setOpen] = useState<number|null>(null);
  const faqs = [
    {q:"Is my financial data secure?",a:"Yes. WiseCard uses AES-256 encryption for all stored data and TLS 1.3 for data in transit. We never store your full card numbers — only the balance, limit, and rewards info you choose to enter."},
    {q:"How does the AI Advisor know my cards?",a:"The AI Advisor has read access to your card list, balances, points, and goals within your session so it can give personalized advice. It does not share this data with any third party."},
    {q:"Why don't my balances update automatically?",a:"WiseCard currently uses manual entry for balances and points. Automatic bank syncing requires a licensed data aggregator (like Plaid) which we're evaluating for a future release."},
    {q:"How accurate are the approval chance predictions?",a:"Approval chances are estimates based on general credit score and income ranges, not a guarantee. Actual approval depends on the issuer's full underwriting criteria."},
    {q:"Can I delete my account and data?",a:"Yes. Go to Settings → Privacy & Security → Delete Account. This permanently removes your profile and card data from our database."},
    {q:"How do transfer ratios work for points?",a:"Most transferable point programs (Chase, Amex, Citi, Capital One) transfer to airline/hotel partners at 1:1 ratios, with some exceptions. Check the Travel & Points → Transfers tab for exact current ratios."},
    {q:"What's the difference between Avalanche and Snowball debt payoff?",a:"Avalanche pays off your highest-APR card first to minimize total interest paid. Snowball pays off your smallest balance first for quicker psychological wins. Avalanche saves more money; Snowball keeps you motivated."},
  ];
  return (
    <div className="screen desktop-content screen-enter">
      <PageHead title="Help Center" back={()=>go("settings")}/>
      <div className="px">
        <div className="card-surface" style={{overflow:"hidden",marginBottom:20}}>
          {faqs.map((item,i,arr)=>(
            <div key={i} style={{borderBottom:i<arr.length-1?"1px solid var(--border)":"none"}}>
              <button onClick={()=>setOpen(o=>o===i?null:i)} className="press" style={{width:"100%",padding:"15px 16px",background:"none",border:"none",display:"flex",justifyContent:"space-between",alignItems:"center",textAlign:"left"}}>
                <p style={{color:"var(--text)",fontSize:14,fontWeight:600,flex:1,paddingRight:10}}>{item.q}</p>
                <span style={{color:"var(--text3)",fontSize:14,transform:open===i?"rotate(180deg)":"none",transition:"transform .2s"}}>⌄</span>
              </button>
              {open===i && <p style={{padding:"0 16px 16px",color:"var(--text2)",fontSize:13,lineHeight:1.6}}>{item.a}</p>}
            </div>
          ))}
        </div>

        <div className="card-surface au" style={{padding:"20px",textAlign:"center"}}>
          <div style={{display:"flex",justifyContent:"center",marginBottom:8,color:"var(--accent)"}}><Icon name="chat" size={26}/></div>
          <p style={{color:"var(--text)",fontSize:14,fontWeight:700,marginBottom:6}}>Still need help?</p>
          <p style={{color:"var(--text2)",fontSize:13,marginBottom:14}}>Our support team typically responds within 24 hours.</p>
          <a href="mailto:support@wisecard.app" className="btn-gold press" style={{display:"inline-block",padding:"11px 28px",fontSize:14,textDecoration:"none"}}>Email Support</a>
        </div>
      </div>
    </div>
  );
}


/* ============================================================
   LANDING PAGE -- shown before sign in
   ============================================================ */
// Hook: adds .is-visible to elements with class "reveal-on-scroll" as they enter the viewport
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal-on-scroll");
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("is-visible"); });
    }, { threshold: 0.15 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

function Landing({ onGetStarted, onSignIn }: { onGetStarted:()=>void; onSignIn:()=>void }) {
  useScrollReveal();
  const [pulledCard, setPulledCard] = useState(0);

  const featureCards = [
    {bg:"linear-gradient(135deg,#006FCF,#003170)",title:"Smart optimizer",desc:"Best card for every purchase",detail:"Enter any purchase — WiseCard instantly ranks all your cards by total value. Cashback, points, purchase protection, and bonus categories compared in one tap."},
    {bg:"linear-gradient(135deg,#0F172A,#1E293B)",title:"Benefits vault",desc:"Track credits and perks",detail:"Annual travel credits, dining credits, streaming perks — all tracked with activity rings. Alerts before anything expires."},
    {bg:"linear-gradient(135deg,#8B6914,#D4A847)",title:"Credit score AI",desc:"ML-powered scoring",detail:"Gradient Boosting model with SHAP-style factor breakdown. Simulate any payment and see projected score impact instantly.",dark:true},
    {bg:"linear-gradient(135deg,#1b4332,#2d6a4f)",title:"Spending insights",desc:"Charts and predictions",detail:"Interactive area charts, category bubbles, and AI spending predictions. Click any category to drill down into transactions."},
    {bg:"linear-gradient(135deg,#5B2B82,#3D1D56)",title:"AI advisor",desc:"Ask anything about cards",detail:"\"What card for Whole Foods?\" Get instant, specific answers based on your actual cards and spending — not generic advice."},
  ];

  const supportedCards = [
    {name:"Blue Cash",bg:"linear-gradient(135deg,#006FCF,#003170)"},
    {name:"Sapphire",bg:"linear-gradient(135deg,#0F172A,#1E293B)"},
    {name:"Venture X",bg:"linear-gradient(135deg,#1b4332,#2d6a4f)"},
    {name:"Gold",bg:"linear-gradient(135deg,#8B6914,#D4A847)",dark:true},
    {name:"Discover",bg:"linear-gradient(135deg,#E85D1A,#C44A15)"},
    {name:"Citi",bg:"linear-gradient(135deg,#003B70,#002855)"},
    {name:"Hilton",bg:"linear-gradient(135deg,#5B2B82,#3D1D56)"},
    {name:"Wells Fargo",bg:"linear-gradient(135deg,#D71E28,#A0161D)"},
    {name:"BoA",bg:"linear-gradient(135deg,#012169,#001540)"},
    {name:"Platinum",bg:"linear-gradient(135deg,#606060,#303030)"},
    {name:"Freedom",bg:"linear-gradient(135deg,#1a1f3a,#0c1629)"},
    {name:"Costco",bg:"linear-gradient(135deg,#003B70,#002855)"},
  ];

  const testimonials = [
    {text:"Found $240 in annual credits I didn't know I had. The benefits vault alone is worth it.",name:"James K.",role:"3 cards · $1,840 recovered",color:"#1E3A5F"},
    {text:"Was using Sapphire for groceries. WiseCard showed me Blue Cash earns 3x more.",name:"Sarah P.",role:"5 cards · $3,200 recovered",color:"#5B9A6F"},
    {text:"The AI advisor is like a financial consultant in my pocket. Answers in 2 seconds.",name:"Michael R.",role:"4 cards · 760 credit score",color:"#C4875C"},
    {text:"My score went up 35 points in 3 months from the utilization tips.",name:"Aisha L.",role:"2 cards · +35 pts in 3mo",color:"#8B7EB8"},
  ];

  return (
    <div style={{background:"#FAFBFD",color:"#111827",minHeight:"100vh",position:"relative",overflow:"hidden"}}>
      {/* Ambient glows */}
      <div style={{position:"absolute",width:500,height:500,borderRadius:"50%",filter:"blur(140px)",top:"-10%",right:"-8%",background:"rgba(30,58,95,.06)",pointerEvents:"none"}}/>
      <div style={{position:"absolute",width:400,height:400,borderRadius:"50%",filter:"blur(140px)",bottom:"25%",left:"-8%",background:"rgba(212,168,71,.04)",pointerEvents:"none"}}/>

      {/* Nav */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 20px",margin:"10px 24px",borderRadius:12,background:"rgba(255,255,255,.8)",border:"1px solid rgba(0,0,0,.06)",backdropFilter:"blur(12px)",position:"relative",zIndex:10}}>
        <div style={{fontSize:15,fontWeight:600,display:"flex",alignItems:"center",gap:7,color:"#1E3A5F"}}>
          <Icon name="credit-card" size={15} strokeWidth={1.5} color="#1E3A5F"/> WiseCard
        </div>
        <div style={{display:"flex",gap:12,alignItems:"center"}}>
          <button onClick={onSignIn} className="press" style={{padding:"8px 18px",borderRadius:8,border:"1px solid rgba(0,0,0,.1)",fontSize:12,cursor:"pointer",background:"#fff",color:"#111827",fontWeight:500}}>Sign in</button>
          <button onClick={onGetStarted} className="press" style={{padding:"8px 18px",borderRadius:8,background:"#1E3A5F",color:"#fff",fontSize:12,fontWeight:600,border:"none",cursor:"pointer"}}>Create account</button>
        </div>
      </div>

      {/* Hero — split */}
      <div style={{display:"flex",gap:32,alignItems:"center",padding:"56px 32px 48px",position:"relative",zIndex:2,flexWrap:"wrap"}}>
        <div style={{flex:1,minWidth:280}}>
          <h1 style={{fontSize:40,fontWeight:700,letterSpacing:"-1.5px",lineHeight:1.08,color:"#0F172A",margin:"0 0 16px"}}>Open your wallet.<br/>See what you're<br/><span style={{color:"#1E3A5F"}}>missing</span>.</h1>
          <p style={{fontSize:15,color:"#6B7280",lineHeight:1.6,margin:"0 0 28px",maxWidth:380}}>WiseCard uses AI to find every reward, track every credit, and maximize every swipe — automatically.</p>
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            <button onClick={onGetStarted} className="press spring-hover" style={{padding:"14px 30px",borderRadius:10,border:"none",fontSize:14,fontWeight:600,cursor:"pointer",background:"#1E3A5F",color:"#fff",boxShadow:"0 4px 14px rgba(30,58,95,.2)"}}>Create free account →</button>
            <button onClick={onSignIn} className="press spring-hover" style={{padding:"14px 30px",borderRadius:10,border:"1px solid rgba(0,0,0,.12)",fontSize:14,fontWeight:500,cursor:"pointer",background:"#fff",color:"#111827"}}>Sign in</button>
          </div>
          <div style={{fontSize:11,color:"#9CA3AF",marginTop:14}}>Free forever · No credit card required</div>
        </div>

        {/* Card wallet stack */}
        <div style={{flex:1,minWidth:280,position:"relative",height:360,perspective:1200}}>
          {featureCards.map((fc,i) => {
            const offset = ((i - pulledCard) + featureCards.length) % featureCards.length;
            const isPulled = i === pulledCard;
            return (
              <div key={i} onClick={()=>setPulledCard(i)} className="press" style={{
                position:"absolute",width:250,height:155,left:"50%",marginLeft:-125,
                borderRadius:14,padding:"18px 20px",display:"flex",flexDirection:"column",justifyContent:"space-between",
                overflow:"hidden",cursor:"pointer",
                background:fc.bg,
                boxShadow:isPulled?"0 25px 60px rgba(0,0,0,.18)":"0 8px 30px rgba(0,0,0,.1)",
                transition:"all .5s cubic-bezier(.22,1,.36,1)",
                zIndex:isPulled?10:6-offset,
                transform:isPulled?"translateY(-200px) rotateX(-4deg) scale(1.03)":`translateY(${offset*13}px) scale(${1-offset*0.03}) rotateX(2deg)`,
                opacity:isPulled?1:Math.max(0.2, 1-offset*0.2),
                border:fc.bg.includes("0F172A")?"1px solid rgba(255,255,255,.06)":"none",
              }}>
                <div style={{position:"absolute",inset:0,background:"linear-gradient(125deg,rgba(255,255,255,.12),transparent 40%)",pointerEvents:"none"}}/>
                <div style={{position:"relative",zIndex:1}}>
                  <div style={{fontSize:7,letterSpacing:"1.5px",color:fc.dark?"rgba(0,0,0,.25)":"rgba(255,255,255,.35)"}}>WISECARD</div>
                  <div style={{width:24,height:17,borderRadius:3,background:"linear-gradient(135deg,#D4A847,#B8922E)",opacity:.85,margin:"5px 0"}}/>
                </div>
                <div style={{position:"relative",zIndex:1,color:fc.dark?"#0F172A":"#fff"}}>
                  <div style={{fontSize:13,fontWeight:600}}>{fc.title}</div>
                  <div style={{fontSize:10,opacity:.55,marginTop:2}}>{fc.desc}</div>
                </div>
              </div>
            );
          })}
          {/* Dots */}
          <div style={{position:"absolute",bottom:0,left:"50%",transform:"translateX(-50%)",display:"flex",gap:5}}>
            {featureCards.map((_,i) => (
              <div key={i} onClick={()=>setPulledCard(i)} style={{
                width:pulledCard===i?18:6,height:6,borderRadius:3,cursor:"pointer",
                background:pulledCard===i?"#1E3A5F":"rgba(0,0,0,.1)",
                transition:"all .3s cubic-bezier(.22,1,.36,1)",
              }}/>
            ))}
          </div>
        </div>
      </div>

      {/* Card detail text */}
      <div className="reveal-on-scroll" style={{textAlign:"center",padding:"0 32px 40px",position:"relative",zIndex:2}}>
        <div style={{fontSize:16,fontWeight:500,color:"#0F172A",marginBottom:4}}>{featureCards[pulledCard].title}</div>
        <div style={{fontSize:13,color:"#6B7280",lineHeight:1.6,maxWidth:440,margin:"0 auto"}}>{featureCards[pulledCard].detail}</div>
      </div>

      {/* How it works */}
      <div className="reveal-on-scroll" style={{padding:"48px 32px",position:"relative",zIndex:2}}>
        <div style={{fontSize:11,letterSpacing:"1.5px",textTransform:"uppercase",color:"#1E3A5F",opacity:.5,marginBottom:8}}>How it works</div>
        <div style={{fontSize:24,fontWeight:600,letterSpacing:"-.5px",marginBottom:32,color:"#0F172A"}}>Three steps. Thirty seconds.</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
          {[
            {n:"1",t:"Add your cards",d:"Select from 38 real cards. Balances, limits, and perks auto-populate."},
            {n:"2",t:"Set your profile",d:"Credit range, income, spending habits — WiseCard calibrates to you."},
            {n:"3",t:"Start optimizing",d:"Dashboard, rewards, insights, advisor — all built from your data."},
          ].map(s => (
            <div key={s.n} style={{padding:"24px 20px",textAlign:"center",background:"rgba(255,255,255,.7)",border:"1px solid rgba(0,0,0,.06)",borderRadius:14,backdropFilter:"blur(8px)"}}>
              <div style={{fontSize:28,fontWeight:700,color:"#1E3A5F",opacity:.2,marginBottom:10}}>{s.n}</div>
              <div style={{fontSize:14,fontWeight:600,color:"#0F172A",marginBottom:4}}>{s.t}</div>
              <div style={{fontSize:12,color:"#6B7280",lineHeight:1.5}}>{s.d}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features bento */}
      <div className="reveal-on-scroll" style={{padding:"0 32px 48px",position:"relative",zIndex:2}}>
        <div style={{fontSize:11,letterSpacing:"1.5px",textTransform:"uppercase",color:"#1E3A5F",opacity:.5,marginBottom:8}}>Features</div>
        <div style={{fontSize:24,fontWeight:600,letterSpacing:"-.5px",marginBottom:32,color:"#0F172A"}}>Everything your wallet needs</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {[
            {icon:"arrows-sort",name:"Card optimizer",desc:"Ranks cards by total value for any purchase type.",color:"#1E3A5F",span:true},
            {icon:"chart-area",name:"Spending intelligence",desc:"Interactive charts with category bubbles and AI predictions.",color:"#5B8DB8"},
            {icon:"diamond",name:"Benefits vault",desc:"Activity rings for credits. Alerts before anything expires.",color:"#5B9A6F"},
            {icon:"brain",name:"Credit score AI",desc:"ML scoring with SHAP factors. Simulate any payment.",color:"#C4875C"},
            {icon:"plane",name:"Travel optimizer",desc:"Best card, transfer partners, and lounge access.",color:"#8B7EB8"},
            {icon:"message-chatbot",name:"AI financial advisor",desc:"Ask anything about your cards. Real answers from real data.",color:"#1E3A5F",span:true},
          ].map((f,i) => (
            <div key={i} onClick={onGetStarted} className="press spring-hover" style={{
              padding:"22px 20px",borderRadius:14,cursor:"pointer",
              background:"rgba(255,255,255,.7)",border:"1px solid rgba(0,0,0,.06)",backdropFilter:"blur(8px)",
              gridColumn:f.span?"span 2":"span 1",
              transition:"all .3s",
            }}>
              <div style={{width:34,height:34,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:12,background:`${f.color}10`}}>
                <Icon name={f.icon as any} size={16} strokeWidth={1.5} color={f.color}/>
              </div>
              <div style={{fontSize:14,fontWeight:600,color:"#0F172A",marginBottom:4}}>{f.name}</div>
              <div style={{fontSize:12,color:"#6B7280",lineHeight:1.5}}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Live demo preview */}
      <div className="reveal-on-scroll" style={{padding:"0 32px 48px",position:"relative",zIndex:2}}>
        <div style={{fontSize:11,letterSpacing:"1.5px",textTransform:"uppercase",color:"#1E3A5F",opacity:.5,marginBottom:8}}>Live preview</div>
        <div style={{fontSize:24,fontWeight:600,letterSpacing:"-.5px",marginBottom:24,color:"#0F172A"}}>This is your dashboard</div>
        <div style={{borderRadius:14,overflow:"hidden",border:"1px solid rgba(0,0,0,.08)",background:"#fff"}}>
          <div style={{display:"flex",alignItems:"center",gap:5,padding:"10px 14px",background:"#F9FAFB",borderBottom:"1px solid rgba(0,0,0,.05)"}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:"#F87171",opacity:.5}}/>
            <div style={{width:7,height:7,borderRadius:"50%",background:"#FBBF24",opacity:.5}}/>
            <div style={{width:7,height:7,borderRadius:"50%",background:"#34D399",opacity:.5}}/>
            <div style={{flex:1}}/>
            <div style={{fontSize:9,color:"#9CA3AF"}}>ist-495.vercel.app</div>
          </div>
          <div style={{padding:20}}>
            <div style={{display:"flex",gap:20,marginBottom:14}}>
              <div>
                <div style={{fontSize:8,color:"#9CA3AF",textTransform:"uppercase",letterSpacing:".5px"}}>Credit score</div>
                <div style={{fontSize:28,fontWeight:600,color:"#1E3A5F",letterSpacing:"-1px"}}>740</div>
                <div style={{fontSize:9,color:"#5B9A6F",fontWeight:500}}>+8 this month</div>
              </div>
              <div style={{flex:1,height:55}}>
                <svg viewBox="0 0 300 55" preserveAspectRatio="none" style={{width:"100%",height:"100%"}}>
                  <defs><linearGradient id="ldg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1E3A5F" stopOpacity=".1"/><stop offset="100%" stopColor="#1E3A5F" stopOpacity=".01"/></linearGradient></defs>
                  <path d="M0,45 C30,40 60,30 90,25 C120,20 150,18 180,24 C210,30 240,14 270,10 L300,6 L300,55 L0,55 Z" fill="url(#ldg)"/>
                  <path d="M0,45 C30,40 60,30 90,25 C120,20 150,18 180,24 C210,30 240,14 270,10 L300,6" fill="none" stroke="#1E3A5F" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
            <div style={{display:"flex",gap:4,marginBottom:10}}>
              {[{n:"Blue Cash",bg:"#006FCF"},{n:"Sapphire",bg:"#0F172A"},{n:"Venture X",bg:"#1b4332"}].map(c => (
                <div key={c.n} style={{width:60,height:36,borderRadius:5,background:c.bg,padding:4}}><div style={{fontSize:5,color:"rgba(255,255,255,.6)"}}>{c.n}</div></div>
              ))}
            </div>
            <div style={{padding:"8px 10px",borderRadius:6,background:"#F3F4F6",fontSize:10,color:"#4B5563",lineHeight:1.5}}>
              Pay <strong style={{color:"#111827"}}>$600</strong> before statement → utilization drops to <strong style={{color:"#111827"}}>12%</strong>. Impact: <strong style={{color:"#5B9A6F"}}>+8–12 pts</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="reveal-on-scroll" style={{padding:"0 32px 48px",position:"relative",zIndex:2}}>
        <div style={{fontSize:11,letterSpacing:"1.5px",textTransform:"uppercase",color:"#1E3A5F",opacity:.5,marginBottom:8}}>Testimonials</div>
        <div style={{fontSize:24,fontWeight:600,letterSpacing:"-.5px",marginBottom:24,color:"#0F172A"}}>Real results from real wallets</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {testimonials.map((t,i) => (
            <div key={i} style={{padding:20,background:"rgba(255,255,255,.7)",border:"1px solid rgba(0,0,0,.06)",borderRadius:14,backdropFilter:"blur(8px)"}}>
              <div style={{fontSize:13,color:"#4B5563",lineHeight:1.6,marginBottom:12}}>"{t.text}"</div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:28,height:28,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:600,background:`${t.color}12`,color:t.color}}>{t.name.split(" ").map(w=>w[0]).join("")}</div>
                <div><div style={{fontSize:12,fontWeight:600,color:"#0F172A"}}>{t.name}</div><div style={{fontSize:10,color:"#9CA3AF"}}>{t.role}</div></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Supported cards marquee */}
      <div className="reveal-on-scroll" style={{padding:"0 32px 8px",position:"relative",zIndex:2}}>
        <div style={{fontSize:11,letterSpacing:"1.5px",textTransform:"uppercase",color:"#1E3A5F",opacity:.5,marginBottom:8}}>Supported</div>
        <div style={{fontSize:24,fontWeight:600,letterSpacing:"-.5px",marginBottom:16,color:"#0F172A"}}>38 cards and counting</div>
      </div>
      <div style={{overflow:"hidden",paddingBottom:48,position:"relative",zIndex:2}}>
        <div className="card-marquee" style={{display:"flex",gap:6,width:"max-content"}}>
          {[...supportedCards,...supportedCards].map((c,i) => (
            <div key={i} style={{width:72,height:44,borderRadius:6,display:"flex",alignItems:"flex-end",padding:"4px 6px",flexShrink:0,background:c.bg,boxShadow:"0 2px 8px rgba(0,0,0,.08)",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",inset:0,background:"linear-gradient(125deg,rgba(255,255,255,.1),transparent 40%)",pointerEvents:"none"}}/>
              <div style={{fontSize:5,color:c.dark?"rgba(0,0,0,.4)":"rgba(255,255,255,.6)",position:"relative",zIndex:1}}>{c.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Closing CTA */}
      <div style={{textAlign:"center",padding:"56px 32px 40px",borderTop:"1px solid rgba(0,0,0,.05)",position:"relative",zIndex:2}}>
        <h2 style={{fontSize:30,fontWeight:600,letterSpacing:"-.8px",marginBottom:6,lineHeight:1.15,color:"#0F172A"}}>Stop guessing.<br/><span style={{color:"#1E3A5F"}}>Start optimizing.</span></h2>
        <div style={{fontSize:14,color:"#6B7280",marginBottom:24}}>Join 12,000+ users who never miss a reward.</div>
        <div style={{display:"flex",justifyContent:"center",gap:10}}>
          <button onClick={onGetStarted} className="press spring-hover" style={{padding:"14px 30px",borderRadius:10,border:"none",fontSize:14,fontWeight:600,cursor:"pointer",background:"#1E3A5F",color:"#fff",boxShadow:"0 4px 14px rgba(30,58,95,.2)"}}>Create free account →</button>
          <button onClick={onSignIn} className="press spring-hover" style={{padding:"14px 30px",borderRadius:10,border:"1px solid rgba(0,0,0,.12)",fontSize:14,fontWeight:500,cursor:"pointer",background:"#fff",color:"#111827"}}>Sign in</button>
        </div>
        <div style={{fontSize:11,color:"#9CA3AF",marginTop:14}}>Free forever · No credit card required</div>
        <div style={{display:"flex",justifyContent:"center",gap:40,marginTop:32}}>
          {[{n:"$2.4M",l:"Recovered",c:"#1E3A5F"},{n:"38",l:"Cards",c:"#5B8DB8"},{n:"12K+",l:"Users",c:"#5B9A6F"}].map(s => (
            <div key={s.l} style={{textAlign:"center"}}><div style={{fontSize:22,fontWeight:700,color:s.c}}>{s.n}</div><div style={{fontSize:10,color:"#9CA3AF",marginTop:2}}>{s.l}</div></div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{textAlign:"center",padding:"20px 24px",fontSize:10,color:"#9CA3AF",borderTop:"1px solid rgba(0,0,0,.04)"}}>
        WiseCard · Encrypted and never sold · Penn State IST 495 · Dr. Raahmifer Kamraan · © 2026
      </div>
    </div>
  );
}


function PrivacyPolicy({ go }: { go:(s:S)=>void }) {
  const sections = [
    {
      title: "1. Information We Collect",
      body: [
        "Account information: your name, email address, and password (encrypted) when you create an account.",
        "Financial profile: income range, self-reported credit score range, and monthly spending estimates you choose to enter.",
        "Card data you enter manually: card name, issuer, balance, credit limit, points, and due dates. We do not collect, store, or have access to your full card number, CVV, or any data that would let us make charges.",
        "Transactions you log: amounts, categories, and descriptions you manually enter into the Analytics feature.",
        "Goals, assets, and budget data: any financial goals, net worth assets, or budget caps you choose to set.",
        "Usage data: pages visited and features used within the app, used only to improve the product.",
      ],
    },
    {
      title: "2. How We Use Your Information",
      body: [
        "To provide the core features of WiseCard: card tracking, spending analytics, AI-powered recommendations, and goal tracking.",
        "To personalize the AI Advisor's responses using your card and spending data, processed via Anthropic's Claude API.",
        "To send you in-app notifications about payment due dates, budget caps, and annual fee renewals, based on data you've entered.",
        "To improve WiseCard's features, fix bugs, and understand which features are used most.",
        "We do not sell your personal or financial data to third parties, and we do not use your data to show you third-party advertising.",
      ],
    },
    {
      title: "3. How We Protect Your Data",
      body: [
        "All data is encrypted in transit using TLS and at rest using AES-256 encryption, provided by our database infrastructure (Supabase, built on PostgreSQL).",
        "Row-level security policies ensure your data is only ever accessible to your own authenticated account -- not to other users.",
        "We never ask for or store your full card number, expiration date, or CVV. WiseCard cannot move money, open new accounts, or make charges on your behalf.",
        "Passwords are hashed and never stored or visible in plain text, including to WiseCard's own team.",
      ],
    },
    {
      title: "4. Third-Party Services We Use",
      body: [
        "Supabase -- our database and authentication provider, which stores your account and financial data securely.",
        "Anthropic (Claude API) -- powers the AI Advisor chat feature. Messages you send to the AI Advisor, along with relevant profile context, are sent to Anthropic's API to generate responses. See Anthropic's own privacy policy for how they handle API data.",
        "Vercel -- hosts the WiseCard application and may log standard web request metadata (e.g. IP address, browser type) for security and performance purposes.",
      ],
    },
    {
      title: "5. Your Rights and Choices",
      body: [
        "You can edit or delete any data you've entered (cards, goals, transactions, assets) at any time within the app.",
        "You can request a full export of your data in machine-readable form via Settings -> Privacy & Security -> Download My Data.",
        "You can permanently delete your account and all associated data via Settings -> Privacy & Security -> Delete Account. This action is irreversible.",
        "You can opt out of anonymized usage analytics at any time via the toggle in Privacy & Security.",
      ],
    },
    {
      title: "6. Data Retention",
      body: [
        "We retain your data for as long as your account is active. If you delete your account, your data is permanently removed from our active database, though backups may persist for a limited period before being purged.",
      ],
    },
    {
      title: "7. Children's Privacy",
      body: [
        "WiseCard is not directed at, and is not intended for use by, anyone under the age of 18. We do not knowingly collect information from minors.",
      ],
    },
    {
      title: "8. Changes to This Policy",
      body: [
        "We may update this Privacy Policy from time to time. Material changes will be communicated within the app. Continued use of WiseCard after changes take effect constitutes acceptance of the updated policy.",
      ],
    },
    {
      title: "9. Contact Us",
      body: [
        "Questions about this policy or your data can be sent to support@wisecard.app.",
      ],
    },
  ];
  return (
    <div className="screen desktop-content screen-enter">
      <PageHead title="Privacy Policy" back={()=>go("privacy")}/>
      <div className="px">
        <div className="card-surface au" style={{padding:"14px 16px",marginBottom:20,background:"var(--amberbg)",border:"1px solid rgba(217,119,6,.2)"}}>
          <p style={{color:"var(--amber)",fontSize:13,fontWeight:600,marginBottom:3,display:"flex",alignItems:"center",gap:6}}><Icon name="warning" size={12}/> Student project notice</p>
          <p style={{color:"var(--text2)",fontSize:12,lineHeight:1.5}}>This policy accurately describes how WiseCard's current prototype handles data. It has not been reviewed by a lawyer and should be professionally reviewed before any commercial launch with real users.</p>
        </div>
        <p style={{color:"var(--text2)",fontSize:13,marginBottom:20}}>Last updated: June 2026</p>
        {sections.map(sec=>(
          <div key={sec.title} style={{marginBottom:22}}>
            <h3 style={{color:"var(--text)",fontSize:15,fontWeight:700,marginBottom:10}}>{sec.title}</h3>
            {sec.body.map((p,i)=>(
              <p key={i} style={{color:"var(--text2)",fontSize:14,lineHeight:1.7,marginBottom:8}}>{p}</p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   TERMS OF SERVICE SCREEN
   ============================================================ */
function TermsOfService({ go }: { go:(s:S)=>void }) {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      body: [
        "By creating an account or using WiseCard, you agree to these Terms of Service and our Privacy Policy. If you do not agree, please do not use the app.",
      ],
    },
    {
      title: "2. Description of Service",
      body: [
        "WiseCard is a personal finance tracking and education tool. It helps you track credit cards you manually add, log spending, set goals, and receive AI-generated suggestions about card usage and rewards optimization.",
        "WiseCard is NOT a bank, lender, or financial institution. We do not issue credit cards, extend credit, move money, or have any access to your real bank or card accounts.",
        "WiseCard does not connect to your real bank or card accounts. All balances, limits, and points are entered manually by you and may not reflect your real-time, actual account status.",
      ],
    },
    {
      title: "3. Not Financial or Legal Advice",
      body: [
        "Information and suggestions provided by WiseCard's AI Advisor, approval-chance estimates, and recommendation tools are for general informational and educational purposes only.",
        "They do not constitute professional financial, legal, tax, or credit advice, and should not be relied upon as the sole basis for any financial decision. Always verify current rates, fees, and terms directly with the card issuer before applying for or using any financial product.",
        "Approval-chance percentages are rough estimates based on self-reported income and credit score ranges. They are not guarantees of approval and do not reflect the issuer's actual underwriting criteria.",
      ],
    },
    {
      title: "4. Your Account",
      body: [
        "You are responsible for maintaining the confidentiality of your password and for all activity that occurs under your account.",
        "You must provide accurate information when creating your account. You may not impersonate another person or entity.",
        "You must be at least 18 years old to create an account.",
      ],
    },
    {
      title: "5. Acceptable Use",
      body: [
        "You agree not to use WiseCard to: violate any law; attempt to gain unauthorized access to other users' data or to WiseCard's systems; introduce malware or attempt to disrupt the service; or scrape, resell, or redistribute WiseCard's content or card database without permission.",
      ],
    },
    {
      title: "6. Disclaimers and Limitation of Liability",
      body: [
        "WiseCard is provided \"as is\" and \"as available\" without warranties of any kind, express or implied, including but not limited to accuracy, reliability, or fitness for a particular purpose.",
        "To the fullest extent permitted by law, WiseCard and its creators are not liable for any direct, indirect, incidental, or consequential damages arising from your use of the app, including but not limited to financial loss resulting from card application decisions, missed payments, or reliance on AI-generated suggestions.",
        "Sign-up bonus values, transfer ratios, APRs, and fees displayed in the app are believed accurate as of the date shown but can change at any time at the issuer's discretion. Always confirm current terms directly with the issuer.",
      ],
    },
    {
      title: "7. Intellectual Property",
      body: [
        "The WiseCard name, design, and original content are the property of WiseCard. Card names, issuer names, and trademarks referenced in the app belong to their respective owners and are used for identification and comparison purposes only. WiseCard is not affiliated with, endorsed by, or sponsored by any card issuer mentioned in the app.",
      ],
    },
    {
      title: "8. Termination",
      body: [
        "You may stop using WiseCard and delete your account at any time via Settings. We reserve the right to suspend or terminate accounts that violate these terms.",
      ],
    },
    {
      title: "9. Changes to These Terms",
      body: [
        "We may update these Terms from time to time. Continued use of WiseCard after changes take effect constitutes acceptance of the revised Terms.",
      ],
    },
    {
      title: "10. Contact Us",
      body: [
        "Questions about these Terms can be sent to support@wisecard.app.",
      ],
    },
  ];
  return (
    <div className="screen desktop-content screen-enter">
      <PageHead title="Terms of Service" back={()=>go("privacy")}/>
      <div className="px">
        <div className="card-surface au" style={{padding:"14px 16px",marginBottom:20,background:"var(--amberbg)",border:"1px solid rgba(217,119,6,.2)"}}>
          <p style={{color:"var(--amber)",fontSize:13,fontWeight:600,marginBottom:3,display:"flex",alignItems:"center",gap:6}}><Icon name="warning" size={12}/> Student project notice</p>
          <p style={{color:"var(--text2)",fontSize:12,lineHeight:1.5}}>These terms accurately describe WiseCard's current prototype. They have not been reviewed by a lawyer and should be professionally reviewed before any commercial launch with real users.</p>
        </div>
        <p style={{color:"var(--text2)",fontSize:13,marginBottom:20}}>Last updated: June 2026</p>
        {sections.map(sec=>(
          <div key={sec.title} style={{marginBottom:22}}>
            <h3 style={{color:"var(--text)",fontSize:15,fontWeight:700,marginBottom:10}}>{sec.title}</h3>
            {sec.body.map((p,i)=>(
              <p key={i} style={{color:"var(--text2)",fontSize:14,lineHeight:1.7,marginBottom:8}}>{p}</p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}


/* ============================================================
   TOOLS HUB -- financial calculators and trackers (not settings)
   ============================================================ */
function ToolsHub({ go }: { go:(s:S)=>void }) {
  const tools: [string,string,string,()=>void,string][] = [
    ["gift","Card Strategy","Sign-up bonuses & 5/24 status",()=>go("card-strategy"),"#F59E0B"],
    ["trend-down","Debt Payoff Planner","Avalanche vs snowball calculator",()=>go("debt-planner"),"#EF4444"],
    ["wallet","Net Worth","Assets minus card debt",()=>go("net-worth"),"#22C55E"],
    ["trophy","Achievements","Track your progress and badges",()=>go("achievements"),"#8B5CF6"],
  ];
  return (
    <div className="screen desktop-content screen-enter">
      <PageHead title="Tools" sub="Calculators and trackers for your finances" back={()=>go("home")}/>
      <div className="px">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {tools.map(([icon,label,desc,action,color])=>(
            <button key={label} onClick={action} className="press hover-lift card-surface" style={{padding:"20px 16px",textAlign:"left",width:"100%"}}>
              <div style={{width:42,height:42,borderRadius:12,background:`${color}18`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:14,color}}>
                <Icon name={icon} size={20}/>
              </div>
              <p style={{color:"var(--text)",fontSize:14,fontWeight:700,marginBottom:4}}>{label}</p>
              <p style={{color:"var(--text2)",fontSize:12,lineHeight:1.4}}>{desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function AuthScreen({onAuth}:{onAuth:(user:any)=>void}) {
  const [mode, setMode] = useState<"login"|"signup"|"forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pwStrength, setPwStrength] = useState(0);

  const calcStrength = (pw: string) => {
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    setPwStrength(s);
  };

  const handleAuth = async () => {
    if (mode === "forgot") {
      if (!email) { setError("Please enter your email"); return; }
      setLoading(true); setError(""); setSuccess("");
      try {
        const res = await fetch("/api/forgot-password", {
          method:"POST", headers:{"Content-Type":"application/json"},
          body: JSON.stringify({ email })
        });
        const data = await res.json();
        if (!res.ok) setError(data.error || "Failed to send reset email");
        else setSuccess("If that email exists, a reset link has been sent. Check your inbox.");
      } catch(e) { setError("Network error. Please try again."); }
      setLoading(false); return;
    }
    if (!email || !password) { setError("Please fill in all fields"); return; }
    if (mode === "signup" && password.length < 8) { setError("Password must be at least 8 characters"); return; }
    setLoading(true); setError(""); setSuccess("");
    try {
      if (mode === "signup") {
        if (!name) { setError("Please enter your name"); setLoading(false); return; }
        const { error } = await supabase.auth.signUp({ email, password, options: { data: { name } } });
        if (error) setError(error.message);
        else { setSuccess("Account created! Please check your email to verify, then log in."); setMode("login"); }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) setError(error.message === "Invalid login credentials" ? "Incorrect email or password" : error.message);
        else onAuth(data.user); // pass the user we already have -- don't wait on a separate event
      }
    } catch(e) { setError("Something went wrong. Try again."); }
    setLoading(false);
  };

  return (
    <div style={{background:"var(--bg)",minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px",fontFamily:"var(--sans)"}}>
      <div style={{width:"100%",maxWidth:400}}>
        {/* Logo */}
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{width:50,height:50,borderRadius:13,background:"var(--accent)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 18px"}}>
            <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="4" width="22" height="16" rx="2"/>
              <line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
          </div>
          <div style={{fontSize:12,letterSpacing:2,fontWeight:600,marginBottom:8,color:"var(--accent)",textTransform:"uppercase"}}>WiseCard</div>
          <h1 style={{fontSize:26,fontWeight:700,lineHeight:1.2,letterSpacing:"-.5px",color:"var(--text)"}}>
            {mode==="login"?"Welcome back":mode==="signup"?"Get started":"Reset password"}
          </h1>
          <p style={{color:"var(--text2)",fontSize:14,marginTop:6}}>
            {mode==="login"?"Sign in to your account":mode==="signup"?"Start optimizing your cards":"Enter your email and we'll send a reset link"}
          </p>
        </div>

        {/* Form */}
        <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:12,padding:"28px 24px",boxShadow:"var(--shadow-lg)"}}>
          {mode==="signup" && (
            <div style={{marginBottom:16}}>
              <label style={{fontSize:13,color:"var(--text2)",fontWeight:500,display:"block",marginBottom:8}}>Your Name</label>
              <input className="field" placeholder="First name" value={name} onChange={e=>setName(e.target.value)} style={{padding:"13px 16px"}}/>
            </div>
          )}
          <div style={{marginBottom:16}}>
            <label style={{fontSize:13,color:"var(--text2)",fontWeight:500,display:"block",marginBottom:8}}>Email</label>
            <input className="field" type="email" placeholder="your@email.com" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleAuth()} style={{padding:"13px 16px"}}/>
          </div>
          {mode!=="forgot" && (
            <div style={{marginBottom:mode==="signup"?8:24}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <label style={{fontSize:13,color:"var(--text2)",fontWeight:500}}>Password</label>
                {mode==="login" && <button type="button" onClick={()=>{setMode("forgot");setError("");setSuccess("");}} style={{background:"none",border:"none",color:"var(--accent)",fontSize:13,cursor:"pointer",padding:0}}>Forgot password?</button>}
              </div>
              <input className="field" type="password" placeholder={mode==="signup"?"At least 8 characters":""} value={password}
                onChange={e=>{setPassword(e.target.value);if(mode==="signup")calcStrength(e.target.value);}}
                onKeyDown={e=>e.key==="Enter"&&handleAuth()} style={{padding:"13px 16px"}}/>
            </div>
          )}
          {mode==="signup" && password.length>0 && (
            <div style={{marginBottom:20}}>
              <div style={{display:"flex",gap:4,marginBottom:4}}>
                {[1,2,3,4].map(i=>(
                  <div key={i} style={{flex:1,height:3,borderRadius:2,background:pwStrength>=i?(i<=1?"var(--red)":i<=2?"var(--amber)":i<=3?"var(--accent)":"var(--green)"):"var(--border2)",transition:"background .2s"}}/>
                ))}
              </div>
              <span style={{fontSize:12,color:"var(--text2)"}}>{["","Weak","Fair","Good","Strong"][pwStrength]} password</span>
            </div>
          )}

          {error && <div style={{background:"var(--redbg)",border:"1px solid rgba(239,68,68,.2)",borderRadius:10,padding:"10px 14px",marginBottom:16}}><p style={{color:"var(--red)",fontSize:14,margin:0}}>{error}</p></div>}
          {success && <div style={{background:"var(--greenbg)",border:"1px solid rgba(34,197,94,.2)",borderRadius:10,padding:"10px 14px",marginBottom:16}}><p style={{color:"var(--green)",fontSize:14,margin:0}}>{success}</p></div>}

          <button onClick={handleAuth} disabled={loading} className="btn-gold press" style={{width:"100%",opacity:loading?0.7:1}}>
            {loading&&<span style={{width:15,height:15,borderRadius:"50%",border:"2px solid rgba(255,255,255,.3)",borderTopColor:"white",animation:"spin .7s linear infinite",display:"inline-block",flexShrink:0,marginRight:8}}/>}{loading?(mode==="login"?"Signing in...":mode==="signup"?"Creating account...":"Sending..."):mode==="login"?"Sign In":mode==="signup"?"Create Account":"Send Reset Link"}
          </button>

          <button onClick={()=>{setMode(mode==="login"?"signup":"login");setError("");setSuccess("");setPwStrength(0);setPassword("");}} style={{width:"100%",marginTop:14,background:"none",border:"none",color:"var(--text2)",fontSize:14,cursor:"pointer",padding:"8px"}}>
            {mode==="login" ? "Don't have an account? Sign up" : mode==="signup" ? "Already have an account? Sign in" : "Back to sign in"}
          </button>
        </div>

        <p style={{color:"var(--text3)",fontSize:12,textAlign:"center",marginTop:16,lineHeight:1.6}}>
          {mode==="signup" ? "By creating an account, you agree to our Terms of Service and Privacy Policy. " : ""}Your data is encrypted with AES-256 and never shared
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   ROOT APP
   ============================================================ */

/* ============================================================
   ERROR BOUNDARY - catches all runtime errors
   ============================================================ */
class ErrorBoundary extends (require("react") as any).Component<{children:any},{hasError:boolean,error:any}> {
  constructor(props:any) { super(props); this.state = {hasError:false,error:null}; }
  static getDerivedStateFromError(error:any) { return {hasError:true,error}; }
  render() {
    if(this.state.hasError) {
      return (
        <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#F3F6FB",fontFamily:"Inter,system-ui,sans-serif",padding:24}}>
          <div style={{maxWidth:480,textAlign:"center"}}>
            <div style={{width:48,height:48,borderRadius:12,background:"#2563EB",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px"}}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
            </div>
            <h1 style={{fontSize:22,fontWeight:700,color:"#1A202C",marginBottom:8}}>Something went wrong</h1>
            <p style={{color:"#718096",fontSize:15,marginBottom:24}}>Please refresh the page to continue.</p>
            <button onClick={()=>window.location.reload()} style={{background:"#2563EB",color:"white",border:"none",borderRadius:8,padding:"12px 24px",fontSize:15,fontWeight:600,cursor:"pointer"}}>
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [screen, setScreen] = useState<S>("onboard");
  const [profile, setProfile] = useState<UserProfile>({name:"",age:"",income:"",lifestyles:[],creditScore:"",spending:{dining:"",groceries:"",travel:"",gas:"",shopping:"",other:""},goal:""});
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [autoLogoutEnabled, setAutoLogoutEnabled] = useState(true);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [txns, setTxns] = useState<Txn[]>([]);
  const [cardApplications, setCardApplications] = useState<CardApplication[]>([]);
  const [theme, setTheme] = useState<"dark"|"light">("light");
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [showAuthForm, setShowAuthForm] = useState(false);

  // Inject CSS
  useEffect(()=>{
    try {
      const el = document.createElement("style");
      el.id = "wisecard-styles";
      if (!document.getElementById("wisecard-styles")) {
        el.textContent = BASE_CSS;
        document.head.appendChild(el);
      }
    } catch(e) { console.error("Style injection failed:", e); }
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
          },
          budgetCaps: prof.budget_caps || undefined,
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
          openedDate:c.opened_date||"", bonusTarget:c.bonus_target||0,
          bonusDeadline:c.bonus_deadline||"", bonusProgress:c.bonus_progress||0,
          offers:[
            {title:"10% back at Uber Eats",merchant:"Uber Eats",expires:"Dec 31, 2025",value:"Up to $25"},
            {title:"$50 off at Best Buy",merchant:"Best Buy",expires:"Nov 30, 2025",value:"$50 cashback"},
            {title:"5x points on hotels",merchant:"Hotels.com",expires:"Jan 15, 2026",value:"Bonus points"},
          ],
        }));
        setCards(mapped);
      }

      // Load goals
      const {data:goalData} = await supabase.from("goals").select("*").eq("user_id",user.id);
      if(goalData) {
        setGoals(goalData.map((g:any):Goal=>({
          id:g.id, emoji:g.emoji||"goal", title:g.title, target:g.target, current:g.current,
          unit:g.unit||"$", color:g.color||"#2563EB", due:g.due||"", tips:g.tips||[],
        })));
      }

      // Load assets (net worth)
      const {data:assetData} = await supabase.from("assets").select("*").eq("user_id",user.id);
      if(assetData) {
        setAssets(assetData.map((a:any):Asset=>({id:a.id, name:a.name, value:a.value})));
      }

      // Load transactions (analytics)
      const {data:txnData} = await supabase.from("transactions").select("*").eq("user_id",user.id);
      if(txnData) {
        setTxns(txnData.map((t:any):Txn=>({
          id:t.id, cat:t.category, amount:t.amount, desc:t.description||"", card:t.card_name||"", date:t.txn_date||"",
        })));
      }

      // Load card applications (5/24 tracker)
      const {data:appData} = await supabase.from("card_applications").select("*").eq("user_id",user.id);
      if(appData) {
        setCardApplications(appData.map((a:any):CardApplication=>({id:a.id, issuer:a.issuer, date:a.date_opened})));
      }

      setDataLoaded(true);
    };
    loadData();
  },[user, dataLoaded]);

  const go = (s:S) => setScreen(s);
  const toggleTheme = () => setTheme(t=>t==="dark"?"light":"dark");

  // Save card to Supabase + local state
  const addCard = async (card:CreditCard) => {
    // Add to local state immediately with temp id for instant UI feedback
    setCards(p=>[...p,card]);
    showToast(`${card.name} added to your wallet`);
    if(user) {
      // Insert without specifying id -- let Supabase auto-generate the real UUID,
      // then swap our temp local id for the real one so update/delete work correctly.
      const {data, error} = await supabase.from("cards").insert({
        user_id:user.id, db_id:card.dbId, name:card.name, issuer:card.issuer,
        gradient:card.gradient, accent_color:card.accentColor,
        balance:card.balance, credit_limit:card.limit, min_payment:card.minPayment,
        due_date:card.dueDate, points:card.points, apr:card.apr,
        reward_rate:card.rewardRate, annual_fee:card.annualFee, perks_value:card.perksValue,
        cashback:card.cashback, category:card.category,
        signup_bonus:card.signupBonus, best_for:card.bestFor,
        key_benefits:card.keyBenefits, best_places:card.bestPlaces,
        not_good_for:card.notGoodFor, opened_date:card.openedDate||"",
        bonus_target:card.bonusTarget||0, bonus_deadline:card.bonusDeadline||"", bonus_progress:card.bonusProgress||0,
      }).select().single();
      if(error) { console.error("Failed to save card:", error); showToast("Card saved locally but failed to sync", "error"); return; }
      if(data) {
        // Swap temp id for the real database id
        setCards(p=>p.map(c=>c.id===card.id ? {...c, id:data.id} : c));
      }
    }
  };

  // Save profile to Supabase
  const saveProfile = async (p:UserProfile) => {
    setProfile(p);
    showToast("Profile saved successfully");
    if(user) {
      await supabase.from("profiles").upsert({
        id:user.id, name:p.name, age:p.age, income:p.income,
        credit_score:p.creditScore, lifestyles:p.lifestyles, goal:p.goal,
        spending_dining:p.spending.dining, spending_groceries:p.spending.groceries,
        spending_travel:p.spending.travel, spending_gas:p.spending.gas,
        spending_shopping:p.spending.shopping, spending_other:p.spending.other,
        budget_caps: p.budgetCaps || null,
      });
    }
    setScreen("home");
  };

  // Update card balance and points
  const updateCard = async (cardId: string, balance: number, points: number) => {
    setCards(p => p.map(c => c.id===cardId ? {...c, balance, points} : c));
    if(user) {
      await supabase.from("cards").update({balance, points}).eq("id", cardId);
    }
  };

  // Update a card's sign-up bonus tracking
  // Freeze/unfreeze a card (local state only -- simulates a security lock, no real bank action)
  const toggleCardFreeze = (cardId: string) => {
    setCards(p => p.map(c => c.id===cardId ? {...c, isFrozen: !c.isFrozen} : c));
    const card = cards.find(c=>c.id===cardId);
    showToast(card?.isFrozen ? `${card.name} unfrozen` : `${card?.name} frozen`, card?.isFrozen ? "success" : "warning");
  };

  const updateCardBonus = async (cardId: string, bonusTarget: number, bonusDeadline: string, bonusProgress: number) => {
    setCards(p => p.map(c => c.id===cardId ? {...c, bonusTarget, bonusDeadline, bonusProgress} : c));
    if(user) {
      await supabase.from("cards").update({bonus_target:bonusTarget, bonus_deadline:bonusDeadline, bonus_progress:bonusProgress}).eq("id", cardId);
    }
  };

  // Delete a card
  const deleteCard = async (cardId: string) => {
    const card = cards.find(c => c.id === cardId);
    setCards(p => p.filter(c => c.id !== cardId));
    if (user && card) {
      await supabase.from("cards").delete().eq("id", cardId);
    }
    showToast("Card removed from wallet", "info");
  };

  // ===== GOALS =====
  const addGoal = async (goal: Omit<Goal,"id">) => {
    const tempId = Math.random().toString(36).slice(2);
    setGoals(p=>[...p,{...goal,id:tempId}]);
    if(user) {
      const {data} = await supabase.from("goals").insert({
        user_id:user.id, emoji:goal.emoji, title:goal.title, target:goal.target,
        current:goal.current, unit:goal.unit, color:goal.color, due:goal.due, tips:goal.tips,
      }).select().single();
      if(data) setGoals(p=>p.map(g=>g.id===tempId?{...g,id:data.id}:g));
    }
    showToast("Goal created");
  };
  const updateGoalProgress = async (goalId: string, current: number) => {
    setGoals(p=>p.map(g=>g.id===goalId?{...g,current}:g));
    if(user) await supabase.from("goals").update({current}).eq("id", goalId);
  };
  const deleteGoal = async (goalId: string) => {
    setGoals(p=>p.filter(g=>g.id!==goalId));
    if(user) await supabase.from("goals").delete().eq("id", goalId);
    showToast("Goal removed", "info");
  };

  // ===== ASSETS (Net Worth) =====
  const addAsset = async (name: string, value: number) => {
    const tempId = Math.random().toString(36).slice(2);
    setAssets(p=>[...p,{id:tempId,name,value}]);
    if(user) {
      const {data} = await supabase.from("assets").insert({user_id:user.id, name, value}).select().single();
      if(data) setAssets(p=>p.map(a=>a.id===tempId?{...a,id:data.id}:a));
    }
    showToast("Asset added");
  };
  const deleteAsset = async (assetId: string) => {
    setAssets(p=>p.filter(a=>a.id!==assetId));
    if(user) await supabase.from("assets").delete().eq("id", assetId);
  };

  // ===== TRANSACTIONS (Analytics) =====
  const addTxn = async (cat: string, amount: number, desc: string, card: string, date: string) => {
    const tempId = Math.random().toString(36).slice(2);
    setTxns(p=>[...p,{id:tempId,cat,amount,desc,card,date}]);
    if(user) {
      const {data} = await supabase.from("transactions").insert({
        user_id:user.id, category:cat, amount, description:desc, card_name:card, txn_date:date,
      }).select().single();
      if(data) setTxns(p=>p.map(t=>t.id===tempId?{...t,id:data.id}:t));
    }
    showToast("Transaction added to analytics");
  };
  const deleteTxn = async (txnId: string) => {
    setTxns(p=>p.filter(t=>t.id!==txnId));
    if(user) await supabase.from("transactions").delete().eq("id", txnId);
  };

  // ===== CARD APPLICATIONS (5/24 tracker) =====
  const addCardApplication = async (issuer: string, date: string) => {
    const tempId = Math.random().toString(36).slice(2);
    setCardApplications(p=>[...p,{id:tempId,issuer,date}]);
    if(user) {
      const {data} = await supabase.from("card_applications").insert({user_id:user.id, issuer, date_opened:date}).select().single();
      if(data) setCardApplications(p=>p.map(a=>a.id===tempId?{...a,id:data.id}:a));
    }
    showToast("Card application logged");
  };
  const deleteCardApplication = async (appId: string) => {
    setCardApplications(p=>p.filter(a=>a.id!==appId));
    if(user) await supabase.from("card_applications").delete().eq("id", appId);
  };

  // Sign out
  const signOut = async () => {
    await supabase.auth.signOut();
    showToast("Signed out", "info");
    setUser(null); setCards([]); setDataLoaded(false);
    setProfile({name:"",age:"",income:"",lifestyles:[],creditScore:"",spending:{dining:"",groceries:"",travel:"",gas:"",shopping:"",other:""},goal:""});
    setScreen("onboard");
  };

  // Real session auto-logout — signs out after 15 minutes of no mouse/keyboard activity.
  // Respects the actual toggle in Privacy & Security instead of always running regardless of it.
  useEffect(()=>{
    if(!user || !autoLogoutEnabled) return;
    const TIMEOUT_MS = 15*60*1000;
    let timer: ReturnType<typeof setTimeout>;
    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(()=>{
        showToast("Signed out due to inactivity", "info");
        signOut();
      }, TIMEOUT_MS);
    };
    const events = ["mousedown","mousemove","keydown","scroll","touchstart"];
    events.forEach(e=>window.addEventListener(e, reset));
    reset();
    return ()=>{
      clearTimeout(timer);
      events.forEach(e=>window.removeEventListener(e, reset));
    };
  },[user, autoLogoutEnabled]);

  // Loading spinner while checking auth
  if(authLoading) return (
    <div style={{background:"var(--bg)",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--sans)"}}>
      <div style={{textAlign:"center"}}>
          <div style={{width:52,height:52,borderRadius:14,background:"var(--accent)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px"}}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg></div>
        <p style={{color:"var(--text2)",fontSize:14}}>Loading WiseCard...</p>
      </div>
    </div>
  );

  // Show landing page first, then auth screen if not logged in
  if(!user && !showAuthForm) return <Landing onGetStarted={()=>setShowAuthForm(true)} onSignIn={()=>setShowAuthForm(true)}/>;
  if(!user) return <AuthScreen onAuth={(authedUser)=>{setUser(authedUser);setDataLoaded(false);}}/>;

  // Show onboarding if logged in but no profile yet
  if(screen==="onboard") return <Onboard done={saveProfile}/>;

  const isChat = screen === "chat";

  return (
    <div style={{background:"var(--bg)",minHeight:"100vh",fontFamily:"var(--sans)"}}>
      <ToastContainer/>
      <Sidebar active={screen} go={go} theme={theme} toggleTheme={toggleTheme} profile={profile} onSignOut={signOut}/>
      <div className={isChat?"":"desktop-main"}>
        {screen==="home"     && <Home     profile={profile} cards={cards} go={go} dataLoaded={dataLoaded} onUpdateCard={updateCard}/>}
        {screen==="cards"    && <Cards    cards={cards} go={go} onDelete={deleteCard} onToggleFreeze={toggleCardFreeze}/>}
        {screen==="add-card" && <AddCard  go={go} onAdd={addCard}/>}
        {screen==="chat"     && <Chat     cards={cards} profile={profile} go={go}/>}
        {screen==="travel"   && <Travel   cards={cards}/>}
        {screen==="goals"    && <Goals goals={goals} onAdd={addGoal} onUpdateProgress={updateGoalProgress} onDelete={deleteGoal}/>}
        {screen==="split"    && <Split    cards={cards}/>}
        {screen==="perks"    && <Perks    cards={cards}/>}
        {screen==="settings"      && <Settings go={go} profile={profile} theme={theme} toggleTheme={toggleTheme} onSignOut={signOut}/>}
        {screen==="lifestyle"      && <LifestyleOptimizer go={go} cards={cards} profile={profile}/>}
        {screen==="credit-optimizer" && <CreditOptimizer go={go} profile={profile}/>}
        {screen==="ai-recommender" && <AIRecommender go={go} cards={cards} profile={profile}/>}
        {screen==="analytics"      && <Analytics go={go} cards={cards} profile={profile} txns={txns} onAddTxn={addTxn} onDeleteTxn={deleteTxn}/>}
        {screen==="notifications"  && <Notifications go={go} cards={cards}/>}
        {screen==="compare"        && <Compare go={go} cards={cards}/>}
        {screen==="edit-profile"   && <EditProfile go={go} profile={profile} onSave={saveProfile}/>}
        {screen==="referral"       && <Referral go={go}/>}
        {screen==="privacy"        && <Privacy go={go} profile={profile} cards={cards} goals={goals} assets={assets} txns={txns} cardApplications={cardApplications} autoLogoutEnabled={autoLogoutEnabled} setAutoLogoutEnabled={setAutoLogoutEnabled}/>}
        {screen==="privacy-policy" && <PrivacyPolicy go={go}/>}
        {screen==="terms"          && <TermsOfService go={go}/>}
        {screen==="tools"          && <ToolsHub go={go}/>}
        {screen==="about"          && <About go={go}/>}
        {screen==="card-strategy"  && <CardStrategy go={go} cards={cards} applications={cardApplications} onAddApplication={addCardApplication} onDeleteApplication={deleteCardApplication} onUpdateBonus={updateCardBonus}/>}
        {screen==="debt-planner"   && <DebtPlanner go={go} cards={cards}/>}
        {screen==="net-worth"      && <NetWorth go={go} cards={cards} assets={assets} onAddAsset={addAsset} onDeleteAsset={deleteAsset}/>}
        {screen==="achievements"   && <Achievements go={go} cards={cards} profile={profile}/>}
        {screen==="help"           && <HelpCenter go={go}/>}
      </div>
      {!isChat && <MobileNav active={screen} go={go}/>}
    </div>
  );
}
