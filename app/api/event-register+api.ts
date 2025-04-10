import { client } from "@/config/NilePostgresConfig";

export async function POST(request: Request) {
  const { eventId, userEmail } = await request.json();
  try {
    await client.connect();

    const result = await client.query(
      `INSERT INTO event_registration VALUES(
          DEFAULT,
          ${eventId}
          , '${userEmail}' ,
          DEFAULT
          )`
    );
    await client.end();
    return Response.json(result);
  } catch (error: any) {
    console.log(error.message);
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
  const email = new URL(request.url).searchParams.get("email");
  await client.connect();
  const result = await client.query(
    `select events.* ,users.name as username from events 
inner join users on events.createdby = users.email 
inner join event_registration on events.id = event_registration.event_id where event_registration.user_email='${email}' order by event_registration.id desc`
  );
  await client.end();
  return Response.json(result.rows);
}

export async function DELETE(request: Request) {
  const userEmail = new URL(request.url).searchParams.get("userEmail");
  const eventId = new URL(request.url).searchParams.get("eventId");
  try {
    await client.connect();
    const result = await client.query(
      `delete from event_registration where event_id = ${eventId} and user_email='${userEmail}'`
    );
    await client.end();
    return Response.json(result, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Error" }, { status: 500 });
  }
}
