import { ContentProps } from '@/routes/PanelManager'
import { useEffect } from 'react'
import { Link, useLocation } from 'react-router'

export default function InfoContent({ currentPath, panelIndex, panelPath, setTitle }: ContentProps) {
    useEffect(() => {
        setTitle(`${panelIndex}: ${panelPath}`)
    }, [setTitle, panelPath, panelIndex])

    const { pathname } = useLocation()


    return <div>
        <div>
            I am InfoContent: <b>{panelIndex}</b>
            <div>
                <Link to={currentPath + '/info'}>open info</Link>
            </div>
            <div>
                <Link to={currentPath + '/d'}>open fake</Link>
            </div>
            <div>
                <Link to={pathname + '/extra'}>open extra panel</Link>
            </div>
            <div>
                <Link to={pathname + '/extra:777'}>open extra panel 777</Link>
            </div>
        </div>
    </div>
}