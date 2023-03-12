import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: {
    xs: "90%",
    sm: "auto",
    md: "auto",
    lg: 500,
    xl: 500,
  },
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  overflow: {
    xs: "scroll",
    sm: "scroll",
    md: "auto",
    lg: "scroll",
    xl: "auto",
  },
  height: {
    xs: "90%",
    sm: "80%",
    md: "80%",
    lg: "auto 80%",
    xl: "auto 80%",
  },
    display:'block'
};

export default function BasicModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    
    <Box sx={{ display: "flex", justifyContent: "flex-start", flex: "1 1 100%", my: "1rem" }}>
    <Button style={{textDecoration:"underline", color: "#f2b843"}} onClick={handleOpen}>How is this data collected?</Button>
      
    
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ color: '#F2B843', fontSize:"1.2rem" }}>
            FAQ
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2, fontSize:"1rem" }}>
          Original Ordinal Inscriptions refers to the very first Ordinal Inscription of a file identified by its unique SHA-256 value.
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2, fontSize:"1rem", color:"#F2B843" }}>
          How is this data collected?
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2, fontSize:"1rem" }}>
          Ordinal Inscriptions are passed into a SHA-256 hashing algorithm that calculates the hash value of the inscribed file byte-to-byte. These hashes are then compared with the image hash of the original NFT collection on the Ethereum blockchain. The first Ordinal Inscription that matches the Eth collection image hash exactly byte-to-byte is the Original Inscription which gets populated on the list.
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2, fontSize:"1rem", color:"#F2B843" }}>
          I inscribed my Ethereum NFT image as ordinal but its not showing up on the list. Why?
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2, fontSize:"1rem" }}>
          Please note that images that have been modified during inscribing may not appear in the list, as the image hash will not match due to the alteration of the image data. If you are using tools to inscribe, it is recommended that you disable the resizing and compression options within the tool before inscribing your image file. Additionally, please take note of the "Inscriptions Synced" in the collection info section. It may take some time for new inscriptions to be reflected on the list as they are being synced.
          </Typography>
          <Button onClick={handleClose} sx={{ backgroundColor: '#3D3EC2', color: 'white', mt: 2, '&:hover': { color: 'black', backgroundColor: '#F2B843' } }}>Close</Button>
        </Box>
        
      </Modal>
      </Box>
    
  );
}