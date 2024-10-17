import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Checkbox,
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
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderMark,
  Tooltip,
  MenuOptionGroup,
  MenuItemOption,
} from "@chakra-ui/react";
import RSelect from "react-select";
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  AddIcon,
  CheckIcon,
  EditIcon,
  ViewIcon,
} from "@chakra-ui/icons";
import clo_correspondence from "../reference/local clo input/clothing_ensembles.json";
import Head from "next/head";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
const ReactECharts = dynamic(() => import("echarts-for-react"), { ssr: false });

import {
  met_auto,
  places,
  listOfParameters,
  graphsVals,
  conditionParams,
  csvHeaderLine,
  signals,
  modes,
  bodyBuildParams,
  personalComfortSystem,
} from "@/constants/constants";

import {
  determineColor,
  convertResultToArrayForCSV,
  findMin,
  findMax,
  getSaveFilePicker,
  determineColorFunction,
  cToF,
  msToMph,
  msToFpm,
} from "@/constants/helperFunctions";
import AboutModal from "@/components/aboutModal";
import OptionRenderer from "@/components/optionRenderer";
import Canvass from "@/components/model";
import EditModal from "@/components/editModal";
import UploadModal from "@/components/uploadParam";
import Spinner from "@/components/spinner";
import ClothingSelector from "@/components/clothingSelector";
import MetSelector from "@/components/metSelector";
import Image from "next/image";
import { CSVDownload, CSVLink } from "react-csv";
import {
  comfBuilder,
  environmentBuilder,
  hfluxBuilder,
  sensBuilder,
  tcoreBuilder,
  tskinBuilder,
} from "@/components/graphBuilder";
import CloseButton from "@/components/closeButton";
import AdvancedSettingsModal from "@/components/advancedSettingsModal";

