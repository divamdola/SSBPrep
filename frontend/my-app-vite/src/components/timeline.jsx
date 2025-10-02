// import React, { Fragment } from "react";
// import MetaData from "./layouts/MetaData";

// const Timeline = () => {
//   return (
//     <Fragment>
//       <MetaData title={"SSB Procedure"} />
//         <div className="head-timeline">
//           <p>Complete Procedure for SSB</p>
//         </div>
//         <div className="timeline">
//           <div
//             className="container-timeline left"
//             data-aos="fade-right"
//             data-aos-duration="1000"
//             data-aos-once="true"
//           >
//             <div className="text-box">
//               <h1>Day 1 : Screening Test</h1>
//               <p>
//                 The screening process is to pick up some potential candidates
//                 from all those who have reported for the particular entry.
//               </p>
//               <span className="left-arrow"></span>
//             </div>
//           </div>
//           <div
//             className="container-timeline right"
//             data-aos="fade-left"
//             data-aos-duration="1000"
//             data-aos-once="true"
//           >
//             <div className="text-box">
//               <h1>OIR (Offiers Intelligence Rating)</h1>
//               <p>
//                 The OIR is the test of a candidate's reasoning and aptitude
//                 abilities. There is a booklet consisting of 50 questions of
//                 Verbal and Non-verbal types and for each set 30 minutes are
//                 allotted to the candidates. This test is conducted to test
//                 candidates' logical and analytical reasoning.
//               </p>
//               <span className="right-arrow"></span>
//             </div>
//           </div>
//           <div
//             className="container-timeline left"
//             data-aos="fade-right"
//             data-aos-duration="1000"
//             data-aos-once="true"
//           >
//             <div className="text-box">
//               <h1>PP & DT (Picture Perception and Discussion Test)</h1>
//               <p>
//                 In <strong>Picture Perception (PP)</strong>, an image is
//                 displayed on the screen for a period of 30 seconds, then 1
//                 minute is given to the candidates to fill in the details, and in
//                 the next 4 minutes, they are required to write a story around
//                 it. Candidates need to be very observant and note down minute
//                 details about the picture and its characters like the mood, age,
//                 actions, etc. The story written by the candidates should not
//                 just define the picture but relate to the picture as well.
//               </p>
//               <p>
//                 In the <strong>Discussion Test (DT)</strong>, candidates are
//                 divided into small groups and made to sit in a semi-circle. Then
//                 each candidate is made to narrate their story in front of the
//                 group within one minute. After that, the group is asked to
//                 discuss and make a group story including elements from each
//                 candidate's story.
//               </p>
//               <span className="left-arrow"></span>
//             </div>
//           </div>
//           <div
//             className="container-timeline right"
//             data-aos="fade-left"
//             data-aos-duration="1000"
//             data-aos-once="true"
//           >
//             <div className="text-box">
//               <h1>Result Declaration of Stage 1</h1>
//               <p>
//                 Based on their performance of Stage 1, some candidates are
//                 selected and move on to the next Stage- Stage 2 of the SSB 5
//                 Days Procedure. Selected candidates then go for their document
//                 verification and fill up the Personal Information Questionnaire
//                 (PIQ) for the next phase and are given a new chest number. The
//                 remaining candidates are given their travel allowance (TA) and
//                 dropped back at the railway station or the bus stand.
//               </p>
//               <span className="right-arrow"></span>
//             </div>
//           </div>
//           <div
//             className="container-timeline left"
//             data-aos="fade-right"
//             data-aos-duration="1000"
//             data-aos-once="true"
//           >
//             <div className="text-box">
//               <h1>Stage 2 : Psychological Test</h1>
//                 <ul>
//                   <li>Thematic Apperception Test (TAT)</li>
//                   <li>Word Association Test (WAT)</li>
//                   <li>Situation Reaction Test (SRT)</li>
//                   <li>Self-Description Test (SD)</li>
//                 </ul>
//               <span className="left-arrow"></span>
//             </div>
//           </div>
//           <div
//             className="container-timeline right"
//             data-aos="fade-left"
//             data-aos-duration="1000"
//             data-aos-once="true"
//           >
//             <div className="text-box">
//               <h1>Day 2 : Thematic Apperception Test (TAT)</h1>
//               <p>
//                 In this round, candidates are shown 12 pictures. 11 pictures are
//                 hazy while the last picture/slide is blank. Each picture is
//                 displayed only for 30 seconds and then the next slide appears.
//                 In the end, the blank slide appears inviting the candidates to
//                 write a story of their own in just 4 minutes. Candidates have to
//                 write the stories using the facts, ideas and assumptions that
//                 come to their mind.
//               </p>
//               <span className="right-arrow"></span>
//             </div>
//           </div>
//           <div
//             className="container-timeline left"
//             data-aos="fade-right"
//             data-aos-duration="1000"
//             data-aos-once="true"
//           >
//             <div className="text-box">
//               <h1>Word Association Tests (WAT)</h1>
//               <p>
//                 In this round, 60 words are displayed on the screen for 15
//                 seconds each. Candidates are required to write a sentence that
//                 comes to their mind immediately after seeing the word. Likewise,
//                 they have to write 60 sentences.
//               </p>
//               <span className="left-arrow"></span>
//             </div>
//           </div>
//           <div
//             className="container-timeline right"
//             data-aos="fade-left"
//             data-aos-duration="1000"
//             data-aos-once="true"
//           >
//             <div className="text-box">
//               <h1>Situation Reaction Test (SRT)</h1>
//               <p>
//                 In the Situation Reaction Test, Candidates are given a booklet
//                 containing 60 different situations, and candidates have to write
//                 their responses to them in 30 minutes. Candidates should be
//                 quick while answering the questions and should think about the
//                 situation as an officer.
//               </p>
//               <span className="right-arrow"></span>
//             </div>
//           </div>
//           <div
//             className="container-timeline left"
//             data-aos="fade-right"
//             data-aos-duration="1000"
//             data-aos-once="true"
//           >
//             <div className="text-box">
//               <h1>Self-Description Test (SD)</h1>
//               <p>
//                 Candidates have to write about the opinion of their parents,
//                 teachers, friends, colleagues, etc. about them. What do the
//                 candidates think about themselves, their strengths and
//                 weaknesses, these types of questions are asked. The motive of
//                 this test is to examine how well the candidates know themselves
//                 and how they would picture themselves in front of the other
//                 person.
//               </p>
//               <span className="left-arrow"></span>
//             </div>
//           </div>
//           <div
//             className="container-timeline right"
//             data-aos="fade-left"
//             data-aos-duration="1000"
//             data-aos-once="true"
//           >
//             <div className="text-box">
//               <h1>DAY 3: Group Test-I</h1>
//               <p>
//               The Group Task is conducted by a Group Testing Officer.
//                 Candidates are divided into small groups and their ability to
//                 perform in a group is tested.
//               </p>
//                 <ul>
//                   <li>Group Discussion (GD)</li>
//                   <li>Group Planning Exercise (GPE)</li>
//                   <li>Progressive Group Task (PGT)</li>
//                   <li>Half Group Task (HGT)</li>
//                   <li>Group Obstacle Race (GOR)</li>
//                 </ul>
//               <span className="right-arrow"></span>
//             </div>
//           </div>
//           <div
//             className="container-timeline left"
//             data-aos="fade-right"
//             data-aos-duration="1000"
//             data-aos-once="true"
//           >
//             <div className="text-box">
//               <h1>Group Discussion (GD)</h1>
//               <p>
//                 Candidates have to discuss two topics back to back for 15-20
//                 minutes. This tests how can the candidates take part in a group
//                 discussion, put forward their views, and influence the group by
//                 being firm with their decisions.
//               </p>
//               <span className="left-arrow"></span>
//             </div>
//           </div>
//           <div
//             className="container-timeline right"
//             data-aos="fade-left"
//             data-aos-duration="1000"
//             data-aos-once="true"
//           >
//             <div className="text-box">
//               <h1>Group Planning Exercise (GPE)</h1>
//               <p>
//                 Group Planning Exercise is also known as the Military Planning
//                 Exercise. Groups are formed with 6-12 members in each group.
//                 Candidates have to write a solution to a given problem. Then
//                 candidates are divided into groups and they together have to
//                 decide on a common solution for a specific problem and explain
//                 it with the help of the map. A 2D or 3D structure is placed in
//                 front of them and candidates have to conclude using the map.
//                 There are two phases in the GPE. First is individual planning
//                 and second is group planning.
//               </p>
//               <span className="right-arrow"></span>
//             </div>
//           </div>
//           <div
//             className="container-timeline left"
//             data-aos="fade-right"
//             data-aos-duration="1000"
//             data-aos-once="true"
//           >
//             <div className="text-box">
//               <h1>Progressive Group Task (PGT)</h1>
//               <p>
//                 PGT is one of the most exciting and difficult tasks in the GTO
//                 series. The tasks could be challenging and tricky at times and
//                 candidates have to be very careful and use their full potential
//                 while performing. Candidates have to cross certain obstacles or
//                 hurdles with some weight like a wooden plank, rope, etc.
//                 Candidates have to cross each hurdle along with these obstacles
//                 in the shortest time possible
//               </p>
//               <span className="left-arrow"></span>
//             </div>
//           </div>
//           <div
//             className="container-timeline right"
//             data-aos="fade-left"
//             data-aos-duration="1000"
//             data-aos-once="true"
//           >
//             <div className="text-box">
//               <h1>Half Group Task (HGT)</h1>
//               <p>
//                 This round is the same as PGT, it's just that the group is now
//                 divided into half. The GTO divides the group into two halves and
//                 instructs the candidates about the tasks.
//               </p>
//               <span className="right-arrow"></span>
//             </div>
//           </div>
//           <div
//             className="container-timeline left"
//             data-aos="fade-right"
//             data-aos-duration="1000"
//             data-aos-once="true"
//           >
//             <div className="text-box">
//               <h1>Group Obstacle Race (GOR)</h1>
//               <p>
//                 Candidates have to cross some obstacles including a rope
//                 sticking to it like a snake and it is a group task. The
//                 performance of the whole group is examined and if any individual
//                 makes a mistake the whole group is punished.{" "}
//               </p>
//               <span className="left-arrow"></span>
//             </div>
//           </div>
//           <div
//             className="container-timeline right"
//             data-aos="fade-left"
//             data-aos-duration="1000"
//             data-aos-once="true"
//           >
//             <div className="text-box">
//               <h1>DAY 4: Group Task-II</h1>
//                 <ul>
//                   <li>Lecturette</li>
//                   <li>Individual Obstacle Task (IOT)</li>
//                   <li>Command Task</li>
//                   <li>Final Group Task (FGT)</li>
//                 </ul>
//               <span className="right-arrow"></span>
//             </div>
//           </div>
//           <div
//             className="container-timeline left"
//             data-aos="fade-right"
//             data-aos-duration="1000"
//             data-aos-once="true"
//           >
//             <div className="text-box">
//               <h1>Lecturette</h1>
//               <p>
//                 Candidates are given 4 topics, out of which they have to speak
//                 on one topic of their choice for 3 minutes. This task tests how
//                 well the candidates can deliver their speeches, and how
//                 confident they are. This is a required skill in an officer while
//                 they give a brief to their team.
//               </p>
//               <span className="left-arrow"></span>
//             </div>
//           </div>
//           <div
//             className="container-timeline right"
//             data-aos="fade-left"
//             data-aos-duration="1000"
//             data-aos-once="true"
//           >
//             <div className="text-box">
//               <h1>Individual Obstacle Task (IOT)</h1>
//               <p>
//                 Candidates have to cross 10 obstacles individually, each
//                 obstacle has some points. The tasks include activities like-
//                 Jumping over a slide, Long jump, High Jump, Zig-Zag Balance,
//                 Walking a wooden log, High Screen jumping, Jumping platforms,
//                 Burma bridge, Tarzan swing, and Jumping through a tyre.
//               </p>
//               <span className="right-arrow"></span>
//             </div>
//           </div>
//           <div
//             className="container-timeline left"
//             data-aos="fade-right"
//             data-aos-duration="1000"
//             data-aos-once="true"
//           >
//             <div className="text-box">
//               <h1>Command Task</h1>
//               <p>
//                 In this round, candidates are made the commander and they choose
//                 their own team. The commander gives the instructions while the
//                 team members have to follow the instructions and complete the
//                 task.
//               </p>
//               <span className="left-arrow"></span>
//             </div>
//           </div>
//           <div
//             className="container-timeline right"
//             data-aos="fade-left"
//             data-aos-duration="1000"
//             data-aos-once="true"
//           >
//             <div className="text-box">
//               <h1>Final Group Task (FGT)</h1>
//               <p>
//                 Just like PGT, one more round is conducted where candidates have
//                 to show their potential of performing as a team.
//               </p>
//               <span className="right-arrow"></span>
//             </div>
//           </div>
//           <div
//             className="container-timeline left"
//             data-aos="fade-right"
//             data-aos-duration="1000"
//             data-aos-once="true"
//           >
//             <div className="text-box">
//               <h1>Personal Interview</h1>
//               <p>
//                 The Personal Interview is one of the most important parts of the
//                 SSB Interview. Candidates have a one-to-one interview with the
//                 Interviewing Officer (IO). It starts on day 2 of the SSB.
//                 Candidates are questioned on their daily activities, their own
//                 performance, and some general awareness questions. Candidates
//                 need to be very careful while answering the questions as the IO
//                 judge their body language, facial expressions, alertness, their
//                 answers, speaking skills, etc and this is a key factor in the
//                 selection of the candidates.
//               </p>
//               <span className="left-arrow"></span>
//             </div>
//           </div>
//           <div
//             className="container-timeline right"
//             data-aos="fade-left"
//             data-aos-duration="1000"
//             data-aos-once="true"
//           >
//             <div className="text-box">
//               <h1>DAY 5: Conference</h1>
//               <p>
//                 On the final day of the 5 days, SSB interview procedure
//                 candidates have to appear for the final test i.e., the Board
//                 Conference Day. Candidates have to face a panel of officers who
//                 assess the candidate on various parameters like their
//                 personality, presence of mind, performance in the SSB tasks,
//                 etc. Certain questions about the stay of the candidate, their
//                 performance, their equation with their fellow batchmates, etc
//                 are asked and the panel takes a collective decision. Borderline
//                 candidates can be asked certain situation-based questions and
//                 then the final decision is made.{" "}
//               </p>
//               <p>
//                 The results are announced and candidates who can satisfy the
//                 criteria laid out by the board are recommended and those who
//                 miss their chance of being selected are sent back home to
//                 prepare themselves for the next time.
//               </p>
//               <span className="right-arrow"></span>
//             </div>
//           </div>
//         </div>
//     </Fragment>
//   );
// };

// export default Timeline; 

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