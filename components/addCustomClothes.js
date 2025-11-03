import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  Button,
  VStack,
  HStack,
  Text,
  NumberInput,
  NumberInputField,
  Select,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Box,
  Divider,
  IconButton,
  Grid,
  GridItem,
  Badge,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { DeleteIcon, AddIcon } from "@chakra-ui/icons";
import clo_correspondence from "../reference/local clo input/clothing_ensembles.json";

const STORAGE_KEY = "abc_clothing_presets";

// Body segments organized by region for better UX
const SEGMENT_GROUPS = [
  {
    label: "Head & Neck",
    segments: ["Head", "Neck"],
  },
  {
    label: "Upper Body",
    segments: ["Chest", "Back", "Pelvis"],
  },
  {
    label: "Left Arm",
    segments: ["Left Upper Arm", "Left Lower Arm", "Left Hand"],
  },
  {
    label: "Right Arm",
    segments: ["Right Upper Arm", "Right Lower Arm", "Right Hand"],
  },
  {
    label: "Left Leg",
    segments: ["Left Thigh", "Left Lower Leg", "Left Foot"],
  },
  {
    label: "Right Leg",
    segments: ["Right Thigh", "Right Lower Leg", "Right Foot"],
  },
];

const DEFAULT_SEGMENTS = [
  "Head",
  "Neck",
  "Chest",
  "Back",
  "Pelvis",
  "Left Upper Arm",
  "Left Lower Arm",
  "Left Hand",
  "Right Upper Arm",
  "Right Lower Arm",
  "Right Hand",
  "Left Thigh",
  "Left Lower Leg",
  "Left Foot",
  "Right Thigh",
  "Right Lower Leg",
  "Right Foot",
];

// Create default segment data structure
const createDefaultSegmentData = () => {
  const segmentData = {};
  DEFAULT_SEGMENTS.forEach((segment) => {
    segmentData[segment] = { fclo: 1.0, iclo: 0.0 };
  });
  return segmentData;
};

// Create a new empty clothing preset
const createNewPreset = () => ({
  ensemble_name: "",
  description: "",
  whole_body: { fclo: 1.0, iclo: 0.0 },
  segment_data: createDefaultSegmentData(),
  isCustom: true,
});

