import * as React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';

export default function OutlinedTimeline(props) {
    return (
        <Timeline position="alternate">
            {props.timelineData.map((data,index) => {
                return (
                    <TimelineItem>
                        <TimelineSeparator>
                            <TimelineDot  variant={data.stage?"filled":"outlined"} color='primary' />
                            <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>{data.display_name}</TimelineContent>
                    </TimelineItem>
                )
            })}

        </Timeline>
    );
}