import { NextResponse } from "next/server";

export async function GET(request) {
  const headers = request.headers;
  const country = headers.get("wpe-headless-country") || "No country data";
  const region = headers.get("wpe-headless-region") || "No region data";
  const timezone = headers.get("wpe-headless-timezone") || "No timezone data";

  console.log("Country:", country);
  console.log("Region:", region);
  console.log("Timezone:", timezone);

  return NextResponse.json({
    message: "Headers logged",
    country,
    region,
    timezone,
  });
}
