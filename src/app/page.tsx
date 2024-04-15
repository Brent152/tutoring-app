import { db } from "~/server/db";

export default async function HomePage() {

  const posts = await db.query.posts.findMany();

  return (
    <main className="">

    {posts.map((post) => (<div key={post.id}>{post.name}</div>))}

      <div className="bg-neutral-800">
        Hello page!
      </div>
    </main>
  );
}
