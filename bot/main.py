import os
import re
import telebot
import pymongo
import time
import datetime
from datetime import date
from pymongo import MongoClient
from dotenv import load_dotenv
from telebot.types import InlineKeyboardMarkup, InlineKeyboardButton
from fuzzywuzzy import fuzz
from apscheduler.schedulers.background import BackgroundScheduler
from flask import Flask, request

load_dotenv()
cluster = MongoClient(os.getenv("MDB_CONNECT"))
db = cluster["Moments"]
users = db["users"]
events = db["events"]
journals = db["journalentries"]
TOKEN = os.getenv("API_KEY")
bot = telebot.TeleBot(os.getenv("API_KEY"))
scheduler = BackgroundScheduler()
scheduler.start()
server = Flask(__name__)

def add_event_markup():
    markup = InlineKeyboardMarkup()
    markup.row_width = 2
    markup.add(InlineKeyboardButton("Yes", callback_data="add_yes"),
               InlineKeyboardButton("No", callback_data="add_no"))
    return markup


def edit_event_markup():
    markup = InlineKeyboardMarkup()
    markup.row_width = 2
    markup.add(InlineKeyboardButton("Yes", callback_data="edit_yes"),
               InlineKeyboardButton("No", callback_data="edit_no"))
    return markup


def delete_event_markup():
    markup = InlineKeyboardMarkup()
    markup.row_width = 2
    markup.add(InlineKeyboardButton("Yes", callback_data="delete_yes"),
               InlineKeyboardButton("No", callback_data="delete_no"))
    return markup


def edit_event_confirm_markup():
    markup = InlineKeyboardMarkup()
    markup.row_width = 2
    markup.add(InlineKeyboardButton("Yes", callback_data="edit_confirm_yes"),
               InlineKeyboardButton("No", callback_data="edit_confirm_no"))
    return markup


def add_remind_markup():
    markup = InlineKeyboardMarkup()
    markup.row_width = 2
    markup.add(InlineKeyboardButton("No Reminder", callback_data="add_remind_none"),
               InlineKeyboardButton(
                   "One day before", callback_data="add_remind_one_day"),
               InlineKeyboardButton(
                   "Two days before", callback_data="add_remind_two_days"),
               InlineKeyboardButton("One week before", callback_data="add_remind_one_week"))
    return markup


def edit_remind_markup():
    markup = InlineKeyboardMarkup()
    markup.row_width = 2
    markup.add(InlineKeyboardButton("No Reminder", callback_data="edit_remind_none"),
               InlineKeyboardButton(
                   "One day before", callback_data="edit_remind_one_day"),
               InlineKeyboardButton(
                   "Two days before", callback_data="edit_remind_two_days"),
               InlineKeyboardButton("One week before", callback_data="edit_remind_one_week"))
    return markup


def add_journal_markup():
    markup = InlineKeyboardMarkup()
    markup.row_width = 2
    markup.add(InlineKeyboardButton("Yes", callback_data="add_journal_yes"),
               InlineKeyboardButton("No", callback_data="add_journal_no"))
    return markup


def delete_journal_markup():
    markup = InlineKeyboardMarkup()
    markup.row_width = 2
    markup.add(InlineKeyboardButton("Yes", callback_data="delete_journal_yes"),
               InlineKeyboardButton("No", callback_data="delete_journal_no"))
    return markup


