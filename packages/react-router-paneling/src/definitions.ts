import { FunctionComponent, ReactElement, ReactNode } from 'react'

export interface IPanelContentProps {
    currentPath: string
    previousPath: string
    splat: string[]
    panelPath?: string
    extras?: Record<string, string>
    id?: string
}

export type IPanelContent<C extends object = object> = ((ctxt: C) => ReactElement<C & IPanelContentProps, FunctionComponent<C & IPanelContentProps>>)

export interface IPanelProps<C extends object = object> extends IPanelContentProps {
    content?: IPanelContent<C>
    children?: ReactNode
    [x: string]: unknown
}

export interface IStackElement<C extends object = object, T extends IPanelProps<C> = IPanelProps<C>> {
    component: FunctionComponent<T>
    previousPath: string
    extras?: Record<string, string>
    currentPath?: string
    panelPath?: string
    id?: string
    error?: boolean
    isIndex?: boolean
}

export type StackType<C extends object = object, T extends IPanelProps<C> = IPanelProps<C>> = IStackElement<C, T>[]

export interface ILoaderData<C extends object = object, T extends IPanelProps<C> = IPanelProps<C>> {
    readonly splat: string[];
    readonly stack: StackType<C, T>;
    readonly extrasSeparator: string;
}

export type LoaderData<C extends object = object, P extends object = object> = ILoaderData<C, P & IPanelProps<C>>

export interface IPanelSegment {
    panel: string
    extras?: Record<string, string>
    id?: string
}

export default {}