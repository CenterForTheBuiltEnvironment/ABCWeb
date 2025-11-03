import { Select, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const STORAGE_KEY = "abc_clothing_presets";

export default function ClothingSelector({
  params,
  setParams,
  clo_correspondence,
  ind,
  isHome = false,
}) {
  const [allClothing, setAllClothing] = useState(clo_correspondence);

  // Load custom presets from localStorage and merge with default
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const customPresets = JSON.parse(saved);
          // Merge default clothing with custom presets
          setAllClothing([...clo_correspondence, ...customPresets]);
        } catch (e) {
          console.error("Error loading custom presets:", e);
          setAllClothing(clo_correspondence);
        }
      } else {
        setAllClothing(clo_correspondence);
      }
    }
  }, [clo_correspondence]);

  // Listen for changes to local storage (when presets are saved/updated)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleStorageChange = () => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          try {
            const customPresets = JSON.parse(saved);
            setAllClothing([...clo_correspondence, ...customPresets]);
          } catch (e) {
            console.error("Error loading custom presets:", e);
          }
        } else {
          setAllClothing(clo_correspondence);
        }
      };

      // Listen for storage events (when updated from other tabs/windows)
      window.addEventListener("storage", handleStorageChange);
      // Also listen for custom event (when updated in same tab)
      window.addEventListener("clothingPresetsUpdated", handleStorageChange);

      return () => {
        window.removeEventListener("storage", handleStorageChange);
        window.removeEventListener("clothingPresetsUpdated", handleStorageChange);
      };
    }
  }, [clo_correspondence]);

  return (
    <>
      <Text fontWeight="bold">Clothing level</Text>
      <Select
        backgroundColor="white"
        w={isHome ? "250px" : "200px"}
        onChange={(e) => {
          let newState = [...params];
          newState[ind].clo_value = e.target.value;
          setParams(newState);
        }}
        value={params[ind].clo_value}
      >
        {allClothing.map((clo, index) => {
          return (
            <option
              size="md"
              key={`${clo.ensemble_name}-${index}`}
              value={index}
              style={{ backgroundColor: "white" }}
            >
              {clo.ensemble_name}
            </option>
          );
        })}
      </Select>
    </>
  );
}