@bot.callback_query_handler(func=lambda call: True)
def query(call):
    if call.data == "add_yes":
        event = event_dict[call.from_user.id]
        existingUser = users.find_one({"chat_id": call.from_user.id})
        bot.edit_message_reply_markup(
            call.message.chat.id, call.message.message_id, reply_markup=None)
        set_reminders(event.message)
        delattr(event, "message")
        event.authorId = str(existingUser["_id"])
        insertedEvent = events.insert_one(event.__dict__)
        setattr(event, "id", insertedEvent.inserted_id)
        set_reminder(call.message, event)
        bot.answer_callback_query(call.id, "Event added successfully")
    elif call.data == "add_no":
        bot.answer_callback_query(call.id, "Event add failed")
        bot.edit_message_reply_markup(
            call.message.chat.id, call.message.message_id, reply_markup=None)
    elif call.data == "add_remind_none":
        event = event_dict[call.from_user.id]
        event.reminder = "No reminder"
        bot.edit_message_reply_markup(
            call.message.chat.id, call.message.message_id, reply_markup=None)
        add_confirm_step(event.message)
    elif call.data == "add_remind_one_day":
        event = event_dict[call.from_user.id]
        event.reminder = "Remind me one day before"
        bot.edit_message_reply_markup(
            call.message.chat.id, call.message.message_id, reply_markup=None)
        add_confirm_step(event.message)
    elif call.data == "add_remind_two_days":
        event = event_dict[call.from_user.id]
        event.reminder = "Remind me two days before"
        bot.edit_message_reply_markup(
            call.message.chat.id, call.message.message_id, reply_markup=None)
        add_confirm_step(event.message)
    elif call.data == "add_remind_one_week":
        event = event_dict[call.from_user.id]
        event.reminder = "Remind me one week before"
        bot.edit_message_reply_markup(
            call.message.chat.id, call.message.message_id, reply_markup=None)
        add_confirm_step(event.message)
    elif call.data == "edit_yes":
        event = event_dict[0]
        bot.edit_message_reply_markup(
            call.message.chat.id, call.message.message_id, reply_markup=None)
        edit_event_step(event.message)
    elif call.data == "edit_no":
        event = event_dict[0]
        bot.edit_message_reply_markup(
            call.message.chat.id, call.message.message_id, reply_markup=None)
        edit_title_step(event.message)
    elif call.data == "edit_remind_none":
        event = event_dict[call.from_user.id]
        event.reminder = "No reminder"
        bot.edit_message_reply_markup(
            call.message.chat.id, call.message.message_id, reply_markup=None)
        edit_confirm_step(event.message)
    elif call.data == "edit_remind_one_day":
        event = event_dict[call.from_user.id]
        event.reminder = "Remind me one day before"
        bot.edit_message_reply_markup(
            call.message.chat.id, call.message.message_id, reply_markup=None)
        edit_confirm_step(event.message)
    elif call.data == "edit_remind_two_days":
        event = event_dict[call.from_user.id]
        event.reminder = "Remind me two days before"
        bot.edit_message_reply_markup(
            call.message.chat.id, call.message.message_id, reply_markup=None)
        edit_confirm_step(event.message)
    elif call.data == "edit_remind_one_week":
        event = event_dict[call.from_user.id]
        event.reminder = "Remind me one week before"
        bot.edit_message_reply_markup(
            call.message.chat.id, call.message.message_id, reply_markup=None)
        edit_confirm_step(event.message)
    elif call.data == "edit_confirm_yes":
        oldEvent = event_dict[1]
        event = event_dict[call.from_user.id]
        setattr(event, "id", oldEvent["_id"])
        events.update_one({"_id": oldEvent["_id"]}, {
            "$set": {"title": event.title, "start": event.start, "end": event.end, "reminder": event.reminder}})
        reschedule_reminder(event)
        bot.edit_message_reply_markup(
            call.message.chat.id, call.message.message_id, reply_markup=None)
        bot.answer_callback_query(call.id, "Event edited successfully")
    elif call.data == "edit_confirm_no":
        bot.edit_message_reply_markup(
            call.message.chat.id, call.message.message_id, reply_markup=None)
        bot.answer_callback_query(call.id, "Edit Event failed")
    elif call.data == "delete_yes":
        event = event_dict[1]
        events.delete_one({"_id": event["_id"]})
        scheduler.remove_job(str(event["_id"]))
        bot.edit_message_reply_markup(
            call.message.chat.id, call.message.message_id, reply_markup=None)
        bot.answer_callback_query(call.id, "Success! Event deleted.")
    elif call.data == "delete_no":
        bot.edit_message_reply_markup(
            call.message.chat.id, call.message.message_id, reply_markup=None)
        bot.answer_callback_query(call.id, "Event delete failed.")
    elif call.data == "add_journal_yes":
        journal = journal_dict[call.from_user.id]
        existingUser = users.find_one({"chat_id": call.from_user.id})
        bot.edit_message_reply_markup(
            call.message.chat.id, call.message.message_id, reply_markup=None)
        delattr(journal, "message")
        journal.user_id = str(existingUser["_id"])
        journals.insert_one(journal.__dict__)
        bot.answer_callback_query(call.id, "Journal added successfully")
    elif call.data == "add_journal_no":
        bot.edit_message_reply_markup(
            call.message.chat.id, call.message.message_id, reply_markup=None)
        bot.answer_callback_query(call.id, "Journal add failed")
    elif call.data == "delete_journal_yes":
        journal = journal_dict[1]
        journals.delete_one({"_id": journal["_id"]})
        bot.edit_message_reply_markup(
            call.message.chat.id, call.message.message_id, reply_markup=None)
        bot.answer_callback_query(call.id, "Success! Event deleted.")
    elif call.data == "delete_journal_no":
        bot.edit_message_reply_markup(
            call.message.chat.id, call.message.message_id, reply_markup=None)
        bot.answer_callback_query(call.id, "Event delete failed.")


def checklink(message):
    linkedUser = users.find_one({"chat_id": message.chat.id})
    if (not linkedUser):
        bot.send_message(
            message.chat.id, "Please log into your Moments account and connect to MomentsBot")
        raise TypeError


def check_date(message, dateStr):
    dateArray = dateStr.split("-")
    year = int(dateArray[0])
    month = int(dateArray[1])
    day = int(dateArray[2])
    if (year > 2050 or year < 2000):
        bot.send_message(
            message.chat.id, "Please enter a valid year between 2000 - 2050. Please try again.")
        return False
    elif (month < 1 or month > 12):
        bot.send_message(
            message.chat.id, "Please enter a valid month. Please try again.")
        return False
    else:
        if (month == 1 or month == 3 or month == 5 or month == 7 or month == 8 or month == 10 or month == 12):
            if (day < 0 or day > 31):
                bot.send_message(
                    message.chat.id, "Please enter a valid day. Please try again.")
                return False
        elif (month == 2):
            if (day < 0 or day > 28):
                bot.send_message(
                    message.chat.id, "Please enter a valid day. Please try again.")
                return False
        elif (month == 4 or month == 6 or month == 9 or month == 11):
            if (day < 0 or day > 30):
                bot.send_message(
                    message.chat.id, "Please enter a valid day. Please try again.")
                return False
    return True


def check_time(message, timeStr):
    timeArray = timeStr.split(":")
    hour = int(timeArray[0])
    minute = int(timeArray[1])
    if (hour > 24 or hour < 0):
        bot.send_message(
            message.chat.id, "Please enter a valid time. Please try again.")
        return False
    elif (minute > 60 or minute < 0):
        bot.send_message(
            message.chat.id, "Please enter a valid time. Please try again.")
        return False
    else:
        return True


