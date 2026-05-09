"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { currentUser, login, logout } from "lib/api/login";

// Define the user object type (customize based on your API response)
export type User = {
  id: string;
  name: string;
  email: string;
};

// Define the login credentials type
type LoginCredentials = {
    user: {
        email: string;
        password: string;
    }
};

// Hook return type
type UseAuthReturn = {
  user: User | null; // `null` when not authenticated
  isLoading: boolean;
  login: (credentials: LoginCredentials, options?: MutationOptions) => void;
  logout: (options?: MutationOptions) => void;
};

// Mutation options type for login/logout (provided by React Query)
interface MutationOptions {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
  onSettled?: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const queryClient = useQueryClient();
    const { data: user, isLoading } = useQuery({
        queryFn: currentUser,
        queryKey: ['user'],
    })

  // Login mutation
     const loginMutation = useMutation({
          mutationFn: login,
          mutationKey: ['user'],
          onSuccess: (data) => {
            console.log('Login successful:', data);
            queryClient.setQueryData(['user'], data || null);
            queryClient.invalidateQueries({ queryKey: ['boards'] });
          },
          onError: (error: any) => {
            console.error('Login failed:', error.message);
          },
      });

  // Logout mutation
  const logoutMutation = useMutation({
      mutationFn: logout,
      mutationKey: ['user'],
      onSuccess: (data) => {
        console.log('Logout successful:', data);
        queryClient.setQueryData(['user'], null);
        queryClient.removeQueries({ queryKey: ['boards'] });
      }
  });

  return { 
    user: user || null,
    isLoading,
    login: (credentials: LoginCredentials, options?: MutationOptions) => {
      loginMutation.mutate(credentials, options);
    },
    logout: (options?: MutationOptions) => {
      logoutMutation.mutate(undefined, options);
    },
  };
};
