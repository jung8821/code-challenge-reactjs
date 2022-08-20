import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'
import './results.scss'

// Sort Data
const sortData = (data, sortType) => {
    let sortedData = [...data]

    // Compare by sort type
    switch (sortType) {
        case 'sort': break;
        case 'name': sortedData.sort((a, b) => a[sortType].localeCompare(b[sortType]));
            break;
        case 'lowToHighPrice': sortedData.sort((a, b) => a['price'] - b['price']);
            break;
        case 'HighToLowPrice': sortedData.sort((a, b) => b['price'] - a['price']);
            break;
        default: break;
    }

    return { quotes: sortedData };
}

// Filter Data
const filterData = (data, filter) => {
    let tempData = [...data]

    // Filter the data with the filter settings
    let checkFilter = (e) => {// NOTE: PolicyMax do not exist in the mockData
        return (//(filter.policyMax === '0'? e.policyMax === e.policyMax : e.policyMax === filter.policyMax)&& 
            (filter.type === 'anyType' ? e.type === e.type : e.type === filter.type) &&
            (filter.section === 'anySection' ? e.section === e.section : e.section === filter.section) &&
            (filter.bestSeller === false ? e.bestSellers === e.bestSellers : e.bestSellers === filter.bestSeller));
    }
    const filteredData = tempData.filter(checkFilter)

    return { filteredData: filteredData };
}
// Sort Options Component
const SortOption = (props) => {
    const { setSortType } = props; // function to setSortType in Results function

    // Set SortType state in Results by the sort type
    const handleSortChange = (target) => {
        setSortType(target);
    }
    return (
        <select className='sort_select' defaultValue='sort' onChange={(e) => handleSortChange(e.target.value)}>
            <option value='sort' disabled>Sort by</option>
            <option value='name'>Name</option>
            <option value='lowToHighPrice'>Price Low to High</option>
            <option value='HighToLowPrice'>Price High to low</option>
        </select>
    )

}

// Filter Options Component
const FilterOption = (props) => {
    const { filter, setFilterData } = props; // function to setFilter in Results function

    // Handle all the filter change except bestseller
    const handleFilterChange = target => e => {
        setFilterData(target, e.target.value)
    }
    // // Handle bestseller checkbox
    const handleBestSeller = () => {
        setFilterData('bestSeller', !filter.bestSeller);
    }

    return (
        <div className='filter_container'>
            <div>
                <input type="checkbox" checked={filter.bestSeller} onChange={handleBestSeller}></input>
                <label> BestSeller</label>
            </div>
            <div>
                <select defaultValue='anyType' className='input_box' onChange={handleFilterChange('type')}>
                    <option value="anyType">Any Type</option>
                    <option value="Comprehensive">Comprehensive</option>
                    <option value="Fixed">Fixed</option>
                </select>
            </div>
            <div>
                <select defaultValue='anySection' className='input_box' onChange={handleFilterChange('section')}>
                    <option value="anySection">Any Section</option>
                    <option value="Travel Medical">Travel Medical</option>
                    <option value="International Travel Medical">International Travel Medical</option>
                    <option value="Student Medical">Student Medical</option>
                    <option value="J1 Medical">J1 Medical</option>
                </select>
            </div>
        </div>

    )
}
// View Options Component
const ViewOption = (props) => {
    const { viewType, setViewType } = props

    // Send the view change option back to Results
    const handleViewClick = (e) => {
        setViewType(e.target.value)
    }
    return (
        <div>
            <button className={"view-button list_button " + ((viewType === 'list') && "list")}
                value='list' onClick={handleViewClick}></button>
            <button className={"view-button grid_button " + ((viewType === 'grid') && "grid")}
                value='grid' onClick={handleViewClick}></button>
        </div>
    )
}

