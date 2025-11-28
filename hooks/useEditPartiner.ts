import { create } from "zustand";

interface EditPartinerStore {
  isOpen: boolean;
  isOpenCancel: boolean;
  onOpen: () => void;
  onClose: () => void;
  onOpenCancel: () => void;
  onCloseCancel: () => void;
}

const useEditPartiner = create<EditPartinerStore>((set) => ({
  isOpen: false,
  isOpenCancel: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  onOpenCancel: () => set({ isOpenCancel: true }),
  onCloseCancel: () => set({ isOpenCancel: false }),
}));

export default useEditPartiner;
