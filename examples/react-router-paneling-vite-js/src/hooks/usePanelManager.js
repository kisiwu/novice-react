import { createContext, useContext } from 'react'

export const PanelManagerContext = createContext({
    nbPanels: 0,
    setActivePanel: () => {},
    panelingType: 'stacking'
});

export function usePanelManager() {
    return useContext(PanelManagerContext)
}