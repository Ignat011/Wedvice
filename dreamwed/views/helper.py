from main.settings import MSG_TAGS


# Custom messages
def success_message(msg):
   return {
      'tag': MSG_TAGS['success'],
      'content': msg,
   }

def error_message(msg):
   return {
      'tag': MSG_TAGS['error'],
      'content': msg,
   }

def warning_message(msg):
   return {
      'tag': MSG_TAGS['warning'],
      'content': msg,
   }

def info_message(msg):
   return {
      'tag': MSG_TAGS['info'],
      'content': msg,
   }