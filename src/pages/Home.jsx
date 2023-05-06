import { useContext, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setCategoryId } from '../redux/slices/filterSlice'

import Categories from '../components/Categories'
import Sort from '../components/Sort'
import PizzaBlock from '../components/PizzaBlock'
import Sceleton from '../components/PizzaBlock/Sceleton'
import Pagination from '../components/Pagination'
import { SearchContext } from '../App'

const Home = () => {
  const dispatch = useDispatch()
  const { categoryId, sort } = useSelector(state => state.filter)

  const { searchValue } = useContext(SearchContext)
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  const pizzas = items
    .filter(obj => obj.title.toLowerCase().includes(searchValue.toLowerCase()))
    .map((obj) => <PizzaBlock key={obj.id} {...obj} />)
  const sceleton = [...new Array(4)].map((_, index) => <Sceleton key={index} />)

  const onChangeCategory = (id) => {
    dispatch(setCategoryId(id))
  }

  useEffect(() => {
    setIsLoading(true)

    const category = categoryId ? `category=${categoryId}&` : ''
    const sortBy = sort.sortProperty.replace('-', '')
    const order = sort.sortProperty.includes('-') ? 'asc' : 'desc'
    const search = searchValue ? `&search=${searchValue}` : ''

    const url = `https://64490aa9b88a78a8f0fb660a.mockapi.io/pizzas/items?page=${currentPage}&limit=4&${category}sortBy=${sortBy}&order=${order}${search}`

    fetch(url)
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        setItems(data)
        setIsLoading(false)
      })
    window.scrollTo(0, 0)
  }, [categoryId, sort.sortProperty, searchValue, currentPage])


  return (
    <div className="container">
      <div className="content__top">
        <Categories value={categoryId} onChangeCategory={onChangeCategory} />
        <Sort />
      </div>
      <h2 className="content__title">Все пиццы</h2>
      <div className="content__items">
        {isLoading ? sceleton : pizzas}
      </div>
      <Pagination onChangePage={(number) => setCurrentPage(number)} />
    </div>
  )
}
export default Home