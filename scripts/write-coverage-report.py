"""Validate reviewed coverage mappings and write the public audit report."""
import json,re
from pathlib import Path
P=Path(__file__).resolve().parents[1]
a=json.loads((P/'data-source/audit/register-coverage.json').read_text());m=json.loads((P/'src/data.json').read_text());nodes=m['nodes'];logos=json.loads((P/'logo-sources.json').read_text())['assets']
assert len(a['entries'])==201
assert a['baselineCounts']=={'represented':158,'grouped_or_label_gap':13,'absent':30}
assert len(a['additionalDirectoryBodies'])==5
assert a['confirmedMissingEntriesWithinScope']==35
for row in a['entries']:
 ids=[row['resolvedNodeId']] if row.get('resolvedNodeId') else row['baselineNodeIds']
 assert ids,(row['index'],row['name'])
 assert all(id in nodes for id in ids),row
for logo in logos:
 if logo.get('path'):assert (P/'public'/logo['path'].lstrip('/')).is_file(),logo['id']
 for id in logo['nodeIds']:assert id in nodes,id
# Every node must be reachable and the structure must remain acyclic, even with multiple discovery parents.
seen=set()
def walk(id,ancestors):
 assert id not in ancestors,('cycle',id)
 if id in seen:return
 seen.add(id)
 for child in nodes[id]['children']:walk(child,ancestors|{id})
walk('root',set());assert seen==set(nodes),(len(seen),len(nodes))
lines=['# Telangana Atlas coverage audit','', 'Checked: **17 November 2026**. Baseline: initial published commit `d6a53d86bff053baab99844db82b0a579f25993f`.','', '## What went wrong','', 'The initial import treated 41 portal navigation pages and selected contact tables as a sufficient coverage check. It did not reconcile those tables against the government’s HOD register, the broader state web directory or agency-specific sites. Some offices were also represented only through a shared contact heading. Department-page coverage was wrongly allowed to suggest that all agencies were included.','', '## Verified result within this audit scope','', '| Comparison | Result |','| --- | ---: |','| Current 2026–27 department/HOD register entries checked | 201 |','| Already represented at the relevant department, office or body level | 158 |','| Present only through a grouped contact or naming variation | 13 |','| Missing body/office entries in that register | 30 |','| Additional missing bodies named by the state web directory | 5 |','| **Confirmed missing entries within these sources, including HYDRAA** | **35** |','', '**HYDRAA was one of the 35 omissions; there were 34 other missing entries within the sources checked.** The 13 grouping/name gaps are reported separately and are not added to the omission count.','', 'All 35 missing entries have now been added. The grouped cases have individual discovery entries or documented aliases as appropriate. No current officeholder is invented when a source only identifies a body or budget office.','', 'This is a bounded reconciliation, not certification of every state agency, university, local body, scheme, subordinate field office or present incumbent. A staffing heading confirms inclusion in that fiscal-year register; it does not alone prove current operational status or all legal powers.','', '## Sources and method','', f"1. [Current 2026–27 budget landing page]({a['sourceLandingPage']}) and its [Employee Strength of Government Departments appendix]({a['source']}). The index contains 201 numbered entries on PDF pages 5–9.", '2. [State Web Directory](https://www.telangana.gov.in/state-web-directory/), all 95 data rows reviewed. Service portals, schemes and duplicate website entries are not counted as distinct missing agencies.', '3. All 41 original department pages were fetched and their linked official sites reviewed for additional body references and branding.', '4. [HYDRAA’s own agency profile](https://hydraa.telangana.gov.in/about) confirms MA&UD association, the Commissioner and the published operational structure. Its CURE remit is not replaced by a district-wide or statewide polygon.', '5. Matching is explicit and manually reviewed. The machine-readable [register audit](data-source/audit/register-coverage.json) records each original status and its matching/resolved node id; fuzzy string similarity was not accepted as proof of identity.','', 'The initially discovered March-path register was the older 2025–26 document. It was superseded for this audit by the May-path 2026–27 register linked from the current budget page.','', '## The 30 missing register entries','', '| Register no. | Original register heading | Added entry |','| --- | --- | --- |']
for r in a['entries']:
 if r['baselineStatus']=='absent':lines.append(f"| {r['index']} | {r['name']} | [{nodes[r['resolvedNodeId']]['title']}](https://resolver20.github.io/telangana-atlas/?node={r['resolvedNodeId']}) |")
