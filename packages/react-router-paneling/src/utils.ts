import { createElement} from 'react'
import { ILoaderData, IPanelProps, IStackElement } from './definitions'

function getBaseUrl(splat: string[], pathname: string) {
    const decodedPathname = decodeURIComponent(pathname)
    return splat.length && splat[0] == '' ?
        decodedPathname.substring(0, 1) + decodedPathname.substring(1).replace(`/${splat.join('/')}`, '') :
        decodedPathname.replace(`/${splat.join('/')}`, '')
}

export type FunctionExtension<C extends object> = ((idx: number) => C)

export function createCustomPanelProps<C extends object = object, P extends object = object>(
    stackElement: IStackElement<C, P & IPanelProps<C>>,
    splat: string[],
    pathname: string,
    extendedProps: P
): P & IPanelProps<C> {
    const baseUrl = getBaseUrl(splat, pathname)

    const panelProps: IPanelProps<C> = {
        previousPath: `${baseUrl}${stackElement.previousPath != '/' ? '/' + stackElement.previousPath : ''}` || '/',
        currentPath: `${baseUrl}${stackElement.currentPath ? '/' + stackElement.currentPath : ''}` || '/',
        panelPath: stackElement.panelPath,
        id: stackElement.id,
        extras: stackElement.extras,
        splat: splat
    }

    return {
        ...extendedProps,
        ...panelProps
    }
}

export function displayPanels<C extends object = object, P extends object = object>(
    loaderData: ILoaderData<C, IPanelProps<C> & P>,
    pathname: string, 
    extension: FunctionExtension<P> | Readonly<P>) {
    const { splat, stack } = loaderData
    const result = stack.flatMap((c, i) => [
        createElement(
            c.component,
            {
                key: `panel-${i}`,
                ...createCustomPanelProps<C, P>(c, splat, pathname, typeof extension === 'function' ? extension(i) : extension),
            },
            null
        )
    ])
    return result
}
