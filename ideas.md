# QiSpace Bonsai — Design Brainstorm

## Chosen Approach: Wabi-Sabi Cinematic Dark Garden

**Design Movement:** Wabi-Sabi meets cinematic game UI — imperfect beauty, aged textures, and the quiet drama of a Japanese forest at dusk.

**Core Principles:**
1. The bonsai image is the hero — everything else recedes into darkness around it
2. Asymmetric composition: bonsai occupies ~65% left, controls live in a translucent right panel
3. Organic typography: serif kanji labels float above Latin names, creating a bilingual haiku rhythm
4. Tactile interaction: every action button feels like pressing a carved wooden seal

**Color Philosophy:**
- Deep forest charcoal (#1a1c1e) as the base — like a moonlit garden
- Warm amber (#c8843a) as the primary accent — ember glow of a lantern
- Muted sage and moss greens for secondary accents
- Cream/ivory (#e8dcc8) for text — aged washi paper
- Selected states use a warm dark olive (#3a3a28) panel

**Layout Paradigm:**
- Full-bleed bonsai photography as the main viewport (left 65%)
- Right panel: semi-transparent dark glass card with species/pot lists
- Bottom strip: "How your tree grows" scoring guide on dark charcoal
- Action buttons float above the pot in a row, centered on the bonsai image
- Species name + kanji floats as a translucent overlay on the image

**Signature Elements:**
1. Kanji characters in small muted gold above each Latin species name
2. Thin horizontal rule separators between list items (1px, 15% white opacity)
3. Selected item: warm dark olive background with a left amber border accent

**Interaction Philosophy:**
- Clicking a species smoothly cross-fades the bonsai image
- Action buttons pulse gently when available (water cooldown timer)
- Growth points animate upward as floating "+N" particles on action

**Animation:**
- Image transitions: 600ms cross-fade with slight scale (1.02→1.0)
- Panel items: stagger-in 40ms apart on load
- Action buttons: scale(0.96) on press, 150ms ease-out
- Growth point floaters: translateY(-40px) + fade out over 1200ms

**Typography System:**
- Display: "Noto Serif JP" for kanji and bonsai name titles
- Body: "Cormorant Garamond" for species descriptions and UI labels
- Mono accent: "Space Mono" for growth point numbers
- Hierarchy: kanji 12px muted gold → Latin name 28px ivory → subtitle 14px sage
