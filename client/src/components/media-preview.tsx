import { ExternalLink, Play } from "lucide-react";
import { tradeAssetUrl } from "@/lib/api";
import {
  getLinkPlatform,
  getYouTubeEmbedId,
  linkPlatformLabel,
  type MediaPlatform,
} from "@/lib/media";

type Props = {
  mediaType: string;
  mediaUrl: string;
  youtubeLink?: string | null;
  title?: string;
  className?: string;
};

function ExternalLinkCard({ url, platform }: { url: string; platform: MediaPlatform }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center justify-center gap-3 w-full h-full min-h-[180px] p-6 text-center transition-colors"
      style={{ background: "linear-gradient(145deg, var(--tint-blue), var(--muted))" }}
    >
      <span
        className="inline-flex items-center justify-center w-14 h-14 rounded-full text-white"
        style={{ background: "var(--gradient-brand-soft)" }}
      >
        <Play className="h-7 w-7 ml-0.5" />
      </span>
      <span className="font-semibold text-navy font-sans">Watch on {linkPlatformLabel(platform)}</span>
      <span className="text-xs text-label inline-flex items-center gap-1">
        Open link <ExternalLink className="h-3 w-3" />
      </span>
    </a>
  );
}

export function MediaPreview({ mediaType, mediaUrl, youtubeLink, title, className = "" }: Props) {
  const asset = tradeAssetUrl(mediaUrl);
  const isLink = mediaType === "link";
  const externalUrl = isLink ? asset : youtubeLink || "";
  const platform = externalUrl ? getLinkPlatform(externalUrl) : null;
  const ytId = externalUrl ? getYouTubeEmbedId(externalUrl) : null;

  if (isLink) {
    const url = asset;
    if (ytId) {
      return (
        <iframe
          title={title || "Embedded video"}
          src={`https://www.youtube.com/embed/${ytId}`}
          className={`w-full h-full border-0 ${className}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    }
    return (
      <div className={`w-full h-full ${className}`}>
        <ExternalLinkCard url={url} platform={platform ?? "other"} />
      </div>
    );
  }

  if (mediaType === "video") {
    return <video src={asset} controls className={`w-full h-full object-cover ${className}`} />;
  }

  return <img src={asset} alt={title || ""} className={`w-full h-full object-cover ${className}`} />;
}
