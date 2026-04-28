export type ProfileStat = {
  value: string;
  label: string;
};

export type Profile = {
  name: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  tagline: string;
  about: string[];
  stats: ProfileStat[];
  education: string[];
  awards: string[];
};

export type Project = {
  slug: string;
  title: string;
  year: string;
  blurb: string;
  stack: string[];
  highlights: string[];
  role: string;
  featured: boolean;
  repo?: string | null;
  demo?: string | null;
  images?: string[];
};

export type ExperienceItem = {
  role: string;
  company: string;
  location: string;
  period: string;
  bullets: string[];
  tags: string[];
};

export type SkillGroup = {
  group: string;
  items: string[];
};

export type PortfolioData = {
  profile: Profile;
  projects: Project[];
  experience: ExperienceItem[];
  skills: SkillGroup[];
};
