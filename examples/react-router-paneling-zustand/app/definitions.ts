import type { IPanelContentProps, IPanelProps } from "@novice1-react/react-router-paneling"

export type PanelingType = 'stacking' | 'tiling' | 'grid'

export type PanelPropsExtension = {
    panelingType?: PanelingType,
    nbPanels: number,
    panelIndex: number,
    activePanel: number,
    setActivePanel: (idx: number) => void
}

export type ContentPropsExtension = {
    nbPanels: number,
    panelIndex: number,
    setTitle: (v: string) => void
}

export type ContentProps = IPanelContentProps & ContentPropsExtension

export type PanelProps = IPanelProps<ContentPropsExtension> & PanelPropsExtension