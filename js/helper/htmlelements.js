//
//
// TODO: This file should be refactored. ODM attributes should be moved to another file and range checks as well as data types combined to one object.
// Moreover, the code is quite redundant for some functions and creating a select should be refactored across the app as well.
// For the data types there are already translations in the i18n files available (different codelist data types may be removed for usability purposes)
//
//

import * as languageHelper from "./languagehelper.js";

const rangeCheckComparators = ["", "LT", "LE", "GT", "GE", "EQ", "NE"];
const rangeCheckComparatorsDisplay = ["--", "<", "<=", ">", ">=", "=", "!="];
const dataTypes = ["integer", "float", "boolean", "text", "string", "date", "time", "datetime", "codelist-text", "codelist-integer", "codelist-float", "double"];
const mandatory = ["No", "Yes"];

export function getMetadataPanelBlock(elementOID, elementType, titleText, fallbackText, subtitleText, codedValue, draggable) {
    let panelBlock = document.createElement("a");
    panelBlock.className = "panel-block";
    panelBlock.setAttribute("oid", elementOID);
    panelBlock.setAttribute("element-type", elementType);
    panelBlock.setAttribute("draggable", draggable);
    if (codedValue) panelBlock.setAttribute("coded-value", codedValue);

    let title = document.createElement("div");
    title.className = "panel-block-title";

    if (titleText) {
        title.textContent = titleText;
    } else {
        let dot = document.createElement("span");
        dot.className = "panel-icon has-text-link";
        let dotIcon = document.createElement("i");
        dotIcon.className = "fas fa-question";
        dot.appendChild(dotIcon);
        panelBlock.appendChild(dot);
        subtitleText = languageHelper.getTranslation("missing-translation");
        if (fallbackText) {
            title.textContent = fallbackText;
        } else {
            title.innerHTML = "&nbsp;";
        }
    }

    if (subtitleText) {
        let content = document.createElement("div");
        content.className = "panel-block-content";
        content.appendChild(title);
        let subtitle = document.createElement("div");
        subtitle.className = "panel-block-subtitle";
        subtitle.textContent = subtitleText;
        content.appendChild(subtitle);
        panelBlock.appendChild(content);
    } else {
        panelBlock.appendChild(title);
    }

    return panelBlock;
}

export function getClinicaldataPanelBlock(elementOID, titleText, fallbackText, subtitleText, dataStatus) {
    let panelBlock = document.createElement("a");
    panelBlock.className = "panel-block";
    panelBlock.setAttribute("oid", elementOID);

    if (dataStatus) {
        let dot = document.createElement("span");
        dot.className = dataStatus == 5 ? "panel-icon has-text-danger" : "panel-icon has-text-link";
        let dotIcon = document.createElement("i");

        switch (dataStatus) {
            case 1:
                dotIcon.className = "far fa-circle";
                break;
            case 2:
                dotIcon.className = "fas fa-dot-circle";
                break;
            case 3:
                dotIcon.className = "fas fa-circle";
                break;
            case 4:
                dotIcon.className = "fas fa-check-circle";
                break;
            case 5:
                dotIcon.className = "fas fa-circle";
        }

        dot.appendChild(dotIcon);
        panelBlock.appendChild(dot);
    }

    let title = document.createElement("div");
    title.className = "panel-block-title";

    if (titleText) {
        title.textContent = titleText;
    } else if (fallbackText) {
        title.textContent = fallbackText;
    } else {
        title.innerHTML = "&nbsp;";
    }

    if (subtitleText) {
        let content = document.createElement("div");
        content.className = "panel-block-content";
        content.appendChild(title);
        let subtitle = document.createElement("div");
        subtitle.className = "panel-block-subtitle";
        subtitle.textContent = subtitleText;
        content.appendChild(subtitle);
        panelBlock.appendChild(content);
    } else {
        panelBlock.appendChild(title);
    }

    return panelBlock;
}

export function getAliasInputElement(context, name) {
    let field = document.createElement("div");
    field.className = "field alias-input is-grouped";

    let input = document.createElement("input");
    input.type = "text";

    input.value = context;
    input.className = "input alias-context";
    if (!context) input.placeholder = languageHelper.getTranslation("context");
    field.appendChild(input.cloneNode());
    
    field.insertAdjacentHTML("beforeend", "&nbsp;&nbsp;");

    input.value = name;
    input.className = "input alias-name";
    if (!name) input.placeholder = languageHelper.getTranslation("name");
    field.appendChild(input.cloneNode());

    return field;
}

