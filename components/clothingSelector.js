import { Select, Text } from "@chakra-ui/react";

export default function ClothingSelector({
  params,
  setParams,
  clo_correspondence,
  ind,
  isHome = false,
}) {
  return (
    <>
      <Text fontWeight="black">Clothing level</Text>
      <Select
        backgroundColor="white"
        w={isHome ? "250px" : "200px"}
        onChange={(e) => {
          console.log(e);
          let newState = [...params];
          newState[ind].clo_value = e.target.value.toString();
          setParams(newState);
          console.log(params);
        }}
        value={params[ind].clo_value}
      >
        {clo_correspondence.map((clo, index) => {
          return (
            <option
              size="md"
              key={clo.description}
              value={clo.whole_body.iclo}
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
