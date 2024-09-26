import { Database, DB, readDB, writeDB } from "@lib/DB";
import { checkToken, Payload } from "@lib/checkToken";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const roomId = request.nextUrl.searchParams.get("roomId");
  readDB();
  let rooms = (<Database>DB).rooms;
  const room = rooms.find((r) => r.roomId === roomId);
  if (!room) {
    return NextResponse.json(
      {
        ok: false,
        message: `Room is not found`,
      },
      { status: 404 }
    );
  }
  let messages = (<Database>DB).messages.filter((m) => m.roomId === roomId);
  return NextResponse.json({
    ok: true,
    message: messages,
  });
};

export const POST = async (request: NextRequest) => {
  const body = await request.json();
  readDB();
  let data = <Database>DB;
  const room = data.rooms.find((r) => r.roomId === body.roomId);
  if (!room) {
    return NextResponse.json(
      {
        ok: false,
        message: `Room is not found`,
      },
      { status: 404 }
    );
  }
  const messageId = nanoid();
  data.messages.push({
    roomId: room.roomId,
    messageId: messageId,
    messageText: body.messageText,
  });
  writeDB();

  return NextResponse.json({
    ok: true,
    messageId: messageId,
    message: "Message has been sent",
  });
};

export const DELETE = async (request: NextRequest) => {
  const payload = checkToken();
  if ((<Payload>payload).role !== "SUPER_ADMIN") {
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );
  }
  const body = await request.json();
  readDB();
  let messages = (<Database>DB).messages;
  const message = messages.find((m) => m.messageId === body.messageId);
  if (!message) {
    return NextResponse.json(
      {
        ok: false,
        message: "Message is not found",
      },
      { status: 404 }
    );
  }
  (<Database>DB).messages = messages.filter((m) => m.messageId !== body.messageId)
  writeDB();

  return NextResponse.json({
    ok: true,
    message: "Message has been deleted",
  });
};
