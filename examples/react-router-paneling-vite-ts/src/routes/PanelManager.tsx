import { PanelingType, PanelManagerContext } from '@/hooks/usePanelManager';
import { FunctionExtension, IPanelContentProps, IPanelProps, LoaderData, Paneling } from '@novice1-react/react-router-paneling';
import clsx from 'clsx';
import { useCallback, useEffect, useState } from 'react';
import { useLoaderData } from 'react-router';

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

export function PanelManager({ type = 'stacking' }: { type?: PanelingType }) {
    const { stack } = useLoaderData<LoaderData<ContentPropsExtension, PanelPropsExtension>>();

    const [activePanelIndex, setActivePanelIndex] = useState(0)

    const setActivePanel = useCallback((idx: number) => {
        if (typeof idx === 'number' && idx >= 0 && idx < stack.length && idx != activePanelIndex) {
            setActivePanelIndex(Math.round(idx))
        }
    }, [setActivePanelIndex, stack.length, activePanelIndex])

    const extension: FunctionExtension<PanelPropsExtension> = (panelIndex) => {
        return {
            panelingType: type,
            nbPanels: stack.length,
            panelIndex,
            activePanel: activePanelIndex,
            setActivePanel
        }
    }

    useEffect(() => {
        setActivePanelIndex(stack.length ? stack.length - 1 : 0)
    }, [stack.length])

    let surfaceClassname = 'w-full relative'
    if (type === 'tiling') {
        const gridBreakpoint = stack.length > 6 ? 'xl' : stack.length > 4 ? 'lg' : 'sm'
        surfaceClassname = clsx(
            'w-full',
            `grid ${gridBreakpoint}:grid-flow-col ${gridBreakpoint}:grid-rows-12 grid-cols-1 gap-1`,
            stack.length >= 2 && stack.length <= 4 ? 'sm:grid-cols-2' : '',
            stack.length > 4 && stack.length <= 6 ? 'xl:grid-cols-3' : '',
            stack.length > 6 ? 'xl:grid-cols-4' : ''
        )
    } else if (type === 'grid') {
        surfaceClassname = clsx(
            'w-full grid grid-cols-1 gap-1',
            stack.length >= 2 ? 'sm:grid-cols-2' : '',
            stack.length == 3 ? 'xl:grid-cols-3' : '',
            stack.length > 3 ? 'xl:grid-cols-12' : ''
        )
    }

    return <PanelManagerContext.Provider value={{ nbPanels: stack.length, setActivePanel, panelingType: type }}>
        <div id={type} className='flex flex-1 h-full items-stretch'>
            <div className={surfaceClassname}>
                <Paneling extension={extension} />
            </div>
        </div>
    </PanelManagerContext.Provider>
}