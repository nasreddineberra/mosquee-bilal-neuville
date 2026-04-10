# Design System: Editorial Sacred Space

## 1. Overview & Creative North Star
**The Creative North Star: "The Celestial Sanctuary"**

This design system moves away from the utilitarian "dashboard" aesthetic common in community apps, shifting instead toward a high-end editorial experience that evokes the serenity of a moonlit courtyard. We are building a "Digital Mashrabiya"—a space where light, shadow, and geometry create a sense of sacred privacy and communal warmth.

To break the "template" look, designers must embrace **Intentional Asymmetry**. Do not center-align everything. Use wide margins, overlapping elements (e.g., a serif headline bleeding over the edge of a glassmorphism card), and a high-contrast typography scale to create a rhythm that feels curated and bespoke.

---

## 2. Colors & Surface Philosophy

### The Tonal Palette
Our palette is rooted in the transition from twilight to night, illuminated by the warmth of a flickering lantern.

*   **Primary (`#BEC6E0`):** A soft, silver-blue used for interactive elements and key labels.
*   **Secondary (`#B9C7E0`):** A muted slate for supporting information.
*   **Tertiary/Amber (`#FFB95F`):** Our "Sacred Light." Use this sparingly for spiritual highlights, active states, and call-to-actions.
*   **Background (`#0B1326`):** A deep, immersive midnight.

### The "No-Line" Rule
**Standard 1px solid borders are strictly prohibited for sectioning.** We define boundaries through:
1.  **Tonal Shifts:** Placing a `surface-container-high` card against a `surface` background.
2.  **Negative Space:** Using the spacing scale to create "islands" of content.
3.  **Luminous Gradients:** Using a subtle linear gradient (from `surface-container-low` to `surface-container-high`) to imply a container's edge.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—stacked sheets of frosted sapphire glass.
*   **Base:** `surface` (#0B1326).
*   **Level 1 (Sections):** `surface-container-low` (#131B2E).
*   **Level 2 (Cards/Interactives):** `surface-container-high` (#222A3D).
*   **Level 3 (Floating/Modals):** `surface-bright` (#31394D).

### The "Glass & Gradient" Rule
To achieve a premium feel, floating elements should utilize **Glassmorphism**:
*   **Fill:** `surface-variant` (#2D3449) at 60% opacity.
*   **Effect:** `backdrop-blur: 20px`.
*   **Texture:** A subtle radial gradient of `tertiary` (#FFB95F) at 5% opacity in the top-right corner of cards to mimic the glow of a nearby lantern.

---

## 3. Typography: The Editorial Voice

We pair the timeless authority of **Noto Serif** with the modern precision of **Manrope**.

*   **Display (Noto Serif):** Use `display-lg` and `display-md` for prayer times or spiritual quotes. These should feel like headers in a high-end luxury magazine.
*   **Headlines (Noto Serif):** Use `headline-lg` for page titles. Tighten the letter-spacing (-0.02em) to give it a modern, "locked-in" feel.
*   **Body (Manrope):** Use `body-lg` for readability. Manrope provides a clean, technical counterpoint to the organic serif titles.
*   **Labels (Manrope):** All-caps with increased letter-spacing (+0.1em) for small metadata (e.g., "NEXT PRAYER" or "COMMUNITY UPDATES").

---

## 4. Elevation & Depth

### The Layering Principle
Depth is achieved through **Tonal Layering**. Instead of shadows, use the `surface-container` tiers. A `surface-container-lowest` card placed on a `surface-container-low` background creates a "sunken" effect, perfect for input fields.

### Ambient Shadows
When a component must "float" (e.g., a Bottom Sheet or Dropdown), use an **Ambient Shadow**:
*   **Color:** `#060E20` (a tinted version of our surface).
*   **Settings:** `0px 24px 48px`, Opacity: 40%. It should feel like a soft glow of darkness, not a harsh drop shadow.

### The "Ghost Border" Fallback
If a border is required for accessibility, use a **Ghost Border**:
*   **Stroke:** `outline-variant` (#45464D) at 20% opacity. 
*   **Golden Accent:** For primary cards, a 1px border using `tertiary` (#FFB95F) at 15% opacity is permitted to evoke gold leaf.

---

## 5. Components

### Cards & Lists
*   **Rule:** No dividers. Use `surface-container` shifts to separate items.
*   **Styling:** 16px (`xl`) rounded corners. Incorporate a subtle geometric Islamic pattern (8-point star) as a faint watermark in the background of `surface-container-highest` elements.

### Buttons
*   **Primary:** `primary-container` (#0F172A) background with a `tertiary` (#FFB95F) "Ghost Border." Text in `on-primary`.
*   **Secondary:** Glassmorphic fill with `backdrop-blur`.
*   **States:** On hover, the `tertiary` border opacity should increase from 20% to 100%, creating a "lighting up" effect.

### Input Fields
*   **Style:** `surface-container-lowest` background. 
*   **Focus:** Transition the border to `tertiary` (#FFB95F) and add a soft amber outer glow (4px blur).

### Chips & Tags
*   Use `surface-variant` with `label-md` typography. These should look like small, precisely cut stones.

### Specialty Component: The Qibla Compass
*   Utilize a `surface-bright` circular container with a `tertiary` gradient needle. Use a `backdrop-blur` on the compass face to allow the mosque's background photography to bleed through.

---

## 6. Do's and Don'ts

### Do:
*   **Use Asymmetric Grids:** Align text to the left but allow imagery or decorative motifs to bleed off the right edge of the screen.
*   **Embrace Dark Space:** Allow the `background` color to breathe. Content should feel like it is emerging from the depths.
*   **Respect the Serif:** Use Noto Serif for anything emotional or spiritual; use Manrope for anything functional (times, settings).

### Don't:
*   **Don't use pure black (#000) or pure white (#FFF).** It breaks the immersive, soothing atmosphere.
*   **Don't use 100% opaque borders.** They feel "cheap" and structural. We want organic and fluid.
*   **Don't use standard icons.** Use thin-stroke (1px) custom icons that incorporate subtle curves reminiscent of Arabic calligraphy.