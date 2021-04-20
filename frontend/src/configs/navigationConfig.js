import React from "react"
import * as Icon from "react-feather"
const navigationConfig = [
  
  {
    id: "123456789",
    title: "Menu Levels",
    icon: <Icon.Menu size={20} />,
    type: "collapse",
    // collapsed : true,
    navLink: "/dashboard/Analytics",
    children: [
      {
        id: "123456789-1",
        title: "Second Level",
        icon: <Icon.Circle size={12} />,
        type: "item",
        navLink: "/dashboard/Analytics"
      },
      {
        id: "123456789-2",
        title: "Second Level",
        icon: <Icon.Circle size={12} />,
        type: "collapse",
        navLink: "",
        children: [
          {
            id: "123456789-2-1",
            title: "Third Level",
            icon: <Icon.Circle size={12} />,
            type: "item",
            navLink: "/Players/playerslimits"
          },
          {
            id: "123456789-2-2",
            title: "Third Level",
            icon: <Icon.Circle size={12} />,
            type: "item",
            navLink: "/Players/DepositHitory"
          }
        ]
      },
      {
        id: "123456789-3",
        title: "Second Level",
        icon: <Icon.Circle size={12} />,
        type: "collapse",
        navLink: "",
        children: [
          {
            id: "123456789-3-1",
            title: "Third Level",
            icon: <Icon.Circle size={12} />,
            type: "item",
            navLink: "/Players/WithdrawHistory"
          },
          {
            id: "123456789-3-2",
            title: "Third Level",
            icon: <Icon.Circle size={12} />,
            type: "item",
            navLink: "/Players/RequestPayout"
          }
        ]
      }
    ]
  },
  {
    id: "123456790",
    title: "Disabled Menu",
    icon: <Icon.EyeOff size={20} />,
    type: "item",
    navLink: "/Players/players",
  },
 
 
]

export default navigationConfig
