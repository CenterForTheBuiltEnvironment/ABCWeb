import { CloseIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";

export default function CloseButton({ params, ind, setParams, setIndex }) {
  return (
    <IconButton
      w="5%"
      colorScheme="red"
      icon={<CloseIcon />}
      isDisabled={params.length == 1}
      onClick={() => {
        let tempParams = [...params];
        tempParams.splice(ind, 1);
        setParams(tempParams);
        setIndex(Math.max(0, ind - 1));
      }}
    />
  );
}
