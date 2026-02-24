import type { Route } from './+types/paneling';
import { useLoaderData } from 'react-router';
import { 
    createClientLoader, 
    createCustomPanel, 
    usePaneling, 
    type FunctionExtension, 
    type LoaderData
} from '@novice1-react/react-router-paneling';
import ErrorContent from '~/components/contents/ErrorContent';
import IndexPage from '~/pages/IndexPage';
import InfoContent from '~/components/contents/InfoContent';
import ExtraContent from '~/components/contents/ExtraContent';
import CustomPanel from '~/components/panels/CustomPanel';
import type { ContentPropsExtension, PanelingType, PanelPropsExtension } from '~/definitions';
import { useCallback, useEffect, useState } from 'react';
import { PanelManagerContext } from '~/hooks/usePanelManager';
import clsx from 'clsx';
import SpecialContent from '~/components/contents/SpecialContent';

const panelingConfig = {
        path: 'paneling',
        errorComponent: createCustomPanel(
            ErrorContent,
            CustomPanel
        ),
        indexComponent: IndexPage,
        max: 8,
        extrasSeparator: ';',
        panels: {
            info: createCustomPanel(
              InfoContent,
              CustomPanel
            ),
            extra: createCustomPanel(
              ExtraContent,
              CustomPanel
            ),
            'extra:': createCustomPanel(
              ExtraContent,
              CustomPanel
            ),
            special: createCustomPanel(
              SpecialContent,
              CustomPanel
            ),
            'special:': createCustomPanel(
              SpecialContent,
              CustomPanel
            )
        }
    }

export function meta({ }: Route.MetaArgs) {
    return [
        { title: 'Paneling' },
        { name: 'description', content: 'Welcome to React Router Paneling!' },
    ];
}

export async function loader({ params }: Route.LoaderArgs) {
    return {};
}

export async function clientLoader(args: Route.ClientLoaderArgs) {
    const serverData = (await args.serverLoader()) || {};
    const clientData = await createClientLoader(panelingConfig)(args)

    if (clientData instanceof Response) return clientData
    
    return { ...serverData, ...clientData };
}

// force the client loader to run during hydration
clientLoader.hydrate = true as const; // `as const` for type inference

// HydrateFallback is rendered while the client loader is running
export function HydrateFallback() {
    return <div>Loading...</div>;
}

export default function Paneling() {

    const type: PanelingType = 'tiling'

    const { stack } = useLoaderData<LoaderData<ContentPropsExtension, PanelPropsExtension>>();

    const [activePanelIndex, setActivePanelIndex] = useState(0)

    const setActivePanel = useCallback((idx: number) => {
        if (typeof idx === 'number' && idx >= 0 && idx < stack.length && idx != activePanelIndex) {
            setActivePanelIndex(Math.round(idx))
        }
    }, [setActivePanelIndex, stack.length, activePanelIndex])

    const extension: FunctionExtension<PanelPropsExtension> = useCallback((panelIndex) => {
        return {
            panelingType: type,
            nbPanels: stack.length,
            panelIndex,
            activePanel: activePanelIndex,
            setActivePanel
        }
    }, [activePanelIndex, setActivePanel, stack.length, type])

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

    // const { paneling } = usePaneling({ extension }) // non-strict types
    const { paneling } = usePaneling<ContentPropsExtension, PanelPropsExtension>({ extension }) // strict types

    return <PanelManagerContext.Provider value={{ nbPanels: stack.length, setActivePanel, panelingType: type }}>
        <div id={type} className='flex flex-1 h-full items-stretch'>
            <div className={surfaceClassname}>
                {paneling()}
            </div>
        </div>
    </PanelManagerContext.Provider>
}
