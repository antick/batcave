---
title: "A Bat-Signal in CSS"
seoTitle: "A Bat-Signal in CSS"
description: "A small dashboard light, before I get carried away and order a projector."
excerpt: "A small dashboard light, before I get carried away and order a projector."
slug: "a-bat-signal-in-css"
pubDate: 2026-05-09
updatedDate: 2026-05-09
author: "Bruce Wayne"
authorUrl: "/about"
category: "Snippets"
tags:
  - "gotham"
  - "batman"
  - "snippets"
featured: true
draft: false
canonicalUrl: "https://example.com/a-bat-signal-in-css"
robots:
  index: true
  follow: true
ogImage: "/images/content/sample-content-light.svg"
ogImageDark: "/images/content/sample-content-dark.svg"
ogImageAlt: "An abstract Batcomputer notebook and geometric workshop study"
ogImageWidth: 1200
ogImageHeight: 630
socialCardType: "summary_large_image"
schemaType: "BlogPosting"
language: "en"
relatedPosts:
  - "the-batcomputer-needs-a-restart"
---

Lucius asked for a small status light on the workshop dashboard. I submitted a skyline projection. We eventually agreed on this much smaller fictional example.

## A little light for the dashboard

```css
.bat-signal {
  width: 5rem;
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(circle, #ffe48b, #b68b2e);
  box-shadow: 0 0 2rem #ffe48b66;
}
```

## Keep the signal useful

Pair a status light with a text label so its meaning is clear without color. In the cave, that label usually reads “Alfred has been trying to reach you.”

This snippet is illustrative. The real Bat-Signal remains considerably less portable.
