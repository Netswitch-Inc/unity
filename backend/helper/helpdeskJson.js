const requestSummary = {
  response_status: [
    {
      status_code: 2000,
      status: "success",
    },
  ],
  list_info: {
    has_more_rows: false,
    start_index: 1,
    fields_required: ["is_overdue", "completed_time"],
    search_criteria: [
      {
        condition: "gte",
        field: "created_time",
        value: "1734892200000",
      },
      {
        condition: "lte",
        field: "created_time",
        logical_operator: "and",
        value: "1735496999999",
      },
    ],
    row_count: 8,
  },
  requests: [
    {
      is_overdue: false,
      completed_time: null,
      id: "7569",
    },
    {
      is_overdue: false,
      completed_time: {
        display_value: "29/12/2024 07:01 AM",
        value: "1735484474210",
      },
      id: "7568",
    },
    {
      is_overdue: false,
      completed_time: {
        display_value: "27/12/2024 03:19 PM",
        value: "1735341572324",
      },
      id: "7562",
    },
    {
      is_overdue: false,
      completed_time: {
        display_value: "27/12/2024 07:46 AM",
        value: "1735314418497",
      },
      id: "7555",
    },
    {
      is_overdue: false,
      completed_time: null,
      id: "7551",
    },
    {
      is_overdue: false,
      completed_time: null,
      id: "7550",
    },
    {
      is_overdue: false,
      completed_time: {
        display_value: "24/12/2024 05:08 AM",
        value: "1735045696433",
      },
      id: "7532",
    },
    {
      is_overdue: false,
      completed_time: {
        display_value: "27/12/2024 05:51 AM",
        value: "1735307509571",
      },
      id: "7530",
    },
  ],
};

