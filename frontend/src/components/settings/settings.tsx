import styles from "./settings.module.scss";

import React, { useState, useEffect, ComponentType } from 'react';
import type { LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

// Define Editor type
type EditorType = ComponentType<{
    height: string;
    width: string;
    // defaultLanguage: string;
    defaultValue: string;
    // onChange: (value: string | undefined) => void;
    theme: string;
}> | null;

export const loader: LoaderFunction = () => {
    return { initialCode: `// Please write code here` };
};


const Settings: React.FC = () => {
    const { initialCode } = useLoaderData<{ initialCode: string }>();
    // const [code, setCode] = useState<string>(initialCode);
    const [Editor, setEditor] = useState<EditorType>(null);

    useEffect(() => {
        import('@monaco-editor/react').then((module) => {
            setEditor(() => module.default);
        });
    }, []);

    // const handleEditorChange = (value: string | undefined) => {
    //     if (value !== undefined) {
    //         setCode(value);
    //     }
    // };

    return (
        <div className={styles.container}>
            <div className={styles.code}>
                <div className={styles.editor_header}>
                <svg viewBox="0 0 420 100" focusable="false" ><circle fill="#ff5f57" cx="50" cy="50" r="50"></circle><circle fill="#febc2e" cx="210" cy="50" r="50"></circle><circle fill="#28c840" cx="370" cy="50" r="50"></circle></svg>
                asds ads ada</div>
                {Editor ? (
                    <Editor
                        height="30vh"
                        width="50vh"
                        // defaultLanguage="javascript"
                        defaultValue={initialCode}
                        // onChange={handleEditorChange}
                        theme="vs-dark"
                    />
                ) : (
                    <p>Loading...</p>
                )}
                <div className={styles.editor_bottom_container}>
                    <div className={styles.like_dislike_container}>
                        <div className={styles.like_dislike_item}>23</div>
                        <div className={styles.like_dislike_item}>50</div>
                    </div>
                    <button className={styles.save_button}>Save</button>
                </div>

            </div>

        </div>
    );
};

export default Settings;
