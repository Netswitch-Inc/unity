const requestClosedInlast20Days = {
  response_status: [
    {
      status_code: 2000,
      status: "success",
    },
  ],
  list_info: {
    has_more_rows: false,
    start_index: 1,
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
        value: "1728107705300",
      },
    ],
    row_count: 0,
  },
  requests: [],
};

const unassigned_Open = {
  response_status: [
    {
      status_code: 2000,
      status: "success",
    },
  ],
  list_info: {
    has_more_rows: false,
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
        value: "1728109629885",
      },
    ],
    row_count: 4,
  },
  requests: [
    {
      requester: {
        email_id: "support@dabs.zendesk.com",
        phone: null,
        name: "DABS",
        mobile: null,
        profile_pic: {
          "content-url": "/images/default-profile-pic2.svg",
          name: "default-profile-pic2.svg",
        },
        is_vipuser: true,
        org_user_status: "ACTIVE",
        id: "652",
        department: {
          site: {
            name: "DABS Inc.",
            id: 308,
          },
          name: "General",
          id: 306,
        },
        account: {
          name: "DABS",
          id: "307",
        },
      },
      template: {
        is_service_template: false,
        service_category: null,
        name: "Default Request",
        id: "1",
      },
      short_description:
        "*****A new ticket has been created, please login to below URL to reply to the user*****Ticket URL: https://support.dabsinc.com/hc/requests/1562A ticket (#1562) by Neil Nogaliza has been received.Requester Name: Neil NogalizaRequester Email: neil.nogaliza@dabsinc.comNeil NogalizaOct 24, 2024, 4:21 PM Good afternoon Netswitch,We are trying to use a Samsung Tablet&nbsp;S/N: R9PT51BLJAB / IMEI: 351026514913318 / Asset Tag# 15221147but the CASABA App is still active and passcodes aren&#39;t&nbsp;work...",
      created_time: {
        display_value: "24/10/2024 03:22 PM",
        value: "1729812163783",
      },
      subject: "[DABS] -] RE: Reset to factory settings Samsung Tablet",
      time_elapsed: null,
      is_overdue: false,
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
      priority: null,
      created_by: {
        email_id: null,
        phone: null,
        name: "System",
        mobile: null,
        profile_pic: {
          "content-url": "/images/default-profile-pic2.svg",
          name: "default-profile-pic2.svg",
        },
        is_vipuser: false,
        org_user_status: "RESIGNED",
        id: "1",
        department: null,
      },
      due_by_time: null,
      response_time_elapsed: null,
      site: {
        latitude: null,
        name: "DABS Inc.",
        id: "308",
        longitude: null,
      },
      is_service_request: false,
      cancel_requested_is_pending: false,
      accountcontract: null,
      cancel_requested: false,
      id: "6942",
      account: {
        country: null,
        inactive: false,
        has_attachments: false,
        name: "DABS",
        id: "307",
        ciid: "624",
      },
      status: {
        color: "#0066ff",
        name: "Open",
        id: "2",
      },
      group: null,
    },
    {
      requester: {
        email_id: "support@dabs.zendesk.com",
        phone: null,
        name: "DABS",
        mobile: null,
        profile_pic: {
          "content-url": "/images/default-profile-pic2.svg",
          name: "default-profile-pic2.svg",
        },
        is_vipuser: true,
        org_user_status: "ACTIVE",
        id: "652",
        department: {
          site: {
            name: "DABS Inc.",
            id: 308,
          },
          name: "General",
          id: 306,
        },
        account: {
          name: "DABS",
          id: "307",
        },
      },
      template: {
        is_service_template: false,
        service_category: null,
        name: "Default Request",
        id: "1",
      },
      short_description:
        "*****A new ticket has been created, please login to below URL to reply to the user*****Ticket URL: https://support.dabsinc.com/hc/requests/1561A ticket (#1561) by Neil Nogaliza has been received.Requester Name: Neil NogalizaRequester Email: neil.nogaliza@dabsinc.comNeil NogalizaOct 24, 2024, 12:47 PM Good afternoon Netswitch,Request to set up a New MacAir - M3 for Christine Ponce.Apple MacAir - M3 information:S/N: DXV5WYL651Asset Tag # 0384445______________________Created User Profile: Administr...",
      created_time: {
        display_value: "24/10/2024 11:48 AM",
        value: "1729799280239",
      },
      subject: "[DABS] -] RE: New MacAir M3 for Christine Ponce (10/24/2024)",
      time_elapsed: null,
      is_overdue: false,
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
      priority: null,
      created_by: {
        email_id: null,
        phone: null,
        name: "System",
        mobile: null,
        profile_pic: {
          "content-url": "/images/default-profile-pic2.svg",
          name: "default-profile-pic2.svg",
        },
        is_vipuser: false,
        org_user_status: "RESIGNED",
        id: "1",
        department: null,
      },
      due_by_time: null,
      response_time_elapsed: null,
      site: {
        latitude: null,
        name: "DABS Inc.",
        id: "308",
        longitude: null,
      },
      is_service_request: false,
      cancel_requested_is_pending: false,
      accountcontract: null,
      cancel_requested: false,
      id: "6937",
      account: {
        country: null,
        inactive: false,
        has_attachments: false,
        name: "DABS",
        id: "307",
        ciid: "624",
      },
      status: {
        color: "#0066ff",
        name: "Open",
        id: "2",
      },
      group: null,
    },
    {
      requester: {
        email_id: "info@hiesd.org",
        phone: null,
        name: "香港可持續發展教育學院",
        mobile: null,
        profile_pic: {
          "content-url": "/images/default-profile-pic2.svg",
          name: "default-profile-pic2.svg",
        },
        is_vipuser: false,
        org_user_status: "ACTIVE",
        id: "5719",
        department: null,
      },
      template: {
        is_service_template: false,
        service_category: null,
        name: "Default Request",
        id: "1",
      },
      short_description:
        "纳入香港金融管理局和證券及期貨事務監察委員會所推薦之課程【ESG X SDP 課程 助你掌握金融市場綠色轉型中的關鍵競爭力】纳入香港金融管理局和證券及期貨事務監察委員會所推薦之課程立即報名&nbsp;面對氣候變化和可持續發展的全球挑戰，香港作為國際金融中心大力推動綠色金融。香港可持續發展教育學院 的「環境、社會、企業管治」（ESG）及「可持續發展規劃」（SDP）及 碳排放計算 及 綠色金融專業融合課程 十一月課期正在招生中，助你快人一步把握綠色機遇。🚀 本課程特色：✅ 只需24小時面授課時，高效學習，快速掌握重點✅ 四合一課程 - 全面認識可持續發展和綠色金融的理論及實踐✅ 課程已納入「綠色和可持續金融培訓先導計劃」可獲發還款項課程名單內，合資格學員可向政府申請學費資助，上限為港幣10,000元！✅課程已納入由香港金融管理局和證券及期貨事務監察委員會共同領導的綠色和可持續金融跨機構督導小組建立的綠色和可持續金融知識中心所推薦之課程👉🏻了解詳情及報名：https://hiesd.org/wp/hc020-202411gsf/&nbsp;課程詳情：1. SDP『可持續發展規劃』(20...",
      created_time: {
        display_value: "23/10/2024 06:08 PM",
        value: "1729735696101",
      },
      subject: "ESG X SDP 課程 助你掌握金融市場綠色轉型中的關鍵競爭力",
      time_elapsed: null,
      is_overdue: false,
      technician: null,
      priority: null,
      created_by: {
        email_id: null,
        phone: null,
        name: "System",
        mobile: null,
        profile_pic: {
          "content-url": "/images/default-profile-pic2.svg",
          name: "default-profile-pic2.svg",
        },
        is_vipuser: false,
        org_user_status: "RESIGNED",
        id: "1",
        department: null,
      },
      due_by_time: null,
      response_time_elapsed: null,
      site: null,
      is_service_request: false,
      cancel_requested_is_pending: false,
      accountcontract: null,
      cancel_requested: false,
      id: "6929",
      account: null,
      status: {
        color: "#0066ff",
        name: "Open",
        id: "2",
      },
      group: null,
    },
    {
      requester: {
        email_id: "naoto@designlinebuilds.com",
        phone: null,
        name: "Naoto De Silva",
        mobile: null,
        profile_pic: {
          "content-url": "/images/default-profile-pic2.svg",
          name: "default-profile-pic2.svg",
        },
        is_vipuser: true,
        org_user_status: "ACTIVE",
        id: "620",
        department: {
          site: {
            name: "DLC",
            id: 306,
          },
          name: "General",
          id: 305,
        },
        account: {
          name: "DLC",
          id: "305",
        },
      },
      template: {
        is_service_template: false,
        service_category: null,
        name: "Default Request",
        id: "1",
      },
      short_description:
        "Hello Helpdesk,The previous laptop we configured for Andrew has a power problem and not able to turn on so we need to configure another machine for him.&nbsp;&nbsp;I have it ready to go for setup.&nbsp;&nbsp;For his credentials, the pc login pw should remain Kr1stensI have on file from last time his e-mail info as:Username:&nbsp;andrew@designlinebuilds.com (For e-mail)Password:&nbsp;Mch@l3_DLCPlease let me know when someone can remote in.&nbsp; Ultraviewer is on and ready.&nbsp;&nbsp;Thank you,&amp;...",
      created_time: {
        display_value: "23/10/2024 10:45 AM",
        value: "1729709154054",
      },
      subject: "re:  New Laptop Configuration for Andrew McHale",
      time_elapsed: null,
      is_overdue: false,
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
      priority: null,
      created_by: {
        email_id: null,
        phone: null,
        name: "System",
        mobile: null,
        profile_pic: {
          "content-url": "/images/default-profile-pic2.svg",
          name: "default-profile-pic2.svg",
        },
        is_vipuser: false,
        org_user_status: "RESIGNED",
        id: "1",
        department: null,
      },
      due_by_time: null,
      response_time_elapsed: null,
      site: {
        latitude: null,
        name: "DLC",
        id: "306",
        longitude: null,
      },
      is_service_request: false,
      cancel_requested_is_pending: false,
      accountcontract: {
        serviceplan: {
          id: "1",
        },
        isactivecontract: true,
        contractnumber: "4",
        contractname: "DLC MSP Postpaid 2024-2034",
        description: "",
        billunclosed: false,
        id: "901",
      },
      cancel_requested: false,
      id: "6925",
      account: {
        country: null,
        inactive: false,
        has_attachments: false,
        name: "DLC",
        id: "305",
        ciid: "622",
      },
      status: {
        color: "#0066ff",
        name: "Open",
        id: "2",
      },
      group: null,
    },
  ],
};

