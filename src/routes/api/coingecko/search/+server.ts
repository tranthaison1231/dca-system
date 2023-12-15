import { json, type RequestEvent } from "@sveltejs/kit";

export async function GET(event: RequestEvent) {
  const query = event.url.searchParams.get("query");
  const response = await fetch(
    `https://www.coingecko.com/en/search_v2?query=${query}`,
  );

  const data = await response.json();

  return json(data);
}
