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
    sm: "70%",
    md: "auto",
    lg: 500,
    xl: 500,
  },
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  overflow:"auto",
  height: "auto",
    display:'block',
    maxHeight: "90vh",
    maxWidth: "90vw",
};

export default function BasicModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    
    <Box sx={{ display: "flex", justifyContent:"center", flex: "1 1 100%", }}>
    <Button style={{textDecoration:"underline", color: "#f2b843"}} onClick={handleOpen}>How does this work?</Button>
      
    
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
          Original Ordinal Inscriptions refers to the very first Ordinal Inscriptions of a file identified by its unique SHA-256 value.
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2, fontSize:"1rem", color:"#F2B843" }}>
          How to use the tool?
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2, fontSize:"1rem" }}>
          Upload or enter the inscription #number of a supported file that you like get the status of. The image/inscription hash will be looked up for match against our collected hash database and the output will be displayed in the result column.
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2, fontSize:"1rem", color:"#F2B843" }}>
          Which files are supported?
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2, fontSize:"1rem" }}>
          Image & Video file types that are supported : ".jpg, .jpeg, .png, .webp, .bmp, .gif, .mp4, .mov, .wmv, .avi".
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2, fontSize:"1rem", color:"#F2B843" }}>
          How is this data collected?
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2, fontSize:"1rem" }}>
          Ordinal Inscriptions are passed into a SHA-256 hashing algorithm that calculates the hash value of the inscribed file, exactly byte-to-byte. This SHA-256 hash value is unique, and is used to identify the file's ordinal inscription in the bitcoin blockchain. The very first Ordinal Inscription that exactly matches the hash value of the file byte-to-byte, is the Original Ordinal Inscription of that file. The very first Ordinal Inscription of that file.
          </Typography>
          
          <Button onClick={handleClose} sx={{ backgroundColor: '#3D3EC2', color: 'white', mt: 2, '&:hover': { color: '#1a2027', backgroundColor: '#3D3EC2' } }}>Close</Button>
        </Box>
        
      </Modal>
      </Box>
    
  );
}