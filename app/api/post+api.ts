import { client } from "@/config/NilePostgresConfig";

export async function POST(request: Request) {
  const { content, imageUrl, visibleIn, email } = await request.json();
  try {
    await client.connect();
    const result = await client.query(
      `INSERT INTO post VALUES(DEFAULT,'${content}','${
        imageUrl ? imageUrl : "No Image"
      }',DEFAULT,'${email}','${visibleIn}')`
    );
    await client.end();
    return Response.json(
      {
        result,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return Response.json(
      {
        message: "Error creating post",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const club = new URL(request.url).searchParams.get("club");
  const orderField = new URL(request.url).searchParams.get("orderField");
  await client.connect();
  const result = await client.query(
    `select *,post.id as post_id from post inner join users on post.createdby = users.email  where club in (${club}) ORDER BY ${orderField} desc`
  );
  await client.end();
  return Response.json(result.rows);
}

// sql command to replace value from null to 0 in the existing column club in post table
// ALTER TABLE post ALTER COLUMN club SET DEFAULT 0 WHERE club IS NULL;
