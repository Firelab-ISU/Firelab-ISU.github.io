# FIRE Lab GitHub Pages Website

This is a static GitHub Pages website with four pages:

- `index.html` - Home
- `people.html` - People
- `publications.html` - Publications
- `news.html` - News

## Deploy to GitHub Pages

1. Download and unzip the website package.
2. Copy all files and folders into the root of your `firelab.github.io` repository.
3. Commit and push to GitHub.
4. Go to `Settings -> Pages`.
5. Set source to `Deploy from a branch`, branch `main`, folder `/root`.
6. Wait for GitHub to deploy the site.

## Customize

- Replace placeholder names in `people.html`.
- Replace publication entries in `publications.html`.
- Replace announcements in `news.html`.
- Replace `contact@example.edu` in all files.
- Replace the SVG placeholders in `assets/` with real lab images or member photos if desired.

No build system is required. The site uses only HTML, CSS, JavaScript, and SVG assets.


## Iowa State themed update

This version uses an Iowa State inspired cardinal-and-gold visual system:

- Cardinal: `#C8102E`
- Gold: `#F1BE48`
- Deep cardinal: `#7C2529`
- Warm cream background accents: `#fff8e7`

The custom FIRE Lab SVG logo is located at:

```text
assets/fire-lab-logo.png
assets/fire-lab-logo-mark.png
assets/favicon.png
```

To replace it with another logo, keep the same filename or update the `src` paths in the HTML files.
