"use client";
import { useState, useEffect, useRef, useCallback } from "react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{
  background:#060711;
  color:#EEEDF5;
  font-family:'Inter',system-ui,sans-serif;
  -webkit-font-smoothing:antialiased;
  overflow-x:hidden;
}
button,input,select,textarea{font-family:inherit;cursor:pointer}
::-webkit-scrollbar{display:none}

:root{
  --bg:#060711;
  --bg2:#0A0C18;
  --card:#0F1120;
  --card2:#141629;
  --border:rgba(255,255,255,.07);
  --border2:rgba(255,255,255,.12);
  --text:#EEEDF5;
  --text2:#9B9AB0;
  --text3:#5A596F;
  --violet:#7C6EFA;
  --violet2:#6358E8;
  --violet-glow:rgba(124,110,250,.25);
  --emerald:#2DD4BF;
  --gold:#F0B429;
  --rose:#FB7185;
  --sky:#38BDF8;
  --amber:#FBBF24;
  --serif:'Playfair Display',Georgia,serif;
}

@keyframes up{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes in{from{opacity:0}to{opacity:1}}
@keyframes pop{from{opacity:0;transform:scale(.94) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
@keyframes glow{0%,100%{box-shadow:0 0 20px var(--violet-glow)}50%{box-shadow:0 0 40px var(--violet-glow),0 0 60px var(--violet-glow)}}

.au{animation:up  .5s cubic-bezier(.22,.68,0,1.2) both}
.ai{animation:in  .3s ease both}
.ap{animation:pop .4s cubic-bezier(.22,.68,0,1.2) both}

.d1{animation-delay:.06s}.d2{animation-delay:.12s}.d3{animation-delay:.18s}
.d4{animation-delay:.24s}.d5{animation-delay:.30s}.d6{animation-delay:.36s}

.hover{transition:transform .18s ease,box-shadow .18s ease,border-color .2s ease}
.hover:hover{transform:translateY(-2px);box-shadow:0 12px 40px rgba(0,0,0,.5)}
.press:active{transform:scale(.95)!important}

.glass{
  background:rgba(10,12,24,.88);
  backdrop-filter:blur(24px);
  -webkit-backdrop-filter:blur(24px);
}

.gtext{
  background:linear-gradient(135deg,var(--violet),var(--sky));
  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
  background-clip:text;
}

.chip{
  display:inline-flex;align-items:center;gap:4px;
  padding:3px 10px;border-radius:20px;
  font-size:11px;font-weight:600;letter-spacing:.2px;
  white-space:nowrap;
}
.cv{background:rgba(124,110,250,.15);color:var(--violet)}
.ce{background:rgba(45,212,191,.12);color:var(--emerald)}
.cg{background:rgba(240,180,41,.12);color:var(--gold)}
.cr{background:rgba(251,113,133,.12);color:var(--rose)}
.cs{background:rgba(56,189,248,.12);color:var(--sky)}

.field{
  width:100%;padding:14px 16px;
  border-radius:12px;
  background:var(--card);
  border:1.5px solid var(--border);
  color:var(--text);font-size:14px;outline:none;
  transition:border-color .2s,box-shadow .2s;
}
.field:focus{border-color:var(--violet);box-shadow:0 0 0 3px var(--violet-glow)}
.field::placeholder{color:var(--text3)}

.section{min-height:100vh;padding:64px 0 100px;animation:in .3s ease}
.px{padding-left:20px;padding-right:20px}

.track{background:rgba(255,255,255,.06);border-radius:99px;overflow:hidden}
.fill{height:100%;border-radius:99px;transition:width .9s cubic-bezier(.22,.68,0,1.2)}

.nav-safe{padding-bottom:max(12px,env(safe-area-inset-bottom))}
`;

type S="onboard"|"home"|"cards"|"chat"|"travel"|"goals"|"split"|"perks"|"settings";

interface Card{id:number;name:string;issuer:string;color:string;accent:string;textColor:string;points:number;limit:number;balance:number;reward:string;rate:string;fee:number;perks:number;}
interface Msg{role:"user"|"ai";text:string;id:number}
interface Goal{id:number;emoji:string;title:string;target:number;current:number;unit:"$"|"%"|"pts";color:string;due:string;tips:string[];}
interface Bill{id:number;name:string;emoji:string;amount:number;people:string[];date:string;done:boolean;card:string;pts:number;}
interface Perk{card:string;name:string;emoji:string;used:number;total:number;resets:string;urgent:boolean;cardColor:string;}

const CARDS:Card[]=[
  {id:1,name:"Sapphire Reserve",issuer:"Chase",color:"linear-gradient(135deg,#141E3C 0%,#263878 50%,#1E3A5F 100%)",accent:"#5B8DEF",textColor:"#fff",points:84200,limit:15000,balance:2340,reward:"3x Travel & Dining",rate:"21.99%",fee:550,perks:620},
  {id:2,name:"Gold Card",issuer:"American Express",color:"linear-gradient(135deg,#2C1A00 0%,#8B6010 40%,#C9920A 70%,#8B6010 100%)",accent:"#F0B429",textColor:"#fff",points:42100,limit:10000,balance:890,reward:"4x Dining & Groceries",rate:"29.99%",fee:250,perks:340},
  {id:3,name:"Venture X",issuer:"Capital One",color:"linear-gradient(135deg,#091926 0%,#0D3355 50%,#1A5080 100%)",accent:"#38BDF8",textColor:"#fff",points:31500,limit:20000,balance:450,reward:"2x All Purchases",rate:"19.99%",fee:395,perks:430},
];

const GOALS:Goal[]=[
  {id:1,emoji:"📊",title:"Keep Utilization Under 30%",target:30,current:18,unit:"%",color:"#7C6EFA",due:"Ongoing",tips:["Pay $400 on Chase before the 18th → drops from 15.6% to 9%","Pay Amex balance before statement closes on the 22nd","Your overall utilization will drop from 18% to 11% — excellent"]},
  {id:2,emoji:"💰",title:"Save $6,000 This Year",target:6000,current:3240,unit:"$",color:"#2DD4BF",due:"Dec 31, 2025",tips:["Cancel 4 unused subscriptions → $840/yr saved immediately","Switch all grocery spend to Amex Gold (4x) → $300/yr extra","Cut takeout from $340 → $190/month → $1,800/yr saved"]},
  {id:3,emoji:"📈",title:"Reach 750 Credit Score",target:750,current:698,unit:"pts",color:"#F0B429",due:"Sep 2025",tips:["Bring all cards under 10% utilization → +12–18 pts in 30 days","Zero missed payments for 6 months → protects & builds history","Hard inquiry from Chase ages off in 3 months → +5–8 pts"]},
];

const BILLS:Bill[]=[
  {id:1,name:"Nobu Restaurant",emoji:"🍽️",amount:247,people:["You","Sarah","Mike","Priya"],date:"Today",done:false,card:"Amex Gold",pts:988},
  {id:2,name:"Airbnb — Miami Beach",emoji:"🏖️",amount:840,people:["You","James","Leila"],date:"Yesterday",done:false,card:"Sapphire Reserve",pts:2520},
  {id:3,name:"Whole Foods Run",emoji:"🛒",amount:120,people:["You","Roommate"],date:"May 10",done:true,card:"Amex Gold",pts:480},
];

const PERKS:Perk[]=[
  {card:"Chase Sapphire Reserve",name:"Annual Travel Credit",emoji:"✈️",used:180,total:300,resets:"Jan 1",urgent:false,cardColor:"#263878"},
  {card:"Amex Gold Card",name:"Monthly Dining Credit",emoji:"🍽️",used:60,total:120,resets:"Dec 31",urgent:true,cardColor:"#8B6010"},
  {card:"Amex Gold Card",name:"Monthly Uber Cash",emoji:"🚗",used:45,total:120,resets:"Monthly",urgent:true,cardColor:"#8B6010"},
  {card:"Capital One Venture X",name:"Annual Travel Portal",emoji:"🌍",used:0,total:300,resets:"Jan 1",urgent:false,cardColor:"#0D3355"},
];

const QCHIPS=["Which card for groceries?","Best card for dining out?","How do I reach 750 score?","Should I apply for Amex Gold?","How to use Chase points?","Which card for Amazon?"];

const TOT_PTS=CARDS.reduce((s,c)=>s+c.points,0);
const TOT_BAL=CARDS.reduce((s,c)=>s+c.balance,0);
const TOT_LIM=CARDS.reduce((s,c)=>s+c.limit,0);
const UTIL=Math.round(TOT_BAL/TOT_LIM*100);
const PTS_VAL=Math.round(TOT_PTS*0.015);

const f=(n:number)=>n.toLocaleString("en-US");
const pct=(a:number,b:number)=>Math.min(100,Math.round(a/b*100));
const uc=(u:number)=>u>30?"var(--rose)":u>20?"var(--amber)":"var(--emerald)";

function aiReply(q:string):string{
  const l=q.toLowerCase();
  if(/grocer|supermarket|whole food/i.test(l)) return "🛒 Use your Amex Gold — it earns 4x on groceries. On a $200 shop that's 800 points worth $12. Your Sapphire earns only 1x here, so switch every grocery run to Amex Gold immediately.";
  if(/dining|restaurant|eat|food|takeout/i.test(l)) return "🍽️ Amex Gold earns 4x at restaurants — the best in your wallet. On an $80 dinner you earn 320 points ≈ $4.80. Use Chase Sapphire (3x) as a backup if Amex isn't accepted.";
  if(/travel|flight|airline|hotel|trip/i.test(l)) return "✈️ Always use Chase Sapphire Reserve for travel — 3x points + primary rental car insurance + $300 annual travel credit. Your 84,200 UR points transfer 1:1 to Hyatt (2.2¢ each) = $1,852 in hotel value right now.";
  if(/amazon|online/i.test(l)) return "🛍️ Capital One Venture X earns 2x on all purchases including Amazon — best in your wallet for online shopping. Check if your Sapphire Reserve purchase protection applies on orders over $500.";
  if(/750|score|credit/i.test(l)) return "📈 To go from 698 → 750: (1) Pay Chase below $1,500 before statement closes → +12 pts. (2) Zero missed payments for 4 months → +10 pts. (3) No new card applications. You could hit 750 by September.";
  if(/amex gold|apply|worth/i.test(l)) return "💳 Yes — apply. You spend ~$420/month on dining + groceries = 1,680 pts/month ≈ $25 value. The $250 fee is offset by the $120 dining credit + $120 Uber Cash. Net cost: ~$10/year. The math works.";
  if(/utilization|balance/i.test(l)) return "📊 Your utilization is 18% overall — healthy. Chase: 15.6% ✓ | Amex: 8.9% ✓ | Venture X: 2.3% ✓. Pay $400 on Chase before the 18th and your utilization drops to 9% — that alone boosts your score 8–12 points.";
  if(/chase|sapphire|ultimate/i.test(l)) return "💎 Your 84,200 Chase UR points: transfer 1:1 to World of Hyatt at 2.2¢/pt = $1,852 in hotel value. Far better than the portal's 1.5¢/pt rate. Air France Flying Blue also runs transfer bonuses — check before transferring.";
  if(/point|redeem|transfer|miles/i.test(l)) return "🌟 Total: 157,800 points across all cards ≈ $2,367. Best right now: transfer 55,000 Chase UR to Air France for Business Class to Europe (cash value ~$3,200). That's 5.8¢/pt — exceptional.";
  return "Great question! Based on your wallet — Chase Sapphire Reserve (84,200 pts), Amex Gold (42,100 pts), and Venture X (31,500 pts) — I can give you specific advice. What are you trying to optimize: travel, credit score, or daily spending?";
}

function Bar({v,max,color="var(--violet)",h=5}:{v:number;max:number;color?:string;h?:number}){
  return <div className="track" style={{height:h}}><div className="fill" style={{width:`${pct(v,max)}%`,background:color,height:h}}/></div>;
}

function Ring({v,max,r=24,sw=5,color="var(--violet)"}:{v:number;max:number;r?:number;sw?:number;color?:string}){
  const sz=(r+sw)*2,c=sz/2,circ=2*Math.PI*r,off=circ*(1-pct(v,max)/100);
  return(
    <svg width={sz} height={sz} style={{transform:"rotate(-90deg)"}}>
      <circle cx={c} cy={c} r={r} fill="none" stroke="rgba(255,255,255,.06)" strokeWidth={sw}/>
      <circle cx={c} cy={c} r={r} fill="none" stroke={color} strokeWidth={sw} strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round" style={{transition:"stroke-dashoffset .9s cubic-bezier(.22,.68,0,1.2)"}}/>
    </svg>
  );
}

function Toggle({on,set}:{on:boolean;set:()=>void}){
  return(
    <button onClick={set} className="press" style={{width:48,height:28,borderRadius:14,flexShrink:0,background:on?"var(--violet)":"rgba(255,255,255,.08)",border:"none",position:"relative",transition:"background .25s"}}>
      <span style={{position:"absolute",top:4,left:on?22:4,width:20,height:20,borderRadius:"50%",background:"#fff",transition:"left .25s cubic-bezier(.22,.68,0,1.2)",boxShadow:"0 1px 6px rgba(0,0,0,.4)"}}/>
    </button>
  );
}

function Head({title,sub,cta,onCta,back}:{title:string;sub?:string;cta?:string;onCta?:()=>void;back?:()=>void}){
  return(
    <div className="px" style={{paddingTop:64,paddingBottom:24,display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
      <div style={{display:"flex",alignItems:"flex-end",gap:12}}>
        {back&&<button onClick={back} className="press" style={{width:40,height:40,borderRadius:12,background:"var(--card2)",border:"1.5px solid var(--border2)",fontSize:18,color:"var(--text2)",marginBottom:2}}>←</button>}
        <div>
          <h1 style={{fontSize:26,fontFamily:"var(--serif)",lineHeight:1.15,marginBottom:sub?4:0}}>{title}</h1>
          {sub&&<p style={{fontSize:13,color:"var(--text2)"}}>{sub}</p>}
        </div>
      </div>
      {cta&&<button onClick={onCta} className="chip cv press" style={{fontSize:12,fontWeight:700}}>{cta}</button>}
    </div>
  );
}

const NAV:[S,string,string][]=[["home","⊞","Home"],["cards","▣","Cards"],["chat","◎","AI"],["travel","◈","Travel"],["goals","◉","Goals"]];

function Nav({active,go}:{active:S;go:(s:S)=>void}){
  return(
    <nav className="glass nav-safe" style={{position:"fixed",bottom:0,left:0,right:0,maxWidth:430,margin:"0 auto",display:"flex",zIndex:300,borderTop:"1px solid var(--border2)"}}>
      {NAV.map(([id,icon,label])=>{
        const on=active===id;
        return(
          <button key={id} onClick={()=>go(id)} className="press" style={{flex:1,padding:"10px 0 8px",background:"none",border:"none",display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
            <span style={{fontSize:20,color:on?"var(--violet)":"var(--text3)",transition:"color .2s"}}>{icon}</span>
            <span style={{fontSize:10,fontWeight:600,color:on?"var(--violet)":"var(--text3)",transition:"color .2s",letterSpacing:.3}}>{label}</span>
            {on&&<span style={{width:20,height:2.5,borderRadius:99,background:"var(--violet)"}}/>}
          </button>
        );
      })}
    </nav>
  );
}

// ── ONBOARDING ────────────────────────────────────────────────────────────────

function Onboard({done}:{done:(n:string)=>void}){
  const [step,setStep]=useState(0);
  const [name,setName]=useState("");
  const [income,setIncome]=useState("");
  const [lifestyles,setLifestyles]=useState<string[]>([]);
  const [spending,setSpending]=useState({dining:"",groceries:"",travel:"",other:""});
  const [goal,setGoal]=useState("");

  const toggleLifestyle=(l:string)=>setLifestyles(prev=>prev.includes(l)?prev.filter(x=>x!==l):[...prev,l]);
  const setSp=(k:string,v:string)=>setSpending(p=>({...p,[k]:v}));

  const LIFESTYLES=["✈️ Frequent Traveler","🍽️ Foodie","💼 Business Professional","🏠 Homebody","🎮 Tech Enthusiast","🛍️ Fashion & Shopping"];
  const INCOMES=["Under $30,000","$30,000–$60,000","$60,000–$100,000","$100,000–$150,000","$150,000–$250,000","$250,000+"];

  const PrimaryBtn=({label,disabled,onClick}:{label:string;disabled?:boolean;onClick:()=>void})=>(
    <button onClick={onClick} disabled={disabled} className="press" style={{width:"100%",padding:"16px",borderRadius:14,border:"none",background:disabled?"rgba(255,255,255,.06)":"linear-gradient(135deg,var(--violet),var(--violet2))",color:disabled?"var(--text3)":"#fff",fontSize:15,fontWeight:700,boxShadow:disabled?"none":"0 4px 24px var(--violet-glow)",transition:"all .2s"}}>{label}</button>
  );

  return(
    <div style={{background:"var(--bg)",minHeight:"100vh",maxWidth:430,margin:"0 auto"}}>
      {step>0&&step<6&&(
        <div style={{position:"fixed",top:0,left:0,right:0,maxWidth:430,margin:"0 auto",height:3,background:"rgba(255,255,255,.06)",zIndex:999}}>
          <div style={{height:"100%",background:"linear-gradient(90deg,var(--violet),var(--sky))",width:`${(step/5)*100}%`,transition:"width .4s ease",borderRadius:99}}/>
        </div>
      )}
      {step>0&&step<6&&(
        <button onClick={()=>setStep(s=>s-1)} style={{position:"fixed",top:18,left:18,background:"none",border:"none",color:"var(--text3)",fontSize:24,zIndex:999}}>←</button>
      )}

      {step===0&&(
        <div className="au" style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",padding:"40px 28px",textAlign:"center"}}>
          <div style={{width:88,height:88,borderRadius:26,marginBottom:36,background:"linear-gradient(135deg,var(--violet),var(--violet2))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:40,boxShadow:"0 8px 40px var(--violet-glow)",animation:"glow 3s ease infinite"}}>💳</div>
          <h1 style={{fontSize:40,fontFamily:"var(--serif)",lineHeight:1.1,marginBottom:14}}>Your money,<br/><span className="gtext">working harder.</span></h1>
          <p style={{color:"var(--text2)",fontSize:15,lineHeight:1.8,marginBottom:48,maxWidth:300}}>The smartest credit card app ever built. 54 features, 3 optimization layers, one AI that knows your entire financial life.</p>
          <PrimaryBtn label="Get Started →" onClick={()=>setStep(1)}/>
          <p style={{color:"var(--text3)",fontSize:12,marginTop:16}}>Free forever · Takes 60 seconds</p>
        </div>
      )}

      {step===1&&(
        <div className="au" style={{padding:"80px 28px 40px"}}>
          <span className="chip cv" style={{marginBottom:16,display:"inline-flex"}}>Step 1 of 5</span>
          <h2 style={{fontSize:32,fontFamily:"var(--serif)",marginBottom:8,lineHeight:1.2}}>What's your name?</h2>
          <p style={{color:"var(--text2)",fontSize:14,marginBottom:32,lineHeight:1.6}}>We use this to personalize everything for you.</p>
          <input className="field" placeholder="Your first name" value={name} onChange={e=>setName(e.target.value)} style={{fontSize:20,padding:"18px 20px",marginBottom:28}} autoFocus onKeyDown={e=>e.key==="Enter"&&name.trim()&&setStep(2)}/>
          <PrimaryBtn label="Continue →" disabled={!name.trim()} onClick={()=>setStep(2)}/>
        </div>
      )}

      {step===2&&(
        <div className="au" style={{padding:"80px 28px 40px"}}>
          <span className="chip cv" style={{marginBottom:16,display:"inline-flex"}}>Step 2 of 5</span>
          <h2 style={{fontSize:32,fontFamily:"var(--serif)",marginBottom:8,lineHeight:1.2}}>About you</h2>
          <p style={{color:"var(--text2)",fontSize:14,marginBottom:28,lineHeight:1.6}}>Helps the AI find your perfect card stack.</p>

          <label style={{fontSize:12,color:"var(--text2)",fontWeight:600,textTransform:"uppercase",letterSpacing:.6,display:"block",marginBottom:8}}>Annual Income</label>
          <select className="field" value={income} onChange={e=>setIncome(e.target.value)} style={{marginBottom:28}}>
            <option value="">Select your range</option>
            {INCOMES.map(o=><option key={o} value={o}>{o}</option>)}
          </select>

          <label style={{fontSize:12,color:"var(--text2)",fontWeight:600,textTransform:"uppercase",letterSpacing:.6,display:"block",marginBottom:4}}>Your Lifestyle</label>
          <p style={{fontSize:12,color:"var(--text3)",marginBottom:12}}>Select all that apply — you can pick multiple</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:32}}>
            {LIFESTYLES.map(l=>{
              const on=lifestyles.includes(l);
              return(
                <button key={l} onClick={()=>toggleLifestyle(l)} className="press" style={{
                  padding:"13px 10px 13px 12px",borderRadius:13,textAlign:"left",
                  fontSize:12,fontWeight:500,position:"relative",
                  border:"1.5px solid "+(on?"var(--violet)":"var(--border)"),
                  background:on?"rgba(124,110,250,.14)":"var(--card)",
                  color:on?"var(--violet)":"var(--text2)",
                  transition:"all .15s",
                }}>
                  {on&&(
                    <span style={{position:"absolute",top:8,right:10,width:18,height:18,borderRadius:"50%",background:"var(--violet)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#fff",fontWeight:800}}>✓</span>
                  )}
                  {l}
                </button>
              );
            })}
          </div>
          <PrimaryBtn label="Continue →" disabled={!income||lifestyles.length===0} onClick={()=>setStep(3)}/>
        </div>
      )}

      {step===3&&(
        <div className="au" style={{padding:"80px 28px 40px"}}>
          <span className="chip cv" style={{marginBottom:16,display:"inline-flex"}}>Step 3 of 5</span>
          <h2 style={{fontSize:32,fontFamily:"var(--serif)",marginBottom:8,lineHeight:1.2}}>Monthly spending</h2>
          <p style={{color:"var(--text2)",fontSize:14,marginBottom:28,lineHeight:1.6}}>Approximate is fine — we use this to maximize your rewards.</p>
          {([["dining","🍽️ Dining & Takeout"],["groceries","🛒 Groceries"],["travel","✈️ Travel & Transport"],["other","🛍️ Shopping & Other"]] as [keyof typeof spending,string][]).map(([k,label])=>(
            <div key={k} style={{marginBottom:16}}>
              <label style={{fontSize:12,color:"var(--text2)",fontWeight:600,display:"block",marginBottom:6}}>{label}</label>
              <input className="field" type="number" placeholder="$ per month" value={spending[k]} onChange={e=>setSp(k,e.target.value)} style={{padding:"12px 16px"}}/>
            </div>
          ))}
          <div style={{marginTop:8}}><PrimaryBtn label="Continue →" onClick={()=>setStep(4)}/></div>
        </div>
      )}

      {step===4&&(
        <div className="au" style={{padding:"80px 28px 40px"}}>
          <span className="chip cv" style={{marginBottom:16,display:"inline-flex"}}>Step 4 of 5</span>
          <h2 style={{fontSize:32,fontFamily:"var(--serif)",marginBottom:8,lineHeight:1.2}}>Primary goal?</h2>
          <p style={{color:"var(--text2)",fontSize:14,marginBottom:24,lineHeight:1.6}}>We'll tailor everything around what matters most to you.</p>
          {([
            ["✈️","Maximize Travel Rewards","Earn points for free flights & hotels"],
            ["💰","Save More Money","Reduce spend and build savings"],
            ["📈","Build My Credit Score","Reach 750+ and unlock better cards"],
            ["💳","Optimize My Card Stack","Get the right cards for my lifestyle"],
          ] as [string,string,string][]).map(([emoji,title,desc])=>(
            <button key={title} onClick={()=>{setGoal(title);setStep(5);}} className="press hover" style={{
              width:"100%",padding:"16px 18px",marginBottom:10,
              background:goal===title?"rgba(124,110,250,.12)":"var(--card)",
              border:"1.5px solid "+(goal===title?"var(--violet)":"var(--border)"),
              borderRadius:16,textAlign:"left",display:"flex",gap:14,alignItems:"center",
              transition:"all .15s",
            }}>
              <span style={{fontSize:26}}>{emoji}</span>
              <div style={{flex:1}}>
                <p style={{color:"var(--text)",fontSize:14,fontWeight:600}}>{title}</p>
                <p style={{color:"var(--text2)",fontSize:12,marginTop:2}}>{desc}</p>
              </div>
              <span style={{color:"var(--text3)",fontSize:18}}>→</span>
            </button>
          ))}
        </div>
      )}

      {step===5&&(
        <div className="au" style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",padding:"40px 28px",textAlign:"center"}}>
          <div style={{width:88,height:88,borderRadius:26,marginBottom:32,background:"linear-gradient(135deg,var(--emerald),#0D9488)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:40,boxShadow:"0 8px 40px rgba(45,212,191,.3)"}}>✓</div>
          <h2 style={{fontSize:36,fontFamily:"var(--serif)",marginBottom:12,lineHeight:1.15}}>You're all set,<br/>{name}!</h2>
          <p style={{color:"var(--text2)",fontSize:14,lineHeight:1.8,marginBottom:48,maxWidth:280}}>Your AI financial twin is ready. We've loaded 3 sample cards to show you exactly how it works.</p>
          <PrimaryBtn label="Enter My Dashboard →" onClick={()=>done(name)}/>
        </div>
      )}
    </div>
  );
}

// ── HOME ─────────────────────────────────────────────────────────────────────

function Home({name,go}:{name:string;go:(s:S)=>void}){
  const h=new Date().getHours();
  const greet=h<12?"Good morning ☀️":h<17?"Good afternoon 👋":"Good evening 🌙";
  return(
    <div className="section" style={{padding:"60px 20px 100px"}}>
      <div className="au" style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:28,paddingTop:8}}>
        <div>
          <p style={{color:"var(--text2)",fontSize:13,marginBottom:3}}>{greet}</p>
          <h1 style={{fontSize:28,fontFamily:"var(--serif)",lineHeight:1}}>{name}</h1>
        </div>
        <button onClick={()=>go("settings")} className="press" style={{width:44,height:44,borderRadius:13,background:"var(--card2)",border:"1.5px solid var(--border2)",fontSize:18,color:"var(--text2)"}}>⚙</button>
      </div>

      <div className="au d1" style={{background:"linear-gradient(135deg,#3730A3 0%,#5B4BD4 40%,#3B82F6 80%,#2563EB 100%)",borderRadius:24,padding:"26px 22px",marginBottom:14,position:"relative",overflow:"hidden",boxShadow:"0 12px 48px rgba(91,75,212,.4)"}}>
        <div style={{position:"absolute",top:-30,right:-30,width:160,height:160,borderRadius:"50%",background:"rgba(255,255,255,.06)"}}/>
        <div style={{position:"absolute",bottom:-50,right:20,width:120,height:120,borderRadius:"50%",background:"rgba(255,255,255,.04)"}}/>
        <p style={{color:"rgba(255,255,255,.6)",fontSize:11,letterSpacing:1.4,textTransform:"uppercase",fontWeight:600,marginBottom:6}}>Total Portfolio Value</p>
        <h2 style={{fontSize:42,fontWeight:800,color:"#fff",letterSpacing:"-1px",marginBottom:4,lineHeight:1}}>{f(TOT_PTS)} <span style={{fontSize:17,fontWeight:400,opacity:.6}}>pts</span></h2>
        <p style={{color:"rgba(255,255,255,.65)",fontSize:14,marginBottom:22}}>≈ <strong style={{color:"#fff",fontSize:15}}>${f(PTS_VAL)}</strong> estimated cash value</p>
        <div style={{display:"flex",background:"rgba(0,0,0,.22)",borderRadius:14,padding:"12px 16px"}}>
          {[{l:"Balance",v:`$${f(TOT_BAL)}`,c:"#fff"},{l:"Utilization",v:`${UTIL}%`,c:uc(UTIL)},{l:"Cards",v:`${CARDS.length}`,c:"#fff"}].map(({l,v,c},i)=>(
            <div key={l} style={{flex:1,textAlign:i===1?"center":"left",borderLeft:i>0?"1px solid rgba(255,255,255,.15)":"none",paddingLeft:i>0?14:0}}>
              <p style={{color:"rgba(255,255,255,.45)",fontSize:10,marginBottom:4}}>{l}</p>
              <p style={{color:c,fontSize:17,fontWeight:700}}>{v}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="au d2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:26}}>
        {([["◎","Ask AI","Which card?","chat","var(--violet)"],["◈","Travel","Book with pts","travel","var(--sky)"],["▣","Split Bill","Group dinner","split","var(--emerald)"],["◉","Goals","Track progress","goals","var(--gold)"]] as [string,string,string,S,string][]).map(([icon,label,sub,target,color])=>(
          <button key={label} onClick={()=>go(target)} className="hover press" style={{background:"var(--card)",border:"1.5px solid var(--border)",borderRadius:18,padding:"18px 16px",textAlign:"left",width:"100%"}}>
            <span style={{fontSize:24,color,display:"block",marginBottom:10}}>{icon}</span>
            <p style={{color:"var(--text)",fontSize:14,fontWeight:600}}>{label}</p>
            <p style={{color:"var(--text2)",fontSize:11,marginTop:3}}>{sub}</p>
          </button>
        ))}
      </div>

      <div className="au d3">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <h3 style={{fontSize:17,fontWeight:700}}>My Cards</h3>
          <button onClick={()=>go("cards")} style={{color:"var(--violet)",fontSize:12,fontWeight:600,background:"none",border:"none"}}>See all →</button>
        </div>
        {CARDS.slice(0,2).map(c=>(
          <button key={c.id} onClick={()=>go("cards")} className="hover press" style={{width:"100%",background:"var(--card)",border:"1.5px solid var(--border)",borderRadius:18,padding:"14px 16px",marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center",textAlign:"left"}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:44,height:30,borderRadius:8,background:c.color,boxShadow:"0 3px 10px rgba(0,0,0,.5)"}}/>
              <div>
                <p style={{color:"var(--text)",fontSize:14,fontWeight:600}}>{c.name}</p>
                <p style={{color:"var(--text2)",fontSize:11,marginTop:2}}>{c.issuer} · {c.reward}</p>
              </div>
            </div>
            <div style={{textAlign:"right"}}>
              <p style={{color:"var(--violet)",fontSize:14,fontWeight:700}}>{f(c.points)}<span style={{fontSize:10,opacity:.6}}> pts</span></p>
              <p style={{color:"var(--text2)",fontSize:11,marginTop:2}}>${f(c.balance)} bal</p>
            </div>
          </button>
        ))}
      </div>

      <button onClick={()=>go("perks")} className="au d4 press hover" style={{width:"100%",background:"rgba(240,180,41,.05)",border:"1.5px solid rgba(240,180,41,.2)",borderRadius:18,padding:"16px",marginTop:4,textAlign:"left"}}>
        <div style={{display:"flex",gap:12}}>
          <span style={{fontSize:22}}>⚠️</span>
          <div>
            <p style={{color:"var(--gold)",fontSize:14,fontWeight:700,marginBottom:4}}>2 perks expiring soon</p>
            <p style={{color:"var(--text2)",fontSize:12,lineHeight:1.55}}>Amex $120 Dining Credit resets Dec 31 — $60 remaining. Don't let it expire.</p>
            <p style={{color:"var(--gold)",fontSize:12,fontWeight:600,marginTop:6}}>View all perks →</p>
          </div>
        </div>
      </button>
    </div>
  );
}

// ── CARDS ─────────────────────────────────────────────────────────────────────

function Cards({go}:{go:(s:S)=>void}){
  const [open,setOpen]=useState<number|null>(null);
  return(
    <div className="section">
      <Head title="My Cards" sub={`${CARDS.length} cards · ${f(TOT_PTS)} total points`}/>
      <div className="px">
        {CARDS.map((card,i)=>{
          const u=pct(card.balance,card.limit),isOpen=open===card.id;
          return(
            <div key={card.id} className={`au d${i+1} hover`} style={{background:"var(--card)",border:"1.5px solid "+(isOpen?"var(--violet)":"var(--border)"),borderRadius:22,marginBottom:16,overflow:"hidden",cursor:"pointer",transition:"border-color .2s"}} onClick={()=>setOpen(isOpen?null:card.id)}>
              <div style={{background:card.color,padding:"22px 20px",position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",top:-25,right:-25,width:110,height:110,borderRadius:"50%",background:"rgba(255,255,255,.07)"}}/>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18}}>
                  <div>
                    <p style={{color:"rgba(255,255,255,.5)",fontSize:11,letterSpacing:1.2,textTransform:"uppercase",marginBottom:3}}>{card.issuer}</p>
                    <p style={{color:card.textColor,fontSize:19,fontWeight:700}}>{card.name}</p>
                  </div>
                  <span className="chip" style={{background:"rgba(255,255,255,.14)",color:"#fff"}}>{card.reward}</span>
                </div>
                <div style={{display:"flex",gap:22}}>
                  {[{l:"Points",v:f(card.points)},{l:"Balance",v:`$${f(card.balance)}`},{l:"Limit",v:`$${f(card.limit)}`}].map(({l,v})=>(
                    <div key={l}>
                      <p style={{color:"rgba(255,255,255,.4)",fontSize:10,textTransform:"uppercase",letterSpacing:.8,marginBottom:3}}>{l}</p>
                      <p style={{color:"#fff",fontSize:17,fontWeight:700}}>{v}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{padding:"14px 20px"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}>
                  <span style={{color:"var(--text2)",fontSize:12}}>Credit Utilization</span>
                  <span style={{color:uc(u),fontSize:12,fontWeight:700}}>{u}% {u<=30?"✓":""}</span>
                </div>
                <Bar v={card.balance} max={card.limit} color={uc(u)} h={7}/>
              </div>
              {isOpen&&(
                <div className="ai" style={{padding:"0 20px 18px",borderTop:"1px solid var(--border)"}}>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:14}}>
                    {[{l:"Annual Fee",v:`$${card.fee}`,c:"var(--text)"},{l:"Perks Value",v:`$${card.perks}/yr`,c:"var(--emerald)"},{l:"Net Benefit",v:`+$${card.perks-card.fee}/yr`,c:card.perks>card.fee?"var(--emerald)":"var(--rose)"},{l:"APR",v:card.rate,c:"var(--text2)"},{l:"Pts Cash Value",v:`~$${f(Math.round(card.points*.015))}`,c:"var(--violet)"},{l:"Pay Before",v:"Statement close",c:"var(--amber)"}].map(({l,v,c})=>(
                      <div key={l} style={{background:"var(--card2)",borderRadius:11,padding:"10px 12px"}}>
                        <p style={{color:"var(--text3)",fontSize:10,marginBottom:4}}>{l}</p>
                        <p style={{color:c,fontSize:13,fontWeight:700}}>{v}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        <button className="press" style={{width:"100%",padding:"18px",background:"none",border:"2px dashed rgba(255,255,255,.1)",borderRadius:22,color:"var(--text3)",fontSize:14,transition:"all .2s"}}
          onMouseOver={e=>{e.currentTarget.style.borderColor="var(--violet)";e.currentTarget.style.color="var(--violet)"}}
          onMouseOut={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,.1)";e.currentTarget.style.color="var(--text3)"}}>
          + Add a new card
        </button>
      </div>
    </div>
  );
}

// ── CHAT ──────────────────────────────────────────────────────────────────────

function Chat(){
  const [msgs,setMsgs]=useState<Msg[]>([{role:"ai",text:"Hi! I'm your AI financial twin. I know your exact cards, balances, points, and goals. Ask me anything — which card to use right now, how to boost your credit score, or the best way to book a free flight with your points.",id:0}]);
  const [val,setVal]=useState("");
  const [busy,setBusy]=useState(false);
  const [nextId,setNextId]=useState(1);
  const endRef=useRef<HTMLDivElement>(null);

  useEffect(()=>{endRef.current?.scrollIntoView({behavior:"smooth"});},[msgs,busy]);

  const send=useCallback((text:string)=>{
    if(!text.trim()||busy) return;
    const uid=nextId;
    setMsgs(p=>[...p,{role:"user",text,id:uid}]);
    setNextId(n=>n+2);
    setVal("");setBusy(true);
    setTimeout(()=>{
      setMsgs(p=>[...p,{role:"ai",text:aiReply(text),id:uid+1}]);
      setBusy(false);
    },900+Math.random()*600);
  },[busy,nextId]);

  return(
    <div style={{display:"flex",flexDirection:"column",height:"100vh",background:"var(--bg)"}}>
      <div className="glass" style={{padding:"56px 20px 14px",borderBottom:"1px solid var(--border2)",position:"sticky",top:0,zIndex:10}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:42,height:42,borderRadius:13,background:"linear-gradient(135deg,var(--violet),var(--violet2))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,boxShadow:"0 4px 16px var(--violet-glow)"}}>◎</div>
          <div>
            <h2 style={{fontSize:17,fontWeight:700}}>AI Financial Twin</h2>
            <div style={{display:"flex",alignItems:"center",gap:6,marginTop:2}}>
              <span style={{width:8,height:8,borderRadius:"50%",background:"var(--emerald)",display:"inline-block"}}/>
              <span style={{color:"var(--text2)",fontSize:11}}>Knows your full wallet & goals</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{flex:1,overflowY:"auto",padding:"16px 16px 0",display:"flex",flexDirection:"column",gap:14}}>
        {msgs.map(m=>(
          <div key={m.id} className="ai" style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",alignItems:"flex-end",gap:8}}>
            {m.role==="ai"&&<div style={{width:32,height:32,borderRadius:10,flexShrink:0,background:"linear-gradient(135deg,var(--violet),var(--violet2))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}>◎</div>}
            <div style={{maxWidth:"78%",padding:"13px 16px",borderRadius:m.role==="user"?"20px 20px 5px 20px":"20px 20px 20px 5px",background:m.role==="user"?"linear-gradient(135deg,var(--violet),var(--violet2))":"var(--card)",border:m.role==="ai"?"1.5px solid var(--border2)":"none",boxShadow:m.role==="user"?"0 4px 20px var(--violet-glow)":"0 2px 12px rgba(0,0,0,.3)"}}>
              <p style={{color:"var(--text)",fontSize:14,lineHeight:1.7}}>{m.text}</p>
            </div>
          </div>
        ))}
        {busy&&(
          <div className="ai" style={{display:"flex",alignItems:"flex-end",gap:8}}>
            <div style={{width:32,height:32,borderRadius:10,background:"linear-gradient(135deg,var(--violet),var(--violet2))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}>◎</div>
            <div style={{padding:"14px 18px",borderRadius:"20px 20px 20px 5px",background:"var(--card)",border:"1.5px solid var(--border2)"}}>
              <div style={{display:"flex",gap:5,alignItems:"center"}}>
                {[0,1,2].map(i=><span key={i} style={{width:8,height:8,borderRadius:"50%",background:"var(--violet)",display:"inline-block",animation:"blink 1.2s ease infinite",animationDelay:`${i*.2}s`}}/>)}
              </div>
            </div>
          </div>
        )}
        <div ref={endRef}/>
      </div>

      <div className="glass" style={{borderTop:"1px solid var(--border2)",padding:"12px 16px 16px"}}>
        <div style={{display:"flex",gap:7,overflowX:"auto",marginBottom:10,paddingBottom:2}}>
          {QCHIPS.map(q=>(
            <button key={q} onClick={()=>send(q)} className="press" style={{flexShrink:0,padding:"7px 14px",borderRadius:20,background:"var(--card2)",border:"1.5px solid var(--border2)",color:"var(--text2)",fontSize:11,fontWeight:500,whiteSpace:"nowrap",transition:"all .15s"}}
              onMouseOver={e=>{e.currentTarget.style.borderColor="var(--violet)";e.currentTarget.style.color="var(--violet)"}}
              onMouseOut={e=>{e.currentTarget.style.borderColor="var(--border2)";e.currentTarget.style.color="var(--text2)"}}>
              {q}
            </button>
          ))}
        </div>
        <div style={{display:"flex",gap:8}}>
          <input className="field" value={val} onChange={e=>setVal(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send(val)} placeholder="Ask anything about your cards..." style={{flex:1,padding:"13px 16px"}}/>
          <button onClick={()=>send(val)} disabled={!val.trim()||busy} className="press" style={{padding:"13px 20px",borderRadius:12,border:"none",background:val.trim()&&!busy?"linear-gradient(135deg,var(--violet),var(--violet2))":"rgba(255,255,255,.06)",color:val.trim()&&!busy?"#fff":"var(--text3)",fontSize:18,transition:"all .2s",boxShadow:val.trim()&&!busy?"0 4px 20px var(--violet-glow)":"none"}}>→</button>
        </div>
      </div>
    </div>
  );
}

// ── TRAVEL ────────────────────────────────────────────────────────────────────

function Travel(){
  const [tab,setTab]=useState(0);
  return(
    <div className="section">
      <Head title="Travel & Points" sub="Maximize every mile"/>
      <div className="px">
        <div className="au" style={{display:"flex",gap:5,marginBottom:24,background:"var(--card)",padding:4,borderRadius:14}}>
          {["Points","Book Travel","Transfer"].map((t,i)=>(
            <button key={t} onClick={()=>setTab(i)} className="press" style={{flex:1,padding:"10px",borderRadius:11,border:"none",background:tab===i?"var(--violet)":"none",color:tab===i?"#fff":"var(--text2)",fontSize:12,fontWeight:700,transition:"all .2s"}}>{t}</button>
          ))}
        </div>

        {tab===0&&(
          <div className="ai">
            <div style={{background:"var(--card)",border:"1.5px solid var(--border)",borderRadius:22,padding:22,marginBottom:16}}>
              <p style={{color:"var(--text2)",fontSize:12,marginBottom:5}}>Total points across all programs</p>
              <h2 style={{fontSize:36,fontWeight:800,letterSpacing:"-1px",marginBottom:5}}>{f(TOT_PTS)}</h2>
              <p style={{color:"var(--violet)",fontSize:15,fontWeight:600}}>≈ ${f(PTS_VAL)} estimated cash value</p>
            </div>
            {CARDS.map((c,i)=>(
              <div key={c.id} className={`au d${i+1}`} style={{background:"var(--card)",border:"1.5px solid var(--border)",borderRadius:16,padding:"14px 16px",marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:42,height:28,borderRadius:7,background:c.color,boxShadow:"0 2px 8px rgba(0,0,0,.5)"}}/>
                  <div><p style={{color:"var(--text)",fontSize:13,fontWeight:600}}>{c.name}</p><p style={{color:"var(--text2)",fontSize:11,marginTop:2}}>{c.issuer}</p></div>
                </div>
                <div style={{textAlign:"right"}}><p style={{color:"var(--text)",fontSize:14,fontWeight:700}}>{f(c.points)}</p><p style={{color:"var(--violet)",fontSize:11,marginTop:2}}>≈ ${f(Math.round(c.points*.015))}</p></div>
              </div>
            ))}
          </div>
        )}

        {tab===1&&(
          <div className="ai">
            <p style={{color:"var(--text2)",fontSize:13,marginBottom:16}}>🔥 Best redemptions with your current points</p>
            {[
              {route:"US → Europe Business Class",pts:"55,000 pts",via:"Air France via Chase UR",val:"~$3,200 ticket",cpp:"5.8¢/pt"},
              {route:"US → Japan Economy",pts:"35,000 pts",via:"ANA via Amex MR",val:"~$1,100 ticket",cpp:"3.1¢/pt"},
              {route:"Park Hyatt Tokyo",pts:"35,000 pts/night",via:"World of Hyatt",val:"~$700/night",cpp:"2.0¢/pt"},
              {route:"US → Caribbean",pts:"25,000 pts",via:"Delta via Amex MR",val:"~$650 ticket",cpp:"2.6¢/pt"},
            ].map((r,i)=>(
              <div key={i} className={`au d${i+1} hover`} style={{background:"var(--card)",border:"1.5px solid var(--border)",borderRadius:18,padding:"16px 18px",marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                  <p style={{color:"var(--text)",fontSize:14,fontWeight:600,flex:1,paddingRight:10}}>{r.route}</p>
                  <span className="chip cv">{r.cpp}</span>
                </div>
                <p style={{color:"var(--text2)",fontSize:12,marginBottom:8}}>{r.via}</p>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <span style={{color:"var(--violet)",fontSize:13,fontWeight:700}}>{r.pts}</span>
                  <span style={{color:"var(--emerald)",fontSize:13,fontWeight:600}}>{r.val}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab===2&&(
          <div className="ai">
            <div style={{background:"var(--card2)",border:"1.5px solid var(--border)",borderRadius:12,padding:"12px 16px",marginBottom:16}}>
              <p style={{color:"var(--text2)",fontSize:12}}>Optimizing <strong style={{color:"var(--text)"}}>Chase UR (84,200 pts)</strong></p>
            </div>
            {[
              {p:"World of Hyatt",v:"2.2¢/pt",best:true,n:"Luxury hotels — best overall value"},
              {p:"British Airways Avios",v:"1.8¢/pt",best:false,n:"Short-haul & partner flights"},
              {p:"Air France/KLM Flying Blue",v:"1.6¢/pt",best:false,n:"Transatlantic Business Class"},
              {p:"United MileagePlus",v:"1.5¢/pt",best:false,n:"Domestic & Star Alliance"},
              {p:"Singapore Airlines KrisFlyer",v:"1.4¢/pt",best:false,n:"Premium cabins Asia-Pacific"},
            ].map((p,i)=>(
              <div key={i} className={`au d${i+1}`} style={{background:"var(--card)",border:"1.5px solid "+(p.best?"var(--violet)":"var(--border)"),borderRadius:16,padding:"14px 18px",marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                    <p style={{color:"var(--text)",fontSize:13,fontWeight:600}}>{p.p}</p>
                    {p.best&&<span className="chip cv">Best Value</span>}
                  </div>
                  <p style={{color:"var(--text2)",fontSize:11}}>{p.n} · 1:1 ratio</p>
                </div>
                <p style={{color:"var(--emerald)",fontSize:17,fontWeight:800}}>{p.v}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── GOALS ─────────────────────────────────────────────────────────────────────

function Goals(){
  const [add,setAdd]=useState(false);
  const [open,setOpen]=useState<number|null>(null);
  return(
    <div className="section">
      <Head title="My Goals" sub="Your financial targets" cta="+ Add Goal" onCta={()=>setAdd(a=>!a)}/>
      <div className="px">
        {add&&(
          <div className="ap" style={{background:"var(--card)",border:"1.5px solid var(--violet)",borderRadius:22,padding:20,marginBottom:20}}>
            <p style={{color:"var(--text)",fontSize:15,fontWeight:700,marginBottom:14}}>Choose a goal type</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {[["📊","Utilization","Keep cards under 30%"],["💰","Save Money","Hit a savings target"],["📈","Credit Score","Reach 750+"],["✈️","Travel Goal","Earn points for a trip"],["💳","Pay Off Debt","Become debt free"],["🛡️","Emergency Fund","3–6 months expenses"]].map(([e,t,d])=>(
                <button key={t} onClick={()=>setAdd(false)} className="press hover" style={{background:"var(--card2)",border:"1.5px solid var(--border)",borderRadius:14,padding:"14px 12px",textAlign:"left"}}>
                  <p style={{fontSize:22,marginBottom:6}}>{e}</p>
                  <p style={{color:"var(--text)",fontSize:12,fontWeight:700}}>{t}</p>
                  <p style={{color:"var(--text2)",fontSize:11,marginTop:2}}>{d}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {GOALS.map((g,i)=>{
          const p=pct(g.current,g.target),isOpen=open===g.id;
          return(
            <div key={g.id} className={`au d${i+1}`} style={{background:"var(--card)",border:"1.5px solid var(--border)",borderRadius:22,padding:"20px",marginBottom:16}}>
              <div style={{display:"flex",gap:14,alignItems:"flex-start",marginBottom:16}}>
                <div style={{width:52,height:52,borderRadius:16,flexShrink:0,background:g.color+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>{g.emoji}</div>
                <div style={{flex:1}}>
                  <p style={{color:"var(--text)",fontSize:15,fontWeight:700,marginBottom:3}}>{g.title}</p>
                  <p style={{color:"var(--text2)",fontSize:12}}>Due: {g.due}</p>
                </div>
                <div style={{position:"relative",flexShrink:0}}>
                  <Ring v={g.current} max={g.target} color={g.color} r={24} sw={5}/>
                  <span style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",fontSize:11,fontWeight:800,color:g.color}}>{p}%</span>
                </div>
              </div>
              <Bar v={g.current} max={g.target} color={g.color} h={7}/>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:8,marginBottom:14}}>
                <p style={{color:"var(--text2)",fontSize:12}}>{g.unit==="$"?"$":""}{f(g.current)}{g.unit!=="$"?" "+g.unit:""}</p>
                <p style={{color:"var(--text2)",fontSize:12}}>Target: {g.unit==="$"?"$":""}{f(g.target)}{g.unit!=="$"?" "+g.unit:""}</p>
              </div>
              <button onClick={()=>setOpen(isOpen?null:g.id)} style={{background:"none",border:"none",color:"var(--violet)",fontSize:13,fontWeight:600,padding:0}}>
                {isOpen?"Hide":"See"} action plan {isOpen?"↑":"↓"}
              </button>
              {isOpen&&(
                <div className="ai" style={{marginTop:14,background:"var(--card2)",borderRadius:14,padding:"14px 16px"}}>
                  <p style={{color:"var(--text3)",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.8,marginBottom:12}}>Your Action Plan</p>
                  {g.tips.map((tip,ti)=>(
                    <div key={ti} style={{display:"flex",gap:10,marginBottom:ti<g.tips.length-1?12:0}}>
                      <span style={{width:22,height:22,borderRadius:"50%",flexShrink:0,marginTop:1,background:g.color+"20",color:g.color,fontSize:11,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center"}}>{ti+1}</span>
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

// ── SPLIT ─────────────────────────────────────────────────────────────────────

function Split(){
  const [popup,setPopup]=useState(true);
  const [sel,setSel]=useState<string[]>([]);
  const [tab,setTab]=useState(0);
  const PEOPLE=["Sarah","Mike","Priya","James","Leila","Omar"];
  const pp=sel.length>0?(247/(sel.length+1)).toFixed(2):"—";
  const toggleP=(p:string)=>setSel(prev=>prev.includes(p)?prev.filter(x=>x!==p):[...prev,p]);

  return(
    <div className="section">
      <Head title="Split Bills" sub="Fair splits · Smart card picks"/>
      <div className="px">
        {popup&&(
          <div className="ap" style={{background:"var(--card)",border:"1.5px solid var(--violet)",borderRadius:22,padding:20,marginBottom:20,position:"relative"}}>
            <button onClick={()=>setPopup(false)} style={{position:"absolute",top:16,right:18,background:"none",border:"none",color:"var(--text3)",fontSize:20}}>✕</button>
            <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:14}}>
              <span style={{fontSize:32}}>🍽️</span>
              <div><p style={{color:"var(--text)",fontSize:17,fontWeight:700,marginBottom:2}}>$247 at Nobu</p><p style={{color:"var(--text2)",fontSize:12}}>Paid with Amex Gold · 988 pts earned</p></div>
            </div>
            <div style={{background:"rgba(45,212,191,.07)",border:"1px solid rgba(45,212,191,.2)",borderRadius:12,padding:"10px 14px",marginBottom:16}}>
              <p style={{color:"var(--emerald)",fontSize:13,lineHeight:1.5}}>💡 4x dining = <strong>988 pts ≈ $14.82</strong> on Amex Gold. Great choice!</p>
            </div>
            <p style={{color:"var(--text2)",fontSize:13,fontWeight:500,marginBottom:10}}>Who did you dine with? <span style={{color:"var(--text3)",fontWeight:400}}>(select multiple)</span></p>
            <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:16}}>
              {PEOPLE.map(p=>{
                const on=sel.includes(p);
                return(
                  <button key={p} onClick={()=>toggleP(p)} className="press" style={{padding:"8px 16px",borderRadius:22,fontSize:13,fontWeight:600,border:"1.5px solid "+(on?"var(--violet)":"var(--border2)"),background:on?"rgba(124,110,250,.14)":"var(--card2)",color:on?"var(--violet)":"var(--text2)",transition:"all .15s"}}>
                    {on?"✓ ":""}{p}
                  </button>
                );
              })}
            </div>
            {sel.length>0&&(
              <div className="ai" style={{background:"var(--card2)",borderRadius:12,padding:"12px 16px",marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <p style={{color:"var(--text2)",fontSize:13}}>Split {sel.length+1} ways</p>
                <p style={{color:"var(--emerald)",fontSize:18,fontWeight:800}}>${pp} each</p>
              </div>
            )}
            <button onClick={()=>setPopup(false)} className="press" style={{width:"100%",padding:"14px",borderRadius:14,border:"none",background:"linear-gradient(135deg,var(--violet),var(--violet2))",color:"#fff",fontSize:15,fontWeight:700,boxShadow:"0 4px 20px var(--violet-glow)"}}>
              ✓ Create Split {sel.length>0?`(${sel.length+1} people)`:""}
            </button>
          </div>
        )}

        <div style={{display:"flex",gap:5,marginBottom:20,background:"var(--card)",padding:4,borderRadius:13}}>
          {["Active","History"].map((t,i)=>(
            <button key={t} onClick={()=>setTab(i)} className="press" style={{flex:1,padding:"9px",borderRadius:10,border:"none",background:tab===i?"var(--violet)":"none",color:tab===i?"#fff":"var(--text2)",fontSize:12,fontWeight:700,transition:"all .2s"}}>{t}</button>
          ))}
        </div>

        {BILLS.filter(b=>tab===0?!b.done:b.done).map((bill,i)=>(
          <div key={bill.id} className={`au d${i+1}`} style={{background:"var(--card)",border:"1.5px solid var(--border)",borderRadius:18,padding:"16px 18px",marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:24}}>{bill.emoji}</span>
                <div><p style={{color:"var(--text)",fontSize:14,fontWeight:700}}>{bill.name}</p><p style={{color:"var(--text2)",fontSize:11,marginTop:2}}>{bill.date} · {bill.card}</p></div>
              </div>
              <div style={{textAlign:"right"}}><p style={{color:"var(--text)",fontSize:16,fontWeight:800}}>${f(bill.amount)}</p><p style={{color:"var(--violet)",fontSize:12,marginTop:2}}>${(bill.amount/bill.people.length).toFixed(2)}/person</p></div>
            </div>
            <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:12}}>
              {bill.people.map(p=><span key={p} className="chip" style={{background:bill.done?"rgba(45,212,191,.1)":"rgba(124,110,250,.1)",color:bill.done?"var(--emerald)":"var(--violet)"}}>{p}</span>)}
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <p style={{color:"var(--text2)",fontSize:12}}>💳 {f(bill.pts)} pts earned</p>
              {!bill.done?(
                <div style={{display:"flex",gap:7}}>
                  <button className="press" style={{padding:"7px 12px",background:"var(--card2)",border:"1.5px solid var(--border2)",borderRadius:9,color:"var(--text2)",fontSize:11,fontWeight:600}}>Remind</button>
                  <button className="press" style={{padding:"7px 16px",background:"rgba(45,212,191,.1)",border:"1.5px solid rgba(45,212,191,.3)",borderRadius:9,color:"var(--emerald)",fontSize:11,fontWeight:700}}>Settle via Venmo</button>
                </div>
              ):<span className="chip ce">✓ Settled</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── PERKS ─────────────────────────────────────────────────────────────────────

function Perks(){
  const totalLeft=PERKS.reduce((s,p)=>s+(p.total-p.used),0);
  return(
    <div className="section">
      <Head title="Perks & Credits" sub="Don't let real money expire"/>
      <div className="px">
        <div className="au" style={{background:"rgba(240,180,41,.05)",border:"1.5px solid rgba(240,180,41,.18)",borderRadius:20,padding:"18px 20px",marginBottom:22}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <div><p style={{color:"var(--gold)",fontSize:13,fontWeight:600,marginBottom:4}}>Credits remaining this year</p><h2 style={{fontSize:34,fontWeight:800,letterSpacing:"-1px",color:"var(--text)"}}>${f(totalLeft)}</h2></div>
            <span style={{fontSize:42}}>💎</span>
          </div>
          <p style={{color:"var(--text2)",fontSize:13,lineHeight:1.5}}>Money you've already paid for — use it before it resets.</p>
        </div>
        {PERKS.map((perk,i)=>{
          const rem=perk.total-perk.used,p=pct(perk.used,perk.total);
          return(
            <div key={i} className={`au d${i+1} hover`} style={{background:"var(--card)",border:"1.5px solid "+(perk.urgent?"rgba(240,180,41,.25)":"var(--border)"),borderRadius:18,padding:"18px",marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:40,height:28,borderRadius:8,background:perk.cardColor,boxShadow:"0 3px 10px rgba(0,0,0,.4)",flexShrink:0}}/>
                  <div>
                    <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:3}}>
                      <span style={{fontSize:16}}>{perk.emoji}</span>
                      <p style={{color:"var(--text)",fontSize:13,fontWeight:700}}>{perk.name}</p>
                      {perk.urgent&&<span className="chip cg">Expiring</span>}
                    </div>
                    <p style={{color:"var(--text2)",fontSize:11}}>{perk.card}</p>
                  </div>
                </div>
                <div style={{textAlign:"right"}}><p style={{color:"var(--text)",fontSize:18,fontWeight:800}}>${rem}</p><p style={{color:"var(--text3)",fontSize:11,marginTop:2}}>of ${perk.total}</p></div>
              </div>
              <Bar v={perk.used} max={perk.total} color={p>80?"var(--emerald)":p>40?"var(--violet)":"var(--rose)"} h={7}/>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:8}}>
                <p style={{color:"var(--text3)",fontSize:12}}>${perk.used} used · ${rem} left</p>
                <p style={{color:perk.urgent?"var(--gold)":"var(--text3)",fontSize:12,fontWeight:perk.urgent?600:400}}>Resets {perk.resets}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── SETTINGS ──────────────────────────────────────────────────────────────────

function Settings({go,name}:{go:(s:S)=>void;name:string}){
  const [t,setT]=useState({ai:true,geo:true,digest:true,split:true,travel:true,perks:true,fraud:true,goals:true});
  const tog=(k:keyof typeof t)=>setT(p=>({...p,[k]:!p[k]}));
  const FEATS:[keyof typeof t,string,string,string][]=[
    ["ai","◎","AI Chatbot","Your personal financial advisor"],
    ["geo","📍","Geo Nudges","Card tips when entering stores"],
    ["digest","📧","Weekly AI Digest","Monday rewards & tips recap"],
    ["split","🍽️","Bill Splitting","Split bills with friends"],
    ["travel","✈️","Travel & Points","Points booking & transfers"],
    ["perks","💎","Perks Tracker","Track credits & benefits"],
    ["fraud","🛡️","Fraud Alerts","Real-time security alerts"],
    ["goals","🎯","Goal Engine","Financial goal tracking"],
  ];
  return(
    <div className="section">
      <Head title="Settings" back={()=>go("home")}/>
      <div className="px">
        <div className="au" style={{background:"linear-gradient(135deg,var(--violet),var(--violet2))",borderRadius:20,padding:"20px 22px",marginBottom:28,display:"flex",alignItems:"center",gap:16,boxShadow:"0 8px 32px var(--violet-glow)"}}>
          <div style={{width:56,height:56,borderRadius:18,background:"rgba(255,255,255,.18)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>👤</div>
          <div><p style={{color:"rgba(255,255,255,.65)",fontSize:12,marginBottom:3}}>Signed in as</p><p style={{color:"#fff",fontSize:20,fontWeight:700}}>{name}</p></div>
        </div>

        <p style={{color:"var(--text3)",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>Feature Toggles</p>
        <div className="au" style={{background:"var(--card)",border:"1.5px solid var(--border)",borderRadius:20,overflow:"hidden",marginBottom:24}}>
          {FEATS.map(([key,icon,label,desc],i)=>(
            <div key={key} style={{display:"flex",alignItems:"center",gap:12,padding:"15px 18px",borderBottom:i<FEATS.length-1?"1px solid var(--border)":"none"}}>
              <span style={{fontSize:18,width:28,textAlign:"center"}}>{icon}</span>
              <div style={{flex:1}}><p style={{color:"var(--text)",fontSize:13,fontWeight:600}}>{label}</p><p style={{color:"var(--text2)",fontSize:11,marginTop:2}}>{desc}</p></div>
              <Toggle on={t[key]} set={()=>tog(key)}/>
            </div>
          ))}
        </div>

        <p style={{color:"var(--text3)",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.8,marginBottom:10}}>Account</p>
        <div className="au d2" style={{background:"var(--card)",border:"1.5px solid var(--border)",borderRadius:20,overflow:"hidden"}}>
          {["Edit Profile","Notification Preferences","Privacy & Security","Share Feedback","Rate the App","About"].map((item,i,arr)=>(
            <button key={item} className="press" style={{width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",padding:"15px 18px",background:"none",border:"none",borderBottom:i<arr.length-1?"1px solid var(--border)":"none",textAlign:"left"}}>
              <p style={{color:"var(--text)",fontSize:13,fontWeight:500}}>{item}</p>
              <span style={{color:"var(--text3)",fontSize:16}}>→</span>
            </button>
          ))}
        </div>
        <p style={{color:"var(--text3)",fontSize:12,textAlign:"center",marginTop:32,lineHeight:1.6}}>Credit Card Optimizer · Prototype v1.0<br/>Built for user feedback</p>
      </div>
    </div>
  );
}

// ── ROOT ──────────────────────────────────────────────────────────────────────

export default function App(){
  const [screen,setScreen]=useState<S>("onboard");
  const [name,setName]=useState("there");

  useEffect(()=>{
    const el=document.createElement("style");
    el.textContent=CSS;
    document.head.appendChild(el);
    return()=>document.head.removeChild(el);
  },[]);

  const go=(s:S)=>setScreen(s);

  if(screen==="onboard") return <Onboard done={n=>{setName(n);setScreen("home");}}/>;

  return(
    <div style={{background:"var(--bg)",minHeight:"100vh",maxWidth:430,margin:"0 auto",position:"relative"}}>
      {screen==="home"     && <Home     name={name} go={go}/>}
      {screen==="cards"    && <Cards    go={go}/>}
      {screen==="chat"     && <Chat/>}
      {screen==="travel"   && <Travel/>}
      {screen==="goals"    && <Goals/>}
      {screen==="split"    && <Split/>}
      {screen==="perks"    && <Perks/>}
      {screen==="settings" && <Settings go={go} name={name}/>}
      <Nav active={screen} go={go}/>
    </div>
  );
}