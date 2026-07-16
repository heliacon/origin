---
id: why-everything-ai-builds-looks-the-same
title: Why everything AI builds looks the same
kind: note
status: published
author: Pete Dainty
published: 2026-07-11
updated: 2026-07-11
summary: >
  Every site an AI builds looks the same. The fix on offer is a longer list of banned fonts.
  That is subtraction, and it removes the tell without removing the sameness. The real cure is
  an origin.
---

# Why everything AI builds looks the same

I spent a day sharpening the design instructions my coding agents follow, reading through the current crop of tools that promise to fix AI design. They are good tools. They also quietly agree on something worth saying out loud.

Every site an AI builds looks the same.

Ask a model to build a landing page and you tend to get one of three looks. A warm cream background with a serif display and a terracotta accent. A near black page with a single bright acid accent. Or a broadsheet layout of hairline rules and dense columns. Anthropic [named these three itself](https://github.com/anthropics/claude-cookbooks/blob/main/coding/prompting_for_frontend_aesthetics.ipynb). The tell is not that any of them is ugly. The tell is that you get them whatever you asked for. They arrive regardless of the subject.

So a wave of design skills has appeared to fix it, and most of them start by banning things. No Inter, no Roboto, no gradient text, no glassmorphism, no big number hero. I added a list like this to my own skills this week and it does help. But a ban list is subtraction. It removes the sameness and leaves a blank. Even the better tools do not stop there. Anthropic's own design skill tells you to commit a direction before you write any code, then to ask whether you would produce this same design for [any similar prompt](https://github.com/anthropics/skills/tree/main/skills/frontend-design). That question is the whole game. If the answer is yes, you did not design anything. You returned the average.

Which is what I think is actually going on. A model with nothing to go on returns the average of everything it has seen. Sameness is the shape of an absent identity. When nothing in the brief says who this is for and what it stands for, the vacuum fills with the mean. The generic look is not a failure of taste. It is what you get when there is no source of truth for the model to inherit taste from.

That is the whole reason this site is built the way it is. There is one origin, a single canonical statement of who the thing is, its colour, its type, its one signature element, its voice. Every projection is generated from that origin and carries it. Distinctiveness is not a font you picked. It is a source that everything downstream inherits.

This site is navy and gold. The wordmark is set in Cinzel. The mark is a sun and a lambda joined to an A. It does not look like the median, and not because I banned a typeface. It looks like itself because there is an origin for it to look like. Give a model that origin and it stops reaching for the average, because now it has something truer than the average to reach for.

This is the same lesson I keep meeting everywhere in this work. The tool gives you plausible output fast. The judgement, the identity, the part that is actually yours, still has to come from you. Green tests, plausible pages, fluent prose, all of it is the median until a person decides otherwise. A machine cannot originate what you have not.

So the cure for sameness is not a longer list of banned fonts. It is deciding who you are once, writing it down, and letting everything you build inherit it. Subtraction removes the tell. Only commitment removes the sameness.
