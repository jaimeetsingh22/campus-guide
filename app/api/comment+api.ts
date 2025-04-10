import { client } from "@/config/NilePostgresConfig";

// POST: Add a new comment
export async function POST(request: Request) {
  const { postId, userEmail, comment } = await request.json();

  if (!postId || !userEmail || !comment) {
    return new Response(
      JSON.stringify({ error: "Missing postId, userEmail or comment" }),
      { status: 400 }
    );
  }

  await client.connect();
  const result = await client.query(`
    INSERT INTO comments VALUES (
      DEFAULT,
      ${postId},
      '${userEmail}',
      '${comment}',
      DEFAULT
    )
  `);
  await client.end();

  return Response.json({ message: "Comment added", result });
}

// GET: Fetch all comments for a specific post
export async function GET(request: Request) {
  const postId = new URL(request.url).searchParams.get("postid");

  if (!postId) {
    return;
  }

  await client.connect();
  const result = await client.query(
    `select comments.* , users.name as username from comments inner join users on comments.user_email = users.email where post_id =${postId} ORDER by commented_on desc`
  );
  await client.end();

  return Response.json(result.rows);
}