def send_reminder(message, event):
    startStr = event["start"].replace("T", " ")
    startStr = ":".join(startStr.split(":", 2)[:2])
    endStr = event["end"].replace("T", " ")
    endStr = ":".join(endStr.split(":", 2)[:2])
    info = "<b>Reminder:</b> " + \
        event["title"] + "\n<b>Start:</b> " + \
        startStr + "\n<b>End:</b> " + endStr + "\n\n"
    bot.send_message(message.chat.id, info, parse_mode="HTML")


def set_reminders(message):
    linkedUser = users.find_one({"chat_id": message.chat.id})
    userEvents = list(events.find({"authorId": str(linkedUser["_id"])}))
    for event in userEvents:
        if (event["reminder"] != "No reminder"):
            year = int(event["start"][0:4])
            month = int(event["start"][5:7])
            day = int(event["start"][8:10])
            reminderDate = datetime.datetime(year, month, day, 9)
            if (event["reminder"] == "Remind me one day before"):
                reminderDate -= datetime.timedelta(days=1)
            elif (event["reminder"] == "Remind me two days before"):
                reminderDate -= datetime.timedelta(days=2)
            elif (event["reminder"] == "Remind me one week before"):
                reminderDate -= datetime.timedelta(days=7)
            if (reminderDate > datetime.datetime.now()):
                scheduler.add_job(send_reminder, 'date', run_date=str(
                    reminderDate), args=(message, event), id=str(event["_id"]))


def set_reminder(message, event):
    if (event.reminder != "No reminder"):
        dateArray = event.start.split(" ")
        resArray = dateArray[0].split("-")
        year = int(resArray[0])
        month = int(resArray[1])
        day = int(resArray[2])
        reminderDate = datetime.datetime(year, month, day, 9)
        if (event.reminder == "Remind me one day before"):
            reminderDate -= datetime.timedelta(days=1)
        elif (event.reminder == "Remind me two days before"):
            reminderDate -= datetime.timedelta(days=2)
        elif (event.reminder == "Remind me one week before"):
            reminderDate -= datetime.timedelta(days=7)
        if (reminderDate > datetime.datetime.now()):
            scheduler.add_job(send_reminder, 'date', run_date=str(
                reminderDate), args=(message, event), id=str(event.id))


def reschedule_reminder(event):
    if (event.reminder != "No reminder"):
        dateArray = event.start.split(" ")
        resArray = dateArray[0].split("-")
        year = int(resArray[0])
        month = int(resArray[1])
        day = int(resArray[2])
        reminderDate = datetime.datetime(year, month, day, 9)
        if (event.reminder == "Remind me one day before"):
            reminderDate -= datetime.timedelta(days=1)
        elif (event.reminder == "Remind me two days before"):
            reminderDate -= datetime.timedelta(days=2)
        elif (event.reminder == "Remind me one week before"):
            reminderDate -= datetime.timedelta(days=7)
        if (reminderDate > datetime.datetime.now()):
            scheduler.reschedule_job(str(event.id), run_date=str(
                reminderDate))


@bot.message_handler(commands=["cancel"])
def cancel(message, command=None):
    if (command):
        bot.send_message(message.chat.id, "The command " + f"{command}" + " has been cancelled. Anything else I can do for you?" +
                         "\n\nSend /help for a list of commands.")
    else:
        bot.send_message(
            message.chat.id, "No active command to cancel. I wasn't doing anything anyway.")


@bot.message_handler(commands=["start"])
def start(message):
    if (message.text == "/start"):
        bot.send_message(
            message.chat.id, "Please log into your Moments account and connect to MomentsBot")
    else:
        uniqCode = message.text.split()[1]
        existingUser = users.find_one({"teleCode": uniqCode})
        if (existingUser):
            users.update_one({"teleCode": uniqCode}, {
                "$set": {"chat_id": message.chat.id}})
            set_reminders(message)
            bot.send_message(
                message.chat.id, "Success! Your Moments account has been successfully\nlinked to your tele handle /help")
        else:
            bot.send_message(
                message.chat.id, "Error: Please try to relogin and reattempt the linking")


@bot.message_handler(commands=["help"])
def help(message):
    try:
        checklink(message)
        info = ("I can help you view, delete, and add journals and events\n"
                "which automatically syncs to your Moments account.\n\n"
                "You can control me by sending these commands:\n\n"
                "/cancel - cancel the current operation\n\n"
                "<b>Event settings</b>\n"
                "/addevent - add an event\n"
                "/editevent - edit a specified event\n"
                "/deleteevent - delete a specified event\n"
                "/viewevents - view events for a specified time period\n\n"
                "<b>Journal settings</b>\n"
                "/addjournal - add a journal\n"
                "/deletejournal - delete a specified journal\n"
                "/viewjournal - view a specified journal\n\n"
                )
        bot.send_message(message.chat.id, info, parse_mode="HTML")
    except:
        return


class Event:
    def __init__(self, title):
        self.title = title
        self.start = None
        self.end = None
        self.reminder = None
        self.message = None

event_dict = {}


class Journal:
    def __init__(self, date):
        self.date = date
        self.title = None
        self.entry = None
        self.message = None


journal_dict = {}


@bot.message_handler(commands=["addevent"])
def addevent(message):
    try:
        checklink(message)
        msg = bot.send_message(message.chat.id, "Please key in a title")
        bot.register_next_step_handler(msg, add_title_step)
    except:
        return


