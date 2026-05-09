import styles from "./snippets.module.scss";
import { ComponentType, useState , useEffect} from "react";
import ProfileController from "../../.server/controllers/userController/profileController";
import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import snippetImg from "../../assets/snippet.png";

type EditorType = ComponentType<{
    height: string;
    width: string;
    defaultLanguage: string;
    defaultValue: string;
    theme: string;
    options: object;
}> | null;

// Note the "action" export name, this will handle our form POST
export const action = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    console.log(formData)
    // Extract values from formData
    const title = formData.get('name') as string;
    const description = formData.get('description') as string;
    const is_public = formData.get('is_public') == 'public' as string;
    const code = formData.get('code') as string;
    const board_id = formData.get('board') as string;
    const data = await ProfileController.create_snippet({ title, description, is_public, code, board_id: board_id });
    return redirect(`/profile`);
};

export const loader = async () => {
    try {
        const data = await ProfileController.boards();
        return data;
    } catch (error) {
        console.error('Error loading profile data:', error);
        return []; // Return an empty array or appropriate fallback
    }
};

const Snippet = () => {
    const data = useLoaderData<typeof loader>();
    const [snippetName, setSnippetName] = useState<string>('Snippet Name')
    const [code, setCode] = useState<string>('//write your code')
    const [Editor, setEditor] = useState<EditorType>(null);

    useEffect(() => {
        import('@monaco-editor/react').then((module) => {
            setEditor(() => module.default);
        });
    }, []);

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { value } = event.target;
        setSnippetName(value);
    }
    function handleEditorChange(value: string, event: React.ChangeEvent<HTMLInputElement>) {
        setCode(value)
    }

    return (
        <>
            <div className={styles.snippet_wrapper}>
                <div className={styles.snippet_header}>
                    <h2>Create Your Snippet</h2>
                </div>
                <div className={styles.snippet_container}>
                    <div className={styles.editor_container}>
                        <div className={styles.code}>
                            <div className={styles.editor_header}>
                                <svg viewBox="0 0 420 100" focusable="false" className={styles.svg}>
                                    <circle fill="#ff5f57" cx="50" cy="50" r="50"></circle>
                                    <circle fill="#febc2e" cx="210" cy="50" r="50"></circle>
                                    <circle fill="#28c840" cx="370" cy="50" r="50"></circle>
                                </svg>
                                <span>{snippetName}</span>
                            </div>
                                {Editor ? (
                                    <Editor
                                        width="40vw"
                                        height="50vh"
                                        defaultLanguage="javascript"
                                        defaultValue={code}
                                        theme="vs-dark"
                                        onChange={handleEditorChange}
                                        options={{
                                            readOnly: false,
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
                        </div>
                    </div>
                    <div className={styles.form_container}>
                        <Form method="post" action="/snippets/new">
                            <div className={`${styles.form_control} ${styles.float}`}>
                                <input name="name" className={styles.inputText} required onChange={handleInputChange}/>
                                <span className={styles.floating_label}>Snippet Name</span>
                            </div>
                            <div className={styles.form_control}>
                                <textarea name="description" className={styles.textarea} placeholder="Description" />
                                {/* <span className={styles.floating_label}>Board Description</span> */}
                            </div>
                            <div className={styles.form_control}>
                                <label>Private <input type="radio" name="is_public" value="private" /></label>
                                <label className={styles.radio}>Public <input type="radio" name="is_public" value="public" /></label>
                            </div>
                            <div className={styles.form_control}>
                                <select className={styles.selectText} name='board' required>
                                    <option value={0}>Save to Board</option>
                                    {data.length > 0 && (
                                        data.map(item => (
                                            <option value={item.id} key={item.id}>{item.name}</option>
                                        ))
                                    )}
                                </select>
                            </div>
                            <input name="code" type="hidden" value={code}/>
                            <div className={styles.form_control}>
                                <button type="submit" className={styles.btn}>Create Snippet</button>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Snippet;
