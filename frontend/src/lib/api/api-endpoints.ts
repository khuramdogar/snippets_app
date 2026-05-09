export const apiEndpoint = {
  signIn: "/users/sign_in",
  currentUser: "/api/v1/users/current",
  signUp: "/users",
  getSnippets: "/api/v1/snippets",
  getSnippet: (snippetId: string) => `/api/v1/snippets/${snippetId}`,
  likeSnippet: (snippetId: string) => `/api/v1/snippets/${snippetId}/like`,
  commentSnippet: (snippetId: string) => `/api/v1/snippets/${snippetId}/comments`,
  saveSnippetToBoard: (snippetId: string) => `/api/v1/snippets/${snippetId}/save_to_board`,
  getSnippetsByBoardId: (boardId: string) => `/api/v1/boards/${boardId}/snippets`,
  createSnippet: "/api/v1/snippets",
  createBoard: "/api/v1/boards",
  getBoards: "/api/v1/boards",
  getBoard: "/api/v1/boards/:boardId"
};
