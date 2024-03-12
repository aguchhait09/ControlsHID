import { inventoryManagerApi } from "@/api/functions/parts.api";
import DataGridTable from "@/components/Table/DataGridTable";
import DashboardLayout from "@/layout/dashboard/DashboardLayout";
import {
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  styled
} from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Inventory } from "@/interface/partsInventory.interface";
import CustomInput from "@/ui/Inputs/CustomInput";
import UpgradeIcon from "@mui/icons-material/Upgrade";
import { useDebounce } from "@/hooks/utils/useDebounce";

export const StyledContainer = styled(Container)`
  margin: 5px;
`;

export const StyledSearchContainer = styled(Container)`
  margin: 5px;
`;

interface menuButtonType {
  title1?: string;
  title2?: string;
  handleClick1?: any;
  handleClick2?: any;
}

const ITEM_HEIGHT = 28;
const MenuButton = ({
  title1,
  title2,
  handleClick1,
  handleClick2
}: menuButtonType) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const handleOpen = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  }, []);
  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  return (
    <>
      <IconButton onClick={handleOpen}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: "20ch",
            borderRadius: "15px"
          }
        }}
        elevation={3}
      >
        <MenuItem
          onClick={() => {
            handleClick1();
            handleClose();
          }}
        >
          <EditIcon fontSize="small" sx={{ color: "#505861", mr: 1 }} />
          <Typography color="#505861">{title1}</Typography>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClick2();
            handleClose();
          }}
        >
          <DeleteIcon fontSize="small" sx={{ color: "#fc8b72", mr: 1 }} />
          <Typography color="#fc8b72">{title2}</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

const inventoryManager = () => {
  const { data: inventoryDta, isPending: loading } = useQuery({
    queryKey: ["inventory"],
    queryFn: inventoryManagerApi
  });

  const [opened, setOpened] = useState(false);
  const handleClickOpen = () => {
    setOpened(true);
  };
  const handleClosed = () => {
    setOpened(false);
  };

  const [searchInput, setSearchInput] = useState("");
  const handleSubmit = (e: any) => {
    e.preventDefault();
    setSearchInput(e.target.value);
  };
  const handleChange = (e: any) => {
    setSearchInput(e.target.value);
  };
  const debouncedSearch = useDebounce(searchInput, 1000);
  console.log("searchInput", debouncedSearch);

  const inventoryData = inventoryDta?.filter((dta) => {
    const searchItemLower = debouncedSearch?.toLowerCase();
    const descriptionLower = dta.description.toLowerCase();

    return (
        descriptionLower.includes(searchItemLower) 
    );
  });

  const columns: GridColDef[] = [
    {
      field: "part_no",
      headerName: "Part No.",
      width: 250,
      editable: true,
      renderCell: (params) => `#${params.row.part_no}`
    },
    {
      field: "description",
      headerName: "Description",
      width: 250,
      editable: true
    },
    {
      field: "quantity",
      headerName: "Quantity",
      type: "number",
      width: 200,
      editable: true
    },
    {
      field: "action",
      headerName: "Action",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 250,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <MenuButton
          title1="Edit"
          title2="Delete"
          handleClick1={handleClickOpen}
        />
      )
    }
  ];

  return (
    <DashboardLayout>
      <StyledSearchContainer>
        <form style={{ float: "left" }} onSubmit={handleSubmit}>
          <CustomInput
            sx={{ background: "white" }}
            placeholder="Search Something"
            name="searchInput"
            value={searchInput}
            onChange={handleChange}
          />
          <Button
            variant="contained"
            color="success"
            sx={{ m: 0.5, p: 1.5 }}
            type="submit"
          >
            Search
          </Button>
        </form>
        <Button
          variant="contained"
          color="success"
          sx={{ m: 0.5, p: 1.5, float: "right" }}
        >
          <UpgradeIcon /> Update
        </Button>
      </StyledSearchContainer>
      <StyledContainer>
        <DataGridTable
          columns={columns}
          rows={(inventoryData as Inventory[]) ?? ""}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5
              }
            }
          }}
          pageSizeOptions={[5, 10, 15]}
          loading={loading}
        />
      </StyledContainer>
    </DashboardLayout>
  );
};

export default inventoryManager;
