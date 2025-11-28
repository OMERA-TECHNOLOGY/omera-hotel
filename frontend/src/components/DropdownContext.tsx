import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
} from "react";

type DropdownContextType = {
  openId: string | null;
  open: (id: string) => void;
  close: () => void;
  registerRef: (id: string, ref: React.RefObject<HTMLElement>) => void;
  unregisterRef: (id: string) => void;
};

const DropdownContext = createContext<DropdownContextType | null>(null);

export const DropdownProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [openId, setOpenId] = useState<string | null>(null);
  const refs = useRef<Record<string, React.RefObject<HTMLElement>>>({});

  const registerRef = (id: string, ref: React.RefObject<HTMLElement>) => {
    refs.current[id] = ref;
  };

  const unregisterRef = (id: string) => {
    delete refs.current[id];
  };

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      // If any registered ref contains the target and that ref's id equals openId, do nothing.
      const anyContains = Object.entries(refs.current).some(([id, ref]) => {
        const el = ref?.current;
        return el && el.contains(target as Node);
      });
      if (!anyContains) setOpenId(null);
    };
    document.addEventListener("click", onDocClick);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenId(null);
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <DropdownContext.Provider
      value={{
        openId,
        open: setOpenId,
        close: () => setOpenId(null),
        registerRef,
        unregisterRef,
      }}
    >
      {children}
    </DropdownContext.Provider>
  );
};

export function useDropdownContext() {
  const ctx = useContext(DropdownContext);
  if (!ctx) {
    // Provide a safe fallback so components can operate without a provider
    return {
      openId: null,
      open: () => {},
      close: () => {},
      registerRef: () => {},
      unregisterRef: () => {},
    } as DropdownContextType;
  }
  return ctx;
}
