import MenuIcon from "@mui/icons-material/Menu";
import { Logout as LogoutIcon } from '@mui/icons-material';
import { Popover } from '@mui/material';
import { Avatar } from "@chakra-ui/avatar";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Link } from 'react-router-dom';
import { Container, Typography, IconButton, Grid } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';
import FacebookIcon from '@mui/icons-material/Facebook';
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {
	AppBar,
	Zoom,
	Chip,
	Box,
	Button,
	Fab,
	Divider,
	Drawer,
	Toolbar,
} from "@mui/material";
import axios from "axios";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../userContest";
import { useEffect } from "react";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import CloseIcon from "@mui/icons-material/Close";
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';
import CallIcon from '@mui/icons-material/Call';
import Menu from '@mui/material/Menu';
import logo from "../assets/photos/logo.png";
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

	const [anchorEl, setAnchorEl] = useState(null);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
		setNewNotifications(false);
	};

	const handleClose = (link) => {
		console.log("navigating to link:", typeof link);
		if (typeof link !== 'object') {
			if (link.includes("chat")) {
				if (!window.location.href.includes("chat")) window.location.href = link;
			}
			else if (link.includes("meet.google")){
				window.open(link, '_blank');
			}
			else {
				navigate(link);
			}
		}
		setAnchorEl(null);
	};

	const list = (anchor) => (
		<Box sx={{ display: "flex", justifyContent: "space-between", flexDirection: "column", height: "100%" }}>
			<Box
				sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
				role="presentation"
				onClick={toggleDrawer(anchor, false)}
				onKeyDown={toggleDrawer(anchor, false)}
			>
				<Box sx={{ my: "30px" }}></Box>
				<Divider>
					<Chip
						sx={{ mx: "10px", color: "#333", backgroundColor: "#293241", color: "white", fontSize: "15px" }}
						label={`${props.user} Dashboard`}
					/>
				</Divider>
				<Box sx={{ my: "20px" }}></Box>
				{props.children}
			</Box>

			<Box>
				<Typography sx={{ fontFamily: "rubik", fontSize: "14px", margin: "10px", color: "#293241" }}>
					© 2023 El7a2ny Solutions
				</Typography>
			</Box>
		</Box>
	);

	const [state, setState] = React.useState({
		top: false,
		left: false,
		bottom: false,
		right: false,
	});

	const [isVisible, setIsVisible] = useState(false);

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth"
		});
	};

	const handleScroll = () => {
		if (window.pageYOffset > 300) {
			setIsVisible(true);
		} else {
			setIsVisible(false);
		}
	};

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
			<Zoom in={isVisible}>
				<Fab color="primary" onClick={scrollToTop} sx={{ position: "fixed", bottom: 30, right: 30 }}>
					<ArrowUpwardIcon />
				</Fab>
			</Zoom>
			<div>
				<Drawer anchor={"left"} open={state["left"]} onClose={toggleDrawer("left", false)}>
					<Box sx={{ display: "flex", justifyContent: "space-between" }}>
						<img src={logo} alt="Logo" style={{ width: "50px", height: "auto", margin: "10px" }} />
						<IconButton
							variant="contained"
							sx={{ height: "50px", width: "50px", margin: "10px" }}
							onClick={toggleDrawer("left", false)}
						>
							<CloseIcon />
						</IconButton>
					</Box>
					<Typography sx={{ mx: "10px", fontFamily: "cursive", fontWeight: "bold", color: "#1564C0" }}>
						{" "}
						El7a2ny Clinic
					</Typography>
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
						<Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: "left" }}>
							{props.title}
						</Typography>
						<Grid sx={{ marginRight: '43em' }} >
							<a href="https://www.facebook.com/el7a2nycaree" target="_blank" rel="noopener noreferrer">
								<IconButton color="white" aria-label="Facebook">
								<Facebook />
								</IconButton>
							</a>
							<a href="https://twitter.com/el7a2nycaree" target="_blank" rel="noopener noreferrer">
								<IconButton color="white" aria-label="Twitter">
								<Twitter />
								</IconButton>
							</a>
							<a href="https://www.instagram.com/el7a2nycaree" target="_blank" rel="noopener noreferrer">
								<IconButton color="white" aria-label="Instagram">
								<Instagram />
								</IconButton>
							</a>
						</Grid>
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
								onClose={handleClose}
							>
								{notifications.map((notification, index) => (
									<MenuItem key={index} onClick={() => handleClose(notification.link)}>
										{notification.content}
									</MenuItem>
								))}
							</Menu>
						</div>
						{
							userRole && (userRole === "Patient" || userRole === "Doctor") && (
								<IconButton
								size="large"
								edge="end"
								color="inherit"
								aria-label="menu"
								sx={{ mr: 0 }}
								component={Link}
								to={`/${userRole.toLowerCase()}/info`}
								>
								<AccountCircleIcon />
								</IconButton>
							)
						}
						<IconButton
							size="large"
							edge="end"
							color="inherit"
							aria-label="logout"
							sx={{ mr: 3 }}
							component={Link}
							onClick={handleLogout}
						>
							<LogoutIcon />
						</IconButton>
					</Toolbar>
				</AppBar>
			</Box>
		</>
	);
}
