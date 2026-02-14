import React, { createContext, useState } from 'react';

export const UIContext = createContext();

export const UIProvider = ({ children }) => {
    const [isTabBarVisible, setIsTabBarVisible] = useState(true);

    const showTabBar = () => setIsTabBarVisible(true);
    const hideTabBar = () => setIsTabBarVisible(false);

    return (
        <UIContext.Provider value={{ isTabBarVisible, showTabBar, hideTabBar, setIsTabBarVisible }}>
            {children}
        </UIContext.Provider>
    );
};
