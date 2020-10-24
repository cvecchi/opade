import * as metadataHelper from "./metadatahelper.js";
import * as clinicaldataHelper from "./clinicaldatahelper.js";
import * as admindataTemplates from "./admindatatemplates.js";

const $ = query => admindata.querySelector(query);
const $$ = query => admindata.querySelectorAll(query);

const admindataFileName = "admindata";

export const errors = {
    SITEHASSUBJECTS: 0
}

let admindata = null;

export function loadEmptyProject(studyOID) {
    admindata = admindataTemplates.getAdminData(studyOID);
    // TODO: It is probably better this way -- meaning that the helper itself stores the file on change
    storeAdmindata();
}

export function parseAdmindata(odmXMLString) {
    admindata = new DOMParser().parseFromString(odmXMLString, "text/xml").documentElement;
}

export function importAdmindata(odmXMLString) {
    const odm = new DOMParser().parseFromString(odmXMLString, "text/xml");
    if (odm.querySelector("AdminData")) {
        admindata = odm.querySelector("AdminData");
        storeAdmindata();
    } else {
        loadEmptyProject();
    }
}

export function getSerializedAdmindata() {
    return new XMLSerializer().serializeToString(admindata);
}

export function getAdmindata() {
    return admindata;
}

export function storeAdmindata() {
    localStorage.setItem(admindataFileName, getSerializedAdmindata());
}

export function loadStoredAdmindata() {
    let admindataXMLString = localStorage.getItem(admindataFileName);
    if (admindataXMLString) parseAdmindata(admindataXMLString);
}

export function getSite(siteOID) {
    return $(`Location[OID="${siteOID}"][LocationType="Site"]`);
}

export function getSiteOIDByName(siteName) {
    const site = $(`Location[Name="${siteName}"][LocationType="Site"]`);
    
    return site ? site.getAttribute("OID") : null;
}

export function getSiteNameByOID(siteOID) {
    const site = $(`Location[OID="${siteOID}"][LocationType="Site"]`);
    
    return site ? site.getAttribute("Name") : null;
}

export function getSites() {
    return $$("Location[LocationType='Site']");
}

export function addSite() {
    const newSiteOID = generateUniqueOID("L.");
    const newSite = admindataTemplates.getSite(newSiteOID, metadataHelper.getStudyOID(), metadataHelper.getMetaDataVersionOID(), new Date().toISOString().split("T")[0]);
    
    const lastSite = getLastElement(getSites());
    if (lastSite) {
        lastSite.insertAdjacentElement("afterend", newSite);
    } else {
        admindata.appendChild(newSite);
    }

    // TODO: It is probably better this way -- meaning that the helper itself stores the file on change
    storeAdmindata();

    return newSiteOID;
}

export function setSiteName(siteOID, name) {
    $(`Location[OID="${siteOID}"][LocationType="Site"]`).setAttribute("Name", name);
    storeAdmindata();
}

export function removeSite(siteOID) {
    if (clinicaldataHelper.getSubjectKeys(siteOID).length > 0) return Promise.reject(errors.SITEHASSUBJECTS);

    const site = $(`Location[OID="${siteOID}"][LocationType="Site"]`);
    if (site) site.remove();
    storeAdmindata();

    return Promise.resolve();
}

function generateUniqueOID(oidPrefix) {
    let count = 1;
    while ($(`[OID="${oidPrefix+count}"]`)) {
        count += 1;
    }

    return oidPrefix+count;
}

function getLastElement(elements) {
    if (elements.length >= 1) {
        return elements[elements.length - 1];
    } else {
        return null;
    }
}
