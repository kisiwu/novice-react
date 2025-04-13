import { Outlet, useNavigation, NavLink } from 'react-router';
import { useState } from 'react';
import clsx from 'clsx'

export default function Root() {
    const navigation = useNavigation();
    const [isDarkMode] = useState(true)

    return (
        <div id="root-route" className={clsx(isDarkMode ? 'dark' : '', 'flex flex-row')}>
            <aside className={'flex top-0 left-0 z-40 w-32 h-screen pt-20 transition-transform'}>
                <div className="h-full px-3 pb-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
                    <ul className="space-y-2 font-medium">
                        <li>
                            <NavLink to={'stacking'} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group">
                                <svg className="w-[24px] h-[24px] text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M8 5a1 1 0 0 1 1-1h11a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-1a1 1 0 1 1 0-2h1V6H9a1 1 0 0 1-1-1Z" clipRule="evenodd" />
                                    <path fillRule="evenodd" d="M4 7a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H4Zm0 11v-5.5h11V18H4Z" clipRule="evenodd" />
                                </svg>
                                <span className="flex-1 ms-3 whitespace-nowrap">Stacking</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={'tiling'} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group">
                                <svg className="w-[24px] h-[24px] text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M5 3a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5Zm14 18a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h4ZM5 11a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H5Zm14 2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h4Z" />
                                </svg>
                                <span className="flex-1 ms-3 whitespace-nowrap">Tiling</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={'grid'} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group">
                                <svg className="w-[24px] h-[24px] text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M4.857 3A1.857 1.857 0 0 0 3 4.857v4.286C3 10.169 3.831 11 4.857 11h4.286A1.857 1.857 0 0 0 11 9.143V4.857A1.857 1.857 0 0 0 9.143 3H4.857Zm10 0A1.857 1.857 0 0 0 13 4.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 21 9.143V4.857A1.857 1.857 0 0 0 19.143 3h-4.286Zm-10 10A1.857 1.857 0 0 0 3 14.857v4.286C3 20.169 3.831 21 4.857 21h4.286A1.857 1.857 0 0 0 11 19.143v-4.286A1.857 1.857 0 0 0 9.143 13H4.857Zm10 0A1.857 1.857 0 0 0 13 14.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 21 19.143v-4.286A1.857 1.857 0 0 0 19.143 13h-4.286Z" clipRule="evenodd" />
                                </svg>
                                <span className="flex-1 ms-3 whitespace-nowrap">Grid</span>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </aside>
            <div id="detail"
                className={
                    'flex py-2 px-2 pt-20 sm:pt-16 w-full' +
                    (navigation.state === 'loading' ? ' loading' : '')
                }>

                <Outlet />
            </div>
        </div>
    );
}