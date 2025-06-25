import { useEffect, useCallback, useState, useRef } from "react";
import { Logo } from "@client/components/logo";

type StatusUpdate = {
  step: string;
  progress: number;
  message: string;
  done?: boolean;
  error?: string;
};

const fetchStatus = async (): Promise<StatusUpdate> => {
  return await invoke<StatusUpdate>("fetch_status");
};

const MAX_STUCK_TIME = 20000;
const STUCK_CLOSE_DELAY = 5000;
const POLL_INTERVAL = 100;
const ABSOLUTE_TIMEOUT = 60000;
const MAX_RETRIES = 5;
export const Splash: React.FC = () => {
  const [status, setStatus] = useState<StatusUpdate>({
    step: "starting",
    progress: 0,
    message: "",
  });
  const [isStuck, setIsStuck] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const failSafeRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastProgressRef = useRef(0);
  const lastUpdateTimeRef = useRef(Date.now());
  const closeSplash = useCallback(async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await invoke<null>("close_splash", {});
    } catch (error) {
      console.error("Error closing splash:", error);
    }
  }, []);
  const stopPollingAndClose = useCallback(async () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (failSafeRef.current) {
      clearTimeout(failSafeRef.current);
      failSafeRef.current = null;
    }
    await closeSplash();
  }, [closeSplash]);
  useEffect(() => {
    let retryDelay = POLL_INTERVAL;
    const getStatus = async () => {
      try {
        const update: StatusUpdate = await fetchStatus();
        const now = Date.now();
        if (update.error) {
          console.error("Backend error:", update.error);
          setStatus({
            step: "Error",
            progress: 0,
            message: update.error,
          });
          await stopPollingAndClose();
          return;
        }
        if (update.done || update.progress >= 100) {
          setStatus(update);
          await stopPollingAndClose();
          return;
        }
        if (
          update.progress === lastProgressRef.current &&
          update.progress < 100 &&
          now - lastUpdateTimeRef.current > MAX_STUCK_TIME
        ) {
          setIsStuck(true);
        } else if (update.progress !== lastProgressRef.current) {
          lastUpdateTimeRef.current = now;
          setIsStuck(false);
        }
        lastProgressRef.current = update.progress;
        setStatus(update);
        setRetryCount(0);
        retryDelay = POLL_INTERVAL;
      } catch (error) {
        console.error("Fetch failed:", error);
        if (retryCount < MAX_RETRIES) {
          setRetryCount((prev) => prev + 1);
          retryDelay *= 2;
        } else {
          setStatus({
            step: "Error",
            progress: 0,
            message: "Failed to fetch status repeatedly.",
          });
          await stopPollingAndClose();
        }
      }
    };
    getStatus();
    intervalRef.current = setInterval(getStatus, retryDelay);
    failSafeRef.current = setTimeout(() => {
      console.warn("Splash timeout fallback triggered.");
      stopPollingAndClose();
    }, ABSOLUTE_TIMEOUT);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (failSafeRef.current) clearTimeout(failSafeRef.current);
    };
  }, [retryCount, stopPollingAndClose]);
  useEffect(() => {
    if (!isStuck) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      return;
    }
    timeoutRef.current = setTimeout(() => {
      stopPollingAndClose();
    }, STUCK_CLOSE_DELAY);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isStuck, stopPollingAndClose]);
  return (
    <div className="card-sm flex flex-col justify-center items-center m-7 w-full h-full bg-base-100">
      <figure className="px-10 pt-10 mb-6">
        <Logo size={96} />
      </figure>
      <div className="card-body items-center text-center">
        <div className="card-actions flex flex-col items-center w-full">
          <p className="text-sm">{status.step}</p>
          <progress
            className="progress w-56"
            value={status.progress}
            max="100"
          />
        </div>
      </div>
    </div>
  );
};
