"use client";
import React from "react";
import NavBar from '@/components/nav-bar/nav-bar';
import styles from './navigation-layout.module.scss';


interface NavigationLayoutProps {
    children: React.ReactNode;
}

export const NavigationLayout: React.FC<NavigationLayoutProps> = ({ children }) => {
    return (
        <div className={styles.navigation_layout_main}>
            <>
                <NavBar />
            </>
            <div className={styles.navigation_layout_inner_body}>
                {children}
            </div>
            <footer>
                {/* Footer content */}
            </footer>
        </div>
    );
};