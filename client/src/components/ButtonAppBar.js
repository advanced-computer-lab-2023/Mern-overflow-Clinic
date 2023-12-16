import MenuIcon from "@mui/icons-material/Menu";
import { Logout as LogoutIcon } from '@mui/icons-material';
import {Popover} from '@mui/material';
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
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from "react";
import io from 'socket.io-client';
import { ChatState } from "../Context/ChatProvider";

export default function ButtonAppBar(props) {
	const { userId, setUserId, userRole, setUserRole } = useUser();
	const [notifications, setNotifications] = useState([]);
	const [newNotifications, setNewNotifications] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		let socket = io('http://localhost:8000');

		fetchNotifications();
		socket.emit('setupNotifications', userId);
		socket.on('newNotification', (newNotification) => {
			console.log("newNotification:", newNotification);
			setNotifications((prevNotifications) => [newNotification, ...prevNotifications]);
			//fetchNotifications();
			setNewNotifications(true);
		});
		return () => {
			socket.disconnect();
		};
	}, []);

	const fetchNotifications = async () => {
		try {
			const response = await axios.get('http://localhost:8000/notifications/${userId}');
			const data = await response.data;
			setNotifications(data);
		} catch (error) {
			console.error('Error fetching notifications:', error);
		}
	};

	console.log("notifications:", notifications);
	const [anchorEl, setAnchorEl] = useState(null);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
		setNewNotifications(false);
	};

	const handleClose = (link) => {
		console.log("navigating to link:", link);

		if(link.includes("meet.google")){
			window.open(link, "_blank");
		}else if (link.includes("chat")){
			if(!window.location.href.includes("chat"))window.location.href = link;
		}
		else{
			navigate(link);
		}
		setAnchorEl(null);
	};

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
						<div>
							<IconButton onClick={handleClick} color="inherit">
								{newNotifications ? (
									<NotificationImportantIcon style={{ color: 'red' }} />
								) : (
									<NotificationsIcon />
								)}
							</IconButton>
							<Menu
								anchorEl={anchorEl}
								open={Boolean(anchorEl)}
								onClose={() => setAnchorEl(null)}
							>
								{notifications.map((notification, index) => (
									<MenuItem key={index} onClick={() => handleClose(notification.link)}>
										{notification.content}
									</MenuItem>
								))}
							</Menu>
						</div>

						<>
            {/* <IconButton
    onClick={handleMenuOpen}
    sx={{ p: 1 }} // Adjust the padding as needed
  >
    <Avatar
      size="small"
      sx={{ width: '32px', height: '32px' }} // Adjust the width and height as needed
    />
  </IconButton> */}
  
      {/* <Popover
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
      > */}
        
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
      {/* </Popover> */}
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
			</Box >
		</>
	);
}
