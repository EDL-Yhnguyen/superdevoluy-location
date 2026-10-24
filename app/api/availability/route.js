import { blocsOccupes } from "../../../lib/availability";

export const revalidate = 900; // 15 min

export async function GET() {
  const blocs = await blocsOccupes();
  return Response.json({ blocs });
}
