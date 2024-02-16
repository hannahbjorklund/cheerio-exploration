import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Slide,
  useScrollTrigger,
  Typography,
  Menu,
  MenuItem,
  Button,
} from "@mui/material"
import { ExpandLess, Menu as MenuIcon, MenuOpen as MenuOpenIcon} from "@mui/icons-material";

export default function HideAppBar({headerRef}) {
  const trigger = useScrollTrigger();
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  /**
   * When user clicks the Top icon in the app bar, scroll them to the top of the page 
   */
  const scrollToTop = () => {
    window.scrollTo({
      top: headerRef.current.offsetTop,
      behavior: 'smooth'
    })
  }
  
  const handleMenuClick = (e) => {
    setMenuIsOpen(!menuIsOpen);
    setAnchorEl(e.currentTarget);
  }

  return (
    <Slide appear={false} direction="up" in={!trigger}>
      <AppBar sx={{top: 'auto', bottom: 0, height: '3.5em', display: 'flex', alignItems: 'flex-start'}}>
        <Toolbar>
          <Button onClick={handleMenuClick}>{menuIsOpen ? <MenuOpenIcon sx={{color: 'white'}}></MenuOpenIcon> : <MenuIcon sx={{color: 'white'}}/>}</Button>
          <Typography onClick = {scrollToTop} component="div">
            Top <ExpandLess sx={{verticalAlign: 'middle'}}/>
          </Typography>
        </Toolbar>
      </AppBar>
    </Slide>
  )
}
