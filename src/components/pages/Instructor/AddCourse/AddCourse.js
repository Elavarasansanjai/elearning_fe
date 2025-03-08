import React, { useEffect, useState } from "react";
import "./addcourse.css"; // Assuming you have your CSS styles
import axios from "axios";
import { apiList } from "../../../context/apiList";
import { useNavigate } from "react-router";

const PopupModal = ({
  isOpen,
  onClose,
  setUploadSts,
  editeData,
  setEditeData,
}) => {
  // Form state
  const MAX_FILE_SIZE = 60 * 1024 * 1024;
  console.log(MAX_FILE_SIZE);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState(null);
  const [questionName, setQuestionName] = useState("");
  const [quizOptions, setQuizOptions] = useState([""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate;
  // Handle file upload
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        alert("File size exceeds 50MB. Please upload a smaller video.");
      } else {
        setVideo(file);
      }
    }
  };

  // Handle quiz options
  const handleQuizChange = (index, event) => {
    const updatedOptions = [...quizOptions];
    updatedOptions[index] = event.target.value;
    setQuizOptions(updatedOptions);
  };

  const handleAddOption = () => {
    if (quizOptions.length < 4) {
      setQuizOptions([...quizOptions, ""]);
    } else {
      alert("max option ");
    }
  };

  const handleRemoveOption = (index) => {
    const updatedOptions = quizOptions.filter((_, i) => i !== index);
    setQuizOptions(updatedOptions);
  };

  const handleCorrectAnswerChange = (event) => {
    setCorrectAnswer(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // edite function
    if (Object.keys(editeData).length) {
      if (video) {
        if (video.size > MAX_FILE_SIZE) {
          alert("File size exceeds 50MB. Please upload a smaller video.");
        } else {
          const formData = new FormData();
          formData.append("title", title);
          formData.append("course_id", editeData?._id);
          formData.append("description", description);
          formData.append("video", video);
          formData.append(
            "quizzes",
            JSON.stringify([
              {
                question: questionName,
                options: quizOptions,
                correctAnswer: correctAnswer,
              },
            ])
          );

          const upload = await axios.post(
            `${
              process.env.REACT_APP_BACKEND_URL
                ? process.env.REACT_APP_BACKEND_URL
                : window.location.origin
            }/api/elearning${apiList.editeCourse}`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem(
                  "elearningToken"
                )}`,
              },
            }
          );
          if (upload.data) {
            setLoading(false);
          }
          if (upload.data.code === 200) {
            alert(upload.data.msg);
            setUploadSts(true);
            setTitle("");
            setDescription("");
            setVideo(null);
            setQuestionName("");
            setQuizOptions([""]);
            setCorrectAnswer("");
            onClose();
          } else if (upload?.data?.code === 500) {
            localStorage.removeItem("elearningToken");
            navigate("/elearning");
          } else {
            alert(upload.data.msg);
          }
        }
      } else {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("course_id", editeData?._id);
        formData.append("description", description);
        formData.append(
          "quizzes",
          JSON.stringify([
            {
              question: questionName,
              options: quizOptions,
              correctAnswer: correctAnswer,
            },
          ])
        );

        const upload = await axios.post(
          `${
            process.env.REACT_APP_BACKEND_URL
              ? process.env.REACT_APP_BACKEND_URL
              : window.location.origin
          }/api/elearning${apiList.editeCourse}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("elearningToken")}`,
            },
          }
        );
        if (upload.data) {
          setLoading(false);
        }
        if (upload.data.code === 200) {
          alert(upload.data.msg);
          setUploadSts(true);
          setTitle("");
          setDescription("");
          setVideo(null);
          setQuestionName("");
          setQuizOptions([""]);
          setCorrectAnswer("");
          onClose();
        } else if (upload?.data?.code === 500) {
          localStorage.removeItem("elearningToken");
          navigate("/elearning");
        } else {
          alert(upload.data.msg);
        }
      }
    } else {
      console.log({
        title,
        description,
        video,
        questionName,
        quizOptions,
        correctAnswer,
      });
      if (video) {
        if (video.size > MAX_FILE_SIZE) {
          alert("File size exceeds 50MB. Please upload a smaller video.");
        } else {
          const formData = new FormData();
          formData.append("title", title);
          formData.append("description", description);
          formData.append("video", video);
          formData.append(
            "quizzes",
            JSON.stringify([
              {
                question: questionName,
                options: quizOptions,
                correctAnswer: correctAnswer,
              },
            ])
          );

          const upload = await axios.post(
            `${
              process.env.REACT_APP_BACKEND_URL
                ? process.env.REACT_APP_BACKEND_URL
                : window.location.origin
            }/api/elearning${apiList.createCourse}`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem(
                  "elearningToken"
                )}`,
              },
            }
          );
          if (upload.data) {
            setLoading(false);
          }
          if (upload.data.code === 200) {
            alert("created success");
            setUploadSts(true);
            onClose();
          } else if (upload?.data?.code === 500) {
            localStorage.removeItem("elearningToken");
            navigate("/elearning");
          } else {
            alert(upload.data.msg);
          }
        }
      } else {
        alert("File size exceeds 50MB. Please upload a smaller video.");
      }
    }
  };
  useEffect(() => {
    if (Object.keys(editeData).length) {
      setDescription(editeData?.description);
      setTitle(editeData?.title);
      setQuestionName(editeData?.quizzes[0]?.question);
      setQuizOptions(editeData?.quizzes[0]?.options);
      setCorrectAnswer(editeData?.quizzes[0]?.correctAnswer);
    }
  }, [editeData]);

  return (
    <div className={`modal ${isOpen ? "open" : ""}`}>
      <div className="modal-content">
        <span
          className="close"
          onClick={() => {
            setEditeData(false);
            onClose();
            setTitle("");
            setDescription("");
            setVideo(null);
            setQuestionName("");
            setQuizOptions([""]);
            setCorrectAnswer("");
          }}
        >
          ×
        </span>
        <h2>Create Course</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter course title"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter course description"
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label>Upload Video</label>
            <input
              type="file"
              onChange={handleFileChange}
              accept="video/*"
              required={Object.keys(editeData).length === 0}
            />
          </div>

          <div className="form-group">
            <label>Question Name</label>
            <input
              type="text"
              value={questionName}
              onChange={(e) => setQuestionName(e.target.value)}
              placeholder="Enter question name"
              required
            />
          </div>

          <div className="form-group">
            <label>Quiz Options</label>
            {quizOptions.map((option, index) => (
              <div key={index} className="quiz-option">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleQuizChange(index, e)}
                  placeholder={`Option ${index + 1}`}
                  required
                />
                <button type="button" onClick={() => handleRemoveOption(index)}>
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={handleAddOption}>
              Add Option
            </button>
          </div>

          <div className="form-group">
            <label>Correct Answer</label>
            <input
              type="text"
              value={correctAnswer}
              onChange={handleCorrectAnswerChange}
              placeholder="Enter correct answer"
              required
            />
          </div>
          {Object.keys(editeData).length === 0 && (
            <button
              style={{ cursor: loading ? "not-allowed" : "pointer" }}
              disabled={loading}
              type="submit"
            >
              {loading ? "loading..." : "Submit"}
            </button>
          )}
          {Object.keys(editeData).length !== 0 && (
            <button
              style={{ cursor: loading ? "not-allowed" : "pointer" }}
              disabled={loading}
              type="submit"
            >
              {loading ? "loading..." : "Edit"}
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default PopupModal;
