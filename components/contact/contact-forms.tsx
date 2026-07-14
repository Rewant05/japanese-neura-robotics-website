"use client";

import { FormEvent, useState } from "react";
import { Send } from "lucide-react";
import { z } from "zod";

const inquiryTypes = [
  "研究提携",
  "採用に関するお問い合わせ",
  "メディア窓口",
  "一般お問い合わせ",
] as const;

const contactSchema = z.object({
  name: z.string().min(2, "お名前は2文字以上で入力してください。"),
  email: z.string().email("有効なメールアドレスを入力してください。"),
  organization: z.string().max(120).optional(),
  inquiryType: z.enum(inquiryTypes),
  message: z.string().min(20, "お問い合わせ内容は20文字以上で入力してください。"),
});

type ContactInput = z.infer<typeof contactSchema>;
type ContactErrors = Partial<Record<keyof ContactInput, string>>;

const initialState: ContactInput = {
  name: "",
  email: "",
  organization: "",
  inquiryType: "研究提携",
  message: "",
};

export function ContactForms() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <InquiryForm
        title="研究提携"
        defaultType="研究提携"
        note="共同研究、試験導入、シミュレーション計画、産業自律に関する連携窓口です。"
      />
      <InquiryForm
        title="採用お問い合わせ"
        defaultType="採用に関するお問い合わせ"
        note="ロボティクス、人工知能研究、制御、シミュレーション、設計、人間ロボット協調の募集窓口です。"
      />
    </div>
  );
}

function InquiryForm({
  title,
  defaultType,
  note,
}: {
  title: string;
  defaultType: ContactInput["inquiryType"];
  note: string;
}) {
  const [form, setForm] = useState<ContactInput>({
    ...initialState,
    inquiryType: defaultType,
  });
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">(
    "idle",
  );
  const [responseId, setResponseId] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("idle");
    setErrors({});

    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) {
      const nextErrors: ContactErrors = {};
      parsed.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof ContactInput;
        nextErrors[key] = issue.message;
      });
      setErrors(nextErrors);
      return;
    }

    setStatus("loading");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = (await response.json()) as { ok?: boolean; id?: string };
      if (!response.ok || !data.ok) throw new Error("お問い合わせ送信に失敗しました。");
      setResponseId(data.id ?? "NR-ACK");
      setStatus("sent");
      setForm({ ...initialState, inquiryType: defaultType });
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="interior-card tech-border p-6 md:p-8" noValidate>
      <p className="hud-label text-cyan">{title}</p>
      <p className="mt-4 min-h-14 text-sm leading-6 text-white/58">{note}</p>

      <div className="mt-7 grid gap-4">
        <Field
          label="お名前"
          value={form.name}
          error={errors.name}
          onChange={(value) => setForm((current) => ({ ...current, name: value }))}
        />
        <Field
          label="メールアドレス"
          type="email"
          value={form.email}
          error={errors.email}
          onChange={(value) => setForm((current) => ({ ...current, email: value }))}
        />
        <Field
          label="組織名"
          value={form.organization ?? ""}
          error={errors.organization}
          onChange={(value) =>
            setForm((current) => ({ ...current, organization: value }))
          }
        />
        <label className="grid gap-2">
          <span className="text-sm text-white/62">お問い合わせ種別</span>
          <select
            value={form.inquiryType}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                inquiryType: event.target.value as ContactInput["inquiryType"],
              }))
            }
            className="border border-white/14 bg-black/52 px-4 py-3 text-white"
          >
            {inquiryTypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
          {errors.inquiryType ? (
            <span className="text-xs text-laser">{errors.inquiryType}</span>
          ) : null}
        </label>
        <label className="grid gap-2">
          <span className="text-sm text-white/62">お問い合わせ内容</span>
          <textarea
            value={form.message}
            onChange={(event) =>
              setForm((current) => ({ ...current, message: event.target.value }))
            }
            rows={5}
            className="resize-y border border-white/14 bg-black/52 px-4 py-3 text-white"
          />
          {errors.message ? (
            <span className="text-xs text-laser">{errors.message}</span>
          ) : null}
        </label>
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-6 inline-flex items-center gap-3 border border-cyan/45 bg-cyan/10 px-5 py-3 text-sm font-semibold text-cyan transition hover:bg-cyan/18 disabled:cursor-wait disabled:opacity-60"
      >
        <Send size={16} />
        {status === "loading" ? "送信経路を確立中" : "お問い合わせを送信"}
      </button>

      {status === "sent" ? (
        <p className="mt-4 text-sm text-cyan">お問い合わせを受信しました: {responseId}</p>
      ) : null}
      {status === "error" ? (
        <p className="mt-4 text-sm text-laser">
          送信に失敗しました。お問い合わせ画面からもう一度お試しください。
        </p>
      ) : null}
    </form>
  );
}

function Field({
  label,
  value,
  error,
  type = "text",
  onChange,
}: {
  label: string;
  value: string;
  error?: string;
  type?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm text-white/62">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="border border-white/14 bg-black/52 px-4 py-3 text-white"
      />
      {error ? <span className="text-xs text-laser">{error}</span> : null}
    </label>
  );
}
