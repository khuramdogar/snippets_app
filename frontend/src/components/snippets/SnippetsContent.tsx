"use client";
import styles from "@/app/snippets/home.module.scss";
import { useQuery } from "@tanstack/react-query";
import { getAllSnippets } from "lib/api/snippets";
import SnippetCard from "@/components/snippets/snippetCard";
import { Snippet } from "constants/interface";

export const SnippetsContent = () => {
    const { isLoading, isError, data, error } = useQuery({
        queryFn: getAllSnippets,
        queryKey: ['snippets'],
    });

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error: {error?.message}</div>;

    return (
        <div className={styles.container}>
            {data?.map((item: Snippet) => (
                <SnippetCard key={item.id} data={item} />
            ))}
        </div>
    );
};
