import { ArrowLeft, Download, ExternalLink, FileText } from "lucide-react";
import Link from "next/link";
import { getProfile } from "@/server/portfolio";

export const metadata = {
  title: "Resume | Prakhar Nagpal",
  description: "View and download Prakhar Nagpal's resume.",
};

function getGoogleDriveFileId(url: string) {
  const patterns = [
    /\/file\/d\/([^/]+)/,
    /[?&]id=([^&]+)/,
    /\/document\/d\/([^/]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);

    if (match?.[1]) {
      return match[1];
    }
  }

  return null;
}

function getResumeLinks(url?: string | null) {
  if (!url) {
    return null;
  }

  const fileId = getGoogleDriveFileId(url);

  if (!fileId) {
    return {
      preview: url,
      open: url,
      download: url,
    };
  }

  return {
    preview: `https://drive.google.com/file/d/${fileId}/preview`,
    open: url,
    download: `https://drive.google.com/uc?export=download&id=${fileId}`,
  };
}

export default async function ResumePage() {
  const profile = await getProfile();
  const resume = getResumeLinks(profile.resumeUrl);

  return (
    <main className="min-h-screen bg-bg text-fg">
      <header className="border-b border-border bg-bg/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <Link
              href="/"
              className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-fg-muted hover:text-fg"
            >
              <ArrowLeft size={16} />
              Home
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-bg-elev text-accent">
                <FileText size={18} />
              </div>
              <div className="min-w-0">
                <h1 className="truncate text-2xl font-semibold tracking-tight">Resume</h1>
                <p className="text-sm text-fg-muted">Prakhar Nagpal</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {resume ? (
              <>
                <a
                  href={resume.open}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-bg-elev px-4 text-sm font-medium text-fg"
                >
                  <ExternalLink size={16} />
                  Open
                </a>
                <a
                  href={resume.download}
                  className="inline-flex h-10 items-center gap-2 rounded-md bg-fg px-4 text-sm font-semibold text-bg"
                >
                  <Download size={16} />
                  Download
                </a>
              </>
            ) : null}
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-5">
        <div className="h-[calc(100vh-9rem)] min-h-[34rem] overflow-hidden rounded-md border border-border bg-bg-elev">
          {resume ? (
            <iframe
              src={resume.preview}
              className="h-full w-full"
              title="Resume PDF viewer"
              allow="autoplay"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
              <FileText size={36} className="text-accent" />
              <div>
                <h2 className="text-lg font-semibold">Resume link is not configured</h2>
                <p className="mt-2 max-w-md text-sm leading-6 text-fg-muted">
                  Add a public Google Drive resume link in the admin profile editor.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
