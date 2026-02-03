import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface VideoProgressState {
  // Connection state
  isConnected: boolean;
  error: string | null;
  isConnecting: boolean;
  currentToken: string | null;

  // WebSocket instance (not persisted)
  ws: WebSocket | null;

  // Actions
  connect: (token: string) => void;
  disconnect: () => void;
  updateProgress: (videoId: number, position: number) => void;
  clearError: () => void;
}

export const useVideoProgressStore = create<VideoProgressState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    isConnected: false,
    error: null,
    isConnecting: false,
    currentToken: null,
    ws: null,

    connect: (token: string) => {
      const { isConnected, isConnecting } = get();
      // Don't connect if already connected or connecting
      if (isConnected || isConnecting) return;

      set({ isConnecting: true, error: null, currentToken: token });

      // Determine WebSocket URL based on environment
      const isProduction = process.env.NODE_ENV === 'production';
      const wsUrl = isProduction
        ? `${BASE_URL}?auth=${token}`
        : `${BASE_URL}?auth=${token}`;

      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        set({
          isConnected: true,
          isConnecting: false,
          error: null,
          ws,
        });
      };

      ws.onmessage = event => {
        try {
          const message = JSON.parse(event.data);

          if (message.event === 'progress_updated') {
            // You can emit events or update local state here if needed
          } else if (message.event === 'error') {
            set({ error: message.data.message });
          }
        } catch (err) {
          set({ error: 'Failed to parse server response' });
        }
      };

      ws.onerror = error => {
        console.error('WebSocket error:', error);
        set({
          error: 'WebSocket connection failed',
          isConnecting: false,
        });
      };

      ws.onclose = event => {
        set({
          isConnected: false,
          isConnecting: false,
          ws: null,
        });
        // Note: Automatic reconnection is handled by React components to avoid infinite loops
      };

      // Store the WebSocket instance
      set({ ws });
    },

    disconnect: () => {
      const { ws } = get();
      if (ws) {
        ws.close(1000, 'Client disconnecting');
      }
      set({
        isConnected: false,
        isConnecting: false,
        ws: null,
        error: null,
        currentToken: null,
      });
    },

    updateProgress: (videoId: string | number, position: number) => {
      const { ws, isConnected } = get();

      if (!isConnected || !ws || ws.readyState !== WebSocket.OPEN) {
        console.warn('WebSocket not connected, cannot update progress');
        return;
      }

      try {
        ws.send(
          JSON.stringify({
            event: 'update_progress',
            data: {
              videoId,
              position: Math.floor(position), // Ensure integer
            },
          }),
        );
      } catch (err) {
        console.error('Failed to send progress update:', err);
        set({ error: 'Failed to send progress update' });
      }
    },

    clearError: () => set({ error: null }),
  })),
);

// Selectors for common use cases
export const useVideoProgressConnection = () =>
  useVideoProgressStore(state => ({
    isConnected: state.isConnected,
    isConnecting: state.isConnecting,
    error: state.error,
  }));

// Action hooks that call store methods directly to avoid infinite loops
const connectAction = (token: string) =>
  useVideoProgressStore.getState().connect(token);
const disconnectAction = () => useVideoProgressStore.getState().disconnect();
const updateProgressAction = (videoId: number, position: number) =>
  useVideoProgressStore.getState().updateProgress(videoId, position);
const clearErrorAction = () => useVideoProgressStore.getState().clearError();

export const useVideoProgressActions = () => ({
  connect: connectAction,
  disconnect: disconnectAction,
  updateProgress: updateProgressAction,
  clearError: clearErrorAction,
});