def add_title_step(message):
    if (message.text == "/cancel"):
        cancel(message, "addevent")
    else:
        title = message.text
        event_dict[message.chat.id] = Event(title)
        event = event_dict[message.chat.id]
        event.message = message
        msg = bot.reply_to(
            event.message, "How about the event's starting date? Please enter with the following format YYYY-MM-DD HH:MM. Keying in time is optional. Take note of the space between the date and time.")
        bot.register_next_step_handler(msg, add_start_step)


def add_start_step(message):
    if (message.text == "/cancel"):
        cancel(message, "addevent")
    else:
        start_pattern = r"^\d{4}-\d{2}-\d{2}$"
        start_pattern_two = r"^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$"
        start = message.text
        event = event_dict[message.chat.id]
        if (re.match(start_pattern, start)):
            if (check_date(message, start)):
                event.start = start
                event.message = message
                msg = bot.reply_to(
                    event.message, "How about the event's ending date? Please enter with the following format YYYY-MM-DD HH:MM. Keying in time is optional. Take note of the space between the date and time.")
                bot.register_next_step_handler(msg, add_end_step)
            else:
                add_title_step(event.message)
        elif (re.match(start_pattern_two, start)):
            bigArray = start.split(" ")
            if (check_date(message, bigArray[0]) and check_time(message, bigArray[1])):
                event.start = bigArray[0] + "T" + bigArray[1]
                event.message = message
                msg = bot.reply_to(
                    event.message, "How about the event's ending date? Please enter with the following format YYYY-MM-DD HH:MM. Keying in time is optional. Take note of the space between the date and time.")
                bot.register_next_step_handler(msg, add_end_step)
            else:
                add_title_step(event.message)
        else:
            bot.send_message(
                message.chat.id, "Follow the date format closely. Please try again")
            add_title_step(event.message)


def add_end_step(message):
    if (message.text == "/cancel"):
        cancel(message, "addevent")
    else:
        end_pattern = r"^\d{4}-\d{2}-\d{2}$"
        end_pattern_two = r"^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$"
        end = message.text
        event = event_dict[message.chat.id]
        if (re.match(end_pattern, end)):
            if (check_date(message, end)):
                event.end = end
                event.message = message
                bot.send_message(message.chat.id, "Set a reminder?",
                                 reply_markup=add_remind_markup())
            else:
                add_start_step(event.message)
        elif (re.match(end_pattern_two, end)):
            bigArray = end.split(" ")
            if (check_date(message, bigArray[0]) and check_time(message, bigArray[1])):
                event.end = bigArray[0] + "T" + bigArray[1]
                event.message = message
                bot.send_message(message.chat.id, "Set a reminder?",
                                 reply_markup=add_remind_markup())
            else:
                add_start_step(event.message)
        else:
            bot.send_message(
                message.chat.id, "Follow the date format closely. Please try again.")
            add_start_step(event.message)


def add_confirm_step(message):
    if (message.text == "/cancel"):
        cancel(message, "addevent")
    else:
        event = event_dict[message.chat.id]
        startStr = event.start.replace("T", " ")
        endStr = event.end.replace("T", " ")
        bot.send_message(message.chat.id, "<b>Event:</b>\n" + "Title: " + event.title +
                         "\nStart: " + startStr + "\nEnd: " + endStr + "\n" + event.reminder + "\nConfirm?", parse_mode="HTML", reply_markup=add_event_markup())


@bot.message_handler(commands=["editevent"])
def editevent(message):
    try:
        checklink(message)
        msg = bot.send_message(
            message.chat.id, "Please key in the title of the event you wish to edit")
        bot.register_next_step_handler(msg, edit_title_step)
    except:
        return


def edit_title_step(message):
    if (message.text == "/cancel"):
        cancel(message, "editevent")
    else:
        title = message.text
        existingUser = users.find_one({"chat_id": message.chat.id})
        bot.send_chat_action(message.chat.id, 'typing')
        time.sleep(1)
        userEvents = list(events.find({"authorId": str(existingUser["_id"])}))
        # Need to consider too many events.
        possibleEvents = []
        if (userEvents):
            for event in userEvents:
                if (fuzz.ratio(title.lower(), event["title"].lower()) > 60):
                    possibleEvents.append(event)
            if (possibleEvents):
                event_dict[message.chat.id] = possibleEvents
                event = Event(title)
                event_dict[0] = event
                event.message = message
                info = ""
                for i in range(len(possibleEvents)):
                    startStr = str(
                        possibleEvents[i]["start"]).replace("T", " ")
                    startStr = ":".join(startStr.split(":", 2)[:2])
                    endStr = str(possibleEvents[i]["end"]).replace("T", " ")
                    endStr = ":".join(endStr.split(":", 2)[:2])
                    info += f"<b>{str(i + 1)}</b>" + "\nTitle: " + str(
                        possibleEvents[i]["title"]) + "\nStart: " + startStr + "\nEnd: " + endStr + "\n" + str(possibleEvents[i]["reminder"]) + "\n\n"
                msg = bot.reply_to(message, info +
                                   "Here are all the events with a similar title to the one you specified. Please key in the number <b>(in bold)</b> of the event you wish to edit", parse_mode="HTML")
                bot.register_next_step_handler(msg, edit_index_step)
            else:
                bot.send_message(
                    message.chat.id, "There are no events with a similar title. Try again? /editevent")
        else:
            bot.send_message(
                message.chat.id, "You have no events currently. Add an event? /addevent")


