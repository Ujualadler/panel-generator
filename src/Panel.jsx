import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import React, { useEffect, useRef, useState } from "react";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { toast } from "react-toastify";
import SettingsIcon from "@mui/icons-material/Settings";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import RefreshIcon from "@mui/icons-material/Refresh";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

export const textFieldStyle = {
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "black", // Initial outline color
    },
    "&:hover fieldset": {
      borderColor: "black", // Outline color on hover
    },
    "&.Mui-focused fieldset": {
      borderColor: "black", // Outline color when focused
    },
    color: "white",
    borderRadius: 3,
    height: "45px",
  },
  "& .MuiInputLabel-root": {
    color: "black", // Initial label color
    fontSize: "13px", // Reduced label font size
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "black", // Label color when focused
    fontSize: "13px", // Ensures size is consistent when focused
  },
  "& .MuiInputBase-input": {
    color: "black", // Text color
  },
  "& .MuiInputBase-input::placeholder": {
    color: "black", // Placeholder color
  },
};

export const selectStyle = {
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "black", // Initial outline color
    },
    "&:hover fieldset": {
      borderColor: "black", // Outline color on hover
    },
    "&.Mui-focused fieldset": {
      borderColor: "black", // Outline color when focused
    },
    "& .MuiSelect-select": {
      color: "black", // Text color
    },
    borderRadius: 3,
    fontSize: "13px",
    height: "45px",
  },
  "& .MuiInputLabel-root": {
    color: "black", // Initial label color
    fontSize: "13px", // Reduced label font size
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "black", // Label color when focused
    fontSize: "13px", // Ensures size is consistent when focused
  },
};

const versions = ["P 3.9", "P 3.1", "P 2.6"];
const units = [
  { name: "Feet(FT)", unit: "FT" },
  { name: "Meter(M)", unit: "M" },
  { name: "Panels", unit: "Panels" },
];
const ratioData = ["16:9", "21:9", "4:3", "custom"];

const panelArray = [
  [true, true, true, true, true, true, true, true, true, true],
  [true, true, true, true, true, true, true, true, true, true],
  [true, true, true, true, true, true, true, true, true, true],
  [true, true, true, true, true, true, true, true, true, true],
  [true, true, true, true, true, true, true, true, true, true],
];

