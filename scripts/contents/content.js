(function (global, document) {

    const setInterval = global.setInterval;
    const clearInterval = global.clearInterval;

    var app = {

        viewIssueSidebar: null,

        selectedTicket: {
            type: '',
            number: '',
            summary: '',
            description: ''
        },

        options: {

            commitMessageBox: {
                divModuleId: 'commitmessagegeneratormodule',
                visible: false,
                collapsed: false,
                format: ''
            },

            branchNameBox: {
                divModuleId: 'branchnamegeneratormodule',
                visible: false,
                collapsed: false,
                format: ''
            }

        },

        init: function () {

            let isInitInProgress = false;

            const intervalDomChanges = setInterval(function () {

                if (document.getElementById('viewissuesidebar') && (!document.getElementById(app.options.commitMessageBox.divModuleId) || !document.getElementById(app.options.branchNameBox.divModuleId)) && !isInitInProgress) {

                    isInitInProgress = true;

                    app.viewIssueSidebar = document.getElementById('viewissuesidebar');

                    chrome.storage.sync.get(['commitMessageBoxVisible', 'branchNameBoxVisible', 'isCommitMessageDivCollapsed', 'isBranchNameDivCollapsed', 'commitMessageFormat', 'branchNameFormat'], function (result) {

                        // Set options
                        app.options.commitMessageBox.visible = result.commitMessageBoxVisible;
                        app.options.commitMessageBox.collapsed = result.isCommitMessageDivCollapsed;
                        app.options.commitMessageBox.format = result.commitMessageFormat;
                        app.options.branchNameBox.visible = result.branchNameBoxVisible;
                        app.options.branchNameBox.collapsed = result.isBranchNameDivCollapsed;
                        app.options.branchNameBox.format = result.branchNameFormat;

                        // Wait for the UI elements load
                        const intervalData = setInterval(function () {

                            let ticketNumberElement = document.getElementById('key-val');
                            let ticketTypeElement = document.getElementById('type-val');
                            let ticketSummaryElement = document.getElementById('summary-val');

                            if (!ticketNumberElement || !ticketTypeElement || !ticketSummaryElement) return;

                            clearInterval(intervalData);

                            app.selectedTicket.type = ticketTypeElement.textContent.trim().toLowerCase();
                            app.selectedTicket.number = ticketNumberElement.textContent.trim();
                            app.selectedTicket.summary = ticketSummaryElement.textContent.trim();

                            // Ordering is backwards
                            if (app.options.branchNameBox.visible) {
                                app.branchNameBox().init();
                            }

                            if (app.options.commitMessageBox.visible) {
                                app.commitMessageBox().init();
                            }

                            isInitInProgress = false;

                        }, 500);

                    });

                }

            }, 1000);

        },

        commitMessageBox: function () {

            const public = {};

            let commitMessage = '';

            // UI elements
            public.divModule = null;
            let titleHeader;
            let textAreaCommitMessage;
            let buttonCopyToClipboard;
            let buttonReset;
            let spanCharacterCount;

            public.init = function () {

                createUi();
                updateCharacterCount();
                setEventHandlers();
                setData();

            };

            function createUi() {

                public.divModule = document.createElement('div');
                public.divModule.id = app.options.commitMessageBox.divModuleId;
                public.divModule.className = 'module toggle-wrap' + (app.options.commitMessageBox.collapsed ? ' collapsed' : '');

                let divHeader = document.createElement('div');
                divHeader.id = 'commitmessagegenerator_heading';
                divHeader.className = 'mod-header';

                titleHeader = document.createElement('h2');
                titleHeader.id = 'cm-title-header-commit-message';
                titleHeader.className = 'toggle-title';
                titleHeader.appendChild(document.createTextNode('Commit Message'));

                let divContent = document.createElement('div');
                divContent.className = 'mod-content';
                divContent.style.marginBottom = '20px';

                let ulItemDetails = document.createElement('ul');
                ulItemDetails.className = 'item-details';

                let li0 = document.createElement('li');

                textAreaCommitMessage = document.createElement('textarea');
                textAreaCommitMessage.id = 'cm-textarea-commit-message';
                textAreaCommitMessage.className = 'cm-input';
                textAreaCommitMessage.setAttribute('rows', '6');
                textAreaCommitMessage.setAttribute('placeholder', 'Loading...');

                let li1 = document.createElement('li');
                li1.style.marginTop = '0';

                spanCharacterCount = document.createElement('span');

                let spanButtonContainer = document.createElement('span');
                spanButtonContainer.style.float = 'right';

                buttonCopyToClipboard = document.createElement('a');
                buttonCopyToClipboard.id = 'cm-button-copy-to-clipboard-commit-message';
                buttonCopyToClipboard.className = 'switcher-item cm-a-button';
                buttonCopyToClipboard.appendChild(document.createTextNode('Copy'));

                buttonReset = document.createElement('a');
                buttonReset.id = 'cm-button-reset-commit-message';
                buttonReset.className = 'switcher-item cm-a-button';
                buttonReset.appendChild(document.createTextNode('Reset'));

                divHeader.appendChild(titleHeader);
                li0.appendChild(textAreaCommitMessage);
                spanButtonContainer.appendChild(buttonCopyToClipboard);
                spanButtonContainer.appendChild(buttonReset);
                li1.appendChild(spanCharacterCount);
                li1.appendChild(spanButtonContainer);
                ulItemDetails.appendChild(li0);
                ulItemDetails.appendChild(li1);
                divContent.appendChild(ulItemDetails);
                public.divModule.appendChild(divHeader);
                public.divModule.appendChild(divContent);

                app.viewIssueSidebar.insertBefore(public.divModule, app.viewIssueSidebar.firstChild);

            }

            function setEventHandlers() {

                titleHeader.addEventListener('click', function () {
                    // Set collapsed status
                    let isCollapsed = !public.divModule.className.includes('collapsed');
                    chrome.storage.sync.set({ isCommitMessageDivCollapsed: isCollapsed }, function () { });
                });

                textAreaCommitMessage.addEventListener('keyup', function () {
                    commitMessage = textAreaCommitMessage.value;
                    updateCharacterCount();
                });

                buttonReset.addEventListener('click', function () {
                    setData();
                });

                buttonCopyToClipboard.addEventListener('click', function () {
                    global.CopyToClipboard(commitMessage);
                });

            }

            function setData() {

                commitMessage = global.GetFormattedCommitMessage(app.options.commitMessageBox.format, app.selectedTicket);
                textAreaCommitMessage.value = commitMessage;
                updateCharacterCount();

            }

            function updateCharacterCount() {

                spanCharacterCount.innerHTML = 'Character count: ' + (commitMessage ? commitMessage.length : '0');

            }

            return public;
        },

        branchNameBox: function () {

            const public = {};

            let branchName = '';

            // UI elements
            public.divModule = null;
            let titleHeader;
            let inputBranchName;
            let buttonCopyToClipboard;
            let buttonReset;
            let spanCharacterCount;

            public.init = function () {

                createUi();
                updateCharacterCount();
                setEventHandlers();
                setData();

            };

            function createUi() {

                public.divModule = document.createElement('div');
                public.divModule.id = app.options.branchNameBox.divModuleId;
                public.divModule.className = 'module toggle-wrap' + (app.options.branchNameBox.collapsed ? ' collapsed' : '');
                public.divModule.style.padding = '0';
                public.divModule.style.margin = '0';

                let divHeader = document.createElement('div');
                divHeader.id = 'branchnamegenerator_heading';
                divHeader.className = 'mod-header';

                titleHeader = document.createElement('h2');
                titleHeader.id = 'cm-title-header-branch-name';
                titleHeader.className = 'toggle-title';
                titleHeader.appendChild(document.createTextNode('Branch Name'));

                let divContent = document.createElement('div');
                divContent.className = 'mod-content';
                divContent.style.marginBottom = '20px';

                let ulItemDetails = document.createElement('ul');
                ulItemDetails.className = 'item-details';

                let li0 = document.createElement('li');

                inputBranchName = document.createElement('input');
                inputBranchName.id = 'cm-input-branch-name';
                inputBranchName.className = 'cm-input';
                inputBranchName.setAttribute('type', 'text');
                inputBranchName.setAttribute('placeholder', 'Loading...');

                let li1 = document.createElement('li');

                spanCharacterCount = document.createElement('span');

                let spanButtonContainer = document.createElement('span');
                spanButtonContainer.style.float = 'right';

                buttonCopyToClipboard = document.createElement('a');
                buttonCopyToClipboard.id = 'cm-button-copy-to-clipboard-branch-name';
                buttonCopyToClipboard.className = 'switcher-item cm-a-button';
                buttonCopyToClipboard.appendChild(document.createTextNode('Copy'));

                buttonReset = document.createElement('a');
                buttonReset.id = 'cm-button-reset-branch-name';
                buttonReset.className = 'switcher-item cm-a-button';
                buttonReset.appendChild(document.createTextNode('Reset'));

                divHeader.appendChild(titleHeader);
                li0.appendChild(inputBranchName);
                spanButtonContainer.appendChild(buttonCopyToClipboard);
                spanButtonContainer.appendChild(buttonReset);
                li1.appendChild(spanCharacterCount);
                li1.appendChild(spanButtonContainer);
                ulItemDetails.appendChild(li0);
                ulItemDetails.appendChild(li1);
                divContent.appendChild(ulItemDetails);
                public.divModule.appendChild(divHeader);
                public.divModule.appendChild(divContent);

                app.viewIssueSidebar.insertBefore(public.divModule, app.viewIssueSidebar.firstChild);

            }

            function setEventHandlers() {

                titleHeader.addEventListener('click', function () {
                    // Set collapsed status
                    let isCollapsed = !public.divModule.className.includes('collapsed');
                    chrome.storage.sync.set({ isBranchNameDivCollapsed: isCollapsed }, function () { });
                });

                inputBranchName.addEventListener('keyup', function () {
                    branchName = inputBranchName.value;
                    updateCharacterCount();
                });

                buttonReset.addEventListener('click', function () {
                    setData();
                });

                buttonCopyToClipboard.addEventListener('click', function () {
                    global.CopyToClipboard(branchName);
                });

            }

            function setData() {

                branchName = global.GetFormattedCommitMessage(app.options.branchNameBox.format, app.selectedTicket);
                inputBranchName.value = branchName;
                updateCharacterCount();

            }

            function updateCharacterCount() {

                spanCharacterCount.innerHTML = 'Character count: ' + (branchName ? branchName.length : '0');

            }

            return public;
        }

    };

    app.init();

}(window, document));