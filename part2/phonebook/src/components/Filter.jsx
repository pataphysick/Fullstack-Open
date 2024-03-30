const Filter = (props) => {
  return (
    <p>Filter shown with <input value={props.filter} onChange={props.handleFilterChange} /></p>
  )
}

export default Filter
