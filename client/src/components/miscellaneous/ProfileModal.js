import React from 'react';
import {
  Modal,
  Backdrop,
  Fade,
  Button,
  IconButton,
  Typography,
  Paper,
  Avatar,
} from '@mui/material';
import { Close as CloseIcon, Visibility as ViewIcon } from '@mui/icons-material';
import { useUser } from "../../userContest";

const ProfileModal = ({children }) => {
  
  const [open, setOpen] = React.useState(false);
  const { userId, setUserId, userRole, setUserRole, userData, setUserData } = useUser();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {children ? (
        <span onClick={handleOpen}>{children}</span>
      ) : (
        <IconButton onClick={handleOpen}>
          <ViewIcon />
        </IconButton>
      )}
      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Paper
            sx={{
              width: '80%',
              maxWidth: '400px',
              mx: 'auto',
              mt: '5%',
              p: 2,
            }}
          >
            <Typography variant="h4" align="center">
              {userData.data.name}
            </Typography>
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleClose}
              sx={{ position: 'absolute', top: 0, right: 0 }}
            >
              <CloseIcon />
            </IconButton>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Avatar
                sx={{ width: '150px', height: '150px', mb: 2 }}
                alt={userData.data.name}
                src={userData.data.pic}
              />
              <Typography variant="h6" sx={{ fontFamily: 'Work sans' }}>
                Email: {userData.data.email}
              </Typography>

              <Typography variant="h6" sx={{ fontFamily: 'Work sans' }}>
                National id: {userData.data.nationalId}
              </Typography>

              <Typography variant="h6" sx={{ fontFamily: 'Work sans' }}>
                DOB: {userData.data.dateOfBirth}
              </Typography>
            </div>
            <Button onClick={handleClose} sx={{ mt: 2 }}>
              Close
            </Button>
          </Paper>
        </Fade>
      </Modal>
    </>
  );
};

export default ProfileModal;
