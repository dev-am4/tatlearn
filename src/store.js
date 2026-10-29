import {useEffect,useState} from 'react';
export const defaultProgress={completed:[],worksheetsCompleted:[],bookmarks:[],sessions:[],inventory:[],lastLesson:null,completedDays:[],quizHistory:[]};
export function useProgress(){
  const [progress,setProgress]=useState(()=>{
    try {const value=JSON.parse(localStorage.getItem('tatlearn-progress-v1')||'null');return value && typeof value==='object'?{...defaultProgress,...value}:defaultProgress;}
    catch{return defaultProgress;}
  });
  useEffect(()=>{try{localStorage.setItem('tatlearn-progress-v1',JSON.stringify(progress))}catch{}},[progress]);
  const update=(fn)=>setProgress(p=>fn(p));
  const toggleCompleted=(id)=>update(p=>({...p,completed:p.completed.includes(id)?p.completed.filter(x=>x!==id):[...p.completed,id],lastLesson:id}));
  const toggleBookmark=(id)=>update(p=>({...p,bookmarks:p.bookmarks.includes(id)?p.bookmarks.filter(x=>x!==id):[...p.bookmarks,id]}));
  const addSession=(session)=>update(p=>({...p,sessions:[{id:Date.now().toString(36)+Math.random().toString(36).slice(2,6),at:new Date().toISOString(),...session},...p.sessions].slice(0,500)}));
  return {progress,setProgress,update,toggleCompleted,toggleBookmark,addSession};
}
export function exportProgress(progress){
  const blob=new Blob([JSON.stringify({version:1,exportedAt:new Date().toISOString(),progress},null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='tatlearn-progress.json';a.click();URL.revokeObjectURL(url);
}
export function validImport(value){
  if(!value||typeof value!=='object'||!value.progress||typeof value.progress!=='object')return null;
  const p=value.progress;
  const list=(key)=>Array.isArray(p[key])?p[key].slice(0,500):[];
  return {...defaultProgress,completed:list('completed').filter(x=>typeof x==='string'),worksheetsCompleted:list('worksheetsCompleted').filter(x=>typeof x==='string'),bookmarks:list('bookmarks').filter(x=>typeof x==='string'),sessions:list('sessions').filter(x=>x&&typeof x==='object'&&typeof x.at==='string'),inventory:list('inventory').filter(x=>typeof x==='string'),completedDays:list('completedDays').filter(x=>Number.isInteger(x)&&x>0&&x<=30),quizHistory:list('quizHistory').filter(x=>x&&typeof x==='object'),lastLesson:typeof p.lastLesson==='string'?p.lastLesson:null};
}
