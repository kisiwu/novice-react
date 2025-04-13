import { useLoaderData, useLocation } from 'react-router';
import {
    ILoaderData
} from './definitions';
import { displayPanels, FunctionExtension } from './utils';

/**
 * Only use it once on your page
 */
export function Paneling<P extends object, C extends object>({ extension }: { extension: FunctionExtension<P> | P }) {
    const loaderData = useLoaderData<ILoaderData<C>>();

    const location = useLocation();
    const { pathname } = location;

    return <>
        {displayPanels<C, P>(loaderData, pathname, extension)}
    </>
}