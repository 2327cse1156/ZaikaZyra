import React from 'react'

function AddItem() {
  return (
    <div>
      <h1>Add Food Item</h1>
      <form>
        <div>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" required />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea id="description" name="description" required></textarea>
        </div>
        <div>
          <label htmlFor="price">Price:</label>
          <input type="number" id="price" name="price" required />
        </div>
        <button type="submit">Add Item</button>
      </form>
    </div>
  )
}

export default AddItem
