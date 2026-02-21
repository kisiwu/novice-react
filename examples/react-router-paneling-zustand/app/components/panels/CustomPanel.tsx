"use client";

import { type MouseEventHandler, type RefObject, type TouchEventHandler, useCallback, useEffect, useRef } from 'react'
import clsx from 'clsx'
import { setupMouseDragEvents, setupTouchDragEvents } from '~/utils/drag'
import type { IPanelProps } from '@novice1-react/react-router-paneling';
import type { ContentPropsExtension, PanelPropsExtension } from '~/definitions';
import { useNavigate } from 'react-router'
import { usePanelingStore } from '~/hooks/usePanelingStore';
import { PanelIndexContext } from '~/hooks/usePanelIndex';

export default function CustomPanel ({
    currentPath,
    extras,
    id,
    panelPath,
    previousPath,
    splat,
    content,
    children,
    setActivePanel,
    activePanel,
    nbPanels,
    panelIndex,
    panelingType
}: IPanelProps<ContentPropsExtension> & PanelPropsExtension) {

    // subscribe to the panel context in the store
    const context = usePanelingStore((state) => state.panels[panelIndex]?.context)
    
    // get the actions from the store
    const { setPanelContext, removePanelContext, setPanelTitle, togglePanelMinimized } = usePanelingStore.getState()

    const onTitleChange = useCallback((title: string) => {
        setPanelTitle(panelIndex, title)
    }, [panelIndex])

    const toggleMinimized = useCallback(() => {
        togglePanelMinimized(panelIndex)
    }, [panelIndex])

    const panelRef = useRef<HTMLDivElement>(null)

    const navigate = useNavigate()

    const onClose = useCallback(() => {
        navigate(previousPath)
    }, [navigate, previousPath])

    const activateOnMouseDown = useCallback(() => {
        if (activePanel != panelIndex && typeof panelIndex === 'number') {
            setActivePanel(panelIndex)
        }
    }, [panelIndex, activePanel, setActivePanel])

    // Initialize only once when the panel mounts
    useEffect(() => {
        setPanelContext(panelIndex, {
            currentPath,
            extras,
            id,
            panelPath,
            previousPath,
            splat,
            title: '',
            minimized: false,
            panelIndex
        })
        // Cleanup when panel unmounts
        return () => {
            removePanelContext(panelIndex)
        }
    }, [currentPath, extras, id, panelPath, previousPath, splat, panelIndex])

    //#region panel render

    // Guard: don't render until initialized
    if (!context) return null

    let panelingClass = ''
    let zIndex = 'z-10'
    if (panelingType === 'tiling') {
        // tiling
        panelingClass = 'sm:row-span-12'
        if (nbPanels && typeof panelIndex == 'number') {
            if (nbPanels == 3 && panelIndex > 0) {
                panelingClass = 'sm:row-span-6'
            }
            if (nbPanels == 4 || nbPanels == 6 || nbPanels == 8) {
                panelingClass = 'sm:row-span-6'
            }
            if (nbPanels == 5 && panelIndex > 0) {
                panelingClass = 'sm:row-span-6'
            }
            if (nbPanels == 7) {
                if (panelIndex == 0) {
                    panelingClass = 'sm:row-span-6 xl:col-span-2'
                } else {
                    panelingClass = 'sm:row-span-6'
                }
            }
        }
    } else if (panelingType === 'grid') {
        // grid
        if (nbPanels && typeof panelIndex == 'number') {
            if (nbPanels > 3) {
                panelingClass = 'xl:col-span-3'
            }
            if (nbPanels == 5) {
                if (panelIndex == 4) {
                    panelingClass = 'xl:col-span-12'
                }
            }
            if (nbPanels == 6) {
                if (panelIndex >= 4) {
                    panelingClass = 'xl:col-span-6'
                }
            }
            if (nbPanels == 7) {
                if (panelIndex >= 4) {
                    panelingClass = 'xl:col-span-4'
                }
            }
            if (nbPanels == 9) {
                if (panelIndex == 8) {
                    panelingClass = 'xl:col-span-12'
                }
            }
            if (nbPanels == 10) {
                if (panelIndex >= 8) {
                    panelingClass = 'xl:col-span-6'
                }
            }
            if (nbPanels == 11) {
                if (panelIndex >= 8) {
                    panelingClass = 'xl:col-span-4'
                }
            }
        }
    } else {
        // stacking
        panelingClass = 'absolute resize overflow-auto'
        if (activePanel === panelIndex) {
            zIndex = 'z-20'
        }
    }

    return (
        <PanelIndexContext.Provider value={panelIndex}>
            <div className={
                clsx(
                    `panel${context.minimized ? ' minimized' : ''}`,
                    'rounded-md border-2 border-gray-200 bg-gray-200 dark:border-gray-700 dark:bg-gray-700',
                    panelingClass,
                    zIndex
                )}
                ref={panelRef}
                onMouseDown={activateOnMouseDown}
                onTouchStart={activateOnMouseDown}
            >
                <PanelMenuBar
                    onClose={onClose}
                    toggleSize={toggleMinimized}
                    minimized={context.minimized}
                    title={context.title}
                    draggablePanel={panelingType === 'stacking' ? panelRef : undefined}
                />
                <div className='panel-content bg-gray-50 dark:bg-gray-800 dark:text-gray-300'>
                    {content ? content({ nbPanels, panelIndex, setTitle: onTitleChange }) : children}
                </div>
            </div>
        </PanelIndexContext.Provider>
    )

    //#endregion panel render
}

