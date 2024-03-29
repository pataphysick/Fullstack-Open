const Header = (props) => {
  return (
    <h2>{props.course}</h2>
  )
}

const Content = (props) => {
  return (
    <>
      {props.parts.map(part => <Part key={part.id} part={part} />)}
    </>
  )
}

const Part = ({part}) => {
  return (
    <p>{part.name}: {part.exercises}</p>
  )
}

const Total = ({parts}) => {
  const total = parts.reduce((acc, curr) => acc + curr.exercises, 0)
  return (
    <strong>Total of {total} exercises</strong>
  )
}

const Course = ({course}) => {
  return (
    <>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </>
  )
}

export default Course
