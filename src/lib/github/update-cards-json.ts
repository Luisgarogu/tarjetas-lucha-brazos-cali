import type { SportsCard } from "@/types/card";
export async function updateCardsJson(cards: SportsCard[]): Promise<void> {
  const { GITHUB_TOKEN: token, GITHUB_OWNER: owner, GITHUB_REPO: repo, GITHUB_BRANCH: branch = "main", GITHUB_CARDS_PATH: path = "src/data/cards.json" } = process.env;
  if (!token || !owner || !repo) throw new Error("Persistencia no configurada: defina GITHUB_TOKEN, GITHUB_OWNER y GITHUB_REPO en Vercel.");
  const endpoint = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  const headers = { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" };
  const current = await fetch(`${endpoint}?ref=${encodeURIComponent(branch)}`, { headers, cache: "no-store" });
  if (!current.ok) throw new Error(`GitHub no pudo leer cards.json (${current.status}).`);
  const { sha } = await current.json() as { sha: string };
  const content = Buffer.from(`${JSON.stringify(cards, null, 2)}\n`).toString("base64");
  const updated = await fetch(endpoint, { method: "PUT", headers: { ...headers, "Content-Type": "application/json" }, body: JSON.stringify({ message: `chore: actualizar tarjetas (${new Date().toISOString()})`, content, sha, branch }) });
  if (!updated.ok) throw new Error(`GitHub no pudo actualizar cards.json (${updated.status}): ${await updated.text()}`);
}
