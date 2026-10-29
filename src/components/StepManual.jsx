import React,{useEffect,useState} from 'react';
import {Check,CheckCircle2,ChevronDown,ChevronRight,ClipboardList,Hand,Info,TriangleAlert} from 'lucide-react';
import {getPracticeGuide} from '../practiceGuides.js';
export default function StepManual({task}){
 const guide=getPracticeGuide(task.id);
 const [active,setActive]=useState(0);
 const [done,setDone]=useState([]);
 useEffect(()=>{setActive(0);setDone([])},[task.id]);
 if(!guide)return null;
 const mark=i=>{
  const isDone=done.includes(i);
  setDone(d=>isDone?d.filter(x=>x!==i):[...d,i]);
  if(!isDone && i<guide.steps.length-1)setActive(i+1);
 };
 return <div className="studio-manual">
   <div className="studio-manual-heading"><div><h3>วิธีทำทีละขั้น</h3><p>แตะหัวข้อเพื่ออ่านวิธีฝึกอย่างละเอียด แล้วทำตามทีละขั้น</p></div><span>{done.length}/{guide.steps.length}</span></div>
   <details className="studio-manual-extra" open><summary><ClipboardList size={16}/> เตรียมอะไรบ้าง <ChevronDown size={16}/></summary><ul>{guide.prepare.map(x=><li key={x}>{x}</li>)}</ul></details>
   <details className="studio-manual-extra" open><summary><Hand size={16}/> เทคนิคสำหรับคนถนัดซ้าย <ChevronDown size={16}/></summary><p>{guide.leftHand}</p></details>
   <div className="studio-manual-list">{guide.steps.map((s,i)=>{
    const isOpen=active===i,checked=done.includes(i);
    return <div key={i} className={'studio-manual-row '+(isOpen?'active':'')}>
      <button type="button" className="studio-manual-trigger" onClick={()=>setActive(isOpen?-1:i)} aria-expanded={isOpen}>
        <span className={'studio-manual-num '+(checked?'checked':'')}>{checked?<Check size={15}/>:String(i+1).padStart(2,'0')}</span>
        <span className="studio-manual-title">{s.title}</span>
        {isOpen?<ChevronDown size={17}/>:<ChevronRight size={17}/>}
      </button>
      {isOpen&&<div className="studio-manual-detail">
        <p>{s.how}</p>
        <div className="studio-manual-observe"><strong>ดูว่าทำถูกไหม</strong><p>{s.look}</p></div>
        <button type="button" className="studio-manual-complete" onClick={()=>mark(i)}>{checked?'ย้อนกลับ: ยังไม่เสร็จ':'ทำขั้นนี้แล้ว'} <Check size={15}/></button>
      </div>}
    </div>;
   })}</div>
   <details className="studio-manual-extra studio-manual-trouble"><summary><TriangleAlert size={16}/> ผิดตรงไหนและแก้อย่างไร <ChevronDown size={16}/></summary><div>{guide.mistakes.map(([bad,fix])=><div key={bad}><strong>{bad}</strong><p>{fix}</p></div>)}</div></details>
   {guide.extra&&<details className="studio-manual-extra"><summary><Info size={16}/> ข้อควรรู้เพิ่มเติม <ChevronDown size={16}/></summary><p>{guide.extra}</p></details>}
   <div className="studio-manual-goal"><CheckCircle2 size={17}/><div><strong>เป้าหมายของแบบฝึกนี้</strong><p>{guide.goal}</p></div></div>
 </div>;
}
