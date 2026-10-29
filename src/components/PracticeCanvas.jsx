import React,{useCallback,useEffect,useRef,useState} from 'react';
import {Undo2,Redo2,Trash2,Download,Eye,EyeOff,Check} from 'lucide-react';
const W=960,H=600;
const guides=[
{id:'lines',label:'เส้นตรง'},
{id:'curves',label:'เส้นโค้ง'},
{id:'circles',label:'วงกลม'},
{id:'mandala',label:'เรขาคณิต'},
{id:'free',label:'วาดอิสระ'}
];
function Stencil({type}){
 if(type==='free')return null;
 return <svg className="stencil-overlay" viewBox="0 0 960 600" preserveAspectRatio="none" aria-hidden="true">
  <g fill="none" stroke="#fb717d" strokeWidth="2.5" strokeDasharray="12 12" strokeLinecap="round">
  {type==='lines'&&Array.from({length:8},(_,i)=><line key={i} x1="90" y1={75+i*60} x2="870" y2={75+i*60}/>)}
  {type==='curves'&&Array.from({length:6},(_,i)=><path key={i} d={'M95 '+(90+i*83)+' Q270 '+(15+i*83)+' 450 '+(90+i*83)+' T850 '+(90+i*83)}/>)}
  {type==='circles'&&[50,90,130,170,210,250].map(r=><circle key={r} cx="480" cy="300" r={r}/>)}
  {type==='mandala'&&<><circle cx="480" cy="300" r="232"/><circle cx="480" cy="300" r="162"/><circle cx="480" cy="300" r="74"/>{Array.from({length:12},(_,i)=>{let a=i*Math.PI/6;return <line key={i} x1="480" y1="300" x2={480+260*Math.cos(a)} y2={300+260*Math.sin(a)}/>})}{Array.from({length:12},(_,i)=>{let a=i*Math.PI/6;return <ellipse key={'e'+i} cx={480+120*Math.cos(a)} cy={300+120*Math.sin(a)} rx="54" ry="95" transform={'rotate('+(i*30+90)+' '+(480+120*Math.cos(a))+' '+(300+120*Math.sin(a))+')'}/>})}</>}
  </g>
 </svg>
}
export default function PracticeCanvas({onLog}){
 const canvas=useRef(null),drawing=useRef(false),history=useRef([]),index=useRef(-1);
 const [type,setType]=useState('lines'),[size,setSize]=useState(5),[ink,setInk]=useState('#111218'),[opacity,setOpacity]=useState(.52),[show,setShow]=useState(true),[revision,setRevision]=useState(0),[strokes,setStrokes]=useState(0);
 const snapshot=useCallback(()=>{let data=canvas.current?.toDataURL();if(!data)return;history.current=history.current.slice(0,index.current+1);history.current.push(data);if(history.current.length>32)history.current.shift();index.current=history.current.length-1;setRevision(x=>x+1)},[]);
 useEffect(()=>{const ctx=canvas.current.getContext('2d');ctx.lineCap='round';ctx.lineJoin='round';ctx.fillStyle='#f3f0e9';ctx.fillRect(0,0,W,H);snapshot()},[snapshot]);
 const pos=e=>{const r=canvas.current.getBoundingClientRect();return{x:(e.clientX-r.left)/r.width*W,y:(e.clientY-r.top)/r.height*H}};
 const start=e=>{if(e.button!==undefined&&e.button!==0)return;e.preventDefault();canvas.current.setPointerCapture(e.pointerId);drawing.current=true;let ctx=canvas.current.getContext('2d'),p=pos(e);ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.strokeStyle=ink;ctx.lineWidth=size;ctx.lineCap='round';ctx.lineJoin='round';ctx.lineTo(p.x+.01,p.y+.01);ctx.stroke()};
 const move=e=>{if(!drawing.current)return;e.preventDefault();let ctx=canvas.current.getContext('2d'),p=pos(e);ctx.lineTo(p.x,p.y);ctx.stroke()};
 const end=e=>{if(!drawing.current)return;drawing.current=false;const ctx=canvas.current.getContext('2d');ctx.closePath();snapshot();setStrokes(v=>v+1)};
 const restore=(i)=>{const data=history.current[i];if(!data)return;const img=new Image();img.onload=()=>{let ctx=canvas.current.getContext('2d');ctx.clearRect(0,0,W,H);ctx.drawImage(img,0,0);index.current=i;setRevision(x=>x+1)};img.src=data};
 const clear=()=>{let ctx=canvas.current.getContext('2d');ctx.fillStyle='#f3f0e9';ctx.fillRect(0,0,W,H);snapshot();setStrokes(0)};
 const download=()=>{let a=document.createElement('a');a.href=canvas.current.toDataURL('image/png');a.download='tatlearn-practice.png';a.click()};
 return <div className="practice-wrap">
   <div className="guide-select" role="group" aria-label="เลือกแบบฝึก">{guides.map(x=><button key={x.id} onClick={()=>setType(x.id)} className={'seg '+(type===x.id?'selected':'')}>{x.label}</button>)}</div>
   <div className="practice-board">
    <div className="practice-surface"><canvas ref={canvas} width={W} height={H} onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerCancel={end} aria-label="พื้นที่ลากเส้นฝึกด้วยนิ้ว เมาส์ หรือปากกา"/>{show&&<div className="stencil-layer" style={{opacity}}><Stencil type={type}/></div>}</div>
    <div className="board-caption"><span>ARTBOARD / 960 × 600</span><span>{strokes} strokes</span></div>
   </div>
   <div className="draw-toolbar">
    <div className="toolbar-item"><span className="small-label">สีเส้น</span><input aria-label="เลือกสีเส้น" type="color" value={ink} onChange={e=>setInk(e.target.value)}/></div>
    <div className="toolbar-item slider-item"><span className="small-label">ขนาด {size}</span><input aria-label="ความหนาเส้น" type="range" min="2" max="24" value={size} onChange={e=>setSize(Number(e.target.value))}/></div>
    <div className="toolbar-item slider-item"><span className="small-label">Guide {Math.round(opacity*100)}%</span><input aria-label="ความเข้มเส้นนำ" type="range" min="0" max="100" value={Math.round(opacity*100)} onChange={e=>setOpacity(Number(e.target.value)/100)}/></div>
    <div className="toolbar-actions">
      <button className="icon-btn" title={show?'ซ่อนแบบ':'แสดงแบบ'} aria-label={show?'ซ่อนแบบ':'แสดงแบบ'} onClick={()=>setShow(!show)}>{show?<Eye size={17}/>:<EyeOff size={17}/>}</button>
      <button className="icon-btn" disabled={index.current<=0} title="ย้อนกลับ" aria-label="ย้อนกลับ" onClick={()=>restore(index.current-1)}><Undo2 size={17}/></button>
      <button className="icon-btn" disabled={index.current>=history.current.length-1} title="ทำซ้ำ" aria-label="ทำซ้ำ" onClick={()=>restore(index.current+1)}><Redo2 size={17}/></button>
      <button className="icon-btn" title="ล้างภาพ" aria-label="ล้างภาพ" onClick={()=>{if(window.confirm('ล้างกระดานฝึก?'))clear()}}><Trash2 size={17}/></button>
      <button className="icon-btn" title="บันทึก PNG" aria-label="บันทึก PNG" onClick={download}><Download size={17}/></button>
    </div>
   </div>
   <div className="practice-footer"><span>กระดานนี้ใช้ซ้อมการวางเส้นเท่านั้น ไม่จำลองความลึกหรือแรงของเข็มบนผิวหนัง</span><button className="btn small primary" onClick={()=>onLog(type,strokes)}><Check size={15}/> บันทึกรอบฝึก</button></div>
 </div>
}
