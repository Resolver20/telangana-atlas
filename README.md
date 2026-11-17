# Telangana Atlas

An interactive guide to Telangana’s government: explore people, understand their roles, follow the hierarchy, and see the regions they serve.

**[Open Telangana Atlas](https://resolver20.github.io/telangana-atlas/)**

Built with React and Vite. Hosted on GitHub Pages.

## Features

- **Government hierarchy:** start with the Chief Minister and explore ministers, departments, the Secretariat, advisors and district directories.
- **Separate institutions:** explore the Governor, state Legislature, Judiciary, State Information Commission and Parliament representatives without placing them in a single executive reporting chain.
- **Roles explained:** plain-English responsibilities, available contact details and links to the official sources.
- **Official portraits:** 77 optimized photographs credited to their original Telangana government pages.
- **Interactive geography:** all 33 district boundaries link to district directory entries; all 119 Assembly constituencies link to MLA entries.
- **Statewide remit and elected seats:** a minister’s statewide portfolio responsibilities are distinguished from the Assembly constituency they represent.
- **Map controls:** region selection, zoom, keyboard navigation, optional labels and shareable URLs. Choose **All names** to enable every area label, including on mobile.
- **Responsive navigation:** layouts for desktop, tablet and phone, with search across people, offices and departments.

## Coverage

The included portal snapshot was checked on **17 November 2026**.

| Directory | Included entries |
| --- | ---: |
| Council of Ministers, including the Chief Minister | 15 |
| Department pages | 41 |
| District directories | 33 |
| District-official listings | 96 |
| Members of Legislative Assembly | 119 |
| Members of Legislative Council | 34 |
| Parliament representatives | 24 |
| Information Commission members | 6 |
| Government advisors | 10 |

The application also includes the Secretariat, Governor’s Secretariat, High Court judges and registrars, and department contact and organisation listings.

## Run locally

Use **Node.js 24 LTS** and npm.

```sh
npm ci
npm run dev
```

Create and preview a production build:

```sh
npm run build
npm run preview
```

For a build under a repository path:

```sh
VITE_BASE_PATH=/telangana-atlas/ npm run build
```

## Deployment

The workflow at [`.github/workflows/pages.yml`](.github/workflows/pages.yml) installs the locked dependencies, builds the React site with the GitHub Pages base path and deploys `dist/` whenever `main` is updated. It can also be started manually from GitHub Actions.

Site: **https://resolver20.github.io/telangana-atlas/**

Useful shareable views:

- [Government hierarchy](https://resolver20.github.io/telangana-atlas/?node=cm)
- [Regional map](https://resolver20.github.io/telangana-atlas/?view=map)
- [Assembly map with all names enabled](https://resolver20.github.io/telangana-atlas/?view=map&layer=assembly&region=&labels=all)

## Project structure

```text
src/
  main.jsx                Hierarchy, search, profiles and navigation
  RegionalMap.jsx         Interactive district and Assembly maps
  styles.css              Responsive layouts and styling
  data.json               Directory snapshot and shared role explanations
  map-data.json           Projected map shapes and directory associations
public/
  portraits/              Optimized official portraits
scripts/
  enrich-data.py          Regenerate enriched directory data
  build-map-data.py       Regenerate map paths and explicit name matches
data-source/              Original normalized directory and GIS snapshots
portrait-sources.json     Original photograph URLs and attribution
```

The two data preparation scripts use Python’s standard library. The prepared data and assets are included, so running the website does not require Python or a live government API.

## Sources and attribution

People, portfolios and contact information come from the [Telangana State Portal](https://www.telangana.gov.in/), including:

- [Council of Ministers](https://www.telangana.gov.in/government/council-of-ministers/)
- [Secretariat directory](https://www.telangana.gov.in/contacts/secretariat/)
- [District officials](https://www.telangana.gov.in/contacts/district-officials/)
- [State Information Commission](https://www.telangana.gov.in/rti/information-commission/)
- [Members of Legislative Assembly](https://www.telangana.gov.in/legislature/members-of-legislative-assembly/)

Role explanations link to the relevant government pages, the Constitution of India, the Right to Information Act and other official references within the application. Descriptions marked as general overviews do not replace an authority’s current work allocation.

Photographs are sourced from the official portal. [The portrait manifest](portrait-sources.json) records each original image URL and source page. Original photographs and third-party data retain their respective source rights.

### Geographic data

Boundaries come from public Telangana Remote Sensing Applications Centre GIS services:

- [33-district boundary layer](https://tgrac.telangana.gov.in/arcgis/rest/services/Hydra_Folder/Administrative_Layer/MapServer/8)
- [119-Assembly constituency boundary layer](https://tgrac.telangana.gov.in/arcgis/rest/services/TGSRTC_Folder/RTC_Admin_Layers/MapServer/6)

The map uses a shared WGS84/Mercator projection. Explicit spelling aliases match every district and Assembly shape to one directory entry; data generation fails if any shape is unmatched or matched twice. Display simplification uses a maximum allowable offset of 0.0015 degrees and five decimal coordinate precision.

## Reading the hierarchy and map

- Minister-to-department links follow published portfolio responsibility.
- Department and district contact groups are **directory associations**, not a certified reporting chart.
- Civil district boundaries do not establish the exact boundaries of police commissionerates.
- Parliamentary and Council constituency boundaries, exact office buildings and live locations are not mapped.
- A geographic jurisdiction is not inferred when the source does not supply one.
- Source names, contacts and party labels may be outdated or inconsistent. This is a bundled snapshot, not a live personnel feed.

**Telangana Atlas is an independent educational guide, not an official government website.** Its maps are for overview and learning, not survey or legal boundary decisions.
