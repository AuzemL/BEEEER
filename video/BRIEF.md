# Auzem’Beers & Sons — HyperFrames production handoff

Status: proposed production brief, not a rendered or validated video. The website animation code is separate from HyperFrames. No HyperFrames runtime was available in the authoring chat; CLI usage, dependencies and render quality remain unverified.

## Intended result
- Workflow candidate: general-video (custom photographic montage). Confirm routing using the installed HyperFrames skill before authoring.
- 12-second silent brewery introduction; 1920 x 1080, 30 fps, MP4.
- Authentic existing photography, restrained typography, gentle image movement. No invented footage, generated people, fake pouring scenes or fabricated awards.
- Palette from the site: paper #f2eddf, green #243c32, rust #a73d29. Georgia headlines and Arial supporting copy.

## Proposed sequence
1. 0–4 seconds: ../Bar2.jpeg. Title: Auzem’Beers & Sons. Supporting text: Brasserie artisanale · Taller, Landes.
2. 4–8 seconds: ../Brassin.jpg. Text: Une brasserie. Pas une usine.
3. 8–12 seconds: ../Houblon.jpg. Text: Rendez-vous à Taller. Supporting text: Premier vendredi du mois · 18 h – 21 h.
Keep a legible footer throughout: L’abus d’alcool est dangereux pour la santé. À consommer avec modération.

## Production requirements
Use only the repository photography and brewery details already present on the site. Confirm permission to reuse photographs in exported promotional video and confirm the schedule before publishing. Treat this storyboard as a proposal, not a separately approved video brief. Do not add narration or paid generation without approval. Keep all essential information available as normal HTML outside the video.

## HyperFrames execution
Use the user-linked HyperFrames skill in a compatible runtime. Its documented loop is: read the runtime instructions, provision the task-local runtime, read its pinned HyperFrames skill, choose the workflow, read hyperframes-core and required references, author a deterministic seekable composition, validate, render, inspect actual frames, and retain logs. Do not replace this with an ordinary looping CSS page and call it rendered.

Public CLI documentation provides these starting commands (not executed here):

```sh
npx hyperframes init brewery-promo
cd brewery-promo
npx hyperframes preview
npx hyperframes render --output brasserie-promo.mp4
```

Follow the generated project's installed CLI and skill instructions for validation, asset copying, version pinning, frame inspection and delivery. These commands alone are not a complete production workflow.

## Website integration
After validation and visual review, publish the exported file as media/brasserie-promo.mp4 at repository root. The homepage probes this optional file with a lightweight HEAD request. Only a successful video content type reveals the player. Until then there is no visible empty or broken player, although a missing-file HEAD request may appear in developer tools. If the hosting provider does not support HEAD or returns a non-video MIME type, correct the hosting configuration or change the integration after testing.

The player is user-initiated, has native controls, uses Bar2.jpeg as its poster and has no autoplay. Rendered video is not needed for the headline, reveal or scroll effects. Keep the export small enough for mobile visitors; review compression and playback on a phone before publishing. If speech is added later, provide captions and an accessible transcript.

## Review checklist
- Test homepage on desktop, keyboard, mobile and reduced-motion settings.
- Dismiss the age dialog and verify headline animation begins afterward.
- Verify existing menu effects still work.
- Disable JavaScript: all practical information and original content must remain readable.
- Test missing MP4, valid MP4, invalid MIME type and playback failure.
- Verify title readability, photo crops, start/middle/end frames, exact duration, silent audio expectations and legal footer in the actual rendered export.
- Browser, mobile and render testing were not performed in the authoring chat.

Sources:
- Inspiration: https://www.youtube.com/watch?v=9eHEOAn2FOA
- User skill: https://www.perplexity.ai/computer/skills/YY2GDX4pTfyecJ1inkMbBg?skillId=618d860d-7e29-4dfc-9e70-9d629e431b06
- Public skill page: https://www.perplexity.ai/computer/plugins/skills/618d860d-7e29-4dfc-9e70-9d629e431b06
- Framework: https://github.com/heygen-com/hyperframes
- CLI: https://hyperframes.heygen.com/developers/cli
