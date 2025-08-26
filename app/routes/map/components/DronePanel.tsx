import { AnimatePresence, motion } from "framer-motion";
import { Map as MapIcon, X, ChevronRight } from "lucide-react";
import { Tabs } from "~/components/ui/tabs";
import { ScrollArea } from "~/components/ui/scroll-area";
import { isAllowed } from "~/store/droneStore";
import { useEffect, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
interface DroneItem {
  id: string;
  name: string;
  serial: string;
  pilot: string;
  organization: string;
}

export interface DronePanelProps {
  open: boolean;
  drones: DroneItem[];
  highlightedId: string | null;
  onClose: () => void;
  onOpen: () => void;
  onSelect: (id: string) => void;
}

export function DronePanel({
  open,
  drones,
  highlightedId,
  onClose,
  onOpen,
  onSelect,
}: DronePanelProps) {
  const listRef = useRef<HTMLDivElement | null>(null);
  const virtualizer = useVirtualizer({
    count: drones.length,
    estimateSize: () => 132,
    getScrollElement: () => listRef.current,
    overscan: 1,
  });
  const items = virtualizer.getVirtualItems();

  // Scroll selected/highlighted into view
  useEffect(() => {
    if (!listRef.current || !highlightedId) return;
    virtualizer.scrollToIndex(
      drones.findIndex((d) => d.id === highlightedId),
      {
        align: "auto",
        behavior: "smooth",
      }
    );
  }, [highlightedId]);

  return (
    <>
      {/* Reopen handle - always visible when panel is closed */}
      {!open && (
        <motion.div
          initial={{ x: -320, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute top-0 left-0 h-full w-12 bg-[#111111] border-r border-zinc-800 z-10 flex items-center justify-center"
        >
          <button
            onClick={onOpen}
            className="p-2 rounded-r-lg bg-zinc-800 hover:bg-zinc-700 transition-colors cursor-pointer"
            title="Open Drone Panel"
          >
            <ChevronRight size={20} className="text-zinc-300" />
          </button>
        </motion.div>
      )}

      {/* Main panel */}
      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1, transition: { duration: 0.4 } }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
            className="absolute top-0 h-full w-[320px] bg-[#111111] backdrop-blur border-r border-zinc-800 text-zinc-100 z-10
            shadow-[5px_10px_10px_0px_#07080880]"
            style={{ left: 0 }}
          >
            <div className="h-16 px-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-medium tracking-widest uppercase">
                  Drone Flying
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-[2px] rounded-full bg-[#777777] cursor-pointer hover:bg-[#888888] transition-colors"
              >
                <X size={14} color="black" />
              </button>
            </div>
            <div className="">
              <Tabs
                tabs={[
                  { id: "drones", label: "Drones" },
                  { id: "history", label: "Flights History" },
                ]}
                value={"drones"}
                onValueChange={() => {}}
              />
            </div>
            <ScrollArea
              className="h-[calc(100%-120px)] bg-black pb-6 pt-[1px]"
              ref={listRef}
            >
              <div
                className="relative space-y-2"
                style={{ height: `${virtualizer.getTotalSize()}px` }}
              >
                {items.map((item) => {
                  const d = drones[item.index];

                  const allowed = isAllowed(d.id);
                  const isHighlighted = highlightedId === d.id;
                  return (
                    <div
                      className="absolute top-0 left-0 "
                      key={item.key}
                      data-index={item.index}
                      style={{
                        transform: `translateY(${item.start}px)`,
                        width: "100%",
                        height: `${item.size}px`,
                      }}
                    >
                      <div
                        data-id={d.id}
                        className={
                          " transition-colors p-3 cursor-pointer " +
                          (isHighlighted
                            ? "bg-zinc-800 ring-1 ring-zinc-500"
                            : "bg-[#111111] hover:bg-zinc-800")
                        }
                      >
                        <button
                          className="w-full text-left"
                          onClick={() => onSelect(d.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="font-medium text-sm">{d.name}</div>
                          </div>
                          <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-3 text-[11px] text-[#CCCCCC] cursor-pointer">
                            <div>
                              <div className="opacity-70">Serial #</div>
                              <div>#{d.serial}</div>
                            </div>
                            <div>
                              <div className="opacity-70">Registration #</div>
                              <div>{d.id}</div>
                            </div>
                            <div>
                              <div className="opacity-70">Pilot</div>
                              <div>{d.pilot}</div>
                            </div>
                            <div>
                              <div className="opacity-70">Organization</div>
                              <div>{d.organization}</div>
                            </div>
                          </div>
                        </button>
                        <span
                          className={
                            "inline-flex h-4.5 w-4.5 absolute top-1/3 right-1/8 rounded-full border-1 border-white " +
                            (allowed ? "bg-[#5CFC00]" : "bg-[#F9000E]")
                          }
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
