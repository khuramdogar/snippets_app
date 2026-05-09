"use client";
import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Board, Snippet } from "constants/interface";
import { getBoards } from "lib/api/board";
import { likeSnippet, saveSnippetToBoard } from "lib/api/snippets";
import styles from "./card.module.scss";

interface SnippetCardProps {
    data: Snippet;
}

const SnippetCard: React.FC<SnippetCardProps> = ({ data }) => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [showSave, setShowSave] = useState(false);
    const [selectedBoardId, setSelectedBoardId] = useState("");
    const snippetPath = `/snippets/${data.id}`;
    const previewLines = data.content.split("\n").slice(0, 14).join("\n");

    const { data: boards = [] } = useQuery<Board[]>({
        queryFn: () => getBoards({}),
        queryKey: ["boards"],
        enabled: showSave,
    });

    const likeMutation = useMutation({
        mutationFn: () => likeSnippet(data.id, Boolean(data.liked_by_me)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["snippets"] });
            queryClient.invalidateQueries({ queryKey: ["snippet", data.id] });
        },
    });

    const saveMutation = useMutation({
        mutationFn: () => saveSnippetToBoard(data.id, selectedBoardId),
        onSuccess: () => {
            setShowSave(false);
            queryClient.invalidateQueries({ queryKey: ["boards"] });
        },
    });

    function handleSaveClick() {
        if (!showSave && boards.length > 0 && !selectedBoardId) {
            setSelectedBoardId(boards[0].id);
        }
        setShowSave(!showSave);
    }

    return (
        <article className={styles.card}>
            <button className={styles.preview_button} type="button" onClick={() => router.push(snippetPath)}>
                <div className={styles.editor_header}>
                    <div className={styles.window_controls}>
                        <span />
                        <span />
                        <span />
                    </div>
                    <strong>{data.title}</strong>
                </div>
                <pre className={styles.code_preview}>
                    <code>{previewLines || "// empty snippet"}</code>
                </pre>
            </button>

            <div className={styles.card_body}>
                <div className={styles.meta_row}>
                    <span>{data.language || "javascript"}</span>
                    <span>{data.comments_count || 0} comments</span>
                </div>
                {data.description && <p>{data.description}</p>}
                <div className={styles.actions}>
                    <button
                        type="button"
                        className={data.liked_by_me ? styles.active_action : ""}
                        onClick={() => likeMutation.mutate()}
                        disabled={likeMutation.isPending}
                    >
                        {data.liked_by_me ? "Liked" : "Like"} · {data.likes_count || 0}
                    </button>
                    <button type="button" onClick={handleSaveClick}>
                        Save
                    </button>
                    <button type="button" onClick={() => router.push(snippetPath)}>
                        View
                    </button>
                </div>
                {showSave && (
                    <div className={styles.save_panel}>
                        <select value={selectedBoardId} onChange={(event) => setSelectedBoardId(event.target.value)}>
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
                    </div>
                )}
            </div>
        </article>
    );
};

export default SnippetCard;
