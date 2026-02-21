# State Management for Panel-Based Architectures

A comparison of **React Context**, **Jotai**, **Zustand**, and **MobX** in the context of `@novice1-react/react-router-paneling`.

---

## At a glance

| | React Context | Jotai | Zustand | MobX |
|---|---|---|---|---|
| **Approach** | Built-in provider/consumer | Atomic state | Single external store | Observable/reactive |
| **Re-render behavior** | All consumers re-render | Only subscribed atoms | Only subscribed slices | Only observed values |
| **SSR compatible** | ✅ native | ✅ with provider | ⚠️ needs `"use client"` | ⚠️ needs `"use client"` |
| **Boilerplate** | Low | Low–Medium | Low | Medium |
| **DevTools** | ❌ | ✅ | ✅ | ✅ |
| **Learning curve** | None | Low | Low | Medium–High |
| **Bundle size** | 0 KB (built-in) | ~3 KB | ~1.5 KB | ~16 KB |
| **Per-panel isolation** | ❌ provider scoped | ✅ per atom | ✅ per slice | ✅ per observable |
| **Cross-panel communication** | ⚠️ needs lifting state | ⚠️ derived atoms | ✅ single store | ✅ single store |

---

## React Context

### How it works with paneling

Each panel wraps its children with a `Provider`. Content components consume the context via `useContext`.

```tsx
const PanelContext = createContext(null)

function CustomPanel({ panelIndex, children }) {
    const [title, setTitle] = useState('')
    const [minimized, setMinimized] = useState(false)

    return (
        <PanelContext.Provider value={{ title, setTitle, minimized, setMinimized }}>
            {children}
        </PanelContext.Provider>
    )
}

function InfoContent() {
    const { setTitle } = useContext(PanelContext)
    // ...
}
```

### Pros
- Zero dependencies, built into React
- SSR-compatible out of the box
- Naturally scoped per panel (each panel has its own provider)
- Simple mental model

### Cons
- **All consumers re-render** when any value in the context changes, even if they only use one property
- No selective subscriptions — if `title` changes, a component that only reads `minimized` still re-renders
- Splitting into multiple contexts adds boilerplate

### Best for
Small apps, simple panel state, Framework Mode (SSR) projects where you don't want extra dependencies.

---

## Jotai

### How it works with paneling

State is split into **atoms**. Each panel could have its own atoms, and components subscribe to individual atoms.

```tsx
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'

// A family of atoms, one per panel
const panelTitleAtom = atomFamily((panelIndex: number) => atom(''))
const panelMinimizedAtom = atomFamily((panelIndex: number) => atom(false))

function CustomPanel({ panelIndex, children }) {
    return (
        <PanelContext.Provider value={panelIndex}>
            {children}
        </PanelContext.Provider>
    )
}

function InfoContent() {
    const panelIndex = usePanelIndex()
    const setTitle = useSetAtom(panelTitleAtom(panelIndex))

    useEffect(() => {
        setTitle('My Title')
    }, [])
}

function PanelHeader() {
    const panelIndex = usePanelIndex()
    const title = useAtomValue(panelTitleAtom(panelIndex))        // only re-renders when title changes
    const minimized = useAtomValue(panelMinimizedAtom(panelIndex)) // only re-renders when minimized changes

    return <h2>{title} {minimized ? '▸' : '▾'}</h2>
}
```

### Pros
- **Fine-grained subscriptions** — components only re-render when their specific atom changes
- `atomFamily` is a natural fit for dynamic panel counts
- Small bundle size (~3 KB)
- SSR-compatible with Jotai's `Provider`
- No boilerplate store definition — atoms are self-contained