lines+=['','## Five additional bodies from the state directory','', '| Body | Source website |','| --- | --- |']
for row in a['additionalDirectoryBodies']:lines.append(f"| {row['name']} | [Official website]({row['website']}) |")
lines+=['','## Thirteen grouped or naming cases','', '| Register no. | Heading | Baseline limitation | Resolution |','| --- | --- | --- | --- |']
for r in a['entries']:
 if r['baselineStatus']=='grouped_or_label_gap':lines.append(f"| {r['index']} | {r['name']} | {r['note']} | `{r['resolvedNodeId']}` |")
lines+=['','## Logos and source availability','', f"- **{m['logoCounts']['departmentBranches']} department/portfolio branches** display a verified published mark or the explicitly labelled shared Telangana state emblem. This is 41 original portal categories plus the added disability/senior-citizens/transgender portfolio branch; it is not a claim that there are exactly 42 formal Secretariat departments.", '- **30 local logo/emblem assets** were decoded and visually reviewed. Images retain their source identity and aspect ratio. A shared state emblem is not described as a unique department logo.', '- Four department branches have a separately verified published mark: Animal Husbandry; Panchayat Raj; Transport; Women Development and Child Welfare. Other department branches use the shared state emblem unless a distinct mark is subsequently verified.', '- HYDRAA publishes an official logo URL, but direct access to its host timed out from the audit environment. The application links and attempts that official logo, and retains a verified state-emblem fallback when the host is unavailable. That remote asset is **not** counted among the 30 bundled files.', '- The source scan attempted 133 official-site URLs: 79 responded and 61 exposed logo candidates. Those figures describe source availability, not 133 departments or 61 verified agency logos.', '- Candidate advertising, partner, campaign and vendor logos were not assigned to government bodies. In particular, a separate TG Rising campaign mark was not substituted for the state emblem.', '- Current brand provenance is recorded in [logo-sources.json](logo-sources.json). Original photos are separately credited in [portrait-sources.json](portrait-sources.json).','', '| Verified local asset | Applied to | Source page |','| --- | --- | --- |']
for logo in logos:
 if not logo.get('path'):continue
 applied='Shared government identity for department branches' if logo['kind']=='shared-state-emblem' else ', '.join(nodes[id]['title'] for id in logo['nodeIds'])
 lines.append(f"| {logo['name']} | {applied} | [Official source]({logo['source']}) |")
lines+=['','## Data boundaries','', '- Source-backed bodies and officers remain different records. Budget-listed offices are labelled as such; general role summaries are not current staffing confirmations.', '- Statutory and constitutional bodies can be found in a separate public-body discovery group. That group is not a common reporting chain.', '- District roster associations do not establish police commissionerate boundaries. No district or Assembly area is inferred for HYDRAA’s exact CURE jurisdiction.', '- The removed “All areas & people” section remains removed. Coverage documentation is kept here rather than reintroducing that section into the map.','']
(P/'COVERAGE-AUDIT.md').write_text('\n'.join(lines))
# Avoid retaining session identifiers copied from public legacy URLs.
for file in (P/'data-source/audit').glob('*.json'):
 text=file.read_text();clean=re.sub(r';jsessionid=[A-Za-z0-9]+','',text,flags=re.I)
 if clean!=text:file.write_text(clean)
print('Audit validated: 201 reference entries; 35 omissions resolved; 13 grouped/name cases; logos and graph checked.')
