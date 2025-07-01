import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  IconButton,
  Tooltip,
  Box,
} from "@chakra-ui/react";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import { helpTexts } from "@/constants/helpTexts";

export default function HelpPopover({ type }) {
  const help = helpTexts[type];
  if (!help) return null;

  return (
    <Popover>
      <PopoverTrigger>
        <Box>
          <Tooltip label={`What is ${help.header}?`} hasArrow placement="right">
            <IconButton
              icon={<InfoOutlineIcon />}
              aria-label={`More info about ${type}`}
              size="sm"
              variant="ghost"
            />
          </Tooltip>
        </Box>
      </PopoverTrigger>

      <PopoverContent maxW="500px">
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader fontWeight="bold">{help.header}</PopoverHeader>
        <PopoverBody>{help.body}</PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