const requestReceived = {
  response_status: [
    {
      status_code: 2000,
      status: "success",
    },
  ],
  list_info: {
    has_more_rows: false,
    start_index: 1,
    fields_required: [
      "sla",
      "created_time",
      "sla_violated_technician",
      "sla_violated_group",
    ],
    search_criteria: [
      {
        condition: "gte",
        field: "created_time",
        value: "1733824731868",
      },
    ],
    row_count: 25,
  },
  requests: [
    {
      created_time: {
        display_value: "29/12/2024 12:16 PM",
        value: "1735503416684",
      },
      sla_violated_technician: null,
      sla: null,
      sla_violated_group: null,
      id: "7571",
    },
    {
      created_time: {
        display_value: "29/12/2024 12:16 PM",
        value: "1735503415683",
      },
      sla_violated_technician: null,
      sla: null,
      sla_violated_group: null,
      id: "7570",
    },
    {
      created_time: {
        display_value: "29/12/2024 08:27 AM",
        value: "1735489666599",
      },
      sla_violated_technician: null,
      sla: null,
      sla_violated_group: null,
      id: "7569",
    },
    {
      created_time: {
        display_value: "29/12/2024 07:01 AM",
        value: "1735484474006",
      },
      sla_violated_technician: null,
      sla: null,
      sla_violated_group: null,
      id: "7568",
    },
    {
      created_time: {
        display_value: "27/12/2024 01:31 PM",
        value: "1735335072406",
      },
      sla_violated_technician: null,
      sla: null,
      sla_violated_group: null,
      id: "7562",
    },
    {
      created_time: {
        display_value: "27/12/2024 07:46 AM",
        value: "1735314418163",
      },
      sla_violated_technician: null,
      sla: null,
      sla_violated_group: null,
      id: "7555",
    },
    {
      created_time: {
        display_value: "26/12/2024 03:34 PM",
        value: "1735256044402",
      },
      sla_violated_technician: null,
      sla: null,
      sla_violated_group: null,
      id: "7551",
    },
    {
      created_time: {
        display_value: "26/12/2024 03:34 PM",
        value: "1735256043593",
      },
      sla_violated_technician: null,
      sla: null,
      sla_violated_group: null,
      id: "7550",
    },
    {
      created_time: {
        display_value: "24/12/2024 02:10 AM",
        value: "1735035030178",
      },
      sla_violated_technician: null,
      sla: null,
      sla_violated_group: null,
      id: "7532",
    },
    {
      created_time: {
        display_value: "23/12/2024 05:01 PM",
        value: "1735002083900",
      },
      sla_violated_technician: null,
      sla: null,
      sla_violated_group: null,
      id: "7530",
    },
    {
      created_time: {
        display_value: "22/12/2024 12:10 AM",
        value: "1734855028635",
      },
      sla_violated_technician: null,
      sla: null,
      sla_violated_group: null,
      id: "7518",
    },
    {
      created_time: {
        display_value: "21/12/2024 08:15 PM",
        value: "1734840918098",
      },
      sla_violated_technician: null,
      sla: null,
      sla_violated_group: null,
      id: "7517",
    },
    {
      created_time: {
        display_value: "21/12/2024 12:01 AM",
        value: "1734768087243",
      },
      sla_violated_technician: null,
      sla: null,
      sla_violated_group: null,
      id: "7512",
    },
    {
      created_time: {
        display_value: "20/12/2024 10:18 AM",
        value: "1734718714753",
      },
      sla_violated_technician: null,
      sla: null,
      sla_violated_group: null,
      id: "7503",
    },
    {
      created_time: {
        display_value: "20/12/2024 09:24 AM",
        value: "1734715451455",
      },
      sla_violated_technician: null,
      sla: null,
      sla_violated_group: null,
      id: "7499",
    },
    {
      created_time: {
        display_value: "19/12/2024 03:24 PM",
        value: "1734650641781",
      },
      sla_violated_technician: null,
      sla: null,
      sla_violated_group: null,
      id: "7497",
    },
    {
      created_time: {
        display_value: "18/12/2024 05:26 AM",
        value: "1734528370271",
      },
      sla_violated_technician: null,
      sla: null,
      sla_violated_group: null,
      id: "7480",
    },
    {
      created_time: {
        display_value: "18/12/2024 05:23 AM",
        value: "1734528229189",
      },
      sla_violated_technician: null,
      sla: null,
      sla_violated_group: null,
      id: "7479",
    },
    {
      created_time: {
        display_value: "18/12/2024 05:10 AM",
        value: "1734527416672",
      },
      sla_violated_technician: null,
      sla: null,
      sla_violated_group: null,
      id: "7478",
    },
    {
      created_time: {
        display_value: "18/12/2024 05:04 AM",
        value: "1734527072086",
      },
      sla_violated_technician: null,
      sla: null,
      sla_violated_group: null,
      id: "7477",
    },
    {
      created_time: {
        display_value: "18/12/2024 04:56 AM",
        value: "1734526570420",
      },
      sla_violated_technician: null,
      sla: null,
      sla_violated_group: null,
      id: "7476",
    },
    {
      created_time: {
        display_value: "11/12/2024 12:39 PM",
        value: "1733949567723",
      },
      sla_violated_technician: null,
      sla: null,
      sla_violated_group: null,
      id: "7425",
    },
    {
      created_time: {
        display_value: "10/12/2024 09:31 AM",
        value: "1733851910560",
      },
      sla_violated_technician: null,
      sla: null,
      sla_violated_group: null,
      id: "7406",
    },
    {
      created_time: {
        display_value: "10/12/2024 05:03 AM",
        value: "1733835823483",
      },
      sla_violated_technician: null,
      sla: null,
      sla_violated_group: null,
      id: "7400",
    },
    {
      created_time: {
        display_value: "10/12/2024 03:57 AM",
        value: "1733831836822",
      },
      sla_violated_technician: null,
      sla: null,
      sla_violated_group: null,
      id: "7399",
    },
  ],
};

