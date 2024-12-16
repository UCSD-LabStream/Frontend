import React, { useState } from 'react';
import 'materialize-css/dist/css/materialize.min.css';
import M from 'materialize-css';
import writeSlots from '../components/Write_slots';
import './styles.css';

const SlotCreation = () => {
  const [formData, setFormData] = useState({
    course_no: '',
    startTime: '',
    endTime: '',
  });

  // Initialize Materialize components when the component mounts
  React.useEffect(() => {
    M.AutoInit();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    writeSlots(formData.startTime, formData.endTime);
    alert(
      `Slot created for course ${formData.course_no} from ${formData.startTime} to ${formData.endTime}`
    );
  };

  return (
    <div className="container">
      <h4>Create Slot</h4>
      <form onSubmit={handleSubmit} id="slot-form">
        <div className="input-field">
          <input
            id="course_no"
            name="course_no"
            type="text"
            value={formData.course_no}
            onChange={handleChange}
            required
          />
          <label htmlFor="course_no">Course Number</label>
        </div>

        <div className="input-field">
          <input
            id="start_time"
            name="startTime"
            type="datetime-local"
            value={formData.startTime}
            onChange={handleChange}
            required
          />
          <label htmlFor="start_time" className="active">
            Start Time
          </label>
        </div>

        <div className="input-field">
          <input
            id="end_time"
            name="endTime"
            type="datetime-local"
            value={formData.endTime}
            onChange={handleChange}
            required
          />
          <label htmlFor="end_time" className="active">
            End Time
          </label>
        </div>

        <button className="btn waves-effect waves-light" type="submit">
          Create Slot
        </button>
      </form>
    </div>
  );
};

export default SlotCreation;
