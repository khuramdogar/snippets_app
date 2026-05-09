"use client";
import { ComponentType, useState , useEffect} from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, redirect } from "next/navigation";
import { useGetFetchQuery } from "lib/fetchQueryData";
import { createSnippet } from "lib/api/snippets";
import Editor from "@monaco-editor/react";
import type { Board } from "constants/interface";

import styles from "./snippets.module.scss";

const languageOptions = [
    { label: "JavaScript", value: "javascript", starter: "console.log('Hello snippet');" },
    { label: "TypeScript", value: "typescript", starter: "type Snippet = {\n  title: string;\n};" },
    { label: "Ruby", value: "ruby", starter: "puts 'Hello snippet'" },
    { label: "Python", value: "python", starter: "print('Hello snippet')" },
    { label: "HTML", value: "html", starter: "<section>\n  <h1>Hello snippet</h1>\n</section>" },
    { label: "CSS", value: "css", starter: ".snippet {\n  display: grid;\n  gap: 12px;\n}" },
    { label: "JSON", value: "json", starter: "{\n  \"name\": \"snippet\"\n}" },
    { label: "SQL", value: "sql", starter: "SELECT * FROM snippets;" },
    { label: "Markdown", value: "markdown", starter: "# Snippet\n\nWrite notes here." },
    { label: "Shell", value: "shell", starter: "echo \"Hello snippet\"" },
];

type EditorType = ComponentType<{
    height: string;
    width: string;
    defaultLanguage: string;
    defaultValue: string;
    theme: string;
    options: object;
}> | null;

// Note the "action" export name, this will handle our form POST
// export const action = async ({ request }: ActionFunctionArgs) => {
//     const formData = await request.formData();
//     console.log(formData)
//     // Extract values from formData
//     const title = formData.get('name') as string;
//     const description = formData.get('description') as string;
//     const is_public = formData.get('is_public') == 'public' as string;
//     const code = formData.get('code') as string;
//     const board_id = formData.get('board') as string;
//     const data = await ProfileController.create_snippet({ title, description, is_public, code, board_id: board_id });
//     return redirect(`/profile`);
// };

const Snippet = () => {
    const [snippetName, setSnippetName] = useState<string>('Snippet Name')
    const [code, setCode] = useState<string>(languageOptions[0].starter)
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isPublic, setPublic] = useState(false);
    const [board, setBoard] = useState(0);
    const [language, setLanguage] = useState("javascript");
    const [editorTheme, setEditorTheme] = useState("vs-dark");
    const [fontSize, setFontSize] = useState(14);
    const [wordWrap, setWordWrap] = useState(true);
    const [showMinimap, setShowMinimap] = useState(false);
    const boards = useGetFetchQuery(["boards"]) as Board[] | undefined;
    const router = useRouter();
    const createSnippetMutation = useMutation({
        mutationFn: createSnippet,
        mutationKey: ['create snippets'],
        // onSuccess: (data: any) => {
        //   console.log('Snippets Created successfully:', data);
        //   queryClient.invalidateQueries(['user']); // Refetch auth state after login
        // },
        // onError: (error: any) => {
        //   console.error('Snippets failed:', error.message);
        // },
    });
    // const [Editor, setEditor] = useState<EditorType>(null);

    useEffect(() => {
        console.log("dsdsfsf", boards)
        // import('@monaco-editor/react').then((module) => {
        //     setEditor(() => module.default);
        // });
    }, [boards]);

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { value } = event.target;
        setSnippetName(value);
    }
    function handleEditorChange(value: string | undefined) {
        setCode(value || "")
    }

    function handleLanguageChange(value: string) {
        const option = languageOptions.find((item) => item.value === value);
        setLanguage(value);

        if (!code.trim() || languageOptions.some((item) => item.starter === code)) {
            setCode(option?.starter || "");
        }
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();
        const newSnippet = { snippet: { title, is_public: isPublic, content: code, language, board_id: board } };
        console.log(newSnippet);
        createSnippetMutation.mutate(newSnippet, {
            onSuccess: (res) => {
                console.log('Snippet created:', res);
                router.push("/snippets");
                // props.toggleModal();
            },
        });
        // mutation.mutate(user);
    };

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
                                        language={language}
                                        value={code}
                                        theme={editorTheme}
                                        onChange={handleEditorChange}
                                        options={{
                                            readOnly: false,
                                            automaticLayout: true,
                                            fontSize,
                                            formatOnPaste: true,
                                            formatOnType: true,
                                            minimap: { enabled: showMinimap },
                                            overviewRulerLanes: 0,
                                            scrollBeyondLastLine: false,
                                            tabSize: 2,
                                            wordWrap: wordWrap ? "on" : "off",
                                        }}
                                    />
                                ) : (
                                    <p>Loading...</p>
                                )}
                        </div>
                    </div>
                    <div className={styles.form_container}>
                        <form onSubmit={handleSubmit}>
                            <div className={`${styles.form_control} ${styles.float}`}>
                                <input name="title" className={styles.inputText} required onChange={(e) => setTitle(e.target.value)} value={title} />
                                <span className={styles.floating_label}>Snippet Name</span>
                            </div>
                            <div className={styles.form_control}>
                                <textarea name="description" className={styles.textarea} onChange={(e) => setDescription(e.target.value)} value={description} placeholder="Description" />
                                {/* <span className={styles.floating_label}>Board Description</span> */}
                            </div>
                            <div className={styles.form_control}>
                                <select className={styles.selectText} name="language" onChange={(e) => handleLanguageChange(e.target.value)} value={language}>
                                    {languageOptions.map((item) => (
                                        <option value={item.value} key={item.value}>{item.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles.form_control}>
                                <select className={styles.selectText} name="theme" onChange={(e) => setEditorTheme(e.target.value)} value={editorTheme}>
                                    <option value="vs-dark">Dark theme</option>
                                    <option value="light">Light theme</option>
                                    <option value="hc-black">High contrast</option>
                                </select>
                            </div>
                            <div className={styles.editor_options}>
                                <label>
                                    Font
                                    <input
                                        type="number"
                                        min="12"
                                        max="22"
                                        value={fontSize}
                                        onChange={(e) => setFontSize(Number(e.target.value))}
                                    />
                                </label>
                                <label>
                                    <input type="checkbox" checked={wordWrap} onChange={(e) => setWordWrap(e.target.checked)} />
                                    Word wrap
                                </label>
                                <label>
                                    <input type="checkbox" checked={showMinimap} onChange={(e) => setShowMinimap(e.target.checked)} />
                                    Minimap
                                </label>
                            </div>
                            <div className={styles.form_control}>
                                <label>
                                    Is Public?
                                    <input 
                                        type="checkbox"
                                        checked={isPublic}
                                        onChange={(e) => setPublic(e.target.checked)}
                                        name="isPublic"
                                    />
                                </label>
                            </div>
                            <div className={styles.form_control}>
                                <select className={styles.selectText} name='board' required onChange={(e) => setBoard(Number(e.target.value))} value={board}>
                                    <option value={0}>Save to Board</option>
                                    {boards && boards.length > 0 && (
                                        boards.map(item => (
                                            <option value={item.id} key={item.id}>{item.title}</option>
                                        ))
                                    )}
                                </select>
                            </div>
                            <input name="code" type="hidden" value={code}/>
                            <div className={styles.form_control}>
                                <button type="submit" className={styles.btn}>Create Snippet</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Snippet;
