import { Select, Text } from "@chakra-ui/react";
import { useEffect } from "react";

export default function ClothingSelector({
  params,
  setParams,
  clo_correspondence,
  ind,
  isHome = false,
}) {
  // clo_correspondence prop already contains merged default + custom presets
  // Just use it directly and update when it changes
  useEffect(() => {
    // Validate clo_value is within bounds when clo_correspondence changes
    const currentValue = parseInt(params[ind].clo_value);
    if (currentValue >= clo_correspondence.length || currentValue < 0) {
      // Reset to first option if current selection is invalid
      let newState = [...params];
      newState[ind].clo_value = 0;
      setParams(newState);
    }
  }, [clo_correspondence, params, ind, setParams]);

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
        {clo_correspondence.map((clo, index) => {
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
