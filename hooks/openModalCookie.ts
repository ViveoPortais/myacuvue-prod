import { create } from "zustand";

interface TalkModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const openModalCookie = create<TalkModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default openModalCookie;
