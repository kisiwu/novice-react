import { createElement, FunctionComponent } from 'react'
import Panel from './panel'
import { IPanelContent, IPanelContentProps, IPanelProps } from '../definitions'

export function createPanel<P extends object = object>(
    component: FunctionComponent<IPanelContentProps>, panelComponent?: FunctionComponent<P & IPanelProps>) {
    return createCustomPanel(component, panelComponent || Panel)
}

export function createCustomPanel<C extends object = object, P extends object = object>(
    component: FunctionComponent<C & IPanelContentProps>, panelComponent: FunctionComponent<P & IPanelProps<C>>) {
    const CreatedPanel = ({ ...props }: P & IPanelProps<C>) => {
        const content: IPanelContent<C> = (ctxt: C) => {
            const {
                currentPath,
                previousPath,
                splat,
                extras,
                panelPath,
                id
            } = props
            const contentProps: IPanelContentProps = {
                currentPath,
                previousPath,
                splat,
                extras,
                panelPath,
                id
            }
            return createElement(
                component,
                {
                    ...ctxt,
                    ...contentProps
                },
                null
            )
        }

        return (
            createElement<P & IPanelProps<C>>(
                panelComponent,
                { ...props, content }
            )
        )
    }
    return CreatedPanel
}