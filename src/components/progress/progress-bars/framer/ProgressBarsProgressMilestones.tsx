import{easeOut}from"motion/react";import*as m from"motion/react-m";import{useEffect,useState}from"react";const MILESTONE_POSITIONS=[0,0.25,0.5,0.75,1];const MILESTONE_LABELS=["Start","25%","50%","75%","100%"];/**
 *
 */export function ProgressBarsProgressMilestones(){const[activatedMilestones,setActivatedMilestones]=useState<Set<number>>(new Set<number>());useEffect(()=>{const duration=4000;const startTime=Date.now();// Track activated milestones inside the closure to avoid stale reads
const localActivated=new Set<number>();const intervalId=setInterval(()=>{const elapsed=Date.now()-startTime;const progress=Math.min(elapsed/duration,1);let changed=false;MILESTONE_POSITIONS.forEach((pos,index)=>{if(progress>=pos&&!localActivated.has(index)){localActivated.add(index);changed=true}});if(changed){setActivatedMilestones(new Set(localActivated))}if(progress>=1){clearInterval(intervalId)}},100);return()=>{clearInterval(intervalId)}},[]);const fillVariants={hidden:{scaleX:0},visible:{scaleX:1,transition:{duration:4,ease:"linear"as const}}};const markerVariants=()=>({inactive:{scale:0.5,opacity:0.6,background:"var(--pf-anim-cyan-soft)"},active:{scale:1,opacity:1,background:["var(--pf-anim-cyan-soft)","var(--pf-anim-cyan-light)"],transition:{duration:0.4,ease:[0.34,1.56,0.64,1]as const}}});const ringVariants={inactive:{scale:0.8,opacity:0},active:{scale:[0.8,1.5,2],opacity:[0,1,0],transition:{duration:0.6,times:[0,0.3,1],ease:easeOut}}};const labelVariants={inactive:{opacity:0.5,color:"var(--pf-anim-cyan-muted)"},active:{opacity:1,color:"var(--pf-anim-cyan-light)",transition:{duration:0.3,ease:easeOut}}};return<div className="pf-progress-demo pf-progress-milestones"data-animation-id="progress-bars__progress-milestones">
      <div className="track-container"style={{position:"relative"}}>
        <div className="pf-progress-track">
          <m.div className="pf-progress-fill"variants={fillVariants}initial="hidden"animate="visible"style={{transformOrigin:"left center"}}/>
        </div>

        {/* Milestone markers */}
        {MILESTONE_POSITIONS.map((pos,i)=><div key={i}className="milestone-container"style={{position:"absolute",left:`${pos*100}%`,top:"50%",transform:"translate(-50%, -50%)",width:"20px",height:"20px"}}>
            {/* Diamond marker */}
            <m.div className="milestone-marker"variants={markerVariants()}initial="inactive"animate={activatedMilestones.has(i)?"active":"inactive"}style={{position:"absolute",inset:0,border:activatedMilestones.has(i)?"2px solid rgba(0,255,255,0.8)":"2px solid rgba(0,200,180,0.5)",borderRadius:"50%",transform:"rotate(45deg)"}}>
              {/* Inner glow */}
              <m.div style={{position:"absolute",inset:"20%",background:"radial-gradient(circle, var(--pf-anim-cyan-light) 0%, rgba(0,255,255,0.3) 50%, transparent 100%)",// eslint-disable-line animation-rules/no-radial-angular-gradient -- radial effect required for visual design
borderRadius:"50%",opacity:activatedMilestones.has(i)?1:0,transition:"opacity 0.3s ease"}}/>
            </m.div>

            {/* Outer ring pulse */}
            {activatedMilestones.has(i)&&<m.div variants={ringVariants}initial="inactive"animate="active"style={{position:"absolute",inset:"-10px",border:"2px solid rgba(0,255,255,0.8)",borderRadius:"50%",pointerEvents:"none"}}/>}
          </div>)}

        {/* Milestone labels */}
        <div className="label-container"style={{position:"absolute",inset:0,top:"100%",marginTop:"8px",display:"flex",justifyContent:"space-between",fontSize:"10px",pointerEvents:"none"}}>
          {MILESTONE_LABELS.map((label,i)=><m.span key={i}variants={labelVariants}initial="inactive"animate={activatedMilestones.has(i)?"active":"inactive"}style={{position:"absolute",left:`${MILESTONE_POSITIONS[i]*100}%`,transform:"translateX(-50%)"}}>
              {label}
            </m.span>)}
        </div>
      </div>
    </div>}
