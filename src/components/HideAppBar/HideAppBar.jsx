import React from "react";
import {
  AppBar,
  Toolbar,
  Slide,
  useScrollTrigger
} from "@mui/material";

export default function HideAppBar() {
  const trigger = useScrollTrigger();
  
  return (
    <Slide appear={false} direction="up" in={!trigger}>
      <AppBar sx={{top: 'auto', bottom: 0, height: '3.5em'}}>
        <Toolbar>
        </Toolbar>
      </AppBar>
    </Slide>
  )
}
