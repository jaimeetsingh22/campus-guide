import { client } from "@/config/NilePostgresConfig";

export async function POST(request: Request) {
  try {
    const { clubId, u_email } = await request.json();
    await client.connect();
    const result = await client.query(`
            insert into clubfollowers values(DEFAULT,'${clubId}','${u_email}')
            `);
    await client.end();
    return Response.json(result, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Error" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const u_email = new URL(request.url).searchParams.get("u_email");
  try {
    await client.connect();
    const result = await client.query(`
       select c.name, cf.* from clubs as c, clubfollowers as cf where c.id = cf.club_id and cf.u_email ='${u_email}'
        `);
    await client.end();
    return Response.json(result.rows, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Error" }, { status: 500 });
  }
}
export async function DELETE(request: Request) {
  const u_email = new URL(request.url).searchParams.get("u_email");
  const club_id = new URL(request.url).searchParams.get("club_id");
  try {
    await client.connect();
    const result = await client.query(`
      DELETE FROM clubfollowers WHERE club_id = '${club_id}'  AND u_email = '${u_email}'
        `);
    await client.end();
    return Response.json(result, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Error" }, { status: 500 });
  }
}
