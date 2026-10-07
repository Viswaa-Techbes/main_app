"use client";

import React, { useState, useRef, useEffect } from "react";
import { Mic, Square, Trash2, Play, Pause, RefreshCw, Volume2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VoiceNoteRecorderProps {
  onVoiceNoteRecorded: (voiceNoteData: {
    url: string;
    duration: number;
    filename: string;
    mimeType: string;
  } | null) => void;
}

export function VoiceNoteRecorder({ onVoiceNoteRecorded }: VoiceNoteRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [permissionSupported, setPermissionSupported] = useState(true);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia)) {
      setPermissionSupported(false);
    }
  }, []);

  // Timer while recording
  useEffect(() => {
    if (isRecording) {
      setRecordingDuration(0);
      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      let mimeType = "audio/webm";
      if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
        mimeType = "audio/webm;codecs=opus";
      } else if (MediaRecorder.isTypeSupported("audio/ogg;codecs=opus")) {
        mimeType = "audio/ogg;codecs=opus";
      } else if (MediaRecorder.isTypeSupported("audio/mp4")) {
        mimeType = "audio/mp4";
      }

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const fullBlob = new Blob(audioChunksRef.current, { type: mimeType });
        setAudioBlob(fullBlob);
        const url = URL.createObjectURL(fullBlob);
        setAudioUrl(url);

        // Stop all audio tracks
        stream.getTracks().forEach((track) => track.stop());

        // Upload to backend
        await uploadAudio(fullBlob, mimeType);
      };

      recorder.start(200);
      setIsRecording(true);
    } catch (err: any) {
      console.error("Microphone access error:", err);
      setError("Microphone access was denied or is not supported. You can still type your requirements below.");
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const uploadAudio = async (blob: Blob, mimeType: string) => {
    setUploading(true);
    try {
      const formData = new FormData();
      const ext = mimeType.includes("mp4") ? "m4a" : mimeType.includes("ogg") ? "ogg" : "webm";
      formData.append("audio", blob, `voice_requirement.${ext}`);

      const res = await fetch("/api/v2/quotes/voice-note", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Upload failed");
      }

      setUploadedUrl(data.data.url);
      onVoiceNoteRecorded({
        url: data.data.url,
        duration: recordingDuration || 1,
        filename: data.data.filename,
        mimeType,
      });
    } catch (err: any) {
      console.error("Failed to upload voice note:", err);
      setError("Failed to upload voice note. You can retry or describe in text.");
    } finally {
      setUploading(false);
    }
  };

  const deleteRecording = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
    setAudioBlob(null);
    setAudioUrl(null);
    setUploadedUrl(null);
    setIsPlaying(false);
    setRecordingDuration(0);
    setError(null);
    onVoiceNoteRecorded(null);
  };

  const togglePlayback = () => {
    if (!audioPlayerRef.current) return;
    if (isPlaying) {
      audioPlayerRef.current.pause();
      setIsPlaying(false);
    } else {
      audioPlayerRef.current.play();
      setIsPlaying(true);
    }
  };

  if (!permissionSupported) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-500">
        Voice recording is not supported in this browser. Please describe your requirements in the text box below.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Action / Recording Area */}
      <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50/60 to-indigo-50/40 p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-full ${isRecording ? "bg-red-500 text-white animate-pulse" : "bg-blue-600 text-white"}`}>
              <Mic className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">
                {isRecording ? "Recording in progress..." : audioUrl ? "Voice note captured" : "Record Voice Note"}
              </p>
              <p className="text-[11px] text-slate-500">
                {isRecording
                  ? `Speaking now... (${formatSeconds(recordingDuration)})`
                  : audioUrl
                  ? `Duration: ${formatSeconds(recordingDuration)} • Ready with quote`
                  : "Explain Wi-Fi coverage, floors, or specific setup needed"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isRecording && !audioUrl && (
              <Button
                type="button"
                onClick={startRecording}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl h-9 px-4 gap-1.5 shadow-sm"
              >
                <Mic className="h-3.5 w-3.5" />
                Start Recording
              </Button>
            )}

            {isRecording && (
              <Button
                type="button"
                onClick={stopRecording}
                size="sm"
                variant="destructive"
                className="rounded-xl text-xs font-semibold h-9 px-4 gap-1.5 animate-pulse"
              >
                <Square className="h-3.5 w-3.5 fill-current" />
                Stop Recording
              </Button>
            )}

            {audioUrl && (
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  onClick={togglePlayback}
                  size="sm"
                  variant="outline"
                  className="rounded-xl h-9 text-xs font-semibold border-blue-200 bg-white text-blue-600 hover:bg-blue-50 gap-1.5"
                >
                  {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                  {isPlaying ? "Pause" : "Preview"}
                </Button>

                <Button
                  type="button"
                  onClick={deleteRecording}
                  size="sm"
                  variant="ghost"
                  className="rounded-xl h-9 text-xs text-red-600 hover:bg-red-50 hover:text-red-700 gap-1"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Re-record
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Audio Element Hidden */}
        {audioUrl && (
          <audio
            ref={audioPlayerRef}
            src={audioUrl}
            onEnded={() => setIsPlaying(false)}
            className="hidden"
          />
        )}

        {/* Upload status */}
        {uploading && (
          <div className="mt-2 text-[11px] text-blue-600 font-semibold flex items-center gap-1.5">
            <RefreshCw className="h-3 w-3 animate-spin" /> Uploading audio note...
          </div>
        )}

        {uploadedUrl && !uploading && (
          <div className="mt-2 text-[11px] text-emerald-600 font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5" /> Voice note attached successfully to quote request
          </div>
        )}

        {error && (
          <p className="mt-2 text-[11px] text-amber-700 font-medium bg-amber-50 rounded-lg p-2 border border-amber-100">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
