"use client";

import { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { ref, onValue, off, push, set, serverTimestamp } from 'firebase/database';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Play, Square, Upload, Info, CheckCircle, Hourglass } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const GESTURES = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ', ...'123456789', '10'];
const SAMPLES_PER_GESTURE = 5;

type SensorData = {
  flex1: number;
  flex2: number;
  flex3: number;
  flex4: number;
  flex5: number;
  imu: {
    ax: number;
    ay: number;
    az: number;
    gx: number;
    gy: number;
    gz: number;
  };
  timestamp: number;
};

type LiveData = SensorData & { gesture: string };

type CollectedData = {
  [gesture: string]: SensorData[];
};

export function DataCollector() {
  const [userId, setUserId] = useState<string | null>(null);
  const [isCollecting, setIsCollecting] = useState(false);
  const [currentGestureIndex, setCurrentGestureIndex] = useState(0);
  const [currentSample, setCurrentSample] = useState(0);
  const [collectedData, setCollectedData] = useState<CollectedData>({});
  const [liveData, setLiveData] = useState<LiveData | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // A real app would use Firebase Auth to get a UID.
    // For this demo, we'll generate a simple one.
    const newUserId = `user${Math.floor(1000 + Math.random() * 9000)}`;
    setUserId(newUserId);
  }, []);

  const currentGesture = GESTURES[currentGestureIndex];

  const resetSession = () => {
    setIsCollecting(false);
    setCurrentGestureIndex(0);
    setCurrentSample(0);
    setCollectedData({});
    setSessionComplete(false);
  };

  const handleDataSnapshot = useCallback((snapshot: any) => {
    if (!isCollecting) return;

    const data = snapshot.val();
    if (data) {
        setLiveData({ ...data, gesture: currentGesture });

        if (currentSample < SAMPLES_PER_GESTURE) {
            const newSample: SensorData = { ...data, timestamp: Date.now() };

            setCollectedData(prevData => {
                const gestureData = prevData[currentGesture] || [];
                return {
                    ...prevData,
                    [currentGesture]: [...gestureData, newSample]
                };
            });

            setCurrentSample(s => s + 1);
        }
    }
}, [isCollecting, currentGesture, currentSample]);

