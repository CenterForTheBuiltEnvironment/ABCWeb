import {
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
} from "@chakra-ui/react";

export default function OptionRenderer({
  title,
  unit,
  val,
  icon,
  step,
  precision,
  params,
  setParams,
  ind,
}) {
  return (
    <>
      <Text fontWeight="black" mb="10px">
        {title}
      </Text>
      {val != "exposure_duration" ? (
        <>
          <HStack width="100%">
            {icon}
            <Text>
              {(
                params[ind][val].reduce((a, b) => a + b) /
                params[ind][val].length
              ).toFixed(1)}

              {unit}
            </Text>
          </HStack>
        </>
      ) : (
        <></>
      )}
      {val == "exposure_duration" ? (
        <HStack>
          <InputGroup w="7vw">
            <InputLeftElement>{icon}</InputLeftElement>
            <Input
              backgroundColor="white"
              type="number"
              textAlign="right"
              value={params[ind][val]}
              onChange={(e) => {
                let newState = [...params];
                newState[ind][val] = parseInt(e.target.value);
                setParams(newState);
              }}
              min={0}
              max={100}
              precision={precision}
              step={step}
            ></Input>
          </InputGroup>
          <Text>{unit}</Text>
        </HStack>
      ) : (
        <></>
      )}
    </>
  );
}