def edit_index_step(message):
    if (message.text == "/cancel"):
        cancel(message, "editevent")
    else:
        eventsList = event_dict[message.chat.id]
        event = event_dict[0]
        index = int(message.text) - 1
        try:
            specifiedEvent = event_dict[message.chat.id][index - 1]
            event_dict[1] = specifiedEvent
            startStr = str(specifiedEvent["start"]).replace("T", " ")
            startStr = ":".join(startStr.split(":", 2)[:2])
            endStr = str(specifiedEvent["end"]).replace("T", " ")
            endStr = ":".join(endStr.split(":", 2)[:2])
            info = "Title: " + str(specifiedEvent["title"]) + "\nStart: " + \
                startStr + "\nEnd: " + endStr + "\n" + \
                str(specifiedEvent["reminder"])
            bot.reply_to(message, info + "\n\nIs this the event you wish to edit? Confirm?",
                         reply_markup=edit_event_markup())
            # Maybe ask which fields of the event you wish to edit
        except:
            bot.reply_to(message, "Invalid number. Please try again.")
            edit_title_step(event.message)


def edit_event_step(message):
    if (message.text == "/cancel"):
        cancel(message, "editevent")
    else:
        msg = bot.send_message(
            message.chat.id, "Please key in a new title. Send a \"skip\" if you do not wish to change the title.")
        bot.register_next_step_handler(msg, edit_new_title_step)


def edit_new_title_step(message):
    if (message.text == "/cancel"):
        cancel(message, "editevent")
    else:
        title = message.text
        if (title == "skip"):
            event_dict[message.chat.id] = Event(event_dict[1]["title"])
        else:
            event_dict[message.chat.id] = Event(title)
        event = event_dict[message.chat.id]
        event.message = message
        msg = bot.reply_to(
            event.message, "How about changing the event's starting date? Please enter with the following format YYYY-MM-DD HH:MM. Keying in time is optional. Take note of the space between the date and time. Send a \"skip\" if you do not wish to change the starting time")
        bot.register_next_step_handler(msg, edit_start_step)


def edit_start_step(message):
    if (message.text == "/cancel"):
        cancel(message, "editevent")
    else:
        start_pattern = r"^\d{4}-\d{2}-\d{2}$"
        start_pattern_two = r"^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$"
        start = message.text
        event = event_dict[message.chat.id]
        if (start == "skip"):
            event.start = event_dict[1]["start"]
            event.message = message
            msg = bot.reply_to(
                event.message, "How about changing the event's ending date? Please enter with the following format YYYY-MM-DD HH:MM. Keying in time is optional. Take note of the space between the date and time. Send a \"skip\" if you do not wish to change the title")
            bot.register_next_step_handler(msg, edit_end_step)
        elif (re.match(start_pattern, start)):
            if (check_date(message, start)):
                event.start = start
                event.message = message
                msg = bot.reply_to(
                    event.message, "How about changing the event's ending date? Please enter with the following format YYYY-MM-DD HH:MM. Keying in time is optional. Take note of the space between the date and time. Send a \"skip\" if you do not wish to change the title")
                bot.register_next_step_handler(msg, edit_end_step)
            else:
                edit_new_title_step(event.message)
        elif (re.match(start_pattern_two, start)):
            bigArray = start.split(" ")
            if (check_date(message, bigArray[0]) and check_time(message, bigArray[1])):
                event.start = bigArray[0] + "T" + bigArray[1]
                event.message = message
                msg = bot.reply_to(
                    event.message, "How about changing the event's ending date? Please enter with the following format YYYY-MM-DD HH:MM. Keying in time is optional. Take note of the space between the date and time. Send a \"skip\" if you do not wish to change the title")
                bot.register_next_step_handler(msg, edit_end_step)
            else:
                edit_new_title_step(event.message)
        else:
            bot.send_message(
                message.chat.id, "Follow the date format closely. Please try again")
            edit_new_title_step(event.message)


def edit_end_step(message):
    if (message.text == "/cancel"):
        cancel(message, "editevent")
    else:
        end_pattern = r"^\d{4}-\d{2}-\d{2}$"
        end_pattern_two = r"^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$"
        end = message.text
        event = event_dict[message.chat.id]
        oldEvent = event_dict[1]
        if (end == "skip"):
            event.end = event_dict[1]["end"]
            event.message = message
            bot.reply_to(event.message, "Change the reminder?",
                         reply_markup=edit_remind_markup())
        elif (re.match(end_pattern, end)):
            if (check_date(message, end)):
                event.end = end
                event.message = message
                bot.reply_to(event.message, "Change the reminder?",
                             reply_markup=edit_remind_markup())
            else:
                edit_start_step(event.message)
        elif (re.match(end_pattern_two, end)):
            bigArray = end.split(" ")
            if (check_date(message, bigArray[0]) and check_time(message, bigArray[1])):
                event.end = bigArray[0] + "T" + bigArray[1]
                event.message = message
                bot.reply_to(event.message, "Change the reminder?",
                             reply_markup=edit_remind_markup())
            else:
                edit_start_step(event.message)
        else:
            bot.send_message(
                message.chat.id, "Follow the date format closely. Please try again.")
            edit_start_step(event.message)


def edit_confirm_step(message):
    if (message.text == "/cancel"):
        cancel(message, "editevent")
    else:
        event = event_dict[message.chat.id]
        oldEvent = event_dict[1]
        startStr = event.start.replace("T", " ")
        endStr = event.end.replace("T", " ")
        startStr = ":".join(startStr.split(":", 2)[:2])
        endStr = ":".join(endStr.split(":", 2)[:2])
        oldStartStr = oldEvent["start"].replace("T", " ")
        oldEndStr = oldEvent["end"].replace("T", " ")
        oldStartStr = ":".join(oldStartStr.split(":", 2)[:2])
        oldEndStr = ":".join(oldEndStr.split(":", 2)[:2])
        bot.send_message(message.chat.id, "<b>Editing Event:</b>\n" + "Title: " + oldEvent["title"] + "\nStart: " + oldStartStr + "\nEnd: " + oldEndStr + "\n" + oldEvent["reminder"] +
                         "\n\n<b>Edited Event:</b>\n" + "Title: " + event.title +
                         "\nStart: " + startStr + "\nEnd: " + endStr + "\n" + event.reminder + "\n\nConfirm your changes?", parse_mode="HTML", reply_markup=edit_event_confirm_markup())


