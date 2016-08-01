var Dropbox = require('dropbox')

var sharedFolderDetails = new Array(); // our potentially big cache
var numSharedFolders = 0;
var foldersToDo = 0;
var foldersDone = 0;
var usersToDo = 0;
var usersDone = 0;

var dbx

function populateSharingDetails(token) {
     dbx = new Dropbox({ accessToken: token })
    console.log('Getting shared folder details in memory');
    var userIndex = 0;
    getSharedFolders(); // triggers a bunch of sub functions
}

function getSharedFolders(){
    dbx.sharingListFolders()
    .then(function(response) {
      var numFolders = response.entries.length;
      foldersToDo = numFolders;
      for (var i = 0; i < numFolders; i++) {
          getFolderMetadata(response.entries[i].name, response.entries[i].path_lower, response.entries[i].shared_folder_id);
      }
      console.log('FINISHED FOLDERS ' + i);
    })
    .catch(function(error) {
    });
}

function getFolderMetadata(foldername, folderpath, folderid){
    dbx.sharingListFolderMembers({shared_folder_id: folderid})
    .then(function(response) {
      var arrayLength = response.users.length;
      for (var i = 0; i < arrayLength; i++) {
          if(response.users[i].access_type[".tag"]=="owner"){  // only add shared folder owners.
            sharedFolderDetails.push({
              folderid: folderid,
              accountid: response.users[i].user["account_id"],
              username: "realusername"
            });
          }
      }
      foldersDone++;
      if(foldersDone==foldersToDo){
        console.log('Done getting shared folders and owner details ( ' + foldersToDo + ' folders)');
        foldersDone = 0;
        getRealUserNames(); // We are done getting all folder owners, lets get their names!
      }
    })
    .catch(function(error) {
    });
}

function getRealUserNames(){
  console.log('Getting real user names');
  numSharedFolders = sharedFolderDetails.length;
  var _userlist = new Array(numSharedFolders);
  for (var i = 0; i < numSharedFolders; i++) {
    _userlist[i] = sharedFolderDetails[i].accountid
  }
  _userlist = _ArrNoDupe(_userlist)
  dbx.usersGetAccountBatch({account_ids: _userlist})
    .then(function(response) {
      var numUsers = response.length;
      for (var i = 0; i < numUsers; i++) {
          UpdateAccountIDsWithUserNames(response[i].account_id, response[i].name.display_name, numUsers);
      }
    })
    .catch(function(error) {
    });
}

function UpdateAccountIDsWithUserNames(accountid,fullname, usersToDo){

    for (var i = 0; i < numSharedFolders; i++) {
        if(sharedFolderDetails[i].accountid == accountid) {
          sharedFolderDetails[i].username = fullname;
        }
    }
    usersDone++;
    if(usersDone==usersToDo){
      console.log('Done getting username matches ( ' + usersToDo + ' folders)');
      usersDone = 0;
    }
}

function _ArrNoDupe(a) {
    var temp = {};
    for (var i = 0; i < a.length; i++)
        temp[a[i]] = true;
    var r = [];
    for (var k in temp)
        r.push(k);
    return r;
}

module.exports = {populateSharingDetails, sharedFolderDetails}
