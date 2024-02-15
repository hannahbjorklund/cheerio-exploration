import React from "react";
import {
  AppBar,
  Toolbar,
  Slide,
  useScrollTrigger,
  Typography
} from "@mui/material";
import { ExpandLess } from "@mui/icons-material";

export default function HideAppBar({headerRef}) {
  const trigger = useScrollTrigger();

  /**
   * When user clicks the Top icon in the app bar, scroll them to the top of the page
   */
  const scrollToTop = () => {
    window.scrollTo({
      top: headerRef.current.offsetTop,
      behavior: 'smooth'
    })
  }
  
  return (
    <Slide appear={false} direction="up" in={!trigger}>
      <AppBar sx={{top: 'auto', bottom: 0, height: '3.5em', display: 'flex', alignItems: 'flex-end', justifyContent: 'center'}}>
        <Toolbar>
          <Typography onClick = {scrollToTop} component="div">
            Top <ExpandLess sx={{verticalAlign: 'middle'}}/>
          </Typography>
        </Toolbar>
      </AppBar>
    </Slide>
  )
}
