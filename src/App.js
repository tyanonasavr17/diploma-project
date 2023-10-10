import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import "./App.css"

function App() {
    const [industries,setIndustries] = useState([]);
    const [subsectors,setSubsectors] = useState([]);
    const [companies, setCompanies] = useState([]);

    useEffect(() => {
        fetchCompanies();
        fetchIndustries();
        fetchSubsectors();
    }, []);

    // Загрузка данных компаний
    const fetchIndustries = () => {
        fetch('/industries')
            .then((response) => response.json())
            .then((data) => setIndustries(data))
            .catch((error) => console.error(error));
    };

    // Загрузка данных компаний
    const fetchSubsectors = () => {
        fetch('/subsectors')
            .then((response) => response.json())
            .then((data) => setSubsectors(data))
            .catch((error) => console.error(error));
    };

    // Загрузка данных компаний
    const fetchCompanies = () => {
        fetch('/companies')
            .then((response) => response.json())
            .then((data) => setCompanies(data))
            .catch((error) => console.error(error));
    };

    const [selectedIndustry, setSelectedIndustry] = useState('');
    const [selectedSubsector, setSelectedSubsector] = useState('');
    const handleIndustryChange = (event) => {
        setSelectedIndustry(event.target.value);
    }

    const handleSubsectorChange = (event) => {
        setSelectedSubsector(event.target.value);
    }

    const radioButtonsRef = useRef(null); // Создаем ref для радиокнопок
    const [radioButtonValues, setRadioButtonValues] = useState(false);

    const handleResetClick = () => {
        // Сбросить значения всех радиокнопок на начальное значение
        if (radioButtonsRef.current) {
            const radioButtons = radioButtonsRef.current.querySelectorAll('input[type="radio"]');
            setCity('')
            radioButtons.forEach((radio) => {
                sethasWebsite(false);
                setdescriptionLength(false);
            });
        }

        // Сбросить состояние радиокнопок на начальное значение
        setRadioButtonValues(false);
    }


    const [hasWebsite, sethasWebsite] = useState(false);
    const [descriptionLength, setdescriptionLength] = useState(false);

    const handleRadioButtonChange = (event) => {
        const value = event.target.value
        if (value === 'city') {
            sethasWebsite(false);
            setdescriptionLength(false);
        } else if (value === 'website') {
            sethasWebsite(true);
            setdescriptionLength(false);
        } else if (value === 'description') {
            sethasWebsite(false);
            setdescriptionLength(true);
        }
    }

    const [city, setCity] = useState('');
    const handleCityFieldChange = (event) => {
        setCity(event.target.value);
    }

    const sendDataToBackend = async () => {
        try {
            const params = {
                industry_id: selectedIndustry,
                subsector_id: selectedSubsector,
                city: city,
                has_website: hasWebsite,
                description_length: descriptionLength
            };
            const response = await axios.get('/companies', { params });
            console.log(response.data);
            setCompanies(response.data)
            // Дополнительная обработка полученных данных
        } catch (error) {
            console.error(error);
            // Обработка ошибки
        }
    }
    const handleClick = () => {
        sendDataToBackend();
    };
    return (
        <div>
            <div className="text-box">
                <h1>Российские компании </h1>
                <br></br>
                <button id="sendButton" className="round-button-main" onClick={handleClick}>Поиск</button>


            {/* Фильтры */}
            <div className="filters">
                <button id="resetButton" className="round-button" onClick={handleResetClick}>Сбросить фильтры</button>
                <div className="sectors">
                    <label>Индустрии:</label>
                    <select value={selectedIndustry} onChange={handleIndustryChange}>
                        <option value="">Все</option>
                        {industries.map((industry) => (
                            <option key={industry.id} value={industry.id}>
                                {industry.name}
                            </option>
                        ))}
                    </select>
                    &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
                    <label>
                        Сферы деятельности:
                    </label>
                    <select value={selectedSubsector} onChange={handleSubsectorChange}>
                        <option value="">Все</option>
                        {subsectors
                            .filter((sector) => sector.industry_id === Number(selectedIndustry))
                            .map((sector) => (
                                <option key={sector.id} value={sector.id}>
                                    {sector.name}
                                </option>
                            ))}
                    </select>
                </div>

                <div className="sectors" ref={radioButtonsRef}>
                    <label>
                        Фильтровать по:
                    </label>
                    &emsp; &emsp; &emsp; &emsp;
                <label>
                    городу
                    &emsp;
                    <input
                        type="text"
                        name="cityname"
                        value={city}
                        onChange={handleCityFieldChange}
                    />
                </label>
                    &emsp; &emsp; &emsp; &emsp;

                <label>
                    наличию веб-сайта
                    <input
                        type="radio"
                        name="options"
                        value="website"
                        checked={hasWebsite === true}
                        onChange={handleRadioButtonChange}
                    />
                </label>
                    &emsp; &emsp; &emsp; &emsp;
                    <label title="Сначала выводятся компании с наиболее подробным описанием">
                        описанию
                        <input
                            type="radio"
                            name="options"
                            value="description"
                            checked={descriptionLength === true}
                            onChange={handleRadioButtonChange}
                        />
                    </label>
                </div>
            </div>
            {/* Таблица компаний */}
            </div>
            <div className="table-container">
                <table className="table">
                    <thead>
                    <tr>
                        <th style={{border: '1px solid black'}}>Название</th>
                        <th style={{border: '1px solid black'}}>Описание</th>
                        <th style={{border: '1px solid black'}}>Адрес</th>
                        <th style={{border: '1px solid black'}}>Веб-сайт</th>
                        <th style={{border: '1px solid black'}}>Телефон</th>
                    </tr>
                    </thead>
                    <tbody>
                    {companies.map((company) => (
                        <tr key={company.id}>
                            <td style={{border: '1px solid black'}}>{company.name}</td>
                            <td style={{border: '1px solid black'}}>{company.description}</td>
                            <td style={{border: '1px solid black'}}>{company.address}</td>
                            <td style={{border: '1px solid black'}}>
                                <a href={company.website}>{company.website}</a>
                            </td>
                            <td style={{border: '1px solid black'}}>{company.phone}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <div className="footer">
                <div className="sticker"></div>
                <div className="square"></div>
                <div className="square"></div>
                <div className="square"></div>
                <div className="square"></div>
                <div className="square"></div>
                <div className="square"></div>
            </div>
        </div>
    );
}

export default App;