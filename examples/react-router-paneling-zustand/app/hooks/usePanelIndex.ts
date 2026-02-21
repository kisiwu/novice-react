import { createContext, useContext } from 'react'

export const PanelIndexContext = createContext<number | null>(null)

export function usePanelIndex() {
    const panelIndex = useContext(PanelIndexContext)
    if (panelIndex === null) {
        throw new Error('usePanelIndex must be used inside a CustomPanel')
    }
    return panelIndex
}