// Site-wide settings. Edit these instead of hunting through templates.
export const SITE = {
  name: 'ShipLog',
  url: 'https://shiplog.me',
  tagline: 'A logbook for people who build things.',
  description: 'Hackathon updates, AI news and practical tech guides for students and builders.',
  locale: 'en-IN',
  timeZone: 'Asia/Kolkata', // dates are shown in this zone, whatever zone the build server runs in
};

export const AUTHOR = {
  name: 'Abhishek Kumar Suman',
  role: 'Writes and edits ShipLog',
  github: 'https://github.com/abhisuman2001',
  email: '', // add a public contact address here; it appears on the Contact page and author box
};

// Keys are the values stored in Sanity; `slug` is what appears in the URL.
export const TOPICS = {
  hack: {
    slug: 'hackathons',
    name: 'Hackathons',
    description: 'Upcoming events, deadlines, and how to build something judges remember.',
  },
  ai: {
    slug: 'ai',
    name: 'AI',
    description: 'Model releases, tools and research, explained for people who build.',
  },
  tech: {
    slug: 'tech',
    name: 'Tech',
    description: 'Practical guides to the stacks, tools and services for shipping products.',
  },
};

export const topicBySlug = (slug) => Object.entries(TOPICS).find(([, t]) => t.slug === slug);
