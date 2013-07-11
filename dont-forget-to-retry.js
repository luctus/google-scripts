function main(){
 
  var label = GmailApp.getUserLabelByName("PubRequest");
  var labelOK = GmailApp.getUserLabelByName("PubRequestOK");
  if(!labelOK)
    labelOK = GmailApp.createLabel("PubRequestOK");
  var labelPending = GmailApp.getUserLabelByName("PubRequestPending");
  if(!labelPending)
    labelPending = GmailApp.createLabel("PubRequestPending");
  
  var threads = label.getThreads();
  var thread = null;

  for (var i = 0; i < threads.length; i++) {

    thread = threads[i];
    
    //Was this thread already processed?
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
      continue;
    }
    

    //Did anyone else replied?
    var replied = false;
    for ( var j = 0 ; j < messages.length ; j ++)
    {
      if ( !amITheSender(messages[j].getFrom()) ){
        thread.addLabel(labelOK);
        thread.removeLabel(labelPending);
        replied = true;
        break;
      }
    }
    
    if (replied)
      continue;
    
    
    //Are you still here? Yes, you are alone. For ever.
    Logger.log(firstMessage.getTo() + " haven't replied yet");
    thread.addLabel(labelPending);
  }
}

function amITheSender(from)
{
  var fromAddress = from.substring(from.indexOf("<"));
  return ( fromAddress == '<' + Session.getActiveUser() + '>' );
}
