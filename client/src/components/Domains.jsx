import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Table,
  Box,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Skeleton,
} from "@mui/material";
import withAuth from "./HOC";

import { fetchDomains } from "../services/user.js";

function WDomains() {
  const navigate = useNavigate();
  const {
    data: hostedZones,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["hostedZones"],
    queryFn: fetchDomains,
    staleTime: 10000,
  });

  const handleSelectDomain = (zoneId) => {
    navigate(`/dashboard/${zoneId}`);
  };

  return (
    <Box sx={{ margin: 4, minWidth: 427 }}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ padding: "8px 16px", fontSize: "0.875rem" }}>
                Domain Name
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  padding: "13px 16px",
                  fontSize: "0.875rem",
                  borderTopRightRadius: 10,
                }}
              >
                Zone ID
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  textAlign: "center",
                  padding: "13px 16px",
                  fontSize: "0.875rem",
                  borderTopRightRadius: 10,
                }}
              >
                Record Count
              </TableCell>
              <TableCell
                align="center"
                sx={{ padding: "13px 16px", fontSize: "0.875rem" }}
              >
                Private Zone
              </TableCell>
              <TableCell
                align="center"
                sx={{ padding: "13px 16px", fontSize: "0.875rem" }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading || error
              ? Array.from(new Array(4)).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton variant="text" width="70%" />
                    </TableCell>
                    <TableCell align="right">
                      <Skeleton variant="text" width="70%" />
                    </TableCell>
                    <TableCell align="right">
                      <Skeleton variant="text" width="50%" />
                    </TableCell>
                    <TableCell align="right">
                      <Skeleton variant="text" width="50%" />
                    </TableCell>
                    <TableCell align="right">
                      <Box display="inline-block" width="80px">
                        <Skeleton
                          variant="rectangular"
                          width="80px"
                          height={36}
                        />
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              : hostedZones.map((zone) => (
                  <TableRow
                    key={zone.Id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{
                        fontSize: {
                          xs: "0.75rem",
                          sm: "0.8rem",
                          md: "0.875rem",
                        },
                      }}
                    >
                      {zone.Name}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontSize: {
                          xs: "0.75rem",
                          sm: "0.8rem",
                          md: "0.875rem",
                        },
                      }}
                    >
                      {zone.Id}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontSize: {
                          xs: "0.75rem",
                          sm: "0.8rem",
                          md: "0.875rem",
                        },
                      }}
                    >
                      {zone.ResourceRecordSetCount}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontSize: {
                          xs: "0.75rem",
                          sm: "0.8rem",
                          md: "0.875rem",
                        },
                      }}
                    >
                      {zone.Config.PrivateZone ? "Yes" : "No"}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleSelectDomain(zone.Id)}
                        sx={{
                          fontSize: {
                            xs: "0.75rem",
                            sm: "0.8rem",
                            md: "0.875rem",
                          },
                        }}
                      >
                        Manage
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

const Domains = withAuth(WDomains);
export default Domains;
