"use client";
import styles from "@/app/home/home.module.scss";
import { useQuery } from "@tanstack/react-query";
import { getSnippetsByBoardId } from "lib/api/snippets";
import SnippetCard from "@/components/snippets/snippetCard";
import { useParams } from "next/dist/client/components/navigation";
import type { Snippet } from "constants/interface";

export const BoardSnippetsContent = () => {
    const params = useParams();
    const boardId = params[':boardId'] as string;
    
    const { isLoading, isError, data, error } = useQuery<Snippet[], Error>({
        queryFn: () => getSnippetsByBoardId(boardId),
        queryKey: ['boardSnippets', boardId],
        enabled: !!boardId,
    });

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error: {error?.message}</div>;

    return (
        <div className={styles.container}>
            {data && data?.map((item) => (
                <SnippetCard key={item.id} data={item} />
            ))}
        </div>
    );
};
