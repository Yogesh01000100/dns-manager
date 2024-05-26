import React from 'react';
import { IconButton, Card, CardContent, Typography, Tooltip } from '@mui/material';
import { ChevronLeft, ChevronRight, Dashboard, Settings, Help, ExitToApp, Dns, RocketRounded } from '@mui/icons-material';
import auth from '../config/firebase-config';
import { sessionLogout } from '../services/auth';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const handleLogout = async () => {
    const response = await sessionLogout();
    if (response.status === 200) {
      sessionStorage.setItem("Logout", true);
      await auth.signOut();
    }
  };
  return (
    <div
      className={`${
        isOpen ? "w-64" : "w-20"
      } h-full bg-gray-800 text-white fixed transition-width duration-300 ease-in-out flex flex-col justify-between`}
    >
      <div>
        <div className="p-5 font-bold text-xl flex justify-between items-center mb-5">
          <span className={`${isOpen ? "block" : "hidden"} flex items-center`}>
            <Dns className="mr-2" />
            Dashboard
          </span>
          <IconButton
            onClick={toggleSidebar}
            sx={{
              backgroundColor: "white",
              "&:hover": {
                backgroundColor: "slategray",
              },
              color: "black",
              borderRadius: "40%",
              padding: 1,
            }}
          >
            {isOpen ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        </div>
        <ul className="space-y-2">
          <li className="ml-2">
            <a
              href="/home"
              className="flex items-center p-4 w-3/4 hover:bg-gray-700 transition duration-300 ease-in-out transform rounded-full"
            >
              {isOpen ? (
                <Dashboard className="mr-4" />
              ) : (
                <Tooltip title="Dashboard" placement="right-start">
                  <Dashboard />
                </Tooltip>
              )}
              <span className={`${isOpen ? "block" : "hidden"}`}>Domains</span>
            </a>
          </li>
          <li className="ml-2">
            <a
              href="/settings"
              className="flex items-center p-4 w-3/4 hover:bg-gray-700 transition duration-300 ease-in-out transform rounded-full"
            >
              {isOpen ? (
                <Settings className="mr-4" />
              ) : (
                <Tooltip title="Settings" placement="right-start">
                  <Settings />
                </Tooltip>
              )}
              <span className={`${isOpen ? "block" : "hidden"}`}>Settings</span>
            </a>
          </li>
          <li className="ml-2">
            <a
              href="/help"
              className="flex items-center p-4 w-3/4 hover:bg-gray-700 transition duration-300 ease-in-out transform rounded-full"
            >
              {isOpen ? (
                <Help className="mr-4" />
              ) : (
                <Tooltip title="Help">
                  <Help />
                </Tooltip>
              )}
              <span className={`${isOpen ? "block" : "hidden"}`}>Help</span>
            </a>
          </li>
        </ul>
      </div>
      <div>
        {isOpen ? (
          <div className="p-3">
            <Card
              sx={{
                height: 110,
                background: "rgba(255, 255, 255, 0.9)",
                borderRadius: "4px",
                border: "1px solid black",
                "@keyframes rocketTakeoff": {
                  "0%": {
                    transform: "translateY(0)",
                    opacity: 1,
                  },
                  "100%": {
                    transform: "translateY(-10px)",
                    opacity: 0.5,
                  },
                },
                "@keyframes glow": {
                  "0%": { filter: "brightness(1)" },
                  "50%": { filter: "brightness(1.5)" },
                  "100%": { filter: "brightness(1)" },
                },
              }}
            >
              <CardContent>
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{
                    fontWeight: "bold",
                    fontSize: "0.94rem",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  System Update 1.0
                  <RocketRounded
                    sx={{
                      animation:
                        "rocketTakeoff 2s ease-in-out infinite alternate",
                      marginLeft: "8px",
                      verticalAlign: "middle",
                    }}
                  />
                </Typography>
                <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                  DNS Manager has entered its alpha phase.{" "}
                  <a
                    href="https://github.com/Yogesh01000100"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "underline", color: "blue" }}
                  >
                    <span>learn more</span>
                  </a>
                </Typography>
              </CardContent>
            </Card>
          </div>
        ) : (
          " "
        )}

        <div className="p-3">
          <a
            href="/user/auth"
            className="flex items-center p-4 hover:bg-gray-700 transition duration-300 ease-in-out transform rounded-full"
          >
            {isOpen ? (
              <ExitToApp className="mr-4" />
            ) : (
              <Tooltip title="Logout">
                <ExitToApp />
              </Tooltip>
            )}
            <span
              className={`${isOpen ? "block" : "hidden"}`}
              onClick={handleLogout}
            >
              Logout
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
export default Sidebar;