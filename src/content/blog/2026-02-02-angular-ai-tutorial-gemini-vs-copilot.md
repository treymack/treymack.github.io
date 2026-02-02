---
title: "Angular's AI Tutorial: Gemini vs GitHub Copilot Through MCP"
date: 2026-02-02
description: "Comparing GitHub Copilot and Google Gemini when following Angular's AI Tutorial through their MCP server - one stayed on track, the other ran out of tokens."
categories: angular
tags: ["angular", "mcp", "gemini", "copilot", "ai"]
---

I tried working through [Angular's AI Tutorial](https://angular.dev/ai/ai-tutor) using their MCP (Model Context Protocol) server. First with GitHub Copilot, then with Google Gemini. The experience was.. different.

<!--more-->

Angular's MCP server is supposed to provide structured guidance for learning Angular through AI-assisted development. The AI has access to the tutorial's context and guides you through building an Angular application step-by-step, following the official curriculum.

At least, that's the idea.

## Copilot ran out of tokens

I started with GitHub Copilot. Things were going fine until suddenly they weren't. **Copilot ran out of tokens mid-tutorial**. Not just for the session - for the entire month. I was in the middle of implementing a feature and just.. stopped. Now I wait for the monthly reset.

Not sure what the free tier token limits are for Copilot vs Gemini, but the difference was obvious. Copilot hit the ceiling. Gemini never came close.

## Copilot made up its own curriculum

More annoying than the token limit was Copilot **veering off the tutorial's guidelines**. It started making up its own curriculum. Not minor tweaks - completely different approaches than what the tutorial intended.

When you're trying to learn a framework's recommended patterns, having the AI invent its own is pretty counterproductive. I wanted Angular's conventions, not Copilot's interpretation of them.

## Gemini was way more aligned

Switching to Gemini was better. It **stayed aligned with the original tutorial goals**. Followed the MCP server's guidance. When I needed help, it reinforced the patterns Angular wanted me to learn instead of going rogue.

Gemini's implementation led to a **more interesting data setup that resulted in child routes**. But this wasn't going off-script - it was exploring the architectural possibilities within the tutorial's framework. The child routes felt like a natural progression, not a deviation.

And Gemini **never ran out of tokens**. I could freely explore and ask for clarification without watching a meter tick down.

## Both were out of date

Here's something that applied to both: **neither was up to date with the latest Angular**. The type names for Signal Forms were different from what's in the current docs. I'm guessing they were trained earlier and the web docs got updated later?

Signal Forms is in flux, so type changes aren't surprising. But I figured the AI would have the latest. Nope. They were working with older information.

## What does this mean?

I don't know the exact token allowances for each service's free tier. But the practical difference:

- **Copilot**: Hit monthly limit mid-tutorial, blocking progress
- **Gemini**: Completed entire tutorial, no token concerns

Quality difference:

- **Copilot**: Creative but undisciplined, invented its own curriculum
- **Gemini**: Focused and aligned, stayed true to the tutorial

For learning frameworks through AI-assisted tutorials, I'd reach for Gemini over Copilot based on this. The combination of better alignment and no token anxiety made for a much smoother experience.

Your mileage may vary on paid tiers with different limits. But for free tier users working through Angular's MCP tutorial, Gemini was the winner.
