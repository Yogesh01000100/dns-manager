import React from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";

function DomainCard({ onOpen }) {
  return (
    <Card sx={{ maxWidth: 345, mb: 2 }}>
      <CardContent>
        <Typography
          gutterBottom
          variant="h5"
          component="div"
          fontWeight="bold"
          sx={{
            fontSize: {
              xs: ".9rem",
              sm: "1rem",
              md: "1.05rem",
            },
          }}
        >
          Domain Management
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            fontSize: {
              xs: "0.7rem",
              sm: "0.8rem",
              md: "0.79rem",
            },
          }}
        >
          Manage your DNS records with ease. Add a valid domain to get started.
        </Typography>
        <Button
          variant="contained"
          onClick={onOpen}
          sx={{
            marginTop: 2,
            fontSize: { xs: "0.75rem", sm: "0.875rem", md: ".8rem" },
          }}
        >
          Add Domain
        </Button>
      </CardContent>
    </Card>
  );
}

export default DomainCard;
