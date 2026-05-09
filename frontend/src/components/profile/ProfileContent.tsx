"use client";
import React, { FormEvent, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Board, ErrorResponse } from "constants/interface";
import { getBoards } from "lib/api/board";
import { createSnippet } from "lib/api/snippets";
import styles from "@/app/profile/home.module.scss";
import banner from "@/assets/banner.png";
import BoardCard from "@/components/board/boardCard";
import CreateBoard from "@/app/boards/new";
import Modal from "@/app/modal/modal";

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

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

export const ProfileContent = () => {
    const queryClient = useQueryClient();
    const { isLoading, isError, data, error } = useQuery<Board[], ErrorResponse>({
        queryFn: () => getBoards({}),
        queryKey: ['boards'],
    });
    const boards = data || [];
    const [showBoardModal, setShowBoardModal] = useState<boolean>(false);
    const [showSnippetModal, setShowSnippetModal] = useState<boolean>(false);
    const [selectedBoardId, setSelectedBoardId] = useState<string>("");
    const [snippetTitle, setSnippetTitle] = useState("");
    const [snippetDescription, setSnippetDescription] = useState("");
    const [snippetLanguage, setSnippetLanguage] = useState("javascript");
    const [snippetContent, setSnippetContent] = useState(languageOptions[0].starter);
    const [editorTheme, setEditorTheme] = useState("vs-dark");
    const [fontSize, setFontSize] = useState(14);
    const [wordWrap, setWordWrap] = useState(true);
    const [showMinimap, setShowMinimap] = useState(false);
    const [showLineNumbers, setShowLineNumbers] = useState(true);
    const [isPublic, setPublic] = useState(false);

    const createSnippetMutation = useMutation({
        mutationFn: createSnippet,
        mutationKey: ['create snippets'],
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['boards'] });
            queryClient.invalidateQueries({ queryKey: ['snippets'] });
            queryClient.invalidateQueries({ queryKey: ['boardSnippets'] });
            resetSnippetForm();
            setShowSnippetModal(false);
        },
    });

    useEffect(() => {
        if (!selectedBoardId && boards.length > 0) {
            setSelectedBoardId(boards[0].id);
        }
    }, [boards, selectedBoardId]);

    function toggleBoardModal() {
        setShowBoardModal(!showBoardModal);
    }

    function openSnippetModal(boardId?: string) {
        if (boardId) {
            setSelectedBoardId(boardId);
        }
        setShowSnippetModal(true);
    }

    function resetSnippetForm() {
        setSnippetTitle("");
        setSnippetDescription("");
        setSnippetLanguage("javascript");
        setSnippetContent(languageOptions[0].starter);
        setEditorTheme("vs-dark");
        setFontSize(14);
        setWordWrap(true);
        setShowMinimap(false);
        setShowLineNumbers(true);
        setPublic(false);
    }

    function handleLanguageChange(language: string) {
        const option = languageOptions.find((item) => item.value === language);
        setSnippetLanguage(language);

        if (!snippetContent.trim() || languageOptions.some((item) => item.starter === snippetContent)) {
            setSnippetContent(option?.starter || "");
        }
    }

    function handleCreateSnippet(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        createSnippetMutation.mutate({
            snippet: {
                title: snippetTitle,
                description: snippetDescription,
                content: snippetContent,
                language: snippetLanguage,
                is_public: isPublic,
                board_id: selectedBoardId,
            }
        });
    }

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error: {error?.message}</div>;

    return (
        <>
            <section className={styles.banner}>
                <Image
                    src={banner}
                    alt="Profile Banner"
                    priority
                />
            </section>
            <section className={styles.container}>
                <div className={styles.profile_header}>
                    <div>
                        <h1>Your Profile</h1>
                        <p>Manage your boards and create snippets inside the right board.</p>
                    </div>
                    <div className={styles.profile_actions}>
                        <button onClick={toggleBoardModal} className={styles.btn_create}>
                            Create Board
                        </button>
                        <button
                            onClick={() => openSnippetModal()}
                            className={styles.btn_secondary}
                            disabled={boards.length === 0}
                        >
                            Create Snippet
                        </button>
                    </div>
                </div>

                <CreateBoard open={showBoardModal} toggleModal={toggleBoardModal} />
                <Modal open={showSnippetModal} heading="Create Your Snippet" toggleModal={() => setShowSnippetModal(false)}>
                    <form onSubmit={handleCreateSnippet} className={styles.snippet_form}>
                        <div className={styles.snippet_form_grid}>
                            <label>
                                Board
                                <select
                                    required
                                    value={selectedBoardId}
                                    onChange={(event) => setSelectedBoardId(event.target.value)}
                                >
                                    {boards.map((board) => (
                                        <option key={board.id} value={board.id}>
                                            {board.title}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label>
                                Snippet name
                                <input
                                    required
                                    value={snippetTitle}
                                    onChange={(event) => setSnippetTitle(event.target.value)}
                                />
                            </label>
                            <label>
                                Language
                                <select
                                    value={snippetLanguage}
                                    onChange={(event) => handleLanguageChange(event.target.value)}
                                >
                                    {languageOptions.map((language) => (
                                        <option key={language.value} value={language.value}>
                                            {language.label}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label>
                                Theme
                                <select value={editorTheme} onChange={(event) => setEditorTheme(event.target.value)}>
                                    <option value="vs-dark">Dark</option>
                                    <option value="light">Light</option>
                                    <option value="hc-black">High contrast</option>
                                </select>
                            </label>
                            <label>
                                Font size
                                <input
                                    type="number"
                                    min="12"
                                    max="22"
                                    value={fontSize}
                                    onChange={(event) => setFontSize(Number(event.target.value))}
                                />
                            </label>
                            <label>
                                Description
                                <textarea
                                    value={snippetDescription}
                                    onChange={(event) => setSnippetDescription(event.target.value)}
                                />
                            </label>
                        </div>
                        <div className={styles.editor_toolbar}>
                            <label className={styles.checkbox_label}>
                                <input
                                    type="checkbox"
                                    checked={wordWrap}
                                    onChange={(event) => setWordWrap(event.target.checked)}
                                />
                                Word wrap
                            </label>
                            <label className={styles.checkbox_label}>
                                <input
                                    type="checkbox"
                                    checked={showMinimap}
                                    onChange={(event) => setShowMinimap(event.target.checked)}
                                />
                                Minimap
                            </label>
                            <label className={styles.checkbox_label}>
                                <input
                                    type="checkbox"
                                    checked={showLineNumbers}
                                    onChange={(event) => setShowLineNumbers(event.target.checked)}
                                />
                                Line numbers
                            </label>
                            <label className={styles.checkbox_label}>
                                <input
                                    type="checkbox"
                                    checked={isPublic}
                                    onChange={(event) => setPublic(event.target.checked)}
                                />
                                Public snippet
                            </label>
                        </div>
                        <div className={styles.advanced_editor}>
                            <Editor
                                height="420px"
                                language={snippetLanguage}
                                theme={editorTheme}
                                value={snippetContent}
                                onChange={(value) => setSnippetContent(value || "")}
                                options={{
                                    automaticLayout: true,
                                    fontSize,
                                    formatOnPaste: true,
                                    formatOnType: true,
                                    lineNumbers: showLineNumbers ? "on" : "off",
                                    minimap: { enabled: showMinimap },
                                    scrollBeyondLastLine: false,
                                    tabSize: 2,
                                    wordWrap: wordWrap ? "on" : "off",
                                }}
                            />
                        </div>
                        {createSnippetMutation.isError && (
                            <p className={styles.form_error}>Snippet could not be created.</p>
                        )}
                        <button
                            type="submit"
                            className={styles.btn_create}
                            disabled={createSnippetMutation.isPending || boards.length === 0}
                        >
                            {createSnippetMutation.isPending ? "Creating..." : "Create Snippet"}
                        </button>
                    </form>
                </Modal>

                <div className={styles.section_header}>
                    <h2>Your Boards</h2>
                    <span>{boards.length} total</span>
                </div>
                <div className={styles.boards_content}>
                    {boards.length > 0 ? (
                        boards.map((board) => (
                            <BoardCard
                                data={board}
                                key={board.id}
                                onCreateSnippet={openSnippetModal}
                            />
                        ))
                    ) : (
                        <div className={styles.empty_state}>
                            <h2>No boards yet</h2>
                            <p>Create a board first, then add snippets to it from this page.</p>
                            <button onClick={toggleBoardModal} className={styles.btn_create}>
                                Create Board
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};
