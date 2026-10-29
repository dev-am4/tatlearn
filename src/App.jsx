import React,{useEffect,useMemo,useRef,useState} from 'react';
import {ArrowLeft,ArrowRight,BookOpen,Check,CheckCircle2,ChevronRight,Clock,Download,Image as ImageIcon,Info,Menu,Pause,Play,RotateCcw,Search,ShieldCheck,Timer,Upload, X} from 'lucide-react';
import {stages,practicePlan,stageFor} from './practicePlan.js';
import {lessons,gear,thirtyDays,refs} from './content.js';
import {useProgress,exportProgress,validImport,defaultProgress} from './store.js';
import VisualAcademy from './components/VisualAcademy.jsx';
import PracticeSheets from './components/PracticeSheets.jsx';
import NeedleStudio from './components/NeedleStudio.jsx';
import PracticeCanvas from './components/PracticeCanvas.jsx';
import StepManual from './components/StepManual.jsx';
import {KnowledgeTest,SleevePlanner} from './components/Extras.jsx';

const MENU=[
{label:'คลังความรู้',id:'knowledge',icon:BookOpen},
{label:'ภาพสอนทั้งหมด',id:'visuals',icon:ImageIcon},
{label:'แผ่นฝึก A4',id:'worksheets',icon:Download},
{label:'ฝึกแยกหัวเข็ม',id:'needles',icon:Timer},
{label:'กระดานฝึกดิจิทัล',id:'canvas',icon:Play},
{label:'แบบทดสอบความรู้',id:'quiz',icon:CheckCircle2},
{label:'แผนฝึก 30 วัน',id:'calendar',icon:Clock},
{label:'ออกแบบลายเต็มแขน',id:'sleeve',icon:ImageIcon},
{label:'อุปกรณ์และความปลอดภัย',id:'safety',icon:ShieldCheck},
{label:'บันทึกผลและสำรองข้อมูล',id:'history',icon:Download}
];
const pad=n=>String(Math.max(0,n)).padStart(2,'0');
const clock=s=>pad(Math.floor(s/60))+':'+pad(Math.floor(s%60));
const roundedMinutes=seconds=>Math.round(seconds/6)/10;
const completedSet=sessions=>new Set((sessions||[]).filter(s=>s.practicePassed===true&&s.practiceId).map(s=>s.practiceId));
const stageTasks=stage=>practicePlan.filter(t=>t.stage===stage);
const getNext=(stage,passed)=>stageTasks(stage).find(t=>!passed.has(t.id))||stageTasks(stage)[0];
const lessonVisual={f02:'01-setup',f03:'02-needle',f04:'01-setup',f05:'03-linework',l01:'03-linework',l02:'03-linework',l03:'03-linework',s01:'04-shading',s03:'04-shading',c01:'05-color',c02:'08-gold',c03:'09-metals',c06:'10-anubis'};
function StudyImage({src,fallback,alt='',className='',loading='lazy'}){ 
 const [current,setCurrent]=useState(src);
 useEffect(()=>setCurrent(src),[src]);
 const onFail=()=>{if(fallback&&current!==fallback)setCurrent(fallback)};
 return <img src={current} alt={alt} className={className} loading={loading} onError={onFail}/>;
}
function SmallEmpty({children}){return <p className="studio-empty">{children}</p>}
function LessonPage({id,onBack,progress,toggleCompleted,onPractice}){
 const lesson=lessons.find(l=>l.id===id);
 if(!lesson)return <button className="studio-link" onClick={onBack}>กลับไปคลังความรู้</button>;
 const visual=id==='l01'?'/examples/linework-left-handed-demo.webp':lessonVisual[id]?'/visual-lessons/'+lessonVisual[id]+'.svg':null;
 return <div className="studio-article">
 <button className="studio-back" onClick={onBack}><ArrowLeft size={17}/> คลังความรู้</button>
 <h1>{lesson.title}</h1>
 {visual&&<StudyImage className={'studio-article-image '+(id==='l01'?'studio-portrait-poster':'')} src={visual} fallback={id==='l01'?'/examples/linework-left-handed-demo.svg':null} alt={'ภาพสอน '+lesson.title}/>}
 <h3>หลักการ</h3><p>{lesson.core}</p>
 <h3>ลองทำตาม</h3><p>{lesson.task}</p>
 <h3>จุดที่ควรระวัง</h3><p>{lesson.tip}</p>
 <h3>ตรวจงาน</h3><p>{lesson.check}</p>
 {practicePlan.some(t=>t.lesson===lesson.id)&&<button className="studio-secondary-button studio-lesson-practice" onClick={()=>onPractice(practicePlan.find(t=>t.lesson===lesson.id).id)}>เปิดแบบฝึกและคำสอนทีละขั้น <ArrowRight size={16}/></button>}
 <button className="studio-primary" onClick={()=>toggleCompleted(lesson.id)}>{progress.completed.includes(lesson.id)?'เรียนแล้ว ✓':'บันทึกว่าอ่านบทนี้แล้ว'} <Check size={16}/></button>
 </div>
}
function PracticeSession({task,progress,onBack,onSaved,onNext}){
 const [mode,setMode]=useState('stopwatch');
 const [limit,setLimit]=useState(task.minutes*60);
 const [stored,setStored]=useState(0),[running,setRunning]=useState(false),[now,setNow]=useState(Date.now());
 const startAt=useRef(null);
 const [checks,setChecks]=useState([false,false,false]),[notes,setNotes]=useState(''),[result,setResult]=useState(null);
 const [ownPhoto,setOwnPhoto]=useState(null),[large,setLarge]=useState(false);
 useEffect(()=>{if(!running)return;const interval=setInterval(()=>setNow(Date.now()),300);return()=>clearInterval(interval)},[running]);
 useEffect(()=>()=>{if(ownPhoto)URL.revokeObjectURL(ownPhoto)},[ownPhoto]);
 const count=stored+(running&&startAt.current!==null?Math.max(0,Math.floor((now-startAt.current)/1000)):0);
 const seconds=mode==='countdown'?Math.max(0,limit-count):count;
 useEffect(()=>{if(mode==='countdown'&&running&&count>=limit){setStored(limit);setRunning(false);startAt.current=null}},[running,mode,count,limit]);
 const changeMode=m=>{setMode(m);setRunning(false);startAt.current=null;setStored(0);setResult(null)};
 const start=()=>{if(running)return;startAt.current=Date.now();setNow(Date.now());setRunning(true)};
 const pause=()=>{if(!running)return;setStored(s=>s+Math.max(0,Math.floor((Date.now()-startAt.current)/1000)));setRunning(false);startAt.current=null};
 const reset=()=>{setStored(0);setRunning(false);startAt.current=null;setResult(null)};
 const save=()=>{const actual=stored+(running&&startAt.current!==null?Math.floor((Date.now()-startAt.current)/1000):0);
  if(actual<=0)return;
  pause();
  const passed=checks.every(Boolean);
  onSaved({type:task.title,practiceId:task.id,stageId:task.stage,practicePassed:passed,checks:checks.map((checked,i)=>({label:task.checks[i],checked})),rating:checks.filter(Boolean).length,minutes:roundedMinutes(actual),elapsedSeconds:actual,mode,targetSeconds:limit,notes:notes.trim(),template:task.sheet||task.image});
  setResult({passed,score:checks.filter(Boolean).length,seconds:actual});
 };
 const changePhoto=e=>{const file=e.target.files?.[0];if(!file)return;if(!file.type.startsWith('image/')||file.size>8*1024*1024){window.alert('กรุณาเลือกรูปภาพไม่เกิน 8 MB');return}setOwnPhoto(URL.createObjectURL(file));e.target.value=''};
 const attempts=(progress.sessions||[]).filter(s=>s.practiceId===task.id);
 return <div className="studio-session">
   <button className="studio-back" onClick={onBack}><ArrowLeft size={17}/> กลับไปเลือกแบบฝึก</button>
   <div className="studio-session-heading"><span>{stageFor(task.stage).title}</span><h1>{task.title}</h1></div>
   <button className={"studio-main-image "+(task.demoImage?"studio-poster-main":"")} onClick={()=>setLarge(true)} aria-label="ขยายภาพต้นแบบ"><StudyImage src={task.demoImage||task.image} fallback={task.image} alt={"ภาพตัวอย่างสำหรับ "+task.title} loading="eager"/><span><ImageIcon size={16}/> ดูภาพใหญ่</span></button>
   <div className="studio-step-heading"><span>01</span><h2>ดูตัวอย่างแล้วทำตาม</h2></div>
   <StepManual task={task}/>
   {task.sheet&&<a className="studio-sheet-action" href={task.sheet} download={'tatlearn-'+task.id+'.svg'}><Download size={17}/> โหลดแบบฝึกสำหรับพิมพ์ A4 <ChevronRight size={17}/></a>}
   <div className="studio-step-heading"><span>02</span><h2>จับเวลาลองทำ</h2></div>
   <div className="studio-timer">
    <div className="studio-mode-switch"><button className={mode==='stopwatch'?'active':''} onClick={()=>changeMode('stopwatch')}>จับเวลาจริง</button><button className={mode==='countdown'?'active':''} onClick={()=>changeMode('countdown')}>ตั้งเวลาท้าทาย</button></div>
    {mode==='countdown'&&<div className="studio-duration"><span>เวลาที่ต้องการฝึก</span><select value={limit} onChange={e=>{reset();setLimit(Number(e.target.value))}}>{[5,10,15,20,25,30,40,45,60].map(n=><option key={n} value={n*60}>{n} นาที</option>)}</select></div>}
    <div className="studio-clock" aria-live="off">{clock(seconds)}</div>
    <div className="studio-timer-controls"><button className="studio-primary" onClick={running?pause:start} disabled={mode==='countdown'&&seconds===0}>{running?<Pause size={18}/>:<Play size={18}/>} {running?'พักเวลา':count>0?'ทำต่อ':'เริ่มฝึก'}</button><button className="studio-icon-button" aria-label="เริ่มนับเวลาใหม่" onClick={reset}><RotateCcw size={20}/></button></div>
   </div>
   <div className="studio-step-heading"><span>03</span><h2>ทดสอบผลงานตัวเอง</h2></div>
   <div className="studio-checklist">{task.checks.map((c,i)=><label key={i}><input type="checkbox" checked={checks[i]} onChange={e=>{setChecks(x=>x.map((v,j)=>i===j?e.target.checked:v));setResult(null)}}/><span className="studio-checkbox"><Check size={15}/></span><span>{c}</span></label>)}</div>
   <p className="studio-note-small">เช็กเฉพาะข้อที่ทำได้จริง ถ้ายังไม่ผ่านสามารถกลับมาฝึกซ้ำได้</p>
   <div className="studio-photo-tools"><label className="studio-photo-button"><ImageIcon size={17}/> เปรียบเทียบกับรูปที่ฝึก<input hidden type="file" accept="image/*" onChange={changePhoto}/></label>{ownPhoto&&<button className="studio-link" onClick={()=>setOwnPhoto(null)}>เอารูปออก</button>}</div>
   {ownPhoto&&<div className="studio-compare"><StudyImage src={task.demoImage||task.image} fallback={task.image} alt="ภาพตัวอย่างต้นแบบ"/><img src={ownPhoto} alt="รูปชิ้นงานผู้ใช้"/></div>}
   <label className="studio-note-field">บันทึกจุดที่ควรแก้ (ไม่บังคับ)<textarea rows={2} placeholder="เช่น เส้นโค้งช่วงท้ายยังสั่น" value={notes} onChange={e=>setNotes(e.target.value)}/></label>
   <button className="studio-primary studio-save" disabled={count<=0} onClick={save}><CheckCircle2 size={17}/> บันทึกผลการฝึก</button>
   {result&&<div className="studio-result"><strong>{result.passed?'ผ่านการประเมินตนเอง':'บันทึกแล้ว — ฝึกเพิ่มได้'}</strong><p>ได้ {result.score}/3 ข้อ · ใช้เวลา {clock(result.seconds)}</p><button className="studio-link" onClick={onNext}>ไปแบบฝึกถัดไป <ArrowRight size={17}/></button></div>}
   {attempts.length>0&&<p className="studio-attempts">เคยฝึก {attempts.length} ครั้ง {attempts.some(s=>s.practicePassed)?'· ผ่านแล้ว':'· ยังฝึกต่อได้'}</p>}
   <p className="studio-safety-note"><Info size={15}/> แบบฝึกสำหรับหนังเทียม ไม่ใช่การรับรองความพร้อมสักบนผิวคน</p>
   {large&&<div className="studio-lightbox" role="dialog" aria-modal="true" aria-label="ภาพต้นแบบขยาย"><button className="studio-lightbox-close" onClick={()=>setLarge(false)} aria-label="ปิด"><X size={23}/></button><StudyImage src={task.demoImage||task.image} fallback={task.image} alt={"ภาพตัวอย่าง "+task.title}/></div>}
 </div>;
}
export default function App(){
 const {progress,setProgress,update,toggleCompleted,addSession}=useProgress();
 const [screen,setScreen]=useState('home'),[stage,setStage]=useState('basics'),[activeId,setActiveId]=useState(null),[menu,setMenu]=useState(false),[selectedLesson,setSelectedLesson]=useState(null),[search,setSearch]=useState('');
 const fileRef=useRef(null);
 const passed=useMemo(()=>completedSet(progress.sessions),[progress.sessions]);
 const focus=getNext(stage,passed);
 const stageCompleted=stageTasks(stage).filter(t=>passed.has(t.id)).length;
 const currentTask=practicePlan.find(t=>t.id===activeId);
 const openStage=id=>{setStage(id);setScreen('home');setActiveId(null);setMenu(false);window.scrollTo(0,0)};
 const openTask=id=>{setActiveId(id);setScreen('practice');setMenu(false);window.scrollTo(0,0)};
 const openMenuPage=id=>{setScreen(id);setActiveId(null);setSelectedLesson(null);setMenu(false);window.scrollTo(0,0)};
 const openLesson=id=>{setSelectedLesson(id);setScreen('knowledge');setMenu(false);window.scrollTo(0,0)};
 const nextTask=()=>{const index=practicePlan.findIndex(x=>x.id===activeId);const next=practicePlan[index+1];if(next){setStage(next.stage);openTask(next.id)}else openStage('full')};
 const imported=async e=>{const file=e.target.files?.[0];if(!file)return;try{const data=validImport(JSON.parse(await file.text()));if(!data)throw Error('invalid');if(window.confirm('นำเข้าข้อมูลและแทนที่ผลการฝึกบนเครื่องนี้?'))setProgress(data)}catch{window.alert('ไฟล์สำรองไม่ถูกต้อง')}e.target.value=''};
 const menuGo=id=>{if(id==='home')openStage(stage);else openMenuPage(id)};
 useEffect(()=>{document.title=screen==='practice'&&currentTask?currentTask.title+' | TATLEARN':'TATLEARN — ฝึกสักทีละขั้น'},[screen,currentTask]);
 return <div className="studio-shell">
  <header className="studio-header"><button className="studio-logo" onClick={()=>openStage(stage)}>TATLEARN<span>.</span></button><button className="studio-menu-button" onClick={()=>setMenu(true)} aria-label="เปิดเมนูทั้งหมด"><Menu size={24}/></button></header>
  <main className="studio-main">
   {screen==='home'&&<>
    <div className="studio-home-title"><h1>ฝึกสักทีละขั้น</h1><p>ดูตัวอย่าง → ทำตาม → จับเวลา → ตรวจงาน</p></div>
    <nav className="studio-stages" aria-label="เลือกระดับฝึก">{stages.map(s=><button key={s.id} className={stage===s.id?'active':''} onClick={()=>openStage(s.id)}><span>{s.index}</span>{s.title}</button>)}</nav>
    <section className="studio-continue"><div><span className="studio-label">ฝึกต่อ</span><h2>{focus.title}</h2><p>{focus.minutes} นาที · {stageFor(focus.stage).title}</p><button className="studio-primary" onClick={()=>openTask(focus.id)}>เริ่มฝึก <ArrowRight size={17}/></button></div><StudyImage src={focus.demoImage||focus.image} fallback={focus.image} alt={focus.title}/></section>
    <div className="studio-list-head"><h2>{stageFor(stage).title}</h2><span>{stageCompleted}/{stageTasks(stage).length} ผ่าน</span></div>
    <div className="studio-task-list">{stageTasks(stage).map((task,i)=><button key={task.id} onClick={()=>openTask(task.id)}><StudyImage src={task.demoImage||task.image} fallback={task.image} alt=""/><span className="studio-task-info"><strong>{pad(i+1)} · {task.title}</strong><small>{task.minutes} นาที</small></span>{passed.has(task.id)?<CheckCircle2 className="studio-pass" size={21}/>:<ChevronRight className="studio-chevron" size={20}/>}</button>)}</div>
    <div className="studio-next-stage">{stage!=='full'&&<button onClick={()=>openStage(stage==='basics'?'colors':'full')}>ดูขั้นต่อไป: {stage==='basics'?'ฝึกสี':'ฝึกภาพเต็ม'} <ArrowRight size={17}/></button>}</div>
   </>}
   {screen==='practice'&&currentTask&&<PracticeSession key={activeId} task={currentTask} progress={progress} onBack={()=>openStage(currentTask.stage)} onNext={nextTask} onSaved={addSession}/>}
   {screen!=='home'&&screen!=='practice'&&<div className="studio-secondary">
     <button className="studio-back" onClick={()=>openStage(stage)}><ArrowLeft size={17}/> กลับหน้าเรียน</button>
     {screen==='knowledge'&&(selectedLesson?<LessonPage id={selectedLesson} onBack={()=>setSelectedLesson(null)} progress={progress} toggleCompleted={toggleCompleted} onPractice={openTask}/>:<div><h1>คลังความรู้</h1><label className="studio-search"><Search size={18}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="ค้นหาเรื่องที่อยากรู้"/></label><div className="studio-simple-list">{lessons.filter(l=>(l.title+' '+l.core).toLowerCase().includes(search.toLowerCase().trim())).map(l=><button key={l.id} onClick={()=>setSelectedLesson(l.id)}><span>{l.title}</span><ChevronRight size={18}/></button>)}</div></div>)}
     {screen==='visuals'&&<VisualAcademy progress={progress} update={update} onLesson={openLesson} onGo={id=>{if(id==='gold'){openTask('gold')}else if(id==='anubis'){openTask('anubis-full')}else openMenuPage(id)}}/>}
     {screen==='worksheets'&&<PracticeSheets progress={progress} update={update} onLesson={openLesson} onGold={()=>openTask('gold')} onAnubis={()=>openTask('anubis-full')}/>}
     {screen==='needles'&&<NeedleStudio progress={progress} addSession={addSession} onLesson={openLesson} onWorksheets={()=>openMenuPage('worksheets')}/>}
     {screen==='canvas'&&<><h1>กระดานฝึกดิจิทัล</h1><PracticeCanvas onLog={(type,strokes)=>{if(strokes>0){addSession({type:'ฝึกวาดดิจิทัล '+type,minutes:0,notes:strokes+' strokes'});window.alert('บันทึกครั้งฝึกแล้ว')}else window.alert('เริ่มลากเส้นก่อนบันทึก')}}/></>}
     {screen==='quiz'&&<KnowledgeTest progress={progress} update={update}/>}
     {screen==='sleeve'&&<SleevePlanner/>}
     {screen==='calendar'&&<><h1>แผนฝึก 30 วัน</h1><div className="studio-simple-list">{thirtyDays.map(day=><button key={day.day} onClick={()=>update(p=>({...p,completedDays:p.completedDays.includes(day.day)?p.completedDays.filter(n=>n!==day.day):[...p.completedDays,day.day]}))}><span>{pad(day.day)} · {day.title}</span>{progress.completedDays.includes(day.day)?<CheckCircle2 className="studio-pass" size={18}/>:<span>{day.minutes} นาที</span>}</button>)}</div></>}
     {screen==='safety'&&<><h1>อุปกรณ์และความปลอดภัย</h1><div className="studio-simple-list">{gear.map(item=><label key={item.id} className="studio-gear"><input type="checkbox" checked={progress.inventory.includes(item.id)} onChange={()=>update(p=>({...p,inventory:p.inventory.includes(item.id)?p.inventory.filter(x=>x!==item.id):[...p.inventory,item.id]}))}/><span>{item.label}</span></label>)}</div><p className="studio-safety-note">ฝึกบนหนังเทียมก่อนเสมอ ห้ามนำหมึกสำหรับฝึกไปสักคนจริง และควรเรียนสุขอนามัยกับผู้สอนที่มีคุณสมบัติก่อนทำงานผิวคน</p>{refs.map(r=><a className="studio-sheet-action" href={r.url} rel="noopener noreferrer" target="_blank" key={r.url}>{r.title} <ArrowRight size={16}/></a>)}</>}
     {screen==='history'&&<><h1>บันทึกผลการฝึก</h1><p className="studio-muted">บันทึกทั้งหมด {progress.sessions.length} ครั้ง</p><div className="studio-simple-list">{progress.sessions.map(s=><div key={s.id} className="studio-record"><div><strong>{s.type}</strong><small>{new Date(s.at).toLocaleString('th-TH',{dateStyle:'medium',timeStyle:'short'})} · {s.minutes||0} นาที</small>{s.notes&&<p>{s.notes}</p>}</div><span>{s.practiceId?(s.practicePassed?'ผ่าน':'ฝึกซ้ำ'):'บันทึก'}</span></div>)}</div>{!progress.sessions.length&&<SmallEmpty>ยังไม่มีผลการฝึก ลองเริ่มจับเวลาจากแบบฝึกแรก</SmallEmpty>}<div className="studio-data-actions"><button className="studio-secondary-button" onClick={()=>exportProgress(progress)}><Download size={16}/> สำรองข้อมูล</button><input type="file" hidden ref={fileRef} accept=".json,application/json" onChange={imported}/><button className="studio-secondary-button" onClick={()=>fileRef.current?.click()}><Upload size={16}/> นำเข้าข้อมูล</button></div></>}
   </div>}
  </main>
  {screen==='home'&&<p className="studio-footer">ฝึกบนหนังเทียมและกระดาษเท่านั้น · การฝึกด้วยเว็บไม่ทดแทนผู้สอนจริง</p>}
  {menu&&<><button className="studio-menu-overlay" aria-label="ปิดเมนู" onClick={()=>setMenu(false)}/><aside className="studio-drawer" aria-label="เมนูเพิ่มเติม">
   <div className="studio-drawer-title"><strong>เมนูทั้งหมด</strong><button aria-label="ปิดเมนู" onClick={()=>setMenu(false)}><X size={22}/></button></div>
   <div className="studio-drawer-stages">{stages.map(s=><button key={s.id} onClick={()=>openStage(s.id)}>{s.title}<ChevronRight size={17}/></button>)}</div>
   <div className="studio-drawer-divider"/>
   {MENU.map(m=><button key={m.id} className="studio-drawer-item" onClick={()=>menuGo(m.id)}><m.icon size={18}/><span>{m.label}</span><ChevronRight size={16}/></button>)}
  </aside></>}
 </div>;
}
