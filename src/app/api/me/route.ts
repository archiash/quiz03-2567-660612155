import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json({
    ok: true,
    fullName: "Paisit Lerdananpipat",
    studentId: "660612155",
  });
};
