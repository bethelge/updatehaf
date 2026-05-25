import { Calendar, ExternalLink, Newspaper, Play } from "lucide-react";
import { MediaPreview } from "@/components/media-preview";
import { getLinkPlatform, linkPlatformLabel } from "@/lib/media";

export type CoverageItem = {
  id: string;
  title: string;
  description: string;
  media_type: string;
  file_url: string;
  youtube_link?: string;
  created_at: string;
};

function formatDate(value: string) {
  if (!value) return "";
  try {
    return new Date(value).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).toUpperCase();
  } catch {
    return "";
  }
}

function watchUrl(item: CoverageItem): string | null {
  if (item.media_type === "link") return item.file_url;
  if (item.youtube_link) return item.youtube_link;
  if (item.media_type === "video" && /^https?:\/\//i.test(item.file_url)) return item.file_url;
  return null;
}

function sourceLabel(item: CoverageItem) {
  if (item.media_type === "link" && item.file_url) {
    return linkPlatformLabel(getLinkPlatform(item.file_url));
  }
  if (item.youtube_link) return linkPlatformLabel(getLinkPlatform(item.youtube_link));
  if (item.media_type === "video") return "Video";
  if (item.media_type === "image") return "Press";
  return "Coverage";
}

function MediaFrame({
  item,
  className = "",
  showPlay = true,
}: {
  item: CoverageItem;
  className?: string;
  showPlay?: boolean;
}) {
  const external = watchUrl(item);
  const isWatchable = Boolean(external) || item.media_type === "video" || item.media_type === "link";

  return (
    <div className={`media-frame ${className}`}>
      <MediaPreview
        mediaType={item.media_type}
        mediaUrl={item.file_url}
        youtubeLink={item.youtube_link}
        title={item.title}
      />
      {showPlay && isWatchable && (
        <div className="media-frame-play" aria-hidden="true">
          <Play className="h-8 w-8 text-white fill-white/20" />
        </div>
      )}
    </div>
  );
}

export function FeaturedCoverage({ item }: { item: CoverageItem }) {
  const link = watchUrl(item);
  const date = formatDate(item.created_at);

  return (
    <article className="media-featured card-haf">
      <MediaFrame item={item} className="media-featured-media" />
      <div className="media-featured-body">
        <div className="media-meta">
          <span className="media-meta-item">
            <Newspaper className="h-3.5 w-3.5" />
            {sourceLabel(item)}
          </span>
          {date && (
            <span className="media-meta-item">
              <Calendar className="h-3.5 w-3.5" />
              {date}
            </span>
          )}
        </div>
        <h2 className="media-featured-title">{item.title}</h2>
        <p className="media-featured-desc">{item.description}</p>
        {link && (
          <a href={link} target="_blank" rel="noopener noreferrer" className="media-watch-link">
            Watch the story <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>
    </article>
  );
}

export function CoverageGridCard({ item }: { item: CoverageItem }) {
  const link = watchUrl(item);
  const date = formatDate(item.created_at);

  return (
    <article className="media-grid-card card-haf">
      <div className="media-grid-card-top">
        <span className="media-grid-badge">
          <Newspaper className="h-3 w-3" />
          {sourceLabel(item)}
        </span>
        <MediaFrame
          item={item}
          className="media-grid-frame"
          showPlay={Boolean(link) || item.media_type === "video" || item.media_type === "link"}
        />
      </div>
      <div className="media-grid-body">
        {date && <time className="media-grid-date">{date}</time>}
        <h3 className="media-grid-title">{item.title}</h3>
        <p className="media-grid-desc">{item.description}</p>
        {link && (
          <a href={link} target="_blank" rel="noopener noreferrer" className="media-watch-link media-watch-link--sm">
            Watch <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </article>
  );
}
