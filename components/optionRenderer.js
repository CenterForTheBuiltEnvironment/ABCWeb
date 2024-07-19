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
    <VStack alignItems="flex-start" w="100%">
      <Text fontWeight="bold" w="100%" textAlign="left">
        {title}
      </Text>
      {/* Input items except 'exposure_duration' */}
      {val != "exposure_duration" ? (
        <>
          <HStack width="100%" justifyContent="flex-start">
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
      {/* 'exposure_duration' */}
      {val == "exposure_duration" ? (
        <HStack w="100%" justifyContent="flex-start">
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
