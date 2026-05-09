"use client";
import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "lib/useAuth"; 
import { useRouter, redirect } from "next/navigation";
import style from "./login.module.scss";


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();
    const router = useRouter();
    // const mutation = useMutation({
    //     mutationFn: login,
    //     mutationKey: ['user'],
    //     onSuccess: (data: any) => {
    //       console.log('Login successful:', data);
    //     //   router.push("/profile")
    //     // redirect('/profile')
    //     },
    //     onError: (error: any) => {
    //       console.error('Login failed:', error.message);
    //     },
    // });

    const handleSubmit = (e: any) => {
        e.preventDefault();
        const user = { user: { email, password}}
        login(user,
            {
              onSuccess: () => {
                router.push("/profile");
              },
            }
          );
        // mutation.mutate(user);
    };

    // useEffect(() => {
    //   }, []);
    // {mutation.isSuccess && redirect('/profile')}

    // if (isLoading) return <div>Loading</div>;
    // if (isError) return <div>Sorry There was an Error</div>;

    return (
        <div className={style.login_container}>
            <form onSubmit={handleSubmit} className={style.login_form}>
                <h2>Login</h2>
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                />

                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                />

                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;