export default function WithSubnavigation() {
  const [isMetric, setMetric] = useState(true);

  const { isOpen, onToggle } = useDisclosure();
  const [params, setParams] = useState([conditionParams(1)]);

  const [bodybuilderObj, setBodyBuilderObj] = useState(bodyBuildParams);
  const [pcsParams, setPcsParams] = useState(personalComfortSystem);

  const [metIndex, setMetIndex] = useState(1);
  const [currentlyEditing, setCurrentlyEditing] = useState(1);
  const [cache, setCache] = useState();
  const [numtoGraph, setNumToGraph] = useState(0);
  const [fullData, setFullData] = useState([]);

  const [ind, setIndex] = useState(0);
  const [advInd, setAdvIndex] = useState(0);

  const [currIndex, setCurrIndex] = useState([0, 0]);
  const [metOptions, setMetOptions] = useState(met_auto);
  const [graphOptions, setGraph] = useState();
  const [graphData, setData] = useState([]);

  const loadingModal = useDisclosure();
  const editModal = useDisclosure();
  const uploadModal = useDisclosure();
  const [refreshKey, setRefreshKey] = useState(Math.random());
  const advancedModal = useDisclosure();

  const [bodyColors, setBodyColors] = useState([]);
  const [currentColorArray, setCurrentColorArray] = useState(
    Array(18).fill("white")
  );

  const [csvData, setCSVData] = useState();
  const [currentChoiceToGraph, setCurrentChoiceToGraph] = useState("comfort");
  const [sliderMaxVal, setSliderMaxVal] = useState(0);
  const [sliderVal, setSliderVal] = useState([0, 0]);
  const [comfortView, setComfortView] = useState(true);

  const [isComparing, setComparing] = useState(false);
  const [comparedResults, setComparedResults] = useState();
  // tells the upload modal whether the user is currently trying to upload for comparison or not
  const [isInComparingUploadModal, setInComparingUploadModal] = useState(false);
  const [fullDataCompare, setFullDataCompare] = useState([]);
  const [graphDataCompare, setDataCompare] = useState([]);

  const [cloTable, setCloTable] = useState(clo_correspondence);

  const decideGraph = (
    metric,
    tempArr,
    compareArr,
    value,
    frontOffset = 0,
    choice = ""
  ) => {
    let graphedChoice = choice;
    if (graphedChoice == "") graphedChoice = currentChoiceToGraph;
    if (graphedChoice == "sensation") {
      if (compareArr.length == 0) {
        return sensBuilder({
          data: [tempArr],
          legends: ["Sensation"],
          offset: frontOffset,
        });
      } else {
        return sensBuilder({
          data: [tempArr, compareArr],
          legends: ["Sensation", "Compared sensation"],
          offset: frontOffset,
        });
      }
    } else if (graphedChoice == "comfort") {
      if (compareArr.length == 0) {
        return comfBuilder({
          data: [tempArr],
          legends: ["Comfort"],
          offset: frontOffset,
        });
      } else {
        return comfBuilder({
          data: [tempArr, compareArr],
          legends: ["Comfort", "Compared comfort"],
          offset: frontOffset,
        });
      }
    } else if (graphedChoice == "tskin") {
      if (!metric) {
        tempArr = tempArr.slice().map((obj) => {
          const o = { ...obj };
          o.tskin = cToF(o.tskin);
          return o;
        });
        compareArr = compareArr.slice().map((obj) => {
          const o = { ...obj };
          o.tskin = cToF(o.tskin);
          return o;
        });
      }
      if (compareArr.length == 0) {
        return tskinBuilder({
          data: [tempArr],
          legends: ["Skin Temperature"],
          offset: frontOffset,
          metric: metric,
        });
      } else {
        return tskinBuilder({
          data: [tempArr, compareArr],
          legends: ["Skin Temperature", "Compared skin temp"],
          offset: frontOffset,
          metric: metric,
        });
      }
    } else if (graphedChoice == "tcore") {
      let tcoreArr = [...tempArr],
        tcoreArrCompared = [...compareArr];
      if (value == 0) {
        // overall
        for (let i = 0; i < tcoreArr.length; i++) {
          tcoreArr[i].tcore = tcoreArr[i].tblood;
        }
        for (let i = 0; i < tcoreArrCompared.length; i++) {
          tcoreArrCompared[i].tcore = tcoreArr[i].tblood;
        }
      }
      if (!metric) {
        tcoreArr = tcoreArr.map((obj) => {
          const o = { ...obj };
          o.tcore = cToF(o.tcore);
          return o;
        });
        tcoreArrCompared = tcoreArrCompared.map((obj) => {
          const o = { ...obj };
          o.tcore = cToF(o.tcore);
          return o;
        });
      }
      if (compareArr.length == 0) {
        return tcoreBuilder({
          data: [tcoreArr],
          legends: ["Core Temperature"],
          offset: frontOffset,
          metric: metric,
        });
      } else {
        return tcoreBuilder({
          data: [tcoreArr, tcoreArrCompared],
          legends: ["Core Temperature", "Compared core temp"],
          offset: frontOffset,
          metric: metric,
        });
      }
    } else if (graphedChoice == "hflux") {
      if (value == 0) {
        // overall
        return hfluxBuilder({
          data: tempArr,
          legends: ["q_met", "q_conv", "q_rad", "q_solar", "q_resp", "q_sweat"],
          offset: frontOffset,
        });
      } else {
        return hfluxBuilder({
          data: tempArr,
          legends: [
            "q_met",
            "q_conv",
            "q_rad",
            "q_solar",
            "q_resp",
            "q_sweat",
            "q_blood",
            "q_blood_skin",
          ],
          offset: frontOffset,
        });
      }
    } else if (graphedChoice == "environment") {
      if (!metric) {
        tempArr = tempArr.slice().map((obj) => {
          const o = { ...obj };
          o.ta = cToF(o.ta);
          o.mrt = cToF(o.mrt);
          o.eht = cToF(o.eht);
          o.v = msToFpm(o.v);
          return o;
        });
      }
      return environmentBuilder({
        data: tempArr,
        legends: ["ta", "mrt", "solar", "eht", "rh", "v"],
        offset: frontOffset,
        metric: metric,
      });
    }
  };

  function EditableControls({ isHome = false }) {
    const { isEditing, getSubmitButtonProps, getEditButtonProps } =
      useEditableControls();

    return isEditing ? (
      <IconButton
        backgroundColor={"cbe.lightBlue"}
        textColor={"white"}
        colorScheme="blue"
        icon={<CheckIcon />}
        {...getSubmitButtonProps()}
      />
    ) : (
      <>
        {isHome ? (
          <HStack justifyContent={"center"} spacing={2}>
            <IconButton
              backgroundColor={"cbe.lightBlue"}
              textColor={"white"}
              colorScheme="blue"
              icon={<EditIcon />}
              {...getEditButtonProps()}
            />
            <CloseButton
              params={params}
              ind={ind}
              setParams={setParams}
              setIndex={setIndex}
              //setRamp={setRamp}
            />
          </HStack>
        ) : (
          <IconButton
            backgroundColor={"cbe.lightBlue"}
            textColor={"white"}
            colorScheme="blue"
            icon={<EditIcon />}
            {...getEditButtonProps()}
          />
        )}
      </>
    );
  }

  const toast = useToast();

  useEffect(() => {}, [
    metIndex,
    graphOptions,
    ind,
    numtoGraph,
    currentColorArray,
    isInComparingUploadModal,
    isComparing,
  ]);

  useEffect(() => {
    if (comparedResults) {
      runSimulationManager();
    }
  }, [comparedResults]);

  const onEvents = useMemo(
    () => ({
      click: (params) => {
        let tempColorArr = [];
        for (let i = 0; i < bodyColors[params.dataIndex].length; i++) {
          tempColorArr.push(bodyColors[params.dataIndex][i]);
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

  const runSimulationManager = async (
    metric = isMetric,
    comparing = isComparing
  ) => {
    if (comparing) {
      let totDurationMain = 0,
        totDurationComparing = 0;
      // check if each condition's duration is the same
      for (let i = 0; i < params.length; i++) {
        totDurationMain += params[i].exposure_duration;
      }
      for (let i = 0; i < compResults.length; i++) {
        totDurationComparing += compResults[i].exposure_duration;
      }
      if (totDurationMain != totDurationComparing) {
        toast.closeAll();
        toast({
          title:
            "The total exposure duration of your current config and your comparison file don't match.",
          status: "warning",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
        return;
      }

      // run data processing for each configuration
      const tempArrMain = await runSimulationMain();
      const tempArrCompare = await runSimulationCompare();

      // do graph logic here
      setGraph(decideGraph(metric, tempArrMain, tempArrCompare, numtoGraph));
    } else {
      const tempArrMain = await runSimulationMain();

      // do graph logic here
      setGraph(decideGraph(metric, tempArrMain, [], numtoGraph));
    }
  };

  const runSimulationCompare = async () => {
    loadingModal.onOpen();
    try {
      let phases = [];
      for (let i = 0; i < comparedResults.length; i++) {
        let new_air_speed = comparedResults[i].air_speed.map(Number);
        let new_air_temperature =
          comparedResults[i].air_temperature.map(Number);
        let new_radiant_temperature =
          comparedResults[i].radiant_temperature.map(Number);

        comparedResults[i].personal_comfort_system.forEach((elemIndex) => {
          for (let j = 0; j < 16; j++) {
            new_air_speed[j] += pcsParams[elemIndex]["v"][j];
            new_air_temperature[j] += pcsParams[elemIndex]["ta"][j];
            new_radiant_temperature[j] += pcsParams[elemIndex]["mrt"][j];
          }
        });

        phases.push({
          exposure_duration: comparedResults[i].exposure_duration,
          met_activity_name: "Custom-defined Met Activity",
          ramp: comparedResults[i].ramp,
          met_activity_value: parseFloat(comparedResults[i].met_value),
          relative_humidity: comparedResults[i].relative_humidity.map(function (
            x
          ) {
            return parseFloat(x) / 100;
          }),
          air_speed: new_air_speed,
          air_temperature: new_air_temperature,
          radiant_temperature: new_radiant_temperature,
          clo_ensemble_name:
            cloTable[parseInt(comparedResults[i].clo_value)].ensemble_name,
        });
      }
      let bodyb = bodybuilderObj;
      let clothing = cloTable;
      const metrics = await axios
        .post("/api/process", {
          // Chaining of data is intentional
          phases,
          bodyb,
          clothing,
          raw: false,
        })
        .then((res) => {
          // Failure case: res.data.success = false
          // Success case: res.data does not have a "success" property
          if ("success" in res.data) {
            loadingModal.onClose();
            alert("An error has occurred. Please try again.");
            return;
          }

          let tempArr = [];
          for (let j = 0; j < res.data.length; j++) {
            tempArr.push({
              ...res.data[j][numtoGraph],
              index: j,
            });
          }
          setDataCompare(tempArr);
          setFullDataCompare(res.data);

          setComfortView(false);
          loadingModal.onClose();
          return tempArr;
        });
      return metrics;
    } catch (err) {
      loadingModal.onClose();
      alert("An error has occurred. Please try again.");
      console.log(err);
    }
  };

  const runSimulationMain = async () => {
    loadingModal.onOpen();
    try {
      let phases = [];

      // Iterate over the params to build the phase data
      for (let i = 0; i < params.length; i++) {
        let new_air_speed = params[i].air_speed.map(Number);
        let new_air_temperature = params[i].air_temperature.map(Number);
        let new_radiant_temperature = params[i].radiant_temperature.map(Number);

        // Adjust air speed, air temperature, and radiant temperature based on PCS
        params[i].personal_comfort_system.forEach((elemIndex) => {
          for (let j = 0; j < 16; j++) {
            new_air_speed[j] += pcsParams[elemIndex]["v"][j];
            new_air_temperature[j] += pcsParams[elemIndex]["ta"][j];
            new_radiant_temperature[j] += pcsParams[elemIndex]["mrt"][j];
          }
        });

        // Push each phase data into the phases array with the calculated values
        phases.push({
          exposure_duration: params[i].exposure_duration,
          met_activity_name: "Custom-defined Met Activity",
          ramp: params[i].ramp,
          met_activity_value: parseFloat(params[i].met_value),
          relative_humidity: params[i].relative_humidity.map(function (x) {
            return parseFloat(x) / 100;
          }),
          air_speed: new_air_speed,
          air_temperature: new_air_temperature,
          radiant_temperature: new_radiant_temperature,
          clo_ensemble_name:
            cloTable[parseInt(params[i].clo_value)].ensemble_name,
        });
      }

      // Define body and clothing objects
      let bodyb = bodybuilderObj;
      let clothing = cloTable;

      // Make an API request to send the phases, body, and clothing data for simulation
      const metrics = await axios
        .post("/api/process", {
          // Chaining of data is intentional
          phases,
          bodyb,
          clothing,
          raw: false,
        })
        .then((res) => {
          if ("success" in res.data) {
            loadingModal.onClose();
            alert("An error has occurred. Please try again.");
            return;
          }
          
          // Prepare an array to store the processed data
          let tempArr = [];
          for (let j = 0; j < res.data.length; j++) {
            tempArr.push({
              ...res.data[j][numtoGraph],
              index: j,
            });
          }
          // Update state with the processed data
          setData(tempArr);
          setFullData(res.data);
          setCache(params.slice());

          // Calculate total exposure duration from all phases
          let totalDuration = 0;
          for (let i = 0; i < params.length; i++) {
            totalDuration += params[i].exposure_duration;
          }

          // Set slider values based on total duration
          setSliderMaxVal(totalDuration);
          setSliderVal([1, totalDuration]);
          
          // Prepare color values for each body part
          let colorsArr = [];
          let mins = [],
            maxes = [];
          for (let i = 0; i <= 17; i++) {
            mins.push(findMin(res.data, places[i], currentChoiceToGraph));
            maxes.push(findMax(res.data, places[i], currentChoiceToGraph));
          }
          for (let time = 0; time < res.data.length; time++) {
            let bodyPartsArr = [];
            for (let i = 0; i <= 17; i++) {
              bodyPartsArr.push(
                determineColor(
                  res.data[time][places[i]],
                  currentChoiceToGraph,
                  mins[i],
                  maxes[i]
                )
              );
            }
            colorsArr.push(bodyPartsArr);
          }
          // Update body colors and current colors in the UI
          setBodyColors(colorsArr);
          setCurrentColorArray(Array(18).fill("white"));

          // Prepare CSV data for export (Aki is here)
          let data = [];
          data.push(csvHeaderLine);
          for (let time = 0; time < res.data.length; time++) {
            let tempRow = [time];
            tempRow.push(...convertResultToArrayForCSV(res.data[time][0]));
            for (let i = 0; i < signals.length; i++) {
              for (let j = 1; j < res.data[time].length; j++) {
                tempRow.push(res.data[time][j][signals[i].slice(0, -1)]);
              }
            }
            data.push(tempRow);
          }
          setCSVData(data);
          setComfortView(false);
          loadingModal.onClose();
          return tempArr;
        });
      return metrics;
    } catch (err) {
      loadingModal.onClose();
      alert("An error has occurred. Please try again.");
      console.log(err);
    }
  };

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Head>
        <title>Advanced Berkeley Comfort (ABC) model</title>
        <link
          rel="icon"
          href="/img/ABC model logo/svg/ABC logo_square_blue.svg"
          type="image/svg+xml"
        />
      </Head>
      <Flex flex="1" flexDirection="column">
        <EditModal
          disclosure={editModal}
          currentlyEditing={currentlyEditing}
          params={params}
          ind={ind}
          setParams={setParams}
          isMetric={isMetric}
        />
        <UploadModal
          disclosure={uploadModal}
          params={params}
          ind={ind}
          setParams={setParams}
          setMetIndex={setMetIndex}
          cloTable={cloTable}
          setCloTable={setCloTable}
          conditionParams={conditionParams}
          toast={toast}
          isUploadingForComparison={isInComparingUploadModal}
          setIsUploadingForComparison={setInComparingUploadModal}
          comparedResults={comparedResults}
          setComparedResults={setComparedResults}
          setComparing={setComparing}
          rKey={setRefreshKey}
        />
        <AdvancedSettingsModal
          disclosure={advancedModal}
          bbParams={bodybuilderObj}
          pcsParams={pcsParams}
          ind={advInd}
          setAdvIndex={setAdvIndex}
          setbbParams={setBodyBuilderObj}
          params={params}
          setParams={setParams}
          setPcsParams={setPcsParams}
          isMetric={isMetric}
        />
        <Spinner loadingModal={loadingModal} />
        <Flex
          bg={useColorModeValue("cbe.grey", "gray.800")}
          minH={"60px"}
          py={{ base: 2 }}
          px={{ base: 4 }}
          borderBottom={1}
          borderStyle={"solid"}
          borderColor={useColorModeValue("gray.300", "gray.900")}
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
                isOpen ? (
                  <CloseIcon w={3} h={3} />
                ) : (
                  <HamburgerIcon w={5} h={5} />
                )
              }
              variant={"ghost"}
              aria-label={"Toggle Navigation"}
            />
          </Flex>
          {/* Header */}
          <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }}>
            <a
              href="https://example.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/img/ABC model logo/svg/ABC logo_square_blue.svg"
                width={50}
                height={50}
                alt="ABC Logo"
              />
            </a>
            <Box ml={5}>
              <Text
                textAlign={useBreakpointValue({ base: "center", md: "left" })}
                fontFamily="Arial"
                fontWeight="bold"
                fontSize={35}
                textColor="cbe.blue"
              >
                <span style={{ color: "cbe.blue" }}>
                  Advanced Berkeley Comfort Tool
                </span>
              </Text>
            </Box>
            <Flex display={{ base: "none", md: "flex" }} ml={10}></Flex>
          </Flex>
          <Stack
            flex={{ base: 1, md: 0 }}
            justify={"flex-end"}
            direction={"row"}
            spacing={2}
            alignItems={"center"}
            textColor="cbe.lightBlue"
          >
            <AboutModal />
            <a
              href="https://cbe-berkeley.gitbook.io/advanced-berkeley-comfort-abc-model"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Text as="span" mr={5}>
                Documentation
              </Text>
            </a>
            <a
              href="https://cbe.berkeley.edu/resources/tools/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Text as="span" mr={5} whiteSpace="nowrap">
                More CBE Tools
              </Text>
            </a>
            <Text style={{ color: "gray" }}>SI</Text>
            <Switch
              size="lg"
              onChange={(e) => {
                setMetric(!e.target.checked);
                if (fullData.length > 0)
                  runSimulationManager(!e.target.checked, isComparing);
              }}
            />
            <Text mr={5} style={{ color: "gray" }}>
              IP
            </Text>
          </Stack>
        </Flex>
        <Collapse in={isOpen} animateOpacity></Collapse>
        <Fade
          in={true}
          style={{ width: "100%" }}
          transition={{ enter: { duration: 0.5 } }}
        >
          {!comfortView ? (
            <HStack margin="20px" h="100%" alignItems="flex-start" spacing={5}>
              <VStack w="30%" h="100%">
                <HStack w="100%" padding={2} alignItems="flex-start">
                  <HStack w="90%" overflowY={"scroll"} spacing={3}>
                    {params.map((elem, indx) => {
                      return (
                        <Button
                          key={indx}
                          minW="110px"
                          backgroundColor={
                            ind == indx ? "#1b75bc" : "cbe.lightBlue"
                          }
                          textColor="white"
                          colorScheme="blue"
                          onClick={() => {
                            if (ind == indx) return false;
                            else setIndex(indx);
                          }}
                        >
                          {params[indx].condition_name.length > 13
                            ? params[indx].condition_name.substring(0, 13) +
                              "..."
                            : params[indx].condition_name}
                        </Button>
                      );
                    })}
                  </HStack>
                  <IconButton
                    w="5%"
                    colorScheme="red"
                    backgroundColor={"red.300"}
                    // border="2px solid gray"
                    textColor={"white"}
                    icon={<AddIcon />}
                    onClick={() => {
                      setParams([
                        ...params,
                        conditionParams(params.length + 1),
                      ]);
                      setIndex(ind + 1);
                    }}
                  ></IconButton>
                </HStack>
                <VStack
                  w="100%"
                  // borderColor="#1b75bc"
                  borderWidth="1px"
                  background={"cbe.grey"}
                  borderRadius="10px"
                  padding={5}
                  spacing={1}
                  alignItems="flex-start"
                >
                  <>
                    {/* Editable input for condition name */}
                    <Flex w="100%" alignItems="center">
                      <Editable
                        value={params[ind].condition_name}
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
                        <IconButton
                          w="5%"
                          colorScheme="red"
                          backgroundColor={"red.300"}
                          icon={<CloseIcon />}
                          isDisabled={params.length == 1}
                          onClick={() => {
                            let tempParams = [...params];
                            tempParams.splice(ind, 1);
                            setParams(tempParams);
                            setIndex(Math.max(0, ind - 1));
                          }}
                          ml="10px"
                        ></IconButton>
                      </Editable>
                    </Flex>
                    {/* Input parameters */}
                    <HStack w="100%" alignItems="flex-start">
                      {/* Left side */}
                      <VStack w="45%" alignItems="flex-start">
                        {listOfParameters(isMetric).map((option) => {
                          return (
                            <div key={option.title}>
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
                                  comp: option.comp,
                                  step: option.step,
                                  deltaKey: option.deltaKey,
                                  isMetric: isMetric,
                                  conversionFunction: option.conversionFunction,
                                }}
                              />
                            </div>
                          );
                        })}
                      </VStack>
                      {/* Right side */}
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
                          key={refreshKey}
                        />
                        <ClothingSelector
                          params={params}
                          setParams={setParams}
                          clo_correspondence={cloTable}
                          ind={ind}
                        />
                        <Text color="gray.600">
                          {cloTable[params[ind].clo_value].whole_body.iclo} clo
                          -{" "}
                          <span style={{ fontSize: "13px", color: "gray.600" }}>
                            {cloTable[params[ind].clo_value].description}
                          </span>
                        </Text>
                        <Menu placement="top" closeOnSelect={false}>
                          <MenuButton
                            as={Button}
                            rightIcon={<ChevronDownIcon />}
                            w="200px"
                            background={"white"}
                            colorScheme="gray"
                            variant="outline"
                          >
                            Personal comfort
                          </MenuButton>
                          <MenuList>
                            {pcsParams.map((e, index) => {
                              if (params) {
                                return (
                                  <MenuItem
                                    key={e.name}
                                    onClick={() => {
                                      let tempParams = [...params];
                                      if (
                                        params[ind].personal_comfort_system.has(
                                          index
                                        )
                                      ) {
                                        tempParams[
                                          ind
                                        ].personal_comfort_system.delete(index);
                                      } else {
                                        tempParams[
                                          ind
                                        ].personal_comfort_system.add(index);
                                      }
                                      setParams(tempParams);
                                    }}
                                  >
                                    <HStack spacing={0}>
                                      <div
                                        style={{
                                          height: "100%",
                                          width: "25px",
                                        }}
                                      >
                                        {params[
                                          ind
                                        ].personal_comfort_system.has(index) ? (
                                          <CheckIcon />
                                        ) : (
                                          <></>
                                        )}
                                      </div>
                                      <Text mr={2} verticalAlign={"center"}>
                                        {e.name}
                                      </Text>
                                      {e.icons}
                                    </HStack>
                                  </MenuItem>
                                );
                              } else return <></>;
                            })}
                          </MenuList>
                        </Menu>
                        <Menu placement="top">
                          <MenuButton
                            as={Button}
                            rightIcon={<ChevronDownIcon />}
                            w="200px"
                            backgroundColor={"cbe.lightBlue"}
                            textColor={"white"}
                            colorScheme="blue"
                          >
                            Edit data
                          </MenuButton>
                          <MenuList>
                            {listOfParameters(isMetric).map((e, ind) => {
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
                    <Text style={{ marginTop: "10px" }}>
                      These values are averages. Click &quot;Edit data&quot; to
                      see your input data more accurately.
                    </Text>
                  </>
                </VStack>
              </VStack>

              {/* Result section */}
              <VStack w="70%">
                {graphOptions ? (
                  <>
                    {/* <VStack
                      alignSelf="center"
                      // borderColor="#1b75bc"
                      bgColor="gray.200"
                      // borderWidth="1px"
                      padding={5}
                      spacing={8}
                      w="100%"
                      borderRadius="10px"
                    > */}
                    <VStack
                      alignSelf="center"
                      // borderColor="#1b75bc"
                      bgColor="cbe.grey"
                      borderWidth="1px"
                      padding={5}
                      spacing={8}
                      w="100%"
                      borderRadius="10px"
                    >
                      <HStack>
                        {/* Body segment selection*/}
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
                            let changedArr = [],
                              changedArrCompare = [];
                            for (let j = 0; j < fullData.length; j++) {
                              changedArr.push({
                                ...fullData[j][val.value],
                                index: j,
                              });
                            }
                            setData(changedArr);

                            if (isComparing) {
                              for (let j = 0; j < fullDataCompare.length; j++) {
                                changedArrCompare.push({
                                  ...fullDataCompare[j][val.value],
                                  index: j,
                                });
                              }
                              setDataCompare(changedArrCompare);
                            }

                            setGraph(
                              decideGraph(
                                isMetric,
                                changedArr,
                                changedArrCompare,
                                val.value
                              )
                            );
                            loadingModal.onClose();
                          }}
                        />
                        {/* Result variable to display*/}
                        <RSelect
                          className="basic-single"
                          classNamePrefix="select"
                          isSearchable={true}
                          isClearable={false}
                          options={modes}
                          instanceId="zjhsdwjhiasd1oi2euiAUSD901289990198"
                          styles={{
                            control: (baseStyles, state) => ({
                              ...baseStyles,
                              width: "20vw",
                            }),
                          }}
                          placeholder={"Comfort"}
                          onChange={(val) => {
                            loadingModal.onOpen();
                            setCurrentChoiceToGraph(val.value);
                            setGraph(
                              decideGraph(
                                isMetric,
                                graphData.slice(sliderVal[0], sliderVal[1]),
                                graphDataCompare.slice(
                                  sliderVal[0],
                                  sliderVal[1]
                                ),
                                numtoGraph,
                                sliderVal[0],
                                val.value
                              )
                            );

                            let colorsArr = [];
                            let mins = [],
                              maxes = [];
                            for (let i = 0; i <= 17; i++) {
                              mins.push(
                                findMin(fullData, places[i], val.value)
                              );
                              maxes.push(
                                findMax(fullData, places[i], val.value)
                              );
                            }
                            for (let time = 0; time < fullData.length; time++) {
                              let bodyPartsArr = [];
                              for (let i = 0; i <= 17; i++) {
                                bodyPartsArr.push(
                                  determineColor(
                                    fullData[time][places[i]],
                                    val.value,
                                    mins[i],
                                    maxes[i]
                                  )
                                );
                              }
                              colorsArr.push(bodyPartsArr);
                            }
                            setBodyColors(colorsArr);
                            setCurrentColorArray(Array(18).fill("white"));

                            loadingModal.onClose();
                          }}
                        />
                        {/* CSV output */}
                        <Button colorScheme="green" background={"green.400"}>
                          <CSVLink
                            data={csvData}
                            filename={`ABCWEB_${new Date().toDateString({
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            })}-${new Date()
                              .toTimeString()
                              .replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1")}.csv`}
                            target="_blank"
                          >
                            Export to CSV
                          </CSVLink>
                        </Button>
                      </HStack>
                      {/* Timeseries results and manikin */}
                      <HStack w="100%">
                        {/* Timeseries results */}
                        <VStack w="75%" alignItems="flex-start">
                          <Box width="100%">
                            <HStack w="100%" h="45vh">
                              <VStack w="98.5%" h="100%">
                                {/* Graph */}
                                <ReactECharts
                                  notMerge={true}
                                  option={graphOptions}
                                  onEvents={onEvents}
                                  style={{ height: "100%", width: "100%" }}
                                />
                                {/* Slider */}
                                <RangeSlider
                                  left="5%"
                                  right="5%"
                                  top="5%"
                                  w="85%"
                                  value={sliderVal}
                                  min={1}
                                  max={sliderMaxVal}
                                  step={1}
                                  onChange={(e) => {
                                    setSliderVal([e[0], e[1]]);
                                    let tempArr = [],
                                      tempArrCompare = [];
                                    for (let j = e[0]; j <= e[1]; j++) {
                                      tempArr.push({
                                        ...fullData[j - 1][numtoGraph],
                                        index: j - 1,
                                      });
                                      if (isComparing) {
                                        tempArrCompare.push({
                                          ...fullDataCompare[j - 1][numtoGraph],
                                          index: j - 1,
                                        });
                                      }
                                    }
                                    setGraph(
                                      decideGraph(
                                        isMetric,
                                        tempArr,
                                        tempArrCompare,
                                        numtoGraph,
                                        e[0] - 1
                                      )
                                    );
                                  }}
                                >
                                  <RangeSliderTrack height="10px" bg="gray.300">
                                    <RangeSliderFilledTrack bg="cbe.blue" />
                                  </RangeSliderTrack>
                                  <Tooltip
                                    label={`${sliderVal[0]} mins`}
                                    placement="top"
                                  >
                                    <RangeSliderThumb
                                      borderWidth="7px"
                                      boxSize={3}
                                      index={0}
                                    />
                                  </Tooltip>
                                  <Tooltip
                                    label={`${sliderVal[1]} mins`}
                                    placement="top"
                                  >
                                    <RangeSliderThumb
                                      borderWidth="7px"
                                      boxSize={3}
                                      index={1}
                                    />
                                  </Tooltip>
                                </RangeSlider>
                                <div
                                  style={{
                                    marginTop: "15px",
                                  }}
                                >
                                  <Text>
                                    Drag ends of slider to adjust. Min is{" "}
                                    <b>{sliderVal[0]}</b> min from start, and
                                    max is <b>{sliderVal[1]}</b> min from start.
                                  </Text>
                                </div>
                              </VStack>
                              {/* Color bar */}
                              <Box
                                w="1.5%"
                                h="28vh"
                                style={{ opacity: 0.8, marginTop: "-4%" }}
                              >
                                {determineColorFunction(currentChoiceToGraph)}
                              </Box>
                            </HStack>
                          </Box>
                        </VStack>
                        {/* Manikin visualization */}
                        <VStack w="25%">
                          <Text fontWeight="bold">
                            {params[currIndex[0]].condition_name}{" "}
                            <span
                              style={{
                                color: "cbe.lightBlue",
                                marginLeft: "5px",
                              }}
                            >
                              {" "}
                              {currIndex[1]} mins{" "}
                            </span>
                          </Text>
                          <Text textAlign="center" w="100%">
                            Click a point to visualize on manikin.{" "}
                            {isComparing ? (
                              <Text fontWeight="bold">
                                Only results from your current input will be
                                displayed, not comparison ones.
                              </Text>
                            ) : (
                              ""
                            )}
                          </Text>
                          {/* There is no color shema for heat flux and envirnmental variables */}
                          <Canvass currentColorArray={currentColorArray} />
                          {currentChoiceToGraph == "hflux" ||
                          currentChoiceToGraph == "environment" ? (
                            <Text>No color scheme for this variable.</Text>
                          ) : (
                            <></>
                          )}
                          <Text>Drag to rotate model.</Text>
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
          ) : (
            <>
              {/* Wide view mode */}
              <VStack
                w="100%"
                minH="60vh"
                margin="50px"
                alignItems="center"
                justifyContent="center"
              >
                {/* Adding conditions at the top*/}
                <HStack w="30%" overflowX="auto" spacing={3} justifyContent="center">
                  {/* A condition botton */}
                  <HStack w="100%" overflowY={"scroll"} spacing={3}>
                    {params.map((elem, indx) => {
                      return (
                        <Button
                          key={indx}
                          minW="110px"
                          backgroundColor={
                            ind == indx ? "cbe.lue" : "cbe.lightBlue"
                          }
                          textColor="white"
                          colorScheme="blue"
                          onClick={() => {
                            if (ind == indx) return false;
                            else setIndex(indx);
                          }}
                        >
                          {params[indx].condition_name.length > 13
                            ? params[indx].condition_name.substring(0, 13) +
                              "..."
                            : params[indx].condition_name}
                        </Button>
                      );
                    })}
                  </HStack>
                  {/* + Botton for adding conditions */}
                  <IconButton
                    w="5%"
                    colorScheme="red"
                    backgroundColor={"red.300"}
                    textColor={"white"}
                    icon={<AddIcon />}
                    onClick={() => {
                      setParams([
                        ...params,
                        conditionParams(params.length + 1),
                      ]);
                      setIndex(ind + 1);
                    }}
                  ></IconButton>
                </HStack>
                {/* Main condition section*/}
                <VStack
                  minW="60%"
                  background={"cbe.grey"}
                  borderColor="gray.300"
                  borderWidth="1px"
                  borderRadius="10px"
                  padding={5}
                  spacing={1}
                  alignItems="flex-start"
                >
                  <>
                    {/* Condition title */}
                    <Flex w="100%" alignItems="center" justifyContent="center">
                      <Editable
                        value={params[ind].condition_name}
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
                        <EditableControls isHome />
                      </Editable>
                    </Flex>
                    {/* Contents */}
                    <HStack w="100%" alignItems="flex-start" spacing={5}>
                      {/* Left side input items */}
                      <VStack pl={200} w="50%" alignItems="flex-start">
                        {listOfParameters(isMetric).map((option) => {
                          return (
                            <div key={option.title}>
                              <OptionRenderer
                                {...{
                                  params: params,
                                  setParams: setParams,
                                  ind: ind,
                                  setIndex: ind,
                                  title: option.fullTitle,
                                  icon: option.icon,
                                  unit: option.fullUnit,
                                  val: option.val,
                                  comp: option.comp,
                                  step: option.step,
                                  deltaKey: option.deltaKey,
                                  isMetric: isMetric,
                                  conversionFunction: option.conversionFunction,
                                  isHome: true,
                                }}
                              />
                            </div>
                          );
                        })}
                      </VStack>
                      {/* Right side input items */}
                      <VStack
                        pl={0}
                        w="50%"
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
                          isHome
                        />
                        <ClothingSelector
                          params={params}
                          setParams={setParams}
                          clo_correspondence={cloTable}
                          ind={ind}
                          isHome
                        />
                        <Text color="gray.600">
                          {cloTable[params[ind].clo_value].whole_body.iclo} clo
                          -{" "}
                          <span style={{ fontSize: "13px", color: "gray.600" }}>
                            {cloTable[params[ind].clo_value].description}
                          </span>
                        </Text>
                        {/* Ramp function is not working correctly on the backend now */}
                        {/* <Checkbox
                        size="lg"
                        colorScheme="blue"
                        defaultChecked={false}
                        isChecked={params[ind].ramp}
                        onChange={(e) => {
                          setParams((prevParams) => {
                            const updatedParams = [...prevParams];
                            updatedParams[ind].ramp = e.target.checked;
                            return updatedParams;
                          });
                        }}
                      >
                        Ramp
                      </Checkbox> */}
                        <Menu placement="top" closeOnSelect={false}>
                          <MenuButton
                            as={Button}
                            rightIcon={<ChevronDownIcon />}
                            w="60%"
                            colorScheme="gray"
                            background={"white"}
                            variant="outline"
                          >
                            Personal comfort system
                          </MenuButton>
                          <MenuList>
                            <MenuOptionGroup title="Select all that apply.">
                              {pcsParams.map((e, index) => {
                                if (params) {
                                  return (
                                    <MenuItem
                                      key={e.name}
                                      onClick={() => {
                                        let tempParams = [...params];
                                        if (
                                          params[
                                            ind
                                          ].personal_comfort_system.has(index)
                                        ) {
                                          tempParams[
                                            ind
                                          ].personal_comfort_system.delete(
                                            index
                                          );
                                        } else {
                                          tempParams[
                                            ind
                                          ].personal_comfort_system.add(index);
                                        }
                                        setParams(tempParams);
                                      }}
                                    >
                                      <HStack spacing={0}>
                                        <div
                                          style={{
                                            height: "100%",
                                            width: "25px",
                                          }}
                                        >
                                          {params[
                                            ind
                                          ].personal_comfort_system.has(
                                            index
                                          ) ? (
                                            <CheckIcon />
                                          ) : (
                                            <></>
                                          )}
                                        </div>
                                        <Text mr={2} verticalAlign={"center"}>
                                          {e.name}
                                        </Text>
                                        {e.icons}
                                      </HStack>
                                    </MenuItem>
                                  );
                                } else return <></>;
                              })}
                            </MenuOptionGroup>
                          </MenuList>
                        </Menu>
                        <Menu placement="top">
                          <MenuButton
                            as={Button}
                            rightIcon={<ChevronDownIcon />}
                            w="60%"
                            backgroundColor={"cbe.lightBlue"}
                            textColor={"white"}
                            colorScheme="blue"
                          >
                            Edit variable data
                          </MenuButton>
                          <MenuList>
                            {listOfParameters(isMetric).map((e, ind) => {
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
                    <Text
                      textAlign="center"
                      w="100%"
                      style={{ marginTop: "10px" }}
                    >
                      These values are averages. Click &quot;Edit variable
                      data&quot; to see your input data more accurately.
                    </Text>
                  </>
                </VStack>
                <HStack align="center" justifyContent="center">
                  <Button
                    backgroundColor={"cbe.Blue"}
                    textColor={"white"}
                    colorScheme="blue"
                    onClick={() => runSimulationManager()}
                  >
                    Simulate
                  </Button>
                  <Button
                    textColor="gray.600"
                    bgColor="white"
                    borderWidth={2}
                    colorScheme="gray"
                    alignSelf="center"
                    onClick={() => {
                      uploadModal.onOpen();
                    }}
                  >
                    Open
                  </Button>
                  <Button
                    textColor="gray.600"
                    bgColor="white"
                    borderWidth={2}
                    colorScheme="gray"
                    alignSelf="center"
                    onClick={async () => {
                      let phases = [];
                      let currTimer = 0;
                      for (let i = 0; i < params.length; i++) {
                        let temp_condition_name = params[i].condition_name;
                        let temp_duration = params[i].exposure_duration;
                        let temp_met_activity_name =
                          "Custom-defined Met Activity";
                        let temp_met_activity_value = parseFloat(
                          params[i].met_value
                        );
                        let temp_relative_humidity = params[
                          i
                        ].relative_humidity.map(function (x) {
                          return parseFloat(x) / 100;
                        });
                        let temp_air_speed = params[i].air_speed.map(Number);
                        let temp_air_temperature =
                          params[i].air_temperature.map(Number);
                        let temp_radiant_temperature =
                          params[i].radiant_temperature.map(Number);
                        let temp_clo_ensemble_name =
                          cloTable[parseInt(params[i].clo_value)].ensemble_name;
                        let pcs = [];
                        for (let j = 0; j < personalComfortSystem.length; j++) {
                          if (params[i].personal_comfort_system.has(j)) {
                            pcs.push(personalComfortSystem[j].name);
                          }
                        }
                        phases.push({
                          condition_name: temp_condition_name,
                          start_time: currTimer,
                          time_units: "minutes",
                          ramp: params[i].ramp,
                          end_time: currTimer + temp_duration,
                          met_activity_name: temp_met_activity_name,
                          met: temp_met_activity_value,
                          personal_comfort_system: pcs,
                          default_data: {
                            rh:
                              temp_relative_humidity.reduce((a, b) => a + b) /
                              (temp_relative_humidity.length * 100),
                            v:
                              temp_air_speed.reduce((a, b) => a + b) /
                              temp_air_speed.length,
                            solar: 0,
                            ta:
                              temp_air_temperature.reduce((a, b) => a + b) /
                              temp_air_temperature.length,
                            mrt:
                              temp_radiant_temperature.reduce((a, b) => a + b) /
                              temp_radiant_temperature.length,
                          },
                          clo_ensemble_name: temp_clo_ensemble_name,
                          segment_data: {
                            Head: {
                              mrt: temp_radiant_temperature[0],
                              rh: temp_relative_humidity[0],
                              solar: 0,
                              ta: temp_air_temperature[0],
                              v: temp_air_speed[0],
                            },
                            Chest: {
                              mrt: temp_radiant_temperature[1],
                              rh: temp_relative_humidity[1],
                              solar: 0,
                              ta: temp_air_temperature[1],
                              v: temp_air_speed[1],
                            },
                            Back: {
                              mrt: temp_radiant_temperature[2],
                              rh: temp_relative_humidity[2],
                              solar: 0,
                              ta: temp_air_temperature[2],
                              v: temp_air_speed[2],
                            },
                            Pelvis: {
                              mrt: temp_radiant_temperature[3],
                              rh: temp_relative_humidity[3],
                              solar: 0,
                              ta: temp_air_temperature[3],
                              v: temp_air_speed[3],
                            },
                            "Left Upper Arm": {
                              mrt: temp_radiant_temperature[4],
                              rh: temp_relative_humidity[4],
                              solar: 0,
                              ta: temp_air_temperature[4],
                              v: temp_air_speed[4],
                            },
                            "Right Upper Arm": {
                              mrt: temp_radiant_temperature[5],
                              rh: temp_relative_humidity[5],
                              solar: 0,
                              ta: temp_air_temperature[5],
                              v: temp_air_speed[5],
                            },
                            "Left Lower Arm": {
                              mrt: temp_radiant_temperature[6],
                              rh: temp_relative_humidity[6],
                              solar: 0,
                              ta: temp_air_temperature[6],
                              v: temp_air_speed[6],
                            },
                            "Right Lower Arm": {
                              mrt: temp_radiant_temperature[7],
                              rh: temp_relative_humidity[7],
                              solar: 0,
                              ta: temp_air_temperature[7],
                              v: temp_air_speed[7],
                            },
                            "Left Hand": {
                              mrt: temp_radiant_temperature[8],
                              rh: temp_relative_humidity[8],
                              solar: 0,
                              ta: temp_air_temperature[8],
                              v: temp_air_speed[8],
                            },
                            "Right Hand": {
                              mrt: temp_radiant_temperature[9],
                              rh: temp_relative_humidity[9],
                              solar: 0,
                              ta: temp_air_temperature[9],
                              v: temp_air_speed[9],
                            },
                            "Left Thigh": {
                              mrt: temp_radiant_temperature[10],
                              rh: temp_relative_humidity[10],
                              solar: 0,
                              ta: temp_air_temperature[10],
                              v: temp_air_speed[10],
                            },
                            "Right Thigh": {
                              mrt: temp_radiant_temperature[11],
                              rh: temp_relative_humidity[11],
                              solar: 0,
                              ta: temp_air_temperature[11],
                              v: temp_air_speed[11],
                            },
                            "Left Lower Leg": {
                              mrt: temp_radiant_temperature[12],
                              rh: temp_relative_humidity[12],
                              solar: 0,
                              ta: temp_air_temperature[12],
                              v: temp_air_speed[12],
                            },
                            "Right Lower Leg": {
                              mrt: temp_radiant_temperature[13],
                              rh: temp_relative_humidity[13],
                              solar: 0,
                              ta: temp_air_temperature[13],
                              v: temp_air_speed[13],
                            },
                            "Left Foot": {
                              mrt: temp_radiant_temperature[14],
                              rh: temp_relative_humidity[14],
                              solar: 0,
                              ta: temp_air_temperature[14],
                              v: temp_air_speed[14],
                            },
                            "Right Foot": {
                              mrt: temp_radiant_temperature[15],
                              rh: temp_relative_humidity[15],
                              solar: 0,
                              ta: temp_air_temperature[15],
                              v: temp_air_speed[15],
                            },
                          },
                        });
                        currTimer += temp_duration;
                      }

                      let phasesToPass = [];
                      for (let i = 0; i < params.length; i++) {
                        phasesToPass.push({
                          exposure_duration: params[i].exposure_duration,
                          met_activity_name: "Custom-defined Met Activity",
                          ramp: params[i].ramp,
                          met_activity_value: parseFloat(params[i].met_value),
                          relative_humidity: params[i].relative_humidity.map(
                            function (x) {
                              return parseFloat(x) / 100;
                            }
                          ),
                          air_speed: params[i].air_speed.map(Number),
                          air_temperature:
                            params[i].air_temperature.map(Number),
                          radiant_temperature:
                            params[i].radiant_temperature.map(Number),
                          clo_ensemble_name:
                            cloTable[parseInt(params[i].clo_value)]
                              .ensemble_name,
                        });
                      }
                      let bodyb = bodybuilderObj;
                      let clothing = cloTable;
                      const resultsToPass = await axios
                        .post("/api/process", {
                          // Chaining of data is intentional
                          phases: phasesToPass,
                          bodyb,
                          clothing,
                          raw: true,
                        })
                        .then((res) => {
                          return res.data;
                        });
                      const obj = {
                        name: "CBE Interface Test",
                        description: "Prototype testing requests",
                        reference_time: new Date(),
                        output_freq: 60,
                        options: {
                          csvOutput: false,
                          sensation_adaptation: false,
                          sensation_coredTdt: false,
                          ignore_segments: false,
                          ignore_physiology: false,
                          neutralSimulationOutput: false,
                        },
                        phases: phases,
                        clothing: cloTable,
                        results: resultsToPass,
                      };
                      try {
                        const fh = await getSaveFilePicker();
                        const writeable = await fh.createWritable();
                        await writeable.write(
                          new Blob([JSON.stringify(obj, undefined, 2)], {
                            type: "application/json",
                          })
                        );
                        await writeable.close();
                      } catch (e) {
                        alert(e);
                      }
                    }}
                  >
                    Save
                  </Button>
                  <Button
                    textColor="gray.600"
                    bgColor="white"
                    borderWidth={2}
                    onClick={advancedModal.onOpen}
                  >
                    Advanced
                  </Button>
                  <Tooltip label="Switch to narrow view" placement="right">
                    <IconButton
                      icon={<ViewIcon />}
                      onClick={() => setComfortView(false)}
                    />
                  </Tooltip>
                </HStack>
              </VStack>
            </>
          )}
          {/* When narrow view mode */}
          {!comfortView ? (
            <HStack align="center" justifyContent="center">
              <Button
                backgroundColor={"cbe.Blue"}
                textColor={"white"}
                colorScheme="blue"
                alignSelf="center"
                onClick={() => runSimulationManager()}
              >
                Simulate
              </Button>
              <Button
                textColor="gray.600"
                backgroundColor="white"
                borderWidth={2}
                alignSelf="center"
                onClick={() => {
                  uploadModal.onOpen();
                }}
              >
                Open
              </Button>
              <Button
                textColor="gray.600"
                backgroundColor="white"
                borderWidth={2}
                alignSelf="center"
                onClick={async () => {
                  let phases = [];
                  let currTimer = 0;
                  for (let i = 0; i < params.length; i++) {
                    let temp_condition_name = params[i].condition_name;
                    let temp_duration = params[i].exposure_duration;
                    let temp_met_activity_name = "Custom-defined Met Activity";
                    let temp_met_activity_value = parseFloat(
                      params[i].met_value
                    );
                    let temp_relative_humidity = params[
                      i
                    ].relative_humidity.map(function (x) {
                      return parseFloat(x) / 100;
                    });
                    let temp_air_speed = params[i].air_speed.map(Number);
                    let temp_air_temperature =
                      params[i].air_temperature.map(Number);
                    let temp_radiant_temperature =
                      params[i].radiant_temperature.map(Number);
                    let temp_clo_ensemble_name =
                      cloTable[parseInt(params[i].clo_value)].ensemble_name;
                    let pcs = [];
                    for (let j = 0; j < personalComfortSystem.length; j++) {
                      if (params[i].personal_comfort_system.has(j)) {
                        pcs.push(personalComfortSystem[j].name);
                      }
                    }
                    phases.push({
                      condition_name: temp_condition_name,
                      start_time: currTimer,
                      time_units: "minutes",
                      ramp: params[i].ramp,
                      end_time: currTimer + temp_duration,
                      met_activity_name: temp_met_activity_name,
                      met: temp_met_activity_value,
                      personal_comfort_system: pcs,
                      default_data: {
                        rh:
                          temp_relative_humidity.reduce((a, b) => a + b) /
                          (temp_relative_humidity.length * 100),
                        v:
                          temp_air_speed.reduce((a, b) => a + b) /
                          temp_air_speed.length,
                        solar: 0,
                        ta:
                          temp_air_temperature.reduce((a, b) => a + b) /
                          temp_air_temperature.length,
                        mrt:
                          temp_radiant_temperature.reduce((a, b) => a + b) /
                          temp_radiant_temperature.length,
                      },
                      clo_ensemble_name: temp_clo_ensemble_name,
                      segment_data: {
                        Head: {
                          mrt: temp_radiant_temperature[0],
                          rh: temp_relative_humidity[0],
                          solar: 0,
                          ta: temp_air_temperature[0],
                          v: temp_air_speed[0],
                        },
                        Chest: {
                          mrt: temp_radiant_temperature[1],
                          rh: temp_relative_humidity[1],
                          solar: 0,
                          ta: temp_air_temperature[1],
                          v: temp_air_speed[1],
                        },
                        Back: {
                          mrt: temp_radiant_temperature[2],
                          rh: temp_relative_humidity[2],
                          solar: 0,
                          ta: temp_air_temperature[2],
                          v: temp_air_speed[2],
                        },
                        Pelvis: {
                          mrt: temp_radiant_temperature[3],
                          rh: temp_relative_humidity[3],
                          solar: 0,
                          ta: temp_air_temperature[3],
                          v: temp_air_speed[3],
                        },
                        "Left Upper Arm": {
                          mrt: temp_radiant_temperature[4],
                          rh: temp_relative_humidity[4],
                          solar: 0,
                          ta: temp_air_temperature[4],
                          v: temp_air_speed[4],
                        },
                        "Right Upper Arm": {
                          mrt: temp_radiant_temperature[5],
                          rh: temp_relative_humidity[5],
                          solar: 0,
                          ta: temp_air_temperature[5],
                          v: temp_air_speed[5],
                        },
                        "Left Lower Arm": {
                          mrt: temp_radiant_temperature[6],
                          rh: temp_relative_humidity[6],
                          solar: 0,
                          ta: temp_air_temperature[6],
                          v: temp_air_speed[6],
                        },
                        "Right Lower Arm": {
                          mrt: temp_radiant_temperature[7],
                          rh: temp_relative_humidity[7],
                          solar: 0,
                          ta: temp_air_temperature[7],
                          v: temp_air_speed[7],
                        },
                        "Left Hand": {
                          mrt: temp_radiant_temperature[8],
                          rh: temp_relative_humidity[8],
                          solar: 0,
                          ta: temp_air_temperature[8],
                          v: temp_air_speed[8],
                        },
                        "Right Hand": {
                          mrt: temp_radiant_temperature[9],
                          rh: temp_relative_humidity[9],
                          solar: 0,
                          ta: temp_air_temperature[9],
                          v: temp_air_speed[9],
                        },
                        "Left Thigh": {
                          mrt: temp_radiant_temperature[10],
                          rh: temp_relative_humidity[10],
                          solar: 0,
                          ta: temp_air_temperature[10],
                          v: temp_air_speed[10],
                        },
                        "Right Thigh": {
                          mrt: temp_radiant_temperature[11],
                          rh: temp_relative_humidity[11],
                          solar: 0,
                          ta: temp_air_temperature[11],
                          v: temp_air_speed[11],
                        },
                        "Left Lower Leg": {
                          mrt: temp_radiant_temperature[12],
                          rh: temp_relative_humidity[12],
                          solar: 0,
                          ta: temp_air_temperature[12],
                          v: temp_air_speed[12],
                        },
                        "Right Lower Leg": {
                          mrt: temp_radiant_temperature[13],
                          rh: temp_relative_humidity[13],
                          solar: 0,
                          ta: temp_air_temperature[13],
                          v: temp_air_speed[13],
                        },
                        "Left Foot": {
                          mrt: temp_radiant_temperature[14],
                          rh: temp_relative_humidity[14],
                          solar: 0,
                          ta: temp_air_temperature[14],
                          v: temp_air_speed[14],
                        },
                        "Right Foot": {
                          mrt: temp_radiant_temperature[15],
                          rh: temp_relative_humidity[15],
                          solar: 0,
                          ta: temp_air_temperature[15],
                          v: temp_air_speed[15],
                        },
                      },
                    });
                    currTimer += temp_duration;
                  }
                  let phasesToPass = [];
                  for (let i = 0; i < params.length; i++) {
                    phasesToPass.push({
                      exposure_duration: params[i].exposure_duration,
                      met_activity_name: "Custom-defined Met Activity",
                      ramp: params[i].ramp,
                      met_activity_value: parseFloat(params[i].met_value),
                      relative_humidity: params[i].relative_humidity.map(
                        function (x) {
                          return parseFloat(x) / 100;
                        }
                      ),
                      air_speed: params[i].air_speed.map(Number),
                      air_temperature: params[i].air_temperature.map(Number),
                      radiant_temperature:
                        params[i].radiant_temperature.map(Number),
                      clo_ensemble_name:
                        cloTable[parseInt(params[i].clo_value)].ensemble_name,
                    });
                  }
                  let bodyb = bodybuilderObj;
                  let clothing = cloTable;
                  const resultsToPass = await axios
                    .post("/api/process", {
                      // Chaining of data is intentional
                      phases: phasesToPass,
                      bodyb,
                      clothing,
                      raw: true,
                    })
                    .then((res) => {
                      return res.data;
                    });
                  const obj = {
                    name: "CBE Interface Test",
                    description: "Prototype testing requests",
                    reference_time: new Date(),
                    output_freq: 60,
                    options: {
                      csvOutput: false,
                      sensation_adaptation: false,
                      sensation_coredTdt: false,
                      ignore_segments: false,
                      ignore_physiology: false,
                      neutralSimulationOutput: false,
                    },
                    phases: phases,
                    clothing: cloTable,
                    results: resultsToPass,
                  };
                  try {
                    const fh = await getSaveFilePicker();
                    const writeable = await fh.createWritable();
                    await writeable.write(
                      new Blob([JSON.stringify(obj, undefined, 2)], {
                        type: "application/json",
                      })
                    );
                    await writeable.close();
                  } catch (e) {
                    alert(e);
                  }
                }}
              >
                Save
              </Button>
              <Button
                textColor="gray.600"
                bgColor="white"
                borderWidth={2}
                colorScheme="gray"
                onClick={() => {
                  if (isComparing) {
                    // turn off comparison
                    setComparing(false);
                    setComparedResults();
                    setFullDataCompare([]);
                    setDataCompare([]);
                    // rerender graph
                    runSimulationManager(isMetric, false);
                  } else {
                    // allow user to upload with special option
                    setInComparingUploadModal(true);
                    uploadModal.onOpen();
                  }
                }}
              >
                {isComparing ? "Remove comparison" : "Compare"}
              </Button>
              <Button
                textColor="gray.600"
                bgColor="white"
                borderWidth={2}
                onClick={advancedModal.onOpen}
              >
                Advanced
              </Button>
              <Tooltip label="Switch to wide view" placement="right">
                <IconButton
                  icon={<ViewIcon />}
                  onClick={() => setComfortView(true)}
                />
              </Tooltip>
            </HStack>
          ) : (
            <></>
          )}
        </Fade>
      </Flex>
      <footer>
        <Box as="footer" bg="cbe.blue" color="white" py={1} px={5} mt="auto">
          <Flex
            direction={{ base: "column", md: "row" }}
            justify={{ base: "center", md: "space-between" }}
            align="center"
            width="100%"
          >
            <HStack spacing={10}>
              <a
                href="https://cbe.berkeley.edu/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/img/CBE-logo-2019-white.png"
                  alt="CBE Logo"
                  width={120}
                  height={50}
                />
              </a>
              <a
                href="https://www.berkeley.edu/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/img/ucb-logo-2024-white.png"
                  alt="UC Berkeley Logo"
                  width={120}
                  height={50}
                />
              </a>
            </HStack>

            <Box
              flex={{ base: "1 0 auto", md: "none" }}
              textAlign="center"
              my={{ base: 2, md: 0 }}
            >
              <Text>
                Copyright © {new Date().getFullYear()} The Center for the Built
                Environment and UC Regents. All rights reserved.
              </Text>
            </Box>

            <Box
              flex={{ base: "1 0 auto", md: "none" }}
              textAlign={{ base: "center", md: "right" }}
            >
              <HStack spacing={7}>
                <a
                  href="https://cbe.berkeley.edu/about-us/contact/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Text>Contact Us</Text>
                </a>
                <a
                  href="https://github.com/CenterForTheBuiltEnvironment/ABCWeb/issues/new?labels=bug&template=issue-bug-report.md"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Text>Report Issues</Text>
                </a>
                <a
                  href="https://github.com/CenterForTheBuiltEnvironment/ABCWeb"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/img/github-white-transparent.png"
                    alt="GitHub"
                    width={30}
                    height={30}
                  />
                </a>
                <a
                  href="https://www.linkedin.com/company/cbe-uc-berkeley/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/img/linkedin-white.png"
                    alt="LinkedIn"
                    width={30}
                    height={30}
                  />
                </a>
                <a
                  href="https://www.youtube.com/@BerkeleyCBE"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/img/youtube-white-trans-cropped.png"
                    alt="YouTube"
                    width={30}
                    height={30}
                  />
                </a>
              </HStack>
            </Box>
          </Flex>
        </Box>
      </footer>
    </Box>
  );
}
