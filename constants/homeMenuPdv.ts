import { RiHome6Line } from "react-icons/ri";
import { RxCalendar } from "react-icons/rx";
import { GiTakeMyMoney } from "react-icons/gi";
import { FaShoppingCart, FaUserFriends } from "react-icons/fa";
import { CiUser } from "react-icons/ci";

export const homeMenuPdv = [
  {
    route: "home",
    icon: RiHome6Line,
    path: "/home2.png",
    text: "Início",
    active: true,
  },
  {
    route: "validate-voucher",
    icon: FaUserFriends,
    path: "/cardDashboard.png",
    text: "Validar Vouchers",
    active: false,
  },
  {
    route: "manage-sales",
    icon: FaShoppingCart,
    path: "/cart.png",
    text: "Gerenciar vendas",
    active: false,
  },

  // {
  //   route: "reimbursement",
  //   icon: GiTakeMyMoney,
  //   path: "/reimbursement.png",
  //   text: "Reembolso",
  //   active: false,
  // },
    {
    route: "profile",
    icon: CiUser,
    path: "/about.png",
    text: "Editar cadastro",
    active: false,
  },
];
