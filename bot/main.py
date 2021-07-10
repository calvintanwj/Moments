import os
import re
import telebot
import pymongo
import time
from pymongo import MongoClient
from dotenv import load_dotenv
import requests
from telebot.types import InlineKeyboardMarkup, InlineKeyboardButton
from fuzzywuzzy import fuzz

load_dotenv()
cluster = MongoClient(os.getenv("MDB_CONNECT"))
db = cluster["Moments"]
users = db["users"]
events = db["events"]
bot = telebot.TeleBot(os.getenv("API_KEY"))


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


@bot.callback_query_handler(func=lambda call: True)
def query(call):
    event = event_dict[call.from_user.id]
    if call.data == "add_yes":
        existingUser = users.find_one({"chat_id": call.from_user.id})
        delattr(event, "message")
        event.authorId = str(existingUser["_id"])
        events.insert_one(event.__dict__)
        # Need to find some way to re-render the events
        bot.answer_callback_query(call.id, "Event added successfully")
        # Need to figure out how to hide keyboard
        # bot.edit_message_reply_markup(event.message.chat.id, event.message.message_id, reply_markup=None)
    elif call.data == "add_no":
        bot.answer_callback_query(call.id, "Event add failed")
        # bot.edit_message_reply_markup(event.message.chat.id, event.message.message_id, reply_markup=None)
    elif call.data == "edit_yes":
        event = event_dict[0]
        edit_event_step(event.message)
    elif call.data == "edit_no":
        event = event_dict[0]
        edit_title_step(event.message)
    elif call.data == "edit_confirm_yes":
        oldEvent = event_dict[1]
        events.update_one({"_id": oldEvent["_id"]}, {
            "$set": {"title": event.title, "start": event.start, "end": event.end}})
        bot.answer_callback_query(call.id, "Event edited successfully")
    elif call.data == "edit_confirm_no":
        bot.answer_callback_query(call.id, "Edit Event failed")
    elif call.data == "delete_yes":
        event = event_dict[1]
        events.delete_one({"_id": event["_id"]})
        bot.answer_callback_query(call.id, "Success! Event deleted.")
    elif call.data == "delete_no":
        event = event_dict[1]
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
                "/editjournal - edit a specified journal\n"
                "/deletejournal - delete a specified journal\n"
                "/viewjournal - view a specified journal\n\n"
                "<b>Reminder settings</b>\n"
                "/setreminder - set reminders for upcoming events"
                )
        bot.send_message(message.chat.id, info, parse_mode="HTML")
    except:
        return


class Event:
    def __init__(self, title):
        self.title = title
        self.start = None
        self.end = None
        self.message = None


