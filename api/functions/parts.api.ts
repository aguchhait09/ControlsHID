import { InventoryInterface } from "@/interface/partsInventory.interface";
import axiosInstance from "../axiosInstance";
import { endpoints } from "../endpoints";
import { PartsMatrixInterface } from "@/interface/partsMatrix.interface";

export const inventoryManagerApi = async () => {
  const res = await axiosInstance.get<InventoryInterface>(endpoints.parts.inventory);
  return res?.data?.data;
};

export const partsMatrixApi = async ()=>{
  const res = await axiosInstance.get<PartsMatrixInterface>(
    endpoints.parts.partsMatrix
  )
  return res?.data?.data
}
