export function getTranscriptByMeetingId(transriptList, meetingId) {
  return (transriptList || []).filter(item => item.fk_Meeting_ID === meetingId);
}

export function getTranscriptByIndex(transriptList, index) {
  return (transriptList || []).find((item, idx) => idx === index) ?? {};
}