const requestClosed = {
  response_status: [
    {
      status_code: 2000,
      status: "success",
    },
  ],
  list_info: {
    has_more_rows: false,
    start_index: 1,
    fields_required: ["sla", "status", "created_time"],
    search_criteria: [
      {
        condition: "is",
        field: "status.name",
        value: "close",
      },
      {
        condition: "gte",
        field: "created_time",
        logical_operator: "and",
        value: "1733824731866",
      },
    ],
    row_count: 0,
  },
  requests: [
    {
      created_time: {
        display_value: "29/12/2024 12:16 AM",
        value: "1735417016684",
      },
      sla: null,
      id: "7571",
      status: {
        color: "#0066ff",
        name: "Open",
        id: "2",
      },
    },
    {
      created_time: {
        display_value: "28/12/2024 12:16 PM",
        value: "1735368360000",
      },
      sla: null,
      id: "7571",
      status: {
        color: "#0066ff",
        name: "Open",
        id: "2",
      },
    },
  ],
};

const slaViolated = {
  response_status: [
    {
      status_code: 2000,
      status: "success",
    },
  ],
  list_info: {
    has_more_rows: false,
    fields_required: ["sla", "status", "created_time"],
    start_index: 1,
    search_criteria: [
      {
        condition: "is",
        field: "status.name",
        value: "open",
      },
      {
        condition: "gte",
        field: "created_time",
        logical_operator: "and",
        value: "1733824731872",
      },
    ],
    row_count: 5,
  },
  requests: [
    {
      created_time: {
        display_value: "29/12/2024 12:16 PM",
        value: "1735503416684",
      },
      sla: null,
      id: "7571",
      status: {
        color: "#0066ff",
        name: "Open",
        id: "2",
      },
    },
    {
      created_time: {
        display_value: "29/12/2024 12:16 PM",
        value: "1735503415683",
      },
      sla: null,
      id: "7570",
      status: {
        color: "#0066ff",
        name: "Open",
        id: "2",
      },
    },
    {
      created_time: {
        display_value: "29/12/2024 08:27 AM",
        value: "1735489666599",
      },
      sla: null,
      id: "7569",
      status: {
        color: "#0066ff",
        name: "Open",
        id: "2",
      },
    },
    {
      created_time: {
        display_value: "26/12/2024 03:34 PM",
        value: "1735256044402",
      },
      sla: null,
      id: "7551",
      status: {
        color: "#0066ff",
        name: "Open",
        id: "2",
      },
    },
    {
      created_time: {
        display_value: "26/12/2024 03:34 PM",
        value: "1735256043593",
      },
      sla: "null",
      id: "7550",
      status: {
        color: "#0066ff",
        name: "Open",
        id: "2",
      },
    },
  ],
};

