export type Section = { title: string; body: string };

export type ProjectDetail = {
  type: string;
  location: string;
  capturedBy: string;
  heroImage?: string; // feature photo (falls back to the card image)
  sections: Section[];
  gallery: string[]; // add as many photos as the project has
};

type Override = Partial<ProjectDetail>;

/* Add or edit a project here. Anything you leave out falls back to a sensible default. */
const OVERRIDES: Record<string, Override> = {
  'skechers-showroom': {
    type: 'Turnkey Retail',
    sections: [
      { title: 'Project Overview', body: 'The Skechers Showroom is a contemporary retail interior designed to reflect the brand’s energetic, sporty, and performance-driven identity. The space combines strong visual branding with an efficient customer journey, creating an inviting environment for browsing, product discovery, and purchase.' },
      { title: 'Design Approach', body: 'The design focuses on clarity, movement, and accessibility. A clean spatial layout allows customers to navigate the showroom effortlessly, while carefully planned display zones provide maximum product visibility.' },
      { title: 'Material & Colour Palette', body: 'Durable retail materials, clean surfaces, and a modern colour palette create a fresh and energetic setting. Brand-led accents, balanced lighting, and contrasting finishes add visual rhythm.' },
      { title: 'Spatial Experience', body: 'The showroom is organised into clearly defined product and circulation zones. Strategic displays guide customers through the space, while open floor areas maintain a sense of comfort and flexibility.' },
      { title: 'Design Outcome', body: 'The completed showroom delivers a cohesive and functional retail environment that supports the brand’s commercial goals, bringing together identity, efficiency, and customer experience.' },
    ],
    // gallery: ['/images/projects/skechers/01.jpg', '/images/projects/skechers/02.jpg'],
  },
};

const sections = (name: string, type: string): Section[] => [
  { title: 'Project Overview', body: `${name} is a ${type.toLowerCase()} interior by Taruna Interior Gallery, designed around how the space is lived in and used every day.` },
  { title: 'Design Approach', body: 'We began with the layout: movement, light and function first, then materials and detail. Every decision was tested against the client’s brief.' },
  { title: 'Material & Colour Palette', body: 'A restrained palette of durable, honest materials, chosen to age well and to let the architecture and furniture stand out.' },
  { title: 'Design Outcome', body: 'A cohesive, functional space delivered with care, from concept through handcrafted furniture and final installation.' },
];

export function getDetail(slug: string, title: string, image: string): ProjectDetail & { name: string } {
  const [name, ...rest] = title.split(',');
  const o = OVERRIDES[slug] ?? {};
  const type = o.type ?? (rest.join(',').trim() || 'Interior Design');
  return {
    name: name.trim(),
    type,
    location: o.location ?? 'Vadodara, Gujarat',
    capturedBy: o.capturedBy ?? 'Jayram Suthar',
    heroImage: o.heroImage ?? image,
    sections: o.sections ?? sections(name.trim(), type),
    gallery: o.gallery?.length ? o.gallery : [image],
  };
}