export default function AddCustomClothes({ isOpen, onClose, onSave, defaultClothing }) {
  const toast = useToast();
  const [customPresets, setCustomPresets] = useState([]);
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(null);
  const [presetData, setPresetData] = useState(createNewPreset());
  const [editingIndex, setEditingIndex] = useState(null);

  // Load custom presets from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          setCustomPresets(JSON.parse(saved));
        } catch (e) {
          console.error("Error loading custom presets:", e);
        }
      }
    }
  }, []);

  // Load preset data when editing
  useEffect(() => {
    if (editingIndex !== null) {
      if (editingIndex === -1) {
        // New preset
        setPresetData(createNewPreset());
      } else {
        // Edit existing custom preset
        setPresetData({ ...customPresets[editingIndex] });
      }
    }
  }, [editingIndex, customPresets]);

  const handleSavePreset = () => {
    // Validate
    if (!presetData.ensemble_name.trim()) {
      toast({
        title: "Error",
        description: "Please enter an ensemble name",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const updatedPresets = [...customPresets];
    if (editingIndex === -1) {
      // Add new preset
      updatedPresets.push({ ...presetData, isCustom: true });
      toast({
        title: "Success",
        description: "Custom clothing preset saved!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      // Update existing preset
      updatedPresets[editingIndex] = { ...presetData, isCustom: true };
      toast({
        title: "Success",
        description: "Preset updated!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }

    setCustomPresets(updatedPresets);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPresets));
      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event("clothingPresetsUpdated"));
    }

    // Notify parent to reload
    if (onSave) {
      onSave([...updatedPresets]);
    }

    setEditingIndex(null);
    setPresetData(createNewPreset());
  };

  const handleDeletePreset = (index) => {
    const updatedPresets = customPresets.filter((_, i) => i !== index);
    setCustomPresets(updatedPresets);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPresets));
      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event("clothingPresetsUpdated"));
    }
    if (onSave) {
      onSave([...updatedPresets]);
    }
    if (editingIndex === index) {
      setEditingIndex(null);
      setPresetData(createNewPreset());
    }
    toast({
      title: "Deleted",
      description: "Preset deleted",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setPresetData(createNewPreset());
  };

  const updateField = (path, value) => {
    setPresetData((prev) => {
      const newData = { ...prev };
      const keys = path.split(".");
      let current = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const updateSegmentField = (segment, field, value) => {
    setPresetData((prev) => {
      const newData = { ...prev };
      newData.segment_data[segment][field] = parseFloat(value) || 0;
      return newData;
    });
  };

  // Get all presets (default + custom)
  const allPresets = defaultClothing
    ? [...defaultClothing, ...customPresets]
    : [...clo_correspondence, ...customPresets];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent maxH="90vh">
        <ModalHeader>Manage Clothing Presets</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Tabs>
            <TabList>
              <Tab>Browse Presets</Tab>
              <Tab>{editingIndex !== null ? "Edit Preset" : "Create New Preset"}</Tab>
            </TabList>

            <TabPanels>
              {/* Browse Tab */}
              <TabPanel>
                <VStack spacing={4} align="stretch">
                  <HStack justify="space-between">
                    <Text fontSize="lg" fontWeight="bold">
                      Available Presets ({allPresets.length})
                    </Text>
                    <Button
                      leftIcon={<AddIcon />}
                      colorScheme="blue"
                      onClick={() => setEditingIndex(-1)}
                      size="sm"
                    >
                      Create New
                    </Button>
                  </HStack>
                  <Divider />
                  <Box
                    maxH="500px"
                    overflowY="auto"
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="md"
                    p={4}
                  >
                    {allPresets.map((preset, index) => {
                      const isCustom = preset.isCustom || index >= (defaultClothing?.length || clo_correspondence.length);
                      const customIndex = isCustom
                        ? index - (defaultClothing?.length || clo_correspondence.length)
                        : null;
                      return (
                        <Box
                          key={index}
                          p={3}
                          mb={2}
                          border="1px solid"
                          borderColor="gray.200"
                          borderRadius="md"
                          bg={editingIndex === customIndex ? "blue.50" : "white"}
                        >
                          <HStack justify="space-between">
                            <VStack align="start" spacing={1} flex={1}>
                              <HStack>
                                <Text fontWeight="bold">{preset.ensemble_name}</Text>
                                {isCustom && (
                                  <Badge colorScheme="green">Custom</Badge>
                                )}
                              </HStack>
                              <Text fontSize="sm" color="gray.600">
                                {preset.description}
                              </Text>
                              <Text fontSize="xs" color="gray.500">
                                Whole Body: fclo={preset.whole_body.fclo}, iclo={preset.whole_body.iclo}
                              </Text>
                            </VStack>
                            {isCustom && (
                              <HStack>
                                <Button
                                  size="sm"
                                  onClick={() => setEditingIndex(customIndex)}
                                >
                                  Edit
                                </Button>
                                <IconButton
                                  icon={<DeleteIcon />}
                                  size="sm"
                                  colorScheme="red"
                                  onClick={() => handleDeletePreset(customIndex)}
                                  aria-label="Delete preset"
                                />
                              </HStack>
                            )}
                          </HStack>
                        </Box>
                      );
                    })}
                  </Box>
                </VStack>
              </TabPanel>

              {/* Create/Edit Tab */}
              <TabPanel>
                <VStack spacing={6} align="stretch">
                  <Box>
                    <Text fontWeight="bold" mb={2}>
                      Basic Information
                    </Text>
                    <VStack spacing={3}>
                      <HStack w="100%" align="center">
                        <Text w="150px">Ensemble Name:</Text>
                        <Input
                          value={presetData.ensemble_name}
                          onChange={(e) => updateField("ensemble_name", e.target.value)}
                          placeholder="e.g., Winter Heavy"
                        />
                      </HStack>
                      <HStack w="100%" align="center">
                        <Text w="150px">Description:</Text>
                        <Input
                          value={presetData.description}
                          onChange={(e) => updateField("description", e.target.value)}
                          placeholder="e.g., Heavy coat, boots, gloves"
                        />
                      </HStack>
                    </VStack>
                  </Box>

                  <Divider />

                  <Box>
                    <Text fontWeight="bold" mb={2}>
                      Whole Body Values
                    </Text>
                    <HStack spacing={4}>
                      <VStack align="start">
                        <Text fontSize="sm">FCLO:</Text>
                        <NumberInput
                          value={presetData.whole_body.fclo}
                          onChange={(_, value) =>
                            updateField("whole_body.fclo", parseFloat(value) || 0)
                          }
                          precision={2}
                          step={0.01}
                        >
                          <NumberInputField w="120px" />
                        </NumberInput>
                      </VStack>
                      <VStack align="start">
                        <Text fontSize="sm">ICLO:</Text>
                        <NumberInput
                          value={presetData.whole_body.iclo}
                          onChange={(_, value) =>
                            updateField("whole_body.iclo", parseFloat(value) || 0)
                          }
                          precision={2}
                          step={0.01}
                        >
                          <NumberInputField w="120px" />
                        </NumberInput>
                      </VStack>
                    </HStack>
                  </Box>

                  <Divider />

                  <Box>
                    <Text fontWeight="bold" mb={4}>
                      Body Segment Values
                    </Text>
                    <Box maxH="400px" overflowY="auto" border="1px solid" borderColor="gray.200" p={4} borderRadius="md">
                      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                        {SEGMENT_GROUPS.map((group, groupIdx) => (
                          <GridItem key={groupIdx}>
                            <Box border="1px solid" borderColor="gray.300" p={3} borderRadius="md">
                              <Text fontWeight="semibold" mb={2} fontSize="sm">
                                {group.label}
                              </Text>
                              <VStack spacing={2} align="stretch">
                                {group.segments.map((segment) => (
                                  <Box key={segment} p={2} bg="gray.50" borderRadius="sm">
                                    <Text fontSize="xs" fontWeight="medium" mb={1}>
                                      {segment}
                                    </Text>
                                    <HStack spacing={2}>
                                      <VStack spacing={0} flex={1}>
                                        <Text fontSize="xs" color="gray.600">
                                          FCLO
                                        </Text>
                                        <NumberInput
                                          size="sm"
                                          value={presetData.segment_data[segment]?.fclo || 1.0}
                                          onChange={(_, value) =>
                                            updateSegmentField(
                                              segment,
                                              "fclo",
                                              parseFloat(value) || 0
                                            )
                                          }
                                          precision={2}
                                          step={0.01}
                                        >
                                          <NumberInputField h="28px" fontSize="xs" />
                                        </NumberInput>
                                      </VStack>
                                      <VStack spacing={0} flex={1}>
                                        <Text fontSize="xs" color="gray.600">
                                          ICLO
                                        </Text>
                                        <NumberInput
                                          size="sm"
                                          value={presetData.segment_data[segment]?.iclo || 0.0}
                                          onChange={(_, value) =>
                                            updateSegmentField(
                                              segment,
                                              "iclo",
                                              parseFloat(value) || 0
                                            )
                                          }
                                          precision={2}
                                          step={0.01}
                                        >
                                          <NumberInputField h="28px" fontSize="xs" />
                                        </NumberInput>
                                      </VStack>
                                    </HStack>
                                  </Box>
                                ))}
                              </VStack>
                            </Box>
                          </GridItem>
                        ))}
                      </Grid>
                    </Box>
                  </Box>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>

        <ModalFooter>
          {editingIndex !== null && (
            <>
              <Button variant="ghost" mr={3} onClick={handleCancel}>
                Cancel
              </Button>
              <Button colorScheme="blue" onClick={handleSavePreset}>
                {editingIndex === -1 ? "Create Preset" : "Save Changes"}
              </Button>
            </>
          )}
          {editingIndex === null && (
            <Button onClick={onClose}>Close</Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