const unassignedOpenRequest = {
  response_status: [
    {
      status_code: 2000,
      status: "success",
    },
  ],
  list_info: {
    has_more_rows: false,
    fields_required: ["technician", "status", "created_time"],
    start_index: 1,
    search_criteria: [
      {
        condition: "is",
        field: "status.name",
        value: "open",
      },
    ],
    row_count: 18,
  },
  requests: [
    {
      created_time: {
        display_value: "29/12/2024 12:16 PM",
        value: "1735503416684",
      },
      technician: null,
      id: "7571",
      status: {
        color: "#0066ff",
        name: "Open",
        id: "2",
      },
    },
    {
      created_time: {
        display_value: "29/12/2024 12:16 PM",
        value: "1735503415683",
      },
      technician: null,
      id: "7570",
      status: {
        color: "#0066ff",
        name: "Open",
        id: "2",
      },
    },
    {
      created_time: {
        display_value: "29/12/2024 08:27 AM",
        value: "1735489666599",
      },
      technician: null,
      id: "7569",
      status: {
        color: "#0066ff",
        name: "Open",
        id: "2",
      },
    },
    {
      created_time: {
        display_value: "26/12/2024 03:34 PM",
        value: "1735256044402",
      },
      technician: {
        email_id: "tin@netswitch.net",
        phone: "415-481-0696",
        name: "Tin Siu",
        mobile: "+852 9793-0974",
        profile_pic: {
          "content-url":
            "/api/v3/technicians/615/_images/3f955d7b7ba24f5894fed7a81a7a41e9.png?key=a051d3b13794f4e85972effcd0240c235515ebee05559a61586da626eafbcea8bb6669bac0a0b5a5ad354d3d7bad3f7e8a64f551e3b7f9158a5dd6d5617e739a1c235022",
          name: "3f955d7b7ba24f5894fed7a81a7a41e9.png",
        },
        is_vipuser: false,
        org_user_status: "ACTIVE",
        id: "615",
        department: {
          site: {
            name: "APEX Sense Tech",
            id: 302,
          },
          name: "General",
          id: 303,
        },
        account: {
          name: "Netswitch Inc",
          id: "1",
        },
      },
      id: "7551",
      status: {
        color: "#0066ff",
        name: "Open",
        id: "2",
      },
    },
    {
      created_time: {
        display_value: "26/12/2024 03:34 PM",
        value: "1735256043593",
      },
      technician: {
        email_id: "tin@netswitch.net",
        phone: "415-481-0696",
        name: "Tin Siu",
        mobile: "+852 9793-0974",
        profile_pic: {
          "content-url":
            "/api/v3/technicians/615/_images/3f955d7b7ba24f5894fed7a81a7a41e9.png?key=338f13ea40e11d3fb67e89ecea29f7bbd190ab92fe8260cd12fe11478d1838753c82ca0c2022982b4f5a1e0d56e422c5716bd87d6c92ea695f028ee67aef0daac0b6fbb2",
          name: "3f955d7b7ba24f5894fed7a81a7a41e9.png",
        },
        is_vipuser: false,
        org_user_status: "ACTIVE",
        id: "615",
        department: {
          site: {
            name: "APEX Sense Tech",
            id: 302,
          },
          name: "General",
          id: 303,
        },
        account: {
          name: "Netswitch Inc",
          id: "1",
        },
      },
      id: "7550",
      status: {
        color: "#0066ff",
        name: "Open",
        id: "2",
      },
    },
    {
      created_time: {
        display_value: "27/09/2024 05:28 PM",
        value: "1727486919625",
      },
      technician: {
        email_id: "joe@netswitch.net",
        phone: null,
        name: "Joe",
        mobile: null,
        profile_pic: {
          "content-url": "/images/default-profile-pic2.svg",
          name: "default-profile-pic2.svg",
        },
        is_vipuser: false,
        org_user_status: "ACTIVE",
        id: "4501",
        department: {
          site: {
            name: "NTM - USA",
            id: 301,
          },
          name: "Engineering",
          id: 302,
        },
        account: {
          name: "Netswitch Inc",
          id: "1",
        },
      },
      id: "6719",
      status: {
        color: "#0066ff",
        name: "Open",
        id: "2",
      },
    },
    {
      created_time: {
        display_value: "23/09/2024 07:23 AM",
        value: "1727104985042",
      },
      technician: {
        email_id: "tin@netswitch.net",
        phone: "415-481-0696",
        name: "Tin Siu",
        mobile: "+852 9793-0974",
        profile_pic: {
          "content-url":
            "/api/v3/technicians/615/_images/3f955d7b7ba24f5894fed7a81a7a41e9.png?key=f9e8b65f1485b8bbeaef79f369bbf973ac31b3c16b52d9755c50bd3cb0ab2c85f3e3a8dfbf4666f9fe72439b3970f196846add838b2483fa86fafb97e32d5dce36b9c831",
          name: "3f955d7b7ba24f5894fed7a81a7a41e9.png",
        },
        is_vipuser: false,
        org_user_status: "ACTIVE",
        id: "615",
        department: {
          site: {
            name: "APEX Sense Tech",
            id: 302,
          },
          name: "General",
          id: 303,
        },
        account: {
          name: "Netswitch Inc",
          id: "1",
        },
      },
      id: "6679",
      status: {
        color: "#0066ff",
        name: "Open",
        id: "2",
      },
    },
    {
      created_time: {
        display_value: "22/09/2024 11:04 AM",
        value: "1727031851506",
      },
      technician: {
        email_id: "tin@netswitch.net",
        phone: "415-481-0696",
        name: "Tin Siu",
        mobile: "+852 9793-0974",
        profile_pic: {
          "content-url":
            "/api/v3/technicians/615/_images/3f955d7b7ba24f5894fed7a81a7a41e9.png?key=72e5f97ece2dbc71c351ebcb1f477ad7df6cb689850108a09137c1c690736b1b78e1604de2a5934d716f43dbe3e74ce79b0868a2035dd3e9029c21ad45efd26ef6b6d5ee",
          name: "3f955d7b7ba24f5894fed7a81a7a41e9.png",
        },
        is_vipuser: false,
        org_user_status: "ACTIVE",
        id: "615",
        department: {
          site: {
            name: "APEX Sense Tech",
            id: 302,
          },
          name: "General",
          id: 303,
        },
        account: {
          name: "Netswitch Inc",
          id: "1",
        },
      },
      id: "6675",
      status: {
        color: "#0066ff",
        name: "Open",
        id: "2",
      },
    },
    {
      created_time: {
        display_value: "21/09/2024 11:17 PM",
        value: "1726989458867",
      },
      technician: {
        email_id: "tin@netswitch.net",
        phone: "415-481-0696",
        name: "Tin Siu",
        mobile: "+852 9793-0974",
        profile_pic: {
          "content-url":
            "/api/v3/technicians/615/_images/3f955d7b7ba24f5894fed7a81a7a41e9.png?key=27d1e17d6a1f33d1a1623ac614ce5fc9cb5387f60be05b6dac1f03c25ad8d5b9678f37fc8778628ce5402f4ed8451d40f033cfe396668cb180306609b210d01288681d18",
          name: "3f955d7b7ba24f5894fed7a81a7a41e9.png",
        },
        is_vipuser: false,
        org_user_status: "ACTIVE",
        id: "615",
        department: {
          site: {
            name: "APEX Sense Tech",
            id: 302,
          },
          name: "General",
          id: 303,
        },
        account: {
          name: "Netswitch Inc",
          id: "1",
        },
      },
      id: "6672",
      status: {
        color: "#0066ff",
        name: "Open",
        id: "2",
      },
    },
    {
      created_time: {
        display_value: "02/09/2024 10:16 PM",
        value: "1725344211318",
      },
      technician: {
        email_id: "tin@netswitch.net",
        phone: "415-481-0696",
        name: "Tin Siu",
        mobile: "+852 9793-0974",
        profile_pic: {
          "content-url":
            "/api/v3/technicians/615/_images/3f955d7b7ba24f5894fed7a81a7a41e9.png?key=604d54eb6df7c6999c6373197560e498497a58b557bd0262781d561580692f9c2ce4bf91cead1b0c4b9dec53265c510a7cbd4abc4ffe97ba0b5b382d80628cb1fb6bbb94",
          name: "3f955d7b7ba24f5894fed7a81a7a41e9.png",
        },
        is_vipuser: false,
        org_user_status: "ACTIVE",
        id: "615",
        department: {
          site: {
            name: "APEX Sense Tech",
            id: 302,
          },
          name: "General",
          id: 303,
        },
        account: {
          name: "Netswitch Inc",
          id: "1",
        },
      },
      id: "6527",
      status: {
        color: "#0066ff",
        name: "Open",
        id: "2",
      },
    },
    {
      created_time: {
        display_value: "14/06/2024 11:00 PM",
        value: "1718434800561",
      },
      technician: {
        email_id: "stanley@netswitch.net",
        phone: "415-986-0660",
        name: "Stanley Li",
        mobile: "415-623-8383",
        profile_pic: {
          "content-url": "/images/default-profile-pic2.svg",
          name: "default-profile-pic2.svg",
        },
        is_vipuser: false,
        org_user_status: "ACTIVE",
        id: "613",
        department: {
          site: {
            name: "NTM - USA",
            id: 301,
          },
          name: "General",
          id: 301,
        },
        account: {
          name: "Netswitch Inc",
          id: "1",
        },
      },
      id: "5747",
      status: {
        color: "#0066ff",
        name: "Open",
        id: "2",
      },
    },
    {
      created_time: {
        display_value: "07/05/2024 09:34 AM",
        value: "1715103252719",
      },
      technician: {
        email_id: "joe@netswitch.net",
        phone: null,
        name: "Joe",
        mobile: null,
        profile_pic: {
          "content-url": "/images/default-profile-pic2.svg",
          name: "default-profile-pic2.svg",
        },
        is_vipuser: false,
        org_user_status: "ACTIVE",
        id: "4501",
        department: {
          site: {
            name: "NTM - USA",
            id: 301,
          },
          name: "Engineering",
          id: 302,
        },
        account: {
          name: "Netswitch Inc",
          id: "1",
        },
      },
      id: "5357",
      status: {
        color: "#0066ff",
        name: "Open",
        id: "2",
      },
    },
    {
      created_time: {
        display_value: "27/04/2024 12:29 AM",
        value: "1714206573491",
      },
      technician: {
        email_id: "tin@netswitch.net",
        phone: "415-481-0696",
        name: "Tin Siu",
        mobile: "+852 9793-0974",
        profile_pic: {
          "content-url":
            "/api/v3/technicians/615/_images/3f955d7b7ba24f5894fed7a81a7a41e9.png?key=99637bb9da44aa90a6c66f6c0d3ae349107209793fb6bbdbdb4a1e2944de6bc71fd5368a2c1dad29372ed9bb2aa56aa9c2db222970bdd2cd61081eb4ed5c5933ff704b28",
          name: "3f955d7b7ba24f5894fed7a81a7a41e9.png",
        },
        is_vipuser: false,
        org_user_status: "ACTIVE",
        id: "615",
        department: {
          site: {
            name: "APEX Sense Tech",
            id: 302,
          },
          name: "General",
          id: 303,
        },
        account: {
          name: "Netswitch Inc",
          id: "1",
        },
      },
      id: "5239",
      status: {
        color: "#0066ff",
        name: "Open",
        id: "2",
      },
    },
    {
      created_time: {
        display_value: "15/04/2024 10:07 AM",
        value: "1713204477301",
      },
      technician: null,
      id: "5135",
      status: {
        color: "#0066ff",
        name: "Open",
        id: "2",
      },
    },
    {
      created_time: {
        display_value: "14/11/2023 08:26 AM",
        value: "1699979169499",
      },
      technician: {
        email_id: "joe@netswitch.net",
        phone: null,
        name: "Joe",
        mobile: null,
        profile_pic: {
          "content-url": "/images/default-profile-pic2.svg",
          name: "default-profile-pic2.svg",
        },
        is_vipuser: false,
        org_user_status: "ACTIVE",
        id: "4501",
        department: {
          site: {
            name: "NTM - USA",
            id: 301,
          },
          name: "Engineering",
          id: 302,
        },
        account: {
          name: "Netswitch Inc",
          id: "1",
        },
      },
      id: "3625",
      status: {
        color: "#0066ff",
        name: "Open",
        id: "2",
      },
    },
    {
      created_time: {
        display_value: "09/11/2023 07:28 PM",
        value: "1699586914353",
      },
      technician: {
        email_id: "joe@netswitch.net",
        phone: null,
        name: "Joe",
        mobile: null,
        profile_pic: {
          "content-url": "/images/default-profile-pic2.svg",
          name: "default-profile-pic2.svg",
        },
        is_vipuser: false,
        org_user_status: "ACTIVE",
        id: "4501",
        department: {
          site: {
            name: "NTM - USA",
            id: 301,
          },
          name: "Engineering",
          id: 302,
        },
        account: {
          name: "Netswitch Inc",
          id: "1",
        },
      },
      id: "3602",
      status: {
        color: "#0066ff",
        name: "Open",
        id: "2",
      },
    },
    {
      created_time: {
        display_value: "05/09/2023 05:33 PM",
        value: "1693964004403",
      },
      technician: null,
      id: "3258",
      status: {
        color: "#0066ff",
        name: "Open",
        id: "2",
      },
    },
    {
      created_time: {
        display_value: "21/08/2023 04:46 PM",
        value: "1692665190684",
      },
      technician: null,
      id: "3127",
      status: {
        color: "#0066ff",
        name: "Open",
        id: "2",
      },
    },
  ],
};

module.exports = {
  requestSummary,
  requestReceived,
  requestClosed,
  slaViolated,
  unassignedOpenRequest,
};
