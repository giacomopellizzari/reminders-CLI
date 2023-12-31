#!/usr/bin/env osascript -l JavaScript reminders.js

const RemindersApp = Application('Reminders');

function showLists() {
  const reminderList = RemindersApp.lists.name();

  if(reminderList.length === 0) {
    console.log(`There are no lists`)
    return;
  }

  console.log("Reminder lists:")
  for (let i = 0; i < reminderList.length; i++) {
    console.log(`- ${reminderList[i]}`);
  }
}

function showReminders(listName = 'Reminders') {
  const reminderList = RemindersApp.lists.whose({ name: listName });

  if(reminderList.length === 0) {
    console.log(`There is no ${listName} list`)
    return;
  }

  const reminderNames = RemindersApp.lists.whose({ name: listName })[0].reminders.name();
  if (reminderNames.length === 0) {
    console.log(`List ${listName} is empty`)
    return;
  }
  const reminderStatuses = RemindersApp.lists.whose({ name: listName })[0].reminders.completed()

  for (let i = 0; i < reminderNames.length; i++) {
    if(reminderStatuses[i] == false){
      console.log(`${i}: ${reminderNames[i]}`);
    }
  }
}

function createNextDayMorningDate() {
  const newDate = new Date();
  newDate.setDate(newDate.getDate() + 1);
  newDate.setHours(8, 0, 0, 0);
  return newDate
}

function addReminderToList(listName, name) {
  if(!name) {
    console.log("Please provide a reminder text to add")
    return;
  }
  console.log(`List: ${listName}`)
  console.log(`Reminder: ${name}`)

  const targetList = RemindersApp.lists.whose({ name: listName })[0];
  if(targetList.length === 0) {
    console.log(`There is no ${listName} list`)
    return;
  }

  reminder = RemindersApp.Reminder({name: name, dueDate: createNextDayMorningDate()});
  targetList.reminders.push(reminder);
  console.log(`Added reminder '${name}' to list '${listName}'`)
}

function markReminderAsComplete(listName, index) {
  if( !index ) {
    console.log("Please provide the index of the reminder you would like to complete")
    return;
  }
  console.log(`List: ${listName}`)
  console.log(`Reminder index: ${index}`)

  const targetList = RemindersApp.lists.whose({ name: listName })[0];
  if(targetList.length === 0) {
    console.log(`There is no ${listName} list`)
    return;
  }
  
  reminders = targetList.reminders()

  if (index >= 0 && index < reminders.length) {
    const reminder = reminders[index];
    reminder.completed = true;
    console.log(`Marked reminder '${reminder.name()}' from list '${listName}' as complete.`);
  } else {
    console.log('Reminder index out of range or invalid.');
  }
}

function displayHelp() {
  console.log("Reminders CLI interface:");
  console.log("rem add <name>                   --> add a reminder <name> to the default list");
  console.log("rem add -t <list_name> <name>    --> add a reminder <name> in the list <list_name>");
  console.log("rem ls lists                     --> show lists of reminders");
  console.log("rem ls                           --> show reminders in the default list");
  console.log("rem ls -t <list_name>            --> show reminders of the list named <list_name>");
  console.log("rem check -t <list_name> <index> --> mark reminder as completed");
  console.log("rem help                         --> get help")
}

function run(args) {
  if (args.length === 0) {
    console.log("Please provide an argument: 'add' to add a reminder, 'ls' to display reminders, 'check' to mark a reminder as complete, or 'help'");
    return;
  }
  const [command, option1, option2] = args;
  switch (command) {
    case 'add':
      if (option1 === '-t') {
        addReminderToList(option2, args.slice(3).join(' '));
      } else {
        addReminderToList('Reminders', args.slice(1).join(' '));
      }
      break;
    case 'ls':
      if (option1 === 'lists') {
        showLists();
      } else if (option1 === '-t') {
        showReminders(option2);
      } else {
        showReminders();
      }
      break;
    case 'check':
      if (option1 === '-t') {
        markReminderAsComplete(option2, args[3]);
      } else {
        markReminderAsComplete('Reminders', args[1]);
      }
      break;
    case 'help':
    case 'h':
      displayHelp()
      break;
    default:
      console.log("Invalid argument.");
      break;
  }
}
