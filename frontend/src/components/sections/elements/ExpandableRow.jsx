import {
  Accordion, AccordionSummary, AccordionDetails,
  Typography, Box, Grid, IconButton
} from "@mui/material";
import { ExpandMore } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ExpandableRow = ({
  item,
  titleField,
  subtitleField,
  subtitleUnit,
  leftColumnTitle,
  rightColumnTitle,
  leftColumnData,
  rightColumnData,
  onEdit,
  onDelete
}) => (
  <Accordion
    sx={{
      mb: 1,
      border: '1px solid rgba(78, 205, 196, 0.2)',
      borderRadius: '8px !important',
      '&:before': { display: 'none' },
      '&.Mui-expanded': { margin: '0 0 8px 0' }
    }}
  >
    <AccordionSummary
      expandIcon={<ExpandMore />}
      sx={{
        '&.Mui-expanded': {
          borderBottom: '1px solid rgba(78, 205, 196, 0.2)',
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', pr: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          {item[titleField]}
        </Typography>
        <Typography sx={{ color: '#44A08D', fontWeight: 500 }}>
          {item[subtitleField]} {subtitleUnit}
        </Typography>
      </Box>
    </AccordionSummary>
    <AccordionDetails>
      <Grid container spacing={2} sx={{ mt: 1, justifyContent: 'center' }}>
        <Grid item xs={12} md={5}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, textAlign: 'center' }}>
            <Typography variant="subtitle2" sx={{
              color: '#4ECDC4',
              fontWeight: 600,
              borderBottom: '2px solid #4ECDC4',
              pb: 0.5,
              mb: 1
            }}>
              {leftColumnTitle}
            </Typography>
            <Box sx={{ pl: 0 }}>
              {leftColumnData(item)}
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={5}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, textAlign: 'center' }}>
            <Typography variant="subtitle2" sx={{
              color: '#4ECDC4',
              fontWeight: 600,
              borderBottom: '2px solid #4ECDC4',
              pb: 0.5,
              mb: 1
            }}>
              {rightColumnTitle}
            </Typography>
            <Box sx={{ pl: 0 }}>
              {rightColumnData(item)}
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <IconButton onClick={() => onEdit(item)} sx={{ color: '#4ECDC4' }}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={() => onDelete(item.id)} color="error">
          <DeleteIcon />
        </IconButton>
      </Box>
    </AccordionDetails>
  </Accordion>
);

export default ExpandableRow;