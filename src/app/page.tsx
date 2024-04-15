import { db } from "~/server/db";

export const dynamic = "force-dynamic"

export default async function HomePage() {

  const posts = await db.query.posts.findMany();

  return (
    <main className="">
      <div className="bg-neutral-800">
        {posts.map((post) => (<div key={post.id}>{post.name}</div>))}
        Hello page!
      </div>
    </main>
  );
}
