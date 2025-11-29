# How to Add a PDF to This Project

## Quick Steps

1. **Place your PDF file** in this folder (`public/docs/`)

   - Example: `SMART_THERMOSTAT_BUILD_GUIDE.pdf`

2. **The PDF will be accessible** at:

   - URL: `/docs/SMART_THERMOSTAT_BUILD_GUIDE.pdf`
   - Or: `http://localhost:5173/docs/SMART_THERMOSTAT_BUILD_GUIDE.pdf` (during development)

3. **Update the link** in `src/pages/ThermostatDiagrams.jsx`:
   - Uncomment the PDF link button (remove the `{/* */}` comments around it)
   - The link is already set up and ready to use!

## Notes

- Files in the `public` folder are served at the root URL
- No need to import or configure anything - just place the file and link to it
- The PDF will open in a new tab when clicked
