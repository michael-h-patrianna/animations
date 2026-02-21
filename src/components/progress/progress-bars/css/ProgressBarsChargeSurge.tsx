import{useEffect,useState}from"react";import"./ProgressBarsChargeSurge.css";type MilestoneState="inactive"|"anticipating"|"charged";interface SurgeWave{id:number;milestoneIndex:number}const MILESTONE_POSITIONS=[0,0.25,0.5,0.75,1];const ANTICIPATION_THRESHOLD=0.05;/**
 *
 */export function ProgressBarsChargeSurge(){const[progress,setProgress]=useState(0);const[milestoneStates,setMilestoneStates]=useState<MilestoneState[]>(["inactive","inactive","inactive","inactive","inactive"]);const[surgeWaves,setSurgeWaves]=useState<SurgeWave[]>([]);const[glowFlash,setGlowFlash]=useState(false);useEffect(()=>{const duration=4000;const startTime=Date.now();let waveIdCounter=0;const pendingTimeouts:ReturnType<typeof setTimeout>[]=[];// Track states inside the closure to avoid stale reads
const localStates:MilestoneState[]=["inactive","inactive","inactive","inactive","inactive"];const intervalId=setInterval(()=>{const elapsed=Date.now()-startTime;const currentProgress=Math.min(elapsed/duration,1);setProgress(currentProgress);let stateChanged=false;MILESTONE_POSITIONS.forEach((pos,index)=>{const isNearMilestone=currentProgress>=pos-ANTICIPATION_THRESHOLD;const hasReachedMilestone=currentProgress>=pos;if(hasReachedMilestone&&localStates[index]!=="charged"){localStates[index]="charged";stateChanged=true;const newWave:SurgeWave={id:waveIdCounter++,milestoneIndex:index};setSurgeWaves(prev=>[...prev,newWave]);setGlowFlash(true);pendingTimeouts.push(setTimeout(()=>setGlowFlash(false),200));pendingTimeouts.push(setTimeout(()=>{setSurgeWaves(prev=>prev.filter(w=>w.id!==newWave.id))},700))}else if(isNearMilestone&&!hasReachedMilestone&&localStates[index]==="inactive"){localStates[index]="anticipating";stateChanged=true}});if(stateChanged){setMilestoneStates([...localStates])}if(currentProgress>=1){clearInterval(intervalId)}},16);return()=>{clearInterval(intervalId);pendingTimeouts.forEach(clearTimeout)}},[]);return<div className="pf-progress-demo pf-charge-surge-css"data-animation-id="progress-bars__charge-surge">
      <div className="track-container"style={{position:"relative"}}>
        <div className="pf-progress-track">
          {/* Base fill layer */}
          <div className="pf-progress-fill pf-progress-fill--base"style={{transform:`scaleX(${progress})`,transformOrigin:"left center"}}/>

          {/* Glow fill layer */}
          <div className="pf-progress-fill pf-progress-fill--glow"style={{transform:`scaleX(${progress})`,transformOrigin:"left center"}}>
            <div className={`glow-overlay ${glowFlash?"flash":""}`}/>
          </div>
        </div>

        {/* Milestone markers */}
        {MILESTONE_POSITIONS.map((pos,i)=><div key={i}className="milestone-container"style={{position:"absolute",left:`${pos*100}%`,top:"50%",transform:"translate(-50%, -50%)",width:"24px",height:"24px"}}>
            {/* Main marker */}
            <div className={`milestone-marker ${milestoneStates[i]}`}style={{position:"absolute",inset:0,border:"2px solid rgba(59, 130, 246, 0.8)",borderRadius:"50%"}}/>

            {/* Surge waves */}
            {surgeWaves.filter(w=>w.milestoneIndex===i).map(wave=><div key={wave.id}className="surge-wave"style={{position:"absolute",inset:0,border:"2px solid rgba(59, 130, 246, 0.8)",borderRadius:"50%",pointerEvents:"none"}}/>)}
          </div>)}
      </div>
    </div>}
