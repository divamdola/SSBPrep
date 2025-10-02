import React, { Fragment, useEffect } from "react";
import MetaData from "./layouts/MetaData";
import AOS from "aos";
import "aos/dist/aos.css";// We'll create this new CSS file

const Timeline = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration
      once: true, // Whether animation should happen only once
      disable: "mobile", // You can disable animations on mobile if you want
    });
  }, []);

  const timelineEvents = [
    {
      day: "Day 1",
      title: "Screening Test",
      description: "The screening process is to pick up potential candidates from all those who have reported for the particular entry. It includes two tests:",
      subEvents: [
        {
          title: "OIR (Officers Intelligence Rating)",
          description: "A test of reasoning and aptitude with 50 verbal and non-verbal questions to be solved in 30 minutes, assessing logical and analytical skills."
        },
        {
          title: "PP & DT (Picture Perception and Discussion Test)",
          description: "Candidates write a story based on a picture shown for 30 seconds. This is followed by a group discussion to create a common story."
        }
      ],
      result: "Based on Stage 1 performance, selected candidates proceed to Stage 2 after document verification and filling the PIQ. Others are sent back."
    },
    {
      day: "Day 2",
      title: "Psychological Tests",
      description: "A series of written tests designed to assess the personality and psychological makeup of the candidate. This includes:",
      subEvents: [
        {
          title: "Thematic Apperception Test (TAT)",
          description: "Candidates write stories for 11 hazy pictures and one blank slide, each shown for 30 seconds."
        },
        {
          title: "Word Association Test (WAT)",
          description: "60 words are shown for 15 seconds each. Candidates must write the first sentence that comes to mind."
        },
        {
          title: "Situation Reaction Test (SRT)",
          description: "A booklet with 60 real-life situations is given, and candidates have 30 minutes to write their reactions."
        },
        {
          title: "Self-Description Test (SD)",
          description: "Candidates write about their self-perception and what their parents, teachers, and friends think of them."
        }
      ]
    },
    {
      day: "Day 3",
      title: "Group Testing - Part I",
      description: "These tasks are conducted by a Group Testing Officer (GTO) to evaluate performance within a team.",
      subEvents: [
        { title: "Group Discussion (GD)", description: "Two back-to-back discussions on given topics to assess communication and influencing skills." },
        { title: "Group Planning Exercise (GPE)", description: "Candidates plan a solution to a given problem, first individually and then as a group." },
        { title: "Progressive Group Task (PGT)", description: "The group must cross a series of obstacles using helping materials like ropes and planks." },
        { title: "Half Group Task (HGT)", description: "Similar to PGT, but with the group divided in half for closer observation." },
        { title: "Group Obstacle Race (GOR)", description: "Also known as the Snake Race, where groups compete to finish a course of obstacles." }
      ]
    },
     {
      day: "Day 4",
      title: "Group Testing - Part II & Interview",
      description: "The final set of group tasks along with the personal interview.",
      subEvents: [
        { title: "Lecturette", description: "A 3-minute speech on a topic chosen from four options, testing knowledge and confidence." },
        { title: "Individual Obstacles (IO)", description: "Candidates must complete 10 obstacles of varying difficulty within a time limit." },
        { title: "Command Task (CT)", description: "Each candidate acts as a commander to guide subordinates through a task." },
        { title: "Final Group Task (FGT)", description: "One final task similar to PGT for a last look at team performance." },
        { title: "Personal Interview", description: "A one-on-one interview with the Interviewing Officer (IO), covering personal life, academics, and general awareness. This can happen on any day from Day 2 to Day 4." }
      ]
    },
    {
      day: "Day 5",
      title: "Conference & Results",
      description: "The final day where the selection board makes its decision.",
      subEvents: [
        { title: "Conference", description: "Each candidate has a final meeting with the entire board, which makes the final recommendation based on the 5-day performance." },
        { title: "Result Declaration", description: "The results are announced. Recommended candidates proceed for medical examination, while others are sent back." }
      ]
    }
  ];

  return (
    <Fragment>
      <MetaData title={"SSB Procedure"} />
      <div className="ssb-timeline-container">
        <div className="ssb-header">
          <h1>The 5-Day SSB Procedure</h1>
          <p>A comprehensive guide to the Services Selection Board interview process.</p>
        </div>
        <div className="timeline-wrapper">
          {timelineEvents.map((event, index) => (
            <div key={index} className="timeline-item" data-aos="fade-up">
              <div className="timeline-day">{event.day}</div>
              <div className="timeline-content">
                <h2>{event.title}</h2>
                <p className="event-description">{event.description}</p>
                <div className="sub-events">
                  {event.subEvents.map((sub, subIndex) => (
                    <div key={subIndex} className="sub-event-item">
                      <h3>{sub.title}</h3>
                      <p>{sub.description}</p>
                    </div>
                  ))}
                </div>
                {event.result && <p className="event-result"><strong>Outcome:</strong> {event.result}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Fragment>
  );
};

export default Timeline;