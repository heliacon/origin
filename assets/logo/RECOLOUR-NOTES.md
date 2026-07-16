# Compass-star mark — dawn recolour

The compass-star mark is kept unchanged in geometry. Only the two `fill` values
have been re-tuned to the new dawn palette. Every path coordinate is identical to
`mark.svg` (verified by hashing the `d` attributes).

## Original

`mark.svg`

- Outer star: `#F4ECD8` (cream)
- Inner four-point star + horizon curve (single shared path): `#E7B23C` (gold)

## Variants

### `mark-dawn.svg` — primary, for the dark site

- Outer star: `#F4ECD8` (cream, unchanged)
- Inner star + horizon: `#E3A868` (Dawn Warm, lightest)

Choice: `#E3A868` over `#D46D37`. Against the dark navy ground it holds the same
bright, warm "gold" reading as the original `#E7B23C` while sitting inside the new
palette. `#D46D37` is a deeper terracotta that reads muddy and loses luminance on
dark, so it is reserved for the light-background (ink) variant below.

### `mark-dawn-mono.svg` — single colour, for footer / small use

- Both paths: `#D7D2C7` (Stone Neutral, lightest)

One flat neutral for reduced sizes and low-emphasis placements on dark grounds.

### `mark-dawn-ink.svg` — for light backgrounds

- Outer star: `#15232E` (Glacial Cool, darkest — deep ink)
- Inner star + horizon: `#D46D37` (Dawn Warm, mid)

On a light ground the deeper `#D46D37` gives stronger contrast for the accent than
the pale `#E3A868` would, and the glacial ink `#15232E` gives a near-black star with
a faint cool cast that ties back to the palette.

## Palette reference

- Dawn Warm: `#E3A868` `#D46D37` `#9C4A20` `#3B2A1F`
- Stone Neutral: `#D7D2C7` `#A9A59B` `#726F66` `#2B2A2B`
- Forest Deep: `#344B3A` `#264B2B` `#1B2A1C` `#0E1510`
- Glacial Cool: `#8FB7D1` `#5E7F9C` `#2E4960` `#15232E`
- Legacy cream / gold: `#F4ECD8` / `#E7B23C`