useEffect(() => {
    if (isCollecting) {
        // This simulates capturing one sample. A real implementation might
        // stream data and have a button to "capture" a sample.
        const sensorDataRef = ref(db, 'live/sensor_data');
        onValue(sensorDataRef, handleDataSnapshot);

        return () => {
            off(sensorDataRef, 'value', handleDataSnapshot);
        };
    }
}, [isCollecting, handleDataSnapshot]);


  useEffect(() => {
    if (currentSample >= SAMPLES_PER_GESTURE) {
      if (currentGestureIndex < GESTURES.length - 1) {
        setCurrentGestureIndex(i => i + 1);
        setCurrentSample(0);
      } else {
        setIsCollecting(false);
        setSessionComplete(true);
        toast({
          title: "Collection Complete!",
          description: `All ${GESTURES.length} gestures have been recorded.`,
          className: "bg-green-100 border-green-400 text-green-800"
        });
      }
    }
  }, [currentSample, currentGestureIndex, toast]);

  const handleUpload = async () => {
    if (!userId || Object.keys(collectedData).length === 0) {
      toast({
        title: "Error",
        description: "No data to upload or user ID is missing.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    try {
      const userGesturesRef = ref(db, `users/${userId}/gestures`);
      await set(userGesturesRef, collectedData);

      // Log the upload event
      const uploadsRef = ref(db, `uploads_log`);
      await push(uploadsRef, {
          userId: userId,
          timestamp: serverTimestamp(),
          gesturesCount: Object.keys(collectedData).length,
          totalSamples: Object.values(collectedData).flat().length
      });

      toast({
        title: "Upload Successful!",
        description: "Your gesture data has been saved to Firebase.",
      });
      resetSession();
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload Failed",
        description: "There was a problem uploading your data.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const totalProgress = ((currentGestureIndex * SAMPLES_PER_GESTURE + currentSample) / (GESTURES.length * SAMPLES_PER_GESTURE)) * 100;

  return (
    <Card className="w-full max-w-4xl shadow-2xl">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="font-headline text-3xl">Gesture Data Collection</CardTitle>
                <CardDescription>Follow the prompts to record gesture data for the AI model.</CardDescription>
            </div>
            {userId && <p className="text-sm text-muted-foreground font-mono pt-1">UserID: {userId}</p>}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {sessionComplete ? (
            <div className="text-center p-8 space-y-4">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto"/>
                <h3 className="text-2xl font-semibold">Data Collection Complete!</h3>
                <p className="text-muted-foreground">You can now upload the data to train the model.</p>
            </div>
        ) : isCollecting ? (
          <div className="space-y-4">
            <div className="text-center p-8 rounded-lg bg-accent/50 border border-dashed">
              <p className="text-muted-foreground mb-2">Please perform gesture for:</p>
              <h3 className="text-7xl font-bold tracking-wider">{currentGesture}</h3>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Gesture Progress:</span>
              <Progress value={(currentSample / SAMPLES_PER_GESTURE) * 100} className="w-full" />
              <span className="text-sm font-mono">{currentSample} / {SAMPLES_PER_GESTURE}</span>
            </div>
          </div>
        ) : (
          <Alert>
             <Info className="h-4 w-4"/>
            <AlertTitle>Ready to Start?</AlertTitle>
            <AlertDescription>
              Click the "Start Collection" button to begin the data recording session. You will be prompted to perform each gesture multiple times.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Overall Progress</p>
            <Progress value={totalProgress} />
            <p className="text-xs text-right text-muted-foreground">{currentGestureIndex} / {GESTURES.length} gestures</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <h3 className="font-medium mb-2">Live Sensor Data</h3>
                <Card className="h-64">
                    <CardContent className="p-4">
                        {liveData ? (
                            <div className="font-mono text-sm space-y-1">
                                <p>Flex: [{liveData.flex1}, {liveData.flex2}, {liveData.flex3}, {liveData.flex4}, {liveData.flex5}]</p>
                                <p>Accel: [ax: {liveData.imu.ax.toFixed(2)}, ay: {liveData.imu.ay.toFixed(2)}, az: {liveData.imu.az.toFixed(2)}]</p>
                                <p>Gyro: [gx: {liveData.imu.gx.toFixed(2)}, gy: {liveData.imu.gy.toFixed(2)}, gz: {liveData.imu.gz.toFixed(2)}]</p>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground">
                                {isCollecting ? <><Hourglass className="mr-2 h-4 w-4 animate-spin"/>Waiting for data...</> : <p>Start collection to see live data</p>}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
            <div>
                <h3 className="font-medium mb-2">Collected Samples</h3>
                <ScrollArea className="h-64 rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Gesture</TableHead>
                                <TableHead>Samples</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Object.entries(collectedData).map(([gesture, samples]) => (
                                <TableRow key={gesture}>
                                    <TableCell className="font-medium">{gesture}</TableCell>
                                    <TableCell>{samples.length}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </div>
        </div>

      </CardContent>
      <CardFooter className="flex justify-between items-center">
        {!isCollecting ? (
             <Button size="lg" onClick={() => { if(sessionComplete) resetSession(); setIsCollecting(true); }} disabled={isUploading}>
                <Play className="mr-2 h-5 w-5"/>
                {sessionComplete ? "Start New Session" : "Start Collection"}
            </Button>
        ) : (
            <Button size="lg" variant="destructive" onClick={() => setIsCollecting(false)}>
                <Square className="mr-2 h-5 w-5"/>
                Stop Collection
            </Button>
        )}
        <Button size="lg" variant="outline" onClick={handleUpload} disabled={isUploading || Object.keys(collectedData).length === 0}>
            {isUploading ? <Hourglass className="mr-2 h-5 w-5 animate-spin"/> : <Upload className="mr-2 h-5 w-5"/>}
            Upload Data
        </Button>
      </CardFooter>
    </Card>
  );
}
