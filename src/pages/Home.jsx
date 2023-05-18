import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import qs from 'qs'

import { useSelector, useDispatch } from 'react-redux'
import { setCategoryId, setCurrentPage, setFilters } from '../redux/slices/filterSlice'
import { fetchPizzas } from '../redux/slices/pizzasSlice'

import Categories from '../components/Categories'
import Sort, { sortList } from '../components/Sort'
import PizzaBlock from '../components/PizzaBlock'
import Skeleton from '../components/PizzaBlock/Skeleton'
import Pagination from '../components/Pagination'

const Home = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const isSearch = useRef(false)
  const isMounted = useRef(false)

  const { items, status } = useSelector(state => state.pizzas)
  const { categoryId, sort, currentPage } = useSelector(state => state.filter)
  const { searchValue } = useSelector(state => state.filter)


  const onChangeCategory = useCallback((idx) => {
    dispatch(setCategoryId(idx))
  }, [dispatch])

  const onChangePage = (page) => {
    dispatch(setCurrentPage(page))
  }

  const getPizzas = async () => {

    const sortBy = sort.sortProperty.replace('-', '')
    const order = sort.sortProperty.includes('-') ? 'asc' : 'desc'
    const category = categoryId > 0 ? `category=${categoryId}` : ''
    const search = searchValue ? `search=${searchValue}` : ''

    dispatch(fetchPizzas({
      sortBy, order, category, search, currentPage
    }))

    window.scrollTo(0, 0)
  }

  // Если изменили параметры и был первый рендер
  useEffect(() => {
    if (isMounted.current) {
      const queryString = qs.stringify({
        sortProperty: sort.sortProperty,
        categoryId,
        currentPage,
      })

      navigate(`?${queryString}`)
    }
    isMounted.current = true
  }, [categoryId, sort.sortProperty, currentPage, navigate])

  // Если был первый рендер, то проверяем URl-параметры и сохраняем в редуксе
  useEffect(() => {
    if (window.location.search) {
      const params = qs.parse(window.location.search.substring(1))

      const sort = sortList.find((obj) => obj.sortProperty === params.sortProperty)

      dispatch(
        setFilters({
          ...params,
          sort,
        }),
      )
      isSearch.current = true
    }
  }, [])

  // Если был первый рендер, то запрашиваем пиццы
  useEffect(() => {
    if (!isSearch.current) {
      getPizzas()
    }

    isSearch.current = false
  }, [categoryId, sort.sortProperty, searchValue, currentPage])

  const pizzas = items.map((obj) => <PizzaBlock key={obj.id} {...obj} />)

  const skeletons = [...new Array(4)].map((_, index) => <Skeleton key={index} />)

  return (
    <div className="container">
      <div className="content__top">
        <Categories value={categoryId} onChangeCategory={onChangeCategory} />
        <Sort />
      </div>
      <h2 className="content__title">Все пиццы</h2>
      {status === 'error'
        ? (
          <div className='content__error-info'>
            <h2>Произошла ошибка 😬</h2>
            <br />
            <p>Не удалось получить пиццы. Попробуйте повторить попытку позже.</p>
          </div>
        ) : (
          <div className="content__items">
            {status === 'pending' ? skeletons : pizzas}
          </div>
        )}

      <Pagination currentPage={currentPage} onChangePage={onChangePage} />
    </div>
  )
}
export default Home

