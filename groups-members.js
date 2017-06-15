/*
Requeriments:
- Go to "Resources" > "Advanced Google Services" and enable "Admin Directory API".
- A white sheet called 'members';
- A sheet called '_groups' with all the groups you want to list, in column A, starting in the first row
- Update the "@archdaily.com" in the following script
- Run the "main" function
*/

function main(){
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('members');
  sheet.clear();
  sheet.getRange(1,1).setValue("Loading...");
  
  var groupsData = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('_groups').getDataRange().getValues();
  var groups     = [];
  for( var g = 0 ; g < groupsData.length ; g++ ){
    groups.push(groupsData[g][0]); 
  }
  groups.sort();
  
  for( var i = 0 ; i < groups.length ; i++ ){
    Logger.log("Listing group: " + groups[i]);
    sheet.getRange(1, i + 1).setValue(groups[i]).setFontWeight("bold");
    sheet.getRange(1, i + 1).clearNote();
    
    var aliases = AdminDirectory.Groups.Aliases.list(groups[i] + '@archdaily.com').aliases;
    if( typeof(aliases) != 'undefined' ){
      var notes = ["Aliases:"];
      for( var n = 0 ; n < aliases.length ; n++ ){
        notes.push(aliases[n].alias.replace("@archdaily.com","")); 
      }
      sheet.getRange(1, i + 1).setNote(notes.join("\n"));
    }
    
    var finalMembers = [];
    finalUsers(AdminDirectory.Members.list(groups[i] + '@archdaily.com').members, finalMembers);
    finalMembers = arrUnique(finalMembers).sort();
    for( var j = 0 ; j < finalMembers.length ; j++ ){
      var range = sheet.getRange(j + 2, i + 1);
      range.setValue(finalMembers[j].replace("@archdaily.com",""));
    }
  }
}

function finalUsers(members, finalMembers){
  for( var i = 0 ; i < members.length ; i++ ){
    if( members[i].type == 'USER' ){
      finalMembers.push(members[i].email);
    } else {
      var subMembers = AdminDirectory.Members.list(members[i].email).members;
      if( subMembers.length > 0 ){
        finalUsers(subMembers, finalMembers);
      }
    }
  }
}

function arrUnique(a){
  var t = [];
  for( var x = 0; x < a.length; x++ ){
    if( t.indexOf(a[x]) == -1 )t.push(a[x]);
  }
  return t;
}
