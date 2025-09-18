import React from 'react'

function OwnerOrderCard({data}) {
  return (
    <div>
      <h2>{data.user.fullName}</h2>
    </div>
  )
}

export default OwnerOrderCard