function Panel() {
  const initialHorizontal = localStorage.getItem("Horizontal");
  const componentRef = useRef();

  const { Id } = useParams();
  const navigate = useNavigate();
  const initialLoad = useRef(true);
  const [title, setTitle] = useState("CLICK HERE TO ADD PROJECT TITLE");
  const [screenName, setScreenName] = useState("CLICK HERE TO ADD SCREEN NAME");
  const [isEditTitle, setSsEditTitle] = useState(false);
  const [isName, setName] = useState(false);
  const [type, setType] = useState(versions[0]);
  const [panelData, setPanelData] = useState({});
  const [id, setId] = useState("");
  const [panelsX, setPanelsX] = useState(10);
  const [panelsY, setPanelsY] = useState(5);
  const [unit, setUnit] = useState(units[0]);
  const [ratio, setRatio] = useState("custom");
  const [horizontal, setHorizontal] = useState(16); // Number of grids in the horizontal direction
  const [vertical, setVertical] = useState(9); // Number of grids in the vertical direction
  const [panels, setPanels] = useState(panelArray); // Store panel states (on/off)
  const [panelSize, setPanelSize] = useState(5); // Store panel states (on/off)
  const [showSettings, setSettings] = useState(false);
  const [activePanels, setActivePanels] = useState(0);

  console.log("first");

  console.log(panels);
  console.log("first");

  const containerWidth = 400; // Fixed width for the container
  const containerHeight = 400; // Fixed height for the container

  const screenWidth = window.innerWidth / 2;
  const screenHeight = window.innerHeight / 2;

  const screenCheck = window.innerWidth;

  console.log(unit);

  console.log("Screen Width:", screenWidth);
  console.log("Screen Height:", screenHeight);

  //   const baseURL = 'https://panelcalculator.onrender.com'
  //   const baseURL =
  //     "https://3607-2401-4900-1c5b-842-5942-b3cf-e8c-86bc.ngrok-free.app";
  //   const baseURL = "http://192.168.1.24:4000";
  const baseURL = "https://api.screencalculator.in";

  async function getData(
    ratio1,
    unit1,
    vertical1,
    horizontal1,
    Id1,
    title1,
    type1,
    panels1,
    activePanel1,
    screenName1
  ) {
    let sendID;

    if (Id1 === "") {
      sendID = Id;
    } else {
      sendID = Id1;
    }

    try {
      //   if (horizontal < 1) {
      //     toast.error("Value cant be less than one");
      //     return;
      //   }
      //   if (vertical < 1) {
      //     toast.error("Value cant be less than one");
      //     return;
      //   }

      const response = await axios.post(baseURL, {
        product: 500,
        unit: unit1.unit,
        ratio: ratio1,
        horizontal: horizontal1,
        vertical: vertical1,
        id: sendID,
        title: title1,
        product: type1,
        panelMatrix: panels1,
        activePanel: activePanel1,
        screenName: screenName1,
      });

      console.log(response.data);
      setPanelsX(response.data.panelsX);
      setPanelsY(response.data.panelsY);

      //   Avoid updating ratio and unit unless they differ from the current state
      if (response.data.ratio !== ratio) setRatio(response.data.ratio);
      const updatedUnit = units.filter(
        (data) => data.unit === response.data.unit
      );
      if (updatedUnit && updatedUnit.unit !== unit.unit)
        setUnit(updatedUnit[0]);
      if (response.data.product && response.data.product !== type)
        setType(response.data.product);
      //   if (response.data.horizontal !== horizontal)
      //     setHorizontal(Math.round(response.data.horizontal));
      //   if (response.data.vertical !== vertical)
      //     setVertical(Math.round(response.data.vertical));

      //   console.log(Math.round(Number(response.data.horizontal.split(' ')[0])))
      console.log(Math.round(Number(response.data.vertical.split(" ")[0])));

      //   console.log(response.data.horizontal)
      console.log(response.data.vertical);

      setTitle(response.data.title);
      setScreenName(response.data.screenName);
      setPanelData(response.data);
      if (response.data.ratio !== ratio) {
        // setHorizontal(Math.round(Number(response.data.horizontal.split(' ')[0])))
        setVertical(Math.round(Number(response.data.vertical.split(" ")[0])));
      }

      if (initialLoad.current && Id) {
        setId(Id);
        navigate(`/${Id}`);
      } else if (response.data.id) {
        setId(response.data.id);
        navigate(`/${response.data.id}`);
      }
      initialLoad.current = false;
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    async function fetchData() {
      let sendID;

      if (Id) {
        sendID = Id;
      } else {
        sendID = id;
      }

      if (Id) {
        console.log("id>>>>>", id);
        try {
          const response = await axios.get(`${baseURL}/${Id}`);

          if (!response.data) return;

          setRatio(response.data.ratio);
          const updatedUnit = units.filter(
            (data) => data.unit === response.data.unit
          );

          if (updatedUnit && updatedUnit.unit !== unit.unit)
            setUnit(updatedUnit[0]);
          setHorizontal(response.data.horizontal);
          setVertical(response.data.vertical);
          setPanels(response.data.panelMatrix);
          const trueCount = response.data.panelMatrix
            .flat()
            .filter((panel) => panel === true).length;

          console.log(trueCount);

          setActivePanels(trueCount);

          if (response.data.product && response.data.product !== type)
            setType(response.data.product);

          getData(
            response.data.ratio,
            updatedUnit[0],
            response.data.vertical,
            response.data.horizontal,
            Id,
            response.data.title,
            response.data.product,
            response.data.panelMatrix,
            trueCount,
            response.data.screenName
          );
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          const response = await axios.post(baseURL, {
            product: 500,
            unit: unit.unit,
            ratio: ratio,
            horizontal: initialHorizontal ? initialHorizontal : 16,
            vertical: vertical,
            id: sendID,
            title: title,
            product: type ? type : "p 3.9",
            panelMatrix: panels,
            screenName: screenName,
          });
          console.log(response.data);
          setPanelsX(response.data.panelsX);
          setPanelsY(response.data.panelsY);

          //   Avoid updating ratio and unit unless they differ from the current state
          if (response.data.ratio !== ratio) setRatio(response.data.ratio);
          const updatedUnit = units.filter(
            (data) => data.unit === response.data.unit
          );
          if (updatedUnit && updatedUnit.unit !== unit.unit)
            setUnit(updatedUnit[0]);
          if (response.data.horizontal !== horizontal)
            if (response.data.vertical !== vertical)
              if (response.data.product && response.data.product !== type)
                // setHorizontal(Math.round(response.data.horizontal));
                // setVertical(Math.round(response.data.vertical));
                setType(response.data.product);

          setTitle(response.data.title);
          setScreenName(response.data.screenName);
          setPanelData(response.data);
          if (initialLoad.current && Id) {
            setId(Id);
            navigate(`/${Id}`);
          } else if (response.data.id) {
            setId(response.data.id);
            navigate(`/${response.data.id}`);
          }
          initialLoad.current = false;
        } catch (error) {
          console.log(error);
        }
      }
    }
    fetchData();
  }, []); // Dependencies to trigger re-fetch

  const handleTitleChange = (e) => {
    if (!title.trim()) {
      toast.error(`Title can't be empty`);
      return;
    }
    getData(
      ratio,
      unit,
      vertical,
      horizontal,
      id,
      title,
      type,
      panels,
      activePanels,
      screenName
    );
    setSsEditTitle(false);
  };

  const handleNameChange = (e) => {
    if (!screenName.trim()) {
      toast.error('Name Can"t be empty');
      return;
    }

    getData(
      ratio,
      unit,
      vertical,
      horizontal,
      id,
      title,
      type,
      panels,
      activePanels,
      screenName // Use `value` here
    );
    setName(false);
  };

  const handleRatioChange = (e) => {
    setRatio(e.target.value);
    getData(
      e.target.value,
      unit,
      vertical,
      horizontal,
      id,
      title,
      type,
      panels,
      activePanels,
      screenName
    );
  };
  const handleUnitChange = (e) => {
    setUnit(e.target.value);
    getData(
      ratio,
      e.target.value,
      vertical,
      horizontal,
      id,
      title,
      type,
      panels,
      activePanels,
      screenName
    );
  };
  const handleHorizontalChange = (e) => {
    const value = e.target.value;
    // if (value < 1) {
    //   toast.error("Value cant be less than one");

    // }
    setHorizontal(value);

    getData(
      ratio,
      unit,
      vertical,
      value,
      id,
      title,
      type,
      panels,
      activePanels,
      screenName
    );
  };
  const handleVerticalChange = (e) => {
    const value = e.target.value;
    // if (value < 1) {
    //   toast.error("Value cant be less than one");
    // }
    setVertical(value);

    getData(
      ratio,
      unit,
      value,
      horizontal,
      id,
      title,
      type,
      panels,
      activePanels,
      screenName
    );
  };

  const handleProductChange = (e) => {
    const value = e.target.value;
    // if (value < 1) {
    //   toast.error("Value cant be less than one");
    // }
    setType(value);

    getData(
      ratio,
      unit,
      vertical,
      horizontal,
      id,
      title,
      e.target.value,
      panels,
      activePanels,
      screenName
    );
  };

  useEffect(() => {
    const panelSizeValue = Math.min(
      screenHeight / panelsX,
      screenHeight / panelsY
    );
    if (screenCheck > 900) {
      setSettings(true);
    }
    setPanelSize(panelSizeValue);

    generateGrid();
  }, [panelsX, panelsY]);

  // Function to initialize grid with "on" state for each panel
  const generateGrid = () => {
    const newPanels = Array.from({ length: panelsY }, () =>
      Array.from({ length: panelsX }, () => true)
    );
    setPanels(newPanels);
  };

  // Toggle individual panel on/off
  const togglePanel = (row, col) => {
    const updatedPanels = panels.map((panelRow, i) =>
      panelRow.map((panel, j) => (i === row && j === col ? !panel : panel))
    );
    const trueCount = updatedPanels
      .flat()
      .filter((panel) => panel === true).length;
    setActivePanels(trueCount);
    getData(
      ratio,
      unit,
      vertical,
      horizontal,
      id,
      title,
      type,
      updatedPanels,
      trueCount,
      screenName
    );
    setPanels(updatedPanels);
  };

  const handleRefresh = () => {
    navigate(`/`);
    window.location.reload();
    toast.success("Page refreshed successfully");
  };

  const handlePrint = async () => {
    const element = componentRef.current;

     // Use html2canvas to capture the element with a higher scale for better quality
  const canvas = await html2canvas(element, {
    scale: 2, // Increase the scale to capture higher quality (adjust as needed)
    useCORS: true // This helps with loading external images if you have any
  });

  const imageData = canvas.toDataURL('image/png');

  // Create a new jsPDF instance
  const pdf = new jsPDF('p', 'px', [canvas.width, canvas.height]);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  pdf.addImage(imageData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  pdf.save('download.pdf');
  };

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        toast.success("Link copied to clipboard!");
      })
      .catch((err) => {
        toast.error("Failed to copy link: " + err);
      });
  };

  return (
    <div>
      <div ref={componentRef}>
        <Grid
          container

          //   sx={{ minHeight: "100vh", minWidth: "100vw", background: "#fff" }}
        >
          <Grid size={12}>
            <Box
              width={"100%"}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: { md: "row", xs: "column" },
              }}
            >
              <img
                src="/logoPanel.png"
                style={{
                  height: "80px",
                  objectFit: "contain",
                  width: "100px",
                  padding: "5px",
                }}
              />

              {!isEditTitle ? (
                <Typography
                  onClick={() => {
                    setSsEditTitle(true);
                    setTitle("");
                  }}
                  textAlign={"center"}
                  mt={4}
                  fontWeight={600}
                  fontSize={"larger"}
                  sx={{ cursor: "pointer" }}
                >
                  {title}
                </Typography>
              ) : (
                <Box
                  display={"flex"}
                  mt={{ md: 2, xs: 0 }}
                  width={"50%"}
                  gap={3}
                >
                  <TextField
                    value={title}
                    sx={{ width: "100%", textAlign: "center" }}
                    variant="standard"
                    onChange={(e) => setTitle(e.target.value)}
                  />{" "}
                  <IconButton onClick={handleTitleChange}>
                    <SaveIcon />
                  </IconButton>
                </Box>
              )}

              <Box
                display={"flex"}
                gap={2}
                justifyContent={"end"}
                alignItems={"center"}
                mr={1}
                mt={{ md: 0, xs: 2 }}
              >
                <IconButton
                  sx={{ background: "black", color: "#c0d144" }}
                  onClick={handleRefresh}
                >
                  <RefreshIcon />
                </IconButton>
                <IconButton
                  sx={{ background: "black", color: "#c0d144" }}
                  onClick={handleCopyLink}
                >
                  <ContentCopyIcon />
                </IconButton>
                <IconButton
                  sx={{ background: "black", color: "#c0d144" }}
                  onClick={handlePrint}
                >
                  <PictureAsPdfIcon />
                </IconButton>
              </Box>
            </Box>

            <IconButton
              onClick={() => setSettings(!showSettings)}
              sx={{
                display: { xs: "block", md: "none" },
                position: "absolute",
                // bgcolor: showSettings ? "black" : "black",
                color: showSettings ? "black" : "black",
                top: 5,
                left: 5,
              }}
            >
              <SettingsIcon />
            </IconButton>

            <Grid
              container
              spacing={3}
              sx={{
                p: 3,
                zIndex: 10,
                position: { xs: "fixed", md: "static" },
                top: 0,
                left: 0,
                pt: { xs: 10, md: 3 },
                width: { xs: "80%", md: "100%" },
                maxWidth: { xs: 300, md: "100%" },
                height: { xs: "100vh", md: "auto" },
                bgcolor: "#c0d144",
                transform: showSettings ? "translateX(0)" : "translateX(-100%)",
                transition: "transform 0.3s ease",
                alignContent: "flex-start",
                display: showSettings || { md: "flex" },
                overflowY: { xs: "auto", md: "visible" },
                border: "1px solid",
              }}
            >
              <Grid
                size={{ md: 0, xs: 12 }}
                sx={{
                  display: {
                    md: "none",
                    xs: "flex",
                    position: "absolute",
                    top: 5,
                    left: 5,
                    zindex: 2,
                  },
                }}
              >
                <Box>
                  <IconButton
                    onClick={() => setSettings(!showSettings)}
                    sx={{
                      // display: { xs: "block", md: "none" },
                      //   bgcolor: showSettings ? "black" : "black",
                      color: showSettings ? "black" : "black",
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
              </Grid>
              <Grid size={{ md: 2.4, xs: 12 }}>
                <Box>
                  <FormControl fullWidth sx={selectStyle}>
                    <InputLabel id="demo-simple-select-label">
                      PRODUCT TYPE
                    </InputLabel>
                    <Select
                      //   variant="standard"
                      value={type}
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="PRODUCT TYPE"
                      onChange={handleProductChange}
                      sx={{ fontSize: "13px" }}
                    >
                      {versions.map((data, index) => (
                        <MenuItem key={index} value={data}>
                          {data}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Grid>

              <Grid size={{ md: 2.4, xs: 12 }}>
                <Box>
                  <FormControl fullWidth sx={selectStyle}>
                    <InputLabel id="demo-simple-select-label">UNITS</InputLabel>
                    <Select
                      //   variant="standard"
                      value={unit}
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="UNITS"
                      onChange={handleUnitChange}
                      //   sx={selectStyle}
                    >
                      {units.map((data, index) => (
                        <MenuItem key={index} value={data}>
                          {data.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
              <Grid size={{ md: 2.4, xs: 12 }}>
                <Box>
                  <FormControl fullWidth sx={selectStyle}>
                    <InputLabel id="demo-simple-select-label">RATIO</InputLabel>
                    <Select
                      //   variant="standard"
                      value={ratio}
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="RATIO"
                      onChange={handleRatioChange}
                      //   sx={selectStyle}
                    >
                      {ratioData.length > 0 &&
                        ratioData?.map((data, index) => (
                          <MenuItem key={index} value={data}>
                            {data}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
              <Grid size={{ md: 2.4, xs: 12 }}>
                <Box>
                  <FormControl fullWidth>
                    <TextField
                      //   variant="standard"
                      fullWidth
                      type="number"
                      value={horizontal}
                      label="WIDTH"
                      onChange={handleHorizontalChange}
                      //   name="client"
                      //   value={''}
                      //   onChange={handleInputChange}
                      sx={{ ...textFieldStyle }}
                    />
                  </FormControl>
                </Box>
              </Grid>
              <Grid size={{ md: 2.4, xs: 12 }}>
                <Box>
                  <FormControl fullWidth>
                    <TextField
                      //   variant="standard"
                      fullWidth
                      type="number"
                      label="HEIGHT"
                      value={vertical}
                      onChange={handleVerticalChange}
                      sx={{ ...textFieldStyle }}
                    />
                  </FormControl>
                </Box>
              </Grid>
            </Grid>
          </Grid>
          <Grid size={{ md: 9, xs: 12 }}>
            <Box
              display={"flex"}
              justifyContent={"center"}
              //   width={"98%"}

              height={{ md: "75vh", xs: "40vh" }}
              maxHeight={{ md: "75vh", xs: "40vh" }}
              overflow={"hidden"}
              //   bgcolor={"white"}
              borderRadius={10}
              alignItems={"center"}
              //   gap={2}
            >
              <Box
                sx={{
                  width: `${panelsX * panelSize}px`,
                  height: `${panelsY * panelSize}px`,
                  display: "grid",
                  position: "relative",
                  gridTemplateColumns: `repeat(${panelsX}, ${panelSize}px)`,
                  gridTemplateRows: `repeat(${panelsY}, ${panelSize}px)`,
                }}
              >
                <Box
                  position={"absolute"}
                  height={`${panelsY * panelSize}px`}
                  left={-125}
                  display={{ md: "flex", xs: "none" }}
                  justifyContent={"center"}
                  alignItems={"center"}
                  //   bottom={15}
                >
                  <Box
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    flexDirection={"column"}
                  >
                    <Typography>{panelsY} PANELS</Typography>
                    <Typography>({panelData.vertical} / </Typography>
                    <Typography>
                      {panelData.unit === "FT" ? panelData.verticalM : ""})
                    </Typography>
                  </Box>
                  <Box
                    display={"flex"}
                    flexDirection={"column"}
                    alignItems={"center"}
                  >
                    <ArrowBackIosIcon sx={{ transform: "rotate(90deg)" }} />
                    <Box
                      sx={{
                        background: "black",
                        height: `${panelsY * panelSize}px`,
                      }}
                      width={"1px"}
                    />
                    <ArrowForwardIosIcon sx={{ transform: "rotate(90deg)" }} />
                  </Box>
                </Box>
                <Box
                  position={"absolute"}
                  width={`${panelsX * panelSize + 30}px`}
                  top={-75}
                  display={{ md: "block", xs: "none" }}
                  right={-15}
                >
                  <Typography textAlign={"center"}>
                    {panelsX} PANELS (
                    {`${panelData.horizontal} / ${
                      panelData.unit === "FT" ? panelData.horizontalM : ""
                    }`}
                    )
                  </Typography>
                  <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                  >
                    <ArrowBackIosIcon />
                    <Box
                      sx={{ background: "black", width: "100%" }}
                      height={"1px"}
                    />
                    <ArrowForwardIosIcon />
                  </Box>
                </Box>
                <Box
                  justifyContent={"center"}
                  alignItems={"center"}
                  position={"absolute"}
                  width={`${panelsX * panelSize + 30}px`}
                  bottom={-75}
                  display={{ md: "flex", xs: "flex" }}
                  right={-15}
                  zIndex={1}
                  mt={4}
                >
                  {!isName ? (
                    <Typography
                      onClick={() => {
                        setName(true);
                        setScreenName("");
                      }}
                      textAlign={"center"}
                      mt={4}
                      fontWeight={600}
                      fontSize={"larger"}
                      sx={{ cursor: "pointer" }}
                    >
                      {screenName}
                    </Typography>
                  ) : (
                    <Box display={"flex"} mt={4} width={"50%"} gap={3}>
                      <TextField
                        value={screenName}
                        sx={{ width: "100%", textAlign: "center" }}
                        variant="standard"
                        onChange={(e) => setScreenName(e.target.value)}
                      />{" "}
                      <IconButton onClick={handleNameChange}>
                        <SaveIcon />
                      </IconButton>
                    </Box>
                  )}
                </Box>
                <Box
                  sx={{
                    height: `${3.6 * panelSize}px`,
                    position: "absolute",
                    display: { xs: "none", md: "flex" },
                    bottom: 0,
                    right: `calc(-${panelSize + 15}px)`,
                  }}
                >
                  <img
                    src="/manY.png"
                    style={{
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </Box>

                {panels.map((row, rowIndex) =>
                  row.map((isPanelVisible, colIndex) => (
                    <Box
                      key={`${rowIndex}-${colIndex}`}
                      sx={{
                        width: `${panelSize}px`,
                        height: `${panelSize}px`,
                        backgroundColor: isPanelVisible
                          ? "#111"
                          : "transparent",

                        cursor: "pointer",
                      }}
                      onClick={() => togglePanel(rowIndex, colIndex)}
                    >
                      <img
                        style={{
                          width: "100%",
                          height: "100%",
                          //   border: "1px solid grey",
                          objectFit: "fill",
                          opacity: isPanelVisible ? 1 : 0,
                          transition: "all 0.5s ease",
                        }}
                        src="/wall.jpg"
                        alt="Panel"
                      />
                    </Box>
                  ))
                )}
              </Box>
            </Box>
          </Grid>
          <Grid size={{ md: 3, xs: 12 }} container>
            <Grid
              maxHeight={"70vh"}
              overflow={"auto"}
              mt={2}
              //   bgcolor={'#dadded'}
              mr={1}
              size={12}
              boxShadow={
                "rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px;"
              }
              pt={1}
              borderRadius={3}
            >
              <Box bgcolor={"black"} pt={1} pb={1} borderRadius={3} m={1}>
                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  mb={1}
                  pb={1}
                  px={2}
                  borderBottom={"1px solid #c0d144"}
                >
                  <Typography fontWeight={600} color="#c0d144">
                    Total Panels
                  </Typography>
                  <Typography fontWeight={600} color="#c0d144">
                    {panelData?.totalPanels}
                  </Typography>
                </Box>
                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  px={2}
                  mb={1}
                >
                  <Typography fontWeight={600} color="white">
                    Panels Wide
                  </Typography>
                  <Typography fontWeight={600} color="white">
                    {panelData?.panelsX}
                  </Typography>
                </Box>
                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  mb={1}
                  px={2}
                >
                  <Typography fontWeight={600} color="white">
                    Panels High
                  </Typography>
                  <Typography fontWeight={600} color="white">
                    {panelData?.panelsY}
                  </Typography>
                </Box>
              </Box>
              <Box bgcolor={"black"} pt={1} pb={1} borderRadius={3} m={1}>
                {/* <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
              mb={1}
              pb={1}
              px={2}
              borderBottom={"1px solid #303f9f"}
            >
              <Typography fontWeight={600} color="#303f9f">
                Total Panels
              </Typography>
              <Typography fontWeight={600} color="#303f9f">
                {panelData?.totalPanels}
              </Typography>
            </Box> */}
                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  px={2}
                  mb={1}
                >
                  <Typography fontWeight={600} color="white">
                    Panels Width
                  </Typography>
                  <Typography fontWeight={600} color="white">
                    {panelData?.horizontal}
                  </Typography>
                </Box>
                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  mb={1}
                  px={2}
                >
                  <Typography fontWeight={600} color="white">
                    Panels Height
                  </Typography>
                  <Typography fontWeight={600} color="white">
                    {panelData?.vertical}
                  </Typography>
                </Box>
              </Box>

              <Box bgcolor={"black"} pt={1} pb={1} borderRadius={3} m={1}>
                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  mb={1}
                  pb={1}
                  px={2}
                  borderBottom={"1px solid #c0d144"}
                >
                  <Typography fontWeight={600} color="#c0d144">
                    Total Pixels
                  </Typography>
                  <Typography fontWeight={600} color="#c0d144">
                    {panelData?.totalPixels}
                  </Typography>
                </Box>
                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  mb={1}
                  px={2}
                >
                  <Typography fontWeight={600} color="white">
                    Pixel Height
                  </Typography>
                  <Typography fontWeight={600} color="white">
                    {panelData?.pixelHeight}
                  </Typography>
                </Box>
                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  px={2}
                  mb={1}
                >
                  <Typography fontWeight={600} color="white">
                    Pixel Width
                  </Typography>
                  <Typography fontWeight={600} color="white">
                    {panelData?.pixelWidth}
                  </Typography>
                </Box>
              </Box>

              <Box bgcolor={"black"} pt={1} pb={1} borderRadius={3} m={1}>
                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  mb={1}
                  pb={1}
                  px={2}
                  borderBottom={"1px solid #c0d144"}
                >
                  <Typography fontWeight={600} color="#c0d144">
                    Total Weight
                  </Typography>
                  <Typography fontWeight={600} color="#c0d144">
                    {panelData?.totalWeight}
                  </Typography>
                </Box>
                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  mb={1}
                  px={2}
                >
                  <Typography fontWeight={600} color="white">
                    Diagonal
                  </Typography>
                  <Typography fontWeight={600} color="white">
                    {panelData?.diagonal}
                  </Typography>
                </Box>
                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  px={2}
                  mb={1}
                >
                  <Typography fontWeight={600} color="white">
                    Processor Ports
                  </Typography>
                  <Typography fontWeight={600} color="white">
                    {panelData?.processorPorts}
                  </Typography>
                </Box>
              </Box>
              <Box bgcolor={"black"} pt={1} pb={1} borderRadius={3} m={1}>
                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  //   mb={1}
                  pb={1}
                  px={2}
                  //   borderBottom={"1px solid #303f9f"}
                >
                  <Typography fontWeight={600} color="#c0d144">
                    220V Draw
                  </Typography>
                  <Typography fontWeight={600} color="#c0d144">
                    {panelData?.totalAMPS}
                  </Typography>
                </Box>
                {/* <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
              mb={1}
              px={2}
            >
              <Typography fontWeight={600}>16 AMP Circuits</Typography>
              <Typography fontWeight={600}>{panelData?.totalAMPS}</Typography>
            </Box> */}
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default Panel;
