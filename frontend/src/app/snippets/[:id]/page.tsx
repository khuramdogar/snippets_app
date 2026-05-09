"use client";
import styles from "./home.module.scss";
import { FormEvent, useState } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import type { Board, ErrorResponse, Snippet as SnippetData } from "constants/interface";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getBoards } from "lib/api/board";
import { addSnippetComment, getSnippetById, likeSnippet, saveSnippetToBoard } from "lib/api/snippets";

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

const Snippet = () => {
    const params = useParams();
    const snippetId = (params[":id"] || params[":snippetId"]) as string;
    const queryClient = useQueryClient();
    const [comment, setComment] = useState("");
    const [selectedBoardId, setSelectedBoardId] = useState("");

    const { isLoading, isError, data, error } = useQuery<SnippetData, ErrorResponse>({
        queryFn: () => getSnippetById(snippetId),
        queryKey: ['snippet', snippetId],
        enabled: !!snippetId,
    });

    const { data: boards = [] } = useQuery<Board[]>({
        queryFn: () => getBoards({}),
        queryKey: ["boards"],
    });

    const likeMutation = useMutation({
        mutationFn: () => likeSnippet(snippetId, Boolean(data?.liked_by_me)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["snippet", snippetId] });
            queryClient.invalidateQueries({ queryKey: ["snippets"] });
        },
    });

    const commentMutation = useMutation({
        mutationFn: () => addSnippetComment(snippetId, comment),
        onSuccess: () => {
            setComment("");
            queryClient.invalidateQueries({ queryKey: ["snippet", snippetId] });
            queryClient.invalidateQueries({ queryKey: ["snippets"] });
        },
    });

    const saveMutation = useMutation({
        mutationFn: () => saveSnippetToBoard(snippetId, selectedBoardId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["boards"] });
        },
    });

    function handleCommentSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (comment.trim()) {
            commentMutation.mutate();
        }
    }

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error: {error.message}</div>;
    if (!data) return <div>Snippet not found</div>;

    return (
        <main className={styles.show_page}>
            <section className={styles.hero}>
                <div>
                    <p>{data.language || "javascript"}</p>
                    <h1>{data.title}</h1>
                    {data.description && <span>{data.description}</span>}
                </div>
                <div className={styles.hero_actions}>
                    <button
                        type="button"
                        className={data.liked_by_me ? styles.active_button : ""}
                        disabled={likeMutation.isPending}
                        onClick={() => likeMutation.mutate()}
                    >
                        {data.liked_by_me ? "Liked" : "Like"} · {data.likes_count || 0}
                    </button>
                    <span>{data.comments_count || 0} comments</span>
                </div>
            </section>

            <section className={styles.show_grid}>
                <div className={styles.code_panel}>
                    <div className={styles.editor_header}>
                        <div className={styles.window_controls}>
                            <span />
                            <span />
                            <span />
                        </div>
                        <strong>{data.title}</strong>
                    </div>
                    <Editor
                        width="100%"
                        height="68vh"
                        defaultLanguage={data.language || "javascript"}
                        defaultValue={data.content}
                        theme="vs-dark"
                        options={{
                            readOnly: true,
                            automaticLayout: true,
                            fontSize: 15,
                            minimap: { enabled: true },
                            scrollBeyondLastLine: false,
                            wordWrap: "on",
                        }}
                    />
                </div>

                <aside className={styles.side_panel}>
                    <div className={styles.save_box}>
                        <h2>Save as your own</h2>
                        <select
                            value={selectedBoardId}
                            onChange={(event) => setSelectedBoardId(event.target.value)}
                        >
                            <option value="">Choose board</option>
                            {boards.map((board) => (
                                <option key={board.id} value={board.id}>{board.title}</option>
                            ))}
                        </select>
                        <button
                            type="button"
                            disabled={!selectedBoardId || saveMutation.isPending}
                            onClick={() => saveMutation.mutate()}
                        >
                            {saveMutation.isPending ? "Saving..." : "Save copy"}
                        </button>
                        {saveMutation.isSuccess && <p>Saved to your board.</p>}
                    </div>

                    <div className={styles.comments_box}>
                        <h2>Comments</h2>
                        <form onSubmit={handleCommentSubmit}>
                            <textarea
                                value={comment}
                                onChange={(event) => setComment(event.target.value)}
                                placeholder="Add a comment"
                            />
                            <button type="submit" disabled={commentMutation.isPending || !comment.trim()}>
                                {commentMutation.isPending ? "Posting..." : "Post comment"}
                            </button>
                        </form>
                        <div className={styles.comments_list}>
                            {(data.comments || []).map((item) => (
                                <article key={item.id}>
                                    <strong>{item.user.name || item.user.email}</strong>
                                    <p>{item.body}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </aside>
            </section>
        </main>
    );
};

export default Snippet;
