export function randomId() {
  return Math.random().toString(36).substring(7);
}

export function findUserName(usersList, userId) {
  const user = usersList.find(item => item?.pk_User_ID === userId);
  return (user?.User_FirstName && user?.User_SecondName) ? (user.User_FirstName + ' ' + user.User_SecondName) : user?.User_Email;
}

export function findInitialNameAndAvatarColor(usersList, userId) {
  const user = usersList.find(item => item?.pk_User_ID === userId);
  return {
    initialName: user?.User_Initials ? user.User_Initials : ((user?.User_Email?.charAt(0) + user?.User_Email?.charAt(1)) || '')?.toUpperCase(),
    color: user?.User_Colour.length === 6 ? user.User_Colour : '1DC9B7',
  };
}

export function findUserByMeetingTranscript(usersList, userId) {
  return usersList.find(item => item.pk_User_ID === userId) ?? {};
}

export function getColorStatus(status) {
  if (status === 1) { return { name: 'Transcribed', color: '#22b9ff' }; }
  if (status === 2) { return { name: 'Minutes Generated', color: '#fd27eb' }; }
  if (status === 3) { return { name: 'Minutes Sent', color: '#1dc9b7' }; }
}

export function customName({
  name, email
}) {
  return !name ? (email?.charAt(0) + email?.charAt(1))?.toUpperCase() : name;
}