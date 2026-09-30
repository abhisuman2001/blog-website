# ShipLog

Blog at **shiplog.me**: Astro site + Sanity CMS (project `11zxsgcg`).

- Site (this folder): `npm install`, then `npm run dev` (local) or `npm run build`.
- Dashboard: `studio/` folder. You write and publish posts there.
- Until you publish your first post in Sanity, three sample posts are shown.

## 1. Push to GitHub
```
git init
git add .
git commit -m "ShipLog starter"
git branch -M main
git remote add origin https://github.com/abhisuman2001/blog-website.git
git push -u origin main
```

## 2. Launch the dashboard (writing area)
```
cd studio
npm install
npm run dev        # try it locally at http://localhost:3333
npm run deploy     # hosts it free at <name>.sanity.studio (pick a name, e.g. shiplog)
```
Log in with the same account you used to create the Sanity project. Create a few posts and click Publish.

## 3. Deploy the site on Vercel
1. vercel.com > Add New Project > import the GitHub repo. Framework: Astro. Root directory: the repo root. Deploy.
2. Project > Settings > Domains > add `shiplog.me` and follow the DNS instructions at your domain registrar.

## 4. Auto-update the site when you publish
1. Vercel > Settings > Git > Deploy Hooks > create a hook, copy the URL.
2. sanity.io/manage > your project > API > Webhooks > Create: URL = the hook, dataset = production, trigger on Create, Update, Delete.

The dataset must be public (default) so the site can read posts.

## 5. Google AdSense (after you have about 15+ original posts)
1. Fill in About, Contact and Privacy pages in `src/pages/` (search for "EDIT ME").
2. Apply at adsense.google.com with shiplog.me.
3. After approval: put your `ads.txt` line in `public/ads.txt`, and add the values from `.env.example` in Vercel > Settings > Environment Variables, then redeploy. Ads then appear in the sidebar, feed and articles automatically.
