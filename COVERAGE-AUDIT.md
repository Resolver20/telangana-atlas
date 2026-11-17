# Telangana Atlas coverage audit

Checked: **17 November 2026**. Baseline: initial published commit `d6a53d86bff053baab99844db82b0a579f25993f`.

## What went wrong

The initial import treated 41 portal navigation pages and selected contact tables as a sufficient coverage check. It did not reconcile those tables against the government’s HOD register, the broader state web directory or agency-specific sites. Some offices were also represented only through a shared contact heading. Department-page coverage was wrongly allowed to suggest that all agencies were included.

## Verified result within this audit scope

| Comparison | Result |
| --- | ---: |
| Current 2026–27 department/HOD register entries checked | 201 |
| Already represented at the relevant department, office or body level | 158 |
| Present only through a grouped contact or naming variation | 13 |
| Missing body/office entries in that register | 30 |
| Additional missing bodies named by the state web directory | 5 |
| **Confirmed missing entries within these sources, including HYDRAA** | **35** |

**HYDRAA was one of the 35 omissions; there were 34 other missing entries within the sources checked.** The 13 grouping/name gaps are reported separately and are not added to the omission count.

All 35 missing entries have now been added. The grouped cases have individual discovery entries or documented aliases as appropriate. No current officeholder is invented when a source only identifies a body or budget office.

This is a bounded reconciliation, not certification of every state agency, university, local body, scheme, subordinate field office or present incumbent. A staffing heading confirms inclusion in that fiscal-year register; it does not alone prove current operational status or all legal powers.

## Sources and method

