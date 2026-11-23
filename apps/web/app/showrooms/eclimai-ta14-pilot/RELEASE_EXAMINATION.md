# EclimAi x TA-14 | Release examination
Date: 2026-11-22
Status: HOLD for external distribution; technical preview available, partner approval absent

## Verified
- PR #727 is a draft technical examination, not a joint pilot approval.
- At commit 2c6d8bf6c32412e34dacb2668f81914e156b0b0f, GitHub Verify application and Vercel Preview Comments completed successfully; Vercel preview reported READY at the matching SHA.
- The React exhibit array references eight original image assets (01-08), and the user reported the restored showroom looked good.
- Eight exhibit narration controls and a two-fixture synthetic HOLD/ALLOW teaching demonstration are present in source code.
- v2 technical review is accessible as print-friendly HTML at /showrooms/eclimai-ta14-pilot/review; no committed v2 PDF binary is claimed.

## Not independently verified
- Browser-level narration playback and voice selection; speechSynthesis availability and voice vary by device/browser.
- Browser-level Academy question interaction, HOLD/ALLOW button operation, mobile layout, print output and all image loads.
- Scientific validity of pictured numbers, calculations, approval language or outcomes in the original raster images.

## Required before external release
1. Correct embedded misleading text and numbers in original artwork 05, 07 and 08. The visible disclaimers mitigate but do not replace pixel-level correction.
2. Run desktop/mobile browser checks for all eight image loads, Samantha play/stop, HOLD/ALLOW and Academy questions; record observed results, not assumptions.
3. Use the print-ready v2 review as the authoritative companion unless a reviewed PDF binary is separately committed and linked.
4. Obtain EclimAi's explicit consent before externally distributing a co-branded presentation. The noindex preview URL is publicly reachable, not confidential.
5. Require separately approved site/operator protocol and independent outcome verification before any physical pilot or performance claims.

## Decision
Keep PR #727 draft. Technical build/deployment success does not establish functional browser verification, partner consent, pilot execution or validated savings.
