# Accessibility Rules — WCAG 2.2

This project must meet WCAG 2.2 Level AA minimum.

## Before writing any component, check:
- Full rule reference: /api/checklist.json
- Quick rules: /llms.txt

## Non-negotiable Level A rules (ALWAYS follow these):
- Every <img> must have alt="" or alt="description"
- Every <input> must have an associated <label>
- Use <button> for buttons, <a href> for links — never <div> or <span>
- Never set outline:none without a custom focus style
- Never use maximum-scale=1 in viewport meta
- Use <h1>–<h6> for headings, never styled <div>
- Only one <h1> per page
- Every page needs a skip link as first focusable element
- Never autoplay audio or video
- Use <ul>/<ol>/<dl> for lists, never fake with bullets/br
- Color must never be the only way to convey state

## Level AA rules (required for production):
- Text contrast ≥ 4.5:1 (normal), ≥ 3:1 (large, icons, borders)
- Visible focus style on all interactive elements
- Inputs must have autocomplete on personal data fields
- Layout must reflow at 320px with no horizontal scroll
- Text must scale to 200% without breaking layout
- One <h1> per page, logical heading structure

## Level AAA (recommended):
- Respect prefers-reduced-motion for all animations
- Touch targets ≥ 44×44px
- Left-align body text

## When generating forms always:
1. Wrap every input in a label or use htmlFor/id pair
2. Wrap radio/checkbox groups in <fieldset><legend>
3. Add role="alert" error summary above form on failure
4. Add aria-invalid="true" and aria-describedby to invalid inputs
5. Add autocomplete attributes to personal data fields

## When generating images always:
1. Add alt="" to decorative images (role="presentation" too)
2. Add descriptive alt text to meaningful images
3. Add <figcaption> + data table for charts/graphs

## When generating tables always:
1. Use <th scope="col"> for column headers
2. Use <th scope="row"> for row headers
3. Add <caption> to every data table

## When generating links always:
1. Use descriptive text — never "click here" or "read more"
2. Add (opens in new tab) warning for target="_blank"
3. Ensure links are underlined, not just colored differently
