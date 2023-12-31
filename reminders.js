#!/usr/bin/env osascript -l JavaScript reminders.js

const RemindersApp = Application('Reminders');

function chooseAddOption(args) {
  if (args.length > 1) {
    if (args[1] === '-t') {
      addReminderToList(args[2], args.slice(3).join(' '));
    } else {
      addReminder(args.slice(1).join(' '))
    }
  } else {
    console.log('Please provide a reminder text to add')
  }
}

function chooseLsOption(args) {
  if (args.length > 1) {
    if (args[1] === '-t') {
      showRemindersFromList(args.slice(2).join(' '));
    } else if (args[1] === 'lists') {
      showLists()
    } else {
      console.log("That is not a valid argument")
    }
  } else {
    showReminders()
  }
}

function chooseCheckOption(args) {
  if (args.length > 1) {
    if (args[1] === '-t') {
      checkReminderFromList(args[2], args.slice(3).join(' '));
    } else {
      checkReminderFromList('Reminders', args.slice(1).join(' '))
    }
  } else {
    console.log('Please provide the number of the reminder to complete')
  }
}

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

function showReminders() {
  const reminders = RemindersApp.defaultList.reminders();

  if (reminders.length === 0) {
    console.log("No reminders found")
  } else {
    console.log("Reminders:")
    const reminderNames = RemindersApp.defaultList.reminders.name()
    const reminderStatuses = RemindersApp.defaultList.reminders.completed()

    for (let i = 0; i < reminders.length; i++) {
      if(reminderStatuses[i] == false){
        console.log(`${i}: ${reminderNames[i]}`);
      }
    }
  }
}

function showRemindersFromList(listName) {
  const reminderList = RemindersApp.lists.whose({ name: listName });

  if(reminderList.length === 0) {
    console.log(`There is no ${listName} list`)
    return;
  }
  const reminderNames = RemindersApp.lists.whose({ name: listName })[0].reminders.name();
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

function addReminder(name) {
  reminder = RemindersApp.Reminder({name: name, dueDate: createNextDayMorningDate()});
  RemindersApp.defaultList.reminders.push(reminder);
  console.log(`Added reminder '${name}'`)
}

function addReminderToList(listName, name) {
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

function checkReminderFromList(listName, index) {
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
  console.log("Reminders terminal interface:");
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
    console.log("Please provide an argument: 'add' to add a reminder or 'ls' to display all reminders");
    return;
  }
  switch (args[0]) {
    case 'add':
      chooseAddOption(args)
      break;
    case 'ls':
      chooseLsOption(args)
      break;
    case 'check':
      chooseCheckOption(args)
      break;
    case 'help':
    case 'h':
      displayHelp()
      break;
    default:
      console.log("Invalid argument. Use 'add' to add a reminder or 'ls' to display all reminders");
      break;
  }
}
