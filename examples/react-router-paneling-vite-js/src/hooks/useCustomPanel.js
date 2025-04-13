import { createContext, useContext } from 'react'

export const CustomPanelContext = createContext({
    currentPath: '',
    extras: {},
    id: '',
    previousPath: '',
    splat: [],
    title: '',
    setTitle: (v) => { console.log(v) },
    minimized: false,
    setMinimized: (v) => { console.log(v) },
    toggleMinimized: () => { },
    panelIndex: 0
});

export function useCustomPanel() {
    return useContext(CustomPanelContext)
}