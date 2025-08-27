import aimIcon from "assets/img/toolIcons/aim.png";
import asaIcon from "assets/img/toolIcons/asa.png";
import baIcon from "assets/img/toolIcons/ba.png";
import bcIcon from "assets/img/toolIcons/bc.png";
import biaIcon from "assets/img/toolIcons/bia.png";
import caIcon from "assets/img/toolIcons/ca.png";
import ciaIcon from "assets/img/toolIcons/cia.png";
// import ciIcon from "assets/img/toolIcons/ci.png";
// import criIcon from "assets/img/toolIcons/cri.png";
import cscIcon from "assets/img/toolIcons/csc.png";
// import ctIcon from "assets/img/toolIcons/ct.png";
import dlpIcon from "assets/img/toolIcons/dlp.png";
import drmIcon from "assets/img/toolIcons/drm.png";
import essIcon from "assets/img/toolIcons/ess.png";
import faIcon from "assets/img/toolIcons/fa.png";
import lcIcon from "assets/img/toolIcons/lc.png";
import nbaIcon from "assets/img/toolIcons/nba.png";
import nimIcon from "assets/img/toolIcons/nim.png";
import peIcon from "assets/img/toolIcons/pe.png";
import pentestIcon from "assets/img/toolIcons/pentest.png";
// import rbIcon from "assets/img/toolIcons/rb.png";
import saeIcon from "assets/img/toolIcons/sae.png";
import siemIcon from "assets/img/toolIcons/siem.png";
import socIcon from "assets/img/toolIcons/soc.png";
import thaIcon from "assets/img/toolIcons/tha.png";
import vaIcon from "assets/img/toolIcons/va.png";
import xdrIcon from "assets/img/toolIcons/xdr.png";

import seceon from "assets/img/toollogo/seceon.png";
import loggly from "assets/img/toollogo/loggly.png";
import Graylog from "assets/img/toollogo/Graylog.png";
import splunk from "assets/img/toollogo/splunk.png";
import Nessus from "assets/img/toollogo/Nessus.png";
import qualys from "assets/img/toollogo/qualys.webp";
import Nexpose from "assets/img/toollogo/Nexpose.png";
import Pentera from "assets/img/toollogo/Pentera.png";
import Invicti from "assets/img/toollogo/Invicti.png";
import wazuh from "assets/img/toollogo/wazuh.png";

