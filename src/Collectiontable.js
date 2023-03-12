import * as React from "react";
import { useState, useEffect, forwardRef, useRef } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import ExpandCircleDownIcon from "@mui/icons-material/ExpandCircleDown";
import ArrowCircleUpSharpIcon from "@mui/icons-material/ArrowCircleUpSharp";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import { visuallyHidden } from "@mui/utils";
import Toolbar from "@mui/material/Toolbar";
import TableSortLabel from "@mui/material/TableSortLabel";
import TablePagination from "@mui/material/TablePagination";
import { alpha } from "@mui/material/styles";
import "./Collectiontable.css";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import Skeleton from "@mui/material/Skeleton";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Grid, Typography } from "@mui/material";
import Divider from "@mui/material/Divider";
import Howitworks from "./Howitworks";
import Snackbar from "@mui/material/Snackbar";
import CloseIcon from "@mui/icons-material/Close";
import Collectiondisclaimer from "./Collectiondisclaimer";

const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#ffffff",
    color: "black",
    fontWeight: 700,
    boxShadow: theme.shadows[1],
    fontSize: 13,
  },
}));

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "token_ID",
    numeric: false,
    disablePadding: false,
    label: "Token ID",
    hideSortLabel: false,
  },
  {
    id: "Status",
    numeric: false,
    disablePadding: false,
    label: "Status",
    hideSortLabel: false,
  },
  {
    id: "inscription",
    numeric: true,
    disablePadding: false,
    label: "Inscription #",
    hideSortLabel: false,
  },
  {
    id: "hashValue",
    numeric: true,
    disablePadding: false,
    label: "SHA-256 Hash",
    hideSortLabel: true,
  },
  {
    id: "image_url",
    numeric: true,
    disablePadding: false,
    label: "Image",
    hideSortLabel: true,
  },
  {
    id: "Ordinal",
    numeric: true,
    disablePadding: false,
    label: "Ordinal",
    hideSortLabel: true,
  },
  {
    id: "Ordswap",
    numeric: true,
    disablePadding: false,
    label: "Ordswap",
    hideSortLabel: true,
  },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            sx={{
              fontWeight: 700,
              fontSize: { xs: "1rem", sm: "1rem" },
              lineHeight: "1.5",
              display: {
                xs:
                  headCell.id === "Ordswap" ||
                  headCell.id === "Ordinal" ||
                  headCell.id === "image_url" ||
                  headCell.id === "hashValue"
                    ? "none"
                    : "table-cell",
                sm:
                  headCell.id === "Ordswap" ||
                  headCell.id === "Ordinal" ||
                  headCell.id === "image_url"
                    ? "none"
                    : "table-cell",
                md: headCell.id === "Ordswap" ? "none" : "table-cell",
                lg: "table-cell",
                xl: "table-cell",
              },
            }}
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.hideSortLabel ? (
              headCell.label
            ) : (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            )}
          </TableCell>
        ))}
        <TableCell
          sx={{
            display: {
              xs: "none",
              sm: "table-cell",
              md: "table-cell",
              lg: "none",
              xl: "none",
            },
          }}
          padding="checkbox"
        ></TableCell>
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
};

