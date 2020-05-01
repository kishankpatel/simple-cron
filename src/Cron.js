import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';

function Cron(props) {
  const [repeatType, setRepeatType] = useState('');
  const [triggerAT, setTriggerAT] = useState(props.selectedDate || null);
  const [repeatOptions, setRepeatOptions] = useState([]);
  const [parsedData, updateParsedData] = useState({});

  const setTriggerPeriod = (date) => {
    if (!date) {
      return;
    }
    updateParsedData({
      min: date.getMinutes(),
      hour: date.getHours(),
      day: date.getDay(),
      date: date.getDate(),
      month: date.getMonth() + 1
    })

    let dateString = moment(date).format('MMMM Do dddd').split(" ");
    setRepeatOptions([
      {
        value: "",
        text: "-Select-",
      },
      {
        value: "no_repeat",
        text: "Doesn't repeat",
      },
      {
        value: "daily",
        text: "Daily",
      },
      {
        value: "weekly",
        text: `Weekly on ${dateString[2]}`,
      },
      {
        value: "monthly",
        text: `Monthly on ${dateString[1]}`,
      },
      {
        value: "anually",
        text: `Anually on ${dateString[0]} ${dateString[1]}`
      }
    ]);
  }
  const setExpression = (data, type, triggerAT) => {
    let expression = '';
    switch(type) {
      case 'daily':
        expression = `${data.min} ${data.hour} * * *`;
        break;
      case 'weekly':
        expression = `${data.min} ${data.hour} * * ${data.day}`;
        break;
      case 'monthly':
        expression = `${data.min} ${data.hour} ${data.date} * *`;
        break;
      default://annually | no_repeat
        expression = `${data.min} ${data.hour} ${data.date} ${data.month} *`;
    }
    props.onChange({value: expression, type: type, selectedDate: triggerAT})
  }

  const resetExpression = () => {
    setRepeatType('');
    props.onChange({value: '', type: '', selectedDate: triggerAT})
  }

  useEffect(() => {
    setTriggerPeriod(props.selectedDate)
  }, [props.selectedDate]);

  return (
    <>
      <div>
        <div className="form-group mb-0">
          <label>{props.labels ? props.labels.triggerAT : 'Trigger At'}</label>
          <DatePicker
            selected={triggerAT}
            name='triggerAt'
            onChange={ value => {
              setTriggerAT(value);
              resetExpression();
              setTriggerPeriod(value);
            }}
            showTimeSelect
            dateFormat="Pp"
          />
        </div>
        { repeatOptions.length !== 0 &&
          <div className="form-group mb-0">
            <label>{props.labels ? props.labels.repeat : 'Repeat'}</label>
            <select
              className="kt-width-full"
              name="repeatType"
              onChange={ data => {
                setRepeatType(data.target.value);
                setExpression(parsedData, data.target.value, triggerAT);
              }}
              value={repeatType}
            >
              {repeatOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.text}
                </option>
              ))}
            </select>
          </div>
        }
      </div>
    </>
  );
}

export default Cron;
