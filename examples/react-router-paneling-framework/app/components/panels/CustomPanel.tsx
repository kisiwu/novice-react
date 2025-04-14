import { type MouseEventHandler, type RefObject, type TouchEventHandler, useCallback, useEffect, useState, useRef } from 'react'
import clsx from 'clsx'
import { setupMouseDragEvents, setupTouchDragEvents } from '~/utils/drag'
import type { IPanelProps } from '@novice1-react/react-router-paneling';
import type { ContentPropsExtension, PanelPropsExtension } from '~/definitions';
import { useNavigate } from 'react-router'
import { CustomPanelContext, type ICustomPanelContext } from '~/hooks/useCustomPanel';

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

    const onTitleChange = useCallback((value: string) => {
        setPanelState(state => {
            const newState = { ...state, title: value };
            return newState
        })
    }, [])

    const setMinimized = useCallback((value: boolean) => {
        setPanelState(state => {
            const newState = { ...state, minimized: value };
            return newState
        })
    }, [])

    const toggleMinimized = useCallback(() => {
        setPanelState(state => {
            const { minimized: minimizedValue } = { ...state }
            const newState = { ...state, minimized: !minimizedValue };
            return newState
        })
    }, [])

    const [panelState, setPanelState] = useState<ICustomPanelContext>({
        currentPath,
        extras,
        id,
        panelPath,
        previousPath,
        splat,
        title: '',
        setTitle: onTitleChange,
        minimized: false,
        setMinimized,
        toggleMinimized,
        panelIndex
    })

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
    

    useEffect(() => {
        setPanelState(value => {
            return { ...value, currentPath, extras, id, previousPath, splat, panelIndex }
        })
    }, [currentPath, extras, id, previousPath, splat, panelPath, panelIndex])

    //#region panel render

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
        <CustomPanelContext.Provider value={panelState}>
            <div className={
                clsx(
                    `panel${panelState.minimized ? ' minimized' : ''}`,
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
                    minimized={panelState.minimized}
                    title={panelState.title}
                    draggablePanel={panelingType === 'stacking' ? panelRef : undefined}
                />
                <div className='panel-content bg-gray-50 dark:bg-gray-800 dark:text-gray-300'>
                    {content ? content({ nbPanels, panelIndex, setTitle: onTitleChange }) : children}
                </div>
            </div>
        </CustomPanelContext.Provider>
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