import { useLoaderData, useLocation, useNavigate } from 'react-router';
import { ILoaderData, IStackElement, IPanelProps, IPanelSegment } from './definitions';
import { createCustomPanelProps, displayPanels, getBaseUrl } from './utils';

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
 * It provides a `navigate` function that allows programmatic navigation between panels.
 * A `createPanelPath` function is also provided to generate panel paths based on segments.
 * @returns An object containing `createPanelPath`, `navigate`, and `basePath` for panel navigation.
 */
export function usePanelNav() {
    const { extrasSeparator, splat } = useLoaderData<ILoaderData>();
    const navigate = useNavigate();
    const { pathname } = useLocation()

    const prefix = getBaseUrl(splat, pathname)

    return {
        /**
         * Creates a panel path based on the provided segments.
         * @param segments Array of panel segments to generate the path.
         * @returns The generated panel path as a string.
         */
        createPanelPath(segments: IPanelSegment[]): string {
            return createPanelPath(segments, extrasSeparator);
        },
        /**
         * Navigates to a panel path based on the provided segments.
         * @param segments Array of panel segments to generate the path.
         * @param navigateTo Optional custom navigation function. If not provided, the default `navigate` function from `react-router` is used.
         */
        navigate(segments: IPanelSegment[], navigateTo?: (to: string) => void) {
            const path = `${prefix}/${createPanelPath(segments, extrasSeparator)}`;
            if (navigateTo) {
                navigateTo(path);
            } else {
                navigate(path);
            }
        },
        /**
         * The base path for the panels.
         */
        get basePath() {
            return prefix
        }
    }
}