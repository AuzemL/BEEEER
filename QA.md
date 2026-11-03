# Repeatable site checks

## Changes
Homepage motion is isolated in home.css/home.js; the index includes a practical visit/rental strip. Product cards and the tireuse enquiry button get a validated selection query parameter through site.js. Query values are accepted only when they match an existing enquiry option. Drafts remain unsent; no backend was added. Shared navigation/footer still use JavaScript with the existing fallback links; full static-markup refactoring is not part of this batch. No new product facts or delivery promises added.

## Source validation
From the repository root: `python tests/validate_site.py`. Uses the Python standard library. Checks all seven pages, local HTML references/anchors, h1 counts and image alt attributes; does not parse references embedded in JavaScript/CSS or verify external links.

## Browser setup
Optional test-only dependency, not required to serve the website:

```sh
python -m pip install playwright
python -m playwright install chromium
python -m http.server 8000
```

In another terminal from the repository root:

```sh
python tests/browser_checks.py
```

For the deployed site: `BASE_URL=https://auzeml.github.io/BEEEER/ python tests/browser_checks.py` (POSIX shell). The tests cover root and explicit index URLs, 390/768/1440px screenshots, navigation, enquiry selections, age dialog persistence, FAQ, broken images and reduced motion. Elfsight is blocked in the screenshot context for deterministic results; verify the real widget separately. Scripts create screenshots in output/browser-qa. Review them manually; passing smoke checks is not visual approval.

## Status
These scripts are provided for execution in a browser-enabled environment. No browser test, screenshot review or live-deployment verification is claimed by this commit. No GitHub deployment configuration was changed. Confirm monthly tasting times and rental terms with the owner before relying on them.
