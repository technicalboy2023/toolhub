"use client";

import { useState, useRef, useEffect } from "react";
import { ToolDropzone } from "@/components/shared/tool-dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Play, Square } from "lucide-react";
import { toast } from "sonner";
import { encodeWAV } from "../utils/wav-encoder";

export default function Mp3CutterTool() {
  const [file, setFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(30);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [buffer, setBuffer] = useState<ArrayBuffer | null>(null);
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate simplified waveform data for visualization
  const generateWaveformData = (audioBuffer: AudioBuffer): Promise<number[]> => {
    return new Promise((resolve) => {
      const channelData = audioBuffer.getChannelData(0); // Use first channel
      const samples = channelData.length;
      const numPoints = 100; // Number of points to display
      const step = Math.floor(samples / numPoints);
      const waveform: number[] = [];

      for (let i = 0; i < samples; i += step) {
        let sum = 0;
        for (let j = 0; j < step && i + j < samples; j++) {
          sum += Math.abs(channelData[i + j]);
        }
        waveform.push(sum / step);
      }

      // Normalize to 0-1 range
      const max = Math.max(...waveform);
      if (max > 0) {
        waveform.forEach((val, i) => {
          waveform[i] = val / max;
        });
      }

      resolve(waveform);
    });
  };

  // Draw waveform on canvas
  const drawWaveform = () => {
    const canvas = canvasRef.current;
    if (!canvas || waveformData.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 20;
    const plotWidth = width - 2 * padding;
    const plotHeight = height - 2 * padding;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw grid lines (optional)
    ctx.strokeStyle = '#e5e5e5';
    ctx.lineWidth = 1;
    for (let i = 1; i < 5; i++) {
      const y = padding + (plotHeight * i) / 5;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Draw waveform
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();

    const sliceStart = Math.floor((startTime / duration) * waveformData.length);
    const sliceEnd = Math.floor((endTime / duration) * waveformData.length);

    waveformData.forEach((value, index) => {
      const x = padding + (index / waveformData.length) * plotWidth;
      const y = height - padding - value * (plotHeight * 0.8); // Invert Y and scale

      if (index === sliceStart) {
        ctx.moveTo(x, y);
      } else if (index >= sliceStart && index <= sliceEnd) {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Highlight selected slice
    ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
    ctx.beginPath();
    waveformData.forEach((value, index) => {
      const x = padding + (index / waveformData.length) * plotWidth;
      const y = height - padding - value * (plotHeight * 0.8);

      if (index === sliceStart) {
        ctx.moveTo(x, height - padding);
      }
      if (index >= sliceStart && index <= sliceEnd) {
        ctx.lineTo(x, y);
      }
    });
    ctx.lineTo(
      padding + (sliceEnd / waveformData.length) * plotWidth,
      height - padding
    );
    ctx.lineTo(
      padding + (sliceEnd / waveformData.length) * plotWidth,
      height
    );
    ctx.lineTo(
      padding + (sliceStart / waveformData.length) * plotWidth,
      height
    );
    ctx.closePath();
    ctx.fill();
  };

  const handleFile = async (f: File) => {
    setFile(f);
    const url = URL.createObjectURL(f);
    setAudioUrl(url);
    setResultUrl(null);

    // Load audio buffer for waveform and processing
    const arrayBuffer = await f.arrayBuffer();
    setBuffer(arrayBuffer);

    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    setDuration(audioBuffer.duration);
    setEndTime(Math.min(30, audioBuffer.duration));

    // Generate waveform data for visualization
    generateWaveformData(audioBuffer).then((data) => {
      setWaveformData(data);
    });

    const audio = new Audio(url);
    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration);
      setEndTime(Math.min(30, audio.duration));
    });
  };

// Draw waveform when data changes
useEffect(() => {
  drawWaveform();
}, [waveformData, startTime, endTime, duration]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.currentTime = startTime;
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const cutAudio = async () => {
    if (!file || !buffer) return;

    try {
      // Decode audio file
      const audioCtx = new AudioContext();
      const audioBuffer = await audioCtx.decodeAudioData(buffer);

      // Slice audio using OfflineAudioContext
      const sliceDuration = endTime - startTime;
      const offlineCtx = new OfflineAudioContext(
        audioBuffer.numberOfChannels,
        sliceDuration * audioBuffer.sampleRate,
        audioBuffer.sampleRate
      );

      const source = offlineCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(offlineCtx.destination);
      source.start(0, startTime, sliceDuration); // start at startTime, play for sliceDuration
      const renderedBuffer = await offlineCtx.startRendering();

      // Convert to WAV using our encoder
      const wavBlob = encodeWAV(renderedBuffer);
      setResultUrl(URL.createObjectURL(wavBlob));

      toast.success("Audio cut successfully!");
    } catch (error) {
      console.error("Audio cutting error:", error);
      toast.error("Failed to cut audio. Please try again.");
    }
  };

  const reset = () => {
    setStartTime(0);
    setEndTime(Math.min(30, duration));
    if (resultUrl) {
      URL.revokeObjectURL(resultUrl);
      setResultUrl(null);
    }
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
      setFile(null);
    }
    if (buffer) {
      setBuffer(null);
      setWaveformData([]);
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <ToolDropzone onFile={handleFile} accept="audio/*" label="Drop an audio file to cut" />
      ) : (
        <div className="space-y-4">
          {audioUrl && (
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} className="hidden" />
          )}
          <p className="text-sm text-muted-foreground">{file.name} (duration: {formatTime(duration)})</p>

          <div className="space-y-4">
            <canvas
              ref={canvasRef}
              className="waveform w-full h-24 bg-muted rounded"
              width={800}
              height={100}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Start: {formatTime(startTime)}</label>
              <Input type="range" min={0} max={Math.max(0, duration - 1)} value={startTime} onChange={(e) => setStartTime(Number(e.target.value))} className="w-full" />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">End: {formatTime(endTime)}</label>
              <Input type="range" min={1} max={duration || 1} value={endTime} onChange={(e) => setEndTime(Number(e.target.value))} className="w-full" />
            </div>
          </div>

          <Button variant="outline" onClick={togglePlayPause} className="w-full gap-2">
            {isPlaying ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isPlaying ? "Stop Preview" : "Preview Selection"}
          </Button>

          <div className="flex gap-2">
            <Button onClick={cutAudio} className="flex-1 btn-primary">
              Cut Audio
            </Button>
            <Button onClick={reset} className="btn-secondary gap-2">
              <Square className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}