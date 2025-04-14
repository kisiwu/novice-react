import { type IPanelContentProps } from '@novice1-react/react-router-paneling'
import { createContext, useContext } from 'react'

export interface ICustomPanelContext extends IPanelContentProps {
    title: string
    setTitle: (title: string) => void
    minimized: boolean
    setMinimized: (v: boolean) => void
    toggleMinimized: () => void
    panelIndex: number
}

export const CustomPanelContext = createContext<ICustomPanelContext>({
    currentPath: '',
    extras: {},
    id: '',
    previousPath: '',
    splat: [],
    title: '',
    setTitle: (v: string) => { console.log(v) },
    minimized: false,
    setMinimized: (v: boolean) => { console.log(v) },
    toggleMinimized: () => { },
    panelIndex: 0
});

export function useCustomPanel() {
    return useContext(CustomPanelContext)
}