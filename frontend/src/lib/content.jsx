import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";

const ContentContext = createContext(null);

export function ContentProvider({ children }) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get("/content");
      setContent(data);
    } catch (e) {
      console.error("Failed to load content", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <ContentContext.Provider value={{ content, loading, reload: load, setContent }}>
      {children}
    </ContentContext.Provider>
  );
}

export const useContent = () => useContext(ContentContext);
export const useSection = (key) => {
  const ctx = useContext(ContentContext);
  return ctx?.content?.[key] || null;
};
