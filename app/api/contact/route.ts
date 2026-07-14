import { NextResponse } from "next/server";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  organization: z.string().max(120).optional(),
  inquiryType: z.enum([
    "研究提携",
    "採用に関するお問い合わせ",
    "メディア窓口",
    "一般お問い合わせ",
  ]),
  message: z.string().min(20),
});

const inquiryCodes: Record<string, string> = {
  研究提携: "RES",
  採用に関するお問い合わせ: "CAR",
  メディア窓口: "MED",
  一般お問い合わせ: "GEN",
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = contactSchema.parse(body);
    const id = `NR-${Date.now().toString(36).toUpperCase()}-${
      inquiryCodes[parsed.inquiryType] ?? "ACK"
    }`;

    return NextResponse.json({
      ok: true,
      id,
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message: "お問い合わせ内容が正しくありません。",
      },
      { status: 400 },
    );
  }
}