### Cons
- **Cross-panel communication is harder** — reading another panel's atom requires knowing its index and importing the atom family
- State is spread across multiple atom definitions — harder to see the full picture
- Cleanup of atoms when panels unmount requires extra care (`atomFamily` doesn't auto-clean)
- Less intuitive than a single store for developers used to centralized state

### Best for
Apps where panels are **fully independent** and rarely need to communicate with each other. Good when each panel has many properties and you need maximum render optimization.

---

## Zustand

### How it works with paneling

A single store holds all panel state, keyed by `panelIndex`. Components subscribe to specific slices.

```tsx
import { create } from 'zustand'

const usePanelingStore = create((set) => ({
    panels: {},
    setPanelContext: (id, context) =>
        set((state) => ({
            panels: { ...state.panels, [id]: { context } }
        })),
    setPanelTitle: (id, title) =>
        set(({ panels }) => {
            const context = panels[id]?.context
            if (!context || context.title === title) return { panels }
            return {
                panels: { ...panels, [id]: { context: { ...context, title } } }
            }
        }),
}))

function InfoContent() {
    const panelIndex = usePanelIndex()
    const title = usePanelingStore((state) => state.panels[panelIndex]?.context?.title)
    const { setPanelTitle } = usePanelingStore.getState()

    useEffect(() => {
        setPanelTitle(panelIndex, 'My Title')
    }, [panelIndex])
}
```

### Pros
- **Selective subscriptions** — components only re-render when their specific slice changes
- **Single store** — easy to inspect, debug, and reason about the full state
- **Cross-panel communication is trivial** — any component can read any panel's state
- Tiny bundle size (~1.5 KB)
- Actions via `getState()` avoid unnecessary subscriptions
- Equality checks in actions prevent redundant re-renders

### Cons
- **Not SSR-compatible by default** — components using the store need `"use client"` in Framework Mode
- Global store means multiple paneling instances on the same page could **collide** if they share `panelIndex` values
- Immutable updates can be verbose for deeply nested state (mitigated by [Immer middleware](https://zustand.docs.pmnd.rs/integrations/immer-middleware))

### Best for
Apps where panels **communicate** with each other, Data Mode projects, or Framework Mode projects where marking components as `"use client"` is acceptable.

---

## MobX

### How it works with paneling

State is defined as **observable classes or objects**. Components are wrapped with `observer` and automatically track which observables they access.

```tsx
import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react-lite'

class PanelStore {
    panels: Map<number, { title: string; minimized: boolean }> = new Map()

    constructor() {
        makeAutoObservable(this)
    }

    initPanel(id: number) {
        this.panels.set(id, { title: '', minimized: false })
    }

    removePanel(id: number) {
        this.panels.delete(id)
    }

    setTitle(id: number, title: string) {
        const panel = this.panels.get(id)
        if (panel) panel.title = title // direct mutation — MobX tracks it
    }

    toggleMinimized(id: number) {
        const panel = this.panels.get(id)
        if (panel) panel.minimized = !panel.minimized
    }
}

const panelStore = new PanelStore()

const InfoContent = observer(function InfoContent() {
    const panelIndex = usePanelIndex()

    useEffect(() => {
        panelStore.setTitle(panelIndex, 'My Title')
    }, [panelIndex])

    return <div>{panelStore.panels.get(panelIndex)?.title}</div>
})
```

### Pros
- **Automatic fine-grained tracking** — no need to manually define selectors or slices. MobX knows exactly which observables a component reads and only re-renders when those change
- **Mutable updates** — no spreading, no immutability boilerplate. `panel.title = 'new'` just works
- **Cross-panel communication is trivial** — same as Zustand, single store accessible anywhere
- Computed values (like derived state) are cached and only recompute when dependencies change
- Class-based stores are easy to read and organize

### Cons
- **Largest bundle size** (~16 KB for `mobx` + `mobx-react-lite`)
- **Every component must be wrapped with `observer`** — forget it once and you get stale UI with no warning
- **Not SSR-compatible by default** — same as Zustand, needs `"use client"` in Framework Mode
- **Learning curve** — concepts like observables, actions, reactions, computed values take time to learn
- Debugging can be harder — mutations happen in place, so tracking "what changed when" is less obvious without MobX DevTools
- Opinionated — the reactive paradigm is different from React's declarative model, which can cause friction

### Best for
Large-scale apps with complex derived state, teams familiar with OOP/reactive patterns, projects where immutability boilerplate is a pain point.

---

## Decision matrix for paneling

| Scenario | Recommendation |
|---|---|
| Simple app, few panels, no perf concerns | **React Context** |
| Framework Mode (SSR), minimal dependencies | **React Context** |
| Panels are independent, maximum render optimization | **Jotai** |
| Panels communicate, Data Mode | **Zustand** |
| Panels communicate, Framework Mode | **React Context** or **Zustand** with `"use client"` |
| Complex derived state, large team, OOP style | **MobX** |
| Smallest bundle size matters | **Zustand** (~1.5 KB) |

---

## Hybrid approach (recommended)

Regardless of which store you choose, the **hybrid pattern** works well with paneling:

| Concern | Use | Why |
|---|---|---|
| `panelIndex` | React Context | Lightweight, never changes, SSR-safe |
| Shared panel manager state (`nbPanels`, `activePanel`) | React Context | All panels re-render when these change anyway |
| Per-panel state (`title`, `minimized`) | Zustand / Jotai / MobX | Only the affected panel re-renders |

This gives you the **best of both worlds**: React Context for what's inherently shared, and an external store for what benefits from selective re-renders.
