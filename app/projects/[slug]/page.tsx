import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import JsonLd from '@/components/JsonLd';
import ProjectDetail from '@/components/project/ProjectDetail';
import { ARCHIVE, IN_PROGRESS } from '@/data/projects';
import { getDetail } from '@/data/projectDetails';
import { SITE } from '@/lib/site';

// de-duplicated list, archive first
const ALL = [...new Map([...ARCHIVE, ...IN_PROGRESS].map((p) => [p.slug, p])).values()];

type Params = Promise<{ slug: string }>;

export const dynamicParams = false; // unknown slugs return a real 404

export function generateStaticParams() {
  return ALL.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const p = ALL.find((x) => x.slug === slug);
  if (!p) return {};
  const d = getDetail(p.slug, p.title, p.image);
  const description = d.sections[0].body.slice(0, 155).replace(/\s+\S*$/, '') + '…';
  return {
    title: `${d.name}, ${d.type}`,
    description,
    alternates: { canonical: `/projects/${slug}` },
    openGraph: {
      type: 'article',
      url: `/projects/${slug}`,
      title: `${d.name} | Taruna Interior Gallery`,
      description,
      images: [{ url: d.heroImage ?? p.image, alt: d.name }],
    },
    twitter: { card: 'summary_large_image', images: [d.heroImage ?? p.image] },
  };
}

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;
  const i = ALL.findIndex((x) => x.slug === slug);
  if (i === -1) notFound();

  const p = ALL[i];
  const nextP = ALL[(i + 1) % ALL.length];
  const d = getDetail(p.slug, p.title, p.image);

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CreativeWork',
        name: d.name,
        description: d.sections[0].body,
        image: d.heroImage ?? p.image,
        dateCreated: p.year,
        genre: d.type,
        locationCreated: d.location,
        url: `${SITE.url}/projects/${slug}`,
        creator: { '@type': 'Organization', name: SITE.name, url: SITE.url },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url },
          { '@type': 'ListItem', position: 2, name: 'Projects', item: `${SITE.url}/projects` },
          { '@type': 'ListItem', position: 3, name: d.name, item: `${SITE.url}/projects/${slug}` },
        ],
      },
    ],
  };

  return (
    <>
      <JsonLd data={schema} />
      <ProjectDetail
        project={{ id: p.id, title: d.name, year: p.year }}
        detail={d}
        next={{ slug: nextP.slug, title: nextP.title.split(',')[0].trim(), image: nextP.image }}
      />
    </>
  );
}