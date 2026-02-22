import { ComponentType, FunctionComponent, ReactNode } from 'react'
import { ActionFunctionArgs, LoaderFunctionArgs, redirect, RouteObject } from 'react-router'
import { DefaultSurface } from './default-surface.tsx'
import { ILoaderData, StackType, IPanelProps } from './definitions.ts'
import DefaultErrorPanel from './default-error-panel.tsx';
import DefaultIndexComponent from './default-index-component.tsx';

/**
 * Creates a paneling route object for React Router.
 * 
 * This function configures a route that manages multiple stacked panels in a single route path.
 * Each panel can be identified by a name, ID, and additional key-value parameters.
 * 
 * **Note:** This is for Data Mode only. For Framework Mode, use {@link createClientLoader}.
 * 
 * @param config.panels - Map of panel names to their component implementations
 * @param config.path - Base path for the route (defaults to '*')
 * @param config.element - React element to render (alternative to Component)
 * @param config.Component - Component to render (alternative to element)
 * @param config.errorElement - Error boundary element
 * @param config.errorComponent - Error panel component to display errors
 * @param config.indexComponent - Component to render when no panels are active
 * @param config.max - Maximum number of panels allowed in the stack
 * @param config.extrasSeparator - Character used to separate the panel name, id and extras within a URL segment (default ':')
 *
 * @example
 * ```typescript
 * const route = createPaneling({
 *   panels: {
 *     'user:': UserPanel,
 *     'settings:': SettingsPanel
 *   },
 *   path: '/app',
 *   max: 3,
 *   extrasSeparator: ';'
 * });
 * 
 * // URL: /app/user;123;role=admin/settings;456
 * // Creates stack: [UserPanel, SettingsPanel] with respective IDs and extras
 * ```
 */
export function createRouteObject<C extends object = object, P extends object = object>({
    panels: customPanels,
    path,
    element,
    Component: CustomComponent,
    errorElement,
    errorComponent: customErrorElement,
    indexComponent: customIndexElement,
    max,
    extrasSeparator
}: {
    panels: Record<string, FunctionComponent<P & IPanelProps<C>>>

    path?: string
    /**
     * element and hydrateFallbackElement
     */
    element?: ReactNode | null
    Component?: ComponentType | null
    /**
     * Necessary if not a child route
     */
    errorElement?: ReactNode | null

    errorComponent?: FunctionComponent<P & IPanelProps<C>>
    indexComponent?: FunctionComponent
    max?: number
    extrasSeparator?: string
}): RouteObject {
    const panels = customPanels || {};
    const errorComponent = customErrorElement || DefaultErrorPanel;
    const indexComponent = customIndexElement || DefaultIndexComponent;
    const Component = CustomComponent || DefaultSurface
    return {
        path: resolveRouteObjectPath(path),
        element,
        Component: element ? undefined : Component,
        hydrateFallbackElement: element,
        errorElement,
        loader: createLoader<C, P & IPanelProps<C>>({
            path,
            max,
            errorComponent,
            indexComponent,
            panels,
            extrasSeparator
        }),
        action: createAction(),
    }
}

/**
 * Alias for {@link createRouteObject}.
 * Creates a paneling route object for React Router (Data Mode).
 */
export const createPaneling = createRouteObject;

function resolveRouteObjectPath(path?: string) {
    let result = path ? `${path}` : ''
    if (!result) {
        result = '*'
    }
    if (result != '*') {
        if (!result.endsWith('*')) {
            if (result.endsWith('/')) {
                result += '*'
            } else {
                result += '/*'
            }
        }
    }
    return result;
}

function resolveRedirectPath(path?: string) {
    let result = path ? `${path}` : ''
    if (!result) {
        result = '/'
    }
    if (result != '/') {
        if (result.endsWith('*')) {
            result = result.substring(0, result.length - 1)
        }
        if (!result.startsWith('/')) {
            result = '/' + result
        }
        if (!result.endsWith('/')) {
            result += '/'
        }
    }
    return result;
}

function parsePanelPath(panelPath: string, extrasSeparator: string = ':'): { name: string, extras: Record<string, string>, id?: string } | undefined {
    if (!panelPath) return;

    const result: {
        name: string
        extras: Record<string, string>
        id?: string
    } = {
        name: panelPath,
        id: undefined,
        extras: {}
    }

    const firstIndex = panelPath.indexOf(extrasSeparator || ':')

    if (firstIndex > 0) {
        // The name of the panel
        // Using the default extrasSeparator (:) to name the panels so 
        // we don't mix definition and usage together.
        // Usage may change with extrasSeparator but definition will stay the same.
        result.name = `${panelPath.substring(0, firstIndex)}:`;
        const extras = panelPath.split(extrasSeparator || ':');
        result.id = extras[1];
        extras.splice(0, 2);
        for (let i = 0; i < extras.length; i++) {
            const [key, ...valueParts] = extras[i].split('=');
            if (key) {
                // Handle '=' in values
                const value = valueParts.join('=') 
                result.extras[key] = value ?? ''
            }
        }
    }

    return result
}

