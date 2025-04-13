import { createContext, useContext } from 'react'

export type PanelingType = 'stacking' | 'tiling' | 'grid'

export type IPanelManagerContext = {
    nbPanels: number,
    setActivePanel: (idx: number) => void,
    panelingType: PanelingType
}

export const PanelManagerContext = createContext<IPanelManagerContext>({
    nbPanels: 0,
    setActivePanel: () => {},
    panelingType: 'stacking'
});

export function usePanelManager() {
    return useContext(PanelManagerContext)
}