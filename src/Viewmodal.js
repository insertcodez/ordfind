import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import { Card, CardContent } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: {
    xs: "90%",
    sm: "70%",
    md: "auto",
    lg: "auto",
    xl: "auto",
  },
  bgcolor: "background.paper",
  border: "2px solid #3d3ec2",
        boxShadow: "0 0 10px #3d3ec2",
  // boxShadow: 24,
  p: 4,
  overflow: "auto",
  height: "auto",
  display: "block",
  maxHeight: "90vh",
  maxWidth: "90vw",
};

export default function BasicModal(props) {
  const { currentData, openView, handleViewClose, collectionLabel } = props;

  return (
    currentData && (
      <Box sx={{ display: "flex", justifyContent: "center", flex: "1 1 100%" }}>
        <Modal
          open={openView}
          onClose={handleViewClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              sx={{
                color: "#F2B843",
                fontSize: "1.3rem",
                fontWeight: "700",
                wordBreak: "break-word",
              }}
            >
              {collectionLabel} #{currentData.token_id}
            </Typography>
            <Typography
              id="modal-modal-description"
              sx={{ mt: 2, fontSize: "1.1rem" }}
            >
              Status :{" "}
              {currentData.ordinalmatch ? "Inscribed" : "Not Inscribed"}
            </Typography>
            <Typography
              id="modal-modal-description"
              sx={{ fontSize: "1.1rem" }}
            >
              Original Inscription :{" "}
              {currentData.ordinalmatch ? (
                <a
                  href={currentData.ordinalmatch[0].url}
                  target="_blank"
                  style={{ color: "#F2B843", textDecoration: "underline" }}
                >
                  #{currentData.ordinalmatch[0].id}
                </a>
              ) : (
                "-"
              )}
            </Typography>
            <div style={{ display: "flex", alignItems: "center" }}>
              {currentData.ordinalmatch ? (
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: "1.1rem",
                    lineHeight: "1.2",
                    textAlign: "left",
                    wordBreak: "break-all",
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center" }}>
                    OrdSwap :
                    <button
                      type="button"
                      onClick={() =>
                        window.open(
                          `https://ordswap.io/inscription/${currentData.ordinalmatch[0].url
                            .split("/")
                            .slice(-1)}`,
                          "_blank"
                        )
                      }
                      style={{
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        color: "#F2B843",
                        display: "flex",
                        alignItems: "center",
                        marginLeft: "1px",
                      }}
                    >
                      <OpenInNewRoundedIcon />
                    </button>
                  </span>
                </Typography>
              ) : (
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: "1rem",
                    lineHeight: "1.2",
                    textAlign: "left",
                    wordBreak: "break-all",
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center" }}>
                    OrdSwap : -
                  </span>
                </Typography>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: "1.1rem",
                  lineHeight: "1.2",
                  textAlign: "left",
                  wordBreak: "break-all",
                }}
              >
                <span style={{ display: "flex", alignItems: "center" }}>
                  Original Image :
                  <button
                    type="button"
                    onClick={() => window.open(currentData.image_url, "_blank")}
                    style={{
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      color: "#F2B843",
                      display: "flex",
                      alignItems: "center",
                      marginLeft: "1px",
                    }}
                  >
                    <OpenInNewRoundedIcon />
                  </button>
                </span>
              </Typography>
            </div>
            <Typography
              id="modal-modal-description"
              sx={{ fontSize: "1.1rem" }}
            >
              SHA-256 Hash : {currentData.hashfield.slice(0, 6)}...
              {currentData.hashfield.slice(-6)}{" "}
            </Typography>

            <Typography
              id="modal-modal-description"
              sx={{ fontSize: "1.1rem" }}
            >
              Traits :
            </Typography>
            <div>
            {currentData.attributes.map((trait) => (
              <Button key={trait.value} sx={{ border:"2px solid #3d3ec2", marginRight:"0.4rem", marginTop:"0.4rem" }}>
                
                <Typography
                  id="modal-modal-title"
                  variant="h6"
                  component="h2"
                  sx={{
                    color: "#F2B843",
                    fontSize: "0.9rem",
                    
                    wordBreak: "break-word",
                  }}
                >
                  {trait.value}
                </Typography>
              </Button>
            ))}
            </div>
            <Button
              onClick={handleViewClose}
              sx={{
                backgroundColor: "#3D3EC2",
                color: "white",
                mt: 2,
                "&:hover": { color: "#1a2027", backgroundColor: "#3D3EC2" },
              }}
            >
              Close
            </Button>
          </Box>
        </Modal>
      </Box>
    )
  );
}
