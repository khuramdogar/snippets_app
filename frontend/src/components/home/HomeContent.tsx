"use client";
import styles from "@/app/home/home.module.scss";
import { useQuery } from "@tanstack/react-query";
import { getAllSnippets } from "lib/api/snippets";
import SnippetCard from "@/components/snippets/snippetCard";
import type { Snippet } from "constants/interface";

export const HomeContent = () => {
    const { isLoading, isError, data, error } = useQuery<Snippet[], Error>({
        queryFn: getAllSnippets,
        queryKey: ['snippets'],
    });

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error: {error?.message}</div>;

    return (
        <div className={styles.container}>
            {data?.map((item) => (
                <SnippetCard key={item.id} data={item} />
            ))}
        </div>
    );
};
