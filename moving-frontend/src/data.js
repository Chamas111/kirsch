import home from "../src/components/navbar/fotos/home.svg";
import profile from "../src/components/navbar/fotos/392531_account_friend_human_man_member_icon.svg";
import Kalendar from "../src/components/navbar/fotos/5443043_christmas_date_decoration_holiday_ornament_icon.svg";
import hvz from "../src/components/navbar/fotos/4168540_cancel_close_delete_exit_remove_icon.svg";
import lagerung from "../src/components/navbar/fotos/3129766_building_hotel_icon.svg";
import rechnung from "../src/components/navbar/fotos/9876789_receipt_payment_check_invoice_finance_icon.svg";
import ausgaben from "../src/components/navbar/fotos/12568627_cost_accounting_calculator_financial_accountant_icon.svg";
import kva from "../src/components/navbar/fotos/9073291_cost_estimate_icon.svg";
export const menu = [
  {
    id: 1,
    title: "",
    listItems: [
      { id: 1, title: "Homepage", url: "/", icon: home },
      { id: 2, title: "Calendar", url: "/calendar", icon: Kalendar },
      { id: 3, title: "Halteverbotszonen", url: "/hvz", icon: hvz },
      { id: 4, title: "Lagerung", url: "/lagerung", icon: lagerung },
      {
        id: 5,
        title: "Rechnungen",
        url: "/rechnungen",
        icon: rechnung,
        subItems: [
          {
            id: 1,
            title: "Lager Rechnungen",
            url: "/rechnungen/lager",
            icon: rechnung,
          },
        ],
      },
      { id: 6, title: "Ausgaben", url: "/ausgaben", icon: ausgaben },
    ],
  },
];
