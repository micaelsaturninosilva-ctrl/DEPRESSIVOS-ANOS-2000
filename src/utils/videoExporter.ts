import { toCanvas } from 'html-to-image';

export interface VideoExportOptions {
  durationSeconds: number; // e.g. 5, 10, 15, 30
  fps?: number; // default 30
  targetWidth?: number; // default 1080
  targetHeight?: number; // default 1080 (or 1920 for stories)
  format?: 'mp4' | 'webm';
  includeAudio?: boolean;
  audioUrl?: string | null;
  bitrate?: number; // default 8_000_000 (8 Mbps)
  onProgress?: (progress: number, message: string) => void;
}

export interface VideoExportResult {
  blob: Blob;
  url: string;
  filename: string;
  format: 'mp4' | 'webm';
  durationSeconds: number;
}

/**
 * Detect best supported MIME type for video recording in the browser
 */
export function getSupportedVideoMimeType(preferredFormat: 'mp4' | 'webm' = 'mp4'): {
  mimeType: string;
  extension: 'mp4' | 'webm';
} {
  if (typeof MediaRecorder === 'undefined') {
    return { mimeType: 'video/webm', extension: 'webm' };
  }

  const mp4Types = [
    'video/mp4;codecs=avc1.42E01E,mp4a.40.2',
    'video/mp4;codecs=avc1,mp4a.40.2',
    'video/mp4;codecs=avc1',
    'video/mp4;codecs=h264',
    'video/mp4',
  ];

  const webmTypes = [
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm;codecs=h264,opus',
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm',
  ];

  const preferredList = preferredFormat === 'mp4' ? [...mp4Types, ...webmTypes] : [...webmTypes, ...mp4Types];

  for (const type of preferredList) {
    if (MediaRecorder.isTypeSupported(type)) {
      const ext = type.startsWith('video/mp4') ? 'mp4' : 'webm';
      return { mimeType: type, extension: ext };
    }
  }

  return { mimeType: 'video/webm', extension: 'webm' };
}

/**
 * Record and Export DOM node as MP4/WebM Video with optional background audio
 */
