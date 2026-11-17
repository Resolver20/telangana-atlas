"""Check complete explanations and important distinctions that title matching can get wrong."""
import json
from pathlib import Path
from collections import Counter
P=Path(__file__).resolve().parents[1]
m=json.loads((P/'src/data.json').read_text());nodes=m['nodes'];roles=m['roles']
for id,n in nodes.items():
    r=roles[n['roleId']]
    for field in ['description','example','basis','profile','sourceNote']:
        assert isinstance(r[field],str) and r[field].strip(),(id,field)
    assert len(r['description'])>90,id
    assert len(r['actions'])>=3 and all(len(v)>18 for v in r['actions']),id
    assert r['limits'] and all(len(v)>30 for v in r['limits']),id
    assert len(set(r['actions']))==len(r['actions']),id
    assert 'Illustrative' in r['sourceNote'] or 'illustrative' in r['sourceNote'],id
    if r['profile']=='directory':assert 'cannot issue orders' in r['limits'][0],id
    if r['profile']=='specialist-support':assert r['qualified'],id
    assert not n['source'] or n['source'].startswith('https://'),id
# Contrast real-world roles that must not inherit one another's powers.
expected={
 'cm':'chief-minister','governor':'governor','agency-hydraa':'hydraa',
 'hydraa-police-station':'hydraa-station','n41':'cooperation','n1227':'registration',
 'n1234':'beverages-supply','n1237':'excise','n213':'electricity-regulator',
 'n223':'power-transmission','n253':'power-generation','n292':'power-distribution',
 'n1105':'election-commission','n436':'electoral-officer','n1350':'bus-operator',
 'n1345':'transport-regulation','n968':'waqf-survey','n958':'waqf',
 'office-state-finance-commission':'finance-commission','office-tgpsc':'public-service-commission',
 'n1429':'cadet-training','n576':'student-volunteering','n879':'government-lawyer',
 'n1331':'residential-education','n1333':'welfare-finance','n978':'municipal-oversight',
 'n989':'municipality','office-rain-shadow':'rain-shadow',
}
for id,kind in expected.items():assert roles[nodes[id]['roleId']]['profile']==kind,(id,kind)
for n in nodes.values():
    if n['kind']=='MLA listing':assert roles[n['roleId']]['profile']=='mla',n['id']
    if n['kind']=='MLC listing':assert roles[n['roleId']]['profile']=='mlc',n['id']
    if n['kind']=='MP listing':assert roles[n['roleId']]['profile']=='mp',n['id']
    if n['kind']=='Judicial office' and n['title']=='High Court judge':assert roles[n['roleId']]['profile']=='high-court-judge'
assert len(nodes)==1956 and len(nodes['departments']['children'])==42
assert sum(bool(n.get('photo')) for n in nodes.values())==86
assert m['logoCounts']['bundledAssets']==30
assert all(roles[nodes[id]['roleId']]['profile']=='department' for id in nodes['departments']['children'])
counts=Counter(roles[n['roleId']]['basis'] for n in nodes.values())
print('Validated all',len(nodes),'role explanations, 28 sensitive institution distinctions, all legislators, 42 portfolios and preserved portrait/logo associations.')
print(json.dumps(counts,sort_keys=True))
