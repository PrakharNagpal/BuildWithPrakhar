const SUPABASE_URL = process.env.SUPABASE_URL?.replace(/\/$/, "");
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

type RequestOptions = {
  query?: string;
  serviceRole?: boolean;
  revalidate?: number;
};

type MutationOptions = RequestOptions & {
  method?: "POST" | "PATCH" | "DELETE";
  returning?: "minimal" | "representation";
};

export function isSupabaseConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

export function isSupabaseServiceConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);
}

function getHeaders(serviceRole = false) {
  const key = serviceRole ? SUPABASE_SERVICE_ROLE_KEY : SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !key) {
    throw new Error("Supabase is not configured");
  }

  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  };
}

export async function supabaseSelect<T>(table: string, options: RequestOptions = {}) {
  const query = options.query ? `?${options.query}` : "";
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}${query}`, {
    headers: getHeaders(options.serviceRole),
    next: { revalidate: options.revalidate ?? 300 },
  });

  if (!response.ok) {
    throw new Error(`Supabase select failed for ${table}: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function supabaseMutation<T>(
  table: string,
  payload: Record<string, unknown> | Record<string, unknown>[] | null,
  options: MutationOptions = {},
) {
  const query = options.query ? `?${options.query}` : "";
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}${query}`, {
    method: options.method ?? "POST",
    headers: {
      ...getHeaders(options.serviceRole),
      Prefer: `return=${options.returning ?? "representation"}`,
    },
    body: payload ? JSON.stringify(payload) : undefined,
  });

  if (!response.ok) {
    throw new Error(`Supabase mutation failed for ${table}: ${response.status}`);
  }

  if (options.returning === "minimal" || response.status === 204) {
    return null as T;
  }

  return response.json() as Promise<T>;
}

export async function supabaseInsert<T>(
  table: string,
  payload: Record<string, unknown>,
  options: RequestOptions = {},
) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      ...getHeaders(options.serviceRole),
      Prefer: "return=representation",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Supabase insert failed for ${table}: ${response.status}`);
  }

  return response.json() as Promise<T>;
}
