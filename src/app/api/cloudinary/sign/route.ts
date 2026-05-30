import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const { folder, public_id } = await req.json();

  const timestamp = Math.round(Date.now() / 1000);
  const params: Record<string, string | number> = { timestamp, folder: `traceon/uploads/${folder}` };
  if (public_id) params.public_id = public_id;

  const sortedParams = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");

  const signature = crypto
    .createHash("sha256")
    .update(sortedParams + process.env.CLOUDINARY_API_SECRET)
    .digest("hex");

  return NextResponse.json({
    signature,
    timestamp,
    api_key: process.env.CLOUDINARY_API_KEY,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    folder: `traceon/uploads/${folder}`,
  });
}
