// Contact page, built to ia-and-ux.md §2.11 and the conversion spec §6.4, plus voice-and-copy §2.
//
// There is NO server this build, so the page never pretends to send. Two guaranteed, honest paths:
//   1. the copyable email (click-to-copy, existing app.js [data-copy] handler), and
//   2. a plain prefilled mailto link, always visible, works with JS off.
// The form is a progressive nicety: as a mailto form (action=mailto, enctype=text/plain) it opens
// the visitor's mail client with the typed fields, even with no JS. A future app.js helper
// (data-mailto-form) can build a cleaner subject/body and carry the /ask ?q context. An explicit
// note tells the visitor it opens their mail client and sends nothing to a server.
import { esc } from "../util";
import { page } from "../layout/shell";
import { marketingPage } from "../layout/article";
import { sectionHead, filledButton, contactField } from "../components";
import { icon } from "../icons";

const EMAIL = "hello@heliacon.com";
const SUBJECT = "Enquiry via heliacon.com";
// Plain, prefilled mailto — the guaranteed no-JS path.
const MAILTO = `mailto:${EMAIL}?subject=${encodeURIComponent(SUBJECT)}`;

function railRow(iconName: string, label: string, value: string): string {
  return `<div class="contact-rail__row"><span class="contact-rail__icon">${icon(iconName)}</span>` +
    `<span><span class="contact-rail__label">${esc(label)}</span>${value}</span></div>`;
}

export function contact(jsonld: unknown): string {
  const details =
    railRow("connections", "Email",
      `<button class="copybtn" type="button" data-copy="${EMAIL}" aria-label="Copy ${EMAIL} to clipboard">${EMAIL}</button>` +
      `<span class="caption" data-copy-flag role="status" aria-live="polite" hidden> Copied</span>` +
      `<span class="contact-rail__more"><a class="ctalink" href="${MAILTO}">Email directly</a></span>`) +
    railRow("navigation", "Location", `<span>Remote-first</span>`) +
    // NEEDS-PETE: no verified X handle exists in the source. LinkedIn is real; X is a best-guess
    // href, flagged for Pete to confirm or replace.
    railRow("partnerships", "Follow",
      `<a href="https://www.linkedin.com/in/petedainty" rel="noopener">LinkedIn</a> &middot; ` +
      `<a href="https://github.com/heliacon" rel="noopener">GitHub</a>`);

  const form =
    `<form class="contact-form" data-mailto-form action="${esc(MAILTO)}" method="post" enctype="text/plain" ` +
      `data-mailto-to="${EMAIL}" data-mailto-subject="${esc(SUBJECT)}">` +
      contactField({ name: "name", label: "Your name", placeholder: "Your name", required: true }) +
      contactField({ name: "email", label: "Email address", type: "email", placeholder: "you@example.com", required: true }) +
      contactField({ name: "company", label: "Company", placeholder: "Optional" }) +
      contactField({ name: "message", label: "Message", placeholder: "What are you trying to be found for, or build?", required: true, textarea: true }) +
      `<p class="caption contact-form__note">The button opens your email app with your message ` +
        `filled in. Nothing is sent to a server.</p>` +
      `<div class="contact-form__act">${filledButton("Compose email", { type: "submit" })}</div>` +
    `</form>` +
    `<p class="caption contact-form__alt">You can also copy the address on the left or ` +
      `<a href="${MAILTO}">email directly</a>.</p>`;

  const body = marketingPage(
    { title: "Get in touch", lede: "Let's build clarity together.", eyebrow: "Contact", section: "contact" },
    `<section class="section"><div class="container">` +
      sectionHead(
        "Start a conversation",
        "Tell us what you are trying to be found for",
        "Or what you are trying to build. We take a few engagements at a time, so we will be honest fast about whether we are the right fit.",
      ) +
      `<div class="grid-2 contact-grid">` +
        `<div class="contact-rail">${details}</div>` +
        `<div><h3 class="contact-col__h">Send a message</h3>${form}</div>` +
      `</div>` +
    `</div></section>`,
  );

  return page("Get in touch · Heliacon", body, "/contact/", {
    section: "contact", overHero: true, jsonld,
    description: "Get in touch with Heliacon. Copyable email and a direct line to Pete Dainty. We take a few engagements at a time.",
  });
}
