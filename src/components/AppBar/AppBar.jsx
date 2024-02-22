import React, { useState, useRef } from "react";
import {
  AppBar,
  Toolbar,
  Slide,
  useScrollTrigger,
  Typography,
  Stack,
  Slider
} from "@mui/material";
import {
  ExpandLess,
} from "@mui/icons-material";
import ChapterMenu from "../ChapterMenu/ChapterMenu";

export default function HideAppBar({ chapters, headerRef }) {
  const trigger = useScrollTrigger();
  const menuRef = useRef();
  const [textSize, setTextSize] = useState(50);

  /**
   * When user clicks the Top icon in the app bar, scroll them to the top of the page
   */
  const scrollToTop = () => {
    window.scrollTo({
      top: headerRef.current.offsetTop,
      behavior: "smooth",
    });
  };

  const handleTextSlide = (e, newValue) => {
    console.log(newValue);
    setTextSize(newValue);
  }

  return (
    <Slide appear={false} direction="up" in={!trigger}>
      <AppBar
        sx={{
          top: "auto",
          bottom: 0,
          height: "3.5em",
          display: "flex",
          alignItems: "flex-start",
        }}
      >
        <Toolbar ref={menuRef}>
          {/* Chapter menu */}
          <ChapterMenu chapters={chapters} menuRef={menuRef}/>
          {/* Text size slider */}
          <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
            <Slider sx={{width: '10em', color: 'white'}} defaultValue={50} aria-label="text-size" value={textSize} onChange={handleTextSlide} />
          </Stack>
          {/* Back to top button */}
          <Typography onClick={scrollToTop} component="div">
            Top <ExpandLess sx={{ verticalAlign: "middle" }} />
          </Typography>
        </Toolbar>
      </AppBar>
    </Slide>
  );
}
