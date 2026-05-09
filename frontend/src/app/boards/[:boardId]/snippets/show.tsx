import styles from "./snippets.module.scss";
import { ComponentType, useState , useEffect} from "react";
import SnippetController from "../../.server/controllers/userController/snippetController";
import { useNavigate, useLoaderData } from "@remix-run/react";
import banner from "../../assets/banner.png";

type EditorType = ComponentType<{
    height: string;
    width: string;
    defaultLanguage: string;
    defaultValue: string;
    theme: string;
    options: object;
}> | null;

// Note the "action" export name, this will handle our form POST

export const loader = async ({ params }: { params: { snippetId: string } }) => {
    const { snippetId } = params;
    try {
        console.log('=>>>>>>>>>>>>>>>>>=>>>>',snippetId);
        const snippet = await SnippetController.get_snippet(parseInt(snippetId, 10));
        console.log('snippet: =>>>>', snippet);
        return snippet;
    } catch (error) {
        console.error('Error loading board data:', error);
        return null; // Return null if an error occurs
    }
};

const Snippet = () => {
    const data = useLoaderData<typeof loader>();
    const [code, setCode] = useState<string>('//write your code')
    const [Editor, setEditor] = useState<EditorType>(null);

    useEffect(() => {
        import('@monaco-editor/react').then((module) => {
            setEditor(() => module.default);
        });
    }, []);


    function handleEditorChange(value: string, event: React.ChangeEvent<HTMLInputElement>) {
        setCode(value)
    }

    return (
        <>
            <section className={styles.banner}>
                    <img src={banner} alt="Profile Banner" />
            </section>
            <div className={styles.snippet_lg_wrapper}>
                <div className={styles.snippet_container}>
                    <div className={styles.editor_container}>
                        <div className={styles.code}>
                            <div className={styles.editor_header}>
                                <svg viewBox="0 0 420 100" focusable="false" className={styles.svg}>
                                    <circle fill="#ff5f57" cx="50" cy="50" r="50"></circle>
                                    <circle fill="#febc2e" cx="210" cy="50" r="50"></circle>
                                    <circle fill="#28c840" cx="370" cy="50" r="50"></circle>
                                </svg>
                                <span>{data.title}</span>
                            </div>
                                {Editor ? (
                                    <Editor
                                        width="50vw"
                                        height="60vh"
                                        defaultLanguage="javascript"
                                        defaultValue={data.code}
                                        theme="vs-dark"
                                        onChange={handleEditorChange}
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
                        </div>
                    </div>
                </div>
                <div className={styles.data_container}>
                    <div className={styles.snippet_header}>
                        <h2>{data.title}</h2>
                    </div>
                    <div className="">
                        <p>This Text Description. This Text Description.This Text Description.This Text Description.This Text Description.This Text Description.This Text Description.This Text Description.This Text Description.This Text Description.This Text Description.</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Snippet;