export async function exportNodeToVideo(
  node: HTMLElement,
  options: VideoExportOptions
): Promise<VideoExportResult> {
  const {
    durationSeconds = 5,
    fps = 30,
    targetWidth = 1080,
    targetHeight = 1080,
    preferredFormat = 'mp4',
    includeAudio = true,
    audioUrl = null,
    bitrate = 8_000_000,
    onProgress,
  } = { ...options, preferredFormat: options.format || 'mp4' };

  onProgress?.(0, 'Iniciando motor de renderização de vídeo...');

  // 1. Setup Offscreen Canvas
  const exportCanvas = document.createElement('canvas');
  exportCanvas.width = targetWidth;
  exportCanvas.height = targetHeight;
  const ctx = exportCanvas.getContext('2d', { alpha: false });
  if (!ctx) throw new Error('Não foi possível inicializar o contexto 2D do canvas');

  // Fill default background
  ctx.fillStyle = '#0F1116';
  ctx.fillRect(0, 0, targetWidth, targetHeight);

  // 2. Setup Canvas Stream
  const canvasStream = exportCanvas.captureStream(fps);

  // 3. Setup Audio Stream (if audio is provided & enabled)
  let audioContext: AudioContext | null = null;
  let audioElement: HTMLAudioElement | null = null;
  let audioSourceNode: MediaElementAudioSourceNode | null = null;

  if (includeAudio && audioUrl) {
    try {
      onProgress?.(5, 'Carregando trilha de áudio...');
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioContext = new AudioCtxClass();
      
      const audioDestination = audioContext.createMediaStreamDestination();

      audioElement = new Audio();
      audioElement.crossOrigin = 'anonymous';
      audioElement.src = audioUrl;
      audioElement.preload = 'auto';

      await new Promise<void>((resolve, reject) => {
        if (!audioElement) return reject(new Error('Audio element não inicializado'));
        
        const timeout = setTimeout(() => {
          console.warn('Timeout ao carregar áudio, prosseguindo sem áudio');
          resolve();
        }, 6000);

        audioElement.oncanplaythrough = () => {
          clearTimeout(timeout);
          resolve();
        };
        audioElement.onerror = () => {
          clearTimeout(timeout);
          console.warn('Erro ao carregar URL de áudio para exportação, prosseguindo sem áudio');
          resolve();
        };
      });

      if (audioElement && audioContext) {
        audioSourceNode = audioContext.createMediaElementSource(audioElement);
        // Connect to destination stream AND master output
        audioSourceNode.connect(audioDestination);

        const audioTracks = audioDestination.stream.getAudioTracks();
        if (audioTracks.length > 0) {
          canvasStream.addTrack(audioTracks[0]);
        }
      }
    } catch (audioErr) {
      console.warn('Aviso: Falha ao integrar áudio no vídeo:', audioErr);
    }
  }

  // 4. Setup MediaRecorder
  const { mimeType, extension } = getSupportedVideoMimeType(preferredFormat);
  const recordedChunks: Blob[] = [];

  const mediaRecorder = new MediaRecorder(canvasStream, {
    mimeType,
    videoBitsPerSecond: bitrate,
  });

  mediaRecorder.ondataavailable = (event) => {
    if (event.data && event.data.size > 0) {
      recordedChunks.push(event.data);
    }
  };

  // 5. Start Recording
  mediaRecorder.start(100); // 100ms time slice for smoother chunking

  // Play audio in sync if available
  if (audioElement && audioContext && audioContext.state === 'suspended') {
    await audioContext.resume();
  }
  if (audioElement) {
    audioElement.currentTime = 0;
    audioElement.play().catch((e) => console.warn('Erro ao dar play no áudio durante gravação:', e));
  }

  // 6. Capture Frames sequentially
  const totalFrames = Math.max(1, Math.round(durationSeconds * fps));
  const frameIntervalMs = 1000 / fps;

  // Temporarily reset transform on node to render full 1080p
  const originalTransform = node.style.transform;
  node.style.transform = 'scale(1)';

  try {
    for (let frameIndex = 0; frameIndex < totalFrames; frameIndex++) {
      const progressPercent = Math.round(10 + (frameIndex / totalFrames) * 85);
      const currentSec = (frameIndex / fps).toFixed(1);
      onProgress?.(
        progressPercent,
        `Renderizando frame ${frameIndex + 1}/${totalFrames} (${currentSec}s / ${durationSeconds}s)...`
      );

      // Render DOM node to offscreen canvas
      const frameCanvas = await toCanvas(node, {
        quality: 0.95,
        pixelRatio: 1,
        cacheBust: false,
        width: targetWidth,
        height: targetHeight,
      });

      // Draw onto master recording canvas
      ctx.clearRect(0, 0, targetWidth, targetHeight);
      ctx.drawImage(frameCanvas, 0, 0, targetWidth, targetHeight);

      // Delay to respect FPS cadence
      await new Promise((resolve) => setTimeout(resolve, Math.max(5, frameIntervalMs * 0.4)));
    }
  } finally {
    // Restore preview transform
    node.style.transform = originalTransform;
  }

  onProgress?.(96, 'Finalizando compressão e codificando arquivo de vídeo...');

  // 7. Stop Recording and Finalize Blob
  const exportPromise = new Promise<Blob>((resolve, reject) => {
    mediaRecorder.onstop = () => {
      try {
        const finalBlob = new Blob(recordedChunks, { type: mimeType });
        resolve(finalBlob);
      } catch (err) {
        reject(err);
      }
    };
    mediaRecorder.onerror = (e) => reject(e);
  });

  mediaRecorder.stop();

  // Cleanup audio
  if (audioElement) {
    audioElement.pause();
    audioElement.src = '';
  }
  if (audioContext && audioContext.state !== 'closed') {
    audioContext.close().catch(() => {});
  }

  const finalBlob = await exportPromise;
  const url = URL.createObjectURL(finalBlob);
  const filename = `depressivos2000-video-${Date.now()}.${extension}`;

  onProgress?.(100, 'Vídeo gerado com sucesso!');

  return {
    blob: finalBlob,
    url,
    filename,
    format: extension,
    durationSeconds,
  };
}
