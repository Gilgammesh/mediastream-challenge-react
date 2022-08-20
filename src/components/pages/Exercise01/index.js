/**
 * Exercise 01: The Retro Movie Store
 * Implement a shopping cart with the next features for the Movie Store that is selling retro dvds:
 * 1. Add a movie to the cart
 * 2. Increment or decrement the quantity of movie copies. If quantity is equal to 0, the movie must be removed from the cart
 * 3. Calculate and show the total cost of your cart. Ex: Total: $150
 * 4. Apply discount rules. You have an array of offers with discounts depending of the combination of movie you have in your cart.
 * You have to apply all discounts in the rules array (discountRules).
 * Ex: If m: [1, 2, 3], it means the discount will be applied to the total when the cart has all that products in only.
 *
 * You can modify all the code, this component isn't well designed intentionally. You can redesign it as you need.
 */

import './assets/styles.css'
import { useState, useEffect } from 'react'
import { movies, discountRules } from './data'

export default function Exercise01() {
  const [cart, setCart] = useState([])
  const [discount, setDiscount] = useState(0)

  // Check cart for apply discount
  useEffect(() => {
    setDiscount(0)
    const cartIds = cart.map(c => c.id).sort()
    discountRules.forEach(d => {
      if (JSON.stringify(d.m.sort()) === JSON.stringify(cartIds)) {
        setDiscount(d.discount)
      }
    })
  }, [cart])

  const addCart = movie => {
    const existMovie = cart.some(c => c.id === movie.id)
    // Only added a movie that is not in the cart.
    if (!existMovie) {
      setCart([
        ...cart,
        {
          ...movie,
          quantity: 1
        }
      ])
    }
  }

  const decrementQuantity = movie => {
    // If quantity equals to 1, remove the movie from the cart
    if (movie.quantity === 1) {
      const newCart = cart.slice().filter(c => c.id !== movie.id)
      setCart(newCart)
    } else {
      const newCart = cart.slice().map(c => {
        if (c.id === movie.id) {
          return { ...c, quantity: movie.quantity - 1 }
        }
        return c
      })
      setCart(newCart)
    }
  }

  const incrementQuantity = movie => {
    const newCart = cart.slice().map(c => {
      if (c.id === movie.id) {
        return { ...c, quantity: movie.quantity + 1 }
      }
      return c
    })
    setCart(newCart)
  }

  const getTotal = () => {
    const total = cart.reduce((t, m) => t + m.price * m.quantity, 0)
    if (discount > 0) return total * discount
    return total
  }

  return (
    <section className="exercise01">
      <div className="movies__list">
        <ul>
          {movies.map(m => (
            <li key={m.id} className="movies__list-card">
              <ul>
                <li>ID: {m.id}</li>
                <li>Name: {m.name}</li>
                <li>Price: ${m.price}</li>
              </ul>
              <button onClick={() => addCart(m)}>Add to cart</button>
            </li>
          ))}
        </ul>
      </div>
      <div className="movies__cart">
        <ul>
          {cart.map(c => (
            <li key={c.id} className="movies__cart-card">
              <ul>
                <li>ID: {c.id}</li>
                <li>Name: {c.name}</li>
                <li>Price: ${c.price}</li>
              </ul>
              <div className="movies__cart-card-quantity">
                <button onClick={() => decrementQuantity(c)}>-</button>
                <span>{c.quantity}</span>
                <button onClick={() => incrementQuantity(c)}>+</button>
              </div>
            </li>
          ))}
        </ul>
        {discount > 0 && (
          <div className="movies__cart-total">
            <p>You have a discount of: {discount}</p>
          </div>
        )}
        <div className="movies__cart-total">
          <p>Total: ${getTotal()}</p>
        </div>
      </div>
    </section>
  )
}
