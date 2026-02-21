"use client";

import { useEffect } from 'react';
import { usePanelIndex } from '~/hooks/usePanelIndex';
import { usePanelingStore } from '~/hooks/usePanelingStore';

export default function PanelChild() {

    const panelIndex = usePanelIndex()
    const context = usePanelingStore((state) => state.panels[panelIndex]?.context)

    if (!context) {
        return (
            <div className="extra-content">
                <h1>Panel context not found</h1>
                <p>This should never happen, if you see this message it means that the panel context is not properly set in the store.</p>
            </div>
        )
    }

    useEffect(() => {
        if (context.extras?.title) {
            usePanelingStore.getState().setPanelTitle(panelIndex, context.extras.title)
        }
    }, [context.extras?.title])

    return (
        <div className="extra-content">
            <h1>Yes we are in a panel!</h1>
            <ul>
                <li>currentPath: {context.currentPath}</li>
                <li>panelPath: {context.panelPath}</li>
                <li>previousPath: {context.previousPath}</li>
                <li>splat: {context.splat}</li>
                <li>id: {context.id}</li>
                <li>title: {context.title}</li>
                <li>minimized: {context.minimized ? 'true' : 'false'}</li>
                <li>panelIndex: {context.panelIndex}</li>
                <li>extras: {context.extras ? JSON.stringify(context.extras) : 'none'}</li>
                <li>Try to change the title of the panel using the input in the panel header, or minimize it using the minimize button &#128521;</li>
            </ul>
            <form onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                const title = formData.get('title')
                if (title) {
                    usePanelingStore.getState().setPanelTitle(panelIndex, title.toString())
                }
            }}>
                <input type="text" name="title" placeholder="New title" />
                <button type="submit">Update Title</button>
            </form>
        </div>
    );
}

