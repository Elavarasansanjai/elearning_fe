import { useContext, useEffect, useState } from "react";

import { apiList } from "../../context/apiList";
import axios from "axios";
import PopupModal from "./AddCourse/AddCourse";

const Instructor = () => {
  const [getCourse, setGetCourse] = useState({});
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadSts, setUploadSts] = useState(false);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const [editeData, setEditeData] = useState({});
  useEffect(() => {
    setLoading(true);
    try {
      axios
        .get(
          `${
            process.env.REACT_APP_BACKEND_URL
              ? process.env.REACT_APP_BACKEND_URL
              : window.location.origin
          }/api/elearning${apiList.getCourse}`,
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
  }, [uploadSts]);
  const editeClick = (e, course) => {
    console.log(course);
    setEditeData(course);
    handleOpenModal();
  };

  const deleteCourse = async (_id) => {
    const upload = await axios.post(
      `${
        process.env.REACT_APP_BACKEND_URL
          ? process.env.REACT_APP_BACKEND_URL
          : window.location.origin
      }/api/elearning${apiList.deleteCourse}`,
      { course_id: _id },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("elearningToken")}`,
        },
      }
    );
    if (upload.data.code === 200) {
      alert(upload?.data?.msg);
      try {
        axios
          .get(
            `${
              process.env.REACT_APP_BACKEND_URL
                ? process.env.REACT_APP_BACKEND_URL
                : window.location.origin
            }/api/elearning${apiList.getCourse}`,
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
    }
  };
  return (
    <div className="instructor_container">
      <div>
        <button onClick={handleOpenModal}>Add Course</button>
      </div>
      {/* {getCourse?.code !== 200 && !loading && <p>No Courses</p>} */}
      {getCourse?.code === 200 && getCourse?.data.length !== 0 ? (
        <div className="course_conainer">
          {getCourse?.data.map((course, i) => {
            return (
              <div key={i} className="course_content">
                <div>
                  <p>Tittle : {course?.title}</p>
                  <p>Description : {course?.description}</p>
                  <button
                    onClick={(e) => {
                      editeClick(e, course);
                    }}
                  >
                    Edite Course
                  </button>
                  <button
                    onClick={(e) => {
                      deleteCourse(course?._id);
                    }}
                  >
                    Delete Course
                  </button>
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
                {course?.quizzes.map((qui, i) => {
                  return (
                    <div key={i}>
                      <p>Question name : {qui?.question}</p>
                      <p>
                        options :
                        {qui?.options.map((option, i) => (
                          <span style={{ paddingRight: "10px" }} key={i}>
                            {` ${option}`}
                          </span>
                        ))}
                      </p>
                      <p>correct answer : {qui?.correctAnswer}</p>
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
      <PopupModal
        setUploadSts={setUploadSts}
        isOpen={isModalOpen}
        editeData={editeData}
        setEditeData={setEditeData}
        onClose={handleCloseModal}
      />
    </div>
  );
};
export default Instructor;
