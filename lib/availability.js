import ical from "node-ical";

// ICAL_URLS : liste d'URL iCal séparées par des virgules (Airbnb, Booking, Abritel, Leboncoin).
export async function blocsOccupes() {
  const urls = (process.env.ICAL_URLS || "").split(",").map((u) => u.trim()).filter(Boolean);
  const blocs = [];
  for (const url of urls) {
    try {
      const data = await ical.async.fromURL(url);
      for (const ev of Object.values(data)) {
        if (ev.type !== "VEVENT" || !ev.start || !ev.end) continue;
        blocs.push({
          start: ev.start.toISOString().slice(0, 10),
          end: ev.end.toISOString().slice(0, 10),
        });
      }
    } catch (e) {
      console.error("iCal en échec :", url, e.message);
    }
  }
  return blocs.sort((x, y) => x.start.localeCompare(y.start));
}
