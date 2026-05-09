import { NextResponse } from "next/server";
import { apiEndpoint } from "./api-endpoints";

async function getAllSnippets() {
  try {
    const requestOptions: RequestInit = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    };
    console.log("dqdqdqw", process.env.NEXT_PUBLIC_API_URL);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${apiEndpoint.getSnippets}`, requestOptions);
    const responseData = await response.json();
    if (response.status !== 200) {
      return new NextResponse(JSON.stringify(responseData), { status: responseData.status });
    }
    return responseData;
  } catch (error: any) {
    console.log("Error inside catch: ", error);
    return { message: error.message, status: 500 };
  }
}

async function getSnippetsByBoardId(boardId: string) {
  try {
    const requestOptions: RequestInit = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    console.log("dqdqdqw", process.env.NEXT_PUBLIC_API_URL);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${apiEndpoint.getSnippetsByBoardId(boardId)}`, requestOptions);
    const responseData = await response.json();
    if (response.status !== 200) {
      return new NextResponse(JSON.stringify(responseData), { status: responseData.status });
    }
    return responseData;
  } catch (error: any) {
    console.log("Error inside catch: ", error);
    return { message: error.message, status: 500 };
  }
}

async function getSnippetById(snippetId: string) {
  try {
    const requestOptions: RequestInit = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${apiEndpoint.getSnippet(snippetId)}`, requestOptions);
    const responseData = await response.json();
    if (response.status !== 200) {
      throw new Error(responseData?.message || "Failed to fetch snippet");
    }
    return responseData;
  } catch (error: any) {
    console.log("Error inside catch: ", error);
    throw new Error(error.message);
  }
}

async function createSnippet(req: any) {
  try {
    const requestOptions: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(req),
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${apiEndpoint.createSnippet}`, requestOptions);
    const responseData = await response.json();
    return responseData;
  } catch (error: any) {
    console.log("Error inside catch: ", error);
    return new NextResponse(JSON.stringify({ message: error.message }), { status: 500 });
  }
}

async function likeSnippet(snippetId: string, liked: boolean) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${apiEndpoint.likeSnippet(snippetId)}`, {
    method: liked ? "DELETE" : "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData?.message || "Failed to update like");
  }
  return responseData;
}

async function addSnippetComment(snippetId: string, body: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${apiEndpoint.commentSnippet(snippetId)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ comment: { body } }),
  });
  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData?.message || "Failed to add comment");
  }
  return responseData;
}

async function saveSnippetToBoard(snippetId: string, boardId: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${apiEndpoint.saveSnippetToBoard(snippetId)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ board_id: boardId }),
  });
  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData?.message || "Failed to save snippet");
  }
  return responseData;
}

export {
  getAllSnippets,
  getSnippetById,
  createSnippet,
  getSnippetsByBoardId,
  likeSnippet,
  addSnippetComment,
  saveSnippetToBoard,
};
