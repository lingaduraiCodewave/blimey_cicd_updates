import { useEffect, useState } from "react";
import { check } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";

export function useUpdater() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateInfo, setUpdateInfo] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkForUpdates = async () => {
    try {
      setIsChecking(true);
      const update = await check();
      if (update?.available) {
        setUpdateAvailable(true);
        setUpdateInfo(update);
      }
    } catch (error) {
      console.error("Failed to check for updates:", error);
    } finally {
      setIsChecking(false);
    }
  };

  const installUpdate = async () => {
    if (!updateInfo) return;
    try {
      console.log("Update info:", updateInfo);
      const platform = updateInfo.rawJson.platforms?.["windows-x86_64"];
      console.log("Download URL:", platform?.url || "Not found");
      await updateInfo.downloadAndInstall();
      await relaunch();
    } catch (error) {
      console.error("Failed to install update:", error);
      console.error("Update info:", updateInfo);
      if (updateInfo?.platforms) {
        console.error("Platform URLs:", updateInfo.platforms);
        const platform = updateInfo.platforms["windows-x86_64"];
        console.error("Windows x86_64 URL:", platform?.url);
      }
    }
  };

  useEffect(() => {
    // Check for updates on app start - disabled until Azure Storage is configured
    // Uncomment the line below once Azure Storage is set up:
    checkForUpdates();
    // Optionally check periodically (e.g., every hour)
    const interval = setInterval(checkForUpdates, 3600000);
    return () => clearInterval(interval);
  }, []);

  return {
    updateAvailable,
    updateInfo,
    isChecking,
    checkForUpdates,
    installUpdate,
  };
}
