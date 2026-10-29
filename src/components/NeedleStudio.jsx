import React,{useEffect,useRef,useState} from 'react';
import {ArrowUpRight,Camera,CheckCircle2,ChevronRight,Download,Info,Save,X} from 'lucide-react';
import {needleProfiles} from '../needleData.js';

function TipDiagram({profile}){
 const count=Number(profile.key[0]),isRM=profile.key==='9RM';
 const points=isRM?[[-28,-8],[-14,-13],[0,-15],[14,-13],[28,-8],[-21,15],[-7,12],[7,12],[21,15]]:Array.from({length:count},(_,i)=>[21*Math.cos(i*2*Math.PI/count),21*Math.sin(i*2*Math.PI/count)]);
 return <svg viewBox="0 0 240 175" role="img" aria-label={'การจัดกลุ่มเข็ม '+profile.key+' แบบขยาย ไม่ใช่ขนาดจริง'}>
 <circle cx="120" cy="84" r="58" fill="#ffffff04" stroke="#ffffff22" strokeDasharray="4 6"/>
 {points.map(([x,y],i)=><g key={i}><circle cx={120+x} cy={84+y} r="12" stroke="#d5adb3" strokeWidth="1.5" fill="#333039"/><circle cx={120+x} cy={84+y} r="3" fill="#ee6576"/></g>)}
 <text x="120" y="165" textAnchor="middle" fill="#a495a0" fontSize="10" letterSpacing="1">ILLUSTRATIVE · NOT TO SCALE</text>
 </svg>;
}
function ExampleStroke({profile,wrong=false,issue=0}){
 const isRM=profile.key==='9RM',strokeWidth=profile.key==='3RL'?2.8:profile.key==='5RL'?4.2:profile.key==='7RL'?6.3:10;
 if(isRM)return <svg viewBox="0 0 350 155" role="img" aria-label={wrong?'เงาที่เป็นแถบ':'เงาที่ไล่ระดับต่อเนื่อง'}>
 <defs><linearGradient id={'needle-grad-'+(wrong?'bad':'good')}><stop offset="0%" stopColor="#17151a"/><stop offset="49%" stopColor="#8f8990"/><stop offset="100%" stopColor="#f2ecef"/></linearGradient></defs>
 <rect x="20" y="31" width="310" height="91" rx="5" fill={'url(#needle-grad-'+(wrong?'bad':'good')+')'}/>
 {wrong&&issue===0&&<g><rect x="20" y="31" width="76" height="91" fill="#242128"/><rect x="96" y="31" width="80" height="91" fill="#68636b"/><rect x="176" y="31" width="76" height="91" fill="#b1aab3"/><rect x="252" y="31" width="78" height="91" fill="#e8e3e8"/></g>}
 {wrong&&issue===1&&<g><path d="M26 51h27v18H26m55-31h26v28H81m43 21h40v20h-40m68-51h51v29h-51m74-31h34v42h-34" fill="#e9e2e7" opacity=".85"/><path d="M56 70h23v14H56m57-36h26v13h-26m56 51h20v-20h-20" fill="#2c2730" opacity=".7"/></g>}
 {wrong&&issue===2&&<g><rect x="20" y="31" width="140" height="91" fill="#25232a"/><rect x="160" y="31" width="170" height="91" fill="#e7e2e7"/></g>}
 </svg>;
 const good=['M22 40 H327','M22 78 Q174 24 327 78','M22 114 H327'];
 const wrongPaths=[
 ['M22 40 Q51 60 80 40 T139 47 T194 38 T265 48 T327 40','M22 78 Q174 24 327 78','M22 114 H327'],
 ['M22 40 H140 M130 40 H327','M22 78 Q174 24 327 78','M22 114 H327'],
 ['M22 40 H327','M22 78 Q174 24 327 78','M22 114 H155 M134 114 H327']
 ];
 return <svg viewBox="0 0 350 155" role="img" aria-label={wrong?'ตัวอย่างความผิดพลาดของเส้น':'ตัวอย่างเส้นที่คุมได้สม่ำเสมอ'}>
 <g fill="none" stroke={wrong?'#f26a78':'#f0edf0'} strokeWidth={strokeWidth} strokeLinecap="round">{(wrong?wrongPaths[issue]:good).map((d,i)=><path key={i} d={d}/>)}</g>
 </svg>;
}
const ratingOptions=[['ปรับปรุง',0],['พอใช้',1],['ดี',2]];
export default function NeedleStudio({progress,addSession,onLesson,onWorksheets}){
 const [key,setKey]=useState('3RL'),[issue,setIssue]=useState(0),[ratings,setRatings]=useState({}),[notes,setNotes]=useState(''),[preview,setPreview]=useState(null),[saved,setSaved]=useState(false);
 const profile=needleProfiles.find(x=>x.key===key)||needleProfiles[0];
 const photoRef=useRef(null);
 const recent=(progress.sessions||[]).filter(s=>s.needle===key).slice(0,4);
 const total=profile.checks.reduce((acc,_,i)=>acc+(ratings[i]??0),0);
 const ready=profile.checks.every((_,i)=>Number.isInteger(ratings[i]));
 useEffect(()=>()=>{if(preview)URL.revokeObjectURL(preview)},[preview]);
 const change=(k)=>{setKey(k);setIssue(0);setRatings({});setNotes('');setPreview(null);setSaved(false)};
 const onPhoto=e=>{const file=e.target.files?.[0];if(!file)return;if(!file.type.startsWith('image/')||file.size>8*1024*1024){window.alert('เลือกรูปภาพขนาดไม่เกิน 8 MB');return}setPreview(URL.createObjectURL(file));e.target.value=''};
 const save=()=>{if(!ready)return;addSession({type:'ฝึกหัวเข็ม '+key,needle:key,minutes:profile.minutes,rating:Math.round(total/6*5),rubric:{total,max:6,scores:profile.checks.map((criterion,i)=>({criterion,score:ratings[i]}))},notes:notes.trim()||profile.drills.map(x=>x[0]).join(' / ')});setSaved(true)};
 return <div className="needle-page fade-in">
 <div className="section-head"><div><p className="eyebrow">CARTRIDGE STUDY / SYNTHETIC SKIN</p><h2>ฝึกแยกตามหัวเข็ม</h2><p className="section-desc">เลือกหัวเข็ม ดูเส้นตัวอย่าง จุดผิดพลาด และประเมินผลงานฝึกบนหนังเทียม</p></div><span className="needle-tag">POSEIDON PRACTICE</span></div>
 <div className="needle-switch" role="tablist" aria-label="เลือกหัวเข็ม">{needleProfiles.map(p=><button role="tab" aria-selected={key===p.key} className={key===p.key?'selected':''} onClick={()=>change(p.key)} key={p.key}><strong>{p.key}</strong><span>{p.en}</span></button>)}</div>
 <div className="needle-overview"><div className="needle-info"><p className="micro">CARTRIDGE / {profile.en}</p><h3>{key} <span>{profile.title}</span></h3><p>{profile.description}</p><div className="needle-info-foot"><span>{profile.minutes} นาที / รอบ</span><button className="text-action" onClick={()=>onLesson(profile.lesson)}>บทเรียน <ArrowUpRight size={15}/></button></div></div><div className="needle-tip"><TipDiagram profile={profile}/></div></div>
 <section className="needle-section"><div className="needle-section-heading"><div><p className="eyebrow">VISUAL COMPARISON</p><h3>เทียบรอยที่ต้องการกับข้อผิดพลาด</h3></div></div>
 <div className="needle-compare"><div><span className="needle-example-label good">ตัวอย่างเป้าหมาย</span><ExampleStroke profile={profile}/></div><div><span className="needle-example-label bad">สิ่งที่ควรแก้</span><ExampleStroke profile={profile} wrong issue={issue}/></div></div>
 <div className="needle-errors" role="group" aria-label="เลือกตัวอย่างปัญหา">{profile.errors.map((e,i)=><button className={issue===i?'selected':''} onClick={()=>setIssue(i)} key={i} aria-pressed={issue===i}>{e[1]}</button>)}</div>
 <div className="needle-fix"><strong>{profile.errors[issue][0]}</strong><span>{profile.errors[issue][3]}</span><p>แนวทางแก้: {profile.errors[issue][2]}</p></div></section>
 <section className="needle-section"><div className="needle-section-heading"><div><p className="eyebrow">PRACTICE ON SYNTHETIC SKIN</p><h3>แบบฝึกจริง</h3></div><a className="text-action" href={profile.file} download={'tatlearn-'+key.toLowerCase()+'.svg'}><Download size={15}/> SVG A4</a></div>
 <div className="needle-drills">{profile.drills.map((d,i)=><div className="needle-drill" key={i}><span>{String(i+1).padStart(2,'0')}</span><div><strong>{d[0]}</strong><p>{d[2]}</p></div><small>{d[1]}</small></div>)}</div>
 <button className="needle-sheet-link" onClick={onWorksheets}><img src={profile.file} alt={'แบบฝึก '+key} loading="lazy"/><div><span className="micro">PRINTABLE A4 / {profile.order}</span><strong>เปิดแผ่นฝึก {key}</strong><p>ซูมเต็มจอและพิมพ์ลายได้</p></div><ChevronRight size={19}/></button></section>
 <section className="needle-section"><div className="needle-section-heading"><div><p className="eyebrow">SELF ASSESSMENT</p><h3>ให้คะแนนชิ้นงานของตัวเอง</h3></div><span>{ready?total+' / 6':'3 หัวข้อ'}</span></div>
 <p className="needle-disclaimer">คะแนนนี้เป็นการประเมินด้วยตัวเอง ไม่ใช่การวิเคราะห์คุณภาพหรือความปลอดภัยของงานสักโดยระบบ</p>
 <div className="needle-rubric">{profile.checks.map((criterion,i)=><div className="needle-rubric-row" key={i}><strong>{criterion}</strong><div>{ratingOptions.map(([label,value])=><button aria-pressed={ratings[i]===value} className={ratings[i]===value?'chosen':''} key={value} onClick={()=>{setRatings(r=>({...r,[i]:value}));setSaved(false)}}>{label}</button>)}</div></div>)}</div>
 <label className="needle-notes">สิ่งที่ควรปรับในรอบหน้า<textarea value={notes} rows={3} onChange={e=>{setNotes(e.target.value);setSaved(false)}} placeholder="เช่น เส้นช่วงท้ายสั่นเพราะเกร็งข้อมือ"/></label>
 <div className="needle-photo-field"><input ref={photoRef} hidden type="file" accept="image/*" onChange={onPhoto}/><button className="btn quiet small" onClick={()=>photoRef.current?.click()}><Camera size={15}/> {preview?'เปลี่ยนภาพ':'เปิดภาพชิ้นงานของฉัน'}</button><small>แสดงชั่วคราวบนเครื่องนี้ ไม่อัปโหลด</small></div>
 {preview&&<div className="needle-photo-preview"><img alt="ภาพชิ้นงานฝึกที่เลือกเพื่อประเมิน" src={preview}/><button aria-label="เอาภาพออก" onClick={()=>setPreview(null)}><X size={16}/></button></div>}
 <div className="needle-save"><span>{ready?'คะแนนประเมิน '+total+' / 6':'เลือกคะแนนครบทั้ง 3 ข้อก่อนบันทึก'}</span><button className={'btn '+(saved?'outline-success':'primary')} disabled={!ready} onClick={save}>{saved?<CheckCircle2 size={16}/>:<Save size={16}/>} {saved?'บันทึกแล้ว':'บันทึกรอบฝึก'}</button></div>
 {recent.length>0&&<div className="needle-history"><p className="micro">ประวัติ {key}</p>{recent.map(x=><div key={x.id}><span>{new Date(x.at).toLocaleDateString('th-TH',{day:'numeric',month:'short'})}</span><strong>{x.rubric?.total??0} / 6</strong><small>{x.notes||'รอบฝึก'}</small></div>)}</div>}
 </section><div className="needle-caution"><Info size={18}/><span>ภาพเข็มเป็นตัวอย่าง ไม่ใช่ขนาดจริง และไม่ใช่คำแนะนำความลึกหรือแรงดันเข็ม ควรตรวจ Cartridge ที่รองรับเครื่อง Poseidon จากคู่มือ ฝึกด้วยหนังเทียมเท่านั้น และฝึกกับช่างผู้สอนก่อนสักคนจริง</span></div>
 </div>;
}
