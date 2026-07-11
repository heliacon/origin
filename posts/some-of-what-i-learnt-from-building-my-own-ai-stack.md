---
id: some-of-what-i-learnt-from-building-my-own-ai-stack
title: Some of what I learnt from building my own AI stack
kind: note
status: published
author: Pete Dainty
published: 2026-07-10
updated: 2026-07-10
summary: >
  A follow-on to moving my AI back onto my own machine. What I have actually learnt running a
  mixed local and cloud setup: route the task, don't pick a side, the things that quietly broke,
  how much I offload and why the rationing has already started.
---

# Some of what I learnt from building my own AI stack

<figure class="fig">
<img src="/assets/notes/stack-usage-limits.png" alt="Claude usage screen showing the current session limit at 100% used with a full red bar, weekly all-models limit at 47% and Sonnet-only at 0%.">
<figcaption>One of my goals is limiting the amount of times I see that red bar.</figcaption>
</figure>

When I first built my private local setup, I found out that it was still leaking…oops! An app that was meant to be fully local was fetching its charting library from a public CDN on every page load and it was never caught until I watched the logs, the agents however thought it was all fine.

A while back I wrote [why I was moving some of my AI back onto my own machine](/notes/moving-my-ai-back-onto-my-own-machine/) and I want to continue this with some summary of my efforts and some of what I've learnt along the way. This is also a work in progress so I'll try to keep these documents up to date with the latest, very likely that when I get updated hardware that can handle more then I'll be changing more!

## Routing not choosing

The whole thing is based on me not picking all cloud or all local, instead I route between them depending upon the task.

The clever expensive cloud model plans, reasons and writes the hard code. A lot of things at the moment I'm building need good code output, though even the best models still can't be left unattended no matter how many skills, checks and context is added so I'm still in the loop.

Small, private, free models do the work that either shouldn't leave the room or that's too cheap to meter, which is basically as much as I can reasonably offload. Multiple models can be used and switched between so for example I dial up to an instruct 24b model for documenting or dial down to a 4b model for summarising and for some tasks I can use a 1.7b model. I did try always keeping the 4b active to keep things a bit quicker and maintain more context between model switches but I lost too much of the available memory and context windows to make it worthwhile on a small machine, read my poor 24gb machine crashed more times than a car in a demolition derby.

I have a thin layer in the middle of all of this that decides which is which, monitoring where all the tokens go, it's configurable by the task type.

I either write using my local assistant or currently using Claude Code which has a series of settings now that when a task is invoked it ships the thing off to the local models.

In my view the economics work like this: my scarce resource is my frontier quota and not local compute. I push the reductive bulk, which can be as high as 80% some days and as low as 4% on others like today, on to the free models to reserve the frontier for the hard execution it's genuinely better at. This spares the API credits and on a flat rate plan the payoff is then the headroom and me not hitting the wall mid session, which happens a lot less now unless I'm running multiple coding agents at the same time. I still watch my weekly session limits with some trepidation though and I still bet costs are going to go up.

<figure class="fig">
<img src="/assets/notes/stack-offload-dashboard.png" alt="Local AI offload dashboard showing 3.9 percent local of all tokens, 345.8k tokens all local, 284.2k tokens in, 61.6k tokens out, 468 total requests, 0 cloud tokens, 0 errors, and a token flow chart for the last 24 hours.">
<figcaption><strong>Figure 1. Today's dashboard.</strong> 100% offload, zero errors for every request the gateway saw but today's volume is small, 345k local tokens against the 9M I've spent on frontier coding.</figcaption>
</figure>

Cloud is treated as the exception which is shrinking each year as the open models improve and gain ground. For example, I now frequently get better and more useful results running Flux for image generation on my 24gb machine than I did using Claude and its new design thing, and though I still get better image generation using ChatGPT and Grok but not Gemini, it's quite plausible that when I'm able to run a bigger model it'll match that quality or surpass it. Though I will also state as a previous graphic designer that when it comes to things that are truly original and creative, you get much better results putting the effort in and doing it yourself. AI is good for complicated tasks but not so good for the complex and creative ones.

## It wasn't easy going

Building this took a lot of back and forth and a good reminder of why you really need a human in the loop to exercise judgement gained from experience, knowledge and expertise.

