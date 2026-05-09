interface GetBoardsRequest {
    isPublic?: boolean;
    // Add other query params here if needed
}
  
  // Define the type for the response data
interface Board {
    id: string;
    title: string;
    description: string;
    is_public: boolean;
    snippets_count: number;
    // Add other board properties here
}
  
  // Define the type for the error response
interface ErrorResponse {
    message: string;
}

interface Snippet {
    id: string;
    title: string;
    description?: string;
    content: string;
    language?: string;
    is_public: boolean;
    board_id?: string;
    likes_count?: number;
    comments_count?: number;
    liked_by_me?: boolean;
    comments?: SnippetComment[];
}

interface SnippetComment {
    id: string;
    body: string;
    created_at: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
}

export type {
    GetBoardsRequest,
    Board,
    ErrorResponse,
    Snippet,
    SnippetComment
}
