// Shown only in local dev when Sanity is unreachable, or before the first post is published.
export const samplePosts = [
  {
    slug: 'pick-a-hackathon-idea',
    title: 'How to pick a hackathon idea judges remember',
    topic: 'hack',
    date: '2026-09-28T09:00:00Z',
    excerpt: 'Most teams build the same chatbot. Choose a smaller problem you can finish and demo well.',
    html:
      '<p>Judges see dozens of projects in a day. The ones they remember solve one clear problem for one clear person, and the demo works on the first click.</p>' +
      '<h2>Start from a problem you have seen</h2><p>Small and real beats big and vague. If you can name the person who has the problem, you can design the demo around them.</p>' +
      '<h2>Decide the demo path on day one</h2><p>Write the three clicks your demo will make. Build those first, and only then add extras.</p>' +
      '<ul><li>One screen that shows the problem</li><li>One action that solves it</li><li>One result the judges can see</li></ul>' +
      '<blockquote><p>A finished small idea always beats an unfinished big one.</p></blockquote>' +
      '<h2>Rehearse the pitch</h2><p>Time it. Two minutes is shorter than you think.</p>',
  },
  {
    slug: 'ai-coding-tools-habits',
    title: 'Using AI coding tools without losing control of your code',
    topic: 'ai',
    date: '2026-09-25T09:00:00Z',
    excerpt: 'AI assistants write fast. These habits keep the result readable, tested, and yours.',
    html:
      '<p>Give the assistant small, specific tasks instead of a whole app in one prompt, and review each change.</p>' +
      '<h2>Run the code after every step</h2><p>If you cannot explain a function, ask for an explanation or rewrite it.</p>' +
      '<pre><code>npm test -- --watch</code></pre>' +
      '<h2>Keep a short project brief</h2><p>A paragraph about your stack and conventions saves you from repeating yourself in every prompt.</p>',
  },
  {
    slug: 'free-stack-first-product',
    title: 'A free stack for launching your first web product',
    topic: 'tech',
    date: '2026-09-22T09:00:00Z',
    excerpt: 'Hosting, database, auth and analytics you can run for free while you find users.',
    html:
      '<p>Static hosting, a managed Postgres free tier and built-in auth cover most first versions.</p>' +
      '<h2>What to pay for first</h2><p>Add analytics from day one, and move to paid plans only when you hit real limits.</p>',
  },
];