function createLoader<C extends object = object, T extends IPanelProps<C> = IPanelProps<C>>({ path, max, panels, errorComponent, indexComponent, extrasSeparator = ':' }: {
    path?: string
    max?: number
    extrasSeparator?: string
    panels: Record<string, FunctionComponent<T>>
    errorComponent: FunctionComponent<T>
    indexComponent: FunctionComponent
}) {
    return async function loader({ params }: LoaderFunctionArgs): Promise<Response | ILoaderData<C, T>> {
        const { '*': splat } = params;
        const stack: StackType<C, T> = []
        const redirectPath: string[] = []
        const splatArray: string[] = splat?.split('/') || [];
        if (splatArray.some(panelPath => {
            let stop = false
            if (max && panelPath && redirectPath.length >= max) {
                // panels must not exceed max number
                stop = true
            } else if (panelPath) {
                const previousPath = redirectPath.join('/')
                redirectPath.push(panelPath)
                const currentPath = redirectPath.join('/')

                const parsed = parsePanelPath(panelPath, extrasSeparator)

                if (parsed && panels[parsed.name]) {
                    stack.push({
                        component: panels[parsed.name],
                        id: parsed.id,
                        extras: parsed.extras,
                        previousPath,
                        currentPath,
                        panelPath: panelPath
                    })
                } else {
                    // last panel not found
                    stack.push({
                        component: errorComponent,
                        previousPath,
                        extras: {},
                        currentPath,
                        panelPath: panelPath,
                        error: true
                    })
                    stop = true
                }
            } else {
                // extra slash must be removed
                stop = true
            }
            return stop
        })) {

            if (!redirectPath.length) {
                // go back to base url
                stack.push({ component: indexComponent, previousPath: '/', isIndex: true })
            } else if (splatArray.length > redirectPath.length) {
                // not ok
                return redirect(resolveRedirectPath(path) + redirectPath.join('/'))
            }
        }

        return {
            get splat() {
                return splatArray.map(s => s)
            },
            get stack() {
                return stack.map(s => s)
            },
            get extrasSeparator() {
                return extrasSeparator
            }
        }
    }
}

function createAction() {
    return async function action({ params }: ActionFunctionArgs) {
        console.debug('action:', params)
        return redirect('/')
    }
}

/**
 * Arguments passed to client-side loaders in React Router.
 */
export type ClientLoaderArgs = {
    params: {
        '*': string;
    } & {
        [key: string]: string | undefined;
    }
}

/**
 * Creates a client-side loader for paneling routes (Framework Mode).
 * 
 * This function is used exclusively in Framework Mode where you need to process
 * panel paths on the client using the `clientLoader` API.
 * 
 * **Note:** This is for Framework Mode only. For Data Mode, use {@link createPaneling}.
 * 
 * @param config.path - Base path for the route
 * @param config.max - Maximum number of panels allowed in the stack
 * @param config.extrasSeparator - Character used to separate the panel name, id and extras within a URL segment (default ':')
 * @param config.panels - Map of panel names to their component implementations
 * @param config.errorComponent - Error panel component to display errors
 * @param config.indexComponent - Component to render when no panels are active
 *
 * @example
 * ```typescript
 * export async function clientLoader(args: Route.ClientLoaderArgs) {
 *   return await createClientLoader({
 *     path: 'paneling',
 *     panels: {
 *       'user:': UserPanel
 *     },
 *     extrasSeparator: ';',
 *     max: 8
 *   })(args);
 * }
 * ```
 */
export function createClientLoader<C extends object = object, P extends object = object>({
    path,
    max,
    extrasSeparator = ':',
    panels,
    errorComponent = DefaultErrorPanel,
    indexComponent = DefaultIndexComponent
}: {
    path?: string
    max?: number
    extrasSeparator?: string
    panels: Record<string, FunctionComponent<P & IPanelProps<C>>>
    errorComponent?: FunctionComponent<P & IPanelProps<C>>
    indexComponent?: FunctionComponent
}) {
    return async function loader<T extends ClientLoaderArgs = ClientLoaderArgs>({ params }: T): Promise<Response | ILoaderData<C, P & IPanelProps<C>>> {
        const { '*': splat } = params;
        const stack: StackType<C, P & IPanelProps<C>> = []
        const redirectPath: string[] = []
        const splatArray: string[] = splat?.split('/') || [];
        if (splatArray.some(panelPath => {
            let stop = false
            if (max && panelPath && redirectPath.length >= max) {
                // panels must not exceed max number
                stop = true
            } else if (panelPath) {
                const previousPath = redirectPath.join('/')
                redirectPath.push(panelPath)
                const currentPath = redirectPath.join('/')

                const parsed = parsePanelPath(panelPath, extrasSeparator)

                if (parsed && panels[parsed.name]) {
                    stack.push({
                        component: panels[parsed.name],
                        id: parsed.id,
                        extras: parsed.extras,
                        previousPath,
                        currentPath,
                        panelPath: panelPath
                    })
                } else {
                    // last panel not found
                    stack.push({
                        component: errorComponent,
                        previousPath,
                        extras: {},
                        currentPath,
                        panelPath: panelPath,
                        error: true
                    })
                    stop = true
                }
            } else {
                // extra slash must be removed
                stop = true
            }
            return stop
        })) {

            if (!redirectPath.length) {
                // go back to base url
                stack.push({ component: indexComponent, previousPath: '/', isIndex: true })
            } else if (splatArray.length > redirectPath.length) {
                // not ok
                return redirect(resolveRedirectPath(path) + redirectPath.join('/'))
            }
        }

        return {
            get splat() {
                return splatArray.map(s => s)
            },
            get stack() {
                return stack.map(s => s)
            },
            get extrasSeparator() {
                return extrasSeparator
            }
        }
    }
}
