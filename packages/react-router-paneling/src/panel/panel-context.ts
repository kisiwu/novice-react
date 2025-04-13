import { createContext } from 'react'

export interface IPanelContext {
    currentPath: string
    previousPath: string
    splat: string[]
    extras?: Record<string, string>
    id?: string
}

export const PanelContext = createContext<IPanelContext>({
    currentPath: '',
    extras: {},
    id: '',
    previousPath: '',
    splat: []
});
