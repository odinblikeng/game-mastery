import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";

export default function Footer() {
  return (
    <Box component="footer" sx={{ mt: "auto" }}>
      <Divider />
      <Container maxWidth="lg" sx={{ py: 2 }} />
    </Box>
  );
}