import MenuIcon from "@mui/icons-material/Menu";
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
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from "react";
import io from 'socket.io-client';

export default function ButtonAppBar(props) {
	const { userId, setUserId, userRole, setUserRole } = useUser();
	const [notifications, setNotifications] = useState([]);

	useEffect(() => {
		const socket = io('http://localhost:9000');

		fetchNotifications();
		console.log("userId:", userId);
		//socket.emit('setup', userId)
		socket.on('newNotification', (newNotification) => {
			console.log("newNotification:", newNotification);
			//setNotifications((prevNotifications) => [newNotification, ...prevNotifications]);
			fetchNotifications();
		});
		socket.on('foo', () => {
			console.log("foo");
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
	};

	const handleClose = () => {
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
						<div>
							<IconButton onClick={handleClick} color="inherit">
								<NotificationsIcon />
							</IconButton>
							<Menu
								anchorEl={anchorEl}
								open={Boolean(anchorEl)}
								onClose={handleClose}
							>
								{notifications.map((notification, index) => (
									<MenuItem key={index} onClick={handleClose}>
										{notification.content}
									</MenuItem>
								))}
							</Menu>
						</div>
						<Button type="button" color="inherit" onClick={handleLogout}>
							{" "}
							Log out{" "}
						</Button>
					</Toolbar>
				</AppBar>
			</Box >
		</>
	);
}
