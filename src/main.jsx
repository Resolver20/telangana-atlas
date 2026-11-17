import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Landmark, Network, Users, Building2, MapPin, Scale, ShieldCheck, BookOpen, Search, ArrowUpRight, ChevronRight, ArrowLeft, ArrowRight, Menu, X, Info, BriefcaseBusiness, Camera, ListTree, Check, Mail, Phone, ExternalLink } from 'lucide-react';
import data from './data.json';
import RegionalMap from './RegionalMap.jsx';
import './styles.css';

const nodes=data.nodes;
Object.values(nodes).forEach(n=>{n.role=data.roles[n.roleId]});
const primary=[['cm','Executive government',Network],['governor','Governor',Landmark],['legislature','State Legislature',BookOpen],['judiciary','Judiciary',Scale],['commission','Information Commission',ShieldCheck],['parliament','Parliament representatives',Users],['public-bodies','Other public bodies',Landmark]];
const shortcuts=[['departments','All departments',Building2],['districts','District directory',MapPin],['secretariat','Secretariat officials',BriefcaseBusiness]];
const parents={}; Object.values(nodes).forEach(n=>n.children.forEach(id=>(parents[id]??=[]).push(n.id)));
function findPath(id){
 if(!nodes[id]) return ['root','cm'];
 const queue=[['root']];const seen=new Set(['root']);
 for(let i=0;i<queue.length;i++){const p=queue[i],last=p.at(-1);if(last===id)return p;for(const c of nodes[last].children)if(!seen.has(c)){seen.add(c);queue.push([...p,c])}}
 return ['root','cm'];
}
function initialView(){return new URLSearchParams(location.search).get('view')==='map'?'map':'hierarchy'}
function initialPath(){return findPath(new URLSearchParams(location.search).get('node')||'cm')}
function displayName(n){return (['MP listing','MLC listing'].includes(n.kind)?n.title:n.sub).replace(/^(Sri\.?|Smt\.?|Shri|sri)\s*/i,'')}
function shortKind(n){return n.kind.replace(' / directory heading','').replace('Directory entry','Listed office')}
function category(n){
 if(n.id.startsWith('dept-'))return 'Department';
 if(n.kind==='MLA listing')return 'Member of Legislative Assembly';
 if(n.kind==='MLC listing')return 'Member of Legislative Council';
 if(n.kind==='MP listing')return 'Member of Parliament';
 return n.title;
}
function iconFor(n){if(n.id==='districts'||n.kind==='District directory')return MapPin;if(n.kind.includes('Judic')||n.id==='judiciary')return Scale;if(n.id==='commission')return ShieldCheck;if(n.id.startsWith('dept-'))return Building2;if(n.kind.includes('Membership'))return Users;return Landmark;}
function Avatar({node,size='normal'}){
 const [failed,setFailed]=useState(false),[logoFailed,setLogoFailed]=useState(false),[remoteReady,setRemoteReady]=useState(false);
 useEffect(()=>{setFailed(false);setLogoFailed(false);setRemoteReady(false)},[node.id,node.photo]);
 useEffect(()=>{
  if(!node.logo?.remote)return;
  const probe=new Image();let alive=true;
  const timer=setTimeout(()=>{probe.onload=null;probe.onerror=null;probe.src=''},4000);
  probe.onload=()=>{clearTimeout(timer);if(alive)setRemoteReady(true)};
  probe.onerror=()=>{clearTimeout(timer)};
  probe.src=node.logo.remote;
  return()=>{alive=false;clearTimeout(timer);probe.onload=null;probe.onerror=null;probe.src=''};
 },[node.id,node.logo?.remote]);
 const Icon=iconFor(node),photo=node.photo&&!failed,logo=!photo&&node.logo&&!logoFailed;
 const localPath=path=>import.meta.env.BASE_URL+path.replace(/^\//,'');
 const logoPath=logo?(remoteReady?node.logo.remote:localPath(node.logo.path||node.logo.fallback)):'';
 return <div className={`avatar avatar-${size} ${photo?'has-photo':logo?'has-logo':''}`}>
  {photo?<img src={localPath(node.photo)} alt={displayName(node)||node.title} loading={size==='hero'?'eager':'lazy'} onError={()=>setFailed(true)}/>:logo?<img src={logoPath} alt={node.logo.kind==='shared-state-emblem'||(node.logo.remote&&!remoteReady)?'Government of Telangana emblem':node.logo.name+' official branding'} loading={size==='hero'?'eager':'lazy'} onError={()=>setLogoFailed(true)}/>:<Icon aria-hidden="true"/>}
 </div>;
}
function App(){
 const [view,setView]=useState(initialView);
 const [path,setPath]=useState(initialPath),[query,setQuery]=useState(''),[menu,setMenu]=useState(false),[page,setPage]=useState(0),[showSources,setShowSources]=useState(false),[copied,setCopied]=useState(false);
 const search=useRef(null),main=useRef(null);const selected=nodes[path.at(-1)];
 const perPage=18,children=selected.children.map(id=>nodes[id]),pageCount=Math.ceil(children.length/perPage);
 const results=useMemo(()=>{const q=query.trim().toLowerCase();if(!q)return[];const tokens=q.split(/\s+/);return Object.values(nodes).filter(n=>tokens.every(t=>(n.title+' '+n.sub+' '+n.kind+' '+(n.aliases||[]).join(' ')).toLowerCase().includes(t))).sort((a,b)=>Number(b.title.toLowerCase().startsWith(q))-Number(a.title.toLowerCase().startsWith(q))).slice(0,18)},[query]);
 useEffect(()=>{const pop=()=>{setPath(initialPath());setView(initialView());setPage(0);setQuery('')};window.addEventListener('popstate',pop);return()=>window.removeEventListener('popstate',pop)},[]);
 useEffect(()=>{document.title=`${view==='map'?'Regional map':selected.title} · Telangana Atlas`},[selected.id,view]);
 useEffect(()=>{if(!menu&&!showSources)return;const old=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{document.body.style.overflow=old}},[menu,showSources]);
 useEffect(()=>{const key=e=>{if(e.key==='Escape'){setMenu(false);setShowSources(false);setQuery('');search.current?.blur()}};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key)},[]);
 function navigate(id,nextPath,targetView='hierarchy'){
  const p=nextPath||findPath(id);setPath(p);setView(targetView);setPage(0);setQuery('');setMenu(false);setCopied(false);
  const u=new URL(location.href);u.searchParams.set('node',id);u.searchParams.delete('region');u.searchParams.delete('layer');if(targetView==='map')u.searchParams.set('view','map');else u.searchParams.delete('view');history.pushState({},'',u);
  main.current?.focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});
 }
 function sectionActive(id){if(view==='map')return false;return path.includes(id)||(id==='cm'&&['departments','districts','secretariat'].includes(selected.id))}
 async function copyLink(){try{await navigator.clipboard.writeText(location.href);setCopied(true);setTimeout(()=>setCopied(false),2000)}catch{setCopied(false)}}
 function changeView(next){navigate(selected.id,path,next)}
 function openSources(){setShowSources(true);setTimeout(()=>document.getElementById('close-sources')?.focus(),0)}
 return <div className="app">
  <header className="site-header">
   <button className="mobile-toggle icon-button" onClick={()=>setMenu(!menu)} aria-expanded={menu} aria-controls="main-navigation" aria-label={menu?'Close navigation':'Open navigation'}>{menu?<X/>:<Menu/>}</button>
   <a className="brand" href="?node=cm" onClick={e=>{e.preventDefault();navigate('cm')}}><span className="brand-mark"><Landmark/></span><span>Telangana <strong>Atlas</strong><small>Government, explained.</small></span></a>
   <div className="header-right"><span className="independent-label">An independent guide</span><button className="text-button sources-button" onClick={openSources}>About & sources <ArrowUpRight size={15}/></button></div>
  </header>
  {menu&&<button className="sidebar-scrim" aria-label="Close navigation" onClick={()=>setMenu(false)}/>}
  <aside className={`sidebar ${menu?'is-open':''}`} id="main-navigation">
   <div className="sidebar-intro">EXPLORE THE GOVERNMENT</div>
   <nav aria-label="Government institutions">
    {primary.map(([id,label,Icon])=><button className={`nav-item ${sectionActive(id)?'active':''}`} key={id} onClick={()=>navigate(id)} aria-current={sectionActive(id)?'page':undefined}><Icon size={19}/><span>{label}</span>{sectionActive(id)&&<span className="active-dot"/>}</button>)}
   </nav>
   <div className="sidebar-divider"/>
   <button className={`nav-item map-navigation ${view==='map'?'active':''}`} onClick={()=>changeView('map')}><MapPin size={19}/><span>Regions & map</span></button>
   <div className="sidebar-intro">FIND YOUR WAY</div>
   <nav aria-label="Directories">{shortcuts.map(([id,label,Icon])=><button className={`nav-item ${view==='hierarchy'&&path.includes(id)?'active':''}`} key={id} onClick={()=>navigate(id)}><Icon size={18}/><span>{label}</span></button>)}</nav>
   <button className="all-institutions" onClick={()=>navigate('root')}><ListTree size={17}/> All institutions <ArrowRight size={15}/></button>
   <div className="sidebar-bottom"><div className="snapshot-dot"/><span>Official portal snapshot<br/><strong>{data.checked}</strong></span><button className="icon-button" aria-label="About this snapshot" onClick={openSources}><Info size={17}/></button></div>
  </aside>
  <main id="main-content" className="main" ref={main} tabIndex={-1}>
   <div className="workspace-top"><div><div className="workspace-label">THE GOVERNMENT EXPLORER</div><h1>{view==='map'?'People, places & responsibility.':'People, powers & purpose.'}</h1><p>{view==='map'?'See the areas served by public offices and elected representatives.':'Follow the hierarchy. Understand every role.'}</p></div>
    <div className="search-wrap"><Search size={18} aria-hidden="true"/><input ref={search} type="search" placeholder="Search a person, role or department" aria-label="Search people, roles and departments" value={query} onChange={e=>setQuery(e.target.value)} aria-controls={query?'search-results':undefined} aria-expanded={Boolean(query)}/>{query&&<button className="icon-button" aria-label="Clear search" onClick={()=>setQuery('')}><X size={16}/></button>}
     {query&&<div className="search-results" id="search-results"><div className="search-result-heading">{results.length?'Matching directory entries':'No matching entries'}</div>{results.map(n=><button key={n.id} className="search-result" onClick={()=>navigate(n.id)}><Avatar node={n} size="small"/><span><strong>{n.title}</strong><small>{displayName(n)||shortKind(n)}</small></span><ChevronRight size={15}/></button>)}{!results.length&&<p>Try “Finance”, “Collector” or an official’s surname.</p>}</div>}
    </div>
   </div>
   <div className="workspace-rule"/>
   <div className="view-switcher" role="group" aria-label="Explorer view"><button aria-pressed={view==='hierarchy'} onClick={()=>changeView('hierarchy')}><Network size={16}/> Hierarchy</button><button aria-pressed={view==='map'} onClick={()=>changeView('map')}><MapPin size={16}/> Regions & map</button></div>
   {view==='hierarchy'&&<nav className="breadcrumbs" aria-label="Current hierarchy path">{path.map((id,i)=><React.Fragment key={id}>{i>0&&<ChevronRight size={13} aria-hidden="true"/>}<button onClick={()=>navigate(id,path.slice(0,i+1))} aria-current={i===path.length-1?'location':undefined}>{id==='root'?'Telangana':nodes[id].title}</button></React.Fragment>)}</nav>}
   {view==='map'?<RegionalMap key={selected.id} nodes={nodes} selected={selected} onOpenNode={id=>navigate(id)} renderAvatar={(node,size)=><Avatar node={node} size={size}/>}/>:<div className="explorer-layout">
    <div className="hierarchy-main">
     <article className={`focus-profile ${selected.photo?'with-portrait':''}`} key={selected.id}>
      <div className="profile-topline"><span className="relationship-label"><span/>{shortKind(selected)}</span><button className="text-button share-button" onClick={copyLink}>{copied?<Check size={14}/>:<ExternalLink size={14}/>} {copied?'Copied':'Copy link'}</button></div>
      <div className="profile-core"><Avatar node={selected} size="hero"/><div><h2>{category(selected)}</h2>{selected.sub&&<div className="person-name">{displayName(selected)}</div>}<p>{selected.role.summary}</p></div></div>
      {selected.logo&&!selected.photo&&<a className="photo-credit logo-credit" href={selected.logo.original} target="_blank" rel="noreferrer"><Landmark size={12}/>{selected.logo.kind==='shared-state-emblem'?'Shared Telangana state emblem':selected.logo.remote?'Official logo source · shared emblem fallback':'Official organization branding'}<ArrowUpRight size={12}/></a>}
      {selected.photo&&<a className="photo-credit" href={selected.photoOriginal} target="_blank" rel="noreferrer"><Camera size={12}/> Official portal portrait <ArrowUpRight size={12}/></a>}
     </article>
     {children.length>0?<section className="connections" aria-label="Connected branches">
      <div className="connection-line" aria-hidden="true"/>
      <div className="section-heading"><div><h3>{selected.id==='cm'?'Explore the executive':selected.id==='cabinet'?'The Council of Ministers':selected.id==='districts'?'District directories':selected.id==='departments'?'State departments':selected.id==='root'?'Government & institutions':'Explore this branch'}</h3><p>{selected.id==='cabinet'?'14 ministers, in addition to the Chief Minister.':`${children.length} ${children.length===1?'entry':'entries'} · ${relationLabel(selected)}`}</p></div><span className="branch-icon"><Network size={19}/></span></div>
      <div className="branch-grid">{children.slice(page*perPage,(page+1)*perPage).map(n=><button className={`branch-card ${n.photo?'person-card':''}`} key={n.id} onClick={()=>navigate(n.id,[...path,n.id])}>
       <div className="branch-card-top"><Avatar node={n}/><span className="branch-open"><ChevronRight size={17}/></span></div>
       <div className="branch-card-copy"><span className="branch-kind">{n.kind==='MLA listing'?'ASSEMBLY CONSTITUENCY':n.kind==='MP listing'?'MEMBER OF PARLIAMENT':n.kind==='MLC listing'?'COUNCIL MEMBER':shortKind(n)}</span><h4>{n.title}</h4>{n.sub&&<p className="branch-name">{['MP listing','MLC listing'].includes(n.kind)?n.sub:displayName(n)}</p>}<p className="branch-description">{n.role.summary}</p></div>
       <span className="branch-footer">{n.children.length?`${n.children.length} ${n.children.length===1?'entry':'entries'}`:'View role & details'} <ArrowRight size={14}/></span>
      </button>)}</div>
      {pageCount>1&&<div className="pagination"><span>Showing {page*perPage+1}–{Math.min((page+1)*perPage,children.length)} of {children.length}</span><div><button className="page-button" disabled={page===0} aria-label="Previous entries" onClick={()=>setPage(p=>p-1)}><ArrowLeft size={16}/></button><span>{page+1} / {pageCount}</span><button className="page-button" disabled={page===pageCount-1} aria-label="Next entries" onClick={()=>setPage(p=>p+1)}><ArrowRight size={16}/></button></div></div>}
     </section>:<section className="leaf-note"><Check size={18}/><div><h3>You’ve reached a listed office.</h3><p>Its role and available contact details appear alongside. Use the path above to explore related offices.</p></div></section>}
     <div className="relationship-note"><Info size={16}/><p>{relationExplanation(selected)}</p></div>
    </div>
    <aside className="role-panel" aria-label="Role and responsibilities"><div className="role-panel-heading"><span className="role-icon"><BriefcaseBusiness size={18}/></span><div><h3>What this role does</h3><p>In plain English</p></div></div>
     <ol className="duties">{selected.role.tasks.map((task,i)=><li key={task}><span>{String(i+1).padStart(2,'0')}</span><p>{task}</p></li>)}</ol>
     {selected.role.qualified&&<div className="indicative-note"><Info size={14}/><span>General role overview. The source does not provide a complete duty statement for this specific post.</span></div>}
     {selected.fields.length>0&&<div className="official-details"><h4>From the official listing</h4>{selected.fields.map(([label,value],i)=><div className="detail-row" key={i}><span>{label}</span><p>{value}</p></div>)}</div>}
     <div className="source-links">{selected.source&&<a href={selected.source} target="_blank" rel="noreferrer">Official directory <ArrowUpRight size={15}/></a>}{selected.role.source&&<a href={selected.role.source} target="_blank" rel="noreferrer">Role reference <ArrowUpRight size={15}/></a>}{selected.sub&&!selected.photo&&!selected.logo&&<span className="no-photo"><Camera size={13}/> Portrait not included in this snapshot</span>}</div>
    </aside>
   </div>}
   <footer className="page-footer"><span>Built for understanding. Based on public government information.</span><button onClick={openSources}>Sources & coverage <ArrowUpRight size={14}/></button><p>Independent guide · Listings are a snapshot, not live personnel data.</p></footer>
  </main>
  {showSources&&<div className="modal-backdrop" onClick={()=>setShowSources(false)}><section className="sources-modal" role="dialog" aria-modal="true" aria-labelledby="sources-title" onClick={e=>e.stopPropagation()} onKeyDown={e=>{if(e.key==='Tab'){const f=e.currentTarget.querySelectorAll('button,a[href]'),first=f[0],last=f[f.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}}}><button id="close-sources" className="icon-button modal-close" aria-label="Close sources" onClick={()=>setShowSources(false)}><X/></button><Landmark className="modal-symbol" size={32}/><h2 id="sources-title">A clearer view of government.</h2><p className="modal-intro">Telangana Atlas is an independent educational guide to the people, offices and institutions listed on the Telangana State Portal.</p><h3>What’s included</h3><p>15 Council of Ministers entries including the CM, 41 portal department pages plus the disability/senior-citizens/transgender portfolio branch, 33 district directories, Secretariat officials, 119 MLA entries, 34 MLC entries, 24 MP entries, the High Court directory, six Information Commission members and ten advisors.</p><h3>Read the connections correctly</h3><p>Minister-to-department connections show published portfolio responsibility. Contacts within departments and districts are directory groupings. They do not establish a full reporting chain. The Legislature, Judiciary, Governor, Information Commission and Parliament representatives are shown separately from the CM-led executive.</p><h3>Roles & official photographs</h3><p>{data.roleNote} Portraits come from official Telangana portal pages and are credited with their original links. Profiles use available portraits, verified organization branding or an institution symbol.</p><h3>Coverage audit</h3><p>The original import missed 35 body/office entries within the sources checked: 30 from the current 201-entry department/HOD register and five additional state-directory bodies. Thirteen grouped or alternate-name entries were reviewed separately. These corrections do not establish an exhaustive list of every state agency, local body, field office or incumbent. <a href={data.coverageAudit.report} target="_blank" rel="noreferrer">Read the entry-by-entry coverage audit.</a></p><h3>Department and agency branding</h3><p>Official branding is shown where verified. A shared Telangana state emblem is explicitly labelled when a separate department mark was not verified. Thirty logo/emblem files are bundled; HYDRAA’s official logo is linked from its agency site, with the state emblem shown if that host cannot be reached.</p><h3>Map regions & jurisdictions</h3><p>The map uses public TGRAC GIS layers for all 33 districts and 119 Assembly constituencies. Districts link to the official district directory; Assembly shapes link to MLA roster entries using explicit spelling aliases. A minister’s elected seat is shown separately from statewide portfolio scope. District directory associations do not establish exact police commissionerate boundaries. Parliamentary and Council constituency shapes are not included, and no map indicates live locations or exact office buildings.</p><h3>Snapshot & limitations</h3><p>Checked {data.checked}. The portal may contain outdated or inconsistent names, contacts and political-party labels. Duplicate tables and visibly unrelated electricity / forest tables on other department pages were excluded. This is not a certified organogram or an official government website.</p><div className="modal-sources"><a href="https://tgrac.telangana.gov.in/arcgis/rest/services/Hydra_Folder/Administrative_Layer/MapServer/8" target="_blank" rel="noreferrer">Official district boundaries <ArrowUpRight size={15}/></a><a href="https://tgrac.telangana.gov.in/arcgis/rest/services/TGSRTC_Folder/RTC_Admin_Layers/MapServer/6" target="_blank" rel="noreferrer">Official Assembly boundaries <ArrowUpRight size={15}/></a><a href="https://www.telangana.gov.in/government/council-of-ministers/" target="_blank" rel="noreferrer">Council of Ministers <ArrowUpRight size={15}/></a><a href="https://www.telangana.gov.in/contacts/secretariat/" target="_blank" rel="noreferrer">Secretariat directory <ArrowUpRight size={15}/></a><a href="https://www.telangana.gov.in/contacts/district-officials/" target="_blank" rel="noreferrer">District officials <ArrowUpRight size={15}/></a><a href="https://www.telangana.gov.in/rti/information-commission/" target="_blank" rel="noreferrer">Information Commission <ArrowUpRight size={15}/></a></div></section></div>}
  <span className="sr-only" aria-live="polite">{selected.title}. {children.length} connected entries.</span>
 </div>
}
function relationLabel(n){if(n.id==='cm'||n.id==='cabinet')return 'executive leadership';if(n.id.startsWith('minister')||n.id==='cmdept')return 'portfolio responsibility';if(n.id==='root')return 'separate public institutions';if(n.kind.includes('Membership')||['mlas','mlcs'].includes(n.id))return 'membership directory';return 'official directory grouping'}
function relationExplanation(n){if(n.id==='agency-hydraa'||n.id.startsWith('hydraa-'))return 'Connections follow HYDRAA’s published organization structure. Its notified CURE remit is not the same as all of Telangana or Hyderabad district alone.';if(n.kind==='Government office · 2026–27 staffing register'||n.id==='public-bodies')return 'This association is based on the published staffing register or discovery grouping. It does not by itself establish every legal or day-to-day reporting relationship.';if(n.id==='root')return 'These are distinct public institutions, not a single chain of command.';if(n.id.startsWith('minister')||n.id==='cmdept')return 'Department connections follow the portfolios listed by the official portal.';if(n.id==='cm')return 'The CM leads the executive. Separate institutions are accessible in the navigation.';return 'Connections group published directory entries. They do not imply that every listed person reports directly to the person above.'}

createRoot(document.getElementById('root')).render(<App/>);
