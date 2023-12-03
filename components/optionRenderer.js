import {
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  VStack,
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
  isHome = false,
}) {
  return (
    <VStack>
      <Text fontWeight="black" w="100%" textAlign={isHome ? "center" : ""}>
        {title}
      </Text>
      {val != "exposure_duration" ? (
        <>
          <HStack width="100%" justify={isHome ? "center" : ""}>
            {icon}
            <Text>
              {(
                params[ind][val].reduce(
                  (a, b) => parseFloat(a) + parseFloat(b)
                ) / params[ind][val].length
              ).toFixed(1)}

              {unit}
            </Text>
          </HStack>
        </>
      ) : (
        <></>
      )}
      {val == "exposure_duration" ? (
        <HStack w="100%" justify={isHome ? "center" : ""}>
          <InputGroup w="8vw">
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
    </VStack>
  );
}
