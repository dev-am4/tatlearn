import {practicePlan} from '../src/practicePlan.js';
import {practiceGuides} from '../src/practiceGuides.js';
if(practicePlan.length!==20)throw new Error('Expected 20 practice exercises');
const seen=new Set();
for(const task of practicePlan){
 if(seen.has(task.id))throw new Error('Duplicate practice id: '+task.id);
 seen.add(task.id);
 const guide=practiceGuides[task.id];
 if(!guide)throw new Error('No detailed guide for '+task.id);
 if(guide.prepare?.length<3)throw new Error('Insufficient equipment instructions for '+task.id);
 if(typeof guide.leftHand!=='string'||guide.leftHand.length<45)throw new Error('Missing left-handed instructions for '+task.id);
 if(guide.steps?.length<5)throw new Error('Fewer than 5 real practical steps for '+task.id);
 for(const [i,step] of guide.steps.entries()){
  if(!step.title||step.how?.length<50||step.look?.length<20)throw new Error('Incomplete step '+i+' for '+task.id);
 }
 if(guide.mistakes?.length<3||!guide.mistakes.every(x=>x.length===2&&x[0]&&x[1]))throw new Error('Troubleshooting incomplete: '+task.id);
 if(!guide.goal)throw new Error('Missing practice goal: '+task.id);
}
const extra=Object.keys(practiceGuides).filter(x=>!seen.has(x));
if(extra.length)throw new Error('Unreferenced practice guides: '+extra.join(', '));
console.log('Validated '+practicePlan.length+' detailed guides, '+Object.values(practiceGuides).reduce((n,g)=>n+g.steps.length,0)+' practical steps, left-hand adaptation and troubleshooting.');
