import React, { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';
import moment from 'moment';
import Modal from './Modal';
import debounce from 'lodash.debounce';
import './App.css';

function App() {
  moment.locale('ru');
  const [filteredShips, setFilteredShips] = useState([]);
  const [selectedShipIndex, setSelectedShipIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const cache = useRef({
    pageCache: {}, 
    shipsCache: {}, 
  });

  const fetchShipsByPage = useCallback(async (pageCache, shipsCache) => {
    const pageCacheKey = `Page${pageCache}_ship_${shipsCache}`;
    
    if (cache.current.pageCache[pageCacheKey]) {
      setFilteredShips(cache.current.pageCache[pageCacheKey].ships);
      setTotalPages(cache.current.pageCache[pageCacheKey].totalPages);
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:3000/api/getShipsByPage', {
        currentPage: pageCache,
        itemsPerPage: shipsCache,
      });
  
      const { ships, totalPages } = response.data;
  

      const shipsWithKeys = ships.map((ship, index) => ({
        ...ship,
        key: `${ship.name}_${index}`,
      }));
  
      const newShips = shipsWithKeys.filter(ship => 
        !cache.current.shipsCache[ship.key]
      );
      
      newShips.forEach(ship => {
        cache.current.shipsCache[ship.key] = ship;
      });
  
      cache.current.pageCache[pageCacheKey] = { 
        ships: shipsWithKeys.map(ship => cache.current.shipsCache[ship.key]),
        totalPages 
      };
  
      setFilteredShips(cache.current.pageCache[pageCacheKey].ships);
      setTotalPages(totalPages);
  
    } catch (error) {
      console.log(error);
    }
  }, []);

  const debouncedFetchShipsByPage = useCallback(
    debounce((page, perPage) => fetchShipsByPage(page, perPage), 100),
    [fetchShipsByPage]
  );

  useEffect(() => {
    debouncedFetchShipsByPage(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage, debouncedFetchShipsByPage]);

  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = Number(e.target.value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const openModal = (index) => {
    setSelectedShipIndex(index);
  };

  const closeModal = () => {
    setSelectedShipIndex(null);
  };

  const goToNextModal = () => {
    if (selectedShipIndex !== null && selectedShipIndex < filteredShips.length - 1) {
      const newIndex = selectedShipIndex + 1;
      setSelectedShipIndex(newIndex);
      const newPage = Math.ceil((newIndex + 1) / itemsPerPage);
      setCurrentPage(newPage);
    }
  };

  const goToPrevModal = () => {
    if (selectedShipIndex !== null && selectedShipIndex > 0) {
      const newIndex = selectedShipIndex - 1;
      setSelectedShipIndex(newIndex);
      const newPage = Math.ceil((newIndex + 1) / itemsPerPage);
      setCurrentPage(newPage);
    }
  };

  const generatePagination = () => {
    const pages = [];
    pages.push(1);

    if (currentPage > 4) {
      pages.push('...');
    }

    const start = Math.max(2, currentPage - 2);
    const end = Math.min(totalPages - 1, currentPage + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 3) {
      pages.push('...');
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = generatePagination();

  return (
    <div className="app">
      {filteredShips.map((ship, index) => (
        <div
          className={`item-container ${selectedShipIndex === index ? 'active' : ''}`}
          key={ship.name}
          onClick={() => openModal(index)}
        >
          <h1>{ship.name}</h1>
          <p className="model">{ship.model}</p>
          <p className="manufacturer">{ship.manufacturer}</p>
          <p className="created" type="date">
            {moment(ship.created).format('DD:MM:YYYY HH:mm:ss')}
          </p>
        </div>
      ))}
  

      <div className="pagination">
        {pages.map((page, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(page)}
            className={currentPage === page ? 'active' : ''}
            disabled={page === '...'}
          >
            {page}
          </button>
        ))}
  
        <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
          <option value={1}>1 элемент</option>
          <option value={6}>6 элементов</option>
          <option value={12}>12 элементов</option>
          <option value={17}>17 элементов</option>
          <option value={18}>18 элементов</option>
        </select>
      </div>
  
      <Modal isOpen={selectedShipIndex !== null} onClose={closeModal}>
        {selectedShipIndex !== null && (
          <>
            <h1>Информация о корабле: {filteredShips[selectedShipIndex].name}</h1>
            <p>Модель: {filteredShips[selectedShipIndex].model}</p>
            <p>Изготовитель: {filteredShips[selectedShipIndex].manufacturer}</p>
            <p>Стоимость: {filteredShips[selectedShipIndex].cost_in_credits}</p>
            <p>Длина: {filteredShips[selectedShipIndex].length}</p>
            <p>Макс скорость: {filteredShips[selectedShipIndex].max_atmosphering_speed}</p>
            <p>Кол-во пассажиров: {filteredShips[selectedShipIndex].crew}</p>
            <p>Кол-во пассажиров: {filteredShips[selectedShipIndex].passengers}</p>
            <p>Грузоподъемность: {filteredShips[selectedShipIndex].cargo_capacity}</p>
            <p>Срок годности(гарантия): {filteredShips[selectedShipIndex].consumables}</p>
            <p>Гипперпрыжок рейтинг: {filteredShips[selectedShipIndex].hyperdrive_rating}</p>
            <p>MGLT: {filteredShips[selectedShipIndex].MGLT}</p>
            <p>Класс корабля: {filteredShips[selectedShipIndex].starship_class}</p>
            <p>Пилоты: {filteredShips[selectedShipIndex].pilots}</p>
            <p>Фильмы: {filteredShips[selectedShipIndex].films + "\n"}</p>
            <p>Спроектирован: {moment(filteredShips[selectedShipIndex].created).format('DD:MM:YYYY HH:mm:ss')}</p>
            <p>Выпущен: {moment(filteredShips[selectedShipIndex].edited).format('DD:MM:YYYY HH:mm:ss')}</p>
            <div className="modal-navigation">
              {selectedShipIndex > 0 && (
                <button onClick={goToPrevModal} className="modal-arrow left">
                  ←
                </button>
              )}
              {selectedShipIndex < filteredShips.length - 1 && (
                <button onClick={goToNextModal} className="modal-arrow right">
                  →
                </button>
              )}
            </div>
            <button onClick={closeModal}>Закрыть</button>
          </>
        )}
      </Modal>
    </div>
  );
}

export default App;





/*
  useEffect(() => {
    const calculateItemsPerPage = () => {
      const itemHeight = 200; // Примерная высота одного элемента
      const itemWidth = 500;
      const containerHeight = window.innerHeight - 100; // Высота контейнера (учитывайте отступы и другие элементы)
      const containerWidth = window.innerWidth - 200;
      const itemsPerRow = Math.floor(containerWidth / itemWidth);
      const rowsPerPage = Math.floor(containerHeight / itemHeight);
      const newItemsPerPage = itemsPerRow * rowsPerPage;
      setItemsPerPage(newItemsPerPage);
    };



function App() {
  const DataLoading =  OnLoadingDataShips(DataShips);

  const [ships, setShips] = useState(
    {
      loading: true,
      ships: !null,
    }
  )



  useEffect(() => {
    const apiUrl = 'http://localhost:3000/api/getAllShips';
    axios.get(apiUrl).then((resp) => {
      const allShips = resp.data;
      setShips(allShips);
    });
  }, [setShips]);


  return (
    <div className="app">
        <DataLoading isLoading={ships.loading} ships={ships.ships} />
    </div>
  );
}
*/


            /*
            const newwind = window.open();
            newwind.document.write(`
              <div className=${"allinfo"}>
              <h1>Информация о корабле: ${ship.name}</h1>
              <p>Модель: ${ship.model}</p>
              <p>Изготовитель: ${ship.manufacturer}</p>
              <p>Стоимость: ${ship.cost_in_credits}</p>
              <p>Длина: ${ship.length}</p>
              <p>Макс скорость${ship.max_atmosphering_speed}</p>
              <p>Кол-во пассажиров: ${ship.crew}</p>
              <p>Кол-во пассажиров: ${ship.passengers}</p>
              <p>Грузоподъемность: ${ship.cargo_capacity}</p>
              <p>Срок годности(гарантия): ${ship.consumables}</p>
              <p>Гипперпрыжок рейтинг: ${ship.hyperdrive_rating}</p>
              <p>MGLT: ${ship.MGLT}</p>
              <p>Класс корабля: ${ship.starship_class}</p>
              <p>Пилоты: ${ship.pilots}</p>
              <p>Фильмы: ${ship.films}</p>
              <p>Спроектирован: ${moment(ship.created).format('YYYY-MM-DD HH:MM:SS')}</p>
              <p>Выпущен: ${moment(ship.edited).format('YYYY-MM-DD HH:MM:SS')}</p>
              </div>
              `);
            newwind.document.close();*/



