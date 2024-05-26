import React, { useState } from "react";
import {
  IconButton,
  Popover,
  Card,
  CardContent,
  Avatar,
  Badge,
  InputBase,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import { useSelector } from "react-redux";
import { alpha, styled } from "@mui/material/styles";
import { Dashboard, Settings, Help, ExitToApp } from "@mui/icons-material";
import auth from "../config/firebase-config";
import { sessionLogout } from "../services/auth";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius * 6,
  backgroundColor: alpha(theme.palette.common.white, 0.9),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.9),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
  color: "black",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export default function Header({ toggleSidebar }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);

  const userName = useSelector((state) => state.auth.user?.displayName);
  const userEmail = useSelector((state) => state.auth.user?.email);
  const userPhoto = useSelector((state) => state.auth.user?.photoURL);

  const handlePopoverOpen = (event) => setAnchorEl(event.currentTarget);
  const handlePopoverClose = () => setAnchorEl(null);
  const handleMenuClick = (event) => setMenuAnchorEl(event.currentTarget);
  const handleMenuClose = () => setMenuAnchorEl(null);

  const handleLogout = async () => {
    const response = await sessionLogout();
    if (response.status === 200) {
      sessionStorage.setItem("Logout", true);
      await auth.signOut();
    }
    handleMenuClose();
  };

  const open = Boolean(anchorEl);
  const menuOpen = Boolean(menuAnchorEl);

  return (
    <header
    className="shadow-lg transition-all duration-300 ease-in-out h-15 sm:h-13"
      style={{ backgroundColor: "#2474dd" }}
    >
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex flex-row items-center">
        <IconButton
          onClick={handleMenuClick}
          sx={{ color: "white", display: { xs: "block", md: "none" } }}
        >
          <MenuIcon />
        </IconButton>
        <Menu
          anchorEl={menuAnchorEl}
          open={menuOpen}
          onClose={handleMenuClose}
          onClick={handleMenuClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
        >
          <MenuItem
            onClick={() => {
              /* Navigate to dashboard */
            }}
          >
            <ListItemIcon>
              <Dashboard fontSize="small" />
            </ListItemIcon>
            <ListItemText>Dashboard</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => {
              /* Navigate to settings */
            }}
          >
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            <ListItemText>Settings</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => {
              /* navigate to help */
            }}
          >
            <ListItemIcon>
              <Help fontSize="small" />
            </ListItemIcon>
            <ListItemText>Help</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <ExitToApp fontSize="small" />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </MenuItem>
        </Menu>
        <h1 className="text-lg md:text-2xl font-bold text-white flex-grow text-center min-w-40">
          DNS Manager
        </h1>

        <Search sx={{ display: { xs: 'none', md: 'none', lg: 'flex' } }}>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search"
            inputProps={{ "aria-label": "search" }}
            sx={{minWidth: 150}}
          />
        </Search>
        <div className="flex items-center space-x-2">
          <Tooltip title="Notifications">
            <IconButton sx={{ color: "white" }}>
              <Badge badgeContent={2} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          <IconButton
            onClick={handlePopoverOpen}
            onMouseOver={handlePopoverOpen}
            onMouseOut={handlePopoverClose}
            sx={{ p: 0 }}
          >
            <Avatar src={userPhoto} sx={{ width: 35, height: 35 }} />
          </IconButton>
          <Popover
            id="mouse-over-popover"
            sx={{
              pointerEvents: "none",
              "& .MuiPaper-root": {
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                borderRadius: "5px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.4)",
              },
            }}
            open={open}
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            onClose={handlePopoverClose}
            disableRestoreFocus
          >
            <Card variant="outlined" sx={{ width: 165, height: 75 }}>
              {" "}

              <CardContent sx={{ padding: "8px" }}>
                {" "}
                <div style={{ fontWeight: "bold", fontSize: "0.85rem" }}>
                  Account
                </div>
                <div style={{ fontSize: "0.75rem" }}>
                  <div>{userName}</div>
                  <div>{userEmail}</div>
                </div>
              </CardContent>
            </Card>
          </Popover>
        </div>
      </div>
    </header>
  );
}
