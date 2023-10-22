import { Text } from "@chakra-ui/react";
import Creatable from "react-select/creatable";

export default function MetSelector({
  params,
  setParams,
  setMetIndex,
  metIndex,
  setMetOptions,
  metOptions,
  ind,
}) {
  return (
    <>
      <Text fontWeight="black">Metabolic rate</Text>
      <Creatable
        instanceId="zjhddjh1oi2euiAUSD901280198"
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            width: "200px",
          }),
        }}
        isClearable
        onChange={(val) => {
          let newState = [...params];
          if (val) newState[ind].met_value = val.value;
          else {
            newState[ind].met_value = -1;
            setMetIndex(-1);
          }
          for (let i = 0; i < metOptions.length; i++) {
            if (metOptions[i] == val) {
              setMetIndex(i);
              break;
            }
          }
          setParams(newState);
        }}
        onCreateOption={(inputValue) => {
          const val = parseFloat(inputValue);
          let newState = [...params];
          newState[ind].met_value = val;
          setParams(newState);
          setMetOptions((prev) => [
            ...prev,
            {
              label: val,
              value: val,
            },
          ]);
          setMetIndex(metOptions.length);
        }}
        value={metIndex != -1 ? metOptions[metIndex] : null}
        options={metOptions}
      />
      {params[ind].met_value != -1 ? (
        <Text>
          Met:{" "}
          <span style={{ fontWeight: "bold" }}>{params[ind].met_value}</span>
        </Text>
      ) : (
        <></>
      )}
    </>
  );
}