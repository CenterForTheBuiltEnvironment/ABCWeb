import { Select, Text } from "@chakra-ui/react";

export default function ClothingSelector({
  params,
  setParams,
  clo_correspondence,
  ind,
}) {
  return (
    <>
      <Text fontWeight="black">Clothing level</Text>
      <Select
        backgroundColor="white"
        w="200px"
        onChange={(e) => {
          let newState = [...params];
          newState[ind].clo_value = e.target.value.toString();
          setParams(newState);
        }}
        value={params[ind].clo_value}
      >
        {clo_correspondence.map((clo, index) => {
          return (
            <option
              size="md"
              key={clo.description}
              value={index.toString()}
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
