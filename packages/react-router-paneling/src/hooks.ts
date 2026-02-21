import { useLoaderData, useLocation } from 'react-router';
import { ILoaderData, IStackElement, IPanelProps } from './definitions';
import { createCustomPanelProps, displayPanels } from './utils';

/**
 * Hook to interact with the panel stack based on the current route.
 * 
 * **Note:** It is recommended to call this hook in at most one component per page,
 * as calling `paneling()` in multiple components would render duplicate panel stacks.
 */
export function usePaneling<C extends object, P extends object = object>({ extension }: { extension: ((idx: number) => P) | P }) {
    const loaderData = useLoaderData<ILoaderData<C, P & IPanelProps<C>>>();

    const location = useLocation();
    const { pathname } = location;

    return {
        paneling() {
            return displayPanels(loaderData, pathname, extension)
        },
        createPanelProps(
            stackElement: IStackElement<C, P & IPanelProps<C>>,
            idx: number
        ) {
            return createCustomPanelProps<C, P>(
                stackElement,
                loaderData.splat,
                pathname,
                typeof extension === 'function' ? extension(idx) : extension
            )
        }
    }
}