import { headers } from "next/headers";

export default async function LocalPage() {
  const country = headers().get("wpe-headless-country") || "No country data";
  const region = headers().get("wpe-headless-region") || "No region data";
  const timezone = headers().get("wpe-headless-timezone") || "No timezone data";

  return (
    <div>
      <h1>Geolocation Data</h1>
      <p>Country: {country}</p>
      <p>Region: {region}</p>
      <p>Timezone: {timezone}</p>
    </div>
  );
}
