# Design System Strategy: The Living Sanctuary

## 1. Overview & Creative North Star
**Creative North Star: The Digital Sanctuary**
This design system moves beyond the utility of a standard web app and enters the realm of "Modern Editorial." We are not merely organizing data; we are creating a digital environment that reflects the serenity, weight, and timelessness of a physical mosque.

The aesthetic is characterized by **Intentional Asymmetry** and **Tonal Depth**. By breaking the rigid, boxed-in layouts of traditional dashboards, we use ample whitespace and overlapping elements to create a sense of breath. This system prioritizes the "quiet" between the components, ensuring that the spiritual essence of the content is never crowded by the interface.

## 2. Colors & Surface Philosophy
The palette is rooted in the earth and the heavens—deep emeralds paired with warm, sandy neutrals.

*   **Primary (`#064E3B`):** This represents the heart of the system. Use for high-emphasis actions, and core interactive elements.
*   **Secondary (`#FDFBF7`):** A supporting color, often used for less prominent UI elements or as a light background contrast.
*   **Tertiary/Accent (`#B45309`):** These "Muted Gold" tones should be used sparingly for high-value highlights, active states, or spiritual markers (e.g., prayer times).
*   **Neutral (`#1E293B`):** A neutral base color for backgrounds, surfaces, and non-chromatic elements, providing a deep, stable foundation.
*   **The "No-Line" Rule:** We prohibit the use of 1px solid borders for sectioning. Structural boundaries must be defined through background color shifts. For example, a `surface_container_low` sidebar sitting against a `surface` background.
*   **Surface Hierarchy & Nesting:** Depth is achieved by "stacking" our surface tiers. A `surface_container_lowest` card should sit atop a `surface_container_low` section. This creates a soft, natural lift that feels like architectural layers rather than digital "boxes."
*   **The Glass & Gradient Rule:** To elevate the "Premium" feel, use Glassmorphism for floating navigation or overlay modals. Use `surface` colors at 80% opacity with a `backdrop-blur` of 12px-20px.
*   **Signature Textures:** For primary CTAs, do not use flat color. Use a subtle linear gradient from `primary` to `primary_container` at a 135-degree angle to add "soul" and visual dimension.

## 3. Typography
Typography is our primary tool for conveying "Contemporary Spirituality."

*   **Display & Headline (Noto Serif):** These are our editorial anchors. Use `display-lg` for moments of reflection and `headline-md` for section titles. The serif typeface provides a sense of tradition and authority.
*   **Body & Labels (Inter):** High-functionality sans-serif. Use `body-lg` for general reading to maintain a premium, spacious feel. `label-sm` should be used for metadata, always with a slight tracking increase (letter-spacing: 0.05em) to maintain legibility and a sophisticated "caption" look.
*   **Visual Rhythm:** Pair a large `display-sm` headline with a `body-md` description to create a high-contrast, editorial hierarchy that feels intentional and curated.

## 4. Elevation & Depth
In this system, light and shadow mimic the ambient glow of a courtyard rather than a computer screen.

*   **The Layering Principle:** Avoid shadows where possible. Instead, place a `surface_container_lowest` element (brightest) inside a `surface_dim` or `surface_container` area to create a "lift" through luminance alone.
*   **Ambient Shadows:** When a "floating" effect is required (e.g., a prayer time modal), use an extra-diffused shadow.
    *   *Formula:* `0px 20px 40px rgba(17, 28, 45, 0.06)`. The shadow color is a tinted version of `on_surface`, never pure black.
*   **The "Ghost Border" Fallback:** If a container requires more definition for accessibility, use the `outline_variant` token at **15% opacity**. This creates a "Ghost Border" that suggests a boundary without interrupting the visual flow.
*   **Glassmorphism:** Use for sidebar navigation. Apply `surface_container_low` at 70% opacity with a heavy blur. This allows the primary emerald or sand tones of the background to bleed through, making the app feel like a single, cohesive environment.

## 5. Components

### Navigation & Layout
*   **Sidebar:** Use a "floating" sidebar design. It should not touch the top or bottom of the viewport. Use `surface_container_low` with a `xl` (24px) corner radius.
*   **Cards:** Forbid divider lines. Separate content using `body-md` spacing. Use `surface_container_lowest` for card backgrounds to make them pop against the `surface` background.

### Actions
*   **Primary Buttons:** Use the `primary` to `primary_container` gradient. Shape: `full` (pill-shaped). Padding: `12px 28px`.
*   **Secondary Buttons:** Ghost style. No background, `on_surface` text, and a `Ghost Border` (outline-variant at 20%).
*   **Chips:** Use `secondary_container` for inactive filters and `primary_fixed` for active states. Use `md` (12px) rounding.

### Inputs & Selection
*   **Input Fields:** Use `surface_container_low` for the field background with no border. Upon focus, transition to a `Ghost Border` using the `tertiary` (gold) color.
*   **Checkboxes/Radios:** Use `primary` for selected states. The unselected state should be a subtle `outline_variant` circle—never a harsh box.

### Spiritual Utility Components
*   **Prayer Time Progress:** A horizontal bar using a `tertiary_fixed_dim` (muted gold) background with a `primary` (emerald) fill to show time elapsed.
*   **Community Cards:** Overlapping image-and-text cards where the text container (surface_container_lowest) sits slightly offset over a high-quality photograph, breaking the grid.

## 6. Do's and Don'ts

### Do
*   **Do** use asymmetrical margins. A wider left margin on a text block creates an editorial, high-end feel.
*   **Do** lean into `surface_container` tiers for hierarchy.
*   **Do** use `notoSerif` for numbers in a spiritual context (e.g., 5:30 PM).

### Don't
*   **Don't** use 100% opaque, high-contrast borders.
*   **Don't** use standard "Drop Shadows" (Level 1, 2, 3). Only use Ambient Shadows or Tonal Layering.
*   **Don't** crowd the interface. If a screen feels full, increase the `spacing` to give more whitespace.
*   **Don't** use pure black (`#000000`) for text. Use `on_surface` (`#111c2d`) to maintain the "Slate Gray" professional tone.