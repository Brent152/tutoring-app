import { db } from "~/server/db";

export const dynamic = "force-dynamic"

export default async function HomePage() {

  const posts = await db.query.users.findMany();

  return (
    <main className="">
      <div className="bg-neutral-800">
        Users:
        {posts.map((user) => (<div key={user.id}>{user.firstName} {user.lastName}</div>))}
      </div>
    </main>
  );
}
