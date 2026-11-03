# Auzem’Beers & Sons: site-wide design

## Direction
Editorial brewery identity: warm paper #f2eddf, forest ink #243c32, rust #a73d29. Georgia display and system sans-serif. Flat surfaces, thin rules, generous space, real repository photography. No gradients, ornamental icon cards, fake metrics or invented testimonials. This is an original direction, not a claimed output of Awards MCP or Genjutsu.

## Architecture
All seven HTML pages load styles.css and site.js. The script supplies the shared navigation, footer and age dialog. HTML retains fallback navigation and all core page content without JavaScript. FAQ uses native details/summary. Session storage is guarded. No packages, build step, paid services or new backend. Existing Elfsight integration retained.

## Content decisions
Removed simulated profile/order history, fake submission success and hard-coded unsynchronised stock badges. Removed manually written testimonials pending verification; retained Google review link and Elfsight. Existing product names, ABVs and tasting/rental information carried forward, not independently verified. Unverified delivery promises replaced by direct confirmation. Missing product photos use explicitly labelled ambient images. No real authentication, order submission or payment processing is implemented.

## QA status
Repository asset names checked. Browser rendering, screenshots, accessibility audit and third-party widget loading have NOT been tested in this environment. Do not treat a branch URL as a deployed website.

## Minimal local preview
Run python -m http.server 8000 from a checkout of this branch, then visit http://localhost:8000. No build step.

## Visual review checklist
Review every HTML page at 390px, 768px and 1440px widths. Verify no horizontal overflow, readable photos/crops, keyboard focus and navigation. Check age dialog focus/exit and session persistence; open/close menu with keyboard and Escape. Expand FAQ with keyboard. Prepare a message and verify it explicitly says nothing was sent. Confirm missing images and console errors are absent. Review Elfsight failure fallback. Confirm prices, delivery terms, beer descriptions and review authenticity with the owner before publication. Obtain approval before merging to main.
