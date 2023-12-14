import MenuIcon from "@mui/icons-material/Menu";
import { Logout as LogoutIcon } from '@mui/icons-material';
import {Popover,MenuItem} from '@mui/material';
import { Avatar } from "@chakra-ui/avatar";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Link } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import axios from "axios";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../userContest";
import { useEffect } from "react";
import { ChatState } from "../Context/ChatProvider";

export default function ButtonAppBar(props) {

  const { userId, setUserId, userRole, setUserRole } = useUser();

  console.log(userId+" "+userRole);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'menu-popover' : undefined;

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          my: 4,
        }}
      >
        <Box sx={{ display: "inline-flex", alignItems: "center" }}>
          <Typography
            sx={{
              fontWeight: "bold",
              verticalAlign: "text-bottom",
              fontSize: "20px",
            }}
          >
            {props.user} Dashboard
          </Typography>
        </Box>
      </Box>
      <Divider />
      {props.children}
    </Box>
  );

  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  const navigate = useNavigate();

  

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const handleLogout = () => {
    axios
      .post("http://localhost:8000/auth/logout")
      .then((response) => {
        console.log(response);
        setUserId("");
        setUserRole("");
        navigate("/signin");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <>
      <div>
        <Drawer
          anchor={"left"}
          open={state["left"]}
          onClose={toggleDrawer("left", false)}
        >
          {list("left")}
        </Drawer>
      </div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={toggleDrawer("left", true)}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, textAlign: "left" }}
            >
              {props.title}
            </Typography>

            <>
            <IconButton
    onClick={handleMenuOpen}
    sx={{ p: 1 }} // Adjust the padding as needed
  >
    <Avatar
      size="small"
      sx={{ width: '32px', height: '32px' }} // Adjust the width and height as needed
    />
  </IconButton>
  
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        
        {
          (userRole === "Patient" || userRole == "Doctor") &&
                  (

                  <MenuItem>
                  <Link to={userRole==="Patient"?`/patient/info`:`/doctor/info`}><span>My Profile</span></Link>
                </MenuItem>
                
                )

        }


        <Divider />
        <MenuItem onClick={handleLogout}>
          <LogoutIcon sx={{ mr: 1 }} />
          Logout
        </MenuItem>
      </Popover>
    </>

            {/* <Menu>
            <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                 name={user.name}
                  src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal 
              user={user}
              >
                <MenuItem>My Profile</MenuItem>{" "}
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </MenuList>
          </Menu> */}
            {/* <Button type="button" color="inherit" onClick={handleLogout}>
              {" "}
              Log out{" "}
            </Button> */}
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
}
