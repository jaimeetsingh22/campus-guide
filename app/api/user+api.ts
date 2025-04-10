import { client } from "@/config/NilePostgresConfig";

export async function POST(req: Request) {
  try {
    const { name, email, image } = await req.json();
    await client.connect();

    const result = await client.query(
      `INSERT INTO USERS VALUES(DEFAULT, '${name}', '${email}', '${image}')`
    );
    await client.end();

    return Response.json(
      {
        result,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log(error);
    return new Response("something went wrong", {
      status: 500,
    });
  }
}

export async function GET(request: Request) {
  const email = new URL(request.url).searchParams.get("email");
  try {
    await client.connect();
    const result = await client.query(
      `select * from users where email='${email}'`
    );
    await client.end();
    return Response.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("something went wrong", { status: 500 });
  }
}
