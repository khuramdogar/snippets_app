import styles from "./profile.module.scss";
import { useState, useEffect, ComponentType } from 'react';
import { useLoaderData } from "@remix-run/react";
import ProfileController from "../../.server/controllers/userController/profileController"

import banner from "../../assets/banner.png";

// Define Editor type
type EditorType = ComponentType<{
    height: string;
    width: string;
    defaultLanguage: string;
    defaultValue: string;
    theme: string;
    options: object;
}> | null;


export const loader = async () => {
    try {
        const data = await ProfileController.profile_snippets();
        return data
    } catch (error) {
        console.log('error: ', error);
    }

};

const Snippets = () => {
    const data = useLoaderData<typeof loader>();
    const [Editor, setEditor] = useState<EditorType>(null);

    useEffect(() => {
        import('@monaco-editor/react').then((module) => {
            setEditor(() => module.default);
        });
    }, []);

    return (
        <>
            <section className={styles.banner}>
                <img src={banner} alt="Profile Banner" />
            </section>
            <div className={styles.container}>

                {data.map((item) => (
                    <div className={styles.code} key={item.id}>
                        <div className={styles.editor_header}>
                            <svg viewBox="0 0 420 100" focusable="false" className={styles.svg}><circle fill="#ff5f57" cx="50" cy="50" r="50"></circle><circle fill="#febc2e" cx="210" cy="50" r="50"></circle><circle fill="#28c840" cx="370" cy="50" r="50"></circle></svg>
                            {item.title}</div>
                        {Editor ? (
                            <Editor
                                width="40vh"
                                height="30vh"
                                defaultLanguage="javascript"
                                defaultValue={item.code}
                                theme="vs-dark"
                                options={{
                                    readOnly: true,
                                    contextmenu: false,
                                    quickSuggestions: false,
                                    suggestOnTriggerCharacters: false,
                                    minimap: { enabled: false },
                                    scrollbar: { vertical: 'hidden', horizontal: 'hidden' },
                                    overviewRulerLanes: 0,
                                }}

                            />
                        ) : (
                            <p>Loading...</p>
                        )}
                        <div className={styles.editor_bottom_container}>
                            <div className={styles.like_dislike_container}>
                                <div className={styles.like_dislike_item}>{item.likes.length}</div>
                                <div className={styles.like_dislike_item}>{item.dislikes.length}</div>
                            </div>
                            <div className={styles.save_button}>Save</div>
                        </div>
                    </div>
                ))}


            </div>
        </>

    );
}


export default Snippets;