@bot.message_handler(commands=["deleteevent"])
def deleteevent(message):
    try:
        checklink(message)
        msg = bot.send_message(
            message.chat.id, "Please key in the title of the event you wish to delete")
        bot.register_next_step_handler(msg, delete_title_step)
    except:
        return


def delete_title_step(message):
    if (message.text == "/cancel"):
        cancel(message, "deleteevent")
    else:
        title = message.text
        existingUser = users.find_one({"chat_id": message.chat.id})
        bot.send_chat_action(message.chat.id, 'typing')
        time.sleep(1)
        userEvents = list(events.find({"authorId": str(existingUser["_id"])}))
        possibleEvents = []
        if (userEvents):
            for event in userEvents:
                if (fuzz.ratio(title.lower(), event["title"].lower()) > 60):
                    possibleEvents.append(event)
            if (possibleEvents):
                event_dict[message.chat.id] = possibleEvents
                event = Event(title)
                event_dict[0] = event
                event.message = message
                info = ""
                for i in range(len(possibleEvents)):
                    startStr = str(
                        possibleEvents[i]["start"]).replace("T", " ")
                    startStr = ":".join(startStr.split(":", 2)[:2])
                    endStr = str(possibleEvents[i]["end"]).replace("T", " ")
                    endStr = ":".join(endStr.split(":", 2)[:2])
                    info += f"<b>{str(i + 1)}</b>" + "\nTitle: " + str(
                        possibleEvents[i]["title"]) + "\nStart: " + startStr + "\nEnd: " + endStr + "\n" + str(possibleEvents[i]["reminder"]) + "\n\n"
                msg = bot.reply_to(message, info +
                                   "Here are all the events with a similar title to the one you specified. Please key in the number <b>(in bold)</b> of the event you wish to delete", parse_mode="HTML")
                bot.register_next_step_handler(msg, delete_index_step)
            else:
                bot.send_message(
                    message.chat.id, "There are no events with a similar title. Try again? /deleteevent")
        else:
            bot.send_message(
                message.chat.id, "You have no events currently. Add an event? /addevent")


def delete_index_step(message):
    if (message.text == "/cancel"):
        cancel(message, "deleteevent")
    else:
        eventsList = event_dict[message.chat.id]
        event = event_dict[0]
        index = int(message.text) - 1
        try:
            specifiedEvent = eventsList[index - 1]
            event_dict[1] = specifiedEvent
            startStr = str(specifiedEvent["start"]).replace("T", " ")
            startStr = ":".join(startStr.split(":", 2)[:2])
            endStr = str(specifiedEvent["end"]).replace("T", " ")
            endStr = ":".join(endStr.split(":", 2)[:2])
            info = "Title: " + str(specifiedEvent["title"]) + "\nStart: " + \
                startStr + "\nEnd: " + endStr + "\n" + \
                str(specifiedEvent["reminder"])
            bot.reply_to(message, info + "\n\nIs this the event you wish to delete? Confirm?",
                         reply_markup=delete_event_markup())
        except:
            bot.reply_to(message, "Invalid number. Please try again.")
            delete_title_step(event.message)


@bot.message_handler(commands=["viewevents"])
def viewevents(message):
    try:
        checklink(message)
        event_dict[message.chat.id] = Event("View")
        event_dict[message.chat.id].message = message
        msg = bot.send_message(
            message.chat.id, "Please key in a starting time from when you wish to view events. Please enter with format YYYY-MM-DD HH:MM. Keying in time is optional. Take note of the space between the date and time.")
        bot.register_next_step_handler(msg, view_start_step)
    except:
        return


def view_start_step(message):
    if (message.text == "/cancel"):
        cancel(message, "viewevents")
    else:
        start_pattern = r"^\d{4}-\d{2}-\d{2}$"
        start_pattern_two = r"^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$"
        start = message.text
        event = event_dict[message.chat.id]
        if (re.match(start_pattern, start)):
            if (check_date(message, start)):
                event.start = start
                event.message = message
                msg = bot.reply_to(
                    event.message, "Please key in an ending time from when you wish to view events. Please enter with the following format YYYY-MM-DD HH:MM. Keying in time is optional. Take note of the space between the date and time.")
                bot.register_next_step_handler(msg, view_end_step)
            else:
                viewevents(event.message)
        elif (re.match(start_pattern_two, start)):
            bigArray = start.split(" ")
            if (check_date(message, bigArray[0]) and check_time(message, bigArray[1])):
                event.start = bigArray[0] + "T" + bigArray[1]
                event.message = message
                msg = bot.reply_to(
                    event.message, "Please key in an ending time from when you wish to view events. Please enter with the following format YYYY-MM-DD HH:MM. Keying in time is optional. Take note of the space between the date and time.")
                bot.register_next_step_handler(msg, view_end_step)
            else:
                viewevents(event.message)
        else:
            bot.send_message(
                message.chat.id, "Follow the date format closely. Please try again")
            viewevents(event.message)


