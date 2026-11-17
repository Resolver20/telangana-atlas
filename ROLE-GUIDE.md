# Role explanations in Telangana Atlas

## What each entry explains

All **1,956 entries** include a purpose, actions, limits of authority and a practical example. Staff entries also show the parent institution’s remit where the directory supplies a usable context. The examples illustrate the work; they do not claim that the named incumbent took that action.

| Description basis | Entries |
| --- | ---: |
| Constitutional / statutory overview | 234 |
| Department overview | 42 |
| Directory guide | 125 |
| Institution-specific overview | 354 |
| Office-type overview | 1201 |

## How to interpret the wording

- **Constitutional / statutory overview:** describes the office’s constitutional or statutory function. Case assignment, delegation and procedural limits still apply.
- **Department overview:** explains policy, government-level administration and oversight in a published portfolio; it does not assign every operational power of every agency to the department’s staff.
- **Institution-specific overview:** identifies the function of the named body or heading, with a tailored functional explanation. A complete current delegation order is not inferred from its directory listing.
- **Office-type overview:** explains the professional role in its institutional context. The directory usually does not publish a full duty statement or an individual officer’s current financial, statutory or territorial delegation.
- **Directory guide:** describes navigation or membership. Such groupings cannot issue orders, approve applications or decide cases.

## Source basis

The original official source remains linked on each profile. Where an additional constitutional, statutory or agency function reference is used, it is linked as the role reference. A contact directory or staffing register establishes a listing; it is not treated as proof of every power described in an educational overview.

Sources checked for the expanded role guide on **17 November 2026** include:

- [Constitution of India](https://www.indiacode.nic.in/bitstream/123456789/19150/1/constitution_of_india.pdf), for state institutions and elected representatives.
- [Governor’s official role guide](https://governor.telangana.gov.in/roleofgovernor.do).
- [Public Service Commission functions: Article 320, UPSC](https://www.upsc.gov.in/about-us/constitutional-provisions/article-320-functions-public-service-commissions). This supports the shared constitutional framework for State Public Service Commissions, not an appointment to Telangana’s commission.
- [RTI Act](https://www.indiacode.nic.in/bitstream/123456789/2065/5/a2005-22.pdf), especially the distinct complaint, appeal and penalty functions.
- [HYDRAA agency structure](https://hydraa.telangana.gov.in/about), [asset protection](https://hydraa.telangana.gov.in/functions/asset-protection), [disaster management](https://hydraa.telangana.gov.in/functions/disaster-management) and [logistics](https://hydraa.telangana.gov.in/functions/logistics).
- [TGERC’s published functions](https://tgerc.telangana.gov.in/aboutus.php).
- [HMDA’s agency profile](https://www.hmda.gov.in/about/).
- [GHMC citizen charter](https://ghmc.gov.in/CitizenCharter/CitizenCharter-19.06.pdf) and [municipal sanitation functions](https://khammamcorporation.telangana.gov.in/pages/sanitation).
- [Hyderabad Collectorate’s functions](https://hyderabad.telangana.gov.in/collectrate/), used as a general district-administration reference rather than a delegation for every district officer.
- [Telangana Transport Department’s functions](https://www.telangana.gov.in/departments/transport/).
- [Telangana Lokayukta annual report](https://lokayukta.telangana.gov.in/files/Annual-Reports-2024.pdf).
- [Protection of Human Rights Act, NHRC](https://www.nhrc.nic.in/assets/uploads/publication/THE%20PROTECTION%20OF%20HUMAN%20RIGHTS%20ACT-1993.pdf), for the human-rights commission framework.

The functional descriptions for other bodies and staff posts are labelled general overviews derived from their published designation and institutional subject. They are not presented as independently verified, exhaustive personal duty orders.

## Important distinctions preserved

- An institution’s remit is shown separately from the powers of an individual employee.
- A government Secretary, institutional Secretary, Company Secretary and court Registrar have different roles.
- Electricity regulation, generation, transmission and distribution are separate functions.
- The State Election Commission handles its local-body remit; ECI election machinery handles Assembly and Parliamentary elections.
- A beverages-supply corporation is distinct from the Excise Department’s licensing and enforcement authorities.
- A tribunal, prosecutor, police officer and forensic expert do not exercise one another’s powers.
- A register-listed retained heading, such as Rain Shadow Areas Development, is not assumed to have a currently active scheme merely because it has a budget entry.
- FAC / in-charge descriptions are source labels, not verification that the additional charge remains current.

## Maintenance and validation

Descriptions and matching rules live in `scripts/role_details.py`. Run:

```sh
python3 scripts/enrich-data.py
python3 scripts/validate-role-details.py
python3 scripts/write-coverage-report.py
npm run build
```

Validation checks all entries for complete role information and exercises distinctions prone to incorrect title matching. It does not establish the current incumbent or verify every personal delegation. This update expands explanations; it is not a new personnel-posting audit.
