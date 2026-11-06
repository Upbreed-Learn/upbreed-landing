import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

const BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? '').replace(/\/$/, '');

/**
 * Saves how far a student has watched a lesson.
 * Sends a small request every few seconds (the player decides how often) instead of keeping a
 * live WebSocket open, so it works on any host. Same shape as before so the players are unchanged.
 */
interface VideoProgressState {
  isConnected: boolean;
  error: string | null;
  isConnecting: boolean;
  currentToken: string | null;
  connect: (token: string, videoId: number) => void;
  disconnect: () => void;
  /** Saves at most every 10 seconds; pass `force` on pause/end to save straight away. */
  updateProgress: (videoId: number | string, position: number, force?: boolean) => void;
  clearError: () => void;
}

const SAVE_EVERY_MS = 10_000;
const lastSent = new Map<string, { at: number; position: number }>();

export const useVideoProgressStore = create<VideoProgressState>()(
  subscribeWithSelector((set, get) => ({
    isConnected: false,
    error: null,
    isConnecting: false,
    currentToken: null,

    connect: (token: string) => set({ currentToken: token, isConnected: Boolean(token), isConnecting: false, error: null }),

    disconnect: () => set({ isConnected: false, currentToken: null }),

    updateProgress: (videoId, position, force = false) => {
      const token = get().currentToken;
      if (!token || !BASE_URL || !Number.isFinite(position)) return;
      const key = String(videoId);
      const now = Date.now();
      const last = lastSent.get(key);
      if (!force && last && now - last.at < SAVE_EVERY_MS) return;
      if (last && Math.floor(position) === last.position) return;
      lastSent.set(key, { at: now, position: Math.floor(position) });
      fetch(`${BASE_URL}/course/video/${videoId}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ position: Math.max(0, Math.floor(position)) }),
        keepalive: true, // still sent if the tab is closing
      })
        .then(async r => {
          if (r.ok) return set({ error: null });
          const body = await r.json().catch(() => null);
          const msg = body?.message;
          set({ error: (Array.isArray(msg) ? msg.join(', ') : msg) || 'Could not save your progress' });
        })
        .catch(() => set({ error: 'Could not save your progress' }));
    },

    clearError: () => set({ error: null }),
  })),
);

export const useVideoProgressConnection = () =>
  useVideoProgressStore(state => ({
    isConnected: state.isConnected,
    isConnecting: state.isConnecting,
    error: state.error,
  }));

const connectAction = (token: string, videoId: number) => useVideoProgressStore.getState().connect(token, videoId);
const disconnectAction = () => useVideoProgressStore.getState().disconnect();
const updateProgressAction = (videoId: number, position: number) => useVideoProgressStore.getState().updateProgress(videoId, position);
const clearErrorAction = () => useVideoProgressStore.getState().clearError();

export const useVideoProgressActions = () => ({
  connect: connectAction,
  disconnect: disconnectAction,
  updateProgress: updateProgressAction,
  clearError: clearErrorAction,
});
