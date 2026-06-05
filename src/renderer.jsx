import {
  E,
  CLASSIC,
  ZELDA,
  MARIO,
  CRAFT,
  CYBER,
  SPACE,
  APOCA,
  MEDIEVAL,
  AC_MIRAGE,
  AC_BF,
  SIMS,
  SEA_THIEVES,
  HADES,
  MAFIA,
  SEKIRO,
  PAYDAY,
  SKINS,
  SKIN_EXTRAS,
  buildThemeDeepCards,
  THEME_CONTENT,
  THEMES,
  UNIVERSE,
  META,
  LOCAL_PLAY_LABELS,
  getLocalPlayLabel,
  DIFFS,
  DMULT,
  RACE_TARGET_OPTIONS,
  PC,
  CD,
  VEHICLES,
  VEHICLE_EXPANSION_PACKS,
  getVehiclesForTheme,
  MIN_HAND_SIZE,
  MAX_HAND_SIZE,
  refillHand,
  humanizeCardValue,
  normalizePlayableCard,
  buildDeck,
  dealAll,
  getCardEffect,
  getCardDesc,
  applySelf,
  applyAtk,
  applyAction,
  drawCard,
  aiMove,
  calcScore
} from './core/game/constants.js';

import { Logger } from './shared/utils/logger.js';
import { AudioSys } from './features/audio/AudioSys.js';


const {useState,useEffect,useMemo,useRef,useCallback}=React;
const VERSION="8.25.17";

Logger.perf('Init', 'Global React Init', () => {



// ─── UI COMPONENTS ─────────────────────────────────────────────
function MuteBtn(){
  const [muted, setMuted] = useState(AudioSys.isMuted());
  return (
    <button onClick={() => { setMuted(AudioSys.toggle()); AudioSys.init(); }} style={{position:"absolute", top:10, left:10, zIndex:1000, background:"rgba(0,0,0,0.5)", border:"1px solid rgba(255,255,255,0.2)", borderRadius:"50%", width:40, height:40, color:"#fff", fontSize:18, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.2s"}}>
      {muted ? "🔇" : "🔊"}
    </button>
  );
}

function Pts({color,count=18}){
  const pts=useMemo(()=>Array.from({length:count},(_,i)=>({id:i,x:Math.random()*100,y:Math.random()*100,s:2+Math.random()*4,dur:2+Math.random()*3,delay:Math.random()*5,dx:(Math.random()-.5)*80})),[count]);
  return <div className="pf">{pts.map(p=><div key={p.id} className="p" style={{left:`${p.x}%`,top:`${p.y}%`,width:p.s,height:p.s,background:color,opacity:.5,"--dur":`${p.dur}s`,"--delay":`${p.delay}s`,"--dx":`${p.dx}px`}}/>)}</div>;
}

function PBar({km,c1,c2,unit,vehicle=true,h=28,damage=false,targetKm=1000}){
  const raceTarget = normalizeTargetKm(targetKm);
  const pct=Math.min(100,(km/raceTarget)*100),hot=km>=raceTarget*.8;
  return(
    <div className={damage ? "pbar-damage" : ""} style={{width:"100%"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
        <span style={{fontSize:"var(--f-xs)",color:"#94a3b8",fontWeight:700,textTransform:"uppercase",letterSpacing:2}}>Progression</span>
        <div style={{display:"flex",alignItems:"baseline",gap:4}}>
          <span className="orb" style={{fontSize:"var(--f-md)",fontWeight:900,color:hot?"#fbbf24":"#e2e8f0",textShadow:hot?"0 0 16px #f59e0b":""}}>{km}</span>
          <span style={{fontSize:"var(--f-xs)",color:"#94a3b8"}}>/ {raceTarget} {unit||"km"}</span>
          {hot&&<span style={{fontSize:"var(--f-sm)",animation:"pls .8s infinite"}}>🔥</span>}
        </div>
      </div>
      <div className="pbar-track" style={{position:"relative",height:h,background:"#020709",borderRadius:h/2,overflow:"hidden",border:hot?"1px solid #f59e0b55":"1px solid rgba(255,255,255,.06)"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:"repeating-linear-gradient(90deg,transparent,transparent 18px,rgba(255,255,255,.03) 18px,rgba(255,255,255,.03) 20px)",animation:"rdm 1s linear infinite"}}/>
        <div className="pbar-fill" style={{position:"absolute",top:0,left:0,height:"100%",width:`${pct}%`,background:hot?`linear-gradient(90deg,${c1}88,${c1},${c2},#f59e0b,#fbbf24)`:`linear-gradient(90deg,${c1}88,${c1},${c2})`,borderRadius:h/2,transition:"width 1.1s cubic-bezier(.4,0,.2,1)",boxShadow:hot?`0 0 24px #f59e0baa`:`0 0 14px ${c1}88`}}>
          <div style={{position:"absolute",top:"12%",left:4,right:4,height:"28%",background:"rgba(255,255,255,.22)",borderRadius:h}}/>
        </div>
        {vehicle&&pct>1&&<div style={{position:"absolute",top:"50%",left:`min(${Math.min(pct,94)}%, calc(100% - 24px))`,transform:"translate(-50%,-50%)",fontSize:hot?"var(--f-md)":"var(--f-sm)",transition:"left 1.1s cubic-bezier(.4,0,.2,1)",zIndex:3}}>{hot?"🏎️":"🚗"}</div>}
        {[25,50,75].map(m=><div key={m} style={{position:"absolute",top:0,bottom:0,left:`${m}%`,width:1,background:"rgba(255,255,255,.07)"}}/>)}
      </div>
    </div>
  );
}

function getV2RoadPoint(pct){
  const p = Math.max(0, Math.min(1, Number(pct) || 0));
  const angle = Math.PI * (0.94 - 0.88 * p);
  return {
    x: 500 + Math.cos(angle) * 462,
    y: 198 - Math.sin(angle) * 168,
  };
}

function getV2PlayerSlot(count, index){
  const c = Math.max(1, Math.min(7, count || 1));
  const layouts = {
    1: [{x:50,y:45,r:0,s:1.08}],
    2: [{x:36,y:64,r:-2,s:1.05},{x:64,y:64,r:2,s:1.05}],
    3: [{x:29,y:66,r:-3,s:1.01},{x:50,y:46,r:0,s:1.08},{x:71,y:66,r:3,s:1.01}],
    4: [{x:18,y:78,r:-4,s:.98},{x:40,y:55,r:-1.5,s:1.04},{x:60,y:55,r:1.5,s:1.04},{x:82,y:78,r:4,s:.98}],
    5: [{x:12,y:82,r:-4.5,s:.94},{x:31,y:61,r:-2.4,s:1},{x:50,y:50,r:0,s:1.04},{x:69,y:61,r:2.4,s:1},{x:88,y:82,r:4.5,s:.94}],
    6: [{x:10,y:83,r:-5,s:.9},{x:27,y:64,r:-3.3,s:.96},{x:42,y:53,r:-1.1,s:1},{x:58,y:53,r:1.1,s:1},{x:73,y:64,r:3.3,s:.96},{x:90,y:83,r:5,s:.9}],
    7: [{x:8,y:84,r:-5,s:.86},{x:23,y:68,r:-3.6,s:.92},{x:38,y:56,r:-1.8,s:.96},{x:50,y:50,r:0,s:.99},{x:62,y:56,r:1.8,s:.96},{x:77,y:68,r:3.6,s:.92},{x:92,y:84,r:5,s:.86}],
  };
  const slot = (layouts[c] || layouts[6])[Math.min(index, c - 1)] || layouts[1][0];
  const width = c <= 2 ? 236 : c === 3 ? 224 : c === 4 ? 214 : c === 5 ? 202 : c === 6 ? 190 : 178;
  return {...slot, width};
}

function Card({card,selected,faceDown,tiny,highlight,reveal,disabled=false,disabledReason='',onClick,onHover,onDragStart,onDragEnd,delay=0}){
  card = normalizePlayableCard(card || {}, CLASSIC, "classic");
  const w=tiny?"var(--c-w)":"calc(var(--c-w) * 1.5)",h=tiny?"var(--c-h)":"calc(var(--c-h) * 1.5)";
  const cd=CD[card?.type]||CD.distance;
  const glow=selected?`0 0 0 2px #fff,0 0 32px ${cd.glow},0 20px 60px ${cd.glow}55`:reveal?`0 0 40px ${cd.glow}cc`:highlight?`0 0 22px #fbbf24cc`:`0 8px 24px #000b`;
  const tf=selected?"translateY(-20px) scale(1.16) rotate(-2deg)":reveal?"translateY(-24px) scale(1.22)":highlight?"translateY(-12px) scale(1.1)":"none";
  
  if(faceDown)return(
    <div onClick={onClick} className="cb" style={{width:w,height:h,borderRadius:14,background:"linear-gradient(135deg,#12093a,#2d1b8a,#12093a)",border:`2px solid ${highlight?"#fbbf2499":"#4338ca44"}`,boxShadow:highlight?`0 0 24px #fbbf24aa`:`0 4px 18px #000b`,transform:highlight?"translateY(-10px) scale(1.08)":reveal?"translateY(-18px) scale(1.18)":"none",transition:"all .25s",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",cursor:"pointer",animation:`flipIn .5s ${delay}ms cubic-bezier(.34,1.56,.64,1) both`}}>
      <span style={{fontSize:tiny?"var(--f-lg)":"var(--f-xl)"}}>{E.cardback}</span>
      {highlight&&<div style={{position:"absolute",bottom:4,left:0,right:0,display:"flex",justifyContent:"center"}}><div style={{width:6,height:6,borderRadius:3,background:"#fbbf24",animation:"pls .6s infinite"}}/></div>}
    </div>
  );
  
  // Badge mini de TYPE en haut a droite : aide a distinguer immediatement les familles
  // sans alourdir la carte. Affiche uniquement sur cartes non-tiny (mains du joueur).
  const typeBadge = {
      distance: {ico:'🛣', label:'KM'},
      attack:   {ico:'⚔', label:'ATK'},
      remedy:   {ico:'🩺', label:'RMD'},
      botte:    {ico:'✨', label:'BOT'},
      action:   {ico:'🃏', label:'ACT'},
      boost:    {ico:'💨', label:'+'},
      shield:   {ico:'🛡', label:'DEF'},
      draw:     {ico:'🎴', label:'+3'},
      reroll:   {ico:'♻', label:'RE'},
  }[card?.type];
  // Effet clair (P5) : remplace le card.sub vague par un texte court et precis
  const effectText = getCardEffect(card, card?.sub === 'km' ? 'km' : (card?.sub||''));

  return(
    <button draggable={!!onDragStart && !disabled} onDragStart={disabled ? undefined : onDragStart} onDragEnd={onDragEnd} onMouseEnter={()=>onHover&&onHover(card)} onMouseLeave={()=>onHover&&onHover(null)} onClick={(e)=>{AudioSys.init(); onClick(e);}} aria-label={disabled && disabledReason ? disabledReason : (card?.label || "Carte")} className={`cb${disabled ? ' card-disabled' : ''}`}
      style={{width:w,height:h,borderRadius:14,background:`linear-gradient(135deg,${cd.bg})`,border:`2px solid ${selected?cd.border+"cc":cd.border+"44"}`,boxShadow:disabled?'0 4px 14px #0008':glow,transform:disabled?'none':tf,transition:"transform .2s cubic-bezier(.2,2,.3,1),box-shadow .2s,filter .2s,opacity .2s",cursor:disabled?"not-allowed":onDragStart?"grab":"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"space-between",position:"relative",overflow:"hidden",flexShrink:0,padding:tiny?"5px 3px":"9px 6px",animation:`flipIn .5s ${delay}ms cubic-bezier(.34,1.56,.64,1) both`}}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:"40%",background:"linear-gradient(to bottom,rgba(255,255,255,.16),transparent)",pointerEvents:"none"}}/>
      {selected&&<div style={{position:"absolute",inset:0,background:"linear-gradient(90deg,transparent,rgba(255,255,255,.15),transparent)",animation:"shm 1.4s infinite",pointerEvents:"none"}}/>}
      {/* P5 : Mini-badge TYPE en haut-droite — distingue instantanement les familles de cartes */}
      {!tiny && typeBadge && (
        <span style={{position:'absolute',top:5,right:5,zIndex:2,background:`${cd.glow}33`,border:`1px solid ${cd.glow}66`,color:cd.tx,fontSize:'calc(8px * var(--ui-scale))',fontWeight:900,padding:'1px 5px',borderRadius:8,letterSpacing:0.5,lineHeight:1,textShadow:'0 1px 2px #000c'}}>{typeBadge.label}</span>
      )}
      <div style={{width:tiny?"calc(26px * var(--ui-scale))":"calc(44px * var(--ui-scale))",height:tiny?"calc(26px * var(--ui-scale))":"calc(44px * var(--ui-scale))",borderRadius:"50%",background:cd.ib,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 4px 14px #000a,0 0 14px ${cd.glow}44`,flexShrink:0,zIndex:1}}>
        <span style={{fontSize:tiny?"var(--f-md)":"var(--f-xl)",lineHeight:1}}>{card.icon}</span>
      </div>
      {!tiny&&<div style={{display:"flex",flexDirection:"column",alignItems:"center",zIndex:1,width:"100%",gap:1,padding:"0 3px"}}>
        <span style={{fontSize:card.type==="distance"?"var(--f-lg)":"var(--f-sm)",fontWeight:900,color:"#fff",lineHeight:1.05,textAlign:"center",textShadow:"0 1px 6px #000c"}}>{card.label}</span>
        {/* P5 : sub enrichi via getCardEffect (effet clair, ≤18 chars). Fallback : card.sub original */}
        <span style={{fontSize:"var(--f-xs)",fontWeight:800,color:cd.tx,opacity:.95,lineHeight:1.2,textAlign:"center",letterSpacing:0.3}}>{effectText || card.sub}</span>
      </div>}
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:4,background:`linear-gradient(90deg,transparent,${cd.glow}dd,transparent)`}}/>
    </button>
  );
}

// ─── BACKGROUND CANVAS ─────────────────────────────────────────────
// Decor lie a l'activite : pratiquement immobile quand personne ne bouge,
// vitesse normale en mouvement, accelere lors d'un evenement.
function DynamicBG({theme, inGame, activeEvent, moving}){
    const canvasRef = useRef(null);
    const speedState = useRef({ activeEvent, moving, inGame });
    
    // Update ref without triggering re-initialization of the canvas
    useEffect(() => {
      speedState.current = { activeEvent, moving, inGame };
    }, [activeEvent, moving, inGame]);

    useEffect(() => {
        const c = canvasRef.current;
        if(!c) return;
        const ctx = c.getContext('2d');
        let w = c.width = window.innerWidth;
        let h = c.height = window.innerHeight;
        let req;
        const onResize = () => { w = c.width = window.innerWidth; h = c.height = window.innerHeight; };
        window.addEventListener('resize', onResize);

        const getSpeedMult = () => {
          const s = speedState.current;
          return s.activeEvent ? 4 : (s.moving ? 1 : (s.inGame ? 0.15 : 1));
        };

        if(theme === 'cyber') {
            const cols = Math.floor(w / 20) + 1;
            const ypos = Array(cols).fill(0);
            ctx.fillStyle = '#000'; ctx.fillRect(0,0,w,h);
            const draw = () => {
                const speedMult = getSpeedMult();
                const s = speedState.current;
                ctx.fillStyle = s.inGame ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.05)';
                if(s.activeEvent) ctx.fillStyle = 'rgba(50,0,0,0.2)';
                ctx.fillRect(0,0,w,h);
                ctx.fillStyle = s.activeEvent ? '#f00' : (s.inGame ? 'rgba(0,255,0,0.3)' : '#0f0'); 
                ctx.font = '15pt monospace';
                ypos.forEach((y, ind) => {
                    const text = String.fromCharCode(Math.random() * 128);
                    const x = ind * 20;
                    ctx.fillText(text, x, y);
                    if(y > 100 + Math.random() * 10000) ypos[ind] = 0;
                    else ypos[ind] = y + 20 * speedMult;
                });
                req = requestAnimationFrame(draw);
            }; draw();
        } else if (theme === 'space') {
            const stars = Array.from({length: 150}, () => ({x: Math.random()*w, y: Math.random()*h, s: Math.random()*2+1, z: Math.random()*3+1}));
            const draw = () => {
                const speedMult = getSpeedMult();
                const s = speedState.current;
                ctx.fillStyle = s.activeEvent ? 'rgba(50,0,10,0.4)' : 'rgba(1,2,10,0.3)'; ctx.fillRect(0,0,w,h);
                ctx.fillStyle = s.activeEvent ? '#fca5a5' : '#fff';
                stars.forEach(st => {
                    ctx.fillRect(st.x, st.y, st.s, st.s);
                    st.x -= st.z * speedMult;
                    if(st.x < 0) { st.x = w; st.y = Math.random()*h; }
                });
                req = requestAnimationFrame(draw);
            }; draw();
        } else if (theme === 'zelda') {
            const leaves = Array.from({length: 40}, () => ({x: Math.random()*w, y: Math.random()*h, s: Math.random()*4+2, d: Math.random()*2-1}));
            const draw = () => {
                const speedMult = getSpeedMult();
                const s = speedState.current;
                ctx.clearRect(0,0,w,h);
                if(s.activeEvent) { ctx.fillStyle = 'rgba(100,0,0,0.2)'; ctx.fillRect(0,0,w,h); }
                ctx.fillStyle = s.activeEvent ? 'rgba(239, 68, 68, 0.6)' : 'rgba(74, 222, 128, 0.4)';
                leaves.forEach(l => {
                    ctx.beginPath(); ctx.arc(l.x, l.y, l.s, 0, Math.PI*2); ctx.fill();
                    l.x += l.d * speedMult; l.y += 1.5 * speedMult;
                    if(l.y > h) { l.y = -10; l.x = Math.random()*w; }
                });
                req = requestAnimationFrame(draw);
            }; draw();
        } else if (theme === 'mario') {
            const clouds = Array.from({length: 15}, () => ({x: Math.random()*w, y: Math.random()*h*0.5, s: Math.random()*30+20, d: Math.random()*1+0.5}));
            const draw = () => {
                const speedMult = getSpeedMult();
                const s = speedState.current;
                ctx.clearRect(0,0,w,h);
                if(s.activeEvent) { ctx.fillStyle = 'rgba(50,0,50,0.2)'; ctx.fillRect(0,0,w,h); }
                ctx.fillStyle = s.activeEvent ? 'rgba(255, 100, 100, 0.3)' : 'rgba(255, 255, 255, 0.2)';
                clouds.forEach(l => {
                    ctx.fillRect(l.x, l.y, l.s*2, l.s);
                    l.x -= l.d * speedMult;
                    if(l.x < -100) { l.x = w+50; l.y = Math.random()*h*0.5; }
                });
                req = requestAnimationFrame(draw);
            }; draw();
        } else if (theme === 'craft') {
            const blocks = Array.from({length: 25}, () => ({x: Math.random()*w, y: Math.random()*h, s: Math.random()*15+10, d: Math.random()*2+1}));
            const draw = () => {
                const speedMult = getSpeedMult();
                const s = speedState.current;
                ctx.clearRect(0,0,w,h);
                if(s.activeEvent) { ctx.fillStyle = 'rgba(50,0,0,0.2)'; ctx.fillRect(0,0,w,h); }
                ctx.fillStyle = s.activeEvent ? 'rgba(220, 38, 38, 0.4)' : 'rgba(101, 163, 13, 0.3)';
                blocks.forEach(l => {
                    ctx.fillRect(l.x, l.y, l.s, l.s);
                    l.y += l.d * speedMult;
                    if(l.y > h) { l.y = -50; l.x = Math.random()*w; }
                });
                req = requestAnimationFrame(draw);
            }; draw();
        } else if (theme === 'apoca') {
            const embers = Array.from({length: 60}, () => ({x: Math.random()*w, y: Math.random()*h, s: Math.random()*3+1, dy: Math.random()*2+1, dx: Math.random()*2-1}));
            const draw = () => {
                const speedMult = getSpeedMult();
                const s = speedState.current;
                ctx.fillStyle = s.activeEvent ? 'rgba(40, 0, 0, 0.4)' : 'rgba(26, 5, 0, 0.3)'; ctx.fillRect(0,0,w,h);
                ctx.fillStyle = s.activeEvent ? '#fca5a5' : '#ea580c';
                embers.forEach(e => {
                    ctx.beginPath(); ctx.arc(e.x, e.y, e.s, 0, Math.PI*2); ctx.fill();
                    e.y -= e.dy * speedMult; e.x += e.dx * speedMult;
                    if(e.y < 0) { e.y = h+10; e.x = Math.random()*w; }
                });
                req = requestAnimationFrame(draw);
            }; draw();
        } else if (theme === 'medieval') {
            const rain = Array.from({length: 100}, () => ({x: Math.random()*w, y: Math.random()*h, l: Math.random()*20+10, d: Math.random()*4+4}));
            const draw = () => {
                const speedMult = getSpeedMult();
                const s = speedState.current;
                ctx.fillStyle = s.activeEvent ? 'rgba(50, 0, 0, 0.4)' : 'rgba(15, 23, 42, 0.3)'; ctx.fillRect(0,0,w,h);
                ctx.strokeStyle = s.activeEvent ? 'rgba(255, 100, 100, 0.6)' : 'rgba(148, 163, 184, 0.4)'; ctx.lineWidth = s.activeEvent ? 2 : 1;
                rain.forEach(r => {
                    ctx.beginPath(); ctx.moveTo(r.x, r.y); ctx.lineTo(r.x - r.l*0.2, r.y + r.l); ctx.stroke();
                    r.y += r.d * speedMult; r.x -= r.d*0.2 * speedMult;
                    if(r.y > h) { r.y = -r.l; r.x = Math.random()*w + 100; }
                });
                req = requestAnimationFrame(draw);
            }; draw();
        } else if (theme === 'ac_mirage') {
            const sands = Array.from({length: 80}, () => ({x: Math.random()*w, y: Math.random()*h, s: Math.random()*2+0.5, dx: Math.random()*0.5+0.2, dy: Math.random()*0.3-0.15, twinkle: Math.random()*Math.PI*2}));
            const draw = () => {
                const speedMult = getSpeedMult();
                const s = speedState.current;
                ctx.fillStyle = s.activeEvent ? 'rgba(60, 20, 0, 0.4)' : 'rgba(10, 6, 8, 0.32)'; ctx.fillRect(0,0,w,h);
                sands.forEach(g => {
                    g.twinkle += 0.05 * speedMult;
                    const alpha = 0.35 + 0.4 * Math.abs(Math.sin(g.twinkle));
                    ctx.fillStyle = s.activeEvent ? `rgba(254, 215, 170, ${alpha})` : `rgba(253, 230, 138, ${alpha})`;
                    ctx.fillRect(g.x, g.y, g.s, g.s);
                    g.x += g.dx * speedMult; g.y += g.dy * speedMult;
                    if(g.x > w) { g.x = 0; g.y = Math.random()*h; }
                    if(g.y < 0) g.y = h; if(g.y > h) g.y = 0;
                });
                req = requestAnimationFrame(draw);
            }; draw();
        } else if (theme === 'ac_bf') {
            const waves = Array.from({length: 6}, (_, i) => ({y: h*0.5 + i*22, amp: 14+i*4, phase: i*0.7, freq: 0.013+i*0.002}));
            const foam = Array.from({length: 60}, () => ({x: Math.random()*w, y: h*0.55 + Math.random()*h*0.4, s: Math.random()*3+1, dx: Math.random()*1+0.4}));
            let t = 0;
            const draw = () => {
                const speedMult = getSpeedMult();
                const s = speedState.current;
                ctx.fillStyle = s.activeEvent ? 'rgba(40, 0, 10, 0.42)' : 'rgba(2, 8, 15, 0.32)'; ctx.fillRect(0,0,w,h);
                t += 0.02 * speedMult;
                waves.forEach((wv, idx) => {
                    ctx.beginPath();
                    const color = s.activeEvent ? `rgba(252, 165, 165, ${0.18 - idx*0.02})` : `rgba(245, 158, 11, ${0.22 - idx*0.03})`;
                    ctx.strokeStyle = color; ctx.lineWidth = 1.5;
                    for(let x=0; x<=w; x+=14) {
                        const y = wv.y + Math.sin(x*wv.freq + t + wv.phase) * wv.amp;
                        if(x===0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                    }
                    ctx.stroke();
                });
                ctx.fillStyle = s.activeEvent ? 'rgba(254, 226, 226, 0.5)' : 'rgba(251, 191, 36, 0.4)';
                foam.forEach(f => {
                    ctx.beginPath(); ctx.arc(f.x, f.y, f.s, 0, Math.PI*2); ctx.fill();
                    f.x += f.dx * speedMult;
                    if(f.x > w) { f.x = -10; f.y = h*0.55 + Math.random()*h*0.4; }
                });
                req = requestAnimationFrame(draw);
            }; draw();
        } else {
             const draw = () => { ctx.clearRect(0,0,w,h); req = requestAnimationFrame(draw); }; draw();
        }
        return () => { cancelAnimationFrame(req); window.removeEventListener('resize', onResize); };
    }, [theme]);
    return <canvas ref={canvasRef} style={{position:'fixed', inset:0, zIndex:0, opacity:0.7}} />
}

// ─── SCREENS ──────────────────────────────────────────────

function PassScreen({player,onReady,theme,meta}){
  const T=THEMES[theme]||THEMES.bleu,col=PC[player?.colorIdx||0];
  const [countdown,setCountdown]=useState(2);
  const doneRef=useRef(false);
  const onReadyRef=useRef(onReady);
  useEffect(()=>{ onReadyRef.current = onReady; },[onReady]);
  const finishTurnNotice=useCallback(()=>{
    if(doneRef.current) return;
    doneRef.current = true;
    onReadyRef.current && onReadyRef.current();
  },[]);
  useEffect(()=>{
    doneRef.current = false;
    setCountdown(2);
    const tick = setTimeout(()=>setCountdown(1), 1000);
    const close = setTimeout(finishTurnNotice, 2000);
    return()=>{clearTimeout(tick);clearTimeout(close);};
  },[player?.name, player?.colorIdx, finishTurnNotice]);
  return(
    <div className="page-transition" style={{position:"fixed",inset:0,background:`radial-gradient(ellipse at 50% 30%,${col.dark}cc,#000 70%)`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",zIndex:'var(--z-pass-screen)',padding:32,gap:24,overflow:"hidden", fontFamily:T.font}}>
      <Pts color={col.main} count={25}/><div className="scan"/>
      <div style={{fontSize:90,animation:"pas 1.5s ease-in-out infinite",filter:`drop-shadow(0 0 40px ${col.main})`,zIndex:1}}>{meta?.dk||E.phone}</div>
      <div style={{textAlign:"center",zIndex:1}}>
        <div style={{fontSize:"var(--f-md)",color:"rgba(255,255,255,.3)",marginBottom:12,textTransform:"uppercase",letterSpacing:6,fontWeight:700}}>Au tour de</div>
        <div style={{fontSize:"var(--f-xl)",fontWeight:900,color:col.main,marginBottom:8,textShadow:`0 0 40px ${col.main}`}}>{col.emoji} {player?.name||"?"}</div>
      </div>
      <div style={{width:'min(360px,80vw)',height:8,borderRadius:99,background:'rgba(255,255,255,.18)',overflow:'hidden',zIndex:1}}>
        <div style={{height:'100%',width:'0%',background:'#fff',boxShadow:`0 0 16px ${col.main}`,animation:'shrinkBar 2s linear forwards'}}/>
      </div>
      <style dangerouslySetInnerHTML={{__html:`@keyframes shrinkBar { 0% { width: 100%; } 100% { width: 0%; } }`}} />
      <div style={{fontSize:'var(--f-md)',fontWeight:900,color:'#e2e8f0',zIndex:1}}>Fermeture dans {countdown}s</div>
      <button className="bg" onClick={() => { AudioSys.click(); finishTurnNotice(); }} style={{background:`linear-gradient(135deg,${col.main},${col.dark})`,border:"none",borderRadius:99,padding:"18px 52px",fontSize:"var(--f-lg)",fontWeight:900,color:"#fff",cursor:"pointer",boxShadow:`0 10px 40px ${col.glow}`,letterSpacing:2,zIndex:1}}>C'est à moi !</button>
    </div>
  );
}

function EventScreen({eventData, onDone, theme}){
    const T=THEMES[theme]||THEMES.bleu;
    return(
        <div className="page-transition" style={{position:"fixed",inset:0,background:`rgba(0,0,0,0.85)`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",zIndex:'var(--z-event-popup)',padding:'var(--sp-xl)',gap:'var(--sp-lg)', backdropFilter:"blur(10px)", fontFamily:T.font}}>
          {/* Animation enrichie : eventEntrance (rotation+scale+blur) en remplacement de zin */}
          <div className="anim-event-entrance" style={{fontSize:'calc(110px * var(--ui-scale))', filter:`drop-shadow(0 0 24px ${T.a1})`}}>{eventData.icon}</div>
          <div style={{textAlign:"center", animation:"slidUp .45s .25s both"}}>
             <div style={{fontSize:'var(--f-xxl)', fontWeight:900, color:"#fbbf24", marginBottom:'var(--sp-sm)', letterSpacing:2, textShadow:'0 4px 18px rgba(0,0,0,0.6)'}}>{eventData.title}</div>
             <div style={{fontSize:'var(--f-md)', color:"#fff", maxWidth:'calc(440px * var(--ui-scale))', lineHeight:1.6}}>{eventData.desc}</div>
          </div>
          <button className="bg" onClick={()=>{AudioSys.click(); onDone();}} style={{marginTop:'var(--sp-md)', background:`linear-gradient(135deg,#f59e0b,#ef4444)`,border:"none",borderRadius:99,padding:'var(--sp-md) calc(40px * var(--ui-scale))',fontSize:'var(--f-md)',fontWeight:900,color:"#fff",cursor:"pointer",animation:"slidUp .4s .45s both", boxShadow:'0 8px 22px rgba(239,68,68,0.4)'}}>Continuer</button>
        </div>
    )
}

function ShopScreen({eventData, onAction, theme, player, isAI, queueInfo}){
    const T=THEMES[theme]||THEMES.bleu;
    const isMuriel = eventData.shopType === 'muriel';
    const [tradeMode, setTradeMode] = useState(false); // pour Muriel: choisir entre acheter ou troquer

    useEffect(() => {
        if(isAI) {
            const timer = setTimeout(() => {
                // IA: priorise un troc gratuit chez Muriel, sinon achete si elle peut se le payer
                if(isMuriel) {
                    if(Math.random() > 0.5 && player.hand.length > 0) {
                        onAction('trade', Math.floor(Math.random()*player.hand.length));
                    } else {
                        const item = eventData.items?.[0];
                        if(item && player.km >= item.cost && Math.random() > 0.4) onAction('buy', item);
                        else if(player.hand.length > 0) onAction('trade', Math.floor(Math.random()*player.hand.length));
                        else onAction('skip');
                    }
                } else {
                    const items = eventData.items || [];
                    const affordable = items.filter(it => player.km >= it.cost);
                    if(affordable.length > 0 && Math.random() > 0.3) {
                        onAction('buy', affordable[Math.floor(Math.random()*affordable.length)]);
                    } else {
                        onAction('skip');
                    }
                }
            }, 2200);
            return () => clearTimeout(timer);
        }
    }, [isAI]);

    const renderItems = () => (
        <div style={{display:"flex", gap:20, flexWrap:"wrap", justifyContent:"center"}}>
            {(eventData.items||[]).map((item, i) => {
                const itemAfford = player.km >= item.cost;
                return (
                    <div key={i}
                         className={`shop-card${itemAfford?'':' disabled'}`}
                         onClick={() => { if(itemAfford) { AudioSys.click(); onAction('buy', item); } else { AudioSys.error(); } }}
                         title={item.itemDesc || item.itemName}
                         style={{animation: `slidUp .4s ${0.05*i + 0.2}s both`}}>
                        <div style={{fontSize:'calc(40px * var(--ui-scale))', filter:'drop-shadow(0 0 8px rgba(251,191,36,0.4))'}}>{item.itemIcon}</div>
                        <div className="shop-name">{item.itemName}</div>
                        {item.itemDesc && <div className="shop-desc">{item.itemDesc}</div>}
                        <div className="shop-price">💰 {item.cost} {item.cost===0?'(gratuit)':''}</div>
                        {!itemAfford && <div style={{color:"#f87171", fontSize:'var(--f-xs)', fontWeight:700}}>Fonds insuffisants</div>}
                    </div>
                );
            })}
        </div>
    );

    const renderTradeHand = () => (
        <div style={{display:"flex", flexDirection:"column", alignItems:"center", gap:12}}>
            <div style={{fontSize:'var(--f-md)', color:'#cbd5e1', fontWeight:700}}>Choisissez la carte à échanger (gratuit)</div>
            <div style={{display:"flex", gap:10, flexWrap:"wrap", justifyContent:"center"}}>
                {player.hand.map((c, i) => (
                    <div key={i}>
                        <Card card={c} onClick={()=>{ AudioSys.click(); onAction('trade', i); }} />
                    </div>
                ))}
            </div>
        </div>
    );

    return(
        <div className="page-transition" style={{position:"fixed",inset:0,background:`rgba(0,0,0,0.92)`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",zIndex:'var(--z-event-popup)',padding:24,gap:18, backdropFilter:"blur(12px)", fontFamily:T.font, overflowY:'auto'}}>
          {/* Bandeau queueInfo : indique le tour boutique courant en multi-joueurs */}
          {queueInfo && queueInfo.total > 1 && (
              <div style={{position:'absolute', top:'var(--sp-md)', left:'50%', transform:'translateX(-50%)', background:'linear-gradient(135deg,#a855f733,#a855f711)', border:'1px solid #a855f7', borderRadius:99, padding:'var(--sp-xs) var(--sp-md)', color:'#e9d5ff', fontWeight:800, fontSize:'var(--f-sm)', letterSpacing:1, display:'flex', alignItems:'center', gap:'var(--sp-sm)', boxShadow:'0 4px 18px rgba(168,85,247,0.4)', maxWidth:'min(96vw, 600px)', overflow:'hidden', whiteSpace:'nowrap'}}>
                  <span>🛒</span>
                  <span>Boutique • {queueInfo.current}/{queueInfo.total}</span>
                  <span style={{padding:'1px 8px', background:'rgba(0,0,0,0.4)', borderRadius:99, fontSize:'var(--f-xs)'}}>{queueInfo.playerName} — à toi d'acheter</span>
              </div>
          )}
          <div style={{display:"flex", flexDirection:"column", alignItems:"center", animation:"fdu .4s both", maxWidth:'min(720px, 96vw)', textAlign:'center', marginTop: queueInfo && queueInfo.total > 1 ? 'var(--sp-xl)' : 0}}>
             <div style={{fontSize:'calc(80px * var(--ui-scale))', filter:"drop-shadow(0 0 20px #a855f7)", animation:"npcArrive .8s cubic-bezier(.34,1.56,.64,1) both"}}>{eventData.icon}</div>
             <div style={{fontSize:'var(--f-xl)', fontWeight:900, color:"#a855f7", marginBottom:10, animation:"slidUp .35s .3s both"}}>{eventData.title}</div>
             <div style={{fontSize:'var(--f-md)', color:"#e2e8f0", maxWidth:560, lineHeight:1.5, textAlign:"center", marginBottom:16, fontStyle:'italic'}}>{eventData.desc}</div>
             <div style={{background:"#fbbf24", color:"#000", padding:"6px 18px", borderRadius:99, fontWeight:900, fontSize:'var(--f-md)'}}>
                 💰 Vos pièces : {player.km}
             </div>
             <div style={{fontSize:'var(--f-xs)', color:'#94a3b8', marginTop:8, opacity:0.85}}>Les achats sont rangés dans votre sac 🎒.</div>
          </div>

          {!isAI && isMuriel && !tradeMode && (
              <div style={{display:'flex', gap:12, flexWrap:'wrap', justifyContent:'center'}}>
                  <button className="bg" onClick={()=>{ AudioSys.click(); setTradeMode(true); }}
                          style={{background:'rgba(74,222,128,0.18)', border:'2px solid #4ade80', borderRadius:12, padding:'12px 22px', color:'#86efac', fontWeight:800, fontSize:'var(--f-md)', cursor:'pointer', fontFamily:'inherit'}}>
                      🔄 Troquer (gratuit)
                  </button>
              </div>
          )}

          {!isAI && isMuriel && tradeMode && (
              <>
                  {renderTradeHand()}
                  <button className="bg" onClick={()=>{ AudioSys.click(); setTradeMode(false); }}
                          style={{background:'transparent', border:'1px solid rgba(255,255,255,0.2)', borderRadius:99, padding:'8px 18px', fontSize:'var(--f-sm)', color:'#cbd5e1', cursor:'pointer', fontFamily:'inherit'}}>
                      ← Retour à la boutique
                  </button>
              </>
          )}

          {!isAI && (!isMuriel || !tradeMode) && eventData.items && renderItems()}

          {isAI && <div style={{color:"#f87171", fontSize:'var(--f-lg)', animation:"pls 1s infinite"}}>L'IA fait son choix...</div>}

          <button className="bg" onClick={()=>{AudioSys.click(); onAction('skip');}}
                  style={{marginTop:10, background:`transparent`,border:"1px solid rgba(255,255,255,0.2)",borderRadius:99,padding:"12px 26px",fontSize:'var(--f-md)',color:"#cbd5e1",cursor:"pointer",animation:"fdu .4s .4s both", fontFamily:'inherit', fontWeight:700}}>
              Passer (ne rien acheter)
          </button>
        </div>
    )
}

function StealChoiceScreen({targetName, targetHand, onChoose, onCancel, theme}){
    const T=THEMES[theme]||THEMES.bleu;
    return (
        <div className="page-transition" style={{position:"fixed",inset:0,background:"rgba(0,0,0,.88)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:'var(--z-event-popup)',padding:'var(--sp-lg)',fontFamily:T.font,backdropFilter:"blur(12px)"}}>
            <div style={{width:'min(calc(780px * var(--ui-scale)), 96vw)',background:'rgba(4,8,20,.96)',border:`2px solid ${T.a1}`,borderRadius:'var(--rad-lg)',padding:'var(--sp-lg)',boxShadow:`0 0 0 1px ${T.a1}44, 0 24px 80px #000`,animation:'zin .28s both'}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'var(--sp-md)',marginBottom:'var(--sp-md)'}}>
                    <div>
                        <div style={{fontSize:'var(--f-xs)',color:'#94a3b8',fontWeight:800,textTransform:'uppercase',letterSpacing:3}}>Vol de carte</div>
                        <div style={{fontSize:'var(--f-xl)',fontWeight:900,color:T.a1}}>Choisis une carte chez {targetName}</div>
                    </div>
                    <button className="bg" onClick={onCancel} style={{background:'rgba(15,23,42,.85)',border:'1px solid rgba(255,255,255,.12)',borderRadius:99,padding:'var(--sp-xs) var(--sp-md)',color:'#cbd5e1',fontWeight:800,cursor:'pointer',fontFamily:'inherit'}}>Annuler</button>
                </div>
                <div style={{fontSize:'var(--f-sm)',color:'#cbd5e1',marginBottom:'var(--sp-md)',lineHeight:1.45}}>
                    Les cartes restent privées : tu choisis une position, pas une carte révélée. Le vol n'est donc plus aléatoire.
                </div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(calc(88px * var(--ui-scale)), 1fr))',gap:'var(--sp-sm)'}}>
                    {(targetHand||[]).map((_,idx)=>(
                        <button key={idx} className="bg" onClick={()=>onChoose(idx)}
                                style={{minHeight:'calc(116px * var(--ui-scale))',borderRadius:'var(--rad-md)',border:`1px solid ${T.a1}66`,background:`linear-gradient(135deg, ${T.a1}22, rgba(15,23,42,.9))`,color:'#e2e8f0',fontWeight:900,cursor:'pointer',fontFamily:'inherit',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'var(--sp-xs)',boxShadow:'0 8px 22px #0008'}}>
                            <span style={{fontSize:'var(--f-xl)'}}>🂠</span>
                            <span style={{fontSize:'var(--f-sm)'}}>Carte {idx+1}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

function InteractiveEventScreen({eventData, onTrade, theme, player, isAI}){
    const T=THEMES[theme]||THEMES.bleu;
    useEffect(() => {
        if(isAI) {
            const timer = setTimeout(() => {
                if(player.hand.length>0) onTrade(Math.floor(Math.random()*player.hand.length));
                else onTrade(-1);
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [isAI, player.hand]);

    return(
        <div className="page-transition" style={{position:"fixed",inset:0,background:`rgba(0,0,0,0.85)`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",zIndex:'var(--z-event-popup)',padding:32,gap:24, backdropFilter:"blur(10px)", fontFamily:T.font}}>
          <div style={{fontSize:80, animation:"zin .5s both"}}>{eventData.icon}</div>
          <div style={{textAlign:"center", animation:"fdu .4s .2s both"}}>
             <div style={{fontSize:26, fontWeight:900, color:"#fbbf24", marginBottom:10}}>{eventData.title}</div>
             <div style={{fontSize:14, color:"#fff", maxWidth:400, lineHeight:1.5, marginBottom:20}}>{eventData.desc}</div>
          </div>
          {!isAI && (
             <div style={{display:"flex", gap:10, flexWrap:"wrap", justifyContent:"center"}}>
                 {player.hand.map((c, i) => (
                     <div key={i}>
                        <Card card={c} onClick={()=>{AudioSys.click(); onTrade(i);}} />
                     </div>
                 ))}
             </div>
          )}
          {isAI && <div style={{color:"#f87171", fontSize:18, animation:"pls 1s infinite"}}>L'IA fait son choix...</div>}
          <button className="bg" onClick={()=>{AudioSys.click(); onTrade(-1);}} style={{marginTop:20, background:`transparent`,border:"1px solid rgba(255,255,255,0.2)",borderRadius:99,padding:"10px 20px",fontSize:12,color:"#cbd5e1",cursor:"pointer",animation:"fdu .4s .4s both"}}>Passer (Ne rien faire)</button>
        </div>
    )
}

function Win({winnerIsAI,players,aiPlayer,diff,turns,onReplay,onMenu,theme,setScores,meta,targetKm=1000}){
  const T=THEMES[theme]||THEMES.bleu,[ph,setPh]=useState(0);
  const raceTarget = normalizeTargetKm(targetKm);
  const w=winnerIsAI?aiPlayer:players.find(p=>p.km>=raceTarget)||players[0];
  const wc=PC[w?.colorIdx||0];
  const{rows,total}=calcScore({winnerIsAI,players,aiPlayer,diff,turns,targetKm:raceTarget});
  const unit=meta?.unit||"km";
  useEffect(()=>{
    AudioSys.win();
    try{const e={score:total,winner:w?.name||"?",diff,turns,playerKm:w?.km||0,date:new Date().toLocaleDateString("fr-FR"),mode:players.length>1||aiPlayer?"multi":"solo"};setScores(p=>[...p,e].sort((a,b)=>b.score-a.score).slice(0,10));}catch{}
    const ts=[setTimeout(()=>setPh(1),300),setTimeout(()=>setPh(2),1200),setTimeout(()=>setPh(3),2200),setTimeout(()=>setPh(4),3000)];
    return()=>ts.forEach(clearTimeout);
  },[]);
  const cols=["#fbbf24","#f87171","#34d399","#60a5fa","#c084fc","#f472b6"];
  const cnf=Array.from({length:40},(_,i)=>({id:i,x:Math.random()*100,delay:Math.random()*1.5,dur:2.5+Math.random()*2,size:4+Math.random()*10,color:cols[i%cols.length],rot:Math.random()*360}));
  const allP=[...players,...(aiPlayer?[{...aiPlayer,name:"IA"}]:[])];
  return(
    <div className="page-transition" style={{position:"fixed",inset:0,background:`radial-gradient(ellipse at 50% -10%,${wc.glow} 0%,#000 55%)`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-start",zIndex:'var(--z-win-screen)',overflowY:"auto",padding:"24px 20px 60px", fontFamily:T.font}}>
      <div className="scan"/>
      {ph>=1&&cnf.map(c=><div key={c.id} style={{position:"fixed",left:`${c.x}%`,top:-20,width:c.size,height:c.size,borderRadius:2,background:c.color,animation:`cnf ${c.dur}s ${c.delay}s ease-in infinite`,transform:`rotate(${c.rot}deg)`,zIndex:0,pointerEvents:"none"}}/>)}
      <Pts color={wc.main} count={30}/>
      {ph>=1&&<div style={{fontSize:110,animation:"trp .9s both",marginTop:40,marginBottom:14,filter:`drop-shadow(0 0 60px ${wc.main})`,zIndex:2}}>🏆</div>}
      {ph>=1&&<div style={{textAlign:"center",zIndex:2,marginBottom:28,animation:"fdu .5s .2s both"}}>
        <div className="gt" style={{fontSize:36,fontWeight:900,marginBottom:10,background:`linear-gradient(90deg,#fbbf24,#f59e0b,#fcd34d,#fbbf24)`,letterSpacing:3}}>{wc.emoji} {w?.name} GAGNE !</div>
        <div style={{fontSize:14,color:wc.main,fontWeight:700}}>{raceTarget} {unit} parcourus en premier !</div>
      </div>}
      <div style={{display:"flex",gap:24,width:"100%",maxWidth:900,zIndex:2,flexWrap:"wrap",justifyContent:"center"}}>
        {ph>=2&&allP.length>1&&(
          <div style={{flex:"1 1 320px",background:"rgba(4,8,20,.95)",border:"1px solid rgba(255,255,255,.06)",borderRadius:20,padding:20,animation:"sil .5s both"}}>
            <p style={{color:"#64748b",fontSize:10,textTransform:"uppercase",letterSpacing:4,margin:"0 0 14px",fontWeight:700,textAlign:"center"}}>Classement final</p>
            {[...allP].sort((a,b)=>b.km-a.km).map((p,i)=>{const c=PC[p.colorIdx||0];return(
              <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",borderRadius:12,marginBottom:8,background:i===0?`${c.main}12`:"rgba(255,255,255,.02)",border:i===0?`1px solid ${c.main}44`:"1px solid rgba(255,255,255,.04)",animation:`sin .4s ${i*80}ms both`}}>
                <span style={{fontSize:22,flexShrink:0}}>{["🥇","🥈","🥉","4️⃣","5️⃣","6️⃣","7️⃣"][i]}</span>
                <div style={{flex:1}}><span style={{fontWeight:700,color:c.main,fontSize:14}}>{c.emoji} {p.name}</span><div style={{marginTop:4, color:c.main, fontWeight:900}}>{p.km}</div></div>
              </div>
            );})}
          </div>
        )}
        {ph>=3&&(
          <div style={{flex:"1 1 300px",background:"rgba(4,8,20,.95)",border:"1px solid rgba(255,255,255,.06)",borderRadius:20,padding:20,animation:"sir .5s both"}}>
            <p style={{color:"#64748b",fontSize:10,textTransform:"uppercase",letterSpacing:4,margin:"0 0 14px",fontWeight:700,textAlign:"center"}}>Décompte des points</p>
            {rows.map((r,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:"rgba(255,255,255,.03)",borderRadius:10,padding:"9px 14px",borderLeft:`3px solid ${r.color}`,marginBottom:8,animation:`sin .4s ${i*100}ms both`}}>
              <span style={{fontSize:13,color:"#64748b"}}>{r.l}</span>
              <span style={{fontSize:16,fontWeight:900,color:r.color}}>+{r.pts.toLocaleString()}</span>
            </div>)}
            <div style={{marginTop:14,paddingTop:14,borderTop:"1px solid rgba(255,255,255,.05)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:15,fontWeight:700,color:"#64748b"}}>Total</span>
              <span style={{fontSize:30,fontWeight:900,color:"#fbbf24"}}>{total.toLocaleString()} pts</span>
            </div>
          </div>
        )}
      </div>
      {ph>=4&&<div style={{display:"flex",gap:14,zIndex:2,marginTop:24,animation:"fdu .4s both"}}>
        <button className="bg" onClick={() => { AudioSys.click(); onReplay(); }} style={{background:`linear-gradient(135deg,${T.a1},${T.a2})`,border:"none",borderRadius:99,padding:"15px 36px",fontSize:16,fontWeight:800,color:"#fff",cursor:"pointer",letterSpacing:2}}>Rejouer</button>
        <button className="bg" onClick={() => { AudioSys.click(); onMenu(); }} style={{background:"rgba(10,15,30,.9)",border:"1px solid rgba(255,255,255,.1)",borderRadius:99,padding:"15px 30px",fontSize:16,fontWeight:700,color:"#475569",cursor:"pointer"}}>Menu</button>
      </div>}
    </div>
  );
}

function Rules({theme,setScreen,meta}){
  const T=THEMES[theme]||THEMES.bleu,unit=meta?.unit||"km";
  const secs=[
    {title:"Objectif & Monnaie",content:`Parcourez l'objectif choisi en ${unit} ! Vos kilomètres servent aussi de monnaie pour acheter des cartes aux marchands.`},
    {title:"Distance",color:"#10b981",content:"Jouez des distances pour avancer. Il faut être en route (Feu Vert) et sans panne."},
    {title:"Attaques & Bottes",color:"#ef4444",content:"Bloquez avec des pannes. Parez avec une Botte (Immunité permanente). En jouant une Botte juste après avoir subi la panne, c'est un Coup Fourré (+300 pts) !"},
    {title:"Boutiques (Nouveau)",color:"#fbbf24",content:"Des événements vous permettent d'acheter : Réparation universelle (Christophe), Bricolage (Yohan - limite votre vitesse), ou Piratage (Nathan & Gaël)."},
    {title:"Attaque de Zone",color:"#a855f7",content:"Frappe TOUS les adversaires d'un coup (ex: Lune de Sang, Panne Réseau)."},
    {title:"Véhicules Asymétriques",color:"#3b82f6",content:"Choisissez parmi 30 véhicules aux bonus/malus uniques modifiant votre stratégie."}
  ];
  return(
    <div className="page-transition" style={{height:"100%",width:"100%",background:`radial-gradient(ellipse at 50% 0%,${T.bg2},${T.bg} 70%)`,overflow:"auto",position:"relative", fontFamily:T.font}}>
      <Pts color={T.particle} count={12}/>
      <div style={{maxWidth:'min(900px, 100%)',margin:"0 auto",padding:'var(--sp-xl) var(--sp-lg)',position:"relative",zIndex:1}}>
        <button onClick={()=>{AudioSys.click(); setScreen("menu");}} style={{background:"none",border:"none",color:"#cbd5e1",cursor:"pointer",fontSize:13,fontWeight:600,marginBottom:20,padding:0}}>Retour au menu</button>
        <h2 style={{fontSize:22,fontWeight:900,color:"#fff",marginBottom:24,letterSpacing:3}}>RÈGLES DU JEU</h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(300px,1fr))",gap:16}}>
          {secs.map((sec,si)=>(
            <div key={si} style={{background:"rgba(4,8,20,.9)",border:`1px solid ${sec.color?sec.color+"22":"rgba(255,255,255,.05)"}`,borderRadius:16,padding:18}}>
              <h3 style={{fontSize:14,fontWeight:900,color:sec.color||"#fff",margin:"0 0 10px",paddingBottom:8,borderBottom:`1px solid ${sec.color?sec.color+"22":"rgba(255,255,255,.05)"}`}}>{sec.title}</h3>
              {sec.content&&<p style={{color:"#94a3b8",fontSize:13,marginBottom:10,lineHeight:1.7}}>{sec.content}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Credits({theme,setScreen}){
  const T=THEMES[theme]||THEMES.bleu;
  return(
    <div className="page-transition" style={{height:"100%",width:"100%",background:`radial-gradient(ellipse at 50% 0%,${T.bg2},${T.bg} 70%)`,display:"flex",alignItems:"center",justifyContent:"center",padding:'var(--sp-lg)',overflow:"auto",position:"relative", fontFamily:T.font}}>
      <Pts color={T.particle} count={20}/>
      <div style={{background:"rgba(4,8,20,.95)",border:`1px solid ${T.br}`,borderRadius:'var(--rad-lg)',padding:'var(--sp-xl)',maxWidth:'min(440px, 96vw)',maxHeight:'92vh',overflowY:'auto',width:"100%",textAlign:"center",position:"relative",zIndex:1,animation:"zin .4s both"}}>
        <button onClick={()=>{AudioSys.click(); setScreen("menu");}} style={{position:"absolute",top:16,left:16,background:"none",border:"none",color:"#cbd5e1",cursor:"pointer",fontSize:13,fontWeight:600}}>Retour</button>
        <div style={{fontSize:64,marginBottom:20,filter:`drop-shadow(0 0 40px ${T.a1})`}}>🚗</div>
        <div className="neon" style={{fontSize:24,fontWeight:900,color:"#fff",marginBottom:4,letterSpacing:4}}>MILLE BORNES</div>
        <div style={{fontSize:11,color:T.a1,marginBottom:24,letterSpacing:6}}>ÉDITION BAGLEY v{VERSION}</div>
        <div style={{borderTop:"1px solid rgba(255,255,255,.05)",paddingTop:24}}>
          <div style={{fontSize:20,fontWeight:900,color:T.a1,letterSpacing:3,marginBottom:8}}>Bagley Entertainment</div>
          <div style={{fontSize:13,color:"#cbd5e1",lineHeight:1.8}}>
            Créateur : Nathan<br/>
            Inspiré du célèbre Mille Bornes (1954)<br/><br/>
            <span style={{color:"#a855f7"}}>Moteur d'événements et économie intégrée.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScoreBoard({scores,setScores,theme,onClose}){
  const T=THEMES[theme]||THEMES.bleu;
  return(
    <div className="page-transition" style={{position:"fixed",inset:0,background:"rgba(0,0,0,.9)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:20, fontFamily:T.font}}>
      <div style={{background:`linear-gradient(135deg,${T.bg},${T.bg2})`,border:`1px solid ${T.br}`,borderRadius:'var(--rad-lg)',padding:'var(--sp-lg)',width:"100%",maxWidth:'min(480px, 96vw)',maxHeight:"86vh",overflow:"auto",animation:"zin .3s both"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <h2 style={{fontSize:18,fontWeight:900,color:"#fff",letterSpacing:3,margin:0}}>MEILLEURS SCORES</h2>
          <div style={{display:"flex",gap:8}}>
            {scores.length>0&&<button onClick={()=>{AudioSys.click(); if(window.confirm("Effacer ?"))setScores([]);}} style={{background:"rgba(127,29,29,.4)",border:"1px solid #7f1d1d",borderRadius:8,color:"#f87171",fontSize:11,fontWeight:700,padding:"5px 10px",cursor:"pointer"}}>Effacer</button>}
            <button onClick={()=>{AudioSys.click(); onClose();}} style={{background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",borderRadius:"50%",width:34,height:34,color:"#cbd5e1",fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>x</button>
          </div>
        </div>
        {scores.length===0?<p style={{color:"#94a3b8",textAlign:"center",padding:24}}>Aucun score encore !</p>
        :scores.map((s,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 14px",borderRadius:12,marginBottom:8,background:i===0?"rgba(251,191,36,.08)":"rgba(255,255,255,.02)",border:i===0?"1px solid #fbbf2433":"1px solid rgba(255,255,255,.04)",animation:`sin .4s ${i*60}ms both`}}>
            <span style={{fontSize:22,width:30,textAlign:"center",flexShrink:0}}>{["🥇","🥈","🥉"][i]||`${i+1}.`}</span>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:700,color:"#e2e8f0"}}>{s.winner} <span style={{fontSize:10,color:"#94a3b8"}}>{DIFFS[s.diff]?.name}</span>{s.mode==="multi"&&<span style={{fontSize:10,color:"#818cf8",marginLeft:4}}>Multi</span>}</div>
              <div style={{fontSize:10,color:"#94a3b8",marginTop:2}}>{s.date} · {s.turns} tours · {s.playerKm}</div>
            </div>
            <span style={{fontSize:18,fontWeight:900,color:i===0?"#fbbf24":T.a1,flexShrink:0}}>{s.score.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Lobby({onStart,onBack,theme,meta, isSolo}){
  const T=THEMES[theme]||THEMES.bleu,[num,setNum]=useState(isSolo ? 1 : 2);
  const[names,setNames]=useState(["Joueur 1","Joueur 2","Joueur 3","Joueur 4","Joueur 5","Joueur 6","Joueur 7"]);
  const filteredVehicles = getVehiclesForTheme(theme);
  const defaultVehicleId = filteredVehicles[0]?.id || "v1";
  const[roles,setRoles]=useState(()=>Array(7).fill(defaultVehicleId));
  const[hasAI,setHasAI]=useState(isSolo ? true : false);
  useEffect(()=>{
    setRoles(prev=>prev.map(id=>filteredVehicles.some(v=>v.id===id)?id:defaultVehicleId));
  },[theme]);
  const updName=(i,v)=>setNames(n=>{const r=[...n];r[i]=v;return r;});
  const updRole=(i,v)=>setRoles(n=>{const r=[...n];r[i]=v;return r;});

  return(
    <div className="page-transition" style={{height:"100%",minHeight:"100%",background:`radial-gradient(ellipse at 50% 0%,${T.bg2},${T.bg} 70%)`,display:"flex",alignItems:"center",justifyContent:"center",padding:'var(--sp-lg)',position:"relative",overflow:"auto", fontFamily:T.font}}>
      <DynamicBG theme={theme} inGame={false}/>
      <Pts color={T.particle} count={18}/>
      {/* Panneau central SHOWROOM : largeur etendue, marges laterales reduites pour valoriser le choix vehicule */}
      <div style={{background:"rgba(4,8,20,.92)",border:`2px solid ${T.a1}`,borderRadius:'var(--rad-lg)',padding:'var(--sp-xl) var(--sp-xl)',width:"100%",maxWidth:'min(calc(1180px * var(--ui-scale)), 96vw)',maxHeight:'94vh',overflowY:'auto',position:"relative",zIndex:1,animation:"zin .4s both", backdropFilter:"blur(10px)", boxShadow:`0 0 0 1px ${T.a1}44, 0 0 80px ${T.a1}44, inset 0 0 50px ${T.a1}11`}}>
        <button onClick={()=>{AudioSys.click(); onBack();}} style={{background:"none",border:"none",color:"#cbd5e1",cursor:"pointer",fontSize:'var(--f-sm)',fontWeight:600,marginBottom:'var(--sp-md)',padding:0}}>← Retour</button>
        {/* Titre hero style neon (inspire ref) */}
        <h2 className="neon config-hero-title" style={{color:T.a1, textShadow:`0 0 12px ${T.a1}, 0 0 24px ${T.a1}88, 0 0 48px ${T.a1}44`}}>
            CONFIGURATION VÉHICULE{isSolo ? '' : ' MULTI-JOUEURS'}
        </h2>
        
        {!isSolo && (
            <>
            <p style={{color:"#94a3b8",fontSize:10,textTransform:"uppercase",letterSpacing:4,fontWeight:700,marginBottom:12}}>Nombre de joueurs</p>
            <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:20}}>
              {[2,3,4,5,6,7].map(n=>(
                <button key={n} className="bg" onClick={()=>{AudioSys.click(); setNum(n);}} style={{width:56,height:56,borderRadius:14,border:"none",cursor:"pointer",fontSize:20,fontWeight:900,background:num===n?`linear-gradient(135deg,${T.a1},${T.a2})`:"rgba(15,23,42,.8)",color:num===n?"#fff":"#cbd5e1",transform:num===n?"scale(1.1)":"scale(1)",transition:"all .2s"}}>{n}</button>
              ))}
            </div>
            </>
        )}

        {/* Cartes joueur+vehicule : inspire de Interface_Configuration_vehicule.png.
            Mode SOLO (num=1) : split horizontal 50/50 (gauche=saisies, droite=artwork XL).
            Mode MULTI (num>1) : grid responsive avec cartes compactes (saisies + badges).
            Toutes les saisies (input/select/onChange) sont preservees a 100%. */}
        <p style={{color:"#94a3b8",fontSize:'var(--f-xs)',textTransform:"uppercase",letterSpacing:4,fontWeight:700,marginBottom:'var(--sp-sm)'}}>{num===1 ? "Joueur & Véhicule" : "Véhicules & Joueurs"}</p>

        {num === 1 ? (
            // ─── MODE SOLO : refonte "vitrine" inspiree au plus proche de la ref ───
            (() => {
                const vData = filteredVehicles.find(v => v.id === roles[0]) || filteredVehicles[0];
                return (
                    <div className="veh-solo">
                        {/* GAUCHE : saisies (preserve updName / updRole) */}
                        <div className="veh-solo-left">
                            <div>
                                <p style={{color:T.a1,fontSize:'var(--f-sm)',textTransform:"uppercase",letterSpacing:4,fontWeight:900,marginBottom:'var(--sp-xs)'}}>Nom du joueur</p>
                                <input type="text" value={names[0]} onChange={e=>updName(0,e.target.value)} maxLength={12} placeholder="Joueur 1" style={{borderColor:T.a1, borderWidth:2}}/>
                            </div>
                            <div>
                                <p style={{color:T.a1,fontSize:'var(--f-sm)',textTransform:"uppercase",letterSpacing:4,fontWeight:900,marginBottom:'var(--sp-xs)'}}>Mode de jeu</p>
                                <div style={{padding:'var(--sp-sm) var(--sp-md)', background:'rgba(15,23,42,0.7)', border:`2px solid ${T.a1}`, borderRadius:'var(--rad-sm)', color:'#fff', fontSize:'var(--f-md)', fontWeight:700}}>
                                    {meta?.aiIcon || '🤖'} 1 Joueur vs IA
                                </div>
                            </div>
                            <div>
                                <p style={{color:T.a1,fontSize:'var(--f-sm)',textTransform:"uppercase",letterSpacing:4,fontWeight:900,marginBottom:'var(--sp-xs)'}}>Véhicule</p>
                                <select value={roles[0]} onChange={e=>updRole(0,e.target.value)} style={{borderColor:T.a1, borderWidth:2, cursor:'pointer'}}>
                                    {filteredVehicles.map(r => <option key={r.id} value={r.id}>{r.icon} {r.name}</option>)}
                                </select>
                            </div>
                        </div>
                        {/* DROITE : vitrine vehicule encadree (style ref) */}
                        <div className="veh-solo-right veh-showcase"
                             style={{background:`linear-gradient(180deg, ${T.a1}1c 0%, ${T.a2}0a 60%, ${T.bg2} 100%)`,
                                     border:`3px solid ${T.a1}`,
                                     boxShadow:`0 0 0 1px ${T.a1}88, 0 0 40px ${T.a1}55, inset 0 0 60px ${T.a1}22`}}>
                            <div style={{position:'absolute',inset:0,background:`radial-gradient(circle at 50% 35%, ${T.a1}33, transparent 70%)`,pointerEvents:'none'}}/>
                            <div className="veh-showcase-title" style={{color:'#fff', textShadow:`0 0 12px ${T.a1}, 0 0 24px ${T.a1}77`, position:'relative', zIndex:1}}>
                                {vData.name}
                            </div>
                            <div className="veh-showcase-art" style={{position:'relative', zIndex:1}}>{vData.icon}</div>
                            <div style={{fontSize:'var(--f-sm)', color:'#94a3b8', fontStyle:'italic', textAlign:'center', position:'relative', zIndex:1, marginTop:'var(--sp-xs)'}}>{vData.desc}</div>
                            <div className="veh-showcase-badges" style={{position:'relative', zIndex:1}}>
                                <div className="veh-showcase-badge bonus" title={`Bonus : ${vData.b}`}>
                                    <span className="icon">✓</span>
                                    <span style={{whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>+ {vData.b}</span>
                                </div>
                                <div className="veh-showcase-badge malus" title={`Malus : ${vData.m}`}>
                                    <span className="icon">⚠</span>
                                    <span style={{whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>- {vData.m}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })()
        ) : (
            // ─── MODE MULTI : grid responsive avec cartes compactes ───
            <div className="veh-grid">
              {Array.from({length:num}).map((_,i)=>{
                const vData = filteredVehicles.find(v => v.id === roles[i]) || filteredVehicles[0];
                return(
                <div key={i} style={{display:"flex", flexDirection:"column", gap:'var(--sp-sm)', background:'rgba(4,8,20,0.45)', border:`1px solid ${T.a1}33`, borderRadius:'var(--rad-md)', padding:'var(--sp-md)', minWidth:0}}>
                  <div style={{display:'flex',alignItems:'center',gap:'var(--sp-sm)',minWidth:0}}>
                    <div style={{fontSize:'calc(40px * var(--ui-scale))',width:'calc(54px * var(--ui-scale))',height:'calc(54px * var(--ui-scale))',display:'flex',alignItems:'center',justifyContent:'center',background:`linear-gradient(135deg,${T.a1}44,${T.a2}22)`,border:`1px solid ${T.a1}66`,borderRadius:'var(--rad-md)',flexShrink:0,filter:`drop-shadow(0 0 8px ${T.a1}66)`}}>{vData.icon}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:'var(--f-md)',fontWeight:900,color:'#fff',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{vData.name}</div>
                      <div style={{fontSize:'var(--f-xs)',color:'#94a3b8',fontStyle:'italic',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{vData.desc}</div>
                    </div>
                  </div>
                  <input type="text" value={names[i]} onChange={e=>updName(i,e.target.value)} maxLength={12} placeholder={`Joueur ${i+1}`} style={{borderColor:T.a1}}/>
                  <select value={roles[i]} onChange={e=>updRole(i,e.target.value)} style={{borderColor:T.a1, cursor:'pointer'}}>
                     {filteredVehicles.map(r => <option key={r.id} value={r.id}>{r.icon} {r.name}</option>)}
                  </select>
                  <div style={{display:'flex',flexDirection:'column',gap:'var(--sp-xs)'}}>
                    <div title={`Bonus : ${vData.b}`} style={{display:'flex',alignItems:'center',gap:'var(--sp-xs)',background:'rgba(34,197,94,0.12)',border:'1px solid rgba(34,197,94,0.45)',borderRadius:'var(--rad-sm)',padding:'var(--sp-xs) var(--sp-sm)',fontSize:'var(--f-xs)',fontWeight:700,color:'#86efac',minWidth:0}}>
                      <span style={{flexShrink:0}}>✓</span>
                      <span style={{whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{vData.b}</span>
                    </div>
                    <div title={`Malus : ${vData.m}`} style={{display:'flex',alignItems:'center',gap:'var(--sp-xs)',background:'rgba(239,68,68,0.10)',border:'1px solid rgba(239,68,68,0.40)',borderRadius:'var(--rad-sm)',padding:'var(--sp-xs) var(--sp-sm)',fontSize:'var(--f-xs)',fontWeight:700,color:'#fca5a5',minWidth:0}}>
                      <span style={{flexShrink:0}}>⚠</span>
                      <span style={{whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{vData.m}</span>
                    </div>
                  </div>
                </div>
              );})}
            </div>
        )}
        
        {!isSolo && (
            <div onClick={()=>{AudioSys.click(); setHasAI(v=>!v);}} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",background:"rgba(15,23,42,.5)",borderRadius:12,border:`1px solid ${hasAI?T.a1+"66":"rgba(255,255,255,.06)"}`,cursor:"pointer",marginBottom:20,marginTop:10,transition:"all .2s"}}>
              <div style={{width:28,height:28,borderRadius:8,border:`2px solid ${hasAI?T.a1:"#1e293b"}`,background:hasAI?T.a1:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{hasAI&&<span style={{color:"#fff",fontSize:16,fontWeight:900}}>✓</span>}</div>
              <span style={{color:"#cbd5e1",fontSize:14,fontWeight:600}}>{meta?.aiIcon||"🤖"} Ajouter une IA adversaire (Véhicule Aléatoire)</span>
            </div>
        )}

        {/* CTA DEMARRER premium pleine largeur avec glow neon thematique (inspire ref) */}
        <button className="bg start-cta" onClick={()=>{AudioSys.click(); onStart(num, names.slice(0,num), roles.slice(0,num), hasAI, filteredVehicles);}}
                style={{background:`linear-gradient(135deg,${T.a1},${T.a2})`, boxShadow:`0 0 0 2px ${T.a1}aa, 0 12px 32px ${T.a1}55, inset 0 0 24px ${T.a1}33`}}>
            ▶ DÉMARRER
        </button>
      </div>
    </div>
  );
}

// ─── NETWORK LAYER (multi local + Hamachi) ─────────────────────────────────
// Charge les modules Node natifs UNIQUEMENT si on est dans Electron (require dispo).
// En navigateur web pur, ces fonctions retournent null/no-op pour éviter les crashs.
const NetLayer = (() => {
    let serverMod = null, clientMod = null, netinfoMod = null, available = false;
    try {
        if (typeof require === 'function') {
            serverMod  = require('./server.js');
            clientMod  = require('./netclient.js');
            netinfoMod = require('./netinfo.js');
            available = true;
        }
    } catch(e) { console.warn('[NetLayer] modules Node indisponibles (navigateur web ?)', e?.message); }
    return {
        available,
        createServer: serverMod && serverMod.createServer,
        createClient: clientMod && clientMod.createClient,
        getLocalIPs:  netinfoMod ? netinfoMod.getLocalIPs : () => [],
        getBestIP:    netinfoMod ? netinfoMod.getBestIP   : () => null,
        DEFAULT_PORT: (serverMod && serverMod.DEFAULT_PORT) || 7891,
    };
})();

// ─── EXT-020 — Self runtime seam progressif ────────────────────────────────
// Charge uniquement l'adaptateur self extrait. En navigateur pur ou si le module
// est indisponible, processPlay conserve son flux legacy sans casser la partie.
const RuntimeSelfLayer = (() => {
    let selfAdapter = null, available = false;
    try {
        if (typeof require === 'function') {
            selfAdapter = require('./src/features/game-runtime/process-play-self-adapter.js');
            available = !!selfAdapter?.resolveSelfCardPlay;
        }
    } catch(e) { console.warn('[RuntimeSelfLayer] adaptateur self indisponible, fallback legacy actif', e?.message); }
    return {
        available,
        resolveSelfCardPlay: selfAdapter?.resolveSelfCardPlay || null,
        isSelfRuntimeCard: selfAdapter?.isSelfRuntimeCard || ((card) => !!card && card.type !== 'attack' && card.type !== 'action' && !card.isZone && !card.isChaos),
    };
})();

// ─── LobbyHost — Crée une partie locale et affiche l'IP partageable ─────────
function LobbyHost({onBack, onStart, theme, meta}){
    const T = THEMES[theme] || THEMES.bleu;
    const [ips, setIps] = useState(()=>NetLayer.getLocalIPs());
    const [port, setPort] = useState(NetLayer.DEFAULT_PORT);
    const [hostName, setHostName] = useState('Hôte');
    const [localPlayers, setLocalPlayers] = useState(1);
    const [localPlayerNames, setLocalPlayerNames] = useState(['Joueur local 1']);
    const [phoneMode, setPhoneMode] = useState(true);
    const [interfacesOpen, setInterfacesOpen] = useState(false);
    const [hostReady, setHostReady] = useState(true);
    const [status, setStatus] = useState({running:false, clientCount:0});
    const [roster, setRoster] = useState({clients:[], slotsAllocated:0});
    const [errorMsg, setErrorMsg] = useState('');
    const [copied, setCopied] = useState(false);
    const serverRef = useRef(null);
    const handedOffRef = useRef(false);

    const rescanIPs = () => setIps(NetLayer.getLocalIPs());
    useEffect(() => { rescanIPs(); }, []);
    useEffect(() => {
        setLocalPlayerNames(prev => {
            const next = prev.slice(0, localPlayers);
            while (next.length < localPlayers) next.push(`Joueur local ${next.length + 1}`);
            return next;
        });
    }, [localPlayers]);

    const startServer = async () => {
        if (!NetLayer.available || !NetLayer.createServer) {
            setErrorMsg('Multi local indisponible (lancez via Electron : npm start)');
            return;
        }
        setErrorMsg('');
        try {
            const srv = NetLayer.createServer({
                port: parseInt(port,10) || NetLayer.DEFAULT_PORT,
                mobileEnabled: phoneMode,
                mobilePort: (parseInt(port,10) || NetLayer.DEFAULT_PORT) + 1,
                hostName,
                onClientJoin: () => { setRoster(srv.getRoster()); },
                onClientLeave: () => { setRoster(srv.getRoster()); },
                onMessage: (id, msg) => {
                    if (msg.type === 'action') console.log('[host] action from', id, msg);
                    if (msg.type === 'mobile-action') console.log('[host] mobile action from', id, msg);
                },
                onStatus: (st) => setStatus(st),
                onError: (e) => {
                    const text = e.message || String(e);
                    if(/Invalid JSON|Bad JSON|non-json probe|http probe|Protocole invalide/i.test(text)) return;
                    setErrorMsg(text);
                },
            });
            await srv.start();
            serverRef.current = srv;
            if(srv.setHostPlayers) srv.setHostPlayers(localPlayerNames);
            setRoster(srv.getRoster());
        } catch(e) {
            setErrorMsg(`Impossible de démarrer (port ${port}) : ${e.message || e}`);
        }
    };

    const stopServer = async () => {
        if (serverRef.current) {
            try { await serverRef.current.stop(); } catch(e){}
            serverRef.current = null;
        }
        setStatus({running:false, clientCount:0});
        setRoster({clients:[], slotsAllocated:0});
    };

    useEffect(() => () => {
        // Si l'hôte lance la partie, le serveur est volontairement transmis au composant Game.
        // Ancien comportement : le cleanup du lobby stoppait le serveur à l'unmount,
        // bloquant les téléphones sur "état privé attendu".
        if (!handedOffRef.current && serverRef.current) {
            try { serverRef.current.stop(); } catch(e){}
        }
    }, []);
    useEffect(() => {
        if(serverRef.current && serverRef.current.setHostPlayers) {
            serverRef.current.setHostPlayers(localPlayerNames);
            setRoster(serverRef.current.getRoster());
        }
    }, [localPlayerNames]);
    useEffect(() => {
        if(!status.running) return;
        const t = setInterval(() => {
            if(serverRef.current) setRoster(serverRef.current.getRoster());
        }, 2000);
        return () => clearInterval(t);
    }, [status.running]);

    const bestIP = ips[0];
    const shareString = bestIP ? `${bestIP.address}:${port}` : `0.0.0.0:${port}`;
    const mobileString = bestIP ? `http://${bestIP.address}:${(parseInt(port,10)||NetLayer.DEFAULT_PORT)+1}/mobile` : '';
    const copyShare = () => {
        try {
            navigator.clipboard && navigator.clipboard.writeText(shareString);
            setCopied(true);
            setTimeout(()=>setCopied(false), 1500);
        } catch(e){}
    };

    const totalSlots = (localPlayers || 0) + (roster.slotsAllocated || 0);
    const roomPlayers = [
        ...localPlayerNames.map((name, idx) => ({
            playerId: `host:${idx}`,
            machine: 'Hôte',
            machineId: 'host',
            localIndex: idx,
            name: String(name || '').trim() || `Joueur local ${idx + 1}`,
            ready: hostReady,
        })),
        ...roster.clients.flatMap(c => {
            const names = Array.isArray(c.playerNames) ? c.playerNames : Array.from({length:c.localPlayers||1}, (_,i)=>`${c.name} #${i+1}`);
            return names.map((n, idx) => ({
                playerId: `${c.id}:${idx}`,
                machine: c.name || `Client ${c.id}`,
                machineId: c.id,
                localIndex: idx,
                name: n,
                ready: true,
            }));
        })
    ];
    const canStart = status.running && totalSlots >= 2 && hostReady;

    return (
        <div className="page-transition" style={{height:"100%",width:"100%",background:`radial-gradient(ellipse at 50% 0%,${T.bg2},${T.bg} 70%)`,display:"flex",alignItems:"center",justifyContent:"center",padding:'var(--sp-lg)',position:"relative",overflow:"auto", fontFamily:T.font}}>
            <DynamicBG theme={theme} inGame={false}/>
            <Pts color={T.particle} count={14}/>
            <div style={{background:"rgba(4,8,20,.94)",border:`2px solid ${T.a1}`,borderRadius:'var(--rad-lg)',padding:'var(--sp-lg)',width:"min(96vw, calc(1720px * var(--ui-scale)))",maxWidth:'96vw',minHeight:'min(calc(780px * var(--ui-scale)), 94vh)',maxHeight:'94vh',overflow:'hidden',position:"relative",zIndex:1,animation:"zin .35s both", backdropFilter:"blur(10px)", boxShadow:`0 0 0 1px ${T.a1}44, 0 0 60px ${T.a1}33`,display:'flex',flexDirection:'column',gap:'var(--sp-md)'}}>
                <button onClick={()=>{AudioSys.click(); onBack();}} style={{background:"none",border:"none",color:"#cbd5e1",cursor:"pointer",fontSize:'var(--f-sm)',fontWeight:600,padding:0}}>← Retour</button>
                <h2 className="neon" style={{fontSize:'var(--f-xxl)',fontWeight:900,color:T.a1,letterSpacing:3,textAlign:"center",textShadow:`0 0 14px ${T.a1}`}}>🌐 HÉBERGER UNE PARTIE</h2>

                {!NetLayer.available && (
                    <div style={{background:'rgba(239,68,68,0.12)',border:'1px solid #ef4444',borderRadius:'var(--rad-sm)',padding:'var(--sp-md)',color:'#fca5a5',fontSize:'var(--f-sm)'}}>
                        ⚠ Cette fonctionnalité requiert Electron (lancez <code style={{background:'#000',padding:'1px 6px',borderRadius:4}}>npm start</code>).
                    </div>
                )}

                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(min(100%, calc(520px * var(--ui-scale))), 1fr))',gap:'var(--sp-lg)',minHeight:0,flex:1}}>
                    <div style={{display:'flex',flexDirection:'column',gap:'var(--sp-md)',minHeight:0,overflowY:'auto',paddingRight:'var(--sp-xs)'}}>
                        <div style={{display:'grid', gridTemplateColumns:'1.2fr .8fr .9fr', gap:'var(--sp-sm)'}}>
                            <div>
                                <label style={{display:'block', fontSize:'var(--f-xs)', color:'#94a3b8', textTransform:'uppercase', letterSpacing:2, fontWeight:700, marginBottom:'var(--sp-xs)'}}>Nom de la partie / hôte</label>
                                <input type="text" value={hostName} onChange={e=>setHostName(e.target.value)} disabled={status.running} maxLength={20} style={{borderColor:T.a1}}/>
                            </div>
                            <div>
                                <label style={{display:'block', fontSize:'var(--f-xs)', color:'#94a3b8', textTransform:'uppercase', letterSpacing:2, fontWeight:700, marginBottom:'var(--sp-xs)'}}>Port</label>
                                <input type="number" value={port} onChange={e=>setPort(e.target.value)} disabled={status.running} min={1025} max={65535} style={{borderColor:T.a1}}/>
                            </div>
                            <div>
                                <label style={{display:'block', fontSize:'var(--f-xs)', color:'#94a3b8', textTransform:'uppercase', letterSpacing:2, fontWeight:700, marginBottom:'var(--sp-xs)'}}>Joueurs locaux (ce PC)</label>
                                <select value={localPlayers} onChange={e=>setLocalPlayers(parseInt(e.target.value,10))} disabled={status.running} style={{borderColor:T.a1, cursor:'pointer'}}>
                                    {[1,2,3,4,5,6,7].map(n => <option key={n} value={n}>{n} joueur{n>1?'s':''}</option>)}
                                </select>
                            </div>
                        </div>
                        <label style={{display:'flex',alignItems:'center',gap:'var(--sp-sm)',padding:'var(--sp-sm) var(--sp-md)',background:'rgba(14,165,233,.10)',border:'1px solid rgba(56,189,248,.35)',borderRadius:'var(--rad-sm)',color:'#dbeafe',fontWeight:800,cursor:status.running?'not-allowed':'pointer'}}>
                            <input type="checkbox" checked={phoneMode} disabled={status.running} onChange={e=>setPhoneMode(e.target.checked)} style={{width:16,height:16}}/>
                            📱 Activer le mode téléphone / second écran
                        </label>

                        <div style={{background:'rgba(0,0,0,0.35)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'var(--rad-md)',padding:'var(--sp-sm)'}}>
                            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'var(--sp-sm)'}}>
                                <div style={{fontSize:'var(--f-sm)',color:'#94a3b8',textTransform:'uppercase',letterSpacing:3,fontWeight:700}}>📡 Interfaces détectées</div>
                                <div style={{display:'flex',alignItems:'center',gap:'var(--sp-xs)'}}>
                                    <button onClick={()=>setInterfacesOpen(v=>!v)} style={{background:'rgba(15,23,42,0.8)',border:'1px solid rgba(255,255,255,0.15)',borderRadius:99,padding:'4px 12px',color:'#cbd5e1',fontSize:'var(--f-xs)',cursor:'pointer',fontFamily:'inherit'}}>
                                        {interfacesOpen ? 'Masquer' : `Afficher (${ips.length})`}
                                    </button>
                                    <button onClick={rescanIPs} style={{background:'rgba(15,23,42,0.8)',border:'1px solid rgba(255,255,255,0.15)',borderRadius:99,padding:'4px 12px',color:'#cbd5e1',fontSize:'var(--f-xs)',cursor:'pointer',fontFamily:'inherit'}}>🔄 Re-scan</button>
                                </div>
                            </div>
                            {interfacesOpen && ips.length === 0 && (
                                <div style={{color:'#94a3b8', fontSize:'var(--f-sm)', fontStyle:'italic', padding:'var(--sp-md)', textAlign:'center'}}>
                                    Aucune interface réseau détectée. Vérifiez votre connexion (Wi-Fi, Ethernet, Hamachi).
                                </div>
                            )}
                            {interfacesOpen && (
                                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'var(--sp-xs)'}}>
                                    {ips.map((ip, idx) => (
                                        <div key={ip.address+ip.name} style={{display:'flex',alignItems:'center',gap:'var(--sp-xs)',padding:'var(--sp-xs) var(--sp-sm)',background: idx===0 ? `linear-gradient(135deg, ${T.a1}22, ${T.a1}0d)` : 'rgba(0,0,0,0.3)', border: idx===0 ? `1px solid ${T.a1}` : '1px solid rgba(255,255,255,0.06)', borderRadius:'var(--rad-sm)',minWidth:0}}>
                                            <span style={{fontSize:'var(--f-md)'}}>{ip.isHamachi ? '🌐' : ip.isPrivate ? '🏠' : '📡'}</span>
                                            <span style={{fontSize:'var(--f-xs)', padding:'2px 6px', borderRadius:99, background: ip.isHamachi ? 'rgba(124,58,237,0.3)' : 'rgba(59,130,246,0.2)', color: ip.isHamachi ? '#c4b5fd' : '#93c5fd', fontWeight:800, letterSpacing:1}}>
                                                {ip.isHamachi ? 'HAMACHI' : ip.isVirtual ? 'VIRT' : ip.isPrivate ? 'LAN' : 'NET'}
                                            </span>
                                            <span style={{fontSize:'var(--f-sm)', color:'#cbd5e1', fontWeight:700,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',minWidth:0,flex:1}}>{ip.address}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {bestIP && (
                                <div style={{marginTop:'var(--sp-sm)', padding:'var(--sp-sm) var(--sp-md)', background:'rgba(0,0,0,0.5)', border:`1px solid ${T.a1}`, borderRadius:'var(--rad-sm)', display:'flex', alignItems:'center', gap:'var(--sp-md)'}}>
                                    <div style={{flex:1,minWidth:0}}>
                                        <div style={{fontSize:'var(--f-xs)', color:'#94a3b8', textTransform:'uppercase', letterSpacing:2, fontWeight:700}}>Adresse recommandée à partager</div>
                                        <div style={{fontSize:'var(--f-lg)', color:'#fbbf24', fontWeight:900, fontFamily:'monospace',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{shareString}</div>
                                    </div>
                                    <button onClick={copyShare} style={{background:T.a1, border:'none', borderRadius:99, padding:'8px 18px', color:'#fff', fontWeight:800, fontSize:'var(--f-sm)', cursor:'pointer', fontFamily:'inherit'}}>
                                        {copied ? '✓ Copié' : '📋 Copier'}
                                    </button>
                                </div>
                            )}
                            {phoneMode && bestIP && (
                                <div style={{marginTop:'var(--sp-sm)', padding:'var(--sp-sm) var(--sp-md)', background:'rgba(14,165,233,.10)', border:'1px solid rgba(56,189,248,.45)', borderRadius:'var(--rad-sm)', display:'grid', gap:'var(--sp-xs)'}}>
                                    <div style={{fontSize:'var(--f-xs)', color:'#93c5fd', textTransform:'uppercase', letterSpacing:2, fontWeight:800}}>URL téléphone / main privée</div>
                                    <div style={{fontSize:'var(--f-sm)', color:'#e0f2fe', fontWeight:900, fontFamily:'monospace', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{mobileString}</div>
                                    <div style={{fontSize:'var(--f-xs)', color:'#94a3b8'}}>À ouvrir depuis un téléphone sur le même réseau ou via Hamachi. Port mobile : {(parseInt(port,10)||NetLayer.DEFAULT_PORT)+1}</div>
                                </div>
                            )}
                        </div>

                        <div style={{padding:'var(--sp-sm) var(--sp-md)', background:'rgba(0,0,0,0.4)', borderRadius:'var(--rad-sm)', border:'1px solid rgba(255,255,255,0.08)'}}>
                            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'var(--sp-md)',flexWrap:'wrap'}}>
                                <div>
                                    <div style={{fontSize:'var(--f-xs)', color:'#94a3b8', textTransform:'uppercase', letterSpacing:2, fontWeight:700}}>Statut serveur</div>
                                    <div style={{fontSize:'var(--f-md)', color: status.running ? '#86efac' : '#94a3b8', fontWeight:900}}>
                                        {status.running ? `🟢 Lancé (port ${status.port})` : '⚫ Arrêté'}
                                    </div>
                                    <div style={{fontSize:'var(--f-xs)', color:'#cbd5e1', marginTop:'var(--sp-xs)'}}>
                                        Slots : <b>{totalSlots}</b> — Locaux: {localPlayers} / Distants: {roster.slotsAllocated}
                                    </div>
                                </div>
                                {!status.running
                                    ? <button onClick={startServer} disabled={!NetLayer.available} style={{background:`linear-gradient(135deg, #22c55e, #15803d)`, border:'none', borderRadius:'var(--rad-sm)', padding:'var(--sp-sm) var(--sp-lg)', color:'#fff', fontWeight:900, fontSize:'var(--f-md)', cursor:NetLayer.available?'pointer':'not-allowed', letterSpacing:1, opacity:NetLayer.available?1:0.4, fontFamily:'inherit'}}>▶ Démarrer</button>
                                    : <button onClick={stopServer} style={{background:`linear-gradient(135deg, #ef4444, #991b1b)`, border:'none', borderRadius:'var(--rad-sm)', padding:'var(--sp-sm) var(--sp-lg)', color:'#fff', fontWeight:900, fontSize:'var(--f-md)', cursor:'pointer', letterSpacing:1, fontFamily:'inherit'}}>■ Arrêter</button>
                                }
                            </div>
                        </div>
                    </div>

                    <div style={{display:'flex',flexDirection:'column',gap:'var(--sp-sm)',minHeight:0,overflowY:'auto',paddingLeft:'var(--sp-xs)'}}>
                        <div style={{background:'rgba(0,0,0,0.35)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'var(--rad-md)',padding:'var(--sp-sm)'}}>
                            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'var(--sp-sm)'}}>
                                <div style={{fontSize:'var(--f-sm)',fontWeight:800,color:'#cbd5e1'}}>🧑‍🤝‍🧑 Joueurs locaux (hôte)</div>
                                <label style={{display:'flex',alignItems:'center',gap:8,fontSize:'var(--f-xs)',color:'#cbd5e1',cursor:'pointer'}}>
                                    <input type="checkbox" checked={hostReady} onChange={e=>setHostReady(e.target.checked)} style={{width:14,height:14}}/>
                                    Prêt
                                </label>
                            </div>
                            <div style={{display:'grid',gap:'var(--sp-xs)'}}>
                                {localPlayerNames.map((name, idx)=>(
                                    <div key={idx} style={{display:'grid',gridTemplateColumns:'auto 1fr auto',alignItems:'center',gap:'var(--sp-xs)',padding:'var(--sp-xs)',background:'rgba(15,23,42,0.6)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:'var(--rad-sm)'}}>
                                        <span style={{fontSize:'var(--f-xs)',color:'#94a3b8',fontWeight:700}}>Joueur local {idx+1}</span>
                                        <input type="text" value={name} onChange={(e)=>setLocalPlayerNames(prev=>prev.map((v,i)=>i===idx?e.target.value:v))} maxLength={18} disabled={status.running} style={{margin:0,padding:'6px 8px',fontSize:'var(--f-sm)',minHeight:'unset',borderColor:T.a1}}/>
                                        <span style={{fontSize:'var(--f-xs)',color:hostReady?'#86efac':'#f59e0b',fontWeight:800}}>{hostReady?'Prêt':'Attente'}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{background:'rgba(0,0,0,0.35)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'var(--rad-md)',padding:'var(--sp-sm)'}}>
                            <div style={{fontSize:'var(--f-sm)',fontWeight:800,color:'#cbd5e1',marginBottom:'var(--sp-sm)'}}>🖥 Machines connectées</div>
                            <div style={{display:'grid',gap:6}}>
                                <div style={{display:'flex',alignItems:'center',gap:'var(--sp-xs)',padding:'var(--sp-xs)',background:'rgba(15,23,42,0.6)',borderRadius:'var(--rad-sm)'}}>
                                    <span>🟢</span>
                                    <span style={{fontWeight:800,color:'#fff'}}>Hôte local</span>
                                    <span style={{fontSize:'var(--f-xs)',color:'#94a3b8'}}>({localPlayers} joueur{localPlayers>1?'s':''})</span>
                                </div>
                                {roster.clients.length === 0 && <div style={{fontSize:'var(--f-xs)',color:'#64748b'}}>Aucun client distant</div>}
                                {roster.clients.map(c => (
                                    <div key={c.id} style={{display:'flex',alignItems:'center',gap:'var(--sp-xs)',padding:'var(--sp-xs)',background:'rgba(15,23,42,0.6)',borderRadius:'var(--rad-sm)'}}>
                                        <span>🟢</span>
                                        <span style={{fontWeight:800,color:'#fff'}}>{c.name}</span>
                                        <span style={{fontSize:'var(--f-xs)',color:'#94a3b8'}}>{c.addr}</span>
                                        <span style={{marginLeft:'auto',fontSize:'var(--f-xs)',color:'#cbd5e1',padding:'2px 6px',background:'rgba(59,130,246,0.2)',borderRadius:99}}>{c.localPlayers} joueur{c.localPlayers>1?'s':''}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{background:'rgba(0,0,0,0.35)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'var(--rad-md)',padding:'var(--sp-sm)',flex:1,minHeight:0}}>
                            <div style={{fontSize:'var(--f-sm)',fontWeight:800,color:'#cbd5e1',marginBottom:'var(--sp-sm)'}}>📋 Joueurs présents ({roomPlayers.length})</div>
                            <div style={{display:'grid',gap:6,maxHeight:'calc(280px * var(--ui-scale))',overflowY:'auto',paddingRight:4}}>
                                {roomPlayers.map((rp, idx)=>(
                                    <div key={`${rp.machineId}-${idx}`} style={{display:'grid',gridTemplateColumns:'auto 1fr auto auto',alignItems:'center',gap:'var(--sp-xs)',padding:'var(--sp-xs)',background:'rgba(15,23,42,0.6)',borderRadius:'var(--rad-sm)',border:'1px solid rgba(255,255,255,0.06)'}}>
                                        <span style={{fontSize:'var(--f-xs)',color:'#fbbf24',fontWeight:900}}>#{idx+1}</span>
                                        <span style={{color:'#fff',fontWeight:700,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{rp.name}</span>
                                        <span style={{fontSize:'var(--f-xs)',color:'#94a3b8',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{rp.machine}</span>
                                        <span style={{fontSize:'var(--f-xs)',color:rp.ready?'#86efac':'#f59e0b',fontWeight:800}}>{rp.ready?'Prêt':'Attente'}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {phoneMode && (
                            <div style={{background:'rgba(0,0,0,0.35)',border:'1px solid rgba(56,189,248,0.25)',borderRadius:'var(--rad-md)',padding:'var(--sp-sm)'}}>
                                <div style={{fontSize:'var(--f-sm)',fontWeight:800,color:'#bae6fd',marginBottom:'var(--sp-sm)'}}>📱 Téléphones associés ({(roster.mobileControllers||[]).length})</div>
                                <div style={{display:'grid',gap:6}}>
                                    {(roster.mobileControllers||[]).length===0 && <div style={{fontSize:'var(--f-xs)',color:'#64748b'}}>Aucun téléphone connecté pour l'instant.</div>}
                                    {(roster.mobileControllers||[]).map((m,idx)=>(
                                        <div key={`${m.playerId}-${idx}`} style={{display:'grid',gridTemplateColumns:'1fr auto auto',gap:'var(--sp-xs)',alignItems:'center',padding:'var(--sp-xs)',background:'rgba(15,23,42,0.6)',borderRadius:'var(--rad-sm)'}}>
                                            <span style={{fontSize:'var(--f-sm)',color:'#e0f2fe',fontWeight:800,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{m.deviceName}</span>
                                            <span style={{fontSize:'var(--f-xs)',color:'#93c5fd',fontWeight:800}}>{m.playerId}</span>
                                            <span style={{fontSize:'var(--f-xs)',color:m.syncStatus==='synced'?'#86efac':'#fbbf24',fontWeight:900,padding:'2px 6px',borderRadius:99,background:m.syncStatus==='synced'?'rgba(34,197,94,.13)':'rgba(251,191,36,.12)',whiteSpace:'nowrap'}}>
                                                {m.syncStatus==='synced'?'Synchronisé':'État privé attendu'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {errorMsg && (
                    <div style={{background:'rgba(239,68,68,0.12)',border:'1px solid #ef4444',borderRadius:'var(--rad-sm)',padding:'var(--sp-sm) var(--sp-md)',color:'#fca5a5',fontSize:'var(--f-sm)'}}>
                        ⚠ {errorMsg}
                    </div>
                )}

                <button onClick={()=>{ AudioSys.click(); handedOffRef.current = true; if(onStart) onStart({hostName, localPlayers, localPlayerNames, roster, roomPlayers, server:serverRef.current, phoneMode, mobileUrl:mobileString, mobilePort:(parseInt(port,10)||NetLayer.DEFAULT_PORT)+1}); }}
                    disabled={!canStart}
                    style={{width:'100%', padding:'var(--sp-md)', background:canStart ? `linear-gradient(135deg,${T.a1},${T.a2})` : 'rgba(15,23,42,0.6)', border:'none', borderRadius:'var(--rad-md)', color:'#fff', fontWeight:900, fontSize:'var(--f-lg)', letterSpacing:3, cursor:canStart ? 'pointer' : 'not-allowed', fontFamily:'inherit', opacity:canStart ? 1 : 0.5}}>
                    ▶ DÉMARRER LA PARTIE {totalSlots>=2 ? `(${totalSlots} joueurs)` : '(min. 2)'}
                </button>
            </div>
        </div>
    );
}

// ─── LobbyJoin — Rejoindre une partie hébergée par IP:port ────────────────
function LobbyJoin({onBack, onJoined, theme, meta}){
    const T = THEMES[theme] || THEMES.bleu;
    const [host, setHost] = useState('');
    const [port, setPort] = useState(NetLayer.DEFAULT_PORT);
    const [playerName, setPlayerName] = useState('Joueur');
    const [localPlayers, setLocalPlayers] = useState(1);
    const [localPlayerNames, setLocalPlayerNames] = useState(['Joueur local 1']);
    const [status, setStatus] = useState('idle'); // idle | connecting | connected | error
    const [errorMsg, setErrorMsg] = useState('');
    const [serverInfo, setServerInfo] = useState(null);
    const [tableState, setTableState] = useState(null);
    const [privateState, setPrivateState] = useState(null);
    const [remoteMsg, setRemoteMsg] = useState('');
    const clientRef = useRef(null);
    const joiningRef = useRef(false);
    useEffect(() => {
        setLocalPlayerNames(prev => {
            const next = prev.slice(0, localPlayers);
            while (next.length < localPlayers) next.push(`Joueur local ${next.length + 1}`);
            return next;
        });
    }, [localPlayers]);

    const doJoin = async () => {
        if(joiningRef.current) return;
        if (!NetLayer.available || !NetLayer.createClient) {
            setErrorMsg('Multi local indisponible (lancez via Electron : npm start)');
            return;
        }
        joiningRef.current = true;
        setErrorMsg('');
        setStatus('connecting');
        try {
            const cli = NetLayer.createClient({
                host: host.trim(),
                port: parseInt(port,10) || NetLayer.DEFAULT_PORT,
                onOpen: () => { joiningRef.current = false; setStatus('connected'); cli.send({type:'hello', name:playerName, localPlayers, playerNames: localPlayerNames, version:1}); },
                onMessage: (msg) => {
                    if (msg.type === 'welcome') setServerInfo({hostName: msg.hostName, clientId: msg.clientId});
                    if (msg.type === 'roster') setServerInfo(prev => ({...(prev||{}), roster: msg}));
                    if (msg.type === 'state') setTableState(msg.state || null);
                    if (msg.type === 'private-state') setPrivateState(msg.state || null);
                    if (msg.type === 'remote-result') setRemoteMsg(msg.message || (msg.ok ? 'Action acceptée' : 'Action refusée'));
                    if (msg.type === 'error') setErrorMsg(msg.message || 'Erreur serveur');
                },
                onClose: (reason) => { joiningRef.current = false; setStatus('idle'); setServerInfo(null); setTableState(null); setPrivateState(null); if(reason && reason !== 'manual') setErrorMsg('Déconnecté : ' + reason); },
                onError: (e) => { joiningRef.current = false; setErrorMsg(e.message || String(e)); setStatus('error'); },
            });
            await cli.connect();
            clientRef.current = cli;
        } catch(e) {
            joiningRef.current = false;
            setStatus('error');
            setErrorMsg(`Connexion échouée : ${e.message || e}`);
        }
    };

    const doDisconnect = () => {
        if (clientRef.current) { try { clientRef.current.disconnect('manual'); } catch(e){} clientRef.current = null; }
        setStatus('idle'); setServerInfo(null);
    };

    const sendRemoteAction = (playerId, action, payload={}) => {
        const ok = clientRef.current?.send({type:'remote-action', playerId, action, payload});
        setRemoteMsg(ok ? 'Action envoyée à l’hôte…' : 'Connexion indisponible.');
        if(!ok) setErrorMsg('Impossible d’envoyer l’action à l’hôte.');
    };

    useEffect(() => () => { if (clientRef.current) { try { clientRef.current.disconnect('unmount'); } catch(e){} } }, []);

    return (
        <div className="page-transition" style={{height:"100%",width:"100%",background:`radial-gradient(ellipse at 50% 0%,${T.bg2},${T.bg} 70%)`,display:"flex",alignItems:"center",justifyContent:"center",padding:'var(--sp-lg)',position:"relative",overflow:"auto", fontFamily:T.font}}>
            <DynamicBG theme={theme} inGame={false}/>
            <Pts color={T.particle} count={14}/>
            <div style={{background:"rgba(4,8,20,.94)",border:`2px solid ${T.a1}`,borderRadius:'var(--rad-lg)',padding:'var(--sp-xl)',width:"100%",maxWidth:status==='connected'?'min(calc(1180px * var(--ui-scale)), 98vw)':'min(calc(640px * var(--ui-scale)), 96vw)',maxHeight:'94vh',overflowY:'auto',position:"relative",zIndex:1,animation:"zin .35s both",transition:"max-width .35s cubic-bezier(.4,0,.2,1)", backdropFilter:"blur(10px)", boxShadow:`0 0 0 1px ${T.a1}44, 0 0 60px ${T.a1}33`}}>
                <button onClick={()=>{AudioSys.click(); onBack();}} style={{background:"none",border:"none",color:"#cbd5e1",cursor:"pointer",fontSize:'var(--f-sm)',fontWeight:600,marginBottom:'var(--sp-md)',padding:0}}>← Retour</button>
                <h2 className="neon" style={{fontSize:'var(--f-xxl)',fontWeight:900,color:T.a1,marginBottom:'var(--sp-lg)',letterSpacing:3,textAlign:"center",textShadow:`0 0 14px ${T.a1}`}}>🔗 REJOINDRE UNE PARTIE</h2>

                {!NetLayer.available && (
                    <div style={{background:'rgba(239,68,68,0.12)',border:'1px solid #ef4444',borderRadius:'var(--rad-sm)',padding:'var(--sp-md)',color:'#fca5a5',fontSize:'var(--f-sm)',marginBottom:'var(--sp-md)'}}>
                        ⚠ Cette fonctionnalité requiert Electron.
                    </div>
                )}

                <div style={{display:'grid',gap:'var(--sp-md)',marginBottom:'var(--sp-lg)'}}>
                    <div>
                        <label style={{display:'block', fontSize:'var(--f-xs)', color:'#94a3b8', textTransform:'uppercase', letterSpacing:2, fontWeight:700, marginBottom:'var(--sp-xs)'}}>Votre nom</label>
                        <input type="text" value={playerName} onChange={e=>setPlayerName(e.target.value)} disabled={status==='connected'} maxLength={20} style={{borderColor:T.a1}}/>
                    </div>
                    <div style={{display:'grid', gridTemplateColumns:'2fr 1fr', gap:'var(--sp-md)'}}>
                        <div>
                            <label style={{display:'block', fontSize:'var(--f-xs)', color:'#94a3b8', textTransform:'uppercase', letterSpacing:2, fontWeight:700, marginBottom:'var(--sp-xs)'}}>Adresse IP de l'hôte (LAN ou Hamachi 25.x.x.x)</label>
                            <input type="text" placeholder="ex: 192.168.1.42 ou 25.x.x.x" value={host} onChange={e=>setHost(e.target.value)} disabled={status==='connected'} style={{borderColor:T.a1, fontFamily:'monospace'}}/>
                        </div>
                        <div>
                            <label style={{display:'block', fontSize:'var(--f-xs)', color:'#94a3b8', textTransform:'uppercase', letterSpacing:2, fontWeight:700, marginBottom:'var(--sp-xs)'}}>Port</label>
                            <input type="number" value={port} onChange={e=>setPort(e.target.value)} disabled={status==='connected'} min={1025} max={65535} style={{borderColor:T.a1}}/>
                        </div>
                    </div>
                    <div>
                        <label style={{display:'block', fontSize:'var(--f-xs)', color:'#94a3b8', textTransform:'uppercase', letterSpacing:2, fontWeight:700, marginBottom:'var(--sp-xs)'}}>Joueurs locaux sur cette machine</label>
                        <select value={localPlayers} onChange={e=>setLocalPlayers(parseInt(e.target.value,10))} disabled={status==='connected'} style={{borderColor:T.a1, cursor:'pointer'}}>
                            {[1,2,3,4,5,6,7].map(n => <option key={n} value={n}>{n} joueur{n>1?'s':''}</option>)}
                        </select>
                    </div>
                    <div style={{display:'grid',gap:'var(--sp-xs)',padding:'var(--sp-sm)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'var(--rad-sm)',background:'rgba(15,23,42,0.45)'}}>
                        {localPlayerNames.map((n, idx)=>(
                            <div key={idx} style={{display:'grid',gridTemplateColumns:'auto 1fr',alignItems:'center',gap:'var(--sp-xs)'}}>
                                <span style={{fontSize:'var(--f-xs)',color:'#94a3b8'}}>Local {idx+1}</span>
                                <input type="text" value={n} onChange={(e)=>setLocalPlayerNames(prev=>prev.map((x,i)=>i===idx?e.target.value:x))} maxLength={18} disabled={status==='connected'} style={{margin:0,padding:'6px 8px',fontSize:'var(--f-sm)',minHeight:'unset',borderColor:T.a1}}/>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Statut connexion */}
                <div style={{padding:'var(--sp-md)', background:'rgba(0,0,0,0.4)', borderRadius:'var(--rad-sm)', marginBottom:'var(--sp-md)'}}>
                    <div style={{fontSize:'var(--f-xs)', color:'#94a3b8', textTransform:'uppercase', letterSpacing:2, fontWeight:700}}>Statut</div>
                    <div style={{fontSize:'var(--f-md)', fontWeight:900, color: status==='connected' ? '#86efac' : status==='connecting' ? '#fbbf24' : status==='error' ? '#fca5a5' : '#94a3b8'}}>
                        {status==='connected' ? `🟢 Connecté à ${serverInfo?.hostName || '?'}`
                          : status==='connecting' ? '🟡 Connexion en cours…'
                          : status==='error' ? '🔴 Échec de connexion'
                          : '⚫ Non connecté'}
                    </div>
                    {serverInfo && serverInfo.roster && (
                        <div style={{marginTop:'var(--sp-sm)', fontSize:'var(--f-sm)', color:'#cbd5e1'}}>
                            👥 {serverInfo.roster.clients.length} client(s) — {serverInfo.roster.slotsAllocated} slot(s) distants
                        </div>
                    )}
                </div>

                {errorMsg && (
                    <div style={{background:'rgba(239,68,68,0.12)',border:'1px solid #ef4444',borderRadius:'var(--rad-sm)',padding:'var(--sp-sm) var(--sp-md)',color:'#fca5a5',fontSize:'var(--f-sm)',marginBottom:'var(--sp-md)'}}>
                        ⚠ {errorMsg}
                    </div>
                )}

                {status !== 'connected'
                    ? <button onClick={doJoin} disabled={!NetLayer.available || status==='connecting' || !host.trim()} style={{width:'100%', padding:'var(--sp-md)', background:`linear-gradient(135deg,${T.a1},${T.a2})`, border:'none', borderRadius:'var(--rad-md)', color:'#fff', fontWeight:900, fontSize:'var(--f-lg)', letterSpacing:3, cursor:'pointer', fontFamily:'inherit', opacity:(!NetLayer.available || status==='connecting' || !host.trim())?0.5:1}}>
                        {status==='connecting' ? '⏳ Connexion…' : '🔗 SE CONNECTER'}
                    </button>
                    : <button onClick={doDisconnect} style={{width:'100%', padding:'var(--sp-md)', background:'linear-gradient(135deg, #ef4444, #991b1b)', border:'none', borderRadius:'var(--rad-md)', color:'#fff', fontWeight:900, fontSize:'var(--f-lg)', letterSpacing:3, cursor:'pointer', fontFamily:'inherit'}}>
                        ■ DÉCONNECTER
                    </button>
                }

                {status === 'connected' && (
                    <div style={{marginTop:'var(--sp-lg)'}}>
                        <NetworkTableMirror
                            tableState={tableState}
                            privateState={privateState}
                            onAction={sendRemoteAction}
                            theme={theme}
                            message={remoteMsg}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── NetworkTableMirror — vue client distante synchronisée en temps réel ───
// Elle ne remplace pas le moteur : elle affiche l'état public reçu de l'hôte et
// envoie uniquement des intentions d'action. L'hôte reste autoritaire.
function NetworkTableMirror({tableState, privateState, onAction, theme, message}){
    const T = THEMES[theme] || THEMES.bleu;
    const [activePid, setActivePid] = useState(null);
    const [selected, setSelected] = useState(null);
    const [target, setTarget] = useState(null);
    const privatePlayers = privateState?.players || [];
    const activePrivate = privatePlayers.find(p => p.playerId === activePid) || privatePlayers[0] || null;

    useEffect(() => {
        if(privatePlayers.length && !privatePlayers.some(p => p.playerId === activePid)) {
            setActivePid(privatePlayers[0].playerId);
            setSelected(null);
            setTarget(null);
        }
    }, [privatePlayers.map(p=>p.playerId).join('|')]);

    if(!tableState) {
        return <div style={{color:'#94a3b8',fontSize:'var(--f-sm)',textAlign:'center'}}>En attente de synchronisation de la table…</div>;
    }
    const players = tableState.players || [];
    const logs = tableState.logs || [];
    const selectedCard = activePrivate && Number.isInteger(selected) ? activePrivate.hand?.[selected] : null;
    const needsTarget = selectedCard && (selectedCard.type === 'attack' || selectedCard.type === 'action') && !selectedCard.isZone && !selectedCard.isChaos;
    const canSend = !!activePrivate && !!selectedCard && !!selectedCard.playable && (!needsTarget || !!target);
    const sendPlay = () => {
        if(!canSend) return;
        onAction(activePrivate.playerId, 'play-card', {
            cardIndex:selected,
            targetKind:target?.kind,
            targetIndex:target?.index,
        });
        setSelected(null); setTarget(null);
    };
    const discard = () => {
        if(!activePrivate || !Number.isInteger(selected)) return;
        onAction(activePrivate.playerId, 'discard-card', {cardIndex:selected});
        setSelected(null); setTarget(null);
    };

    return (
        <div style={{display:'grid',gridTemplateColumns:'minmax(220px, 0.9fr) minmax(360px, 1.4fr)',gap:'var(--sp-md)',minHeight:0}}>
            <div style={{display:'grid',gap:'var(--sp-sm)',minHeight:0}}>
                <div style={{background:'rgba(15,23,42,.72)',border:`1px solid ${T.a1}44`,borderRadius:'var(--rad-md)',padding:'var(--sp-sm)'}}>
                    <div style={{fontSize:'var(--f-xs)',color:'#94a3b8',textTransform:'uppercase',letterSpacing:2,fontWeight:800}}>Table synchronisée</div>
                    <div style={{fontSize:'var(--f-md)',fontWeight:900,color:'#fff',marginTop:4}}>
                        Tour {tableState.turnNumber || 1} · {tableState.turnName || 'en attente'}
                    </div>
                    <div style={{display:'flex',gap:'var(--sp-sm)',marginTop:'var(--sp-xs)',fontSize:'var(--f-xs)',color:'#cbd5e1',flexWrap:'wrap'}}>
                        <span>Pioche {tableState.deckCount ?? 0}</span>
                        <span>Défausse {tableState.discardCount ?? 0}</span>
                        <span>{tableState.unit || 'km'}</span>
                    </div>
                    {message && <div style={{marginTop:'var(--sp-xs)',fontSize:'var(--f-xs)',color:'#bae6fd'}}>{message}</div>}
                </div>
                <div style={{display:'grid',gap:'var(--sp-xs)',maxHeight:'calc(340px * var(--ui-scale))',overflowY:'auto',paddingRight:4}}>
                    {players.map((p)=> {
                        const col = PC[p.colorIdx || 0] || PC[0];
                        const remoteTarget = normalizeTargetKm(p.targetKm || tableState.targetKm);
                        const pct = Math.min(100, ((p.km || 0) / remoteTarget) * 100);
                        return (
                            <div key={p.playerId || p.name} style={{background:p.isTurn?`linear-gradient(135deg,${col.main}22,rgba(15,23,42,.82))`:'rgba(4,8,20,.66)',border:`1px solid ${p.isTurn?col.main+'88':'rgba(255,255,255,.08)'}`,borderRadius:'var(--rad-sm)',padding:'var(--sp-sm)',boxShadow:p.isTurn?`0 0 18px ${col.glow}55`:'none'}}>
                                <div style={{display:'flex',alignItems:'center',gap:'var(--sp-xs)'}}>
                                    <span style={{fontSize:'var(--f-md)'}}>{p.icon || col.emoji}</span>
                                    <b style={{color:'#fff',fontSize:'var(--f-sm)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{p.name}</b>
                                    <span style={{marginLeft:'auto',color:'#fbbf24',fontSize:'var(--f-xs)',fontWeight:900}}>{p.km} {tableState.unit}</span>
                                </div>
                                <div style={{height:8,background:'#020617',borderRadius:99,overflow:'hidden',marginTop:6}}>
                                    <div style={{width:`${pct}%`,height:'100%',background:`linear-gradient(90deg,${col.main},${col.dark})`,transition:'width .5s'}}/>
                                </div>
                                <div style={{display:'flex',gap:5,flexWrap:'wrap',marginTop:6,fontSize:'var(--f-xs)',color:'#94a3b8'}}>
                                    <span>{p.status || 'En route'}</span>
                                    <span>⛽ {p.fuel ?? 100}%</span>
                                    <span>{p.handCount ?? 0} cartes</span>
                                    {p.phoneControlled && <span style={{color:'#7dd3fc'}}>📱 privé</span>}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div style={{background:'rgba(0,0,0,.35)',border:'1px solid rgba(255,255,255,.08)',borderRadius:'var(--rad-md)',padding:'var(--sp-sm)',minHeight:0}}>
                    <div style={{fontSize:'var(--f-xs)',color:'#94a3b8',textTransform:'uppercase',letterSpacing:2,fontWeight:800,marginBottom:'var(--sp-xs)'}}>Historique</div>
                    <div style={{display:'grid',gap:5,maxHeight:'calc(150px * var(--ui-scale))',overflowY:'auto'}}>
                        {logs.slice(-8).map(l => <div key={l.id} style={{display:'flex',gap:7,alignItems:'center',fontSize:'var(--f-xs)',color:'#cbd5e1'}}><span>{l.icon||'ℹ️'}</span><span>{l.msg}</span></div>)}
                    </div>
                </div>
            </div>
            <div style={{background:'rgba(4,8,20,.78)',border:`1px solid ${T.a1}33`,borderRadius:'var(--rad-lg)',padding:'var(--sp-md)',minWidth:0,minHeight:0}}>
                <div style={{display:'flex',gap:'var(--sp-xs)',alignItems:'center',marginBottom:'var(--sp-sm)',flexWrap:'wrap'}}>
                    <b style={{color:'#fff',fontSize:'var(--f-md)'}}>Vos joueurs sur ce PC</b>
                    {privatePlayers.map(p => (
                        <button key={p.playerId} className="bg" onClick={()=>{setActivePid(p.playerId);setSelected(null);setTarget(null);}} style={{border:`1px solid ${activePrivate?.playerId===p.playerId?T.a1:'rgba(255,255,255,.12)'}`,background:activePrivate?.playerId===p.playerId?`${T.a1}33`:'rgba(15,23,42,.72)',color:'#fff',borderRadius:99,padding:'var(--sp-xs) var(--sp-sm)',fontSize:'var(--f-xs)',fontWeight:800}}>{p.isTurn?'▶ ':''}{p.name}</button>
                    ))}
                </div>
                {!activePrivate ? (
                    <div style={{color:'#94a3b8'}}>Aucune main privée associée à ce PC pour l'instant.</div>
                ) : (
                    <>
                        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(118px,1fr))',gap:'var(--sp-sm)',maxHeight:'calc(360px * var(--ui-scale))',overflowY:'auto',paddingRight:4}}>
                            {(activePrivate.hand||[]).map((c,idx)=>(
                                <button key={`${c.uid||idx}-${idx}`} className="bg" title={c.reason || c.desc || c.sub || ''}
                                    onClick={()=>{setSelected(selected===idx?null:idx);setTarget(null);}}
                                    style={{minHeight:'calc(116px * var(--ui-scale))',borderRadius:'var(--rad-md)',border:selected===idx?`2px solid ${T.a1}`:'1px solid rgba(255,255,255,.1)',background:selected===idx?`linear-gradient(135deg,${T.a1}44,rgba(15,23,42,.9))`:'rgba(15,23,42,.78)',color:'#fff',padding:'var(--sp-sm)',display:'grid',alignContent:'center',justifyItems:'center',gap:4,opacity:c.playable?1:.48,filter:c.playable?'none':'grayscale(1)'}}>
                                    <span style={{fontSize:'var(--f-xl)'}}>{c.icon || '🎴'}</span>
                                    <b style={{fontSize:'var(--f-sm)'}}>{c.label}</b>
                                    <span style={{fontSize:'var(--f-xs)',color:'#cbd5e1'}}>{c.sub || c.desc || ''}</span>
                                </button>
                            ))}
                        </div>
                        {selectedCard && (
                            <div style={{marginTop:'var(--sp-md)',display:'grid',gap:'var(--sp-sm)',background:'rgba(0,0,0,.28)',borderRadius:'var(--rad-md)',padding:'var(--sp-sm)',border:'1px solid rgba(255,255,255,.08)'}}>
                                <div style={{display:'flex',gap:'var(--sp-sm)',alignItems:'center'}}>
                                    <span style={{fontSize:'var(--f-xl)'}}>{selectedCard.icon}</span>
                                    <div style={{minWidth:0}}>
                                        <b style={{color:'#fff'}}>{selectedCard.label}</b>
                                        <div style={{fontSize:'var(--f-xs)',color:selectedCard.playable?'#86efac':'#fca5a5'}}>{selectedCard.playable ? selectedCard.desc : selectedCard.reason}</div>
                                    </div>
                                </div>
                                {needsTarget && (
                                    <div style={{display:'flex',gap:'var(--sp-xs)',flexWrap:'wrap'}}>
                                        {(activePrivate.targets||[]).map(t => (
                                            <button key={`${t.kind}-${t.index}`} className="bg" onClick={()=>setTarget(t)} style={{background:target===t?'#ef4444':'rgba(239,68,68,.22)',border:'1px solid rgba(248,113,113,.5)',borderRadius:99,color:'#fff',fontWeight:800,padding:'var(--sp-xs) var(--sp-sm)'}}>{t.name}</button>
                                        ))}
                                    </div>
                                )}
                                <div style={{display:'flex',gap:'var(--sp-sm)',flexWrap:'wrap'}}>
                                    <button className="bg" disabled={!canSend} onClick={sendPlay} style={{background:`linear-gradient(135deg,${T.a1},${T.a2})`,border:0,borderRadius:99,color:'#fff',fontWeight:900,padding:'var(--sp-sm) var(--sp-lg)',opacity:canSend?1:.45}}>Jouer</button>
                                    <button className="bg" onClick={discard} style={{background:'rgba(15,23,42,.88)',border:'1px solid rgba(255,255,255,.12)',borderRadius:99,color:'#cbd5e1',fontWeight:800,padding:'var(--sp-sm) var(--sp-lg)'}}>Défausser</button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

function Menu({onSolo,onMulti,theme,setTheme,diff,setDiff,targetKm,setTargetKm,setScreen,meta,openSettings}){
  const T=THEMES[theme]||THEMES.bleu, isUni=UNIVERSE.includes(theme);
  const localPlay = getLocalPlayLabel(theme);
  // Boutons secondaires sidebar (6e bouton = Reglages, comme la ref)
  const secondaryNav = [
    {lbl:"Scores",   sc:"scores",  icon:"🏆"},
    {lbl:"Règles",   sc:"rules",   icon:"📜"},
    {lbl:"Crédits",  sc:"credits", icon:"💎"},
  ];
  return(
    <div className="page-transition" style={{height:"100%",width:"100%",background:`radial-gradient(ellipse at 50% -15%,${T.bg2} 0%,${T.bg} 65%)`,display:"flex",overflowY:"auto",overflowX:"hidden",position:"relative", fontFamily:T.font, flexWrap:"wrap", '--menu-bg':T.bg}}>
      <DynamicBG theme={theme} inGame={false}/>
      <Pts color={T.particle} count={30}/>
      <MuteBtn />

      {/* Bouton Reglages flottant haut-droite (style ref, conserve) */}
      {openSettings && (
        <button onClick={()=>{ AudioSys.click(); openSettings(); }}
                title="Réglages"
                className="menu-section-up"
                style={{position:"absolute", top:'var(--sp-sm)', right:'var(--sp-sm)', zIndex:1000, background:"rgba(0,0,0,0.55)", border:"1px solid rgba(255,255,255,0.20)", borderRadius:99, padding:'var(--sp-xs) var(--sp-md)', color:"#fff", fontSize:'var(--f-sm)', fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:'var(--sp-xs)', backdropFilter:'blur(8px)', animationDelay:'.05s'}}>
            <span style={{fontSize:'var(--f-md)'}}>⚙️</span><span>Réglages</span>
        </button>
      )}

      {/* ─── SIDEBAR gauche : composition proche Interface_Menu.png ─── */}
      <div className="menu-section-left"
           style={{width:'min(calc(360px * var(--ui-scale)), 32vw)',maxWidth:'100%',flexShrink:0,display:"flex",flexDirection:"column",justifyContent:"flex-start",padding:'calc(30px * var(--ui-scale)) calc(24px * var(--ui-scale))',gap:'var(--sp-sm)',borderRight:`1px solid ${T.a1}22`,position:"relative",zIndex:1,background:`linear-gradient(180deg, rgba(15,23,42,.92), rgba(2,6,23,.94))`, backdropFilter:"blur(10px)", overflowY:'auto', boxShadow:`inset -1px 0 0 rgba(255,255,255,.04), 12px 0 42px rgba(0,0,0,.28)`}}>

        {/* LOGO XL : icone flottante + halo respirant + titre + sous-titre version */}
        <div className="menu-logo" style={{color: T.a1}}>
          <div className="menu-logo-halo" style={{background: `radial-gradient(circle, ${T.a1}33, transparent 70%)`}}/>
          <div className={`menu-logo-title`} style={{color:"#fff", textShadow:"0 8px 18px rgba(0,0,0,.55)", fontSize:'calc(52px * var(--ui-scale))', lineHeight:0.95, letterSpacing:2, textAlign:'left'}}>
            MILLE <span style={{fontSize:'calc(34px * var(--ui-scale))'}}>🚗</span><br/>BORNES
          </div>
          <div className="menu-logo-sub" style={{color:"#94a3b8", textAlign:'left', letterSpacing:2}}>
            {meta?.title || "Bagley Edition"} · v{VERSION}
          </div>
        </div>

        {/* CTA PRINCIPAL : SOLO — pulse glow respirant, shimmer balayage */}
        <button className="bg menu-cta-primary menu-section-up"
                onClick={() => { AudioSys.click(); onSolo(); }}
                style={{background:`linear-gradient(135deg,${T.a1},${T.a2})`,border:"none",borderRadius:'var(--rad-md)',padding:'var(--sp-md) var(--sp-md)',fontSize:'var(--f-lg)',fontWeight:900,color:"#fff",cursor:"pointer",letterSpacing:1, color:'#fff', textShadow:'0 2px 8px rgba(0,0,0,0.4)', animationDelay:'.1s, 0s'}}>
            Jouer (Solo)
        </button>

        {/* CTA SECONDAIRE : MULTI — outline, shimmer plus discret */}
        <button className="bg menu-cta-secondary menu-section-up"
                onClick={() => { AudioSys.click(); onMulti(); }}
                title={localPlay.sub}
                style={{background:`linear-gradient(135deg,${T.a1},${T.a2})`,border:"none",borderRadius:'var(--rad-md)',padding:'var(--sp-sm) var(--sp-md)',fontSize:'var(--f-lg)',fontWeight:900,color:"#fff",cursor:"pointer",letterSpacing:1, animationDelay:'.18s',display:'flex',flexDirection:'column',alignItems:'center',gap:'calc(3px * var(--ui-scale))'}}>
            <span>{localPlay.title}</span>
            <span style={{fontSize:'var(--f-xs)',fontWeight:700,letterSpacing:.5,opacity:.82,textTransform:'none'}}>{localPlay.sub}</span>
        </button>

        {/* CTA RESEAU : multi local LAN / Hamachi (nouveau) */}
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'var(--sp-xs)'}}>
            <button className="bg menu-section-up"
                    onClick={() => { AudioSys.click(); setScreen("net_host"); }}
                    style={{background:"rgba(4,8,20,.85)",border:`1px solid ${T.a1}44`,borderRadius:'var(--rad-md)',padding:'var(--sp-sm)',fontSize:'var(--f-sm)',fontWeight:800,color:'#cbd5e1',cursor:"pointer",letterSpacing:1, animationDelay:'.22s', display:'flex', flexDirection:'column', gap:'var(--sp-xs)', alignItems:'center'}}>
                <span style={{fontSize:'var(--f-lg)'}}>🌐</span>
                <span>Héberger</span>
            </button>
            <button className="bg menu-section-up"
                    onClick={() => { AudioSys.click(); setScreen("net_join"); }}
                    style={{background:"rgba(4,8,20,.85)",border:`1px solid ${T.a1}44`,borderRadius:'var(--rad-md)',padding:'var(--sp-sm)',fontSize:'var(--f-sm)',fontWeight:800,color:'#cbd5e1',cursor:"pointer",letterSpacing:1, animationDelay:'.24s', display:'flex', flexDirection:'column', gap:'var(--sp-xs)', alignItems:'center'}}>
                <span style={{fontSize:'var(--f-lg)'}}>🔗</span>
                <span>Rejoindre</span>
            </button>
        </div>

        {/* Boutons secondaires verticaux : Scores / Règles / Crédits / Réglages (style ref) */}
        <div style={{display:"flex", flexDirection:"column", gap:'var(--sp-xs)', marginTop:'var(--sp-sm)'}}>
          {secondaryNav.map((item, idx) => (
            <button key={item.sc} className="menu-sidebar-btn menu-section-up"
                    onClick={()=>{ AudioSys.click(); setScreen(item.sc); }}
                    style={{animationDelay: `${0.25 + idx*0.06}s`}}>
                <span className="icon">{item.icon}</span>
                <span>{item.lbl}</span>
            </button>
          ))}
          {openSettings && (
            <button className="menu-sidebar-btn menu-section-up"
                    onClick={()=>{ AudioSys.click(); openSettings(); }}
                    style={{animationDelay: '.43s'}}>
                <span className="icon">⚙️</span>
                <span>Réglages</span>
            </button>
          )}
        </div>
      </div>

      {/* ─── ZONE DROITE PREMIUM : fond degrade subtil + halo radial du theme ─── */}
      <div style={{flex:'1 1 520px',minWidth:0,overflowY:"visible",overflowX:'hidden',padding:'calc(72px * var(--ui-scale)) calc(30px * var(--ui-scale)) var(--sp-md)',position:"relative",zIndex:1, background:`radial-gradient(ellipse at 50% 0%, ${T.a1}0f, rgba(0,0,0,0.45) 60%, rgba(0,0,0,0.55))`}}>

        {/* Header section options : animation entree */}
        <div className="menu-section-up" style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'var(--sp-md)', flexWrap:'wrap', gap:'var(--sp-sm)', animationDelay:'.05s'}}>
            <div style={{fontSize:'var(--f-md)',fontWeight:900,color:"#cbd5e1",letterSpacing:4,textTransform:"uppercase"}}>Options Bagley Edition</div>
            <div style={{fontSize:'var(--f-xs)',color:'#64748b',fontStyle:'italic',letterSpacing:2}}>Choisissez votre course</div>
        </div>

        {/* Difficulte — animation entree */}
        <div className="menu-section-up" style={{background:"rgba(4,8,20,.85)",border:`1px solid ${T.br}`,borderRadius:'var(--rad-lg)',padding:'var(--sp-md)',marginBottom:'var(--sp-sm)', backdropFilter:"blur(10px)", animationDelay:'.12s'}}>
          <div style={{display:'flex',alignItems:'center',gap:'var(--sp-sm)',marginBottom:'var(--sp-md)'}}>
            <span style={{fontSize:'var(--f-md)'}}>🎯</span>
            <div style={{fontSize:'var(--f-sm)',color:"#94a3b8",textTransform:"uppercase",letterSpacing:3,fontWeight:700}}>Niveau de l'IA</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(110px,1fr))",gap:'var(--sp-sm)'}}>
            {Object.entries(DIFFS).map(([k,d])=>(
              <button key={k} className="bg" onClick={()=>{ AudioSys.click(); setDiff(k); }} style={{borderRadius:'var(--rad-sm)',padding:'var(--sp-sm) var(--sp-xs)',fontSize:'var(--f-sm)',fontWeight:700,border:diff===k?`2px solid ${T.a1}`:"1px solid transparent",cursor:"pointer",background:diff===k?`linear-gradient(135deg,${T.a1}55,${T.a2}33)`:"rgba(15,23,42,.85)",color:diff===k?"#fff":"#94a3b8",transition:"all .2s, transform .12s", boxShadow: diff===k ? `0 6px 18px ${T.a1}44` : 'none'}}>{d.emoji} {d.name}</button>
            ))}
          </div>
          <div style={{fontSize:'var(--f-xs)',color:diff==='expert'?"#f87171":"#94a3b8",marginTop:'var(--sp-sm)',fontStyle:"italic",textAlign:"center", fontWeight:diff==='expert'?900:400}}>{DIFFS[diff].desc}</div>
        </div>

        {/* Longueur de partie — objectif global synchronise avec progression, victoire et evenements */}
        <div className="menu-section-up" style={{background:"rgba(4,8,20,.85)",border:`1px solid ${T.br}`,borderRadius:'var(--rad-lg)',padding:'var(--sp-md)',marginBottom:'var(--sp-sm)', backdropFilter:"blur(10px)", animationDelay:'.17s'}}>
          <div style={{display:'flex',alignItems:'center',gap:'var(--sp-sm)',marginBottom:'var(--sp-sm)'}}>
            <span style={{fontSize:'var(--f-md)'}}>🏁</span>
            <div style={{fontSize:'var(--f-sm)',color:"#94a3b8",textTransform:"uppercase",letterSpacing:3,fontWeight:700}}>Longueur de partie</div>
          </div>
          <select value={targetKm} onChange={(e)=>{AudioSys.click(); setTargetKm(Number(e.target.value));}} style={{width:'100%',borderColor:T.a1,cursor:'pointer',fontWeight:900}}>
            {RACE_TARGET_OPTIONS.map(km => <option key={km} value={km}>{km} {meta?.unit || 'km'} {km===1000 ? '(défaut)' : ''}</option>)}
          </select>
          <div style={{fontSize:'var(--f-xs)',color:'#94a3b8',marginTop:'var(--sp-xs)',lineHeight:1.35}}>La route, les boutiques et la condition de victoire s'adaptent à cette distance.</div>
        </div>

        {/* Separateur visuel premium */}
        <div className="menu-divider" style={{color: T.a1}}/>

        {/* Tuiles univers XL : hover premium (shimmer, scale, rotation icone) */}
        <div className="menu-section-up" style={{display:'flex',alignItems:'center',gap:'var(--sp-sm)',marginBottom:'var(--sp-md)', animationDelay:'.22s'}}>
            <span style={{fontSize:'var(--f-md)'}}>🎨</span>
            <div style={{fontSize:'var(--f-sm)',color:"#94a3b8",textTransform:"uppercase",letterSpacing:3,fontWeight:700}}>Univers & Fonds Dynamiques</div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(min(calc(160px * var(--ui-scale)), 100%), 1fr))",gap:'var(--sp-sm)',marginBottom:0}}>
          {Object.entries(THEMES).filter(([k])=>UNIVERSE.includes(k)).map(([k,th],idx)=>{
            const m=META[k]; const isActive=theme===k;
            const tileType = ({
              mario:{font:"Impact, 'Arial Black', system-ui, sans-serif",scale:.78,line:1.02,letter:.4},
              craft:{font:"'Courier New', monospace",scale:.76,line:1.02,letter:-.1},
              zelda:{font:"Georgia, 'Times New Roman', serif",scale:.95,line:1.08,letter:.6},
              cyber:{font:"Orbitron, 'Segoe UI', sans-serif",scale:.86,line:1.04,letter:1.2},
              space:{font:"Verdana, system-ui, sans-serif",scale:.9,line:1.05,letter:1.4},
              mafia:{font:"Georgia, 'Times New Roman', serif",scale:.9,line:1.05,letter:.8},
              sekiro:{font:"'Yu Mincho','MS Mincho',Georgia,serif",scale:.86,line:1.06,letter:.6},
              payday:{font:"Impact, 'Arial Black', system-ui, sans-serif",scale:.82,line:1.02,letter:.8},
            })[k] || {font:th.font||T.font,scale:1,line:1.08,letter:1};
            return(
            <button key={k}
                    className="bg menu-tile menu-section-up"
                    onClick={()=>{ AudioSys.click(); setTheme(k); }}
                    style={{borderRadius:'var(--rad-lg)',padding:'var(--sp-sm)',display:"flex",flexDirection:'column',alignItems:"center",justifyContent:'center',gap:'var(--sp-xs)',border:isActive?`2px solid ${th.a1}`:'2px solid transparent',cursor:"pointer",transition:"transform .2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow .25s, background .25s",background:isActive?`linear-gradient(135deg,${th.a1}66,${th.a2}33)`:`linear-gradient(135deg,${th.a1}55,${th.a2}1f)`,boxShadow:isActive?`0 0 0 1px ${th.a1}, 0 18px 48px ${th.a1}55`:"0 10px 30px #0009",textAlign:"center", position:'relative', overflow:'hidden', minHeight:'calc(156px * var(--ui-scale))', animationDelay: `${0.30 + idx*0.05}s`}}>
              {/* Halo radial d'arriere plan, plus marque sur la tuile active */}
              <div style={{position:'absolute',inset:0,background:`radial-gradient(ellipse at 50% 10%, ${th.a1}55, transparent 70%)`,pointerEvents:'none',opacity:isActive?1:0.55, transition:'opacity .3s'}}/>
              {/* Icone — class menu-tile-icon pour rotation au hover */}
              <div className="menu-tile-icon" style={{position:'relative',fontSize:'calc(48px * var(--ui-scale))',filter:`drop-shadow(0 0 16px ${th.a1}aa)`,marginTop:'var(--sp-xs)', zIndex:1}}>{th.icon}</div>
              <div style={{position:'relative',fontFamily:tileType.font,fontWeight:900,fontSize:`calc(var(--f-lg) * ${tileType.scale})`,color:isActive?"#fff":"#f8fafc",letterSpacing:tileType.letter,textTransform:'uppercase', zIndex:1, textShadow:`0 3px 10px #000, 0 0 12px ${th.a1}`,lineHeight:tileType.line,maxWidth:'100%',overflowWrap:'anywhere',padding:'0 calc(2px * var(--ui-scale))'}}>{th.name}</div>
              <div style={{position:'relative',fontSize:'var(--f-sm)',color:"#e2e8f0",opacity:isActive?0.95:0.82,lineHeight:1.25,padding:'0 var(--sp-xs)', zIndex:1,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{m?.desc||""}</div>
              {/* Badge "actif" en coin top-right */}
              {isActive&&<div style={{position:'absolute',top:'var(--sp-sm)',right:'var(--sp-sm)',width:'calc(28px * var(--ui-scale))',height:'calc(28px * var(--ui-scale))',borderRadius:"50%",background:th.a1,display:"flex",alignItems:"center",justifyContent:"center",fontSize:'var(--f-sm)',color:"#fff",fontWeight:900,boxShadow:`0 0 16px ${th.a1}cc`, zIndex:2, animation:'pop .3s both'}}>✓</div>}
            </button>
          );})}
        </div>
      </div>
    </div>
  );
}

// ─── SETTINGS MODAL ────────────────────────────────────────
// Applique l'echelle UI globale via la variable CSS --ui-scale.
// Persiste dans localStorage pour conserver le reglage entre sessions.
function SettingsModal({zoom, setZoom, onClose, autoFitScale=1, effectiveScale=null, autoFitClamped=false,
                        scaleMin=0.30, scaleMax=2.50,
                        resolutions=[], resolutionId='auto', setResolution=()=>{},
                        sceneSize={w:0,h:0,label:''}, viewport={w:0,h:0},
                        gameMode='classic', setGameMode=()=>{},
                        layoutMode='classic', setLayoutMode=()=>{}}){
  // PROPS :
  //   zoom = userZoom (preference). slider 0.30 -> 2.50.
  //   autoFitScale = limite max calculee selon viewport + resolution simulee.
  //   effectiveScale = scale REELLEMENT applique = min(zoom, autoFitScale).
  //   resolutions = liste complete des presets. resolutionId = preset choisi. setResolution = setter.
  //   sceneSize = {w, h, label} de la scene logique calculee.
  //   viewport = {w, h} de l'ecran reel.
  // L'utilisateur peut pousser le slider au max sans casser le cadrage : effectiveScale clampe.
  const presets = [
    {k:0.55, l:"Très petit"},
    {k:0.75, l:"Petit"},
    {k:1.0,  l:"Normal"},
    {k:1.25, l:"Confort"},
    {k:1.60, l:"Grand"},
    {k:2.00, l:"Très grand"},
  ];
  const effective = (typeof effectiveScale === 'number') ? effectiveScale : zoom;
  const recommendedZoom = Math.max(scaleMin, Math.min(scaleMax, Number(autoFitScale.toFixed(2))));

  // ─── WORKFLOW PREVIEW + CONFIRMATION (Mission 4) ───
  // baselineZoom = valeur au moment du mount du modal (= dernière confirmation).
  // zoom = valeur actuellement APPLIQUEE (preview en temps réel).
  // L'utilisateur peut bouger le slider sans risque : tant qu'il ne CONFIRME PAS, un rollback
  // automatique (12s ou Annuler ou fermeture) ramène à baselineZoom.
  const [baselineZoom, setBaselineZoom] = useState(zoom);
  const [confirmedRef, setConfirmedRef] = useState(true); // true au mount : pas de modif en cours
  const rollbackTimer = useRef(null);
  const hasPendingChange = Math.abs(zoom - baselineZoom) > 0.001;

  const applyScale = (v) => {
      setZoom(v);                    // applique immédiatement (preview)
      setConfirmedRef(false);        // marque la modif comme non confirmée
      // Reset le timeout auto-rollback à chaque ajustement
      if(rollbackTimer.current) clearTimeout(rollbackTimer.current);
      rollbackTimer.current = setTimeout(() => {
          // Si toujours non confirmé après 12s → rollback automatique
          setZoom(baselineZoom);
          setConfirmedRef(true);
      }, 12000);
  };
  const confirmZoom = () => {
      AudioSys.success();
      if(rollbackTimer.current) { clearTimeout(rollbackTimer.current); rollbackTimer.current = null; }
      setBaselineZoom(zoom);  // la nouvelle baseline devient la valeur courante
      setConfirmedRef(true);
  };
  const cancelZoom = () => {
      AudioSys.click();
      if(rollbackTimer.current) { clearTimeout(rollbackTimer.current); rollbackTimer.current = null; }
      setZoom(baselineZoom);  // rollback à la dernière valeur confirmée
      setConfirmedRef(true);
  };
  // Sécurité : à la fermeture du modal SANS confirmation, on rollback proprement.
  // On capture les dernieres valeurs via une ref pour les avoir au cleanup.
  const safetyRef = useRef({zoom, baselineZoom, confirmedRef, setZoom});
  safetyRef.current = {zoom, baselineZoom, confirmedRef, setZoom};
  useEffect(() => {
      return () => {
          if(rollbackTimer.current) clearTimeout(rollbackTimer.current);
          // Si modif non confirmée au démontage, rollback automatique.
          const s = safetyRef.current;
          if(!s.confirmedRef && Math.abs(s.zoom - s.baselineZoom) > 0.001) {
              s.setZoom(s.baselineZoom);
          }
      };
  }, []);
  // Avertissement : zoom risqué si proche des bornes ou si très différent de l'autoFit
  const isRisky = (zoom < 0.65) || (zoom > 1.8) || (zoom > autoFitScale * 1.15);
  // Groupe les resolutions par categorie pour un select propre.
  const groups = [
    { key:'auto',   l:'Auto' },
    { key:'laptop', l:'Laptops' },
    { key:'desk',   l:'Desktop' },
    { key:'uw',     l:'Ultrawide' },
    { key:'tab',    l:'Tablettes' },
    { key:'phone',  l:'Smartphones' },
    { key:'tv',     l:'TV' },
  ];
  // Echap depuis l'interieur du modal : referme. Stoppe la propagation pour ne pas declencher
  // la confirmation de sortie du Game qui ecoute aussi Escape.
  useEffect(()=>{
      const onKey = (e) => {
          if(e.key === 'Escape') {
              // Si on est dans un slider/input du modal, on ne ferme pas si l'utilisateur
              // est en train d'editer (geste habituel). On laisse passer pour le bouton focus.
              const t = e.target;
              const tag = t && t.tagName ? t.tagName.toUpperCase() : '';
              if(tag === 'INPUT' && t.type === 'range') return; // permet a l'utilisateur de fuir le slider
              e.preventDefault();
              e.stopPropagation();
              onClose();
          }
      };
      // Capture phase pour intercepter avant le listener Game
      window.addEventListener('keydown', onKey, true);
      return () => window.removeEventListener('keydown', onKey, true);
  }, [onClose]);
  return (
    <div className="settings-modal" onClick={(e)=>{ if(e.target.className==='settings-modal') onClose(); }}>
      <div className="settings-panel" onClick={e=>e.stopPropagation()}>
        <div className="settings-title">⚙️ Réglages</div>
        <div className="settings-sub">Ajustez l'affichage à votre confort de jeu.</div>

        <div className="settings-row">
          <div className="settings-section-title">Mode de jeu</div>
          <select value={gameMode}
                  onChange={e=>{ AudioSys.click(); setGameMode(e.target.value); }}
                  style={{cursor:'pointer'}}>
            <option value="classic">Classique — carburant actif</option>
            <option value="survival_night">B. Survie / Nuit</option>
          </select>
          <div style={{fontSize:'var(--f-xs)',color:'#94a3b8',lineHeight:1.45,marginTop:'var(--sp-xs)'}}>
            Le carburant est une ressource de base. Survie / Nuit ajoute les pannes adverses masquées jusqu'au tour du joueur touché.
          </div>
        </div>

        <div className="settings-row">
          <div className="settings-section-title">Interface</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'var(--sp-xs)'}}>
            {[
              {id:'classic', label:'Layout classique'},
              {id:'v2', label:'Layout V2'}
            ].map(opt=>(
              <button key={opt.id}
                      onClick={()=>{ AudioSys.click(); setLayoutMode(opt.id); }}
                      className={layoutMode===opt.id ? 'active' : ''}
                      style={{padding:'var(--sp-sm)',borderRadius:'var(--rad-sm)',border:layoutMode===opt.id?'1px solid #fbbf24':'1px solid rgba(255,255,255,.10)',background:layoutMode===opt.id?'rgba(251,191,36,.16)':'rgba(15,23,42,.7)',color:layoutMode===opt.id?'#fde68a':'#cbd5e1',fontWeight:900,cursor:'pointer'}}>
                {opt.label}
              </button>
            ))}
          </div>
          <div style={{fontSize:'var(--f-xs)',color:'#94a3b8',lineHeight:1.45,marginTop:'var(--sp-xs)'}}>
            V2 reprend l'esprit de Game.png : historique plus ramassé, scène centrale plus large, main et sac plus lisibles.
          </div>
        </div>

        <div className="settings-row">
          <div className="settings-section-title">Résolution simulée</div>
          <select value={resolutionId}
                  onChange={e=>{ AudioSys.click(); setResolution(e.target.value); }}
                  style={{cursor:'pointer'}}>
            {groups.map(g => {
                const items = resolutions.filter(r => r.cat === g.key);
                if(items.length === 0) return null;
                return (
                    <optgroup key={g.key} label={g.l}>
                        {items.map(r => <option key={r.id} value={r.id}>{r.l}</option>)}
                    </optgroup>
                );
            })}
          </select>
          <div style={{display:'flex',justifyContent:'space-between',fontSize:'var(--f-xs)',color:'#94a3b8',marginTop:'var(--sp-xs)',gap:'var(--sp-sm)',flexWrap:'wrap'}}>
            <span>Scène logique :</span>
            <span style={{fontWeight:900,color:'#cbd5e1'}}>{Math.round(sceneSize.w)} × {Math.round(sceneSize.h)}</span>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',fontSize:'var(--f-xs)',color:'#94a3b8',gap:'var(--sp-sm)',flexWrap:'wrap'}}>
            <span>Écran réel :</span>
            <span style={{fontWeight:900,color:'#cbd5e1'}}>{viewport.w} × {viewport.h}</span>
          </div>
        </div>

        <div className="settings-row">
          <div className="settings-section-title">Échelle de l'interface</div>
          <label>
            <span>Zoom demandé</span>
            <span className="val">x{zoom.toFixed(2)}</span>
          </label>
          <input type="range" min={scaleMin} max={scaleMax} step="0.01" value={zoom}
                 onChange={e=>applyScale(parseFloat(e.target.value))} />
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'var(--sp-sm)',marginTop:'var(--sp-xs)',padding:'var(--sp-xs) var(--sp-sm)',border:'1px solid rgba(96,165,250,.28)',borderRadius:'var(--rad-sm)',background:'rgba(15,23,42,.55)',fontSize:'var(--f-xs)',color:'#bfdbfe',flexWrap:'wrap'}}>
            <span>Valeur recommandée : <b style={{color:'#fbbf24'}}>x{recommendedZoom.toFixed(2)}</b></span>
            <button onClick={()=>{ AudioSys.click(); applyScale(recommendedZoom); }}
                    style={{background:'rgba(59,130,246,.22)',border:'1px solid rgba(96,165,250,.45)',borderRadius:99,color:'#dbeafe',fontWeight:800,cursor:'pointer',fontFamily:'inherit',padding:'calc(4px * var(--ui-scale)) calc(10px * var(--ui-scale))',fontSize:'var(--f-xs)'}}>
              Appliquer la recommandation
            </button>
          </div>
          <div className="settings-presets">
            {presets.map(p=>(
              <button key={p.k}
                      className={Math.abs(zoom-p.k)<0.03 ? "active" : ""}
                      onClick={()=>{ AudioSys.click(); applyScale(p.k); }}>
                {p.l}<br/><span style={{fontSize:'0.85em',opacity:0.7}}>x{p.k.toFixed(2)}</span>
              </button>
            ))}
          </div>
          {/* Indicateurs : ratio max autorise par l'ecran + ratio effectif applique */}
          <div style={{marginTop:'var(--sp-md)',padding:'var(--sp-sm) var(--sp-md)',background:autoFitClamped?'rgba(251,191,36,0.12)':'rgba(15,23,42,0.6)',border:`1px solid ${autoFitClamped?'rgba(251,191,36,0.35)':'rgba(255,255,255,0.08)'}`,borderRadius:'var(--rad-sm)',fontSize:'var(--f-xs)',color:autoFitClamped?'#fde68a':'#94a3b8',lineHeight:1.5}}>
            <div style={{display:'flex',justifyContent:'space-between',gap:'var(--sp-sm)',flexWrap:'wrap'}}>
              <span>Auto-fit max (écran) :</span>
              <span style={{fontWeight:900,color:'#cbd5e1'}}>x{autoFitScale.toFixed(2)}</span>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',gap:'var(--sp-sm)',flexWrap:'wrap'}}>
              <span>Effectif appliqué :</span>
              <span style={{fontWeight:900,color:'#fbbf24'}}>x{effective.toFixed(2)}</span>
            </div>
            {autoFitClamped && (
              <div style={{marginTop:'var(--sp-xs)',color:'#fde68a'}}>
                ⚠ La résolution choisie + votre écran limitent le zoom à <b>x{autoFitScale.toFixed(2)}</b>. L'interface reste 100 % visible, sans rognage.
              </div>
            )}
            {!autoFitClamped && (
              <div style={{marginTop:'var(--sp-xs)',color:'#86efac',fontSize:'var(--f-xs)'}}>
                ✓ Votre zoom est appliqué tel quel — la scène entière est visible.
              </div>
            )}
          </div>

          {/* ─── BARRE PREVIEW / CONFIRMATION (Mission 4) ───
              Visible UNIQUEMENT si l'utilisateur a modifié le slider depuis la dernière baseline.
              Avant : le zoom modifiait directement la valeur persistée.
              Maintenant : aperçu live → confirmation explicite (ou rollback auto 12s, ou clic Annuler). */}
          {hasPendingChange && (
              <div style={{marginTop:'var(--sp-md)', padding:'var(--sp-sm) var(--sp-md)', background:isRisky?'rgba(239,68,68,0.10)':'rgba(59,130,246,0.10)', border:`1px solid ${isRisky?'rgba(239,68,68,0.50)':'rgba(59,130,246,0.50)'}`, borderRadius:'var(--rad-sm)', animation:'fdu .3s both'}}>
                  <div style={{display:'flex', alignItems:'center', gap:'var(--sp-sm)', marginBottom:'var(--sp-xs)'}}>
                      <span style={{fontSize:'var(--f-lg)'}}>{isRisky ? '⚠' : '👁'}</span>
                      <div style={{flex:1, minWidth:0}}>
                          <div style={{fontSize:'var(--f-sm)', fontWeight:900, color:isRisky?'#fca5a5':'#93c5fd'}}>
                              {isRisky ? "Aperçu d'un zoom risqué" : "Aperçu en cours"}
                          </div>
                          <div style={{fontSize:'var(--f-xs)', color:'#cbd5e1', lineHeight:1.4}}>
                              {isRisky
                                  ? `La valeur x${zoom.toFixed(2)} est extrême : certaines zones peuvent paraître très petites ou très grandes. Confirmez pour conserver ce réglage.`
                                  : `Le zoom passe de x${baselineZoom.toFixed(2)} à x${zoom.toFixed(2)}. Confirmez pour le conserver. Sans action, retour automatique dans 12 s.`}
                          </div>
                      </div>
                  </div>
                  <div style={{display:'flex', gap:'var(--sp-sm)', marginTop:'var(--sp-sm)'}}>
                      <button onClick={confirmZoom}
                              style={{flex:1, padding:'var(--sp-sm) var(--sp-md)', background:'linear-gradient(135deg,#16a34a,#15803d)', border:'none', borderRadius:'var(--rad-sm)', color:'#fff', fontWeight:800, fontSize:'var(--f-sm)', cursor:'pointer', fontFamily:'inherit', letterSpacing:1}}>
                          ✓ Confirmer
                      </button>
                      <button onClick={cancelZoom}
                              style={{flex:1, padding:'var(--sp-sm) var(--sp-md)', background:'rgba(15,23,42,0.7)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:'var(--rad-sm)', color:'#cbd5e1', fontWeight:700, fontSize:'var(--f-sm)', cursor:'pointer', fontFamily:'inherit', letterSpacing:1}}>
                          ↺ Annuler (retour x{baselineZoom.toFixed(2)})
                      </button>
                  </div>
              </div>
          )}
        </div>

        <div className="settings-row">
          <div className="settings-section-title">Audio</div>
          <button onClick={()=>{ AudioSys.toggle(); AudioSys.init(); }}
                  style={{background:'rgba(15,23,42,0.8)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:10,padding:'10px 16px',color:'#cbd5e1',fontWeight:700,fontSize:'var(--f-md)',cursor:'pointer',fontFamily:'inherit'}}>
            {AudioSys.isMuted() ? "🔇 Réactiver le son" : "🔊 Couper le son"}
          </button>
        </div>

        <button className="settings-close" onClick={()=>{ AudioSys.click(); onClose(); }}>
          Fermer
        </button>
      </div>
    </div>
  );
}

// ─── EXIT CONFIRMATION DIALOG ─────────────────────────────
// Confirmation Echap / "Quitter la partie". Ne quitte JAMAIS sans confirmation.
function ExitConfirm({onContinue, onQuit, theme}){
  const T=THEMES[theme]||THEMES.bleu;
  // Premier rendu : focus sur "Continuer" pour qu'Entree confirme l'option non-destructive.
  const continueBtnRef = useRef(null);
  useEffect(()=>{ try { continueBtnRef.current?.focus(); } catch(e){} }, []);
  return (
    <div className="exit-modal"
         role="dialog" aria-modal="true" aria-label="Confirmation de sortie"
         onClick={(e)=>{ if(e.target.className==='exit-modal') onContinue(); }}>
      <div className="exit-panel" onClick={e=>e.stopPropagation()} style={{fontFamily:T.font}}>
        <div className="exit-icon">🚪</div>
        <div className="exit-title">Quitter la partie ?</div>
        <div className="exit-sub">
          Votre progression actuelle sera perdue.<br/>
          Aucun score ne sera enregistre tant que la partie n'est pas terminee.
        </div>
        <div className="exit-actions">
          <button ref={continueBtnRef} className="exit-btn continue"
                  onClick={()=>{ AudioSys.click(); onContinue(); }}
                  autoFocus>
            ↩️ Continuer la partie
          </button>
          <button className="exit-btn quit"
                  onClick={()=>{ AudioSys.click(); onQuit(); }}>
            🚪 Quitter au menu
          </button>
        </div>
        <div className="exit-hint">Echap : annule · Entree : continuer</div>
      </div>
    </div>
  );
}

// ─── GAME ─────────────────────────────────────────────────
function Game({diff,theme,onBack,setScores,skin,meta,cfg,appZoom,setAppZoom,openSettings,settingsOpen,closeSettings,gameMode="classic",layoutMode="classic"}){
  const T=THEMES[theme]||THEMES.bleu,D=DIFFS[diff]||DIFFS.normal;
  const nh=cfg.names.length, unit=meta?.unit||"km";
  const targetKm = normalizeTargetKm(cfg?.targetKm);
  const survivalNight = gameMode === "survival_night";
  const fuelBaseGame = true;
  const hideNightHazards = survivalNight;
  const SURVIVAL_FUEL_LOSS = 7;
  const networkServer = cfg?.networkServer || null;
  const playerIds = cfg?.playerIds || cfg.names.map((_, i) => `host:${i}`);
  
  const[deck,setDeck]=useState([]);const[disc,setDisc]=useState([]);
  const[players,setPlayers]=useState([]);const[ai,setAi]=useState(null);
  const[turn,setTurn]=useState(0);
  const[selHand,setSelHand]=useState(null);
  const[selInv,setSelInv]=useState(null);
  const[v2Tray,setV2Tray]=useState("hand");
  const[msg,setMsg]=useState("");const[mt,setMt]=useState("info");
  const[over,setOver]=useState(null);const[safe,setSafe]=useState(0);
  const[aip,setAip]=useState("idle");const[ail,setAil]=useState(-1);const[aic,setAic]=useState(-1);
  const[turns,setTurns]=useState(0);const[pass,setPass]=useState(false);
  const[passD,setPassD]=useState(null);const[flash,setFlash]=useState(null);
  
  const[draggedCard,setDraggedCard]=useState(null);
  const[hoveredCard,setHoveredCard]=useState(null);
  const[uiTip,setUiTip]=useState(null);
  const[stealPrompt,setStealPrompt]=useState(null);
  const[shakeIdx,setShakeIdx]=useState(null);
  const[logs, setLogs]=useState([]);
  const[mobileControlledIds, setMobileControlledIds] = useState([]);
  
  // Boutique PNJ aleatoire tous les 200 km : declenchement fiable a 200, 400, 600, 800
  // (et plus en theorie si on monte au-dela de 1000 km mais la partie est gagnee avant).
  const[eventMilestones, setEventMilestones] = useState(()=>buildEventMilestones(targetKm));
  const[eventData, setEventData]=useState(null);
  // zoom partagé avec l'App (fallback local si appZoom non fourni)
  const zoom = (typeof appZoom === 'number') ? appZoom : 1.15;
  const[isMoving, setIsMoving] = useState(false); // Pour animer la minimap seulement quand un joueur avance
  const[showExitConfirm, setShowExitConfirm] = useState(false); // Modale de confirmation de sortie (declenchee par Echap ou bouton Menu)
  // ─── SHOP QUEUE MULTI-JOUEURS (P2 fix 2026-05-18) ───
  // shopQueue : tableau ordonne d'indices joueurs (km decroissant), passe par la boutique chacun a leur tour.
  // shopQueueIndex : curseur courant. Quand >= queue.length, fin du shop, on reprend le tour normal.
  const[shopQueue, setShopQueue] = useState(null);
  const[shopQueueIndex, setShopQueueIndex] = useState(0);
  // pendingNxt : sauvegarde des args de `nxt` a re-executer une fois la queue terminee
  const pendingNxt = useRef(null);
  const actionLocked = useRef(false);
  // ─── Card FX overlay (Mission 4) ───
  // Affiche temporairement la carte jouee au centre de l'ecran avec :
  // - halo couleur selon le type (rouge attack, bleu remedy, vert distance, etc.)
  // - badge resume de l'effet (ex: "-50 km", "Blocage !", "Coup Fourre !")
  // - chip cible quand applicable ("Sur l'IA", "Sur Joueur 2", ...)
  // L'overlay est `pointer-events:none` et `position:fixed` : zero impact sur les
  // interactions de drag-drop, hover, clics.
  const[cardFx, setCardFx] = useState(null);
  const cardFxTimer = useRef(null);
  const triggerCardFx = (card, summary, targetLabel) => {
      if(!card) return;
      if(cardFxTimer.current) clearTimeout(cardFxTimer.current);
      // Choix de la couleur de halo selon le type
      const haloByType = {
          distance: '#22c55e', remedy: '#3b82f6', botte: '#fbbf24',
          attack: '#ef4444', action: '#a855f7', boost: '#06b6d4',
          shield: '#a1a1aa', draw: '#d946ef', reroll: '#fb923c'
      };
      const halo = haloByType[card.type] || '#94a3b8';
      setCardFx({ card, summary: summary || '', targetLabel: targetLabel || '', halo, leaving:false });
      // ALLONGEMENT 2026-05-18 : 3.5s d'affichage + 0.5s de sortie = 4s total perceptible
      cardFxTimer.current = setTimeout(() => {
          setCardFx(prev => prev ? {...prev, leaving:true} : null);
          cardFxTimer.current = setTimeout(() => setCardFx(null), 500);
      }, 3500);
  };
  useEffect(() => () => { if(cardFxTimer.current) clearTimeout(cardFxTimer.current); }, []);

  const flashTimer = useRef(null);
  const shakeTimer = useRef(null);
  const logEndRef = useRef(null);
  const msgClearTimer = useRef(null);
  const isAITurn = turn === "ai" || aip !== "idle";

  // Auto-dismiss du statut : apres 2.8s sans nouvelle action, on efface le msg
  // pour eviter le rendu permanent (le toast disparait alors automatiquement).
  useEffect(() => {
      if(!msg || msg.trim().length === 0) return;
      if(isAITurn) return; // pendant le tour IA, on garde le msg visible jusqu'au prochain
      if(msgClearTimer.current) clearTimeout(msgClearTimer.current);
      msgClearTimer.current = setTimeout(() => setMsg(""), 2800);
      return () => { if(msgClearTimer.current) clearTimeout(msgClearTimer.current); };
  }, [msg, isAITurn]);

  useEffect(()=>{
    if(!skin||!skin.distance||!skin.feu_vert){onBack();return;}
    AudioSys.startBgm(theme);
    start();
    return () => { AudioSys.stopBgm(); }
  },[]);
  useEffect(() => {
      return () => {
          if(networkServer && typeof networkServer.stop === 'function') {
              try { networkServer.stop(); } catch(e) {}
          }
      };
  }, [networkServer]);

  useEffect(() => {
    return () => { if(flashTimer.current) clearTimeout(flashTimer.current); if(shakeTimer.current) clearTimeout(shakeTimer.current); }
  }, []);

  useEffect(() => {
      logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // ─── Listener Echap : hierarchique et anti-double-declenchement ───
  // Priorite (de la plus haute a la plus basse) :
  //   1. Reglages ouverts          -> on les ferme
  //   2. Confirmation deja affichee -> on la ferme (= Continuer la partie)
  //   3. Popup d'evenement (shop/event/troc) -> on la passe (skip)
  //   4. Sinon                     -> on ouvre la confirmation de sortie
  // Ignore quand l'utilisateur tape dans un input/select/range (pas d'interference).
  useEffect(() => {
      const onKey = (e) => {
          const t = e.target;
          const tag = t && t.tagName ? t.tagName.toUpperCase() : '';
          if(e.key !== 'Escape') return;
          // Ne pas interferer si on est en train d'editer un champ (input texte / slider zoom / select vehicule)
          if(tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
          // Si la partie est finie (ecran Win), Echap ramene au menu
          if(over) { e.preventDefault(); onBack(); return; }
          // 1. Reglages ouverts -> fermer
          if(settingsOpen && closeSettings) { e.preventDefault(); closeSettings(); return; }
          // 2. Confirmation deja ouverte -> fermer (= Continuer)
          if(showExitConfirm) { e.preventDefault(); setShowExitConfirm(false); return; }
          if(stealPrompt) { e.preventDefault(); setStealPrompt(null); return; }
          // Feedbacks legers : Echap nettoie d'abord les effets visuels temporaires.
          if(cardFx || flash) {
              e.preventDefault();
              setCardFx(null);
              setFlash(null);
              if(cardFxTimer.current) clearTimeout(cardFxTimer.current);
              if(flashTimer.current) clearTimeout(flashTimer.current);
              return;
          }
          // Sélection légère : Echap annule d'abord le focus carte/inventaire.
          if(selHand !== null || selInv !== null || hoveredCard) {
              e.preventDefault();
              setSelHand(null); setSelInv(null); setHoveredCard(null); setDraggedCard(null);
              return;
          }
          // 3. Popup d'evenement -> passer (PassScreen est volontairement non-skip)
          if(eventData) {
              e.preventDefault();
              if(eventData.isShop) { handleShopAction('skip'); }
              else if(eventData.interactive) { handleInteractiveTrade(-1); }
              else { setEventData(null); }
              return;
          }
          // PassScreen (hotseat) ne se ferme pas par Echap (il faut explicitement passer le tour)
          if(pass) { return; }
          // 4. Par defaut -> ouvrir confirmation de sortie
          e.preventDefault();
          setShowExitConfirm(true);
      };
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
  }, [over, settingsOpen, closeSettings, showExitConfirm, stealPrompt, cardFx, flash, eventData, pass, selHand, selInv, hoveredCard]);

  const addLog = (text, type="info", pIdx=null, icon=null) => {
      const c = pIdx==="ai" ? "#ef4444" : pIdx!==null ? PC[players[pIdx]?.colorIdx||pIdx]?.main : "#94a3b8";
      const fallbackIcon = type==='attack'?"⚔️":type==='cf'?"💥":type==='event'?"⚡":type==='success'?"✓":type==='ai'?"🤖":"ℹ️";
      const source = pIdx==="ai" ? "IA" : pIdx!==null ? (players[pIdx]?.name || `Joueur ${pIdx+1}`) : "Table";
      const actionType = type==='attack' ? 'attaque' : type==='event' ? 'événement' : type==='cf' ? 'coup fourré' : type==='success' ? 'action' : type;
      setLogs(prev => [...prev, {id: Date.now()+Math.random(), turn:turns+1, source, effect:text, actionType, msg:text, type, c, icon:icon||fallbackIcon}].slice(-40));
  };

  const tflash=(type,m)=>{
    if(flashTimer.current) clearTimeout(flashTimer.current);
    setFlash({type,msg:m});
    // Allonge 2026-05-18 : 3.5s par defaut, 4s pour les coups fourres
    flashTimer.current = setTimeout(()=>setFlash(null), type==="cf" ? 4000 : 3500);
  };

  const triggerShake = (idx) => {
    if(shakeTimer.current) clearTimeout(shakeTimer.current);
    setShakeIdx(idx);
    shakeTimer.current = setTimeout(() => setShakeIdx(null), 600);
  }

  function start(){
    Logger.perf('[Game] start() initialization', () => {
    try{
      const tot=nh+(cfg.hasAI?1:0);
      const rolesArr = [...(cfg.roles || Array(nh).fill("v1"))];
      if(cfg.hasAI) {
          const aiVehicles = (cfg.filteredVehicles || getVehiclesForTheme(theme)).map(v=>v.id);
          rolesArr.push(aiVehicles[Math.floor(Math.random()*aiVehicles.length)]);
      }

      // Determine la cle du skin pour acceder a SKIN_EXTRAS (nouvelles cartes par theme).
      const skinKey = Object.keys(SKINS).find(k => SKINS[k] === skin) || (THEMES[theme]?.skin) || "classic";
      const{hands,remaining}=dealAll(buildDeck(skin, skinKey),tot, rolesArr);
      const ps=cfg.names.map((name,i)=>({...newP(name,i,rolesArr[i],targetKm),hand:hands[i]}));
      const aiP=cfg.hasAI?{...newP("IA ("+VEHICLES.find(x=>x.id===rolesArr[nh]).name+")",nh,rolesArr[nh],targetKm),hand:hands[nh]}:null;
      
      setDeck(remaining);setDisc([]);setPlayers(ps);setAi(aiP);
      setEventMilestones(buildEventMilestones(targetKm));
      setTurn(0);setSelHand(null);setSelInv(null);setDraggedCard(null);
      setMsg(survivalNight ? "🌙 Mode Survie / Nuit activé" : (meta?.start||"La partie commence !"));
      addLog(survivalNight ? "Mode Survie / Nuit : carburant de base + incidents masqués activés" : "Carburant activé : gérez votre réserve pendant la course", "info", null, survivalNight ? "🌙" : "⛽");
      setMt("info");setOver(null);setSafe(D.safe);
      setAip("idle");setAil(-1);setAic(-1);
      setTurns(0);setPass(false);setPassD(null);setFlash(null);setEventData(null);
      Logger.info(`[Game] Started successfully with ${tot} players`);
    }catch(e){
      console.error('[start] Erreur au démarrage de la partie:', e);
      setMsg("Impossible de démarrer la partie. Vérifiez la configuration.");
      setMt("error");
    }
    });
  }

  // ─── ÉVÉNEMENTS UNIVERSELS (10) + thématiques par skin (10 sets de variations) ───
  // Helpers d'application reutilisables
  const evGainAll = (delta) => (pts, a) => ({
      ps: pts.map(p => ({...p, km: Math.min(targetKm, p.km + delta)})),
      a: a ? ({...a, km: Math.min(targetKm, a.km + delta)}) : null
  });
  const evLossLeader = (delta) => (pts, a) => {
      const all = [...pts]; if(a) all.push(a);
      const topKm = Math.max(...all.map(p=>p.km));
      return {
          ps: pts.map(p => p.km === topKm ? {...p, km:Math.max(0, p.km-delta)} : p),
          a: a ? (a.km === topKm ? {...a, km:Math.max(0, a.km-delta)} : a) : null
      };
  };
  const evBoostLast = (delta) => (pts, a) => {
      const all = [...pts]; if(a) all.push(a);
      const lastKm = Math.min(...all.map(p=>p.km));
      return {
          ps: pts.map(p => p.km === lastKm ? {...p, km:Math.min(targetKm, p.km+delta)} : p),
          a: a ? (a.km === lastKm ? {...a, km:Math.min(targetKm, a.km+delta)} : a) : null
      };
  };
  const evDrawAll = (count) => (pts, a, dk=[], dc2=[]) => {
      let deckNext = Array.isArray(dk) ? [...dk] : [];
      let discNext = Array.isArray(dc2) ? [...dc2] : [];
      const drawInto = (p) => {
          const next = {...p, hand:Array.isArray(p.hand) ? [...p.hand] : []};
          for(let i=0;i<count;i++){
              const dr = drawCard(deckNext, discNext);
              deckNext = dr.deck; discNext = dr.disc;
              if(dr.card) next.hand.push(dr.card);
          }
          return next;
      };
      return {ps:pts.map(drawInto), a:a?drawInto(a):null, dk:deckNext, dc:discNext};
  };
  // EVT anti-blocage : leve tous les hazards/limites/stopped → tout le monde "En route"
  const evUnblockAll = () => (pts, a) => ({
      ps: pts.map(p => ({...p, hazard:null, speedLimit:false, stopped:false})),
      a: a ? ({...a, hazard:null, speedLimit:false, stopped:false}) : null
  });
  // EVT anti-blocage cible : leve hazards seulement pour les joueurs bloques (laisse les autres)
  const evRescueBlocked = () => (pts, a) => ({
      ps: pts.map(p => (p.hazard || p.stopped) ? ({...p, hazard:null, stopped:false}) : p),
      a: a ? ((a.hazard || a.stopped) ? ({...a, hazard:null, stopped:false}) : a) : null
  });

  const triggerRandomEvent = (pts, a, diffLvl) => {
      const skinKey = THEMES[theme]?.skin || "classic";
      // === POOL UNIVERSEL (10) — toujours disponibles ===
      const universal = [
          { title: "Tempête Globale",       desc: "Tout le monde est arrêté.",                          icon: "🌪️", apply: (pts, a) => ({ps:pts.map(p => ({...p, stopped:true})), a:a ? ({...a, stopped:true}) : null}) },
          { title: "Élan Collectif",        desc: `Chaque joueur gagne +50 ${unit}.`,                   icon: "🚀", apply: evGainAll(50) },
          { title: "Faille Spatiale",       desc: "Tout le monde donne sa main au voisin de droite.",   icon: "🌀", apply: (pts, a) => { const allH = pts.map(p=>p.hand); if(a) allH.push(a.hand); const shifted = [allH[allH.length-1], ...allH.slice(0, allH.length-1)]; return {ps:pts.map((p,i) => ({...p, hand:shifted[i]})), a:a ? ({...a, hand:shifted[shifted.length-1]}) : null}; } },
          { title: "Amnésie Collective",    desc: "Chaque joueur défausse 1 carte au hasard.",          icon: "🌫️", apply: (pts, a) => { const rm = h => h.length>0 ? h.filter((_,i)=>i!==Math.floor(Math.random()*h.length)) : h; return {ps:pts.map(p => ({...p, hand:rm(p.hand)})), a:a ? ({...a, hand:rm(a.hand)}) : null}; } },
          { title: "Pluie d'Or",            desc: `+30 ${unit} pour tous.`,                              icon: "💰", apply: evGainAll(30) },
          { title: "Solidarité Routière",   desc: `Le dernier gagne +80 ${unit}.`,                      icon: "🤝", apply: evBoostLast(80) },
          { title: "Bourrasque",            desc: `Le leader perd 40 ${unit}.`,                          icon: "💨", apply: evLossLeader(40) },
          { title: "Brouillard Magnétique", desc: "Tout le monde reçoit une limite de vitesse.",        icon: "🌁", apply: (pts, a) => ({ps:pts.map(p => ({...p, speedLimit:true})), a:a ? ({...a, speedLimit:true}) : null}) },
          // ─── ÉVÉNEMENTS ANTI-BLOCAGE (3) ───
          { title: "Marée Libératrice",     desc: "🟢 Toutes les limites de vitesse sont levées.",       icon: "🌊", apply: (pts, a) => ({ps:pts.map(p => ({...p, speedLimit:false})), a:a ? ({...a, speedLimit:false}) : null}) },
          { title: "Coup de Pouce",         desc: "🟢 Tous les joueurs bloqués repartent en route !",    icon: "🟢", apply: evRescueBlocked() },
      ];

      // === POOL THÉMATIQUE (10 par theme) — sels d'ambiance + retournements ===
      const themed = {
        classic: [
          { title: "Course du Siècle",  desc: `Sprint global +70 ${unit}.`, icon: "🏁", apply: evGainAll(70) },
          { title: "Contrôle de Police",desc: "Tous limités à 50 km.",      icon: "🚨", apply: (pts, a) => ({ps:pts.map(p => ({...p, speedLimit:true})), a:a ? ({...a, speedLimit:true}) : null}) },
          { title: "Embouteillage",     desc: "Le leader perd 60 km.",       icon: "🚗", apply: evLossLeader(60) },
          { title: "Coup de Pompe Gratos",desc: "🟢 Tout le monde fait le plein, panne supprimée.", icon: "⛽", apply: evRescueBlocked() },
          { title: "Voie Express",      desc: `+90 ${unit} pour tous !`,    icon: "🛣", apply: evGainAll(90) },
          { title: "Casino Routier",    desc: "Hasard : ±50 km par joueur.", icon: "🎰", apply: (pts,a) => { const r = () => Math.random()<0.5?-50:50; return {ps:pts.map(p=>({...p,km:Math.max(0,Math.min(targetKm,p.km+r()))})), a:a?({...a,km:Math.max(0,Math.min(targetKm,a.km+r()))}):null}; } },
          { title: "Détour Gratuit",    desc: `Dernier joueur +120 ${unit}.`, icon: "🔄", apply: evBoostLast(120) },
          { title: "Voiture Officielle",desc: "Toutes les pannes sont nettoyées.", icon: "🚓", apply: (pts,a) => ({ps:pts.map(p=>({...p, hazard:null})), a:a?({...a,hazard:null}):null}) },
          { title: "Gros Bouchon",      desc: `-40 ${unit} pour tous (égalité).`, icon: "🚦", apply: (pts,a) => ({ps:pts.map(p=>({...p,km:Math.max(0,p.km-40)})), a:a?({...a,km:Math.max(0,a.km-40)}):null}) },
          { title: "Rallye Surprise",   desc: `Tous +60 ${unit}, mais limite imposée.`, icon: "🏎", apply: (pts,a)=>({ps:pts.map(p=>({...p,km:Math.min(targetKm,p.km+60),speedLimit:true})),a:a?({...a,km:Math.min(targetKm,a.km+60),speedLimit:true}):null}) },
        ],
        zelda: [
          { title: "Bénédiction de Hylia",  desc: `+80 ${unit} pour tous.`, icon: "✨", apply: evGainAll(80) },
          { title: "Lune de Sang",          desc: "Tous reçoivent une malédiction (limite).", icon: "🌑", apply:(pts,a)=>({ps:pts.map(p=>({...p,speedLimit:true})),a:a?({...a,speedLimit:true}):null}) },
          { title: "Vol des Korogus",       desc: "Le leader recule de 50.", icon: "🍃", apply: evLossLeader(50) },
          { title: "Sanctuaire Découvert",  desc: "🟢 Tous les héros bloqués sont libérés.", icon: "🌀", apply: evRescueBlocked() },
          { title: "Vent de Revali",        desc: `+100 ${unit} pour tous, vent en poupe !`, icon: "💨", apply: evGainAll(100) },
          { title: "Pluie d'Étoiles",       desc: `Dernier voyageur +120 ${unit}.`, icon: "⭐", apply: evBoostLast(120) },
          { title: "Apparition d'Epona",    desc: "🟢 Toutes les blessures sont soignées.", icon: "🐴", apply:(pts,a)=>({ps:pts.map(p=>({...p,hazard:null})),a:a?({...a,hazard:null}):null}) },
          { title: "Tornade de Vah Naboris",desc: "Tous arrêtés par la tempête.", icon: "⚡", apply:(pts,a)=>({ps:pts.map(p=>({...p,stopped:true})),a:a?({...a,stopped:true}):null}) },
          { title: "Échange Sheikah",       desc: "Échange des mains entre voisins.", icon: "📜", apply:(pts,a)=>{const allH=pts.map(p=>p.hand);if(a)allH.push(a.hand);const sh=[allH[allH.length-1],...allH.slice(0,allH.length-1)];return{ps:pts.map((p,i)=>({...p,hand:sh[i]})),a:a?({...a,hand:sh[sh.length-1]}):null};} },
          { title: "Fontaine de Lanaru",    desc: `+60 ${unit} et limites levées.`, icon: "💧", apply:(pts,a)=>({ps:pts.map(p=>({...p,km:Math.min(targetKm,p.km+60),speedLimit:false})),a:a?({...a,km:Math.min(targetKm,a.km+60),speedLimit:false}):null}) },
        ],
        mario: [
          { title: "Étoile d'Or Géante",   desc: `+100 ${unit} pour tous !`, icon: "⭐", apply: evGainAll(100) },
          { title: "Carapace Bleue",       desc: "Le leader perd 60 km.", icon: "🐢", apply: evLossLeader(60) },
          { title: "Champi Doré",          desc: `Dernier +150 ${unit}, rattrapage !`, icon: "🍄", apply: evBoostLast(150) },
          { title: "Boîte à Objets",       desc: "Tous reçoivent +50 et fin de limite.", icon: "📦", apply:(pts,a)=>({ps:pts.map(p=>({...p,km:Math.min(targetKm,p.km+50),speedLimit:false})),a:a?({...a,km:Math.min(targetKm,a.km+50),speedLimit:false}):null}) },
          { title: "Klaxon Joyeux",        desc: "🟢 Tous les joueurs en panne redémarrent !", icon: "🎺", apply: evRescueBlocked() },
          { title: "Glissement Banane",    desc: "Tous limités à 50.", icon: "🍌", apply:(pts,a)=>({ps:pts.map(p=>({...p,speedLimit:true})),a:a?({...a,speedLimit:true}):null}) },
          { title: "Tunnel Bowser",        desc: "Tous arrêtés.", icon: "🔥", apply:(pts,a)=>({ps:pts.map(p=>({...p,stopped:true})),a:a?({...a,stopped:true}):null}) },
          { title: "Tonneaux DK",          desc: "Hasard : ±50 km.", icon: "🛢", apply:(pts,a)=>{const r=()=>Math.random()<0.5?-50:50;return{ps:pts.map(p=>({...p,km:Math.max(0,Math.min(targetKm,p.km+r()))})),a:a?({...a,km:Math.max(0,Math.min(targetKm,a.km+r()))}):null};} },
          { title: "Fleur de Feu",         desc: "🟢 Pannes envolées en fumée !", icon: "🔥", apply:(pts,a)=>({ps:pts.map(p=>({...p,hazard:null})),a:a?({...a,hazard:null}):null}) },
          { title: "Niveau Bonus",         desc: `+70 ${unit} pour tous, hop là !`, icon: "🎮", apply: evGainAll(70) },
        ],
        craft: [
          { title: "Spawn d'Iron Golem",   desc: "🟢 Sauvetage : tout le monde repart.", icon: "🦾", apply: evRescueBlocked() },
          { title: "Ravage de Creeper",    desc: "Tout le monde perd 40 km.", icon: "💥", apply:(pts,a)=>({ps:pts.map(p=>({...p,km:Math.max(0,p.km-40)})),a:a?({...a,km:Math.max(0,a.km-40)}):null}) },
          { title: "Marchand Villageois",  desc: `Pluie d'émeraudes : +50 ${unit}.`, icon: "💚", apply: evGainAll(50) },
          { title: "Dimension Nether",     desc: "Tous arrêtés par la chaleur.", icon: "🔥", apply:(pts,a)=>({ps:pts.map(p=>({...p,stopped:true})),a:a?({...a,stopped:true}):null}) },
          { title: "Diamant Profond",      desc: `Dernier mineur +130 ${unit}.`, icon: "💎", apply: evBoostLast(130) },
          { title: "Foudre",               desc: "Le leader perd 50 km.", icon: "⚡", apply: evLossLeader(50) },
          { title: "Portail d'Ender",      desc: `Tous +90 ${unit}, téléportés !`, icon: "🌀", apply: evGainAll(90) },
          { title: "Lac de Lave",          desc: "Tous limités à 50.", icon: "🌋", apply:(pts,a)=>({ps:pts.map(p=>({...p,speedLimit:true})),a:a?({...a,speedLimit:true}):null}) },
          { title: "Bibliothèque",         desc: "Tous piochent 2 cartes en plus.", icon: "📚", effect:"drawAll2", apply:evDrawAll(2) },
          { title: "Coffre au Trésor",     desc: "🟢 Toutes pannes réparées par bricolage.", icon: "📦", apply:(pts,a)=>({ps:pts.map(p=>({...p,hazard:null})),a:a?({...a,hazard:null}):null}) },
        ],
        cyber: [
          { title: "Patch Global",         desc: "🟢 Tous les bugs sont corrigés !", icon: "🛠", apply: evRescueBlocked() },
          { title: "Mise à Jour",          desc: `Tous +60 TB.`, icon: "⬆", apply: evGainAll(60) },
          { title: "DDoS Massif",          desc: "Tous arrêtés temporairement.", icon: "🌐", apply:(pts,a)=>({ps:pts.map(p=>({...p,stopped:true})),a:a?({...a,stopped:true}):null}) },
          { title: "Crypto Boom",          desc: `Tous +80 TB.`, icon: "🪙", apply: evGainAll(80) },
          { title: "Hack du Leader",       desc: "Le leader perd 60 TB.", icon: "💀", apply: evLossLeader(60) },
          { title: "Glitch Matrix",        desc: "Échange des mains.", icon: "🐛", apply:(pts,a)=>{const allH=pts.map(p=>p.hand);if(a)allH.push(a.hand);const sh=[allH[allH.length-1],...allH.slice(0,allH.length-1)];return{ps:pts.map((p,i)=>({...p,hand:sh[i]})),a:a?({...a,hand:sh[sh.length-1]}):null};} },
          { title: "Backup Cloud",         desc: "🟢 Restauration : pannes nettoyées.", icon: "💾", apply:(pts,a)=>({ps:pts.map(p=>({...p,hazard:null})),a:a?({...a,hazard:null}):null}) },
          { title: "Bande Passante Max",   desc: "Limites levées partout.", icon: "🚀", apply:(pts,a)=>({ps:pts.map(p=>({...p,speedLimit:false})),a:a?({...a,speedLimit:false}):null}) },
          { title: "Mod de Hacker",        desc: `Dernier +140 TB.`, icon: "👤", apply: evBoostLast(140) },
          { title: "Throttling FAI",       desc: "Tous limités à 50.", icon: "🐌", apply:(pts,a)=>({ps:pts.map(p=>({...p,speedLimit:true})),a:a?({...a,speedLimit:true}):null}) },
        ],
        space: [
          { title: "Saut Hyperspatial",    desc: `Tous +100 parsecs !`, icon: "🚀", apply: evGainAll(100) },
          { title: "Tempête Solaire",      desc: "Tous arrêtés.", icon: "☀", apply:(pts,a)=>({ps:pts.map(p=>({...p,stopped:true})),a:a?({...a,stopped:true}):null}) },
          { title: "Anomalie Quantique",   desc: "🟢 Toutes les avaries résolues.", icon: "🌀", apply: evRescueBlocked() },
          { title: "Champ d'Astéroïdes",   desc: "Tous limités à 50.", icon: "☄", apply:(pts,a)=>({ps:pts.map(p=>({...p,speedLimit:true})),a:a?({...a,speedLimit:true}):null}) },
          { title: "Trou de Ver",          desc: `Tous +80 ps.`, icon: "🕳", apply: evGainAll(80) },
          { title: "Pirate Spatial",       desc: "Le leader perd 70 ps.", icon: "🏴‍☠", apply: evLossLeader(70) },
          { title: "Station Recharge",     desc: `Dernier +120 ps.`, icon: "⛽", apply: evBoostLast(120) },
          { title: "Pulsar",               desc: "Tous +40 ps mais limités.", icon: "💫", apply:(pts,a)=>({ps:pts.map(p=>({...p,km:Math.min(targetKm,p.km+40),speedLimit:true})),a:a?({...a,km:Math.min(targetKm,a.km+40),speedLimit:true}):null}) },
          { title: "Nébuleuse",            desc: "🟢 Visibilité restaurée, on repart.", icon: "🌌", apply:(pts,a)=>({ps:pts.map(p=>({...p,hazard:null,stopped:false})),a:a?({...a,hazard:null,stopped:false}):null}) },
          { title: "Flotte Amie",          desc: `Tous +50 ps et reboot.`, icon: "🛸", apply:(pts,a)=>({ps:pts.map(p=>({...p,km:Math.min(targetKm,p.km+50),hazard:null})),a:a?({...a,km:Math.min(targetKm,a.km+50),hazard:null}):null}) },
        ],
        apoca: [
          { title: "Tempête de Sable",     desc: "Tous limités à 50 miles.", icon: "🏜", apply:(pts,a)=>({ps:pts.map(p=>({...p,speedLimit:true})),a:a?({...a,speedLimit:true}):null}) },
          { title: "Pillage Réussi",       desc: `Tous +60 miles.`, icon: "🔧", apply: evGainAll(60) },
          { title: "Convoi d'Eau",         desc: "🟢 Plus de soif : pannes envolées.", icon: "💧", apply: evRescueBlocked() },
          { title: "Embuscade",            desc: "Tous arrêtés.", icon: "💀", apply:(pts,a)=>({ps:pts.map(p=>({...p,stopped:true})),a:a?({...a,stopped:true}):null}) },
          { title: "Course Mad Max",       desc: `Tous +90 miles, plein gaz !`, icon: "🔥", apply: evGainAll(90) },
          { title: "Tornade Apocalyptique",desc: "Le leader perd 70 miles.", icon: "🌪", apply: evLossLeader(70) },
          { title: "Survivant Solidaire",  desc: `Dernier +130 miles.`, icon: "🤝", apply: evBoostLast(130) },
          { title: "Mécano Errant",        desc: "🟢 Toutes les bagnoles réparées !", icon: "🔧", apply:(pts,a)=>({ps:pts.map(p=>({...p,hazard:null})),a:a?({...a,hazard:null}):null}) },
          { title: "Pluie Acide",          desc: "Tous -30 miles.", icon: "☣", apply:(pts,a)=>({ps:pts.map(p=>({...p,km:Math.max(0,p.km-30)})),a:a?({...a,km:Math.max(0,a.km-30)}):null}) },
          { title: "Sirène Rouillée",      desc: "🟢 Démarrage forcé pour tous !", icon: "📢", apply:(pts,a)=>({ps:pts.map(p=>({...p,stopped:false})),a:a?({...a,stopped:false}):null}) },
        ],
        medieval: [
          { title: "Décret Royal",         desc: `Tous +70 lieues, ordre du roi.`, icon: "📜", apply: evGainAll(70) },
          { title: "Pont-Levis Levé",      desc: "Tous arrêtés.", icon: "🏰", apply:(pts,a)=>({ps:pts.map(p=>({...p,stopped:true})),a:a?({...a,stopped:true}):null}) },
          { title: "Bénédiction Pieuse",   desc: "🟢 Toutes infirmités guéries !", icon: "✨", apply: evRescueBlocked() },
          { title: "Pluie de Flèches",     desc: "Le leader perd 50 lieues.", icon: "🏹", apply: evLossLeader(50) },
          { title: "Trésor du Dragon",     desc: `Dernier chevalier +140 lieues.`, icon: "🐉", apply: evBoostLast(140) },
          { title: "Tournoi du Roi",       desc: `Tous +50 lieues, chevauchée.`, icon: "🏆", apply: evGainAll(50) },
          { title: "Brume Maléfique",      desc: "Tous limités à 50.", icon: "🌫", apply:(pts,a)=>({ps:pts.map(p=>({...p,speedLimit:true})),a:a?({...a,speedLimit:true}):null}) },
          { title: "Festin Royal",         desc: "🟢 Forces retrouvées, en avant !", icon: "🍖", apply:(pts,a)=>({ps:pts.map(p=>({...p,hazard:null,stopped:false})),a:a?({...a,hazard:null,stopped:false}):null}) },
          { title: "Joute Équestre",       desc: "Hasard : ±50 lieues.", icon: "⚔", apply:(pts,a)=>{const r=()=>Math.random()<0.5?-50:50;return{ps:pts.map(p=>({...p,km:Math.max(0,Math.min(targetKm,p.km+r()))})),a:a?({...a,km:Math.max(0,Math.min(targetKm,a.km+r()))}):null};} },
          { title: "Route Pavée",          desc: "Limites levées royalement.", icon: "🛤", apply:(pts,a)=>({ps:pts.map(p=>({...p,speedLimit:false})),a:a?({...a,speedLimit:false}):null}) },
        ],
        ac_mirage: [
          { title: "Caravane marchande",   desc: `Tous +60 ruelles, escorte sûre.`, icon: "🐪", apply: evGainAll(60) },
          { title: "Couvre-feu strict",    desc: "Tous arrêtés par les gardes.",   icon: "🌃", apply:(pts,a)=>({ps:pts.map(p=>({...p,stopped:true})),a:a?({...a,stopped:true}):null}) },
          { title: "Tempête de sable",     desc: "Tous limités à 50.",             icon: "🌪", apply:(pts,a)=>({ps:pts.map(p=>({...p,speedLimit:true})),a:a?({...a,speedLimit:true}):null}) },
          { title: "Bureau Hashashin",     desc: "🟢 Vos blessures sont soignées.",icon: "🗡", apply:(pts,a)=>({ps:pts.map(p=>({...p,hazard:null})),a:a?({...a,hazard:null}):null}) },
          { title: "Patrouille de gardes", desc: "Le leader perd 60 ruelles.",      icon: "🛡", apply: evLossLeader(60) },
          { title: "Contrat lucratif",     desc: `Le dernier +130 ruelles.`,        icon: "📜", apply: evBoostLast(130) },
          { title: "Saut de la Foi",       desc: `Tous +90 ruelles, élan parfait.`, icon: "🦅", apply: evGainAll(90) },
          { title: "Marché de nuit",       desc: "🟢 Tous repartent en silence.",   icon: "🌙", apply: evRescueBlocked() },
          { title: "Maître Templier",      desc: "Hasard : ±50 ruelles.",           icon: "✝", apply:(pts,a)=>{const r=()=>Math.random()<0.5?-50:50;return{ps:pts.map(p=>({...p,km:Math.max(0,Math.min(targetKm,p.km+r()))})),a:a?({...a,km:Math.max(0,Math.min(targetKm,a.km+r()))}):null};} },
          { title: "Pluie de pétales",     desc: "Limites levées dans les jardins.", icon: "🌸", apply:(pts,a)=>({ps:pts.map(p=>({...p,speedLimit:false})),a:a?({...a,speedLimit:false}):null}) },
        ],
        ac_bf: [
          { title: "Vents favorables",     desc: `Tous +70 noeuds, plein cap !`,    icon: "💨", apply: evGainAll(70) },
          { title: "Calme plat",           desc: "Tous arrêtés, sans vent.",        icon: "🌊", apply:(pts,a)=>({ps:pts.map(p=>({...p,stopped:true})),a:a?({...a,stopped:true}):null}) },
          { title: "Récifs traîtres",      desc: "Tous limités à 50.",              icon: "🪸", apply:(pts,a)=>({ps:pts.map(p=>({...p,speedLimit:true})),a:a?({...a,speedLimit:true}):null}) },
          { title: "Île au trésor",        desc: "🟢 Carénage : avaries réparées.", icon: "💎", apply:(pts,a)=>({ps:pts.map(p=>({...p,hazard:null})),a:a?({...a,hazard:null}):null}) },
          { title: "Salve impériale",      desc: "Le capitaine en tête perd 60.",   icon: "🔫", apply: evLossLeader(60) },
          { title: "Cale pleine d'or",     desc: `Dernier matelot +130 noeuds.`,    icon: "🏴‍☠️", apply: evBoostLast(130) },
          { title: "Cap aux ouragans",     desc: `Tous +90 noeuds dans la tempête.`,icon: "🌩", apply: evGainAll(90) },
          { title: "Port franc",           desc: "🟢 Équipage requinqué, on repart.",icon: "⚓", apply: evRescueBlocked() },
          { title: "Roulette du Kraken",   desc: "Hasard : ±50 noeuds.",            icon: "🐙", apply:(pts,a)=>{const r=()=>Math.random()<0.5?-50:50;return{ps:pts.map(p=>({...p,km:Math.max(0,Math.min(targetKm,p.km+r()))})),a:a?({...a,km:Math.max(0,Math.min(targetKm,a.km+r()))}):null};} },
          { title: "Brise tropicale",      desc: "Limites levées au large.",        icon: "🏝", apply:(pts,a)=>({ps:pts.map(p=>({...p,speedLimit:false})),a:a?({...a,speedLimit:false}):null}) },
        ],
      };
      const makeContentEvent = (entry) => {
          const effect = entry.effect || "gainAll70";
          const applyMap = {
              gainAll70: evGainAll(70),
              gainAll90: evGainAll(90),
              stopAll: (pts,a)=>({ps:pts.map(p=>({...p,stopped:true})),a:a?({...a,stopped:true}):null}),
              speedLimitAll: (pts,a)=>({ps:pts.map(p=>({...p,speedLimit:true})),a:a?({...a,speedLimit:true}):null}),
              clearLimits: (pts,a)=>({ps:pts.map(p=>({...p,speedLimit:false})),a:a?({...a,speedLimit:false}):null}),
              clearHazards: (pts,a)=>({ps:pts.map(p=>({...p,hazard:null})),a:a?({...a,hazard:null}):null}),
              rescue: evRescueBlocked(),
              lossLeader60: evLossLeader(60),
              boostLast130: evBoostLast(130),
              drawAll2: evDrawAll(2),
              randomSwing: (pts,a)=>{const r=()=>Math.random()<0.5?-50:50;return{ps:pts.map(p=>({...p,km:Math.max(0,Math.min(targetKm,p.km+r()))})),a:a?({...a,km:Math.max(0,Math.min(targetKm,a.km+r()))}):null};},
          };
          return {title:entry.title, desc:entry.desc, icon:entry.icon || "✨", effect, apply:applyMap[effect] || applyMap.gainAll70};
      };
      const clarifyEventDescription = (entry) => {
          const desc = String(entry.desc || '').trim();
          const effect = entry.effect || '';
          const hay = `${entry.title || ''} ${desc}`.toLowerCase();
          let impact = '';
          if(effect === 'drawAll2' || /pioche|main|carte/.test(hay)) impact = 'Impact cartes : chaque joueur concerné pioche ou modifie sa main.';
          else if(effect === 'stopAll' || /arr.t|bloqu/.test(hay)) impact = 'Impact global : les joueurs concernés sont arrêtés et devront repartir.';
          else if(effect === 'speedLimitAll' || /limit/.test(hay)) impact = 'Malus global : limite de vitesse active, les grosses distances sont bloquées.';
          else if(effect === 'clearLimits') impact = 'Bonus global : toutes les limites de vitesse sont retirées.';
          else if(effect === 'clearHazards' || effect === 'rescue' || /r.part|r.par|soign|panne/.test(hay)) impact = 'Bonus sécurité : les pannes ou blocages concernés sont nettoyés.';
          else if(effect === 'lossLeader60' || /leader|t.te|capitaine/.test(hay)) impact = 'Malus ciblé : le joueur en tête perd de la progression.';
          else if(effect === 'boostLast130' || /dernier/.test(hay)) impact = 'Rattrapage : le dernier joueur gagne de la progression.';
          else if(effect === 'randomSwing' || /hasard|roulette|casino|±/.test(hay)) impact = 'Effet aléatoire : chaque joueur peut avancer ou reculer.';
          else if(/tous|chaque joueur|global/.test(hay)) impact = 'Impact global : toute la table est concernée.';
          else impact = 'Impact : effet appliqué immédiatement à la table.';
          return {...entry, desc: desc.includes('Impact') ? desc : `${desc} ${impact}`.trim()};
      };
      const themeBibleEvents = (THEME_CONTENT[skinKey]?.events || []).map(makeContentEvent);
      const pool = [...universal, ...(themed[skinKey] || themed.classic), ...themeBibleEvents];
      const ev = clarifyEventDescription(pool[Math.floor(Math.random() * pool.length)]);
      setEventData(ev); AudioSys.event(); addLog(`Événement : ${ev.title}`, "event", null, ev.icon);
      return ev;
  }

  const triggerNpcEvent = (diffLvl) => {
      AudioSys.npcIntro();
      // Chaque PNJ propose 5 cartes au choix. Les achats partent dans l'inventaire (sac).
      const skinKey = THEMES[theme]?.skin || "classic";
      const shopLore = THEME_CONTENT[skinKey]?.shop;
      const themeShop = shopLore ? {
          title: `${shopLore.npc} — ${shopLore.title}`,
          desc: `« ${shopLore.phrases[Math.floor(Math.random()*shopLore.phrases.length)]} »`,
          icon: THEMES[theme]?.icon || E.shop,
          interactive:true, isShop:true, shopType:`theme_${skinKey}`,
          items: [
            {itemName:shopLore.items[0] || "Bonus local", itemDesc:shopLore.desc, cost:25, cardVal:"boost75", cardType:"boost", itemIcon:THEMES[theme]?.icon || "✨"},
            {itemName:shopLore.items[1] || "Réparation", itemDesc:"Soigne toute panne importante", cost:30, cardVal:"premium", cardType:"remedy", itemIcon:E.tools},
            {itemName:shopLore.items[2] || "Protection", itemDesc:"+2 blindages contextualisés", cost:45, cardVal:"shield_2", cardType:"shield", itemIcon:E.shield},
            {itemName:shopLore.items[3] || "Action spéciale", itemDesc:"Vol ciblé d'une carte adverse", cost:20, cardVal:"vol", cardType:"action", itemIcon:E.hand},
            {itemName:shopLore.items[4] || "Piège", itemDesc:"-50 et limite sur une cible", cost:30, cardVal:"trap_major", cardType:"attack", itemIcon:E.trap},
          ]
      } : null;
      const shops = [
          { title: "Christophe — Garage",
            desc: "« J'ai du matos solide pour remettre n'importe quelle bagnole en route. »",
            icon: E.mechanicBoy, interactive:true, isShop:true, shopType:'christophe',
            items: [
              {itemName:"Kit Premium",    itemDesc:"Soigne TOUTE panne instantanément",                  cost:30, cardVal:"premium",    cardType:"remedy", itemIcon:"🔧"},
              {itemName:"Roue de secours",itemDesc:"Soigne une Crevaison",                               cost:10, cardVal:"roue",       cardType:"remedy", itemIcon:E.wheel},
              {itemName:"Essence",        itemDesc:"Soigne une Panne d'essence",                         cost:10, cardVal:"essence",    cardType:"remedy", itemIcon:E.gas},
              {itemName:"Réparation",     itemDesc:"Soigne un Accident",                                 cost:10, cardVal:"reparation", cardType:"remedy", itemIcon:E.wrench},
              {itemName:"Garde-Boue",     itemDesc:"+1 blindage permanent (parade prochaine attaque)",    cost:25, cardVal:"shield_1",   cardType:"shield", itemIcon:"🛡"},
            ]
          },
          { title: "Yohan — Magasin Brico",
            desc: "« Système D garanti ! Ça marche pas toujours nickel mais ça repart. »",
            icon: E.builder, interactive:true, isShop:true, shopType:'yohan',
            items: [
              {itemName:"Bricolage",     itemDesc:"Répare tout, repart (mais max 50)",                   cost:15, cardVal:"bricolage", cardType:"remedy", itemIcon:"🧰"},
              {itemName:"Fin de Limite", itemDesc:"Annule la limite de vitesse",                          cost:10, cardVal:"fin_limite",cardType:"remedy", itemIcon:E.car},
              {itemName:"Feu Vert",      itemDesc:"Démarre le moteur (sortir de Feu Rouge)",              cost:8,  cardVal:"feu_vert",  cardType:"remedy", itemIcon:E.green},
              {itemName:"Petit Boost",   itemDesc:"+50 km auto-jouée",                                    cost:20, cardVal:"boost50",   cardType:"boost",  itemIcon:"💨"},
              {itemName:"Pause Café",    itemDesc:"Pioche 3 cartes supplémentaires",                       cost:25, cardVal:"draw3",     cardType:"draw",   itemIcon:"🎴"},
            ]
          },
          { title: "Nathan & Gaël — Hackers",
            desc: "« On accepte les espèces. Choisis ton arme. »",
            icon: E.hacker, interactive:true, isShop:true, shopType:'nathan',
            items: [
              {itemName:"Piratage",      itemDesc:"Recul -50 km + arrêt immédiat",                       cost:50, cardVal:"piratage",   cardType:"attack", itemIcon:"💻"},
              {itemName:"Sabotage",      itemDesc:"-50 km sur la cible",                                  cost:25, cardVal:"sabotage",   cardType:"attack", itemIcon:E.bomb},
              {itemName:"Piège Mineur",  itemDesc:"-30 km + limite imposée",                              cost:30, cardVal:"trap_minor", cardType:"attack", itemIcon:"🛑"},
              {itemName:"Bouchon",       itemDesc:"-25 km sans limite",                                   cost:15, cardVal:"slow",       cardType:"attack", itemIcon:"🐌"},
              {itemName:"Carte Vol",     itemDesc:"Choisissez une position dans la main adverse",          cost:20, cardVal:"vol",        cardType:"action", itemIcon:E.hand},
            ]
          },
          { title: "Muriel — Supermarché",
            desc: "« Du choix pour tous les budgets ! »",
            icon: E.shopkeeper, interactive:true, isShop:true, shopType:'muriel',
            items: [
              {itemName:"Carte Vol",     itemDesc:"Choisissez une position dans la main adverse",          cost:20, cardVal:"vol",        cardType:"action", itemIcon:E.hand},
              {itemName:"Reroll",        itemDesc:"Défausse main, repioche 10 cartes fraîches",            cost:35, cardVal:"reroll",     cardType:"reroll", itemIcon:"♻"},
              {itemName:"Boost +75",     itemDesc:"+75 km bonus",                                          cost:40, cardVal:"boost75",    cardType:"boost",  itemIcon:"⚡"},
              {itemName:"Blindage x2",   itemDesc:"+2 blindages",                                          cost:45, cardVal:"shield_2",   cardType:"shield", itemIcon:"🛡"},
              {itemName:"Kit Premium",   itemDesc:"Soigne toute panne",                                    cost:30, cardVal:"premium",    cardType:"remedy", itemIcon:"🔧"},
            ]
          },
      ];
      if(themeShop) shops.unshift(themeShop);
      const ev = shops[Math.floor(Math.random() * shops.length)];
      setEventData(ev); addLog(`Rencontre avec ${ev.title.split(' — ')[0]}`, "event", null, ev.icon);
      return ev;
  };

  // Determine quel joueur passe actuellement dans la boutique (selon shopQueue, fallback turn).
  const currentShopKey = () => {
      if(shopQueue && shopQueue.length > 0 && shopQueueIndex < shopQueue.length) {
          return shopQueue[shopQueueIndex];
      }
      return turn;
  };

  const makeNextTurnPayload = (fromIdx, ps, a, dk, discNext) => {
      const nx = fromIdx === "ai" ? 0 : (fromIdx + 1) % nh;
      return { idx: (cfg.hasAI && nx === 0) ? "ai" : nx, ps, a, dk, dc: discNext };
  };

  const resumeTurnPayload = (payload) => {
      if(!payload) return;
      setTimeout(() => {
          if(nh > 1) { setPassD(payload); setPass(true); }
          else applyT(payload.idx, payload.ps, payload.a, payload.dk, payload.dc);
      }, 350);
  };

  useEffect(() => {
      if(!eventData?.isShop) return;
      const shopKey = currentShopKey();
      const shopPlayer = shopKey === "ai" ? ai : players[shopKey];
      if(!shopPlayer) return;
      const shopMsg = `🛒 ${shopPlayer.name} — à toi d'acheter`;
      setMsg(shopMsg); setMt("info"); tflash("info", shopMsg);
      addLog(shopMsg, "event", shopKey, "🛒");
  }, [eventData, shopQueueIndex]);

  const handleShopAction = (actionType, payload) => {
      if(actionLocked.current) return;
      const shopKey = currentShopKey();
      const isAi = shopKey === "ai";
      let p = isAi ? null : players[shopKey];
      let a = ai;
      let dC = [...deck], diC = [...disc];
      const activeP = isAi ? a : p;
      if(!activeP) { advanceShopQueue(); return; }

      actionLocked.current = true;

      if (actionType === 'trade' && payload >= 0) {
          const c = activeP.hand[payload]; activeP.hand = activeP.hand.filter((_,i)=>i!==payload); diC.push(c);
          const dr = drawCard(dC, diC); if(dr.card) activeP.hand.push(dr.card); dC = dr.deck; diC = dr.disc;
          addLog(`${activeP.name} a troqué avec Muriel`, "info", shopKey, "🔄");
      } else if (actionType === 'buy') {
          const { cost, cardVal, cardType, itemName, itemIcon, itemDesc } = payload;
          if (activeP.km >= cost) {
              activeP.km -= cost;
              const skinKey = THEMES[theme]?.skin || "classic";
              const newCard = normalizePlayableCard({
                  value: cardVal,
                  type: cardType,
                  icon: itemIcon,
                  label: itemName,
                  sub: itemDesc
              }, skin, skinKey, unit, Math.random());
              activeP.inventory.push(newCard);
              const buyMsg = `🛒 ${activeP.name} a terminé son achat`;
              setMsg(buyMsg); setMt("success"); tflash("success", buyMsg);
              addLog(buyMsg, "success", shopKey, "🛒");
              AudioSys.buy();
          } else {
              const errMsg = `${activeP.name} n'a pas assez de pièces`;
              setMsg(errMsg); setMt("error"); tflash("error", errMsg); addLog(errMsg, "info", shopKey, "💰");
          }
      } else {
          addLog(`${activeP.name} quitte la boutique`, "info", shopKey, "🚪");
      }

      setDeck(dC); setDisc(diC);
      const nPs = [...players]; if(!isAi) nPs[shopKey] = p; setPlayers(nPs); setAi(a);
      AudioSys.click();
      // Avance au joueur suivant dans la queue (ou ferme si fini)
      advanceShopQueue();
  };

  // Avance le curseur de la queue boutique. Quand tous les joueurs sont passes,
  // ferme l'eventData et reprend le tour normal.
  const advanceShopQueue = () => {
      if(!shopQueue) { setEventData(null); return; }
      const nextIdx = shopQueueIndex + 1;
      if(nextIdx >= shopQueue.length) {
          // Fin de la queue : on referme la boutique et reprend le jeu normalement
          const pending = pendingNxt.current;
          pendingNxt.current = null;
          setShopQueue(null);
          setShopQueueIndex(0);
          
          if(pending) {
              // Delay setEventData(null) alongside applyT to prevent AI turn race condition
              setTimeout(() => {
                  setEventData(null);
                  if(nh > 1) { setPassD(pending); setPass(true); }
                  else applyT(pending.idx, pending.ps, pending.a, pending.dk, pending.dc);
              }, 350);
          } else {
              setEventData(null);
          }
      } else {
          setShopQueueIndex(nextIdx);
          // L'eventData reste affiche (meme PNJ, joueur suivant)
      }
  };

  // Gere un evenement de troc non-shop (echange simple de carte contre nouvelle pioche).
  // idx === -1 => passer / annuler.
  const handleInteractiveTrade = (idx) => {
      if(actionLocked.current) return;
      actionLocked.current = true;
      try {
          const p = turn === "ai" ? null : players[turn];
          const a = turn === "ai" ? ai : null;
          const activeP = (turn === "ai" ? a : p);
          if(!activeP) { setEventData(null); actionLocked.current = false; return; }
          let dC = [...deck], diC = [...disc];
          if(idx >= 0 && activeP.hand[idx]) {
              const tossed = activeP.hand[idx];
              activeP.hand = activeP.hand.filter((_,i)=>i!==idx);
              diC.push(tossed);
              const dr = drawCard(dC, diC);
              if(dr.card) activeP.hand.push(dr.card);
              dC = dr.deck; diC = dr.disc;
              addLog(`${activeP.name} a échangé une carte`, "event", turn==="ai"?"ai":turn);
              AudioSys.draw();
          } else {
              addLog(`${activeP.name} passe l'événement`, "info", turn==="ai"?"ai":turn);
          }
          setDeck(dC); setDisc(diC);
          if(turn === "ai") { setAi(activeP); }
          else { const nPs = [...players]; nPs[turn] = activeP; setPlayers(nPs); }
          setEventData(null);
          // Unlock action after processing trade event
          setTimeout(() => { actionLocked.current = false; }, 50);
      } catch(e) { setEventData(null); actionLocked.current = false; }
  };

  function checkMilestones(ps, a, nextPayload=null) {
      if(eventMilestones.length === 0) return false;
      const maxKm = Math.max(...ps.map(p=>p.km), a?a.km:0);
      if(maxKm >= eventMilestones[0]) {
          setEventMilestones(prev => prev.slice(1));
          pendingNxt.current = nextPayload;
          // Construit la queue de tous les joueurs tries par km decroissant (humains + IA)
          // pour les faire passer chacun a leur tour dans la boutique.
          const all = ps.map((p, i) => ({key: i, km: p.km})).concat(a ? [{key:'ai', km: a.km}] : []);
          all.sort((x, y) => y.km - x.km); // decroissant
          const queue = all.map(x => x.key);
          setShopQueue(queue);
          setShopQueueIndex(0);
          triggerNpcEvent(diff);
          return true;
      }
      return false;
  }

  useEffect(()=>{
    if(turn!=="ai"||over||!ai||eventData)return;
    const mv=aiMove(ai,players,safe,D);
    setAip("looking");setAil(-1);setAic(-1);
    const lms=350,len=ai.hand.length,ts=[]; 
    ai.hand.forEach((_,i)=>ts.push(setTimeout(()=>setAil(i),i*lms)));
    ts.push(setTimeout(()=>{setAil(-1);setAip("chosen");setAic(mv.idx>=0?mv.idx:0);AudioSys.draw();},(len*lms)+300));
    ts.push(setTimeout(()=>{setAip("idle");setAil(-1);setAic(-1);runAI(mv);},(len*lms)+2000));
    return()=>ts.forEach(clearTimeout);
  },[turn,over,eventData]);

  function bumpSafe(card){
    if(card&&card.value==="feu_vert")setSafe(D.safe+2);
    else setSafe(s=>Math.max(0,s-1));
  }

  function runAI({idx,nAI,nH, isInvMove}){
    try{
      let fa=dc(nAI),ps=nH.map(dc),nd=[...deck],nd2=[...disc],m="",playedCard=null,cf=false;
      let targetHit = -1; let zoneHit = false;
      
      if(idx>=0){
        playedCard = isInvMove ? fa.inventory[idx] : fa.hand[idx];
        if(isInvMove) fa.inventory=fa.inventory.filter((_,i)=>i!==idx);
        else fa.hand=fa.hand.filter((_,i)=>i!==idx);

        if(playedCard.type !== "action") nd2=[...nd2,playedCard]; 
        else nd2=[...nd2,playedCard];

        m=`${meta?.aiIcon||"IA"} joue ${playedCard.label}`;
        if(fa.coupsFourres > (ai.coupsFourres||0)) cf = true;
        if(playedCard.isZone || playedCard.isChaos) zoneHit = true;

        // FIX : l'IA lance reellement la zone attack sur tous les humains.
        if(playedCard.isZone) {
            const zh = playedCard.hazard || "feu_rouge";
            ps = ps.map(p => {
                const t = {...p, bottes:[...(p.bottes||[])]};
                if(isImmune(t, zh)) return t;
                if(t.tank_shield > 0) { t.tank_shield = Math.max(0, t.tank_shield - 1); return t; }
                if(zh === "limite") { if(!t.speedLimit) t.speedLimit = true; return t; }
                if(zh === "feu_rouge") { if(!t.stopped || t.hazard !== "feu_rouge") { t.hazard = "feu_rouge"; t.stopped = true; if(hideNightHazards) t.hazardHidden = true; } return t; }
                if(!t.hazard) { t.hazard = zh; if(hideNightHazards) t.hazardHidden = true; }
                return t;
            });
        }

        if(playedCard.type === "attack" || playedCard.type === "action") {
           if(hideNightHazards && playedCard.type === "attack" && !playedCard.isZone) {
               ps = ps.map((p,i) => (p.hazard && p.hazard !== players[i]?.hazard) ? {...p, hazardHidden:true} : p);
           }
           for(let i=0; i<nH.length; i++) {
               if(nH[i].hazard !== players[i].hazard || nH[i].hand.length < players[i].hand.length || nH[i].tank_shield !== players[i].tank_shield || nH[i].km !== players[i].km || nH[i].speedLimit !== players[i].speedLimit) { targetHit = i; break; }
           }
        }
        if(playedCard.type === "distance" || playedCard.type === "boost") { setIsMoving(true); setTimeout(() => setIsMoving(false), 1500); }
      } else {
        let di=fa.hand.findIndex(c=>c.type==="attack");if(di<0)di=fa.hand.findIndex(c=>c.value<=20&&c.type==="distance");if(di<0)di=0;
        if(fa.hand[di]){nd2=[...nd2,fa.hand[di]];fa.hand=fa.hand.filter((_,i)=>i!==di);}
        m=`L'IA défausse une carte.`;
      }
      
      // L'IA refait toujours sa main a MIN_HAND_SIZE (10) apres action ou defausse.
      if(!isInvMove) {
          const r = refillHand(fa, nd, nd2);
          nd = r.deck; nd2 = r.disc;
      }
      // Refill aussi tous les humains qui auraient ete impactes (vol notamment)
      for(let i=0; i<ps.length; i++) {
          if(ps[i].hand.length < MIN_HAND_SIZE) {
              const r = refillHand(ps[i], nd, nd2);
              nd = r.deck; nd2 = r.disc;
          }
      }

      for(let i=0;i<ps.length;i++){if(ps[i].km>=targetKm){setPlayers(ps);setAi(fa);setOver({w:false});return;}}
      if(fa.km>=targetKm){setPlayers(ps);setAi(fa);setOver({w:true});return;}
      
      setAi(fa);setPlayers(ps);setDeck(nd);setDisc(nd2);
      
      if(cf){
        m=`L'IA joue COUP FOURRE (${playedCard.label}) !!!`; setMt("cf"); AudioSys.cf(); tflash("cf", m); addLog(m, "cf", "ai", playedCard.icon);
        triggerCardFx(playedCard, "COUP FOURRÉ !", "L'IA pare");
      } else if (playedCard?.isChaos) {
        setMt("info"); tflash("info", m); addLog(m, "event", "ai", playedCard.icon);
        triggerCardFx(playedCard, "Aléa déclenché", "Tous les joueurs");
      } else if (playedCard?.isZone) {
        m = survivalNight ? `L'IA déclenche une perturbation nocturne de zone` : `L'IA a lancé une attaque de zone : ${playedCard.label}`;
        setMt("attack"); players.forEach((_, i) => triggerShake(i)); AudioSys.attack(); tflash("attack", m); addLog(m, "attack", "ai", survivalNight ? "🌙" : playedCard.icon);
        triggerCardFx(playedCard, "ATTAQUE DE ZONE !", "Tous adversaires");
      } else if (targetHit !== -1) {
        const hiddenAttack = survivalNight && playedCard?.type==="attack" && ps[targetHit]?.hazardHidden;
        m = hiddenAttack ? `L'IA inflige un incident nocturne à ${ps[targetHit].name}` : `L'IA a ciblé ${ps[targetHit].name} avec ${playedCard.label}`;
        setMt("attack"); triggerShake(targetHit); AudioSys.attack(); tflash("attack", m); addLog(m, "attack", "ai", hiddenAttack ? "🌙" : playedCard.icon);
        triggerCardFx(hiddenAttack ? {...playedCard, label:"Incident nocturne", icon:"🌙"} : playedCard, hiddenAttack ? "Incident masqué" : (playedCard.label || "Attaque !"), `Sur ${ps[targetHit].name}`);
      } else if (playedCard) {
        m=`L'IA joue ${playedCard.label}`;
        setMt("ai"); AudioSys.playCard(); tflash("ai", m); addLog(m, "ai", "ai", playedCard.icon);
        triggerCardFx(playedCard, playedCard.label || "Carte jouée", "L'IA");
      } else {
        setMt("info"); AudioSys.draw(); tflash("info", m); addLog(m, "info", "ai");
      }
      
      setMsg(m);bumpSafe(playedCard);setTurns(t=>t+1);
      
      if(playedCard?.isChaos) {
          const ev = triggerRandomEvent(ps, fa, diff);
          if(!ev.interactive) {
             const res = ev.apply(ps, fa, nd, nd2); ps = res.ps; if(res.a) fa = res.a;
             if(res.dk) nd = res.dk; if(res.dc) nd2 = res.dc;
             setPlayers(ps); setAi(fa); setDeck(nd); setDisc(nd2);
          }
      }
      
      if(!checkMilestones(ps, fa, {idx:0, ps, a:fa, dk:nd, dc:nd2})) nxt(0,ps,fa,nd,nd2);
    }catch(e){
      console.error('[runAI] Erreur inattendue pendant le tour IA:', e);
      setMsg("Erreur inattendue côté IA – tour passé au joueur suivant.");
      setMt("error");
      try { nxt(0, players.map(dc), ai, deck, disc); } catch(e2) {
        console.error('[runAI] Fallback nxt() échoué:', e2);
      }
    }
  }

  const applySurvivalTurnStart = (idx, ps, a) => {
      if(!fuelBaseGame) return { ps, a };
      let nextPs = ps ? ps.map(dc) : players.map(dc);
      let nextA = a !== undefined && a !== null ? dc(a) : (ai ? dc(ai) : null);
      const isAiTarget = idx === "ai";
      const active = isAiTarget ? nextA : nextPs[idx];
      if(!active) return { ps:nextPs, a:nextA };

      active.maxFuel = active.maxFuel || 100;
      active.fuel = Math.max(0, (typeof active.fuel==="number" ? active.fuel : active.maxFuel) - SURVIVAL_FUEL_LOSS);
      if(hideNightHazards && active.hazardHidden) {
          active.hazardHidden = false;
          const haz = active.hazard ? (skin[active.hazard]?.label || active.hazard) : "incident";
          const revealMsg = `🌙 ${active.name} révèle : ${haz}`;
          setMsg(revealMsg); setMt("attack"); addLog(revealMsg, "attack", isAiTarget ? "ai" : idx, "🌙");
      } else {
          const fuelMsg = `${hideNightHazards ? "🌙 Nuit" : "⛽ Carburant"} : ${active.name} perd ${SURVIVAL_FUEL_LOSS}%`;
          if(active.fuel<=25 || hideNightHazards) {
            setMsg(fuelMsg); setMt(active.fuel<=20 ? "error" : "info");
            addLog(fuelMsg, active.fuel<=20 ? "attack" : "info", isAiTarget ? "ai" : idx, hideNightHazards ? "🌙" : "⛽");
          }
      }
      if(active.fuel <= 0 && !active.hazard) {
          active.hazard = "panne_essence";
          active.stopped = true;
          active.hazardHidden = false;
          const panneMsg = `⛽ ${active.name} tombe en panne sèche`;
          setMsg(panneMsg); setMt("attack"); tflash("attack", panneMsg); addLog(panneMsg, "attack", isAiTarget ? "ai" : idx, "⛽");
          triggerShake(isAiTarget ? "ai" : idx);
      }
      if(isAiTarget) nextA = active;
      else nextPs[idx] = active;
      return { ps:nextPs, a:nextA };
  };

  function nxt(idx,ps,a,dk,dc2){
      const forcedEvent = D.eventEveryTurns && ((turns + 1) % D.eventEveryTurns === 0);
      const eventRoll = forcedEvent || Math.random() < (D.eventChance || 0.05);
      if(idx===0 && eventRoll && !eventData) { 
          const ev = triggerRandomEvent(ps, a, diff);
          if(!ev.interactive) {
            const res = ev.apply(ps, a, dk, dc2); ps = res.ps; if(res.a) a = res.a;
            if(res.dk) dk = res.dk; if(res.dc) dc2 = res.dc;
            setPlayers(ps); if(a) setAi(a); if(res.dk) setDeck(dk); if(res.dc) setDisc(dc2);
          }
      }
      if(nh>1){setTimeout(() => {setPassD({idx,ps,a,dk,dc:dc2});setPass(true);}, 2500);} // Fix: 2.5 sec pause to see actions
      else applyT(idx,ps,a,dk,dc2);
  }
  function applyT(idx,ps,a,dk,dc2){
      actionLocked.current = false;
      const ticked = applySurvivalTurnStart(idx, ps, a);
      ps = ticked.ps; a = ticked.a;
      if(ps)setPlayers(ps);if(a!==undefined)setAi(a);if(dk)setDeck(dk);if(dc2)setDisc(dc2);setTurn(idx);setSelHand(null);setSelInv(null);setDraggedCard(null);
  }
  function confPass(){if(!passD)return;try{const{idx,ps,a,dk,dc:dc2}=passD;applyT(idx,ps,a,dk,dc2);setPass(false);setPassD(null);}catch{setPass(false);setPassD(null);}}

  const getPlayability = (card, player, isInventory=false) => {
      if(!card || !player) return {ok:false, reason:"Carte indisponible"};
      if(isAITurn) return {ok:false, reason:"Attendez la fin du tour IA"};
      if(over || eventData || pass) return {ok:false, reason:"Action en cours"};
      if(card.type==="distance") {
          if(player.stopped || player.hazard) return {ok:false, reason:"Vous devez être en route"};
          if(player.speedLimit && card.value>50) return {ok:false, reason:"Limite active : max 50"};
          if(player.km + card.value > targetKm) return {ok:false, reason:`Dépasse ${targetKm}`};
          return {ok:true, reason:""};
      }
      if(card.type==="boost") {
          if(card.isWild) return {ok:true, reason:""};
          if(player.stopped || player.hazard) return {ok:false, reason:"Boost impossible à l'arrêt"};
          return {ok:true, reason:""};
      }
      if(card.type==="remedy") {
          if(card.value==="premium" || card.isBrico) return (player.hazard || player.stopped) ? {ok:true, reason:""} : {ok:false, reason:"Aucune panne à soigner"};
          if(card.value==="feu_vert") return (player.stopped || player.hazard==="feu_rouge") ? {ok:true, reason:""} : {ok:false, reason:"Déjà en route"};
          if(card.value==="fin_limite") return player.speedLimit ? {ok:true, reason:""} : {ok:false, reason:"Pas de limite active"};
          return player.hazard===card.fixes ? {ok:true, reason:""} : {ok:false, reason:"Remède non adapté"};
      }
      if(card.type==="botte") {
          if(player.bottes?.some(b=>b.value===card.value)) return {ok:false, reason:"Botte déjà active"};
          return {ok:true, reason:""};
      }
      if(card.type==="attack" || card.type==="action") {
          if(card.isChaos || card.isZone) return {ok:true, reason:""};
          const targets = [...players.map((p,i)=>({p,i,isSelf:i===turn})), ...(ai?[{p:ai,i:"ai",isSelf:false}]:[])];
          const hasTarget = targets.some(t => !t.isSelf && t.p);
          if(!hasTarget) return {ok:false, reason:"Aucune cible disponible"};
          if(card.type==="action" && card.value==="vol" && !targets.some(t=>!t.isSelf && (t.p.hand||[]).length>0)) return {ok:false, reason:"Aucune main à voler"};
          return {ok:true, reason:""};
      }
      return {ok:true, reason:""};
  };

  const canPlayCard = (card, isInventory=false) => getPlayability(card, curP, isInventory);

  function processPlay(ci, targetIsAI, targetIdx, isFromInv=false, stealChoiceIndex=null) {
    if(isAITurn || over || eventData) return;
    try{
      const pi=turn,ps=players.map(dc);
      const card=isFromInv ? ps[pi].inventory[ci] : ps[pi].hand[ci];
      Logger.info('Game', `Player attempts to play card`, { playerName: ps[pi]?.name, cardLabel: card?.label, ci, targetIsAI, targetIdx, isFromInv, turn: turns });
      if(!card) {
        Logger.warn('Game', 'processPlay aborted: card not found', { ci });
        return;
      }
      const playCheck = getPlayability(card, ps[pi], isFromInv);
      if(!playCheck.ok){
        Logger.warn('Game', 'playCheck failed', { reason: playCheck.reason, cardLabel: card?.label });
        setMsg(playCheck.reason);setMt("error");tflash("error",playCheck.reason);AudioSys.error();return;
      }
      
      if(card.isZone) {
          // FIX critique : les cartes isZone n'avaient PAS de hazard defini dans mkSkin —
          // tous les targets recevaient hazard:undefined (effet visible mais sans logique).
          // On force "feu_rouge" par defaut sur les cartes de zone (intent design : bloque tout le monde).
          const zoneHazard = card.hazard || "feu_rouge";
          let hitSomeone = false;
          const applyToTarget = (t) => {
              t = {...t, bottes:[...(t.bottes||[])]};
              if(isImmune(t, zoneHazard)) return t;
              if(t.tank_shield > 0) { t.tank_shield = Math.max(0, t.tank_shield - 1); return t; }
              if(zoneHazard==="limite") {
                  if(!t.speedLimit) { t.speedLimit = true; hitSomeone = true; }
                  return t;
              }
              if(zoneHazard==="feu_rouge") {
                  if(!t.stopped || t.hazard !== "feu_rouge") {
                      t.hazard = "feu_rouge";
                      t.stopped = true; // bloque vraiment le joueur
                      if(hideNightHazards) t.hazardHidden = true;
                      hitSomeone = true;
                  }
                  return t;
              }
              // Autres pannes (panne_essence, accident, crevaison) : applique seulement si target libre
              if(!t.hazard) { t.hazard = zoneHazard; if(hideNightHazards) t.hazardHidden = true; hitSomeone = true; }
              return t;
          }
          let nPs = ps.map((p, i) => i === pi ? p : applyToTarget(p));
          let nA = ai ? applyToTarget(dc(ai)) : null;

          let dr = {deck, disc};
          if(isFromInv) {
              ps[pi].inventory=ps[pi].inventory.filter((_,i)=>i!==ci);
          } else {
              ps[pi].hand=ps[pi].hand.filter((_,i)=>i!==ci);
              dr=refillHand(ps[pi], deck, [...disc, card]);
          }

          actionLocked.current = true;
          setSafe(s=>Math.max(0,s-1));setTurns(t=>t+1);setSelHand(null);setSelInv(null);setDraggedCard(null);setHoveredCard(null);
          
          const hiddenZone = hideNightHazards && hitSomeone;
          let lmsg = hiddenZone ? `${ps[pi].name} déclenche une perturbation nocturne de zone` : `${ps[pi].name} lance une attaque de zone : ${card.label}`;
          setMsg(lmsg);setMt("attack");tflash("attack",lmsg); addLog(lmsg, "attack", pi, hiddenZone ? "🌙" : card.icon);
          AudioSys.attack(); 
          nPs.forEach((_, i) => { if(i!==pi) triggerShake(i); });
          if(nA) triggerShake("ai");
          
          setPlayers(nPs);setAi(nA);setDeck(dr.deck);setDisc(dr.disc);
          if(!checkMilestones(nPs, nA, makeNextTurnPayload(pi, nPs, nA, dr.deck, dr.disc))) {
              const nx=(pi+1)%nh;
              if(cfg.hasAI&&nx===0){if(nh>1){setTimeout(() => {setPassD({idx:"ai",ps:nPs,a:nA,dk:dr.deck,dc:dr.disc});setPass(true);}, 2500);}else applyT("ai", nPs, nA, dr.deck, dr.disc);}
              else setTimeout(() => nxt(nx,nPs,nA,dr.deck,dr.disc), 2500);
          }
          return;
      }

      if(card.isChaos) {
          let dr = {deck, disc};
          if(isFromInv) {
              ps[pi].inventory=ps[pi].inventory.filter((_,i)=>i!==ci);
          } else {
              ps[pi].hand=ps[pi].hand.filter((_,i)=>i!==ci);
              dr=refillHand(ps[pi], deck, [...disc, card]);
          }
          actionLocked.current = true;
          setSafe(s=>Math.max(0,s-1));setTurns(t=>t+1);setSelHand(null);setSelInv(null);setDraggedCard(null);setHoveredCard(null);
          setPlayers(ps);setDeck(dr.deck);setDisc(dr.disc);

          let lmsg = `${ps[pi].name} déclenche l'événement : ${card.label}`;
          setMsg(lmsg);setMt("info");tflash("info",lmsg); addLog(lmsg, "event", pi, card.icon);

          const ev = triggerRandomEvent(ps, ai, diff);
          let nPs=ps, nA=ai;
          if(!ev.interactive) {
             const res = ev.apply(ps, ai, dr.deck, dr.disc); nPs = res.ps; if(res.a) nA = res.a;
             if(res.dk) dr.deck = res.dk; if(res.dc) dr.disc = res.dc;
             setPlayers(nPs); setAi(nA); setDeck(dr.deck); setDisc(dr.disc);
          }
          if(!checkMilestones(nPs, nA, makeNextTurnPayload(pi, nPs, nA, dr.deck, dr.disc))) {
              const nx=(pi+1)%nh;
              if(cfg.hasAI&&nx===0){if(nh>1){setTimeout(() => {setPassD({idx:"ai",ps:nPs,a:nA,dk:dr.deck,dc:dr.disc});setPass(true);}, 2500);}else applyT("ai", nPs, nA, dr.deck, dr.disc);}
              else setTimeout(() => nxt(nx,nPs,nA,dr.deck,dr.disc), 2500);
          }
          return;
      }

      if(card.type==="attack" || card.type==="action"){
        let target,tIA=false;
        if(cfg.isSolo){if(!ai){setMsg("Pas d'IA.");setMt("error");AudioSys.error();return;}target=dc(ai);tIA=true;}
        else if(targetIsAI&&ai){target=dc(ai);tIA=true;}
        else if(typeof targetIdx==="number"&&targetIdx!==pi){target=ps[targetIdx];}
        else{setMsg("Cible invalide !");setMt("error");AudioSys.error();return;}

        if(card.type==="action" && card.value==="vol" && stealChoiceIndex===null) {
            if(!target.hand || target.hand.length===0){setMsg("Main cible vide !");setMt("error");tflash("error","Main cible vide");AudioSys.error();return;}
            setStealPrompt({
                ci, targetIsAI:tIA, targetIdx:tIA ? null : targetIdx, isFromInv,
                targetName:tIA ? "l'IA" : ps[targetIdx].name,
                targetHandCount:target.hand.length,
                targetHand:target.hand.map((_,i)=>i)
            });
            setMsg(`🎴 Choisissez une carte à voler chez ${tIA ? "l'IA" : ps[targetIdx].name}`);
            setMt("info");
            AudioSys.click();
            return;
        }
        
        let res;
        if(card.type==="action") res = applyAction(card, target, ps[pi].hand, stealChoiceIndex);
        else res = applyAtk(card,target);

        if(!res.ok){setMsg(res.msg);setMt("error");tflash("error",res.msg);AudioSys.error();return;}
        
        let dr = {deck, disc};
        if(isFromInv) {
            ps[pi].inventory=ps[pi].inventory.filter((_,i)=>i!==ci);
        } else {
            ps[pi].hand=ps[pi].hand.filter((_,i)=>i!==ci);
            dr=refillHand(ps[pi], deck, [...disc, card]);
        }
        
        let na=ai;
        if(tIA)na={...ai,...res.target,bottes:[...res.target.bottes]};
        else ps[targetIdx]={...ps[targetIdx],...res.target,bottes:[...res.target.bottes]};
        if(hideNightHazards && !res.parried && card.type==="attack" && res.target?.hazard) {
            if(tIA && na) na.hazardHidden = true;
            else if(typeof targetIdx==="number") ps[targetIdx].hazardHidden = true;
        }
        if(res.stolen) ps[pi].hand.push(res.stolen);

        // Apres un vol, la cible a perdu une carte. On lui refait la main a MIN_HAND_SIZE pour
        // respecter la regle "tous les joueurs maintiennent >=10 cartes".
        if(card.value === "vol" && res.ok && !res.parried) {
            if(tIA && na) { const rr = refillHand(na, dr.deck, dr.disc); dr = rr; }
            else if(typeof targetIdx==="number") { const rr = refillHand(ps[targetIdx], dr.deck, dr.disc); dr = rr; }
        }

        setSafe(s=>Math.max(0,s-1));setTurns(t=>t+1);setSelHand(null);setSelInv(null);setDraggedCard(null);setHoveredCard(null);
        
        const hiddenAttack = hideNightHazards && card.type==="attack" && res.target?.hazard && !res.parried;
        let lmsg = hiddenAttack ? `${ps[pi].name} inflige un incident nocturne à ${tIA?"l'IA":ps[targetIdx].name}` : `${ps[pi].name} cible ${tIA?"l'IA":ps[targetIdx].name} avec ${card.label}`;
        if(res.parried) lmsg += " (Bloqué par Blindage!)";

        const visibleMsg = hiddenAttack ? "🌙 Incident nocturne posé" : res.msg;
        setMsg(visibleMsg);setMt("attack");tflash("attack",visibleMsg); addLog(lmsg, "attack", pi, hiddenAttack ? "🌙" : card.icon);
        if(card.type==="action") AudioSys.vol(); else AudioSys.attack();
        triggerShake(tIA ? "ai" : targetIdx);
        // Card FX overlay : feedback visuel "carte jouee + cible + effet"
        triggerCardFx(hiddenAttack ? {...card, label:"Incident nocturne", icon:"🌙"} : card, res.parried ? "Paré !" : (hiddenAttack ? "Incident masqué" : (res.msg || card.label)), tIA ? "Sur l'IA" : `Sur ${ps[targetIdx]?.name}`);
        
        setPlayers(ps);setAi(na);setDeck(dr.deck);setDisc(dr.disc);
        if(!checkMilestones(ps, na, makeNextTurnPayload(pi, ps, na, dr.deck, dr.disc))) {
            const nx=(pi+1)%nh;
            if(cfg.hasAI&&nx===0){if(nh>1){setTimeout(() => {setPassD({idx:"ai",ps,a:na,dk:dr.deck,dc:dr.disc});setPass(true);}, 2500);}else applyT("ai", ps, na, dr.deck, dr.disc);}
            else setTimeout(() => nxt(nx,ps,na,dr.deck,dr.disc), 2500);
        }
      }else{
        let res = null;
        let dr = {deck, disc};
        let selfRuntimeResult = null;
        const canUseSelfRuntime = RuntimeSelfLayer.available && RuntimeSelfLayer.isSelfRuntimeCard(card);

        if(canUseSelfRuntime) {
            selfRuntimeResult = RuntimeSelfLayer.resolveSelfCardPlay({
                actor: ps[pi],
                card,
                cardIndex: ci,
                source: isFromInv ? "inventory" : "hand",
                deck,
                disc,
                targetKm,
                minHandSize: MIN_HAND_SIZE,
                effectOptions: {vehicles: VEHICLES, targetKm},
            });

            if(selfRuntimeResult?.ok) {
                res = selfRuntimeResult.effect;
                ps[pi] = selfRuntimeResult.player;
                dr = {deck: selfRuntimeResult.deck, disc: selfRuntimeResult.disc};
            } else if(selfRuntimeResult?.reason === "effect-refused") {
                setMsg(selfRuntimeResult.msg);setMt("error");tflash("error",selfRuntimeResult.msg);AudioSys.error();return;
            } else if(selfRuntimeResult) {
                console.warn("[processPlay:self] adaptateur self non consommé, fallback legacy", selfRuntimeResult.reason);
            }
        }

        if(!res) {
            res=applySelf(card,ps[pi]);
            if(!res.ok){setMsg(res.msg);setMt("error");tflash("error",res.msg);AudioSys.error();return;}
            
            ps[pi]={...res.player,hand:res.player.hand||ps[pi].hand};
            
            if(isFromInv) {
                ps[pi].inventory=ps[pi].inventory.filter((_,i)=>i!==ci);
            } else {
                ps[pi].hand=ps[pi].hand.filter((_,i)=>i!==ci);
                // ─── Cas special REROLL : defausse toute la main puis pioche 10 fraiches
                if(res.rerollHand) {
                    const tossed = [...ps[pi].hand];
                    ps[pi].hand = [];
                    dr = refillHand(ps[pi], deck, [...disc, card, ...tossed]);
                } else {
                    dr=refillHand(ps[pi], deck, [...disc, card]);
                    // ─── Cas special DRAW : bonus de pioche supplementaire (au-dela de MIN_HAND_SIZE)
                    if(res.drawBonus && res.drawBonus > 0) {
                        const target = ps[pi].hand.length + res.drawBonus;
                        dr = refillHand(ps[pi], dr.deck, dr.disc, target);
                    }
                }
            }
        }

        if(card.type === "distance" || card.type === "boost") { setIsMoving(true); setTimeout(() => setIsMoving(false), 1500); }

        bumpSafe(card);
        setTurns(t=>t+1);setSelHand(null);setSelInv(null);setDraggedCard(null);setHoveredCard(null);
        
        if(ps[pi].km>=targetKm){setPlayers(ps);setAi(ai);setOver({w:false});return;}
        
        if(res.cf){
            tflash("cf", res.msg); setMsg(res.msg);setMt("cf"); AudioSys.cf(); addLog(`COUP FOURRE par ${ps[pi].name} !`, "cf", pi, card.icon);
            triggerCardFx(card, "COUP FOURRÉ !", ps[pi].name);
        }else{
            tflash(card.type==="botte"?"botte":card.type==="distance"?"distance":"remedy",res.msg);
            setMsg(res.msg);setMt("success"); AudioSys.success(); addLog(`${ps[pi].name} joue ${card.label}`, "success", pi, card.icon);
            triggerCardFx(card, res.msg || card.label, `Sur ${ps[pi].name}`);
        }

        setPlayers(ps);setDeck(dr.deck);setDisc(dr.disc);
        if(!checkMilestones(ps, ai, makeNextTurnPayload(pi, ps, ai, dr.deck, dr.disc))) {
            const nx=(pi+1)%nh;
            if(cfg.hasAI&&nx===0){if(nh>1){setTimeout(() => {setPassD({idx:"ai",ps,a:ai,dk:dr.deck,dc:dr.disc});setPass(true);}, 2500);}else applyT("ai", ps, ai, dr.deck, dr.disc);}
            else setTimeout(() => nxt(nx,ps,ai,dr.deck,dr.disc), 2500);
        }
      }
    }catch(e){
      // NOTE: des setX() peuvent avoir déjà été appelés avant cette exception
      // (état partiellement muté). Voir CONF-03 dans audit-memory.
      console.error('[processPlay] Erreur inattendue:', e);
      setMsg("Erreur, reessayez.");setMt("error");AudioSys.error();
    }
  }

  // ─── INFO-BULLE JOUEUR ENRICHIE ─────────────────────────────
  // Genere un texte multilignes pour le tooltip custom large : etat, malus,
  // remedes, bottes, immunites, argent, raisons du blocage.
  const buildPlayerTooltip = (p, vData) => {
      if(!p) return '';
      const lines = [];
      lines.push(`${p.name}${vData?` (${vData.icon} ${vData.name})`:''}`);
      lines.push(`Distance : ${p.km} / ${targetKm} ${unit}`);
      lines.push(`Pièces disponibles : ${p.km} ${unit}`);
      lines.push(`Carburant : ${typeof p.fuel==="number"?p.fuel:100}% / ${p.maxFuel||100}%`);
      lines.push('');
      lines.push('── ÉTAT ──');
      if(!p.stopped && !p.hazard) {
          lines.push('🟢 En route, libre de jouer une distance.');
      } else {
          if(p.stopped && !p.hazard) {
              lines.push('🛑 Arrêté — jouez un Feu Vert pour démarrer.');
          }
          if(p.hazard) {
              const haz = skin[p.hazard];
              lines.push(p.hazardHidden ? `🌙 Panne masquée jusqu'au tour de ${p.name}.` : `⚠ Panne : ${haz?.label || p.hazard}`);
              const fix = Object.entries(skin).find(([k, v]) => v && v.fixes === p.hazard);
              if(fix) lines.push(`   Remède requis : ${fix[1].label}`);
              if(p.hazard === 'feu_rouge') lines.push(`   ou jouez ${skin.feu_vert?.label || 'Feu Vert'}.`);
          }
      }
      if(p.speedLimit) {
          lines.push(`🚧 Limite de vitesse — max 50 par carte distance.`);
          lines.push(`   Remède : ${skin.fin_limite?.label || 'Fin de Limite'}.`);
      }
      // Option deblocage paye
      if((p.hazard || p.stopped || p.speedLimit) && p.km >= 200) {
          lines.push(`💰 Vous pouvez payer 200 ${unit} pour tout retirer (bouton "Réparer").`);
      } else if((p.hazard || p.stopped || p.speedLimit) && p.km < 200) {
          lines.push(`💰 Déblocage payé : ${200-p.km} ${unit} manquants.`);
      }
      // Bottes & immunites
      if(p.bottes && p.bottes.length > 0) {
          lines.push('');
          lines.push('── BOTTES ACTIVES ──');
          p.bottes.forEach(b => {
              const tgt = Array.isArray(b.immuneTo) ? b.immuneTo.join(' + ') : b.immuneTo;
              lines.push(`✨ ${b.label} — immunité ${tgt}`);
          });
      }
      // Blindage / coups fourres / handsize
      const vfx = vData?.effects || {};
      const veh_immune = [];
      if(vfx.immune_panne)     veh_immune.push('panne essence');
      if(vfx.immune_limite)    veh_immune.push('limite');
      if(vfx.immune_crevaison) veh_immune.push('crevaison');
      if(vfx.immune_feu_rouge) veh_immune.push('feu rouge');
      if(vfx.immune_accident)  veh_immune.push('accident');
      if(veh_immune.length > 0) {
          lines.push('');
          lines.push('── IMMUNITÉS VÉHICULE ──');
          lines.push(`🚗 ${veh_immune.join(', ')}`);
      }
      if((p.tank_shield||0) > 0) {
          lines.push('');
          lines.push(`🛡 Blindage actif : x${p.tank_shield} (parade des prochaines attaques)`);
      }
      if((p.coupsFourres||0) > 0) {
          lines.push(`⭐ Coups Fourrés réussis : ${p.coupsFourres} (+${p.coupsFourres*300} pts au score)`);
      }
      lines.push('');
      lines.push(`Main : ${p.hand?.length||0} cartes • Sac : ${p.inventory?.length||0} cartes`);
      return lines.join('\n');
  };

  const showWideTip = (e, title, body) => {
      if(!body) return;
      const r = e.currentTarget.getBoundingClientRect();
      const x = Math.max(180, Math.min(window.innerWidth - 180, r.left + r.width / 2));
      const below = r.top < 210;
      const y = below ? (r.bottom + 6) : Math.max(24, r.top - 8);
      setUiTip({x, y, title, body, below});
  };
  const hideWideTip = () => setUiTip(null);

  // ─── MECANIQUE DEBLOCAGE A 200 PIECES ──────────────────────
  // Permet au joueur courant de retirer son malus (panne / limite) contre 200 km de monnaie.
  // Conditions :
  //   - C'est le tour du joueur humain courant (pas IA ni eventData ouvert)
  //   - Le joueur a soit un hazard, soit speedLimit, soit stopped (suite a une panne)
  //   - Le joueur dispose d'au moins 200 km
  //   - Ne consomme PAS le tour (le joueur peut ensuite jouer une carte normalement)
  // Note : ne supprime jamais une botte. Compatible bottes/protections : si le joueur est
  // immunise, il n'a pas de malus, le bouton est inactif.
  const RESCUE_COST = 200;
  const canRescuePay = () => {
      if(isAITurn || over || eventData || pass || actionLocked.current) return false;
      if(typeof turn !== "number") return false;
      const p = players[turn];
      if(!p) return false;
      if(p.km < RESCUE_COST) return false;
      return !!(p.hazard || p.speedLimit || p.stopped);
  };
  const doRescuePay = () => {
      if(!canRescuePay()) { AudioSys.error(); return; }
      const ps = players.map(dc);
      const p = ps[turn];
      const removed = [];
      if(p.hazard) { removed.push(skin[p.hazard]?.label || p.hazard); p.hazard = null; p.hazardHidden = false; }
      if(p.speedLimit) { removed.push("Limite de vitesse"); p.speedLimit = false; }
      if(p.stopped) { p.stopped = false; if(!removed.length) removed.push("Arrêt"); }
      if(fuelBaseGame) { p.fuel = p.maxFuel || 100; removed.push("Carburant"); }
      p.km = Math.max(0, p.km - RESCUE_COST);
      setPlayers(ps);
      const lmsg = `${p.name} paie ${RESCUE_COST} ${unit} pour réparer (${removed.join(", ")})`;
      setMsg(lmsg); setMt("success"); tflash("success", `${RESCUE_COST} ${unit} dépensés — réparé !`);
      AudioSys.buy(); addLog(lmsg, "success", turn, "🧰");
  };

  function processDiscard(forcedIndex=null){
    if(isAITurn || over || eventData || pass) return;
    try{
      const pi=turn,ps=players.map(dc);
      if(ps[pi].hand.length === 0) { setMsg("Main vide !"); return; }
      
      const idxToDiscard = Number.isInteger(forcedIndex) ? forcedIndex : (selHand !== null ? selHand : (() => {
          let worstIdx = ps[pi].hand.findIndex(c => c.type === 'distance' && c.value === 25);
          if(worstIdx >= 0) return worstIdx;
          worstIdx = ps[pi].hand.findIndex(c => c.type === 'distance' && c.value === 50);
          return worstIdx >= 0 ? worstIdx : 0;
      })());

      const card=ps[pi].hand[idxToDiscard];
      ps[pi].hand=ps[pi].hand.filter((_,i)=>i!==idxToDiscard);
      const dr=refillHand(ps[pi], deck, [...disc, card]);
      setPlayers(ps);setDeck(dr.deck);setDisc(dr.disc);
      setMsg("Défausse.");setMt("info");setSelHand(null);setSelInv(null);setDraggedCard(null);setHoveredCard(null);
      tflash("info","Défausse"); AudioSys.draw(); addLog(`${ps[pi].name} défausse ${card.label}`, "info", pi, card.icon);
      setSafe(s=>Math.max(0,s-1));setTurns(t=>t+1);
      
      if(!checkMilestones(ps, ai, makeNextTurnPayload(pi, ps, ai, dr.deck, dr.disc))) {
          const nx=(pi+1)%nh;
          if(cfg.hasAI&&nx===0){if(nh>1){setTimeout(() => {setPassD({idx:"ai",ps,a:ai,dk:dr.deck,dc:dr.disc});setPass(true);}, 1500);}else applyT("ai", ps, ai, dr.deck, dr.disc);}
          else setTimeout(() => nxt(nx,ps,ai,dr.deck,dr.disc), 1500);
      }
    }catch(e){setMsg("Erreur.");setMt("error");}
  }

  const handleDragStart = (e, i, card, isInv=false) => {
    if(isAITurn) { e.preventDefault(); return; }
    const play = getPlayability(card, curP, isInv);
    if(!play.ok) { e.preventDefault(); setMsg(play.reason); setMt("error"); return; }
    setDraggedCard({index: i, card: card, isInv});
    e.dataTransfer.setData('text/plain', i);
    e.dataTransfer.effectAllowed = "move";
  };
  const handleDragEnd = () => { setDraggedCard(null); };
  const handleDropOnCenter = (e) => {
    e.preventDefault();
    if(!draggedCard || isAITurn) return;
    const {index, card, isInv} = draggedCard;
    if(card.type === "attack" || card.type === "action") { if(isInv) return; processDiscard(); }
    else processPlay(index, false, turn, isInv);
  };
  const handleDropOnOpponent = (e, isAI, idx) => {
    e.preventDefault();
    if(!draggedCard || isAITurn) return;
    const {index, card, isInv} = draggedCard;
    if(card.type === "attack" || card.type === "action") processPlay(index, isAI, idx, isInv);
    else { setMsg("Attaque/Vol uniquement !"); setMt("error"); AudioSys.error(); tflash("error", "Cible invalide"); }
  };

  const topDisc=disc[disc.length-1];
  const curP=typeof turn==="number"?players[turn]:null;
  const curPlayerId=typeof turn==="number" ? (playerIds[turn] || `host:${turn}`) : null;
  const curPhoneControlled=!!(cfg.phoneMode && curPlayerId && mobileControlledIds.includes(curPlayerId));
  const hostTableMode=!!cfg?.networkHost;
  const curPrivateHandHidden=!!(curPhoneControlled || hostTableMode);
  const curC=curP?PC[curP.colorIdx||0]:PC[0];
  const curCard=curP ? (selHand!==null ? curP.hand[selHand] : (selInv!==null ? curP.inventory[selInv] : null)) : null;
  const isSelInv = selInv !== null;
  const allPP=[...players.map((p,i)=>({p,i,isAI:false})),...(cfg.hasAI&&ai?[{p:ai,i:"ai",isAI:true}]:[])];
  const maxKm = Math.max(...allPP.map(x=>x.p.km));
  const activeMilestone = eventMilestones[0];
  const showMilestone = activeMilestone && (activeMilestone - maxKm <= 150);
  const v2RoadPlayers = allPP.slice(0, 7).map((x) => {
      const pct = Math.max(0, Math.min(1, (x.p.km || 0) / targetKm));
      return {...x, ...getV2RoadPoint(pct), pct};
  });

  // Navigation clavier en jeu : flèches gauche/droite = main, haut/bas = sac,
  // Entrée = jouer si l'action est non ambiguë. Les champs texte/select/range
  // gardent leur comportement natif.
  useEffect(() => {
      const onKey = (e) => {
          const t = e.target;
          const tag = t && t.tagName ? t.tagName.toUpperCase() : '';
          if(tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
          if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Enter'].includes(e.key)) return;
          if(typeof turn !== 'number' || !curP || isAITurn || eventData || pass || over || settingsOpen || showExitConfirm || stealPrompt) return;
          if(e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
              e.preventDefault();
              const len = curP.hand?.length || 0;
              if(len > 0) {
                  const dir = e.key === 'ArrowRight' ? 1 : -1;
                  const base = selHand === null ? (dir > 0 ? -1 : 0) : selHand;
                  const next = (base + dir + len) % len;
                  setSelHand(next); setSelInv(null); setHoveredCard(curP.hand[next] || null);
              }
              return;
          }
          if(e.key === 'ArrowUp' || e.key === 'ArrowDown') {
              e.preventDefault();
              const len = curP.inventory?.length || 0;
              if(len > 0) {
                  const dir = e.key === 'ArrowDown' ? 1 : -1;
                  const base = selInv === null ? (dir > 0 ? -1 : 0) : selInv;
                  const next = (base + dir + len) % len;
                  setSelInv(next); setSelHand(null); setHoveredCard(curP.inventory[next] || null);
              }
              return;
          }
          if(e.key === 'Enter' && (selHand !== null || selInv !== null)) {
              e.preventDefault();
              const idx = selInv !== null ? selInv : selHand;
              const inv = selInv !== null;
              const card = inv ? curP.inventory[idx] : curP.hand[idx];
              const play = getPlayability(card, curP, inv);
              if(!play.ok){ setMsg(play.reason); setMt("error"); tflash("error", play.reason); AudioSys.error(); return; }
              if((card.type === "attack" || card.type === "action") && !card.isChaos && !card.isZone) {
                  if(cfg.isSolo && ai) processPlay(idx, true, null, inv);
                  else { setMsg("Choisissez une cible avec les boutons de ciblage."); setMt("info"); }
              } else {
                  processPlay(idx, false, turn, inv);
              }
          }
      };
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
  }, [turn, curP, isAITurn, eventData, pass, over, settingsOpen, showExitConfirm, stealPrompt, selHand, selInv, ai]);

  const publicStatusFor = (p) => {
      if(!p) return "Indisponible";
      if(p.hazard) return p.hazardHidden ? "Incident masqué" : (skin[p.hazard]?.label || p.hazard);
      if(p.stopped) return "Arrêté";
      if(p.speedLimit) return "Limité";
      return "En route";
  };

  const targetStatusForCard = (card, target, selfIdx) => {
      if(!card || !target) return {valid:false, reason:"Cible indisponible"};
      if(card.isZone || card.isChaos) return {valid:true, reason:"Effet global"};
      if(card.type === "attack") {
          const probe = applyAtk(card, dc(target));
          return {valid:!!probe.ok, reason:probe.ok ? "" : (probe.msg || "Cible protégée")};
      }
      if(card.type === "action" && card.value === "vol") {
          if(!target.hand || target.hand.length === 0) return {valid:false, reason:"Main cible vide"};
          return {valid:true, reason:""};
      }
      if(card.type === "action") return {valid:true, reason:""};
      return {valid:false, reason:"Cette carte ne cible pas un adversaire"};
  };

  const targetsForPlayer = (idx, card=null) => [
      ...players.map((p, i) => ({kind:'player', index:i, playerId:playerIds[i] || `host:${i}`, name:p.name, p})).filter(t => t.index !== idx),
      ...(cfg.hasAI && ai ? [{kind:'ai', index:'ai', playerId:'ai', name:ai.name || 'IA', p:ai}] : [])
  ].map(t => {
      const status = card ? targetStatusForCard(card, t.p, idx) : {valid:true, reason:""};
      const {p, ...safeTarget} = t;
      return {...safeTarget, valid:status.valid, reason:status.reason || ""};
  });

  const privateStateForPlayer = (p, idx) => {
      const pid = playerIds[idx] || `host:${idx}`;
      const isTurn = turn === idx && !isAITurn && !eventData && !pass && !over;
      const shopKey = eventData?.isShop ? currentShopKey() : null;
      const alerts = [];
      if(p.hazard) alerts.push(p.hazardHidden ? "Incident masqué : révélation à votre tour." : `Attaque active : ${skin[p.hazard]?.label || p.hazard}`);
      if(p.stopped && !p.hazard) alerts.push("Vous êtes arrêté : jouez un Feu Vert.");
      if(p.speedLimit) alerts.push("Limite active : max 50 par carte distance.");
      if((p.fuel ?? 100) <= 25) alerts.push(`Carburant bas : ${p.fuel ?? 100}%`);
      const privateNotices = logs
          .slice(-10)
          .map((l, order) => ({
              id:l.id,
              order,
              turn:l.turn || turns + 1,
              source:l.source || 'Table',
              actionType:l.actionType || l.type || 'info',
              effect:l.effect || l.msg,
              msg:l.msg,
              type:l.type,
              icon:l.icon || ''
          }));
      return {
          playerId: pid,
          name: p.name,
          km: p.km,
          targetKm,
          coins: p.km,
          fuel: typeof p.fuel === 'number' ? p.fuel : 100,
          maxFuel: p.maxFuel || 100,
          status: publicStatusFor(p),
          stopped: !!p.stopped,
          speedLimit: !!p.speedLimit,
          hazard: p.hazard || null,
          hazardLabel: p.hazard ? (skin[p.hazard]?.label || p.hazard) : '',
          isTurn,
          turnNumber: turns + 1,
          turnPlayerId: curPlayerId,
          turnName: curP?.name || (isAITurn ? 'IA' : ''),
          message: msg || '',
          messageType: mt || 'info',
          alerts,
          notices: privateNotices,
          shop: eventData?.isShop && shopKey === idx ? {
              title: eventData.title || 'Boutique',
              desc: eventData.desc || '',
              icon: eventData.icon || '🏪'
          } : null,
          targets: targetsForPlayer(idx),
          inventory: (p.inventory || []).map((c, ci) => ({
              index: ci,
              uid: c.uid,
              label: c.label,
              icon: c.icon || '🎴',
              type: c.type,
              sub: c.sub || '',
              desc: getCardDesc(c)
          })),
          hand: (p.hand || []).map((c, ci) => {
              const play = isTurn ? getPlayability(c, p, false) : {ok:false, reason:'Ce n’est pas votre tour'};
              return {
                  index: ci,
                  uid: c.uid,
                  label: c.label,
                  icon: c.icon || '🎴',
                  type: c.type,
                  sub: c.sub || '',
                  desc: getCardDesc(c),
                  playable: !!play.ok,
                  reason: play.reason || '',
                  isZone: !!c.isZone,
                  isChaos: !!c.isChaos,
                  targets: (c.type==="attack" || c.type==="action") && !c.isZone && !c.isChaos ? targetsForPlayer(idx, c) : [],
              };
          })
      };
  };

  const buildPrivateByPlayer = () => {
      const out = {};
      players.forEach((p, idx) => { out[playerIds[idx] || `host:${idx}`] = privateStateForPlayer(p, idx); });
      return out;
  };

  const buildPrivateForClient = (clientId) => {
      const prefix = `${clientId}:`;
      return {
          targetKm,
          turnPlayerId: curPlayerId,
          turnName: curP?.name || (isAITurn ? 'IA' : ''),
          players: players
              .map((p, idx) => ({p, idx, pid:playerIds[idx] || `host:${idx}`}))
              .filter(x => String(x.pid).startsWith(prefix))
              .map(x => privateStateForPlayer(x.p, x.idx))
      };
  };

  const buildPublicSyncState = () => ({
      theme,
      title: meta?.title || 'Mille Bornes',
      unit,
      targetKm,
      turnNumber: turns + 1,
      turnPlayerId: curPlayerId,
      turnName: curP?.name || (isAITurn ? 'IA' : ''),
      message: msg || '',
      messageType: mt,
      deckCount: deck.length,
      discardCount: disc.length,
      topDiscard: topDisc ? {label:topDisc.label, icon:topDisc.icon || '🎴', type:topDisc.type} : null,
      players: allPP.map(({p,i,isAI}) => ({
          playerId: isAI ? 'ai' : (playerIds[i] || `host:${i}`),
          name: isAI ? 'IA' : p.name,
          isAI,
          isTurn: turn === i,
          km: p.km,
          targetKm,
          fuel: typeof p.fuel === 'number' ? p.fuel : 100,
          maxFuel: p.maxFuel || 100,
          status: publicStatusFor(p),
          speedLimit: !!p.speedLimit,
          stopped: !!p.stopped,
          handCount: (p.hand || []).length,
          inventoryCount: (p.inventory || []).length,
          colorIdx: p.colorIdx || 0,
          icon: VEHICLES.find(v=>v.id===p.vid)?.icon || PC[p.colorIdx||0]?.emoji || '🚗',
          phoneControlled: !isAI && mobileControlledIds.includes(playerIds[i] || `host:${i}`),
      })),
      logs: logs.slice(-18).map(l => ({id:l.id,turn:l.turn||turns+1,source:l.source||'Table',actionType:l.actionType||l.type,effect:l.effect||l.msg,msg:l.msg,type:l.type,icon:l.icon,c:l.c})),
      over: !!over,
  });

  const publishNetworkState = () => {
      if(!networkServer) return;
      try {
          if(typeof networkServer.setMobileState === 'function') networkServer.setMobileState(buildPrivateByPlayer());
          if(typeof networkServer.broadcast === 'function') networkServer.broadcast({type:'state', state:buildPublicSyncState()});
          if(typeof networkServer.getClients === 'function' && typeof networkServer.sendTo === 'function') {
              (networkServer.getClients() || []).forEach(c => {
                  networkServer.sendTo(c.id, {type:'private-state', state:buildPrivateForClient(c.id)});
              });
          }
      } catch(e) { console.warn('[net:publish]', e?.message || e); }
  };

  // ─── Mode téléphone + PC distants : synchronisation publique/privée ──────
  // Mobile : map playerId -> état privé. PC distant : état public + privé par client.
  useEffect(() => {
      publishNetworkState();
  }, [networkServer, players, ai, turn, eventData, pass, over, isAITurn, skin, playerIds.join('|'), logs.length, deck.length, disc.length, msg, mt, mobileControlledIds.join('|')]);

  // Broadcast périodique léger : un PC qui rejoint en cours de partie reçoit
  // l'état complet sans attendre la prochaine action de jeu.
  useEffect(() => {
      if(!networkServer) return;
      const t = setInterval(publishNetworkState, 1000);
      return () => clearInterval(t);
  }, [networkServer, players, ai, turn, eventData, pass, over, isAITurn, playerIds.join('|'), logs.length, deck.length, disc.length, msg, mt, mobileControlledIds.join('|')]);

  useEffect(() => {
      if(!networkServer || typeof networkServer.getRoster !== 'function') return;
      const refresh = () => {
          try {
              const roster = networkServer.getRoster();
              setMobileControlledIds((roster.mobileControllers || []).map(m => m.playerId));
          } catch(e) { console.warn('[net:roster]', e?.message || e); }
      };
      refresh();
      const t = setInterval(refresh, 1200);
      return () => clearInterval(t);
  }, [networkServer]);

  const sendRemoteResult = (req, ok, message) => {
      if(req?.id && networkServer && typeof networkServer.completeMobileAction === 'function') {
          try { networkServer.completeMobileAction(req.id, ok, message); } catch(e) { console.warn('[net:ack-mobile]', e?.message || e); }
      }
      if(req?.clientId && networkServer && typeof networkServer.sendTo === 'function') {
          try { networkServer.sendTo(req.clientId, {type:'remote-result', ok, message, actionId:req.id || null}); } catch(e) { console.warn('[net:ack-remote]', e?.message || e); }
      }
  };

  const handleNetworkAction = (req) => {
      if(!req || typeof turn !== 'number' || isAITurn || eventData || pass || over || actionLocked.current) {
          sendRemoteResult(req, false, "Action refusée : la table n'est pas prête.");
          return;
      }
      const idx = playerIds.indexOf(req.playerId);
      if(idx !== turn) {
          const reason = "Ce n’est pas le tour de ce joueur.";
          setMsg(`Action distante refusée : ${reason}`); setMt('error'); sendRemoteResult(req, false, reason); return;
      }
      const payload = req.payload || {};
      const cardIndex = Number(payload.cardIndex);
      if(!Number.isInteger(cardIndex) || cardIndex < 0 || cardIndex >= (players[idx]?.hand?.length || 0)) {
          sendRemoteResult(req, false, "Carte introuvable.");
          return;
      }
      if(req.action === 'discard-card') {
          processDiscard(cardIndex);
          sendRemoteResult(req, true, "Carte défaussée.");
          return;
      }
      if(req.action === 'play-card') {
          const card = players[idx].hand[cardIndex];
          const play = getPlayability(card, players[idx], false);
          if(!play.ok) {
              setMsg(play.reason); setMt("error"); tflash("error", play.reason); AudioSys.error();
              sendRemoteResult(req, false, play.reason);
              return;
          }
          if(card?.type === 'attack' || card?.type === 'action') {
              if(card.isZone || card.isChaos) {
                  processPlay(cardIndex, false, idx, false);
                  sendRemoteResult(req, true, "Carte jouée.");
                  return;
              }
              // Vol nécessite un choix de carte sur l'écran hôte : impossible de le compléter
              // à distance en une seule requête — refus explicite au lieu d'un ack trompeur.
              if(card.value === 'vol') {
                  const reason = "Vol : sélectionnez la carte à voler directement sur l'écran de la table.";
                  setMsg(reason); setMt('error');
                  sendRemoteResult(req, false, reason);
                  return;
              }
              const targetKind = payload.targetKind;
              const targetIndex = payload.targetIndex;
              if(targetKind === 'ai') processPlay(cardIndex, true, null, false);
              else if(Number.isInteger(Number(targetIndex))) processPlay(cardIndex, false, Number(targetIndex), false);
              else { const reason='Choisissez une cible.'; setMsg(reason); setMt('error'); sendRemoteResult(req, false, reason); return; }
          } else {
              processPlay(cardIndex, false, idx, false);
          }
          sendRemoteResult(req, true, "Carte jouée.");
      }
  };

  useEffect(() => {
      if(!networkServer || typeof networkServer.drainMobileActions !== 'function') return;
      const t = setInterval(() => {
          let actions = [];
          try { actions = networkServer.drainMobileActions() || []; } catch(e) { console.warn('[net:drain-mobile]', e?.message || e); }
          try {
              if(typeof networkServer.drainRemoteActions === 'function') {
                  actions = actions.concat(networkServer.drainRemoteActions() || []);
              }
          } catch(e) { console.warn('[net:drain-remote]', e?.message || e); }
          // CONF-10: dédup par playerId dans le même cycle de drain — évite double-action
          // si deux requêtes identiques arrivent dans la même fenêtre de 350 ms.
          const _seenPlayers = new Set();
          actions.forEach(req => {
              if(req?.playerId && _seenPlayers.has(req.playerId)) {
                  console.warn('[net:drain] doublon ignoré pour', req.playerId, req.action);
                  return;
              }
              if(req?.playerId) _seenPlayers.add(req.playerId);
              handleNetworkAction(req);
          });
      }, 350);
      return () => clearInterval(t);
  }, [networkServer, turn, players, ai, eventData, pass, over, isAITurn, playerIds.join('|')]);

  const FM={
    error:  {bg:"rgba(127,0,0,.7)", c:"#fca5a5",br:"#ef4444"}, attack: {bg:"rgba(100,0,0,.6)", c:"#fca5a5",br:"#ef4444"},
    remedy: {bg:"rgba(0,40,120,.6)",c:"#93c5fd",br:"#3b82f6"}, distance:{bg:"rgba(0,70,35,.6)",c:"#86efac",br:"#22c55e"},
    botte:  {bg:"rgba(90,50,0,.6)", c:"#fcd34d",br:"#f59e0b"}, cf:     {bg:"rgba(234,179,8,.8)",c:"#fff",br:"#fbbf24",isCF:true},
    info:   {bg:"rgba(4,8,20,.92)", c:"#cbd5e1",br:"rgba(255,255,255,.06)"}, success:{bg:"rgba(0,55,25,.7)", c:"#6ee7b7",br:"#22c55e"},
    ai:     {bg:"rgba(90,0,0,.5)",  c:"#fca5a5",br:"#ef4444"},
  };
  const baseMs=FM[mt]||FM.info;
  const ms={
    ...baseMs,
    bg:baseMs.isCF
      ? baseMs.bg
      : `linear-gradient(135deg, ${T.a1}38, ${baseMs.bg}), radial-gradient(circle at 20% 0%, ${T.a2}22, transparent 55%)`,
    br:mt==="error"||mt==="attack"?baseMs.br:T.a1,
    shadow:`0 5px 18px ${T.a1}30, 0 0 22px rgba(0,0,0,0.45)`
  };

  if(over)return <Win winnerIsAI={over.w} players={players} aiPlayer={ai} diff={diff} turns={turns} onReplay={start} onMenu={onBack} theme={theme} setScores={setScores} meta={meta} targetKm={targetKm}/>;

  return(
    <div id="app-scaler" className={`${layoutMode==="v2"?"layout-v2":""} player-count-${Math.min(allPP.length,7)}${cfg?.networkHost ? ' network-host-table' : ''}`} style={{'--font-scale': zoom, fontFamily:T.font, width:'100%', height:'100%', display:'flex', flexDirection:'column', overflow:'hidden', minWidth:0, minHeight:0}}>
      <DynamicBG theme={theme} inGame={true} activeEvent={!!eventData} moving={isMoving} />
      <div className="scan"/>
      <Pts color={T.particle} count={10}/>
      <MuteBtn />
      {uiTip && (
        <div className="wide-tooltip" style={{left:uiTip.x, top:uiTip.y, transform:uiTip.below?'translate(-50%, 8px)':'translate(-50%, calc(-100% - 10px))'}}>
          <div className="wide-tooltip-title">{uiTip.title}</div>
          <div className="wide-tooltip-body">{uiTip.body}</div>
        </div>
      )}

      {eventData && eventData.isShop && (() => {
          // Determine le joueur courant selon la shopQueue (P2 fix multi-joueurs)
          const shopKey = (shopQueue && shopQueueIndex < shopQueue.length) ? shopQueue[shopQueueIndex] : turn;
          const isShopAI = shopKey === "ai";
          const shopPlayer = isShopAI ? ai : (players[shopKey] || null);
          if(!shopPlayer) return null;
          return <ShopScreen
              eventData={eventData}
              onAction={handleShopAction}
              theme={theme}
              player={shopPlayer}
              isAI={isShopAI}
              queueInfo={shopQueue ? { current: shopQueueIndex+1, total: shopQueue.length, playerName: shopPlayer.name } : null}
          />;
      })()}
      {eventData && eventData.interactive && !eventData.isShop && <InteractiveEventScreen eventData={eventData} onTrade={handleInteractiveTrade} theme={theme} player={turn==="ai"?ai:players[turn]} isAI={turn==="ai"} />}
      {eventData && !eventData.interactive && !eventData.isShop && <EventScreen eventData={eventData} onDone={()=>setEventData(null)} theme={theme} />}
      {stealPrompt && (
        <StealChoiceScreen
          theme={theme}
          targetName={stealPrompt.targetName}
          targetHand={stealPrompt.targetHand}
          onCancel={()=>{setStealPrompt(null); setMsg("Vol annulé"); setMt("info");}}
          onChoose={(idx)=>{const p=stealPrompt; setStealPrompt(null); processPlay(p.ci, p.targetIsAI, p.targetIdx, p.isFromInv, idx);}}
        />
      )}

      {flash&&!cardFx&&!eventData&&!pass&&<div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:'var(--z-flash)',display:"flex",alignItems:"center",justifyContent:"center"}}>
        <div style={FM[flash.type]?.isCF ? {background:"linear-gradient(45deg, #ef4444, #f59e0b, #eab308, #3b82f6, #8b5cf6)", animation:"rainbow 2s linear infinite, pop .4s cubic-bezier(0.175, 0.885, 0.32, 1.275) both", borderRadius:20, padding:"20px 40px", fontSize:32, fontWeight:900, color:"#fff", border:"4px solid #fff", textShadow:"0 4px 20px rgba(0,0,0,0.5)"} : {background:FM[flash.type]?.bg,border:`2px solid ${FM[flash.type]?.br}44`,borderRadius:20,padding:"16px 32px",fontSize:20,fontWeight:900,color:FM[flash.type]?.c,animation:"pop .3s both"}}>{flash.msg}</div>
      </div>}
      
      {pass&&passD&&(()=>{
        try{
          const idx=passD.idx,pList=passD.ps||players;
          const p=idx==="ai"?{...(passD.a||ai||{}),name:"IA",colorIdx:nh}:(typeof idx==="number"&&pList[idx])?pList[idx]:null;
          if(!p||typeof p.km==="undefined")return null;
          return <PassScreen player={p} onReady={confPass} theme={theme} meta={meta}/>;
        }catch{return null;}
      })()}
      
      {showExitConfirm && (
          <ExitConfirm
              onContinue={()=>setShowExitConfirm(false)}
              onQuit={()=>{ setShowExitConfirm(false); onBack(); }}
              theme={theme}
          />
      )}

      {/* ─── STATUS TOAST (P1+P4 fix 2026-05-18) ──────────────────
          Toast flottant haut-centre. Masque automatiquement si :
          - une modale event/pass/win est active (pas de doublon)
          - un flash banner est en cours (le flash a la priorite visuelle)
          - le message est identique au contenu du flash (P4 anti-doublon strict) */}
      {(isAITurn || (msg && msg.trim().length > 0))
        && !eventData && !pass && !over
        && !cardFx
        && !(flash && flash.msg === msg)
        && (
          <div key={`statustoast-${(msg||'').slice(0,40)}-${mt}-${isAITurn?'1':'0'}`}
               style={{position:'absolute', top:'calc(var(--topbar-h) + 8px)', left:'50%', transform:'translateX(-50%)', zIndex:'var(--z-status-toast)', pointerEvents:'none'}}>
              <div className="status-toast" title={isAITurn ? "L'IA réfléchit..." : (msg || '')}
                   style={{background:ms.bg,border:`1px solid ${ms.br}`,borderRadius:99,padding:'2px calc(10px * var(--ui-scale))',fontSize:"var(--f-xs)",fontWeight:700,color:ms.c,display:"inline-flex",alignItems:"center",justifyContent:"center",gap:'calc(4px * var(--ui-scale))', backdropFilter:"blur(8px)", minHeight:'calc(20px * var(--ui-scale))', maxWidth:'calc(260px * var(--ui-scale))', animation:'pop .3s cubic-bezier(0.175, 0.885, 0.32, 1.275) both', boxShadow:ms.shadow, letterSpacing:'0.3px', lineHeight:1.05, pointerEvents:'auto'}}>
                  {isAITurn
                      ? <><span style={{display:"inline-block",animation:"spn 1s linear infinite",fontSize:'calc(10px * var(--ui-scale))'}}>⚙️</span><span>L'IA joue</span></>
                      : <><span style={{fontSize:'calc(11px * var(--ui-scale))',flexShrink:0}}>{mt==='error'?'⚠':mt==='cf'?'💥':mt==='attack'?'⚔':mt==='botte'?'✨':mt==='distance'?'🛣':mt==='remedy'?'🩺':mt==='success'?'✓':mt==='ai'?'🤖':'ℹ'}</span><span style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{msg}</span></>}
              </div>
          </div>
      )}

      {/* ─── CARD FX OVERLAY (Mission 4) ──────────────────────
          Visualisation de chaque carte jouee au centre de l'ecran (carte, halo, badge effet, chip cible).
          pointer-events:none : aucun impact sur drag/drop/clic. */}
      {cardFx && !eventData && !pass && !over && (
          <div className="card-fx-overlay">
              <div className={`card-fx-card${cardFx.leaving ? ' leaving' : ''}`}>
                  <div className="card-fx-halo" style={{color: cardFx.halo}} />
                  {cardFx.targetLabel && <div className="card-fx-target">▼ {cardFx.targetLabel}</div>}
                  <Card card={cardFx.card} selected={true} onClick={()=>{}} />
                  <div className="card-fx-badge" style={{background:`linear-gradient(135deg, ${cardFx.halo}cc, ${cardFx.halo}88)`, color:'#fff', border:`1px solid ${cardFx.halo}`}}>
                      {cardFx.summary}
                  </div>
              </div>
          </div>
      )}

      {/* TOP BAR
          Refonte 2026-05 : chip central log IA pendant le tour de l'adversaire (inspire ref) */}
      <div style={{display:"flex",alignItems:"center",gap:'var(--sp-md)',padding:'calc(var(--sp-md) + 2px) var(--sp-xl) var(--sp-md)',borderBottom:"1px solid rgba(255,255,255,.06)",background:"rgba(2,4,12,.86)",backdropFilter:"blur(10px)",flexShrink:0,zIndex:10, minHeight:'calc(var(--topbar-h) + 16px)', position:'relative', overflowY:'visible', boxShadow:`0 8px 28px ${T.a1}12`}}>
        {/* [Lot VISUEL 2026-06-02 — fix overlap titre] Le chip ".topbar-central-log" était
            position:absolute centré dans la top-bar (left/top:50%) et recouvrait .top-bar-title
            (titre/thème) à CHAQUE tour IA + messages "L'IA joue", "Perd X% carburant"…
            Supprimé : l'état IA reste signalé par le status-toast SOUS la barre (ne chevauche
            pas le titre) et par le flash banner central à chaque action. Titre stable. */}
        <div style={{width: 'calc(40px * var(--ui-scale))'}}></div>
        <button className="bg" onClick={() => {AudioSys.click(); setShowExitConfirm(true);}} title="Quitter la partie (Echap)" style={{background:"rgba(4,8,20,.88)",border:"1px solid rgba(255,255,255,.12)",borderRadius:'var(--rad-sm)',color:"#e2e8f0",cursor:"pointer",fontSize:"var(--f-lg)",fontWeight:800,padding:'var(--sp-sm) var(--sp-lg)'}}>Menu</button>
        <button className="bg" onClick={() => {AudioSys.click(); (openSettings||(()=>{}))();}} title="Réglages (zoom UI, audio)" style={{background:"rgba(4,8,20,.88)",border:"1px solid rgba(255,255,255,.12)",borderRadius:'var(--rad-sm)',color:"#e2e8f0",cursor:"pointer",fontSize:"var(--f-lg)",fontWeight:800,padding:'var(--sp-sm) var(--sp-lg)'}}>⚙️ Réglages</button>
        <div className="top-bar-title" style={{display:"flex",alignItems:"center",gap:'var(--sp-sm)',flex:1,justifyContent:"center"}}>
          <span style={{fontSize:'var(--f-xl)'}}>{meta?.icon||"🚗"}</span>
          <span className="neon" style={{fontSize:"var(--f-xl)",fontWeight:900,color:T.a1,letterSpacing:4}}>{meta?.title||"Mille Bornes"}</span>
        </div>
        {/* Cluster ressources : Tour · Joueur · Pieces · Difficulte (regroupe pour eviter
            le doublon avec le panneau Stats du centre, supprime dans cette refonte). */}
        <div style={{display:"flex",gap:'var(--sp-md)',alignItems:"center"}}>
          <div style={{textAlign:"center",minWidth:'calc(54px * var(--ui-scale))'}}>
            <div style={{fontSize:"var(--f-xs)",color:"#94a3b8",fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>Tour</div>
            <div style={{fontSize:"var(--f-lg)",fontWeight:900,color:"#e2e8f0"}}>{turns+1}</div>
          </div>
          <div style={{width:1,height:'calc(28px * var(--ui-scale))',background:"rgba(255,255,255,0.12)"}}/>
          <div style={{textAlign:"center",minWidth:'calc(90px * var(--ui-scale))',overflow:"hidden"}}>
            <div style={{fontSize:"var(--f-xs)",color:"#94a3b8",fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>Joueur</div>
            <div style={{fontSize:"var(--f-md)",fontWeight:900,color:curC.main,maxWidth:'calc(160px * var(--ui-scale))',overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{curP?`${curC.emoji} ${curP.name}`:isAITurn?"IA...":""}</div>
          </div>
          <div style={{width:1,height:'calc(28px * var(--ui-scale))',background:"rgba(255,255,255,0.12)"}}/>
          <div style={{textAlign:"center",minWidth:'calc(60px * var(--ui-scale))'}} title="Vos pièces (km actuels)">
            <div style={{fontSize:"var(--f-xs)",color:"#94a3b8",fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>💰 Pièces</div>
            {/* Cle dynamique sur la valeur : remonte le node a chaque changement → declenche pop */}
            <div key={`coins-${curP?.km || 0}`} style={{fontSize:"var(--f-lg)",fontWeight:900,color:"#fbbf24",animation:'pop2 .35s cubic-bezier(.22,1,.36,1) both'}}>{curP?.km || 0}</div>
          </div>
          <div style={{width:1,height:'calc(28px * var(--ui-scale))',background:"rgba(255,255,255,0.12)"}}/>
          <div style={{textAlign:"center",minWidth:'calc(70px * var(--ui-scale))'}} title="Carburant du joueur actif">
            <div style={{fontSize:"var(--f-xs)",color:"#94a3b8",fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>⛽ Carburant</div>
            <div key={`fuel-${curP?.fuel ?? 100}`} style={{fontSize:"var(--f-lg)",fontWeight:900,color:(curP?.fuel ?? 100)<=20?"#fca5a5":"#7dd3fc",animation:'pop2 .35s cubic-bezier(.22,1,.36,1) both'}}>{curP?.fuel ?? 100}%</div>
          </div>
          <div style={{width:1,height:'calc(28px * var(--ui-scale))',background:"rgba(255,255,255,0.12)"}}/>
          <div style={{textAlign:"center",minWidth:'calc(70px * var(--ui-scale))'}} title="Difficulté de l'IA">
            <div style={{fontSize:"var(--f-xs)",color:"#94a3b8",fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>Diff</div>
            <div style={{fontSize:"var(--f-sm)",fontWeight:900,color:diff==='expert'?"#f87171":"#a78bfa"}}>{DIFFS[diff]?.emoji || ''} {DIFFS[diff]?.name || ''}</div>
          </div>
        </div>
      </div>
      
      {/* MAIN LAYOUT */}
      <div className="layout-main">
        <div className={`v2-progress-arc${isMoving ? " moving" : ""}`} aria-hidden={layoutMode!=="v2"}>
          <svg className="v2-route-svg" viewBox="0 0 1000 230" preserveAspectRatio="none">
            <defs>
              <linearGradient id="v2ArcRoad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1e293b" stopOpacity="0.98"/>
                <stop offset="42%" stopColor="#0f172a" stopOpacity="1"/>
                <stop offset="100%" stopColor="#020617" stopOpacity="0.96"/>
              </linearGradient>
              <filter id="v2RoadGlow" x="-12%" y="-40%" width="124%" height="190%">
                <feDropShadow dx="0" dy="0" stdDeviation="7" floodColor={T.a1} floodOpacity="0.55"/>
              </filter>
            </defs>
            <path className="v2-road-shoulder" d="M38 198 C230 30 770 30 962 198"/>
            <path className="v2-road-band" d="M38 198 C230 30 770 30 962 198"/>
            <path className="v2-road-lane" d="M72 196 C250 58 750 58 928 196"/>
            <text className="v2-road-start" x="46" y="210">0</text>
            <text className="v2-road-finish" x="946" y="210">🏁</text>
            {eventMilestones.map((m) => {
                const pt = getV2RoadPoint(m / targetKm);
                return (
                  <g key={`v2-event-${m}`} className="v2-road-event" transform={`translate(${pt.x},${pt.y + 26})`}>
                    <circle r="12"/>
                    <text x="0" y="5" textAnchor="middle">🏪</text>
                  </g>
                );
            })}
            {v2RoadPlayers.map(({p,i,isAI,x,y,pct}) => {
                const col = PC[p.colorIdx||(isAI?nh:i)||0];
                const vData = VEHICLES.find(v=>v.id===p.vid);
                return (
                  <g key={`v2-road-${isAI?'ai':i}`} className="v2-road-car" transform={`translate(${x},${y})`}>
                    <circle r="18" fill={col.main} opacity="0.2"/>
                    <text x="0" y="7" textAnchor="middle">{vData?.icon || col.emoji}</text>
                    <text className="v2-road-distance" x="0" y="34" textAnchor="middle">{Math.round(pct*100)}%</text>
                  </g>
                );
            })}
          </svg>
        </div>
        {/* LEFT PANEL : PLAYERS & LOGS */}
        <div className="layout-left">
          <div className="layout-players">
              {allPP.length>0 && <div style={{fontSize:"var(--f-sm)",color:"#cbd5e1",fontWeight:700,textTransform:"uppercase",letterSpacing:3,marginBottom:4, width:"100%"}}>Joueurs ({allPP.length})</div>}
              {allPP.map(({p,i,isAI}, slotIdx)=>{
                const col=PC[p.colorIdx||(isAI?nh:i)||0];
                const isAct=turn===i,pct=Math.min(100,(p.km/targetKm)*100),hot=p.km>=targetKm*.8;
                const isTargeted = (draggedCard?.card?.type === "attack" || draggedCard?.card?.type === "action") && !isAct;
                const isShaking = shakeIdx === (isAI ? "ai" : i);
                const vData = VEHICLES.find(v=>v.id===p.vid);
                const v2Slot = layoutMode==="v2" ? getV2PlayerSlot(allPP.length, slotIdx) : null;
                
                return(
                  <div key={isAI?"ai":i}
                    className={`bg ${layoutMode==="v2" ? "v2-player-card" : ""} ${isAct ? "player-active-neon" : ""} ${isTargeted ? "drag-over-attack" : ""}`}
                    onMouseEnter={(e)=>showWideTip(e, isAI ? "IA" : p.name, buildPlayerTooltip(p, vData))}
                    onMouseLeave={hideWideTip}
                    onDragOver={(e) => { if(isTargeted) e.preventDefault(); }}
                    onDrop={(e) => handleDropOnOpponent(e, isAI, i)}
                    style={{color:col.main,background:isAct?`linear-gradient(135deg,${col.main}22,${col.dark}11)`:"rgba(0,0,0,0.4)",borderRadius:'var(--rad-md)',padding:'var(--sp-md)',border:`${isAct?2:1}px solid ${isAct?col.main+"99":"rgba(255,255,255,.06)"}`,boxShadow:isAct?`0 0 28px ${col.glow}44`:"0 4px 10px rgba(0,0,0,0.5)",transition:"all .4s",position:"relative",overflow:"hidden", flexShrink:0, ...(v2Slot ? {'--v2-player-left':`${v2Slot.x}%`,'--v2-player-top':`${v2Slot.y}%`,'--v2-player-rot':`${v2Slot.r}deg`,'--v2-player-scale':v2Slot.s,'--v2-player-width':`calc(${v2Slot.width}px * var(--ui-scale))`} : {})}}>
                    <div style={{display:"flex",alignItems:"center",gap:'var(--sp-sm)',marginBottom:'var(--sp-sm)'}}>
                      <div style={{width:'calc(36px * var(--ui-scale))',height:'calc(36px * var(--ui-scale))',borderRadius:'var(--rad-sm)',flexShrink:0,background:`linear-gradient(135deg,${col.main},${col.dark})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:'var(--f-lg)',boxShadow:isAct?`0 0 20px ${col.glow}`:`0 4px 12px ${col.glow}44`}}>{vData?.icon||col.emoji}</div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:2}}>
                          <span style={{fontSize:isAct?"var(--f-md)":"var(--f-sm)",fontWeight:900,color:isAct?"#fff":col.main,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{isAI?"IA":p.name}</span>
                        </div>
                        <div style={{fontSize:"var(--f-xs)",color:"#94a3b8", display:"flex", gap:4, whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{vData?.name} {p.tank_shield>0&&<span title="Blindage">🛡️x{p.tank_shield}</span>} {p.coupsFourres>0&&<span style={{color:"#f59e0b",fontWeight:900}}>★{p.coupsFourres}</span>}</div>
                      </div>
                      <div style={{fontSize:"var(--f-lg)",fontWeight:900,color:hot?"#fbbf24":isAct?"#fff":col.main}}>{p.km} <span style={{fontSize:'var(--f-xs)', color:"#fbbf24"}}>💰</span></div>
                    </div>
                    <div className={`${isShaking ? "pbar-damage " : ""}pbar-track`} style={{position:"relative",height:'calc(12px * var(--ui-scale))',background:"#020709",borderRadius:'calc(6px * var(--ui-scale))',overflow:"hidden",border:hot?"1px solid #f59e0b44":"1px solid rgba(255,255,255,.06)",marginBottom:'var(--sp-xs)'}}>
                      <div className="pbar-fill" style={{position:"absolute",top:0,left:0,height:"100%",width:`${pct}%`,background:hot?`linear-gradient(90deg,${col.main},${col.dark},#f59e0b,#fbbf24)`:`linear-gradient(90deg,${col.main}88,${col.main},${col.dark})`,borderRadius:'calc(6px * var(--ui-scale))',transition:"width 1.1s cubic-bezier(.4,0,.2,1)"}} />
                    </div>
                    <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:p.bottes?.length>0?5:0}}>
                      {p.stopped&&!p.hazard&&<span style={{fontSize:"var(--f-xs)",padding:"2px 7px",borderRadius:7,background:"rgba(100,116,139,.15)",border:"1px solid #64748b44",color:"#94a3b8",fontWeight:700}}>Arrêté</span>}
                      {p.hazard&&<span style={{fontSize:"var(--f-xs)",padding:"2px 7px",borderRadius:7,background:"rgba(239,68,68,.12)",border:"1px solid #ef444444",color:"#fca5a5",fontWeight:700}}>{p.hazardHidden ? "🌙 Incident" : `${skin[p.hazard]?.icon || "⚠"} ${skin[p.hazard]?.label || p.hazard}`}</span>}
                      {p.speedLimit&&<span style={{fontSize:"var(--f-xs)",padding:"2px 7px",borderRadius:7,background:"rgba(251,146,60,.12)",border:"1px solid #fb923c44",color:"#fdba74",fontWeight:700}}>Max 50</span>}
                      <span style={{fontSize:"var(--f-xs)",padding:"2px 7px",borderRadius:7,background:"rgba(14,165,233,.10)",border:"1px solid #38bdf844",color:(p.fuel||100)<=20?"#fca5a5":"#7dd3fc",fontWeight:700}}>⛽ {typeof p.fuel==="number"?p.fuel:100}%</span>
                      {!p.stopped&&!p.hazard&&<span style={{fontSize:"var(--f-xs)",padding:"2px 7px",borderRadius:7,background:"rgba(74,222,128,.1)",border:"1px solid #4ade8044",color:"#86efac",fontWeight:700}}>En route</span>}
                    </div>
                    {p.bottes?.length>0&&<div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{p.bottes.map((b,bi)=><span key={bi} style={{fontSize:"var(--f-xs)",padding:"2px 7px",borderRadius:7,background:"rgba(251,191,36,.1)",border:"1px solid #fbbf2444",color:"#fbbf24",fontWeight:700}}>{b.icon}</span>)}</div>}
                  </div>
                );
              })}
          </div>
          <div className="layout-feed">
             <div style={{fontSize:"var(--f-sm)",color:"#94a3b8",fontWeight:700,textTransform:"uppercase",letterSpacing:2,marginBottom:4}}>Historique</div>
             {logs.map(l => (
                 <div key={l.id} className="log-item" style={{borderColor: l.c}}>
                    <span className="log-icon">{l.icon || (l.type==='attack'?"⚔️":l.type==='cf'?"💥":l.type==='event'?"⚡":"ℹ️")}</span>
                    <span>{l.msg}</span>
                 </div>
             ))}
             <div ref={logEndRef} />
          </div>
        </div>
        
        {/* CENTER PANEL — REFONTE 2026-05-18 :
            Pioche/Defausse (compacts, tiny) + Main IA fusionnees sur UNE seule ligne dense.
            Plus de zone vide a droite en multi (la main IA prend l'espace).
            En multi sans IA, le bandeau de droite affiche une carte d'info legere. */}
        <div className="layout-center">
          {/* Ligne haute — REFACTOR P1 2026-05-18 (rognage top corrigé) :
              - overflow-x:hidden UNIQUEMENT (au lieu de overflow:hidden) → permet aux labels
                "Pioche", "Défausse", "Joueur" de respirer sans être clippés en haut
              - padding-top de sécurité pour les libellés du dessus
              - line-height augmenté pour ne plus jamais couper la première ligne */}
          <div className="v2-table-row" style={{display:"flex",gap:'var(--sp-sm)',alignItems:"center", flexWrap:"wrap", minHeight:'calc(146px * var(--ui-scale))', minWidth:0, maxWidth:'100%', overflowX:'hidden', overflowY:'visible', paddingTop:'calc(8px * var(--ui-scale))', marginBottom:'calc(12px * var(--ui-scale))'}}>
            {/* Pioche + Defausse — taille FIXE max bornée, peut shrinker légèrement */}
            <div
              className={`v2-piles${draggedCard ? " drag-over-valid" : ""}`}
              onDragOver={(e) => { e.preventDefault(); }}
              onDrop={handleDropOnCenter}
              title="Glissez une carte ici pour la jouer sur vous-même / défausser"
              style={{background:"rgba(4,8,20,.85)",border:"1px solid rgba(255,255,255,.05)",borderRadius:'var(--rad-md)',padding:'var(--sp-sm) var(--sp-md)',display:"flex",alignItems:"center",gap:'var(--sp-md)',flexShrink:0, transition:"all 0.2s", backdropFilter:"blur(5px)", height:layoutMode==="v2"?'calc(146px * var(--ui-scale))':'calc(116px * var(--ui-scale))', alignSelf:'flex-start', minWidth:0, maxWidth:layoutMode==="v2"?'min(calc(320px * var(--ui-scale)), 100%)':'min(calc(240px * var(--ui-scale)), 100%)', boxSizing:'border-box'}}>
              {/* Colonne Pioche */}
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2, minWidth:0}}>
                <span style={{fontSize:"calc(11px * var(--ui-scale))",color:"#94a3b8",textTransform:"uppercase",letterSpacing:2,fontWeight:700,lineHeight:1.3,padding:'1px 0'}}>Pioche</span>
                <div style={{position:"relative",width:layoutMode==="v2"?'min(calc(var(--c-w) * 0.85), 90px)':'min(calc(var(--c-w) * 0.68), 74px)',height:layoutMode==="v2"?'min(calc(var(--c-h) * 0.85), 130px)':'min(calc(var(--c-h) * 0.68), 106px)'}}>
                  {deck.length>1&&<div style={{position:"absolute",top:2,left:2,width:"100%",height:"100%",borderRadius:'var(--rad-sm)',background:"linear-gradient(135deg,#12093a,#1e1668)",border:"1px solid #4338ca33"}}/>}
                  <div className={isAITurn ? '' : 'anim-deck-pulse'} style={{position:"absolute",inset:0,borderRadius:'var(--rad-sm)',background:"linear-gradient(135deg,#18107a,#2a1e90)",border:"1px solid #4338ca55",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 3px 12px #000a"}}>
                    <span style={{fontSize:"var(--f-lg)",position:"relative"}}>{meta?.dk||"🚗"}</span>
                  </div>
                </div>
                <span style={{fontSize:"calc(11px * var(--ui-scale))",color:"#cbd5e1",fontWeight:700,lineHeight:1}}>{deck.length}</span>
              </div>
              {/* Séparateur ⇄ */}
              <div style={{color:"#94a3b8",fontSize:'var(--f-md)', flexShrink:0}}>⇄</div>
              {/* Colonne Défausse */}
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2, minWidth:0}}>
                <span style={{fontSize:"calc(11px * var(--ui-scale))",color:"#94a3b8",textTransform:"uppercase",letterSpacing:2,fontWeight:700,lineHeight:1.3,padding:'1px 0'}}>Défausse</span>
                {topDisc
                    ? <div style={{width:layoutMode==="v2"?'min(calc(var(--c-w) * 0.85), 90px)':'min(calc(var(--c-w) * 0.68), 74px)', height:layoutMode==="v2"?'min(calc(var(--c-h) * 0.85), 130px)':'min(calc(var(--c-h) * 0.68), 106px)', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', borderRadius:'var(--rad-sm)'}}>
                          {/* Card scaled visuellement pour respecter la zone bornée */}
                          <div style={{transform:layoutMode==="v2"?'scale(0.70)':'scale(0.50)', transformOrigin:'center'}}>
                              <Card card={topDisc} selected={false} onClick={()=>{}}/>
                          </div>
                      </div>
                    : <div style={{width:layoutMode==="v2"?'min(calc(var(--c-w) * 0.85), 90px)':'min(calc(var(--c-w) * 0.68), 74px)',height:layoutMode==="v2"?'min(calc(var(--c-h) * 0.85), 130px)':'min(calc(var(--c-h) * 0.68), 106px)',borderRadius:'var(--rad-sm)',border:"1px dashed rgba(255,255,255,.06)",display:"flex",alignItems:"center",justifyContent:"center",color:"rgba(255,255,255,.1)",fontSize:'var(--f-lg)'}}>🂠</div>}
                <span style={{fontSize:"calc(11px * var(--ui-scale))",color:"#cbd5e1",fontWeight:700,lineHeight:1}}>{disc.length}</span>
              </div>
            </div>

            {/* Bandeau Main IA — fusionne sur la meme ligne, hauteur fixe alignee avec Pioche/Def. */}
            {cfg.isSolo&&cfg.hasAI&&ai&&(
              <div className="v2-ai-strip" style={{background:"rgba(4,8,20,.7)",border:`1px solid ${T.a1}33`,borderRadius:'var(--rad-md)',padding:'calc(3px * var(--ui-scale)) var(--sp-sm)', backdropFilter:"blur(5px)", display:'flex', alignItems:'center', gap:'var(--sp-sm)', flex:'1 1 auto', minWidth:0, position:'relative', height:'calc(94px * var(--ui-scale))', alignSelf:'flex-start'}}>
                <div style={{display:"flex",flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'1px',minWidth:'calc(64px * var(--ui-scale))',flexShrink:0,borderRight:`1px solid ${T.a1}22`,paddingRight:'var(--sp-sm)'}}>
                    <div style={{fontSize:"var(--f-md)",lineHeight:1}}>{meta?.aiIcon||"🤖"}</div>
                    <div style={{fontSize:"calc(9px * var(--ui-scale))",color:"#94a3b8",fontWeight:700,textTransform:"uppercase",letterSpacing:1,lineHeight:1}}>IA</div>
                    <div style={{fontSize:'calc(9px * var(--ui-scale))',color:'#64748b',fontWeight:600,lineHeight:1}}>{ai.hand?.length||0} crt</div>
                </div>
                {isAITurn && (
                  <div title="L'IA réfléchit..."
                       style={{position:'absolute', top:'calc(3px * var(--ui-scale))', right:'calc(6px * var(--ui-scale))', zIndex:2, background:`linear-gradient(135deg, ${T.a1}33, ${T.a1}1a)`, border:`1px solid ${T.a1}66`, color:T.a1, fontSize:'calc(10px * var(--ui-scale))', fontWeight:800, padding:'1px calc(7px * var(--ui-scale))', borderRadius:99, animation:'pls .9s ease-in-out infinite', letterSpacing:1, display:'inline-flex', alignItems:'center', gap:'3px', lineHeight:1.1}}>
                      <span style={{display:'inline-block', animation:'spn 1s linear infinite', fontSize:'calc(9px * var(--ui-scale))'}}>⚙️</span>
                      <span>réfléchit</span>
                  </div>
                )}
                <div className="hand-stack-ia" style={{minHeight:'calc(52px * var(--ui-scale))', maxHeight:'calc(80px * var(--ui-scale))', overflowY:'auto', overflowX:'hidden', flex:1, padding:0, minWidth:0}}>
                  {ai.hand.map((c,i)=>{const lk=aip==="looking"&&ail===i,ch=aip==="chosen"&&aic===i;return <Card key={`${c.uid}-${i}`} card={c} faceDown={!lk&&!ch} tiny={true} highlight={lk} reveal={ch} selected={false} onClick={()=>{}} delay={i*40}/>;})}
                </div>
              </div>
            )}

            {/* En multi-humain (pas d'IA), occupe l'espace vide a droite avec un mini-rappel astuce
                (le tooltip pleine largeur sera supprime de la zone main pour gagner en hauteur). */}
            {!(cfg.isSolo&&cfg.hasAI&&ai) && (
              <div className="v2-tip-strip" style={{background:"rgba(4,8,20,.55)",border:"1px solid rgba(255,255,255,0.05)",borderRadius:'var(--rad-md)',padding:'var(--sp-xs) var(--sp-md)', backdropFilter:"blur(5px)", display:'flex', alignItems:'center', gap:'var(--sp-sm)', flex:'1 1 auto', minWidth:0, height:'calc(94px * var(--ui-scale))', alignSelf:'flex-start'}}>
                  <span style={{fontSize:'var(--f-md)', flexShrink:0}}>💡</span>
                  <span style={{fontSize:'var(--f-sm)', color:'#cbd5e1', lineHeight:1.35, overflow:'hidden', textOverflow:'ellipsis'}}>
                      {hoveredCard ? getCardDesc(hoveredCard) : "Survolez une carte pour voir ses effets. Glissez-la au centre ou sur un adversaire."}
                  </span>
              </div>
            )}
          </div>

          {typeof turn==="number"&&curP&&(
            <div className="v2-hand-panel" style={{background:"rgba(4,8,20,.9)",border:`2px solid ${curC.main}55`,borderRadius:'var(--rad-lg)',padding:'var(--sp-xs) var(--panel-pad)',boxShadow:`0 0 24px ${curC.glow}22`, transition:"opacity 0.3s", opacity: (isAITurn||eventData) ? 0.6 : 1, backdropFilter:"blur(10px)", display:"flex", flexDirection:"column", flex:1}}>

              {/* Tooltip d'astuce : SOLO uniquement (en multi il a deja ete deplace dans la ligne du haut).
                  Reduit en compact pour ne pas pousser la main vers le bas. */}
              {(cfg.isSolo && cfg.hasAI) && (
                  <div className="tooltip-box" style={{minHeight:'auto',padding:'var(--sp-sm) var(--sp-md)',fontSize:'var(--f-md)',lineHeight:1.4,marginBottom:'var(--sp-xs)'}}>
                    {hoveredCard
                        ? <span>{getCardDesc(hoveredCard)}</span>
                        : <span style={{color:'#94a3b8'}}>💡 <b>Astuce :</b> survolez une carte pour ses effets · glissez au centre ou sur un adversaire.</span>}
                  </div>
              )}

              {/* Zone main P2 : hauteur reduite (150→112), max-height calibre pour 10 cartes wrap.
                  marges 0, padding minimal, drag-drop preserve via flex-stack natif. */}
              <div className={`hand-stack v2-tray-${layoutMode==="v2" ? v2Tray : "hand"}`} style={{marginTop:0,marginBottom:0,minHeight:'calc(112px * var(--ui-scale))', maxHeight:'calc(240px * var(--ui-scale))', overflowY:'auto', overflowX:'hidden', flex:'1 1 auto', padding:'var(--sp-xs)'}}>
                {curPrivateHandHidden && (
                  <div style={{width:'100%',display:'grid',gap:'var(--sp-sm)',justifyItems:'center',alignContent:'center',minHeight:'calc(106px * var(--ui-scale))',color:'#bae6fd',textAlign:'center'}}>
                    <div style={{fontSize:'var(--f-lg)',fontWeight:900}}>{hostTableMode ? '🖥 Table hôte publique' : '📱 Main privée sur téléphone'}</div>
                    <div style={{fontSize:'var(--f-sm)',color:'#94a3b8'}}>
                      {hostTableMode
                        ? 'Les mains privées ne sont pas révélées sur l’écran principal d’hébergement.'
                        : 'Cette main est masquée sur l’écran principal. Le joueur joue depuis son second écran.'}
                    </div>
                    <div style={{display:'flex',gap:'calc(5px * var(--ui-scale))',justifyContent:'center',flexWrap:'wrap'}}>
                      {curP.hand.map((card,i)=><Card key={`phone-mask-${card.uid}-${i}`} card={card} faceDown={true} tiny={true} selected={false} onClick={()=>{}} />)}
                    </div>
                  </div>
                )}
                {!curPrivateHandHidden && layoutMode==="v2" && v2Tray==="bag" && (
                  curP.inventory.length === 0 ? (
                    <div className="v2-tray-empty">
                      <div style={{fontSize:'calc(32px * var(--ui-scale))'}}>🎒</div>
                      <b>Sac vide</b>
                      <span>Les cartes achetées en boutique apparaîtront ici.</span>
                    </div>
                  ) : curP.inventory.map((card,i)=>{
                    const play=canPlayCard(card,true);
                    return (
                    <div key={`inv-tray-${card.uid}-${i}`} style={{position:"relative"}}>
                      <Card card={card}
                        selected={selInv===i}
                        disabled={!play.ok}
                        disabledReason={play.reason}
                        delay={i*40}
                        onHover={setHoveredCard}
                        onClick={()=>{ if(isAITurn||eventData) return; if(!play.ok){setMsg(play.reason);setMt("error");tflash("error",play.reason);AudioSys.error();return;} setSelInv(selInv===i?null:i); setSelHand(null); }}
                        onDragStart={(e) => handleDragStart(e, i, card, true)}
                        onDragEnd={handleDragEnd}
                      />
                      {selInv===i&&<div style={{position:"absolute",top:-6,right:-6,width:22,height:22,borderRadius:"50%",background:`linear-gradient(135deg,${T.a1},${T.a2})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:900,color:"#fff",animation:"pop .2s both"}}>✓</div>}
                    </div>
                  );})
                )}
                {!curPrivateHandHidden && !(layoutMode==="v2" && v2Tray==="bag") && curP.hand.map((card,i)=>{
                  const play=canPlayCard(card,false);
                  return (
                  <div key={`${card.uid}-${i}`} style={{position:"relative"}}>
                    <Card card={card} 
                      selected={selHand===i} 
                      disabled={!play.ok}
                      disabledReason={play.reason}
                      delay={i*40} 
                      onHover={setHoveredCard}
                      onClick={()=>{ if(isAITurn||eventData) return; if(!play.ok){setMsg(play.reason);setMt("error");tflash("error",play.reason);AudioSys.error();return;} setSelHand(selHand===i?null:i); setSelInv(null); }}
                      onDragStart={(e) => handleDragStart(e, i, card, false)}
                      onDragEnd={handleDragEnd}
                    />
                    {selHand===i&&<div style={{position:"absolute",top:-6,right:-6,width:22,height:22,borderRadius:"50%",background:`linear-gradient(135deg,${T.a1},${T.a2})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:900,color:"#fff",animation:"pop .2s both"}}>✓</div>}
                  </div>
                );})}
              </div>

              {/* V2 : le sac devient un controle de transition Main/Sac. En layout classique,
                  on garde le panneau inventaire complet pour préserver l'ergonomie existante. */}
              {layoutMode==="v2" ? (
                <div className="inventory-zone v2-tray-switch">
                  <button className={`v2-tray-tab${v2Tray==="hand" ? " active" : ""}`} onClick={()=>{setV2Tray("hand");setSelInv(null);}} type="button">
                    <span>🃏</span><b>Main</b><em>{curP.hand.length}</em>
                  </button>
                  <button className={`v2-tray-tab${v2Tray==="bag" ? " active" : ""}`} onClick={()=>{setV2Tray("bag");setSelHand(null);}} type="button">
                    <span>🎒</span><b>Sac</b><em>{curP.inventory.length}</em>
                  </button>
                </div>
              ) : (
                <div className={`inventory-zone${curP.inventory.length===0?' empty':''}`}>
                  <div style={{display:"flex", flexDirection:"column", alignItems:"center", gap:4, flexShrink:0}}>
                      <div style={{fontSize:'calc(22px * var(--ui-scale))'}}>🎒</div>
                      <div style={{fontSize:'var(--f-xs)', fontWeight:900, color:"#fbbf24", letterSpacing:2}}>SAC</div>
                      <div style={{fontSize:'var(--f-xs)', color:'#94a3b8'}}>{curP.inventory.length}</div>
                  </div>
                  {curP.inventory.length === 0 ? (
                      <div style={{flex:1, color:'#64748b', fontSize:'var(--f-sm)', fontStyle:'italic', textAlign:'center'}}>
                          Vide — les cartes achetées en boutique apparaîtront ici.
                      </div>
                  ) : (
                      <div style={{display:"flex", gap:10, flexWrap:"wrap", flex:1}}>
                          {curP.inventory.map((card,i)=>{
                              const play=canPlayCard(card,true);
                              return (
                              <div key={`inv-${card.uid}-${i}`} style={{position:"relative"}}>
                                  <Card card={card} tiny={true}
                                      selected={selInv===i}
                                      disabled={!play.ok}
                                      disabledReason={play.reason}
                                      onHover={setHoveredCard}
                                      onClick={()=>{ if(isAITurn||eventData) return; if(!play.ok){setMsg(play.reason);setMt("error");tflash("error",play.reason);AudioSys.error();return;} setSelInv(selInv===i?null:i); setSelHand(null); }}
                                      onDragStart={(e) => handleDragStart(e, i, card, true)}
                                      onDragEnd={handleDragEnd}
                                  />
                                  {selInv===i&&<div style={{position:"absolute",top:-4,right:-4,width:16,height:16,borderRadius:"50%",background:`linear-gradient(135deg,${T.a1},${T.a2})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:900,color:"#fff",animation:"pop .2s both"}}>✓</div>}
                              </div>
                          );})}
                      </div>
                  )}
                </div>
              )}

              <div className="v2-action-bar" style={{display:"flex",gap:'var(--sp-md)',justifyContent:"center", flexWrap:"wrap", marginTop:'var(--sp-md)'}}>
                {(curCard?.type === "attack" || curCard?.type === "action") && !cfg.isSolo && (selHand!==null || selInv!==null) && !curCard.isChaos && !curCard.isZone && (
                   <div style={{display:"flex", gap:'var(--sp-xs)', alignItems:"center", background:"rgba(239,68,68,0.1)", borderRadius:99, padding:'var(--sp-xs) var(--sp-md)'}}>
                     <span style={{fontSize:"var(--f-sm)", color:"#f87171"}}>Cibler: </span>
                     {players.map((p,i) => {
                       if(i === turn) return null;
                       const status = targetStatusForCard(curCard, p, turn);
                       return (
                       <button key={i} className="bg" disabled={!status.valid} title={status.valid ? `Cibler ${p.name}` : status.reason} onClick={() => status.valid && processPlay(isSelInv ? selInv : selHand, false, i, isSelInv)} style={{background:"#ef4444",border:"none",borderRadius:99,padding:'var(--btn-pad)',fontSize:"var(--f-md)",fontWeight:700,color:"#fff",cursor:status.valid?"pointer":"not-allowed",opacity:status.valid?1:.42,filter:status.valid?"none":"grayscale(1)"}}>{p.name}</button>
                     );})}
                     {cfg.hasAI && ai && (() => { const status = targetStatusForCard(curCard, ai, turn); return <button className="bg" disabled={!status.valid} title={status.valid ? "Cibler l'IA" : status.reason} onClick={() => status.valid && processPlay(isSelInv ? selInv : selHand, true, null, isSelInv)} style={{background:"#ef4444",border:"none",borderRadius:99,padding:'var(--btn-pad)',fontSize:"var(--f-md)",fontWeight:700,color:"#fff",cursor:status.valid?"pointer":"not-allowed",opacity:status.valid?1:.42,filter:status.valid?"none":"grayscale(1)"}}>IA</button>; })()}
                   </div>
                )}

                {(curCard?.type === "attack" || curCard?.type === "action") && cfg.isSolo && (selHand!==null || selInv!==null) && !curCard.isChaos && !curCard.isZone && (
                   (() => { const status = targetStatusForCard(curCard, ai, turn); return <button className="bg" disabled={!status.valid} title={status.valid ? "Cibler l'IA" : status.reason} onClick={()=>status.valid && processPlay(isSelInv ? selInv : selHand, true, null, isSelInv)} style={{background:`linear-gradient(135deg, #ef4444, #991b1b)`,border:"none",borderRadius:99,padding:'var(--sp-md) var(--sp-xl)',fontSize:"var(--f-md)",fontWeight:800,color:"#fff",cursor:status.valid?"pointer":"not-allowed",letterSpacing:1,opacity:status.valid?1:.42,filter:status.valid?"none":"grayscale(1)"}}>Cibler l'IA</button>; })()
                )}

                {((curCard?.type !== "attack" && curCard?.type !== "action") || curCard?.isChaos || curCard?.isZone) && (selHand!==null || selInv!==null) && (
                   <button className="bg" onClick={()=>processPlay(isSelInv ? selInv : selHand, false, turn, isSelInv)} disabled={isAITurn} style={{background:`linear-gradient(135deg,${T.a1},${T.a2})`,border:"none",borderRadius:99,padding:'var(--sp-md) var(--sp-xl)',fontSize:"var(--f-md)",fontWeight:800,color:"#fff",cursor:"pointer",letterSpacing:1}}>Appliquer</button>
                )}

                {/* Bouton DEBLOCAGE PAYE : visible si le joueur est sous malus + a 200+ pieces */}
                {canRescuePay() && (
                    <button className="bg" onClick={()=>{ AudioSys.click(); doRescuePay(); }}
                            title="Paie 200 km pour retirer toutes vos pannes et limites. Vous gardez votre tour pour jouer."
                            style={{background:'linear-gradient(135deg,#f59e0b,#b45309)',border:'2px solid #fbbf24',borderRadius:99,padding:'var(--sp-md) var(--sp-xl)',fontSize:"var(--f-md)",fontWeight:900,color:"#fff",cursor:"pointer",letterSpacing:1,boxShadow:'0 0 18px rgba(251,191,36,0.5)',animation:'pls 1.6s infinite', display:'flex', alignItems:'center', gap:'var(--sp-xs)'}}>
                        <span style={{display:'inline-block', animation:'coinSpin 2.2s linear infinite'}}>💰</span>
                        Réparer (-200 {unit})
                    </button>
                )}
                {!isSelInv && <button className="bg" onClick={()=>{processDiscard();}} disabled={isAITurn} style={{background:"rgba(15,23,42,.8)",border:"1px solid rgba(255,255,255,.08)",borderRadius:99,padding:'var(--sp-md) var(--sp-xl)',fontSize:"var(--f-md)",fontWeight:700,color:selHand!==null?"#cbd5e1":"#94a3b8",cursor:"pointer"}}>{selHand!==null ? "Défausser la carte" : "Passer (Défausse Auto)"}</button>}
              </div>
            </div>
          )}

          {layoutMode==="v2" && hoveredCard && (
            <div className="v2-card-preview"
                 style={{borderColor:`${(CD[hoveredCard.type]||CD.distance).border}88`,boxShadow:`0 18px 46px #000b, 0 0 28px ${(CD[hoveredCard.type]||CD.distance).glow}33`}}>
              <div className="v2-card-preview-icon">{hoveredCard.icon || "🎴"}</div>
              <div className="v2-card-preview-body">
                <b>{hoveredCard.label}</b>
                <span>{getCardDesc(hoveredCard)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* GLOBAL MINIMAP EN BAS
          - La route ne defile QUE lorsqu'un joueur avance (isMoving=true).
          - Les boutiques 🏪 n'apparaissent que si le leader est a moins de 150 km de l'evenement. */}
      <div className="minimap-container">
         <div className="minimap-bg-stars" />
         <div className={`minimap-road${isMoving ? ' moving' : ''}`}>
            <div className="minimap-lines" />
         </div>
         <div className="minimap-finish">🏁</div>

         {/* Positionnement en % du conteneur mini-map (pas en vw) pour rester aligne avec la route
             quelle que soit la largeur disponible et le zoom utilisateur. */}
         {eventMilestones
            .filter(m => (m - maxKm) <= 150 && (m - maxKm) >= -20)
            .map((m) => (
              <div key={`evt-${m}`} className="mystery-token" style={{left:`calc(2% + ${(m/targetKm) * 92}%)`}}>
                  🏪
                  <span className="mystery-token-label">{m}</span>
              </div>
         ))}

         {allPP.map(({p,i,isAI}) => {
             const vData = VEHICLES.find(v=>v.id===p.vid);
             const pct = Math.min(p.km, targetKm) / targetKm;
             return (
             <div key={isAI?"ai":i}
                  className={`minimap-avatar${isMoving ? ' bouncing' : ''}`}
                  style={{left: `calc(2% + ${pct * 92}%)`, zIndex: isAI ? 2 : 3}}
                  title={`${p.name} : ${p.km} ${unit}`}>
                 <span style={{filter:`drop-shadow(0 0 5px ${PC[p.colorIdx||0].main})`}}>{vData?.icon||"🚗"}</span>
             </div>
             )
         })}
      </div>
    </div>
  );
}

// ─── SYSTEME GLOBAL : RESOLUTION SIMULEE + ZOOM + AUTO-FIT ─────────────────
// Architecture :
//   - L'utilisateur choisit une RESOLUTION LOGIQUE (auto / 1080p / 4K / smartphone / TV / ...).
//   - La scene est rendue dans cette resolution LOGIQUE (peu importe l'ecran reel).
//   - autoFitScale = min(vw / sceneW, vh / sceneH) — ratio max pour que la scene tienne.
//   - userZoom    = preference manuelle (slider 0.50 -> 2.00).
//   - effectiveScale = clamp( min(userZoom, autoFit), SCALE_MIN, SCALE_MAX ).
//   - .game-scene recoit transform: scale(effectiveScale) → projection uniforme.
// Garanties :
//   - effectiveScale <= autoFit DONC la scene tient toujours dans le viewport. Aucun rognage.
//   - transform:scale uniforme sur la scene → hitboxes scaled par le navigateur, drag/drop OK.
//   - Quand l'aspect ratio de la scene differe du viewport, des bandes noires apparaissent
//     (ex: smartphone portrait sur ecran desktop) — c'est intentionnel, jamais de coupe.

const SCALE_MIN = 0.50;  // plage user "vrai ressenti de zoom"
const SCALE_MAX = 2.20;  // plafond user large pour TV / grands ecrans

// Liste etendue de profils de resolution (id, label affiche, w, h).
// id="auto" => sceneW/H = window.innerWidth/Height (la scene epouse l'ecran).
const RESOLUTIONS = [
    { id:"auto",     l:"Auto — écran réel",           cat:"auto",   w:0,    h:0 },
    // Mobile / petites resolutions
    { id:"phsmp",    l:"Smartphone compact 360×640",  cat:"phone",  w:360,  h:640 },
    { id:"phonep",   l:"Smartphone portrait 414×896", cat:"phone",  w:414,  h:896 },
    { id:"phonepb",  l:"Smartphone XL portrait 480×960",cat:"phone",w:480,  h:960 },
    { id:"phonel",   l:"Smartphone paysage 896×414",  cat:"phone",  w:896,  h:414 },
    { id:"phonelb",  l:"Smartphone XL paysage 960×480",cat:"phone", w:960,  h:480 },
    { id:"phipad",   l:"iPhone Mini paysage 1136×640",cat:"phone",  w:1136, h:640 },
    // Petits laptops / netbooks
    { id:"576",      l:"Netbook 1024×576",            cat:"laptop", w:1024, h:576 },
    { id:"720p",     l:"HD 1280×720",                 cat:"laptop", w:1280, h:720 },
    { id:"1366",     l:"Laptop 1366×768",             cat:"laptop", w:1366, h:768 },
    { id:"1440x900", l:"Laptop 1440×900",             cat:"laptop", w:1440, h:900 },
    { id:"1600",     l:"Laptop 1600×900",             cat:"laptop", w:1600, h:900 },
    { id:"1680",     l:"Workstation 1680×1050",       cat:"laptop", w:1680, h:1050 },
    // Desktop
    { id:"1080p",    l:"Full HD 1920×1080",           cat:"desk",   w:1920, h:1080 },
    { id:"1920x1200",l:"WUXGA 1920×1200",             cat:"desk",   w:1920, h:1200 },
    { id:"2048",     l:"QWXGA 2048×1152",             cat:"desk",   w:2048, h:1152 },
    { id:"1440p",    l:"QHD 2560×1440",               cat:"desk",   w:2560, h:1440 },
    { id:"2160p",    l:"UHD 4K 3840×2160",            cat:"desk",   w:3840, h:2160 },
    { id:"5k",       l:"5K iMac 5120×2880",           cat:"desk",   w:5120, h:2880 },
    // Ultrawide
    { id:"uw1080",   l:"Ultrawide 2560×1080",         cat:"uw",     w:2560, h:1080 },
    { id:"uw1440",   l:"Ultrawide 3440×1440",         cat:"uw",     w:3440, h:1440 },
    { id:"suw",      l:"Super Ultrawide 5120×1440",   cat:"uw",     w:5120, h:1440 },
    // Tablette
    { id:"tabp",     l:"Tablette portrait 768×1024",  cat:"tab",    w:768,  h:1024 },
    { id:"tabl",     l:"Tablette paysage 1024×768",   cat:"tab",    w:1024, h:768 },
    { id:"ipadp",    l:"iPad Pro portrait 1024×1366", cat:"tab",    w:1024, h:1366 },
    { id:"ipadl",    l:"iPad Pro paysage 1366×1024",  cat:"tab",    w:1366, h:1024 },
    // TV
    { id:"tvhd720",  l:"TV HD 1280×720",              cat:"tv",     w:1280, h:720 },
    { id:"tvhd",     l:"TV Full HD 1920×1080",        cat:"tv",     w:1920, h:1080 },
    { id:"tv4k",     l:"TV 4K 3840×2160",             cat:"tv",     w:3840, h:2160 },
    { id:"tv8k",     l:"TV 8K 7680×4320",             cat:"tv",     w:7680, h:4320 },
];

// Resout la resolution logique selon le preset (auto => taille reelle du viewport).
function resolveScene(resolutionId, vw, vh) {
    const r = RESOLUTIONS.find(x => x.id === resolutionId) || RESOLUTIONS[0];
    if (r.id === 'auto' || !r.w || !r.h) return { w: Math.max(320, vw), h: Math.max(240, vh), label: r.l };
    return { w: r.w, h: r.h, label: r.l };
}

// Calcule l'auto-fit pour qu'une scene sceneW×sceneH tienne EXACTEMENT dans vw×vh.
// IMPORTANT : on ne clampe PAS en bas pour garantir l'absence de rognage. Sur ecran extreme
// (smartphone + scene 4K p.ex.), autoFit peut tomber a 0.15-0.20 — le contenu devient
// petit mais reste 100% visible, conformement a la regle "tolerance zero au rognage".
// On clampe seulement le HAUT (SCALE_MAX) pour ne pas surcharger inutilement le GPU.
function computeAutoFit(sceneW, sceneH, vw, vh) {
    if (!sceneW || !sceneH) return 1;
    const fit = Math.min(vw / sceneW, vh / sceneH);
    // Marge anti-rognage : évite les coupes d'un ou deux pixels dues aux arrondis
    // CSS, aux barres système Electron et aux DPR fractionnaires.
    return Math.min(SCALE_MAX, fit * 0.985);
}

function App(){
  const[introState]=useState(()=>{
      try {
          const v = VEHICLES[Math.floor(Math.random() * VEHICLES.length)];
          return { vehicle: v, theme: v.theme || "bleu" };
      } catch(e) { return { vehicle: null, theme: "bleu" }; }
  });
  const[screen,setScreen]=useState("menu");
  const[theme,setTheme]=useState("bleu");
  const[diff,setDiff]=useState("normal");
  const[targetKm,setTargetKmState]=useState(()=>{
      try { return normalizeTargetKm(localStorage.getItem('mb_target_km') || 1000); } catch(e){ return 1000; }
  });
  const[cfg,setCfg]=useState(null);
  const[scores,setScores]=useState(()=>{try{
    const s=localStorage.getItem("mb831");
    if(!s)return[];
    return JSON.parse(s).slice(0,10);
  }catch{return[];}});
  const[showSc,setShowSc]=useState(false);

  // userZoom = preference manuelle, persistee. Plage etendue [SCALE_MIN, SCALE_MAX].
  const hasStoredZoomPref = (()=>{ try { return localStorage.getItem('mb_ui_scale') !== null; } catch(e){ return false; } })();
  const autoZoomAppliedRef = useRef(false);
  const[userZoom,setUserZoom]=useState(()=>{
      try {
          const s = localStorage.getItem('mb_ui_scale');
          const v = s ? parseFloat(s) : 1.0;
          if(!isNaN(v) && v>=SCALE_MIN && v<=SCALE_MAX) return v;
      } catch(e){}
      return 1.0;
  });

  // resolutionId = preference resolution simulee (id parmi RESOLUTIONS). 'auto' par defaut.
  const[resolutionId,setResolutionId]=useState(()=>{
      try {
          const s = localStorage.getItem('mb_resolution');
          if(s && RESOLUTIONS.find(r => r.id === s)) return s;
      } catch(e){}
      return 'auto';
  });
  const[gameMode,setGameModeState]=useState(()=>{
      try { return localStorage.getItem('mb_game_mode') || 'classic'; } catch(e){ return 'classic'; }
  });
  const[layoutMode,setLayoutModeState]=useState(()=>{
      try { return localStorage.getItem('mb_layout_mode') || 'classic'; } catch(e){ return 'classic'; }
  });

  // viewport reel : recalcule a chaque resize / orientationchange.
  const[viewport,setViewport]=useState(()=>({
      w: typeof window !== 'undefined' ? window.innerWidth : 1920,
      h: typeof window !== 'undefined' ? window.innerHeight : 1080,
      dpr: typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1,
  }));
  useEffect(()=>{
      let raf = 0;
      const recompute = () => {
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(()=>{
              const vv = window.visualViewport;
              const vw = vv?.width ? Math.round(vv.width) : window.innerWidth;
              const vh = vv?.height ? Math.round(vv.height) : window.innerHeight;
              setViewport({ w: vw, h: vh, dpr: window.devicePixelRatio || 1 });
          });
      };
      window.addEventListener('resize', recompute);
      window.addEventListener('orientationchange', recompute);
      window.visualViewport?.addEventListener('resize', recompute);
      window.visualViewport?.addEventListener('scroll', recompute);
      recompute();
      return () => {
          window.removeEventListener('resize', recompute);
          window.removeEventListener('orientationchange', recompute);
          window.visualViewport?.removeEventListener('resize', recompute);
          window.visualViewport?.removeEventListener('scroll', recompute);
          cancelAnimationFrame(raf);
      };
  }, []);

  // Derivation : scene logique + autoFit + effective scale.
  const sceneSize = resolveScene(resolutionId, viewport.w, viewport.h);
  const autoFitScale = computeAutoFit(sceneSize.w, sceneSize.h, viewport.w, viewport.h);
  const recommendedZoom = Math.max(SCALE_MIN, Math.min(SCALE_MAX, Number(autoFitScale.toFixed(2))));
  useEffect(()=>{
      if(hasStoredZoomPref || autoZoomAppliedRef.current) return;
      if(!Number.isFinite(recommendedZoom)) return;
      autoZoomAppliedRef.current = true;
      setUserZoom(recommendedZoom);
  }, [hasStoredZoomPref, recommendedZoom]);
  // REGLE IMPERATIVE : effectiveScale = min(userZoom, autoFit). On retient l'autoFit meme
  // s'il est tres bas (zero rognage). Un floor de securite (0.05) empeche un scale a zero.
  const effectiveScale = Math.max(0.05, Math.min(userZoom, autoFitScale));
  const autoFitClamped = userZoom > autoFitScale + 0.001;

  // Setter expose au SettingsModal : borne, persiste, ne JAMAIS depasser MAX.
  const setZoom = (v) => {
      const clamped = Math.max(SCALE_MIN, Math.min(SCALE_MAX, Number(v)||1));
      setUserZoom(clamped);
      try { localStorage.setItem('mb_ui_scale', String(clamped)); } catch(e){}
  };
  const setResolution = (id) => {
      if(!RESOLUTIONS.find(r => r.id === id)) return;
      setResolutionId(id);
      try { localStorage.setItem('mb_resolution', id); } catch(e){}
  };
  const setGameMode = (id) => {
      const next = id === 'survival_night' ? 'survival_night' : 'classic';
      setGameModeState(next);
      try { localStorage.setItem('mb_game_mode', next); } catch(e){}
  };
  const setLayoutMode = (id) => {
      const next = id === 'v2' ? 'v2' : 'classic';
      setLayoutModeState(next);
      try { localStorage.setItem('mb_layout_mode', next); } catch(e){}
  };
  const setTargetKm = (value) => {
      const next = normalizeTargetKm(value);
      setTargetKmState(next);
      try { localStorage.setItem('mb_target_km', String(next)); } catch(e){}
  };

  const[showSettings,setShowSettings]=useState(false);

  // Remplace les tooltips natifs `title` par une bulle custom plus large et lisible,
  // sans devoir modifier chaque composant legacy un par un.
  useEffect(()=>{
      let activeEl = null;
      let activeTitle = '';
      let tip = null;
      const destroy = () => {
          if(activeEl && activeTitle) activeEl.setAttribute('title', activeTitle);
          activeEl = null;
          activeTitle = '';
          if(tip) { tip.remove(); tip = null; }
      };
      const show = (e) => {
          const target = e.target?.closest?.('[title]');
          if(!target) return;
          const title = target.getAttribute('title');
          if(!title) return;
          destroy();
          activeEl = target;
          activeTitle = title;
          target.removeAttribute('title');
          const r = target.getBoundingClientRect();
          const x = Math.max(180, Math.min(window.innerWidth - 180, r.left + r.width / 2));
          const below = r.top < 190;
          const y = below ? r.bottom + 6 : Math.max(24, r.top - 8);
          tip = document.createElement('div');
          tip.className = 'wide-tooltip';
          tip.style.left = `${x}px`;
          tip.style.top = `${y}px`;
          tip.style.transform = below ? 'translate(-50%, 8px)' : 'translate(-50%, calc(-100% - 10px))';
          tip.innerHTML = `<div class="wide-tooltip-title">Info</div><div class="wide-tooltip-body"></div>`;
          tip.querySelector('.wide-tooltip-body').textContent = title;
          document.body.appendChild(tip);
      };
      document.addEventListener('mouseover', show, true);
      document.addEventListener('mouseout', destroy, true);
      document.addEventListener('keydown', destroy, true);
      return () => {
          document.removeEventListener('mouseover', show, true);
          document.removeEventListener('mouseout', destroy, true);
          document.removeEventListener('keydown', destroy, true);
          destroy();
      };
  }, []);

  // Propagation aux variables CSS globales : tout le scaling est pilote ici.
  useEffect(()=>{
      try {
          const rootStyle = document.documentElement.style;
          rootStyle.setProperty('--scene-w', `${sceneSize.w}px`);
          rootStyle.setProperty('--scene-h', `${sceneSize.h}px`);
          rootStyle.setProperty('--effective-scale', String(effectiveScale));
          rootStyle.setProperty('--app-dpr', String(viewport.dpr || 1));
          // --ui-scale reste a 1 : la scene est en pixels logiques natifs.
          rootStyle.setProperty('--ui-scale', '1');
      } catch(e){}
  }, [sceneSize.w, sceneSize.h, effectiveScale, viewport.dpr]);

  useEffect(()=>{try{localStorage.setItem("mb831",JSON.stringify(scores));}catch{}},[scores]);

  const skinKey=THEMES[theme]?.skin||"classic";
  const skin=SKINS[skinKey]||CLASSIC;
  const meta=META[theme]||{};
  const goMenu=()=>{setScreen("menu");setCfg(null);};

  // Navigation clavier globale hors partie : Echap revient/ferme, flèches parcourent
  // les contrôles visibles du menu/lobby sans voler le focus des champs de saisie.
  useEffect(()=>{
      const onKey = (e) => {
          const t = e.target;
          const tag = t && t.tagName ? t.tagName.toUpperCase() : '';
          const editing = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
          if(e.key === 'Escape' && !editing) {
              if(showSettings || showSc || screen === 'game') return;
              e.preventDefault();
              if(screen !== 'menu') { goMenu(); return; }
          }
          if(screen === 'game' || showSettings || showSc || editing) return;
          if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)) return;
          const scene = document.querySelector('.game-scene');
          if(!scene) return;
          const items = Array.from(scene.querySelectorAll('button:not(:disabled), [tabindex]:not([tabindex="-1"])'))
              .filter(el => el.offsetParent !== null);
          if(items.length === 0) return;
          e.preventDefault();
          const current = document.activeElement;
          const idx = Math.max(0, items.indexOf(current));
          const dir = (e.key === 'ArrowRight' || e.key === 'ArrowDown') ? 1 : -1;
          const next = items[(idx + dir + items.length) % items.length];
          try { next.focus({preventScroll:false}); } catch(_) { next.focus(); }
      };
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
  }, [screen, showSettings, showSc]);

  // Handle native splash fade out and AudioSys sync
  AudioSys.setTheme(theme);
  useEffect(() => {
    const ns = document.getElementById("native-splash");
    if(ns) {
      setTimeout(() => {
        ns.style.animation = "nativeFadeOut 0.4s ease-in forwards";
        setTimeout(() => ns.remove(), 450);
      }, 50);
    }
  }, []);

  try{
    // Modal de reglages : disponible partout. Recoit userZoom (preference) + resolution +
    // tout le contexte de scaling pour l'affichage des indicateurs.
    const settingsOverlay = showSettings
      ? <SettingsModal zoom={userZoom} setZoom={setZoom} onClose={()=>setShowSettings(false)}
                       autoFitScale={autoFitScale} effectiveScale={effectiveScale} autoFitClamped={autoFitClamped}
                       scaleMin={SCALE_MIN} scaleMax={SCALE_MAX}
                       resolutions={RESOLUTIONS} resolutionId={resolutionId} setResolution={setResolution}
                       sceneSize={sceneSize} viewport={viewport}
                       gameMode={gameMode} setGameMode={setGameMode}
                       layoutMode={layoutMode} setLayoutMode={setLayoutMode} />
      : null;

    // Le contenu de chaque ecran est rendu DANS la scene (.game-scene). Le menu, le jeu,
    // les lobbies, les regles : tout passe par le meme wrapper => meme cadrage, meme auto-fit.
    let content;
    if(screen==="lobby") content = <Lobby onStart={(n,names,roles,hasAI, filteredVehicles)=>{setCfg({names,roles,hasAI,isSolo:false, filteredVehicles,targetKm});setScreen("game");}} onBack={goMenu} theme={theme} meta={meta} isSolo={false}/>;
    else if(screen==="solo_lobby") content = <Lobby onStart={(n,names,roles,hasAI, filteredVehicles)=>{setCfg({names,roles,hasAI:true,isSolo:true, filteredVehicles,targetKm});setScreen("game");}} onBack={goMenu} theme={theme} meta={meta} isSolo={true}/>;
    else if(screen==="rules") content = <Rules theme={theme} setScreen={setScreen} meta={meta} />;
    else if(screen==="credits") content = <Credits theme={theme} setScreen={setScreen} />;
    else if(screen==="net_host") content = <LobbyHost onBack={goMenu} theme={theme} meta={meta} onStart={(room)=>{
      const roomPlayers = (room?.roomPlayers || []).filter(p => p && p.name);
      const names = roomPlayers.length ? roomPlayers.map(p => p.name) : (room?.localPlayerNames || ['Joueur 1']);
      const playerIds = roomPlayers.length ? roomPlayers.map((p, idx) => p.playerId || `host:${idx}`) : names.map((_, idx) => `host:${idx}`);
      const scopedVehicles = getVehiclesForTheme(theme);
      const defaultVehicle = scopedVehicles[0]?.id || "v1";
      setCfg({
        names,
        roles: names.map(() => defaultVehicle),
        hasAI: false,
        isSolo: false,
        filteredVehicles: scopedVehicles,
        targetKm,
        networkHost: true,
        networkServer: room?.server || null,
        phoneMode: !!room?.phoneMode,
        mobileUrl: room?.mobileUrl || '',
        mobilePort: room?.mobilePort || null,
        playerIds
      });
      setScreen("game");
    }}/>;
    else if(screen==="net_join") content = <LobbyJoin onBack={goMenu} theme={theme} meta={meta} onJoined={()=>{}}/>;
    else if(screen==="game" && cfg && cfg.names && cfg.names.length>0)
      content = <Game diff={diff} theme={theme} onBack={goMenu} setScores={setScores} skin={skin} meta={meta} cfg={cfg} appZoom={effectiveScale} setAppZoom={setZoom} openSettings={()=>setShowSettings(true)} settingsOpen={showSettings} closeSettings={()=>setShowSettings(false)} gameMode={gameMode} layoutMode={layoutMode} />;
    else content = (
        <Menu
          onSolo={()=>setScreen("solo_lobby")}
          onMulti={()=>setScreen("lobby")}
          theme={theme} setTheme={setTheme}
          diff={diff} setDiff={setDiff}
          targetKm={targetKm} setTargetKm={setTargetKm}
          setScreen={sc=>{if(sc==="scores")setShowSc(true);else setScreen(sc);}}
          meta={meta}
          openSettings={()=>setShowSettings(true)}
        />
    );

    // .game-viewport (clipping reel) > .game-scene (resolution logique + transform:scale)
    // Le settingsOverlay et le ScoreBoard sont rendus EN DEHORS de la scene pour rester
    // a la taille reelle du viewport (UX critique : ils doivent etre toujours lisibles
    // independamment de la resolution simulee).
    return (
      <div className="game-viewport" data-theme={theme}>
        {settingsOverlay}
        {showSc && <ScoreBoard scores={scores} setScores={setScores} theme={theme} onClose={()=>setShowSc(false)}/>}
        <div className="game-scene">
          {content}
        </div>
      </div>
    );
  }catch(e){
    return(
      <div style={{minHeight:"100vh",background:"#040b1a",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:20,padding:32}}>
        <div style={{fontSize:48}}>⚠️</div>
        <div style={{color:"#f87171",fontWeight:700,fontSize:16}}>Une erreur s'est produite</div>
        <div style={{color:"#475569",fontSize:12,maxWidth:360,textAlign:"center"}}>{e?.message||"Erreur inconnue"}</div>
        <button onClick={goMenu} style={{background:"linear-gradient(135deg,#3b82f6,#6366f1)",border:"none",borderRadius:99,padding:"12px 28px",color:"#fff",fontWeight:700,fontSize:14,cursor:"pointer"}}>Retour au menu</button>
      </div>
    );
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
});
