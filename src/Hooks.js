import { useState, useRef, useCallback } from 'react';
import axios from 'axios';

const Hooks = () => {
  const [filteredShips, setFilteredShips] = useState([]);
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

      const newShips = shipsWithKeys.filter(
        (ship) => !cache.current.shipsCache[ship.key]
      );

      newShips.forEach((ship) => {
        cache.current.shipsCache[ship.key] = ship;
      });

      cache.current.pageCache[pageCacheKey] = {
        ships: shipsWithKeys.map((ship) => cache.current.shipsCache[ship.key]),
        totalPages,
      };

      setFilteredShips(cache.current.pageCache[pageCacheKey].ships);
      setTotalPages(totalPages);
    } catch (error) {
      console.log(error);
    }
  }, []);

  return { filteredShips, totalPages, fetchShipsByPage };
};

export default Hooks;