1. [Current 2026–27 budget landing page](https://www.telangana.gov.in/budget-2026-2027/) and its [Employee Strength of Government Departments appendix](https://www.telangana.gov.in/wp-content/uploads/2026/05/Employee-Strength-of-Govt.-Dept.pdf). The index contains 201 numbered entries on PDF pages 5–9.
2. [State Web Directory](https://www.telangana.gov.in/state-web-directory/), all 95 data rows reviewed. Service portals, schemes and duplicate website entries are not counted as distinct missing agencies.
3. All 41 original department pages were fetched and their linked official sites reviewed for additional body references and branding.
4. [HYDRAA’s own agency profile](https://hydraa.telangana.gov.in/about) confirms MA&UD association, the Commissioner and the published operational structure. Its CURE remit is not replaced by a district-wide or statewide polygon.
5. Matching is explicit and manually reviewed. The machine-readable [register audit](data-source/audit/register-coverage.json) records each original status and its matching/resolved node id; fuzzy string similarity was not accepted as proof of identity.

The initially discovered March-path register was the older 2025–26 document. It was superseded for this audit by the May-path 2026–27 register linked from the current budget page.

## The 30 missing register entries

| Register no. | Original register heading | Added entry |
| --- | --- | --- |
| 21 | TELANGANA ADMISSION AND FEE REGULATORY COMMITTEE | [Telangana Admission and Fee Regulatory Committee](https://resolver20.github.io/telangana-atlas/?node=office-fee-regulatory) |
| 28 | REGISTRAR OF PUBLICATIONS, H.O.D | [Registrar of Publications](https://resolver20.github.io/telangana-atlas/?node=office-registrar-publications) |
| 43 | TELANGANA STATE FINANCE COMMISION | [Telangana State Finance Commission](https://resolver20.github.io/telangana-atlas/?node=office-state-finance-commission) |
| 46 | PUBLIC SERVICE COMMISSION,HOD | [Telangana Public Service Commission (TGPSC)](https://resolver20.github.io/telangana-atlas/?node=office-tgpsc) |
| 47 | TRIBUNAL FOR DISCIPLINARY PROCEEDINGS,HOD | [Tribunal for Disciplinary Proceedings](https://resolver20.github.io/telangana-atlas/?node=office-disciplinary-tribunal) |
| 51 | LOK AYUKTA & UPA LOK-AYUKTA, HOD | [Lokayukta & Upa-Lokayukta](https://resolver20.github.io/telangana-atlas/?node=office-lokayukta) |
| 55 | MCR HRD INSTITUTE,HOD | [Dr. MCR Human Resource Development Institute](https://resolver20.github.io/telangana-atlas/?node=office-mcrhrdi) |
| 57 | DIRECTOR OF TRANSLATIONS | [Director of Translations](https://resolver20.github.io/telangana-atlas/?node=office-translations) |
| 60 | ESTATE OFFICER. | [Estate Officer](https://resolver20.github.io/telangana-atlas/?node=office-estate-officer) |
| 61 | TELANGANA HUMAN RIGHTS COMMISSION | [Telangana Human Rights Commission](https://resolver20.github.io/telangana-atlas/?node=office-human-rights-commission) |
| 75 | SAINIK WELFARE, HOD | [Sainik Welfare Department](https://resolver20.github.io/telangana-atlas/?node=office-sainik-welfare) |
| 79 | CIVIL DEFENCE ORGANISATION | [Civil Defence Organisation](https://resolver20.github.io/telangana-atlas/?node=office-civil-defence) |
| 87 | Telangana Integrated Command and Control Centre | [Telangana Integrated Command and Control Centre](https://resolver20.github.io/telangana-atlas/?node=office-iccc) |
| 88 | COMMISSIONER OF POLICE FUTURE CITY | [Future City Police Commissionerate](https://resolver20.github.io/telangana-atlas/?node=office-future-city-police) |
| 117 | DIRECTOR, GROUND WATER DEPARTMENT, HOD | [Ground Water Department](https://resolver20.github.io/telangana-atlas/?node=office-ground-water) |
| 118 | COMMISSIONER, RESETTLEMENT AND REHABILITATION, HOD | [Commissioner, Resettlement & Rehabilitation](https://resolver20.github.io/telangana-atlas/?node=office-resettlement-rehabilitation) |
| 124 | COMMERCE AND EXPORT PROMOTION, HOD | [Commerce & Export Promotion](https://resolver20.github.io/telangana-atlas/?node=office-commerce-export) |
| 140 | INSURANCE MEDICAL SERVICES, HOD | [Insurance Medical Services](https://resolver20.github.io/telangana-atlas/?node=office-insurance-medical) |
| 144 | PROSECUTIONS,HOD | [Directorate of Prosecutions](https://resolver20.github.io/telangana-atlas/?node=office-prosecutions) |
| 146 | MEMBER SECRETARY, STATE LEGAL SERVICES AUTHORITY | [Telangana State Legal Services Authority](https://resolver20.github.io/telangana-atlas/?node=office-legal-services) |
| 147 | JUDICIAL ACADEMY | [Telangana Judicial Academy](https://resolver20.github.io/telangana-atlas/?node=office-judicial-academy) |
| 153 | HYDERABAD DISASTER RESPONSE AND ASSET PROTECTION AGENCY (HYDRAA) | [HYDRAA](https://resolver20.github.io/telangana-atlas/?node=agency-hydraa) |
| 174 | SPECIAL COURT UNDER LAND GRABBING (PROHIBITION) ACT, HOD | [Special Court under the Land Grabbing (Prohibition) Act](https://resolver20.github.io/telangana-atlas/?node=office-land-grabbing-court) |
| 177 | COMMISSIONER FOR RELIEF, HOD | [Commissioner for Relief](https://resolver20.github.io/telangana-atlas/?node=office-commissioner-relief) |
| 179 | SETTLEMENTS, HOD | [Settlements Office](https://resolver20.github.io/telangana-atlas/?node=office-settlements) |
| 180 | PRESIDING OFFICER, LAND ACQUISITION, REHABILITATION AND RESETTLEMENT AUTHORITY | [Land Acquisition, Rehabilitation & Resettlement Authority](https://resolver20.github.io/telangana-atlas/?node=office-land-acquisition-authority) |
| 181 | RAIN SHADOW AREAS DEVELOPMENT DEPARTMENT | [Rain Shadow Areas Development Department](https://resolver20.github.io/telangana-atlas/?node=office-rain-shadow) |
| 189 | CHIEF ENGINEER, TRIBAL WELFARE, HOD | [Chief Engineer, Tribal Welfare](https://resolver20.github.io/telangana-atlas/?node=office-tribal-chief-engineer) |
| 193 | PERSONS WITH DISABILITIES AND SENIOR CITIZENS WELFARE, HOD | [Empowerment of Persons with Disabilities, Senior Citizens & Transgender Persons](https://resolver20.github.io/telangana-atlas/?node=dept-disability-senior-citizens-transgender) |
| 199 | YOUTH SERVICES,YUVASAKTI | [Youth Services / Yuvasakti](https://resolver20.github.io/telangana-atlas/?node=office-youth-services) |

## Five additional bodies from the state directory

| Body | Source website |
| --- | --- |
| Stree Nidhi Credit Cooperative Federation | [Official website](https://streenidhi.telangana.gov.in/) |
| Mission for Elimination of Poverty in Municipal Areas (MEPMA) | [Official website](https://tmepma.cgg.gov.in/) |
| Research and Innovation Circle of Hyderabad (RICH) | [Official website](https://it.telangana.gov.in/) |
| T-SAT / SoFTNET | [Official website](https://softnet.telangana.gov.in/) |
| Society for Rural Development Services (SRDS) | [Official website](https://rdhrms.telangana.gov.in/) |

## Thirteen grouped or naming cases

| Register no. | Heading | Baseline limitation | Resolution |
| --- | --- | --- | --- |
| 54 | VIGILANCE COMMISSION | A Vigilance Commissioner contact was present; the commission was not a separate body. | `office-vigilance-commission` |
| 81 | I.G. GREY HOUNDS | Greyhounds was mentioned in the shared DGP (Operations), Greyhounds & Octopus contact rather than a separate body. | `office-greyhounds` |
| 83 | Addl. DIRECTOR GENERAL, ORGANISATION OF COUNTER TERRORIST OPERATIONS (OCTOPUS) | OCTOPUS was mentioned in the shared DGP (Operations), Greyhounds & Octopus contact rather than a separate body. | `office-octopus` |
| 86 | EAGLE FORCE , HOD | The earlier Telangana Anti Narcotics Bureau entry did not use the current EAGLE Force label. | `n612` |
| 115 | CHIEF ENGINEER, V & E, HYDERABAD | Represented with the alternate contact heading Chief Engineer, Enquires. | `n769` |
| 131 | LABOUR COURT-I, HYDERABAD | Only the combined Labour Courts group was present. | `office-register-131` |
| 133 | LABOUR COURT-II, HYDERABAD | Only the combined Labour Courts group was present. | `office-register-133` |
| 134 | LABOUR COURT-III, HYDERABAD | Only the combined Labour Courts group was present. | `office-register-134` |
| 135 | LABOUR COURT, WARANGAL | Only the combined Labour Courts group was present. | `office-register-135` |
| 136 | LABOUR COURT, GODAVARIKHANI | Only the combined Labour Courts group was present. | `office-register-136` |
| 137 | INDUSTRIAL TRIBUNAL-I, HYDERABAD | Only the combined Industrial Tribunals group was present. | `office-register-137` |
| 138 | ADDITIONAL INDUSTRIAL TRIBUNAL, HYDERABAD | Only the combined Industrial Tribunals group was present. | `office-register-138` |
| 139 | INDUSTRIAL TRIBUNAL-II, HYDERABAD | Only the combined Industrial Tribunals group was present. | `office-register-139` |

## Logos and source availability

- **42 department/portfolio branches** display a verified published mark or the explicitly labelled shared Telangana state emblem. This is 41 original portal categories plus the added disability/senior-citizens/transgender portfolio branch; it is not a claim that there are exactly 42 formal Secretariat departments.
- **30 local logo/emblem assets** were decoded and visually reviewed. Images retain their source identity and aspect ratio. A shared state emblem is not described as a unique department logo.
- Four department branches have a separately verified published mark: Animal Husbandry; Panchayat Raj; Transport; Women Development and Child Welfare. Other department branches use the shared state emblem unless a distinct mark is subsequently verified.
- HYDRAA publishes an official logo URL, but direct access to its host timed out from the audit environment. The application links and attempts that official logo, and retains a verified state-emblem fallback when the host is unavailable. That remote asset is **not** counted among the 30 bundled files.
- The source scan attempted 133 official-site URLs: 79 responded and 61 exposed logo candidates. Those figures describe source availability, not 133 departments or 61 verified agency logos.
- Candidate advertising, partner, campaign and vendor logos were not assigned to government bodies. In particular, a separate TG Rising campaign mark was not substituted for the state emblem.
- Current brand provenance is recorded in [logo-sources.json](logo-sources.json). Original photos are separately credited in [portrait-sources.json](portrait-sources.json).

| Verified local asset | Applied to | Source page |
| --- | --- | --- |
| Animal Husbandry | Animal Husbandry, Dairy Development and Fisheries | [Official source](https://ahddf.telangana.gov.in/) |
| Telangana Film Development Corporation | Telangana Film Development Corporation | [Official source](https://filmin.telangana.gov.in/) |
| Singareni Collieries | The Singareni Collieries Company Limited | [Official source](https://scclmines.com/scclnew/index.asp) |
| TGGENCO | Telangana Power Generation Corporation Limited (TG GENCO) | [Official source](https://tggenco.com/TGGENCO/home.do) |
| TGTRANSCO | Transmission Corporation of Telangana Limited (TG TRANSCO) | [Official source](https://tgtransco.com/) |
| TGREDCO | Telangana Renewable Energy Development Corporation Ltd. (TGREDCO) | [Official source](https://tgredco.telangana.gov.in/) |
| Government of Telangana emblem | Shared government identity for department branches | [Official source](https://forests.telangana.gov.in/) |
| Telangana Council of Science and Technology | Telangana Council of Science & Technology (TGCOST) | [Official source](https://tgcost.telangana.gov.in/) |
| Telangana Council of Higher Education | Telangana Council of Higher Education | [Official source](https://tgche.ac.in/) |
| Hyderabad City Police | Commissioner of Police, Hyderabad | [Official source](https://www.hyderabadpolice.gov.in/) |
| Cyberabad Police | Commissioner of Police, Cyberabad | [Official source](https://www.cyberabadpolice.gov.in/) |
| Commissioner and Director of Municipal Administration | Commissioner & Director of Municipal Administration (CDMA) | [Official source](https://emunicipal.telangana.gov.in/) |
| Greater Hyderabad Municipal Corporation | Greater Hyderabad Municipal Corporation (GHMC) | [Official source](https://www.ghmc.gov.in/) |
| Hyderabad Metropolitan Water Supply and Sewerage Board | Hyderabad Metropolitan Water Supply & Sewerage Board (HMWS&SB) | [Official source](https://www.hyderabadwater.gov.in/) |
| Hyderabad Metropolitan Development Authority | Hyderabad Metropolitan Development Authority (HMDA) | [Official source](https://www.hmda.gov.in/) |
| Panchayat Raj | Panchayat Raj and Rural Development, Panchayat Raj and Rural Employment | [Official source](https://epanchayat.telangana.gov.in/) |
| Transport Department | Transport, Transport Commissioner | [Official source](https://www.transport.telangana.gov.in/) |
| Women Development and Child Welfare | Women and Child Welfare, Director, Women Development and Child Welfare. | [Official source](https://wdcw.tg.nic.in/) |
| High Court for the State of Telangana | Judiciary | [Official source](https://tshc.gov.in/) |
| T-Hub | T-Hub | [Official source](https://it.telangana.gov.in/) |
| WE Hub | WE Hub | [Official source](https://wehub.telangana.gov.in/) |
| Research and Innovation Circle of Hyderabad | Research and Innovation Circle of Hyderabad (RICH) | [Official source](https://it.telangana.gov.in/) |
| T-Works | T-Works | [Official source](https://it.telangana.gov.in/) |
| Telangana Academy for Skill and Knowledge | Telangana Academy for Skill and Knowledge (TASK) | [Official source](https://task.telangana.gov.in/) |
| T-SAT SoFTNET | T-SAT / SoFTNET | [Official source](https://softnet.telangana.gov.in/) |
| Photonics Valley Corporation | Photonics Valley Corporation | [Official source](https://photonicsvalley.telangana.gov.in/) |
| Public Health and Municipal Engineering | Engineer-in-Chief (Public Health) | [Official source](https://publichealth.telangana.gov.in/) |
| Girijan Co-operative Corporation | Girijan Co-operative Finance Development Corporation | [Official source](https://tgtribalwelfare.cgg.gov.in/mainPage.do) |
| Mission for Elimination of Poverty in Municipal Areas | Mission for Elimination of Poverty in Municipal Areas (MEPMA) | [Official source](https://tmepma.cgg.gov.in/) |
| Treasuries and Accounts | Director of Treasuries and Accounts | [Official source](https://treasury.telangana.gov.in/) |

## Data boundaries

- Source-backed bodies and officers remain different records. Budget-listed offices are labelled as such; general role summaries are not current staffing confirmations.
- Statutory and constitutional bodies can be found in a separate public-body discovery group. That group is not a common reporting chain.
- District roster associations do not establish police commissionerate boundaries. No district or Assembly area is inferred for HYDRAA’s exact CURE jurisdiction.
- The removed “All areas & people” section remains removed. Coverage documentation is kept here rather than reintroducing that section into the map.
