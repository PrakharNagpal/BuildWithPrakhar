import { experience as staticExperience } from "@/data/experience";
import { profile as staticProfile } from "@/data/profile";
import { projects as staticProjects } from "@/data/projects";
import { skills as staticSkills } from "@/data/skills";
import { isSupabaseConfigured, supabaseSelect } from "@/server/supabase-rest";
import type { ExperienceItem, PortfolioData, Profile, Project, SkillGroup } from "@/types/portfolio";

type ProjectRow = Omit<Project, "repo" | "demo" | "images"> & {
  repo?: string | null;
  demo?: string | null;
  images?: string[] | null;
};

type ExperienceRow = ExperienceItem;
type SkillRow = SkillGroup;

type ProfileRow = {
  name: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  resumeUrl?: string | null;
  resume_url?: string | null;
  tagline: string;
  about: string[];
  stats: Profile["stats"];
  education: string[];
  awards: string[];
};

const fallbackData: PortfolioData = {
  profile: staticProfile,
  projects: staticProjects.map((project) => ({
    ...project,
    stack: [...project.stack],
    highlights: [...project.highlights],
    images: "images" in project ? [...project.images] : undefined,
  })),
  experience: staticExperience.map((item) => ({
    ...item,
    bullets: [...item.bullets],
    tags: [...item.tags],
  })),
  skills: staticSkills.map((group) => ({
    ...group,
    items: [...group.items],
  })),
};

export async function getProfile(): Promise<Profile> {
  if (!isSupabaseConfigured()) {
    return fallbackData.profile;
  }

  try {
    const rows = await supabaseSelect<ProfileRow[]>("profile", {
      query: "select=*&limit=1",
    });
    const profile = rows[0];

    if (!profile) {
      return fallbackData.profile;
    }

    return {
      ...profile,
      resumeUrl: profile.resumeUrl ?? profile.resume_url ?? null,
    };
  } catch (error) {
    console.error(error);
    return fallbackData.profile;
  }
}

export async function getProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured()) {
    return fallbackData.projects;
  }

  try {
    const rows = await supabaseSelect<ProjectRow[]>("projects", {
      query: "select=slug,title,year,blurb,stack,highlights,role,featured,repo,demo,images&order=sort_order.asc",
    });
    return rows.map((project) => ({
      ...project,
      images: project.images ?? undefined,
    }));
  } catch (error) {
    console.error(error);
    return fallbackData.projects;
  }
}

export async function getExperience(): Promise<ExperienceItem[]> {
  if (!isSupabaseConfigured()) {
    return fallbackData.experience;
  }

  try {
    return await supabaseSelect<ExperienceRow[]>("experience", {
      query: "select=role,company,location,period,bullets,tags&order=sort_order.asc",
    });
  } catch (error) {
    console.error(error);
    return fallbackData.experience;
  }
}

export async function getSkills(): Promise<SkillGroup[]> {
  if (!isSupabaseConfigured()) {
    return fallbackData.skills;
  }

  try {
    return await supabaseSelect<SkillRow[]>("skills", {
      query: "select=group,items&order=sort_order.asc",
    });
  } catch (error) {
    console.error(error);
    return fallbackData.skills;
  }
}

export async function getPortfolioData(): Promise<PortfolioData> {
  const [profile, projects, experience, skills] = await Promise.all([
    getProfile(),
    getProjects(),
    getExperience(),
    getSkills(),
  ]);

  return { profile, projects, experience, skills };
}
