import { partsMatrixApi } from "@/api/functions/parts.api";
import DashboardLayout from "@/layout/dashboard/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { StyledContainer } from "./inventory-manager";
import DataGridTable from "@/components/Table/DataGridTable";
import { IconButton, Menu, MenuItem, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useCallback, useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { PartsMatrix } from "@/interface/partsMatrix.interface";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { useRouter } from "next/router";
import Link from "next/link";

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
          <DeleteIcon fontSize="small" sx={{ color: "#505861", mr: 1 }} />
          <Typography color="#505861">{title2}</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

const partsMatrix = () => {
  const router = useRouter();
  const { data: partsMatrixData, isPending: loading } = useQuery({
    queryKey: ["partsM"],
    queryFn: partsMatrixApi
  });
  console.log("dta", partsMatrixData);

  const [opened, setOpened] = useState(false);
  const handleClickOpen = () => {
    setOpened(true);
  };

  const columns: GridColDef[] = [
    {
      field: "part_no",
      headerName: "Part No.",
      width: 150,
      editable: true
    },
    {
      field: "description",
      headerName: "Description",
      width: 150,
      editable: true
    },
    {
      field: "manufacturer",
      headerName: "Manufacturer Name",
      width: 150,
      editable: true
    },
    {
      field: "price",
      headerName: "Price ($)",
      width: 150,
      editable: true
    },
    {
      field: "part_type",
      headerName: "Part Type",
      width: 150,
      editable: true
    },
    {
      field: "document_full_path",
      headerName: "Doc File",
      sortable: false,
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <>
          <Link href={params.row.document_full_path}>
            <PictureAsPdfIcon color="success" />
          </Link>
        </>
      )
    },
    {
      field: "action",
      headerName: "Action",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 150,
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
      <StyledContainer>
        <DataGridTable
          columns={columns}
          rows={(partsMatrixData as PartsMatrix[]) ?? ""}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5
              }
            }
          }}
          pageSizeOptions={[5]}
        />
      </StyledContainer>
    </DashboardLayout>
  );
};

export default partsMatrix;