const solutionToolIcons = [
    {
        key: "asset-inventory-management",
        value: "Asset Inventory Management",
        icon: "AIM",
        source: aimIcon,
        resilienceIndex: 38,
        historicData: [49, 45, 20, 34, 60, 71, 40, 65, 32, 38],
        description: "AIM is a cornerstone of our Defense-In-Depth security platform, providing a comprehensive view of all assets. AIM ensures that every device, application, and data repository is accounted for and monitored.",
        functions: [
            { id: 1, name: "Manage application security risks" }
        ],
        paid_tools: [
            { id: 1, name: "Qualys" },
            { id: 2, name: "SolarWinds" }
        ],
        os_tools: [
            { id: 1, name: "OpenVAS" },
            { id: 2, name: "GLPI" },
            { id: 3, name: "Ralph" }
        ]
    },
    {
        key: "application-security-assesment",
        value: "Application Security Assesment",
        icon: "ASA",
        source: asaIcon,
        resilienceIndex: 42,
        historicData: [37, 45, 26, 34, 62, 74, 40, 65, 32, 42],
        description: "ASA involves comprehensive testing and analysis of applications to identify vulnerabilities, assess security controls, and provide actionable recommendations for remediation.",
        functions: [
            { id: 1, name: "App Testing" },
            { id: 2, name: "Web App" },
            { id: 3, name: "Code Inspect" }
        ],
        paid_tools: [
            { id: 1, name: "Checkmarx" },
            { id: 2, name: "Netsparker" }
        ],
        os_tools: [
            { id: 1, name: "Burp Suite" },
            { id: 2, name: "Arachni" },
            { id: 3, name: "SonarQube" }
        ]
    },
    {
        key: "behavorial-analytics",
        value: "Behavorial Analytics",
        icon: "BA",
        source: baIcon,
        resilienceIndex: 42,
        historicData: [37, 45, 26, 34, 62, 74, 40, 65, 32, 42],
        description: "With BA, you'll be able to understand and predict human behavior by analyzing data from various sources through integrating advanced tools, we provide a comprehensive tool for predicting and interpreting user and device actions.",
        functions: [
            { id: 1, name: "User and Network Behavior Analytics" }
        ],
        paid_tools: [
            { id: 1, name: "Splunk User Behavior Analytics" }
        ],
        os_tools: []
    },
    {
        key: "business-continuity",
        value: "Business Continuity",
        icon: "BC",
        source: bcIcon,
        resilienceIndex: 49,
        historicData: [35, 45, 28, 31, 66, 72, 48, 63, 33, 49],
        description: "BC ensure your organization can maintain operations and quickly recover from disruptions by integrating advanced backup tools for data protection and recovery.",
        functions: [],
        paid_tools: [
            { id: 1, name: "Veeam Backup & Replication" },
            { id: 2, name: "Veeam Data Platform" }
        ],
        os_tools: [
            { id: 1, name: "Bacula" },
            { id: 2, name: "Bareos" },
            { id: 3, name: "FOG Project" }
        ]
    },
    {
        key: "business-impact-analysis",
        value: "Business Impact Analysis",
        icon: "BIA",
        source: biaIcon,
        resilienceIndex: 52,
        historicData: [35, 48, 25, 32, 61, 73, 47, 66, 34, 52],
        description: "BIA is a comprehensive and systematic process integrated to evaluate the effects of disruptions on your operations critical functions, assessing potential impacts, and prioritizing recovery efforts.",
        functions: [
            { id: 1, name: "Business Impact Analysis" }
        ],
        paid_tools: [
            { id: 1, name: "Fusion Risk Management" },
            { id: 2, name: "BCMMetrics" }
        ],
        os_tools: [
            { id: 1, name: "BIA Playbook & Workbook" },
            { id: 2, name: "OpenBIA" },
            { id: 3, name: "OpenSCAP" }
        ]
    },
    {
        key: "configuration-assessment",
        value: "Configuration Assessment",
        icon: "CA",
        source: caIcon,
        resilienceIndex: 59,
        historicData: [38, 46, 28, 37, 67, 75, 48, 60, 34, 59],
        description: "CA continuously scans your network to compare configurations against established benchmarks guidelines. It helps detect deviations from security best practices,",
        functions: [
            { id: 1, name: "Configuration Assessment" }
        ],
        paid_tools: [
            { id: 1, name: "Qualys Security Config Assessment" },
            { id: 2, name: "Tenable.io:" }
        ],
        os_tools: [
            { id: 1, name: "Wazuh" },
            { id: 2, name: "OpenSCAP" },
            { id: 3, name: "OpenVAS" }
        ]
    },
    {
        key: "compliance-internal-audit",
        value: "Compliance Internal Audit",
        icon: "CIA",
        source: ciaIcon,
        resilienceIndex: 30,
        historicData: [56, 49, 24, 36, 64, 71, 45, 63, 26, 30],
        description: "CIA involves an evaluation of your organization's processes, controls, and governance documentation against various compliance frameworks and identifies gaps, provides actionable insights, and helps you implement necessary controls to maintain compliance.",
        functions: [
            { id: 1, name: "Framework for continuous compliance monitoring." },
            { id: 2, name: "DMARC" }
        ],
        paid_tools: [
            { id: 1, name: "PwC's Enterprise Risk and Control Solutions" },
            { id: 2, name: "Qualys Compliance Management" },
            { id: 3, name: "Simplix.io" }
        ],
        os_tools: [
            { id: 1, name: "Wazuh" },
            { id: 2, name: "OpenSCAP" },
            { id: 3, name: "OpenVAS" }
        ]
    },
    // {
    //     key: "compliance",
    //     value: "Compliance",
    //     icon: "CI",
    //     source: ciIcon,
    //     resilienceIndex: 46,
    //     historicData: [59, 49, 31, 40, 60, 76, 42, 68, 28, 46],
    //     description: "",
    //     functions: [],
    //     paid_tools: [],
    //     os_tools: []
    // },
    // {
    //     key: "cyber-risk-indicator",
    //     value: "Cyber Risk Indicator",
    //     icon: "CRI",
    //     source: criIcon,
    //     resilienceIndex: 39,
    //     historicData: [69, 40, 36, 45, 68, 70, 48, 64, 24, 39],
    //     description: "URI offers a dynamic dashboard that visualizes your cyber risk in an easy-to-understand format, making it accessible for both technical and non-technical stakeholders. It helps you prioritize security efforts, make informed decisions, and proactively mitigate risks before they become incidents.",
    //     functions: [
    //         { id: 1, name: "Data Visualization" }
    //     ],
    //     paid_tools: [],
    //     os_tools: []
    // },
    {
        key: "critical-security-controls",
        value: "Critical Security Controls",
        icon: "CSC",
        source: cscIcon,
        resilienceIndex: 52,
        historicData: [68, 42, 38, 44, 50, 74, 47, 66, 26, 52],
        description: "CSC is 18 key controls that cover various aspects of security - inventory and control of assets, secure configuration, continuous vulnerability management, and data protection. CSC helps you identify and mitigate risks, ensuring that your security posture is robust and resilient.",
        functions: [
            { id: 1, name: "Prescriptive & Best Practices" }
        ],
        paid_tools: [
            { id: 1, name: "Bitdefender GravityZone" }
        ],
        os_tools: [
            { id: 1, name: "OpenVAS" },
            { id: 2, name: "Wazuh" },
            { id: 3, name: "Security Onion" }
        ]
    },
    // {
    //     key: "compliance-tethering",
    //     value: "Compliance Tethering",
    //     icon: "CT",
    //     source: ctIcon,
    //     resilienceIndex: 51,
    //     historicData: [62, 49, 33, 40, 58, 76, 48, 65, 28, 51],
    //     description: "CT is an innovative solution designed to help organizations evaluate governance standards to the technical telemetry from your organization's cybersecurity tools. This ensures that your compliance efforts are not only documented but also actively monitored and enforced through real-time data.",
    //     functions: [],
    //     paid_tools: [],
    //     os_tools: []
    // },
    {
        key: "data-loss-prevention",
        value: "Data Loss Prevention",
        icon: "DLP",
        source: dlpIcon,
        resilienceIndex: 56,
        historicData: [51, 40, 36, 42, 60, 72, 49, 64, 30, 56],
        description: "DLP continuously monitors and protects data across your organization, ensuring that sensitive information remains secure. It helps prevent data breaches, comply with regulatory requirements, and protect intellectual property.",
        functions: [
            { id: 1, name: "Data Loss Prevention" },
            { id: 2, name: "DLP" }
        ],
        paid_tools: [
            { id: 1, name: "Symantec Data Loss Prevention" },
            { id: 2, name: "Microsoft Purview DLP" },
            { id: 3, name: "Proofpoint Enterprise DLP" }
        ],
        os_tools: [
            { id: 1, name: "OpenDLP" },
            { id: 2, name: "MyDLP" },
            { id: 3, name: "Wazuh" }
        ]
    },
    {
        key: "domain-reputation-monitoring",
        value: "Domain Reputation Monitoring",
        icon: "DRM",
        source: drmIcon,
        resilienceIndex: 58,
        historicData: [39, 29, 50, 46, 65, 71, 48, 62, 32, 58],
        description: "DRM maintain a strong and reliable online presence, aligning with your business objectives and compliance requirements.",
        functions: [
            { id: 1, name: "Domain Reputation" },
            { id: 2, name: "SIEM" }
        ],
        paid_tools: [
            { id: 1, name: "Kroll Domain Monitoring" }
        ],
        os_tools: [
            { id: 1, name: "MailCleaner" },
            { id: 2, name: "Wazuh" },
            { id: 3, name: "Proxmox" }
        ]
    },
    {
        key: "email-spam-sheild",
        value: "Email Spam Sheild",
        icon: "ESS",
        source: essIcon,
        resilienceIndex: 62,
        historicData: [56, 49, 48, 40, 68, 76, 43, 69, 34, 62],
        description: "ESS ensures your email communications remain secure, reduces the risk of phishing attacks, malware, and spam. It not only enhances your security but also aligns with your business objectives and compliance requirements.",
        functions: [
            { id: 1, name: "Email Filter" },
            { id: 2, name: "DMARC" }
        ],
        paid_tools: [
            { id: 1, name: "ProofPoint" },
            { id: 2, name: "SenDMARC" },
            { id: 3, name: "ezDMARC" }
        ],
        os_tools: [
            { id: 1, name: "MailCleaner" },
            { id: 2, name: "DMARCLY" },
            { id: 3, name: "PowerDMARC" }
        ]
    },
    {
        key: "firewall-automation",
        value: "Firewall Automation",
        icon: "FA",
        source: faIcon,
        resilienceIndex: 22,
        historicData: [50, 39, 40, 47, 66, 71, 48, 60, 28, 22],
        description: "FA reduces the risk of human error, accelerates response times, and ensures that security policies are consistently applied.",
        functions: [
            { id: 1, name: "Adjusts firewall rules based on predefined policies and threat intelligence" }
        ],
        paid_tools: [
            { id: 1, name: "Cisco Firepower" },
            { id: 2, name: "Palo Alto Panorama" }
        ],
        os_tools: [
            { id: 1, name: "pfSense" },
            { id: 2, name: "OPNsense" }
        ]
    },
    {
        key: "log-collector",
        value: "Log Collector",
        icon: "LOC",
        source: lcIcon,
        resilienceIndex: 25,
        historicData: [34, 28, 56, 44, 69, 22, 50, 63, 39, 25],
        description: "LC streamlines log management ensuring that your organization is compliant with regulatory requirements.",
        functions: [],
        paid_tools: [
            { id: 1, name: "Splunk" },
            { id: 2, name: "Datadog" }
        ],
        os_tools: [
            { id: 1, name: "Zeek" },
            { id: 2, name: "ELK Stack" },
            { id: 3, name: "Wazuh" }
        ],
        data: [
            {
                id: 1,
                name: "Loggly",
                rating: 4.6,
                source: loggly,
                description: "Loggly is a cloud-based log management solution that helps developers and IT teams monitor, troubleshoot, and analyze logs in real-time.",
            },
            {
                id: 2,
                name: "Graylog",
                rating: 4.4,
                source: Graylog,
                description: "Graylog is an open-source log management platform that enables efficient log data collection, storage, and analysis.",
            },
            {
                id: 3,
                name: "Splunk",
                rating: 4.8,
                source: splunk,
                description: "Splunk collects and indexes machine data to provide operational intelligence, helping organizations monitor and analyze their IT environments."
            }
        ]
    },
    {
        key: "network-behavorial-analytics",
        value: "Network Behavorial Analytics",
        icon: "NBA",
        source: nbaIcon,
        resilienceIndex: 28,
        historicData: [22, 30, 38, 42, 67, 73, 47, 63, 20, 28],
        description: "",
        functions: [],
        paid_tools: [],
        os_tools: []
    },
    {
        key: "network-infrastructure-montioring",
        value: "Network Infrastructure Montioring",
        icon: "NIM",
        source: nimIcon,
        resilienceIndex: 35,
        historicData: [20, 29, 33, 45, 60, 71, 46, 62, 23, 35],
        description: "NIM give visibility into your network, enhance operational efficiency, and ensure that your infrastructure is secure and reliable.",
        functions: [],
        paid_tools: [
            { id: 1, name: "SolarWinds Network Performance Monitor" },
            { id: 2, name: "ManageEngine OpManager" }
        ],
        os_tools: [
            { id: 1, name: "Nagios" },
            { id: 2, name: "Prometheus" }
        ]
    },
    {
        key: "policy-enforcement",
        value: "Policy Enforcement",
        icon: "PE",
        source: peIcon,
        resilienceIndex: 49,
        historicData: [53, 22, 36, 40, 60, 73, 47, 65, 26, 49],
        description: "PE enforces your policies, ensuring that any deviations are promptly identified and addressed to maintain compliance, reduce risk, and enhance overall security posture.",
        functions: [
            { id: 1, name: "policy enforcement" },
            { id: 2, name: "policy enforcement" }
        ],
        paid_tools: [
            { id: 1, name: "Palo Alto Next-Gen Firewall (NGFW)" },
            { id: 2, name: "Cisco Identity Services Engine" }
        ],
        os_tools: [
            { id: 1, name: "Open Policy Agent (OPA)" },
            { id: 2, name: "Rizk" }
        ]
    },
    {
        key: "penetration-testing",
        value: "Penetration Testing",
        icon: "PENTEST",
        source: pentestIcon,
        resilienceIndex: 35,
        historicData: [29, 45, 58, 40, 66, 24, 35, 60, 32, 35],
        description: "PT exams your systems using both automated tools and manual techniques for a comprehensive assessment into potential security gaps and delivers actionable recommendations for resilience.",
        functions: [
            { id: 1, name: "Comprehensive internal penetration testing" }
        ],
        paid_tools: [
            { id: 1, name: "Cymulate" },
            { id: 2, name: "Picus Security" },
            { id: 3, name: "Pentera" }
        ],
        os_tools: [
            { id: 1, name: "Metasploit" },
            { id: 2, name: "OWASP ZAP" },
            { id: 3, name: "Kali Linux" }
        ],
        data: [
            {
                id: 3,
                rating: 4.95,
                name: "Pentera",
                source: Pentera,
                description: "The Pentera platform is helping over 450 organizations in over 45 countries around the world discover their real-world, real-time security exposure by emulating real-life attacks on every cybersecurity layer, all day, every day. Eliminate guesswork, ditch delays, and embrace automated security validation for a continuous understanding of your risk.",
            },
            {
                id: 4,
                rating: 3.45,
                name: "Invicti",
                source: Invicti,
                description: "Invicti, the web application security solution that automatically verifies the identified vulnerabilities, was first released on the market in 2009."
            }
        ]
    },
    // {
    //     key: "ransom-bloc",
    //     value: "RansomBloc",
    //     icon: "RB",
    //     source: rbIcon,
    //     resilienceIndex: 56,
    //     historicData: [50, 22, 40, 46, 65, 70, 44, 63, 28, 56],
    //     description: "RB integrates advanced tools and methodologies to provide robust ransomware protection",
    //     functions: [],
    //     paid_tools: [],
    //     os_tools: []
    // },
    {
        key: "security-awareness-education",
        value: "Security Awareness Education",
        icon: "SAE",
        source: saeIcon,
        resilienceIndex: 59,
        historicData: [20, 53, 35, 44, 62, 73, 49, 60, 45, 59],
        description: "Foster a culture of security awareness with SAE with interactive modules, videos, and real-world simulations to make learning effective and compliant.",
        functions: [],
        paid_tools: [
            { id: 1, name: "KnowBe4" },
            { id: 2, name: "RightHand Security" },
            { id: 3, name: "BreachSecureNow" }
        ],
        os_tools: [
            { id: 1, name: "CyATP" },
            { id: 2, name: "ZibaSec Awareness Training" }
        ]
    },
    {
        key: "security-information-event-management",
        value: "Security Information and Event Management",
        icon: "SIEM",
        source: siemIcon,
        resilienceIndex: 34,
        historicData: [35, 50, 55, 60, 30, 45, 20, 70, 34, 34],
        description: "SIEMs provide visibility into your security landscape, streamline incident management processes, and ensure that your organization is protected against sophisticated cyber threats.",
        functions: [],
        paid_tools: [
            { id: 1, name: "Seceon" },
            { id: 2, name: "Netsurion" },
            { id: 3, name: "Fortinet" }
        ],
        os_tools: [
            { id: 1, name: "Wazuh" },
            { id: 2, name: "SIEMonster" },
            { id: 3, name: "ELK Stack" }
        ],
        data: [
            {
                id: 1,
                name: "Seceon",
                rating: 5,
                source: seceon,
                description: "Seceon is global provider of the most advanced Artificial Intelligence driven cyber threat detection and remediation platforms for Enterprises and Managed Security Service Providers (MSSP)."
            },
            {
                id: 2,
                rating: 3.95,
                name: "Splunk",
                source: splunk,
                description: "The Splunk platform removes the barriers between data and action, empowering observability, IT and security teams to ensure their organizations are secure, resilient and innovative."
            },
            {
                id: 4,
                name: "Wazuh",
                rating: 4.6,
                source: wazuh,
                description: "The Wazuh Security Information and Event Management (SIEM) solution is a centralized platform for aggregating and analyzing telemetry in real time for threat detection and compliance. Wazuh collects event data from various sources like endpoints, network devices, cloud workloads, and applications for broader security coverage."
            }
        ]
    },
    {
        key: "security-operation-center",
        value: "Security Operation Center",
        icon: "SOC",
        source: socIcon,
        resilienceIndex: 60,
        historicData: [29, 52, 37, 40, 68, 79, 43, 65, 48, 60],
        description: "Advanced monitoring, threat detection, and incident response functionalities.",
        functions: [],
        paid_tools: [
            { id: 1, name: "Wirespeed.io" }
        ],
        os_tools: [
            { id: 1, name: "TheHive" }
        ]
    },
    {
        key: "threat-hunting-analytics",
        value: "Threat Hunting Analytics",
        icon: "THA",
        source: thaIcon,
        resilienceIndex: 28,
        historicData: [20, 56, 35, 43, 69, 74, 49, 64, 47, 28],
        description: "",
        functions: [
            { id: 1, name: "Threat Hunting" },
            { id: 2, name: "Forensic Analysis" },
            { id: 3, name: "Windows OS Logging" }
        ],
        paid_tools: [
            { id: 1, name: "Splunk Enterprise Security" }
        ],
        os_tools: [
            { id: 1, name: "Elastic Stack" },
            { id: 2, name: "YARA" },
            { id: 3, name: "Sysmon" }
        ]
    },
    {
        key: "vulnerability-assessment",
        value: "Vulnerability Assessment",
        icon: "VA",
        source: vaIcon,
        resilienceIndex: 55,
        historicData: [41, 27, 65, 33, 54, 60, 23, 49, 70, 55],
        description: "VA is a fundamental product to highlight potential risks and actionable recommendations for remediation.",
        functions: [
            { id: 1, name: "Scans and analyzes your systems & networks." }
        ],
        paid_tools: [
            { id: 1, name: "Qualys" },
            { id: 2, name: "Rapid7 " }
        ],
        os_tools: [
            { id: 1, name: "OpenVAS" },
            { id: 2, name: "Nmap" }
        ],
        data: [
            {
                id: 5,
                name: "Nessus",
                rating: 4.7,
                source: Nessus,
                description: "Nessus is a widely used vulnerability scanner that helps security professionals identify and remediate vulnerabilities in their systems.",
            },
            {
                id: 6,
                name: "Qualys",
                rating: 4.5,
                source: qualys,
                description: "Qualys offers a cloud-based vulnerability management solution that provides continuous visibility and security for all IT assets."
            },
            {
                id: 7,
                name: "Rapid7 Nexpose",
                rating: 4.3,
                source: Nexpose,
                description: "Nexpose is a vulnerability management solution that provides real-time insight into the security of your systems and networks."
            }
        ]
    },
    {
        key: "extended-detection-response",
        value: "Extended Detection & Response",
        icon: "XDR",
        source: xdrIcon,
        resilienceIndex: 33,
        historicData: [26, 54, 37, 49, 68, 77, 48, 61, 43, 33],
        description: "XDR offers a unified view of threats, enabling faster detection, investigation, and respons by processing  real-time analytics, ensuring that threats are detected and responded to with minimal latency.",
        functions: [
            { id: 1, name: "XDR" },
            { id: 2, name: "XDR" },
            { id: 3, name: "MDR" }
        ],
        paid_tools: [
            { id: 1, name: "Trend Micro XDR" },
            { id: 2, name: "Sophos XDR" },
            { id: 3, name: "WireSpeed" }
        ],
        os_tools: [
            { id: 1, name: "Wazuh" }
        ]
    }
]

export { solutionToolIcons }
