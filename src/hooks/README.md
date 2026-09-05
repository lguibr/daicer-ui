# Hooks

## World preview loading

`useChunkLoader` serves creation/debug previews, never authoritative gameplay terrain. It serializes batches of at most 16 chunks to match the authenticated `voxelPreview` resolver, caches by returned coordinates, rejects incomplete or unexpected response identities, and isolates configuration generations synchronously. Reset, configuration changes and unmount abort/discard old work. Failed chunks wait for explicit retry instead of retrying on every Canvas redraw. The retained generated operation uses a JSON tile scalar; layer shape is checked, but this is not full runtime tile validation.

Active player polling lives in `features/play/useRoomView`; it replaces the legacy game/socket hooks on the play route.

## Custom Domain Hooks

### useAuth

Strapi session lookup and Google sign-in redirect.

### useCombat

Real-time combat state synchronization for a room.

### useSocket

Legacy local socket imitation; it does not establish a server connection and is not used by the active player route.

### useRoomWizard

Multi-step room creation wizard state management.

### useDebouncedBusy

Debounced loading indicator with minimum visibility duration.

- Delays showing a loading state
- Keeps loading visible for minimum duration to avoid flashing
- Useful for UX with unpredictable async operations

### useGameData

Collection of hooks for fetching game data (alignments, races, classes, backgrounds, skills, abilities, languages, magic schools, conditions, damage types, equipment, weapon properties, monsters).

## General Utility Hooks

These hooks are re-exported from `@uidotdev/usehooks` for convenience. See https://usehooks.com for full documentation.

### Layout & Dimensions

- **useWindowSize** - Track browser window dimensions
- **useMeasure** - Measure component dimensions
- **useMediaQuery** - Subscribe to media query changes
- **useOrientation** - Track device orientation
- **useIntersectionObserver** - Track element visibility in viewport

### State Management

- **useLocalStorage** - Sync state with localStorage
- **useSessionStorage** - Sync state with sessionStorage
- **usePrevious** - Access previous value of a variable
- **useToggle** - Toggle boolean values
- **useCounter** - Manage counter with min/max
- **useList** - Manage list operations
- **useSet** - Manage Set data structure
- **useMap** - Manage Map data structure
- **useQueue** - Manage queue data structure
- **useDefault** - Manage state with default values
- **useObjectState** - Manage complex state objects
- **useHistoryState** - Add undo/redo functionality

### Performance

- **useDebounce** - Delay execution/state updates
- **useThrottle** - Throttle expensive operations

### User Interaction

- **useHover** - Track hover state
- **useClickAway** - Detect outside clicks
- **useMouse** - Track mouse position
- **useCopyToClipboard** - Copy text to clipboard
- **useIdle** - Detect user inactivity
- **useLongPress** - Handle long-press interactions

### Browser APIs

- **useNetworkState** - Monitor network conditions
- **usePreferredLanguage** - User language preferences
- **useDocumentTitle** - Update document title
- **useVisibilityChange** - Track page visibility
- **useWindowScroll** - Track/control scroll position
- **useLockBodyScroll** - Disable body scrolling
- **useIsClient** - Detect client vs server-side
- **useFavicon** - Update favicon dynamically
- **useScript** - Load external JavaScript scripts

### Debug & Development

- **useRenderInfo** - Debug render information
- **useRenderCount** - Count component renders
- **useIsFirstRender** - Check if first render

### Device APIs

- **useGeolocation** - Access user geolocation
- **useBattery** - Track battery status

## Usage

```tsx
import { useAuth, useWindowSize, useDebounce, useLocalStorage } from '@/hooks';

function MyComponent() {
  const { user } = useAuth();
  const { width, height } = useWindowSize();
  const [value, setValue] = useState('');
  const debouncedValue = useDebounce(value, 300);
  const [settings, setSettings] = useLocalStorage('settings', {});

  // ...
}
```

## Installation

The `@uidotdev/usehooks` package is installed at the workspace root level via yarn workspaces.

```bash
yarn add @uidotdev/usehooks -W
```
