import React, { useState, useRef } from "react";
import {
  AppBar,
  Toolbar,
  Slide,
  useScrollTrigger,
  Typography,
  Menu,
  MenuItem,
  Button,
  Stack,
  Slider
} from "@mui/material";
import {
  ExpandLess,
  Menu as MenuIcon,
  MenuOpen as MenuOpenIcon,
} from "@mui/icons-material";

export default function HideAppBar({ chapters, headerRef }) {
  const trigger = useScrollTrigger();
  const menuRef = useRef();
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuIsOpen, setMenuIsOpen] = useState(false);
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

  /**
   * When user clicks the menu icon, open the menu and change icon
   */
  const handleMenuClick = () => {
    setMenuIsOpen(!menuIsOpen);
    setAnchorEl(menuRef.current);
  };


  const handleClose = () => {
    setAnchorEl(null);
    setMenuIsOpen(false);
  };

  /**
   * When the user clicks a chapter in the menu, close the menu then scroll them to that chapter
   */
  const scrollToChapter = (id) => {
    handleClose();
    document.querySelector(`.chap-${id}-header`).scrollIntoView({
      behavior: 'smooth'
    })
  }

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
          <Button onClick={handleMenuClick}>
            {menuIsOpen ? (
              <MenuOpenIcon sx={{ color: "white" }}></MenuOpenIcon>
            ) : (
              <MenuIcon sx={{ color: "white" }} />
            )}
          </Button>
          {/* Back to top button */}
          <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
            <Slider sx={{width: '10em', color: 'white'}} defaultValue={50} aria-label="text-size" value={textSize} onChange={handleTextSlide} />
          </Stack>
          <Typography onClick={scrollToTop} component="div">
            Top <ExpandLess sx={{ verticalAlign: "middle" }} />
          </Typography>
          <Menu
            sx={{ height: "50vh", width: "auto"}}
            open={menuIsOpen}
            onClose={handleClose}
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            {chapters &&
              chapters.map((x, i) => {
                return (
                  <MenuItem>
                    <p id={i+1} onClick={(e) => scrollToChapter(i+1)} className="menu-item">{x.chapter_title}</p>
                  </MenuItem>
                );
              })
            }
          </Menu>
        </Toolbar>
      </AppBar>
    </Slide>
  );
}