function EnhancedTableToolbar(props) {
  const {
    blockHeight,
    contractAddress,
    collectionName,
    loading,
    collectionSupply,
    totalInscribed,
  } = props;
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        borderRadius: "5px",
        border: "1px solid #F2B843",
        boxShadow: "0 0 5px #F2B843",
        bgcolor: (theme) => alpha(theme.palette.primary.main),
      }}
    >
      <Box
        sx={{ flex: "1 1 100%", my: "1rem", my: { xs: "0.5rem", sm: "1rem" } }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "1.5rem",
            lineHeight: "1.5",
            textAlign: "left",
          }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {loading ? (
            <Skeleton animation="wave" width="100%" height={35} />
          ) : (
            <>{collectionName}</>
          )}
        </Typography>
        <Typography
          sx={{
            fontWeight: 500,
            fontSize: "1rem",
            lineHeight: "1.2",
            textAlign: "left",
            wordBreak: "break-Word",
          }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {loading ? (
            <Skeleton animation="wave" width="100%" height={20} />
          ) : (
            <>Contract Address : {contractAddress}</>
          )}
        </Typography>
        <LightTooltip
          title="This is the latest inscription height scanned."
          followCursor
        >
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: "1rem",
              lineHeight: "1.2",
              textAlign: "left",
              py: "0.3rem",
            }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            {loading ? (
              <Skeleton animation="wave" width="100%" height={20} />
            ) : (
              <>Inscriptions Synced : {blockHeight}</>
            )}
          </Typography>
        </LightTooltip>
        <Grid container spacing={0}>
          <Grid item xs={6} sm={4} md={4} lg={3}>
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: "1rem",
                lineHeight: "1.2",
                textAlign: "left",
                py: "0.3rem",
              }}
              variant="h6"
              id="tableTitle"
              component="div"
            >
              {loading ? (
                <Skeleton animation="wave" width="100%" height={20} />
              ) : (
                <>Collection Supply : {collectionSupply}</>
              )}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={5} md={4} lg={3}>
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: "1rem",
                lineHeight: "1.2",
                textAlign: "left",
                py: "0.3rem",
              }}
              variant="h6"
              id="tableTitle"
              component="div"
            >
              {loading ? (
                <Skeleton animation="wave" width="100%" height={20} />
              ) : (
                <>Total Inscribed : {totalInscribed ? totalInscribed : 0}</>
              )}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Toolbar>
  );
}