// Component for displaying plans
const PlanContainer = (props) => {
    const { filteredData } = filterData(props.quotes, props.filter) // get filtered data
    const { quotes } = sortData(filteredData, props.sortType) // get sorted and filtered data
    const [selected, setSelected] = useState([]);
    const [isDisabled, setDisabled] = useState(false);
    const viewType = props.viewType;
    const { setViewType } = props;
    const { setSortType } = props;

    const navigate = useNavigate();

    // Handle selected checkboxes
    const handleSelected = e => {
        const selectedIndex = selected.indexOf(e.target.value);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, e.target.value);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
    }
    // Handle Compare button
    const handleCompare = () => {
        let compareData = [];

        const findData = (item) => {
            let pulledData = quotes.find((id) => { return id.id.toString() === item });
            compareData.push(pulledData)
        }
        selected.forEach(findData)

        // Route to Compare page with the data
        navigate('/results/compare', { state: compareData });
    }

    // Set isDisabled to disable checkboxes after 4 selections
    useEffect(() => {
        if (selected.length > 3) {
            setDisabled(true);
        }
        else {
            setDisabled(false)
        }

    }, [selected])

    return (<>
        <div className='title_container'>
            <h1>Comprehensive Coverage Plans</h1>
            <button className='compare_button'
                disabled={selected.length < 2 || selected.length > 4}
                onClick={handleCompare}>Comapre</button>
            <div className='view_option_container'>
                <ViewOption viewType={viewType} setViewType={setViewType} />
            </div>
            <div className='sort_container'>
                <SortOption setSortType={setSortType} />
            </div>

        </div>

        <div className={"quote_container " + (viewType === 'list' ? ((viewType === 'list') && "list") : ((viewType === 'grid') && "grid"))}>
            {quotes.map(quotes => {
                return <div key={quotes.id} className='quote_wrapper'>
                    <div>{quotes.bestSellers === true ? 'Best Seller' : ''}</div>
                    <div className='checkbox'>
                        <label>Compare</label>
                        <input type="checkbox" value={quotes.id} disabled={isDisabled && !selected.includes(quotes.id.toString())} onChange={handleSelected}></input>
                    </div>
                    <div className='quote_header_wrapper'>
                        <div className='quote_name'>{quotes.name}</div>
                        <div className='quote_price'>${quotes.price}</div>
                    </div>
                    <div className='quote_body'>
                        <div><img src="/images/checkmark.png" alt="check" />{quotes.description}</div>
                        <div><img src="/images/checkmark.png" alt="check" />{quotes.type}</div>
                        <div><img src="/images/checkmark.png" alt="check" />{quotes.section}</div>
                    </div>

                </div>
            })}
        </div>
    </>
    )
}

/*--------Main Results Page--------*/
export default function Results() {
    const location = useLocation();
    // States
    const [data, setData] = useState(location.state || []); // quotes
    const [sortType, setSortType] = useState('sort'); // Sort by name, age, price
    const [viewType, setViewType] = useState('list'); // List or Grid View
    const [filter, setFilter] = useState({
        policyMax: '0',
        type: 'anyType',
        section: 'anySection',
        bestSeller: false
    })

    // Get quotes from back end
    const handleGetData = async () => {
        try {
            await axios.get(process.env.REACT_APP_BACK_API_URL + process.env.REACT_APP_BACK_API_QUOTE)
                .then(res => setData(res.data.quotes))

        } catch (err) {
            console.log(err)
        }
    }
    // To set sort type from SortOption function
    const handleSetSortType = (type) => {
        setSortType(type)
    }
    // To filter data from FilterOption function
    const handleFilterData = (state, filters) => {
        setFilter({
            ...filter,
            [state]: filters,
        })
    }
    // To change view settings
    const handleViewType = (view) => {
        setViewType(view)
    }

    // Pull initial data from the server
    useEffect(() => {
        if (!data.length) handleGetData();

    }, [data])

    return (
        <div>
            <FilterOption filter={filter} setFilterData={handleFilterData} />
            <PlanContainer quotes={data}
                sortType={sortType}
                filter={filter}
                viewType={viewType}
                setViewType={handleViewType}
                setSortType={handleSetSortType} />

        </div>
    )
}


