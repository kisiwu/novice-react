import { type ContentProps } from '~/definitions'
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
                <Link to={pathname + '/extra'}>open extra panel</Link>
            </div>
            <div>
                <Link to={pathname + '/extra;4448-927777-633-3444666'}>open extra panel 4448-927777-633-3444666</Link>
            </div>
        </div>
    </div>
}