The CDN leak that I mentioned was the first of these but was by no means the last… and as I write this I have new issues I discover as I refine and improve my products.

I once found the wrong model got dressed up as the default which one of my apps chose as its model by asking the server "what have you got?" and then taking the first item on the list. The first item was the biggest model on the machine so a feature meant to answer in two seconds kicked off a thirty second cold load of a 16 GB model and tied up my machine.

All the tests were green but the reality was very different and I had many more issues along the way such as when I went looking for a better creative writing model and picked the one the leaderboards rate highest at my size and waited out a 17 GB download. The model loaded without complaint but then generated `<pad><pad><pad>` forever. Turned out the model and my version of the runtime were not agreeing about how attention is capped so it produced fluent nothing. So while the leaderboards would tell me the best my machine could technically run, the reality turned out to be something else entirely when looking at my runtime and actual use.

Then there's the issue I only caught by reading the output closely, the larger model I leaned on for prose, which is genuinely strong, was trained heavily on Chinese language and so sometimes a Chinese character drops into an otherwise English sentence. Good at English and native to English aren't the same thing. I found that a multilingual model's other languages can leak under the right conditions and a high sampling temperature makes it worse. You won't see this in any benchmark score but only by using it and reading what it actually writes. In the end I moved to a European model better weighted to my own language though definitely not my dialect :)

As I said in my previous article, this is all early days and I think this eventually gets easier and will become like installing an app but today it's still very much developer and tinkerer grade. Each time I use my setup I find something else to tweak or to add, it's a living system and when I upgrade the hardware and I'm able to start using >70b models then I'll no doubt be updating the system and documentation again. It's really going to come down to how affordable higher memory machines become, think back to when it felt awesome and how costly it was to have a 4gb hard drive and where we are now…

## So how much have I offloaded then?

<figure class="fig">
<div class="tablewrap"><table>
<thead><tr><th>Task</th><th>Runs where</th><th>Why</th></tr></thead>
<tbody>
<tr><td>Summarising logs, threads, documents</td><td><strong>Local</strong></td><td>Reductive, bounded, often private</td></tr>
<tr><td>Classifying and triaging</td><td><strong>Local</strong></td><td>Cheap, repetitive, no frontier needed</td></tr>
<tr><td>First draft emails and notes</td><td><strong>Local</strong></td><td>I'm editing it anyway</td></tr>
<tr><td>Q&amp;A over my own documents</td><td><strong>Local</strong></td><td>Documents shouldn't leave</td></tr>
<tr><td>Transcription and redaction</td><td><strong>Local</strong></td><td>Strips names and numbers before anything sees them</td></tr>
<tr><td>Agentic, multi-file coding</td><td><strong>Cloud</strong></td><td>Frontier clearly leads on SWE-bench-style coding benchmarks</td></tr>
<tr><td>Deep reasoning, novel problems</td><td><strong>Cloud</strong></td><td>Local can't compete yet</td></tr>
</tbody>
</table></div>
<figcaption><strong>Figure 2.</strong> Task types I route between local open models and frontier.</figcaption>
</figure>

I had to build the logging and dashboards to show this so I can now observe volumes between tasks and models as I've split them.

Last week I logged about ~13k local requests and ~1.33 million tokens which was about ~25% of my total volume as I'm currently heavily into coding and need the frontier models for what I'm building. My heaviest task types on local in that session were summarise (48%), write (18%), draft (17%), classify (9%) and research (8%).

This week it's about the same and although I'm doing more QA I'm still mostly using frontier as I'm doing very heavy coding and really not much else, ~9 million tokens for yesterday and only about ~345k are going local… but it all helps. The more I use it, the better it gets, I'm just updating my app right now to make better use of skills and sub agents.

<figure class="fig">
<img src="/assets/notes/stack-task-breakdown.png" alt="Local gateway usage dashboard breaking down tokens by model, task, tier and client, with per-tier performance and requests by sensitivity.">
<figcaption><strong>Figure 3. Breakdown of today's tasks.</strong> I'd expect over the weekend my drafting and wiki use to shoot up as I'll be doing more documentation than code.</figcaption>
</figure>

Some things I've found aren't worth offloading to any agent at all, these tend to be complex tasks such as creative ones where I need to do something like draw or design a logo or come up with a name for something… or writing an article, generally it can help me with research but not do the writing for me.

