import React from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Drawer from "@mui/material/Drawer";
import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles({
    test: {
        fontSize: 70
    }
});

export default function Layout({ children }) {
    const classes = useStyles();

    return (
        <div className="content">
            {/* <AppBar>
                <Toolbar>
                    <Typography className={classes.tets}>
                        helloworld
                    </Typography>
                </Toolbar>
            </AppBar> */}
            <Drawer>
                <div>
                    <Typography>helloworld</Typography>
                </div>
            </Drawer>
            <Navbar/>
            { children }
            <Footer/>
        </div>
    );
}