def view_end_step(message):
    if (message.text == "/cancel"):
        cancel(message, "viewevents")
    else:
        end_pattern = r"^\d{4}-\d{2}-\d{2}$"
        end_pattern_two = r"^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$"
        event = event_dict[message.chat.id]
        end = message.text
        existingUser = users.find_one({"chat_id": message.chat.id})
        if (re.match(end_pattern, end)):
            if (check_date(message, end)):
                event.end = end
                event.message = message
                userEvents = list(events.find({"authorId": str(existingUser["_id"]), "end": {
                    "$lte": event.end}, "start": {"$gte": event.start}}))
                info = "<u><b>Events: </b></u>\n"
                if (userEvents):
                    for event in userEvents:
                        startStr = event["start"].replace("T", " ")
                        startStr = ":".join(startStr.split(":", 2)[:2])
                        endStr = event["end"].replace("T", " ")
                        endStr = ":".join(endStr.split(":", 2)[:2])
                        info += "<b>Title:</b> " + \
                            event["title"] + "\n<b>Start:</b> " + \
                                startStr + "\n<b>End:</b> " + endStr + "\n\n"
                    bot.send_message(message.chat.id, info, parse_mode="HTML")
                else:
                    bot.send_message(
                        message.chat.id, info + "No events between specified dates /viewevents", parse_mode="HTML")
            else:
                view_start_step(event.message)
        elif (re.match(end_pattern_two, end)):
            bigArray = end.split(" ")
            if (check_date(message, bigArray[0]) and check_time(message, bigArray[1])):
                event.end = bigArray[0] + "T" + bigArray[1]
                event.message = message
                userEvents = list(events.find({"authorId": str(existingUser["_id"]), "end": {
                    "$lte": event.end}, "start": {"$gte": event.start}}))
                info = "<u><b>Events: </b></u>\n"
                if (userEvents):
                    for event in userEvents:
                        startStr = event["start"].replace("T", " ")
                        startStr = ":".join(startStr.split(":", 2)[:2])
                        endStr = event["end"].replace("T", " ")
                        endStr = ":".join(endStr.split(":", 2)[:2])
                        info += "<b>Title:</b> " + \
                            event["title"] + "\n<b>Start:</b> " + \
                                startStr + "\n<b>End:</b> " + endStr + "\n\n"
                    bot.send_message(message.chat.id, info, parse_mode="HTML")
                else:
                    bot.send_message(
                        message.chat.id, info + "No events between specified dates /viewevents", parse_mode="HTML")
            else:
                view_start_step(event.message)
        else:
            bot.send_message(
                message.chat.id, "Follow the date format closely. Please try again.")
            view_start_step(event.message)


@bot.message_handler(commands=["addjournal"])
def addjournal(message):
    try:
        checklink(message)
        msg = bot.send_message(
            message.chat.id, "Please key in the journal's date? Please enter with the following format YYYY-MM-DD")
        bot.register_next_step_handler(msg, add_journal_date_step)
    except:
        return


def add_journal_date_step(message):
    if (message.text == "/cancel"):
        cancel(message, "addjournal")
    else:
        date_pattern = r"^\d{4}-\d{2}-\d{2}$"
        date = message.text
        if (re.match(date_pattern, date)):
            if (check_date(message, str(date))):
                dateArray = str(date).split("-")
                year = int(dateArray[0])
                month = int(dateArray[1])
                day = int(dateArray[2])
                journalDate = datetime.datetime(year, month, day)
                journal_dict[message.chat.id] = Journal(journalDate)
                journal = journal_dict[message.chat.id]
                journal.message = message
                msg = bot.reply_to(
                    journal.message, "How about the journal's title?")
                bot.register_next_step_handler(msg, add_journal_title_step)
            else:
                addjournal(message)
        else:
            bot.send_message(
                message.chat.id, "Follow the date format closely. Please try again")
            addjournal(message)


def add_journal_title_step(message):
    if (message.text == "/cancel"):
        cancel(message, "addjournal")
    else:
        title = message.text
        journal = journal_dict[message.chat.id]
        journal.title = title
        journal.message = message
        msg = bot.reply_to(
            journal.message, "How about noting something down in your journal? On telegram desktop, press shift + enter to go to the next line.")
        bot.register_next_step_handler(msg, add_journal_entry_step)


def add_journal_entry_step(message):
    if (message.text == "/cancel"):
        cancel(message, "addjournal")
    else:
        entry = message.text
        journal = journal_dict[message.chat.id]
        journal.entry = entry
        journal.message = message
        bot.send_message(message.chat.id, "<b>Journal:</b>\n" + "Title: " + journal.title +
                         "\nDate: " + str(journal.date).split(" ")[0] + "\nEntry: " + journal.entry + "\nConfirm?", parse_mode="HTML", reply_markup=add_journal_markup())


@bot.message_handler(commands=["deletejournal"])
def deletejournal(message):
    try:
        checklink(message)
        msg = bot.send_message(
            message.chat.id, "Please key in the date of the journal you wish to delete. Please enter with the following format YYYY-MM-DD")
        bot.register_next_step_handler(msg, delete_journal_date_step)
    except:
        return


