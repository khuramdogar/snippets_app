"use client";
import React, { useEffect, useState } from "react";
import style from "./signup.module.scss";


const Signup = () => {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setConfirmationPassword] = useState("");

    const signup = async (values: any) => {
        try {
            const response = await fetch("http://localhost:3030/users", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(values),
                });
                const data = await response.json();
                console.log("dqdqdqwdqwdqwdqwdq", data);
                console.log(data.data)
                if (data?.status.code === 200) {
                    console.log("user Success", data.data);
                    // localStorage.setItem("user", data.data)
                    // localStorage.setItem("token", response.headers.get('Authorization'))
                }
        } catch (error) {
            console.log("Error In signup", error);
        }
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();
        // Log user input (Replace with actual login logic)

        const user = { user: { name, email, password, password_confirmation: passwordConfirmation }}
        signup(user);
        console.log("dqwdqwdqwdqwd",{ name, email, password, passwordConfirmation});
        // alert("Login successful!");
    };

    useEffect(() => {
        // login();
      }, []);


    return (
        <div className={style.login_container}>
            <form onSubmit={handleSubmit} className={style.login_form}>
                <h2>SignUp</h2>
                <label htmlFor="name">Name:</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    required
                />
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
                <label htmlFor="password">Password Confirmation:</label>
                <input
                    type="password"
                    id="password_confirmation"
                    value={passwordConfirmation}
                    onChange={(e) => setConfirmationPassword(e.target.value)}
                    placeholder="Please confirm your password"
                    required
                />

                <button type="submit">Signup</button>
            </form>
        </div>
    );
}

export default Signup;