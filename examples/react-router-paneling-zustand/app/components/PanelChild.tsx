// client-only component (uses Zustand)
"use client";

import type { ILoaderData } from '@novice1-react/react-router-paneling';
import { useEffect, useState } from 'react';
import { useLoaderData } from 'react-router';
import { usePanelIndex } from '~/hooks/usePanelIndex';
import { usePanelingStore } from '~/hooks/usePanelingStore';

export default function PanelChild() {

    const { extrasSeparator } = useLoaderData<ILoaderData>()
    const panelIndex = usePanelIndex()
    const context = usePanelingStore((state) => state.panels[panelIndex]?.context)

    const [title, setTitle] = useState('')

    if (!context) {
        return (
            <div className="extra-content">
                <h1>Panel context not found</h1>
                <p>This should never happen, if you see this message it means that the panel context is not properly set in the store.</p>
            </div>
        )
    }

    useEffect(() => {
        if(title) {
            usePanelingStore.getState().setPanelTitle(panelIndex, title)
            return
        }
        // set the initial title of the panel based on the extras if it exists and if the title is not already set 
        // (to avoid overwriting an existing title on re-render)
        if (context.extras?.title && !context.title) {
            usePanelingStore.getState().setPanelTitle(panelIndex, context.extras.title)
        }
    }, [panelIndex, context, title])

    return (
        <div className="extra-content">
            <h1>Yes we are in a panel!</h1>
            <ul>
                <li>currentPath: {context.currentPath}</li>
                <li>panelPath: {context.panelPath}</li>
                <li>previousPath: {context.previousPath}</li>
                <li>id: {context.id}</li>
                <li>title: {context.title}</li>
                <li>minimized: {context.minimized ? 'true' : 'false'}</li>
                <li>panelIndex: {context.panelIndex}</li>
                <li>extras: {context.extras ? JSON.stringify(context.extras) : 'none'}</li>
                <li>extrasSeparator: {extrasSeparator}</li>
                <li>Try to change the title of the panel using the input below, or minimize it using the minimize button &#128521;</li>
            </ul>
            <form
                className="flex items-center gap-2 mt-4"
                onSubmit={(e) => {
                    e.preventDefault()
                    const formData = new FormData(e.currentTarget)
                    const title = formData.get('title')
                    if (title) {
                        setTitle(title.toString())
                        //usePanelingStore.getState().setPanelTitle(panelIndex, title.toString())
                    }
                }}
            >
                <input
                    type="text"
                    name="title"
                    placeholder="New title"
                    className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                    type="submit"
                    className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Update Title
                </button>
            </form>
        </div>
    );
}

