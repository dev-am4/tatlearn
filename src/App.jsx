import React,{useEffect,useMemo,useRef,useState} from 'react';
import {
Home,BookOpen,PenLine,Sparkles,ShieldCheck,CalendarDays,ClipboardList,BarChart3,
ArrowUpRight,ArrowRight,ArrowLeft,Check,CheckCircle2,Bookmark,Search,Clock,
Target,Pause,Play,RotateCcw,Download,Upload,Trash2,ChevronRight,ChevronDown,
Layers,Info,AlertTriangle,ExternalLink,GraduationCap,Menu,X,Plus,Share2
} from 'lucide-react';
import {tracks,lessons,modulesOrder,goldSteps,goldColors,gear,thirtyDays,questions,refs} from './content.js';
import {useProgress,exportProgress,validImport,defaultProgress} from './store.js';
import {AnubisArt,GoldPlate} from './components/Art.jsx';
import PracticeCanvas from './components/PracticeCanvas.jsx';
import {KnowledgeTest,SleevePlanner} from './components/Extras.jsx';
const NAV=[
{id:'home',title:'ภาพรวม',sub:'Dashboard',icon:Home},
{id:'learn',title:'บทเรียน',sub:'Learning',icon:BookOpen},
{id:'practice',title:'ห้องฝึก',sub:'Practice Lab',icon:PenLine},
{id:'gold',title:'สีทอง',sub:'Metallic Lab',icon:Sparkles},
{id:'anubis',title:'อนูบิส',sub:'Masterclass',icon:Target},
{id:'sleeve',title:'วางลายแขน',sub:'Sleeve Planner',icon:Layers},
{id:'quiz',title:'แบบทดสอบ',sub:'Knowledge Check',icon:GraduationCap},
{id:'roadmap',title:'แผน 30 วัน',sub:'Training path',icon:CalendarDays},
{id:'tools',title:'อุปกรณ์',sub:'Setup & safety',icon:ShieldCheck},
{id:'journal',title:'บันทึก',sub:'Progress',icon:BarChart3}
];
const ANUBIS_STEPS=[
['วางลาย','กำหนดกรอบหู ปาก และสัดส่วนครึ่งตัว'],
['โครงเส้น','วางขอบนอกและเส้นหลักให้ชัด'],
['มวลดำ','ล็อกเงาใหญ่ก่อนใส่รายละเอียด'],
['แสงเงา','แยกแก้ม กราม และส่วนลำคอ'],
['พื้นผิว','เพิ่มแสงสะท้อนและขนตามรูปหน้า'],
['เกราะ','วางทองบนชิ้นเกราะที่รับแสง'],
['เก็บวัสดุ','ใส่ร่อง ขอบ และรายละเอียดโลหะ'],
['สีแดง','เน้นดวงตาและอัญมณีเพียงบางจุด'],
['ไฮไลต์','ใส่แสงคมเล็กน้อยและตรวจภาพรวม']
];
const formatTime=s=>`${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;
const todayKey=(date=new Date())=>[date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-');
function SectionHead({eyebrow,title,description,action}){return <div className="section-head"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2>{description&&<p className="section-desc">{description}</p>}</div>{action}</div>}
function Meter({value=0,thin=false}){return <div className={'meter '+(thin?'meter-thin':'')} role="progressbar" aria-valuenow={value} aria-valuemin="0" aria-valuemax="100"><span style={{width:Math.min(100,Math.max(0,value))+'%'}}/></div>}
function IconRound({icon:Icon}){return <span className="icon-round"><Icon size={19} strokeWidth={1.8}/></span>}
function Callout({children}){return <div className="callout"><Info size={17}/><span>{children}</span></div>}
function LessonRow({lesson,done,bookmarked,onClick}){return <button className="lesson-row" onClick={onClick}><span className={'lesson-check '+(done?'on':'')}>{done?<Check size={14}/>:lesson.id.slice(1)}</span><span className="lesson-main"><strong>{lesson.title}</strong><small>{tracks.find(t=>t.id===lesson.track)?.label} · {lesson.minutes} นาที</small></span>{bookmarked&&<Bookmark className="bookmarked-icon" size={14} fill="currentColor"/>}<ChevronRight className="muted" size={17}/></button>}
function App({trackFilter,setTrack}){
 const {progress,setProgress,update,toggleCompleted,toggleBookmark,addSession}=useProgress();
 const [view,setView]=useState('home'),[selectedLesson,setSelectedLesson]=useState(null),[mobileMenu,setMobileMenu]=useState(false);
 const [toast,setToast]=useState(''),timerRef=useRef(null),[seconds,setSeconds]=useState(0),[timerRunning,setTimerRunning]=useState(false);
 const completed=progress.completed.filter(x=>lessons.some(l=>l.id===x));
 const lessonPct=Math.round(completed.length/lessons.length*100);
 const doneDays=progress.completedDays.length;
 const totalMinutes=progress.sessions.reduce((sum,x)=>sum+(Number(x.minutes)||0),0);
 const currentDay=thirtyDays.find(d=>!progress.completedDays.includes(d.day))||thirtyDays[29];
 const firstLesson=lessons.find(l=>!progress.completed.includes(l.id))||lessons[0];
 const guideLesson=lessons.find(l=>l.id===progress.lastLesson)||firstLesson;
 const todaysSessions=progress.sessions.filter(s=>(s.at||'').slice(0,10)===todayKey()).length;
 const weekCount=progress.sessions.filter(s=>Date.now()-new Date(s.at).getTime()<7*864e5).length;
 const go=(next)=>{setView(next);setSelectedLesson(null);setMobileMenu(false);window.scrollTo({top:0,behavior:'instant'})};
 const openLesson=(id)=>{setSelectedLesson(id);setView('learn');window.scrollTo({top:0,behavior:'instant'})};
 useEffect(()=>{document.title=(NAV.find(x=>x.id===view)?.title||'TATLEARN')+' | TATLEARN'},[view]);
 useEffect(()=>{if(!timerRunning)return;timerRef.current=setInterval(()=>setSeconds(s=>s+1),1000);return()=>clearInterval(timerRef.current)},[timerRunning]);
 useEffect(()=>{if(!toast)return;const t=setTimeout(()=>setToast(''),3500);return()=>clearTimeout(t)},[toast]);
 const notify=(t)=>setToast(t);
 const logPractice=(kind,strokes)=>{if(!strokes){notify('เริ่มฝึกเส้นก่อนบันทึก');return}addSession({type:kind,minutes:Math.round(seconds/6)/10,notes:'Digital Practice Lab — '+strokes+' strokes',rating:0});setTimerRunning(false);setSeconds(0);notify('บันทึกการฝึกแล้ว')};
 const downloadAnubis=()=>{const svg=document.querySelector('.master-art .anubis-art');if(!svg)return;const copy=svg.cloneNode(true);copy.setAttribute('xmlns','http://www.w3.org/2000/svg');const data=new Blob([new XMLSerializer().serializeToString(copy)],{type:'image/svg+xml'}),url=URL.createObjectURL(data),a=document.createElement('a');a.href=url;a.download='tatlearn-anubis-study.svg';a.click();URL.revokeObjectURL(url)};
 return <div className="app-shell">
  <aside className={'sidebar '+(mobileMenu?'open':'')} aria-label="เมนูหลัก">
   <div className="brand" onClick={()=>go('home')} role="button" tabIndex={0} onKeyDown={e=>e.key==='Enter'&&go('home')}><span className="brand-emblem">T<span>.</span></span><div><strong>TATLEARN</strong><small>THE TATTOO STUDIO</small></div></div>
   <div className="side-label">YOUR WORKSPACE</div>
   <nav className="side-nav">{NAV.map(n=><button key={n.id} className={'nav-link '+(view===n.id?'active':'')} onClick={()=>go(n.id)}><n.icon size={19} strokeWidth={1.8}/><span>{n.title}</span>{view===n.id&&<span className="nav-indicator"/>}</button>)}</nav>
   <div className="sidebar-bottom"><span className="live-dot"/><div><strong>SYNTHETIC SKIN MODE</strong><small>ฝึกบนหนังเทียมก่อนสักคนจริง</small></div></div>
  </aside>
  {mobileMenu&&<button className="drawer-backdrop" aria-label="ปิดเมนู" onClick={()=>setMobileMenu(false)}/>}
  <main className="main-area">
   <header className="topbar"><div className="topbar-left"><button className="icon-btn hamburger" aria-label="เปิดเมนู" onClick={()=>setMobileMenu(true)}><Menu size={21}/></button><div className="crumb">TATLEARN <ChevronRight size={14}/> <strong>{NAV.find(n=>n.id===view)?.sub}</strong></div></div><div className="topbar-right"><span className="topbar-mark"><span className="live-dot"/> PRACTICE MODE</span><button className="avatar" title="บันทึกการฝึก" aria-label="เปิดบันทึก" onClick={()=>go('journal')}>F</button></div></header>
   <div className="page-content" key={view+'-'+(selectedLesson||'') }>
    {view==='home'&&<div className="fade-in">
      <section className="home-hero"><div className="hero-content"><span className="hero-kicker"><span className="red-dash"/> LEARN · PRACTICE · MASTER</span><h1>ฝึกให้แม่น<br/><em>ก่อนลงหมึกจริง.</em></h1><p>ทุกเทคนิคในสตูดิโอเดียว ตั้งแต่เส้นแรกไปจนถึงงาน Anubis บนหนังเทียม</p><div className="hero-actions"><button className="btn primary" onClick={()=>openLesson(guideLesson.id)}>เรียนต่อ <ArrowUpRight size={17}/></button><button className="btn quiet" onClick={()=>go('practice')}>เปิดห้องฝึก <ArrowRight size={16}/></button></div><span className="hero-foot">POSEIDON / BEGINNER TRACK <span>•</span> THAI EDITION</span></div><div className="hero-visual"><div className="hero-red-glow"/><AnubisArt stage={9} mini/></div></section>
      <div className="stats-line"><div><strong>{lessonPct}%</strong><span>ความคืบหน้าบทเรียน</span></div><div><strong>{doneDays}<i>/30</i></strong><span>วันที่ฝึกตามแผน</span></div><div><strong>{progress.sessions.length}</strong><span>รอบฝึกที่บันทึก</span></div></div>
      <section className="page-section"><SectionHead eyebrow="PICK UP WHERE YOU LEFT OFF" title="ฝึกต่อจากตรงนี้" action={<button className="text-action" onClick={()=>go('roadmap')}>แผน 30 วัน <ArrowUpRight size={16}/></button>}/><div className="continue-block"><div className="continue-icon"><BookOpen size={22}/></div><div className="continue-copy"><span className="micro">LESSON · {guideLesson.minutes} MIN</span><h3>{guideLesson.title}</h3><p>{guideLesson.why}</p></div><button className="circle-forward" title="เปิดบทเรียน" aria-label="เปิดบทเรียน" onClick={()=>openLesson(guideLesson.id)}><ArrowRight size={20}/></button></div></section>
      <section className="page-section"><SectionHead eyebrow="SKILL CATEGORIES" title="เลือกทักษะที่อยากฝึก" description="เรียนเป็นเรื่องสั้น กระชับ ทำบนหนังเทียมได้จริง"/><div className="track-grid">{tracks.map((t,i)=>{const n=lessons.filter(l=>l.track===t.id),c=n.filter(l=>progress.completed.includes(l.id)).length;return <button key={t.id} className="track-row" onClick={()=>{go('learn');setTrackFilter(t.id)}}><span className="track-num">{t.tag}</span><div className="track-copy"><h3>{t.label}</h3><p>{t.desc}</p></div><span className="track-progress">{c}/{n.length}</span><ChevronRight size={19}/></button>})}</div></section>
      <section className="feature-slab" onClick={()=>go('gold')} role="button" tabIndex={0} onKeyDown={e=>e.key==='Enter'&&go('gold')}><div><span className="eyebrow">SIGNATURE MASTERCLASS</span><h2>Metallic Gold<br/>Effect.</h2><p>ลองเปลี่ยนเกราะสีเหลืองธรรมดาให้ดูเป็นโลหะ 3 มิติ ผ่านภาพจำลอง 8 ชั้น</p><span className="fake-link">เข้า Gold Lab <ArrowUpRight size={16}/></span></div><div className="feature-art"><GoldPlate stage={8}/></div></section>
      <section className="page-section"><SectionHead eyebrow="YOUR NEXT PROJECT" title="Anubis Masterclass" action={<button className="text-action" onClick={()=>go('anubis')}>ดูโปรเจกต์ <ArrowUpRight size={16}/></button>}/><div className="project-link"><span className="project-thumb"><AnubisArt stage={9} mini/></span><div><strong>จากเส้นร่างสู่เทพอนูบิส</strong><p>ดำดุดัน · เกราะทอง · ดวงตาแดง · เรขาคณิต</p></div><ArrowRight size={20}/></div></section>
    </div>}
    {view==='learn'&&<LessonsView progress={progress} selectedLesson={selectedLesson} setSelectedLesson={setSelectedLesson} toggleCompleted={toggleCompleted} toggleBookmark={toggleBookmark} openLesson={openLesson} notify={notify} setView={go} onFilter={setTrackFilter} filter={trackFilter}/>}
    {view==='practice'&&<div className="fade-in"><SectionHead eyebrow="PRACTICE / 01" title="ห้องฝึกเดินเส้น" description="เลือกไกด์แล้วลากเส้นด้วยนิ้ว ปากกา หรือเมาส์ ฝึกคุมทิศทางก่อนลงหนังเทียม"/><div className="practice-meta"><div><Clock size={16}/><span className="timer-text">{formatTime(seconds)}</span></div><div className="timer-controls"><button className="btn tiny" onClick={()=>setTimerRunning(!timerRunning)}>{timerRunning?<Pause size={14}/>:<Play size={14}/>} {timerRunning?'พัก':'เริ่มจับเวลา'}</button><button title="เริ่มเวลาใหม่" className="icon-btn" onClick={()=>{setTimerRunning(false);setSeconds(0)}}><RotateCcw size={16}/></button></div></div><PracticeCanvas onLog={logPractice}/><div className="practice-under"><span className="micro">PRACTICE NOTES</span><h3>ดูจังหวะและความสม่ำเสมอ</h3><p>ขณะฝึกบนหนังเทียม ให้เปรียบเทียบตำแหน่งเริ่มและจบ ความหนาเส้น และการรักษาช่องไฟ ไม่ต้องเพิ่มแรงเครื่องเพื่อแก้เส้นสั่น</p><button className="text-action" onClick={()=>openLesson('l01')}>เรียนเดินเส้นให้ลึกขึ้น <ArrowUpRight size={15}/></button></div></div>}
    {view==='gold'&&<GoldLab notify={notify} update={update} progress={progress}/>}
    {view==='anubis'&&<AnubisLab progress={progress} update={update} download={downloadAnubis}/>}
    {view==='quiz'&&<KnowledgeTest progress={progress} update={update}/>}
    {view==='sleeve'&&<SleevePlanner/>}
    {view==='roadmap'&&<Roadmap progress={progress} update={update} openLesson={openLesson}/>}
    {view==='tools'&&<Toolkit progress={progress} update={update}/>}
    {view==='journal'&&<Journal progress={progress} setProgress={setProgress} addSession={addSession} notify={notify} lessonPct={lessonPct} totalMinutes={totalMinutes} weekCount={weekCount}/>}
    <footer className="footer"><span>TATLEARN © 2026 · LEARN THE CRAFT, RESPECT THE SKIN.</span><span>การฝึกดิจิทัล/หนังเทียมไม่ใช่ใบรับรองให้สักคนจริง</span></footer>
   </div>
  </main>
  <nav className="mobile-nav" aria-label="เมนูมือถือ">{NAV.slice(0,5).map(n=><button key={n.id} className={view===n.id?'selected':''} onClick={()=>go(n.id)}><n.icon size={20} strokeWidth={view===n.id?2.2:1.7}/><span>{n.title}</span></button>)}</nav>
  {toast&&<div role="status" className="toast"><CheckCircle2 size={17}/>{toast}</div>}
 </div>;
 function setTrackFilter(x){setTrack(x)}
}
function LessonsView({progress,selectedLesson,setSelectedLesson,toggleCompleted,toggleBookmark,openLesson,filter,onFilter,setView}){
 const [query,setQuery]=useState(''),[onlySaved,setOnlySaved]=useState(false);
 const data=lessons.filter(l=>(filter==='all'||l.track===filter)&&(!onlySaved||progress.bookmarks.includes(l.id))&&((l.title+' '+l.core+' '+l.task).toLowerCase().includes(query.trim().toLowerCase())));
 const lesson=lessons.find(l=>l.id===selectedLesson);
 const track=tracks.find(t=>t.id===lesson?.track);
 if(lesson)return <div className="fade-in detail-page"><button className="back-text" onClick={()=>setSelectedLesson(null)}><ArrowLeft size={16}/> กลับไปบทเรียน</button><div className="detail-header"><p className="eyebrow">{track?.en} · {lesson.minutes} MIN</p><h1>{lesson.title}</h1><p className="lead">{lesson.why}</p><div className="detail-actions"><button className={'btn '+(progress.completed.includes(lesson.id)?'outline-success':'primary')} onClick={()=>toggleCompleted(lesson.id)}><CheckCircle2 size={17}/>{progress.completed.includes(lesson.id)?'เรียนแล้ว · กดยกเลิก':'ทำเครื่องหมายว่าเรียนแล้ว'}</button><button className="icon-btn bookmark-large" aria-label="บันทึกบทเรียน" title="บันทึกบทเรียน" onClick={()=>toggleBookmark(lesson.id)}><Bookmark size={20} fill={progress.bookmarks.includes(lesson.id)?'currentColor':'none'}/></button></div></div>
 <div className="learning-body"><div className="learning-block"><span className="step-mark">01 / UNDERSTAND</span><h2>เข้าใจหลักการ</h2><p>{lesson.core}</p></div><div className="learning-block"><span className="step-mark">02 / DO THE WORK</span><h2>แบบฝึกลงมือทำ</h2><p>{lesson.task}</p></div><div className="learning-block"><span className="step-mark">03 / WATCH OUT</span><h2>สิ่งที่ต้องระวัง</h2><p>{lesson.tip}</p></div><div className="learning-block"><span className="step-mark">04 / SELF-CHECK</span><h2>เกณฑ์ประเมินตัวเอง</h2><p>{lesson.check}</p></div></div>
 <Callout>เนื้อหานี้เป็นการเรียนและฝึกบนหนังเทียมก่อนเท่านั้น การสักบนคนต้องมีผู้ฝึกสอนและระบบป้องกันการติดเชื้อที่เหมาะสม</Callout>
 <div className="lesson-bottom"><button className="btn ghost" onClick={()=>setSelectedLesson(null)}><ArrowLeft size={16}/> รายการบทเรียน</button><button className="btn primary" onClick={()=>{const i=lessons.findIndex(l=>l.id===lesson.id);openLesson(lessons[(i+1)%lessons.length].id)}}>บทเรียนถัดไป <ArrowRight size={17}/></button></div></div>;
 return <div className="fade-in"><SectionHead eyebrow="THE FULL CURRICULUM" title="บทเรียนทั้งหมด" description={lessons.length+' บทเรียน · เริ่มจากพื้นฐานและฝึกตามลำดับ'} action={<button className="btn small quiet" onClick={()=>setView('roadmap')}>แผนฝึก <ArrowUpRight size={15}/></button>}/><div className="curriculum-progress"><div><strong>ความคืบหน้าของคุณ</strong><span>{progress.completed.filter(x=>lessons.some(l=>l.id===x)).length} / {lessons.length} บทเรียน</span></div><Meter value={progress.completed.filter(x=>lessons.some(l=>l.id===x)).length/lessons.length*100}/></div>
 <div className="lesson-filters"><label className="searchbox"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="ค้นหาบทเรียน เทคนิค หรือคำสำคัญ…" aria-label="ค้นหาบทเรียน"/></label><button className={'filter-saved '+(onlySaved?'on':'')} title="เฉพาะที่บันทึก" onClick={()=>setOnlySaved(!onlySaved)}><Bookmark size={17} fill={onlySaved?'currentColor':'none'}/></button></div>
 <div className="guide-select filter-tabs"><button className={'seg '+(filter==='all'?'selected':'')} onClick={()=>onFilter('all')}>ทั้งหมด</button>{tracks.map(t=><button key={t.id} className={'seg '+(filter===t.id?'selected':'')} onClick={()=>onFilter(t.id)}>{t.label}</button>)}</div>
 <div className="lesson-index">{data.length?data.map(l=><LessonRow key={l.id} lesson={l} done={progress.completed.includes(l.id)} bookmarked={progress.bookmarks.includes(l.id)} onClick={()=>openLesson(l.id)}/>):<p className="empty-state">ไม่พบบทเรียนที่ตรงกับคำค้นหา</p>}</div></div>
}
function GoldLab({progress,update,notify}){
 const [step,setStep]=useState(0),[metal,setMetal]=useState('gold'),[compare,setCompare]=useState(false);
 const item=goldSteps[step];
 const done=progress.completed.includes('gold-lab');
 return <div className="fade-in"><SectionHead eyebrow="COLOR STUDIO / 02" title="Metallic Gold Lab" description="จำลองลำดับชั้นสีที่ทำให้โลหะดูมีมิติ จากดำลึกไปถึงแสงขาวคม"/><div className="metal-toggle"><button className={metal==='gold'?'on':''} onClick={()=>setMetal('gold')}>Gold</button><button className={metal==='silver'?'on':''} onClick={()=>setMetal('silver')}>Silver</button><span>OPTICAL ILLUSION</span></div>
 <div className="gold-stage"><div className="gold-view"><GoldPlate stage={step+1} metal={metal}/><div className="art-watermark">{metal==='gold'?'GOLD STUDY':'SILVER STUDY'} <span>0{step+1} / 08</span></div></div><div className="gold-side"><p className="micro">LAYER {String(step+1).padStart(2,'0')} / 08</p><h2>{item.title}</h2><p className="gold-subtitle">{item.subtitle}</p><p>{item.desc}</p><div className="needle-hint"><Layers size={17}/>{item.needle}</div><div className="step-actions"><button className="btn ghost" disabled={step===0} onClick={()=>setStep(s=>s-1)}><ArrowLeft size={16}/> ก่อนหน้า</button><button className="btn primary" onClick={()=>setStep(s=>Math.min(7,s+1))}>{step===7?'ดูขั้นสุดท้าย':'ขั้นถัดไป'} <ArrowRight size={16}/></button></div></div></div>
 <div className="stage-track">{goldSteps.map((x,i)=><button key={i} onClick={()=>setStep(i)} className={i===step?'selected':''} aria-label={'ขั้นที่ '+(i+1)+' '+x.title}><span>{i+1}</span><small>{x.title}</small></button>)}</div>
 <div className="gold-palette"><SectionHead eyebrow="VALUE & TEMPERATURE" title={metal==='gold'?'ไล่ค่าแสงแบบทอง':'เปลี่ยนเป็นโทนเงิน'}/><div className="swatches">{(metal==='gold'?goldColors:[{name:'ดำ',hex:'#08090d'},{name:'เทาเข้ม',hex:'#2c313b'},{name:'เทากลาง',hex:'#626a7b'},{name:'เงิน',hex:'#9da4b5'},{name:'แสง',hex:'#dee4eb'},{name:'ขาว',hex:'#fff'}]).map(x=><div key={x.hex} className="swatch"><i style={{background:x.hex}}/><span>{x.name}</span><small>{x.hex}</small></div>)}</div><p className="subtle-note">ค่า HEX ใช้เพื่อออกแบบภาพ ไม่ใช่สูตรผสมหมึกสำหรับสักคนจริง</p></div>
 <div className="toggle-compare"><label><input type="checkbox" checked={compare} onChange={e=>setCompare(e.target.checked)}/> <span>เปรียบเทียบพื้นฐานกับงานสุดท้าย</span></label></div>{compare&&<div className="compare-grid"><div><GoldPlate stage={2} metal={metal}/><span>เส้น + ค่ามืด</span></div><div><GoldPlate stage={8} metal={metal}/><span>โลหะที่มีเงาและไฮไลต์</span></div></div>}
 <Callout>Metallic Effect คือการจัดค่าน้ำหนักภาพ ไม่ใช่การใช้ผงทองหรือสีเมทัลลิกงานศิลปะผสมหมึก ห้ามใช้วัสดุดังกล่าวกับผิวคน</Callout>
 <button className={'btn '+(done?'outline-success':'primary')+' lab-complete'} onClick={()=>{update(p=>({...p,completed:done?p.completed.filter(x=>x!=='gold-lab'):[...p.completed,'gold-lab']}));notify(done?'ยกเลิกสถานะเรียบร้อย':'บันทึกว่าเรียน Gold Lab แล้ว')}}><CheckCircle2 size={18}/>{done?'เรียน Gold Lab แล้ว':'ทำเครื่องหมายว่าฝึกครบ 8 ขั้น'}</button>
 </div>
}
function AnubisLab({progress,update,download}){
 const [stage,setStage]=useState(0),[guides,setGuides]=useState(false);
 const done=progress.completed.includes('anubis-lab');
 return <div className="fade-in"><SectionHead eyebrow="MASTERCLASS / 03" title="ANUBIS." description="งานโหดเข้มที่ใช้ฝึกทั้งโครงสร้าง ดำ–เทา เกราะทอง และไฮไลต์สีแดง"/><div className="master-layout"><div className="master-art"><div className="master-topline"><span>PROJECT 001</span><span>BLACK / GOLD / RED</span></div><AnubisArt stage={stage} showGuides={guides}/><div className="master-art-bottom"><button onClick={()=>setGuides(!guides)} className={'text-action '+(guides?'active':'')}>{guides?'ซ่อนไกด์':'แสดงไกด์โครงสร้าง'}</button><button onClick={download} className="text-action"><Download size={16}/> SVG</button></div></div><div className="master-steps"><p className="eyebrow">STEP-BY-STEP TRAINING</p><h2>จากเส้นแรก<br/>ถึงงานสมบูรณ์</h2><p className="section-desc">แตะทีละขั้นเพื่อดูการเพิ่มส่วนของภาพ เหมาะใช้เป็นต้นแบบศึกษาและลอกลายบนหนังเทียม</p><div className="master-step-list">{ANUBIS_STEPS.map((x,i)=><button key={i} className={'master-step '+(stage===i+1?'active':'')} onClick={()=>setStage(i+1)}><span>{String(i+1).padStart(2,'0')}</span><div><strong>{x[0]}</strong><small>{x[1]}</small></div>{stage===i+1?<Check size={17}/>:<ChevronRight size={16}/>}</button>)}</div><div className="master-actions"><button className="btn ghost" onClick={()=>setStage(s=>Math.max(0,s-1))} disabled={stage===0}><ArrowLeft size={16}/> ก่อนหน้า</button><button className="btn primary" onClick={()=>setStage(s=>Math.min(9,s+1))}>ขั้นถัดไป <ArrowRight size={16}/></button></div></div></div>
 <div className="master-instructions"><div><span className="micro">TRAINING SIZE</span><h3>A4 / Synthetic Skin</h3><p>เริ่มจากส่วนหัวและตาก่อน อย่าเริ่มทำภาพเต็มชิ้นถ้ายังคุมเส้นและน้ำหนักมืดไม่สม่ำเสมอ</p></div><div><span className="micro">SELF REVIEW</span><h3>3 จุดเช็กงาน</h3><p>รูปทรงอ่านว่า Anubis · เงาดำสร้างมิติจริง · ทองไม่กลบเส้นโครงหลัก</p></div></div>
 <button className={'btn '+(done?'outline-success':'primary')+' lab-complete'} onClick={()=>update(p=>({...p,completed:done?p.completed.filter(x=>x!=='anubis-lab'):[...p.completed,'anubis-lab']}))}><CheckCircle2 size={17}/>{done?'บันทึกงานนี้แล้ว':'ทำเครื่องหมายว่าเสร็จงานฝึก Anubis'}</button>
 </div>
}
function Roadmap({progress,update,openLesson}){
 const complete=(day)=>update(p=>({...p,completedDays:p.completedDays.includes(day)?p.completedDays.filter(x=>x!==day):[...p.completedDays,day]}));
 const pct=Math.round(progress.completedDays.length/30*100);
 return <div className="fade-in"><SectionHead eyebrow="YOUR 30 DAY PATH" title="ฝึกทุกวันให้เห็นพัฒนาการ" description="ใช้เวลาประมาณ 20–25 นาทีต่อวัน มีวันทบทวนและพักตามความเหมาะสม"/><div className="roadmap-head"><span>เสร็จแล้ว {progress.completedDays.length} / 30 วัน</span><strong>{pct}%</strong></div><Meter value={pct}/>
 <div className="weeks">{[1,2,3,4,5].map(w=><div className="week" key={w}><div className="week-header"><div><span className="micro">WEEK {String(w).padStart(2,'0')}</span><h3>{['ควบคุมมือ','งานเส้น','แสงและเงา','โลหะและสี','Anubis Project'][w-1]}</h3></div><span>{progress.completedDays.filter(d=>Math.floor((d-1)/6)+1===w).length}/6</span></div><div className="day-list">{thirtyDays.filter(d=>d.week===w).map(d=><button key={d.day} className={'day '+(progress.completedDays.includes(d.day)?'done':'')} onClick={()=>complete(d.day)}><span className="day-number">{progress.completedDays.includes(d.day)?<Check size={16}/>:String(d.day).padStart(2,'0')}</span><div><strong>{d.title}</strong><small>{d.minutes} นาที · {d.focus}</small></div><ChevronRight size={16}/></button>)}</div></div>)}</div><Callout>เครื่องหมายเสร็จเป็นการบันทึกที่ผู้ใช้ยืนยันเอง ไม่ได้วัดคุณภาพการลงเข็มอัตโนมัติ</Callout></div>
}
function Toolkit({progress,update}){
 const change=(id)=>update(p=>({...p,inventory:p.inventory.includes(id)?p.inventory.filter(x=>x!==id):[...p.inventory,id]}));
 const pre=[['ตรวจเครื่อง หัวเข็ม และฉลากหมึก','ตรวจสภาพอุปกรณ์ก่อนเริ่ม'],['จัดโต๊ะและบริเวณสะอาด','ใช้แผ่นกั้นพื้นผิวและแยกพื้นที่เปื้อน'],['เตรียมกล่องทิ้งเข็ม','เก็บของมีคมในภาชนะที่เหมาะสม']];
 const during=[['ท่าทางไม่เกร็ง','จัดไฟและระดับแขน'],['ใช้แต่หนังเทียมสำหรับฝึกเอง','ห้ามทดลองบนคน'],['ทบทวนทุกเส้นหลังทำ','ไม่ย้ำจนหนังเทียมเสียโดยไร้เหตุผล']];
 const after=[['จัดการเข็มใช้แล้ว','ลงกล่องของมีคม ไม่ใช้ซ้ำ'],['ทำความสะอาดสถานีฝึก','ทำตามฉลากน้ำยาทำความสะอาด'],['ถ่ายภาพและบันทึกข้อผิดพลาด','เทียบพัฒนาการแบบแสงเดียวกัน']];
 return <div className="fade-in"><SectionHead eyebrow="YOUR WORKSTATION" title="อุปกรณ์และความปลอดภัย" description="เช็กของที่มีอยู่แล้วก่อนซื้อใหม่ และสร้างนิสัยทำงานสะอาดตั้งแต่การฝึก"/><div className="tools-score"><strong>{progress.inventory.length} / {gear.length}</strong><span>อุปกรณ์ที่ทำเครื่องหมายว่ามีแล้ว</span><Meter value={progress.inventory.length/gear.length*100}/></div><div className="inventory">{gear.map(g=><label className="inventory-item" key={g.id}><input type="checkbox" checked={progress.inventory.includes(g.id)} onChange={()=>change(g.id)}/><span className="inventory-checkbox"><Check size={14}/></span><div><strong>{g.label}</strong><p>{g.desc}</p></div></label>)}</div>
 <div className="safety-section"><SectionHead eyebrow="STANDARD ROUTINE" title="ฝึกขั้นตอนให้เป็นนิสัย"/>{[['ก่อนเริ่ม',pre],['ระหว่างฝึก',during],['หลังฝึก',after]].map(([name,items])=><div className="safety-group" key={name}><h3>{name}</h3>{items.map(([title,desc],i)=><div className="safety-row" key={title}><span>0{i+1}</span><div><strong>{title}</strong><p>{desc}</p></div></div>)}</div>)}</div>
 <div className="warning-block"><AlertTriangle size={19}/><div><strong>ไม่ใช่ใบอนุญาตสักบนผิวคน</strong><p>หลักสูตรเว็บและหนังเทียมไม่ทดแทนการฝึกกับช่างที่มีคุณสมบัติ หรือมาตรฐานการป้องกันการติดเชื้อและกฎหมายท้องถิ่น ห้ามนำ Practice Ink หรือสีงานศิลป์ไปฉีดเข้าสู่ผิวคน</p></div></div>
 <div className="resources"><h3>แหล่งอ้างอิงด้านความปลอดภัย</h3>{refs.map(r=><a key={r.url} href={r.url} target="_blank" rel="noopener noreferrer"><div><strong>{r.title}</strong><small>{r.desc}</small></div><ExternalLink size={17}/></a>)}</div></div>
}
function Journal({progress,setProgress,addSession,notify,lessonPct,totalMinutes,weekCount}){
 const fileInput=useRef(null),[type,setType]=useState('หนังเทียม'),[minutes,setMinutes]=useState(25),[rating,setRating]=useState(3),[notes,setNotes]=useState('');
 const save=()=>{addSession({type,minutes:Number(minutes),rating,notes:notes.trim()});setNotes('');notify('บันทึกการฝึกเรียบร้อย')};
 const load=async(e)=>{const file=e.target.files?.[0];if(!file)return;try{const value=JSON.parse(await file.text()),imported=validImport(value);if(!imported)throw Error('format');if(window.confirm('ต้องการนำเข้าข้อมูลและแทนที่ความก้าวหน้าปัจจุบันหรือไม่?')){setProgress(imported);notify('นำเข้าข้อมูลเรียบร้อย')}}catch{notify('ไฟล์ข้อมูลไม่ถูกต้อง')}e.target.value=''};
 const reset=()=>{if(window.confirm('ลบข้อมูลการฝึกทั้งหมดที่อยู่บนเบราว์เซอร์นี้? ไม่สามารถย้อนกลับได้')&&window.confirm('ยืนยันลบจริงหรือไม่?')){setProgress({...defaultProgress});notify('ล้างข้อมูลแล้ว')}};
 return <div className="fade-in"><SectionHead eyebrow="PERSONAL TRAINING LOG" title="บันทึกการฝึก" description="ข้อมูลเก็บในเบราว์เซอร์นี้เท่านั้น ดาวน์โหลดสำรองไว้ได้"/><div className="journal-stats"><div><strong>{lessonPct}%</strong><small>บทเรียน</small></div><div><strong>{totalMinutes}</strong><small>นาทีที่บันทึก</small></div><div><strong>{weekCount}</strong><small>รอบฝึก 7 วัน</small></div></div><div className="journal-layout"><section className="journal-entry"><span className="eyebrow">NEW SESSION</span><h2>เพิ่มบันทึกวันนี้</h2><label>หัวข้อฝึก<select value={type} onChange={e=>setType(e.target.value)}><option>หนังเทียม</option><option>เดินเส้น</option><option>ลงเงา</option><option>เกราะทอง</option><option>Anubis</option><option>การจัดโต๊ะ</option></select></label><label>เวลาที่ฝึก (นาที)<input type="number" value={minutes} onChange={e=>setMinutes(e.target.value)} min="1" max="600"/></label><label>ประเมินความมั่นใจ (1–5)<div className="rating-control">{[1,2,3,4,5].map(n=><button type="button" key={n} className={rating===n?'chosen':''} onClick={()=>setRating(n)}>{n}</button>)}</div></label><label>บันทึกสิ่งที่ฝึก / ปัญหาที่พบ<textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="เช่น เส้น S ยังสั่นตรงมุม เปลี่ยนท่าจับแล้วดีขึ้น…" rows={4}/></label><button className="btn primary full" onClick={save} disabled={!(Number(minutes)>0&&Number(minutes)<=600)}><Plus size={17}/> บันทึกการฝึก</button></section><section className="journal-history"><span className="eyebrow">TRAINING HISTORY</span><h2>รายการล่าสุด</h2>{progress.sessions.length?<div className="history-list">{progress.sessions.map(s=><div className="history-row" key={s.id}><span className="history-pin"/><div><strong>{s.type||'ฝึกสัก'}</strong><small>{new Date(s.at).toLocaleString('th-TH',{dateStyle:'medium',timeStyle:'short'})} · {s.minutes||0} นาที</small>{s.notes&&<p>{s.notes}</p>}</div>{s.rating>0&&<span className="history-rating">{s.rating}/5</span>}</div>)}</div>:<div className="empty-state">ยังไม่มีบันทึก กดเพิ่มรอบฝึกแรกเพื่อเริ่มเก็บพัฒนาการ</div>}</section></div>
 <div className="data-settings"><div><h3>จัดการข้อมูล</h3><p>สำรองหรือย้ายข้อมูลไปยังอุปกรณ์อื่นด้วยไฟล์ JSON</p></div><div className="data-buttons"><button className="btn quiet small" onClick={()=>exportProgress(progress)}><Download size={16}/> ส่งออก</button><input hidden ref={fileInput} type="file" accept=".json,application/json" onChange={load}/><button className="btn quiet small" onClick={()=>fileInput.current?.click()}><Upload size={16}/> นำเข้า</button><button className="btn danger small" onClick={reset}><Trash2 size={16}/> ล้างข้อมูล</button></div></div></div>
}
export default function Root(){const [track,setTrack]=useState('all');return <App trackFilter={track} setTrack={setTrack}/>;}
