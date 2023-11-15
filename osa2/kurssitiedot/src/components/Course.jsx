const Course = ({ courses }) => {
    return (
      <div>
        {courses.map( course =>
          <div key={course.id}>
            <Header courseName={course.name} />
            <Content parts={course.parts} />
            <Total parts={course.parts} />
          </div>
          )}
      </div>
    )
  }
  
const Header = ({ courseName }) => {
return(
    <div>
        <h1>{courseName}</h1>
    </div>
    )
}

const Content = ({ parts }) => {
return(
    <div>
        {parts.map(part => 
        <Part key={part.id} part={part} />
        )}
    </div>
    )
}

const Total = ({ parts }) => {
const total = parts.reduce( (accumulator, part) => accumulator + part.exercises, 0)
return(
    <div>
        <p>Number of exercises {total}</p>
    </div>
    )
}

const Part = ({ part }) => {
return(
    <div>
        <p>{part.name} {part.exercises}</p>
    </div>
    )
}

export default Course