import styles from "./profile.module.scss";
import { useState, useEffect, ComponentType } from 'react';
import { useLoaderData, useNavigate } from "@remix-run/react";
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


export const loader = async ({ params }: { params: { boardId: string } }) => {
    const { boardId } = params;

    try {
        const board = await ProfileController.board_snippets(parseInt(boardId, 10));
        console.log('board: ', board);
        return board;
    } catch (error) {
        console.error('Error loading board data:', error);
        return null; // Return null if an error occurs
    }
};

const BoardSnippets = () => {
    const data = useLoaderData<typeof loader>();
    const [Editor, setEditor] = useState<EditorType>(null);
    let navigate = useNavigate();

    useEffect(() => {
        import('@monaco-editor/react').then((module) => {
            setEditor(() => module.default);
        });
    }, []);

    function handleShowSnippet(id: number) {
        console.log("jwbwdkqwbeqjwbdiqw =>")
    }

    return (
        <>
            <section className={styles.banner}>
                    <img src={banner} alt="Profile Banner" />
            </section>
            <div className={styles.container}>

                {data.map((item) => (
                    <div className={styles.code} key={item.id}>
                        <div className={styles.editor_header} >
                            <svg viewBox="0 0 420 100" focusable="false" className={styles.svg}>
                                <circle fill="#ff5f57" cx="50" cy="50" r="50"></circle>
                                <circle fill="#febc2e" cx="210" cy="50" r="50"></circle>
                                <circle fill="#28c840" cx="370" cy="50" r="50" onClick={() => navigate(`/snippets/${item.id}`)}></circle>
                            </svg>
                            {item.title}
                        </div>
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
                            <div className={styles.save_button} onClick={() => navigate(`/snippets/${item.id}`)}>View</div>
                        </div>
                    </div>
                ))}


            </div>
        </>

    );
}


export default BoardSnippets;
