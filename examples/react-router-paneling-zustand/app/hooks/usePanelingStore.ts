// store.ts
import type { IPanelContentProps } from '@novice1-react/react-router-paneling'
import { create } from 'zustand'

export interface IZustandPanelContext extends IPanelContentProps {
    title: string
    minimized: boolean
    panelIndex: number
}

export interface PanelState {
    panels: Record<string, { context: IZustandPanelContext }>
    setPanelContext: (id: string | number, context: IZustandPanelContext) => void
    removePanelContext: (id: string | number) => void
    setPanelTitle: (id: string | number, title: string) => void
    setPanelMinimized: (id: string | number, minimized: boolean) => void
    togglePanelMinimized: (id: string | number) => void
}

export const usePanelingStore = create<PanelState>((set) => ({
    panels: {},
    setPanelContext: (id, context) =>
        set((state) => ({
            panels: { ...state.panels, [id]: { context } }
        })),
    removePanelContext: (id: string | number) =>
        set(({ panels }) => {
            const { [id]: _removed, ...otherPanels } = panels

            return {
                panels: otherPanels,
            }
        }),
    setPanelTitle: (id: string | number, title: string) => 
        set(({ panels }) => {
            const context = panels[id]?.context
            if (!context) return { panels }
            if (context.title === title) return { panels } // no change, return same reference
            return {
                panels: { ...panels, [id]: { context: { ...context, title } } }
            }
        }),
    setPanelMinimized: (id: string | number, minimized: boolean) => 
        set(({ panels }) => {
            const context = panels[id]?.context
            if (!context) return { panels }
            if (context.minimized === minimized) return { panels } // no change, return same reference
            return {
                panels: { ...panels, [id]: { context: { ...context, minimized } } }
            }
        }),
    togglePanelMinimized: (id: string | number) => 
        set(({ panels }) => {
            const context = panels[id]?.context
            if (!context) return { panels }
            return {
                panels: { ...panels, [id]: { context: { ...context, minimized: !context.minimized } } }
            }
        })
}))