const slaGraphJson = {
  response_status: [
    {
      status_code: 2000,
      status: "success",
    },
  ],
  list_info: {
    has_more_rows: false,
    fields_required: [
      "sla",
      "created_time",
      "sla_violated_technician",
      "sla_violated_group",
    ],
    start_index: 1,
    search_criteria: [
      {
        condition: "gte",
        field: "created_time",
        value: "1728051394063",
      },
    ],
    row_count: 33,
  },
  requests: [
    {
      created_time: {
        display_value: "24/10/2024 03:22 PM",
        value: "1729812163783",
      },
      sla_violated_technician: null,
      sla: {
        id: "1",
        name: "High Sla",
      },
      sla_violated_group: null,
      id: "6942",
    },
    {
      created_time: {
        display_value: "24/10/2024 11:48 AM",
        value: "1729799280239",
      },
      sla_violated_technician: null,
      sla: null,
      sla_violated_group: null,
      id: "6937",
    },
    {
      created_time: {
        display_value: "24/10/2024 07:16 AM",
        value: "1729783005410",
      },
      sla_violated_technician: null,
      sla: null,
      sla_violated_group: null,
      id: "6932",
    },
    {
      created_time: {
        display_value: "23/10/2024 06:08 PM",
        value: "1729735696101",
      },
      sla_violated_technician: null,
      sla: null,
      sla_violated_group: null,
      id: "6929",
    },
    {
      created_time: {
        display_value: "23/10/2024 10:45 AM",
        value: "1729709154054",
      },
      sla_violated_technician: null,
      sla: null,
      sla_violated_group: null,
      id: "6925",
    },
    {
      created_time: {
        display_value: "23/10/2024 10:17 AM",
        value: "1729707451981",
      },
      sla_violated_technician: null,
      sla: null,
      sla_violated_group: null,
      id: "6924",
    },
    {
      created_time: {
        display_value: "23/10/2024 01:10 AM",
        value: "1729674627278",
      },
      sla_violated_technician: null,
      sla: null,
      sla_violated_group: null,
      id: "6919",
    },
    {
      created_time: {
        display_value: "21/10/2024 04:43 PM",
        value: "1729557780293",
      },
      sla_violated_technician: null,
      sla: null,
      sla_violated_group: null,
      id: "6909",
    },
    {
      created_time: {
        display_value: "21/10/2024 02:07 PM",
        value: "1729548470444",
      },
      sla_violated_technician: null,
      sla: null,
      sla_violated_group: null,
      id: "6908",
    },
    {
      created_time: {
        display_value: "20/10/2024 03:02 AM",
        value: "1729422156834",
      },
      sla_violated_technician: null,
      sla: null,
      sla_violated_group: null,
      id: "6898",
    },
    {
      created_time: {
        display_value: "19/10/2024 08:15 PM",
        value: "1729397732429",
      },
      sla_violated_technician: null,
      sla: null,
      sla_violated_group: null,
      id: "6897",
    },
    {
      created_time: {
        display_value: "18/10/2024 11:17 PM",
        value: "1729322273738",
      },
      sla_violated_technician: null,
      sla: null,
      sla_violated_group: null,
      id: "6892",
    },
    {
      created_time: {
        display_value: "18/10/2024 09:06 AM",
        value: "1729271168365",
      },
      sla_violated_technician: null,
      sla: null,
      sla_violated_group: null,
      id: "6887",
    },
    {
      created_time: {
        display_value: "18/10/2024 07:17 AM",
        value: "1729264649097",
      },
      sla_violated_technician: null,
      sla: null,
      sla_violated_group: null,
      id: "6886",
    },
    {
      created_time: {
        display_value: "17/10/2024 01:05 PM",
        value: "1729199119111",
      },
      sla_violated_technician: null,
      sla: null,
      sla_violated_group: null,
      id: "6882",
    },
    {
      created_time: {
        display_value: "17/10/2024 10:32 AM",
        value: "1729189935222",
      },
      sla_violated_technician: null,
      sla: null,
      sla_violated_group: null,
      id: "6880",
    },
    {
      created_time: {
        display_value: "16/10/2024 04:32 PM",
        value: "1729125150144",
      },
      sla_violated_technician: null,
      sla: null,
      sla_violated_group: null,
      id: "6872",
    },
    {
      created_time: {
        display_value: "16/10/2024 06:33 AM",
        value: "1729089207338",
      },
      sla_violated_technician: null,
      sla: null,
      sla_violated_group: null,
      id: "6867",
    },
    {
      created_time: {
        display_value: "15/10/2024 08:20 AM",
        value: "1729009252945",
      },
      sla_violated_technician: null,
      sla: null,
      sla_violated_group: null,
      id: "6857",
    },
    {
      created_time: {
        display_value: "15/10/2024 06:40 AM",
        value: "1729003238664",
      },
      sla_violated_technician: null,
      sla: null,
      sla_violated_group: null,
      id: "6853",
    },
    {
      created_time: {
        display_value: "14/10/2024 01:41 PM",
        value: "1728942109409",
      },
      sla_violated_technician: null,
      sla: null,
      sla_violated_group: null,
      id: "6850",
    },
    {
      created_time: {
        display_value: "14/10/2024 11:48 AM",
        value: "1728935287356",
      },
      sla_violated_technician: null,
      sla: null,
      sla_violated_group: null,
      id: "6849",
    },
    {
      created_time: {
        display_value: "11/10/2024 12:48 PM",
        value: "1728679718597",
      },
      sla_violated_technician: null,
      sla: null,
      sla_violated_group: null,
      id: "6838",
    },
    {
      created_time: {
        display_value: "10/10/2024 09:45 AM",
        value: "1728582356125",
      },
      sla_violated_technician: null,
      sla: null,
      sla_violated_group: null,
      id: "6830",
    },
    {
      created_time: {
        display_value: "08/10/2024 05:33 PM",
        value: "1728437599304",
      },
      sla_violated_technician: null,
      sla: null,
      sla_violated_group: null,
      id: "6816",
    },
    {
      created_time: {
        display_value: "08/10/2024 03:52 AM",
        value: "1728388371372",
      },
      sla_violated_technician: null,
      sla: null,
      sla_violated_group: null,
      id: "6807",
    },
    {
      created_time: {
        display_value: "06/10/2024 06:50 PM",
        value: "1728269402495",
      },
      sla_violated_technician: null,
      sla: null,
      sla_violated_group: null,
      id: "6797",
    },
    {
      created_time: {
        display_value: "06/10/2024 02:39 AM",
        value: "1728211147596",
      },
      sla_violated_technician: null,
      sla: null,
      sla_violated_group: null,
      id: "6792",
    },
    {
      created_time: {
        display_value: "05/10/2024 08:15 PM",
        value: "1728188156206",
      },
      sla_violated_technician: null,
      sla: null,
      sla_violated_group: null,
      id: "6790",
    },
    {
      created_time: {
        display_value: "05/10/2024 05:51 PM",
        value: "1728179461111",
      },
      sla_violated_technician: null,
      sla: null,
      sla_violated_group: null,
      id: "6789",
    },
    {
      created_time: {
        display_value: "04/10/2024 05:00 PM",
        value: "1728090041593",
      },
      sla_violated_technician: null,
      sla: null,
      sla_violated_group: null,
      id: "6782",
    },
    {
      created_time: {
        display_value: "04/10/2024 04:59 PM",
        value: "1728089973950",
      },
      sla_violated_technician: null,
      sla: null,
      sla_violated_group: null,
      id: "6781",
    },
    {
      created_time: {
        display_value: "04/10/2024 01:28 PM",
        value: "1728077328605",
      },
      sla_violated_technician: null,
      sla: null,
      sla_violated_group: null,
      id: "6779",
    },
  ],
};

