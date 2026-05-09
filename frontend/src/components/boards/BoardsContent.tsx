"use client";
import styles from "@/app/boards/home.module.scss";
import { useQuery } from "@tanstack/react-query";
import { Board, ErrorResponse } from "constants/interface";
import { getBoards } from "lib/api/board";
import BoardCard from "components/board/boardCard";

export const BoardsContent = () => {
    const { isLoading, isError, data, error } = useQuery<Board[], ErrorResponse>({
        queryFn: () => getBoards({ isPublic: true }),
        queryKey: ['publicBoards', { isPublic: true }],
    });

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error: {error?.message}</div>;

    return (
        <div>
            <section className={styles.container}>
                {data && data.length > 0 ? (
                    data.map((item) => (
                        <BoardCard key={item.id} data={item} />
                    ))
                ) : (
                    <p>No boards available.</p>
                )}
            </section>
        </div>
    );
};