Logging all this was also useful as I looked at my local p95 latency which was getting ugly because I'd left a big reasoning model resident instead of the 4B I default to. I switch out from the default to other bigger models rather than tie up my memory, so now when I leave one resident it's because I want it and I pay the 130 seconds knowingly, though in this case that 130 seconds was me processing some huge files. Running local models also lets me add in far more telemetry to observe what's going on in the system than what I can get out of the frontier models and helps me continually improve my system, like bringing down those latency numbers.

## Why I think it's worth investing in local

For me it's about many things like personal interest, cost, privacy, control, not seeing that usage bar turn red and so on. I like that I'm able to build whatever I can think of and host my own apps without subscription costs. I also think the free ride is coming to an end and I want to be prepared for that.

We're seeing token rationing and limiting becoming mainstream on what once was unlimited with every CEO telling us to use unlimited AI. It's getting expensive and employees are being limited on usage while being told to do more with it. They quickly reach the limits of their allowances because there's few options for when or when not to use AI and for which model to use. We must all be using AI is the CEO's cry… until that bill arrives and there's only so many people you can lay off to pay for it. Soon you'll want a local setup just to be able to do your work effectively and remain within the company cost limitations.

This cost pain and rationing is real and documented…

- In June 2026 the Financial Times reported that Amazon, Walmart, Cisco, Uber and Meta had all begun capping what staff may spend, warning them off trivial usage and steering them toward smaller models. Uber exhausted its entire 2026 AI budget by April and now limits each employee to $1,500 a month per tool. Financial Times, 19 June 2026, paywalled.
- Leaked audio from an internal meeting at Accenture caught the firm trying to stop employees from draining its token reserves on basic work like turning PDFs into slides not long after it had warned staff they risked losing out on promotions if they didn't use AI. [404 Media](https://www.404media.co/the-tokenpocalypse-is-here-companies-are-scrambling-to-stop-spending-so-much-on-ai/), [reported by TechCrunch](https://techcrunch.com/2026/06/24/companies-are-scrambling-to-stop-employees-from-maxing-out-ai-budgets-with-small-tasks/).
- Bryan Catanzaro, Nvidia's VP of applied deep learning, told [Axios](https://www.axios.com/2026/04/26/ai-cost-human-workers): "For my team, the cost of compute is far beyond the costs of the employees." His CEO has suggested a $500,000 engineer ought to be consuming at least $250,000 of tokens a year. [Fortune](https://fortune.com/2026/04/28/nvidia-executive-cost-of-ai-is-greater-than-cost-of-employees/), reporting Axios; Huang's remarks [via Forbes](https://www.forbes.com/sites/richardnieva/2026/03/31/the-ai-gods-spending-as-much-as-they-can-on-ai-tokens/).
- The mitigations enterprises are now adopting: per-user token budgets, usage dashboards and a move to open-weight models hosted on their own infrastructure. [Yahoo Finance, Corporate America Is Rationing AI](https://finance.yahoo.com/technology/ai/articles/corporate-america-rationing-ai-because-172413130.html).

Ultimately I think this is another reason why people will seek out local open weight models, not to replace entirely but to gradually supplement as I have, and why the corporations will push heavier into this investment probably with their own local models.

## Near term the apps matter more to me than the stack

The gateway is just the foundation I built to enable the applications and to keep me from hitting limits so I can build more while avoiding overages or without having to go back to the APIs. What I want to build are apps that are private by construction, each one closed, running its own AI on my machine and reaching the outside world only when required, however, privacy is just one part of my bigger plan.

I started building apps on top of this foundation with a private desktop assistant first that handles a lot of things to help me build my other apps and manage the stack, which is its own story that I'll write up separately, but in it I have multiple sub apps like my own task ticketing system which really helps with context and tracking. I can build and append whatever I want to my local system at zero cost.

A key point in doing all this was that everything I build inherits these capabilities for free, so I mostly build once and focus more on each product knowing the foundations are strong and in line with my principles while the agents context and learning improves every day. The amount of times I now hit a window is becoming less frequent, still happens but mostly when running multiple agents. One thing I like doing is near the end of the week when the usage is going to reset, I open up the throttle on running multiple agents on tasks.

I continue to fine tune and improve my local setup and I'm writing the installation steps for you all to follow, I will try to get this all up on a repo too for you to download and play with.
