import { type ContentProps } from '~/definitions'
import { useEffect } from 'react'
import { Link, useLocation } from 'react-router'
import { usePanelNav } from '@novice1-react/react-router-paneling'
import { usePanelingStore } from '~/hooks/usePanelingStore'

export default function InfoContent({ currentPath, panelIndex }: ContentProps) {

    const context = usePanelingStore((state) => state.panels[panelIndex]?.context)

    const { pathname } = useLocation()
    const { createPanelPath } = usePanelNav()

    useEffect(() => {
        // set the initial title of the panel
        if (context) {
            usePanelingStore.getState().setPanelTitle(context.panelIndex, `${context.panelIndex}: ${context.panelPath}`)
        }
    }, [context])

    if (!context) return null

    return <div>
        <div>
            I am InfoContent: <b>{panelIndex}</b>
            <div>
                <Link to={currentPath + '/info'}>open info</Link>
            </div>
            <div>
                <Link to={pathname + '/extra'}>open extra panel</Link>
            </div>
            <div>
                <Link to={pathname + '/extra;4448-927777-633-3444666'}>open extra panel 4448-927777-633-3444666</Link>
            </div>
            <div>
                <Link to={currentPath + '/special'}>open special panel</Link>
            </div>
            <div>
                <Link to={currentPath + '/' + createPanelPath([
                    { panel: 'special', extras: { title: 'Special Panel' } },
                    { panel: 'info' },
                    { panel: 'extra', id: '4448-927777-633-3444666' },
                ])}>open multiple panels</Link>
            </div>
        </div>
    </div>
}