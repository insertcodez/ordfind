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
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};



export default function Disclaimermodal() {
  const [open, setOpen] = React.useState(true);
  const handleClose = () => setOpen(false);

  return (
    
    <Box sx={{ flex: "1 1 100%", my: "1rem" }}>
      <Modal
        open={open}
        
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ color: '#f2b843', fontSize:"1.2rem" }}>
            Disclaimer
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2, fontSize:"1rem" }}>
          Original Ordinal Inscriptions refers to the very first Ordinal Inscription of a file identified by its unique SHA-256 value.
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2, fontSize:"1rem" }}>
          Information provided on this website is for informational purposes only. The owner of this website shall not be held responsible for any actions you may take based on the information provided on this page. Nothing on this page should be construed as financial advice.
          </Typography>
          <Button onClick={handleClose} sx={{ backgroundColor: '#3d3ec2', color: '#f8f8ff', mt: 2, '&:hover': { color: '#C6C9CC', backgroundColor: '#3D3EBA' } }}>I understand.</Button>
        </Box>
        
      </Modal>
      </Box>
    
  );
}