def delete_journal_date_step(message):
    if (message.text == "/cancel"):
        cancel(message, "deletejournal")
    else:
        date = message.text
        dateArray = str(date).split("-")
        year = int(dateArray[0])
        month = int(dateArray[1])
        day = int(dateArray[2])
        journalDate = datetime.datetime(year, month, day)
        existingUser = users.find_one({"chat_id": message.chat.id})
        bot.send_chat_action(message.chat.id, 'typing')
        time.sleep(1)
        userJournals = list(journals.find(
            {"user_id": str(existingUser["_id"]), "date": journalDate}))
        if (userJournals):
            journal_dict[message.chat.id] = userJournals
            journal = Journal(date)
            journal_dict[0] = journal
            journal.message = message
            info = ""
            for i in range(len(userJournals)):
                info += f"<b>{str(i + 1)}</b>" + "\nTitle: " + str(userJournals[i]["title"]) + "\nDate: " + str(
                        userJournals[i]["date"]).split("T")[0] + "\nEntry: " + str(userJournals[i]["entry"]) + "\n\n"
            msg = bot.reply_to(message, info +
                               "Here are all the journals created on the date you specified. Please key in the number <b>(in bold)</b> of the journal you wish to delete", parse_mode="HTML")
            bot.register_next_step_handler(msg, delete_journal_index_step)
        else:
            bot.send_message(
                message.chat.id, "There are no journals on that date. Try again? /deletejournal")


def delete_journal_index_step(message):
    if (message.text == "/cancel"):
        cancel(message, "deletejournal")
    else:
        journalsList = journal_dict[message.chat.id]
        journal = journal_dict[0]
        index = int(message.text) - 1
        try:
            specifiedJournal = journalsList[index - 1]
            journal_dict[1] = specifiedJournal
            info = "Title: " + str(specifiedJournal["title"]) + "\nDate: " + str(
                specifiedJournal["date"]).split("T")[0] + "\nEntry: " + str(specifiedJournal["entry"])
            bot.reply_to(message, info + "\n\nIs this the event you wish to delete? Confirm?",
                         reply_markup=delete_journal_markup())
        except:
            bot.reply_to(message, "Invalid number. Please try again.")
            delete_title_step(journal.message)


@bot.message_handler(commands=["viewjournal"])
def viewjournal(message):
    try:
        checklink(message)
        journal_dict[message.chat.id] = Journal("View")
        journal_dict[message.chat.id].message = message
        msg = bot.send_message(
            message.chat.id, "Please key in a starting date from when you wish to view journals. Please enter with format YYYY-MM-DD")
        bot.register_next_step_handler(msg, view_journal_start_step)
    except:
        return


def view_journal_start_step(message):
    if (message.text == "/cancel"):
        cancel(message, "viewjournal")
    else:
        start_pattern = r"^\d{4}-\d{2}-\d{2}$"
        start = message.text
        journal = journal_dict[message.chat.id]
        if (re.match(start_pattern, start)):
            if (check_date(message, start)):
                dateArray = str(start).split("-")
                year = int(dateArray[0])
                month = int(dateArray[1])
                day = int(dateArray[2])
                journalDate = datetime.datetime(year, month, day)
                journal.start = journalDate
                journal.message = message
                msg = bot.reply_to(
                    journal.message, "Please key in an ending date from when you wish to view journals. Please enter with the following format YYYY-MM-DD ")
                bot.register_next_step_handler(msg, view_journal_end_step)
            else:
                viewjournal(journal.message)
        else:
            bot.send_message(
                message.chat.id, "Follow the date format closely. Please try again")
            viewjournal(journal.message)


def view_journal_end_step(message):
    if (message.text == "/cancel"):
        cancel(message, "viewjournal")
    else:
        end_pattern = r"^\d{4}-\d{2}-\d{2}$"
        journal = journal_dict[message.chat.id]
        end = message.text
        existingUser = users.find_one({"chat_id": message.chat.id})
        if (re.match(end_pattern, end)):
            if (check_date(message, end)):
                dateArray = str(end).split("-")
                year = int(dateArray[0])
                month = int(dateArray[1])
                day = int(dateArray[2])
                journalDate = datetime.datetime(year, month, day)
                journal.end = journalDate
                journal.message = message
                userJournals = list(journals.find({"user_id": str(existingUser["_id"]), "$and": [{
                    "date": {"$lte": journal.end}}, {"date": {"$gte": journal.start}}]}))
                if (userJournals):
                    info = "<u><b>Journals: </b></u>\n"
                    for journal in userJournals:
                        info += "<b>Title:</b> " + \
                            journal["title"] + "\n<b>Date:</b> " + \
                                str(journal["date"]).split(" ")[
                                    0] + "\n<b>Entry:</b> " + journal["entry"] + "\n\n"
                    bot.send_message(message.chat.id, info, parse_mode="HTML")
                else:
                    info = "<u><b>Journals: </b></u>\n"
                    bot.send_message(
                        message.chat.id, info + "No journals between specified dates /viewjournals", parse_mode="HTML")
            else:
                view_journal_start_step(journal.message)
        else:
            bot.send_message(
                message.chat.id, "Follow the date format closely. Please try again.")
            view_journal_start_step(journal.message)


@bot.message_handler(func=lambda message: True, content_types=['text'])
def command_default(message):
    # this is the standard reply to a normal message
    bot.send_message(message.chat.id, "I don't understand \"" +
                     message.text + "\"\nMaybe try the help page at /help")


# SERVER SIDE 
@server.route('/' + TOKEN, methods=['POST'])
def getMessage():
   bot.process_new_updates([telebot.types.Update.de_json(request.stream.read().decode("utf-8"))])
   return "!", 200
@server.route("/")
def webhook():
   bot.remove_webhook()
   bot.set_webhook(url='https://momentsorbbot.herokuapp.com/' + TOKEN)
   return "!", 200
if __name__ == "__main__":
   server.run(host="0.0.0.0", port=int(os.environ.get('PORT', 7000)))