const Row = React.forwardRef((props, ref) => {
  const { row, isOpen, onClick, searched } = props;
  const ordinalLabels = [
    "1st",
    "2nd",
    "3rd",
    "4th",
    "5th",
    "6th",
    "7th",
    "8th",
    "9th",
    "10th",
  ];

  return (
    <React.Fragment>
      <TableRow
      ref={ref}
        className={row.token_id == searched ? "unavailable-row" : "available-row"}
        sx={{
          "& > *": {
            borderBottom: "unset",
            borderTop: isOpen ? "unset" : "1px solid rgba(245, 245, 245, 0.2)",
            cursor: {
              xs: "pointer",
              sm: "pointer",
              md: "pointer",
              lg: "default",
              xl: "default",
            },
          },
        }}
        onClick={onClick}
      >
        <TableCell
          sx={{
            fontWeight: 500,
            lineHeight: "1.5",
            pr: "0",
            fontSize: { xs: "1rem", sm: "1rem" },
          }}
          align="left"
        >
          <LightTooltip title="Token ID" followCursor>
            <span>{row.token_id}</span>
          </LightTooltip>
        </TableCell>
        <TableCell
          sx={{
            fontWeight: 500,
            lineHeight: "1.5",
            pl: "1",
            fontSize: { xs: "1rem", sm: "1rem" },
          }}
          component="th"
          scope="row"
        >
          {row.ordinalmatch ? (
            <>
              <LightTooltip title="Status" followCursor>
                <span>Inscribed</span>
              </LightTooltip>
            </>
          ) : (
            <>
              <LightTooltip title="Status" followCursor>
                <span>Not Inscribed </span>
              </LightTooltip>
              <span
                sx={{ display: { xs: "none", sm: "inline-block" } }}
                className="dot"
              ></span>
            </>
          )}
        </TableCell>
        <TableCell
          sx={{
            fontWeight: 500,
            lineHeight: "1.5",
            fontSize: { xs: "1rem", sm: "1rem" },
          }}
          align="right"
        >
          <LightTooltip title="Inscription #Number" followCursor>
            <span>
              {row.ordinalmatch ? row.ordinalmatch[0].id : "Not Inscribed"}
            </span>
          </LightTooltip>
        </TableCell>

        <TableCell
          sx={{
            fontWeight: 500,
            fontSize: { xs: "1rem", sm: "1rem" },
            lineHeight: "1.5",
            display: { xs: "none", sm: "table-cell" },
          }}
          align="right"
        >
          <LightTooltip title="Image Hash" followCursor>
            <span>
              {row.hashfield.slice(0, 5)}...{row.hashfield.slice(-5)}{" "}
            </span>
          </LightTooltip>
        </TableCell>
        <TableCell
          sx={{
            fontWeight: 500,
            fontSize: "1rem",
            lineHeight: "1.5",
            display: { xs: "none", sm: "none", md: "table-cell" },
          }}
          align="right"
        >
          <LightTooltip title="View Collection Image" followCursor>
            <button
              type="button"
              onClick={() => window.open(row.image_url, "_blank")}
              style={{
                border: "none",
                background: "none",
                cursor: "pointer",
                color: "#F2B843",
                display: "flex",
                alignItems: "center",
                marginLeft: "auto",
              }}
            >
              <ImageOutlinedIcon />
            </button>
          </LightTooltip>
        </TableCell>
        <TableCell
          sx={{
            fontWeight: 500,
            fontSize: "1rem",
            lineHeight: "1.5",
            display: { xs: "none", sm: "none", md: "table-cell" },
          }}
          align="right"
        >
          {row.ordinalmatch ? (
            <LightTooltip title="View At Ordinals.com" followCursor>
              <button
                type="button"
                onClick={() => window.open(row.ordinalmatch[0].url, "_blank")}
                style={{
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  color: "#F2B843",
                  display: "flex",
                  alignItems: "center",
                  marginLeft: "auto",
                }}
              >
                <OpenInNewRoundedIcon />
              </button>
            </LightTooltip>
          ) : (
            <LightTooltip title="Not Inscribed" followCursor>
              <button
                style={{
                  border: "none",
                  background: "none",
                  cursor: "default",
                  color: "#CA1F3D",
                  display: "flex",
                  alignItems: "center",
                  marginLeft: "auto",
                }}
              >
                <OpenInNewRoundedIcon />
              </button>
            </LightTooltip>
          )}
        </TableCell>
        <TableCell
          sx={{
            fontWeight: 500,
            fontSize: "1rem",
            lineHeight: "1.5",
            display: { xs: "none", sm: "none", md: "none", lg: "table-cell" },
          }}
          align="right"
        >
          {row.ordinalmatch ? (
            <LightTooltip title="View In Ordswap" followCursor>
              <button
                type="button"
                onClick={() =>
                  window.open(
                    `https://ordswap.io/inscription/${row.ordinalmatch[0].url
                      .split("/")
                      .slice(-1)}`,
                    "_blank"
                  )
                }
                style={{
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  color: "#F2B843",
                  display: "flex",
                  alignItems: "center",
                  marginLeft: "auto",
                }}
              >
                <OpenInNewRoundedIcon />
              </button>
            </LightTooltip>
          ) : (
            <LightTooltip title="Not Inscribed" followCursor>
              <button
                style={{
                  border: "none",
                  background: "none",
                  cursor: "default",
                  color: "#CA1F3D",
                  display: "flex",
                  alignItems: "center",
                  marginLeft: "auto",
                }}
              >
                <OpenInNewRoundedIcon />
              </button>
            </LightTooltip>
          )}
        </TableCell>
        <TableCell
          sx={{
            fontWeight: 500,
            fontSize: "1rem",
            lineHeight: "1.5",
            display: {
              xs: "none",
              sm: "table-cell",
              md: "table-cell",
              lg: "none",
              xl: "none",
            },
          }}
        >
          <IconButton aria-label="expand row" size="small" onClick={onClick}>
            {isOpen ? (
              <ArrowCircleUpSharpIcon style={{ color: "#3D3EC2" }} />
            ) : (
              <ExpandCircleDownIcon style={{ color: "#3D3EC2" }} />
            )}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow
        sx={{
          borderTop:
            isOpen && row.ordinalmatch
              ? "3px solid #3D3EC2"
              : isOpen && !row.ordinalmatch
              ? "3px solid #3D3EC2"
              : "",
          borderBottom:
            isOpen && row.ordinalmatch
              ? "3px solid #3D3EC2"
              : isOpen && !row.ordinalmatch
              ? "3px solid #3D3EC2"
              : "",
          boxShadow:
            isOpen && row.ordinalmatch
              ? "0 0 5px #3D3EC2"
              : isOpen && !row.ordinalmatch
              ? "0 0 5px #3D3EC2"
              : "",
          display: {
            xs: "table-row",
            sm: "table-row",
            md: "table-row",
            lg: "none",
            xl: "none",
          },
        }}
      >
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <Box sx={{ my: 1 }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: "1rem",
                    lineHeight: "1.2",
                    textAlign: "left",
                    py: "0.3rem",
                  }}
                  variant="h6"
                  id="tableTitle"
                  component="div"
                >
                  <span style={{ color: "#F2B843" }}>
                    Token ID #{row.token_id}
                  </span>
                </Typography>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: "1rem",
                    lineHeight: "1.2",
                    textAlign: "left",
                    py: "0.3rem",
                    display: {
                      xs: "display",
                      sm: "none",
                      md: "none",
                      lg: "none",
                      xl: "none",
                    },
                  }}
                  variant="h6"
                  id="tableTitle"
                  component="div"
                >
                  <span>
                    SHA-256 Hash : {row.hashfield.slice(0, 8)}...
                    {row.hashfield.slice(-8)}{" "}
                  </span>
                </Typography>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: "1rem",
                    lineHeight: "1.2",
                    textAlign: "left",
                    wordBreak: "break-all",
                    display: {
                      xs: "display",
                      sm: "display",
                      md: "none",
                      lg: "none",
                      xl: "none",
                    },
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center" }}>
                    View Image:
                    <button
                      type="button"
                      onClick={() => window.open(row.image_url, "_blank")}
                      style={{
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        color: "#F2B843",
                        display: "flex",
                        alignItems: "center",
                        marginLeft: "1px",
                      }}
                    >
                      <ImageOutlinedIcon />
                    </button>
                  </span>
                </Typography>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: "1rem",
                    lineHeight: "1.2",
                    textAlign: "left",
                    wordBreak: "break-all",
                    display: {
                      xs: "display",
                      sm: "display",
                      md: "none",
                      lg: "none",
                      xl: "none",
                    },
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center" }}>
                    View In Ordinals.com :
                    <button
                      type="button"
                      onClick={() => window.open(row.ordinalmatch[0].url, "_blank")}
                      style={{
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        color: "#F2B843",
                        display: "flex",
                        alignItems: "center",
                        marginLeft: "1px",
                      }}
                    >
                      <OpenInNewRoundedIcon />
                    </button>
                  </span>
                </Typography>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: "1rem",
                    lineHeight: "1.2",
                    textAlign: "left",
                    wordBreak: "break-all",
                    display: {
                      xs: "display",
                      sm: "display",
                      md: "display",
                      lg: "none",
                      xl: "none",
                    },
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center" }}>
                    View In OrdSwap :
                    <button
                      type="button"
                      onClick={() =>
                        window.open(
                          `https://ordswap.io/inscription/${row.ordinalmatch[0].url
                            .split("/")
                            .slice(-1)}`,
                          "_blank"
                        )
                      }
                      style={{
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        color: "#F2B843",
                        display: "flex",
                        alignItems: "center",
                        marginLeft: "1px",
                      }}
                    >
                      <OpenInNewRoundedIcon />
                    </button>
                  </span>
                </Typography>
              </div>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
})

