import React, { useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import { sha256 } from "js-sha256";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import Disclaimermodal from "./Disclaimermodal";
import "./Findbyhash.css";
import CircularProgress from "@mui/material/CircularProgress";
import CopyAllIcon from "@mui/icons-material/CopyAll";
import Snackbar from "@mui/material/Snackbar";
import CloseIcon from "@mui/icons-material/Close";
import Originalmodal from "./Originalmodal";
import AWS from "aws-sdk";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";

export default function Findbyhash() {
  const [file, setFile] = useState(null);
  const [hash, setHash] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [searchedID, setSearchedID] = useState("");
  const [result, setResult] = useState();
  const [invalidInput, setInvalidInput] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [blockHeight, setBlockHeight] = useState(0);
  const [notOri, setNotOri] = useState(false);
  const [open, setOpen] = useState(false);
  const [fail, setFail] = useState(false);
  const [searchedData, setSearchedData] = useState(false);
  const [openQuery, setOpenQuery] = useState(false);
  const allowedFileTypes = [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "image/webp",
    "image/bmp",
    "image/gif",
  ];
  const dynamodb = new AWS.DynamoDB();
  const searchedDataRowRef = useRef(null);


  useEffect(() => {
    if (searchedData && searchedDataRowRef.current) {
      searchedDataRowRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [searchedData]);

  const handlePage = () => {
    window.location.hash = '#/collections';
  };

  AWS.config.update({
    region: process.env.REACT_APP_AWS_REGION,
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  });

  useEffect(() => {
    fetch(`${process.env.REACT_APP_HEIGHT_URL}`)
      .then((response) => response.json())
      .then((data) => {
        setBlockHeight(data.InscriptionsSynced);
      })
      .catch((error) => console.log(error));
  }, []);

  const renderContent = () => {
    if (file && allowedFileTypes.includes(file.type)) {
      return (
        <img
          src={URL.createObjectURL(file)}
          alt="Uploaded file"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      );
    } else if (file) {
      return (
        <div style={{ textAlign: "center", marginTop: "35px" }}>
          {file.name.length > 15
            ? `${file.name.slice(0, 8)}...${file.name.slice(-8)}`
            : file.name}
        </div>
      );
    } else {
      return (
        <span
          style={{
            lineHeight: "1.1",
            textAlign: "center",
            marginTop: "50px",
            paddingLeft: "20px",
            paddingRight: "20px",
          }}
        >
          Upload Image / Video
        </span>
      );
    }
  };

  const getFirstObjectByHash = async (hashValue, retries = 5) => {
    const params = {
      TableName: "getbyIDthenhash",
      KeyConditionExpression: "#hash = :h",
      ExpressionAttributeNames: {
        "#hash": "hash",
      },
      ExpressionAttributeValues: {
        ":h": { S: hashValue },
      },
      ScanIndexForward: true,
      Limit: 1,
    };

    try {
      const { Items } = await dynamodb.query(params).promise();

      if (Items.length === 0) {
        return null;
      }

      return Items[0];
    } catch (error) {
      if (
        error.code === "ProvisionedThroughputExceededException" &&
        retries > 0
      ) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return getFirstObjectByHash(hashValue, retries - 1);
      } else {
        setFail(true);
      }
    }
  };

  const getObjectById = async (idValue) => {
    const params = {
      TableName: "getbyIDthenhash",
      IndexName: "id-index",
      KeyConditionExpression: "#id = :i",
      ExpressionAttributeNames: {
        "#id": "id",
      },
      ExpressionAttributeValues: {
        ":i": { N: idValue },
      },
      ScanIndexForward: true,
      Limit: 1,
    };

    let retryCount = 0;
    const maxRetries = 5;
    let result = null;

    while (retryCount < maxRetries && result === null) {
      try {
        const { Items } = await dynamodb.query(params).promise();
        if (Items.length > 0) {
          const item = Items[0];
          const hashValue = item.hash.S;
          result = await getFirstObjectByHash(hashValue);
        } else {
          setFail(true);
          return;
        }
      } catch (err) {
        if (err.code === "ProvisionedThroughputExceededException") {
          await new Promise((resolve) => setTimeout(resolve, 2000));
          retryCount++;
        } else {
          setFail(true);
        }
      }
    }

    return result;
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
    setOpenQuery(false);
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(hash);
    setOpen(true);
  };

  const handleFileChange = async (event) => {
    handleSame();
    const selectedFile = event.target.files[0];
    if (!selectedFile) {
      return;
    }
    handleLoad();
    setLoading(true);
    setFail(false);
    setInvalidInput(false);
    setInputValue("");
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = async function (event) {
      const buffer = event.target.result;
      const hashHex = sha256(buffer);
      if (hashHex == hash) {
        setLoading(false);
        return;
      }
      setHash(hashHex);
      const objectByHash = await getFirstObjectByHash(hashHex);
      if (objectByHash) {
        setResult(objectByHash);
        setLoading(false);
        handleSearched();
      } else {
        setResult();
        setLoading(false);
        handleSearched();
      }
    };
    reader.readAsArrayBuffer(selectedFile);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSubmit(event);
    }
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    setFile(null);
  };

  const handleLoad = () => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 4000);
  };

  const handleSearched = () => {
    const checkLoading = setInterval(() => {
      if (!isLoading) {
        clearInterval(checkLoading);
        setTimeout(() => {
          setSearchedData(true);
          setTimeout(() => {
            setSearchedData(false);
          }, 2000);
        }, 4000);
      }
    }, 100);
  };

  const handleSame = () => {
    setTimeout(() => {
      setSearchedData(true);
      setTimeout(() => {
        setSearchedData(false);
      }, 2000);
    }, 1000);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Input value:", inputValue);
    const isId = /^\d+$/.test(inputValue);

    if (isId && inputValue <= blockHeight && inputValue >= 1) {
      if (searchedID == inputValue) {
        setInvalidInput(false);
        handleSame();
        return;
      }
      handleLoad();
      setFail(false);
      setLoading(true);
      setInvalidInput(false);
      setSearchedID(inputValue);
      const objectByHash = await getObjectById(inputValue);
      if (objectByHash) {
        setResult(objectByHash);
        setHash(objectByHash.hash.S);
        if (objectByHash.id.N != inputValue) {
          setNotOri(true);
        } else {
          setNotOri(false);
        }

        setLoading(false);
        handleSearched();
      } else {
        setResult();
        setLoading(false);
        handleSearched();
      }
    } else {
      setInvalidInput(true);
      setLoading(false);
      handleSearched();
    }
  };

  const handleButtonClick = () => {
    const fileInput = document.getElementById("fileInput");
    fileInput.accept =
      ".jpg, .jpeg, .png, .webp, .bmp, .gif, .mp4, .mov, .wmv, .avi, .txt, .json";
    fileInput.click();
  };

  return (
    <Box sx={{
      backgroundColor:"#1A2027",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "calc(10px + 2vmin)"
      }}>
      <Box sx={{ width: "90%", maxWidth: "1080px", mb: "2rem", mt: "2rem" }}>
        <div style={{ alignContent: "flex-start", display: "flex" }}>
        <Link to="/">
          <img
            className="logo"
            src="/ORDFIND.png"
            alt="Logo"
            style={{ float: "left" }}
          />
          </Link>
        </div>
        <div style={{ position: "relative", pt: "5px" }}>
          <Snackbar
            open={open}
            autoHideDuration={4000}
            onClose={handleClose}
            message="Hash Copied"
            action={action}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            sx={{
              "& .MuiSnackbarContent-root": {
                backgroundColor: "#f2b843",
                color: "#1a2027",
              },
            }}
          />
        </div>
        <div style={{ position: "relative", pt: "5px" }}>
          <Snackbar
            open={openQuery}
            autoHideDuration={4000}
            onClose={handleClose}
            message="A Query Is Being Processed. Please Wait.."
            action={action}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            sx={{
              "& .MuiSnackbarContent-root": {
                backgroundColor: "#CA1F3D",
                color: "#f8f8ff",
              },
            }}
          />
        </div>

        <Box sx={{ flex: "1 1 100%", mb: "1rem", mt: "3rem" }}>
          <Typography
            sx={{
              fontSize: {
                xs: "1.5rem",
                sm: "1.6rem",
                md: "1.8rem",
                lg: "1.8rem",
                xl: "1.8rem",
              },
            }}
          >
            Find & Verify Original Ordinals Inscriptions
          </Typography>
          <Typography
            col={2}
            sx={{
              fontSize: {
                xs: "1rem",
                sm: "1.0rem",
                md: "1.1rem",
                lg: "1.1rem",
                xl: "1.1rem",
              },
              margin: "0px",
              padding: "0px",
              wordWrap: "break-word",
              textTransform: "none",
              color: "F8F8FF",
            }}
          >
            <span
              sx={{ display: { xs: "none", sm: "inline-block" } }}
              className="dot"
            ></span>
            <span> Inscriptions Synced : </span>
            <span>{blockHeight}</span>
          </Typography>
          <Originalmodal />
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            borderRadius: "5px",

            width: {
              xs: "100%",
              sm: "55%",
              md: "50%",
              lg: "45%",
              xl: "40%",
            },
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <Button
            onClick={handlePage}
            sx={{
              background: "linear-gradient(45deg, #3d3ec2, #f2b843)",
              backgroundSize: "100% 100%",
              paddingX: "1.3rem",
              color: "#f8f8ff",
              mb: "30px",
              textTransform: "none",
              fontSize: {
                xs: "1.1rem",
                sm: "1.1rem",
                md: "1.1rem",
                lg: "1.1rem",
                xl: "1.1rem",
              },
              animation: "gradientShift 5s ease infinite",
              "&:hover": {
                color: "#f8f8ff",
                background: "linear-gradient(45deg, #f2b843, #3d3ec2)",
              },
              
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                lineHeight: "2.0",
              }}
            >
              Browse ETH Collections
              <span style={{ marginLeft: "5px", display: "inline-flex", alignItems: "center" }}>
                <KeyboardDoubleArrowRightIcon />
              </span>
            </div>
          </Button>
        </Box>
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={
            loading || isLoading ? () => setOpenQuery(true) : handleButtonClick
          }
          sx={{
            width: "15rem",
            padding: "0.2rem",
            height: "15rem",
            borderRadius: "10px",
            border: "5px solid #4D5DA9",
            backgroundColor: "transparent",
            "&:hover": {
              backgroundColor: "transparent",
            },
            whiteSpace: "normal",
          }}
        >
          {renderContent()}
          {file && allowedFileTypes.includes(file.type) ? (
            <DriveFolderUploadIcon
              style={{
                color: "#1a2027",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
              fontSize="large"
            />
          ) : (
            <DriveFolderUploadIcon
              style={{
                color: "#F2B843",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -80%)",
              }}
              fontSize="large"
            />
          )}
        </Button>
        <Typography
          col={2}
          sx={{
            fontSize: {
              xs: "1rem",
              sm: "1rem",
              md: "1.1rem",
              lg: "1.2rem",
              xl: "1.3rem",
            },
            my: "2rem",
          }}
        >
          Or
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            onKeyPress={
              loading || isLoading ? () => setOpenQuery(true) : handleKeyPress
            }
            sx={{
              "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                borderColor: "#F2B843",
              },
              "& .MuiAutocomplete-endAdornment .MuiSvgIcon-root": {
                color: "#F2B843",
              },
              "& .MuiAutocomplete-clearIndicator .MuiSvgIcon-root": {
                color: "#F2B843",
              },
              "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                borderColor: "#F2B843",
                boxShadow: "0 0 5px 0 #F2B843",
              },
              "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                {
                  borderColor: "#3D3EC2",
                  boxShadow: "0 0 5px 0 #3D3EC2",
                },
              "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input": {
                color: "#BCBFC3",
              },
              "& .MuiInputLabel-outlined.Mui-focused": {
                color: "#BCBFC3",
              },
              "& .MuiOutlinedInput-input": {
                color: "#BCBFC3",
              },
              "& label.Mui-focused": {
                color: "#3D3EC2",
              },

              "& .MuiAutocomplete-paper li.MuiAutocomplete-option.Mui-focusVisible, & .MuiAutocomplete-paper li.MuiAutocomplete-option:hover":
                {
                  backgroundColor: "#F2B843",
                },
              width: {
                xs: "80%",
                sm: "55%",
                md: "50%",
                lg: "45%",
                xl: "40%",
              },
            }}
            fullWidth
            id="outlined-basic"
            label="Enter Inscription #Number"
            variant="outlined"
            value={inputValue}
            onChange={handleInputChange}
            disabled={loading || isLoading}
            InputProps={{
              endAdornment: (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={
                    loading || isLoading
                      ? () => setOpenQuery(true)
                      : handleSubmit
                  }
                  sx={{
                    backgroundColor: "#3D3EC2",
                    color: "#f8f8ff",
                    zIndex: 1,
                    marginLeft: "1rem",
                    "&:hover": {
                      backgroundColor: "#3D00C2",
                      color: "#BCBFC3",
                    },
                  }}
                >
                  Search
                </Button>
              ),
            }}
          />
        </form>
        <Box
          sx={{
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            width: {
              xs: "80%",
              sm: "55%",
              md: "50%",
              lg: "45%",
              xl: "40%",
            },
            margin: "auto",
          }}
        >
          <Typography
            col={2}
            sx={{
              fontSize: {
                xs: "0.8rem",
                sm: "0.8rem",
                md: "0.9rem",
                lg: "0.9rem",
                xl: "0.9rem",
              },
              pt: "5px",
              wordWrap: "break-word",
              color: "#F2B843",
            }}
          >
            *Only ".jpg, .jpeg, .png, .webp, .bmp, .gif, .mp4, .mov, .wmv, .avi"
            inscriptions are supported.
          </Typography>
        </Box>

        <div
          style={{
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            col={2}
            sx={{
              fontSize: {
                xs: "1rem",
                sm: "1rem",
                md: "1rem",
                lg: "1.1rem",
                xl: "1.2rem",
              },
              pt: "2rem",
              wordWrap: "break-word",
            }}
          >
            <span ref={searchedDataRowRef} style={{ color: "#F8F8FF" }}>
              Result :
            </span>
          </Typography>
        </div>
        <div
          style={{
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            className="button-container"
            sx={{
              cursor: "default",
              border: "2px solid",
              borderColor: notOri && !isLoading ? "#CA1F3D" : "#F2B843",
              borderRadius: "10px",
              backgroundColor: "transparent",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              px: 2,
              py: 2,
              color: "#f8f8ff",
              boxShadow:
                notOri && !isLoading
                  ? "0 0 8px 0 #CA1F3D"
                  : "0 0 8px 0 #F2B843",

              width: {
                xs: "80%",
                sm: "55%",
                md: "50%",
                lg: "45%",
                xl: "40%",
              },
            }}
          >
            {loading || isLoading ? (
              <CircularProgress color="success" />
            ) : (
              <>
                {invalidInput == false && !fail ? (
                  <>
                    {result && file == null ? (
                      <>
                        <Typography
                          col={2}
                          sx={{
                            fontSize: {
                              xs: "1rem",
                              sm: "1rem",
                              md: "1rem",
                              lg: "1.1rem",
                              xl: "1.1rem",
                            },

                            wordWrap: "break-word",
                            textTransform: "none",
                            color: "F8F8FF",
                          }}
                        >
                          {result.id.N == searchedID
                            ? "This is an Original Inscription."
                            : "This is not an Original Inscription."}
                        </Typography>
                        <Typography
                          col={2}
                          sx={{
                            fontSize: {
                              xs: "1rem",
                              sm: "1rem",
                              md: "1rem",
                              lg: "1.1rem",
                              xl: "1.1rem",
                            },

                            wordWrap: "break-word",
                            textTransform: "none",
                            color: "F8F8FF",
                          }}
                        >
                          {result.id.N == searchedID
                            ? "The first Inscription of this file."
                            : `The Original Inscription is #${result.id.N}`}
                        </Typography>
                      </>
                    ) : (
                      <>
                        <Typography
                          col={2}
                          sx={{
                            fontSize: {
                              xs: "1rem",
                              sm: "1rem",
                              md: "1rem",
                              lg: "1.1rem",
                              xl: "1.1rem",
                            },

                            wordWrap: "break-word",
                            textTransform: "none",
                            color: "F8F8FF",
                          }}
                        >
                          {result
                            ? "This file is already inscribed."
                            : "This file is not yet Inscribed."}
                        </Typography>
                        <Typography
                          col={2}
                          sx={{
                            fontSize: {
                              xs: "1rem",
                              sm: "1rem",
                              md: "1rem",
                              lg: "1.1rem",
                              xl: "1.1rem",
                            },

                            wordWrap: "break-word",
                            textTransform: "none",
                            color: "F8F8FF",
                          }}
                        >
                          {result
                            ? `The Original inscription is #${result.id.N}`
                            : "You can make an Original Inscription of this file."}
                        </Typography>
                      </>
                    )}
                  </>
                ) : fail && !invalidInput ? (
                  <Typography
                    col={2}
                    sx={{
                      fontSize: {
                        xs: "1rem",
                        sm: "1rem",
                        md: "1rem",
                        lg: "1.1rem",
                        xl: "1.1rem",
                      },

                      wordWrap: "break-word",
                      textTransform: "none",
                      color: "F8F8FF",
                    }}
                  >
                    Something went wrong. Try again.
                  </Typography>
                ) : (
                  <Typography
                    col={2}
                    sx={{
                      fontSize: {
                        xs: "1rem",
                        sm: "1rem",
                        md: "1rem",
                        lg: "1.1rem",
                        xl: "1.1rem",
                      },

                      wordWrap: "break-word",
                      textTransform: "none",
                      color: "F8F8FF",
                    }}
                  >
                    Invalid / No Input
                  </Typography>
                )}

                {result && !invalidInput && (
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{
                        backgroundColor: "#3D3EC2",
                        color: "#f8f8ff",
                        fontWeight: 700,

                        "&:hover": {
                          backgroundColor: "#3D3EBA",
                          color: "#C6C9CC",
                        },
                        my: "1rem",
                      }}
                      onClick={() => window.open(result.urls.S, "_blank")}
                    >
                      {result.id.N == searchedID
                        ? "View This Inscription"
                        : "View Original Inscription"}
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{
                        backgroundColor: "#FA14D6",
                        color: "#f8f8ff",
                        fontWeight: 700,

                        "&:hover": {
                          backgroundColor: "#E214CA",
                          color: "#C6C9CC",
                        },
                        mb: "1rem",
                      }}
                      onClick={() =>
                        window.open(
                          `https://ordswap.io/inscription/${result.urls.S.split(
                            "/"
                          ).slice(-1)}`,
                          "_blank"
                        )
                      }
                    >
                      View In OrdSwap
                    </Button>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        fontSize: "1rem",
                      }}
                    >
                      <span>
                        SHA-256 Hash: {hash.slice(0, 8)}...{hash.slice(-8)}{" "}
                      </span>
                      <CopyAllIcon
                        style={{ cursor: "pointer" }}
                        fontSize="small"
                        onClick={handleCopy}
                      />
                    </div>
                  </>
                )}
              </>
            )}
          </Box>
        </div>
      </Box>
      <Disclaimermodal />
    </Box>
  );
}
