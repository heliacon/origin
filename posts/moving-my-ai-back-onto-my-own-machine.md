---
id: moving-my-ai-back-onto-my-own-machine
title: I'm moving my AI back onto my own machine
kind: note
status: published
author: Pete Dainty
published: 2026-06-10
updated: 2026-07-06
summary: >
  My AI bill is creeping up again. Why I am moving more of my AI onto hardware I own, driven
  by the two things that never go away: cost and privacy.
syndicated:
  - https://www.linkedin.com/pulse/im-moving-my-ai-back-onto-own-machine-pete-dainty-pbqpc/
---

# I'm moving my AI back onto my own machine

My AI bill is creeping up…again! After switching from using the APIs to a subscription plan to save money (worth it!) I'm now hitting the limits much more frequently on my $100 plan and I'm probably not alone in thinking those costs are going to get higher yet again while rate limits feel like they go lower. I also don't want to be spending $1200 to $2400 a year on subscriptions, or run the risk of some expensive overage charges.

It's especially noticeable when I do my coding work and most obvious when running multiple agents as a full stack local AI dev team (currently using Claude, Docker etc.) and I have them loop away on stuff in multi round autonomous build cycles. It now quickly turns into "ruh-oh you've hit your limit" faster than I can write this paragraph. Didn't feel like it used to be the case and now with Fable on Anthropic's Mythos for example, it's priced double that of Opus so I feel it's only going to get more expensive…

I've started to run more and more of this stuff on my own machine and trying out many models like Qwen, Mistral etc. for $0 per token (ignoring electricity). I also had concerns of leaving an external model running with access to everything and it skipping permissions in order to be fully autonomous which is another good reason to move to local models as I could build more specific guardrails.

Among other things, I've built my own tool hosting platform, bug tracker, RAG context store (sqlite & bge-small), a bespoke wiki & task tracking system my agents scribble in to keep better context. I also built a couple of finance tools and a couple other things because I didn't fancy handing my life to someone else's cloud. All stories for another day but this also got me thinking about where all this is all actually heading.

I'm thinking more and more of this is going to run on hardware you own in one form or another…

## Phase 1: Make AI. Phase 2: ??? Phase 3: Profit!

