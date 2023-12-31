# Reminders CLI

A script for interacting with the macOS Reminders app through the command-line interface.

## How to Run

Clone the repository then run the following command in the terminal:

```bash
osascript -l JavaScript <path-to-reminders.js>
```

Replace `<path-to-reminders.js>` with the actual path to your `reminders.js` file.


Consider creating an alias to simplify usage:
```bash
alias rem='osascript -l JavaScript <path-to-reminders.js>'
```

## Usage

### Listing Reminders
- `rem ls`: Lists all reminders from the default 'reminders' list.
- `rem ls -t <target-list>`: Shows reminders from the specified list named 'target-list'.
- `rem ls list`: Lists all reminder lists.

### Adding Reminders
- `rem add <reminder>`: Adds a reminder to the default 'reminders' list.
- `rem add -t <target-list> <reminder>`: Adds a reminder to the specified 'target-list'.

### Completing Reminders
- `rem check <index>`: marks the specified reminder from the default 'reminders' list as completed.
- `rem check -t <target-list> <index>`: marks the specified reminder from 'target-list' as completed.

### Help
- `rem help`: lists all of the available commands.
