import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface DataStore {
  id: string;
  Name: string;
  DiscountType: string;
  DiscountValue: number;
  DeadlineInDays: number;
  Note: string;
  cpf: string;
  VoucherUserHistory: any;
  AxiesId: any;
  idConfirmation: string;
  idSelected: any;
  idEditVoucher: string;
  idProduct: string;
  quantityBox:string;
  dataFilter: string;
  setDataFilter: (dataFilter: string) => void;
  setQuantityBox: (quantityBox: string) => void;
  voucherRenovavel: boolean;
  setVoucherRenovavel: (voucherRenovavel: boolean) => void;
  dataCreatedVoucher: string;
  setDataCreatedVoucher: (dataCreatedVoucher: string) => void;
  setIdProduct: (idProduct: string) => void;
  promotionName: string;
  setPromotionName: (promotionName: string) => void;
  porcentPromotion: string
  setPorcentPromotion: (porcentPromotion: string) => void;
  setCpf: (cpf: string) => void;
  setIdEditVoucher: (idEditVoucher: string) => void;
  setIdSelected: (idSelected: any) => void;
  setConfirmation: (confirmation: string) => void;
  setAxiesId: (AxiesId: any) => void;
  setVoucherUserHistory: (VoucherUserHistory: any) => void;
  setVoucherData: (voucherData: any) => void;
  surveyData: any;
  setSurveyData: (surveyData: any) => void;
  idVoucher: string;
  setIdVoucher: (idVoucher: string) => void;
  idSchedulePurchase: string;
  setIdSchedulePurchase: (idSchedulePurchase: string) => void;
  idSchedule: string;
  setIdSchedule: (idSchedule: string) => void;
  Idconfirmation: boolean;
  setIdConfirmation: (confirmation: boolean) => void;
  Idcancel: boolean;
  setIdCancel: (cancel: boolean) => void;
  refresh: boolean;
  setRefresh: (refresh: boolean) => void;
}

const useDataStorage = create(
  persist<DataStore>(
    (set) => ({
      dataFilter: "",
      setDataFilter: (dataFilter) => set({ dataFilter }),
      quantityBox: "",
      setQuantityBox: (quantityBox) => set({ quantityBox }),
      voucherRenovavel: false,
      setVoucherRenovavel: (voucherRenovavel) =>
        set({ voucherRenovavel }),
      dataCreatedVoucher: "",
      setDataCreatedVoucher: (dataCreatedVoucher) =>
        set({ dataCreatedVoucher }),
      idProduct: "",
      setIdProduct: (idProduct) => set({ idProduct }),
      promotionName: "",
      setPromotionName: (promotionName) => set({ promotionName }),
      porcentPromotion: "",
      setPorcentPromotion: (porcentPromotion) => set({ porcentPromotion }),
      cpf: "",
      setCpf: (cpf) => set({ cpf }),
      idEditVoucher: "",
      setIdEditVoucher: (idEditVoucher) => set({ idEditVoucher }),
      idSelected: [],
      setIdSelected: (idSelected) => set({ idSelected }),
      idConfirmation: "",
      setConfirmation: (confirmation) => set({ idConfirmation: confirmation }),
      AxiesId: [],
      setAxiesId: (AxiesId) => set({ AxiesId }),
      idSchedulePurchase: "",
      setIdSchedulePurchase: (idSchedulePurchase) =>
        set({ idSchedulePurchase }),
      Idconfirmation: false,
      setIdConfirmation: (confirmation) =>
        set({ Idconfirmation: confirmation }),
      Idcancel: false,
      setIdCancel: (cancel) => set({ Idcancel: cancel }),
      refresh: false,
      setRefresh: (refresh) => set({ refresh }),
      idSchedule: "",
      setIdSchedule: (idSchedule) => set({ idSchedule }),
      idVoucher: "",
      setIdVoucher: (idVoucher) => set({ idVoucher }),
      VoucherUserHistory: [],
      setVoucherUserHistory: (VoucherUserHistory) =>
        set({ VoucherUserHistory }),
      id: "",
      Name: "",
      DiscountType: "",
      DiscountValue: 0,
      DeadlineInDays: 0,
      Note: "",
      surveyData: [],
      setSurveyData: (surveyData) => set({ surveyData }),
      setVoucherData: (voucherData) =>
        set({
          id: voucherData.id,
          Name: voucherData.Name,
          DiscountType: voucherData.DiscountType,
          DiscountValue: voucherData.DiscountValue,
          DeadlineInDays: voucherData.DeadlineInDays,
          Note: voucherData.Note,
        }),
    }),
    {
      name: "data-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useDataStorage;
