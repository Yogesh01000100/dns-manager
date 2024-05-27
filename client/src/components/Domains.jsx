import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme, useMediaQuery } from "@mui/material";
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
  IconButton,
  Skeleton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import withAuth from "./HOC";
import DomainCard from "./DomainCard";
import { createDomain, deleteDomain, fetchDomains } from "../services/user";

function WDomains() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const [hostedZones, setHostedZones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [newDomainName, setNewDomainName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const initializeDomains = async () => {
    try {
      const zones = await fetchDomains();
      setHostedZones(zones || []);
      setIsLoading(false);
    } catch (err) {
      setError(err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initializeDomains();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleAddDomain = async () => {
    setIsProcessing(true);
    const success = await createDomain(newDomainName);
    if (success) {
      setOpen(false);
      await initializeDomains();
    }
    setIsProcessing(false);
  };

  const handleDeleteDomain = async (zoneId) => {
    setIsProcessing(true);
    const success = await deleteDomain(zoneId);
    if (success) {
      await initializeDomains();
    }
    setIsProcessing(false);
  };

  const handleSelectDomain = (zoneId) => {
    navigate(`/dashboard/${zoneId}`);
  };

  return (
    <Box sx={{ margin: 4, minWidth: 330 }}>
      <DomainCard onOpen={handleOpen} />
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Domain Name</TableCell>
              <TableCell align="center">Zone ID</TableCell>
              <TableCell align="center">Record Count</TableCell>
              <TableCell align="center">Private Zone</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              Array.from(new Array(4)).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton variant="text" width="70%" />
                  </TableCell>
                  <TableCell align="center">
                    <Skeleton variant="text" width="70%" />
                  </TableCell>
                  <TableCell align="center">
                    <Skeleton variant="text" width="50%" />
                  </TableCell>
                  <TableCell align="center">
                    <Skeleton variant="text" width="50%" />
                  </TableCell>
                  <TableCell align="center">
                    <Box display="flex" justifyContent="flex-end" gap={2}>
                      <Skeleton variant="rectangular" width={100} height={32} />
                      <Skeleton variant="rectangular" width={100} height={32} />
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : error ? (
              <TableRow>
                <TableCell colSpan={5}>Error loading data</TableCell>
              </TableRow>
            ) : (
              hostedZones.map((zone) => (
                <TableRow key={zone.Id}>
                  <TableCell>{zone.Name}</TableCell>
                  <TableCell align="center">{zone.Id}</TableCell>
                  <TableCell align="center">
                    {zone.ResourceRecordSetCount}
                  </TableCell>
                  <TableCell align="center">
                    {zone.Config.PrivateZone ? "Yes" : "No"}
                  </TableCell>
                  <TableCell align="center">
                    {isMobile ? (
                      <Box>
                        <IconButton
                          onClick={() => handleSelectDomain(zone.Id)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteDomain(zone.Id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    ) : (
                      <Box>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleSelectDomain(zone.Id)}
                          sx={{ marginRight: 2 }}
                        >
                          Manage
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => handleDeleteDomain(zone.Id)}
                        >
                          Delete
                        </Button>
                      </Box>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiDialog-paper": {
            width: "400px",
            padding: "20px",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <DialogTitle sx={{ fontSize: "1.25rem", fontWeight: "bold" }}>
          Add New Domain
        </DialogTitle>
        <DialogContent sx={{ paddingTop: "10px" }}>
          <TextField
            autoFocus
            margin="dense"
            label="Domain Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newDomainName}
            onChange={(e) => setNewDomainName(e.target.value)}
            sx={{ marginBottom: "20px" }}
          />
        </DialogContent>
        <DialogActions
          sx={{ justifyContent: "space-between", padding: "0 20px 20px" }}
        >
          <Button
            variant="outlined"
            onClick={handleClose}
            sx={{ textTransform: "none", fontSize: "0.875rem" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAddDomain}
            color="primary"
            sx={{ textTransform: "none", fontSize: "0.875rem" }}
            disabled={isProcessing}
          >
            {isProcessing ? <CircularProgress size={24} /> : "Add Domain"}
          </Button>
        </DialogActions>
      </Dialog>
      {isProcessing && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
}

const Domains = withAuth(WDomains);
export default Domains;