event_dict = {}


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
                startStr = event.start.replace("T", " ")
                endStr = event.end.replace("T", " ")
                bot.send_message(message.chat.id, "<b>Event:</b>\n" + "Title: " + event.title +
                                 "\nStart: " + startStr + "\nEnd: " + endStr + "\nConfirm?", parse_mode="HTML", reply_markup=add_event_markup())
            else:
                add_start_step(event.message)
        elif (re.match(end_pattern_two, end)):
            bigArray = end.split(" ")
            if (check_date(message, bigArray[0]) and check_time(message, bigArray[1])):
                event.end = bigArray[0] + "T" + bigArray[1]
                event.message = message
                startStr = event.start.replace("T", " ")
                endStr = event.end.replace("T", " ")
                bot.send_message(message.chat.id, "<b>Event:</b>\n" + "Title: " + event.title +
                                 "\nStart: " + startStr + "\nEnd: " + endStr + "\nConfirm?", parse_mode="HTML", reply_markup=add_event_markup())
            else:
                add_start_step(event.message)
        else:
            bot.send_message(
                message.chat.id, "Follow the date format closely. Please try again.")
            add_start_step(event.message)


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
                    info += f"<b>{str(i + 1)}</b>" + "\nTitle: " + str(possibleEvents[i]["title"]) + "\nStart: " + str(
                        possibleEvents[i]["start"]) + "\nEnd: " + str(possibleEvents[i]["end"]) + " \n\n"
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
            info = "Title: " + str(specifiedEvent["title"]) + "\nStart: " + str(
                specifiedEvent["start"]) + "\nEnd: " + str(specifiedEvent["end"])
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
            startStr = event.start.replace("T", " ")
            endStr = event.end.replace("T", " ")
            oldStartStr = oldEvent["start"].replace("T", " ")
            oldEndStr = oldEvent["end"].replace("T", " ")
            bot.send_message(message.chat.id, "<b>Editing Event:</b>\n" + "Title: " + oldEvent["title"] + "\nStart: " + oldStartStr + "\nEnd: " + oldEndStr +
                             "\n\n<b>Edited Event:</b>\n" + "Title: " + event.title +
                             "\nStart: " + startStr + "\nEnd: " + endStr + "\n\nConfirm your changes?", parse_mode="HTML", reply_markup=edit_event_confirm_markup())
        elif (re.match(end_pattern, end)):
            if (check_date(message, end)):
                event.end = end
                event.message = message
                startStr = event.start.replace("T", " ")
                endStr = event.end.replace("T", " ")
                oldStartStr = oldEvent["start"].replace("T", " ")
                oldEndStr = oldEvent["end"].replace("T", " ")
                bot.send_message(message.chat.id, "<b>Editing Event:</b>\n" + "Title: " + oldEvent["title"] + "\nStart: " + oldStartStr + "\nEnd: " + oldEndStr +
                                 "\n\n<b>Edited Event:</b>\n" + "Title: " + event.title +
                                 "\nStart: " + startStr + "\nEnd: " + endStr + "\n\nConfirm your changes?", parse_mode="HTML", reply_markup=edit_event_confirm_markup())
            else:
                edit_start_step(event.message)
        elif (re.match(end_pattern_two, end)):
            bigArray = end.split(" ")
            if (check_date(message, bigArray[0]) and check_time(message, bigArray[1])):
                event.end = bigArray[0] + "T" + bigArray[1]
                event.message = message
                startStr = event.start.replace("T", " ")
                endStr = event.end.replace("T", " ")
                oldStartStr = oldEvent["start"].replace("T", " ")
                oldEndStr = oldEvent["end"].replace("T", " ")
                bot.send_message(message.chat.id, "<b>Editing Event:</b>\n" + "Title: " + oldEvent["title"] + "\nStart: " + oldStartStr + "\nEnd: " + oldEndStr +
                                 "\n\n<b>Edited Event:</b>\n" + "Title: " + event.title +
                                 "\nStart: " + startStr + "\nEnd: " + endStr + "\n\nConfirm your changes?", parse_mode="HTML", reply_markup=edit_event_confirm_markup())
            else:
                edit_start_step(event.message)
        else:
            bot.send_message(
                message.chat.id, "Follow the date format closely. Please try again.")
            edit_start_step(event.message)


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
                    info += f"<b>{str(i + 1)}</b>" + "\nTitle: " + str(possibleEvents[i]["title"]) + "\nStart: " + str(
                        possibleEvents[i]["start"]) + "\nEnd: " + str(possibleEvents[i]["end"]) + " \n\n"
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
            info = "Title: " + str(specifiedEvent["title"]) + "\nStart: " + str(
                specifiedEvent["start"]) + "\nEnd: " + str(specifiedEvent["end"])
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
                view_start_step(event.message)
        elif (re.match(end_pattern_two, end)):
            bigArray = end.split(" ")
            if (check_date(message, bigArray[0]) and check_time(message, bigArray[1])):
                event.end = bigArray[0] + "T" + bigArray[1]
                event.message = message
                userEvents = list(events.find({"authorId": str(existingUser["_id"]), "end": {
                    "$lte": event.end}, "start": {"$gte": event.start}}))
                info = "<u><b>Events: </b></u>\n"
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
                view_start_step(event.message)
        else:
            bot.send_message(
                message.chat.id, "Follow the date format closely. Please try again.")
            view_start_step(event.message)


# set reminder command to set reminders for upcoming events
@bot.message_handler(commands=["setreminder"])
def setreminder(message):
    try:
        checklink(message)
        bot.send_message(message.chat.id, "")
    except:
        return


@bot.message_handler(func=lambda message: True, content_types=['text'])
def command_default(message):
    # this is the standard reply to a normal message
    bot.send_message(message.chat.id, "I don't understand \"" +
                     message.text + "\"\nMaybe try the help page at /help")


bot.polling()
