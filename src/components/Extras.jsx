import React,{useMemo,useRef,useState} from 'react';
import {ArrowLeft,ArrowRight,ArrowUp,ArrowDown,Check,CheckCircle2,RotateCcw,Download,Info,ChevronRight} from 'lucide-react';
import {questions} from '../content.js';
const initial=[
{id:'mortal',name:'มนุษย์ต่อสู้',desc:'ความวุ่นวายของโลกมนุษย์',zone:'ข้อมือ',accent:'#ca4552',visible:true},
{id:'path',name:'เส้นเรขาคณิต',desc:'ทางเดินสู่โลกวิญญาณ',zone:'ท่อนแขนล่าง',accent:'#a1939d',visible:true},
{id:'scale',name:'ตาชั่งวิญญาณ',desc:'การพิพากษาของเทพเจ้า',zone:'ท่อนแขนบน',accent:'#c2a171',visible:true},
{id:'anubis',name:'เทพ Anubis',desc:'ผู้พิทักษ์บนหัวไหล่',zone:'ไหล่',accent:'#f1be76',visible:true}
];
export function KnowledgeTest({progress,update}){
 const [index,setIndex]=useState(0),[answer,setAnswer]=useState(null),[score,setScore]=useState(0),[finished,setFinished]=useState(false);
 const question=questions[index];
 const options=useMemo(()=>{const raw=question.slice(1,5);const offset=(index*3+1)%4;return raw.map((_,i)=>raw[(i+offset)%4]);},[index]);
 const correctIndex=options.indexOf(question[question[5]+1]);
 const answerIsCorrect=answer===correctIndex;
 const next=()=>{
  const nextScore=score+(answerIsCorrect?1:0);
  if(index===questions.length-1){setScore(nextScore);setFinished(true);update(p=>({...p,quizHistory:[{id:Date.now().toString(36),date:new Date().toISOString(),score:nextScore,total:questions.length},...p.quizHistory].slice(0,50)}))}
  else{setScore(nextScore);setAnswer(null);setIndex(x=>x+1)}
 };
 const restart=()=>{setIndex(0);setAnswer(null);setScore(0);setFinished(false)};
 return <div className="fade-in extra-page"><div className="section-head"><div><p className="eyebrow">KNOWLEDGE CHECK / 20 QUESTIONS</p><h2>ทบทวนความเข้าใจ</h2><p className="section-desc">คำถามพื้นฐานเกี่ยวกับเส้น เข็ม แสงเงา สีทอง และความปลอดภัย</p></div></div>
 {finished?<div className="quiz-finish"><p className="micro">SESSION COMPLETED</p><div className="quiz-score">{score}<span>/ {questions.length}</span></div><h2>{score>=16?'เยี่ยมมาก!':'ทบทวนอีกนิด'}</h2><p>ตอบถูก {Math.round(score/questions.length*100)}% · บันทึกผลในสมุดฝึกแล้ว</p><button className="btn primary" onClick={restart}><RotateCcw size={16}/> ทำแบบทดสอบอีกครั้ง</button></div>:<>
 <div className="quiz-progress"><span>ข้อ {index+1} จาก {questions.length}</span><span>{Math.round(index/questions.length*100)}%</span></div><div className="meter"><span style={{width:(index/questions.length*100)+'%'}}/></div>
 <div className="quiz-body"><span className="micro">QUESTION {String(index+1).padStart(2,'0')}</span><h2>{question[0]}</h2><div className="quiz-options">{options.map((opt,i)=><button key={i} className={'quiz-option '+(answer===i?'chosen':'')+(answer!==null&&i===correctIndex?' correct':'')+(answer===i&&!answerIsCorrect?' wrong':'')} disabled={answer!==null} onClick={()=>setAnswer(i)}><span>{String.fromCharCode(65+i)}</span><strong>{opt}</strong>{answer!==null&&i===question[5]&&<CheckCircle2 size={18}/>}</button>)}</div>{answer!==null&&<div className="quiz-explained"><strong>{answerIsCorrect?'ถูกต้อง':'เฉลยที่ถูกต้อง'}</strong><p>{question[6]}</p><button className="btn primary" onClick={next}>{index===questions.length-1?'ดูผลคะแนน':'ข้อต่อไป'} <ArrowRight size={16}/></button></div>}</div></>}
 </div>
}
export function SleevePlanner(){
 const [parts,setParts]=useState(initial),[focus,setFocus]=useState('anubis'),[guide,setGuide]=useState(true);
 const ordered=parts;
 const toggle=(id)=>setParts(v=>v.map(x=>x.id===id?{...x,visible:!x.visible}:x));
 const move=(i,delta)=>{const j=i+delta;if(j<0||j>=parts.length)return;setParts(v=>{const a=[...v];[a[i],a[j]]=[a[j],a[i]];return a})};
 const exportPlan=()=>{const lines=['TATLEARN / LEFT ARM SLEEVE PLAN','',...ordered.map((p,i)=>(i+1)+'. '+p.zone+' — '+p.name+' ('+(p.visible?'แสดง':'ซ่อน')+')'),'','หมายเหตุ: เป็นผังความคิด ไม่ใช่ stencil กายวิภาคจริง'];const blob=new Blob([lines.join('\n')],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='tatlearn-left-arm-plan.txt';a.click();URL.revokeObjectURL(url)};
 return <div className="fade-in extra-page"><div className="section-head"><div><p className="eyebrow">COMPOSITION WORKSHOP</p><h2>Left Arm Sleeve Planner</h2><p className="section-desc">ทดลองเล่าเรื่องจากข้อมือขึ้นไหล่ ปรับลำดับและเลือกองค์ประกอบได้</p></div><button className="btn small quiet" onClick={exportPlan}><Download size={16}/> บันทึกแผน</button></div>
 <div className="sleeve-layout"><div className="sleeve-visual"><div className="sleeve-topline"><span>LEFT ARM / CONCEPT MAP</span><button onClick={()=>setGuide(!guide)}>{guide?'ซ่อนแกน':'แสดงแกน'}</button></div><svg viewBox="0 0 290 680" className="sleeve-svg" role="img" aria-label="แผนภาพแขนซ้ายจากข้อมือถึงหัวไหล่">
 <defs><linearGradient id="sleeve-shell" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#3a2129"/><stop offset=".4" stopColor="#130e15"/><stop offset=".72" stopColor="#212029"/><stop offset="1" stopColor="#0b0a0e"/></linearGradient><linearGradient id="sleeve-red" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#a92f41"/><stop offset="1" stopColor="#eb6570"/></linearGradient></defs>
 <path d="M85 75Q132 36 208 70L218 138Q196 204 192 281L173 391L160 484Q159 541 150 609Q120 631 102 609L97 480L90 387Q67 280 69 208Z" stroke="#65414a" strokeWidth="2" fill="url(#sleeve-shell)"/>
 {guide&&<g stroke="#bc5f6b" strokeWidth="1" opacity=".34" strokeDasharray="3 6"><path d="M144 56V622"/><path d="M75 180h138M82 320h115M93 457h78M100 560h63"/></g>}
 {parts.map((p,i)=>{if(!p.visible)return null;let y=520-i*125;return <g key={p.id} onClick={()=>setFocus(p.id)} style={{cursor:'pointer'}} opacity={focus===p.id?1:.6}>
  <circle cx="142" cy={y} r={p.id==='anubis'?44:35} stroke={p.accent} strokeWidth={focus===p.id?2.6:1} fill="none"/>
  <circle cx="142" cy={y} r={p.id==='anubis'?36:28} stroke={p.accent} strokeDasharray="3 8" opacity=".7" fill="none"/>
  {p.id==='anubis'&&<path d={'M117 '+(y+20)+'l1-37 19 18 17-25 10 25 12 13-28 16-19-3Z'} stroke={p.accent} strokeWidth="3" fill="none"/>}
  {p.id==='scale'&&<g stroke={p.accent} strokeWidth="2"><path d={'M142 '+(y-20)+'v42m-22-27h44m-44 0-12 17m12-17 12 17m20-17-12 17m12-17 12 17'}/><path d={'M106 '+(y+18)+'h25m19 0h25'} /></g>}
  {p.id==='path'&&<g stroke={p.accent} fill="none" strokeWidth="2"><path d={'M108 '+(y+17)+'L142 '+(y-25)+'l35 42Z'}/><circle cx="142" cy={y+4} r="12"/></g>}
  {p.id==='mortal'&&<g stroke={p.accent} strokeWidth="2"><path d={'M114 '+(y-15)+'l18 26 14-23 19 26m-49 0l37 0m-12-34l0 41'}/></g>}
  </g>})}
 <g fill="#a28c97" fontSize="10" fontFamily="DM Sans, sans-serif"><text x="20" y="40">SHOULDER</text><text x="20" y="646">WRIST</text></g>
 </svg><div className="sleeve-bottom">CONCEPT ONLY · NOT A REAL-SKIN TRANSFER TEMPLATE</div></div>
 <div className="sleeve-editor"><p className="micro">LAYERS & STORYTELLING</p><h3>จัดลำดับเรื่องราว</h3><p>เลื่อนองค์ประกอบเพื่อทดลองเรื่องเล่า ใช้พื้นที่ว่างคั่นระหว่างลวดลาย ไม่จำเป็นต้องใช้ทุกองค์ประกอบ</p><div className="sleeve-parts">{parts.map((p,i)=><div className={'sleeve-part '+(focus===p.id?'active':'')} key={p.id}><button className="sleeve-part-main" onClick={()=>setFocus(p.id)}><span style={{background:p.accent}}/><div><strong>{p.name}</strong><small>{p.zone} · {p.desc}</small></div></button><div className="sleeve-ops"><button title="ย้ายขึ้น" onClick={()=>move(i,-1)} disabled={i===0}><ArrowUp size={16}/></button><button title="ย้ายลง" onClick={()=>move(i,1)} disabled={i===parts.length-1}><ArrowDown size={16}/></button><button title={p.visible?'ซ่อน':'แสดง'} className={p.visible?'visible':''} onClick={()=>toggle(p.id)}>{p.visible?<Check size={15}/>:<span>+</span>}</button></div></div>)}</div><div className="callout"><Info size={17}/><span>แผนภาพนี้เป็นเครื่องมือจัดองค์ประกอบ ไม่ใช่แบบที่พร้อมวางบนผิวคน ต้องปรับตามแขนจริงกับช่างที่มีประสบการณ์</span></div></div></div>
 </div>
}
