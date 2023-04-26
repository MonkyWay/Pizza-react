import { useState } from "react"

const Categories = () => {
  const [activeIndex, setActiveIndex] = useState(0)

  const onClickCategory = (index) => {
    setActiveIndex(index)
  }

  const categories = ['Все', 'Мясные', 'Вегетарианские', 'Гриль', 'Острые', 'Закрытые']

  return (
    <div className="categories">
      <ul>
        {categories.map((value, index) => (
          <li
            key={index}
            onClick={() => onClickCategory(index)}
            className={activeIndex === index ? 'active' : ''}>
            {value}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Categories