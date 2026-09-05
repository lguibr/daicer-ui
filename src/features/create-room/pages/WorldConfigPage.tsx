import { useMemo } from "react";
import type { ReactElement } from "react";
import { useApolloClient } from "@apollo/client/react";
import useAuth from "@/hooks/useAuth";
import { PlayerCreateRoomDocument } from "@/features/play/generated";
import { useRoomMutation } from "@/features/play/useRoomMutation";
import { useNavigate, useLocation } from "react-router-dom";
import { WorldConfigForm } from "@/features/debug/components/WorldConfigForm";
import type { WorldConfig } from "@/features/debug/utils/types";
import type { WorldSettings } from "@/types/contracts";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";
import { useDebounce } from "@/hooks/useDebounce";
import { useWizard } from "../context/WizardContext";
import { WorldPreview } from "../components/WorldPreview";

export default function WorldConfigPage(): ReactElement {
  const { settings, setSettings } = useWizard();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const client = useApolloClient();
  const mutation = useRoomMutation(user?.documentId ? JSON.stringify([user.documentId, "create"]) : "");
  const { pending: isSubmitting } = mutation;

  const config = useMemo<WorldConfig>(() => ({
    seed: typeof settings.seed === "string" && settings.seed ? settings.seed : "default-seed",
    chunkSize: settings.generationParams?.chunkSize ?? 32,
    globalScale:
      settings.generationParams?.globalScale ?? 0.01,
    seaLevel: settings.generationParams?.seaLevel ?? 0,
    elevationScale:
      settings.generationParams?.elevationScale ?? 1,
    roughness: settings.generationParams?.roughness ?? 0.5,
    detail: settings.generationParams?.detail ?? 4,
    moistureScale:
      settings.generationParams?.moistureScale ?? 1,
    temperatureOffset:
      settings.generationParams?.temperatureOffset ?? 0,
    structureChance:
      settings.generationParams?.structureChance ?? 0.1,
    structureSpacing:
      settings.generationParams?.structureSpacing ?? 10,
    structureSizeAvg:
      settings.generationParams?.structureSizeAvg ?? 10,
    roadDensity: settings.generationParams?.roadDensity ?? 0.5,
    fogRadius: settings.generationParams?.fogRadius ?? 10,
  }), [settings.seed, settings.generationParams]);

  // Debounce config updates to prevent excessive re-fetching during slider dragging
  const debouncedConfig = useDebounce(config, 500);

  const handleConfigChange = (newConfig: WorldConfig): void => {
    setSettings((prev: WorldSettings) => ({
      ...prev,
      seed: newConfig.seed, // Sync top level
      generationParams: {
        ...prev.generationParams,
        ...newConfig,
      },
    }));
  };

  const handleSubmit = async (): Promise<void> => {
    const input = { language: typeof settings.language === "string" ? settings.language : "en",
      worldConfig: { ...config, worldSize: settings.worldSize, worldType: settings.worldType } };
    const room = await mutation.run(JSON.stringify(["create", input]), async (requestId) => {
      const response = await client.mutate({ mutation: PlayerCreateRoomDocument,
        variables: { input: { ...input, requestId } }, fetchPolicy: "no-cache" });
      if (!response.data?.createRoom.roomId) throw new Error("The server did not return a room.");
      return response.data.createRoom;
    });
    if (room) navigate(new URLSearchParams(location.search).get("target") === "debug"
      ? `/debug/${room.roomId}` : `/create/character-selection/${room.roomId}`);
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      <div className="space-y-2 mb-6 text-center">
        <h2 className="font-display text-lg uppercase tracking-[0.35em] text-aurora-300">
          World Configuration
        </h2>
        <p className="text-sm text-shadow-300">
          Fine-tune the physical parameters of the world generation
        </p>
      </div>

      {mutation.error && <p role="alert">{mutation.error}</p>}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        {/* Preview */}
        <div className="lg:col-span-8 order-2 lg:order-1 h-[400px] lg:h-[500px] bg-midnight-950/30 rounded-2xl border border-midnight-700/50 backdrop-blur-sm p-1 shadow-2xl relative">
          <div className="absolute inset-0 rounded-xl overflow-hidden">
            <WorldPreview config={debouncedConfig} />
          </div>
        </div>

        {/* Controls */}
        <div className="lg:col-span-4 order-1 lg:order-2">
          <section className="card p-6 border border-midnight-700/50 bg-midnight-900/40 backdrop-blur-sm h-full max-h-[500px] overflow-y-auto overflow-x-hidden">
            <WorldConfigForm
              config={config}
              isActive
              onConfigChange={handleConfigChange}
              onRegenerate={() => {
                handleConfigChange({
                  ...config,
                  seed: Math.random().toString(36).substr(2, 6),
                });
              }}
            />
          </section>
        </div>
      </div>

      <div className="flex justify-between pt-4 border-t border-midnight-800">
        <button
          type="button"
          onClick={() =>
            navigate({
              pathname: "/room",
              search: location.search,
            })
          }
          className="btn-secondary min-w-[150px]"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting || !user}
          className="btn-primary min-w-[200px]"
        >
          Create room
        </button>
      </div>

      {isSubmitting && <LoadingOverlay message="Forging World..." />}
    </div>
  );
}
