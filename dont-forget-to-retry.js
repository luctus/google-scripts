function main(){
 
  /*
  * You can configure this block
  */
  var gs_request = "GS-Request";
  var gs_request_ok = "GS-RequestOK";
  var gs_request_pending = "GS-RequestPending";
  var gs_request_forget = "GS-RequestForget";
  
  /*
  * Don't touch this
  */
  
  var label = GmailApp.getUserLabelByName(gs_request);
  var labelOK = GmailApp.getUserLabelByName(gs_request_ok);
  if(!labelOK)
    labelOK = GmailApp.createLabel(gs_request_ok);
  var labelPending = GmailApp.getUserLabelByName(gs_request_pending);
  if(!labelPending)
    labelPending = GmailApp.createLabel(gs_request_pending);
  var labelForget = GmailApp.getUserLabelByName(gs_request_forget);
  if(!labelForget)
    labelForget = GmailApp.createLabel(gs_request_forget);
  
  var threads = label.getThreads();
  var thread = null;

  for (var i = 0; i < threads.length; i++) {

    thread = threads[i];
    
    //Was this thread already processed? i.e: labeled as 'OK'
    var isOK = false;
    var threadLabels = thread.getLabels();
    for ( var l = 0 ; l < threadLabels.length ; l ++ ){
      if ( threadLabels[l].getName() == labelOK.getName() )  
        isOK = true;
    }
    if(isOK)
      continue;
    
    
    
    var messages = thread.getMessages();
    
    //Was I the original sender?
    var firstMessage = messages[0];
    if ( !amITheSender(firstMessage.getFrom()) ) {
      //I'm not the original sender, so I'm not interested in tracking this thread.
      continue;
    }
        
    
    //Did anyone else replied?
    var replied = false;
    for ( var j = 0 ; j < messages.length ; j ++)
    {
      if ( !amITheSender(messages[j].getFrom()) ){
        thread.addLabel(labelOK);
        thread.removeLabel(labelPending);
        thread.removeLabel(labelForget);
        replied = true;
        break;
      }
    }
    
    if (replied)
      continue;
    
    
    //Did I try 3 times yet? 
    if(messages.length >= 3)
    {
      //We don't want to be a spammer...
      thread.addLabel(labelForget);
      thread.removeLabel(labelPending);
      continue;
    }
    
    //Are you still here? So they haven't replied you yet
    thread.addLabel(labelPending);
  }
}

function amITheSender(from)
{
  var fromAddress = from.substring(from.indexOf("<"));
  return ( fromAddress == '<' + Session.getActiveUser() + '>' );
}
