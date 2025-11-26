# **Upsun Brand Guidelines for Application Development**

This document serves as the primary reference for designing and developing customer-facing applications for Upsun. It is derived from the core brand foundations: **Speed, Simplicity, and Scalability.**

## **1\. Brand Identity & Voice**

**Core Promise:** Upsun is the cloud application platform that humans and robots love. We eliminate infrastructure hassle so teams can focus on code.

* **Personality:** Technical, creative, fun, and diverse.  
* **Mission:** Enable forward-thinking organizations to build, iterate, and scale applications with zero infrastructure management.  
* **Tone:** Clear, confident, and "sanity-saving." We enable productivity.

## **2\. Logo Usage**

Our logo is the anchor of the brand.

### **The Wordmark**

* **Primary:** All black wordmark (\#0C0F10) on light backgrounds.  
* **Reverse:** White wordmark (\#FFFFFF) on dark backgrounds.  
* **Constraint:** Never resize or rearrange elements out of proportion. Ensure legibility.

### **The Icon**

* **Usage:** Use only when space is limited or the brand is already established on the page.  
* **Rule:** The wordmark can exist without the icon, but the wordmark should never exist without the icon concept present in the context.

## **3\. Color Palette**

Our palette is led by **Black** and **Violet**, with **Neutrals** carrying the weight of the UI structure. **Lime** is used sparingly for emphasis ("pop").

### **Primary Colors**

| Color Name | Hex Code | Usage |
| :---- | :---- | :---- |
| **Upsun Black** | \#0C0F10 | Primary backgrounds, main text, high-contrast UI elements. |
| **Violet 600** | \#6046FF | **Primary Brand Color.** Primary buttons, links, active states. Accessible on light & dark. |
| **Violet 300** | \#BFB5FF | Subtle highlights, secondary interactive backgrounds. |
| **Lime 600** | \#D5F800 | **Emphasis Only.** Alerts, "New" tags, special calls to action. High energy. |

### **Neutral Palette (UI Foundation)**

Use these for tables, panels, borders, and secondary text.

* **Backgrounds:** \#181E21 (Dark UI), \#ECEDEE (Light UI/Table Headers).  
* **Borders/Dividers:** \#313C42 (Dark mode), \#D8DBDC (Light mode).  
* **Text:** \#0C0F10 (Primary), \#646F75 (Secondary/Metadata).

### **Secondary Accents**

Use strictly for data visualization, illustrations, or non-critical status indicators.

* **Orange:** \#FF4A11  
* **Pink:** \#E81CEC  
* **Blue:** \#00D0EC

**Accessibility Note:** Always verify contrast ratios. Violet \#6046FF is designed to be accessible (AA/AAA) on both light and dark backgrounds.

## **4\. Typography**

### **Primary Font: Instrument Sans**

* **Usage:** Main brand font. Used for body copy, standard UI text, and navigation.  
* **Weights:** Normal (Body), Medium (UI Elements), Semi-bold (Headlines), Bold (Titles).

### **Product UI Font: Open Sans**

* **Usage:** Specifically for **Console/Dashboard** views and dense data displays.  
* **Why:** Strong legibility for complex UI.

### **Accent Font: Space Grotesk**

* **Usage:** Subheads, callouts, and decorative technical text.  
* **Constraint:** **Do not use for body copy** or long paragraphs. Limit to short character counts. Giving a "terminal/CLI" flavor.

## **5\. UI Components & Interactivity**

### **Buttons & Actions**

* **Primary Action:** Solid **Violet 600** background with White text.  
  * *Hover:* Lighten to Violet 500 or slightly lift.  
* **Secondary Action:** Transparent background with **Neutral 700** border (Light mode) or White border (Dark mode).  
* **Emphasis Action:** **Lime 600** background with Black text. Use sparingly for "Upgrade" or "Deploy" actions.

### **Tables (Data Display)**

Tables should feel "invisible" and structured, allowing data to shine.

* **Header Row:**  
  * Background: Neutral 100 (\#ECEDEE) for light mode; Neutral 900 (\#181E21) for dark mode.  
  * Font: **Space Grotesk** (Semi-bold) or **Instrument Sans** (Bold). Caps or Title Case.  
* **Body Rows:**  
  * Background: White or Transparent.  
  * Zebra Striping: Optional, use extremely subtle Neutral 50 tint.  
  * Font: **Open Sans** (for data density).  
* **Borders:** Minimal horizontal borders using Neutral 200 (\#D8DBDC). Avoid vertical borders unless necessary.  
* **Interactive Rows:** On hover, highlight the entire row with a very faint Violet wash (\#EFEDFF).

### **Interactive Elements (Inputs & Forms)**

* **Default State:** 1px solid border in Neutral 400 (\#8B9397).  
* **Focus State:** 2px solid border in **Violet 600** (\#6046FF).  
* **Error State:** Border in Orange 600 (\#FF4A11) or Pink 600 (\#E81CEC).

### **Animations**

* **Philosophy:** Clear, consistent, and educational.  
* **Usage:** Use animation to smooth state transitions (e.g., a drawer sliding open) or to explain complex workflows.  
* **Speed:** Snappy. "Speed" is a brand pillar. Avoid sluggish, long transitions.

## **6\. Iconography & Illustration**

* **Icons:** Simple, geometric, and functional. Used to break up text.  
* **Illustrations:** Playful and purposeful. Use them to humanize dry technical concepts.  
* **Photography:** Focus on **Humans**. We are the platform humans love. Show diverse teams working together.

*Verified for Upsun Application Development \- 2024*