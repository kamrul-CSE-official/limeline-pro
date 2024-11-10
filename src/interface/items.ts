
import { TimelineItemBase } from "react-calendar-timeline";


export interface IItem extends TimelineItemBase<number> {
    title: string;
    progress: number;
    style?: React.CSSProperties;
    description?: string;
    priority: 'low' | 'medium' | 'high';
    id: number;
    group: number;
    // end_time?: number;
    // start_time?: number;
  }