const OpenViolated = {
  response_status: [
    {
      status_code: 2000,
      status: "success",
    },
  ],
  list_info: {
    has_more_rows: false,
    fields_required: ["sla", "status"],
    start_index: 1,
    search_criteria: [
      {
        condition: "is",
        field: "status.name",
        value: "open",
      },
    ],
    row_count: 17,
  },
  requests: [
    {
      sla: null,
      id: "6942",
      status: {
        color: "#0066ff",
        name: "Open",
        id: "2",
      },
    },
    {
      sla: null,
      id: "6937",
      status: {
        color: "#0066ff",
        name: "Open",
        id: "2",
      },
    },
    {
      sla: {
        id: "1",
        name: "High Sla",
      },
      id: "6929",
      status: {
        color: "#0066ff",
        name: "Open",
        id: "2",
      },
    },
    {
      sla: null,
      id: "6925",
      status: {
        color: "#0066ff",
        name: "Open",
        id: "2",
      },
    },
    {
      sla: null,
      id: "6719",
      status: {
        color: "#0066ff",
        name: "Open",
        id: "2",
      },
    },
    {
      sla: null,
      id: "6679",
      status: {
        color: "#0066ff",
        name: "Open",
        id: "2",
      },
    },
    {
      sla: null,
      id: "6675",
      status: {
        color: "#0066ff",
        name: "Open",
        id: "2",
      },
    },
    {
      sla: null,
      id: "6672",
      status: {
        color: "#0066ff",
        name: "Open",
        id: "2",
      },
    },
    {
      sla: null,
      id: "6527",
      status: {
        color: "#0066ff",
        name: "Open",
        id: "2",
      },
    },
    {
      sla: null,
      id: "5747",
      status: {
        color: "#0066ff",
        name: "Open",
        id: "2",
      },
    },
    {
      sla: null,
      id: "5357",
      status: {
        color: "#0066ff",
        name: "Open",
        id: "2",
      },
    },
    {
      sla: null,
      id: "5239",
      status: {
        color: "#0066ff",
        name: "Open",
        id: "2",
      },
    },
    {
      sla: null,
      id: "5135",
      status: {
        color: "#0066ff",
        name: "Open",
        id: "2",
      },
    },
    {
      sla: null,
      id: "3625",
      status: {
        color: "#0066ff",
        name: "Open",
        id: "2",
      },
    },
    {
      sla: null,
      id: "3602",
      status: {
        color: "#0066ff",
        name: "Open",
        id: "2",
      },
    },
    {
      sla: null,
      id: "3258",
      status: {
        color: "#0066ff",
        name: "Open",
        id: "2",
      },
    },
    {
      sla: null,
      id: "3127",
      status: {
        color: "#0066ff",
        name: "Open",
        id: "2",
      },
    },
  ],
};

