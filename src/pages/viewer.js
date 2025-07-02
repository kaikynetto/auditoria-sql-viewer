import React, { useState, useMemo, useEffect } from 'react'
import styled from 'styled-components'
import { useTable } from 'react-table'

export default function Viewer() {
  const [data, setData] = useState([])
  const [visibleRows, setVisibleRows] = useState(50)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [minBuyIn, setMinBuyIn] = useState('')
  const [maxBuyIn, setMaxBuyIn] = useState('')
  const [networkFilter, setNetworkFilter] = useState('')
  const [speedFilter, setSpeedFilter] = useState('')
  const [playerFilter, setPlayerFilter] = useState('')
  const [sortOrder, setSortOrder] = useState('desc')
  const [isClient, setIsClient] = useState(false)
  const pageSize = 50
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setIsClient(true)
    const fetchData = async () => {
      try {
        const response = await fetch('/api/tournaments')
        if (!response.ok) throw new Error('Erro ao buscar dados')
        const data = await response.json()
        setData(data)
        setLoading(false)
      } catch (error) {
        console.error('Erro ao buscar dados do banco:', error)
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    setVisibleRows(pageSize)
  }, [startDate, endDate, minBuyIn, maxBuyIn, networkFilter, speedFilter, playerFilter, sortOrder])

  const columns = useMemo(
    () => [
      { Header: 'Date', accessor: 'report_date' },
      { Header: 'Player', accessor: 'player' },
      { Header: 'Profit', accessor: 'profit' },
      { Header: 'Buy-in', accessor: 'buy_in' },
      { Header: 'Game', accessor: 'game' },
      { Header: 'Stake', accessor: 'stake' },
      { Header: 'Network', accessor: 'network' },
      { Header: 'Currency', accessor: 'currency' },
      { Header: 'Shots', accessor: 'shots' },
      { Header: 'Tournament ID', accessor: 'tournament_id' },
      { Header: 'Structure', accessor: 'structure' },
      { Header: 'Flags', accessor: 'flags' },
      { Header: 'Rake', accessor: 'rake' },
      { Header: 'Position', accessor: 'position' },
      { Header: 'Speed', accessor: 'speed' }
    ],
    []
  )

  const filteredData = useMemo(() => {
    if (!isClient) return data

    let result = data.filter(item => {
      const itemDate = new Date(item.report_date.split('/').reverse().join('-'))
      const start = startDate ? new Date(startDate) : null
      const end = endDate ? new Date(endDate) : null

      if (start && itemDate < start) return false
      if (end && itemDate > end) return false

      const buyInValue = parseFloat(item.buy_in)
      const minBuyInValue = minBuyIn ? parseFloat(minBuyIn) : null
      const maxBuyInValue = maxBuyIn ? parseFloat(maxBuyIn) : null

      if (minBuyInValue && buyInValue < minBuyInValue) return false
      if (maxBuyInValue && buyInValue > maxBuyInValue) return false

      if (networkFilter && item.network !== networkFilter) return false
      if (speedFilter && item.speed !== speedFilter) return false
      if (playerFilter && !item.player.toLowerCase().includes(playerFilter.toLowerCase())) return false

      return true
    })

    result.sort((a, b) => {
      const dateA = new Date(a.report_date.split('/').reverse().join('-'))
      const dateB = new Date(b.report_date.split('/').reverse().join('-'))
      return sortOrder === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime()
    })

    return result
  }, [data, startDate, endDate, minBuyIn, maxBuyIn, networkFilter, speedFilter, playerFilter, sortOrder, isClient])

  const tableData = useMemo(() => filteredData.slice(0, visibleRows), [filteredData, visibleRows])

  const tableInstance = useTable({ columns, data: tableData })

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance

  const loadMore = () => setVisibleRows(prev => prev + pageSize)

  return (
    <ViewerBackground>
      <FilterArea>
        <label>
          Ordenar por data:
          <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
            <option value="desc">Mais recente</option>
            <option value="asc">Mais antigo</option>
          </select>
        </label>
        <label>
          De:
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
        </label>
        <label>
          Até:
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
        </label>
        <label>
          Buy-in Mínimo:
          <input type="number" value={minBuyIn} onChange={e => setMinBuyIn(e.target.value)} />
        </label>
        <label>
          Buy-in Máximo:
          <input type="number" value={maxBuyIn} onChange={e => setMaxBuyIn(e.target.value)} />
        </label>
        <label>
          Network:
          <select value={networkFilter} onChange={e => setNetworkFilter(e.target.value)}>
            <option value="">Todas</option>
            <option value="PartyPoker">PartyPoker</option>
            <option value="iPoker">iPoker</option>
            <option value="888Poker">888Poker</option>
            <option value="PokerStars">PokerStars</option>
            <option value="WPN">WPN</option>
            <option value="Chico">Chico</option>
            <option value="PokerStars(FR-ES-PT)">PokerStars(FR-ES-PT)</option>
            <option value="Revolution">Revolution</option>
            <option value="GGNetwork">GGNetwork</option>
          </select>
        </label>
        <label>
          Speed:
          <select value={speedFilter} onChange={e => setSpeedFilter(e.target.value)}>
            <option value="">Todas</option>
            <option value="Normal">Normal</option>
            <option value="Turbo">Turbo</option>
            <option value="Super Turbo">Super Turbo</option>
          </select>
        </label>
        <label>
          Jogador:
          <input type="text" value={playerFilter} onChange={e => setPlayerFilter(e.target.value)} />
        </label>
      </FilterArea>

      <TableContainer>
        {loading ? (
          <LoadingContainer>
            <div className="spinner"></div>
            <p>Carregando...</p>
          </LoadingContainer>
        ) : (
          <>
            <StyledTable {...getTableProps()}>
              <thead>
                {headerGroups.map(headerGroup => (
                  <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                      <Th key={column.id} {...column.getHeaderProps()}>{column.render('Header')}</Th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {rows.map(row => {
                  prepareRow(row)
                  return (
                    <tr key={row.id} {...row.getRowProps()}>
                      {row.cells.map(cell => (
                        <Td key={cell.column.id} {...cell.getCellProps()}>{cell.render('Cell')}</Td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            </StyledTable>
            {visibleRows < filteredData.length && (
              <LoadMoreButton onClick={loadMore}>Carregar mais</LoadMoreButton>
            )}
          </>
        )}
      </TableContainer>
    </ViewerBackground>
  )
}

const ViewerBackground = styled.div`
  min-height: 100vh;
  padding: 2rem;
  background-color: #121212;
  color: #fff;
`

const FilterArea = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
  label {
    display: flex;
    flex-direction: column;
    font-size: 0.9rem;
    color: #ccc;
    input, select {
      margin-top: 0.2rem;
      padding: 0.3rem;
      border-radius: 4px;
      border: 1px solid #444;
      background-color: #1e1e1e;
      color: #fff;
    }
  }
`

const TableContainer = styled.div`
  max-height: 80vh;
  overflow-y: auto;
  border: 1px solid #444;
  border-radius: 12px;
`

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`

const Th = styled.th`
  padding: 12px;
  background-color: #1e1e1e;
  position: sticky;
  top: 0;
  z-index: 1;
  text-align: left;
  font-weight: bold;
  color: #fff;
`

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #333;
  color: #ccc;
`

const LoadMoreButton = styled.button`
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  background-color: #2e2e2e;
  color: white;
  border: none;
  cursor: pointer;
  &:hover {
    background-color: #444;
  }
`

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  flex-direction: column;
  .spinner {
    border: 4px solid rgba(255, 255, 255, 0.1);
    border-top: 4px solid #fff;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
  }
  p {
    margin-top: 10px;
    color: #ccc;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`