function PanelMenuBar({ onClose, toggleSize, minimized, title, pinned, onPin, draggablePanel }: {
    onClose: () => void
    toggleSize?: () => void
    minimized?: boolean
    title?: string
    pinned?: boolean
    onPin?: () => void
    draggablePanel?: RefObject<HTMLDivElement | null>
}) {

    const draggableOnMouseDown: MouseEventHandler<HTMLDivElement> = (ev) => {
        if (draggablePanel)
            setupMouseDragEvents(ev, draggablePanel)
    }

    const draggableOnTouchStart: TouchEventHandler<HTMLDivElement> = (ev) => {
        if (draggablePanel)
            setupTouchDragEvents(ev, draggablePanel)
    }

    let barClassname  = ''
    if (draggablePanel) {
        barClassname = 'cursor-move'
    }

    return (
        <div
            className={clsx(
                'panel-menu-bar z-30',
                'text-gray-900 bg-gray-200 dark:text-white dark:bg-gray-700',
                barClassname
            )}
            onMouseDown={draggableOnMouseDown}
            onTouchStart={draggableOnTouchStart}
        >
            <div className='item-group left-group'>
                {onPin && !minimized && <div className='item pin-action' onClick={onPin}>
                    {
                        pinned ?
                            <svg className="w-5 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M5 9a7 7 0 1 1 8 6.93V21a1 1 0 1 1-2 0v-5.07A7.001 7.001 0 0 1 5 9Zm5.94-1.06A1.5 1.5 0 0 1 12 7.5a1 1 0 1 0 0-2A3.5 3.5 0 0 0 8.5 9a1 1 0 0 0 2 0c0-.398.158-.78.44-1.06Z" clipRule="evenodd" />
                            </svg>
                            :
                            <svg className="w-5 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm0 0v6M9.5 9A2.5 2.5 0 0 1 12 6.5" />
                            </svg>
                    }
                </div>}
            </div>
            <div className='item-group middle-group'>
                <div className='item text'>
                    {title}
                </div>
            </div>
            <div className='item-group right-group'>
                {toggleSize ? <div className='item size-action' onClick={toggleSize}>
                    {minimized ? <>&#128470;</> : <>&#128469;</>}
                </div> : <></>}
                {onClose ? <div className='item close-action' onClick={onClose}>
                    &#10006;
                </div> : <></>}
            </div>
        </div>
    )
}