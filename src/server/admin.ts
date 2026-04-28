import { revalidatePath } from "next/cache";
import { z } from "zod";
import { isSupabaseServiceConfigured, supabaseMutation, supabaseSelect } from "@/server/supabase-rest";

const stringList = z.array(z.string().trim().min(1)).default([]);

const profileSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(1),
  title: z.string().trim().min(1),
  location: z.string().trim().min(1),
  email: z.string().trim().email(),
  phone: z.string().trim().min(1),
  linkedin: z.string().trim().url(),
  github: z.string().trim().url(),
  resumeUrl: z.string().trim().url().or(z.literal("")).nullable().optional(),
  tagline: z.string().trim().min(1),
  about: stringList,
  stats: z.array(z.object({
    value: z.string().trim().min(1),
    label: z.string().trim().min(1),
  })).default([]),
  education: stringList,
  awards: stringList,
});

const projectSchema = z.object({
  id: z.string().optional(),
  slug: z.string().trim().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().trim().min(1),
  year: z.string().trim().min(1),
  blurb: z.string().trim().min(1),
  stack: stringList,
  highlights: stringList,
  role: z.string().trim().min(1),
  featured: z.boolean().default(false),
  repo: z.string().trim().url().or(z.literal("")).nullable().optional(),
  demo: z.string().trim().url().or(z.literal("")).nullable().optional(),
  images: stringList.optional().default([]),
});

const experienceSchema = z.object({
  id: z.string().optional(),
  role: z.string().trim().min(1),
  company: z.string().trim().min(1),
  location: z.string().trim().min(1),
  period: z.string().trim().min(1),
  bullets: stringList,
  tags: stringList,
});

const skillSchema = z.object({
  id: z.string().optional(),
  group: z.string().trim().min(1),
  items: stringList,
});

export const adminPortfolioSchema = z.object({
  profile: profileSchema,
  projects: z.array(projectSchema),
  experience: z.array(experienceSchema),
  skills: z.array(skillSchema),
});

export type AdminPortfolioData = z.infer<typeof adminPortfolioSchema>;

type RowId = { id: string };
type ProfileRow = AdminPortfolioData["profile"] & RowId & {
  resume_url?: string | null;
};
type ProjectRow = AdminPortfolioData["projects"][number] & RowId & { sort_order: number };
type ExperienceRow = AdminPortfolioData["experience"][number] & RowId & { sort_order: number };
type SkillRow = Omit<AdminPortfolioData["skills"][number], "group"> & RowId & {
  group: string;
  sort_order: number;
};

function stripSortOrder<T extends { sort_order: number }>(row: T): Omit<T, "sort_order"> {
  return Object.fromEntries(
    Object.entries(row).filter(([key]) => key !== "sort_order"),
  ) as Omit<T, "sort_order">;
}

function stripId<T extends { id?: string }>(row: T): Omit<T, "id"> {
  return Object.fromEntries(
    Object.entries(row).filter(([key]) => key !== "id"),
  ) as Omit<T, "id">;
}

function requireServiceRole() {
  if (!isSupabaseServiceConfigured()) {
    throw new Error("Supabase service role is not configured");
  }
}

function normalizeOptionalUrl(value?: string | null) {
  return value?.trim() ? value.trim() : null;
}

export async function getAdminPortfolioData(): Promise<AdminPortfolioData> {
  requireServiceRole();

  const [profiles, projects, experience, skills] = await Promise.all([
    supabaseSelect<ProfileRow[]>("profile", { query: "select=*&limit=1", serviceRole: true, revalidate: 0 }),
    supabaseSelect<ProjectRow[]>("projects", {
      query: "select=id,slug,title,year,blurb,stack,highlights,role,featured,repo,demo,images,sort_order&order=sort_order.asc",
      serviceRole: true,
      revalidate: 0,
    }),
    supabaseSelect<ExperienceRow[]>("experience", {
      query: "select=id,role,company,location,period,bullets,tags,sort_order&order=sort_order.asc",
      serviceRole: true,
      revalidate: 0,
    }),
    supabaseSelect<SkillRow[]>("skills", {
      query: "select=id,group,items,sort_order&order=sort_order.asc",
      serviceRole: true,
      revalidate: 0,
    }),
  ]);

  const profile = profiles[0];

  if (!profile) {
    throw new Error("No profile row exists");
  }

  const { resume_url: resumeUrlFromDb, ...profileFields } = profile;

  return {
    profile: {
      ...profileFields,
      resumeUrl: profile.resumeUrl ?? resumeUrlFromDb ?? "",
    },
    projects: projects.map((project) => ({
      ...stripSortOrder(project),
      images: project.images ?? [],
    })),
    experience: experience.map(stripSortOrder),
    skills: skills.map(stripSortOrder),
  };
}

async function syncRows<T extends { id?: string }>(
  table: string,
  rows: T[],
  toPayload: (row: T, index: number) => Record<string, unknown>,
) {
  const existing = await supabaseSelect<RowId[]>(table, {
    query: "select=id",
    serviceRole: true,
    revalidate: 0,
  });
  const kept = new Set(rows.map((row) => row.id).filter(Boolean));

  await Promise.all(rows.map((row, index) => {
    const payload = toPayload(row, index);

    if (row.id) {
      return supabaseMutation(table, payload, {
        method: "PATCH",
        query: `id=eq.${row.id}`,
        serviceRole: true,
        returning: "minimal",
      });
    }

    return supabaseMutation(table, payload, {
      method: "POST",
      serviceRole: true,
      returning: "minimal",
    });
  }));

  await Promise.all(existing
    .filter((row) => !kept.has(row.id))
    .map((row) => supabaseMutation(table, null, {
      method: "DELETE",
      query: `id=eq.${row.id}`,
      serviceRole: true,
      returning: "minimal",
    })));
}

export async function updateAdminPortfolioData(input: unknown) {
  requireServiceRole();
  const data = adminPortfolioSchema.parse(input);
  const { id: profileId, ...profile } = data.profile;
  const { resumeUrl, ...profileFields } = profile;
  const profilePayload = {
    ...profileFields,
    resume_url: normalizeOptionalUrl(resumeUrl),
  };

  if (profileId) {
    await supabaseMutation("profile", profilePayload, {
      method: "PATCH",
      query: `id=eq.${profileId}`,
      serviceRole: true,
      returning: "minimal",
    });
  } else {
    await supabaseMutation("profile", profilePayload, { method: "POST", serviceRole: true, returning: "minimal" });
  }

  await syncRows("projects", data.projects, (row, index) => {
    const project = stripId(row);

    return {
    ...project,
    repo: normalizeOptionalUrl(project.repo),
    demo: normalizeOptionalUrl(project.demo),
    images: project.images.length ? project.images : null,
    sort_order: index,
    };
  });

  await syncRows("experience", data.experience, (row, index) => ({
    ...stripId(row),
    sort_order: index,
  }));

  await syncRows("skills", data.skills, (row, index) => ({
    ...stripId(row),
    sort_order: index,
  }));

  revalidatePath("/");
  revalidatePath("/api/profile");
  revalidatePath("/api/projects");
  revalidatePath("/api/experience");
  revalidatePath("/api/skills");

  return getAdminPortfolioData();
}
