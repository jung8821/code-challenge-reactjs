import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './compare.scss'

/*-----Compare Quote Data Component-----*/
export default function Compare() {
    let location = useLocation();
    const quotesData = location.state;
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate("/results");
    }
    return (
        <div className='compare-page'>
            <h1>Comparing {quotesData.length} Plans</h1>
            <div className='container'>
                <table className='wrapper head'>
                    <thead>
                        <tr><th className='no_border'></th></tr>
                        <tr><th className='desc'>Description:</th></tr>
                        <tr><th>Price: </th></tr>
                        <tr><th>Plan Type:</th></tr>
                        <tr><th>Selection:</th></tr>
                        <tr><th>Best Seller:</th></tr>
                    </thead>
                    
                </table>
                {quotesData.map(quotes => {
                    return <table key={quotes.id} className='wrapper'>
                            <tbody>
                                <tr className={"quoteName " + ((quotesData.findIndex((item)=>item.id === quotes.id) === 0) && "one") + " " + 
                                ((quotesData.findIndex((item)=>item.id === quotes.id) === 1) && "two") + " " + 
                                ((quotesData.findIndex((item)=>item.id === quotes.id) === 2) && "three") + " " + 
                                ((quotesData.findIndex((item)=>item.id === quotes.id) === 3) && "four") 
                                }>
                                    <th>{quotes.name}</th></tr>
                                <tr><td>{quotes.description}</td></tr>
                                <tr><td>{quotes.price}</td></tr>
                                <tr><td>{quotes.type}</td></tr>
                                <tr><td>{quotes.section}</td></tr>
                                <tr><td>{quotes.bestSellers === true ? 'True' : 'False'}</td></tr>
                            </tbody>
                    </table>
                })}
            </div>
            <button onClick={handleGoBack}>Go Back</button>
        </div>
    )
}