const requestSummary = {
  response_status: [
    {
      status_code: 2000,
      status: "success",
    },
  ],
  list_info: {
    has_more_rows: false,
    fields_required: ["is_overdue", "completed_time"],
    start_index: 1,
    search_criteria: [
      {
        condition: "gte",
        field: "created_time",
        value: "1728109629885",
      },
      {
        condition: "lte",
        field: "created_time",
        logical_operator: "and",
        value: "1729382400000",
      },
    ],
    row_count: 19,
  },
  requests: [
    {
      is_overdue: false,
      completed_time: {
        display_value: "21/10/2024 05:58 AM",
        value: "1729519107650",
      },
      id: "6892",
    },
    {
      is_overdue: false,
      completed_time: {
        display_value: "18/10/2024 09:20 AM",
        value: "1729272035536",
      },
      id: "6887",
    },
    {
      is_overdue: false,
      completed_time: {
        display_value: "18/10/2024 01:56 PM",
        value: "1729288569099",
      },
      id: "6886",
    },
    {
      is_overdue: false,
      completed_time: {
        display_value: "17/10/2024 03:05 PM",
        value: "1729206302530",
      },
      id: "6882",
    },
    {
      is_overdue: false,
      completed_time: {
        display_value: "17/10/2024 11:36 AM",
        value: "1729193800606",
      },
      id: "6880",
    },
    {
      is_overdue: false,
      completed_time: {
        display_value: "17/10/2024 06:17 AM",
        value: "1729174669040",
      },
      id: "6872",
    },
    {
      is_overdue: false,
      completed_time: {
        display_value: "16/10/2024 06:46 AM",
        value: "1729090012930",
      },
      id: "6867",
    },
    {
      is_overdue: false,
      completed_time: {
        display_value: "15/10/2024 02:50 PM",
        value: "1729032637515",
      },
      id: "6857",
    },
    {
      is_overdue: false,
      completed_time: {
        display_value: "16/10/2024 06:23 AM",
        value: "1729088605451",
      },
      id: "6853",
    },
    {
      is_overdue: false,
      completed_time: {
        display_value: "15/10/2024 11:32 AM",
        value: "1729020733366",
      },
      id: "6850",
    },
    {
      is_overdue: false,
      completed_time: {
        display_value: "14/10/2024 12:55 PM",
        value: "1728939303306",
      },
      id: "6849",
    },
    {
      is_overdue: false,
      completed_time: {
        display_value: "11/10/2024 02:21 PM",
        value: "1728685317265",
      },
      id: "6838",
    },
    {
      is_overdue: false,
      completed_time: {
        display_value: "13/10/2024 07:15 AM",
        value: "1728832553958",
      },
      id: "6830",
    },
    {
      is_overdue: false,
      completed_time: {
        display_value: "10/10/2024 06:06 AM",
        value: "1728569186577",
      },
      id: "6816",
    },
    {
      is_overdue: false,
      completed_time: {
        display_value: "08/10/2024 06:21 AM",
        value: "1728397277361",
      },
      id: "6807",
    },
    {
      is_overdue: false,
      completed_time: {
        display_value: "07/10/2024 07:53 AM",
        value: "1728316421633",
      },
      id: "6797",
    },
    {
      is_overdue: false,
      completed_time: {
        display_value: "07/10/2024 07:01 AM",
        value: "1728313310437",
      },
      id: "6792",
    },
    {
      is_overdue: false,
      completed_time: {
        display_value: "07/10/2024 06:59 AM",
        value: "1728313188519",
      },
      id: "6790",
    },
    {
      is_overdue: false,
      completed_time: {
        display_value: "07/10/2024 06:58 AM",
        value: "1728313116743",
      },
      id: "6789",
    },
  ],
};

