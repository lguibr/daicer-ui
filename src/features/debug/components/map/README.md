# Canvas map

The renderer draws 2D terrain and entity placeholders. Display tiles occupy 32 pixels at scale 1; world chunk dimensions are independent and supplied by each caller. Negative world coordinates use floor division and positive local modulo. Layer indices retain the existing -3 through 3 mapping.

Visibility keys default to `x,y,z`. The existing debug map explicitly selects legacy `x,y` keys. Restricted views hide unknown terrain and non-visible entities, ghosts, and path segments. Unrestricted previews and debug god mode remain available. Rendering is not an authorization boundary: gameplay must receive server-filtered state and persisted terrain.

Input converts CSS coordinates into canvas coordinates. Panning suppresses clicks; single clicks are immediate unless a double-click handler exists. Pending clicks are cancelled when the interaction identity or viewed layer changes, and on unmount. Room callers also key the renderer by room identity.

Focused checks: `MapRenderer.test.tsx` exercises canvas drawing and DOM input; `mapGeometry.test.ts` covers chunk boundaries and coordinate conversion. The wire contract and server terrain integration are separate from these renderer checks.
