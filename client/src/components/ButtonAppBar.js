import * as React from 'react';
import { Typography, Toolbar, Box, AppBar, IconButton, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

export default function ButtonAppBar(props) {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'left' }}>
                        {props.title}
                    </Typography>
                    <Button color="inherit"> {props.actionButton} </Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
