import { Database, DB, readDB, Room, writeDB } from "@lib/DB";
import { checkToken } from "@lib/checkToken";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  readDB();
  let rooms = (<Database>DB).rooms;
  return NextResponse.json({
    ok: true,
    rooms: rooms,
    totalRooms: `${rooms.length}`,
  });
};

export const POST = async (request: NextRequest) => {
  const payload = checkToken();

  if (!payload) {
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
  const room = (<Database>DB).rooms.find(
    (room) => room.roomName === body.roomName
  );

  if (room) {
    return NextResponse.json(
      {
        ok: false,
        message: `Room ${"replace this with room name"} already exists`,
      },
      { status: 400 }
    );
  }

  const roomId = nanoid();
  (<Database>DB).rooms.push({roomName: body.roomName, roomId:roomId})
  writeDB();

  return NextResponse.json({
    ok: true,
    roomId: roomId,
    message: `Room ${body.roomName} has been created`,
  });
};