export default function Collectiontable() {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("token_ID");
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(100);
  const [jsonData, setJsonData] = useState([]);
  const [openRowIndex, setOpenRowIndex] = useState(-1);
  const [contractAddress, setContractAddress] = useState("");
  const [blockHeight, setBlockHeight] = useState(0);
  const [collectionName, setCollectionName] = useState("");
  const [sortedData, setSortedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [collection, setCollection] = useState("");
  const [collectionList, setCollectionList] = useState([]);
  const [token, setToken] = useState("");
  const [insId, setInsId] = useState("");
  const [searchedData, setSearchedData] = useState();
  const [collectionSupply, setCollectionSupply] = useState(0);
  const [totalInscribed, setTotalInscribed] = useState(0);
  const [open, setOpen] = React.useState(false);
  const searchedDataRowRef = useRef(null);


  useEffect(() => {
    if (searchedData && searchedDataRowRef.current) {
      searchedDataRowRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [searchedData]);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  const handleChangeInsId = (event) => {
    setInsId(event.target.value);
    setToken("");
  };

  const handleChangeToken = (event) => {
    setToken(event.target.value);
    setInsId("");
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      if (token == "") {
        handleSearchInscription();
      } else {
        handleSearch();
      }
    }
  };

  const handleButtonPress = () => {
    if (token == "") {
      handleSearchInscription();
    } else {
      handleSearch();
    }
  };

  const handleSearch = () => {
    if (openRowIndex !== -2) {
      handleRowClick(-2);
    }
    const searchData = jsonData.find(
      (obj) => obj.token_id === token.toString()
    );
    setSearchedData(searchData);
  };

  const handleSearchInscription = () => {
    if (openRowIndex !== -2) {
      handleRowClick(-2);
    }
    const searchData = jsonData.find((obj) => {
      if (obj.ordinalmatch) {
        for (let i = 0; i < obj.ordinalmatch.length; i++) {
          if (obj.ordinalmatch[i].id == insId) {
            return true;
          }
        }
      }
      return false;
    });
    setSearchedData(searchData);
    if (!searchData) {
      handleClick();
    }
  };

  const rows = Array.from({ length: rowsPerPage }, (_, index) => ({
    id: index + 1,
    name: `Row ${index + 1}`,
  }));

  const handleChangePage = (event, newPage) => {
    setSearchedData(null);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - sortedData.length) : 0;

  const handleRowClick = (index) => {
    if (openRowIndex === index) {
      setOpenRowIndex(-1);
    } else {
      setOpenRowIndex(index);
    }
  };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_DATALIST_URL}`)
      .then((response) => response.json())
      .then((data) => {
        const formattedData = data.dataFiles.map((filename) => {
          return {
            label: filename.replace(/_/g, " ").replace(".json", ""),
            value: filename,
          };
        });
        setCollectionList(formattedData);
        
        setCollection(formattedData[0]);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    setLoading(true);
    if (collection && collection.value) {
    fetch(`${process.env.REACT_APP_DATA_URL}${collection.value}`)
      .then((response) => response.json())
      .then((data) => {
        setJsonData(data.tokens);
        setSortedData(data.tokens);
        setLoading(false);
        setLoading(false);
        setCollectionName(data.collectionName);
        setContractAddress(data.contractAddress);
        setCollectionSupply(data.collectionSupply);
        setTotalInscribed(data.totalInscribed);
      })
      .catch((error) => console.log(error));
    }
  }, [collection]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_HEIGHT_URL}`)
      .then((response) => response.json())
      .then((data) => {
        setBlockHeight(data.InscriptionsSynced);
      })
      .catch((error) => console.log(error));
  }, []);

  const handleCollectionChange = (event, newValue) => {
    if (newValue != null) {
      setCollection(newValue);
      setSearchedData(null);
    }
  };

  const handleRequestSort = (event, property) => {
    setSearchedData(null);
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);

    if (property === "token_ID") {
      const sortData = jsonData.sort((a, b) => {
        if (isAsc) {
          return a[property] > b[property] ? 1 : -1;
        } else {
          return b[property] > a[property] ? 1 : -1;
        }
      });

      setSortedData(sortData);
    }
    else if (property === "inscription") {
      const sortData = jsonData
        .filter((obj) => obj.hasOwnProperty("ordinalmatch"))
        .sort((a, b) =>
          isAsc
            ? a.ordinalmatch[0].id - b.ordinalmatch[0].id
            : b.ordinalmatch[0].id - a.ordinalmatch[0].id
        )
        .concat(jsonData.filter((obj) => !obj.hasOwnProperty("ordinalmatch")));

      setSortedData(sortData);
    } else if (property === "Status") {
      const sortData = [...jsonData].sort((a, b) => {
        const aHasOrdinalmatch = a.hasOwnProperty("ordinalmatch");
        const bHasOrdinalmatch = b.hasOwnProperty("ordinalmatch");

        if (aHasOrdinalmatch && !bHasOrdinalmatch) {
          return isAsc ? -1 : 1;
        } else if (!aHasOrdinalmatch && bHasOrdinalmatch) {
          return isAsc ? 1 : -1;
        } else {
          const indexA = jsonData.indexOf(a);
          const indexB = jsonData.indexOf(b);
          return isAsc ? indexA - indexB : indexB - indexA;
        }
      });
      setSortedData(sortData);
    }
  };

  return (
    <div className="App-header">
      <>
        <Collectiondisclaimer />
        <Box sx={{ width: "90%", maxWidth: "1080px", mb: "2rem" }}>
          <div style={{ alignContent: "flex-start", display: "flex" }}>
            <img
              className="logo"
              src="/ORDFIND.png"
              alt="Logo"
              style={{ float: "left", }}
            />
          </div>
          <div style={{ position: "relative", pt: "5px" }}>
            <Snackbar
              open={open}
              autoHideDuration={4000}
              onClose={handleClose}
              message="Not Found In Collection."
              action={action}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
              sx={{
                "& .MuiSnackbarContent-root": {
                  backgroundColor: "#CA1F3D",
                  color: "#ffffff",
                },
              }}
            />
          </div>

          <Box sx={{ flex: "1 1 100%", mt: "3rem" }}>
            <Typography
              sx={{
                fontSize: {
                  xs: "1.5rem",
                  sm: "1.8rem",
                  md: "2.1rem",
                  lg: "2.3rem",
                  xl: "2.3rem",
                },
              }}
            >
              Find Original Ordinal Inscriptions of Eth NFT Collections
              
            </Typography>

            <p style={{ fontSize: "1.5rem" }}></p>
          </Box>
          <Howitworks />
          <div
            style={{
              marginBottom: "1.2rem",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Autocomplete
              sx={{
                "& .MuiAutocomplete-endAdornment .MuiSvgIcon-root": {
                  color: "#F2B843",
                },
                "& .MuiAutocomplete-clearIndicator .MuiSvgIcon-root": {
                  color: "#F2B843",
                },
                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#3D3EC2",
                  boxShadow: "0 0 10px 0 #3D3EC2",
                },
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: "#3D3EC2",
                    boxShadow: "0 0 5px 0 3D3EC2",
                  },
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input":
                  {
                    color: "3D3EC2",
                  },
                "& .MuiInputLabel-outlined.Mui-focused": {
                  color: "#BCBFC3",
                },
                "& .MuiOutlinedInput-input": {
                  color: "#BCBFC3",
                },
                "& label.Mui-focused": {
                  color: "3D3EC2",
                },

                "& .MuiAutocomplete-option:hover": {
                  backgroundColor: "#1e1e1e",
                  transition: "background-color 0.3s ease",
                  boxShadow: "0 0 5px 0 3D3EC2",
                },
                "& .MuiAutocomplete-option:hover *": {
                  color: "3D3EC2",
                  transition: "color 0.3s ease",
                },
              }}
              value={collection}
              onChange={handleCollectionChange}
              options={collectionList}
              getOptionLabel={(option) => option?.label || ""}
              PaperComponent={({ children }) => (
                <Paper
                  sx={{
                    backgroundColor: "#1D1E1F",
                    transition: "background-color 0.3s ease",
                    "&:hover": {
                      backgroundColor: "#181919",
                      transition: "background-color 0.3s ease",
                    },
                  }}
                >
                  {children}
                </Paper>
              )}
              style={{ width: 300, marginRight: "1rem" }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Collection"
                  variant="outlined"
                  InputLabelProps={{
                    sx: { color: "#F2B843" },
                  }}
                />
              )}
            />
          </div>
          <div
            style={{
              marginBottom: "2rem",
              display: "flex",
              alignItems: "center",
            }}
          >
            <TextField
              onKeyPress={handleKeyPress}
              sx={{
                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#F2B843",
                },
                "& .MuiAutocomplete-endAdornment .MuiSvgIcon-root": {
                  color: "#F2B843",
                },
                "& .MuiAutocomplete-clearIndicator .MuiSvgIcon-root": {
                  color: "#F2B843",
                },
                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#F2B843",
                  boxShadow: "0 0 5px 0 #F2B843",
                },
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: "#3D3EC2",
                    boxShadow: "0 0 5px 0 #3D3EC2",
                  },
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input":
                  {
                    color: "#BCBFC3",
                  },
                "& .MuiInputLabel-outlined.Mui-focused": {
                  color: "#BCBFC3",
                },
                "& .MuiOutlinedInput-input": {
                  color: "#BCBFC3",
                },
                "& label.Mui-focused": {
                  color: "#3D3EC2",
                },

                "& .MuiAutocomplete-paper li.MuiAutocomplete-option.Mui-focusVisible, & .MuiAutocomplete-paper li.MuiAutocomplete-option:hover":
                  {
                    backgroundColor: "#F2B843",
                  },
              }}
              label="Search Token ID"
              value={token}
              onChange={handleChangeToken}
              style={{ marginRight: "1rem" }}
            />
            <TextField
              onKeyPress={handleKeyPress}
              sx={{
                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#F2B843",
                },
                "& .MuiAutocomplete-endAdornment .MuiSvgIcon-root": {
                  color: "#F2B843",
                },
                "& .MuiAutocomplete-clearIndicator .MuiSvgIcon-root": {
                  color: "#F2B843",
                },
                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#F2B843",
                  boxShadow: "0 0 5px 0 #F2B843",
                },
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: "#3D3EC2",
                    boxShadow: "0 0 5px 0 #3D3EC2",
                  },
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input":
                  {
                    color: "#BCBFC3",
                  },
                "& .MuiInputLabel-outlined.Mui-focused": {
                  color: "#BCBFC3",
                },
                "& .MuiOutlinedInput-input": {
                  color: "#BCBFC3",
                },
                "& label.Mui-focused": {
                  color: "#3D3EC2",
                },

                "& .MuiAutocomplete-paper li.MuiAutocomplete-option.Mui-focusVisible, & .MuiAutocomplete-paper li.MuiAutocomplete-option:hover":
                  {
                    backgroundColor: "#F2B843",
                  },
              }}
              label="Search Inscription #Number"
              value={insId}
              onChange={handleChangeInsId}
              style={{ marginRight: "1rem" }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleButtonPress}
              sx={{
                backgroundColor: "#3D3EC2",
                color: "#ffffff",
                paddingTop: "13px",
                paddingBottom: "13px",
                "&:hover": {
                  backgroundColor: "#3D00C2",
                  color: "#BCBFC3",
                },
              }}
            >
              Search
            </Button>
          </div>

          <Paper ref={searchedDataRowRef}
            sx={{
              width: "100%",
              mb: 2,
              borderRadius: "10px",
            }}
          >
            <EnhancedTableToolbar
              loading={loading}
              blockHeight={blockHeight}
              collectionName={collectionName}
              contractAddress={contractAddress}
              collectionSupply={collectionSupply}
              totalInscribed={totalInscribed}
            />
            <TableContainer component={Paper}>
              <Table
                sx={{
                  [`& .${tableCellClasses.root}`]: {
                    borderBottom: "none",
                  },
                }}
                aria-label="collapsible table"
                size={dense ? "small" : "medium"}
              >
                <EnhancedTableHead
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                />

                <TableBody>
                  {loading ? (
                    rows.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>
                          <Skeleton animation="wave" height={35} width="100%" />
                        </TableCell>
                        <TableCell>
                          <Skeleton height={35} width="100%" />
                        </TableCell>
                        <TableCell>
                          <Skeleton height={35} width="100%" />
                        </TableCell>
                        <TableCell>
                          <Skeleton
                            height={35}
                            sx={{
                              display: { xs: "none", sm: "flex", md: "flex" },
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Skeleton
                            height={35}
                            sx={{
                              display: { xs: "none", sm: "none", md: "flex" },
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Skeleton
                            height={35}
                            sx={{
                              display: { xs: "none", sm: "none", md: "flex" },
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Skeleton
                            height={35}
                            sx={{
                              display: {
                                xs: "none",
                                sm: "none",
                                md: "none",
                                lg: "flex",
                              },
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <>
                      {searchedData && (
                        <Row
                        
                          key={searchedData.token_id}
                          searched = {searchedData.token_id}
                          row={searchedData}
                          isOpen={openRowIndex === -2}
                          onClick={() => handleRowClick(-2)}
                        />
                      )}
                      {stableSort(sortedData, getComparator(order, orderBy))
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((data, index) => {
                          return (
                            <Row
                              key={data.token_id}
                              row={data}
                              isOpen={openRowIndex === index}
                              onClick={() => handleRowClick(index)}
                            />
                          );
                        })}
                      {emptyRows > 0 && (
                        <TableRow
                          style={{
                            height: (dense ? 33 : 53) * emptyRows,
                          }}
                        >
                          <TableCell colSpan={6} />
                        </TableRow>
                      )}
                    </>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[100, 150, 200]}
              component="div"
              count={sortedData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Box>
      </>
    </div>
  );
}
