"use client";
import { useQueryClient, useMutationState } from "@tanstack/react-query";


const useGetFetchQuery = (name: any) => {
    const queryClient = useQueryClient();
    queryClient.getMutationCache();
    return queryClient.getQueryData(name);
};

// export const useGetFetchQuery = (name: any) => {
//     const queryClient = useQueryClient();
//     return queryClient.getQueryData(name);
// };

const useGetFetchMutation = (name: any) => {
    const mutationKey = name;
    
    const data = useMutationState({
        filters: { mutationKey },
        select: (mutation) => mutation.state.data,
      })

    return data
};

const removeQuery = (name: any) => {
    const queryClient = useQueryClient();
    return queryClient.removeQueries({ queryKey: Array.isArray(name) ? name : [name] })
}

const invalidateQuery = (name: string | string[]) => {
    const queryClient = useQueryClient();
    return queryClient.invalidateQueries({ queryKey: Array.isArray(name) ? name : [name] })
}

export { 
    useGetFetchQuery,
    useGetFetchMutation,
    removeQuery, 
    invalidateQuery 
};
