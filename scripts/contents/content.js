(function (global) {

    const document = global.document;
    const setInterval = global.setInterval;
    const clearInterval = global.clearInterval;

    var isInitInProgress = false;
    var commitMessage = '';
    var divModuleId = 'commitmessagegeneratormodule';

    // UI elements
    var viewIssueSidebar;
    var divModule;
    var titleHeader;
    var textAreaCommitMessage;
    var buttonCopyToClipboard;
    var buttonReset;
    var spanCharacterCount;

    function init() {

        isInitInProgress = true;

        const intervalInit = setInterval(function () {

            viewIssueSidebar = document.getElementById('viewissuesidebar');

            if (!viewIssueSidebar) return;

            clearInterval(intervalInit);

            chrome.storage.sync.get(['isCommitMessageDivCollapsed'], function (result) {

                createUi(result.isCommitMessageDivCollapsed);
                updateCharacterCount();
                setEventListeners();
                setData();

                isInitInProgress = false;

            });

        }, 500);
    }

    function createUi(isCollapsed) {

        divModule = document.createElement('div');
        divModule.id = divModuleId;
        divModule.className = 'module toggle-wrap' + (isCollapsed ? ' collapsed' : '');

        let divHeader = document.createElement('div');
        divHeader.id = 'commitmessagegenerator_heading';
        divHeader.className = 'mod-header';

        titleHeader = document.createElement('h2');
        titleHeader.id = 'cm-title-header';
        titleHeader.className = 'toggle-title';
        titleHeader.appendChild(document.createTextNode('Commit Message'));

        let divContent = document.createElement('div');
        divContent.className = 'mod-content';
        divContent.style.marginBottom = '20px';

        let ulItemDetails = document.createElement('ul');
        ulItemDetails.className = 'item-details';

        let li0 = document.createElement('li');

        textAreaCommitMessage = document.createElement('textarea');
        textAreaCommitMessage.style.width = '98%';
        textAreaCommitMessage.style.resize = 'vertical';
        textAreaCommitMessage.style.fontFamily = 'inherit';
        textAreaCommitMessage.setAttribute('rows', '6');
        textAreaCommitMessage.setAttribute('placeholder', 'Did this, did that etc...');

        let li1 = document.createElement('li');
        li1.style.marginTop = '0 !important';

        spanCharacterCount = document.createElement('span');

        buttonReset = document.createElement('span');
        buttonReset.id = 'cm-button-refresh';
        buttonReset.style.float = 'right';
        buttonReset.style.cursor = 'pointer';
        buttonReset.appendChild(document.createTextNode('Reset'));

        let li2 = document.createElement('li');

        buttonCopyToClipboard = document.createElement('button');
        buttonCopyToClipboard.style.width = '100%';
        buttonCopyToClipboard.style.padding = '10px';
        buttonCopyToClipboard.style.background = '#f5f5f5';
        buttonCopyToClipboard.style.border = '1px solid #ccc';
        buttonCopyToClipboard.style.cursor = 'pointer';
        buttonCopyToClipboard.appendChild(document.createTextNode('Copy To Clipboard'));

        divHeader.appendChild(titleHeader);
        li0.appendChild(textAreaCommitMessage);
        li1.appendChild(spanCharacterCount);
        li1.appendChild(buttonReset);
        li2.appendChild(buttonCopyToClipboard);
        ulItemDetails.appendChild(li0);
        ulItemDetails.appendChild(li1);
        ulItemDetails.appendChild(li2);
        divContent.appendChild(ulItemDetails);
        divModule.appendChild(divHeader);
        divModule.appendChild(divContent);
        viewIssueSidebar.insertBefore(divModule, viewIssueSidebar.firstChild);

    }

    function setEventListeners() {

        titleHeader.addEventListener('click', function () {
            // Set collapsed status
            let isCollapsed = !divModule.className.includes('collapsed');
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
            copyToClipboard(commitMessage);
        });

    }

    function setData() {

        const intervalData = setInterval(function () {

            let ticketNumberElement = document.getElementById('key-val');
            let ticketTypeElement = document.getElementById('type-val');
            let ticketSummaryElement = document.getElementById('summary-val');

            if (!ticketNumberElement || !ticketTypeElement || !ticketSummaryElement) return;

            clearInterval(intervalData);

            let ticketNumber = ticketNumberElement.textContent.trim();
            let ticketType = ticketTypeElement.textContent.trim().toLowerCase();
            let ticketSummary = ticketSummaryElement.textContent.trim();

            commitMessage = ticketType + '(' + ticketNumber + '): ' + ticketSummary + '\n\n';
            textAreaCommitMessage.value = commitMessage;
            updateCharacterCount();

        }, 500);

    }

    function updateCharacterCount() {

        spanCharacterCount.innerHTML = 'Character count: ' + (commitMessage ? commitMessage.length : '0');

    }

    function copyToClipboard(text) {

        text = text.trim();

        let textareaElement = document.createElement('textarea');
        textareaElement.value = text;
        document.body.appendChild(textareaElement);
        textareaElement.select();
        document.execCommand('copy');
        document.body.removeChild(textareaElement);

    };

    // Start initialization interval
    const intervalDomChanges = setInterval(function () {

        if (!document.getElementById(divModuleId) && !isInitInProgress)
            init();

    }, 1000);

}(window));