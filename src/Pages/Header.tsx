import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  CssBaseline,
  IconButton,
  Box,
  Drawer,
  Divider,
  ListItem,
  ListItemButton,
  ListItemText,
  List,
  Menu,
  MenuItem,
  Tooltip,
  Avatar,
  Grid,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { logout } from "../redux/authSlice";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import logo from "../assets/suitcases.png";

interface Props {
  window?: () => Window;
}

const Header = (props: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const userData = useSelector((state: RootState) => state.auth.user);
  const token = localStorage.getItem("token");
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { window } = props;

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Link
        to="/"
        style={{
          textDecoration: "none",
          color: "black",
          fontWeight: "bolder",
        }}
      >
        <Box
          sx={{
            my: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img src={logo} alt="hotel-logo" width={25} />
          <Typography component={"span"} sx={{ fontSize: 20, ml: 1 }}>
            Room Reserve
          </Typography>
        </Box>
      </Link>
      <Divider />
      <List>
        <ListItem component={Link} to="/" disablePadding>
          <ListItemButton sx={{ textAlign: "center", color: "black" }}>
            <ListItemText primary={"Home"} />
          </ListItemButton>
        </ListItem>
        {token && (
          <ListItem component={Link} to="/profile" disablePadding>
            <ListItemButton sx={{ textAlign: "center", color: "black" }}>
              <ListItemText primary={"Profile"} />
            </ListItemButton>
          </ListItem>
        )}
        {userData?.isAdmin && (
          <ListItem component={Link} to="/dashboard" disablePadding>
            <ListItemButton sx={{ textAlign: "center", color: "black" }}>
              <ListItemText primary={"Dashboard"} />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <>
      <CssBaseline />
      <AppBar component={"nav"}>
        <Container>
          <Toolbar>
            <Grid
              container
              alignItems={"center"}
              justifyContent={{ xs: "space-between" }}
            >
              <Grid item>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ display: { sm: "none" } }}
                >
                  <MenuIcon />
                </IconButton>
              </Grid>
              <Grid item>
                <Link
                  to="/"
                  style={{
                    color: "#fff",
                    textDecoration: "none",
                  }}
                >
                  <Box display="flex" alignItems="center">
                    <img src={logo} alt="hotel-logo" width={25} />
                    <Typography variant="h5" sx={{ ml: 1 }} component="span">
                      Room Reserve
                    </Typography>
                  </Box>
                </Link>
              </Grid>
              <Grid item sx={{ ml: { sm: "auto" } }}>
                <Box>
                  <Tooltip title="Profile">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar>
                        {userData?.name ? userData.name[0] : <PersonIcon />}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: 5 }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    {userData?.isAdmin && (
                      <Link to="/dashboard" style={{ textDecoration: "none" }}>
                        <MenuItem>
                          <Typography textAlign="center" color={"primary.main"}>
                            Dashboard
                          </Typography>
                        </MenuItem>
                      </Link>
                    )}

                    <Link
                      to={token ? "/profile" : "/login"}
                      style={{ textDecoration: "none" }}
                    >
                      <MenuItem>
                        <Typography textAlign="center" color={"primary.main"}>
                          {token ? "Profile" : "Login"}
                        </Typography>
                      </MenuItem>
                    </Link>
                    {token && (
                      <Link to="/" style={{ textDecoration: "none" }}>
                        <MenuItem onClick={handleLogout}>
                          <Typography textAlign="center" color={"primary.main"}>
                            Logout
                          </Typography>
                        </MenuItem>
                      </Link>
                    )}
                  </Menu>
                </Box>
              </Grid>
            </Grid>
          </Toolbar>
        </Container>
      </AppBar>
      <Box component="nav">
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: 240,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </>
  );
};

export default Header;
