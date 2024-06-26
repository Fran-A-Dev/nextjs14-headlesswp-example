import { NextResponse } from "next/server";

export async function GET(request) {
  const headers = request.headers;
  const country = headers.get("wpe-headless-country");
  const region = headers.get("wpe-headless-region");
  const timezone = headers.get("wpe-headless-timezone");

  console.log("Country:", country || "No country header");
  console.log("Region:", region || "No region header");
  console.log("Timezone:", timezone || "No timezone header");

  return NextResponse.json({
    message: "Headers logged",
    country,
    region,
    timezone,
  });
}
