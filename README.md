![alt text][overviewlogo] Issue Tracker Dev Tools
=============================
The tool blends into the issue/bug tracker UI and automatically generates a commit message and/or a branch name with a predefined format using the ticket values in the issue tracker.

**!!! Please note that it only supports JIRA currently.**

### How To Install
1. Simply install from Chrome Web Store
	<br /><a href="https://chrome.google.com/webstore/detail/issue-tracker-dev-tools/lkmlhcgmkdoljddcbbmchekijkfllmfk" target="_blank">![alt text][chromestorelogo]</a>
1. Install as an unpackaged extension:
	- Download or clone the project as ZIP.
	- Unzip it.
	- Go to **[chrome://extensions](chrome://extensions)** in your Google Chrome browser.
	- Enable "Developer mode" by clicking the slider on top right corner.
	- Click "Load unpacked" and browse for the unzipped folder.

### How To Use
You will see 2 boxes by default on the ticket page of your issue/bug tracker. These are "Commit Message" and "Branch Name" boxes. They will contain auto-generated texts (commit message & branch name) that are generated by the predefined formats. 
<br /><br />
![alt text][ssjira0]
<br />

To edit the formats, simply open the options page of the extension by clicking the extension icon near the address bar of your browser. There you will see the following page:
<br /><br />
![alt text][ssoptions0]

### Supported Tags

Tag | Description
------------ | -------------
`{TICKET_TYPE}` | Ticket type (bug, improvement, story etc.)
`{TICKET_NUMBER}` | Ticket number (ex. ABCDEF-123)
`{TICKET_SUMMARY}` | Ticket summary (the title)
`{TICKET_ASSIGNEE}` | Ticket assignee
`{TICKET_PRIORITY}` | Ticket priority (major, minor, blocker etc.)
`{TICKET_STORYPOINTS}` | Story points of the ticket
`{TICKET_DESCRIPTION}` | Ticket long description.
`{NEWLINE}` | New line character like `\n` or `<br/>`
`{UPPERCASE}` | Start uppercasing
`{/UPPERCASE}` | Stop uppercasing
`{LOWERCASE}` | Start lowercasing
`{/LOWERCASE}` | Stop lowercasing


### Sample Formats
##### For commit message:
```
Format:
	{LOWERCASE}{TICKET_TYPE}{/LOWERCASE}({UPPERCASE}{TICKET_NUMBER}{/UPPERCASE}): {TICKET_SUMMARY}{NEWLINE}{NEWLINE}
Preview:
	type(ABCDEF-123): This is the ticket summary
    
    
```
##### For branch name:
```
Format:
	{LOWERCASE}{TICKET_TYPE}{/LOWERCASE}/{UPPERCASE}{TICKET_NUMBER}{/UPPERCASE}-
Preview:
	type/ABCDEF-123-
```

[overviewlogo]: https://github.com/nihatcanco/issue-tracker-dev-tools/blob/master/images/icon24.png?raw=true
[chromestorelogo]: https://developer.chrome.com/webstore/images/ChromeWebStore_Badge_v2_206x58.png
[ssjira0]: https://github.com/nihatcanco/issue-tracker-dev-tools/blob/master/screenshots/ssjira0.png?raw=true
[ssoptions0]: https://github.com/nihatcanco/issue-tracker-dev-tools/blob/master/screenshots/ssoptions0.PNG?raw=true
