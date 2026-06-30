import { NextRequest, NextResponse } from "next/server";

const DECK_API_BASE = "https://deckofcardsapi.com/api";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const apiPath = path.join("/");
  const url = `${DECK_API_BASE}/${apiPath}`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Deck API request failed" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to reach deck API" },
      { status: 502 }
    );
  }
}
