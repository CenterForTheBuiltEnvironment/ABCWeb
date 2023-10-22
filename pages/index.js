import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  Switch,
  HStack,
  VStack,
  Spacer,
  useToast,
  Fade,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Input,
  Editable,
  EditablePreview,
  EditableInput,
  useEditableControls,
} from "@chakra-ui/react";
import RSelect from "react-select";
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  AddIcon,
  CheckIcon,
  EditIcon,
} from "@chakra-ui/icons";
import clo_correspondence from "../reference/local clo input/clothing_ensembles.json";
import Head from "next/head";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import ReactECharts from "echarts-for-react";

import {
  met_auto,
  places,
  listOfParameters,
  graphsVals,
  conditionParams,
} from "@/constants/constants";

import {
  colorSensation,
  colorComfort,
  determineColor,
} from "@/constants/helperFunctions";

import OptionRenderer from "@/components/optionRenderer";
import Canvass from "@/components/model";
import graphBuilderOptions from "@/components/graphBuilder";
import EditModal from "@/components/editModal";
import Spinner from "@/components/spinner";
import ClothingSelector from "@/components/clothingSelector";
import MetSelector from "@/components/metSelector";

export default function WithSubnavigation() {
  const { isOpen, onToggle } = useDisclosure();
  const [params, setParams] = useState([conditionParams(1)]);
  const [metIndex, setMetIndex] = useState(1);
  const [currentlyEditing, setCurrentlyEditing] = useState(1);
  const [cache, setCache] = useState();

  const [numtoGraph, setNumToGraph] = useState(0);
  const [fullData, setFullData] = useState([]);
  const [ind, setIndex] = useState(0);
  const [currIndex, setCurrIndex] = useState([0, 0]);
  const [metOptions, setMetOptions] = useState(met_auto);
  const [graphOptions, setGraph] = useState();
  const [graphData, setData] = useState([]);
  const loadingModal = useDisclosure();
  const editModal = useDisclosure();
  const [bodyColors, setBodyColors] = useState([]);
  const [currentColorArray, setCurrentColorArray] = useState(
    Array(18).fill("white")
  );

  function EditableControls() {
    const { isEditing, getSubmitButtonProps, getEditButtonProps } =
      useEditableControls();

    return isEditing ? (
      <IconButton
        colorScheme="yellow"
        textColor="#007AFF"
        icon={<CheckIcon />}
        {...getSubmitButtonProps()}
      />
    ) : (
      <IconButton
        colorScheme="yellow"
        textColor="#007AFF"
        icon={<EditIcon />}
        {...getEditButtonProps()}
      />
    );
  }

  const toast = useToast();

  useEffect(() => {}, [graphOptions, ind, numtoGraph, currentColorArray]);

  const onEvents = useMemo(
    () => ({
      click: (params) => {
        let tempColorArr = [];
        for (let i = 0; i < bodyColors[params.dataIndex].length; i++) {
          tempColorArr.push(
            bodyColors[params.dataIndex][i][params.seriesIndex]
          );
        }
        setCurrentColorArray(tempColorArr);
        let curr = 0;
        for (let i = 0; i < cache.length; i++) {
          curr += cache[i].exposure_duration;
          if (curr > params.dataIndex) {
            setIndex(i);
            setCurrIndex([i, params.dataIndex]);
            break;
          }
        }
      },
      mouseover: (params) => {},
    }),
    [cache, bodyColors]
  );

  return (
    <Box>
      <Head>
        <title>Berkeley CBE Comfort Tool</title>
      </Head>
      <EditModal
        disclosure={editModal}
        currentlyEditing={currentlyEditing}
        params={params}
        ind={ind}
        setParams={setParams}
      />
      <Spinner loadingModal={loadingModal} />
      <Flex
        bg={useColorModeValue("white", "gray.800")}
        color={useColorModeValue("gray.600", "white")}
        minH={"60px"}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.900")}
        align={"center"}
      >
        <Flex
          flex={{ base: 1, md: "auto" }}
          ml={{ base: -2 }}
          display={{ base: "flex", md: "none" }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={"ghost"}
            aria-label={"Toggle Navigation"}
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }}>
          <Text
            textAlign={useBreakpointValue({ base: "center", md: "left" })}
            fontFamily={"heading"}
            color={useColorModeValue("gray.800", "white")}
            style={{ fontWeight: "800", fontSize: 35 }}
          >
            <span id="styledText">Berkeley CBE</span> Comfort Tool
          </Text>

          <Flex display={{ base: "none", md: "flex" }} ml={10}></Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={"flex-end"}
          direction={"row"}
          spacing={2}
          alignItems={"center"}
        >
          <Text>SI</Text>
          <Switch
            size="lg"
            isChecked={false}
            onMouseEnter={() => {
              toast.closeAll();
              toast({
                title: "To be implemented soon!",
                status: "warning",
                duration: 2000,
                isClosable: true,
                position: "top",
              });
            }}
          />
          <Text mr={5}>IP</Text>
          <Button
            as={"a"}
            display={{ base: "none", md: "inline-flex" }}
            fontSize={"md"}
            fontWeight={600}
            color={"#007AFF"}
            bg={"yellow.400"}
            href={"#"}
            _hover={{
              bg: "yellow.300",
            }}
            onMouseEnter={() => {
              toast.closeAll();
              toast({
                title: "To be implemented soon!",
                status: "warning",
                duration: 2000,
                isClosable: true,
                position: "top",
              });
            }}
          >
            Help
          </Button>
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity></Collapse>
      <Fade
        in={true}
        style={{ width: "100%" }}
        transition={{ enter: { duration: 0.5 } }}
      >
        <HStack margin="20px" alignItems="flex-start" spacing={5}>
          <VStack w="30%">
            <HStack w="100%" padding={2} alignItems="flex-start">
              <HStack w="90%" overflowY={"scroll"} spacing={3}>
                {params.map((elem, indx) => {
                  return (
                    <Button
                      key={indx}
                      minW="110px"
                      colorScheme={ind == indx ? "yellow" : "gray"}
                      textColor={ind == indx ? "#007AFF" : "black"}
                      onClick={() => {
                        if (ind == indx) return false;
                        else setIndex(indx);
                      }}
                    >
                      {params[indx].condition_name.length > 13
                        ? params[indx].condition_name.substring(0, 13) + "..."
                        : params[indx].condition_name}
                    </Button>
                  );
                })}
              </HStack>
              <IconButton
                w="5%"
                colorScheme="blue"
                textColor="yellow.400"
                icon={<AddIcon />}
                onClick={() => {
                  params.push(conditionParams(params.length + 1));
                  setIndex(params.length - 1);
                }}
              ></IconButton>
            </HStack>
            <VStack
              w="100%"
              backgroundColor="gray.200"
              borderRadius="10px"
              padding={5}
              spacing={1}
              alignItems="flex-start"
            >
              <>
                <Flex w="100%" alignItems="center">
                  <Editable
                    defaultValue={params[ind].condition_name}
                    fontSize="2xl"
                    fontWeight="bold"
                    isPreviewFocusable={false}
                  >
                    <EditablePreview mr="10px" />
                    <Input
                      as={EditableInput}
                      onChange={(e) => {
                        let tempParams = [...params];
                        tempParams[ind].condition_name = e.target.value;
                        if (e.target.value.length == 0) {
                          tempParams[ind].condition_name =
                            "Condition #" + ind.toString();
                        }
                        setParams(tempParams);
                      }}
                      width="200px"
                      mr="10px"
                    />
                    <EditableControls />
                  </Editable>
                  <Spacer />
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
                  ></IconButton>
                </Flex>
                <HStack w="100%" alignItems="flex-start">
                  <VStack w="45%" alignItems="flex-start">
                    {listOfParameters.map((option) => {
                      return (
                        <OptionRenderer
                          {...{
                            params: params,
                            setParams: setParams,
                            ind: ind,
                            setIndex: ind,
                            title: option.title,
                            icon: option.icon,
                            unit: option.unit,
                            val: option.val,
                            key: option.key,
                            comp: option.comp,
                            step: option.step,
                            deltaKey: option.deltaKey,
                          }}
                        />
                      );
                    })}
                  </VStack>
                  <VStack
                    pl={0}
                    w="55%"
                    alignItems="flex-start"
                    justifyContent={"center"}
                  >
                    <MetSelector
                      params={params}
                      setParams={setParams}
                      setMetIndex={setMetIndex}
                      metIndex={metIndex}
                      setMetOptions={setMetOptions}
                      metOptions={metOptions}
                      ind={ind}
                    />
                    <ClothingSelector
                      params={params}
                      setParams={setParams}
                      clo_correspondence={clo_correspondence}
                      ind={ind}
                    />
                    <Text color="gray.600">
                      {
                        clo_correspondence[params[ind].clo_value].whole_body
                          .iclo
                      }{" "}
                      clo -{" "}
                      <span style={{ fontSize: "13px", color: "gray.600" }}>
                        {clo_correspondence[params[ind].clo_value].description}
                      </span>
                    </Text>
                    <Menu>
                      <MenuButton
                        as={Button}
                        rightIcon={<ChevronDownIcon />}
                        w="200px"
                        colorScheme="yellow"
                        textColor="#007AFF"
                      >
                        Edit data
                      </MenuButton>
                      <MenuList>
                        {listOfParameters.map((e, ind) => {
                          if (ind >= 1)
                            return (
                              <MenuItem
                                key={e.key}
                                onClick={() => {
                                  setCurrentlyEditing(ind);
                                  editModal.onOpen();
                                }}
                              >
                                <Text mr={2}>
                                  Edit{" "}
                                  <span style={{ fontWeight: "bold" }}>
                                    {e.key}
                                  </span>
                                </Text>
                                {e.icon}
                              </MenuItem>
                            );
                        })}
                      </MenuList>
                    </Menu>
                  </VStack>
                </HStack>
                <Text>
                  These values are averages. Open the advanced editor to see
                  your input data more accurately.
                </Text>
              </>
            </VStack>
            <div
              style={{ alignSelf: "center" }}
              onMouseEnter={() => {
                if (Object.values(params).some((x) => x == -1 || x == "-1"))
                  toast({
                    title: "Please fill out all fields first.",
                    status: "warning",
                    duration: 2000,
                    isClosable: true,
                  });
              }}
            >
              <Button
                mt="7px"
                colorScheme="yellow"
                textColor="#007AFF"
                alignSelf="center"
                onClick={async () => {
                  loadingModal.onOpen();
                  try {
                    let phases = [];
                    for (let i = 0; i < params.length; i++) {
                      phases.push({
                        exposure_duration: params[i].exposure_duration,
                        met_activity_name: "Custom-defined Met Activity",
                        met_activity_value: parseFloat(params[i].met_value),
                        relative_humidity: params[i].relative_humidity.map(
                          (x) => {
                            return x / 100;
                          }
                        ),
                        air_speed: params[i].air_speed,
                        air_temperature: params[i].air_temperature,
                        radiant_temperature: params[i].radiant_temperature,
                        clo_ensemble_name:
                          clo_correspondence[parseInt(params[i].clo_value)]
                            .ensemble_name,
                      });
                    }
                    const metrics = await axios
                      .post("/api/process", {
                        phases: phases,
                      })
                      .then((res) => {
                        let tempArr = [];
                        for (let j = 0; j < res.data.length; j++) {
                          tempArr.push(res.data[j][numtoGraph]);
                        }
                        setData(tempArr);
                        setFullData(res.data);
                        setCache(params.slice());
                        setGraph(
                          graphBuilderOptions({
                            title: "Comfort and Sensation vs. Time",
                            data: tempArr,
                            legends: ["Comfort", "Sensation"],
                          })
                        );
                        let colorsArr = [];
                        for (let time = 0; time < res.data.length; time++) {
                          let bodyPartsArr = [];
                          for (let i = 0; i <= 17; i++) {
                            bodyPartsArr.push(
                              determineColor([
                                res.data[time][places[i]].comfort,
                                res.data[time][places[i]].sensation,
                              ])
                            );
                          }
                          colorsArr.push(bodyPartsArr);
                        }
                        setBodyColors(colorsArr);
                        setCurrentColorArray(Array(18).fill("white"));
                        loadingModal.onClose();
                      });
                  } catch (err) {
                    loadingModal.onClose();
                    alert("An error has occurred. Please try again.");
                    console.log(err);
                  }
                }}
                isDisabled={params.some((elem) => !elem.met_value)}
              >
                Run simulation
              </Button>
            </div>
          </VStack>

          <VStack w="70%">
            {graphOptions ? (
              <>
                <VStack
                  alignSelf="center"
                  backgroundColor="gray.200"
                  padding={5}
                  spacing={8}
                  w="100%"
                  borderRadius="10px"
                >
                  <HStack>
                    <RSelect
                      className="basic-single"
                      classNamePrefix="select"
                      defaultValue={graphsVals[numtoGraph]}
                      isSearchable={true}
                      isClearable={false}
                      options={graphsVals}
                      instanceId="zjhddiasdwjh1oi2euiAUSD901289990198"
                      styles={{
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          width: "20vw",
                        }),
                      }}
                      placeholder="Input body part to graph."
                      onChange={(val) => {
                        loadingModal.onOpen();
                        setNumToGraph(val.value);
                        let changedArr = [];
                        for (let j = 0; j < fullData.length; j++) {
                          changedArr.push(fullData[j][val.value]);
                        }
                        setData(changedArr);
                        setGraph(
                          graphBuilderOptions({
                            title:
                              "Comfort and Sensation vs. Time - " + val.label,
                            data: changedArr,
                            legends: ["Comfort", "Sensation"],
                          })
                        );
                        loadingModal.onClose();
                      }}
                    />
                  </HStack>
                  <HStack w="100%">
                    <VStack w="75%">
                      <Box width="100%" height="40vh">
                        <ReactECharts
                          notMerge={true}
                          option={graphOptions}
                          onEvents={onEvents}
                          style={{ height: "100%" }}
                        />
                      </Box>
                    </VStack>
                    <VStack w="25%">
                      <Text fontWeight="bold">
                        {params[currIndex[0]].condition_name}{" "}
                        <span style={{ color: "red", marginLeft: "5px" }}>
                          {" "}
                          {currIndex[1]} mins{" "}
                        </span>
                      </Text>
                      <Canvass currentColorArray={currentColorArray} />
                      <Text>Drag to rotate model.</Text>
                      <Text
                        fontWeight="black"
                        color={colorComfort(graphData[currIndex[1]].comfort)}
                      >
                        {graphData[currIndex[1]].comfort.toFixed(2)} comfort
                      </Text>
                      <Text
                        fontWeight="black"
                        color={colorSensation(
                          graphData[currIndex[1]].sensation
                        )}
                      >
                        {" "}
                        {graphData[currIndex[1]].sensation.toFixed(2)} sensation
                      </Text>
                    </VStack>
                  </HStack>
                </VStack>
              </>
            ) : (
              <Text>
                No simulation run yet. Please input data and{" "}
                <span style={{ fontWeight: "bold" }}>Run simulation</span>.
              </Text>
            )}
          </VStack>
        </HStack>
      </Fade>
    </Box>
  );
}