export function getRangeCheckInputElement(selectedComparator, checkValue) {
    let field = document.createElement("div");
    field.className = "field range-check-input is-grouped";

    let select = getSelect("range-check-comparator", false, false, rangeCheckComparators, selectedComparator, rangeCheckComparatorsDisplay, null);
    field.appendChild(select);
    
    field.insertAdjacentHTML("beforeend", "&nbsp;&nbsp;");

    let input = document.createElement("input");
    input.type = "text";
    input.value = checkValue;
    input.className = "input range-check-value";
    if (!checkValue) input.placeholder = languageHelper.getTranslation("check-value");
    field.appendChild(input.cloneNode());

    return field;
}

export function getDataTypeSelect() {
    const translatedOptions = dataTypes.map(option => languageHelper.getTranslation(option));
    return getSelect("datatype-select", true, true, dataTypes, null, translatedOptions, true);
}

export function getMandatorySelect() {
    const translatedOptions = mandatory.map(option => languageHelper.getTranslation(option.toLowerCase()));
    return getSelect("mandatory-select", true, true, mandatory, null, translatedOptions, true);
}

export function getSelect(name, isUnique, isFullwidth, values, selectedValue, displayTexts, i18n) {
    let select = document.createElement("div");
    if (isUnique) {
        select.id = `${name}-outer`;
        if (isFullwidth) {
            select.className = `select is-fullwidth`;
        } else {
            select.className = `select`;
        }
    } else {
        if (isFullwidth) {
            select.className = `select is-fullwidth ${name}-outer`;
        } else {
            select.className = `select ${name}-outer`;
        }
    }

    let innerSelect = document.createElement("select");
    if (isUnique) {
        innerSelect.id = `${name}-inner`;
    } else {
        innerSelect.className = `${name}-inner`;
    }

    for (let i = 0; i < values.length; i++) {
        let option = document.createElement("option");
        option.value = values[i];
        option.textContent = displayTexts ? displayTexts[i] : values[i];
        if (i18n) option.setAttribute("i18n", values[i].toLowerCase());
        if (values[i] == selectedValue) option.selected = true;
        innerSelect.appendChild(option);
    }

    select.appendChild(innerSelect);

    return select;
}

export function getTable(data) {
    const keys = Object.keys(data);
    const table = document.createElement("table");
    table.className = "table is-fullwidth is-bordered is-hoverable";

    // Add header
    const header = document.createElement("thead");
    const headerRow = document.createElement("tr");
    keys.forEach(key => headerRow.insertAdjacentHTML("beforeend", `<th>${key}</th>`));
    header.appendChild(headerRow);
    table.appendChild(header);

    // Add body
    const body = document.createElement("tbody");
    for (let y = 0; y < data[keys[0]].length ; y++) {
        const bodyRow = document.createElement("tr");
        for (let x = 0; x < keys.length; x++) {
            bodyRow.insertAdjacentHTML("beforeend", `<td>${data[keys[x]][y]}</td>`);
        }
        body.appendChild(bodyRow);
    }
    table.appendChild(body);

    return table;
}

// TODO: Used the DOMParser as alternative to document.createElement. Check if the performance is not significantly worse
// TODO: Not very legible -- should be edited
export function getAuditRecord(auditRecord) {
    return new DOMParser().parseFromString(`
        <div class="notification">
            <p class="mb-3"><strong>${languageHelper.getTranslation(auditRecord.type)}</strong></p>
            <p>${languageHelper.getTranslation("timestamp")}: <strong>${auditRecord.date.toLocaleString()}</strong></p>
            ${auditRecord.formOID && auditRecord.studyEventOID ? "<p>" + languageHelper.getTranslation("form") + ": <strong>" + auditRecord.studyEventDescription + ", " + auditRecord.formDescription + "</strong></p>": ""}
            ${auditRecord.dataStatus ? "<p>" + languageHelper.getTranslation("data-status") + ": <strong>" + languageHelper.getTranslation(auditRecord.dataStatus) + "</strong></p>": ""}
            ${auditRecord.userOID ? "<p>" + languageHelper.getTranslation("user") + ": <strong>" + auditRecord.userName + "</strong></p>": ""}
            ${auditRecord.siteOID ? "<p>" + languageHelper.getTranslation("site") + ": <strong>" + auditRecord.siteName + "</strong></p>": ""}
            ${auditRecord.dataChanges && auditRecord.dataChanges.length ? "<div class='text-divider is-size-7 mt-3 mb-1'>" + languageHelper.getTranslation("changed-data") + "</div>" : ""}
            ${auditRecord.dataChanges && auditRecord.dataChanges.length ? "<p class='is-size-7'>" + auditRecord.dataChanges.map(item => item.translatedQuestion + " <b>" + (item.localizedValue || languageHelper.getTranslation("removed")) + "</b>").join("<br>") + "</p>" : ""}
            ${auditRecord.formOID ? "<button class='button is-small mt-4'>" + languageHelper.getTranslation("view-data") + "</button>" : ""}
        </div>
    `, "text/html").body.firstChild;
}
