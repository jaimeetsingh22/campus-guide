import { client } from "@/config/NilePostgresConfig";

export async function POST(request: Request) {
  const { postId, userEmail } = await request.json();
  await client.connect();
  const existing = await client.query(
    `select * from likes where post_id=${postId} and user_email='${userEmail}' `
  );
  if (existing.rows.length > 0) {
    const unliked = await client.query(
      `delete from likes where post_id=${postId} and user_email='${userEmail}'`
    );
    await client.end();
    return Response.json(unliked);
  } else {
    const result = await client.query(`
        insert into likes values(
            DEFAULT,
            ${postId},
            '${userEmail}',
            DEFAULT
        )
        `);
    await client.end();
    return Response.json(result);
  }
}

export async function GET(request: Request) {
  const postid = new URL(request.url).searchParams.get("postid");
  await client.connect();
  const result = await client.query(
    `select * from likes where post_id=${postid}`
  );
  await client.end();
  return Response.json(result.rows);
}
