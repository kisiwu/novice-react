import React from 'react';

/**
 * 
 * @param {React.MouseEvent<HTMLDivElement, MouseEvent>} md 
 * @param {React.RefObject<HTMLDivElement | null>} elem 
 * @returns 
 */
export function setupMouseDragEvents(md, elem) {
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

    /**
     * 
     * @param {MouseEvent} e 
     * @returns 
     */
    function onMouseMove(e) {
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

/**
 * 
 * @param {React.TouchEvent<HTMLDivElement>} md 
 * @param {React.RefObject<HTMLDivElement | null>} elem 
 * @returns 
 */
export function setupTouchDragEvents(md, elem) {
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

    /**
     * 
     * @param {TouchEvent} e 
     * @returns 
     */
    function onTouchMove(e) {
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