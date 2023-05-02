import { useEffect, useState } from 'react'

import Categories from '../components/Categories'
import Sort from '../components/Sort'
import PizzaBlock from '../components/PizzaBlock'
import Sceleton from '../components/PizzaBlock/Sceleton'

const Home = () => {
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [categoryID, setCategoryID] = useState(0)
  const [sort, setSort] = useState({
    name: 'популярность',
    sortProperty: 'rating'
  })

  useEffect(() => {
    setIsLoading(true)

    const category = categoryID ? `category=${categoryID}` : ''
    const sortBy = sort.sortProperty.replace('-', '')
    const order = sort.sortProperty.includes('-') ? 'asc' : 'desc'

    const url = `https://64490aa9b88a78a8f0fb660a.mockapi.io/pizzas/items?${category}&sortBy=${sortBy}&order=${order}`

    fetch(url)
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        setItems(data)
        setIsLoading(false)
      })
    window.scrollTo(0, 0)
  }, [categoryID, sort])

  return (
    <div className="container">
      <div className="content__top">
        <Categories value={categoryID} onChangeCategory={(id) => setCategoryID(id)} />
        <Sort value={sort} onChangeSort={(id) => setSort(id)} />
      </div>
      <h2 className="content__title">Все пиццы</h2>
      <div className="content__items">
        {isLoading
          ? [...new Array(6)].map((_, index) => <Sceleton key={index} />)
          : items.map((obj) => <PizzaBlock key={obj.id} {...obj} />)}
      </div>
    </div>
  )
}
export default Home