const requestClosedViolatedNonviolated = {
  response_status: [
    {
      status_code: 2000,
      status: "success",
    },
  ],
  list_info: {
    has_more_rows: true,
    search_fields: {
      "status.name": "close",
    },
    fields_required: ["sla", "status", "created_time"],
    start_index: 1,
    row_count: 50,
  },
  requests: [
    {
      created_time: {
        display_value: "24/10/2024 07:16 AM",
        value: "1729783005410",
      },
      sla: {
        id: "1",
        name: "High Sla",
      },
      id: "6932",
      status: {
        color: "#006600",
        name: "Closed",
        id: "1",
      },
    },
    {
      created_time: {
        display_value: "23/10/2024 10:17 AM",
        value: "1729707451981",
      },
      sla: {
        id: "1",
        name: "High Sla",
      },
      id: "6924",
      status: {
        color: "#006600",
        name: "Closed",
        id: "1",
      },
    },
    {
      created_time: {
        display_value: "23/10/2024 01:10 AM",
        value: "1729674627278",
      },
      sla: null,
      id: "6919",
      status: {
        color: "#006600",
        name: "Closed",
        id: "1",
      },
    },
    {
      created_time: {
        display_value: "21/10/2024 04:43 PM",
        value: "1729557780293",
      },
      sla: null,
      id: "6909",
      status: {
        color: "#006600",
        name: "Closed",
        id: "1",
      },
    },
    {
      created_time: {
        display_value: "21/10/2024 02:07 PM",
        value: "1729548470444",
      },
      sla: null,
      id: "6908",
      status: {
        color: "#006600",
        name: "Closed",
        id: "1",
      },
    },
    {
      created_time: {
        display_value: "20/10/2024 03:02 AM",
        value: "1729422156834",
      },
      sla: null,
      id: "6898",
      status: {
        color: "#006600",
        name: "Closed",
        id: "1",
      },
    },
    {
      created_time: {
        display_value: "19/10/2024 08:15 PM",
        value: "1729397732429",
      },
      sla: null,
      id: "6897",
      status: {
        color: "#006600",
        name: "Closed",
        id: "1",
      },
    },
    {
      created_time: {
        display_value: "18/10/2024 11:17 PM",
        value: "1729322273738",
      },
      sla: {
        id: "1",
        name: "High Sla",
      },
      id: "6892",
      status: {
        color: "#006600",
        name: "Closed",
        id: "1",
      },
    },
    {
      created_time: {
        display_value: "18/10/2024 09:06 AM",
        value: "1729271168365",
      },
      sla: {
        id: "1",
        name: "High Sla",
      },
      id: "6887",
      status: {
        color: "#006600",
        name: "Closed",
        id: "1",
      },
    },
    {
      created_time: {
        display_value: "18/10/2024 07:17 AM",
        value: "1729264649097",
      },
      sla: null,
      id: "6886",
      status: {
        color: "#006600",
        name: "Closed",
        id: "1",
      },
    },
    {
      created_time: {
        display_value: "17/10/2024 01:05 PM",
        value: "1729199119111",
      },
      sla: null,
      id: "6882",
      status: {
        color: "#006600",
        name: "Closed",
        id: "1",
      },
    },
    {
      created_time: {
        display_value: "17/10/2024 10:32 AM",
        value: "1729189935222",
      },
      sla: null,
      id: "6880",
      status: {
        color: "#006600",
        name: "Closed",
        id: "1",
      },
    },
    {
      created_time: {
        display_value: "16/10/2024 04:32 PM",
        value: "1729125150144",
      },
      sla: null,
      id: "6872",
      status: {
        color: "#006600",
        name: "Closed",
        id: "1",
      },
    },
    {
      created_time: {
        display_value: "16/10/2024 06:33 AM",
        value: "1729089207338",
      },
      sla: null,
      id: "6867",
      status: {
        color: "#006600",
        name: "Closed",
        id: "1",
      },
    },
    {
      created_time: {
        display_value: "15/10/2024 08:20 AM",
        value: "1729009252945",
      },
      sla: null,
      id: "6857",
      status: {
        color: "#006600",
        name: "Closed",
        id: "1",
      },
    },
    {
      created_time: {
        display_value: "15/10/2024 06:40 AM",
        value: "1729003238664",
      },
      sla: null,
      id: "6853",
      status: {
        color: "#006600",
        name: "Closed",
        id: "1",
      },
    },
    {
      created_time: {
        display_value: "14/10/2024 01:41 PM",
        value: "1728942109409",
      },
      sla: null,
      id: "6850",
      status: {
        color: "#006600",
        name: "Closed",
        id: "1",
      },
    },
    {
      created_time: {
        display_value: "14/10/2024 11:48 AM",
        value: "1728935287356",
      },
      sla: null,
      id: "6849",
      status: {
        color: "#006600",
        name: "Closed",
        id: "1",
      },
    },
    {
      created_time: {
        display_value: "11/10/2024 12:48 PM",
        value: "1728679718597",
      },
      sla: null,
      id: "6838",
      status: {
        color: "#006600",
        name: "Closed",
        id: "1",
      },
    },
    {
      created_time: {
        display_value: "10/10/2024 09:45 AM",
        value: "1728582356125",
      },
      sla: null,
      id: "6830",
      status: {
        color: "#006600",
        name: "Closed",
        id: "1",
      },
    },
    {
      created_time: {
        display_value: "08/10/2024 05:33 PM",
        value: "1728437599304",
      },
      sla: null,
      id: "6816",
      status: {
        color: "#006600",
        name: "Closed",
        id: "1",
      },
    },
    {
      created_time: {
        display_value: "08/10/2024 03:52 AM",
        value: "1728388371372",
      },
      sla: null,
      id: "6807",
      status: {
        color: "#006600",
        name: "Closed",
        id: "1",
      },
    },
    {
      created_time: {
        display_value: "06/10/2024 06:50 PM",
        value: "1728269402495",
      },
      sla: null,
      id: "6797",
      status: {
        color: "#006600",
        name: "Closed",
        id: "1",
      },
    },
    {
      created_time: {
        display_value: "06/10/2024 02:39 AM",
        value: "1728211147596",
      },
      sla: null,
      id: "6792",
      status: {
        color: "#006600",
        name: "Closed",
        id: "1",
      },
    },
    {
      created_time: {
        display_value: "05/10/2024 08:15 PM",
        value: "1728188156206",
      },
      sla: null,
      id: "6790",
      status: {
        color: "#006600",
        name: "Closed",
        id: "1",
      },
    },
    {
      created_time: {
        display_value: "05/10/2024 05:51 PM",
        value: "1728179461111",
      },
      sla: null,
      id: "6789",
      status: {
        color: "#006600",
        name: "Closed",
        id: "1",
      },
    },
    {
      created_time: {
        display_value: "04/10/2024 05:00 PM",
        value: "1728090041593",
      },
      sla: null,
      id: "6782",
      status: {
        color: "#006600",
        name: "Closed",
        id: "1",
      },
    },
    {
      created_time: {
        display_value: "04/10/2024 04:59 PM",
        value: "1728089973950",
      },
      sla: null,
      id: "6781",
      status: {
        color: "#006600",
        name: "Closed",
        id: "1",
      },
    },
    {
      created_time: {
        display_value: "04/10/2024 01:28 PM",
        value: "1728077328605",
      },
      sla: null,
      id: "6779",
      status: {
        color: "#006600",
        name: "Closed",
        id: "1",
      },
    },
    {
      created_time: {
        display_value: "03/10/2024 12:33 PM",
        value: "1727987618708",
      },
      sla: null,
      id: "6771",
      status: {
        color: "#006600",
        name: "Closed",
        id: "1",
      },
    },
    {
      created_time: {
        display_value: "03/10/2024 05:08 AM",
        value: "1727960899377",
      },
      sla: null,
      id: "6766",
      status: {
        color: "#006600",
        name: "Closed",
        id: "1",
      },
    },
    {
      created_time: {
        display_value: "02/10/2024 06:53 PM",
        value: "1727923983070",
      },
      sla: null,
      id: "6764",
      status: {
        color: "#006600",
        name: "Closed",
        id: "1",
      },
    },
    {
      created_time: {
        display_value: "02/10/2024 04:21 PM",
        value: "1727914875210",
      },
      sla: null,
      id: "6763",
      status: {
        color: "#006600",
        name: "Closed",
        id: "1",
      },
    },
    {
      created_time: {
        display_value: "02/10/2024 08:40 AM",
        value: "1727887225709",
      },
      sla: null,
      id: "6760",
      status: {
        color: "#006600",
        name: "Closed",
        id: "1",
      },
    },
    {
      created_time: {
        display_value: "02/10/2024 02:37 AM",
        value: "1727865447967",
      },
      sla: null,
      id: "6750",
      status: {
        color: "#006600",
        name: "Closed",
        id: "1",
      },
    },
    {
      created_time: {
        display_value: "01/10/2024 09:44 PM",
        value: "1727847890169",
      },
      sla: null,
      id: "6749",
      status: {
        color: "#006600",
        name: "Closed",
        id: "1",
      },
    },
    {
      created_time: {
        display_value: "01/10/2024 04:02 PM",
        value: "1727827348185",
      },
      sla: null,
      id: "6746",
      status: {
        color: "#006600",
        name: "Closed",
        id: "1",
      },
    },
    {
      created_time: {
        display_value: "01/10/2024 01:50 PM",
        value: "1727819417155",
      },
      sla: null,
      id: "6745",
      status: {
        color: "#006600",
        name: "Closed",
        id: "1",
      },
    },
    {
      created_time: {
        display_value: "01/10/2024 07:02 AM",
        value: "1727794964981",
      },
      sla: null,
      id: "6741",
      status: {
        color: "#006600",
        name: "Closed",
        id: "1",
      },
    },
    {
      created_time: {
        display_value: "30/09/2024 11:00 PM",
        value: "1727766059407",
      },
      sla: null,
      id: "6737",
      status: {
        color: "#006600",
        name: "Closed",
        id: "1",
      },
    },
    {
      created_time: {
        display_value: "30/09/2024 11:00 PM",
        value: "1727766000324",
      },
      sla: null,
      id: "6736",
      status: {
        color: "#006600",
        name: "Closed",
        id: "1",
      },
    },
    {
      created_time: {
        display_value: "30/09/2024 11:00 PM",
        value: "1727766000290",
      },
      sla: null,
      id: "6735",
      status: {
        color: "#006600",
        name: "Closed",
        id: "1",
      },
    },
    {
      created_time: {
        display_value: "30/09/2024 11:13 AM",
        value: "1727723595658",
      },
      sla: null,
      id: "6732",
      status: {
        color: "#006600",
        name: "Closed",
        id: "1",
      },
    },
    {
      created_time: {
        display_value: "29/09/2024 01:58 AM",
        value: "1727603896681",
      },
      sla: null,
      id: "6728",
      status: {
        color: "#006600",
        name: "Closed",
        id: "1",
      },
    },
    {
      created_time: {
        display_value: "28/09/2024 08:16 PM",
        value: "1727583406224",
      },
      sla: null,
      id: "6727",
      status: {
        color: "#006600",
        name: "Closed",
        id: "1",
      },
    },
    {
      created_time: {
        display_value: "28/09/2024 01:24 PM",
        value: "1727558676451",
      },
      sla: null,
      id: "6724",
      status: {
        color: "#006600",
        name: "Closed",
        id: "1",
      },
    },
    {
      created_time: {
        display_value: "28/09/2024 01:11 AM",
        value: "1727514711587",
      },
      sla: null,
      id: "6720",
      status: {
        color: "#006600",
        name: "Closed",
        id: "1",
      },
    },
    {
      created_time: {
        display_value: "27/09/2024 12:15 PM",
        value: "1727468115959",
      },
      sla: null,
      id: "6718",
      status: {
        color: "#006600",
        name: "Closed",
        id: "1",
      },
    },
    {
      created_time: {
        display_value: "27/09/2024 12:10 PM",
        value: "1727467802814",
      },
      sla: null,
      id: "6717",
      status: {
        color: "#006600",
        name: "Closed",
        id: "1",
      },
    },
    {
      created_time: {
        display_value: "27/09/2024 10:32 AM",
        value: "1727461932130",
      },
      sla: null,
      id: "6715",
      status: {
        color: "#006600",
        name: "Closed",
        id: "1",
      },
    },
  ],
};

export {
  requestClosedInlast20Days,
  unassigned_Open,
  slaGraphJson,
  OpenViolated,
  requestSummary,
  requestClosedViolatedNonviolated,
};
