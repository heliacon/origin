/**
 * The Heliacon icon set. Fifteen bespoke line icons drawn on one 24x24 grid so they read as a
 * single family (design-system §6.1):
 *
 *   viewBox 0 0 24 24, keyline within a 20px live area (2px padding)
 *   stroke 1.5, round caps + joins, fill:none, currentColor (styled by CSS class .ico)
 *
 * Ten "visual language" marks carry the hero's motifs (beams, contour, waypoint, eye) and five
 * "what we do" marks label the capability facets. Colour is inherited, so hover states are free
 * and a caller sets colour by wrapping context (default --accent).
 *
 * icon(name) returns the full <svg>. Unknown names fall back to the compass star (studio).
 */

// Each value is the inner geometry only; icon() wraps it in the shared <svg>.
const PATHS: Record<string, string> = {
  // ── visual language (10) ──────────────────────────────────────────────────
  // 3 stacked contour lines, terrain-like
  mapping:
    '<path d="M4 7c2.7-1.8 5.3-1.8 8 0s5.3 1.8 8 0"/><path d="M4 12c2.7-1.8 5.3-1.8 8 0s5.3 1.8 8 0"/><path d="M4 17c2.7-1.8 5.3-1.8 8 0s5.3 1.8 8 0"/>',
  // 5 vertical bars of varied height — the hero beam motif
  signals:
    '<path d="M5 20v-7"/><path d="M9.5 20V8"/><path d="M14 20V4"/><path d="M18.5 20v-6"/><path d="M22 20"/><path d="M2 20v-2"/>',
  // crosshair reticle in a thin ring
  focus:
    '<circle cx="12" cy="12" r="7.5"/><path d="M12 2.5v4M12 17.5v4M2.5 12h4M17.5 12h4"/><circle cx="12" cy="12" r="1.4"/>',
  // compass rose: ring with a needle pointing north-east
  exploration:
    '<circle cx="12" cy="12" r="8.5"/><path d="M15.8 8.2l-2.4 5.4-5.4 2.4 2.4-5.4z"/>',
  // vertical ruler with graduated ticks
  measurement:
    '<rect x="8" y="3" width="8" height="18" rx="1"/><path d="M16 6.5h-3M16 9.5h-4.5M16 12.5h-3M16 15.5h-4.5M16 18.5h-3"/>',
  // location marker with a centred node
  navigation:
    '<path d="M12 21c-4.2-4.9-6.3-7.6-6.3-10.5a6.3 6.3 0 1 1 12.6 0c0 2.9-2.1 5.6-6.3 10.5z"/><circle cx="12" cy="10.4" r="2.6"/>',
  // central node with four linked satellites
  connections:
    '<circle cx="12" cy="12" r="2.4"/><circle cx="5" cy="5" r="1.7"/><circle cx="19" cy="5" r="1.7"/><circle cx="5" cy="19" r="1.7"/><circle cx="19" cy="19" r="1.7"/><path d="M10.3 10.3 6.2 6.2M13.7 10.3 17.8 6.2M10.3 13.7 6.2 17.8M13.7 13.7 17.8 17.8"/>',
  // open eye with a small pupil
  observation:
    '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.6"/>',
  // ordered rows, each checked — grounded in facts
  evidence:
    '<path d="M4 7l1.6 1.6L8.4 6"/><path d="M11.5 7H20"/><path d="M4 12l1.6 1.6L8.4 11"/><path d="M11.5 12H20"/><path d="M4 17l1.6 1.6L8.4 16"/><path d="M11.5 17H20"/>',
  // dotted ascending path to a flag — from question to result
  journey:
    '<circle cx="4" cy="20" r="1.1"/><circle cx="8.4" cy="16.8" r="1.1"/><circle cx="12.8" cy="13.6" r="1.1"/><path d="M18 12.5V4"/><path d="M18 4h4l-1.5 2 1.5 2h-4"/>',

  // ── what we do (5) ────────────────────────────────────────────────────────
  // branching decision lines from a single point
  strategy:
    '<circle cx="5" cy="12" r="1.9"/><circle cx="19" cy="5" r="1.9"/><circle cx="19" cy="12" r="1.9"/><circle cx="19" cy="19" r="1.9"/><path d="M6.7 11.1 17.3 5.9M6.9 12h10.2M6.7 12.9 17.3 18.1"/>',
  // magnifier over a small bar graph
  research:
    '<circle cx="10.5" cy="10.5" r="7"/><path d="M15.6 15.6 21 21"/><path d="M8 12.5v-2M10.5 12.5v-4M13 12.5v-3"/>',
  // stacked layers / product surfaces
  products:
    '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 12l9 5 9-5"/><path d="M3 16l9 5 9-5"/>',
  // two linked rings
  partnerships:
    '<circle cx="9" cy="12" r="5.5"/><circle cx="15" cy="12" r="5.5"/>',
  // the mark abstracted: a four-point compass star
  studio:
    '<path d="M12 2.5l2.4 7.1L21.5 12l-7.1 2.4L12 21.5l-2.4-7.1L2.5 12l7.1-2.4z"/>',
};

export const ICON_NAMES = Object.keys(PATHS);

/** Inline SVG for a named icon. Decorative, so aria-hidden; colour + stroke come from CSS. */
export function icon(name: string): string {
  const geo = PATHS[name] ?? PATHS.studio;
  return `<svg class="ico" viewBox="0 0 24 24" fill="none" aria-hidden="true">${geo}</svg>`;
}
