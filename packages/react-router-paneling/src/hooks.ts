import { useLoaderData, useLocation, useNavigate } from 'react-router';
import { ILoaderData, IStackElement, IPanelProps, IPanelSegment } from './definitions';
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

function createPanelPath(segments: IPanelSegment[], extrasSeparator: string): string {
    return segments.map(({ panel, extras, id }) => {
        const hasExtras = extras && Object.keys(extras).length > 0
        const hasId = !!id

        // Build the extras string: key=value or key (if empty value)
        const extrasString = hasExtras
            ? extrasSeparator + Object.entries(extras)
                .map(([k, v]) => v ? `${k}=${v}` : k)
                .join(extrasSeparator)
            : ''

        // Add separator before id/extras only if there is something to separate
        const sep = (hasId || hasExtras) ? extrasSeparator : ''
        const idString = hasId ? id : ''

        return `${panel}${sep}${idString}${extrasString}`
    }).join('/');
}

/**
 * Hook to create panel paths and navigate to them.
 * @returns 
 */
export function usePanelNav() {
    const { extrasSeparator } = useLoaderData<ILoaderData>();
    const navigate = useNavigate();

    return {
        createPanelPath(segments: IPanelSegment[]): string {
            return createPanelPath(segments, extrasSeparator);
        },
        navigate(prefix: string, segments: IPanelSegment[], navigateTo?: (to: string) => void) {
            const path = `${prefix}/${createPanelPath(segments, extrasSeparator)}`;
            if (navigateTo) {
                navigateTo(path);
            } else {
                navigate(path);
            }
        }
    }
}