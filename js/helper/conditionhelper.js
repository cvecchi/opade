import { Parser } from "../../lib/expr-eval.js";

const $ = query => document.querySelector(query);
const $$ = query => document.querySelectorAll(query);

let conditions = {};
let variableValues = {};

export function getVariables(conditionsParam) {
    conditions = conditionsParam;

    let variables = new Set();
    for (let condition of conditions) {
        const normalizedExpression = escapeOIDDots(normalizeTokens(condition.formalExpression));
        condition.expression = new Parser.parse(normalizedExpression);
        condition.expression.variables().forEach(variable => variables.add(unescapeOIDDots(variable)));
    }

    return Array.from(variables);
}

export function process(variableValuesParam) {
    // Expr-eval does not support dots in variables names and are therefore replaced with underscores
    variableValues = {};
    for (const [key, value] of Object.entries(variableValuesParam)) {
        variableValues[escapeOIDDots(key)] = value;
    }

    for (const condition of conditions) {
        // Select conditional item group or item and hide it
        let conditionalElement;
        if (condition.type == "itemgroup") conditionalElement = $(`[item-group-content-oid="${condition.oid}"]`);
        else if (condition.type == "item") conditionalElement = $(`[item-field-oid="${condition.oid}"]`);
        conditionalElement.hide();

        // If the expression evaluates to true, show condition element
        if (condition.expression.evaluate(variableValues)) conditionalElement.show();

        // Add event listeners to respond to inputs to the determinant items
        for (const inputOID of condition.expression.variables()) {
            const inputElement = $(`[item-oid="${unescapeOIDDots(inputOID)}"]`);
            if (!inputElement) continue;
            if (inputElement.getAttribute("type") == "text" || inputElement.getAttribute("type") == "select") {
                inputElement.addEventListener("input", event => respondToInputChange(event.target, inputOID, condition, conditionalElement));
            } else if (inputElement.getAttribute("type") == "radio") {
                const radioItems = $$(`[item-oid="${inputOID}"]`);
                for (const radioItem of radioItems) {
                    radioItem.addEventListener("input", event => respondToInputChange(event.target, inputOID, condition, conditionalElement));
                }
            }
        }
    }
}

function respondToInputChange(input, inputOID, condition, conditionalElement) {
    variableValues[inputOID] = !input.value ? "" : input.value;
    showOrHideConditionalElement(conditionalElement, condition.expression.evaluate(variableValues));
}

function showOrHideConditionalElement(conditionalElement, show) {
    if (show) {
        conditionalElement.show();
    } else {
        conditionalElement.hide();
        emptyConditionalElement(conditionalElement);
    }
}

function emptyConditionalElement(conditionalElement) {
    // For performance purposes, only send one radio input event for a group of radio buttons
    let lastRadioItemOID;

    const inputElements = conditionalElement.querySelectorAll("[item-oid]");
    for (const inputElement of inputElements) {
        if (inputElement.getAttribute("type") == "text" || inputElement.getAttribute("type") == "textarea" || inputElement.getAttribute("type") == "date") {
            inputElement.value = "";
            inputElement.dispatchEvent(new Event("input"));
        } else if (inputElement.getAttribute("type") == "select") {
            inputElement.selectedIndex = 0;
            inputElement.dispatchEvent(new Event("input"));
        } else if (inputElement.getAttribute("type") == "radio") {
            inputElement.checked = false;
            const itemOID = inputElement.getAttribute("item-oid");
            if (itemOID != lastRadioItemOID) {
                const event = new Event("input");
                Object.defineProperty(event, "target", { value: "", enumerable: true });
                inputElement.dispatchEvent(event);
                lastRadioItemOID = itemOID;
            }
        }
    }
}

function normalizeTokens(expression) {
    return expression.replace(/( AND | OR | && | \|\ )/g, function(string) {
        switch (string) {
            case " AND ": return " and ";
            case " OR ": return " or ";
            case " && ": return " and ";
            case " || ": return " or ";
        }
    });
}

function escapeOIDDots(expression) {
    return expression.replace(/\w+\.\d+\S*/g, function(string) {
        return string.replace(/\./g, "_");
    });
}

function unescapeOIDDots(expression) {
    return expression.replace(/\w+\_\d+\S*/g, function(string) {
        return string.replace(/\_/g, ".");
    });
}
