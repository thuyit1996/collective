import { Meeting } from '../../models/Meeting';
import { User } from '../../models/User';

interface selectedMeeting {
  users: User[],
  meetingId: number,
}
export interface MeetingState {
  items: Meeting[];
  currentItem: Meeting;
  status: 'idle' | 'loading' | 'error';
  error?: string;
  sort: 'asc' | 'desc' | null;
  selectedItem: selectedMeeting,
  typeLoading : 'list-loading' | 'attendees-loading'
}
