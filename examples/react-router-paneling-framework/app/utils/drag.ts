import React, { type RefObject } from 'react';

export function setupMouseDragEvents(md: React.MouseEvent<HTMLDivElement, MouseEvent>, elem: RefObject<HTMLDivElement | null>) {
    /**
     * The element to drag
     */
    const target = elem ? elem.current : elem

    if (!target) return;

    const { clientX: startX, clientY: startY } = md

    const {
        offsetTop,
        offsetLeft
    } = target

    md.preventDefault();

    function onMouseMove(e: MouseEvent) {
        if (!target) return;

        let y = offsetTop - (startY - e.clientY)
        if (y < 0) y = 0;
        let x = offsetLeft - (startX - e.clientX)
        if (x < 0) x = 0
        target.style.top = `${y}px`;
        target.style.left = `${x}px`;
    }

    function onMouseUp() {
        document.body.style.cursor = 'default';
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
}

export function setupTouchDragEvents(md: React.TouchEvent<HTMLDivElement>, elem: RefObject<HTMLDivElement | null>) {
    /**
     * The element to drag
     */
    const target = elem ? elem.current : elem

    if (!target) return;

    const { clientX: startX, clientY: startY } = md.touches[0]

    const {
        offsetTop,
        offsetLeft
    } = target

    function onTouchMove(e: TouchEvent) {
        if (!target) return;

        let y = offsetTop - (startY - e.touches[0].clientY)
        if (y < 0) y = 0;
        let x = offsetLeft - (startX - e.touches[0].clientX)
        if (x < 0) x = 0
        target.style.top = `${y}px`;
        target.style.left = `${x}px`;
    }

    function onTouchEnd() {
        document.body.style.cursor = 'default';
        window.removeEventListener('touchmove', onTouchMove);
        window.removeEventListener('touchend', onTouchEnd);
    }

    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);
}