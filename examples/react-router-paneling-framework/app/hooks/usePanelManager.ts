import { createContext, useContext } from 'react'
import type { PanelingType } from '~/definitions';

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