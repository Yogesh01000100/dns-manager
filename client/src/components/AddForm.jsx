import { useState } from "react";
import { TextField, MenuItem, Button, Box } from "@mui/material";
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecord((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { type, name, value, ttl } = record;
    const newRecord = {
      name,
      type,
      value,
      ttl: Number(ttl),
      zoneId,
    };

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
  };

  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "center",
        alignItems: "center",
        gap: 2,
        flexWrap: "wrap",
        m: 2,
        minWidth: 200,
      }}
      onSubmit={handleSubmit}
      noValidate
      autoComplete="on"
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
        sx={{ width: { xs: "100%", sm: "auto" }, flexGrow: 1 }}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{ width: { xs: "100%", sm: "auto" }, mt: { xs: 2, sm: 0 } }}
      >
        Add Record
      </Button>
    </Box>
  );
}
