import { MeetingTranscriptItem } from '../../models/MeetingTranscriptItem';

export interface MeetingTranscriptState {
  items: MeetingTranscriptItem[];
  currentItem: MeetingTranscriptItem;
  status: 'idle' | 'loading' | 'error';
  error?: string;
}