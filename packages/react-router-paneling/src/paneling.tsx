import { useLoaderData, useLocation } from 'react-router';
import {
    ILoaderData
} from './definitions';
import { displayPanels, FunctionExtension } from './utils';

/**
 * Renders the panel stack based on the current route.
 * 
 * **Note:** It is recommended to render only one instance of this component per page,
 * as multiple instances would render duplicate panel stacks.
 */
export function Paneling<P extends object, C extends object>({ extension }: { extension: FunctionExtension<P> | P }) {
    const loaderData = useLoaderData<ILoaderData<C>>();

    const location = useLocation();
    const { pathname } = location;

    return <>
        {displayPanels<C, P>(loaderData, pathname, extension)}
    </>
}