import Link from "next/link";
import React from "react";
import styles from "./board.module.scss";
import { Board } from "constants/interface";

interface BoardCardProps {
    data: Board;
    onCreateSnippet?: (boardId: string) => void;
}

const BoardCard: React.FC<BoardCardProps> = ({ data, onCreateSnippet }) => {
    return (
        <article className={styles.board}>
            <div className={styles.board_content}>
                <h2>{data.title}</h2>
                <p>{data.description}</p>
                <div className={styles.board_meta}>
                    <span>{data.is_public ? "Public" : "Private"}</span>
                    <span>{data.snippets_count || 0} snippets</span>
                </div>
            </div>
            <div className={styles.board_actions}>
                {onCreateSnippet && (
                    <button type="button" onClick={() => onCreateSnippet(data.id)}>
                        New snippet
                    </button>
                )}
                <Link href={`/boards/${data.id}/snippets`}>
                    View snippets
                </Link>
            </div>
        </article>
    );
}

export default BoardCard;
