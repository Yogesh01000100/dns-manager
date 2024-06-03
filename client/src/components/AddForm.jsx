import { useState } from "react";
import { TextField, MenuItem, Button, Box, CircularProgress } from "@mui/material";
import { createRecord } from "../services/user.js";

const recordTypes = [
  { value: "A", label: "A" },
  { value: "AAAA", label: "AAAA" },
  { value: "CNAME", label: "CNAME" },
  { value: "MX", label: "MX" },
  { value: "TXT", label: "TXT" },
];

export default function AddForm({ zoneId, onAddRecord }) {
  const [record, setRecord] = useState({
    type: "A",
    name: "",
    value: "",
    ttl: "",
  });
  const [isAdding, setIsAdding] = useState(false); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecord((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsAdding(true);
    const { type, name, value, ttl } = record;
    const newRecord = {
      name,
      type,
      value,
      ttl: Number(ttl),
      zoneId,
    };

    try {
      const success = await createRecord(newRecord);
      if (success) {
        onAddRecord({
          Type: newRecord.type,
          Name: newRecord.name,
          TTL: newRecord.ttl,
          ResourceRecords: [{ value: newRecord.value }],
        });
        setRecord({ type: "A", name: "", value: "", ttl: "" });
      }
    } catch (error) {
      console.error('Error adding record:', error);
    }
    setIsAdding(false); 
  };

  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        m: 2,
        minWidth: 200,
      }}
      onSubmit={handleSubmit}
      noValidate
      autoComplete="on"
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <TextField
          select
          name="type"
          label="Type"
          value={record.type}
          onChange={handleChange}
          variant="outlined"
          size="small"
          sx={{ width: { xs: "100%", sm: "auto" }, flexGrow: 1 }}
        >
          {recordTypes.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          name="name"
          label="Name"
          placeholder="@"
          value={record.name}
          onChange={handleChange}
          variant="outlined"
          size="small"
          sx={{ width: { xs: "100%", sm: "auto" }, flexGrow: 1 }}
        />
        <TextField
          name="value"
          label="Target"
          placeholder="Points to"
          value={record.value}
          onChange={handleChange}
          variant="outlined"
          size="small"
          sx={{ width: { xs: "100%", sm: "auto" }, flexGrow: 1 }}
        />
        <TextField
          name="ttl"
          label="TTL"
          placeholder="14400"
          type="number"
          value={record.ttl}
          onChange={handleChange}
          variant="outlined"
          size="small"
          sx={{ width: { xs: "100%", sm: "150px" }, flexGrow: 0 }}
        />
      </Box>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={isAdding}
        sx={{
          width: { xs: "100%", sm: "auto" },
          mt: 2,
          alignSelf: "center",
        }}
      >
        {isAdding ? <CircularProgress size={24} /> : "Add Record"}
      </Button>
    </Box>
  );
}
