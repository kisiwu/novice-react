import { ComponentType, FunctionComponent, ReactNode } from 'react'
import { ActionFunctionArgs, LoaderFunctionArgs, redirect, RouteObject } from 'react-router'
import { DefaultSurface } from './default-surface.tsx'
import { ILoaderData, StackType, IPanelProps } from './definitions.ts'
import DefaultErrorPanel from './default-error-panel.tsx';
import DefaultIndexComponent from './default-index-component.tsx';

export const createPaneling = createRouteObject;

export function createRouteObject<C extends object = object, P extends object = object>({
    panels: customPanels,
    path,
    element,
    Component: CustomComponent,
    errorElement,
    errorComponent: customErrorElement,
    indexComponent: customIndexElement,
    max
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
            panels
        }),
        action: createAction(),
    }
}

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

function parsePanelPath(panelPath: string): { name: string, extras: Record<string, string>, id?: string } | undefined {
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

    const firstIndex = panelPath.indexOf(':')

    if (firstIndex > 0) {
        result.name = `${panelPath.substring(0, firstIndex)}:`
        const extras = panelPath.split(':')
        result.id = extras[1]
        extras.splice(0, 2)
        for (let i = 0; i < extras.length - 1; i = i + 2) {
            result.extras[extras[i]] = extras[i + 1]
        }
    }

    return result
}

function createLoader<C extends object = object, T extends IPanelProps<C> = IPanelProps<C>>({ path, max, panels, errorComponent, indexComponent }: {
    path?: string
    max?: number
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

                const parsed = parsePanelPath(panelPath)

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

export type ClientLoaderArgs = {
    params: {
        '*': string;
    } & {
        [key: string]: string | undefined;
    }
}

/**
 * Framework Mode
 */
export function createClientLoader<C extends object = object, P extends object = object>({
    path,
    max,
    panels,
    errorComponent = DefaultErrorPanel,
    indexComponent = DefaultIndexComponent
}: {
    path?: string
    max?: number
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

                const parsed = parsePanelPath(panelPath)

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
            }
        }
    }
}
