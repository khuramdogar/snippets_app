import styles from './nav-bar.module.scss';
import React, { useEffect, useState } from "react";
import Link from 'next/link';
import { useRouter, redirect } from "next/navigation";
import { useAuth } from "lib/useAuth";


interface NavBarProps {
}

const NavBar: React.FC<NavBarProps> = () => {
    const { user, logout } = useAuth();
    const router = useRouter();
    const handleLogout = () => {
        logout({ onSuccess: () => { router.push("/") }});
    };



    return (
        <div className={styles.navbar_main}>
            {/* <h3 className={styles.navbar_profile_name}>Talha  </h3> */}
            <Link href="/" className={styles.navbar_profile_button}>
                Home
            </Link>
            { user?.id ?
            <div className={styles.navbar_item}>
                <Link href="/profile" className={styles.navbar_profile_button}>
                    My Profile
                </Link>
                <div onClick={handleLogout} className={styles.navbar_logout_button}>
                    Logout
                </div>
            </div>
            :
            <div className={styles.navbar_item}>
                <Link href="/signup" className={styles.navbar_profile_button}>
                    SignUp
                </Link>
                <Link href="/login" className={styles.navbar_profile_button}>
                    Login
                </Link>
            </div>
             }
        </div>
    );
};

export default NavBar;
