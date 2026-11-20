'use client';

/**
 * Custom Image Loader that directly optimizes images via Cloudinary & Unsplash CDN,
 * bypassing Vercel's 5,000 image transformation monthly limit completely.
 */
export default function imageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  if (!src) return '';

  // 1. Cloudinary on-the-fly CDN transformation
  if (src.includes('res.cloudinary.com') && src.includes('/image/upload/')) {
    const q = quality ? `q_${quality}` : 'q_auto';
    // f_auto: deliver WebP/AVIF automatically based on browser
    // c_limit: scale down only if original is larger than requested width
    const transform = `f_auto,${q},c_limit,w_${width}`;

    const uploadIndex = src.indexOf('/image/upload/');
    if (uploadIndex !== -1) {
      const prefix = src.slice(0, uploadIndex + '/image/upload/'.length);
      const rest = src.slice(uploadIndex + '/image/upload/'.length);

      // Check if rest starts with existing transformation or version
      const isVersionOrFolder = /^v\d+\//.test(rest) || !/^[a-z]_[^/]+\//.test(rest);
      if (isVersionOrFolder) {
        return `${prefix}${transform}/${rest}`;
      } else {
        // Strip previous transformation flags and apply new ones
        return `${prefix}${transform}/${rest.replace(/^[a-z0-9_,]+\//, '')}`;
      }
    }
  }

  // 2. Unsplash on-the-fly CDN optimization
  if (src.includes('images.unsplash.com')) {
    try {
      const url = new URL(src);
      url.searchParams.set('w', width.toString());
      url.searchParams.set('auto', 'format');
      if (quality) {
        url.searchParams.set('q', quality.toString());
      }
      return url.toString();
    } catch {
      return src;
    }
  }

  // 3. Fallback for local files or other domains
  return src;
}
