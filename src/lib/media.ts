const CDN = "https://res.cloudinary.com/dgqocqvf6";

// Converts old relative paths (stored in DB before Cloudinary migration) to full CDN URLs.
// Absolute URLs pass through unchanged.
export function normalizeMediaUrl(url: string): string {
  if (!url) return url;
  // HTML files (yehuda360 viewers) always served from public/ regardless of stored URL format
  if (/\.html?$/i.test(url)) {
    const filename = url.split("/").pop();
    return `/yehuda360/${filename}`;
  }
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const path = url.startsWith("/") ? url : `/${url}`;
  const isVideo = /\.(mp4|mov|webm|avi|ogg)/i.test(path);
  return `${CDN}/${isVideo ? "video" : "image"}/upload/traceon${path}`;
}

export const VIDEOS = {
  hero:           `${CDN}/video/upload/traceon/videos/3rdd.mp4`,
  display:        `${CDN}/video/upload/traceon/videos/display.mp4`,
  fallingDiamonds:`${CDN}/video/upload/traceon/videos/falling-diamonds.mp4`,
  journey:        `${CDN}/video/upload/traceon/journey/full-journey.mp4`,
  laser:          `${CDN}/video/upload/v1780057399/traceon/laser/laser.mp4`,
  bruting:        `${CDN}/video/upload/v1780056144/traceon/bruting/bruting.mp4`,
  polishing:      `${CDN}/video/upload/v1780120905/traceon/polishing/polishing.mp4`,
  grading:        `${CDN}/video/upload/v1780113456/traceon/grading/grading.mp4`,
  planning: {
    "ABM834-1": `${CDN}/video/upload/traceon/planning-videos/ABM834-1.mp4`,
    "ABT077-1": `${CDN}/video/upload/traceon/planning-videos/ABT077-1.mp4`,
    "ABT913-1": `${CDN}/video/upload/traceon/planning-videos/ABT913-1.mp4`,
    "ABU068-1": `${CDN}/video/upload/traceon/planning-videos/ABU068-1.mp4`,
    "ABY615-1": `${CDN}/video/upload/traceon/planning-videos/ABY615-1.mp4`,
    "ABY834-1": `${CDN}/video/upload/traceon/planning-videos/ABY834-1.mp4`,
  },
  final: {
    "ABM834-1": `${CDN}/video/upload/traceon/videos/ABM834-1.mp4`,
    "ABS441-1": `${CDN}/video/upload/traceon/videos/ABS441-1.mp4`,
    "ABT077-1": `${CDN}/video/upload/traceon/videos/ABT077-1.mp4`,
    "ABT913-1": `${CDN}/video/upload/traceon/videos/ABT913-1.mp4`,
    "ABU068-1": `${CDN}/video/upload/traceon/videos/ABU068-1.mp4`,
    "ABY615-1": `${CDN}/video/upload/traceon/videos/ABY615-1.mp4`,
    "ABY664-1": `${CDN}/video/upload/traceon/videos/ABY664-1.mp4`,
  },
} as const;

export const IMAGES = {
  transparentDiamond: `${CDN}/image/upload/traceon/images/transparent_diamond.png`,
  lineArtDiamond:     `${CDN}/image/upload/traceon/images/line_art_diamond.jpg`,
  realisticDiamond:   `${CDN}/image/upload/traceon/images/realistic_diamond.jpg`,
  roughDiamondsPile:  `${CDN}/image/upload/traceon/images/rough_diamonds_pile.jpg`,
  diamonds: {
    "TN4003215": {
      rough:    `${CDN}/image/upload/v1780142823/traceon/diamonds/RGH-26-011/img11.jpg`,
      polished: `${CDN}/image/upload/v1780142824/traceon/diamonds/RGH-26-011/img12.jpg`,
    },
    "RGH-26-011": {
      rough:    `${CDN}/image/upload/v1780142823/traceon/diamonds/RGH-26-011/img11.jpg`,
      polished: `${CDN}/image/upload/v1780142824/traceon/diamonds/RGH-26-011/img12.jpg`,
    },
    "TN0133859": {
      rough:    `${CDN}/image/upload/v1780143490/traceon/diamonds/RGH-26-012/img1.jpg`,
      polished: `${CDN}/image/upload/v1780143492/traceon/diamonds/RGH-26-012/img2.jpg`,
    },
    "RGH-26-012": {
      rough:    `${CDN}/image/upload/v1780143490/traceon/diamonds/RGH-26-012/img1.jpg`,
      polished: `${CDN}/image/upload/v1780143492/traceon/diamonds/RGH-26-012/img2.jpg`,
    },
    "TN0133955": {
      rough:    `${CDN}/image/upload/v1780143677/traceon/diamonds/RGH-26-013/img1.jpg`,
      polished: `${CDN}/image/upload/v1780143678/traceon/diamonds/RGH-26-013/img2.jpg`,
    },
    "RGH-26-013": {
      rough:    `${CDN}/image/upload/v1780143677/traceon/diamonds/RGH-26-013/img1.jpg`,
      polished: `${CDN}/image/upload/v1780143678/traceon/diamonds/RGH-26-013/img2.jpg`,
    },
    "TN0133752": {
      rough:    `${CDN}/image/upload/v1780144772/traceon/diamonds/RGH-26-014/img1.jpg`,
      polished: `${CDN}/image/upload/v1780144774/traceon/diamonds/RGH-26-014/img2.jpg`,
    },
    "RGH-26-014": {
      rough:    `${CDN}/image/upload/v1780144772/traceon/diamonds/RGH-26-014/img1.jpg`,
      polished: `${CDN}/image/upload/v1780144774/traceon/diamonds/RGH-26-014/img2.jpg`,
    },
    "TN0133667": {
      rough:    `${CDN}/image/upload/v1780145837/traceon/diamonds/RGH-26-015/img1.jpg`,
      polished: `${CDN}/image/upload/v1780145840/traceon/diamonds/RGH-26-015/img2.jpg`,
    },
    "RGH-26-015": {
      rough:    `${CDN}/image/upload/v1780145837/traceon/diamonds/RGH-26-015/img1.jpg`,
      polished: `${CDN}/image/upload/v1780145840/traceon/diamonds/RGH-26-015/img2.jpg`,
    },
  },
} as const;
