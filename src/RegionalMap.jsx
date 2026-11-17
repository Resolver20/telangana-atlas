import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MapPin, ArrowUpRight, ArrowRight, ChevronRight, Plus, Minus, RotateCcw, Focus, Info, Globe2, Navigation2, Network } from 'lucide-react';
import geo from './map-data.json';

const allFeatures=[...geo.districts,...geo.assembly];
const byKey=Object.fromEntries(allFeatures.map(f=>[f.key,f]));
const FULL=[0,0,geo.width,geo.height];
const stateOffice=n=>['cm','cs','cabinet','cmdept','departments','governor','judiciary','commission','cmo','advisors','secretariat'].includes(n.id)||n.id.startsWith('minister')||n.id.startsWith('dept-');
function officeArea(node){
 if(geo.districtByNode[node.id])return{layer:'districts',region:geo.districtByNode[node.id],label:'District directory association'};
 if(node.kind==='MLA listing')return{layer:'assembly',region:geo.seatByNode[node.id],label:'Assembly constituency'};
 if(stateOffice(node))return{layer:'districts',region:'state',label:node.id.startsWith('minister')||node.id==='cm'?'Statewide executive remit':'State-level institution or department'};
 return{layer:'districts',region:'',label:'Specific geographic remit not supplied'};
}
function startState(node){
 const params=new URLSearchParams(location.search),scope=officeArea(node);
 const layer=['districts','assembly'].includes(params.get('layer'))?params.get('layer'):scope.layer;
 const region=params.has('region')?params.get('region'):scope.region;
 return{layer,region:region==='state'?'state':byKey[region]&&region.startsWith(layer+'-')?region:''};
}
function display(n){return (['MLA listing'].includes(n.kind)?n.sub:['MP listing','MLC listing'].includes(n.kind)?n.title:n.sub).replace(/^(Sri\.?|Smt\.?|Shri)\s*/i,'')}
export default function RegionalMap({nodes,selected,onOpenNode,renderAvatar}){
 const initial=useRef(startState(selected));
 const [labelMode,setLabelMode]=useState(()=>['all','none'].includes(new URLSearchParams(location.search).get('labels'))?new URLSearchParams(location.search).get('labels'):'auto');
 const [layer,setLayer]=useState(initial.current.layer),[region,setRegion]=useState(initial.current.region),[hovered,setHovered]=useState(''),[box,setBox]=useState(FULL),[width,setWidth]=useState(600);
 const svg=useRef(null),container=useRef(null),drag=useRef(null),wasDragged=useRef(false);
 const scope=officeArea(selected),features=geo[layer],feature=byKey[region],seat=byKey[geo.seatByNode[selected.id]];
 const activeName=region==='state'?'All Telangana':feature?.name||'Choose a region';
 const pointToSvg=(clientX,clientY)=>{const p=svg.current.createSVGPoint();p.x=clientX;p.y=clientY;return p.matrixTransform(svg.current.getScreenCTM().inverse())};
 useEffect(()=>{const observer=new ResizeObserver(entries=>setWidth(entries[0].contentRect.width));observer.observe(container.current);return()=>observer.disconnect()},[]);
 useEffect(()=>{const onPop=()=>{const next=startState(selected);setLayer(next.layer);setRegion(next.region);setBox(FULL)};window.addEventListener('popstate',onPop);return()=>window.removeEventListener('popstate',onPop)},[selected.id]);
 function choose(nextRegion,nextLayer=layer){
  setLayer(nextLayer);setRegion(nextRegion);setHovered('');
  const url=new URL(location.href);url.searchParams.set('view','map');url.searchParams.set('layer',nextLayer);url.searchParams.set('region',nextRegion);history.replaceState({},'',url);
 }
 function switchLayer(next){choose('',next);setBox(FULL)}
 function changeLabels(mode){setLabelMode(mode);const url=new URL(location.href);url.searchParams.set('labels',mode);history.replaceState({},'',url)}

 function showOffice(){choose(scope.region||'',scope.layer);setBox(FULL)}
 function zoom(factor){setBox(([x,y,w,h])=>{const next=Math.min(1000,Math.max(55,w*factor));return[x+(w-next)/2,y+(h-next*geo.height/geo.width)/2,next,next*geo.height/geo.width]})}
 function focusRegion(){if(!feature)return;const [x0,y0,x1,y1]=feature.bounds;const w=Math.min(800,Math.max((x1-x0)*1.5,(y1-y0)*1.5*geo.width/geo.height,65));setBox([(x0+x1-w)/2,(y0+y1-w*geo.height/geo.width)/2,w,w*geo.height/geo.width])}
 function selectFeature(f){if(wasDragged.current){wasDragged.current=false;return}choose(f.key)}
 const labels=useMemo(()=>{
  if(labelMode==='none')return[];
  if(labelMode==='auto'&&width<470)return[];
  const visible=features.filter(f=>f.center[0]>=box[0]&&f.center[0]<=box[0]+box[2]&&f.center[1]>=box[1]&&f.center[1]<=box[1]+box[3]);
  if(labelMode==='all')return visible.map(f=>({...f,labelName:f.name.replace(/ \((SC|ST)\)/g,'')}));
  const sorted=visible.sort((a,b)=>(Number(b.key===region)-Number(a.key===region))||((b.bounds[2]-b.bounds[0])*(b.bounds[3]-b.bounds[1])-(a.bounds[2]-a.bounds[0])*(a.bounds[3]-a.bounds[1])));
  const chosen=[];const unit=box[2]/width;
  for(const f of sorted){
   const name=f.name.replace(/ \((SC|ST)\)/g,'');const labelW=name.length*5.1*unit;const bounds=f.bounds;
   if(f.key!==region&&((bounds[2]-bounds[0])<labelW*.83||(bounds[3]-bounds[1])<21*unit))continue;
   if(chosen.some(other=>Math.abs(f.center[0]-other.center[0])<(labelW+other.labelW)/2+5*unit&&Math.abs(f.center[1]-other.center[1])<22*unit))continue;
   chosen.push({...f,labelW,labelName:name});if(chosen.length>=22)break;
  }
  return chosen;
 },[layer,region,box,width,labelMode]);

 const people=feature?layer==='districts'?nodes[feature.nodeId].children.map(id=>nodes[id]):[nodes[feature.nodeId]]:[];
 const ministers=feature&&layer==='assembly'?Object.values(nodes).filter(n=>(n.id==='cm'||n.id.startsWith('minister'))&&geo.seatByNode[n.id]===feature.key):[];
 const defaultSeat=seat&&scope.region==='state';
 return <section className="regional-explorer" aria-label="Telangana regions and jurisdictions">
  <div className="map-intro"><div><h2>Explore Telangana by region.</h2><p>Choose an area to see who serves it and how their role fits.</p></div><span className="map-source-mark"><Globe2 size={15}/> Official TGRAC boundaries</span></div>
  <div className="map-context"><div className="map-context-icon"><Network size={19}/></div><div><span>OFFICE YOU’RE EXPLORING</span><p><strong>{selected.title}</strong>{selected.sub&&<> · {display(selected)}</>}</p><small>{scope.label}</small></div><button className="map-context-button" onClick={showOffice}>Show its area <MapPin size={14}/></button></div>
  <div className="map-toolbar">
   <div className="map-layer-tabs" role="group" aria-label="Boundary layer"><button aria-pressed={layer==='districts'} onClick={()=>switchLayer('districts')}>Districts <span>33</span></button><button aria-pressed={layer==='assembly'} onClick={()=>switchLayer('assembly')}>Assembly seats <span>119</span></button></div>
   <label className="region-select-label"><MapPin size={15}/><span className="sr-only">Select a {layer==='districts'?'district':'constituency'}</span><select aria-label={layer==='districts'?'Select district':'Select Assembly constituency'} value={region} onChange={e=>choose(e.target.value)}><option value="">Choose {layer==='districts'?'a district':'an Assembly seat'}</option><option value="state">All Telangana</option>{features.map(f=><option key={f.key} value={f.key}>{f.name}</option>)}</select></label>
  </div>
  <div className="map-label-controls"><label>Map labels <select aria-label="Map labels" value={labelMode} onChange={e=>changeLabels(e.target.value)}><option value="auto">Fit available space</option><option value="all">All names</option><option value="none">Hide labels</option></select></label><span>{labels.length} of {features.length} area names labelled at this zoom</span></div>
  {labelMode==='all'&&<p className="all-labels-hint">Every area name is enabled. Zoom into crowded areas to separate labels, or select a region to see its officials.</p>}
  <div className="map-layout">
   <div className="map-surface" ref={container}>
    <div className="map-surface-heading"><div><span>{layer==='districts'?'ADMINISTRATIVE DISTRICTS':'ASSEMBLY CONSTITUENCIES'}</span><strong>{activeName}</strong></div><div className="north-arrow" aria-label="North"><Navigation2 size={18}/><span>N</span></div></div>
    <div className="map-drawing">
     <svg ref={svg} viewBox={box.join(' ')} className="telangana-map" role="group" aria-labelledby="tg-regional-map-title tg-regional-map-desc"
      onPointerDown={e=>{if(e.button!==0||e.pointerType==='touch')return;wasDragged.current=false;drag.current={point:pointToSvg(e.clientX,e.clientY),box:[...box],client:[e.clientX,e.clientY]}}}
      onPointerMove={e=>{if(!drag.current)return;const movement=Math.hypot(e.clientX-drag.current.client[0],e.clientY-drag.current.client[1]);if(movement<5)return;wasDragged.current=true;const rect=svg.current.getBoundingClientRect();const dx=(e.clientX-drag.current.client[0])*drag.current.box[2]/rect.width,dy=(e.clientY-drag.current.client[1])*drag.current.box[3]/rect.height;setBox([drag.current.box[0]-dx,drag.current.box[1]-dy,...drag.current.box.slice(2)])}}
      onPointerUp={()=>{drag.current=null}} onPointerLeave={()=>{drag.current=null;setHovered('')}}>
      <title id="tg-regional-map-title">Telangana {layer==='districts'?'district':'Assembly constituency'} map</title>
      <desc id="tg-regional-map-desc">{features.length} selectable regions from the Telangana government GIS service. Use the region selector, or focus a shape and use arrow keys and Enter. District and electoral boundaries are different. Highlighted scope: {activeName}.</desc>
      {features.map((f,i)=><path key={f.key} data-region={f.key} d={f.path} fillRule="evenodd" vectorEffect="non-scaling-stroke" className={`region-shape ${region==='state'?'state-scope':''} ${region===f.key?'selected':''}`} role="button" aria-label={`${f.name} ${layer==='districts'?'district':'Assembly constituency'}`} aria-pressed={region===f.key} tabIndex={region===f.key||(!feature&&i===0)?0:-1}
       onMouseEnter={()=>setHovered(f.key)} onMouseLeave={()=>setHovered('')} onFocus={()=>setHovered(f.key)} onBlur={()=>setHovered('')} onClick={()=>selectFeature(f)}
       onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose(f.key)}else if(['ArrowRight','ArrowDown','ArrowLeft','ArrowUp'].includes(e.key)){e.preventDefault();const next=features[(i+(['ArrowRight','ArrowDown'].includes(e.key)?1:features.length-1))%features.length];svg.current.querySelector(`[data-region="${next.key}"]`)?.focus()}}}><title>{f.name}</title></path>)}
      <g className="region-labels" aria-hidden="true">{labels.map(f=><text key={f.key} x={f.center[0]} y={f.center[1]} fontSize={11*box[2]/width} textAnchor="middle" dominantBaseline="middle" className={f.key===region?'active-label':''} style={{strokeWidth:2.4*box[2]/width}}>{f.labelName}</text>)}</g>
     </svg>
     {hovered&&byKey[hovered]&&<div className="map-hover-name"><MapPin size={13}/>{byKey[hovered].name}</div>}
     <div className="map-zoom-tools"><button onClick={()=>zoom(.7)} aria-label="Zoom in"><Plus size={17}/></button><button onClick={()=>zoom(1.4)} aria-label="Zoom out"><Minus size={17}/></button><button onClick={()=>setBox(FULL)} aria-label="Reset map view"><RotateCcw size={15}/></button></div>
    </div>
    <div className="map-legend"><span><i className={`legend-selected ${region==='state'?'legend-state':''}`}/>{region==='state'?'State overview':'Selected region'}</span><span><i/>Other {layer==='districts'?'districts':'seats'}</span><span>Tap a region to explore</span></div>
    <div className="map-attribution"><a href={geo.sources[layer]} target="_blank" rel="noreferrer">Boundaries: Telangana Remote Sensing Applications Centre <ArrowUpRight size={12}/></a><span>Simplified for display</span></div>
   </div>
   <aside className="region-panel" aria-label="People and roles for selected region" aria-live="polite">
    <div className="region-panel-heading"><span className="region-panel-icon"><MapPin size={20}/></span><div><span>{region==='state'?(scope.region==='state'?'STATE-LEVEL SCOPE':'STATE OVERVIEW'):feature?layer==='districts'?'DISTRICT DIRECTORY':'ELECTORAL CONSTITUENCY':'REGIONAL EXPLORER'}</span><h3>{activeName}</h3></div></div>
    {feature&&<button className="focus-region-button" onClick={focusRegion}><Focus size={15}/> Zoom to this region</button>}
    {feature?<>
     <p className="region-description">{layer==='districts'?'Officials grouped under this district in the state portal. Open a person to see their role and the hierarchy.':'The MLA listed for this Assembly constituency. This is an electoral area, which can differ from a district.'}</p>
     <h4 className="region-list-heading">{layer==='districts'?'Listed district officials':'Member of Legislative Assembly'}</h4>
     <div className="region-people">{people.map(n=><button className="region-person" key={n.id} onClick={()=>onOpenNode(n.id)}>{renderAvatar(n,'small')}<span><strong>{layer==='assembly'?display(n):n.title}</strong><small>{layer==='assembly'?n.fields.find(([k])=>k==='Party listed')?.[1]||n.title:display(n)}</small><em>Open role & hierarchy <ArrowRight size={12}/></em></span><ChevronRight size={15}/></button>)}</div>
     {ministers.length>0&&<><h4 className="region-list-heading">Also holds a statewide office</h4>{ministers.map(n=><button className="region-person" key={n.id} onClick={()=>onOpenNode(n.id)}>{renderAvatar(n,'small')}<span><strong>{n.title}</strong><small>{display(n)}</small><em>Portfolio remit covers the state</em></span><ChevronRight size={15}/></button>)}</>}
     <div className="region-geography-note"><Info size={15}/><p>{layer==='districts'?'Civil district boundaries are shown. Police commissionerates and electoral constituencies can cover different areas; the roster is a directory association, not a traced police jurisdiction.':'A seat represents an electoral constituency. A minister elected here can have statewide portfolio responsibilities, not just responsibilities in this seat.'}</p></div>
     <button className="open-region-hierarchy" onClick={()=>onOpenNode(feature.nodeId)}>{layer==='districts'?'Open district hierarchy':'Open MLA role & hierarchy'} <ArrowRight size={15}/></button>
    </>:region==='state'?<>
     <p className="region-description">{scope.region==='state'?'State-level responsibilities are shown across Telangana. Separate institutions are not placed under the Chief Minister.':'The entire state is shown for geographic context. This overview does not assign statewide jurisdiction to the selected entry.'}</p>
     <div className="state-scope-card">{renderAvatar(selected,'normal')}<div><strong>{selected.title}</strong>{selected.sub&&<span>{display(selected)}</span>}</div><p>{selected.role.summary}</p><button onClick={()=>onOpenNode(selected.id)}>View role & hierarchy <ArrowRight size={14}/></button></div>
     {defaultSeat&&<div className="elected-seat-card"><span>ELECTED ASSEMBLY SEAT</span><strong>{seat.name}</strong><p>This elected seat is separate from the office’s statewide responsibilities.</p><button onClick={()=>{choose(seat.key,'assembly');setBox(FULL)}}>Show elected seat <ArrowRight size={14}/></button></div>}
     <p className="map-small-note">Select any district to see its officials, or switch to Assembly seats to find an MLA.</p>
    </>:<>
     <p className="region-description">Choose one of {layer==='districts'?'33 districts':'119 Assembly constituencies'} on the map or from the selector above.</p>
     {scope.region===''&&<div className="region-geography-note"><Info size={15}/><p>The selected directory entry does not supply a directly mapped district or Assembly seat. No geographic jurisdiction is inferred for this post.</p></div>}
     {seat&&<button className="open-region-hierarchy" onClick={()=>{choose(seat.key,'assembly');setBox(FULL)}}>Show {seat.name} <MapPin size={14}/></button>}
     <div className="map-explainer"><h4>Two views of the same state</h4><p><strong>Districts</strong> connect you to district administration and the published district officials.</p><p><strong>Assembly seats</strong> connect you to elected MLAs.</p><p>State-level roles cover wider responsibilities than an individual electoral seat.</p></div>
    </>}
   </aside>
  </div>
  <div className="map-bottom-note"><Info size={15}/><p>This map shows administrative and electoral areas, not exact office buildings or live locations. Parliamentary and Council constituency boundaries are not included. <a href="https://www.telangana.gov.in/about/districts/" target="_blank" rel="noreferrer">Official district reference <ArrowUpRight size={12}/></a></p></div>
 </section>
}
