import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AddForm from "./AddForm";
import {
  Paper,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  TextField,
  MenuItem,
  IconButton,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import withAuth from "./HOC";
import { fetchRecords, updateRecord, deleteRecord } from "../services/user.js";

function Dashboard() {
  const { domainId } = useParams();
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedType, setSelectedType] = useState("");
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true); // Ensure loading state is set
        const data = await fetchRecords(domainId);
        console.log("Fetched data: ", data);
        setRecords(data);
      } catch (error) {
        console.error("Error fetching records: ", error);
        setError(error);
      } finally {
        setIsLoading(false); // Ensure loading state is unset
      }
    };
    fetchData();
  }, [domainId]);

  const handleEditClick = (record) => {
    setCurrentRecord(record);
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setCurrentRecord(null);
  };

  const handleSaveChanges = async () => {
    if (currentRecord) {
      const payload = {
        recordId: currentRecord._id,
        name: currentRecord.Name,
        type: currentRecord.Type,
        ttl: currentRecord.TTL,
        values: currentRecord.ResourceRecords.map((rr) => rr.value),
        zoneId: currentRecord.zone,
      };
      await updateRecord(payload);
      setRecords((prevRecords) =>
        prevRecords.map((record) =>
          record._id === currentRecord._id ? currentRecord : record
        )
      );
      setEditDialogOpen(false);
      setCurrentRecord(null);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCurrentRecord((prev) => ({
      ...prev,
      [name]: value,
      ResourceRecords: name === "Value" ? [{ value }] : prev.ResourceRecords,
    }));
  };

  const handleDelete = async () => {
    try {
      await deleteRecord(recordToDelete._id, recordToDelete.zone);
      const updatedRecords = records.filter(
        (record) => record._id !== recordToDelete._id
      );
      setRecords(updatedRecords);
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting record:", error);
      setError(error);
    }
  };

  const handleAddRecord = async (newRecord) => {
    try {
      setRecords((prevRecords) => [...prevRecords, newRecord]);
      const data = await fetchRecords(domainId);
      setRecords(data);
    } catch (error) {
      console.error("Error adding record:", error);
      setError(error);
    }
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setAnchorEl(null);
  };

  const handleOpenDeleteDialog = (record) => {
    setRecordToDelete(record);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setRecordToDelete(null);
  };

  const filteredRecords = selectedType
    ? records.filter((record) => record.Type === selectedType)
    : records;

  return (
    <Box sx={{ p: 4 }}>
      {error && (
        <Typography color="error">
          An error occurred: {error.message}
        </Typography>
      )}
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3, minWidth: 330 }}>
        <Box mb={3}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Manage Records
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{
              fontSize: {
                xs: "0.7rem",
                sm: "0.8rem",
                md: "0.79rem",
              },
            }}
          >
            These records define how your domain behaves. Common uses include
            pointing your domain at web servers or configuring email delivery
            for your domain.
          </Typography>

          <Box mt={2}>
            <AddForm zoneId={domainId} onAddRecord={handleAddRecord} />
          </Box>
        </Box>
      </Paper>

      <TableContainer
        component={Paper}
        elevation={3}
        sx={{ borderRadius: 3, minWidth: 330 }}
      >
        <Table aria-label="records table">
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  textAlign: "center",
                  padding: "8px 16px",
                  borderTopRightRadius: 10,
                }}
              >
                Type
                <IconButton onClick={handleMenuClick}>
                  <ArrowDropDownIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={() => handleTypeSelect("")}>All</MenuItem>
                  {Array.from(
                    new Set(records.map((record) => record.Type))
                  ).map((type) => (
                    <MenuItem key={type} onClick={() => handleTypeSelect(type)}>
                      {type}
                    </MenuItem>
                  ))}
                </Menu>
              </TableCell>
              <TableCell
                sx={{
                  textAlign: "center",
                  padding: "8px 16px",
                  borderTopRightRadius: 10,
                }}
              >
                TTL
              </TableCell>
              <TableCell
                sx={{
                  textAlign: "center",
                  padding: "8px 16px",
                  borderTopRightRadius: 10,
                }}
              >
                Value
              </TableCell>
              <TableCell
                sx={{
                  textAlign: "center",
                  padding: "8px 16px",
                  borderTopRightRadius: 10,
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              Array.from(new Array(4)).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton variant="text" />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" />
                  </TableCell>
                  <TableCell align="center">
                    <Skeleton variant="text" />
                  </TableCell>
                  <TableCell align="right" colSpan={2}>
                    <Box display="flex" justifyContent="flex-end" gap={2}>
                      <Skeleton variant="rectangular" width={100} height={32} />
                      <Skeleton variant="rectangular" width={100} height={32} />
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : filteredRecords.length > 0 ? (
              filteredRecords.map((record, index) => (
                <TableRow key={record._id || index}>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      fontSize: {
                        xs: "0.7rem",
                        sm: "0.8rem",
                        md: "0.9rem",
                      },
                    }}
                  >
                    {record.Type}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      fontSize: {
                        xs: "0.7rem",
                        sm: "0.8rem",
                        md: "0.9rem",
                      },
                    }}
                  >
                    {record.TTL}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      fontSize: {
                        xs: "0.7rem",
                        sm: "0.8rem",
                        md: "0.9rem",
                      },
                    }}
                  >
                    {record.ResourceRecords?.map((rr, idx) => (
                      <span key={idx}>
                        {`${rr.value}${
                          idx < record.ResourceRecords.length - 1 ? ", " : ""
                        }`}
                      </span>
                    ))}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <Button
                      startIcon={<EditIcon />}
                      onClick={() => handleEditClick(record)}
                      sx={{
                        fontSize: {
                          xs: "0rem",
                          sm: "0rem",
                          md: "0.875rem",
                        },
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      startIcon={<DeleteIcon />}
                      color="error"
                      onClick={() => handleOpenDeleteDialog(record)}
                      sx={{
                        fontSize: {
                          xs: "0rem",
                          sm: "0rem",
                          md: "0.875rem",
                        },
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4}>No records found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog}>
        <DialogTitle>Edit Record</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Type"
            type="text"
            fullWidth
            variant="outlined"
            name="Type"
            value={currentRecord?.Type || ""}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="TTL"
            type="number"
            fullWidth
            variant="outlined"
            name="TTL"
            value={currentRecord?.TTL || ""}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Value"
            type="text"
            fullWidth
            variant="outlined"
            name="Value"
            value={
              currentRecord?.ResourceRecords?.map((rr) => rr.value).join(
                ", "
              ) || ""
            }
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button onClick={handleSaveChanges}>Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the record: {recordToDelete?.Name}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default withAuth(Dashboard);
