import { useContext } from 'react'
import { PanelContext } from './panel-context'

export function usePanel() {
    return useContext(PanelContext)
}