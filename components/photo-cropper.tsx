'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

const VIEW = 260; // size of the circle on screen (px)
const OUT = 800; // saved photo is OUT × OUT: sharp on any screen, small enough to load fast

type Pos = { x: number; y: number }; // image centre offset from circle centre, in screen px

/**
 * Lets someone frame their profile photo in a circle before it's uploaded.
 * Starts with the face centred (the browser's face detector where available, otherwise a little
 * above the middle, where faces usually are), then they can drag and zoom.
 * Returns a square JPEG; large photos are scaled down, small ones are never scaled up past their size.
 */
export default function PhotoCropper({ file, onCancel, onDone }: { file: File | null; onCancel: () => void; onDone: (cropped: File) => void }) {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pos, setPos] = useState<Pos>({ x: 0, y: 0 });
  const drag = useRef<{ startX: number; startY: number; from: Pos } | null>(null);

  // Load the picked file and choose a starting frame.
  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = async () => {
      setImg(image);
      const start = await startingFrame(image);
      setZoom(start.zoom);
      setPos(start.pos);
    };
    image.onerror = () => {
      toast.error('Could not open that photo', { description: 'Try a JPG or PNG.' });
      onCancel();
    };
    image.src = url;
    return () => URL.revokeObjectURL(url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  // Scale at zoom 1: the image just covers the circle.
  const base = img ? VIEW / Math.min(img.naturalWidth, img.naturalHeight) : 1;
  const scale = base * zoom;
  const w = img ? img.naturalWidth * scale : 0;
  const h = img ? img.naturalHeight * scale : 0;
  // Never let the image leave a gap inside the circle.
  const clamp = (p: Pos, s = scale): Pos => {
    if (!img) return p;
    const mx = Math.max(0, (img.naturalWidth * s - VIEW) / 2);
    const my = Math.max(0, (img.naturalHeight * s - VIEW) / 2);
    return { x: Math.min(mx, Math.max(-mx, p.x)), y: Math.min(my, Math.max(-my, p.y)) };
  };

  async function startingFrame(image: HTMLImageElement): Promise<{ pos: Pos; zoom: number }> {
    const base0 = VIEW / Math.min(image.naturalWidth, image.naturalHeight);
    let s = base0;
    const centreOn = (cx: number, cy: number) => {
      // Move so that image point (cx, cy) sits at the circle centre.
      const p = { x: (image.naturalWidth / 2 - cx) * s, y: (image.naturalHeight / 2 - cy) * s };
      const mx = Math.max(0, (image.naturalWidth * s - VIEW) / 2);
      const my = Math.max(0, (image.naturalHeight * s - VIEW) / 2);
      return { x: Math.min(mx, Math.max(-mx, p.x)), y: Math.min(my, Math.max(-my, p.y)) };
    };
    // Chrome/Edge can detect faces on-device on some systems; nothing is sent anywhere.
    const FD = (window as unknown as { FaceDetector?: new (o?: object) => { detect: (i: CanvasImageSource) => Promise<{ boundingBox: DOMRectReadOnly }[]> } }).FaceDetector;
    if (FD) {
      try {
        const faces = await new FD({ fastMode: true, maxDetectedFaces: 1 }).detect(image);
        if (faces[0]) {
          const b = faces[0].boundingBox;
          // Zoom so the face fills about half the circle.
          const zoom = Math.min(4, Math.max(1, (VIEW * 0.5) / (b.width * base0)));
          s = base0 * zoom;
          return { zoom, pos: centreOn(b.x + b.width / 2, b.y + b.height / 2) };
        }
      } catch {
        /* fall through to the usual guess */
      }
    }
    // Portrait photos: faces are usually in the upper part. Landscape: the middle.
    const tall = image.naturalHeight > image.naturalWidth * 1.05;
    const zoom = tall ? 1.5 : 1;
    s = base0 * zoom;
    return { zoom, pos: centreOn(image.naturalWidth / 2, tall ? image.naturalHeight * 0.33 : image.naturalHeight / 2) };
  }

  const setZoomKeep = (z: number) => {
    const nz = Math.min(4, Math.max(1, z));
    setZoom(nz);
    setPos(p => clamp({ x: (p.x * nz) / zoom, y: (p.y * nz) / zoom }, base * nz));
  };

  const save = () => {
    if (!img || !file) return;
    // The square of the image that sits inside the circle, in image pixels.
    const side = VIEW / scale;
    const sx = img.naturalWidth / 2 - pos.x / scale - side / 2;
    const sy = img.naturalHeight / 2 - pos.y / scale - side / 2;
    const out = Math.round(Math.min(OUT, side)); // don't upscale small photos (keeps them sharp)
    const canvas = document.createElement('canvas');
    canvas.width = out;
    canvas.height = out;
    const ctx = canvas.getContext('2d')!;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, sx, sy, side, side, 0, 0, out, out);
    canvas.toBlob(blob => blob && onDone(new File([blob], 'profile.jpg', { type: 'image/jpeg' })), 'image/jpeg', 0.92);
  };

  return (
    <Dialog open={Boolean(file)} onOpenChange={o => !o && onCancel()}>
      <DialogContent className="custom-font text-[#00230F] sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Position your photo</DialogTitle>
          <DialogDescription>Drag to move it, and zoom so your face fills the circle.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-5">
          <div
            className="relative cursor-grab touch-none overflow-hidden rounded-full bg-[#E8F0E4] ring-4 ring-[#D0EA50] active:cursor-grabbing"
            style={{ width: VIEW, height: VIEW }}
            onPointerDown={e => {
              (e.target as HTMLElement).setPointerCapture(e.pointerId);
              drag.current = { startX: e.clientX, startY: e.clientY, from: pos };
            }}
            onPointerMove={e => {
              if (!drag.current) return;
              setPos(clamp({ x: drag.current.from.x + e.clientX - drag.current.startX, y: drag.current.from.y + e.clientY - drag.current.startY }));
            }}
            onPointerUp={() => (drag.current = null)}
            onWheel={e => setZoomKeep(zoom - e.deltaY * 0.0015)}
          >
            {img && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={img.src}
                alt=""
                draggable={false}
                className="pointer-events-none absolute max-w-none select-none"
                style={{ width: w, height: h, left: VIEW / 2 - w / 2 + pos.x, top: VIEW / 2 - h / 2 + pos.y }}
              />
            )}
          </div>
          <div className="flex w-full items-center gap-3">
            <ZoomOut className="size-4 shrink-0 text-[#737373]" />
            <input
              type="range"
              min={1}
              max={4}
              step={0.01}
              value={zoom}
              onChange={e => setZoomKeep(Number(e.target.value))}
              aria-label="Zoom"
              className="w-full accent-[#305B43]"
            />
            <ZoomIn className="size-4 shrink-0 text-[#737373]" />
          </div>
          <div className="flex w-full gap-3">
            <Button variant="outline" className="flex-1" onClick={onCancel}>
              Cancel
            </Button>
            <Button className="flex-1" disabled={!img} onClick={save}>
              Save photo
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
