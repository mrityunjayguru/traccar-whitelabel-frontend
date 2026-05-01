import { makeStyles } from '@mui/styles';

export default makeStyles((theme) => ({
  container: {
    flex: 1,
    display: 'flex',
    overflow: 'hidden',
    height: '100%',
    flexDirection: 'column',
  },
  containerMap: {
    flexBasis: '40%',
    flexShrink: 0,
  },
  containerMain: {
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    '& .MuiTable-root': {
      borderCollapse: 'separate',
      borderSpacing: 0,
      width: '100%',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      textAlign: 'left',
    },
    '& .MuiTableHead-root': {
      display: 'table',
      width: '100%',
      tableLayout: 'fixed',
      flexShrink: 0,
    },
    '& .MuiTableBody-root': {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      '& .MuiTableRow-root': {
        display: 'table',
        width: '100%',
        tableLayout: 'fixed',
        '&.empty-row': {
          flex: 1,
          display: 'flex',
          '& .MuiTableCell-root': {
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
        },
      },
    },
    '& .MuiTableCell-head': {
      backgroundColor: theme.palette.background.paper,
      fontWeight: 'bold',
      color: theme.palette.text.primary,
      borderBottom: `2px solid ${theme.palette.divider}`,
      position: 'sticky',
      top: 0,
      zIndex: 2,
      padding: theme.spacing(1.5, 2),
      whiteSpace: 'nowrap',
    },
    '& .MuiTableCell-body': {
      padding: theme.spacing(1.2, 2),
      borderBottom: `1px solid ${theme.palette.divider}`,
      fontSize: '0.875rem',
    },
    '& .MuiTableRow-root': {
      '&:nth-of-type(even)': {
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
      },
      '&:hover': {
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
        transition: 'background-color 0.2s ease',
      },
    },
  },
  header: {
    position: 'sticky',
    left: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  columnAction: {
    width: '1%',
    paddingLeft: theme.spacing(1),
  },
  filter: {
    display: 'inline-flex',
    flexWrap: 'wrap',
    gap: theme.spacing(2),
    padding: theme.spacing(3, 2, 2),
  },
  filterItem: {
    minWidth: 0,
    flex: `1 1 ${theme.dimensions.filterFormWidth}`,
  },
  filterButtons: {
    display: 'flex',
    gap: theme.spacing(1),
    flex: `1 1 ${theme.dimensions.filterFormWidth}`,
  },
  filterButton: {
    flexGrow: 1,
  },
  chart: {
    flexGrow: 1,
    overflow: 'hidden',
  },
  actionCellPadding: {
    '&.MuiTableCell-body': {
      paddingTop: 0,
      paddingBottom: 0,
    },
  },
}));
