import placeholderImage from "@/assets/placeholder-image.png";
import { buildUrl } from "@/lib/http";

function resolveProductImageSrc(
  imageUrl: string | null | undefined,
  version?: string | null,
) {
  if (!imageUrl?.trim()) {
    return placeholderImage;
  }

  if (!version) {
    return imageUrl;
  }

  if (imageUrl.startsWith("blob:")) {
    return imageUrl;
  }

  const normalizedImageUrl =
    imageUrl.startsWith("http://") ||
    imageUrl.startsWith("https://") ||
    imageUrl.startsWith("data:")
      ? imageUrl
      : buildUrl(imageUrl);
  const separator = normalizedImageUrl.includes("?") ? "&" : "?";
  return `${normalizedImageUrl}${separator}v=${encodeURIComponent(version)}`;
}

type ProductImageProps = {
  alt: string;
  imageUrl: string | null | undefined;
  className?: string;
  version?: string | null;
};

export function ProductImage({
  alt,
  imageUrl,
  className,
  version,
}: ProductImageProps) {
  return (
    <img
      alt={alt}
      className={className}
      onError={(event) => {
        if (event.currentTarget.src !== placeholderImage) {
          event.currentTarget.src = placeholderImage;
        }
      }}
      src={resolveProductImageSrc(imageUrl, version)}
    />
  );
}
