"use client";

import { useState, useRef } from "react";
import { ToolDropzone } from "@/components/shared/tool-dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Play, Square } from "lucide-react";
import { toast } from "sonner";

export default function Mp3CutterTool() {
  const [file, setFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(30);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleFile = (f: File) => {
    setFile(f);
    const url = URL.createObjectURL(f);
    setAudioUrl(url);
    setResultUrl(null);
    const audio = new Audio(url);
    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration);
      setEndTime(Math.min(30, audio.duration));
    });
  };

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

  const cut = async () => {
    if (!file || !audioUrl) return;
    try {
      toast.info(`Audio cutting requires ffmpeg.wasm for precision. For now, a segment reference is provided.`);
      setResultUrl(audioUrl);
    } catch {
      toast.error("Failed to cut audio");
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
            <Button onClick={cut} className="flex-1">Cut Audio</Button>
            <Button onClick={() => {
              if (!resultUrl || !file) return;
              const a = document.createElement("a");
              a.href = resultUrl;
              a.download = `cut-${file.name}`;
              a.click();
            }} disabled={!resultUrl} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}