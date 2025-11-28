import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface LoginStore {
  isLogged: boolean;
  email: string;
  role: string;
  name?: string;
  token: string;
  userName?: string;
  loginNewPassword?: any;
  firstLogin?: boolean;
  dayJs?: any;
  id?: string;
  idSheduling?: string;
  idShedulingCalendar?: string;
  emailRegister?: string;
  cpfRegister?: string;
  mobilePhoneRegister?: string;
  setMobilePhoneRegister: (mobilePhoneRegister: string) => void;
  setEmailRegister: (emailRegister: string) => void;
  setCpfRegister: (cpfRegister: string) => void;
  setIdShedulingCalendar: (idShedulingCalendar: string) => void;
  setIdSheduling: (idSheduling: string) => void;
  setId: (id: string) => void;
  setDayJs: (dayJs: any) => void;
  setUserName: (userName: string) => void;
  setFirstLogin: (firstLogin: boolean) => void;
  setLoginNewPassword: (loginNewPassword: any) => void;
  userDataPatient?: any;
  setDataPatient: (userDataPatient: any) => void;
  userDataAdmin?: any;
  setDataAdmin: (userDataAdmin: any) => void;
  userData?: any;
  setUserData: (userData: any) => void;
  setRole: (role: string) => void;
  setName: (name: string) => void;
  onLogin: () => void;
  onLogout: () => void;
  setToken: (token: string) => void;
}

const useLogin = create(
  persist<LoginStore>(
    (set) => ({
      token: "",
      isLogged: false,
      email: "",
      role: "",
      name: "",
      userName: "",
      firstLogin: false,
      dayJs: "",
      id: "",
      idShedulingCalendar: "",
      idSheduling: "",
      emailRegister: "",
      cpfRegister: "",
      mobilePhoneRegister: "",
      setMobilePhoneRegister: (mobilePhoneRegister) =>
        set({ mobilePhoneRegister: mobilePhoneRegister }),
      setCpfRegister: (cpfRegister) => set({ cpfRegister: cpfRegister }),
      setEmailRegister: (emailRegister) =>
        set({ emailRegister: emailRegister }),
      setIdSheduling: (idSheduling) => set({ idSheduling: idSheduling }),
      setIdShedulingCalendar: (idShedulingCalendar) =>
        set({ idShedulingCalendar: idShedulingCalendar }),
      setId: (id) => set({ id: id }),
      setDayJs: (dayJs) => set({ dayJs: dayJs }),
      setFirstLogin: (firstLogin) => set({ firstLogin: firstLogin }),
      loginNewPassword: [],
      setLoginNewPassword: (loginNewPassword) =>
        set({ loginNewPassword: loginNewPassword }),
      userDataPatient: [],
      setDataPatient: (userDataPatient) =>
        set({ userDataPatient: userDataPatient }),
      userDataAdmin: [],
      setDataAdmin: (userDataAdmin) => set({ userDataAdmin: userDataAdmin }),
      userData: [],
      setUserData: (userData) => set({ userData: userData }),
      setName: (name) => set({ name: name }),
      setUserName: (userName) => set({ userName: userName }),
      setRole: (role) => set({ role: role }),
      onLogin: () => set({ isLogged: true }),
      onLogout: () =>
        set({
          isLogged: false,
          token: "",
          name: "",
          email: "",
          role: "",
          loginNewPassword: [],
          userDataPatient: [],
          userDataAdmin: [],
          userData: [],
          userName: "",
          id: "",
        }),

      setToken: (token) => set({ token: token }),
    }),
    {
      name: "login-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useLogin;
