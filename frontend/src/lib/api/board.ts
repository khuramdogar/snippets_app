import { Board, GetBoardsRequest } from "constants/interface";
import { apiEndpoint } from "./api-endpoints";

export async function createBoard(req: any) {
  try {
    const requestOptions: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(req),
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${apiEndpoint.createBoard}`, requestOptions);
    const responseData = await response.json();
    console.log(responseData);
    return responseData;
  } catch (error: any) {
    console.log("Error inside catch: ", error);
    throw new Error(error.message);
  }
}

export async function getBoards(req: GetBoardsRequest): Promise<Board[]> {
  console.log("Inside getBoards", req);
  try {
    const requestOptions: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    };
    const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}${apiEndpoint.getBoards}`);
    if (req.isPublic !== undefined) {
      url.searchParams.append("is_public", req.isPublic.toString());
    }
    console.log("Fetching boards with URL:", url.toString());
    const response = await fetch(url.toString(), requestOptions);
    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(responseData?.message || responseData?.error || "Failed to fetch boards");
    }
    console.log(responseData);
    return responseData as Board[];
  } catch (error: any) {
    console.log("Error inside catch: ", error);
    throw new Error(error.message);
  }
}
