import { useCallback, useEffect, useState } from 'react'
import { IPanelContext, PanelContext } from './panel-context'
import { useNavigate } from 'react-router'
import { IPanelProps } from '../definitions'

type PanelState = IPanelContext

function Panel({ currentPath, extras, id, previousPath, splat, content, children, ...props }: IPanelProps) {

    const navigate = useNavigate()

    const [panelState, setPanelState] = useState<PanelState>({
        currentPath,
        extras,
        id,
        previousPath,
        splat,
    })

    const onClose = useCallback(() => {
        navigate(previousPath)
    }, [navigate, previousPath])

    useEffect(() => {
        setPanelState(value => {
            return { ...value, currentPath, extras, id, previousPath, splat }
        })
    }, [currentPath, extras, id, previousPath, splat])

    return (
        <>
            <PanelContext.Provider value={panelState}>
                <div className='rrp-panel'>
                    <div className='rrp-panel-menu-bar'>
                        <div className='rrp-panel-menu-bar-left'>
                        </div>
                        <div className='rrp-panel-menu-bar-middle'>
                            <div className='rrp-panel-menu-bar-text'>
                            </div>
                        </div>
                        <div className='rrp-panel-menu-bar-right'>
                            {onClose ? <div className='rrp-panel-close-action' onClick={onClose}>
                                &#10006;
                            </div> : <></>}
                        </div>
                    </div>
                    <div className='rrp-panel-content'>
                        {content ? content({
                            currentPath,
                            extras,
                            id,
                            previousPath,
                            splat,
                            ...props
                        }) : children}
                    </div>
                </div>
            </PanelContext.Provider>
        </>
    )
}

export default Panel