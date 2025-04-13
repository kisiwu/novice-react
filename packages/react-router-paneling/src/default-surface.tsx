import { useLoaderData, useLocation } from 'react-router';
import { createElement } from 'react';
import { ILoaderData } from './definitions';
import { createCustomPanelProps } from './utils';

export function DefaultSurface() {
    const { splat, stack } = useLoaderData<ILoaderData>();

    const location = useLocation();
    const { pathname } = location;

    return (
        <div id="rrp-surface">
            <div className='rrp-panels-container'>
                {stack.flatMap((c, i) => [
                    createElement(
                        c.component,
                        {
                            key: `rrp-panel-${i}`,
                            ...createCustomPanelProps(c, splat, pathname, {})
                        },
                        null
                    )
                ])}
            </div>
        </div>
    );
}