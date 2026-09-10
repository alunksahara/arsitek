import crypto from "crypto";
import { createServerSupabase } from "@/lib/supabase-server";

export async function enforceLeadRateLimit(ip: string) {
const salt =
process.env.RATE_LIMIT_SALT ||
process.env.NEXT_PUBLIC_SITE_URL ||
"atelier";

const key = crypto
.createHash("sha256")
.update(`${salt}:${ip}`)
.digest("hex");

const supabase = await createServerSupabase();

const { data, error } = await supabase.rpc(
"consume_rate_limit",
{
p_key: `lead:${key}`,
p_window_seconds: 60,
p_max_requests: Number(
process.env.LEAD_RATE_LIMIT_PER_MINUTE || 100
),
}
);

if (error) {
console.error(
"[RATE LIMIT ERROR]",
error
);

return {
  allowed: false,
  count: 0,
  remaining: 0,
  resetAt: null,
};

}

return {
allowed: Boolean(data?.allowed),
count: Number(data?.count || 0),
remaining: Number(
data?.remaining || 0
),
resetAt: data?.reset_at || null,
};
}

export async function verifyTurnstile(
token: string | null,
request: Request
) {
const secret =
process.env.TURNSTILE_SECRET_KEY;

const required =
process.env.TURNSTILE_REQUIRED === "true";

/*

* Production wajib memiliki Turnstile secret.
  */
  if (
  process.env.NODE_ENV === "production" &&
  !secret
  ) {
  console.error(
  "[TURNSTILE] TURNSTILE_SECRET_KEY belum dikonfigurasi di production."
  );

return {

  ok: false,
  error: "Turnstile belum dikonfigurasi.",
};

}

/*

* Development:
* Jika Turnstile belum diaktifkan,
* izinkan request tanpa token.
  */
  if (
  !secret &&
  !required &&
  process.env.NODE_ENV !== "production"
  ) {
  console.warn(
  "[TURNSTILE] Development mode: Turnstile dilewati karena secret belum tersedia."
  );

return {

  ok: true,
};

}

/*

* Jika Turnstile diwajibkan tetapi token tidak ada.
  */
  if (!token) {
  return {
  ok: false,
  error: "Missing Turnstile token.",
  };
  }

if (!secret) {
return {
ok: false,
error: "Turnstile secret belum dikonfigurasi.",
};
}

try {
const formData =
new URLSearchParams();

formData.append(
  "secret",
  secret
);

formData.append(
  "response",
  token
);

const ip =
  request.headers
    .get("x-forwarded-for")
    ?.split(",")[0]
    ?.trim() || "";

if (ip) {
  formData.append(
    "remoteip",
    ip
  );
}

const response =
  await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded",
      },
      body:
        formData.toString(),
      cache: "no-store",
    }
  );

if (!response.ok) {
  console.error(
    "[TURNSTILE] Siteverify HTTP error:",
    response.status
  );

  return {
    ok: false,
    error:
      "Turnstile verification failed.",
  };
}

const result =
  await response.json();

if (!result.success) {
  console.warn(
    "[TURNSTILE] Verification rejected:",
    result["error-codes"] || []
  );

  return {
    ok: false,
    error:
      result["error-codes"] || [
        "Turnstile verification failed",
      ],
  };
}

/*
 * Optional hostname validation.
 *
 * Contoh:
 * TURNSTILE_HOSTNAME=example.com,www.example.com
 */
const configuredHostnames =
  (
    process.env
      .TURNSTILE_HOSTNAME || ""
  )
    .split(",")
    .map((host) =>
      host.trim().toLowerCase()
    )
    .filter(Boolean);

if (
  configuredHostnames.length > 0
) {
  const returnedHostname =
    String(
      result.hostname || ""
    ).toLowerCase();

  if (
    !configuredHostnames.includes(
      returnedHostname
    )
  ) {
    console.warn(
      "[TURNSTILE] Hostname mismatch:",
      returnedHostname
    );

    return {
      ok: false,
      error:
        "Turnstile hostname tidak valid.",
    };
  }
}

return {
  ok: true,
  hostname:
    result.hostname || null,
  action:
    result.action || null,
};

} catch (error) {
console.error(
"[TURNSTILE VERIFY ERROR]",
error
);

return {
  ok: false,
  error:
    "Turnstile verification failed.",
};

}
}
