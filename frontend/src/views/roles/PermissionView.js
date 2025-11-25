const PermissionView = (props) => {
    const {
        isShownAddRoleData,
        allPermissionsSelected,
        handleSelectAllPermissions,
        ShownDefenceChild,
        isShownDefenceChild,
        ShownDiscoveryChild,
        isShownDiscoverychild,
        ShownAdminChild,
        isShownAdminChild,
        ShownGovernanceChild,
        isShownGovernanceChild,
        ShownToolsChild,
        IsShownToolsChild,
        handleChange,
        rolePermission
    } = props;

    return (
        <div className='mt-4 border-permossion border-0'>
            <h4 className='text-light'>Permissions </h4>
            {isShownAddRoleData && (
                <div className='selectall mb-4'>
                    <label htmlFor="selectAll" className="selectall-label">
                        <input
                            id="selectAll"
                            type="checkbox"
                            checked={allPermissionsSelected}
                            className="form-check-input pointer"
                            onChange={handleSelectAllPermissions}
                        />
                        Select All
                    </label>
                </div>
            )}

            <div className='role--container mt-0 pt-0 d-block'>
                <ul className='nested-Lists'>
                    <li>
                        <div className='d-flex align-items-center mb-0'>
                            <span onClick={ShownDefenceChild} className="check-box-permission"> <p>{`${isShownDefenceChild ? "-" : "+"}`}  </p></span>
                            <label className="mb-0" title="Defense" htmlFor="Defence">Defense</label>
                        </div>

                        {isShownDefenceChild && (
                            <ul className='nested-ChildLists row'>
                                <li className="col-6 col-lg-4 col-xl-3"> <label className="mb-0" title="Incident" htmlFor="Incident">Incident</label>
                                    <input type="checkbox" id="Incident" onChange={(e) => handleChange(e, 'defence', 'incident')} checked={rolePermission.defence.incident} className="form-check-input pointer " />
                                </li>

                                <li className="col-6 col-lg-4 col-xl-3">
                                    <label className="mb-0" title="Ransombloc" htmlFor="Ransombloc">Ransombloc</label>
                                    <input type="checkbox" id="Ransombloc" onChange={(e) => handleChange(e, 'defence', 'ransombloc')} checked={rolePermission.defence.ransombloc} className="form-check-input pointer " />
                                </li>
                            </ul>
                        )}
                    </li>

                    <li>
                        <div className='d-flex align-items-center mb-0'>
                            <span onClick={ShownDiscoveryChild} className="check-box-permission"> <p>{`${isShownDiscoverychild ? "-" : "+"}`}  </p></span>
                            <label className="mb-0" title="Discovery" htmlFor="Discovery">Discovery</label>
                        </div>

                        {isShownDiscoverychild && (
                            <ul className='nested-ChildLists row'>
                                <li className="col-6 col-lg-4 col-xl-3"> <label className="mb-0" title="Pentest" htmlFor="Pentest">Pentest</label>
                                    <input type="checkbox" checked={rolePermission.discovery.pentest} onChange={(e) => handleChange(e, 'discovery', 'pentest')} id="Pentest" className="form-check-input pointer " />
                                </li>

                                <li className="col-6 col-lg-4 col-xl-3">
                                    <label className="mb-0" title="Inventory" htmlFor="Inventory">Inventory</label>
                                    <input type="checkbox" id="Inventory" checked={rolePermission.discovery.inventory} onChange={(e) => handleChange(e, 'discovery', 'inventory')} className="form-check-input pointer " />
                                </li>
                            </ul>
                        )}
                    </li>

                    <li>
                        <div className='d-flex align-items-center mb-0'>
                            <span onClick={ShownAdminChild} className="check-box-permission"> <p>{`${isShownAdminChild ? "-" : "+"}`}  </p></span>
                            <label className="mb-0" title="Admin" htmlFor="Admin">Admin</label>
                        </div>

                        {isShownAdminChild && (
                            <ul className='nested-ChildLists row'>
                                <li className="col-6 col-lg-4 col-xl-3"> <label className="mb-0" title="User-Management" htmlFor="User-Management">User Management</label>
                                    <input type="checkbox" id="User-Management" checked={rolePermission.admin.userManagement} onChange={(e) => handleChange(e, 'admin', 'userManagement')} className="form-check-input pointer" />
                                </li>

                                <li className="col-6 col-lg-4 col-xl-3">
                                    <label className="mb-0" title="Role-Management" htmlFor="Role-Management">Role Management</label>
                                    <input type="checkbox" id="Role-Management" checked={rolePermission.admin.roleManagement} onChange={(e) => handleChange(e, 'admin', 'roleManagement')} className="form-check-input pointer" />
                                </li>

                                <li className="col-6 col-lg-4 col-xl-3">
                                    <label className="mb-0" title="Company-Management" htmlFor="Company-Management">Company Management</label>
                                    <input type="checkbox" id="Company-Management" checked={rolePermission.admin?.companyManagement} onChange={(e) => handleChange(e, 'admin', 'companyManagement')} className="form-check-input pointer" />
                                </li>
                            </ul>
                        )}
                    </li>

                    <li>
                        <div className='d-flex align-items-center mb-0'>
                            <span onClick={ShownGovernanceChild} className="check-box-permission"> <p>{`${isShownGovernanceChild ? "-" : "+"}`}  </p></span>
                            <label className="mb-0" title="Governance" htmlFor="Governance">Governance</label>
                        </div>

                        {isShownGovernanceChild && (
                            <ul className='nested-ChildLists row'>
                                <li className="col-6 col-lg-4 col-xl-3"> <label className="mb-0" title="Risk-Assessment" htmlFor="Risk-Assessment">Risk Assessment</label>
                                    <input type="checkbox" id="Risk-Assessment" checked={rolePermission.governance.ram} onChange={(e) => handleChange(e, 'governance', 'ram')} className="form-check-input pointer " />
                                </li>

                                <li className="col-6 col-lg-4 col-xl-3">
                                    <label className="mb-0" title="Compliance-Builder" htmlFor="Compliance-Builder">Compliance Builder</label>
                                    <input type="checkbox" id="Compliance-Builder" checked={rolePermission.governance.cb} onChange={(e) => handleChange(e, 'governance', 'cb')} className="form-check-input pointer " />
                                </li>

                                <li className="col-6 col-lg-4 col-xl-3">
                                    <label className="mb-0" title="Critical-Security-Controls" htmlFor="Critical-Security-Controls">Critical Security Controls</label>
                                    <input type="checkbox" id="Critical-Security-Controls" checked={rolePermission.governance.csc} onChange={(e) => handleChange(e, 'governance', 'csc')} className="form-check-input pointer " />
                                </li>

                                <li className="col-6 col-lg-4 col-xl-3">
                                    <label className="mb-0" title="Resilience-Index" htmlFor="Resilience-Index">Resilience Index</label>
                                    <input type="checkbox" id="Resilience-Index" checked={rolePermission.governance.cc} onChange={(e) => handleChange(e, 'governance', 'cc')} className="form-check-input pointer " />
                                </li>

                                <li className="col-6 col-lg-4 col-xl-3">
                                    <label className="mb-0" title="All-Tasks" htmlFor="All-Tasks">All Tasks</label>
                                    <input type="checkbox" id="All-Tasks" checked={rolePermission.governance.all_task} onChange={(e) => handleChange(e, 'governance', 'all_task')} className="form-check-input pointer " />
                                </li>
                            </ul>
                        )}
                    </li>

                    <li>
                        <div className='d-flex align-items-center mb-0'>
                            <span onClick={ShownToolsChild} className="check-box-permission"> <p>{`${IsShownToolsChild ? "-" : "+"}`}  </p></span>
                            <label className="mb-0" title="Tools" htmlFor="Tools">Tools</label>
                        </div>

                        {IsShownToolsChild && (
                            <ul className='nested-ChildLists row'>
                                <li className="col-6 col-lg-4 col-xl-3"> <label className="mb-0" title="Cve-tool" htmlFor="cve-tool">Cve-tool</label>
                                    <input type="checkbox" id="Cve-tool" checked={rolePermission.tools.cve_tool} onChange={(e) => handleChange(e, 'tools', 'cve_tool')} className="form-check-input pointer" />
                                </li>

                                <li className="col-6 col-lg-4 col-xl-3">
                                    <label className="mb-0" title="Threatsource" htmlFor="Threatsource">Threatsource</label>
                                    <input type="checkbox" id="Threatsource" checked={rolePermission.tools.threatsource} onChange={(e) => handleChange(e, 'tools', 'threatsource')} className="form-check-input pointer" />
                                </li>

                                <li className="col-6 col-lg-4 col-xl-3">
                                    <label className="mb-0" title="Zeek" htmlFor="Zeek">Zeek</label>
                                    <input type="checkbox" id="Zeek" checked={rolePermission.tools.Zeek} onChange={(e) => handleChange(e, 'tools', 'Zeek')} className="form-check-input pointer" />
                                </li>

                                <li className="col-6 col-lg-4 col-xl-3">
                                    <label className="mb-0" title="Cl-tool" htmlFor="Cl-tool">Cl-tool</label>
                                    <input type="checkbox" id="Cl-tool" checked={rolePermission.tools.cl_tool} onChange={(e) => handleChange(e, 'tools', 'cl_tool')} className="form-check-input pointer" />
                                </li>
                            </ul>
                        )}
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default PermissionView;
