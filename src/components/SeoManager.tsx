import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE = 'SurePlug';
const DEFAULT_DESCRIPTION =
  'Browse verified professionals, compare ratings, and book help for home repairs, cleaning, moving, and more on SurePlug.';

const ROUTE_SEO: Record<string, { title: string; description?: string }> = {
  '/': {
    title: 'Find skilled plugs near you',
    description: DEFAULT_DESCRIPTION,
  },
  '/taskers': {
    title: 'Explore plugs',
    description:
      'Browse verified SurePlug professionals by skill, rating, and city. Compare options and book help fast.',
  },
  '/about': {
    title: 'About us',
    description: 'Learn how SurePlug connects people with skilled local service professionals.',
  },
  '/contact': {
    title: 'Contact',
    description: 'Get in touch with the SurePlug team at hello@sureplug.com.',
  },
  '/waitlist': {
    title: 'Join the waitlist',
    description: 'Join the SurePlug waitlist for early access and launch updates.',
  },
  '/become-a-provider': {
    title: 'Become a provider',
    description: 'Offer your skills on SurePlug and get booked by customers near you.',
  },
  '/login': { title: 'Log in' },
  '/signup': { title: 'Sign up' },
};

function setMeta(name: string, content: string, property = false) {
  const attr = property ? 'property' : 'name';
  let el = document.head.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export default function SeoManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    const entry = ROUTE_SEO[pathname];
    const title = entry ? `${entry.title} | ${SITE}` : `${SITE} — Find skilled plugs near you`;
    const description = entry?.description ?? DEFAULT_DESCRIPTION;
    const url = `https://www.sureplug.app${pathname === '/' ? '/' : pathname}`;

    document.title = title;

    setMeta('description', description);
    setMeta('og:title', title, true);
    setMeta('og:description', description, true);
    setMeta('og:url', url, true);
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);

    let canonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.href = url;
  }, [pathname]);

  return null;
}