The big AI companies are [about to go public](https://finance.yahoo.com/markets/article/spacex-openai-and-anthropic-here-are-the-most-anticipated-ipos-in-2026-114439441.html) and the moment a company has shareholders then they need profit and to justify their valuation. It's now very much the classic business model of getting people hooked for free and then start to charge more and more when they can't get off it.

The cost of any given level of capability has dropped roughly 10x a year but the flagship models you want to use have currently stopped getting cheaper and have started going back up (Fig. 1). My bill is also likely going up because not only do they need to profit and justify the hype and high valuations but also because we're using way more of it whether we realise it or not.

<figure class="fig">
<img src="/assets/notes/fig1-frontier-cost.png" alt="Line chart of frontier flagship output cost per million tokens by lab from 2023 to 2026, falling sharply then climbing again.">
<figcaption><strong>Figure 1. Frontier flagship costs got cheaper but have started to climb.</strong> Frontier flagship output token price per million tokens, by lab. Each line tracks that lab's most capable model at each date; excludes mini, fast and mid-tier variants. Standard-tier list prices, not Fast Mode, caching or batch discounts. Data: <a href="https://pricepertoken.com/trends">pricepertoken.com/trends</a> and vendor pricing pages (<a href="https://openai.com/api/pricing/">OpenAI</a>, <a href="https://www.anthropic.com/pricing">Anthropic</a>, <a href="https://ai.google.dev/pricing">Google</a>).</figcaption>
</figure>

Modern AI agents don't just answer a question, they think, loop, double check themselves, run several copies at once etc. In order to improve the quality, each task now munches through more tokens than a simple chat used to. So even though each token costs a fraction of what it did, the bill still goes up, because you're using more of them (Fig. 2).

Whether or not they need to, everyone is also putting an LLM call into their workflows and specific components which all adds up too in numerous ways, not just $ cost but also things like latency and complexity for example. All those data centres also need to be funded somehow, paying back the massive investments and keeping the promises that have been made.

<figure class="fig">
<img src="/assets/notes/fig2-token-cost.png" alt="Two bar charts comparing an agentic coding task with a reasoning query and a chat: token usage about 4.17 million versus near zero, and cost about 1.87 dollars versus a few cents.">
<figcaption><strong>Figure 2. What one task actually costs by interaction type.</strong> An agentic task uses ~3500x the tokens of a single reasoning query (~1200x a multi-round chat), driven by the same context being re-read every round. The dollar gap is smaller than the token gap because most of the re-read context is cached and billed at a discount. Source: "How Do AI Agents Spend Your Money?", arXiv:2604.22750 (Stanford / Michigan / All Hands AI, 2026), measured on SWE-bench coding tasks across 8 frontier models. <a href="https://arxiv.org/abs/2604.22750">arxiv.org/abs/2604.22750</a></figcaption>
</figure>

I found when I wanted to commit to Github or navigate files for example via a prompt, instead of calling an LLM to understand what I wanted, I wrote a lightweight classifier ahead of the LLM to run the actions. My tool classifier handled the commands in under 5ms instead of ~20 seconds and still matched the LLMs 96% to 100% of the time. AI is being used to replace any mundane task even when there are cheaper ways to achieve the same thing and if every task is being completed this way, then costs will rise. Of course I could also just type the commands myself but when AI works well it saves so much time.

A lot of companies are building their own internal models because they're faster, cheaper and more secure. For example, [Cursor got burned by model cost pass through and built Composer 2](https://the-decoder.com/cursor-takes-on-openai-and-anthropic-with-composer-2-a-code-only-model-built-to-match-rivals-at-a-fraction-of-the-cost/) on an open base to escape the dependency. And a growing share of enterprises now keep at least some AI on hybrid or on-premises infrastructure, choosing workload by workload what stays in house, [Deloitte's latest survey](https://www.cio.com/article/4165044/enterprises-plan-rapid-growth-for-ai-factories-and-ai-at-the-edge-survey-finds.html) has at-scale "AI at the edge" deployments roughly doubling, from 36% in late 2025 to an expected 72% by 2028.

When those costs do go up, running your own free open source models looks like a good idea. And open models aren't a fringe thing any more, they're now around a third of all the tokens running through one big inference platform, up from almost nothing a year earlier according to [OpenRouter's State of AI study](https://openrouter.ai/state-of-ai).

## The privacy thing is way worse than you think

Whatever your subscription level is, it doesn't buy you back your privacy. On the consumer plans your prompts and outputs are [used for training by default unless you can find the opt out](https://www.anthropic.com/news/updates-to-our-consumer-terms), with retention stretched to 5 years. It's the same story across the big providers with only the enterprise contracts maybe buying you any real exemption but then a lot of enterprises are building their own models which doesn't give any real confidence to that idea. And since we're on LinkedIn, look through the settings which say you grant license to use your content for training…

Most of us shrug off tracking, "They just want to show me shoes I already bought, who cares". Fair enough when it was cookies and ads that you could block. But feed enough of your life into one of these systems, your questions, the stuff you typed and deleted, the things you nearly bought, the 2am searches and it doesn't just know what you did. It [works out things about you](https://arxiv.org/abs/2310.07298) like your health worries, politics or that something's changed at home before you've told anyone. The AI then becomes a frighteningly good guess at who you are.

But where does that good guess live? On someone else's computer, under someone else's rule? Maybe a profit is made from it that you don't see or it's in a country whose laws might let the government go and have a look. And what if that good guess is wrong? This kind of stuff has [reportedly been used by health insurers](https://www.cbsnews.com/news/unitedhealth-lawsuit-ai-deny-claims-medicare-advantage-health-insurance-denials/) to help decide whether you're allowed the treatment you need. Scary!

This is exactly why it's not just nervous individuals worried about privacy. Businesses are building their own private models so their secrets don't leak into someone else's system as well as to reduce their costs. Entire governments are also at it, the EU's [drawing up rules](https://www.cnbc.com/2026/05/07/eu-commission-cloud-sensitive-data.html) to keep sensitive data off American servers and France is [replacing Teams and Zoom](https://www.euronews.com/next/2026/01/27/france-to-ditch-us-platforms-microsoft-teams-zoom-for-sovereign-platform-amid-security-con) for home grown kit.

There's also the whole argument of copyright which seems to say that it's ok to include any authors work without permission for your model but [when someone builds a distilled version of your model](https://www.nbcnews.com/tech/tech-news/openai-says-deepseek-may-inapproriately-used-data-rcna189872) then copyright is important and that kind of usage is not allowed. Fresh data is gold and there's a rush to sign up any decent source of it, yours will be included in that but you won't see any of the profit from it.

And think about how many things in your house are always listening, the smart speaker, the phone face down on the table. Apple just [paid $95 million to settle claims](https://www.npr.org/2025/01/03/g-s1-40940/apple-settle-lawsuit-siri-privacy) that Siri recorded private conversations without the wake word and that some ended up with advertisers (they denied wrongdoing, naturally). A model running on your own machine won't do that. It can hear you, help you and then forget with nothing ever leaving the room.

When it's written out like this it all sounds genuinely creepy but I also kinda want all the fancy AI stuff, so I have to make the compromise but I can limit that if I run more on my own hardware.

From the average person at their kitchen table to an entire country, it's all the same instinct. If I have the choice then I'd rather not leave my stuff on someone else's machine thank you very much.

## It's getting so much easier

Two years ago, running AI on your own computer meant an expensive machine and a free weekend you'd never get back.

Now it's like basically installing an app. [Ollama](https://github.com/ollama/ollama) went from about 100k downloads a month to something like [52 million in three years](https://dev.to/pooyagolchian/local-ai-in-2026-ollama-benchmarks-0-inference-and-the-end-of-per-token-pricing-32e7). The pile of free downloadable AI models you can run at home went from a couple of hundred to over 135k. The hardest bit for me was testing & choosing the best models for the system I have and doing real world evaluations. That and avoiding installing anything with glaring security issues or heavy information bias.

Everything takes off the moment your parents can use it. Local AI is sitting right on that line now and the "easy enough for everyone" moment is nearly here, just look at how fast [OpenClaw](https://www.mindstudio.ai/blog/what-is-openclaw-ai-agent) took off, a viral open source agent people are running on their Mac minis (along with the critical need and value of the agentic anti virus that sprang up around it).

Apple's perfect for this, the way their chips share memory means a fairly ordinary Mac can run models a similar priced Windows machine just can't and quicker when they're tuned for Apple, I found Ollama up to ~2x slower than MLX on M4. It's why I went Mac, I wanted it to just work out of the box across my devices and the speed. You can get a decent Mac mini for around $800 and the 128gb studios are $4k going up to 512gb for $10k (yeah… no chance I can afford that!). There's non-Apple kit too now, proper AI boxes like Nvidia's DGX Spark and AMD's Strix Halo, 128GB of unified memory for around $2 to 4k (Sources: [Starry Hope](https://www.starryhope.com/ai/dgx-spark-local-ai-hardware-landscape/); [AIMultiple](https://aimultiple.com/dgx-spark-alternatives)).

I use Claude Code when I really need the accuracy otherwise on my 24gb Mac Mini I have [Mistral Small 3](https://mistral.ai/news/devstral) running at the moment which does most of what I need. Open models have quickly closed the gap, the best of them now are within roughly 10 to 15 points of the closed frontier on coding tasks where two years ago they trailed by 30+. [Epoch AI](https://epoch.ai/data-insights/open-closed-eci-gap) reckon the best open models now trail the closed frontier by about four months. A model small enough to run on my Mac is now able to do serious work that used to require a frontier API. Another important thing to note for closed vs open models is the context window, on the closed models it's significantly higher, almost 2x, and a reason why I built my own context store to help alleviate that.

I also swap out to other models when I need to (coder vs generalist etc.). I found the trick to getting the smaller models working better are the guardrails I built around them e.g. egress filtering (iptables), prompt sanitisation in claude_bridge, post execution audit_diff, give up phrase detection so the model doesn't quit, parameter inference safety nets etc. I'm looking forward to the new M5 Studios when they finally hit as I think the price is worth it especially if subscription costs do go up then it looks increasingly more attractive and I think there's going to be a mad rush to get them when they do come out.

## So where do I think this is going?

More of your AI, bit by bit, ends up running on kit you own for the things where it makes sense, driven by the two things that will never go away, cost and privacy. All the pieces are sitting there right now, it's already underway as most will point out and I reckon by end 2027 there'll be a decent % of people even outside of the tech industry who're running their own models (whether they know it or not).

Here's my rough estimate. About [5% of US desktops now run Linux](https://fosspost.org/most-popular-linux-distros/), a fair floor for people comfortable installing and configuring things. On OpenRouter about [30% of tokens already go to open models](https://openrouter.ai/state-of-ai). Put those together and you get roughly 1.5 to 3% of adults in the US who would plausibly run their own models today.

But perhaps a better comparison are ad blockers where it's a one click install and roughly a third of the internet uses it. Local AI unlike ad blocking also gets you off what may be an expensive subscription so there's additional incentive to do it. By the end of 2027 I think this group will be growing towards ~9% with the ceiling looking more like ad blocking's 30% and not Linux's 5%.

As an additional parallel, look at the trends for home PC and smartphone adoption in the US and this is moving faster (Fig. 3).

<figure class="fig">
<img src="/assets/notes/fig3-adoption.png" alt="Line chart of US adoption of home computers, smartphones and generative AI by years since first tracked, with generative AI rising fastest.">
<figcaption><strong>Figure 3. Technology adoption trends.</strong> US adoption of three technologies by years since first tracked. Sources: <a href="https://www.census.gov/content/dam/Census/library/publications/1999/demo/p20-522.pdf">US Census Bureau, Current Population Survey</a> (household computer ownership, 1984 to 2016); <a href="https://www.pewresearch.org/internet/fact-sheet/mobile/">Pew Research Center</a> (US adult smartphone ownership, 2011 to 2025); <a href="https://www.pewresearch.org/short-reads/2026/01/08/internet-use-smartphone-ownership-digital-divides-in-u-s/">Pew Research Center</a> (US adults who've used ChatGPT) and <a href="https://www.stlouisfed.org/on-the-economy/2025/nov/state-generative-ai-adoption-2025">St. Louis Fed / Bick, Blandin &amp; Deming</a> (generative AI usage, adults 18 to 64). Years since first tracked counts from each technology's first survey data point and not its launch, e.g. smartphones were first measured in 2011, about 4 years after the iPhone. Denominators differ, households for computers, adults for smartphones and AI, so the comparison is indicative and not exact.</figcaption>
</figure>

But I also think that this goes even further. Right now most are bolting AI onto existing software, a little assistant in the corner of the app or whatever. I think that flips entirely and AI basically becomes the operating system and you'll really want that living on hardware you own. For example, Microsoft is already [reorganising Windows around an agentic future](https://www.windowscentral.com/microsoft/microsofts-copilot-marketing-chief-is-leaving-but-not-before-defining-a-radical-agentic-future-for-windows).

Anything personal, I keep on my own machine. It still takes a bit of effort today, and no, your average person isn't about to start writing their own software but maybe they will, who knows? But the ready made stuff is getting genuinely easy and once it does, that stack of monthly subscriptions starts to look a bit silly. Why wait for someone to update their app and add that feature you've wanted for years when you could ask AI to build it for yourself in a day.

Expensive machines becoming obsolete in a year also seems to be playing out backwards here. What matters for running AI as an end user is mostly memory and a high memory machine from a few years ago is still better than this year's cheap one. Those things are holding their value and you stop chasing the latest and greatest anyway once you realise most jobs don't need it. If the only advances are speed then I'm generally ok waiting for a few seconds while I go do something else.

Anyway, that's where I think it's all heading. My bill's going one way, my home setup's going the other and I don't think I'm the only one who's going to notice.
