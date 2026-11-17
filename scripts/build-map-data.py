"""Compile public TGRAC boundaries into a shared Mercator SVG coordinate space."""
import json,re,math
from pathlib import Path
P=Path(__file__).resolve().parents[1]
model=json.loads((P/'src/data.json').read_text());nodes=model['nodes']
def norm(s):return re.sub('[^a-z]','',re.sub(r'\((SC|ST)\)','',s,flags=re.I).lower())
DISTRICT_ALIASES={'jangoan':'jangaon','jayashankarbhupalpally':'jayashankarbhoopalpally','kumurambheemasifabad':'kumurambheemasifabad'}
ASSEMBLY_ALIASES={'bellampalle':'bellampalli','secunderabadcont':'secunderabadcantonment','bahadurpura':'bahadupura','huzarabad':'huzurabad','sirisilla':'sircilla','devarakdra':'devarakadra','jadcherla':'jadcharla','kalwakurthy':'kalwakurthi','huzuranagar':'huzurnagar','miryalaguda':'miryaguda','munugode':'mungode','armur':'armoor','quthbullapur':'quthabullapur','ghanpurstation':'ghanpur','jangoan':'jangaon','narsampet':'narasampet','waradhanapet':'wardhannapet','jubileehills':'jublieehills','vikarabad':'vicarabad','thungathurthi':'thungathurthy'}
raws={'districts':json.loads((P/'data-source/district-boundaries-arcgis.json').read_text()),'assembly':json.loads((P/'data-source/assembly-boundaries-arcgis.json').read_text())}
SOURCES={'districts':'https://tgrac.telangana.gov.in/arcgis/rest/services/Hydra_Folder/Administrative_Layer/MapServer/8','assembly':'https://tgrac.telangana.gov.in/arcgis/rest/services/TGSRTC_Folder/RTC_Admin_Layers/MapServer/6'}
lookup={'districts':{norm(nodes[i]['title']):i for i in nodes['districts']['children']},'assembly':{norm(nodes[i]['title']):i for i in nodes['mlas']['children']}}
def mercator(p):return (math.radians(p[0]),-math.log(math.tan(math.pi/4+math.radians(p[1])/2)))
points=[mercator(p) for raw in raws.values() for f in raw['features'] for r in f['geometry']['rings'] for p in r]
x0=min(p[0] for p in points);x1=max(p[0] for p in points);y0=min(p[1] for p in points);y1=max(p[1] for p in points)
W=800;H=780;pad=42;scale=min((W-pad*2)/(x1-x0),(H-pad*2)/(y1-y0));tx=(W-(x1-x0)*scale)/2;ty=(H-(y1-y0)*scale)/2
def project(p):
 x,y=mercator(p);return (round((x-x0)*scale+tx,2),round((y-y0)*scale+ty,2))
def inside(p,rings):
 odd=False;x,y=p
 for r in rings:
  for i,a in enumerate(r):
   b=r[i-1]
   if (a[1]>y)!=(b[1]>y) and x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0]:odd=not odd
 return odd
def segdist(p,a,b):
 dx=b[0]-a[0];dy=b[1]-a[1];t=((p[0]-a[0])*dx+(p[1]-a[1])*dy)/(dx*dx+dy*dy) if dx or dy else 0;t=max(0,min(1,t));return (p[0]-a[0]-t*dx)**2+(p[1]-a[1]-t*dy)**2
def labelpoint(rings,bounds):
 x0,y0,x1,y1=bounds;cx=(x0+x1)/2;cy=(y0+y1)/2;sx=(x1-x0)/4;sy=(y1-y0)/4;best=(cx,cy);score=-1
 for step in range(4):
  for i in range(-2,3):
   for j in range(-2,3):
    p=(cx+i*sx,cy+j*sy)
    if inside(p,rings):
     dist=min(segdist(p,a,r[k-1]) for r in rings for k,a in enumerate(r))
     if dist>score:best=p;score=dist
  cx,cy=best;sx/=3;sy/=3
 assert inside(best,rings),'No interior label point'
 return [round(x,2) for x in best]
result={'width':W,'height':H,'projection':'WGS84 / Mercator','checked':'17 Nov 2026','sources':SOURCES,'districts':[],'assembly':[],'seatByNode':{},'districtByNode':{},'aliases':{'districts':DISTRICT_ALIASES,'assembly':ASSEMBLY_ALIASES}}
for layer,raw in raws.items():
 matched=set()
 for f in raw['features']:
  raw_name=f['attributes']['DISTRICT_N' if layer=='districts' else 'ASSEMBLY_N'];key=norm(raw_name);key=(DISTRICT_ALIASES if layer=='districts' else ASSEMBLY_ALIASES).get(key,key)
  assert key in lookup[layer],(layer,raw_name,key)
  nodeId=lookup[layer][key];assert nodeId not in matched,(layer,nodeId);matched.add(nodeId)
  rings=[]
  for r in f['geometry']['rings']:
   projected=[]
   for p in r:
    q=project(p)
    if not projected or q!=projected[-1]:projected.append(q)
   if len(projected)>=4:rings.append(projected)
  pts=[p for r in rings for p in r];bounds=[min(p[0] for p in pts),min(p[1] for p in pts),max(p[0] for p in pts),max(p[1] for p in pts)]
  svgpath=''.join('M'+'L'.join(f'{x:g},{y:g}' for x,y in r)+'Z' for r in rings)
  name=raw_name.replace('_',' ')
  name=re.sub(r'\((sc|st)\)',lambda m:'('+m[1].upper()+')',name,flags=re.I)
  if layer=='districts':name={'Jangoan':'Jangaon','Kumurambheem Asifabad':'Kumuram Bheem Asifabad','Medchal Malkajgiri':'Medchal-Malkajgiri'}.get(name,name)
  else:name={'Secunderabad Cont (SC)':'Secunderabad Cantonment (SC)'}.get(name,name)
  item=dict(key=layer+'-'+str(f['attributes']['OBJECTID']),name=name,sourceName=raw_name,nodeId=nodeId,path=svgpath,bounds=bounds,center=labelpoint(rings,bounds))
  result[layer].append(item)
  if layer=='districts':
   result['districtByNode'][nodeId]=item['key']
   for child in nodes[nodeId]['children']:result['districtByNode'][child]=item['key']
  else:result['seatByNode'][nodeId]=item['key']
 assert len(matched)==len(lookup[layer]),(layer,len(matched),len(lookup[layer]))
 result[layer].sort(key=lambda f:f['name'].lower())
# Match ministers to the constituency field in the official roster. CM is also in the MLA roster.
assembly_by_roster={norm(nodes[f['nodeId']]['title']):f['key'] for f in result['assembly']}
for n in nodes.values():
 if n['id']=='cm':
  mla=next(nodes[i] for i in nodes['mlas']['children'] if nodes[i]['sub']==n['sub']);seat=mla['title']
 elif n['id'].startswith('minister'):seat=next((v for k,v in n['fields'] if k=='Constituency'),'')
 else:continue
 if seat and seat!='Not listed':
  key=norm(seat);assert key in assembly_by_roster,(n['id'],seat)
  result['seatByNode'][n['id']]=assembly_by_roster[key]
(P/'src/map-data.json').write_text(json.dumps(result,ensure_ascii=False,separators=(',',':')))
print('Compiled',len(result['districts']),'districts and',len(result['assembly']),'Assembly constituencies')
print('Mapped',len(result['districtByNode']),'district records and',len(result['seatByNode']),'MLA / minister records')
print('Bytes',(P/'src/map-data.json').stat().st_size)
