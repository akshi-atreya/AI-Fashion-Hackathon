export interface CaptureProvider {
  name: string;
  startCamera(videoElement: HTMLVideoElement, facingMode?: 'user' | 'environment'): Promise<MediaStream>;
  stopCamera(stream: MediaStream | null): void;
  captureFrame(videoElement: HTMLVideoElement): string;
  compressImage(file: File, maxDimension?: number): Promise<string>;
}

/**
 * VonageAndWebRTCCaptureProvider
 * Supports live camera video streaming, frame capture, and image compression.
 * Structured to integrate Vonage Video Client SDK sessions or browser getUserMedia.
 */
export class VonageAndWebRTCCaptureProvider implements CaptureProvider {
  public name = 'Vonage / WebRTC Camera Capture Provider';

  async startCamera(
    videoElement: HTMLVideoElement,
    facingMode: 'user' | 'environment' = 'user'
  ): Promise<MediaStream> {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Camera access is not supported on this browser/device.');
    }

    const constraints: MediaStreamConstraints = {
      video: {
        facingMode,
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    videoElement.srcObject = stream;
    await videoElement.play();
    return stream;
  }

  stopCamera(stream: MediaStream | null): void {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  }

  captureFrame(videoElement: HTMLVideoElement): string {
    const canvas = document.createElement('canvas');
    const width = videoElement.videoWidth || 640;
    const height = videoElement.videoHeight || 480;

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not initialize canvas context for frame capture.');

    // Mirror horizontal if facing user
    ctx.translate(width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(videoElement, 0, 0, width, height);

    return canvas.toDataURL('image/jpeg', 0.88);
  }

  compressImage(file: File, maxDimension: number = 1024): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(e.target?.result as string);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}

export const captureProvider = new VonageAndWebRTCCaptureProvider();
