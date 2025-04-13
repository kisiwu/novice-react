import { PanelManagerContext } from '@/hooks/usePanelManager';
import { Paneling } from '@novice1-react/react-router-paneling';
import clsx from 'clsx';
import { useCallback, useEffect, useState } from 'react';
import { useLoaderData } from 'react-router';


export function PanelManager({ type = 'stacking' }) {
    const { stack } = useLoaderData();

    const [activePanelIndex, setActivePanelIndex] = useState(0)

    const setActivePanel = useCallback((idx) => {
        if (typeof idx === 'number' && idx >= 0 && idx < stack.length && idx != activePanelIndex) {
            setActivePanelIndex(Math.round(idx))
        }
    }, [setActivePanelIndex, stack.length, activePanelIndex])

    const extension = (panelIndex) => {
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
            'xl:grid-cols-12'
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