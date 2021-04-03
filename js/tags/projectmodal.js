class ProjectModal extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div class="modal" id="project-modal">
                <div class="modal-background" onclick="hideProjectModal()"></div>
                <div class="modal-content is-large">
                    <div class="box">
                        <div class="tabs is-centered" id="project-tabs">
                            <ul>
                                <li class="is-active" id="general-options-tab" onclick="projectTabClicked(event)"><a i18n="general-options"></a></li>
                                <li id="users-options-tab" onclick="projectTabClicked(event)"><a i18n="users"></a></li>
                                <li id="sites-options-tab" onclick="projectTabClicked(event)"><a i18n="sites"></a></li>
                                <li id="name-description-tab" onclick="projectTabClicked(event)"><a i18n="name-and-description"></a></li>
                            </ul>
                        </div>
                        <div class="width-is-three-quarters" id="general-options">
                            <div class="notification is-link is-light" id="connect-to-server-option">
                                <h1 class="title is-4" i18n="connect-to-server"></h1>
                                <p class="mb-5 is-hidden" id="server-connected-hint"><strong i18n="connected-hint"></strong></p>
                                <p i18n="connection-hint"></p>
                                <div class="field has-addons mt-5 mb-0">
                                    <div class="control is-expanded">
                                        <input class="input is-small" id="server-url-input" type="text" i18n-ph="server-url">
                                    </div>
                                    <div class="control">
                                        <a class="button is-link is-small" onclick="connectToServer()" i18n="connect"></a>
                                    </div>
                                </div>
                                <form class="is-hidden" id="initialize-server-form">
                                    <p class="mt-5 mb-5"><strong i18n="new-account-hint"></strong></p>
                                    <input class="input is-small mb-3" id="owner-username-input" type="text" autocomplete="username" i18n-ph="username">
                                    <input class="input is-small mb-3" id="owner-password-input" type="password" autocomplete="new-password" i18n-ph="password">
                                    <input class="input is-small mb-5" id="owner-confirm-password-input" type="password" autocomplete="new-password" i18n-ph="password-confirm">
                                    <button class="button is-link is-small" onclick="initializeServer(event)" i18n="create-user"></button>
                                </form>
                            </div>
                            <div class="notification is-link is-light">
                                <h1 class="title is-4" i18n="encrypt-data"></h1>
                                <p class="mb-5 is-hidden" id="data-encrypted-hint"><strong i18n="enrypted-hint"></strong></p>
                                <p i18n="encryption-hint"></p>
                                <p class="mt-5" id="data-encryption-warning"><strong i18n="encryption-warning"></strong></p>
                                <form>
                                    <input class="is-hidden" autocomplete="username">
                                    <div class="field has-addons mt-5 mb-0">
                                        <div class="control is-expanded">
                                            <input class="input is-small" id="encryption-password-input" type="password" autocomplete="new-password" i18n-ph="password">
                                        </div>
                                        <div class="control">
                                            <a class="button is-link is-small" onclick="encryptData()" i18n="encrypt"></a>
                                        </div>
                                    </div>
                                    <div class="field has-addons mt-3 is-hidden">
                                        <div class="control is-expanded">
                                            <input class="input is-small" id="confirm-encryption-password-input" type="password" autocomplete="new-password" i18n-ph="password-confirm">
                                        </div>
                                        <div class="control">
                                            <a class="button is-link is-small" onclick="encryptData()" i18n="confirm"></a>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div class="notification is-link is-light">
                                <h1 class="title is-4" i18n="survey-code"></h1>
                                <p class="mb-5" i18n-html="survey-code-hint"></p>
                                <div class="field has-addons">
                                    <div class="control is-expanded">
                                        <input class="input is-small" id="survey-code-input" type="text" i18n-ph="survey-code">
                                    </div>
                                    <div class="control">
                                        <a class="button is-link is-small" onclick="setSurveyCode()" i18n="confirm"></a>
                                    </div>
                                </div>
                            </div>
                            <div class="notification is-link is-light">
                                <h1 class="title is-4" i18n="miscellaneous-options"></h1>
                                <p class="mb-5" i18n="miscellaneous-options-hint"></p>
                                <label class="checkbox mb-1">
                                    <input type="checkbox" id="text-as-textarea-checkbox" oninput="miscOptionClicked(event)">
                                    <span i18n="textarea-hint"></span>
                                </label>
                                <label class="checkbox">
                                    <input type="checkbox" id="auto-survey-view-checkbox" oninput="miscOptionClicked(event)">
                                    <span i18n="survey-view-hint"></span>
                                </label>
                            </div>
                            <div class="notification is-link is-light">
                                <h1 class="title is-4" i18n="export-data"></h1>
                                <p class="mb-5" i18n="export-data-hint"></p>
                                <div class="buttons">
                                    <button class="button is-link is-small" onclick="downloadODM()" i18n="download-odm-complete"></button>
                                    <button class="button is-small" onclick="downloadODMMetadata()" i18n="download-odm-metadata"></button>
                                    <button class="button is-small" onclick="downloadCSV()" i18n="download-csv"></button>
                                </div>
                            </div>
                            <div class="notification is-danger is-light">
                                <h1 class="title is-4" i18n="remove-data"></h1>
                                <p class="mb-5" i18n="remove-data-hint"></p>
                                <p class="mb-5"><strong i18n="remove-data-warning"></strong></p>
                                <div class="buttons">
                                    <button class="button is-danger is-small mr-5" onclick="showRemoveDataModal(true)" i18n="remove-data-complete"></button>
                                    <button class="button is-danger is-small" onclick="showRemoveDataModal()" i18n="remove-data-clinicaldata"></button>
                                    <div class="file is-hidden" id="odm-upload-to-server">
                                        <label class="file-label">
                                            <input class="file-input" type="file" name="resume" onchange="uploadODMToServer()">
                                            <span class="file-cta button is-danger is-small">
                                                <span class="file-label" i18n="upload-odm"></span>
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="width-is-three-quarters is-hidden" id="users-options">
                            <div class="notification is-link is-light">
                                <h1 class="title is-4" i18n="users"></h1>
                                <p i18n="users-hint"></p>
                            </div>
                            <div class="columns">
                                <div class="column">
                                    <nav class="panel">
                                        <div class="panel-block has-text-centered has-text-grey-light" id="no-users-hint">
                                            <p i18n="no-users-hint"></p>
                                        </div>
                                        <div class="panel-block" id="add-user-button">
                                            <button class="button is-link is-light is-fullwidth" onclick="addUser()" i18n="add-user" disabled></button>
                                        </div>
                                    </nav>
                                </div>
                                <div class="column">
                                    <div class="field">
                                        <label class="label" i18n="first-name"></label>
                                        <input class="input" id="user-first-name-input" type="text">
                                    </div>
                                    <div class="field">
                                        <label class="label" i18n="last-name"></label>
                                        <input class="input" id="user-last-name-input" type="text">
                                    </div>
                                    <div class="field">
                                        <label class="label" i18n="site"></label>
                                        <div class="control" id="user-site-control"></div>
                                    </div>
                                    <hr>
                                    <div class="field">
                                        <label class="label" i18n="username"></label>
                                        <input class="input" id="user-username-input" type="text">
                                    </div>
                                    <div class="field">
                                        <label class="label" i18n="initial-password"></label>
                                        <input class="input" id="user-password-input" type="text">
                                    </div>
                                    <hr>
                                    <div class="field" id="user-rights">
                                        <label class="label" i18n="user-rights"></label>
                                    </div>
                                    <div class="buttons">
                                        <button class="button is-link" id="user-save-button" onclick="saveUser()" i18n="save"></button>
                                        <button class="button is-danger" id="user-remove-button" onclick="removeUser()" i18n="remove"></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="width-is-three-quarters is-hidden" id="sites-options">
                            <div class="notification is-link is-light">
                                <h1 class="title is-4" i18n="sites"></h1>
                                <p i18n="sites-hint"></p>
                            </div>
                            <div class="columns">
                                <div class="column">
                                    <nav class="panel">
                                        <div class="panel-block has-text-centered has-text-grey-light" id="no-sites-hint">
                                            <p i18n="no-sites-hint"></p>
                                        </div>
                                        <div class="panel-block" id="add-site-button">
                                            <button class="button is-link is-light is-fullwidth" onclick="addSite()" i18n="add-site"></button>
                                        </div>
                                    </nav>
                                </div>
                                <div class="column">
                                    <div class="field">
                                        <label class="label" i18n="name"></label>
                                        <input class="input" id="site-name-input" type="text">
                                    </div>
                                    <div class="buttons">
                                        <button class="button is-link" id="site-save-button" onclick="saveSite()" i18n="save"></button>
                                        <button class="button is-danger" id="site-remove-button" onclick="removeSite()" i18n="remove"></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="width-is-three-quarters is-hidden" id="name-description">
                            <div class="notification is-link is-light">
                                <h1 class="title is-4" i18n="name-and-description"></h1>
                                <p i18n="name-and-description-hint"></p>
                            </div>
                            <div class="field">
                                <label class="label" i18n="study-name"></label>
                                <input class="input" id="study-name-input" type="text">
                            </div>
                            <div class="field">
                                <label class="label" i18n="study-description"></label>
                                <textarea class="textarea" id="study-description-textarea"></textarea>
                            </div>
                            <div class="field">
                                <label class="label" i18n="protocol-name"></label>
                                <input class="input" id="protocol-name-input" type="text">
                            </div>
                            <div class="buttons">
                                <button class="button is-link" id="save-global-variables-button" onclick="saveStudyNameDescription()" i18n="save-changes"></button>
                                <button class="button" id="cancel-global-variables-button" onclick="hideProjectModal()" i18n="cancel"></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

window.customElements.define("project-modal", ProjectModal);
