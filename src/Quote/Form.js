import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import validateForm from './validateForm'
import axios from 'axios'
import 'react-datepicker/dist/react-datepicker.css'
import './form.scss'

/* Form for the Quote Page */

function Form () {
    // Date State
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    // Navigate Router
    const navigate = useNavigate();

    // Input State
    const [state, setState] = useState({
        policyMax: '0',
        age: '',
        citizenShip: '',
        mailingState: '',
        error: {},
        submitted: false,
    })
    const {policyMax, age, citizenShip, mailingState, error, submitted} = state;

    // Handle input change
    const handleChange = target => e => {
        setState({
            ...state, [target]: e.target.value, error: {}, submitted: false
        })
    }
    // Handle Form Submit
    const handleSubmit = async e => {
        e.preventDefault();
        // Validate form inputs
        const result = validateForm(state, startDate, endDate); 
        setState({
            ...state, 
            error: result, 
            submitted: true
        })
    }
    // Post data to api after input validation
    const sendForm = async () => {
        try {
            const response = await axios.post(process.env.REACT_APP_BACK_API_URL + process.env.REACT_APP_BACK_API_QUOTE, {
                startDate,
                endDate,
                citizenShip,
                policyMax,
                age,
                mailingState
            });
            console.log(response.data);
            navigate('/results');
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        // Submit if correct inputs
        if (Object.keys(error).length === 0 && submitted === true) {
            sendForm();
            
        }
        // Invalid inputs
        else if (Object.keys(error).length !== 0) {
            setState({...state, submitted: false })
        }
    }, [error])

      // Reset Form
      const resetForm = () => {
        setState({
            policyMax: '0',
            age: '',
            citizenShip: '',
            mailingState: '',
            error: {}
        });
        setStartDate(null);
        setEndDate(null);
    };

    // Header with company logo
    const topHeader = (
        <div className='topHeader'>
            <img className='logo' src="/images/logo.png" alt='logo'></img>
            <span className='header'>Travel Insurance</span>
        </div>
        
    );
    // Tooltip image display
    const tooltip = (
        <img className='tooltip' src='/images/tooltip.svg' alt='tooltip'></img>
    );
  
    // Quote input form
    const quoteForm = () => (
        <div>
            <form className='form' onSubmit={handleSubmit}>
                <span>
                    <label>Policy Maximum {tooltip} </label>
                    <select value={policyMax} className='input_box' onChange={handleChange('policyMax')} required>
                        <option disabled value="0">Choose your policy maximum</option>
                        <option value="50">50,000</option>
                        <option value="100">100,000</option>
                        <option value="250">250,000</option>
                        <option value="500">500,000</option>
                    </select>
                    {error.policyMax && <p className='error'>{error.policyMax}</p>}
                </span>
                <span>
                    <label>Age {tooltip}</label>
                    <span className='mobile-age'>
                        <table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Age</th>
                                    <th className='empty'></th>
                           
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th>1</th>
                                    <td><input className='input_box' value={age} onChange={handleChange('age')} type="number"placeholder='age' required></input></td>
                                    <td className='empty'></td>
                                </tr>
                            </tbody>
                            
                        </table>
                    </span>
                    <span className='desktop-age'>
                        <input className='input_box' value={age} onChange={handleChange('age')} type="number"placeholder='Choose your age' required></input>  
                    </span>
                    {error.age && <p className='error'>{error.age}</p>}
                </span>
                <span>
                    <label>Travel Dates (mm/dd/yyyy) {tooltip}</label>
                    <span className='dates'>
                        <DatePicker 
                            selected={startDate}
                            // Reset error message on date change
                            onChange={(date) => {setStartDate(date); setState({...state, error: {}})}}
                            dateFormat='MM/dd/yyyy'
                            placeholderText='Start Date'
                            className='input_box'
                            required
                        />
                        <DatePicker 
                            selected={endDate}
                            // Reset error message on date change
                            onChange={(date) => {setEndDate(date); setState({...state, error: {}})}} 
                            dateFormat='MM/dd/yyyy'
                            placeholderText='End Date'
                            className='input_box'
                            required
                        />
                    </span>
                    {error.endDate && <p className='error'>{error.endDate}</p>}
                    
                </span>
                <span>
                    <label>Citizenship {tooltip}</label>
                    <input className='input_box' value={citizenShip} onChange={handleChange('citizenShip')} 
                        type="text" placeholder='Choose Your Country of Citizenship' pattern="[A-Za-z]*" required></input>
                </span>
                <span>
                    <label>Mailing State {tooltip}</label>
                    <input className='input_box' value={mailingState} onChange={handleChange('mailingState')} 
                        type="text" placeholder='Choose State' pattern="[A-Za-z]*" required></input>
                </span>
                <span className='get_quotes'>
                    <button>GET QUOTES </button>
                </span>
                <span className='reset_form'>
                    <span onClick={resetForm} >Reset Form</span>
                </span>
            </form>
        </div>
    )

    return (
        <div className ='wrapper'>
            {topHeader}
            {quoteForm()}
        </div>
    )
}

export default Form
