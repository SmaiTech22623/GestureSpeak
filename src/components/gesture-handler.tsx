"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { db } from "@/lib/firebase";
import { ref, push, onChildAdded, off, serverTimestamp, type DataSnapshot } from "firebase/database";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Send, Volume2, VolumeX, BotMessageSquare } from "lucide-react";

interface Gesture {
  id: string;
  text: string;
  timestamp: number;
}

export function GestureHandler() {
  const [ttsEnabled, setTtsEnabled] = useState<boolean>(true);
  const ttsEnabledRef = useRef(ttsEnabled);
  
  useEffect(() => {
    ttsEnabledRef.current = ttsEnabled;
  }, [ttsEnabled]);

  const [gestures, setGestures] = useState<Gesture[]>([]);
  const [newGestureText, setNewGestureText] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (db.app.options.apiKey === "YOUR_API_KEY") {
      console.warn("Firebase is not configured. Please add your credentials to src/lib/firebase.ts");
      toast({
        title: "Firebase Not Configured",
        description: "Please configure Firebase in src/lib/firebase.ts to use the app.",
        variant: "destructive",
        duration: Infinity,
      });
      return;
    }

    const gesturesRef = ref(db, "gestures/from_pi");
    const handleNewGesture = (snapshot: DataSnapshot) => {
      if (!snapshot.exists()) return;
      const newGesture = { id: snapshot.key!, ...snapshot.val() };
      setGestures((prev) => [...prev, newGesture]);

      if (ttsEnabledRef.current) {
        try {
          const utterance = new SpeechSynthesisUtterance(newGesture.text);
          window.speechSynthesis.speak(utterance);
        } catch (error) {
          console.error("TTS Error:", error);
          toast({
            title: "TTS Error",
            description: "Could not play audio for the gesture.",
            variant: "destructive"
          });
        }
      }
    };
    
    onChildAdded(gesturesRef, handleNewGesture);

    return () => {
      off(gesturesRef, "child_added", handleNewGesture);
    };
  }, [toast]);

  useEffect(() => {
    if (scrollViewportRef.current) {
      scrollViewportRef.current.scrollTop = scrollViewportRef.current.scrollHeight;
    }
  }, [gestures]);

  const handleSendGesture = async (e: FormEvent) => {
    e.preventDefault();
    if (!newGestureText.trim() || isSending) return;
    
    if (db.app.options.apiKey === "YOUR_API_KEY") {
        toast({
            title: "Cannot Send Gesture",
            description: "Firebase is not configured.",
            variant: "destructive",
        });
        return;
    }

    setIsSending(true);
    const textToSend = newGestureText.trim();
    try {
      const commandsRef = ref(db, "commands/to_pi");
      await push(commandsRef, {
        text: textToSend,
        timestamp: serverTimestamp(),
      });
      setNewGestureText("");
      toast({
        title: "Gesture Sent!",
        description: `"${textToSend}" sent to the Pi.`,
      });
    } catch (error) {
      console.error("Error sending gesture:", error);
      toast({
        title: "Error",
        description: "Could not send gesture to the Pi.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-2xl bg-card">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="font-headline text-3xl">GestureTalk</CardTitle>
                <CardDescription>Real-time gesture communication</CardDescription>
            </div>
            <div className="flex items-center space-x-2 pt-1">
                <Label htmlFor="tts-toggle" className="flex items-center gap-2 cursor-pointer">
                    {ttsEnabled ? <Volume2 className="h-5 w-5"/> : <VolumeX className="h-5 w-5 text-muted-foreground"/>}
                    <span className="text-sm font-medium sr-only">TTS</span>
                </Label>
                <Switch
                    id="tts-toggle"
                    checked={ttsEnabled}
                    onCheckedChange={setTtsEnabled}
                    aria-label="Toggle Text-to-Speech"
                />
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <BotMessageSquare className="h-4 w-4"/>
                Received Gestures
            </h3>
            <ScrollArea className="h-64 w-full rounded-md border">
              <div className="p-4 h-full" ref={scrollViewportRef}>
                {gestures.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                        <p>Waiting for gestures from the Pi...</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                    {gestures.map((gesture) => (
                        <div key={gesture.id} className="flex flex-col animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
                            <p className="font-medium text-foreground">{gesture.text}</p>
                            <p className="text-xs text-muted-foreground">
                                {new Date(gesture.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    ))}
                    </div>
                )}
              </div>
            </ScrollArea>
        </div>
      </CardContent>
      <CardFooter className="p-6">
        <form onSubmit={handleSendGesture} className="w-full space-y-3">
          <Label htmlFor="gesture-input" className="font-medium">Upload New Gesture Command</Label>
          <div className="flex w-full items-center space-x-2">
            <Input
              id="gesture-input"
              type="text"
              placeholder="e.g. 'Hello' or 'Thank you'"
              value={newGestureText}
              onChange={(e) => setNewGestureText(e.target.value)}
              disabled={isSending}
              autoComplete="off"
            />
            <Button type="submit" disabled={isSending || !newGestureText.trim()} className="w-[120px]">
              {isSending ? (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <Send />
              )}
              {isSending ? "Sending" : "Send"}
            </Button>
          </div>
        </form>
      </CardFooter>
    </Card>
  );
}
