import { useEffect, useState } from "react";
import { apiList } from "../context/apiList";
import axios from "axios";
import jsPDF from "jspdf";
import "./student.css";
import { useNavigate } from "react-router";
const Student = () => {
  const [getCourse, setGetCourse] = useState({});
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    setLoading(true);
    try {
      axios
        .get(
          `${
            process.env.REACT_APP_BACKEND_URL
              ? process.env.REACT_APP_BACKEND_URL
              : window.location.origin
          }/api/elearning${apiList.getAllCourse}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("elearningToken")}`,
            },
          }
        )
        .then((res) => {
          setLoading(false);
          setGetCourse(res.data);
        });
    } catch (err) {
      alert("something went wrong!");
    }
  }, []);

  const changehandler = (e) => {
    setAnswer({ [e.target.name]: e.target.value });
  };

  const submitHandler = async (courseid, quesId, i) => {
    if (answer?.[`answer${i}`]) {
      const submitAns = await axios.post(
        `${
          process.env.REACT_APP_BACKEND_URL
            ? process.env.REACT_APP_BACKEND_URL
            : window.location.origin
        }/api/elearning${apiList.submitAns}`,
        {
          course_id: courseid,
          qustion_id: quesId,
          answer: answer?.[`answer${i}`],
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("elearningToken")}`,
          },
        }
      );
      const submitres = submitAns?.data;
      if (submitAns?.code === 200) {
        alert(submitres?.msg);
        try {
          axios
            .get(
              `${
                process.env.REACT_APP_BACKEND_URL
                  ? process.env.REACT_APP_BACKEND_URL
                  : window.location.origin
              }/api/elearning${apiList.getAllCourse}`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem(
                    "elearningToken"
                  )}`,
                },
              }
            )
            .then((res) => {
              setLoading(false);
              setGetCourse(res.data);
            });
        } catch (err) {
          alert("something went wrong!");
        }
      } else if (submitAns?.code === 500) {
        localStorage.removeItem("elearningToken");
        navigate("/elearning");
      } else {
        alert(submitres?.msg);
      }
    }
  };
  const genratePdf = async (course) => {
    const getProfile = await axios.get(
      `${
        process.env.REACT_APP_BACKEND_URL
          ? process.env.REACT_APP_BACKEND_URL
          : window.location.origin
      }/api/elearning/user/profile`,

      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("elearningToken")}`,
        },
      }
    );
    const getProfileRes = getProfile?.data;
    if (getProfileRes.code === 200) {
      let name = getProfileRes?.data.name;
      const doc = new jsPDF();

      // Add Course Title
      doc.setFontSize(16);
      doc.text(`Course Title: ${course?.title}`, 10, 10);

      // Add Course Author
      doc.setFontSize(12);
      doc.text(`Course Author: ${course?.author}`, 10, 20);

      // Add Participant Name
      doc.setFontSize(12);
      doc.text(`Participant Name: ${name}`, 10, 30);

      // Add Percentage
      doc.setFontSize(12);
      doc.text(`Percentage: ${100}%`, 10, 40);

      // Save the PDF
      doc.save(`${course?.title}_certificate.pdf`);
    }
  };
  return (
    <div className="instructor_container">
      {/* {getCourse?.code !== 200 && !loading && <p>No Courses</p>} */}
      {getCourse?.code === 200 && getCourse?.data.length !== 0 ? (
        <div className="course_conainer">
          {getCourse?.data.map((course, index) => {
            return (
              <div key={index} className="course_content">
                <div>
                  <p>Tittle : {course?.title}</p>
                  <p>Author : {course?.author}</p>
                </div>

                {course?.videos.map((url, i) => {
                  return (
                    <div>
                      <video width="640" height="360" controls>
                        <source src={url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  );
                })}
                {course?.quizzes.map((qui, ind) => {
                  return (
                    <div key={ind}>
                      <p>Question name : {qui?.question}</p>
                      <p>
                        options :
                        {qui?.options.map((option, i) => (
                          <span style={{ paddingRight: "10px" }} key={i}>
                            {` ${option}`}
                          </span>
                        ))}
                      </p>
                      <form
                        onChange={changehandler}
                        onSubmit={(e) => {
                          e.preventDefault();
                          submitHandler(course?._id, qui?._id, index);
                        }}
                      >
                        {!course?.certificate && (
                          <div>
                            <input
                              value={
                                answer?.[`answer${index}`]
                                  ? answer?.[`answer${index}`]
                                  : ""
                              }
                              placeholder="enter answer"
                              name={`answer${index}`}
                            />
                            <button>Submit</button>
                          </div>
                        )}
                      </form>
                      {course?.certificate && (
                        <button onClick={() => genratePdf(course)}>
                          Get Certificate
                        </button>
                      )}
                    </div>
                  );
                })}
                <br></br>
              </div>
            );
          })}
        </div>
      ) : (
        <p>No Course</p>
      )}
    </div>
  );
};

export default Student;
