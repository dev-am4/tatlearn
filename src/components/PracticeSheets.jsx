import React,{useEffect,useMemo,useState} from 'react';
import {ArrowRight,ArrowUpRight,BookOpen,Check,CheckCircle2,ChevronLeft,ChevronRight,Download,ExternalLink,Maximize2,Printer,X} from 'lucide-react';

export const worksheetCatalog=[
  {
    id:'linework',file:'/worksheets/01-linework.svg',number:'01',title:'พื้นฐานควบคุมเส้น',subtitle:'LINE CONTROL',category:'line',categoryName:'เดินเส้น',minutes:25,level:'เริ่มต้น',
    description:'ฝึกเส้นตรง โค้ง วงกลม เส้นขนาน และ Mandala ด้วยแบบที่จัดให้เหมาะกับการลอกลายและฝึกซ้ำ',
    tasks:['เดินเส้นตามไกด์ทีละแนว โดยไม่รีบแก้เส้นที่พลาด','ฝึก 3 รอบแล้วเทียบความหนาและความเรียบของเส้น','ถ่ายงานในแสงเดียวกันเพื่อเปรียบเทียบครั้งต่อไป'],
    checks:['เส้นสม่ำเสมอ','วงกลมไม่บิดเบี้ยว','เส้นขนานไม่ชนกัน'],
    lesson:'l01'
  },
  {
    id:'shading',file:'/worksheets/02-shading.svg',number:'02',title:'แสงและเงาดำเทา',subtitle:'BLACK & GREY',category:'shade',categoryName:'ลงเงา',minutes:30,level:'เริ่มต้น',
    description:'ฝึกค่าน้ำหนัก 6 ระดับ Gradient, Dotwork และการมองแสงบนทรงกลม',
    tasks:['อ่านลำดับค่าแสงเข้มไปอ่อนก่อนลงหมึกบนหนังเทียม','ทำแถบเงา 6 ระดับ โดยแยกค่าแสงได้จริง','ลอง Dotwork แล้วตรวจความต่อเนื่องของเงา'],
    checks:['ค่ามืด–สว่างแยกกันได้','Gradient ไม่เป็นขั้น','ไม่ถมพื้นที่เกินจำเป็น'],
    lesson:'s01'
  },
  {
    id:'gold',file:'/worksheets/03-metallic-gold.svg',number:'03',title:'เกราะทองแบบโลหะ',subtitle:'METALLIC GOLD',category:'color',categoryName:'สีทอง',minutes:35,level:'กลาง',
    description:'ฝึกแยก Stencil, Outline, Deep Black, Brown, Gold และจุด Highlight เพื่อทำทองให้มีมิติ',
    tasks:['พิมพ์แผ่นนี้เพื่อดูส่วนประกอบทีละขั้น','ลองทำเกราะชิ้นเดียวบนหนังเทียมตั้งแต่ดำจนถึงสีทอง','แต้มขาวเฉพาะจุดแสงสะท้อน ไม่ลบพื้นที่เงาลึก'],
    checks:['ยังเห็นเงาดำชัด','ทองมีทั้งโทนสว่างและมืด','ขาวอยู่เฉพาะจุดรับแสง'],
    lesson:'c02'
  },
  {
    id:'anubis',file:'/worksheets/04-anubis.svg',number:'04',title:'Anubis — ฝึกทีละส่วน',subtitle:'ANUBIS STUDY',category:'project',categoryName:'โปรเจกต์',minutes:40,level:'กลาง',
    description:'แยกส่วนหู ตา ปาก และเกราะ เพื่อฝึกโครงหน้าที่อ่านออกก่อนเข้าสู่งาน Anubis เต็มชิ้น',
    tasks:['เริ่มจากแบบเส้นก่อน ไม่ต้องลงสีทั้งตัวทันที','ทำเฉพาะใบหน้าขนาดใหญ่แล้วค่อยแบ่งพื้นที่ดำ','ฝึกเกราะแยกชิ้นก่อนนำมารวมกับใบหน้า'],
    checks:['รูปทรงอ่านว่า Anubis','เส้นหน้าและหูไม่เบี้ยว','เกราะไม่กลบจุดเด่นของหน้า'],
    lesson:'c06'
  },
  {
    id:'dotwork',file:'/worksheets/05-dotwork.svg',number:'05',title:'ดอทเวิร์กและสมมาตร',subtitle:'DOTWORK & GEOMETRY',category:'line',categoryName:'เดินเส้น',minutes:30,level:'กลาง',
    description:'ฝึกเพิ่มความเข้มด้วยความหนาแน่นจุด และจัดเรขาคณิต 8 หรือ 12 กลีบให้สมมาตร',
    tasks:['สร้างตารางจุด 6 ระดับความแน่นด้วยการควบคุมระยะ','ทำ Mandala 8 กลีบก่อน 12 กลีบ','เปรียบเทียบเส้นรอบนอกและแกนกลาง'],
    checks:['จุดไม่จับเป็นก้อน','แกนมีศูนย์กลาง','กลีบสมดุลกัน'],
    lesson:'l06'
  },
  {
    id:'metal-light',file:'/worksheets/06-metal-light.svg',number:'06',title:'แสงสะท้อนทองและเงิน',subtitle:'METALLIC LIGHT',category:'color',categoryName:'สีทอง',minutes:25,level:'กลาง',
    description:'ทดลองแสงเงาทองกับเงินบนทรงกลมและศึกษารอยต่อเข้ม–สว่างที่ทำให้วัตถุดูเหมือนโลหะ',
    tasks:['เปรียบเทียบภาพสีทองกับเงินโดยดูค่าแสง','ทำทรงกลมขาวดำก่อนเพิ่มความอุ่นของสี','กำหนดทิศทางแสงเพียงทิศเดียว'],
    checks:['จุดแสงชัด','มีพื้นที่มืดรับกับจุดสว่าง','สีไม่แบนทั้งชิ้น'],
    lesson:'c03'
  }
];
const filters=[['all','ทั้งหมด'],['line','เดินเส้น'],['shade','ลงเงา'],['color','สีและแสง'],['project','Anubis']];
export function printPracticeSheet(file){
  const pop=window.open(file,'_blank','noopener,noreferrer');
  if(!pop){window.alert('เบราว์เซอร์บล็อกการเปิดแท็บใหม่ สามารถดาวน์โหลดไฟล์ SVG แล้วสั่งพิมพ์ได้');}
}
export default function PracticeSheets({progress,update,onLesson,onGold,onAnubis}){
  const [filter,setFilter]=useState('all');
  const [active,setActive]=useState(null);
  const [zoom,setZoom]=useState(100);
  const [checks,setChecks]=useState({});
  const list=useMemo(()=>worksheetCatalog.filter(x=>filter==='all'||x.category===filter),[filter]);
  const completed=progress.worksheetsCompleted||[];
  const markComplete=(id)=>update(p=>({...p,worksheetsCompleted:(p.worksheetsCompleted||[]).includes(id)?(p.worksheetsCompleted||[]).filter(x=>x!==id):[...(p.worksheetsCompleted||[]),id]}));
  const open=(sheet)=>{setActive(sheet);setZoom(100);setChecks({});};
  useEffect(()=>{
    if(!active)return;
    const prev=document.body.style.overflow;document.body.style.overflow='hidden';
    const onKey=(e)=>{if(e.key==='Escape')setActive(null);if(e.key==='ArrowRight'){const i=worksheetCatalog.findIndex(x=>x.id===active.id);setActive(worksheetCatalog[(i+1)%worksheetCatalog.length]);setZoom(100)}if(e.key==='ArrowLeft'){const i=worksheetCatalog.findIndex(x=>x.id===active.id);setActive(worksheetCatalog[(i-1+worksheetCatalog.length)%worksheetCatalog.length]);setZoom(100)}};
    window.addEventListener('keydown',onKey);
    return()=>{document.body.style.overflow=prev;window.removeEventListener('keydown',onKey)};
  },[active]);
  const activeIndex=active?worksheetCatalog.findIndex(x=>x.id===active.id):0;
  const move=(step)=>{const item=worksheetCatalog[(activeIndex+step+worksheetCatalog.length)%worksheetCatalog.length];setActive(item);setZoom(100);setChecks({})};
  return <div className="worksheets fade-in">
    <div className="section-head"><div><p className="eyebrow">PRACTICE LIBRARY / PRINTABLE A4</p><h2>คลังแบบฝึกจริง</h2><p className="section-desc">แบบฝึกพิมพ์ A4 เปิดดูเต็มหน้า ซูม และนำไปลอกลายเพื่อฝึกบนหนังเทียม</p></div><span className="sheet-count">{completed.length}/6 ฝึกแล้ว</span></div>
    <div className="guide-select filter-tabs" role="group" aria-label="กรองแบบฝึก">{filters.map(([id,name])=><button key={id} className={'seg '+(filter===id?'selected':'')} onClick={()=>setFilter(id)}>{name}</button>)}</div>
    <div className="sheet-grid">
    {list.map(sheet=><div className="sheet-card" key={sheet.id}>
      <button className="sheet-preview" onClick={()=>open(sheet)} aria-label={'เปิดแบบฝึก '+sheet.title}><img src={sheet.file} loading="lazy" alt={'ตัวอย่างแบบฝึก '+sheet.title}/><span className="sheet-preview-icon"><Maximize2 size={16}/></span></button>
      <div className="sheet-details"><span className="micro">{sheet.subtitle} / {sheet.minutes} MIN</span><div className="sheet-title-row"><button onClick={()=>open(sheet)}><h3>{sheet.title}</h3></button>{completed.includes(sheet.id)&&<CheckCircle2 size={18} color="#7ed1a1"/>}</div><p>{sheet.description}</p><div className="sheet-actions"><button className="text-action" onClick={()=>open(sheet)}>ดูแบบ <ArrowUpRight size={15}/></button><a className="text-action" href={sheet.file} download={'tatlearn-'+sheet.id+'.svg'}><Download size={15}/> SVG</a></div></div>
    </div>)}
    </div>
    <div className="sheet-note"><BookOpen size={18}/><div><strong>ลำดับฝึกที่แนะนำ</strong><p>คุมเส้น → แสงเงา → Dotwork → เกราะทอง → Anubis → ฝึกแสงสะท้อนเพิ่มเติม แบบฝึกเหล่านี้ไม่ได้ทดแทนการเรียนกับช่างก่อนสักผิวคนจริง</p></div></div>
    {active&&<div className="sheet-modal" role="dialog" aria-modal="true" aria-label={'แบบฝึก '+active.title}>
      <div className="sheet-modal-top"><div><span className="micro">WORKSHEET {active.number} / 06</span><strong>{active.title}</strong></div><div className="sheet-modal-controls"><button className="icon-btn" title="ก่อนหน้า" aria-label="ก่อนหน้า" onClick={()=>move(-1)}><ChevronLeft size={20}/></button><button className="icon-btn" title="ถัดไป" aria-label="ถัดไป" onClick={()=>move(1)}><ChevronRight size={20}/></button><button className="icon-btn close-sheet" title="ปิด" aria-label="ปิด" onClick={()=>setActive(null)}><X size={23}/></button></div></div>
      <div className="sheet-modal-main">
        <div className="sheet-image-scroll"><div className="sheet-image-container" style={{width:zoom+'%',minWidth:zoom===100?'min(100%, 560px)':undefined}}><img src={active.file} alt={'แผ่นฝึก '+active.title} draggable={false}/></div></div>
        <aside className="sheet-instructions"><p className="eyebrow">PRACTICE GUIDE</p><h3>{active.title}</h3><p>{active.description}</p><p className="micro">ฝึกตามลำดับ</p><ol>{active.tasks.map(t=><li key={t}>{t}</li>)}</ol><p className="micro">ตรวจงานตัวเอง</p><div className="sheet-checks">{active.checks.map((t,i)=><label key={i}><input type="checkbox" checked={!!checks[i]} onChange={e=>setChecks(v=>({...v,[i]:e.target.checked}))}/><span>{t}</span></label>)}</div>
        <button className={'btn full '+(completed.includes(active.id)?'outline-success':'primary')} onClick={()=>markComplete(active.id)}><CheckCircle2 size={16}/>{completed.includes(active.id)?'บันทึกว่าฝึกแล้ว':'ทำเครื่องหมายว่าฝึกครบ'}</button>
        <button className="text-action sheet-related" onClick={()=>{setActive(null);onLesson(active.lesson)}}>อ่านเทคนิคที่เกี่ยวข้อง <ArrowRight size={16}/></button>
        {(active.id==='gold'||active.id==='metal-light')&&<button className="text-action sheet-related" onClick={()=>{setActive(null);onGold()}}>เปิดห้องฝึก Metallic <ArrowUpRight size={16}/></button>}
        {active.id==='anubis'&&<button className="text-action sheet-related" onClick={()=>{setActive(null);onAnubis()}}>เปิด Anubis Masterclass <ArrowUpRight size={16}/></button>}
        </aside>
      </div>
      <div className="sheet-modal-bottom"><div className="sheet-zoom"><span>Zoom {zoom}%</span><input type="range" min="70" max="220" step="10" value={zoom} onChange={e=>setZoom(Number(e.target.value))} aria-label="ขยายแผ่นฝึก"/></div><div className="sheet-downloads"><button className="btn quiet small" onClick={()=>printPracticeSheet(active.file)}><Printer size={15}/> เปิดเพื่อพิมพ์</button><a className="btn primary small" href={active.file} download={'tatlearn-'+active.id+'.svg'}><Download size={15}/> บันทึก SVG</a></div></div>
    </div>}
  </div>;
}
