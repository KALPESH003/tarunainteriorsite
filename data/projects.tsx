export type Project = {
  id: string; // "01"
  slug: string; // -> /projects/[slug]
  title: string;
  /** "2020" for finished work, "EXPECTED 2026" for work in progress */
  year: string;
  image: string;
};

const img = (id: string) => `https://images.unsplash.com/${id}?q=80&w=1600&auto=format&fit=crop`;

type Seed = [slug: string, title: string, year: string, photo: string];

const number = (rows: Seed[]): Project[] =>
  rows.map(([slug, title, year, photo], i) => ({
    id: String(i + 1).padStart(2, '0'),
    slug,
    title,
    year,
    image: img(photo),
  }));

/* DEMO CONTENT: swap titles, years, slugs and photos for your real projects. */

export const ARCHIVE: Project[] = number([
  ['skechers-showroom', 'SKECHERS SHOWROOM, TURNKEY RETAIL', '2020', 'photo-1618221195710-dd6b41faaea6'],
  ['nexa', 'NEXA, COMMERCIAL CHAIN', '2019', 'photo-1600596542815-ffad4c1539a9'],
  ['shree-jagdamba-jewellers', 'SHREE JAGDAMBA JEWELLERS, RETAIL', '2020', 'photo-1600607686527-6fb886090705'],
  ['the-atharva-residences', 'THE ATHARVA RESIDENCES, LUXURY APARTMENT', '2021', 'photo-1600210492486-724fe5c67fb0'],
  ['lumina-penthouse', 'LUMINA PENTHOUSE, INTERIORS', '2022', 'photo-1600566753190-17f0baa2a6c3'],
  ['vanguard', 'VANGUARD, CORPORATE WORKSPACE', '2023', 'photo-1497366216548-37526070297c'],
  ['oak-and-iron', 'OAK & IRON, PRIVATE RESIDENCE', '2024', 'photo-1600585154340-be6161a56a0c'],
  ['arbor-cafe', 'ARBOR CAFE, HOSPITALITY', '2021', 'photo-1615874959474-d609969a20ed'],
  ['studio-noir', 'STUDIO NOIR, BOUTIQUE OFFICE', '2018', 'photo-1497215728101-856f4ea42174'],
  ['kavya-clinic', 'KAVYA CLINIC, HEALTHCARE', '2022', 'photo-1512917774080-9991f1c4c750'],
]);

export const IN_PROGRESS: Project[] = number([
  ['shidhheswar-hevock', 'SHIDHHESWAR HEVOCK, INTERIOR', 'EXPECTED 2026', 'photo-1586023492125-27b2c045efd7'],
  ['nyasa', 'NYASA, INTERIOR', 'EXPECTED 2027', 'photo-1556909114-f6e7ad7d3136'],
  ['aurelia-villas', 'AURELIA VILLAS, RESIDENTIAL', 'EXPECTED 2026', 'photo-1600047509807-ba8f99d2cdde'],
  ['the-meridian', 'THE MERIDIAN, COMMERCIAL TOWER', 'EXPECTED 2027', 'photo-1486406146926-c627a92ad1ab'],
  ['saffron-kitchen', 'SAFFRON KITCHEN, RESTAURANT', 'EXPECTED 2026', 'photo-1484154218962-a197022b5858'],
  ['harmony-heights', 'HARMONY HEIGHTS, LUXURY APARTMENT', 'EXPECTED 2027', 'photo-1616594039964-ae9021a400a0'],
  ['zenith-workspace', 'ZENITH WORKSPACE, CORPORATE', 'EXPECTED 2026', 'photo-1600607687939-ce8a6c25118c'],
  ['lotus-spa', 'LOTUS SPA, WELLNESS', 'EXPECTED 2027', 'photo-1540518614846-7eded433c457'],
  ['basalt-house', 'BASALT HOUSE, PRIVATE RESIDENCE', 'EXPECTED 2026', 'photo-1493663284031-b7e3aefcae8e'],
  ['prism-showroom', 'PRISM SHOWROOM, RETAIL', 'EXPECTED 2027', 'photo-1545324418-cc1a3fa10c00'],
]);